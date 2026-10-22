/* Offline-first app shell. Keep the cache name in sync with app asset changes. */
const CACHE = 'tms-v4-installable';
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  // Never cache cross-origin requests, including account-specific Firebase data.
  if(new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request)
        .then(response => {
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request,copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
