/* ==========================================================================
   game.js — Bonnie Bounce itself: the physics, Bonnie, everything he meets,
   the screens between levels, and the save.

   Scenes: title → story (first time) → map → card → play → clear → map …
   with pause, game over and the ending. One world is loaded at a time
   into G; the things that last across levels (lives, stars, score,
   Bonnie's power, which levels are open) live in `save`, in localStorage.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, TL = BB.TILES, CT = BB.CONTENTS, T = 8, H = BB.H;
  var reduce = BB.reduce;
  var sfx = BB.sfx;

  /* ---- feel -----------------------------------------------------------------
     A jump rises on light gravity while A is held and falls on heavy
     gravity — so a tap is a hop and a hold is a leap, and the fall is
     always quick (the floaty-up, snappy-down of the classic). Held from a
     walk it rises ~50px (six tiles); from a run a little more. Coyote time
     and a jump buffer forgive a press a few frames late or early. */
  var GRAV = 0.42, GRAV_HOLD = 0.17, FALL = 4.6;
  var WALK = 1.4, RUN = 2.25, ACC = 0.07, ACC_RUN = 0.09, AIR = 0.075, DEC = 0.1, SKID = 0.22;
  var JUMP = 3.85, JUMP_RUN = 0.2;
  var COYOTE = 6, BUFFER = 7, NUDGE = 4;
  var STOMP = 3.6, STOMP_HELD = 4.6, SPRING = 5.6;
  // under the sea: slow sinking, a stroke on each press
  var W_GRAV = 0.05, W_FALL = 1.1, W_STROKE = 1.75, W_MAX = 1.15, W_ACC = 0.05;
  // on ice: slow to start, slower to stop
  var ICE_ACC = 0.035, ICE_DEC = 0.012, ICE_SKID = 0.07;
  var INV = 120, STAR_T = 600, STAR_WARN = 120;
  var PW = 10, SMALL_H = 15, BIG_H = 25;
  var RUN_CYCLE = ['run1', 'run2', 'run3', 'run2'];
  var COMBO = [100, 200, 400, 800, 1000, 2000, 4000, 8000];

  /* ---- the save ---------------------------------------------------------------- */
  var KEY = 'bonnie-bounce-save';
  var fresh = function () { return { unlocked: 1, cleared: [], lives: 3, stars: 0, score: 0, power: 0, seenStory: false, at: 1, won: false, best: {}, bears: {}, met: {}, outfit: 'school' }; };
  var save = fresh();
  try { var s0 = JSON.parse(localStorage.getItem(KEY)); if (s0 && s0.unlocked) for (var k0 in s0) save[k0] = s0[k0]; } catch (e) {}
  save.bears = save.bears || {}; save.met = save.met || {}; save.outfit = save.outfit || 'school';
  var store = function () { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };
  var hasProgress = function () { return save.unlocked > 1 || save.cleared.length > 0 || save.score > 0; };
  var qs = location.search;
  if (/[?&]debug\b/.test(qs)) save.unlocked = 10;

  var scene = 'title', sceneT = 0, G = null, tick = 0;
  var go = function (s) { scene = s; sceneT = 0; };

  /* ==========================================================================
     THE WORLD
     ========================================================================== */
  var SOLID = [];
  [TL.GROUND, TL.BRICK, TL.Q, TL.USED, TL.HARD, TL.PIPE, TL.PIPER, TL.PIPETOP, TL.PIPETOPR, TL.SPIKE,
    TL.CONVL, TL.CONVR, TL.CRATE, TL.WALL].forEach(function (t) { SOLID[t] = 1; });

  var tileAt = function (tx, ty) {
    if (tx < 0 || tx >= G.w) return TL.WALL;
    // a roof carries on up past the top of the screen, so it can't be jumped over
    if (ty < 0) { var t0 = G.map[tx]; return SOLID[t0] ? t0 : 0; }
    if (ty >= G.h) return 0;
    return G.map[ty * G.w + tx];
  };
  var boxSolid = function (x, y, w, h) {
    var tx0 = Math.floor(x / T), tx1 = Math.floor((x + w - 1) / T), ty0 = Math.floor(y / T), ty1 = Math.floor((y + h - 1) / T);
    for (var ty = ty0; ty <= ty1; ty++) for (var tx = tx0; tx <= tx1; tx++) if (SOLID[tileAt(tx, ty)]) return true;
    return false;
  };
  // stepping down into the top row of a one-way platform lands on it
  var semiAt = function (x, w, yb) {
    if (((yb % T) + T) % T !== 0) return false;
    var ty = yb / T, tx0 = Math.floor(x / T), tx1 = Math.floor((x + w - 1) / T);
    for (var tx = tx0; tx <= tx1; tx++) if (tileAt(tx, ty) === TL.SEMI) return true;
    return false;
  };
  // moving platforms, springs and grumpy rocks you can stand on
  var platAt = function (e) {
    for (var i = 0; i < G.ents.length; i++) {
      var q = G.ents[i];
      if (!q.top || !q.alive || q === e) continue;
      if (e.y + e.h === Math.round(q.y) + (q.topOff || 0) && e.x + e.w > q.x && e.x < q.x + q.w) return q;
    }
    return null;
  };
  var overlap = function (a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; };

  var moveX = function (e, dx) {
    e.rx += dx;
    var m = Math.round(e.rx);
    e.rx -= m;
    var s = m > 0 ? 1 : -1;
    while (m !== 0) {
      if (!boxSolid(e.x + s, e.y, e.w, e.h)) { e.x += s; m -= s; } else { e.rx = 0; return true; }
    }
    return false;
  };
  var moveY = function (e, dy, semis) {
    e.ry += dy;
    var m = Math.round(e.ry);
    e.ry -= m;
    var s = m > 0 ? 1 : -1;
    while (m !== 0) {
      if (s > 0 && semis !== false && semiAt(e.x, e.w, e.y + e.h)) { e.ry = 0; return true; }
      if (!boxSolid(e.x, e.y + s, e.w, e.h)) { e.y += s; m -= s; } else { e.ry = 0; return true; }
    }
    return false;
  };
  var onGround = function (e) { return boxSolid(e.x, e.y + 1, e.w, e.h) || semiAt(e.x, e.w, e.y + e.h); };

  /* ---- loading a world ------------------------------------------------------------ */
  var startLevel = function (n, fromCheck) {
    var L = BB.buildLevel(n), def = L.def, th = A.themes[def.theme];
    G = {
      n: n, def: def, th: th, L: L, w: L.w, h: L.h, gr: L.gr,
      map: new Uint8Array(L.map), cont: new Uint8Array(L.cont), bt: new Uint8Array(L.w * L.h), bumps: [], multi: {},
      ents: [], fx: [], cam: { x: 0, y: 0 }, tick: 0, freeze: 0, shake: 0,
      water: !!def.water, ice: !!def.ice || !!th.ice, check: !!fromCheck, bossOn: false, bossDone: false,
      ambient: [], gfx: theme(def.theme), deco: L.deco, blooms: [], hitstop: 0, kick: 0
    };
    // the sea, where the beach has a gap
    G.sea = new Uint8Array(G.w);
    if (th.sea) for (var x = 0; x < G.w; x++) G.sea[x] = tileAt(x, G.h - 1) === TL.EMPTY ? 1 : 0;
    L.ents.forEach(function (sp) { var e = spawn(sp); if (e) G.ents.push(e); });
    G.light = BB.lighting(th.light, G.w * T, def.seed);
    prepTerrain();
    var start = L.start, chk = null;
    if (fromCheck) G.ents.forEach(function (e) { if (e.k === 'check') { chk = e; e.up = 1; } });
    var p = G.p = {
      x: (chk ? chk.x + 12 : start.x * T), y: 0, w: PW, h: save.power ? BIG_H : SMALL_H, vx: 0, vy: 0, rx: 0, ry: 0,
      face: 1, ground: true, coy: 0, buf: 0, holdT: 0, anim: 0, st: 'play', t: 0, inv: 0, star: 0, throwT: 0,
      crouch: false, on: null, combo: 0, swimT: 0, power: save.power, landed: 0
    };
    p.y = (chk ? chk.sp.row : start.row) * T - p.h;
    // Bear: if he was found in this level before a fall, he's here with Bonnie
    G.trail = [];
    G.ents.forEach(function (e) { if (e.k === 'house') G.house = e; });
    if (bearWith === n) {
      G.ents = G.ents.filter(function (e) { return e.k !== 'bear'; });
      var bear = spawn({ k: 'bear', x: p.x - 14, row: (chk ? chk.sp.row : start.row) });
      bear.mode = 'follow'; bear.active = true; G.ents.push(bear);
    } else bearWith = 0;
    G.cam.x = Math.max(0, Math.min(G.w * T - BB.W, p.x - BB.W * 0.4));
    G.cam.y = Math.max(0, Math.min(G.h * T - H, p.y - H * 0.55));
    BB.music(th.music);
  };

  /* How deep each ground tile sits inside the land (for shading its
     inside darker), and the little things that grow on top of the ground
     and hang from under it — placed once per level, the same every time. */
  var hash = function (x, y, k) { var n = Math.sin(x * 127.1 + y * 311.7 + k * 74.7) * 43758.5453; return n - Math.floor(n); };
  var prepTerrain = function () {
    var w = G.w, h = G.h, th = G.th, dep = new Uint8Array(w * h), q = [], i, x, y;
    for (i = 0; i < w * h; i++) { if (G.map[i] === TL.GROUND) dep[i] = 255; else { dep[i] = 0; q.push(i); } }
    for (var qi = 0; qi < q.length; qi++) {
      var c = q[qi], cx = c % w, cy = (c / w) | 0, nd = dep[c] + 1;
      [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]].forEach(function (n) {
        if (n[0] < 0 || n[1] < 0 || n[0] >= w || n[1] >= h) return;
        var j = n[1] * w + n[0];
        if (dep[j] === 255) { dep[j] = nd; q.push(j); }
      });
    }
    G.depth = dep; G.tiny = []; G.hang = [];
    for (y = 1; y < h; y++) for (x = 0; x < w; x++) {
      if (G.map[y * w + x] !== TL.GROUND) continue;
      var above = G.map[(y - 1) * w + x], below = y < h - 1 ? G.map[(y + 1) * w + x] : -1;
      if ((above === TL.EMPTY || above === TL.COIN) && th.tiny.length && hash(x, y, 1) < 0.42) {
        var name = th.tiny[Math.floor(hash(x, y, 2) * th.tiny.length)], sp = A.tiny[name];
        G.tiny.push({ x: x * T + 0.5 + hash(x, y, 3) * (T - sp.w - 1), y: y * T, s: sp, name: name });
      }
      if (below === TL.EMPTY && th.hang && y > 1 && hash(x, y, 4) < 0.55) G.hang.push({ x: x * T + 1 + hash(x, y, 5) * 6, y: (y + 1) * T, len: 2 + hash(x, y, 6) * 6, ph: hash(x, y, 7) * 6 });
    }
  };

  /* ==========================================================================
     THINGS — every enemy, item and set piece is an entity of one KIND.
       w, h      hitbox      fly  placed by its middle, not its feet
       stomp     can be stomped ('shell' for the snail; false hurts you)
       tough     balls and shells bounce off it (ghosts, rocks, fire)
       update / draw / init as needed
     ========================================================================== */
  var KINDS = {};
  var spawn = function (sp) {
    var K = KINDS[sp.k];
    if (!K) return null;
    var e = {
      k: sp.k, K: K, sp: sp, x: sp.x + (K.ox || 0), y: 0, w: K.w, h: K.h, vx: 0, vy: 0, rx: 0, ry: 0,
      t: 0, st: 0, face: -1, alive: true, active: false, top: !!K.top, enemy: !!K.enemy
    };
    e.y = K.fly ? sp.row * T + 4 - (K.h >> 1) : sp.row * T - K.h;
    if (K.init) K.init(e, sp);
    return e;
  };
  var addEnt = function (k, x, y, o) {
    var K = KINDS[k], e = { k: k, K: K, sp: {}, x: x, y: y, w: K.w, h: K.h, vx: 0, vy: 0, rx: 0, ry: 0, t: 0, st: 0, face: -1, alive: true, active: true, top: !!K.top, enemy: !!K.enemy };
    if (o) for (var key in o) e[key] = o[key];
    if (K.init) K.init(e, e.sp);
    G.ents.push(e);
    return e;
  };
  var fx = function (k, x, y, o) {
    var f = { k: k, x: x, y: y, vx: 0, vy: 0, t: 0, life: 30 };
    if (o) for (var key in o) f[key] = o[key];
    G.fx.push(f);
    return f;
  };
  var points = function (n, x, y) {
    save.score += n;
    fx('text', x, y, { s: String(n), vy: -0.6, life: 36 });
  };
  var addStars = function (n) {
    save.stars += n;
    if (G) G.got = (G.got || 0) + n;
    while (save.stars >= 100) { save.stars -= 100; oneUp(G.p.x, G.p.y - 10); }
  };
  // with lives unlimited, a heart (or a hundred stars) is a burst of points
  var oneUp = function (x, y) {
    save.score += 1000;
    sfx('oneup');
    fx('text', x, y, { s: 'YAY!', vy: -0.6, life: 50, col: '#ff94cc' });
  };

  // a walker: along the ground, turning at walls (and at ledges, if asked)
  var walk = function (e, speed, ledges) {
    if (!e.vx) e.vx = -speed;
    if (moveX(e, e.vx)) e.vx = -e.vx;
    e.vy = Math.min(FALL, e.vy + GRAV);
    if (moveY(e, e.vy)) e.vy = 0;
    if (ledges && e.vy === 0 && onGround(e)) {
      var ahead = e.vx > 0 ? e.x + e.w : e.x - 1;
      if (!boxSolid(ahead, e.y + e.h, 1, 2) && !semiAt(ahead, 1, e.y + e.h)) { e.vx = -e.vx; e.rx = 0; }
    }
    e.face = e.vx > 0 ? 1 : -1;
  };
  var near = function (e, dx) { var p = G.p; return Math.abs(p.x + p.w / 2 - (e.x + e.w / 2)) < dx; };
  var towards = function (e) { var p = G.p; return p.x + p.w / 2 > e.x + e.w / 2 ? 1 : -1; };

  // ---- defeat: a stomp squashes; a ball, a shell, a star or a block flips
  var flip = function (e, from) {
    if (!e.alive || e.dying) return;
    e.dying = 'flip'; e.vy = -3; e.vx = (from || 1) * 0.8; e.t = 0;
    sfx('kick');
  };
  /* A stomp lands with weight: the world holds still for a few frames
     (hit-stop), the baddie squashes flat, then pops in a puff of petals
     and leaves a little flower where it stood. Nothing in this game is
     ever really hurt. */
  var squash = function (e) {
    e.dying = 'flat'; e.t = 0;
    G.hitstop = 4;
    sfx('stomp');
    if (BB.voice && Math.random() < 0.3) BB.voice.play('yay');
  };
  var FLOWER = ['#ff7aa8', '#ffd84a', '#ffffff', '#a88aff', '#ff9a4a', '#7ae8ff'];
  var bloom = function (e) {
    var x = e.x + e.w / 2, feet = e.y + e.h, col = FLOWER[(e.x * 7 | 0) % FLOWER.length];
    fx('puff', x - 3, feet - 6, { life: 16 });
    if (!reduce) for (var i = 0; i < 7; i++) fx('petal', x, feet - 4, { vx: (i - 3) * 0.35, vy: -1.2 - (i % 3) * 0.35, life: 46, col: FLOWER[(i + 1) % FLOWER.length] });
    sfx('pop');
    var gy = floorBelow(x, feet - 2, 24);
    if (gy !== null && G.blooms.length < 60) G.blooms.push({ x: x, y: gy, col: col, t: 0 });
  };

  var snap = BB.snap;
  var drawE = function (ctx, e, s, flipX, v, dx, dy) {
    var sx = snap(e.x + e.w / 2 - s.w / 2 - G.cam.x + (dx || 0));
    var sy = snap(e.y + e.h - s.h - G.cam.y + (dy || 0));
    if (e.dying === 'flip') { BB.draw(ctx, flipV(s), sx, sy, flipX, v); return; }
    if (!e.K.fly && !e.dying && (e.enemy || e.K.item)) shadowUnder(ctx, e.x + e.w / 2, e.y + e.h, e.w + 2);
    BB.draw(ctx, s, sx, sy, flipX, v);
    if (G.light && (e.enemy || e.K.item)) BB.catchLight(ctx, s, sx, sy, flipX, v, G.light.at(e.x + e.w / 2, e.y + e.h / 2));
  };
  // upside down, for a knocked-out enemy
  var flipV = function (s) {
    if (s.upside) return s.upside;
    var rows = s.rows.slice().reverse();
    return (s.upside = s.hi ? BB.sprHi(rows, s.pal, s.mode) : BB.spr(rows, s.pal, null, s.mode));
  };

  var E = A.en;
  KINDS.grumbug = {
    w: 11, h: 9, enemy: true, stomp: true,
    update: function (e) { walk(e, 0.45); },
    draw: function (ctx, e) { if (e.dying === 'flat') drawE(ctx, e, E.grumbugFlat, e.face > 0); else drawE(ctx, e, E.grumbug[Math.floor(e.t / 9) % 2], e.face > 0); }
  };
  KINDS.snail = {
    w: 12, h: 11, enemy: true, stomp: 'shell',
    update: function (e) {
      if (e.shell) {
        e.shellT++;
        if (e.vx) { if (moveX(e, e.vx)) { e.vx = -e.vx; sfx('bump'); } }
        e.vy = Math.min(FALL, e.vy + GRAV);
        if (moveY(e, e.vy)) e.vy = 0;
        if (e.kickT) e.kickT--;
        // a moving shell bowls over anything in its way
        if (e.vx) G.ents.forEach(function (o) {
          if (o !== e && o.enemy && o.alive && !o.dying && !o.K.tough && overlap(e, o)) {
            flip(o, e.vx > 0 ? 1 : -1); e.combo = (e.combo || 0) + 1;
            points(COMBO[Math.min(e.combo - 1, 7)], o.x, o.y);
          }
        });
        // left alone, it comes back out
        if (!e.vx && e.shellT > 420) { e.shell = false; e.h = 11; e.y -= 1; e.vx = 0; }
        return;
      }
      walk(e, 0.4);
    },
    draw: function (ctx, e) {
      if (e.shell) {
        var wob = !e.vx && e.shellT > 330 && (e.t >> 2) % 2 ? 1 : 0;
        drawE(ctx, e, E.shell[e.vx ? Math.floor(e.t / 3) % 2 : 0], false, null, wob, 0);
      } else drawE(ctx, e, E.snail[Math.floor(e.t / 12) % 2], e.face > 0);
    }
  };
  KINDS.crab = {
    w: 13, h: 8, enemy: true, stomp: true,
    update: function (e) {
      // scuttle, stop, scuttle
      var on = (e.t % 90) < 55;
      if (on) walk(e, 0.9, true); else { e.vy = Math.min(FALL, e.vy + GRAV); if (moveY(e, e.vy)) e.vy = 0; }
    },
    draw: function (ctx, e) { drawE(ctx, e, E.crab[(e.t % 90) < 55 ? Math.floor(e.t / 5) % 2 : 0], false); }
  };
  KINDS.gull = {
    w: 12, h: 7, enemy: true, stomp: true, fly: true,
    init: function (e) { e.x0 = e.x; e.y0 = e.y; e.vx = -0.6; },
    update: function (e) {
      e.x += e.vx;
      if (e.x < e.x0 - 80 || e.x > e.x0 + 24) e.vx = -e.vx;
      e.y = e.y0 + Math.sin(e.t * 0.05) * 10;
      e.face = e.vx > 0 ? 1 : -1;
    },
    draw: function (ctx, e) { drawE(ctx, e, E.gull[Math.floor(e.t / 14) % 2], e.face > 0); }
  };
  KINDS.bee = {
    w: 10, h: 8, enemy: true, stomp: true, fly: true,
    init: function (e) { e.x0 = e.x; e.y0 = e.y; },
    update: function (e) {
      e.y = e.y0 + Math.sin(e.t * 0.055) * 14;
      e.x = e.x0 + Math.sin(e.t * 0.012) * 16;
      e.face = Math.cos(e.t * 0.012) > 0 ? 1 : -1;
    },
    draw: function (ctx, e) { drawE(ctx, e, E.bee[Math.floor(e.t / 3) % 2], e.face > 0); }
  };
  KINDS.fish = {
    w: 12, h: 7, enemy: true, stomp: false, fly: true,
    init: function (e) { e.x0 = e.x; e.y0 = e.y; e.vx = -0.5; },
    update: function (e) {
      e.x += e.vx;
      if (e.x < e.x0 - 72 || e.x > e.x0 + 32) e.vx = -e.vx;
      e.y = e.y0 + Math.sin(e.t * 0.04) * 8;
      e.face = e.vx > 0 ? 1 : -1;
    },
    draw: function (ctx, e) { drawE(ctx, e, E.fish[Math.floor(e.t / 16) % 2], e.face > 0); }
  };
  KINDS.jelly = {
    w: 10, h: 10, enemy: true, stomp: false, fly: true,
    init: function (e) { e.x0 = e.x; e.y0 = e.y; },
    update: function (e) {
      // a pulse up, a slow sink, edging towards you
      if (e.t % 100 === 0) e.vy = -1.1;
      e.vy = Math.min(0.25, e.vy + 0.02);
      e.y += e.vy;
      if (e.y > e.y0 + 24) e.y = e.y0 + 24;
      if (e.y < e.y0 - 30) e.y = e.y0 - 30;
      e.x += towards(e) * 0.12;
      if (Math.abs(e.x - e.x0) > 48) e.x -= towards(e) * 0.12;
    },
    draw: function (ctx, e) { drawE(ctx, e, E.jelly[e.vy < 0 ? 1 : 0], false); }
  };
  KINDS.ghost = {
    w: 12, h: 12, enemy: true, stomp: false, tough: true, fly: true,
    update: function (e) {
      var p = G.p, looking = (p.face > 0) === (e.x + e.w / 2 > p.x + p.w / 2);
      e.shy = looking;
      if (!looking) {
        var dx = p.x + p.w / 2 - (e.x + e.w / 2), dy = p.y + p.h / 2 - (e.y + e.h / 2), d = Math.sqrt(dx * dx + dy * dy) || 1;
        e.x += dx / d * 0.42; e.y += dy / d * 0.42;
        e.face = dx > 0 ? 1 : -1;
      }
    },
    draw: function (ctx, e) { drawE(ctx, e, E.ghost[e.shy ? 1 : 0], e.face > 0, null, 0, reduce ? 0 : Math.round(Math.sin(e.t * 0.08) * 1.5)); }
  };
  KINDS.bat = {
    w: 10, h: 7, enemy: true, stomp: true, fly: true,
    init: function (e) { e.st = 'hang'; e.y = e.sp.row * T; },
    update: function (e) {
      var p = G.p;
      if (e.st === 'hang') {
        if (near(e, 52) && p.y > e.y) { e.st = 'swoop'; e.vx = towards(e) * 1.1; e.vy = 1.6; sfx('pop'); }
        return;
      }
      e.vy -= 0.035;
      e.x += e.vx; e.y += e.vy;
      e.face = e.vx > 0 ? 1 : -1;
      if (e.vy < -1.4) e.vy = -1.4;
    },
    draw: function (ctx, e) { if (e.st === 'hang') drawE(ctx, e, E.bat[2], false, null, 0, 4); else drawE(ctx, e, E.bat[Math.floor(e.t / 6) % 2], e.face > 0); }
  };
  KINDS.hog = {
    w: 12, h: 9, enemy: true, stomp: false,
    update: function (e) { walk(e, 0.4); },
    draw: function (ctx, e) { drawE(ctx, e, E.hog[Math.floor(e.t / 10) % 2], e.face > 0); }
  };
  // the grumpy rock and the factory's crusher: wake, drop, grind back up
  var rockKind = function (sprites) {
    return {
      w: 18, h: 18, enemy: true, stomp: false, tough: true, top: true, solidish: true,
      init: function (e) { e.y = e.sp.row * T; e.y0 = e.y; e.st = 'wait'; e.x -= 5; },
      update: function (e) {
        var p = G.p, oy = e.y;
        rockStep(e, p);
        carry(e, 0, e.y - oy);
      },
      draw: function (ctx, e) {
        var awake = e.st !== 'wait' && e.st !== 'rise';
        drawE(ctx, e, sprites[awake ? 1 : 0], false, e.v, e.st === 'shake' && !reduce ? (e.t2 % 4 < 2 ? -1 : 1) : 0, 0);
      }
    };
  };
  var rockStep = function (e, p) {
    if (e.st === 'wait') { if (e.y <= e.y0 && Math.abs(p.x + p.w / 2 - (e.x + e.w / 2)) < 22 && p.y > e.y) { e.st = 'shake'; e.t2 = 0; } }
    else if (e.st === 'shake') { if (++e.t2 > 12) { e.st = 'fall'; e.vy = 1; } }
    else if (e.st === 'fall') {
      e.vy = Math.min(5, e.vy + 0.35);
      if (moveY(e, e.vy, false)) {
        e.st = 'land'; e.t2 = 0; sfx('boom'); G.shake = 10;
        fx('puff', e.x - 2, e.y + e.h - 5); fx('puff', e.x + e.w - 4, e.y + e.h - 5);
      }
      if (e.y > G.h * T) e.alive = false;
    } else if (e.st === 'land') { if (++e.t2 > 50) e.st = 'rise'; }
    else if (e.st === 'rise') { e.y -= 0.6; if (e.y <= e.y0) { e.y = e.y0; e.st = 'wait'; } }
  };
  KINDS.rock = rockKind(E.rock);
  KINDS.crusher = rockKind(E.rock);
  // the factory's crusher is the same stone face, in steel
  var STEEL = BB.variant('steel', { g: '#9098b0', G: '#585a70', W: '#d0d4e8' });
  KINDS.crusher.init = function (e) { KINDS.rock.init(e); e.v = STEEL; };
  KINDS.icicle = {
    w: 6, h: 12, enemy: true, stomp: false, tough: true,
    init: function (e) { e.y = e.sp.row * T; e.st = 'wait'; e.x += 1; },
    update: function (e) {
      if (e.st === 'wait') { if (near(e, 26) && G.p.y > e.y) { e.st = 'shake'; e.t2 = 0; } }
      else if (e.st === 'shake') { if (++e.t2 > 24) e.st = 'fall'; }
      else {
        e.vy = Math.min(5, e.vy + 0.3);
        if (moveY(e, e.vy, false)) { e.alive = false; sfx('brick'); for (var i = 0; i < 4; i++) fx('chip', e.x + 3, e.y + 8, { vx: (i - 1.5) * 0.8, vy: -2 - (i % 2), life: 30 }); }
      }
    },
    draw: function (ctx, e) { drawE(ctx, e, ICICLE, false, null, e.st === 'shake' && !reduce ? (e.t2 % 4 < 2 ? -1 : 1) : 0, 0); }
  };
  var ICICLE = BB.spr(['######', '#uxwu#', '#uwwu#', '.#uu#.', '.#uu#.', '.#uu#.', '.#wu#.', '..#u#.', '..#u#.', '..##..', '..#...', '......']);
  KINDS.penguin = {
    w: 10, h: 13, enemy: true, stomp: true,
    update: function (e) {
      var p = G.p;
      if (e.st === 'slide') {
        if (moveX(e, e.vx) || ++e.t2 > 130) { e.st = 0; e.h = 13; e.y -= 5; e.vx = e.vx > 0 ? 0.35 : -0.35; }
        e.vy = Math.min(FALL, e.vy + GRAV);
        if (moveY(e, e.vy)) e.vy = 0;
        return;
      }
      walk(e, 0.35);
      if (!e.cool && near(e, 96) && Math.abs(p.y + p.h - e.y - e.h) < 16 && e.vy === 0) {
        e.st = 'slide'; e.t2 = 0; e.vx = towards(e) * 2.1; e.face = towards(e); e.h = 8; e.y += 5; e.cool = 1;
      }
      if (e.cool && ++e.cool > 200) e.cool = 0;
    },
    draw: function (ctx, e) { if (e.st === 'slide') drawE(ctx, e, E.penguin[2], e.vx > 0); else drawE(ctx, e, E.penguin[Math.floor(e.t / 12) % 2], e.face > 0); }
  };
  KINDS.snowman = {
    w: 11, h: 19, enemy: true, stomp: true,
    update: function (e) {
      e.face = towards(e);
      e.vy = Math.min(FALL, e.vy + GRAV);
      if (moveY(e, e.vy)) e.vy = 0;
      if (e.t % 150 === 100 && near(e, 150)) {
        var d = G.p.x - e.x;
        addEnt('snowball', e.x + 2, e.y + 2, { vx: Math.max(-1.6, Math.min(1.6, d / 70)), vy: -3.2 });
        e.throwT = 14;
      }
      if (e.throwT) e.throwT--;
    },
    draw: function (ctx, e) { drawE(ctx, e, E.snowman[e.throwT ? 1 : 0], e.face > 0); }
  };
  KINDS.snowball = {
    w: 6, h: 6, enemy: true, stomp: false, tough: true, shot: true,
    update: function (e) {
      e.vy = Math.min(FALL, e.vy + 0.15);
      e.x += e.vx; e.y += e.vy;
      if (boxSolid(e.x, e.y, e.w, e.h) || e.t > 240) { e.alive = false; fx('puff', e.x - 1, e.y - 1); }
    },
    draw: function (ctx, e) { drawE(ctx, e, E.snowball, false); }
  };
  KINDS.robot = {
    w: 11, h: 14, enemy: true, stomp: 'robot',
    update: function (e) {
      if (e.stun) {
        e.vy = Math.min(FALL, e.vy + GRAV);
        if (moveY(e, e.vy)) e.vy = 0;
        if (--e.stun === 0) { e.vx = 0; }
        return;
      }
      walk(e, 0.5, true);
    },
    draw: function (ctx, e) {
      if (e.stun) {
        var shake = e.stun < 50 && !reduce ? (e.t % 4 < 2 ? 1 : -1) : 0;
        drawE(ctx, e, E.robot[0], e.face > 0, STUN, shake, 0);
      } else drawE(ctx, e, E.robot[Math.floor(e.t / 8) % 2], e.face > 0);
      if (!e.stun) BB.draw(ctx, E.key[Math.floor(e.t / 6) % 2], snap(e.x + (e.face > 0 ? -3 : e.w) - G.cam.x), snap(e.y + 5 - G.cam.y));
    }
  };
  var STUN = BB.variant('stun', { g: '#d0d4e8', W: '#ffffff', G: '#9098b0' });
  KINDS.plant = {
    w: 10, h: 16, enemy: true, stomp: false, behind: true,
    init: function (e) { e.x += 3; e.base = e.sp.row * T; e.y = e.base; e.st = 'down'; e.t2 = 40; },
    update: function (e) {
      var t = e.st;
      if (t === 'down') { if (--e.t2 <= 0 && !near(e, 30)) e.st = 'rise'; }
      else if (t === 'rise') { e.y -= 0.6; if (e.y <= e.base - e.h) { e.y = e.base - e.h; e.st = 'up'; e.t2 = 70; } }
      else if (t === 'up') { if (--e.t2 <= 0) e.st = 'sink'; }
      else if (t === 'sink') { e.y += 0.6; if (e.y >= e.base) { e.y = e.base; e.st = 'down'; e.t2 = 80; } }
    },
    draw: function (ctx, e) { drawE(ctx, e, E.plant[Math.floor(e.t / 10) % 2], false, null, 0, 2); }
  };
  KINDS.bubble = {
    w: 8, h: 9, enemy: true, stomp: false, tough: true,
    init: function (e) { e.y0 = e.sp.row * T + 6; e.y = e.y0; e.t = -(e.sp.delay || 0); },
    update: function (e) {
      if (e.t % 160 === 0) { e.vy = -5.4; sfx('fire'); }
      if (e.vy || e.y < e.y0) { e.vy = Math.min(4, e.vy + 0.16); e.y += e.vy; if (e.y >= e.y0) { e.y = e.y0; e.vy = 0; } }
      if (!reduce && e.vy && e.t % 4 === 0) fx('ember', e.x + 2 + Math.random() * 4, e.y + 8, { vy: 0.3, life: 16 });
    },
    draw: function (ctx, e) { if (e.y < e.y0 - 1) drawE(ctx, e, E.bubble[e.vy > 0 ? 1 : 0], false, null, 0, e.vy > 0 ? 0 : 0); }
  };
  KINDS.firebar = {
    w: 0, h: 0, tough: true, enemy: false, fly: true,
    init: function (e) { e.cx = e.sp.x + 4; e.cy = e.sp.row * T + 4; e.a = 0; e.balls = []; },
    update: function (e) {
      e.a += e.sp.speed || 0.025;
      var p = G.p;
      for (var i = 1; i <= (e.sp.len || 4); i++) {
        var bx = e.cx + Math.cos(e.a) * i * 7, by = e.cy + Math.sin(e.a) * i * 7;
        if (p.st === 'play' && bx + 2.5 > p.x && bx - 2.5 < p.x + p.w && by + 2.5 > p.y && by - 2.5 < p.y + p.h) hurt();
      }
    },
    draw: function (ctx, e) {
      for (var i = 1; i <= (e.sp.len || 4); i++) {
        var bx = e.cx + Math.cos(e.a) * i * 7, by = e.cy + Math.sin(e.a) * i * 7;
        BB.draw(ctx, E.fireball[(tick >> 2) % 2], snap(bx - 4 - G.cam.x), snap(by - 4 - G.cam.y));
      }
    }
  };

  /* ---- set pieces ------------------------------------------------------------- */
  KINDS.plat = {
    w: 24, h: 8, top: true,
    init: function (e, sp) {
      e.w = (sp.w || 3) * T; e.y = sp.row * T; e.x0 = e.x; e.y0 = e.y; e.off = 0; e.dir = 1;
      e.range = ((sp.dx || sp.dy || 0) * T); e.axis = sp.dy ? 'y' : 'x'; e.sgn = (sp.dx || sp.dy || 0) < 0 ? -1 : 1;
      e.range = Math.abs(e.range); e.fall = !!sp.fall; e.speed = sp.speed || 0.5;
    },
    update: function (e) {
      var ox = e.x, oy = e.y, p = G.p;
      if (e.fall) {
        if (p.on === e) e.st = e.st || 1;
        if (e.st) { e.st++; if (e.st > 24) { e.vy = Math.min(3.5, e.vy + 0.12); e.y += e.vy; } }
        if (e.y > G.h * T + 16) e.alive = false;
      } else if (e.range) {
        e.off += e.dir * e.speed;
        if (e.off >= e.range) { e.off = e.range; e.dir = -1; }
        if (e.off <= 0) { e.off = 0; e.dir = 1; }
        if (e.axis === 'x') e.x = e.x0 + e.off * e.sgn; else e.y = e.y0 + e.off * e.sgn;
      }
      carry(e, e.x - ox, e.y - oy);
    },
    draw: function (ctx, e) {
      var s = G.gfx.semi, shake = e.fall && e.st > 0 && e.st < 25 && !reduce ? (e.st % 4 < 2 ? 1 : 0) : 0;
      for (var i = 0; i < e.w / T; i++) BB.draw(ctx, s, snap(e.x + i * T - G.cam.x + shake), snap(e.y - G.cam.y));
    }
  };
  // whoever is standing on a platform rides it
  var carry = function (e, dx, dy) {
    var p = G.p;
    if (p.on !== e || p.st !== 'play') return;
    if (dx) moveX(p, dx);
    if (dy) { p.y = Math.round(e.y) - p.h; if (dy < 0 && boxSolid(p.x, p.y, p.w, p.h)) { p.y = Math.round(e.y) - p.h + 1; } }
  };
  KINDS.spring = {
    w: 14, h: 10, top: true, topOff: 0,
    init: function (e) { e.x += 1; e.y += 0; },
    update: function (e) { if (e.squash) e.squash--; },
    draw: function (ctx, e) {
      var s = G.def.theme === 'woods' ? A.shroom : A.spring;
      var f = s[e.squash ? 1 : 0];
      BB.draw(ctx, f, snap(e.x + e.w / 2 - f.w / 2 - G.cam.x), snap(e.y + e.h - f.h - G.cam.y));
    }
  };
  KINDS.check = {
    w: 4, h: 32,
    init: function (e) { e.y = e.sp.row * T - 32; e.up = 0; },
    update: function (e) {
      var p = G.p;
      if (!e.up && p.x + p.w > e.x) { e.up = 1; G.check = true; sfx('check'); if (BB.voice) BB.voice.play('yay'); p.waveT = 50; G.ents.forEach(function (b) { if (b.k === 'bear' && b.mode === 'follow') b.happy = 50; }); fx('text', e.x - 8, e.y - 8, { s: 'SAVED!', vy: -0.4, life: 60, col: '#ffe048' }); }
      if (e.up && e.up < 24) e.up++;
    },
    draw: function (ctx, e) {
      var x = snap(e.x - G.cam.x), y = snap(e.y - G.cam.y);
      ctx.fillStyle = '#1c1428'; ctx.fillRect(x, y, 2, 32);
      ctx.fillStyle = '#d0d4e8'; ctx.fillRect(x, y + 1, 1, 31);
      var fy = e.up ? y + 24 - e.up : y + 24;
      BB.draw(ctx, A.checkFlag[e.up ? 1 : 0], x + 2, fy);
      BB.draw(ctx, A.ball, x - 1, y - 3);
    }
  };
  /* The finish: an arch of balloons over the path home, with Monsty's
     pennant at the top. Run through it and the balloon nearest Bonnie's
     head pops (the higher, the more points), then the rest let go and
     float off one by one while he cheers. */
  var BALLOON = ['#ff5a6a', '#ffa040', '#ffd84a', '#5cd06a', '#4aa8ff', '#a878f0'];
  KINDS.goal = {
    w: 4, h: 48,
    init: function (e) {
      e.x += 2; e.base = e.sp.row * T; e.y = e.base - 48; e.balloons = []; e.relT = -1;
      for (var k = 0; k <= 12; k++) { var a = Math.PI * k / 12; e.balloons.push({ dx: Math.cos(a) * 15, dy: -6 - Math.sin(a) * 38, col: BALLOON[k % 6], up: 0, sway: k * 0.7 }); }
    },
    update: function (e) {
      if (e.relT < 0) return;
      e.relT++;
      e.balloons.forEach(function (b, k) {
        if (b.popped || e.relT < 10 + k * 5) return;
        b.up = Math.min(2.2, b.up + 0.04); b.dy -= b.up; b.dx += Math.sin(e.relT * 0.05 + b.sway) * 0.25;
      });
    },
    draw: function (ctx, e) {
      var x = e.x + 2 - G.cam.x, y = e.base - G.cam.y, DK = '#2a1640';
      if (x < -40 || x > BB.W + 40) return;
      // the cord the balloons are tied along
      if (e.relT < 0) { ctx.fillStyle = 'rgba(42,22,64,0.55)'; for (var a = 0; a <= Math.PI; a += 0.04) ctx.fillRect(snap(x + Math.cos(a) * 15), snap(y - 6 - Math.sin(a) * 38), 0.5, 0.5); }
      e.balloons.forEach(function (b) {
        if (b.popped) return;
        var bx = x + b.dx, by = y + b.dy;
        if (b.up) { ctx.fillStyle = 'rgba(42,22,64,0.4)'; for (var k = 0; k < 6; k += 0.5) ctx.fillRect(snap(bx + Math.sin(k * 0.8 + e.relT * 0.1) * 0.6), snap(by + 3 + k), 0.5, 0.5); }
        BB.icons.disc(ctx, bx, by, 3.3, DK);
        BB.icons.disc(ctx, bx, by - 0.2, 2.8, b.col);
        BB.icons.disc(ctx, bx + 0.6, by + 0.6, 1.6, BB.mix(b.col, DK, 0.18));
        ctx.fillStyle = '#ffffff'; ctx.fillRect(snap(bx - 1.5), snap(by - 1.8), 1, 1);
        ctx.fillStyle = DK; ctx.fillRect(snap(bx - 0.5), snap(by + 3), 1, 0.5);
      });
      // Monsty's pennant at the top: purple, with an orange star
      if (e.relT < 0 || e.relT < 70) {
        var px = snap(x), py = snap(y - 50 - Math.max(0, e.relT) * 0.6);
        ctx.fillStyle = DK; ctx.fillRect(px, py, 0.5, 9);
        for (var k2 = 0; k2 < 6; k2 += 0.5) { var hh = 5 * (1 - k2 / 6); ctx.fillStyle = DK; ctx.fillRect(px + 0.5 + k2, py + 0.5 - hh / 2 + 2.5 + Math.sin(G.tick * 0.12 + k2 * 0.7) * 0.4, 0.5, hh + 0.5); ctx.fillStyle = '#9a5ae8'; ctx.fillRect(px + 0.5 + k2, py + 0.75 - hh / 2 + 2.5 + Math.sin(G.tick * 0.12 + k2 * 0.7) * 0.4, 0.5, Math.max(0, hh - 0.5)); }
        ctx.fillStyle = '#ffb444'; ctx.fillRect(px + 1.5, py + 2.5, 1, 1);
      }
    }
  };
  KINDS.house = {
    w: 40, h: 40,
    init: function (e) { e.y = e.sp.row * T - 40; e.flag = 0; },
    update: function () {},
    draw: function (ctx, e) { drawHouse(ctx, e); }
  };
  KINDS.gate = {
    w: 8, h: 8,
    init: function (e) { e.y = e.sp.row * T; },
    update: function (e) {
      if (!G.bossOn && G.p.x > e.x + 24 && G.p.st === 'play') {
        G.bossOn = true;
        for (var y = 2; y < G.gr; y++) G.map[y * G.w + (e.x >> 3)] = TL.HARD;
        sfx('boom'); G.shake = 12;
        BB.music('boss');
        G.ents.forEach(function (d) { if (d.k === 'dragon') { d.st = 'roar'; d.t2 = 0; sfx('roar'); } });
      }
    },
    draw: function () {}
  };
  KINDS.cage = {
    w: 19, h: 24,
    update: function (e) {
      if (G.bossDone && !e.open) {
        e.open = 1;
        sfx('brick');
        for (var i = 0; i < 8; i++) fx('chip', e.x + 9, e.y + 8, { vx: (i - 3.5) * 0.6, vy: -2.5 - (i % 3), life: 50, col: '#9098b0' });
        addEnt('monsty', e.x + 3, e.y + 4, { vy: -3 });
      }
    },
    draw: function (ctx, e) {
      if (e.open) return;
      BB.draw(ctx, A.monsty, snap(e.x + 2 - G.cam.x), snap(e.y + 3 - G.cam.y));
      drawE(ctx, e, A.cage, false);
    }
  };
  // Monsty, freed: hops out of the cage, and once Bonnie reaches him the
  // two of them jump for joy together
  KINDS.monsty = {
    w: 13, h: 16,
    update: function (e) {
      e.vy = Math.min(FALL, e.vy + GRAV);
      if (moveY(e, e.vy)) { e.vy = e.saved ? -2.2 : e.hops < 3 ? -2.5 : 0; e.hops = (e.hops || 0) + 1; }
      var p = G.p;
      if (!e.saved && p.st === 'play' && overlap(p, e)) { e.saved = true; rescue(); }
    },
    draw: function (ctx, e) { drawE(ctx, e, A.monsty, false); }
  };

  /* ---- signposts that teach (levels.js: L.tip) ------------------------------------
     A little wooden sign. Walk up to it and a bubble pops up showing the
     real control for this device — the Space bar, or the A button — with
     a word or two and, where it helps, a tiny picture of the thing. */
  var TIPS = {
    move: [['g', 'move'], ['t', 'WALK']],
    jump: [['g', 'jump'], ['t', 'JUMP']],
    block: [['t', 'BUMP'], ['s', 'qblock'], ['t', 'FROM BELOW']],
    stomp: [['t', 'JUMP ON'], ['s', 'bug'], ['t', '!']],
    high: [['t', 'HOLD'], ['g', 'jump'], ['t', 'TO GO HIGHER']],
    run: [['t', 'HOLD'], ['g', 'run'], ['t', 'TO RUN']],
    spring: [['t', 'BOUNCE ON'], ['s', 'spring'], ['t', '!']],
    swim: [['t', 'TAP'], ['g', 'jump'], ['t', 'TO SWIM']],
    ice: [['t', 'SLIPPY ICE!']],
    robot: [['t', 'STOMP'], ['s', 'robot'], ['t', 'TWICE']]
  };
  var nearestTip = function () {
    if (G.tipAt === G.tick) return G.tipE;
    var px = G.p.x + G.p.w / 2, bd = 1e9;
    G.tipE = null; G.tipAt = G.tick;
    G.ents.forEach(function (o) { if (o.k === 'tip') { var d = Math.abs(o.x + o.w / 2 - px); if (d < bd) { bd = d; G.tipE = o; } } });
    return G.tipE;
  };
  var tipSprite = function (k) { return k === 'qblock' ? A.qblock[0] : k === 'bug' ? E.grumbug[0] : k === 'spring' ? A.spring[0] : E.robot[0]; };
  var partW = function (q) { if (q[0] === 't') return BB.textW(q[1]); if (q[0] === 'g') return BB.glyphW(q[1]); var sp = tipSprite(q[1]); return sp.w * Math.min(1, 9 / sp.h); };
  KINDS.tip = {
    w: 10, h: 14,
    init: function (e) { e.y = e.sp.row * T - 14; e.pop = 0; },
    update: function (e) {
      // only the sign nearest Bonnie speaks, so two close together never
      // talk over each other: the bubbles hand over as he walks past
      var want = near(e, 44) && Math.abs(G.p.y - e.y) < 50 && nearestTip() === e ? 1 : 0;
      e.pop += (want - e.pop) * (reduce ? 1 : 0.18);
    },
    draw: function (ctx, e) {
      var x = snap(e.x - G.cam.x), y = snap(e.y - G.cam.y);
      // the post and its board
      ctx.fillStyle = '#5a3420'; ctx.fillRect(x + 4, y + 5, 2, 9);
      ctx.fillStyle = '#8a5a34'; ctx.fillRect(x + 4, y + 5, 1, 9);
      ctx.fillStyle = '#5a3420'; ctx.fillRect(x, y, 10, 7);
      ctx.fillStyle = '#c88a50'; ctx.fillRect(x + 0.5, y + 0.5, 9, 6);
      ctx.fillStyle = '#e8b070'; ctx.fillRect(x + 0.5, y + 0.5, 9, 1);
      ctx.fillStyle = '#5a3420'; ctx.fillRect(x + 4.5, y + 1.5, 1, 2.5); ctx.fillRect(x + 4.5, y + 4.5, 1, 1);
      if (e.pop < 0.04) return;
      // the bubble
      var parts = TIPS[e.sp.tip] || [], w = 0;
      parts.forEach(function (q, i) { w += (i ? 3 : 0) + partW(q); });
      var bw = w + 8, bh = 15, cx = x + 5, bx = Math.max(3, Math.min(BB.W - 3 - bw, cx - bw / 2)), by = y - bh - 6;
      ctx.save();
      ctx.translate(cx, y - 3); ctx.scale(e.pop, e.pop); ctx.translate(-cx, -(y - 3));
      ctx.fillStyle = 'rgba(20,10,40,0.3)'; ctx.fillRect(bx + 1.5, by + 2, bw, bh);
      ctx.fillStyle = UI.INK; ctx.fillRect(bx + 1, by, bw - 2, bh); ctx.fillRect(bx, by + 1, bw, bh - 2);
      ctx.fillStyle = UI.PAPER; ctx.fillRect(bx + 1, by + 0.5, bw - 2, bh - 1); ctx.fillRect(bx + 0.5, by + 1, bw - 1, bh - 2);
      ctx.fillStyle = '#ecd6ae'; ctx.fillRect(bx + 1, by + bh - 2.5, bw - 2, 1.5);
      ctx.fillStyle = UI.INK; for (var k = 0; k < 4; k += 0.5) ctx.fillRect(cx - (4 - k) / 2 - 0.5, by + bh - 0.5 + k, 4 - k + 1, 0.5);
      ctx.fillStyle = UI.PAPER; for (k = 0; k < 3; k += 0.5) ctx.fillRect(cx - (3 - k) / 2, by + bh - 1 + k, 3 - k, 0.5);
      var px = bx + 4;
      parts.forEach(function (q, i) {
        if (i) px += 3;
        if (q[0] === 't') { BB.text(ctx, q[1], px, by + 4, { color: UI.INK }); px += BB.textW(q[1]); }
        else if (q[0] === 'g') { px += BB.glyph(ctx, q[1], px, by + 2.5); }
        else { var sp = tipSprite(q[1]), sc = Math.min(1, 9 / sp.h); BB.draw(ctx, sp, px, by + 3 + (9 - sp.h * sc) / 2, false, null, sc); px += sp.w * sc; }
      });
      ctx.restore();
    }
  };

  /* ---- outfits -------------------------------------------------------------------
     Won by bringing Bear home: his school uniform to start, star
     pyjamas at 3, a superhero suit with a cape at 6, and a Monsty suit
     at 10. Chosen in the sticker book; worn everywhere he's drawn. */
  var OUTFITS = [
    { id: 'school', name: 'SCHOOL', need: 0, v: null },
    { id: 'pyjamas', name: 'PYJAMAS', need: 3, v: BB.variant('pyjamas', { b: '#8ac4ff', B: '#4a7ad8', k: '#8ac4ff', K: '#4a7ad8', y: '#ffffff', Y: '#c8d8f0' }) },
    { id: 'super', name: 'SUPER', need: 6, v: BB.variant('super', { b: '#f24848', B: '#a42032', y: '#ffe048', Y: '#c98a12', k: '#3a6cf4', K: '#1f40a8' }), cape: true },
    { id: 'monsty', name: 'MONSTY', need: 10, v: BB.variant('monstysuit', { b: '#8a44dc', B: '#5a2aa8', y: '#ffb444', Y: '#e0821c', k: '#8a44dc', K: '#5a2aa8' }) }
  ];
  var outfit = function () { for (var i = 0; i < OUTFITS.length; i++) if (OUTFITS[i].id === save.outfit) return OUTFITS[i]; return OUTFITS[0]; };
  // a cape, flowing out behind him the faster he goes
  var drawCape = function (ctx, x, y, h, face, speed, t) {
    var len = h * 0.55, flow = 1.5 + Math.min(4, Math.abs(speed) * 2.2);
    for (var k = 0; k < len; k += 0.5) {
      var w = 2 + k * 0.28, off = -face * (k / len) * flow + Math.sin(t * 0.25 + k * 0.4) * 0.3 * (k / len);
      ctx.fillStyle = '#2a1640'; ctx.fillRect(snap(x + off - w / 2 - 0.5), snap(y + k), snap(w + 1), 0.5);
      ctx.fillStyle = k < 1 ? '#ff7a7a' : '#e83a4a'; ctx.fillRect(snap(x + off - w / 2), snap(y + k), snap(w), 0.5);
    }
  };

  /* ---- Bear, the family cat --------------------------------------------------------
     Hidden somewhere in every level (levels.js: L.bear). Touch him and he
     meows and follows Bonnie home: he walks the very path Bonnie took, a
     moment behind, hopping where he hopped, and sits when Bonnie stops. A
     fall doesn't lose him — he's with Bonnie when he gets back up — but
     going back to the map does. Under the sea he wears a bubble. */
  var bearWith = 0;      // the level Bear is following Bonnie in, if any
  var BEAR_LAG = 20;
  KINDS.bear = {
    w: 10, h: 10,
    init: function (e) { if (e.sp.row !== undefined) e.y = e.sp.row * T - e.h; e.mode = 'wait'; e.face = 1; },
    update: function (e) {
      var p = G.p;
      if (e.mode === 'wait') {
        e.face = p.x + p.w / 2 < e.x + e.w / 2 ? -1 : 1;
        e.vy = Math.min(FALL, e.vy + GRAV);
        if (moveY(e, e.vy, true)) e.vy = 0;
        if (p.st === 'play' && overlap(p, e)) {
          e.mode = 'follow'; e.happy = 50; bearWith = G.n;
          sfx('meow');
          fx('text', e.x - 6, e.y - 10, { s: 'MEOW!', vy: -0.5, life: 50, col: '#ffe48a' });
          for (var i = 0; i < 5; i++) fx('heart', e.x + 3, e.y - 2, { vx: (i - 2) * 0.35, vy: -0.7 - (i % 2) * 0.3, life: 50 });
        }
        return;
      }
      // following: walk Bonnie's own path, a moment behind him
      if (e.happy) e.happy--;
      var tr = G.trail, tg = tr.length > BEAR_LAG ? tr[tr.length - 1 - BEAR_LAG] : tr[0];
      if (!tg) return;
      var bx = e.x + e.w / 2, nx = tg.x, near = Math.abs(p.x + p.w / 2 - nx) < 12 && Math.abs(p.y + p.h - tg.y) < 4;
      e.moving = false;
      if (!near || Math.abs(tg.y - (e.y + e.h)) > 1) {
        if (Math.abs(nx - bx) > 0.2) { e.face = nx > bx ? 1 : -1; e.moving = true; }
        e.x = nx - e.w / 2; e.y = tg.y - e.h;
      } else e.face = p.x + p.w / 2 > bx ? 1 : -1;
      // at the end he follows Bonnie in through the door
      if (p.st === 'in' && G.house && e.x + e.w / 2 >= G.house.x + 18) e.home = true;
    },
    draw: function (ctx, e) {
      if (e.home) return;
      var B = E.bear, f, bob = 0;
      if (e.mode === 'follow' && e.moving) f = B.walk[Math.floor(e.t / 5) % 2];
      else if (e.happy) f = B.happy;
      else if (e.t % 150 > 142) f = B.blink;
      else f = B.sit[Math.floor(e.t / 24) % 2];
      var x = snap(e.x + e.w / 2 - f.w / 2 - G.cam.x), y = snap(e.y + e.h - f.h + 0.5 + bob - G.cam.y);
      shadowUnder(ctx, e.x + e.w / 2, e.y + e.h, 9);
      // sprites face left; Bear faces wherever he's going
      BB.draw(ctx, f, x, y, e.face > 0);
      // a bubble helmet under the sea
      if (G.water) {
        var cx = x + f.w / 2 + (e.face > 0 ? 2 : -2), cy = y + 4.5;
        ctx.globalAlpha = 0.55; ctx.strokeStyle = '#e8fbff'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 0.18; ctx.fillStyle = '#c8f4ff'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.9; ctx.fillStyle = '#ffffff'; ctx.fillRect(cx - 3.5, cy - 3.5, 1.5, 1); ctx.globalAlpha = 1;
      }
      // waiting, the odd little heart, so a sharp eye can spot him
      if (e.mode === 'wait' && !reduce && e.t % 120 < 40) { ctx.globalAlpha = 1 - (e.t % 120) / 40; BB.draw(ctx, A.heartSmall, x + f.w / 2 - 2, y - 4 - (e.t % 120) / 8); ctx.globalAlpha = 1; }
    }
  };

  /* ---- Grumble, the dragon ---------------------------------------------------- */
  KINDS.dragon = {
    w: 24, h: 24, enemy: true, stomp: 'boss', tough: true,
    init: function (e) { e.hp = 6; e.st = 'sleep'; e.face = -1; e.vx = 0; },
    update: function (e) {
      if (e.st === 'sleep' || e.st === 'dead') return;
      var p = G.p;
      e.vy = Math.min(FALL, e.vy + GRAV);
      var landed = moveY(e, e.vy);
      if (landed) e.vy = 0;
      if (e.hurtT) e.hurtT--;
      if (e.st === 'roar') { if (++e.t2 > 60) { e.st = 'walk'; e.t2 = 0; } return; }
      if (e.st === 'walk') {
        e.t2++;
        var speed = e.hp > 4 ? 0.5 : e.hp > 2 ? 0.7 : 0.9;
        if (!e.vx) e.vx = -speed;
        e.vx = (e.vx > 0 ? 1 : -1) * speed;
        if (moveX(e, e.vx)) e.vx = -e.vx;
        // stay in the arena, mostly facing Bonnie
        e.face = towards(e);
        if (e.t2 % 140 === 70) { e.st = 'fire'; e.t2 = 0; }
        else if (e.t2 % 140 === 30 && e.vy === 0 && e.hp <= 4) { e.vy = -4.4; }
        if (Math.abs(p.x - e.x) < 12 && e.vy === 0 && e.t2 % 50 === 0) e.vy = -3.6;
      } else if (e.st === 'fire') {
        e.t2++;
        e.face = towards(e);
        if (e.t2 === 24) {
          var fx0 = e.face > 0 ? e.x + e.w : e.x - 8;
          addEnt('dfire', fx0, e.y + 6, { vx: e.face * 1.7, y0: e.y + 6 });
          if (e.hp <= 2) addEnt('dfire', fx0, e.y + 6, { vx: e.face * 1.7, y0: e.y - 10, t: 20 });
          sfx('fire');
        }
        if (e.t2 > 44) { e.st = 'walk'; e.t2 = 0; }
      }
    },
    draw: function (ctx, e) {
      if (e.hurtT && (e.hurtT >> 2) % 2 && !reduce) return;
      var D = E.dragon, s = e.hurtT ? D.hurt : e.st === 'fire' || e.st === 'roar' ? D.open : D.walk[Math.floor(e.t / 14) % 2];
      drawE(ctx, e, s, e.face > 0, null, 0, 0);
    }
  };
  KINDS.dfire = {
    w: 7, h: 7, enemy: true, stomp: false, tough: true, shot: true,
    update: function (e) {
      e.x += e.vx;
      e.y = e.y0 + Math.sin(e.t * 0.12) * 6;
      if (e.t > 300 || boxSolid(e.x, e.y, e.w, e.h)) { e.alive = false; fx('puff', e.x, e.y); }
      if (!reduce && e.t % 3 === 0) fx('ember', e.x + 3, e.y + 3, { vx: -e.vx * 0.2, vy: -0.2, life: 14 });
    },
    draw: function (ctx, e) { drawE(ctx, e, E.fireball[(e.t >> 2) % 2], false, null, 0, 1); }
  };
  var bossHit = function (e, how) {
    if (e.hurtT || e.st === 'dead' || e.st === 'sleep') return false;
    e.hp -= how === 'stomp' ? 2 : 1;
    e.hurtT = 70;
    sfx('roar');
    G.shake = 8;
    if (e.hp <= 0) {
      e.st = 'dead'; e.dying = 'flip'; e.vy = -3; e.vx = 0;
      G.bossDone = true;
      sfx('boom');
      points(5000, e.x, e.y);
      for (var i = 0; i < 12; i++) fx('chip', e.x + 12, e.y + 12, { vx: Math.cos(i) * 2, vy: Math.sin(i) * 2 - 1, life: 40, col: '#7ee058' });
      BB.music('');
    }
    return true;
  };

  /* ---- items -------------------------------------------------------------------- */
  // things that come out of blocks rise out of them first, behind the block
  var itemKind = function (move) {
    return {
      w: 10, h: 10, item: true, behind: true,
      init: function (e) { e.rise = 0; e.y0 = e.y; },
      update: function (e) {
        if (e.rise < e.h + 1) { e.rise += 0.5; e.y = e.y0 - e.rise; if (e.rise >= e.h + 1) { e.behind = false; e.vx = move.vx * (e.dir || 1); } return; }
        move.step(e);
        if (e.y > G.h * T + 8) e.alive = false;
      }
    };
  };
  var slide = { vx: 0.9, step: function (e) { if (moveX(e, e.vx)) e.vx = -e.vx; e.vy = Math.min(FALL, e.vy + GRAV); if (moveY(e, e.vy)) e.vy = 0; } };
  KINDS.cupcake = itemKind(slide);
  KINDS.cupcake.draw = function (ctx, e) { drawE(ctx, e, A.cupcake, false); };
  KINDS.heart = itemKind({ vx: 0.8, step: slide.step });
  KINDS.heart.h = 8; KINDS.heart.w = 9;
  KINDS.heart.draw = function (ctx, e) { drawE(ctx, e, A.heart, false); };
  KINDS.sball = itemKind({ vx: 0, step: function () {} });
  KINDS.sball.draw = function (ctx, e) { drawE(ctx, e, A.superball[Math.floor(tick / 12) % 2], false, null, 0, e.rise > 10 && !reduce ? Math.round(Math.sin(tick * 0.1)) : 0); };
  KINDS.lolly = itemKind({ vx: 1.0, step: function (e) {
    if (moveX(e, e.vx)) e.vx = -e.vx;
    e.vy = Math.min(FALL, e.vy + 0.2);
    if (moveY(e, e.vy)) e.vy = e.vy > 0 ? -3.4 : 0;
  } });
  KINDS.lolly.h = 15; KINDS.lolly.w = 11;
  KINDS.lolly.draw = function (ctx, e) { drawE(ctx, e, A.lolly, false); };

  var release = function (c, tx, ty) {
    var x = tx * T, y = ty * T, p = G.p;
    if (c === CT.COIN) { coinPop(x, y); return; }
    sfx('sprout');
    var k = c === CT.POWER ? (p.power ? 'sball' : 'cupcake') : c === CT.STAR ? 'lolly' : 'heart';
    var e = addEnt(k, x + (T - KINDS[k].w) / 2, y, {});
    e.dir = p.x + p.w / 2 < x + 4 ? 1 : -1;
    e.y0 = y; e.y = y;
  };
  var coinPop = function (x, y) {
    fx('coin', x, y - 8, { vy: -4, life: 26 });
    addStars(1);
    save.score += 50;
    sfx('star');
  };

  // Bonnie's thrown ball: bounces along the ground, flips what it hits
  KINDS.ball = {
    w: 6, h: 6,
    update: function (e) {
      var hitW = moveX(e, e.vx);
      if (G.water) { e.vy = 0; }
      else {
        e.vy = Math.min(FALL, e.vy + 0.35);
        if (moveY(e, e.vy)) e.vy = e.vy > 0 ? -2.6 : 0.5;
      }
      if (hitW || e.t > 150 || e.x < G.cam.x - 16 || e.x > G.cam.x + BB.W + 16 || e.y > G.h * T) { e.alive = false; fx('puff', e.x - 1, e.y - 1); sfx('bump'); return; }
      for (var i = 0; i < G.ents.length; i++) {
        var o = G.ents[i];
        if (!o.enemy || !o.alive || o.dying || o.K.shot || !overlap(e, o)) continue;
        if (o.k === 'dragon') { if (bossHit(o, 'ball')) { e.alive = false; fx('puff', e.x, e.y); } continue; }
        if (o.K.tough) { e.alive = false; fx('puff', e.x, e.y); sfx('bump'); return; }
        flip(o, e.vx > 0 ? 1 : -1);
        points(200, o.x, o.y - 4);
        e.alive = false;
        fx('puff', e.x, e.y);
        return;
      }
    },
    draw: function (ctx, e) { drawE(ctx, e, A.thrown[Math.floor(e.t / 3) % 4], false); }
  };

  /* ==========================================================================
     BONNIE
     ========================================================================== */
  var setSize = function (big) {
    var p = G.p, nh = big && !p.crouch ? BIG_H : SMALL_H;
    if (nh === p.h) return;
    p.y += p.h - nh; p.h = nh;
    if (boxSolid(p.x, p.y, p.w, p.h) && big) { p.crouch = true; p.y += p.h - SMALL_H; p.h = SMALL_H; }
  };
  var power = function (lv) {
    var p = G.p, was = p.power;
    if (lv <= was && lv !== 2) { points(1000, p.x, p.y - 8); sfx('power'); return; }
    if (lv === 2 && was === 2) { points(1000, p.x, p.y - 8); sfx('power'); return; }
    p.power = lv; save.power = lv;
    points(1000, p.x, p.y - 8);
    if (was === 0) { p.st = 'grow'; p.t = 0; G.freeze = 48; sfx('grow'); }
    else { G.flash = 30; sfx('power'); }
  };
  var hurt = function () {
    var p = G.p;
    if (p.inv || p.star || p.st !== 'play') return;
    if (p.power > 0) {
      p.power = p.power === 2 ? 1 : 0; save.power = p.power;
      if (p.power === 0) { p.st = 'shrink'; p.t = 0; G.freeze = 40; }
      p.inv = INV;
      sfx('shrink');
    } else die();
  };
  var die = function () {
    var p = G.p;
    if (p.st === 'dead') return;
    p.st = 'dead'; p.t = 0; p.vx = 0; p.vy = 0; p.star = 0;
    save.power = 0;
    BB.music('');
    sfx('die');
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) try { navigator.vibrate(60); } catch (e) {}
  };

  var bumpTile = function (tx, ty) {
    var i = ty * G.w + tx, t = G.map[i], c = G.cont[i], p = G.p;
    if (!G.bt[i]) G.bumps.push(i);
    G.bt[i] = 8;
    if (t === TL.Q || t === TL.HIDDEN || (t === TL.BRICK && c)) {
      if (c === CT.MULTI) {
        coinPop(tx * T, ty * T);
        G.multi[i] = (G.multi[i] || 0) + 1;
        if (G.multi[i] >= 8) { G.map[i] = TL.USED; G.cont[i] = 0; }
      } else {
        G.map[i] = TL.USED; G.cont[i] = 0;
        release(c || CT.COIN, tx, ty);
      }
    } else if (t === TL.BRICK && p.power > 0) {
      G.map[i] = TL.EMPTY; G.bt[i] = 0;
      for (var k = 0; k < 4; k++) fx('brick', tx * T + (k % 2) * 4, ty * T + (k >> 1) * 4, { vx: (k % 2 ? 1 : -1) * (1 + (k >> 1) * 0.4), vy: -3.6 + (k >> 1) * 1.2, life: 60 });
      sfx('brick');
      save.score += 50;
    } else sfx('bump');
    // knock off whatever stands on it, and catch a star resting there
    var top = ty * T, x0 = tx * T;
    G.ents.forEach(function (e) {
      if (e.enemy && e.alive && !e.dying && !e.K.tough && Math.abs(e.y + e.h - top) <= 2 && e.x + e.w > x0 && e.x < x0 + T) { flip(e, e.x + e.w / 2 > x0 + 4 ? 1 : -1); points(100, e.x, e.y); }
      if (e.K.item && !e.rise && e.alive && Math.abs(e.y + e.h - top) <= 2 && e.x + e.w > x0 && e.x < x0 + T) { e.vy = -3; e.vx = e.x + e.w / 2 > x0 + 4 ? Math.abs(e.vx || 0.9) : -Math.abs(e.vx || 0.9); }
    });
    if (ty > 0 && G.map[i - G.w] === TL.COIN) { G.map[i - G.w] = TL.EMPTY; coinPop(tx * T, (ty - 1) * T); }
  };
  var headBump = function (p) {
    var y = p.y - 1, ty = Math.floor(y / T);
    if (ty < 0) { sfx('bump'); return; }
    var a = Math.floor(p.x / T), b = Math.floor((p.x + p.w - 1) / T), mid = p.x + p.w / 2, best = -1, bd = 99;
    for (var tx = a; tx <= b; tx++) {
      var t = tileAt(tx, ty);
      if (t !== TL.BRICK && t !== TL.Q && t !== TL.USED) continue;
      var d = Math.abs(tx * T + 4 - mid);
      if (d < bd) { bd = d; best = tx; }
    }
    if (best < 0) { sfx('bump'); return; }
    bumpTile(best, ty);
  };
  var playerMoveY = function (p, dy) {
    p.ry += dy;
    var m = Math.round(p.ry);
    p.ry -= m;
    var s = m > 0 ? 1 : -1;
    while (m !== 0) {
      if (s > 0) {
        var pl = platAt(p);
        if (pl || semiAt(p.x, p.w, p.y + p.h)) { p.vy = 0; p.ry = 0; if (pl) landOn(p, pl); return; }
        if (!boxSolid(p.x, p.y + 1, p.w, p.h)) { p.y++; m--; continue; }
        p.vy = 0; p.ry = 0; return;
      }
      // a hidden block, found by jumping into it
      var hx = Math.floor((p.x + p.w / 2) / T), hy = Math.floor((p.y - 1) / T);
      if (hy >= 0 && tileAt(hx, hy) === TL.HIDDEN) { bumpTile(hx, hy); p.vy = 0; p.ry = 0; return; }
      if (!boxSolid(p.x, p.y - 1, p.w, p.h)) { p.y--; m++; continue; }
      /* clipped a corner by a few pixels on the way up: slide round it
         rather than stop dead — a jump that looks clear is clear */
      var slid = false;
      for (var n = 1; n <= NUDGE && !slid; n++) {
        if (!boxSolid(p.x - n, p.y - 1, p.w, p.h) && boxSolid(p.x + n, p.y - 1, p.w, p.h) && !boxSolid(p.x - n, p.y, p.w, p.h)) { p.x -= n; slid = true; }
        else if (!boxSolid(p.x + n, p.y - 1, p.w, p.h) && boxSolid(p.x - n, p.y - 1, p.w, p.h) && !boxSolid(p.x + n, p.y, p.w, p.h)) { p.x += n; slid = true; }
      }
      if (slid) { p.y--; m++; continue; }
      headBump(p);
      p.vy = 0; p.ry = 0;
      return;
    }
  };
  // landing on a spring bounces; on a falling raft it starts to go
  var landOn = function (p, q) {
    p.on = q;
    if (q.k === 'spring') {
      q.squash = 8;
      p.vy = -SPRING; p.holdT = 22; p.on = null; p.ground = false; p.combo = 0;
      sfx('boing');
      if (BB.voice) BB.voice.play('wheee');
    }
  };

  var updatePlayer = function () {
    var p = G.p;
    p.t++;
    if (p.inv) p.inv--;
    if (p.star) { p.star--; if (!p.star) BB.music(G.bossOn ? 'boss' : G.th.music); }
    if (p.throwT) p.throwT--;
    if (p.swimT) p.swimT--;
    if (p.sq) p.sq += p.sq > 0 ? -1 : 1;
    var dir = (BB.key('right') ? 1 : 0) - (BB.key('left') ? 1 : 0);
    var run = BB.key('b') || BB.touchRun;
    // crouching: big Bonnie only, on the ground
    var crouch = p.power > 0 && BB.key('down') && p.ground && !G.water;
    if (crouch !== p.crouch) {
      if (crouch) { p.crouch = true; p.y += p.h - SMALL_H; p.h = SMALL_H; }
      else if (!boxSolid(p.x, p.y - (BIG_H - SMALL_H), p.w, BIG_H)) { p.crouch = false; p.y -= BIG_H - SMALL_H; p.h = BIG_H; }
    }
    if (p.crouch && p.ground) dir = 0;
    var held = BB.key('a') || BB.key('up');

    if (G.water) {
      if (dir) { p.face = dir; p.vx += dir * W_ACC * (p.ground ? 1.4 : 1); var mx = W_MAX * (run ? 1.3 : 1); if (Math.abs(p.vx) > mx) p.vx = dir * mx; }
      else p.vx *= p.ground ? 0.85 : 0.97;
      if (BB.hit('a') || BB.hit('up')) {
        p.vy = -W_STROKE; p.swimT = 18; sfx('swim'); p.ground = false;
        if (!reduce) fx('bubble', p.x + (p.face > 0 ? p.w : 0), p.y + 4, { vy: -0.5, life: 60 });
      }
      p.vy = Math.min(W_FALL, p.vy + W_GRAV);
      if (p.y < 10 && p.vy < 0) p.vy = 0.2;
    } else {
      var max = (run ? RUN : WALK) * (p.star ? 1.12 : 1);
      var acc = G.ice ? ICE_ACC : (run ? ACC_RUN : ACC), dec = G.ice ? ICE_DEC : DEC, skid = G.ice ? ICE_SKID : SKID;
      if (dir) {
        p.face = dir;
        if (p.ground) {
          if (p.vx * dir < 0) {
            p.vx += dir * skid;
            if (!reduce && G.tick % 4 === 0) fx('dust', p.x + (dir > 0 ? 0 : p.w - 4), p.y + p.h - 4, { life: 14 });
          } else if (p.vx * dir < max) p.vx = dir * Math.min(max, p.vx * dir + acc);
          else p.vx = dir * Math.max(max, p.vx * dir - dec);
        } else if (p.vx * dir < max) p.vx = dir * Math.min(max, p.vx * dir + AIR);
      } else if (p.ground) {
        p.vx = Math.abs(p.vx) <= dec ? 0 : p.vx - dec * (p.vx > 0 ? 1 : -1);
      }
      if (BB.hit('a') || BB.hit('up')) p.buf = BUFFER; else if (p.buf) p.buf--;
      if (p.ground) p.coy = COYOTE; else if (p.coy) p.coy--;
      if (p.buf && p.coy) {
        p.vy = -(JUMP + Math.abs(p.vx) * JUMP_RUN);
        p.buf = 0; p.coy = 0; p.ground = false; p.on = null; p.sq = -7;
        sfx(p.power ? 'bigjump' : 'jump');
      }
      var g = p.vy < 0 && (held || p.holdT > 0) ? GRAV_HOLD : GRAV;
      if (p.holdT) p.holdT--;
      p.vy = Math.min(FALL, p.vy + g);
    }
    // the ball power: B throws (two in the air at most)
    if (p.power === 2 && BB.hit('b') && !p.crouch) {
      var n = 0;
      G.ents.forEach(function (e) { if (e.k === 'ball' && e.alive) n++; });
      if (n < 2) {
        addEnt('ball', p.face > 0 ? p.x + p.w - 2 : p.x - 4, p.y + (p.h > 20 ? 8 : 4), { vx: 3.1 * p.face, vy: G.water ? 0 : 1.6 });
        p.throwT = 10;
        sfx('throw');
      }
    }

    var wasGround = p.ground, fallV = p.vy;
    var standing = p.on;
    p.on = null;
    if (moveX(p, p.vx)) p.vx = 0;
    // conveyor belts carry you
    if (wasGround && !G.water) {
      var under = tileAt(Math.floor((p.x + p.w / 2) / T), Math.floor((p.y + p.h) / T));
      if (under === TL.CONVR) moveX(p, 0.7); else if (under === TL.CONVL) moveX(p, -0.7);
    }
    playerMoveY(p, p.vy);
    var pl = platAt(p);
    if (pl && !p.on) p.on = pl;
    if (!p.on && standing && standing.alive && p.vy >= 0 && p.y + p.h === Math.round(standing.y) && p.x + p.w > standing.x && p.x < standing.x + standing.w) p.on = standing;
    p.ground = onGround(p) || !!p.on;
    if (p.ground && p.vy > 0) p.vy = 0;
    if (p.ground) {
      p.combo = 0;
      if (!wasGround && fallV > 2.5 && !reduce && !G.water) { fx('dust', p.x - 3, p.y + p.h - 4, { life: 12 }); fx('dust', p.x + p.w - 2, p.y + p.h - 4, { life: 12 }); }
      if (!wasGround && fallV > 1.5) p.sq = Math.min(8, 3 + fallV * 1.2);
      if (!wasGround && fallV > 4.2) G.kick = 4;
    }
    var moving = Math.abs(p.vx) > 0.15;
    p.anim = p.ground && moving ? p.anim + Math.abs(p.vx) * 0.12 : p.ground ? 0 : p.anim;

    // stars to collect, the edges of the world
    collectCoins(p);
    var feetT = tileAt(Math.floor((p.x + p.w / 2) / T), Math.floor((p.y + p.h) / T));
    if (p.ground && feetT === TL.SPIKE) hurt();
    if (lavaTouch(p)) die();
    if (p.y > G.h * T + 8) die();
  };
  var collectCoins = function (p) {
    var tx0 = Math.floor(p.x / T), tx1 = Math.floor((p.x + p.w - 1) / T), ty0 = Math.floor(p.y / T), ty1 = Math.floor((p.y + p.h - 1) / T);
    for (var ty = ty0; ty <= ty1; ty++) for (var tx = tx0; tx <= tx1; tx++) {
      if (tileAt(tx, ty) !== TL.COIN) continue;
      G.map[ty * G.w + tx] = TL.EMPTY;
      addStars(1); save.score += 50;
      sfx('star');
      fx('sparkle', tx * T, ty * T, { life: 14 });
    }
  };
  var lavaTouch = function (p) {
    var ty = Math.floor((p.y + p.h - 3) / T);
    for (var tx = Math.floor(p.x / T); tx <= Math.floor((p.x + p.w - 1) / T); tx++) if (tileAt(tx, ty) === TL.LAVA) return true;
    return false;
  };

  /* Bonnie meets things: stomp from above, collect, or be hurt. */
  var touch = function () {
    var p = G.p;
    if (p.st !== 'play') return;
    var box = { x: p.x + 1, y: p.y + 1, w: p.w - 2, h: p.h - 1 };
    for (var i = 0; i < G.ents.length; i++) {
      var e = G.ents[i], K = e.K;
      if (!e.alive || e.dying || !e.active) continue;
      if (K.item) {
        if (e.rise < e.h + 1 || !overlap(p, e)) continue;
        e.alive = false;
        if (e.k === 'cupcake') power(Math.max(1, p.power === 2 ? 2 : 1));
        else if (e.k === 'sball') power(2);
        else if (e.k === 'heart') oneUp(e.x, e.y);
        else if (e.k === 'lolly') { p.star = STAR_T; BB.music('star'); sfx('power'); points(1000, e.x, e.y); }
        continue;
      }
      if (!e.enemy || !overlap(box, e)) continue;
      if (K.solidish) {
        // a rock can be stood on; only its sides and underside hurt
        if (p.vy >= 0 && p.y + p.h - p.vy <= e.y + 3) continue;
        if (!p.star) hurt();
        continue;
      }
      if (p.star && !K.shot && e.k !== 'dragon') {
        flip(e, p.vx >= 0 ? 1 : -1); p.combo++;
        points(COMBO[Math.min(p.combo - 1, 7)], e.x, e.y);
        continue;
      }
      var fromAbove = p.vy > 0 && p.y + p.h - p.vy <= e.y + 5;
      if (K.stomp === 'shell' && e.shell) {
        if (e.kickT) continue;
        if (fromAbove && e.vx) { e.vx = 0; e.combo = 0; bounce(p); sfx('stomp'); e.kickT = 8; continue; }
        // a still shell: kick it away from you
        e.vx = (p.x + p.w / 2 < e.x + e.w / 2 ? 1 : -1) * 3.2; e.kickT = 12; e.shellT = 0; e.combo = 0;
        sfx('kick'); points(100, e.x, e.y);
        if (fromAbove) bounce(p);
        continue;
      }
      if (fromAbove && K.stomp) {
        p.combo++;
        var sc = COMBO[Math.min(p.combo - 1, 7)];
        if (p.combo > 8) oneUp(e.x, e.y); else points(sc, e.x, e.y - 4);
        if (K.stomp === 'shell') { e.shell = true; e.h = 10; e.y += 1; e.vx = 0; e.shellT = 0; e.kickT = 10; sfx('stomp'); }
        else if (K.stomp === 'robot') {
          if (e.stun) { squash(e); e.dying = 'flip'; e.vy = -2; }
          else { e.stun = 200; e.vx = 0; sfx('stomp'); }
        } else if (K.stomp === 'boss') { bossHit(e, 'stomp'); p.vy = -4.8; p.holdT = 0; continue; }
        else squash(e);
        bounce(p);
        continue;
      }
      if (K.stomp === 'robot' && e.stun) continue;
      hurt();
    }
  };
  var bounce = function (p) {
    var held = BB.key('a') || BB.key('up');
    p.vy = -(held ? STOMP_HELD : STOMP); p.holdT = held ? 8 : 0; p.ground = false;
  };

  /* ---- the flag, the walk home, the house ------------------------------------- */
  var goalCheck = function () {
    var p = G.p;
    if (p.st !== 'play') return;
    for (var i = 0; i < G.ents.length; i++) {
      var e = G.ents[i];
      if (e.k !== 'goal' || p.x + p.w / 2 < e.x || p.x > e.x + 6 || p.y + p.h < e.base - 60) continue;
      p.st = 'arch'; p.t = 0; p.vx = 0; p.star = 0; p.inv = 0; p.face = 1;
      var hgt = e.base - (p.y + p.h);
      var sc = hgt > 32 ? 5000 : hgt > 24 ? 2000 : hgt > 16 ? 800 : hgt > 8 ? 400 : 100;
      points(sc, e.x + 4, p.y);
      if (hgt > 32) oneUp(e.x + 4, p.y - 12);
      // the balloon nearest his head pops
      var hx = p.x + p.w / 2 - e.x, hy = p.y - e.base, near = null, nd = 1e9;
      e.balloons.forEach(function (b) { var d = Math.hypot(b.dx - hx, b.dy - hy); if (d < nd) { nd = d; near = b; } });
      if (near) {
        near.popped = true;
        for (var k = 0; k < 14; k++) { var a = k / 14 * Math.PI * 2; fx('spark', e.x + near.dx, e.base + near.dy, { vx: Math.cos(a) * 1.3, vy: Math.sin(a) * 1.3 - 0.4, life: 34, col: BALLOON[k % 6] }); }
      }
      sfx('pop');
      e.relT = 0;
      BB.music('');
      G.goal = e;
      return;
    }
  };
  var updateEnding = function () {
    var p = G.p, e = G.goal;
    p.t++;
    if (p.st === 'arch') {
      // he lands, and cheers while the balloons go up
      p.vy = Math.min(FALL, p.vy + GRAV);
      if (moveY(p, p.vy, true)) p.vy = 0;
      p.ground = onGround(p);
      if (p.t === 12) sfx('flag');
      if (p.ground && p.t > 60) {
        p.st = 'walk'; p.t = 0; p.face = 1;
        BB.music('clear', function () { G.clearDone = true; });
      }
    } else if (p.st === 'walk') {
      p.vx = 1.2;
      moveX(p, p.vx);
      p.vy = Math.min(FALL, p.vy + GRAV);
      if (moveY(p, p.vy)) p.vy = 0;
      p.ground = onGround(p);
      p.anim += 0.15;
      var house = null;
      G.ents.forEach(function (q) { if (q.k === 'house') house = q; });
      if (house && p.x + p.w / 2 >= house.x + 20) { p.st = 'in'; p.t = 0; house.flag = 1; }
    } else if (p.st === 'in') {
      G.ents.forEach(function (q) { if (q.k === 'house' && q.flag < 14) q.flag += 0.3; });
      // fireworks over the house
      if (!reduce && (p.t === 30 || p.t === 60 || p.t === 90)) {
        var hx = G.ents.filter(function (q) { return q.k === 'house'; })[0];
        if (hx) firework(hx.x + 20 + (p.t - 60) * 0.8, hx.y - 30 - (p.t % 60) * 0.3);
      }
      if (G.clearDone && p.t > 100) {
        save.best = save.best || {};
        save.best[G.n] = Math.max(save.best[G.n] || 0, G.got || 0);
        save.unlocked = Math.max(save.unlocked, Math.min(10, G.n + 1));
        if (save.cleared.indexOf(G.n) < 0) save.cleared.push(G.n);
        G.bearHome = bearWith === G.n;
        if (G.bearHome) save.bears[G.n] = 1;
        save.at = Math.min(10, G.n + 1);
        store();
        go('clear');
      }
    }
  };
  var firework = function (x, y) {
    sfx('boom');
    var cols = ['#ffe048', '#ff94cc', '#78d8ff', '#7ee058', '#ffffff', '#fa9c38'];
    var c = cols[Math.floor(Math.random() * cols.length)];
    for (var i = 0; i < 16; i++) {
      var a = i / 16 * Math.PI * 2;
      fx('spark', x, y, { vx: Math.cos(a) * 1.6, vy: Math.sin(a) * 1.6, life: 40, col: c });
    }
  };
  var rescue = function () {
    var p = G.p;
    p.st = 'cheer'; p.t = 0; p.vx = 0;
    BB.music('clear', function () { G.clearDone = true; });
    save.won = true;
    save.cleared.indexOf(10) < 0 && save.cleared.push(10);
    if (bearWith === 10) save.bears[10] = 1;
    store();
  };

  /* ==========================================================================
     ONE STEP OF PLAY
     ========================================================================== */
  var updatePlay = function () {
    G.tick++;
    var p = G.p;
    BB.touchCanThrow = p.power === 2;
    if (BB.hit('start') && p.st === 'play') { go('pause'); pauseAt = 0; sfx('pause'); return; }
    if (G.hitstop) { G.hitstop--; return; }
    if (G.shake) G.shake--;
    if (G.flash) G.flash--;
    if (G.kick) G.kick--;
    if (p.waveT) p.waveT--;
    // how long he's stood still, for his idle looks round (and shivers, in the snow)
    p.idleT = p.st === 'play' && p.ground && Math.abs(p.vx) < 0.05 && !BB.key('left') && !BB.key('right') && !BB.key('a') ? (p.idleT || 0) + 1 : 0;
    if (G.th.snowing && p.idleT > 90 && p.idleT % 70 === 0 && !reduce) fx('breath', p.x + p.w / 2 + p.face * 4, p.y + 6, { vx: p.face * 0.15, vy: -0.2, life: 40 });
    // (he doesn't shiver or glance about: on a small screen any jiggle of
    // the hero reads as a glitch — the breath in the cold says it all)
    updateFx();
    // a power change freezes the world for a beat, as the classic does
    if (G.freeze) {
      G.freeze--; p.t++;
      if (!G.freeze) { if (p.st === 'grow') { p.st = 'play'; setSize(true); } else if (p.st === 'shrink') { p.st = 'play'; setSize(false); } }
      return;
    }
    if (p.st === 'dead') {
      p.t++;
      if (p.t > 30) { if (p.t === 31) p.vy = -4.2; p.vy = Math.min(FALL, p.vy + 0.22); p.y += p.vy; }
      /* Lives never run out (owner, 14 Oct: "we are dying too much"):
         a fall just sends Bonnie back to the start, or to the last
         checkpoint he reached, after a short card. */
      if (p.t > 120 && !wipe) {
        save.power = 0;
        store(); cardCheck = G.check; cardQuick = true;
        var dp = G.p;
        wipeTo(function () { go('card'); }, Math.max(8, Math.min(BB.W - 8, dp.x + dp.w / 2 - G.cam.x)), Math.max(8, Math.min(H - 8, dp.y - G.cam.y)));
      }
      return;
    }
    if (p.st === 'cheer') {
      p.t++;
      if (!reduce && p.t % 40 === 20) firework(p.x + (Math.random() - 0.5) * 120, p.y - 40 - Math.random() * 30);
      if (G.clearDone && p.t > 160 && !wipe) wipeTo(function () { go('ending'); BB.music('ending'); });
      updateEnts();
      cameraFollow();
      return;
    }
    if (p.st === 'play') {
      updatePlayer();
      if (p.st === 'play') { updateEnts(); touch(); goalCheck(); }
    } else { updateEnding(); updateEnts(); }
    recordTrail();
    cameraFollow();
  };
  // where Bonnie's feet have been, for Bear to follow
  var recordTrail = function () {
    var p = G.p, tr = G.trail, last = tr[tr.length - 1], x = p.x + p.w / 2, y = p.y + p.h;
    if (p.st === 'dead') return;
    if (!last || Math.abs(last.x - x) > 0.05 || Math.abs(last.y - y) > 0.05) tr.push({ x: x, y: y });
    else tr.push(last);
    if (tr.length > 60) tr.shift();
  };
  var updateEnts = function () {
    var cx = G.cam.x, cy = G.cam.y, W = BB.W;
    for (var i = 0; i < G.ents.length; i++) {
      var e = G.ents[i];
      if (!e.alive) continue;
      var inView = e.x + e.w > cx - 48 && e.x < cx + W + 48 && e.y + e.h > cy - 64 && e.y < cy + H + 64;
      if (!e.active) { if (!inView && e.k !== 'gate' && e.k !== 'firebar') continue; e.active = true; if (STICKERS[e.k] && !save.met[e.k]) save.met[e.k] = 1; }
      // a waiting enemy (levels.js: { wait: px }) stands still until Bonnie
      // is that close, so it can't walk into a lesson while it's being read
      if (e.sp.wait && !e.woke) { if (Math.abs(G.p.x - e.x) > e.sp.wait) continue; e.woke = true; }
      if (!inView && e.enemy && !e.dying && e.k !== 'dragon') {
        // things that wander far off screen are gone (a shell, a swooping bat)
        if (e.vx && Math.abs(e.x - (cx + W / 2)) > W * 1.5) e.alive = false;
        continue;
      }
      e.t++;
      if (e.dying === 'flat') { if (e.t === 16) { bloom(e); e.alive = false; } continue; }
      if (e.dying === 'flip') { e.vy = Math.min(FALL, e.vy + 0.25); e.y += e.vy; e.x += e.vx; if (e.y > cy + H + 32) e.alive = false; if (e.k !== 'dragon') continue; }
      e.K.update(e);
      if (!e.K.fly && e.y > G.h * T + 24 && e.k !== 'plat') e.alive = false;
    }
    // walkers that meet turn round
    for (i = 0; i < G.ents.length; i++) {
      var a = G.ents[i];
      if (!a.alive || a.dying || !a.enemy || a.K.fly || a.shell || !a.vx) continue;
      for (var j = i + 1; j < G.ents.length; j++) {
        var b = G.ents[j];
        if (!b.alive || b.dying || !b.enemy || b.K.fly || b.shell || !b.vx || !overlap(a, b)) continue;
        var l = a.x <= b.x ? a : b, r = l === a ? b : a;
        l.vx = -Math.abs(l.vx); r.vx = Math.abs(r.vx);
      }
    }
    if (G.ents.length > 400) G.ents = G.ents.filter(function (e) { return e.alive; });
    // bumps settle
    for (i = G.bumps.length - 1; i >= 0; i--) { var k = G.bumps[i]; if (!--G.bt[k]) G.bumps.splice(i, 1); }
  };
  var cameraFollow = function () {
    var p = G.p, W = BB.W, c = G.cam;
    var px = p.x + p.w / 2;
    if (px > c.x + W * 0.52) c.x = px - W * 0.52;
    if (px < c.x + W * 0.36) c.x = px - W * 0.36;
    var minX = 0;
    if (G.bossOn) G.ents.forEach(function (e) { if (e.k === 'gate') minX = e.x - 8; });
    c.x = Math.max(minX, Math.min(G.w * T - W, c.x));
    if (G.h * T > H) {
      var ty = p.y + p.h / 2 - H * 0.55;
      if (p.st === 'dead') ty = c.y;
      c.y += (ty - c.y) * 0.14;
      c.y = Math.max(0, Math.min(G.h * T - H, c.y));
    } else c.y = 0;
  };
  var updateFx = function () {
    for (var i = G.fx.length - 1; i >= 0; i--) {
      var f = G.fx[i];
      f.t++;
      if (f.k === 'coin') { f.y += f.vy; f.vy += 0.3; if (f.t === f.life) fx('sparkle', f.x, f.y, { life: 12 }); }
      else if (f.k === 'brick' || f.k === 'chip') { f.x += f.vx; f.y += f.vy; f.vy += 0.25; }
      else if (f.k === 'spark') { f.x += f.vx; f.y += f.vy; f.vy += 0.04; f.vx *= 0.97; }
      else if (f.k === 'petal') { f.x += f.vx + Math.sin(f.t * 0.2 + f.vx * 9) * 0.25; f.y += f.vy; f.vy = Math.min(0.5, f.vy + 0.06); f.vx *= 0.97; }
      else if (f.k === 'breath') { f.x += f.vx; f.y += f.vy; }
      else if (f.k === 'bubble') { f.y += f.vy; f.x += Math.sin(f.t * 0.2) * 0.3; }
      else if (f.k === 'text' || f.k === 'ember' || f.k === 'heart') { f.y += f.vy; f.x += f.vx || 0; }
      if (f.t >= f.life) G.fx.splice(i, 1);
    }
  };

  /* ==========================================================================
     DRAWING A WORLD
     ========================================================================== */
  var themeCache = {};
  var theme = function (name) {
    if (themeCache[name]) return themeCache[name];
    var th = A.themes[name], g = A.hiTheme(name, th);
    var tile = function (rows, pal) { return BB.spr(rows.slice(), { 1: pal[0], 2: pal[1], 3: pal[2], 4: pal[3] }, null, 'tile'); };
    if (!g.semi) g.semi = tile(A.semi[th.semi], th.spal);
    g.debris = tile(A.debris[0].rows, th.brick);
    g.deep = BB.mix(th.gpal[3], '#1c1030', 0.5);
    var sh = BB.toRgb(BB.mix(th.gpal[3], '#1c1030', 0.3));
    g.shadeA = 'rgba(' + sh[0] + ',' + sh[1] + ',' + sh[2] + ',0.45)';
    g.edge = th.gpal[3];
    g.bg = BB.backdrop(name, th);
    return (themeCache[name] = g);
  };

  var drawTiles = function (ctx) {
    var c = G.cam, W = BB.W, g = G.gfx;
    var x0 = Math.max(0, Math.floor(c.x / T) - 1), x1 = Math.min(G.w - 1, Math.floor((c.x + W) / T) + 1);
    var y0 = Math.max(0, Math.floor(c.y / T)), y1 = Math.min(G.h - 1, Math.floor((c.y + H) / T));
    var qf = [0, 1, 2, 1][Math.floor(G.tick / 10) % 4];
    for (var ty = y0; ty <= y1; ty++) {
      for (var tx = x0; tx <= x1; tx++) {
        var i = ty * G.w + tx, t = G.map[i];
        if (!t) continue;
        var x = tx * T - snap(c.x), y = ty * T - snap(c.y);
        if (G.bt[i]) y -= [0, 1, 2, 3, 4, 4, 3, 2, 1][G.bt[i]];
        switch (t) {
          case TL.GROUND: {
            var gU = tileAt(tx, ty - 1) === TL.GROUND || ty === 0, gD = ty === G.h - 1 || tileAt(tx, ty + 1) === TL.GROUND || tileAt(tx, ty + 1) === TL.LAVA;
            var gL = tx === 0 || tileAt(tx - 1, ty) === TL.GROUND, gR = tx === G.w - 1 || tileAt(tx + 1, ty) === TL.GROUND;
            var vr = (tx * 7 + ty * 13) % 5 < 2 ? 1 : 0, mask = (!gU && !gL ? 1 : 0) | (!gU && !gR ? 2 : 0) | (!gD && !gL ? 4 : 0) | (!gD && !gR ? 8 : 0);
            var base = !gU ? g.top[vr] : g.fill[vr];
            BB.draw(ctx, mask ? rounded(base, mask) : base, x, y);
            // the land darkens the deeper inside it you go
            var dp = G.depth[i];
            if (dp > 1) { ctx.globalAlpha = Math.min(0.55, (dp - 1) * 0.16); ctx.fillStyle = g.deep; ctx.fillRect(x, y, T, T); ctx.globalAlpha = 1; }
            // lit from the top left: a bright left face, a shaded right face and underside
            if (!gL) { ctx.fillStyle = 'rgba(255,250,228,0.24)'; ctx.fillRect(x, y + (mask & 1 ? 3 : gU ? 0 : 2), 0.5, T - (mask & 1 ? 3 : gU ? 0 : 2) - (mask & 4 ? 3 : 0)); }
            if (!gR) { ctx.fillStyle = g.shadeA; ctx.fillRect(x + T - 1, y + (mask & 2 ? 3 : gU ? 0 : 2), 1, T - (mask & 2 ? 3 : gU ? 0 : 2) - (mask & 8 ? 3 : 0)); }
            if (!gD) { ctx.fillStyle = g.shadeA; ctx.fillRect(x + (mask & 4 ? 3 : 0), y + T - 1, T - (mask & 4 ? 3 : 0) - (mask & 8 ? 3 : 0), 1); }
            break;
          }
          // toy blocks: three carvings, mixed along a row
          case TL.BRICK: BB.draw(ctx, g.bricks[(tx * 5 + ty * 3) % 3], x, y); break;
          case TL.Q: BB.draw(ctx, A.qblock[reduce ? 0 : qf], x, y); break;
          case TL.USED: BB.draw(ctx, A.used, x, y); break;
          case TL.HARD: BB.draw(ctx, g.hard, x, y); break;
          case TL.CRATE: BB.draw(ctx, g.crate, x, y); break;
          // each world's column (a stump, a sandcastle tower, a chimney…)
          case TL.PIPETOP: BB.draw(ctx, g.col.top, x, y); break;
          case TL.PIPE: BB.draw(ctx, g.col.body, x, y); break;
          case TL.SEMI: BB.draw(ctx, g.semi, x, y); break;
          case TL.COIN: BB.draw(ctx, A.star[reduce ? 0 : Math.floor((G.tick + tx * 3) / 8) % 4], x - 1, y - 1); break;
          case TL.SPIKE: BB.draw(ctx, A.spikes, x, y); break;
          case TL.LAVA: drawLava(ctx, tx, ty, x, y); break;
          case TL.CONVL: case TL.CONVR: drawBelt(ctx, x, y, t === TL.CONVR ? 1 : -1); break;
          case TL.HIDDEN: if (BB.debug) { ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.strokeRect(x + 0.5, y + 0.5, 7, 7); } break;
        }
      }
    }
  };
  // a ground tile with its exposed corners rounded off
  var rounded = function (s, mask) {
    s.round = s.round || {};
    if (s.round[mask]) return s.round[mask];
    var n = s.rows.length, r = 5;
    var rows = s.rows.map(function (row, y) {
      return row.split('').map(function (ch, x) {
        var cut = function (cx, cy) { var dx = cx - x - 0.5, dy = cy - y - 0.5; return dx * dx + dy * dy > r * r; };
        if ((mask & 1) && x < r && y < r && cut(r, r)) return '.';
        if ((mask & 2) && x >= n - r && y < r && cut(n - r, r)) return '.';
        if ((mask & 4) && x < r && y >= n - r && cut(r, n - r)) return '.';
        if ((mask & 8) && x >= n - r && y >= n - r && cut(n - r, n - r)) return '.';
        return ch;
      }).join('');
    });
    return (s.round[mask] = BB.sprHi(rows, s.pal));
  };
  // what grows on the ground, and what hangs beneath it
  var drawGrowth = function (ctx) {
    var c = G.cam, W = BB.W, cx = snap(c.x), cy = snap(c.y), t = reduce ? 0 : G.tick;
    G.tiny.forEach(function (d) {
      var x = d.x - cx, y = d.y - d.s.h + 0.5 - cy;
      if (x < -8 || x > W + 4 || y < -8 || y > H) return;
      BB.draw(ctx, d.s, x, y);
    });
    var hs = G.th.hang;
    if (!hs) return;
    var col = hs[1];
    G.hang.forEach(function (hg) {
      var x0 = hg.x - cx, y0 = hg.y - cy;
      if (x0 < -6 || x0 > W + 6 || y0 < -12 || y0 > H) return;
      var k, sw;
      switch (hs[0]) {
        case 'vines': case 'kelp':
          for (k = 0; k < hg.len; k += 0.5) {
            sw = Math.sin(t * 0.03 + hg.ph + k * 0.4) * (hs[0] === 'kelp' ? 1.2 : 0.4) * (k / hg.len);
            ctx.fillStyle = col[0]; ctx.fillRect(snap(x0 + sw), y0 + k, 0.5, 0.5);
            if (k % 2 === 1) { ctx.fillStyle = col[1]; ctx.fillRect(snap(x0 + sw + ((k % 4 === 1) ? 0.5 : -0.5)), y0 + k, 0.5, 0.5); }
          }
          ctx.fillStyle = col[1]; ctx.fillRect(snap(x0 + sw - 0.5), y0 + hg.len, 1, 0.5);
          break;
        case 'roots':
          for (k = 0; k < hg.len * 0.7; k += 0.5) { ctx.fillStyle = k % 1.5 ? col[2] : col[0]; ctx.fillRect(snap(x0 + Math.sin(k + hg.ph) * 0.6), y0 + k, 0.5, 0.5); }
          break;
        case 'drips': case 'icicles':
          var L2 = hg.len * (hs[0] === 'drips' ? 0.6 : 0.8);
          for (k = 0; k < L2; k += 0.5) { var wd = Math.max(0.5, snap((1 - k / L2) * 2)); ctx.fillStyle = col[0]; ctx.fillRect(snap(x0 - wd / 2), y0 + k, wd, 0.5); ctx.fillStyle = col[1]; ctx.fillRect(snap(x0 - wd / 2), y0 + k, 0.5, 0.5); }
          break;
        case 'chains':
          for (k = 0; k < Math.min(4, hg.len * 0.5); k += 1) { ctx.fillStyle = k % 2 ? col[2] : col[0]; ctx.fillRect(x0, y0 + k, 0.5 + (k % 2) * 0.5, 1); }
          break;
      }
    });
  };
  // the floor under a point (for shadows), or null if it is a long way down
  var floorBelow = function (x, y, max) {
    var tx = Math.floor(x / T);
    for (var ty = Math.floor(y / T); ty * T < y + max; ty++) {
      var t = tileAt(tx, ty);
      if ((SOLID[t] || t === TL.SEMI) && ty * T >= y - 1) return ty * T;
    }
    return null;
  };
  var shadowUnder = function (ctx, x, feet, w) {
    var gy = floorBelow(x, feet, 40);
    if (gy === null) return;
    BB.shadow(ctx, x - G.cam.x, gy - G.cam.y, w, 0.32 * (1 - (gy - feet) / 40));
  };
  /* Every light in view this frame, for light.js: lamps, torches,
     crystals and toadstools, lava and fire, fireflies — and, in the dark
     worlds, a little glow round Bonnie himself. */
  var RAINBOW = ['#ff8aa8', '#ffe070', '#8ef0a0', '#8ac8ff', '#c8a0ff'];
  var gatherLights = function () {
    var pts = G.light.points, th = G.th, c = G.cam, W = BB.W, p = G.p, dark = !!(th.light && th.light.dark);
    pts.length = 0;
    var near = function (x, y, m) { return x > c.x - m && x < c.x + W + m && y > c.y - m && y < c.y + H + m; };
    var add = function (x, y, r, col, a, rim) { if (near(x, y, r)) pts.push({ x: x, y: y, r: r, col: col, a: a, rim: rim }); };
    if (dark && p.st !== 'in') add(p.x + p.w / 2, p.y + p.h / 2, 52, '#fff2d8', 0.12, 0);
    if (p.star) add(p.x + p.w / 2, p.y + p.h / 2, 40, RAINBOW[(G.tick >> 3) % 5], 0.4, 0);
    G.deco.forEach(function (d) {
      var y = d.row * T;
      if (d.name === 'torch') add(d.x + 2.5, y - 7, 48, '#ffae50', 0.42);
      else if (d.name === 'lamp') add(d.x + 3.5, y - 11, 42, '#ffe08a', 0.38);
      else if (d.name === 'crystal') add(d.x + 5, y - 6, 34, (d.x >> 3) % 2 ? '#ff9ae6' : '#7ae8ff', 0.3, 0.6);
      else if (d.name === 'mushroom' && dark) add(d.x + 5, y - 6, 26, '#ff8ad8', 0.3);
      else if (d.name === 'pumpkin') add(d.x + 6, y - 5, 28, '#ffa040', 0.34);
    });
    G.tiny.forEach(function (d) {
      if (d.name === 'glowP') add(d.x + 3, d.y - 3, 20, '#ff8ae0', 0.34);
      else if (d.name === 'glowC' || (d.name === 'crystal' && dark)) add(d.x + 2, d.y - 3, 20, '#7ae8ff', 0.3, 0.6);
    });
    G.ents.forEach(function (e) {
      if (!e.alive || !e.active) return;
      if (e.k === 'bubble' && e.y < e.y0 - 1) add(e.x + 4, e.y + 4, 32, '#ff7a30', 0.42);
      else if (e.k === 'dfire') add(e.x + 3, e.y + 3, 28, '#ff8a30', 0.42);
      else if (e.k === 'firebar') add(e.cx, e.cy, (e.sp.len || 4) * 7 + 12, '#ff9a40', 0.26);
      else if (e.k === 'lolly' || (e.k === 'sball' && dark)) add(e.x + 5, e.y + 5, 24, RAINBOW[(G.tick >> 3) % 5], 0.3);
      else if (e.k === 'ball') add(e.x + 3, e.y + 3, 14, '#fff0c0', 0.25);
    });
    if (th.lava) {
      for (var tx = Math.floor(c.x / T) - 2; tx < (c.x + W) / T + 2; tx += 2) for (var ty = G.gr; ty < G.h; ty++) if (tileAt(tx, ty) === TL.LAVA && tileAt(tx, ty - 1) !== TL.LAVA) { add(tx * T + 4, ty * T, 34, '#ff6a20', 0.34); break; }
    }
    if (G.def.theme === 'woods') G.ambient.forEach(function (q) { add(q.x + c.x, q.y + c.y, 6, '#e8ff70', 0.45, 0.5); });
  };

  var drawLava = function (ctx, tx, ty, x, y) {
    ctx.fillStyle = '#e83c1c'; ctx.fillRect(x, y, T, T);
    if (tileAt(tx, ty - 1) === TL.LAVA) { ctx.fillStyle = '#b8201c'; if ((tx + ty) % 2) ctx.fillRect(x + 2, y + 3, 2, 1); return; }
    var ph = reduce ? 0 : G.tick / 10;
    for (var k = 0; k < T; k++) {
      var wx = tx * T + k, hgt = Math.round(1.5 + Math.sin(wx * 0.5 + ph) * 1.5);
      ctx.fillStyle = '#ffd23c'; ctx.fillRect(x + k, y + hgt, 1, 1);
      ctx.fillStyle = '#fa9c38'; ctx.fillRect(x + k, y + hgt + 1, 1, 2);
    }
  };
  var drawBelt = function (ctx, x, y, dir) {
    ctx.fillStyle = '#1c1428'; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = '#585a70'; ctx.fillRect(x, y + 1, T, 5);
    ctx.fillStyle = '#9098b0'; ctx.fillRect(x, y + 1, T, 1);
    var off = reduce ? 0 : Math.floor(G.tick / 3) * dir;
    ctx.fillStyle = '#ffe048';
    for (var k = 0; k < T; k++) if (((x + G.cam.x + k - off) % 8 + 8) % 8 < 2) ctx.fillRect(x + k, y + 3, 1, 2);
    ctx.fillStyle = '#2c2a3c'; ctx.fillRect(x, y + 6, T, 2);
  };
  // the beach: the sea fills each gap, with a slow swell on top
  var drawSea = function (ctx) {
    if (!G.th.sea) return;
    var c = G.cam, top = G.gr * T + 4 - snap(c.y);
    var x0 = Math.max(0, Math.floor(c.x / T) - 1), x1 = Math.min(G.w - 1, Math.floor((c.x + BB.W) / T) + 1);
    var ph = reduce ? 0 : G.tick / 12;
    for (var tx = x0; tx <= x1; tx++) {
      if (!G.sea[tx]) continue;
      var x = tx * T - snap(c.x);
      ctx.fillStyle = '#2c88d0'; ctx.fillRect(x, top + 2, T, H - top);
      ctx.fillStyle = '#1e64b0'; ctx.fillRect(x, top + 10, T, H - top);
      for (var k = 0; k < T; k++) {
        var wx = tx * T + k, h2 = Math.round(1 + Math.sin(wx * 0.35 + ph) * 1.2);
        ctx.fillStyle = '#78d8ff'; ctx.fillRect(x + k, top + h2, 1, 3 - h2 + 1);
        ctx.fillStyle = '#ffffff'; if (h2 === 0) ctx.fillRect(x + k, top, 1, 1);
        if (((wx + Math.floor(ph * 3)) % 23) < 3) { ctx.fillStyle = '#e8f8ff'; ctx.fillRect(x + k, top + 7, 1, 1); }
      }
    }
  };
  var drawHouse = function (ctx, e) {
    var x = snap(e.x - G.cam.x), y = snap(e.y - G.cam.y);
    if (x > BB.W || x + 48 < 0) return;
    // walls
    ctx.fillStyle = '#1c1428'; ctx.fillRect(x, y + 14, 40, 26);
    ctx.fillStyle = '#fff3d8'; ctx.fillRect(x + 1, y + 15, 38, 25);
    ctx.fillStyle = '#e8c8a0'; ctx.fillRect(x + 1, y + 36, 38, 4);
    // roof
    for (var r = 0; r < 14; r++) {
      ctx.fillStyle = '#1c1428'; ctx.fillRect(x - 3 + r, y + 14 - r, 46 - r * 2, 1);
      ctx.fillStyle = r % 3 === 0 ? '#a42032' : '#f24848'; ctx.fillRect(x - 2 + r, y + 14 - r, 44 - r * 2, 1);
    }
    // chimney and its flag
    ctx.fillStyle = '#1c1428'; ctx.fillRect(x + 30, y - 2, 6, 10);
    ctx.fillStyle = '#b47240'; ctx.fillRect(x + 31, y - 1, 4, 9);
    ctx.fillStyle = '#1c1428'; ctx.fillRect(x + 20, y - 16, 1, 16);
    if (e.flag) BB.draw(ctx, A.checkFlag[1], x + 21, Math.round(y - 4 - e.flag));
    // door and windows
    ctx.fillStyle = '#1c1428'; ctx.fillRect(x + 15, y + 22, 11, 18);
    ctx.fillStyle = '#6c3e20'; ctx.fillRect(x + 16, y + 23, 9, 17);
    ctx.fillStyle = '#ffe048'; ctx.fillRect(x + 23, y + 31, 1, 2);
    [[x + 4, y + 22], [x + 30, y + 22]].forEach(function (w) {
      ctx.fillStyle = '#1c1428'; ctx.fillRect(w[0], w[1], 7, 7);
      ctx.fillStyle = e.flag ? '#ffe048' : '#78d8ff'; ctx.fillRect(w[0] + 1, w[1] + 1, 5, 5);
      ctx.fillStyle = '#1c1428'; ctx.fillRect(w[0] + 3, w[1] + 1, 1, 5); ctx.fillRect(w[0] + 1, w[1] + 3, 5, 1);
    });
  };

  var drawPlayer = function (ctx) {
    var p = G.p;
    if (p.st === 'in') return;
    if (p.inv && !reduce && (p.inv >> 2) % 2 && p.st === 'play') return;
    var big = p.power > 0 && !(p.crouch && false);
    if (p.st === 'grow' || p.st === 'shrink') { var ph = (p.t >> 2) % 2; big = p.st === 'grow' ? ph === 1 : ph === 0; }
    var set = big ? A.bonnie.b : A.bonnie.s, f;
    var dir = (BB.key('right') ? 1 : 0) - (BB.key('left') ? 1 : 0);
    if (p.st === 'dead') f = set.dead;
    else if (p.st === 'cheer') f = set.cheer;
    else if (p.st === 'arch') f = p.ground ? set.cheer : set.jump;
    else if (p.st === 'walk') f = set[RUN_CYCLE[(p.anim | 0) % 4]];
    else if (p.crouch && big) f = set.crouch;
    // under the sea his arms go up on each stroke and out as he glides
    else if (G.water && !p.ground) f = p.swimT > 6 ? set.jump : set.swim;
    else if (!p.ground) f = set.jump;
    else if (p.throwT && big) f = set.throw;
    else if (Math.abs(p.vx) > 0.15 || (dir && p.st === 'play')) f = set[RUN_CYCLE[(p.anim | 0) % 4]];
    else if (p.waveT > 20) f = set.cheer;
    else f = !reduce && G.tick % 200 < 7 ? set.blink : set.idle;
    var flip = p.face < 0 && p.st !== 'dead';
    var v = p.star ? A.bonnie.rainbow[(G.tick >> (p.star < STAR_WARN ? 3 : 2)) % 4] : (p.power === 2 && big ? A.bonnie.red : outfit().v);
    if (G.flash && (G.flash >> 2) % 2) v = A.bonnie.rainbow[2];
    /* squash and stretch: taller and thinner as he leaps, wider and
       shorter as he lands — drawn from his feet, so they stay planted */
    var k = reduce || p.st !== 'play' ? 0 : (p.sq || 0) / 8, fw = f.w * (1 + k * 0.14), fh = f.h * (1 - k * 0.14);
    var sx = snap(p.x + p.w / 2 - fw / 2 - G.cam.x), sy = snap(p.y + p.h - fh - G.cam.y);
    if (p.st !== 'dead') shadowUnder(ctx, p.x + p.w / 2, p.y + p.h, 13);
    if (outfit().cape && p.st !== 'dead') drawCape(ctx, sx + fw / 2 + (flip ? 1 : -1), sy + fh * 0.36, fh, flip ? -1 : 1, p.vx, G.tick);
    ctx.drawImage(BB.canvasOf(f, flip, v), sx, sy, fw, fh);
    // the light he is standing in catches his edge
    if (G.light) BB.catchLight(ctx, f, sx, sy, flip, v, G.light.at(p.x + p.w / 2, p.y + p.h * 0.4), fw, fh);
  };

  // the flowers the baddies left behind, growing in where they stood
  var drawBlooms = function (ctx) {
    var c = G.cam;
    G.blooms.forEach(function (b) {
      if (b.t < 20) b.t++;
      var x = snap(b.x - c.x), y = snap(b.y - c.y), k = reduce ? 1 : Math.min(1, b.t / 14), sway = reduce ? 0 : Math.round(Math.sin(G.tick * 0.04 + b.x) * 0.6 * 2) / 2;
      if (x < -6 || x > BB.W + 6) return;
      var sh = 4 * k;
      ctx.fillStyle = '#3e9a40'; ctx.fillRect(x, y - sh, 0.5, sh); ctx.fillRect(x + 0.5, y - sh * 0.5, 1, 0.5);
      if (k < 0.6) return;
      var hx = x + sway, hy = y - sh - 1;
      ctx.fillStyle = '#2a1640'; ctx.fillRect(hx - 1.5, hy - 1, 3.5, 2.5); ctx.fillRect(hx - 1, hy - 1.5, 2.5, 3.5);
      ctx.fillStyle = b.col; ctx.fillRect(hx - 1, hy - 0.5, 2.5, 1.5); ctx.fillRect(hx - 0.5, hy - 1, 1.5, 2.5);
      ctx.fillStyle = '#ffe048'; ctx.fillRect(hx, hy, 0.5, 0.5);
    });
  };
  var drawFx = function (ctx) {
    var c = G.cam;
    G.fx.forEach(function (f) {
      var x = snap(f.x - c.x), y = snap(f.y - c.y);
      switch (f.k) {
        case 'coin': BB.draw(ctx, A.star[Math.floor(f.t / 3) % 4], x, y); break;
        case 'brick': BB.draw(ctx, G.gfx.debris, x, y, f.t % 8 < 4); break;
        case 'chip': ctx.fillStyle = '#1c1428'; ctx.fillRect(x - 1, y - 1, 4, 4); ctx.fillStyle = f.col || '#d0d4e8'; ctx.fillRect(x, y, 2, 2); break;
        case 'dust': BB.draw(ctx, A.puff[f.t < 6 ? 0 : 1], x, y); break;
        case 'puff': BB.draw(ctx, A.puff[f.t < 10 ? 0 : 1], x, y); break;
        case 'sparkle': BB.draw(ctx, A.sparkle[Math.min(2, Math.floor(f.t / 5))], x, y); break;
        case 'spark': if (f.t < 30 || f.t % 2) { ctx.fillStyle = f.col; ctx.fillRect(x, y, 2, 2); } break;
        case 'ember': ctx.fillStyle = f.t < 8 ? '#ffd23c' : '#fa9c38'; ctx.fillRect(x, y, 1, 1); break;
        case 'bubble': BB.draw(ctx, A.bubble[f.t > 40 ? 1 : 0], x, y); break;
        case 'text': BB.text(ctx, f.s, x, y, { color: f.col || '#ffffff', outline: '#1c1428' }); break;
        case 'heart': ctx.globalAlpha = Math.max(0, 1 - f.t / f.life); BB.draw(ctx, A.heartSmall, x, y); ctx.globalAlpha = 1; break;
        case 'petal': ctx.globalAlpha = Math.max(0, 1 - f.t / f.life); ctx.fillStyle = f.col; ctx.fillRect(x, y, f.t % 10 < 5 ? 1.5 : 1, f.t % 10 < 5 ? 1 : 1.5); ctx.globalAlpha = 1; break;
        case 'breath': ctx.globalAlpha = 0.55 * Math.max(0, 1 - f.t / f.life); ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, 1 + f.t / 20, 1 + f.t / 20); ctx.globalAlpha = 1; break;
      }
    });
  };

  /* Ambient life: falling snow, fireflies in the woods, bubbles under the
     sea, embers in the castle. Purely for show; none with reduced motion. */
  var ambient = function (ctx) {
    if (reduce) return;
    var th = G.th, a = G.ambient, W = BB.W;
    var want = th.snowing ? 40 : G.def.theme === 'woods' ? 14 : th.water ? 10 : th.lava ? 14 : G.def.theme === 'cave' ? 10 : 0;
    while (a.length < want) a.push({ x: Math.random() * W, y: Math.random() * H, s: Math.random(), t: Math.random() * 100 });
    a.forEach(function (q) {
      q.t++;
      if (th.snowing) { q.y += 0.3 + q.s * 0.5; q.x += Math.sin(q.t * 0.03) * 0.3 - 0.1; ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(q.x), Math.round(q.y), q.s > 0.6 ? 2 : 1, q.s > 0.6 ? 2 : 1); }
      else if (G.def.theme === 'woods') { q.x += Math.sin(q.t * 0.02) * 0.3; q.y += Math.cos(q.t * 0.017) * 0.25; if (Math.sin(q.t * 0.05 + q.s * 6) > 0) { ctx.fillStyle = '#e8ff70'; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); } }
      else if (th.water) { q.y -= 0.25 + q.s * 0.3; q.x += Math.sin(q.t * 0.05) * 0.2; BB.draw(ctx, A.bubble[q.s > 0.5 ? 0 : 1], q.x, q.y); }
      else if (th.lava) { q.y -= 0.2 + q.s * 0.4; q.x += Math.sin(q.t * 0.04) * 0.2; ctx.fillStyle = q.s > 0.5 ? '#ffd23c' : '#fa9c38'; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); }
      else { q.y += 0.15; if (q.t % 60 < 30) { ctx.fillStyle = q.s > 0.5 ? '#78d8ff' : '#ff94cc'; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); } }
      if (q.y > H + 4) { q.y = -4; q.x = Math.random() * W; }
      if (q.y < -6) { q.y = H + 4; q.x = Math.random() * W; }
      if (q.x < -4) q.x = W + 2; if (q.x > W + 4) q.x = -2;
    });
  };

  var drawWorld = function (ctx, hud) {
    var W = BB.W, c = G.cam, g = G.gfx;
    var shx = G.shake && !reduce ? (G.shake % 4 < 2 ? 1 : -1) : 0;
    var cx = c.x, cy = c.y;
    c.x += shx;
    if (G.kick && !reduce) c.y -= G.kick > 2 ? 1 : 0.5;
    gatherLights();
    BB.drawBackdrop(ctx, g.bg, c.x, c.y, G.h * T);
    // scenery
    G.deco.forEach(function (d) {
      var s = A.deco[d.name];
      if (Array.isArray(s)) s = s[reduce ? 0 : Math.floor((G.tick + d.x) / 20) % s.length];
      var x = snap(d.x - c.x), y = snap(d.row * T - s.h - c.y);
      if (x > W || x + s.w < 0) return;
      BB.draw(ctx, s, x, y);
    });
    drawSea(ctx);
    // things that come up out of pipes and blocks go behind the tiles
    G.ents.forEach(function (e) {
      if (!e.alive || !e.active) return;
      if ((e.K.item && e.rise < e.h + 1) || (e.K.behind && !e.K.item)) e.K.draw(ctx, e);
    });
    drawTiles(ctx);
    drawGrowth(ctx);
    drawBlooms(ctx);
    G.ents.forEach(function (e) { if (e.alive && e.active && !e.K.item && !e.K.behind && !e.enemy && e.K.draw) e.K.draw(ctx, e); });
    G.ents.forEach(function (e) { if (e.alive && e.active && e.K.item && !(e.rise < e.h + 1)) e.K.draw(ctx, e); });
    G.ents.forEach(function (e) { if (e.alive && e.active && e.enemy && !e.K.behind) e.K.draw(ctx, e); });
    drawPlayer(ctx);
    drawFx(ctx);
    ambient(ctx);
    G.light.render(ctx, c, reduce);
    c.x = cx; c.y = cy;
    if (hud !== false) drawHud(ctx);
  };

  /* The HUD is the game's own type and icons, outlined so they read over
     any sky, with no boxes round them: lives and stars on the left, the
     score in the middle, the level on a little ribbon in its world's
     colour on the right — and on a touch screen, a paper pause button. */
  var pill = function (ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(24,12,48,0.5)';
    ctx.fillRect(x + 1.5, y, w - 3, h); ctx.fillRect(x + 0.5, y + 0.5, w - 1, h - 1); ctx.fillRect(x, y + 1.5, w, h - 3);
  };
  var HUDINK = '#2a1640';
  var LEVEL_COL = ['#46a83e', '#5cb43a', '#e89a28', '#22a8bc', '#8450d0', '#8a6ac0', '#4a96dc', '#e86aa4', '#e07a28', '#d03848'];
  BB.hud = { pause: null };
  var drawHud = function (ctx) {
    var W = BB.W, o = { color: '#ffffff', outline: HUDINK };
    BB.draw(ctx, A.heartSmall, 5, 5.5);
    BB.text(ctx, '\u221e', 12, 4, o);
    BB.draw(ctx, A.starSmall, 25, 4.5);
    BB.text(ctx, pad(save.stars, 2), 34, 4, { color: '#ffe048', outline: HUDINK });
    if (bearWith === G.n) BB.draw(ctx, A.bearHead, 48, 4);
    BB.text(ctx, pad(save.score, 6), W / 2, 4, { color: '#ffffff', outline: HUDINK, align: 'center' });
    var right = W - 2;
    if (BB.inputMode === 'touch') { BB.hud.pause = { on: 'screen', x: W - 18, y: 0, w: 18, h: 16 }; BB.icons.pause(ctx, W - 13, 2.5); right = W - 16; }
    else BB.hud.pause = null;
    var lv = W > 200 ? 'LEVEL ' + G.n : String(G.n), bw = BB.textW(lv) + 16;
    BB.ui.ribbon(ctx, right - bw / 2 - 6, 2, lv, LEVEL_COL[G.n - 1]);
  };
  var pad = function (n, l) { n = String(Math.max(0, n | 0)); while (n.length < l) n = '0' + n; return n; };

  /* ==========================================================================
     THE SCREENS
     ========================================================================== */
  var pauseAt = 0, cardCheck = false, cardQuick = false, titleAt = 0, overT = 0;
  var dark = '#1c1428', bright = '#ffe048';
  var box = function (ctx, x, y, w, h) {
    ctx.fillStyle = dark; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 1, y + 1, w - 2, 1); ctx.fillRect(x + 1, y + h - 2, w - 2, 1); ctx.fillRect(x + 1, y + 1, 1, h - 2); ctx.fillRect(x + w - 2, y + 1, 1, h - 2);
    ctx.fillStyle = '#3a2c58'; ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  };
  var blink = function () { return reduce || Math.floor(tick / 30) % 2 === 0; };
  // was this step's tap (a finger, or a click) inside this box of the screen?
  var tapIn = function (x, y, w, h) { var t = BB.tap; return !!t && t.on === 'screen' && t.x >= x && t.x < x + w && t.y >= y && t.y < y + h; };
  var UI = BB.ui, INK = UI.INK, PICK = UI.PICK;
  // a list to choose from, on paper, with Monsty pointing at the chosen one
  var listRow = 12;
  var drawList = function (ctx, items, at, x, y, w) {
    items.forEach(function (s, i) {
      var ry = y + i * listRow;
      if (i === at) { ctx.fillStyle = 'rgba(236,190,120,0.35)'; ctx.fillRect(x + 3, ry - 2, w - 6, listRow - 1); UI.cursor(ctx, x + 5, ry - 1, tick); }
      BB.text(ctx, s, x + 18, ry, { color: i === at ? PICK : INK });
    });
  };
  // a little picture and its words, centred together as one line
  var iconLine = function (ctx, icon, v, text, y, col, dy) {
    var w = icon.w + 3 + BB.textW(text), x = Math.round(BB.W / 2 - w / 2);
    BB.draw(ctx, icon, x, y + (dy || 0) + (7 - icon.h) / 2, false, v);
    BB.text(ctx, text, x + icon.w + 3, y, { color: col });
  };
  var listTap = function (n, x, y, w) { for (var i = 0; i < n; i++) if (tapIn(x, y + i * listRow - 3, w, listRow)) return i; return -1; };
  var panel = function (ctx, x, y, w, h) {
    var rr = function (dx, dy, ww, hh, col) { ctx.fillStyle = col; ctx.fillRect(x + dx + 2, y + dy, ww - 4, hh); ctx.fillRect(x + dx + 1, y + dy + 0.5, ww - 2, hh - 1); ctx.fillRect(x + dx + 0.5, y + dy + 1, ww - 1, hh - 2); ctx.fillRect(x + dx, y + dy + 2, ww, hh - 4); };
    rr(1, 2, w, h, 'rgba(12,6,28,0.45)');
    rr(0, 0, w, h, '#1c1428');
    rr(0.5, 0.5, w - 1, h - 1, '#3a2c62');
    rr(1, 1, w - 2, h - 2, '#2c2150');
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x + 3, y + 1.5, w - 6, 0.5);
  };
  // a line of words and controls, centred
  var promptW = function (parts) { var w = 0; parts.forEach(function (q, i) { w += (i ? 3 : 0) + (q[0] === 't' ? BB.textW(q[1]) : BB.glyphW(q[1])); }); return w; };
  var CONTROLS = [['g', 'move'], ['t', 'MOVE'], ['t', ' '], ['g', 'jump'], ['t', 'JUMP'], ['t', ' '], ['g', 'run'], ['t', 'RUN']];

  /* ---- title: the logo bounces, Bonnie bounces on a trampoline ---- */
  var titleBg = null, titleLight = null, titleBounce = { y: 0, vy: 0, squash: 0 };
  var drawLogo = function (ctx, cx, y) {
    var words = [['BONNIE', '#ffe048', '#fa9c38'], ['BOUNCE', '#78d8ff', '#3a6cf4']];
    words.forEach(function (wd, r) {
      var s = wd[0], sc = BB.W > 200 ? 3 : 2, w = BB.textW(s, sc), x = Math.round(cx - w / 2);
      for (var i = 0; i < s.length; i++) {
        var by = reduce ? 0 : Math.round(Math.abs(Math.sin(tick * 0.07 - i * 0.5 - r * 1.4)) * -5);
        var ly = y + r * (8 * sc + 6) + by;
        BB.text(ctx, s[i], x + i * 6 * sc + sc, ly + sc, { scale: sc, color: '#1c1428' });
        BB.text(ctx, s[i], x + i * 6 * sc, ly, { scale: sc, color: wd[2], outline: '#1c1428' });
        // the top half of each letter is lighter: the classic two-tone title
        ctx.save(); ctx.beginPath(); ctx.rect(x + i * 6 * sc, ly, 6 * sc, 3 * sc + 1); ctx.clip();
        BB.text(ctx, s[i], x + i * 6 * sc, ly, { scale: sc, color: wd[1] });
        ctx.restore();
      }
    });
  };
  var updateTitle = function () {
    bounceTitle();
    if (BB.hit('start') || BB.hit('a') || BB.tap) {
      sfx('start');
      if (hasProgress()) { go('menu'); menuAt = 0; menuSure = false; }
      else newGame();
    }
  };
  // Bonnie on his trampoline
  var bounceTitle = function () {
    sceneT++;
    var b = titleBounce;
    b.vy += 0.2; b.y += b.vy;
    if (b.y >= 0) { b.y = 0; b.vy = -3.9; b.squash = 8; }
    if (b.squash) b.squash--;
  };
  var menuAt = 0;
  var newGame = function () {
    var won = save.won;
    save = fresh();
    save.won = won;
    if (/[?&]debug\b/.test(qs)) save.unlocked = 10;
    store();
    wipeTo(function () { go('story'); });  // …which goes straight on into Level 1
  };
  var drawTitle = function (ctx) {
    var W = BB.W;
    if (!titleBg) titleBg = BB.backdrop('hills', A.themes.hills);
    BB.drawBackdrop(ctx, titleBg, reduce ? 0 : tick * 0.4, 0, H);
    // a strip of ground
    var g = theme('hills');
    var gx = reduce ? 0 : (tick * 0.4) % 16;
    for (var x = 0; x < W + 16; x += 8) { BB.draw(ctx, g.top[(x >> 3) & 1], x - gx, 128); BB.draw(ctx, g.fill[(x >> 3) & 1], x - gx, 136); }
    // the cast, strolling past under the title
    var cast = [E.grumbug, E.snail, E.crab, E.penguin, E.hog, E.robot, E.grumbug], span = W + cast.length * 34;
    cast.forEach(function (list, i) {
      var f = list[reduce ? 0 : Math.floor(tick / 10) % 2];
      var x = Math.round(((i * 34 - (reduce ? 0 : tick * 0.35)) % span + span) % span - 30);
      BB.draw(ctx, f, x, 128 - f.h);
    });
    drawLogo(ctx, W / 2, 10);
    // Bonnie and the trampoline, to one side of the words
    var tx = Math.round(W / 2 + Math.min(70, W / 2 - 26) - 8), b = titleBounce;
    BB.draw(ctx, A.spring[b.squash ? 1 : 0], tx - 0, 118);
    var f = b.y < -2 ? A.bonnie.s.jump : A.bonnie.s.idle;
    var by = Math.round(110 - f.h + b.y + (b.squash ? 2 : 0));
    BB.draw(ctx, f, tx + 8 - f.w / 2, by);
    if (!titleLight) titleLight = BB.lighting(A.themes.hills.light, 6000, 5);
    BB.catchLight(ctx, f, tx + 8 - f.w / 2, by, false, null, { i: 0.55, col: '#fff0b8', dir: -1 });
    titleLight.render(ctx, { x: reduce ? 0 : tick * 0.4, y: 0 }, reduce);
    if (scene === 'title') {
      var mx = W > 220 ? W / 2 : W / 2 - 14;
      if (blink()) BB.prompt(ctx, BB.inputMode === 'touch' ? [['t', 'TAP TO PLAY']] : [['t', 'PRESS'], ['g', 'ok'], ['t', 'TO PLAY']], mx, 68, { align: 'center', outline: dark, shadow: null });
      BB.text(ctx, 'A GAME FOR BONNIE', W / 2, 134, { color: '#fff3a8', outline: dark, align: 'center' });
    }
  };
  var MENU = ['CONTINUE', 'NEW GAME', 'GROWN-UPS'];
  var menuBox = function () { var W = BB.W, kb = BB.inputMode !== 'touch', bw = kb ? 118 : 100, n = menuSure ? 2 : 3; return { x: Math.round((W > 220 ? W / 2 : W / 2 - 14) - bw / 2), y: W > 200 ? 70 : 56, w: bw, h: (kb ? 22 : 10) + n * listRow, n: n }; };
  /* NEW GAME wipes the island, so it asks first: a stray tap from a
     small finger should never cost anyone their progress. */
  var menuSure = false;
  var updateMenu = function () {
    var b = menuBox();
    if (BB.hit('up')) { menuAt = (menuAt + b.n - 1) % b.n; sfx('select'); }
    if (BB.hit('down')) { menuAt = (menuAt + 1) % b.n; sfx('select'); }
    var tapped = listTap(b.n, b.x, b.y + 7, b.w);
    if (tapped >= 0) menuAt = tapped;
    if (BB.hit('a') || BB.hit('start') || tapped >= 0) {
      if (menuSure) {
        // the question: KEEP MY GAME (0) or START OVER (1)
        menuSure = false;
        if (menuAt === 1) { sfx('start'); newGame(); } else { sfx('select'); menuAt = 0; }
      } else if (menuAt === 0) { sfx('start'); wipeTo(function () { go('map'); mapEnter(); }); }
      else if (menuAt === 2) { openGrownups('menu'); }
      else { sfx('select'); menuSure = true; menuAt = 0; }
    }
    if (BB.hit('b')) { if (menuSure) { menuSure = false; menuAt = 0; } else go('title'); }
  };
  var drawMenu = function (ctx) {
    drawTitle(ctx);
    var b = menuBox();
    UI.paper(ctx, b.x, b.y, b.w, b.h);
    if (menuSure) {
      UI.ribbon(ctx, b.x + b.w / 2, b.y - 7, 'START OVER?', PICK);
      drawList(ctx, ['KEEP MY GAME', 'START OVER'], menuAt, b.x, b.y + 7, b.w);
    } else drawList(ctx, MENU, menuAt, b.x, b.y + 7, b.w);
    if (BB.inputMode !== 'touch') {
      var parts = [['g', 'choose'], ['t', 'CHOOSE'], ['g', 'ok'], ['t', 'OK']], py = b.y + 7 + b.n * listRow;
      ctx.fillStyle = '#ecd6ae'; ctx.fillRect(b.x + 6, py - 2, b.w - 12, 0.5);
      BB.prompt(ctx, parts, b.x + b.w / 2, py, { align: 'center', color: INK, shadow: null });
    }
  };

  /* ---- the story: one quick scene, then straight in ------------------------------
     Grumble swoops in and flies off with Monsty, Bear bolts for cover,
     "OH NO!" — about three seconds, and a tap skips it. Then the first
     level itself, not the map: playing comes first. */
  var STORY_T = 210;
  var updateStory = function () {
    sceneT++;
    if (wipe) return;
    if ((sceneT > 20 && (BB.hit('a') || BB.hit('start') || BB.tap)) || sceneT > STORY_T) {
      save.seenStory = true; save.at = 1; store(); sfx('start'); cardCheck = false; bearWith = 0;
      wipeTo(function () { go('card'); });
    }
  };
  var storyBg = null;
  var drawStory = function (ctx) {
    var W = BB.W, t = reduce ? 90 : sceneT;
    if (!storyBg) storyBg = BB.backdrop('hills', A.themes.hills);
    BB.drawBackdrop(ctx, storyBg, 0, 0, H);
    ctx.fillStyle = 'rgba(60,20,70,' + Math.min(0.28, t / 160) + ')'; ctx.fillRect(0, 0, W, H);
    var g = theme('hills'), gy = 128;
    for (var x = 0; x < W; x += 8) { BB.draw(ctx, g.top[(x >> 3) & 1], x, gy); BB.draw(ctx, g.fill[(x >> 3) & 1], x, gy + 8); }
    var mid = Math.round(W / 2), S = A.bonnie.s, bear = E.bear;
    // Grumble, with Monsty in the cage, swooping across from the right
    var fx2 = W + 30 - t * 1.7, fy = 10 + Math.sin(t * 0.08) * 4;
    var d = A.en.dragon.walk[Math.floor(t / 8) % 2], flap = Math.sin(t * 0.4);
    ctx.fillStyle = '#3e9a40';
    for (var wv = 0; wv < 9; wv += 0.5) { var wh = (9 - wv) * 0.7 * (0.5 + flap * 0.5); ctx.fillRect(snap(fx2 + 10 + wv), snap(fy - wh), 0.5, wh + 1); }
    BB.draw(ctx, d, fx2, fy);
    BB.draw(ctx, A.monsty, fx2 + 6, fy + d.h + 2);
    BB.draw(ctx, A.cage, fx2 + 4, fy + d.h - 1);
    // Bonnie reaching up after them; Bear running off to hide
    BB.draw(ctx, t > 30 ? S.cheer : S.idle, mid - 30, gy - S.idle.h);
    var bx = mid + 4 - Math.max(0, t - 24) * 1.8;
    if (bx > -20) { var bw2 = t < 24 ? bear.sit[0] : bear.walk[Math.floor(t / 4) % 2]; BB.draw(ctx, bw2, bx, gy - bw2.h); }
    // the words, big and few
    if (t > 40) {
      BB.text(ctx, 'OH NO!', W / 2, 70, { color: '#ffe048', outline: dark, align: 'center', scale: 2 });
      BB.text(ctx, 'GRUMBLE TOOK MONSTY!', W / 2, 90, { color: '#ffffff', outline: dark, align: 'center' });
    }
  };

  /* ---- the map -----------------------------------------------------------------------
     Bonnie's island (map.js draws it). He walks the path between the
     levels he has opened; choosing one closes a circle onto its medallion
     and opens on the level's card. */
  var mapX = 0, mapY = 0, mapCam = 0, mapWalk = null, mapFace = 1, mapGoal = 0;
  var nodePos = function (i) { return BB.Map.node(i); };
  var mapEnter = function (walkFrom) {
    var at = Math.max(1, Math.min(save.unlocked, save.at || 1));
    save.at = at;
    var p = nodePos(at - 1); mapX = p.x; mapY = p.y; mapGoal = 0;
    if (walkFrom && walkFrom !== at) { var q = nodePos(walkFrom - 1); mapX = q.x; mapY = q.y; mapWalk = { from: walkFrom, to: at, t: 0 }; mapFace = at > walkFrom ? 1 : -1; }
    mapCam = Math.max(0, Math.min(BB.Map.width - BB.W, mapX - BB.W / 2));
    BB.music('map');
  };
  // how many stars a level holds (stars, star blocks, and the bricks that pay out eight)
  var totals = {};
  var levelTotal = function (n) {
    if (totals[n] !== undefined) return totals[n];
    var L = BB.buildLevel(n), c = 0;
    for (var i = 0; i < L.map.length; i++) {
      if (L.map[i] === TL.COIN) c++;
      else if (L.cont[i] === CT.MULTI) c += 8;
      else if ((L.map[i] === TL.Q || L.map[i] === TL.HIDDEN) && L.cont[i] === CT.COIN) c++;
    }
    return (totals[n] = c);
  };
  // the PLAY button on the map's bottom strip (touch), in screen pixels
  var playBtn = function () { return { x: BB.W / 2 + 22, y: H - 17, w: 36, h: 15 }; };
  var playLevel = function () {
    sfx('start'); store(); cardCheck = false; mapGoal = 0; bearWith = 0;
    var np = nodePos(save.at - 1);
    wipeTo(function () { go('card'); }, np.x - mapCam, np.y);
  };
  var stepTo = function (n) { mapWalk = { from: save.at, to: n, t: 0 }; mapFace = n > save.at ? 1 : -1; save.at = n; };
  var updateMap = function () {
    sceneT++;
    if (mapWalk) {
      mapWalk.t += 1;
      var a = nodePos(mapWalk.from - 1), b = nodePos(mapWalk.to - 1), dist = Math.abs(b.x - a.x), k = Math.min(1, mapWalk.t * 1.1 / dist);
      mapX = a.x + (b.x - a.x) * k;
      mapY = a.y + (b.y - a.y) * k - Math.sin(k * Math.PI) * 4;
      if (mapWalk.t % 12 === 1) sfx('step');
      if (k >= 1) { mapWalk = null; if (!mapGoal || mapGoal === save.at) { mapGoal = 0; sfx('select'); } }
    } else if (mapGoal && mapGoal !== save.at) {
      // a tapped level further along: he walks there a stop at a time, along the path
      stepTo(save.at + (mapGoal > save.at ? 1 : -1));
    } else {
      // a tap on a level's medallion walks him there; on his own, or on PLAY, it starts
      var tp = BB.tap, tappedNode = 0;
      if (tp && tp.on === 'screen' && sceneT > 10) {
        for (var i = 0; i < 10; i++) { var q = nodePos(i); if (Math.hypot(tp.x + mapCam - q.x, tp.y - q.y) < 11) tappedNode = i + 1; }
        if (Math.hypot(tp.x + mapCam - mapX, tp.y - (mapY - 10)) < 10) tappedNode = save.at;
      }
      var pb = playBtn(), bb = bookBtn();
      if (tapIn(bb.x, bb.y, bb.w, bb.h) && sceneT > 10) openBook();
      else if (BB.hit('b') && sceneT > 10) openBook();
      else if (BB.inputMode === 'touch' && tapIn(pb.x, pb.y, pb.w, pb.h) && sceneT > 10) playLevel();
      else if (tappedNode && tappedNode > save.unlocked) sfx('bump');
      else if (tappedNode && tappedNode === save.at) playLevel();
      else if (tappedNode) { mapGoal = tappedNode; sfx('select'); }
      else if (BB.hit('right') && save.at < save.unlocked) stepTo(save.at + 1);
      else if (BB.hit('left') && save.at > 1) stepTo(save.at - 1);
      else if (BB.hit('right') || BB.hit('left')) sfx('bump');
      else if ((BB.hit('a') || BB.hit('start')) && sceneT > 10) playLevel();
      else if (BB.hit('select')) wipeTo(function () { go('title'); BB.music('title'); });
    }
    var target = Math.max(0, Math.min(BB.Map.width - BB.W, mapX - BB.W / 2));
    mapCam += (target - mapCam) * 0.1;
  };
  var drawMap = function (ctx) {
    var W = BB.W, def = BB.LEVELS[save.at - 1], n = save.at;
    BB.Map.draw(ctx, {
      t: sceneT, reduce: reduce, camX: mapCam, at: n, unlocked: save.unlocked, cleared: save.cleared, won: save.won,
      bonnie: { x: mapX, y: mapY }, walking: !!mapWalk, facing: mapFace, power: save.power, v: outfit().v
    });
    // the world's name on a ribbon in its colour, and a paper tag under it
    // with the level's number and the stars found there
    var tot = levelTotal(n), best = Math.min(tot, (save.best && save.best[n]) || 0), sl = best + '/' + tot;
    UI.ribbon(ctx, W / 2, 3, def.name, LEVEL_COL[n - 1]);
    // …and Bear's face: bright if he's come home from this level, a shadow if he's still hiding there
    var tag = 'LEVEL ' + n, tw = BB.textW(tag) + 10 + BB.textW(sl) + 8 + 10 + 13, tx = W / 2 - tw / 2;
    UI.paper(ctx, tx, 17, tw, 13, { stitch: false });
    BB.text(ctx, tag, tx + 5, 20, { color: INK });
    BB.draw(ctx, A.starSmall, tx + tw - 13 - BB.textW(sl) - 14, 20);
    BB.text(ctx, sl, tx + tw - 13 - BB.textW(sl) - 5, 20, { color: best >= tot ? PICK : INK });
    BB.draw(ctx, A.bearHead, tx + tw - 13, 19.5, false, save.bears[n] ? null : A.bearDim);
    // the sticker book, on a paper tab in the corner
    var bk = bookBtn();
    UI.paper(ctx, bk.x, bk.y, bk.w, bk.h, { stitch: false, fill: '#ffe6f0' });
    ctx.fillStyle = '#e86aa4'; ctx.fillRect(bk.x + 4, bk.y + 3.5, 6, 7); ctx.fillStyle = '#ffffff'; ctx.fillRect(bk.x + 5, bk.y + 4.5, 0.5, 5);
    if (bk.w > 20) BB.text(ctx, 'BOOK', bk.x + 12, bk.y + 3.5, { color: INK });
    // what to do, on a strip of paper at the bottom
    if (!mapWalk && !mapGoal) {
      if (BB.inputMode === 'touch') {
        var tp2 = [['g', 'choose'], ['t', 'TAP A LEVEL']], tw2 = promptW(tp2), pb = playBtn();
        var sx = pb.x - tw2 - 14;
        UI.paper(ctx, sx, H - 17, tw2 + 10, 15, { stitch: false });
        BB.prompt(ctx, tp2, sx + 5, H - 14.5, { color: INK, shadow: null });
        // PLAY: a green button you can press
        var pr = tick % 40 < 20 || reduce ? 0 : 0.5;
        UI.round(ctx, pb.x + 1, pb.y + 2, pb.w, pb.h, 'rgba(28,14,48,0.35)', 2);
        UI.round(ctx, pb.x, pb.y + pr, pb.w, pb.h, INK, 2);
        UI.round(ctx, pb.x + 0.5, pb.y + 0.5 + pr, pb.w - 1, pb.h - 1, '#3a9a3a', 1.5);
        UI.round(ctx, pb.x + 0.5, pb.y + 0.5 + pr, pb.w - 1, pb.h - 2.5, '#5cc85a', 1.5);
        ctx.fillStyle = '#a8f0a0'; ctx.fillRect(pb.x + 3, pb.y + 1.5 + pr, pb.w - 6, 0.5);
        BB.text(ctx, 'PLAY', pb.x + pb.w / 2, pb.y + 4 + pr, { color: '#ffffff', align: 'center', shadow: '#2a6a2a' });
      } else {
        var parts = W > 220 ? [['g', 'move'], ['t', 'CHOOSE'], ['g', 'ok'], ['t', 'PLAY'], ['g', 'run'], ['t', 'BOOK']] : [['g', 'move'], ['t', 'CHOOSE'], ['t', ' '], ['g', 'ok'], ['t', 'PLAY']], pw = promptW(parts);
        UI.paper(ctx, W / 2 - pw / 2 - 6, H - 17, pw + 12, 15, { stitch: false });
        BB.prompt(ctx, parts, W / 2, H - 14.5, { align: 'center', color: INK, shadow: null });
      }
    }
  };

  /* ---- for grown-ups --------------------------------------------------------------
     Record your own voice for Bonnie: "Yay!", "Wheee!" and "Well done!"
     (voice.js plays them in the game). Behind a hold-to-open gate, so a
     small player can't wander in by accident. */
  var gu = { from: 'menu', hold: 0, open: false, row: 0, col: 0, msg: '' };
  var VOICES = [['yay', 'YAY!'], ['wheee', 'WHEEE!'], ['welldone', 'WELL DONE']];
  var openGrownups = function (from) { sfx('select'); gu.from = from; gu.hold = 0; gu.open = false; gu.row = 0; gu.col = 0; gu.msg = ''; go('grownups'); };
  var guButtons = function () {
    // laid out to fit the narrowest screen: the names on the left, three buttons on the right
    var W = BB.W, x0 = W - 80, out = [];
    VOICES.forEach(function (v, r) { [['REC', 24], ['PLAY', 30], ['X', 12]].forEach(function (b, c) { var x = x0 + [0, 27, 60][c]; out.push({ r: r, c: c, x: x, y: 46 + r * 22, w: b[1], h: 14, t: b[0] }); }); });
    return out;
  };
  var guDo = function (r, c) {
    var n = VOICES[r][0];
    if (!BB.voice || !BB.voice.can()) { gu.msg = 'NO MICROPHONE HERE'; sfx('bump'); return; }
    if (c === 0) { gu.msg = 'SAY IT NOW!'; BB.audioKick(); BB.voice.record(n, function (ok) { gu.msg = ok ? 'SAVED' : 'COULD NOT RECORD'; }); }
    else if (c === 1) { if (!BB.voice.play(n)) { gu.msg = BB.muted() ? 'SOUND IS OFF' : 'NOTHING YET'; sfx('bump'); } }
    else { BB.voice.clear(n); gu.msg = 'GONE'; sfx('select'); }
  };
  var updateGrownups = function () {
    sceneT++;
    var back = function () { sfx('select'); if (gu.from === 'pause') go('pause'); else go('menu'); };
    if (BB.hit('start') || BB.hit('b') || (BB.tap && tapIn(BB.W - 18, 0, 18, 18))) { back(); return; }
    if (!gu.open) {
      // hold for a second and a half to open
      if (BB.key('a') || BB.touchDown) { gu.hold++; if (gu.hold > 90) { gu.open = true; sfx('start'); } } else gu.hold = Math.max(0, gu.hold - 3);
      return;
    }
    if (BB.voice && BB.voice.recording()) return;
    if (BB.hit('up')) { gu.row = (gu.row + 2) % 3; sfx('select'); }
    if (BB.hit('down')) { gu.row = (gu.row + 1) % 3; sfx('select'); }
    if (BB.hit('left')) { gu.col = (gu.col + 2) % 3; sfx('select'); }
    if (BB.hit('right')) { gu.col = (gu.col + 1) % 3; sfx('select'); }
    if (BB.hit('a')) guDo(gu.row, gu.col);
    guButtons().forEach(function (b) { if (tapIn(b.x, b.y, b.w, b.h)) { gu.row = b.r; gu.col = b.c; guDo(b.r, b.c); } });
  };
  var drawGrownups = function (ctx) {
    var W = BB.W;
    ctx.fillStyle = '#3a2a50'; ctx.fillRect(0, 0, W, H);
    UI.paper(ctx, 2, 4, W - 4, H - 8);
    UI.ribbon(ctx, W / 2, 1, 'GROWN-UPS', '#8450d0');
    BB.text(ctx, 'X', W - 11, 6, { color: INK });
    if (!gu.open) {
      BB.text(ctx, 'FOR GROWN-UPS ONLY', W / 2, 40, { color: INK, align: 'center' });
      var hp = BB.inputMode === 'touch' ? [['t', 'HOLD A FINGER DOWN']] : [['t', 'HOLD'], ['g', 'ok'], ['t', 'TO OPEN']];
      BB.prompt(ctx, hp, W / 2, 58, { align: 'center', color: INK, shadow: null });
      var bw = 90, bx = W / 2 - bw / 2;
      UI.round(ctx, bx, 76, bw, 8, INK, 2); UI.round(ctx, bx + 1, 77, (bw - 2) * Math.min(1, gu.hold / 90), 6, PICK, 1.5);
      return;
    }
    BB.text(ctx, 'RECORD A VOICE FOR BONNIE', W / 2, 20, { color: INK, align: 'center' });
    var rc = BB.voice && BB.voice.recording();
    VOICES.forEach(function (v, r) {
      var y = 46 + r * 22;
      BB.icons.disc(ctx, 14, y + 6, 2.4, BB.voice && BB.voice.has(v[0]) ? '#46a83e' : '#d8bc8c');
      BB.text(ctx, v[1], 21, y + 3.5, { color: INK });
    });
    guButtons().forEach(function (b) {
      var sel = BB.inputMode !== 'touch' && b.r === gu.row && b.c === gu.col, live = rc && rc.n === VOICES[b.r][0] && b.c === 0;
      UI.round(ctx, b.x, b.y, b.w, b.h, INK, 2);
      UI.round(ctx, b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1, live ? '#ff6a7a' : sel ? '#ffe6a8' : '#fff4dc', 1.5);
      if (live) { ctx.fillStyle = '#c8304a'; ctx.fillRect(b.x + 1, b.y + b.h - 3, (b.w - 2) * rc.k, 2); }
      BB.text(ctx, b.t, b.x + b.w / 2, b.y + 3.5, { color: live ? '#ffffff' : INK, align: 'center' });
    });
    BB.text(ctx, gu.msg || 'KEPT ON THIS DEVICE ONLY', W / 2, H - 22, { color: gu.msg ? PICK : UI.SOFT, align: 'center' });
  };

  /* ---- the sticker book ----------------------------------------------------------
     Opened from the map. Three pages:
       FRIENDS    a sticker of Bear for every land he came home from
       CREATURES  a sticker for everyone Bonnie has met, a shape to find
                  for everyone he hasn't
       OUTFITS    what he can wear — won by finding Bear 3, 6 and 10 times
     Stickers are the game's own sprites with a white sticker edge. */
  var STICKERS = {
    grumbug: function () { return E.grumbug[0]; }, snail: function () { return E.snail[0]; }, crab: function () { return E.crab[0]; },
    gull: function () { return E.gull[0]; }, bee: function () { return E.bee[0]; }, fish: function () { return E.fish[0]; },
    jelly: function () { return E.jelly[0]; }, ghost: function () { return E.ghost[0]; }, bat: function () { return E.bat[0]; },
    hog: function () { return E.hog[0]; }, rock: function () { return E.rock[0]; }, penguin: function () { return E.penguin[0]; },
    snowman: function () { return E.snowman[0]; }, robot: function () { return E.robot[0]; }, plant: function () { return E.plant[0]; },
    bubble: function () { return E.bubble[0]; }, dragon: function () { return E.dragon.walk[0]; }
  };
  var STICKER_ORDER = Object.keys(STICKERS);
  var stickerCache = {};
  // a sprite with a white edge round it (or, not found yet, its shape in pencil)
  var sticker = function (s, found) {
    var key = (s.id || (s.id = 's' + Math.random().toString(36).slice(2))) + (found ? 'y' : 'n');
    if (stickerCache[key]) return stickerCache[key];
    var src = BB.canvasOf(s, false, null), pad = 3, out = document.createElement('canvas');
    out.width = src.width + pad * 2; out.height = src.height + pad * 2;
    var o = out.getContext('2d'), sil = document.createElement('canvas');
    sil.width = src.width; sil.height = src.height;
    var sg = sil.getContext('2d');
    sg.drawImage(src, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = found ? '#ffffff' : '#e2c79a'; sg.fillRect(0, 0, sil.width, sil.height);
    if (found) {
      for (var a = 0; a < 16; a++) o.drawImage(sil, pad + Math.round(Math.cos(a / 16 * 6.283) * pad), pad + Math.round(Math.sin(a / 16 * 6.283) * pad));
      o.drawImage(src, pad, pad);
    } else o.drawImage(sil, pad, pad);
    // its shadow: the sticker's own shape, a little darker than the page
    var sh = document.createElement('canvas'); sh.width = out.width; sh.height = out.height;
    var shg = sh.getContext('2d'); shg.drawImage(out, 0, 0); shg.globalCompositeOperation = 'source-in'; shg.fillStyle = 'rgba(110,70,30,0.3)'; shg.fillRect(0, 0, sh.width, sh.height);
    return (stickerCache[key] = { c: out, sh: sh, w: out.width / BB.R, h: out.height / BB.R });
  };
  var drawSticker = function (ctx, s, found, cx, by, box) {
    var st = sticker(s, found), sc = Math.min(2, box / st.w, box / st.h);
    sc = sc >= 2 ? 2 : sc >= 1 ? 1 : sc >= 0.5 ? 0.5 : sc;
    var w = st.w * sc, h = st.h * sc;
    ctx.imageSmoothingEnabled = sc < 0.5;
    if (found) ctx.drawImage(st.sh, snap(cx - w / 2 + 1), snap(by - h + 1.5), w, h);
    ctx.drawImage(st.c, snap(cx - w / 2), snap(by - h), w, h);
    ctx.imageSmoothingEnabled = false;
  };
  var BOOK = ['FRIENDS', 'CREATURES', 'OUTFITS'], BOOK_COL = ['#e86aa4', '#46a83e', '#4a96dc'];
  var bookPage = 0, outfitAt = 0;
  // on a narrow screen the tab is just the book, so it clears the level's ribbon
  var bookBtn = function () { return { x: 3, y: 3, w: BB.W > 200 ? 36 : 15, h: 14 }; };
  var openBook = function () { sfx('select'); bookPage = 0; outfitAt = 0; OUTFITS.forEach(function (o, i) { if (o.id === save.outfit) outfitAt = i; }); wipeTo(function () { go('book'); }); };
  // four across on a wide screen; two by two on a narrow one, so the names fit
  var outfitCells = function () {
    var W = BB.W;
    if (W >= 200) { var cw = Math.min(56, (W - 24) / 4); return OUTFITS.map(function (o, i) { return { x: W / 2 - cw * 2 + i * cw, y: 28, w: cw, h: 92, big: true }; }); }
    var cw2 = (W - 24) / 2;
    return OUTFITS.map(function (o, i) { return { x: 12 + (i % 2) * cw2, y: 26 + Math.floor(i / 2) * 52, w: cw2, h: 50 }; });
  };
  var wearOutfit = function (i) {
    var o = OUTFITS[i];
    if (bearsHome() < o.need) { sfx('bump'); return; }
    save.outfit = o.id; store(); sfx('power');
  };
  var updateBook = function () {
    sceneT++;
    var W = BB.W, n = BOOK.length;
    var turn = function (d) { var np = bookPage + d; if (np < 0 || np >= n) { sfx('bump'); return; } bookPage = np; sceneT = 0; sfx('select'); };
    var close = function () { store(); sfx('select'); wipeTo(function () { go('map'); mapEnter(); }); };
    if (BB.hit('start') || BB.hit('b') || (BB.tap && tapIn(W - 18, 0, 18, 18))) { close(); return; }
    if (BB.tap && tapIn(0, 40, 20, 70)) { turn(-1); return; }
    if (BB.tap && tapIn(W - 20, 40, 20, 70)) { turn(1); return; }
    if (bookPage === 2) {
      outfitCells().forEach(function (c, i) { if (tapIn(c.x, c.y, c.w, c.h)) { outfitAt = i; wearOutfit(i); } });
      if (BB.hit('left')) { if (outfitAt > 0) { outfitAt--; sfx('select'); } else turn(-1); }
      if (BB.hit('right') && outfitAt < OUTFITS.length - 1) { outfitAt++; sfx('select'); }
      if (BB.hit('a')) wearOutfit(outfitAt);
    } else {
      if (BB.hit('left')) turn(-1);
      if (BB.hit('right')) turn(1);
    }
  };
  var drawBook = function (ctx) {
    var W = BB.W, k = bookPage;
    ctx.fillStyle = '#5a3a6a'; ctx.fillRect(0, 0, W, H);
    UI.paper(ctx, 2, 4, W - 4, H - 8);
    // the spine down the middle of the open book
    ctx.fillStyle = 'rgba(160,120,80,0.25)'; ctx.fillRect(W / 2 - 0.5, 8, 1, H - 20);
    UI.ribbon(ctx, W / 2, 1, BOOK[k], BOOK_COL[k]);
    var nb = bearsHome();
    if (k === 0) {
      // Bear, from every land he came home from
      var cw = (W - 24) / 5;
      for (var i = 0; i < 10; i++) {
        var cx = 12 + cw * (i % 5) + cw / 2, by = i < 5 ? 58 : 104, found = !!save.bears[i + 1];
        drawSticker(ctx, E.bear.sit[0], found, cx, by, Math.min(cw - 4, 34));
        BB.text(ctx, String(i + 1), cx, by + 3, { color: found ? INK : UI.SOFT, align: 'center' });
        if (!found) BB.text(ctx, '?', cx, by - 13, { color: '#c8a878', align: 'center' });
      }
      BB.text(ctx, 'BEAR CAME HOME: ' + nb + '/10', W / 2, 18, { color: INK, align: 'center' });
    } else if (k === 1) {
      var met = 0, cols = W > 200 ? 9 : 6, cw2 = (W - 24) / cols, rowsN = Math.ceil(STICKER_ORDER.length / cols), rh = Math.min(30, 94 / rowsN);
      STICKER_ORDER.forEach(function (key, i) {
        var f = !!save.met[key]; if (f) met++;
        var cx = 12 + cw2 * (i % cols) + cw2 / 2, by = 46 + Math.floor(i / cols) * rh;
        drawSticker(ctx, STICKERS[key](), f, cx, by, Math.min(cw2 - 2, rh - 4));
      });
      BB.text(ctx, 'MET ' + met + ' OF ' + STICKER_ORDER.length, W / 2, 18, { color: INK, align: 'center' });
    } else {
      outfitCells().forEach(function (c, i) {
        var o = OUTFITS[i], open = nb >= o.need, worn = save.outfit === o.id, cx = c.x + c.w / 2, f = c.big ? A.bonnie.b.idle : A.bonnie.s.idle;
        var feet = c.y + (c.big ? 52 : 28), ny = feet + 3;
        if (i === outfitAt && BB.inputMode !== 'touch') { ctx.fillStyle = 'rgba(236,190,120,0.35)'; ctx.fillRect(c.x + 2, c.y, c.w - 4, c.h - 4); }
        if (open) {
          if (o.cape) drawCape(ctx, cx - 1, feet - f.h + f.h * 0.36, f.h, 1, 0, sceneT);
          BB.draw(ctx, f, cx - f.w / 2, feet - f.h, false, o.v);
        } else drawSticker(ctx, f, false, cx, feet + 1, f.h + 2);
        BB.text(ctx, o.name, cx, ny, { color: worn ? PICK : open ? INK : UI.SOFT, align: 'center' });
        if (!open) { BB.draw(ctx, A.bearHead, cx - 10, ny + 10); BB.text(ctx, 'X' + o.need, cx + 1, ny + 10.5, { color: UI.SOFT }); }
        else if (worn) UI.cursor(ctx, cx - 4, ny + 10, tick);
      });
      BB.text(ctx, 'FIND BEAR TO WIN THEM', W / 2, 18, { color: INK, align: 'center' });
    }
    // turning the page: arrows at the edges, dots at the foot
    if (k > 0) BB.text(ctx, '←', 6, 76, { color: INK });
    if (k < BOOK.length - 1) BB.text(ctx, '→', W - 12, 76, { color: INK });
    for (var d = 0; d < BOOK.length; d++) BB.icons.disc(ctx, W / 2 - 6 + d * 6, H - 9, d === k ? 1.6 : 1.1, d === k ? INK : '#d8bc8c');
    // close
    BB.text(ctx, 'X', W - 11, 6, { color: INK });
  };

  /* ---- the card before a level ---- */
  var updateCard = function () {
    sceneT++;
    if (sceneT === 1) BB.music('');
    if (!wipe && (sceneT > (cardQuick ? 60 : 110) || (sceneT > 25 && (BB.hit('a') || BB.hit('start') || BB.tap)))) { cardQuick = false; wipeTo(function () { startLevel(save.at, cardCheck); go('play'); }); }
  };
  var drawCard = function (ctx) {
    var W = BB.W, def = BB.LEVELS[save.at - 1], gfx = theme(def.theme), n = save.at;
    BB.drawBackdrop(ctx, gfx.bg, reduce ? 0 : sceneT * 0.3, 0, H);
    ctx.fillStyle = 'rgba(40,20,60,0.25)'; ctx.fillRect(0, 0, W, H);
    // the level's number on a big ribbon, its name on a paper tag
    UI.ribbon(ctx, W / 2, 10, 'LEVEL ' + n, LEVEL_COL[n - 1], { scale: 2 });
    var nw = BB.textW(def.name) + 14;
    UI.paper(ctx, W / 2 - nw / 2, 33, nw, 14, { stitch: false });
    BB.text(ctx, def.name, W / 2, 36.5, { color: INK, align: 'center' });
    // Bonnie on a little bit of his next world's ground, saying what to watch for
    var gx = Math.round(W / 2 - 40);
    for (var x = 0; x < 32; x += 8) { BB.draw(ctx, gfx.top[(x >> 3) & 1], gx - 12 + x, 100); BB.draw(ctx, gfx.fill[(x >> 3) & 1], gx - 12 + x, 108); }
    var f = save.power ? A.bonnie.b.idle : A.bonnie.s.idle;
    var hop = reduce ? 0 : -Math.round(Math.abs(Math.sin(sceneT * 0.08)) * 2);
    if (save.bears[n]) { var bs = E.bear.sit[Math.floor(sceneT / 24) % 2]; BB.draw(ctx, bs, gx - 11, 100 - bs.h, true); }
    if (outfit().cape) drawCape(ctx, gx + 7, 100 - f.h + hop + f.h * 0.36, f.h, 1, 0, sceneT);
    BB.draw(ctx, f, gx + 8 - f.w / 2, 100 - f.h + hop, false, save.power === 2 ? A.bonnie.red : outfit().v);
    var hint = HINTS[n - 1];
    if (hint) {
      var hw = promptW(hint) + 10, hx = Math.min(W - hw - 4, gx + 22), hy = 66;
      UI.paper(ctx, hx, hy, hw, 15, { stitch: false });
      // the bubble's tail, pointing at Bonnie
      ctx.fillStyle = INK; for (var k = 0; k < 4; k += 0.5) ctx.fillRect(hx - k - 0.5, hy + 9 + k * 0.5, 1 + k * 0.4, 0.5);
      BB.prompt(ctx, hint, hx + 5, hy + 3, { color: INK, shadow: null });
    }
    var ctl = BB.inputMode === 'touch' ? [['g', 'move'], ['t', 'MOVE'], ['t', ' '], ['g', 'jump'], ['t', 'JUMP']] : CONTROLS;
    if (W >= promptW(ctl) + 16) {
      var cw = promptW(ctl) + 12;
      UI.paper(ctx, W / 2 - cw / 2, 120, cw, 16, { stitch: false });
      BB.prompt(ctx, ctl, W / 2, 123, { align: 'center', color: INK, shadow: null });
    }
  };
  var HINTS = [
    [['t', 'HOLD'], ['g', 'jump'], ['t', 'TO JUMP HIGHER']], [['t', 'BOUNCE ON THE TRAMPOLINES']], [['t', 'WATCH OUT FOR THE SEA']],
    [['t', 'TAP'], ['g', 'jump'], ['t', 'TO SWIM']], [['t', 'TURN AND FACE THE GHOSTS']], [['t', 'ROCKS DROP FROM THE ROOF']],
    [['t', 'THE ICE IS SLIPPERY']], [['t', 'CLIMB UP THE CLOUDS']], [['t', 'TWO STOMPS FOR A ROBOT']], [['t', 'SAVE MONSTY!']]
  ];

  /* ---- pause ---- */
  var PAUSE = ['CONTINUE', 'START AGAIN', 'BACK TO MAP', 'SOUND', 'GROWN-UPS'];
  var pauseBox = function () { var W = BB.W, bw = 118; return { x: Math.round(W / 2 - bw / 2), y: 20, w: bw, h: 74 }; };
  var updatePause = function () {
    if (BB.hit('up')) { pauseAt = (pauseAt + PAUSE.length - 1) % PAUSE.length; sfx('select'); }
    if (BB.hit('down')) { pauseAt = (pauseAt + 1) % PAUSE.length; sfx('select'); }
    if (BB.hit('select')) { BB.setMute(!BB.muted()); }
    var b = pauseBox(), tapped = listTap(PAUSE.length, b.x, b.y + 13, b.w);
    if (tapped >= 0) pauseAt = tapped;
    // a tap on the paper button again carries on
    if (BB.hud.pause && BB.tap && tapIn(BB.hud.pause.x, BB.hud.pause.y, BB.hud.pause.w, BB.hud.pause.h)) { go('play'); return; }
    if (BB.hit('a') || tapped >= 0 || (BB.hit('start') && pauseAt === 0)) {
      sfx('select');
      if (pauseAt === 0) go('play');
      else if (pauseAt === 1) { save.power = G.p.power; store(); cardCheck = false; bearWith = 0; wipeTo(function () { go('card'); }); }
      else if (pauseAt === 2) { save.power = G.p.power; store(); wipeTo(function () { go('map'); mapEnter(); }); }
      else if (pauseAt === 3) BB.setMute(!BB.muted());
      else openGrownups('pause');
    } else if (BB.hit('start')) go('play');
  };
  var drawPause = function (ctx) {
    drawWorld(ctx);
    UI.dim(ctx);
    var W = BB.W, b = pauseBox();
    UI.paper(ctx, b.x, b.y, b.w, b.h);
    UI.ribbon(ctx, W / 2, b.y - 6, 'PAUSED', '#8450d0');
    var items = PAUSE.slice(); items[3] = BB.muted() ? 'SOUND: OFF' : 'SOUND: ON';
    drawList(ctx, items, pauseAt, b.x, b.y + 13, b.w);
    var ctl = BB.inputMode === 'touch' ? [['g', 'move'], ['t', 'MOVE'], ['t', ' '], ['g', 'jump'], ['t', 'JUMP'], ['t', ' '], ['g', 'run'], ['t', 'RUN']] : CONTROLS;
    if (W >= promptW(ctl) + 16) {
      var cw = promptW(ctl) + 12;
      UI.paper(ctx, W / 2 - cw / 2, b.y + b.h + 6, cw, 16, { stitch: false });
      BB.prompt(ctx, ctl, W / 2, b.y + b.h + 9, { align: 'center', color: INK, shadow: null });
    }
    if (BB.inputMode === 'kbd') BB.text(ctx, 'F FOR FULL SCREEN', W / 2, b.y + b.h + 27, { color: '#ffffff', outline: HUDINK, align: 'center' });
  };

  /* ---- level clear, game over ---- */
  var updateClear = function () {
    sceneT++;
    if (sceneT === 24 && BB.voice) BB.voice.play('welldone');
    if (sceneT > 50 && (BB.hit('a') || BB.hit('start') || BB.tap || sceneT > 240)) wipeTo(function () { go('map'); mapEnter(G.n); });
  };
  var drawClear = function (ctx) {
    drawWorld(ctx);
    UI.dim(ctx);
    var W = BB.W, bw = 126, bx = Math.round(W / 2 - bw / 2), tot = levelTotal(G.n), got = Math.min(tot, (G && G.got) || 0);
    UI.paper(ctx, bx, 34, bw, 68);
    UI.ribbon(ctx, W / 2, 27, 'LEVEL CLEAR!', '#e8a820');
    // Bear: home with Bonnie, or still out there for next time
    iconLine(ctx, A.bearHead, G.bearHome ? null : A.bearDim, G.bearHome ? 'BEAR CAME HOME!' : 'BEAR IS HIDING...', 74, G.bearHome ? PICK : UI.SOFT);
    BB.text(ctx, 'WELL DONE BONNIE!', W / 2, 47, { color: INK, align: 'center' });
    iconLine(ctx, A.star[reduce ? 0 : Math.floor(sceneT / 6) % 4], null, got + ' OF ' + tot + ' STARS', 61, got >= tot ? PICK : INK, -2);
    if (sceneT > 50 && blink()) BB.prompt(ctx, BB.inputMode === 'touch' ? [['g', 'ok'], ['t', 'TAP']] : [['g', 'ok'], ['t', 'CONTINUE']], W / 2, 86, { align: 'center', color: INK, shadow: null });
  };
  var updateOver = function () {
    sceneT++;
    if (sceneT > 90 && (BB.hit('a') || BB.hit('start'))) {
      save.lives = 3; save.power = 0; save.score = 0; store();
      sfx('start'); go('map'); mapEnter();
    }
  };
  var drawOver = function (ctx) {
    var W = BB.W;
    ctx.fillStyle = '#0c0814'; ctx.fillRect(0, 0, W, H);
    BB.text(ctx, 'GAME OVER', W / 2, 44, { color: '#f24848', align: 'center', scale: 2 });
    BB.draw(ctx, A.bonnie.s.dead, Math.round(W / 2 - 11), 66);
    if (sceneT > 90 && blink()) BB.text(ctx, 'PRESS A TO TRY AGAIN', W / 2, 104, { color: '#ffffff', align: 'center' });
    BB.text(ctx, 'YOUR LEVELS ARE SAVED', W / 2, 120, { color: '#9098b0', align: 'center' });
  };

  /* ---- the ending ---- */
  var CREDITS = [
    ['HOORAY!', bright], ['MONSTY IS SAFE!', '#ffffff'], ['', ''], ['THANK YOU, BONNIE!', '#ff94cc'], ['', ''], ['', ''],
    ['BONNIE BOUNCE', bright], ['', ''], ['STARRING', '#9098b0'], ['BONNIE', '#ffffff'], ['', ''], ['AND MONSTY', '#ab86f3'], ['AND BEAR THE CAT', '#c9c7da'], ['', ''],
    ['GRUMBLE THE DRAGON', '#7ee058'], ['WILL BE NICER NOW', '#9098b0'], ['', ''], ['', ''], ['MADE WITH LOVE', '#ffffff'], ['FOR BONNIE', '#ff94cc'], ['', ''], ['', ''], ['THE END', bright]
  ];
  var endFx = [], endBg = null;
  /* The ending opens on the reunion before any words: Monsty bounds in
     from one side, Bonnie runs in from the other, they meet in a burst of
     hearts — and Bear, if he's come home from anywhere, trots in to join
     them. Then the credits roll up over the three of them. */
  var REUNION = 200;
  var bearsHome = function () { var n = 0; for (var k in save.bears) if (save.bears[k]) n++; return n; };
  var updateEnding2 = function () {
    sceneT++;
    if (!reduce && sceneT % 45 === 1) {
      var cols = ['#ffe048', '#ff94cc', '#78d8ff', '#7ee058', '#ffffff', '#fa9c38'], c = cols[Math.floor(Math.random() * 6)];
      var x = 20 + Math.random() * (BB.W - 40), y = 20 + Math.random() * 50;
      for (var i = 0; i < 18; i++) { var a = i / 18 * Math.PI * 2; endFx.push({ x: x, y: y, vx: Math.cos(a) * 1.4, vy: Math.sin(a) * 1.4, t: 0, c: c }); }
      sfx('boom');
    }
    endFx.forEach(function (f) { f.t++; f.x += f.vx; f.y += f.vy; f.vy += 0.03; f.vx *= 0.98; });
    endFx = endFx.filter(function (f) { return f.t < 50; });
    var end = CREDITS.length * 11 + H + 20 + REUNION;
    if (sceneT > 120 && (BB.hit('start') || ((sceneT * 0.3 > end || BB.tap) && (BB.hit('a') || BB.tap)))) wipeTo(function () { go('title'); BB.music('title'); });
  };
  var drawEnding = function (ctx) {
    var W = BB.W, t = reduce ? REUNION + 60 : sceneT;
    // the woods' night sky, moon and all: the right sky for fireworks
    if (!endBg) endBg = BB.backdrop('woods', A.themes.woods);
    BB.drawBackdrop(ctx, endBg, reduce ? 0 : sceneT * 0.15, 0, H);
    endFx.forEach(function (f) { if (f.t < 36 || f.t % 2) { ctx.fillStyle = f.c; ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2); } });
    var g = theme('hills');
    for (var x = 0; x < W; x += 8) { BB.draw(ctx, g.top[(x >> 3) & 1], x, 128); BB.draw(ctx, g.fill[(x >> 3) & 1], x, 136); }
    var mid = Math.round(W / 2), S = A.bonnie.s, meet = 80;
    // running together…
    var k = Math.min(1, t / meet), ease = 1 - (1 - k) * (1 - k);
    var bx = Math.round(-20 + (mid - 14 + 20) * ease), mx = Math.round(W + 10 - (W + 10 - (mid + 2)) * ease);
    var hop = t > meet && !reduce ? -Math.round(Math.abs(Math.sin(t * 0.08)) * 6) : 0;
    var bf = t < meet ? S[RUN_CYCLE[Math.floor(t / 5) % 4]] : S.cheer;
    BB.draw(ctx, bf, bx, 128 - bf.h + hop);
    BB.draw(ctx, A.monsty, mx, 128 - A.monsty.h + (t < meet ? -Math.round(Math.abs(Math.sin(t * 0.25)) * 4) : (reduce ? 0 : -Math.round(Math.abs(Math.sin(t * 0.08 + 1)) * 5))), true);
    // …a burst of hearts when they meet…
    if (t > meet && t < meet + 60 && !reduce) for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2, r = (t - meet) * 0.5; ctx.globalAlpha = 1 - (t - meet) / 60; BB.draw(ctx, A.heartSmall, mid + Math.cos(a) * r - 2, 108 + Math.sin(a) * r * 0.6 - (t - meet) * 0.2); ctx.globalAlpha = 1; }
    // …and Bear, if he's come home, trots in to sit with them
    var nb = bearsHome();
    if (nb && t > meet + 30) {
      var kb = Math.min(1, (t - meet - 30) / 60), bearX = Math.round(-16 + (mid - 34 + 16) * kb);
      var bfr = kb < 1 ? E.bear.walk[Math.floor(t / 5) % 2] : (t % 160 > 150 ? E.bear.happy : E.bear.sit[Math.floor(t / 24) % 2]);
      BB.draw(ctx, bfr, bearX, 128 - bfr.h, true);
    }
    // the words roll up, once they've had their moment
    if (t < REUNION) {
      if (t > meet + 20) BB.text(ctx, 'MONSTY!', mid, 70, { color: '#ffe048', outline: dark, align: 'center', scale: 2 });
      return;
    }
    var y0 = reduce ? 10 : H - (sceneT - REUNION) * 0.3;
    var lines = CREDITS.slice();
    // just after Bear's name: how many lands he came home from (short enough for 160px)
    lines.splice(13, 0, [nb === 10 ? 'FOUND IN EVERY LAND!' : 'FOUND IN ' + nb + ' OF 10 LANDS', '#9098b0']);
    lines.forEach(function (c, i) {
      var y = Math.round(y0 + i * 11);
      if (reduce) y = 8 + (i % 9) * 11;
      if (reduce && Math.floor(i / 9) !== Math.floor(sceneT / 240) % Math.ceil(lines.length / 9)) return;
      if (y > -8 && y < 96 && c[0]) BB.text(ctx, c[0], W / 2, y, { color: c[1], outline: dark, align: 'center' });
    });
  };

  /* ==========================================================================
     THE LOOP
     ========================================================================== */
  /* ---- the circle wipe ----------------------------------------------------------------
     Screens never cut: a circle closes (on the medallion you chose, or
     on Bonnie), the screen changes behind it, and it opens again. With
     reduced motion it is a quick fade instead. */
  var wipe = null, WIPE = 22;
  var wipeTo = function (fn, x, y) {
    if (wipe) return;
    wipe = { t: 0, dir: 'out', fn: fn, x: x === undefined ? BB.W / 2 : x, y: y === undefined ? H / 2 : y };
  };
  var drawWipe = function (ctx) {
    if (!wipe) return;
    var W = BB.W, k = Math.min(1, wipe.t / WIPE), e = k * k * (3 - 2 * k), open = wipe.dir === 'out' ? 1 - e : e;
    if (reduce) { ctx.fillStyle = 'rgba(12,8,20,' + (1 - open).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); return; }
    var maxR = Math.hypot(Math.max(wipe.x, W - wipe.x), Math.max(wipe.y, H - wipe.y)) + 4, r = Math.max(0, maxR * open);
    ctx.fillStyle = '#0c0814';
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(wipe.x, wipe.y, r, 0, Math.PI * 2, true); ctx.fill('evenodd');
    if (r > 1) { ctx.strokeStyle = 'rgba(255,228,138,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wipe.x, wipe.y, r, 0, Math.PI * 2); ctx.stroke(); }
  };
  var update = function () {
    tick++;
    if (BB.needRotate && BB.needRotate()) return;
    if (wipe) {
      wipe.t++;
      if (wipe.dir === 'out') {
        if (wipe.t >= WIPE) { var fn = wipe.fn; wipe = { t: 0, dir: 'in', x: BB.W / 2, y: H / 2 }; fn(); }
        return;
      }
      if (wipe.t >= WIPE) wipe = null;
    }
    switch (scene) {
      case 'title': updateTitle(); break;
      case 'menu': bounceTitle(); updateMenu(); break;
      case 'story': updateStory(); break;
      case 'map': updateMap(); break;
      case 'card': updateCard(); break;
      case 'play': updatePlay(); break;
      case 'pause': updatePause(); break;
      case 'clear': updateClear(); break;
      case 'over': updateOver(); break;
      case 'ending': updateEnding2(); break;
      case 'book': updateBook(); break;
      case 'grownups': updateGrownups(); break;
    }
  };
  var render = function (ctx) {
    ctx.imageSmoothingEnabled = false;
    if (BB.needRotate && BB.needRotate()) { BB.drawRotate(ctx); return; }
    switch (scene) {
      case 'title': drawTitle(ctx); break;
      case 'menu': drawMenu(ctx); break;
      case 'story': drawStory(ctx); break;
      case 'map': drawMap(ctx); break;
      case 'card': drawCard(ctx); break;
      case 'play': drawWorld(ctx); break;
      case 'pause': drawPause(ctx); break;
      case 'clear': drawClear(ctx); break;
      case 'over': drawOver(ctx); break;
      case 'ending': drawEnding(ctx); break;
      case 'book': drawBook(ctx); break;
      case 'grownups': drawGrownups(ctx); break;
    }
    if (BB.drawTouch) BB.drawTouch(ctx);
    drawWipe(ctx);
  };

  // the title's tune starts with the first key or tap (browsers insist)
  BB.music('title');
  // ?level=N goes straight into a level (for testing)
  var lv = /[?&]level=(\d+)/.exec(qs);
  if (lv) { save.at = Math.max(1, Math.min(10, +lv[1])); save.unlocked = Math.max(save.unlocked, save.at); go('card'); }
  BB.game = { save: function () { return save; }, G: function () { return G; }, scene: function () { return scene; }, go: go, startLevel: startLevel, theme: function (n) { return theme(n); } };
  /* For tools/overview.html: the whole of level n drawn flat, in strips
     `seg` pixels wide, every enemy and item shown where it starts. */
  BB.game.overview = function (n, seg) {
    seg = seg || 400;
    startLevel(n);
    BB.music('');
    var W0 = BB.W, lw = G.w * T, lh = G.h * T, rows = Math.ceil(lw / seg);
    var out = BB.surface(seg, rows * (lh + 6));
    var o = out.getContext('2d'), buf = BB.surface(seg, H);
    var b = buf.getContext('2d');
    BB.W = seg;
    G.ents.forEach(function (e) { e.active = true; });
    G.p.st = 'in';
    for (var i = 0; i < rows; i++) {
      for (var y = 0; y < lh; y += H) {
        G.cam.x = i * seg; G.cam.y = Math.min(y, lh - H);
        drawWorld(b, false);
        BB.blit(o, buf, 0, i * (lh + 6) + G.cam.y);
      }
      o.fillStyle = '#fff';
      for (var tx = 0; tx < seg; tx += 80) BB.text(o, String((i * seg + tx) / T), tx + 1, i * (lh + 6) + lh - 8, { color: '#ffffff', outline: '#000' });
    }
    BB.W = W0;
    return out;
  };
  BB.start(update, render);
})();
