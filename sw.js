// sw.js
const CACHE_NAME = 'fisiorock-v1';
const CORE_ASSETS = [
  '/fisiorock-workouts/',
  '/fisiorock-workouts/index.html',
  '/fisiorock-workouts/app.js',
  '/fisiorock-workouts/manifest.json',
  '/fisiorock-workouts/icons/icon-192.png',
  '/fisiorock-workouts/icons/icon-512.png',
  // aggiungi anche CSS e l'xlsx se vuoi cache offline
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Strategia semplice: cache-first con fallback alla rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
``
