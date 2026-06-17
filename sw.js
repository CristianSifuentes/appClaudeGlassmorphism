/* ─────────────────────────────────────────────────────────────────
   SERVICE WORKER — the guardian that stays awake

   When the connection sleeps, the portfolio does not disappear.
   Every word, every style, every drifting particle is held here —
   in a cache that persists through disconnection, through closed
   tabs, through absence. The reader returns and finds it waiting.
   ───────────────────────────────────────────────────────────────── */

const CACHE = 'cs-portfolio-v1';

// The essential voice — what the portfolio cannot exist without
const PRECACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './posts.js',
  './manifest.json',
  './icon.svg',
  // The typeface is part of the design
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// ── Install — fill the cache before going on duty ─────────────────
// Promise.allSettled: one CDN asset failing does not break the install.
// The portfolio still installs; the one missing file catches on first use.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE.map((url) => cache.add(url).catch(() => {}))
        )
      )
      .then(() => self.skipWaiting())
  );
});

// ── Activate — release what came before ───────────────────────────
// Old caches are the past. Delete them cleanly and claim any open tabs.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch — serve from memory when the network forgets ────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET — POST (contact form) always travels to the network
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // CDN resources: stale-while-revalidate —
  // return the cached version immediately (fast), refresh in background (fresh)
  const isCDN =
    url.hostname.includes('googleapis.com')      ||
    url.hostname.includes('gstatic.com')         ||
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('jsdelivr.net');

  if (isCDN) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Same-origin assets: cache-first —
  // the portfolio's own files rarely change mid-session
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }
});

// ── Strategies ────────────────────────────────────────────────────

// Cache-first: return the remembered response if it exists.
// Fetch and remember on first visit; fall back to the HTML shell if offline.
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline and not cached — for any HTML navigation, serve the shell
    if (request.mode === 'navigate') {
      const shell = await caches.match('./index.html');
      if (shell) return shell;
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Stale-while-revalidate: serve from cache immediately (if available),
// then fetch a fresh copy in the background for the next visit.
async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);  // network failure: the cache is enough

  return cached || fetchPromise;
}
