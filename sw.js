const CACHE_NAME = 'snapsudoku-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install SW and cache static core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy: Stale-while-revalidate for most things, Cache First for immutable CDNs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle external CDN resources (Tailwind, React, Icons, etc.)
  // We cache these dynamically as they are requested
  if (url.origin.includes('cdn.tailwindcss.com') || 
      url.origin.includes('aistudiocdn.com') || 
      url.origin.includes('cdn-icons-png.flaticon.com')) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        try {
          const networkResponse = await fetch(event.request);
          // Cache the new resource
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (e) {
          return new Response("Network Error", { status: 408 });
        }
      })
    );
    return;
  }

  // Standard Stale-While-Revalidate for app files
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});