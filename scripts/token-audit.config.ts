export const config = {
  // Directories to scan
  scanDirs: ['src'],
  // File extensions to scan
  extensions: ['.tsx'],
  // Files/patterns to exclude entirely
  excludeFiles: [
    'src/components/ui/chart.tsx', // recharts requires hex colors in theme config
    'src/components/persona-switcher.tsx', // dev tool — intentional dark surface
    'src/components/annotation-overlay.tsx', // dev tool — intentional dark surface
    'src/components/feedback-fab.tsx', // dev tool — dark floating button
    'src/app/dev/', // dev tools — intentional raw colors
    'src/app/welcome/celebration/', // confetti canvas — intentionally raw
    'src/app/exp2/', // experimental page — raw prototyping
  ],
  // Directories to exclude entirely (prefix match)
  excludeDirs: [
    'src/components/ui/', // shadcn primitives — not ours to audit
  ],
  // Specific patterns to allowlist (file:pattern pairs)
  allowlist: [
    // SVG attributes
    { pattern: /fill="(currentColor|none|url\()/, reason: 'SVG standard values' },
    { pattern: /stroke="(currentColor|none)"/, reason: 'SVG standard values' },
    // Dynamic computed styles
    { pattern: /style=\{\{.*paddingLeft/, reason: 'Computed dynamic values' },
    { pattern: /style=\{\{.*transform/, reason: 'Animation computed values' },
    // Dark mode prefixed
    { pattern: /dark:(bg|text|border)-(white|black)/, reason: 'Dark mode override' },
    // Evaluated arbitrary values — intentional, not worth tokenizing
    { pattern: /h-\[142px\]/, reason: 'Expert card fixed height — component-specific' },
    { pattern: /text-\[13px\]/, reason: 'Sub-scale font size for dense UI — between xs and sm' },
    { pattern: /rounded-\[2px\]/, reason: 'Chart indicator dot rounding — recharts convention' },
    { pattern: /top-\[50%\]/, reason: 'CSS centering technique' },
    { pattern: /left-\[50%\]/, reason: 'CSS centering technique' },
    { pattern: /min-w-\[8rem\]/, reason: 'Menu/dropdown min-width — shadcn convention' },
    // Data config hex colors (not in className)
    { pattern: /value: "#/, reason: 'Color data config — applied via inline style' },
    // Overlay scrim
    { pattern: /bg-black\//, reason: 'Scrim overlay with opacity — intentional' },
    // Transparent gradient stops
    { pattern: /#0000/, reason: 'CSS transparent (#0000) in gradient' },
    // text-white on solid-color buttons (destructive, primary)
    { pattern: /bg-destructive\s+text-white/, reason: 'Contrast pairing on destructive button' },
    { pattern: /hover:text-white/, reason: 'Hover contrast pairing on solid button' },
  ],
}
