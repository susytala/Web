/* Service worker de Manojito.
   - Páginas y código (html, js, css): red primero (siempre ves lo último que subiste) y, si no hay internet o tarda mucho, usa la copia guardada.
   - Imágenes, íconos y tipografías: salen al instante de la copia guardada y se actualizan en segundo plano.
   - Supabase, WhatsApp y cualquier otro sitio externo no pasan por acá: van directo a internet.
   Para forzar que todos descarguen una versión nueva, cambiá el número de VERSION. */
const VERSION = 'v4';
const SHELL = 'manojito-shell-' + VERSION;
const RUNTIME = 'manojito-runtime-' + VERSION;
const MAX_RUNTIME = 80;      // máximo de archivos guardados en el caché dinámico
const NET_TIMEOUT = 4000;    // ms que esperamos a la red antes de usar la copia guardada

/* Lo mínimo para que la tienda abra sin internet */
const PRECACHE = [
  './',
  'juegos.html',
  'asistente.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  /* fotos de la tienda, para que se vean también sin internet */
  'imagenes/p4.webp', 'imagenes/p5.webp', 'imagenes/p6.webp', 'imagenes/p7.webp', 'imagenes/p8.webp',
  'imagenes/p9.webp', 'imagenes/p10.webp', 'imagenes/p11.webp', 'imagenes/p12.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => Promise.all(PRECACHE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keep = [SHELL, RUNTIME];
    const names = await caches.keys();
    await Promise.all(names.filter(n => !keep.includes(n)).map(n => caches.delete(n)));
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.enable(); } catch (_) {} }
    await self.clients.claim();
  })());
});

/* Clave de caché sin parámetros (?v=12 y similares) para no guardar la misma página muchas veces */
function keyFor(url) { return new Request(url.origin + url.pathname); }

async function trim(cacheName, max) {
  try {
    const c = await caches.open(cacheName);
    const keys = await c.keys();
    for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
  } catch (_) {}
}

async function stash(cacheName, key, res) {
  if (!res || !(res.ok || res.type === 'opaque')) return;
  const copy = res.clone();          /* se clona ya, antes de que la página consuma la respuesta */
  try {
    const c = await caches.open(cacheName);
    await c.put(key, copy);
    if (cacheName === RUNTIME) trim(RUNTIME, MAX_RUNTIME);
  } catch (_) {}
}

async function fromCache(key, same) {
  /* ignoreSearch solo para archivos propios; las tipografías de Google distinguen por sus parámetros */
  return (await caches.match(key, same ? { ignoreSearch: true } : undefined)) || null;
}

/* Red primero, con copia de respaldo */
function networkFirst(e, req, key, cacheName, same) {
  return (async () => {
    const pre = e.preloadResponse ? await e.preloadResponse.catch(() => null) : null;
    const fp = pre ? Promise.resolve(pre) : fetch(req);
    const cached = await fromCache(key, same);
    try {
      const net = cached
        ? await Promise.race([fp, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), NET_TIMEOUT))])
        : await fp;
      e.waitUntil(stash(cacheName, key, net));
      return net;
    } catch (err) {
      if (cached) {
        e.waitUntil(fp.then(r => stash(cacheName, key, r)).catch(() => {}));  // si la red responde tarde, deja la copia al día
        return cached;
      }
      if (req.mode === 'navigate') {
        const home = await caches.match('./');
        if (home) return home;
      }
      return Response.error();
    }
  })();
}

/* Copia guardada al instante y actualización en segundo plano */
function staleWhileRevalidate(e, req, key, cacheName, same) {
  return (async () => {
    const hit = await fromCache(key, same);
    const fp = fetch(req).then(r => { stash(cacheName, key, r); return r; });
    e.waitUntil(fp.catch(() => {}));
    return hit || fp.catch(() => Response.error());
  })();
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  const same = url.origin === self.location.origin;
  const fonts = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !fonts) return;                         // sitios externos: directo a internet
  if (same && /\/sw\.js$/.test(url.pathname)) return;  // el service worker nunca se cachea a sí mismo

  const key = same ? keyFor(url) : req;
  const cacheName = same && key.url === new URL('./', self.registration.scope).href ? SHELL : RUNTIME;

  if (req.mode === 'navigate' || (same && /\.(html|js|css|webmanifest|json)$/i.test(url.pathname))) {
    e.respondWith(networkFirst(e, req, key, cacheName, same));
  } else {
    e.respondWith(staleWhileRevalidate(e, req, key, cacheName, same));
  }
});
