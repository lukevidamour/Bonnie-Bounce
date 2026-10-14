/* ==========================================================================
   map.js — Bonnie's island: the world map between levels.

   One long illustrated island in the sea, the ten worlds along it from
   the green hills to Grumble's castle, joined by a winding path. Each
   world has its landmark — and each landmark moves: the windmill turns,
   the big wheel turns, the lighthouse sweeps, fish leap in the lagoon,
   toadstools glow, crystals sparkle, snow falls, smoke rises from the
   factory, the castle flag flies and Monsty bounces in his cage. Clouds
   drift over with their shadows, boats sail, birds fly.

   The island is painted once into a surface at full density; everything
   that moves is drawn over it each frame. game.js owns the walking and
   the choosing; this file only draws.
   ========================================================================== */
(function () {
  'use strict';
  var H = BB.H, HP = 1 / BB.R, snap = BB.snap, mix = BB.mix, A = BB.ART;
  var N = 10, MW = 650;
  var node = function (i) { return { x: 44 + i * 62, y: 86 + Math.round(Math.sin(i * 1.2 + 0.4) * 15) }; };
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
    { land: '#5e3c4e', dark: '#3a2232', col: '#f24848' }
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
  var regionAt = function (x) { return Math.max(0, Math.min(N - 1, Math.round((x - 44) / 62))); };
  var LAGOON = function () { var p = node(3); return { x: p.x, y: p.y + 2, rx: 24, ry: 15 }; };

  var build = function () {
    var c = BB.surface(MW, H), g = c.getContext('2d'), rnd = BB.rng(2026), i, x, y, p;
    // the sea, deepening away from the shore
    for (y = 0; y < H; y += HP) R(g, 0, y, MW, HP, mix('#5cc4f2', '#2a78c4', y / H));
    for (i = 0; i < 160; i++) { x = rnd() * MW; y = rnd() * H; R(g, x, y, 2 + rnd() * 4, HP, 'rgba(255,255,255,0.18)'); }
    /* the island: a white line of surf, a sandy shore, then each world's
       own ground. The borders between worlds wander, so they read as
       landscape rather than lines; painted pixel by pixel. */
    var Rr = BB.R, iw = MW * Rr, ih = H * Rr, img = g.createImageData(iw, ih), d = img.data, rgb = BB.toRgb;
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
    var SANDY = { 2: 1, 3: 1 };
    /* which world a point belongs to: the borders wander, and within a
       couple of pixels of one the two grounds are dithered together, the
       way pixel artists blend, so the worlds run into each other */
    var regionXY = function (x, y, px, py) {
      var ri = regionAt(x);
      for (var j = Math.max(0, ri - 1); j <= Math.min(N - 2, ri); j++) {
        var bx = (node(j).x + node(j + 1).x) / 2 + Math.sin(y * 0.16 + j * 2) * 5 + Math.sin(y * 0.41 + j) * 2, dd = x - bx;
        if (Math.abs(dd) < 3) return (dd + 3) / 6 * 16 > BAYER[(py & 3) * 4 + (px & 3)] ? j + 1 : j;
        if (j === ri && dd > 0) return j + 1;
        if (j === ri - 1 && dd < 0) return j;
      }
      return ri;
    };
    for (var py = 0; py < ih; py++) for (var px = 0; px < iw; px++) {
      x = px / Rr; y = py / Rr;
      var edge = Math.min(1, Math.min(x - 4, MW - 4 - x) / 18), top = coastTop(x) + (1 - edge) * 30, bot = coastBot(x) - (1 - edge) * 30;
      if (bot <= top) continue;
      // shallow water, paler near the shore
      var off = y < top ? top - y : y > bot ? y - bot : 0;
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
      x = 8 + rnd() * (MW - 16); y = coastTop(x) + 5 + rnd() * (coastBot(x) - coastTop(x) - 14);
      var w3 = regionAt(x), wd = WORLD[w3], r3 = rnd();
      if (w3 <= 1 || w3 === 4) {
        var tuft = mix(wd.dark, '#1a3010', w3 === 4 ? 0.1 : 0.2);
        R(g, x, y, HP, 1, tuft); R(g, x - HP, y + HP, HP, HP, tuft); R(g, x + HP, y + HP, HP, HP, tuft);
        if (r3 < 0.18) { R(g, x + 2, y, 1, 1, ['#ffffff', '#ffe060', '#ff8ab0', '#b8a0ff'][Math.floor(rnd() * 4)]); }
      } else if (w3 === 2 || w3 === 3) {
        if (r3 < 0.5) R(g, x, y, 3, HP, mix(wd.dark, wd.land, 0.4));
      } else if (w3 === 6 || w3 === 7) {
        if (r3 < 0.3) R(g, x, y, HP, HP, '#ffffff'); else R(g, x, y, 2, HP, mix(wd.dark, wd.land, 0.5));
      } else if (w3 === 9) {
        if (r3 < 0.25) R(g, x, y, 2, HP, '#ff7a2a'); else R(g, x, y, 1.5, 1, mix(wd.dark, '#000000', 0.2));
      } else {
        R(g, x, y, 1.5, 1, mix(wd.dark, '#000000', 0.1)); R(g, x, y, 1, HP, mix(wd.land, '#ffffff', 0.25));
      }
    }
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

  var island = null, cloudC = null;
  // the path between two levels, as a list of dots
  var dots = function (i) {
    var a = node(i), b = node(i + 1), out = [], n = 8;
    for (var k = 1; k < n; k++) { var t = k / n; out.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t + Math.sin(t * Math.PI) * -4]); }
    return out;
  };
  var medal = function (g, x, y, i, st, t) {
    var w = WORLD[i], open = i < st.unlocked, done = st.cleared.indexOf(i + 1) > -1, here = i + 1 === st.at;
    // the castle's medallion is a size up: it's the big one, and "10" needs the room
    var e = i === N - 1 ? 1.2 : 0;
    if (here && !st.reduce) { var pr = 8 + e + Math.sin(t * 0.12) * 1.2; disc(g, x, y, pr, 'rgba(255,255,255,0.35)'); }
    disc(g, x, y + 1, 6.6 + e, 'rgba(20,10,40,0.35)');
    disc(g, x, y, 6.4 + e, '#1c1428');
    disc(g, x, y, 5.8 + e, done ? '#e8a820' : open ? '#c8cce0' : '#7a7690');
    disc(g, x, y, 4.6 + e, open ? w.col : '#4a4660');
    disc(g, x - 1.4, y - 1.6, 1.6, 'rgba(255,255,255,0.5)');
    if (open) {
      var o = { color: '#ffffff', shadow: '#1c1428' };
      // the font's 1 has two blank columns: set "10" tight so it sits inside the disc
      if (i + 1 >= 10) { BB.text(g, '1', x - 5.5, y - 3, o); BB.text(g, '0', x - 0.5, y - 3, o); }
      else BB.text(g, String(i + 1), x + 0.5, y - 3, { color: '#ffffff', align: 'center', shadow: '#1c1428' });
    }
    else { R(g, x - 2, y - 1, 4, 3.5, '#c8cce0'); R(g, x - 1.5, y - 3.5, 0.5, 2.5, '#c8cce0'); R(g, x + 1, y - 3.5, 0.5, 2.5, '#c8cce0'); R(g, x - 1.5, y - 3.5, 3, 0.5, '#c8cce0'); }
    if (done) BB.draw(g, A.starSmall, x - 3.5, y - 12 - e);
  };

  BB.Map = {
    width: MW, node: node,
    draw: function (ctx, st) {
      var W = BB.W, t = st.reduce ? 0 : st.t, cx = st.camX, i, k, p;
      if (!island) island = build();
      ctx.save();
      ctx.translate(-snap(cx), 0);
      BB.blit(ctx, island, 0, 0);
      // glints on the sea
      for (i = 0; i < 40; i++) { var gx = (i * 53 + t * 0.2) % MW, gy = (i * 37) % H; if (gy > coastTop(gx) - 4 && gy < coastBot(gx) + 4) continue; if ((t + i * 13) % 90 < 50) R(ctx, gx, gy, 2, HP, 'rgba(255,255,255,0.55)'); }
      // the boat sails along the south shore
      var bx = 30 + ((t * 0.12) % (MW - 60)), by = 134;
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
      // the path: bright where you've been, faint where you haven't
      for (i = 0; i < N - 1; i++) {
        var open = i + 1 < st.unlocked, ds = dots(i);
        ds.forEach(function (d, j) {
          if (open) { disc(ctx, d[0], d[1] + 0.5, 1.3, 'rgba(30,20,60,0.4)'); disc(ctx, d[0], d[1], 1.1, '#fff6dc'); }
          else if (j % 2 === 0) disc(ctx, d[0], d[1], 0.7, 'rgba(255,255,255,0.35)');
        });
      }
      // the medallions
      for (i = 0; i < N; i++) { p = node(i); medal(ctx, p.x, p.y, i, st, t); }
      // clouds drifting over, with their shadows on the land
      if (!cloudC) cloudC = BB.surface(40, 24);
      var cl = cloudC.getContext('2d');
      for (i = 0; i < 5; i++) {
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
      for (i = 0; i < 3; i++) {
        var bx2 = (i * 210 + t * 0.35) % (MW + 40) - 20, by2 = 30 + i * 22 + Math.sin(t * 0.03 + i) * 6, fl = Math.floor(t / 8 + i) % 2;
        R(ctx, bx2 - 2, by2 - (fl ? 1 : 0), 2, HP, '#2a2440'); R(ctx, bx2, by2, HP, HP, '#2a2440'); R(ctx, bx2 + 0.5, by2 - (fl ? 1 : 0), 2, HP, '#2a2440');
      }
      // Bonnie
      var bp = st.bonnie, f = st.walking ? A.bonnie.s[['run1', 'run2', 'run3', 'run2'][Math.floor(t / 6) % 4]] : A.bonnie.s.idle;
      var hop = !st.walking && !st.reduce ? -Math.abs(Math.sin(t * 0.06)) * 1.5 : 0;
      var stand = st.walking ? 0 : -5;
      shadow(ctx, bp.x, bp.y + 0.5 + stand, 5);
      BB.draw(ctx, f, bp.x - f.w / 2, bp.y - f.h + hop + stand, st.facing < 0, st.power === 2 ? A.bonnie.red : st.v);
      ctx.restore();
    }
  };
})();
