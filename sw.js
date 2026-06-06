const CACHE_NAME = 'jrb-radio-v6';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './logo.svg',
  './icon-192.png',
  './icon-512.png',
  './firebase-config.js'
];

// Instala o Service Worker e adiciona assets estáticos ao cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pré-carregando assets estáticos');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Limpando cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requisições de rede
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // CRUCIAL: Ignorar fluxos de áudio de streaming e conexões de rádio
  // Estes streams são infinitos e dinâmicos; tentar cacheá-los quebrará a reprodução
  if (
    event.request.destination === 'audio' ||
    requestUrl.pathname.includes('stream') ||
    requestUrl.port === '6776' || // Jaraguar FM port
    requestUrl.hostname.includes('streamtheworld') ||
    requestUrl.hostname.includes('upx.com')
  ) {
    return; // Deixa a requisição passar direto para a rede, sem cache
  }

  // Apenas gerencia requisições GET para recursos da própria aplicação
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Retorna do cache se estiver disponível (estilo Cache-First para arquivos locais)
          return cachedResponse;
        }

        // Tenta buscar da rede
        return fetch(event.request).catch(() => {
          // Se falhar e for navegação principal HTML, retorna o cache
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
  }
});
