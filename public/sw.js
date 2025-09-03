const CACHE_NAME = 'probly-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
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
  '/assets/fonts/KaTeX_Main-Regular.ttf'
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
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
