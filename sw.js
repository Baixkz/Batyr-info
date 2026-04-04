// Кэш нұсқасын v3-ке көтердік, бұл браузерге "жаңа нұсқа келді" деген белгі
const CACHE_NAME = 'batyr-info-v3';

// Кэштелетін негізгі файлдар
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Орнату кезеңі
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Жаңа SW-ны кезекке қоймай, бірден іске қосу
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэш ашылды');
      return cache.addAll(urlsToCache).catch(err => console.log('Кэштеу қатесі:', err));
    })
  );
});

// Белсендіру кезеңі (Ескі кэшті тазалау)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Ескі кэш жойылды:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Барлық ашық беттерді бақылауға алу
});

// Ақпаратты алу (Fetch) - "Stale-while-revalidate" стратегиясы
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Кэште бар болса - соны қайтару, бірақ параллельді түрде желіден жаңарту
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Интернет жоқ болса, ештеңе істемейді (кэш қайтарылып қойған)
      });

      return cachedResponse || fetchPromise;
    })
  );
});
