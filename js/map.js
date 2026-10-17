/* ==========================================================================
   map.js — Bonnie's island: the world map between levels.

   One long illustrated island in the sea, the ten worlds along it from
   the green hills to Grumble's castle, joined by a winding path. Each
   world has its landmark — and each landmark moves: the windmill turns,
   the big wheel turns, the lighthouse sweeps, fish leap in the lagoon,
   toadstools glow, crystals sparkle, snow falls, smoke rises from the
   factory, the castle flag flies and Monsty bounces in his cage. Clouds
   drift over with their shadows, boats sail, birds fly.

   Once Monsty's home, a boat route opens across the water to a second
   island, the Magpie Isles, with ten more worlds: a harbour, candy
   meadows, windy cliffs, jungle ruins, a glowing grove, a crystal
   lagoon, dunes, a moon garden, a clock tower, and Captain Magpie's sky
   ship floating over the far headland.

   Each island is painted once into a surface at full density (the
   second only once it's needed); everything that moves is drawn over
   it each frame. game.js owns the walking and
   the choosing; this file only draws.
   ========================================================================== */
(function () {
  'use strict';
  var H = BB.H, HP = 1 / BB.R, snap = BB.snap, mix = BB.mix, A = BB.ART;
  // the two islands' ends, and where the water between them is split
  // between their two painted surfaces
  var N = 35, ISLE = [[0, 650], [760, 1410], [1520, 2170], [2280, 2640]], SPLIT = 705, SPLIT2 = 1465, SPLIT3 = 2225, MW2 = 1410, MW3 = 2170, MW4 = 2640;
  var node = function (i) {
    if (i < 10) return { x: 44 + i * 62, y: 86 + Math.round(Math.sin(i * 1.2 + 0.4) * 15) };
    if (i < 20) return { x: 804 + (i - 10) * 62, y: 86 + Math.round(Math.sin((i - 10) * 1.1 + 2.2) * 15) };
    if (i < 30) return { x: 1564 + (i - 20) * 62, y: 86 + Math.round(Math.sin((i - 20) * 1.05 + 0.9) * 15) };
    return { x: 2324 + (i - 30) * 62, y: 86 + Math.round(Math.sin((i - 30) * 1.2 + 1.5) * 15) };
  };
  // the boat route between the islands, as a gentle arc over the water
  // (the second crossing, to France, is the ferry's: from node 19 to 20)
  var routeY = function (x) { var i = x > 2140 ? 29 : x > 1000 ? 19 : 9, a = node(i), b = node(i + 1), t = (x - a.x) / (b.x - a.x); return a.y + (b.y - a.y) * t - Math.sin(t * Math.PI) * 4; };
  var WORLD = [
    { land: '#82d65a', dark: '#4aa83c', col: '#5ccf6a' },
    { land: '#a2e26c', dark: '#5cb84a', col: '#8ee06a' },
    { land: '#f6dc96', dark: '#d8b468', col: '#ffc850' },
    { land: '#f0d08a', dark: '#d0aa62', col: '#4ad8e8' },
    { land: '#6c58b0', dark: '#45367e', col: '#a878f0' },
    { land: '#9088b0', dark: '#625a86', col: '#c8a0ff' },
    { land: '#f4f8ff', dark: '#b8cce8', col: '#8ad0ff' },
    { land: '#dfe8ff', dark: '#a8b8e8', col: '#ff9ad0' },
    { land: '#a8aec0', dark: '#767c94', col: '#ffa040' },
    { land: '#5e3c4e', dark: '#3a2232', col: '#f24848' },
    // the Magpie Isles
    { land: '#f0cc8e', dark: '#c89a5c', col: '#ff8a5a' },
    { land: '#ffc8e0', dark: '#e894bc', col: '#ff7ac0' },
    { land: '#98d872', dark: '#5ca848', col: '#7ac8ff' },
    { land: '#3e9e4a', dark: '#256a30', col: '#5ad860' },
    { land: '#3c3a7c', dark: '#25245a', col: '#5af0e0' },
    { land: '#6890b8', dark: '#3e5c86', col: '#6ae0ff' },
    { land: '#f2ca74', dark: '#c89848', col: '#ffb040' },
    { land: '#bab2da', dark: '#8478b0', col: '#c8b0ff' },
    { land: '#b09880', dark: '#7a6450', col: '#e8c050' },
    { land: '#7e8eaa', dark: '#4e5a78', col: '#78d8ff' },
    // the Big Trip: France
    { land: '#eedcae', dark: '#c4a874', col: '#3a8ad8' },
    { land: '#d6e070', dark: '#9cae3e', col: '#e0a020' },
    { land: '#e8dcc6', dark: '#b6a284', col: '#e86a4a' },
    { land: '#f0c890', dark: '#c08a50', col: '#c88a40' },
    { land: '#ecca62', dark: '#b28a30', col: '#d8a818' },
    { land: '#aab6ca', dark: '#6c7890', col: '#6a7aa8' },
    { land: '#8cbaa2', dark: '#4a7a64', col: '#3a9a70' },
    { land: '#9ad072', dark: '#5ca048', col: '#9a6a48' },
    { land: '#ffcadc', dark: '#d890b0', col: '#e868a8' },
    { land: '#8272b2', dark: '#54488a', col: '#6a48c8' },
    // Holiday!: the waterpark, the surf beach, the cycle paths, Puy du Fou, Saint-Malo
    { land: '#a8dcec', dark: '#68aec4', col: '#2aa8e0' },
    { land: '#f6dca0', dark: '#d0b070', col: '#2a7ad0' },
    { land: '#a8d870', dark: '#6aa848', col: '#4aa844' },
    { land: '#92c868', dark: '#5a9a44', col: '#b84a3a' },
    { land: '#c8c4bc', dark: '#8a867e', col: '#4a6a96' }
  ];

  // painting helpers (no wrap-round here: the island has ends)
  var R = function (g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(snap(x), snap(y), Math.max(HP, snap(w)), Math.max(HP, snap(h))); };
  var disc = function (g, cx, cy, r, c) {
    g.fillStyle = c;
    for (var y = -r; y <= r; y += HP) { var hw = Math.sqrt(Math.max(0, r * r - y * y)); g.fillRect(snap(cx - hw), snap(cy + y), Math.max(HP, snap(hw * 2)), HP); }
  };
  var oval = function (g, cx, cy, rx, ry, c) {
    g.fillStyle = c;
    for (var y = -ry; y <= ry; y += HP) { var hw = rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))); g.fillRect(snap(cx - hw), snap(cy + y), Math.max(HP, snap(hw * 2)), HP); }
  };
  var ball = function (g, x, y, r, c) { disc(g, x + r * 0.12, y + r * 0.16, r, c[0]); disc(g, x, y, r * 0.9, c[1]); if (c[2]) disc(g, x - r * 0.3, y - r * 0.32, r * 0.46, c[2]); };
  var canopy = function (g, cx, cy, rw, rh, rnd, c) {
    var pts = [], n = Math.max(5, Math.round(rw * rh / 6));
    for (var i = 0; i < n; i++) { var a = rnd() * 6.283, d = Math.sqrt(rnd()); pts.push([cx + Math.cos(a) * rw * d, cy + Math.sin(a) * rh * d, 1.8 + rnd() * 2.4]); }
    pts.sort(function (p, q) { return p[1] - q[1]; });
    pts.forEach(function (p) { disc(g, p[0] + 0.6, p[1] + 0.9, p[2], c[0]); });
    pts.forEach(function (p) { disc(g, p[0], p[1], p[2] * 0.88, c[1]); });
    pts.forEach(function (p) { if (p[1] < cy) disc(g, p[0] - p[2] * 0.3, p[1] - p[2] * 0.35, p[2] * 0.42, c[2]); });
  };
  var tree = function (g, x, y, s, rnd, c, trunk) {
    R(g, x - 0.75 * s, y - 5 * s, 1.5 * s, 5 * s, trunk || '#7a4a28');
    canopy(g, x, y - 6.5 * s, 4 * s, 3.4 * s, rnd, c);
    oval(g, x + 1, y + 0.4, 3 * s, 0.8, 'rgba(20,40,20,0.25)');
  };
  var GREEN = ['#2e8a3c', '#4fb44a', '#9ae878'];
  var tri = function (g, cx, base, w, h, cL, cR) {
    for (var y = 0; y < h; y += HP) { var hw = (y / h) * w / 2; R(g, cx - hw, base - h + y, hw, HP, cL); R(g, cx, base - h + y, hw, HP, cR); }
  };
  var shadow = function (g, x, y, rx) { oval(g, x, y, rx, rx * 0.28, 'rgba(30,20,60,0.22)'); };

  var coastTop = function (x) { return 40 + Math.sin(x * 0.05) * 5 + Math.sin(x * 0.13 + 1) * 2.5; };
  var coastBot = function (x) { return 121 + Math.sin(x * 0.06 + 2) * 4 + Math.sin(x * 0.17) * 2; };
  var regionAt = function (x) {
    if (x < SPLIT) return Math.max(0, Math.min(9, Math.round((x - 44) / 62)));
    if (x < SPLIT2) return Math.max(10, Math.min(19, 10 + Math.round((x - 804) / 62)));
    if (x < SPLIT3) return Math.max(20, Math.min(29, 20 + Math.round((x - 1564) / 62)));
    return Math.max(30, Math.min(34, 30 + Math.round((x - 2324) / 62)));
  };
  var LAGOON = function () { var p = node(3); return { x: p.x, y: p.y + 2, rx: 24, ry: 15 }; };

  var build = function (k) {
    var X0 = [0, SPLIT, SPLIT2, SPLIT3][k], SW = [SPLIT, SPLIT2 - SPLIT, SPLIT3 - SPLIT2, MW4 - SPLIT3][k], IA = ISLE[k][0], IB = ISLE[k][1];
    var c = BB.surface(SW, H), g = c.getContext('2d'), rnd = BB.rng(2026 + k), i, x, y, p;
    // painted in the map's own coordinates
    g.translate(-X0, 0);
    // the sea, deepening away from the shore
    for (y = 0; y < H; y += HP) R(g, X0, y, SW, HP, mix('#5cc4f2', '#2a78c4', y / H));
    for (i = 0; i < 160; i++) { x = X0 + rnd() * SW; y = rnd() * H; R(g, x, y, 2 + rnd() * 4, HP, 'rgba(255,255,255,0.18)'); }
    /* the island: a white line of surf, a sandy shore, then each world's
       own ground. The borders between worlds wander, so they read as
       landscape rather than lines; painted pixel by pixel. */
    var Rr = BB.R, iw = SW * Rr, ih = H * Rr, img = g.createImageData(iw, ih), d = img.data, rgb = BB.toRgb;
    var put = function (px, py, c, a) { var k = (py * iw + px) * 4; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = a === undefined ? 255 : a; };
    var shade = function (c, f) { return f > 0 ? [c[0] + (255 - c[0]) * f, c[1] + (255 - c[1]) * f, c[2] + (255 - c[2]) * f] : [c[0] * (1 + f), c[1] * (1 + f), c[2] * (1 + f)]; };
    var hsh = function (a, b) { var q = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return q - Math.floor(q); };
    // soft value noise, for the ground's grain
    var noise = function (x, y) {
      var xi = Math.floor(x / 3), yi = Math.floor(y / 3), fx = x / 3 - xi, fy = y / 3 - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      var n00 = hsh(xi, yi), n10 = hsh(xi + 1, yi), n01 = hsh(xi, yi + 1), n11 = hsh(xi + 1, yi + 1);
      return n00 + (n10 - n00) * u + (n01 - n00) * v + (n00 - n10 - n01 + n11) * u * v;
    };
    var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    var LAND = WORLD.map(function (w) { return rgb(w.land); });
    var SAND = rgb('#fbe6a8'), FOAM = rgb('#ffffff'), SHALLOW = rgb('#9ae6f6');
    var CLIFF = WORLD.map(function (w) { return rgb(mix(w.dark, '#4a2c34', 0.55)); });
    var SANDY = { 2: 1, 3: 1, 10: 1, 16: 1, 20: 1, 31: 1, 34: 1 };
    /* which world a point belongs to: the borders wander, and within a
       couple of pixels of one the two grounds are dithered together, the
       way pixel artists blend, so the worlds run into each other */
    var regionXY = function (x, y, px, py) {
      var ri = regionAt(x), lo = Math.floor(ri / 10) * 10, last = ri < 30 ? lo + 9 : 34;
      for (var j = Math.max(lo, ri - 1); j <= Math.min(last - 1, ri); j++) {
        var bx = (node(j).x + node(j + 1).x) / 2 + Math.sin(y * 0.16 + j * 2) * 5 + Math.sin(y * 0.41 + j) * 2, dd = x - bx;
        if (Math.abs(dd) < 3) return (dd + 3) / 6 * 16 > BAYER[(py & 3) * 4 + (px & 3)] ? j + 1 : j;
        if (j === ri && dd > 0) return j + 1;
        if (j === ri - 1 && dd < 0) return j;
      }
      return ri;
    };
    for (var py = 0; py < ih; py++) for (var px = 0; px < iw; px++) {
      x = X0 + px / Rr; y = py / Rr;
      // the island narrows toward each end; past the tip, the shallows
      // and the surf curve round it rather than stopping in a straight line
      var e0 = Math.min(x - IA - 4, IB - 4 - x) / 18, edge = Math.min(1, Math.max(0, e0)), top = coastTop(x) + (1 - edge) * 30, bot = coastBot(x) - (1 - edge) * 30;
      // shallow water, paler near the shore
      var off = y < top ? top - y : y > bot ? y - bot : 0;
      if (e0 < 0) off = Math.hypot(off, -e0 * 18);
      if (off > 2) { if (off < 12) put(px, py, SHALLOW, Math.round((1 - off / 12) * 120)); continue; }
      if (off > 1) { put(px, py, FOAM, 200); continue; }
      var ri2 = regionXY(x, y, px, py), sandy = SANDY[ri2];
      // a sandy beach on the north shore
      if (y < top + 2.5) { put(px, py, shade(SAND, (noise(x * 2, y * 2) - 0.5) * 0.08)); continue; }
      // the south shore: a little cliff of the world's own rock, or more beach
      if (y > bot - (sandy ? 2.5 : 5)) {
        if (sandy) { put(px, py, shade(SAND, (noise(x * 2, y * 2) - 0.5) * 0.08)); continue; }
        var cl = CLIFF[ri2], band = Math.floor((y - (bot - 5)) * 2);
        put(px, py, shade(cl, band === 0 ? 0.25 : (band % 3 === 2 ? -0.12 : 0) + (hsh(Math.floor(x), band) - 0.5) * 0.1));
        continue;
      }
      // the ground: its own colour, with a soft grain, lighter at the top
      // edge and darker toward the cliff, and the odd darker speck
      var base = LAND[ri2], n = noise(x, y) - 0.5, f = n * 0.16;
      if (y < top + 4) f += 0.18;
      if (y > bot - 9) f -= (y - (bot - 9)) / 4 * 0.12;
      if (hsh(px, py) < 0.025) f -= 0.12;
      put(px, py, shade(base, f));
    }
    var tmp = document.createElement('canvas'); tmp.width = iw; tmp.height = ih; tmp.getContext('2d').putImageData(img, 0, 0);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(tmp, 0, 0); g.restore();
    // the little things in each world's ground: grass tufts and flowers,
    // dune ripples, pebbles, snow glints, lava cracks
    for (i = 0; i < 700; i++) {
      x = IA + 8 + rnd() * (IB - IA - 16); y = coastTop(x) + 5 + rnd() * (coastBot(x) - coastTop(x) - 14);
      var w3 = regionAt(x), wd = WORLD[w3], r3 = rnd();
      if (w3 <= 1 || w3 === 4 || w3 === 12 || w3 === 13 || w3 === 21 || w3 === 27 || w3 === 32 || w3 === 33) {
        var tuft = mix(wd.dark, '#1a3010', w3 === 4 ? 0.1 : 0.2);
        R(g, x, y, HP, 1, tuft); R(g, x - HP, y + HP, HP, HP, tuft); R(g, x + HP, y + HP, HP, HP, tuft);
        if (r3 < (w3 === 13 ? 0.07 : 0.18)) { R(g, x + 2, y, 1, 1, ['#ffffff', '#ffe060', '#ff8ab0', '#b8a0ff'][Math.floor(rnd() * 4)]); }
      } else if (w3 === 30) {
        // poolside tiles
        if (r3 < 0.5) R(g, x, y, 2, HP, mix(wd.dark, wd.land, 0.5)); else R(g, x, y, HP, HP, '#ffffff');
      } else if (w3 === 22 || w3 === 25 || w3 === 34) {
        // cobbles and slates
        R(g, x, y, 2, 1, mix(wd.dark, wd.land, 0.35)); R(g, x, y, 2, HP, mix(wd.land, '#ffffff', 0.3));
      } else if (w3 === 24) {
        // the cheese's holes
        if (r3 < 0.4) { oval(g, x, y, 1.6, 1, mix(wd.dark, wd.land, 0.4)); R(g, x - 1, y + 0.5, 2, HP, mix(wd.land, '#ffffff', 0.35)); }
      } else if (w3 === 28) {
        R(g, x, y, 1, 1, ['#ffffff', '#ff8ac8', '#ffe060', '#8ad0ff'][Math.floor(rnd() * 4)]);
      } else if (w3 === 29) {
        if (r3 < 0.2) R(g, x, y, HP, HP, '#fff0b0'); else R(g, x, y, 1.5, HP, mix(wd.dark, wd.land, 0.4));
      } else if (w3 === 11) {
        // sprinkles
        R(g, x, y, 1, HP, ['#ffffff', '#ff5a8a', '#5ad8a8', '#ffd84a', '#8a7aff'][Math.floor(rnd() * 5)]);
      } else if (w3 === 14) {
        if (r3 < 0.12) R(g, x, y, HP * 2, HP * 2, r3 < 0.06 ? '#7af0e8' : '#ff9ae0'); else R(g, x, y, 1.5, 1, mix(wd.dark, '#000000', 0.15));
      } else if (w3 === 17) {
        // little craters
        if (r3 < 0.18) { oval(g, x, y, 2, 1, mix(wd.dark, wd.land, 0.3)); R(g, x - 1.5, y + 1, 3, HP, mix(wd.land, '#ffffff', 0.4)); }
        else R(g, x, y, HP, HP, '#ffffff');
      } else if (w3 === 2 || w3 === 3 || w3 === 10 || w3 === 16 || w3 === 20 || w3 === 23 || w3 === 31) {
        if (r3 < 0.5) R(g, x, y, 3, HP, mix(wd.dark, wd.land, 0.4));
      } else if (w3 === 6 || w3 === 7) {
        if (r3 < 0.3) R(g, x, y, HP, HP, '#ffffff'); else R(g, x, y, 2, HP, mix(wd.dark, wd.land, 0.5));
      } else if (w3 === 9) {
        if (r3 < 0.25) R(g, x, y, 2, HP, '#ff7a2a'); else R(g, x, y, 1.5, 1, mix(wd.dark, '#000000', 0.2));
      } else {
        R(g, x, y, 1.5, 1, mix(wd.dark, '#000000', 0.1)); R(g, x, y, 1, HP, mix(wd.land, '#ffffff', 0.25));
      }
    }
    if (k === 1) { isles2(g, rnd); return c; }
    if (k === 2) { isles3(g, rnd); return c; }
    if (k === 3) { isles4(g, rnd); return c; }
    // the lagoon in the coral world
    var L = LAGOON();
    oval(g, L.x, L.y, L.rx + 2, L.ry + 2, '#fbe6a8');
    oval(g, L.x, L.y, L.rx, L.ry, '#5ad2e6');
    oval(g, L.x + 2, L.y + 2, L.rx - 4, L.ry - 4, '#3ab8d8');
    [[-14, 4, '#ff7aa8'], [-8, 8, '#ffb050'], [12, 6, '#c08aff'], [16, -4, '#ff7aa8'], [-16, -5, '#ffb050']].forEach(function (k) { ball(g, L.x + k[0], L.y + k[1], 2.4, [mix(k[2], '#3ab8d8', 0.5), mix(k[2], '#3ab8d8', 0.3), mix(k[2], '#ffffff', 0.2)]); });
    // 1 · Sunny Hills: hills, trees, Bonnie's house
    p = node(0);
    ball(g, p.x - 16, p.y - 16, 12, ['#3e9a40', '#62c050', '#a2e878']);
    ball(g, p.x + 8, p.y - 22, 9, ['#3e9a40', '#62c050', '#a2e878']);
    for (i = 0; i < 4; i++) tree(g, p.x - 26 + i * 15, p.y + 22 - (i % 2) * 6, 1, rnd, GREEN);
    R(g, p.x - 32, p.y - 6, 12, 8, '#fff2dc'); for (i = 0; i < 7; i += HP) R(g, p.x - 34 + i, p.y - 6 - i * 0.8, 16 - i * 2, HP, '#e85a5a');
    R(g, p.x - 27.5, p.y - 2, 3, 4, '#8a5a3a'); R(g, p.x - 31, p.y - 4, 2.5, 2, '#9ad8ff'); R(g, p.x - 23, p.y - 4, 2.5, 2, '#9ad8ff');
    R(g, p.x + 13, p.y - 16, 4, 14, '#f4ecd8'); R(g, p.x + 12, p.y - 18, 6, 2.5, '#d86a5a');
    // 2 · Playground Park: trees, swings, slide
    p = node(1);
    for (i = 0; i < 3; i++) tree(g, p.x - 24 + i * 22, p.y - 14 + (i % 2) * 34, 1.1, rnd, ['#2e8a3c', '#58c24a', '#b2f088']);
    R(g, p.x + 10, p.y - 18, HP * 2, 12, '#e85a5a'); R(g, p.x + 22, p.y - 18, HP * 2, 12, '#e85a5a'); R(g, p.x + 10, p.y - 18, 13, HP * 2, '#e85a5a');
    R(g, p.x + 13, p.y - 17, HP, 7, '#ffffff'); R(g, p.x + 19, p.y - 17, HP, 7, '#ffffff'); R(g, p.x + 12, p.y - 10, 3, 1, '#ffd84a'); R(g, p.x + 18, p.y - 10, 3, 1, '#ffd84a');
    for (i = 0; i < 10; i += HP) R(g, p.x - 18 + i, p.y + 12 - i * 0.9, 1.5, HP * 2, '#ffd84a');
    R(g, p.x - 19, p.y + 3, 1, 10, '#5aa8ff');
    // 3 · Sandy Shore: palms, a parasol, the lighthouse on the point
    p = node(2);
    [[-18, -14], [16, 18], [22, -18]].forEach(function (q) {
      var px = p.x + q[0], py = p.y + q[1];
      for (var k = 0; k < 9; k += HP) R(g, px + Math.sin(k * 0.25) * 1.5, py - k, 1.3, HP, '#a8744c');
      for (var f = 0; f < 5; f++) { var a = -Math.PI / 2 + (f - 2) * 0.75; for (var t = 0; t < 6; t += HP) R(g, px + Math.cos(a) * t, py - 9 + Math.sin(a) * t + t * t * 0.06, 1, HP * 2, f % 2 ? '#3ea84a' : '#62c850'); }
    });
    for (i = 0; i < 6; i += HP) R(g, p.x - 2 - i * 0.5, p.y + 14 - 6 + i * 0.4, i, HP, '#ffffff');
    oval(g, p.x + 1, p.y + 12, 6, 2.5, '#ef5a5a'); R(g, p.x + 1, p.y + 12, HP, 6, '#ffffff');
    var lh = { x: p.x + 4, y: coastBot(p.x + 4) - 2 };
    R(g, lh.x - 2.5, lh.y - 18, 5, 18, '#ffffff'); for (i = 0; i < 4; i++) R(g, lh.x - 2.5, lh.y - 16 + i * 4.5, 5, 2, '#ef5a5a');
    R(g, lh.x - 3, lh.y - 22, 6, 4, '#3a4a7a'); R(g, lh.x - 1.5, lh.y - 21, 3, 2, '#fff6a0');
    // 4 · Coral Reef: a boardwalk across the lagoon
    var a3 = node(2), b3 = node(4);
    for (x = L.x - L.rx - 2; x < L.x + L.rx + 2; x += 3) {
      var tt = (x - a3.x) / (b3.x - a3.x), py2 = a3.y + (b3.y - a3.y) * tt;
      R(g, x, py2 - 2.5, 2.4, 5, '#c08a58'); R(g, x, py2 - 2.5, 2.4, 1, '#e8b880');
    }
    // 5 · Spooky Woods: purple trees and toadstools
    p = node(4);
    for (i = 0; i < 7; i++) tree(g, p.x - 28 + i * 9.5, p.y - 12 + (i % 2 ? 26 : 0) + (i % 3) * 2, 1.05, rnd, ['#2c1e5c', '#4a3888', '#7a68c0'], '#3a2a5c');
    // 6 · Crystal Caves: a mountain with a cave mouth and crystals
    p = node(5);
    tri(g, p.x, p.y + 4, 56, 34, '#a8a0c8', '#6c6490');
    oval(g, p.x, p.y + 1, 7, 8, '#241c3a'); R(g, p.x - 7, p.y + 1, 14, 3.5, '#241c3a');
    // 7 · Frosty Peaks: snowy mountains, pines, an igloo
    p = node(6);
    tri(g, p.x - 12, p.y - 2, 40, 30, '#e8f2ff', '#b0c8e8'); tri(g, p.x - 12, p.y - 22, 14, 10, '#ffffff', '#d8e8ff');
    tri(g, p.x + 14, p.y + 2, 30, 22, '#e8f2ff', '#b0c8e8'); tri(g, p.x + 14, p.y - 13, 10, 7, '#ffffff', '#d8e8ff');
    for (i = 0; i < 5; i++) { var tx2 = p.x - 24 + i * 12, ty2 = p.y + 22 + (i % 2) * 4; tri(g, tx2, ty2, 8, 12, '#3a8a6a', '#2a6a54'); R(g, tx2 - 1.5, ty2 - 12, 3, 1, '#ffffff'); }
    oval(g, p.x + 22, p.y + 16, 6, 4, '#ffffff'); oval(g, p.x + 22, p.y + 17, 2, 2.5, '#3a4a6a');
    // 8 · Cloud Kingdom: a tower of cloud under a rainbow
    p = node(7);
    var rb = ['#ff7a8a', '#ffb050', '#ffe060', '#7ee078', '#6ac0ff', '#a88aff'];
    for (i = 0; i < rb.length; i++) for (var aa = Math.PI; aa < Math.PI * 2; aa += 0.02) R(g, p.x + Math.cos(aa) * (24 - i * 1.5), p.y - 8 + Math.sin(aa) * (20 - i * 1.5), HP * 2, HP * 2, rb[i]);
    [[-14, 10, 9], [0, 4, 11], [14, 10, 9], [-6, -12, 7], [8, -14, 6]].forEach(function (q) { ball(g, p.x + q[0], p.y + q[1], q[2], ['#b8c8f0', '#f4f8ff', '#ffffff']); });
    // 9 · Toy Factory: a sawtooth-roofed works, a block tower
    p = node(8);
    R(g, p.x - 24, p.y - 22, 30, 16, '#d8c8b0'); R(g, p.x - 24, p.y - 8, 30, 2, '#a89880');
    for (i = 0; i < 5; i++) for (var k2 = 0; k2 < 6; k2 += HP) R(g, p.x - 24 + i * 6 + k2, p.y - 28 + k2, HP, 6 - k2, '#8a90a8');
    for (i = 0; i < 4; i++) R(g, p.x - 21 + i * 7, p.y - 17, 4, 4, '#ffe08a');
    R(g, p.x - 20, p.y - 36, 4, 10, '#8a6a5a'); R(g, p.x - 8, p.y - 34, 4, 8, '#8a6a5a');
    [['#ef5a5a', 0, 0], ['#5aa8ff', 6, 0], ['#ffd84a', 3, -5]].forEach(function (q) { R(g, p.x + 14 + q[1], p.y + 12 + q[2], 5, 5, q[0]); R(g, p.x + 14 + q[1], p.y + 12 + q[2], 5, 1, mix(q[0], '#ffffff', 0.4)); });
    // 10 · Dragon Castle: dark crags, lava, the castle
    p = node(9);
    tri(g, p.x, p.y + 10, 64, 26, '#6a4458', '#4a2a3c');
    for (i = 0; i < 8; i++) R(g, p.x - 22 + rnd() * 44, p.y + 2 + rnd() * 14, 3 + rnd() * 4, HP * 2, '#ff6a2a');
    R(g, p.x - 14, p.y - 26, 28, 18, '#8a7a90'); R(g, p.x - 14, p.y - 26, 28, 1, '#b8a8c0');
    [[-18, -34, 8, 26], [10, -34, 8, 26], [-4, -42, 8, 18]].forEach(function (q) {
      R(g, p.x + q[0], p.y + q[1], q[2], q[3], '#9a8aa0'); R(g, p.x + q[0], p.y + q[1], 2, q[3], '#b8a8c0');
      for (var bt = 0; bt < q[2]; bt += 3) R(g, p.x + q[0] + bt, p.y + q[1] - 2, 2, 2, '#9a8aa0');
    });
    oval(g, p.x, p.y - 12, 3, 4, '#2a1a24'); R(g, p.x - 3, p.y - 12, 6, 4, '#2a1a24');
    return c;
  };

  /* the Magpie Isles' landmarks, painted once. The moving parts (the
     boats, the kite, the glow, the clock's hands, the ship) are drawn
     over them each frame, in drawIsles2. */
  var CANDY = ['#ff5a8a', '#5ad8a8', '#ffb84a', '#8a7aff'];
  var isles2 = function (g, rnd) {
    var p, i, x, y, k;
    // 11 · Sunset Harbour: the pier the boat comes in to, fishermen's huts, crates
    for (x = 738; x < 770; x += 2.5) { y = routeY(x); R(g, x, y + 2.5, 2, 1.5, 'rgba(20,40,80,0.3)'); R(g, x, y - 3, 2, 6, '#c08a58'); R(g, x, y - 3, 2, 1, '#e8b880'); }
    for (x = 739; x < 768; x += 7) R(g, x, routeY(x) + 3, 1, 2.5, '#7a4a28');
    p = node(10);
    [[-26, -20, '#e8504a'], [-12, -24, '#4a8ae0'], [14, -20, '#ffc840']].forEach(function (q) {
      var hx = p.x + q[0], hy = p.y + q[1];
      R(g, hx - 4.5, hy - 7, 9, 7, '#f4ecd8'); R(g, hx - 4.5, hy - 1, 9, 1, '#d8ccb0');
      for (var r = 0; r < 4; r += HP) R(g, hx - 5.5 + r, hy - 7 - r, 11 - r * 2, HP, q[2]);
      R(g, hx - 1, hy - 4, 2, 4, '#7a4a28'); R(g, hx + 2, hy - 5, 1.5, 1.5, '#9ad8ff');
    });
    [[18, 10], [22, 10], [20, 6]].forEach(function (q) { R(g, p.x + q[0], p.y + q[1], 4, 4, '#b07a48'); R(g, p.x + q[0], p.y + q[1], 4, 1, '#d8a870'); R(g, p.x + q[0] + 1.75, p.y + q[1], HP, 4, '#8a5a30'); });
    oval(g, p.x - 20, p.y + 12, 2.5, 3, '#8a5a30'); R(g, p.x - 22.5, p.y + 11, 5, HP, '#5a3a20');
    // 12 · Candy Meadow: gumdrop hills, lollipop trees, a candy cane
    p = node(11);
    ball(g, p.x - 18, p.y - 18, 9, ['#c03a7a', '#ff7ab8', '#ffc8e4']);
    ball(g, p.x + 14, p.y - 22, 7, ['#2a9a7a', '#5ad8a8', '#b8f8de']);
    [[-26, 18], [-8, 20], [10, 14], [24, 22], [2, -6]].forEach(function (q, j) {
      var lx = p.x + q[0], ly = p.y + q[1], cc = CANDY[j % 4];
      R(g, lx - 0.5, ly - 8, 1, 8, '#ffffff'); disc(g, lx + 0.4, ly - 10.6, 4, mix(cc, '#2a1640', 0.35));
      disc(g, lx, ly - 11, 4, cc); disc(g, lx, ly - 11, 2.6, '#fff4fa'); disc(g, lx + 0.4, ly - 11.4, 1.5, cc); R(g, lx - 2.5, ly - 13, 1, 1, '#ffffff');
    });
    for (k = 0; k < 12; k += 1.5) R(g, p.x + 26, p.y - 10 + k, 1.5, 1.5, (k / 1.5) % 2 ? '#ffffff' : '#e8304a');
    for (k = 0; k < 4; k++) { var ca = Math.PI + k * 0.9; R(g, p.x + 24.5 + Math.cos(ca) * -1.5 + 1.5, p.y - 11 + Math.sin(ca) * 1.8, 1.5, 1.5, k % 2 ? '#ffffff' : '#e8304a'); }
    // 13 · Windy Cliffs: a headland of rock, trees all bent the same way, a signpost
    p = node(12);
    for (i = 0; i < 4; i++) {
      var tx = p.x - 24 + i * 15, ty = p.y + 22 - (i % 2) * 30;
      for (k = 0; k < 6; k += HP) R(g, tx + k * 0.45, ty - k, 1.2, HP, '#7a4a28');
      canopy(g, tx + 5, ty - 8, 5, 2.6, rnd, ['#2e8a3c', '#58c24a', '#b2f088']);
    }
    R(g, p.x + 16, p.y - 16, 1, 10, '#8a5a30'); R(g, p.x + 13, p.y - 16, 9, 3, '#c08a58');
    for (k = 0; k < 2; k += HP) R(g, p.x + 22 + k, p.y - 15.5 + k * 0.75, HP, 2 - k * 1.5, '#c08a58');
    // 14 · Jungle Ruins: a stepped temple in the trees, hung with vines
    p = node(13);
    for (i = 0; i < 4; i++) {
      var tw = 30 - i * 7, tyy = p.y - 9 - i * 5;
      R(g, p.x + 6 - tw / 2, tyy, tw, 5, ['#a8a088', '#b8b098', '#c8c0a8', '#d4ccb4'][i]); R(g, p.x + 6 - tw / 2, tyy, tw, 1, '#e8e0c8');
      R(g, p.x + 6 - tw / 2, tyy + 4, tw, 1, '#7a7460');
    }
    R(g, p.x + 3.5, p.y - 14, 5, 5, '#3a3428');
    [[-2, -24, 9], [12, -22, 8], [0, -12, 6]].forEach(function (q) { for (k = 0; k < q[2]; k += HP) R(g, p.x + q[0] + Math.sin(k * 0.8) * 0.6, p.y + q[1] + k, HP, HP, '#3a9a3a'); });
    for (i = 0; i < 6; i++) tree(g, p.x - 26 + i * 11, p.y + 18 + (i % 2) * 6 - (i === 0 || i === 5 ? 26 : 0), 1.1, rnd, ['#1c5e2a', '#2e9a3c', '#6ad860'], '#5a3a20');
    // 15 · Glowshroom Grove: great mushrooms, lit from inside
    p = node(14);
    [[-20, -10, 6.5, '#3ad0c8'], [-6, -16, 5, '#ff7ad0'], [14, -12, 7, '#9a7aff'], [22, 16, 4.5, '#3ad0c8'], [-24, 18, 4, '#ff7ad0']].forEach(function (q) {
      var mx = p.x + q[0], my = p.y + q[1], mr = q[2];
      R(g, mx - mr * 0.25, my - mr * 1.3, mr * 0.5, mr * 1.3, '#e8e0f8'); R(g, mx + mr * 0.05, my - mr * 1.3, mr * 0.2, mr * 1.3, '#c8c0e0');
      oval(g, mx + 0.4, my - mr * 1.3 + 0.6, mr, mr * 0.55, mix(q[3], '#14102a', 0.5));
      oval(g, mx, my - mr * 1.3, mr, mr * 0.55, q[3]); oval(g, mx - mr * 0.25, my - mr * 1.45, mr * 0.55, mr * 0.25, mix(q[3], '#ffffff', 0.45));
      disc(g, mx + mr * 0.45, my - mr * 1.3, 0.9, '#ffffff'); disc(g, mx - mr * 0.55, my - mr * 1.2, 0.7, '#ffffff');
    });
    // 16 · Crystal Lagoon: a still pool ringed with rock and crystal spires
    p = node(15);
    oval(g, p.x + 2, p.y - 20, 19, 9, '#4a5a80'); oval(g, p.x + 2, p.y - 20, 17, 7.5, '#3ab8d8'); oval(g, p.x + 3, p.y - 19, 13, 5, '#2a98c4');
    [[-18, -18, 9, '#7af0ff'], [-13, -25, 6, '#c8a0ff'], [17, -24, 10, '#c8a0ff'], [22, -17, 6, '#7af0ff'], [-22, 14, 7, '#c8a0ff'], [18, 16, 8, '#7af0ff']].forEach(function (q) {
      var sx = p.x + q[0], sy = p.y + q[1], sh = q[2];
      for (y = 0; y < sh; y += HP) { var hw = (y / sh) * 1.8 + 0.3; R(g, sx - hw, sy - sh + y, hw, HP, mix(q[3], '#ffffff', 0.3)); R(g, sx, sy - sh + y, hw, HP, mix(q[3], '#3a2a6a', 0.25)); }
    });
    // 17 · Dusty Dunes: a pyramid, dunes, cacti
    p = node(16);
    oval(g, p.x - 18, p.y + 16, 12, 4, '#e0b45c'); oval(g, p.x - 18, p.y + 15, 11, 2.5, '#f8da90');
    tri(g, p.x + 6, p.y - 6, 36, 22, '#f8dc94', '#c8a058');
    for (k = 1; k < 5; k++) R(g, p.x + 6 - k * 4.5 + 0.5, p.y - 6 - 22 + k * 5.5, k * 9 - 1, HP, 'rgba(120,80,30,0.3)');
    R(g, p.x + 4.5, p.y - 11, 3, 5, '#5a3a20');
    [[-24, -8], [24, 14]].forEach(function (q) {
      var cx = p.x + q[0], cy = p.y + q[1];
      R(g, cx - 1, cy - 9, 2.5, 9, '#4aa84a'); R(g, cx - 1, cy - 9, 1, 9, '#6ac85a');
      R(g, cx - 3.5, cy - 6, 2.5, 1.2, '#4aa84a'); R(g, cx - 3.5, cy - 8, 1.2, 3, '#4aa84a');
      R(g, cx + 1.5, cy - 4.5, 2.5, 1.2, '#4aa84a'); R(g, cx + 3, cy - 7, 1.2, 3.5, '#4aa84a');
    });
    // 18 · Moon Garden: craters, moonflowers, a little observatory
    p = node(17);
    [[-18, 16, 5], [14, 20, 4], [24, -6, 3.5]].forEach(function (q) { oval(g, p.x + q[0], p.y + q[1], q[2] + 0.8, q[2] * 0.45 + 0.6, '#e8e4f8'); oval(g, p.x + q[0], p.y + q[1] + 0.3, q[2], q[2] * 0.45, '#8478b0'); });
    R(g, p.x - 22, p.y - 22, 14, 8, '#e8e4f8'); R(g, p.x - 22, p.y - 15, 14, 1, '#b8b0d0');
    for (y = 0; y < 6; y += HP) { var dw = Math.sqrt(36 - y * y) ; R(g, p.x - 15 - dw, p.y - 22 - (6 - y), dw * 2, HP, y < 2 ? '#a898d8' : '#8a7ac0'); }
    for (k = 0; k < 9; k += HP) R(g, p.x - 15 + k * 0.7, p.y - 27 - k * 0.55, 2, 1.5, '#5a5480');
    R(g, p.x - 17, p.y - 19, 3, 5, '#3a3460');
    [[-4, 22], [6, 12], [-26, 6], [20, 4], [8, -16]].forEach(function (q, j) {
      var fx = p.x + q[0], fy = p.y + q[1];
      R(g, fx, fy - 4, HP, 4, '#5a9a6a');
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) { disc(g, fx + d[0] * 1.1, fy - 5 + d[1] * 1.1, 1, j % 2 ? '#fffbe0' : '#e8f0ff'); });
      disc(g, fx, fy - 5, 0.7, '#ffd84a');
    });
    // 19 · Clockwork Tower: a tall stone tower with a clock face (its hands move)
    p = node(18);
    R(g, p.x + 9, p.y - 34, 14, 30, '#c8b090'); R(g, p.x + 9, p.y - 34, 3, 30, '#dcc8a8'); R(g, p.x + 20, p.y - 34, 3, 30, '#a89070');
    for (y = 0; y < 7; y += HP) R(g, p.x + 16 - (y / 7) * 8.5, p.y - 41 + y, (y / 7) * 17, HP, y < 2 ? '#d86a5a' : '#b84a40');
    disc(g, p.x + 16, p.y - 26, 5.4, '#5a4030'); disc(g, p.x + 16, p.y - 26, 4.6, '#fff8e8');
    for (k = 0; k < 12; k++) { var ha = k * Math.PI / 6; R(g, p.x + 16 + Math.cos(ha) * 3.7 - 0.25, p.y - 26 + Math.sin(ha) * 3.7 - 0.25, HP, HP, '#5a4030'); }
    R(g, p.x + 14, p.y - 12, 4, 8, '#5a4030'); R(g, p.x + 11.5, p.y - 18, 1.5, 3, '#3a3048'); R(g, p.x + 19, p.y - 18, 1.5, 3, '#3a3048');
    [[-20, 14, 4], [-12, 20, 2.6]].forEach(function (q) {
      for (k = 0; k < 8; k++) { var ga = k * Math.PI / 4; disc(g, p.x + q[0] + Math.cos(ga) * q[2], p.y + q[1] + Math.sin(ga) * q[2] * 0.55, q[2] * 0.3, '#a88a40'); }
      oval(g, p.x + q[0], p.y + q[1], q[2], q[2] * 0.55, '#c8a050'); oval(g, p.x + q[0], p.y + q[1], q[2] * 0.35, q[2] * 0.2, '#7a6030');
    });
    // 20 · the Captain's mooring mast on the far headland (the ship floats above)
    p = node(19);
    R(g, p.x + 26, p.y - 28, 1.5, 28, '#6a5a6a'); R(g, p.x + 24, p.y - 1, 5.5, 1.5, '#4a3a4a');
    for (k = 0; k < 4; k++) R(g, p.x + 25, p.y - 24 + k * 6, 3.5, HP, '#8a7a8a');
    oval(g, p.x + 27, p.y + 0.5, 5, 1.4, 'rgba(30,20,60,0.22)');
  };
  // the parts of the Magpie Isles that move
  var drawIsles2 = function (ctx, st, t) {
    var p, k, i;
    // a fishing boat bobbing at the end of the pier, and one out in the bay
    [[742, routeY(742) + 8, 0], [790, 30, 1]].forEach(function (b) {
      var by = b[1] + Math.sin(t * 0.05 + b[2] * 2) * 0.8;
      R(ctx, b[0] - 5, by, 10, 2, b[2] ? '#4a8ae0' : '#e8504a'); R(ctx, b[0] - 4, by + 2, 8, 1, '#5a3a20');
      R(ctx, b[0] - 0.25, by - 7, HP, 7, '#6a4a3a'); for (k = 0; k < 6; k += HP) R(ctx, b[0] + 0.25, by - 6.5 + k, k * 0.6, HP, '#fff8ea');
    });
    // sparkles on the gumdrops
    p = node(11);
    [[-21, -22], [-14, -14], [12, -25]].forEach(function (q, j) { if ((t + j * 27) % 70 < 8) { R(ctx, p.x + q[0] - 0.25, p.y + q[1] - 1.5, HP, 3, '#ffffff'); R(ctx, p.x + q[0] - 1.5, p.y + q[1] - 0.25, 3, HP, '#ffffff'); } });
    // a kite on the windy cliffs, its tail streaming, and gusts going by
    p = node(12);
    // flown off to the side, so Bonnie never stands in front of it
    var kx = p.x + 22 + Math.sin(t * 0.03) * 4, ky = p.y - 30 + Math.sin(t * 0.05) * 3;
    for (k = 0; k < 14; k += HP) R(ctx, kx - 4 - k, ky + 4 + Math.sin(t * 0.15 - k * 0.5) * 1.2, HP, HP, '#fff4e0');
    for (k = 0; k < 4; k++) { var bw = 3 - Math.abs(k - 1.5) * 1.2; R(ctx, kx - bw, ky - 2 + k * 1.5, bw * 2, 1.5, k < 2 ? '#ff5a6a' : '#ffd84a'); }
    R(ctx, kx - 0.25, ky - 2, HP, 6, '#ffffff');
    for (i = 0; i < 3; i++) { var gx = p.x - 34 + ((t * 0.9 + i * 40) % 70), gy = p.y - 12 + i * 12; ctx.globalAlpha = 0.5; R(ctx, gx, gy, 7, HP, '#ffffff'); R(ctx, gx + 9, gy, 3, HP, '#ffffff'); ctx.globalAlpha = 1; }
    // a parrot looping over the jungle
    p = node(13);
    var pa = t * 0.025, ppx = p.x + 6 + Math.sin(pa) * 22, ppy = p.y - 34 + Math.sin(pa * 2) * 5, flp = Math.floor(t / 6) % 2;
    disc(ctx, ppx, ppy, 1.4, '#e8304a'); R(ctx, ppx + (Math.cos(pa) > 0 ? 1 : -2), ppy - 0.5, 1, 1, '#ffd84a');
    R(ctx, ppx - 2, ppy - (flp ? 2 : 0), 1.5, 1.5, '#3a8ae0'); R(ctx, ppx + 0.5, ppy - (flp ? 2 : 0), 1.5, 1.5, '#3a8ae0');
    // the grove glows, and fireflies drift
    p = node(14);
    [[-20, -18, 6.5, '#3ad0c8'], [-6, -22, 5, '#ff7ad0'], [14, -21, 7, '#9a7aff']].forEach(function (q, j) {
      var gl = ctx.createRadialGradient(p.x + q[0], p.y + q[1], 1, p.x + q[0], p.y + q[1], q[2] * 2.2);
      gl.addColorStop(0, 'rgba(255,255,255,' + (0.18 + Math.sin(t * 0.05 + j * 2) * 0.08) + ')'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = gl; ctx.fillRect(p.x + q[0] - q[2] * 2.2, p.y + q[1] - q[2] * 2.2, q[2] * 4.4, q[2] * 4.4); ctx.restore();
    });
    for (i = 0; i < 7; i++) { var ffx = p.x - 28 + ((i * 19 + Math.sin(t * 0.02 + i) * 6) % 56), ffy = p.y - 26 + ((i * 13) % 50) + Math.sin(t * 0.04 + i * 2) * 3; if ((t + i * 17) % 60 < 40) R(ctx, ffx, ffy, 1, 1, '#f8ff9a'); }
    // ripples on the lagoon, and its crystals catching the light
    p = node(15);
    var rp = (t % 120) / 120;
    ctx.globalAlpha = 0.5 * (1 - rp);
    for (var ra = 0; ra < Math.PI * 2; ra += 0.2) R(ctx, p.x + 3 + Math.cos(ra) * (2 + rp * 9), p.y - 19 + Math.sin(ra) * (1 + rp * 3.5), HP, HP, '#ffffff');
    ctx.globalAlpha = 1;
    [[-18, -27], [17, -34], [18, 8]].forEach(function (q, j) { if ((t + j * 30) % 90 < 9) { R(ctx, p.x + q[0] - 0.25, p.y + q[1] - 1.5, HP, 3, '#ffffff'); R(ctx, p.x + q[0] - 1.5, p.y + q[1] - 0.25, 3, HP, '#ffffff'); } });
    // a tumbleweed bowling across the dunes
    p = node(16);
    var tt2 = (t * 0.5) % 90, twx = p.x - 34 + tt2, twy = p.y + 24 - Math.abs(Math.sin(tt2 * 0.12)) * 4, tr = t * 0.2;
    for (k = 0; k < 6; k++) { var a3 = tr + k * 1.05; R(ctx, twx + Math.cos(a3) * 2, twy + Math.sin(a3) * 2, 1, HP, '#a8804a'); R(ctx, twx + Math.cos(a3 + 0.5) * 1.2, twy + Math.sin(a3 + 0.5) * 1.2, HP, HP, '#c8a060'); }
    // the moon itself, hung low over its garden, and moon-dust rising
    p = node(17);
    var my2 = p.y - 36 + Math.sin(t * 0.03) * 1.5;
    disc(ctx, p.x + 12, my2, 5, '#fff6c8'); disc(ctx, p.x + 14.5, my2 - 1.5, 4.4, WORLD[17].land);
    for (i = 0; i < 6; i++) { var dph = ((t * 0.3 + i * 23) % 70) / 70; ctx.globalAlpha = 0.7 * (1 - dph); R(ctx, p.x - 24 + i * 9 + Math.sin(dph * 6 + i) * 1.5, p.y + 18 - dph * 34, HP * 2, HP * 2, '#ffffff'); }
    ctx.globalAlpha = 1;
    // the clock's hands going round
    p = node(18);
    var mh = t * 0.03, hh = t * 0.0025, cx = p.x + 16, cy = p.y - 26;
    for (k = 0; k < 3.4; k += HP) R(ctx, cx + Math.cos(mh) * k - 0.25, cy + Math.sin(mh) * k - 0.25, HP, HP, '#2a1640');
    for (k = 0; k < 2.4; k += HP) R(ctx, cx + Math.cos(hh) * k - 0.5, cy + Math.sin(hh) * k - 0.5, 1, 1, '#2a1640');
    disc(ctx, cx, cy, 0.7, '#e8304a');
    // Captain Magpie's sky ship, floating at its mast: black and white, like him
    p = node(19);
    var sx = p.x + 6, sy = p.y - 30 + (st.reduce ? 0 : Math.sin(t * 0.04) * 1.6);
    R(ctx, sx + 14, sy + 4, 6, HP, '#8a7a8a');
    oval(ctx, sx + 0.5, sy - 7.5, 12, 6, '#1c1428');
    oval(ctx, sx, sy - 8, 11.5, 5.6, '#f4f4fa');
    for (k = -8; k <= 8; k += 4) for (var yy = -5; yy < 5; yy += HP) { var ew = 11.5 * Math.sqrt(Math.max(0, 1 - (yy * yy) / 31)); if (Math.abs(k) < ew - 1) R(ctx, sx + k - 0.75, sy - 8 + yy, 1.5, HP, '#2a2440'); }
    oval(ctx, sx - 4, sy - 11, 4, 1.4, 'rgba(255,255,255,0.7)');
    R(ctx, sx - 6, sy - 3, HP, 4, '#5a4a5a'); R(ctx, sx + 6, sy - 3, HP, 4, '#5a4a5a');
    for (k = 0; k < 4; k += HP) { var hw2 = 9 - k * 0.6 + (k < 1 ? k : 1); R(ctx, sx - hw2, sy + 1 + k, hw2 * 2, HP, k < 1 ? '#c08a58' : k < 3 ? '#8a5a30' : '#5a3a20'); }
    R(ctx, sx - 6, sy + 2, 1.5, 1, '#ffe08a'); R(ctx, sx - 1, sy + 2, 1.5, 1, '#ffe08a'); R(ctx, sx + 4, sy + 2, 1.5, 1, '#ffe08a');
    var pr = Math.floor(t / 3) % 2; R(ctx, sx - 11, sy + 1 - (pr ? 2 : 0.5), HP, pr ? 4 : 2.5, '#c8c8d8');
    if (st.won2) {
      // friends now: the ship flies party bunting
      for (k = 0; k < 18; k += 1.5) R(ctx, sx - 9 + k, sy - 1 + Math.sin(k * 0.35) * 0.8, 1, 1, ['#ff5a6a', '#ffd84a', '#5cd06a', '#4aa8ff'][(k / 1.5) % 4]);
    } else {
      R(ctx, sx + 7.5, sy - 4, HP, 5, '#5a4a5a');
      for (k = 0; k < 4; k += HP) R(ctx, sx + 8 + k, sy - 4 + Math.sin(t * 0.15 + k) * 0.4, HP, 2, k < 2 ? '#1c1428' : '#f4f4fa');
    }
  };

  /* France, for the Big Trip: the ferry port, sunflower fields and a
     windmill, a village, the bakery, the cheese caves, the rooftops of
     Paris, the Métro, the Eiffel Tower, and the park with its castle. */
  var isles3 = function (g, rnd) {
    var p, i, k, x, y;
    // 21 · the ferry port: a quay along the ferry's route, a crane, containers
    for (x = 1496; x < 1532; x += 2.5) { y = routeY(x); R(g, x, y + 2.5, 2, 1.5, 'rgba(20,40,80,0.3)'); R(g, x, y - 3, 2, 6, '#b8b8c0'); R(g, x, y - 3, 2, 1, '#e0e0e8'); }
    p = node(20);
    [[-26, -6, '#e8504a'], [-26, -11, '#3a8ad8'], [-18, -6, '#f0b030'], [-18, -11, '#3aa868'], [-22, -16, '#e8504a']].forEach(function (q) { R(g, p.x + q[0], p.y + q[1], 8, 5, q[2]); R(g, p.x + q[0], p.y + q[1], 8, 1, mix(q[2], '#ffffff', 0.35)); R(g, p.x + q[0] + 2, p.y + q[1] + 1.5, HP, 3, mix(q[2], '#000000', 0.25)); R(g, p.x + q[0] + 5, p.y + q[1] + 1.5, HP, 3, mix(q[2], '#000000', 0.25)); });
    R(g, p.x + 16, p.y - 30, 2, 26, '#f0c030'); R(g, p.x + 16, p.y - 30, 0.5, 26, '#ffe080');
    R(g, p.x + 6, p.y - 31, 22, 2, '#f0c030'); R(g, p.x + 6, p.y - 29, 1, 6, '#5a5a6a'); R(g, p.x + 4.5, p.y - 23, 4, 2, '#5a5a6a');
    // 22 · sunflower fields: rows of sunflowers, a windmill (its sails turn), hay bales
    p = node(21);
    for (y = -24; y < 28; y += 6) for (x = -28; x < 28; x += 3.5) { var sx = p.x + x + (y % 12 ? 1.5 : 0), sy = p.y + y; if (Math.abs(x) < 8 && Math.abs(y) < 10) continue; if (rnd() < 0.15) continue; R(g, sx, sy, HP, 2, '#5a9a3a'); disc(g, sx, sy, 1.2, '#ffd030'); R(g, sx - 0.25, sy - 0.25, 0.5, 0.5, '#8a5020'); }
    R(g, p.x + 13, p.y - 26, 7, 16, '#f4ecd8'); R(g, p.x + 13, p.y - 26, 2, 16, '#ffffff'); R(g, p.x + 18, p.y - 26, 2, 16, '#d8ccb0');
    for (k = 0; k < 4; k += HP) R(g, p.x + 16.5 - (4 - k), p.y - 30 + k, (4 - k) * 2, HP, '#c0503a');
    R(g, p.x + 15, p.y - 14, 3, 4, '#7a4a28');
    [[-22, 14], [-16, 16]].forEach(function (q) { disc(g, p.x + q[0], p.y + q[1], 2.6, '#c89840'); disc(g, p.x + q[0], p.y + q[1], 1.6, '#e8c060'); });
    // 23 · the village: stone houses with red roofs and blue shutters, the church spire
    p = node(22);
    [[-26, -18], [-17, -20], [16, -16], [24, -19]].forEach(function (q, j) {
      var hx = p.x + q[0], hy = p.y + q[1];
      R(g, hx - 4, hy - 6, 8, 7, '#f4ead4'); R(g, hx - 4, hy, 8, 1, '#d8c8a8');
      for (var r = 0; r < 3.5; r += HP) R(g, hx - 5 + r * 0.6, hy - 6 - r, 10 - r * 1.2, HP, j % 2 ? '#d8603a' : '#c0503a');
      R(g, hx - 2.5, hy - 4, 1.5, 1.5, '#3a7ad0'); R(g, hx + 1, hy - 4, 1.5, 1.5, '#3a7ad0'); R(g, hx - 0.5, hy - 2, 1.5, 3, '#7a4a28');
    });
    R(g, p.x - 3, p.y - 30, 6, 12, '#ece0c8'); R(g, p.x - 3, p.y - 30, 1.5, 12, '#ffffff');
    tri(g, p.x, p.y - 30, 7, 10, '#6a7088', '#4a5068'); R(g, p.x - 0.25, p.y - 43, HP, 3, '#ffd040'); R(g, p.x - 1, p.y - 42, 2, HP, '#ffd040');
    // 24 · the bakery: a shop with a striped awning, a giant croissant on the roof
    p = node(23);
    R(g, p.x + 8, p.y - 20, 18, 12, '#f8e8cc'); R(g, p.x + 8, p.y - 20, 18, 1, '#ffffff');
    for (k = 0; k < 18; k += 2) R(g, p.x + 8 + k, p.y - 13, 2, 3, (k / 2) % 2 ? '#ffffff' : '#e85a5a');
    R(g, p.x + 10, p.y - 10, 5, 2, '#ffe0a0'); R(g, p.x + 18, p.y - 10, 3, 2, '#7a4a28');
    [[-3, 0], [0, -1.2], [3, 0]].forEach(function (q, j) { disc(g, p.x + 17 + q[0], p.y - 22 + q[1], 2 - (j === 1 ? 0 : 0.3), '#8a5020'); disc(g, p.x + 17 + q[0], p.y - 22.4 + q[1], 1.6 - (j === 1 ? 0 : 0.3), '#e8a850'); });
    // 25 · the cheese caves: a grassy hill with a cave mouth, cheeses outside
    p = node(24);
    ball(g, p.x - 14, p.y - 14, 13, ['#8a7a40', '#b8a050', '#d8c070']);
    oval(g, p.x - 14, p.y - 6, 5, 6, '#2a1c0c'); R(g, p.x - 19, p.y - 6, 10, 3, '#2a1c0c');
    [[-3, -2, 3], [2, 0, 2.4], [16, 12, 2.6]].forEach(function (q) { disc(g, p.x + q[0], p.y + q[1], q[2] + 0.4, '#a87820'); disc(g, p.x + q[0], p.y + q[1] - 0.3, q[2], '#ffd850'); disc(g, p.x + q[0] - 0.6, p.y + q[1] - 0.8, q[2] * 0.3, '#e8b030'); });
    // 26 · the rooftops of Paris: a block of cream houses under grey roofs
    p = node(25);
    [[-28, 18, 10], [-20, 18, 12], [-12, 20, 9], [12, 16, 11], [20, 18, 10], [28, 18, 12]].forEach(function (q) {
      var hx = p.x + q[0], hy = p.y - q[1] + 6, h2 = q[2];
      R(g, hx - 4, hy, 8, h2, '#f0e6d0'); R(g, hx - 4, hy, 1, h2, '#ffffff');
      for (var r2 = 0; r2 < 4; r2 += HP) R(g, hx - 4.5 + r2 * 0.4, hy - r2, 9 - r2 * 0.8, HP, '#7a88a0');
      R(g, hx - 2.5, hy + 2, 1.5, 2, '#5a6a8a'); R(g, hx + 1, hy + 2, 1.5, 2, '#5a6a8a');
      R(g, hx + 1, hy - 6, 1.5, 3, '#c0603a');
    });
    // 27 · the Métro: a green ironwork arch over steps going down
    p = node(26);
    R(g, p.x + 10, p.y - 14, 14, 8, '#2a3040'); for (k = 0; k < 4; k++) R(g, p.x + 11, p.y - 13 + k * 2, 12, 1, '#8890a0');
    R(g, p.x + 9, p.y - 22, 1.5, 16, '#3a7a5c'); R(g, p.x + 23.5, p.y - 22, 1.5, 16, '#3a7a5c');
    for (k = 0; k <= 14; k += HP) R(g, p.x + 9.5 + k, p.y - 22 - Math.sin(k / 14 * Math.PI) * 4, 1, 1.5, '#3a7a5c');
    disc(g, p.x + 17, p.y - 26, 2.4, '#3a7a5c'); disc(g, p.x + 17, p.y - 26, 1.8, '#ffe8a0');
    // 28 · the Eiffel Tower, standing over its gardens
    p = node(27);
    var tx = p.x + 16, tb = p.y - 2, TH = 52;
    for (y = 0; y < TH; y += HP) {
      var f2 = y / TH, half = f2 < 0.3 ? 11 - f2 * 16 : f2 < 0.6 ? 6.2 - (f2 - 0.3) * 9 : 3.5 - (f2 - 0.6) * 7.5, yy = tb - y;
      if (y < 9) { var arch = Math.sqrt(Math.max(0, 1 - Math.pow(y / 9, 2))) * (half - 2.2); R(g, tx - half, yy, half - arch, HP, '#8a6448'); R(g, tx + arch, yy, half - arch, HP, '#6c4c38'); }
      else { R(g, tx - half, yy, half, HP, '#8a6448'); R(g, tx, yy, half, HP, '#6c4c38'); if ((y | 0) % 3 === 0) R(g, tx - half, yy, half * 2, HP, 'rgba(255,240,220,0.25)'); }
    }
    R(g, tx - 9, tb - 15.5, 18, 1.5, '#5a3c28'); R(g, tx - 6, tb - 31, 12, 1.5, '#5a3c28');
    R(g, tx - 0.25, tb - TH - 4, HP, 4, '#5a3c28');
    // 29 · the park: pink paths, a carousel (it turns), a balloon seller
    p = node(28);
    oval(g, p.x - 18, p.y - 12, 10, 3, '#f0d8a8'); R(g, p.x - 26, p.y - 18, 16, 6, '#fff0f6');
    for (k = 0; k < 6; k += HP) R(g, p.x - 18 - (10 - k * 1.6), p.y - 18 - k, (10 - k * 1.6) * 2, HP, (Math.floor(k) % 2) ? '#ff8ac8' : '#ffffff');
    R(g, p.x - 18.25, p.y - 26, HP, 3, '#ffd040');
    // 30 · the castle: pink walls, slim blue turrets with gold tips
    p = node(29);
    var cxx = p.x + 2, cb = p.y - 8;
    R(g, cxx - 14, cb - 12, 28, 12, '#ffd8e8'); R(g, cxx - 14, cb - 12, 28, 1, '#ffffff'); R(g, cxx - 14, cb - 1, 28, 1, '#e8a8c4');
    oval(g, cxx, cb - 3, 3, 4, '#5a3a5a'); R(g, cxx - 3, cb - 3, 6, 3, '#5a3a5a');
    [[-12, 18, 2.4], [-6, 24, 2.8], [0, 32, 3.4], [6, 24, 2.8], [12, 18, 2.4]].forEach(function (q) {
      var qx = cxx + q[0], qh = q[1], qw = q[2];
      R(g, qx - qw, cb - qh, qw * 2, qh, '#ffcce0'); R(g, qx - qw, cb - qh, qw * 0.6, qh, '#ffffff');
      tri(g, qx, cb - qh, qw * 2 + 2, qw * 3.2, '#6a90d8', '#4a6ab8');
      R(g, qx - 0.25, cb - qh - qw * 3.2 - 2, HP, 2, '#ffd040');
      R(g, qx - 0.5, cb - qh + 3, 1, 1.5, '#ffe8a0');
    });
  };
  // the parts of France that move: the windmill, the bakery's chimney, pigeons round the tower, the carousel, fireworks
  var drawIsles3 = function (ctx, st, t) {
    var p, k, i;
    p = node(21);
    for (k = 0; k < 4; k++) { var a = t * 0.025 + k * Math.PI / 2; for (var r = 0; r < 9; r += HP) R(ctx, p.x + 16.5 + Math.cos(a) * r, p.y - 24 + Math.sin(a) * r, HP * 2, HP * 2, r > 3 ? '#fff6e6' : '#a8744c'); }
    p = node(23);
    for (k = 0; k < 4; k++) { var ph = ((t * 0.5 + k * 22) % 88) / 88; ctx.globalAlpha = 0.55 * (1 - ph); disc(ctx, p.x + 23 + Math.sin(ph * 4) * 2 + ph * 5, p.y - 24 - ph * 18, 1.6 + ph * 2.6, '#f4f0f0'); }
    ctx.globalAlpha = 1;
    p = node(27);
    for (i = 0; i < 3; i++) { var pa = t * 0.03 + i * 2.1, bx = p.x + 16 + Math.cos(pa) * 14, by = p.y - 34 + Math.sin(pa) * 5, fl = Math.floor(t / 8 + i) % 2; R(ctx, bx - 2, by - (fl ? 1 : 0), 2, HP, '#4a4a58'); R(ctx, bx, by, HP, HP, '#4a4a58'); R(ctx, bx + 0.5, by - (fl ? 1 : 0), 2, HP, '#4a4a58'); }
    p = node(28);
    for (k = 0; k < 6; k++) { var ca = t * 0.04 + k * Math.PI / 3, hx = p.x - 18 + Math.cos(ca) * 8, hy = p.y - 14 + Math.sin(ca) * 2.2; if (Math.sin(ca) < -0.2) continue; R(ctx, hx - 0.25, hy - 4, HP, 4, '#ffd040'); disc(ctx, hx, hy - 1.5 + Math.sin(t * 0.1 + k) * 0.8, 1.4, ['#ffffff', '#ffd0e8', '#d0e8ff'][k % 3]); }
    // the balloon seller's bunch, bobbing
    [['#ff5a6a', -2], ['#4aa8ff', 0], ['#ffd84a', 2]].forEach(function (b, j) { var bx2 = p.x + 14 + b[1], by2 = p.y - 24 + Math.sin(t * 0.05 + j) * 1.2; R(ctx, p.x + 14, by2 + 2, HP, 10, '#5a4a5a'); disc(ctx, bx2, by2, 2, b[0]); });
    // fireworks over the castle
    p = node(29);
    if (!st.reduce) for (i = 0; i < 2; i++) {
      var fp = ((t + i * 70) % 140) / 140, fx2 = p.x - 10 + i * 22, fy2 = p.y - 46 - i * 4;
      if (fp < 0.25) R(ctx, fx2 - 0.25, fy2 + 18 - fp * 72, HP, 2, '#fff0b0');
      else if (fp < 0.75) { var rr = (fp - 0.25) * 22; ctx.globalAlpha = 1 - (fp - 0.25) * 1.8; for (k = 0; k < 10; k++) { var fa = k * Math.PI / 5; R(ctx, fx2 + Math.cos(fa) * rr - 0.5, fy2 + Math.sin(fa) * rr - 0.5, 1, 1, ['#ffe048', '#ff94cc', '#78d8ff'][(i + k) % 3]); } ctx.globalAlpha = 1; }
    }
  };

  /* The holiday coast: O'Gliss Park's slides, the surf beach at Hossegor,
     the cycle paths through the pines, Puy du Fou's castle, and Saint-Malo
     inside its walls, the ferry home waiting at the quay. */
  var isles4 = function (g, rnd) {
    var p, i, k, x, y;
    // 31 · the waterpark: a slide tower, twisting tubes, a pool
    p = node(30);
    oval(g, p.x + 14, p.y + 14, 11, 5, '#ffffff'); oval(g, p.x + 14, p.y + 14, 10, 4.2, '#4ac8f0'); oval(g, p.x + 15, p.y + 15, 7, 2.6, '#2aa8e0');
    R(g, p.x - 24, p.y - 32, 7, 30, '#f4f0e0'); R(g, p.x - 24, p.y - 32, 2, 30, '#ffffff'); R(g, p.x - 26, p.y - 34, 11, 3, '#e8504a');
    [['#ffc830', 0], ['#ff7ac0', 1], ['#4aa8ff', 2]].forEach(function (c, j) {
      for (k = 0; k <= 1; k += 0.02) { var tx = p.x - 18 + k * (30 + j * 4), ty = p.y - 30 + j * 4 + k * 36 + Math.sin(k * Math.PI * 2 + j) * 5; disc(g, tx, ty + 0.6, 1.8, mix(c[0], '#000000', 0.25)); disc(g, tx, ty, 1.6, c[0]); }
    });
    [[16, -18], [26, -10]].forEach(function (q) { var px = p.x + q[0], py = p.y + q[1]; for (k = 0; k < 9; k += HP) R(g, px + Math.sin(k * 0.25) * 1.5, py - k, 1.3, HP, '#a8744c'); for (var f = 0; f < 5; f++) { var a = -Math.PI / 2 + (f - 2) * 0.75; for (var t2 = 0; t2 < 6; t2 += HP) R(g, px + Math.cos(a) * t2, py - 9 + Math.sin(a) * t2 + t2 * t2 * 0.06, 1, HP * 2, f % 2 ? '#3ea84a' : '#62c850'); } });
    // 32 · the surf beach: striped beach huts, boards in the sand, the lifeguard's chair
    p = node(31);
    [[-24, '#e8504a'], [-15, '#3a8ad8'], [-6, '#ffc830']].forEach(function (q) { var hx = p.x + q[0], hy = p.y - 14; R(g, hx - 3.5, hy - 7, 7, 7, '#ffffff'); for (k = 0; k < 7; k += 2) R(g, hx - 3.5 + k, hy - 7, 1, 7, q[1]); for (var r = 0; r < 3; r += HP) R(g, hx - 4.5 + r, hy - 7 - r, 9 - r * 2, HP, '#7a5a3a'); });
    [[10, '#ff7a3a'], [13, '#3ac8a8'], [16, '#ffe048']].forEach(function (q) { R(g, p.x + q[0], p.y - 22, 2, 9, q[1]); R(g, p.x + q[0], p.y - 22, 2, 1, '#ffffff'); });
    R(g, p.x + 22, p.y - 24, 1, 12, '#c8a070'); R(g, p.x + 27, p.y - 24, 1, 12, '#c8a070'); R(g, p.x + 21, p.y - 26, 8, 3, '#e8504a'); R(g, p.x + 22, p.y - 18, 6, 1, '#c8a070');
    // 33 · the cycle paths: umbrella pines and a path winding through them
    p = node(32);
    for (k = -30; k < 30; k += 1.5) R(g, p.x + k, p.y + 8 + Math.sin(k * 0.12) * 4, 1, 1, '#f0e6c8');
    [[-24, -14], [-10, -22], [6, -18], [20, -24], [-18, 18], [14, 20]].forEach(function (q) {
      var tx = p.x + q[0], ty = p.y + q[1];
      R(g, tx - 0.5, ty - 8, 1.2, 8, '#8a5a3a');
      oval(g, tx + 0.6, ty - 9.4, 6.5, 2.4, '#1e5a2c'); oval(g, tx, ty - 10, 6.2, 2.2, '#3a8a3e'); oval(g, tx - 1.5, ty - 10.8, 3, 1, '#6ab858');
    });
    // 34 · Puy du Fou: the castle on its hill, banners, and the lake with the longship
    p = node(33);
    ball(g, p.x + 4, p.y - 6, 16, ['#5a9a44', '#78b85a', '#a8d880']);
    R(g, p.x - 8, p.y - 30, 24, 14, '#c8c0b0'); R(g, p.x - 8, p.y - 30, 24, 1, '#e8e0d0');
    [[-10, 22], [14, 22], [2, 28]].forEach(function (q) { var qx = p.x + q[0], qh = q[1]; R(g, qx - 3, p.y - 16 - qh + 10, 6, qh - 10, '#b8b0a0'); R(g, qx - 3, p.y - 16 - qh + 10, 1.5, qh - 10, '#d8d0c0'); tri(g, qx, p.y - 16 - qh + 10, 8, 6, '#c0503a', '#983828'); R(g, qx - 0.25, p.y - 16 - qh + 2, HP, 3, '#4a3a3a'); R(g, qx + 0.25, p.y - 16 - qh + 2, 3, 1.5, ['#3a8ad8', '#ffc830', '#e8504a'][Math.floor(rnd() * 3)]); });
    oval(g, p.x - 2, p.y - 20, 3, 4, '#3a3428'); R(g, p.x - 5, p.y - 20, 6, 4, '#3a3428');
    oval(g, p.x - 22, p.y + 16, 10, 4, '#5ab8e0'); oval(g, p.x - 22, p.y + 16.5, 8, 3, '#3a98c8');
    // 35 · Saint-Malo: the walls, the grey roofs inside and the spire; the fort on its rock
    p = node(34);
    R(g, p.x - 26, p.y - 26, 34, 14, '#a8a49c'); R(g, p.x - 26, p.y - 26, 34, 1.5, '#d8d4cc');
    for (k = 0; k < 34; k += 3) R(g, p.x - 26 + k, p.y - 28, 2, 2, '#a8a49c');
    [[-22, 7], [-14, 9], [-6, 8], [2, 7]].forEach(function (q) { var hx = p.x + q[0], hh = q[1]; R(g, hx - 3, p.y - 26 - hh, 7, hh, '#d8d0c4'); tri(g, hx + 0.5, p.y - 26 - hh, 8, 4, '#6a7084', '#4a5064'); R(g, hx - 1.5, p.y - 24 - hh, 1, 1.5, '#4a6a96'); R(g, hx + 1.5, p.y - 24 - hh, 1, 1.5, '#4a6a96'); });
    R(g, p.x - 11, p.y - 44, 3, 10, '#c8c0b0'); tri(g, p.x - 9.5, p.y - 44, 4, 8, '#6a7084', '#4a5064');
    ball(g, p.x + 22, p.y + 24, 5, ['#7a766e', '#a8a49c', '#d0ccc4']); R(g, p.x + 19, p.y + 15, 6, 5, '#a8a49c'); R(g, p.x + 19, p.y + 15, 6, 1, '#d0ccc4');
  };
  // the holiday coast's moving parts: a wave rolling in, the slides' splash, the ferry's smoke, banners
  var drawIsles4 = function (ctx, st, t) {
    var p, k;
    // the bridge over from France: a long deck on piers, cables to two tall pylons
    var x0b = 2150, x1b = 2296;
    for (var bx = x0b; bx < x1b; bx += 1) { var by = routeY(bx); R(ctx, bx, by + 2, 1, 2, '#e8e8f0'); R(ctx, bx, by + 4, 1, 1, '#9aa0b0'); }
    for (bx = x0b + 10; bx < x1b; bx += 16) { var py2 = routeY(bx); R(ctx, bx, py2 + 5, 1.5, 22, '#c8c8d4'); }
    [2196, 2250].forEach(function (px) { var py3 = routeY(px); R(ctx, px - 1, py3 - 22, 2.5, 26, '#f4f4fa'); for (k = -20; k <= 20; k += 5) for (var c = 0; c <= 1; c += 0.05) R(ctx, px + k * c, py3 - 20 + 21 * c, 0.5, 0.5, '#c8c8d8'); });
    // waves rolling in on the surf beach
    p = node(31);
    for (k = 0; k < 3; k++) { var wp = ((t * 0.4 + k * 30) % 90) / 90, wx = p.x - 30 + k * 20 + wp * 6, wy = 24 + wp * 10; ctx.globalAlpha = 1 - wp * 0.8; for (var j = 0; j < 12; j++) R(ctx, wx + j, wy - Math.sin(j / 12 * Math.PI) * 2, 1, 1, '#ffffff'); ctx.globalAlpha = 1; }
    // a splash at the foot of the slides
    p = node(30);
    if (!st.reduce && t % 50 < 18) for (k = 0; k < 5; k++) R(ctx, p.x + 8 + k * 2, p.y + 8 - Math.sin((t % 50) / 18 * Math.PI) * (3 + k % 3), 1, 1, '#ffffff');
    // the longship on Puy du Fou's lake, rocking
    p = node(33);
    var lx = p.x - 22, ly = p.y + 14 + Math.sin(t * 0.05) * 0.6;
    R(ctx, lx - 6, ly, 12, 2, '#8a5a30'); R(ctx, lx - 7, ly - 2, 2, 2, '#8a5a30'); R(ctx, lx + 5, ly - 2, 2, 2, '#8a5a30');
    R(ctx, lx - 0.25, ly - 8, HP, 8, '#5a3a20'); R(ctx, lx - 3, ly - 7, 6, 4, '#e8e0d0'); R(ctx, lx - 3, ly - 6, 6, 1, '#e8504a'); R(ctx, lx - 3, ly - 4, 6, 1, '#e8504a');
    // the ferry at Saint-Malo's quay, smoke rising — the way home
    p = node(34);
    var fx = p.x + 8, fy = coastBot(fx) + 6;
    for (k = 0; k < 4; k += HP) { var fw = 13 - k * 0.5; R(ctx, fx - fw, fy + k, fw * 2, HP, k < 1 ? '#ffffff' : k < 2 ? '#3a6ad8' : '#f4f4f8'); }
    R(ctx, fx - 9, fy - 5, 12, 5, '#ffffff'); R(ctx, fx - 8, fy - 3.5, 10, 1, '#5a7aa8'); R(ctx, fx + 4, fy - 8, 3, 8, '#e8504a');
    if (!st.reduce) for (k = 0; k < 3; k++) { var sp = ((t * 0.4 + k * 18) % 54) / 54; ctx.globalAlpha = 0.6 * (1 - sp); disc(ctx, fx + 5.5 + sp * 6, fy - 10 - sp * 10, 1.2 + sp * 2, '#f0f0f4'); } ctx.globalAlpha = 1;
  };

  var island = null, island2 = null, island3 = null, island4 = null, cloudC = null;
  // the path between two levels, as a list of dots
  var dots = function (i) {
    var a = node(i), b = node(i + 1), out = [], n = Math.round((b.x - a.x) / 8);
    for (var k = 1; k < n; k++) { var t = k / n; out.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t + Math.sin(t * Math.PI) * -4]); }
    return out;
  };
  var medal = function (g, x, y, i, st, t) {
    var w = WORLD[i], open = i < st.unlocked, done = st.cleared.indexOf(i + 1) > -1, here = i + 1 === st.at;
    // two digits need the room, and each land's last level is the big one
    var e = i === 19 || i === 29 ? 1.8 : i >= 9 ? 1.2 : 0;
    if (here && !st.reduce) { var pr = 8 + e + Math.sin(t * 0.12) * 1.2; disc(g, x, y, pr, 'rgba(255,255,255,0.35)'); }
    disc(g, x, y + 1, 6.6 + e, 'rgba(20,10,40,0.35)');
    disc(g, x, y, 6.4 + e, '#1c1428');
    disc(g, x, y, 5.8 + e, done ? '#e8a820' : open ? '#c8cce0' : '#7a7690');
    disc(g, x, y, 4.6 + e, open ? w.col : '#4a4660');
    disc(g, x - 1.4, y - 1.6, 1.6, 'rgba(255,255,255,0.5)');
    if (open) {
      var o = { color: '#ffffff', shadow: '#1c1428' };
      // two digits set tight so they sit inside the disc: the font's 1 has
      // a blank column either side, the other digits fill all five
      if (i + 1 >= 10) {
        var ds = String(i + 1), w0 = ds[0] === '1' ? 3 : 5, w1 = ds[1] === '1' ? 3 : 5, sx = snap(x - (w0 + 1 + w1) / 2);
        BB.text(g, ds[0], sx - (ds[0] === '1' ? 1 : 0), y - 3, o); BB.text(g, ds[1], sx + w0 + 1 - (ds[1] === '1' ? 1 : 0), y - 3, o);
      }
      else BB.text(g, String(i + 1), x + 0.5, y - 3, { color: '#ffffff', align: 'center', shadow: '#1c1428' });
    }
    else { R(g, x - 2, y - 1, 4, 3.5, '#c8cce0'); R(g, x - 1.5, y - 3.5, 0.5, 2.5, '#c8cce0'); R(g, x + 1, y - 3.5, 0.5, 2.5, '#c8cce0'); R(g, x - 1.5, y - 3.5, 3, 0.5, '#c8cce0'); }
    if (done) BB.draw(g, A.starSmall, x - 3.5, y - 12 - e);
  };

  BB.Map = {
    // the map's width: the second island is there once the first land is won
    widthFor: function (won, won2, won3) { return won3 ? MW4 : won2 ? MW3 : won ? MW2 : ISLE[0][1]; },
    node: node,
    draw: function (ctx, st) {
      var W = BB.W, t = st.reduce ? 0 : st.t, cx = st.camX, i, k, p, lands = st.won3 ? 4 : st.won2 ? 3 : st.won ? 2 : 1, MW = ISLE[lands - 1][1], NN = [10, 20, 30, 35][lands - 1];
      if (!island) island = build(0);
      if (st.won && !island2) island2 = build(1);
      if (st.won2 && !island3) island3 = build(2);
      if (st.won3 && !island4) island4 = build(3);
      ctx.save();
      ctx.translate(-snap(cx), 0);
      BB.blit(ctx, island, 0, 0);
      if (island2) BB.blit(ctx, island2, SPLIT, 0);
      if (island3) BB.blit(ctx, island3, SPLIT2, 0);
      if (island4) BB.blit(ctx, island4, SPLIT3, 0);
      // glints on the sea
      for (i = 0; i < 40 * lands; i++) { var gx = (i * 53 + t * 0.2) % MW, gy = (i * 37) % H; if ((gx < 654 || gx > 756) && (gx < 1414 || gx > 1516) && (gx < 2174 || gx > 2276) && gy > coastTop(gx) - 4 && gy < coastBot(gx) + 4) continue; if ((t + i * 13) % 90 < 50) R(ctx, gx, gy, 2, HP, 'rgba(255,255,255,0.55)'); }
      // the boat sails along the south shore
      var bx = 30 + ((t * 0.12) % 590), by = 134;
      R(ctx, bx - 4, by, 9, 2, '#a8744c'); for (k = 0; k < 6; k += HP) R(ctx, bx, by - 6 + k, k * 0.6, HP, '#ffffff'); R(ctx, bx, by - 7, HP, 7, '#6a4a3a');
      // the windmill's sails
      p = node(0);
      for (k = 0; k < 4; k++) { var a = t * 0.03 + k * Math.PI / 2; for (var r = 0; r < 7; r += HP) R(ctx, p.x + 15 + Math.cos(a) * r, p.y - 16 + Math.sin(a) * r, HP * 2, HP * 2, '#fff6e6'); }
      // the big wheel in the park
      p = node(1);
      var wx = p.x + 22, wy = p.y + 4;
      for (k = 0; k < 6; k++) { var a2 = t * 0.02 + k * Math.PI / 3; for (var r2 = 0; r2 < 9; r2 += HP) R(ctx, wx + Math.cos(a2) * r2, wy + Math.sin(a2) * r2, HP, HP, '#c8b8e8'); disc(ctx, wx + Math.cos(a2) * 9, wy + Math.sin(a2) * 9, 1.4, ['#ef5a5a', '#5aa8ff', '#ffd84a'][k % 3]); }
      R(ctx, wx - 0.5, wy, 1, 11, '#8a7ab0');
      // the lighthouse beam
      p = node(2);
      var la = Math.sin(t * 0.03) * 1.2 - Math.PI / 2;
      ctx.globalAlpha = 0.25;
      for (var r3 = 3; r3 < 26; r3 += HP) { var spread = r3 * 0.18; R(ctx, p.x + 4 + Math.cos(la) * r3 - spread / 2, coastBot(p.x + 4) - 22 + Math.sin(la) * r3 * 0.5, spread, HP, '#fff6c0'); }
      ctx.globalAlpha = 1;
      // a fish leaps in the lagoon
      var L = LAGOON(), ft = (t % 160) / 40;
      if (ft < 1) { var fx2 = L.x - 8 + ft * 16, fy2 = L.y - Math.sin(ft * Math.PI) * 9; disc(ctx, fx2, fy2, 1.6, '#ff9a40'); R(ctx, fx2 - 2.5, fy2 - 0.5, 1.2, 1, '#ff9a40'); }
      else if (ft < 1.25) R(ctx, L.x + 8, L.y, 3, HP, '#ffffff');
      // toadstools glowing under the woods
      p = node(4);
      [[-20, 14], [-6, -6], [12, 16], [22, -4]].forEach(function (q, j) {
        var gl = 0.35 + Math.sin(t * 0.06 + j) * 0.15;
        ctx.globalAlpha = gl; disc(ctx, p.x + q[0], p.y + q[1], 4.5, j % 2 ? '#7ae8ff' : '#ff8ad8'); ctx.globalAlpha = 1;
        R(ctx, p.x + q[0] - 0.5, p.y + q[1], 1, 2, '#f0e8ff'); oval(ctx, p.x + q[0], p.y + q[1], 2, 1.2, j % 2 ? '#7ae8ff' : '#ff8ad8');
      });
      // crystals twinkling at the cave mouth
      p = node(5);
      [[-14, 8, '#7ae8ff'], [12, 7, '#ff9ae6'], [-22, 12, '#ff9ae6'], [20, 12, '#7ae8ff']].forEach(function (q, j) {
        var cxx = p.x + q[0], cyy = p.y + q[1];
        for (var y2 = 0; y2 < 6; y2 += HP) R(ctx, cxx - (y2 / 6) * 1.6, cyy - 6 + y2, (y2 / 6) * 3.2, HP, q[2]);
        if ((t + j * 20) % 80 < 10) { R(ctx, cxx - 0.25, cyy - 9, HP, 3, '#ffffff'); R(ctx, cxx - 1.5, cyy - 7.75, 3, HP, '#ffffff'); }
      });
      // snow on the peaks
      p = node(6);
      for (i = 0; i < 16; i++) { var sx = p.x - 30 + ((i * 17 + t * 0.15) % 60), sy = p.y - 34 + ((i * 23 + t * 0.4) % 64); R(ctx, sx, sy, HP * 2, HP * 2, '#ffffff'); }
      // smoke from the factory's chimneys, and its gear turning
      p = node(8);
      [[-18, -36], [-6, -34]].forEach(function (q, j) {
        for (k = 0; k < 4; k++) { var ph = ((t * 0.5 + k * 22 + j * 11) % 88) / 88; ctx.globalAlpha = 0.6 * (1 - ph); disc(ctx, p.x + q[0] + Math.sin(ph * 4 + j) * 2 + ph * 6, p.y + q[1] - ph * 22, 1.8 + ph * 3, '#e8e8f0'); }
      });
      ctx.globalAlpha = 1;
      var gx2 = p.x + 14, gy2 = p.y - 2, ga = t * 0.04;
      for (k = 0; k < 8; k++) { var aa2 = ga + k * Math.PI / 4; disc(ctx, gx2 + Math.cos(aa2) * 5, gy2 + Math.sin(aa2) * 5, 1.4, '#c8a050'); }
      disc(ctx, gx2, gy2, 4.4, '#d8b060'); disc(ctx, gx2, gy2, 1.6, '#8a6a30');
      // the castle: its flag, the lava glowing, and Monsty in his cage (or free)
      p = node(9);
      var fx3 = p.x + 1, fy3 = p.y - 52;
      R(ctx, fx3 - 0.5, fy3, 1, 12, '#4a3a4a');
      for (k = 0; k < 8; k += HP) R(ctx, fx3 + k, fy3 + 1 + Math.sin(t * 0.12 + k * 0.6) * 1, HP, 4, k < 1 ? '#a42032' : '#ef4a5a');
      // the lava's glow: a soft warm light, breathing, rather than a flat disc
      var lg = ctx.createRadialGradient(p.x, p.y + 8, 2, p.x, p.y + 8, 26);
      lg.addColorStop(0, 'rgba(255,120,50,' + (0.42 + Math.sin(t * 0.08) * 0.12) + ')'); lg.addColorStop(1, 'rgba(255,90,40,0)');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg; ctx.fillRect(p.x - 26, p.y - 18, 52, 52); ctx.restore();
      // Monsty in his cage, hung from the east tower on a chain so he sits
      // below the level banner at every width; once he's free, he bounces
      // on the battlements instead
      if (st.won) {
        BB.draw(ctx, A.monsty, p.x + 9, p.y - 34 - A.monsty.h - Math.abs(Math.sin(t * 0.1)) * 4);
      } else {
        var sw = st.reduce ? 0 : Math.sin(t * 0.04) * 1.2, ax = p.x + 30, ay = p.y - 30;
        R(ctx, p.x + 17, ay - 1, 15, 1.5, '#4a3a4a'); R(ctx, p.x + 17, ay + 0.5, 3, 3, '#4a3a4a');
        for (k = 0; k < 5; k += 1.5) R(ctx, ax - 0.5 + sw * k / 5, ay + k, 1, 1, k % 3 ? '#7a6a7a' : '#9098b0');
        var cgx = ax - A.cage.w / 2 + sw, cgy = ay + 5;
        BB.draw(ctx, A.monsty, cgx + 2, cgy + 3);
        BB.draw(ctx, A.cage, cgx, cgy);
      }
      if (island2 && cx + W > SPLIT && cx < SPLIT2) drawIsles2(ctx, st, t);
      if (island3 && cx + W > SPLIT2 && cx < SPLIT3) drawIsles3(ctx, st, t);
      if (island4 && cx + W > SPLIT3 - 90) drawIsles4(ctx, st, t);
      // the path: bright where you've been, faint where you haven't; over
      // the water between the islands it's the boat's wake, dashes of foam
      for (i = 0; i < NN - 1; i++) {
        var open = i + 1 < st.unlocked, ds = dots(i), sea = i === 9 || i === 19, s0 = i === 9 ? 646 : 1406, s1 = i === 9 ? 766 : 1526;
        ds.forEach(function (d, j) {
          if (sea && d[0] > s0 && d[0] < s1) { if (open && (j + Math.floor(t / 20)) % 3) R(ctx, d[0] - 1.5, d[1], 3, 1, 'rgba(255,255,255,0.75)'); else if (!open && j % 2 === 0) R(ctx, d[0] - 1, d[1], 2, HP, 'rgba(255,255,255,0.4)'); return; }
          if (open) { disc(ctx, d[0], d[1] + 0.5, 1.3, 'rgba(30,20,60,0.4)'); disc(ctx, d[0], d[1], 1.1, '#fff6dc'); }
          else if (j % 2 === 0) disc(ctx, d[0], d[1], 0.7, 'rgba(255,255,255,0.35)');
        });
      }
      // the medallions
      for (i = 0; i < NN; i++) { p = node(i); medal(ctx, p.x, p.y, i, st, t); }
      // clouds drifting over, with their shadows on the land
      if (!cloudC) cloudC = BB.surface(40, 24);
      var cl = cloudC.getContext('2d');
      for (i = 0; i < [5, 9, 13, 16][lands - 1]; i++) {
        var cx2 = ((i * 160 + t * 0.08 * (1 + i * 0.2)) % (MW + 80)) - 40, cy2 = 18 + (i * 29) % 40;
        ctx.globalAlpha = 0.16; oval(ctx, cx2 + 6, cy2 + 30, 14, 4, '#1c1030'); ctx.globalAlpha = 1;
        // drawn on their own layer and laid down see-through, so a cloud
        // passing over Monsty or a medallion never hides it
        cl.clearRect(0, 0, 40, 24);
        [[0, 0, 6], [7, -3, 7], [15, 0, 6], [7, 2, 6]].forEach(function (q) { disc(cl, 10 + q[0], 12 + q[1] + 1.2, q[2], '#d0e4ff'); });
        [[0, 0, 6], [7, -3, 7], [15, 0, 6], [7, 2, 6]].forEach(function (q) { disc(cl, 10 + q[0], 12 + q[1], q[2] * 0.92, '#ffffff'); });
        ctx.globalAlpha = 0.78; BB.blit(ctx, cloudC, cx2 - 10, cy2 - 12); ctx.globalAlpha = 1;
      }
      // birds
      for (i = 0; i < lands * 3; i++) {
        var bx2 = (i * 210 + t * 0.35) % (MW + 40) - 20, by2 = 30 + i * 22 + Math.sin(t * 0.03 + i) * 6, fl = Math.floor(t / 8 + i) % 2;
        R(ctx, bx2 - 2, by2 - (fl ? 1 : 0), 2, HP, '#2a2440'); R(ctx, bx2, by2, HP, HP, '#2a2440'); R(ctx, bx2 + 0.5, by2 - (fl ? 1 : 0), 2, HP, '#2a2440');
      }
      // Bonnie
      var BS = st.set || A.bonnie.s, bp = st.bonnie, f = st.walking ? BS[['run1', 'run2', 'run3', 'run2'][Math.floor(t / 6) % 4]] : BS.idle;
      var hop = !st.walking && !st.reduce ? -Math.abs(Math.sin(t * 0.06)) * 1.5 : 0;
      var stand = st.walking ? 0 : -5;
      var hat = function (fr, x, y, flip) { if (st.hat && BB.drawHat) BB.drawHat(ctx, st.hat, x, y, fr.w, fr.h, fr, flip); };
      var Fam = A.family || {}, ys = Fam.yetiSmall;
      if (bp.x > 1408 && bp.x < 1516) {
        // over to France on the ferry, the Yeti on its deck
        var fr2 = st.reduce ? 0 : Math.sin(t * 0.08) * 0.6, fx3 = bp.x, fy3 = bp.y + 2 + fr2;
        for (k = 0; k < 5; k += HP) { var fw3 = 15 - k * 0.6; R(ctx, fx3 - fw3, fy3 + k, fw3 * 2, HP, k < 1 ? '#ffffff' : k < 2 ? '#3a6ad8' : k < 4.5 ? '#f4f4f8' : '#9aa0b0'); }
        R(ctx, fx3 + st.facing * -9 - 2, fy3 - 7, 4, 7, '#e8504a'); R(ctx, fx3 + st.facing * -9 - 2, fy3 - 7, 4, 1.5, '#2a2a38');
        if (!st.reduce) for (k = 0; k < 3; k++) { var sp2 = ((t * 0.4 + k * 18) % 54) / 54; ctx.globalAlpha = 0.6 * (1 - sp2); disc(ctx, fx3 + st.facing * -9 - st.facing * sp2 * 8, fy3 - 9 - sp2 * 10, 1.2 + sp2 * 2, '#f0f0f4'); } ctx.globalAlpha = 1;
        if (ys) BB.draw(ctx, ys[Math.floor(t / 6) % ys.length], fx3 - ys[0].w / 2 + st.facing * 3, fy3 - ys[0].h, st.facing < 0);
        if (st.walking) for (k = 0; k < 3; k++) R(ctx, fx3 - st.facing * (17 + k * 3), fy3 + 4, 2, HP, 'rgba(255,255,255,0.7)');
        ctx.restore();
        return;
      }
      if (bp.x >= 1516 && ys) {
        // in France the family drives: the Yeti between the medallions, and parked beside Bonnie at one
        if (st.walking) {
          var yf = ys[Math.floor(t / 4) % ys.length];
          shadow(ctx, bp.x, bp.y + 0.5, 8);
          BB.draw(ctx, yf, bp.x - yf.w / 2, bp.y - yf.h + (st.reduce ? 0 : (Math.floor(t / 6) % 2) * -0.5), st.facing < 0);
          ctx.restore();
          return;
        }
        shadow(ctx, bp.x - 12, bp.y - 4.5, 8);
        BB.draw(ctx, ys[0], bp.x - 12 - ys[0].w / 2, bp.y - 5 - ys[0].h, false);
      }
      if (bp.x > 648 && bp.x < 746) {
        // crossing the water: Bonnie sails, in a little boat of his own
        var rk = st.reduce ? 0 : Math.sin(t * 0.12) * 0.8, s2 = BS.idle, mx = bp.x - st.facing * 3;
        // the sail behind him, then Bonnie, then the hull in front
        R(ctx, mx - 0.25, bp.y - 13 + rk, HP, 13, '#6a4a3a');
        for (k = 0; k < 10; k += HP) R(ctx, st.facing > 0 ? mx - 0.25 - k * 0.75 : mx + 0.25, bp.y - 13 + rk + k, k * 0.75, HP, '#fff8ea');
        BB.draw(ctx, s2, bp.x - s2.w / 2, bp.y - s2.h + 2 + rk, st.facing < 0, st.power === 2 ? A.bonnie.red : st.v);
        hat(s2, bp.x - s2.w / 2, bp.y - s2.h + 2 + rk, st.facing < 0);
        for (k = 0; k < 4; k += HP) { var hw3 = 8 - k * 0.8; R(ctx, bp.x - hw3, bp.y + rk + k, hw3 * 2, HP, k < 1 ? '#e8b880' : k < 3 ? '#c06a3a' : '#7a4a28'); }
        if (st.walking) for (k = 0; k < 3; k++) R(ctx, bp.x - st.facing * (10 + k * 3), bp.y + 3 + rk, 2, HP, 'rgba(255,255,255,0.7)');
        ctx.restore();
        return;
      }
      shadow(ctx, bp.x, bp.y + 0.5 + stand, 5);
      BB.draw(ctx, f, bp.x - f.w / 2, bp.y - f.h + hop + stand, st.facing < 0, st.power === 2 ? A.bonnie.red : st.v);
      hat(f, bp.x - f.w / 2, bp.y - f.h + hop + stand, st.facing < 0);
      ctx.restore();
    }
  };
})();
