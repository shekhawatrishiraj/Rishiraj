import * as fs from 'fs'
import * as path from 'path'

// --- Config ---

// Components that don't require specs (internal helpers, experimental, etc.)
// Remove from this list once a spec is created
const SPEC_EXEMPT: string[] = [
  // AI element internal/helper components — spec when they stabilize or get modified
  'attachments', 'audio-player', 'chain-of-thought', 'checkpoint', 'commit',
  'confirmation', 'connection', 'context', 'controls', 'edge',
  'environment-variables', 'file-tree', 'image', 'inline-citation', 'jsx-preview',
  'mic-selector', 'model-selector', 'node', 'open-in-chat', 'package-info',
  'panel', 'plan', 'queue', 'sandbox', 'schema-display', 'shimmer',
  'snippet', 'sources', 'speech-input', 'stack-trace', 'suggestion',
  'task', 'terminal', 'test-results', 'toolbar', 'transcription',
  'voice-selector', 'web-preview',
]

const COMPONENT_SPEC_MAP: { srcDir: string; specDir: string }[] = [
  { srcDir: 'src/components/ui', specDir: '../specs/components/ui' },
  { srcDir: 'src/components/ai-elements', specDir: '../specs/components/ai-elements' },
]

const TOKEN_PAIRS: { src: string; spec: string }[] = [
  { src: 'src/app/globals.css', spec: '../specs/tokens/token-reference.md' },
  { src: 'src/app/globals.css', spec: '../specs/foundations/color.md' },
  { src: 'src/app/globals.css', spec: '../specs/foundations/radius.md' },
  { src: 'src/app/globals.css', spec: '../specs/foundations/spacing.md' },
  { src: 'src/app/globals.css', spec: '../specs/foundations/elevation.md' },
  { src: 'src/app/globals.css', spec: '../specs/foundations/z-index.md' },
  { src: 'src/app/globals.css', spec: '../specs/foundations/typography.md' },
  { src: 'src/lib/motion.ts', spec: '../specs/foundations/motion.md' },
]

const DOMAIN_PAIRS: { src: string; spec: string }[] = [
  { src: 'src/components/data-source-card.tsx', spec: '../specs/components/domain/data-source-card.md' },
  { src: 'src/components/feed.tsx', spec: '../specs/components/domain/feed.md' },
  { src: 'src/components/global-prompt-box.tsx', spec: '../specs/components/domain/global-prompt-box.md' },
  { src: 'src/components/meeting-widget.tsx', spec: '../specs/components/domain/meeting-widget.md' },
  { src: 'src/components/persona-switcher.tsx', spec: '../specs/components/domain/persona-switcher.md' },
]

const PATTERN_PAIRS: { src: string; spec: string }[] = [
  { src: 'src/components/content-container.tsx', spec: '../specs/patterns/layout-content-container.md' },
  { src: 'src/components/global-sidenav.tsx', spec: '../specs/patterns/layout-sidebar.md' },
]

// --- Types ---

interface StaleSpec {
  component: string
  componentMtime: Date
  specFile: string
  specMtime: Date | null // null = spec doesn't exist
  status: 'stale' | 'missing'
}

// Tolerance in ms — git checkout sets file mtimes sequentially, so files
// within the same second should be considered in-sync.
const STALE_TOLERANCE_MS = 1000

// --- Logic ---

function getBaseName(file: string): string {
  return path.basename(file, path.extname(file))
}

function getMtime(filePath: string): Date | null {
  try {
    return fs.statSync(filePath).mtime
  } catch {
    return null
  }
}

function checkComponentSpecs(baseDir: string): StaleSpec[] {
  const stale: StaleSpec[] = []

  for (const { srcDir, specDir } of COMPONENT_SPEC_MAP) {
    const fullSrcDir = path.resolve(baseDir, srcDir)
    const fullSpecDir = path.resolve(baseDir, specDir)

    if (!fs.existsSync(fullSrcDir)) continue

    const componentFiles = fs.readdirSync(fullSrcDir).filter((f) => f.endsWith('.tsx'))

    for (const file of componentFiles) {
      const componentPath = path.join(fullSrcDir, file)
      const baseName = getBaseName(file)
      if (SPEC_EXEMPT.includes(baseName)) continue
      const specPath = path.join(fullSpecDir, `${baseName}.md`)

      const componentMtime = getMtime(componentPath)
      if (!componentMtime) continue

      const specMtime = getMtime(specPath)

      if (!specMtime) {
        stale.push({
          component: path.relative(baseDir, componentPath),
          componentMtime,
          specFile: path.relative(baseDir, specPath),
          specMtime: null,
          status: 'missing',
        })
      } else if (componentMtime.getTime() - specMtime.getTime() > STALE_TOLERANCE_MS) {
        stale.push({
          component: path.relative(baseDir, componentPath),
          componentMtime,
          specFile: path.relative(baseDir, specPath),
          specMtime,
          status: 'stale',
        })
      }
    }
  }

  return stale
}

function checkTokenSpecs(baseDir: string): StaleSpec[] {
  const stale: StaleSpec[] = []

  for (const { src, spec } of TOKEN_PAIRS) {
    const srcPath = path.resolve(baseDir, src)
    const specPath = path.resolve(baseDir, spec)

    const srcMtime = getMtime(srcPath)
    const specMtime = getMtime(specPath)

    if (!srcMtime) continue

    if (!specMtime) {
      stale.push({
        component: src,
        componentMtime: srcMtime,
        specFile: spec,
        specMtime: null,
        status: 'missing',
      })
    } else if (srcMtime.getTime() - specMtime.getTime() > STALE_TOLERANCE_MS) {
      stale.push({
        component: src,
        componentMtime: srcMtime,
        specFile: spec,
        specMtime: specMtime,
        status: 'stale',
      })
    }
  }

  return stale
}

