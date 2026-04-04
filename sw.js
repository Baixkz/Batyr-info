// Кэш нұсқасын v10-ға көтердік (Жаңа скриншот пен манифест күшіне енуі үшін)
const CACHE_NAME = 'batyr-info-v10';

// Кэштелетін негізгі файлдар тізімі
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './screenshot-1.png', // ЖАҢА: Скриншотты кэшке қостық
  './rules.html',
  './style.css', // Стиль файлын да нақтылап қостық
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Орнату кезеңі (Install)
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Әр файлды жеке-жеке тексеріп кэштеу
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => console.error('Кэштеу қатесі:', url, err));
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

// Fetch оқиғасы - Желіден бұрын кэшті тексеретін стратегия
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Офлайн жағдайда ештеңе қайтармаймыз немесе кэштегі index.html береміз
      });
    })
  );
});
