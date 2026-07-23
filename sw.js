// Bump this on every deploy that touches the app shell (index.html/app.js/style.css).
// The activate handler purges any cache whose name doesn't match, so bumping this
// is what forces returning visitors off a stale, previously-cached, possibly-buggy build.
const CACHE_NAME = 'facturepro-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-16.png',
  '/favicon-32.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations and the app shell's JS/CSS must always try the network first:
  // these are the files that carry bug fixes, and a cache-first strategy here
  // would silently trap returning visitors on an old, possibly-broken build
  // until some unrelated future reload happened to catch the background
  // revalidation. Cache is only a fallback for when the device is offline.
  const isAppShellCode = request.mode === 'navigate' || /\.(?:js|css)$/.test(url.pathname);
  if (isAppShellCode) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || (request.mode === 'navigate' ? caches.match('/index.html') : undefined)))
    );
    return;
  }

  // Other static assets (icons, manifest, etc.) rarely change and aren't
  // correctness-critical, so they can stay cache-first for speed.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