function checkFilePairs(baseDir: string, pairs: { src: string; spec: string }[]): StaleSpec[] {
  const stale: StaleSpec[] = []

  for (const { src, spec } of pairs) {
    const srcPath = path.resolve(baseDir, src)
    const specPath = path.resolve(baseDir, spec)

    const srcMtime = getMtime(srcPath)
    const specMtime = getMtime(specPath)

    if (!srcMtime) continue

    if (!specMtime) {
      stale.push({
        component: src,
        componentMtime: srcMtime,
        specFile: spec,
        specMtime: null,
        status: 'missing',
      })
    } else if (srcMtime.getTime() - specMtime.getTime() > STALE_TOLERANCE_MS) {
      stale.push({
        component: src,
        componentMtime: srcMtime,
        specFile: spec,
        specMtime: specMtime,
        status: 'stale',
      })
    }
  }

  return stale
}

// --- Output ---

function formatDate(d: Date | null): string {
  if (!d) return 'N/A'
  return d.toISOString().replace('T', ' ').substring(0, 19)
}

function checkSpecificFiles(baseDir: string, filePaths: string[]): StaleSpec[] {
  const stale: StaleSpec[] = []

  for (const filePath of filePaths) {
    const absPath = path.resolve(filePath)
    const baseName = getBaseName(absPath)
    if (SPEC_EXEMPT.includes(baseName)) continue

    // Determine which spec this file maps to
    let specPath: string | null = null

    // Check component spec map (ui/, ai-elements/)
    for (const { srcDir, specDir } of COMPONENT_SPEC_MAP) {
      const fullSrcDir = path.resolve(baseDir, srcDir)
      if (absPath.startsWith(fullSrcDir)) {
        specPath = path.join(path.resolve(baseDir, specDir), `${baseName}.md`)
        break
      }
    }

    // Check domain and pattern pairs
    if (!specPath) {
      const allPairs = [...DOMAIN_PAIRS, ...PATTERN_PAIRS]
      for (const { src, spec } of allPairs) {
        if (absPath === path.resolve(baseDir, src)) {
          specPath = path.resolve(baseDir, spec)
          break
        }
      }
    }

    if (!specPath) continue

    const componentMtime = getMtime(absPath)
    if (!componentMtime) continue

    const specMtime = getMtime(specPath)

    if (!specMtime) {
      stale.push({
        component: path.relative(baseDir, absPath),
        componentMtime,
        specFile: path.relative(baseDir, specPath),
        specMtime: null,
        status: 'missing',
      })
    } else if (componentMtime.getTime() - specMtime.getTime() > STALE_TOLERANCE_MS) {
      stale.push({
        component: path.relative(baseDir, absPath),
        componentMtime,
        specFile: path.relative(baseDir, specPath),
        specMtime,
        status: 'stale',
      })
    }
  }

  return stale
}

function main() {
  const args = process.argv.slice(2)
  const jsonMode = args.includes('--json')
  const strict = args.includes('--strict')

  // Filter out flags to get file arguments (from lint-staged)
  const fileArgs = args.filter((a) => !a.startsWith('--'))

  const baseDir = path.resolve(__dirname, '..')

  let allStale: StaleSpec[]

  if (fileArgs.length > 0) {
    // Lint-staged mode: only check the specific files being committed
    allStale = checkSpecificFiles(baseDir, fileArgs)
  } else {
    // Full scan mode
    const componentStale = checkComponentSpecs(baseDir)
    const tokenStale = checkTokenSpecs(baseDir)
    const domainStale = checkFilePairs(baseDir, DOMAIN_PAIRS)
    const patternStale = checkFilePairs(baseDir, PATTERN_PAIRS)
    allStale = [...componentStale, ...tokenStale, ...domainStale, ...patternStale]
  }

  const missing = allStale.filter((s) => s.status === 'missing')
  const stale = allStale.filter((s) => s.status === 'stale')

  if (jsonMode) {
    console.log(JSON.stringify({ missing, stale, total: allStale.length }, null, 2))
    return
  }

  if (allStale.length === 0) {
    console.log('\nAll specs are up to date.\n')
    return
  }

  console.log('\n=== Spec Freshness Report ===\n')

  if (stale.length > 0) {
    console.log(`\x1b[33mSTALE SPECS (${stale.length}):\x1b[0m`)
    console.log('Component was modified after its spec. Spec may be outdated.\n')
    for (const s of stale) {
      console.log(`  ${s.component}`)
      console.log(`    Component updated: ${formatDate(s.componentMtime)}`)
      console.log(`    Spec last updated: ${formatDate(s.specMtime)}`)
      console.log(`    Spec file: ${s.specFile}`)
      console.log('')
    }
  }

  if (missing.length > 0) {
    console.log(`\x1b[31mMISSING SPECS (${missing.length}):\x1b[0m`)
    console.log('No spec file found for these components.\n')
    for (const s of missing) {
      console.log(`  ${s.component}  ->  expected: ${s.specFile}`)
    }
    console.log('')
  }

  console.log(`=== Summary: ${stale.length} stale, ${missing.length} missing ===\n`)

  if (strict && allStale.length > 0) {
    process.exit(1)
  }
}

main()
