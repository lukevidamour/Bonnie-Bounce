/* ==========================================================================
   core.js — Bonnie Bounce's console: the screen, the palette, sprites, the
   pixel font, input (keyboard, touch, gamepad) and the sound chip.

   The look is a handheld colour game from 1999: a 144px-tall screen (the
   original's height) drawn in whole pixels and scaled up with no
   smoothing, small fixed palettes, an 8x8 tile rhythm and chunky outlined
   sprites — the same language as TEKEX Jump, the game this grew out of,
   only now in colour and filling the whole window. The width follows the
   window (160–320px of game), so a laptop sees more level than a phone.

   Everything else builds on window.BB from here: art.js, levels.js,
   game.js. No build step, no files to fetch — it runs from file:// too.
   ========================================================================== */
(function () {
  'use strict';
  var BB = window.BB = {};
  var H = BB.H = 144;
  BB.W = 240;
  /* The screen's density. The game thinks in "game pixels" (an 8px tile,
     a 144px-tall view), but every game pixel is drawn as 2x2 real ones, so
     the art can have the finer detail of an Advance-era handheld: curves
     smoothed, one-pixel outlines, light and shade inside every shape. */
  var R = BB.R = 2;
  BB.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var cv = document.getElementById('screen');
  var ctx = cv.getContext('2d');
  BB.cv = cv; BB.ctx = ctx;

  /* ---- fitting the window ---------------------------------------------------
     The game is always 144px tall. Its scale is whatever fills the window
     (or a 160px width, if the window is tall), and its width is however
     many game pixels the window then has room for, between 160 and 320.
     On a phone or tablet held sideways the game fills the screen and the
     touch buttons sit over it (touch.js); held upright, touch.js asks for
     it to be turned. The safe-area padding keeps it out of the notch. */
  var root = document.documentElement;
  // ?touch plays as a touch screen does, to check the phone and tablet layout on a desktop
  var touch = /[?&]touch\b/.test(location.search) || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  BB.touch = touch;
  root.classList.toggle('touch', touch);
  BB.scale = 1;
  var fit = function () {
    var bs = getComputedStyle(document.body);
    var it = parseFloat(bs.paddingTop) || 0, ir = parseFloat(bs.paddingRight) || 0, ib = parseFloat(bs.paddingBottom) || 0, il = parseFloat(bs.paddingLeft) || 0;
    var vw = window.innerWidth - il - ir, vh = window.innerHeight - it - ib;
    root.classList.toggle('portrait', touch && vh > vw * 1.05);
    var s = Math.min(vh / H, vw / 160);
    var W = Math.floor(vw / s);
    W = Math.max(160, Math.min(320, W));
    W -= W % 2;
    if (cv.width !== W * R || cv.height !== H * R) { cv.width = W * R; cv.height = H * R; }
    ctx.imageSmoothingEnabled = false;
    BB.W = W; BB.scale = s;
    cv.style.width = Math.round(W * s) + 'px';
    cv.style.height = Math.round(H * s) + 'px';
  };
  // where a finger is, in game pixels
  BB.toGame = function (cx, cy) {
    var r = cv.getBoundingClientRect(), s = r.width / BB.W;
    var on = cy >= r.top && cy < r.bottom && cx >= r.left && cx < r.right ? 'screen' : null;
    return { on: on, x: (cx - r.left) / s, y: (cy - r.top) / s };
  };
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 120); });

  /* ---- the palette ------------------------------------------------------------
     One key for every character sprite. Picked the way the colour handhelds'
     artists picked theirs: saturated, a light and a dark of each hue, and a
     single near-black outline (never pure black — it is a deep plum, which
     sits warmer against every background). Tiles use '1'–'4' instead, light
     to dark, and each level supplies those four from its own theme. */
  var PAL = BB.PAL = {
    '#': '#1c1428',
    'w': '#ffffff', 'W': '#d0d4e8', 'g': '#9098b0', 'G': '#585a70',
    'k': '#44405a', 'K': '#2c2a3c',
    'h': '#fff3a8', 'H': '#f6cc58', 'n': '#c9902e',
    's': '#ffd6b4', 'S': '#efa47c', 'c': '#ff8a8a',
    'e': '#2a4cc0', 'm': '#c02840',
    'b': '#3a6cf4', 'B': '#1e3ea8',
    'r': '#f24848', 'R': '#a42032',
    'o': '#fa9c38', 'O': '#b85c1c',
    'y': '#ffe048', 'Y': '#d89a18',
    'l': '#7ee058', 'L': '#2e9a34', 'd': '#185c2c',
    'p': '#ff94cc', 'P': '#c04898',
    'v': '#a878f0', 'V': '#5c3ca8',
    'u': '#78d8ff', 'U': '#2c88d0',
    't': '#b47240', 'T': '#6c3e20',
    'z': '#33284a', 'x': '#fffbe8',
    'f': '#ff5c1c', 'F': '#ffd23c'
  };

  /* ---- sprites -----------------------------------------------------------------
     A sprite is rows of characters. '.' is clear; everything else is looked
     up in, first, a variant's swaps (Bonnie's jumper turns red with the
     ball power), then the sprite's own palette (a tile's theme), then PAL.

     Sprites are typed at game resolution and painted at double it, which
     is where the Advance look comes from. Painting a sprite (its mode):
       'gba'    (the default) — doubled with EPX, the classic pixel-art
                scaler, so curves and diagonals come out smooth; the outline,
                now two pixels thick, is thinned back to one; the outline
                round the edge takes a deep shade of the colour it borders
                (coloured outlines, as the Advance's artists drew them);
                every shape is lit from the top left, with a one-pixel
                highlight there and a shadow on the far side; and each eye
                gets a catchlight.
       'smooth' — doubled with EPX only (the type)
       'tile'   — the same, for tiles in a theme's four colours
       'flat'   — doubled square, nothing else
     A sprite drawn at the finer resolution to begin with (BB.sprHi) is
     painted as it is. Each painted canvas is cached per variant and facing. */
  var OUTLINE = '#1c1428';
  var rgbCache = {};
  var toRgb = BB.toRgb = function (h) {
    if (rgbCache[h]) return rgbCache[h];
    var c = h.charAt(0) === '#' ? h.slice(1) : h;
    if (c.length === 3) c = c.replace(/./g, '$&$&');
    return (rgbCache[h] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]);
  };
  var mixRgb = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
  var hex2 = function (n) { n = Math.max(0, Math.min(255, Math.round(n))); return (n < 16 ? '0' : '') + n.toString(16); };
  // a colour part-way to another, as '#rrggbb'
  BB.mix = function (a, b, t) { var c = mixRgb(toRgb(a), toRgb(b), t); return '#' + hex2(c[0]) + hex2(c[1]) + hex2(c[2]); };
  var LIGHT = [255, 251, 232], SHADE = toRgb(OUTLINE), WHITE = [255, 255, 255];

  var spr = BB.spr = function (rows, pal, name, mode) {
    var w = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].length !== w && name !== 'free') {
        if (window.console && BB.debug) console.warn('ragged sprite row', name || '', i, rows[i]);
        rows[i] = rows[i] + new Array(w - rows[i].length + 1).join('.');
      }
    }
    return { rows: rows, w: w, h: rows.length, pal: pal || null, c: {}, mode: mode || 'gba' };
  };
  // a sprite drawn at the finer resolution: its size in game pixels is half its rows
  // mode 'shade' gives it the same coloured outline and lighting as the rest
  BB.sprHi = function (rows, pal, mode) {
    var cols = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
    rows = rows.map(function (r) { return r.length < cols ? r + new Array(cols - r.length + 1).join('.') : r; });
    return { rows: rows, cols: cols, w: cols / R, h: rows.length / R, pal: pal || null, c: {}, hi: true, mode: mode };
  };
  /* Doubling: EPX, then the outline (now two pixels thick) thinned back to
     one where it runs round the edge. Returns the finer grid as rows. */
  var upscale = function (rows, mode) {
    var h = rows.length, w = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0), cw = w * R, chh = h * R, X, Y;
    var a1 = function (x, y) { var q = x < 0 || y < 0 || x >= w || y >= h ? '.' : rows[y][x]; return !q || q === ' ' ? '.' : q; };
    var big = new Array(cw * chh);
    for (Y = 0; Y < h; Y++) for (X = 0; X < w; X++) {
      var P = a1(X, Y), o1 = P, o2 = P, o3 = P, o4 = P;
      if (mode !== 'flat') {
        var A = a1(X, Y - 1), Bq = a1(X + 1, Y), Cq = a1(X - 1, Y), D = a1(X, Y + 1);
        if (Cq === A && Cq !== D && A !== Bq) o1 = A;
        if (A === Bq && A !== Cq && Bq !== D) o2 = Bq;
        if (D === Cq && D !== Bq && Cq !== A) o3 = Cq;
        if (Bq === D && Bq !== A && D !== Cq) o4 = D;
      }
      var bi = Y * 2 * cw + X * 2;
      big[bi] = o1; big[bi + 1] = o2; big[bi + cw] = o3; big[bi + cw + 1] = o4;
    }
    if (mode === 'gba') {
      var a2 = function (x, y) { return x < 0 || y < 0 || x >= cw || y >= chh ? '.' : big[y * cw + x]; };
      var rim = function (x, y) { return a1(x, y) === '#' && (a1(x - 1, y) === '.' || a1(x + 1, y) === '.' || a1(x, y - 1) === '.' || a1(x, y + 1) === '.'); };
      var thin = big.slice();
      for (Y = 0; Y < chh; Y++) for (X = 0; X < cw; X++) {
        if (big[Y * cw + X] !== '#' || clearNear(a2, X, Y) || !rim(X >> 1, Y >> 1)) continue;
        var f = fillNear(a2, X, Y);
        if (f) thin[Y * cw + X] = f;
      }
      big = thin;
    }
    var out = [];
    for (Y = 0; Y < chh; Y++) out.push(big.slice(Y * cw, Y * cw + cw).join(''));
    return out;
  };
  BB.upscale = upscale;
  var clearNear = function (a2, x, y) {
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && a2(x + dx, y + dy) === '.') return true;
    return false;
  };
  var fillNear = function (a2, x, y) {
    var n = [a2(x, y - 1), a2(x - 1, y), a2(x + 1, y), a2(x, y + 1)];
    for (var i = 0; i < 4; i++) if (n[i] !== '.' && n[i] !== '#') return n[i];
    return null;
  };
  var paint = function (s, flip, v) {
    var key = (v ? v.id : '') + (flip ? 'f' : 'n');
    if (s.c[key]) return s.c[key];
    var colOf = function (ch) { var c = (v && v.map[ch]) || (s.pal && s.pal[ch]) || PAL[ch]; return c ? toRgb(c) : null; };
    // the finer grid: as drawn, or doubled from game resolution
    var rows = s.hi ? s.rows : (s.big || (s.big = upscale(s.rows, s.mode || 'gba')));
    var shade = s.hi ? s.mode === 'shade' : (s.mode || 'gba') === 'gba';
    var cw = s.hi ? s.cols : s.w * R, chh = rows.length, X, Y;
    var a2 = function (x, y) { if (x < 0 || y < 0 || x >= cw || y >= chh) return '.'; var q = rows[y][flip ? cw - 1 - x : x]; return !q || q === ' ' ? '.' : q; };
    var cvs = document.createElement('canvas');
    cvs.width = Math.max(1, cw); cvs.height = Math.max(1, chh);
    var g = cvs.getContext('2d'), img = g.createImageData(cvs.width, cvs.height), d = img.data;
    var edge = function (q) { return q === '.' || q === '#'; };
    for (Y = 0; Y < chh; Y++) for (X = 0; X < cw; X++) {
      var ch = a2(X, Y);
      if (ch === '.') continue;
      var col = colOf(ch);
      if (!col) continue;
      if (shade) {
        if (ch === '#') {
          // the outer outline takes a deep shade of what it borders
          if (clearNear(a2, X, Y)) { var f2 = fillNear(a2, X, Y), fc = f2 && colOf(f2); if (fc) col = mixRgb(fc, SHADE, 0.64); }
        } else if (!s.noLight || (s.noLight !== 'all' && s.noLight.indexOf(ch) < 0)) {
          // lit from the top left: a highlight there, a shadow opposite
          var u = a2(X, Y - 1), l = a2(X - 1, Y), dn = a2(X, Y + 1), rt = a2(X + 1, Y);
          if (ch === 'e' && !s.hi && u !== 'e' && l !== 'e') col = WHITE;
          else if (edge(u) || edge(l)) col = mixRgb(col, LIGHT, 0.32);
          else if (edge(dn) || edge(rt)) col = mixRgb(col, SHADE, 0.24);
        }
      }
      var i = (Y * cw + X) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    s.c[key] = cvs;
    return cvs;
  };
  BB.canvasOf = paint;
  // positions land on the finer grid, so things can move by half a game pixel
  var snap = BB.snap = function (n) { return Math.round(n * R) / R; };
  BB.draw = function (g, s, x, y, flip, v, scale) {
    var c = paint(s, flip, v), sc = scale || 1;
    g.drawImage(c, snap(x), snap(y), s.w * sc, s.h * sc);
  };
  // an offscreen surface measured in game pixels, painted at the screen's density
  BB.surface = function (w, h) {
    var c = document.createElement('canvas');
    c.width = Math.ceil(w * R); c.height = Math.ceil(h * R);
    var g = c.getContext('2d');
    g.setTransform(R, 0, 0, R, 0, 0);
    g.imageSmoothingEnabled = false;
    return c;
  };
  BB.blit = function (g, c, x, y) { g.drawImage(c, snap(x), snap(y), c.width / R, c.height / R); };
  // a palette variant: { id, map: {char: colour} } — build once, reuse
  BB.variant = function (id, map) { return { id: id, map: map }; };

  /* ---- type ----------------------------------------------------------------------
     The same 5x7 face as the TEKEX arcade, so the two games read as one
     family, with a star, a heart and a few arrows added. */
  var F = {
    'A': '.###.#...##...#######...##...##...#', 'B': '####.#...##...#####.#...##...#####.',
    'C': '.###.#...##....#....#....#...#.###.', 'D': '###..#..#.#...##...##...##..#.###..',
    'E': '######....#....####.#....#....#####', 'F': '######....#....####.#....#....#....',
    'G': '.###.#...##....#.####...##...#.####', 'H': '#...##...##...#######...##...##...#',
    'I': '.###...#....#....#....#....#...###.', 'J': '..###...#....#....#.#..#.#..#..##..',
    'K': '#...##..#.#.#..##...#.#..#..#.#...#', 'L': '#....#....#....#....#....#....#####',
    'M': '#...###.###.#.##.#.##...##...##...#', 'N': '#...##...###..##.#.##..###...##...#',
    'O': '.###.#...##...##...##...##...#.###.', 'P': '####.#...##...#####.#....#....#....',
    'Q': '.###.#...##...##...##.#.##..#..##.#', 'R': '####.#...##...#####.#.#..#..#.#...#',
    'S': '.#####....#.....###.....#....#####.', 'T': '#####..#....#....#....#....#....#..',
    'U': '#...##...##...##...##...##...#.###.', 'V': '#...##...##...##...##...#.#.#...#..',
    'W': '#...##...##...##.#.##.#.##.#.#.#.#.', 'X': '#...##...#.#.#...#...#.#.#...##...#',
    'Y': '#...##...#.#.#...#....#....#....#..', 'Z': '#####....#...#...#...#...#....#####',
    '0': '.###.#...##..###.#.###..##...#.###.', '1': '..#...##....#....#....#....#...###.',
    '2': '.###.#...#....#...#...#...#...#####', '3': '####.....#....#.###.....#....#####.',
    '4': '...#...##..#.#.#..#.#####...#....#.', '5': '######....####.....#....##...#.###.',
    '6': '..##..#...#....####.#...##...#.###.', '7': '#####....#...#...#...#....#....#...',
    '8': '.###.#...##...#.###.#...##...#.###.', '9': '.###.#...##...#.####....#...#..##..',
    '.': '..........................##...##..', ',': '.....................##....#...#...',
    '!': '..#....#....#....#....#.........#..', '?': '.###.#...#....#...#...#.........#..',
    '-': '...............#####...............', ':': '......##...##........##...##.......',
    '\'': '..#....#...#.......................', '/': '....#...#....#...#...#....#...#....',
    '+': '.......#....#..#####..#....#.......', '(': '...#...#...#....#....#.....#.....#.',
    ')': '.#.....#.....#....#....#...#...#...', '>': '.#....##...###..####.###..##...#...',
    '<': '...#...##..###.####..###...##....#.', '=': '..........#####.....#####..........',
    '\u221e': '...........#.#.#.#.#.#.#...........',
    '*': '..#....#..#####.###..#.#.#...#.....', '@': '.......#.#.###########.###...#......',
    'x': '.....#...#.#.#...#...#.#.#...#.....', '&': '.##..#..#..##...##.##..#.#..#..##.#',
    '↑': '..#...###.#.#.#..#....#....#.......', '↓': '.......#....#....#..#.#.#.###...#..',
    '←': '.......#...#...#####.#.....#.......', '→': '.......#.....#.#####...#...#.......'
  };
  var glyphs = {};
  var glyph = function (ch, color) {
    var key = ch + color;
    if (glyphs[key]) return glyphs[key];
    var g = F[ch] || F['?'], rows = [];
    for (var r = 0; r < 7; r++) rows.push(g.slice(r * 5, r * 5 + 5).replace(/#/g, 'X'));
    return (glyphs[key] = spr(rows, { X: color }, null, 'smooth'));
  };
  BB.textW = function (s, sc) { s = String(s); return s.length ? (s.length * 6 - 1) * (sc || 1) : 0; };
  /* o: { color, shadow (a colour, drawn 1px down-right), outline (a colour,
     drawn all round — the HUD reads over any sky), align, scale } */
  BB.text = function (g, str, x, y, o) {
    o = o || {};
    var sc = o.scale || 1;
    str = String(str);
    // the face is capitals only; '*' is the star and '@' the heart
    str = str.replace(/[a-wyz]/g, function (c) { return c.toUpperCase(); });
    var w = BB.textW(str, sc);
    if (o.align === 'center') x -= Math.floor(w / 2);
    else if (o.align === 'right') x -= w;
    x = snap(x); y = snap(y);
    var pass = function (col, dx, dy) {
      for (var i = 0; i < str.length; i++) {
        if (str[i] === ' ') continue;
        BB.draw(g, glyph(str[i], col), x + i * 6 * sc + dx, y + dy, false, null, sc);
      }
    };
    // a fine one-pixel outline all round, and a drop shadow under it
    if (o.outline) {
      var t = 0.5 * sc;
      pass(o.outline, t, t * 2); pass(o.outline, t * 2, t * 2);
      pass(o.outline, -t, 0); pass(o.outline, t, 0); pass(o.outline, 0, -t); pass(o.outline, 0, t);
      pass(o.outline, -t, -t); pass(o.outline, t, -t); pass(o.outline, -t, t); pass(o.outline, t, t);
    } else if (o.shadow) pass(o.shadow, 0.5 * sc, 0.5 * sc);
    pass(o.color || '#ffffff', 0, 0);
    return w;
  };

  /* ---- prompts ------------------------------------------------------------------------
     Pictures of the real controls, for prompts and signposts:
       BB.glyph(ctx, action, x, y) draws one and returns its width.
       actions: jump, run, move, ok, pause, choose (up/down), back
     On a keyboard they are keycaps with the key's name (SPACE, SHIFT, the
     arrows, ESC); on touch, the pad's own round A and B buttons and its
     D-pad; on a gamepad, its face buttons. BB.prompt lays a line of
     glyphs and words out together. */
  var rr = function (g, x, y, w, h, col) {
    g.fillStyle = col;
    g.fillRect(x + 1, y, w - 2, h); g.fillRect(x + 0.5, y + 0.5, w - 1, h - 1); g.fillRect(x, y + 1, w, h - 2);
  };
  var keycap = function (g, label, x, y) {
    var w = Math.max(9, BB.textW(label) + 6);
    rr(g, x, y + 1, w, 9, '#1c1428');
    rr(g, x + 0.5, y + 0.5, w - 1, 9, '#8a84a8');
    rr(g, x + 0.5, y, w - 1, 8, '#fbf8ff');
    g.fillStyle = '#e4def4'; g.fillRect(x + 1, y + 6.5, w - 2, 1);
    BB.text(g, label, x + w / 2, y + 0.5, { color: '#2a2440', align: 'center' });
    return w;
  };
  var disc = function (g, cx, cy, r, col) {
    g.fillStyle = col;
    for (var dy = -r; dy <= r; dy += 0.5) { var hw = Math.sqrt(Math.max(0, r * r - dy * dy)); g.fillRect(snap(cx - hw), snap(cy + dy), Math.max(0.5, snap(hw * 2)), 0.5); }
  };
  var button = function (g, label, x, y, col, dark) {
    disc(g, x + 4.5, y + 5, 4.8, '#1c1428');
    disc(g, x + 4.5, y + 5, 4.3, dark);
    disc(g, x + 4.5, y + 4.6, 4, col);
    disc(g, x + 3.6, y + 3.6, 1.2, BB.mix(col, '#ffffff', 0.45));
    BB.text(g, label, x + 4.5, y + 1.5, { color: '#ffffff', align: 'center' });
    return 10;
  };
  var dpad = function (g, x, y, hi) {
    g.fillStyle = '#1c1428'; g.fillRect(x + 3, y, 4, 10); g.fillRect(x, y + 3, 10, 4);
    g.fillStyle = '#5a5470'; g.fillRect(x + 3.5, y + 0.5, 3, 9); g.fillRect(x + 0.5, y + 3.5, 9, 3);
    g.fillStyle = '#fbf8ff';
    if (hi === 'h' || !hi) { g.fillRect(x + 1, y + 4.5, 1.5, 1); g.fillRect(x + 7.5, y + 4.5, 1.5, 1); }
    if (hi === 'v' || !hi) { g.fillRect(x + 4.5, y + 1, 1, 1.5); g.fillRect(x + 4.5, y + 7.5, 1, 1.5); }
    return 10;
  };
  // the touch glyphs: little copies of the buttons on the screen
  var bubbleIcon = function (g, x, y) {
    disc(g, x + 4.5, y + 4.5, 4.8, '#3a2450'); disc(g, x + 4.5, y + 4.5, 4.2, '#ffffff'); disc(g, x + 3.6, y + 3.4, 1.6, '#fffbf0');
  };
  var arrowIcon = function (g, x, y, dir) {
    bubbleIcon(g, x, y);
    g.fillStyle = '#3a2450';
    for (var k = -2; k <= 2; k += 0.5) { var w = (2 - Math.abs(k)) * 1.2 + 0.5; g.fillRect(snap(x + 4.5 + (dir > 0 ? -1.2 : 1.2 - w)), snap(y + 4.5 + k - 0.25), snap(w), 0.5); }
    return 10;
  };
  var jumpGlyph = function (g, x, y) {
    disc(g, x + 5, y + 4.5, 5, '#3a2450');
    g.fillStyle = '#3a2450'; g.fillRect(x - 0.5, y + 4.5, 11, 1.5); g.fillRect(x + 2.5, y + 5, 5, 5);
    disc(g, x + 5, y + 4.5, 4.4, '#ef4a5a');
    g.fillStyle = '#ef4a5a'; g.fillRect(x + 0.5, y + 4.5, 9, 1);
    g.fillStyle = '#ffffff'; g.fillRect(x + 2, y + 2.5, 1.5, 1.5); g.fillRect(x + 6.5, y + 1.5, 1.5, 1.5); g.fillRect(x + 7.5, y + 4, 1, 1);
    g.fillStyle = '#fff4dc'; g.fillRect(x + 3, y + 5.5, 4, 4);
    g.fillStyle = '#3a2450'; g.fillRect(x + 4, y + 6.5, 0.5, 1); g.fillRect(x + 5.5, y + 6.5, 0.5, 1);
    return 11;
  };
  var moveGlyph = function (g, x, y) { arrowIcon(g, x, y, -1); arrowIcon(g, x + 10, y, 1); return 20; };
  var runGlyph = function (g, x, y) { arrowIcon(g, x, y, 1); g.fillStyle = '#3a2450'; g.fillRect(x + 11, y + 3, 2, 0.5); g.fillRect(x + 11.5, y + 4.5, 2, 0.5); g.fillRect(x + 11, y + 6, 2, 0.5); return 14; };
  var finger = function (g, x, y) {
    g.fillStyle = '#3a2450';
    g.fillRect(x + 2.5, y, 3, 6); g.fillRect(x + 1, y + 4, 7, 5.5); g.fillRect(x + 1.5, y + 9.5, 6, 0.5);
    g.fillStyle = '#ffe2c4';
    g.fillRect(x + 3, y + 0.5, 2, 5); g.fillRect(x + 1.5, y + 4.5, 6, 4.5);
    g.fillStyle = '#f0b890'; g.fillRect(x + 1.5, y + 8, 6, 1); g.fillRect(x + 5, y + 4.5, 0.5, 2); g.fillRect(x + 6.5, y + 4.5, 0.5, 2);
    g.fillStyle = '#ffffff'; g.fillRect(x + 3, y + 0.5, 0.5, 2);
    return 9;
  };
  var pauseIcon = function (g, x, y) {
    disc(g, x + 5, y + 5, 5, '#3a2450'); disc(g, x + 5, y + 5, 4.4, '#fff4dc');
    g.fillStyle = '#3a2450'; g.fillRect(x + 3, y + 3, 1.5, 4); g.fillRect(x + 5.5, y + 3, 1.5, 4);
    return 10;
  };
  BB.icons = { finger: finger, pause: pauseIcon, disc: disc };
  var PADC = { a: ['#5ccf6a', '#2e8a3c'], b: ['#e2504a', '#9a2a2a'], x: ['#4a8aea', '#2a52a8'], y: ['#f0c040', '#a07a10'] };
  BB.glyph = function (g, action, x, y) {
    var m = BB.inputMode;
    if (m === 'kbd') {
      switch (action) {
        case 'jump': case 'ok': return keycap(g, 'SPACE', x, y);
        case 'run': return keycap(g, 'SHIFT', x, y);
        case 'pause': case 'back': return keycap(g, 'ESC', x, y);
        case 'move': var w1 = keycap(g, '←', x, y); return w1 + 1 + keycap(g, '→', x + w1 + 1, y);
        case 'choose': var w2 = keycap(g, '↑', x, y); return w2 + 1 + keycap(g, '↓', x + w2 + 1, y);
      }
    } else if (m === 'pad') {
      switch (action) {
        case 'jump': case 'ok': return button(g, 'A', x, y, PADC.a[0], PADC.a[1]);
        case 'run': return button(g, 'X', x, y, PADC.x[0], PADC.x[1]);
        case 'back': return button(g, 'B', x, y, PADC.b[0], PADC.b[1]);
        case 'pause': return keycap(g, 'START', x, y);
        case 'move': return dpad(g, x, y, 'h');
        case 'choose': return dpad(g, x, y, 'v');
      }
    } else {
      // touch: little copies of the buttons on the screen (touch.js)
      switch (action) {
        case 'jump': return jumpGlyph(g, x, y);
        case 'ok': case 'back': return finger(g, x, y);
        case 'run': return runGlyph(g, x, y);
        case 'pause': return pauseIcon(g, x, y);
        case 'move': return moveGlyph(g, x, y);
        case 'choose': return finger(g, x, y);
      }
    }
    return 0;
  };
  // a glyph's width, measured once per input mode
  var gw = {}, scratch = null;
  var glyphW = BB.glyphW = function (action) {
    var key = BB.inputMode + action;
    if (gw[key] === undefined) { scratch = scratch || document.createElement('canvas').getContext('2d'); gw[key] = BB.glyph(scratch, action, 0, 0); }
    return gw[key];
  };
  // a line of words and controls: [['t','PRESS'],['g','ok'],['t','TO PLAY']]
  BB.prompt = function (g, parts, x, y, o) {
    o = o || {};
    var w = 0;
    parts.forEach(function (p, i) {
      if (i) w += 3;
      w += p[0] === 't' ? BB.textW(p[1]) : glyphW(p[1]);
    });
    if (o.align === 'center') x -= w / 2; else if (o.align === 'right') x -= w;
    x = snap(x);
    parts.forEach(function (p, i) {
      if (i) x += 3;
      if (p[0] === 't') { BB.text(g, p[1], x, y + 1.5, { color: o.color || '#ffffff', shadow: o.shadow === undefined ? '#1c1428' : o.shadow, outline: o.outline }); x += BB.textW(p[1]); }
      else x += BB.glyph(g, p[1], x, y);
    });
    return w;
  };

  /* ---- input ------------------------------------------------------------------------
     Three sources merged once per step: the keyboard, the on-screen pad on
     a touch screen, and a gamepad. A key tapped and released between two
     steps still counts (the latch), so a quick jump is never swallowed. */
  var NAMES = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'select'];
  var kb = {}, latch = {}, tp = {}, gp = {}, cur = {}, prev = {};
  NAMES.forEach(function (k) { kb[k] = latch[k] = tp[k] = gp[k] = cur[k] = prev[k] = 0; });
  var MAP = {
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    Space: 'a', KeyZ: 'a', KeyK: 'a', KeyX: 'b', KeyJ: 'b', ShiftLeft: 'b', ShiftRight: 'b',
    MetaLeft: 'b', MetaRight: 'b', OSLeft: 'b', OSRight: 'b', AltLeft: 'b', AltRight: 'b',
    Enter: 'start', KeyP: 'start', Escape: 'start', Backspace: 'select', Tab: 'select'
  };
  /* Command runs and throws (owner, 14 Oct), as do Option and Shift. A
     Mac never sends the key-up for a key pressed while Command is held, so
     those keys are let go when their auto-repeat stops arriving instead —
     and when Command itself comes up, everything is. */
  var underCmd = {};
  BB.onAny = null;     // the game hears the first press (to start the sound)
  /* Which controls the player is holding — 'kbd', 'touch' or 'pad' — so
     every prompt can show the real thing: the Space bar on a keyboard, the
     A button on an iPad, a gamepad's own buttons. It follows the last
     input used, so it switches the moment they do. */
  BB.inputMode = touch ? 'touch' : 'kbd';
  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey) return;
    audio();
    BB.inputMode = 'kbd';
    var k = MAP[e.code];
    if (!k) {
      // a browser shortcut (Command-R, Command-T) is left alone
      if (e.metaKey || e.altKey) return;
      if (e.code === 'KeyM') { BB.setMute(!muted); return; }
      if (e.code === 'KeyF' && document.fullscreenEnabled) { toggleFullscreen(); return; }
      return;
    }
    e.preventDefault();
    if (!e.repeat) latch[k] = 1;
    kb[k] = 1;
    if (e.metaKey && !/^(Meta|OS)/.test(e.code)) underCmd[k] = { t: performance.now(), rep: e.repeat };
  });
  window.addEventListener('keyup', function (e) {
    if (e.key === 'Meta' || e.key === 'Control' || e.key === 'OS') { NAMES.forEach(function (k) { kb[k] = 0; }); underCmd = {}; return; }
    var k = MAP[e.code];
    if (k) { kb[k] = 0; delete underCmd[k]; }
  });
  window.addEventListener('blur', function () { NAMES.forEach(function (k) { kb[k] = 0; tp[k] = 0; }); });

  var toggleFullscreen = function () {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else root.requestFullscreen();
    } catch (e) {}
  };
  BB.toggleFullscreen = toggleFullscreen;

  /* Touch is read by touch.js, which knows the zones and the scenes; it
     holds and presses the same eight controls the keyboard does. A tap on
     a menu or the map comes through as a point, so things can be touched
     directly — and a mouse click on the screen does the same on a desktop. */
  BB.touchHold = function (k, v) { tp[k] = v ? 1 : 0; };
  BB.touchPress = function (k) { latch[k] = 1; };
  var tapPt = null;
  BB.touchTap = function (p) { tapPt = p; };
  BB.tap = null;
  cv.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    e.preventDefault(); audio();
    var p = BB.toGame(e.clientX, e.clientY); tapPt = { x: p.x, y: p.y, on: 'screen', mouse: true };
  });
  BB.audioKick = function () { audio(); };

  var readGamepad = function () {
    NAMES.forEach(function (n) { gp[n] = 0; });
    var list = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (!p) continue;
      var b = function (n) { return p.buttons[n] && p.buttons[n].pressed ? 1 : 0; };
      var ax = p.axes[0] || 0, ay = p.axes[1] || 0;
      gp.left |= b(14) || ax < -0.4 ? 1 : 0;
      gp.right |= b(15) || ax > 0.4 ? 1 : 0;
      gp.up |= b(12) || ay < -0.5 ? 1 : 0;
      gp.down |= b(13) || ay > 0.5 ? 1 : 0;
      gp.a |= b(0) || b(1) ? 1 : 0;          // bottom / right face buttons jump
      gp.b |= b(2) || b(3) || b(7) ? 1 : 0;  // left / top face buttons run and throw
      gp.start |= b(9);
      gp.select |= b(8);
      for (var bi = 0; bi < p.buttons.length; bi++) if (p.buttons[bi].pressed) BB.inputMode = 'pad';
    }
  };

  BB.poll = function () {
    readGamepad();
    var now = performance.now();
    for (var u in underCmd) if (now - underCmd[u].t > (underCmd[u].rep ? 150 : 560)) { kb[u] = 0; delete underCmd[u]; }
    NAMES.forEach(function (k) {
      prev[k] = cur[k];
      cur[k] = kb[k] || tp[k] || gp[k] || latch[k] ? 1 : 0;
      if (gp[k] && !prev[k]) audio();
    });
    BB.tap = tapPt; tapPt = null;
    NAMES.forEach(function (k) { latch[k] = 0; });
  };
  BB.key = function (k) { return !!cur[k]; };
  BB.hit = function (k) { return !!cur[k] && !prev[k]; };
  BB.anyHit = function () { for (var i = 0; i < NAMES.length; i++) if (BB.hit(NAMES[i])) return true; return false; };

  /* ---- the sound chip ---------------------------------------------------------------
     The handheld's own palette of sound, synthesised — no files: two pulse
     channels (12.5 / 25 / 50% duty), a soft triangle for bass and noise
     from a 15-bit and a 7-bit shift register. The browser only lets sound
     start after a key or a tap, so every input calls audio(). */
  var AC = null, master = null, waves = {}, noiseBuf = {}, muted = false, unlocked = false;
  /* Sound on iPhones and iPads (owner, 14 Oct: "the game should always
     have sound and music"). Two things stop it there:
       · the ring/silent switch mutes web audio unless the page asks to
         play as media — so it asks (Safari's audioSession), and
       · Safari only lets sound start from a finished tap (touchend /
         click), not from a finger going down — so sound is woken on
         those too, and a silent blip is played the first time, which is
         what actually unlocks it. */
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  var unlock = function () {
    var ac = audio();
    if (!ac || unlocked) return;
    try { var b = ac.createBuffer(1, 1, 22050), src = ac.createBufferSource(); src.buffer = b; src.connect(ac.destination); src.start(0); unlocked = true; } catch (e) {}
  };
  ['touchend', 'click', 'pointerup', 'keydown'].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });
  try { muted = localStorage.getItem('bonnie-mute') === '1'; } catch (e) {}
  var audio = BB.audio = function () {
    if (!AC) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      AC = new C();
      master = AC.createGain(); master.gain.value = 0.6; master.connect(AC.destination);
    }
    // 'interrupted' is iOS after a call or a trip to the home screen
    if (AC.state !== 'running') AC.resume().then(restartSong, function () {});
    else restartSong();
    if (BB.onAny) { var f = BB.onAny; BB.onAny = null; f(); }
    return AC;
  };
  // a tune asked for before the sound could start begins as soon as it can
  var restartSong = function () {
    if (songName && !songTimer && !muted && !songOnce && AC && AC.state === 'running') {
      var n = songName; songName = ''; BB.music(n);
    }
  };
  var ready = function () { return AC && AC.state === 'running' && !muted; };
  // for voice.js: the sound chip's context and output, once sound has started
  BB.audioOut = function () { return ready() ? { ac: AC, out: master } : null; };
  BB.audioCtx = function () { return AC; };
  // has the sound woken up yet (browsers keep it asleep until the first tap or key)?
  BB.soundAwake = function () { return !!AC && AC.state === 'running'; };
  var pulse = function (duty) {
    if (waves[duty]) return waves[duty];
    var n = 40, re = new Float32Array(n), im = new Float32Array(n);
    for (var i = 1; i < n; i++) re[i] = 2 / (i * Math.PI) * Math.sin(i * Math.PI * duty);
    return (waves[duty] = AC.createPeriodicWave(re, im));
  };
  var lfsr = function (short) {
    if (noiseBuf[short]) return noiseBuf[short];
    var len = AC.sampleRate, b = AC.createBuffer(1, len, AC.sampleRate), ch = b.getChannelData(0);
    var r = 0x7fff, hold = Math.max(1, Math.round(AC.sampleRate / 16000)), v = 1;
    for (var i = 0; i < len; i++) {
      if (i % hold === 0) {
        var bit = (r ^ (r >> 1)) & 1;
        r = (r >> 1) | (bit << 14);
        if (short) r = (r & ~0x40) | (bit << 6);
        v = r & 1 ? -1 : 1;
      }
      ch[i] = v * 0.5;
    }
    return (noiseBuf[short] = b);
  };
  var voice = function (f0, f1, dur, o) {
    o = o || {};
    var t = AC.currentTime + (o.at || 0), g = AC.createGain(), src;
    if (o.noise !== undefined) {
      src = AC.createBufferSource();
      src.buffer = lfsr(o.noise);
      src.loop = true;
      src.playbackRate.setValueAtTime(f0, t);
      if (f1 && f1 !== f0) src.playbackRate.exponentialRampToValueAtTime(f1, t + dur);
    } else {
      src = AC.createOscillator();
      if (o.wave === 'tri') src.type = 'triangle'; else src.setPeriodicWave(pulse(o.duty || 0.5));
      src.frequency.setValueAtTime(f0, t);
      if (f1 && f1 !== f0) src.frequency.exponentialRampToValueAtTime(f1, t + dur);
      if (o.vib) {
        var lfo = AC.createOscillator(), lg = AC.createGain();
        lfo.frequency.value = 6; lg.gain.value = f0 * 0.012;
        lfo.connect(lg); lg.connect(src.frequency);
        lfo.start(t + dur * 0.3); lfo.stop(t + dur + 0.03);
      }
    }
    var vol = (o.vol || 0.05) * (o.bus === 'music' ? musicVol : 1);
    g.gain.setValueAtTime(vol, t);
    g.gain.setValueAtTime(vol, t + dur * (o.sustain || 0.5));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.03);
  };
  var NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var hz = BB.hz = function (n) {
    var m = /^([A-G])([#b]?)(\d)$/.exec(n);
    if (!m) return 440;
    var semis = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    return 440 * Math.pow(2, (semis + (+m[3] + 1) * 12 - 69) / 12);
  };
  var arp = function (list, gap, o) {
    list.forEach(function (n, i) { if (n === '.') return; var f = hz(n); voice(f, f, gap * 1.1, Object.assign({ at: i * gap }, o)); });
  };
  var SFX = {
    jump: function () { voice(220, 660, 0.16, { duty: 0.125, vol: 0.04 }); },
    bigjump: function () { voice(165, 520, 0.18, { duty: 0.25, vol: 0.04 }); },
    swim: function () { voice(330, 520, 0.08, { duty: 0.25, vol: 0.03 }); },
    star: function () { voice(1319, 1319, 0.05, { duty: 0.5, vol: 0.035 }); voice(1976, 1976, 0.22, { duty: 0.5, vol: 0.035, at: 0.05 }); },
    stomp: function () { voice(2.4, 0.6, 0.1, { noise: 1, vol: 0.06 }); voice(392, 131, 0.13, { duty: 0.25, vol: 0.045 }); },
    kick: function () { voice(3, 1.2, 0.08, { noise: 1, vol: 0.06 }); voice(523, 262, 0.08, { duty: 0.5, vol: 0.04 }); },
    bump: function () { voice(175, 110, 0.09, { duty: 0.5, vol: 0.05 }); },
    brick: function () { voice(1.4, 0.3, 0.3, { noise: 0, vol: 0.09, sustain: 0.2 }); voice(130, 60, 0.18, { wave: 'tri', vol: 0.12 }); },
    sprout: function () { arp(['G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5'], 0.035, { duty: 0.5, vol: 0.035 }); },
    grow: function () { arp(['C5', 'G4', 'C5', 'E5', 'G4', 'E5', 'G5', 'C6', 'G5', 'C6'], 0.045, { duty: 0.25, vol: 0.04 }); },
    shrink: function () { arp(['C6', 'G5', 'E5', 'C5', 'G4', 'E4', 'C4'], 0.05, { duty: 0.25, vol: 0.04 }); },
    power: function () { arp(['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'], 0.04, { duty: 0.125, vol: 0.035 }); },
    oneup: function () { arp(['E6', 'G6', 'E7', 'C7', 'D7', 'G7'], 0.08, { duty: 0.5, vol: 0.04 }); },
    throw: function () { voice(1200, 300, 0.09, { duty: 0.25, vol: 0.035 }); },
    boing: function () { voice(110, 880, 0.28, { duty: 0.5, vol: 0.05, vib: 1 }); },
    check: function () { arp(['G5', 'C6', 'E6', 'G6'], 0.06, { duty: 0.25, vol: 0.04 }); },
    die: function () { arp(['C6', 'B5', 'A#5', 'A5', '.', '.', 'F5', 'E5', 'D5', 'C5'], 0.09, { duty: 0.5, vol: 0.045 }); },
    hurt: function () { voice(392, 98, 0.35, { duty: 0.5, vol: 0.045 }); },
    flag: function () { voice(196, 1568, 0.9, { duty: 0.25, vol: 0.035, sustain: 0.8 }); },
    fire: function () { voice(1.8, 0.4, 0.35, { noise: 0, vol: 0.06 }); },
    roar: function () { voice(0.6, 0.2, 0.6, { noise: 0, vol: 0.1, sustain: 0.4 }); voice(110, 55, 0.6, { duty: 0.5, vol: 0.04 }); },
    boom: function () { voice(0.9, 0.12, 0.55, { noise: 0, vol: 0.11, sustain: 0.1 }); voice(140, 40, 0.4, { wave: 'tri', vol: 0.12 }); },
    splash: function () { voice(1.2, 0.5, 0.25, { noise: 0, vol: 0.05 }); },
    pause: function () { arp(['E6', 'C6', 'E6', 'C6'], 0.06, { duty: 0.5, vol: 0.035 }); },
    select: function () { voice(1047, 1047, 0.035, { duty: 0.125, vol: 0.035 }); },
    start: function () { arp(['C6', 'E6', 'G6', 'C7'], 0.06, { duty: 0.5, vol: 0.04 }); },
    step: function () { voice(98, 98, 0.05, { wave: 'tri', vol: 0.1 }); },
    tick: function () { voice(1568, 1568, 0.03, { duty: 0.5, vol: 0.025 }); },
    clink: function () { voice(2093, 2093, 0.04, { duty: 0.5, vol: 0.03 }); },
    pop: function () { voice(600, 1400, 0.06, { duty: 0.5, vol: 0.035 }); },
    // Bear, found: a little meow that rises and falls
    // half a heart back: three soft rising notes
    heal: function () { arp(['E6', 'G#6', 'B6'], 0.06, { duty: 0.5, vol: 0.03 }); },
    // the family car's horn: a friendly two-note toot-toot
    toot: function () { voice(392, 392, 0.09, { duty: 0.5, vol: 0.035 }); voice(330, 330, 0.14, { duty: 0.5, vol: 0.035, at: 0.13 }); },
    meow: function () { voice(560, 860, 0.12, { duty: 0.25, vol: 0.035, vib: 1 }); voice(860, 470, 0.26, { duty: 0.25, vol: 0.035, at: 0.12, vib: 1 }); },
    purr: function () { voice(1.2, 0.9, 0.35, { noise: 0, vol: 0.025, sustain: 0.25 }); }
  };
  BB.sfx = function (name) { if (!ready() || !SFX[name]) return; try { SFX[name](); } catch (e) {} };

  /* Music. Tokens are notes ('C5', 'F#4', 'Bb3'), '-' holds the last one,
     '.' rests, and on a noise track 'x' is a hat and 'X' a snare. Every
     tune is an original — no borrowed melodies. Songs live in art.js. */
  var musicVol = 1, song = null, songName = '', songTimer = null, songAt = 0, songI = 0, songOnce = null;
  var parseSong = function (s) {
    if (s.parsed) return s;
    s.tracks.forEach(function (t) { t.seq = t.notes.trim().split(/\s+/); });
    s.len = s.tracks.reduce(function (m, t) { return Math.max(m, t.seq.length); }, 0);
    s.parsed = true;
    return s;
  };
  var schedule = function () {
    if (!song || !AC) return;
    while (songAt < AC.currentTime + 0.25) {
      if (song.once && songI >= song.len) {
        stopSong(); songName = '';
        if (songOnce) { var f = songOnce; songOnce = null; setTimeout(f, 50); }
        return;
      }
      var i = songI % song.len, at = Math.max(0, songAt - AC.currentTime);
      song.tracks.forEach(function (t) {
        var n = t.seq[i % t.seq.length];
        if (!n || n === '.' || n === '-') return;
        var hold = 1;
        while (hold < 16 && t.seq[(i + hold) % t.seq.length] === '-') hold++;
        var dur = song.step * hold * 0.92;
        if (t.noise !== undefined) {
          if (n === 'X') voice(1.2, 0.8, 0.09, { noise: 0, vol: t.vol * 1.6, at: at, sustain: 0.1, bus: 'music' });
          else voice(2.4, 2.4, 0.035, { noise: t.noise, vol: t.vol, at: at, sustain: 0.1, bus: 'music' });
        } else {
          var f = hz(n);
          voice(f, f, dur, { duty: t.duty, wave: t.wave, vol: t.vol, at: at, sustain: t.sustain || 0.7, vib: t.vib && hold > 2, bus: 'music' });
        }
      });
      songAt += song.step; songI++;
    }
  };
  var stopSong = function () { clearInterval(songTimer); songTimer = null; song = null; };
  BB.music = function (name, onDone) {
    if (name === songName && songTimer && !onDone) return;
    stopSong();
    songName = name || '';
    songOnce = onDone || null;
    if (!name || !BB.SONGS || !BB.SONGS[name]) { if (onDone) setTimeout(onDone, 50); return; }
    if (!ready()) {
      // no sound: a jingle still has to end, or the game would wait for it
      if (onDone) { songName = ''; songOnce = null; setTimeout(onDone, BB.SONGS[name].ms || 1500); }
      return;
    }
    song = parseSong(BB.SONGS[name]);
    songI = 0; songAt = AC.currentTime + 0.05;
    songTimer = setInterval(schedule, 50);
    schedule();
  };
  BB.musicName = function () { return songName; };
  BB.setMute = function (m) {
    muted = m;
    try { localStorage.setItem('bonnie-mute', m ? '1' : '0'); } catch (e) {}
    var b = document.getElementById('mute');
    if (b) b.setAttribute('aria-pressed', m ? 'true' : 'false');
    if (m) stopSong(); else restartSong();
  };
  BB.muted = function () { return muted; };
  var muteBtn = document.getElementById('mute');
  if (muteBtn) muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
  document.addEventListener('visibilitychange', function () {
    if (!AC) return;
    if (document.hidden) AC.suspend(); else if (!muted) AC.resume();
  });

  /* ---- the loop ------------------------------------------------------------------------
     A fixed 60 steps a second whatever the display's rate, so a 120Hz
     screen plays at the same speed as a 60Hz one. */
  BB.start = function (update, render) {
    var STEP = 1000 / 60, acc = 0, last = performance.now();
    /* For automated checks: run n steps at once and draw, with keys held
       as given — BB.steps(60, {right: 1, b: 1}). Not used by the game. */
    // (quiet: the robot playtest steps without drawing, thousands of times)
    BB.steps = function (n, hold, quiet) {
      for (var i = 0; i < n; i++) {
        if (hold) NAMES.forEach(function (k) { kb[k] = hold[k] ? 1 : 0; });
        BB.poll(); update();
      }
      if (!quiet) draw();
    };
    var draw = function () {
      ctx.setTransform(R, 0, 0, R, 0, 0);
      ctx.imageSmoothingEnabled = false;
      render(ctx);
    };
    /* The next frame is asked for first, and a step or a draw that goes
       wrong is caught: one bad moment must never freeze the whole game. */
    var errors = 0;
    var frame = function (now) {
      requestAnimationFrame(frame);
      acc += Math.min(100, now - last); last = now;
      var n = 0;
      try {
        while (acc >= STEP && n < 4) { BB.poll(); update(); acc -= STEP; n++; }
        if (n === 4) acc = 0;
        draw();
      } catch (e) {
        acc = 0;
        if (errors++ < 5 && window.console) console.error(e);
      }
    };
    requestAnimationFrame(frame);
  };

  // a small seeded random, so the scenery is the same on every visit
  BB.rng = function (seed) {
    var s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; };
  };
  BB.debug = /[?&]debug\b/.test(location.search);
})();
