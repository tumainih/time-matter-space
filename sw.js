/* Offline-first cache. Bump CACHE on any file change to force refresh. */
const CACHE = 'tms-v2-cloud-sync';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/time-engine.js',
  './js/storage.js',
  './js/cloud-sync.js',
  './js/verses.js',
  './js/matter.js',
  './js/space.js',
  './js/views.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for app shell, network-first fallback for anything else.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Do not cache Firebase/Auth responses: they can contain account-specific data.
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
