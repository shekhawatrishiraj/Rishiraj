/**
 * AST scanner that extracts persona/scenario/volume conditional branches
 * from page files and outputs a state-map.json for the dev dashboard.
 *
 * Run: npx tsx scripts/extract-state-map.ts
 */

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

// Types for the output
type Conditional = {
  line: number;
  axis: "flags" | "scenario" | "persona" | "volume";
  key: string;
  scope?: string;
  expression: string;
  isLegacy: boolean;
};

type PageEntry = {
  file: string;
  conditionals: Conditional[];
};

type StateMap = {
  generatedAt: string;
  pages: Record<string, PageEntry>;
  summary: {
    flagsUsed: string[];
    flagsUnused: string[];
    scenariosUsed: string[];
    scenariosUnused: string[];
    legacyCount: number;
  };
};

const ALL_FLAGS = [
  "hasCompletedOnboarding",
  "hasMeetings",
  "hasConnections",
  "hasKnowledgeSources",
];

const ALL_SCENARIOS = ["none", "error", "loading"];

function extractConditionals(filePath: string): Conditional[] {
  const source = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true
  );

  const conditionals: Conditional[] = [];

  // Track destructured flag variables: const { hasConnections } = flags
  const flagAliases = new Set<string>();

  function getLineNumber(pos: number): number {
    return sourceFile.getLineAndCharacterOfPosition(pos).line + 1;
  }

  function getNodeText(node: ts.Node): string {
    return node.getText(sourceFile).replace(/\s+/g, " ").slice(0, 100);
  }

  function visit(node: ts.Node) {
    // Detect destructured flags: const { hasConnections, ... } = flags
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isIdentifier(node.initializer) &&
      node.initializer.text === "flags" &&
      node.name &&
      ts.isObjectBindingPattern(node.name)
    ) {
      for (const el of node.name.elements) {
        if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) {
          flagAliases.add(el.name.text);
        }
      }
    }

    // Detect: flags.<key> property access in conditionals
    if (ts.isPropertyAccessExpression(node)) {
      if (
        ts.isIdentifier(node.expression) &&
        node.expression.text === "flags" &&
        ts.isIdentifier(node.name)
      ) {
        const key = node.name.text;
        if (ALL_FLAGS.includes(key)) {
          conditionals.push({
            line: getLineNumber(node.getStart(sourceFile)),
            axis: "flags",
            key,
            expression: getNodeText(node),
            isLegacy: false,
          });
        }
      }
    }

    // Detect: destructured flag variable used in conditions
    if (ts.isIdentifier(node) && flagAliases.has(node.text)) {
      // Only count if it's in a conditional context (if, ternary, &&)
      const parent = node.parent;
      if (
        parent &&
        (ts.isIfStatement(parent) ||
          ts.isConditionalExpression(parent) ||
          ts.isPrefixUnaryExpression(parent) ||
          (ts.isBinaryExpression(parent) &&
            (parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
              parent.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
              parent.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
              parent.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken)))
      ) {
        conditionals.push({
          line: getLineNumber(node.getStart(sourceFile)),
          axis: "flags",
          key: node.text,
          expression: getNodeText(parent),
          isLegacy: false,
        });
      }
    }

    // Detect: scenario === "<value>" comparisons
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
        node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken)
    ) {
      const left = node.left;
      const right = node.right;

      // scenario === "value"
      if (ts.isIdentifier(left) && left.text === "scenario" && ts.isStringLiteral(right)) {
        conditionals.push({
          line: getLineNumber(node.getStart(sourceFile)),
          axis: "scenario",
          key: right.text,
          expression: getNodeText(node),
          isLegacy: false,
        });
      }

      // persona === "value" — legacy
      if (ts.isIdentifier(left) && left.text === "persona" && ts.isStringLiteral(right)) {
        conditionals.push({
          line: getLineNumber(node.getStart(sourceFile)),
          axis: "persona",
          key: right.text,
          expression: getNodeText(node),
          isLegacy: true,
        });
      }

      // volume === "value"
      if (ts.isIdentifier(left) && left.text === "volume" && ts.isStringLiteral(right)) {
        conditionals.push({
          line: getLineNumber(node.getStart(sourceFile)),
          axis: "volume",
          key: right.text,
          expression: getNodeText(node),
          isLegacy: false,
        });
      }
    }

    // Detect: getScenario("scope") === "value"
    if (
      ts.isBinaryExpression(node) &&
      ts.isCallExpression(node.left) &&
      ts.isIdentifier(node.left.expression) &&
      node.left.expression.text === "getScenario" &&
      node.left.arguments.length === 1 &&
      ts.isStringLiteral(node.left.arguments[0]) &&
      ts.isStringLiteral(node.right)
    ) {
      conditionals.push({
        line: getLineNumber(node.getStart(sourceFile)),
        axis: "scenario",
        key: node.right.text,
        scope: (node.left.arguments[0] as ts.StringLiteral).text,
        expression: getNodeText(node),
        isLegacy: false,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Deduplicate by line+key
  const seen = new Set<string>();
  return conditionals.filter((c) => {
    const id = `${c.line}:${c.axis}:${c.key}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function findPageFiles(dir: string, base: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(fullPath, base));
    } else if (entry.name === "page.tsx") {
      results.push(path.relative(base, fullPath));
    }
  }
  return results;
}

async function main() {
  const appDir = path.resolve(__dirname, "../src/app");
  const pageFiles = findPageFiles(appDir, appDir);

  const pages: Record<string, PageEntry> = {};
  const allFlagsUsed = new Set<string>();
  const allScenariosUsed = new Set<string>();
  let legacyCount = 0;

  for (const relPath of pageFiles.sort()) {
    const fullPath = path.join(appDir, relPath);
    const conditionals = extractConditionals(fullPath);

    if (conditionals.length === 0) continue;

    const pageName = "/" + path.dirname(relPath).replace(/\\/g, "/");
    pages[pageName] = {
      file: `app/${relPath}`,
      conditionals,
    };

    for (const c of conditionals) {
      if (c.axis === "flags") allFlagsUsed.add(c.key);
      if (c.axis === "scenario") allScenariosUsed.add(c.key);
      if (c.isLegacy) legacyCount++;
    }
  }

  const stateMap: StateMap = {
    generatedAt: new Date().toISOString(),
    pages,
    summary: {
      flagsUsed: [...allFlagsUsed],
      flagsUnused: ALL_FLAGS.filter((f) => !allFlagsUsed.has(f)),
      scenariosUsed: [...allScenariosUsed],
      scenariosUnused: ALL_SCENARIOS.filter((s) => !allScenariosUsed.has(s)),
      legacyCount,
    },
  };

  const outPath = path.resolve(__dirname, "../src/app/dev/state-map.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(stateMap, null, 2));
  console.log(`State map written to ${outPath}`);
  console.log(`  Pages: ${Object.keys(pages).length}`);
  console.log(`  Flags used: ${stateMap.summary.flagsUsed.join(", ") || "none"}`);
  console.log(`  Flags unused: ${stateMap.summary.flagsUnused.join(", ") || "none"}`);
  console.log(`  Scenarios used: ${stateMap.summary.scenariosUsed.join(", ") || "none"}`);
  console.log(`  Legacy patterns: ${legacyCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
