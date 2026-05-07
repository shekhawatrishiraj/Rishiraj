/**
 * @fileoverview Enforce use of the --max-w-content design token for page container widths.
 *
 * Bans common Tailwind max-width classes used for page-level containers
 * (max-w-4xl, max-w-5xl, max-w-6xl, max-w-7xl, max-w-screen-*).
 * Pages should use <ContentContainer> or max-w-(--max-w-content) instead.
 *
 * Small component widths (max-w-sm, max-w-md, max-w-lg, max-w-xs) are allowed
 * since those are typically used for dialogs, popovers, and other non-page containers.
 */

const BANNED_CLASSES = [
  "max-w-4xl",
  "max-w-5xl",
  "max-w-6xl",
  "max-w-7xl",
  "max-w-screen-sm",
  "max-w-screen-md",
  "max-w-screen-lg",
  "max-w-screen-xl",
  "max-w-screen-2xl",
];

// Build a regex that matches any of the banned classes as whole words
const BANNED_RE = new RegExp(
  `(?:^|\\s)(${BANNED_CLASSES.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?:\\s|$)`
);

function findBanned(value) {
  if (typeof value !== "string") return null;
  const match = value.match(BANNED_RE);
  return match ? match[1] : null;
}

function buildMessage(found) {
  return `[design-system/no-raw-container-width] Raw container width "${found}" — use the design token instead.

Fix: Use <ContentContainer> component, or replace "${found}" with "max-w-(--max-w-content)"
  Token: --max-w-content (defined in globals.css)
  Component: src/components/content-container.tsx`;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce --max-w-content token for page container widths instead of raw Tailwind max-w classes",
    },
    schema: [],
    messages: {
      bannedContainerWidth: "{{ message }}",
    },
  },
  create(context) {
    function checkValue(node, value) {
      const found = findBanned(value);
      if (found) {
        context.report({
          node,
          messageId: "bannedContainerWidth",
          data: { message: buildMessage(found) },
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
