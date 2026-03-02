const STATIC_CACHE = 'tateify-static-v1';
const AUDIO_CACHE = 'tateify-audio-v1';
const API_CACHE = 'tateify-api-v1';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/appicon.png',
  '/loader.gif',
];

// Parse a Range header, returning { start, end } byte positions.
function parseRange(rangeHeader, totalLength) {
  const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
  if (!match) return { start: 0, end: totalLength - 1 };
  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : totalLength - 1;
  return { start, end: Math.min(end, totalLength - 1) };
}

// Serve a cached audio response, honouring any Range header.
async function serveAudioFromCache(cachedResponse, rangeHeader) {
  if (!rangeHeader) return cachedResponse;

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const { start, end } = parseRange(rangeHeader, arrayBuffer.byteLength);
  const slice = arrayBuffer.slice(start, end + 1);

  return new Response(slice, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const validCaches = new Set([STATIC_CACHE, AUDIO_CACHE, API_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => !validCaches.has(n)).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ── Audio files: cache-first, range-aware ──────────────────────────────────
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        // Use a plain URL string as the cache key so that range requests
        // (which carry a Range header) all match the same stored full entry.
        const cacheKey = url.href;
        const cachedFull = await cache.match(cacheKey);
        if (cachedFull) {
          const rangeHeader = request.headers.get('Range');
          return serveAudioFromCache(cachedFull, rangeHeader);
        }

        // Not cached yet — fetch the full file (without Range so we store the
        // complete response) and cache it, then serve the appropriate slice.
        try {
          const fullRequest = new Request(url.href, { headers: {} });
          const networkResponse = await fetch(fullRequest);
          if (networkResponse.ok) {
            await cache.put(cacheKey, networkResponse.clone());
            const rangeHeader = request.headers.get('Range');
            return serveAudioFromCache(networkResponse, rangeHeader);
          }
          return networkResponse;
        } catch {
          return new Response('Audio unavailable offline', { status: 503 });
        }
      })
    );
    return;
  }

  // ── Static assets (covers, next static chunks): cache-first ───────────────
  if (
    url.pathname.startsWith('/covers/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname === '/appicon.png' ||
    url.pathname === '/loader.gif'
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch {
          return new Response('Asset unavailable offline', { status: 503 });
        }
      })
    );
    return;
  }

  // ── API routes: network-first with cache fallback ──────────────────────────
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            caches
              .open(API_CACHE)
              .then((cache) => cache.put(request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response('API unavailable offline', { status: 503 });
        })
    );
    return;
  }
});
