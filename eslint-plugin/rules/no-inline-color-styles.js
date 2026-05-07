/**
 * @fileoverview Disallow hardcoded color values in inline style props.
 * Catches style={{ color: "#fff", backgroundColor: "rgb(...)" }} etc.
 * Allows CSS variable references and dynamic expressions.
 */

const COLOR_STYLE_PROPS = new Set([
  "color",
  "backgroundColor",
  "background",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "fill",
  "stroke",
  "caretColor",
  "textDecorationColor",
  "columnRuleColor",
]);

// Matches hardcoded color literals
const HARDCODED_COLOR = /^(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch)\(|black$|white$|red$|blue$|green$|transparent$)/;

// Allow CSS var references
const CSS_VAR_REFERENCE = /^var\(--/;

function buildMessage(prop, value) {
  return `[design-system/no-inline-color-styles] Hardcoded color in inline style: ${prop}="${value}"

Fix options:
  1. Use className instead: bg-primary, text-destructive, border-warning, etc.
  2. Use CSS variable: style={{ ${prop}: "var(--primary)" }}
  3. If this is a dynamic user-provided color (avatar, chart), add:
     // eslint-disable-next-line design-system/no-inline-color-styles -- dynamic user color

Note: style={{ ${prop}: someVariable }} is fine — only string literals are flagged.
Reference: src/app/globals.css`;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded color values in inline style props",
    },
    schema: [],
    messages: {
      inlineColor: "{{ message }}",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== "style") return;
        if (!node.value || node.value.type !== "JSXExpressionContainer") return;

        const expr = node.value.expression;
        if (expr.type !== "ObjectExpression") return;

        for (const prop of expr.properties) {
          if (prop.type !== "Property") continue;
          if (prop.computed) continue;

          const propName = prop.key.name || prop.key.value;
          if (!COLOR_STYLE_PROPS.has(propName)) continue;

          // Only flag string literals
          if (prop.value.type !== "Literal" || typeof prop.value.value !== "string") continue;

          const value = prop.value.value;

          // Allow CSS var references
          if (CSS_VAR_REFERENCE.test(value)) continue;

          // Flag hardcoded colors
          if (HARDCODED_COLOR.test(value)) {
            context.report({
              node: prop,
              messageId: "inlineColor",
              data: { message: buildMessage(propName, value) },
            });
          }
        }
      },
    };
  },
};
