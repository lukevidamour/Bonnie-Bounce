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

  /* ==========================================================================
     THE MAGPIE ISLES — the second land's ten worlds. The same painting as
     above (haze toward the horizon, light from the top left, round things
     in three tones), with a few more shapes to paint them with.
     ========================================================================== */
  // one turn of a wave across the strip: edges built from whole turns meet at the seam
  var TAU = Math.PI * 2 / SW;
  // a shape filled row by row between a left and a right edge, each a function of y
  var span = function (g, y0, y1, fl, fr, col) {
    for (var y = y0; y < y1; y += HP) { var l = fl(y), r = fr(y); if (r - l > 0.05) R(g, l, y, r - l, HP, col); }
  };
  // an ellipse, and the top half of one standing on y (a dome)
  var oval = function (g, cx, cy, rx, ry, col, half) {
    for (var y = -ry; y <= (half ? 0 : ry); y += HP) { var w = rx * Math.sqrt(Math.max(0, 1 - (y / ry) * (y / ry))); if (w > 0.1) R(g, cx - w, cy + y, w * 2, HP, col); }
  };
  // a ring, in rows; ymax cuts it off (a rainbow, an arch)
  var ring = function (g, cx, cy, ri, ro, col, ymax) {
    for (var y = -ro; y <= Math.min(ro, ymax === undefined ? ro : ymax - cy); y += HP) {
      var o = Math.sqrt(Math.max(0, ro * ro - y * y)), i = ri * ri > y * y ? Math.sqrt(ri * ri - y * y) : 0;
      if (!i) R(g, cx - o, cy + y, o * 2, HP, col);
      else { R(g, cx - o, cy + y, o - i, HP, col); R(g, cx + i, cy + y, o - i, HP, col); }
    }
  };
  // a line of half-pixels; sag bows it down in the middle, the way a rope hangs
  var line = function (g, x0, y0, x1, y1, w, col, sag) {
    var n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / HP));
    for (var i = 0; i <= n; i++) { var t = i / n; R(g, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + (sag || 0) * 4 * t * (1 - t), w, w, col); }
  };
  // a soft glow: five faint rings of light, so the steps between them barely show
  var glow = function (g, x, y, r, col, a) {
    [[1, 0.04], [0.82, 0.05], [0.64, 0.07], [0.48, 0.09], [0.32, 0.12]].forEach(function (q) { g.globalAlpha = (a || 1) * q[1]; disc(g, x, y, r * q[0], col); });
    g.globalAlpha = 1;
  };
  // stars: mostly single pixels, a few brighter crosses
  var stars = function (g, n, y0, y1, rnd, cols) {
    for (var i = 0; i < n; i++) {
      var x = rnd() * SW, y = y0 + rnd() * (y1 - y0), k = rnd(), c = cols[Math.floor(rnd() * cols.length)];
      g.globalAlpha = 0.45 + rnd() * 0.55;
      if (k > 0.94) { g.globalAlpha = 0.5; R(g, x - 1.5, y, 3.5, HP, c); R(g, x, y - 1.5, HP, 3.5, c); g.globalAlpha = 1; R(g, x, y, HP, HP, '#ffffff'); }
      else R(g, x, y, k > 0.78 ? 1 : HP, k > 0.78 ? 1 : HP, c);
    }
    g.globalAlpha = 1;
  };
  // a far-off bird: two little arcs
  var bird = function (g, x, y, col) {
    R(g, x - 2, y + HP, HP, HP, col); R(g, x - 1.5, y, 1, HP, col); R(g, x - HP, y + HP, 1, HP, col);
    R(g, x + HP, y, 1, HP, col); R(g, x + 1.5, y + HP, HP, HP, col);
  };
  /* A streak of cloud drawn long by the wind: thickest near its head and
     thinning to a wisp of tail. c = [shade, body, lit edge]; the lit edge
     is on top, or underneath when the sun is low (under). */
  var streak = function (g, x, y, len, th, c, under) {
    for (var i = 0; i < len; i += HP) {
      var k = i / len, h = snap(th * Math.sin(Math.PI * Math.pow(k, 0.55)) * (0.85 + 0.15 * Math.sin(i * 0.4 + x)));
      if (h < HP) continue;
      var top = snap(y - h * 0.45 + Math.sin(i * 0.035 + x) * 1.2);
      R(g, x + i, top, HP, h, c[1]);
      if (h > HP) R(g, x + i, under ? top : top + h - HP, HP, HP, c[0]);
      R(g, x + i, under ? top + h - HP : top, HP, HP, c[2]);
    }
  };
  /* A sailing boat sitting on the waterline y: a hull, a mast, the
     mainsail and a jib. c = [hull, lit sail, shaded sail, mast/trim] */
  var boat = function (g, x, y, s, c) {
    var d = 1.7 * s;
    span(g, y - d, y, function (yy) { return x - 5 * s + (yy - y + d) / d * 1.4 * s; }, function (yy) { return x + 5.6 * s - (yy - y + d) / d * 1.8 * s; }, c[0]);
    R(g, x - 5 * s, y - d, 10.6 * s, HP, c[3]);
    R(g, x, y - 14 * s, Math.max(HP, s * 0.5), 12.5 * s, c[3]);
    span(g, y - 13 * s, y - 2.4 * s, function () { return x + Math.max(HP, s * 0.5); }, function (yy) { return x + Math.max(HP, s * 0.5) + 7 * s * Math.pow((yy - y + 13 * s) / (10.6 * s), 0.8); }, c[1]);
    span(g, y - 11 * s, y - 2.4 * s, function (yy) { return x - 4.6 * s * (yy - y + 11 * s) / (8.6 * s); }, function () { return x; }, c[2]);
  };
  // a lighthouse: a striped tower, its gallery, and a lit lamp. c = [wall, stripe, shade, cap, lamp]
  var lighthouse = function (g, x, ground, s, c) {
    var h = 15 * s, dark = mix(c[1], c[2], 0.5);
    for (var y = ground - h; y < ground; y += HP) {
      var k = (y - ground + h) / h, hw = (1.4 + 0.9 * k) * s, sx = x + (0.5 + 0.3 * k) * s, band = Math.floor(k * h / (2 * s)) % 2;
      R(g, x - hw, y, sx - x + hw, HP, band ? c[1] : c[0]); R(g, sx, y, x + hw - sx, HP, band ? dark : c[2]);
    }
    R(g, x - 2.2 * s, ground - h - s * 0.6, 4.4 * s, Math.max(HP, s * 0.7), c[3]);
    R(g, x - 1.2 * s, ground - h - 2.8 * s, 2.4 * s, 2.2 * s, c[4]);
    oval(g, x, ground - h - 2.8 * s, 1.7 * s, 1.4 * s, c[3], true);
    glow(g, x, ground - h - 1.7 * s, 7 * s, c[4], 0.9);
  };
  // a windmill: a tapering tower, its cap, and four lattice sails. c = [wall, shade, cap, sail]
  var windmill = function (g, x, ground, s, c, a0) {
    var h = 12 * s, hub = ground - h - 0.6 * s;
    span(g, ground - h, ground, function (y) { return x - (1.4 + (y - ground + h) / h * 1.3) * s; }, function (y) { return x + (1.4 + (y - ground + h) / h * 1.3) * s; }, c[0]);
    span(g, ground - h, ground, function (y) { return x + 0.4 * s; }, function (y) { return x + (1.4 + (y - ground + h) / h * 1.3) * s; }, c[1]);
    R(g, x - HP, ground - 3 * s, 1.2 * s, 3 * s, c[1]);
    oval(g, x, ground - h, 2 * s, 1.7 * s, c[2], true);
    for (var a = 0; a < 4; a++) {
      var ang = a0 + a * Math.PI / 2, dx = Math.cos(ang), dy = Math.sin(ang);
      line(g, x, hub, x + dx * 9 * s, hub + dy * 9 * s, HP, c[2]);
      for (var t = 2.4 * s; t < 9 * s; t += HP) for (var o = HP; o < 1.8 * s; o += HP) if ((Math.round(t * 2) % 3) || o < HP * 1.5) R(g, x + dx * t - dy * o, hub + dy * t + dx * o, HP, HP, c[3]);
    }
    R(g, x - HP, hub - HP, 1, 1, c[2]);
  };
  /* A dune: a gentle windward slope up to a sharp crest, then the steep
     slip face in shadow, with the light catching the crest line.
     c = [shade, body, lit crest, ripple] */
  var dune = function (g, cx, cy, base, wl, wr, c) {
    var h = base - cy;
    for (var y = cy; y < base; y += HP) {
      var k = (y - cy) / h, xl = cx - wl * Math.sqrt(k), xr = cx + wr * k, xm = cx + wr * 0.72 * k * k;
      R(g, xl, y, xm - xl, HP, c[1]);
      if (xr > xm) R(g, xm, y, xr - xm, HP, c[0]);
      if (k < 0.7) R(g, xm - HP, y, HP, HP, c[2]);
      R(g, xl, y, HP * 2, HP, c[2]);
      if (k > 0.2 && Math.round(y * 2) % 7 === 0) R(g, xl + (xm - xl) * (0.3 + 0.2 * Math.sin(y)), y, 2 + (xm - xl) * 0.2, HP, c[3]);
    }
  };
  // a crescent: the part of one disc not covered by another, offset (ox, oy)
  var crescent = function (g, cx, cy, r, ox, oy, ri, col) {
    for (var y = -r; y <= r; y += HP) {
      var o = Math.sqrt(Math.max(0, r * r - y * y)), yy = y - oy, i = ri * ri > yy * yy ? Math.sqrt(ri * ri - yy * yy) : -1;
      if (i < 0) { R(g, cx - o, cy + y, o * 2, HP, col); continue; }
      var a = cx + ox - i, b = cx + ox + i;
      if (a > cx - o) R(g, cx - o, cy + y, Math.min(a, cx + o) - (cx - o), HP, col);
      if (b < cx + o) R(g, Math.max(b, cx - o), cy + y, cx + o - Math.max(b, cx - o), HP, col);
    }
  };
  /* A brass gear, lit from the top left: teeth, a rim, spokes between
     holes, a hub. c = [shade, body, light, hole] */
  var gear = function (g, cx, cy, r, c, a0) {
    var n = Math.max(6, Math.round(r * 0.75)), tw = Math.max(1.5, r * 0.26);
    for (var a = 0; a < n; a++) {
      var ang = (a0 || 0) + a / n * Math.PI * 2, tx = cx + Math.cos(ang) * (r + tw * 0.25), ty = cy + Math.sin(ang) * (r + tw * 0.25);
      R(g, tx - tw / 2 + 0.5, ty - tw / 2 + 0.5, tw, tw, c[0]); R(g, tx - tw / 2, ty - tw / 2, tw, tw, Math.sin(ang + 0.8) < -0.2 ? c[2] : c[1]);
    }
    disc(g, cx + 0.5, cy + 0.5, r, c[0]); disc(g, cx - 0.4, cy - 0.4, r - 0.6, c[2]); disc(g, cx, cy, r - 1, c[1]);
    if (r > 6) {
      for (a = 0; a < 5; a++) { var ha = (a0 || 0) + a / 5 * Math.PI * 2 + 0.6; disc(g, cx + Math.cos(ha) * r * 0.55, cy + Math.sin(ha) * r * 0.55, r * 0.22, c[3]); }
      ring(g, cx, cy, r * 0.74, r * 0.8, c[0]);
    }
    disc(g, cx, cy, Math.max(1, r * 0.2), c[0]); disc(g, cx - HP, cy - HP, Math.max(HP, r * 0.12), c[2]);
  };
  /* A glowing mushroom: a domed cap with its lit top, spots and the gills
     beneath, on a pale stalk, all in a halo of its own light.
     c = [cap shade, cap, cap light, spot, stalk, gills] */
  var glowcap = function (g, x, ground, h, r, c) {
    glow(g, x, ground - h, r * 1.9, c[2], 0.9);
    R(g, x - r * 0.18, ground - h, r * 0.36, h, c[4]); R(g, x + r * 0.06, ground - h, r * 0.12, h, mix(c[4], c[5], 0.4));
    R(g, x - r * 0.3, ground - 1, r * 0.6, 1, c[4]);
    oval(g, x, ground - h + r * 0.08, r, r * 0.22, c[5]);
    oval(g, x + r * 0.06, ground - h, r, r * 0.62, c[0], true);
    oval(g, x - r * 0.04, ground - h - r * 0.04, r * 0.92, r * 0.56, c[1], true);
    oval(g, x - r * 0.32, ground - h - r * 0.3, r * 0.36, r * 0.16, c[2]);
    [[-0.5, -0.12, 0.13], [0.15, -0.38, 0.11], [0.52, -0.14, 0.1], [-0.12, -0.08, 0.08]].forEach(function (q) { disc(g, x + q[0] * r, ground - h + q[1] * r, Math.max(HP, q[2] * r), c[3]); });
  };
  /* A crystal growing up from (x, base), leaning: a prism with a pointed
     tip, its left facet lit, its right in shade, a glint down the lit side.
     c = [shade, body, light] */
  var crystal = function (g, x, base, h, w, lean, c) {
    for (var y = 0; y < h; y += HP) {
      var k = y / h, hw = (k > 0.72 ? (1 - k) / 0.28 : 1) * w / 2, cx = x + lean * y;
      R(g, cx - hw, base - y, hw * 2, HP, c[1]);
      R(g, cx - hw, base - y, hw * 0.6, HP, c[2]);
      R(g, cx + hw * 0.35, base - y, hw * 0.65, HP, c[0]);
    }
    line(g, x + lean * h * 0.3 - w * 0.3, base - h * 0.3, x + lean * h * 0.6 - w * 0.3, base - h * 0.6, HP, '#ffffff');
  };
  // a natural arch: a half-ellipse of rock with a smaller one cut out of it. c = [shade, body, light]
  var arch = function (g, cx, base, w, h, t, c) {
    for (var y = base - h; y < base; y += HP) {
      var d = base - y, o = w * Math.sqrt(Math.max(0, 1 - (d / h) * (d / h))) + Math.sin(y * 1.1 + cx) * 0.5;
      var ih = h - t, i = d < ih ? (w - t) * Math.sqrt(Math.max(0, 1 - (d / ih) * (d / ih))) : 0;
      if (i <= 0) { R(g, cx - o, y, o * 2, HP, c[1]); R(g, cx + o * 0.55, y, o * 0.45, HP, c[0]); R(g, cx - o, y, HP * 2, HP, c[2]); }
      else { R(g, cx - o, y, o - i, HP, c[1]); R(g, cx - o, y, HP * 2, HP, c[2]); R(g, cx - i - HP, y, HP, HP, c[0]); R(g, cx + i, y, o - i, HP, c[0]); R(g, cx + i, y, HP, HP, c[2]); }
    }
  };
  /* A big tropical leaf on its stalk, reaching out from (x, y) at angle a
     and drooping under its own weight. c = [shade, body, light, rib] */
  var leaf = function (g, x, y, a, len, wid, c) {
    var pts = [], dx = Math.cos(a), dy = Math.sin(a);
    for (var t = 0; t <= 1; t += 1 / len) pts.push([x + dx * len * t, y + dy * len * t + t * t * len * 0.3, t < 0.18 ? 0.5 : Math.max(0.5, wid * Math.sin(Math.PI * (t - 0.18) / 0.82))]);
    pts.forEach(function (p) { disc(g, p[0] + 0.5, p[1] + 0.7, p[2], c[0]); });
    pts.forEach(function (p) { disc(g, p[0], p[1], p[2] * 0.88, c[1]); });
    pts.forEach(function (p) { if (p[2] > 1.2) disc(g, p[0] - p[2] * 0.22, p[1] - p[2] * 0.34, p[2] * 0.42, c[2]); });
    pts.forEach(function (p, i) { if (i % 2 === 0) R(g, p[0], p[1], HP, HP, c[3]); });
  };
  // a palm: a leaning, ringed trunk, and fronds drooping from its crown. c = [frond shade, frond, frond light, trunk, trunk ring]
  var palm = function (g, x, ground, h, lean, c) {
    for (var y = 0; y < h; y += HP) R(g, x + lean * y * y / h - 1, ground - y, 2, HP, Math.round(y * 2) % 5 ? c[3] : c[4]);
    var tx = x + lean * h, ty = ground - h;
    for (var f = 0; f < 7; f++) {
      var ang = -Math.PI + f * Math.PI / 6 + 0.1, len = h * (0.42 + 0.08 * Math.sin(f * 2.1)), col = f > 1 && f < 5 ? c[2] : f % 2 ? c[1] : c[0];
      for (var t = 0; t < 1; t += 0.04) disc(g, tx + Math.cos(ang) * len * t, ty + Math.sin(ang) * len * t + t * t * len * (0.4 + Math.abs(Math.cos(ang)) * 0.5), 1.4 * (1 - t * 0.6), col);
    }
    disc(g, tx, ty + 0.5, 1.4, c[3]);
  };
  // a crater: a bowl in shade with its far wall catching the light. c = [shade, body, light]
  var crater = function (g, cx, cy, rx, ry, c) {
    oval(g, cx, cy - HP, rx + 0.5, ry + 0.5, c[2]);
    oval(g, cx + 0.3, cy + 0.2, rx, ry, c[2]);
    oval(g, cx - rx * 0.1, cy - ry * 0.14, rx * 0.9, ry * 0.82, c[0]);
  };

  GEN.harbour = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k, s;
    var SX = 150, SY = 84, SR = 15, SEA = 92;
    // the sun going down into the sea, the clouds it lights from beneath and
    // the road it lays across the water: one layer, so they keep together
    var far = strip(), g = far.getContext('2d');
    [[3.6, 0.06], [2.7, 0.09], [2, 0.14], [1.45, 0.24]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, SX, SY, SR * q[0], '#fff2b8'); });
    g.globalAlpha = 1;
    disc(g, SX, SY, SR, '#ffa23c'); disc(g, SX - 0.8, SY - 1, SR - 1.4, '#ffbc4a'); disc(g, SX - SR * 0.3, SY - SR * 0.34, SR * 0.42, '#ffe08c');
    for (i = 0; i < 5; i++) cloud(g, rnd() * SW, 14 + rnd() * 26, 0.6 + rnd() * 0.5, ['#ffd884', mix('#ea8c98', hz, 0.1), mix('#ffaaa2', hz, 0.15)]);
    for (i = 0; i < 8; i++) streak(g, rnd() * SW, 48 + rnd() * 28, 36 + rnd() * 70, 1.5 + rnd() * 2.5, [mix('#d47c92', hz, 0.1), mix('#f29a9c', hz, 0.12), '#ffe2a0'], true);
    // two thin bands drawn across the sun's face
    streak(g, SX - 46, SY - 5, 84, 2.2, ['#e0868e', '#f49c8c', '#ffe6a8'], true);
    streak(g, SX - 16, SY + 2.5, 58, 1.6, ['#e0868e', '#f49c8c', '#ffe6a8'], true);
    for (y = SEA; y < H; y += HP) { k = (y - SEA) / (H - SEA); R(g, 0, y, SW, HP, k < 0.35 ? mix('#ffd6a2', '#ffae96', k / 0.35) : mix('#ffae96', '#ea8a98', (k - 0.35) / 0.65)); }
    R(g, 0, SEA, SW, HP, '#fff4cc');
    for (i = 0; i < 150; i++) { x = rnd() * SW; k = Math.pow(rnd(), 1.3); y = SEA + 1 + k * (H - SEA - 1); R(g, x, y, 1 + k * 7 * (0.4 + rnd()), HP, rnd() > 0.45 ? mix('#ffe6c0', '#ffc4a8', k) : mix('#f4a090', '#d27890', k)); }
    // the sun's road: glints spreading wider as they come towards us
    for (y = SEA + HP; y < SEA + 7; y += HP * 2) { var rw = SR * 1.5 * (1 - (y - SEA) / 9); R(g, SX - rw / 2 + (rnd() - 0.5), y, rw, HP, '#ffe7a0'); }
    for (y = SEA + HP; y < H; y += HP) {
      k = (y - SEA) / (H - SEA);
      if (rnd() < 0.3) continue;
      for (j = 0; j < 1 + Math.floor(rnd() * 1.6); j++) { x = SX + (rnd() + rnd() - 1) * (SR * 0.7 + k * 18); R(g, x - 1, y, 1 + rnd() * (1.5 + k * 5), HP, rnd() > 0.3 ? '#fff6d2' : '#ffd36a'); }
    }
    // little boats right out on the horizon
    [[60, 0.3], [228, 0.26], [470, 0.32]].forEach(function (q) { boat(g, q[0], SEA + 1.2, q[1], [mix('#9a5470', hz, 0.3), mix('#fff0d8', hz, 0.2), mix('#f2b0a0', hz, 0.2), mix('#8a4a62', hz, 0.3)]); });
    L.push({ c: far, f: 0.03 });

    // the harbour town, stacked up a headland, with its lighthouse on the point
    var town = strip(), t = town.getContext('2d');
    var BASE = 101, X0 = 262, X1 = 466;
    var top = function (xx) {
      var u = (xx - X0) / (X1 - X0);
      if (u <= 0 || u >= 1) return BASE;
      var e = Math.min(1, u / 0.12, (1 - u) / 0.03);
      return BASE - (24 * Math.exp(-Math.pow((u - 0.36) / 0.22, 2)) + 8 * Math.exp(-Math.pow((u - 0.84) / 0.1, 2)) + 5) * Math.sqrt(e) + Math.sin(xx * 0.9) * 0.3;
    };
    var hd = [mix('#9c5a78', hz, 0.42), mix('#b66c84', hz, 0.42), mix('#ffcca0', hz, 0.2)];
    // its reflection first, broken by the swell
    t.globalAlpha = 0.22;
    for (x = X0; x < X1; x += HP) { var rh = (BASE - top(x)) * 0.4; for (y = BASE; y < BASE + rh; y += HP * 2) R(t, x + Math.sin(y * 2.1) * 0.5, y, HP, HP, hd[0]); }
    t.globalAlpha = 1;
    for (x = X0; x < X1; x += HP) { y = top(x); R(t, x, y, HP, BASE - y, hd[1]); if (BASE - y > 7) R(t, x, y + 5 + Math.sin(x * 0.21) * 1.5, HP, BASE - y, hd[0]); R(t, x, y, HP, HP * 2, hd[2]); }
    R(t, X0 - 4, BASE - HP, X1 - X0 + 6, HP, mix('#fff0d0', hz, 0.2));
    // trees on the far side of the hill
    var TR = [mix('#76606e', hz, 0.36), mix('#948a6a', hz, 0.36), mix('#f2c88e', hz, 0.28)];
    for (i = 0; i < 11; i++) { x = 350 + rnd() * 84; var tr = 1.6 + rnd() * 1.3; ball(t, x, top(x) - tr * 0.5, tr, TR); }
    [344, 372, 398].forEach(function (cx2) { var ty = top(cx2); oval(t, cx2 + 0.4, ty - 4, 1.4, 4.2, TR[0]); oval(t, cx2 - 0.2, ty - 4.2, 1.1, 3.8, TR[1]); R(t, cx2 - 0.8, ty - 6.5, HP, 3, TR[2]); });
    // the houses, in rows down the slope to the water; most windows lit
    var walls = ['#fff0d8', '#ffd2c0', '#ffe6a8', '#ecd2f2', '#d4ecd8', '#cfe0ff'], roofs = ['#c8584e', '#7a5a8a', '#d87848', '#5a6a9a'];
    for (var row = 0; row < 3; row++) for (x = X0 + 12 + row * 4; x < X0 + 104 - row * 10; x += 4 + rnd() * 3) {
      var hw = 4 + Math.floor(rnd() * 2), hh = 3.5 + Math.floor(rnd() * 3), gy = Math.round(top(x + hw / 2) + 1 + row * 5);
      if (gy > BASE - 1.5) continue;
      var wall = mix(walls[Math.floor(rnd() * walls.length)], hz, 0.3), roof = mix(roofs[Math.floor(rnd() * roofs.length)], hz, 0.35);
      R(t, x, gy - hh, hw, hh + 2, wall); R(t, x + hw - 1, gy - hh, 1, hh + 2, mix(wall, '#8a4a6a', 0.22));
      for (var r = 0; r < hw / 2 + 0.5; r += HP) R(t, x - HP + r, gy - hh - HP - r, hw + 1 - r * 2, HP, r < HP ? mix(roof, '#ffffff', 0.2) : roof);
      if (rnd() > 0.25) { R(t, x + 1, gy - hh + 1.5, 1, 1, '#ffe67a'); if (hw > 4 && rnd() > 0.4) R(t, x + 3, gy - hh + 1.5, 1, 1, '#ffe67a'); }
      else R(t, x + 1, gy - hh + 1.5, 1, 1, mix(wall, '#8a4a6a', 0.35));
    }
    // the church on the crest
    var cx = X0 + 0.36 * (X1 - X0), cy = top(cx) + 1;
    R(t, cx - 2, cy - 13, 4, 13, mix('#fff0d8', hz, 0.3)); R(t, cx + 1, cy - 13, 1, 13, mix('#e8c4b8', hz, 0.3));
    span(t, cy - 20, cy - 13, function (yy) { return cx - 2 * (yy - cy + 20) / 7; }, function (yy) { return cx + 2 * (yy - cy + 20) / 7; }, mix('#7a5a8a', hz, 0.35));
    R(t, cx - HP, cy - 10, 1, 1.5, '#ffe67a');
    // the harbour wall, its light, and the boats tied up inside
    R(t, 228, BASE - 2.5, X0 - 228 + 10, 2.5, mix('#c48a8c', hz, 0.38)); R(t, 228, BASE - 2.5, X0 - 228 + 10, HP, mix('#ffe0b8', hz, 0.2));
    R(t, 228, BASE - 6, 1.5, 3.5, mix('#f4e8e0', hz, 0.2)); R(t, 228, BASE - 7, 1.5, 1, '#ff7060'); glow(t, 228.7, BASE - 6.5, 4, '#ff9a80', 0.8);
    [238, 246, 255].forEach(function (bx) { boat(t, bx, BASE - 3, 0.28, [mix('#9a5470', hz, 0.35), mix('#fff0d8', hz, 0.25), mix('#f2b0a0', hz, 0.25), mix('#8a4a62', hz, 0.35)]); });
    lighthouse(t, 451, top(451) + 0.5, 0.8, [mix('#fff4ec', hz, 0.18), mix('#e05a5a', hz, 0.25), mix('#e8b8b0', hz, 0.25), mix('#6a4a6a', hz, 0.3), '#fff4b8']);
    L.push({ c: town, f: 0.09 });

    // boats out in the bay, and the gulls over them
    var bay = strip(), b = bay.getContext('2d');
    for (i = 0; i < 4; i++) {
      x = 30 + i * 128 + rnd() * 60; y = 106 + rnd() * 7; s = 0.5 + (y - 106) * 0.05;
      b.globalAlpha = 0.25; for (j = 0; j < 4; j++) R(b, x - 4 * s + Math.sin(j * 2) * 0.5, y + HP + j, 9 * s - j * 0.8, HP, mix('#8a4a62', hz, 0.3)); b.globalAlpha = 1;
      boat(b, x, y, s, [mix('#94506a', hz, 0.25), mix('#fff2dc', hz, 0.1), mix('#f6b4a4', hz, 0.15), mix('#7c4058', hz, 0.25)]);
    }
    for (i = 0; i < 7; i++) bird(b, rnd() * SW, 30 + rnd() * 40, mix('#8a4a62', hz, 0.35));
    L.push({ c: bay, f: 0.16 });

    // the quay in front: a pier on its posts, mooring posts, a moored boat's
    // tall mast, lanterns — all in warm silhouette with the sun on their tops
    var pier = strip(), p = pier.getContext('2d');
    var WD = [mix('#7c3e56', hz, 0.2), mix('#9a5466', hz, 0.2), mix('#ffb27c', hz, 0.1)], WL = 121;
    var post = function (px, y0, w) {
      R(p, px, y0, w, WL - y0, WD[1]); R(p, px + w - HP, y0, HP, WL - y0, WD[0]); R(p, px, y0, HP, WL - y0, WD[2]);
      p.globalAlpha = 0.2; for (var yy = WL + HP; yy < WL + 12; yy += HP * 2) R(p, px + Math.sin(yy * 1.3) * 0.6, yy, w, HP, WD[0]); p.globalAlpha = 1;
      R(p, px - 1.5, WL, w + 3, HP, mix('#ffe0b0', hz, 0.2));
    };
    var lantern = function (lx, ly) {
      R(p, lx - HP, ly - 5, 1, 5, WD[0]); glow(p, lx, ly - 7.2, 9, '#ffd27a', 0.9);
      R(p, lx - 1.5, ly - 9, 3, 3.5, '#ffe28a'); R(p, lx - 1, ly - 8.5, 1, 1, '#fffbe0');
      R(p, lx - 2, ly - 9.5, 4, 1, WD[1]); R(p, lx - HP, ly - 10.5, 1, 1, WD[1]); R(p, lx - 1.5, ly - 5.5, 3, HP, WD[0]);
    };
    var pierAt = function (p0, p1, deck, gap) {
      var br = mix(WD[0], WD[1], 0.4), bi = 0;
      for (x = p0; x + gap < p1; x += gap, bi++) { if (bi % 2) line(p, x + 1, deck + 2, x + gap, WL - 3, HP, br); else line(p, x + gap, deck + 2, x + 1, WL - 3, HP, br); }
      for (x = p0; x < p1; x += gap) post(x, deck, 2);
      R(p, p0 - 2, deck - 2.5, p1 - p0 + 2, 2.5, WD[1]); R(p, p0 - 2, deck - 2.5, p1 - p0 + 2, HP, WD[2]); R(p, p0 - 2, deck - HP, p1 - p0 + 2, HP, WD[0]);
      for (x = p0; x < p1; x += gap) { R(p, x, deck - 8, 1, 5.5, WD[1]); R(p, x, deck - 8, HP, 5.5, WD[2]); }
      R(p, p0, deck - 8, p1 - p0 - gap + 1, 1, WD[1]); R(p, p0, deck - 8, p1 - p0 - gap + 1, HP, WD[2]);
    };
    pierAt(10, 214, 109, 12);
    pierAt(372, 470, 113, 10);
    lantern(58, 101); lantern(154, 101); lantern(460, 105);
    // a fishing boat tied up beside the long pier, its mast high over the quay
    var MX = 112;
    span(p, WL - 6, WL, function (yy) { return MX - 15 + (yy - WL + 6) * 0.6; }, function (yy) { return MX + 17 - (yy - WL + 6) * 0.9; }, WD[1]);
    R(p, MX - 15, WL - 6, 32, HP, WD[2]); R(p, MX - 6, WL - 9, 9, 3, WD[1]); R(p, MX - 6, WL - 9, 9, HP, WD[2]);
    R(p, MX, 34, 1.5, WL - 40, WD[1]); R(p, MX, 34, HP, WL - 40, WD[2]); R(p, MX - 4, 46, 9, 1, WD[1]);
    line(p, MX + 0.5, 35, MX - 15, WL - 6.5, HP, WD[0]); line(p, MX + 1, 35, MX + 17, WL - 6.5, HP, WD[0]);
    R(p, MX + 1, WL - 18, 13, 1.5, WD[1]); oval(p, MX + 7, WL - 18.5, 6, 1.3, mix('#ffe4c8', hz, 0.2));
    R(p, MX + 1, 34, 4, 2.5, mix('#ff7a6a', hz, 0.1));
    // mooring posts in the water between, a rope slung from one to the next
    [262, 282, 304, 326].forEach(function (mx, mi) { post(mx, 104 + (mi % 2) * 3, 3); R(p, mx - HP, 103.5 + (mi % 2) * 3, 4, 1, WD[0]); if (mi < 3) line(p, mx + 3, 107 + (mi % 2) * 3, mx + 20, 107 + ((mi + 1) % 2) * 3, HP, WD[0], 2.5); });
    // a gull asleep on a post
    R(p, 282, 106.5, 2.5, 1.5, '#fff8f0'); R(p, 283, 107, 1.5, 1, mix('#c8a8b8', hz, 0.2)); R(p, 284.5, 106.5, 1, HP, '#ffa040');
    L.push({ c: pier, f: 0.3 });
    return L;
  };

  GEN.candy = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y, k;
    // a soft rainbow behind cotton-candy clouds, and sugar sparkling in the air
    var far = strip(), g = far.getContext('2d');
    g.globalAlpha = 0.4;
    ['#ffb0c8', '#ffd4a0', '#fff2a0', '#bff0c4', '#b4dcff', '#d4bcff'].forEach(function (c, bi) { ring(g, 300, 112, 58 - bi * 2.5, 60.5 - bi * 2.5, c, 112); });
    g.globalAlpha = 1;
    for (i = 0; i < 8; i++) {
      var pink = i % 3 !== 1, s = 0.65 + rnd() * 0.6;
      cloud(g, rnd() * SW, 12 + rnd() * 44, s, pink ? [mix('#f2a8d8', hz, 0.15), mix('#ffe2f2', hz, 0.1), '#ffffff'] : [mix('#bcc4ff', hz, 0.2), mix('#eef0ff', hz, 0.1), '#ffffff']);
    }
    for (i = 0; i < 16; i++) { x = rnd() * SW; y = 6 + rnd() * 70; g.globalAlpha = 0.7; R(g, x - 1, y, 2.5, HP, '#ffffff'); R(g, x, y - 1, HP, 2.5, '#ffffff'); }
    g.globalAlpha = 1;
    L.push({ c: far, f: 0.04 });

    // far hills like gumdrops — lilac and peach, then mint and pink — the
    // tallest iced like snowy peaks
    var back = strip(), b = back.getContext('2d');
    var hump = function (cx, base, rx, ry, col, haze, iced) {
      var c = [mix(mix(col, '#a070b0', 0.22), hz, haze), mix(col, hz, haze), mix(mix(col, '#ffffff', 0.45), hz, haze)];
      oval(b, cx + rx * 0.06, base, rx, ry, c[0], true);
      oval(b, cx - rx * 0.06, base, rx * 0.9, ry * 0.99, c[1], true);
      oval(b, cx - rx * 0.36, base - ry * 0.6, rx * 0.3, ry * 0.16, c[2]);
      for (var xx = cx - rx; xx < cx + rx; xx += HP) {
        var u = (xx - cx) / rx, yt = base - ry * Math.sqrt(Math.max(0, 1 - u * u));
        if (u < -0.15 && u > -0.92) R(b, xx, yt, HP, HP, c[2]);
        if (iced && Math.abs(u) < 0.62) {
          var dep = ry * 0.16 + Math.pow(Math.max(0, Math.sin(xx * 0.85 + cx)), 3) * ry * 0.18 + (0.62 - Math.abs(u)) * ry * 0.2;
          R(b, xx, yt, HP, dep, mix(u > 0.2 ? '#f6dcf0' : '#fffafd', hz, haze * 0.5));
        }
      }
    };
    for (i = 0; i < 7; i++) hump(i * 74 + rnd() * 30, 104, 26 + rnd() * 14, 24 + rnd() * 16, i % 2 ? '#c8a4f0' : '#ffc4a4', 0.42, i === 1 || i === 4);
    mist(b, 86, 20, hz);
    for (i = 0; i < 9; i++) hump(i * 58 + rnd() * 26, 110, 18 + rnd() * 12, 12 + rnd() * 9, i % 2 ? '#a4ecc8' : '#ffb4d2', 0.3, false);
    mist(b, 98, 16, hz);
    L.push({ c: back, f: 0.1 });

    // the meadow: giant swirly lollipops, candy canes and gumdrop trees
    var mid = strip(), m = mid.getContext('2d');
    var mg = function (xx) { return 113 + Math.sin(xx * TAU * 2 + 1) * 3 + Math.sin(xx * TAU * 6) * 1.5; };
    land(m, mg, [mix('#7cd6a4', hz, 0.3), mix('#a4ecc0', hz, 0.3), mix('#e4fff0', hz, 0.2)], 8);
    var lolly = function (lx, h, r, c) {
      var gy = mg(lx) + 1, ly = gy - h;
      R(m, lx - 0.75, ly, 1.5, h, mix('#fff8f0', hz, 0.25)); R(m, lx + 0.25, ly, HP, h, mix('#e8d0d8', hz, 0.25));
      disc(m, lx + 0.7, ly + 0.8, r, mix(mix(c[0], '#a05080', 0.25), hz, 0.3));
      disc(m, lx, ly, r, mix(c[0], hz, 0.3));
      for (var tt = 0; tt < 1; tt += 0.006) { var a = tt * Math.PI * 5.2, rr = r * (1 - tt) * 0.9; disc(m, lx + Math.cos(a) * rr, ly + Math.sin(a) * rr, Math.max(0.6, r * 0.2 * (1 - tt * 0.6)), mix(c[1], hz, 0.3)); }
      m.globalAlpha = 0.55; disc(m, lx - r * 0.42, ly - r * 0.42, r * 0.26, '#ffffff'); m.globalAlpha = 1;
    };
    var cane = function (cx, h, c) {
      var gy = mg(cx) + 1, top = gy - h + 4.5;
      for (y = top; y < gy; y += HP) for (var dx = -1.5; dx < 1.5; dx += HP) R(m, cx + dx, y, HP, HP, mix(mix(Math.floor((y + dx * 1.3) / 2.2) % 2 ? c[1] : c[0], '#a05080', dx > 0.5 ? 0.18 : 0), hz, 0.3));
      for (var a = 0; a <= Math.PI * 1.08; a += 0.05) { var px = cx - 4.5 + Math.cos(a) * 4.5, py = top - Math.sin(a) * 4.5; disc(m, px, py, 1.5, mix(Math.floor(a * 4.5 / 2.2) % 2 ? c[1] : c[0], hz, 0.3)); }
    };
    // a candy tree: a fluffy pink crown studded with gumdrops
    var gumtree = function (tx, h, c) {
      var gy = mg(tx) + 1;
      R(m, tx - 1, gy - h * 0.55, 2, h * 0.55, mix('#c88a6a', hz, 0.3)); R(m, tx - 1, gy - h * 0.55, HP, h * 0.55, mix('#e8b090', hz, 0.3));
      canopy(m, tx, gy - h * 0.66, h * 0.38, h * 0.32, rnd, [mix(c[0], hz, 0.3), mix(c[1], hz, 0.3), mix(c[2], hz, 0.25), mix('#ffffff', hz, 0.2)]);
      for (var q = 0; q < 6; q++) { var a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 0.8, gc = ['#ff6a9a', '#ffd84a', '#7ad8ff', '#9ae86a', '#c08aff'][Math.floor(rnd() * 5)]; ball(m, tx + Math.cos(a) * h * 0.36 * d, gy - h * 0.66 + Math.sin(a) * h * 0.3 * d, 1.6, [mix(mix(gc, '#000000', 0.2), hz, 0.3), mix(gc, hz, 0.3), mix('#ffffff', hz, 0.2)]); }
    };
    var LC = [['#ff8ac0', '#ffffff'], ['#8ae0c0', '#ffffff'], ['#c8a0ff', '#fff2a0'], ['#ffb070', '#fff4e0']];
    [[40, 0], [196, 1], [330, 2], [452, 3]].forEach(function (q) { lolly(q[0] + rnd() * 20, 34 + rnd() * 18, 8 + rnd() * 4, LC[q[1]]); });
    [96, 268, 404].forEach(function (cx) { cane(cx + rnd() * 16, 26 + rnd() * 14, ['#ff6a8a', '#fff8f8']); });
    [[130, ['#f07ab4', '#ff9ccc', '#ffcce6']], [236, ['#b08ae8', '#c8a8ff', '#ece0ff']], [372, ['#f09a7a', '#ffb898', '#ffe0cc']], [496, ['#f07ab4', '#ff9ccc', '#ffcce6']]].forEach(function (q) { gumtree(q[0] + rnd() * 14, 26 + rnd() * 8, q[1]); });
    mist(m, 104, 14, hz);
    L.push({ c: mid, f: 0.2 });

    // the hills in front: frosted like cupcakes, dripping icing over the
    // sponge, with sprinkles and the odd cherry on top
    var near = strip(), n = near.getContext('2d');
    var dm = [];
    for (x = 0; x < SW - 24;) { var rr = 17 + rnd() * 15; dm.push([x, 8 + rnd() * 9, rr, dm.length % 4]); x += rr * 1.25 + rnd() * 8; }
    var ft = function (xx) {
      var best = [124, 0];
      dm.forEach(function (d) { [-SW, 0, SW].forEach(function (o) { var u = (xx - d[0] - o) / d[2]; if (Math.abs(u) < 1) { var yy = 122 - d[1] * Math.sqrt(1 - u * u); if (yy < best[0]) best = [yy, d[3]]; } }); });
      return best;
    };
    var ICE = [['#f49cc6', '#ffc8e0', '#fff0f8'], ['#7ed6b0', '#b8f2d8', '#f0fff8'], ['#b89cf0', '#d8c8ff', '#f8f4ff'], ['#90c0f0', '#c4e2ff', '#f2f8ff']];
    var SP = ['#ff6a9a', '#7ad0ff', '#ffd84a', '#8ee06a', '#c08aff'];
    for (x = 0; x < SW; x += HP) {
      var f0 = ft(x), ic = ICE[f0[1]];
      y = f0[0];
      var drip = 7 + Math.pow(Math.max(0, Math.sin(x * 0.55 + Math.sin(x * 0.13) * 3)), 4) * 6;
      R(n, x, y + drip - 1, HP, H, '#fad6ae'); R(n, x, y + drip, HP, 1, '#eab68c'); R(n, x, y + drip + 9, HP, H, '#f4c49a');
      R(n, x, y, HP, drip, ic[1]); R(n, x, y + drip - HP, HP, HP, ic[0]);
      R(n, x, y, HP, HP * 2, ic[2]);
      if (Math.abs(ft(x + 1.5)[0] - ft(x - 1.5)[0]) < 2.2) R(n, x, y + 3.5, HP, HP, ic[0]);
    }
    dm.forEach(function (d) { oval(n, d[0] - d[2] * 0.38, 122 - d[1] * 0.86 + 1.5, d[2] * 0.2, 0.8, ICE[d[3]][2]); });
    for (i = 0; i < 60; i++) { x = rnd() * SW; y = ft(x)[0] + 1.2 + rnd() * 4.5; if (rnd() > 0.5) R(n, x, y, 1, HP, SP[i % 5]); else R(n, x, y, HP, 1, SP[i % 5]); }
    for (i = 0; i < dm.length; i += 3) { x = dm[i][0]; y = ft(x)[0]; R(n, x + 0.5, y - 5, HP, 2.5, '#6aa848'); ball(n, x, y - 2, 2.2, ['#b8304e', '#e8506c', '#ffb0c0']); }
    L.push({ c: near, f: 0.36 });
    return L;
  };

  GEN.cliffs = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y, k;
    // a bright, blowy sky: clouds pulled into long streaks
    var far = strip(), g = far.getContext('2d');
    sun(g, 410, 22, 8, ['#ffffff', '#fffbe0', '#ffffff']);
    var CS = mix('#b4cff0', hz, 0.15), CB = [CS, CS, CS], CW = [CS, '#ffffff', '#ffffff'];
    for (i = 0; i < 7; i++) {
      x = rnd() * SW; y = 10 + rnd() * 52; var ln = 60 + rnd() * 90, tk = 3.5 + rnd() * 4 * (1 - y / 90);
      streak(g, x, y + 1.2, ln, tk, CB); streak(g, x, y, ln, tk, CW);
      streak(g, x + ln * 0.1, y - tk * 0.5, ln * 0.5, tk * 0.65, CW);
    }
    for (i = 0; i < 3; i++) { x = rnd() * SW; y = 22 + rnd() * 30; streak(g, x + 6, y + 2.2, 70 + rnd() * 30, 4.5, CB); streak(g, x + 6, y + 1, 70 + rnd() * 30, 4.5, CW); cloud(g, x, y, 0.5 + rnd() * 0.3, [CS, '#ffffff', '#ffffff']); }
    L.push({ c: far, f: 0.03 });

    // the open sea, flecked with white horses
    var SEA = 86, sea = strip(), s = sea.getContext('2d');
    for (y = SEA; y < H; y += HP) R(s, 0, y, SW, HP, mix('#a4daf4', '#3a92d2', Math.min(1, (y - SEA) / 46)));
    R(s, 0, SEA, SW, HP, mix('#ffffff', hz, 0.3));
    for (i = 0; i < 130; i++) { x = rnd() * SW; k = Math.pow(rnd(), 1.4); y = SEA + 1 + k * (H - SEA); R(s, x, y, 1 + k * 5 * rnd(), HP, rnd() > 0.35 ? mix('#ffffff', '#a4daf4', 0.3 * (1 - k)) : mix('#68b4e4', '#2a78bc', k)); }
    L.push({ c: sea, f: 0.05 });

    /* Chalk cliffs along a coast: a white face streaked with gullies and
       banded with flint, a cap of grass hanging over its lip, and surf at
       its foot. The end facing the light is lit, the far end in shade. */
    var cliff = function (g2, x0, x1, base, hgt, haze, seed) {
      var C = [mix('#f6f2e4', hz, haze), mix('#c8cede', hz, haze), mix('#ffffff', hz, haze * 0.6), mix('#e2dccc', hz, haze)];
      var G = [mix('#3c9a48', hz, haze), mix('#6cc85a', hz, haze), mix('#b4f088', hz, haze * 0.8)];
      // the top rises and dips in a row of rounded humps, like the Seven Sisters
      var tp = function (xx) {
        var u = (xx - x0) / (x1 - x0), e = Math.min(1, u / 0.07, (1 - u) / 0.16);
        return base - hgt * Math.pow(Math.max(0, e), 0.6) * (0.8 + 0.2 * Math.abs(Math.sin((xx - x0) * Math.PI / 40 + seed))) + Math.sin(xx * 0.6 + seed) * 0.4;
      };
      var half = mix(C[0], C[1], 0.5);
      for (var xx = x0; xx < x1; xx += HP) {
        // where the face turns away from the light (going down into a dip) it is in shade
        var u = (xx - x0) / (x1 - x0), yt = tp(xx), sl = tp(xx + 1) - tp(xx - 1);
        var face = u < 0.07 ? C[2] : u > 0.86 ? C[1] : sl > 0.5 ? half : sl < -0.5 ? mix(C[0], C[2], 0.6) : C[0];
        R(g2, xx, yt, HP, base - yt, face);
        var gl = Math.sin(xx * 0.9 + seed) + Math.sin(xx * 0.37 + seed * 2);
        if (u > 0.07 && u < 0.86 && gl > 1.2) R(g2, xx, yt + 3 + gl, HP, (base - yt) * (0.4 + 0.3 * Math.sin(xx)), mix(face, C[1], 0.5));
        R(g2, xx, base - 3.5, HP, 3.5, mix(face, C[1], 0.5));
        for (var fy = yt + 6; fy < base - 2; fy += 5) if (Math.sin(xx * 2.3 + fy) > 0.1) R(g2, xx, fy + Math.sin(xx * 0.2 + fy) * 0.6, HP, HP, C[3]);
        var gd = 1.5 + Math.max(0, Math.sin(xx * 0.7 + seed)) * 1.2 + (Math.sin(xx * 1.9 + seed) > 0.8 ? 1.5 : 0);
        R(g2, xx, yt - 1, HP, gd + 1, G[1]); R(g2, xx, yt + gd - HP, HP, HP, G[0]); R(g2, xx, yt - 1, HP, HP, G[2]);
      }
      // surf breaking at the foot
      for (xx = x0 - 3; xx < x1 + 3; xx += HP) { R(g2, xx, base - 1 + Math.sin(xx * 0.8) * 0.5, HP, 1.5, mix('#ffffff', hz, haze * 0.5)); if (Math.sin(xx * 1.7 + seed) > 0.6) R(g2, xx, base - 2.2, HP, 1, mix('#ffffff', hz, haze * 0.5)); }
      return tp;
    };
    var back = strip(), b = back.getContext('2d');
    var t1 = cliff(b, 14, 150, 100, 16, 0.55, 1), t2 = cliff(b, 196, 330, 100, 12, 0.55, 3), t3 = cliff(b, 368, 500, 100, 18, 0.55, 5);
    windmill(b, 104, t1(104) + 0.5, 0.75, [mix('#fffaf0', hz, 0.45), mix('#d8d4e0', hz, 0.45), mix('#8a6a6a', hz, 0.45), mix('#fff8f0', hz, 0.4)], 0.4);
    lighthouse(b, 382, t3(382) + 0.5, 0.6, [mix('#ffffff', hz, 0.35), mix('#e65a5a', hz, 0.4), mix('#d4d8e8', hz, 0.4), mix('#4a5a7a', hz, 0.4), '#fff8c0']);
    for (i = 0; i < 9; i++) bird(b, rnd() * SW, 30 + rnd() * 44, mix('#4a5a7a', hz, 0.35));
    L.push({ c: back, f: 0.1 });

    // nearer cliffs, taller and sharper, and a sea stack off one point
    var mid = strip(), m = mid.getContext('2d');
    cliff(m, 40, 236, 116, 30, 0.4, 2);
    cliff(m, 318, 472, 116, 25, 0.4, 4);
    cliff(m, 252, 266, 116, 20, 0.4, 7);
    for (i = 0; i < 5; i++) bird(m, rnd() * SW, 40 + rnd() * 40, mix('#3a4a6a', hz, 0.25));
    L.push({ c: mid, f: 0.2 });

    // the clifftop path: grass bent flat by the wind, sea pinks, fence posts
    var near = strip(), n = near.getContext('2d');
    var nf = function (xx) { return 119 + Math.sin(xx * TAU * 2 + 2) * 4 + Math.sin(xx * TAU * 7) * 1.5; };
    land(n, nf, ['#2f9a3e', '#58c24a', '#a0ec70'], 9);
    for (i = 0; i < 80; i++) { x = rnd() * SW; y = nf(x) + 0.5; var bl = 2 + rnd() * 2.5; line(n, x, y, x - bl * 0.9, y - bl, HP, rnd() > 0.5 ? '#a0ec70' : '#3e9a40'); }
    for (i = 0; i < 26; i++) { x = rnd() * SW; y = nf(x) - 1.5 - rnd() * 2; R(n, x + 0.25, y + 1, HP, 1.5, '#3e9a40'); R(n, x - HP, y, 1.5, 1, '#ff8ac0'); R(n, x, y, HP, HP, '#ffd0e8'); }
    for (x = 12; x < SW; x += 34) { y = nf(x + 1); R(n, x, y - 8, 2, 8.5, '#a8784c'); R(n, x, y - 8, HP, 8.5, '#d8a870'); R(n, x + 1.5, y - 8, HP, 8.5, '#7a5236'); { line(n, x + 2, y - 6.5, x + 34, nf(x + 35) - 6.5, HP, '#8a6a52', 1.2); line(n, x + 2, y - 3.5, x + 34, nf(x + 35) - 3.5, HP, '#8a6a52', 1); } }
    L.push({ c: near, f: 0.38 });
    return L;
  };

  GEN.jungle = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    var gold = mix(hz, '#fff0a8', 0.35);
    // a hazy sun in a warm, damp sky
    var far = strip(), g = far.getContext('2d');
    sun(g, 330, 30, 11, ['#fff8c0', '#fff2a8', '#fffbe6']);
    for (i = 0; i < 5; i++) cloud(g, rnd() * SW, 14 + rnd() * 30, 0.6 + rnd() * 0.5, [mix('#bfe8c8', hz, 0.2), mix('#f4fff0', hz, 0.1), '#ffffff']);
    L.push({ c: far, f: 0.04 });

    // misty mountains, tall and round-shouldered like tropical karst, their
    // skylines furred with trees
    var mt = strip(), m = mt.getContext('2d');
    var peak = function (cx, base, rx, ry, haze) {
      var c = [mix('#4a8a74', hz, haze), mix('#68a88a', hz, haze), mix('#b0e0b0', hz, haze * 0.8)], cap = rx * 0.8;
      // a rounded crown, near-sheer sides, a little flare at the foot
      for (var d = 0; d < ry; d += HP) {
        var w = rx * Math.sqrt(Math.min(1, d / cap)) * (1 + 0.25 * Math.pow(d / ry, 3)), wob = Math.sin(d * 0.4 + cx) * 0.6 * Math.min(1, d / cap), yy = base - ry + d;
        R(m, cx - w + wob, yy, w * 2, HP, c[1]); R(m, cx + w * 0.3 + wob, yy, w * 0.7, HP, c[0]); R(m, cx - w + wob, yy, HP, HP, c[2]);
      }
      for (var a = 0; a < 12; a++) { var u = a / 11 * 1.8 - 0.9; disc(m, cx + u * rx, base - ry + u * u * cap + 0.8, 0.9 + rnd() * 0.8, u < 0.3 ? c[1] : c[0]); }
    };
    for (i = 0; i < 8; i++) peak(i * 66 + rnd() * 30, 104, 9 + rnd() * 8, 30 + rnd() * 22, 0.56);
    mist(m, 76, 30, hz);
    for (i = 0; i < 9; i++) peak(i * 58 + rnd() * 30, 108, 7 + rnd() * 6, 16 + rnd() * 14, 0.44);
    mist(m, 92, 18, hz);
    L.push({ c: mt, f: 0.07 });

    /* The old temple: stepped tiers of mossy stone, a stair up the middle,
       a little shrine on top with a sun carved over its door, and vines
       draped down every ledge. Friendly, sleepy, half swallowed by green. */
    var ru = strip(), r = ru.getContext('2d');
    var S = [mix('#7c8a70', hz, 0.38), mix('#a4ae92', hz, 0.38), mix('#dce0c4', hz, 0.3), mix('#58624e', hz, 0.38)];
    var MS = [mix('#3a8a40', hz, 0.36), mix('#6cc05a', hz, 0.34), mix('#a8e878', hz, 0.3)];
    var vine = function (vx, vy, len) { for (var k = 0; k < len; k += HP) R(r, vx + Math.sin(k * 0.6 + vx) * 0.6, vy + k, HP, HP, MS[0]); disc(r, vx, vy + len, 0.8, MS[1]); };
    var TX = 140, TB = 106, TW = 92, TIERS = 5, THT = 7;
    for (var t = 0; t < TIERS; t++) {
      var y1 = TB - t * THT, y0 = y1 - THT, ww = TW - t * 15, x0 = TX - ww / 2;
      R(r, x0, y0, ww, THT, S[1]); R(r, x0 + ww * 0.8, y0, ww * 0.2, THT, S[0]);
      for (var jy = y0 + 3.5; jy < y1; jy += 3.5) for (x = x0 + ((jy / 3.5) % 2) * 3; x < x0 + ww; x += 6) R(r, x, jy, HP, 3.5, S[0]);
      R(r, x0, y0 + 3.5, ww, HP, S[0]);
      R(r, x0, y0, ww, HP, S[2]); R(r, x0, y1 - HP, ww, HP, S[3]);
      for (x = x0; x < x0 + ww; x += HP) { var mo = Math.sin(x * 0.7 + t * 3) + Math.sin(x * 0.23 + t); if (mo > 0.3) R(r, x, y0 - HP, HP, HP + (mo > 1.3 ? 1 : 0), mo > 1 ? MS[1] : MS[0]); }
      for (var v = 0; v < 4; v++) { x = x0 + 3 + rnd() * (ww - 6); if (Math.abs(x - TX) > 7) vine(x, y0, 3 + rnd() * 6); }
    }
    // the stair, lit tread by tread
    var top0 = TB - TIERS * THT;
    for (y = top0; y < TB; y += 1.5) { R(r, TX - 6, y, 12, 1, S[2]); R(r, TX - 6, y + 1, 12, HP, S[0]); }
    R(r, TX - 7, top0, 1, TB - top0, S[0]); R(r, TX + 6, top0, 1, TB - top0, S[0]);
    // the shrine
    R(r, TX - 9, top0 - 12, 18, 12, S[1]); R(r, TX + 5, top0 - 12, 4, 12, S[0]);
    R(r, TX - 11, top0 - 14, 22, 2, S[2]); R(r, TX - 11, top0 - 12.5, 22, HP, S[0]); R(r, TX - 8, top0 - 16, 16, 2, S[1]); R(r, TX - 8, top0 - 16, 16, HP, S[2]);
    R(r, TX - 2.5, top0 - 7, 5, 7, S[3]); disc(r, TX, top0 - 7, 2.5, S[3]);
    ring(r, TX, top0 - 10.5, 0.8, 1.6, mix('#f4e8a0', hz, 0.3));
    palm(r, TX + 6, top0 - 16, 9, 0.25, [MS[0], MS[1], MS[2], mix('#7a6a50', hz, 0.38), mix('#9a8a68', hz, 0.38)]);
    vine(TX - 10, top0 - 12, 8); vine(TX + 9, top0 - 12, 5);
    // a ruined archway and a fallen pillar further along
    var RX = 380;
    [RX - 14, RX + 8].forEach(function (px) { R(r, px, 72, 6, TB - 72, S[1]); R(r, px + 4.5, 72, 1.5, TB - 72, S[0]); R(r, px, 72, HP, TB - 72, S[2]); for (y = 76; y < TB; y += 6) R(r, px, y, 6, HP, S[0]); });
    R(r, RX - 17, 66, 30, 6, S[1]); R(r, RX - 17, 66, 30, HP, S[2]); R(r, RX - 17, 71.5, 30, HP, S[3]); R(r, RX + 6, 66, 7, 6, S[0]);
    R(r, RX + 30, TB - 5, 18, 5, S[1]); R(r, RX + 30, TB - 5, 18, HP, S[2]); R(r, RX + 44, TB - 5, 4, 5, S[0]);
    for (x = RX - 17; x < RX + 13; x += 4) vine(x + rnd() * 2, 71.5, 2 + rnd() * 9);
    for (x = RX - 17; x < RX + 13; x += HP) if (Math.sin(x * 0.8) > 0.2) R(r, x, 65.5, HP, 1, MS[1]);
    // the forest closing round their feet
    for (i = 0; i < 26; i++) { x = rnd() * SW; canopy(r, x, TB - 1 + rnd() * 3, 7 + rnd() * 6, 4 + rnd() * 3, rnd, [mix('#2e7a44', hz, 0.42), mix('#4a9a52', hz, 0.42), mix('#8ccc72', hz, 0.36)]); }
    mist(r, 92, 22, gold);
    L.push({ c: ru, f: 0.13 });

    // the canopy: broad-crowned trees and palms, gaps between, mist beneath
    var cn = strip(), c = cn.getContext('2d');
    var CC = [mix('#1e6a3a', hz, 0.26), mix('#2e8a46', hz, 0.26), mix('#6ac25a', hz, 0.22), mix('#c8f08a', hz, 0.2)];
    var CT = [mix('#5a4030', hz, 0.3), mix('#7a5a40', hz, 0.3)];
    land(c, function (xx) { return 118 + Math.sin(xx * TAU * 3) * 3; }, [CC[0], CC[1], CC[2]], 6);
    for (i = 0; i < 6; i++) { x = i * 86 + rnd() * 30; tree(c, x, 120, 44 + rnd() * 14, rnd, CC, CT); tree(c, x + 26 + rnd() * 10, 121, 26 + rnd() * 8, rnd, CC, CT); }
    for (i = 0; i < 4; i++) palm(c, i * 128 + 60 + rnd() * 30, 120, 36 + rnd() * 10, rnd() > 0.5 ? 0.2 : -0.2, [CC[0], CC[1], CC[2], CT[0], CT[1]]);
    mist(c, 104, 20, gold);
    L.push({ c: cn, f: 0.22 });

    // in front: lianas hanging from above, and big leaves rising from below
    var nr = strip(), n = nr.getContext('2d');
    var NL = [mix('#12503a', hz, 0.12), mix('#1d6e48', hz, 0.12), mix('#3c985a', hz, 0.1), mix('#7cc87a', hz, 0.1)];
    for (i = 0; i < 9; i++) {
      x = i * 57 + rnd() * 30;
      var vl = 14 + rnd() * 34;
      for (var k = 0; k < vl; k += HP) { var vx = x + Math.sin(k * 0.12 + i) * 2; R(n, vx, k, 1, HP, NL[0]); if (Math.round(k * 2) % 9 === 0) { R(n, vx + (k % 2 ? 1 : -2), k, 2, 1, NL[1]); R(n, vx + (k % 2 ? 1 : -2), k, 1, HP, NL[2]); } }
      var ex = x + Math.sin(vl * 0.12 + i) * 2;
      R(n, ex - 2, vl, 2, 1, NL[1]); R(n, ex + 1, vl - 1, 2, 1, NL[2]); ring(n, ex + 1, vl + 1.5, 0.6, 1.2, NL[0]);
    }
    for (i = 0; i < 8; i++) { x = i * 64 + rnd() * 30; canopy(n, x, -2 + rnd() * 2, 7 + rnd() * 5, 3, rnd, [NL[0], NL[1], NL[2]]); }
    for (i = 0; i < 7; i++) {
      x = i * 74 + rnd() * 30;
      leaf(n, x, 134, -Math.PI / 2 - 0.25 - rnd() * 0.45, 26 + rnd() * 10, 4 + rnd() * 1.5, NL);
      leaf(n, x + 4, 134, -Math.PI / 2 + 0.25 + rnd() * 0.45, 24 + rnd() * 10, 4 + rnd() * 1.5, NL);
      if (i % 2) { var fx = x + 2, fy = 124 - rnd() * 4; [0, 1.26, 2.51, 3.77, 5.03].forEach(function (a) { disc(n, fx + Math.cos(a) * 1.6, fy + Math.sin(a) * 1.6, 1.3, '#ff7a8a'); }); disc(n, fx, fy, 0.9, '#ffe060'); }
    }
    L.push({ c: nr, f: 0.4 });
    return L;
  };

  GEN.glow = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    var CAPS = [
      ['#1e86a8', '#3ad0e0', '#b8fbff', '#e8ffff', '#c8d8f0', '#2a5a88'],
      ['#a83a8a', '#f070c0', '#ffc8ec', '#fff0fa', '#e0d0f0', '#7a2a70'],
      ['#5a9a2a', '#a8e84a', '#eaffb0', '#fbfff0', '#d8e8d0', '#3a6a3a']
    ];
    var hazed = function (c, a) { return c.map(function (q) { return mix(q, hz, a); }); };
    // a sky full of stars and a sleepy crescent moon
    var far = strip(), g = far.getContext('2d');
    stars(g, 120, 2, 84, rnd, ['#ffffff', '#c8e0ff', '#ffe8ff', '#d0fff0']);
    glow(g, 400, 28, 26, '#c8d8ff', 0.6);
    crescent(g, 400, 28, 9, 4.6, -3, 8, '#e4d6b4');
    crescent(g, 400, 28, 9, 3.4, -2.2, 8, '#fff6dc');
    L.push({ c: far, f: 0.02 });

    // a far wood of round treetops, little mushrooms glowing at its feet
    var bk = strip(), b = bk.getContext('2d');
    var F1 = [mix('#141e48', hz, 0.5), mix('#1c2c5c', hz, 0.5), mix('#3c5c90', hz, 0.42)];
    var bf = function (xx) { return 100 + Math.sin(xx * TAU * 2) * 4 + Math.sin(xx * TAU * 6) * 2; };
    land(b, bf, F1, 10);
    for (i = 0; i < 22; i++) { x = rnd() * SW; var tw = 9 + rnd() * 7; R(b, x - 1, bf(x) - tw, 2, tw, F1[0]); canopy(b, x, bf(x) - tw * 1.3, tw * 0.75, tw * 0.6, rnd, F1); }
    for (i = 0; i < 16; i++) { x = rnd() * SW; y = bf(x) + 1; var cc = hazed(CAPS[i % 3], 0.25); glow(b, x, y - 2, 6, cc[1], 0.8); R(b, x - 0.25, y - 2, HP, 2, cc[4]); oval(b, x, y - 2, 2, 1.3, cc[1], true); }
    mist(b, 80, 30, hz);
    L.push({ c: bk, f: 0.07 });

    // tall dark trunks rising out of sight, moonlit down one side, and
    // mushrooms the size of umbrellas glowing round their roots
    var md = strip(), m = md.getContext('2d');
    var TK = [mix('#0e1634', hz, 0.3), mix('#18224a', hz, 0.3), mix('#3a5a8c', hz, 0.22)];
    var mf = function (xx) { return 118 + Math.sin(xx * TAU * 3 + 1) * 3; };
    land(m, mf, TK, 6);
    for (i = 0; i < 7; i++) {
      x = i * 74 + rnd() * 30; var w = 6 + rnd() * 4, gy = mf(x) + 2;
      span(m, 0, gy, function (yy) { return x - w / 2 - Math.pow(Math.max(0, yy - gy + 14), 2) * 0.03; }, function (yy) { return x + w / 2 + Math.pow(Math.max(0, yy - gy + 14), 2) * 0.03; }, TK[1]);
      span(m, 0, gy, function (yy) { return x + w * 0.2; }, function (yy) { return x + w / 2 + Math.pow(Math.max(0, yy - gy + 14), 2) * 0.03; }, TK[0]);
      span(m, 0, gy - 6, function (yy) { return x - w / 2; }, function (yy) { return x - w / 2 + 1; }, TK[2]);
      for (y = 6 + rnd() * 10; y < gy - 16; y += 9 + rnd() * 8) R(m, x - w * 0.2 + rnd() * 2, y, HP, 3 + rnd() * 3, TK[0]);
      var by = 30 + rnd() * 30, bs = rnd() > 0.5 ? 1 : -1;
      line(m, x + bs * w / 2, by, x + bs * (w / 2 + 12), by - 7, 1.5, TK[1]);
    }
    for (i = 0; i < 6; i++) { x = i * 86 + 40 + rnd() * 30; glowcap(m, x, mf(x) + 1, 7 + rnd() * 5, 5 + rnd() * 3, hazed(CAPS[(i + 1) % 3], 0.22)); }
    mist(m, 100, 26, hz);
    L.push({ c: md, f: 0.16 });

    // the grove in front: giant mushrooms, ferns, and fireflies drifting. The
    // mushrooms are kept back in the haze, so none is mistaken for the
    // bouncy ones the level is played on
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 124 + Math.sin(xx * TAU * 3) * 2; };
    land(n, nf, ['#0c1230', '#161e46', '#2a5a7a'], 6);
    var fern = function (fx, gy, s) {
      [-2.3, -1.9, -1.2, -0.8].forEach(function (a) {
        for (var t = 0; t < 1; t += 0.06) { var px = fx + Math.cos(a) * 9 * s * t, py = gy + Math.sin(a) * 9 * s * t + t * t * 5 * s; R(n, px, py, HP, HP, '#1c3058'); if (Math.round(t * 50) % 2 === 0) { R(n, px - 0.5, py - 1, HP, 1, '#22406a'); R(n, px + 0.5, py - 1, HP, 1, '#2a6a80'); } }
      });
    };
    [[44, 0], [156, 1], [282, 2], [404, 1], [480, 0]].forEach(function (q) {
      x = q[0] + rnd() * 20; var gy = nf(x) + 1, big = 12 + rnd() * 6;
      glowcap(n, x, gy, big * 1.8, big, hazed(CAPS[q[1]], 0.32));
      glowcap(n, x + big + 4, gy, 6 + rnd() * 3, 4 + rnd() * 2, hazed(CAPS[(q[1] + 1) % 3], 0.32));
      glowcap(n, x - big - 3, gy, 4 + rnd() * 2, 3 + rnd(), hazed(CAPS[(q[1] + 2) % 3], 0.32));
      fern(x + big + 10, gy, 0.9 + rnd() * 0.4); fern(x - big - 8, gy, 0.7 + rnd() * 0.4);
    });
    for (i = 0; i < 28; i++) { x = rnd() * SW; y = 40 + rnd() * 76; glow(n, x, y, 3.5, '#e8ff90', 0.8); R(n, x - HP / 2, y - HP / 2, HP, HP, '#ffffd0'); }
    L.push({ c: nr, f: 0.32 });
    return L;
  };

  GEN.lagoon = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y, k;
    var HOLES = [[140, 30], [392, 17]];
    // the cave roof, with holes up to the open sea: the light glimmers
    // there and falls through the water in soft shafts
    var far = strip(), g = far.getContext('2d');
    HOLES.forEach(function (o) {
      [[1, 0.05], [0.62, 0.06], [0.34, 0.08]].forEach(function (q) {
        for (y = 6; y < 136; y += HP) { g.globalAlpha = q[1] * (1 - y / 150); var w = o[1] * 1.8 * q[0] + y * 0.3 * q[0]; R(g, o[0] + y * 0.22 - w / 2, y, w, HP, '#c8fbff'); }
      });
      g.globalAlpha = 1;
    });
    var RK = [mix('#061a2c', hz, 0.06), mix('#0a2a42', hz, 0.1), mix('#2a8aa8', hz, 0.2)];
    var roof = function (xx) {
      var y0 = 17 + Math.sin(xx * TAU * 3) * 6 + Math.sin(xx * TAU * 9 + 1) * 2.5 + Math.sin(xx * TAU * 30) * 1.2;
      HOLES.forEach(function (o) { [-SW, 0, SW].forEach(function (off) { var u = (xx - o[0] - off) / o[1]; if (Math.abs(u) < 1) y0 -= (y0 + 6) * Math.sqrt(1 - u * u); }); });
      return y0;
    };
    HOLES.forEach(function (o) {
      // a dome of light under each hole, fading as it comes down
      for (y = 0; y < 30; y += HP) { k = y / 30; var hw = o[1] * Math.sqrt(1 - k * k); g.globalAlpha = 1 - k * k; R(g, o[0] - hw, y, hw * 2, HP, mix('#c8fafc', '#3aa8c4', k)); }
      g.globalAlpha = 1;
      for (i = 0; i < o[1] * 0.6; i++) R(g, o[0] + (rnd() - 0.5) * o[1] * 1.5, 1 + rnd() * 9, 2 + rnd() * 5, HP, '#f4ffff');
    });
    for (x = 0; x < SW; x += HP) { y = roof(x); if (y > 0) { R(g, x, 0, HP, y, RK[1]); R(g, x, y - HP * 3, HP, HP * 2, RK[0]); R(g, x, y - HP, HP, HP, RK[2]); } }
    for (i = 0; i < 9; i++) {
      x = rnd() * SW; y = roof(x); var sl = 5 + rnd() * 9, sw = 2 + rnd() * 2;
      if (y > 8) for (k = 0; k < sl; k += HP) { var hw = sw / 2 * (1 - k / sl); R(g, x - hw, y + k - 1.5, hw * 2, HP, RK[1]); R(g, x - hw, y + k - 1.5, HP, HP, RK[2]); }
    }
    L.push({ c: far, f: 0.03 });

    // far walls: arches and pillars of rock, blue with distance, a few
    // crystals winking in them
    var bk = strip(), b = bk.getContext('2d');
    var A1 = [mix('#0a3048', hz, 0.5), mix('#104058', hz, 0.5), mix('#40a8c0', hz, 0.42)];
    land(b, function (xx) { return 106 + Math.sin(xx * TAU * 3) * 5 + Math.sin(xx * TAU * 11) * 2; }, A1, 10);
    arch(b, 110, 108, 36, 62, 11, A1); arch(b, 350, 108, 26, 46, 8, A1);
    [232, 470].forEach(function (cx) {
      for (y = 0; y < 110; y += HP) { var hw = 4 + Math.abs(y - 58) * 0.07 + Math.sin(y * 0.15 + cx) * 1.2; R(b, cx - hw, y, hw * 2, HP, A1[1]); R(b, cx + hw * 0.35, y, hw * 0.65, HP, A1[0]); R(b, cx - hw, y, HP, HP, A1[2]); }
    });
    for (i = 0; i < 18; i++) { x = rnd() * SW; y = 60 + rnd() * 48; var cc = rnd() > 0.5 ? '#7af0ff' : '#ff9ad8'; glow(b, x, y, 4, cc, 0.6); R(b, x - HP / 2, y - 1, HP, 2, mix(cc, '#ffffff', 0.4)); }
    mist(b, 82, 32, hz);
    L.push({ c: bk, f: 0.08 });

    // crystal clusters glowing on the rocks, kelp swaying up between
    var md = strip(), m = md.getContext('2d');
    var A2 = [mix('#082636', hz, 0.3), mix('#0e3a50', hz, 0.3), mix('#3aa4bc', hz, 0.3)];
    var CR = [[mix('#2a8ab0', hz, 0.15), mix('#5ae0f0', hz, 0.1), '#d8feff'], [mix('#b04a96', hz, 0.15), mix('#ff80c8', hz, 0.1), '#ffd8f0']];
    for (i = 0; i < 16; i++) { var kx = rnd() * SW, kh = 30 + rnd() * 44; for (k = 0; k < kh; k += HP) { R(m, kx + Math.sin(k * 0.16 + i) * 2.2, 124 - k, 1.5, HP, mix('#1a7a74', hz, 0.38)); if (Math.round(k * 2) % 11 === 0) oval(m, kx + Math.sin(k * 0.16 + i) * 2.2 + (k % 2 ? 2 : -1), 124 - k, 1.6, 0.8, mix('#2a9a84', hz, 0.38)); } }
    for (i = 0; i < 9; i++) ball(m, i * 58 + rnd() * 24, 126 + rnd() * 4, 10 + rnd() * 9, A2);
    for (i = 0; i < 6; i++) {
      x = i * 86 + 20 + rnd() * 40; y = 116 + rnd() * 4; var pc = CR[i % 2];
      glow(m, x, y - 6, 15, pc[1], 0.7);
      crystal(m, x, y, 13 + rnd() * 5, 3.2, 0.1, pc); crystal(m, x - 4, y + 1, 8 + rnd() * 3, 2.6, -0.35, pc); crystal(m, x + 4, y + 1, 9 + rnd() * 3, 2.6, 0.4, pc);
    }
    mist(m, 104, 26, hz);
    L.push({ c: md, f: 0.16 });

    // in front: coral and weed in silhouette, a few bright crystals, bubbles rising
    var nr = strip(), n = nr.getContext('2d');
    var D = ['#06202e', '#0c3044', '#2a8aa0'];
    var nf = function (xx) { return 126 + Math.sin(xx * TAU * 3) * 2; };
    land(n, nf, D, 6);
    var branch = function (bx, by, a, len, w, depth) {
      var ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
      line(n, bx, by, ex, ey, w, D[1]); disc(n, ex, ey, w * 0.7, D[1]); R(n, ex - w * 0.5, ey - w * 0.6, HP, HP, D[2]);
      if (depth) { branch(ex, ey, a - 0.45, len * 0.7, Math.max(1, w * 0.75), depth - 1); branch(ex, ey, a + 0.45, len * 0.7, Math.max(1, w * 0.75), depth - 1); }
    };
    for (i = 0; i < 6; i++) { x = i * 86 + rnd() * 40; branch(x, nf(x) + 1, -Math.PI / 2 + (rnd() - 0.5) * 0.3, 7 + rnd() * 4, 2, 2); }
    for (i = 0; i < 7; i++) { x = rnd() * SW; ball(n, x, nf(x) + 2, 5 + rnd() * 4, [D[0], D[1], mix(D[1], D[2], 0.35)]); }
    for (i = 0; i < 12; i++) { var sx = rnd() * SW, sh = 16 + rnd() * 22; for (k = 0; k < sh; k += HP) R(n, sx + Math.sin(k * 0.2 + i) * 1.6, nf(sx) - k, 1, HP, D[1]); }
    for (i = 0; i < 3; i++) { x = i * 170 + 70 + rnd() * 40; y = nf(x) + 1; glow(n, x, y - 5, 12, CR[i % 2][1], 0.8); crystal(n, x, y, 11, 3, 0.15, CR[i % 2]); crystal(n, x + 3.5, y, 7, 2.4, 0.45, CR[i % 2]); }
    for (i = 0; i < 26; i++) { x = rnd() * SW; y = 30 + rnd() * 90; var br = 0.6 + rnd() * 1.4; n.globalAlpha = 0.5; ring(n, x, y, br * 0.6, br, '#c8f8ff'); R(n, x - br * 0.4, y - br * 0.5, HP, HP, '#ffffff'); }
    n.globalAlpha = 1;
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  GEN.desert = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    // a big friendly sun and a few wisps
    var far = strip(), g = far.getContext('2d');
    sun(g, 110, 30, 15, ['#fff6c8', '#fff0a0', '#fffbe6']);
    for (i = 0; i < 4; i++) streak(g, rnd() * SW, 12 + rnd() * 34, 40 + rnd() * 50, 2 + rnd() * 2, [mix('#d0e8ff', hz, 0.2), '#ffffff', '#ffffff']);
    L.push({ c: far, f: 0.03 });

    // pyramids far across the sand, swimming in the heat haze
    var py = strip(), p = py.getContext('2d');
    var pyramid = function (cx, base, h, haze) {
      var c = [mix('#e0a878', hz, haze), mix('#f6d098', hz, haze), mix('#fff2d0', hz, haze), mix('#eec48c', hz, haze)], ap = base - h;
      span(p, ap, base, function (yy) { return cx - (yy - ap); }, function (yy) { return cx + (yy - ap) * 0.3; }, c[1]);
      span(p, ap, base, function (yy) { return cx + (yy - ap) * 0.3; }, function (yy) { return cx + (yy - ap); }, c[0]);
      for (var yy = ap + 3; yy < base; yy += 3) R(p, cx - (yy - ap) + 1, yy, (yy - ap) * 1.3 - 1, HP, c[3]);
      line(p, cx, ap, cx - h, base, HP, c[2]);
      R(p, cx - HP, ap - HP, 1, 1, '#ffe27a');
    };
    pyramid(300, 101, 30, 0.5); pyramid(338, 101, 19, 0.55); pyramid(84, 101, 15, 0.6);
    land(p, function (xx) { return 99 + Math.sin(xx * TAU * 2) * 1.5; }, [mix('#ecbc84', hz, 0.55), mix('#f8d8a0', hz, 0.55), mix('#fff4d8', hz, 0.45)], 6);
    p.globalAlpha = 0.6;
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = 90 + rnd() * 10; R(p, x, y + Math.sin(x) * HP, 3 + rnd() * 8, HP, hz); }
    p.globalAlpha = 1;
    mist(p, 86, 16, hz);
    L.push({ c: py, f: 0.06 });

    // red rock: flat-topped mesas banded with strata, and a natural arch
    var ms = strip(), q = ms.getContext('2d');
    var MC = [mix('#c0684a', hz, 0.38), mix('#e48c5c', hz, 0.38), mix('#ffc890', hz, 0.3), mix('#d87c52', hz, 0.38)];
    var butte = function (cx, top, base, w) {
      for (var yy = top; yy < base; yy += HP) {
        var k = (yy - top) / (base - top), hw = w / 2 + (k > 0.7 ? Math.pow((k - 0.7) / 0.3, 2) * w * 0.35 : 0) + Math.sin(yy * 1.3 + cx) * 0.4;
        var band = Math.floor((yy - top) / 3) % 2 && k < 0.72 ? MC[3] : MC[1];
        R(q, cx - hw, yy, hw * 2, HP, band);
        if (k < 0.72) R(q, cx - hw, yy, Math.max(HP, hw * 0.22), HP, MC[2]);
        R(q, cx + hw * 0.55, yy, hw * 0.45, HP, MC[0]);
      }
      R(q, cx - w / 2, top, w, HP, MC[2]);
    };
    butte(56, 72, 108, 40); butte(96, 84, 108, 20); butte(402, 78, 108, 52); butte(452, 90, 108, 16);
    arch(q, 236, 108, 30, 36, 8, [MC[0], MC[1], MC[2]]);
    land(q, function (xx) { return 104 + Math.sin(xx * TAU * 3 + 1) * 2.5; }, [mix('#e8b07a', hz, 0.4), mix('#f8d098', hz, 0.4), mix('#fff0c8', hz, 0.3)], 10);
    mist(q, 94, 16, hz);
    L.push({ c: ms, f: 0.11 });

    // the dunes: crests sharp, slip faces in shade, a camel train on the march
    var dn = strip(), d = dn.getContext('2d');
    var DC = [mix('#e0a46a', hz, 0.22), mix('#f8c888', hz, 0.22), mix('#fff0c8', hz, 0.15), mix('#eab474', hz, 0.22)];
    var df = function (xx) { return 113 + Math.sin(xx * TAU * 2) * 3 + Math.sin(xx * TAU * 5 + 2) * 1.5; };
    land(d, df, [DC[3], DC[1], DC[2]], 12);
    var crest = [];
    for (i = 0; i < 6; i++) { x = i * 88 + rnd() * 40; var cy = 94 + rnd() * 10, wl = 34 + rnd() * 16; dune(d, x, cy, 116, wl, 18 + rnd() * 10, DC); crest.push([x, cy, wl]); }
    var cam = mix('#a8704a', hz, 0.25), cr = crest[2];
    var camel = function (cx, cy) {
      R(d, cx - 2, cy - 2, HP, 2, cam); R(d, cx - 1, cy - 2, HP, 2, cam); R(d, cx + 1.5, cy - 2, HP, 2, cam); R(d, cx + 2.5, cy - 2, HP, 2, cam);
      R(d, cx - 2.5, cy - 3.5, 5.5, 1.5, cam); R(d, cx - 1.5, cy - 4.5, 3, 1, cam); R(d, cx - 0.5, cy - 5, 1.5, HP, cam);
      R(d, cx + 3, cy - 4.5, 1, 1.5, cam); R(d, cx + 3.5, cy - 5.5, 1.5, 1, cam);
    };
    for (i = 0; i < 4; i++) { var u = 0.85 - i * 0.2; x = cr[0] - cr[2] * u; camel(x, cr[1] + u * u * (116 - cr[1]) + 0.5); }
    R(d, cr[0] - cr[2] * 0.85 - 0.5, cr[1] + 0.72 * (116 - cr[1]) - 7, 1.5, 2, mix('#f4f0e8', hz, 0.2)); R(d, cr[0] - cr[2] * 0.85 - 0.5, cr[1] + 0.72 * (116 - cr[1]) - 7.5, 1.5, 1, mix('#e05a4a', hz, 0.2));
    var cactus = function (g2, cx, base, h, c) {
      var stem = function (sx, y0, y1, w) { R(g2, sx - w / 2, y0 + w / 2, w, y1 - y0 - w / 2, c[1]); disc(g2, sx, y0 + w / 2, w / 2, c[1]); R(g2, sx + w * 0.2, y0 + w / 2, w * 0.3, y1 - y0 - w / 2, c[0]); R(g2, sx - w / 2 + HP, y0 + w / 2, HP, y1 - y0 - w, c[2]); };
      stem(cx, base - h, base, h > 12 ? 3 : 2);
      R(g2, cx - 4, base - h * 0.42, 3, 1.5, c[1]); stem(cx - 4, base - h * 0.72, base - h * 0.42 + 1.5, h > 12 ? 2.2 : 1.6);
      R(g2, cx + 1, base - h * 0.58, 3, 1.5, c[0]); stem(cx + 4, base - h * 0.86, base - h * 0.58 + 1.5, h > 12 ? 2.2 : 1.6);
      if (c[3]) disc(g2, cx - HP, base - h + 0.5, 1, c[3]);
    };
    for (i = 0; i < 5; i++) { x = rnd() * SW; cactus(d, x, df(x) + 2, 8 + rnd() * 4, [mix('#3a8a5a', hz, 0.3), mix('#5aaa62', hz, 0.3), mix('#9ad88a', hz, 0.25)]); }
    mist(d, 106, 14, hz);
    L.push({ c: dn, f: 0.2 });

    // the dunes in front, and the saguaros, each in flower
    var nr = strip(), n = nr.getContext('2d');
    var NC = ['#eaa868', '#ffd496', '#fff6d8', '#f4c080'];
    var nf = function (xx) { return 122 + Math.sin(xx * TAU * 2) * 2; };
    land(n, nf, [NC[3], NC[1], NC[2]], 10);
    for (i = 0; i < 4; i++) { x = i * 128 + rnd() * 60; dune(n, x, 104 + rnd() * 6, 125, 46 + rnd() * 20, 26 + rnd() * 10, NC); }
    for (i = 0; i < 4; i++) { x = i * 128 + 90 + rnd() * 30; cactus(n, x, nf(x) + 2, 17 + rnd() * 7, ['#2e7a4a', '#4c9c56', '#8ad478', '#ff8ab0']); }
    for (i = 0; i < 30; i++) { x = rnd() * SW; y = nf(x) + 1 + rnd() * 4; R(n, x, y, 1 + rnd(), 1, rnd() > 0.5 ? '#d89a60' : '#fff0d0'); }
    L.push({ c: nr, f: 0.36 });
    return L;
  };

  GEN.moon = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    // a band of nebula, a sky thick with stars, a huge pale moon and a ringed planet
    var far = strip(), g = far.getContext('2d');
    for (x = 0; x < SW; x += HP) {
      var u = x * TAU, ny = 26 + Math.sin(u) * 12 + Math.sin(u * 3 + 1) * 3, nw = 9 + Math.sin(u * 2 + 2) * 3 + Math.sin(u * 5) * 2;
      var nc = mix('#ff8ad8', '#7ab4ff', 0.5 + 0.5 * Math.sin(u * 2));
      [1, 0.7, 0.45, 0.25].forEach(function (q) { g.globalAlpha = 0.045; R(g, x, ny - nw * q + Math.sin(x * 0.3) * 0.5 * q, HP, nw * q * 2, q < 0.5 ? mix(nc, '#ffffff', 0.3) : nc); });
    }
    g.globalAlpha = 1;
    for (i = 0; i < 70; i++) { x = rnd() * SW; var u2 = x * TAU; R(g, x, 26 + Math.sin(u2) * 12 + Math.sin(u2 * 3 + 1) * 3 + (rnd() - 0.5) * 12, HP, HP, rnd() > 0.5 ? '#ffffff' : '#ffe8ff'); }
    stars(g, 160, 2, 96, rnd, ['#ffffff', '#ffe8ff', '#c8e0ff', '#fff4c0']);
    glow(g, 110, 42, 48, '#c8b8ff', 0.55);
    disc(g, 111.5, 43.5, 25, '#a294d4'); disc(g, 110, 42, 24, '#e2daf8'); disc(g, 104, 36, 14, '#f2eeff');
    [[100, 34, 4.5], [118, 48, 6], [96, 52, 3], [121, 31, 2.5], [108, 58, 2.2], [88, 42, 2.4], [126, 40, 2]].forEach(function (q) { crater(g, q[0], q[1], q[2], q[2], ['#bcb0e2', '#e2daf8', '#f8f4ff']); });
    // the planet's ring passes behind it, then in front
    var PX = 380, PY = 28;
    var hoop = function (front) { for (var yy = front ? 0 : -4; yy < (front ? 4 : 0); yy += HP) { var o = 17 * Math.sqrt(Math.max(0, 1 - yy * yy / 16)), ii = 12 * Math.sqrt(Math.max(0, 1 - yy * yy / 5.5)); R(g, PX - o, PY + yy, o - ii, HP, '#ffe0c0'); R(g, PX + ii, PY + yy, o - ii, HP, front ? '#f0b8a0' : '#ffe0c0'); } };
    hoop(false);
    ball(g, PX, PY, 8.5, ['#d07a7a', '#ffb4a0', '#ffe0cc']);
    R(g, PX - 7, PY - 2, 13, 1, '#f09a90'); R(g, PX - 6, PY + 2.5, 12, 1, '#f09a90');
    hoop(true);
    for (i = 0; i < 14; i++) { g.globalAlpha = 1 - i / 14; R(g, 250 + i * 1.5, 18 + i * 0.5, 1.5, HP, '#ffffff'); }
    g.globalAlpha = 1;
    L.push({ c: far, f: 0.02 });

    // far hills of grey-lilac dust, pocked with craters
    var bk = strip(), b = bk.getContext('2d');
    var C1 = [mix('#4c4084', hz, 0.42), mix('#7c70b0', hz, 0.42), mix('#c8bcee', hz, 0.32)];
    var bf = function (xx) { return 96 + Math.sin(xx * TAU * 3 + 1) * 7 + Math.sin(xx * TAU * 4) * 3; };
    land(b, bf, C1, 12);
    for (i = 0; i < 22; i++) { x = rnd() * SW; crater(b, x, bf(x) + 4 + rnd() * 16, 2 + rnd() * 4, 0.8 + rnd() * 1.2, [mix('#5c5094', hz, 0.42), C1[1], C1[2]]); }
    mist(b, 90, 30, hz);
    L.push({ c: bk, f: 0.07 });

    // nearer hills: craters, little crystal spires, and pebbles floating
    // loose in the low gravity, each over its own shadow
    var md = strip(), m = md.getContext('2d');
    var C2 = [mix('#584a90', hz, 0.24), mix('#9488c4', hz, 0.24), mix('#dcd2f8', hz, 0.18)];
    var mf = function (xx) { return 110 + Math.sin(xx * TAU * 4) * 5 + Math.sin(xx * TAU * 6) * 2; };
    land(m, mf, C2, 10);
    for (i = 0; i < 18; i++) { x = rnd() * SW; crater(m, x, mf(x) + 4 + rnd() * 12, 3 + rnd() * 5, 1 + rnd() * 1.4, [mix('#6a5ca4', hz, 0.24), C2[1], C2[2]]); }
    for (i = 0; i < 6; i++) { x = i * 86 + rnd() * 40; var cc = [[mix('#b04a9a', hz, 0.2), mix('#ff8ad0', hz, 0.2), '#ffe0f4'], [mix('#2a8ab0', hz, 0.2), mix('#6ae0f0', hz, 0.2), '#e0feff']][i % 2]; glow(m, x, mf(x) - 4, 10, cc[1], 0.6); crystal(m, x, mf(x) + 1, 9 + rnd() * 4, 2.6, 0.1, cc); crystal(m, x + 3, mf(x) + 1, 6, 2, 0.4, cc); }
    for (i = 0; i < 8; i++) { x = rnd() * SW; y = 62 + rnd() * 30; var pr = 1.5 + rnd() * 2.5; m.globalAlpha = 0.3; oval(m, x, mf(x) + 2, pr * 1.2, pr * 0.3, '#2a2058'); m.globalAlpha = 1; ball(m, x, y, pr, [mix('#5a4c8c', hz, 0.2), mix('#9a8cc8', hz, 0.2), mix('#e0d8ff', hz, 0.15)]); }
    mist(m, 104, 18, hz);
    L.push({ c: md, f: 0.15 });

    // in front: crystal flowers on slender stems, each glowing softly
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 122 + Math.sin(xx * TAU * 2) * 2.5; };
    land(n, nf, ['#3c2e6c', '#5c4c90', '#a294d0'], 8);
    for (i = 0; i < 10; i++) { x = rnd() * SW; crater(n, x, nf(x) + 3 + rnd() * 3, 3 + rnd() * 3, 0.9, ['#463874', '#5c4c90', '#8a7cc0']); }
    var PET = [['#c84aa8', '#ff8ad8', '#ffe0f6'], ['#3a9ac8', '#7ae4ff', '#e4fcff'], ['#7a5ad8', '#b49aff', '#f0e8ff']];
    for (i = 0; i < 12; i++) {
      x = i * 43 + rnd() * 24; var gy = nf(x) + 1, h = 12 + rnd() * 12, pc = PET[i % 3], tx = x + Math.sin(i) * 2;
      for (y = 0; y < h; y += HP) R(n, x + Math.sin(y / h * Math.PI) * Math.sin(i) * 2, gy - y, HP, HP, '#58c8b0');
      oval(n, x - 2, gy - 3, 2, 0.8, '#3a9a8a'); oval(n, x + 2.2, gy - 5, 2, 0.8, '#58c8b0');
      var fy = gy - h;
      glow(n, tx, fy, 9, pc[1], 0.85);
      for (var a = 0; a < 5; a++) { var ang = a / 5 * Math.PI * 2 - Math.PI / 2, lit = Math.cos(ang + 2.3) > 0.2; for (var t = 0.6; t < 3.6; t += HP) disc(n, tx + Math.cos(ang) * t, fy + Math.sin(ang) * t, Math.max(HP, 1.2 * Math.sin(Math.PI * t / 3.8)), lit ? pc[2] : pc[1]); }
      disc(n, tx, fy, 1, '#ffffff');
    }
    for (i = 0; i < 20; i++) { x = rnd() * SW; y = 50 + rnd() * 66; n.globalAlpha = 0.6; R(n, x, y, HP, HP, '#f0e8ff'); }
    n.globalAlpha = 1;
    L.push({ c: nr, f: 0.32 });
    return L;
  };

  GEN.clock = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    /* The tower is climbed, and as the camera rises drawBackdrop slides each
       layer down (its lift). So these strips reach up above the screen by as
       much as they will slide, and nothing hanging from the top comes loose. */
    var tall = function (f) { var e = Math.ceil(H * f * 1.6) + 1, c = BB.surface(SW, H + e); c.getContext('2d').translate(0, e); return { c: c, f: f, y: -e, e: e }; };
    /* The back wall: boards, tall arched windows onto a dusky sky, and great
       clock faces. Kept low in contrast, so the busy machinery never crowds
       the play in front. */
    var far = tall(0.06), g = far.c.getContext('2d');
    g.globalAlpha = 0.16;
    for (x = 0; x < SW; x += 8) R(g, x, -far.e, HP, H + far.e, '#1a0c06');
    for (i = 0; i < 40; i++) R(g, Math.floor(rnd() * 64) * 8 + 1, rnd() * (H + far.e) - far.e, HP, HP, '#ffe0a0');
    g.globalAlpha = 1;
    var window_ = function (wx, wy, ww, wh) {
      g.globalAlpha = 0.12;
      span(g, wy + wh, wy + wh + 30, function (yy) { return wx - (yy - wy - wh) * 0.4; }, function (yy) { return wx + ww + (yy - wy - wh) * 0.4; }, '#ffb070');
      g.globalAlpha = 1;
      R(g, wx - 2, wy + ww / 2, ww + 4, wh - ww / 2 + 2, '#2a160c'); disc(g, wx + ww / 2, wy + ww / 2, ww / 2 + 2, '#2a160c');
      var sky = function (yy) { var k = (yy - wy) / wh; return k < 0.5 ? mix('#5a4a8a', '#c87a90', k / 0.5) : mix('#c87a90', '#ffb070', (k - 0.5) / 0.5); };
      for (var yy = wy; yy < wy + wh; yy += HP) {
        var dy = wy + ww / 2 - yy, half = dy > 0 ? Math.sqrt(Math.max(0, (ww / 2) * (ww / 2) - dy * dy)) : ww / 2;
        R(g, wx + ww / 2 - half, yy, half * 2, HP, mix(sky(yy), hz, 0.25));
      }
      for (var s2 = 0; s2 < 4; s2++) R(g, wx + 2 + rnd() * (ww - 4), wy + 4 + rnd() * 10, HP, HP, '#fff4d0');
      R(g, wx + ww / 2 - 0.75, wy, 1.5, wh, '#2a160c'); R(g, wx, wy + wh * 0.42, ww, 1.5, '#2a160c');
      R(g, wx - 3, wy + wh, ww + 6, 2, '#5a3a22'); R(g, wx - 3, wy + wh, ww + 6, HP, '#8a5a34');
    };
    window_(26, 18, 20, 58); window_(246, 18, 20, 58); window_(384, 24, 16, 48);
    var face = function (cx, cy, r) {
      var BR = [mix('#6a4420', hz, 0.3), mix('#a87838', hz, 0.3), mix('#e8c070', hz, 0.3)];
      disc(g, cx + 1, cy + 1, r + 2, '#2a160c'); disc(g, cx, cy, r + 2, BR[1]); disc(g, cx + 0.6, cy + 0.6, r + 0.8, BR[0]); disc(g, cx - 0.4, cy - 0.4, r + 0.8, BR[2]); disc(g, cx, cy, r, mix('#ead6a8', hz, 0.4));
      for (var a = 0; a < 60; a++) { var ang = a / 60 * Math.PI * 2, big = a % 5 === 0, d = big ? r - 3 : r - 1.5; R(g, cx + Math.cos(ang) * d - (big ? 0.75 : 0.25), cy + Math.sin(ang) * d - (big ? 0.75 : 0.25), big ? 1.5 : HP, big ? 1.5 : HP, mix('#4a2c18', hz, 0.3)); }
      // ten past ten: the clock is smiling
      line(g, cx, cy, cx + Math.cos(-Math.PI / 2 - 1.05) * r * 0.5, cy + Math.sin(-Math.PI / 2 - 1.05) * r * 0.5, 1.5, mix('#3a2010', hz, 0.2));
      line(g, cx, cy, cx + Math.cos(-Math.PI / 2 + 1.05) * r * 0.78, cy + Math.sin(-Math.PI / 2 + 1.05) * r * 0.78, 1, mix('#3a2010', hz, 0.2));
      disc(g, cx, cy, 2, BR[1]); disc(g, cx - HP, cy - HP, 0.8, BR[2]);
    };
    face(146, 54, 34); face(470, 46, 18); face(330, 34, 12);
    L.push(far);

    // the works: brass gears meshed together, pendulums, a truss of beams
    var wk = tall(0.14), w = wk.c.getContext('2d'), E = wk.e;
    var BR = [mix('#5a3818', hz, 0.42), mix('#946428', hz, 0.42), mix('#d8a850', hz, 0.38), mix('#3a2412', hz, 0.38)];
    var WB = [mix('#3a2212', hz, 0.3), mix('#5a3820', hz, 0.3), mix('#8a5a34', hz, 0.3)];
    [60, 300].forEach(function (tx) {
      line(w, tx, -E, tx + 60, 76, 3, WB[1]); line(w, tx + 60, -E, tx, 76, 3, WB[1]);
      line(w, tx, -E + 0.5, tx + 60, 76.5, HP, WB[2]);
    });
    [[86, 92, 22, 0], [62, 62, 13, 0.3], [50, 36, 9, 0.1], [214, 104, 16, 0.2], [362, 84, 26, 0.1], [398, 52, 12, 0.5], [458, 104, 14, 0], [250, 30, 10, 0.4]].forEach(function (q) { gear(w, q[0], q[1], q[2], BR, q[3]); });
    [[186, 78, 0.06], [276, 64, 0], [430, 88, -0.05]].forEach(function (q) {
      var bx = q[0] + q[2] * q[1], by = q[1];
      line(w, q[0] - q[2] * E, -E, bx, by, 1, BR[0]); line(w, q[0] - q[2] * E - HP, -E, bx - HP, by, HP, BR[2]);
      ball(w, bx, by + 4, 5, [BR[0], BR[1], BR[2]]); disc(w, bx - 1.5, by + 2.5, 1, mix('#fff0c0', hz, 0.3));
    });
    mist(w, 96, 40, hz);
    L.push(wk);

    /* In front: the tower's heavy timbers — posts banded with iron, short
       braces at their joints, chains hanging down. All upright: on a climb
       this layer slides down past the play, and a beam across it would look
       like a floor to land on. */
    var nr = tall(0.3), n = nr.c.getContext('2d'), NE = nr.e;
    var NB = ['#24120a', '#3a2212', '#6a4426'];
    [80, 336].forEach(function (px) {
      R(n, px, -NE, 10, H + NE, NB[1]); R(n, px + 7.5, -NE, 2.5, H + NE, NB[0]); R(n, px + 1, -NE, HP, H + NE, NB[2]);
      for (y = -58; y < H; y += 26) { R(n, px - 1, y, 12, 2, NB[0]); R(n, px - 1, y, 12, HP, NB[2]); }
      [-62, 6].forEach(function (by) { line(n, px, by + 14, px - 7, by + 4, 2.5, NB[1]); line(n, px + 10, by + 14, px + 17, by + 4, 2.5, NB[1]); line(n, px - 1, by + 13, px - 7, by + 3.5, HP, NB[2]); });
    });
    [[196, 58], [452, 40]].forEach(function (q) {
      for (y = -NE; y < q[1]; y += 3) { R(n, q[0] - 1, y, 2, 2, NB[0]); R(n, q[0] - HP, y + HP, 1, 1, NB[1]); R(n, q[0], y + 2, HP, 1, NB[2]); }
      ring(n, q[0], q[1] + 3, 1.5, 2.5, NB[1], q[1] + 5); R(n, q[0] - 2.5, q[1] + 3, 1, 2, NB[1]);
    });
    gear(n, 210, 132, 16, ['#24120a', '#3a2212', '#5a3a1e', '#1a0c06'], 0.2);
    gear(n, 470, 136, 12, ['#24120a', '#3a2212', '#5a3a1e', '#1a0c06'], 0);
    L.push(nr);
    return L;
  };

  GEN.ship = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    // golden hour high above the world: a big low sun, long bright streaks of cloud
    var far = strip(), g = far.getContext('2d');
    [[3.4, 0.05], [2.6, 0.08], [1.9, 0.13], [1.4, 0.22]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, 330, 76, 15 * q[0], '#fff4c0'); });
    g.globalAlpha = 1;
    disc(g, 330, 76, 15, '#ffc24c'); disc(g, 329.2, 75, 13.6, '#ffd468'); disc(g, 325.5, 71, 6.4, '#fff0a8');
    for (i = 0; i < 9; i++) streak(g, rnd() * SW, 14 + rnd() * 60, 40 + rnd() * 70, 1.5 + rnd() * 3, [mix('#f0a090', hz, 0.15), mix('#ffd0a8', hz, 0.1), '#fff4d0'], true);
    for (i = 0; i < 8; i++) bird(g, rnd() * SW, 20 + rnd() * 40, mix('#a0605a', hz, 0.35));
    L.push({ c: far, f: 0.03 });

    // a sea of cloud far below, row on row of heaped tops lit gold along
    // their crowns, smaller and paler towards the horizon
    var heaps = function (g2, y, s, c) {
      var bs = [], N = SW / HP;
      for (var bx = rnd() * 8 * s; bx < SW;) { var q = rnd(), br = (4 + q * q * 12) * s; bs.push([bx, br, y + (rnd() - 0.5) * 5 * s + (1 - q) * 2 * s]); bx += br * (1 + rnd() * 0.7); }
      // the skyline of the heaps, worked out column by column (and again,
      // shifted down and right, for the shadow each heap casts on the next)
      var skyline = function (dx, dy) {
        var a = [], rr = [], uu = [];
        for (var i = 0; i < N; i++) { a.push(y + 6 * s); rr.push(6 * s); uu.push(0); }
        bs.forEach(function (b) {
          for (var u = -b[1]; u < b[1]; u += HP) {
            var j = ((Math.round((b[0] + dx + u) / HP) % N) + N) % N, t = b[2] + dy - Math.sqrt(b[1] * b[1] - u * u);
            if (t < a[j]) { a[j] = t; rr[j] = b[1]; uu[j] = u; }
          }
        });
        return [a, rr, uu];
      };
      var sh = skyline(2.5 * s, 1.5 * s), bd = skyline(0, 0);
      for (var i = 0; i < N; i++) {
        var xx = i * HP;
        R(g2, xx, sh[0][i], HP, H - sh[0][i], c[0]);
        R(g2, xx, bd[0][i], HP, bd[1][i] * 0.85, c[1]);
        R(g2, xx, bd[0][i], HP, bd[2][i] < 0 ? HP * 3 : HP * 2, c[2]);
      }
    };
    var CL = function (a) { return [mix('#f0a4ac', hz, a), mix('#ffd6b8', hz, a), mix('#fff4d4', hz, a * 0.6)]; };
    var cs = strip(), c = cs.getContext('2d');
    heaps(c, 95, 0.42, CL(0.5)); heaps(c, 100, 0.58, CL(0.42)); heaps(c, 106, 0.78, CL(0.34));
    mist(c, 92, 18, hz);
    L.push({ c: cs, f: 0.06 });

    // little sky ships sailing far off, each slung beneath its balloon
    var as = strip(), a = as.getContext('2d');
    var airship = function (ax, ay, s, haze, bal) {
      var c2 = [mix('#8a5a3a', hz, haze), mix('#e8b070', hz, haze), mix('#fff4e0', hz, haze), mix('#f0c8a8', hz, haze), mix(bal[0], hz, haze), mix(bal[1], hz, haze), mix(bal[2], hz, haze)];
      oval(a, ax + 0.6 * s, ay - 12.4 * s, 9 * s, 4 * s, c2[6]); oval(a, ax, ay - 13 * s, 8.6 * s, 3.7 * s, c2[4]); oval(a, ax - 3 * s, ay - 14.4 * s, 3.4 * s, 1.3 * s, c2[5]);
      R(a, ax - 8.6 * s, ay - 13 * s, 17.2 * s, Math.max(HP, 0.7 * s), c2[1]);
      line(a, ax - 6 * s, ay - 10.5 * s, ax - 4.5 * s, ay - 3 * s, HP, c2[1]); line(a, ax + 6 * s, ay - 10.5 * s, ax + 4.5 * s, ay - 3 * s, HP, c2[1]);
      R(a, ax, ay - 9 * s, Math.max(HP, 0.5 * s), 6 * s, c2[1]);
      span(a, ay - 8.6 * s, ay - 3.4 * s, function (yy) { return ax - 3.6 * s - Math.sin((yy - ay + 8.6 * s) / (5.2 * s) * Math.PI) * 0.8 * s; }, function () { return ax - HP; }, c2[2]);
      span(a, ay - 8.6 * s, ay - 3.4 * s, function () { return ax + Math.max(HP, 0.5 * s); }, function (yy) { return ax + 3 * s + Math.sin((yy - ay + 8.6 * s) / (5.2 * s) * Math.PI) * 0.8 * s; }, c2[3]);
      span(a, ay - 3 * s, ay, function (yy) { return ax - 8 * s + (yy - ay + 3 * s) * 0.9; }, function (yy) { return ax + 8.5 * s - (yy - ay + 3 * s) * 0.6; }, c2[0]);
      R(a, ax - 8 * s, ay - 3 * s, 16.5 * s, Math.max(HP, 0.6 * s), c2[1]);
      for (var px = -4; px <= 4; px += 4) R(a, ax + px * s, ay - 1.8 * s, Math.max(HP, 0.8 * s), Math.max(HP, 0.8 * s), c2[2]);
      R(a, ax + 8.5 * s, ay - 4.5 * s, 2.5 * s, Math.max(HP, 1.2 * s), mix('#5ab8e8', hz, haze));
    };
    airship(70, 60, 0.7, 0.5, ['#e86a5a', '#ffb090', '#b84a4a']);
    airship(250, 76, 1.05, 0.4, ['#4ab8b0', '#a8f0e0', '#2a8a88']);
    airship(440, 50, 0.55, 0.55, ['#f0a040', '#ffe090', '#c07028']);
    L.push({ c: as, f: 0.1 });

    // nearer cloud tops, rolling in big and gold
    var cn = strip(), d = cn.getContext('2d');
    heaps(d, 112, 1, CL(0.22)); heaps(d, 121, 1.3, CL(0.14));
    L.push({ c: cn, f: 0.16 });

    // close by: the masts and rigging of the ship you're aboard, its sails
    // glowing with the sun behind them, the cloud sea far beneath the deck
    var nr = strip(), n = nr.getContext('2d');
    var MW = [mix('#6a3c24', hz, 0.32), mix('#8a5434', hz, 0.32), mix('#c88a58', hz, 0.3)];
    var SL = [mix('#f0b48c', hz, 0.22), mix('#ffdcb4', hz, 0.18), mix('#fff4dc', hz, 0.12)];
    var rope = mix('#7a4a30', hz, 0.4);
    heaps(n, 134, 1.5, CL(0.1));
    [96, 352].forEach(function (mx) {
      // shrouds down to the rail with ratlines between them, and a stay forward
      line(n, mx + 1, 6, mx - 30, 128, HP, rope); line(n, mx + 1, 6, mx - 21, 128, HP, rope);
      for (y = 24; y < 126; y += 6) { var k = (y - 6) / 122; R(n, mx + 1 - 30 * k, y, 9 * k, HP, rope); }
      line(n, mx + 2, 6, mx + 38, 128, HP, rope);
      // the topsail, bellied out and lit through, and the mainsail furled on its yard below
      var sy = 12, sh = 26, sw = 15, bel = function (yy) { return Math.sin((yy - sy) / sh * Math.PI) * 2.5; };
      for (y = sy; y < sy + sh; y += HP) {
        var l = mx - sw - bel(y), r = mx + sw + 2 + bel(y), wd = r - l;
        R(n, l, y, wd, HP, SL[1]); R(n, l, y, wd * 0.3, HP, SL[2]); R(n, l + wd * 0.75, y, wd * 0.25, HP, SL[0]);
        for (var sx = 1; sx < 4; sx++) R(n, l + wd * sx / 4, y, HP, HP, mix(SL[1], SL[0], 0.6));
      }
      R(n, mx - sw - 3, sy + sh - HP, sw * 2 + 8, HP, SL[0]);
      R(n, mx - sw - 2, sy - 1.5, sw * 2 + 6, 2, MW[1]); R(n, mx - sw - 2, sy - 1.5, sw * 2 + 6, HP, MW[2]);
      R(n, mx - sw - 4, 52, sw * 2 + 10, 2, MW[1]); R(n, mx - sw - 4, 52, sw * 2 + 10, HP, MW[2]);
      for (var fx = mx - sw - 2; fx < mx + sw + 4; fx += 5) oval(n, fx + 2.5, 55, 2.8, 1.6, fx % 2 ? SL[1] : SL[0]);
      R(n, mx - 1, 0, 2.5, H, MW[1]); R(n, mx + 1, 0, HP, H, MW[0]); R(n, mx - 1, 0, HP, H, MW[2]);
      // a pennant streaming from the masthead: magpie black and white, with a flash of blue
      for (var t = 0; t < 18; t += HP) { var pw = 3 * (1 - t / 18); R(n, mx + 1.5 + t, 3 + Math.sin(t * 0.4) * 1.2 - pw / 2, HP, pw, t < 6 ? '#2a2a3a' : t < 12 ? '#ffffff' : '#4a9ae8'); }
    });
    L.push({ c: nr, f: 0.28 });
    return L;
  };

  /* ==========================================================================
     THE BIG TRIP — the third land's ten worlds: over the sea to France,
     through the fields and a market village to Paris, and on to the
     fairground castle. The same painting again (haze toward the horizon,
     light from the top left, round things in three tones), with the shapes
     the journey needs.
     ========================================================================== */
  /* A strip that reaches up above the screen, for a climb. drawBackdrop slides
     each layer down by as much as lift * f * 1.6 while the camera rises (see
     GEN.clock), so the strip is that much taller, drawn from y = -e. */
  var tallStrip = function (f, lift) { var e = Math.ceil(lift * f * 1.6) + 2, c = BB.surface(SW, H + e); c.getContext('2d').translate(0, e); return { c: c, f: f, y: -e, e: e }; };
  // a gull gliding: wings bent at the wrist, the far one in shade, tips dipped in grey. c = [wing, shade, tip]
  var gull = function (g, x, y, s, c) {
    [-1, 1].forEach(function (d) {
      var w = Math.max(HP, 0.55 * s);
      line(g, x, y, x + d * 2.1 * s, y - 1.4 * s, w, d < 0 ? c[0] : c[1]);
      line(g, x + d * 2.1 * s, y - 1.4 * s, x + d * 4.4 * s, y - 0.3 * s, w, d < 0 ? c[0] : c[1]);
      R(g, x + d * 4.4 * s - (d < 0 ? 0 : w), y - 0.3 * s, w, w, c[2]);
    });
    oval(g, x, y + 0.3 * s, 1.1 * s, Math.max(HP, 0.55 * s), c[0]);
  };
  // bunting slung from (x0, y0) to (x1, y1), sagging in the middle, its little flags in turn
  var bunting = function (g, x0, y0, x1, y1, sag, cols, fw, rope) {
    line(g, x0, y0, x1, y1, HP, rope, sag);
    var n = Math.max(2, Math.floor(Math.abs(x1 - x0) / (fw * 1.7)));
    for (var i = 1; i < n; i++) {
      var t = i / n, fx = x0 + (x1 - x0) * t, fy = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t) + HP, col = cols[i % cols.length], fh = fw * 1.25;
      span(g, fy, fy + fh, function (yy) { return fx - fw / 2 * (1 - (yy - fy) / fh); }, function (yy) { return fx + fw / 2 * (1 - (yy - fy) / fh); }, col);
      R(g, fx - fw / 2, fy, fw * 0.45, HP, mix(col, '#ffffff', 0.45));
    }
  };
  /* A striped awning, seen from the front: the stripes catch the light at
     the top, a scalloped hem, and the shade it throws beneath. c = [stripe, stripe2, shade] */
  var awning = function (g, x, y, w, h, c, sw) {
    sw = sw || 2;
    for (var i = 0; i * sw < w; i++) { var col = i % 2 ? c[1] : c[0]; R(g, x + i * sw, y, Math.min(sw, w - i * sw), h, col); R(g, x + i * sw, y, Math.min(sw, w - i * sw), HP, mix(col, '#ffffff', 0.35)); disc(g, x + i * sw + sw / 2, y + h, sw / 2, col); }
    g.globalAlpha = 0.35; R(g, x, y + h + sw / 2, w, 1.5, c[2]); g.globalAlpha = 1;
  };
  /* A soft beam of light from (x0, y0), fading towards (x1, y1) and widening
     from w0 to w1: three nested bands, so its sides are soft. */
  var beam = function (g, x0, y0, x1, y1, w0, w1, col, a) {
    var n = Math.max(1, Math.ceil(Math.abs(y1 - y0) / HP));
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, w = w0 + (w1 - w0) * t;
      for (var q = 1; q > 0.3; q -= 0.33) { g.globalAlpha = a * (1 - t) * 0.34; R(g, x - w * q / 2, y, w * q, HP, col); }
    }
    g.globalAlpha = 1;
  };
  /* The Eiffel Tower seen far across the city: four legs curving up from a
     wide foot, the great arch between them, two platforms and the long
     spire. Its lattice is see-through, so inside it is paler than at its
     edges. c = [edge, lattice, light] */
  var eiffel = function (g, cx, base, h, c) {
    var hw = function (k) { return Math.max(0.5, 0.205 * h * Math.exp(-3 * k)); };
    for (var y = 0; y < h * 0.93; y += HP) {
      var k = y / h, yy = base - y, w = hw(k), lw = Math.max(1, w * 0.3), e = Math.max(HP, w * 0.13);
      if (k < 0.16) {
        var ao = (w - lw) * Math.sqrt(Math.max(0, 1 - Math.pow(k / 0.16, 2)));
        R(g, cx - w, yy, w - ao, HP, c[1]); R(g, cx + ao, yy, w - ao, HP, c[1]);
        if (ao > HP) { R(g, cx - ao - HP, yy, HP, HP, c[0]); R(g, cx + ao, yy, HP, HP, c[0]); }
      } else R(g, cx - w, yy, w * 2, HP, c[1]);
      R(g, cx - w, yy, e, HP, c[2]); R(g, cx + w - e, yy, e, HP, c[0]);
    }
    // criss-cross bracing in the legs and the stage above them
    for (var s = 0; s < 3; s++) {
      var k0 = s * 0.063, k1 = k0 + 0.063, w0 = hw(k0), w1 = hw(k1);
      [-1, 1].forEach(function (d) { line(g, cx + d * w0, base - k0 * h, cx + d * (w1 - w1 * 0.3), base - k1 * h, HP, c[0]); line(g, cx + d * (w0 - w0 * 0.3), base - k0 * h, cx + d * w1, base - k1 * h, HP, c[0]); });
    }
    [[0.19, 0.38], [0.38, 0.6]].forEach(function (q) { var a = hw(q[0]), b = hw(q[1]); line(g, cx - a, base - q[0] * h, cx + b, base - q[1] * h, HP, c[0]); line(g, cx + a, base - q[0] * h, cx - b, base - q[1] * h, HP, c[0]); });
    // the platforms, and the lookout at the top under its mast
    R(g, cx - hw(0.19) - 1.2, base - h * 0.19 - 1.5, hw(0.19) * 2 + 2.4, 1.5, c[0]); R(g, cx - hw(0.19) - 1.2, base - h * 0.19 - 1.5, hw(0.19) * 2 + 2.4, HP, c[2]);
    R(g, cx - hw(0.38) - 0.8, base - h * 0.38 - 1, hw(0.38) * 2 + 1.6, 1, c[0]); R(g, cx - hw(0.38) - 0.8, base - h * 0.38 - 1, hw(0.38) * 2 + 1.6, HP, c[2]);
    R(g, cx - 1.2, base - h * 0.95, 2.4, 1.5, c[0]); R(g, cx - HP, base - h * 1.05, HP * 2, h * 0.1, c[0]);
  };
  /* A white basilica on its hill: a tall egg-shaped dome on its drum,
     smaller domes at its shoulders, a square bell tower behind.
     c = [shade, body, light] */
  var basilica = function (g, cx, base, s, c) {
    var dome = function (x, y, rx, ry) { oval(g, x + rx * 0.12, y, rx, ry, c[0], true); oval(g, x - rx * 0.06, y, rx * 0.86, ry * 0.97, c[1], true); oval(g, x - rx * 0.4, y - ry * 0.45, rx * 0.3, ry * 0.32, c[2]); };
    R(g, cx + 6 * s, base - 16 * s, 3 * s, 16 * s, c[0]); R(g, cx + 6 * s, base - 16 * s, s, 16 * s, c[1]); dome(cx + 7.5 * s, base - 16 * s, 1.7 * s, 2.6 * s);
    R(g, cx - 10 * s, base - 6 * s, 20 * s, 6 * s, c[1]); R(g, cx + 5 * s, base - 6 * s, 5 * s, 6 * s, c[0]); R(g, cx - 10 * s, base - 6 * s, 20 * s, HP, c[2]);
    [-6.5, 6.5].forEach(function (d) { R(g, cx + d * s - 1.5 * s, base - 8.5 * s, 3 * s, 2.5 * s, d < 0 ? c[1] : c[0]); dome(cx + d * s, base - 8.5 * s, 1.9 * s, 2.8 * s); });
    R(g, cx - 3.2 * s, base - 11 * s, 6.4 * s, 5 * s, c[1]); R(g, cx + 1.6 * s, base - 11 * s, 1.6 * s, 5 * s, c[0]);
    for (var a = -2; a <= 2; a++) R(g, cx + a * 1.2 * s - HP / 2, base - 10.5 * s, HP, 4 * s, c[0]);
    dome(cx, base - 11 * s, 4 * s, 7 * s);
    R(g, cx - 0.6 * s, base - 19.6 * s, 1.2 * s, 1.8 * s, c[1]); dome(cx, base - 19.6 * s, 0.8 * s, 1.1 * s);
    R(g, cx - HP / 2, base - 22 * s, HP, 1.4 * s, c[0]);
  };
  /* A Paris building: a cream stone front, rows of tall windows with iron
     balconies on two floors, a cornice, and the zinc mansard above with its
     dormers and a chimney stack crowned with pots. top is the cornice.
     Z = zinc [shade, body, light], S = stone [shade, body, light],
     P = [pot, pot light, iron, glass, glass glint] */
  var paris = function (g, x, w, top, Z, S, P, rnd) {
    var rh = 9, inset = 3.2, i, yy;
    span(g, top - rh, top, function (y) { return x - 0.5 + (top - y) / rh * inset; }, function (y) { return x + w + 0.5 - (top - y) / rh * inset; }, Z[1]);
    for (yy = top - rh; yy < top; yy += HP) { var k = (top - yy) / rh; R(g, x - 0.5 + k * inset, yy, 1, HP, Z[2]); R(g, x + w - 0.5 - k * inset, yy, 1, HP, Z[0]); }
    for (var sx = x + 2.5; sx < x + w - 2; sx += 2.5) R(g, sx, top - rh + 2, HP, rh - 2, mix(Z[1], Z[0], 0.45));
    R(g, x + inset - 0.5, top - rh - 1, w - inset * 2 + 1, 1, Z[2]);
    // dormers, each window lit gold by the low sun
    for (var dx = x + 4; dx < x + w - 5; dx += 7) {
      R(g, dx - 0.5, top - 6.5, 4, 5.5, S[1]); R(g, dx + 2.5, top - 6.5, 1, 5.5, S[0]); oval(g, dx + 1.5, top - 6.5, 2.4, 1.4, S[2], true);
      R(g, dx + 0.5, top - 5.5, 2, 3.5, P[3]); R(g, dx + 0.5, top - 5.5, 1, 1.5, P[4]);
    }
    // a chimney stack crowned with pots
    var cx = x + 3 + Math.floor(rnd() * (w - 10)), cw = 4 + Math.floor(rnd() * 4), ch = 4 + rnd() * 4, ct = top - rh - ch;
    R(g, cx, ct, cw, ch + 1, S[1]); R(g, cx + cw - 1, ct, 1, ch + 1, S[0]); R(g, cx - 0.5, ct, cw + 1, 1, S[2]);
    for (var px = cx + 0.5; px < cx + cw - 0.5; px += 1.5) { var ph = 1.5 + rnd() * 1.5; R(g, px, ct - ph, 1, ph, P[0]); R(g, px, ct - ph, 1, HP, P[1]); }
    // the stone front: a cornice, then floor on floor of tall windows
    R(g, x, top, w, H - top, S[1]); R(g, x + w - 1.5, top, 1.5, H - top, S[0]); R(g, x, top, HP, H - top, S[2]);
    R(g, x - 0.5, top, w + 1, 1, S[2]); R(g, x - 0.5, top + 1, w + 1, HP, S[0]);
    for (var fl = 0, fy = top + 3; fy < H; fl++, fy += 9) {
      for (var wx = x + 2; wx < x + w - 3; wx += 5) { R(g, wx, fy, 2.5, 5.5, P[3]); if (rnd() > 0.6) R(g, wx, fy, 1, 2, P[4]); R(g, wx - HP, fy - HP, 3.5, HP, S[2]); }
      if (fl === 1 || fl === 4) { R(g, x + 1, fy + 4.5, w - 2, HP, P[2]); for (var bx = x + 1; bx < x + w - 1; bx += 1) R(g, bx, fy + 5, HP, 1, P[2]); }
      R(g, x, fy + 7.5, w, HP, mix(S[1], S[0], 0.4));
    }
  };

  GEN.ferry = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k, SEA = 96, SX = 70;
    /* A big summer sky over the Channel, and the sea under it: the sun, high
       heaps of cloud with blue bellies, small ones sitting on the horizon,
       and the sun's glitter on the water. One layer, so they keep together. */
    var far = strip(), g = far.getContext('2d');
    sun(g, SX, 26, 10, ['#fff8d8', '#fff4c0', '#fffbea']);
    var CB = [mix('#a4c8ec', hz, 0.12), '#ffffff', '#ffffff'];
    [[136, 30, 1.2], [282, 22, 1], [392, 44, 0.85], [8, 56, 0.7], [214, 60, 0.6], [462, 18, 0.95]].forEach(function (q) { cloud(g, q[0] + rnd() * 16, q[1] + rnd() * 4, q[2], CB); });
    for (i = 0; i < 8; i++) cloud(g, i * 64 + rnd() * 30, SEA - 7 - rnd() * 4, 0.3 + rnd() * 0.2, [mix('#b8d8f2', hz, 0.45), mix('#ffffff', hz, 0.25), '#ffffff']);
    for (y = SEA; y < H; y += HP) { k = (y - SEA) / (H - SEA); R(g, 0, y, SW, HP, k < 0.3 ? mix(mix('#90ccf0', hz, 0.3), '#4c9ee0', k / 0.3) : mix('#4c9ee0', '#2a6cc0', (k - 0.3) / 0.7)); }
    R(g, 0, SEA, SW, HP, mix('#ffffff', hz, 0.2));
    // white horses: small and crowded near the horizon, longer nearer, each with its trough
    for (i = 0; i < 150; i++) { x = rnd() * SW; k = Math.pow(rnd(), 1.5); y = SEA + 1.5 + k * (H - SEA - 3); var wl = 0.8 + k * 4 * (0.5 + rnd()); R(g, x, y, wl, HP, mix('#ffffff', '#9ad0f0', 0.3 * (1 - k))); if (k > 0.3) R(g, x + 0.5, y + HP, Math.max(HP, wl - 1), HP, mix('#3c88d4', '#20589e', k)); }
    // the sun's road of glitter, spreading as it comes nearer
    for (y = SEA + HP; y < H; y += HP) {
      k = (y - SEA) / (H - SEA);
      if (rnd() < 0.4) continue;
      for (j = 0; j < 1 + Math.floor(rnd() * 2); j++) { x = SX + (rnd() + rnd() - 1) * (5 + k * 24); R(g, x - 1, y, 0.5 + rnd() * (1 + k * 3.5), HP, rnd() > 0.35 ? '#fffbe2' : '#d8f0ff'); }
    }
    // a ferry far off, heading home the other way, its wake fanning out behind it
    var fx = 176, fy = SEA + 1.5;
    for (k = 0; k < 54; k += HP) { g.globalAlpha = 0.75 * (1 - k / 54); R(g, fx + 7 + k, fy - 0.5 + k * 0.012, HP, HP, '#ffffff'); R(g, fx + 7 + k, fy + k * 0.07, HP, HP, '#ffffff'); }
    g.globalAlpha = 1;
    span(g, fy - 2, fy, function (yy) { return fx - 8 + (fy - yy) * -0.8; }, function () { return fx + 7; }, mix('#3a4a7a', hz, 0.4));
    R(g, fx - 6, fy - 4, 11, 2, mix('#ffffff', hz, 0.25)); R(g, fx - 4, fy - 5.5, 7, 1.5, mix('#ffffff', hz, 0.25));
    for (x = fx - 5; x < fx + 4; x += 1) R(g, x, fy - 3.5, HP, HP, mix('#3a4a7a', hz, 0.4));
    R(g, fx + 1, fy - 7.5, 2, 2, mix('#e04a3a', hz, 0.3)); R(g, fx + 1, fy - 7.5, 2, HP, mix('#2a2a3a', hz, 0.4));
    [[34, 0.34], [436, 0.3], [484, 0.26]].forEach(function (q) { boat(g, q[0], SEA + 1, q[1], [mix('#3a4a7a', hz, 0.4), mix('#ffffff', hz, 0.2), mix('#c8d8ea', hz, 0.3), mix('#4a5a7a', hz, 0.4)]); });
    L.push({ c: far, f: 0.03 });

    /* The coast of France ahead: low white cliffs under green downs, a
       harbour town climbing from its jetty, a church spire, and the
       lighthouse out on the headland. */
    var cst = strip(), c = cst.getContext('2d');
    var X0 = 186, X1 = 506;
    var top = function (xx) {
      var u = (xx - X0) / (X1 - X0);
      if (u <= 0 || u >= 1) return SEA;
      var e = Math.min(1, u / 0.05, (1 - u) / 0.14);
      return SEA - (3.5 + 6 * Math.exp(-Math.pow((u - 0.15) / 0.09, 2)) + 10 * Math.exp(-Math.pow((u - 0.62) / 0.08, 2)) + 3 * Math.exp(-Math.pow((u - 0.84) / 0.06, 2)) + Math.sin(u * 40) * 0.5) * Math.sqrt(e);
    };
    var CF = [mix('#b0bccf', hz, 0.42), mix('#f2ece0', hz, 0.38), mix('#ffffff', hz, 0.3)], GR = [mix('#5a9a5c', hz, 0.42), mix('#80be6e', hz, 0.4), mix('#c4ec98', hz, 0.34)];
    c.globalAlpha = 0.2;
    for (x = X0; x < X1; x += HP) { var rh = (SEA - top(x)) * 0.5; for (y = SEA + HP; y < SEA + rh; y += HP * 2) R(c, x + Math.sin(y * 2.3) * 0.5, y, HP, HP, CF[1]); }
    c.globalAlpha = 1;
    for (x = X0; x < X1; x += HP) {
      y = top(x); var sl = top(x + 1) - top(x - 1), gd = 1.6 + Math.max(0, Math.sin(x * 0.7)) * 0.9;
      R(c, x, y, HP, SEA - y, sl > 0.3 ? CF[0] : CF[1]);
      if (SEA - y > 4 && Math.sin(x * 1.3) > 0.6) R(c, x, y + gd + 1, HP, (SEA - y - gd) * 0.6, mix(CF[1], CF[0], 0.5));
      R(c, x, y, HP, gd, GR[1]); R(c, x, y + gd - HP, HP, HP, GR[0]); R(c, x, y, HP, HP, GR[2]);
    }
    for (i = 0; i < 12; i++) { x = X0 + 30 + rnd() * 120; ball(c, x, top(x) - 0.8, 1.2 + rnd() * 0.8, GR); }
    // the town: rows of cream houses under slate roofs, stepping down to the quay
    var TW = [mix('#fff6e4', hz, 0.42), mix('#f4e2c8', hz, 0.42), mix('#ffffff', hz, 0.38)], TS = mix('#c8bcc0', hz, 0.42), TR = [mix('#6a7a9a', hz, 0.45), mix('#8a6a6a', hz, 0.45)];
    for (var row = 0; row < 3; row++) for (x = 276 + row * 3; x < 352 - row * 6; x += 3.5 + rnd() * 2.5) {
      var hw = 3 + Math.floor(rnd() * 2), hh = 2.5 + Math.floor(rnd() * 2), gy = Math.min(SEA - 1, top(x + hw / 2) + 1 + row * 2.5);
      R(c, x, gy - hh, hw, hh + 1, TW[Math.floor(rnd() * 3)]); R(c, x + hw - HP, gy - hh, HP, hh + 1, TS);
      R(c, x - HP, gy - hh - 1, hw + 1, 1, TR[rnd() > 0.3 ? 0 : 1]);
      if (rnd() > 0.4) R(c, x + 1, gy - hh + 0.5, HP, HP, mix('#5a6a8a', hz, 0.4));
    }
    var ch = 318, cy2 = top(ch) + 0.5;
    R(c, ch - 1.5, cy2 - 9, 3, 9, TW[2]); R(c, ch + 0.5, cy2 - 9, 1, 9, TS);
    span(c, cy2 - 15, cy2 - 9, function (yy) { return ch - 1.6 * (yy - cy2 + 15) / 6; }, function (yy) { return ch + 1.6 * (yy - cy2 + 15) / 6; }, TR[0]);
    // the jetty, and its little light at the end
    R(c, 262, SEA - 1.5, 22, 1.5, mix('#d8d0c8', hz, 0.42)); R(c, 262, SEA - 1.5, 22, HP, TW[2]);
    R(c, 262, SEA - 5, 1.5, 3.5, mix('#ffffff', hz, 0.3)); R(c, 262, SEA - 6, 1.5, 1, mix('#4ab86a', hz, 0.3));
    lighthouse(c, 384, top(384) + 0.5, 0.6, [mix('#ffffff', hz, 0.3), mix('#f8f8f8', hz, 0.3), mix('#ccd4e4', hz, 0.38), mix('#d8463c', hz, 0.3), '#fff6c8']);
    mist(c, SEA - 10, 10, hz);
    L.push({ c: cst, f: 0.055 });

    // gulls riding the wind beside the ship, and a yacht heeling out on the water
    var md = strip(), m = md.getContext('2d');
    boat(m, 120, 104, 0.72, [mix('#2a4a8a', hz, 0.3), mix('#ffffff', hz, 0.1), mix('#d8e4f0', hz, 0.15), mix('#3a4a6a', hz, 0.3)]);
    m.globalAlpha = 0.3; for (k = 0; k < 18; k += HP) R(m, 124 + k, 104 + k * 0.05, HP, HP, '#ffffff'); m.globalAlpha = 1;
    for (i = 0; i < 6; i++) gull(m, i * 85 + rnd() * 50, 22 + rnd() * 46, 0.75 + rnd() * 0.35, [mix('#ffffff', hz, 0.1), mix('#c4d0dc', hz, 0.15), mix('#4a5a6a', hz, 0.3)]);
    L.push({ c: md, f: 0.11 });

    /* The ferry itself: its wash streaming back along the hull, the
       superstructure with its lifeboats, and the rail along the deck. */
    var nr = strip(), n = nr.getContext('2d');
    for (y = 108; y < H; y += HP) { k = Math.min(1, (y - 108) / 16); n.globalAlpha = k * 0.5; R(n, 0, y, SW, HP, mix('#5ac4dc', '#9ae6ec', k)); }
    n.globalAlpha = 1;
    [[112, 0.45, 2, 0.5], [116.5, 0.6, 3, 1.2], [121.5, 0.75, 4, 2.1], [127, 0.85, 5, 0.4]].forEach(function (q) {
      for (x = 0; x < SW; x += HP) {
        var on = Math.sin(x * TAU * q[2] + q[3]) + Math.sin(x * TAU * (q[2] * 2 + 3) + q[3] * 3) * 0.5;
        if (on < -0.2) continue;
        n.globalAlpha = q[1] * Math.min(1, (on + 0.2) * 2); R(n, x, q[0] + Math.sin(x * TAU * 9 + q[3]) * 0.8, HP, on > 0.7 ? 1 : HP, '#ffffff');
      }
    });
    n.globalAlpha = 1;
    var RL = [mix('#7ea8cc', hz, 0.3), mix('#a8cce6', hz, 0.3), mix('#d8ecf8', hz, 0.25)];
    /* Here and there the ship's white superstructure: a wall of painted steel
       rising out of sight (so it has no top edge to land on), a row of
       portholes, and a lifeboat hung on short, solid davits bolted to it. */
    var SS = [mix('#bcc8d4', hz, 0.3), mix('#eef2f4', hz, 0.28), mix('#ffffff', hz, 0.2), mix('#98a8b8', hz, 0.3)];
    var DV = [mix('#7c8a9c', hz, 0.25), mix('#c8d2dc', hz, 0.25), mix('#f4f8fa', hz, 0.2)];
    var LB = [mix('#d06a2a', hz, 0.3), mix('#f4904a', hz, 0.28), mix('#ffc890', hz, 0.24)], WC = [mix('#c4d0dc', hz, 0.3), mix('#f8fafc', hz, 0.24), '#ffffff'];
    [[250, 66], [478, 62]].forEach(function (q) {
      var x0 = q[0], w = q[1];
      R(n, x0, 0, w, 128, SS[1]); R(n, x0, 0, 1, 128, SS[2]); R(n, x0 + w - 3, 0, 3, 128, SS[0]); R(n, x0 + w - HP, 0, HP, 128, SS[3]);
      for (x = x0 + 14; x < x0 + w - 6; x += 14) R(n, x, 0, HP, 128, mix(SS[1], SS[0], 0.5));
      for (x = x0 + 5; x < x0 + w - 9; x += 8) { R(n, x, 9, 6, 5, SS[3]); R(n, x + HP, 9.5, 5, 4, mix('#5a7894', hz, 0.3)); R(n, x + HP, 9.5, 2, 1.5, mix('#c8e4f8', hz, 0.2)); }
      R(n, x0, 16, w, HP, mix(SS[1], SS[0], 0.5));
      for (x = x0 + 8; x < x0 + w - 6; x += 9) { disc(n, x + 0.3, 36.3, 2.8, SS[3]); disc(n, x, 36, 2.6, SS[2]); disc(n, x, 36, 1.8, mix('#5a7894', hz, 0.3)); R(n, x - 1, 34.5, 1, 1, mix('#c8e4f8', hz, 0.2)); }
      // the lifeboat: an orange hull with a raked bow, a white canopy, a row of windows
      var bx = x0 + 9, bw = w - 18, by = 86;
      [[bx + 4, 1], [bx + bw - 4, -1]].forEach(function (d) {
        var dx = d[0], k = d[1];
        R(n, dx - 1.5, 66, 3, 15, DV[1]); R(n, dx - 1.5, 66, 1, 15, DV[2]); R(n, dx + 1, 66, HP, 15, DV[0]);
        R(n, dx - 2.5, 79, 5, 2.5, DV[0]); R(n, dx - 2.5, 79, 5, HP, DV[1]);
        line(n, dx, 66.5, dx + k * 2, 64, 2, DV[1]); line(n, dx + k * 2, 64, dx + k * 5, 64, 2, DV[1]); R(n, dx + k * 2, 64, 3 * k, HP, DV[2]);
        R(n, dx + k * 5 - 1, 65.5, 2, 1.5, DV[0]);
        R(n, dx + k * 5 - HP / 2, 67, HP, by - 72, mix('#6a7a8a', hz, 0.3));
      });
      for (y = by; y < by + 6; y += HP) {
        var t = (y - by) / 6, l = bx + Math.pow(t, 2) * 3.5, r = bx + bw - Math.pow(t, 1.2) * 8;
        R(n, l, y, r - l, HP, LB[1]); R(n, l + (r - l) * 0.72, y, (r - l) * 0.28, HP, LB[0]);
      }
      R(n, bx, by, bw, 1, mix('#ffffff', hz, 0.2)); R(n, bx + bw - 1, by - 1, 2, 1.5, LB[1]);
      R(n, bx + 3, by - 4.5, bw - 8, 4.5, WC[1]); oval(n, bx + 3, by - 2.2, 1.6, 2.3, WC[1]); oval(n, bx + bw - 5, by - 2.2, 1.6, 2.3, WC[1]);
      R(n, bx + 3, by - 4.5, bw - 8, HP, WC[2]); R(n, bx + bw - 9, by - 4.5, 4, 4.5, WC[0]);
      R(n, bx + 6, by - 6.5, 7, 2, WC[1]); R(n, bx + 6, by - 6.5, 7, HP, WC[2]);
      for (x = bx + 5; x < bx + bw - 8; x += 3) R(n, x, by - 3, 1.5, 1, mix('#4a6a8a', hz, 0.3));
      R(n, bx + 3, by + 2, bw - 10, HP, LB[2]);
    });
    // the rail along the deck, pale and close to the sea's colour, so it never reads as a ledge
    for (x = 0; x < SW; x += 16) { R(n, x, 109, 1, 19, RL[1]); R(n, x, 109, HP, 19, RL[2]); R(n, x + 1, 110, HP, 18, RL[0]); }
    R(n, 0, 109, SW, 1, RL[1]); R(n, 0, 109, SW, HP, RL[2]); R(n, 0, 115.5, SW, HP, RL[1]); R(n, 0, 121.5, SW, HP, RL[1]);
    // and a gull resting on a davit
    var GX = 478 + 9 + 4 - 1;
    R(n, GX, 61, 3, 1.5, '#ffffff'); R(n, GX + 1, 61.5, 2, 1, mix('#c4d0dc', hz, 0.1)); R(n, GX - 0.5, 60, 1, 1.5, '#ffffff'); R(n, GX - 1, 60.5, HP, HP, '#f0a040'); R(n, GX + 1, 62.5, HP, 1, '#f0a040');
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  // a poplar: a tall slim column of leaves on a short trunk, lit down its left side. c = [shade, body, light, trunk]
  var poplar = function (g, x, ground, h, w, c) {
    R(g, x - 0.5, ground - h * 0.16, 1, h * 0.16, c[3]);
    var top = ground - h;
    for (var y = top; y < ground - h * 0.1; y += HP) {
      var k = (y - top) / (h * 0.9), hw = w / 2 * Math.pow(Math.sin(Math.PI * Math.pow(k, 0.75)), 0.65) + Math.sin(y * 1.7 + x) * 0.25;
      if (hw <= 0.1) continue;
      R(g, x - hw, y, hw * 2, HP, c[1]); R(g, x - hw, y, hw * 0.7, HP, c[2]); R(g, x + hw * 0.25, y, hw * 0.75, HP, c[0]);
    }
  };
  // a lavender bush in flower: a dome of grey-green, purple spikes over it. c = [shade, body, flower, flower light]
  var lavender = function (g, x, base, r, c) {
    oval(g, x + r * 0.1, base, r, r * 0.7, c[0], true); oval(g, x - r * 0.08, base - HP, r * 0.88, r * 0.64, c[1], true);
    for (var s = -r * 0.85; s <= r * 0.86; s += 1) { var t = base - r * 0.66 * Math.sqrt(Math.max(0, 1 - (s / r) * (s / r))); R(g, x + s, t - r * 0.4, HP, r * 0.5, s < 0 ? c[3] : c[2]); }
  };

  GEN.fields = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    // a high summer sky: the sun, and fair-weather clouds with flat grey-blue bellies
    var far = strip(), g = far.getContext('2d');
    sun(g, 92, 24, 11, ['#fff8d0', '#fff2a8', '#fffbe6']);
    for (i = 0; i < 7; i++) cloud(g, i * 73 + rnd() * 40, 12 + rnd() * 36, 0.6 + rnd() * 0.55, [mix('#b0d2f0', hz, 0.15), '#ffffff', '#ffffff']);
    for (i = 0; i < 5; i++) bird(g, 150 + rnd() * 250, 20 + rnd() * 30, mix('#4a6a8a', hz, 0.45));
    L.push({ c: far, f: 0.03 });

    /* Far hills in a patchwork: bands along the contours, cut into fields,
       each field its own crop, hedges between; a little windmill on the
       skyline (the level has its own big sails, so this one stays tiny). */
    var bk = strip(), b = bk.getContext('2d');
    var bf = function (xx) { return 90 + Math.sin(xx * TAU * 2 + 0.6) * 6 + Math.sin(xx * TAU * 5 + 1) * 2.5; };
    var PF = ['#84c060', '#a4d070', '#ecd070', '#ae9ee6', '#c4da78', '#6aac52', '#e6c060'].map(function (c) { return mix(c, hz, 0.42); });
    var hedge = mix('#3e7e44', hz, 0.42), BD = [0, 4, 9, 15.5, 23.5, 33, 45, 60], NB = [22, 17, 13, 10, 8, 6, 4], tbl = [];
    for (j = 0; j < NB.length; j++) { tbl.push([]); for (i = 0; i < NB[j]; i++) tbl[j].push(PF[Math.floor(rnd() * PF.length)]); }
    for (x = 0; x < SW; x += 1) {
      var t0 = bf(x);
      for (j = 0; j < NB.length; j++) {
        var y0 = t0 + BD[j] + (j ? Math.sin(x * TAU * 3 + j) * 0.8 : 0), y1 = t0 + BD[j + 1] + Math.sin(x * TAU * 3 + j + 1) * 0.8;
        if (y0 > H) break;
        var cw = SW / NB[j], u = (x + j * 37) % SW, ci = Math.floor(u / cw);
        R(b, x, y0, 1, y1 - y0, tbl[j][ci]);
        if (j) R(b, x, y0, 1, HP, hedge);
        if (Math.floor(((u - 1) + SW) % SW / cw) !== ci) R(b, x, y0, HP, y1 - y0, hedge);
      }
      R(b, x, t0, 1, HP, mix('#d8f0a8', hz, 0.35));
    }
    for (i = 0; i < 30; i++) { x = rnd() * SW; j = 1 + Math.floor(rnd() * 4); ball(b, x, bf(x) + BD[j] + Math.sin(x * TAU * 3 + j) * 0.8, 0.9 + rnd() * 0.8, [hedge, mix('#5a9a50', hz, 0.48), mix('#9ad078', hz, 0.42)]); }
    windmill(b, 214, bf(214) + 0.5, 0.48, [mix('#fff8ec', hz, 0.42), mix('#d8d4e0', hz, 0.45), mix('#a86a5a', hz, 0.45), mix('#fffaf0', hz, 0.4)], 0.35);
    // a hamlet and its church on the far rise
    for (i = 0; i < 5; i++) { x = 330 + i * 4.5 + rnd() * 2; y = bf(x) + 2; R(b, x, y - 3, 3.5, 3.5, mix('#fff2dc', hz, 0.45)); R(b, x - HP, y - 4, 4.5, 1, mix('#d86a4a', hz, 0.45)); }
    R(b, 352, bf(352) - 6, 2, 7, mix('#fff2dc', hz, 0.45)); span(b, bf(352) - 10, bf(352) - 6, function (yy) { return 352 + 1 - (yy - bf(352) + 10) / 4 * 1.2; }, function (yy) { return 353 + (yy - bf(352) + 10) / 4 * 1.2; }, mix('#7a6a8a', hz, 0.45));
    mist(b, 82, 24, hz);
    L.push({ c: bk, f: 0.06 });

    /* Nearer fields: lavender combed into rows along the hill, a wheat field
       round a farmhouse with a red roof, a field of sunflowers all facing the
       sun, poplars standing in lines between them. */
    var md = strip(), m = md.getContext('2d');
    var mf = function (xx) { return 104 + Math.sin(xx * TAU * 2 + 2.2) * 6 + Math.sin(xx * TAU * 3 + 0.4) * 3; };
    var hm = function (c) { return mix(c, hz, 0.3); };
    land(m, mf, [hm('#5a9a40'), hm('#80bc54'), hm('#c4ea8c')], 6);
    var row = function (n) { return 2 + n * 2 + n * n * 0.2; };
    var LV = [hm('#5e4ca0'), hm('#8a6cc8'), hm('#a88ade')], LG = hm('#7a9a5c');
    for (x = 14; x < 178; x += 1) {
      var t = mf(x);
      R(m, x, t, 1, H - t, LG);
      for (j = 0; t + row(j) < H; j++) { var r0 = row(j), hh = (row(j + 1) - r0) * 0.6; R(m, x, t + r0, 1, hh, LV[1]); R(m, x, t + r0, 1, HP, LV[2]); R(m, x, t + r0 + hh - HP, 1, HP, LV[0]); }
    }
    var WH = [hm('#d8a840'), hm('#f0cc60'), hm('#fff0a8')];
    for (x = 182; x < 258; x += 1) { t = mf(x); R(m, x, t, 1, H - t, WH[1]); R(m, x, t, 1, HP, WH[2]); for (j = 1; t + row(j) * 1.3 < H; j++) { R(m, x, t + row(j) * 1.3, 1, HP, WH[2]); R(m, x, t + row(j) * 1.3 + 1, 1, HP, WH[0]); } }
    var SF = [hm('#5a8a2a'), hm('#e8b820'), hm('#ffe050'), hm('#7a4a1a')];
    for (x = 262; x < 402; x += HP) { t = mf(x); R(m, x, t, HP, H - t, SF[0]); R(m, x, t, HP, 1.5, SF[1]); }
    for (j = 0; j < 12; j++) for (x = 263 + rnd() * 2; x < 400; x += 1.6 + j * 0.35 + rnd() * 0.8) {
      y = mf(x) + 1 + row(j) * 0.9; var fr = 0.55 + j * 0.09;
      if (y > H) continue;
      disc(m, x, y, fr, SF[1]); disc(m, x - fr * 0.25, y - fr * 0.25, fr * 0.55, SF[2]); if (fr > 0.9) R(m, x - HP, y - HP, 1, 1, SF[3]);
    }
    // hedges where the fields meet, and poplars in lines along them
    [14, 180, 260, 404].forEach(function (hx) { for (y = mf(hx) - 1; y < H; y += HP) R(m, hx - 1 + Math.sin(y * 0.9) * 0.5, y, 2, HP, hm('#4a8a3a')); });
    var PP = [hm('#3e7a3a'), hm('#5aa048'), hm('#9ad070'), hm('#6a5038')];
    for (i = 0; i < 4; i++) poplar(m, 172 + i * 5 + rnd() * 2, mf(172 + i * 5) + 1, 22 + rnd() * 6, 3.6, PP);
    for (i = 0; i < 6; i++) poplar(m, 412 + i * 7 + rnd() * 3, mf(412 + i * 7) + 1, 20 + rnd() * 8, 3.4, PP);
    // the farmhouse: cream stone, a red roof, blue shutters, and its barn
    var FX = 206, FY = mf(212) + 2, FW = [hm('#e0cca8'), hm('#f8ecd4'), hm('#fffaf0')], FR = [hm('#a8402e'), hm('#d4583c'), hm('#f08a62')];
    R(m, FX + 17, FY - 6, 11, 6, FW[1]); R(m, FX + 26, FY - 6, 2, 6, FW[0]); R(m, FX + 21, FY - 4, 3, 4, hm('#8a5a3a'));
    R(m, FX + 16.5, FY - 8, 12, 2, FR[1]); R(m, FX + 16.5, FY - 8, 12, HP, FR[2]);
    R(m, FX, FY - 11, 17, 11, FW[1]); R(m, FX + 15, FY - 11, 2, 11, FW[0]); R(m, FX, FY - 11, HP, 11, FW[2]);
    span(m, FY - 15, FY - 10.5, function (yy) { return FX - 1 + (FY - 10.5 - yy) * 0.6; }, function (yy) { return FX + 18 - (FY - 10.5 - yy) * 0.6; }, FR[1]);
    R(m, FX - 1, FY - 11, 19, 1, FR[0]); R(m, FX + 1.5, FY - 15, 14, HP, FR[2]);
    [[FX + 3, FY - 8], [FX + 11, FY - 8], [FX + 3, FY - 4]].forEach(function (q) { R(m, q[0] - 1, q[1], 1, 2.5, hm('#4a7ac8')); R(m, q[0], q[1], 2, 2.5, hm('#4a4a5a')); R(m, q[0] + 2, q[1], 1, 2.5, hm('#4a7ac8')); });
    R(m, FX + 10, FY - 4, 2.5, 4, hm('#7a5236'));
    tree(m, FX - 6, FY + 1, 16, rnd, [hm('#3e7a3a'), hm('#5aa048'), hm('#9ad070')], [hm('#6a5038'), hm('#8a6a48')]);
    mist(m, 100, 18, hz);
    L.push({ c: md, f: 0.13 });

    // in front: a bank of lavender in two rows, poppies in the grass, and two stands of poplars
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 117 + Math.sin(xx * TAU * 2 + 1) * 3 + Math.sin(xx * TAU * 5) * 1.5; };
    land(n, nf, ['#4a8a34', '#6aac44', '#a8dc6a'], 7);
    var NP = ['#2e6a34', '#4a9040', '#86c862', '#5a4028'];
    [[118, 3], [384, 4]].forEach(function (q) { for (j = 0; j < q[1]; j++) { x = q[0] + j * 6 + rnd() * 2; poplar(n, x, nf(x) + 2, 46 + rnd() * 16, 4.6 + rnd(), NP); } });
    for (x = 4; x < SW; x += 8) lavender(n, x + Math.sin(x) * 0.5, nf(x) + 3, 3.4, ['#5c4a98', '#7a68b4', '#9a7ad8', '#c8aef6']);
    for (i = 0; i < 26; i++) { x = rnd() * SW; y = nf(x) + 1 + rnd() * 4; R(n, x + 0.25, y, HP, 1.5, '#4a8a34'); disc(n, x, y - 0.4, 0.8, '#e83a3a'); R(n, x - HP, y - 0.9, HP, HP, '#ff8a7a'); }
    for (x = 0; x < SW; x += 8) lavender(n, x, nf(x + 4) + 10, 4.4, ['#5c4a98', '#7a68b4', '#9a7ad8', '#c8aef6']);
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  GEN.village = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y;
    var far = strip(), g = far.getContext('2d');
    sun(g, 300, 22, 10, ['#fff8d0', '#fff2a8', '#fffbe6']);
    for (i = 0; i < 5; i++) cloud(g, i * 102 + rnd() * 50, 12 + rnd() * 30, 0.55 + rnd() * 0.4, [mix('#b8d8f4', hz, 0.15), '#ffffff', '#ffffff']);
    for (i = 0; i < 7; i++) bird(g, rnd() * SW, 30 + rnd() * 30, mix('#3a4a6a', hz, 0.35));
    L.push({ c: far, f: 0.03 });

    /* The hill behind the village: vines in rows, dark cypresses, the old
       houses climbing it, and the church with its spire on the top. */
    var bk = strip(), b = bk.getContext('2d');
    var hb = function (c) { return mix(c, hz, 0.45); };
    var bf = function (xx) { return 80 + Math.sin(xx * TAU + 0.6) * 9 + Math.sin(xx * TAU * 3 + 2) * 3; };
    land(b, bf, [hb('#7a9a5a'), hb('#9cbc6c'), hb('#d4ec9c')], 12);
    for (j = 0; j < 9; j++) for (x = 0; x < SW; x += 1.5) { y = bf(x) + 4 + j * (3.5 + j * 0.4) + Math.sin(x * TAU * 2 + j) * 0.6; R(b, x, y, 1, HP, hb('#6a8a48')); }
    var cyp = function (cx2, gy, h) { span(b, gy - h, gy, function (yy) { return cx2 - 1.3 * Math.sin(Math.PI * Math.pow((yy - gy + h) / h, 0.7)); }, function (yy) { return cx2 + 1.3 * Math.sin(Math.PI * Math.pow((yy - gy + h) / h, 0.7)); }, hb('#3a6a3a')); R(b, cx2 - 1, gy - h * 0.7, 0.6, h * 0.5, hb('#6a9a5a')); };
    for (i = 0; i < 14; i++) { x = rnd() * SW; cyp(x, bf(x) + 3 + rnd() * 8, 8 + rnd() * 6); }
    var BW = [hb('#e8d8b8'), hb('#f8ecd4'), hb('#fffaf0')], BR = hb('#d27a4a');
    for (i = 0; i < 16; i++) { x = 156 + i * 5.5 + rnd() * 3; y = bf(x) + 3 + (i % 3) * 3; var bw = 4 + Math.floor(rnd() * 2); R(b, x, y - 4, bw, 5, BW[1]); R(b, x + bw - 1, y - 4, 1, 5, BW[0]); R(b, x - HP, y - 5, bw + 1, 1, BR); R(b, x + 1, y - 2.5, 1, 1.5, hb('#5a7ab8')); }
    // the church: nave, a square bell tower with its clock, and the slate spire
    var CX = 204, CY = bf(CX) + 3;
    R(b, CX - 14, CY - 9, 16, 9, BW[1]); span(b, CY - 13, CY - 9, function (yy) { return CX - 14 + (CY - 9 - yy) * 1.2; }, function (yy) { return CX + 2 - (CY - 9 - yy) * 1.2; }, BR);
    R(b, CX, CY - 24, 6, 24, BW[1]); R(b, CX + 4.5, CY - 24, 1.5, 24, BW[0]); R(b, CX, CY - 24, HP, 24, BW[2]);
    R(b, CX + 1.5, CY - 20, 3, 4, hb('#5a5a6a')); disc(b, CX + 3, CY - 13, 1.4, BW[2]); R(b, CX + 3, CY - 14, HP, 1, hb('#3a3a4a'));
    span(b, CY - 38, CY - 24, function (yy) { return CX + 3 - 3.5 * (yy - CY + 38) / 14; }, function (yy) { return CX + 3 + 3.5 * (yy - CY + 38) / 14; }, hb('#6a7490'));
    span(b, CY - 38, CY - 24, function (yy) { return CX + 3 - 3.5 * (yy - CY + 38) / 14; }, function (yy) { return CX + 3 - 1.5 * (yy - CY + 38) / 14; }, hb('#9aa4c0'));
    R(b, CX + 2.5, CY - 41, 1, 3, hb('#c8a050')); R(b, CX + 1.5, CY - 40, 3, HP, hb('#c8a050'));
    mist(b, 76, 30, hz);
    L.push({ c: bk, f: 0.07 });

    /* The square: tall old houses shoulder to shoulder, cream stone under
       terracotta, shutters in blue and green and lavender, geraniums in the
       window boxes, plane trees in front, and the market at their feet. */
    var md = strip(), m = md.getContext('2d');
    var hm = function (c) { return mix(c, hz, 0.24); };
    var WALL = ['#f4e4c4', '#f0d8b8', '#f8ead0', '#ecd0a8', '#f6dcae', '#fbeedc'], SHUT = ['#4a7ac8', '#3e9a78', '#7a7ec8', '#3a98a8', '#5a9a5a'], ROOF = ['#c8683a', '#b85432', '#d6804a'];
    var BASE = 124, hx = 0;
    var house = function (x0, w, h) {
      var top = BASE - h, wall = hm(WALL[Math.floor(rnd() * WALL.length)]), sh = hm(SHUT[Math.floor(rnd() * SHUT.length)]), roof = hm(ROOF[Math.floor(rnd() * ROOF.length)]);
      var dk = mix(wall, '#8a5a48', 0.24), lt = mix(wall, '#ffffff', 0.45), glass = hm('#4a4e6a');
      R(m, x0, top, w, h, wall); R(m, x0 + w - 1.5, top, 1.5, h, dk); R(m, x0, top, HP, h, lt);
      // the roof, seen from the street: a band of round tiles, the génoise eave beneath
      R(m, x0 - 1, top - 4, w + 2, 4, roof); R(m, x0 - 1, top - 4, w + 2, HP, mix(roof, '#ffffff', 0.3));
      for (var tx = x0 - 0.5; tx < x0 + w + 1; tx += 1.5) R(m, tx, top - 3.5, HP, 3.5, mix(roof, '#6a2a1a', 0.25));
      R(m, x0, top, w, 1, mix(roof, '#4a2a1a', 0.3)); for (tx = x0 + 0.5; tx < x0 + w; tx += 1.5) R(m, tx, top + 1, 1, HP, dk);
      // windows with their shutters thrown open, and the odd window box of geraniums
      for (var wy = top + 5; wy < BASE - 12; wy += 11) for (var wx = x0 + 5; wx + 7 < x0 + w; wx += 10) {
        R(m, wx - 2.2, wy, 2, 5.5, sh); R(m, wx + 3.2, wy, 2, 5.5, mix(sh, '#1a2a4a', 0.15));
        for (var sy = wy + 1; sy < wy + 5.5; sy += 1.5) { R(m, wx - 2.2, sy, 2, HP, mix(sh, '#1a2a4a', 0.25)); R(m, wx + 3.2, sy, 2, HP, mix(sh, '#1a2a4a', 0.35)); }
        R(m, wx, wy, 3, 5.5, glass); R(m, wx, wy, 1, 2, hm('#c8e0f8')); R(m, wx - 0.5, wy - 0.5, 4, HP, lt); R(m, wx - 0.5, wy + 5.5, 4, HP, dk);
        if (rnd() > 0.45) { R(m, wx - 0.5, wy + 5, 4, 1.2, hm('#b0603a')); for (var fx = wx - 0.5; fx < wx + 3.5; fx += 1) { R(m, fx, wy + 4.3, 1, 1, rnd() > 0.5 ? hm('#e8384a') : hm('#ff7aa0')); R(m, fx + HP, wy + 4.8, HP, HP, hm('#4a9a40')); } }
      }
      // a door on the street, under a little arch
      if (w > 30 && rnd() > 0.3) { var dx = x0 + w - 11; R(m, dx, BASE - 9, 5, 9, mix(sh, '#2a1a1a', 0.3)); disc(m, dx + 2.5, BASE - 9, 2.5, mix(sh, '#2a1a1a', 0.3)); R(m, dx + 0.5, BASE - 8, HP, 7, mix(sh, '#ffffff', 0.2)); }
    };
    while (hx < SW) {
      var hw = 28 + Math.floor(rnd() * 3) * 6, hh = 36 + Math.floor(rnd() * 4) * 5;
      if (SW - hx - hw < 24) hw = SW - hx;
      house(hx, hw, hh); hx += hw;
    }
    // plane trees: pale mottled trunks, broad crowns
    var PT = [hm('#4a8a3a'), hm('#6aaa4a'), hm('#a8d878'), hm('#d8f0a8')];
    [52, 182, 318, 446].forEach(function (tx2) {
      x = tx2 + rnd() * 12;
      for (y = 78; y < BASE; y += HP) { R(m, x - 1.5, y, 3, HP, hm('#c8c0a0')); if (Math.sin(y * 0.7 + x) > 0.4) R(m, x - 1.5 + Math.sin(y) * 0.5, y, 1.5, HP, hm('#8a8a6a')); if (Math.sin(y * 0.5 + x * 2) > 0.6) R(m, x, y, 1.5, HP, hm('#ece4c8')); }
      line(m, x, 86, x - 7, 78, 1, hm('#b8b090')); line(m, x, 84, x + 8, 76, 1, hm('#b8b090'));
      canopy(m, x, 70, 18, 11, rnd, PT);
    });
    // the market: stalls under stripy awnings, heaped with fruit and vegetables
    var AW = [['#e8404a', '#fff8f0'], ['#3a7ad0', '#fff8f0'], ['#3aa070', '#fffae8'], ['#f0a030', '#fff8e8']];
    [[18, 26], [118, 30], [236, 24], [352, 30], [462, 26]].forEach(function (q, qi) {
      var sx = q[0] + rnd() * 6, sw = q[1], ac = AW[qi % AW.length];
      R(m, sx + 1, 109, 1, 15, hm('#7a5a3a')); R(m, sx + sw - 2, 109, 1, 15, hm('#7a5a3a'));
      R(m, sx, 117, sw, 2, hm('#a87a4a')); R(m, sx, 117, sw, HP, hm('#d8a870')); R(m, sx + 1, 119, sw - 2, 5, hm('#8a6038'));
      for (x = sx + 1.5; x < sx + sw - 1.5; x += 1.4) { var pc = [hm('#e83a3a'), hm('#ffd040'), hm('#7ac040'), hm('#a050b0'), hm('#ff9030')][Math.floor((x - sx) / 5) % 5]; disc(m, x, 116.2 - Math.sin((x - sx) / sw * Math.PI) * 1.2, 0.8, pc); }
      awning(m, sx - 1, 106, sw + 2, 3.5, [hm(ac[0]), hm(ac[1]), hm('#6a4a3a')], 2);
    });
    mist(m, 112, 14, hz);
    L.push({ c: md, f: 0.15 });

    // in front: plane-tree leaves overhead, and blue, white and red bunting strung between them
    var nr = strip(), n = nr.getContext('2d');
    [72, 328].forEach(function (cx2) { canopy(n, cx2, -6, 30, 12, rnd, ['#3e7a34', '#5a9a40', '#8cc85e', '#c8ec90']); });
    var BT = ['#3a6ad8', '#ffffff', '#e8404a'];
    [[96, 200, 11], [200, 304, 13], [352, 456, 11], [456, 560, 13]].forEach(function (q) { bunting(n, q[0], 6, q[1], 7, q[2], BT, 3.4, '#9a8a7a'); });
    L.push({ c: nr, f: 0.32 });
    return L;
  };

  GEN.bakery = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    /* The back wall: warm plaster above, glazed tiles below a painted band,
       a clock, a chalkboard with bread drawn on it, copper pans, and the big
       shop window onto the sunny street outside. */
    var far = strip(), g = far.getContext('2d');
    var TY = 88;
    g.globalAlpha = 0.07; for (i = 0; i < 46; i++) disc(g, rnd() * SW, rnd() * TY, 3 + rnd() * 9, '#d89a64'); g.globalAlpha = 1;
    R(g, 0, TY + 3, SW, H - TY - 3, '#e6cfa8');
    for (y = TY + 3, j = 0; y < H; y += 3, j++) { R(g, 0, y, SW, 2.5, '#fff4e2'); R(g, 0, y, SW, HP, '#ffffff'); R(g, 0, y + 2, SW, HP, '#f2dcbc'); for (x = j % 2 ? 0 : 4; x < SW; x += 8) R(g, x, y, HP, 3, '#e6cfa8'); }
    R(g, 0, TY, SW, 3, '#c8643c'); R(g, 0, TY, SW, HP, '#e88a5a'); R(g, 0, TY + 2.5, SW, HP, '#8a3a22');
    for (x = 2; x < SW; x += 4) { R(g, x, TY + 1, 1, 1, '#ffe2b0'); }
    // the window onto the street
    var WX = 140, WY = 18, WW = 80, WH = 66;
    for (y = WY; y < WY + WH; y += HP) R(g, WX, y, WW, HP, mix('#7cc4ff', '#d8f0ff', Math.min(1, (y - WY) / 40)));
    R(g, WX + 6, WY + 14, 52, WH - 14, '#fbe8c8'); R(g, WX + 54, WY + 14, 4, WH - 14, '#e0c49c'); R(g, WX + 4, WY + 12, 56, 2.5, '#d06a44'); R(g, WX + 4, WY + 12, 56, HP, '#f08a62');
    [[WX + 12, WY + 22], [WX + 34, WY + 22]].forEach(function (q) { R(g, q[0] - 2.5, q[1], 2.5, 8, '#4a7ac8'); R(g, q[0], q[1], 5, 8, '#5a6a8a'); R(g, q[0], q[1], 2, 3, '#c8e4ff'); R(g, q[0] + 5, q[1], 2.5, 8, '#4a7ac8'); R(g, q[0] - 0.5, q[1] + 8, 6, 1.5, '#b0603a'); for (var fx = 0; fx < 6; fx += 1) R(g, q[0] - 0.5 + fx, q[1] + 7.2, 1, 1, fx % 2 ? '#ff6a8a' : '#e83a3a'); });
    awning(g, WX + 8, WY + 40, 46, 5, ['#e8404a', '#fff8f0', '#8a5a4a'], 2.5);
    R(g, WX + 14, WY + 50, 8, WH - 50, '#6a4a3a'); R(g, WX + 30, WY + 50, 18, 9, '#a8d0f0'); R(g, WX + 30, WY + 50, 18, HP, '#ffffff');
    canopy(g, WX + 68, WY + 30, 10, 12, rnd, ['#4a9a40', '#6ab84a', '#a8e078', '#e0ffb0']); R(g, WX + 67, WY + 40, 2, WH - 40, '#8a6a4a');
    R(g, WX, WY + WH - 6, WW, 6, '#c8bcae'); for (x = WX; x < WX + WW; x += 3) R(g, x + (Math.floor((x - WX) / 3) % 2) * 0.5, WY + WH - 4.5, 2, 1.5, '#ded4c6');
    g.globalAlpha = 0.22; for (i = 0; i < 3; i++) for (k = 0; k < 30; k += HP) R(g, WX + 8 + i * 26 + k * 0.6, WY + 4 + k, 3 - i * 0.5, HP, '#ffffff'); g.globalAlpha = 1;
    var FR = ['#1e3e4a', '#2e5a6a', '#4a8090'];
    R(g, WX - 3, WY - 3, WW + 6, 3, FR[1]); R(g, WX - 3, WY + WH, WW + 6, 3, FR[1]); R(g, WX - 3, WY, 3, WH, FR[1]); R(g, WX + WW, WY, 3, WH, FR[1]);
    R(g, WX - 3, WY - 3, WW + 6, HP, FR[2]); R(g, WX - 3, WY - 3, HP, WH + 6, FR[2]); R(g, WX + WW + 3 - HP, WY - 3, HP, WH + 6, FR[0]);
    R(g, WX, WY + 16, WW, 2, FR[1]); R(g, WX, WY + 16, WW, HP, FR[2]); R(g, WX + WW / 2 - 1, WY + 18, 2, WH - 18, FR[1]); R(g, WX + WW / 3 - 0.5, WY, 1, 16, FR[1]); R(g, WX + WW * 2 / 3 - 0.5, WY, 1, 16, FR[1]);
    R(g, WX - 5, WY + WH + 3, WW + 10, 2.5, '#a8784a'); R(g, WX - 5, WY + WH + 3, WW + 10, HP, '#d8a870');
    // the clock: ten past ten, so it is smiling
    var CX = 240, CY = 36;
    disc(g, CX + 0.6, CY + 0.6, 9, '#8a5a34'); disc(g, CX, CY, 9, '#b8824c'); disc(g, CX, CY, 7.4, '#fff8ea'); disc(g, CX - 2, CY - 2, 3, '#ffffff');
    for (i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; R(g, CX + Math.cos(a) * 6 - 0.25, CY + Math.sin(a) * 6 - 0.25, HP, HP, '#6a4a34'); }
    line(g, CX, CY, CX - 3, CY - 2, HP, '#3a2a1e'); line(g, CX, CY, CX + 4.4, CY - 3, HP, '#3a2a1e'); disc(g, CX, CY, 0.8, '#b8824c');
    // the chalkboard, with a croissant, a baguette and a round loaf drawn on it
    var BX = 384, BY = 28;
    R(g, BX - 2, BY - 2, 52, 36, '#9a6a3e'); R(g, BX - 2, BY - 2, 52, HP, '#c8945e'); R(g, BX, BY, 48, 32, '#2e3c36');
    g.globalAlpha = 0.85;
    for (a = 0.3; a < 2.85; a += 0.12) { var px = BX + 12 + Math.cos(a) * 7, py = BY + 16 - Math.sin(a) * 5; R(g, px, py, HP, HP, '#f0f0e4'); if (Math.round(a * 10) % 6 === 0) line(g, px, py, BX + 12 + Math.cos(a) * 4, BY + 16 - Math.sin(a) * 2.5, HP, '#f0f0e4'); }
    line(g, BX + 5, BY + 16, BX + 19, BY + 16, HP, '#f0f0e4');
    for (x = BX + 26; x < BX + 44; x += HP) { R(g, x, BY + 12 - Math.sin((x - BX - 26) / 18 * Math.PI) * 1.6, HP, HP, '#f0f0e4'); R(g, x, BY + 13 + Math.sin((x - BX - 26) / 18 * Math.PI) * 1.6, HP, HP, '#f0f0e4'); }
    for (x = BX + 29; x < BX + 42; x += 3) line(g, x, BY + 13.5, x + 1.5, BY + 11.5, HP, '#f0f0e4');
    ring(g, BX + 35, BY + 24, 3.6, 4.1, '#f0f0e4'); line(g, BX + 33, BY + 25, BX + 37, BY + 22.5, HP, '#f0f0e4');
    for (i = 0; i < 4; i++) R(g, BX + 6 + i * 3, BY + 26 + (i % 2) * 0.5, 2, HP, '#e8e4d8');
    g.globalAlpha = 1;
    // copper pans on their rail
    R(g, 446, 30, 52, 1, '#7a5a3a'); R(g, 446, 30, 52, HP, '#a8885a');
    [[456, 6], [474, 5], [490, 4.5]].forEach(function (q) { R(g, q[0] - HP / 2, 31, HP, 3, '#5a4a3a'); R(g, q[0] - 0.75, 33, 1.5, 6, '#a85a30'); disc(g, q[0] + 0.4, 39 + q[1], q[1], '#9a4a24'); disc(g, q[0], 39 + q[1] - 0.4, q[1] - 0.6, '#d47a40'); disc(g, q[0] - q[1] * 0.35, 39 + q[1] * 0.6, q[1] * 0.35, '#ffb478'); });
    // a room is shallow: the wall and what stands against it move almost together
    L.push({ c: far, f: 0.08 });

    /* The bread oven, its brick mouth glowing with the fire inside, the
       shelves of loaves and croissants, baskets of baguettes, flour sacks. */
    var md = strip(), m = md.getContext('2d');
    var BRK = ['#a8503a', '#bc6448', '#cc7656'], MOR = '#e4c4a0';
    var OX = 20, OW = 92, OT = 46, MX = OX + OW / 2, MY = 106, MR = 18;
    R(m, MX - 15, 0, 30, OT - 6, MOR);
    for (y = 0; y < OT - 6; y += 3) for (x = MX - 15 + ((y / 3) % 2 ? 0 : 3.5); x < MX + 15; x += 7) R(m, x + HP, y + HP, Math.min(7, MX + 15 - x) - HP, 2.5, BRK[(Math.floor(x * 7 + y * 3)) % 3]);
    R(m, MX + 11, 0, 4, OT - 6, 'rgba(90,30,20,0.25)');
    span(m, OT - 6, OT, function (yy) { return MX - 15 - (yy - OT + 6) * 5.5; }, function (yy) { return MX + 15 + (yy - OT + 6) * 5.5; }, '#8a4030');
    R(m, OX - 2, OT - HP, OW + 4, 2, '#d8b890'); R(m, OX - 2, OT - HP, OW + 4, HP, '#fff0d0');
    R(m, OX, OT + 1.5, OW, 128 - OT - 1.5, MOR);
    for (y = OT + 1.5, j = 0; y < 128; y += 3, j++) for (x = OX + (j % 2 ? 0 : 3.5); x < OX + OW; x += 7) { var bw2 = Math.min(7, OX + OW - x) - HP; R(m, x + HP, y + HP, bw2, 2.5, BRK[(j * 5 + Math.floor(x / 7)) % 3]); R(m, x + HP, y + HP, bw2, HP, '#dc8a6a'); }
    R(m, OX + OW - 3, OT + 1.5, 3, 128 - OT, 'rgba(90,30,20,0.18)');
    // the mouth: an arch of bricks set on end, and the fire inside
    ring(m, MX, MY, MR, MR + 4, '#8a3a28', MY);
    for (a = 0; a <= Math.PI; a += Math.PI / 9) line(m, MX + Math.cos(a) * MR, MY - Math.sin(a) * MR, MX + Math.cos(a) * (MR + 4), MY - Math.sin(a) * (MR + 4), HP, MOR);
    R(m, MX - MR - 4, MY, 4, 128 - MY, '#8a3a28'); R(m, MX + MR, MY, 4, 128 - MY, '#8a3a28');
    for (y = MY - MR; y < 120; y += HP) { var hw = y < MY ? Math.sqrt(MR * MR - (MY - y) * (MY - y)) : MR; R(m, MX - hw, y, hw * 2, HP, mix('#3a1408', '#c84a18', Math.max(0, (y - MY + MR) / (MR + 14)))); }
    glow(m, MX, 116, 20, '#ffc060', 1);
    for (i = 0; i < 26; i++) { x = MX - 14 + rnd() * 28; R(m, x, 117 + rnd() * 2.5, 1 + rnd(), 1, rnd() > 0.5 ? '#ffe070' : '#ff8a30'); }
    [[MX - 8, 4], [MX + 2, 5], [MX + 11, 3.6]].forEach(function (q) { oval(m, q[0], 116.5, q[1], q[1] * 0.7, '#7a3418', true); oval(m, q[0] - 0.4, 116.2, q[1] * 0.85, q[1] * 0.6, '#c8642a', true); oval(m, q[0] - q[1] * 0.35, 116.5 - q[1] * 0.45, q[1] * 0.3, q[1] * 0.14, '#ffc070'); });
    R(m, MX - MR - 5, 120, MR * 2 + 10, 3, '#d8bc98'); R(m, MX - MR - 5, 120, MR * 2 + 10, HP, '#fff0d8'); R(m, MX - MR - 5, 122.5, MR * 2 + 10, HP, '#a88a68');
    glow(m, MX, MY, 40, '#ffb050', 0.9);
    // the baker's peel, leaning on the oven
    line(m, 118, 127, 106, 70, 1, '#a8784a'); line(m, 117.5, 127, 105.5, 70, HP, '#d8a870'); oval(m, 105, 64, 3.2, 6.5, '#c8945e'); oval(m, 104.4, 63.4, 2, 5, '#e8b880');
    // bread: round boules, long baguettes, croissants, tall loaves
    var CR = ['#9a5424', '#c8803c', '#eaae64', '#fff0c0'];
    var boule = function (bx, by, r) { oval(m, bx + 0.3, by, r, r * 0.72, CR[0], true); oval(m, bx - 0.2, by - 0.2, r * 0.9, r * 0.66, CR[1], true); oval(m, bx - r * 0.3, by - r * 0.4, r * 0.4, r * 0.18, CR[2]); line(m, bx - r * 0.3, by - r * 0.5, bx + r * 0.25, by - r * 0.25, HP, CR[3]); };
    var baguette = function (bx, by, len) { oval(m, bx + len / 2, by - 1.3, len / 2, 1.4, CR[0]); oval(m, bx + len / 2 - 0.2, by - 1.5, len / 2 - 0.4, 1.1, CR[1]); for (var sx = bx + 2; sx < bx + len - 2; sx += 2.5) R(m, sx, by - 2, 1.2, HP, CR[3]); };
    var croissant = function (bx, by) { for (var t = -1; t <= 1.01; t += 0.2) { var r = 1.9 - Math.abs(t) * 0.95; disc(m, bx + t * 4 + 0.3, by - 1.6 - (1 - Math.abs(t)) * 1.1 + 0.3, r, CR[0]); } for (t = -1; t <= 1.01; t += 0.2) { r = 1.9 - Math.abs(t) * 0.95; disc(m, bx + t * 4, by - 1.6 - (1 - Math.abs(t)) * 1.1, r * 0.9, Math.round(t * 5) % 2 ? CR[1] : CR[2]); } R(m, bx - 1.5, by - 3.6, 2.5, HP, CR[3]); };
    var tin = function (bx, by) { R(m, bx, by - 5, 7, 5, CR[1]); oval(m, bx + 3.5, by - 5, 3.5, 2, CR[2], true); R(m, bx + 5.5, by - 5, 1.5, 5, CR[0]); R(m, bx + 1.5, by - 6, 3, HP, CR[3]); };
    var shelfUnit = function (x0, x1, rows, kinds) {
      R(m, x0, 30, 2.5, 98, '#6a4426'); R(m, x0, 30, HP, 98, '#a8784a'); R(m, x1, 30, 2.5, 98, '#6a4426'); R(m, x1, 30, HP, 98, '#a8784a');
      rows.forEach(function (sy, ri) {
        R(m, x0, sy, x1 - x0 + 2.5, 2, '#8a5a34'); R(m, x0, sy, x1 - x0 + 2.5, HP, '#c8945e'); m.globalAlpha = 0.25; R(m, x0 + 2.5, sy + 2, x1 - x0 - 2.5, 2, '#6a3a1a'); m.globalAlpha = 1;
        var kind = kinds[ri % kinds.length];
        for (var bx = x0 + 4; bx < x1 - 6;) {
          if (kind === 'boule') { var br = 4 + rnd() * 1.6; if (bx + br * 2 > x1 - 3) break; boule(bx + br, sy, br); bx += br * 2 + 1.5; }
          else if (kind === 'baguette') { if (bx + 22 > x1 - 2) break; for (var s = 0; s < 3; s++) baguette(bx, sy - s * 2.6, 22); bx += 25; }
          else if (kind === 'croissant') { if (bx + 12 > x1 - 2) break; croissant(bx + 5, sy); bx += 11; }
          else { if (bx + 8 > x1 - 2) break; tin(bx, sy); bx += 9; }
        }
      });
    };
    shelfUnit(256, 376, [48, 72, 96], ['croissant', 'boule', 'baguette']);
    shelfUnit(436, 506, [48, 72, 96], ['tin', 'boule', 'croissant']);
    // baskets of baguettes standing on the floor
    [[226, 9], [452, 10]].forEach(function (q) {
      for (i = 0; i < q[1]; i++) { var bx2 = q[0] + 2 + i * 2.2, lean = (i - q[1] / 2) * 0.12; line(m, bx2, 120, bx2 + lean * 14, 104 - (i % 3) * 2, 1.6, CR[1]); line(m, bx2 - 0.4, 120, bx2 - 0.4 + lean * 14, 104.5 - (i % 3) * 2, HP, CR[2]); }
      R(m, q[0], 116, q[1] * 2.2 + 4, 12, '#b88a50'); for (y = 116.5; y < 128; y += 2) for (x = q[0] + ((y - 116.5) % 4 ? 0 : 1.5); x < q[0] + q[1] * 2.2 + 4; x += 3) R(m, x, y, 2, 1, '#d8ac68');
      R(m, q[0] - 0.5, 115.5, q[1] * 2.2 + 5, 1.5, '#8a5a30');
    });
    // flour sacks, tied at the neck, with a sheaf of wheat on each
    var sack = function (sx, base, w, h) {
      span(m, base - h, base, function (yy) { var k = (yy - base + h) / h; return sx + (k < 0.2 ? w * 0.3 * (1 - k / 0.2) : 0) - Math.sin(k * Math.PI) * 1.2; }, function (yy) { var k = (yy - base + h) / h; return sx + w - (k < 0.2 ? w * 0.3 * (1 - k / 0.2) : 0) + Math.sin(k * Math.PI) * 1.2; }, '#f4ead4');
      span(m, base - h * 0.8, base, function (yy) { return sx + w * 0.7 + Math.sin((yy - base + h) / h * Math.PI) * 1.2; }, function (yy) { return sx + w + Math.sin((yy - base + h) / h * Math.PI) * 1.2; }, '#dccaa6');
      R(m, sx + w * 0.3, base - h - 2, w * 0.4, 2, '#e8dcc0'); R(m, sx + w * 0.28, base - h + 0.5, w * 0.44, 1, '#a88a5a');
      R(m, sx, base - h * 0.55, w, 1, '#6a8ac8');
      line(m, sx + w / 2, base - 3, sx + w / 2, base - h * 0.42, HP, '#c8a050'); line(m, sx + w / 2, base - 5, sx + w / 2 - 2, base - h * 0.4, HP, '#c8a050'); line(m, sx + w / 2, base - 5, sx + w / 2 + 2, base - h * 0.4, HP, '#c8a050');
    };
    sack(386, 128, 14, 16); sack(402, 128, 13, 14); sack(393, 113, 12, 12); sack(124, 128, 12, 14);
    L.push({ c: md, f: 0.12 });

    // in front: enamel lamps hanging on long cords, each with its warm pool of light
    var nr = strip(), n = nr.getContext('2d');
    [92, 250, 424].forEach(function (lx) {
      R(n, lx - HP / 2, 0, HP, 20, '#5a3a2a');
      beam(n, lx, 25, lx, 92, 7, 30, '#fff0c8', 0.2);
      glow(n, lx, 25, 18, '#ffe0a0', 0.8);
      oval(n, lx + 0.4, 25, 6, 5, '#1e4a3e', true); oval(n, lx - 0.2, 24.8, 5.4, 4.5, '#2e6a58', true); oval(n, lx - 2, 22.5, 1.5, 1.2, '#6aa890');
      R(n, lx - 6, 24.5, 12, 1, '#f4f0e0'); disc(n, lx, 26, 1.6, '#fffbe0'); R(n, lx - 1, 18.5, 2, 2, '#3a3a3a');
    });
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  GEN.cheese = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    var WARM = '#ffc860';
    /* The cellar's far wall: a row of round arches, and through each the
       vaulted passage running back into the dark, rib after rib, a lantern
       on the piers between them pooling warm light on the flagstones. */
    var far = strip(), g = far.getContext('2d');
    var ST = ['#2a1e10', '#4a3820', '#5e4a2e', '#7c6442'], FL = 116;
    for (y = 0, j = 0; y < FL; y += 6, j++) for (x = j % 2 ? 0 : 8; x < SW; x += 16) { var tone = mix(ST[1], ST[2], rnd()); R(g, x + HP, y + HP, 15.5, 5.5, tone); R(g, x + HP, y + HP, 15.5, HP, mix(tone, ST[3], 0.5)); }
    var AR = 50, SPR = 66, VPY = 90;
    for (var ai = 0; ai < 4; ai++) {
      var cx = 64 + ai * 128;
      for (k = 0; k < 7; k++) {
        var s = Math.pow(0.76, k), r = AR * s, sp = VPY + (SPR - VPY) * s, fl = VPY + (FL - VPY) * s, dark = mix(mix(ST[1], '#140c04', 0.25), '#0e0802', Math.min(1, k / 5));
        for (y = sp - r; y < fl; y += HP) { var hw = y < sp ? Math.sqrt(Math.max(0, r * r - (sp - y) * (sp - y))) : r; R(g, cx - hw, y, hw * 2, HP, dark); }
        if (k) { var fn = VPY + (FL - VPY) * Math.pow(0.76, k - 1), fc = mix('#6a5234', '#140c04', k / 6); for (y = fl; y < fn; y += HP) { var w2 = AR * Math.pow(0.76, k - 1) - (AR * Math.pow(0.76, k - 1) - r) * (fn - y) / (fn - fl); R(g, cx - w2, y, w2 * 2, HP, fc); } }
        ring(g, cx, sp, r - Math.max(HP, 1.4 * s), r, mix(ST[3], dark, Math.min(0.85, k / 6)), sp);
        R(g, cx - r, sp, Math.max(HP, 1.4 * s), fl - sp, mix(ST[3], dark, Math.min(0.85, k / 5)));
      }
      if (ai % 2 === 0) { var ly = VPY + (SPR - VPY) * 0.58 + 4, lx = cx - AR * 0.58 + 3; glow(g, lx, ly, 10, WARM, 0.8); R(g, lx - 0.75, ly - 1, 1.5, 2, '#ffe8a0'); }
      // the arch's own stones, and its keystone
      ring(g, cx, SPR, AR, AR + 5, ST[2], SPR);
      for (var a = 0; a <= Math.PI + 0.01; a += Math.PI / 11) line(g, cx + Math.cos(a) * AR, SPR - Math.sin(a) * AR, cx + Math.cos(a) * (AR + 5), SPR - Math.sin(a) * (AR + 5), HP, ST[0]);
      ring(g, cx, SPR, AR + 4.5, AR + 5, ST[3], SPR - AR * 0.4);
      R(g, cx - 2.5, SPR - AR - 6, 5, 7, ST[3]); R(g, cx - 2.5, SPR - AR - 6, 5, HP, '#a08860'); R(g, cx + 1.5, SPR - AR - 6, 1, 7, ST[1]);
      R(g, cx - AR - 5, SPR, 5, FL - SPR, ST[2]); R(g, cx + AR, SPR, 5, FL - SPR, ST[2]); R(g, cx - AR - 5, SPR, HP, FL - SPR, ST[3]);
      // the lantern on the pier, and its pool of light
      var px2 = cx + 64;
      glow(g, px2, 58, 30, WARM, 0.85);
      R(g, px2 - 3, 62, 6, 1, '#2a1a0a'); R(g, px2 - HP, 62, 1, 4, '#2a1a0a');
      R(g, px2 - 2, 53, 4, 6, '#ffd878'); R(g, px2 - 1.5, 53.5, 1.5, 2.5, '#fff6d0'); R(g, px2 - 2.5, 52, 5, 1.2, '#3a2412'); R(g, px2 - 2.5, 59, 5, 1, '#3a2412'); R(g, px2 - HP, 50.5, 1, 1.5, '#3a2412');
    }
    // the floor: worn flagstones, brightest in the lantern light
    for (y = FL; y < H; y += HP) R(g, 0, y, SW, HP, mix('#5a4428', '#3a2a16', (y - FL) / (H - FL)));
    for (y = FL + 3, j = 0; y < H; y += 3 + j * 1.5, j++) { R(g, 0, y, SW, HP, '#2e2010'); var fs = SW / [32, 24, 16, 12, 10, 8, 8, 8][Math.min(7, j)]; for (x = (j * 7) % 11; x < SW; x += fs) R(g, x, y - 3 - j * 1.5, HP, 3 + j * 1.5, '#2e2010'); }
    R(g, 0, FL, SW, HP, '#8a7050');
    for (ai = 0; ai < 4; ai++) { g.globalAlpha = 0.16; oval(g, 128 + ai * 128, FL + 6, 22, 5, WARM); oval(g, 128 + ai * 128, FL + 6, 12, 3, WARM); g.globalAlpha = 1; }
    L.push({ c: far, f: 0.05 });

    /* The racks: tall wooden shelves of round cheeses — gold, pale and
       orange — a ladder against one, and lanterns hung between them. */
    var md = strip(), m = md.getContext('2d');
    var WD = ['#2e1c0c', '#5a3a1e', '#8a6038'];
    var CHS = [['#b8862a', '#e8b844', '#ffe08a'], ['#c8b488', '#ecdcb4', '#fff6dc'], ['#c86a20', '#f08c34', '#ffbc70']];
    var wheel = function (wx, base, w, h, c) {
      R(m, wx + 0.5, base - h, w - 1, h, c[1]); R(m, wx, base - h + 0.5, w, h - 1, c[1]);
      R(m, wx + w - 1.5, base - h + 0.5, 1.5, h - 1, c[0]); R(m, wx + 0.5, base - 1, w - 1, 1, c[0]); R(m, wx, base - h + 1, 1, h - 2.5, c[2]);
      oval(m, wx + w / 2, base - h + 0.8, w / 2 - 0.4, 1.1, c[2]); oval(m, wx + w / 2 + 0.5, base - h + 1, w / 2 - 1.5, 0.6, mix(c[2], c[1], 0.5));
      if (w > 9) { disc(m, wx + w * 0.45, base - h / 2, 1, mix(c[1], c[0], 0.6)); }
    };
    // a wheel stood on its edge, its rind ringed round; cut, it shows a wedge of holes
    var standing = function (wx, base, r, c, cut) {
      var cy = base - r;
      disc(m, wx + 0.4, cy + 0.4, r, c[0]); disc(m, wx, cy, r - 0.3, c[1]); ring(m, wx, cy, r - 1.4, r - 0.8, mix(c[1], c[0], 0.35)); disc(m, wx - r * 0.38, cy - r * 0.38, r * 0.28, c[2]);
      if (!cut) return;
      span(m, cy - r * 0.75, cy + r * 0.75, function (yy) { return wx + Math.abs(yy - cy) / 1.1; }, function (yy) { return wx + Math.sqrt(Math.max(0, r * r - (yy - cy) * (yy - cy))) + 0.3; }, '#fff0a4');
      line(m, wx, cy, wx + r * 0.66, cy - r * 0.75, HP, '#fffbe0');
      [[0.45, 0.05, 0.6], [0.7, -0.2, 0.45], [0.66, 0.28, 0.5]].forEach(function (q) { disc(m, wx + r * q[0], cy + r * q[1], Math.max(HP, r * q[2] * 0.3), '#e8c050'); });
    };
    [[22, 120], [282, 112]].forEach(function (q) {
      var x0 = q[0], w = q[1];
      [x0, x0 + w / 2, x0 + w].forEach(function (px) { R(m, px, 28, 2.5, 100, WD[1]); R(m, px, 28, HP, 100, WD[2]); R(m, px + 2, 28, HP, 100, WD[0]); });
      [46, 66, 86, 106, 126].forEach(function (sy) {
        R(m, x0 - 1, sy, w + 4.5, 1.5, WD[1]); R(m, x0 - 1, sy, w + 4.5, HP, WD[2]);
        for (var wx = x0 + 3; wx < x0 + w - 2;) {
          var ww = 9 + Math.floor(rnd() * 4), wh = 4.5 + Math.floor(rnd() * 3) * 0.5, c = CHS[rnd() > 0.78 ? (rnd() > 0.5 ? 1 : 2) : 0];
          if (wx + ww > x0 + w - 1) break;
          if (Math.abs(wx + ww / 2 - x0 - w / 2 - 1) < ww / 2 + 1.5) { wx += 3; continue; }
          if (rnd() < 0.34 && sy > 46) { var sr = 4 + rnd() * 1.2; standing(wx + sr, sy, sr, c, sy === 86 && wx < x0 + w / 2); wx += sr * 2 + 1.5; continue; }
          wheel(wx, sy, ww, wh, c);
          if (rnd() > 0.6 && wh < 6) wheel(wx + 1, sy - wh, ww - 2, wh - 0.5, c);
          wx += ww + 1 + rnd() * 2;
        }
      });
    });
    for (y = 0; y < 82; y += HP) { R(m, 158 + y * 0.12, 128 - y * 1.1, 1, HP, WD[1]); R(m, 166 + y * 0.12, 128 - y * 1.1, 1, HP, WD[1]); }
    for (y = 4; y < 82; y += 7) R(m, 158 + y * 0.12, 128 - y * 1.1, 9, 1, WD[2]);
    [214, 466].forEach(function (lx) {
      R(m, lx - HP / 2, 0, HP, 40, '#2a1a0a');
      glow(m, lx, 46, 26, WARM, 0.9);
      R(m, lx - 2.5, 41, 5, 1.2, '#3a2412'); R(m, lx - 2, 42, 4, 6, '#ffd878'); R(m, lx - 1.5, 42.5, 1.5, 2.5, '#fff6d0'); R(m, lx - 2.5, 48, 5, 1.2, '#3a2412'); R(m, lx - 2, 42, HP, 6, '#3a2412'); R(m, lx + 1.5, 42, HP, 6, '#3a2412');
    });
    L.push({ c: md, f: 0.13 });

    // in front: great stone piers, the ribs of the vault springing from them, a lantern on its chain
    var nr = strip(), n = nr.getContext('2d');
    var NS = ['#1a1008', '#2c2012', '#3e3020', '#5e4a32'];
    [[96, 352], [352, 608]].forEach(function (q) {
      var a0 = q[0] + 20, a1 = q[1], acx = (a0 + a1) / 2, arx = (a1 - a0) / 2;
      for (x = a0; x < a1; x += HP) { var u = (x - acx) / arx, yb = 30 - 34 * Math.sqrt(Math.max(0, 1 - u * u)); R(n, x, yb - 6, HP, 6, NS[2]); R(n, x, yb - HP, HP, HP, NS[0]); R(n, x, yb - 6, HP, HP, NS[3]); }
    });
    [96, 352].forEach(function (px) {
      R(n, px, 0, 20, 128, NS[2]); R(n, px + 15, 0, 5, 128, NS[1]); R(n, px, 0, 1, 128, NS[3]);
      for (y = 4, j = 0; y < 128; y += 9, j++) { R(n, px, y, 20, HP, NS[0]); R(n, px + (j % 2 ? 7 : 13), y - 9, HP, 9, NS[0]); }
      R(n, px - 2, 26, 24, 4, NS[2]); R(n, px - 2, 26, 24, HP, NS[3]); R(n, px - 2, 29.5, 24, HP, NS[0]);
    });
    [226, 482].forEach(function (lx) {
      for (y = 0; y < 30; y += 2) { R(n, lx - 0.5, y, 1, 1.5, '#3a2a18'); }
      glow(n, lx, 36, 22, WARM, 0.9);
      R(n, lx - 3, 30, 6, 1.5, '#2a1a0a'); R(n, lx - 2.5, 31.5, 5, 7, '#ffd070'); R(n, lx - 2, 32, 2, 3, '#fff6d0'); R(n, lx - 3, 38.5, 6, 1.5, '#2a1a0a'); R(n, lx - 2.5, 31.5, HP, 7, '#2a1a0a'); R(n, lx + 2, 31.5, HP, 7, '#2a1a0a');
    });
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  GEN.roofs = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, SX = 60, SY = 78;
    // golden hour: a low sun, streaks of cloud lit from beneath, pigeons wheeling
    var far = strip(), g = far.getContext('2d');
    [[3.6, 0.05], [2.7, 0.08], [2, 0.12], [1.45, 0.2]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, SX, SY, 13 * q[0], '#fff0c0'); });
    g.globalAlpha = 1;
    disc(g, SX, SY, 13, '#ffb84c'); disc(g, SX - 0.8, SY - 1, 11.8, '#ffcc66'); disc(g, SX - 4, SY - 4.4, 5.4, '#fff0b0');
    for (i = 0; i < 9; i++) streak(g, rnd() * SW, 16 + rnd() * 58, 40 + rnd() * 80, 1.5 + rnd() * 2.5, [mix('#d49ab4', hz, 0.2), mix('#f8c0b8', hz, 0.15), '#ffe8c0'], true);
    for (i = 0; i < 9; i++) bird(g, 110 + rnd() * 300, 22 + rnd() * 40, mix('#6a6a88', hz, 0.3));
    L.push({ c: far, f: 0.02 });

    /* The skyline far off, lilac in the evening haze: the Eiffel Tower over
       the rooftops, and the white basilica up on its hill catching the sun. */
    var sk = strip(), s = sk.getContext('2d');
    var hs = function (c, a) { return mix(c, hz, a === undefined ? 0.55 : a); };
    var MH = function (xx) { var u = (xx - 338) / 44; return 99 - 17 * Math.exp(-u * u * 1.5); };
    for (x = 262; x < 414; x += HP) { y = MH(x); R(s, x, y, HP, H - y, hs('#8c8aa8')); R(s, x, y, HP, HP, hs('#e8c4b8')); }
    for (i = 0; i < 16; i++) { x = 292 + rnd() * 92; ball(s, x, MH(x) + 1.5 + rnd() * 4, 1.4 + rnd(), [hs('#6a7a7a'), hs('#8a9a88'), hs('#c8c8a8')]); }
    basilica(s, 338, MH(338) + 1.5, 0.95, [hs('#c8b4c0', 0.42), hs('#fff2e8', 0.35), '#fffaf0']);
    eiffel(s, 150, 104, 84, [hs('#6e5268', 0.5), hs('#a08494', 0.55), hs('#e8b8a0', 0.45)]);
    [[0.6, 92, '#9894b4'], [0.5, 98, '#a4a0bc'], [0.42, 105, '#aca4bc']].forEach(function (q, qi) {
      for (x = rnd() * 3; x < SW;) {
        var bw = 4 + rnd() * 7, bh = 2 + rnd() * (qi ? 4 : 6), c = hs(q[2], q[0]);
        R(s, x, q[1] - bh, bw, H, c); R(s, x, q[1] - bh, bw, HP, hs('#ffd8b8', q[0] - 0.1)); R(s, x + bw - 1, q[1] - bh, 1, H, hs(mix(q[2], '#5a5070', 0.25), q[0]));
        if (rnd() > 0.6) R(s, x + 1, q[1] - bh - 1, 1, 1, c);
        if (rnd() > 0.93) { R(s, x + bw / 2 - 0.5, q[1] - bh - 6, 1, 6, c); R(s, x + bw / 2 - HP / 2, q[1] - bh - 8, HP, 2, c); }
        if (rnd() > 0.96) oval(s, x + bw / 2, q[1] - bh, 3, 3.5, hs('#c8b090', q[0]), true);
        x += bw + rnd() * 1.5;
      }
    });
    mist(s, 88, 30, hz);
    L.push({ c: sk, f: 0.045 });

    // the roofs across the street: cream stone fronts under zinc mansards, dormers, balconies, chimney pots
    var md = strip(), m = md.getContext('2d');
    var hm = function (c) { return mix(c, hz, 0.34); };
    var Z = [hm('#5a6a86'), hm('#7a8aa6'), hm('#b8c4dc')], S = [hm('#d4bea0'), hm('#f0dec0'), hm('#fff4e0')], P = [hm('#c0603c'), hm('#f09a64'), hm('#4a4656'), hm('#4c5a7c'), hm('#ffcc90')];
    for (x = 0; x < SW;) { var w = 28 + Math.floor(rnd() * 4) * 6, top = 92 + Math.floor(rnd() * 5) * 3; if (SW - x - w < 26) w = SW - x; paris(m, x, w, top, Z, S, P, rnd); x += w; }
    mist(m, 110, 20, hz);
    L.push({ c: md, f: 0.11 });

    /* The nearest roofs, at the bottom: steep zinc with standing seams, its
       dormers flashing gold, and tall chimney stacks crowned with pots, with
       pigeons on them. No long level ridge: the roofline steps and slopes. */
    var nr = strip(), n = nr.getContext('2d');
    var hn = function (c) { return mix(c, hz, 0.16); };
    var NZ = [hn('#46546e'), hn('#5e6e8c'), hn('#e0b8a8'), hn('#2c3448')], NS = [hn('#c4a688'), hn('#ead0ac'), hn('#fff2d8')], POT = [hn('#a84e2e'), hn('#d0703e'), hn('#ffb07a')];
    var bigRoof = function (x0, w, top) {
      var sl = 9;
      span(n, top, 128, function (yy) { return x0 + Math.max(0, sl - (yy - top) * 0.5); }, function (yy) { return x0 + w - Math.max(0, sl - (yy - top) * 0.5); }, NZ[1]);
      for (var sx = x0 + 3; sx < x0 + w - 2; sx += 3) R(n, sx, top + 1, HP, 128 - top, NZ[0]);
      for (y = top; y < top + sl * 2; y += HP) { R(n, x0 + Math.max(0, sl - (y - top) * 0.5), y, 1, HP, NZ[2]); R(n, x0 + w - Math.max(0, sl - (y - top) * 0.5) - 1, y, 1, HP, NZ[3]); }
      R(n, x0 + sl, top, w - sl * 2, 1, NZ[2]); R(n, x0 + sl, top + 1, w - sl * 2, HP, NZ[0]);
      for (var dx = x0 + 10 + rnd() * 6; dx < x0 + w - 14; dx += 18 + rnd() * 8) {
        R(n, dx, top + 3, 7, 9, NS[1]); R(n, dx + 6, top + 3, 1, 9, NS[0]); oval(n, dx + 3.5, top + 3, 4.2, 2.4, NS[1], true); oval(n, dx + 2.5, top + 2, 1.6, 0.8, NS[2]);
        R(n, dx + 1.5, top + 4.5, 4, 6.5, hn('#3a4660')); R(n, dx + 1.5, top + 4.5, 2, 3.5, '#ffd08a'); R(n, dx + 1.5, top + 8, 4, HP, NS[1]); R(n, dx + 3.25, top + 4.5, HP, 6.5, NS[1]);
        R(n, dx - 0.5, top + 12, 8, 1, NS[2]);
      }
      // the chimney stack and its pots
      var cx = x0 + 10 + Math.floor(rnd() * (w - 28)), cw = 8 + Math.floor(rnd() * 3) * 2, ch = 16 + rnd() * 10, ct = top - ch;
      R(n, cx, ct, cw, ch + 2, NS[1]); R(n, cx + cw - 2, ct, 2, ch + 2, NS[0]); R(n, cx, ct, HP, ch + 2, NS[2]);
      for (y = ct + 3; y < top; y += 3) R(n, cx, y, cw, HP, mix(NS[1], NS[0], 0.5));
      R(n, cx - 1, ct - 1.5, cw + 2, 1.5, NS[2]); R(n, cx - 1, ct, cw + 2, HP, NS[0]);
      var pots = [];
      for (var px = cx + 0.5; px < cx + cw - 1.5; px += 2.4) { var ph = 3 + rnd() * 2.5; pots.push([px, ph]); R(n, px, ct - 1.5 - ph, 1.8, ph, POT[1]); R(n, px + 1.2, ct - 1.5 - ph, 0.6, ph, POT[0]); R(n, px - 0.25, ct - 1.5 - ph, 2.3, 0.8, POT[2]); }
      return [cx, ct - 1.5, cw];
    };
    var stacks = [];
    for (x = 0; x < SW;) { var rw = 56 + Math.floor(rnd() * 4) * 8; if (SW - x - rw < 44) rw = SW - x; stacks.push(bigRoof(x, rw, 109 + Math.floor(rnd() * 3) * 4)); x += rw; }
    // pigeons, plump and grey, on two of the stacks
    [stacks[0], stacks[2]].forEach(function (st, si) {
      var px2 = st[0] + st[2] * (si ? 0.7 : 0.3), py2 = st[1] - 4.5;
      oval(n, px2, py2 + 1, 1.8, 1.2, '#8a8aa0'); oval(n, px2 - 0.3, py2 + 0.6, 1.3, 0.8, '#b8b8cc'); disc(n, px2 - 1.6, py2 - 0.3, 0.8, '#9a9ab0');
      R(n, px2 - 2.6, py2 - 0.3, HP, HP, '#e8a050'); R(n, px2 - 1.6, py2 - 0.6, HP, HP, '#2a2a3a'); R(n, px2 + 1.4, py2 + 0.8, 1, HP, '#6a6a80'); R(n, px2 - 1.4, py2 + 0.4, 0.8, 0.8, '#9ac8a8');
    });
    L.push({ c: nr, f: 0.26 });
    return L;
  };

  GEN.metro = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y, k, a;
    /* The far side of the station: the vault of white bevelled tiles, its
       rows growing shallower and dimmer as it curves away overhead, posters
       that are only blocks of colour, blank enamel plaques, benches on the
       far platform, and the arch of the tunnel mouth, where a train's lights
       glow far off in the dark. */
    var far = strip(), g = far.getContext('2d');
    var WB = 104, TX = 410, TR = 50, TS = 104, TA = 66;
    var yy = WB, ri = 0;
    while (yy > 0) {
      var rh = 1.5 + 1.6 * Math.pow(yy / WB, 0.9), y0 = yy - rh, lt = Math.pow(Math.min(1, Math.max(0, (y0 + 6) / 70)), 0.9);
      var tile = mix('#2c3446', '#e2e6ea', lt), hi = mix('#3a4458', '#ffffff', lt), sh = mix('#20263a', '#b4bcc8', lt), grout = mix('#181e2c', '#8890a0', lt);
      R(g, 0, y0, SW, rh, grout); R(g, 0, y0, SW, rh - HP, tile); R(g, 0, y0, SW, HP, hi); if (rh > 2) R(g, 0, y0 + rh - HP * 2, SW, HP, sh);
      for (x = ri % 2 ? 2 : 0; x < SW; x += 4) R(g, x, y0, HP, rh, grout);
      yy = y0; ri++;
    }
    // posters: plain blocks of colour in their faience frames
    var poster = function (px, py, c) {
      R(g, px - 2, py - 2, 30, 38, '#b08a5a'); R(g, px - 2, py - 2, 30, HP, '#e8c890'); R(g, px - 2, py - 2, HP, 38, '#e8c890'); R(g, px - 1, py - 1, 28, 36, '#6a4a2a');
      R(g, px, py, 26, 34, c[0]);
      return function (fn) { fn(px, py); };
    };
    poster(22, 50, ['#2a8a9a'])(function (px, py) { disc(g, px + 17, py + 10, 6, '#ffd040'); disc(g, px + 16, py + 9, 3, '#fff0a0'); oval(g, px + 8, py + 30, 12, 9, '#6ac070', true); oval(g, px + 22, py + 30, 9, 6, '#4aa060', true); R(g, px, py + 30, 26, 4, '#f4f0e0'); });
    poster(134, 50, ['#e8705a'])(function (px, py) { R(g, px + 4, py + 6, 12, 18, '#2a3a7a'); disc(g, px + 18, py + 20, 6, '#fff0d8'); R(g, px, py + 28, 26, 6, '#2a3a7a'); R(g, px + 3, py + 30, 14, 1.5, '#fff0d8'); });
    poster(246, 50, ['#f0b440'])(function (px, py) { span(g, py + 8, py + 28, function (q) { return px + 13 - (q - py - 8) * 0.6; }, function (q) { return px + 13 + (q - py - 8) * 0.6; }, '#3a6ac8'); span(g, py + 8, py + 13, function (q) { return px + 13 - (q - py - 8) * 0.6; }, function (q) { return px + 13 + (q - py - 8) * 0.6; }, '#ffffff'); R(g, px, py + 28, 26, 6, '#e8503a'); disc(g, px + 5, py + 6, 3, '#fff6d0'); });
    // the blank blue plaques where a station's name would go
    [[66, 60], [178, 60], [290, 60]].forEach(function (q) { R(g, q[0] - 1, q[1] - 1, 36, 9, '#f4f4f0'); R(g, q[0], q[1], 34, 7, '#1e3e8a'); R(g, q[0], q[1], 34, HP, '#3a5aaa'); });
    // the far platform: its surface, the pale edge line, the face down to the tracks
    R(g, 0, WB, SW, 3, '#8a8a92'); R(g, 0, WB, SW, HP, '#b4b4bc'); R(g, 0, WB + 2.5, SW, HP, '#f0e8c0'); R(g, 0, WB + 3, SW, 6, '#3e404c'); R(g, 0, WB + 3, SW, HP, '#5a5c68');
    for (x = 0; x < SW; x += 8) R(g, x, WB + 3, HP, 6, '#2e3040');
    [[90, 1], [204, 0], [316, 1]].forEach(function (q) {
      var bx = q[0];
      R(g, bx, WB - 4, 16, 1.2, '#a8743e'); R(g, bx, WB - 4, 16, HP, '#d8a060'); R(g, bx, WB - 7.5, 16, 1, '#a8743e'); R(g, bx, WB - 6, 16, 0.8, '#8a5a2e');
      R(g, bx + 1, WB - 3, 1, 3, '#2e5a44'); R(g, bx + 14, WB - 3, 1, 3, '#2e5a44'); R(g, bx + 1, WB - 8, 1, 4, '#2e5a44'); R(g, bx + 14, WB - 8, 1, 4, '#2e5a44');
    });
    // the track bed: ballast, sleepers, rails glinting
    R(g, 0, WB + 9, SW, H, '#161a24');
    for (x = 0; x < SW; x += 8) R(g, x, WB + 16, 4, 2, '#2e2a28');
    for (i = 0; i < 160; i++) R(g, rnd() * SW, WB + 10 + rnd() * 30, HP, HP, '#2a2e3a');
    [WB + 14.5, WB + 21].forEach(function (ry) { R(g, 0, ry, SW, 1, '#4a5060'); R(g, 0, ry, SW, HP, '#9aa4b4'); });
    // the tunnel mouth: an arch the shape of the vault, and the dark going back and back
    var arch = function (y) { var d = (TS - y) / TA; return y >= TS ? TR : TR * Math.sqrt(Math.max(0, 1 - d * d)); };
    for (y = TS - TA - 4; y < WB + 9; y += HP) { var o = y >= TS ? TR + 4 : (TR + 4) * Math.sqrt(Math.max(0, 1 - Math.pow((TS - y) / (TA + 4), 2))); if (o > 0) R(g, TX - o, y, o * 2, HP, '#4a5468'); }
    for (y = TS - TA; y < WB + 9; y += HP) { var hw = arch(y); if (hw > 0) R(g, TX - hw, y, hw * 2, HP, '#0e121c'); }
    for (k = 1; k < 6; k++) {
      var s = Math.pow(0.72, k), vy = 90;
      for (y = vy + (TS - TA - vy) * s; y < vy + (WB + 9 - vy) * s; y += HP) { var d2 = (vy + (TS - vy) * s - y) / (TA * s), hw2 = y >= vy + (TS - vy) * s ? TR * s : TR * s * Math.sqrt(Math.max(0, 1 - d2 * d2)); if (hw2 > 0) { R(g, TX - hw2, y, HP, HP, mix('#2a3448', '#0e121c', k / 6)); R(g, TX + hw2 - HP, y, HP, HP, mix('#2a3448', '#0e121c', k / 6)); } }
    }
    line(g, TX - TR + 6, WB + 14.5, TX - 3, 92, HP, '#3a4256'); line(g, TX - TR + 18, WB + 21, TX - 1, 92.5, HP, '#3a4256');
    glow(g, TX - 3, 89, 14, '#fff0c0', 0.75); glow(g, TX + 3, 89, 14, '#fff0c0', 0.75);
    disc(g, TX - 3, 89, 1, '#fffbe8'); disc(g, TX + 3, 89, 1, '#fffbe8'); R(g, TX - 2.5, 86, 5, 1.5, '#8a98b0');
    for (a = 0; a <= Math.PI + 0.01; a += Math.PI / 14) { var ax = TX + Math.cos(a) * (TR + 2), ay = TS - Math.sin(a) * (TA + 2); R(g, ax - HP / 2, ay - HP / 2, HP, HP, '#2e3646'); }
    R(g, TX + TR + 6, 78, 3, 8, '#2a2e38'); disc(g, TX + TR + 7.5, 80, 1, '#5aff8a'); glow(g, TX + TR + 7.5, 80, 5, '#5aff8a', 0.7);
    L.push({ c: far, f: 0.05 });

    /* Green ironwork up the far wall: slim columns that curl at their tops
       into brackets, each hung with a globe lamp; and the round M sign. */
    var md = strip(), m = md.getContext('2d');
    var IR = ['#1a4232', '#2c6a4e', '#5aa47e', '#a4dcbc'];
    for (i = 0; i < 4; i++) {
      x = 40 + i * 128;
      R(m, x - 1.5, 8, 3, WB - 6, IR[1]); R(m, x - 1.5, 8, HP, WB - 6, IR[2]); R(m, x + 1, 8, HP, WB - 6, IR[0]);
      R(m, x - 3, WB - 6, 6, 4, IR[1]); R(m, x - 3, WB - 6, 6, HP, IR[2]); R(m, x - 2, 30, 4, 2, IR[1]); R(m, x - 2, 30, 4, HP, IR[3]);
      [-1, 1].forEach(function (d) { for (var t = 0; t < 1; t += 0.03) { var a2 = t * Math.PI * 1.6, rr = 5 * (1 - t * 0.6); R(m, x + d * (5 - Math.cos(a2) * rr) - 0.5, 14 - Math.sin(a2) * rr, 1, 1, t < 0.3 ? IR[2] : IR[1]); } });
      line(m, x + 1.5, 38, x + 9, 34, 1, IR[1]); R(m, x + 8.5, 34, HP, 5, IR[0]);
      glow(m, x + 8.75, 42, 16, '#fff0c8', 0.85); disc(m, x + 8.75, 42, 2.8, '#fff6dc'); disc(m, x + 8, 41.2, 1.1, '#ffffff'); R(m, x + 7.5, 38.6, 2.5, 1, IR[1]);
    }
    var MX = 168, MY = 52;
    R(m, MX - 1, MY + 6, 2, WB - MY - 6, IR[1]); R(m, MX - 1, MY + 6, HP, WB - MY - 6, IR[2]); R(m, MX - 2.5, WB - 3, 5, 3, IR[1]);
    disc(m, MX + 0.5, MY + 0.5, 7, '#123020'); disc(m, MX, MY, 7, IR[1]); disc(m, MX, MY, 5.6, '#f4ecd0'); disc(m, MX - 1.5, MY - 1.5, 2, '#fffaf0');
    [[-3, -3, -3, 3], [-3, -3, 0, 0.5], [0, 0.5, 3, -3], [3, -3, 3, 3]].forEach(function (q) { line(m, MX + q[0], MY + q[1], MX + q[2], MY + q[3], 1, '#1e4a36'); });
    L.push({ c: md, f: 0.12 });

    // in front: two great iron columns, and lamps hanging from the vault on long stems
    var nr = strip(), n = nr.getContext('2d');
    var NI = ['#10281e', '#1e4a36', '#3e7a5c', '#7ab496'];
    [120, 376].forEach(function (cx) {
      R(n, cx - 4, 0, 8, 128, NI[1]); R(n, cx - 4, 0, 1.5, 128, NI[2]); R(n, cx + 2.5, 0, 1.5, 128, NI[0]);
      for (x = cx - 2; x < cx + 3; x += 2) R(n, x, 0, HP, 128, mix(NI[1], NI[0], 0.5));
      R(n, cx - 6, 116, 12, 12, NI[1]); R(n, cx - 6, 116, 12, HP, NI[3]); R(n, cx - 5, 112, 10, 4, NI[1]); R(n, cx - 5, 112, 10, HP, NI[2]);
      R(n, cx - 6, 22, 12, 3, NI[1]); R(n, cx - 6, 22, 12, HP, NI[3]); oval(n, cx, 25, 6, 2, NI[1]);
      [-1, 1].forEach(function (d) { for (var t = 0; t < 1; t += 0.025) { var a2 = t * Math.PI * 1.7, rr = 7 * (1 - t * 0.55); R(n, cx + d * (7 - Math.cos(a2) * rr) - 0.75, 22 - Math.sin(a2) * rr, 1.5, 1.5, t < 0.25 ? NI[2] : NI[1]); } });
    });
    [248, 504].forEach(function (lx) {
      R(n, lx - HP / 2, 0, HP, 26, NI[1]);
      glow(n, lx, 31, 22, '#fff2cc', 0.9); R(n, lx - 3.5, 26, 7, 1.5, NI[1]); disc(n, lx, 31, 4, '#fff8e4'); disc(n, lx - 1.2, 29.8, 1.6, '#ffffff');
    });
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  /* A lattice girder of the Eiffel Tower: two flanged rails laced between
     with criss-cross diagonals, a rivet at every joint. It runs from y0 down
     to y1 and leans (x drifts by lean for each pixel up). Nothing in it lies
     level, so on a climb it never looks like a floor. c = [shade, body, light, rivet] */
  var girder = function (g, x, y0, y1, w, lean, c) {
    var X = function (yy) { return x + (y1 - yy) * lean; }, step = w * 1.15, yy;
    for (yy = y1; yy > y0 - step; yy -= step) {
      line(g, X(yy) + 1.5, yy, X(yy - step) + w - 2, yy - step, 1, c[1]);
      line(g, X(yy) + w - 2, yy, X(yy - step) + 1.5, yy - step, 1, c[0]);
      line(g, X(yy) + 1.5, yy - 0.5, X(yy - step) + w - 2, yy - step - 0.5, HP, c[2]);
    }
    for (yy = y0; yy < y1; yy += 1) { var xl = X(yy + 0.5); R(g, xl, yy, 2, 1, c[1]); R(g, xl, yy, HP, 1, c[2]); R(g, xl + w - 2, yy, 2, 1, c[1]); R(g, xl + w - HP, yy, HP, 1, c[0]); }
    for (yy = y1; yy > y0; yy -= step) { R(g, X(yy) + 0.5, yy - 0.5, HP, HP, c[3]); R(g, X(yy) + w - 1.5, yy - 0.5, HP, HP, c[3]); }
  };

  GEN.tower = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    /* The climb: the level is about 40 rows tall, so as the camera rises a
       long way, drawBackdrop slides every layer down (its lift). LIFT is the
       most it can rise (48 rows, with room to spare); the sky and the
       ironwork reach up above the screen that far, so nothing comes loose at
       the top, and the city layers, each opaque all the way to the bottom of
       its strip, slide down past one another: the city falls away below. */
    var LIFT = 240;
    var far = tallStrip(0.025, LIFT), g = far.c.getContext('2d');
    sun(g, 70, 20, 10, ['#fff8d8', '#fff4c0', '#fffbea']);
    var CB = [mix('#a8cdee', hz, 0.12), '#ffffff', '#ffffff'];
    for (i = 0; i < 9; i++) cloud(g, i * 57 + rnd() * 26, -far.e + 6 + rnd() * (far.e + 64), 0.55 + rnd() * 0.6, CB);
    L.push(far);

    // clouds at our own height, sliding down past as we climb up through them
    var cl = tallStrip(0.12, LIFT), cg = cl.c.getContext('2d');
    for (i = 0; i < 6; i++) cloud(cg, i * 85 + rnd() * 40, -cl.e + 8 + rnd() * (cl.e + 40), 0.5 + rnd() * 0.45, [mix('#b4d4f2', hz, 0.2), mix('#ffffff', hz, 0.1), '#ffffff']);

    /* The whole city spread out under the haze to the far hills: row on row
       of cream fronts under blue-grey roofs, parks, the white basilica on its
       hill, and the Seine winding through under its bridges. This layer moves
       least, so it is what stays in view, far below, at the top of the climb. */
    var hzn = strip(), h = hzn.getContext('2d');
    var hh = function (c, a) { return mix(c, hz, a); };
    land(h, function (xx) { return 94 + Math.sin(xx * TAU * 2 + 1) * 2.5 + Math.sin(xx * TAU * 7) * 1; }, [hh('#7c94b8', 0.58), hh('#90a6c8', 0.6), hh('#c8d8ec', 0.5)], 4);
    var MH = function (xx) { var u = (xx - 300) / 30; return 96 - 10 * Math.exp(-u * u * 1.5); };
    for (x = 256; x < 344; x += HP) { y = MH(x); R(h, x, y, HP, H - y, hh('#8a9cbc', 0.56)); R(h, x, y, HP, HP, hh('#d8e4f0', 0.5)); }
    basilica(h, 300, MH(300) + 1, 0.6, [hh('#b8c4d8', 0.42), hh('#ffffff', 0.32), '#ffffff']);
    var WA = [], WB = [], WS = [], RF = [], RL = [];
    for (j = 0; j < 16; j++) { a = Math.max(0.2, 0.56 - j * 0.026); WA.push(hh('#f2e6cc', a)); WB.push(hh('#e4d2b4', a)); WS.push(hh('#bca88c', a)); RF.push(hh('#8696b4', a)); RL.push(hh('#d0dcf0', a)); }
    for (j = 0; j < 16; j++) {
      var ry = 97 + j * (1.8 + j * 0.26), a = Math.max(0.2, 0.56 - j * 0.026), sc = 0.6 + j * 0.09;
      if (ry - 3 > H) break;
      for (x = rnd() * 3; x < SW;) {
        var bw = (2 + rnd() * 4) * sc, bh = (1.2 + rnd() * 1.4) * sc;
        if (rnd() < 0.08) { oval(h, x + bw / 2 + 0.3, ry - bh * 0.4, bw * 0.6, bh * 0.9 + 0.5, hh('#4e8a4a', a)); oval(h, x + bw / 2, ry - bh * 0.5, bw * 0.5, bh * 0.75 + 0.4, hh('#6aa858', a)); R(h, x + bw * 0.3, ry - bh * 1.1, bw * 0.3, HP, hh('#b4e090', a)); x += bw + 1; continue; }
        // (the farthest rows are too small for a lit edge and a shaded side)
        R(h, x, ry - bh, bw, bh + 3 * sc, rnd() > 0.35 ? WA[j] : WB[j]); if (j > 5) { R(h, x + bw - 0.6 * sc, ry - bh, 0.6 * sc, bh + 3 * sc, WS[j]); R(h, x, ry - bh - 0.9 * sc, bw, HP, RL[j]); }
        R(h, x, ry - bh - 0.9 * sc + (j > 5 ? HP : 0), bw, 0.9 * sc, RF[j]);
        x += bw + (rnd() > 0.85 ? 2.5 * sc : 0.4);
      }
    }
    var RV = function (xx) { return 112 + Math.sin(xx * TAU * 2 + 0.5) * 3 + Math.sin(xx * TAU * 3) * 1.4; };
    var RC = [hh('#e8dcc0', 0.3), hh('#5c96c4', 0.28), hh('#b8dcf4', 0.25), hh('#d8ccb0', 0.3), hh('#5a9a50', 0.3)];
    for (x = 0; x < SW; x += 1) { y = RV(x); R(h, x, y - 1, 1, 1, RC[0]); R(h, x, y, 1, 3.5, RC[1]); R(h, x, y, 1, HP, RC[2]); R(h, x, y + 3.5, 1, 1, RC[3]); R(h, x, y + 4.5, 1, HP, RC[4]); }
    for (i = 0; i < 50; i++) { x = rnd() * SW; R(h, x, RV(x) + 0.8 + rnd() * 2, 0.8 + rnd() * 2.5, HP, hh('#e8f6ff', 0.2)); }
    for (x = 18; x < SW; x += 46 + Math.floor(rnd() * 3) * 8) { y = RV(x); R(h, x - 1, y - 1, 2.5, 5.5, hh('#f0e6d0', 0.28)); R(h, x + 1, y - 1, HP, 5.5, hh('#b4a890', 0.3)); R(h, x + 1.5, y + 0.5, 1, 1, hh('#3a6a94', 0.3)); R(h, x + 1.5, y + 2.2, 1, 1, hh('#3a6a94', 0.3)); }
    [[120, 1], [262, -1], [400, 1]].forEach(function (q) { R(h, q[0], RV(q[0]) + 1.2, 3.5, 1, hh('#ffffff', 0.15)); h.globalAlpha = 0.5; R(h, q[0] + (q[1] > 0 ? -5 : 3.5), RV(q[0]) + 1.8, 5, HP, '#ffffff'); h.globalAlpha = 1; });
    L.push({ c: hzn, f: 0.04 });
    L.splice(L.length - 1, 0, cl);

    /* Nearer, the blocks round the tower: cream stone under blue-grey roofs,
       avenues of trees between them, a golden dome. It drops away first. */
    var ct = strip(), c = ct.getContext('2d');
    var hc = function (col) { return mix(col, hz, 0.24); };
    for (var yy = 118, rr = 0; yy < H + 6; yy += 6.5, rr++) {
      if (rr % 2) {
        // an avenue: a band of tree crowns, bumpy along its top, lit on each crown's left
        for (x = 0; x < SW; x += HP) { var ph = (x + rr * 1.5) % 4 / 4, tt = yy - 1.5 - Math.sin(ph * Math.PI) * 1.6; R(c, x, tt, HP, 4.5, hc('#5aa048')); R(c, x, tt + 3, HP, 1.5, hc('#3e7a3a')); if (ph < 0.45) R(c, x, tt, HP, HP, hc('#a4d878')); }
        continue;
      }
      for (x = rnd() * 4; x < SW;) {
        var bw2 = 6 + rnd() * 8, bh2 = 2.5 + rnd() * 2;
        R(c, x, yy - bh2, bw2, bh2 + 6, hc('#f0e2c6')); R(c, x + bw2 - 1, yy - bh2, 1, bh2 + 6, hc('#c4b090')); R(c, x, yy - bh2, HP, bh2 + 6, hc('#fff8ea'));
        R(c, x - 0.3, yy - bh2 - 1.6, bw2 + 0.6, 1.6, hc('#7c8cac')); R(c, x - 0.3, yy - bh2 - 1.6, bw2 + 0.6, HP, hc('#c8d4ea'));
        for (var wx = x + 1; wx < x + bw2 - 1.5; wx += 1.6) R(c, wx, yy - bh2 + 1, HP, 1, hc('#7a7c94'));
        x += bw2 + (rnd() > 0.8 ? 3 : 0.5);
      }
    }
    var DX = 156, DY = 120;
    R(c, DX - 10, DY - 2, 20, 8, hc('#f6ecd6')); R(c, DX + 7, DY - 2, 3, 8, hc('#d0c4ac'));
    R(c, DX - 4, DY - 6.5, 8, 4.5, hc('#f6ecd6')); for (x = DX - 3.5; x < DX + 4; x += 1.2) R(c, x, DY - 6, HP, 3.5, hc('#c8bca4'));
    oval(c, DX + 0.3, DY - 6.5, 4.6, 5.6, hc('#c8962e'), true); oval(c, DX - 0.2, DY - 6.5, 4, 5.2, hc('#f2c450'), true); oval(c, DX - 1.6, DY - 9.2, 1.1, 1.6, hc('#fff2a8'));
    R(c, DX - HP / 2, DY - 14.5, HP, 3, hc('#c8962e'));
    L.push({ c: ct, f: 0.09 });

    // the foot of the tower: the gardens' clipped trees, in rows
    var pk = strip(), p = pk.getContext('2d');
    var hp = function (col) { return mix(col, hz, 0.14); };
    R(p, 0, 122, SW, H, hp('#7ab85a'));
    for (y = 122; y < H; y += 3) R(p, 0, y, SW, 1.5, hp('#86c464'));
    for (x = 0; x < SW; x += 64) { R(p, x + 26, 122, 12, H, hp('#efe4c8')); R(p, x + 26, 122, 12, HP, hp('#fff8e4')); }
    for (x = 3; x < SW; x += 8) { if ((x % 64) > 22 && (x % 64) < 40) continue; R(p, x - 0.5, 120, 1, 4, hp('#6a5038')); ball(p, x, 117, 4.2, [hp('#3e7a3a'), hp('#5aa048'), hp('#9ad070')]); }
    L.push({ c: pk, f: 0.15 });

    /* The tower's own ironwork: far girders across the gap, blue with the
       air between, and the near ones close by, bronze-brown and riveted.
       All upright or leaning, never level. */
    var gf = tallStrip(0.2, LIFT), q2 = gf.c.getContext('2d');
    var GF = [mix('#6a5040', hz, 0.5), mix('#8a6a54', hz, 0.5), mix('#c0a088', hz, 0.45), mix('#d8bca0', hz, 0.45)];
    [[40, 0.07, 11], [214, -0.06, 10], [398, 0.06, 11]].forEach(function (q) { girder(q2, q[0], -gf.e, H, q[2], q[1], GF); });
    L.push(gf);
    var gn = tallStrip(0.34, LIFT), r2 = gn.c.getContext('2d');
    var GN = [mix('#4e3628', hz, 0.1), mix('#7e5a42', hz, 0.1), mix('#b88c6a', hz, 0.08), mix('#e0b890', hz, 0.08)];
    [[84, -0.09, 18], [338, 0.08, 17]].forEach(function (q) { girder(r2, q[0], -gn.e, H, q[2], q[1], GN); });
    L.push(gn);
    return L;
  };

  // a low clipped hedge along the edge f, a row of rounded humps lit on their left. c = [shade, body, light]
  var hedge = function (g, f, c) {
    for (var x = 0; x < SW; x += HP) {
      var ph = (x % 8) / 8, t = f(x) - 2.5 - Math.sin(ph * Math.PI) * 2.4;
      R(g, x, t, HP, 6, c[1]); R(g, x, t + 4, HP, 2, c[0]); if (ph < 0.42) R(g, x, t, HP, ph < 0.2 ? 1 : HP, c[2]);
    }
  };
  /* The fairground castle, our own design, shared by day (magic) and night:
     a rose-pink palace behind a crenellated wall, crowded with slim round
     towers, each under a tall slate-blue cone with a gold tip, the tallest
     spire in the middle. Lit from the top left. P = {wall, roof: [shade,
     body, light], gold: [body, light], win, glint, door, glow (night only)} */
  var castle = function (g, cx, B, P) {
    var W = P.wall, RF = P.roof, GD = P.gold, x, y;
    var win = function (x, y, w, h) {
      if (P.glow) glow(g, x + w / 2, y + h / 2, w * 2.6 + 2, P.glow, 0.55);
      R(g, x, y + w / 2, w, h - w / 2, P.win); disc(g, x + w / 2, y + w / 2, w / 2, P.win);
      if (P.glint) R(g, x + HP / 2, y + w / 2, HP, h * 0.45, P.glint);
      R(g, x - HP, y + h, w + HP * 2, HP, W[2]);
    };
    var cone = function (x, base, r, h, flag) {
      for (var y = 0; y < h; y += HP) {
        var k = y / h, hw = r * Math.pow(k, 1.3) + (k > 0.92 ? (k - 0.92) * 9 : 0), yy = base - h + y;
        R(g, x - hw, yy, hw * 2, HP, RF[1]); R(g, x - hw, yy, hw * 0.5, HP, RF[2]); R(g, x + hw * 0.4, yy, hw * 0.6, HP, RF[0]);
      }
      for (y = base - h + 5; y < base - 1; y += 3.5) { var w2 = r * Math.pow((y - base + h) / h, 1.3); R(g, x - w2 + 0.5, y, w2 * 2 - 1, HP, mix(RF[1], RF[0], 0.45)); }
      var mt = flag ? 8 : 3.5;
      R(g, x - HP / 2, base - h - mt, HP, mt, GD[0]); disc(g, x, base - h - 1.5, 0.9, GD[0]); R(g, x - HP, base - h - 2, HP, HP, GD[1]);
      if (flag) span(g, base - h - 8, base - h - 5, function () { return x; }, function (yy) { return x + 5 * (1 - Math.abs(yy - (base - h - 6.5)) / 1.5); }, flag);
    };
    var tower = function (x, top, bot, r, wins) {
      R(g, x - r, top, r * 2, bot - top, W[1]); R(g, x - r, top, r * 0.5, bot - top, W[2]); R(g, x + r * 0.4, top, r * 0.6, bot - top, W[0]);
      for (var y = top + 5; y < bot; y += 5) R(g, x - r, y, r * 2, HP, mix(W[1], W[0], 0.3));
      R(g, x - r - 0.6, top, r * 2 + 1.2, 1.5, W[2]); R(g, x - r - 0.6, top + 1.5, r * 2 + 1.2, HP, W[0]);
      for (var i = 0; i < (wins || 0); i++) win(x - 0.75 - (r > 4 ? 0.25 : 0), top + 4 + i * 9, r > 4 ? 2 : 1.5, 4);
    };
    // at the back: the keep and its great spire, the towers either side, two slim turrets
    tower(cx - 24, B - 60, B - 30, 5.5, 2); cone(cx - 24, B - 60, 6.8, 21, P.flag);
    tower(cx + 23, B - 56, B - 30, 5, 2); cone(cx + 23, B - 56, 6.2, 19);
    tower(cx, B - 68, B - 40, 7, 2); cone(cx, B - 68, 8.6, 28, P.flag);
    tower(cx - 12, B - 62, B - 44, 2.6, 1); cone(cx - 12, B - 62, 3.3, 14);
    tower(cx + 13, B - 57, B - 44, 2.4, 1); cone(cx + 13, B - 57, 3.1, 12);
    // the palace: a steep slate roof with dormers, two rows of tall windows, a rose window
    var PW = 30, PT = B - 46;
    span(g, PT - 9, PT, function (yy) { return cx - PW + 1 + (PT - yy) * 0.9; }, function (yy) { return cx + PW - 1 - (PT - yy) * 0.9; }, RF[1]);
    span(g, PT - 9, PT, function (yy) { return cx - PW + 1 + (PT - yy) * 0.9; }, function (yy) { return cx - PW + 4 + (PT - yy) * 0.9; }, RF[2]);
    R(g, cx - PW + 9, PT - 9.5, PW * 2 - 18, 1, GD[0]);
    [cx - 15, cx + 15].forEach(function (dx) { R(g, dx - 2, PT - 6, 4, 5, W[1]); span(g, PT - 9, PT - 5.5, function (yy) { return dx - 2.6 * (yy - PT + 9) / 3.5; }, function (yy) { return dx + 2.6 * (yy - PT + 9) / 3.5; }, RF[1]); win(dx - 1, PT - 4.8, 2, 3.5); });
    R(g, cx - PW, PT, PW * 2, 32, W[1]); R(g, cx - PW, PT, 1.5, 32, W[2]); R(g, cx + PW - 5, PT, 5, 32, W[0]);
    for (y = PT + 6; y < B - 14; y += 6) R(g, cx - PW, y, PW * 2, HP, mix(W[1], W[0], 0.3));
    R(g, cx - PW - 1, PT, PW * 2 + 2, 1.5, W[2]); R(g, cx - PW - 1, PT + 1.5, PW * 2 + 2, HP, W[0]);
    for (var wx = cx - PW + 4; wx < cx + PW - 4; wx += 7.5) { if (Math.abs(wx + 1.25 - cx) < 5) continue; win(wx, PT + 5, 2.5, 7); win(wx, PT + 18, 2.5, 6); }
    disc(g, cx, PT + 9, 4.2, W[2]); disc(g, cx, PT + 9, 3.4, P.win); for (var a = 0; a < 8; a++) R(g, cx + Math.cos(a * Math.PI / 4) * 2 - HP / 2, PT + 9 + Math.sin(a * Math.PI / 4) * 2 - HP / 2, HP, HP, GD[1]);
    if (P.glow) glow(g, cx, PT + 9, 9, P.glow, 0.5);
    R(g, cx - 3.5, PT + 18, 7, 1, W[2]); for (var bx = cx - 3.5; bx < cx + 3.5; bx += 1.5) R(g, bx, PT + 19, HP, 2, W[2]);
    // corbelled bartizans on the palace's corners
    [cx - PW - 1, cx + PW + 1].forEach(function (bx2) { span(g, PT + 2, PT + 7, function (yy) { return bx2 - 2.4 * (1 - (yy - PT - 2) / 5); }, function (yy) { return bx2 + 2.4 * (1 - (yy - PT - 2) / 5); }, W[0]); tower(bx2, PT - 5, PT + 2, 2.4, 0); cone(bx2, PT - 5, 3, 9); });
    // the towers on the wall, the wall itself with its gate, and the corner towers
    tower(cx - 44, B - 40, B, 4.5, 2); cone(cx - 44, B - 40, 5.6, 17);
    tower(cx + 44, B - 38, B, 4.5, 2); cone(cx + 44, B - 38, 5.6, 16);
    R(g, cx - 64, B - 15, 128, 15, W[1]); R(g, cx - 64, B - 15, 128, HP, W[2]); R(g, cx - 64, B - 3, 128, 3, W[0]);
    for (y = B - 10; y < B - 3; y += 5) R(g, cx - 64, y, 128, HP, mix(W[1], W[0], 0.3));
    for (x = cx - 64; x < cx + 64; x += 4) { R(g, x, B - 17.5, 2.2, 2.5, W[1]); R(g, x, B - 17.5, 2.2, HP, W[2]); R(g, x + 1.7, B - 17.5, HP, 2.5, W[0]); }
    ring(g, cx, B - 8, 6, 8, W[2], B - 8); R(g, cx - 8, B - 8, 2, 8, W[2]); R(g, cx + 6, B - 8, 2, 8, W[0]);
    R(g, cx - 6, B - 8, 12, 8, P.door); disc(g, cx, B - 8, 6, P.door);
    if (P.glow) glow(g, cx, B - 6, 14, P.glow, 0.7);
    else { for (y = B - 11; y < B; y += 2.5) R(g, cx - 5, y, 10, HP, mix(P.door, '#000000', 0.25)); for (x = cx - 4; x < cx + 5; x += 2.5) R(g, x, B - 13, HP, 13, mix(P.door, '#000000', 0.25)); }
    R(g, cx - 1, B - 15.5, 2, 2, GD[0]); R(g, cx - 1, B - 15.5, 1, 1, GD[1]);
    tower(cx - 64, B - 28, B, 5, 1); cone(cx - 64, B - 28, 6.2, 16, P.flag);
    tower(cx + 64, B - 26, B, 5, 1); cone(cx + 64, B - 26, 6.2, 15, P.flag);
  };

  /* Main street, shared by day and night: a row of little shops in
     sugared-almond colours — white trims, awnings, a flag on each roof —
     and the carousel under its striped canopy. Its own seed, so the street
     is the same street after dark. */
  var mainStreet = function (g, hz, night) {
    var rs = BB.rng(2929), i, x, y;
    var dim = function (c, a) { return night ? mix(mix(c, '#2a2050', 0.62), hz, 0.1) : mix(c, hz, a === undefined ? 0.22 : a); };
    var WARM = '#ffd27a', B = 124;
    var FAC = ['#bfead8', '#ffc8d8', '#fff0b0', '#dcc8f4', '#ffd4b0', '#c8e4ff'], ROOF = ['#e05a6a', '#4a9ad0', '#5ab48a', '#9a6ad0'];
    var AWN = [['#ff6a8a', '#ffffff'], ['#4ab0e0', '#ffffff'], ['#ffc040', '#ffffff'], ['#8ad06a', '#ffffff']];
    var px0 = 0;
    var shop = function (x0, w, h, ci) {
      var top = B - h, fc = dim(FAC[ci % FAC.length]), sh = dim(mix(FAC[ci % FAC.length], '#7a5a8a', 0.25)), trim = dim('#ffffff', 0.15), rf = dim(ROOF[ci % ROOF.length]);
      R(g, x0, top, w, h, fc); R(g, x0 + w - 1.5, top, 1.5, h, sh);
      // the roof: a curved mansard with iron cresting, or a gable; a flag on a pole
      if (ci % 3) { span(g, top - 6, top, function (yy) { return x0 + 1 + Math.pow((top - yy) / 6, 2) * 3; }, function (yy) { return x0 + w - 1 - Math.pow((top - yy) / 6, 2) * 3; }, rf); R(g, x0 + 1, top - 2, w - 2, HP, mix(rf, '#ffffff', 0.3)); for (x = x0 + 4; x < x0 + w - 4; x += 2) R(g, x, top - 7.5, HP, 1.5, dim('#3a3a5a', 0.2)); }
      else { span(g, top - 9, top, function (yy) { return x0 + w / 2 - (yy - top + 9) / 9 * (w / 2 + 1); }, function (yy) { return x0 + w / 2 + (yy - top + 9) / 9 * (w / 2 + 1); }, rf); disc(g, x0 + w / 2, top - 4, 1.6, trim); disc(g, x0 + w / 2, top - 4, 1, dim('#7ab8e8')); }
      var fx = x0 + w / 2 + (ci % 3 ? 0 : 0), fy = top - (ci % 3 ? 7 : 10);
      R(g, fx - HP / 2, fy - 7, HP, 7, dim('#c8a050', 0.1));
      span(g, fy - 7, fy - 4, function () { return fx; }, function (yy) { return fx + 5 * (1 - Math.abs(yy - fy + 5.5) / 1.5); }, dim(AWN[(ci + 1) % 4][0], 0.1));
      // a cornice of white trims with little dentils
      R(g, x0 - 1, top, w + 2, 1.5, trim); for (x = x0; x < x0 + w; x += 2) R(g, x, top + 1.5, 1, 1, trim);
      R(g, x0 - 0.5, top + h * 0.45, w + 1, 1, trim);
      // the windows upstairs, and a bay window on the wider fronts
      for (x = x0 + 4; x < x0 + w - 5; x += 7) {
        var wy = top + 5;
        if (night) glow(g, x + 1.5, wy + 3, 6, WARM, 0.5);
        R(g, x - 0.5, wy - 0.5, 4, 7, trim); R(g, x, wy, 3, 6, night ? WARM : dim('#6a8ac8')); if (!night) R(g, x, wy, 1, 2.5, dim('#d8ecff'));
        R(g, x + 1.25, wy, HP, 6, trim);
      }
      // the shop below: a big window, a door, an awning over them
      var sy = top + h * 0.45 + 4;
      if (night) glow(g, x0 + w / 2, sy + 5, w * 0.5, WARM, 0.6);
      R(g, x0 + 2, sy, w - 10, B - sy, trim); R(g, x0 + 3, sy + 1, w - 12, B - sy - 3, night ? '#ffe2a0' : dim('#a8d4f0')); if (!night) R(g, x0 + 3, sy + 1, 2, B - sy - 3, dim('#e8f6ff'));
      for (x = x0 + 3 + (w - 12) / 3; x < x0 + w - 9; x += (w - 12) / 3) R(g, x, sy + 1, HP, B - sy - 3, trim);
      R(g, x0 + w - 7, sy + 1, 5, B - sy - 1, dim(ROOF[(ci + 2) % 4])); R(g, x0 + w - 3.5, sy + 5, HP, 1, trim);
      awning(g, x0 + 1, sy - 4, w - 2, 3, [dim(AWN[ci % 4][0], 0.15), dim(AWN[ci % 4][1], 0.15), dim('#4a3a5a')], 2.5);
      if (night) { for (x = x0; x < x0 + w; x += 3) { g.globalAlpha = 0.3; disc(g, x + 1, top - 0.5, 1.8, WARM); g.globalAlpha = 1; R(g, x + 0.5, top - 1, 1, 1, '#fff2b0'); } }
    };
    // shops up to a little plaza, which leaves the castle framed at the start
    var px = 0, ci = 0;
    while (px < 120) { var w = 26 + Math.floor(rs() * 3) * 5, h = 34 + Math.floor(rs() * 3) * 5; shop(px, w, h, ci++); px += w + 1; }
    px0 = px;
    px = 376;
    while (px < SW - 20) { w = Math.min(26 + Math.floor(rs() * 3) * 5, SW - px); h = 34 + Math.floor(rs() * 3) * 5; shop(px, w, h, ci++); px += w + 1; }
    // the carousel: a striped canopy with a gold rim of lamps, horses on brass poles
    var CX = 306, CT = 70, CR = 90, CW = 32;
    if (night) glow(g, CX, 104, 40, WARM, 0.6);
    R(g, CX - CW + 2, 116, CW * 2 - 4, 8, dim('#7a4a8a')); R(g, CX - CW, 115, CW * 2, 2.5, dim('#ffd060', 0.1)); R(g, CX - CW, 115, CW * 2, HP, dim('#fff4c0', 0.1));
    for (x = CX - CW + 2; x < CX + CW - 2; x += 4) disc(g, x + 2, 118, 1.6, dim('#ff8ab8'));
    R(g, CX - 2, CR, 4, 26, dim('#ffe080', 0.1)); R(g, CX - 2, CR, 1, 26, dim('#fff8d0', 0.1));
    [-24, -16, -8, 8, 16, 24].forEach(function (d, di) {
      R(g, CX + d - HP / 2, CR + 2, HP, 25, dim('#f0c040', 0.1));
      var hy = 104 + (di % 2) * 4, hc = dim(['#ffffff', '#ffd0e4', '#fff0c8'][di % 3], 0.12), hd = d < 0 ? 1 : -1, hx = CX + d;
      oval(g, hx, hy, 3.2, 1.6, hc); R(g, hx + hd * 2.2 - 0.6, hy - 3.2, 1.4, 2.5, hc); oval(g, hx + hd * 3, hy - 3.4, 1.4, 0.9, hc);
      R(g, hx + hd * 2.8 - 0.25, hy - 4.6, HP, 1, hc); R(g, hx - hd * 3.4, hy - 0.6, 1, 2, dim('#e8b0d0'));
      [-2, -0.8, 0.8, 2].forEach(function (lx) { R(g, hx + lx, hy + 1, HP, 2.4, hc); });
      R(g, hx - 1, hy - 1.8, 2, 1, dim('#e84a6a')); R(g, hx + hd * 3.6, hy - 3.6, HP, HP, dim('#3a2a3a'));
    });
    for (y = CT; y < CR; y += HP) {
      var k = (y - CT) / (CR - CT), hw = 3 + Math.pow(k, 0.85) * (CW - 3);
      for (var s = -6; s < 6; s++) { var x0 = CX + hw * s / 6, x1 = CX + hw * (s + 1) / 6; R(g, x0, y, x1 - x0, HP, dim(s % 2 ? '#ff7aa8' : '#fff4f8', 0.12)); }
      R(g, CX - hw, y, hw * 0.25, HP, dim('#ffffff', 0.3)); g.globalAlpha = 0.25; R(g, CX + hw * 0.55, y, hw * 0.45, HP, dim('#8a3a6a')); g.globalAlpha = 1;
    }
    R(g, CX - CW - 1, CR, CW * 2 + 2, 3, dim('#ffd060', 0.1)); R(g, CX - CW - 1, CR, CW * 2 + 2, HP, dim('#fff4c0', 0.1));
    for (x = CX - CW + 1; x < CX + CW; x += 3) { if (night) glow(g, x, CR + 1.5, 3, WARM, 0.8); R(g, x - HP, CR + 1, 1, 1, night ? '#fff6c0' : dim('#ffffff', 0.05)); }
    for (x = CX - CW; x < CX + CW; x += 4) { oval(g, x + 2, CR + 3, 2, 1.6, dim(((x - CX) / 4) % 2 ? '#ff7aa8' : '#7ac8f0', 0.12)); }
    disc(g, CX, CT - 1, 1.6, dim('#ffd060', 0.1)); R(g, CX - HP / 2, CT - 8, HP, 7, dim('#ffd060', 0.1));
    span(g, CT - 8, CT - 5, function () { return CX; }, function (yy) { return CX + 5 * (1 - Math.abs(yy - CT + 6.5) / 1.5); }, dim('#ff6a8a', 0.1));
    // a balloon seller's bunch, every colour, heaped any old how
    var BX = 352, BY = 100;
    R(g, BX - HP / 2, BY, HP, B - BY, dim('#8a6a4a'));
    [[0, 0, '#ff5a7a'], [4.5, -1.5, '#ffd040'], [-4.2, -1, '#5ac0f0'], [1.8, -5.5, '#8ad860'], [-2.6, -5.2, '#c08aff'], [6, -6, '#ff9a40'], [-6.5, -5.5, '#ff7ad0'], [0.6, -10, '#40d0c0'], [3.8, -9.4, '#ff5a7a']].forEach(function (b) {
      line(g, BX, BY, BX + b[0], BY - 6 + b[1] + 2.6, HP, dim('#e8e0f0', 0.2));
      var bc = night ? mix(b[2], '#2a2050', 0.35) : dim(b[2], 0.12);
      oval(g, BX + b[0] + 0.3, BY - 6 + b[1] + 0.3, 2.3, 2.8, mix(bc, '#4a2a5a', 0.25)); oval(g, BX + b[0], BY - 6 + b[1], 2.1, 2.6, bc); R(g, BX + b[0] - 1, BY - 6 + b[1] - 1.5, 1, 1, mix(bc, '#ffffff', 0.6));
    });
    // little round trees between, and the flower beds at the shops' feet
    [px0 + 8, 234, 368].forEach(function (tx) { R(g, tx - 0.75, 108, 1.5, 16, dim('#8a6a4a')); canopy(g, tx, 100, 7, 8, rs, [dim('#4aa058'), dim('#6ac070'), dim('#b0eca0'), dim('#e8ffd0')]); });
    // the plaza: a fountain between two lamps
    var FX = (px0 + 234) / 2 + 4;
    R(g, FX - 12, 118, 24, 6, dim('#f0e4f0')); R(g, FX - 12, 118, 24, HP, dim('#ffffff', 0.1)); R(g, FX - 11, 119.5, 22, 2, dim('#7ac8f0'));
    R(g, FX - 1, 108, 2, 10, dim('#f0e4f0')); oval(g, FX, 108, 5, 1.4, dim('#f0e4f0')); R(g, FX - 4, 107.5, 8, 1, dim('#7ac8f0'));
    // the jet, and the water falling from it in two arcs into the basin
    var WTR = night ? '#c8d8ff' : dim('#e0f6ff', 0.05);
    R(g, FX - HP / 2, 99, 1, 9, WTR);
    for (var t = 0; t <= 1; t += 0.04) [-1, 1].forEach(function (d) { R(g, FX + d * (0.5 + t * 9), 99.5 - Math.sin(t * Math.PI * 0.55) * 3 + t * t * 20, HP, HP, WTR); });
    for (i = 0; i < 6; i++) R(g, FX - 9 + i * 3.6, 117 - (i % 2), HP, HP, WTR);
    [FX - 22, FX + 22].forEach(function (lx) { R(g, lx - 0.5, 100, 1, 24, dim('#3a3a5a', 0.1)); if (night) glow(g, lx, 98.5, 10, WARM, 0.8); R(g, lx - 2, 96, 4, 4, night ? '#ffe8a0' : dim('#fff8e0', 0.1)); R(g, lx - 2.5, 95, 5, 1.2, dim('#3a3a5a', 0.1)); });
  };

  GEN.magic = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    // a happy sky: the sun, fat clouds, and the odd balloon that got away
    var far = strip(), g = far.getContext('2d');
    sun(g, 64, 22, 10, ['#fff8d8', '#fff2b8', '#fffbea']);
    for (i = 0; i < 6; i++) cloud(g, i * 86 + rnd() * 40, 12 + rnd() * 34, 0.6 + rnd() * 0.5, [mix('#e8c0e0', hz, 0.2), '#ffffff', '#ffffff']);
    [[140, 40, '#ff6a8a'], [262, 22, '#5ac0f0'], [430, 34, '#ffd040']].forEach(function (b) { line(g, b[0], b[1] + 2.4, b[0] + 1, b[1] + 8, HP, mix('#9a8aa8', hz, 0.4)); oval(g, b[0], b[1], 1.7, 2.2, mix(b[2], hz, 0.3)); R(g, b[0] - 0.8, b[1] - 1, HP, HP, '#ffffff'); });
    for (i = 0; i < 5; i++) bird(g, 300 + rnd() * 180, 20 + rnd() * 30, mix('#6a5a8a', hz, 0.4));
    L.push({ c: far, f: 0.025 });

    /* The castle on its green rise, trees round its feet, and over on a
       hill of its own a little steam train puffing round. */
    var cs = strip(), c = cs.getContext('2d');
    var hc = function (col, a) { return mix(col, hz, a === undefined ? 0.3 : a); };
    land(c, function (xx) { return 104 + Math.sin(xx * TAU * 2 + 0.3) * 3 + Math.sin(xx * TAU * 5) * 1.2; }, [hc('#6ab878', 0.45), hc('#8ad08a', 0.45), hc('#c8f0b0', 0.4)], 6);
    var TH = function (xx) { var u = (xx - 400) / 60; return 104 - 16 * Math.exp(-u * u * 1.4); };
    for (x = 320; x < 486; x += HP) { y = TH(x); R(c, x, y, HP, H - y, hc('#7ac484', 0.38)); R(c, x, y, HP, HP, hc('#d0f4b8', 0.32)); }
    drawTrain(c, 372, 94, function (col) { return hc(col, 0.3); }, false);
    castle(c, 190, 110, {
      wall: [hc('#e098b4', 0.18), hc('#f8bcd0', 0.18), hc('#ffe2ec', 0.12)], roof: [hc('#34509c', 0.2), hc('#5274c4', 0.2), hc('#8cacec', 0.15)],
      gold: [hc('#f0b830', 0.12), hc('#fff0a0', 0.1)], win: hc('#5a58a8', 0.2), glint: hc('#c8d0ff', 0.15), door: hc('#5a4a8a', 0.2), flag: hc('#ff5a8a', 0.12)
    });
    for (i = 0; i < 14; i++) { x = i < 7 ? 108 + i * 9 + rnd() * 4 : 220 + (i - 7) * 9 + rnd() * 4; if (Math.abs(x - 190) < 10) continue; canopy(c, x, 108 + rnd() * 2, 4.5 + rnd() * 2, 3.5, rnd, [hc('#4a9a5a', 0.3), hc('#6ab870', 0.3), hc('#b0e8a0', 0.25)]); }
    R(c, 186, 110, 8, H, hc('#fff0f4', 0.2));
    L.push({ c: cs, f: 0.05 });

    var ms = strip(), m = ms.getContext('2d');
    mainStreet(m, hz, false);
    L.push({ c: ms, f: 0.13 });

    // in front: flower beds in bloom along the bottom, and bunting in every colour across the top
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + Math.sin(xx * TAU * 4) * 1.5; };
    land(n, nf, ['#4a9a4a', '#6abc58', '#a8e47a'], 6);
    var FL = ['#ff6a9a', '#ffd040', '#ffffff', '#b07aff', '#ff9a50', '#7ad0ff'];
    hedge(n, nf, ['#3a8a44', '#5aac50', '#8ad46a']);
    for (i = 0; i < 150; i++) { x = rnd() * SW; y = nf(x) - 2.8 + rnd() * 4; var fc = FL[i % FL.length]; R(n, x, y, 1, 1, fc); R(n, x, y, HP, HP, mix(fc, '#ffffff', 0.6)); }
    var BT = ['#ff6a8a', '#ffd040', '#5ac0f0', '#8ad860', '#c08aff'];
    [[0, 128], [128, 256], [256, 384], [384, 512]].forEach(function (q, qi) { bunting(n, q[0], 3, q[1], 3, 10 + (qi % 2) * 2, BT, 3.2, '#8a7a9a'); });
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  // a little steam train: an engine with a tall chimney, three coaches, puffs of steam; lit up at night
  var drawTrain = function (g, x, y, tone, night) {
    var WARM = '#ffd27a';
    R(g, x - 52, y + 2, 66, 1.5, tone('#a89a8a')); R(g, x - 52, y + 2, 66, HP, tone('#e8dcc8'));
    [['#ffd040', '#e8a020'], ['#5ac0c0', '#3a9a9a'], ['#ff8ab0', '#d86a90']].forEach(function (cc, i) {
      var cx = x - 50 + i * 12;
      R(g, cx, y - 5, 10.5, 5.5, tone(cc[0])); R(g, cx + 9, y - 5, 1.5, 5.5, tone(cc[1])); R(g, cx - 0.5, y - 6, 11.5, 1.2, tone('#7a5a8a'));
      for (var wx = cx + 1.5; wx < cx + 9; wx += 2.5) { if (night) glow(g, wx + 0.75, y - 3.2, 2.5, WARM, 0.7); R(g, wx, y - 4, 1.5, 1.6, night ? '#fff0b0' : tone('#e8f6ff')); }
      disc(g, cx + 2.5, y + 1.2, 1.1, tone('#3a2a3a')); disc(g, cx + 8, y + 1.2, 1.1, tone('#3a2a3a'));
    });
    R(g, x - 13, y - 9, 6, 9.5, tone('#3aa060')); R(g, x - 14, y - 10, 8, 1.4, tone('#2a4a3a')); R(g, x - 12, y - 7.5, 3, 2.5, night ? '#fff0b0' : tone('#e8f6ff'));
    R(g, x - 7, y - 6, 12, 5, tone('#e84a4a')); R(g, x - 7, y - 6, 12, HP, tone('#ff8a7a')); R(g, x - 2, y - 6, 1, 5, tone('#ffd040')); R(g, x + 2, y - 6, 1, 5, tone('#ffd040'));
    R(g, x + 5, y - 6, 2, 5, tone('#3a2a3a')); R(g, x + 1, y - 10, 2.2, 4, tone('#3a2a3a')); R(g, x + 0.5, y - 11, 3.2, 1.2, tone('#3a2a3a')); R(g, x - 4, y - 8, 2, 2, tone('#ffd040'));
    [[-10, 2], [-3, 1.8], [3, 1.4]].forEach(function (w) { disc(g, x + w[0], y + 0.6, w[1], tone('#3a2a3a')); disc(g, x + w[0], y + 0.6, w[1] * 0.45, tone('#e84a4a')); });
    if (night) { glow(g, x + 7.5, y - 3, 6, WARM, 0.8); R(g, x + 6.5, y - 4, 1.2, 1.2, '#fff6c8'); }
    [[2, -14, 1.8], [-1, -17, 2.4], [-6, -19, 2.8], [-12, -20, 3]].forEach(function (p, i) { var sc = night ? mix('#c8c0e0', '#2a2050', 0.3) : tone('#ffffff'); disc(g, x + p[0] + 0.4, y + p[1] + 0.5, p[2], night ? mix(sc, '#2a2050', 0.3) : tone('#d8d4ec')); disc(g, x + p[0], y + p[1], p[2] * 0.92, sc); });
  };

  GEN.night = function (rnd, th) {
    var hz = th.sky[2], L = [], i, x, y;
    /* A clear night: stars, and a big moon away to the left. The sky over
       and round the castle is left open — the game sets off fireworks there. */
    var far = strip(), g = far.getContext('2d');
    stars(g, 150, 2, 92, rnd, ['#ffffff', '#ffe8ff', '#d0e0ff', '#fff4c8']);
    var MX = 52, MY = 30;
    glow(g, MX, MY, 40, '#d8c8ff', 0.6);
    disc(g, MX + 1.2, MY + 1.2, 14, '#c8b8e4'); disc(g, MX, MY, 14, '#fff6e0'); disc(g, MX - 4, MY - 4, 6.5, '#fffcf2');
    [[MX + 4, MY + 3, 3], [MX - 3, MY + 6, 2], [MX + 6, MY - 5, 1.8], [MX - 7, MY, 1.5]].forEach(function (q) { crater(g, q[0], q[1], q[2], q[2] * 0.9, ['#ece0c8', '#fff6e0', '#fffcf2']); });
    for (i = 0; i < 3; i++) streak(g, 360 + i * 50 + rnd() * 20, 76 + rnd() * 10, 40 + rnd() * 30, 1.5 + rnd(), [mix('#3a2a6a', hz, 0.3), mix('#4a3a7a', hz, 0.35), mix('#8a78c0', hz, 0.3)]);
    L.push({ c: far, f: 0.02 });

    /* The castle lit up for the night: soft spotlights reaching up from its
       feet, every window glowing, the gold tips catching the light, and the
       little train going round its hill with its windows lit. */
    var cs = strip(), c = cs.getContext('2d');
    var hc = function (col, a) { return mix(col, hz, a === undefined ? 0.3 : a); };
    land(c, function (xx) { return 104 + Math.sin(xx * TAU * 2 + 0.3) * 3 + Math.sin(xx * TAU * 5) * 1.2; }, [hc('#1c1640', 0.25), hc('#261e50', 0.25), hc('#4a3c7a', 0.25)], 6);
    var TH = function (xx) { var u = (xx - 400) / 60; return 104 - 16 * Math.exp(-u * u * 1.4); };
    for (x = 320; x < 486; x += HP) { y = TH(x); R(c, x, y, HP, H - y, hc('#221a4a', 0.22)); R(c, x, y, HP, HP, hc('#5a4a8a', 0.22)); }
    drawTrain(c, 372, 94, function (col) { return mix(mix(col, '#2a2050', 0.6), hz, 0.12); }, true);
    [[150, '#ffb0e0', -0.32], [230, '#a8c8ff', 0.3], [178, '#fff0c0', -0.08], [204, '#ffc8f0', 0.12]].forEach(function (q) { beam(c, q[0], 110, q[0] + q[2] * 90, 14, 5, 24, q[1], 0.45); });
    castle(c, 190, 110, {
      wall: [hc('#5e4684', 0.12), hc('#8a6aac', 0.12), hc('#b898d0', 0.1)], roof: [hc('#1a2058', 0.12), hc('#2a3878', 0.12), hc('#4a5ca8', 0.1)],
      gold: ['#e0b040', '#fff0a0'], win: '#ffd878', door: '#ffcf70', glow: '#ffc860', flag: hc('#ff6a9a', 0.1)
    });
    glow(c, 190, 104, 70, '#ffb0e8', 0.35);
    for (i = 0; i < 14; i++) { x = i < 7 ? 108 + i * 9 + rnd() * 4 : 220 + (i - 7) * 9 + rnd() * 4; if (Math.abs(x - 190) < 10) continue; canopy(c, x, 108 + rnd() * 2, 4.5 + rnd() * 2, 3.5, rnd, [hc('#141a38', 0.1), hc('#1e2a50', 0.1), hc('#3a5080', 0.1)]); }
    R(c, 186, 110, 8, H, hc('#6a5a8a', 0.2));
    for (i = 0; i < 9; i++) { x = 120 + i * 18; glow(c, x, 112, 4, '#ffd27a', 0.8); R(c, x - HP / 2, 111.5, 1, 1, '#fff6c8'); }
    L.push({ c: cs, f: 0.05 });

    var ms = strip(), m = ms.getContext('2d');
    mainStreet(m, hz, true);
    L.push({ c: ms, f: 0.13 });

    // in front, kept low: dark hedges and flower beds, lanterns on posts, a string of paper lanterns
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + Math.sin(xx * TAU * 4) * 1.5; };
    land(n, nf, ['#120e2c', '#1c1640', '#3a2e66'], 6);
    hedge(n, nf, ['#100c28', '#1a1640', '#2e2a5c']);
    for (i = 0; i < 70; i++) { x = rnd() * SW; y = nf(x) - 2.5 + rnd() * 4; R(n, x, y, 1, 1, ['#c88ae0', '#e8d0ff', '#8a9ae8'][i % 3]); }
    var LC = ['#ff8a6a', '#ffd060', '#ff6aa0', '#ffb050'];
    [64, 192, 320, 448].forEach(function (px, pi) {
      R(n, px - 0.75, 100, 1.5, 22, '#2a2448'); R(n, px - 0.75, 100, HP, 22, '#4a4278');
      glow(n, px, 97, 16, '#ffd27a', 0.9);
      R(n, px - 2.5, 93, 5, 1.2, '#2a2448'); R(n, px - 2, 94, 4, 5, '#ffe090'); R(n, px - 1.5, 94.5, 1.5, 2, '#fffbe0'); R(n, px - 2.5, 99, 5, 1, '#2a2448');
      var x1 = px + 128;
      line(n, px + 1, 101, x1 - 1, 101, HP, '#3a3460', 6);
      for (var t = 1; t < 8; t++) { var lx = px + 1 + (x1 - px - 2) * t / 8, ly = 101 + 6 * 4 * (t / 8) * (1 - t / 8), lc = LC[(t + pi) % 4]; glow(n, lx, ly + 2.5, 5, lc, 0.7); oval(n, lx, ly + 2.5, 1.8, 2, lc); R(n, lx - 0.5, ly + 1, 1, 0.8, '#3a3460'); R(n, lx - 0.8, ly + 1.8, HP, HP, '#fff4d0'); }
    });
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  /* ==========================================================================
     HOLIDAY! — the fourth land's five worlds: the rest of the summer in
     France. The waterpark in the pines, the surf at Hossegor, the bike ride
     round the lake, the park of castles and knights, and Saint-Malo at the
     end of the day. The same painting again, with the shapes they need.
     ========================================================================== */
  /* A leafy pad: small blobs filling a flattened ellipse, all their shadows
     first, then their bodies, then the light on the top left — canopy() at
     any size, br being the blobs' radius. c = [shade, body, light] */
  var pad = function (g, cx, cy, rw, rh, br, rnd, c) {
    var pts = [], n = Math.max(5, Math.round(rw * rh / (br * br) * 1.5));
    for (var i = 0; i < n; i++) { var a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()); pts.push([cx + Math.cos(a) * rw * d, cy + Math.sin(a) * rh * d, br * (0.7 + rnd() * 0.6)]); }
    pts.sort(function (p, q) { return p[1] - q[1]; });
    pts.forEach(function (p) { disc(g, p[0] + br * 0.25, p[1] + br * 0.45, p[2], c[0]); });
    pts.forEach(function (p) { disc(g, p[0], p[1], p[2] * 0.86, c[1]); });
    pts.forEach(function (p) { if (p[1] < cy + rh * 0.1 && p[0] < cx + rw * 0.45) disc(g, p[0] - p[2] * 0.3, p[1] - p[2] * 0.38, p[2] * 0.42, c[2]); });
  };
  /* A maritime pine, the umbrella pine of the Landes: a tall bare trunk with
     a gentle lean and a kink or two, forking near the top into a broad,
     flat-topped crown of separate pads with sky between them. s sets the
     crown (about 2.4s across). c = crown [shade, body, light], b = bark [shade, body, light] */
  var seaPine = function (g, x, ground, h, s, lean, rnd, c, b) {
    var top = ground - h, tw = Math.max(HP, s * 0.2);
    var tx = function (y) { var k = (ground - y) / h; return x + lean * h * k * k + Math.sin(k * 3.2 + x) * s * 0.07; };
    // (each row's edges snapped on their own, so the trunk's sides step cleanly rather than jitter)
    for (var y = top + s * 0.4; y < ground; y += HP) {
      var w = Math.max(HP, tw * (1 + (ground - y) / h * 0.6)), xx = tx(y), l = snap(xx - w / 2), r = Math.max(l + HP, snap(xx + w / 2));
      R(g, l, y, r - l, HP, b[1]); if (r - l > 1) { R(g, snap(xx + w * 0.1), y, r - snap(xx + w * 0.1), HP, b[0]); R(g, l, y, HP, HP, b[2]); }
    }
    var cx = tx(top + s * 0.4), n = 3 + Math.floor(rnd() * 3), pads = [];
    for (var i = 0; i < n; i++) { var u = (i / (n - 1) - 0.5) * 2; pads.push([cx + u * s * 0.92 + (rnd() - 0.5) * s * 0.25, top + Math.abs(u) * s * 0.22 + (rnd() - 0.5) * s * 0.14, s * (0.5 + rnd() * 0.18), s * (0.22 + rnd() * 0.08)]); }
    // the boughs, forking up from the trunk to each pad
    var fy = top + s * 0.75;
    if (s > 2.5) pads.forEach(function (p) { line(g, tx(fy), fy, p[0], p[1] + p[3] * 0.4, Math.max(HP, tw * 0.6), b[0]); });
    pads.forEach(function (p) { pad(g, p[0], p[1], p[2], p[3], Math.max(0.6, s * 0.16), rnd, c); });
  };
  /* A far-off umbrella pine, too small for separate pads: a thin trunk and
     a crown of three flattened lumps, lit on top. c = [shade, body, light], b = trunk */
  var farPine = function (g, x, ground, h, w, c, b) {
    var top = ground - h;
    R(g, x - HP / 2, top + 1, HP, h - 1, b);
    [[-0.34, 0.3, 0.38], [0.32, 0.4, 0.36], [0, 0, 0.46]].forEach(function (q) {
      var px = x + q[0] * w, py = top + q[1] * w * 0.3, rw = q[2] * w;
      oval(g, px + 0.3, py + 0.5, rw, rw * 0.42, c[0]); oval(g, px, py, rw * 0.9, rw * 0.36, c[1]);
      disc(g, px - rw * 0.35, py - rw * 0.2, rw * 0.3, c[1]); disc(g, px + rw * 0.25, py - rw * 0.25, rw * 0.28, c[1]);
      oval(g, px - rw * 0.3, py - rw * 0.28, rw * 0.32, rw * 0.12, c[2]);
    });
  };
  // a half-pixel line along y = f(x), drawn in runs wherever it stays level (and, given on, only where on(x))
  var hline = function (g, x0, x1, f, col, on) {
    var rs = null, ry;
    for (var x = x0; x <= x1; x += HP) {
      var y = x < x1 && (!on || on(x)) ? snap(f(x)) : null;
      if (rs !== null && y !== ry) { R(g, rs, ry, x - rs, HP, col); rs = null; }
      if (y !== null && rs === null) { rs = x; ry = y; }
    }
  };
  // a smooth path through points (Catmull-Rom), sampled about every d game pixels
  var curve = function (P, d) {
    var out = [];
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      var n = Math.max(2, Math.ceil(Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)) / d));
      for (var j = 0; j < n; j++) {
        var t = j / n, t2 = t * t, t3 = t2 * t, q = [];
        for (var a = 0; a < 2; a++) q.push(0.5 * (2 * p1[a] + (p2[a] - p0[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t3));
        out.push(q);
      }
    }
    out.push(P[P.length - 1].slice());
    return out;
  };
  /* A water slide along a path. A tube: round, its shade below, a lit stripe
     along its top, and the joints between its sections. An open slide
     (open): a channel seen from above, with the water running in it.
     c = [shade, body, light] */
  var slide = function (g, pts, r, c, open, water) {
    var i, p, jc = mix(c[1], c[0], 0.45);
    // (the shade only shows as a rim below the body, so every other point is plenty)
    pts.forEach(function (p, j) { if (!(j % 2) || j === pts.length - 1) disc(g, p[0] + r * 0.15, p[1] + r * 0.3, r, c[0]); });
    pts.forEach(function (p) { disc(g, p[0], p[1], r * 0.82, c[1]); });
    for (i = 3; i < pts.length - 3; i += open ? 1 : Math.max(4, Math.round(r * 3.2))) {
      if (open) continue;
      p = pts[i]; var q = pts[i + 2], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.sqrt(dx * dx + dy * dy) || 1;
      line(g, p[0] - dy / d * r * 0.8, p[1] + dx / d * r * 0.8, p[0] + dy / d * r * 0.8, p[1] - dx / d * r * 0.8, HP, jc);
    }
    if (open) {
      // seen from a little above: the lit rim, then the water running down the channel
      pts.forEach(function (p) { disc(g, p[0] - r * 0.1, p[1] - r * 0.5, r * 0.42, c[2]); });
      pts.forEach(function (p) { disc(g, p[0], p[1] - r * 0.2, r * 0.46, water[0]); });
      pts.forEach(function (p, j) { if (j % 9 < 2) R(g, p[0] - r * 0.2, p[1] - r * 0.4, HP, HP, water[1]); });
      return;
    }
    pts.forEach(function (p) { R(g, p[0] - r * 0.5, p[1] - r * 0.62, r * 0.5, Math.max(HP, r * 0.3), c[2]); });
  };
  /* A beach parasol: a pole, and a canopy whose gores curve away round the
     dome, scalloped along the hem, the side away from the sun in shade.
     cols = the gores' colours in turn, sh = shade colour */
  var parasol = function (g, x, ground, h, r, cols, pole, sh) {
    var top = ground - h, dh = r * 0.42, n = cols.length * 2 + 2;
    R(g, x - HP / 2, top - dh, HP, h + dh, pole);
    for (var y = 0; y < dh; y += HP) {
      var k = (y + HP) / dh, hw = r * Math.sqrt(k);
      for (var xx = -hw; xx < hw; xx += HP) {
        var gi = Math.floor((Math.asin(Math.max(-1, Math.min(1, xx / hw))) / Math.PI + 0.5) * n), col = cols[gi % cols.length];
        R(g, x + xx, top - dh + y, HP, HP, xx > hw * 0.35 ? mix(col, sh, 0.3) : xx < -hw * 0.5 && y < dh * 0.5 ? mix(col, '#ffffff', 0.3) : col);
      }
    }
    for (var s = 0; s < n; s++) { var a = -Math.PI / 2 + (s + 0.5) / n * Math.PI; disc(g, x + Math.sin(a) * r * 0.97, top, Math.max(HP, r / n * 1.3), mix(cols[s % cols.length], sh, Math.sin(a) > 0.35 ? 0.3 : 0)); }
  };

  GEN.ogliss = function (rnd, th) {
    /* The level's decks are three rows up (its top at y 104), with the
       pools sunk into them, so this world's horizon sits higher than most:
       the forest and the park are drawn as usual and lifted by UP, and what
       lies below the deck — only ever seen through the pools' water — is the
       pools' own tiled wall. */
    var hz = th.sky[2], L = [], i, j, x, y, k, UP = 11, DECK = 104;
    // a hot, clear summer sky: a high white sun, a few small clouds, and puffs sitting low over the forest
    var far = strip(), g = far.getContext('2d');
    sun(g, 58, 22, 11, ['#fffbe0', '#fff8d0', '#ffffff']);
    for (i = 0; i < 4; i++) cloud(g, 120 + i * 96 + rnd() * 40, 12 + rnd() * 24, 0.45 + rnd() * 0.3, [mix('#a8d4f4', hz, 0.15), '#ffffff', '#ffffff']);
    for (i = 0; i < 9; i++) cloud(g, i * 58 + rnd() * 30, 68 + rnd() * 4, 0.26 + rnd() * 0.16, [mix('#b4daf4', hz, 0.45), mix('#ffffff', hz, 0.2), '#ffffff']);
    L.push({ c: far, f: 0.03 });

    /* The Landes forest, flat to the horizon: row on row of pines, the far
       crowns run together into one long hazy band, the nearer ones each on
       its own tall trunk. */
    var bk = strip(), b = bk.getContext('2d');
    b.translate(0, -UP);
    var hb = function (c, a) { return mix(c, hz, a); };
    // the far rows: one long band of crowns over the shade beneath them
    for (x = 0; x < SW; x += HP) {
      y = 87 + Math.sin(x * 0.9) * 0.5 + Math.sin(x * 0.37 + 1) * 0.9 + Math.sin(x * TAU * 3) * 1.4;
      R(b, x, y, HP, 6, hb('#5e8c80', 0.66)); R(b, x, y, HP, HP, hb('#c4e2d4', 0.58)); R(b, x, y + 4, HP, H, hb('#7e9e90', 0.6));
      if (Math.sin(x * 2.7) + Math.sin(x * 1.3) > 1.1) R(b, x, y + 5, HP, 8, hb('#5a7a70', 0.62));
    }
    // the nearer pines, each on its own: dark trunks against the sunny heath, crowns touching
    var PB = [hb('#2e5e50', 0.5), hb('#4a7e62', 0.5), hb('#9cc890', 0.45)], PK = [hb('#4a3a3a', 0.45), hb('#6a5048', 0.45), hb('#a08070', 0.45)];
    R(b, 0, 99, SW, H, hb('#a4b47c', 0.5));
    for (x = rnd() * 3; x < SW; x += 6 + rnd() * 5) farPine(b, x + (rnd() - 0.5), 101 + rnd(), 13 + rnd() * 5, 10 + rnd() * 4, PB, PK[1]);
    R(b, 0, 100.5, SW, H, hb('#a8b880', 0.48)); R(b, 0, 100.5, SW, HP, hb('#dceab8', 0.42));
    mist(b, 88, 16, hz);
    L.push({ c: bk, f: 0.05 });

    /* The park: two slide towers, scaffolds of white steel with zig-zag
       stairs and a striped sunshade on top, their slides twisting down in
       yellow, pink, blue and orange to splash pools; pines and palms
       between, parasols by the water, and the wave pool full of rubber rings. */
    var md = strip(), m = md.getContext('2d');
    m.translate(0, -UP);
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.24 : a); };
    var GY = 110;
    var SL = { y: [hm('#e09a10'), hm('#ffd02a'), hm('#fff4a8')], p: [hm('#d04488'), hm('#ff74b4'), hm('#ffd0e8')], b: [hm('#2470c8'), hm('#44a4f0'), hm('#c4ecff')], o: [hm('#d86414'), hm('#ff9838'), hm('#ffdcae')] };
    var WT = [hm('#b4ecff', 0.15), hm('#ffffff', 0.05)], ST = [hm('#8c9cb0'), hm('#e4eaf0'), hm('#ffffff', 0.15), hm('#b8c4d0')];
    // the deck: pale paving, with a lawn here and there
    R(m, 0, GY, SW, H, hm('#e8ece4')); R(m, 0, GY, SW, HP, hm('#ffffff', 0.15));
    for (y = GY + 3; y < H; y += 3 + (y - GY) * 0.25) R(m, 0, y, SW, HP, hm('#d0d4cc'));
    // pines standing about the park
    var PM = [hm('#2e6a4a', 0.3), hm('#4c8a5a', 0.3), hm('#94c47a', 0.28)], BM = [hm('#6a4a3a', 0.3), hm('#94684a', 0.3), hm('#c8987a', 0.28)];
    [[152, 60], [184, 50], [242, 64], [458, 58], [498, 48]].forEach(function (q) { seaPine(m, q[0], GY + 1, q[1], q[1] * 0.17, (rnd() - 0.5) * 0.12, rnd, PM, BM); });
    var tower = function (tx, top, w, roof) {
      // the back posts and bracing, paler, then the stairs, then the front posts and the decks
      var bc = mix(ST[3], hz, 0.3);
      R(m, tx - w / 2 + 2, top, 1, GY - top, bc); R(m, tx + w / 2 - 3, top, 1, GY - top, bc);
      for (y = top + 4; y < GY - 4; y += 12) { line(m, tx - w / 2 + 1, y, tx + w / 2 - 1, y + 12, HP, bc); line(m, tx + w / 2 - 1, y, tx - w / 2 + 1, y + 12, HP, bc); }
      for (y = top + 4, k = 0; y < GY - 1; y += 12, k++) {
        var x0 = k % 2 ? tx + w / 2 - 2 : tx - w / 2 + 2, x1 = k % 2 ? tx - w / 2 + 2 : tx + w / 2 - 2;
        for (var t = 0; t < 1; t += 0.08) R(m, x0 + (x1 - x0) * t, Math.min(GY - 1, y + 12 * t), 1.5, HP, ST[2]);
        line(m, x0, y - 3, x1, Math.min(GY, y + 9), HP, ST[0]);
      }
      R(m, tx - w / 2, top, 1.5, GY - top, ST[1]); R(m, tx - w / 2, top, HP, GY - top, ST[2]); R(m, tx + w / 2 - 1.5, top, 1.5, GY - top, ST[0]);
      for (y = top + 4; y < GY - 4; y += 12) { R(m, tx - w / 2 - 0.5, y, w + 1, 1, ST[1]); R(m, tx - w / 2 - 0.5, y, w + 1, HP, ST[2]); R(m, tx - w / 2, y - 3, w, HP, ST[3]); }
      // the top deck and its striped sunshade
      R(m, tx - w / 2 - 1, top, w + 2, 1.5, ST[1]); R(m, tx - w / 2 - 1, top, w + 2, HP, ST[2]);
      R(m, tx - w / 2, top - 7, HP, 7, ST[0]); R(m, tx + w / 2 - HP, top - 7, HP, 7, ST[0]);
      span(m, top - 13, top - 6, function (yy) { return tx - (w / 2 + 2) * (yy - top + 13) / 7; }, function (yy) { return tx + (w / 2 + 2) * (yy - top + 13) / 7; }, roof[1]);
      for (y = top - 13; y < top - 6; y += HP) { var hw = (w / 2 + 2) * (y - top + 13) / 7; for (x = -hw; x < hw; x += 1) if (Math.floor((x / Math.max(1, hw) + 1) * 3) % 2) R(m, tx + x, y, 1, HP, roof[2]); R(m, tx + hw * 0.4, y, hw * 0.6, HP, mix(roof[1], roof[0], 0.5)); }
      R(m, tx - HP / 2, top - 16, HP, 3, ST[0]); span(m, top - 16, top - 14, function () { return tx; }, function (yy) { return tx + 3 * (1 - Math.abs(yy - top + 15)); }, roof[1]);
    };
    var pool = function (x0, x1, deep) {
      R(m, x0 - 1, GY - 1, x1 - x0 + 2, 1.5, hm('#ffffff', 0.1));
      for (y = GY; y < GY + deep; y += HP) R(m, x0, y, x1 - x0, HP, mix(hm('#7ad8f0'), hm('#2a9ad0'), (y - GY) / deep));
      for (i = 0; i < (x1 - x0) / 3; i++) { x = x0 + 1 + rnd() * (x1 - x0 - 4); y = GY + 1 + rnd() * (deep - 2); R(m, x, y, 1 + rnd() * 2.5, HP, hm('#dcf8ff', 0.1)); }
      R(m, x0 - 1, GY + deep, x1 - x0 + 2, 1, hm('#ffffff', 0.15));
    };
    var splash = function (sx, sy, s) {
      [[0, 0, 2.2], [-2.2, 1, 1.6], [2.4, 0.8, 1.5], [-0.8, -1.8, 1.4], [1.2, -2.2, 1]].forEach(function (q) { m.globalAlpha = 0.85; disc(m, sx + q[0] * s, sy + q[1] * s, q[2] * s, '#ffffff'); });
      m.globalAlpha = 1;
      for (i = 0; i < 6; i++) { var a = -Math.PI * (0.15 + i * 0.14); R(m, sx + Math.cos(a) * 4.5 * s, sy + Math.sin(a) * 3.5 * s, HP, HP, '#ffffff'); }
    };
    // the first tower: a blue flume curling away to the left, and a yellow tube spiralling down beside it
    var TA = 66, TAT = 46;
    pool(4, 46, 5); pool(84, 122, 5);
    slide(m, curve([[TA - 6, TAT + 2], [TA - 18, TAT + 6], [TA - 36, TAT + 10], [TA - 44, TAT + 22], [TA - 28, TAT + 34], [TA - 14, TAT + 42], [TA - 30, TAT + 52], [TA - 48, TAT + 58], [TA - 50, GY - 2]], 1), 2.4, SL.b, true, WT);
    splash(18, GY, 1);
    var HX = TA + 21, hel = [], seg = [];
    for (var a = 0; a < Math.PI * 5.2; a += 0.1) {
      var hp = [HX + Math.cos(a) * 9, TAT + 6 + a * 3.3 + Math.sin(a) * 3], si = Math.floor(a / Math.PI);
      hel.push(hp); (seg[si] = seg[si] || (si ? [hel[hel.length - 2]] : [])).push(hp);
    }
    R(m, HX - 1.5, TAT + 2, 3, GY - TAT - 2, ST[1]); R(m, HX - 1.5, TAT + 2, 1, GY - TAT - 2, ST[2]); R(m, HX + 0.5, TAT + 2, 1, GY - TAT - 2, ST[0]);
    // the spiral in half-turns: the far half of each behind its post, the near half in front
    seg.forEach(function (s, si) { if (si % 2) slide(m, s, 2.6, SL.y); });
    R(m, HX - 1.5, TAT + 2, 3, GY - TAT - 2, ST[1]); R(m, HX - 1.5, TAT + 2, 1, GY - TAT - 2, ST[2]);
    seg.forEach(function (s, si) { if (!(si % 2)) slide(m, s, 2.6, SL.y); });
    slide(m, curve([[TA + 4, TAT + 3], [HX - 3, TAT + 4], [HX + 6, TAT + 5]], 1), 2.6, SL.y);
    slide(m, curve([hel[hel.length - 1], [HX + 4, GY - 4], [HX + 12, GY - 2]], 1), 2.6, SL.y);
    splash(HX + 14, GY, 0.9);
    tower(TA, TAT, 12, [hm('#d85a2a'), hm('#ff8a4a'), hm('#ffffff', 0.1)]);

    // the big tower: a pink tube twisting out to the right, an orange raft slide sweeping left, a blue speed slide straight down
    var TB = 318, TBT = 34;
    pool(250, 296, 6); pool(340, 386, 6);
    slide(m, curve([[TB - 6, TBT + 3], [TB - 22, TBT + 10], [TB - 40, TBT + 26], [TB - 30, TBT + 44], [TB - 46, TBT + 60], [TB - 58, GY - 3]], 1), 3, SL.o, true, WT);
    splash(262, GY, 1.1);
    slide(m, curve([[TB + 6, TBT + 3], [TB + 22, TBT + 8], [TB + 34, TBT + 20], [TB + 26, TBT + 30], [TB + 16, TBT + 24], [TB + 22, TBT + 14], [TB + 40, TBT + 30], [TB + 48, TBT + 50], [TB + 36, TBT + 62], [TB + 50, GY - 4], [TB + 58, GY - 2]], 1), 2.5, SL.p);
    splash(TB + 60, GY, 0.9);
    tower(TB, TBT, 14, [hm('#2a7ad0'), hm('#4aa8f0'), hm('#ffffff', 0.1)]);
    slide(m, curve([[TB + 4, TBT + 18], [TB + 10, TBT + 22], [TB + 16, TBT + 40], [TB + 20, TBT + 60], [TB + 26, GY - 3], [TB + 34, GY - 2]], 1), 2.2, SL.b);

    // the wave pool: a sandy shallow end, rows of gentle waves, rubber rings bobbing
    var WX0 = 400, WX1 = 512 + 26;
    for (y = GY - 1; y < GY + 9; y += HP) { k = (y - GY + 1) / 10; R(m, WX0 + (1 - k) * 6, y, WX1 - WX0 - (1 - k) * 6, HP, mix(hm('#7ad8f0'), hm('#2a92c8'), k)); }
    R(m, WX0, GY - 1, 7, 1, hm('#f6e4b8'));
    for (j = 0; j < 4; j++) for (x = WX0 + 8; x < WX1; x += HP) { var wv = Math.sin((x - WX0) * 0.22 + j * 1.7); if (wv > 0.2) R(m, x, GY + j * 2.2 + wv * 0.6, HP, HP, hm('#ffffff', 0.15)); }
    var RG = [hm('#ff5a7a'), hm('#ffd030'), hm('#4ac0f0'), hm('#ff9a3a'), hm('#8ad860')];
    for (i = 0; i < 9; i++) { x = WX0 + 12 + i * 12 + rnd() * 6; y = GY + 1.5 + rnd() * 5; ring(m, x, y, 0.6, 1.6, RG[i % RG.length]); R(m, x - 1, y - 1, 1, HP, '#ffffff'); if (rnd() > 0.4) disc(m, x + 3, y - 0.5, 0.8, hm('#c87a5a')); }
    // palms and parasols round the pools
    var PP = [hm('#2e8a4a'), hm('#4cae58'), hm('#9ae07a'), hm('#a07a52'), hm('#7a5a3a')];
    [[132, 26, 0.12], [208, 22, -0.1], [230, 28, 0.1], [396, 24, -0.12], [440, 30, 0.08]].forEach(function (q) { palm(m, q[0], GY + 1, q[1], q[2], PP); });
    var PC = [[hm('#ff5a6a'), hm('#ffffff', 0.1)], [hm('#ffb020'), hm('#ffffff', 0.1)], [hm('#3a9ae8'), hm('#ffffff', 0.1)], [hm('#ff74b4'), hm('#fff4a0')]];
    [128, 140, 196, 216, 302, 410, 426, 476, 500].forEach(function (px, pi) { parasol(m, px + rnd() * 3, GY + 1, 7, 4.2, PC[pi % PC.length], hm('#8a8a8a'), hm('#6a4a6a')); });
    mist(m, 104, 12, hz);
    L.push({ c: md, f: 0.12 });

    /* In front: below the deck, the pools' wall — pale tiles, a band of
       darker ones at the waterline, the sun's ripples playing over them (no
       stripe lower down, which could pass for a ledge) — and along the deck's
       far edge, tropical planting: leafy mounds, big leaves standing up out
       of them, hibiscus in flower, the splash pad's jets arching over. */
    var nr = strip(), n = nr.getContext('2d');
    R(n, 0, DECK - 1, SW, H, '#8adcec');
    for (y = DECK + 3; y < H; y += 4) R(n, 0, y, SW, HP, '#c8f2f8');
    for (y = DECK - 1, j = 0; y < H; y += 4, j++) for (x = (j % 2) * 2; x < SW; x += 4) R(n, x, y, HP, 4, '#c0eef6');
    R(n, 0, DECK + 1, SW, 2.5, '#3a8cc8'); R(n, 0, DECK + 1, SW, HP, '#6ab8e4');
    for (j = 0; j < 7; j++) { var cy0 = DECK + 3 + j * 5.5; hline(n, 0, SW, function (xx) { return cy0 + Math.sin(xx * 0.31 + j * 2) * 1.2 + Math.sin(xx * 0.13 + j) * 0.8; }, '#e8fcff', function (xx) { return Math.sin(xx * 0.47 + j * 1.3) > -0.1; }); }
    var nf = function (xx) { return DECK + 1 + Math.sin(xx * TAU * 3 + 1) * 1 + Math.sin(xx * TAU * 7) * 0.6; };
    var LF = ['#1e6a34', '#3a944a', '#7ccc6a', '#a8e890'], BU = ['#22703a', '#3e9446', '#86cc66'];
    for (i = 0; i < 5; i++) { x = i * 102 + 20 + rnd() * 40; leaf(n, x, nf(x), -Math.PI / 2 - 0.5 + rnd() * 0.3, 13 + rnd() * 4, 2.2, LF); leaf(n, x + 1, nf(x), -Math.PI / 2 + 0.25 + rnd() * 0.3, 11 + rnd() * 4, 2, LF); }
    for (x = 0; x < SW; x += 10 + rnd() * 5) pad(n, x, nf(x) - 2, 7 + rnd() * 3, 2.6, 2, rnd, BU);
    var HB = [['#e8304a', '#ff7a8a'], ['#ff6aa8', '#ffc4e0'], ['#ffa818', '#ffe27a'], ['#ff5a3a', '#ffa888']];
    for (i = 0; i < 46; i++) { x = rnd() * SW; y = nf(x) - 2.5 - rnd() * 3; var hc = HB[i % HB.length]; disc(n, x, y, 1.1, hc[0]); disc(n, x - 0.35, y - 0.35, 0.5, hc[1]); R(n, x, y, HP, HP, '#fff4a0'); }
    // the jets: arcs of water, every drop catching the light
    [[132, 1], [388, -1]].forEach(function (q) {
      for (var jj = 0; jj < 3; jj++) for (var t = 0; t <= 1; t += 0.02) {
        var jx = q[0] + q[1] * (t * (18 + jj * 6)), jy = nf(q[0]) - 2 - Math.sin(t * Math.PI) * (12 + jj * 3.5) + t * 2;
        n.globalAlpha = 0.55 + 0.4 * Math.sin(t * Math.PI); R(n, jx, jy, 1, 1, '#e4f8ff'); n.globalAlpha = 1; if ((t * 50) % 6 < 1) R(n, jx, jy, HP, HP, '#ffffff');
      }
    });
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  /* A line of swell rolling in, seen side on, across the whole strip: each
     wave's face shaded from the light shining through its lip down to the
     trough, and in sets along it, where it breaks, a tumble of whitewater
     with spray thrown up off the top. n waves to the strip, base is the
     troughs, amp the crests' height. C = [lip, face, trough, foam, foam shade] */
  var swell = function (g, base, amp, n, ph, C, brk, rnd) {
    var cy = function (x) { var u = x * TAU * n + ph + Math.sin(x * TAU * 3 + ph) * 0.6; return base - amp * Math.pow(0.5 + 0.5 * Math.sin(u), 1.6); };
    /* The face's colours worked out once, top to bottom, and each column
       painted in runs of one colour: the face a whole pixel at a time, the
       crest and its lit rim at the finer half-pixel. */
    var NG = amp > 10 ? 9 : 6, GC = [], foam = [], back = mix(C[1], C[2], 0.4), rim = mix(C[0], '#ffffff', 0.45), hol = mix(C[2], C[1], 0.3);
    for (var i = 0; i <= NG; i++) { var q = i / NG; GC.push(q < 0.35 ? mix(C[0], C[1], q / 0.35) : mix(C[1], C[2], (q - 0.35) / 0.65)); }
    var e = snap(Math.min(H, base + amp * 0.6)), x, y, t;
    for (x = 0; x < SW; x += 1) {
      t = Math.min(snap(cy(x)), snap(cy(x + HP)));
      var d = e - t, y0 = t + HP, ci = 0;
      for (y = t + HP; y < e; y += HP) { var c2 = Math.min(NG, Math.floor((y - t) / d * NG)); if (c2 !== ci) { g.fillStyle = GC[ci]; g.fillRect(x, y0, 1, y - y0); y0 = y; ci = c2; } }
      g.fillStyle = GC[ci]; g.fillRect(x, y0, 1, e - y0);
      if (e < H) { g.fillStyle = C[2]; g.fillRect(x, e, 1, H - e); }
    }
    for (x = 0; x < SW; x += HP) {
      t = snap(cy(x)); var sl = cy(x + 1) - cy(x - 1);
      g.fillStyle = GC[0]; g.fillRect(x, t, HP, HP * 2);
      // the back of the wave, where it slopes away from us, is a little darker
      if (sl < -0.15) { g.fillStyle = back; g.fillRect(x, t, HP, snap(Math.min(1.5, amp * 0.2))); }
      g.fillStyle = rim; g.fillRect(x, t, HP, HP);
      var b = Math.sin(x * TAU * brk[0] + brk[1]) + Math.sin(x * TAU * (brk[0] * 2 + 1) + brk[1] * 2) * 0.35;
      if (b > 0.35 && t < base - amp * 0.35) {
        var f = Math.min(1, (b - 0.35) * 2.2);
        foam.push([x, t, f]);
        // under a breaking lip, the hollow it throws its shadow into
        g.fillStyle = hol; g.fillRect(x, t + HP, HP, snap(f * amp * 0.3 + 0.5));
      }
    }
    /* the whitewater: round heaps of foam along the crest, each shaded
       beneath, streaks of it sliding down the face, and spray flung up */
    var fr = function (f) { return (0.5 + f[2] * amp * 0.26) * (0.8 + 0.2 * Math.sin(f[0] * 0.7) + 0.12 * Math.sin(f[0] * 2.3 + ph)); };
    foam.forEach(function (f, i) { if (!(i % 2)) disc(g, f[0] + 0.3, f[1] + fr(f) * 0.25, fr(f), C[4]); });
    foam.forEach(function (f, i) { if (!(i % 2)) disc(g, f[0] - 0.1, f[1] - fr(f) * 0.12, fr(f) * 0.84, C[3]); });
    foam.forEach(function (f) {
      if (rnd() < 0.12 * f[2]) { g.globalAlpha = 0.45; R(g, f[0], f[1] + fr(f) + rnd() * amp * 0.5, 1 + rnd() * 2.5, HP, C[3]); g.globalAlpha = 1; }
      if (rnd() < 0.3 * f[2]) { g.globalAlpha = 0.45 + rnd() * 0.45; R(g, f[0], f[1] - fr(f) - 0.5 - rnd() * amp * 0.45 * f[2], HP, HP, C[3]); g.globalAlpha = 1; }
    });
    return cy;
  };
  /* A surfer, tiny and far off: on a board (c[0]), in a wetsuit (c[1]), with
     a sunny face (c[2]). pose: 0 sitting astride waiting, 1 lying paddling, 2 riding, standing */
  var surfer = function (g, x, y, pose, c) {
    if (pose === 2) {
      R(g, x - 2.5, y - HP, 5.5, HP, c[0]); R(g, x - 2, y, 4.5, HP, mix(c[0], '#000000', 0.3));
      R(g, x - 1.2, y - 2.2, HP, 1.8, c[1]); R(g, x + 0.8, y - 2.2, HP, 1.8, c[1]);
      R(g, x - 0.8, y - 4.5, 1.6, 2.6, c[1]); line(g, x - 0.8, y - 4.2, x - 2.6, y - 4.8, HP, c[1]); line(g, x + 0.8, y - 4.2, x + 2.6, y - 3.8, HP, c[1]);
      disc(g, x, y - 5.4, 0.75, c[2]); R(g, x - 0.6, y - 6.1, 1.2, HP, c[1]);
    } else if (pose === 1) {
      R(g, x - 2.5, y - HP, 5.5, HP, c[0]); R(g, x - 1.5, y - 1.2, 3.5, 0.9, c[1]); disc(g, x + 2.2, y - 1.3, 0.7, c[2]);
    } else {
      R(g, x - 2.5, y - HP, 5, HP, c[0]); R(g, x - 0.7, y - 2.6, 1.4, 2.2, c[1]); disc(g, x, y - 3.3, 0.7, c[2]); R(g, x - 0.6, y - 4, 1.2, HP, c[1]);
    }
  };

  GEN.surf = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k, SEA = 86, SX = 86;
    /* A big Atlantic sky, and the ocean out to the horizon under it: lines
       of swell marching in from far away, and the sun's glitter on them. */
    var far = strip(), g = far.getContext('2d');
    sun(g, SX, 22, 10, ['#fff8d8', '#fff4c0', '#fffbea']);
    var CB = [mix('#9cc8f0', hz, 0.1), '#ffffff', '#ffffff'];
    [[182, 34, 1.15], [318, 26, 0.9], [452, 40, 1.05], [12, 50, 0.7]].forEach(function (q) { cloud(g, q[0] + rnd() * 14, q[1] + rnd() * 4, q[2], CB); });
    for (i = 0; i < 9; i++) cloud(g, i * 57 + rnd() * 30, SEA - 6 - rnd() * 3, 0.26 + rnd() * 0.16, [mix('#b4d8f2', hz, 0.45), mix('#ffffff', hz, 0.25), '#ffffff']);
    for (y = SEA; y < H; y += HP) { k = (y - SEA) / (H - SEA); R(g, 0, y, SW, HP, k < 0.25 ? mix(mix('#6ab4e8', hz, 0.4), '#3a8ed8', k / 0.25) : mix('#3a8ed8', '#1c5cb0', (k - 0.25) / 0.75)); }
    R(g, 0, SEA, SW, HP, mix('#ffffff', hz, 0.2));
    // the swell lines, closer together towards the horizon
    for (j = 0; j < 12; j++) {
      var sy = SEA + 1.5 + j * 1.1 + j * j * 0.3, sf = function (xx) { return sy + Math.sin(xx * TAU * (5 + j) + j * 1.7) * 0.3 * (1 + j * 0.2); };
      hline(g, 0, SW, sf, mix('#2a72c0', hz, Math.max(0, 0.3 - j * 0.03)));
      hline(g, 0, SW, function (xx) { return sf(xx) - HP; }, mix('#a8dcf8', hz, 0.2), function (xx) { return Math.sin(xx * 0.7 + j * 3) > 0.6; });
    }
    for (y = SEA + HP; y < H; y += HP) {
      k = (y - SEA) / (H - SEA);
      if (rnd() < 0.45) continue;
      for (j = 0; j < 1 + Math.floor(rnd() * 2); j++) { x = SX + (rnd() + rnd() - 1) * (5 + k * 26); R(g, x - 1, y, 0.5 + rnd() * (1 + k * 3), HP, rnd() > 0.35 ? '#fffbe2' : '#d8f0ff'); }
    }
    for (i = 0; i < 3; i++) boat(g, 330 + i * 60 + rnd() * 20, SEA + 0.8, 0.26 + rnd() * 0.06, [mix('#3a4a7a', hz, 0.4), mix('#ffffff', hz, 0.2), mix('#c8d8ea', hz, 0.3), mix('#4a5a7a', hz, 0.4)]);
    L.push({ c: far, f: 0.03 });

    /* The coast across the water: golden dunes furred with marram grass, a
       line of umbrella pines along the top with the forest behind, the beach
       at their foot with the lifeguards' tower and its flags, and the surf
       running up the sand. It ends in a long low tail, and then it is all sea. */
    var cs = strip(), c = cs.getContext('2d');
    var hc = function (col, a) { return mix(col, hz, a === undefined ? 0.4 : a); };
    var X0 = -30, X1 = 250, BY = 97;
    var top = function (xx) {
      var u = (xx - X0) / (X1 - X0);
      if (u <= 0 || u >= 1) return BY;
      var e = Math.min(1, u / 0.06, Math.pow((1 - u) / 0.45, 1.4));
      return BY - (19 + 5 * Math.sin(u * 9 + 0.5) + 2 * Math.sin(u * 23)) * e - 2;
    };
    // the forest behind the dunes, its crowns showing over the crest
    for (x = X0 + 8; x < X1 - 70; x += 3.5 + rnd() * 3) pad(c, x, top(x) - 1.5, 3.5 + rnd() * 2, 1.6, 0.8, rnd, [hc('#3c6a5a', 0.5), hc('#5a8a6a', 0.5), hc('#a8cc98', 0.45)]);
    // the sand: faces turned to the sun lit, those turned away in shade, wind ripples across it
    var DS = [hc('#cc9452', 0.3), hc('#efc47e', 0.3), hc('#fff0c8', 0.25), hc('#dcaa68', 0.3)], SH = [], RP = [];
    for (i = -6; i <= 6; i++) { SH.push(i > 0 ? mix(DS[1], DS[0], i / 6) : mix(DS[1], DS[2], -i / 6 * 0.7)); RP.push(mix(SH[SH.length - 1], DS[3], 0.6)); }
    for (x = X0; x < X1; x += HP) {
      y = top(x); var si = 6 + Math.max(-6, Math.min(6, Math.round((top(x + 3) - top(x - 3)) * 2)));
      R(c, x, y, HP, BY - y + 1, SH[si]);
      if (!(x % 1.5)) for (var ry = y + 3; ry < BY - 1; ry += 3.5) if (Math.sin(x * 0.8 + ry * 2.1) > 0.2) R(c, x, ry + Math.sin(x * 0.35 + ry) * 0.5, 1.5, HP, RP[si]);
      R(c, x, y, HP, HP, DS[2]);
    }
    // marram grass in tufts all over them
    var MG = [hc('#7a9a5a'), hc('#a4bc78'), hc('#5a7a4a')];
    for (i = 0; i < 190; i++) { x = X0 + 6 + rnd() * (X1 - X0 - 60); y = top(x) + rnd() * (BY - top(x) - 2); var bl = 1.2 + rnd() * 1.4; line(c, x, y, x - bl * 0.4, y - bl, HP, MG[i % 3]); line(c, x + 0.5, y, x + 0.9, y - bl * 0.8, HP, MG[(i + 1) % 3]); }
    // the umbrella pines along the top
    var PC = [hc('#2e5e4a', 0.45), hc('#4a805e', 0.45), hc('#98c486', 0.4)], PK = [hc('#5a4038', 0.45), hc('#7a5a48', 0.45), hc('#b08870', 0.4)];
    for (x = X0 + 14; x < X1 - 80; x += 9 + rnd() * 9) farPine(c, x, top(x) + 1.5, 10 + rnd() * 5, 8.5 + rnd() * 3, PC, PK[1]);
    // the beach, and the surf running up it
    R(c, X0 - 6, BY - 1, X1 - X0 + 40, 2.5, hc('#fbe8c0', 0.3)); R(c, X0 - 6, BY + 1, X1 - X0 + 40, 1, hc('#d8bc90', 0.35));
    for (x = X0 - 6; x < X1 + 34; x += HP) { if (Math.sin(x * 0.5) + Math.sin(x * 0.17) > -0.6) R(c, x, BY + 1.5 + Math.sin(x * 0.21) * 0.4, HP, HP, hc('#ffffff', 0.15)); }
    // the lifeguards' tower: a cabin on tall legs, a ladder, a red roof, flags flying beside it
    var LX = 154, LY = BY - 0.5, LW = [hc('#e8e4dc', 0.3), hc('#ffffff', 0.25)], LR = hc('#e04a3a', 0.3);
    R(c, LX - 3, LY - 10, HP, 10, hc('#8a7a6a', 0.35)); R(c, LX + 2.5, LY - 10, HP, 10, hc('#8a7a6a', 0.35)); line(c, LX - 3, LY - 9, LX + 2.5, LY - 2, HP, hc('#8a7a6a', 0.35)); line(c, LX + 2.5, LY - 9, LX - 3, LY - 2, HP, hc('#8a7a6a', 0.35));
    R(c, LX - 3.5, LY - 15, 7, 5, LW[1]); R(c, LX + 2, LY - 15, 1.5, 5, LW[0]); R(c, LX - 2.5, LY - 14, 4, 1.5, hc('#4a6a8a', 0.35));
    R(c, LX - 4.5, LY - 16.5, 9, 1.5, LR); line(c, LX + 3.5, LY - 10, LX + 7, LY, HP, hc('#8a7a6a', 0.35));
    R(c, LX - 7, LY - 22, HP, 22, hc('#c8c0b8', 0.3)); R(c, LX - 6.5, LY - 22, 4, 1.5, hc('#e83a3a', 0.25)); R(c, LX - 6.5, LY - 20.5, 4, 1.5, hc('#ffd030', 0.25));
    // a few parasols and people on the sand
    [[106, '#ff5a6a'], [124, '#ffd030'], [176, '#3a9ae8'], [196, '#ff8a3a']].forEach(function (q) { R(c, q[0], BY - 4, HP, 4, hc('#8a8a8a', 0.3)); oval(c, q[0], BY - 4, 2.4, 1.2, hc(q[1], 0.3), true); });
    for (i = 0; i < 9; i++) { x = 96 + rnd() * 120; R(c, x, BY - 1.5, HP, 1.5, hc(['#e05a4a', '#3a6ac8', '#2a2a3a', '#f0a030'][i % 4], 0.3)); R(c, x, BY - 2, HP, HP, hc('#e8b090', 0.3)); }
    mist(c, BY - 12, 12, hz);
    L.push({ c: cs, f: 0.05 });

    /* Out beyond the break: the outer line of swell rolling in, cresting
       white in sets, surfers sitting on their boards waiting for a wave and
       one riding down the face of a green one; gulls over it all. */
    var md = strip(), m = md.getContext('2d');
    var hm = function (col) { return mix(col, hz, 0.22); };
    var MC = [hm('#7ae0e0'), hm('#3a9ed8'), hm('#2a78c4'), hm('#ffffff'), hm('#c4dcf0')];
    for (y = 98; y < H; y += HP) R(m, 0, y, SW, HP, mix(hm('#4aa0dc'), hm('#2a74c0'), Math.min(1, (y - 98) / 12)));
    R(m, 0, 98, SW, HP, hm('#c8ecff'));
    var w1 = swell(m, 106, 4, 5, 0.6, MC, [3, 0.4], rnd);
    var SC = [['#ffd030', '#1e2638', '#e8a880'], ['#ff5a4a', '#22304a', '#d89878'], ['#ffffff', '#1a2030', '#f0b890'], ['#3ad0c0', '#2a2a3a', '#e0a070'], ['#ff8ab8', '#1e2a40', '#d8a080']].map(function (q) { return q.map(hm); });
    var w2 = swell(m, 115, 7.5, 4, 2.2, MC, [2, 2.6], rnd);
    // the sun glinting on the water between the rows
    for (i = 0; i < 110; i++) { x = rnd() * SW; y = 100 + rnd() * 26; m.globalAlpha = 0.3 + rnd() * 0.3; R(m, x, y, 1 + rnd() * 2.5, HP, hm('#e4f8ff')); }
    m.globalAlpha = 1;
    [[40, 0], [70, 1], [212, 0], [228, 0], [372, 1], [440, 0]].forEach(function (q, qi) { x = q[0] + rnd() * 6; surfer(m, x, w2(x) + (q[1] ? 1.6 : 2.4), q[1], SC[qi % SC.length]); });
    // the one riding: carving across the green face, a white trail behind
    x = 300; y = w2(x) + 3;
    for (k = 0; k < 16; k += HP) { m.globalAlpha = 0.8 * (1 - k / 16); R(m, x + 2 + k, y + Math.sin(k * 0.3) * 0.6 - k * 0.12, HP, HP, '#ffffff'); }
    m.globalAlpha = 1;
    surfer(m, x, y, 2, SC[2]);
    for (i = 0; i < 6; i++) gull(m, i * 85 + rnd() * 50, 30 + rnd() * 40, 0.7 + rnd() * 0.35, [hm('#ffffff'), hm('#c4d0dc'), hm('#4a5a6a')]);
    L.push({ c: md, f: 0.1 });

    /* In front: the shore break, big and close — a long wave standing up
       green with the light through it, its lip pitching white, the foam of
       the last one fizzing at its foot — blending down into the sea of the level. */
    var nr = strip(), n = nr.getContext('2d');
    var NC = ['#7ae4dc', '#38a2dc', '#2c88d0', '#ffffff', '#bcd8ec'];
    swell(n, 125, 13, 3, 4.1, NC, [2, 1.1], rnd);
    for (y = 133; y < H; y += HP) { k = Math.min(1, (y - 133) / 9); R(n, 0, y, SW, HP, mix('#2c88d0', '#1e64b0', k)); }
    // lacy foam left on the water by the last wave
    for (i = 0; i < 160; i++) { x = rnd() * SW; y = 127 + rnd() * 8; n.globalAlpha = 0.3 + rnd() * 0.35; R(n, x, y, 1 + rnd() * 4, HP, '#e8f8ff'); }
    n.globalAlpha = 1;
    L.push({ c: nr, f: 0.28 });
    return L;
  };

  /* A beach house of the Landes: white walls, the gable end to us under a
     low, wide roof of red tiles with deep eaves, the gable striped with
     red-painted timbers, shutters thrown open, a door under a little porch.
     P = { wall, roof, wood: [shade, body, light], shut, glass } */
  var villa = function (g, x, base, w, h, P) {
    var cx = x + w / 2, rh = w * 0.34, top = base - h - rh, eave = 3;
    R(g, x, base - h, w, h, P.wall[1]); R(g, x + w - 2, base - h, 2, h, P.wall[0]); R(g, x, base - h, HP, h, P.wall[2]);
    // the gable, its timbers, then the roof's two slopes over it
    span(g, top + 1, base - h, function (yy) { return cx - (yy - top) / rh * w / 2; }, function (yy) { return cx + (yy - top) / rh * w / 2; }, P.wall[1]);
    span(g, top + 1, base - h, function (yy) { return cx + (yy - top) / rh * w * 0.3; }, function (yy) { return cx + (yy - top) / rh * w / 2; }, mix(P.wall[1], P.wall[0], 0.5));
    R(g, x, base - h - 1, w, 1, P.wood[1]); R(g, cx - HP / 2, top + 2, HP, rh - 2, P.wood[1]);
    for (var k = 1; k < 3; k++) { var tx = w / 2 * k / 3; R(g, cx - tx - HP / 2, top + rh * k / 3 + 1, HP, rh * (1 - k / 3) - 1, P.wood[1]); R(g, cx + tx - HP / 2, top + rh * k / 3 + 1, HP, rh * (1 - k / 3) - 1, P.wood[0]); }
    line(g, x + 1, base - h - 1, cx - 1, top + rh * 0.45, HP, P.wood[1]); line(g, x + w - 1, base - h - 1, cx + 1, top + rh * 0.45, HP, P.wood[0]);
    for (var yy = top; yy < base - h + 0.5; yy += HP) {
      var d = (yy - top) / rh * (w / 2 + eave);
      R(g, cx - d - 1.5, yy, 2, HP, P.roof[1]); R(g, cx - d - 1.5, yy, HP, HP, P.roof[2]); R(g, cx + d - 0.5, yy, 2, HP, P.roof[0]);
    }
    R(g, cx - 1, top - HP, 2, 1, P.roof[1]);
    // windows with their shutters, and the door under its porch
    [[x + w * 0.22, base - h + 3], [x + w * 0.62, base - h + 3]].forEach(function (q) {
      R(g, q[0] - 1.5, q[1], 1.5, 4, P.shut); R(g, q[0] + 3, q[1], 1.5, 4, mix(P.shut, '#203040', 0.2));
      R(g, q[0], q[1], 3, 4, P.glass); R(g, q[0], q[1], 1, 1.5, mix(P.glass, '#ffffff', 0.6)); R(g, q[0] - 0.5, q[1] + 4, 4, HP, P.wall[2]);
    });
    var dx = x + w * 0.42;
    R(g, dx, base - 6, 3, 6, P.wood[0]); R(g, dx + HP, base - 5.5, HP, 5, P.wood[2]);
    R(g, dx - 2, base - 7.5, 7, 1, P.roof[1]); R(g, dx - 2, base - 7.5, 7, HP, P.roof[2]);
  };
  // a hydrangea in flower: a mound of leaves under round heads of blossom. c = [leaf shade, leaf, flower, flower light, flower shade]
  var hortensia = function (g, x, base, r, rnd, c) {
    oval(g, x + r * 0.1, base, r * 1.1, r * 0.75, c[0], true); oval(g, x - r * 0.05, base - HP, r, r * 0.68, c[1], true);
    for (var i = 0; i < 5; i++) {
      var a = Math.PI * (0.12 + i * 0.19), hx = x - Math.cos(a) * r * 0.62, hy = base - Math.sin(a) * r * 0.55 - r * 0.12, hr = r * (0.32 + rnd() * 0.08);
      disc(g, hx + hr * 0.2, hy + hr * 0.25, hr, c[4]); disc(g, hx, hy, hr * 0.88, c[2]);
      disc(g, hx - hr * 0.3, hy - hr * 0.3, hr * 0.4, c[3]);
      for (var k = 0; k < 4; k++) R(g, hx + (rnd() - 0.5) * hr * 1.4, hy + (rnd() - 0.5) * hr * 1.2, HP, HP, c[4]);
    }
  };
  // someone out on a bike, tiny: two wheels, the frame, the rider bent over the bars. c = [frame, top, face, wheel]
  var cyclist = function (g, x, y, s, c) {
    ring(g, x - 2.2 * s, y - 1.3 * s, 0.7 * s, 1.3 * s, c[3]); ring(g, x + 2.2 * s, y - 1.3 * s, 0.7 * s, 1.3 * s, c[3]);
    line(g, x - 2.2 * s, y - 1.3 * s, x, y - 1.4 * s, HP, c[0]); line(g, x, y - 1.4 * s, x + 1.6 * s, y - 3 * s, HP, c[0]); line(g, x - 2.2 * s, y - 1.3 * s, x - 0.6 * s, y - 3 * s, HP, c[0]); line(g, x + 2.2 * s, y - 1.3 * s, x + 1.8 * s, y - 3.4 * s, HP, c[0]);
    line(g, x - 0.6 * s, y - 3.3 * s, x + 1.4 * s, y - 5 * s, Math.max(HP, 0.9 * s), c[1]); line(g, x + 1, y - 4.6 * s, x + 1.8 * s, y - 3.4 * s, HP, c[1]);
    line(g, x - 0.4 * s, y - 3 * s, x + 0.2 * s, y - 1.6 * s, HP, mix(c[1], '#203040', 0.4));
    disc(g, x + 1.7 * s, y - 5.7 * s, 0.7 * s, c[2]);
  };

  GEN.bike = function (rnd, th) {
    /* The road is three rows up (its top at y 104), with the lake under it,
       so, as at the waterpark, the land is drawn as usual and lifted by UP,
       and below the road — seen only through the lake — is the lake itself. */
    var hz = th.sky[2], L = [], i, j, x, y, k, SEA = 90, UP = 12, ROAD = 104;
    // a sunny morning: the sun up on the left, fair-weather clouds, swifts high up
    var far = strip(), g = far.getContext('2d');
    sun(g, 72, 24, 10, ['#fff8d4', '#fff2b0', '#fffbe8']);
    for (i = 0; i < 6; i++) cloud(g, i * 86 + 30 + rnd() * 40, 12 + rnd() * 34, 0.55 + rnd() * 0.45, [mix('#a8d2f2', hz, 0.15), '#ffffff', '#ffffff']);
    for (i = 0; i < 6; i++) bird(g, 140 + rnd() * 220, 18 + rnd() * 30, mix('#3a4a6a', hz, 0.4));
    L.push({ c: far, f: 0.03 });

    /* Far off: the ocean along the horizon beyond the dunes; the lake,
       still and bright, with little white sails on it and the villas and
       pines of its far shore; and the forest running away on either side. */
    var bk = strip(), b = bk.getContext('2d');
    b.translate(0, -UP);
    var hb = function (c, a) { return mix(c, hz, a === undefined ? 0.5 : a); };
    R(b, 0, SEA, SW, 8, hb('#5aa8e0', 0.45)); R(b, 0, SEA, SW, HP, hb('#ffffff', 0.3));
    for (i = 0; i < 40; i++) R(b, rnd() * SW, SEA + 1 + rnd() * 3, 1 + rnd() * 2, HP, hb('#ffffff', 0.3));
    boat(b, 312, SEA + 0.8, 0.3, [hb('#3a4a7a', 0.45), hb('#ffffff', 0.25), hb('#c8d8ea', 0.35), hb('#4a5a7a', 0.45)]);
    land(b, function (xx) { return SEA + 3 + Math.sin(xx * TAU * 6 + 1) * 1 + Math.sin(xx * TAU * 13) * 0.5; }, [hb('#d8c09a', 0.5), hb('#f2dcb0', 0.5), hb('#fff4dc', 0.4)], 3);
    var LX0 = 20, LX1 = 250, LY = 96;
    var PB = [hb('#2e5e50'), hb('#4a7e62'), hb('#9cc890', 0.45)], PK = hb('#6a5048', 0.45), FB = [hb('#6a947a', 0.6), hb('#c4e0c8', 0.5)];
    var inLake = function (xx) { return xx > LX0 - 6 && xx < LX1 + 6; };
    // the forest, where there is no lake: one band of crowns, single pines in front of it
    for (x = 0; x < SW; x += HP) { if (inLake(x)) continue; y = 93 + Math.sin(x * TAU * 5 + 2) * 1 + Math.sin(x * 1.1) * 0.5; R(b, x, y, HP, H - y, FB[0]); R(b, x, y, HP, HP, FB[1]); }
    for (x = rnd() * 3; x < SW; x += 6 + rnd() * 7) { if (inLake(x)) continue; farPine(b, x, 102 + rnd(), 11 + rnd() * 4, 8 + rnd() * 3, PB, PK); }
    // the lake's far shore: a low line of pines, villas peeping out of them
    for (x = LX0 - 6; x < LX1 + 6; x += HP) { y = LY - 2 + Math.sin(x * 0.7) * 0.4 + Math.sin(x * 0.23) * 0.6; R(b, x, y, HP, LY - y, FB[0]); R(b, x, y, HP, HP, FB[1]); }
    for (x = LX0; x < LX1; x += 5 + rnd() * 6) farPine(b, x, LY - 1, 5 + rnd() * 2.5, 4.5 + rnd() * 2, PB, PK);
    for (i = 0; i < 8; i++) { x = LX0 + 16 + i * 27 + rnd() * 10; R(b, x - 2.5, LY - 3.5, 5, 3, hb('#ffffff', 0.35)); R(b, x - 3, LY - 4.5, 6, 1, hb('#d0583e', 0.4)); R(b, x - 1, LY - 2.5, 1, 1, hb('#5a7aa0', 0.4)); }
    // the water, with the sky in it, glints, and the sails
    for (y = LY; y < LY + 9; y += HP) R(b, LX0 - 6, y, LX1 - LX0 + 12, HP, mix(hb('#a8daf6', 0.35), hb('#5ab0e8', 0.35), (y - LY) / 9));
    R(b, LX0 - 6, LY, LX1 - LX0 + 12, HP, hb('#e8f6ff', 0.3));
    for (i = 0; i < 50; i++) R(b, LX0 + rnd() * (LX1 - LX0 - 3), LY + 1 + rnd() * 7, 1 + rnd() * 2, HP, hb('#ffffff', 0.2));
    [[60, 0.34], [118, 0.3], [170, 0.36], [214, 0.28]].forEach(function (q) { boat(b, q[0] + rnd() * 6, LY + 4 + rnd() * 2, q[1], [hb('#ffffff', 0.25), hb('#ffffff', 0.2), hb('#e0e8f0', 0.25), hb('#7a8a9a', 0.35)]); });
    // the wooded shore running down into the water at each end, so the lake has no hard edge
    span(b, LY - 2, H, function () { return LX0 - 8; }, function (yy) { return LX0 - 4 + Math.max(0, yy - LY + 2) * 1.8; }, FB[0]);
    span(b, LY - 2, H, function (yy) { return LX1 + 4 - Math.max(0, yy - LY + 2) * 1.8; }, function () { return LX1 + 8; }, FB[0]);
    for (y = LY - 2; y < LY + 9; y += HP) { R(b, LX0 - 4 + (y - LY + 2) * 1.8, y, HP, HP, FB[1]); }
    mist(b, 84, 10, hz);
    L.push({ c: bk, f: 0.055 });

    /* The pinewood, seen across its heath: tall umbrella pines near and far,
       ferns and heather, beach houses with red roofs among the trees, the
       road and the cycle path winding away into it (the family pedalling
       along one), and at the end, a boardwalk climbing the dune to the sea. */
    var md = strip(), m = md.getContext('2d');
    m.translate(0, -UP);
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.26 : a); };
    var GT = 103, RD = ROAD + UP - 103;
    var gf = function (xx) { return GT + Math.sin(xx * TAU * 2 + 0.4) * 1.2 + Math.sin(xx * TAU * 5) * 0.6; };
    land(m, gf, [hm('#6a9a44', 0.32), hm('#8ab656', 0.32), hm('#c4e490', 0.3)], 60);
    // the heath's texture, in rows that spread out as they come nearer
    for (j = 0; j < 9; j++) { var hy = GT + 2 + j * 1.6 + j * j * 0.42, hcol = hm(j % 2 ? '#7aa84c' : '#6a9a44', 0.3 - j * 0.02); hline(m, 0, SW, function (xx) { return hy + Math.sin(xx * TAU * (3 + j) + j) * (0.5 + j * 0.15); }, hcol, function (xx) { return Math.sin(xx * (0.3 + j * 0.05) + j * 2) > -0.2; }); }
    // the dune at the end, sand showing through its marram grass, sitting on the heath
    var DX = 440, dt = function (xx) { var u = (xx - DX) / 40; return gf(xx) + 3 - 20 * Math.exp(-u * u * 1.6); };
    var DC = [hm('#d8a868', 0.3), hm('#f0cc8e', 0.3), hm('#fff0cc', 0.25)];
    for (x = DX - 70; x < DX + 70; x += HP) { y = dt(x); var dg = gf(x) + 3 + (1 - Math.min(1, Math.abs(x - DX) / 70)) * 6; if (y < dg) { var sl = dt(x + 1.5) - dt(x - 1.5); R(m, x, y, HP, dg - y, sl > 0.5 ? DC[0] : DC[1]); R(m, x, y, HP, HP, DC[2]); } }
    for (i = 0; i < 90; i++) { x = DX - 50 + rnd() * 100; y = dt(x) + 0.5 + rnd() * Math.max(1, gf(x) + 6 - dt(x)); line(m, x, y, x - 0.6, y - 1.5 - rnd(), HP, hm(i % 2 ? '#7a9a5a' : '#a4bc78')); }
    // the boardwalk laid up over it: planks, short posts, a rope rail
    var BW = [hm('#9a7a5a'), hm('#c8a478'), hm('#ecd2a8')], bwy = function (xx) { return dt(xx) - 0.5; };
    for (x = DX - 54; x < DX + 54; x += HP) { y = bwy(x); R(m, x, y, HP, 1.5, BW[1]); R(m, x, y, HP, HP, BW[2]); R(m, x, y + 1.5, HP, HP, BW[0]); if (x % 1.5 === 0) R(m, x, y + HP, HP, 1, BW[0]); }
    for (x = DX - 52; x < DX + 54; x += 5) { y = bwy(x); R(m, x, y - 2.5, 0.8, 2.5, BW[0]); R(m, x, y - 2.5, HP, 2.5, BW[2]); if (x + 5 < DX + 54) line(m, x + 0.4, y - 2.2, x + 5.4, bwy(x + 5) - 2.2, HP, hm('#f4ead8'), 0.5); }
    // the pines, near and far, leaning every which way, as they grow by the sea
    var PM = [hm('#24543c', 0.24), hm('#3e7650', 0.24), hm('#8abc74', 0.22)], BM = [hm('#5a3a2e'), hm('#8a5a40'), hm('#c08a68')];
    var PF = [hm('#2e5e48', 0.4), hm('#4a7e5a', 0.4), hm('#9cc488', 0.36)], BF = [hm('#6a4a3e', 0.4), hm('#8e6650', 0.4), hm('#c09a80', 0.36)];
    var TR = [[150, 104, 44, 0.06], [212, 105, 40, -0.08], [300, 104, 46, 0.05], [378, 105, 42, -0.06], [482, 104, 40, 0.08],
      [8, 103.5, 30, -0.05], [46, 103.5, 26, 0.07], [128, 103.5, 32, -0.06], [228, 103.5, 28, 0.05], [276, 103.5, 30, -0.07], [356, 103.5, 27, 0.06], [462, 103.5, 31, -0.05],
      [24, 112, 70, 0.07], [96, 116, 82, -0.05], [252, 114, 76, 0.08], [348, 120, 92, -0.06], [404, 113, 66, 0.05]];
    var VP = function (sh) { return { wall: [hm('#d8d4cc'), hm('#fbf8f0'), hm('#ffffff', 0.1)], roof: [hm('#a83a26'), hm('#d4583a'), hm('#f08a62')], wood: [hm('#7a2a20'), hm('#a8402e'), hm('#d07050')], shut: hm(sh), glass: hm('#4a5a7a') }; };
    // the road and the cycle path, each a ribbon winding away from us, wider as it nears
    var road = function (X, ph, wd, col, edge, dash) {
      for (y = GT + 0.5; y < H; y += HP) {
        var t = Math.sqrt(Math.min(1, (y - GT) / RD)), cx = X + Math.sin(t * 4.4 + ph) * (3 + 20 * t), hw = (0.6 + wd * t) / 2;
        R(m, cx - hw - 0.5 - t, y, hw * 2 + 1 + t * 2, HP, edge); R(m, cx - hw, y, hw * 2, HP, col);
        if (dash && Math.floor(t * 22) % 2 && t < 1) R(m, cx - 0.25 - t * 0.25, y, HP + t * 0.5, HP, dash);
      }
      return function (t) { return [X + Math.sin(t * 4.4 + ph) * (3 + 20 * t), GT + t * t * RD]; };
    };
    // the far trees and houses first, then the paths, then the near trees
    TR.slice(0, 12).sort(function (a, b2) { return a[1] - b2[1]; }).forEach(function (q) { seaPine(m, q[0] + rnd() * 6, q[1], q[2], q[2] * 0.17, q[3], rnd, q[1] < 104 ? PF : PM, q[1] < 104 ? BF : BM); });
    villa(m, 176, 106, 22, 13, VP('#3a8a5a'));
    villa(m, 198, 105, 15, 9, VP('#c8402e'));
    villa(m, 324, 106, 20, 12, VP('#3a6ac0'));
    mist(m, 96, 12, hz);
    road(272, 0.6, 12, hm('#8e949e'), hm('#e8d8b0'), hm('#ffffff', 0.12));
    var cp = road(64, 2.4, 6, hm('#c8a088'), hm('#d8e0a8'));
    [[0.62, '#3a6ad0', 1], [0.7, '#e84a5a', 1.05], [0.78, '#ffc830', 0.85]].forEach(function (q) { var p = cp(q[0]); cyclist(m, p[0], p[1] + 0.5, q[2] * (0.5 + q[0] * 0.9), [hm('#4a4a5a'), hm(q[1]), hm('#f0c0a0'), hm('#2a2a3a')]); });
    // ferns and heather, bigger as they come nearer
    for (i = 0; i < 70; i++) { x = rnd() * SW; y = GT + 1 + Math.pow(rnd(), 1.4) * 24; var fs = 0.6 + (y - GT) / 14; if (x > DX - 40 && x < DX + 40) continue; pad(m, x, y, 2.4 * fs, 1.1 * fs, 0.6 + 0.35 * fs, rnd, [hm('#3e6e34'), hm('#5e9444'), hm('#9cd070')]); if (rnd() > 0.55) R(m, x - fs, y - fs, 1, 1, hm('#c87ac8')); }
    TR.slice(12).forEach(function (q) { seaPine(m, q[0] + rnd() * 6, q[1], q[2], q[2] * 0.16, q[3], rnd, PM, BM); });
    L.push({ c: md, f: 0.13 });

    /* In front: summer flowers along the far side of the road — hydrangeas
       in blue, pink and lilac, agapanthus on tall stalks — and below the
       road, the lake: green water deepening, reeds, pebbles on the bottom,
       a few little fish. */
    var nr = strip(), n = nr.getContext('2d');
    for (y = ROAD - 1; y < H; y += HP) { k = (y - ROAD + 1) / (H - ROAD + 1); R(n, 0, y, SW, HP, mix('#5ab0b8', '#246a82', Math.pow(k, 0.8))); }
    for (i = 0; i < 90; i++) { x = rnd() * SW; y = ROAD + 2 + rnd() * 26; n.globalAlpha = 0.3; R(n, x, y, 2 + rnd() * 5, HP, '#c8f0e8'); n.globalAlpha = 1; }
    for (i = 0; i < 70; i++) { x = rnd() * SW; disc(n, x, 134 + rnd() * 6, 0.8 + rnd() * 1.2, ['#5a7a6a', '#7a8a72', '#4a6a5e'][i % 3]); }
    for (i = 0; i < 26; i++) { x = rnd() * SW; var rh = 10 + rnd() * 18; for (y = 0; y < rh; y += HP) R(n, x + Math.sin(y * 0.3 + x) * 0.8, 138 - y, HP, HP, i % 2 ? '#3a8a5a' : '#4a9a5a'); }
    [[60, 118], [212, 126], [330, 114], [452, 122]].forEach(function (q) { oval(n, q[0], q[1], 2, 0.9, '#e8a050'); span(n, q[1] - 1, q[1] + 1, function (yy) { return q[0] + 1.6; }, function (yy) { return q[0] + 2.8 - Math.abs(yy - q[1]) * 0.8; }, '#e8a050'); R(n, q[0] - 1.2, q[1] - 0.3, HP, HP, '#2a2a3a'); });
    var nf = function (xx) { return ROAD + 1 + Math.sin(xx * TAU * 3) * 1 + Math.sin(xx * TAU * 8 + 1) * 0.5; };
    var HC = [['#5a7ad8', '#8aa8f4', '#c8dcff', '#4a5ab0'], ['#e86aa8', '#ff9ccc', '#ffd8ec', '#c04a88'], ['#9a7ae0', '#bca0f4', '#e4d8ff', '#7a5ab8']];
    for (i = 0; i < 9; i++) { x = i * 57 + rnd() * 24; var hc = HC[i % 3]; hortensia(n, x, nf(x) - 2, 6 + rnd() * 2, rnd, ['#2e6a2e', '#4a8a3a', hc[1], hc[2], hc[3]]); }
    for (i = 0; i < 7; i++) {
      x = i * 73 + 40 + rnd() * 20;
      for (j = 0; j < 3; j++) { var sx = x + j * 3 - 3, sh = 12 + rnd() * 6; line(n, sx, nf(sx) + 1, sx + (j - 1) * 0.8, nf(sx) - sh, HP, '#4a8a3a'); for (k = 0; k < 9; k++) { var a = k / 9 * Math.PI * 2; R(n, sx + (j - 1) * 0.8 + Math.cos(a) * 1.6, nf(sx) - sh + Math.sin(a) * 1.3, 1, 1, k % 3 ? '#6a7ae8' : '#9aa8ff'); } }
      leaf(n, x - 3, nf(x) + 1, -Math.PI * 0.85, 6, 0.9, ['#2e6a2e', '#4a8a3a', '#86c862', '#4a8a3a']); leaf(n, x + 3, nf(x) + 1, -Math.PI * 0.15, 6, 0.9, ['#2e6a2e', '#4a8a3a', '#86c862', '#4a8a3a']);
    }
    L.push({ c: nr, f: 0.3 });
    return L;
  };

  /* A bird of prey gliding, seen from below: broad wings that taper to
     fingered tips, a short fanned tail, the head just showing; bank tips
     it into its turn. c = [body, wing, tips] */
  var falcon = function (g, x, y, s, bank, c) {
    [-1, 1].forEach(function (d) {
      for (var t = 0; t <= 1; t += HP / (6 * s)) {
        // the leading edge bows forward a little, the trailing edge sweeps back to the tip
        var wx = x + d * (0.6 + t * 5.6) * s, le = y - 0.9 * s - d * bank * t * 1.6 * s + t * t * 0.8 * s, ch = s * (2.3 - t * 1.1);
        if (t > 0.8) { for (var f = 0; f < 3; f++) R(g, wx + d * f * 0.25 * s * (t - 0.8) * 5, le + f * ch * 0.36, HP, ch * 0.24, c[2]); }
        else { R(g, wx, le, HP, ch, c[1]); R(g, wx, le + ch * 0.72, HP, ch * 0.28, c[2]); }
      }
    });
    oval(g, x, y + 0.2 * s, 0.75 * s, 1.6 * s, c[0]); disc(g, x, y - 1.4 * s, 0.6 * s, c[0]);
    span(g, y + 1.2 * s, y + 3.4 * s, function (yy) { return x - 0.6 * s - (yy - y - 1.2 * s) * 0.5; }, function (yy) { return x + 0.6 * s + (yy - y - 1.2 * s) * 0.5; }, c[0]);
  };
  /* A pavilion tent for a tournament: a round tent in bold stripes under a
     tall cone, its valance cut into points, the door flap tied back, a
     pennant flying from the top. c = [stripe, stripe2, shade, pennant] */
  var pavilion = function (g, x, base, w, h, c) {
    var wall = h * 0.45, top = base - h, eb = base - wall, n = 8;
    for (var yy = eb; yy < base; yy += HP) for (var s = 0; s < n; s++) {
      var a0 = -Math.PI / 2 + s / n * Math.PI, a1 = a0 + Math.PI / n, x0 = x + Math.sin(a0) * w / 2, x1 = x + Math.sin(a1) * w / 2, col = s % 2 ? c[1] : c[0];
      R(g, x0, yy, x1 - x0, HP, s >= n * 0.7 ? mix(col, c[2], 0.35) : col);
    }
    // the door, its flap tied back, the dark inside
    span(g, eb + wall * 0.25, base, function (yy) { return x - 0.4 - (yy - eb - wall * 0.25) * 0.28; }, function (yy) { return x + 0.4 + (yy - eb - wall * 0.25) * 0.28; }, mix(c[2], '#000000', 0.35));
    line(g, x + 0.5, eb + wall * 0.25, x + wall * 0.3, base, HP, c[1]);
    // the cone, its stripes curving round, shaded on the right
    for (yy = top; yy < eb + 1; yy += HP) {
      var k = (yy - top) / (eb - top), hw = (w / 2 + 1.5) * Math.pow(k, 0.9);
      for (s = 0; s < n; s++) { var b0 = -Math.PI / 2 + s / n * Math.PI, b1 = b0 + Math.PI / n, c0 = s % 2 ? c[1] : c[0]; R(g, x + Math.sin(b0) * hw, yy, (Math.sin(b1) - Math.sin(b0)) * hw, HP, s >= n * 0.6 ? mix(c0, c[2], 0.35) : s < 2 ? mix(c0, '#ffffff', 0.18) : c0); }
    }
    // the valance: points hanging round the cone's rim
    for (var px = x - w / 2 - 1.5; px < x + w / 2 + 1.5; px += 2) span(g, eb + 0.5, eb + 2.5, function (yy) { return px + (yy - eb - 0.5) * 0.5; }, function (yy) { return px + 2 - (yy - eb - 0.5) * 0.5; }, Math.floor((px - x) / 2) % 2 ? c[0] : c[1]);
    R(g, x - HP / 2, top - 6, HP, 6, c[2]); disc(g, x, top - 6, 0.6, '#f0c040');
    span(g, top - 6, top - 3, function () { return x; }, function (yy) { return x + 6 * (1 - Math.abs(yy - top + 4.5) / 1.5) + Math.sin(yy) * 0.3; }, c[3]);
  };
  /* A half-timbered house: a stone ground floor, the upper floor jutting
     out over it, plaster between dark timbers, a steep roof; gable to us
     or side on. P = { stone, plaster: [shade, body, light], wood, roof: [shade, body, light], glass } */
  var timbered = function (g, x, base, w, h, gable, P) {
    var gh = h * 0.42, uy = base - gh, top = base - h, j = 1;
    R(g, x + j, uy, w - j * 2, gh, P.stone[1]); R(g, x + w - j - 1.5, uy, 1.5, gh, P.stone[0]); R(g, x + j, uy, HP, gh, P.stone[2]);
    R(g, x + w * 0.4, base - 5, 3, 5, P.wood); disc(g, x + w * 0.4 + 1.5, base - 5, 1.5, P.wood);
    R(g, x + 2.5, uy + 2, 2.5, 2.5, P.glass); R(g, x + w - 6, uy + 2, 2.5, 2.5, P.glass);
    // the jettied upper floor: plaster in a frame of timbers, braced on the diagonal
    R(g, x, top, w, uy - top + 0.5, P.plaster[1]); R(g, x + w - 1.5, top, 1.5, uy - top, P.plaster[0]);
    R(g, x, uy - 0.5, w, 1, P.wood); R(g, x, top, w, HP, P.wood);
    for (var tx = x; tx <= x + w; tx += w / 4) R(g, Math.min(tx, x + w - 0.8), top, 0.8, uy - top, P.wood);
    line(g, x + 0.5, uy - 0.5, x + w / 4, top + 0.5, HP, P.wood); line(g, x + w - 0.5, uy - 0.5, x + w * 0.75, top + 0.5, HP, P.wood);
    R(g, x + w * 0.4, top + 2, 2.5, 3, P.glass); R(g, x + w * 0.4, top + 2, 1, 1, mix(P.glass, '#ffffff', 0.5));
    if (gable) {
      var rh = w * 0.75;
      span(g, top - rh, top + 0.5, function (yy) { return x + w / 2 - (yy - top + rh) / rh * (w / 2 + 1.5); }, function (yy) { return x + w / 2 + (yy - top + rh) / rh * (w / 2 + 1.5); }, P.roof[1]);
      span(g, top - rh, top + 0.5, function (yy) { return x + w / 2 + (yy - top + rh) / rh * w * 0.15; }, function (yy) { return x + w / 2 + (yy - top + rh) / rh * (w / 2 + 1.5); }, P.roof[0]);
      line(g, x + w / 2, top - rh, x - 1.5, top + 0.5, HP, P.roof[2]);
    } else {
      span(g, top - w * 0.4, top + 0.5, function (yy) { return x - 1 + (top - yy) * 0.6; }, function (yy) { return x + w + 1 - (top - yy) * 0.6; }, P.roof[1]);
      R(g, x - 1 + w * 0.24, top - w * 0.4, w + 2 - w * 0.48, HP, P.roof[2]);
      for (var ry = top - w * 0.4 + 2; ry < top; ry += 2) R(g, x - 1 + (top - ry) * 0.6, ry, w + 2 - (top - ry) * 1.2, HP, P.roof[0]);
    }
  };

  GEN.puydufou = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k;
    // a fine summer's day for a tournament: the sun, big clouds, falcons circling high on the warm air
    var far = strip(), g = far.getContext('2d');
    sun(g, 82, 24, 10, ['#fff8d4', '#fff2b0', '#fffbe8']);
    for (i = 0; i < 6; i++) cloud(g, i * 85 + 40 + rnd() * 40, 14 + rnd() * 30, 0.6 + rnd() * 0.5, [mix('#b0d4f4', hz, 0.15), '#ffffff', '#ffffff']);
    [[150, 30, 1.3, 0.35], [196, 22, 1.05, -0.3], [330, 38, 1.2, 0.2]].forEach(function (q) { falcon(g, q[0], q[1], q[2], q[3], [mix('#6a4a3a', hz, 0.3), mix('#9a7658', hz, 0.3), mix('#4a3430', hz, 0.3)]); });
    L.push({ c: far, f: 0.03 });

    /* The castle on its hill across the valley, in the hedged fields and
       oak woods of the countryside round about: a curtain wall between
       round towers with pointed slate roofs, a gatehouse, the tall square
       keep behind with its flag, and long banners hung from the walls. */
    var bk = strip(), b = bk.getContext('2d');
    var hb = function (c, a) { return mix(c, hz, a === undefined ? 0.42 : a); };
    var bf = function (xx) { return 94 + Math.sin(xx * TAU * 2 + 1.2) * 4 + Math.sin(xx * TAU * 5 + 0.3) * 1.5; };
    land(b, bf, [hb('#6a9a5a', 0.5), hb('#8ab868', 0.5), hb('#c8e8a0', 0.45)], 30);
    for (j = 0; j < 6; j++) hline(b, 0, SW, function (xx) { return bf(xx) + 3 + j * 3.2 + j * j * 0.5 + Math.sin(xx * TAU * 4 + j) * 0.8; }, hb('#5a8a4a', 0.48));
    for (x = 0; x < SW; x += 9 + rnd() * 16) for (j = 0; j < 4; j++) R(b, x + Math.sin(j) * 2, bf(x) + 2 + j * 4, HP, 4, hb('#5a8a4a', 0.48));
    for (i = 0; i < 26; i++) { x = rnd() * SW; ball(b, x, bf(x) + 1 + rnd() * 10, 1.4 + rnd() * 1.4, [hb('#4a7a44', 0.48), hb('#6a9a54', 0.48), hb('#a8d080', 0.44)]); }
    var CX = 196, HB = function (xx) { var u = (xx - CX) / 50; return bf(xx) - 17 * Math.exp(-u * u * 1.5); };
    for (x = CX - 90; x < CX + 90; x += HP) { y = HB(x); if (y < bf(x) - 0.2) { R(b, x, y, HP, bf(x) - y + 3, hb('#80b060', 0.46)); R(b, x, y, HP, HP, hb('#c8e8a0', 0.42)); } }
    var ST = [hb('#a89878', 0.36), hb('#d8ccae', 0.36), hb('#fff4dc', 0.3)], SL = [hb('#4a5878', 0.38), hb('#62729a', 0.38), hb('#9aa8c8', 0.34)], CB = HB(CX) + 1;
    var crenel = function (x0, x1, yy) { for (var cx2 = x0; cx2 < x1 - 0.5; cx2 += 2) { R(b, cx2, yy - 1.2, 1.2, 1.2, ST[1]); R(b, cx2, yy - 1.2, 1.2, HP, ST[2]); } };
    var keepT = function (kx, kt, kw) { R(b, kx - kw / 2, kt, kw, CB - kt, ST[1]); R(b, kx + kw / 2 - 1.5, kt, 1.5, CB - kt, ST[0]); R(b, kx - kw / 2, kt, HP, CB - kt, ST[2]); crenel(kx - kw / 2, kx + kw / 2, kt); for (var wy = kt + 3; wy < CB - 6; wy += 6) R(b, kx - 0.5, wy, 1, 2, hb('#4a4a5a', 0.4)); };
    var round = function (rx, rt, rr, roof) {
      R(b, rx - rr, rt, rr * 2, CB - rt, ST[1]); R(b, rx + rr * 0.35, rt, rr * 0.65, CB - rt, ST[0]); R(b, rx - rr, rt, HP, CB - rt, ST[2]);
      if (roof) span(b, rt - roof, rt + 0.5, function (yy) { return rx - (rr + 0.8) * (yy - rt + roof) / roof; }, function (yy) { return rx + (rr + 0.8) * (yy - rt + roof) / roof; }, SL[1]);
      if (roof) span(b, rt - roof, rt + 0.5, function (yy) { return rx + (rr + 0.8) * (yy - rt + roof) / roof * 0.3; }, function (yy) { return rx + (rr + 0.8) * (yy - rt + roof) / roof; }, SL[0]);
      else crenel(rx - rr, rx + rr, rt);
      R(b, rx - 0.4, rt + 3, 0.8, 1.5, hb('#4a4a5a', 0.4));
    };
    var flag = function (fx, fy, col, len) { R(b, fx - HP / 2, fy - 6, HP, 6, ST[0]); span(b, fy - 6, fy - 4, function () { return fx; }, function (yy) { return fx + len * (1 - Math.abs(yy - fy + 5)) + Math.sin(yy * 2) * 0.3; }, col); };
    keepT(CX + 8, CB - 34, 12); flag(CX + 8, CB - 35.5, hb('#d83a3a', 0.25), 6);
    round(CX - 12, CB - 26, 3.2, 9); flag(CX - 12, CB - 35, hb('#2a5ab8', 0.25), 4);
    // the curtain wall, the gatehouse and the corner towers
    R(b, CX - 30, CB - 12, 60, 12, ST[1]); R(b, CX - 30, CB - 12, 60, HP, ST[2]); R(b, CX - 30, CB - 3, 60, 3, ST[0]); crenel(CX - 30, CX + 30, CB - 12);
    R(b, CX - 4, CB - 16, 8, 16, ST[1]); R(b, CX + 2.5, CB - 16, 1.5, 16, ST[0]); crenel(CX - 4, CX + 4, CB - 16);
    R(b, CX - 2, CB - 6, 4, 6, hb('#5a4a3a', 0.38)); disc(b, CX, CB - 6, 2, hb('#5a4a3a', 0.38));
    round(CX - 31, CB - 20, 4, 10); round(CX + 31, CB - 18, 4, 9); flag(CX + 31, CB - 27.5, hb('#f0c040', 0.25), 4);
    // the long banners hung down the wall, each ending in a point
    [[CX - 22, '#d83a3a', '#f0c040'], [CX - 12, '#2a5ab8', '#ffffff'], [CX + 12, '#d83a3a', '#f0c040'], [CX + 22, '#2a5ab8', '#ffffff']].forEach(function (q) {
      span(b, CB - 11.5, CB - 4, function () { return q[0] - 1; }, function () { return q[0] + 1; }, hb(q[1], 0.3));
      span(b, CB - 4, CB - 2.5, function (yy) { return q[0] - 1 + (yy - CB + 4) * 0.66; }, function (yy) { return q[0] + 1 - (yy - CB + 4) * 0.66; }, hb(q[1], 0.3));
      R(b, q[0] - HP / 2, CB - 10, HP, 4, hb(q[2], 0.3));
    });
    for (i = 0; i < 16; i++) { x = CX - 60 + rnd() * 120; if (Math.abs(x - CX) < 36) continue; canopy(b, x, HB(x) + 1, 3 + rnd() * 2, 2.2, rnd, [hb('#3e6e40', 0.44), hb('#5a8a4c', 0.44), hb('#9ac478', 0.4)]); }
    mist(b, 86, 18, hz);
    L.push({ c: bk, f: 0.05 });

    /* Across the valley floor: the arena, its walls in tiers of arches with
       pennants round the rim; the old village of timbered houses round its
       little church; and the lake, with a longship drawn up on it — a dragon
       at its prow, round shields along its side, its striped sail set. */
    var md = strip(), m = md.getContext('2d');
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.26 : a); };
    var GY = 108, gf = function (xx) { return GY + Math.sin(xx * TAU * 3 + 0.5) * 1 + Math.sin(xx * TAU * 7) * 0.5; };
    // the wood behind, one long band of round crowns
    for (x = 0; x < SW; x += 5 + rnd() * 4) canopy(m, x, GY - 6 - rnd() * 3, 6 + rnd() * 3, 4, rnd, [hm('#3a6a3e', 0.36), hm('#557f48', 0.36), hm('#94bc74', 0.32)]);
    land(m, gf, [hm('#5a9040'), hm('#7aae4e'), hm('#b8e080')], 8);
    // the arena
    var AX = 84, AW = 54, AT = GY - 30, AS = [hm('#b48458'), hm('#e0b886'), hm('#fbe0b4'), hm('#7a4e34')];
    for (x = AX - AW; x < AX + AW; x += HP) {
      var u = (x - AX) / AW, e = Math.sqrt(1 - u * u), ty = AT + (1 - e) * 4, col = u > 0.55 ? AS[0] : u < -0.75 ? AS[2] : AS[1];
      R(m, x, ty, HP, gf(x) - ty + 1, col);
      // three tiers of arches, narrowing towards the curving ends
      [[ty + 3, 8], [ty + 13, 7], [ty + 22, 6]].forEach(function (tier, ti) {
        var ph2 = Math.asin(u) * 9 + ti * 0.5, fr = ph2 - Math.floor(ph2), aw = 0.55 * e;
        if (fr < aw) { var ah = tier[1] - Math.pow((fr / aw - 0.5) * 2, 2) * 2.2 * e; R(m, x, tier[0] + tier[1] - ah, HP, ah, mix(AS[3], col, 0.25 * (1 - e))); }
      });
      R(m, x, ty + 11.5, HP, 1, AS[0]); R(m, x, ty + 20.5, HP, 1, AS[0]); R(m, x, ty, HP, HP, AS[2]);
    }
    for (x = AX - AW + 4; x < AX + AW - 2; x += 8) { var pu = (x - AX) / AW, py = AT + (1 - Math.sqrt(1 - pu * pu)) * 4; R(m, x, py - 7, HP, 7, hm('#8a6a4a')); span(m, py - 7, py - 4.5, function () { return x; }, function (yy) { return x + 3.5 * (1 - Math.abs(yy - py + 5.75) / 1.25); }, hm(['#d83a3a', '#f0c040', '#2a5ab8'][Math.round(x / 8) % 3], 0.2)); }
    // the village, round its church
    var TP = { stone: [hm('#a89a84'), hm('#cfc2a8'), hm('#efe4cc')], plaster: [hm('#e0d4bc'), hm('#fbf2dc'), hm('#ffffff', 0.1)], wood: hm('#5a3a28'), roof: [hm('#7a4a34'), hm('#a46448'), hm('#d08a64')], glass: hm('#4a5070') };
    var CH = 238;
    R(m, CH - 4, GY - 26, 8, 26, TP.stone[1]); R(m, CH + 2, GY - 26, 2, 26, TP.stone[0]); R(m, CH - 4, GY - 26, HP, 26, TP.stone[2]);
    R(m, CH - 1, GY - 22, 2, 3, hm('#3a3a4a')); disc(m, CH, GY - 22, 1, hm('#3a3a4a'));
    span(m, GY - 42, GY - 25.5, function (yy) { return CH - 4.5 * (yy - GY + 42) / 16.5; }, function (yy) { return CH + 4.5 * (yy - GY + 42) / 16.5; }, hm('#5a6a88'));
    span(m, GY - 42, GY - 25.5, function (yy) { return CH + 4.5 * (yy - GY + 42) / 16.5 * 0.2; }, function (yy) { return CH + 4.5 * (yy - GY + 42) / 16.5; }, hm('#46526e'));
    R(m, CH - HP / 2, GY - 46, HP, 4, hm('#c8a050')); R(m, CH - 1.5, GY - 45, 3, HP, hm('#c8a050'));
    [[180, 16, 22, 1], [198, 14, 18, 0], [214, 15, 24, 1], [252, 14, 20, 1], [268, 18, 18, 0], [288, 13, 22, 1]].forEach(function (q) { timbered(m, q[0], gf(q[0]) + 1, q[1], q[2], q[3], TP); });
    // the lake, the longship on it, reeds along its edges
    var LX0 = 316, LX1 = 486, LY = GY - 2;
    // (each end tapers, the bank sloping down into the water)
    for (y = LY; y < LY + 9; y += HP) { var lt = (y - LY) * 1.4; R(m, LX0 + lt, y, LX1 - LX0 - lt * 2, HP, mix(hm('#8ccaf0'), hm('#3a88c8'), (y - LY) / 9)); }
    R(m, LX0 - 2, LY - HP, LX1 - LX0 + 4, HP, hm('#e8f4ff', 0.2));
    for (i = 0; i < 40; i++) R(m, LX0 + rnd() * (LX1 - LX0 - 4), LY + 1 + rnd() * 7, 1 + rnd() * 3, HP, hm('#e8f8ff', 0.15));
    var VX = 400, VY = LY + 4.5, HL = [hm('#5a3a24'), hm('#8a5a36'), hm('#b88454')];
    // its reflection, broken by ripples
    m.globalAlpha = 0.25; for (y = VY + 1; y < VY + 5; y += HP * 2) R(m, VX - 20 + Math.sin(y * 2) * 0.6, y, 40, HP, HL[0]); m.globalAlpha = 1;
    // oars dipping in, the hull, stem and stern curling up, the dragon at the prow, shields along the side
    for (x = VX - 14; x < VX + 15; x += 3.5) line(m, x, VY - 3, x - 2.5, VY + 1.2, HP, HL[2]);
    span(m, VY - 3.5, VY + 0.5, function (yy) { return VX - 22 + (yy - VY + 3.5) * 1.6; }, function (yy) { return VX + 22 - (yy - VY + 3.5) * 1.6; }, HL[1]);
    R(m, VX - 22, VY - 3.5, 44, HP, HL[2]); R(m, VX - 16, VY - 0.5, 32, 1, HL[0]);
    for (var t = 0; t < 1; t += 0.04) { var a = t * Math.PI * 0.95; R(m, VX + 21 + Math.sin(a) * 3.5, VY - 3.5 - (1 - Math.cos(a)) * 4.5 - t * 3, 1.2, 1.2, HL[1]); R(m, VX - 22 - Math.sin(a) * 3, VY - 3.5 - (1 - Math.cos(a)) * 3.5 - t * 2.5, 1.2, 1.2, HL[1]); }
    disc(m, VX + 21.5, VY - 15, 1.6, hm('#3a8a4a')); R(m, VX + 22.5, VY - 15.5, 1.5, 1, hm('#3a8a4a')); R(m, VX + 21.6, VY - 15.6, HP, HP, hm('#fff4a0')); R(m, VX + 19.8, VY - 16.4, 1, 1, hm('#e84a3a'));
    disc(m, VX - 24.5, VY - 11, 1.4, HL[1]); disc(m, VX - 24.5, VY - 11, 0.6, HL[0]);
    var SH = [hm('#d83a3a'), hm('#f0c040'), hm('#2a5ab8'), hm('#ffffff', 0.15)];
    for (x = VX - 15, i = 0; x < VX + 16; x += 3.4, i++) { disc(m, x, VY - 3.4, 1.4, SH[i % 4]); disc(m, x, VY - 3.4, 0.5, hm('#8a6a3a')); }
    R(m, VX - 0.5, VY - 26, 1, 22.5, HL[0]); R(m, VX - 10, VY - 24, 20, 1, HL[0]);
    for (y = VY - 23; y < VY - 8; y += HP) { var sw2 = 9.5 + (y - VY + 23) * 0.06, bulge = Math.sin((y - VY + 23) / 15 * Math.PI) * 1.2; for (x = -sw2; x < sw2; x += 2.4) R(m, VX + x + bulge, y, Math.min(2.4, sw2 - x), HP, Math.floor((x + sw2) / 2.4) % 2 ? hm('#fff4e8', 0.15) : hm('#d83a3a', 0.2)); m.globalAlpha = 0.18; R(m, VX + sw2 * 0.4 + bulge, y, sw2 * 0.6, HP, '#4a2030'); m.globalAlpha = 1; }
    for (i = 0; i < 40; i++) { x = i < 20 ? LX0 - 2 + rnd() * 14 : LX1 - 12 + rnd() * 14; var rh2 = 2 + rnd() * 4; line(m, x, LY + 9, x + (rnd() - 0.5) * 1.5, LY + 9 - rh2, HP, hm(i % 3 ? '#5a8a3a' : '#8ab05a')); if (rnd() > 0.7) R(m, x, LY + 9 - rh2 - 1, HP, 1.5, hm('#7a5a3a')); }
    // oaks between
    [[14, 30], [160, 26], [304, 28], [500, 32]].forEach(function (q) { tree(m, q[0] + rnd() * 6, gf(q[0]) + 1, q[1], rnd, [hm('#3a6e3a'), hm('#56904a'), hm('#9ccc78')], [hm('#5a4030'), hm('#7a5a40')]); });
    mist(m, 96, 12, hz);
    L.push({ c: md, f: 0.11 });

    /* In front: the tournament field — pavilions in bold stripes with their
       pennants, banners on tall poles, the grass full of flowers. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 121 + Math.sin(xx * TAU * 2 + 2) * 1.5 + Math.sin(xx * TAU * 6) * 0.8; };
    land(n, nf, ['#3a8a34', '#5aaa44', '#9ad86a'], 6);
    [[66, 26, 30, ['#d83a3a', '#fff4e4', '#7a2a3a', '#f0c040']], [252, 22, 26, ['#2a5ab8', '#f0c040', '#1c2a5a', '#d83a3a']], [418, 28, 32, ['#3a8a4a', '#fff4e4', '#1c4a2a', '#2a5ab8']]].forEach(function (q) { pavilion(n, q[0], nf(q[0]) + 2, q[1], q[2], q[3]); });
    [[124, '#d83a3a', '#f0c040'], [316, '#2a5ab8', '#ffffff'], [486, '#f0c040', '#d83a3a']].forEach(function (q) {
      var py = nf(q[0]) + 1;
      R(n, q[0] - 0.5, py - 34, 1, 34, '#7a5a3a'); R(n, q[0] - 0.5, py - 34, HP, 34, '#a8845a'); disc(n, q[0], py - 34.5, 0.9, '#f0c040'); R(n, q[0] - 3, py - 32, 6.5, 0.8, '#7a5a3a');
      for (y = py - 31.2; y < py - 18; y += HP) { var bw = 6 * (y > py - 21 ? (py - 18 - y) / 3 : 1), wv = Math.sin(y * 0.5) * 0.4; R(n, q[0] - bw / 2 + wv, y, bw, HP, q[1]); R(n, q[0] + bw * 0.2 + wv, y, bw * 0.3, HP, mix(q[1], '#000000', 0.15)); }
      // a chevron on each, in the other colour
      for (k = 0; k < 2.2; k += HP) { var cy2 = py - 24 - k; R(n, q[0] - 2.4 + k + Math.sin(cy2 * 0.5) * 0.4, cy2, 1.2, HP, q[2]); R(n, q[0] + 1.2 - k + Math.sin(cy2 * 0.5) * 0.4, cy2, 1.2, HP, q[2]); }
    });
    for (i = 0; i < 60; i++) { x = rnd() * SW; y = nf(x) + 1 + rnd() * 4; var fc = ['#ffffff', '#ffd040', '#ff6a8a', '#b07aff'][i % 4]; R(n, x, y, 1, 1, fc); }
    L.push({ c: nr, f: 0.28 });
    return L;
  };

  /* A rock of granite rising out of the sea or the sand: a heap of rounded
     boulders, warm where the low sun catches them on the left, cool in
     shade on the right, weed dark round the foot. c = [shade, body, light, weed] */
  var granite = function (g, x, base, w, h, rnd, c) {
    // boulders of all sizes, the biggest near the middle, jostling and overlapping
    var n = Math.max(3, Math.round(w / Math.max(2, h * 0.8))), bs = [];
    for (var i = 0; i < n; i++) {
      var u = (i + rnd() * 0.6 - 0.3) / (n - 1) - 0.5, k = Math.cos(u * 2.8) * (0.55 + rnd() * 0.5);
      bs.push([x + u * w * 0.9, Math.max(0.3, k) * h, w / n * (0.8 + rnd() * 0.7), rnd()]);
    }
    bs.sort(function (p, q) { return p[1] - q[1]; });
    bs.forEach(function (p) {
      var rx = p[2] * 0.62, ry = p[1], tilt = (p[3] - 0.5) * 0.6;
      span(g, base - ry, base, function (yy) { var t = (base - yy) / ry; return p[0] - rx * Math.sqrt(1 - t * t) * (1 - tilt * t); }, function (yy) { var t = (base - yy) / ry; return p[0] + rx * Math.sqrt(1 - t * t) * (1 + tilt * t) + 0.4; }, c[0]);
      span(g, base - ry, base - HP, function (yy) { var t = (base - yy) / ry; return p[0] - rx * Math.sqrt(1 - t * t) * (1 - tilt * t); }, function (yy) { var t = (base - yy) / ry; return p[0] + rx * Math.sqrt(1 - t * t) * (1 + tilt * t) * 0.55; }, c[1]);
      // the low sun on its top left shoulder, and a crack across it
      span(g, base - ry, base - ry * 0.55, function (yy) { var t = (base - yy) / ry; return p[0] - rx * Math.sqrt(1 - t * t) * (1 - tilt * t) + 0.3; }, function (yy) { var t = (base - yy) / ry; return p[0] - rx * Math.sqrt(1 - t * t) * 0.15; }, c[2]);
      if (ry > 3 && p[3] > 0.4) line(g, p[0] - rx * 0.2, base - ry * 0.7, p[0] + rx * 0.3, base - ry * 0.35, HP, c[0]);
    });
    if (c[3]) { for (var xx = x - w * 0.5 - 1; xx < x + w * 0.5 + 1; xx += HP) { var wh = 0.8 + Math.max(0, Math.sin(xx * 1.7) + Math.sin(xx * 0.6)) * 0.7; R(g, xx, base - wh, HP, wh, c[3]); } }
  };
  /* A tall granite house of the walled town: grey stone, rows of white-
     framed windows, a steep slate roof with dormers, and tall chimney stacks
     at its ends. top is the eaves; it runs down out of sight behind the wall.
     S = stone [shade, body, light], T = slate [shade, body, light], wn = [glass, frame] */
  var malouin = function (g, x, w, top, base, S, T, wn, rnd) {
    var rh = 5 + w * 0.14 + rnd() * 2, gold = mix(wn[0], '#ffd68a', 0.75);
    R(g, x, top, w, base - top, S[1]); R(g, x + w - 1.5, top, 1.5, base - top, S[0]); R(g, x, top, HP, base - top, S[2]);
    // windows in rows, a few flashing gold where they catch the low sun
    for (var wy = top + 2.5; wy < base - 3; wy += 6) for (var wx = x + 2.5; wx < x + w - 3.5; wx += 4.5) { var gl = rnd() > 0.82; R(g, wx - HP, wy - HP, 2.5 + HP * 2, 3.5 + HP, wn[1]); R(g, wx, wy, 2.5, 3.5, gl ? gold : wn[0]); R(g, wx, wy, 1, 1.5, gl ? '#fff4d0' : mix(wn[0], '#fff4e0', 0.45)); }
    span(g, top - rh, top + 0.5, function (yy) { return x - 0.5 + (top - yy) * 0.45; }, function (yy) { return x + w + 0.5 - (top - yy) * 0.45; }, T[1]);
    for (var yy = top - rh; yy < top; yy += HP) { R(g, x - 0.5 + (top - yy) * 0.45, yy, 1, HP, T[2]); R(g, x + w - 0.5 - (top - yy) * 0.45, yy, 1, HP, T[0]); }
    for (var dx = x + 3.5; dx < x + w - 5; dx += 6.5) { R(g, dx, top - rh * 0.6, 3, rh * 0.6, S[1]); oval(g, dx + 1.5, top - rh * 0.6, 2, 1, T[1], true); R(g, dx + 0.75, top - rh * 0.45, 1.5, 2, wn[0]); }
    // chimney stacks, the stone ones the town is known for, with their pots
    [x + 1, x + w - 4].forEach(function (cx) { var ch = 4 + rnd() * 6, ct = top - rh - ch + 2; R(g, cx, ct, 3, ch + rh * 0.5, S[1]); R(g, cx + 2, ct, 1, ch + rh * 0.5, S[0]); R(g, cx, ct, HP, ch + rh * 0.5, S[2]); R(g, cx - 0.5, ct, 4, 1, S[2]); for (var p = 0; p < 2; p++) R(g, cx + 0.25 + p * 1.5, ct - 1.2, 1, 1.2, mix(S[0], '#a86a4a', 0.4)); });
  };

  GEN.stmalo = function (rnd, th) {
    var hz = th.sky[2], L = [], i, j, x, y, k, SEA = 93, SX = 66, SY = 54;
    /* The end of the afternoon: the sun lower now, gold, with a halo; long
       clouds lit from beneath, and the sea out to the horizon with the sun's
       road laid across it. One layer, so they keep together. */
    var far = strip(), g = far.getContext('2d');
    // the light warming towards the horizon as the sun goes down
    for (y = 40; y < SEA; y += 1) { g.globalAlpha = 0.3 * Math.pow((y - 40) / (SEA - 40), 1.5); R(g, 0, y, SW, 1, '#ffd8b4'); }
    g.globalAlpha = 1;
    [[3.4, 0.05], [2.6, 0.08], [1.9, 0.12], [1.4, 0.2]].forEach(function (q) { g.globalAlpha = q[1]; disc(g, SX, SY, 12 * q[0], '#fff2c8'); });
    g.globalAlpha = 1;
    disc(g, SX, SY, 12, '#ffd47a'); disc(g, SX - 0.8, SY - 0.9, 10.8, '#ffe49a'); disc(g, SX - 3.6, SY - 4, 5, '#fff6d4');
    for (i = 0; i < 9; i++) streak(g, rnd() * SW, 18 + rnd() * 52, 40 + rnd() * 80, 1.5 + rnd() * 2.5, [mix('#b8a8c0', hz, 0.2), mix('#f4dcd0', hz, 0.15), '#fff0cc'], true);
    for (i = 0; i < 4; i++) cloud(g, 150 + i * 96 + rnd() * 30, 18 + rnd() * 26, 0.55 + rnd() * 0.35, [mix('#e4c4b4', hz, 0.2), '#fffaf2', '#ffffff']);
    for (y = SEA; y < H; y += HP) { k = (y - SEA) / (H - SEA); R(g, 0, y, SW, HP, k < 0.3 ? mix(mix('#94bcd8', hz, 0.45), '#5a94c4', k / 0.3) : mix('#5a94c4', '#3a74ae', (k - 0.3) / 0.7)); }
    R(g, 0, SEA, SW, HP, mix('#fff4dc', hz, 0.2));
    for (i = 0; i < 120; i++) { x = rnd() * SW; k = Math.pow(rnd(), 1.4); y = SEA + 1 + k * (H - SEA - 2); R(g, x, y, 0.8 + k * 4 * rnd(), HP, rnd() > 0.4 ? mix('#e8f0f4', hz, 0.3) : '#3a6ea8'); }
    for (y = SEA + HP; y < H; y += HP) {
      k = (y - SEA) / (H - SEA);
      if (rnd() < 0.35) continue;
      for (j = 0; j < 1 + Math.floor(rnd() * 2); j++) { x = SX + (rnd() + rnd() - 1) * (6 + k * 26); R(g, x - 1, y, 0.6 + rnd() * (1 + k * 4), HP, rnd() > 0.3 ? '#fff0c0' : '#ffd890'); }
    }
    [[24, 0.28], [196, 0.3], [262, 0.24]].forEach(function (q) { boat(g, q[0], SEA + 0.8, q[1], [mix('#4a4a6a', hz, 0.4), mix('#fff8ec', hz, 0.2), mix('#e8d0c0', hz, 0.3), mix('#5a5a7a', hz, 0.4)]); });
    L.push({ c: far, f: 0.025 });

    /* Out in the bay: the fort on its island of granite — low walls cut in
       angles, a keep with a turret, its flag — a little tower on a rock
       beside it, boats under sail, and the far shore low and hazy. */
    var by = strip(), b = by.getContext('2d');
    var hb = function (c, a) { return mix(c, hz, a === undefined ? 0.42 : a); };
    var fs = function (xx) { var u = (xx - 340) / 170; return SEA - 7 * Math.max(0, 1 - u * u) - Math.sin(xx * 0.31) * 0.5 - Math.sin(xx * 0.09) * 1; };
    for (x = 180; x < 512; x += HP) { y = fs(x); if (y < SEA) { R(b, x, y, HP, SEA - y, hb('#9aa48a', 0.55)); R(b, x, y, HP, HP, hb('#e0e8c0', 0.5)); } }
    for (i = 0; i < 12; i++) { x = 220 + rnd() * 240; y = fs(x); R(b, x, y - 1.5, 2, 1.5, hb('#fff4e8', 0.5)); R(b, x - HP, y - 2, 3, HP, hb('#b86a5a', 0.5)); }
    var GR = [hb('#8a7c7a', 0.4), hb('#b8a698', 0.4), hb('#f4dcbc', 0.32), hb('#6a6a4a', 0.4)];
    var FX = 70;
    b.globalAlpha = 0.22; for (y = SEA + 1; y < SEA + 7; y += HP * 2) R(b, FX - 26 + Math.sin(y * 2.3) * 0.6, y, 52, HP, GR[0]); b.globalAlpha = 1;
    granite(b, FX, SEA + 1, 60, 11, rnd, GR);
    // the fort: walls leaning back as they rise, cut into angled bastions, the keep and its turret, a flag
    var FW = [hb('#8e8478', 0.36), hb('#bcb0a0', 0.36), hb('#f8e2c4', 0.3)], FT = SEA - 16, FB = SEA - 3;
    span(b, FT, FB, function (yy) { return FX - 20 - (yy - FT) * 0.3; }, function (yy) { return FX + 19 + (yy - FT) * 0.3; }, FW[1]);
    span(b, FT, FB, function (yy) { return FX + 8 + (yy - FT) * 0.15; }, function (yy) { return FX + 19 + (yy - FT) * 0.3; }, FW[0]);
    span(b, FT, FB, function (yy) { return FX - 20 - (yy - FT) * 0.3; }, function (yy) { return FX - 19 - (yy - FT) * 0.3; }, FW[2]);
    R(b, FX - 20.5, FT - 1, 40, 1, FW[2]); for (x = FX - 20; x < FX + 19; x += 2.5) R(b, x, FT - 2, 1.2, 1, FW[1]);
    [FX - 8, FX + 8].forEach(function (ex) { R(b, ex - HP / 2, FT, HP, FB - FT, FW[0]); });
    [FX - 14, FX - 2, FX + 12].forEach(function (ex) { R(b, ex, FT + 4, 1, 1.5, hb('#5a5050', 0.36)); });
    R(b, FX - 8, FT - 10, 13, 9, FW[1]); R(b, FX + 2, FT - 10, 3, 9, FW[0]); R(b, FX - 8, FT - 10, 13, HP, FW[2]);
    for (x = FX - 8; x < FX + 5; x += 2) R(b, x, FT - 11, 1, 1, FW[1]);
    R(b, FX - 6, FT - 16, 4, 6, FW[1]); R(b, FX - 3, FT - 16, 1, 6, FW[0]); oval(b, FX - 4, FT - 16, 2.6, 2.2, hb('#5a6478', 0.36), true);
    R(b, FX - 3, FT - 7, 1, 1.5, hb('#4a4a5a', 0.36)); R(b, FX + 1, FT - 7, 1, 1.5, hb('#4a4a5a', 0.36));
    R(b, FX + 3, FT - 19, HP, 9, hb('#6a6a6a', 0.3)); R(b, FX + 3.5, FT - 19, 1.4, 2.6, hb('#3a5ab8', 0.25)); R(b, FX + 4.9, FT - 19, 1.4, 2.6, hb('#ffffff', 0.2)); R(b, FX + 6.3, FT - 19, 1.4, 2.6, hb('#e04a4a', 0.25));
    // more rocks in front, so the walls stand among them
    granite(b, FX - 8, SEA + 1.5, 40, 4, rnd, GR); granite(b, FX + 20, SEA + 1.5, 20, 3, rnd, GR);
    // the rock with its little tower, and another bare one
    granite(b, 122, SEA + 1, 20, 6, rnd, GR);
    R(b, 120, SEA - 14, 4, 9, FW[1]); R(b, 122.5, SEA - 14, 1.5, 9, FW[0]); oval(b, 122, SEA - 14, 2.6, 2.4, hb('#5a6478', 0.36), true); R(b, 121.5, SEA - 11, 1, 1.5, hb('#ffe8a0', 0.2));
    granite(b, 18, SEA + 1, 14, 4, rnd, GR);
    [[60, 0.42], [214, 0.36], [300, 0.5], [420, 0.4]].forEach(function (q) { boat(b, q[0], SEA + 2.5 + q[1] * 4, q[1], [hb('#5a4a6a', 0.35), hb('#fffaf0', 0.15), hb('#f0d8c8', 0.25), hb('#5a4a6a', 0.35)]); });
    for (i = 0; i < 6; i++) gull(b, rnd() * SW, 40 + rnd() * 30, 0.5 + rnd() * 0.3, [hb('#ffffff', 0.2), hb('#d0c8d0', 0.3), hb('#5a5a6a', 0.35)]);
    L.push({ c: by, f: 0.05 });

    /* The walled city: the ramparts of grey granite rising straight out of
       the sand, a round tower at each end and a gate between; above them
       the tall stone houses under slate roofs bristling with chimneys, and
       the cathedral's spire over all. Beyond it, the harbour, and the ferry
       waiting at the quay to take everyone home. To its left the bay stays
       open, so the fort out on its island can be seen. */
    var md = strip(), m = md.getContext('2d');
    var hm = function (c, a) { return mix(c, hz, a === undefined ? 0.3 : a); };
    var WT = 92, WB = 115, X0 = 140, X1 = 334;
    var S = [hm('#7c7680'), hm('#b4a898'), hm('#f6dcb8')], T = [hm('#4a5270'), hm('#646e8e'), hm('#a8b0c8')], WN = [hm('#4a5468'), hm('#f4f0e8')];
    var SV = [S, [hm('#827c80'), hm('#b8ae9e'), hm('#f6e0c0')], [hm('#747684'), hm('#a0a2a8'), hm('#e8dcc8')]];
    // the sand and the wet shine of low tide, catching the sky and the sun
    for (y = WB - 2; y < H; y += HP) { k = (y - WB + 2) / (H - WB + 2); R(m, 0, y, SW, HP, mix(hm('#ecd4ac'), hm('#ccb48c'), k)); }
    R(m, 0, WB - 2, SW, HP, hm('#fff4dc', 0.2));
    for (i = 0; i < 90; i++) { x = rnd() * SW; y = WB + rnd() * 14; m.globalAlpha = 0.5; R(m, x, y, 2 + rnd() * 8, HP, rnd() > 0.4 ? hm('#bcd4e4') : hm('#fff0cc')); m.globalAlpha = 1; }
    // the houses, shoulder to shoulder, their heights stepping; the cathedral among them
    var CX = 214;
    for (var hx = X0 + 6; hx < X1 - 8;) { var hw = 13 + Math.floor(rnd() * 4) * 3; if (X1 - 8 - hx - hw < 12) hw = X1 - 8 - hx; malouin(m, hx, hw, 62 + Math.floor(rnd() * 5) * 3, WT + 2, SV[Math.floor(rnd() * 3)], T, WN, rnd); hx += hw; }
    R(m, CX - 6, 42, 12, 26, S[1]); R(m, CX + 3, 42, 3, 26, S[0]); R(m, CX - 6, 42, HP, 26, S[2]);
    for (y = 46; y < 64; y += 7) { R(m, CX - 3, y, 2, 5, hm('#3a3e4a')); R(m, CX + 1, y, 2, 5, hm('#3a3e4a')); disc(m, CX - 2, y, 1, hm('#3a3e4a')); disc(m, CX + 2, y, 1, hm('#3a3e4a')); }
    R(m, CX - 7, 41, 14, 1.5, S[2]); for (x = CX - 7; x < CX + 7; x += 2) R(m, x, 39.5, 1, 1.5, S[1]);
    var sp = function (yy) { return 5.2 * Math.pow((yy - 10) / 31, 1.1); };
    span(m, 10, 41, function (yy) { return CX - sp(yy); }, function (yy) { return CX + sp(yy); }, S[1]);
    span(m, 10, 41, function (yy) { return CX + sp(yy) * 0.25; }, function (yy) { return CX + sp(yy); }, S[0]);
    span(m, 10, 41, function (yy) { return CX - sp(yy); }, function (yy) { return CX - sp(yy) + 0.8; }, S[2]);
    for (y = 20; y < 39; y += 5) R(m, CX - 0.5, y, 1, 2.5, hm('#3a3e4a'));
    R(m, CX - HP / 2, 5, HP, 5, hm('#c8a050')); R(m, CX - 1.5, 6.5, 3, HP, hm('#c8a050'));
    // the ramparts: big stones in courses, the walk along the top, the weed where the tide reaches
    var SB = mix(S[1], S[0], 0.4), SJ = mix(S[1], S[0], 0.3);
    R(m, X0, WT, X1 - X0, WB - WT, S[1]); R(m, X0, WT, HP, WB - WT, S[2]);
    for (y = WT + 3, j = 0; y < WB; y += 3, j++) {
      hline(m, X0, X1, function () { return y; }, SB, function (xx) { return Math.sin(xx * 0.9 + y) > -0.7; });
      for (x = X0 + (j % 2) * 2.5 + rnd() * 1.5; x < X1; x += 4 + rnd() * 3.5) R(m, x, y, HP, 3, SJ);
    }
    // stones of other tones here and there, and the lower courses darker where the sea wets them
    for (i = 0; i < 70; i++) { x = X0 + rnd() * (X1 - X0 - 6); y = WT + 3 * Math.floor(1 + rnd() * 6) + HP; R(m, x, y, 3 + rnd() * 3, 2.5, rnd() > 0.5 ? mix(S[1], S[2], 0.3) : mix(S[1], S[0], 0.2)); }
    for (y = WB - 9; y < WB - 4; y += HP) { m.globalAlpha = 0.3 * (y - WB + 9) / 5; R(m, X0, y, X1 - X0, HP, S[0]); }
    m.globalAlpha = 1;
    R(m, X0 - 1, WT - 3, X1 - X0 + 2, 3, S[1]); R(m, X0 - 1, WT - 3, X1 - X0 + 2, HP, S[2]); R(m, X0 - 1, WT - HP, X1 - X0 + 2, HP, S[0]);
    for (x = X0 + 4; x < X1 - 3; x += 9) R(m, x, WT - 2, 1, 1.5, mix(S[1], S[0], 0.6));
    R(m, X0, WB - 4, X1 - X0, 4, mix(S[0], '#4a5a3a', 0.35)); R(m, X0, WB - 4, X1 - X0, HP, mix(S[1], '#6a7a4a', 0.3));
    var tower = function (tx, tw, top) {
      R(m, tx - tw / 2, top, tw, WB - top, S[1]); R(m, tx + tw * 0.15, top, tw * 0.35, WB - top, S[0]); R(m, tx - tw / 2, top, 1, WB - top, S[2]);
      for (y = top + 3; y < WB - 4; y += 3) R(m, tx - tw / 2, y, tw, HP, SB);
      R(m, tx - tw / 2 - 1.5, top - 4, tw + 3, 4, S[1]); R(m, tx - tw / 2 - 1.5, top - 4, tw + 3, HP, S[2]); R(m, tx + tw * 0.15, top - 4, tw * 0.35 + 1.5, 4, S[0]);
      for (x = tx - tw / 2 + 1; x < tx + tw / 2; x += 4) R(m, x, top - 3, 1, 1.5, mix(S[1], S[0], 0.7));
      R(m, tx - tw / 2, WB - 4, tw, 4, mix(S[0], '#4a5a3a', 0.35));
    };
    tower(X0, 18, WT - 6); tower(X1, 18, WT - 5);
    // the gate: a deep arch, its portcullis up, a flag over it
    var GX = 262;
    R(m, GX - 8, WT - 7, 16, WB - WT + 7, S[1]); R(m, GX + 4.5, WT - 7, 3.5, WB - WT + 7, S[0]); R(m, GX - 8, WT - 7, 1, WB - WT + 7, S[2]);
    R(m, GX - 9, WT - 9, 18, 2, S[2]); R(m, GX - 3.5, WB - 12, 7, 12, hm('#3a3a44')); disc(m, GX, WB - 12, 3.5, hm('#3a3a44'));
    for (x = GX - 3; x < GX + 3.5; x += 1.5) R(m, x, WB - 15.5, HP, 4, hm('#5a5a64'));
    R(m, GX - 0.25, WT - 17, HP, 8, hm('#8a8a8a')); R(m, GX + 0.25, WT - 17, 2, 3, hm('#3a5ab8', 0.2)); R(m, GX + 2.25, WT - 17, 2, 3, hm('#ffffff', 0.12)); R(m, GX + 4.25, WT - 17, 2, 3, hm('#e04a4a', 0.2));
    // rocks out on the sand to the left, where the bay opens
    granite(m, 44, WB, 22, 6, rnd, [hm('#76707a'), hm('#a09a98'), hm('#f0d8b8'), hm('#4e5a3a')]);
    granite(m, 96, WB, 12, 4, rnd, [hm('#76707a'), hm('#a09a98'), hm('#f0d8b8'), hm('#4e5a3a')]);
    // the harbour: the quay, masts of the boats tied up, and the ferry alongside, ready to sail
    var QX = 352, QY = 109, FC = [hm('#c8ccd4'), hm('#f4f6f8'), hm('#ffffff', 0.1)], HU = [hm('#1c2c5a'), hm('#2a4078'), hm('#4a64a0')];
    for (y = QY - 6; y < QY + 4; y += HP) { k = (y - QY + 6) / 10; R(m, QX, y, 140, HP, mix(hm('#7aa8cc'), hm('#4a80b0'), k)); }
    var FX2 = 424, FL = 84;
    span(m, QY - 14, QY, function (yy) { return FX2 - FL / 2 + Math.pow((yy - QY + 14) / 14, 2) * 4; }, function (yy) { return FX2 + FL / 2 - Math.pow((yy - QY + 14) / 14, 1.5) * 9; }, HU[1]);
    R(m, FX2 - FL / 2, QY - 14, FL, 1, HU[2]); R(m, FX2 - FL / 2 + 2, QY - 6, FL - 14, 1, hm('#e04a4a', 0.2));
    m.globalAlpha = 0.25; for (y = QY + 1; y < QY + 4; y += HP * 2) R(m, FX2 - FL / 2 + 6 + Math.sin(y * 2) * 0.6, y, FL - 16, HP, HU[0]); m.globalAlpha = 1;
    R(m, FX2 - FL / 2 + 3, QY - 26, FL - 10, 12, FC[1]); R(m, FX2 + FL / 2 - 12, QY - 26, 5, 12, FC[0]); R(m, FX2 - FL / 2 + 3, QY - 26, FL - 10, HP, FC[2]);
    R(m, FX2 - FL / 2 + 10, QY - 33, FL - 30, 7, FC[1]); R(m, FX2 - FL / 2 + 10, QY - 33, FL - 30, HP, FC[2]); R(m, FX2 + FL / 2 - 24, QY - 33, 4, 7, FC[0]);
    for (x = FX2 - FL / 2 + 6; x < FX2 + FL / 2 - 10; x += 3) R(m, x, QY - 22, 1.5, 1.5, rnd() > 0.85 ? hm('#ffd68a') : hm('#3a4a6a'));
    for (x = FX2 - FL / 2 + 13; x < FX2 + FL / 2 - 22; x += 3) R(m, x, QY - 31, 1.5, 1.2, hm('#3a4a6a'));
    R(m, FX2 - FL / 2 + 11, QY - 37, 14, 4, FC[1]); R(m, FX2 - FL / 2 + 12, QY - 36, 12, 1.5, hm('#2a3a5a'));
    R(m, FX2 + 4, QY - 44, 7, 11, hm('#2a4078')); R(m, FX2 + 4, QY - 44, 7, 2, hm('#e04a4a', 0.2)); R(m, FX2 + 4, QY - 44, 1.5, 11, hm('#4a64a0'));
    disc(m, FX2 + 7, QY - 48, 2.2, hm('#ffffff', 0.35)); disc(m, FX2 + 10, QY - 52, 2.8, hm('#ffffff', 0.4)); disc(m, FX2 + 14, QY - 55, 3.2, hm('#ffffff', 0.45));
    [FX2 - 30, FX2 + 24].forEach(function (lx) { R(m, lx, QY - 24.5, 8, 2.5, hm('#f08030')); R(m, lx, QY - 24.5, 8, HP, hm('#ffb070')); });
    R(m, QX - 4, QY - 3, 14, 6, S[1]); R(m, QX - 4, QY - 3, 14, HP, S[2]); R(m, QX + 7, QY - 3, 3, 6, S[0]);
    R(m, 474, QY - 3, 18, 6, S[1]); R(m, 474, QY - 3, 18, HP, S[2]);
    [[356, 30], [362, 26], [480, 24], [488, 28]].forEach(function (q) { R(m, q[0], QY - q[1], HP, q[1] - 2, hm('#d8d0c8')); line(m, q[0] + 0.25, QY - q[1], q[0] + 5, QY - 4, HP, hm('#c8c0b8')); });
    L.push({ c: md, f: 0.11 });

    /* In front: the beach at low tide — wet sand holding the sky, ripples,
       pools among weedy granite boulders, and the rows of old oak posts that
       break the winter waves, a gull on one of them. */
    var nr = strip(), n = nr.getContext('2d');
    var nf = function (xx) { return 120 + Math.sin(xx * TAU * 2 + 1) * 1.2 + Math.sin(xx * TAU * 5) * 0.6; };
    land(n, nf, ['#c8a478', '#e8c898', '#fff0d0'], 3);
    for (y = 124; y < H; y += 2.5) hline(n, 0, SW, function (xx) { return y + Math.sin(xx * 0.4 + y) * 0.4; }, '#d4b488', function (xx) { return Math.sin(xx * 0.21 + y * 1.3) > -0.3; });
    for (i = 0; i < 7; i++) { x = i * 73 + rnd() * 30; var pw = 10 + rnd() * 14; for (y = 123; y < 127; y += HP) R(n, x - pw / 2 + (y - 123) * 0.6, y, pw - (y - 123) * 1.2, HP, mix('#a8c8dc', '#d8e8f0', (y - 123) / 4)); R(n, x - pw / 2 + 1, 123.5, pw * 0.4, HP, '#fff4dc'); }
    var NG = ['#6e6a70', '#94908e', '#e8cca8', '#4a5a34'];
    [[30, 18, 9], [208, 26, 11], [372, 14, 7], [470, 20, 8]].forEach(function (q) { granite(n, q[0], nf(q[0]) + 3, q[1], q[2], rnd, NG); });
    // the breakwater posts, in rows, each a little different, weathered silver-brown
    [[110, 9], [292, 11], [430, 7]].forEach(function (q) {
      for (j = 0; j < q[1]; j++) {
        var px = q[0] + j * 3.6 + rnd() * 0.8, ph = 30 - j * 1.6 - rnd() * 5, pb = nf(px) + 3, lean = (rnd() - 0.5) * 0.06, pw2 = 2.2 + rnd() * 0.6;
        for (y = pb - ph; y < pb; y += HP) { var lx = px + (pb - y) * lean; R(n, lx, y, pw2, HP, '#a8927c'); R(n, lx, y, 0.8, HP, '#ecd4b0'); R(n, lx + pw2 - 0.8, y, 0.8, HP, '#76665a'); }
        oval(n, px + ph * lean + pw2 / 2, pb - ph, pw2 / 2, 0.8, '#a8927c', true); R(n, px + ph * lean, pb - ph, 1, HP, '#f4e0c0');
        R(n, px + 0.5, pb - ph + 4 + rnd() * 4, pw2 - 1, HP, '#86746a');
        R(n, px, pb - 6, pw2, 6, '#5a6038'); R(n, px, pb - 6, pw2, HP, '#86904e');
      }
    });
    R(n, 292 + 1, nf(292) + 3 - 30 - 3.2, 2.5, 1.5, '#ffffff'); R(n, 292 + 2, nf(292) + 3 - 30 - 2.7, 1.5, 1, '#c8c4cc'); R(n, 292 + 0.5, nf(292) + 3 - 30 - 4, 1, 1.4, '#ffffff'); R(n, 292, nf(292) + 3 - 30 - 3.5, HP, HP, '#f0a040'); R(n, 292 + 2, nf(292) + 3 - 30 - 1.8, HP, 1.2, '#f0a040');
    for (i = 0; i < 40; i++) { x = rnd() * SW; y = nf(x) + 2 + rnd() * 5; R(n, x, y, 1, HP, ['#fff4e8', '#f0c0a0', '#e8e0d0'][i % 3]); }
    L.push({ c: nr, f: 0.28 });
    return L;
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
