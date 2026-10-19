/* ==========================================================================
   reel.js — films the trailer (index.html; README: "Making a trailer").

   Each scene is a stretch of one level. Bonnie is put down at its start,
   and the playtest robot's search (tools/playtest.html, here keeping the
   path it took) finds a way through that's never hit, always heading on:
   to a thing to do first if the scene has one (Bear, the balloons, a
   stomp on Rascal), then onwards. That path is played again from the
   same moment, a frame at a time, and each frame goes to serve.js. The
   game has no dice in its rules (only in sparkles), so the replay is the
   same run.

   Luke and Lucy stay out of it: they're the checkpoints from level 21
   on (taken away here), Dad at the start of the bike ride (taken away),
   and the car at the end of levels 21–35 (no scene goes that far).

     REEL.look(n, x)        one frame of level n at tile x, to choose spots
     REEL.plan(i)           find scene i's path (kept for film)
     REEL.film()            film every scene, then make the soundtrack
   Scenes are cut to the song's bars: SONG's 16ths are 0.1s, so a bar is
   96 frames and a beat 24.
   ========================================================================== */
(function () {
  'use strict';
  var R = window.REEL, T = 8, STEP = 6, FPS = 60;
  var SONG = 'hills', FADE_IN = 10, FADE_OUT = 40;
  var out = document.getElementById('out');
  var say = function (html) { var d = document.createElement('div'); d.innerHTML = html; out.appendChild(d); return d; };
  BB.reel = true;
  BB.voice = null;     // the grown-ups' recorded voices are theirs, not the trailer's
  // each level's own tune is silenced: the trailer has one song under it all
  R.realMusic = BB.music;
  BB.music = function () {};

  /* ---- the scenes ---------------------------------------------------------------
     n: level · x: start tile (row: on the floor below this row, else the
     first floor from the top) · frames · outfit, power · go: the tile to
     head for · first: something to do on the way, done by frame `by`
     (finding Bear, the balloons, a stomp on Rascal) · prep(G): set the
     scene once Bonnie is down; prep2(G) after it has settled */
  var dist = function (G, e) { var p = G.p; return e ? Math.abs(e.x + e.w / 2 - p.x - p.w / 2) + Math.abs(e.y + e.h / 2 - p.y - p.h / 2) : 0; };
  var FIRST = {
    // Bear (the grey cat) spotted, and following
    bear: { done: function (G) { return G.ents.some(function (e) { return e.k === 'bear' && e.mode === 'follow'; }); }, h: function (G) { return dist(G, near(G, 'bear', G.p.x)); } },
    balloons: { done: function (G) { return G.p.lift > 0; }, h: function (G) { return dist(G, near(G, 'balloons', G.p.x)); } },
    // up the steam from a chimney
    steam: { done: function (G) { var s = near(G, 'steam', G.p.x); return s && G.p.y < s.y + 8 && G.p.x + G.p.w > s.x && G.p.x < s.x + s.w; }, h: function (G) { var s = near(G, 'steam', G.p.x); return Math.abs(s.x + s.w / 2 - G.p.x - G.p.w / 2) + Math.abs(s.y - G.p.y); } },
    // a catapult's fling, high over the walls
    fling: { done: function (G) { return G.p.y < 3 * T; }, h: function (G) { var c = null; G.ents.forEach(function (e) { if (e.k === 'spring' && e.sp.fling && (!c || Math.abs(e.x - G.p.x) < Math.abs(c.x - G.p.x))) c = e; }); return dist(G, c); } },
    // on a surfboard, out on the waves
    surf: { done: function (G) { return !!(G.p.on && G.p.on.surf && G.p.on.state !== 'wait'); }, h: function (G) { var b = null; G.ents.forEach(function (e) { if (e.surf && (!b || Math.abs(e.x - G.p.x) < Math.abs(b.x - G.p.x))) b = e; }); return dist(G, b) + (G.p.on && G.p.on.surf ? 0 : 20); } },
    // a stomp on Rascal, while he's dizzy
    fox: { done: function (G) { var f = near(G, 'fox', G.p.x); return f && f.hp < 6; }, h: function (G) { var f = near(G, 'fox', G.p.x); return Math.abs(f.x + f.w / 2 - G.p.x - G.p.w / 2) + (f.st === 'dizzy' ? 0 : 60); } }
  };
  var SCENES = R.SCENES = [
    { name: 'clouds', n: 8, x: 95, frames: 144 },
    { name: 'reef', n: 4, x: 104, frames: 96 },
    { name: 'harbour, Bear', n: 11, x: 124, frames: 144, outfit: 'pirate', first: FIRST.bear, by: 100 },
    { name: 'moon garden, notes', n: 18, x: 272, frames: 96, outfit: 'pyjamas' },
    { name: 'frosty peaks', n: 7, x: 150, frames: 96, outfit: 'super' },
    { name: 'rooftops, steam', n: 26, x: 134, frames: 144, first: FIRST.steam, by: 110 },
    { name: "o'gliss, slides", n: 31, x: 56, frames: 96 },
    { name: 'surf', n: 32, x: 24, frames: 144, first: FIRST.surf, by: 60 },
    { name: 'bike, piano bridge', n: 33, x: 100, frames: 144 },
    { name: 'puy du fou, catapult', n: 34, x: 118, frames: 96, first: FIRST.fling, by: 70 },
    { name: 'rascal', n: 30, x: 272, frames: 192, outfit: 'football', first: FIRST.fox, by: 170, budget: 400000,
      prep2: function (G) { var f = near(G, 'fox', G.p.x); f.t2 = 120; } },
    { name: 'saint-malo, balloons', n: 35, x: 196, frames: 144, first: FIRST.balloons, by: 70 }
  ];

  /* ---- copying the world (as the playtest robot does) ---------------------------- */
  var KEEP = { def: 1, th: 1, L: 1, gfx: 1, light: 1, deco: 1 };
  var copy = function (v, memo, top) {
    if (v === null || typeof v !== 'object') return v;
    if (memo.has(v)) return memo.get(v);
    if (ArrayBuffer.isView(v)) { var t = v.slice(); memo.set(v, t); return t; }
    var proto = Object.getPrototypeOf(v), o;
    if (Array.isArray(v)) { o = []; memo.set(v, o); for (var i = 0; i < v.length; i++) o[i] = copy(v[i], memo); return o; }
    if (proto !== Object.prototype && proto !== null) return v;
    o = {}; memo.set(v, o);
    for (var k in v) o[k] = top && KEEP[k] ? v[k] : copy(v[k], memo);
    return o;
  };
  var snap = function () { return copy(BB.game.G(), new Map(), true); };
  var restore = function (s) { var G = BB.game.G(), k; for (k in G) delete G[k]; var c = copy(s, new Map(), true); for (k in c) G[k] = c[k]; };
  var MOVES = [
    { right: 1, b: 1 }, { right: 1, b: 1, a: 'press' }, { right: 1, b: 1, a: 'hold' }, { right: 1 }, { right: 1, a: 'press' },
    { right: 1, a: 'hold' }, { a: 'press' }, { a: 'hold' }, { left: 1, a: 'hold' }, { left: 1 }, { left: 1, a: 'press' }, {}
  ];
  var keys = function (m, a) { return { left: !!m.left, right: !!m.right, b: !!m.b, a: a, up: false, down: false, start: false, select: false }; };
  var doomed = function (G) {
    var p = G.p;
    if (p.ground || p.vy <= 0 || G.water || p.lift) return false;
    var x0 = Math.floor(p.x / T) - 1, x1 = Math.floor((p.x + p.w - 1) / T) + 1, r0 = Math.floor((p.y + p.h) / T);
    for (var x = Math.max(0, x0); x <= Math.min(G.w - 1, x1); x++) for (var r = Math.max(0, r0); r < G.h; r++) if (G.map[r * G.w + x]) return false;
    return !G.ents.some(function (e) { return (e.k === 'plat' || e.surf) && e.alive && e.x < p.x + p.w + 24 && e.x + e.w > p.x - 24 && e.y > p.y; });
  };
  var near = function (G, k, x) {
    var best = null;
    G.ents.forEach(function (e) { if (e.k === k && (!best || Math.abs(e.x - x) < Math.abs(best.x - x))) best = e; });
    return best;
  };

  /* ---- setting a scene ------------------------------------------------------------ */
  var setup = function (sc) {
    var s = BB.game.save();
    s.outfit = sc.outfit || 'school'; s.power = sc.power || 0; s.at = sc.n;
    BB.game.startLevel(sc.n); BB.game.go('play');
    var G = BB.game.G(), p = G.p;
    G.ents = G.ents.filter(function (e) { return e.k !== 'dadrun' && !(G.n > 20 && e.k === 'check'); });
    if (sc.x !== undefined) {
      // on the first floor at or after tile x (a start over a gap would be a fall)
      var fx = sc.x, fy = -1;
      for (; fx < G.w && fy < 0; fx++) for (var y = sc.row || 0; y < G.h; y++) if (G.map[y * G.w + fx]) { fy = y; break; }
      p.x = (fx - 1) * T; p.y = fy * T - p.h;
      // (and safe from bumps while he lands: the blink is over before filming starts)
      p.vx = p.vy = 0; p.inv = sc.settle || 20; G.safe = { x: p.x, y: p.y };
      G.cam.x = Math.max(0, Math.min(G.w * T - BB.W, p.x + p.w / 2 - BB.W * 0.4));
      G.cam.y = Math.max(0, Math.min(G.h * T - BB.H, p.y + p.h / 2 - BB.H * 0.55));
    }
    if (sc.prep) sc.prep(G, sc);
    BB.steps(sc.settle || 20, keys({}, false), true);
    if (sc.prep2) sc.prep2(BB.game.G(), sc);
    return { g: snap(), save: JSON.stringify(BB.game.save()) };
  };
  var putSave = function (j) { var s = BB.game.save(), o = JSON.parse(j), k; for (k in s) delete s[k]; for (k in o) s[k] = o[k]; };

  /* ---- finding a way through ------------------------------------------------------
     Best-first, as the playtest robot: a short move from the most
     promising moment so far, over and over. Never hit, never a fall,
     never the end of the level; done when the scene's thing is done and
     the run is long enough to fill the scene. */
  var search = function (sc, root) {
    var G = BB.game.G(), need = sc.frames + 6, budget = sc.budget || 150000, n2 = 0;
    var goal = function (G) { return (sc.go !== undefined ? sc.go : G.w - 4) * T; };
    var h = function (G, ev) {
      var p = G.p;
      if (!ev && sc.first) return 1e5 + sc.first.h(G);
      return Math.abs(goal(G) - p.x) + (sc.gy !== undefined ? Math.abs(sc.gy * T - p.y) : 0);
    };
    var heap = [], seen = {};
    var push = function (node) { heap.push(node); var i = heap.length - 1; while (i > 0) { var j = (i - 1) >> 1; if (heap[j].f <= heap[i].f) break; var t = heap[i]; heap[i] = heap[j]; heap[j] = t; i = j; } };
    var pop = function () { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var i = 0; for (;;) { var l = i * 2 + 1, r = l + 1, m = i; if (l < heap.length && heap[l].f < heap[m].f) m = l; if (r < heap.length && heap[r].f < heap[m].f) m = r; if (m === i) break; var t = heap[i]; heap[i] = heap[m]; heap[m] = t; i = m; } } return top; };
    restore(root.g);
    var ev0 = !sc.first || sc.first.done(BB.game.G());
    push({ s: root.g, f: h(BB.game.G(), ev0), d: 0, held: false, ev: ev0, prev: null, m: null });
    while (heap.length && n2 < budget) {
      var node = pop();
      for (var mi = 0; mi < MOVES.length; mi++) {
        var m = MOVES[mi];
        if (m.a === 'hold' && !node.held) continue;
        restore(node.s); n2++;
        G = BB.game.G();
        var hp0 = G.hp, pw0 = G.p.power;
        if (m.a === 'press') BB.steps(1, keys(m, false), true);
        BB.steps(m.a === 'press' ? STEP - 1 : STEP, keys(m, !!m.a), true);
        G = BB.game.G();
        var p = G.p;
        if (p.st !== 'play' || p.bubble || G.hp < hp0 || p.power < pw0 || BB.game.scene() !== 'play' || doomed(G)) continue;
        var ev = node.ev || sc.first.done(G), d = node.d + 1;
        if (!ev && sc.by && d * STEP > sc.by) continue;
        var child = { m: m, prev: node, d: d, held: !!m.a, ev: ev };
        if (ev && d * STEP >= need) { R.tries = n2; return child; }
        var key = Math.floor(p.x / 4) + ',' + Math.floor(p.y / 4) + ',' + (p.ground ? 1 : 0) + ',' + (m.a ? 1 : 0) + ',' + (ev ? 1 : 0) + ',' + Math.floor(G.tick / 20) % 16;
        if (seen[key]) continue;
        seen[key] = 1;
        // a little dearer to stand about or go back: it should look like playing
        child.f = h(G, ev) + d * 0.15 + (m.left ? 6 : 0) + (!m.right && !m.a ? 3 : 0);
        child.s = snap();
        push(child);
      }
    }
    R.tries = n2;
    return null;
  };
  var framesOf = function (node) {
    var ms = [], fr = [], i;
    for (var q = node; q && q.prev; q = q.prev) ms.unshift(q.m);
    ms.forEach(function (m) {
      if (m.a === 'press') { fr.push(keys(m, false)); for (i = 1; i < STEP; i++) fr.push(keys(m, true)); }
      else for (i = 0; i < STEP; i++) fr.push(keys(m, !!m.a));
    });
    return fr;
  };

  var plans = R.plans = {};
  R.plan = function (i) {
    var sc = SCENES[i], t0 = performance.now(), root = setup(sc);
    if (sc.inputs) { plans[i] = { root: root, fr: sc.inputs() }; return 'scene ' + i + ': scripted'; }
    var end = search(sc, root);
    putSave(root.save);
    if (!end) return 'scene ' + i + ' (' + sc.name + '): no way found in ' + R.tries + ' tries';
    plans[i] = { root: root, fr: framesOf(end) };
    return 'scene ' + i + ' (' + sc.name + '): ' + plans[i].fr.length + ' frames, ' + R.tries + ' tries, ' + Math.round(performance.now() - t0) + 'ms';
  };

  /* ---- looking and filming ----------------------------------------------------- */
  // one frame, to choose a spot: REEL.look(18, 140), or a scene's start: REEL.look(i)
  R.look = function (n, x, row) {
    var sc = x === undefined ? SCENES[n] : { n: n, x: x, row: row };
    var root = setup(sc);
    BB.steps(0, keys({}, false), false);
    putSave(root.save);
    var G = BB.game.G();
    return { level: G.n, w: G.w, h: G.h, p: [Math.round(G.p.x / T), Math.round((G.p.y + G.p.h) / T)] };
  };
  // play a planned scene to frame f (default: all of it) and show it
  R.show = function (i, f) {
    var pl = plans[i], sc = SCENES[i];
    restore(pl.root.g); putSave(pl.root.save);
    var n = Math.min(f === undefined ? sc.frames : f, sc.frames);
    for (var k = 0; k < n; k++) BB.steps(1, pl.fr[k] || keys({}, false), true);
    BB.steps(0, keys({}, false), false);
    var G = BB.game.G();
    return { frame: n, p: [Math.round(G.p.x / T), Math.round((G.p.y + G.p.h) / T)], st: G.p.st };
  };
  var blob = function () { return new Promise(function (res) { BB.cv.toBlob(res, 'image/png'); }); };
  R.film = async function (only) {
    var list = only || SCENES.map(function (s, i) { return i; });
    var total = list.reduce(function (n, i) { return n + SCENES[i].frames; }, 0), gi = 0;
    var line = say('filming ' + list.length + ' scenes, ' + total + ' frames (' + (total / FPS).toFixed(1) + 's)…');
    await fetch('/reel/clear', { method: 'POST' });
    R.sounds = [];
    for (var li = 0; li < list.length; li++) {
      var i = list[li], sc = SCENES[i];
      if (!plans[i]) say(R.plan(i));
      var pl = plans[i];
      restore(pl.root.g); putSave(pl.root.save);
      for (var f = 0; f < sc.frames; f++) {
        R.t = gi / FPS; R.listen = true;
        BB.steps(1, pl.fr[f] || keys({}, false), false);
        R.listen = false;
        // in from black at the start, and out to black at the end
        var a = Math.max(gi < FADE_IN ? 1 - gi / FADE_IN : 0, gi >= total - FADE_OUT ? (gi - (total - FADE_OUT) + 1) / FADE_OUT : 0);
        if (a > 0) { BB.ctx.setTransform(1, 0, 0, 1, 0, 0); BB.ctx.fillStyle = 'rgba(12,8,20,' + Math.min(1, a).toFixed(3) + ')'; BB.ctx.fillRect(0, 0, BB.cv.width, BB.cv.height); }
        await fetch('/reel/frame?i=' + gi, { method: 'POST', body: await blob() });
        gi++;
      }
      line.textContent = 'filmed ' + (li + 1) + '/' + list.length + ' (' + gi + ' frames)';
    }
    await R.soundtrack(total);
    say('<span class="ok">done: ' + gi + ' frames and the soundtrack</span>');
    return gi;
  };

  /* ---- the soundtrack -------------------------------------------------------------
     The game's own sound chip (core.js), pointed at an offline context
     whose clock is ours: the song is scheduled as the clock is walked
     forward, and each sound the scenes made is played at its moment. */
  R.soundtrack = async function (frames) {
    var sr = 48000, dur = frames / FPS, off = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);
    R.clock = 0;
    var chip = new Proxy(off, { get: function (t, k) {
      if (k === 'currentTime') return R.clock;
      if (k === 'state') return 'running';
      var v = t[k];
      return typeof v === 'function' ? v.bind(t) : v;
    } });
    window.AudioContext = function () { return chip; };
    BB.setMute(false);
    BB.audio();
    R.realMusic(SONG);
    var evs = R.sounds.slice().sort(function (a, b) { return a.t - b.t; }), ei = 0;
    for (var t = 0; t < dur; t += 0.1) {
      while (ei < evs.length && evs[ei].t < t + 0.1) {
        R.clock = evs[ei].t;
        if (evs[ei].note) R.note(evs[ei].note); else R.sfx(evs[ei].n);
        ei++;
      }
      R.clock = t;
      await new Promise(function (r) { setTimeout(r, 60); });
    }
    R.realMusic('');
    var buf = await off.startRendering();
    // as loud as it can be without clipping (the game plays it quietly,
    // under whatever else is on), and the last moments fade with the picture
    var fo = Math.round(sr * FADE_OUT / FPS), peak = 0, c, d, i;
    for (c = 0; c < 2; c++) { d = buf.getChannelData(c); for (i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); }
    var gain = peak ? 0.9 / peak : 1;
    for (c = 0; c < 2; c++) { d = buf.getChannelData(c); for (i = 0; i < d.length; i++) d[i] *= gain * (i >= d.length - fo ? (d.length - i) / fo : 1); }
    await fetch('/reel/audio', { method: 'POST', body: wav(buf) });
    return evs.length;
  };
  var wav = function (buf) {
    var n = buf.length, ch = [buf.getChannelData(0), buf.getChannelData(1)], b = new ArrayBuffer(44 + n * 4), v = new DataView(b);
    var str = function (o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); str(8, 'WAVE'); str(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, buf.sampleRate, true);
    v.setUint32(28, buf.sampleRate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 4, true);
    for (var i = 0, o = 44; i < n; i++) for (var c = 0; c < 2; c++, o += 2) v.setInt16(o, Math.max(-1, Math.min(1, ch[c][i])) * 32767, true);
    return new Blob([b], { type: 'audio/wav' });
  };
})();
