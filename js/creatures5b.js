/* ==========================================================================
   creatures5b.js — ONE DAY…, the fifth land (levels 36–45): the world
   Bonnie flies over to get his wishes back. Its creatures, the things he
   rides (a kangaroo's pouch, a pterodactyl's feet, taxis, a steam train's
   roof), its springs, and the scenery of Universal, Jamaica, Antarctica,
   Australia, the rainbow and Dinosaur Land.

   The same hand as creatures.js: round soft shapes lit from the top left
   (each shade from a five-tone ramp, deep to shine), a coloured outline,
   big friendly eyes with a sparkle. Creatures face left and stand on the
   bottom row. This file keeps its own palette and copies of the few
   drawing helpers it needs, so it depends only on BB.ART.kit.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, K = A.kit, E = A.en, D = A.deco, ell = K.ell, cap = K.cap, limb = K.limb, rrect = K.rrect;
  var LK = A.looks = A.looks || {};

  // the shared colours, as creatures.js has them, so the stamps (eyes,
  // blush, outlines) read the same
  var PAL = {
    '#': '#1c1428', w: '#ffffff', W: '#dfe2f2', E: '#1d1a3c', G: '#2a2440',
    a: '#3a1e6a', b: '#5a32a0', c: '#7c4ed2', d: '#a47ef0', e: '#e6d8ff',
    f: '#121024', g: '#211d38', h: '#302a50', i: '#4a4278', j: '#8c84c4',
    k: '#8a3a10', l: '#c45a18', m: '#f08a30', n: '#ffb860', o: '#fff0c8',
    p: '#9a3a6a', q: '#d0609a', r: '#f08ac0', s: '#ffb8de', t: '#fff0f8',
    u: '#7a1a24', v: '#b82a34', x: '#e84a4a', y: '#ff8a7a', z: '#ffe0d8',
    A: '#8a5a10', B: '#d09018', C: '#ffc830', D: '#ffe470', F: '#fffbe0',
    H: '#2a6a34', I: '#4ea84a', J: '#8ee070',
    L: '#e6f8ff', M: '#9ad0f0',
    N: '#3a3a50', O: '#5c5c78', P: '#8a8aa8', Q: '#b8b8d0', R: '#f0f0ff',
    S: '#4a2a18', T: '#7a4a28', U: '#a8703c', V: '#d09a5c', X: '#ffe0b0',
    Y: '#ffe8c8', Z: '#e8c8a0',
    1: '#c8d4f0', 2: '#a4b4e0', 3: '#ff9aa8',
    4: '#b8200c', 5: '#ff5a1c', 6: '#ff9a2c', 7: '#ffd85a', 8: '#fffbe0',
    '[': '#1c5a2c', ']': '#2e8a3c', '{': '#4cb44a', '}': '#86e06a', '~': '#d8ffb8',
    '!': '#56546c', '$': '#7a7892', '%': '#a3a1b8', '&': '#c9c7da', '*': '#eeedf7',
    '(': '#1e6a34', ')': '#2f8f3e', '<': '#4cb24a', '>': '#86dc62', '^': '#d2f8a8',
    '@': '#0c3c58', '+': '#14708c', '=': '#20a8c0', '-': '#5ce0e0', ':': '#d4fff8',
    ';': '#1a2262', '_': '#2a3c9a', '|': '#3c5cd4', '?': '#6e8ef2', '/': '#bccfff'
  };
  // five tones, deep to shine, named by five characters of their own
  var ramp = function (chars, cols) { for (var i = 0; i < cols.length; i++) PAL[chars.charAt(i)] = cols[i]; return chars; };
  var INK = 'fghij', SNOW = '21WwR', RED = 'uvxyz', GOLD = 'ABCDF', WOOD = 'STUVX', IRON = 'NOPQR', PINK = 'pqrst',
    PURP = 'abcde', ORANGE = 'klmno', CACT = '[]{}~', LEAF = '()<>^', TEAL = '@+=-:', COAT = ';_|?/', CREAM = 'ZZYYw', FUR = '!$%&*';
  /* This land's own ramps. Cyrillic and Greek letters, because every
     printable ASCII character is a colour already; they're real UTF-8
     characters in string literals, so the pages keep <meta charset="utf-8">. */
  var LEMON = ramp('бвгдж', ['#8a6400', '#d6a40c', '#fcd52a', '#ffec70', '#fffbd2']);   // a Minion's yellow
  var DENIM = ramp('зийкл', ['#1a2a58', '#2a468c', '#3c66bc', '#6c96e4', '#c0d8ff']);   // dungarees
  var EMER = ramp('мнпрт', ['#063a30', '#0a6a4e', '#12a06e', '#4cd898', '#c8ffe2']);    // the doctor bird's green
  var EMU = ramp('уфхцч', ['#2a1e16', '#4a3626', '#70543a', '#9a7a58', '#cfb690']);     // shaggy brown feathers
  var SLATE = ramp('шщъыь', ['#283250', '#42547a', '#6a80a8', '#9cb2d4', '#dce8f8']);   // an emu's blue neck
  var CROC = ramp('эюяёђ', ['#14321a', '#225228', '#3a7c38', '#68aa50', '#b8e08e']);    // crocodile green
  var WATER = ramp('ѓєѕії', ['#2a6678', '#3a8090', '#4c98a8', '#72b8c4', '#ace0e4']);   // a croc seen through the water
  var ROO = ramp('јљњћќ', ['#5a2812', '#8e4622', '#c0703a', '#e49e68', '#fcdcb4']);     // kangaroo red
  var TRIKE = ramp('БГДЖЗ', ['#183852', '#265878', '#3a7ea2', '#6caaca', '#c6eaf6']);   // a triceratops' blue hide
  var PTERO = ramp('ИЙЛПФ', ['#561a28', '#8c2e3a', '#c44c46', '#ec8462', '#ffd4b8']);   // the pterodactyl's coral
  var REX = ramp('ЦЧШЩЪ', ['#1c3a14', '#2c5c1e', '#46862c', '#78ba48', '#ccf0a0']);     // T. rex green
  var BABY = ramp('ЫЬЭЮЯ', ['#2a6658', '#44947c', '#6cc4a0', '#a8e8c8', '#eafff4']);    // a hatchling's mint
  var OCHRE = ramp('ΓΔΘΛΞ', ['#5a1e0e', '#8e3418', '#c45a2a', '#e88a50', '#ffc896']);   // outback red earth
  var GUM = ramp('ΠΣΦΨΩ', ['#24443a', '#386650', '#56886a', '#88b498', '#d0ecd8']);     // eucalyptus leaves
  var BARK = ramp('αβγδε', ['#685c52', '#968878', '#c4b6a4', '#e6dccc', '#fffaf0']);    // pale gum bark
  var ICE = ramp('ζηθικ', ['#2a5a8a', '#4a8ac0', '#7cc0e8', '#b4e4fa', '#f0fcff']);     // sea ice
  var CHOC = ramp('λμνξο', ['#2a1408', '#4a2412', '#6e3a1e', '#965a34', '#c8905c']);    // chocolate
  var BISC = ramp('πρστυ', ['#7a4a14', '#b47a2c', '#dca456', '#f4ca84', '#fff0cc']);    // a baked biscuit
  var MARSH = ramp('φχψωϊ', ['#b05a80', '#e08aaa', '#ffb4cc', '#ffd8e6', '#fff4f8']);   // marshmallow pink
  var SKY = ramp('ϋόύώϐ', ['#0e4a8a', '#1c74c8', '#3aa0f0', '#86cdfc', '#e0f4ff']);     // sky blue paint
  var LIME = ramp('ϑϒϕϖϗ', ['#2c5a10', '#4a8a18', '#78bc28', '#b0e050', '#eaffb0']);    // bright jungle green
  var MAROON = ramp('ϘϙϚϛϜ', ['#3a0a14', '#5c1220', '#86202e', '#b23a44', '#e07a7a']);  // the train's roof, deep red
  var LILAC = ramp('ϝϞϟϠϡ', ['#4a2a7a', '#7244b0', '#9c6ede', '#c6a2f6', '#f0e4ff']);   // violet
  var BAMBOO = ramp('ϢϣϤϥϦ', ['#56601a', '#86942a', '#b6bc48', '#dcdc7a', '#fafcc8']);  // bamboo canes
  var CORAL = ramp('ϧϨϩϪϫ', ['#8a1a3a', '#c42a52', '#ee4a72', '#ff86a4', '#ffd6e2']);   // hibiscus and flamingo pink

  // a round shape lit from the top left and a little in front
  var orb = function (cx, cy, rx, ry, t) {
    return function (x, y) {
      var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, n = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy));
      var i = -0.48 * dx - 0.58 * dy + 0.66 * n;
      return i > 0.9 ? t[4] : i > 0.6 ? t[3] : i > 0.22 ? t[2] : i > -0.12 ? t[1] : t[0];
    };
  };
  var P = function (c, f, tex, line) { return { c: c, f: f, tex: tex, line: line || null }; };
  var O = function (cx, cy, rx, ry, t, line) { return P(t[2], ell(cx, cy, rx, ry), orb(cx, cy, rx, ry, t), line); };
  var or = function () { var fs = arguments; return function (x, y) { for (var i = 0; i < fs.length; i++) if (fs[i](x, y)) return true; return false; }; };
  var both = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var but = function (a, b) { return function (x, y) { return a(x, y) && !b(x, y); }; };
  // a tone k steps lighter (or darker, k < 0) along its ramp
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
  // the same tone in another ramp (a croc's green, seen through water)
  var swapRamp = function (from, to, ch) { var i = from.indexOf(ch); return i < 0 ? ch : to.charAt(i); };
  // a shape (or a texture) turned by a about a pivot
  var turned = function (f, px, py, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return function (x, y) { var dx = x - px, dy = y - py; return f(px + dx * c + dy * s, py - dx * s + dy * c); };
  };
  var tri = function (ax, ay, bx, by, cx, cy) {
    return function (x, y) {
      var s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by), s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy), s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
      return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
    };
  };
  var taper = function (pts, r0, r1) {
    var n = pts.length - 1, segs = [];
    for (var i = 0; i < n; i++) segs.push(cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r0 + (r1 - r0) * (i + 0.5) / n));
    return function (x, y) { return segs.some(function (f) { return f(x, y); }); };
  };
  /* A body along a smooth curve through [x, y, r] points (a Catmull-Rom
     spline, its radius eased between them): a tail, a neck, an orca. Its
     `at(x, y)` says where a pixel is on it: t runs 0 to 1 along it, s
     runs -1 to 1 across it (negative on the left of the way it runs, so
     a curve drawn left to right has its top at s < 0). */
  var tube = function (pts, n) {
    n = n || 48;
    var smp = [], seg = pts.length - 1, i;
    for (i = 0; i <= n; i++) {
      var u = i / n * seg, k = Math.min(seg - 1, Math.floor(u)), t = u - k;
      var p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(seg, k + 2)];
      var cr = function (j) { var a = p0[j], b = p1[j], c = p2[j], d = p3[j]; return 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t); };
      smp.push([cr(0), cr(1), p1[2] + (p2[2] - p1[2]) * (t * t * (3 - 2 * t)), i / n]);
    }
    var f = function (x, y) { for (var j = 0; j < smp.length; j++) { var s = smp[j], dx = x - s[0], dy = y - s[1]; if (dx * dx + dy * dy <= s[2] * s[2]) return true; } return false; };
    var at = function (x, y) {
      var best = 1e9, bj = 0;
      for (var j = 0; j < smp.length; j++) { var s = smp[j], d = Math.sqrt((x - s[0]) * (x - s[0]) + (y - s[1]) * (y - s[1])) - s[2]; if (d < best) { best = d; bj = j; } }
      var a = smp[Math.max(0, bj - 1)], b = smp[Math.min(smp.length - 1, bj + 1)], tx = b[0] - a[0], ty = b[1] - a[1], L = Math.sqrt(tx * tx + ty * ty) || 1, s0 = smp[bj];
      return { t: s0[3], s: ((x - s0[0]) * -ty + (y - s0[1]) * tx) / L / s0[2], x: s0[0], y: s0[1], r: s0[2] };
    };
    return { f: f, at: at, smp: smp };
  };
  // a kite-faceted star: one side of each point catches the light
  var starFn = function (cx, cy, R, r0, a0) {
    return function (x, y) {
      var dx = x - cx, dy = y - cy, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) - a0, seg = Math.PI * 2 / 5;
      var d = ((a % seg) + seg * 1.5) % seg - seg / 2;
      return rr <= r0 + (R - r0) * (1 - Math.abs(d) / (seg / 2));
    };
  };
  var starTx = function (cx, cy, a0, t) {
    return function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) - a0, seg = Math.PI * 2 / 5;
      var d = ((a % seg) + seg * 1.5) % seg - seg / 2;
      if (rr < 1.3) return t[4];
      if (Math.abs(d) * rr < 0.45) return t[3];
      return d < 0 ? (dy < 0 ? t[3] : t[2]) : (dy < 0 ? t[2] : t[1]);
    };
  };
  var build = function (W, H, parts, stamps) {
    var rows = K.scene(W, H, parts);
    // a texture that gives no colour would put 'null' in a row: say so
    if (rows.some(function (r) { return r.length !== W; }) && window.console) console.error('creatures5b: ragged sprite', W, H);
    (stamps || []).forEach(function (s) { K.stamp(rows, s[0], s[1], s[2]); });
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  };
  // the same, with a last pass over the rows (to soften a line under water)
  var buildWith = function (W, H, parts, stamps, post) {
    var rows = K.scene(W, H, parts);
    (stamps || []).forEach(function (s) { K.stamp(rows, s[0], s[1], s[2]); });
    rows = rows.map(function (r, y) { return r.split('').map(function (c, x) { return post(c, x, y); }).join(''); });
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  };
  // a shape (or texture) turned by a about a pivot and then moved by (sx, sy),
  // and where a point lands under the same move: for posing a body
  var posed = function (f, px, py, a, sx, sy) { var g = turned(f, px, py, a); return function (x, y) { return g(x - sx, y - sy); }; };
  var posedAt = function (x, y, px, py, a, sx, sy) {
    var c = Math.cos(a), s = Math.sin(a);
    return [px + (x - px) * c - (y - py) * s + sx, py + (x - px) * s + (y - py) * c + sy];
  };
  // a clump of leaves: overlapping balls, each lit from the top left
  var clump5 = function (balls, tones) { return balls.map(function (b) { return O(b[0], b[1], b[2], b[2] * 0.92, tones || LEAF, (tones || LEAF).charAt(0)); }); };
  var look = function (sp, top) { sp.top = top || 0; return sp; };
  // eyes, looking left: big, small, closed, cross (knocked out), a big round one
  var EYE = ['.##.', '#ww#', '#Ew#', '#EE#', '.##.'];
  var EYE_S = ['.#.', '#Ew', '#EE', '.#.'];
  var SHUT = ['....', '#..#', '.##.'];
  var HAPPY = ['.##.', '#..#'];
  var EYE_L = ['.###.', '#www#', '#Eww#', '#EEw#', '#EEE#', '.###.'];

  /* ==========================================================================
     UNIVERSAL STUDIOS — the Minions, Gru's cheeky little helpers
     ========================================================================== */
  /* Minion: a yellow capsule in blue dungarees, one big goggle on a black
     strap, a few wisps of hair, black gloves and boots, and a grin that
     says he's up to something. Two waddling steps. */
  E.minion = [0, 1].map(function (f) {
    var k = f ? 1.3 : -1.3, body = rrect(3, 2.4, 19, 24, 8);
    var nh = f ? [5.4, 21.2] : [1.2, 18.8], fh = f ? [20.6, 18.6] : [20.4, 21.4];
    var lit = orb(9, 9, 13, 17, LEMON);
    var parts = [
      // the far arm and leg, behind him
      P('г', cap(17.6, 16.4, fh[0], fh[1], 1.3), orb(17, 15, 4, 6, 'бвгдд'), 'в'),
      P('h', ell(fh[0], fh[1] + 0.4, 1.7, 1.6), orb(fh[0] - 1, fh[1] - 1, 2, 2, INK), 'g'),
      P('и', cap(13.8, 22, 13.8 - k, 24.6, 1.7), orb(13, 22, 3, 4, 'зииий'), 'з'),
      P('h', ell(13.4 - k, 26.2, 2.6, 1.5), orb(12, 25, 4, 2, INK), 'g'),
      P('й', cap(8.4, 22, 8.4 + k, 24.6, 1.7), orb(7, 22, 3, 4, DENIM), 'з'),
      P('h', ell(8 + k, 26.2, 2.6, 1.5), orb(7, 25, 4, 2, INK), 'g'),
      // the yellow capsule; his dungarees over the bottom of it
      P('г', body, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y > 19.6 || rrect(6.4, 16.8, 15.6, 21, 1)(X, Y)) {
          var t = orb(7, 15, 14, 12, DENIM)(x, y);
          // a seam round the bib, a pocket on its front
          if (Y > 16.8 && Y < 20 && (Math.abs(X - 6.9) < 0.5 || Math.abs(X - 15.1) < 0.5)) return 'и';
          if (rrect(8.6, 17.8, 13.4, 20.4, 0.6)(X, Y)) return Math.abs(Y - 17.9) < 0.5 ? 'з' : step(DENIM, t, -1);
          return t;
        }
        return lit(x, y);
      }, 'в'),
      // straps over his shoulders, a gold button at each corner of the bib
      P('й', or(cap(7.2, 17.4, 3.6, 14.2, 0.8), cap(14.8, 17.4, 18.4, 14.2, 0.8)), null, 'з'),
      P('C', or(ell(7.4, 17.6, 0.9, 0.9), ell(14.6, 17.6, 0.9, 0.9)), null, 'A'),
      // the goggle strap, then the goggle: a silver rim round a big brown eye
      P('h', both(body, function (x, y) { return Math.abs(y - 9) < 1.4; }), function (x, y) { return y < 9 ? 'h' : 'g'; }),
      P('Q', ell(9.4, 9, 4.7, 4.7), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, dx = X - 9.4, dy = Y - 9, r = Math.sqrt(dx * dx + dy * dy);
        if (r > 3.3) return orb(8.4, 8, 4.7, 4.7, IRON)(x, y);
        var ix = X - 8, iy = Y - 9.4, ir = Math.sqrt(ix * ix + iy * iy);
        if (ir < 1.1) return 'E';
        if (ir < 2.1) return iy < 0 ? 'T' : 'U';
        return 'w';
      }, 'O'),
      // the near arm, swinging, and its glove
      P('г', cap(4.4, 16.4, nh[0], nh[1], 1.3), orb(4, 15, 4, 6, LEMON), 'в'),
      P('h', ell(nh[0], nh[1] + 0.4, 1.8, 1.7), orb(nh[0] - 1, nh[1] - 1, 2, 2, INK), 'g'),
      // a few wisps of hair
      P('g', or(limb([[10.6, 3.4], [10.2, 1.4], [9.2, 0.4]], 0.5), limb([[12.6, 3.2], [13, 0.8]], 0.5), limb([[14.4, 3.6], [15.8, 1.4]], 0.5)))
    ];
    // a sparkle in the goggle, a cheeky lopsided grin, a dimple
    return build(22, 28, parts, [[7, 8, ['w']], [5, 14, ['#.....#', '.#wwww#', '..####.']], [12, 14, ['.#']]]);
  });
  // this land's creatures, gathered for the sprite sheet (pushed at the end)
  var WORLD = [];
  var show = function (name, list) { (Array.isArray(list) ? list : [list]).forEach(function (s, i) { WORLD.push([i ? '' : name, s]); }); };
  show('minion', E.minion);

  /* ==========================================================================
     JAMAICA — the doctor bird (the island's own hummingbird)
     ========================================================================== */
  /* Hummingbird: the red-billed streamertail. Emerald all over, a black
     cap with a crest at the back, a long red bill tipped black, and two
     long black tail streamers that ripple behind. Wings a dark blur, up
     then down. */
  E.hummingbird = [0, 1].map(function (f) {
    var wv = function (k) { return Math.sin(k * 1.3 + f * 2.4) * 0.8 * k / 4; };
    var str = function (dy, len) { var pts = []; for (var k = 0; k <= 4; k++) pts.push([15 + k * len, 10.6 + k * dy + wv(k)]); return pts; };
    var s1 = str(0.55, 1.6), s2 = str(1.15, 1.45);
    var blur = function (x, y) { return (x + y * 2) % 4 === 0 ? 'M' : 'L'; };
    var parts = [
      // two long black streamers, rippling, each ending in a little flag
      P('g', or(limb(s1, 0.55), limb(s2, 0.55), ell(s1[4][0] - 0.6, s1[4][1], 1.4, 0.9), ell(s2[4][0] - 0.6, s2[4][1], 1.4, 0.9)), null),
      P('h', tri(13, 8.4, 17.4, 10, 14, 12.2), orb(14, 9, 3, 3, INK), 'g'),
      // the far wing: a pale blur over his back
      P('L', f ? turned(ell(15.2, 12.2, 4.6, 1.6), 15.2, 12.2, 0.5) : turned(ell(14.6, 3.4, 1.8, 3.8), 14.6, 3.4, 0.75), blur, 'M'),
      P('п', turned(ell(10.8, 9.4, 5.6, 3.7), 10.8, 9.4, -0.3), function (x, y) {
        // an emerald back, a brighter breast
        var t = orb(9.4, 7.6, 6.4, 5, EMER)(x, y);
        return y + 0.5 > 10.2 - (x - 9) * 0.3 ? step(EMER, t, 1) : t;
      }, 'н'),
      P('п', ell(6.2, 6.8, 3.6, 3.4), function (x, y) {
        // the black cap, a crest swept back from it
        return y + 0.5 < 5 + (x - 6) * 0.25 ? orb(5, 3.6, 4, 3, INK)(x, y) : orb(5.2, 5.8, 4, 4, EMER)(x, y);
      }, 'н'),
      P('g', tri(7.6, 3.4, 11.6, 2.6, 9.4, 5.2), orb(8, 3, 3, 2, INK), 'f'),
      P('x', cap(0.6, 7.6, 3.4, 7.3, 0.7), function (x) { return x < 1.4 ? 'g' : 'x'; }, 'v'),
      // the near wing, a pale blur: up, then down
      P('L', f ? turned(ell(12.4, 13, 4.8, 1.8), 12.4, 13, 0.25) : turned(ell(12.6, 3.6, 2, 4.4), 12.6, 3.6, 0.45), blur, 'M')
    ];
    return build(22, 16, parts, [[4, 5, EYE_S]]);
  });
  show('hummingbird', E.hummingbird);

  /* ==========================================================================
     AUSTRALIA — emus, kookaburras, crocs, a kangaroo to ride
     ========================================================================== */
  /* Emu: all shaggy brown feathers on long grey legs, a long blue neck,
     a small dark head with a flat beak and a big curious eye. Running:
     one leg reaching, one pushing off; then legs passing, one tucked. */
  var EMU_LEGS = [
    [[[16.4, 21], [12.6, 28], [9.6, 35.6]], [[20.6, 21], [24.2, 27.4], [27.4, 33.2]]],
    [[[17, 21], [19.6, 28], [15.4, 35.6]], [[20.6, 21], [25, 25.6], [21.6, 30]]]
  ];
  E.emu = [0, 1].map(function (f) {
    var L = EMU_LEGS[f];
    var leg = function (pts, far) {
      var ft = pts[2], up = ft[1] < 34;
      var toes = up ? or(cap(ft[0], ft[1], ft[0] + 2.2, ft[1] + 1.6, 0.7), cap(ft[0], ft[1], ft[0] + 0.4, ft[1] + 2.4, 0.7))
        : or(cap(ft[0], ft[1], ft[0] - 3.2, ft[1] + 1.4, 0.75), cap(ft[0], ft[1], ft[0] - 1.6, ft[1] + 1.8, 0.75), cap(ft[0], ft[1], ft[0] + 1.6, ft[1] + 1.2, 0.7));
      var tone = far ? 'NOOPP' : 'OPPQR';
      return [P(tone.charAt(2), or(limb(pts, 1.25), toes), orb(pts[0][0] - 2, pts[0][1], 5, 14, tone), 'N'),
        P(tone.charAt(2), ell(pts[1][0], pts[1][1], 1.8, 1.7), orb(pts[1][0] - 1, pts[1][1] - 1, 2, 2, tone), 'N')];
    };
    var shag = function (x, y) {
      var dx = (x - 18.6) / 10.6, dy = (y - 15.4) / 7.4, fr = y > 17 ? 0.16 * Math.sin(x * 1.6) : 0;
      return dx * dx + dy * dy <= 1 + fr;
    };
    var neck = tube([[5.6, 6.6, 1.6], [7.6, 10.6, 1.8], [9.6, 14, 2.4], [12, 16.4, 3]], 30);
    var parts = leg(L[1], true).concat([
      P('х', shag, function (x, y) {
        // long drooping feathers, combed down and back
        var t = orb(16, 12, 12, 9, EMU)(x, y), q = (x + 0.5 + (y + 0.5) * 0.4 + Math.sin(y * 0.7) * 0.8) % 3.2;
        return q < 0.9 ? step(EMU, t, -1) : q > 2.7 ? step(EMU, t, 1) : t;
      }, 'ф')
    ]).concat(leg(L[0])).concat([
      P('ъ', neck.f, function (x, y) {
        var a = neck.at(x + 0.5, y + 0.5);
        // blue skin at the throat, dark feathers down the back of the neck
        return a.s > 0.25 || (x + y) % 4 === 0 ? orb(5, 8, 6, 10, EMU)(x, y) : orb(6, 8, 6, 10, SLATE)(x, y);
      }, 'щ'),
      P('ф', ell(5.6, 6, 3.8, 3.4), function (x, y) { return (x * 3 + y) % 5 === 0 ? 'у' : orb(4.6, 5, 4, 4, 'уфхцц')(x, y); }, 'у'),
      P('O', or(tri(0.2, 7.4, 3.2, 5.6, 3.4, 8.6), ell(1.6, 7.2, 1.6, 1.1)), orb(1, 6, 3, 2, IRON), 'N')
    ]);
    return build(30, 38, parts, [[3, 3, EYE], [3, 8, ['3']]]);
  });
  show('emu', E.emu);

  /* Kookaburra: a big cream head with a brown stripe through the eye, an
     enormous beak, a brown back with blue spangles on the wing and a
     rufous tail barred black. Flapping; on the downstroke his beak's
     open — he's laughing. */
  E.kookaburra = [0, 1].map(function (f) {
    var parts = [
      // the tail, barred
      P('l', turned(rrect(18, 8.6, 27.6, 12.4, 1.6), 18, 10.5, -0.12), function (x, y) { return (x + 0.5) % 2.4 < 0.9 ? 'k' : orb(20, 8, 8, 5, ORANGE)(x, y); }, 'k'),
      // the far wing, over his back on the upstroke
      f ? null : P('T', turned(ell(20.6, 4.4, 6, 2.4), 20.6, 4.4, -0.55), orb(19, 2, 7, 5, 'SSTTU'), 'S'),
      P('U', ell(15.6, 11.2, 7.4, 4.6), function (x, y) {
        // a brown back, a cream breast
        return y + 0.5 > 11.6 + (x - 15) * 0.1 ? orb(13, 10, 8, 6, CREAM)(x, y) : orb(13, 8, 8, 6, WOOD)(x, y);
      }, 'T'),
      P('Y', ell(8.2, 8.8, 5.6, 5.2), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // a streaky brown crown, a dark stripe from the eye back to the nape
        if (Y < 6.4 && X > 6) return (x + y) % 3 ? orb(9, 4, 5, 3, WOOD)(x, y) : 'T';
        if (Math.abs(Y - (8.6 + (X - 9) * 0.12)) < 1 && X > 9) return 'S';
        return orb(7, 7, 6, 6, CREAM)(x, y);
      }, 'Z'),
      // the beak: dark above, pale below; open when he laughs
      P('g', or(tri(0.2, 10.4 - f, 4.6, 7.6, 5.4, 10), cap(1, 10 - f, 4.4, 9, 1.1)), orb(2, 8, 4, 3, INK), 'f'),
      P('Z', f ? or(tri(0.8, 13.2, 5.4, 10.2, 5.4, 12.2), cap(1.4, 12.8, 4.6, 11.6, 0.8)) : tri(0.4, 10.8, 5.4, 10, 5.4, 11.8), orb(2, 10, 5, 3, 'VZYYw'), 'V'),
      f ? P('x', tri(1.6, 11.6, 5, 10.2, 4.6, 11.4)) : null,
      // the near wing: brown, a patch of blue spangles at the shoulder
      P('T', f ? turned(ell(19, 14.4, 7.6, 2.8), 19, 14.4, 0.5) : turned(ell(18.2, 4.6, 7.6, 3), 18.2, 4.6, -0.78), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, sh = f ? [14.4, 11.6] : [14.6, 8.4], tip = f ? [24.6, 18.6] : [23, -0.6];
        if (Math.abs(X - sh[0]) + Math.abs(Y - sh[1]) < 3.4) return (x + y) % 2 ? 'ύ' : 'ώ';
        // dark flight feathers at the tip, each one drawn
        if (Math.abs(X - tip[0]) + Math.abs(Y - tip[1]) < 6.4) return (x + y) % 3 ? 'S' : 'T';
        return orb(14, 4, 9, 8, WOOD)(x, y);
      }, 'S')
    ].filter(Boolean);
    return build(28, 20, parts, [[4, 6, EYE]]);
  });
  show('kookaburra', E.kookaburra);

  /* Crocodile, lurking in the billabong: just his eyes, his nostrils and
     the ridges of his back above the water, the rest of him a faint
     shape beneath it (half-lidded: sneaky). Then snapping: up out of
     the water, jaws wide, every tooth showing, his eyes wide open and
     a grin — he's more show than bite. */
  var CROC_TEX = function (wl, light) {
    var lit = orb(14, 6, 26, 12, CROC);
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = lit(x, y);
      // a scaly band of darker squares down his back
      if ((Math.floor(X / 2.4) + Math.floor(Y / 2.4)) % 2 === 0 && Y < (light || 99)) t = step(CROC, t, -1);
      return Y > wl ? swapRamp(CROC, WATER, t) : t;
    };
  };
  var crocPost = function (wl) {
    return function (c, x, y) { return y + 0.5 > wl + 1 && c === '#' ? 'ѓ' : c; };
  };
  var crocLurk = (function () {
    var wl = 10;
    var body = or(rrect(1, 10.2, 17, 15, 2.4), ell(16, 12.4, 5, 3.8), ell(27, 13.4, 11.4, 3.8), taper([[36, 13.4], [41, 13.8], [45.6, 12.6]], 3, 0.8));
    var ridges = [];
    for (var i = 0; i < 6; i++) ridges.push(tri(19.6 + i * 3, 10, 21 + i * 3, 8, 22.4 + i * 3, 10));
    return buildWith(46, 20, [
      P('я', body, CROC_TEX(wl), 'ю'),
      P('я', or.apply(null, ridges), orb(24, 6, 16, 6, CROC), 'ю'),
      P('я', ell(3.2, 10.2, 2, 1.6), orb(2.6, 9.4, 2.4, 2, CROC), 'ю'),
      O(17.4, 8.4, 2.6, 2.4, 'эюяёё', 'ю'),
      O(12.8, 8.2, 2.9, 2.7, CROC, 'ю'),
      // ripples round everything that breaks the surface
      P('ї', or(cap(8.4, 10.6, 9.6, 10.6, 0.55), cap(20, 10.6, 18.6, 10.6, 0.55), cap(0.4, 10.6, 0.9, 10.6, 0.55), cap(5.6, 10.6, 6.4, 10.6, 0.55), cap(38.4, 10.6, 39.6, 10.6, 0.55)), function (x) { return x % 2 ? 'ї' : 'і'; })
    ], [[11, 7, ['####', '#Ew#', '.##.']], [16, 7, ['###', '#Ew']], [2, 9, ['#']]], crocPost(wl));
  })();
  var crocSnap = (function () {
    var wl = 14, hx = 16.6, hy = 9.6;
    var U0 = [hx, 7.4], U1 = [2.4, 1.6], L0 = [hx, 12.6], L1 = [2.6, 15.2];
    var upper = taper([U0, [9.4, 4.4], U1], 3, 2.1), lower = taper([L0, [9.4, 14.2], L1], 2.6, 1.8);
    var body = or(ell(hx + 1, hy + 1, 5.4, 4.8), ell(29, 15, 12, 4.2), taper([[39, 15], [43.4, 14.4], [45.6, 11.8]], 3, 0.8));
    var ridges = [];
    for (var i = 0; i < 6; i++) ridges.push(tri(21 + i * 3, 11.4, 22.4 + i * 3, 9.2, 23.8 + i * 3, 11.4));
    // teeth along the inside of both jaws, pointing into the mouth
    var teeth = [], tooth = function (j0, j1, r0, r1, side, u) {
      var dx = j1[0] - j0[0], dy = j1[1] - j0[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side;
      var r = r0 + (r1 - r0) * u, bx = j0[0] + dx * u + nx * (r - 0.3), by = j0[1] + dy * u + ny * (r - 0.3);
      return tri(bx - ux * 1.1, by - uy * 1.1, bx + ux * 1.1, by + uy * 1.1, bx + nx * 2.3, by + ny * 2.3);
    };
    [0.3, 0.48, 0.66, 0.84].forEach(function (u) { teeth.push(tooth(U0, U1, 3, 2.1, -1, u), tooth(L0, L1, 2.6, 1.8, 1, u - 0.08)); });
    return buildWith(46, 20, [
      P('я', or.apply(null, [body].concat(ridges)), CROC_TEX(wl), 'ю'),
      // inside his mouth: pink, a tongue, dark at the back
      P('q', or(tri(hx + 1.4, hy + 0.6, 2.4, 2.6, 3, 14.6), tri(hx + 1.4, hy + 0.6, 9, 5.4, 9, 13.6)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (X > hx - 3) return 'p';
        return Y > 11.6 - (hx - X) * 0.05 ? orb(10, 11, 6, 3, PINK)(x, y) : 'q';
      }),
      P('w', or.apply(null, teeth), function (x, y) { return (x + y) % 3 ? 'w' : 'W'; }, 'W'),
      P('я', lower, function (x, y) { return y + 0.5 > 14.2 + (hx - x) * 0.12 ? orb(8, 13, 9, 4, CREAM)(x, y) : orb(10, 12, 12, 5, CROC)(x, y); }, 'ю'),
      P('я', upper, function (x, y) { return (x * 2 + y) % 7 === 0 ? 'ю' : orb(8, 1, 12, 7, CROC)(x, y); }, 'ю'),
      P('я', ell(2.6, 1.6, 2, 1.6), orb(2, 0.8, 2.4, 2, CROC), 'ю'),
      O(20.8, 5, 2.6, 2.6, 'эюяёё', 'ю'),
      O(16.4, 4.8, 3, 3, CROC, 'ю'),
      // a splash where he burst up out of the water
      P('L', or(ell(8, 17.6, 2.4, 1.2), ell(4.2, 16, 1, 1), ell(12.6, 18.6, 1.4, 0.9), ell(37.6, 11.2, 0.9, 0.9), ell(41.6, 9.6, 1, 1)), function (x, y) { return y < 17 ? 'w' : 'L'; }, 'M')
    ], [[14, 3, EYE], [19, 3, ['.##', '#ww', '#Ew', '#EE']], [2, 1, ['#']], [19, 9, ['3']]], crocPost(wl));
  })();
  E.croc = [crocLurk, crocSnap];
  show('croc', E.croc);

  /* Kangaroo: a big red kangaroo, friendly, ears up, who lets Bonnie ride
     in her pouch. Sitting back on her tail, and two hops: pushing off
     with her great feet, then tucked up in the air, tail out behind.
     Her pouch is drawn open and empty; .pouch is where the rider's head
     goes (its centre, peeking out over the lip at y ~31 when sitting). */
  var ROO_HIP = [26, 34];
  var roo = function (mode) {
    var a = mode === 'sit' ? 0 : mode === 'h0' ? -0.3 : -0.42, sx = mode === 'sit' ? 0 : 3, sy = mode === 'sit' ? 0 : mode === 'h0' ? -2 : -5;
    var hp = ROO_HIP, T = function (f) { return posed(f, hp[0], hp[1], a, sx, sy); }, at = function (x, y) { var q = posedAt(x, y, hp[0], hp[1], a, sx, sy); return [Math.round(q[0]), Math.round(q[1])]; };
    var torso = tube([[26.5, 36, 8.4], [22, 26, 8.2], [18.6, 17.4, 5.8], [16.2, 12, 3.6]], 40);
    var lip = function (x) { var u = (x - 19) / 9.4; return 30.4 + 1.3 * (1 - u * u); };
    var parts = [];
    // the tail and the far foot, behind her
    var tl = mode === 'sit' ? [[30, 38, 4.4], [36.4, 41.6, 3.2], [41, 44, 2.1], [43.6, 44.8, 1.1]]
      : mode === 'h0' ? [[31, 37, 4.4], [37, 37, 3.2], [41.6, 34.4, 2.2], [43.6, 31.6, 1.1]]
      : [[31, 35, 4.4], [37, 36.6, 3.2], [41.6, 37, 2.2], [43.6, 36.4, 1.1]];
    var tail = tube(tl.map(function (p) { return [p[0] + (mode === 'sit' ? 0 : 0), p[1] + sy, p[2]]; }), 30);
    parts.push(P('њ', tail.f, function (x, y) { var q = tail.at(x + 0.5, y + 0.5); return q.s > 0.4 ? 'ћ' : orb(34, 34 + sy, 12, 10, ROO)(x, y); }, 'љ'));
    var feet = mode === 'sit' ? [[[31, 43.4 + 0], [18, 44]], [[30.6, 43.4], [14.6, 44.4]]]
      : mode === 'h0' ? [[[32, 38 + sy], [38, 45.2]], [[31, 38.4 + sy], [35.6, 45.6]]]
      : [[[31, 40 + sy], [19.6, 39.4 + sy]], [[30.6, 40.6 + sy], [16, 40.4 + sy]]];
    parts.push(P('љ', or(cap(feet[0][0][0], feet[0][0][1], feet[0][1][0], feet[0][1][1], 1.6), ell(feet[0][0][0], feet[0][0][1] - 1, 2.4, 2.4)), orb(24, 38, 14, 8, 'јљљњћ'), 'ј'));
    // her body: a big pear, a cream front
    parts.push(P('њ', T(torso.f), T(function (x, y) {
      var q = torso.at(x + 0.5, y + 0.5), t = orb(19, 18, 16, 22, ROO)(x, y);
      return q.s < -0.3 ? step(ROO, t, 2) : t;
    }), 'љ'));
    // the far ear, then the head: a long soft muzzle, a black nose
    parts.push(P('њ', T(tri(18, 6, 22.2, -0.2, 23, 7.4)), T(orb(21, 2, 4, 6, 'јљњњћ')), 'ј'));
    parts.push(P('њ', T(or(ell(14.2, 9, 5.8, 5), ell(8.6, 11.2, 4.6, 3))), T(function (x, y) {
      return y + 0.5 > 11.6 && x < 14 ? orb(8, 10, 6, 4, 'њћћќќ')(x, y) : orb(12, 6, 8, 7, ROO)(x, y);
    }), 'љ'));
    parts.push(P('g', T(ell(4.6, 10.2, 1.7, 1.3)), T(orb(4, 9.6, 2, 1.6, INK)), 'f'));
    parts.push(P('њ', T(tri(13.8, 5.6, 16.4, -0.6, 19.6, 6.2)), T(function (x, y) {
      return tri(15, 5, 16.4, 1.2, 18.4, 5.4)(x + 0.5, y + 0.5) ? 'r' : orb(15, 1, 5, 6, ROO)(x, y);
    }), 'љ'));
    // the pouch: a soft cream pocket, its lip sagging open, empty inside
    parts.push(P('S', T(function (x, y) { return ell(19, 31.4, 8.4, 2.6)(x, y) && y < lip(x) + 0.6; }), T(function (x, y) { return y + 0.5 < 30.6 ? 'S' : 'T'; }), 'S'));
    parts.push(P('ћ', T(function (x, y) { return ell(19, 34.2, 9.6, 6.2)(x, y) && y > lip(x); }), T(function (x, y) {
      var Y = y + 0.5, t = orb(16, 30, 12, 9, 'љњћќќ')(x, y);
      if (Y < lip(x + 0.5) + 1.2) return 'ќ';
      return Math.abs(Y - lip(x + 0.5) - 4.4) < 0.5 && Math.abs(x + 0.5 - 19) < 6 ? 'њ' : t;
    }), 'њ'));
    // the near arm, a paw resting on the pouch's edge
    parts.push(P('њ', T(or(limb([[18.6, 20.4], [15.4, 24], [12.6, 27.6]], 1.4), ell(12, 28.6, 1.8, 1.5))), T(orb(14, 22, 5, 6, ROO)), 'љ'));
    // the great haunch, and the near foot
    parts.push(P('њ', T(ell(28.4, 36, 7.6, 7.2)), T(orb(25, 32, 10, 10, ROO)), 'љ'));
    if (mode !== 'sit') parts[parts.length - 1] = P('њ', ell(28.4 + sx - 1, 35 + sy, 7.6, 7.2), orb(25 + sx, 31 + sy, 10, 10, ROO), 'љ');
    parts.push(P('љ', or(cap(feet[1][0][0], feet[1][0][1], feet[1][1][0], feet[1][1][1], 1.8), ell(feet[1][0][0], feet[1][0][1] - 1.2, 2.8, 2.8)), orb(22, 38, 16, 8, ROO), 'ј'));
    var e = at(11, 5), m = at(6, 12.6), ch = at(11, 11);
    var built = build(44, 46, parts, [[e[0], e[1], EYE], [m[0], m[1], ['#..', '.##']], [ch[0], ch[1], ['3']]]);
    var pc = posedAt(19, 23, hp[0], hp[1], a, sx, sy);
    built.pouch = [Math.round(pc[0]), Math.round(pc[1])];
    return built;
  };
  E.kangaroo = { sit: roo('sit'), hop: [roo('h0'), roo('h1')] };
  show('kangaroo', [E.kangaroo.sit, E.kangaroo.hop[0], E.kangaroo.hop[1]]);

  /* Orca: leaping out of the sea in an arc, glossy black above, white
     beneath, the white patch behind his eye, a grey saddle behind his
     tall fin, the flukes flicking spray as they leave the water. */
  E.orca = [(function () {
    var body = tube([[2.4, 24.4, 2.8], [9, 17.6, 6], [20, 13.2, 7.6], [32, 13.6, 7.2], [43, 17.8, 5], [50.6, 23.4, 2.6], [53.6, 25.6, 1.4]], 60);
    var gloss = orb(18, 6, 30, 14, INK), belly = orb(18, 16, 34, 16, SNOW);
    var patch = turned(ell(13.4, 13.6, 3.2, 1.5), 13.4, 13.6, -0.5);
    return build(60, 32, [
      P('h', or(turned(ell(57, 22.6, 4, 1.5), 57, 22.6, -0.75), turned(ell(57.6, 28.4, 4, 1.5), 57.6, 28.4, 0.6), ell(54.4, 25.6, 2, 2)), orb(54, 22, 5, 6, INK), 'g'),
      P('h', tri(23.6, 8, 32.6, 8.4, 30.6, 0.2), function (x, y) { return x + 0.5 < 26 + y * 0.35 ? 'i' : orb(26, 2, 6, 8, INK)(x, y); }, 'g'),
      P('h', body.f, function (x, y) {
        var q = body.at(x + 0.5, y + 0.5);
        if (patch(x + 0.5, y + 0.5)) return belly(x, y);
        // the grey saddle behind the fin
        if (q.t > 0.52 && q.t < 0.64 && q.s < -0.62) return 'O';
        // white chin and belly, sweeping up the flank towards the tail
        if (q.s > 0.4 - (q.t > 0.56 && q.t < 0.84 ? 0.55 * Math.sin((q.t - 0.56) / 0.28 * Math.PI) : 0)) return belly(x, y);
        return gloss(x, y);
      }, 'g'),
      // the near flipper
      P('h', turned(ell(17.6, 24.4, 3.8, 1.8), 17.6, 24.4, 0.75), orb(16, 23, 4, 3, INK), 'g'),
      // spray flicking off the flukes
      P('L', or(ell(50.4, 30.6, 2.6, 1.2), ell(46.6, 28.4, 1, 1), ell(59, 31.2, 1, 0.8), ell(55.6, 31, 1.6, 0.9), ell(52, 27.2, 0.8, 0.8)), function (x, y) { return y < 30 ? 'w' : 'L'; }, 'M')
    ], [[7, 16, ['.ii.', 'iEwi', 'iEEi', '.ii.']], [3, 24, ['#....', '.###.']], [11, 18, ['3']]]);
  })()];
  show('orca', E.orca);

  /* ==========================================================================
     DINOSAUR LAND
     ========================================================================== */
  /* Triceratops: a stocky blue trike with an orange frill speckled gold,
     three cream horns, a hooked beak and a determined little frown. It
     charges, head down. Two thumping steps. */
  E.trike = [0, 1].map(function (f) {
    var k = f ? 1.4 : -1.4;
    var leg = function (x, dx, far) {
      var t = far ? 'БББГД' : TRIKE;
      return [P(t.charAt(2), or(cap(x, 19, x + dx, 27.4, 2.6), ell(x + dx - 0.4, 28, 3.2, 1.8)), orb(x - 2, 20, 5, 9, t), t.charAt(0)),
        P('Y', or(ell(x + dx - 2.6, 28.8, 0.9, 0.8), ell(x + dx - 0.6, 29, 0.9, 0.8)), null)];
    };
    var parts = [].concat(leg(21.4, k, true), leg(35, -k, true), [
      P('Д', taper([[37, 15], [41.4, 16.6], [43.6, 19.6]], 3.2, 1), orb(38, 14, 7, 6, TRIKE), 'Г'),
      P('Д', ell(27.6, 16, 13.2, 8.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(22, 10, 18, 14, TRIKE)(x, y);
        // darker bands across the back, a pale belly
        if (Y > 19.6 + (X - 27) * 0.05) return step(TRIKE, t, 1);
        return (X + Y * 0.4) % 5.4 < 1.4 && Y < 16 ? step(TRIKE, t, -1) : t;
      }, 'Г')
    ], leg(17.4, -k), leg(31, k), [
      // the frill: a great scalloped fan behind his head, spotted gold
      P('m', turned(function (x, y) {
        var dx = x - 16.4, dy = y - 10.4, a = Math.atan2(dy, dx);
        return (dx * dx) / 51 + (dy * dy) / 81 <= Math.pow(1 + 0.07 * Math.cos(a * 9), 2);
      }, 16.4, 10.4, 0.45), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, dx = X - 16.4, dy = Y - 10.4, t = orb(13, 5, 12, 12, ORANGE)(x, y);
        if ([[17.4, 4.2], [21.6, 8.4], [21.4, 13.6], [13.2, 3.2]].some(function (p) { return ell(p[0], p[1], 1.5, 1.5)(X, Y); })) return 'C';
        return (dx * dx) / 51 + (dy * dy) / 81 > 0.62 ? step(ORANGE, t, -1) : t;
      }, 'k'),
      // the far brow horn
      P('Z', taper([[12.4, 11.6], [7, 8.4], [2.6, 6.8]], 1.6, 0.7), orb(8, 7, 6, 3, 'VVZZY'), 'V'),
      // his head, the hooked beak, the horns
      P('Д', or(ell(10.4, 16.4, 7, 6), ell(5.4, 18.2, 4.4, 3.8)), orb(7, 12, 10, 9, TRIKE), 'Г'),
      P('Q', tri(0.4, 19.8, 4.6, 15.4, 5.8, 21.6), orb(2, 17, 4, 4, IRON), 'O'),
      P('Y', taper([[4.8, 15.6], [3.4, 13.4], [2.6, 12]], 1.4, 0.6), orb(3, 12, 3, 3, CREAM), 'V'),
      P('Y', taper([[10.8, 12], [5.4, 9.2], [0.6, 8]], 1.9, 0.7), orb(5, 8, 7, 3, CREAM), 'V')
    ]);
    return build(44, 30, parts, [[8, 13, ['##..']], [8, 14, EYE_S], [11, 18, ['3']], [2, 20, ['.#', '#.']]]);
  });
  show('trike', E.trike);

  /* Baby dino: a little mint hatchling with a bit of its eggshell still
     on its head, a huge eye, a blush, a stumpy tail, toddling after
     whoever it saw first. */
  var shellCap = function (cx, cy, rx, ry) {
    return function (x, y) { return ell(cx, cy, rx, ry)(x, y) && y < cy + 0.6 + Math.abs(((x * 0.9) % 2) - 1) * 1.4; };
  };
  var SPECK = function (base) {
    return function (x, y) { var h = (Math.floor(x) * 7 + Math.floor(y) * 13) % 11; return h === 0 ? 'T' : h === 5 ? 'Ю' : base(x, y); };
  };
  E.babydino = [0, 1].map(function (f) {
    var k = f ? 1 : -1;
    return build(22, 20, [
      P('Э', or(cap(15.4, 15.6, 15.4 - k, 18.4, 1.7), ell(15 - k, 19, 2.2, 1)), orb(14, 15, 3, 4, 'ЫЫЬЬЭ'), 'Ы'),
      P('Э', taper([[16.6, 13.4], [19.6, 12.6], [21.4, 10]], 2.2, 0.8), orb(18, 11, 4, 3, BABY), 'Ь'),
      P('Э', ell(13.6, 13.8, 5.4, 4), function (x, y) {
        var t = orb(12, 11, 7, 6, BABY)(x, y);
        if (y + 0.5 > 15 && x < 14) return step(BABY, t, 1);
        return ell(15.6, 11.8, 1, 0.9)(x + 0.5, y + 0.5) || ell(18, 13.4, 0.9, 0.8)(x + 0.5, y + 0.5) ? 'Ь' : t;
      }, 'Ь'),
      P('Э', or(cap(11, 15.6, 11 + k, 18.4, 1.7), ell(10.6 + k, 19, 2.2, 1)), orb(10, 15, 3, 4, BABY), 'Ь'),
      P('Э', cap(9.6, 13.6, 8.4, 15, 0.9), null, 'Ь'),
      P('Э', or(ell(8.4, 8.6, 6.4, 5.8), ell(4.4, 10.2, 4, 3.4)), orb(6.6, 6.6, 8, 7, BABY), 'Ь'),
      // a cap of broken eggshell, speckled
      P('Y', shellCap(9, 3.6, 5, 3.4), SPECK(orb(7, 1, 6, 4, CREAM)), 'Z')
    ], [[4, 4, EYE_L], [2, 11, ['#....', '.###.']], [9, 10, ['3']], [1, 9, ['#']]]);
  });
  show('babydino', E.babydino);

  /* A dinosaur egg, speckled: whole, cracking (and rocking), and the
     empty broken shell left behind. */
  var eggF = function (cx, cy, rx, ry) {
    return function (x, y) { var ny = (y - cy) / ry, w = rx * (1 + 0.13 * ny); return ((x - cx) / w) * ((x - cx) / w) + ny * ny <= 1; };
  };
  var eggTex = SPECK(orb(7, 6, 9, 11, CREAM));
  A.egg = [
    build(18, 20, [P('Y', eggF(9, 10.6, 7.6, 9.2), eggTex, 'Z')], [[5, 4, ['w']], [4, 5, ['w']]]),
    build(18, 20, [P('Y', turned(eggF(9, 10.6, 7.6, 9.2), 9, 19, 0.14), turned(eggTex, 9, 19, 0.14), 'Z')],
      [[3, 8, ['#.....#....', '.#...#.#.#.', '..#.#...#.#', '...#.......']], [6, 3, ['w']], [12, 9, ['.#', '#.']]]),
    build(18, 20, [
      // the back of the shell, its inside in shade, seen over the broken front
      P('V', function (x, y) { return eggF(9, 10.6, 7.6, 9.2)(x, y) && y > 7.4 + Math.abs(((x * 0.7 + 0.5) % 2) - 1) * 2.4 && y < 11; }, function (x, y) { return y + 0.5 < 9.4 ? 'U' : 'V'; }, 'U'),
      P('Y', function (x, y) { return eggF(9, 10.6, 7.6, 9.2)(x, y) && y > 10.2 + Math.abs(((x * 0.8) % 2) - 1) * 2.2; }, eggTex, 'Z'),
      P('Y', or(turned(ell(2.6, 18.6, 2, 1.1), 2.6, 18.6, -0.3), ell(16, 18.8, 1.6, 0.9)), null, 'Z')
    ], [[3, 13, ['w']]])
  ];
  show('egg', A.egg);

  /* Pterodactyl: a coral pteranodon with a long crest, a long yellow
     beak and a big kind eye, wings spread wide, who carries Bonnie
     across the gaps: he hangs on below by its feet. Wings up, wings
     down. .feet is where the rider's hands go. */
  var ptero = function (up) {
    var cx = 26, parts = [];
    var wing = function (dir) {
      var X = function (d) { return cx + dir * d; };
      var sh = [X(3), 12.4], el = up ? [X(12.6), 5] : [X(12.6), 15.4], tip = up ? [X(25.6), 0.8] : [X(25.4), 25.4];
      var mid = up ? [X(14), 14.4] : [X(13.4), 23.4], hip = [X(3), 19];
      var mem = or(tri(sh[0], sh[1], el[0], el[1], hip[0], hip[1]), tri(el[0], el[1], mid[0], mid[1], hip[0], hip[1]), tri(el[0], el[1], tip[0], tip[1], mid[0], mid[1]));
      // the trailing edge, scalloped between the fingers
      var bites = [];
      [[tip, mid], [mid, hip]].forEach(function (e) {
        for (var k = 1; k < 3; k++) {
          var u = k / 3, bx = e[0][0] + (e[1][0] - e[0][0]) * u, by = e[0][1] + (e[1][1] - e[0][1]) * u;
          bites.push(ell(bx + (up ? dir * 0.4 : 0), by + 1.6, 1.9, 1.7));
        }
      });
      var membrane = but(mem, or.apply(null, bites));
      return [
        P('Л', membrane, function (x, y) {
          var Xp = x + 0.5, Yp = y + 0.5, t = orb(cx - dir * 4, up ? 0 : 8, 30, 22, 'ЙЛЛПФ')(x, y);
          // the fine bones fanning across it
          var vx = Xp - el[0], vy = Yp - el[1], ang = Math.atan2(vy, vx * dir);
          return Math.abs(Math.sin(ang * 3.2)) < 0.12 ? 'Й' : t;
        }, 'Й'),
        P('Й', or(limb([sh, el, tip], 1.1), ell(tip[0], tip[1], 1.3, 1.3)), orb(cx, 2, 20, 14, 'ИЙЙЛП'), 'И'),
        P('Y', or(cap(el[0], el[1], el[0] - dir * 1.8, el[1] - 1.8, 0.6), cap(el[0], el[1], el[0] - dir * 0.4, el[1] - 2.4, 0.6)), null, 'V')
      ];
    };
    parts = parts.concat(wing(1), wing(-1));
    parts.push(
      P('Л', or(taper([[cx + 2, 18], [cx + 5.4, 22], [cx + 6.6, 24.6]], 1.4, 0.5)), null, 'Й'),
      // legs hanging down, little gripping feet
      P('Л', or(cap(cx - 2, 18, cx - 2.6, 23.2, 1.1), cap(cx + 2, 18, cx + 2.6, 23.2, 1.1)), orb(cx, 18, 4, 6, PTERO), 'Й'),
      P('Y', or(ell(cx - 2.8, 24, 1.6, 1.2), ell(cx + 2.8, 24, 1.6, 1.2)), orb(cx, 23, 4, 2, 'VVZYw'), 'V'),
      P('Л', ell(cx, 14.6, 4.8, 5.4), function (x, y) { var t = orb(cx - 2, 12, 6, 7, PTERO)(x, y); return x + 0.5 < cx - 0.5 && y > 14 ? step(PTERO, t, 1) : t; }, 'Й'),
      // the crest, the head, the long beak
      P('П', tri(17.4, 7.6, 27.6, 1.4, 20.4, 10.6), function (x, y) { return y + 0.5 < 6 + (x - 18) * -0.1 + (x - 18) * 0 ? orb(22, 3, 6, 5, ORANGE)(x, y) : orb(22, 5, 7, 6, ORANGE)(x, y); }, 'l'),
      P('Л', cap(cx - 2, 12, 18.4, 10.6, 2.2), orb(20, 9, 6, 4, PTERO), 'Й'),
      P('Л', ell(17, 10, 4, 3.4), orb(15.6, 8.6, 4.4, 4, PTERO), 'Й'),
      P('C', tri(1.4, 13.2, 14.6, 8.6, 15, 12.4), function (x, y) { return y + 0.5 > 11.6 - (14 - x) * 0.12 ? orb(8, 11, 8, 3, 'ABBCD')(x, y) : orb(8, 9, 9, 4, GOLD)(x, y); }, 'A')
    );
    var sp = build(52, 34, parts, [[15, 7, EYE], [17, 12, ['3']], [5, 11, ['##..', '..##']]]);
    sp.feet = [cx, 25];
    return sp;
  };
  E.ptero = { fly: [ptero(true), ptero(false)] };
  show('ptero', E.ptero.fly);

  /* T. rex: the big one, for the chase at the end of Dinosaur Land.
     Thrilling but daft: an enormous head, a toothy grin, a big round eye,
     stripes down his back, and the tiniest arms. Two pounding strides,
     and a roar: head thrown back, jaws wide, eyes squeezed shut, arms
     waving. Never gory: his mouth is pink and so is his tongue. */
  var fangs = function (j0, j1, side, n, from, to, len) {
    var dx = j1[0] - j0[0], dy = j1[1] - j0[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side, out = [];
    for (var k = 0; k < n; k++) {
      var u = from + (to - from) * k / (n - 1), bx = j0[0] + dx * u, by = j0[1] + dy * u;
      out.push(tri(bx - ux * 1.3, by - uy * 1.3, bx + ux * 1.3, by + uy * 1.3, bx + nx * len, by + ny * len));
    }
    return or.apply(null, out);
  };
  var REX_LEGS = {
    r0: { near: [[49, 45], [46, 53], [50, 59.6], [42, 65.4]], far: [[56, 44], [60, 52], [68, 56.6], [71, 62.6]] },
    r1: { near: [[54, 45], [56, 53], [64, 57.6], [67, 63.6]], far: [[50, 44], [47, 52], [49, 59.6], [40, 65.4]] },
    roar: { near: [[46, 45], [43, 53], [46, 59.6], [38, 65.4]], far: [[58, 44], [60, 52], [64, 59.6], [58, 65.4]] }
  };
  var rex = function (mode) {
    var roar = mode === 'roar', bob = mode === 'r1' ? -1 : 0, Lg = REX_LEGS[mode];
    var hinge = [30, 17 + bob], ua = roar ? 0.34 : 0, la = roar ? -0.2 : 0;
    var UP = function (f) { return ua ? posed(f, hinge[0], hinge[1], ua, 0, 0) : f; }, LO = function (f) { return la ? posed(f, hinge[0], hinge[1], la, 0, 0) : f; };
    var uAt = function (x, y) { var q = ua ? posedAt(x, y, hinge[0], hinge[1], ua, 0, 0) : [x, y]; return [Math.round(q[0]), Math.round(q[1])]; };
    var green = orb(30, 12, 50, 40, REX), belly = orb(30, 30, 30, 30, CREAM);
    var stripes = function (x, y, t) { return (x + 0.5 - (y + 0.5) * 0.7) % 7.4 < 2 ? step(REX, t, -1) : t; };
    var parts = [];
    var leg = function (L, far) {
      var T = far ? 'ЦЦЧЧШ' : REX, dk = far ? 'ЦЦЦЧЧ' : 'ЦЧЧШЩ';
      var toes = or(cap(L[3][0], L[3][1], L[3][0] - 4.6, L[3][1] + 0.6, 1.5), cap(L[3][0], L[3][1], L[3][0] - 3.6, L[3][1] + 1.6, 1.3), cap(L[3][0], L[3][1], L[3][0] + 2.4, L[3][1] + 0.8, 1.3));
      return [
        P(T.charAt(2), or(limb([L[1], L[2]], 3.2), limb([L[2], L[3]], 2.4), toes), orb(L[1][0] - 4, L[1][1], 10, 14, dk), T.charAt(0)),
        P('Y', or(ell(L[3][0] - 5, L[3][1] + 0.8, 1, 0.8), ell(L[3][0] - 4, L[3][1] + 1.8, 1, 0.8)), null),
        P(T.charAt(2), ell(L[0][0], L[0][1] + bob, 8.6, 10), orb(L[0][0] - 4, L[0][1] - 5, 12, 14, T), T.charAt(0))
      ];
    };
    parts = parts.concat(leg(Lg.far, true));
    var tailTip = mode === 'r1' ? 26 : mode === 'roar' ? 24 : 31;
    var tail = tube([[58, 39 + bob, 11], [69, 34 + bob, 7.4], [77, 30 + bob, 4.4], [83.4, tailTip + bob, 1.4]], 40);
    var body = tube([[31, 20 + bob, 7.6], [37, 29 + bob, 10.6], [48, 37 + bob, 13.4], [60, 40 + bob, 12]], 40);
    var bodyTex = function (sh, y0) {
      return function (x, y) {
        // lit across the body: bright along the top, a cream belly beneath
        var q = sh.at(x + 0.5, y + 0.5);
        if (q.s > 0.46) return q.s > 0.8 ? 'Z' : 'Y';
        var t = q.s < -0.62 ? 'Щ' : q.s < 0.12 ? 'Ш' : 'Ч';
        return q.s < 0.12 ? stripes(x, y, t) : t;
      };
    };
    parts.push(P('Ш', tail.f, bodyTex(tail), 'Ч'), P('Ш', body.f, bodyTex(body), 'Ч'));
    parts = parts.concat(leg(Lg.near));
    // tiny arms, and their two tiny claws
    var arm = roar ? [[39, 31 + bob], [35.4, 27.6], [33, 24]] : [[39.4, 32 + bob], [35.6, 36.4 + bob], [31.4, 35 + bob]];
    var hand = arm[2];
    parts.push(P('Щ', limb(arm, 1.9), orb(34, 29, 7, 8, 'ЧШЩЩЪ'), 'Ч'),
      P('Y', or(cap(hand[0], hand[1], hand[0] - 2.4, hand[1] - (roar ? 2 : 1.6), 0.7), cap(hand[0], hand[1], hand[0] - 2.6, hand[1] + (roar ? 0 : 0.8), 0.7)), null, 'V'));
    // the lower jaw
    var jaw = rrect(4.6, 18.4, 30, 26.2, 4);
    parts.push(P('Ш', LO(jaw), LO(function (x, y) { return y + 0.5 > 22.6 ? belly(x, y) : green(x, y); }), 'Ч'));
    if (roar) {
      // inside the open mouth: pink, a tongue, two rows of teeth
      var u0 = uAt(5, 20.4), l0 = posedAt(6, 19, hinge[0], hinge[1], la, 0, 0);
      parts.push(P('q', tri(hinge[0] + 1, hinge[1] + 2, u0[0] - 1, u0[1], l0[0] - 1, l0[1] + 0.6), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (ell(17, 25.6, 9, 3)(X, Y)) return orb(14, 24, 8, 3, PINK)(x, y);
        return X > 25 ? 'p' : 'q';
      }));
      parts.push(P('w', or(fangs(u0, uAt(26, 20.2), -1, 6, 0.04, 0.82, 3), fangs([l0[0], l0[1]], posedAt(26, 19, hinge[0], hinge[1], la, 0, 0), 1, 5, 0.06, 0.8, 2.6)), function (x, y) { return (x + y) % 4 ? 'w' : 'W'; }, 'W'));
    }
    // the great head
    var skull = or(ell(20.4, 11.4, 14.6, 9.4), rrect(2.4, 7.4, 31, 20.6, 6));
    parts.push(P('Ш', UP(skull), UP(function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = green(x, y);
      // a bony brow over the eye, darker stripes over the back of the head
      if (X > 26 && (X - Y * 0.7) % 7.4 < 2) return step(REX, t, -1);
      return t;
    }), 'Ч'));
    var st = [];
    if (!roar) {
      // the grin: a zigzag of teeth along a mouth that turns up at the back
      parts.push(P('u', function (x, y) { var m = 20.4 - Math.max(0, x - 23) * 0.55; return x > 4.4 && x < 29 && Math.abs(y - m) < 1.7; }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, m = 20.4 - Math.max(0, X - 23) * 0.55, z = Math.abs((X % 3) - 1.5);
        if (Y < m && Y - (m - 1.7) < 1.6 - z) return 'w';
        if (Y > m && (m + 1.7) - Y < z + 0.1) return 'w';
        return 'u';
      }));
      st.push([17, 4, ['.####..']], [18, 5, EYE_L], [4, 11, ['##']], [24, 14, ['3']]);
    } else {
      var e = uAt(19, 6), n = uAt(4, 11), c = uAt(24, 14);
      st.push([e[0], e[1], ['#....', '.##..', '...##', '.##..', '#....']], [n[0], n[1], ['##']], [c[0], c[1], ['3']]);
    }
    return build(84, 68, parts, st);
  };
  E.trex = { run: [rex('r0'), rex('r1')], roar: rex('roar') };
  show('trex', [E.trex.run[0], E.trex.run[1], E.trex.roar]);

  /* ==========================================================================
     MOVING PLATFORMS — what Bonnie rides in this land, each the
     platform's width, `top` game pixels from its top edge to where he
     stands (draw at x, y - top); anything else hangs below.
     ========================================================================== */
  var tyre = function (cx, cy, R) {
    return P('g', ell(cx, cy, R, R), function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.sqrt(dx * dx + dy * dy);
      if (r < 1) return 'N';
      if (r < R * 0.5) return orb(cx - 1, cy - 1, R * 0.5, R * 0.5, IRON)(x, y);
      if (r < R * 0.62) return 'O';
      return orb(cx - 2, cy - 2, R, R, INK)(x, y);
    }, 'f');
  };
  /* A New York taxi, side on: a boxy yellow cab with a roof long enough
     to stand on, three windows, a black-and-white checker band, chrome
     bumpers, a headlight at the front (left) and a red tail light. */
  LK.taxi = look(build(64, 30, (function () {
    var wins = [or(rrect(10, 2.6, 23, 10.4, 1), tri(10.2, 2.6, 10.2, 10.4, 5.8, 10.4)), rrect(25.6, 2.6, 39.6, 10.4, 1), or(rrect(42, 2.6, 54, 10.4, 1), tri(53.8, 2.6, 53.8, 10.4, 58.2, 10.4))];
    var cab = or(rrect(8, 0, 56, 13, 2.2), tri(8.6, 0.4, 8.6, 12.8, 3.2, 12.8), tri(55.4, 0.4, 55.4, 12.8, 60.8, 12.8));
    var arch = or(ell(13, 25, 6.8, 6.8), ell(51, 25, 6.8, 6.8));
    var paint = orb(20, -4, 50, 30, GOLD);
    return [
      tyre(13, 24.6, 5.2), tyre(51, 24.6, 5.2),
      P('C', or(cab, but(rrect(0.6, 11, 63.4, 24.6, 3), arch)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (wins.some(function (w) { return w(X, Y); })) return (X + Y * 0.9) % 11 < 2.4 ? 'L' : Y < 5 ? 'i' : 'h';
        if (Y < 1.6) return 'D';
        if (Y > 14.8 && Y < 18.6 && X > 3 && X < 61) return (Math.floor(X / 2) + Math.floor((Y - 14.8) / 1.9)) % 2 ? 'g' : 'w';
        if (Y > 22.4) return 'g';
        // the doors' seams and their chrome handles
        if ((Math.abs(X - 24.4) < 0.5 || Math.abs(X - 40.8) < 0.5) && Y > 2 && Y < 22.4) return 'B';
        if ((X > 19.6 && X < 22.6 || X > 36 && X < 39) && Math.abs(Y - 13.4) < 0.6) return 'Q';
        return paint(x, y);
      }, 'A'),
      P('Q', or(rrect(0, 18.2, 4.6, 22, 1.4), rrect(59.4, 18.2, 64, 22, 1.4)), orb(1, 17, 6, 5, IRON), 'O'),
      P('F', ell(2.2, 13.8, 1.6, 1.5), null, 'C'),
      P('x', rrect(61.6, 12.4, 63.4, 15.4, 0.6), orb(61, 12, 3, 3, RED), 'u')
    ];
  })()));

  /* A window-cleaner's cradle, hung on its two ropes down the side of a
     skyscraper: a silver frame, a red side panel, the guard rail behind,
     a bucket of suds and a squeegee. Bonnie stands on its floor. */
  LK.cradle = look(build(48, 64, (function () {
    var deck = 48;
    var ropeTex = function (x, y) { return (x + y) % 3 ? 'V' : 'U'; };
    return [
      P('V', or(rrect(5, 0, 8, 37, 0.8), rrect(40, 0, 43, 37, 0.8)), ropeTex, 'T'),
      // the frame: two end posts, the guard rail, a mid rail
      P('Q', or(rrect(3.4, 35, 7.4, 62, 1), rrect(40.6, 35, 44.6, 62, 1), rrect(3.4, 35, 44.6, 37.6, 1), rrect(3.4, 41.6, 44.6, 43, 0.6)), orb(10, 33, 40, 20, IRON), 'O'),
      P('O', or(ell(6.4, 35.4, 2.2, 2.2), ell(41.6, 35.4, 2.2, 2.2)), orb(5.6, 34.6, 2.4, 2.4, IRON), 'N'),
      // the squeegee, leaning on the rail: a long handle, a black blade
      P('U', cap(11, deck - 0.6, 15.6, 33.6, 0.8), orb(12, 36, 4, 12, WOOD), 'S'),
      P('Q', turned(rrect(11.6, 31.6, 19.6, 33.8, 0.6), 15.6, 32.6, 0.32), function (x, y) { return y + 0.5 > 33 ? 'g' : 'Q'; }, 'O'),
      // the bucket: blue, a wire handle, suds piled over its rim
      P('|', or(but(ell(35.4, 41.6, 3.8, 3.4), ell(35.4, 41.6, 2.8, 2.4)), function (x, y) { return y > 42 && x > 31.6 + (y - 42) * 0.2 && x < 39.2 - (y - 42) * 0.2 && y < deck; }), function (x, y) { return y < 42 ? 'O' : orb(33, 42, 6, 6, COAT)(x, y); }, '_'),
      P('w', or(ell(33.4, 42.2, 2, 1.6), ell(36.4, 41.6, 2.2, 1.8), ell(38.4, 42.6, 1.4, 1.2)), orb(33, 41, 5, 3, SNOW), '2'),
      // the floor, and the red side panel below it
      P('x', rrect(1.4, deck, 46.6, 60.4, 1.4), function (x, y) {
        var Y = y + 0.5;
        if (Y < deck + 2.4) return orb(10, deck - 2, 40, 6, IRON)(x, y);
        if (Y > 58) return orb(10, 56, 40, 6, IRON)(x, y);
        // a yellow-and-black hazard stripe along its foot
        if (Y > 55.4) return (Math.floor((x + y) / 2.4) % 2) ? 'g' : 'C';
        return orb(14, deck, 34, 12, RED)(x, y);
      }, 'O'),
      P('Q', or(rrect(1.4, deck, 3.6, 62, 0.8), rrect(44.4, deck, 46.6, 62, 0.8)), orb(1, deck, 4, 14, IRON), 'O')
    ];
  })(), [[30, 40, ['w']]]), 24);

  /* A roller-coaster car: a glossy green car with a high rounded nose,
     three tall padded seats with gold lap bars clamped down in front of
     them, a gold stripe and a star on its side, and the wheels gripping
     the track below. The seat tops and the nose are what Bonnie stands
     on. */
  LK.coaster = look(build(64, 32, (function () {
    var rim = 7, seats = [21, 37, 53];
    var tub = or(rrect(3, rim, 63.4, 21, 3), rrect(0.6, 0.4, 13, 21, 6), ell(9, 14, 9, 7));
    var parts = [
      P('N', rrect(5, 20, 61, 24, 1), orb(30, 19, 40, 6, IRON), 'f'),
      tyre(12, 26.4, 4.6), tyre(24, 26.4, 4.6), tyre(42, 26.4, 4.6), tyre(54, 26.4, 4.6)
    ];
    // tall seat backs, padded red, each with a pale headrest
    seats.forEach(function (sx) {
      parts.push(P('x', rrect(sx, 0, sx + 9, 14, 3), function (x, y) { return y + 0.5 < 3.4 ? orb(sx + 2, -1, 7, 4, PINK)(x, y) : orb(sx + 2, 1, 9, 12, RED)(x, y); }, 'u'));
    });
    parts.push(P('{', tub, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(10, -2, 50, 26, CACT)(x, y);
      if (Y > 13.4 && Y < 15.6 && X > 3) return Math.abs(Y - 14.5) < 0.5 ? 'D' : 'C';
      if (Y < rim + 1.4 && X > 13) return '}';
      return t;
    }, '['));
    parts.push(P('C', starFn(8.6, 8.4, 4.4, 1.9, -Math.PI / 2), starTx(8.6, 8.4, -Math.PI / 2, GOLD), 'A'));
    // the lap bars: gold hoops over the rim, one in front of each seat
    seats.forEach(function (sx) {
      parts.push(P('C', or(cap(sx + 1, 3.4, sx - 4.6, 3.4, 1.3), cap(sx - 4.6, 3.4, sx - 5.6, rim + 1.6, 1.3)), orb(sx - 5, 2, 8, 4, GOLD), 'A'));
    });
    parts.push(P('F', or(ell(1.6, 15.6, 1.4, 2)), null, 'C'));
    return parts;
  })()));

  /* The steam train's carriage: scarlet, lined in gold, a deep red
     curved roof to ride on, a row of lit windows glowing gold, a crest
     on her side, and two bogies of red-spoked wheels. */
  LK.express = look(build(96, 44, (function () {
    var parts = [];
    var win = function (X, Y) { for (var k = 0; k < 7; k++) { var wx = 12.4 + k * 10.4; if (rrect(wx, 10.4, wx + 7.2, 19, 1.6)(X, Y)) return wx; } return -1; };
    parts.push(P('N', rrect(6, 33, 90, 36, 1), orb(30, 32, 50, 6, IRON), 'f'));
    [[13, 36.4], [27, 36.4], [69, 36.4], [83, 36.4]].forEach(function (w) {
      parts.push(P('g', ell(w[0], w[1], 6, 6), function (x, y) {
        var dx = x + 0.5 - w[0], dy = y + 0.5 - w[1], r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
        if (r < 1.4) return 'C';
        if (r > 4.6) return orb(w[0] - 2, w[1] - 2, 6, 6, INK)(x, y);
        return Math.abs(Math.sin(a * 4)) < 0.3 || r > 4 ? 'x' : 'h';
      }, 'f'));
    });
    parts.push(P('O', or(rrect(0, 26, 3, 30, 1), rrect(93, 26, 96, 30, 1)), orb(0, 25, 4, 5, IRON), 'N'));
    parts.push(P('x', rrect(2, 5, 94, 33, 1.6), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, wx = win(X, Y), t = orb(30, 4, 70, 34, 'uvvxy')(x, y);
      if (wx >= 0) {
        // a lit window: warm light, a lamp's glow, a curtain tied at the side
        if (X < wx + 1.6) return 'x';
        return Y < 12.4 ? 'F' : (X + Y) % 9 < 1.6 ? 'F' : 'D';
      }
      // gold lining round the windows and the panels below
      if (rrect(11.4, 9.4, 85.6, 20, 2)(X, Y) && !rrect(12.4, 10.4, 84.6, 19, 1.6)(X, Y)) return 'C';
      if (Math.abs(Y - 21.6) < 0.5 || Math.abs(Y - 31) < 0.5) return 'C';
      for (var k = 0; k < 4; k++) { var px = 10 + k * 20; if (rrect(px, 23.4, px + 16, 29.4, 1)(X, Y) && !rrect(px + 1, 24.4, px + 15, 28.4, 0.6)(X, Y)) return 'B'; }
      // the doors at each end, each with a small window
      if ((X > 3.6 && X < 9.2) || (X > 86.8 && X < 92.4)) {
        if (Y > 9 && Y < 15.6 && X > 4.6 && X < 8.2 || Y > 9 && Y < 15.6 && X > 87.8 && X < 91.4) return 'D';
        if (Math.abs(X - 3.8) < 0.5 || Math.abs(X - 9) < 0.5 || Math.abs(X - 87) < 0.5 || Math.abs(X - 92.2) < 0.5) return 'u';
      }
      return t;
    }, 'u'));
    // the crest on her side: a gold ring round a red shield
    parts.push(P('C', ell(48, 26.4, 3.6, 3.6), function (x, y) { var dx = x + 0.5 - 48, dy = y + 0.5 - 26.4; return dx * dx + dy * dy < 4.4 ? orb(47, 25, 3, 3, RED)(x, y) : orb(46, 24, 5, 5, GOLD)(x, y); }, 'A'));
    // the roof: deep red, curved, its ends rounded down
    parts.push(P('Ϛ', or(rrect(0.6, 0, 95.4, 6.6, 3), rrect(0, 4.4, 96, 7, 1)), function (x, y) { return y + 0.5 > 5.6 ? 'C' : orb(30, -3, 60, 10, MAROON)(x, y); }, 'ϙ'));
    return parts;
  })()));

  // a bamboo raft: three canes lashed together with rope
  LK.raft = look(build(48, 12, (function () {
    var cane = function (y0, x0, x1, tone) {
      return P(tone.charAt(2), rrect(x0, y0, x1, y0 + 4.2, 2), function (x, y) {
        var X = x + 0.5, t = orb(x0 + 14, y0 + 1, 44, 4, tone)(x, y);
        // the nodes along each cane
        return Math.abs(((X - x0) % 9.4) - 4.7) > 4.1 ? step(tone, t, -1) : t;
      }, tone.charAt(0));
    };
    var lash = function (x) { return P('V', rrect(x, 0.2, x + 3.2, 11.6, 0.8), function (xx, y) { return (xx + y) % 3 ? 'V' : 'T'; }, 'T'); };
    return [cane(7.6, 1.2, 46.4, 'ϢϣϣϤϥ'), cane(3.8, 0.4, 47.4, 'ϢϣϤϥϥ'), cane(0, 0, 48, 'ϣϤϥϥϦ'), lash(5.6), lash(22.4), lash(39.2)];
  })()));

  // an ice floe: a cap of snow, clear blue ice beneath, its underside jagged
  LK.floe = look(build(48, 18, (function () {
    var bottom = function (x) { return 17.6 - Math.abs(((x * 0.33) % 2) - 1) * 4 - Math.pow((x - 24) / 24, 2) * 5; };
    return [
      P('θ', function (x, y) { return x > 0.4 + y * 0.12 && x < 47.6 - y * 0.16 && y < bottom(x); }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(16, 2, 36, 18, ICE)(x, y);
        // the ice's facets: pale streaks running down through it
        return (X * 0.8 + Y) % 8 < 1.1 ? step(ICE, t, 1) : t;
      }, 'η'),
      P('w', function (x, y) { return y < 4.4 + Math.sin(x * 0.5) * 0.8 + (x % 7 < 2 ? 1.2 : 0) && x > 0.2 && x < 47.8; }, function (x, y) { return y + 0.5 < 2 ? 'R' : orb(14, -2, 36, 8, SNOW)(x, y); }, '1')
    ];
  })()));

  // a biscuit with chocolate on top, the edge of the chocolate dripping
  LK.biscuit = look(build(32, 12, [
    P('σ', rrect(0.4, 1.4, 31.6, 11.8, 2.2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // a row of docking holes, a crinkled baked edge
      if (Math.abs(Y - 8) < 0.7 && (X % 5.2) > 1.6 && (X % 5.2) < 2.8) return 'ρ';
      return Y > 10.6 ? 'ρ' : orb(10, 2, 28, 12, BISC)(x, y);
    }, 'π'),
    P('ν', function (x, y) { return x > 0.4 && x < 31.6 && y < 3.6 + (Math.abs(((x * 0.6) % 3) - 1.5) < 0.5 ? 1.8 : 0) + (x % 11 < 1.6 ? 1.2 : 0) && rrect(0.4, 0, 31.6, 12, 1.6)(x, y); }, function (x, y) { return y + 0.5 < 1.2 ? 'ξ' : orb(8, -1, 30, 6, CHOC)(x, y); }, 'μ')
  ], [[5, 1, ['ο']], [19, 1, ['ο']]]));

  /* ==========================================================================
     SPRINGS — four more things to bounce on, each 32 x 20 and the same
     two frames as A.bouncy, [ready, squashed]: the top row is where
     Bonnie lands; squashed they sit lower on the same feet.
     ========================================================================== */
  var SPRINGS = [];
  // a big marshmallow, twisted pink and white
  var marsh = function (sq) {
    var cx = 16, top = sq ? 10.6 : 3.4, rx = sq ? 15.2 : 12.6, ry = sq ? 2.6 : 3.2;
    var sideF = sq ? or(rrect(cx - rx, top, cx + rx, 19.8, 3), ell(cx, 15.6, 15.8, 4.4)) : rrect(cx - rx, top, cx + rx, 19.8, 3.4);
    var PINKY = MARSH, WHITE = 'ψωϊϊw';
    var stripe = function (X, Y) { return Math.floor((X * 0.8 + Y * 1.3 + 40) / 4.2) % 2; };
    return build(32, 20, [
      P('ψ', sideF, function (x, y) { var X = x + 0.5, Y = y + 0.5; return orb(cx - rx * 0.5, top + 2, rx * 1.2, 16, stripe(X, Y) ? PINKY : WHITE)(x, y); }, 'φ'),
      P('ω', ell(cx, top, rx, ry), function (x, y) { var X = x + 0.5, Y = y + 0.5, a = Math.atan2((Y - top) / ry, (X - cx) / rx); return Math.floor((a + 7) / 0.7) % 2 ? orb(cx - 4, top - 2, rx, ry * 2, 'χψωϊw')(x, y) : orb(cx - 4, top - 2, rx, ry * 2, 'ψωϊϊw')(x, y); }, 'χ')
    ], sq ? [[8, 10, ['w']], [21, 10, ['w']]] : [[8, 2, ['w']], [20, 3, ['w']], [13, 4, ['w']]]);
  };
  A.marshmallow = [marsh(false), marsh(true)];
  SPRINGS.push(['marshmallow', A.marshmallow]);

  // a springy cloud with a rainbow along its underside
  var cloudSpring = function (sq) {
    var k = sq ? 0.55 : 1, Y = function (y) { return 14.6 - (14.6 - y) * k; };
    var balls = [[6.6, 10.6, 4.6], [12.6, 6.6, 6], [20.6, 6.8, 5.6], [26.4, 10.4, 4.2], [16, 10.4, 5.4]];
    var blob = function (dy, grow) { var fs = balls.map(function (b) { return ell(b[0], Y(b[1]) + dy, b[2] + grow, b[2] * k + grow * 0.6); }); return function (x, y) { return y < 19.9 && or.apply(null, fs)(x, y) && (dy === 0 || y < Y(10) + dy + 6); }; };
    var bands = [RED, ORANGE, GOLD, CACT, SKY, LILAC], parts = [];
    for (var i = 0; i < bands.length; i++) {
      var d = (bands.length - i) * (sq ? 0.8 : 0.95);
      parts.push(P(bands[i].charAt(2), blob(d, 0.2), (function (t) { return function (x, y) { return y < 14 ? t.charAt(3) : t.charAt(2); }; })(bands[i])));
    }
    parts.push(P('w', blob(0, 0), orb(13, Y(8), 18, 11 * k + 2, '1Wwww'), '1'));
    return build(32, 20, parts, sq ? [[10, 9, ['R']]] : [[9, 3, ['R']], [11, 2, ['R']]]);
  };
  A.cloudspring = [cloudSpring(false), cloudSpring(true)];
  SPRINGS.push(['cloudspring', A.cloudspring]);

  // a Jamaican steel drum: a dished silver top hammered into notes, a
  // painted skirt in green, gold and black, on a little stand
  var steelPan = function (W, H, top, sq) {
    var cx = W / 2, rx = W / 2 - 2.2, ry = sq ? 3.4 : 4.2, base = H - 3.4;
    var notes = [[-0.5, -0.1], [-0.12, -0.5], [0.34, -0.42], [0.55, 0.12], [-0.22, 0.42], [0.2, 0.38], [0.08, -0.02]];
    return [
      P('g', or(cap(cx - rx * 0.6, base, cx - rx * 0.8 - (sq ? 1.2 : 0), H - 0.4, 0.7), cap(cx + rx * 0.6, base, cx + rx * 0.8 + (sq ? 1.2 : 0), H - 0.4, 0.7)), null, 'f'),
      P('Q', or(rrect(cx - rx, top, cx + rx, base, 1.6), ell(cx, base, rx, ry * 0.7)), function (x, y) {
        var Y = y + 0.5, f = (Y - top) / (base - top);
        // chrome, with a painted band round its middle: green, gold, black
        var band = f > 0.34 && f < 0.5 ? '[]{}~' : f >= 0.5 && f < 0.66 ? GOLD : f >= 0.66 && f < 0.8 ? INK : IRON;
        return orb(cx - rx * 0.55, top, rx * 1.1, (base - top) * 3, band)(x, y);
      }, 'O'),
      P('R', ell(cx, top, rx, ry), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, u = (X - cx) / rx, v = (Y - top) / ry;
        if (u * u + v * v > 0.66) return 'R';
        // hammered note-bumps in the dish, each lit on its far side
        for (var i = 0; i < notes.length; i++) { var du = u - notes[i][0], dv = v - notes[i][1]; if (du * du * 30 + dv * dv * 9 < 1) return du + dv > 0.02 ? 'R' : 'Q'; }
        return v < -0.1 ? 'O' : 'P';
      }, 'O'),
      // the two sticks, rubber-tipped, resting across it
      P('U', or(cap(cx - 9, top + 1.6, cx + 2, top - 1.2, 0.6), cap(cx - 1, top - 1.6, cx + 10, top + 0.8, 0.6)), null, 'S'),
      P('x', or(ell(cx + 2.4, top - 1.2, 1.4, 1.2), ell(cx - 1.6, top - 1.6, 1.4, 1.2)), orb(cx, top - 3, 3, 2, RED), 'u')
    ];
  };
  A.drum = [build(32, 20, steelPan(32, 20, 5, false)), build(32, 20, steelPan(32, 20, 10.4, true))];
  SPRINGS.push(['drum', A.drum]);

  // a big squashy flower, open to the sky: pink petals round a golden
  // middle on a short stalk with two leaves
  var flowerHead = function (cx, cy, rx, ry, pr, petals, tone, middle) {
    var back = [], front = [];
    for (var i = 0; i < petals; i++) {
      var a = i / petals * Math.PI * 2 + 0.2, px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry;
      (Math.sin(a) < 0 ? back : front).push([px, py]);
    }
    var pet = function (list, t) { return list.map(function (p) { return P(t.charAt(2), ell(p[0], p[1], pr, pr * 0.62), orb(p[0] - 1.4, p[1] - 1.2, pr * 1.2, pr, t), t.charAt(0)); }); };
    return pet(back, tone.charAt(0) + tone.slice(0, 4)).concat(pet(front, tone)).concat([
      P('C', ell(cx, cy, rx * 0.5, ry * 0.62), function (x, y) { return (x + y) % 3 ? orb(cx - 1, cy - 1, rx * 0.5, ry * 0.7, middle)(x, y) : 'B'; }, 'A')
    ]);
  };
  var flowerSpring = function (sq) {
    var cy = sq ? 12.4 : 6.6, ry = sq ? 2.6 : 3.4, rx = sq ? 10.6 : 9.2;
    return build(32, 20, [
      P('<', cap(16, cy, 16, 19.8, 1.6), orb(15, cy, 3, 14, LEAF), '('),
      P('<', or(turned(ell(10.4, 17, 4.4, 1.7), 10.4, 17, sq ? 0.15 : 0.45), turned(ell(21.6, 17, 4.4, 1.7), 21.6, 17, sq ? -0.15 : -0.45)), orb(14, 15, 12, 4, LEAF), '(')
    ].concat(flowerHead(16, cy, rx, ry, sq ? 5.2 : 4.6, 9, CORAL, GOLD)), sq ? [] : [[13, 5, ['D']]]);
  };
  A.flowerspring = [flowerSpring(false), flowerSpring(true)];
  SPRINGS.push(['flowerspring', A.flowerspring]);

  /* ==========================================================================
     SCENERY — the props along this land's levels. Universal's first,
     then Jamaica, Antarctica, Australia, the rainbow and Dinosaur Land.
     ========================================================================== */
  var deco = function (name, v) { D[name] = v; };
  var water = function (x, y) { return (x + y * 2) % 7 ? 'ϐ' : 'w'; };

  /* The big globe outside the park gates, turning on its plinth: blue
     seas, silver lands (three of them round it, so four frames make a
     smooth turn), a gold ring tilted round it, and a fountain splashing
     in the pool at its foot. */
  var globe = function (f) {
    var cx = 26, cy = 21.6, R = 17.6, th = f * (Math.PI * 2 / 3) / 4, tilt = 0.32;
    var lands = [[0.1, -0.55, 0.5, 0.32], [0.62, 0.25, 0.34, 0.52], [1.4, -0.12, 0.3, 0.3], [1.05, -0.62, 0.2, 0.14], [1.75, 0.5, 0.22, 0.16]];
    var period = Math.PI * 2 / 3;
    var land = function (lon, lat) {
      var L = ((lon % period) + period) % period;
      return lands.some(function (b) {
        for (var k = -1; k <= 1; k++) {
          var dl = (L + k * period - b[0]) / b[2], dt = (lat - b[1]) / b[3];
          if (dl * dl + dt * dt < 1 + 0.18 * Math.sin(lon * 9 + lat * 7)) return true;
        }
        return false;
      });
    };
    var sea = orb(cx - 4, cy - 4, R, R, SKY), silver = orb(cx - 4, cy - 4, R, R, 'OPQRR');
    var ringIn = function (back) {
      return function (x, y) {
        var dx = x - cx, dy = y - cy, c = Math.cos(-0.28), sn = Math.sin(-0.28), lx = dx * c + dy * sn, ly = -dx * sn + dy * c;
        var o = (lx * lx) / (25.4 * 25.4) + (ly * ly) / (8.4 * 8.4), i = (lx * lx) / (21.4 * 21.4) + (ly * ly) / (5.2 * 5.2);
        return o <= 1 && i >= 1 && (back ? ly < 0 : ly >= 0);
      };
    };
    var ringTex = orb(cx - 10, cy - 4, 28, 10, GOLD);
    // the fountain's jets, their drops moving on each frame
    var jets = [];
    [[-1, 0], [1, 0]].forEach(function (j) {
      for (var k = 0; k < 12; k++) {
        var u = ((k + f * 0.75) / 12) % 1, x = cx + j[0] * (6 + u * 15), y = 50 - Math.sin(u * Math.PI) * 6 + u * 7;
        if (k % 4 !== 3) jets.push(ell(x, y, 1.4, 1.2));
      }
    });
    return build(52, 68, [
      P('C', ringIn(true), ringTex, 'A'),
      P('ύ', ell(cx, cy, R, R), function (x, y) {
        var u = (x + 0.5 - cx) / R, v = (y + 0.5 - cy) / R, z = Math.sqrt(Math.max(0, 1 - u * u - v * v));
        var c = Math.cos(tilt), sn = Math.sin(tilt), uu = u * c + v * sn, vv = -u * sn + v * c;
        var lat = Math.asin(Math.max(-1, Math.min(1, vv))), lon = Math.atan2(uu, z) + th;
        return land(lon, lat) ? silver(x, y) : sea(x, y);
      }, 'ϋ'),
      P('C', ringIn(false), ringTex, 'A'),
      // the plinth: a stone drum with a gold band, the globe's stalk
      P('Q', or(rrect(23.4, 38, 28.6, 44, 0.8), rrect(17.6, 43, 34.4, 56, 1.6), rrect(15.6, 42, 36.4, 45, 1)), function (x, y) { var Y = y + 0.5; return Y > 47.4 && Y < 49 ? 'C' : orb(20, 40, 18, 18, IRON)(x, y); }, 'O'),
      // the pool: a round stone rim, water inside
      P('ϐ', ell(cx, 58.6, 23.4, 4), function (x, y) { return y % 2 ? 'ϐ' : 'ώ'; }, 'ύ'),
      P('Q', but(or(rrect(1, 59, 51, 68, 2.4), ell(cx, 59, 25, 4.6)), ell(cx, 58.4, 22.6, 3.6)), function (x, y) { return y + 0.5 > 66 ? 'O' : orb(14, 56, 40, 14, IRON)(x, y); }, 'O'),
      P('w', or.apply(null, jets), water, 'ώ')
    ], [[18, 9, ['R']], [17, 10, ['R']]]);
  };
  deco('globe', [0, 1, 2, 3].map(globe));

  /* A film clapperboard: the slate with chalk lines ruled on it, its
     striped clapstick hinged open. */
  deco('clapper', build(30, 28, [
    P('h', rrect(1.6, 9.6, 28.4, 27.6, 1.6), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 13.4) return (Math.floor((X + Y) / 3.2) % 2) ? 'w' : 'g';
      // chalk: two ruled lines, a row of three boxes
      if (Math.abs(Y - 17.6) < 0.5 && X > 4 && X < 26) return 'W';
      if (Math.abs(Y - 22.4) < 0.5 && X > 4 && X < 26) return 'W';
      if (Y > 22.4 && Y < 26 && (Math.abs(X - 11) < 0.5 || Math.abs(X - 19) < 0.5)) return 'W';
      return orb(8, 12, 26, 20, INK)(x, y);
    }, 'g'),
    P('h', turned(rrect(1.2, 5.4, 29.6, 9.2, 1), 2.4, 9, -0.36), function (x, y) {
      var q = (x + 0.5) - (y + 0.5) * 1.2;
      return Math.floor(q / 3.2) % 2 ? 'w' : 'g';
    }, 'g'),
    O(2.6, 9.4, 1.6, 1.6, IRON, 'O')
  ], [[6, 15, ['W.W.W']]]));

  /* A searchlight on a wheeled stand, its lamp tipped up to the sky,
     the lens glowing. */
  deco('spotlight', build(24, 30, [
    P('O', or(rrect(3, 23, 21, 27.6, 1.4)), orb(8, 22, 14, 6, IRON), 'N'),
    tyre(6.4, 27.4, 2.4), tyre(17.6, 27.4, 2.4),
    P('P', or(rrect(4.6, 14, 6.6, 24, 0.6), rrect(17.4, 14, 19.4, 24, 0.6)), orb(5, 14, 4, 10, IRON), 'O'),
    P('O', turned(rrect(4.4, 5, 19.6, 18, 2.4), 12, 14, -0.62), turned(function (x, y) { return y + 0.5 < 7.6 ? 'Q' : (x % 3 === 0 ? 'N' : orb(8, 6, 14, 14, IRON)(x, y)); }, 12, 14, -0.62), 'N'),
    P('F', turned(ell(12, 4.4, 7.4, 2.2), 12, 14, -0.62), function (x, y) { return (x + y) % 4 ? 'F' : 'D'; }, 'C'),
    O(12, 14, 1.6, 1.6, GOLD, 'A')
  ]));

  /* A popcorn cart: a red-and-white striped roof, a glass case heaped
     with popcorn, a red cart trimmed in gold, two spoked wheels. */
  var spoked = function (cx, cy, R, rim, hub) {
    var polar = function (x, y) { var dx = x - cx, dy = y - cy; return [Math.sqrt(dx * dx + dy * dy), Math.atan2(dy, dx)]; };
    return P(rim.charAt(2), function (x, y) { var q = polar(x, y); return q[0] <= R && (q[0] > R - 1.4 || q[0] < 1.6 || Math.abs(Math.sin(q[1] * 3)) < 0.34); }, function (x, y) {
      var q = polar(x + 0.5, y + 0.5);
      if (q[0] > R - 1.4) return orb(cx - 2, cy - 2, R, R, rim)(x, y);
      return q[0] < 1.4 ? hub.charAt(3) : hub.charAt(2);
    }, rim.charAt(0));
  };
  var popcornPuffs = function (x0, x1, y0, y1, seed) {
    var r = BB.rng(seed), out = [];
    for (var i = 0; i < 24; i++) out.push(ell(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), 1.6, 1.4));
    return or.apply(null, out);
  };
  deco('popcorn', build(32, 36, (function () {
    var puffs = popcornPuffs(6, 25, 13, 20, 7);
    var parts = [
      P('Q', or(rrect(4, 6, 5.6, 22, 0.4), rrect(26.4, 6, 28, 22, 0.4)), orb(4, 6, 3, 16, IRON), 'O'),
      // the glass case: popcorn heaped at the bottom, a glint on the glass
      P('M', rrect(5.6, 8, 26.4, 22, 0.6), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (puffs(X, Y) || Y > 19) return (x * 3 + y) % 5 === 0 ? 'C' : (x + y) % 3 ? 'F' : 'D';
        if (Math.abs((X - Y) - 4) < 0.8) return 'w';
        return 'L';
      }, '2'),
      // the striped roof, scalloped along its edge
      P('x', function (x, y) { if (y < 1 || x < 0.4 || x > 31.6) return false; if (y < 5) return y > 1 + Math.pow((x - 16) / 16, 2) * 2; var c = Math.floor(x / 4) * 4 + 2; return ell(c, 5, 2.1, 2.4)(x, y); },
        function (x, y) { return Math.floor(x / 4) % 2 ? orb(14, 0, 20, 8, SNOW)(x, y) : orb(14, 0, 20, 8, RED)(x, y); }, 'u'),
      P('x', rrect(2, 22, 30, 31, 1.4), function (x, y) { var Y = y + 0.5; return Y < 23.6 || Y > 29.6 ? orb(10, 22, 20, 6, GOLD)(x, y) : orb(10, 22, 24, 12, RED)(x, y); }, 'u'),
      P('C', starFn(16, 26.6, 2.6, 1.2, -Math.PI / 2), starTx(16, 26.6, -Math.PI / 2, GOLD), 'A'),
      P('Q', cap(30, 24, 31.6, 18, 0.8), null, 'O'),
      spoked(8, 31, 4.8, GOLD, RED), spoked(24, 31, 4.8, GOLD, RED)
    ];
    return parts;
  })()));

  /* ---- Jamaica ---- */
  /* A beach shack: planks painted turquoise, yellow, pink and green, a
     shaggy palm-thatch roof, a window with its shutters flung open and a
     box of flowers, a doorway, short stilts above the sand. */
  deco('shack', build(56, 44, (function () {
    var PLANKS = [TEAL, GOLD, CORAL, 'ϑϒϕϖϗ'];
    return [
      P('U', or(rrect(8, 38, 10.6, 44, 0.6), rrect(24, 38, 26.6, 44, 0.6), rrect(46, 38, 48.6, 44, 0.6)), orb(8, 38, 4, 8, WOOD), 'S'),
      P('=', rrect(5, 15, 51, 40, 0.8), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, k = Math.floor((X - 5) / 4.6), t = PLANKS[((k % 4) + 4) % 4];
        // the window, its frame and the dark room behind; the doorway
        if (rrect(30, 20.4, 44, 30, 0.6)(X, Y)) return rrect(31.2, 21.6, 42.8, 28.8, 0.4)(X, Y) ? (Y < 23 ? 'h' : 'g') : 'w';
        if (rrect(10.4, 22, 20.4, 40, 0.6)(X, Y)) return rrect(11.6, 23.2, 19.2, 40, 0.4)(X, Y) ? (X < 13 ? 'g' : 'h') : 'w';
        if ((X - 5) % 4.6 < 0.7) return t.charAt(0);
        return orb(12, 14, 40, 28, t)(x, y);
      }, '+'),
      // the shutters, flung open, and a box of red flowers under the sill
      P('|', or(rrect(25.6, 20.4, 30, 30, 0.6), rrect(44, 20.4, 48.4, 30, 0.6)), function (x, y) { return y % 2 ? '_' : '|'; }, ';'),
      P('U', rrect(29.4, 30, 44.6, 33.4, 0.8), orb(30, 30, 12, 4, WOOD), 'S'),
      P('x', or(ell(31.6, 29.4, 1.6, 1.4), ell(35, 29, 1.6, 1.4), ell(38.6, 29.4, 1.6, 1.4), ell(42, 29, 1.6, 1.4)), function (x, y) { return (x + y) % 3 ? 'x' : 'y'; }, 'u'),
      P('<', or(ell(33.2, 30, 1.2, 0.8), ell(40.4, 30, 1.2, 0.8)), null, '('),
      // the thatch: a shaggy fringe over the eaves, straw combed down
      P('C', function (x, y) {
        if (y < 1) return false;
        var w = 9 + (y - 1) * 1.6, fringe = 17.4 + (Math.abs(((x * 0.7) % 2) - 1)) * 2.4;
        return Math.abs(x - 28) < Math.min(w, 28) && y < fringe;
      }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(20, 0, 34, 22, 'ABCDF')(x, y);
        return (X * 1.3 + Y * 0.3) % 3.4 < 0.9 ? 'A' : (X + Y * 2) % 7 < 1 ? 'B' : t;
      }, 'A')
    ];
  })(), [[12, 33, ['C']]]));

  // a steel drum on its stand, ready to play
  deco('steeldrum', build(24, 20, steelPan(24, 20, 6.6, false)));

  /* A scarlet macaw on a wooden perch: red all over, a white face, a
     hooked beak, wings yellow then blue, a long tail. Bobbing, then
     squawking with a wing up. */
  deco('parrot', [0, 1].map(function (f) {
    var hy = f ? 4.2 : 5;
    return build(18, 26, [
      P('U', or(rrect(8, 16.4, 10.2, 25, 0.6), ell(9.1, 25, 4.4, 1), rrect(1.4, 15.2, 16.6, 17.2, 1)), orb(4, 15, 12, 8, WOOD), 'S'),
      P('x', taper([[11.4, 13], [12.6, 19], [13.4, 25.4]], 1.8, 0.8), function (x, y) { return y > 21 ? orb(12, 20, 3, 6, COAT)(x, y) : orb(11, 14, 3, 8, RED)(x, y); }, 'u'),
      P('x', ell(9.6, 10.6, 3.8, 5), orb(8, 8, 5, 6, RED), 'u'),
      P('C', turned(ell(11.2, 10.6, 2.8, 4.8), 11.2, 10.6, f ? -0.6 : -0.2), function (x, y) { var Y = y + 0.5; return Y < 9.4 + (f ? -1 : 0) ? orb(10, 7, 3, 3, GOLD)(x, y) : Y < 12.6 ? orb(10, 10, 3, 4, '[]{}}')(x, y) : orb(10, 12, 3, 4, COAT)(x, y); }, 'A'),
      P('O', or(ell(8.4, 15.6, 1.2, 0.9), ell(10.8, 15.6, 1.2, 0.9)), null, 'N'),
      P('x', ell(7.4, hy, 3.4, 3.2), orb(6, hy - 1.6, 4, 4, RED), 'u'),
      P('w', ell(5.6, hy + 0.4, 1.8, 1.8), orb(5, hy, 2, 2, SNOW), '2'),
      P('W', f ? or(tri(1, hy + 0.6, 4.6, hy - 1.6, 4.4, hy + 1.2), tri(2.4, hy + 3.4, 4.2, hy + 2, 4.6, hy + 3.6)) : or(tri(1.4, hy + 2.8, 4.6, hy - 1.4, 4.6, hy + 1.6), cap(2.6, hy + 2.2, 4, hy + 2.6, 0.7)), function (x, y) { return y + 0.5 > hy + 1.6 ? 'g' : 'W'; }, 'P')
    ], [[5, Math.round(hy) - 1, ['.#.', '#Ew', '#EE']]]);
  }));

  /* A hibiscus bush: one great red flower with its long golden stamen,
     a bud, glossy dark leaves. */
  deco('hibiscus', build(22, 24, clump5([[5, 18, 4.6], [11, 16, 5.6], [17.4, 18.2, 4.4], [8, 20.6, 4], [14.4, 21, 4]], CACT).concat(
    flowerHead(11, 8.4, 4.6, 3.6, 4, 5, CORAL, 'ϧϨϨϩϪ'),
    [P('C', cap(11, 8.4, 15.6, 3.2, 0.6), null, 'A'), O(16, 2.8, 1.3, 1.3, GOLD, 'A'),
      P('ϩ', turned(ell(19, 10.6, 1.6, 2.6), 19, 10.6, 0.5), orb(18, 9, 2, 3, CORAL), 'ϧ')]
  )));

  /* ---- Antarctica ---- */
  // an igloo of snow blocks, shading blue, a round doorway in its porch
  deco('igloo', build(44, 28, [
    P('w', function (x, y) { return ell(25, 28.4, 18.6, 25)(x, y) && y < 27.9; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, row = Math.floor((28 - Y) / 4.4), t = orb(18, 6, 26, 26, SNOW)(x, y);
      // block joints: rows, the vertical joints staggered
      if ((28 - Y) % 4.4 < 0.8) return '2';
      if (((X + row * 3.2) % 6.4) < 0.7) return '2';
      return t;
    }, '1'),
    P('w', function (x, y) { return ell(9.4, 28, 8.6, 11.2)(x, y) && y < 27.9; }, function (x, y) { return (28 - y - 0.5) % 4.4 < 0.8 ? '2' : orb(5, 18, 12, 12, SNOW)(x, y); }, '1'),
    P('h', function (x, y) { return ell(7.6, 28, 3.8, 6.6)(x, y) && y < 27.9; }, function (x, y) { return y + 0.5 < 23 ? 'h' : 'g'; }, 'g')
  ]));

  /* An emperor penguin standing tall: a black head and back, a white
     front blushing gold at the top, golden ear patches, an orange
     stripe on his long bill. Standing, then a flipper flap. */
  deco('emperor', [0, 1].map(function (f) {
    return build(22, 30, [
      P('m', or(ell(8.4, 29.2, 2.8, 1), ell(13.6, 29.2, 2.8, 1)), null, 'l'),
      P('h', ell(11.6, 17.6, 7.8, 11.6), orb(9, 12, 10, 14, INK), 'g'),
      P('w', ell(10, 19.2, 5.4, 9.4), function (x, y) { var Y = y + 0.5; return Y < 13.6 ? orb(9, 10, 6, 6, 'BCDDF')(x, y) : orb(8, 16, 8, 12, SNOW)(x, y); }, '1'),
      P('h', f ? turned(ell(17.4, 16, 1.8, 6.6), 17.4, 10, -0.5) : turned(ell(17.2, 17.6, 1.8, 6.6), 17.2, 11.6, -0.08), orb(16, 14, 3, 7, INK), 'g'),
      P('h', ell(9.4, 6.4, 4.6, 4.4), orb(8, 5, 5, 5, INK), 'g'),
      P('C', turned(ell(11.4, 8.6, 1.4, 2.2), 11.4, 8.6, 0.4), orb(11, 8, 2, 2, GOLD), 'B'),
      P('h', cap(5.2, 7.6, 0.8, 9, 0.9), function (x) { return x > 2 && x < 4.4 ? 'm' : 'g'; }, 'f')
    ], [[6, 4, ['.#.', '#Ew', '#EE']], [6, 11, ['3']]]);
  }));

  // a tall spire of ice, all facets, snow drifted round its foot
  deco('icespire', build(22, 44, [
    P('θ', function (x, y) { var w = (y - 1) / 43 * 9.6 + 0.6, c = 11.6 - (44 - y) * 0.06; return y > 1 && Math.abs(x - c) < w; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, c = 11.6 - (44 - Y) * 0.06;
      // three faces: lit on the left, mid, in shade on the right
      if (X < c - (Y / 44) * 3) return Y % 6 < 1 ? 'κ' : 'ι';
      if (X < c + (Y / 44) * 2) return (X + Y) % 9 < 1 ? 'κ' : 'θ';
      return 'η';
    }, 'η'),
    P('θ', function (x, y) { var w = (y - 14) / 30 * 4.6; return y > 14 && Math.abs(x - 4.6 + (44 - y) * 0.04) < w; }, function (x, y) { return x + 0.5 < 4.4 ? 'ι' : 'θ'; }, 'η'),
    P('w', function (x, y) { return y > 38 + Math.sin(x * 0.7) * 1.4 && x > 0.4 && x < 21.6; }, orb(8, 36, 14, 8, SNOW), '1')
  ]));

  // a seal lying on the ice, head up, whiskers and big dark eyes
  deco('seal', build(34, 16, [
    P('O', or(turned(ell(30.6, 13.4, 3.4, 1.4), 30.6, 13.4, -0.4), turned(ell(31, 15, 3, 1.2), 31, 15, 0.3)), orb(30, 12, 4, 3, IRON), 'N'),
    P('P', or(ell(18, 11, 12, 4.6), ell(7, 9, 5.4, 5)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(12, 6, 20, 10, IRON)(x, y);
      // dappled spots along his back, a pale belly
      if (Y > 13.4) return step(IRON, t, 1);
      return (Math.floor(X * 0.6) * 7 + Math.floor(Y * 0.7) * 3) % 9 === 0 && Y < 10 ? 'O' : t;
    }, 'O'),
    P('P', turned(ell(12.6, 14.4, 3.2, 1.3), 12.6, 14.4, 0.5), orb(12, 13, 3, 2, IRON), 'O'),
    P('Q', ell(3.6, 10.6, 2.6, 2), orb(3, 10, 3, 2, 'PQQRR'), 'O')
  ], [[4, 6, ['.##', '#Ew', '#EE']], [1, 9, ['##']], [0, 11, ['.#.#']], [7, 8, ['3']]]));

  // the research station's flag: orange with a white star, on a silver
  // pole planted in a mound of snow
  deco('stationflag', build(16, 40, [
    P('Q', rrect(1, 2, 3.8, 38, 0.8), orb(1.4, 10, 2, 30, IRON), 'O'),
    O(2.3, 2.2, 1.7, 1.7, GOLD, 'A'),
    P('m', function (x, y) { if (x < 3.2 || x > 15.6) return false; var t = (x - 3.2) / 12.4; return Math.abs(y - (8.6 + Math.sin(x * 0.7) * 1.1 * t)) < 4.8 - t * 0.6; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (starFn(9.4, 8.8, 3.4, 1.5, -Math.PI / 2)(X, Y)) return 'w';
      var w = Math.cos(X * 0.7);
      return w > 0.5 ? 'n' : w < -0.5 ? 'l' : 'm';
    }, 'k'),
    P('w', function (x, y) { return ell(4, 40.4, 9, 4.4)(x, y) && y < 39.9; }, orb(2, 36, 10, 6, SNOW), '1')
  ]));

  /* ---- Australia ---- */
  /* A gum tree: a pale smooth trunk with its bark peeling in patches,
     branches reaching up and out, and loose drooping clumps of
     grey-green eucalyptus leaves. */
  deco('gumtree', build(64, 84, (function () {
    var trunk = tube([[31, 84.6, 5.6], [31.4, 70, 4.4], [30.2, 54, 3.6], [31, 40, 2.8]], 30);
    var bark = orb(26, 40, 14, 50, BARK);
    var peel = function (x, y, t) { var h = Math.sin(x * 1.3 + Math.floor(y / 5) * 2.1); return h > 0.86 ? 'Λ' : h < -0.9 ? 'β' : t; };
    var branches = [taper([[30.4, 54], [22, 42], [13, 31]], 2.6, 1.1), taper([[31, 48], [40, 38], [48, 27]], 2.4, 1), taper([[31, 42], [31.4, 30], [29, 18]], 2.2, 0.9), taper([[22, 42], [17, 40], [9, 40]], 1.2, 0.7)];
    var parts = [
      P('γ', or.apply(null, [trunk.f, ell(31, 84, 8.6, 2.6)].concat(branches)), function (x, y) { return peel(x, y, bark(x, y)); }, 'β')
    ];
    // three loose canopies of leaves, the leaves hanging in fringes
    [[[12, 28, 8], [5.6, 35, 5], [19, 23, 6.4], [9, 38.6, 4]], [[48, 24, 8], [56, 31, 5.4], [41, 19, 6.6]], [[29, 13, 8.6], [20, 10, 6], [37.6, 9, 6.4], [28.6, 4.6, 4.6]]].forEach(function (cl) {
      var inside = function (x, y) { return cl.some(function (c) { return ell(c[0], c[1], c[2], c[2] * 0.8)(x, y) || (y > c[1] && y < c[1] + c[2] * 1.15 && Math.abs(x - c[0]) < c[2] * 0.8 && Math.floor(x) % 3 !== 2); }); };
      var lit = function (x, y) { var c = cl[0], best = 0; cl.forEach(function (d) { var v = 1 - Math.hypot(x - d[0], y - d[1]) / d[2]; if (v > best) { best = v; c = d; } }); return orb(c[0] - 1.6, c[1] - 1.6, c[2] * 1.1, c[2], GUM)(x, y); };
      parts.push(P('Φ', inside, function (x, y) { return (x * 2 + y * 3) % 7 === 0 ? 'Σ' : (x + y * 5) % 11 === 0 ? 'Ψ' : lit(x, y); }, 'Π'));
    });
    return parts;
  })()));

  /* A koala sitting on a stump, munching a sprig of gum leaves: big
     fluffy ears, a big black nose, soft grey fur. */
  deco('koala', [0, 1].map(function (f) {
    var sy = f ? 1.2 : 0;
    return build(26, 28, [
      P('V', rrect(3, 19.4, 23.4, 28, 2), function (x, y) { var Y = y + 0.5; return Y < 21.6 ? ((Math.abs(x - 13) * 0.7 + Y) % 3 < 1 ? 'V' : 'X') : (x % 4 === 0 ? 'T' : orb(8, 20, 14, 10, WOOD)(x, y)); }, 'T'),
      O(14.6, 14.4, 7, 6.6, FUR, '!'),
      P('&', ell(12.4, 16, 3.6, 4), orb(11, 15, 4, 4, '%&&**'), '%'),
      P('%', or(ell(9.4, 20, 2.4, 1.4), ell(18, 20.2, 2.4, 1.4)), orb(9, 19, 3, 2, FUR), '!'),
      // the sprig: a stalk and a few long leaves
      P('Φ', or(cap(9.6, 13 + sy, 3, 6 + sy, 0.5), turned(ell(3.4, 8.4 + sy, 1.4, 2.8), 3.4, 8.4 + sy, 0.5), turned(ell(5.6, 13.6 + sy, 1.3, 2.6), 5.6, 13.6 + sy, -0.9), turned(ell(2.6, 13 + sy, 1.3, 2.4), 2.6, 13 + sy, 0.2)), orb(3, 9, 5, 6, GUM), 'Π'),
      P('%', cap(17, 12.4, 10.2, 12.8 + sy, 1.7), orb(14, 11, 6, 3, FUR), '!'),
      O(5.6, 3.8, 3.6, 3.3, FUR, '!'), O(18.6, 3.6, 3.6, 3.3, FUR, '!'),
      P('*', or(ell(5.4, 4.2, 1.8, 1.6), ell(18.8, 4, 1.8, 1.6)), null, '&'),
      O(12, 7.6, 6.4, 5.6, FUR, '!'),
      P('g', ell(10, 9, 1.7, 2.3), orb(9, 8, 2, 2, INK), 'f')
    ], [[6, 5, ['.#.', '#Ew', '#EE']], [12, 5, ['.#.', '#Ew', '#EE']], [8, 12, f ? ['.##.', '#..#'] : ['#..#', '.##.']], [4, 9, ['3']]]);
  }));

  // a termite mound: lumpy red-earth spires, ridged and pitted
  deco('termite', build(20, 34, [
    P('Θ', or(taper([[10, 33], [10.6, 20], [9.4, 8], [10, 1.4]], 6.6, 1.4), taper([[4.6, 33], [4, 22], [4.6, 13]], 3.8, 1.2), taper([[15.6, 33], [16.4, 24], [15.4, 17]], 3.6, 1.2), rrect(0.4, 28, 19.6, 34, 3)),
      function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(7, 6, 12, 30, OCHRE)(x, y);
        if ((X * 7 + Math.floor(Y / 3) * 5) % 13 < 0.8) return 'Γ';
        return (X + Math.sin(Y * 0.4) * 1.4) % 3.4 < 0.8 ? step(OCHRE, t, -1) : t;
      }, 'Δ')
  ]));

  // a red rock like a little Uluru: steep rounded ends, a long gently
  // domed top, rain gullies streaked down its sides, a shadow at its foot
  deco('redrock', build(34, 22, [
    P('Θ', function (x, y) {
      if (y > 21.9) return false;
      var top = 5 + Math.pow((x - 14) / 15, 2) * 4.4, L = 1 + Math.pow(Math.max(0, 14 - y) / 9, 2) * 4, R = 33 - Math.pow(Math.max(0, 16 - y) / 11, 2) * 7;
      return y > top && x > L && x < R;
    }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(9, 4, 26, 16, OCHRE)(x, y);
      if (Y > 19.6) return step(OCHRE, t, -1);
      // gullies, slanting down its face, each with a lit lip
      var g = (X * 0.9 + Y * 0.45) % 5.2;
      if (g < 0.9 && Y > 8) return step(OCHRE, t, -1);
      if (g < 1.6 && Y > 8) return step(OCHRE, t, 1);
      return t;
    }, 'Δ')
  ]));

  // a yellow diamond road sign with a kangaroo on it, on its post
  deco('roosign', build(20, 32, [
    P('Q', rrect(8.8, 16, 11.2, 32, 0.6), orb(8, 16, 3, 16, IRON), 'O'),
    P('C', function (x, y) { return Math.abs(x - 10) + Math.abs(y - 10) <= 9.6; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = Math.abs(X - 10) + Math.abs(Y - 10);
      if (d > 8.2 && d <= 9) return 'g';
      if (d > 9) return 'C';
      // the kangaroo, mid-hop, in black
      var roo = ell(10.6, 11, 2.8, 1.9)(X, Y) || ell(7.4, 8.4, 1.4, 1.1)(X, Y) || cap(8, 8, 8.6, 6, 0.5)(X, Y) || cap(8.4, 9.6, 9, 10.6, 0.8)(X, Y) ||
        cap(12.6, 11.6, 15.6, 13.6, 0.6)(X, Y) || cap(11, 12.4, 9.4, 14, 0.7)(X, Y) || cap(9.4, 14, 7.4, 14.4, 0.5)(X, Y) || cap(9, 10.8, 7.6, 11.6, 0.4)(X, Y);
      return roo ? 'g' : orb(6, 4, 14, 14, 'BCCDF')(x, y);
    }, 'A')
  ]));

  /* The Sydney Opera House: its white shells in two groups, tiled and
     shining, amber glass in their open ends, on a broad stone podium. */
  deco('operahouse', build(128, 72, (function () {
    var base = 53;
    /* a shell, side on: like a slice of orange stood on its end, both
       edges bowed out, rising from its feet (ax, bx) to a sharp tip
       (tx, ty) that leans whichever way it faces. Glass fills the mouth
       at its front foot. */
    var shell = function (sh) {
      return function (x, y) {
        if (y < sh[2] || y > base) return false;
        var u = (base - y) / (base - sh[2]);
        return x >= sh[1] - (sh[1] - sh[0]) * (1 - Math.pow(u, 1.7)) && x <= sh[1] + (sh[3] - sh[1]) * (1 - Math.pow(u, 1.35));
      };
    };
    // back to front: each group has a small shell facing the other way behind it
    var shells = [[56, 66, 28, 72], [27, 34, 15, 62], [3, 12, 4, 52], [110, 120, 33, 127], [92, 98, 23, 116], [70, 78, 11, 110]];
    var parts = [];
    [[1, 46], [24, 58], [68, 104], [89, 112]].forEach(function (g) {
      parts.push(P('B', tri(g[0], base, g[0] + 9, base - 15, g[0] + 13, base), function (x, y) { return x % 3 === 0 ? 'A' : y % 3 ? 'C' : 'B'; }, 'A'));
    });
    shells.forEach(function (sh) {
      var lean = sh[1] - (sh[0] + sh[3]) / 2;
      parts.push(P('w', shell(sh), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, u = (X - sh[0]) / (sh[3] - sh[0]);
        // tiled ribs sweeping down from the tip; in shade on the far side
        if ((X * 0.6 - Y * (lean < 0 ? 0.9 : -0.9) + 200) % 3.6 < 0.55) return u > 0.55 ? '2' : '1';
        return u > 0.68 ? 'W' : u < 0.25 ? 'R' : 'w';
      }, 'P'));
    });
    // the podium and its broad steps
    parts.push(P('Ψ', rrect(0, base, 128, 72, 1), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (X < 40 && Y > base + 4) return Math.floor(Y) % 2 ? 'γ' : 'β';
      if (Y < base + 2) return 'δ';
      return (X % 16 < 0.7 || Math.abs(Y - 63) < 0.5) ? 'β' : orb(40, base, 90, 30, 'βγγδε')(x, y);
    }, 'α'));
    return parts;
  })()));

  /* ---- On a rainbow ---- */
  deco('cloudpuff', build(42, 24, [
    P('w', function (x, y) { return y < 23.9 && or(ell(8, 16, 6.6, 6), ell(17, 10, 8.6, 8), ell(27, 11, 8, 7.6), ell(35, 16.6, 6, 5.6), ell(21, 17, 9, 6.6))(x, y); }, orb(16, 6, 26, 18, '1Wwww'), '1')
  ], [[12, 5, ['R']], [14, 4, ['R']]]));

  deco('minirainbow', build(48, 26, (function () {
    var bands = [RED, ORANGE, GOLD, CACT, SKY, LILAC], parts = [];
    bands.forEach(function (t, k) {
      var ro = 22.6 - k * 2.4, ri = ro - 2.4;
      parts.push(P(t.charAt(2), function (x, y) { var dx = x - 24, dy = y - 25.6, r = Math.sqrt(dx * dx + dy * dy); return r <= ro && r > ri && y < 25.9; }, function (x, y) { return y < 12 ? t.charAt(3) : t.charAt(2); }));
    });
    return parts.concat(clump5([[4, 21.6, 4], [9, 22, 3.4], [7, 18.6, 3.4], [39, 22, 3.4], [44, 21.6, 4], [41, 18.6, 3.4]], '1Wwww'));
  })()));

  // a pot of gold: a black pot heaped with coins, one rolled away, glints
  deco('potofgold', build(30, 26, (function () {
    var coins = [], r = BB.rng(11);
    for (var i = 0; i < 26; i++) { var a = 0.15 + r() * (Math.PI - 0.3), d = Math.sqrt(r()); coins.push([15 + Math.cos(a) * 10.6 * d, 9.6 - Math.sin(a) * 7.4 * d]); }
    return [
      P('g', or(ell(15, 16.6, 12.4, 9), rrect(4, 9, 26, 16, 2)), function (x, y) { return y + 0.5 < 13 ? 'h' : orb(10, 12, 16, 12, INK)(x, y); }, 'f'),
      P('C', or.apply(null, coins.map(function (c) { return ell(c[0], c[1], 2.4, 1.8); })), function (x, y) {
        for (var i = coins.length - 1; i >= 0; i--) { var c = coins[i]; if (ell(c[0], c[1], 2.4, 1.8)(x + 0.5, y + 0.5)) return ell(c[0] - 0.4, c[1] - 0.3, 1.2, 0.8)(x + 0.5, y + 0.5) ? 'D' : 'C'; }
        return 'C';
      }, 'A'),
      P('i', rrect(2.6, 9.4, 27.4, 12.4, 1.4), orb(10, 9, 20, 4, INK), 'g'),
      P('C', ell(27, 23.4, 2.6, 2.4), orb(26, 22.6, 2.6, 2.4, GOLD), 'A')
    ];
  })(), [[8, 3, ['.w.', 'www', '.w.']], [20, 1, ['w']], [26, 22, ['D']]]));

  // a star flower: five pink star-petals round a golden middle
  deco('starflower', build(22, 30, [
    P('<', cap(11, 14, 11.4, 30, 1.3), orb(10, 14, 3, 16, LEAF), '('),
    P('<', or(turned(ell(6.4, 23.6, 4.4, 1.8), 6.4, 23.6, 0.5), turned(ell(15.8, 21.4, 4.4, 1.8), 15.8, 21.4, -0.5)), orb(10, 20, 10, 5, LEAF), '('),
    P('ϩ', starFn(11, 10, 10, 4.6, -Math.PI / 2), starTx(11, 10, -Math.PI / 2, CORAL), 'ϧ'),
    O(11, 10.4, 2.8, 2.8, GOLD, 'A')
  ], [[9, 9, ['D']]]));

  /* ---- Dinosaur Land ---- */
  var ROCK = ramp('ϬϭϮϯϰ', ['#2a1a20', '#46282c', '#6a3c38', '#8e5848', '#c08a70']);   // volcanic rock
  /* A volcano, smoking: a dark cone, a glowing crater, two rivers of
     lava running down it, puffs of smoke rising (and moving on). */
  deco('volcano', [0, 1].map(function (f) {
    var lava = [taper([[28, 17], [25, 25], [27, 33], [22, 42], [20, 49.6]], 1.6, 2.2), taper([[38, 17], [41, 26], [39, 34], [44, 42]], 1.4, 1.8)];
    var puffs = f ? [[35, 10, 4.4], [39, 4.4, 4], [31, 2.6, 2.8]] : [[32, 11, 4.4], [28.6, 5, 4], [36, 3, 3.2]];
    return build(66, 50, [
      P('Ϯ', function (x, y) { if (y < 15.6) return false; var u = (y - 15.6) / 34.4, w = 9 + 24 * Math.pow(u, 1.5); return Math.abs(x - 33) < w + Math.sin(y * 0.9) * 0.5; }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(22, 18, 30, 34, ROCK)(x, y);
        return (X * 0.7 + Y * 0.3) % 6 < 0.8 ? step(ROCK, t, -1) : t;
      }, 'ϭ'),
      P('6', ell(33, 16.6, 8.6, 2.2), function (x, y) { return y + 0.5 < 16.4 ? '8' : '7'; }, '5'),
      P('5', or.apply(null, lava), function (x, y) { return (x + y + f * 2) % 5 === 0 ? '7' : (x + y) % 3 ? '5' : '6'; }, '4')
    ].concat(puffs.map(function (p) { return O(p[0], p[1], p[2], p[2] * 0.86, 'OPPQR', 'O'); })));
  }));

  // a nest of twigs with three speckled eggs in it
  deco('nest', build(38, 18, (function () {
    var twig = function (x, y) { return (x * 2 + y * 3) % 7 < 1.4 ? 'S' : (x - y * 2 + 40) % 6 < 1.2 ? 'B' : orb(12, 4, 28, 12, WOOD)(x, y); };
    return [
      P('U', ell(19, 9, 17.6, 4.4), twig, 'S'),
      P('Y', eggF(12, 7.6, 4, 5.2), eggTex, 'Z'),
      P('Y', eggF(26, 7.6, 4, 5.2), eggTex, 'Z'),
      P('Y', eggF(19, 6.6, 4.2, 5.6), eggTex, 'Z'),
      P('U', function (x, y) { return ell(19, 10.6, 18.6, 7)(x, y) && y > 9.6 + Math.sin(x * 1.1) * 0.6 && y < 17.9; }, twig, 'S')
    ];
  })(), [[10, 4, ['w']], [17, 3, ['w']], [24, 4, ['w']]]));

  // a fossil: a dinosaur skull, a curving spine and its ribs, long dry
  deco('bones', build(32, 14, (function () {
    var verts = [], ribs = [];
    for (var i = 0; i < 8; i++) {
      var vx = 12.4 + i * 2.5, vy = 5.4 - Math.sin(i * 0.45) * 1.6 + i * 0.5, r = 1.6 - i * 0.12;
      verts.push(ell(vx, vy, r, r * 0.9));
      if (i > 0 && i < 5) ribs.push(limb([[vx, vy + 1], [vx + 1.6, vy + 4], [vx + 0.4, vy + 7.2]], 0.85));
    }
    return [
      P('Z', or.apply(null, ribs), orb(16, 6, 10, 8, 'VZZYw'), 'V'),
      P('Y', or.apply(null, verts), orb(18, 3, 14, 6, CREAM), 'V'),
      P('Y', or(ell(6.4, 6.4, 5.8, 4.6), rrect(0.6, 6.6, 9, 11, 1.6), cap(2, 12.4, 9.6, 12.6, 1)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (ell(6.6, 5.4, 1.9, 1.7)(X, Y)) return 'T';
        if (ell(2.4, 7.2, 0.8, 0.7)(X, Y)) return 'T';
        if (Y > 10.6 && Y < 11.8 && X < 8.6) return X % 2 < 1 ? 'V' : 'w';
        return orb(4, 4, 8, 8, CREAM)(x, y);
      }, 'V')
    ];
  })()));

  // a cycad: a stout scaly trunk under a crown of stiff fronds, a golden
  // cone at its heart
  deco('cycad', build(32, 44, (function () {
    var parts = [P('T', rrect(11.6, 21, 20.4, 44, 2), function (x, y) { var X = x + 0.5, Y = y + 0.5, d = (Math.abs(((X - 16 + Y * 0.6) % 3.4) - 1.7) + Math.abs(((X - 16 - Y * 0.6 + 40) % 3.4) - 1.7)); return d < 0.9 ? 'S' : orb(13, 24, 8, 22, WOOD)(x, y); }, 'S')];
    [-2.9, -2.4, -1.9, -1.25, -0.7, -0.25].forEach(function (a, k) {
      var L = 15 - Math.abs(a + 1.57) * 1.6, tx = 16 + Math.cos(a) * L, ty = 21 + Math.sin(a) * L * 0.9;
      var mx = 16 + Math.cos(a) * L * 0.55, my = 21 + Math.sin(a) * L * 0.75 - 1.6;
      var fr = taper([[16, 21], [mx, my], [tx, ty + 3.4]], 2.8, 1);
      parts.push(P('{', fr, function (x, y) { return (x + y * (a < -1.57 ? -1 : 1) + 50) % 2.4 < 0.9 ? ']' : orb(16, 10, 16, 14, CACT)(x, y); }, '['));
    });
    parts.push(O(16, 20.4, 3, 3.6, 'klmnC', 'k'));
    return parts;
  })()));
  /* ---- on the sprite sheet (tools/sheet.html?only=land5) ----
     The scenery and the platform looks show in the sheet's own deco and
     platform-looks groups; the creatures (with the egg) and the springs
     get groups of their own. */
  (A.sheet = A.sheet || []).push(
    ['land5 world', WORLD],
    ['land5 springs', [].concat.apply([], SPRINGS.map(function (sp) { return [[sp[0], sp[1][0]], ['', sp[1][1]]]; }))]
  );
})();
