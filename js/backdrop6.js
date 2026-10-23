/* ==========================================================================
   backdrop6.js — the sixth land, "HALF TERM!" (levels 46–55): the chase
   after the biggest pumpkin ever, from a golden afternoon on the farm,
   through dusk and twilight, into Halloween night and up the witch's tower.

   Each world's theme (its colours, ground, platforms, scenery, music, the
   little things on its ground and its light) and the scenery behind it.
   Painted the same way as backdrop.js, with its kit (BB.bgKit): a graded
   sky, then layers that slide past slower the further away they are, each
   fainter and nearer the colour of the sky than the one in front; round
   things lit from the top left in three tones; fine detail at the screen's
   full density; every strip 512 game pixels wide and seamless at its ends.

   Spooky-cute, never scary: moons are big and friendly, windows are warm,
   jack-o'-lanterns grin, bats are little and round.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART;

  /* ==========================================================================
     THEMES — tile palettes are [1, 2, 3, 4], light to dark. The land runs
     from a golden afternoon (46) through dusk (49) and twilight (50) into
     Halloween night (51–55).
     ========================================================================== */
  var THEMES = {
    // 46 · the pumpkin patch: autumn turf on red-brown earth, hay-bale blocks, barn-red blocks
    pumpkinpatch: {
      sky: ['#5ea4e4', '#a6cdea', '#ffd89a'], ground: 'grass', gpal: ['#d8de6a', '#96b43e', '#b8703a', '#6a3a1e'],
      brick: ['#fff0a0', '#f2c850', '#c48c28', '#5a3a10'], hard: ['#ffae98', '#d8584a', '#9a2e2c', '#401214'],
      semi: 'bridge', spal: ['#f2cc90', '#c28a50', '#82562c', '#3c2414'], column: 'stump',
      deco: ['pumpkins', 'haybale6', 'wheelbarrow', 'cornstalk', 'applecrate', 'farmgate'], bg: 'pumpkinpatch', music: 'pumpkinpatch'
    },
    // 47 · the conker woods: leaf-strewn earth, conker-brown blocks, oak-bark blocks, branches
    conkerwood: {
      sky: ['#9ab6d4', '#f0cc98', '#fff0d0'], ground: 'grass', gpal: ['#ffb84a', '#de6a2a', '#8a5234', '#46281a'],
      brick: ['#f0aa78', '#b85e2e', '#7a3218', '#321008'], hard: ['#ccb090', '#957250', '#5e442c', '#2a1a10'],
      semi: 'branch', spal: ['#cc9a6c', '#966640', '#5c3c22', '#24160c'], column: 'stump',
      deco: ['oak', 'leafbush', 'logpile', 'fungi', 'leafbush'], bg: 'conkerwood', music: 'conkerwood'
    },
    // 48 · the windy hill: wind-combed turf, dry-stone blocks, kite-orange blocks
    windyhill: {
      sky: ['#3a92ea', '#7ebef6', '#e2f2ff'], ground: 'grass', gpal: ['#cce46e', '#7cb046', '#a27a50', '#5a4028'],
      brick: ['#f4f0e2', '#cec6b0', '#928a74', '#3e3a30'], hard: ['#ffd4a0', '#f29a48', '#b86424', '#4a260e'],
      semi: 'bridge', spal: ['#ecc890', '#bc8c50', '#7e5628', '#3c2410'], column: 'stump',
      deco: ['bench6', 'weathervane', 'windsock', 'leafbush'], bg: 'windyhill', music: 'windyhill'
    },
    // 49 · trick-or-treat street at dusk: lilac pavements, purple blocks, pumpkin-orange blocks, white planks
    trickortreat: {
      sky: ['#36276e', '#9a4c94', '#ffa060'], ground: 'stone', gpal: ['#dccadc', '#a690ac', '#6c5a7c', '#2e2440'],
      brick: ['#dcbcf2', '#a87ad8', '#6c48a0', '#2a1840'], hard: ['#ffcc8a', '#f88a3a', '#c05418', '#4c1c08'],
      semi: 'bridge', spal: ['#fff4ec', '#d8c6d2', '#9a86a2', '#3c3048'], column: 'chimney',
      deco: ['jackolantern', 'cobweb', 'picketfence', 'pumpkinstack', 'inflatable', 'lamppost'], bg: 'trickortreat', music: 'trickortreat'
    },
    // 50 · Pumpkin Town at twilight: grey-violet cobbles, pumpkin blocks, slime-teal blocks, crooked branches
    pumpkintown: {
      sky: ['#20184a', '#46397a', '#6eaca2'], ground: 'stone', gpal: ['#bab2cc', '#827a9c', '#524a6c', '#221c38'],
      brick: ['#ffd090', '#f49a3c', '#c0601c', '#4a2008'], hard: ['#a8e2c8', '#58a898', '#2c6a68', '#10282c'],
      semi: 'branch', spal: ['#ac9480', '#78624e', '#4a3a30', '#1c1410'], column: 'chimney',
      deco: ['towngate', 'fountain6', 'crookedhouse', 'mayor', 'pumpkinband', 'jackolantern'], bg: 'pumpkintown', music: 'pumpkintown'
    },
    // 51 · the graveyard jamboree: moonlit turf, headstone-grey blocks, violet blocks, dead branches
    graveyard: {
      sky: ['#121a42', '#2a3672', '#5c6eaa'], ground: 'grass', gpal: ['#7ccaa8', '#3a7e72', '#3c3458', '#1a1630'],
      brick: ['#cccce2', '#9292ba', '#5c5c8a', '#24243c'], hard: ['#b2a2d2', '#7868a8', '#483c78', '#1c1438'],
      semi: 'branch', spal: ['#aa9aba', '#72628a', '#463a5c', '#1c1428'], column: 'chimney',
      deco: ['grave1', 'grave2', 'grave3', 'lanterntree', 'cryptdoor', 'ghostband', 'jackolantern'], bg: 'graveyard', music: 'graveyard', dark: true
    },
    // 52 · inside the Haunted Mansion: dark polished boards, purple stone, gilt-and-mahogany blocks
    mansion: {
      sky: ['#1c0c2e', '#2c1642', '#3e2054'], ground: 'stone', gpal: ['#c08a62', '#8a5434', '#5a321e', '#26120a'],
      brick: ['#caa8e2', '#9270ba', '#5c4088', '#241438'], hard: ['#f0cc8a', '#c08e48', '#7c5624', '#2c1a0a'],
      semi: 'bridge', spal: ['#e2aa82', '#a8643c', '#6a3420', '#2a1008'], column: 'chimney',
      deco: ['bust', 'crystalball', 'grandclock', 'armour', 'candle3', 'organ', 'potionshelf'], bg: 'mansion', music: 'mansion', dark: true
    },
    // 53 · the witch's wood: glowing moss on violet earth, potion-lime blocks, purple stone, toadstool caps
    witchwood: {
      sky: ['#120a30', '#2c1854', '#5c2e7c'], ground: 'grass', gpal: ['#7ae6b4', '#2e8c7a', '#42305e', '#1c1432'],
      brick: ['#e2ff9c', '#a8e050', '#64a030', '#1c3a10'], hard: ['#c2a2ea', '#8a68c2', '#58408c', '#221838'],
      semi: 'mushroom', spal: ['#ffd2f8', '#ff8ae0', '#c04aa8', '#4a1440'], column: 'stump',
      deco: ['twistytree', 'glowshroom6', 'fungi', 'lanterntree', 'glowshroom6'], bg: 'witchwood', music: 'witchwood', dark: true
    },
    // 54 · firework night over the rooftops: slate underfoot, chimney-brick blocks, stone blocks, slate ledges
    fireworks: {
      sky: ['#0c0c32', '#1e1e5a', '#4a3274'], ground: 'metal', gpal: ['#aab2d2', '#6c7498', '#444a6a', '#1c2034'],
      brick: ['#f2a28a', '#c25c4a', '#82362c', '#30100c'], hard: ['#eadab2', '#baa67a', '#7e6e4a', '#302818'],
      semi: 'girder', spal: ['#8a92ba', '#5c6488', '#3a4060', '#181c2c'], column: 'chimney',
      deco: ['bonfire', 'aerial', 'jackolantern', 'aerial'], bg: 'fireworks', music: 'fireworks', dark: true
    },
    // 55 · the witch's tower: crooked flagstones, mossy stone blocks, iron-violet blocks, wooden shelves
    witchtower: {
      sky: ['#160c32', '#2a1852', '#3e2668'], ground: 'stone', gpal: ['#bcaccc', '#88769a', '#58486c', '#261c36'],
      brick: ['#cad2b2', '#969e82', '#5e6650', '#24281c'], hard: ['#aca4cc', '#6e6692', '#443e62', '#1a1630'],
      semi: 'bridge', spal: ['#d4a272', '#9c6a40', '#5e3c20', '#22140a'], column: 'chimney',
      deco: ['potionshelf', 'candle3', 'glowshroom6', 'candle3'], bg: 'witchtower', music: 'witchtower', dark: true
    }
  };
  // the little things on the ground (A.tiny names), what hangs beneath it, and each world's light (see art.js, light.js)
  var TINY = {
    pumpkinpatch: ['tuft', 'flowerY', 'berries', 'tuft', 'clover', 'shroom', 'tuft'],
    conkerwood: ['shroom', 'tuft', 'berries', 'pebble', 'shroom', 'moss'],
    windyhill: ['tuft', 'flowerY', 'clover', 'tuft', 'flowerW', 'tuft'],
    trickortreat: ['pebble', 'moss', 'tuft', 'pebble'],
    pumpkintown: ['pebble', 'moss', 'glowC', 'pebble'],
    graveyard: ['tuft', 'glowC', 'pebble', 'moss', 'glowP', 'tuft'],
    mansion: [],
    witchwood: ['glowP', 'glowC', 'shroom', 'tuft', 'glowC', 'moss'],
    fireworks: ['moss', 'pebble'],
    witchtower: ['pebble', 'moss', 'glowC']
  };
  var HANG = {
    pumpkinpatch: ['roots', ['#a87848', '#d8a870', '#7a5030']],
    conkerwood: ['roots', ['#8a5a36', '#c08858', '#5a3820']],
    windyhill: ['roots', ['#a27a50', '#d2aa78', '#6a4c30']],
    trickortreat: ['vines', ['#5a4a7a', '#9a84b8', '#3a2c4c']],
    pumpkintown: ['vines', ['#3a6a5a', '#6aa890', '#24403a']],
    graveyard: ['roots', ['#4a4062', '#7a6a9a', '#2a2440']],
    mansion: ['drips', ['#f2e6d4', '#ffffff', '#c8b8a6']],
    witchwood: ['vines', ['#4a3a8a', '#8a78d8', '#2a1c50']],
    fireworks: ['drips', ['#8890b8', '#c8d0f0', '#4a5070']],
    witchtower: ['chains', ['#8a80a8', '#c8c0e0', '#4a4468']]
  };
  /* The light travels with the day: low golden sunbeams on the farm, shafts
     through the canopy in the woods, then a soft dusk with pools of light
     round every lantern (and round Bonnie) as night comes on. The night
     worlds stay light enough to play: their dusk is no deeper than the
     glow wood's or the castle's. */
  var LIGHT = {
    pumpkinpatch: { rays: { col: '#ffd890', a: 0.42 }, motes: '#fff0c0' },
    conkerwood: { rays: { col: '#ffe2a0', a: 0.5 }, motes: '#ffe8b0' },
    windyhill: { rays: { col: '#ffffff', a: 0.28 }, motes: '#ffffff' },
    trickortreat: { dark: { col: '#1c0c32', a: 0.14 }, rays: { col: '#ffb070', a: 0.24 }, motes: '#ffd8b0' },
    pumpkintown: { dark: { col: '#10102c', a: 0.22 }, motes: '#c8fff0' },
    graveyard: { dark: { col: '#080c2a', a: 0.3 }, rays: { col: '#c8d8ff', a: 0.24 }, motes: '#d8f0ff' },
    mansion: { dark: { col: '#120626', a: 0.32 }, motes: '#ffe0b0' },
    witchwood: { dark: { col: '#0c0624', a: 0.34 }, motes: '#d4ff90' },
    fireworks: { dark: { col: '#0a0828', a: 0.28 }, motes: '#ffd8a0' },
    witchtower: { dark: { col: '#0e0624', a: 0.32 }, motes: '#ffd0a0' }
  };
  if (A && A.themes) Object.keys(THEMES).forEach(function (k) {
    var th = A.themes[k] = THEMES[k];
    th.tiny = TINY[k]; th.hang = HANG[k]; th.light = LIGHT[k];
  });

  var K = BB.bgKit, GEN = BB.backdropGen;
  if (!K || !GEN) return;
  var H = K.H, SW = K.SW, HP = K.HP, snap = K.snap, mix = K.mix, strip = K.strip, tallStrip = K.tallStrip, R = K.R, disc = K.disc,
    canopy = K.canopy, cloud = K.cloud, land = K.land, mist = K.mist, span = K.span, oval = K.oval, ring = K.ring,
    line = K.line, glow = K.glow, stars = K.stars, bird = K.bird, streak = K.streak, windmill = K.windmill, crescent = K.crescent,
    crater = K.crater, glowcap = K.glowcap, pad = K.pad, beam = K.beam;
  // one turn of a wave across the strip: edges built from whole turns meet at the seam
  var TAU = Math.PI * 2 / SW;
  var wv = function (x, n, ph) { return Math.sin(x * TAU * n + (ph || 0)); };

  /* ==========================================================================
     SHARED SHAPES
     ========================================================================== */
  /* A pumpkin sitting on base: three lobes, the middle one in front and
     brightest, the right one in shade, lit high on the left, a stubby
     stalk. With face, a jack-o'-lantern: lit from inside, triangle eyes and
     a big grin with a tooth — glad to see you. c = [shade, body, light, stalk] */
  var pumpkin = function (g, x, base, r, c, face) {
    var ry = r * 0.74, cy = base - ry;
    if (face) glow(g, x, cy, r * 3.2, '#ffa040', 0.9);
    oval(g, x + r * 0.08, cy + HP * 0.5, r, ry, c[0]);
    if (r > 1.6) {
      oval(g, x - r * 0.44, cy, r * 0.54, ry * 0.92, mix(c[1], c[0], 0.2));
      oval(g, x + r * 0.42, cy, r * 0.54, ry * 0.92, mix(c[1], c[0], 0.55));
      oval(g, x - r * 0.04, cy - HP * 0.5, r * 0.48, ry * 0.97, c[1]);
      oval(g, x - r * 0.56, cy - ry * 0.34, r * 0.17, ry * 0.3, c[2]);
      oval(g, x - r * 0.12, cy - ry * 0.56, r * 0.14, ry * 0.18, mix(c[1], c[2], 0.6));
    } else { oval(g, x - r * 0.04, cy - HP * 0.5, r * 0.86, ry * 0.9, c[1]); R(g, x - r * 0.6, cy - ry * 0.4, HP, HP, c[2]); }
    var sw = Math.max(HP, snap(r * 0.22)), sh = Math.max(HP * 2, r * 0.4);
    R(g, x - sw / 2, cy - ry - sh + HP, sw, sh, c[3]); R(g, x - sw / 2 + sw, cy - ry - sh + HP, Math.max(HP, sw * 0.6), HP, c[3]);
    if (!face || r < 2.4) { if (face) { R(g, x - r * 0.45, cy - ry * 0.15, HP, HP, '#fff0a0'); R(g, x + r * 0.3, cy - ry * 0.15, HP, HP, '#fff0a0'); R(g, x - r * 0.35, cy + ry * 0.3, r * 0.7, HP, '#ffe070'); } return; }
    // the face: eyes, a nose, the grin
    var F = '#ffe070', FL = '#fff8c8';
    [[-0.42, 1], [0.34, -1]].forEach(function (q) {
      var ex = x + q[0] * r, ey = cy - ry * 0.12, es = r * 0.24;
      span(g, ey - es, ey + es * 0.5, function (yy) { return ex - es * (yy - ey + es) / (es * 1.5); }, function (yy) { return ex + es * (yy - ey + es) / (es * 1.5); }, F);
      R(g, ex - HP / 2 - q[1] * HP * 0.5, ey - es * 0.2, HP, HP, FL);
    });
    var mw = r * 0.62, mt = cy + ry * 0.2;
    for (var dx = -mw; dx <= mw; dx += HP) {
      var u = dx / mw, top = mt + ry * (0.16 - 0.24 * u * u), bot = mt + ry * (0.62 - 0.64 * u * u);
      if (bot - top < HP * 0.5) continue;
      R(g, x + dx, top, HP, bot - top, F);
      if (Math.abs(u + 0.25) < 0.12) R(g, x + dx, top, HP, (bot - top) * 0.45, c[1]);
    }
    R(g, x - mw * 0.4, mt + ry * 0.38, mw * 0.5, HP, FL);
  };
  /* A little bat, round and cheeky: a fat body, two pointed ears, wings
     with a scalloped edge. s = size, open = wings up (else down) */
  var bat = function (g, x, y, s, col, open) {
    oval(g, x, y, 0.9 * s, 1.05 * s, col);
    R(g, x - 0.75 * s, y - 1.7 * s, Math.max(HP, 0.35 * s), 0.8 * s, col); R(g, x + 0.4 * s, y - 1.7 * s, Math.max(HP, 0.35 * s), 0.8 * s, col);
    [-1, 1].forEach(function (d) {
      for (var t = 0; t <= 1; t += HP / (4.2 * s)) {
        var xx = x + d * (0.6 * s + t * 3.8 * s), top = y - s * (open ? 0.4 + 1.6 * Math.sin(t * 1.9) : -0.2 + 0.9 * t), th = s * (1.25 * (1 - t) + 0.25) * (0.5 + 0.5 * Math.abs(Math.cos(t * Math.PI * 2.5)));
        R(g, xx, top, HP, Math.max(HP, th), col);
      }
    });
  };
  /* A big friendly moon: a soft halo, its rim in shade low on the right,
     grey-blue seas on its face, a few craters, and the light high on its
     left. c = [rim, body, light, seas], halo = [colour, strength] */
  var moon = function (g, x, y, r, c, halo) {
    if (halo) { glow(g, x, y, r * 3.4, halo[0], halo[1]); glow(g, x, y, r * 1.7, halo[0], halo[1] * 0.8); }
    disc(g, x + r * 0.05, y + r * 0.05, r, c[0]);
    disc(g, x - r * 0.03, y - r * 0.03, r * 0.95, c[1]);
    [[-0.3, -0.18, 0.34], [0.18, 0.28, 0.28], [0.36, -0.3, 0.2], [-0.05, 0.12, 0.18]].forEach(function (q) { g.globalAlpha = 0.55; oval(g, x + q[0] * r, y + q[1] * r, q[2] * r * 1.3, q[2] * r, c[3]); g.globalAlpha = 1; });
    [[0.42, 0.18, 0.1], [-0.5, 0.3, 0.08], [0.1, -0.5, 0.09], [-0.15, 0.55, 0.07]].forEach(function (q) { crater(g, x + q[0] * r, y + q[1] * r, Math.max(HP, q[2] * r), Math.max(HP, q[2] * r * 0.85), [c[3], c[1], c[2]]); });
    g.globalAlpha = 0.6; crescent(g, x - r * 0.04, y - r * 0.04, r * 0.92, r * 0.18, r * 0.2, r * 0.86, c[2]); g.globalAlpha = 1;
    disc(g, x - r * 0.5, y - r * 0.48, Math.max(HP, r * 0.1), c[2]);
  };
  /* A twisty tree, the Halloween kind: each bough curls more and more
     towards its end, so the tips roll up into little spirals. c = [shade,
     body, light]; turn = how far the tip curls (radians, ± for which way) */
  var twisty = function (g, x, y, len, ang, w, depth, turn, c, rnd) {
    var n = Math.max(4, Math.ceil(len / HP)), px = x, py = y, a = ang, pts = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      pts.push([px, py, Math.max(HP, w * (1 - 0.8 * t)), a]);
      a += turn * 3 * t * t / n;
      px += Math.cos(a) * len / n; py += Math.sin(a) * len / n;
    }
    pts.forEach(function (p) { R(g, p[0] - p[2] / 2 + HP * 0.5, p[1] - p[2] / 2 + HP * 0.5, p[2], p[2], c[0]); });
    pts.forEach(function (p) { R(g, p[0] - p[2] / 2, p[1] - p[2] / 2, p[2], p[2], c[1]); });
    pts.forEach(function (p) { if (p[2] > 1.2) R(g, p[0] - p[2] / 2, p[1] - p[2] / 2, HP, p[2] * 0.7, c[2]); });
    if (depth <= 0) return;
    // two boughs off each limb, one to either side, curling the other way to it
    [0.48, 0.74].forEach(function (f, k) {
      var p = pts[Math.floor(f * n)], side = (k % 2 ? 1 : -1) * (turn >= 0 ? 1 : -1);
      twisty(g, p[0], p[1], len * (0.5 + rnd() * 0.14), p[3] + side * (0.6 + rnd() * 0.3), p[2] * 0.8, depth - 1, -side * (1.8 + rnd() * 1.4) * (depth === 1 ? 1.6 : 1), c, rnd);
    });
  };
  // a tree trunk's foot, flaring out into roots on the ground at (x, base). c = [shade, body, light]
  var roots = function (g, x, base, w, c) {
    span(g, base - w * 0.9, base, function (yy) { var k = (yy - base + w * 0.9) / (w * 0.9); return x - w / 2 - k * k * w * 0.7; }, function (yy) { var k = (yy - base + w * 0.9) / (w * 0.9); return x + w / 2 + k * k * w * 0.7; }, c[1]);
    span(g, base - w * 0.9, base, function (yy) { var k = (yy - base + w * 0.9) / (w * 0.9); return x + w * 0.15 + k * k * w * 0.4; }, function (yy) { var k = (yy - base + w * 0.9) / (w * 0.9); return x + w / 2 + k * k * w * 0.7; }, c[0]);
  };
  /* Rolling farmland seen across the valley: bands of fields one behind the
     other below the edge f, each band cut into fields of their own colour —
     stubble, plough in stripes, pasture — with hedgerows along every
     boundary. depths: the bands' edges below f (wider as they come nearer);
     pick(rnd, band) gives a field: {c: [tone, stripe tone], st: stripe
     spacing (0 = none)}; hedge = [shade, body] */
  var quilt = function (g, f, depths, rnd, pick, hedge) {
    for (var b = 0; b < depths.length - 1; b++) {
      var d0 = depths[b], d1 = depths[b + 1], fields = [], x0 = 0;
      while (x0 < SW) { var w = 18 + rnd() * (26 + b * 14); if (SW - x0 - w < 12) w = SW - x0; fields.push({ x0: x0, x1: x0 + w, k: pick(rnd, b), lean: (rnd() - 0.5) * 0.8 }); x0 += w; }
      fields.forEach(function (fd) {
        for (var x = fd.x0; x < fd.x1; x += HP) {
          var y0 = snap(f(x) + d0), y1 = snap(f(x) + d1);
          R(g, x, y0, HP, y1 - y0, fd.k.c[0]);
          if (fd.k.st) for (var y = y0 + fd.k.st * 0.5; y < y1; y += fd.k.st) R(g, x, y, HP, HP, fd.k.c[1]);
        }
      });
      // the hedgerows: along the band's top, and down each boundary
      for (var x = 0; x < SW; x += HP) { var hy = f(x) + d0; R(g, x, hy - HP, HP, HP * 2 + (b > 1 ? HP : 0), hedge[1]); if (Math.sin(x * 2.7 + b) > 0.6) R(g, x, hy - HP * 2, HP, HP, hedge[1]); R(g, x, hy + HP, HP, HP, hedge[0]); }
      fields.forEach(function (fd) { for (var yy = d0; yy < d1; yy += HP) R(g, fd.x0 + fd.lean * (yy - d0), snap(f(fd.x0) + yy), HP * (b > 1 ? 2 : 1), HP, hedge[1]); });
    }
  };
  /* A round storybook tree: a clump of five leafy balls on a short trunk,
     each lit on its top left, so even a small one reads as round.
     c = [shade, body, light], t = trunk [body, light] */
  var roundTree = function (g, x, base, h, c, t) {
    var r = h * 0.36, cy = base - h + r * 1.05, tw = Math.max(HP * 2, snap(h * 0.09));
    R(g, x - tw / 2, cy, tw, base - cy, t[0]); R(g, x - tw / 2, cy, HP, base - cy, t[1]);
    var P = [[0, 0.05, 1], [-0.62, 0.32, 0.66], [0.6, 0.34, 0.68], [-0.26, -0.48, 0.6], [0.32, -0.38, 0.58]];
    P.forEach(function (p) { disc(g, x + p[0] * r + r * 0.1, cy + p[1] * r + r * 0.14, p[2] * r, c[0]); });
    P.forEach(function (p) { disc(g, x + p[0] * r, cy + p[1] * r, p[2] * r * 0.88, c[1]); });
    P.forEach(function (p) { if (p[0] < 0.4) disc(g, x + p[0] * r - p[2] * r * 0.3, cy + p[1] * r - p[2] * r * 0.32, p[2] * r * 0.4, c[2]); });
  };
  // a leaf on the wind: a little two-tone almond, turning. c = [body, light]
  var leafy = function (g, x, y, s, a, c) {
    var dx = Math.cos(a), dy = Math.sin(a);
    for (var t = -1; t <= 1; t += HP / s) { var w = (1 - t * t) * s * 0.45; R(g, x + dx * t * s - w / 2, y + dy * t * s - w / 2, Math.max(HP, w), Math.max(HP, w), c[0]); }
    R(g, x - dx * s * 0.3 - HP / 2, y - dy * s * 0.3 - HP / 2, HP, HP, c[1]);
  };

  /* ==========================================================================
     THE BACKDROPS
     ========================================================================== */

  /* ---- 46 · Pumpkin Patch ---- */
  /* A round hay bale lying in the stubble, its rolled face to us: the side
     running back into the field, the spiral of the roll, lit on the left.
     c = [shade, body, light, line] */
  var roundBale = function (g, x, base, r, c) {
    R(g, x, base - r * 2 + HP, r * 1.1, r * 2 - HP, c[0]); R(g, x, base - r * 2 + HP, r * 1.1, HP, c[2]);
    oval(g, x + r * 1.1, base - r + HP * 0.5, r * 0.42, r - HP * 0.5, c[0]);
    disc(g, x, base - r, r, c[1]);
    ring(g, x, base - r, r * 0.55, r * 0.55 + HP, c[3]); ring(g, x + HP * 0.5, base - r, r * 0.22, r * 0.22 + HP, c[3]);
    oval(g, x - r * 0.42, base - r * 1.45, r * 0.3, r * 0.22, c[2]);
  };
  // a square bale: straw in short strokes, two strings round it, lit on top. c = [shade, body, light, string]
  var bale = function (g, x, base, w, h, c) {
    R(g, x, base - h, w, h, c[1]); R(g, x, base - h, w, Math.max(HP, h * 0.22), c[2]); R(g, x + w - Math.max(HP, w * 0.12), base - h, Math.max(HP, w * 0.12), h, c[0]); R(g, x, base - HP, w, HP, c[0]);
    for (var i = 0; i < w * h / 3; i++) { var sx = x + ((i * 7.3) % w), sy = base - h + 1 + ((i * 3.7) % (h - 1.5)); R(g, sx, sy, HP, HP, i % 3 ? c[0] : c[2]); }
    R(g, x + w * 0.3, base - h, HP, h, c[3]); R(g, x + w * 0.7, base - h, HP, h, c[3]);
  };
  /* The red barn, gable end on: boards up to the gambrel roof with its
     white trim, the big doors braced with a white cross, the hayloft door
     open with hay spilling out, and its long side running back to the
     right under a weathered roof. P = {wall: [shade, body, light], roof: [shade, body], trim, hay, dark} */
  var barn = function (g, x, base, w, h, P) {
    var top = base - h, rh = w * 0.5, cx = x + w / 2, side = w * 0.62;
    var hw = function (yy) { var k = (top - yy) / rh; return k < 0.5 ? w / 2 + 0.8 - k * w * 0.42 : (w / 2 + 0.8 - 0.5 * w * 0.42) * (1 - (k - 0.5) / 0.5); };
    // the long side, going back: its wall and roof, darker
    R(g, x + w, top + 1, side, h - 1, P.wall[0]);
    for (var bx = x + w + 1.5; bx < x + w + side; bx += 1.5) R(g, bx, top + 1, HP, h - 1, mix(P.wall[0], '#000000', 0.12));
    span(g, top - rh * 0.5 - 1, top + 1, function (yy) { return cx + hw(yy) - 0.8; }, function () { return x + w + side + 0.6; }, P.roof[1]);
    span(g, top - rh + 0.5, top - rh * 0.5 - 1, function (yy) { return cx + hw(yy) - 0.8; }, function (yy) { return x + w + side - (top - rh * 0.5 - 1 - yy) * 0.2; }, P.roof[0]);
    R(g, x + w, top - rh * 0.5 - 1, side, HP, mix(P.roof[1], '#ffffff', 0.25));
    for (bx = x + w + 3; bx < x + w + side; bx += 3) R(g, bx, top - rh * 0.5 - 0.5, HP, rh * 0.5 + 1, mix(P.roof[1], P.roof[0], 0.5));
    // the gable end
    R(g, x, top, w, h, P.wall[1]);
    span(g, top - rh, top, function (yy) { return cx - hw(yy) + 0.8; }, function (yy) { return cx + hw(yy) - 0.8; }, P.wall[1]);
    for (bx = x + 1.5; bx < x + w; bx += 1.5) R(g, bx, top - rh * (1 - Math.abs(bx - cx) / (w / 2)) * 0.95, HP, h + rh, mix(P.wall[1], P.wall[0], 0.35));
    R(g, x, top - rh * 0.4, HP, h + rh * 0.4, P.wall[2]);
    R(g, x + w - 1, top, 1, h, P.wall[0]);
    // the white trim along the roof line
    for (var yy = top - rh; yy < top; yy += HP) { R(g, cx - hw(yy), yy, 1, HP, P.trim); R(g, cx + hw(yy) - 1, yy, 1, HP, P.trim); }
    R(g, cx - 1.5, top - rh, 3, HP, P.trim);
    // the hayloft door, open, hay spilling over its sill
    var lw = w * 0.22, ly = top - rh * 0.42;
    R(g, cx - lw / 2 - HP, ly - HP, lw + HP * 2, lw * 1.1 + HP * 2, P.trim); R(g, cx - lw / 2, ly, lw, lw * 1.1, P.dark);
    oval(g, cx, ly + lw * 1.1, lw * 0.55, lw * 0.35, P.hay[1]); R(g, cx - lw * 0.4, ly + lw * 0.8, lw * 0.3, HP, P.hay[2]);
    // the big doors: white frames braced with a cross
    var dw = w * 0.36, dh = h * 0.7;
    [cx - dw - 0.2, cx + 0.2].forEach(function (dx) {
      R(g, dx, base - dh, dw, dh, mix(P.wall[1], P.wall[0], 0.25));
      R(g, dx, base - dh, dw, 0.8, P.trim); R(g, dx, base - 0.8, dw, 0.8, P.trim); R(g, dx, base - dh, 0.8, dh, P.trim); R(g, dx + dw - 0.8, base - dh, 0.8, dh, P.trim);
      line(g, dx + 0.4, base - dh + 0.4, dx + dw - 0.8, base - 0.8, HP * 1.5, P.trim); line(g, dx + dw - 0.8, base - dh + 0.4, dx + 0.4, base - 0.8, HP * 1.5, P.trim);
    });
    R(g, x - 0.5, top - HP, w + 1, 1, P.trim);
  };
  // a silo: a tall drum in bands, a domed cap, a ladder up its side. c = [shade, body, light, cap]
  var silo = function (g, x, base, r, h, c) {
    R(g, x - r, base - h, r * 2, h, c[1]); R(g, x + r * 0.35, base - h, r * 0.65, h, c[0]); R(g, x - r, base - h, Math.max(HP, r * 0.3), h, c[2]);
    for (var y = base - h + 3; y < base; y += 3) R(g, x - r, y, r * 2, HP, mix(c[1], c[0], 0.5));
    oval(g, x, base - h, r + 0.3, r * 0.8, c[3], true); oval(g, x - r * 0.35, base - h - r * 0.4, r * 0.3, r * 0.2, mix(c[3], '#ffffff', 0.4));
    for (y = base - h + 1; y < base - 1; y += 1.5) R(g, x + r * 0.55, y, r * 0.3, HP, c[0]);
  };
  // a farmhouse: cream walls, a slate roof, a chimney with a curl of smoke, warm windows
  var farmhouse = function (g, x, base, w, h, P) {
    var top = base - h, rh = w * 0.32;
    R(g, x, top, w, h, P.wall[1]); R(g, x + w - 1.5, top, 1.5, h, P.wall[0]); R(g, x, top, HP, h, P.wall[2]);
    R(g, x + w * 0.72, top - rh - 3, 2.5, rh + 2, P.chim); R(g, x + w * 0.72 - 0.4, top - rh - 3.5, 3.3, 1, mix(P.chim, '#ffffff', 0.25));
    span(g, top - rh, top + 0.5, function (yy) { return x - 1 + (top - yy) * 1.4; }, function (yy) { return x + w + 1 - (top - yy) * 1.4; }, P.roof[1]);
    span(g, top - rh, top + 0.5, function (yy) { return x + w + 1 - (top - yy) * 1.4 - 2; }, function (yy) { return x + w + 1 - (top - yy) * 1.4; }, P.roof[0]);
    R(g, x - 1, top, w + 2, HP, P.roof[0]);
    for (var wx = x + 2.5; wx < x + w - 3; wx += 5) { R(g, wx, top + 2.5, 2.5, 2.5, P.win); R(g, wx, top + 2.5, HP, 2.5, mix(P.win, '#ffffff', 0.5)); }
    R(g, x + w * 0.42, base - 4.5, 2.5, 4.5, P.door);
    for (var i = 0; i < 7; i++) { g.globalAlpha = 0.5 - i * 0.06; disc(g, x + w * 0.72 + 1.2 + Math.sin(i * 0.9) * 1.6 + i * 1.2, top - rh - 5 - i * 2.2, 0.9 + i * 0.25, P.smoke); }
    g.globalAlpha = 1;
  };
  // a scarecrow on his pole: a straw hat, a turnip face, arms out in a patched coat
  var scarecrow = function (g, x, base, s, tone) {
    R(g, x - HP / 2, base - 12 * s, Math.max(HP, s * 0.6), 12 * s, tone('#7a5232'));
    R(g, x - 5 * s, base - 9 * s, 10 * s, Math.max(HP, s * 0.6), tone('#7a5232'));
    span(g, base - 9.5 * s, base - 4 * s, function (yy) { return x - 2.4 * s - (yy - base + 9.5 * s) * 0.15; }, function (yy) { return x + 2.4 * s + (yy - base + 9.5 * s) * 0.15; }, tone('#4a7ab0'));
    R(g, x - 5 * s, base - 9.5 * s, 3 * s, 1.4 * s, tone('#4a7ab0')); R(g, x + 2 * s, base - 9.5 * s, 3 * s, 1.4 * s, tone('#4a7ab0'));
    R(g, x + 0.5 * s, base - 7 * s, 1.2 * s, 1.2 * s, tone('#e85a4a'));
    [-5.4, 5].forEach(function (d) { R(g, x + d * s, base - 9 * s, 0.6 * s, 1.6 * s, tone('#f0cc60')); });
    disc(g, x, base - 11 * s, 1.4 * s, tone('#f4e0b0'));
    R(g, x - 2.6 * s, base - 12.2 * s, 5.2 * s, Math.max(HP, 0.6 * s), tone('#e0b048')); oval(g, x, base - 12.2 * s, 1.5 * s, 1.3 * s, tone('#e0b048'), true);
    R(g, x - 1.5 * s, base - 12.6 * s, 3 * s, HP, tone('#c04a3a'));
  };

  GEN.pumpkinpatch = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A golden afternoon: the sun sinking big and warm over the fields, the
       light going honey-coloured near the ground, clouds lit gold and pink
       from beneath, and geese going over in a long V. */
    var far = strip(), g = far.getContext('2d');
    for (y = 34; y < 104; y += 1) { g.globalAlpha = 0.3 * Math.pow((y - 34) / 70, 1.5); R(g, 0, y, SW, 1, '#ffd890'); }
    g.globalAlpha = 1;
    var SX = 186, SY = 74;
    [[3.6, 0.05], [2.6, 0.08], [1.9, 0.12], [1.4, 0.2]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, SX, SY, 12 * q[0], '#fff0b8'); });
    g.globalAlpha = 1;
    disc(g, SX, SY, 12, '#ffbe58'); disc(g, SX - 0.6, SY - 0.8, 10.8, '#ffd27a'); disc(g, SX - 3.4, SY - 3.8, 5, '#fff2c4');
    var CB = [hm('#e8a8a0', 0.1), hm('#fff2e2', 0.05), '#ffffff'];
    [[30, 26, 0.95], [262, 16, 0.75], [356, 34, 0.55], [446, 22, 0.85]].forEach(function (q) { cloud(g, q[0] + rnd() * 10, q[1], q[2], CB); });
    for (i = 0; i < 9; i++) { x = rnd() * SW; var near = Math.abs(((x - SX + SW * 1.5) % SW) - SW / 2) < 80; streak(g, x, 44 + rnd() * 34, 40 + rnd() * 70, 1.4 + rnd() * 1.8, [hm('#d898a8', 0.25), hm(near ? '#ffd0a0' : '#f8c8b8', 0.2), near ? '#fff4c8' : '#ffe8d0'], true); }
    // the geese: a long V, and two stragglers
    [[96, 30], [100, 28], [104, 26.5], [108, 25], [112, 24], [101, 32.5], [105.5, 35], [110, 37.5], [122, 22], [127, 24]].forEach(function (q) { bird(g, q[0], q[1], hm('#6a4a5a', 0.35)); });
    L.push({ c: far, f: 0.03 });

    /* The downs across the valley: rolling and soft in the gold haze, a
       quilt of stubble, plough and pasture with hedgerows between, little
       copses gone russet, a church-less hamlet. */
    var dn = strip(), d = dn.getContext('2d');
    var df = function (xx) { return 90 + wv(xx, 2, 0.8) * 5 + wv(xx, 5, 2.1) * 2; };
    land(d, df, [hm('#a49a68', 0.55), hm('#b8b070', 0.55), hm('#e8dca0', 0.45)], 4);
    quilt(d, df, [0, 3, 7, 13, 24], rnd, function (r) {
      var k = r();
      return k < 0.35 ? { c: [hm('#e2c46a', 0.5), hm('#f0d88a', 0.45)], st: 1.5 } : k < 0.6 ? { c: [hm('#a87a52', 0.5), hm('#8a5e3e', 0.5)], st: 1 } : k < 0.85 ? { c: [hm('#8aa858', 0.5), hm('#9ab860', 0.5)], st: 0 } : { c: [hm('#c8a050', 0.5), hm('#b88a40', 0.5)], st: 2 };
    }, [hm('#6a7038', 0.5), hm('#7c8a40', 0.5)]);
    // copses along the hedgerows, and a hamlet of white cottages tucked in a fold
    for (i = 0; i < 26; i++) {
      x = (i * 19.7 + rnd() * 12) % SW; y = df(x) + [0, 3, 7, 13][i % 4] + 0.5;
      roundTree(d, x, y, 3.5 + (i % 4) * 0.9 + rnd(), [hm(['#8a4a2a', '#9a6a28', '#5a6a30', '#a85a24'][i % 4], 0.5), hm(['#c0703a', '#d0a040', '#7a8a3a', '#d8802c'][i % 4], 0.5), hm(['#e8a060', '#f0d070', '#a8b860', '#ffb860'][i % 4], 0.45)], [hm('#5a4030', 0.5), hm('#8a6a50', 0.5)]);
    }
    [[404, 2], [410, 3], [417, 1.5], [423, 2.5]].forEach(function (q) {
      var bx = q[0], by = df(bx) + 4 + q[1];
      R(d, bx, by - 3, 4.5, 3, hm('#fff8ec', 0.4)); R(d, bx + 3.5, by - 3, 1, 3, hm('#d8c8c0', 0.4));
      span(d, by - 5, by - 3, function (yy) { return bx - 0.5 + (by - 3 - yy) * 0.8; }, function (yy) { return bx + 5 - (by - 3 - yy) * 0.8; }, hm(q[1] > 2 ? '#a84a3a' : '#6a6a7a', 0.4));
      R(d, bx + 1, by - 2, 1, 1, hm('#8a7a6a', 0.4));
    });
    mist(d, 92, 30, hz);
    L.push({ c: dn, f: 0.055 });

    /* The farm: the red barn and its silo, the farmhouse with smoke going
       up, a field of pumpkins in rows, round bales in the stubble, a
       scarecrow keeping watch, hedgerows of russet and gold. */
    var fm = strip(), m = fm.getContext('2d');
    var mf = function (xx) { return 104 + wv(xx, 2, 2.2) * 2.5 + wv(xx, 3, 0.6) * 1.5; };
    land(m, mf, [hm('#7a8a3a', 0.3), hm('#94a444', 0.3), hm('#c8d070', 0.25)], 30);
    // the fields, in stripes running along the slope
    var FLD = [[0, 96, 'stub'], [96, 200, 'pumpkins'], [200, 300, 'plough'], [300, 384, 'stub'], [384, 512, 'pumpkins']];
    FLD.forEach(function (q) {
      var C2 = q[2] === 'stub' ? [hm('#d4aa4c', 0.22), hm('#e8c86a', 0.22)] : q[2] === 'plough' ? [hm('#7a4c30', 0.22), hm('#9a6a44', 0.22)] : [hm('#3e6a2c', 0.22), hm('#4e7a34', 0.22)];
      for (x = q[0]; x < q[1]; x += HP) {
        // the rows widen as they come nearer
        for (var top = snap(mf(x) + 2), k = 0, yy = top; yy < H; k++) { var sh = snap(Math.max(HP, 0.5 + (yy - top) * 0.09)); R(m, x, yy, HP, sh, C2[k % 2]); yy += sh; }
      }
    });
    // the pumpkins in their rows
    FLD.forEach(function (q) {
      if (q[2] !== 'pumpkins') return;
      for (var row = 0; row < 6; row++) for (x = q[0] + 3 + (row % 2) * 2.5; x < q[1] - 3; x += 4 + rnd() * 3) {
        var py = mf(x) + 4 + row * (2.4 + row * 0.5), pr = 0.9 + row * 0.25 + rnd() * 0.4;
        if (rnd() < 0.3) continue;
        pumpkin(m, x, py, pr, [hm('#c45a1c', 0.2), hm('#f28a2a', 0.2), hm('#ffc070', 0.15), hm('#5a6a2a', 0.2)]);
      }
    });
    // round bales in the stubble
    [[18, 6], [44, 9], [70, 5], [318, 7], [350, 10]].forEach(function (q) { roundBale(m, q[0], mf(q[0]) + q[1], 2.2 + q[1] * 0.12, [hm('#b88a34', 0.2), hm('#e8bc58', 0.2), hm('#fff0a0', 0.15), hm('#a87a2c', 0.2)]); });
    // hedgerows with their trees, gone russet, gold and orange
    var TP = [[hm('#8a3a22', 0.25), hm('#c0582c', 0.25), hm('#f09058', 0.2)], [hm('#a87018', 0.25), hm('#e0a830', 0.25), hm('#fff090', 0.2)], [hm('#b0501a', 0.25), hm('#e8822c', 0.25), hm('#ffc070', 0.2)], [hm('#4a6a2a', 0.25), hm('#6e8e34', 0.25), hm('#b4c864', 0.2)]];
    for (x = 0; x < SW; x += 2.2 + rnd() * 1.6) {
      if (x > 112 && x < 182) continue;
      var hy = mf(x) + 1.5, hc = TP[(x * 7 | 0) % 7 === 0 ? 3 : 2];
      disc(m, x + 0.3, hy + 0.4, 1.8, hm('#4a5a24', 0.25)); disc(m, x, hy, 1.6, hm('#6a7a30', 0.25)); if (rnd() < 0.4) R(m, x - 0.6, hy - 1, HP, HP, hc[2]);
    }
    [[8, 14], [20, 10], [58, 12], [92, 16], [196, 12], [226, 15], [238, 10], [290, 13], [392, 17], [420, 12], [432, 9], [476, 14], [500, 11]].forEach(function (q, qi) {
      var tx = q[0] + rnd() * 4, ty = mf(tx) + 2;
      roundTree(m, tx, ty, q[1], TP[qi % 4], [hm('#5a3a2a', 0.25), hm('#8a6a4a', 0.25)]);
    });
    // a little red tractor bringing a trailer of pumpkins down the lane
    var TX = 214, TY = mf(214) + 9, TT = function (c) { return hm(c, 0.2); };
    R(m, TX - 13, TY - 4, 10, 3, TT('#8a6a4a')); R(m, TX - 13, TY - 4, 10, HP, TT('#c8a070'));
    [[-11.5, 1], [-8.5, 1.3], [-5.6, 1.1], [-10, 1.1]].forEach(function (p, pi) { pumpkin(m, TX + p[0], TY - 3.6 - (pi === 3 ? 1.4 : 0), p[1], [TT('#c45a1c'), TT('#f28a2a'), TT('#ffc070'), TT('#5a6a2a')]); });
    disc(m, TX - 11, TY - 0.6, 1, TT('#2a2a2a')); disc(m, TX - 5.5, TY - 0.6, 1, TT('#2a2a2a'));
    R(m, TX - 3, TY - 2.5, 1.5, HP, TT('#3a3a3a'));
    R(m, TX - 1.5, TY - 5, 6, 3.4, TT('#d83a2a')); R(m, TX - 1.5, TY - 5, 6, HP, TT('#ff7a5a')); R(m, TX + 2.5, TY - 6.5, 3, 5, TT('#d83a2a'));
    R(m, TX + 2.8, TY - 8.5, 2.6, 2, TT('#bfe4f0')); R(m, TX + 2.5, TY - 9, 3.2, HP, TT('#3a3a3a')); R(m, TX - HP, TY - 7.5, HP, 2.5, TT('#3a3a3a'));
    disc(m, TX + 3.6, TY - 1.6, 2.2, TT('#2a2a2a')); disc(m, TX + 3.6, TY - 1.6, 1, TT('#ffc040')); disc(m, TX - 0.5, TY - 0.9, 1.3, TT('#2a2a2a')); disc(m, TX - 0.5, TY - 0.9, 0.5, TT('#ffc040'));
    farmhouse(m, 70, mf(76) + 1, 20, 10, { wall: [hm('#c8b098', 0.25), hm('#f4e2c4', 0.25), hm('#fff6e4', 0.2)], roof: [hm('#4a4a5a', 0.25), hm('#6a6a7c', 0.25)], chim: hm('#9a5a44', 0.25), win: hm('#ffe2a0', 0.2), door: hm('#3a6a5a', 0.25), smoke: hm('#f4ece4', 0.3) });
    barn(m, 132, mf(140) + 1.5, 22, 13, { wall: [hm('#7a2020', 0.22), hm('#c43a30', 0.22), hm('#f07a60', 0.18)], roof: [hm('#4a4044', 0.22), hm('#6a5a5c', 0.22)], trim: hm('#fff6ec', 0.15), hay: [hm('#b08a30', 0.2), hm('#f0c860', 0.2), hm('#fff0a0', 0.15)], dark: hm('#3a1a1a', 0.22) });
    silo(m, 124, mf(124) + 1.5, 4, 26, [hm('#8a8e9a', 0.22), hm('#c8ccd4', 0.22), hm('#f4f6fa', 0.18), hm('#a83a30', 0.2)]);
    scarecrow(m, 262, mf(262) + 6, 0.9, function (c) { return hm(c, 0.22); });
    L.push({ c: fm, f: 0.11 });

    /* In front: the patch itself — big pumpkins among their broad leaves and
       curling vines, corn shocks tied in bundles, a stack of square bales,
       a split-rail fence, fallen leaves. Kept low, so the play stays clear. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + wv(xx, 3, 1.3) * 2 + wv(xx, 7, 0.2) * 0.8; };
    land(n, nf, ['#3e5a24', '#567a2c', '#8eae48'], 6);
    // the split-rail fence, behind the patch
    [[150, 236], [404, 480]].forEach(function (q) {
      for (x = q[0]; x <= q[1]; x += 14) { y = nf(x); R(n, x - 0.75, y - 11, 1.5, 11, '#7a5434'); R(n, x - 0.75, y - 11, HP, 11, '#b08458'); R(n, x - 1, y - 11.5, 2, HP, '#c8a070'); }
      [[-9, 1.2], [-4.5, 1.2]].forEach(function (rl) { for (x = q[0]; x < q[1]; x += HP) { y = nf(x) + rl[0] + Math.sin((x - q[0]) * 0.45) * 0.3; R(n, x, y, HP, rl[1], '#946a44'); R(n, x, y, HP, HP, '#c8a070'); R(n, x, y + rl[1] - HP, HP, HP, '#5a3c24'); } });
    });
    // corn shocks: dry stalks bundled into tents, tied at the waist
    [[118, 22], [380, 20], [494, 18]].forEach(function (q) {
      var cx2 = q[0], cb = nf(cx2) + 2, ch = q[1];
      for (var s2 = -1; s2 <= 1; s2 += 0.09) {
        var bx2 = cx2 + s2 * ch * 0.34, tx2 = cx2 + s2 * 1.4 + Math.sin(s2 * 9) * 0.6, col2 = s2 < -0.4 ? '#f8e098' : s2 < 0.35 ? '#dcb460' : '#a8803c';
        line(n, bx2, cb, tx2, cb - ch, HP, col2);
      }
      for (s2 = 0; s2 < 9; s2++) { var a2 = -Math.PI / 2 + (s2 - 4) * 0.28, l2 = 3 + (s2 % 3); line(n, cx2 + Math.cos(a2) * 0.5, cb - ch + 1, cx2 + Math.cos(a2) * l2, cb - ch + 1 + Math.sin(a2) * l2 * 0.8, HP, s2 % 2 ? '#e8c878' : '#c09848'); }
      R(n, cx2 - 2.4, cb - ch * 0.62, 4.8, 1, '#8a5a30');
      [[-3.2, 2.2], [3.6, 1.8]].forEach(function (p) { pumpkin(n, cx2 + p[0] * 1.6, cb + 1, p[1] + 0.6, ['#b0481a', '#ee7a24', '#ffb85a', '#5a6a2a']); });
    });
    // a stack of square bales
    var BL = ['#b88a34', '#e8bc58', '#fff0a0', '#a07028'];
    bale(n, 300, nf(300) + 2, 10, 5, BL); bale(n, 311, nf(311) + 2, 10, 5, BL); bale(n, 305, nf(305) - 3, 10, 5, BL);
    // the vines: big leaves in clumps, tendrils curling, and the pumpkins
    var VL = ['#2a4a1e', '#3e6a28', '#6e9a3c'];
    for (i = 0; i < 26; i++) { x = i * 19.7 + rnd() * 8; pad(n, x, nf(x) + 1, 5 + rnd() * 4, 2.2, 1.6, rnd, VL); }
    for (i = 0; i < 18; i++) { x = rnd() * SW; y = nf(x) - 1; for (var t = 0; t < 1; t += 0.05) R(n, x + t * 5 + Math.cos(t * 9) * 1.2, y - Math.sin(t * 9) * 1.2 - t * 1.5, HP, HP, '#7ea848'); }
    var PC = [['#b0481a', '#ee7a24', '#ffb85a', '#5a6a2a'], ['#c0601c', '#f8962e', '#ffc878', '#4a5a24'], ['#a03c18', '#de6a20', '#ffa850', '#5a6a2a']];
    [[24, 5], [46, 3], [76, 4.2], [138, 3.4], [196, 5.6], [214, 3], [262, 4.4], [336, 3.2], [352, 5], [430, 4], [452, 2.8], [470, 4.8]].forEach(function (q, qi) { pumpkin(n, q[0] + rnd() * 4, nf(q[0]) + 2.5, q[1], PC[qi % 3]); });
    // a little pale one and a warty green one, the way every patch has
    pumpkin(n, 98, nf(98) + 3.5, 2.8, ['#c8b8a0', '#f4eee0', '#ffffff', '#5a6a2a']);
    pumpkin(n, 286, nf(286) + 3.5, 2.6, ['#4a6a2a', '#7a9a3a', '#b8d070', '#5a4a2a']);
    // fallen leaves
    for (i = 0; i < 70; i++) { x = rnd() * SW; y = nf(x) + 1 + rnd() * 5; R(n, x, y, 1, HP, ['#e8682a', '#f8b030', '#c03a24', '#ffd060'][i % 4]); }
    L.push({ c: nr, f: 0.24 });
    return L;
  };

  /* ---- 47 · Conker Woods ---- */
  // the autumn leaves, [shade, body, light]: gold, orange, red, russet, and a few still green
  var AUT = [['#b0801c', '#ecbc3c', '#fff094'], ['#bc561c', '#ee8a2c', '#ffc272'], ['#962a1c', '#d4482a', '#ff8a5c'], ['#78381c', '#ac602c', '#e09252'], ['#6a7a2a', '#a2a838', '#d8d872']];
  /* A tree trunk from base up to top (off the top of the screen, often),
     tapering, leaning a little, the bark in long grooves, lit on its left.
     c = [shade, body, light, groove] */
  var trunk = function (g, x, top, base, w, lean, c) {
    for (var y = top; y < base; y += HP) {
      var k = (base - y) / (base - top), ww = w * (1 - k * 0.3), xx = x + lean * k * k * (base - top), l = snap(xx - ww / 2);
      R(g, l, y, ww, HP, c[1]); R(g, l + ww * 0.62, y, ww * 0.38, HP, c[0]); R(g, l, y, Math.max(HP, ww * 0.16), HP, c[2]);
      if (ww > 3) for (var gx = 0.3; gx < 0.9; gx += 0.22) if (Math.sin(y * 0.7 + gx * 20 + x) > -0.4) R(g, l + ww * gx, y, HP, HP, c[3]);
    }
  };
  // a horizontal band of mist: thickest in its middle, fading above and below
  var haze = function (g, y, h, col, a) {
    for (var i = 0; i < h; i += HP) { g.globalAlpha = a * Math.sin(Math.PI * i / h); R(g, 0, y + i, SW, HP, col); }
    g.globalAlpha = 1;
  };
  /* A spiny conker case on the ground, split open, the shiny conker inside
     peeping out. s = size */
  var conker = function (g, x, base, s) {
    var cy = base - s;
    disc(g, x + 0.2, cy + 0.2, s, '#5a7a2a'); disc(g, x, cy, s * 0.9, '#8ab040'); disc(g, x - s * 0.3, cy - s * 0.35, s * 0.35, '#c8e070');
    for (var a = 0; a < 6.28; a += 0.7) R(g, x + Math.cos(a) * s * 1.05, cy + Math.sin(a) * s * 1.05, HP, HP, '#4a6a22');
    span(g, cy - s * 0.4, cy + s * 0.8, function (yy) { return x + s * 0.1 - (yy - cy + s * 0.4) * 0.15; }, function (yy) { return x + s * 0.1 + (yy - cy + s * 0.4) * 0.5; }, '#f4f0d8');
    disc(g, x + s * 0.55, cy + s * 0.2, s * 0.62, '#6a2a12'); disc(g, x + s * 0.5, cy + s * 0.15, s * 0.5, '#9a4a20'); R(g, x + s * 0.3, cy - s * 0.1, HP, HP, '#ffd0a0');
  };
  // a toadstool: a red cap with white spots on a pale stalk. s = size
  var toadstool = function (g, x, base, s) {
    R(g, x - s * 0.25, base - s * 1.4, s * 0.5, s * 1.4, '#f4ecdc'); R(g, x + s * 0.05, base - s * 1.4, s * 0.2, s * 1.4, '#d0c4b0');
    oval(g, x + 0.2, base - s * 1.35, s, s * 0.75, '#9a1a1a', true); oval(g, x, base - s * 1.4, s * 0.92, s * 0.7, '#e03a2a', true);
    [[-0.5, -0.3], [0.1, -0.55], [0.5, -0.2]].forEach(function (q) { R(g, x + q[0] * s, base - s * 1.4 + q[1] * s, Math.max(HP, s * 0.22), Math.max(HP, s * 0.18), '#ffffff'); });
  };
  // a heap of fallen leaves: a low mound, speckled in every autumn colour
  var leafPile = function (g, x, base, w, h, rnd) {
    oval(g, x + 0.4, base, w, h, '#6a2e16', true); oval(g, x, base, w * 0.95, h * 0.94, '#a8501e', true);
    for (var i = 0; i < w * h * 1.6; i++) { var u = rnd() * 2 - 1, v = rnd(); if (v > Math.sqrt(1 - u * u)) continue; var lc = AUT[Math.floor(rnd() * 4)]; R(g, x + u * w * 0.92, base - v * h * 0.92, 1, HP, u < 0.2 && v > 0.5 ? lc[2] : lc[1]); }
  };
  /* A tree's crown seen from beneath the canopy: a broad, uneven mass of
     leaf, light on its top left, a few clumps hanging lower and the sky
     showing through the gaps. c = [shade, body, light, sparkle] */
  var crown = function (g, x, y, w, h, rnd, c) {
    canopy(g, x, y, w, h, rnd, c);
    for (var i = 0; i < 3; i++) { var hx = x + (rnd() - 0.5) * w * 1.4; canopy(g, hx, y + h * (0.7 + rnd() * 0.5), w * 0.22, h * 0.3, rnd, c); }
  };

  GEN.conkerwood = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* High up, the sun pouring in through the canopy: a great soft glow,
       a little blue sky between the leaves. */
    var far = strip(), g = far.getContext('2d');
    glow(g, 132, 2, 90, '#fff8dc', 0.95); glow(g, 132, 2, 40, '#ffffff', 0.8);
    for (i = 0; i < 4; i++) streak(g, 200 + i * 70 + rnd() * 20, 14 + rnd() * 20, 40 + rnd() * 30, 1.2 + rnd(), [hm('#e0c8b0', 0.3), hm('#fff4e8', 0.2), '#ffffff']);
    L.push({ c: far, f: 0.02 });

    /* The far wood, soft as a dream in the gold mist: pale trunks, crowns
       melting together, everything the colour of the light. */
    var fw = strip(), w = fw.getContext('2d');
    var FT = [hm('#c89a80', 0.62), hm('#d8ae90', 0.62), hm('#f0d0b0', 0.55), hm('#c09078', 0.62)];
    var ft = [];
    for (x = 4; x < SW - 4; x += 7 + rnd() * 16) ft.push([x, 1 + rnd() * 1.6, 2 + rnd() * 26]);
    ft.forEach(function (q) { trunk(w, q[0], q[2], 108, q[1], (rnd() - 0.5) * 0.04, FT); });
    ft.forEach(function (q, qi) { var cc = AUT[qi % 4]; crown(w, q[0], q[2] - 2, 8 + rnd() * 8, 5 + rnd() * 5, rnd, [hm(cc[0], 0.62), hm(cc[1], 0.6), hm(cc[2], 0.55)]); });
    land(w, function (xx) { return 104 + wv(xx, 3, 0.4) * 2 + wv(xx, 7, 1) * 1; }, [hm('#c89070', 0.6), hm('#dca880', 0.6), hm('#f0c8a0', 0.55)], 8);
    for (i = 0; i < 22; i++) { x = rnd() * SW; pad(w, x, 104, 6 + rnd() * 7, 3 + rnd() * 2, 1.8, rnd, [hm(AUT[i % 4][0], 0.6), hm(AUT[i % 4][1], 0.58), hm(AUT[i % 4][2], 0.52)]); }
    [[60, 10], [230, 14], [420, 9]].forEach(function (q) { beam(w, q[0], -6, q[0] + 64, 120, q[1] * 0.4, q[1], '#fff6d8', 0.7); });
    haze(w, 40, 60, hz, 0.4); mist(w, 84, 30, hz);
    L.push({ c: fw, f: 0.045 });

    /* The middle of the wood: grey trunks going up into gold and red, young
       trees gone every colour at once, the low sun slanting through in long
       shafts, a mist lying in the hollows. */
    var mw = strip(), m = mw.getContext('2d');
    var MT = [hm('#7a6458', 0.32), hm('#9a8274', 0.32), hm('#cab4a0', 0.28), hm('#6a5448', 0.32)];
    var mf = function (xx) { return 112 + wv(xx, 2, 1.6) * 2.5 + wv(xx, 5, 0.3) * 1.2; };
    var mt = [];
    for (x = 10; x < SW - 10; x += 20 + rnd() * 26) mt.push([x, 2 + rnd() * 1.8, -4 + rnd() * 20]);
    mt.forEach(function (q) { trunk(m, q[0], q[2], mf(q[0]) + 2, q[1], (rnd() - 0.5) * 0.06, MT); });
    mt.forEach(function (q, qi) { var c2 = AUT[(qi * 3) % 5]; crown(m, q[0], q[2] - 1, 12 + rnd() * 8, 7 + rnd() * 5, rnd, [hm(c2[0], 0.32), hm(c2[1], 0.3), hm(c2[2], 0.26)]); });
    land(m, mf, [hm('#8a5034', 0.32), hm('#b06a3c', 0.32), hm('#e09a5c', 0.28)], 6);
    for (i = 0; i < 13; i++) { x = i * 39 + rnd() * 18; var c3 = AUT[i % 5], yh = 18 + rnd() * 14, YT = [hm('#5e4a40', 0.24), hm('#806a5c', 0.24), hm('#b8a090', 0.2), hm('#4e3c34', 0.24)]; trunk(m, x, mf(x) - yh + 2, mf(x) + 2, 2.2, 0, YT); line(m, x, mf(x) - yh + 6, x - 4, mf(x) - yh - 1, HP * 2, YT[1]); line(m, x + 0.5, mf(x) - yh + 4, x + 4, mf(x) - yh - 2, HP * 2, YT[0]); crown(m, x, mf(x) - yh - 2, 6 + yh * 0.22, 4 + yh * 0.16, rnd, [hm(c3[0], 0.24), hm(c3[1], 0.22), hm(c3[2], 0.18)]); }
    for (i = 0; i < 60; i++) { x = rnd() * SW; y = mf(x) + 1 + rnd() * 6; R(m, x, y, 1, HP, hm(AUT[i % 4][2], 0.3)); }
    haze(m, 94, 24, hz, 0.5);
    // the shafts of sunlight, slanting down from the top left
    [[30, 18], [120, 26], [176, 12], [300, 22], [392, 30], [470, 14]].forEach(function (q) { beam(m, q[0], -6, q[0] + 70, 124, q[1] * 0.4, q[1], '#fff2c8', 0.95); });
    L.push({ c: mw, f: 0.085 });

    /* Nearer: the great horse chestnuts, their trunks broad and lit gold on
       one side, forking up into a roof of orange overhead, ferns gone bronze
       and heaps of leaves at their feet. */
    var cw = strip(), c = cw.getContext('2d');
    var cf = function (xx) { return 117 + wv(xx, 3, 2.4) * 1.6 + wv(xx, 6, 0.8) * 0.8; };
    var CT = ['#4e3a30', '#7a6050', '#c8a680', '#3e2c24'];
    var big = [[40, 6.5, 0.02], [196, 8, -0.03], [330, 5.5, 0.04], [446, 7, -0.02]];
    big.forEach(function (q) {
      trunk(c, q[0], 30, cf(q[0]) + 3, q[1], q[2], CT);
      roots(c, q[0], cf(q[0]) + 3, q[1], CT);
      // the fork: two great limbs going up into the crown
      [[-1, 0.5], [1, 0.42]].forEach(function (lb) {
        for (var t = 0; t < 1; t += HP / 34) { var lx = q[0] + q[2] * 80 + lb[0] * (t * 14 + t * t * 6), ly = 31 - t * 34, lw = q[1] * lb[1] * (1 - t * 0.5); R(c, lx - lw / 2, ly, lw, HP, CT[1]); R(c, lx - lw / 2, ly, Math.max(HP, lw * 0.2), HP, CT[2]); R(c, lx + lw * 0.2, ly, lw * 0.3, HP, CT[0]); }
      });
    });
    big.forEach(function (q, qi) {
      var cx = q[0] + q[2] * 80;
      [[-14, 2, 20, 11], [12, -2, 22, 12], [-2, 12, 14, 7], [26, 10, 10, 6], [-28, 10, 9, 6]].forEach(function (p, pi) { var c4 = AUT[(qi + pi) % 4]; crown(c, cx + p[0], p[1], p[2], p[3], rnd, [c4[0], c4[1], c4[2], mix(c4[2], '#ffffff', 0.4)]); });
    });
    land(c, cf, ['#5a2e1a', '#8a4626', '#c46a34'], 5);
    for (i = 0; i < 14; i++) { x = i * 37 + rnd() * 20; pad(c, x, cf(x) + 0.5, 4 + rnd() * 3, 2.2 + rnd(), 1.1, rnd, AUT[(i * 3 + 1) % 4]); }
    [[70, 9, 3], [150, 7, 2.4], [262, 10, 3.2], [380, 8, 2.6], [500, 7, 2.2]].forEach(function (q) { leafPile(c, q[0], cf(q[0]) + 2, q[1], q[2], rnd); });
    for (i = 0; i < 90; i++) { x = rnd() * SW; y = cf(x) + 1 + rnd() * 8; R(c, x, y, 1, HP, AUT[i % 4][rnd() > 0.5 ? 1 : 2]); }
    L.push({ c: cw, f: 0.15 });

    /* In front: a bank of leaves, conker cases split open on it with the
       conkers shining, toadstools, and leaves drifting down everywhere. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 122 + wv(xx, 3, 0.9) * 1.8 + wv(xx, 8, 2) * 0.7; };
    land(n, nf, ['#4a2414', '#7a3a1e', '#b4602e'], 5);
    for (x = 0; x < SW; x += 1.2) { y = nf(x) - 0.5 - Math.abs(Math.sin(x * 1.7)) * 1.2; var lc = AUT[Math.floor(Math.abs(Math.sin(x * 3.1)) * 4)]; R(n, x, y, 1.4, 1, lc[1]); R(n, x, y, 0.8, HP, lc[2]); }
    [[30, 2], [36, 1.6], [150, 2.2], [262, 1.8], [270, 2.4], [396, 2], [478, 1.7]].forEach(function (q) { conker(n, q[0], nf(q[0]) + 1, q[1]); });
    [[96, 2.6], [102, 1.8], [220, 2.2], [346, 2.8], [352, 1.6], [440, 2.2]].forEach(function (q) { toadstool(n, q[0], nf(q[0]) + 1.5, q[1]); });
    // a mossy log lying among the leaves
    var LX = 300, LB = nf(LX) + 1;
    R(n, LX, LB - 4.5, 24, 4.5, '#6a4a34'); R(n, LX, LB - 4.5, 24, 1, '#a07a5a'); R(n, LX, LB - 1, 24, 1, '#4a3024');
    for (x = LX + 2; x < LX + 22; x += 3) R(n, x, LB - 3, 2, HP, '#5a3a28');
    oval(n, LX + 24, LB - 2.25, 1.6, 2.25, '#c8a070'); ring(n, LX + 24, LB - 2.25, 0.8, 1.1, '#9a7450');
    for (x = LX + 1; x < LX + 20; x += 1.5) if (Math.sin(x) > -0.3) R(n, x, LB - 5, 1.2, 0.8, '#7aa040');
    // leaves on the air, falling all through the wood
    for (i = 0; i < 30; i++) { x = rnd() * SW; y = 8 + rnd() * 104; var lf = AUT[i % 4]; leafy(n, x, y, 1.5 + rnd() * 0.7, rnd() * 6.28, [lf[1], lf[2]]); }
    L.push({ c: nr, f: 0.27 });
    return L;
  };

  /* ---- 48 · Windy Hill ---- */
  /* A tree on an exposed hill, grown leaning away from the wind: its trunk
     bends downwind and its crown is swept into a long tuft with a few
     leaves tearing off. c = [shade, body, light], t = trunk [body, light] */
  var windTree = function (g, x, base, h, c, t, rnd) {
    var tw = Math.max(HP * 2, h * 0.11), tx = function (k) { return x + k * k * h * 0.34; };
    for (var y = 0; y < h * 0.66; y += HP) { var k = y / (h * 0.66), ww = tw * (1.3 - k * 0.6); R(g, tx(k) - ww / 2, base - y, ww, HP, t[0]); R(g, tx(k) - ww / 2, base - y, HP, HP, t[1]); }
    // two boughs reaching downwind
    line(g, tx(0.6), base - h * 0.4, tx(0.6) + h * 0.42, base - h * 0.62, Math.max(HP, tw * 0.5), t[0]);
    line(g, tx(0.8), base - h * 0.53, tx(0.8) + h * 0.2, base - h * 0.78, Math.max(HP, tw * 0.45), t[0]);
    // the crown: flat on top, swept out downwind, with a smaller tuft clinging upwind
    var cx = x + h * 0.42, cy = base - h * 0.74, br = Math.max(0.7, h * 0.07);
    pad(g, cx - h * 0.18, cy - h * 0.02, h * 0.2, h * 0.13, br, rnd, c);
    pad(g, cx + h * 0.08, cy, h * 0.4, h * 0.17, br, rnd, c);
    pad(g, cx + h * 0.36, cy + h * 0.05, h * 0.2, h * 0.1, br * 0.8, rnd, c);
    for (var i = 0; i < 5; i++) disc(g, cx + h * (0.58 + i * 0.07), cy + h * 0.02 + Math.sin(i * 2.3) * h * 0.05, Math.max(HP, br * (0.9 - i * 0.15)), c[1]);
  };
  /* A kite far off, a diamond of two colours with its cross-spars, and its
     tail of bows flicking out on the wind; its string runs away down to
     someone on the hill. c = [colour, colour 2, spar] */
  var kite = function (g, x, y, s, c, tail) {
    span(g, y - 2.2 * s, y + 3.2 * s, function (yy) { var k = yy < y ? (yy - y + 2.2 * s) / (2.2 * s) : 1 - (yy - y) / (3.2 * s); return x - 1.8 * s * k; }, function () { return x; }, c[0]);
    span(g, y - 2.2 * s, y + 3.2 * s, function () { return x; }, function (yy) { var k = yy < y ? (yy - y + 2.2 * s) / (2.2 * s) : 1 - (yy - y) / (3.2 * s); return x + 1.8 * s * k; }, c[1]);
    R(g, x - HP / 2, y - 2.2 * s, HP, 5.4 * s, c[2]); R(g, x - 1.8 * s, y - HP / 2, 3.6 * s, HP, c[2]);
    for (var t = 0; t < 1; t += 0.02) {
      var tx = x - t * tail, ty = y + 3.2 * s + Math.sin(t * 12) * 1.6 * s + t * tail * 0.15;
      R(g, tx, ty, HP, HP, c[2]);
      if (Math.round(t * 50) % 10 === 5) { R(g, tx - 0.8 * s, ty - 0.4 * s, 0.7 * s, 0.8 * s, c[0]); R(g, tx + 0.1 * s, ty - 0.4 * s, 0.7 * s, 0.8 * s, c[1]); }
    }
    line(g, x + HP, y + 1.5 * s, x + 40, y + 60, HP, mix(c[2], '#ffffff', 0.4), 6);
  };
  // a sheep, woolly and round: a white fleece, a black face and legs. s = size
  var sheep = function (g, x, base, s, tone, face) {
    R(g, x - 1.2 * s, base - 1.2 * s, HP, 1.2 * s, tone('#3a3440')); R(g, x + 1 * s, base - 1.2 * s, HP, 1.2 * s, tone('#3a3440'));
    oval(g, x + 0.2, base - 2.2 * s + 0.2, 2 * s, 1.3 * s, tone('#c8c4c0')); oval(g, x, base - 2.3 * s, 1.9 * s, 1.2 * s, tone('#ffffff'));
    var fx = x + face * 2 * s;
    oval(g, fx, base - 2.6 * s, 0.7 * s, 0.85 * s, tone('#3a3440')); R(g, fx - face * 0.7 * s, base - 3.2 * s, 0.5 * s, 0.4 * s, tone('#3a3440'));
  };

  GEN.windyhill = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A huge, bright, blowy sky: the sun high, big clouds piled up and
       racing, and long rags of cloud torn out across the blue. */
    var far = strip(), g = far.getContext('2d');
    var SX = 92, SY = 16;
    [[3, 0.05], [2.2, 0.08], [1.6, 0.14]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, SX, SY, 8 * q[0], '#ffffff'); });
    g.globalAlpha = 1; disc(g, SX, SY, 8, '#fff8dc'); disc(g, SX - 2, SY - 2, 4, '#ffffff');
    var CB = [hm('#a8c8ec', 0.15), '#ffffff', '#ffffff'];
    [[10, 44, 1.5], [168, 30, 1.25], [270, 50, 1.6], [394, 36, 1.35], [470, 56, 1.1]].forEach(function (q) { cloud(g, q[0], q[1], q[2], CB); cloud(g, q[0] + 22 * q[2], q[1] + 6, q[2] * 0.7, CB); });
    for (i = 0; i < 12; i++) streak(g, rnd() * SW, 8 + rnd() * 70, 50 + rnd() * 90, 1.2 + rnd() * 1.8, [hm('#b4d4f4', 0.2), hm('#f0f8ff', 0.1), '#ffffff']);
    L.push({ c: far, f: 0.015 });

    // the wind's clouds, nearer and faster, and kites up on the wind far away
    var wc = strip(), w = wc.getContext('2d');
    for (i = 0; i < 9; i++) { x = i * 58 + rnd() * 30; y = 14 + rnd() * 44; streak(w, x, y, 60 + rnd() * 60, 2 + rnd() * 2.5, [hm('#a8c8ec', 0.15), hm('#ffffff', 0.05), '#ffffff']); cloud(w, x + 50 + rnd() * 20, y - 2, 0.35 + rnd() * 0.25, [hm('#b0d0f0', 0.15), '#ffffff', '#ffffff']); }
    kite(w, 150, 34, 1.8, [hm('#ff5a5a', 0.1), hm('#ffd040', 0.1), hm('#3a3a5a', 0.25)], 30);
    kite(w, 312, 22, 1.4, [hm('#4ab0f0', 0.15), hm('#ffffff', 0.1), hm('#3a3a5a', 0.28)], 24);
    kite(w, 438, 46, 1.1, [hm('#8ad050', 0.15), hm('#ff8ad0', 0.15), hm('#3a3a5a', 0.3)], 18);
    for (i = 0; i < 6; i++) bird(w, 220 + rnd() * 60, 30 + rnd() * 20, hm('#4a5a7a', 0.4));
    L.push({ c: wc, f: 0.035 });

    /* The whole country far below: blue hills on the edge of the world, then
       a quilt of fields all the way to the foot of our hill, hedgerows and
       woods, a river shining, a village of white cottages and red roofs. */
    var vw = strip(), v = vw.getContext('2d');
    for (i = 0; i < 8; i++) K.mountain(v, i * 66 + rnd() * 30, 96, 70 + rnd() * 40, 6 + rnd() * 6, [hm('#7a9ac8', 0.6), hm('#94b2dc', 0.6)], null);
    var vf = function (xx) { return 95 + wv(xx, 2, 0.5) * 1 + wv(xx, 6, 1.2) * 0.5; };
    land(v, vf, [hm('#7aa070', 0.55), hm('#8cb078', 0.55), hm('#c8e0b0', 0.45)], 3);
    quilt(v, vf, [0, 1.5, 3.5, 6, 9.5, 14, 20, 30, 48], rnd, function (r, b) {
      var k = r(), a = 0.4 - b * 0.035;
      return k < 0.3 ? { c: [hm('#8cc060', a), hm('#9cd070', a)], st: 0 } : k < 0.5 ? { c: [hm('#e2c86a', a), hm('#f0da8a', a)], st: 1 + b * 0.3 } : k < 0.65 ? { c: [hm('#a87a52', a), hm('#8a5e3e', a)], st: 0.8 + b * 0.25 } : k < 0.85 ? { c: [hm('#6aa850', a), hm('#7ab860', a)], st: 0 } : { c: [hm('#c8b050', a), hm('#d8c070', a)], st: 0 };
    }, [hm('#3a6a3a', 0.4), hm('#4a7a40', 0.4)]);
    // the river, winding across and catching the light
    for (x = 0; x < SW; x += HP) { y = vf(x) + 9 + wv(x, 3, 0.7) * 5 + wv(x, 1, 2) * 3; var rw2 = 0.8 + (y - vf(x)) * 0.08; R(v, x, y, HP, rw2, hm('#9ad0f0', 0.3)); if (Math.sin(x * 1.3) > 0.7) R(v, x, y, HP, HP, '#ffffff'); }
    // woods, dark green, in clumps
    for (i = 0; i < 18; i++) { x = rnd() * SW; y = vf(x) + 2 + rnd() * 16; pad(v, x, y, 3 + rnd() * 5, 1.2 + rnd(), 0.9 + (y - vf(x)) * 0.05, rnd, [hm('#2a5a34', 0.45), hm('#3a7040', 0.45), hm('#6aa060', 0.4)]); }
    // the village: white cottages, red and grey roofs, a little green
    var VX = 246, VB = vf(VX) + 12;
    for (j = 0; j < 12; j++) {
      var hx = VX + (j % 6) * 5.2 + (j > 5 ? 2.5 : 0) + rnd(), hb = VB + (j > 5 ? 3 : 0) + rnd() * 0.6, hw2 = 3.6 + rnd() * 1.4;
      R(v, hx, hb - 2.4, hw2, 2.4, hm('#fff8ec', 0.25)); R(v, hx + hw2 - 0.8, hb - 2.4, 0.8, 2.4, hm('#d8ccc8', 0.25));
      span(v, hb - 4, hb - 2.3, function (yy) { return hx - 0.4 + (hb - 2.3 - yy) * 0.9; }, function (yy) { return hx + hw2 + 0.4 - (hb - 2.3 - yy) * 0.9; }, hm(j % 3 ? '#c0503a' : '#6a6a7a', 0.25));
      R(v, hx + 1, hb - 1.6, HP, HP, hm('#5a6a8a', 0.25));
    }
    mist(v, 88, 14, hz);
    L.push({ c: vw, f: 0.06 });

    /* The hill's shoulder, close by: the windmill on its rise turning in
       the wind, stone walls running over the slopes, trees grown leaning
       away from the weather, sheep with their backs to it. */
    var sh = strip(), s = sh.getContext('2d');
    var sf = function (xx) { var u = (xx - 120) / 62; return 115 + wv(xx, 2, 0.4) * 2 - 13 * Math.exp(-u * u) - 5 * Math.exp(-Math.pow((xx - 400) / 46, 2)); };
    land(s, sf, [hm('#5a8a3a', 0.3), hm('#78a848', 0.3), hm('#b8e080', 0.25)], 30);
    // the grass rippling: paler streaks combed downwind
    for (i = 0; i < 160; i++) { x = rnd() * SW; y = sf(x) + 1 + rnd() * 20; R(s, x, y, 2 + rnd() * 3, HP, hm(rnd() > 0.5 ? '#a8d070' : '#5a8a38', 0.3)); }
    // patches of bracken gone rusty on the slopes, and gorse
    for (i = 0; i < 16; i++) { x = rnd() * SW; y = sf(x) + 3 + rnd() * 12; pad(s, x, y, 4 + rnd() * 6, 1.4 + rnd(), 0.9, rnd, i % 4 ? [hm('#7a3a1a', 0.3), hm('#b0602a', 0.3), hm('#e09a50', 0.25)] : [hm('#4a6a2a', 0.3), hm('#7a9a3a', 0.3), hm('#f0d050', 0.25)]); }
    [[0, 80, 6], [180, 330, 9], [350, 512, 4]].forEach(function (q) { for (x = q[0]; x < q[1]; x += HP) { y = sf(x) + q[2] + (x - q[0]) * 0.02; R(s, x, y - 1, HP, 1.5, hm(Math.sin(x * 3.1) > 0.2 ? '#8a8478' : '#6e685e', 0.3)); if (Math.sin(x * 3.1) > -0.6) R(s, x, y - 1.2, HP, HP, hm('#c8c2b4', 0.25)); R(s, x, y + 0.5, HP, HP, hm('#4a6a30', 0.3)); } });
    windmill(s, 120, sf(120) + 1, 2.1, [hm('#f4ecdc', 0.25), hm('#c8b8a8', 0.25), hm('#7a5a4a', 0.25), hm('#fffaf0', 0.2)], 0.5);
    [[40, 14], [212, 16], [236, 11], [380, 18], [470, 13]].forEach(function (q, qi) { windTree(s, q[0], sf(q[0]) + 1.5, q[1], [hm(['#8a4a1a', '#6a5a20', '#9a3a1a'][qi % 3], 0.3), hm(['#d8822c', '#c8a030', '#d0522a'][qi % 3], 0.3), hm(['#ffc070', '#ffe070', '#ff9a60'][qi % 3], 0.25)], [hm('#5a4a3a', 0.3), hm('#8a7a6a', 0.3)], rnd); });
    [[70, -1], [86, 1], [96, -1], [292, 1], [300, -1], [318, -1], [440, 1]].forEach(function (q) { sheep(s, q[0], sf(q[0]) + 6, 0.9, function (cc) { return hm(cc, 0.25); }, q[1]); });
    L.push({ c: sh, f: 0.12 });

    /* The top of our hill: long grass streaming out flat in the wind, a
       hawthorn bent nearly double, and leaves and seeds whirling past. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + wv(xx, 2, 2.6) * 2 + wv(xx, 5, 1) * 1; };
    land(n, nf, ['#4a7a2a', '#6a9a34', '#a8cc5a'], 6);
    for (x = 0; x < SW; x += 0.8) {
      var gb = nf(x) + 1, gh = 4 + Math.abs(Math.sin(x * 0.37)) * 4 + Math.sin(x * 0.05) * 1.5, bend = 0.6 + Math.abs(Math.sin(x * 0.11)) * 0.5;
      for (var t = 0; t < 1; t += HP / gh) R(n, x + t * t * gh * bend, gb - t * gh * (1 - t * 0.35), HP, HP, t > 0.7 ? '#d8e888' : t > 0.35 ? '#9ac04a' : '#6a9a34');
    }
    // the hawthorn
    var HX = 400, HB = nf(HX) + 1;
    windTree(n, HX, HB, 30, ['#4a2018', '#8a3a22', '#cc6a3c'], ['#4a3428', '#7a6050'], rnd);
    for (i = 0; i < 26; i++) { x = HX + 4 + rnd() * 22; y = HB - 26 + rnd() * 8; R(n, x, y, 1, 1, '#ff3a30'); R(n, x, y, HP, HP, '#ffc8b8'); }
    // wild flowers combed over, and leaves and thistledown on the wind
    for (i = 0; i < 70; i++) { x = rnd() * SW; y = nf(x) - 1 - rnd() * 4; R(n, x, y, 1, HP, ['#ffe050', '#ffffff', '#c8a0ff', '#ff9a50'][i % 4]); }
    for (i = 0; i < 34; i++) { x = rnd() * SW; y = 10 + rnd() * 100; leafy(n, x, y, 0.9 + rnd() * 0.5, rnd() * 0.8 - 0.4, [AUT[i % 4][1], AUT[i % 4][2]]); R(n, x - 4 - rnd() * 4, y, 2.5, HP, 'rgba(255,255,255,0.5)'); }
    for (i = 0; i < 24; i++) { x = rnd() * SW; y = 20 + rnd() * 90; R(n, x, y, HP, HP, '#ffffff'); R(n, x - 0.5, y - HP, HP, HP, '#ffffff'); R(n, x + 0.5, y - HP, HP, HP, '#ffffff'); }
    L.push({ c: nr, f: 0.26 });
    return L;
  };

  /* ---- 49 · Trick or Treat Street ---- */
  /* A little witch on her broomstick, far off: a pointed hat, her cloak
     streaming, the broom's bristles. Seen against the moon. */
  var witch = function (g, x, y, s, col) {
    line(g, x - 6 * s, y + 1.2 * s, x + 5 * s, y - 0.2 * s, Math.max(HP, 0.5 * s), col);
    span(g, y + 0.4 * s, y + 2.2 * s, function (yy) { return x - 9 * s + (yy - y) * 0.6; }, function () { return x - 5.6 * s; }, col);
    oval(g, x, y - 1.4 * s, 1.5 * s, 1.6 * s, col);
    span(g, y - 2 * s, y + 0.6 * s, function (yy) { return x - 1.4 * s - (yy - y + 2 * s) * 1.2; }, function () { return x + 1 * s; }, col);
    disc(g, x + 0.6 * s, y - 3.4 * s, 1 * s, col);
    R(g, x - 0.8 * s, y - 4.4 * s, 3 * s, Math.max(HP, 0.5 * s), col);
    span(g, y - 8 * s, y - 4.2 * s, function (yy) { var k = (yy - y + 8 * s) / (3.8 * s); return x + 0.6 * s - k * 0.9 * s - (1 - k) * (1 - k) * 1.6 * s; }, function (yy) { var k = (yy - y + 8 * s) / (3.8 * s); return x + 0.6 * s + k * 0.9 * s - (1 - k) * (1 - k) * 1.6 * s; }, col);
    R(g, x + 2 * s, y - 0.4 * s, 1.2 * s, Math.max(HP, 0.4 * s), col);
  };
  /* A house on the street at dusk: clapboard walls, a steep gable with a
     round attic window, windows lit warm, a porch with its light on, a
     wreath of orange bulbs along the eaves, and jack-o'-lanterns grinning
     on the steps. P = {wall: [shade, body, light], roof: [shade, body, light], trim, door, deco} */
  var WARM = '#ffd27a';
  var litWin = function (g, x, y, w, h, frame, lit, deco) {
    if (lit) glow(g, x + w / 2, y + h / 2, w * 1.6 + 2, '#ffb860', 0.55);
    R(g, x - HP, y - HP, w + HP * 2, h + HP * 2, frame);
    R(g, x, y, w, h, lit ? WARM : mix(frame, '#1a1030', 0.6));
    if (lit) { R(g, x, y + h * 0.55, w, h * 0.45, '#ffb850'); R(g, x + HP * 0.5, y + HP * 0.5, w * 0.3, HP, '#fff2c0'); }
    R(g, x + w / 2 - HP / 2, y, HP, h, frame); R(g, x, y + h / 2 - HP / 2, w, HP, frame);
    if (deco === 'bat') { R(g, x + w * 0.2, y + h * 0.22, w * 0.6, HP, '#2a1838'); R(g, x + w * 0.42, y + h * 0.15, w * 0.16, h * 0.2, '#2a1838'); }
    else if (deco === 'ghost') { oval(g, x + w * 0.5, y + h * 0.5, w * 0.22, h * 0.26, '#ffffff'); R(g, x + w * 0.42, y + h * 0.45, HP, HP, '#2a1838'); R(g, x + w * 0.56, y + h * 0.45, HP, HP, '#2a1838'); }
    else if (deco === 'cat') { oval(g, x + w * 0.5, y + h * 0.8, w * 0.2, h * 0.2, '#2a1838'); disc(g, x + w * 0.5, y + h * 0.55, w * 0.12, '#2a1838'); R(g, x + w * 0.38, y + h * 0.4, HP, HP, '#2a1838'); R(g, x + w * 0.58, y + h * 0.4, HP, HP, '#2a1838'); }
  };
  var duskHouse = function (g, x, base, w, h, P, rnd) {
    var top = base - h, rh = w * 0.46, ov = 1.4, y;
    R(g, x, top, w, h, P.wall[1]); R(g, x + w - 1.5, top, 1.5, h, P.wall[0]); R(g, x, top, HP, h, P.wall[2]);
    for (y = top + 1.5; y < base; y += 1.5) R(g, x, y, w, HP, mix(P.wall[1], P.wall[0], 0.35));
    if (P.kind === 1) {
      // a side-gabled roof, its ridge running along, with a gable to the front over the left half
      var sr = rh * 0.62, fw = w * 0.52;
      span(g, top - sr, top + 0.5, function (yy) { return x - ov + (top - yy) * 1.1; }, function (yy) { return x + w + ov - (top - yy) * 1.1; }, P.roof[1]);
      R(g, x - ov + sr * 1.1, top - sr, w + ov * 2 - sr * 2.2, HP, P.roof[2]);
      for (y = top - sr + 1.5; y < top; y += 1.5) R(g, x - ov + (top - y) * 1.1, y, w + ov * 2 - (top - y) * 2.2, HP, mix(P.roof[1], P.roof[0], 0.5));
      R(g, x + w - 7, top - sr - 2, 2.5, sr * 0.6 + 2, P.roof[0]); R(g, x + w - 7.3, top - sr - 2.4, 3.1, 0.8, P.roof[2]);
      span(g, top - rh * 0.9, top + 0.5, function (yy) { return x - ov + (top - yy) * (fw / 2 + ov) / (rh * 0.9); }, function (yy) { return x + fw + ov - (top - yy) * (fw / 2 + ov) / (rh * 0.9); }, P.roof[1]);
      span(g, top - rh * 0.9 + 1.4, top + 0.5, function (yy) { return x + 0.4 + (top - yy) * (fw / 2) / (rh * 0.9); }, function (yy) { return x + fw - 0.4 - (top - yy) * (fw / 2) / (rh * 0.9); }, P.wall[1]);
      line(g, x - ov, top + 0.5, x + fw / 2, top - rh * 0.9, HP, P.roof[2]);
      litWin(g, x + fw / 2 - 1, top - rh * 0.42, 2, 2.4, P.trim, true, rnd() > 0.5 ? 'ghost' : null);
    } else {
    // the roof, and its round attic window
    span(g, top - rh, top + 0.5, function (yy) { return x - ov + (top - yy) * (w / 2 + ov) / rh; }, function (yy) { return x + w + ov - (top - yy) * (w / 2 + ov) / rh; }, P.roof[1]);
    span(g, top - rh, top + 0.5, function (yy) { return x + w / 2 + (top + 0.5 - yy) * 0.1; }, function (yy) { return x + w + ov - (top - yy) * (w / 2 + ov) / rh; }, P.roof[0]);
    for (y = top - rh + 2; y < top; y += 1.5) R(g, x - ov + (top - y) * (w / 2 + ov) / rh, y, w + ov * 2 - (top - y) * (w + ov * 2) / rh, HP, mix(P.roof[1], P.roof[0], 0.5));
    line(g, x - ov, top + 0.5, x + w / 2, top - rh, HP, P.roof[2]);
    var aw = w * 0.13;
    glow(g, x + w / 2, top - rh * 0.4, aw * 3, '#ffb860', 0.5); disc(g, x + w / 2, top - rh * 0.4, aw + HP, P.trim); disc(g, x + w / 2, top - rh * 0.4, aw, WARM); R(g, x + w / 2 - HP / 2, top - rh * 0.4 - aw, HP, aw * 2, P.trim);
    }
    // a string of orange bulbs along the eaves
    for (var t = 0.06; t < 0.97; t += 0.09) { var bx = x - ov + t * (w + ov * 2), by = top + 1 + Math.sin(t * Math.PI) * 1.2; glow(g, bx, by, 2.2, t * 11 % 2 < 1 ? '#ffa040' : '#c890ff', 0.6); R(g, bx - HP / 2, by - HP / 2, 1, 1, t * 11 % 2 < 1 ? '#ffc060' : '#e0c0ff'); }
    // upstairs, and down
    var ww = Math.min(4, w * 0.16), DECO = ['bat', 'ghost', 'cat', null, null];
    litWin(g, x + w * 0.16, top + 3.5, ww, ww * 1.2, P.trim, rnd() > 0.2, DECO[Math.floor(rnd() * 5)]);
    litWin(g, x + w * 0.84 - ww, top + 3.5, ww, ww * 1.2, P.trim, rnd() > 0.3, DECO[Math.floor(rnd() * 5)]);
    litWin(g, x + w * 0.12, base - h * 0.48, ww * 1.4, ww * 1.1, P.trim, true, null);
    // the porch: a little roof on two posts, the light by the door
    var px = x + w * 0.5, pw = w * 0.42, py = base - h * 0.5;
    R(g, px - 0.5, py, pw + 1, 1.2, P.roof[1]); R(g, px - 0.5, py, pw + 1, HP, P.roof[2]);
    R(g, px, py + 1.2, HP, base - py - 1.2, P.trim); R(g, px + pw - HP, py + 1.2, HP, base - py - 1.2, P.trim);
    R(g, px + pw * 0.3, base - h * 0.4, pw * 0.36, h * 0.4, P.door); R(g, px + pw * 0.3 + pw * 0.28, base - h * 0.22, HP, HP, '#ffe080');
    glow(g, px + pw * 0.15, py + 3, 6, '#ffd890', 0.7); R(g, px + pw * 0.15 - HP, py + 2.5, 1, 1.2, '#fff4c8');
    // the steps, and the jack-o'-lanterns on them
    R(g, px + pw * 0.2, base - 1, pw * 0.56, 1, mix(P.wall[0], '#3a2a40', 0.3));
    pumpkin(g, px + pw * 0.12, base, 1.7, ['#a04018', '#ee7a24', '#ffb85a', '#4a5a24'], true);
    if (rnd() > 0.35) pumpkin(g, px + pw * 0.9, base, 1.3, ['#a04018', '#ee7a24', '#ffb85a', '#4a5a24'], true);
    if (P.kind === 2) {
      // a round turret on the corner, under a tall pointed cap, its window lit
      var tr = w * 0.15, tx = x + w - tr * 0.6, tt = top - rh * 0.55;
      R(g, tx - tr, tt, tr * 2, base - tt - h * 0.5, P.wall[1]); R(g, tx + tr * 0.35, tt, tr * 0.65, base - tt - h * 0.5, P.wall[0]); R(g, tx - tr, tt, HP, base - tt - h * 0.5, P.wall[2]);
      for (y = tt + 1.5; y < base - h * 0.5; y += 1.5) R(g, tx - tr, y, tr * 2, HP, mix(P.wall[1], P.wall[0], 0.35));
      for (y = 0; y < tr * 3.2; y += HP) { var k = y / (tr * 3.2), hw = (tr + 0.8) * k; R(g, tx - hw, tt - tr * 3.2 + y, hw * 2, HP, P.roof[1]); R(g, tx + hw * 0.3, tt - tr * 3.2 + y, hw * 0.7, HP, P.roof[0]); }
      R(g, tx - HP / 2, tt - tr * 3.2 - 1.5, HP, 1.5, P.roof[0]);
      litWin(g, tx - 0.9, tt + 2, 1.8, 2.6, P.trim, true, null);
    }
  };
  /* Trick-or-treaters on the pavement, three small friends in costume with
     their pumpkin buckets: a ghost in a sheet, a little witch, a pumpkin. */
  var trickers = function (g, x, base, tone) {
    // the ghost
    oval(g, x, base - 4, 1.6, 2.2, tone('#f4f0ff')); R(g, x - 1.6, base - 4, 3.2, 3.2, tone('#f4f0ff'));
    for (var i = 0; i < 3; i++) R(g, x - 1.4 + i * 1.1, base - 1, 0.6, HP, tone('#3a2a50'));
    R(g, x - 0.8, base - 5, HP, 0.8, '#2a1838'); R(g, x + 0.3, base - 5, HP, 0.8, '#2a1838');
    pumpkin(g, x + 2.3, base - 1.6, 0.9, ['#a04018', '#ee7a24', '#ffb85a', '#2a2a2a']);
    // the little witch
    var wx = x + 6;
    span(g, base - 4, base - 0.6, function (yy) { return wx - 0.6 - (yy - base + 4) * 0.4; }, function (yy) { return wx + 0.6 + (yy - base + 4) * 0.4; }, tone('#6a3aa0'));
    disc(g, wx, base - 4.8, 0.9, tone('#f8d0b0')); R(g, wx - 1.8, base - 5.6, 3.6, HP, tone('#2a1838'));
    span(g, base - 8, base - 5.4, function (yy) { return wx - (yy - base + 8) * 0.4; }, function (yy) { return wx + (yy - base + 8) * 0.4; }, tone('#2a1838'));
    R(g, wx - 0.8, base - 0.6, HP, 0.6, tone('#2a1838')); R(g, wx + 0.4, base - 0.6, HP, 0.6, tone('#2a1838'));
    pumpkin(g, wx - 2.2, base - 1.4, 0.8, ['#a04018', '#ee7a24', '#ffb85a', '#2a2a2a']);
    // the pumpkin
    var px = x + 10.5;
    pumpkin(g, px, base - 0.8, 2, ['#c05018', '#f8902c', '#ffc070', '#3a6a2a']);
    disc(g, px, base - 4.4, 0.85, tone('#f8d0b0')); R(g, px - 0.7, base - 5.4, 1.4, 0.6, tone('#4a9a3a')); R(g, px - HP / 2, base - 6, HP, 0.8, tone('#4a9a3a'));
    R(g, px - 0.6, base - 0.8, HP, 0.8, tone('#2a2a3a')); R(g, px + 0.3, base - 0.8, HP, 0.8, tone('#2a2a3a'));
  };
  /* A lamp post on the street: an iron post, the lantern lit, a pool of its
     light around it. */
  var lamp = function (g, x, base, h, col) {
    glow(g, x, base - h, 14, '#ffd27a', 0.9);
    R(g, x - 0.5, base - h, 1, h, col); R(g, x - 1, base - 2, 2, 2, col);
    R(g, x - 1.6, base - h - 3.5, 3.2, 3.5, '#ffe6a0'); R(g, x - 1, base - h - 3, 1, 2.2, '#fffbe0');
    R(g, x - 2, base - h - 4, 4, 1, col); R(g, x - 1.8, base - h, 3.6, HP, col); R(g, x - HP / 2, base - h - 5, HP, 1, col);
  };

  GEN.trickortreat = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    // the colours of things as the light goes: cooled, dimmed, a little of the sunset in them
    var dusk = function (c, a) { return mix(mix(c, '#3a2452', 0.42), hz, a === undefined ? 0.06 : a); };
    /* Dusk: the sky going from violet to tangerine, the first stars out,
       clouds lit pink and gold from underneath, and the harvest moon rising
       huge and orange — with a little witch going across it on her broom. */
    var far = strip(), g = far.getContext('2d');
    for (y = 40; y < 110; y += 1) { g.globalAlpha = 0.32 * Math.pow((y - 40) / 70, 1.6); R(g, 0, y, SW, 1, '#ffc070'); }
    g.globalAlpha = 1;
    stars(g, 70, 2, 46, rnd, ['#ffffff', '#ffe8ff', '#ffd8f0']);
    for (i = 0; i < 10; i++) streak(g, rnd() * SW, 30 + rnd() * 50, 50 + rnd() * 80, 1.6 + rnd() * 2, [hm('#5a2c6a', 0.2), hm('#b4608a', 0.2), '#ffb888'], true);
    var MX = 84, MY = 72;
    moon(g, MX, MY, 16, ['#e09858', '#ffd28a', '#fff2cc', '#f0b070'], ['#ffc890', 0.55]);
    witch(g, MX + 3, MY - 2, 0.9, '#2a1638');
    [[160, 30, 1], [172, 24, 0.8], [182, 34, 0.7], [380, 20, 0.9], [392, 28, 0.7]].forEach(function (q, qi) { bat(g, q[0], q[1], q[2], hm('#2a1840', 0.1), qi % 2 === 0); });
    L.push({ c: far, f: 0.02 });

    /* The far side of town, gone to silhouette against the sunset: roofs and
       chimneys and round trees, a few windows already lit. */
    var tw = strip(), t = tw.getContext('2d');
    var SIL = hm('#5a2c62', 0.35), SIL2 = hm('#4a2458', 0.3);
    for (x = 0; x < SW;) {
      var bw = 12 + Math.floor(rnd() * 12), bh = 8 + rnd() * 10, bt = 104 - bh, kind = rnd();
      R(t, x, bt, bw, H - bt, SIL);
      if (kind < 0.6) span(t, bt - bw * 0.4, bt + 0.5, function (yy) { return x - 0.5 + (bt - yy) * 1.2; }, function (yy) { return x + bw + 0.5 - (bt - yy) * 1.2; }, SIL);
      if (rnd() > 0.4) R(t, x + bw * 0.7, bt - bw * 0.4 - 1, 2, bw * 0.4, SIL);
      for (j = 0; j < 3; j++) if (rnd() > 0.5) { var lx = x + 2 + rnd() * (bw - 4), ly = bt + 2 + rnd() * (bh - 4); glow(t, lx, ly, 2.4, '#ffb060', 0.5); R(t, lx, ly, 1, 1, hm('#ffc878', 0.15)); }
      if (rnd() > 0.5) roundTree(t, x + bw + 3, 106, 9 + rnd() * 5, [SIL2, SIL2, hm('#6a3a6a', 0.35)], [SIL2, SIL2]);
      x += bw + 3 + rnd() * 8;
    }
    mist(t, 96, 20, hz);
    L.push({ c: tw, f: 0.045 });

    /* The street: house after house, every one done up for Halloween —
       windows lit, porch lights on, bulbs strung along the eaves, pumpkins
       grinning on the steps, cut-out bats and ghosts at the windows. */
    var st = strip(), s = st.getContext('2d');
    var SB = 116;
    var WALLS = ['#b8a8d8', '#9ad0c0', '#f0d8b0', '#e8a8b8', '#a8c0e8', '#d8c0a0'], ROOFS = ['#4a3a6a', '#5a3a4a', '#3a4a5a', '#5a4a3a'];
    var trees = [], houseN = 0;
    for (x = 2; x < SW - 26;) {
      var kind = houseN++ % 3, hw = (kind === 1 ? 32 : 24) + Math.floor(rnd() * 3) * 3, hh = 18 + rnd() * 9, ci = Math.floor(rnd() * WALLS.length), wc = WALLS[ci];
      duskHouse(s, x, SB, hw, hh, { kind: kind, wall: [dusk(mix(wc, '#4a3a6a', 0.3)), dusk(wc), dusk(mix(wc, '#ffffff', 0.3))], roof: [dusk(mix(ROOFS[ci % 4], '#1a1028', 0.3)), dusk(ROOFS[ci % 4]), dusk(mix(ROOFS[ci % 4], '#ffb080', 0.35))], trim: dusk('#fff4ec', 0.05), door: dusk(['#c04a3a', '#3a6a5a', '#4a4a8a'][ci % 3]) }, rnd);
      trees.push(x + hw + 5);
      x += hw + 10 + rnd() * 4;
    }
    // trees between the houses, their last leaves orange
    trees.forEach(function (tx, ti) { roundTree(s, tx, SB, 18 + (ti % 3) * 3, [dusk('#6a3a2a'), dusk(ti % 2 ? '#d86a2a' : '#c89a2a'), dusk(ti % 2 ? '#ffaa5a' : '#ffd060', 0.02)], [dusk('#4a3030'), dusk('#7a5a50')]); });
    // the pavement and the kerb
    R(s, 0, SB, SW, H - SB, dusk('#a898b0')); R(s, 0, SB, SW, HP, dusk('#e0d0e0'));
    for (x = 0; x < SW; x += 8) R(s, x, SB + HP, HP, 4, dusk('#7a6a88'));
    L.push({ c: st, f: 0.1 });

    /* In front: the front gardens, kept low — hedges and white picket
       fences, lamp posts lit, a jack-o'-lantern on every gatepost, and
       leaves blowing along the path. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + wv(xx, 4, 0.3) * 0.8; };
    land(n, nf, ['#2a2a3a', '#3a3a50', '#5a5a78'], 4);
    K.hedge(n, nf, ['#1e2a2a', '#2e3e3a', '#4a5e50']);
    // picket fences, and the gates with pumpkins on their posts
    [[20, 120], [196, 300], [340, 470]].forEach(function (q) {
      for (x = q[0]; x < q[1]; x += 2.4) { y = nf(x) - 1; R(n, x, y - 8, 1.4, 8, dusk('#fff4ec', 0.02)); R(n, x + 1, y - 8, HP, 8, dusk('#c8b8c8', 0.02)); R(n, x + 0.2, y - 8.6, 1, HP, dusk('#fff4ec', 0.02)); }
      for (x = q[0]; x < q[1]; x += HP) { y = nf(x) - 1; R(n, x, y - 6.5, HP, 1, dusk('#e8dce4', 0.02)); R(n, x, y - 3, HP, 1, dusk('#e8dce4', 0.02)); }
      [q[0] - 1.5, q[1] + 0.5].forEach(function (gx) { y = nf(gx) - 1; R(n, gx, y - 10, 2.5, 10, dusk('#fff4ec', 0.02)); R(n, gx + 1.8, y - 10, 0.7, 10, dusk('#c8b8c8', 0.02)); pumpkin(n, gx + 1.25, y - 10, 1.8, ['#a04018', '#ee7a24', '#ffb85a', '#4a5a24'], true); });
    });
    [160, 320, 490].forEach(function (lx) { lamp(n, lx, nf(lx), 24, '#2a2238'); });
    // trick-or-treaters going along the path
    trickers(n, 168, nf(168) + 1.5, function (cc) { return dusk(cc, 0); });
    trickers(n, 306, nf(306) + 1.5, function (cc) { return dusk(cc, 0); });
    // pumpkins on the lawns
    [[140, 3], [150, 2], [286, 2.6], [482, 2.2]].forEach(function (q, qi) { pumpkin(n, q[0], nf(q[0]) + 1, q[1], ['#a04018', '#ee7a24', '#ffb85a', '#4a5a24'], qi % 2 === 0); });
    for (i = 0; i < 50; i++) { x = rnd() * SW; y = nf(x) + rnd() * 4; R(n, x, y, 1, HP, ['#e8682a', '#f8b030', '#c03a24'][i % 3]); }
    L.push({ c: nr, f: 0.22 });
    return L;
  };

  /* ---- 50 · Pumpkin Town ---- */
  /* A crooked house of the town: tall and thin, bending as it rises, under
     a steep witch's-hat roof whose tip curls over; odd little windows, lit.
     P = {wall: [shade, body, light], roof: [shade, body, light], win, frame} */
  var crooked = function (g, x, base, w, h, lean, curl, P, rnd) {
    var top = base - h, y;
    var cx = function (yy) { var k = (base - yy) / h; return x + lean * k * k * h; };
    for (y = top; y < base; y += HP) { var l = cx(y) - w / 2, ww = w * (1 + 0.08 * Math.sin((base - y) * 0.3)); R(g, l, y, ww, HP, P.wall[1]); R(g, l + ww * 0.74, y, ww * 0.26, HP, P.wall[0]); R(g, l, y, HP, HP, P.wall[2]); }
    for (y = top + 3; y < base; y += 3) R(g, cx(y) - w / 2, y, w, HP, mix(P.wall[1], P.wall[0], 0.4));
    // the roof: a tall cone, its tip bent over like a sleepy hat
    var rh = w * (1.2 + rnd() * 0.8), rw = w / 2 + 1.4, rx = cx(top);
    for (y = 0; y < rh; y += HP) {
      var k = y / rh, hw2 = rw * Math.pow(k, 1.15), xx = rx + curl * Math.pow(1 - k, 3) * rh * 0.5, yy = top - rh + y;
      R(g, xx - hw2, yy, hw2 * 2, HP, P.roof[1]); R(g, xx + hw2 * 0.25, yy, hw2 * 0.75, HP, P.roof[0]); R(g, xx - hw2, yy, Math.max(HP, hw2 * 0.25), HP, P.roof[2]);
    }
    R(g, rx - rw, top - HP, rw * 2, 1, P.roof[0]);
    // the windows: none quite square, every one lit
    for (y = top + 2.5; y < base - 4; y += 5.5) {
      var n = w > 9 ? 2 : 1;
      for (var i = 0; i < n; i++) {
        var wx = cx(y) - w / 2 + (n === 1 ? w / 2 - 1 : 1.5 + i * (w - 5)), wh = 2.4 + rnd() * 1.2, on = rnd() > 0.25, wc = rnd() > 0.8 ? '#a8ff9a' : WARM;
        if (on) glow(g, wx + 1, y + wh / 2, 4, wc === WARM ? '#ffb860' : '#7aff9a', 0.5);
        R(g, wx - HP, y - HP, 2 + HP * 2, wh + HP * 2, P.frame); R(g, wx, y, 2, wh, on ? wc : P.wall[0]);
        if (on) R(g, wx, y + wh * 0.5, 2, HP, P.frame);
      }
    }
    R(g, cx(base - 1) - 1.2, base - 4, 2.4, 4, P.frame); oval(g, cx(base - 1), base - 4, 1.2, 1.2, P.frame, true);
  };
  /* The spiral hill: a dark round hill whose top uncurls into a great
     spiral, the moonlight running along its upper edge. c = [body, rim] */
  var spiralHill = function (g, cx, base, c) {
    var top = function (xx) { var u = (xx - cx) / 50; return base - 30 * Math.exp(-u * u * 1.6); };
    for (var x = cx - 110; x < cx + 110; x += HP) { var y = top(x); R(g, x, y, HP, H - y, c[0]); if (y < base - 1) R(g, x, y, HP, HP, c[1]); }
    // the curl: a ribbon rising off the hilltop and winding inwards
    var SX = cx + 2, SY = base - 49, R0 = 19, pts = [];
    for (var a = Math.PI * 0.55; a > Math.PI * 0.55 - Math.PI * 3.1; a -= 0.012) {
      var k = (Math.PI * 0.55 - a) / (Math.PI * 3.1), r = R0 * Math.exp(-k * 2.1);
      pts.push([SX + Math.cos(a) * r, SY + Math.sin(a) * r, 3.4 * (1 - k * 0.72) + 0.6, a]);
    }
    pts.forEach(function (p) { disc(g, p[0], p[1], p[2], c[0]); });
    pts.forEach(function (p) { var nx = Math.cos(p[3]), ny = Math.sin(p[3]); if (ny < 0.3) R(g, p[0] + nx * p[2] * 0.9, p[1] + ny * p[2] * 0.9 - HP, HP, HP, c[1]); });
  };
  // a curly iron fence: spiked railings, the top rail looping between them
  var railings = function (g, x0, x1, f, h, col, tip) {
    for (var x = x0; x < x1; x += 3) { var y = f(x); R(g, x, y - h, HP * 1.5, h, col); span(g, y - h - 2, y - h, function (yy) { return x + 0.4 - (yy - y + h + 2) * 0.4; }, function (yy) { return x + 0.4 + (yy - y + h + 2) * 0.4; }, tip || col); }
    for (x = x0; x < x1; x += HP) { var yy = f(x); R(g, x, yy - h + 1.5, HP, HP, col); R(g, x, yy - 1.5, HP, HP, col); R(g, x, yy - h * 0.55 + Math.sin((x - x0) / 3 * Math.PI) * 1.1, HP, HP, col); }
  };

  GEN.pumpkintown = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* Twilight, the sky purple going down to a green-blue glow: a huge pale
       moon coming up behind the spiral hill, the first stars, and wisps of
       cloud drifting over the moon's face. */
    var far = strip(), g = far.getContext('2d');
    for (y = 50; y < 110; y += 1) { g.globalAlpha = 0.25 * Math.pow((y - 50) / 60, 1.4); R(g, 0, y, SW, 1, '#a8e8c8'); }
    g.globalAlpha = 1;
    stars(g, 130, 2, 70, rnd, ['#ffffff', '#e8fff8', '#fff0c8', '#d8e0ff']);
    var MX = 150, MY = 50;
    moon(g, MX, MY, 27, ['#d4cca0', '#f6f0cc', '#fffcec', '#e2d8ac'], ['#e8f4d8', 0.45]);
    for (i = 0; i < 4; i++) streak(g, MX - 50 + i * 30 + rnd() * 10, MY - 16 + i * 9, 50 + rnd() * 30, 1.2 + rnd(), [hm('#2a2450', 0.2), hm('#3e3466', 0.2), hm('#7a7aa0', 0.2)]);
    spiralHill(g, 168, 104, [hm('#18122e', 0.12), hm('#9aa8c0', 0.2)]);
    for (i = 0; i < 6; i++) streak(g, rnd() * SW, 20 + rnd() * 50, 30 + rnd() * 60, 1 + rnd(), [hm('#2a2450', 0.2), hm('#3e3466', 0.2), hm('#6a6a98', 0.2)]);
    [[250, 30, 1], [262, 24, 0.8], [440, 40, 0.9], [452, 46, 0.7]].forEach(function (q, qi) { bat(g, q[0], q[1], q[2], hm('#140e28', 0.1), qi % 2 === 0); });
    L.push({ c: far, f: 0.02 });

    /* Pumpkin Town on its hill: crooked houses leaning on one another, every
       roof a bent witch's hat, chimneys at all angles, windows lit gold and
       here and there potion green, and over them all the town tower with a
       jack-o'-lantern grinning on top. */
    var tw = strip(), t = tw.getContext('2d');
    var tf = function (xx) { return 104 + wv(xx, 2, 0.3) * 3 + wv(xx, 5, 1.7) * 1.2; };
    land(t, tf, [hm('#1e1838', 0.2), hm('#2a2248', 0.2), hm('#5a5a80', 0.2)], 10);
    var TW = [[hm('#3a2e58', 0.25), hm('#5a4a7a', 0.25), hm('#8a7aa8', 0.2)], [hm('#2e3a4a', 0.25), hm('#4a5a68', 0.25), hm('#7a90a0', 0.2)], [hm('#4a3440', 0.25), hm('#6a4a58', 0.25), hm('#9a7a88', 0.2)]];
    var TR = [hm('#1a1430', 0.2), hm('#2c2448', 0.2), hm('#5a5480', 0.2)];
    for (x = 6; x < SW - 6;) {
      var w2 = 7 + rnd() * 7, h2 = 14 + rnd() * 18, P = { wall: TW[Math.floor(rnd() * 3)], roof: TR, frame: hm('#1a1428', 0.2) };
      if (!(x > 230 && x < 268)) crooked(t, x + w2 / 2, tf(x + w2 / 2) + 2, w2, h2, (rnd() - 0.5) * 0.24, (rnd() > 0.5 ? 1 : -1) * (0.6 + rnd() * 0.6), P, rnd);
      x += w2 + 1 + rnd() * 5;
    }
    // the town tower, with its jack-o'-lantern
    var TX = 250, TB = tf(TX) + 2;
    crooked(t, TX, TB, 12, 52, 0.05, 0, { wall: TW[0], roof: TR, frame: hm('#1a1428', 0.2) }, BB.rng(5005));
    var TT = TB - 52 - 12 * 1.6;
    R(t, TX + 1.2, TT - 2, HP * 2, 4, hm('#1a1428', 0.2));
    pumpkin(t, TX + 1.6, TT - 1.5, 5.2, ['#b04a18', '#f28a2a', '#ffc070', '#3a5a2a'], true);
    // chimneys at all angles, puffing
    for (i = 0; i < 6; i++) { x = 30 + i * 80 + rnd() * 30; y = tf(x) - 30 - rnd() * 6; line(t, x, y + 8, x + (rnd() - 0.5) * 3, y, 1.6, TR[1]); for (j = 0; j < 5; j++) { t.globalAlpha = 0.35 - j * 0.05; disc(t, x + j * 1.6 + Math.sin(j) * 0.8, y - 2 - j * 2.4, 0.8 + j * 0.3, hm('#c8d8d0', 0.3)); } t.globalAlpha = 1; }
    // twisty trees standing among the houses
    [[120, 22, 1], [372, 26, -1], [476, 18, 1]].forEach(function (q) { twisty(t, q[0], tf(q[0]) + 2, q[1], -Math.PI / 2 + q[2] * 0.15, 2.2, 2, q[2] * 2.4, [TR[0], TR[1], TR[2]], rnd); });
    mist(t, 92, 22, hz);
    L.push({ c: tw, f: 0.06 });

    /* Down in the square: a green mist creeping between the cobbles, curly
       iron railings, twisty trees with their tips rolled up, and pumpkins —
       some lit, some waiting to be. */
    var mw = strip(), m = mw.getContext('2d');
    var mf = function (xx) { return 116 + wv(xx, 3, 1.1) * 1.5; };
    land(m, mf, [hm('#1a1834', 0.12), hm('#2a2848', 0.12), hm('#5a5a80', 0.12)], 6);
    for (i = 0; i < 120; i++) { x = rnd() * SW; y = mf(x) + 1 + rnd() * 10; R(m, x, y, 1.5, 1, hm(rnd() > 0.5 ? '#3a3858' : '#22203c', 0.12)); }
    [[40, 34, 1], [196, 40, -1], [330, 30, 1], [450, 38, -1]].forEach(function (q) {
      twisty(m, q[0], mf(q[0]) + 2, q[1], -Math.PI / 2 - q[2] * 0.1, 3.6, 3, q[2] * 2.8, [hm('#120e22', 0.1), hm('#221a38', 0.1), hm('#4a4268', 0.1)], rnd);
      roots(m, q[0], mf(q[0]) + 2, 3.6, [hm('#120e22', 0.1), hm('#221a38', 0.1)]);
    });
    haze(m, 104, 18, '#7ae8c0', 0.28);
    L.push({ c: mw, f: 0.12 });

    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 122 + wv(xx, 4, 0.7) * 0.8; };
    land(n, nf, ['#141228', '#1e1c36', '#3a3a5a'], 4);
    railings(n, 60, 168, function (xx) { return nf(xx) + 1; }, 12, '#141026', '#3a3058');
    railings(n, 300, 420, function (xx) { return nf(xx) + 1; }, 12, '#141026', '#3a3058');
    [[24, 3.4, 1], [34, 2.2, 0], [186, 2.8, 1], [236, 3.6, 1], [248, 2, 0], [286, 2.6, 0], [440, 3.2, 1], [500, 2.4, 1]].forEach(function (q) { pumpkin(n, q[0], nf(q[0]) + 1.5, q[1], ['#a04018', '#ee7a24', '#ffb85a', '#3a5a2a'], !!q[2]); });
    L.push({ c: nr, f: 0.22 });
    return L;
  };

  /* ---- 51 · Graveyard Jamboree ---- */
  /* A headstone, leaning however it has settled: round-topped, a cross, a
     pointed one, or one with a scrolled top; lit on its left, moss at its
     foot, a little carved arch on its face (never any words). kind 0–3,
     tilt = lean, c = [shade, body, light, moss] */
  var headstone = function (g, x, base, w, h, kind, tilt, c) {
    var y, hw = w / 2;
    var row = function (yy, l, r) { var o = tilt * (base - yy); R(g, x + l + o, yy, r - l, HP, c[1]); R(g, x + r - (r - l) * 0.3 + o, yy, (r - l) * 0.3, HP, c[0]); R(g, x + l + o, yy, HP, HP, c[2]); };
    if (kind === 1) {
      for (y = base - h; y < base; y += HP) row(y, -w * 0.18, w * 0.18);
      for (y = base - h * 0.78; y < base - h * 0.62; y += HP) row(y, -hw, hw);
      R(g, x - w * 0.18 + tilt * h, base - h, w * 0.36, HP, c[2]);
    } else {
      for (y = base - h; y < base; y += HP) {
        var d = y - (base - h), l = -hw, r = hw;
        if (kind === 0 && d < hw) { var q = Math.sqrt(Math.max(0, hw * hw - (hw - d) * (hw - d))); l = -q; r = q; }
        if (kind === 2 && d < w * 0.7) { var q2 = hw * d / (w * 0.7); l = -q2; r = q2; }
        if (kind === 3 && d < w * 0.3) { var q3 = d < w * 0.12 ? hw * 0.5 : hw * (0.5 + (d - w * 0.12) / (w * 0.18) * 0.5); l = -q3; r = q3; }
        row(y, l, r);
      }
      // the carved arch on its face
      if (w > 3) { var ay = base - h + Math.max(hw, w * 0.5) + 1, o = tilt * (base - ay); ring(g, x + o - HP / 2, ay, hw * 0.35, hw * 0.35 + HP, c[0], ay); R(g, x + o - hw * 0.35 - HP / 2, ay, HP, h * 0.3, c[0]); R(g, x + o + hw * 0.35 - HP / 2, ay, HP, h * 0.3, c[0]); }
    }
    for (var mx = -hw; mx < hw; mx += HP) if (Math.sin(mx * 5 + x) > -0.2) R(g, x + mx, base - HP - Math.abs(Math.sin(mx * 3 + x)) * 1.2, HP, HP + Math.abs(Math.sin(mx * 3 + x)) * 1.2, c[3]);
  };
  // a will-o'-wisp: a soft blue-green light with a bright heart and a little flicker of tail
  var wisp = function (g, x, y, s) {
    glow(g, x, y, 7 * s, '#7affe0', 0.85);
    disc(g, x, y, 1.1 * s, '#bafff0'); disc(g, x - 0.3 * s, y - 0.3 * s, 0.55 * s, '#ffffff');
    R(g, x + 0.8 * s, y + 0.2 * s, 1.4 * s, HP, '#8affe8'); R(g, x + 2 * s, y + 0.6 * s, s, HP, '#5ad8c0');
  };
  /* A little crypt: a stone house for the long sleep, with a pediment, two
     columns, steps, and a door left ajar with a friendly glow inside.
     c = [shade, body, light], glowCol */
  var crypt = function (g, x, base, w, h, c, gc) {
    var top = base - h;
    R(g, x, top, w, h, c[1]); R(g, x + w * 0.78, top, w * 0.22, h, c[0]); R(g, x, top, HP, h, c[2]);
    span(g, top - w * 0.28, top, function (yy) { return x - 1 + (top - yy) / 0.28 * 0.5; }, function (yy) { return x + w + 1 - (top - yy) / 0.28 * 0.5; }, c[1]);
    line(g, x - 1, top, x + w / 2, top - w * 0.28, HP, c[2]); R(g, x - 1.2, top - HP, w + 2.4, 1, c[2]); R(g, x - 1.2, top + 0.5, w + 2.4, HP, c[0]);
    [x + w * 0.16, x + w * 0.78].forEach(function (cx) { R(g, cx, top + 1, w * 0.07 + HP, h - 2, c[2]); R(g, cx + w * 0.06, top + 1, HP, h - 2, c[0]); });
    var dw = w * 0.3, dx = x + w / 2 - dw / 2;
    glow(g, x + w / 2, base - h * 0.35, w * 0.8, gc, 0.7);
    R(g, dx, base - h * 0.62, dw, h * 0.62, mix(gc, '#ffffff', 0.4)); oval(g, x + w / 2, base - h * 0.62, dw / 2, dw / 2, mix(gc, '#ffffff', 0.4), true);
    R(g, dx + dw * 0.45, base - h * 0.62, dw * 0.55, h * 0.62, c[0]); R(g, dx + dw * 0.45, base - h * 0.62, HP, h * 0.62, c[2]);
    R(g, x - 1.5, base - 1, w + 3, 1, c[2]); R(g, x - 2.5, base - HP, w + 5, HP, c[1]);
  };
  /* The Haunted Mansion far off on its hill: a tall house of towers, a
     mansard roof with dormers, a cupola with a crooked weathervane, iron
     cresting along every ridge — all dark, but for one window, lit. */
  var hauntedHouse = function (g, cx, base, s, col, rim, lit, litAt) {
    var bw = 44 * s, bh = 16 * s, bx = cx - bw / 2, top = base - bh, y;
    R(g, bx, top, bw, bh, col);
    // the mansard: a steep lower slope, flat on top, dormers poking out
    span(g, top - 8 * s, top, function (yy) { return bx - s + (top - yy) * 0.25; }, function (yy) { return bx + bw + s - (top - yy) * 0.25; }, col);
    for (var dx = bx + 5 * s; dx < bx + bw - 4 * s; dx += 8 * s) { R(g, dx, top - 7 * s, 3 * s, 4 * s, col); span(g, top - 9 * s, top - 7 * s, function (yy) { return dx - (yy - top + 9 * s) * 0.4; }, function (yy) { return dx + 3 * s + (yy - top + 9 * s) * 0.4; }, col); }
    // the great tower, and its tall roof
    var tx = cx + 6 * s;
    R(g, tx - 5 * s, top - 22 * s, 10 * s, 22 * s, col);
    span(g, top - 34 * s, top - 22 * s, function (yy) { return tx - 6 * s * (yy - top + 34 * s) / (12 * s); }, function (yy) { return tx + 6 * s * (yy - top + 34 * s) / (12 * s); }, col);
    line(g, tx, top - 34 * s, tx, top - 38 * s, Math.max(HP, 0.5 * s), col); line(g, tx - 1.5 * s, top - 37 * s, tx + 1.8 * s, top - 36.4 * s, HP, col);
    // a round turret on the left, a pointed cap
    var rx = bx + 4 * s;
    R(g, rx - 3.5 * s, top - 10 * s, 7 * s, 10 * s, col);
    span(g, top - 20 * s, top - 10 * s, function (yy) { return rx - 4 * s * (yy - top + 20 * s) / (10 * s); }, function (yy) { return rx + 4 * s * (yy - top + 20 * s) / (10 * s); }, col);
    // chimneys, the porch and its columns, the cresting
    [bx + 14 * s, bx + bw - 6 * s].forEach(function (ccx) { R(g, ccx, top - 12 * s, 2.2 * s, 5 * s, col); R(g, ccx - 0.4 * s, top - 12.5 * s, 3 * s, 0.8 * s, col); });
    R(g, cx - 10 * s, base - 7 * s, 20 * s, 1.2 * s, col); R(g, cx - 11 * s, base - 8 * s, 22 * s, 1 * s, col);
    for (y = 0; y < 3; y++) R(g, cx - 9.5 * s + y * 9 * s, base - 7 * s, s * 0.8, 7 * s, col);
    for (var x = bx; x < bx + bw; x += 1.2 * s) R(g, x, top - 9 * s, HP, 1.2 * s, col);
    // the moon catching its edges
    if (rim) { line(g, tx - 6 * s, top - 22 * s, tx, top - 34 * s, HP, rim); R(g, bx - s, top - HP, s * 2, HP, rim); R(g, tx - 5 * s, top - 22 * s, HP, 22 * s, rim); line(g, rx - 4 * s, top - 10 * s, rx, top - 20 * s, HP, rim); }
    // its windows, dark — all but one
    var wins = [];
    for (x = bx + 3 * s; x < bx + bw - 3 * s; x += 5.5 * s) { wins.push([x, top + 3 * s]); }
    wins.push([tx - 1.2 * s, top - 18 * s], [tx - 1.2 * s, top - 11 * s], [rx - 1.2 * s, top - 7 * s]);
    wins.forEach(function (w, wi) {
      var on = wi === litAt;
      if (on) glow(g, w[0] + 1.2 * s, w[1] + 2 * s, 10 * s, lit, 0.9);
      R(g, w[0], w[1], 2.4 * s, 4 * s, on ? lit : mix(col, '#5a5a8a', 0.25)); oval(g, w[0] + 1.2 * s, w[1], 1.2 * s, 1.2 * s, on ? lit : mix(col, '#5a5a8a', 0.25), true);
      if (on) R(g, w[0] + 0.4 * s, w[1] + 0.4 * s, 0.8 * s, 1.6 * s, '#fff6d0');
    });
  };

  GEN.graveyard = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A clear night and a big bright moon, wisps of cloud going across its
       face, stars everywhere, bats out flitting about. */
    var far = strip(), g = far.getContext('2d');
    stars(g, 170, 2, 96, rnd, ['#ffffff', '#e0e8ff', '#fff4d8', '#d8f0ff']);
    var MX = 186, MY = 34;
    moon(g, MX, MY, 21, ['#b0bcdc', '#eef2ff', '#ffffff', '#c4ccea'], ['#c0d4ff', 0.55]);
    for (i = 0; i < 5; i++) streak(g, MX - 60 + i * 26 + rnd() * 10, MY - 8 + i * 6 + rnd() * 4, 40 + rnd() * 40, 1.4 + rnd(), [hm('#1c2450', 0.2), hm('#34407a', 0.2), hm('#a0b0e0', 0.2)]);
    for (i = 0; i < 6; i++) streak(g, rnd() * SW, 50 + rnd() * 40, 40 + rnd() * 60, 1.4 + rnd(), [hm('#1c2450', 0.2), hm('#2e3a70', 0.2), hm('#6a7ab0', 0.2)]);
    [[160, 22, 1.1, 1], [212, 18, 0.9, 0], [222, 28, 0.8, 1], [330, 40, 0.9, 0], [470, 26, 1, 1]].forEach(function (q) { bat(g, q[0], q[1], q[2], hm('#0e1028', 0.08), !!q[3]); });
    L.push({ c: far, f: 0.02 });

    /* Far across the misty valley, the Haunted Mansion on its hill, one
       window lit; dark hills rolling away, crooked trees along them. */
    var fh = strip(), f = fh.getContext('2d');
    var ff = function (xx) { var u = (xx - 236) / 70; return 100 + wv(xx, 2, 1) * 3 + wv(xx, 5, 0.4) * 1.2 - 14 * Math.exp(-u * u); };
    land(f, ff, [hm('#1a2048', 0.35), hm('#222a58', 0.35), hm('#6a7ab8', 0.3)], 6);
    hauntedHouse(f, 236, ff(236) + 1, 0.82, hm('#161c40', 0.3), hm('#8a9ad0', 0.3), '#ffd27a', 2);
    [[176, 9, 1], [192, 7, -1], [296, 10, -1], [60, 8, 1], [130, 6, -1], [400, 7, 1], [460, 9, -1]].forEach(function (q) { twisty(f, q[0], ff(q[0]) + 1, q[1], -Math.PI / 2 + q[2] * 0.2, 1.2, 1, q[2] * 2.4, [hm('#161c40', 0.3), hm('#161c40', 0.3), hm('#3a4478', 0.3)], rnd); });
    // a path winding up to its door
    for (y = ff(360) + 1; y < 112; y += HP) R(f, 236 + Math.sin(y * 0.5) * 6 + (y - ff(360)) * 1.2, y, 1.5 + (y - ff(236)) * 0.06, HP, hm('#4a5488', 0.3));
    haze(f, 86, 30, '#a8b8f0', 0.35); mist(f, 96, 20, hz);
    L.push({ c: fh, f: 0.04 });

    /* The graveyard itself, rolling: headstones every which way, a little
       crypt with its door ajar and a glow inside, crooked trees, mist lying
       in the dips, will-o'-wisps bobbing between the stones. */
    var gy = strip(), m = gy.getContext('2d');
    var mf = function (xx) { return 106 + wv(xx, 2, 2.4) * 3 + wv(xx, 3, 0.9) * 2; };
    land(m, mf, [hm('#1a2a44', 0.2), hm('#26385a', 0.2), hm('#6a9ab0', 0.2)], 8);
    var GS = [hm('#4a4c72', 0.2), hm('#7a7ea8', 0.2), hm('#b4bce0', 0.18), hm('#3a6a5a', 0.2)];
    crypt(m, 88, mf(101) + 1.5, 26, 18, [hm('#4a4c72', 0.2), hm('#7a7ea8', 0.2), hm('#b8c0e4', 0.18)], '#8affd0');
    [[60, 18, 1], [150, 22, -1], [262, 20, 1], [400, 24, -1], [480, 16, 1]].forEach(function (q) { twisty(m, q[0], mf(q[0]) + 2, q[1], -Math.PI / 2 + q[2] * 0.12, 2.4, 2, q[2] * 2.2, [hm('#0e1428', 0.15), hm('#1a2038', 0.15), hm('#4a5a80', 0.15)], rnd); });
    for (x = 4; x < SW; x += 7 + rnd() * 9) {
      if (x > 80 && x < 120) continue;
      var sw2 = 3.6 + rnd() * 2.6;
      headstone(m, x, mf(x) + 3 + rnd() * 3, sw2, sw2 * (1.2 + rnd() * 0.6), Math.floor(rnd() * 4), (rnd() - 0.5) * 0.25, GS);
    }
    haze(m, 100, 16, '#b8c8f8', 0.35);
    // the jamboree: party lanterns strung between two old trees, and jack-o'-lanterns among the stones
    var LCS = ['#ffa040', '#c080ff', '#7affa0', '#ff70b0'];
    [[150, 262], [400, 480]].forEach(function (q, qi) {
      var y0 = mf(q[0]) - 15, y1 = mf(q[1]) - 15;
      line(m, q[0], y0, q[1], y1, HP, hm('#0e1428', 0.15), 7);
      for (var t = 1; t < 10; t++) { var lx = q[0] + (q[1] - q[0]) * t / 10, ly = y0 + (y1 - y0) * t / 10 + 7 * 4 * (t / 10) * (1 - t / 10) + 0.8, lc = LCS[(t + qi) % 4]; glow(m, lx, ly + 1, 4, lc, 0.7); oval(m, lx, ly + 1, 1, 1.3, lc); R(m, lx - HP / 2, ly - 0.4, HP, 0.6, hm('#0e1428', 0.15)); R(m, lx - 0.5, ly + 0.4, HP, HP, '#ffffff'); }
    });
    [[36, 2], [196, 2.2], [326, 1.8], [470, 2]].forEach(function (q) { pumpkin(m, q[0], mf(q[0]) + 4, q[1], ['#a04018', '#ee7a24', '#ffb85a', '#3a5a2a'], true); });
    [[40, 94], [130, 100], [214, 90], [300, 98], [356, 92], [446, 102]].forEach(function (q) { wisp(m, q[0], q[1], 0.8); });
    L.push({ c: gy, f: 0.09 });

    /* In front, kept low: friendly old headstones with moss on them, the
       railings and their gate, a jack-o'-lantern or two, mist curling. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + wv(xx, 3, 1.7) * 1.6 + wv(xx, 7, 0.5) * 0.6; };
    land(n, nf, ['#0e1a26', '#182a36', '#3a6a6a'], 5);
    var NS = ['#3e4064', '#6a6e98', '#a8b0d8', '#3a7a5a'];
    railings(n, 180, 300, function (xx) { return nf(xx) + 1; }, 13, '#0c0e22', '#2a3058');
    [[20, 6, 0, -0.06], [44, 5, 1, 0.05], [130, 6.5, 3, 0.03], [150, 4.5, 0, -0.08], [330, 5.5, 2, 0.04], [366, 6, 0, -0.04], [452, 5, 3, 0.06], [486, 6, 1, -0.05]].forEach(function (q) { headstone(n, q[0], nf(q[0]) + 2, q[1], q[1] * 1.5, q[2], q[3], NS); });
    [[86, 3.2], [404, 2.8], [240, 2.4]].forEach(function (q) { pumpkin(n, q[0], nf(q[0]) + 1.5, q[1], ['#a04018', '#ee7a24', '#ffb85a', '#3a5a2a'], true); });
    haze(n, 112, 14, '#c8d8ff', 0.3);
    [[70, 102], [262, 96], [420, 104]].forEach(function (q) { wisp(n, q[0], q[1], 1); });
    L.push({ c: nr, f: 0.2 });
    return L;
  };

  /* ---- 52 · The Haunted Mansion ---- */
  /* Damask wallpaper: a repeating flourish in a lighter purple — a bud on a
     stalk between two curls, set in a diamond trellis. */
  var damask = function (g, x0, y0, x1, y1, c, cw, ch) {
    cw = SW / Math.round(SW / cw);   // a whole number of repeats to the strip, so it meets itself at the seam
    for (var y = y0; y < y1; y += ch) for (var x = x0 + ((y - y0) / ch % 2 ? cw / 2 : 0); x < x1; x += cw) {
      var cx = x + cw / 2, cy = y + ch / 2;
      oval(g, cx, cy - ch * 0.12, cw * 0.1, ch * 0.14, c[1]); R(g, cx - HP / 2, cy, HP, ch * 0.22, c[1]);
      [-1, 1].forEach(function (d) {
        for (var t = 0; t < 1; t += 0.08) R(g, cx + d * (cw * 0.1 + Math.sin(t * Math.PI) * cw * 0.22), cy + ch * 0.12 - t * ch * 0.32, HP, HP, c[0]);
        R(g, cx + d * cw * 0.32 - HP / 2, cy - ch * 0.22, HP, HP, c[1]);
      });
      R(g, cx - HP / 2, cy - ch * 0.34, HP, HP, c[1]);
      R(g, x, y, HP, HP, c[0]);
    }
  };
  /* A tall arched window on the night: the sky deepening upwards, stars,
     perhaps the moon; leaded panes, a deep sill, curtains tied back.
     c = {frame: [shade, body, light], sky: [top, bottom], drape: [shade, body, light], tie} */
  var archWindow = function (g, x, top, w, h, c, rnd, moonAt) {
    var r = w / 2, cx = x + r, y;
    // the opening and the sky through it
    for (y = top; y < top + h; y += HP) {
      var k = (y - top) / h, hw = y < top + r ? Math.sqrt(Math.max(0, r * r - (top + r - y) * (top + r - y))) : r;
      R(g, cx - hw, y, hw * 2, HP, mix(c.sky[0], c.sky[1], k));
    }
    for (var i = 0; i < w * h / 30; i++) { var sx = x + 1 + rnd() * (w - 2), sy = top + r * 0.6 + rnd() * (h * 0.7); if (Math.abs(sx - cx) < r - 1) R(g, sx, sy, HP, HP, rnd() > 0.7 ? '#ffffff' : '#c8d0ff'); }
    if (moonAt) moon(g, cx + moonAt[0] * r, top + moonAt[1] * h, moonAt[2] * r, ['#b8c0e0', '#f2f2ff', '#ffffff', '#c8cce8'], ['#c8d0ff', 0.6]);
    // the leading: a grid of thin bars, an arch of them at the top
    for (var lx = x + w / 4; lx < x + w - 0.1; lx += w / 4) R(g, lx - HP / 2, top + 1, HP, h - 1, c.frame[0]);
    for (y = top + r; y < top + h; y += h / 6) R(g, x, y, w, HP, c.frame[0]);
    ring(g, cx, top + r, r - HP, r + 0.8, c.frame[1], top + r); R(g, x - 0.8, top + r, 0.8, h - r, c.frame[1]); R(g, x + w, top + r, 0.8, h - r, c.frame[0]);
    ring(g, cx, top + r, r * 0.45, r * 0.45 + HP, c.frame[0], top + r);
    R(g, x - 2, top + h, w + 4, 1.5, c.frame[2]); R(g, x - 2, top + h + 1.5, w + 4, 1, c.frame[0]);
    // the curtains, gathered and tied back
    [-1, 1].forEach(function (d) {
      var ex = d < 0 ? x - 1 : x + w + 1;
      span(g, top - 4, top + h + 2, function (yy) { var k = (yy - top + 4) / (h + 6), pinch = Math.exp(-Math.pow((k - 0.55) / 0.12, 2)); return d < 0 ? ex - 4 + pinch * 1.2 : ex - (3.6 - pinch * 2) * (k < 0.6 ? 0.7 + k * 0.5 : 1.1); }, function (yy) { var k = (yy - top + 4) / (h + 6), pinch = Math.exp(-Math.pow((k - 0.6) / 0.12, 2)); return d < 0 ? ex + (3.6 - pinch * 2) * (k < 0.6 ? 0.7 + k * 0.5 : 1.1) : ex + 4 - pinch * 1.2; }, c.drape[1]);
      for (var fx = -2; fx < 3; fx += 2) R(g, ex + fx, top - 4, HP, h * 0.55, c.drape[0]);
      R(g, d < 0 ? ex - 3.5 : ex - 1.5, top - 4, HP, h + 4, c.drape[2]);
      R(g, ex - 2.5, top + h * 0.6, 5, 1, c.tie); disc(g, ex + d * 2.4, top + h * 0.6 + 2, 0.8, c.tie);
    });
    // the pelmet across the top, swagged
    R(g, x - 6, top - 6, w + 12, 2.5, c.drape[1]); R(g, x - 6, top - 6, w + 12, HP, c.drape[2]);
    for (var sx2 = x - 6; sx2 < x + w + 6; sx2 += 5) { oval(g, sx2 + 2.5, top - 3.5, 2.5, 1.5, c.drape[1]); R(g, sx2 + 2.5, top - 2.3, HP, 1.2, c.tie); }
  };
  /* A portrait in a gilt frame. who: 'bear' (the family cat, done up in a
     ruff), 'lady' (a ghostly lady with very tall hair), 'gent' (a smiling
     gentleman ghost in a top hat). c = {gold: [shade, body, light], bg} */
  var portrait = function (g, x, y, w, h, who, c) {
    R(g, x - 1.5, y - 1.5, w + 3, h + 3, c.gold[0]); R(g, x - 1.5, y - 1.5, w + 2.5, h + 2.5, c.gold[1]); R(g, x - 1.5, y - 1.5, w + 3, HP, c.gold[2]); R(g, x - 1.5, y - 1.5, HP, h + 3, c.gold[2]);
    for (var t = 0; t < w + 3; t += 1.5) R(g, x - 1.5 + t, y - 1, HP, HP, c.gold[0]);
    R(g, x, y, w, h, c.bg); for (var yy = y; yy < y + h; yy += HP) R(g, x, yy, w, HP, mix(c.bg, '#000000', (yy - y) / h * 0.35));
    var cx = x + w / 2, cy = y + h * 0.45;
    if (who === 'bear') {
      // Bear in a lace ruff: grey, round, green eyes, very pleased with himself
      oval(g, cx, y + h - 1, w * 0.36, h * 0.18, '#3a4a6a');
      for (var a = 0; a < 6.28; a += 0.5) disc(g, cx + Math.cos(a) * w * 0.2, cy + h * 0.2 + Math.sin(a) * h * 0.05, w * 0.07, '#f4f0f8');
      disc(g, cx, cy, w * 0.24, '#8a8a96'); disc(g, cx - w * 0.06, cy - w * 0.06, w * 0.12, '#a8a8b4');
      [-1, 1].forEach(function (d) { span(g, cy - w * 0.36, cy - w * 0.12, function (yv) { return cx + d * w * 0.16 - (yv - cy + w * 0.36) * 0.35; }, function (yv) { return cx + d * w * 0.16 + (yv - cy + w * 0.36) * 0.35; }, '#8a8a96'); R(g, cx + d * w * 0.1 - HP / 2, cy - w * 0.04, HP * 2, HP * 2, '#9aff8a'); });
      R(g, cx - HP / 2, cy + w * 0.06, HP, HP, '#e89ab0');
    } else if (who === 'lady') {
      oval(g, cx, y + h - 1, w * 0.32, h * 0.2, '#6a4a8a');
      oval(g, cx, cy - h * 0.18, w * 0.2, h * 0.3, '#b8b0d8'); disc(g, cx, cy + h * 0.02, w * 0.17, '#e8f0ff');
      R(g, cx - w * 0.08, cy, HP, HP, '#2a2040'); R(g, cx + w * 0.06, cy, HP, HP, '#2a2040'); R(g, cx - w * 0.04, cy + w * 0.08, w * 0.08, HP, '#d07a9a');
      disc(g, cx + w * 0.12, cy - h * 0.38, 0.8, '#ff8ab0');
    } else {
      oval(g, cx, y + h - 1, w * 0.34, h * 0.2, '#2a3048'); R(g, cx - HP, y + h * 0.72, HP * 2, h * 0.15, '#ffffff');
      disc(g, cx, cy + h * 0.02, w * 0.18, '#e0f4ec');
      R(g, cx - w * 0.2, cy - h * 0.14, w * 0.4, HP * 1.5, '#2a2a3a'); R(g, cx - w * 0.13, cy - h * 0.38, w * 0.26, h * 0.25, '#2a2a3a');
      R(g, cx - w * 0.08, cy, HP, HP, '#2a2040'); R(g, cx + w * 0.06, cy, HP, HP, '#2a2040');
      R(g, cx - w * 0.14, cy + w * 0.08, w * 0.28, HP, '#6a5a5a'); R(g, cx - w * 0.16, cy + w * 0.06, HP, HP, '#6a5a5a'); R(g, cx + w * 0.14, cy + w * 0.06, HP, HP, '#6a5a5a');
    }
  };
  // a candle sconce: a gilt bracket on the wall holding three candles, each flame in its own glow
  var sconce = function (g, x, y, gold) {
    glow(g, x, y - 3, 16, '#ffc860', 0.7);
    R(g, x - HP, y, 1, 3, gold[1]); oval(g, x, y + 3, 1.2, 0.8, gold[1]);
    line(g, x - 3, y - 0.5, x + 3, y - 0.5, HP, gold[1], 1.6);
    [-3, 0, 3].forEach(function (d) { R(g, x + d - 0.6, y - 1.2, 1.2, 0.6, gold[2]); R(g, x + d - 0.4, y - 4 - (d ? 0 : 1), 0.8, 3 + (d ? 0 : 1), '#f4ecdc'); R(g, x + d - HP / 2, y - 5.4 - (d ? 0 : 1), HP, 1.2, '#ffd060'); R(g, x + d - HP / 2, y - 5 - (d ? 0 : 1), HP, HP, '#fff8d0'); });
  };
  // a chandelier: a gilt ring of candles on its chain, all lit
  var chandelier = function (g, x, y, s, gold) {
    glow(g, x, y, 26 * s, '#ffc860', 0.6);
    R(g, x - HP / 2, -240, HP, y + 240 - 4 * s, gold[0]);
    oval(g, x, y, 9 * s, 1.6 * s, gold[0]); oval(g, x, y - HP, 8.6 * s, 1.2 * s, gold[1]); R(g, x - 8 * s, y - 1.2 * s, 6 * s, HP, gold[2]);
    for (var i = 0; i < 4; i++) line(g, x, y - 4 * s, x - 8 * s + i * 5.3 * s, y, HP, gold[1]);
    disc(g, x, y + 1.5 * s, 1.4 * s, gold[1]); R(g, x - HP / 2, y + 2.6 * s, HP, 2 * s, gold[1]);
    for (i = 0; i < 6; i++) { var cx = x - 8 * s + i * 3.2 * s; R(g, cx - 0.4, y - 3 * s, 0.8, 2.6 * s, '#f4ecdc'); R(g, cx - HP / 2, y - 3 * s - 1.2, HP, 1.2, '#ffd060'); glow(g, cx, y - 3 * s - 1, 3, '#ffe090', 0.8); }
  };

  GEN.mansion = function (rnd, th) {
    var L = [], i, j, x, y;
    /* Through the archways, the great hall beyond: a grand staircase sweeps
       up past a tall moonlit window to the gallery, its banister curling at
       the foot, a chandelier blazing over it. (The level may climb or sink,
       so these layers reach well above and below the screen.) */
    var LIFT = 400;
    var hl = tallStrip(0.03, LIFT), h = hl.c.getContext('2d'), HT = -hl.e;
    R(h, 0, HT, SW, H - HT, '#2a1642');
    damask(h, 0, HT, SW, H, ['#341e4e', '#3c2458'], 10, 13);
    var ST = ['#2a1420', '#4e2838', '#74404e'], CAR = ['#6a1a2a', '#a02c3e'], BAL = ['#3a1c2a', '#6a3a44', '#a0705a'];
    [0, 256].forEach(function (ox) {
      // the tall window behind the gallery, the moon in it
      archWindow(h, ox + 34, 6, 26, 40, { frame: ['#1a0c20', '#3a2440', '#6a5070'], sky: ['#141a48', '#3a4a8a'], drape: ['#3a0e20', '#5a1a30', '#7a3048'], tie: '#a08040' }, rnd, [0.15, 0.36, 0.42]);
      // the gallery: a landing along the back, balusters along its edge
      R(h, ox + 8, 50, 124, 3, ST[1]); R(h, ox + 8, 50, 124, HP, ST[2]); R(h, ox + 8, 53, 124, 1, ST[0]);
      for (x = ox + 10; x < ox + 130; x += 2.2) { R(h, x, 44, 1, 6, BAL[1]); R(h, x, 44, HP, 6, BAL[2]); }
      R(h, ox + 8, 43, 124, 1.2, BAL[1]); R(h, ox + 8, 43, 124, HP, BAL[2]);
      // under the gallery, a doorway with candlelight beyond, and a ghost peeping round it
      R(h, ox + 60, 76, 22, 48, '#1a0c24'); oval(h, ox + 71, 76, 11, 8, '#1a0c24', true);
      glow(h, ox + 71, 108, 18, '#ffb860', 0.6); R(h, ox + 62, 112, 18, 12, '#3a1c24');
      oval(h, ox + 80, 92, 3.4, 4, '#e8f0ff'); R(h, ox + 76.6, 92, 3.4, 5, '#e8f0ff'); R(h, ox + 78, 91, HP, HP, '#2a2040'); R(h, ox + 79.6, 91, HP, HP, '#2a2040');
      ring(h, ox + 71, 76, 11, 12.5, BAL[1], 76); R(h, ox + 58.5, 76, 1.5, 48, BAL[1]); R(h, ox + 82, 76, 1.5, 48, BAL[0]);
      // the grand staircase: rising to the left up to the gallery, a red runner up its middle
      for (var st = 0; st < 31; st++) {
        var sx = ox + 236 - st * 3.4, sy = 124 - st * 2.4;
        R(h, sx, sy, 26, 2.4, ST[1]); R(h, sx, sy, 26, HP, ST[2]); R(h, sx, sy + 2.4 - HP, 26, HP, ST[0]);
        R(h, sx + 8, sy, 10, 2.4, CAR[1]); R(h, sx + 8, sy, 10, HP, '#d0566a'); R(h, sx + 8, sy + 2.4 - HP, 10, HP, CAR[0]);
        R(h, sx + 8, sy + 2.4 - HP * 2, 10, HP, '#c8a050');
      }
      // the underside of the flight, and its balusters and rail on the near side
      for (x = ox + 131; x < ox + 262; x += HP) { var ty = 124 - (ox + 236 - x) / 3.4 * 2.4 + 2.4; if (ty < 124) R(h, x, ty, HP, 124 - ty, '#22101e'); }
      for (st = 0; st < 31; st += 1) { var bx = ox + 238 - st * 3.4 + 1.2, by = 124 - st * 2.4; R(h, bx, by - 6, HP * 2, 6, BAL[1]); R(h, bx, by - 6, HP, 6, BAL[2]); }
      line(h, ox + 240, 117, ox + 133, 41.5, 1.2, BAL[1]); line(h, ox + 240, 116.6, ox + 133, 41.1, HP, BAL[2]);
      // the newel post, curling at the foot, a lamp on top
      R(h, ox + 239, 113, 3, 11, BAL[1]); R(h, ox + 239, 113, HP, 11, BAL[2]); R(h, ox + 238.4, 112, 4.2, 1.2, BAL[2]);
      glow(h, ox + 240.5, 106, 10, '#ffc860', 0.7); R(h, ox + 239.5, 106, 2, 6, '#c8a050'); oval(h, ox + 240.5, 106, 2, 2.5, '#ffe6a0'); R(h, ox + 240, 104.5, 1, 1.5, '#fffbe0');
      // the floor of the hall, and a rug
      R(h, ox, 124, 256, H - 124, '#1e0e18'); R(h, ox, 124, 256, HP, '#4a2834');
      chandelier(h, ox + 178, 34, 1.2, ['#7a5a20', '#c8a050', '#fff0a0']);
    });
    L.push({ c: hl.c, f: hl.f, y: hl.y });

    /* The room we're in: purple damask between tall moonlit windows, gilt
       portraits that watch you go by (Bear among them, in a ruff), candle
       sconces glowing, dark panelling below — and wide archways through to
       the hall. */
    var wl = tallStrip(0.07, LIFT), w = wl.c.getContext('2d'), WT = -wl.e;
    var WP = '#3a1e54', WD = ['#46286a', '#54347a'];
    var arches = [[4, 76], [260, 76]];
    var inArch = function (xx, yy) { return arches.some(function (a) { var r = a[1] / 2, cx = a[0] + r; return xx >= a[0] && xx < a[0] + a[1] && (yy > 40 || Math.pow(xx - cx, 2) + Math.pow(yy - 40, 2) < r * r * 0.82); }); };
    for (x = 0; x < SW; x += HP) {
      var open = arches.some(function (a) { return x >= a[0] && x < a[0] + a[1]; });
      if (!open) { R(w, x, WT, HP, H - WT, WP); continue; }
      var a2 = arches.filter(function (a) { return x >= a[0] && x < a[0] + a[1]; })[0], r2 = a2[1] / 2, top2 = 14 + r2 - Math.sqrt(Math.max(0, r2 * r2 - Math.pow(x - a2[0] - r2, 2)));
      R(w, x, WT, HP, top2 - WT, WP);
    }
    // the damask, everywhere but the archways
    var dm = BB.surface(SW, H + wl.e), dg = dm.getContext('2d'); dg.translate(0, wl.e);
    damask(dg, 0, WT, SW, H, WD, 12, 16);
    w.save(); w.beginPath();
    for (x = 0; x < SW; x += HP) {
      var aa = arches.filter(function (a) { return x >= a[0] && x < a[0] + a[1]; })[0];
      if (!aa) { w.rect(x, WT, HP, H - WT); continue; }
      var rr = aa[1] / 2; w.rect(x, WT, HP, 14 + rr - Math.sqrt(Math.max(0, rr * rr - Math.pow(x - aa[0] - rr, 2))) - WT);
    }
    w.clip(); w.drawImage(dm, 0, -wl.e, SW, H + wl.e); w.restore();
    // the archways' mouldings, and the columns either side
    var GD = ['#7a5a20', '#c8a050', '#fff0a0'], MB = ['#2a1438', '#4a2a5e', '#6e4a86'];
    arches.forEach(function (a) {
      var r = a[1] / 2, cx = a[0] + r;
      ring(w, cx, 14 + r, r, r + 2, MB[1], 14 + r); ring(w, cx, 14 + r, r + 1.5, r + 2.2, GD[1], 14 + r);
      R(w, cx - 1.5, 13, 3, 4, GD[1]); R(w, cx - 1, 13.5, 1, 2, GD[2]);
      [a[0] - 3, a[0] + a[1]].forEach(function (px) { R(w, px, 14 + r, 3, H, MB[1]); R(w, px, 14 + r, HP, H, MB[2]); R(w, px + 2.2, 14 + r, 0.8, H, MB[0]); R(w, px - 0.6, 14 + r, 4.2, 1.5, GD[1]); });
    });
    // the windows, with the moon in one
    [[96, 0], [180, 1], [352, 0], [436, 0]].forEach(function (q) { archWindow(w, q[0], 22, 22, 50, { frame: ['#1a0c20', '#3a2440', '#6a5070'], sky: ['#121848', '#3a4a8a'], drape: ['#4a0e24', '#6e1a34', '#9a3a52'], tie: '#c8a050' }, rnd, q[1] ? [0, 0.32, 0.5] : null); });
    // the portraits between them, and the sconces
    portrait(w, 146, 34, 14, 18, 'bear', { gold: GD, bg: '#2a3a4a' });
    portrait(w, 222, 30, 14, 22, 'lady', { gold: GD, bg: '#3a2a4a' });
    portrait(w, 404, 32, 14, 20, 'gent', { gold: GD, bg: '#2a3a3a' });
    [[132, 52], [212, 46], [392, 52], [478, 46]].forEach(function (q) { sconce(w, q[0], q[1], GD); });
    // the panelling below: dark wood in raised panels, a gilt rail along its top
    for (x = 0; x < SW; x += HP) {
      if (inArch(x, 100)) continue;
      R(w, x, 98, HP, H - 98, '#2a1420'); R(w, x, 98, HP, 1.5, GD[1]); R(w, x, 99.5, HP, HP, GD[0]);
    }
    for (x = 0; x < SW; x += 16) {
      if (inArch(x + 2, 104) || inArch(x + 14, 104)) continue;
      R(w, x + 2, 103, 12, 18, '#3a1e2c'); R(w, x + 2, 103, 12, HP, '#5a3444'); R(w, x + 2, 103, HP, 18, '#5a3444'); R(w, x + 13.5, 103, HP, 18, '#1a0a12');
    }
    // the gilt cornice along the top of the wall, velvet swags hung from it, tied up with tassels
    R(w, 0, -1, SW, 2.5, GD[1]); R(w, 0, -1, SW, HP, GD[2]); R(w, 0, 1.5, SW, HP, GD[0]);
    for (x = 0; x < SW; x += 64) {
      for (var sx2 = 0; sx2 < 64; sx2 += HP) { var sag = 2 + Math.sin(sx2 / 64 * Math.PI) * 9; R(w, x + sx2, 2, HP, sag - 2, '#4a0e24'); R(w, x + sx2, sag - 2, HP, 2, '#6e1a34'); R(w, x + sx2, sag, HP, HP, '#9a3a52'); }
      R(w, x - 1, 2, 2, 12, '#6e1a34'); R(w, x - 1, 2, HP, 12, '#9a3a52'); disc(w, x, 15, 1.2, GD[1]); R(w, x - HP / 2, 16, HP, 4, GD[1]); R(w, x - 1, 19, 2, 1.5, GD[1]);
    }
    L.push({ c: wl.c, f: wl.f, y: wl.y });

    /* Nearest: chandeliers hanging on their long chains, blazing. */
    var nr = tallStrip(0.14, LIFT), n = nr.c.getContext('2d');
    chandelier(n, 228, 22, 1.4, GD);
    chandelier(n, 484, 18, 1.2, GD);
    L.push({ c: nr.c, f: nr.f, y: nr.y });
    return L;
  };

  /* ---- 53 · The Witch's Wood ---- */
  /* The witch's cottage, far off: crooked walls leaning every way, a roof
     like a squashed hat, a chimney with a kink in it puffing green smoke,
     and one round window lit. c = [wall, roof, shade], lit */
  var cottage6 = function (g, x, base, s, c, lit, smoke) {
    span(g, base - 9 * s, base, function (yy) { return x - 6 * s + (base - yy) * 0.12; }, function (yy) { return x + 6 * s + (base - yy) * 0.3; }, c[0]);
    span(g, base - 9 * s, base, function (yy) { return x + 3 * s + (base - yy) * 0.3; }, function (yy) { return x + 6 * s + (base - yy) * 0.3; }, c[2]);
    // the roof: sagging, overhanging, its tip flopped over
    for (var y = 0; y < 12 * s; y += HP) {
      var k = y / (12 * s), hw = (8.5 * s) * Math.pow(k, 0.9), xx = x + 2.6 * s + Math.pow(1 - k, 2.4) * 5 * s;
      R(g, xx - hw, base - 9 * s - 12 * s + y, hw * 2, HP, c[1]); R(g, xx - hw, base - 9 * s - 12 * s + y, Math.max(HP, hw * 0.18), HP, mix(c[1], '#c8b0f0', 0.45));
    }
    // the chimney, kinked, and its smoke curling up
    line(g, x + 4 * s, base - 14 * s, x + 5 * s, base - 19 * s, 1.6 * s, c[1]); line(g, x + 5 * s, base - 19 * s, x + 4 * s, base - 22 * s, 1.6 * s, c[1]);
    for (var i = 0; i < 9; i++) { g.globalAlpha = 0.5 - i * 0.045; disc(g, x + 4 * s + Math.sin(i * 0.9) * 2.2 * s + i * 0.6 * s, base - 24 * s - i * 2.6 * s, (0.9 + i * 0.3) * s, smoke); }
    g.globalAlpha = 1;
    glow(g, x, base - 5 * s, 9 * s, lit, 0.8); disc(g, x, base - 5 * s, 1.6 * s, lit); R(g, x - HP / 2, base - 6.6 * s, HP, 3.2 * s, c[2]); R(g, x - 1.6 * s, base - 5 * s - HP / 2, 3.2 * s, HP, c[2]);
    R(g, x - 4.5 * s, base - 5 * s, 2.2 * s, 5 * s, c[2]);
  };
  // a firefly: a tiny bright dot in its own little glow
  var firefly = function (g, x, y, col) { glow(g, x, y, 3.2, col, 0.8); R(g, x - HP / 2, y - HP / 2, 1, 1, '#fffff0'); };
  // a sleepy, smiling face in the bark of an old tree: shut eyes, a little smile, rosy cheeks
  var treeFace = function (g, x, y, s, dark, cheek) {
    [-1, 1].forEach(function (d) { for (var t = 0; t <= 1; t += 0.1) R(g, x + d * 2.2 * s + (t - 0.5) * 2 * s, y + Math.sin(t * Math.PI) * 0.7 * s, HP, HP, dark); g.globalAlpha = 0.45; disc(g, x + d * 3 * s, y + 1.6 * s, 0.9 * s, cheek); g.globalAlpha = 1; });
    for (var t = 0; t <= 1; t += 0.08) R(g, x + (t - 0.5) * 2.6 * s, y + 2.6 * s + Math.sin(t * Math.PI) * 0.9 * s, HP, HP, dark);
  };
  var SHROOM_T = ['#1e8a8a', '#3ad8c8', '#bafff0', '#e8fff8', '#d8d0e8', '#5ab8b0'], SHROOM_V = ['#7a3aa8', '#c070f0', '#f0c8ff', '#fff0ff', '#e0d0e8', '#a060c8'];

  GEN.witchwood = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A deep purple night over the wood: a curl of new moon, stars thick
       as sugar, wisps of violet cloud. */
    var far = strip(), g = far.getContext('2d');
    stars(g, 190, 2, 90, rnd, ['#ffffff', '#f0e0ff', '#d8fff0', '#fff4d8']);
    var MX = 214, MY = 26;
    glow(g, MX, MY, 30, '#e8d8ff', 0.6); crescent(g, MX, MY, 9, 4, -2.4, 8.4, '#fff4d8'); crescent(g, MX - 0.6, MY - 0.4, 7.6, 3.4, -2.2, 7.2, '#fffcf0');
    for (i = 0; i < 8; i++) streak(g, rnd() * SW, 30 + rnd() * 50, 40 + rnd() * 70, 1.4 + rnd() * 1.6, [hm('#2a1450', 0.2), hm('#4a2878', 0.2), hm('#9a6ac8', 0.2)]);
    [[150, 40, 0.9, 1], [162, 34, 0.7, 0], [300, 22, 0.8, 1]].forEach(function (q) { bat(g, q[0], q[1], q[2], hm('#120828', 0.08), !!q[3]); });
    L.push({ c: far, f: 0.02 });

    /* Far away over the treetops, on a hump of a hill, the witch's crooked
       cottage, its window lit and its chimney puffing green; twisty trees
       in silhouette going away into the violet mist. */
    var fh = strip(), f = fh.getContext('2d');
    var ff = function (xx) { var u = (xx - 196) / 44; return 98 + wv(xx, 2, 0.6) * 3 + wv(xx, 5, 2) * 1.4 - 16 * Math.exp(-u * u); };
    haze(f, 60, 40, '#b088e0', 0.25);
    land(f, ff, [hm('#22143e', 0.3), hm('#2c1a4e', 0.3), hm('#7a5aaa', 0.25)], 6);
    for (x = 4; x < SW; x += 6 + rnd() * 10) { if (Math.abs(x - 196) < 22) continue; twisty(f, x, ff(x) + 2, 9 + rnd() * 12, -Math.PI / 2 + (rnd() - 0.5) * 0.4, 1.5, 1, (rnd() > 0.5 ? 1 : -1) * 2.4, [hm('#22143e', 0.32), hm('#2a1a48', 0.32), hm('#5a3a80', 0.3)], rnd); }
    cottage6(f, 196, ff(196) + 1, 1.45, [hm('#76569a', 0.12), hm('#3a2a5e', 0.12), hm('#54407a', 0.12)], '#e0ff7a', hm('#8af0a0', 0.25));
    mist(f, 100, 16, hz);
    L.push({ c: fh, f: 0.045 });

    /* The wood itself: twisty trees with their tips rolled up, teal light
       running down their bark, great glowing toadstools in teal and violet
       lighting the ground round them, fireflies drifting, a purple mist
       lying along the ground. */
    var mw = strip(), m = mw.getContext('2d');
    var mf = function (xx) { return 110 + wv(xx, 2, 1.8) * 2.5 + wv(xx, 5, 0.2) * 1.2; };
    // a row of trees further back, dimmer
    for (x = 10; x < SW; x += 22 + rnd() * 20) twisty(m, x, mf(x) + 1, 18 + rnd() * 12, -Math.PI / 2 + (rnd() - 0.5) * 0.3, 2.2, 2, (rnd() > 0.5 ? 1 : -1) * 1.8, [hm('#1a0e30', 0.35), hm('#26163e', 0.35), hm('#3a7a80', 0.35)], rnd);
    haze(m, 84, 30, '#9a6ad0', 0.3);
    land(m, mf, [hm('#140c2c', 0.2), hm('#1e1238', 0.2), hm('#2a6a70', 0.25)], 6);
    [[24, 44, 1], [96, 56, -1], [168, 40, 1], [236, 52, -1], [318, 48, 1], [390, 60, -1], [462, 42, 1]].forEach(function (q) {
      twisty(m, q[0], mf(q[0]) + 2, q[1], -Math.PI / 2 + q[2] * 0.1, 3.8, 3, q[2] * 1.8, [hm('#0e0820', 0.15), hm('#1e1236', 0.15), hm('#3aa8a0', 0.15)], rnd);
      roots(m, q[0], mf(q[0]) + 2, 3.8, [hm('#0e0820', 0.15), hm('#1e1236', 0.15)]);
    });
    [[54, 16, 8, 0], [66, 9, 4.5, 1], [130, 11, 5.5, 1], [206, 18, 9, 0], [216, 9, 4, 0], [280, 13, 6.5, 1], [352, 20, 10, 0], [366, 10, 4.5, 1], [430, 14, 7, 0], [442, 8, 3.6, 1], [496, 12, 6, 1]].forEach(function (q) {
      glowcap(m, q[0], mf(q[0]) + 2, q[1], q[2], (q[3] ? SHROOM_V : SHROOM_T).map(function (c) { return hm(c, 0.1); }));
    });
    haze(m, 98, 18, '#a070e0', 0.35);
    for (i = 0; i < 36; i++) firefly(m, rnd() * SW, 24 + rnd() * 84, rnd() > 0.3 ? '#d8ff70' : '#7affe0');
    L.push({ c: mw, f: 0.09 });

    /* In front: old trees with friendly sleepy faces in their bark, more
       glowing toadstools at their feet, fireflies. Kept low. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + wv(xx, 3, 0.4) * 1.6 + wv(xx, 7, 1.2) * 0.6; };
    land(n, nf, ['#0e0a22', '#181030', '#245a60'], 5);
    [[80, 32, -1, true], [300, 36, 1, false], [440, 28, -1, false]].forEach(function (q) {
      twisty(n, q[0], nf(q[0]) + 2, q[1], -Math.PI / 2 + q[2] * 0.08, 6.5, 2, q[2] * 1.6, ['#0c0820', '#1e1434', '#44c0b0'], rnd);
      roots(n, q[0], nf(q[0]) + 2, 6.5, ['#0c0820', '#1e1434']);
      if (q[3]) treeFace(n, q[0] + 0.6, nf(q[0]) - 15, 0.85, '#0a0618', '#ff8ab0');
    });
    [[30, 8, 3.6, 1], [40, 5, 2.2, 0], [150, 10, 4.6, 0], [196, 6, 2.8, 1], [250, 9, 4, 1], [372, 11, 5, 0], [384, 6, 2.6, 1], [496, 8, 3.6, 0]].forEach(function (q) { glowcap(n, q[0], nf(q[0]) + 2, q[1], q[2], q[3] ? SHROOM_V : SHROOM_T); });
    for (i = 0; i < 16; i++) firefly(n, rnd() * SW, 30 + rnd() * 80, '#e8ff80');
    L.push({ c: nr, f: 0.2 });
    return L;
  };

  /* ---- 54 · Firework Night ---- */
  /* A firework burst, painted: trails of sparks spraying out from its
     heart, drooping as they go, brightest at their tips, in one colour
     going to white at the middle; a soft bloom of light behind it. */
  var burst = function (g, x, y, r, col, n, rnd) {
    glow(g, x, y, r * 1.5, col, 0.55);
    for (var k = 0; k < n; k++) {
      var a = k / n * Math.PI * 2 + rnd() * 0.15, rr = r * (0.82 + rnd() * 0.25);
      for (var t = 0.18; t <= 1; t += 0.045) {
        var px = x + Math.cos(a) * rr * t, py = y + Math.sin(a) * rr * t + t * t * r * 0.22;
        g.globalAlpha = 0.25 + t * 0.6; R(g, px, py, HP, HP, t < 0.4 ? mix(col, '#ffffff', 0.6) : col);
      }
      g.globalAlpha = 1; R(g, x + Math.cos(a) * rr - HP / 2, y + Math.sin(a) * rr + r * 0.22 - HP / 2, 1, 1, mix(col, '#ffffff', 0.5));
    }
    disc(g, x, y, Math.max(HP, r * 0.06), '#ffffff');
  };
  // a ring burst: a circle of sparks with a few falling stars below it
  var ringBurst = function (g, x, y, r, col) {
    glow(g, x, y, r * 1.3, col, 0.4);
    for (var a = 0; a < Math.PI * 2; a += 0.22) { R(g, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.92, 1, 1, col); R(g, x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.74, HP, HP, mix(col, '#ffffff', 0.4)); }
  };
  /* A chimney stack on the ridge: brick, a stone cap, a row of pots, smoke
     going up. c = [shade, body, light], pot */
  var stack = function (g, x, base, w, h, c, pot, smoke, n) {
    R(g, x, base - h, w, h, c[1]); R(g, x + w * 0.7, base - h, w * 0.3, h, c[0]); R(g, x, base - h, HP, h, c[2]);
    for (var y = base - h + 1.5; y < base; y += 1.5) for (var bx = x + ((y - base) / 1.5 % 2 ? 0 : 1); bx < x + w; bx += 2) R(g, bx, y, HP, HP, c[0]);
    R(g, x - 0.6, base - h - 1.2, w + 1.2, 1.2, c[2]); R(g, x - 0.6, base - h - HP, w + 1.2, HP, c[0]);
    for (var i = 0; i < n; i++) {
      var px = x + (i + 0.5) * w / n - 0.7;
      R(g, px, base - h - 3.4, 1.4, 2.2, pot[1]); R(g, px + 0.9, base - h - 3.4, 0.5, 2.2, pot[0]); R(g, px - 0.2, base - h - 3.6, 1.8, HP, pot[2]);
      if (smoke && i === 0) for (var j = 0; j < 7; j++) { g.globalAlpha = 0.35 - j * 0.045; disc(g, px + 0.7 + j * 1.4 + Math.sin(j) * 0.8, base - h - 5 - j * 2.2, 0.8 + j * 0.3, smoke); }
      g.globalAlpha = 1;
    }
  };
  /* A row of houses seen over the rooftops: some side-on under long slate
     roofs, some gable-end on with a round attic window; slates in courses,
     the ridges catching the coloured light just a little, windows lit or
     dark, chimney stacks puffing, an aerial or two. base = where their
     walls stand; s = size; tone hazes them; lit = how many windows are lit */
  var roofscape = function (g, base, s, rnd, tone, lit, rims) {
    for (var x = -4; x < SW;) {
      var w = (18 + rnd() * 18) * s, hw = (6 + rnd() * 9) * s, top = base - hw, rh = (6 + rnd() * 5) * s, gable = rnd() < 0.35, rim = rims[Math.floor(rnd() * rims.length)];
      var WL = [tone('#241c30'), tone(['#3a2c3e', '#2e3044', '#3e3036'][Math.floor(rnd() * 3)]), tone('#4e4256')], RF = [tone('#1c2036'), tone('#2c3250'), tone('#3e4668')];
      R(g, x, top, w, hw + 2, WL[1]); R(g, x + w - 1.5, top, 1.5, hw + 2, WL[0]); R(g, x, top, HP, hw + 2, WL[2]);
      if (gable) {
        span(g, top - rh, top, function (yy) { return x + (top - yy) / rh * w / 2; }, function (yy) { return x + w - (top - yy) / rh * w / 2; }, WL[1]);
        line(g, x - 1, top + 0.5, x + w / 2, top - rh - 0.6, 1, RF[1]); line(g, x + w + 1, top + 0.5, x + w / 2, top - rh - 0.6, 1, RF[0]); line(g, x - 1, top, x + w / 2, top - rh - 1, HP, mix(RF[2], rim, 0.35));
        var aw = 1.4 * s;
        if (rnd() < lit) glow(g, x + w / 2, top - rh * 0.35, aw * 3, '#ffb860', 0.5);
        disc(g, x + w / 2, top - rh * 0.35, aw + HP, WL[2]); disc(g, x + w / 2, top - rh * 0.35, aw, rnd() < lit ? '#ffd27a' : tone('#14182a'));
      } else {
        span(g, top - rh, top + 0.5, function (yy) { return x - 1.2 + (top - yy) * 0.9; }, function (yy) { return x + w + 1.2 - (top - yy) * 0.9; }, RF[1]);
        span(g, top - rh, top + 0.5, function (yy) { return x + w * 0.62 + (top - yy) * 0.3; }, function (yy) { return x + w + 1.2 - (top - yy) * 0.9; }, RF[0]);
        for (var y = top - rh + 1.5; y < top; y += 1.5) R(g, x - 1.2 + (top - y) * 0.9, y, w + 2.4 - (top - y) * 1.8, HP, mix(RF[1], RF[0], 0.6));
        R(g, x - 1.2 + rh * 0.9, top - rh, w + 2.4 - rh * 1.8, HP, mix(RF[2], rim, 0.4));
        R(g, x - 1.2, top, w + 2.4, HP, RF[0]);
        // a dormer in the slope
        if (rnd() > 0.45 && w > 20) { var dx = x + 4 + rnd() * (w - 12); R(g, dx, top - rh * 0.6, 4 * s, rh * 0.6, WL[1]); span(g, top - rh * 0.6 - 2 * s, top - rh * 0.6, function (yy) { return dx - 0.6 + (top - rh * 0.6 - yy) * 1.1; }, function (yy) { return dx + 4 * s + 0.6 - (top - rh * 0.6 - yy) * 1.1; }, RF[1]); var dl = rnd() < lit; if (dl) glow(g, dx + 2 * s, top - rh * 0.3, 4, '#ffb860', 0.5); R(g, dx + 0.8, top - rh * 0.5, 4 * s - 1.6, rh * 0.4, dl ? '#ffd27a' : tone('#14182a')); }
      }
      // the windows in the wall
      for (var wy = top + 2 * s; wy < base - 2.5 * s; wy += 5 * s) for (var wx = x + 2.5 * s; wx < x + w - 4 * s; wx += 5 * s) {
        var on = rnd() < lit;
        if (on) glow(g, wx + 1.2 * s, wy + 1.4 * s, 3.4 * s, '#ffb860', 0.45);
        R(g, wx, wy, 2.4 * s, 2.8 * s, on ? '#ffd27a' : tone('#161a2c')); if (on) R(g, wx, wy + 1.4 * s, 2.4 * s, HP, '#e8a050');
      }
      if (rnd() > 0.35) { var cx = x + w * (0.15 + rnd() * 0.55), ch = (4 + rnd() * 4) * s, cb = gable ? top - rh * (1 - Math.abs(cx - x - w / 2) / (w / 2)) + 1 : top - rh + 1; stack(g, cx, cb, (3.5 + rnd() * 3) * s, ch, [tone('#4a2224'), tone('#7a3430'), tone('#a85a48')], [tone('#5a2e22'), tone('#9a5432'), tone('#c88050')], tone('#8a86a8'), 1 + Math.floor(rnd() * 3)); }
      if (rnd() > 0.72) { var ax = x + w * 0.4, ay = gable ? top - rh : top - rh; R(g, ax, ay - 7 * s, HP, 7 * s, tone('#5a5a7a')); for (var k = 0; k < 4; k++) R(g, ax - 2 * s + k * 0.3, ay - 6 * s + k * 1.2 * s, (4 - k * 0.6) * s, HP, tone('#5a5a7a')); }
      x += w + (rnd() > 0.6 ? 3 + rnd() * 5 : -1);
    }
  };

  GEN.fireworks = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* The sky full of fireworks: big painted bursts in every colour, ring
       bursts, the trails of rockets still going up, smoke drifting lit from
       beneath, and stars between. (The game sets off live ones too.) */
    var far = strip(), g = far.getContext('2d');
    stars(g, 120, 2, 80, rnd, ['#ffffff', '#e8e0ff', '#fff0d8']);
    for (i = 0; i < 9; i++) streak(g, rnd() * SW, 30 + rnd() * 50, 50 + rnd() * 80, 2 + rnd() * 2, [hm('#2a2450', 0.2), hm('#4a3a6a', 0.25), hm('#a07aa8', 0.2)]);
    var FC = ['#ff6ab0', '#ffd040', '#6af0d0', '#8aff6a', '#b08aff', '#ff8a4a', '#6ab8ff'];
    [[40, 30, 18, 0, 26], [128, 18, 13, 1, 20], [214, 40, 22, 2, 30], [300, 22, 15, 3, 22], [380, 44, 19, 4, 26], [456, 18, 14, 5, 20], [262, 66, 9, 6, 14], [90, 60, 8, 3, 12]].forEach(function (q) { burst(g, q[0], q[1], q[2], FC[q[3]], q[4], rnd); });
    [[170, 54, 8, '#ffe070'], [440, 64, 7, '#ff8ad0'], [16, 70, 6, '#7af0ff']].forEach(function (q) { ringBurst(g, q[0], q[1], q[2], q[3]); });
    // rocket trails on their way up, sparkling
    [[340, 100, 60], [196, 104, 76], [496, 100, 70]].forEach(function (q) { for (y = q[1]; y > q[2]; y -= 1) { g.globalAlpha = (q[1] - y) / (q[1] - q[2]) * 0.7; R(g, q[0] + Math.sin(y * 0.3) * 0.4, y, HP, 1, '#ffe0b0'); } g.globalAlpha = 1; R(g, q[0] - HP, q[2] - 1, 1, 1, '#ffffff'); });
    L.push({ c: far, f: 0.015 });

    /* Far off on a hill, the bonfire: a blaze of orange, sparks going up,
       people round it in silhouette, its smoke leaning away; the lights of
       the town strung along the valley. */
    var bh = strip(), b = bh.getContext('2d');
    var bf = function (xx) { var u = (xx - 150) / 60; return 104 + wv(xx, 2, 2) * 2.5 + wv(xx, 5, 0.6) * 1 - 10 * Math.exp(-u * u); };
    for (i = 0; i < 12; i++) { b.globalAlpha = 0.18 - i * 0.012; disc(b, 150 + i * 6 + Math.sin(i) * 3, bf(150) - 14 - i * 5, 5 + i * 1.6, hm('#8a6a8a', 0.2)); }
    b.globalAlpha = 1;
    land(b, bf, [hm('#141634', 0.25), hm('#1a1c40', 0.25), hm('#4a3a6a', 0.25)], 6);
    var BX = 150, BB2 = bf(150) + 1;
    glow(b, BX, BB2 - 4, 40, '#ff8a30', 0.8); glow(b, BX, BB2 - 4, 16, '#ffc060', 0.9);
    span(b, BB2 - 13, BB2, function (yy) { var k = (yy - BB2 + 13) / 13; return BX - 6 * k - Math.sin(yy * 1.7) * 0.8 * k; }, function (yy) { var k = (yy - BB2 + 13) / 13; return BX + 6 * k + Math.sin(yy * 1.3) * 0.8 * k; }, '#ff7a20');
    span(b, BB2 - 10, BB2, function (yy) { var k = (yy - BB2 + 10) / 10; return BX - 3.6 * k; }, function (yy) { var k = (yy - BB2 + 10) / 10; return BX + 3.6 * k; }, '#ffc040');
    span(b, BB2 - 6, BB2, function (yy) { var k = (yy - BB2 + 6) / 6; return BX - 1.6 * k; }, function (yy) { var k = (yy - BB2 + 6) / 6; return BX + 1.6 * k; }, '#fff4b0');
    for (i = 0; i < 24; i++) R(b, BX - 6 + rnd() * 12 + i * 0.2, BB2 - 14 - rnd() * 20, HP, HP, rnd() > 0.5 ? '#ffd060' : '#ff9a40');
    [-12, -9, 9, 12.5, 15].forEach(function (d, di) { var px = BX + d, py = BB2 + 0.5; R(b, px - 0.6, py - 3.5, 1.2, 3.5, '#120e24'); disc(b, px, py - 4.2, 0.8, '#120e24'); if (di === 3) R(b, px - 0.5, py - 6.4, 1, 1.4, '#120e24'); });
    for (x = 0; x < SW; x += 2 + rnd() * 5) { if (Math.abs(x - BX) < 30) continue; y = bf(x) + 3 + rnd() * 5; glow(b, x, y, 2, '#ffc060', 0.6); R(b, x, y, HP, HP, '#ffe0a0'); }
    mist(b, 98, 20, hz);
    L.push({ c: bh, f: 0.035 });

    /* The rooftops: row behind row of slate, ridges catching the colours of
       the fireworks, dormers lit, chimney pots puffing, an aerial here and
       there. */
    var r1 = strip(), q1 = r1.getContext('2d');
    roofscape(q1, 110, 0.75, rnd, function (c) { return hm(c, 0.32); }, 0.4, ['#ff8ac8', '#ffd070', '#7af0e0', '#c8c8f0']);
    R(q1, 0, 110, SW, H - 110, hm('#1c2036', 0.32));
    L.push({ c: r1, f: 0.07 });
    var r2 = strip(), q2 = r2.getContext('2d');
    roofscape(q2, 122, 1.1, rnd, function (c) { return hm(c, 0.1); }, 0.45, ['#ff9ad0', '#ffe080', '#8af8e8', '#d0d0f8']);
    R(q2, 0, 122, SW, H - 122, hm('#161a2c', 0.1));
    L.push({ c: r2, f: 0.12 });

    /* In front, kept low: a near ridge with big chimney stacks and their
       pots, a weathervane, a string of party lights. */
    var nr = strip(), n = nr.getContext('2d');
    var NB = 123;
    R(n, 0, NB, SW, H - NB, '#141830'); R(n, 0, NB - 1, SW, 1, '#2a3050'); R(n, 0, NB - 1, SW, HP, '#c8a8e8');
    for (x = 0; x < SW; x += 2) R(n, x, NB, 1.5, 1, '#1e2440');
    [[40, 10, 12, 3], [196, 8, 10, 2], [330, 12, 14, 4], [460, 8, 11, 2]].forEach(function (q) { stack(n, q[0], NB, q[1], q[2], ['#4a2224', '#7a3430', '#a85a48'], ['#5a2e22', '#9a5432', '#c88050'], '#9a96b8', q[3]); });
    var LC = ['#ff6ab0', '#ffd040', '#6af0d0', '#b08aff', '#ff8a4a'];
    [[50, 196], [340, 470]].forEach(function (q, qi) { line(n, q[0], NB - 14, q[1], NB - 12, HP, '#2a2440', 5); for (var t = 1; t < 12; t++) { var lx = q[0] + (q[1] - q[0]) * t / 12, ly = NB - 14 + 2 * t / 12 + 5 * 4 * (t / 12) * (1 - t / 12) + 0.6, lc = LC[(t + qi) % 5]; glow(n, lx, ly, 2.6, lc, 0.7); R(n, lx - HP / 2, ly - HP / 2, 1, 1, lc); } });
    L.push({ c: nr, f: 0.2 });
    return L;
  };

  /* ---- 55 · The Witch's Tower ---- */
  /* Rough stone courses: blocks of uneven size in rows, mortar between,
     each block lit along its top and left, some mossy. c = [mortar, shade, body, light, moss] */
  var stones = function (g, x0, y0, x1, y1, rnd, c, tone) {
    R(g, x0, y0, x1 - x0, y1 - y0, c[0]);
    for (var y = y0, rh; y < y1; y += rh) {
      rh = 4 + Math.floor(rnd() * 3) * HP * 2;
      // (each course ends exactly where it began, a strip's width on, so it meets itself at the seam)
      for (var xs = x0 - rnd() * 8, x = xs; x < xs + (x1 - x0) - 0.01;) {
        var w = Math.min(5 + rnd() * 8, xs + (x1 - x0) - x); if (xs + (x1 - x0) - x - w < 4) w = xs + (x1 - x0) - x;
        var t = tone ? tone(x, y) : 0, body = mix(c[2], c[1], Math.min(1, t + rnd() * 0.3)), sag = (rnd() - 0.5) * 0.6;
        R(g, x + HP, y + HP + sag, w - HP, rh - HP, body); R(g, x + HP, y + HP + sag, w - HP, HP, mix(c[3], body, t)); R(g, x + HP, y + HP + sag, HP, rh - HP, mix(c[3], body, t + 0.2));
        R(g, x + w - HP, y + HP + sag, HP, rh - HP, c[1]); R(g, x + HP, y + rh - HP + sag, w - HP, HP, mix(c[1], body, 0.5));
        if (rnd() < 0.1) R(g, x + 1 + rnd() * (w - 3), y + rh - 1.2 + sag, 2 + rnd() * 2, 1, c[4]);
        x += w;
      }
    }
  };
  /* A jar on a shelf, sitting on base: a round flask, a tall bottle or a
     squat pot, corked; potions glowing in some. c = [glass, liquid, cork], lit */
  var jar = function (g, x, base, kind, c, lit) {
    if (lit) glow(g, x, base - 3, 6, c[1], 0.6);
    if (kind === 0) { disc(g, x, base - 2.2, 2.2, c[0]); oval(g, x, base - 1.6, 1.8, 1.4, c[1]); R(g, x - 0.6, base - 6, 1.2, 2, c[0]); R(g, x - 0.7, base - 6.6, 1.4, 0.8, c[2]); R(g, x - 1.2, base - 3.4, HP, 1, '#ffffff'); }
    else if (kind === 1) { R(g, x - 1, base - 6, 2, 6, c[0]); R(g, x - 1, base - 4, 2, 4, c[1]); R(g, x - 0.5, base - 7.5, 1, 1.5, c[0]); R(g, x - 0.6, base - 8, 1.2, 0.7, c[2]); R(g, x - 0.8, base - 5.6, HP, 2, '#ffffff'); }
    else { R(g, x - 1.8, base - 3.4, 3.6, 3.4, c[0]); R(g, x - 1.8, base - 2.2, 3.6, 2.2, c[1]); R(g, x - 2, base - 4, 4, 0.8, c[2]); R(g, x - 1.4, base - 3, HP, 1.4, '#ffffff'); }
  };
  // a bunch of dried herbs hanging head-down on a string
  var herbs = function (g, x, y, len, c, rnd) {
    R(g, x - HP / 2, y, HP, 2.4, '#c8b080');
    // the stalks fanning out from the tie, then leaves and flower-heads clustered down them, every which way
    for (var k = -2; k <= 2; k++) line(g, x, y + 2.4, x + k * 0.9, y + 2.4 + len * (0.8 + Math.abs(k) * 0.05), HP, c[0]);
    for (var i = 0; i < len * 3; i++) { var t = 0.2 + rnd() * 0.8, u = (rnd() - 0.5) * 2, px = x + u * (0.4 + t * 1.6), py = y + 2.4 + t * len, lr = 0.4 + rnd() * 0.5; disc(g, px, py, lr, u < -0.2 ? c[2] : rnd() > 0.4 ? c[1] : c[0]); }
    for (k = -1; k <= 1; k++) R(g, x + k * 1.2, y + 2.4 + len + 0.4, HP, 1 + Math.abs(k) * 0.4, c[0]);
    R(g, x - 1, y + 2, 2, 0.8, '#a8603a');
  };
  // a little bat hanging upside down asleep, wrapped in its wings
  var sleepyBat = function (g, x, y, col) {
    R(g, x - HP, y, HP, 1, col); R(g, x + HP * 0.5, y, HP, 1, col);
    oval(g, x, y + 3, 1.6, 2.4, col); R(g, x - 1, y + 5, HP, 0.8, col); R(g, x + 0.6, y + 5, HP, 0.8, col);
    R(g, x - 0.9, y + 3.6, HP, HP, '#f0d0ff'); R(g, x + 0.5, y + 3.6, HP, HP, '#f0d0ff');
  };
  // a cobweb in a corner, drawn in faint silver threads: spokes and the rings between them
  var cobweb = function (g, x, y, r, dir, col) {
    g.globalAlpha = 0.55;
    for (var a = 0; a <= 1; a += 0.25) { var an = (dir < 0 ? Math.PI / 2 : 0) + a * Math.PI / 2; line(g, x, y, x + Math.cos(an) * r * (dir < 0 ? -1 : 1) * (dir < 0 ? -1 : 1), y + Math.sin(an) * r, HP, col); }
    for (var k = 0.35; k < 1; k += 0.3) for (var t = 0; t < 1; t += 0.03) { var an2 = (dir < 0 ? Math.PI / 2 : 0) + t * Math.PI / 2; R(g, x + Math.cos(an2) * r * k, y + Math.sin(an2) * r * k + Math.sin(t * Math.PI * 4) * 0.3, HP, HP, col); }
    g.globalAlpha = 1;
  };
  // a candle (or a few), wax dripping, flame lit, in its own warm glow
  var candles = function (g, x, base, n, s) {
    glow(g, x, base - 6 * s, 12 * s, '#ffc060', 0.7);
    for (var i = 0; i < n; i++) {
      var cx = x + (i - (n - 1) / 2) * 2.2 * s, ch = (4 + ((i * 7) % 3) * 1.6) * s;
      R(g, cx - 0.7 * s, base - ch, 1.4 * s, ch, '#f4ecdc'); R(g, cx + 0.3 * s, base - ch, 0.4 * s, ch, '#c8b8a0'); R(g, cx - 0.9 * s, base - ch + 0.6, 0.5, 1.4, '#f4ecdc');
      R(g, cx - HP / 2, base - ch - 1.6 * s, HP, 1.6 * s, '#ffc040'); R(g, cx - HP / 2, base - ch - 1 * s, HP, HP, '#fff8d0');
    }
  };

  GEN.witchtower = function (rnd, th) {
    var L = [], i, j, x, y;
    /* Inside the witch's tower: round stone walls going up and up (the
       level climbs, so every layer reaches well above the screen), arched
       windows onto the night — one of them huge, with a full moon filling
       it and clouds swirling past — moss in the cracks. */
    var LIFT = 400;
    var wl = tallStrip(0.05, LIFT), w = wl.c.getContext('2d'), WT = -wl.e;
    // the wall curves away from us at each side of a bay: darker there
    var bay = function (xx) { var u = ((xx % 256) + 256) % 256 / 256; return Math.pow(Math.abs(u - 0.5) * 2, 2) * 0.55; };
    stones(w, 0, WT, SW, H, rnd, ['#1c1430', '#2e2448', '#4a3e68', '#6a5a8c', '#3a5a4a'], function (xx) { return bay(xx); });
    var winSky = function (x0, top, ww, hh, moonR, rs) {
      var r = ww / 2, cx = x0 + r;
      // the deep stone reveal round the opening
      for (y = top - 3; y < top + hh + 3; y += HP) { var d = y - top + 3, hw = d < r + 3 ? Math.sqrt(Math.max(0, (r + 3) * (r + 3) - (r + 3 - d) * (r + 3 - d))) : r + 3; R(w, cx - hw, y, hw * 2, HP, '#241a3a'); }
      for (y = top; y < top + hh; y += HP) {
        var k = (y - top) / hh, hw2 = y < top + r ? Math.sqrt(Math.max(0, r * r - (top + r - y) * (top + r - y))) : r;
        R(w, cx - hw2, y, hw2 * 2, HP, mix('#1a1450', '#4a3a8a', k));
      }
      for (i = 0; i < ww * hh / 26; i++) { var sx = x0 + rs() * ww, sy = top + r * 0.4 + rs() * hh * 0.8; if (Math.abs(sx - cx) < r - 1) R(w, sx, sy, HP, HP, rs() > 0.7 ? '#ffffff' : '#d8c8ff'); }
      if (moonR) moon(w, cx + 3, top + hh * 0.42, moonR, ['#c8c0e0', '#fbf6ff', '#ffffff', '#d8d0ec'], ['#d8d0ff', 0.6]);
      // clouds racing across, with a curl at their heads, kept inside the window
      w.save(); w.beginPath(); w.rect(x0, top + r, ww, hh - r); w.arc(cx, top + r, r, Math.PI, 0); w.clip();
      for (var c = 0; c < (moonR ? 5 : 2); c++) {
        var ccx = x0 - 10 + rs() * ww, ccy = top + hh * (0.3 + rs() * 0.6), cl = (moonR ? 30 : 14) + rs() * 20;
        streak(w, ccx, ccy + 2, cl * 1.4, 2.5 + rs() * 2, ['#2a1e58', '#3e2c70', '#8a74c8'], true);
        cloud(w, ccx + cl * 0.2, ccy, (moonR ? 0.42 : 0.24) + rs() * 0.12, ['#2c2060', '#4a3684', '#8e7ad0']);
      }
      w.restore();
      // the sill, a few stones in the arch
      R(w, x0 - 3, top + hh, ww + 6, 2, '#5a4c78'); R(w, x0 - 3, top + hh, ww + 6, HP, '#8a7aa8'); R(w, x0 - 3, top + hh + 2, ww + 6, HP, '#1c1430');
      for (var a = Math.PI; a <= Math.PI * 2 + 0.01; a += Math.PI / 6) line(w, cx + Math.cos(a) * r, top + r + Math.sin(a) * r, cx + Math.cos(a) * (r + 3), top + r + Math.sin(a) * (r + 3), HP, '#1c1430');
    };
    var rs = BB.rng(5555);
    winSky(84, 10, 64, 84, 24, rs);
    winSky(300, 24, 22, 44, 0, rs);
    winSky(424, 18, 22, 44, 0, rs);
    winSky(214, -26, 22, 40, 0, rs); winSky(10, -22, 22, 36, 0, rs);
    L.push({ c: wl.c, f: wl.f, y: wl.y });

    /* The witch's things: crooked shelves of jars and potions (some
       glowing), books, candles dripping wax, bunches of herbs hanging from
       the beams, little bats asleep upside down, cobwebs in the corners. */
    var sl = tallStrip(0.1, LIFT), s = sl.c.getContext('2d'), ST = -sl.e;
    var WD = ['#3a2214', '#6a4428', '#9a6a40'];
    var POT = [['#c8e8f0', '#7aff9a', '#8a5a3a'], ['#d8c8f0', '#c070ff', '#8a5a3a'], ['#f0e0c8', '#ff9a40', '#6a4a2a'], ['#c8e8f0', '#5ad8ff', '#8a5a3a'], ['#f0c8d8', '#ff6a9a', '#6a4a2a'], ['#d0d8c0', '#9a8a5a', '#6a4a2a']];
    var BK = ['#7a2a3a', '#2a5a6a', '#6a5a2a', '#4a3a7a', '#2a6a3a'];
    var shelf = function (x0, sy, sw, tilt) {
      for (var xx = x0; xx < x0 + sw; xx += HP) { var yy = sy + (xx - x0) * tilt; R(s, xx, yy, HP, 1.4, WD[1]); R(s, xx, yy, HP, HP, WD[2]); R(s, xx, yy + 1.4, HP, HP, WD[0]); }
      [x0 + 3, x0 + sw - 4].forEach(function (bx) { var by = sy + (bx - x0) * tilt + 1.4; span(s, by, by + 4, function () { return bx; }, function (yy) { return bx + 1 + (by + 4 - yy) * 0.5; }, WD[0]); });
      for (var px = x0 + 2; px < x0 + sw - 3;) {
        var base = sy + (px - x0) * tilt, k = rnd();
        if (k < 0.55) { var p = POT[Math.floor(rnd() * POT.length)], kind = Math.floor(rnd() * 3); jar(s, px + 2, base, kind, p, rnd() > 0.5); px += kind === 2 ? 5 : 4.2; }
        else if (k < 0.8) { var nb = 2 + Math.floor(rnd() * 3); for (var b = 0; b < nb; b++) { var bh = 4 + rnd() * 2.5, bc = BK[Math.floor(rnd() * BK.length)]; R(s, px, base - bh, 1.4, bh, bc); R(s, px, base - bh, HP, bh, mix(bc, '#ffffff', 0.3)); R(s, px, base - bh + 1, 1.4, HP, '#e0c060'); px += 1.5; } px += 1; }
        else { candles(s, px + 2, base, 1 + Math.floor(rnd() * 2), 0.8); px += 5; }
      }
    };
    [[8, 52, 60, 0.03], [176, 40, 54, -0.02], [244, 70, 44, 0.04], [342, 46, 70, -0.03], [452, 64, 52, 0.02], [20, -10, 56, -0.02], [196, -24, 60, 0.03], [380, -18, 50, -0.02], [120, 96, 40, 0.02], [400, 100, 44, -0.03], [90, -46, 50, 0.02], [300, -52, 56, -0.02], [460, -40, 44, 0.03]].forEach(function (q) { shelf(q[0], q[1], q[2], q[3]); });
    // the beams overhead, herbs and bats hanging from them, cobwebs in the corners
    [[4, 10, 0.02], [260, 4, -0.02], [130, -30, -0.015]].forEach(function (q) {
      for (x = q[0]; x < q[0] + 240; x += HP) { y = q[1] + (x - q[0]) * q[2]; R(s, x, y, HP, 3, WD[1]); R(s, x, y, HP, HP, WD[2]); R(s, x, y + 3, HP, HP, WD[0]); }
      for (x = q[0] + 10; x < q[0] + 230; x += 14 + rnd() * 12) { y = q[1] + (x - q[0]) * q[2] + 3; if (rnd() > 0.35) herbs(s, x, y, 5 + rnd() * 3, rnd() > 0.5 ? ['#4a6a30', '#7a9a40', '#b0c868'] : ['#5a3a7a', '#9a6ac0', '#d0a8ec'], rnd); else sleepyBat(s, x, y, '#2a1a3a'); }
      cobweb(s, q[0] + 2, q[1] + 3.5, 7, 1, '#d8d0f0');
    });
    L.push({ c: sl.c, f: sl.f, y: sl.y });

    /* Nearest: crooked timber posts holding the place up, lanterns hung on
       chains, and a spider letting itself down on a thread to say hello. */
    var nr = tallStrip(0.18, LIFT), n = nr.c.getContext('2d'), NT = -nr.e;
    [[60, 0.03], [318, -0.025]].forEach(function (q) {
      for (y = NT; y < H; y += HP) { var px = q[0] + Math.sin(y * 0.03) * 2 + (H - y) * q[1]; R(n, px, y, 6, HP, '#3a2214'); R(n, px, y, 1.2, HP, '#8a5a34'); R(n, px + 4.6, y, 1.4, HP, '#22140a'); if (Math.sin(y * 0.6 + q[0]) > 0.92) R(n, px + 2, y, 2, HP, '#22140a'); }
    });
    [[150, 30], [410, 22]].forEach(function (q) {
      for (y = NT; y < q[1]; y += 1.5) { R(n, q[0] - 0.5, y, 1, 1, '#4a4060'); R(n, q[0] - 0.25, y + 0.2, HP, HP, '#8a80a8'); }
      glow(n, q[0], q[1] + 4, 20, '#ffc060', 0.75);
      R(n, q[0] - 2.5, q[1], 5, 1, '#3a3050'); R(n, q[0] - 2, q[1] + 1, 4, 5, '#ffe090'); R(n, q[0] - 1.5, q[1] + 1.5, 1.5, 3, '#fffbe0'); R(n, q[0] - 2.5, q[1] + 6, 5, 1, '#3a3050'); R(n, q[0] - HP / 2, q[1] + 1, HP, 5, '#3a3050');
    });
    // the spider: a round little body, eight bent legs, big eyes
    var SPX = 250, SPY = 36;
    R(n, SPX - HP / 2, NT, HP, SPY - NT - 2, '#c8c0e0');
    for (var l = 0; l < 4; l++) [-1, 1].forEach(function (d) { line(n, SPX, SPY + l * 0.6, SPX + d * (2.2 + l * 0.3), SPY - 1 + l * 1.1, HP, '#1a1428'); line(n, SPX + d * (2.2 + l * 0.3), SPY - 1 + l * 1.1, SPX + d * (2.8 + l * 0.4), SPY + 1.6 + l * 0.9, HP, '#1a1428'); });
    disc(n, SPX, SPY + 1, 1.8, '#2a1e3a'); disc(n, SPX - 0.5, SPY + 0.4, 0.6, '#4a3e5a');
    R(n, SPX - 1, SPY + 0.6, 0.8, 0.8, '#ffffff'); R(n, SPX + 0.3, SPY + 0.6, 0.8, 0.8, '#ffffff'); R(n, SPX - 0.6, SPY + 1, HP, HP, '#1a1428'); R(n, SPX + 0.6, SPY + 1, HP, HP, '#1a1428');
    L.push({ c: nr.c, f: nr.f, y: nr.y });
    return L;
  };
})();
