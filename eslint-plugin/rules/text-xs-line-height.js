/**
 * @fileoverview Enforce leading-normal on multi-line text-xs descriptions.
 *
 * The Tailwind default line-height for text-xs is 1rem (ratio 1.33),
 * which is too tight for multi-line body copy. This rule detects text-xs
 * used with description-like patterns (text-pretty, text-muted-foreground)
 * and requires leading-normal (ratio 1.5).
 *
 * Single-line labels (e.g. in badges, table cells) are not flagged.
 */

/** Patterns that indicate multi-line description text */
const DESCRIPTION_SIGNALS = ["text-pretty", "text-muted-foreground"];

/** Acceptable leading overrides — any of these silences the rule */
const ACCEPTED_LEADINGS = [
  "leading-normal",
  "leading-relaxed",
  "leading-loose",
  "leading-[",
];

function hasTextXs(value) {
  // Match text-xs but not text-xs-plus or text-xs-*
  return /\btext-xs\b/.test(value) && !value.includes("text-xs-plus");
}

function hasDescriptionSignal(value) {
  return DESCRIPTION_SIGNALS.some((signal) => value.includes(signal));
}

function hasLeadingOverride(value) {
  return ACCEPTED_LEADINGS.some((leading) => value.includes(leading));
}

function checkValue(context, node, value) {
  if (typeof value !== "string") return;
  if (
    hasTextXs(value) &&
    hasDescriptionSignal(value) &&
    !hasLeadingOverride(value)
  ) {
    context.report({ node, messageId: "missingLeading" });
  }
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce leading-normal on multi-line text-xs descriptions",
    },
    schema: [],
    messages: {
      missingLeading: `[design-system/text-xs-line-height] Multi-line text-xs description is missing line-height override.

Fix: Add "leading-normal" to the className.
  text-xs default line-height is 1.33 ratio — too tight for body copy.
  leading-normal sets 1.5 ratio for better readability.

Note: Single-line labels (badges, table cells) don't need this.
This rule only flags text-xs used with description patterns (text-pretty, text-muted-foreground).`,
    },
  },
  create(context) {
    function checkExpression(node) {
      if (node.type === "Literal" && typeof node.value === "string") {
        checkValue(context, node, node.value);
      }
      if (node.type === "TemplateLiteral") {
        // Combine all quasis to check the full string
        const full = node.quasis.map((q) => q.value.raw).join("");
        checkValue(context, node, full);
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
        if (!node.value) return;
        if (node.value.type === "Literal") {
          checkValue(context, node, node.value.value);
        }
        if (node.value.type === "JSXExpressionContainer") {
          checkExpression(node.value.expression);
        }
      },
    };
  },
};
