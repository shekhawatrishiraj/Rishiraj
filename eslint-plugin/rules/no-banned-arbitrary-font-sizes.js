/**
 * @fileoverview Disallow arbitrary font sizes that have design token equivalents.
 * Only bans specific sizes where tokens exist — not a blanket ban.
 */

const BANNED_FONT_SIZES = {
  "text-[10px]": "text-2xs",
  "text-[0.625rem]": "text-2xs",
  "text-[11px]": "text-xs-plus",
  "text-[0.6875rem]": "text-xs-plus",
};

const BANNED_KEYS = Object.keys(BANNED_FONT_SIZES);

function findBanned(value) {
  if (typeof value !== "string") return null;
  for (const banned of BANNED_KEYS) {
    if (value.includes(banned)) {
      return { found: banned, replacement: BANNED_FONT_SIZES[banned] };
    }
  }
  return null;
}

function buildMessage(found, replacement) {
  return `[design-system/no-banned-arbitrary-font-sizes] Arbitrary font size "${found}" has a design token equivalent.

Fix: Replace "${found}" with "${replacement}"
  Token defined in: src/app/globals.css (@theme inline)
  - text-2xs = 0.625rem (10px)
  - text-xs-plus = 0.6875rem (11px)

Note: Arbitrary font sizes like text-[38px] for display headings are allowed.
This rule only bans sizes where a design token exists.`;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow arbitrary font sizes that have design token equivalents",
    },
    schema: [],
    messages: {
      bannedFontSize: "{{ message }}",
    },
  },
  create(context) {
    function checkValue(node, value) {
      const result = findBanned(value);
      if (result) {
        context.report({
          node,
          messageId: "bannedFontSize",
          data: { message: buildMessage(result.found, result.replacement) },
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
