const CACHE_VERSION = 'v1';
const SHELL_CACHE = `tateify-shell-${CACHE_VERSION}`;
const DATA_CACHE = `tateify-data-${CACHE_VERSION}`;
const MEDIA_CACHE = `tateify-media-${CACHE_VERSION}`;

const APP_SHELL_URLS = [
  '/',
  '/manifest.webmanifest',
  '/appicon.png',
  '/logo.png',
  '/logo-white.png',
  '/loader.gif',
];

const isSameOrigin = (requestUrl) => {
  const requestOrigin = new URL(requestUrl).origin;
  return requestOrigin === self.location.origin;
};

const tryCacheAdd = async (cache, url) => {
  try {
    await cache.add(url);
  } catch (error) {
    console.warn(`Failed to cache ${url}:`, error);
  }
};

const preCacheCatalogAssets = async () => {
  const cache = await caches.open(MEDIA_CACHE);

  try {
    const albumsResponse = await fetch('/api/albums');
    if (albumsResponse.ok) {
      const albumsData = await albumsResponse.json();
      const covers = (albumsData.albums || []).map((album) => album.cover).filter(Boolean);
      await Promise.all(covers.map((cover) => tryCacheAdd(cache, cover)));
    }
  } catch (error) {
    console.warn('Unable to pre-cache album covers:', error);
  }

  try {
    const songsResponse = await fetch('/api/songs');
    if (songsResponse.ok) {
      const songsData = await songsResponse.json();
      const songFiles = (songsData.songs || []).map((song) => song.file).filter(Boolean);
      await Promise.all(songFiles.map((file) => tryCacheAdd(cache, file)));
    }
  } catch (error) {
    console.warn('Unable to pre-cache songs:', error);
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shellCache = await caches.open(SHELL_CACHE);
      await Promise.all(APP_SHELL_URLS.map((url) => tryCacheAdd(shellCache, url)));
      await preCacheCatalogAssets();
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      const allowed = new Set([SHELL_CACHE, DATA_CACHE, MEDIA_CACHE]);

      await Promise.all(
        cacheKeys
          .filter((key) => !allowed.has(key))
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || null;
  }
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkFetch;
  if (networkResponse) {
    return networkResponse;
  }

  return Response.error();
};

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !isSameOrigin(event.request.url)) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const pathname = requestUrl.pathname;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const response = await networkFirst(event.request, SHELL_CACHE);
        if (response) {
          return response;
        }

        const offlineShell = await caches.match('/');
        if (offlineShell) {
          return offlineShell;
        }

        return Response.error();
      })()
    );
    return;
  }

  if (pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(event.request, DATA_CACHE));
    return;
  }

  if (
    pathname.startsWith('/audio/') ||
    pathname.startsWith('/covers/') ||
    pathname.endsWith('.mp3') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.gif')
  ) {
    event.respondWith(cacheFirst(event.request, MEDIA_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request, SHELL_CACHE));
});
