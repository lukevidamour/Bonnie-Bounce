/* ==========================================================================
   fresh.js — always the newest version.

   A game added to a home screen can sit in memory for days, and browsers
   keep files a while too, so after an update a child could go on playing
   last week's version. Two things stop that:
     · sw.js asks the server first for every file (and keeps a copy, so
       the game still opens with no connection);
     · when the game comes back to the front, it asks the server when the
       page was last published; if that's newer than the copy that's
       running, it reloads — but only at a calm moment, on the title or
       the map, never in the middle of a level.
   Nothing here runs when the game is opened straight from a folder.
   ========================================================================== */
(function () {
  'use strict';
  if (!/^https?:$/.test(location.protocol)) return;
  if ('serviceWorker' in navigator) {
    try { navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(function () {}); } catch (e) {}
  }
  var running = Date.parse(document.lastModified) || 0, newer = false;
  var check = function () {
    fetch(location.pathname, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
      var lm = Date.parse(r.headers.get('last-modified') || '');
      // a minute's grace for clocks and the time a publish takes
      if (lm && running && lm > running + 60000) newer = true;
    }).catch(function () {});
  };
  setTimeout(check, 4000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  // reload once per update, after fetching the new page fresh (so a stale
  // copy can't come back and loop)
  var going = false;
  setInterval(function () {
    if (!newer || going || !BB.game || !/^(title|map)$/.test(BB.game.scene())) return;
    var key = 'bonnie-reloaded', done = null;
    try { done = sessionStorage.getItem(key); } catch (e) {}
    if (done && Date.now() - +done < 120000) return;
    going = true;
    try { sessionStorage.setItem(key, String(Date.now())); } catch (e) {}
    fetch(location.pathname, { cache: 'reload' }).then(function () { location.reload(); }, function () { location.reload(); });
  }, 1000);
})();
