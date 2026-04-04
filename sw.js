// Кэш нұсқасын v5-ке көтердік (жаңа өзгерістер браузерде бірден көрінуі үшін)
const CACHE_NAME = 'batyr-info-v5';

// Кэштелетін негізгі файлдар тізімі
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './rules.html', // Қосымша беттерді де кэшке қостық
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' // Сыртқы стильдерді кэштеу пайдалы
];

// Орнату кезеңі (Install)
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Әр файлды жеке-жеке кэштеу (біреуі табылмаса да қалғандары кэштеледі)
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => console.error('Кэштеу қатесі (файл табылмады):', url, err));
        })
      );
    })
  );
});

// Белсендіру кезеңі (Ескі кэштерді тазалау)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Егер кэш аты қазіргі CACHE_NAME-ге тең болмаса - оны өшіру
          if (cacheName !== CACHE_NAME) {
            console.log('Ескі кэш жойылды:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Ақпаратты алу (Fetch) - "Cache-first" стратегиясы
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Кэште бар болса - бірден береміз
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Кэште жоқ болса - желіден (internet) аламыз
      return fetch(event.request).then((networkResponse) => {
        // Жарамды жауап келсе, оны кэшке сақтаймыз
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Желі де, кэш те жоқ болса (Offline режим)
        // Бұл жерде қаласаң арнайы offline.html бетін қайтаруға болады
      });
    })
  );
});
