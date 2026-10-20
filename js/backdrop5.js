/* ==========================================================================
   backdrop5.js — the fifth land, "One Day…" (levels 36–45): Bonnie's
   One Day List, his wishes scattered round the world.

   Each world's theme (its colours, ground, platforms, scenery, music, the
   little things on its ground and its light) and the scenery behind it.
   Painted the same way as backdrop.js, with its kit (BB.bgKit): a graded
   sky, then layers that slide past slower the further away they are, each
   fainter and nearer the colour of the sky than the one in front; round
   things lit from the top left in three tones; fine detail at the screen's
   full density; every strip 512 game pixels wide and seamless at its ends.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, K = BB.bgKit, GEN = BB.backdropGen;
  if (!K || !GEN) return;
  var H = K.H, SW = K.SW, HP = K.HP, snap = K.snap, mix = K.mix, strip = K.strip, R = K.R, disc = K.disc, ball = K.ball,
    canopy = K.canopy, tree = K.tree, cloud = K.cloud, land = K.land, mountain = K.mountain, mist = K.mist, sun = K.sun,
    span = K.span, oval = K.oval, ring = K.ring, line = K.line, glow = K.glow, stars = K.stars, streak = K.streak,
    boat = K.boat, leaf = K.leaf, palm = K.palm, gull = K.gull, bunting = K.bunting, beam = K.beam,
    girder = K.girder, pad = K.pad, hline = K.hline, curve = K.curve, slide = K.slide;
  // one turn of a wave across the strip: edges built from whole turns meet at the seam
  var TAU = Math.PI * 2 / SW;
  var wv = function (x, n, ph) { return Math.sin(x * TAU * n + (ph || 0)); };

  /* ==========================================================================
     THEMES — tile palettes are [1, 2, 3, 4], light to dark.
     ========================================================================== */
  var THEMES = {
    // 36 · a Pokémon meadow: bright turf, red roofs, golden blocks like Pikachu
    pokemon: {
      sky: ['#4cb2ff', '#86d0ff', '#dcf4ff'], ground: 'grass', gpal: ['#b4f878', '#5ec84c', '#e0a868', '#94603a'],
      brick: ['#ffa898', '#f05a48', '#b8302c', '#4a1018'], hard: ['#fff4a8', '#ffd840', '#d49a18', '#5a3c08'],
      semi: 'bridge', spal: ['#f8d8a0', '#d0a060', '#94683a', '#4a2c18'], column: 'stump',
      deco: ['pokecentre', 'routesign', 'berrybush', 'tree', 'bush', 'flowerY', 'berrybush', 'tree'], bg: 'pokemon', music: 'pokemon'
    },
    // 37 · Universal, Florida: sunny paving, the globe's blue, a green coaster track
    universal: {
      sky: ['#2c9cff', '#74c8ff', '#eaf8ff'], ground: 'stone', gpal: ['#fff2dc', '#ecd0a4', '#c09a6c', '#6c5034'],
      brick: ['#b0e2ff', '#4ca6f0', '#2a6cb8', '#142e5a'], hard: ['#ffe898', '#f8c440', '#c88a18', '#5a3c08'],
      semi: 'girder', spal: ['#a8f488', '#4cc048', '#268a34', '#0e3c18'], column: 'sandcastle',
      deco: ['globe', 'clapper', 'spotlight', 'popcorn', 'palm', 'palm', 'lamppost'], bg: 'universal', music: 'universal'
    },
    // 38 · New York at Christmas: snowy pavements, brownstone bricks, taxi-yellow blocks
    newyork: {
      sky: ['#6c86d4', '#cfa4d2', '#ffcca4'], ground: 'snow', gpal: ['#ffffff', '#eaf0fa', '#a4a8bc', '#5a5e74'],
      brick: ['#eca48a', '#bc5c44', '#843828', '#3a1810'], hard: ['#fff2a0', '#ffd030', '#d09a10', '#5a3c08'],
      semi: 'girder', spal: ['#9aa6bc', '#646e86', '#3e4458', '#1a1c28'], column: 'chimney',
      deco: ['hydrant', 'hotdogcart', 'streetsign', 'mailbox', 'bigxmastree', 'snowbank', 'lamppost'], bg: 'newyork', music: 'newyork',
      snowing: true
    },
    // 39 · Jamaica: white sand, coral-pink walls, turquoise blocks, bamboo rafts
    jamaica: {
      sky: ['#30aaff', '#74d0ff', '#dcfcff'], ground: 'sand', gpal: ['#ffffff', '#fbf2dc', '#eadaae', '#b8986a'],
      brick: ['#ffc4ac', '#ff7a5c', '#c84a34', '#4c1c14'], hard: ['#acf4dc', '#3ccaa8', '#1c8878', '#0c3a38'],
      semi: 'bridge', spal: ['#f4e49c', '#ccb458', '#8a7a30', '#3c3410'], column: 'stump',
      deco: ['shack', 'steeldrum', 'parrot', 'hibiscus', 'palm', 'palm', 'hibiscus'], bg: 'jamaica', music: 'jamaica', sea: true
    },
    // 40 · Antarctica: snow over blue ice, ice blocks, packed-snow blocks, ice ledges
    antarctica: {
      sky: ['#4a70cc', '#8cbcf0', '#eef0ff'], ground: 'snow', gpal: ['#ffffff', '#e2f4ff', '#92ccf0', '#4888c8'],
      brick: ['#f0fcff', '#b0e4f8', '#6aaee0', '#285a90'], hard: ['#ffffff', '#d2e4f4', '#90acd0', '#3c5480'],
      semi: 'ice', spal: ['#ffffff', '#c8ecff', '#80c0e8', '#3870a0'], column: 'snowstump',
      deco: ['igloo', 'emperor', 'icespire', 'seal', 'stationflag', 'emperor'], bg: 'antarctica', music: 'antarctica', sea: true
    },
    // 41 · Australia: red earth, ochre sandstone, red-rock blocks, gum branches
    australia: {
      sky: ['#2088f0', '#5cb4ff', '#ffe6c4'], ground: 'sand', gpal: ['#ffb68a', '#e8763e', '#b84c22', '#6a2410'],
      brick: ['#ffdc94', '#f0a840', '#b87018', '#4c2c08'], hard: ['#f2c2a2', '#c87858', '#8a4a34', '#3c1c14'],
      semi: 'branch', spal: ['#ece2d0', '#bcac8c', '#7a6c58', '#34302a'], column: 'stump',
      deco: ['gumtree', 'koala', 'termite', 'redrock', 'roosign', 'gumtree'], bg: 'australia', music: 'australia'
    },
    // 42 · on a rainbow: cloud underfoot, pink blocks, sky-blue blocks
    rainbow: {
      sky: ['#86c4ff', '#c8d6ff', '#ffe2f2'], ground: 'cloud', gpal: ['#ffffff', '#fdeefa', '#eac4ee', '#ac86cc'],
      brick: ['#ffd2ea', '#ff8cc2', '#d0508e', '#5a1c40'], hard: ['#dcf2ff', '#9cd0ff', '#5a98e0', '#24407c'],
      semi: 'cloud', spal: ['#ffffff', '#f4ecff', '#d0c0f0', '#9080c8'], column: 'cloud',
      deco: ['cloudpuff', 'minirainbow', 'potofgold', 'starflower', 'cloudpuff'], bg: 'rainbow', music: 'rainbow'
    },
    // 43 · Chocolate Land: a chocolate-bar floor, biscuit blocks, white-chocolate blocks
    chocolate: {
      sky: ['#f4a0bc', '#ffc8c4', '#fff0dc'], ground: 'stone', gpal: ['#bc7c54', '#8c502e', '#6a3418', '#341408'],
      brick: ['#ffe2a2', '#e8b060', '#b07830', '#4c300c'], hard: ['#fffaf0', '#f2dec2', '#c8a888', '#5c4434'],
      semi: 'bridge', spal: ['#fad8a0', '#daa65a', '#9a6a30', '#4a2c10'], column: 'stump',
      deco: ['chocfountain', 'sweetstack', 'wafer', 'choctree', 'lollipop', 'candycane'], bg: 'chocolate', music: 'chocolate'
    },
    // 44 · Dinosaur Land: jungle turf on dark soil, sandstone blocks, volcanic rock
    dinosaurs: {
      sky: ['#5cb0dc', '#acdcc4', '#ffe4ac'], ground: 'grass', gpal: ['#ace064', '#4ea838', '#8a5a38', '#4a2c1c'],
      brick: ['#ecd4aa', '#c4a272', '#8a6c44', '#3c2c18'], hard: ['#aa9ca4', '#786870', '#4c3e48', '#221820'],
      semi: 'branch', spal: ['#c4986c', '#8a6440', '#5a3c22', '#24160c'], column: 'stump',
      deco: ['volcano', 'nest', 'bones', 'cycad', 'fern', 'fern'], bg: 'dinosaurs', music: 'dinosaurs'
    },
    // 45 · Bee Land: sunny turf, honeycomb bricks, amber blocks, green stalks
    beeland: {
      sky: ['#74c4ff', '#bce2ff', '#fff2bc'], ground: 'grass', gpal: ['#d4f47c', '#86c840', '#b07c40', '#6a4420'],
      brick: ['#ffec94', '#ffc220', '#d08808', '#5a3404'], hard: ['#ffd8a0', '#e8963c', '#a85c18', '#46220a'],
      semi: 'branch', spal: ['#bcf274', '#6cbc40', '#3c8028', '#18400c'], column: 'stump',
      deco: ['beehive', 'daisy', 'honeypot', 'bigclover', 'sunflower', 'daisy'], bg: 'beeland', music: 'beeland'
    }
  };
  // the little things on the ground (A.tiny names), what hangs beneath it, and each world's light (see art.js, light.js)
  var TINY = {
    pokemon: ['flowerP', 'flowerY', 'tuft', 'tuft', 'clover', 'flowerW', 'berries', 'tuft'],
    universal: ['flowerP', 'pebble', 'flowerY'],
    newyork: ['snowTuft', 'pebble', 'snowTuft'],
    jamaica: ['shell', 'pebble', 'seagrass', 'shell'],
    antarctica: ['snowTuft', 'pebble', 'crystal', 'snowTuft'],
    australia: ['pebble', 'tuft', 'pebble'],
    rainbow: ['flowerW', 'flowerP', 'sprout', 'flowerB', 'flowerY'],
    chocolate: ['flowerP', 'flowerW', 'sprout'],
    dinosaurs: ['tuft', 'berries', 'tuft', 'clover', 'shroom'],
    beeland: ['flowerY', 'flowerW', 'clover', 'flowerP', 'tuft', 'flowerB']
  };
  var HANG = {
    pokemon: ['vines', ['#4fae4a', '#8ee06a', '#8a5a36']],
    universal: ['vines', ['#3aa848', '#7ad860', '#6a5030']],
    newyork: ['icicles', ['#c8ecff', '#ffffff', '#88b8e0']],
    jamaica: ['roots', ['#c89a5a', '#e8c080', '#a07040']],
    antarctica: ['icicles', ['#c8ecff', '#ffffff', '#88b8e0']],
    australia: ['roots', ['#c8704a', '#e8a070', '#8a4428']],
    rainbow: ['drips', ['#d8c8ff', '#ffffff', '#a898e0']],
    chocolate: ['drips', ['#8c502e', '#bc7c54', '#5a2c14']],
    dinosaurs: ['vines', ['#2e9a48', '#7ed858', '#5a4028']],
    beeland: ['drips', ['#ffc020', '#fff0a0', '#c88a10']]
  };
  var LIGHT = {
    pokemon: { rays: { col: '#fff4c0', a: 0.34 }, motes: '#ffffff' },
    universal: { rays: { col: '#fff4c8', a: 0.32 }, motes: '#ffffff' },
    newyork: { rays: { col: '#ffd8b8', a: 0.3 }, motes: '#ffffff' },
    jamaica: { rays: { col: '#fff8d0', a: 0.3 }, motes: '#ffffff' },
    antarctica: { rays: { col: '#e8fff8', a: 0.3 }, motes: '#ffffff' },
    australia: { rays: { col: '#fff0c8', a: 0.34 }, motes: '#fff4e0' },
    rainbow: { rays: { col: '#fff0f8', a: 0.34 }, motes: '#ffffff' },
    chocolate: { rays: { col: '#ffe8d0', a: 0.34 }, motes: '#fff4e8' },
    dinosaurs: { rays: { col: '#fff0c0', a: 0.38 }, motes: '#f8ffc0' },
    beeland: { rays: { col: '#ffe8a0', a: 0.4 }, motes: '#fff4b0' }
  };
  if (A && A.themes) Object.keys(THEMES).forEach(function (k) {
    var th = A.themes[k] = THEMES[k];
    th.tiny = TINY[k]; th.hang = HANG[k]; th.light = LIGHT[k];
  });

  /* ==========================================================================
     THE BACKDROPS
     ========================================================================== */

  /* ---- 36 · Pokémon Meadow ---- */
  /* A little house of the town, the way the games draw them: pale walls, a
     deep roof hanging over them with its eaves in shade, windows with a
     glint, a door, a chimney. P = {wall, roof: [shade, body, light], glass, door} */
  var house = function (g, x, base, w, h, P, chim) {
    var top = base - h, rh = Math.round(w * 0.34 + 2), ov = 1.5, sl = 0.62;
    R(g, x, top, w, h, P.wall[1]); R(g, x + w - 2, top, 2, h, P.wall[0]); R(g, x, top, HP, h, P.wall[2]);
    R(g, x, base - 1.5, w, 1.5, mix(P.wall[0], '#5a5a6a', 0.25));
    var nw = w > 22 ? 2 : 1;
    for (var i = 0; i < nw; i++) {
      var wx = nw === 1 ? x + w * 0.62 : x + w * (i ? 0.7 : 0.14);
      R(g, wx - HP, top + 3.5 - HP, 4 + HP * 2, 3.5 + HP * 2, P.wall[0]); R(g, wx, top + 3.5, 4, 3.5, P.glass);
      R(g, wx + 0.5, top + 4, 1, 1.5, mix(P.glass, '#ffffff', 0.7)); R(g, wx + 2, top + 3.5, HP, 3.5, mix(P.glass, P.wall[0], 0.4));
    }
    var dx = nw === 1 ? x + w * 0.2 : x + w * 0.44;
    R(g, dx, base - 7, 4, 7, P.door); R(g, dx + 3, base - 7, 1, 7, mix(P.door, '#000000', 0.25)); R(g, dx + 2.6, base - 3.8, HP, HP, '#ffe080');
    R(g, dx - 0.5, base - 7.5, 5, HP, P.wall[0]);
    if (chim) { R(g, x + w * 0.72, top - rh + 1, 3, rh - 2, P.chim || '#b8a8a0'); R(g, x + w * 0.72 - 0.5, top - rh + 0.5, 4, 1, mix(P.chim || '#b8a8a0', '#ffffff', 0.25)); }
    span(g, top - rh, top + 1, function (yy) { return x - ov + (top + 1 - yy) * sl; }, function (yy) { return x + w + ov - (top + 1 - yy) * sl; }, P.roof[1]);
    span(g, top - rh, top + 1, function (yy) { return x + w + ov - (top + 1 - yy) * sl - (top + 1 - yy) * 0.9 - 1.5; }, function (yy) { return x + w + ov - (top + 1 - yy) * sl; }, P.roof[0]);
    for (var yy = top - rh + 2.5; yy < top; yy += 2.5) R(g, x - ov + (top + 1 - yy) * sl, yy, w + ov * 2 - (top + 1 - yy) * sl * 2, HP, mix(P.roof[1], P.roof[0], 0.55));
    R(g, x - ov + (rh + 1) * sl, top - rh, w + ov * 2 - (rh + 1) * sl * 2, 1, P.roof[2]);
    R(g, x - ov, top, w + ov * 2, 1, P.roof[0]); R(g, x - ov, top - HP, w * 0.5, HP, P.roof[2]);
  };
  // a Poké Ball, as the emblem over a door: red over white, the black band, the button
  var pokeball = function (g, x, y, r) {
    disc(g, x, y, r + HP, '#2a2030');
    for (var yy = -r; yy <= r; yy += HP) { var hw = Math.sqrt(Math.max(0, r * r - yy * yy)); R(g, x - hw, y + yy, hw * 2, HP, yy < 0 ? '#f04a48' : '#ffffff'); }
    R(g, x - r, y - HP / 2, r * 2, Math.max(HP, r * 0.22), '#2a2030');
    disc(g, x, y, r * 0.38, '#2a2030'); disc(g, x, y, r * 0.24, '#ffffff');
    R(g, x - r * 0.55, y - r * 0.6, Math.max(HP, r * 0.3), Math.max(HP, r * 0.25), '#ffb0a8');
  };
  // a round-tiered fir, the games' forest tree: three soft tiers, lit on the left. c = [shade, body, light], t = trunk
  var fir = function (g, x, base, h, c, t) {
    R(g, x - 0.75, base - h * 0.22, 1.5, h * 0.22, t);
    for (var k = 0; k < 3; k++) {
      var tb = base - h * (0.16 + k * 0.24), th2 = h * 0.42, tw = h * (0.36 - k * 0.075);
      span(g, tb - th2, tb, function (yy) { var u = (yy - tb + th2) / th2; return x - tw * Math.sqrt(u); }, function (yy) { var u = (yy - tb + th2) / th2; return x + tw * Math.sqrt(u); }, c[1]);
      span(g, tb - th2 * 0.8, tb, function (yy) { var u = (yy - tb + th2) / th2; return x + tw * Math.sqrt(u) * 0.15; }, function (yy) { var u = (yy - tb + th2) / th2; return x + tw * Math.sqrt(u); }, c[0]);
      R(g, x - tw, tb - HP, tw * 2, HP, c[0]);
      span(g, tb - th2 * 0.85, tb - th2 * 0.3, function (yy) { var u = (yy - tb + th2) / th2; return x - tw * Math.sqrt(u) + HP; }, function (yy) { var u = (yy - tb + th2) / th2; return x - tw * Math.sqrt(u) + HP + Math.max(HP, tw * 0.22); }, c[2]);
    }
  };

  GEN.pokemon = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A bright morning: the sun high, big fair-weather clouds sailing, and
       a little flock of brown birds far off. */
    var far = strip(), g = far.getContext('2d');
    sun(g, 212, 22, 10, ['#fff8d0', '#fff4b0', '#fffcec']);
    [[22, 24, 0.95], [120, 44, 0.6], [292, 16, 1.05], [384, 40, 0.7], [462, 20, 0.8], [140, 12, 0.45], [236, 50, 0.5]].forEach(function (q) { cloud(g, q[0], q[1], q[2], [hm('#b4d4f4', 0.15), '#ffffff', '#ffffff']); });
    for (i = 0; i < 6; i++) streak(g, rnd() * SW, 54 + rnd() * 18, 30 + rnd() * 40, 1.2 + rnd(), [hm('#c4def6', 0.3), hm('#f4fbff', 0.2), '#ffffff']);
    [[150, 36], [157, 32], [163, 38], [171, 34], [338, 54], [345, 51]].forEach(function (q, qi) { gull(g, q[0], q[1], 0.42 + (qi % 2) * 0.08, [hm('#b07c50', 0.35), hm('#d8b088', 0.4), hm('#6a4430', 0.4)]); });
    L.push({ c: far, f: 0.03 });

    // the big mountain far away, snow on its head, and the blue ranges beside it
    var mt = strip(), m = mt.getContext('2d');
    for (i = 0; i < 6; i++) mountain(m, 300 + i * 46 + rnd() * 16, 100, 60 + rnd() * 24, 16 + rnd() * 12, [hm('#7a94cc', 0.62), hm('#a0b6e4', 0.62)], null);
    mountain(m, 52, 100, 92, 34, [hm('#6c86c4', 0.55), hm('#94acdf', 0.55)], [hm('#d4e2f6', 0.35), hm('#ffffff', 0.2)]);
    mountain(m, 214, 100, 100, 38, [hm('#6c86c4', 0.55), hm('#94acdf', 0.55)], [hm('#d4e2f6', 0.35), hm('#ffffff', 0.2)]);
    mountain(m, 134, 100, 150, 64, [hm('#5c76b8', 0.45), hm('#8aa2da', 0.45)], [hm('#cddcf4', 0.25), '#ffffff']);
    mist(m, 76, 26, hz);
    L.push({ c: mt, f: 0.05 });

    /* Rolling hills, round as the games draw them, the forest dark on their
       backs, and paths winding over them. */
    var hl = strip(), h = hl.getContext('2d');
    var hump = function (cx, base, rx, ry, col, a) {
      var c = [hm(mix(col, '#2a6a5a', 0.3), a), hm(col, a), hm(mix(col, '#ffffff', 0.4), a * 0.8)];
      oval(h, cx + rx * 0.05, base, rx, ry, c[0], true); oval(h, cx - rx * 0.05, base, rx * 0.92, ry * 0.98, c[1], true);
      for (var xx = cx - rx * 0.9; xx < cx + rx * 0.3; xx += HP) { var u = (xx - cx + rx * 0.05) / (rx * 0.92); R(h, xx, base - ry * 0.98 * Math.sqrt(Math.max(0, 1 - u * u)), HP, HP, c[2]); }
    };
    for (i = 0; i < 8; i++) hump(i * 66 + rnd() * 24, 104, 40 + rnd() * 16, 16 + rnd() * 8, i % 2 ? '#6cc860' : '#86d468', 0.5);
    // the forest: rows of firs, the far rows paler
    [[150, 130], [370, 90]].forEach(function (q) {
      for (j = 0; j < 3; j++) {
        for (x = q[0] + j * 4; x < q[0] + q[1] - j * 10; x += 4.5 + rnd() * 1.5) {
          var fh = 12 + rnd() * 5 + Math.sin((x - q[0]) / q[1] * Math.PI) * 8;
          fir(h, x, 104 + j * 2.5, fh, [hm('#1e6a4a', 0.5 - j * 0.07), hm('#2e8a52', 0.5 - j * 0.07), hm('#6cc070', 0.45 - j * 0.07)], hm('#5a4030', 0.5));
        }
      }
    });
    mist(h, 92, 16, hz);
    for (i = 0; i < 9; i++) hump(i * 60 + 20 + rnd() * 24, 112, 34 + rnd() * 12, 11 + rnd() * 6, i % 2 ? '#70cc58' : '#8edc66', 0.32);
    L.push({ c: hl, f: 0.09 });

    /* The town: little houses with red and blue roofs, the Pokémon Centre
       with its ball over the door, the professor's lab, fences and a pond. */
    var tw = strip(), t = tw.getContext('2d');
    var tg = function (xx) { return 112 + wv(xx, 2, 0.6) * 2 + wv(xx, 5, 1) * 0.8; };
    land(t, tg, [hm('#4cae48', 0.24), hm('#6ccc58', 0.24), hm('#b0f088', 0.2)], 7);
    var WL = [hm('#c8c0c0', 0.2), hm('#fff8ec', 0.2), hm('#ffffff', 0.15)];
    var RED = [hm('#b02a34', 0.2), hm('#e84a48', 0.2), hm('#ff9a88', 0.15)], BLU = [hm('#2a4aa0', 0.2), hm('#4a78d8', 0.2), hm('#9ac0ff', 0.15)];
    var GRN = [hm('#2a7a48', 0.2), hm('#48a860', 0.2), hm('#9ae0a0', 0.15)], ORG = [hm('#b0582a', 0.2), hm('#e88a40', 0.2), hm('#ffc890', 0.15)];
    var GLS = hm('#5aa0e8', 0.2), DR = hm('#a06a3c', 0.2);
    // paths of pale earth between the buildings
    for (x = 0; x < SW; x += HP) { y = tg(x); var pv = Math.sin(x * TAU * 3 + 1.4); if (pv > 0.55) R(t, x, y + 1.5, HP, 2.5, hm('#f4e2b0', 0.2)); }
    house(t, 18, tg(30) + 1, 26, 13, { wall: WL, roof: RED, glass: GLS, door: DR }, true);
    house(t, 62, tg(72) + 1, 20, 11, { wall: WL, roof: BLU, glass: GLS, door: DR });
    // the Pokémon Centre
    var PX = 150, PB = tg(PX + 20) + 1;
    house(t, PX, PB, 44, 17, { wall: WL, roof: RED, glass: GLS, door: hm('#9ad0f8', 0.2) });
    R(t, PX + 17, PB - 9, 10, 9, hm('#b8e4ff', 0.2)); R(t, PX + 21.75, PB - 9, HP, 9, hm('#7ab0d8', 0.2)); R(t, PX + 17.5, PB - 8.5, 1.5, 5, '#ffffff');
    R(t, PX + 16, PB - 10, 12, 1, hm('#e84a48', 0.2));
    pokeball(t, PX + 22, PB - 13.5, 2.6);
    // the Poké Mart, blue
    house(t, 210, tg(222) + 1, 28, 13, { wall: WL, roof: BLU, glass: GLS, door: hm('#9ad0f8', 0.2) });
    // the professor's lab: long and white with a grey roof and big windows
    var LX = 330, LB = tg(LX + 26) + 1;
    house(t, LX, LB, 52, 16, { wall: WL, roof: [hm('#5a6478', 0.2), hm('#7c88a0', 0.2), hm('#c0cae0', 0.15)], glass: GLS, door: DR }, true);
    for (x = LX + 30; x < LX + 48; x += 6) { R(t, x, LB - 12, 4.5, 4, GLS); R(t, x + 0.5, LB - 11.5, 1, 1.5, '#ffffff'); }
    house(t, 290, tg(300) + 1, 22, 12, { wall: WL, roof: GRN, glass: GLS, door: DR }, true);
    house(t, 410, tg(420) + 1, 24, 12, { wall: WL, roof: ORG, glass: GLS, door: DR });
    house(t, 468, tg(478) + 1, 20, 11, { wall: WL, roof: RED, glass: GLS, door: DR }, true);
    // round trees in the gardens, white picket fences, flower beds
    var TC = [hm('#2a8040', 0.22), hm('#48a850', 0.22), hm('#90dc70', 0.18)], TT = [hm('#6a4630', 0.22), hm('#946440', 0.22)];
    [8, 52, 92, 136, 200, 244, 284, 318, 392, 402, 458, 500].forEach(function (tx) { tree(t, tx + rnd() * 4, tg(tx) + 2, 15 + rnd() * 6, rnd, TC, TT); });
    // a big sleepy friend lying across the path, the way they do
    var SNX = 262, SNB = tg(SNX) + 1.5, SB = [hm('#24506a', 0.2), hm('#3a6e8e', 0.2), hm('#6a9ec0', 0.18)], SF = [hm('#d8c49c', 0.2), hm('#f4e6c4', 0.2)];
    oval(t, SNX + 3, SNB - 1, 4, 2.5, SF[0]); oval(t, SNX - 9, SNB - 1, 4, 2.5, SF[0]); disc(t, SNX + 3, SNB - 1, 1.2, hm('#a87a4a', 0.2)); disc(t, SNX - 9, SNB - 1, 1.2, hm('#a87a4a', 0.2));
    oval(t, SNX + 0.6, SNB - 9, 12, 9.4, SB[0]); oval(t, SNX, SNB - 9.4, 11.4, 9, SB[1]); oval(t, SNX - 4, SNB - 14, 4, 2.5, SB[2]);
    oval(t, SNX + 1.5, SNB - 7.5, 8, 6.4, SF[0]); oval(t, SNX + 1, SNB - 8, 7.4, 6, SF[1]);
    disc(t, SNX - 6, SNB - 19, 6, SB[1]); oval(t, SNX - 6.5, SNB - 17, 4.4, 3.2, SF[1]);
    span(t, SNB - 26.5, SNB - 23, function (yy) { return SNX - 11 + (SNB - 23 - yy) * 0.3; }, function (yy) { return SNX - 8 - (SNB - 23 - yy) * 0.5; }, SB[1]);
    span(t, SNB - 26.5, SNB - 23, function (yy) { return SNX - 4 + (SNB - 23 - yy) * 0.5; }, function (yy) { return SNX - 1 - (SNB - 23 - yy) * 0.3; }, SB[0]);
    R(t, SNX - 9, SNB - 18.5, 2, HP, hm('#2a2a3a', 0.2)); R(t, SNX - 5, SNB - 18.5, 2, HP, hm('#2a2a3a', 0.2)); R(t, SNX - 7.5, SNB - 16, 2, HP, hm('#7a5a4a', 0.2));
    oval(t, SNX - 14, SNB - 8, 2.4, 3.4, SB[1]); R(t, SNX - 15, SNB - 6, 2, 1, SF[1]);
    [[96, 140], [388, 408]].forEach(function (q) {
      for (x = q[0]; x < q[1]; x += 2) { y = tg(x) + 1; R(t, x, y - 4, 1, 4, hm('#ffffff', 0.15)); R(t, x + 0.5, y - 4, HP, 4, hm('#c8c8d8', 0.2)); }
      for (x = q[0]; x < q[1]; x += HP) { y = tg(x) + 1; R(t, x, y - 3, HP, HP, hm('#e8e8f0', 0.2)); R(t, x, y - 1.5, HP, HP, hm('#e8e8f0', 0.2)); }
    });
    for (i = 0; i < 80; i++) { x = rnd() * SW; y = tg(x) + 1 + rnd() * 3; R(t, x, y, 1, 1, hm(['#ff7a9a', '#ffe060', '#ffffff', '#ff9a50'][i % 4], 0.15)); }
    mist(t, 100, 14, hz);
    L.push({ c: tw, f: 0.15 });

    /* In front: the meadow, with patches of the tall grass where wild ones
       hide — saw-toothed and dark, lighter at the tips — round trees and
       flowers. Kept low, so the play stays clear. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + wv(xx, 3, 2) * 2.5 + wv(xx, 7, 0.4) * 1; };
    land(n, nf, ['#3a9e40', '#5cc04c', '#a6ec78'], 8);
    var NT = ['#227a38', '#3ea848', '#86d660', '#d8ffa0'], NB = ['#5a3a24', '#8a5a36'];
    [[40, 34], [214, 30], [382, 38]].forEach(function (q) { tree(n, q[0] + rnd() * 10, nf(q[0]) + 3, q[1], rnd, NT, NB); });
    var grass = function (x0, w) {
      for (var gx = x0; gx < x0 + w; gx += 1.5) {
        var gb = nf(gx) + 2.5, gh = 5 + Math.sin(gx * 1.7) * 1 + Math.sin((gx - x0) / w * Math.PI) * 2.5, alt = Math.round(gx / 1.5) % 2;
        span(n, gb - gh, gb, function (yy) { return gx - 1.4 * (yy - gb + gh) / gh; }, function (yy) { return gx + 1.4 * (yy - gb + gh) / gh; }, alt ? '#1e7034' : '#2a8a3c');
        R(n, gx - HP / 2, gb - gh, HP, 1.5, alt ? '#4ab04a' : '#62c454'); R(n, gx - 1, gb - gh * 0.45, HP, gh * 0.45, '#3a9a44');
      }
    };
    [[96, 40], [270, 54], [440, 44]].forEach(function (q) { grass(q[0] + rnd() * 8, q[1]); });
    for (i = 0; i < 90; i++) { x = rnd() * SW; y = nf(x) + 1.5 + rnd() * 5; var fc = ['#ff7aa0', '#ffe048', '#ffffff', '#b08aff'][i % 4]; R(n, x, y, 1, 1, fc); R(n, x, y, HP, HP, mix(fc, '#ffffff', 0.6)); }
    L.push({ c: nr, f: 0.27 });
    return L;
  };
  /* ---- 37 · Universal Studios ---- */
  /* A slim tower under a tall pointed roof, for the castle on the hill.
     S = stone [shade, body, light], F = roof [shade, body, light], win = its windows */
  var spire = function (g, x, top, bot, r, rh, S, F, win) {
    R(g, x - r, top, r * 2, bot - top, S[1]); R(g, x + r * 0.3, top, r * 0.7, bot - top, S[0]); R(g, x - r, top, HP, bot - top, S[2]);
    if (win) for (var wy = top + 3; wy < bot - 2; wy += 5.5) R(g, x - 0.5, wy, 1, 2, win);
    R(g, x - r - 0.5, top, r * 2 + 1, 1, S[2]); R(g, x - r - 0.5, top + 1, r * 2 + 1, HP, S[0]);
    for (var y = 0; y < rh; y += HP) {
      var k = y / rh, hw = (r + 0.7) * Math.pow(k, 1.1), yy = top - rh + y;
      R(g, x - hw, yy, hw * 2, HP, F[1]); R(g, x + hw * 0.2, yy, hw * 0.8, HP, F[0]); R(g, x - hw, yy, Math.max(HP, hw * 0.35), HP, F[2]);
    }
    R(g, x - HP / 2, top - rh - 2.5, HP, 2.5, F[0]);
  };
  /* The wizards' castle on its crag above the lake: a crowd of towers under
     steep slate cones, the long hall with its tall windows, the great tower
     and the astronomy tower over all, a covered bridge to an outlying tower.
     Its windows are lit even by day. */
  var wizardCastle = function (g, cx, B, S, F, win, rock) {
    var x, y;
    // the crag: grey rock falling to the water, grass along its top
    span(g, B, B + 16, function (yy) { return cx - 58 + (yy - B) * 0.6 + Math.sin(yy * 1.3) * 1.2; }, function (yy) { return cx + 50 + (yy - B) * 1.1 + Math.sin(yy * 0.9) * 1.2; }, rock[1]);
    span(g, B, B + 16, function (yy) { return cx + 14 + (yy - B) * 0.4 + Math.sin(yy * 1.1) * 2; }, function (yy) { return cx + 50 + (yy - B) * 1.1 + Math.sin(yy * 0.9) * 1.2; }, rock[0]);
    for (y = B + 3; y < B + 16; y += 3) line(g, cx - 40 + y * 0.2 - B * 0.2, y, cx - 30 + (y - B) * 0.5, y + 2, HP, rock[0]);
    R(g, cx - 58, B - HP, 108, 1.5, rock[2]);
    // the outlying tower to the left and the covered bridge reaching it
    spire(g, cx - 52, B - 22, B, 3, 11, S, F, win);
    R(g, cx - 49, B - 15, 18, 4, S[1]); R(g, cx - 49, B - 15, 18, HP, S[2]); for (x = cx - 48; x < cx - 32; x += 2.5) R(g, x, B - 13.5, 1, 1.5, S[0]);
    span(g, B - 19, B - 15, function (yy) { return cx - 49 + (B - 15 - yy) * 0.4; }, function (yy) { return cx - 31 - (B - 15 - yy) * 0.4; }, F[1]);
    // at the back: the great tower and the astronomy tower, tallest of all
    spire(g, cx + 30, B - 58, B, 3.2, 16, S, F, win);
    spire(g, cx + 12, B - 46, B, 5, 14, S, F, win);
    spire(g, cx - 30, B - 40, B, 4, 13, S, F, win);
    spire(g, cx + 44, B - 36, B, 3.6, 12, S, F, win);
    spire(g, cx - 16, B - 34, B - 22, 2.2, 9, S, F, win);
    // the long hall: its steep roof, its tall pointed windows
    var HX0 = cx - 26, HX1 = cx + 6, HT = B - 24;
    R(g, HX0, HT, HX1 - HX0, 24, S[1]); R(g, HX1 - 3, HT, 3, 24, S[0]); R(g, HX0, HT, HP, 24, S[2]);
    span(g, HT - 9, HT, function (yy) { return HX0 + (HT - yy) * 0.5; }, function (yy) { return HX1 - (HT - yy) * 0.5; }, F[1]);
    span(g, HT - 9, HT, function (yy) { return HX1 - (HT - yy) * 0.5 - 2; }, function (yy) { return HX1 - (HT - yy) * 0.5; }, F[0]);
    R(g, HX0 + 4.5, HT - 9, HX1 - HX0 - 9, HP, F[2]);
    for (x = HX0 + 3; x < HX1 - 3; x += 4) { R(g, x, HT + 4, 1.5, 7, win); disc(g, x + 0.75, HT + 4, 0.75, win); R(g, x, HT + 15, 1.5, 4, win); }
    for (x = HX0; x < HX1; x += 4) R(g, x, HT - 0.5, HP, 24.5, S[0]);
    // buttresses and the lower ranges in front, a crowd of turrets on them
    R(g, cx - 44, B - 12, 92, 12, S[1]); R(g, cx - 44, B - 12, 92, HP, S[2]); R(g, cx + 36, B - 12, 12, 12, S[0]);
    for (x = cx - 44; x < cx + 48; x += 2.5) R(g, x, B - 13.5, 1.2, 1.5, S[1]);
    for (x = cx - 40; x < cx + 46; x += 5) { R(g, x, B - 9, 1, 2.5, win); }
    [[cx - 40, B - 22, 2.6, 9], [cx - 4, B - 30, 3, 10], [cx + 22, B - 28, 3.4, 11], [cx + 52, B - 20, 2.6, 8], [cx - 22, B - 20, 2.4, 7]].forEach(function (q) { spire(g, q[0], q[1], B, q[2], q[3], S, F, win); });
  };
  /* A sound stage: a great windowless shed of a building, cream walls with
     shallow ribs, a gently arched roof, the huge door they drive the sets
     through, and a band of colour along the top. P = [shade, body, light], band */
  var stage = function (g, x, base, w, h, P, band) {
    var top = base - h;
    R(g, x, top, w, h, P[1]); R(g, x + w - 3, top, 3, h, P[0]); R(g, x, top, HP, h, P[2]);
    for (var rx = x + 5; rx < x + w - 4; rx += 7) { R(g, rx, top + 3, 1, h - 3, mix(P[1], P[0], 0.35)); R(g, rx, top + 3, HP, h - 3, P[2]); }
    oval(g, x + w / 2, top + HP, w / 2 + 0.5, 3.5, mix(P[1], P[2], 0.5), true);
    R(g, x - 0.5, top, w + 1, 1, P[2]); R(g, x, top + 1, w, 2, band); R(g, x, top + 1, w, HP, mix(band, '#ffffff', 0.35));
    var dw = Math.min(16, w * 0.32), dx = x + w * 0.56;
    R(g, dx, base - h * 0.62, dw, h * 0.62, mix(P[1], P[0], 0.55));
    for (var yy = base - h * 0.62 + 2; yy < base; yy += 2) R(g, dx, yy, dw, HP, mix(P[1], P[0], 0.75));
    R(g, x + 5, base - 6, 3, 6, mix(P[0], '#5a6a8a', 0.4)); R(g, x + 4.5, base - 6.5, 4, HP, P[2]);
  };
  // the sheen on a lit sphere: a soft crescent of light high on its left
  var crescentLight = function (g, x, y, r) {
    g.globalAlpha = 0.5; K.crescent(g, x - r * 0.18, y - r * 0.2, r * 0.72, r * 0.22, r * 0.22, r * 0.68, '#ffffff'); g.globalAlpha = 1;
    disc(g, x - r * 0.46, y - r * 0.44, Math.max(HP, r * 0.12), '#ffffff');
  };
  // the coaster's track: two rails along a path, sleepers between, the steel posts down to the ground
  var track = function (g, pts, ground, c) {
    pts.forEach(function (p, i) { if (i % 15 === 0 && p[1] < ground - 2) { R(g, p[0] - HP / 2, p[1] + 1, HP, ground - p[1] - 1, c[3]); R(g, p[0], p[1] + 1, HP, ground - p[1] - 1, mix(c[3], '#000000', 0.15)); } });
    pts.forEach(function (p) { R(g, p[0] - 0.5, p[1] - 0.25, 1.5, 1.5, c[0]); });
    pts.forEach(function (p, i) { R(g, p[0] - 0.5, p[1] - 0.25, 1, 1, c[1]); if (i % 3 === 0) R(g, p[0] - 0.5, p[1] - 0.25, HP, HP, c[2]); });
  };

  GEN.universal = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* Florida sunshine: the sun high on the left, big summer clouds piling
       up over the horizon. */
    var far = strip(), g = far.getContext('2d');
    sun(g, 58, 22, 10, ['#fff8d8', '#fff4c0', '#fffcec']);
    var CB = [hm('#a8cef0', 0.1), '#ffffff', '#ffffff'];
    [[150, 30, 0.9], [262, 18, 0.75], [356, 34, 1.1], [470, 22, 0.8]].forEach(function (q) { cloud(g, q[0] + rnd() * 10, q[1], q[2], CB); });
    for (i = 0; i < 10; i++) cloud(g, i * 52 + rnd() * 24, 84 - rnd() * 6, 0.35 + rnd() * 0.2, [hm('#b4d6f2', 0.4), hm('#ffffff', 0.2), '#ffffff']);
    for (i = 0; i < 5; i++) streak(g, rnd() * SW, 48 + rnd() * 20, 30 + rnd() * 40, 1.2 + rnd(), [hm('#c4def6', 0.3), hm('#f4fbff', 0.2), '#ffffff']);
    L.push({ c: far, f: 0.03 });

    // the castle on its crag above a lake, blue mountains behind it
    var cs = strip(), c = cs.getContext('2d');
    for (i = 0; i < 7; i++) mountain(c, i * 74 + rnd() * 30, 100, 70 + rnd() * 30, 20 + rnd() * 14, [hm('#6a8ab4', 0.6), hm('#8eacd2', 0.6)], null);
    mist(c, 80, 22, hz);
    for (y = 100; y < 112; y += HP) R(c, 0, y, SW, HP, mix(hm('#8cc8e8', 0.3), hm('#5aa0d8', 0.3), (y - 100) / 12));
    R(c, 0, 100, SW, HP, hm('#ffffff', 0.2));
    var CS = [hm('#6a6a84', 0.32), hm('#a29eac', 0.32), hm('#e4dcd4', 0.26)], CF = [hm('#283250', 0.3), hm('#3e4c78', 0.3), hm('#7a8ab4', 0.26)];
    // its reflection in the lake
    c.globalAlpha = 0.25; for (y = 101; y < 112; y += HP * 2) R(c, 96 + Math.sin(y * 2) * 0.6, y, 108, HP, CS[0]); c.globalAlpha = 1;
    wizardCastle(c, 150, 88, CS, CF, hm('#ffd878', 0.15), [hm('#5a6070', 0.35), hm('#7c8290', 0.35), hm('#7aa860', 0.3)]);
    for (i = 0; i < 18; i++) { x = 80 + rnd() * 150; canopy(c, x, 102 + rnd() * 2, 4 + rnd() * 3, 2.5, rnd, [hm('#2a5a4a', 0.38), hm('#3a7a58', 0.38), hm('#7ab078', 0.32)]); }
    L.push({ c: cs, f: 0.05 });

    /* The studios: great cream sound stages in a row, a green roller
       coaster looping round in front of them, and the big globe turning
       on its fountain at the gate. */
    var st = strip(), s = st.getContext('2d');
    var GB = 106, SP = [hm('#c4b49c', 0.3), hm('#efe2c8', 0.3), hm('#fff8ea', 0.25)];
    R(s, 0, GB, SW, H - GB, hm('#d8c8a8', 0.3)); R(s, 0, GB, SW, HP, hm('#fff0d8', 0.25));
    stage(s, 214, GB, 56, 24, SP, hm('#4a8ae0', 0.25));
    stage(s, 272, GB, 44, 20, [hm('#c8a894', 0.3), hm('#f0d4c0', 0.3), hm('#fff2e8', 0.25)], hm('#e8504a', 0.25));
    stage(s, 446, GB, 62, 26, SP, hm('#f0b030', 0.25));
    stage(s, -4, GB, 40, 18, [hm('#b8b4a8', 0.3), hm('#e6e0d0', 0.3), hm('#fffcf0', 0.25)], hm('#4ab080', 0.25));
    // the coaster: up the lift hill, a long drop, round the loop and over the camel-backs
    var CK = [hm('#1e7a34', 0.2), hm('#4cc048', 0.2), hm('#c8ffa0', 0.15), hm('#8a9488', 0.3)];
    var P = [[318, GB - 2], [334, GB - 30], [346, GB - 52], [352, GB - 54], [360, GB - 40], [370, GB - 8], [380, GB - 4]];
    var pts = curve(P, 0.4);
    var LX = 396, LY = GB - 22, LR = 17;
    for (var t = 0; t <= Math.PI * 2; t += 0.02) pts.push([LX + Math.sin(t) * LR + t * 1.6 - 16 + 16, LY + Math.cos(t) * LR]);
    curve([[LX + Math.PI * 2 * 1.6, GB - 5], [420, GB - 6], [430, GB - 22], [440, GB - 24], [448, GB - 10], [454, GB - 8]], 0.4).forEach(function (p) { pts.push(p); });
    track(s, pts, GB, CK);
    // a train of cars plunging down the drop
    [[362, GB - 31], [365, GB - 23]].forEach(function (q, qi) { R(s, q[0] - 1.5, q[1] - 2.5, 3.5, 2.5, hm(qi ? '#ffd040' : '#e84a48', 0.15)); R(s, q[0] - 1, q[1] - 3.5, 1, 1, hm('#ffe0c0', 0.15)); R(s, q[0] + 0.8, q[1] - 3.5, 1, 1, hm('#6a4a3a', 0.15)); });
    // the globe on its fountain, its ring tilted round it
    var GX = 46, GY = GB - 22;
    R(s, GX - 9, GB - 4, 18, 4, hm('#b8b0a8', 0.25)); R(s, GX - 9, GB - 4, 18, HP, hm('#ffffff', 0.2));
    R(s, GX - 2, GY + 8, 4, GB - GY - 12, hm('#a8a4a0', 0.25));
    for (i = 0; i < 9; i++) { var fa = -Math.PI / 2 + (i - 4) * 0.28; for (k = 0; k < 7; k += HP) R(s, GX + Math.cos(fa) * k * 1.4, GB - 6 + Math.sin(fa) * k * 0.9 + k * k * 0.06, HP, HP, hm('#e8f8ff', 0.15)); }
    var gring = function (front) {
      for (var a = 0; a < Math.PI * 2; a += 0.012) {
        var px = Math.cos(a) * 14.5, py = Math.sin(a) * 3 - Math.cos(a) * 2.6;
        if ((Math.sin(a) > 0) === front) { R(s, GX + px, GY + 1 + py, HP, 1.5, hm(Math.cos(a) < -0.3 ? '#f0f2f8' : '#b8bcc8', 0.15)); R(s, GX + px, GY + 1 + py, HP, HP, '#ffffff'); }
      }
    };
    gring(false);
    ball(s, GX, GY, 10, [hm('#1c4490', 0.2), hm('#3672d0', 0.2), hm('#6aa8f0', 0.15)]);
    // the lands on it, in silver: a long one running north to south, a broad one beside it
    var LD = [hm('#a8b8cc', 0.15), hm('#dce6f2', 0.15)];
    [[-5, -6, 1.6], [-6, -4, 1.9], [-5, -2, 1.3], [-3.6, 0.5, 1.1], [-3, 2.5, 1.4], [-2.6, 4.6, 1], [2, -5, 1.4], [3.6, -4.4, 1.6], [2.6, -2, 1.5], [3.2, 0.6, 2], [3.8, 3, 1.4], [6.2, -3, 1.2]].forEach(function (q) { disc(s, GX + q[0] + 0.3, GY + q[1] + 0.3, q[2], LD[0]); disc(s, GX + q[0], GY + q[1], q[2] * 0.85, LD[1]); });
    crescentLight(s, GX, GY, 10);
    gring(true);
    mist(s, 92, 16, hz);
    L.push({ c: st, f: 0.1 });

    /* The lagoon in front of them: blue water holding the sky, the
       lighthouse on its point, palms along the shore and a bridge across. */
    var lg = strip(), l = lg.getContext('2d');
    var WT = 108;
    for (y = WT; y < H; y += HP) { k = (y - WT) / (H - WT); R(l, 0, y, SW, HP, mix(hm('#7ad0f0', 0.3), hm('#2a8ad0', 0.2), Math.min(1, k * 2.2))); }
    R(l, 0, WT, SW, HP, hm('#ffffff', 0.2));
    for (i = 0; i < 110; i++) { x = rnd() * SW; y = WT + 1 + rnd() * 18; R(l, x, y, 1 + rnd() * 4, HP, rnd() > 0.4 ? hm('#e0f8ff', 0.2) : hm('#2a7ac0', 0.2)); }
    // the far shore, a low green bank with palms
    var sh = function (xx) { return WT - 1.5 + wv(xx, 3, 0.5) * 0.8; };
    for (x = 0; x < SW; x += HP) { y = sh(x); R(l, x, y, HP, WT - y + HP, hm('#5ab050', 0.2)); R(l, x, y, HP, HP, hm('#b8ec90', 0.2)); }
    var PP = [hm('#2a7a40', 0.22), hm('#3e9a4a', 0.22), hm('#8ad26a', 0.18), hm('#8a6a4a', 0.22), hm('#b08a5a', 0.22)];
    [[20, 24, 0.12], [34, 20, -0.1], [126, 22, 0.1], [258, 26, -0.12], [276, 20, 0.08], [384, 24, 0.12], [478, 22, -0.1], [496, 26, 0.08]].forEach(function (q) { palm(l, q[0], sh(q[0]) + 1, q[1], q[2], PP); });
    // the lighthouse on its rocks, red and white
    var LHX = 332;
    span(l, WT - 4, WT + 1, function (yy) { return LHX - 10 + (yy - WT + 4) * -1; }, function (yy) { return LHX + 9 + (yy - WT + 4); }, hm('#8a8478', 0.2));
    R(l, LHX - 10, WT - 4, 19, HP, hm('#d8d0c0', 0.2));
    for (y = WT - 34; y < WT - 4; y += HP) { k = (y - WT + 34) / 30; var hw = 2.4 + k * 1.6, band = Math.floor(k * 5) % 2; R(l, LHX - hw, y, hw * 2, HP, band ? hm('#e04a3a', 0.15) : hm('#fff8f0', 0.15)); R(l, LHX + hw * 0.3, y, hw * 0.7, HP, band ? hm('#a82a2a', 0.15) : hm('#d8d0d0', 0.15)); }
    R(l, LHX - 3.5, WT - 35, 7, 1, hm('#4a4a5a', 0.15)); R(l, LHX - 2, WT - 39, 4, 4, hm('#fff4a0', 0.1)); oval(l, LHX, WT - 39, 3, 2.4, hm('#c03030', 0.15), true);
    glow(l, LHX, WT - 37, 8, '#fff4c0', 0.7);
    l.globalAlpha = 0.3; for (y = WT + 1; y < WT + 22; y += HP * 2) R(l, LHX - 2.5 + Math.sin(y * 1.7) * 0.6, y, 5, HP, hm('#e04a3a', 0.2)); l.globalAlpha = 1;
    // a footbridge on stone piers
    var BX0 = 168, BX1 = 236;
    for (x = BX0; x <= BX1; x += HP) { y = WT - 6 - Math.sin((x - BX0) / (BX1 - BX0) * Math.PI) * 4; R(l, x, y, HP, 1.5, hm('#e8dcc8', 0.2)); R(l, x, y + 1.5, HP, HP, hm('#a89880', 0.2)); if (Math.round((x - BX0) * 2) % 6 === 0) R(l, x, y - 2.5, HP, 2.5, hm('#fff4e0', 0.2)); }
    R(l, BX0, WT - 9, BX1 - BX0, HP, hm('#fff4e0', 0.2));
    [BX0 + 6, (BX0 + BX1) / 2, BX1 - 6].forEach(function (px) { y = WT - 6 - Math.sin((px - BX0) / (BX1 - BX0) * Math.PI) * 4; R(l, px - 1.5, y + 2, 3, WT - y, hm('#c8b8a0', 0.2)); R(l, px - 1.5, y + 2, HP, WT - y, hm('#fff0dc', 0.2)); });
    L.push({ c: lg, f: 0.17 });

    // in front: a verge of grass and flower beds, tall palms, and lamps along the walk
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 123 + wv(xx, 2, 1.2) * 1.5 + wv(xx, 6, 0.3) * 0.6; };
    land(n, nf, ['#3a9a40', '#5cbc4c', '#a4ea78'], 6);
    var NP = ['#1e6a38', '#2e8a44', '#78c85a', '#7a5a3c', '#a8804e'];
    [[60, 42, 0.14], [74, 34, -0.12], [250, 44, -0.1], [452, 40, 0.12], [468, 32, -0.14]].forEach(function (q) { palm(n, q[0], nf(q[0]) + 2, q[1], q[2], NP); });
    for (i = 0; i < 120; i++) { x = rnd() * SW; y = nf(x) + 1 + rnd() * 4; var fc = ['#ff6a8a', '#ffd040', '#ffffff', '#ff9a40', '#c87aff'][i % 5]; R(n, x, y, 1, 1, fc); R(n, x, y, HP, HP, mix(fc, '#ffffff', 0.6)); }
    L.push({ c: nr, f: 0.28 });
    return L;
  };
  /* ---- 38 · New York at Christmas ---- */
  /* A tower of the city: a block with its windows in a grid, some lit warm
     for the evening, snow along the top, and setbacks stepping it in as it
     rises. P = {wall: [shade, body, light], win, lit, snow}; steps = [[height, inset], …] */
  var block = function (g, x, base, w, steps, P, rnd, lit) {
    var y = base, xl = x, xr = x + w;
    steps.forEach(function (st, si) {
      var top = y - st[0];
      xl = x + st[1]; xr = x + w - st[1];
      R(g, xl, top, xr - xl, y - top, P.wall[1]); R(g, xr - Math.max(1, (xr - xl) * 0.22), top, Math.max(1, (xr - xl) * 0.22), y - top, P.wall[0]); R(g, xl, top, HP, y - top, P.wall[2]);
      for (var wy = top + 2; wy < y - 1; wy += 2.5) for (var wx = xl + 1.5; wx < xr - 1.5; wx += 2) {
        var on = rnd() < lit, c = on ? P.lit : P.win;
        R(g, wx, wy, 1, 1.5, wx > xr - (xr - xl) * 0.22 - 1 ? mix(c, P.wall[0], on ? 0.25 : 0.4) : c);
      }
      R(g, xl - HP, top, xr - xl + HP * 2, HP, P.snow); R(g, xl, top + HP, (xr - xl) * 0.6, HP, mix(P.snow, P.wall[1], 0.5));
      y = top;
    });
    return { top: y, xl: xl, xr: xr };
  };
  // a wooden water tower on legs, the city's rooftop hat. c = [shade, body, light, legs]
  var waterTower = function (g, x, roof, s, c) {
    var h = 4 * s, w = 3.4 * s, top = roof - 2 * s - h;
    R(g, x - w / 2 + 0.3, roof - 2 * s, HP, 2 * s, c[3]); R(g, x + w / 2 - 0.8, roof - 2 * s, HP, 2 * s, c[3]); line(g, x - w / 2 + 0.3, roof - 2 * s, x + w / 2 - 0.8, roof, HP, c[3]);
    R(g, x - w / 2, top, w, h, c[1]); R(g, x + w * 0.15, top, w * 0.35, h, c[0]); R(g, x - w / 2, top, HP, h, c[2]);
    R(g, x - w / 2, top + h * 0.33, w, HP, c[0]); R(g, x - w / 2, top + h * 0.7, w, HP, c[0]);
    span(g, top - 1.6 * s, top, function (yy) { return x - (yy - top + 1.6 * s) / (1.6 * s) * (w / 2 + 0.3); }, function (yy) { return x + (yy - top + 1.6 * s) / (1.6 * s) * (w / 2 + 0.3); }, c[0]);
    R(g, x - w / 2 - 0.3, top - HP, w * 0.55, HP, '#ffffff');
  };
  /* A bare winter tree, snow lying along the top of every bough: a trunk
     that forks and forks again. c = [bark, bark light, snow] */
  var bareTree = function (g, x, y, len, ang, w, depth, c, rnd) {
    var x1 = x + Math.cos(ang) * len, y1 = y + Math.sin(ang) * len;
    var n = Math.max(2, Math.ceil(len / HP));
    for (var i = 0; i <= n; i++) {
      var t = i / n, px = x + (x1 - x) * t, py = y + (y1 - y) * t, ww = Math.max(HP, w * (1 - t * 0.35));
      R(g, px - ww / 2, py, ww, HP, c[0]);
      if (ww > 1) R(g, px - ww / 2, py, HP, HP, c[1]);
      if (Math.abs(Math.cos(ang)) > 0.35 || depth < 2) R(g, px - ww / 2, py - HP, ww, HP, c[2]);
    }
    if (depth <= 0) return;
    var kids = depth > 2 ? 2 : 2 + (rnd() > 0.5 ? 1 : 0);
    for (var k = 0; k < kids; k++) {
      var a = ang + (k - (kids - 1) / 2) * (0.55 + rnd() * 0.3) + (rnd() - 0.5) * 0.2;
      bareTree(g, x1, y1, len * (0.62 + rnd() * 0.16), a, w * 0.62, depth - 1, c, rnd);
    }
  };
  /* The Statue of Liberty on her island, far across the harbour: the star
     fort, the pedestal, her robe in green copper, her crown, the tablet, and
     the torch held high and burning. s = size. */
  var liberty = function (g, x, base, s, tone) {
    var CU = [tone('#3e8a7c'), tone('#6cbcaa'), tone('#b0eadc')], ST = [tone('#9a8a84'), tone('#d0c0b0'), tone('#f4e8dc')];
    oval(g, x, base, 16 * s, 2.4 * s, tone('#6a8a6a'), true);
    span(g, base - 3 * s, base - HP, function (yy) { return x - 10 * s + (base - yy) * 0.6; }, function (yy) { return x + 10 * s - (base - yy) * 0.6; }, ST[1]);
    R(g, x + 4 * s, base - 3 * s, 5 * s, 3 * s, ST[0]);
    // the pedestal
    span(g, base - 12 * s, base - 3 * s, function (yy) { return x - 3.2 * s + (base - 3 * s - yy) * 0.06; }, function (yy) { return x + 3.2 * s - (base - 3 * s - yy) * 0.06; }, ST[1]);
    R(g, x + 1.2 * s, base - 12 * s, 2 * s, 9 * s, ST[0]); R(g, x - 3.6 * s, base - 12.6 * s, 7.2 * s, 0.8 * s, ST[2]);
    R(g, x - 1 * s, base - 9 * s, 2 * s, 2 * s, ST[0]);
    // her robe, falling in folds, wider at the hem
    span(g, base - 24 * s, base - 12.6 * s, function (yy) { var k = (yy - base + 24 * s) / (11.4 * s); return x - (1.2 + k * 1.4) * s; }, function (yy) { var k = (yy - base + 24 * s) / (11.4 * s); return x + (1.3 + k * 1.5) * s; }, CU[1]);
    span(g, base - 24 * s, base - 12.6 * s, function (yy) { var k = (yy - base + 24 * s) / (11.4 * s); return x + (0.3 + k * 0.6) * s; }, function (yy) { var k = (yy - base + 24 * s) / (11.4 * s); return x + (1.3 + k * 1.5) * s; }, CU[0]);
    R(g, x - 1.2 * s, base - 23 * s, HP, 10 * s, CU[2]);
    // the tablet in her left arm, her head and crown
    R(g, x + 1.2 * s, base - 21 * s, 1.6 * s, 2.6 * s, CU[1]); R(g, x + 1.2 * s, base - 21 * s, HP, 2.6 * s, CU[2]);
    disc(g, x, base - 25.2 * s, 1.2 * s, CU[1]); R(g, x - 0.6 * s, base - 25.8 * s, HP, HP, CU[2]);
    for (var a = -2; a <= 2; a++) line(g, x + a * 0.5 * s, base - 26.2 * s, x + a * 1.3 * s, base - 27.8 * s + Math.abs(a) * 0.4 * s, HP, CU[1]);
    // the raised arm and the torch
    line(g, x - 1.2 * s, base - 22.5 * s, x - 2.2 * s, base - 30 * s, Math.max(HP, 0.9 * s), CU[1]);
    line(g, x - 1.4 * s, base - 22.5 * s, x - 2.4 * s, base - 30 * s, HP, CU[2]);
    R(g, x - 3 * s, base - 31 * s, 1.6 * s, 1 * s, CU[1]);
    glow(g, x - 2.2 * s, base - 32 * s, 6 * s, '#ffd890', 0.9);
    disc(g, x - 2.2 * s, base - 32 * s, 0.9 * s, '#ffc040'); disc(g, x - 2.3 * s, base - 32.3 * s, 0.5 * s, '#fff6c0');
  };

  GEN.newyork = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    var WARM = '#ffd27a';
    /* A winter afternoon running out: the sun low and gold behind the
       towers, the clouds lit pink from beneath, the moon already up, and
       the harbour catching it all. */
    var far = strip(), g = far.getContext('2d');
    var SX = 200, SY = 84;
    for (y = 30; y < 100; y += 1) { g.globalAlpha = 0.28 * Math.pow((y - 30) / 70, 1.6); R(g, 0, y, SW, 1, '#ffe0b0'); }
    g.globalAlpha = 1;
    [[4, 0.05], [3, 0.08], [2.2, 0.12], [1.5, 0.2]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, SX, SY, 10 * q[0], '#fff0c8'); });
    g.globalAlpha = 1;
    disc(g, SX, SY, 10, '#ffc070'); disc(g, SX - 0.6, SY - 0.8, 8.8, '#ffd890'); disc(g, SX - 3, SY - 3.4, 4, '#fff4d0');
    var MX = 70, MY = 22;
    glow(g, MX, MY, 14, '#ffffff', 0.45); K.crescent(g, MX, MY, 5, 2.4, -1.6, 4.4, '#fff8f0'); R(g, MX - 4, MY - 1, 1, 2, '#ffffff');
    for (i = 0; i < 10; i++) streak(g, rnd() * SW, 16 + rnd() * 58, 40 + rnd() * 80, 1.5 + rnd() * 2.5, [hm('#a888c0', 0.2), hm('#f4b8c8', 0.15), '#ffe4b8'], true);
    stars(g, 18, 2, 26, rnd, ['#ffffff', '#fff0f8']);
    // the harbour: grey-blue water out to the horizon, the sun's road across it
    var SEA = 97;
    for (y = SEA; y < H; y += HP) { k = (y - SEA) / (H - SEA); R(g, 0, y, SW, HP, mix(hm('#c8a8c8', 0.3), hm('#6a7aa8', 0.2), Math.min(1, k * 2))); }
    R(g, 0, SEA, SW, HP, hm('#fff0e0', 0.2));
    for (i = 0; i < 90; i++) { x = rnd() * SW; y = SEA + 1 + rnd() * 12; R(g, x, y, 1 + rnd() * 3, HP, rnd() > 0.5 ? hm('#f4d8e0', 0.2) : hm('#5a6a98', 0.2)); }
    for (y = SEA + HP; y < SEA + 14; y += HP) if (rnd() > 0.3) { x = SX + (rnd() + rnd() - 1) * (5 + (y - SEA) * 1.5); R(g, x - 1, y, 0.6 + rnd() * 2, HP, rnd() > 0.3 ? '#ffe0a8' : '#fff6d8'); }
    // Lady Liberty on her island, and the ferry going out to her
    liberty(g, 50, SEA + 1.5, 0.82, function (c) { return hm(c, 0.25); });
    boat(g, 98, SEA + 3, 0.34, [hm('#e8e0d8', 0.3), hm('#ffffff', 0.2), hm('#d8c8d0', 0.3), hm('#5a5a7a', 0.3)]);
    L.push({ c: far, f: 0.02 });

    /* Downtown far off in the haze, then midtown: the Empire State, its top
       lit red and green for Christmas, and the Chrysler's crown of stacked
       arches, with a crowd of towers round them and lit windows everywhere. */
    var dt = strip(), d = dt.getContext('2d');
    var PF = { wall: [hm('#8a7aa8', 0.55), hm('#a898c0', 0.55), hm('#d8c8e0', 0.5)], win: hm('#9888b0', 0.55), lit: hm('#ffe0a0', 0.4), snow: hm('#ffffff', 0.4) };
    for (x = 120; x < 512; x += 6 + rnd() * 8) { var bw = 6 + rnd() * 8; block(d, x, SEA + 2, bw, [[12 + rnd() * 22, 0], [rnd() * 6, 1.5]], PF, rnd, 0.3); }
    L.push({ c: dt, f: 0.04 });

    var md = strip(), m = md.getContext('2d');
    var MB = 106, PM = { wall: [hm('#6a6088', 0.38), hm('#8c80a8', 0.38), hm('#c8b8d8', 0.32)], win: hm('#6c6488', 0.35), lit: hm(WARM, 0.15), snow: hm('#ffffff', 0.3) };
    var PM2 = { wall: [hm('#7a6878', 0.38), hm('#a08898', 0.38), hm('#dcc4d0', 0.32)], win: hm('#786478', 0.35), lit: hm(WARM, 0.15), snow: hm('#ffffff', 0.3) };
    // the crowd of towers, leaving the harbour open on the left
    for (x = 104; x < 520;) {
      var w2 = 8 + Math.floor(rnd() * 10), hh = 20 + rnd() * 34;
      if (!(x > 150 && x < 200) && !(x > 268 && x < 300)) block(m, x, MB, w2, [[hh, 0], [rnd() * 8, 1.5], [rnd() > 0.6 ? 3 + rnd() * 4 : 0, 3]], rnd() > 0.5 ? PM : PM2, rnd, 0.35);
      x += w2 + 1 + rnd() * 4;
    }
    // the Empire State Building
    var EX = 176, ES = { wall: [hm('#7c7090', 0.3), hm('#a89cb8', 0.3), hm('#e8dcec', 0.25)], win: hm('#7a7090', 0.3), lit: hm(WARM, 0.12), snow: hm('#ffffff', 0.2) };
    var e = block(m, EX - 13, MB, 26, [[22, 0], [8, 2.5], [34, 6], [4, 8], [4, 9.5], [3, 10.5]], ES, rnd, 0.4);
    var EM = (e.xl + e.xr) / 2;
    R(m, EM - 1.5, e.top - 6, 3, 6, ES.wall[1]); R(m, EM + 0.5, e.top - 6, 1, 6, ES.wall[0]);
    R(m, EM - 0.75, e.top - 9, 1.5, 3, ES.wall[2]); R(m, EM - HP / 2, e.top - 16, HP, 7, ES.wall[2]);
    // its crown floodlit for Christmas: red below, green above
    glow(m, EM, e.top + 2, 12, '#ff6a6a', 0.5); glow(m, EM, e.top - 6, 9, '#7aff9a', 0.45);
    R(m, e.xl, e.top, e.xr - e.xl, 3, '#ff8a7a'); R(m, e.xl, e.top, HP, 3, '#ffd0c0'); R(m, e.xl, e.top + 3, e.xr - e.xl, 4, '#ff5a5a');
    R(m, EM - 1.5, e.top - 6, 3, 6, '#7aeea0'); R(m, EM - 1.5, e.top - 6, 1, 6, '#c8ffd8');
    // the Chrysler Building: a slim shaft, then the crown of arches, each with its row of triangle windows, and the needle
    var CX = 286, CP = { wall: [hm('#6a6890', 0.3), hm('#9a98b8', 0.3), hm('#e0e0f0', 0.25)], win: hm('#706c90', 0.3), lit: hm(WARM, 0.12), snow: hm('#ffffff', 0.2) };
    var cb = block(m, CX - 9, MB, 18, [[20, 0], [28, 3], [6, 4.5]], CP, rnd, 0.4);
    var CM = (cb.xl + cb.xr) / 2, steel = [hm('#9aa0b8', 0.2), hm('#d8dcec', 0.2), hm('#ffffff', 0.1)];
    for (k = 0; k < 5; k++) {
      var rr = 4.5 - k * 0.8, cy2 = cb.top - k * 3.2;
      ring(m, CM, cy2, Math.max(0, rr - 1.2), rr, steel[1], cy2);
      ring(m, CM + rr * 0.4, cy2, Math.max(0, rr - 1.2), rr, steel[0], cy2 - rr * 0.2);
      for (var a = 0.35; a < Math.PI - 0.3; a += 0.55) R(m, CM - Math.cos(a) * (rr - 0.6), cy2 - Math.sin(a) * (rr - 0.6), HP, 1, '#ffe8a0');
      R(m, CM - rr, cy2, rr * 2, HP + (k ? 0 : 1), steel[1]);
    }
    span(m, cb.top - 26, cb.top - 13, function (yy) { return CM - 1.3 * (yy - cb.top + 26) / 13; }, function (yy) { return CM + 1.3 * (yy - cb.top + 26) / 13; }, steel[1]);
    R(m, CM - HP / 2, cb.top - 26, HP, 13, steel[2]);
    // water towers on the lower roofs, warm windows twinkling, and snow drifting
    mist(m, 90, 16, hz);
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = rnd() * 100; m.globalAlpha = 0.5 + rnd() * 0.4; R(m, x, y, HP, HP, '#ffffff'); }
    m.globalAlpha = 1;
    L.push({ c: md, f: 0.07 });

    /* The street before the park: brownstones and red-brick walk-ups, snow
       on their cornices, wreaths in the windows, fire escapes zigzagging
       down, water towers on top, and a string of Christmas lights. */
    var rw = strip(), r = rw.getContext('2d');
    var RB = 112;
    var BR = [[hm('#7a3a34', 0.2), hm('#a8584a', 0.2), hm('#e09a80', 0.18)], [hm('#5a3a30', 0.2), hm('#8a5a44', 0.2), hm('#c89a78', 0.18)], [hm('#8a5a48', 0.2), hm('#c08a6a', 0.2), hm('#f0c8a8', 0.18)]];
    var WT = [hm('#5a3a2a', 0.2), hm('#8a5e3e', 0.2), hm('#c09a70', 0.18), hm('#3a2a28', 0.2)];
    // (the left of the strip left open, so the river, the harbour and the towers show beyond the park)
    for (x = 214; x < SW - 10;) {
      var bw2 = Math.min(SW - 4 - x, 22 + Math.floor(rnd() * 3) * 6), bh = 17 + Math.floor(rnd() * 3) * 5.5, C = BR[Math.floor(rnd() * 3)], top = RB - bh;
      R(r, x, top, bw2, bh, C[1]); R(r, x + bw2 - 2, top, 2, bh, C[0]); R(r, x, top, HP, bh, C[2]);
      // the cornice, with snow lying on it
      R(r, x - 0.5, top - 1.5, bw2 + 1, 1.5, C[2]); R(r, x - 0.5, top - 2, bw2 + 1, 1, '#ffffff'); R(r, x - 0.5, top, bw2 + 1, HP, C[0]);
      for (var fy = top + 3; fy < RB - 6; fy += 5.5) for (var fx = x + 2.5; fx < x + bw2 - 3; fx += 4.5) {
        var on = rnd() < 0.55;
        if (on) glow(r, fx + 1, fy + 1.5, 3, WARM, 0.5);
        R(r, fx - HP, fy - HP, 2 + HP * 2, 3 + HP * 2, C[2]); R(r, fx, fy, 2, 3, on ? '#ffe6a0' : hm('#4a4a6a', 0.2)); R(r, fx, fy + 3, 2, HP, '#ffffff');
        if (on && rnd() < 0.2) { ring(r, fx + 1, fy + 1.5, 0.5, 1.2, '#3a9a4a'); R(r, fx + 0.75, fy + 2.4, HP, HP, '#ff4a4a'); }
      }
      // a fire escape on some, black iron in zigzags
      if (rnd() > 0.45) {
        var ex = x + bw2 * 0.5 - 4;
        for (fy = top + 7.5; fy < RB - 4; fy += 5.5) { R(r, ex, fy, 9, HP, hm('#2a2430', 0.2)); R(r, ex, fy - 1.5, 9, HP, hm('#3a3440', 0.2)); R(r, ex, fy - 2, 9, HP, '#ffffff'); for (var px = ex; px <= ex + 9; px += 1.5) R(r, px, fy - 1.5, HP, 1.5, hm('#3a3440', 0.2)); line(r, ex + 1, fy, ex + 8, fy + 5.5, HP, hm('#2a2430', 0.2)); }
      }
      // the stoop and door
      var dx2 = x + bw2 - 9;
      R(r, dx2, RB - 6, 4, 6, hm('#4a2a20', 0.2)); R(r, dx2 + 0.5, RB - 5.5, 3, 5.5, hm('#2a5a3a', 0.2)); ring(r, dx2 + 2, RB - 4, 0.6, 1.3, '#3aa04a'); R(r, dx2 + 1.75, RB - 3, HP, HP, '#ff4a4a');
      if (rnd() > 0.4) waterTower(r, x + 6 + rnd() * (bw2 - 12), top - 1.5, 1.6 + rnd() * 0.5, WT);
      x += bw2 + (rnd() > 0.7 ? 2 : 0);
    }
    // Christmas lights strung along the street
    var LC = ['#ff4a5a', '#ffd040', '#5ad0ff', '#7aff8a', '#ff9a40'];
    [[214, 314], [314, 414], [414, 508]].forEach(function (q, qi) {
      line(r, q[0], RB - 12, q[1], RB - 12, HP, hm('#2a2430', 0.2), 3);
      for (var t = 1; t < 10; t++) { var lx = q[0] + (q[1] - q[0]) * t / 10, ly = RB - 12 + 12 * (t / 10) * (1 - t / 10) + 0.8, lc = LC[(t + qi) % 5]; glow(r, lx, ly, 2.6, lc, 0.6); R(r, lx - HP / 2, ly - HP / 2, 1, 1, lc); }
    });
    // along the open stretch, the far side of the park: snowy treetops in the haze, and the river beyond
    for (i = 0; i < 14; i++) { x = -10 + rnd() * 224; bareTree(r, x, RB + 1, 4 + rnd() * 3, -Math.PI / 2 + (rnd() - 0.5) * 0.3, 1.4, 3, [hm('#8a7488', 0.35), hm('#b8a0b4', 0.35), hm('#ffffff', 0.2)], rnd); }
    R(r, 0, RB, SW, H - RB, hm('#e8ecf6', 0.15)); R(r, 0, RB, SW, HP, '#ffffff');
    L.push({ c: rw, f: 0.14 });

    /* Central Park under snow: bare trees with snow along every bough, a
       few snowy firs, the old lamps already lit, the low stone wall. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 120 + wv(xx, 2, 0.4) * 2 + wv(xx, 5, 1.1) * 0.8; };
    var BK = ['#4a3a44', '#7a6070', '#ffffff'];
    [[34, 26], [120, 30], [198, 22], [300, 28], [384, 24], [468, 30]].forEach(function (q) {
      var tx = q[0] + rnd() * 10;
      bareTree(n, tx, nf(tx) + 2, q[1] * 0.42, -Math.PI / 2 + (rnd() - 0.5) * 0.2, 2.6, 4, BK, rnd);
    });
    var snowFir = function (fx, base, h) {
      for (var yy = 0; yy < h; yy += HP) {
        var k2 = yy / h, tier = (yy % 6) / 6, w3 = (1 - k2) * h * 0.36 * (0.75 + tier * 0.4);
        R(n, fx - w3, base - yy, w3 * 2, HP, '#2e5a50'); R(n, fx + w3 * 0.2, base - yy, w3 * 0.8, HP, '#1e4040');
        if (tier > 0.75) R(n, fx - w3, base - yy, w3 * 1.5, HP, '#ffffff');
      }
      R(n, fx - HP / 2, base - h - 1, HP, 1, '#ffffff');
    };
    [[80, 22], [92, 16], [252, 20], [430, 24], [442, 16]].forEach(function (q) { snowFir(q[0], nf(q[0]) + 2, q[1]); });
    // the lamps along the path, glowing in the dusk
    [64, 164, 272, 352, 492].forEach(function (lx) {
      var ly = nf(lx) + 2;
      R(n, lx - 0.5, ly - 18, 1, 18, '#2a2a34'); R(n, lx - 1, ly - 2, 2, 2, '#2a2a34');
      glow(n, lx, ly - 20, 10, WARM, 0.9);
      R(n, lx - 1.5, ly - 22, 3, 3.5, '#ffe6a0'); R(n, lx - 1, ly - 21.5, 1, 2, '#fffbe0'); R(n, lx - 2, ly - 22.5, 4, 1, '#2a2a34'); R(n, lx - 2, ly - 23, 4, HP, '#ffffff');
    });
    land(n, nf, ['#c8d4ec', '#eef2fa', '#ffffff'], 6);
    // the low stone wall along the park's edge, snow on its coping
    for (x = 0; x < SW; x += HP) { y = nf(x) + 3; R(n, x, y, HP, 3, (Math.round(x * 2) % 9) ? '#8a8494' : '#6a6474'); R(n, x, y - 1, HP, 1, '#ffffff'); R(n, x, y + 3, HP, HP, '#5a5464'); }
    for (i = 0; i < 50; i++) { x = rnd() * SW; y = nf(x) - 1 - rnd() * 60; n.globalAlpha = 0.7; R(n, x, y, rnd() > 0.7 ? 1 : HP, rnd() > 0.7 ? 1 : HP, '#ffffff'); }
    n.globalAlpha = 1;
    L.push({ c: nr, f: 0.26 });
    return L;
  };
  /* ---- 39 · Jamaica ---- */
  // a little painted house on the hillside: bright walls, a tin roof, a window and a door. c = [wall, roof], tone = haze
  var cottage = function (g, x, base, w, h, c, tone) {
    var wl = tone(c[0]), rf = tone(c[1]);
    R(g, x, base - h, w, h, wl); R(g, x + w - 1.5, base - h, 1.5, h, mix(wl, '#3a2a4a', 0.2)); R(g, x, base - h, HP, h, mix(wl, '#ffffff', 0.35));
    span(g, base - h - 2.5, base - h + 0.5, function (yy) { return x - 1 + (base - h + 0.5 - yy) * 0.6; }, function (yy) { return x + w + 1 - (base - h + 0.5 - yy) * 0.6; }, rf);
    R(g, x - 1, base - h + 0.5, w + 2, HP, mix(rf, '#000000', 0.25)); R(g, x + 0.5, base - h - 2.5, w - 1, HP, mix(rf, '#ffffff', 0.35));
    R(g, x + w * 0.2, base - h + 1.5, 1.5, 1.5, tone('#ffffff')); R(g, x + w * 0.6, base - 3, 1.5, 3, tone(mix(c[0], '#3a2a2a', 0.45)));
  };

  GEN.jamaica = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A hot blue sky: the sun high, big white clouds building over the
       mountains, frigate birds wheeling. */
    var far = strip(), g = far.getContext('2d');
    sun(g, 176, 20, 10, ['#fff8d8', '#fff4c0', '#fffcec']);
    var CB = [hm('#a8d4f0', 0.12), '#ffffff', '#ffffff'];
    [[20, 28, 0.85], [100, 16, 0.7], [262, 30, 1.05], [380, 18, 0.8], [470, 36, 0.75]].forEach(function (q) { cloud(g, q[0] + rnd() * 10, q[1], q[2], CB); });
    for (i = 0; i < 12; i++) cloud(g, i * 44 + rnd() * 20, 70 + rnd() * 8, 0.32 + rnd() * 0.2, [hm('#b4dcf2', 0.35), hm('#ffffff', 0.15), '#ffffff']);
    [[214, 40], [226, 46], [330, 34]].forEach(function (q) { gull(g, q[0], q[1], 0.6, [hm('#3a3a4a', 0.4), hm('#5a5a6a', 0.45), hm('#2a2a3a', 0.4)]); });
    L.push({ c: far, f: 0.03 });

    // the Blue Mountains, true to their name, wisps of cloud on their shoulders
    var mt = strip(), m = mt.getContext('2d');
    /* the range: long ridges of soft, forested peaks, one behind another,
       each further one paler and bluer */
    var peaks = function (base, n, hh, ww, ph) {
      var P = [];
      for (var q = 0; q < n; q++) P.push([(q + 0.5 + Math.sin(q * 2.3 + ph) * 0.3) * SW / n, hh * (0.6 + 0.4 * Math.abs(Math.sin(q * 1.7 + ph))), ww * (0.7 + 0.3 * Math.abs(Math.cos(q * 1.3 + ph)))]);
      return function (xx) {
        var t = 0;
        P.forEach(function (p) { [-SW, 0, SW].forEach(function (o) { var d = (xx - p[0] - o) / p[2]; t = Math.max(t, p[1] * Math.exp(-d * d)); }); });
        return base - t - wv(xx, 9, ph) * 1.2 - wv(xx, 23, ph * 2) * 0.5;
      };
    };
    land(m, peaks(80, 6, 34, 44, 0.3), [null, hm('#5a86c4', 0.58), hm('#a0c4ec', 0.5)], 0);
    mist(m, 52, 30, hz);
    land(m, peaks(86, 8, 24, 30, 2.2), [null, hm('#3e70ac', 0.48), hm('#8ab8e4', 0.42)], 0);
    mist(m, 64, 26, hz);
    var fr = peaks(94, 11, 14, 22, 4.1);
    land(m, fr, [null, hm('#2e6494', 0.4), hm('#7ab0d8', 0.36)], 0);
    for (i = 0; i < 260; i++) { x = rnd() * SW; y = fr(x) + 1.5 + rnd() * 10; R(m, x, y, 1, HP, hm('#285a88', 0.4)); }
    mist(m, 76, 26, hz);
    for (i = 0; i < 8; i++) streak(m, rnd() * SW, 62 + rnd() * 20, 30 + rnd() * 30, 2 + rnd() * 1.5, [hm('#c8e4f4', 0.3), hm('#ffffff', 0.2), '#ffffff']);
    L.push({ c: mt, f: 0.05 });

    /* The green hills tumbling down to the coast, thick with jungle, little
       painted houses dotted over them, and the river falls coming down to
       the sea over terrace after terrace of pale rock. */
    var hl = strip(), h = hl.getContext('2d');
    var HB = 100;
    var hf = function (xx) { return 72 + wv(xx, 2, 0.8) * 8 + wv(xx, 5, 2) * 4 + wv(xx, 11, 0.2) * 1.5; };
    var JG = [hm('#1e6a3a', 0.38), hm('#2e8a44', 0.38), hm('#6ac25a', 0.32), hm('#b0ec80', 0.3)];
    land(h, hf, [JG[0], JG[1], JG[2]], 10);
    // the jungle's crown, bumpy all along the ridge and down the slopes
    for (i = 0; i < 140; i++) { x = rnd() * SW; y = hf(x) + 2 + Math.pow(rnd(), 1.5) * (HB - hf(x)); canopy(h, x, y, 3 + rnd() * 3, 2 + rnd() * 1.5, rnd, [JG[0], JG[1], JG[2]]); }
    /* the falls: the river coming out of the forest and down to the sea in
       a stair of white cascades — over each lip of pale rock, into a
       turquoise pool, out over the next — wider as it goes */
    mist(h, 84, 18, hz);
    var FX = 124, FT = hf(FX) + 4, TR = [hm('#a89878', 0.28), hm('#dcd0b0', 0.28), hm('#fff8e8', 0.22)], WA = [hm('#4ac8d8', 0.22), hm('#b0f0fa', 0.18), '#ffffff'];
    var TI = [[0, 8, 4], [4, 12, 3], [-1, 15, 4.5], [5, 18, 3], [1, 24, 4.5], [8, 28, 3.5], [4, 36, 0]], sc = (HB - FT - 1.5) / 22.5;
    for (y = FT - 12; y < FT + 1; y += HP) { var rx = FX + Math.sin(y * 0.4) * 2; R(h, rx - 1.5, y, 3, HP, WA[0]); R(h, rx - 0.5, y, 1, HP, WA[1]); }
    y = FT;
    TI.forEach(function (t, ti) {
      var cx = FX + t[0], w = t[1], dr = t[2] * sc, nx = ti < TI.length - 1 ? FX + TI[ti + 1][0] : cx, nw = ti < TI.length - 1 ? TI[ti + 1][1] : w;
      // the rock the pool lies in, and the pool, its near edge lit
      oval(h, cx + 0.5, y + 1, w / 2 + 2.5, 2.2, TR[0]); oval(h, cx, y + 0.6, w / 2 + 1.8, 1.8, TR[1]);
      oval(h, cx, y, w / 2, 1.1, WA[0]); R(h, cx - w / 2 + 1, y - 0.6, w * 0.45, HP, WA[1]);
      if (!dr) return;
      // the water going over the lip in a curtain, white and streaked, rocks showing at either side
      var cl = Math.max(cx - w / 2 + 1, nx - nw / 2 + 1), cr = Math.min(cx + w / 2 - 1, nx + nw / 2 - 1);
      if (cr - cl < 3) { cl = cx - 2; cr = cx + 2; }
      R(h, cl - 2, y + 1.5, 2, dr, TR[0]); R(h, cr, y + 1.5, 2, dr, TR[0]); R(h, cl - 2, y + 1.5, HP, dr, TR[1]);
      R(h, cl, y + 1.2, cr - cl, dr, TR[0]);
      for (x = cl; x < cr; x += HP) {
        var v = Math.sin(x * 2.1 + ti * 1.7) + Math.sin(x * 0.7 + ti) * 0.5, gap = Math.sin(x * 0.45 + ti * 2.9);
        if (gap > 0.82 && x > cl + 1 && x < cr - 1) { R(h, x, y + 1.2, HP, HP, TR[2]); continue; }
        R(h, x, y + 1.2, HP, dr, v > 0.5 ? WA[2] : v > -0.4 ? WA[1] : WA[0]);
        if (v > 0.9) R(h, x, y + 1.2, HP, dr * 0.5, '#ffffff');
      }
      R(h, cl, y + 1.2, cr - cl, HP, '#ffffff');
      y += dr;
      // foam churning where it lands
      for (x = cl; x < cr; x += 1.2) disc(h, x + 0.6, y + 0.4, 0.8 + Math.abs(Math.sin(x * 1.3)) * 0.6, '#ffffff');
    });
    glow(h, FX + 6, HB - 1, 16, '#ffffff', 0.5);
    // the forest crowding in over its banks
    for (k = 0; k < TI.length; k += 2) { var ky = FT + k * 3.3 * sc; canopy(h, FX + TI[k][0] - TI[k][1] / 2 - 6, ky + 1, 3 + rnd() * 1.5, 2, rnd, [JG[0], JG[1], JG[2]]); canopy(h, FX + TI[k][0] + TI[k][1] / 2 + 6, ky + 1, 3 + rnd() * 1.5, 2, rnd, [JG[0], JG[1], JG[2]]); }
    // flame trees in flower among the green, and palms standing up out of it
    for (i = 0; i < 9; i++) { x = 170 + rnd() * 330; y = hf(x) + 6 + rnd() * 14; pad(h, x, y, 3.5 + rnd() * 2, 1.8, 1, rnd, [hm('#c8302a', 0.3), hm('#f0503a', 0.28), hm('#ff9a6a', 0.24)]); }
    for (i = 0; i < 8; i++) { x = rnd() * SW; if (Math.abs(x - FX) < 26) continue; palm(h, x, hf(x) + 6, 12 + rnd() * 5, (rnd() - 0.5) * 0.4, [JG[0], JG[1], JG[2], hm('#7a6a50', 0.35), hm('#9a8a68', 0.35)]); }
    // the houses on the hills, in every colour
    var HC = [['#ff9ac0', '#d84a3a'], ['#ffe070', '#a8b0b8'], ['#60d8c8', '#d84a3a'], ['#b8e860', '#c86a3a'], ['#c8a0ff', '#a8b0b8'], ['#ffb070', '#4a8ad0']];
    for (i = 0; i < 18; i++) {
      x = 190 + rnd() * 300; y = hf(x) + 8 + rnd() * (HB - hf(x) - 10);
      cottage(h, x, y, 6 + rnd() * 4, 4 + rnd() * 2, HC[i % HC.length], function (c) { return hm(c, 0.3); });
      if (rnd() > 0.5) canopy(h, x - 2 + rnd() * 10, y + 1, 3, 1.6, rnd, [JG[0], JG[1], JG[2]]);
    }
    L.push({ c: hl, f: 0.09 });

    /* The sea: turquoise over the white sand, deepening to blue out by the
       reef, a line of surf breaking on it, boats out on the water; then the
       white beach, a jetty, and a fishing boat drawn up on the sand. */
    var sea = strip(), s = sea.getContext('2d');
    var ST = 100, BY = 113;
    for (y = ST; y < BY; y += HP) { k = (y - ST) / (BY - ST); R(s, 0, y, SW, HP, k < 0.3 ? mix(hm('#2a8ad8', 0.15), hm('#1aa8d8', 0.1), k / 0.3) : mix('#1ec4d8', '#6eeedc', (k - 0.3) / 0.7)); }
    R(s, 0, ST, SW, HP, hm('#e8fbff', 0.2));
    // the reef: a band where the water turns pale over it, and its line of breaking surf
    hline(s, 0, SW, function (xx) { return ST + 4 + wv(xx, 6, 1) * 0.6; }, '#9af4f0', function (xx) { return Math.sin(xx * 0.31) > -0.2; });
    hline(s, 0, SW, function (xx) { return ST + 3.5 + wv(xx, 6, 1) * 0.6; }, '#ffffff', function (xx) { return Math.sin(xx * 0.31 + 0.6) > 0.2; });
    for (i = 0; i < 130; i++) { x = rnd() * SW; y = ST + 1 + rnd() * (BY - ST - 2); R(s, x, y, 1 + rnd() * 4, HP, rnd() > 0.45 ? '#c8fff4' : hm('#1a8ac8', 0.1)); }
    [[240, 0.45], [330, 0.38], [430, 0.5]].forEach(function (q) { boat(s, q[0], ST + 2.5, q[1], [hm('#e84a4a', 0.2), '#ffffff', hm('#d8e8f0', 0.2), hm('#3a3a5a', 0.2)]); });
    // the white beach, its wet edge and the lace of foam along it
    var bf = function (xx) { return BY + wv(xx, 3, 0.4) * 1 + wv(xx, 8, 2) * 0.4; };
    for (x = 0; x < SW; x += HP) { y = bf(x); R(s, x, y, HP, H - y, '#fff8e8'); R(s, x, y, HP, 1.5, '#e8f6ee'); R(s, x, y - HP, HP, HP, '#ffffff'); if (Math.sin(x * 0.5) > 0.3) R(s, x, y - 1, HP, HP, '#ffffff'); }
    for (i = 0; i < 60; i++) { x = rnd() * SW; y = bf(x) + 2 + rnd() * 10; R(s, x, y, 1 + rnd() * 2, HP, rnd() > 0.5 ? '#f0e4c8' : '#ffffff'); }
    // a jetty of grey boards on posts, running out into the water
    var JX = 300;
    R(s, JX, BY - 6, 46, 1.5, '#c8b8a0'); R(s, JX, BY - 6, 46, HP, '#f4ead8'); R(s, JX, BY - 4.5, 46, HP, '#8a7a68');
    for (x = JX + 2; x < JX + 46; x += 6) { R(s, x, BY - 4.5, 1, 5, '#7a6a5a'); s.globalAlpha = 0.35; R(s, x, BY + 0.5, 1, 2, '#2a7aa0'); s.globalAlpha = 1; }
    // a fishing boat drawn up on the sand, painted in stripes
    var FBX = 172, FBY = bf(FBX) + 4;
    span(s, FBY - 4, FBY, function (yy) { return FBX - 10 + (yy - FBY + 4) * 1.2; }, function (yy) { return FBX + 9 - (yy - FBY + 4) * 0.6; }, '#ffd040');
    R(s, FBX - 10, FBY - 4, 19, 1, '#3aa04a'); R(s, FBX - 9, FBY - 2.5, 16, HP, '#e84a3a'); R(s, FBX - 10, FBY - 4, 19, HP, '#a8f08a');
    R(s, FBX - 4, FBY - 5, 1, 1, '#8a6a4a'); s.globalAlpha = 0.25; oval(s, FBX, FBY + 0.5, 11, 1, '#a89878'); s.globalAlpha = 1;
    L.push({ c: sea, f: 0.15 });

    // in front: tall palms leaning out over the sand, big leaves, hibiscus in flower
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 124 + wv(xx, 2, 0.3) * 1.5 + wv(xx, 7, 1) * 0.6; };
    land(n, nf, ['#e8d8b0', '#fff2d8', '#ffffff'], 5);
    var NP = ['#1e6a38', '#2e9a48', '#7ad060', '#8a6a48', '#b8905a'];
    [[30, 46, 0.22], [44, 38, 0.1], [204, 44, -0.18], [362, 48, 0.2], [376, 36, 0.08], [486, 40, -0.16]].forEach(function (q) { palm(n, q[0], nf(q[0]) + 2, q[1], q[2], NP); });
    var NL = ['#145a34', '#1e7a44', '#3ea85a', '#7ad07a'];
    [[110, 1], [268, -1], [440, 1]].forEach(function (q) {
      x = q[0] + rnd() * 10;
      leaf(n, x, nf(x) + 3, -Math.PI / 2 - 0.5 * q[1] - 0.3, 18 + rnd() * 6, 3.4, NL);
      leaf(n, x + 3, nf(x) + 3, -Math.PI / 2 + 0.5 * q[1] - 0.1, 16 + rnd() * 6, 3.2, NL);
      leaf(n, x + 1, nf(x) + 3, -Math.PI / 2 + 0.05, 14, 3, NL);
      for (j = 0; j < 3; j++) { var hx = x - 4 + j * 5 + rnd() * 2, hy = nf(x) - 6 - rnd() * 6; [0, 1.26, 2.51, 3.77, 5.03].forEach(function (a) { disc(n, hx + Math.cos(a) * 1.5, hy + Math.sin(a) * 1.5, 1.3, j % 2 ? '#ff5a7a' : '#ff3a4a'); }); disc(n, hx - 0.5, hy - 0.5, 0.8, '#ffb0c0'); R(n, hx, hy, HP, 2, '#ffe060'); }
    });
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = nf(x) + 2 + rnd() * 6; R(n, x, y, 1, HP, ['#ffd0e0', '#f0d8b0', '#ffffff'][i % 3]); }
    L.push({ c: nr, f: 0.28 });
    return L;
  };
  /* ---- 40 · Antarctica ---- */
  /* A curtain of the southern lights: a ribbon hanging across the sky, its
     lower hem brightest and fading upward, brighter where it folds.
     cols = [hem, top], a = how strong */
  var aurora = function (g, base, amp, n, ph, len, cols, a) {
    for (var x = 0; x < SW; x += HP) {
      var y0 = base + Math.sin(x * TAU * n + ph) * amp + Math.sin(x * TAU * (n * 2 + 1) + ph * 1.7) * amp * 0.4;
      var fold = Math.pow(0.5 + 0.5 * Math.sin(x * TAU * (n * 5 + 3) + ph * 2.3), 2), l = len * (0.55 + 0.45 * fold);
      for (var t = 0; t < l; t += 1) {
        var k = t / l;
        g.globalAlpha = a * (1 - k) * (0.35 + 0.65 * fold) * Math.min(1, (t + 1) / 3);
        R(g, x, y0 - t - 1, HP, 1, k < 0.45 ? cols[0] : cols[1]);
      }
      if (fold > 0.45) { g.globalAlpha = a * (fold - 0.45) * 1.2; R(g, x, y0 - HP, HP, HP, '#e8fff0'); }
    }
    g.globalAlpha = 1;
  };
  /* An iceberg on the waterline: sheer walls grooved by melt, its sunlit
     face white, its shaded face blue, snow on its top, the pale bulk of it
     showing green-blue under the water. Pointed if peaks are given; flat-
     topped (tabular) otherwise. c = [shade, body, light, under] */
  var berg = function (g, x, base, w, h, c, peaks) {
    var top = function (xx) {
      var u = (xx - x) / (w / 2);
      if (Math.abs(u) > 1) return base;
      if (!peaks) return base - h + Math.sin(xx * 0.9) * 0.4 + Math.pow(Math.abs(u), 6) * h * 0.5;
      var best = base;
      peaks.forEach(function (p) { var d = Math.abs(u - p[0]) / p[2]; if (d < 1) best = Math.min(best, base - h * p[1] * (1 - d) - Math.sin(xx * 1.7) * 0.3); });
      return best;
    };
    g.globalAlpha = 0.45; oval(g, x + w * 0.05, base + 1, w * 0.62, Math.max(2, h * 0.3), c[3]); g.globalAlpha = 1;
    for (var xx = x - w / 2; xx < x + w / 2; xx += HP) {
      var t = top(xx); if (t >= base - HP) continue;
      var u = (xx - x) / (w / 2), lit = peaks ? (top(xx + 1) < t ? 0 : 1) : u < 0.35;
      R(g, xx, t, HP, base - t, lit ? c[1] : c[0]);
      if (Math.sin(xx * 2.1) > 0.55) R(g, xx, t + 2, HP, base - t - 2, lit ? mix(c[1], c[0], 0.35) : mix(c[0], c[3], 0.25));
      R(g, xx, t, HP, peaks ? HP : 1.2, lit ? '#ffffff' : c[2]);
      if (lit && u < -0.4) R(g, xx, t + 1, HP, (base - t) * 0.4, c[2]);
    }
    R(g, x - w / 2, base - HP, w, HP, mix(c[0], c[3], 0.4));
  };
  // a penguin, tiny and far off: black back, white front, an orange dab at the beak. s = height
  var penguin = function (g, x, base, s) {
    oval(g, x, base - s * 0.45, s * 0.26, s * 0.45, '#22263a');
    oval(g, x - s * 0.06, base - s * 0.4, s * 0.14, s * 0.32, '#ffffff');
    disc(g, x, base - s * 0.92, s * 0.18, '#22263a'); R(g, x - s * 0.3, base - s * 0.92, Math.max(HP, s * 0.14), HP, '#ffa030');
  };

  GEN.antarctica = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* The polar sky: the southern lights hanging in green and pink
       curtains, the last stars, and a rosy glow along the horizon where
       the sun never quite sets. */
    var far = strip(), g = far.getContext('2d');
    stars(g, 60, 2, 50, rnd, ['#ffffff', '#e8f0ff', '#fff0f8']);
    for (y = 60; y < 100; y += 1) { g.globalAlpha = 0.35 * Math.pow((y - 60) / 40, 1.8); R(g, 0, y, SW, 1, '#ffd0e0'); }
    g.globalAlpha = 1;
    aurora(g, 48, 7, 2, 0.4, 36, ['#6affb0', '#b88aff'], 0.6);
    aurora(g, 30, 6, 3, 2.6, 26, ['#8affc8', '#ff8ad8'], 0.45);
    aurora(g, 60, 4, 1, 4.1, 22, ['#b0ff98', '#7ad8ff'], 0.32);
    for (i = 0; i < 5; i++) streak(g, rnd() * SW, 74 + rnd() * 16, 40 + rnd() * 50, 1.2 + rnd(), [hm('#c0b0e0', 0.3), hm('#ffe0ee', 0.2), '#fff4f8'], true);
    L.push({ c: far, f: 0.02 });

    // far mountains under snow, pale with distance, their shadows blue
    var mt = strip(), m = mt.getContext('2d');
    [[30, 110, 26], [118, 70, 40], [176, 130, 22], [262, 90, 46], [330, 60, 26], [400, 120, 34], [470, 76, 20]].forEach(function (q) { mountain(m, q[0], 98, q[1], q[2], [hm('#8aa8d8', 0.5), hm('#c8dcf4', 0.45)], [hm('#a8c4ec', 0.4), hm('#ffffff', 0.2)]); });
    mist(m, 80, 20, hz);
    L.push({ c: mt, f: 0.045 });

    /* The sea, deep blue and still, with the lights in it; icebergs adrift,
       flat-topped ones and pointed ones, floes, and somewhere a whale. */
    var se = strip(), s = se.getContext('2d');
    var SEA = 98;
    for (y = SEA; y < H; y += HP) { k = (y - SEA) / (H - SEA); R(s, 0, y, SW, HP, mix(hm('#4a6ab8', 0.3), '#1e3a88', Math.min(1, k * 1.6))); }
    R(s, 0, SEA, SW, HP, hm('#ffffff', 0.25));
    for (i = 0; i < 110; i++) { x = rnd() * SW; k = rnd(); y = SEA + 1 + k * 40; R(s, x, y, 1 + rnd() * (2 + k * 5), HP, rnd() > 0.55 ? hm('#c8e0ff', 0.25) : rnd() > 0.5 ? '#6ad8b0' : '#1a2e70'); }
    var BC = [hm('#6aa0d8', 0.2), hm('#e8f4ff', 0.15), hm('#ffffff', 0.1), hm('#3ab0c8', 0.2)];
    berg(s, 74, SEA + 2, 54, 12, BC, null);
    berg(s, 196, SEA + 3, 30, 16, BC, [[-0.3, 1, 0.7], [0.4, 0.7, 0.6]]);
    berg(s, 300, SEA + 2, 70, 9, BC, null);
    berg(s, 418, SEA + 4, 26, 20, BC, [[0.1, 1, 0.8], [-0.5, 0.55, 0.5]]);
    berg(s, 470, SEA + 1.5, 20, 6, BC, null);
    for (i = 0; i < 16; i++) { x = rnd() * SW; y = SEA + 4 + rnd() * 20; var fw2 = 3 + rnd() * 6; R(s, x, y, fw2, 1, hm('#ffffff', 0.15)); R(s, x, y + 1, fw2, HP, hm('#6a9ad8', 0.2)); }
    // a whale's spout and its back
    oval(s, 250, SEA + 6, 4, 1.2, '#2a3a6a', true); R(s, 249, SEA + 2, HP, 3, '#e8f4ff'); disc(s, 248.5, SEA + 1.5, 1, '#e8f4ff'); disc(s, 250.5, SEA + 1, 1.1, '#e8f4ff');
    L.push({ c: se, f: 0.08 });

    /* The edge of the ice shelf: a great wall of ice straight out of the
       sea, layered and grooved, a blue cave in its face, penguins along its
       top, and the little red hut of the research station. */
    var ic = strip(), c = ic.getContext('2d');
    var IB = 110, IT = function (xx) { return 80 + wv(xx, 2, 0.5) * 3 + wv(xx, 7, 1) * 1; };
    var X0 = 300, X1 = 512 + 60;
    var IC = [hm('#5a8ad0', 0.15), hm('#a8d0f4', 0.15), hm('#e8f6ff', 0.1), hm('#3a6ab8', 0.15)];
    for (x = X0; x < X1; x += HP) {
      var xx = x % SW, t = IT(x) + (x < X0 + 6 ? (X0 + 6 - x) * 2 : 0) + (x > X1 - 10 ? (x - X1 + 10) * 2.5 : 0);
      if (t >= IB) continue;
      // the face: paler at the top, bluer towards the sea, melt grooves running down it
      R(c, xx, t, HP, IB - t, IC[1]); R(c, xx, t + (IB - t) * 0.55, HP, (IB - t) * 0.45, mix(IC[1], IC[0], 0.35));
      var gv = Math.sin(x * 3.7) * Math.sin(x * 0.53 + 1);
      if (gv > 0.45) R(c, xx, t + 3 + Math.abs(Math.sin(x * 0.37)) * 4, HP, (IB - t - 3) * (0.35 + 0.5 * Math.abs(Math.sin(x * 0.9))), mix(IC[1], IC[0], 0.55));
      else if (gv < -0.6) R(c, xx, t + 3, HP, (IB - t) * 0.35, IC[2]);
      for (y = t + 7; y < IB - 2; y += 8.5) if (Math.sin(x * 0.13 + y * 0.7) > -0.3) R(c, xx, y + Math.sin(x * 0.05 + y) * 1.5, HP, HP, mix(IC[1], IC[0], 0.3));
      R(c, xx, t, HP, 2.5, '#ffffff'); R(c, xx, t + 2.5, HP, HP, IC[2]);
      if (x < X0 + 8) R(c, xx, t, HP, IB - t, IC[2]);
      if (x > X1 - 10) R(c, xx, t, HP, IB - t, IC[0]);
    }
    // the cave, deep blue inside
    oval(c, 420, IB, 9, 12, IC[3], true); oval(c, 421, IB, 6.5, 9, mix(IC[3], '#1a2a70', 0.4), true);
    c.globalAlpha = 0.18; for (y = IB + HP; y < IB + 7; y += HP * 2) for (x = X0 + 4; x < X1 - 6; x += 6) R(c, x + Math.sin(y * 2.3 + x) * 1.5, y, 4 - (y - IB) * 0.3, HP, IC[2]); c.globalAlpha = 1;
    // the station: a red hut on stilts, its lit window, an aerial mast
    var HX = 470, HY = IT(HX) + 0.5;
    R(c, HX - 9, HY - 8, 18, 7, '#e84a3a'); R(c, HX + 5, HY - 8, 4, 7, '#b02a2a'); R(c, HX - 9, HY - 8, 18, HP, '#ff9a8a'); R(c, HX - 10, HY - 9, 20, 1.2, '#ffffff');
    R(c, HX - 7, HY - 1, 1, 1.5, '#5a5a6a'); R(c, HX + 6, HY - 1, 1, 1.5, '#5a5a6a');
    glow(c, HX - 3, HY - 5, 5, '#ffd27a', 0.7); R(c, HX - 4, HY - 6.5, 3, 2, '#ffe6a0'); R(c, HX + 1, HY - 6, 2.5, 5, '#8a2a2a');
    R(c, HX + 12, HY - 20, HP, 20, '#6a6a7a'); R(c, HX + 12.5, HY - 20, 3, 2, '#ff6a3a'); R(c, HX + 10.5, HY - 15, 4, HP, '#6a6a7a');
    // penguins along the top of the shelf, and a crowd on a floe
    for (i = 0; i < 9; i++) { x = 330 + i * 9 + rnd() * 5; penguin(c, x, IT(x) + 1, 3 + rnd()); }
    R(c, 92, IB - 1, 30, 2, '#ffffff'); R(c, 92, IB + 1, 30, 1, hm('#6aa0d8', 0.2));
    for (i = 0; i < 6; i++) penguin(c, 96 + i * 4 + rnd(), IB - 0.5, 3 + rnd() * 0.6);
    L.push({ c: ic, f: 0.14 });

    // in front: drifts of snow with blue hollows, spires of old ice, sparkle
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 120 + wv(xx, 3, 0.7) * 3 + wv(xx, 8, 2) * 1; };
    var spire = function (sx, base, h, w) { K.crystal(n, sx, base, h, w, (rnd() - 0.5) * 0.12, ['#7ab0e8', '#c8e8ff', '#ffffff']); };
    [[60, 22, 5], [68, 14, 4], [224, 18, 5], [372, 26, 6], [382, 15, 4], [490, 16, 4]].forEach(function (q) { spire(q[0], nf(q[0]) + 3, q[1], q[2]); });
    land(n, nf, ['#a8c8f0', '#e8f4ff', '#ffffff'], 7);
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = nf(x) + 1 + rnd() * 8; R(n, x, y, HP, HP, '#ffffff'); if (rnd() > 0.8) { R(n, x - 1, y, 2.5, HP, '#ffffff'); R(n, x, y - 1, HP, 2.5, '#ffffff'); } }
    L.push({ c: nr, f: 0.27 });
    return L;
  };
  /* ---- 41 · Australia ---- */
  /* The great rock in the middle of the desert: a long loaf of red stone,
     sheer at its ends, its top gently domed and knobbled, the furrows the
     rain has cut down its face, and caves dark along its foot. c = [shade, body, light, furrow] */
  var bigRock = function (g, cx, base, w, h, c) {
    var top = function (xx) { var u = (xx - cx) / (w / 2); if (Math.abs(u) >= 1) return base; return base - h * Math.pow(1 - Math.pow(Math.abs(u), 5), 0.6) * (1 + 0.05 * Math.sin(u * 11)) - (u < 0 ? 0 : u * h * 0.08); };
    for (var x = cx - w / 2; x < cx + w / 2; x += HP) {
      var t = top(x), u = (x - cx) / (w / 2);
      if (t >= base - HP) continue;
      R(g, x, t, HP, base - t, u > 0.72 ? c[0] : c[1]);
      if (u < 0.72 && u > -0.95) R(g, x, t, HP, HP, c[2]);
      if (u < -0.6) R(g, x, t, HP, (base - t) * 0.6, mix(c[1], c[2], 0.4));
      var fv = Math.sin(x * 1.37) * Math.sin(x * 0.31 + 1);
      if (fv > 0.45) R(g, x, t + 1.5, HP, (base - t) * (0.4 + 0.5 * Math.abs(Math.sin(x * 0.7))), c[3]);
    }
    for (x = cx - w / 2 + 3; x < cx + w / 2 - 3; x += 4 + Math.abs(Math.sin(x)) * 6) oval(g, x, base - 1, 1.2, 1.5, c[3], true);
    R(g, cx - w / 2, base - HP, w, HP, c[0]);
  };
  /* A ghost gum: a pale trunk, smooth and white, forking into limbs that
     reach up and out, each holding a clump of grey-green leaves.
     c = leaves [shade, body, light], b = bark [shade, body, light] */
  var ghostGum = function (g, x, base, h, rnd, c, b) {
    var w = Math.max(1, h * 0.07);
    var limb = function (x0, y0, a, len, ww, d) {
      var x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len, n = Math.ceil(len / HP);
      for (var i = 0; i <= n; i++) { var t = i / n, px = x0 + (x1 - x0) * t + Math.sin(t * 3) * len * 0.05, py = y0 + (y1 - y0) * t, wd = Math.max(HP, ww * (1 - t * 0.4)); R(g, px - wd / 2, py, wd, HP, b[1]); if (wd > 1) { R(g, px + wd * 0.15, py, wd * 0.35, HP, b[0]); R(g, px - wd / 2, py, HP, HP, b[2]); } }
      if (d <= 0) { pad(g, x1, y1 - h * 0.04, h * 0.17, h * 0.08, Math.max(0.8, h * 0.03), rnd, c); return; }
      limb(x1, y1, a - 0.45 - rnd() * 0.25, len * 0.7, ww * 0.65, d - 1);
      limb(x1, y1, a + 0.4 + rnd() * 0.25, len * 0.65, ww * 0.6, d - 1);
    };
    limb(x, base, -Math.PI / 2 + (rnd() - 0.5) * 0.15, h * 0.42, w, 2);
  };
  // a kangaroo, a silhouette far off: bounding (up) or upright resting. s = size, col = colour
  var roo = function (g, x, base, s, col, up) {
    var lift = up ? s * 2.2 : 0, b = base - lift;
    oval(g, x, b - s * 3.2, s * 1.9, s * 1.3, col);
    oval(g, x + s * 1.1, b - s * 1.8, s * 1.1, s * 1.2, col);
    line(g, x + s * 1.6, b - s * 1, x + (up ? s * 4.2 : s * 2.8), b - (up ? s * 0.2 : s * 0.1), Math.max(HP, s * 0.6), col);
    line(g, x + s * 1.6, b - s * 1, x + (up ? s * 4 : s * 3.4), b - s * 0.3, Math.max(HP, s * 0.35), col);
    line(g, x - s * 0.6, b - s * 3.2, x - s * 2, b - s * 4.6, Math.max(HP, s * 0.6), col);
    disc(g, x - s * 2.3, b - s * 4.8, s * 0.65, col); R(g, x - s * 3.2, b - s * 4.7, s * 0.9, s * 0.45, col);
    line(g, x - s * 2, b - s * 5.2, x - s * 1.7, b - s * 6.3, Math.max(HP, s * 0.3), col);
    line(g, x - s * 1.2, b - s * 3, x - s * 1.9, b - s * 2, HP, col);
    if (up) line(g, x + s * 0.4, b - s * 0.9, x - s * 0.2, b + s * 0.2, Math.max(HP, s * 0.45), col);
    else { line(g, x + s * 0.4, b - s * 0.9, x - s * 0.6, b, Math.max(HP, s * 0.45), col); R(g, x - s * 1.6, b - HP, s * 1.6, Math.max(HP, s * 0.3), col); }
  };
  // a mound of spinifex: a dome of spiky grass, golden-green, lit on top. c = [shade, body, light]
  var spinifex = function (g, x, base, r, c) {
    oval(g, x + r * 0.08, base, r, r * 0.55, c[0], true); oval(g, x - r * 0.05, base - HP, r * 0.9, r * 0.5, c[1], true);
    for (var a = 0.2; a < Math.PI - 0.2; a += 0.35) R(g, x - Math.cos(a) * r * 0.9, base - Math.sin(a) * r * 0.55 - 0.8, HP, 1, c[2]);
  };

  GEN.australia = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* The biggest blue sky there is: the sun high and white-hot, a few
       small clouds, an eagle turning slow circles. */
    var far = strip(), g = far.getContext('2d');
    sun(g, 96, 18, 9, ['#fffbe0', '#fff8d0', '#ffffff']);
    [[200, 30, 0.6], [330, 22, 0.75], [450, 40, 0.5], [30, 46, 0.45]].forEach(function (q) { cloud(g, q[0], q[1], q[2], [hm('#a8d0f4', 0.1), '#ffffff', '#ffffff']); });
    for (i = 0; i < 6; i++) streak(g, rnd() * SW, 60 + rnd() * 24, 40 + rnd() * 60, 1 + rnd(), [hm('#d0e0f0', 0.3), hm('#fff4ec', 0.2), '#ffffff']);
    gull(g, 168, 40, 1.1, [hm('#5a3a2a', 0.25), hm('#7a5040', 0.3), hm('#3a2418', 0.25)]);
    L.push({ c: far, f: 0.02 });

    /* Out on the horizon: the great red rock, and the domes of the Olgas
       beside it, flat-topped ranges blue with distance. */
    var hr = strip(), h = hr.getContext('2d');
    var HB = 100;
    for (i = 0; i < 6; i++) { x = i * 90 + rnd() * 40; var mw = 50 + rnd() * 40, mh = 5 + rnd() * 5; span(h, HB - mh, HB, function (yy) { return x - mw / 2 - (yy - HB + mh) * 1.6; }, function (yy) { return x + mw / 2 + (yy - HB + mh) * 1.6; }, hm('#9a90b8', 0.6)); R(h, x - mw / 2, HB - mh, mw, HP, hm('#c8c0dc', 0.55)); }
    bigRock(h, 150, HB + 1, 76, 19, [hm('#a03e2c', 0.22), hm('#dc6a3c', 0.2), hm('#ffa868', 0.18), hm('#a84a30', 0.22)]);
    [[298, 9, 7], [309, 13, 8], [321, 10, 6], [330, 7, 5]].forEach(function (q) { oval(h, q[0] + 0.5, HB + 1, q[2], q[1], hm('#a04a3a', 0.4), true); oval(h, q[0] - 0.3, HB + 1, q[2] * 0.85, q[1] * 0.97, hm('#d0744a', 0.4), true); });
    for (y = HB; y < H; y += HP) { k = (y - HB) / (H - HB); R(h, 0, y, SW, HP, mix(hm('#e89a6a', 0.35), hm('#d0683a', 0.2), Math.min(1, k * 2))); }
    R(h, 0, HB, SW, HP, hm('#ffd8b0', 0.3));
    // its shadow and the heat shimmering on the plain
    h.globalAlpha = 0.3; R(h, 112, HB + 1, 76, 1, hm('#8a3a2a', 0.2)); h.globalAlpha = 1;
    for (i = 0; i < 80; i++) { x = rnd() * SW; y = HB + 1 + rnd() * 10; R(h, x, y, 1 + rnd() * 5, HP, rnd() > 0.5 ? hm('#f8b888', 0.3) : hm('#c8603a', 0.3)); }
    L.push({ c: hr, f: 0.035 });

    /* The outback: red earth to the horizon, mounds of spinifex, termite
       mounds standing like towers, scattered desert oaks, and kangaroos
       bounding off across it. */
    var ob = strip(), o = ob.getContext('2d');
    var OB = 104, of = function (xx) { return OB + wv(xx, 2, 0.8) * 1.5 + wv(xx, 7, 0.3) * 0.6; };
    land(o, of, [hm('#b8502a', 0.25), hm('#d8703c', 0.25), hm('#f8a870', 0.2)], 8);
    var SX = [hm('#8a8a3a', 0.3), hm('#b8b450', 0.3), hm('#e8e090', 0.25)];
    for (i = 0; i < 40; i++) { x = rnd() * SW; spinifex(o, x, of(x) + 1 + rnd() * 6, 2 + rnd() * 2, SX); }
    for (i = 0; i < 7; i++) { x = rnd() * SW; y = of(x) + 2; var th2 = 5 + rnd() * 6; span(o, y - th2, y, function (yy) { return x - 0.6 - (yy - y + th2) * 0.22; }, function (yy) { return x + 0.6 + (yy - y + th2) * 0.22; }, hm('#d88a4a', 0.25)); R(o, x - HP, y - th2, HP, th2, hm('#f8c080', 0.2)); }
    for (i = 0; i < 9; i++) { x = rnd() * SW; y = of(x) + 1; R(o, x - 0.5, y - 7, 1, 7, hm('#5a3a2a', 0.3)); pad(o, x, y - 8, 4, 2, 1, rnd, [hm('#4a5a34', 0.3), hm('#6a7a44', 0.3), hm('#a8b070', 0.25)]); }
    var RC = hm('#7a3a28', 0.3);
    [[60, 1], [74, 0], [224, 1], [236, 1], [366, 0], [452, 1]].forEach(function (q) { roo(o, q[0], of(q[0]) + 1, 0.8, RC, q[1]); });
    L.push({ c: ob, f: 0.07 });

    /* Nearer: ghost gums standing white against the blue, red boulders
       heaped like marbles, and more spinifex. */
    var md = strip(), m = md.getContext('2d');
    var mf = function (xx) { return 112 + wv(xx, 3, 1.4) * 2 + wv(xx, 8, 0.2) * 0.8; };
    var GL = [hm('#5a7a4a', 0.15), hm('#7a9a5a', 0.15), hm('#bcd090', 0.12)], GBk = [hm('#b0a8a0', 0.15), hm('#f4f0e8', 0.12), '#ffffff'];
    [[34, 40], [178, 34], [300, 46], [430, 38]].forEach(function (q) { ghostGum(m, q[0] + rnd() * 10, mf(q[0]) + 2, q[1], rnd, GL, GBk); });
    land(m, mf, [hm('#a84a28', 0.15), hm('#cc6636', 0.15), hm('#f09c62', 0.12)], 7);
    var marbles = function (cx, base, n) {
      for (var q = 0; q < n; q++) { var r = 2.5 + rnd() * 3.5, bx = cx + (q - n / 2) * 5 + rnd() * 3, by = base - r * 0.7 - (q % 2) * 1.5; ball(m, bx, by, r, [hm('#8a2e1e', 0.15), hm('#c8522e', 0.15), hm('#f48a5a', 0.12)]); }
    };
    marbles(110, mf(110) + 2, 4); marbles(256, mf(256) + 2, 3); marbles(470, mf(470) + 2, 5);
    for (i = 0; i < 26; i++) { x = rnd() * SW; spinifex(m, x, mf(x) + 2 + rnd() * 3, 2.5 + rnd() * 2, [hm('#7a7a2a', 0.15), hm('#b0ac40', 0.15), hm('#e8e088', 0.12)]); }
    L.push({ c: md, f: 0.14 });

    // in front: the red dirt, golden tufts, stones, and Sturt's desert peas flowering red
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 123 + wv(xx, 2, 2.2) * 1.5 + wv(xx, 9, 0.7) * 0.6; };
    land(n, nf, ['#a83e1e', '#c85a2c', '#f08a50'], 5);
    for (i = 0; i < 70; i++) { x = rnd() * SW; y = nf(x) + 1; for (j = 0; j < 4; j++) line(n, x, y, x + (j - 1.5) * 1.2, y - 2.5 - rnd() * 1.5, HP, j % 2 ? '#e8c860' : '#c8a040'); }
    for (i = 0; i < 30; i++) { x = rnd() * SW; y = nf(x) + 2 + rnd() * 5; oval(n, x, y, 1 + rnd(), 0.7, '#8a3a24'); R(n, x - 0.5, y - 0.5, 1, HP, '#f8a878'); }
    [70, 190, 330, 470].forEach(function (px) { px += rnd() * 20; var py = nf(px) - 2; for (j = 0; j < 3; j++) { var fx = px + j * 2.4 - 2.4, fy = py - (j % 2) * 1.5; oval(n, fx - 0.6, fy, 1, 0.6, '#e8202a'); oval(n, fx + 0.6, fy, 1, 0.6, '#e8202a'); disc(n, fx, fy + 0.2, 0.5, '#1a1018'); R(n, fx - 0.8, fy - 0.4, HP, HP, '#ff8a8a'); } R(n, px - 4, py + 1, 8, HP, '#6a8a4a'); });
    L.push({ c: nr, f: 0.26 });
    return L;
  };
  /* ---- 42 · On a Rainbow ---- */
  var RBW = ['#ff6a7a', '#ffa64a', '#ffe25a', '#72dc72', '#5ab8ff', '#7a86ff', '#c48aff'];
  // a rainbow: seven bands, outermost red, each with a paler line along its top; tone = haze
  var rainbowArc = function (g, cx, base, r, bw, tone, a) {
    g.globalAlpha = a || 1;
    RBW.forEach(function (c, i) { var ro = r - i * bw; ring(g, cx, base, ro - bw, ro, tone(c), base); ring(g, cx, base, ro - HP, ro, tone(mix(c, '#ffffff', 0.45)), base); });
    g.globalAlpha = 1;
  };
  // a bank of cloud: overlapping puffs along y = f(x), shaded beneath and lit on top. c = [shade, body, light]
  var cloudBank = function (g, x0, x1, f, r, c, rnd) {
    var P = [];
    for (var x = x0; x < x1; x += r * (0.7 + rnd() * 0.5)) P.push([x, f(x) - rnd() * r * 0.5, r * (0.7 + rnd() * 0.6)]);
    P.forEach(function (p) { disc(g, p[0] + p[2] * 0.12, p[1] + p[2] * 0.25, p[2], c[0]); });
    P.forEach(function (p) { disc(g, p[0], p[1], p[2] * 0.9, c[1]); });
    P.forEach(function (p) { disc(g, p[0] - p[2] * 0.25, p[1] - p[2] * 0.32, p[2] * 0.5, c[2]); });
  };
  // a twinkle: a four-pointed sparkle of light
  var twinkle = function (g, x, y, s, col) {
    for (var k = 0; k <= s; k += HP) { var w = Math.max(HP, (1 - k / s) * s * 0.35); R(g, x - w / 2, y - k, w, HP, col); R(g, x - w / 2, y + k, w, HP, col); R(g, x - k, y - w / 2, HP, w, col); R(g, x + k, y - w / 2, HP, w, col); }
    R(g, x - HP / 2, y - HP / 2, HP, HP, '#ffffff');
  };
  /* A castle made of cloud: round towers of piled puffs, domed caps, a
     keep between them, a pink pennant on the tallest. c = [shade, body, light] */
  var cloudCastle = function (g, cx, base, s, c, flag, rnd) {
    var roof = [mix(flag, '#ffffff', 0.55), mix(flag, '#ffffff', 0.3), mix(flag, '#a070c0', 0.3)];
    var tower = function (tx, top, w) {
      // a soft column, lit down its left side, its edges bulging in puffs, a puffy dome on top
      R(g, tx - w * 0.8, top, w * 1.6, base - top, c[1]); R(g, tx + w * 0.3, top, w * 0.5, base - top, c[0]);
      for (var y = top + w * 0.5; y < base; y += w * 0.75) { disc(g, tx - w * 0.8, y, w * 0.26, c[1]); disc(g, tx + w * 0.82, y + 0.3, w * 0.26, c[0]); R(g, tx - w * 0.95, y - w * 0.12, HP, w * 0.2, c[2]); }
      R(g, tx - w * 0.72, top, HP * 2, base - top, c[2]);
      disc(g, tx + w * 0.45, top + 0.4, w * 0.5, c[0]); disc(g, tx - w * 0.45, top, w * 0.55, c[1]); disc(g, tx + 0.2, top - w * 0.35, w * 0.62, c[1]);
      disc(g, tx - w * 0.28, top - w * 0.62, w * 0.28, c[2]); disc(g, tx - w * 0.65, top - w * 0.15, w * 0.2, c[2]);
      // a pointed roof in candy pink, swirled like a cone of ice cream
      var ch = w * 2.1, cb = top - w * 0.55;
      for (var yy = 0; yy < ch; yy += HP) { var hw = w * 0.62 * (1 - yy / ch); R(g, tx - hw, cb - yy, hw * 2, HP, (Math.floor(yy / (w * 0.35)) % 2) ? roof[1] : roof[0]); R(g, tx + hw * 0.3, cb - yy, hw * 0.7, HP, roof[2]); R(g, tx - hw, cb - yy, HP, HP, '#ffffff'); }
      return cb - ch;
    };
    var keep = function (x0, x1, top) { R(g, x0, top, x1 - x0, base - top, c[1]); R(g, x1 - 2 * s, top, 2 * s, base - top, c[0]); for (var x = x0; x < x1; x += 3 * s) { disc(g, x + 1.5 * s, top, 1.5 * s, c[1]); R(g, x + 0.6 * s, top - 1.2 * s, 1, 1, c[2]); } };
    keep(cx - 16 * s, cx + 16 * s, base - 16 * s);
    tower(cx - 18 * s, base - 26 * s, 5 * s); tower(cx + 18 * s, base - 22 * s, 4.6 * s);
    var tip = tower(cx, base - 38 * s, 6 * s);
    tower(cx - 9 * s, base - 30 * s, 3.4 * s); tower(cx + 9 * s, base - 28 * s, 3.2 * s);
    R(g, cx - HP / 2, tip - 7 * s, HP, 7 * s, c[0]);
    span(g, tip - 7 * s, tip - 4 * s, function () { return cx; }, function (yy) { return cx + 5 * s * (1 - Math.abs(yy - (tip - 5.5 * s)) / (1.5 * s)); }, flag);
    // windows like little rainbows
    [[-18, 24], [18, 20], [0, 34], [-6, 10], [6, 10]].forEach(function (q, i) { var wx = cx + q[0] * s, wy = base - q[1] * s; R(g, wx - s, wy, 2 * s, 2.5 * s, mix(RBW[(i * 2) % 7], c[1], 0.45)); disc(g, wx, wy, s, mix(RBW[(i * 2) % 7], c[1], 0.45)); });
    cloudBank(g, cx - 34 * s, cx + 34 * s, function (xx) { return base + 1; }, 5 * s, c, rnd);
  };

  GEN.rainbow = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    // high above the weather: a soft sun, little pastel clouds, and the air full of sparkles
    var far = strip(), g = far.getContext('2d');
    sun(g, 400, 22, 9, ['#fff4f0', '#fff6d8', '#ffffff']);
    for (i = 0; i < 8; i++) cloud(g, i * 64 + rnd() * 30, 10 + rnd() * 30, 0.4 + rnd() * 0.3, [hm(i % 2 ? '#f0c4e8' : '#c8c8ff', 0.2), hm('#fff8fc', 0.1), '#ffffff']);
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = 4 + rnd() * 80; g.globalAlpha = 0.5 + rnd() * 0.5; if (rnd() > 0.8) twinkle(g, x, y, 1.5 + rnd() * 1.5, '#ffffff'); else R(g, x, y, HP, HP, '#ffffff'); }
    g.globalAlpha = 1;
    L.push({ c: far, f: 0.02 });

    // the giant rainbows, arching right across the sky, their feet in banks of cloud
    var rb = strip(), r = rb.getContext('2d');
    var tone1 = function (c) { return hm(c, 0.45); }, tone2 = function (c) { return hm(c, 0.3); };
    rainbowArc(r, 420, 112, 74, 2.8, tone1, 0.85);
    rainbowArc(r, 128, 116, 112, 4, tone2, 1);
    rainbowArc(r, 282, 112, 58, 2.6, tone1, 0.9);
    var CB1 = [hm('#d0b8f0', 0.35), hm('#fff4fc', 0.25), '#ffffff'];
    [16, 228, 336, 494].forEach(function (q) { cloudBank(r, q - 24, q + 24, function (xx) { return 108 + Math.sin(xx * 0.3) * 1.5; }, 7, CB1, rnd); });
    L.push({ c: rb, f: 0.04 });

    // castles of cloud on a far bank of cloud, pink pennants flying
    var cc = strip(), c = cc.getContext('2d');
    var CC = [hm('#c8b4ec', 0.32), hm('#fbf4ff', 0.22), '#ffffff'];
    cloudBank(c, 0, SW, function (xx) { return 104 + wv(xx, 3, 1) * 3 + wv(xx, 7, 0.4) * 1.5; }, 6, CC, rnd);
    cloudCastle(c, 196, 103, 1.15, CC, hm('#ff7ab0', 0.15), rnd);
    cloudCastle(c, 420, 104, 0.6, CC, hm('#ffa04a', 0.15), rnd);
    R(c, 0, 108, SW, H - 108, CC[1]);
    L.push({ c: cc, f: 0.08 });

    /* The sea of cloud we're walking over: soft rolling tops, pink and
       lilac in their shadows, and one more rainbow, close, stepping down
       into it. */
    var sc = strip(), s = sc.getContext('2d');
    rainbowArc(s, 330, 124, 40, 2, function (cl) { return hm(cl, 0.15); }, 1);
    /* (its depths a deeper lilac than the cloud we stand on, so the white
       ground reads against it, and a gap in the ground reads as a drop) */
    var CS = [hm('#c8a4e0', 0.12), hm('#f4e8fa', 0.1), '#ffffff'];
    for (y = 112; y < H; y += HP) { k = (y - 112) / (H - 112); R(s, 0, y, SW, HP, mix('#e4d0f2', '#a898e0', Math.pow(k, 0.8))); }
    cloudBank(s, 0, SW, function (xx) { return 113 + wv(xx, 4, 2) * 3 + wv(xx, 9, 0.7) * 1.5; }, 8, CS, rnd);
    for (i = 0; i < 30; i++) { x = rnd() * SW; y = 124 + rnd() * 18; s.globalAlpha = 0.45; oval(s, x, y, 5 + rnd() * 8, 0.6 + rnd() * 0.6, '#f4ecff'); s.globalAlpha = 1; }

    L.push({ c: sc, f: 0.15 });

    // close by: a few puffs drifting past, and sparkles
    var nr = strip(), n = nr.getContext('2d');
    [[60, 30, 0.7], [230, 18, 0.55], [380, 40, 0.8]].forEach(function (q) { cloud(n, q[0], q[1], q[2], ['#e8c8f0', '#ffffff', '#ffffff']); });
    for (i = 0; i < 14; i++) twinkle(n, rnd() * SW, 10 + rnd() * 90, 1.5 + rnd() * 2, [mix('#ffe25a', '#ffffff', 0.4), '#ffffff', mix('#ff9ad0', '#ffffff', 0.4)][i % 3]);
    L.push({ c: nr, f: 0.3 });
    return L;
  };
  /* ---- 43 · Chocolate Land ---- */
  // a lollipop on its stick: a swirl of two colours, a shine. c = [colour, swirl], tone = haze
  var lolly = function (g, x, base, h, r, c, tone) {
    var ly = base - h;
    R(g, x - 0.6, ly, 1.2, h, tone('#fff8f0')); R(g, x + 0.2, ly, HP, h, tone('#e0d0d0'));
    disc(g, x + 0.6, ly + 0.7, r, tone(mix(c[0], '#5a2040', 0.3)));
    disc(g, x, ly, r, tone(c[0]));
    for (var t = 0; t < 1; t += 0.008) { var a = t * Math.PI * 5, rr = r * (1 - t) * 0.86; disc(g, x + Math.cos(a) * rr, ly + Math.sin(a) * rr, Math.max(0.5, r * 0.17 * (1 - t * 0.6)), tone(c[1])); }
    g.globalAlpha = 0.6; disc(g, x - r * 0.4, ly - r * 0.42, r * 0.24, '#ffffff'); g.globalAlpha = 1;
  };
  // a candy tree: a stick of rock for a trunk, a crown of candy floss, gumdrops in it. c = crown [shade, body, light]
  var candyTree = function (g, x, base, h, c, tone, rnd) {
    for (var y = base - h * 0.55; y < base; y += HP) R(g, x - 1, y, 2, HP, tone(Math.floor((y + x) / 1.5) % 2 ? '#ffffff' : '#ff6a8a'));
    canopy(g, x, base - h * 0.66, h * 0.36, h * 0.3, rnd, [tone(c[0]), tone(c[1]), tone(c[2]), tone('#ffffff')]);
    for (var q = 0; q < 5; q++) { var a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 0.75, gc = ['#ff5a8a', '#ffd84a', '#6ad0ff', '#8ae86a', '#c08aff'][Math.floor(rnd() * 5)]; ball(g, x + Math.cos(a) * h * 0.32 * d, base - h * 0.66 + Math.sin(a) * h * 0.26 * d, 1.3, [tone(mix(gc, '#000000', 0.2)), tone(gc), tone('#ffffff')]); }
  };
  var SPR = ['#ff5a8a', '#ffd84a', '#6ad0ff', '#8ae86a', '#c08aff', '#ffffff'];

  GEN.chocolate = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A strawberry-and-cream sky: a soft sun, clouds like whipped cream,
       and sprinkles tumbling through the air. */
    var far = strip(), g = far.getContext('2d');
    sun(g, 300, 24, 10, ['#fff0e0', '#fff4d8', '#ffffff']);
    var WC = [hm('#f0c0b8', 0.15), hm('#fffaf2', 0.1), '#ffffff'];
    [[40, 26, 0.8], [150, 14, 0.6], [214, 40, 0.7], [400, 20, 0.9], [480, 46, 0.55]].forEach(function (q) { cloud(g, q[0], q[1], q[2], WC); });
    for (i = 0; i < 50; i++) { x = rnd() * SW; y = 4 + rnd() * 76; var sc = SPR[i % SPR.length]; g.globalAlpha = 0.65; if (rnd() > 0.5) R(g, x, y, 1.5, HP, sc); else R(g, x, y, HP, 1.5, sc); }
    g.globalAlpha = 1;
    L.push({ c: far, f: 0.02 });

    // chocolate mountains, dark and milk, with cream lying thick on their tops
    var mt = strip(), m = mt.getContext('2d');
    [[40, 110, 40], [130, 140, 58], [236, 100, 36], [330, 150, 52], [440, 120, 44]].forEach(function (q) { mountain(m, q[0] + rnd() * 10, 100, q[1], q[2], [hm('#4a1a0c', 0.24), hm('#7e3c20', 0.24)], [hm('#f2dccc', 0.18), hm('#fffaf2', 0.1)]); });
    mist(m, 80, 24, hz);
    L.push({ c: mt, f: 0.045 });

    /* Rolling hills of milk chocolate with lollipop trees on them, streams
       of chocolate winding down between them, and along their foot the
       chocolate river, glossy and swirled with cream. */
    var hl = strip(), h = hl.getContext('2d');
    var hump = function (cx, base, rx, ry, col, a) {
      var c = [hm(mix(col, '#2a0a04', 0.3), a), hm(col, a), hm(mix(col, '#ffe8d0', 0.4), a * 0.8)];
      oval(h, cx + rx * 0.05, base, rx, ry, c[0], true); oval(h, cx - rx * 0.05, base, rx * 0.92, ry * 0.98, c[1], true);
      for (var xx = cx - rx * 0.85; xx < cx + rx * 0.3; xx += HP) { var u = (xx - cx + rx * 0.05) / (rx * 0.92); R(h, xx, base - ry * 0.98 * Math.sqrt(Math.max(0, 1 - u * u)), HP, HP, c[2]); }
    };
    // milk, dark, strawberry and white chocolate, some with a drizzle of another zigzagged over them
    var HC = [['#8e4e2c', '#fff0e0'], ['#f0a0b8', '#7a3818'], ['#b0683e', '#5a2410'], ['#f4e2cc', '#8e4e2c'], ['#6a3018', '#ffc8d8']];
    for (i = 0; i < 8; i++) {
      var hx = i * 66 + rnd() * 20, hrx = 36 + rnd() * 16, hry = 18 + rnd() * 10, hc = HC[i % HC.length];
      hump(hx, 104, hrx, hry, hc[0], 0.24);
      if (i % 2 === 0) for (var dx = -hrx * 0.6; dx < hrx * 0.5; dx += HP) {
        var uu = (dx + hrx * 0.05) / (hrx * 0.92), ty = 104 - hry * 0.98 * Math.sqrt(Math.max(0, 1 - uu * uu));
        R(h, hx + dx, ty + 3 + Math.abs(((dx * 0.45) % 2 + 2) % 2 - 1) * 3.5, HP, 0.8, hm(hc[1], 0.24));
      }
    }
    mist(h, 90, 14, hz);
    // streams of chocolate winding down out of the hills, widening as they come, to join the river
    [[118, 0.4], [300, 2.1], [446, 4]].forEach(function (q) {
      for (y = 88; y < 104; y += HP) {
        var k2 = (y - 88) / 16, sc = q[0] + Math.sin(k2 * 5 + q[1]) * (4 + k2 * 6), sw = 0.6 + k2 * k2 * 7;
        R(h, sc - sw - HP, y, sw * 2 + HP * 2, HP, hm('#4a1c0c', 0.2)); R(h, sc - sw, y, sw * 2, HP, hm('#7a3818', 0.2));
        R(h, sc - sw, y, Math.max(HP, sw * 0.4), HP, hm('#b8784a', 0.18));
        if (Math.sin(y * 2.3 + q[1]) > 0.6) R(h, sc - sw * 0.2, y, Math.max(HP, sw * 0.5), HP, hm('#fff0e0', 0.18));
      }
    });
    var LT = [['#ff8ac0', '#ffffff'], ['#8ae0c0', '#ffffff'], ['#c8a0ff', '#fff2a0'], ['#ffb070', '#fff4e0']];
    for (i = 0; i < 9; i++) { x = i * 57 + rnd() * 20; lolly(h, x, 103 - rnd() * 6, 9 + rnd() * 5, 2.5 + rnd(), LT[i % 4], function (cl) { return hm(cl, 0.28); }); }
    // the river: glossy, with swirls of cream and the sky's light on it
    var rt = function (xx) { return 102 + wv(xx, 3, 0.6) * 1.2 + wv(xx, 8, 1.4) * 0.5; };
    for (x = 0; x < SW; x += HP) {
      y = rt(x);
      R(h, x, y, HP, H - y, hm('#6a2e14', 0.2)); R(h, x, y + 3, HP, 2, hm('#5a2410', 0.2)); R(h, x, y, HP, HP, hm('#e8b890', 0.2));
      if (Math.sin(x * 0.21) + Math.sin(x * 0.07 + 1) > 1.1) R(h, x, y + 1, HP, HP, hm('#fff0e0', 0.2));
    }
    for (i = 0; i < 60; i++) { x = rnd() * SW; y = rt(x) + 1.5 + rnd() * 8; var sw = 2 + rnd() * 5; R(h, x, y, sw, HP, rnd() > 0.4 ? hm('#9a5432', 0.2) : hm('#fff0e0', 0.2)); if (rnd() > 0.6) R(h, x + sw, y - HP, 1.5, HP, hm('#9a5432', 0.2)); }
    [[96, 0], [330, 0]].forEach(function (q) { for (var e = 0; e < 3; e++) { oval(h, q[0], rt(q[0]) + 1.5 + e * 1.4, 5 + e * 3, 0.6, hm('#b8744a', 0.2)); } });
    L.push({ c: hl, f: 0.09 });

    /* Nearer: hills of darker chocolate, a glossy shine along each crest,
       sprinkles scattered over them, candy-floss trees and candy canes. */
    var nh = strip(), d = nh.getContext('2d');
    var df = function (xx) { return 114 + wv(xx, 3, 0.6) * 4.5 + wv(xx, 7, 1.2) * 2; };
    var tone = function (cl) { return hm(cl, 0.16); };
    [[40, ['#e86aa8', '#ff9ccc', '#ffd0e8']], [168, ['#a07ae8', '#c8a8ff', '#ece0ff']], [300, ['#e88a6a', '#ffb898', '#ffe0cc']], [420, ['#6ac8a8', '#9ce8c8', '#d8fff0']]].forEach(function (q) { candyTree(d, q[0] + rnd() * 20, df(q[0]) + 3, 26 + rnd() * 8, q[1], tone, rnd); });
    land(d, df, [hm('#4a1c0c', 0.16), hm('#6a3018', 0.16), hm('#a8643a', 0.14)], 9);
    for (x = 0; x < SW; x += HP) { var sl = df(x + 1) - df(x - 1); if (sl < -0.1) R(d, x, df(x) + 1.5, HP, HP, hm('#e8b088', 0.14)); }
    for (i = 0; i < 120; i++) { x = rnd() * SW; y = df(x) + 2 + rnd() * 14; var spc = SPR[i % SPR.length]; if (rnd() > 0.5) R(d, x, y, 1.5, HP, spc); else R(d, x, y, HP, 1.5, spc); }
    [[100, 20], [240, 16], [360, 22], [486, 18]].forEach(function (q) {
      var cx = q[0] + rnd() * 10, gy = df(cx) + 2, top = gy - q[1] + 4.5;
      for (y = top; y < gy; y += HP) for (var dx = -1.5; dx < 1.5; dx += HP) R(d, cx + dx, y, HP, HP, tone(Math.floor((y + dx * 1.3) / 2.2) % 2 ? '#fff8f8' : '#ff4a6a'));
      for (var a = 0; a <= Math.PI * 1.08; a += 0.05) disc(d, cx - 4.5 + Math.cos(a) * 4.5, top - Math.sin(a) * 4.5, 1.5, tone(Math.floor(a * 4.5 / 2.2) % 2 ? '#fff8f8' : '#ff4a6a'));
    });
    L.push({ c: nh, f: 0.16 });

    // in front: the ground of chocolate, big swirly lollipops, a scatter of sweets
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 123 + wv(xx, 2, 1.7) * 1.5 + wv(xx, 6, 0.2) * 0.8; };
    [[70, 34, 7], [250, 28, 6], [410, 38, 8]].forEach(function (q, qi) { lolly(n, q[0] + rnd() * 16, nf(q[0]) + 2, q[1], q[2], LT[(qi + 1) % 4], function (cl) { return cl; }); });
    land(n, nf, ['#3a1408', '#5a2410', '#9a5430'], 6);
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = nf(x) + 2 + rnd() * 6; ball(n, x, y, 1 + rnd() * 0.6, ['#2a0c04', SPR[i % 5], '#ffffff']); }
    L.push({ c: nr, f: 0.28 });
    return L;
  };
  /* ---- 44 · Dinosaur Land ---- */
  /* A volcano: a broad cone with a broken crater at its top, lava glowing
     in it and running down in streams, its flanks lit on the left.
     c = [shade, body, light], lava = [deep, bright, hot] */
  var volcano = function (g, cx, base, w, h, c, lava, rnd) {
    var cw = w * 0.14, top = base - h;
    for (var y = top; y < base; y += HP) {
      var k = (y - top) / h, hw = cw + (w / 2 - cw) * Math.pow(k, 1.35), wob = Math.sin(y * 0.7 + cx) * 0.5 * k;
      R(g, cx - hw + wob, y, hw * 2, HP, c[1]); R(g, cx + hw * 0.25 + wob, y, hw * 0.75, HP, c[0]); R(g, cx - hw + wob, y, HP, HP, c[2]);
      if (k > 0.1 && Math.sin(y * 0.9 + cx) > 0.6) R(g, cx - hw * 0.55, y, HP, HP, mix(c[1], c[0], 0.5));
    }
    // the crater's lip and the glow inside it
    oval(g, cx, top + 0.5, cw + 0.5, 1.5, c[0]); oval(g, cx, top + 0.6, cw - 0.6, 0.9, lava[1]);
    glow(g, cx, top, w * 0.22, lava[2], 0.8);
    // the lava running down: rivulets that wander, brightest where they start
    for (var q = 0; q < 3; q++) {
      var lx = cx + (q - 1) * cw * 0.7, ly = top + 1;
      for (var t = 0; t < h * (0.35 + q * 0.12); t += HP) { lx += Math.sin(t * 0.5 + q * 2) * 0.3 + (q - 1) * 0.18; R(g, lx, ly + t, 1, HP, t < h * 0.12 ? lava[2] : lava[1]); if (t > h * 0.2) R(g, lx + 0.5, ly + t, HP, HP, lava[0]); }
    }
  };
  /* A plume of smoke from a volcano: puffs rising and drifting off with the
     wind, growing as they go, lit on the left. c = [shade, body, light] */
  var plume = function (g, x, y, n, c, rnd) {
    var P = [];
    for (var i = 0; i < n; i++) { var t = i / n; P.push([x + t * t * 46 + Math.sin(i * 1.3) * 2, y - t * 34 - Math.sin(t * 3) * 3, 2 + t * 7 + rnd() * 2]); }
    P.forEach(function (p) { disc(g, p[0] + p[2] * 0.2, p[1] + p[2] * 0.2, p[2], c[0]); });
    P.forEach(function (p) { disc(g, p[0], p[1], p[2] * 0.85, c[1]); });
    P.forEach(function (p) { disc(g, p[0] - p[2] * 0.3, p[1] - p[2] * 0.3, p[2] * 0.4, c[2]); });
  };
  /* A long-necked dinosaur, gentle as a cow: a great round body on pillar
     legs, the neck curving up to a small head, the tail sweeping down
     behind. Faces left. s = size; c = [shade, body, light, belly] */
  var sauropod = function (g, x, base, s, c, headUp) {
    var by = base - 7 * s;
    R(g, x + 3 * s, by + 2 * s, 2.2 * s, 5 * s, c[0]); R(g, x - 5 * s, by + 2 * s, 2.2 * s, 5 * s, c[0]);
    // tail, thinning to a point
    for (var t = 0; t < 1; t += 0.02) disc(g, x + 6 * s + t * 14 * s, by + 1 * s + t * t * 5 * s, Math.max(HP, (1 - t) * 2.4 * s), c[1]);
    oval(g, x + 0.4 * s, by + 0.5 * s, 8 * s, 4.8 * s, c[0]); oval(g, x, by, 7.6 * s, 4.4 * s, c[1]);
    oval(g, x - 2 * s, by - 2 * s, 3.6 * s, 1.4 * s, c[2]); oval(g, x + 0.5 * s, by + 3 * s, 5 * s, 1 * s, c[3]);
    // the neck: a curve up and forward
    var nx = function (t) { return x - 5 * s - t * (headUp ? 6 : 9) * s; }, ny = function (t) { return by - 1 * s - Math.sin(t * Math.PI * 0.5) * (headUp ? 15 : 10) * s; };
    for (t = 0; t <= 1; t += 0.02) disc(g, nx(t), ny(t), Math.max(HP, (2.4 - t * 1.2) * s), c[1]);
    for (t = 0.1; t <= 1; t += 0.04) R(g, nx(t) - (1.6 - t) * s, ny(t) - HP, HP, HP, c[2]);
    oval(g, nx(1) - 1.4 * s, ny(1), 2.4 * s, 1.5 * s, c[1]); R(g, nx(1) - 2.4 * s, ny(1) - 0.8 * s, HP, HP, c[0]);
    R(g, x - 6 * s, by + 2 * s, 2.2 * s, 5 * s, c[1]); R(g, x + 2 * s, by + 2 * s, 2.2 * s, 5 * s, c[1]); R(g, x - 6 * s, by + 2 * s, HP, 5 * s, c[2]);
  };
  // a pterodactyl gliding far off: long pointed wings, a crested head
  var ptero = function (g, x, y, s, col) {
    line(g, x, y, x - 6 * s, y - 2.5 * s, Math.max(HP, 0.8 * s), col); line(g, x - 6 * s, y - 2.5 * s, x - 10 * s, y + 0.5 * s, Math.max(HP, 0.5 * s), col);
    line(g, x, y, x + 6 * s, y - 2.5 * s, Math.max(HP, 0.8 * s), col); line(g, x + 6 * s, y - 2.5 * s, x + 10 * s, y + 0.5 * s, Math.max(HP, 0.5 * s), col);
    oval(g, x, y + 0.3 * s, 1.6 * s, 0.8 * s, col); line(g, x - 1 * s, y, x - 3.4 * s, y + 0.3 * s, Math.max(HP, 0.5 * s), col); line(g, x - 1.6 * s, y - 0.2 * s, x - 0.2 * s, y - 1.6 * s, HP, col);
  };
  /* A tree fern: a slender rough trunk, and a crown of long fronds arching
     out from its top. c = fronds [shade, body, light, rib], b = trunk */
  var treeFern = function (g, x, base, h, c, b) {
    for (var y = base - h; y < base; y += HP) { var w = 1.4 + (y - base + h) / h * 0.6; R(g, x - w / 2 + Math.sin(y * 0.1) * 0.5, y, w, HP, Math.round(y) % 3 ? b[0] : b[1]); }
    var top = base - h;
    [-2.7, -2.2, -1.6, -1.1, -0.5, -2.95, -0.2].forEach(function (a, i) { leaf(g, x, top, a, h * (0.42 + (i % 3) * 0.05), Math.max(1.2, h * 0.07), c); });
  };
  // a fern frond, feathery: a curving stem with little leaflets each side, shorter towards its tip
  var frond = function (g, x, y, a, len, c) {
    var px = x, py = y, n = Math.ceil(len / HP);
    for (var i = 0; i < n; i++) {
      var t = i / n, aa = a + t * 0.9 * (Math.cos(a) > 0 ? 1 : -1);
      px += Math.cos(aa) * HP; py += Math.sin(aa) * HP;
      R(g, px, py, HP, HP, c[3]);
      if (i % 4 === 0) {
        var ll = (1 - t) * len * 0.22 + 0.6;
        line(g, px, py, px + Math.cos(aa - 1.1) * ll, py + Math.sin(aa - 1.1) * ll, HP * (t < 0.7 ? 2 : 1), c[2]);
        line(g, px, py, px + Math.cos(aa + 1.1) * ll, py + Math.sin(aa + 1.1) * ll, HP * (t < 0.7 ? 2 : 1), c[1]);
      }
    }
  };

  GEN.dinosaurs = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* A warm, steamy sky: a big soft sun, puffs of cloud, and pterodactyls
       gliding far away. */
    var far = strip(), g = far.getContext('2d');
    sun(g, 250, 30, 12, ['#fff4c8', '#fff0b0', '#fffbe6']);
    for (i = 0; i < 6; i++) cloud(g, i * 86 + rnd() * 30, 12 + rnd() * 30, 0.6 + rnd() * 0.4, [hm('#c8dcc0', 0.2), hm('#fffcf0', 0.1), '#ffffff']);
    [[176, 36, 0.6], [196, 30, 0.45], [370, 46, 0.5]].forEach(function (q) { ptero(g, q[0], q[1], q[2], hm('#5a4a5a', 0.4)); });
    L.push({ c: far, f: 0.025 });

    // the volcanoes, smoking, lava glowing in their craters and trickling down
    var vc = strip(), v = vc.getContext('2d');
    var VC = [hm('#6a4a5a', 0.45), hm('#8a6a74', 0.45), hm('#c8a8a8', 0.4)], LV = ['#e8502a', '#ff8a3a', '#ffd870'];
    var SM = [hm('#a898a8', 0.3), hm('#d8ccd4', 0.25), hm('#ffffff', 0.2)];
    plume(v, 120, 48, 12, SM, rnd); plume(v, 352, 66, 9, SM, rnd);
    volcano(v, 120, 100, 120, 52, VC, LV, rnd);
    volcano(v, 352, 100, 90, 34, [hm('#6a4a5a', 0.55), hm('#8a6a74', 0.55), hm('#c8a8a8', 0.5)], LV, rnd);
    for (i = 0; i < 4; i++) mountain(v, 220 + i * 70 + rnd() * 20, 100, 60 + rnd() * 20, 14 + rnd() * 8, [hm('#5a7a6a', 0.6), hm('#7a9a84', 0.6)], null);
    mist(v, 78, 24, hz);
    L.push({ c: vc, f: 0.045 });

    /* The lake in the jungle: still water holding the sky, the forest of
       tree ferns and cycads round it hazy and blue, and the long-necks
       wading and grazing, gentle as cows. */
    var lk = strip(), l = lk.getContext('2d');
    var LB = 102;
    var JF = [hm('#3a7a5a', 0.45), hm('#4e9a64', 0.45), hm('#8ccc88', 0.4), hm('#2a6a4a', 0.45)];
    land(l, function (xx) { return 92 + wv(xx, 3, 1) * 3 + wv(xx, 8, 0.2) * 1.5; }, [JF[0], JF[1], JF[2]], 6);
    for (i = 0; i < 40; i++) { x = rnd() * SW; canopy(l, x, 92 + rnd() * 4, 4 + rnd() * 4, 2.5 + rnd() * 1.5, rnd, [JF[0], JF[1], JF[2]]); }
    for (i = 0; i < 10; i++) { x = rnd() * SW; treeFern(l, x, 98, 14 + rnd() * 8, JF, [hm('#5a4a3a', 0.45), hm('#7a6a50', 0.45)]); }
    for (y = LB - 4; y < H; y += HP) { k = (y - LB + 4) / 20; R(l, 0, y, SW, HP, mix(hm('#a8dcd0', 0.3), hm('#5aa8a8', 0.3), Math.min(1, k))); }
    R(l, 0, LB - 4, SW, HP, hm('#ffffff', 0.3));
    for (i = 0; i < 60; i++) { x = rnd() * SW; y = LB - 3 + rnd() * 14; R(l, x, y, 1 + rnd() * 5, HP, rnd() > 0.5 ? hm('#e0fff4', 0.3) : hm('#4a9a98', 0.3)); }
    var SC = [hm('#3e6466', 0.3), hm('#5e8a80', 0.3), hm('#a8d0b8', 0.26), hm('#8ab098', 0.3)];
    [[150, 1.1, 1], [196, 0.8, 0], [380, 1, 1]].forEach(function (q) {
      l.globalAlpha = 0.3; oval(l, q[0], LB + 1, 10 * q[1], 1.2, SC[0]); l.globalAlpha = 1;
      sauropod(l, q[0], LB + 2, q[1], SC, q[2]);
      R(l, q[0] - 9 * q[1], LB, 18 * q[1], 2.5, mix(hm('#a8dcd0', 0.3), hm('#5aa8a8', 0.3), 0.4)); R(l, q[0] - 9 * q[1], LB, 18 * q[1], HP, hm('#ffffff', 0.3));
    });
    L.push({ c: lk, f: 0.09 });

    /* The jungle nearer: tree ferns and palms, and a big long-neck among
       them reaching up to graze, its baby beside it. */
    var jn = strip(), j2 = jn.getContext('2d');
    var JB = 112, jf = function (xx) { return JB + wv(xx, 3, 0.4) * 2 + wv(xx, 7, 1.5) * 0.8; };
    var JN = [hm('#2a6a3e', 0.22), hm('#3e8a48', 0.22), hm('#7cc068', 0.2), hm('#1e5a34', 0.22)], JT = [hm('#5a4030', 0.25), hm('#7a5a40', 0.25)];
    sauropod(j2, 300, jf(300) + 2, 1.9, [hm('#5a7a5a', 0.2), hm('#7a9a6a', 0.2), hm('#b8d8a0', 0.18), hm('#c8d8a8', 0.2)], 1);
    sauropod(j2, 334, jf(334) + 2, 0.8, [hm('#5a7a5a', 0.2), hm('#7a9a6a', 0.2), hm('#b8d8a0', 0.18), hm('#c8d8a8', 0.2)], 0);
    [[20, 34], [86, 28], [168, 40], [236, 30], [420, 36], [480, 26]].forEach(function (q) { treeFern(j2, q[0] + rnd() * 10, jf(q[0]) + 2, q[1], JN, JT); });
    [[128, 38, -0.2], [380, 42, 0.18]].forEach(function (q) { palm(j2, q[0], jf(q[0]) + 2, q[1], q[2], [JN[0], JN[1], JN[2], JT[0], JT[1]]); });
    land(j2, jf, [JN[3], JN[1], JN[2]], 6);
    for (i = 0; i < 24; i++) { x = rnd() * SW; canopy(j2, x, jf(x) + 1, 4 + rnd() * 3, 2.2, rnd, [JN[0], JN[1], JN[2]]); }
    L.push({ c: jn, f: 0.15 });

    // in front: giant ferns unfurling, cycads, and a scatter of flowers
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 123 + wv(xx, 2, 1.1) * 1.5 + wv(xx, 6, 0.3) * 0.8; };
    var NF = ['#14502e', '#2a7a3e', '#58b050', '#1e6436'];
    [[40, 1], [150, -1], [262, 1], [350, -1], [460, 1]].forEach(function (q) {
      var fx = q[0] + rnd() * 16, fy = nf(fx) + 2;
      for (j = 0; j < 7; j++) { var a = -Math.PI / 2 + (j - 3) * 0.42 + (rnd() - 0.5) * 0.2; frond(n, fx, fy, a, 20 + rnd() * 12 - Math.abs(j - 3) * 3, NF); }
    });
    land(n, nf, ['#2a5a24', '#3e8a34', '#86cc5a'], 5);
    for (i = 0; i < 50; i++) { x = rnd() * SW; y = nf(x) + 1.5 + rnd() * 5; var fc = ['#ff8a6a', '#ffd040', '#ff6aa0', '#ffffff'][i % 4]; R(n, x, y, 1, 1, fc); }
    L.push({ c: nr, f: 0.27 });
    return L;
  };
  /* ---- 45 · Bee Land ---- */
  /* A sunflower towering over us: a tall stem with its leaves, the head a
     wheel of golden petals round a brown heart of seeds in spirals.
     tone = haze */
  var sunflowerBig = function (g, x, base, h, r, tone, lean) {
    var top = base - h, hx = x + lean * h;
    for (var y = top; y < base; y += HP) { var k = (y - top) / h, sx = x + lean * h * (1 - k) * (1 - k * 0.3); R(g, sx - 1, y, 2, HP, tone('#4a9a3a')); R(g, sx + 0.4, y, 0.6, HP, tone('#2e7a2e')); R(g, sx - 1, y, HP, HP, tone('#8ad060')); }
    [0.45, 0.7].forEach(function (k, i) { var ly = top + h * k, lx = x + lean * h * (1 - k) * (1 - k * 0.3); leaf(g, lx, ly, i ? -0.3 : Math.PI + 0.3, r * 1.3, r * 0.32, [tone('#2a7a2e'), tone('#4aa040'), tone('#8ad868'), tone('#2a6a28')]); });
    for (var p = 0; p < 22; p++) { var a = p / 22 * Math.PI * 2, px = hx + Math.cos(a) * r * 0.82, py = top + Math.sin(a) * r * 0.82; disc(g, px + 0.4, py + 0.5, r * 0.3, tone('#d88a10')); }
    for (p = 0; p < 22; p++) { a = (p + 0.5) / 22 * Math.PI * 2; px = hx + Math.cos(a) * r * 0.8; py = top + Math.sin(a) * r * 0.8; disc(g, px, py, r * 0.27, tone(Math.sin(a + 2.2) > 0.3 ? '#ffe060' : '#ffc420')); }
    disc(g, hx + 0.4, top + 0.5, r * 0.56, tone('#4a2a10')); disc(g, hx, top, r * 0.52, tone('#7a4a1c'));
    for (var s = 0; s < 70; s++) { var sa = s * 2.4, sr = Math.sqrt(s / 70) * r * 0.48; R(g, hx + Math.cos(sa) * sr, top + Math.sin(sa) * sr, HP, HP, tone(s % 3 ? '#a86a2a' : '#3a1a08')); }
    disc(g, hx - r * 0.2, top - r * 0.2, r * 0.14, tone('#b8783a'));
  };
  // a daisy on its stem: white petals, a golden middle
  var daisyBig = function (g, x, base, h, r, tone) {
    var top = base - h;
    for (var y = top; y < base; y += HP) { R(g, x - 0.6, y, 1.2, HP, tone('#5aaa44')); R(g, x + 0.2, y, HP, HP, tone('#3a8a34')); }
    leaf(g, x, top + h * 0.6, -0.4, r * 1.2, r * 0.25, [tone('#3a8a34'), tone('#5aaa44'), tone('#9ae070'), tone('#3a8a34')]);
    for (var p = 0; p < 16; p++) { var a = p / 16 * Math.PI * 2; for (var t = r * 0.3; t < r; t += HP) R(g, x + Math.cos(a) * t - 0.5, top + Math.sin(a) * t * 0.8 - 0.5, 1.2, 1.2, tone(Math.sin(a) > 0.2 ? '#e8e4f0' : '#ffffff')); }
    disc(g, x + 0.3, top + 0.3, r * 0.34, tone('#d89a10')); disc(g, x, top, r * 0.3, tone('#ffd030')); disc(g, x - r * 0.1, top - r * 0.1, r * 0.12, tone('#fff0a0'));
  };
  /* A bees' nest hanging from a bough: a fat teardrop of papery comb in
     golden bands, the doorway dark, bees coming and going. c = [shade, body, light, band] */
  var hive = function (g, x, top, s, c) {
    for (var y = 0; y < 22 * s; y += HP) {
      var k = y / (22 * s), hw = s * 9 * Math.sin(Math.min(1, k * 1.15) * Math.PI * 0.95) * (k < 0.1 ? k * 6 + 0.4 : 1);
      if (hw < HP) continue;
      var band = Math.floor(k * 7) % 2;
      R(g, x - hw, top + y, hw * 2, HP, band ? c[3] : c[1]); R(g, x + hw * 0.35, top + y, hw * 0.65, HP, band ? mix(c[3], c[0], 0.5) : c[0]);
      R(g, x - hw, top + y, HP, HP, c[2]); if (!band) R(g, x - hw * 0.8, top + y, hw * 0.3, HP, c[2]);
    }
    oval(g, x - s, top + 15 * s, 2.2 * s, 1.8 * s, '#3a2008'); oval(g, x - s, top + 15.4 * s, 1.6 * s, 1.1 * s, '#1c0c04');
  };
  // a bee, tiny: a striped body and a pale wing
  var bee = function (g, x, y, s) {
    oval(g, x, y, 1.4 * s, 1 * s, '#ffcc20'); R(g, x - 0.3 * s, y - s, Math.max(HP, 0.5 * s), 2 * s, '#2a1a10'); R(g, x + 0.7 * s, y - 0.7 * s, Math.max(HP, 0.4 * s), 1.4 * s, '#2a1a10');
    g.globalAlpha = 0.75; oval(g, x + 0.2 * s, y - 1.3 * s, 0.9 * s, 0.7 * s, '#ffffff'); g.globalAlpha = 1;
  };

  GEN.beeland = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    /* Golden afternoon light: a big warm sun with a wide halo, soft clouds,
       and pollen floating everywhere. */
    var far = strip(), g = far.getContext('2d');
    [[5, 0.05], [3.6, 0.07], [2.6, 0.1], [1.8, 0.16]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, 330, 30, 11 * q[0], '#fff4b0'); });
    g.globalAlpha = 1;
    sun(g, 330, 30, 11, ['#fff0a0', '#ffe680', '#fffbe0']);
    for (i = 0; i < 6; i++) cloud(g, i * 86 + rnd() * 30, 10 + rnd() * 34, 0.55 + rnd() * 0.4, [hm('#f0d8a0', 0.2), hm('#fffaf0', 0.1), '#ffffff']);
    for (i = 0; i < 50; i++) { x = rnd() * SW; y = 4 + rnd() * 90; g.globalAlpha = 0.4 + rnd() * 0.5; R(g, x, y, rnd() > 0.7 ? 1 : HP, rnd() > 0.7 ? 1 : HP, rnd() > 0.5 ? '#fff4a0' : '#ffffff'); }
    g.globalAlpha = 1;
    L.push({ c: far, f: 0.02 });

    // the meadow rolling away: soft hills freckled with flowers, giant blooms hazy in the distance
    var fm = strip(), f = fm.getContext('2d');
    var ff = function (xx) { return 96 + wv(xx, 2, 0.4) * 5 + wv(xx, 5, 2.1) * 2.5; };
    var tone1 = function (c) { return hm(c, 0.55); };
    [[60, 40, 6, 0.04], [220, 50, 7, -0.03], [300, 34, 5, 0.05], [452, 46, 6, 0]].forEach(function (q) { sunflowerBig(f, q[0], ff(q[0]) + 2, q[1], q[2], tone1, q[3]); });
    [[110, 28, 4], [380, 32, 4.5], [500, 24, 3.5]].forEach(function (q) { daisyBig(f, q[0], ff(q[0]) + 2, q[1], q[2], tone1); });
    land(f, ff, [hm('#7ab048', 0.5), hm('#9ccc58', 0.5), hm('#d0f090', 0.45)], 6);
    for (i = 0; i < 160; i++) { x = rnd() * SW; y = ff(x) + 1 + rnd() * 12; R(f, x, y, 1, HP, hm(['#ff8ab0', '#ffe060', '#ffffff', '#c890ff', '#ff9a50'][i % 5], 0.45)); }
    mist(f, 84, 20, hz);
    L.push({ c: fm, f: 0.05 });

    /* The old tree with the bees' nest hanging from its bough, bees busy
       round it; more giant flowers standing in the light. */
    var tr = strip(), t = tr.getContext('2d');
    var TB = 108, tf = function (xx) { return TB + wv(xx, 3, 1.2) * 2; };
    var tone2 = function (c) { return hm(c, 0.3); };
    [[204, 70, 12, 0.04], [292, 56, 9, -0.04], [362, 76, 13, 0.03], [470, 62, 10, -0.02]].forEach(function (q) { sunflowerBig(t, q[0], tf(q[0]) + 2, q[1], q[2], tone2, q[3]); });
    [[236, 42, 5.5], [322, 36, 5], [414, 46, 6]].forEach(function (q) { daisyBig(t, q[0], tf(q[0]) + 2, q[1], q[2], tone2); });
    // the tree: a thick trunk, a bough reaching out, the crown above
    var TX = 104, BK = [hm('#5a3a24', 0.25), hm('#7a5434', 0.25), hm('#a8805a', 0.22)];
    for (y = 30; y < TB + 2; y += HP) { var tw = 6 + Math.pow((y - 30) / 78, 3) * 6; R(t, TX - tw / 2, y, tw, HP, BK[1]); R(t, TX + tw * 0.15, y, tw * 0.35, HP, BK[0]); R(t, TX - tw / 2, y, 1, HP, BK[2]); if (Math.round(y * 2) % 7 === 0) R(t, TX - tw * 0.2, y, tw * 0.3, HP, BK[0]); }
    for (x = TX - 4; x < TX + 54; x += HP) { var by = 46 + (x - TX) * 0.18 + Math.pow((x - TX) / 60, 2) * 6, bw = 4 - (x - TX) * 0.05; R(t, x, by - bw / 2, HP, bw, BK[1]); R(t, x, by - bw / 2, HP, HP, BK[2]); R(t, x, by + bw * 0.2, HP, bw * 0.3, BK[0]); }
    for (x = TX - 30; x > TX - 50; x -= HP) { y = 56 - (TX - 30 - x) * 0.5; R(t, x, y, HP, 2.5, BK[1]); R(t, x, y, HP, HP, BK[2]); }
    R(t, TX - 34, 56, 32, 3, BK[1]); R(t, TX - 34, 56, 32, HP, BK[2]);
    var TC = [hm('#3a8a3a', 0.25), hm('#58a848', 0.25), hm('#a0d870', 0.2), hm('#e0ffa0', 0.2)];
    canopy(t, TX + 6, 26, 44, 20, rnd, TC); canopy(t, TX - 34, 40, 18, 12, rnd, TC); canopy(t, TX + 52, 38, 16, 10, rnd, TC);
    // the nest hanging from the bough, and its bees
    var HX = TX + 38, HY = 46 + 38 * 0.18 + Math.pow(38 / 60, 2) * 6 + 1;
    R(t, HX - 1, HY - 1, 2, 2.5, BK[0]);
    hive(t, HX, HY, 1.15, [hm('#c88a20', 0.2), hm('#f4c040', 0.2), hm('#fff0a0', 0.15), hm('#e0a028', 0.2)]);
    for (i = 0; i < 14; i++) { var a = rnd() * Math.PI * 2, d = 12 + rnd() * 18; bee(t, HX + Math.cos(a) * d, HY + 14 + Math.sin(a) * d * 0.6, 0.9); }
    // dotted flight paths, the way bees go
    for (k = 0; k < 40; k++) { var u = k / 40; R(t, HX - 14 - u * 70, HY + 18 + Math.sin(u * 9) * 5 - u * 10, HP, HP, hm('#ffffff', 0.15)); }
    land(t, tf, [hm('#5a9a3a', 0.25), hm('#7ac048', 0.25), hm('#b8e878', 0.2)], 6);
    for (i = 0; i < 90; i++) { x = rnd() * SW; y = tf(x) + 1 + rnd() * 8; R(t, x, y, 1, 1, hm(['#ff8ab0', '#ffe060', '#ffffff', '#c890ff'][i % 4], 0.2)); }
    L.push({ c: tr, f: 0.1 });

    /* Bee-sized, close by: blades of grass taller than houses, a clover
       leaf the size of an umbrella, a dandelion clock, pollen drifting. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 122 + wv(xx, 2, 0.9) * 1.5 + wv(xx, 7, 2) * 0.7; };
    var blade = function (bx, h, bend, w, c) {
      var base = nf(bx) + 3;
      for (var yy = 0; yy < h; yy += HP) { var kk = yy / h, cx2 = bx + bend * kk * kk * h, ww = w * (1 - kk * 0.85); R(n, cx2 - ww / 2, base - yy, ww, HP, c[1]); R(n, cx2 + ww * 0.1, base - yy, ww * 0.4, HP, c[0]); R(n, cx2 - ww / 2, base - yy, HP, HP, c[2]); }
    };
    var BL = [['#2a7a2e', '#4aa83e', '#9ae070'], ['#3a8a30', '#5cb848', '#b0ec80']];
    [[18, 1], [150, -1], [310, 1], [440, -1]].forEach(function (q) {
      for (j = 0; j < 6; j++) blade(q[0] + j * 3 + rnd() * 2, 26 + rnd() * 30, q[1] * (0.15 + rnd() * 0.25) * (j % 2 ? 1 : -0.6), 3 + rnd() * 1.5, BL[j % 2]);
    });
    // the clover: three heart-shaped leaves on a stalk
    var CV = ['#2e8a3a', '#4aae4a', '#a8e888'];
    [[90, 30], [370, 26]].forEach(function (q) {
      var cx = q[0] + rnd() * 10, cy = nf(cx) - q[1];
      R(n, cx - 0.6, cy, 1.2, q[1] + 3, '#3a8a34');
      [[-5, -1], [5, -1], [0, -6]].forEach(function (o) { var lx = cx + o[0], ly = cy + o[1]; disc(n, lx - 1.6, ly, 3.4, CV[0]); disc(n, lx + 1.6, ly, 3.4, CV[0]); disc(n, lx - 1.8, ly - 0.4, 3, CV[1]); disc(n, lx + 1.4, ly - 0.4, 3, CV[1]); disc(n, lx - 2.6, ly - 1.4, 1.2, CV[2]); R(n, lx, ly - 2, HP, 4, '#2e7a32'); });
    });
    // a dandelion clock, its seeds ready to fly
    var DX = 226, DY = nf(DX) - 34;
    R(n, DX - 0.5, DY, 1, 37, '#6aaa44'); R(n, DX - 0.5, DY, HP, 37, '#a8e070');
    for (k = 0; k < 40; k++) { var da = k * 2.4, dr = 7; line(n, DX, DY, DX + Math.cos(da) * dr, DY + Math.sin(da) * dr, HP, '#f4f0e8'); disc(n, DX + Math.cos(da) * dr, DY + Math.sin(da) * dr, 0.9, '#ffffff'); }
    disc(n, DX, DY, 1.2, '#c8b890');
    [[DX + 12, DY - 6], [DX + 20, DY - 12], [DX + 30, DY - 10]].forEach(function (q) { line(n, q[0], q[1], q[0] + 1, q[1] + 2.5, HP, '#e8e0d0'); disc(n, q[0], q[1], 0.9, '#ffffff'); });
    land(n, nf, ['#3a8a30', '#5cb840', '#a8e870'], 5);
    for (i = 0; i < 30; i++) { x = rnd() * SW; y = 30 + rnd() * 80; n.globalAlpha = 0.7; disc(n, x, y, 0.6 + rnd() * 0.5, '#ffe880'); }
    n.globalAlpha = 1;
    L.push({ c: nr, f: 0.28 });
    return L;
  };
})();
