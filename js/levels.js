/* ==========================================================================
   levels.js — the thirty worlds, built from a small set of commands.

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
    SEMI: 10, COIN: 11, SPIKE: 12, LAVA: 13, CONVL: 14, CONVR: 15, HIDDEN: 16, CRATE: 17, WALL: 18,
    SECRET: 20, SECRETH: 21, WATER: 22,
    // the rainbow's paint blocks: solid only in the colour of the last paint pot touched
    PAINTR: 23, PAINTY: 24, PAINTB: 25
  };
  // what is in a "?" block, a brick or a hidden block
  var C = BB.CONTENTS = { COIN: 1, POWER: 2, STAR: 3, LIFE: 4, MULTI: 5, ROCKET: 6 };

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
    // (t may be EMPTY, 0, for B.clear: only a missing t means ground)
    var tile = t === undefined ? TL.GROUND : t;
    for (var x = x0; x < x1; x++) for (var y = y0; y < y1; y++) this.set(x, y, tile);
  };
  B.clear = function (x0, y0, x1, y1) { this.box(x0, y0, x1, y1, TL.EMPTY); };
  B.ceiling = function (x0, x1, rows) { this.box(x0, 0, x1, rows, TL.GROUND); };
  /* A row of things, one character per tile:
       B brick   ? star block   P power-up block   S rainbow-lolly block
       L heart block   M brick of many stars   k hidden star   h hidden heart
       R bullet block (Bonnie's bullet: it zooms you along)
       U used block   X hard block   C star   = one-way platform   # ground
       ^ spikes   c crate   r y b paint blocks (red, yellow, blue)   space: nothing */
  B.row = function (x, y, s) {
    for (var i = 0; i < s.length; i++) {
      var ch = s[i], tx = x + i;
      switch (ch) {
        case 'B': this.set(tx, y, TL.BRICK); break;
        case '?': this.set(tx, y, TL.Q, C.COIN); break;
        case 'P': this.set(tx, y, TL.Q, C.POWER); break;
        case 'S': this.set(tx, y, TL.Q, C.STAR); break;
        case 'L': this.set(tx, y, TL.Q, C.LIFE); break;
        case 'R': this.set(tx, y, TL.Q, C.ROCKET); break;
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
        case 'r': this.set(tx, y, TL.PAINTR); break;
        case 'y': this.set(tx, y, TL.PAINTY); break;
        case 'b': this.set(tx, y, TL.PAINTB); break;
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
  /* A checkpoint flag. Without a row it stands on whatever ground is
     there, at whatever height (see settle) */
  B.check = function (x, row) { var o = this.e('check', x, row); if (row === undefined) o.onGround = true; this.noDeco.push([x - 1, x + 2]); };
  /* Once the whole level's built: each checkpoint with no row of its own
     is stood on the ground actually there — up out of it, or down onto
     it. They used to go at the usual ground height whatever was there, and
     one on a hill put Bonnie back inside the hill when he restarted from
     it, stuck (Windy Hill, 23 Oct; five more were buried). It checks the
     flag's tile and the two after, where he's put back. */
  var STANDS = [TL.GROUND, TL.BRICK, TL.Q, TL.USED, TL.HARD, TL.PIPE, TL.PIPER, TL.PIPETOP, TL.PIPETOPR, TL.SEMI, TL.CONVL, TL.CONVR, TL.CRATE, TL.WALL];
  B.settle = function () {
    var L = this;
    var solid = function (x, y) { return STANDS.indexOf(L.get(x, y)) >= 0 || STANDS.indexOf(L.get(x + 1, y)) >= 0 || STANDS.indexOf(L.get(x + 2, y)) >= 0; };
    this.ents.forEach(function (o) {
      if (!o.onGround) return;
      var x = Math.floor(o.x / T), r = o.row;
      while (r > 2 && solid(x, r - 1)) r--;
      var d = r;
      while (d < L.h && !solid(x, d)) d++;
      o.row = d < L.h ? d : r;
    });
  };
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
  /* Three golden medals hide in every level, to be found: one usually
     along the way but a little off it, the others behind a secret wall, up
     a balloon ride, over the top of something. x, row: the tile it's in. */
  // ({ hidden: true }: kept behind a trick-or-treat door till it opens)
  B.medal = function (x, row, o) { this.medalN = (this.medalN || 0) + 1; this.e('medal', x, row, Object.assign({ i: this.medalN - 1 }, o || {})); };
  /* A secret wall: tiles that look solid (the world's ground, or with
     'hard' its blocks) but that Bonnie walks straight through — they go
     see-through while he's inside. Hide a medal or a room of stars in it. */
  B.secret = function (x0, y0, x1, y1, look) {
    this.secretN = (this.secretN || 0) + 1;
    for (var x = x0; x < x1; x++) for (var y = y0; y < y1; y++) this.set(x, y, look === 'hard' ? TL.SECRETH : TL.SECRET, this.secretN);
  };
  /* A bunch of balloons: grab it and Bonnie floats up into the sky for a
     few seconds, steering as he goes, then drifts gently down. row: the
     tile row the bunch's knot hangs at. */
  B.balloons = function (x, row) { this.e('balloons', x, row); this.noDeco.push([x - 1, x + 3]); };
  /* Musical blocks: a row of them (one note letter per tile, 'CDEFGAB'
     and 'c' for the high C), each bouncing Bonnie a little and singing
     its note as he lands — a tune if he hops along in order. */
  B.notes = function (x, row, tune) { for (var i = 0; i < tune.length; i++) if (tune[i] !== ' ') this.e('note', x + i, row, { note: tune[i] }); this.noDeco.push([x - 1, x + tune.length + 1]); };
  // water to swim in (a pool, the sea at the shore): x0..x1-1, rows y0..y1-1
  B.water = function (x0, y0, x1, y1) { for (var x = x0; x < x1; x++) for (var y = y0; y < y1; y++) this.set(x, y, TL.WATER); this.noDeco.push([x0, x1]); };
  // a steam vent on the ground (or on row `base`): its plume lifts Bonnie h rows
  B.steam = function (x, h, base) { this.e('steam', x, base === undefined ? this.gr : base, { h: h }); this.noDeco.push([x - 1, x + 3]); };
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
    name: 'SUNNY HILLS', theme: 'hills', w: 305, seed: 11,
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
      // the first medal, in plain sight at the end of the high bricks: a
      // held jump from the low ones gets him up there
      L.medal(73, 5);
      L.e('snail', 70);
      L.e('grumbug', 75); L.e('grumbug', 77);
      L.row(80, R1, 'BMB');
      L.stairs(84, 4);
      L.ground(90, 140);
      L.stairs(90, 4, -1);
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
      L.ground(146, 305);
      // the flag: halfway along the level, now it's longer
      L.check(148);
      L.coins(150, 12, 5);
      L.e('grumbug', 156); L.e('snail', 161);
      L.row(158, R1, 'B?B?B');
      /* The meadow beyond (added when three hearts made the hills too
         quick): the new things one at a time, the way the start of the
         level brings in the old ones. */
      // a path of musical blocks laid in the ground: run across it and it plays a scale
      L.notes(169, 16, 'CDEFGABc');
      /* A bunch of balloons on the path: up past a trail of stars to a
         medal in the sky. Nothing walks between here and the hill, so
         wherever he floats down is safe. (Straight up: the stars over the
         bunch; steered right: the trail, the sky and the medal.) */
      L.balloons(184, 14);
      L.row(183, 11, 'C'); L.row(183, 8, 'C'); L.row(183, 5, 'C');
      L.row(187, 12, 'C'); L.row(189, 10, 'C'); L.row(191, 8, 'C'); L.row(194, 6, 'C'); L.row(197, 4, 'C');
      L.coins(199, 2, 6);
      L.medal(206, 2);
      L.coins(208, 2, 4);
      L.row(214, 5, 'C'); L.row(217, 9, 'C'); L.row(220, 12, 'C');
      L.row(224, R1, 'B?B');
      /* A hill on the path with a secret tunnel through it (and a medal
         inside): walk into its side and it opens up. Its top is a jump
         high, so he can go over instead. */
      L.ground(236, 250, 11);
      L.secret(236, 12, 250, 16);
      L.medal(243, 14);
      L.coins(238, 10, 10);
      L.row(256, R1, 'B?B');
      L.e('grumbug', 266); L.e('grumbug', 269);
      L.stairs(272, 8); L.column(280, 8);
      L.goal(287);
    }
  });

  /* 2 — Playground Park. Trampolines: bounce on one for a big jump (hold
     A for a bigger one). Climbing frames to scramble up, bees on the way. */
  add({
    name: 'PLAYGROUND PARK', theme: 'park', w: 325, seed: 22,
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
      // a medal over the top of the first climbing frame: a jump from its top bar
      L.medal(29, 3);
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
      L.row(104, R1, 'S');
      L.spring(108);
      L.coins(107, 2, 4);
      L.e('grumbug', 113); L.e('grumbug', 115); L.e('grumbug', 117); L.e('grumbug', 119);
      L.pipe(124, 2);
      L.deco1('swing', 127);
      L.plat(133, 15, 2, { dy: -5, speed: 0.5 });
      L.plat(137, 10, 2, { dy: 5, speed: 0.5 });
      L.ground(141, 325);
      L.e('bee', 145, 12); L.e('snail', 149);
      L.row(152, R1, 'BMB'); L.row(153, R2, '?');
      L.semi(158, 163, 13); L.semi(158, 163, 10); L.semi(158, 163, 7);
      L.coins(158, 6, 5);
      L.e('grumbug', 166); L.e('grumbug', 169);
      L.spring(172);
      L.coins(171, 3, 4);
      // the flag: halfway along the level, now it's longer
      L.check(177);
      /* The far side of the park (added when three hearts made the levels
         too quick): a climbing frame that plays Twinkle Twinkle as he
         climbs it, the balloon man's bunch up to a treetop walk, and a den
         in the side of the big hedge. */
      // the musical climbing frame: a line of the tune on each bar, stars at the top
      L.notes(183, 13, 'CCGG'); L.notes(184, 10, 'AAG'); L.notes(183, 7, 'FFEE'); L.notes(184, 4, 'DDC');
      L.coins(184, 2, 3);
      L.e('bee', 192, 11);
      L.pipe(196, 3, true);
      L.arc(194, 11, 6);
      /* The balloon man's bunch: up through the branches to a treetop walk
         of stars, with a medal at the far end. It's long enough to catch
         him whether he walks or runs as he floats; nothing waits where he
         drops off it. */
      L.balloons(203, 14);
      L.semi(211, 257, 4);
      L.coins(214, 3, 4); L.coins(224, 3, 4); L.coins(234, 3, 4); L.coins(244, 3, 4);
      L.medal(255, 3);
      L.e('bee', 222, 11);
      L.e('grumbug', 232); L.e('grumbug', 235);
      L.row(240, R1, 'B?B');
      /* The big hedge: a trampoline over it, and stars in the gap at its
         foot that lead into a den in its side (a secret wall, with a
         medal). Its top is a jump high, so he can climb out either way. */
      L.spring(262);
      L.coins(265, 15, 3);
      L.ground(268, 280, 11);
      L.secret(268, 12, 273, 16);
      L.medal(271, 14);
      L.e('grumbug', 288); L.e('grumbug', 291);
      L.row(286, R1, 'B?B');
      L.stairs(296, 6); L.column(302, 6);
      L.goal(308);
    }
  });

  /* 3 — Sandy Shore. The sea fills the gaps: piers to walk across, rafts
     that sink when you stand on them, crabs on the sand and gulls above. */
  add({
    name: 'SANDY SHORE', theme: 'beach', w: 328, seed: 33,
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
      // a medal over the top of the arc of stars: a held jump from the raft
      L.medal(102, 6);
      L.ground(110, 140);
      L.row(118, R1, '?'); L.row(121, R1, 'h');
      L.e('snail', 124); L.e('crab', 128); L.e('crab', 131);
      L.deco1('castle', 134);
      L.semi(140, 150, 16);
      L.e('gull', 143, 9); L.e('gull', 148, 11);
      L.ground(150, 170);
      // the flag: halfway along the level, now it's longer
      L.check(152);
      L.row(154, R1, 'S');
      L.stairs(158, 3);
      L.ground(161, 170, 13);
      L.e('crab', 166, 13);
      L.plat(171, 13, 3, { fall: true });
      L.plat(175, 12, 3, { fall: true });
      L.ground(179, 252);
      L.e('crab', 185); L.e('gull', 189, 10);
      L.row(187, R1, 'B?B');
      /* Further along the shore (added when three hearts made the levels
         too quick): a rock pool to swim in, with a medal on the bottom,
         then a bunch of balloons to float over the bay with the gulls. */
      /* The rocks, and a pool in them: a pier from each side, and the gap
         between them a jump, or a swim down to the medal. The piers and
         rocks are level with the water, so the stroke that breaks the
         surface (in the gap) lifts him out onto them; a pier a row higher
         was a pixel out of reach of a tap. */
      L.stairs(194, 2);
      L.ground(196, 202, 13); L.ground(220, 228, 13);
      L.water(202, 13, 220, 16);
      L.semi(202, 208, 13); L.semi(213, 220, 13);
      L.arc(207, 12, 7);
      L.medal(210, 15);
      L.deco1('umbrella', 233);
      /* The bay: a pier, two sinking rafts and a pier across it — or the
         balloons, up over the gulls to a sky of stars with a medal in it.
         Nothing walks on the sand by the balloons, where he comes down if
         he doesn't steer. */
      L.balloons(246, 14);
      L.row(248, 12, 'C'); L.row(250, 10, 'C'); L.row(252, 8, 'C'); L.row(254, 6, 'C'); L.row(256, 4, 'C');
      L.coins(258, 2, 10);
      L.medal(269, 2);
      L.coins(271, 2, 4);
      L.semi(252, 257, 16);
      L.plat(259, 14, 3, { fall: true });
      L.plat(264, 13, 3, { fall: true });
      L.e('gull', 266, 11);
      L.semi(269, 276, 16);
      L.ground(276, 328);
      L.e('crab', 286); L.e('crab', 291);
      L.row(288, R1, '?L?');
      L.pipe(295, 3);
      L.stairs(300, 7);
      L.goal(311);
    }
  });

  /* 4 — Coral Reef. Under the sea: tap A to swim up, let go to sink.
     Fish swim in waves and jellyfish drift — neither can be stomped down
     here, so swim round them (or throw a ball). */
  add({
    name: 'CORAL REEF', theme: 'reef', w: 300, seed: 44, water: true,
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
      // a medal up over the bricks, near the top of the sea
      L.medal(54, 3);
      L.ground(64, 120);
      L.coins(60, 11, 4);
      L.e('fish', 70, 6); L.e('fish', 76, 12);
      L.box(80, 12, 90, 16);
      L.ceiling(82, 92, 6);
      L.coins(83, 9, 7);
      L.e('jelly', 94, 10);
      L.row(102, R1, 'BSB');
      L.e('fish', 108, 8); L.e('fish', 112, 13);
      L.e('jelly', 116, 6);
      L.ground(125, 150);
      L.semi(119, 126, 11);
      L.box(130, 10, 133, 16); L.box(136, 2, 139, 9); L.box(142, 11, 145, 16);
      L.coins(133, 10, 3); L.coins(139, 12, 3);
      L.e('fish', 147, 7);
      L.ground(154, 186);
      L.e('jelly', 152, 9);
      L.row(158, R1, 'L');
      // the flag: halfway along the level, now it's longer
      L.check(161);
      L.e('fish', 164, 11); L.e('jelly', 170, 7); L.e('fish', 176, 13);
      L.pipe(166, 2);
      /* The deep reef (added when three hearts made the levels too quick):
         an arch of musical coral over a trench, a rock with stars locked
         inside it, and a tunnel with a medal tucked up in its roof. */
      // the coral xylophone: an arch of musical blocks over the trench, a note a step
      L.notes(187, 15, 'C'); L.notes(188, 14, 'D'); L.notes(189, 13, 'E'); L.notes(190, 12, 'F');
      L.notes(191, 12, 'G'); L.notes(192, 13, 'A'); L.notes(193, 14, 'B'); L.notes(194, 15, 'c');
      L.ground(196, 300);
      L.e('jelly', 199, 6);
      /* A rock with stars (and a medal) locked inside: the way in is its
         left side, a secret wall to swim (or walk along the sand) straight
         through. The door runs down to the seabed and is seven rows tall,
         so even big Bonnie, bobbing about, can't miss it. The way on is
         over the top. */
      L.box(204, 6, 220, 16);
      L.clear(208, 9, 217, 16);
      L.secret(204, 9, 208, 16);
      L.coins(209, 11, 6); L.coins(209, 13, 6);
      L.medal(215, 15);
      L.e('fish', 226, 4);
      // a tunnel through the reef, a fish on patrol, and a medal up in a notch in its roof
      L.ceiling(230, 248, 7);
      L.box(230, 13, 248, 16);
      L.clear(240, 4, 242, 7);
      L.medal(240, 5);
      L.coins(232, 10, 6);
      L.e('fish', 246, 10);
      L.e('jelly', 254, 8); L.e('fish', 260, 12);
      L.row(258, R1, '?P?');
      L.pipe(266, 3);
      L.e('jelly', 271, 6);
      L.stairs(280, 5);
      L.goal(290);
    }
  });

  /* 5 — Spooky Woods. Night. Ghosts creep up when your back is turned
     (turn round and they freeze), bats drop from the dark, hedgehogs are
     too spiky to stomp, and the big mushrooms bounce. */
  add({
    name: 'SPOOKY WOODS', theme: 'woods', w: 324, seed: 55,
    build: function (L) {
      L.ground(0, 34);
      L.row(10, R1, 'BPB');
      L.e('hog', 18);
      L.spring(24);
      L.coins(23, 3, 4);
      // a medal just over the stars: a held bounce on the mushroom reaches it
      L.medal(25, 2);
      L.e('ghost', 31, 10);
      L.ground(38, 70);
      L.semi(42, 47, 12); L.semi(48, 53, 9);
      L.coins(48, 8, 5);
      L.e('bat', 51, 3);
      L.e('grumbug', 57); L.e('hog', 63);
      L.semi(72, 76, 13);
      L.ground(79, 110);
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
      // the flag: halfway along the level, now it's longer
      L.check(152);
      L.ground(164, 324);
      L.e('grumbug', 167); L.e('hog', 171); L.e('ghost', 174, 9);
      L.row(170, R1, 'L');
      /* Deeper in the wood (added when three hearts made the levels too
         quick): a mossy bank with a ditch in it and a secret hollow under
         the bank, then a bunch of balloons up into the night sky. */
      /* The ditch: jump it, or drop in for the stars and walk on into the
         side of the bank, which is a secret wall: a hollow with a medal.
         A stone in the ditch to climb out by. */
      L.stairs(182, 4);
      L.ground(186, 214, 11);
      L.clear(194, 11, 199, 16);
      L.row(194, 13, 'X');
      L.coins(196, 15, 3);
      L.secret(199, 12, 205, 16);
      L.medal(202, 14);
      L.e('ghost', 210, 7);
      /* A bunch of balloons, up past the treetops into the night sky: a
         trail of stars and a medal among them. No bats hang here, and
         nothing walks where he floats down. */
      L.balloons(224, 14);
      L.row(226, 12, 'C'); L.row(228, 10, 'C'); L.row(230, 8, 'C'); L.row(232, 6, 'C'); L.row(234, 4, 'C');
      L.coins(236, 2, 10);
      L.medal(247, 2);
      L.coins(249, 2, 4);
      L.deco1('pumpkin', 262);
      // (bugs, not a hedgehog: a float that comes down on one stomps it)
      L.e('grumbug', 282); L.e('grumbug', 288);
      L.row(285, R1, 'B?B');
      L.stairs(292, 6); L.column(298, 6);
      L.goal(304);
    }
  });

  /* 6 — Crystal Caves. A roof overhead. Grumpy rocks wake and drop when
     you pass beneath, bats hang from the ceiling, and the pits are lined
     with spikes — the girders and lifts carry you over. */
  add({
    name: 'CRYSTAL CAVES', theme: 'cave', w: 320, seed: 66,
    build: function (L) {
      L.ceiling(0, 320, 2);
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
      // a medal over the spikes: a held jump from the girders
      L.medal(75, 8);
      L.ground(80, 112);
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
      // the flag: halfway along the level, now it's longer
      L.check(156);
      L.plat(161, 13, 2, { fall: true });
      L.plat(164, 12, 2, { fall: true });
      L.ground(167, 198);
      L.e('bat', 172, 2); L.e('grumbug', 176); L.e('grumbug', 178);
      L.row(180, R1, 'L');
      /* Further in (added when three hearts made the levels too quick):
         crystal chimes over a spike pit, a lift up to a ledge that ends at
         a wall that isn't one, and a last stretch of rocks and bats. */
      // the chimes: a bridge of musical blocks over the spikes, and a medal over them
      L.ground(198, 209, 17); L.spikes(198, 209, 16);
      L.notes(198, 14, 'CDEGAcAGEDC');
      L.medal(203, 10);
      L.ground(209, 263);
      /* A lift up to a ledge under a great hanging rock. The ledge seems
         to stop at the rock, but its face is a secret wall: a little room
         inside, with a medal. The way on is underneath. */
      L.plat(219, 15, 2, { dy: -8, speed: 0.45 });
      L.semi(222, 228, 7);
      L.coins(223, 6, 4);
      L.box(228, 2, 246, 11);
      L.secret(228, 3, 234, 7);
      L.medal(231, 5);
      L.e('rock', 252, 2); L.e('hog', 258);
      // spikes again, with the rafts that drop
      L.ground(263, 270, 17); L.spikes(263, 270, 16);
      L.plat(264, 13, 2, { fall: true });
      L.plat(267, 12, 2, { fall: true });
      L.ground(270, 320);
      L.e('bat', 280, 2); L.e('grumbug', 284); L.e('grumbug', 287);
      L.row(286, R1, 'BMB');
      L.stairs(292, 6);
      L.goal(304);
    }
  });

  /* 7 — Frosty Peaks. The ice is slippery: Bonnie slides when he stops.
     Penguins belly-slide at you, snowmen throw snowballs, and in the ice
     tunnel the icicles drop. */
  add({
    name: 'FROSTY PEAKS', theme: 'snow', w: 335, seed: 77, ice: true,
    build: function (L) {
      L.ground(0, 40);
      L.tip(6, 'ice');
      L.row(10, R1, '?P?');
      L.e('snowman', 22);
      L.e('penguin', 30);
      L.box(34, 13, 40, 16);
      L.ground(44, 80);
      L.coins(41, 10, 3);
      // a medal high over the first gap: a held jump from the ice block
      L.medal(42, 7);
      L.e('penguin', 52); L.e('penguin', 57);
      L.box(64, 13, 72, 16);
      L.e('snowman', 68, 13);
      L.semi(58, 62, 9);
      L.bear(59, 9);
      L.coins(64, 11, 3);
      L.ceiling(80, 108, 5);
      L.ground(80, 108);
      L.e('icicle', 88, 5); L.e('icicle', 93, 5); L.e('icicle', 98, 5);
      L.row(101, R1, 'BMB');
      L.semi(109, 111, 13); L.semi(112, 114, 12);
      L.ground(115, 160);
      L.e('snowman', 121); L.e('penguin', 128); L.e('penguin', 132);
      L.row(124, R1, '?S?');
      L.box(140, 12, 150, 16);
      L.coins(141, 10, 8);
      L.e('snowman', 146, 12);
      // the flag: halfway along the level, now it's longer
      L.check(156);
      L.plat(161, 13, 4, { dx: 3, speed: 0.45 });
      L.ground(168, 335);
      L.e('penguin', 175); L.e('snowman', 183);
      L.row(178, R1, 'L');
      /* Higher up the mountain (added when three hearts made the levels
         too quick): a peak to climb, with a bunch of balloons waiting on
         the top to float him off into a sky of stars, and an ice cave in
         the snowbank beyond, its door at the bottom of a crevasse. */
      // the peak, in wide steps (on ice, a narrow one is a slide off)
      L.ground(196, 222, 12);
      L.ground(200, 218, 9);
      L.ground(204, 214, 6);
      L.balloons(208, 4);
      L.coins(212, 2, 16);
      L.medal(230, 2);
      L.coins(232, 2, 4);
      /* The crevasse: jump it from the peak to the snowbank, or drop in
         for the stars and walk on into the bank's side, a secret wall:
         an ice cave with a medal. */
      L.coins(222, 15, 3);
      L.ground(225, 241, 11);
      L.secret(225, 12, 231, 16);
      L.medal(228, 14);
      L.row(256, R1, 'B?B');
      // (the penguins wait well past where a running float comes down: they slide at him on sight)
      L.e('penguin', 292); L.e('penguin', 297);
      L.stairs(302, 7);
      L.goal(316);
    }
  });

  /* 8 — Cloud Kingdom. Up into the sky: a climb from the bottom of the
     clouds to the top, then across, with nothing below but sky. */
  add({
    name: 'CLOUD KINGDOM', theme: 'sky', w: 314, h: 36, gr: 34, seed: 88,
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
      // a medal over the top of the arc: a held bounce, steered right
      L.medal(67, 3);
      L.box(71, 14, 94, 16);
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
      L.box(139, 14, 166, 18);
      L.e('bee', 146, 10); L.e('grumbug', 150, 14);
      L.row(148, 9, 'BMB');
      // the flag: halfway along the level, now it's longer
      L.check(158, 14);
      /* Higher still (added when three hearts made the levels too quick):
         a bridge that plays Ode to Joy across the open sky, a bunch of
         balloons up to the very top of the sky, and a room hidden in a
         cloudbank. */
      // Ode to Joy, a note a step: the bridge is solid all the way, so walking it is safe
      L.notes(166, 14, 'EEFGGFEDCCDEEDD');
      L.box(181, 14, 264, 18);
      /* Balloons, from the clouds to the top of the sky: a trail of stars
         and a medal up there. The cloud goes on under the whole ride, so
         he floats down onto something wherever he steers. */
      L.balloons(190, 12);
      L.row(192, 11, 'C'); L.row(194, 9, 'C'); L.row(196, 7, 'C'); L.row(198, 5, 'C'); L.row(200, 3, 'C');
      L.coins(202, 2, 11);
      L.medal(214, 2);
      L.coins(216, 2, 4);
      /* Two cloudbanks with a gap between: jump it, or drop in for the
         stars and walk on into the second bank's side, a secret wall with
         a room and a medal behind it. */
      L.box(236, 10, 243, 14);
      L.coins(243, 13, 3);
      L.box(246, 9, 258, 14);
      L.secret(246, 10, 251, 14);
      L.medal(249, 12);
      L.plat(265, 14, 3, { dx: 3, speed: 0.45 });
      L.box(272, 14, 314, 18);
      L.e('grumbug', 280, 14);
      L.stairs(284, 6, 1, 14);
      L.goal(298, 14);
    }
  });

  /* 9 — Toy Factory. Conveyor belts (one helps, one fights you), wind-up
     robots that take two stomps, crushers that drop as you pass, and
     spikes on the factory floor. */
  add({
    name: 'TOY FACTORY', theme: 'factory', w: 331, seed: 99,
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
      // a medal over the gap: a held jump from the moving platform
      L.medal(60, 8);
      L.ground(64, 100);
      L.spikes(69, 72);
      L.row(74, R1, '???');
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
      L.ground(131, 270);
      L.pipe(135, 4, true);
      L.e('robot', 140);
      L.pipe(144, 2);
      L.e('robot', 149);
      L.spikes(154, 158);
      L.row(146, R1, 'BLB');
      // the flag: halfway along the level, now it's longer
      L.check(159);
      L.conveyor(161, 177, -1);
      L.e('robot', 168); L.e('robot', 173);
      /* The packing hall (added when three hearts made the levels too
         quick): a belt that carries him over a toy piano playing Frere
         Jacques, a storeroom up on the gantry with stars locked inside,
         and a crusher to ride up to the top shelf. */
      // the music-box belt: stand still on it and it plays the tune for him (the gaps are rests)
      L.conveyor(184, 204, 1);
      L.notes(186, 16, 'CDEC CDEC EFG EFG');
      /* The storeroom: stars (and a medal) inside a box of crates up on
         the gantry, the way on underneath. Its door is the left wall, a
         secret, from the girder beside it. */
      L.semi(208, 214, 11);
      L.box(214, 6, 228, 12, TL.HARD);
      L.clear(216, 7, 226, 11);
      L.secret(214, 7, 216, 11, 'hard');
      L.coins(217, 9, 6);
      L.medal(224, 10);
      L.e('robot', 233);
      L.spikes(238, 241);
      /* A crusher that drops as he passes: once it's down, hop on, and it
         carries him back up to a shelf by the roof with a medal on it. */
      L.e('crusher', 250, 3);
      L.semi(252, 257, 3);
      L.medal(255, 2);
      L.e('crusher', 262, 3);
      L.plat(270, 13, 3, { dx: 3, speed: 0.5 });
      L.ground(277, 331);
      L.e('robot', 284);
      L.stairs(292, 7);
      L.goal(307);
    }
  });

  /* 10 — Dragon Castle. Lava, fire bars and crushers, and at the end
     Grumble the dragon, with Monsty locked in a cage behind him. Three
     stomps on his head (or six balls) and Monsty is free. */
  add({
    name: 'DRAGON CASTLE', theme: 'castle', w: 323, seed: 1010, boss: true,
    build: function (L) {
      L.ceiling(0, 323, 2);
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
      // a medal over the bridge, between the two fire bubbles: jump when they've dropped
      L.medal(63, 9);
      L.ground(67, 100);
      L.e('crusher', 73, 3); L.e('crusher', 79, 3);
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
      L.ground(155, 172);
      // the flag: halfway along the way to Grumble, now it's longer
      L.check(158);
      /* The long way to Grumble (added when three hearts made the levels
         too quick; the arena itself is unchanged, just further on): an
         organ that plays as he crosses the lava, a battlement walk under a
         fire bar, and a secret room in the back of the castle wall. */
      // the organ: a bridge of musical blocks over the lava, a fire bubble leaping through it
      // (and a medal over it, to be had between leaps)
      L.lava(172, 181);
      L.notes(172, 14, 'CEGcGEGEC');
      L.e('bubble', 176, 17, { delay: 40 });
      L.medal(176, 10);
      L.ground(181, 232);
      L.e('crusher', 187, 3); L.e('crusher', 193, 3);
      /* The battlement: up the steps, along under the fire bar, and off
         the far end. The crusher just beyond makes him step back, into
         the end of the wall: a secret door, with a medal in the room. */
      L.stairs(197, 3);
      L.box(200, 11, 222, 16, TL.HARD);
      // (its pivot high enough that big Bonnie walks under it)
      L.row(210, 6, 'X'); L.e('firebar', 210, 6, { len: 4, speed: 0.03 });
      L.secret(216, 12, 222, 16, 'hard');
      L.medal(218, 14);
      L.coins(222, 15, 3);
      L.e('crusher', 227, 3);
      L.lava(232, 244);
      L.plat(233, 13, 4, { dx: 6, speed: 0.5 });
      L.e('bubble', 238, 17, { delay: 90 });
      L.ground(244, 323);
      L.row(252, R1, 'X'); L.e('firebar', 252, R1, { len: 5, speed: -0.022 });
      L.row(261, 12, 'X'); L.e('firebar', 261, 12, { len: 4, speed: 0.03 });
      L.row(270, R1, 'P'); L.row(274, R1, 'L');
      // the arena: a gate closes behind you at 281; the wall at 316
      L.e('gate', 281, 15);
      L.e('dragon', 307);
      L.e('cage', 313);
      L.box(317, 2, 323, 16, TL.HARD);
    }
  });

  /* The other lands' levels live in their own files (levels2.js, levels3.js,
     levels4.js), added after this one: they build with the same kit. */
  BB.levelKit = { add: add, TL: TL, C: C, GR: GR, R1: R1, R2: R2, T: T };

  BB.buildLevel = function (n) {
    var def = LEVELS[n - 1];
    var L = new Builder(def);
    def.build(L);
    L.settle();
    L.scatter(BB.ART.themes[def.theme], def.seed);
    L.def = def;
    return L;
  };
})();
