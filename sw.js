const CACHE_NAME = 'batyr-info-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Service Worker-ді орнату және файлдарды кэшке сақтау
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш ашылды, файлдар сақталуда...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Файлдарды сұрағанда алдымен кэштен іздеу, таппаса интернеттен алу
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Кэште бар болса, соны береді
        }
        return fetch(event.request); // Жоқ болса, интернеттен алады
      })
  );
});

// Ескі кэшті тазалау
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
