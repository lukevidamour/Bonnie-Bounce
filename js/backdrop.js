/* ==========================================================================
   backdrop.js — the scenery behind each world.

   Painted the way modern pixel-art adventures paint their distance: a
   graded sky, then three or four layers that slide past slower the
   further away they are, each fainter and bluer than the one in front
   (aerial perspective — the far hills take on the colour of the sky).
   Everything round is lit from the top left, like the sprites: a shadow
   tone low on the right, the base, and a highlight up on the left. Trees
   are clusters of leaf-blobs, clouds have bellies, and hills carry a
   lit rim along their crest.

   Each layer is drawn once per world into a 512-game-pixel strip that
   repeats, at the screen's full density.
   ========================================================================== */
(function () {
  'use strict';
  var H = BB.H, SW = 512, HP = 1 / BB.R, snap = BB.snap, mix = BB.mix;

  var strip = function (h) { return BB.surface(SW, h || H); };
  var R = function (g, x, y, w, h, col) {
    g.fillStyle = col;
    [-SW, 0, SW].forEach(function (o) { if (x + o + w > -2 && x + o < SW + 2) g.fillRect(snap(x + o), snap(y), Math.max(HP, snap(w)), Math.max(HP, snap(h))); });
  };
  // a filled disc, wrapping round the strip's ends
  var disc = function (g, cx, cy, r, col) {
    g.fillStyle = col;
    for (var y = -r; y <= r; y += HP) {
      var half = Math.sqrt(Math.max(0, r * r - y * y));
      [-SW, 0, SW].forEach(function (o) {
        if (cx + half + o < -2 || cx - half + o > SW + 2) return;
        g.fillRect(snap(cx - half + o), snap(cy + y), Math.max(HP, snap(half * 2)), HP);
      });
    }
  };
  // a round thing lit from the top left: shadow, body, highlight
  var ball = function (g, x, y, r, c) {
    disc(g, x + r * 0.12, y + r * 0.16, r, c[0]);
    disc(g, x, y, r * 0.9, c[1]);
    if (c[2]) disc(g, x - r * 0.3, y - r * 0.32, r * 0.48, c[2]);
  };
  /* A canopy of leaves: many small blobs inside an ellipse, all their
     shadows first, then their bodies, then highlights on the lit side. */
  var canopy = function (g, cx, cy, rw, rh, rnd, c) {
    var pts = [], n = Math.max(6, Math.round(rw * rh / 7));
    for (var i = 0; i < n; i++) {
      var a = rnd() * Math.PI * 2, d = Math.sqrt(rnd());
      pts.push([cx + Math.cos(a) * rw * d, cy + Math.sin(a) * rh * d, 2.4 + rnd() * 3.2]);
    }
    pts.sort(function (p, q) { return p[1] - q[1]; });
    pts.forEach(function (p) { disc(g, p[0] + 0.8, p[1] + 1.2, p[2], c[0]); });
    pts.forEach(function (p) { disc(g, p[0], p[1], p[2] * 0.88, c[1]); });
    pts.forEach(function (p) { if (p[0] < cx + rw * 0.25 && p[1] < cy + rh * 0.1) disc(g, p[0] - p[2] * 0.3, p[1] - p[2] * 0.35, p[2] * 0.42, c[2]); });
    if (c[3]) for (i = 0; i < n / 3; i++) { var q = pts[Math.floor(rnd() * pts.length)]; if (q[1] < cy) R(g, q[0] - 1, q[1] - 1, HP * 2, HP * 2, c[3]); }
  };
  var tree = function (g, x, ground, h, rnd, c, trunk) {
    R(g, x - 1.5, ground - h * 0.55, 3, h * 0.55, trunk[0]);
    R(g, x - 1.5, ground - h * 0.55, 1, h * 0.55, trunk[1]);
    canopy(g, x, ground - h * 0.68, h * 0.42, h * 0.36, rnd, c);
  };
  // a fluffy cloud with a shaded belly
  var cloud = function (g, x, y, s, c) {
    var parts = [[0, 0, 6], [9, -4, 8], [20, -1, 7], [28, 2, 5], [13, 3, 6], [-6, 3, 4]];
    parts.forEach(function (p) { disc(g, x + p[0] * s, y + p[1] * s + 1.6 * s, p[2] * s, c[0]); });
    parts.forEach(function (p) { disc(g, x + p[0] * s, y + p[1] * s, p[2] * s * 0.95, c[1]); });
    parts.forEach(function (p) { disc(g, x + p[0] * s - p[2] * s * 0.25, y + p[1] * s - p[2] * s * 0.3, p[2] * s * 0.55, c[2]); });
  };
  // land: f(x) gives the height of its edge; lit rim on top, a darker band below
  var land = function (g, f, c, depth) {
    for (var x = 0; x < SW; x += HP) {
      var y = snap(f(x));
      R(g, x, y, HP, H - y, c[1]);
      R(g, x, y, HP, HP * 2, c[2]);
      if (c[0]) R(g, x, y + (depth || 10), HP, H, c[0]);
    }
  };
  /* A mountain, drawn like one rather than a triangle: its edges wander,
     one side has a shoulder partway down, the ridge between the sunlit
     face (left) and the shaded one (right) is crooked, gullies streak the
     lit face, and the snow cap drips down them. */
  var mountain = function (g, cx, base, w, h, c, snow) {
    var sd = cx * 0.37 + w, pk = cx + Math.sin(sd) * w * 0.07, sh = Math.sin(sd * 1.7) > 0 ? 1 : -1;
    var gully = BB.mix(c[1], c[0], 0.55), rim = BB.mix(c[1], '#ffffff', 0.25);
    var snowTo = h * (0.24 + 0.06 * Math.sin(sd * 2.3));
    for (var y = 0; y < h; y += HP) {
      var k = y / h, yy = base - h + y, bump = Math.max(0, 0.16 - Math.abs(k - 0.5)) * 1.4;
      var jl = Math.sin(y * 0.45 + sd) * 1.1 + Math.sin(y * 1.3 + sd * 2) * 0.45;
      var jr = Math.sin(y * 0.5 + sd * 3) * 1.1 + Math.sin(y * 1.1 + sd) * 0.45;
      var xl = pk - (k * w / 2) * (1 + (sh < 0 ? bump : 0)) - jl * k, xr = pk + (k * w / 2) * (1 + (sh > 0 ? bump : 0)) + jr * k;
      var rx = pk + (Math.sin(y * 0.16 + sd) * 2.2 + 3) * k;
      R(g, xl, yy, rx - xl, HP, c[1]);
      R(g, rx, yy, xr - rx, HP, c[0]);
      if (k > 0.05) R(g, xl, yy, HP, HP, rim);
      // gullies down the lit face, and a crease on the shaded one
      var gx1 = rx - (rx - xl) * 0.38 + Math.sin(y * 0.3 + sd) * 0.8, gx2 = rx - (rx - xl) * 0.72 + Math.sin(y * 0.25 + sd * 2) * 0.8;
      if (k > 0.18) { R(g, gx1, yy, HP, HP, gully); if (k > 0.35) R(g, gx2, yy, HP, HP, gully); }
      if (k > 0.3) R(g, rx + (xr - rx) * 0.45 + Math.sin(y * 0.2) * 0.6, yy, HP, HP, BB.mix(c[0], '#000000', 0.06));
      if (snow) {
        if (y < snowTo) { R(g, xl, yy, rx - xl, HP, snow[1]); R(g, rx, yy, xr - rx, HP, snow[0]); }
        else if (y < snowTo + h * 0.16) {
          // the snow runs a little further down the gullies and the ridge
          var dd = (y - snowTo) / (h * 0.16);
          if (dd < 0.9) R(g, gx1 - 1 + dd, yy, 2.5 - dd * 2, HP, snow[1]);
          if (dd < 0.6) R(g, gx2 - 1 + dd, yy, 2 - dd * 2, HP, snow[1]);
          if (dd < 0.75) R(g, rx - 1.5 + dd, yy, 3 - dd * 3, HP, snow[0]);
        }
      }
    }
  };
  // mist settling at the foot of a layer
  var mist = function (g, y, h, col) {
    for (var i = 0; i < h; i += HP) { g.globalAlpha = 0.5 * (i / h); R(g, 0, y + i, SW, HP, col); }
    g.globalAlpha = 1;
  };
  var sun = function (g, x, y, r, c) {
    [[r * 2.4, 0.12], [r * 1.8, 0.18], [r * 1.35, 0.3]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, x, y, q[0], c[0]); });
    g.globalAlpha = 1;
    disc(g, x, y, r, c[1]); disc(g, x - r * 0.25, y - r * 0.25, r * 0.6, c[2]);
  };

  var GEN = {
    hills: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      sun(g, 70, 26, 9, ['#fff6c8', '#fff3b0', '#fffbe6']);
      for (var i = 0; i < 7; i++) cloud(g, rnd() * SW, 14 + rnd() * 34, 0.7 + rnd() * 0.6, ['#cfe6ff', '#ffffff', '#ffffff']);
      L.push({ c: far, f: 0.05 });
      var mt = strip(), m = mt.getContext('2d');
      for (i = 0; i < 6; i++) mountain(m, i * 90 + rnd() * 40, 104, 70 + rnd() * 40, 30 + rnd() * 22, [mix('#8a9ed8', hz, 0.55), mix('#a8b8ec', hz, 0.55)], [mix('#dfe8ff', hz, 0.3), '#ffffff']);
      mist(m, 84, 22, hz);
      L.push({ c: mt, f: 0.1 });
      var mid = strip(), d = mid.getContext('2d');
      var c1 = [mix('#4fae4a', hz, 0.45), mix('#7fd65a', hz, 0.45), mix('#b6f08a', hz, 0.4)];
      land(d, function (x) { return 98 + Math.sin(x * 0.021) * 9 + Math.sin(x * 0.057 + 1) * 4; }, [c1[0], c1[1], c1[2]], 14);
      for (i = 0; i < 14; i++) { var tx = rnd() * SW, gy = 99 + Math.sin(tx * 0.021) * 9 + Math.sin(tx * 0.057 + 1) * 4; tree(d, tx, gy + 2, 14 + rnd() * 8, rnd, [mix('#2e8a3c', hz, 0.45), mix('#4fb04a', hz, 0.42), mix('#8ddc6a', hz, 0.35)], [mix('#7a5236', hz, 0.4), mix('#a8764c', hz, 0.4)]); }
      // a windmill on the far rise
      var wx = 300, wy = 98 + Math.sin(300 * 0.021) * 9 + Math.sin(300 * 0.057 + 1) * 4;
      R(d, wx - 3, wy - 16, 6, 16, mix('#f4ecd8', hz, 0.4)); R(d, wx - 4, wy - 19, 8, 3, mix('#d86a5a', hz, 0.4));
      for (var a = 0; a < 4; a++) for (var k = 0; k < 9; k += HP) R(d, wx + Math.cos(a * 1.57 + 0.4) * k, wy - 17 + Math.sin(a * 1.57 + 0.4) * k, HP * 2, HP * 2, mix('#fff6e6', hz, 0.35));
      mist(d, 104, 22, hz);
      L.push({ c: mid, f: 0.22 });
      var near = strip(), n = near.getContext('2d');
      land(n, function (x) { return 112 + Math.sin(x * 0.03 + 2) * 8 + Math.sin(x * 0.09) * 3; }, ['#2f9a3e', '#58c24a', '#a0ec70'], 12);
      for (i = 0; i < 10; i++) { var nx = rnd() * SW, ny = 113 + Math.sin(nx * 0.03 + 2) * 8 + Math.sin(nx * 0.09) * 3; tree(n, nx, ny + 3, 22 + rnd() * 10, rnd, ['#22803a', '#3fae46', '#86da5e', '#d6ff9e'], ['#5c3a24', '#8a5a36']); }
      for (i = 0; i < 60; i++) { var fx = rnd() * SW, fy = 116 + Math.sin(fx * 0.03 + 2) * 8 + rnd() * 10; R(n, fx, fy, HP * 2, HP * 2, ['#ffd0e8', '#fff6a0', '#ffffff'][i % 3]); }
      L.push({ c: near, f: 0.38 });
      return L;
    },
    park: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      sun(g, 420, 26, 10, ['#fff6c8', '#ffef9a', '#fffbe6']);
      for (var i = 0; i < 6; i++) cloud(g, rnd() * SW, 12 + rnd() * 30, 0.6 + rnd() * 0.6, ['#cfe4ff', '#ffffff', '#ffffff']);
      L.push({ c: far, f: 0.05 });
      var town = strip(), t = town.getContext('2d');
      var x = 0, cols = ['#ffd2b4', '#cfe0ff', '#fff0b0', '#e6d4ff', '#d0f4d8'], roofs = ['#ef7a6a', '#7a8ce0', '#f0a050'];
      while (x < SW) {
        var w = 20 + Math.floor(rnd() * 18), h = 24 + Math.floor(rnd() * 22), top = 118 - h, col = mix(cols[Math.floor(rnd() * cols.length)], hz, 0.35), roof = mix(roofs[Math.floor(rnd() * 3)], hz, 0.35);
        R(t, x, top, w, h + 10, col); R(t, x + w - 3, top, 3, h + 10, mix(col, '#5a6c98', 0.18));
        for (var r = 0; r < w / 2 + 2; r += HP) R(t, x - 2 + r, top - r, w + 4 - r * 2, HP, r < 1 ? mix(roof, '#ffffff', 0.25) : roof);
        for (var wy = top + 5; wy < 112; wy += 8) for (var wx = x + 4; wx < x + w - 5; wx += 7) { R(t, wx, wy, 4, 5, mix('#6a7cb0', hz, 0.3)); R(t, wx + 0.5, wy + 0.5, 1.5, 2, mix('#e6f6ff', hz, 0.2)); }
        x += w + 3 + Math.floor(rnd() * 9);
      }
      mist(t, 96, 30, hz);
      L.push({ c: town, f: 0.16 });
      var near = strip(), n = near.getContext('2d');
      land(n, function (xx) { return 118 + Math.sin(xx * 0.04) * 3; }, ['#2f9a3e', '#58c24a', '#a0ec70'], 8);
      for (i = 0; i < 9; i++) tree(n, i * 58 + rnd() * 24, 121, 30 + rnd() * 10, rnd, ['#22803a', '#45b44a', '#8ce064', '#e0ffb0'], ['#5c3a24', '#8a5a36']);
      // bunting strung between the trees
      for (var b = 0; b < SW; b += 4) { var by = 82 + Math.sin(b * 0.05) * 4; R(n, b, by, 4, HP, '#ffffff'); if (b % 8 === 0) { R(n, b, by + HP, 3, 1.5, ['#ff7a8a', '#ffd84a', '#6ac8ff', '#8ee06a'][(b / 8) % 4]); R(n, b + 0.5, by + 2, 2, 1, ['#ff7a8a', '#ffd84a', '#6ac8ff', '#8ee06a'][(b / 8) % 4]); } }
      L.push({ c: near, f: 0.4 });
      return L;
    },
    beach: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      sun(g, 140, 30, 11, ['#fff2c0', '#fff0a0', '#fffbe6']);
      for (var i = 0; i < 6; i++) cloud(g, rnd() * SW, 12 + rnd() * 34, 0.7 + rnd() * 0.6, ['#c6ecff', '#ffffff', '#ffffff']);
      L.push({ c: far, f: 0.05 });
      var sea = strip(), s = sea.getContext('2d');
      // a distant island with its lighthouse and palms
      ball(s, 140, 99, 15, [mix('#4a8a5a', hz, 0.4), mix('#6ab06a', hz, 0.4), mix('#9ad88a', hz, 0.35)]);
      ball(s, 162, 101, 10, [mix('#4a8a5a', hz, 0.4), mix('#6ab06a', hz, 0.4), mix('#9ad88a', hz, 0.35)]);
      R(s, 156, 70, 6, 20, mix('#ffffff', hz, 0.2)); for (var k = 0; k < 5; k++) R(s, 156, 72 + k * 4, 6, 2, mix('#ef5a5a', hz, 0.25));
      R(s, 155, 66, 8, 4, mix('#3a4a7a', hz, 0.3)); R(s, 157, 67, 4, 2, '#fff6a0');
      R(s, 0, 95, SW, 50, '#3a9ae0');
      for (var y = 95; y < 142; y += HP) { g.globalAlpha = 1; R(s, 0, y, SW, HP, mix('#7ccaf4', '#2c7ccc', Math.min(1, (y - 95) / 40))); }
      R(s, 0, 95, SW, HP * 2, '#e8fbff');
      for (i = 0; i < 90; i++) { var gx = rnd() * SW, gy = 97 + rnd() * 34; R(s, gx, gy, 2 + rnd() * 5, HP, rnd() > 0.4 ? mix('#ffffff', '#7ccaf4', (gy - 95) / 40) : '#2c7ccc'); }
      // a sailing boat
      for (y = 0; y < 14; y += HP) R(s, 330 + y * 0.4, 80 + y, 10 - y * 0.6, HP, '#ffffff');
      R(s, 326, 94, 18, 3, '#c88a58'); R(s, 334, 78, HP * 2, 16, '#6a4a3a');
      L.push({ c: sea, f: 0.14 });
      return L;
    },
    reef: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      // the surface far above, rippling light
      for (var i = 0; i < 40; i++) { var x = rnd() * SW; g.globalAlpha = 0.25; R(g, x, 4 + rnd() * 10, 6 + rnd() * 10, HP * 2, '#bfefff'); }
      g.globalAlpha = 1;
      L.push({ c: far, f: 0.04 });
      var back = strip(), b = back.getContext('2d');
      for (i = 0; i < 9; i++) { var cx = i * 60 + rnd() * 30; ball(b, cx, 128, 20 + rnd() * 12, [mix('#1c4a9c', hz, 0.5), mix('#2a62b4', hz, 0.5), mix('#3c7ccc', hz, 0.45)]); }
      for (i = 0; i < 16; i++) { var kx = rnd() * SW, kh = 30 + rnd() * 40; for (var y2 = 0; y2 < kh; y2 += HP) R(b, kx + Math.sin(y2 * 0.18) * 2, 124 - y2, 2, HP, mix('#2a8a88', hz, 0.45)); }
      mist(b, 100, 30, hz);
      L.push({ c: back, f: 0.15 });
      var near = strip(), n = near.getContext('2d');
      for (i = 0; i < 8; i++) {
        var px = i * 66 + rnd() * 30, pc = [['#c44a8a', '#ef6aa8', '#ffb0d4'], ['#d0703a', '#f5a050', '#ffd090'], ['#6a4ac4', '#8c6ae6', '#c0a8ff']][i % 3];
        ball(n, px, 126, 10 + rnd() * 6, pc);
        for (var f = 0; f < 4; f++) { var bx = px - 8 + rnd() * 16; for (var yy = 0; yy < 14 + rnd() * 10; yy += HP) R(n, bx + Math.sin(yy * 0.3 + f) * 1.2, 120 - yy, 1.5, HP, pc[1]); ball(n, bx, 120 - 16 - rnd() * 4, 2.2, pc); }
      }
      L.push({ c: near, f: 0.32 });
      return L;
    },
    woods: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      for (var i = 0; i < 90; i++) { var sx = rnd() * SW, sy = rnd() * 70, big = rnd() > 0.85; R(g, sx, sy, big ? 1 : HP, big ? 1 : HP, rnd() > 0.5 ? '#ffffff' : '#ffe0ff'); if (big) { R(g, sx - HP, sy + 0.25, 2, HP, '#c8b4ff'); } }
      sun(g, 380, 32, 14, ['#c8b4ff', '#fff8e0', '#ffffff']);
      disc(g, 384, 28, 2.5, '#efe6c8'); disc(g, 375, 37, 1.8, '#efe6c8'); disc(g, 387, 38, 1.5, '#efe6c8');
      L.push({ c: far, f: 0.03 });
      var hills = strip(), h = hills.getContext('2d');
      land(h, function (x) { return 88 + Math.sin(x * 0.024) * 10 + Math.sin(x * 0.07) * 4; }, [mix('#3a2468', hz, 0.3), mix('#4c3484', hz, 0.35), mix('#7a62b8', hz, 0.3)], 18);
      for (i = 0; i < 12; i++) { var tx = rnd() * SW; tree(h, tx, 92 + Math.sin(tx * 0.024) * 10, 16 + rnd() * 8, rnd, [mix('#2a1c58', hz, 0.3), mix('#3c2a74', hz, 0.3), mix('#5c4a9c', hz, 0.25)], ['#2a1c48', '#3a2a5c']); }
      mist(h, 92, 30, hz);
      L.push({ c: hills, f: 0.12 });
      var near = strip(), n = near.getContext('2d');
      for (i = 0; i < 9; i++) {
        var nx = i * 58 + rnd() * 20, nh = 70 + rnd() * 30;
        R(n, nx - 2.5, 128 - nh * 0.6, 5, nh * 0.6, '#2a1a4a'); R(n, nx - 2.5, 128 - nh * 0.6, 1.5, nh * 0.6, '#3e2c66');
        canopy(n, nx, 128 - nh * 0.7, nh * 0.3, nh * 0.26, rnd, ['#1e1442', '#2e2060', '#4a3888', '#7a68c0']);
      }
      // glowing toadstools under the trees
      for (i = 0; i < 18; i++) { var mx = rnd() * SW, mc = rnd() > 0.5 ? ['#ff8ad8', '#ffd0f0'] : ['#7ae8ff', '#d0faff']; R(n, mx - 0.5, 122, 1, 4, '#e8e0ff'); disc(n, mx, 122, 2.2, mc[0]); R(n, mx - 1, 121, 1, HP, mc[1]); }
      L.push({ c: near, f: 0.35 });
      return L;
    },
    cave: function (rnd, th) {
      var hz = th.sky[1], L = [];
      var far = strip(), g = far.getContext('2d');
      // rock strata: layers hanging from the roof and heaped on the floor,
      // each further one hazier, with crystals glinting in the dark
      [[0.55, 34, 40, 96], [0.3, 24, 30, 108]].forEach(function (lay, li) {
        var col = [mix('#1c1634', hz, lay[0]), mix('#2a2050', hz, lay[0]), mix('#3c2e6a', hz, lay[0])];
        land(g, function (x) { return lay[3] + Math.sin(x * 0.03 + li * 2) * 8 + Math.sin(x * 0.11 + li) * 3; }, col, 6);
        for (var x = 0; x < SW; x += HP) {
          var y = lay[1] + Math.sin(x * 0.04 + li * 3) * 10 + Math.sin(x * 0.13) * 4 + (Math.sin(x * 0.7 + li) > 0.85 ? 8 : 0);
          R(g, x, 0, HP, y, col[1]); R(g, x, y - HP * 2, HP, HP * 2, col[0]);
        }
      });
      for (var i = 0; i < 26; i++) { var cx = rnd() * SW, cy = 40 + rnd() * 70, cc = rnd() > 0.5 ? '#6ad8ff' : '#ff8ad8'; g.globalAlpha = 0.22; disc(g, cx, cy, 4, cc); g.globalAlpha = 1; R(g, cx - HP, cy - 1.5, HP * 2, 3, cc); R(g, cx - 1, cy - HP, 2, HP * 2, cc); }
      L.push({ c: far, f: 0.1 });
      var mid = strip(), m = mid.getContext('2d');
      for (i = 0; i < 18; i++) { var sx = rnd() * SW, sl = 12 + rnd() * 28; for (var k = 0; k < sl; k += HP) R(m, sx - (1 - k / sl) * 3, 16 + k, (1 - k / sl) * 6, HP, mix('#2e2458', hz, 0.2)); }
      for (i = 0; i < 7; i++) { var px = i * 76 + rnd() * 30; R(m, px, 0, 12, H, '#1c1636'); R(m, px + 1, 0, 3, H, '#2c2454'); ball(m, px + 6, 130, 14, ['#16122c', '#1c1636', '#262048']); }
      L.push({ c: mid, f: 0.3 });
      return L;
    },
    snow: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      sun(g, 90, 24, 8, ['#ffffff', '#fffbe6', '#ffffff']);
      for (var i = 0; i < 5; i++) cloud(g, rnd() * SW, 10 + rnd() * 24, 0.7 + rnd() * 0.5, ['#d8ecff', '#ffffff', '#ffffff']);
      L.push({ c: far, f: 0.04 });
      var mt = strip(), m = mt.getContext('2d');
      for (i = 0; i < 6; i++) mountain(m, i * 92 + rnd() * 40, 112, 80 + rnd() * 40, 46 + rnd() * 26, [mix('#7c9cd0', hz, 0.45), mix('#a8c4ee', hz, 0.45)], [mix('#cfe0f8', hz, 0.2), '#ffffff']);
      mist(m, 90, 26, hz);
      L.push({ c: mt, f: 0.1 });
      var pines = strip(), p = pines.getContext('2d');
      [[0.2, 112, 18], [0, 122, 26]].forEach(function (row, ri) {
        for (var j = 0; j < 22; j++) {
          var tx = rnd() * SW, th2 = row[2] + rnd() * 10, base = row[1];
          for (var k = 0; k < th2; k += HP) {
            var tier = (k % 8) / 8, w = 1 + tier * 4 + (k / th2) * 5;
            var body = mix(ri ? '#2e6a8a' : '#5a86aa', hz, ri ? 0.15 : 0.4), lit = mix('#ffffff', hz, 0.1);
            R(p, tx - w / 2, base - th2 + k, w, HP, tier < 0.25 ? lit : body);
            R(p, tx, base - th2 + k, w / 2, HP, tier < 0.25 ? mix(lit, '#a8c8e8', 0.4) : mix(body, '#1c3050', 0.25));
          }
        }
      });
      R(p, 0, 121, SW, 10, '#f0f8ff');
      L.push({ c: pines, f: 0.3 });
      return L;
    },
    sky: function (rnd, th) {
      var hz = th.sky[2], L = [];
      var far = strip(), g = far.getContext('2d');
      sun(g, 90, 32, 12, ['#ffe6c0', '#fff0b0', '#fffbe6']);
      for (var i = 0; i < 10; i++) cloud(g, rnd() * SW, 96 + rnd() * 26, 1.2 + rnd() * 0.8, [mix('#f2b0d8', hz, 0.2), mix('#ffe2f2', hz, 0.1), '#ffffff']);
      R(g, 0, 122, SW, 30, mix('#ffe2f2', hz, 0.1));
      L.push({ c: far, f: 0.04 });
      var isl = strip(), s = isl.getContext('2d');
      // floating islands, each with a waterfall spilling into the clouds
      for (i = 0; i < 4; i++) {
        var ix = i * 128 + rnd() * 50, iy = 50 + rnd() * 30, iw = 18 + rnd() * 12;
        for (var y = 0; y < iw * 0.8; y += HP) R(s, ix - (iw - y) / 2, iy + y, iw - y, HP, mix('#a8784c', hz, 0.45));
        R(s, ix - iw / 2, iy - 2, iw, 3, mix('#7ad06a', hz, 0.4));
        canopy(s, ix - iw * 0.2, iy - 6, 5, 4, rnd, [mix('#3a9a4a', hz, 0.45), mix('#5cc05a', hz, 0.45), mix('#9ae878', hz, 0.4)]);
        for (y = 0; y < 30; y += HP) { s.globalAlpha = 1 - y / 30; R(s, ix + iw * 0.2, iy + 1 + y, 2, HP, '#e6fbff'); }
        s.globalAlpha = 1;
      }
      L.push({ c: isl, f: 0.12 });
      var near = strip(), n = near.getContext('2d');
      for (i = 0; i < 7; i++) cloud(n, rnd() * SW, 28 + rnd() * 60, 0.9 + rnd() * 0.6, ['#c8dcff', '#ffffff', '#ffffff']);
      L.push({ c: near, f: 0.28 });
      return L;
    },
    factory: function (rnd, th) {
      var L = [];
      var far = strip(), g = far.getContext('2d');
      for (var y = 0; y < H; y += 24) { R(g, 0, y, SW, HP * 2, '#2e3e5a'); for (var x = (y / 24) % 2 ? 0 : 32; x < SW; x += 64) R(g, x, y, HP * 2, 24, '#2e3e5a'); }
      // tall warm windows: the light streams in from them
      for (var i = 0; i < 6; i++) {
        var wx = i * 86 + 24, wy = 14;
        R(g, wx - 1, wy - 1, 30, 46, '#1e2840'); R(g, wx, wy, 28, 44, '#ffe2a0');
        for (y = wy; y < wy + 44; y += HP) R(g, wx, y, 28, HP, mix('#fff2c8', '#ffb860', (y - wy) / 44));
        R(g, wx + 13.5, wy, 1, 44, '#1e2840'); R(g, wx, wy + 21.5, 28, 1, '#1e2840');
      }
      [[100, 100, 26], [300, 86, 34], [440, 112, 22]].forEach(function (q) {
        for (var a = 0; a < 12; a++) { var ang = a / 12 * Math.PI * 2; R(g, q[0] + Math.cos(ang) * q[2] - 3, q[1] + Math.sin(ang) * q[2] - 3, 6, 6, '#3c506c'); }
        disc(g, q[0], q[1], q[2] - 2, '#3c506c'); disc(g, q[0] - 1, q[1] - 1, q[2] - 4, '#465c7c'); disc(g, q[0], q[1], q[2] * 0.42, '#2e3e5a'); disc(g, q[0], q[1], 3, '#5a7090');
      });
      L.push({ c: far, f: 0.1 });
      var near = strip(), n = near.getContext('2d');
      R(n, 0, 30, SW, 6, '#1e2840'); R(n, 0, 31, SW, 4, '#4c5c78'); R(n, 0, 31, SW, 1, '#8a9cc0');
      for (i = 0; i < 6; i++) { var px = i * 90 + 30; R(n, px, 36, 6, 92, '#1e2840'); R(n, px + 1, 36, 4, 92, '#56688c'); R(n, px + 1, 36, 1, 92, '#8a9cc0'); for (var b = 40; b < 128; b += 16) R(n, px - 1, b, 8, 2, '#1e2840'); }
      // cheerful toy bunting along the beam
      for (var bx = 0; bx < SW; bx += 6) R(n, bx, 36, 4, 3, ['#ff7a8a', '#ffd84a', '#6ac8ff', '#8ee06a'][(bx / 6) % 4]);
      L.push({ c: near, f: 0.35 });
      return L;
    },
    castle: function (rnd, th) {
      var L = [];
      var far = strip(), g = far.getContext('2d');
      for (var y = 0; y < H; y += 8) for (var x = (y / 8) % 2 ? 0 : 8; x < SW; x += 16) { R(g, x, y, 16, 8, '#3a1c30'); R(g, x + HP, y + HP, 15, 7, '#46243a'); R(g, x + HP, y + HP, 15, HP, '#55304a'); }
      // arched windows onto a sunset sky
      for (var i = 0; i < 6; i++) {
        var wx = i * 86 + 30, wy = 30;
        R(g, wx - 1, wy + 5, 18, 34, '#24101c'); disc(g, wx + 8, wy + 7, 9, '#24101c');
        for (y = -1; y < 34; y += HP) R(g, wx + 1, wy + 6 + y, 14, HP, mix('#ffd27a', '#ff7aa0', Math.max(0, y) / 34));
        disc(g, wx + 8, wy + 7, 7, '#ffd27a');
        R(g, wx + 7.5, wy, 1, 40, '#24101c'); R(g, wx, wy + 20, 16, 1, '#24101c');
      }
      L.push({ c: far, f: 0.12 });
      var near = strip(), n = near.getContext('2d');
      for (i = 0; i < 5; i++) {
        var px = i * 104 + 50;
        R(n, px, 0, 16, H, '#24101c'); R(n, px + 2, 0, 12, H, '#3a1c30'); R(n, px + 3, 0, 2, H, '#55304a');
        R(n, px + 4, 40, 8, 22, '#b02a44'); R(n, px + 5, 41, 6, 20, '#ef4a5a'); R(n, px + 7, 46, 2, 6, '#ffe048');
        for (var k = 0; k < 4; k += HP) R(n, px + 4 + k, 62 + k, 8 - k * 2, HP, '#b02a44');
      }
      L.push({ c: near, f: 0.4 });
      return L;
    }
  };

  BB.backdrop = function (name, th) {
    var rnd = BB.rng(name.length * 977 + 13);
    // the sky: a graded wash from the theme's top colour through its middle
    // to its horizon, in fine bands, each join dithered
    var sky = BB.surface(4, H);
    var g = sky.getContext('2d'), c = th.sky, BANDS = 36, bh = H / BANDS;
    var tone = function (t) { return t < 0.55 ? mix(c[0], c[1], t / 0.55) : mix(c[1], c[2], (t - 0.55) / 0.45); };
    for (var b = 0; b < BANDS; b++) {
      var y0 = b * bh;
      g.fillStyle = tone(b / (BANDS - 1)); g.fillRect(0, y0, 4, bh + HP);
      if (b) { g.fillStyle = tone((b - 1) / (BANDS - 1)); for (var x = 0; x < 4; x += HP * 2) g.fillRect(x, y0, HP, HP); }
    }
    var gen = GEN[th.bg] || GEN.hills;
    return { sky: sky, layers: gen(rnd, th) };
  };
  BB.drawBackdrop = function (ctx, bg, camX, camY, levelH) {
    var W = BB.W;
    ctx.drawImage(bg.sky, 0, 0, W, H);
    var lift = (levelH || H) - H - (camY || 0);
    bg.layers.forEach(function (l) {
      var off = ((snap(camX * l.f) % SW) + SW) % SW, y = snap((l.y || 0) + lift * l.f * 1.6);
      for (var x = -off; x < W; x += SW) ctx.drawImage(l.c, x, y, SW, l.c.height / BB.R);
    });
  };
})();
