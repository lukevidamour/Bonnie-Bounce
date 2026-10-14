/* sw.js — the game's service worker.

   Network first, always: every file is asked for from the server (checked
   against what's already here, so an unchanged file costs almost nothing),
   so a new version is picked up the moment it's published. A copy of
   everything is kept, so with no connection the game still opens and
   plays from the last time. */
var CACHE = 'bonnie-bounce';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('./'); });
    })
  );
});
