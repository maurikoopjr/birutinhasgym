const CACHE_NAME = 'birutinhas-gym-v18';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './capy-suffering.png',
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

// Evento Fetch: Network-First (Tenta rede para atualizar sempre, se falhar usa cache)
self.addEventListener('fetch', event => {
  // Apenas processa requisições HTTP normais (GET)
  if (event.request.method !== 'GET') return;

  // IMPORTANTE: Não interceptar ou cachear chamadas de API externas (como KVDB.io)
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    // Permite que requisições externas (sincronização na nuvem) usem a rede diretamente
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se deu certo, clona e atualiza o cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se falhar (sem internet), busca no cache local
        return caches.match(event.request);
      })
  );
});
