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
