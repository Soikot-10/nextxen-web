#!/usr/bin/env node
// Save or restore a full snapshot of the website (code, images, config).
//
//   npm run version:save -- v1        save the site as it is now into versions/v1
//   npm run version:restore -- v1     put the site back exactly as saved in versions/v1
//   npm run version:list              show saved versions
//
// A restore makes src/ and public/ match the snapshot exactly (files added
// since are removed) and puts the config files back. Before restoring, the
// current site is saved automatically to versions/_before-restore so a
// restore can always be undone. Nothing is committed or pushed.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const VERSIONS = join(ROOT, 'versions')
const DIRS = ['src', 'public', 'assets']
const FILES = ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'eslint.config.mjs']

const [cmd, name] = process.argv.slice(2)
const safe = n => /^[\w.-]+$/.test(n || '')

function save(n, note = '') {
  const dest = join(VERSIONS, n)
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  for (const d of DIRS) if (existsSync(join(ROOT, d))) cpSync(join(ROOT, d), join(dest, d), { recursive: true })
  for (const f of FILES) if (existsSync(join(ROOT, f))) cpSync(join(ROOT, f), join(dest, f))
  writeFileSync(join(dest, 'VERSION.json'), JSON.stringify({ name: n, savedAt: new Date().toISOString(), note }, null, 2))
  console.log(`Saved the current site as "${n}" in versions/${n}`)
}

function restore(n) {
  const src = join(VERSIONS, n)
  if (!existsSync(join(src, 'VERSION.json'))) { console.error(`No saved version called "${n}". Run: npm run version:list`); process.exit(1) }
  if (n !== '_before-restore') save('_before-restore', `automatic backup before restoring "${n}"`)
  for (const d of DIRS) {
    const live = join(ROOT, d)
    if (existsSync(live)) rmSync(live, { recursive: true, force: true })
    if (existsSync(join(src, d))) cpSync(join(src, d), live, { recursive: true })
  }
  for (const f of FILES) if (existsSync(join(src, f))) cpSync(join(src, f), join(ROOT, f))
  // stale build output can reference routes that no longer exist
  for (const t of ['.next/types', '.next/dev/types']) if (existsSync(join(ROOT, t))) rmSync(join(ROOT, t), { recursive: true, force: true })
  const meta = JSON.parse(readFileSync(join(src, 'VERSION.json'), 'utf8'))
  console.log(`Restored the site to "${n}" (saved ${meta.savedAt}). Restart the dev server (npm run dev) so it picks up the change; if package.json changed, run npm install first.`)
  console.log('Undo this restore with: npm run version:restore -- _before-restore')
}

function list() {
  if (!existsSync(VERSIONS)) { console.log('No saved versions yet.'); return }
  for (const n of readdirSync(VERSIONS)) {
    const p = join(VERSIONS, n, 'VERSION.json')
    if (statSync(join(VERSIONS, n)).isDirectory() && existsSync(p)) {
      const m = JSON.parse(readFileSync(p, 'utf8'))
      console.log(`${n.padEnd(18)} saved ${m.savedAt}${m.note ? '  ' + m.note : ''}`)
    }
  }
}

if (cmd === 'save' && safe(name)) save(name, process.argv.slice(4).join(' '))
else if (cmd === 'restore' && safe(name)) restore(name)
else if (cmd === 'list') list()
else { console.log('Usage: node scripts/site-version.mjs save|restore <name>  |  list'); process.exit(1) }
