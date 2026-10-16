/* ==========================================================================
   levels.js — the ten worlds, built from a small set of commands.

   A level is a grid of 8x8 tiles, 18 rows tall unless it says otherwise
   (Cloud Kingdom climbs, so it is 36). Each world's build() lays out its
   ground, blocks, enemies and set pieces with the builder below; the
   scenery (bushes, palms, pines…) is scattered afterwards from the theme.

   The numbers the levels are built on (game.js has the physics):
     ground top      row 16 (y 128), two rows of ground under it
     low blocks      row 11 — 32px over the ground, so big Bonnie walks
                     under them with his hair clear, and a jump lands on them
     high blocks     row 6  — the same 32px over the low row
     a walking jump  ~6 tiles high, ~7 tiles across; running ~10 across
   Gaps stay at 4 or under early on (he is five), and widen slowly.
   ========================================================================== */
(function () {
  'use strict';
  var T = 8;
  var TL = BB.TILES = {
    EMPTY: 0, GROUND: 1, BRICK: 2, Q: 3, USED: 4, HARD: 5, PIPE: 6, PIPER: 7, PIPETOP: 8, PIPETOPR: 9,
    SEMI: 10, COIN: 11, SPIKE: 12, LAVA: 13, CONVL: 14, CONVR: 15, HIDDEN: 16, CRATE: 17, WALL: 18
  };
  // what is in a "?" block, a brick or a hidden block
  var C = BB.CONTENTS = { COIN: 1, POWER: 2, STAR: 3, LIFE: 4, MULTI: 5 };

  var GR = 16, R1 = 11, R2 = 6;

  var Builder = function (def) {
    var h = def.h || 18;
    this.w = def.w; this.h = h;
    this.gr = def.gr || GR;
    this.map = new Uint8Array(def.w * h);
    this.cont = new Uint8Array(def.w * h);
    this.ents = [];
    this.deco = [];
    this.noDeco = [];
    this.start = { x: 3, row: this.gr };
  };
  var B = Builder.prototype;
  B.set = function (x, y, t, c) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    this.map[y * this.w + x] = t;
    this.cont[y * this.w + x] = c || 0;
  };
  B.get = function (x, y) { return x < 0 || x >= this.w || y < 0 || y >= this.h ? 0 : this.map[y * this.w + x]; };
  // solid ground from row `top` to the bottom, columns x0..x1-1
  B.ground = function (x0, x1, top) {
    top = top === undefined ? this.gr : top;
    for (var x = x0; x < x1; x++) for (var y = top; y < this.h; y++) this.set(x, y, TL.GROUND);
  };
  B.box = function (x0, y0, x1, y1, t) {
    for (var x = x0; x < x1; x++) for (var y = y0; y < y1; y++) this.set(x, y, t || TL.GROUND);
  };
  B.clear = function (x0, y0, x1, y1) { this.box(x0, y0, x1, y1, TL.EMPTY); };
  B.ceiling = function (x0, x1, rows) { this.box(x0, 0, x1, rows, TL.GROUND); };
  /* A row of things, one character per tile:
       B brick   ? star block   P power-up block   S rainbow-lolly block
       L heart block   M brick of many stars   k hidden star   h hidden heart
       U used block   X hard block   C star   = one-way platform   # ground
       ^ spikes   c crate   space: nothing */
  B.row = function (x, y, s) {
    for (var i = 0; i < s.length; i++) {
      var ch = s[i], tx = x + i;
      switch (ch) {
        case 'B': this.set(tx, y, TL.BRICK); break;
        case '?': this.set(tx, y, TL.Q, C.COIN); break;
        case 'P': this.set(tx, y, TL.Q, C.POWER); break;
        case 'S': this.set(tx, y, TL.Q, C.STAR); break;
        case 'L': this.set(tx, y, TL.Q, C.LIFE); break;
        case 'M': this.set(tx, y, TL.BRICK, C.MULTI); break;
        case 'k': this.set(tx, y, TL.HIDDEN, C.COIN); break;
        case 'h': this.set(tx, y, TL.HIDDEN, C.LIFE); break;
        case 'U': this.set(tx, y, TL.USED); break;
        case 'X': this.set(tx, y, TL.HARD); break;
        case 'C': this.set(tx, y, TL.COIN); break;
        case '=': this.set(tx, y, TL.SEMI); break;
        case '#': this.set(tx, y, TL.GROUND); break;
        case '^': this.set(tx, y, TL.SPIKE); break;
        case 'c': this.set(tx, y, TL.CRATE); break;
      }
    }
  };
  B.coins = function (x, y, n) { for (var i = 0; i < n; i++) this.set(x + i, y, TL.COIN); };
  // an arc of stars over a gap: the line a jump should take
  B.arc = function (x, y, n) {
    for (var i = 0; i < n; i++) {
      var t = n > 1 ? i / (n - 1) : 0.5;
      this.set(x + i, y - Math.round(Math.sin(t * Math.PI) * Math.min(3, n / 2)), TL.COIN);
    }
  };
  B.semi = function (x0, x1, y) { for (var x = x0; x < x1; x++) this.set(x, y, TL.SEMI); };
  B.spikes = function (x0, x1, y) { for (var x = x0; x < x1; x++) this.set(x, y === undefined ? this.gr - 1 : y, TL.SPIKE); };
  B.lava = function (x0, x1, y) { for (var x = x0; x < x1; x++) for (var yy = y === undefined ? this.gr + 1 : y; yy < this.h; yy++) this.set(x, yy, TL.LAVA); };
  B.conveyor = function (x0, x1, dir, y) { for (var x = x0; x < x1; x++) this.set(x, y === undefined ? this.gr : y, dir < 0 ? TL.CONVL : TL.CONVR); };
  // a pipe, h tiles tall, standing on the ground (or on row `base`)
  B.pipe = function (x, h, plant, base) {
    base = base === undefined ? this.gr : base;
    for (var k = 1; k <= h; k++) {
      var y = base - k;
      this.set(x, y, k === h ? TL.PIPETOP : TL.PIPE);
      this.set(x + 1, y, k === h ? TL.PIPETOPR : TL.PIPER);
    }
    if (plant) this.e('plant', x, base - h);
    this.noDeco.push([x - 1, x + 3]);
  };
  // stairs of hard blocks: n steps up from the ground (or down, with dir -1)
  B.stairs = function (x, n, dir, base) {
    base = base === undefined ? this.gr : base;
    for (var k = 0; k < n; k++) {
      var hgt = dir < 0 ? n - k : k + 1;
      for (var j = 1; j <= hgt; j++) this.set(x + k, base - j, TL.HARD);
    }
    this.noDeco.push([x - 1, x + n + 1]);
  };
  B.column = function (x, hgt, base) {
    base = base === undefined ? this.gr : base;
    for (var j = 1; j <= hgt; j++) this.set(x, base - j, TL.HARD);
  };
  // an enemy or a set piece: x in tiles; row is the tile row it stands on
  // (walkers) or its middle (fliers); opts as each kind reads them
  B.e = function (k, x, row, opts) {
    var o = { k: k, x: x * T, row: row === undefined ? this.gr : row };
    if (opts) for (var key in opts) o[key] = opts[key];
    this.ents.push(o);
    return o;
  };
  B.spring = function (x, row) { this.e('spring', x, row); this.noDeco.push([x - 1, x + 3]); };
  B.check = function (x, row) { this.e('check', x, row); this.noDeco.push([x - 1, x + 2]); };
  // moving platforms: w tiles wide; dx/dy the travel in tiles; fall: drops
  // a moment after you land on it
  B.plat = function (x, row, w, o) { return this.e('plat', x, row, Object.assign({ w: w }, o || {})); };
  B.goal = function (x, row) {
    row = row === undefined ? this.gr : row;
    this.e('goal', x, row);
    this.e('house', x + 5, row);
    this.noDeco.push([x - 3, x + 12]);
  };
  /* A signpost that teaches by doing: when Bonnie walks up to it, a
     bubble pops up showing the real control for the player's device (the
     Space bar, or the A button) next to a word or two. */
  B.tip = function (x, kind, row) { this.e('tip', x, row, { tip: kind }); this.noDeco.push([x - 1, x + 3]); };
  /* Bear, the family cat: one in every level, somewhere off the main way —
     up on a bonus route or a ledge you have to look for. Touch him and he
     follows Bonnie home. row is the tile row he sits on. Every spot is
     at most 32px (four tiles) above somewhere to jump from: a held jump
     reaches about 42, so it's a hunt, not a test of skill. */
  B.bear = function (x, row) { this.e('bear', x, row); this.noDeco.push([x - 1, x + 3]); };
  B.deco1 = function (name, x, row) { this.deco.push({ name: name, x: x * T, row: row === undefined ? this.gr : row }); this.noDeco.push([x - 2, x + 4]); };

  /* Scenery: from the theme's list, on open ground, never over a pipe, a
     stair or a set piece, and never under something it would poke into. */
  B.scatter = function (theme, seed) {
    // only scenery that has actually been drawn (a world can list one before it's painted)
    var A = BB.ART, rnd = BB.rng(seed), list = theme.deco.filter(function (n) { return A.deco[n]; });
    if (!list.length) return;
    var x = 4;
    while (x < this.w - 6) {
      var name = list[Math.floor(rnd() * list.length)];
      var s = A.deco[name];
      if (Array.isArray(s)) s = s[0];
      var wT = Math.ceil(s.w / T), hT = Math.ceil(s.h / T);
      var ok = true, top = -1;
      for (var y = 2; y < this.h; y++) { if (this.get(x, y) === TL.GROUND) { top = y; break; } if (this.get(x, y)) { ok = false; break; } }
      if (top < 0) ok = false;
      for (var i = 0; ok && i < wT; i++) {
        if (this.get(x + i, top) !== TL.GROUND || this.get(x + i, top - 1) !== TL.EMPTY) ok = false;
        for (var j = 1; ok && j <= hT + 1; j++) if (this.get(x + i, top - j) !== TL.EMPTY && this.get(x + i, top - j) !== TL.COIN) ok = false;
      }
      if (ok && this.noDeco.some(function (r) { return x + wT > r[0] && x < r[1]; })) ok = false;
      if (ok && this.ents.some(function (e) { return (e.k === 'goal' || e.k === 'house') && Math.abs(e.x / T - x) < 8; })) ok = false;
      if (ok) {
        this.deco.push({ name: name, x: x * T + Math.floor(rnd() * 4), row: top });
        x += wT + 2 + Math.floor(rnd() * 7);
      } else x += 2;
    }
  };

  /* ==========================================================================
     THE TEN WORLDS
     ========================================================================== */
  var LEVELS = BB.LEVELS = [];
  var add = function (def) { def.n = LEVELS.length + 1; LEVELS.push(def); };

  /* 1 — Sunny Hills. The first level: everything gets introduced on its
     own, on flat ground, before it is combined with anything else. Only
     three signposts (walk, jump, stomp): the rest is better found by
     playing than by reading. */
  add({
    name: 'SUNNY HILLS', theme: 'hills', w: 200, seed: 11,
    build: function (L) {
      L.ground(0, 56);
      L.tip(5, 'move');
      L.tip(8, 'jump');
      L.row(10, R1, '?');
      L.row(16, R1, 'BPB?B');
      L.row(18, R2, '?');
      L.tip(21, 'stomp');
      // the first bug waits for Bonnie, rather than walking into the signs
      L.e('grumbug', 24, undefined, { wait: 80 });
      L.pipe(28, 2);
      L.e('grumbug', 34);
      L.pipe(38, 3);
      L.e('grumbug', 42); L.e('grumbug', 44);
      L.pipe(48, 4);
      // the first time, Bear is easy to spot: up on the tallest stump
      L.bear(48, 12);
      L.row(52, R1, 'h');
      L.arc(56, 12, 3);
      L.ground(59, 88);
      L.row(62, R1, 'B?B');
      L.row(65, R2, 'BBBBBBBB');
      L.coins(65, R2 - 1, 8);
      L.e('snail', 70);
      L.e('grumbug', 75); L.e('grumbug', 77);
      L.row(80, R1, 'BMB');
      L.stairs(84, 4);
      L.ground(90, 140);
      L.stairs(90, 4, -1);
      L.check(98);
      L.row(102, R1, 'B?B');
      L.row(108, R1, 'S');
      L.e('grumbug', 112); L.e('grumbug', 114); L.e('grumbug', 116);
      L.pipe(120, 3);
      L.e('snail', 125);
      L.row(128, R1, 'BB?BB');
      L.row(130, R2, 'P');
      L.e('grumbug', 134);
      L.semi(141, 146, 13);
      L.coins(141, 12, 5);
      L.ground(146, 200);
      L.coins(150, 12, 5);
      L.e('grumbug', 156); L.e('snail', 161);
      L.row(158, R1, 'B?B?B');
      L.stairs(167, 8); L.column(175, 8);
      L.goal(182);
    }
  });

  /* 2 — Playground Park. Trampolines: bounce on one for a big jump (hold
     A for a bigger one). Climbing frames to scramble up, bees on the way. */
  add({
    name: 'PLAYGROUND PARK', theme: 'park', w: 206, seed: 22,
    build: function (L) {
      L.ground(0, 40);
      L.deco1('swing', 5); L.deco1('slide', 33);
      L.row(10, R1, 'B?B');
      L.tip(15, 'spring');
      L.spring(18);
      L.coins(18, 3, 3); L.coins(17, 4, 1); L.coins(21, 4, 1);
      L.e('bee', 25, 11);
      L.semi(27, 32, 13); L.semi(27, 32, 10); L.semi(27, 32, 7);
      L.coins(27, 6, 5);
      L.e('grumbug', 36);
      L.spring(37);
      L.arc(40, 10, 6);
      L.ground(46, 90);
      L.pipe(52, 3, true);
      L.row(57, R1, 'BPB');
      L.e('bee', 60, 12); L.e('bee', 64, 9);
      L.e('snail', 67);
      L.semi(70, 74, 13); L.semi(74, 78, 10); L.semi(78, 82, 7);
      L.coins(70, 12, 4); L.coins(74, 9, 4); L.coins(78, 6, 4);
      L.bear(81, 7);
      L.row(84, 3, 'L');
      L.deco1('bench', 85);
      L.plat(90, 13, 4, { dx: 3, speed: 0.45 });
      L.ground(97, 132);
      L.check(100);
      L.row(104, R1, 'S');
      L.spring(108);
      L.coins(107, 2, 4);
      L.e('grumbug', 113); L.e('grumbug', 115); L.e('grumbug', 117); L.e('grumbug', 119);
      L.pipe(124, 2);
      L.deco1('swing', 127);
      L.plat(133, 15, 2, { dy: -5, speed: 0.5 });
      L.plat(137, 10, 2, { dy: 5, speed: 0.5 });
      L.ground(141, 206);
      L.e('bee', 145, 12); L.e('snail', 149);
      L.row(152, R1, 'BMB'); L.row(153, R2, '?');
      L.semi(158, 163, 13); L.semi(158, 163, 10); L.semi(158, 163, 7);
      L.coins(158, 6, 5);
      L.e('grumbug', 166); L.e('grumbug', 169);
      L.spring(172);
      L.coins(171, 3, 4);
      L.stairs(177, 6); L.column(183, 6);
      L.goal(189);
    }
  });

  /* 3 — Sandy Shore. The sea fills the gaps: piers to walk across, rafts
     that sink when you stand on them, crabs on the sand and gulls above. */
  add({
    name: 'SANDY SHORE', theme: 'beach', w: 222, seed: 33,
    build: function (L) {
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('crab', 17);
      L.semi(30, 38, 16);
      L.e('gull', 34, 9);
      L.coins(31, 13, 6);
      L.ground(38, 60);
      L.e('crab', 44); L.e('snail', 50);
      L.pipe(54, 3);
      // up from the sandcastle tower to a ledge over the beach
      L.semi(56, 60, 9);
      L.bear(57, 9);
      L.plat(61, 14, 3, { fall: true });
      L.plat(65, 13, 3, { fall: true });
      L.ground(69, 95);
      L.row(72, R1, 'BB?BB'); L.row(74, R2, 'M');
      L.e('crab', 79); L.e('crab', 83);
      L.e('gull', 88, 10);
      L.plat(96, 13, 4, { dx: 7, speed: 0.5 });
      L.arc(97, 10, 10);
      L.ground(110, 140);
      L.check(113);
      L.row(118, R1, '?'); L.row(121, R1, 'h');
      L.e('snail', 124); L.e('crab', 128); L.e('crab', 131);
      L.deco1('castle', 134);
      L.semi(140, 150, 16);
      L.e('gull', 143, 9); L.e('gull', 148, 11);
      L.ground(150, 170);
      L.row(154, R1, 'S');
      L.stairs(158, 3);
      L.ground(161, 170, 13);
      L.e('crab', 166, 13);
      L.plat(171, 13, 3, { fall: true });
      L.plat(175, 12, 3, { fall: true });
      L.ground(179, 222);
      L.e('crab', 185); L.e('gull', 189, 10);
      L.row(187, R1, 'B?B');
      L.stairs(194, 7);
      L.goal(205);
    }
  });

  /* 4 — Coral Reef. Under the sea: tap A to swim up, let go to sink.
     Fish swim in waves and jellyfish drift — neither can be stomped down
     here, so swim round them (or throw a ball). */
  add({
    name: 'CORAL REEF', theme: 'reef', w: 200, seed: 44, water: true,
    build: function (L) {
      L.ground(0, 60);
      L.tip(5, 'swim', 16);
      L.row(10, R1, '?P?');
      L.box(20, 13, 27, 16);
      L.coins(20, 11, 7);
      L.e('fish', 30, 9);
      L.ceiling(30, 42, 4);
      L.coins(31, 6, 10);
      L.e('fish', 40, 12);
      L.box(44, 9, 46, 16);
      L.bear(44, 9);
      L.e('jelly', 50, 8);
      L.semi(52, 57, 10);
      L.row(53, 5, 'BMB');
      L.ground(64, 120);
      L.coins(60, 11, 4);
      L.e('fish', 70, 6); L.e('fish', 76, 12);
      L.box(80, 12, 90, 16);
      L.ceiling(82, 92, 6);
      L.coins(83, 9, 7);
      L.e('jelly', 94, 10);
      L.check(98);
      L.row(102, R1, 'BSB');
      L.e('fish', 108, 8); L.e('fish', 112, 13);
      L.e('jelly', 116, 6);
      L.ground(125, 150);
      L.semi(119, 126, 11);
      L.box(130, 10, 133, 16); L.box(136, 2, 139, 9); L.box(142, 11, 145, 16);
      L.coins(133, 10, 3); L.coins(139, 12, 3);
      L.e('fish', 147, 7);
      L.ground(154, 200);
      L.e('jelly', 152, 9);
      L.row(158, R1, 'L');
      L.e('fish', 164, 11); L.e('jelly', 170, 7); L.e('fish', 176, 13);
      L.pipe(166, 2);
      L.stairs(180, 5);
      L.goal(190);
    }
  });

  /* 5 — Spooky Woods. Night. Ghosts creep up when your back is turned
     (turn round and they freeze), bats drop from the dark, hedgehogs are
     too spiky to stomp, and the big mushrooms bounce. */
  add({
    name: 'SPOOKY WOODS', theme: 'woods', w: 210, seed: 55,
    build: function (L) {
      L.ground(0, 34);
      L.row(10, R1, 'BPB');
      L.e('hog', 18);
      L.spring(24);
      L.coins(23, 3, 4);
      L.e('ghost', 31, 10);
      L.ground(38, 70);
      L.semi(42, 47, 12); L.semi(48, 53, 9);
      L.coins(48, 8, 5);
      L.e('bat', 51, 3);
      L.e('grumbug', 57); L.e('hog', 63);
      L.semi(72, 76, 13);
      L.ground(79, 110);
      L.check(84);
      L.e('ghost', 90, 9);
      L.row(93, R1, '?S?');
      L.e('bat', 97, 3);
      L.e('grumbug', 101); L.e('grumbug', 103);
      L.spring(106);
      L.semi(110, 128, 7);
      L.coins(111, 6, 16);
      L.bear(126, 7);
      L.semi(113, 116, 13);
      L.e('bat', 121, 3);
      L.ground(118, 160);
      L.e('hog', 124); L.e('ghost', 130, 11);
      L.e('bat', 136, 3);
      L.pipe(140, 3, true);
      L.row(146, R1, 'BMB');
      L.ground(164, 210);
      L.e('grumbug', 167); L.e('hog', 171); L.e('ghost', 174, 9);
      L.row(170, R1, 'L');
      L.stairs(178, 6); L.column(184, 6);
      L.goal(190);
    }
  });

  /* 6 — Crystal Caves. A roof overhead. Grumpy rocks wake and drop when
     you pass beneath, bats hang from the ceiling, and the pits are lined
     with spikes — the girders and lifts carry you over. */
  add({
    name: 'CRYSTAL CAVES', theme: 'cave', w: 212, seed: 66,
    build: function (L) {
      L.ceiling(0, 212, 2);
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('rock', 18, 2);
      L.e('bat', 24, 2);
      L.plat(31, 13, 4, { dx: 2, speed: 0.45 });
      L.ground(37, 70);
      L.e('snail', 41); L.e('hog', 47);
      L.e('rock', 53, 2);
      L.e('bat', 58, 2);
      L.box(61, 2, 70, 8);
      L.coins(62, 13, 7);
      L.ground(70, 80, 17);
      L.spikes(70, 80, 16);
      L.semi(72, 75, 12); L.semi(77, 79, 11);
      L.ground(80, 112);
      L.check(84);
      L.e('rock', 90, 2); L.e('rock', 95, 2);
      L.row(99, R1, 'BSB');
      L.e('bat', 105, 2);
      L.plat(113, 15, 2, { dy: -5, speed: 0.45 });
      L.plat(117, 10, 2, { dy: 5, speed: 0.45 });
      L.semi(120, 124, 6);
      L.bear(121, 6);
      L.ground(121, 160);
      L.e('hog', 126); L.e('snail', 130);
      L.box(134, 13, 140, 16); L.box(140, 10, 144, 16);
      L.coins(140, 9, 4);
      L.e('rock', 149, 2);
      L.row(152, R1, 'BMB');
      L.plat(161, 13, 2, { fall: true });
      L.plat(164, 12, 2, { fall: true });
      L.ground(167, 212);
      L.e('bat', 172, 2); L.e('grumbug', 176); L.e('grumbug', 178);
      L.row(180, R1, 'L');
      L.stairs(184, 6);
      L.goal(196);
    }
  });

  /* 7 — Frosty Peaks. The ice is slippery: Bonnie slides when he stops.
     Penguins belly-slide at you, snowmen throw snowballs, and in the ice
     tunnel the icicles drop. */
  add({
    name: 'FROSTY PEAKS', theme: 'snow', w: 222, seed: 77, ice: true,
    build: function (L) {
      L.ground(0, 40);
      L.tip(6, 'ice');
      L.row(10, R1, '?P?');
      L.e('snowman', 22);
      L.e('penguin', 30);
      L.box(34, 13, 40, 16);
      L.ground(44, 80);
      L.coins(41, 10, 3);
      L.e('penguin', 52); L.e('penguin', 57);
      L.box(64, 13, 72, 16);
      L.e('snowman', 68, 13);
      L.semi(58, 62, 9);
      L.bear(59, 9);
      L.coins(64, 11, 3);
      L.ceiling(80, 108, 5);
      L.ground(80, 108);
      L.check(83);
      L.e('icicle', 88, 5); L.e('icicle', 93, 5); L.e('icicle', 98, 5);
      L.row(101, R1, 'BMB');
      L.semi(109, 111, 13); L.semi(112, 114, 12);
      L.ground(115, 160);
      L.e('snowman', 121); L.e('penguin', 128); L.e('penguin', 132);
      L.row(124, R1, '?S?');
      L.box(140, 12, 150, 16);
      L.coins(141, 10, 8);
      L.e('snowman', 146, 12);
      L.plat(161, 13, 4, { dx: 3, speed: 0.45 });
      L.ground(168, 222);
      L.e('penguin', 175); L.e('snowman', 183);
      L.row(178, R1, 'L');
      L.stairs(189, 7);
      L.goal(203);
    }
  });

  /* 8 — Cloud Kingdom. Up into the sky: a climb from the bottom of the
     clouds to the top, then across, with nothing below but sky. */
  add({
    name: 'CLOUD KINGDOM', theme: 'sky', w: 186, h: 36, gr: 34, seed: 88,
    build: function (L) {
      var g = 34;
      L.start = { x: 3, row: g };
      L.ground(0, 26, g);
      L.row(8, g - 5, '?P?');
      L.spring(17, g);
      L.coins(17, g - 12, 2);
      L.semi(20, 25, 30); L.semi(12, 17, 26); L.semi(20, 25, 22); L.semi(12, 17, 18); L.semi(19, 24, 14);
      L.coins(20, 29, 5); L.coins(12, 25, 5); L.coins(20, 21, 5); L.coins(12, 17, 5);
      L.e('bee', 18, 24);
      L.semi(5, 9, 15);
      L.bear(6, 15);
      L.box(26, 14, 44, 16);
      L.coins(30, 12, 5);
      L.e('grumbug', 38, 14);
      L.plat(45, 13, 4, { dx: 2, speed: 0.45 });
      L.box(51, 14, 64, 16);
      L.row(54, 9, 'B?B');
      L.e('bee', 58, 10);
      L.spring(61, 14);
      L.semi(66, 69, 14);
      L.arc(64, 9, 7);
      L.box(71, 14, 94, 16);
      L.check(73, 14);
      L.e('gull', 80, 8); L.e('grumbug', 86, 14);
      L.row(84, 9, 'S');
      L.box(97, 19, 110, 21);
      L.coins(98, 17, 5);
      L.e('snail', 104, 19);
      L.box(114, 24, 128, 26);
      L.e('grumbug', 120, 24);
      L.row(118, 19, 'L');
      L.spring(125, 24);
      L.semi(129, 133, 19); L.semi(133, 137, 14);
      L.e('gull', 134, 9);
      L.box(139, 14, 186, 18);
      L.e('bee', 146, 10); L.e('grumbug', 150, 14);
      L.row(148, 9, 'BMB');
      L.stairs(156, 6, 1, 14);
      L.goal(170, 14);
    }
  });

  /* 9 — Toy Factory. Conveyor belts (one helps, one fights you), wind-up
     robots that take two stomps, crushers that drop as you pass, and
     spikes on the factory floor. */
  add({
    name: 'TOY FACTORY', theme: 'factory', w: 222, seed: 99,
    build: function (L) {
      L.ground(0, 30);
      L.tip(5, 'robot');
      L.row(8, R1, '?P?');
      L.conveyor(14, 26, 1);
      L.e('robot', 21);
      L.pipe(30, 3, true);
      L.ground(30, 56);
      L.conveyor(34, 46, -1);
      L.e('robot', 40); L.e('robot', 44);
      L.e('crusher', 50, 3);
      L.plat(57, 13, 4, { dx: 2, speed: 0.5 });
      L.ground(64, 100);
      L.spikes(69, 72);
      L.row(74, R1, '???');
      L.check(78);
      L.e('robot', 84);
      L.e('crusher', 89, 3); L.e('crusher', 94, 3);
      L.row(91, R1, 'BSB');
      L.ground(100, 122);
      L.conveyor(102, 120, 1);
      L.e('crusher', 108, 3); L.e('crusher', 114, 3);
      L.plat(123, 15, 2, { dy: -5, speed: 0.5 });
      L.plat(127, 10, 2, { dy: 5, speed: 0.5 });
      L.semi(130, 134, 6);
      L.bear(131, 6);
      L.ground(131, 222);
      L.pipe(135, 4, true);
      L.e('robot', 140);
      L.pipe(144, 2);
      L.e('robot', 149);
      L.spikes(154, 158);
      L.row(146, R1, 'BLB');
      L.conveyor(161, 177, -1);
      L.e('robot', 168); L.e('robot', 173);
      L.stairs(183, 7);
      L.goal(198);
    }
  });

  /* 10 — Dragon Castle. Lava, fire bars and crushers, and at the end
     Grumble the dragon, with Monsty locked in a cage behind him. Three
     stomps on his head (or six balls) and Monsty is free. */
  add({
    name: 'DRAGON CASTLE', theme: 'castle', w: 212, seed: 1010, boss: true,
    build: function (L) {
      L.ceiling(0, 212, 2);
      L.ground(0, 24);
      L.row(8, R1, '?P?');
      L.lava(24, 29);
      L.e('bubble', 26, 17);
      L.ground(29, 60);
      L.row(36, R1, 'X'); L.e('firebar', 36, R1, { len: 4, speed: 0.025 });
      L.row(44, R1, '?');
      L.row(51, 12, 'X'); L.e('firebar', 51, 12, { len: 4, speed: -0.03 });
      L.lava(60, 67);
      L.semi(61, 66, 13);
      L.e('bubble', 62, 17); L.e('bubble', 65, 17, { delay: 60 });
      L.ground(67, 100);
      L.e('crusher', 73, 3); L.e('crusher', 79, 3);
      L.check(86);
      L.row(90, R1, 'BSB');
      L.semi(88, 93, 7);
      L.bear(89, 7);
      L.lava(100, 112);
      L.plat(101, 13, 4, { dx: 6, speed: 0.5 });
      L.e('bubble', 106, 17, { delay: 30 });
      L.ground(112, 150);
      L.row(118, R1, 'X'); L.e('firebar', 118, R1, { len: 5, speed: 0.022 });
      L.row(127, R1, 'X'); L.e('firebar', 127, R1, { len: 5, speed: -0.022 });
      L.row(136, 12, 'X'); L.e('firebar', 136, 12, { len: 4, speed: 0.03 });
      L.lava(150, 155);
      L.e('bubble', 152, 17);
      L.ground(155, 212);
      L.row(159, R1, 'P'); L.row(163, R1, 'L');
      // the arena: a gate closes behind you at 170; the wall at 205
      L.e('gate', 170, 15);
      L.e('dragon', 196);
      L.e('cage', 202);
      L.box(206, 2, 212, 16, TL.HARD);
    }
  });

  /* ==========================================================================
     THE SECOND LAND — MAGPIE ISLES (levels 11–20)
     Captain Magpie has pinched Monsty's birthday presents and flown off
     across the sea. Each world has its own trick: boats that bob, jelly
     to bounce on, wind that pushes, crumbling stones, glowing mushrooms,
     swimming in a cave, sinking sand, the Moon's floaty jumps, a clock
     tower to climb, and the Captain himself on his sky ship.
     ========================================================================== */

  /* 11 — Sunset Harbour. Piers over the sea, and little boats bobbing on
     the waves to hop across. */
  add({
    name: 'SUNSET HARBOUR', theme: 'harbour', w: 220, seed: 111,
    build: function (L) {
      L.ground(0, 34);
      L.row(9, R1, '?P?');
      L.e('crab', 18); L.e('magpie', 26, 9);
      L.semi(34, 42, 16); L.coins(35, 13, 6);
      L.ground(42, 64);
      L.e('crab', 48); L.e('snail', 56);
      L.pipe(60, 3);
      L.plat(65, 15, 3, { bob: true });
      L.plat(70, 15, 3, { bob: true, dx: 4, speed: 0.4 });
      L.arc(66, 12, 9);
      L.ground(78, 104);
      L.row(82, R1, 'BB?BB'); L.row(84, R2, 'M');
      L.e('magpie', 90, 9); L.e('crab', 96);
      L.check(100);
      L.semi(104, 112, 16); L.e('magpie', 108, 10); L.coins(105, 13, 6);
      L.ground(112, 141);
      L.e('snail', 118); L.e('crab', 124);
      L.row(127, R1, '?L?');
      // Bear: up the tall mooring post, then onto the lookout ledge
      L.pipe(134, 4); L.semi(136, 141, 8); L.bear(138, 8);
      L.plat(142, 15, 3, { bob: true }); L.plat(146, 14, 3, { bob: true });
      L.ground(151, 220);
      L.e('crab', 158); L.e('magpie', 165, 9);
      L.row(170, R1, 'B?B'); L.e('crab', 176);
      L.stairs(186, 6);
      L.goal(200);
    }
  });

  /* 12 — Candy Meadow. Cake with pink frosting, cookie blocks, cotton-candy
     clouds, gummy bears — and jelly trampolines everywhere. */
  add({
    name: 'CANDY MEADOW', theme: 'candy', w: 210, seed: 122,
    build: function (L) {
      L.ground(0, 36);
      L.row(8, R1, '?P?');
      L.e('gummy', 18);
      L.spring(24); L.coins(23, 4, 4);
      L.semi(28, 34, 10); L.e('bee', 31, 6);
      L.semi(36, 40, 13);
      L.ground(40, 76);
      L.e('gummy', 46); L.e('gummy', 50);
      L.row(54, R1, 'BB?BB');
      L.spring(60); L.semi(58, 66, 5); L.coins(59, 4, 6);
      L.e('bee', 68, 10);
      L.pipe(72, 3);
      L.semi(77, 81, 13);
      L.ground(82, 118);
      L.check(86);
      L.e('gummy', 92);
      // Bear: on the high cloud, from the jelly's big bounce
      L.spring(98); L.semi(96, 104, 7); L.coins(97, 6, 6); L.bear(102, 7);
      L.e('snail', 110); L.e('bee', 114, 11);
      L.semi(118, 122, 13);
      L.ground(122, 160);
      L.spring(126); L.row(130, R2, '?S?');
      L.e('gummy', 136); L.e('gummy', 140);
      L.row(146, R1, 'BMB');
      L.pipe(152, 3);
      L.semi(161, 165, 12);
      L.ground(166, 210);
      L.e('gummy', 172); L.e('bee', 178, 10);
      L.row(176, R1, 'L');
      L.stairs(184, 6);
      L.goal(196);
    }
  });

  /* 13 — Windy Cliffs. Out on the white clifftops the wind gusts — first
     one way, then the other — and pushes Bonnie along (or back). */
  add({
    name: 'WINDY CLIFFS', theme: 'cliffs', w: 214, seed: 133, wind: true,
    build: function (L) {
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('snail', 18); L.e('magpie', 24, 9);
      L.ground(34, 62, 14);
      L.e('snail', 42, 14);
      L.row(46, 9, 'B?B');
      L.e('magpie', 52, 8);
      L.ground(62, 70, 12);
      L.coins(63, 10, 6);
      L.ground(75, 100);
      L.check(80);
      L.e('snail', 86);
      L.row(92, R1, '???');
      L.plat(101, 13, 3, { dx: 2, speed: 0.4 });
      L.ground(106, 140, 13);
      L.e('magpie', 112, 7); L.e('snail', 118, 13);
      L.row(122, 8, 'BSB');
      // Bear: on the ledge over the clifftop, out in the wind
      L.semi(126, 131, 9); L.bear(128, 9);
      L.ground(144, 214);
      L.e('snail', 150); L.e('magpie', 158, 9);
      L.row(162, R1, 'B?B?B');
      L.e('snail', 170);
      L.row(174, R1, 'L');
      L.stairs(182, 6);
      L.goal(196);
    }
  });

  /* 14 — Jungle Ruins. The old stones of a friendly temple — some crumble
     away underfoot — boars, bats, and monkeys lobbing coconuts. */
  add({
    name: 'JUNGLE RUINS', theme: 'jungle', w: 220, seed: 144,
    build: function (L) {
      L.ground(0, 32);
      L.row(8, R1, '?P?');
      L.e('hog', 18);
      L.box(25, 13, 30, 16); L.e('monkey', 27, 13);
      L.plat(33, 14, 2, { fall: true }); L.plat(37, 13, 2, { fall: true });
      L.ground(41, 70);
      L.stairs(44, 3); L.ground(47, 56, 13);
      L.e('bat', 50, 3); L.e('hog', 60);
      L.row(62, R1, 'BB?BB'); L.row(64, R2, 'M');
      L.semi(70, 78, 10); L.coins(71, 9, 7);
      L.ground(78, 112);
      L.check(82);
      L.e('monkey', 90); L.e('bat', 96, 3); L.e('hog', 102);
      L.pipe(106, 3);
      L.plat(112, 14, 2, { fall: true }); L.plat(116, 13, 2, { fall: true }); L.plat(120, 12, 2, { fall: true });
      L.ground(124, 160);
      L.e('hog', 130);
      L.row(134, R1, '?S?');
      L.box(140, 13, 145, 16); L.e('monkey', 142, 13);
      // Bear: up from the monkey's block to the ledge above the ruins
      L.semi(146, 151, 9); L.bear(148, 9);
      L.e('bat', 152, 3);
      L.ground(164, 220);
      L.e('hog', 170); L.e('monkey', 178);
      L.row(176, R1, 'L');
      L.stairs(186, 6);
      L.goal(200);
    }
  });

  /* 15 — Glowshroom Grove. Night in a wood of giant glowing mushrooms:
     bounce high on them, and mind the shy ghosts and bats. */
  add({
    name: 'GLOWSHROOM GROVE', theme: 'glow', w: 210, seed: 155,
    build: function (L) {
      L.ground(0, 34);
      L.row(8, R1, '?P?');
      L.e('ghost', 20, 10);
      L.spring(26); L.semi(24, 32, 7); L.coins(25, 6, 6);
      L.semi(34, 38, 13);
      L.ground(38, 74);
      L.e('bat', 44, 3); L.e('grumbug', 50);
      // Bear: on the high branch the big mushroom bounces you up to
      L.spring(56); L.semi(54, 62, 6); L.coins(55, 5, 5); L.bear(61, 6);
      L.e('ghost', 66, 9);
      L.row(68, R1, 'BMB');
      L.semi(74, 80, 12);
      L.ground(80, 112);
      L.check(84);
      L.e('grumbug', 90); L.e('grumbug', 93);
      L.spring(98); L.row(96, R2, '?S?');
      L.e('bat', 104, 3);
      L.pipe(108, 3);
      L.plat(113, 14, 3, { dx: 4, speed: 0.4 });
      L.ground(121, 160);
      L.e('ghost', 128, 9);
      L.spring(134); L.semi(132, 140, 6); L.coins(133, 5, 6);
      L.e('bat', 144, 3); L.e('grumbug', 150);
      L.semi(160, 164, 12);
      L.ground(164, 210);
      L.row(168, R1, 'L');
      L.e('ghost', 174, 9); L.e('grumbug', 180);
      L.stairs(186, 6);
      L.goal(196);
    }
  });

  /* 16 — Crystal Lagoon. A cave under the sea: swim (tap to swim up),
     past glowing crystals, fish and drifting jellies. */
  add({
    name: 'CRYSTAL LAGOON', theme: 'lagoon', w: 200, seed: 166, water: true,
    build: function (L) {
      L.ceiling(0, 200, 2);
      L.ground(0, 60);
      L.row(10, R1, '?P?');
      L.box(18, 10, 22, 16); L.coins(18, 8, 4);
      L.e('fish', 28, 9);
      L.ceiling(30, 44, 6); L.coins(31, 8, 12);
      L.e('jelly', 40, 11);
      // Bear: on top of the tall crystal rock, in his bubble
      L.box(48, 8, 50, 16); L.bear(48, 8);
      L.e('fish', 54, 6);
      L.ground(64, 120);
      L.e('jelly', 70, 8);
      L.box(76, 12, 86, 16); L.ceiling(78, 88, 7); L.coins(79, 10, 7);
      L.e('fish', 92, 10);
      L.check(98);
      L.row(102, R1, 'BSB');
      L.e('jelly', 108, 6); L.e('fish', 114, 12);
      L.ground(124, 200);
      L.box(128, 3, 131, 10); L.box(136, 11, 139, 16); L.coins(132, 10, 4);
      L.e('fish', 142, 7); L.e('jelly', 150, 9);
      L.row(156, R1, 'L');
      L.e('fish', 164, 11); L.e('jelly', 172, 7);
      L.stairs(180, 5);
      L.goal(190);
    }
  });

  /* 17 — Dusty Dunes. Sand that sinks when you stand on it, a pyramid to
     climb, scorpions, and tumbleweeds bowling along. */
  add({
    name: 'DUSTY DUNES', theme: 'desert', w: 220, seed: 177,
    build: function (L) {
      L.ground(0, 36);
      L.row(8, R1, '?P?');
      L.e('scorpion', 18); L.e('tumble', 30);
      L.plat(37, 14, 3, { fall: true }); L.plat(42, 13, 3, { fall: true });
      L.ground(47, 80);
      L.stairs(50, 4); L.ground(54, 62, 12); L.stairs(62, 4, -1);
      L.e('scorpion', 66); L.e('tumble', 74);
      L.row(70, R1, 'BB?BB');
      L.plat(81, 14, 3, { fall: true });
      L.ground(85, 124);
      L.check(88);
      L.e('scorpion', 96);
      L.pipe(100, 3);
      L.e('tumble', 108);
      // Bear: on the ledge over the pyramid's top
      L.stairs(112, 5); L.stairs(117, 5, -1); L.semi(115, 120, 7); L.bear(116, 7);
      L.row(106, R2, '?S?');
      L.plat(125, 14, 3, { fall: true }); L.plat(129, 13, 3, { fall: true });
      L.ground(133, 220);
      L.e('scorpion', 138); L.e('tumble', 150);
      L.row(146, R1, 'BMB');
      L.e('scorpion', 160); L.e('tumble', 172);
      L.row(168, R1, 'L');
      L.stairs(184, 7);
      L.goal(200);
    }
  });

  /* 18 — Moon Garden. On the Moon, jumps are long and floaty — so the gaps
     are wider and the ledges higher. */
  add({
    name: 'MOON GARDEN', theme: 'moon', w: 220, seed: 188, lowgrav: true,
    build: function (L) {
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('grumbug', 18);
      L.semi(24, 28, 9); L.coins(24, 8, 4);
      L.arc(31, 11, 7);
      L.ground(38, 64);
      L.e('ghost', 46, 9);
      // Bear: right up on the highest crater ledge
      L.semi(50, 54, 7); L.semi(56, 61, 3); L.coins(56, 2, 4); L.bear(59, 3);
      L.e('bat', 60, 6);
      L.arc(65, 11, 7);
      L.ground(72, 104);
      L.check(76);
      L.e('grumbug', 84); L.e('grumbug', 87);
      L.row(90, R2, 'B?B');
      L.e('ghost', 96, 8);
      L.plat(105, 12, 3, { dy: 4, speed: 0.4 });
      L.ground(114, 150);
      L.e('bat', 120, 4);
      L.row(124, R1, '?S?');
      L.e('grumbug', 132);
      L.semi(138, 142, 9); L.semi(144, 148, 5); L.coins(144, 4, 4);
      L.arc(151, 10, 7);
      L.ground(158, 220);
      L.e('ghost', 166, 9); L.e('grumbug', 172);
      L.row(176, R1, 'L');
      L.stairs(186, 6);
      L.goal(200);
    }
  });

  /* 19 — Clockwork Tower. Up through the inside of a great clock: climb
     the beams, ride the belts, mind the crushers and the turning gear arm. */
  add({
    name: 'CLOCKWORK TOWER', theme: 'clock', w: 186, h: 36, gr: 34, seed: 199,
    build: function (L) {
      var g = 34;
      L.start = { x: 3, row: g };
      L.ground(0, 30, g);
      L.row(8, g - 5, '?P?');
      /* the climb: girders three rows apart, each overlapping the one
         above, so a jump straight up always finds the next — no
         pixel-perfect leaps for small hands */
      L.semi(14, 23, 31); L.semi(21, 30, 28); L.semi(14, 23, 25); L.semi(21, 30, 22); L.semi(14, 23, 19); L.semi(21, 30, 16);
      L.coins(16, 30, 4); L.coins(23, 27, 4); L.coins(16, 24, 4); L.coins(23, 21, 4); L.coins(16, 18, 4);
      L.box(30, 14, 52, 16);
      L.e('robot', 40, 14);
      L.e('crusher', 46, 3);
      L.row(50, 10, 'X'); L.e('firebar', 50, 10, { len: 3, speed: 0.02 });
      L.plat(53, 13, 3, { dx: 3, speed: 0.45 });
      L.box(60, 14, 80, 16);
      L.check(62, 14);
      L.conveyor(66, 76, -1, 14);
      L.e('robot', 70, 14);
      // Bear: on the beam above the belt
      L.semi(75, 80, 10); L.bear(77, 10);
      L.plat(81, 13, 2, { dy: -4, speed: 0.4 });
      L.box(86, 10, 104, 12);
      L.e('robot', 94, 10);
      L.row(98, 6, 'BSB');
      L.box(108, 14, 140, 16);
      L.e('robot', 116, 14);
      L.conveyor(120, 132, 1, 14);
      L.e('crusher', 126, 3);
      L.row(134, 10, 'L');
      L.box(144, 14, 186, 18);
      L.e('robot', 150, 14);
      L.stairs(160, 6, 1, 14);
      L.goal(172, 14);
    }
  });

  /* 20 — Magpie's Sky Ship. Across the deck of Captain Magpie's ship,
     high in the clouds — and at the stern, the Captain himself, with the
     sack of presents. He swoops and drops eggs; when he lands to rest,
     stomp him. Three stomps, and the presents are Monsty's again. */
  add({
    name: 'MAGPIE SKY SHIP', theme: 'ship', w: 212, seed: 2020, boss: true,
    build: function (L) {
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('magpie', 18, 9);
      L.plat(31, 14, 3, { bob: true });
      L.ground(36, 70);
      L.e('magpie', 44, 8);
      L.pipe(48, 3);
      L.e('monkey', 56);
      L.row(60, R1, 'BB?BB');
      L.plat(71, 13, 3, { dx: 4, speed: 0.45 });
      L.ground(80, 113);
      L.check(84);
      L.e('magpie', 90, 9); L.e('magpie', 98, 7);
      L.row(94, R1, 'BSB');
      L.e('monkey', 104);
      // Bear: up the mast and onto the yard
      L.pipe(108, 3); L.semi(110, 113, 9); L.bear(111, 9);
      L.plat(114, 14, 3, { bob: true });
      L.ground(118, 212);
      L.row(124, R1, 'P'); L.row(128, R1, 'L');
      // the stern: the gate closes behind you, the Captain wakes from his
      // nap on the crates and flies to and fro between ax0 and ax1
      L.e('gate', 168, 15);
      L.box(183, 12, 187, 16, TL.CRATE);
      L.e('captain', 184, 12, { ax0: 172, ax1: 200 });
      L.e('sack', 200);
      L.box(206, 2, 212, 16, TL.HARD);
    }
  });

  BB.buildLevel = function (n) {
    var def = LEVELS[n - 1];
    var L = new Builder(def);
    def.build(L);
    L.scatter(BB.ART.themes[def.theme], def.seed);
    L.def = def;
    return L;
  };
})();
