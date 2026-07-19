const fs = require('fs').promises
const path = require('path')

async function listFiles(dir, base) {
  base = base || dir
  let results = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      results = results.concat(await listFiles(full, base))
    } else {
      results.push('/' + path.relative(base, full).replace(/\\\\/g, '/'))
    }
  }
  return results
}

async function buildWorkboxSW() {
  const publicDir = path.join(__dirname, '..', 'public')
  const swDest = path.join(publicDir, 'sw-workbox.js')
  const files = await listFiles(publicDir)
  const content = `importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');\nif (workbox && workbox.precaching) {\n  workbox.precaching.precacheAndRoute(${JSON.stringify(files, null, 2)});\n}\n`;
  await fs.writeFile(swDest, content, 'utf8')
  console.log(`Wrote ${swDest} precaching ${files.length} files`)
}

buildWorkboxSW().catch(e=>{ console.error(e); process.exit(1) })
