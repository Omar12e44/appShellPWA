// service-worker.js

const CACHE_NAME = 'mipwa-cache-v1';
// Archivos que componen el App Shell y que queremos almacenar en caché.
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Evento 'install': se dispara cuando el SW se instala.
// Aquí es donde almacenamos en caché los archivos del App Shell.
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Abriendo caché y agregando App Shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: App Shell cacheado exitosamente');
                return self.skipWaiting(); // Forzar la activación del SW
            })
    );
});

// Evento 'activate': se dispara cuando el SW se activa.
// Aquí se pueden limpiar cachés antiguas.
self.addEventListener('activate', event => {
    console.log('Service Worker: Activando...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Limpiando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Tomar control inmediato de las páginas
    );
});


// Evento 'fetch': se dispara cada vez que la página realiza una petición de red.
// Interceptamos la petición para servir archivos desde la caché si están disponibles.
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching', event.request.url);
    event.respondWith(
        // 1. Intentar encontrar la respuesta en la caché.
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en la caché, la devolvemos.
                if (response) {
                    console.log('Service Worker: Sirviendo desde caché:', event.request.url);
                    return response;
                }

                // Si no está en la caché, intentamos obtenerla de la red.
                console.log('Service Worker: Obteniendo desde la red:', event.request.url);
                return fetch(event.request);
            })
    );
});
