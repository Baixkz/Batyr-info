self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('batyr-info').then((cache) => cache.addAll([
      'index.html',
      'olx.html',
      'shops.html',
      'jobs.html'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

