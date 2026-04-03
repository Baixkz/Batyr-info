// Кэш атауын нұсқа бойынша жаңартып тұру маңызды (v1 -> v2)
const CACHE_NAME = 'batyr-info-cache-v2';

// Кэштелетін файлдар тізіміне жаңа иконкаларды қостық
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Service Worker-ді орнату
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш ашылды, файлдар сақталуда...');
        // Файлдардың біреуі табылмаса, addAll қате береді. Сондықтан тізімді тексер.
        return cache.addAll(urlsToCache);
      })
  );
});

// Файлдарды алу (Fetch) стратегиясы
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Егер кэште болса, соны қайтарады, болмаса желіге сұраныс жібереді
        return response || fetch(event.request);
      })
  );
});

// Ескі кэшті тазалау (Белсендіру кезеңі)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Ескі кэш жойылуда:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
