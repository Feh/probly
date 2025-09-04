const CACHE_NAME = 'probly-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon-48x48.png',
  '/assets/auto-render.min.js',
  '/assets/d3.v7.min.js',
  '/assets/jstat.min.js',
  '/assets/katex.min.css',
  '/assets/katex.min.js',
  '/assets/numeric.min.js',
  '/assets/fonts/KaTeX_Math-Italic.woff2',
  '/assets/fonts/KaTeX_Main-Regular.woff2',
  '/assets/fonts/KaTeX_Math-Italic.woff',
  '/assets/fonts/KaTeX_Main-Regular.woff',
  '/assets/fonts/KaTeX_Math-Italic.ttf',
  '/assets/fonts/KaTeX_Main-Regular.ttf',
  '/assets/fonts/KaTeX_AMS-Regular.woff2',
  '/assets/fonts/KaTeX_AMS-Regular.woff',
  '/assets/fonts/KaTeX_AMS-Regular.ttf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Offline-first handler that fetches updates in the background to make startup
// more snappy and reliable.
self.addEventListener('fetch', (event) => {
  event.respondWith(async function() {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    const networkFetch = fetch(event.request)
      .then(async (networkResponse) => {
        if (networkResponse.ok) {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(() => {});

    if (cachedResponse) {
      event.waitUntil(networkFetch); // Keep the service worker alive for the network request
      return cachedResponse;
    }

    return networkFetch;
  }());
});
