// Кэш нұсқасын v16-ға көтердік (Жаңа файлдарды тануы үшін)
const CACHE_NAME = 'batyr-info-v16';

// Кэшке сақталатын файлдар тізімі (Офлайн жұмыс істеу үшін)
const urlsToCache = [
  './',
  './index.html',
  './category.html',
  './admin.html',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './screenshot-1.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js'
];

// 1. Орнату (Install)
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => console.warn('Кэштеу қатесі (мүмкін файл жоқ):', url));
        })
      );
    })
  );
});

// 2. Белсендіру (Activate) - Ескі кэштерді тазалау
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

// 3. Сұраныстарды өңдеу (Fetch)
self.addEventListener('fetch', (event) => {
  // Тек GET сұраныстарын кэштейміз
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Кэште болса - соны бер, болмаса - желіден ал
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // Жаңа файлдарды кэшке қосып отыру
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Желі де, кэш те жоқ болса (Офлайн)
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
