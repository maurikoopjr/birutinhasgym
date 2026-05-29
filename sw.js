const CACHE_NAME = 'birutinhas-gym-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Share+Tech+Mono&display=swap'
];

// Evento de Instalação: Salva arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Armazenando cache estático...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de Ativação: Limpa caches antigos se houver atualização
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: Captura requisições e carrega do cache (Offline-First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Retorna do cache se estiver disponível
          return cachedResponse;
        }

        // Caso contrário, tenta buscar da rede
        return fetch(event.request).then(response => {
          // Não faz cache de requisições de APIs ou externas dinâmicas que não sejam fontes
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Armazena novos arquivos estáticos requisitados
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(() => {
          // Se falhar e estiver offline (e não tiver no cache)
          console.log('Erro de conexão física e recurso não cacheado.');
        });
      })
  );
});
