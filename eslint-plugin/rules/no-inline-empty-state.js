/**
 * @fileoverview Enforce using the Empty component instead of inline empty states.
 *
 * Detects `border-dashed` containers that look like hand-rolled empty states
 * and suggests using `<Empty>` from `@/components/ui/empty` instead.
 *
 * Ignores files inside `src/components/ui/` (primitives).
 */

const COMPONENT_PATH = "src/components/ui/";

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce <Empty> component instead of inline border-dashed empty states",
    },
    messages: {
      useEmptyComponent:
        'Use the <Empty> component from "@/components/ui/empty" instead of an inline empty state. Pattern: <Empty> → <EmptyIcon> → <EmptyTitle> → <EmptyDescription> → <EmptyAction>(optional).',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip UI primitives
    if (filename.includes(COMPONENT_PATH)) return {};

    return {
      JSXAttribute(node) {
        if (
          node.name.name !== "className" ||
          !node.value
        )
          return;

        // Get the raw string value
        let raw = "";
        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          raw = node.value.value;
        } else if (
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression.type === "TemplateLiteral" &&
          node.value.expression.quasis.length === 1
        ) {
          raw = node.value.expression.quasis[0].value.raw;
        }

        if (!raw) return;

        // Must have border-dashed — the signature of an empty state container
        if (!raw.includes("border-dashed")) return;

        // Must be a vertical centered layout (empty states use flex-col + centering)
        if (!raw.includes("flex-col")) return;
        if (!raw.includes("items-center") || !raw.includes("justify-center")) return;

        // Check parent is a <div>, not an <Empty>
        const parent = node.parent;
        if (
          parent.type !== "JSXOpeningElement" ||
          parent.name.type !== "JSXIdentifier" ||
          parent.name.name !== "div"
        ) {
          return;
        }

        context.report({
          node: parent,
          messageId: "useEmptyComponent",
        });
      },
    };
  },
};
