/**
 * eslint-plugin-design-system — Design system enforcement rules.
 *
 * Local plugin (not published). Enforces semantic token usage,
 * approved interaction patterns, and prevents design drift.
 *
 * Rules:
 *   no-hardcoded-colors         — no #hex, rgb(), oklch() in className
 *   no-raw-scale-colors         — no bg-red-500, text-emerald-600 etc.
 *   no-banned-arbitrary-font-sizes — text-[10px] → text-2xs
 *   approved-hover-patterns     — whitelist of allowed hover:bg-*
 *   no-inline-color-styles      — no style={{ color: "#fff" }}
 *   no-raw-container-width     — max-w-5xl → max-w-(--max-w-content)
 *   no-inline-empty-state      — use <Empty> component, not inline border-dashed
 *   text-xs-line-height        — text-xs descriptions need leading-normal
 *   no-dots-three-horizontal   — DotsThreeIcon → DotsThreeVerticalIcon
 */

const noHardcodedColors = require("./rules/no-hardcoded-colors");
const noRawScaleColors = require("./rules/no-raw-scale-colors");
const noBannedArbitraryFontSizes = require("./rules/no-banned-arbitrary-font-sizes");
const approvedHoverPatterns = require("./rules/approved-hover-patterns");
const noInlineColorStyles = require("./rules/no-inline-color-styles");
const noRawContainerWidth = require("./rules/no-raw-container-width");
const noInlineEmptyState = require("./rules/no-inline-empty-state");
const textXsLineHeight = require("./rules/text-xs-line-height");
const noDotsThreeHorizontal = require("./rules/no-dots-three-horizontal");

module.exports = {
  rules: {
    "no-hardcoded-colors": noHardcodedColors,
    "no-raw-scale-colors": noRawScaleColors,
    "no-banned-arbitrary-font-sizes": noBannedArbitraryFontSizes,
    "approved-hover-patterns": approvedHoverPatterns,
    "no-inline-color-styles": noInlineColorStyles,
    "no-raw-container-width": noRawContainerWidth,
    "no-inline-empty-state": noInlineEmptyState,
    "text-xs-line-height": textXsLineHeight,
    "no-dots-three-horizontal": noDotsThreeHorizontal,
  },
};
