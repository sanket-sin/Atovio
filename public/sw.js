/**
 * Service Worker for BeyondAQI PWA
 * Handles offline fallback and runtime caching for navigations.
 */

const CACHE_NAME = "atovio-beyondaqi-v4";
const RUNTIME_CACHE = "atovio-beyondaqi-runtime-v4";

const PRECACHE_ASSETS = [
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch(() => {
              /* continue install if a single asset is unavailable */
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

function shouldBypass(request) {
  if (request.method !== "GET") {
    return true;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return true;
  }

  return (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/__nextjs")
  );
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  if (response && response.status === 200 && response.type === "basic") {
    const responseToCache = response.clone();
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, responseToCache);
  }

  return response;
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === "basic") {
      const responseToCache = response.clone();
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, responseToCache);
    }
    return response;
  } catch {
    const cachedPage = await caches.match(request);
    if (cachedPage) {
      return cachedPage;
    }

    const offlinePage = await caches.match("/offline.html");
    if (offlinePage) {
      return offlinePage;
    }

    throw new Error("Offline and no cached page available");
  }
}

self.addEventListener("fetch", (event) => {
  if (shouldBypass(event.request)) {
    return;
  }

  const isNavigation =
    event.request.mode === "navigate" ||
    event.request.destination === "document";

  event.respondWith(
    isNavigation
      ? networkFirstNavigation(event.request)
      : cacheFirst(event.request).catch(() => caches.match("/offline.html"))
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
