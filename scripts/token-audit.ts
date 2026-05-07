import * as fs from 'fs'
import * as path from 'path'
import { config } from './token-audit.config'

// --- Types ---

interface Violation {
  file: string
  line: number
  match: string
  category: 'ERROR' | 'WARNING'
  rule: string
  suggestion: string
}

interface AuditReport {
  violations: Violation[]
  summary: {
    totalErrors: number
    totalWarnings: number
    filesByViolations: { file: string; count: number }[]
    commonPatterns: { pattern: string; count: number }[]
  }
}

// --- Patterns ---

const RAW_PALETTE_COLORS =
  'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

const ERROR_RULES: {
  name: string
  pattern: RegExp
  suggestion: (match: string) => string
}[] = [
  {
    name: 'hex-color',
    pattern: /#[0-9a-fA-F]{3,8}/g,
    suggestion: (m) => `${m} -> use a CSS variable or Tailwind semantic token`,
  },
  {
    name: 'raw-tailwind-palette',
    pattern: new RegExp(
      `(bg|text|border|ring|outline)-(${RAW_PALETTE_COLORS})-\\d+`,
      'g',
    ),
    suggestion: (m) => {
      const prefix = m.split('-')[0]
      const map: Record<string, string> = {
        bg: 'bg-background / bg-muted / bg-card',
        text: 'text-foreground / text-muted-foreground',
        border: 'border-border',
        ring: 'ring-ring',
        outline: 'outline-ring',
      }
      return `${m} -> ${map[prefix] || 'use semantic token'}`
    },
  },
  {
    name: 'raw-bw-without-dark',
    pattern: /(?<!dark:)(bg-white|bg-black|text-white|text-black)\b/g,
    suggestion: (m) => {
      const map: Record<string, string> = {
        'bg-white': 'bg-background',
        'bg-black': 'bg-foreground',
        'text-white': 'text-background (or text-primary-foreground)',
        'text-black': 'text-foreground',
      }
      return `${m} -> ${map[m] || 'use semantic token'}`
    },
  },
]

const ARBITRARY_VALUE_PREFIXES =
  'bg|text|border|w|h|min-w|max-w|min-h|max-h|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|rounded|z|leading|tracking|top|right|bottom|left|inset'

const WARNING_RULES: {
  name: string
  pattern: RegExp
  suggestion: (match: string) => string
}[] = [
  {
    name: 'arbitrary-tailwind-value',
    pattern: new RegExp(`(${ARBITRARY_VALUE_PREFIXES})-\\[\\d`, 'g'),
    suggestion: (m) => `${m}...] -> consider using a design token or spacing scale`,
  },
  {
    name: 'inline-style-visual',
    pattern:
      /style=\{\{[^}]*(color|background|border|margin|padding|fontSize|fontWeight|lineHeight|letterSpacing|gap|width|height|top|right|bottom|left)[^}]*\}\}/g,
    suggestion: (m) => {
      const prop = m.match(
        /(color|background|border|margin|padding|fontSize|fontWeight|lineHeight|letterSpacing|gap|width|height|top|right|bottom|left)/,
      )
      return `inline style with "${prop?.[0]}" -> prefer Tailwind classes or CSS variables`
    },
  },
]

// --- File collection ---

function collectFiles(baseDir: string): string[] {
  const files: string[] = []

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // Skip node_modules and hidden dirs
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        walk(fullPath)
      } else if (config.extensions.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  }

  for (const scanDir of config.scanDirs) {
    const resolved = path.resolve(baseDir, scanDir)
    if (fs.existsSync(resolved)) walk(resolved)
  }

  return files
}

// --- Allowlist check ---

function isAllowlisted(lineContent: string): boolean {
  return config.allowlist.some((entry) => entry.pattern.test(lineContent))
}

function isExcludedFile(relPath: string): boolean {
  const normalized = relPath.replace(/\\/g, '/')
  // Exact file match or prefix match (directory-style entries ending with /)
  if (config.excludeFiles.some(
    (excluded) => normalized === excluded || (excluded.endsWith('/') && normalized.startsWith(excluded)),
  )) return true
  // Directory prefix match
  if ((config as { excludeDirs?: string[] }).excludeDirs?.some(
    (dir: string) => normalized.startsWith(dir),
  )) return true
  return false
}

// --- Scanning ---

