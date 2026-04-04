// Кэш нұсқасын v4-ке көтердік (өзгеріс енуі үшін)
const CACHE_NAME = 'batyr-info-v4';

// Кэштелетін файлдар тізімі (Нақты жолдарды көрсету маңызды)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Орнату кезеңі
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Кэштеу кезінде қате кетпеуі үшін әр файлды жеке тексерген дұрыс
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => console.error('Кэштеу қатесі (файл табылмады):', url, err));
        })
      );
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch оқиғасы - Samsung Internet үшін "Network-first" немесе "Cache-first" стратегиясы анық болуы керек
self.addEventListener('fetch', (event) => {
  // Тек GET сұраныстарын өңдейміз
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Кэште болса, соны береміз
      }

      return fetch(event.request).then((networkResponse) => {
        // Желіден келген жауапты кэшке сақтаймыз
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Интернет те, кэш те жоқ болса (offline)
      });
    })
  );
});
