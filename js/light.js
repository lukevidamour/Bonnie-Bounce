/* ==========================================================================
   light.js — light, and how Bonnie catches it.

   Each world has a light of its own (its theme's `light`):
     rays   shafts of sunlight slanting down from the top left, fixed in
            the world, so you walk through them. Dust and pollen drift in
            them and only show where the light catches them.
     dark   for night, caves and the castle: a soft dusk laid over
            everything, with pools of light cut out of it round every
            lamp, torch, crystal, toadstool, firefly, bubble of lava — and
            round Bonnie himself, so it is never too dark for a six-year-old.
     glow   coloured light added round those same sources.
   And everything that moves catches it: a sprite in a sunbeam or beside a
   torch gets a rim of that light along its edge facing the source, and a
   wash of it over its whole body, scaled by how strong the light is where
   it stands. Everything standing on the ground casts a soft shadow.

   The light layers are painted at game resolution and scaled up without
   smoothing, so their gradients fall in steps like the rest of the art.
   ========================================================================== */
(function () {
  'use strict';
  var H = BB.H, R = BB.R, SLANT = 0.42;
  var mk = function () { var c = document.createElement('canvas'); c.width = 320; c.height = H; return c; };
  var rayC = mk(), glowC = mk(), darkC = mk(), vigC = null, vigW = 0;
  var rg = rayC.getContext('2d'), gg = glowC.getContext('2d'), dg = darkC.getContext('2d');

  /* One ray, drawn once: white, brightest down its middle and at its top,
     fading to nothing at its sides and towards the ground. */
  var RAY = (function () {
    var c = document.createElement('canvas'); c.width = 32; c.height = H;
    var g = c.getContext('2d'), img = g.createImageData(32, H);
    for (var y = 0; y < H; y++) for (var x = 0; x < 32; x++) {
      var dx = Math.abs(x + 0.5 - 16) / 16, a = Math.pow(Math.max(0, 1 - dx * dx), 1.4) * Math.pow(1 - y / H, 0.8);
      var i = (y * 32 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.round(a * 255);
    }
    g.putImageData(img, 0, 0);
    return c;
  })();

  var rgba = function (hex, a) { var c = BB.toRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; };

  BB.lighting = function (cfg, levelW, seed) {
    cfg = cfg || {};
    var rnd = BB.rng(seed || 7), rays = [], L = { cfg: cfg, points: [], motes: [], t: 0 };
    /* Sunbeams are a seasoning, not the dish (owner, 14 Oct: "nice but
       don't overdo them"): a few, well apart, slim and soft, so most of
       the time there's one on screen or none. */
    if (cfg.rays) for (var x = 90 + rnd() * 160; x < levelW + 200; x += 320 + rnd() * 300) rays.push({ x: x, w: 10 + rnd() * 14, a: cfg.rays.a * (0.4 + rnd() * 0.25), ph: rnd() * 6 });
    L.rays = rays;

    // how strong the light is at a point, which colour, and which side it comes from
    L.at = function (wx, wy) {
      var best = { i: 0, col: cfg.rays ? cfg.rays.col : '#ffffff', dir: -1 };
      for (var i = 0; i < rays.length; i++) {
        var r = rays[i], xc = r.x + wy * SLANT, d = Math.abs(wx - xc);
        if (d < r.w / 2) { var v = (1 - d / (r.w / 2)) * (0.6 + 0.4 * Math.sin(L.t * 0.02 + r.ph)) * 1.4; if (v > best.i) { best.i = v; best.col = cfg.rays.col; best.dir = -1; } }
      }
      for (i = 0; i < L.points.length; i++) {
        var p = L.points[i], dx = wx - p.x, dy = wy - p.y, dd = Math.sqrt(dx * dx + dy * dy);
        if (dd < p.r) { var v2 = Math.pow(1 - dd / p.r, 1.6) * (p.rim === undefined ? 1 : p.rim); if (v2 > best.i) { best.i = v2; best.col = p.col; best.dir = dx < 0 ? 1 : -1; } }
      }
      best.i = Math.min(1, best.i);
      return best;
    };

    /* Called after the world is drawn, before the HUD. */
    L.render = function (ctx, cam, reduce) {
      L.t++;
      var W = BB.W, i, p;
      if (rayC.width !== W) { rayC.width = glowC.width = darkC.width = W; }
      var ox = cam.x, oy = cam.y;
      // dusk, with pools of light cut out of it
      if (cfg.dark) {
        dg.globalCompositeOperation = 'source-over';
        dg.clearRect(0, 0, W, H);
        dg.fillStyle = rgba(cfg.dark.col, cfg.dark.a); dg.fillRect(0, 0, W, H);
        dg.globalCompositeOperation = 'destination-out';
        for (i = 0; i < L.points.length; i++) {
          p = L.points[i];
          var sx = p.x - ox, sy = p.y - oy;
          if (sx < -p.r || sx > W + p.r || sy < -p.r || sy > H + p.r) continue;
          var gr = dg.createRadialGradient(sx, sy, 0, sx, sy, p.r * 1.3);
          gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.5, 'rgba(0,0,0,0.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          dg.fillStyle = gr; dg.fillRect(sx - p.r * 1.3, sy - p.r * 1.3, p.r * 2.6, p.r * 2.6);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(darkC, 0, 0, W, H, 0, 0, W, H);
      }
      // coloured glow round each source
      gg.clearRect(0, 0, W, H);
      gg.globalCompositeOperation = 'lighter';
      for (i = 0; i < L.points.length; i++) {
        p = L.points[i];
        var gx = p.x - ox, gy = p.y - oy;
        if (gx < -p.r || gx > W + p.r || gy < -p.r || gy > H + p.r) continue;
        var flick = reduce ? 1 : 0.9 + 0.1 * Math.sin(L.t * 0.21 + p.x);
        var g2 = gg.createRadialGradient(gx, gy, 0, gx, gy, p.r);
        g2.addColorStop(0, rgba(p.col, (p.a || 0.35) * flick)); g2.addColorStop(1, rgba(p.col, 0));
        gg.fillStyle = g2; gg.fillRect(gx - p.r, gy - p.r, p.r * 2, p.r * 2);
      }
      // the rays: fixed in the world, slanting, breathing slowly
      rg.clearRect(0, 0, W, H);
      if (cfg.rays && rays.length) {
        rg.globalCompositeOperation = 'source-over';
        for (i = 0; i < rays.length; i++) {
          var r = rays[i], e = r.x + oy * SLANT - ox;
          if (e + H * SLANT + r.w < 0 || e - r.w > W) continue;
          rg.setTransform(1, 0, SLANT, 1, e, 0);
          rg.globalAlpha = r.a * (reduce ? 1 : 0.7 + 0.3 * Math.sin(L.t * 0.02 + r.ph));
          rg.drawImage(RAY, -r.w / 2, 0, r.w, H);
        }
        rg.setTransform(1, 0, 0, 1, 0, 0);
        rg.globalAlpha = 1;
        rg.globalCompositeOperation = 'source-in';
        rg.fillStyle = cfg.rays.col; rg.fillRect(0, 0, W, H);
        rg.globalCompositeOperation = 'source-over';
      }
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(rayC, 0, 0, W, H, 0, 0, W, H);
      ctx.drawImage(glowC, 0, 0, W, H, 0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      // motes: they drift everywhere, but show where the light is
      if (cfg.motes && !reduce) {
        while (L.motes.length < 46) L.motes.push({ x: Math.random() * W, y: Math.random() * H, s: Math.random(), t: Math.random() * 300 });
        L.motes.forEach(function (m) {
          m.t++;
          m.x += Math.sin(m.t * 0.013 + m.s * 6) * 0.15 + 0.05; m.y += Math.cos(m.t * 0.011) * 0.1 + 0.03;
          if (m.x > W + 2) m.x = -2; if (m.y > H + 2) m.y = -2; if (m.x < -2) m.x = W + 2;
          var li = L.at(m.x + ox, m.y + oy).i, a = Math.min(1, 0.08 + li * 1.1);
          if (a < 0.1) return;
          ctx.globalAlpha = a;
          ctx.fillStyle = cfg.motes;
          ctx.fillRect(BB.snap(m.x), BB.snap(m.y), m.s > 0.7 ? 1 : 0.5, m.s > 0.7 ? 1 : 0.5);
        });
        ctx.globalAlpha = 1;
      }
      // a soft vignette draws the eye to the middle
      if (!vigC || vigW !== W) {
        vigC = document.createElement('canvas'); vigC.width = W; vigC.height = H; vigW = W;
        var vg = vigC.getContext('2d'), rad = vg.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.45, Math.max(W, H) * 0.75);
        rad.addColorStop(0, 'rgba(20,10,40,0)'); rad.addColorStop(1, 'rgba(20,10,40,0.32)');
        vg.fillStyle = rad; vg.fillRect(0, 0, W, H);
      }
      ctx.drawImage(vigC, 0, 0, W, H);
    };
    return L;
  };

  /* A sprite catching the light: a rim along the edge that faces the
     source (dir -1: from the left, 1: from the right) and a gentle wash
     over the whole of it. Masks are made once per painted canvas. */
  var masks = function (cvs) {
    if (cvs._m) return cvs._m;
    var w = cvs.width, h = cvs.height, src = cvs.getContext('2d').getImageData(0, 0, w, h).data;
    var op = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && src[(y * w + x) * 4 + 3] > 0; };
    var make = function (test) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var g = c.getContext('2d'), img = g.createImageData(w, h);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        if (!op(x, y) || !test(x, y)) continue;
        var i = (y * w + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return c;
    };
    cvs._m = {
      L: make(function (x, y) { return !op(x - 1, y) || !op(x, y - 1) || !op(x - 2, y) || (!op(x - 1, y - 1) && !op(x, y - 2)); }),
      R: make(function (x, y) { return !op(x + 1, y) || !op(x, y - 1) || !op(x + 2, y) || (!op(x + 1, y - 1) && !op(x, y - 2)); }),
      all: make(function () { return true; }),
      tint: {}
    };
    return cvs._m;
  };
  var tinted = function (m, which, col) {
    var key = which + col;
    if (m.tint[key]) return m.tint[key];
    var src = m[which], c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    var g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height);
    return (m.tint[key] = c);
  };
  BB.catchLight = function (ctx, s, x, y, flip, v, light, w, h) {
    if (!light || light.i < 0.04) return;
    var cvs = BB.canvasOf(s, flip, v), m = masks(cvs), X = BB.snap(x), Y = BB.snap(y);
    w = w || s.w; h = h || s.h;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(0.7, light.i * 0.8);
    ctx.drawImage(tinted(m, light.dir < 0 ? 'L' : 'R', light.col), X, Y, w, h);
    ctx.globalAlpha = Math.min(0.16, light.i * 0.16);
    ctx.drawImage(tinted(m, 'all', light.col), X, Y, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };
  // a soft oval shadow on whatever is underfoot
  BB.shadow = function (ctx, cx, gy, w, a) {
    if (a <= 0.02) return;
    ctx.fillStyle = 'rgba(28,16,52,' + a.toFixed(3) + ')';
    var hw = w / 2;
    ctx.fillRect(BB.snap(cx - hw + 1.5), BB.snap(gy - 1), BB.snap(w - 3), 0.5);
    ctx.fillRect(BB.snap(cx - hw), BB.snap(gy - 0.5), BB.snap(w), 1);
    ctx.fillRect(BB.snap(cx - hw + 1.5), BB.snap(gy + 0.5), BB.snap(w - 3), 0.5);
  };
})();
