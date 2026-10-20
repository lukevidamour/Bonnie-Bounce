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

   After France and the holiday coast, a paper aeroplane flies on from
   Saint-Malo to the fifth land, ONE DAY…: Bonnie's One Day List, drawn
   as he'd draw it — in crayon, on a sheet of paper floating on the sea.

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
  var N = 45, ISLE = [[0, 650], [760, 1410], [1520, 2170], [2280, 2640], [2750, 3400]], SPLIT = 705, SPLIT2 = 1465, SPLIT3 = 2225, SPLIT4 = 2695, MW2 = 1410, MW3 = 2170, MW4 = 2640, MW5 = 3400;
  var node = function (i) {
    if (i < 10) return { x: 44 + i * 62, y: 86 + Math.round(Math.sin(i * 1.2 + 0.4) * 15) };
    if (i < 20) return { x: 804 + (i - 10) * 62, y: 86 + Math.round(Math.sin((i - 10) * 1.1 + 2.2) * 15) };
    if (i < 30) return { x: 1564 + (i - 20) * 62, y: 86 + Math.round(Math.sin((i - 20) * 1.05 + 0.9) * 15) };
    if (i < 35) return { x: 2324 + (i - 30) * 62, y: 86 + Math.round(Math.sin((i - 30) * 1.2 + 1.5) * 15) };
    return { x: 2794 + (i - 35) * 62, y: 86 + Math.round(Math.sin((i - 35) * 1.15 + 0.3) * 15) };
  };
  // the boat route between the islands, as a gentle arc over the water
  // (the second crossing, to France, is the ferry's: from node 19 to 20;
  // the last, from Saint-Malo to the paper, the aeroplane's: 34 to 35)
  var routeY = function (x) { var i = x > 2572 ? 34 : x > 2140 ? 29 : x > 1000 ? 19 : 9, a = node(i), b = node(i + 1), t = (x - a.x) / (b.x - a.x); return a.y + (b.y - a.y) * t - Math.sin(t * Math.PI) * 4; };
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
    { land: '#c8c4bc', dark: '#8a867e', col: '#4a6a96' },
    // ONE DAY…, in crayon: the Pokémon meadow, Universal Studios, New York at
    // Christmas, Jamaica, Antarctica, Australia, on a rainbow, chocolate land,
    // dinosaur land, bee land
    { land: '#a8dc6c', dark: '#4e9a3c', col: '#e8443a' },
    { land: '#cbbcf2', dark: '#7660c0', col: '#3a6ae0' },
    { land: '#eef3fb', dark: '#7f92ba', col: '#f2b81e' },
    { land: '#64d2d4', dark: '#1f98a4', col: '#16aaa0' },
    { land: '#e2f4ff', dark: '#6aaad6', col: '#3aa8ec' },
    { land: '#f29450', dark: '#b4502a', col: '#e4602a' },
    { land: '#a8daff', dark: '#5a9ade', col: '#a858e4' },
    { land: '#9c603a', dark: '#5a3220', col: '#8a4a26' },
    { land: '#68b850', dark: '#2f7634', col: '#dc5a28' },
    { land: '#ffd448', dark: '#cc8e1a', col: '#eea416' }
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
    if (x < SPLIT4) return Math.max(30, Math.min(34, 30 + Math.round((x - 2324) / 62)));
    return Math.max(35, Math.min(44, 35 + Math.round((x - 2794) / 62)));
  };
  var LAGOON = function () { var p = node(3); return { x: p.x, y: p.y + 2, rx: 24, ry: 15 }; };

  var build = function (k) {
    var X0 = [0, SPLIT, SPLIT2, SPLIT3, SPLIT4][k], SW = [SPLIT, SPLIT2 - SPLIT, SPLIT3 - SPLIT2, SPLIT4 - SPLIT3, MW5 - SPLIT4][k], IA = ISLE[k][0], IB = ISLE[k][1];
    var c = BB.surface(SW, H), g = c.getContext('2d'), rnd = BB.rng(2026 + k), i, x, y, p;
    // painted in the map's own coordinates
    g.translate(-X0, 0);
    // the sea, deepening away from the shore
    for (y = 0; y < H; y += HP) R(g, X0, y, SW, HP, mix('#5cc4f2', '#2a78c4', y / H));
    // (the holiday coast's surface once ended at the map's edge; it now runs
    // on under the water to the paper's, and its own sea keeps the glints it
    // always had, with the new stretch given its own)
    var GW = k === 3 ? MW4 - SPLIT3 : SW;
    for (i = 0; i < 160; i++) { x = X0 + rnd() * GW; y = rnd() * H; R(g, x, y, 2 + rnd() * 4, HP, 'rgba(255,255,255,0.18)'); }
    if (k === 3) { var r4 = BB.rng(2035); for (i = 0; i < 22; i++) { x = MW4 + r4() * (SPLIT4 - MW4); y = r4() * H; R(g, x, y, 2 + r4() * 4, HP, 'rgba(255,255,255,0.18)'); } }
    // the fifth land isn't an island at all, but a sheet of paper
    if (k === 4) { paper5(g, X0, SW); return c; }
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

  /* ---- ONE DAY… ----------------------------------------------------------------------
     Bonnie's One Day List — the things he'd like to do one day — drawn the
     way he'd draw them: in crayon, on a sheet of paper floating on the sea.
     Each place is a patch of its own colour, coloured in not quite to the
     line (and now and then over it) and gone round with a wobbly one, and
     its landmark is drawn as a six-year-old draws it: a Poké Ball and
     Pikachu, the Universal globe and the castle on the hill, the Empire
     State and a Christmas tree, a palm and a waterfall, an iceberg and a
     penguin, a kangaroo and the Opera House, a rainbow with its pot of
     gold, a chocolate-bar mountain with a bite out of it, a volcano and its
     dinosaur, and Queen Bee's hive with her crown on top.

     The sheet and everything still on it are painted once, pixel by pixel,
     the way the islands are. What moves (the Poké Ball wobbling, the globe
     turning, the kangaroo, the penguin, the bee and the rest) are little
     crayon drawings of their own, painted once and moved each frame. His
     paper aeroplane is real paper, not crayon, so it's drawn clean and
     white: it carries him over from Saint-Malo and waits at the sheet's
     edge. */
  var PX0 = 2756, PX1 = 3392, EAR = 10;
  var pTop = function (x) { return 38.5 + Math.sin(x * 0.019) * 0.8 + Math.sin(x * 0.061 + 1) * 0.3; };
  var pBot = function (x) { return 125.5 + Math.sin(x * 0.015 + 2) * 0.9 + Math.sin(x * 0.053) * 0.3; };
  var pL = function (y) { return PX0 + (y - 82) * 0.025; }, pR = function (y) { return PX1 + (y - 82) * 0.02; };
  // how far inside the sheet a point is (below nothing outside it); its top
  // right corner is folded down, dog-eared
  var paperIn = function (x, y) {
    var ex = pR(y) - x, ey = y - pTop(x), dd = Math.min(x - pL(y), ex, ey, pBot(x) - y);
    return ex + ey < EAR ? Math.min(dd, (ex + ey - EAR) * 0.7071) : dd;
  };
  var h5 = function (a, b) { var q = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return q - Math.floor(q); };
  var n5 = function (x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    var a = h5(xi, yi), b = h5(xi + 1, yi), c = h5(xi, yi + 1), d = h5(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  var C5 = BB.toRgb;
  var shd = function (c, f) { return f > 0 ? [c[0] + (255 - c[0]) * f, c[1] + (255 - c[1]) * f, c[2] + (255 - c[2]) * f] : [c[0] * (1 + f), c[1] * (1 + f), c[2] * (1 + f)]; };
  var mx5 = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
  var PAPER = C5('#fcf4e2'), WH5 = [255, 255, 255], INK5 = C5('#2a2236');
  // a pixel into a painter's buffer, laid over what's already there
  var pset = function (P, px, py, c, a) {
    if (px < 0 || py < 0 || px >= P.iw || py >= P.ih) return;
    var k = (py * P.iw + px) * 4, d = P.d;
    if (a === undefined || a >= 1) { d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255; return; }
    var ea = d[k + 3] / 255, oa = a + ea * (1 - a);
    if (oa <= 0) return;
    for (var j = 0; j < 3; j++) d[k + j] = (c[j] * a + d[k + j] * ea * (1 - a)) / oa;
    d[k + 3] = oa * 255;
  };
  // wax: the streaks a crayon leaves scribbled one way, pressed harder here
  // and lighter there, with the paper's tooth showing where it skipped
  var wax = function (c, x, y, px, py, s) {
    var v = y * 0.8 + x * 0.6, band = Math.sin(v * 2.1 + n5(x * 0.6, y * 0.6) * 5);
    var o = shd(c, (band * 0.07 + (n5(x * 0.15 + 50, y * 0.15) - 0.5) * 0.16) * s);
    // (the skips run along the stroke, a pixel or two long)
    return h5(Math.floor((x * 0.8 - y * 0.6) * 1.3), Math.floor(v * 3.6)) < (0.02 + (band < -0.6 ? 0.07 : 0)) * s ? mx5(o, PAPER, 0.6) : o;
  };
  /* a shape the way a child draws one. sdf says how far inside the shape a
     point is; the hand wobbles, so the shape is looked up a little off true.
     It's coloured in (fill: a colour, or fn(x, y, d) giving one or nothing)
     not quite to the line and now and then over it, and gone round with a
     line (or not, for strokes). A painter P may carry tf, a transform from
     its pixels to the drawing's own coordinates (to turn or flip it). */
  var kd = function (P, x0, y0, x1, y1, sdf, fill, line, o) {
    o = o || {};
    var Rr = BB.R, lw = o.lw || 1, wb = o.wob === undefined ? 0.4 : o.wob, sd = o.seed || 0, tx = o.tex === undefined ? 1 : o.tex, ff = typeof fill === 'function';
    var pa = Math.max(0, Math.floor((x0 - P.ox) * Rr)), pb = Math.min(P.iw, Math.ceil((x1 - P.ox) * Rr)), qa = Math.max(0, Math.floor((y0 - P.oy) * Rr)), qb = Math.min(P.ih, Math.ceil((y1 - P.oy) * Rr));
    if (P.tf) { pa = 0; pb = P.iw; qa = 0; qb = P.ih; }
    for (var py = qa; py < qb; py++) for (var px = pa; px < pb; px++) {
      var x = P.ox + (px + 0.5) / Rr, y = P.oy + (py + 0.5) / Rr;
      if (P.tf) { var tt = P.tf(x, y); x = tt[0]; y = tt[1]; }
      var d = sdf(x + (Math.sin(y * 0.9 + sd) * 0.7 + Math.sin(y * 2.3 + sd * 1.7) * 0.3) * wb, y + (Math.sin(x * 0.8 + sd * 0.6) * 0.7 + Math.sin(x * 2.1 + sd * 2.3) * 0.3) * wb), c = null;
      if (d < -1) continue;
      if (line && d >= 0 && d < lw) c = wax(line, x, y, px, py, tx * 0.4);
      else if (fill && (!line ? d >= 0 : d < 0 ? d > -Math.max(0, Math.sin(x * 0.31 - y * 0.6 + sd) * 2.2 - 1.6) : d > lw + Math.max(0, Math.sin(x * 0.7 + y * 0.45 + sd * 3) * 1.1 - 0.4))) {
        c = ff ? fill(x, y, d) : fill;
        if (c) c = wax(c, x, y, px, py, tx);
      }
      if (c) pset(P, px, py, c);
    }
  };
  // the shapes: each says how far inside it a point is
  var sdE = function (x, y, cx, cy, rx, ry) { var dx = x - cx, dy = y - cy, k = Math.sqrt(dx * dx / (rx * rx) + dy * dy / (ry * ry)); return k < 1e-6 ? Math.min(rx, ry) : Math.sqrt(dx * dx + dy * dy) * (1 - k) / k; };
  var sdER = function (x, y, cx, cy, rx, ry, a) { var cs = Math.cos(a), sn = Math.sin(a), dx = x - cx, dy = y - cy; return sdE(dx * cs + dy * sn, -dx * sn + dy * cs, 0, 0, rx, ry); };
  var sdBlob = function (x, y, cx, cy, rx, ry, s, a) { var an = Math.atan2((y - cy) / ry, (x - cx) / rx), k = 1 + a * (Math.sin(an * 3 + s) * 0.6 + Math.sin(an * 5 + s * 2.1) * 0.4); return sdE(x, y, cx, cy, rx * k, ry * k); };
  var sdB = function (x, y, cx, cy, hw, hh, r) { var qx = Math.abs(x - cx) - hw + r, qy = Math.abs(y - cy) - hh + r; return -(Math.sqrt(Math.max(qx, 0) * Math.max(qx, 0) + Math.max(qy, 0) * Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r); };
  var sdL = function (x, y, ax, ay, bx, by, r) { var ex = bx - ax, ey = by - ay, wx = x - ax, wy = y - ay, t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey))); return r - Math.sqrt((wx - ex * t) * (wx - ex * t) + (wy - ey * t) * (wy - ey * t)); };
  var sdP = function (x, y, p) {
    var d = 1e9, inside = false;
    for (var i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
      var ax = p[j], ay = p[j + 1], ex = p[i] - ax, ey = p[i + 1] - ay, wx = x - ax, wy = y - ay, t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey))), qx = wx - ex * t, qy = wy - ey * t;
      d = Math.min(d, qx * qx + qy * qy);
      if ((ay > y) !== (p[i + 1] > y) && x < ax + (y - ay) * ex / ey) inside = !inside;
    }
    return inside ? Math.sqrt(d) : -Math.sqrt(d);
  };
  // a pointy-topped hexagon, a honeycomb's cell
  var sdHex = function (x, y, cx, cy, r) { var dx = Math.abs(x - cx), dy = Math.abs(y - cy); return r * 0.866 - Math.max(dx, dx * 0.5 + dy * 0.866); };
  var star5 = function (cx, cy, ro, ri, a) { var p = []; for (var k = 0; k < 10; k++) { var an = (a || 0) - Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? ri : ro; p.push(cx + Math.cos(an) * r, cy + Math.sin(an) * r); } return p; };
  // and the ways of drawing them
  var ell5 = function (P, cx, cy, rx, ry, fill, line, o) { kd(P, cx - rx - 2, cy - ry - 2, cx + rx + 2, cy + ry + 2, function (x, y) { return sdE(x, y, cx, cy, rx, ry); }, fill, line, o); };
  var dot5 = function (P, cx, cy, r, col) { ell5(P, cx, cy, r, r, col, null, { wob: 0.1, tex: 0.5 }); };
  var poly5 = function (P, p, fill, line, o) {
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (var i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); }
    kd(P, x0 - 2, y0 - 2, x1 + 2, y1 + 2, function (x, y) { return sdP(x, y, p); }, fill, line, o);
  };
  var box5 = function (P, cx, cy, hw, hh, r, fill, line, o) { kd(P, cx - hw - 2, cy - hh - 2, cx + hw + 2, cy + hh + 2, function (x, y) { return sdB(x, y, cx, cy, hw, hh, r); }, fill, line, o); };
  var ln5 = function (P, ax, ay, bx, by, r, col, o) { kd(P, Math.min(ax, bx) - r - 2, Math.min(ay, by) - r - 2, Math.max(ax, bx) + r + 2, Math.max(ay, by) + r + 2, function (x, y) { return sdL(x, y, ax, ay, bx, by, r); }, col, null, o || { wob: 0.25, tex: 0.6 }); };
  var pl5 = function (P, pts, r, col) { for (var i = 2; i < pts.length; i += 2) ln5(P, pts[i - 2], pts[i - 1], pts[i], pts[i + 1], r, col); };
  // turning a drawing about a point, or flipping it, as a painter's transform
  var turn = function (a, cx, cy) { var cs = Math.cos(a), sn = Math.sin(a); return function (x, y) { var dx = x - cx, dy = y - cy; return [cx + dx * cs + dy * sn, cy - dx * sn + dy * cs]; }; };
  var flip = function (w, tf) { return function (x, y) { return tf ? tf(w - x, y) : [w - x, y]; }; };
  // a little crayon drawing of its own, to move about
  var kidSprite = function (w, h, art, tf) {
    var c = BB.surface(w, h), g = c.getContext('2d'), img = g.getImageData(0, 0, c.width, c.height);
    art({ d: img.data, iw: c.width, ih: c.height, ox: 0, oy: 0, tf: tf });
    g.putImageData(img, 0, 0);
    return c;
  };
  // a kid's flower: petals round a middle, on a stalk
  var flower5 = function (P, x, y, petal, mid, stalk) {
    if (stalk) ln5(P, x, y + 1, x + 0.4, y + stalk, 0.45, C5('#3f9a3a'));
    for (var k = 0; k < 5; k++) { var a = k * 1.2566 - 1.2; ell5(P, x + Math.cos(a) * 1.6, y + Math.sin(a) * 1.6, 1.25, 1.25, petal, mx5(petal, INK5, 0.45), { lw: 0.5, wob: 0.15 }); }
    ell5(P, x, y, 1.05, 1.05, mid, C5('#d07a1a'), { lw: 0.5, wob: 0.1 });
  };
  // grass the way kids draw it: three strokes from one spot
  var tuft5 = function (P, x, y, col) { ln5(P, x, y, x - 1.2, y - 2.4, 0.4, col); ln5(P, x, y, x, y - 3, 0.4, col); ln5(P, x, y, x + 1.2, y - 2.4, 0.4, col); };
  // a palm frond, fat and pointed
  var frond5 = function (P, x, y, a, len, col, line) { kd(P, x - len - 3, y - len - 3, x + len + 3, y + len + 3, function (px, py) { return sdER(px, py, x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55 + len * 0.08, len * 0.6, len * 0.2, a); }, col, line, { lw: 0.6, wob: 0.2 }); };

  // the places, painted once onto the sheet
  var world5 = function (P) {
    var q = [], j, k, x, y, p, W5 = WORLD.slice(35).map(function (w) { return { land: C5(w.land), dark: C5(w.dark) }; });
    for (j = 0; j < 10; j++) q.push(node(35 + j));
    var GRN = C5('#3f8a34'), YEL = C5('#ffd23a'), RED5 = C5('#e8443a'), BLU = C5('#3a7ee0'), SKY = C5('#7ad0ff'), BRN = C5('#8a5230');

    // ---- doodles on the bare paper, round the edges
    // the sun in the corner, with a face (its rays go round: drawn each frame)
    ell5(P, 2767, 47.5, 4.6, 4.6, YEL, C5('#f08a1e'), { seed: 2 });
    dot5(P, 2765.4, 46.6, 0.55, INK5); dot5(P, 2768.6, 46.6, 0.55, INK5);
    kd(P, 2763, 47, 2771, 51, function (x, y) { return y < 48.4 ? -1 : 0.38 - Math.abs(Math.hypot(x - 2767, y - 47.4) - 2.1); }, INK5, null, { wob: 0.1 });
    // birds, hearts, gold stars (the wishes), waves
    [[2887, 44], [2894, 47.5], [3133, 45], [3140, 43]].forEach(function (b) { pl5(P, [b[0] - 2.2, b[1] + 0.6, b[0] - 1.1, b[1] - 0.4, b[0], b[1] + 0.6, b[0] + 1.1, b[1] - 0.4, b[0] + 2.2, b[1] + 0.6], 0.38, C5('#5a5070')); });
    [[3011, 119.5], [3197, 47]].forEach(function (h) { kd(P, h[0] - 4, h[1] - 4, h[0] + 4, h[1] + 4, function (x, y) { return Math.max(sdE(x, y, h[0] - 1.3, h[1] - 0.8, 1.6, 1.6), sdE(x, y, h[0] + 1.3, h[1] - 0.8, 1.6, 1.6), sdP(x, y, [h[0] - 2.9, h[1] - 0.4, h[0] + 2.9, h[1] - 0.4, h[0], h[1] + 2.8])); }, C5('#ff7aa8'), C5('#d8407a'), { lw: 0.6, wob: 0.15 }); });
    [[2949, 46.5], [3073, 120], [3259, 45.5], [2826, 120]].forEach(function (s, i) { poly5(P, star5(s[0], s[1], 3, 1.3, i * 0.2), YEL, C5('#d8901a'), { lw: 0.6, wob: 0.15 }); });
    [[3136, 121], [3322, 121], [2886, 121.5]].forEach(function (w) { pl5(P, [w[0] - 3, w[1], w[0] - 1.5, w[1] - 1, w[0], w[1], w[0] + 1.5, w[1] - 1, w[0] + 3, w[1]], 0.38, BLU); });

    // ---- 36 · the Pokémon meadow: Pikachu in the long grass (the Poké Ball
    // wobbles: drawn each frame)
    p = q[0];
    kd(P, p.x - 35, 52, p.x + 33, 122, function (x, y) { return sdBlob(x, y, p.x - 1, 87, 30, 30, 1, 0.06); }, W5[0].land, W5[0].dark, { wob: 0.6, seed: 1 });
    [[2771, 73], [2778, 66], [2772, 82], [2795, 116], [2786, 113], [2822, 86], [2817, 96]].forEach(function (g2) { tuft5(P, g2[0], g2[1], GRN); });
    flower5(P, 2781, 58.5, WH5, YEL, 0); flower5(P, 2803, 115, C5('#ff8ab8'), YEL, 0); flower5(P, 2768, 96, C5('#ffd23a'), C5('#ff8a3a'), 0);
    var pk = function (cx, cy) {
      var Y2 = C5('#ffd23a'), L2 = C5('#7a5218');
      poly5(P, [cx + 3, cy + 2, cx + 7, cy - 1, cx + 5.4, cy - 2, cx + 8.6, cy - 6, cx + 9.8, cy - 4.6, cx + 7.4, cy - 0.6, cx + 8.8, cy + 0.4, cx + 4, cy + 4], Y2, L2, { lw: 0.7, wob: 0.15, seed: 4 });
      [[-3, -1.2, -6.2, -10.8], [3, 1.2, 6.2, -10.8]].forEach(function (e) {
        poly5(P, [cx + e[0], cy - 4.6, cx + e[2], cy + e[3], cx + e[1], cy - 5.6], function (x2, y2) { return y2 < cy - 8.8 ? INK5 : Y2; }, L2, { lw: 0.7, wob: 0.1, seed: 5 });
      });
      ell5(P, cx, cy + 3, 3.6, 3.9, Y2, L2, { lw: 0.7, wob: 0.15, seed: 6 });
      ell5(P, cx - 1.8, cy + 6.6, 1.3, 0.8, Y2, L2, { lw: 0.6, wob: 0.1 }); ell5(P, cx + 1.8, cy + 6.6, 1.3, 0.8, Y2, L2, { lw: 0.6, wob: 0.1 });
      ell5(P, cx, cy - 2.4, 4.4, 3.6, Y2, L2, { lw: 0.7, wob: 0.15, seed: 7 });
      dot5(P, cx - 1.7, cy - 3, 0.75, INK5); dot5(P, cx + 1.7, cy - 3, 0.75, INK5);
      dot5(P, cx - 1.9, cy - 3.3, 0.28, WH5); dot5(P, cx + 1.5, cy - 3.3, 0.28, WH5);
      dot5(P, cx - 3.1, cy - 1.3, 0.95, RED5); dot5(P, cx + 3.1, cy - 1.3, 0.95, RED5);
    };
    pk(2808, 104);

    // ---- 37 · Universal Studios: the castle on its hill, and the globe on
    // its fountain (it turns: drawn each frame)
    p = q[1];
    kd(P, p.x - 32, 46, p.x + 34, 122, function (x, y) { return sdBlob(x, y, p.x + 1, 84, 29, 34, 2, 0.07); }, W5[1].land, W5[1].dark, { wob: 0.6, seed: 2 });
    var hx = p.x - 17, STONE = C5('#b4b0c8'), SL = C5('#4a4660'), ROOF = C5('#3e4fa0'), RL = C5('#232a60');
    ell5(P, hx, 86.5, 12.5, 3.6, C5('#7cc062'), GRN, { seed: 3 });
    box5(P, hx, 80, 7, 4.5, 0, STONE, SL, { wob: 0.25 });
    [[-7.5, 2.1, 74], [0, 2.6, 66], [7.5, 2.1, 75.5]].forEach(function (t2) {
      box5(P, hx + t2[0], (t2[2] + 84) / 2, t2[1], (84 - t2[2]) / 2, 0, STONE, SL, { wob: 0.25, seed: t2[0] });
      poly5(P, [hx + t2[0] - t2[1] - 1, t2[2] + 0.5, hx + t2[0], t2[2] - 7, hx + t2[0] + t2[1] + 1, t2[2] + 0.5], ROOF, RL, { wob: 0.2, seed: t2[0] + 1 });
      dot5(P, hx + t2[0], t2[2] + 3, 0.6, YEL);
    });
    ln5(P, hx, 59, hx, 56, 0.3, SL); poly5(P, [hx, 56, hx + 2.6, 56.8, hx, 57.6], RED5, null, { wob: 0 });
    box5(P, hx, 82.6, 1.4, 1.8, 1.2, C5('#5a3a2a'), null, { wob: 0.1 });
    var gx5 = p.x + 19;
    ell5(P, gx5, 88, 9.5, 3, C5('#5ab8f0'), C5('#7a7a90'), { lw: 1.2, seed: 4 });
    box5(P, gx5, 82, 1.8, 5, 0.5, C5('#dcd8e8'), SL, { wob: 0.2 });

    // ---- 38 · New York at Christmas: the Empire State, a yellow taxi, the
    // tree in the park (it snows: drawn each frame)
    p = q[2];
    kd(P, p.x - 32, 48, p.x + 32, 120, function (x, y) { return sdBlob(x, y, p.x, 84, 29, 33, 3, 0.06); }, W5[2].land, W5[2].dark, { wob: 0.6, seed: 3 });
    var ex5 = p.x - 18, BLD = C5('#9aa6cc'), BL = C5('#3a4470');
    box5(P, ex5, 76, 5, 12, 0, BLD, BL, { wob: 0.25, seed: 1 });
    box5(P, ex5, 60, 3.6, 4.5, 0, BLD, BL, { wob: 0.25, seed: 2 });
    box5(P, ex5, 52, 2.2, 3.6, 0, BLD, BL, { wob: 0.2, seed: 3 });
    ln5(P, ex5, 49, ex5, 41.5, 0.5, BL);
    for (y = 66; y < 87; y += 3) for (x = -2.6; x <= 2.6; x += 2.6) dot5(P, ex5 + x, y, 0.55, h5(x, y) < 0.75 ? C5('#ffe060') : C5('#5a6488'));
    for (y = 57.5; y < 63; y += 3) for (x = -1.3; x <= 1.3; x += 2.6) dot5(P, ex5 + x, y, 0.5, C5('#ffe060'));
    var tx5 = p.x + 14, TG = C5('#2f9a48'), TL = C5('#1e5e30');
    box5(P, tx5, 111, 1.3, 2, 0.3, BRN, null, { wob: 0.1 });
    poly5(P, [tx5 - 8, 110, tx5, 100, tx5 + 8, 110], TG, TL, { seed: 1 });
    poly5(P, [tx5 - 6.5, 104.5, tx5, 96, tx5 + 6.5, 104.5], TG, TL, { seed: 2 });
    poly5(P, [tx5 - 5, 99, tx5, 91.5, tx5 + 5, 99], TG, TL, { seed: 3 });
    poly5(P, star5(tx5, 91.2, 2.5, 1.1), YEL, C5('#d8901a'), { lw: 0.5, wob: 0.1 });
    var cbx = p.x - 13;
    box5(P, cbx, 110, 5.6, 2.1, 0.9, C5('#ffc61e'), C5('#6a4a10'), { lw: 0.8, wob: 0.2 });
    box5(P, cbx, 107.3, 3.1, 1.5, 0.6, C5('#ffc61e'), C5('#6a4a10'), { lw: 0.7, wob: 0.15 });
    box5(P, cbx - 1.4, 107.4, 1, 0.8, 0.2, SKY, null, { wob: 0 }); box5(P, cbx + 1.4, 107.4, 1, 0.8, 0.2, SKY, null, { wob: 0 });
    for (k = -4; k <= 3; k += 2) box5(P, cbx + k + 0.5, 110, 0.5, 0.5, 0, INK5, null, { wob: 0 });
    dot5(P, cbx - 3.4, 112.4, 1.3, INK5); dot5(P, cbx + 3.4, 112.4, 1.3, INK5);

    // ---- 39 · Jamaica: an island in a turquoise sea, a palm, a waterfall
    // into its pool (the water falls: drawn each frame)
    p = q[3];
    kd(P, p.x - 33, 50, p.x + 33, 122, function (x, y) { return sdBlob(x, y, p.x, 86, 30, 33, 4, 0.05); }, W5[3].land, W5[3].dark, { wob: 0.6, seed: 4 });
    for (k = 0; k < 7; k++) { x = p.x - 22 + (k * 37) % 44; y = 58 + (k * 23) % 56; if (sdBlob(x, y, p.x + 1, 88, 23, 21, 7, 0.1) > -2.5) continue; pl5(P, [x - 1.6, y, x - 0.8, y - 0.7, x, y, x + 0.8, y - 0.7, x + 1.6, y], 0.32, WH5); }
    kd(P, p.x - 26, 64, p.x + 28, 112, function (x, y) { return sdBlob(x, y, p.x + 1, 88, 23, 21, 7, 0.1); }, C5('#ffe08a'), C5('#d4a040'), { wob: 0.5, seed: 5 });
    kd(P, p.x - 22, 67, p.x + 24, 109, function (x, y) { return sdBlob(x, y, p.x + 1.5, 88.5, 19, 17, 8, 0.1); }, C5('#5cc24e'), GRN, { wob: 0.5, seed: 6 });
    var px5 = p.x - 13;
    kd(P, px5 - 5, 84, px5 + 4, 106, function (x, y) { return Math.max(sdL(x, y, px5 - 2.5, 104, px5 - 1, 96, 1.2), sdL(x, y, px5 - 1, 96, px5 + 1, 89, 1.05)); }, function (x, y) { return Math.floor(y * 0.9) % 2 ? C5('#a8703e') : C5('#8a5530'); }, C5('#5a3418'), { lw: 0.6, wob: 0.15 });
    [-2.7, -2.0, -1.2, -0.5, 0.25].forEach(function (a, i) { frond5(P, px5 + 1, 89, a, 6.5 - (i % 2) * 0.8, C5('#3cae48'), C5('#1e6e2c')); });
    dot5(P, px5 + 0.2, 90.2, 0.9, BRN); dot5(P, px5 + 1.9, 90.5, 0.9, BRN);
    var wx5 = p.x + 13;
    kd(P, wx5 - 12, 89, wx5 + 12, 106, function (x, y) { return Math.min(sdE(x, y, wx5, 105, 10.5, 14), 105 - y); }, C5('#3e9a44'), C5('#24703a'), { seed: 7 });
    dot5(P, wx5 - 6, 101, 1, C5('#9a98a8')); dot5(P, wx5 + 6.5, 99.5, 1.2, C5('#9a98a8'));
    box5(P, wx5, 97.5, 2, 7, 0.8, SKY, C5('#2a7ac8'), { lw: 0.6, wob: 0.15 });
    ell5(P, wx5, 105.6, 6, 2, SKY, C5('#2a7ac8'), { lw: 0.6, wob: 0.15 });

    // ---- 40 · Antarctica: ice, an iceberg in its pool, snowflakes (the
    // penguin waddles and the southern lights glow: drawn each frame)
    p = q[4];
    kd(P, p.x - 33, 46, p.x + 33, 118, function (x, y) {
      var an = Math.atan2((y - 82) / 32, (x - p.x) / 29), w = Math.abs((((an * 9 / 6.283 + 0.3) % 1) + 1) % 1 - 0.5) * 2, kk = 0.93 + 0.09 * w + 0.03 * Math.sin(an * 2 + 1);
      return sdE(x, y, p.x, 82, 29 * kk, 32 * kk);
    }, W5[4].land, W5[4].dark, { wob: 0.45, seed: 5 });
    var ib = p.x + 13;
    ell5(P, ib, 105.5, 14, 2.8, C5('#5ab4ec'), C5('#2a7ac8'), { lw: 0.7, seed: 1 });
    poly5(P, [ib - 12, 105, ib - 8, 96, ib - 5, 98.5, ib, 86, ib + 5, 95, ib + 8, 92.5, ib + 12.5, 105], function (x, y) { return x > ib + 0.6 + (y - 86) * 0.22 ? C5('#b8dcf4') : WH5; }, C5('#4a90c8'), { seed: 2 });
    [[p.x - 20, 64], [p.x + 21, 81], [p.x - 22, 92], [p.x + 4, 112]].forEach(function (s) { for (k = 0; k < 3; k++) { var a = k * Math.PI / 3; ln5(P, s[0] - Math.cos(a) * 1.8, s[1] - Math.sin(a) * 1.8, s[0] + Math.cos(a) * 1.8, s[1] + Math.sin(a) * 1.8, 0.32, C5('#6aaad6')); } });

    // ---- 41 · Australia, its own shape (from its real coast) and Tasmania,
    // with the Opera House at Sydney (the kangaroo hops: drawn each frame)
    p = q[5];
    var AU = [0.44, -1, 0.4, -0.87, 0.39, -0.66, 0.36, -0.52, 0.28, -0.54, 0.2, -0.62, 0.12, -0.7, 0.15, -0.79, 0.17, -0.9, 0.05, -0.92, -0.04, -0.95, -0.13, -0.88, -0.2, -0.71, -0.29, -0.77, -0.37, -0.75, -0.46, -0.6, -0.55, -0.49, -0.61, -0.38, -0.73, -0.33, -0.82, -0.31, -0.95, -0.22, -0.97, -0.03, -0.95, 0.1, -0.92, 0.26, -0.9, 0.38, -0.87, 0.49, -0.9, 0.66, -0.76, 0.7, -0.57, 0.62, -0.46, 0.56, -0.36, 0.51, -0.22, 0.47, -0.1, 0.45, 0.01, 0.5, 0.1, 0.69, 0.15, 0.58, 0.21, 0.52, 0.2, 0.66, 0.24, 0.74, 0.3, 0.83, 0.36, 0.91, 0.43, 0.94, 0.51, 0.93, 0.56, 0.9, 0.63, 0.99, 0.68, 0.91, 0.8, 0.87, 0.81, 0.74, 0.86, 0.62, 0.93, 0.49, 0.98, 0.25, 0.96, 0.14, 0.96, 0, 0.89, -0.07, 0.83, -0.17, 0.77, -0.27, 0.65, -0.4, 0.6, -0.57, 0.57, -0.66, 0.54, -0.76, 0.49, -0.77, 0.46, -0.91].map(function (v, i) { return i % 2 ? 84 + v * 25 : p.x + v * 30; });
    kd(P, p.x - 34, 54, p.x + 34, 120, function (x, y) { return Math.max(sdP(x, y, AU), sdE(x, y, p.x + 19.5, 114, 3.4, 2.8)); }, W5[5].land, W5[5].dark, { wob: 0.45, seed: 6 });
    // (its shells: each a quarter of an oval, curved side to the harbour,
    // the back ones drawn first)
    var oh = p.x + 20, ob = 100;
    ell5(P, oh + 0.5, ob + 1.6, 9, 1.6, C5('#5ab4ec'), C5('#2a7ac8'), { lw: 0.5, wob: 0.15 });
    box5(P, oh + 0.3, ob + 0.5, 7.6, 1, 0.3, C5('#eadcc0'), C5('#8a6a4a'), { lw: 0.5, wob: 0.1 });
    [[2.2, 4.4, 6], [-2.2, 5, 8.5], [-6, 4.5, 6.5]].forEach(function (s) {
      var bx = oh + s[0], w = s[1], h = s[2];
      kd(P, bx - 1, ob - h - 1, bx + w + 1, ob + 0.5, function (x, y) { return Math.min(sdE(x, y, bx + w, ob, w, h), ob - y, bx + w - x); }, WH5, C5('#6a7a98'), { lw: 0.6, wob: 0.1 });
    });

    // ---- 42 · on a rainbow: a sky of cloud, the rainbow arching over the
    // path, a cloud at one end and the pot of gold at the other
    p = q[6];
    kd(P, p.x - 32, 48, p.x + 32, 120, function (x, y) {
      var d = sdE(x, y, p.x, 84, 21, 25);
      for (var k2 = 0; k2 < 11; k2++) { var a = k2 * 0.5712 + 0.3; d = Math.max(d, sdE(x, y, p.x + Math.cos(a) * 21, 84 + Math.sin(a) * 26, 7.5, 7.5)); }
      return d;
    }, W5[6].land, W5[6].dark, { wob: 0.5, seed: 7 });
    var RB = ['#ff5a5a', '#ff9a3a', '#ffd83a', '#5cc85a', '#4a9ae8', '#9a6ae0'].map(C5);
    kd(P, p.x - 30, 82, p.x + 30, 112, function (x, y) { var r = Math.hypot(x - p.x, y - 111); return Math.min(27.5 - r, r - 18.5, 111 - y); }, function (x, y) { return RB[Math.max(0, Math.min(5, Math.floor((27.5 - Math.hypot(x - p.x, y - 111)) / 1.5)))]; }, null, { wob: 0.45, seed: 8 });
    kd(P, p.x - 32, 103, p.x - 12, 116, function (x, y) { return Math.max(sdE(x, y, p.x - 26.5, 110.5, 3.6, 3.2), sdE(x, y, p.x - 22, 108.6, 4.2, 3.8), sdE(x, y, p.x - 17.5, 110.8, 3.4, 3)); }, WH5, C5('#7aa8d8'), { lw: 0.7, wob: 0.2 });
    var pg = p.x + 22.5;
    box5(P, pg, 112.4, 4.3, 3, 1.6, C5('#2e2e40'), C5('#14141f'), { lw: 0.6, wob: 0.15 });
    ell5(P, pg, 108.6, 3.9, 1.7, YEL, C5('#c8901a'), { lw: 0.6, wob: 0.15 });
    dot5(P, pg - 1.6, 107.6, 0.9, C5('#ffe880')); dot5(P, pg + 1.2, 107.2, 0.9, C5('#ffe880')); dot5(P, pg - 0.2, 106.5, 0.9, C5('#ffe880'));
    box5(P, pg, 109.9, 4.9, 0.8, 0.4, C5('#4a4a5e'), null, { wob: 0.1 });

    // ---- 43 · chocolate land: dripping, a mountain made of chocolate bar
    // with a bite out of the top, marshmallows (Bonnie's chocolate bar walks)
    p = q[7];
    kd(P, p.x - 31, 50, p.x + 31, 120, function (x, y) {
      var d = sdB(x, y, p.x, 79, 27, 25, 8);
      [[-17, 14], [-6, 9], [8, 16], [19, 10]].forEach(function (dr) { d = Math.max(d, sdL(x, y, p.x + dr[0], 98, p.x + dr[0], 100 + dr[1], 2.5)); });
      return d;
    }, W5[7].land, W5[7].dark, { wob: 0.5, seed: 8 });
    // (the mountain's made of the bar's squares, each one raised, with white
    // chocolate on top like snow, and a bite gone from its shoulder)
    var mt = p.x + 16;
    kd(P, mt - 16, 55, mt + 16, 90, function (x, y) { return Math.min(Math.max(sdP(x, y, [mt - 14, 88, mt - 3, 62, mt + 3, 62, mt + 14, 88]), sdE(x, y, mt, 63, 3.6, 3)), -sdE(x, y, mt + 7.6, 70, 3, 3)); }, function (x, y) {
      if (y < 65.5 + Math.max(0, Math.sin(x * 1.4 + 1)) * 2.6) return C5('#fff2e2');
      var gx = ((x - mt + 52.2) % 5.8 + 5.8) % 5.8, gy = ((y - 61) % 5.6 + 5.6) % 5.6;
      if (gx < 0.7 || gy < 0.7) return C5('#6a3820');
      return gx < 1.6 || gy < 1.6 ? C5('#dca06a') : gx > 4.8 || gy > 4.6 ? C5('#a4683c') : C5('#c4824c');
    }, C5('#4a2614'), { seed: 9 });
    [[p.x - 15, 103, '#ffb8d0'], [p.x - 9.5, 104.5, '#ffffff'], [p.x + 18, 101.5, '#ffb8d0']].forEach(function (m) { box5(P, m[0], m[1], 1.8, 1.4, 0.8, C5(m[2]), C5('#c87a9a'), { lw: 0.5, wob: 0.1 }); });

    // ---- 44 · dinosaur land: a jungle, a volcano (it smokes: drawn each
    // frame), a long-necked dinosaur and her eggs, ferns
    p = q[8];
    kd(P, p.x - 32, 48, p.x + 32, 120, function (x, y) { var an = Math.atan2((y - 84) / 33, (x - p.x) / 29), kk = 1 + 0.04 * Math.sin(an * 3 + 2) + 0.05 * (Math.abs(Math.sin(an * 6.5 + 1)) - 0.64); return sdE(x, y, p.x, 84, 29 * kk, 33 * kk); }, W5[8].land, W5[8].dark, { wob: 0.5, seed: 9 });
    var vx = p.x + 17;
    poly5(P, [vx - 13, 75, vx - 4, 55, vx + 4, 55, vx + 13, 75], C5('#8a6a5a'), C5('#4a3028'), { seed: 3 });
    poly5(P, [vx - 4, 55, vx + 4, 55, vx + 3.2, 60.5, vx + 1.6, 58.4, vx + 0.4, 63, vx - 1.2, 58.6, vx - 2.8, 61.5], C5('#ff6a1e'), C5('#c8301a'), { lw: 0.6, wob: 0.15 });
    ell5(P, vx, 55, 4.3, 1.2, C5('#ffb02a'), C5('#c8301a'), { lw: 0.6, wob: 0.1 });
    var dn = p.x - 22, DF = C5('#4fb0d0');
    kd(P, dn - 16, 89, dn + 15, 111, function (x, y) {
      return Math.max(sdE(x, y, dn, 103, 7, 4.2), sdL(x, y, dn + 5, 101, dn + 9, 95.5, 1.6), sdE(x, y, dn + 10.6, 94.6, 2.6, 1.7), sdL(x, y, dn - 6, 104, dn - 12.5, 107.5, 1.3), sdB(x, y, dn - 4, 107.5, 1.1, 2, 0.4), sdB(x, y, dn + 4, 107.5, 1.1, 2, 0.4));
    }, function (x, y) { return Math.hypot(x - dn + 2, y - 101.5) < 1.2 || Math.hypot(x - dn - 2.5, y - 102.5) < 1 || Math.hypot(x - dn + 4.5, y - 104) < 0.9 ? C5('#2a86a8') : DF; }, C5('#1e5a7a'), { seed: 4 });
    dot5(P, dn + 11.2, 94.1, 0.5, INK5);
    ell5(P, p.x - 4, 108.4, 1.8, 2.3, C5('#fff8ec'), C5('#8a8a9a'), { lw: 0.5, wob: 0.15 }); ell5(P, p.x - 0.4, 110, 1.7, 2.1, C5('#fff8ec'), C5('#8a8a9a'), { lw: 0.5, wob: 0.15 });
    dot5(P, p.x - 4.4, 107.6, 0.4, C5('#7ac0e0')); dot5(P, p.x - 0.2, 109.4, 0.4, C5('#7ac0e0'));
    [[p.x + 15, 108], [p.x + 22, 104]].forEach(function (f) { [-2.4, -1.9, -1.25, -0.7].forEach(function (a) { frond5(P, f[0], f[1], a, 5, C5('#2f8a3a'), C5('#1a5a28')); }); });

    // ---- 45 · bee land: a honeycomb, flowers, and Queen Bee's hive with
    // her crown on top (a bee buzzes round it: drawn each frame)
    p = q[9];
    var HC = W5[9].land, HL = C5('#f0b02a');
    kd(P, p.x - 30, 50, p.x + 32, 118, function (x, y) { return sdHex(x, y, p.x + 1, 84, 31); }, function (x, y) {
      var r0 = Math.round((y - 84) / 6), best = 1e9, bx = 0, by = 0;
      for (var rr = r0 - 1; rr <= r0 + 1; rr++) { var off = (rr & 1) ? 3.464 : 0, cx = Math.round((x - p.x - off) / 6.928) * 6.928 + p.x + off, cy = 84 + rr * 6, dd = (x - cx) * (x - cx) + (y - cy) * (y - cy); if (dd < best) { best = dd; bx = cx; by = cy; } }
      return sdHex(x, y, bx, by, 4) < 0.5 ? HL : HC;
    }, W5[9].dark, { wob: 0.5, seed: 10 });
    flower5(P, p.x - 14, 98, WH5, YEL, 8); flower5(P, p.x - 21, 90, C5('#ff8ab8'), YEL, 7); flower5(P, p.x - 7, 106, C5('#b88aff'), YEL, 5);
    var hv = p.x + 12, HV = C5('#f3b33a'), HVL = C5('#8a4e14'), rows = [[106, 8.4], [102.5, 7.6], [99, 6.6], [95.6, 5.2], [92.6, 3.4]];
    kd(P, hv - 11, 88, hv + 11, 109, function (x, y) { var d = -1e9; rows.forEach(function (r) { d = Math.max(d, sdB(x, y, hv, r[0], r[1], 2, 1.6)); }); return d; }, function (x, y) { for (var i = 0; i < rows.length - 1; i++) if (Math.abs(y - (rows[i][0] - 1.75)) < 0.35) return C5('#b8741e'); return HV; }, HVL, { seed: 11 });
    kd(P, hv - 3, 103, hv + 3, 108, function (x, y) { return Math.min(sdE(x, y, hv, 107.6, 2.3, 2.6), 107.9 - y); }, C5('#4a2a10'), null, { wob: 0.1 });
    poly5(P, [hv - 3.8, 91.2, hv - 3.8, 86.4, hv - 1.9, 88.8, hv, 85.4, hv + 1.9, 88.8, hv + 3.8, 86.4, hv + 3.8, 91.2], YEL, C5('#b8801a'), { lw: 0.6, wob: 0.1 });
    dot5(P, hv, 89.4, 0.7, RED5); dot5(P, hv - 2.4, 89.9, 0.45, C5('#4aa8ff')); dot5(P, hv + 2.4, 89.9, 0.45, C5('#4aa8ff'));
  };

  // the sheet itself: painted into its surface over the sea there, then the places on it
  var paper5 = function (g, X0, SW) {
    var Rr = BB.R, iw = Math.round(SW * Rr), ih = H * Rr, img = g.getImageData(0, 0, iw, ih), P = { d: img.data, iw: iw, ih: ih, ox: X0, oy: 0 };
    var SHADOW = [16, 46, 104], SHALLOW = [196, 238, 250], BACK = C5('#eadcbc');
    for (var py = 0; py < ih; py++) for (var px = 0; px < iw; px++) {
      var x = X0 + (px + 0.5) / Rr, y = (py + 0.5) / Rr;
      if (x < PX0 - 10 || x > PX1 + 12) continue;
      var d = paperIn(x, y);
      if (d < 0) {
        // the water round it: a little paler close by, and the sheet's shadow
        if (d > -6) pset(P, px, py, SHALLOW, (1 + d / 6) * 0.3);
        if (paperIn(x - 1.5, y - 2.5) >= 0) pset(P, px, py, SHADOW, 0.3);
        continue;
      }
      // warm white, with a soft grain, a touch darker toward its edges
      var f = (n5(x * 1.3, y * 1.3) - 0.5) * 0.05 + (n5(x * 0.2, y * 0.2) - 0.5) * 0.04, ex = pR(y) - x, ey = y - pTop(x), col = PAPER;
      if (d < 2.5) f -= (2.5 - d) / 2.5 * 0.06;
      if (h5(px, py) < 0.012) f -= 0.05;
      // the crease where the list was folded in half
      var cr = x - 3074 - Math.sin(y * 0.3) * 0.2;
      if (cr > -0.5 && cr < 0) f += 0.04; else if (cr >= 0 && cr < 1) f -= 0.05;
      // the dog-eared corner: the paper's back, folded down over it, and its shadow
      if (ex <= EAR && ey <= EAR && ex + ey >= EAR) { col = BACK; f = (ex + ey - EAR) / EAR * -0.08 + (n5(x * 1.3, y * 1.3) - 0.5) * 0.04; if (ex > EAR - 0.6 || ey > EAR - 0.6) f -= 0.12; }
      else if (ex < EAR + 1.4 && ey < EAR + 1.4 && ex + ey > EAR) f -= 0.08;
      pset(P, px, py, shd(col, f));
    }
    world5(P);
    g.putImageData(img, 0, 0);
  };

  // the crayon drawings that move, each painted once (and once more turned or flipped)
  var S5 = null;
  var sprites5 = function () {
    if (S5) return S5;
    S5 = { ball: [], globe: [], roo: [], peng: [], bee: [], choc: [], fly: [] };
    var RED = C5('#e8443a'), BLU = C5('#3a8ae8'), GRN = C5('#5cc24e'), BRN = C5('#9a5428'), YEL = C5('#ffd23a');
    // the Poké Ball, rocking on its base as it does when something's inside
    var ball = function (P) {
      kd(P, 0, 0, 20, 20, function (x, y) { return sdE(x, y, 10, 10, 7, 7); }, function (x, y) {
        var ly = y - 10 + Math.sin(x * 0.7) * 0.25, rr = Math.hypot(x - 10, y - 10);
        if (rr < 1.3) return WH5;
        if (rr < 2.5 || Math.abs(ly) < 0.85) return INK5;
        if (ly < 0) return Math.hypot(x - 7.2, y - 6.6) < 1.5 ? C5('#ffb0a8') : RED;
        return WH5;
      }, INK5, { wob: 0.25, seed: 3 });
    };
    [-0.32, -0.16, 0, 0.16, 0.32].forEach(function (a) { S5.ball.push(kidSprite(20, 20, ball, turn(a, 10, 17))); });
    // the globe at Universal, turning inside its ring
    var ring = function (P, front) {
      kd(P, 0, 0, 24, 24, function (x, y) { var a = -0.22, cs = Math.cos(a), sn = Math.sin(a), dx = x - 12, dy = y - 12, lx = dx * cs + dy * sn, ly = -dx * sn + dy * cs; return Math.min(sdE(lx, ly, 0, 0, 11.6, 4), -sdE(lx, ly, 0, 0, 9.6, 2.5), front ? ly : -ly); }, C5('#e8eaf6'), C5('#5a6080'), { lw: 0.5, wob: 0.1 });
    };
    for (var f = 0; f < 12; f++) (function (ph) {
      S5.globe.push(kidSprite(24, 24, function (P) {
        ring(P, false);
        kd(P, 0, 0, 24, 24, function (x, y) { return sdE(x, y, 12, 12, 8, 8); }, function (x, y) {
          var nx = (x - 12) / 8, ny = (y - 12) / 8, z = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)), lon = Math.atan2(nx, z) + ph;
          var c = n5(Math.cos(lon) * 1.7 + 7, Math.sin(lon) * 1.7 + ny * 2.6 + 3) > 0.55 ? GRN : BLU;
          return Math.hypot(nx + 0.38, ny + 0.42) < 0.26 ? mx5(c, WH5, 0.55) : c;
        }, C5('#24407a'), { wob: 0.15, seed: 5 });
        ring(P, true);
      }));
    })(f * Math.PI / 6);
    // a kangaroo, her joey peeping out of the pouch: sitting, and mid-hop
    // (leaning into it, the big foot out behind), facing either way
    var roo = function (air) {
      return function (P) {
        var tf0 = P.tf, hip = turn(air ? -0.5 : 0, 7, 11), RL = C5('#6a3418');
        P.tf = tf0 ? function (x, y) { var a = tf0(x, y); return hip(a[0], a[1]); } : hip;
        var ft = air ? [5.4, 13.8, 1.4, 16.4] : [5.6, 15, 11.2, 15.4];
        kd(P, 0, 0, 16, 18, function (x, y) {
          return Math.max(sdL(x, y, 5, 11.5, 0.8, 15.4, 1.15), sdER(x, y, 7, 9.4, 3.3, 4.5, 0.25), sdE(x, y, 9.8, 3.8, 2.1, 1.7), sdE(x, y, 11.6, 4.4, 1.4, 0.95),
            sdER(x, y, 8.8, 1.2, 0.7, 1.9, -0.25), sdER(x, y, 10.1, 1.1, 0.7, 1.9, 0.15), sdE(x, y, 6.6, 12.4, 2.6, 2.1), sdL(x, y, ft[0], ft[1], ft[2], ft[3], 0.8), sdL(x, y, 9.6, 7.4, 11.2, 8.8, 0.55));
        }, function (x, y) { return sdE(x, y, 8.4, 9.8, 1.9, 3) > 0 ? C5('#f6d4a4') : BRN; }, C5('#4a200c'), { lw: 0.7, wob: 0.12, seed: 6 });
        ell5(P, 9, 9.3, 1.15, 1.05, BRN, RL, { lw: 0.5, wob: 0.05 });
        dot5(P, 9.4, 9.1, 0.3, INK5);
        ln5(P, 7.4, 10.7, 10.3, 10.7, 0.35, RL);
        dot5(P, 10.3, 3.5, 0.45, INK5); dot5(P, 12.9, 4.2, 0.4, INK5);
        P.tf = tf0;
      };
    };
    [false, true].forEach(function (air) { S5.roo.push([kidSprite(16, 18, roo(air)), kidSprite(16, 18, roo(air), flip(16))]); });
    // a penguin, rocking side to side
    var peng = function (P) {
      kd(P, 0, 0, 12, 16, function (x, y) { return Math.max(sdE(x, y, 6, 8, 4.2, 5.8), sdER(x, y, 1.9, 9, 0.9, 2.8, 0.35), sdER(x, y, 10.1, 9, 0.9, 2.8, -0.35)); }, function (x, y) { return sdE(x, y, 6, 9.4, 2.8, 4.2) > 0 ? WH5 : C5('#2e3250'); }, C5('#14141f'), { lw: 0.6, wob: 0.15, seed: 7 });
      dot5(P, 4.7, 5.4, 0.75, WH5); dot5(P, 7.3, 5.4, 0.75, WH5); dot5(P, 4.9, 5.5, 0.38, INK5); dot5(P, 7.1, 5.5, 0.38, INK5);
      poly5(P, [4.8, 6.6, 7.2, 6.6, 6, 8.2], C5('#ff9a1e'), null, { wob: 0.05 });
      ell5(P, 4.4, 13.9, 1.5, 0.7, C5('#ff9a1e'), null, { wob: 0.05 }); ell5(P, 7.6, 13.9, 1.5, 0.7, C5('#ff9a1e'), null, { wob: 0.05 });
    };
    [-0.14, 0.14].forEach(function (a) { S5.peng.push(kidSprite(12, 16, peng, turn(a, 6, 14.5))); });
    // a bee, wings up and down, facing either way
    var bee = function (up) {
      return function (P) {
        kd(P, 0, 0, 10, 9, function (x, y) { return sdE(x, y, 5, 5.8, 3.4, 2.4); }, function (x) { return (x > 3.4 && x < 4.4) || (x > 5.4 && x < 6.4) ? INK5 : YEL; }, INK5, { lw: 0.5, wob: 0.1, seed: 8 });
        poly5(P, [1.8, 5.2, 1.8, 6.4, 0.3, 5.8], INK5, null, { wob: 0 });
        dot5(P, 7.4, 5.2, 0.5, INK5);
        var wy = up ? 2.2 : 3.4, wr = up ? 2.3 : 1.6;
        ell5(P, 4.4, wy, 1.5, wr, C5('#f4fbff'), C5('#7ab4e0'), { lw: 0.5, wob: 0.05 }); ell5(P, 6, wy + 0.2, 1.3, wr * 0.9, C5('#f4fbff'), C5('#7ab4e0'), { lw: 0.5, wob: 0.05 });
      };
    };
    [true, false].forEach(function (up) { S5.bee.push([kidSprite(10, 9, bee(up)), kidSprite(10, 9, bee(up), flip(10))]); });
    // Bonnie's own chocolate bar, on legs, walking
    var choc = function (step) {
      return function (P) {
        var LEG = C5('#3a2214');
        ln5(P, 3.8, 10, 3.8 + (step ? 0.9 : -0.6), 13.2, 0.45, LEG); ln5(P, 6.2, 10, 6.2 + (step ? 0.6 : -0.9), 13.2, 0.45, LEG);
        ln5(P, 1.8, 5.6, 0.3, step ? 7.8 : 3.8, 0.42, LEG); ln5(P, 8.2, 5.6, 9.7, step ? 3.8 : 7.8, 0.42, LEG);
        box5(P, 5, 6.2, 3.4, 4.6, 0.8, function (x, y) { return y > 8.4 ? (y < 9 ? C5('#e8e4f0') : C5('#e8443a')) : Math.abs(x - 5) < 0.35 || Math.abs(y - 4.2) < 0.35 || Math.abs(y - 6.6) < 0.35 ? C5('#8a5030') : C5('#6a3a1e'); }, C5('#3a1e0e'), { lw: 0.6, wob: 0.12, seed: 9 });
        dot5(P, 3.8, 4.4, 0.75, WH5); dot5(P, 6.2, 4.4, 0.75, WH5); dot5(P, 3.9, 4.6, 0.35, INK5); dot5(P, 6.1, 4.6, 0.35, INK5);
        kd(P, 3, 5, 7, 8, function (x, y) { return y < 6.4 ? -1 : 0.3 - Math.abs(Math.hypot(x - 5, y - 5.6) - 1.3); }, WH5, null, { wob: 0 });
      };
    };
    [0, 1].forEach(function (s) { S5.choc.push(kidSprite(10, 14, choc(s))); });
    // a butterfly (Bonnie drew one), opening and closing its wings
    var fly = function (open) {
      return function (P) {
        var sx = open ? 1 : 0.4;
        [[-1, 3.6, 3.3, 2.8, '#ff7ab8'], [1, 3.6, 3.3, 2.8, '#ff7ab8'], [-1, 7.4, 2.3, 2, '#a878f0'], [1, 7.4, 2.3, 2, '#a878f0']].forEach(function (w) {
          var cx = 7 + w[0] * (w[2] * sx + 0.3);
          ell5(P, cx, w[1], w[2] * sx, w[3], C5(w[4]), C5('#6a3a8a'), { lw: 0.5, wob: 0.1 });
          if (open) dot5(P, cx + w[0] * 0.5, w[1] - 0.2, 0.7, WH5);
        });
        ln5(P, 7, 2.4, 7, 9, 0.6, INK5); ln5(P, 7, 2.6, 5.2, 0.4, 0.3, INK5); ln5(P, 7, 2.6, 8.8, 0.4, 0.3, INK5);
      };
    };
    [true, false].forEach(function (o) { S5.fly.push(kidSprite(14, 10, fly(o))); });
    return S5;
  };

  // Bonnie's paper aeroplane: real folded paper, crisp and white
  var PLANE_FAR = [[19, 0], [-15.5, 0], [-12, -6.5]], PLANE_NEAR = [[19, 0], [-15.5, 0], [-15, 3.1]], PLANE_LOW = [[19, 0], [-15, 3.1], [-13, 7.8]];
  var ftri = function (g, p, col) {
    var y0 = Math.min(p[0][1], p[1][1], p[2][1]), y1 = Math.max(p[0][1], p[1][1], p[2][1]);
    for (var y = snap(y0); y < y1; y += HP) {
      var yc = y + HP / 2, xs = [];
      for (var i = 0; i < 3; i++) { var a = p[i], b = p[(i + 1) % 3]; if ((a[1] <= yc) !== (b[1] <= yc)) xs.push(a[0] + (yc - a[1]) * (b[0] - a[0]) / (b[1] - a[1])); }
      if (xs.length === 2) R(g, Math.min(xs[0], xs[1]), y, Math.abs(xs[1] - xs[0]), HP, col);
    }
  };
  var fline = function (g, a, b, col) { var n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / HP)); for (var i = 0; i <= n; i++) R(g, a[0] + (b[0] - a[0]) * i / n - HP / 2, a[1] + (b[1] - a[1]) * i / n - HP / 2, HP, HP, col); };
  var plane = function (g, x, y, f, pitch, part) {
    var cs = Math.cos(pitch), sn = Math.sin(pitch), at = function (pts) { return pts.map(function (p) { return [x + (p[0] * cs + p[1] * sn) * f, y - p[0] * sn + p[1] * cs]; }); };
    var EDGE = '#5a6a8c';
    if (part !== 'near') { var fw = at(PLANE_FAR); ftri(g, fw, '#d4dcea'); fline(g, fw[1], fw[2], EDGE); fline(g, fw[2], fw[0], EDGE); }
    if (part !== 'far') {
      var nw = at(PLANE_NEAR), lw = at(PLANE_LOW);
      ftri(g, nw, '#ffffff'); ftri(g, lw, '#e8eef6');
      fline(g, nw[0], nw[1], '#b8c4d8'); fline(g, lw[0], lw[1], '#c8d2e2');
      fline(g, lw[0], lw[2], EDGE); fline(g, lw[2], lw[1], EDGE); fline(g, nw[1], nw[2], EDGE);
    }
  };
  // where the aeroplane waits, at the sheet's edge below the first place
  var PARK = { x: 2774, y: 108.5 };

  // the parts of ONE DAY… that move
  var drawIsles5 = function (ctx, st, t) {
    var S = sprites5(), q = function (i) { return node(35 + i); }, p, k, i, x, y;
    // the sun's rays going round
    for (k = 0; k < 8; k++) { var ra = k * Math.PI / 4 + t * 0.008, rl = 2.4 + (st.reduce ? 0 : Math.sin(t * 0.06 + k * 1.7) * 0.5); for (var r = 6.2; r < 6.2 + rl; r += HP) R(ctx, 2767 + Math.cos(ra) * r - 0.5, 47.5 + Math.sin(ra) * r - 0.5, 1, 1, '#ffb21e'); }
    // the wishes twinkling
    [[2949, 46.5], [3073, 120], [3259, 45.5], [2826, 120]].forEach(function (s, j) { if ((t + j * 41) % 110 < 9) { R(ctx, s[0] - 0.25, s[1] - 3.5, HP, 7, '#ffffff'); R(ctx, s[0] - 3.5, s[1] - 0.25, 7, HP, '#ffffff'); } });
    // the Poké Ball: still, then a wobble, wobble, wobble… click
    var bp5 = (t % 170) / 170, bi = bp5 < 0.42 ? Math.round(Math.sin(bp5 / 0.42 * Math.PI * 3) * 2 * (1 - bp5 / 0.6)) : 0;
    BB.blit(ctx, S.ball[bi + 2], 2803, 55);
    if (bp5 > 0.45 && bp5 < 0.52) { R(ctx, 2813 - 0.25, 50, HP, 3, '#fff6b0'); R(ctx, 2811.5, 51.25, 3, HP, '#fff6b0'); }
    // the globe turning
    p = q(1);
    BB.blit(ctx, S.globe[Math.floor(t / 9) % 12], p.x + 19 - 12, 56);
    // snow over New York, and the tree's lights
    p = q(2);
    if (!st.reduce) for (i = 0; i < 16; i++) { x = p.x - 26 + ((i * 29 + Math.sin(t * 0.02 + i) * 3) % 52 + 52) % 52; y = 50 + ((i * 41 + t * 0.25) % 64); R(ctx, x, y + HP, 1, HP, 'rgba(120,140,190,0.35)'); R(ctx, x, y, 1, 1, '#ffffff'); }
    [[-3, 107, '#ff4a4a'], [3.2, 105.5, '#4aa8ff'], [-1.5, 101.5, '#ffd84a'], [2, 97.5, '#ff4a4a'], [-0.5, 95.5, '#ffffff']].forEach(function (b, j) { var on = (Math.floor(t / 20) + j) % 3; disc(ctx, p.x + 14 + b[0], b[1], 0.8, on ? b[2] : '#fff8d0'); });
    // the waterfall falling
    p = q(3);
    for (k = 0; k < 4; k++) { y = 91.5 + ((t * 0.35 + k * 3.4) % 13); R(ctx, p.x + 12 + (k % 2) * 1.2, y, 0.5, 1.5, '#ffffff'); }
    if (!st.reduce) for (k = 0; k < 3; k++) { var sph = ((t * 0.08 + k * 0.33) % 1); R(ctx, p.x + 13 + (k - 1) * 2.5 * sph, 104.6 - Math.sin(sph * Math.PI) * 2, HP, HP, '#ffffff'); }
    // the penguin waddling, and the southern lights
    p = q(4);
    var pw = Math.floor(t / 14) % 2;
    BB.blit(ctx, S.peng[pw], p.x - 12 - 6, 104 - 14.5 - (st.reduce ? 0 : Math.abs(Math.sin(t * Math.PI / 14)) * 0.5));
    for (k = 0; k < 3; k++) { ctx.globalAlpha = 0.55 + (st.reduce ? 0 : Math.sin(t * 0.04 + k * 2) * 0.2); for (x = 0; x < 20; x += HP) R(ctx, p.x + 16 + x, 44 + k * 2.2 + Math.sin(x * 0.35 + t * 0.03 + k) * 1.4, HP, 1, ['#7af0a0', '#5ad8e8', '#ff9ad8'][k]); }
    ctx.globalAlpha = 1;
    // the kangaroo hopping back and forth
    p = q(5);
    var hop = Math.floor(t / 70), hph = (t % 70) / 70, dir = hop % 2 ? -1 : 1, rx0 = dir > 0 ? p.x - 24 : p.x - 15, air = hph < 0.45, hu = air ? hph / 0.45 : 1;
    var rxx = st.reduce ? p.x - 19 : rx0 + dir * 9 * hu, ryy = 98 - (air && !st.reduce ? Math.sin(hu * Math.PI) * 5 : 0);
    shadow(ctx, rxx + 1, 98, 3.5);
    BB.blit(ctx, S.roo[air && !st.reduce ? 1 : 0][dir > 0 ? 0 : 1], dir > 0 ? rxx - 7 : rxx - 9, ryy - 16.4);
    // the rainbow shimmering, a glint running along each band, and the butterfly
    p = q(6);
    if (!st.reduce) for (i = 0; i < 6; i++) { var ga = Math.PI + ((t * 0.006 + i * 0.05) % 1.4) * Math.PI / 1.0, gr = 27.5 - (i + 0.5) * 1.5; if (ga > Math.PI * 2) continue; ctx.globalAlpha = 0.5; for (var da = -0.12; da < 0.12; da += 0.02) R(ctx, p.x + Math.cos(ga + da) * gr - 0.25, 111 + Math.sin(ga + da) * gr - 0.25, HP * 2, HP * 2, '#ffffff'); ctx.globalAlpha = 1; }
    [[-19, 92], [17, 90], [0, 80]].forEach(function (s, j) { if ((t + j * 37) % 95 < 8) { R(ctx, p.x + s[0] - 0.25, s[1] - 1.5, HP, 3, '#ffffff'); R(ctx, p.x + s[0] - 1.5, s[1] - 0.25, 3, HP, '#ffffff'); } });
    var bfx = p.x - 16 + Math.sin(t * 0.021) * 6, bfy = 64 + Math.sin(t * 0.037) * 3;
    BB.blit(ctx, S.fly[st.reduce ? 0 : Math.floor(t / 7) % 2], bfx - 7, bfy - 5);
    // Bonnie's chocolate bar out for a walk
    p = q(7);
    var cw = st.reduce ? 0 : Math.sin(t * 0.016) * 4;
    BB.blit(ctx, S.choc[st.reduce ? 0 : Math.floor(t / 8) % 2], p.x - 17 + cw - 5, 88 - 13.5);
    // the volcano smoking, its lava glowing
    p = q(8);
    var vg = ctx.createRadialGradient(p.x + 17, 56, 1, p.x + 17, 56, 10);
    vg.addColorStop(0, 'rgba(255,140,60,' + (0.35 + Math.sin(t * 0.07) * 0.12) + ')'); vg.addColorStop(1, 'rgba(255,100,40,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = vg; ctx.fillRect(p.x + 7, 46, 20, 20); ctx.restore();
    if (!st.reduce) for (k = 0; k < 4; k++) { var sp = ((t * 0.35 + k * 22) % 88) / 88, sx = p.x + 17 + Math.sin(sp * 5 + k) * 1.5 + sp * 4, sy = 53 - sp * 13, sr = 1.3 + sp * 2.2; ctx.globalAlpha = 1 - sp * 0.85; disc(ctx, sx, sy, sr + 0.5, '#6a6070'); disc(ctx, sx, sy, sr, '#c8c0c8'); disc(ctx, sx - sr * 0.3, sy - sr * 0.3, sr * 0.4, '#e8e4ec'); }
    ctx.globalAlpha = 1;
    // a bee buzzing round Queen Bee's hive, its dotted path behind it
    p = q(9);
    var hcx = p.x + 12, hcy = 97, ba = t * 0.03, bpos = function (a) { return [hcx + Math.sin(a) * 14, hcy - 2 + Math.sin(a * 2) * 6]; };
    if (!st.reduce) for (k = 2.5; k < 26; k += 1.8) { var tp = bpos(ba - k * 0.075); ctx.globalAlpha = 0.9 * (1 - k / 28); R(ctx, tp[0] - 0.5, tp[1] - 0.5, 1, 1, '#2e2640'); }
    ctx.globalAlpha = 1;
    var bxy = bpos(ba);
    BB.blit(ctx, S.bee[st.reduce ? 0 : Math.floor(t / 3) % 2][Math.cos(ba) >= 0 ? 0 : 1], bxy[0] - 5, bxy[1] - 5);
  };

  var island = null, island2 = null, island3 = null, island4 = null, island5 = null, cloudC = null;
  // the path between two levels, as a list of dots
  var dots = function (i) {
    var a = node(i), b = node(i + 1), out = [], n = Math.round((b.x - a.x) / 8);
    for (var k = 1; k < n; k++) { var t = k / n; out.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t + Math.sin(t * Math.PI) * -4]); }
    return out;
  };
  var medal = function (g, x, y, i, st, t) {
    var w = WORLD[i], open = i < st.unlocked, done = st.cleared.indexOf(i + 1) > -1, here = i + 1 === st.at;
    // two digits need the room, and each land's last level is the big one
    var e = i === 19 || i === 29 || i === 44 ? 1.8 : i >= 9 ? 1.2 : 0;
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
    widthFor: function (won, won2, won3, won4) { return won4 ? MW5 : won3 ? MW4 : won2 ? MW3 : won ? MW2 : ISLE[0][1]; },
    node: node,
    draw: function (ctx, st) {
      var W = BB.W, t = st.reduce ? 0 : st.t, cx = st.camX, i, k, p, lands = st.won4 ? 5 : st.won3 ? 4 : st.won2 ? 3 : st.won ? 2 : 1, MW = ISLE[lands - 1][1], NN = [10, 20, 30, 35, 45][lands - 1];
      if (!island) island = build(0);
      if (st.won && !island2) island2 = build(1);
      if (st.won2 && !island3) island3 = build(2);
      if (st.won3 && !island4) island4 = build(3);
      if (st.won4 && !island5) island5 = build(4);
      ctx.save();
      ctx.translate(-snap(cx), 0);
      BB.blit(ctx, island, 0, 0);
      if (island2) BB.blit(ctx, island2, SPLIT, 0);
      if (island3) BB.blit(ctx, island3, SPLIT2, 0);
      if (island4) BB.blit(ctx, island4, SPLIT3, 0);
      if (island5) BB.blit(ctx, island5, SPLIT4, 0);
      // glints on the sea (not on the land, nor on the paper)
      for (i = 0; i < 40 * lands; i++) {
        var gx = (i * 53 + t * 0.2) % MW, gy = (i * 37) % H, onLand = (gx < 654 || gx > 756) && (gx < 1414 || gx > 1516) && (gx < 2174 || gx > 2276) && gy > coastTop(gx) - 4 && gy < coastBot(gx) + 4;
        if (gx > 2644) onLand = gx > PX0 - 6 && gx < PX1 + 4 && gy > 33 && gy < 131;
        if (onLand) continue;
        if ((t + i * 13) % 90 < 50) R(ctx, gx, gy, 2, HP, 'rgba(255,255,255,0.55)');
      }
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
      if (island4 && cx + W > SPLIT3 - 90 && cx < SPLIT4) drawIsles4(ctx, st, t);
      // the paper aeroplane's crossing, from Saint-Malo up over the sea and
      // down onto the sheet: where Bonnie is on it, and how high
      var a34 = node(34), b35 = node(35), flying = island5 && st.bonnie.x > a34.x && st.bonnie.x < b35.x;
      var flight = function (x) { var u = (x - a34.x) / (b35.x - a34.x); return { u: u, y: a34.y + (b35.y - a34.y) * u - Math.sin(u * Math.PI) * 4, lift: Math.sin(u * Math.PI) * 16 }; };
      if (island5 && cx + W > SPLIT4 - 120) {
        drawIsles5(ctx, st, t);
        // the aeroplane waiting at the edge of the sheet, when he isn't on it
        if (!flying) { shadow(ctx, PARK.x + 1, PARK.y + 3.5, 9); plane(ctx, PARK.x, PARK.y, 1, 0.05); }
      }
      // the path: bright where you've been, faint where you haven't; over
      // the water between the islands it's the boat's wake, dashes of foam
      for (i = 0; i < NN - 1; i++) {
        if (i === 34) {
          // the aeroplane's: a dotted line drawn through the sky
          var open34 = i + 1 < st.unlocked;
          for (var fx5 = a34.x + 6, j5 = 0; fx5 < b35.x - 4; fx5 += 5, j5++) {
            var fl5 = flight(fx5), fy5 = fl5.y - fl5.lift + 2;
            if (open34) { if ((j5 + Math.floor(t / 20)) % 3) { R(ctx, fx5 - 1.5, fy5 + HP, 3, HP, 'rgba(30,40,90,0.25)'); R(ctx, fx5 - 1.5, fy5, 3, HP * 2, 'rgba(255,255,255,0.85)'); } }
            else if (j5 % 2 === 0) R(ctx, fx5 - 1, fy5, 2, HP, 'rgba(255,255,255,0.4)');
          }
          continue;
        }
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
      for (i = 0; i < [5, 9, 13, 16, 20][lands - 1]; i++) {
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
      if (flying) {
        // off to the One Day lands on his paper aeroplane, Bear peeping over
        // his shoulder, up over the sea and down onto the sheet
        var fl = flight(bp.x), bob = st.reduce ? 0 : Math.sin(t * 0.12) * 0.8, ply = bp.y - fl.lift + 2 + bob, s3 = BS.idle;
        var pitch = Math.atan(16 * Math.PI * Math.cos(fl.u * Math.PI) * st.facing / (b35.x - a34.x)) * 0.8;
        ctx.globalAlpha = 0.6; shadow(ctx, bp.x, bp.y + 3, 10 - fl.lift * 0.25); ctx.globalAlpha = 1;
        plane(ctx, bp.x, ply, st.facing, pitch, 'far');
        BB.draw(ctx, A.bearHead, bp.x - st.facing * 10 - 4.5, ply - 6.5 + Math.sin(pitch) * 10);
        BB.draw(ctx, s3, bp.x - s3.w / 2, ply - s3.h + 2.5, st.facing < 0, st.power === 2 ? A.bonnie.red : st.v);
        hat(s3, bp.x - s3.w / 2, ply - s3.h + 2.5, st.facing < 0);
        plane(ctx, bp.x, ply, st.facing, pitch, 'near');
        ctx.restore();
        return;
      }
      if (bp.x >= 1516 && bp.x <= a34.x && ys) {
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
