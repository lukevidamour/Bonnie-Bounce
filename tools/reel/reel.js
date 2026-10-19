/* ==========================================================================
   reel.js — films the trailer (index.html; README: "Making a trailer").

   Each scene is a stretch of one level. Bonnie is put down at its start,
   and the playtest robot's search (tools/playtest.html, here keeping the
   path it took) finds a run that's never hit and looks like someone
   playing well (STYLE): the scene's beats in order (Bear found, a
   baguette jumped, a stomp on Rascal), then onwards. That path is played
   again from the same moment, a frame at a time, and each frame goes to
   serve.js. The game has no dice in its rules (only in sparkles), so the
   replay is the same run.

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
  /* Hard cuts, start and end (owner, 19 Oct): where video doesn't
     autoplay, the first frame is the picture people see, so it must be
     play, not a dark screen; the sound only eases out over DECLICK
     seconds at the very end, so it stops without a click. */
  var SONG = 'hills', DECLICK = 0.03;
  var out = document.getElementById('out');
  var say = function (html) { var d = document.createElement('div'); d.innerHTML = html; out.appendChild(d); return d; };
  BB.reel = true;
  BB.voice = null;     // the grown-ups' recorded voices are theirs, not the trailer's
  // each level's own tune is silenced: the trailer has one song under it all
  R.realMusic = BB.music;
  BB.music = function () {};

  /* ---- the scenes ---------------------------------------------------------------
     n: level · x: start tile (row: on the floor below this row, else the
     first floor from the top) · frames (cut to the song's bars) · pre:
     frames played before the cut, so a scene opens mid-run · outfit ·
     beats: things to happen in order, each by a frame of the scene
     (Bear found, the balloons caught, a stomp on Rascal) · then: 'on'
     keeps heading right after the last beat, 'stay' just plays there ·
     style: what playing well looks like here (see STYLE) · prep(G) sets
     the scene once Bonnie is down, prep2(G) after it has settled */
  var dist = function (G, e) { var p = G.p; return e ? Math.abs(e.x + e.w / 2 - p.x - p.w / 2) + Math.abs(e.y + e.h / 2 - p.y - p.h / 2) : 0; };
  var BEAT = {
    // Bear (the grey cat) spotted, and following
    bear: { done: function (G) { return G.ents.some(function (e) { return e.k === 'bear' && e.mode === 'follow'; }); }, h: function (G) { return dist(G, near(G, 'bear', G.p.x)); } },
    balloons: { done: function (G) { return G.p.lift > 0; }, h: function (G) { return dist(G, near(G, 'balloons', G.p.x)); } },
    // up the steam from a chimney
    steam: { done: function (G) { var s = near(G, 'steam', G.p.x); return s && G.p.y < s.y + 8 && G.p.x + G.p.w > s.x && G.p.x < s.x + s.w; }, h: function (G) { var s = near(G, 'steam', G.p.x); return Math.abs(s.x + s.w / 2 - G.p.x - G.p.w / 2) + Math.abs(s.y - G.p.y); } },
    // through a wall that only looks solid, into a secret room…
    secret: { done: function (G) { return G.secretIn > 0; }, h: function (G) { return Math.abs(G.p.x - (G.secretX || G.p.x)); } },
    // …and the golden medal in it
    medal: { done: function (G) { return G.ents.some(function (e) { return e.k === 'medal' && !e.alive; }); }, h: function (G) { return dist(G, near(G, 'medal', G.p.x)); } },
    // a catapult's fling, high over the walls
    fling: { done: function (G) { return G.p.y < 3 * T; }, h: function (G) { var c = null; G.ents.forEach(function (e) { if (e.k === 'spring' && e.sp.fling && (!c || Math.abs(e.x - G.p.x) < Math.abs(c.x - G.p.x))) c = e; }); return dist(G, c); } },
    // on a surfboard, out on the waves
    surf: { done: function (G) { return !!(G.p.on && G.p.on.surf && G.p.on.state !== 'wait'); }, h: function (G) { var b = null; G.ents.forEach(function (e) { if (e.surf && (!b || Math.abs(e.x - G.p.x) < Math.abs(b.x - G.p.x))) b = e; }); return dist(G, b) + (G.p.on && G.p.on.surf ? 0 : 20); } },
    // a baguette from Rascal, jumped clean over
    // (no distance to close: the baguette comes to him, whatever he does, so
    //  the search just finds the cheapest wait and one well-timed jump)
    dodge: { done: function (G) { var p = G.p; return !p.ground && G.ents.some(function (e) { return e.k === 'baguette' && e.alive && e.x + e.w > p.x && e.x < p.x + p.w && e.y > p.y + p.h && e.y < p.y + p.h + 24; }); }, h: function () { return 0; } },
    // a stomp on Rascal, while he's dizzy
    fox: { done: function (G) { var f = near(G, 'fox', G.p.x); return f && f.hp < 6; }, h: function (G) { var f = near(G, 'fox', G.p.x); return Math.abs(f.x + f.w / 2 - G.p.x - G.p.w / 2) + (f.st === 'dizzy' ? 0 : 60); } }
  };
  var by = function (beat, f) { return { done: beat.done, h: beat.h, by: f }; };
  /* What playing well looks like: the cost of each kind of move, in
     pixels of progress. A jump is dear, so it's only made when it's
     worth it, and once made it's held (letting go at once is a twitchy
     hop); going back, turning about and dawdling cost a little; running
     is free. Without these the robot hops about all the time — it gets
     there, but it doesn't look like anyone playing. */
  var STYLE = { jump: 30, short: 24, left: 12, turn: 12, wait: 4, walk: 3, run: 0, pace: 6 };
  var SCENES = R.SCENES = [
    { name: 'cloud kingdom', n: 8, x: 92, frames: 144 },
    { name: 'coral reef, swimming', n: 4, x: 100, frames: 96, go: 124, gy: 5, style: { jump: 6, short: 6 } },
    { name: 'sunset harbour: Bear', n: 11, x: 124, frames: 216, outfit: 'pirate', beats: [by(BEAT.bear, 100)] },
    // (from the moment he lands on the first block: then it's all a walk along them)
    { name: 'moon garden: the musical blocks', n: 18, x: 268, pre: 72, frames: 72, go: 284, outfit: 'pyjamas', style: { walk: 0, run: 4 } },
    // (from the ledge by the gap in front of the wall; the room's a dead end, so he stays to enjoy it)
    { name: 'frosty peaks: a secret room and its medal', n: 7, x: 219, pre: 0, frames: 120, outfit: 'super', beats: [by(BEAT.secret, 85), by(BEAT.medal, 112)], then: 'stay',
      prep: function (G) { G.secretX = 225 * T; } },
    { name: 'paris rooftops: up the steam', n: 26, x: 130, frames: 144, beats: [by(BEAT.steam, 100)] },
    { name: "o'gliss: the slides", n: 31, x: 54, frames: 96 },
    // (on the sand until he hops onto the board, which waits at its edge — the beach ends at
    // tile 33 — and from then on, on the board or in the air over it: anything else is a wipeout)
    { name: 'hossegor: surfing', n: 32, x: 24, frames: 144, beats: [by(BEAT.surf, 50)],
      keep: function (G, st) { var p = G.p, board = !!(p.on && p.on.surf); return st < 1 ? board || p.x + p.w <= 34 * T : board || !p.ground; } },
    { name: 'the bike ride: the musical bridge', n: 33, x: 98, frames: 168 },
    // (running along the grass straight onto it: no hops on the way)
    { name: 'puy du fou: the catapult', n: 34, x: 119, pre: 0, frames: 96, beats: [by(BEAT.fling, 60)] },
    /* Rascal, staged so it all happens in one shot: he's just past Bonnie,
       running off with Brocco; at frame 40 he turns and lobs a baguette
       back, right at Bonnie (t2 140, from 65px: a baguette's reach), then
       at frame 111 takes his great leap back (t2 211) and lands dizzy, for
       Bonnie to run over and stomp (game.js, KINDS.fox) */
    { name: 'rascal', n: 30, x: 273, frames: 192, pre: 12, outfit: 'football', fine: true, beats: [by(BEAT.dodge, 110), by(BEAT.fox, 170)], then: 'stay',
      style: { wait: 0.3, left: 10, turn: 10, walk: 1 }, budget: 400000,
      prep2: function (G) { var f = near(G, 'fox', G.p.x); f.x = G.p.x + 24; f.vx = 1.1 * 0.94; f.face = 1; f.t2 = 100; f.throwT = 0; G.reelX0 = G.p.x; },
      // (he stands his ground until the baguette's jumped: it's thrown at him, and he hops it as it lands)
      keep: function (G, st) { return st >= 1 || Math.abs(G.p.x - G.reelX0) <= 3; } },
    { name: 'saint-malo: balloons', n: 35, x: 196, frames: 240, beats: [by(BEAT.balloons, 70)] }
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
    { right: 1, b: 1 }, { right: 1, b: 1, a: 'press' }, { right: 1, b: 1, a: 'hold' }, { b: 1, a: 'hold' },
    { right: 1 }, { right: 1, a: 'press' }, { right: 1, a: 'hold' },
    {}, { a: 'press' }, { a: 'hold' },
    { left: 1, b: 1 }, { left: 1, b: 1, a: 'press' }, { left: 1, b: 1, a: 'hold' }, { left: 1 }, { left: 1, a: 'hold' }
  ];
  var keys = function (m, a) { return { left: !!m.left, right: !!m.right, b: !!m.b, a: a, up: false, down: false, start: false, select: false }; };
  var dirOf = function (m) { return m.right ? 1 : m.left ? -1 : 0; };
  // (settled: nothing left to do, so standing is the thing to do, and free)
  var cost = function (S, node, m, settled) {
    var c = 0.15, d0 = node.m ? dirOf(node.m) : 0, d1 = dirOf(m);
    if (m.a === 'press') c += S.jump;
    if (node.held && node.holdSteps < 2 && m.a !== 'hold') c += S.short;
    if (m.left) c += S.left;
    if (d0 && d1 && d0 !== d1) c += S.turn;
    if (!d1 && !m.a && !settled) c += S.wait;
    if (d1 && !m.b) c += S.walk; else if (d1) c += S.run;
    if (node.m && d0 && d1 && !!node.m.b !== !!m.b) c += S.pace;
    return c;
  };
  var doomed = function (G) {
    var p = G.p;
    if (p.ground || p.vy <= 0 || G.water || p.lift) return false;
    var x0 = Math.floor(p.x / T) - 1, x1 = Math.floor((p.x + p.w - 1) / T) + 1, r0 = Math.floor((p.y + p.h) / T);
    for (var x = Math.max(0, x0); x <= Math.min(G.w - 1, x1); x++) for (var r = Math.max(0, r0); r < G.h; r++) if (G.map[r * G.w + x]) return false;
    return !G.ents.some(function (e) { return (e.k === 'plat' || e.surf) && e.alive && e.x < p.x + p.w + 24 && e.x + e.w > p.x - 24 && e.y > p.y; });
  };
  var near = function (G, k, x) {
    var best = null;
    G.ents.forEach(function (e) { if (e.k === k && e.alive !== false && (!best || Math.abs(e.x - x) < Math.abs(best.x - x))) best = e; });
    return best;
  };

  /* ---- setting a scene ------------------------------------------------------------ */
  var setup = function (sc) {
    var s = BB.game.save();
    // a fresh save for every scene: a medal found in an earlier take would show as a pale outline
    s.outfit = sc.outfit || 'school'; s.power = sc.power || 0; s.at = sc.n; s.medals = {}; s.bears = {};
    BB.game.startLevel(sc.n); BB.game.go('play');
    var G = BB.game.G(), p = G.p;
    G.ents = G.ents.filter(function (e) { return e.k !== 'dadrun' && !(G.n > 20 && e.k === 'check'); });
    if (sc.x !== undefined) {
      /* on the first floor at or after tile x (a start over a gap would be
         a fall) — something to stand on, not a star, a hidden block, water,
         spikes or a secret wall, which would drop him through it */
      var TL = BB.TILES, STAND = [TL.GROUND, TL.BRICK, TL.Q, TL.USED, TL.HARD, TL.PIPE, TL.PIPER, TL.PIPETOP, TL.PIPETOPR, TL.SEMI, TL.CONVL, TL.CONVR, TL.CRATE, TL.WALL];
      var fx = sc.x, fy = -1;
      for (; fx < G.w && fy < 0; fx++) for (var y = sc.row || 0; y < G.h; y++) if (STAND.indexOf(G.map[y * G.w + fx]) >= 0) { fy = y; break; }
      p.x = (fx - 1) * T; p.y = fy * T - p.h;
      // (and safe from bumps while he lands, and a little after: the blink is over before filming starts)
      p.vx = p.vy = 0; p.inv = (sc.settle || 20) + Math.min(preOf(sc), 12); G.safe = { x: p.x, y: p.y };
      G.cam.x = Math.max(0, Math.min(G.w * T - BB.W, p.x + p.w / 2 - BB.W * 0.4));
      G.cam.y = Math.max(0, Math.min(G.h * T - BB.H, p.y + p.h / 2 - BB.H * 0.55));
    }
    if (sc.prep) sc.prep(G, sc);
    BB.steps(sc.settle || 20, keys({}, false), true);
    if (sc.prep2) sc.prep2(BB.game.G(), sc);
    return { g: snap(), save: JSON.stringify(BB.game.save()) };
  };
  var putSave = function (j) { var s = BB.game.save(), o = JSON.parse(j), k; for (k in s) delete s[k]; for (k in o) s[k] = o[k]; };
  var preOf = function (sc) { return sc.pre === undefined ? 24 : sc.pre; };

  /* ---- finding a way through ------------------------------------------------------
     Best-first, as the playtest robot, but counting the cost of the
     moves on the way (STYLE): the cheapest good-looking run, not just
     the quickest. Never hit, never a fall, never the end of the level;
     done when the scene's beats have happened, in order and in time, and
     the run is long enough to fill the scene. */
  var search = function (sc, root) {
    var G = BB.game.G(), pre = preOf(sc), need = pre + sc.frames + 6, budget = sc.budget || 200000, n2 = 0;
    var S = Object.assign({}, STYLE, sc.style || {}), beats = sc.beats || [];
    var goal = (sc.go !== undefined ? sc.go : G.w - 4) * T;
    var stageOf = function (G, s) { while (s < beats.length && beats[s].done(G)) s++; return s; };
    var h = function (G, s) {
      if (s < beats.length) return (beats.length - s) * 1e5 + beats[s].h(G);
      if (sc.then === 'stay') return 0;
      // (gy: a row to make for too, as well as onwards)
      return Math.abs(goal - G.p.x) + (sc.gy !== undefined ? Math.abs(sc.gy * T - G.p.y) * 1.5 : 0);
    };
    var heap = [], seen = {};
    var push = function (node) { heap.push(node); var i = heap.length - 1; while (i > 0) { var j = (i - 1) >> 1; if (heap[j].f <= heap[i].f) break; var t = heap[i]; heap[i] = heap[j]; heap[j] = t; i = j; } };
    var pop = function () { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var i = 0; for (;;) { var l = i * 2 + 1, r = l + 1, m = i; if (l < heap.length && heap[l].f < heap[m].f) m = l; if (r < heap.length && heap[r].f < heap[m].f) m = r; if (m === i) break; var t = heap[i]; heap[i] = heap[m]; heap[m] = t; i = m; } } return top; };
    restore(root.g);
    var s0 = stageOf(BB.game.G(), 0);
    push({ s: root.g, g: 0, f: h(BB.game.G(), s0), d: 0, held: false, holdSteps: 0, stage: s0, prev: null, m: null });
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
        var d = node.d + 1, st = stageOf(G, node.stage);
        // (keep: what has to stay true, once the beats so far have happened — on the surfboard, say)
        if (sc.keep && !sc.keep(G, st)) continue;
        if (st < beats.length && beats[st].by && d * STEP > pre + beats[st].by) continue;
        var child = { m: m, prev: node, d: d, held: !!m.a, holdSteps: m.a === 'press' ? 1 : m.a === 'hold' ? node.holdSteps + 1 : 0, stage: st };
        if (st === beats.length && d * STEP >= need) { R.tries = n2; return child; }
        /* (a place, and roughly when, as the playtest robot keys it; but
           once there's nothing left to do, the same place a moment later
           is a new place, or standing still would never be allowed) */
        var settled = st === beats.length && (sc.then === 'stay' || Math.abs(goal - p.x) < 8);
        // (and how fast: on ice he creeps up to speed, and a creep is still getting somewhere)
        // (fine: a scene where waiting for the moment is the play, so every step is a new moment)
        var key = Math.floor(p.x / 4) + ',' + Math.floor(p.y / 4) + ',' + Math.round(p.vx * 2) + ',' + (p.ground ? 1 : 0) + ',' + (m.a ? 1 : 0) + ',' + st + ',' + (settled || sc.fine ? 'd' + d : Math.floor(G.tick / 20) % 16);
        if (seen[key]) continue;
        seen[key] = 1;
        child.g = node.g + cost(S, node, m, settled);
        child.f = h(G, st) + child.g;
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
    if (!end) { delete plans[i]; return 'scene ' + i + ' (' + sc.name + '): no way found in ' + R.tries + ' tries'; }
    plans[i] = { root: root, fr: framesOf(end) };
    return 'scene ' + i + ' (' + sc.name + '): ' + R.stats(i) + ', ' + R.tries + ' tries, ' + Math.round(performance.now() - t0) + 'ms';
  };
  // how it plays, in the part that's filmed: jumps, frames going back, standing, turns
  R.stats = function (i) {
    var fr = plans[i].fr.slice(preOf(SCENES[i]), preOf(SCENES[i]) + SCENES[i].frames), j = 0, back = 0, still = 0, turns = 0, last = 0;
    fr.forEach(function (k, f) {
      if (k.a && (!f || !fr[f - 1].a)) j++;
      if (k.left) back++;
      if (!k.left && !k.right) still++;
      var d = k.right ? 1 : k.left ? -1 : 0;
      if (d && last && d !== last) turns++;
      if (d) last = d;
    });
    return j + ' jumps, ' + back + ' back, ' + still + ' still, ' + turns + ' turns';
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
    var pl = plans[i], sc = SCENES[i], pre = preOf(sc);
    restore(pl.root.g); putSave(pl.root.save);
    var n = Math.min(f === undefined ? sc.frames : f, sc.frames);
    for (var k = 0; k < pre + n; k++) BB.steps(1, pl.fr[k] || keys({}, false), true);
    BB.steps(0, keys({}, false), false);
    var G = BB.game.G();
    return { frame: n, p: [Math.round(G.p.x / T), Math.round((G.p.y + G.p.h) / T)], st: G.p.st };
  };
  // a contact sheet of scene i, frames every `step` (from..to; big: full size), saved as out/<name>.png: REEL.sheet(10, 12, 'rascal')
  R.sheet = async function (i, step, name, from, to, big) {
    var sc = SCENES[i], w = big ? 512 : 256, h = big ? 288 : 144, per = big ? 2 : 4, list = [];
    for (var f = from || 0; f < Math.min(sc.frames, to || sc.frames); f += step || 24) list.push(f);
    var c = document.createElement('canvas'), x = c.getContext('2d');
    c.width = w * per; c.height = (h + 12) * Math.ceil(list.length / per);
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); x.font = '10px monospace';
    list.forEach(function (f, k) {
      var r = R.show(i, f), cx = (k % per) * w, cy = Math.floor(k / per) * (h + 12);
      x.drawImage(BB.cv, cx, cy + 12, w, h); x.fillStyle = '#fff'; x.fillText('f' + f + ' ' + JSON.stringify(r.p), cx + 2, cy + 10);
    });
    await fetch('/reel/frame?i=' + (name || 'sheet' + i), { method: 'POST', body: await new Promise(function (r) { c.toBlob(r, 'image/png'); }) });
    return list.length;
  };
  /* Frames go to serve.js a beat (24) at a time, each a PNG after its
     length: a request per frame crawls when the browser is in the
     background, and toDataURL doesn't wait on the browser at all. */
  var batch = [], batchAt = 0;
  var grab = function () {
    var b64 = BB.cv.toDataURL('image/png').split(',')[1], bin = atob(b64), png = new Uint8Array(bin.length + 4);
    new DataView(png.buffer).setUint32(0, bin.length);
    for (var i = 0; i < bin.length; i++) png[i + 4] = bin.charCodeAt(i);
    batch.push(png);
  };
  var flush = async function () {
    if (!batch.length) return;
    var body = new Blob(batch);
    await fetch('/reel/frames?i=' + batchAt, { method: 'POST', body: body });
    batchAt += batch.length; batch = [];
  };
  R.film = async function (only) {
    var list = only || SCENES.map(function (s, i) { return i; });
    var total = list.reduce(function (n, i) { return n + SCENES[i].frames; }, 0), gi = 0;
    var line = say('filming ' + list.length + ' scenes, ' + total + ' frames (' + (total / FPS).toFixed(1) + 's)…');
    await fetch('/reel/clear', { method: 'POST' });
    R.sounds = []; batch = []; batchAt = 0;
    for (var li = 0; li < list.length; li++) {
      var i = list[li], sc = SCENES[i];
      if (!plans[i]) say(R.plan(i));
      var pl = plans[i], pre = preOf(sc);
      restore(pl.root.g); putSave(pl.root.save);
      for (var f = 0; f < pre; f++) BB.steps(1, pl.fr[f] || keys({}, false), true);
      for (f = 0; f < sc.frames; f++) {
        R.t = gi / FPS; R.listen = true;
        BB.steps(1, pl.fr[pre + f] || keys({}, false), false);
        R.listen = false;
        grab(); gi++;
        if (batch.length === 24) await flush();
      }
      line.textContent = 'filmed ' + (li + 1) + '/' + list.length + ' (' + gi + ' frames)';
    }
    await flush();
    await R.soundtrack(total);
    say('<span class="ok">done: ' + gi + ' frames and the soundtrack</span>');
    return gi;
  };

  /* ---- the soundtrack -------------------------------------------------------------
     The game's own sound chip (core.js), pointed at an offline context
     whose clock is ours: the song is scheduled as the clock is walked
     forward (its timer run by hand, index.html), and each sound the
     scenes made is played at its moment. */
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
      for (var id in window.REEL_TIMERS) window.REEL_TIMERS[id]();
    }
    R.realMusic('');
    var buf = await off.startRendering();
    // as loud as it can be without clipping (the game plays it quietly,
    // under whatever else is on), and no click as it stops
    var fo = Math.round(sr * DECLICK), peak = 0, c, d, i;
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
