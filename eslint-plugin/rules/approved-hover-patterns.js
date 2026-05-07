/**
 * @fileoverview Enforce approved hover:bg-* patterns only.
 * Global patterns allowed everywhere. Dark-surface patterns file-scoped.
 */

const APPROVED_GLOBAL = new Set([
  "hover:bg-accent",
  "hover:bg-accent/50",
  "hover:bg-muted",
  "hover:bg-muted/50",
  "hover:bg-muted/80",
  "hover:bg-primary/5",
  "hover:bg-primary/10",
  "hover:bg-primary/20",
  "hover:bg-primary/80",
  "hover:bg-primary/90",
  "hover:bg-sidebar-accent",
  "hover:bg-destructive/10",
  "hover:bg-destructive/80",
  "hover:bg-destructive/90",
  "hover:bg-transparent",
  "hover:bg-background",
  "hover:bg-photo-overlay",
  "hover:bg-photo-overlay-hover",
  "hover:bg-input/50",
  "hover:bg-foreground/10",
  "hover:bg-overlay",
  "hover:bg-muted-foreground/10",
  "hover:bg-muted-foreground/20",
  "hover:bg-primary/15",
  "hover:bg-destructive/20",
]);

// File-scoped: only allowed in specific dark-surface files
const DARK_SURFACE_PATTERNS = new Set([
  "hover:bg-white/5",
  "hover:bg-white/10",
  "hover:bg-white/15",
  "hover:bg-zinc-800",
]);

const DARK_SURFACE_FILES = [
  "persona-switcher.tsx",
  "terminal.tsx",
  "annotation-overlay.tsx",
  "dev/states/page.tsx",
];

// Extract all hover:bg-* classes from a string
const HOVER_BG_PATTERN = /(?:^|\s)((?:(?:dark|group-hover|group-hover\/\w+|focus|sm|md|lg|xl|2xl):)*hover:bg-[a-z0-9/_-]+)/g;

function isDarkSurfaceFile(filename) {
  return DARK_SURFACE_FILES.some((f) => filename.endsWith(f));
}

function buildMessage(violating, filename) {
  const isDark = isDarkSurfaceFile(filename);
  const darkNote = isDark
    ? ""
    : `\n  Dark-surface patterns (hover:bg-white/*) are only allowed in: ${DARK_SURFACE_FILES.join(", ")}`;

  return `[design-system/approved-hover-patterns] Non-approved hover pattern: "${violating}"

Approved hover:bg-* patterns:
  hover:bg-accent, hover:bg-accent/50       → default interactive elements
  hover:bg-muted, hover:bg-muted/50         → list rows, toolbar buttons
  hover:bg-primary/5, /10, /20              → card hover (primary tint)
  hover:bg-primary/80, /90                  → CTA button hover
  hover:bg-sidebar-accent                   → sidebar items
  hover:bg-destructive/10                   → destructive action hover
  hover:bg-photo-overlay                    → overlays on user images
  hover:bg-transparent                      → ghost/reset states
  hover:bg-background                       → reset to page background
  hover:bg-input/50, hover:bg-foreground/10 → subtle input hover${darkNote}

Fix: Replace with the closest approved pattern above.
Reference: ui/eslint-plugin/rules/approved-hover-patterns.js`;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce approved hover:bg-* patterns — whitelist only",
    },
    schema: [],
    messages: {
      unapprovedHover: "{{ message }}",
    },
  },
  create(context) {
    const filename = context.getFilename();

    function checkValue(node, value) {
      if (typeof value !== "string") return;
      let match;
      HOVER_BG_PATTERN.lastIndex = 0;
      while ((match = HOVER_BG_PATTERN.exec(value)) !== null) {
        const hoverClass = match[1];
        // Strip variant prefixes (dark:, group-hover:) to check the base pattern
        const baseClass = hoverClass.replace(/^(?:(?:dark|group-hover|group-hover\/\w+|focus|sm|md|lg|xl|2xl):)*/, "");

        if (APPROVED_GLOBAL.has(baseClass)) continue;

        if (DARK_SURFACE_PATTERNS.has(baseClass) && isDarkSurfaceFile(filename)) continue;

        context.report({
          node,
          messageId: "unapprovedHover",
          data: { message: buildMessage(hoverClass, filename) },
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
