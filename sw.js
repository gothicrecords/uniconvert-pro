/* ============================================================
   sw.js – UniConvert Pro Service Worker
   Cache-first strategy | Offline-ready
   ============================================================ */

const CACHE_NAME = 'uniconvert-v2.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/data.js',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

/* ── Install: pre-cache static assets ── */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Pre-caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME)
                    .map(k => { console.log('[SW] Deleting old cache:', k); return caches.delete(k); })
            )
        ).then(() => self.clients.claim())
    );
});

/* ── Fetch: Cache-first, fallback to network ── */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and external API calls (live currency, etc.)
    if (request.method !== 'GET') return;
    if (url.hostname.includes('exchangerate') || url.hostname.includes('coingecko')) return;
    if (url.hostname.includes('chart.googleapis.com')) {
        // QR code requests: network only, cache second
        event.respondWith(
            fetch(request).catch(() => caches.match(request))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request).then(response => {
                // Cache successful responses
                if (response && response.status === 200 && response.type === 'basic') {
                    const cloned = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
                }
                return response;
            }).catch(() => {
                // Offline fallback for HTML pages
                if (request.headers.get('accept')?.includes('text/html')) {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

/* ── Background sync placeholder (for future use) ── */
self.addEventListener('sync', event => {
    if (event.tag === 'sync-rates') {
        console.log('[SW] Background sync: rates');
    }
});
