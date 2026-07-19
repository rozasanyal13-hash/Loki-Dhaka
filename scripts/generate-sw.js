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

async function buildSW() {
  const publicDir = path.join(__dirname, '..', 'public')
  const swDest = path.join(publicDir, 'service-worker.js')
  console.log('Generating simple service worker at', swDest)
  const files = await listFiles(publicDir)
  const precacheList = JSON.stringify(files, null, 2)
  const content = `// Auto-generated simple service worker\nconst CACHE_NAME = 'loki-precache-v1'\nconst PRECACHE = ${precacheList}\nself.addEventListener('install', (e)=>{ e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE)).catch(()=>{}))})\nself.addEventListener('fetch', (e)=>{ e.respondWith(caches.match(e.request).then(r=>r || fetch(e.request)))})\n`
  await fs.writeFile(swDest, content, 'utf8')
  console.log(`Wrote simple service worker; precached ${files.length} files.`)
}

buildSW().catch(err=>{ console.error(err); process.exit(1) })
