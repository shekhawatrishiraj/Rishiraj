/**
 * @fileoverview Disallow hardcoded color values in className attributes.
 * Catches #hex, rgb(), rgba(), oklch() literals in Tailwind arbitrary value brackets.
 * CSS variable references like bg-[var(--my-token)] are allowed.
 *
 * NOTE: This rule does NOT catch standard Tailwind classes like text-white, bg-black/50.
 * Those are handled by no-raw-scale-colors if needed.
 */

const HARDCODED_COLOR_IN_ARBITRARY = /(?:bg|text|border|ring|shadow|fill|stroke|from|via|to|outline|decoration)-\[(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|oklch|hsl|hsla)\()/;

function checkStringForViolation(value) {
  if (HARDCODED_COLOR_IN_ARBITRARY.test(value)) {
    const match = value.match(HARDCODED_COLOR_IN_ARBITRARY);
    return match ? match[0] : null;
  }
  return null;
}

function buildMessage(violating) {
  return `[design-system/no-hardcoded-colors] Hardcoded color value "${violating}" found in className.

Fix: Replace with a semantic token from globals.css.
  - For primary tints: bg-primary/10, bg-primary/20, text-primary, etc.
  - For status surfaces: bg-success-surface, bg-destructive-surface, bg-info-surface
  - For overlays: bg-overlay (modal scrim), bg-photo-overlay (on images)
  - For dark backgrounds: bg-foreground/60 instead of bg-black/60

Note: bg-[var(--my-token)] is allowed — only literal color values are flagged.
Reference: src/app/globals.css`;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded color values in className — use design tokens instead",
    },
    schema: [],
    messages: {
      hardcodedColor: "{{ message }}",
    },
  },
  create(context) {
    function checkValue(node, value) {
      if (typeof value !== "string") return;
      const violating = checkStringForViolation(value);
      if (violating) {
        context.report({
          node,
          messageId: "hardcodedColor",
          data: { message: buildMessage(violating) },
        });
      }
    }

    function checkExpression(node) {
      // String literal
      if (node.type === "Literal" && typeof node.value === "string") {
        checkValue(node, node.value);
      }
      // Template literal
      if (node.type === "TemplateLiteral") {
        for (const quasi of node.quasis) {
          checkValue(node, quasi.value.raw);
        }
        for (const expr of node.expressions) {
          checkExpression(expr);
        }
      }
      // Array arguments
      if (node.type === "ArrayExpression") {
        for (const element of node.elements) {
          if (element) checkExpression(element);
        }
      }
      // cn(), clsx() call — check all string arguments
      if (node.type === "CallExpression") {
        for (const arg of node.arguments) {
          checkExpression(arg);
        }
      }
      // Logical/conditional expressions
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
