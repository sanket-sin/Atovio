/**
 * Service Worker for PWA
 * Handles offline functionality and caching
 */

const CACHE_NAME = "atovio-beyondaqi-v3";
const RUNTIME_CACHE = "atovio-beyondaqi-runtime-v3";

// Assets to cache on install
const PRECACHE_ASSETS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/dashboard",
  "/manifest.json",
];

// Install event - cache assets (non-fatal if a single URL fails)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch(() => {
            /* offline or missing route — continue install */
          })
        )
      ).then(() => self.skipWaiting())
    )
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return (
                cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
              );
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);

  // Do not intercept Next.js assets or local API proxy — avoids dev/HMR breakage,
  // duplicate fetch rows (initiator sw.js), and stale auth responses.
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page if available
          if (event.request.destination === "document") {
            return caches.match("/");
          }
        });
    })
  );
});

// Message event - handle messages from the app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
