/**
 * no-dots-three-horizontal
 *
 * Enforces DotsThreeVerticalIcon over DotsThreeIcon across the codebase.
 * The horizontal three-dots (⋯) is banned; always use the vertical variant (⋮).
 */

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow DotsThreeIcon — use DotsThreeVerticalIcon instead",
    },
    fixable: "code",
    messages: {
      useVertical:
        'Use "DotsThreeVerticalIcon" instead of "DotsThreeIcon". The vertical three-dots icon (⋮) is the standard across the design system.',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportSpecifier(node) {
        if (
          node.imported &&
          node.imported.name === "DotsThreeIcon" &&
          node.parent &&
          node.parent.source &&
          node.parent.source.value === "@phosphor-icons/react"
        ) {
          context.report({
            node,
            messageId: "useVertical",
            fix(fixer) {
              return fixer.replaceText(node.imported, "DotsThreeVerticalIcon");
            },
          });
        }
      },
    };
  },
};