function scanFile(filePath: string, baseDir: string): Violation[] {
  const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/')
  if (isExcludedFile(relPath)) return []

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const violations: Violation[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Check error rules
    for (const rule of ERROR_RULES) {
      // Reset regex lastIndex
      rule.pattern.lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = rule.pattern.exec(line)) !== null) {
        // Check allowlist against full line
        if (isAllowlisted(line)) continue

        // For hex colors, skip if inside SVG fill/stroke with standard values
        if (rule.name === 'hex-color') {
          // Check if this hex is inside a fill or stroke attribute
          const before = line.substring(0, match.index)
          if (/fill=["']$/.test(before) || /stroke=["']$/.test(before)) continue
          // Skip hex in comments
          if (/^\s*(\/\/|\*)/.test(line)) continue
        }

        // For raw-bw-without-dark, verify no dark: prefix by checking characters before match
        if (rule.name === 'raw-bw-without-dark') {
          const before = line.substring(Math.max(0, match.index - 5), match.index)
          if (before.includes('dark:')) continue
        }

        violations.push({
          file: relPath,
          line: lineNum,
          match: match[0],
          category: 'ERROR',
          rule: rule.name,
          suggestion: rule.suggestion(match[0]),
        })
      }
    }

    // Check warning rules
    for (const rule of WARNING_RULES) {
      rule.pattern.lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = rule.pattern.exec(line)) !== null) {
        if (isAllowlisted(line)) continue

        violations.push({
          file: relPath,
          line: lineNum,
          match: match[0],
          category: 'WARNING',
          rule: rule.name,
          suggestion: rule.suggestion(match[0]),
        })
      }
    }
  }

  return violations
}

// --- Reporting ---

function buildReport(violations: Violation[]): AuditReport {
  const errors = violations.filter((v) => v.category === 'ERROR')
  const warnings = violations.filter((v) => v.category === 'WARNING')

  // Files by violation count
  const fileCounts = new Map<string, number>()
  for (const v of violations) {
    fileCounts.set(v.file, (fileCounts.get(v.file) || 0) + 1)
  }
  const filesByViolations = [...fileCounts.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  // Most common patterns
  const patternCounts = new Map<string, number>()
  for (const v of violations) {
    const key = `${v.category}:${v.rule}:${v.match}`
    patternCounts.set(key, (patternCounts.get(key) || 0) + 1)
  }
  const commonPatterns = [...patternCounts.entries()]
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return {
    violations,
    summary: {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      filesByViolations,
      commonPatterns,
    },
  }
}

function printReport(report: AuditReport, jsonMode: boolean) {
  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  const { violations, summary } = report

  console.log('\n=== Token Audit Report ===\n')

  // Group by file
  const byFile = new Map<string, Violation[]>()
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, [])
    byFile.get(v.file)!.push(v)
  }

  for (const [file, fileViolations] of byFile) {
    console.log(`\n--- ${file} ---`)
    for (const v of fileViolations) {
      const prefix = v.category === 'ERROR' ? '\x1b[31mERROR\x1b[0m' : '\x1b[33mWARN \x1b[0m'
      console.log(`  ${prefix}  L${v.line}  ${v.match}`)
      console.log(`         -> ${v.suggestion}`)
    }
  }

  console.log('\n=== Summary ===\n')
  console.log(`  Errors:   ${summary.totalErrors}`)
  console.log(`  Warnings: ${summary.totalWarnings}`)
  console.log(`  Total:    ${summary.totalErrors + summary.totalWarnings}`)

  if (summary.filesByViolations.length > 0) {
    console.log('\n  Top files by violations:')
    for (const { file, count } of summary.filesByViolations.slice(0, 10)) {
      console.log(`    ${count.toString().padStart(4)}  ${file}`)
    }
  }

  if (summary.commonPatterns.length > 0) {
    console.log('\n  Most common violations:')
    for (const { pattern, count } of summary.commonPatterns.slice(0, 10)) {
      console.log(`    ${count.toString().padStart(4)}x  ${pattern}`)
    }
  }

  console.log('')
}

// --- Main ---

function main() {
  const args = process.argv.slice(2)
  const strict = args.includes('--strict')
  const jsonMode = args.includes('--json')

  // Filter out flags to get file arguments (from lint-staged)
  const fileArgs = args.filter((a) => !a.startsWith('--'))

  const baseDir = path.resolve(__dirname, '..')
  let files: string[]

  if (fileArgs.length > 0) {
    // Lint-staged mode: only scan the files passed as arguments
    files = fileArgs
      .map((f) => path.resolve(f))
      .filter((f) => config.extensions.some((ext) => f.endsWith(ext)))
  } else {
    // Full scan mode: scan all configured directories
    files = collectFiles(baseDir)
  }

  if (!jsonMode) {
    console.log(`Scanning ${files.length} files...`)
  }

  const allViolations: Violation[] = []
  for (const file of files) {
    allViolations.push(...scanFile(file, baseDir))
  }

  const report = buildReport(allViolations)
  printReport(report, jsonMode)

  if (strict && report.summary.totalErrors > 0) {
    process.exit(1)
  }
}

main()
