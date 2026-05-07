/**
 * @fileoverview Disallow raw Tailwind color scale classes (e.g. bg-red-500).
 * Forces use of semantic design tokens (bg-destructive, bg-success, etc.)
 */

const TAILWIND_SCALE_FAMILIES = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime",
  "green", "emerald", "teal", "cyan", "sky",
  "blue", "indigo", "violet", "purple", "fuchsia",
  "pink", "rose",
];

const familyPattern = TAILWIND_SCALE_FAMILIES.join("|");

// Matches: bg-red-500, text-emerald-600/70, border-amber-200, hover:bg-red-100, dark:text-amber-400
const RAW_SCALE_PATTERN = new RegExp(
  `(?:^|\\s|:)(?:bg|text|border|ring|shadow|fill|stroke|from|via|to|outline|decoration)-(?:${familyPattern})-\\d{2,3}(?:\\/\\d+)?`
);

const SEMANTIC_MAP = {
  red: "destructive (bg-destructive, text-destructive, bg-destructive-surface)",
  orange: "warning (bg-warning, text-warning-foreground, bg-warning-muted)",
  amber: "warning (bg-warning, text-warning-foreground, bg-warning-muted)",
  yellow: "warning (bg-warning, text-warning-foreground)",
  green: "success (bg-success, text-success, bg-success-surface)",
  emerald: "success (bg-success, text-success, bg-success-surface)",
  teal: "success (bg-success) or info (bg-info)",
  cyan: "info (bg-info, text-info, bg-info-surface)",
  sky: "info (bg-info, text-info, bg-info-surface)",
  blue: "info (bg-info, text-info, bg-info-surface) or primary (bg-primary)",
  indigo: "primary (bg-primary, text-primary)",
  violet: "primary (bg-primary, text-primary)",
  purple: "primary (bg-primary, text-primary)",
  fuchsia: "primary (bg-primary) or accent (bg-accent)",
  pink: "destructive (bg-destructive) or accent (bg-accent)",
  rose: "destructive (bg-destructive, bg-destructive-surface)",
  slate: "muted (bg-muted, text-muted-foreground, bg-accent)",
  gray: "muted (bg-muted, text-muted-foreground, bg-accent)",
  zinc: "muted (bg-muted, text-muted-foreground, bg-accent)",
  neutral: "muted (bg-muted, text-muted-foreground, bg-accent)",
  stone: "muted (bg-muted, text-muted-foreground, bg-accent)",
  lime: "success (bg-success)",
};

function extractFamily(match) {
  for (const family of TAILWIND_SCALE_FAMILIES) {
    if (match.includes(`-${family}-`)) return family;
  }
  return null;
}

function buildMessage(violating) {
  const family = extractFamily(violating);
  const suggestion = family ? SEMANTIC_MAP[family] : "the appropriate semantic token";

  return `[design-system/no-raw-scale-colors] Raw Tailwind palette color "${violating}" used instead of a semantic token.

Fix: Replace with ${suggestion}.
  - Green/emerald → bg-success, text-success, bg-success-surface
  - Red/rose → bg-destructive, text-destructive, bg-destructive-surface
  - Amber/yellow/orange → bg-warning, text-warning-foreground, bg-warning-muted
  - Blue/sky/cyan → bg-info, text-info, bg-info-surface
  - Gray/slate/zinc → bg-muted, text-muted-foreground, bg-accent

If no semantic token fits, add one to globals.css before using raw scale colors.
Reference: src/app/globals.css`;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw Tailwind color scale classes — use semantic tokens",
    },
    schema: [],
    messages: {
      rawScaleColor: "{{ message }}",
    },
  },
  create(context) {
    function checkValue(node, value) {
      if (typeof value !== "string") return;
      const match = value.match(RAW_SCALE_PATTERN);
      if (match) {
        context.report({
          node,
          messageId: "rawScaleColor",
          data: { message: buildMessage(match[0].trim()) },
        });
      }
    }

    function checkExpression(node) {
      if (node.type === "Literal" && typeof node.value === "string") {
        checkValue(node, node.value);
      }
      if (node.type === "TemplateLiteral") {
        for (const quasi of node.quasis) {
          checkValue(node, quasi.value.raw);
        }
        for (const expr of node.expressions) {
          checkExpression(expr);
        }
      }
      if (node.type === "ArrayExpression") {
        for (const element of node.elements) {
          if (element) checkExpression(element);
        }
      }
      if (node.type === "CallExpression") {
        for (const arg of node.arguments) {
          checkExpression(arg);
        }
      }
      if (node.type === "ConditionalExpression") {
        checkExpression(node.consequent);
        checkExpression(node.alternate);
      }
      if (node.type === "LogicalExpression") {
        checkExpression(node.right);
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== "className") return;
        if (node.value) {
          if (node.value.type === "Literal") {
            checkValue(node, node.value.value);
          }
          if (node.value.type === "JSXExpressionContainer") {
            checkExpression(node.value.expression);
          }
        }
      },
    };
  },
};
