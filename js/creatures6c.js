/* ==========================================================================
   creatures6c.js — HALF TERM!, the sixth land (levels 46–55), part three:
   the things Bonnie rides and bounces on, the set pieces and the big
   scenery. Autumn by day (a hay cart, a sleepy owl), then a spooky-cute
   Halloween night: Pumpkin Town's curly hill, the graveyard's bone
   xylophone, the Haunted Mansion's buggy, candelabras, chandeliers and
   stretching portraits, the witch's broom and cauldron, firework night,
   and the crooked little house at the end of every level.

   The same hand as creatures.js: round soft shapes lit from the top left
   (each shade from a five-tone ramp, deep to shine), a coloured outline,
   big friendly eyes with a sparkle. Spooky, never scary: everyone is
   sleepy, giggly or grinning, and nothing has sharp teeth. Like the
   land-5 files, this one keeps its own palette and copies of the drawing
   helpers it needs, so it depends only on BB.ART.kit.
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
  var INK = 'fghij', SNOW = '21WwR', RED = 'uvxyz', GOLD = 'ABCDF', WOOD = 'STUVX', IRON = 'NOPQR', PINK = 'pqrst',
    PURP = 'abcde', ORANGE = 'klmno', CACT = '[]{}~', LEAF = '()<>^', TEAL = '@+=-:', COAT = ';_|?/', FIRE = '45678', CREAM = 'ZZYYw';
  /* This land's own ramps, five tones deep to shine. Every printable ASCII
     character is a colour already, so each ramp is handed the next few
     characters from the Armenian block, made here at load time (so no
     unusual letters need typing in this file's strings). Textures name the
     ramps, never the letters. */
  var nextCh = 0x0531;
  var ramp = function (cols) { var s = ''; cols.forEach(function (c) { var ch = String.fromCharCode(nextCh++); PAL[ch] = c; s += ch; }); return s; };
  var HAY = ramp(['#7a5a18', '#b48c30', '#dcb850', '#f2da84', '#fff6c8']);      // hay bales and broom straw
  var OWL = ramp(['#3c200e', '#6e3e1c', '#a0622e', '#cc9254', '#f0cc98']);      // a tawny owl's back
  var BUFF = ramp(['#8a5a30', '#c08e5c', '#e8c08c', '#f8e0b8', '#fff6e4']);     // its pale face and front
  var GHOST = ramp(['#5c6aa8', '#8ea4dc', '#c4d8f8', '#e8f4ff', '#ffffff']);    // ghostly white-blue
  var SLIME = ramp(['#1c5a1a', '#36962a', '#62d03a', '#a8f060', '#eaffc0']);    // bubbling potion green
  var BONE = ramp(['#7c6c58', '#b4a488', '#e0d4b8', '#f6eedc', '#ffffff']);     // bone white
  var SLATE = ramp(['#2a2438', '#463c5c', '#685c82', '#9a8eb4', '#d4cce6']);    // purple-grey roof slates
  var HILL = ramp(['#141c38', '#22305a', '#34487c', '#5a70a8', '#a8bce0']);     // the curly hill's slate blue
  var PLUM = ramp(['#1e0e2a', '#341a46', '#4e2a66', '#704290', '#a87cc8']);     // a portrait's dark ground
  var PAPER = ramp(['#0e2a2a', '#18403e', '#265a56', '#3c7c74', '#7ab8a8']);    // the mansion's teal wallpaper
  var BRICK = ramp(['#4a1a1a', '#7a2c24', '#a84432', '#d0704c', '#f0b090']);    // chimney brick
  var FACE = ramp(['#b8785a', '#e0a888', '#f8d0b4', '#ffe8d8', '#ffffff']);     // painted faces
  var CROC = ramp(['#14321a', '#225228', '#3a7c38', '#68aa50', '#b8e08e']);     // a friendly crocodile
  var SHELL = ramp(['#2e3a14', '#4e5e20', '#768a34', '#a4b85a', '#dce8a0']);    // a tortoise's shell
  var LILAC = ramp(['#4a2a7a', '#7244b0', '#9c6ede', '#c6a2f6', '#f0e4ff']);    // toadstool violet
  var SKY = ramp(['#0e4a8a', '#1c74c8', '#3aa0f0', '#86cdfc', '#e0f4ff']);      // firework blue
  var CORAL = ramp(['#8a1a3a', '#c42a52', '#ee4a72', '#ff86a4', '#ffd6e2']);    // firework pink
  var LIME = ramp(['#2c5a10', '#4a8a18', '#78bc28', '#b0e050', '#eaffb0']);     // firework lime
  var MAROON = ramp(['#3a0a14', '#5c1220', '#86202e', '#b23a44', '#e07a7a']);   // red velvet
  var ICE = ramp(['#4a7ab0', '#7cb0e0', '#b4dcf8', '#e6f6ff', '#ffffff']);      // chandelier crystal
  var MOSS = ramp(['#3a4430', '#56643e', '#76885a', '#9cae7e', '#d0dcb4']);     // old mossy stone
  var NIGHT = ramp(['#0c0a1e', '#18142e', '#241e44', '#342c5c', '#4a4078']);    // an open doorway's dark
  // the bone xylophone's seven note colours (C D E F G A B), each a ramp round the given colour
  var NOTE = ['#ff5a6a', '#ffa040', '#ffd84a', '#5cd06a', '#4aa8ff', '#7a6ae8', '#c070f0'].map(function (c) {
    var mix = function (to, k) {
      var a = parseInt(c.slice(1), 16), b = parseInt(to.slice(1), 16), o = '#';
      [16, 8, 0].forEach(function (s) { var v = Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k); o += (v < 16 ? '0' : '') + v.toString(16); });
      return o;
    };
    return ramp([mix('#1c1428', 0.55), mix('#1c1428', 0.25), c, mix('#ffffff', 0.4), mix('#ffffff', 0.8)]);
  });

  // a round shape lit from the top left and a little in front
  var orb = function (cx, cy, rx, ry, t) {
    return function (x, y) {
      var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, n = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy));
      var i = -0.48 * dx - 0.58 * dy + 0.66 * n;
      return i > 0.9 ? t[4] : i > 0.6 ? t[3] : i > 0.22 ? t[2] : i > -0.12 ? t[1] : t[0];
    };
  };
  /* A part: its colour, its inside test, a texture, the line where it
     crosses a part behind it, and (new here) `rim`, a colour for its outer
     edge in place of the dark outline — for things that glow or are too
     thin to outline: a flame, a spark, a cobweb thread, a bubble. */
  var P = function (c, f, tex, line, rim) { return { c: c, f: f, tex: tex, line: line || null, rim: rim || null }; };
  var O = function (cx, cy, rx, ry, t, line) { return P(t[2], ell(cx, cy, rx, ry), orb(cx, cy, rx, ry, t), line); };
  var or = function () { var fs = arguments; return function (x, y) { for (var i = 0; i < fs.length; i++) if (fs[i](x, y)) return true; return false; }; };
  var both = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var but = function (a, b) { return function (x, y) { return a(x, y) && !b(x, y); }; };
  // a tone k steps lighter (or darker, k < 0) along its ramp
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
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
  // a little pseudo-random number for each pixel, 0 to 1 (straw, sparkle, moss)
  var hash = function (x, y, k) { var h = Math.sin(x * 12.9898 + y * 78.233 + (k || 0) * 37.719) * 43758.5453; return h - Math.floor(h); };
  /* The kit's scene, with one addition: a part's `rim` (a character, or
     a function of x and y) colours its outer edge instead of '#'. */
  var scene = function (W, H, parts) {
    var own = [], x, y, i;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var top = -1;
      for (i = 0; i < parts.length; i++) if (parts[i].f(x + 0.5, y + 0.5)) top = i;
      own.push(top);
    }
    var at = function (x, y) { return x < 0 || y < 0 || x >= W || y >= H ? -1 : own[y * W + x]; };
    var rows = [];
    for (y = 0; y < H; y++) {
      var r = '';
      for (x = 0; x < W; x++) {
        var k = at(x, y);
        if (k < 0) { r += '.'; continue; }
        var Pk = parts[k], n = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)];
        if (n.indexOf(-1) > -1) r += Pk.rim ? (typeof Pk.rim === 'function' ? Pk.rim(x, y) : Pk.rim) : '#';
        else if (Pk.line && n.some(function (j) { return j < k; })) r += Pk.line;
        else r += Pk.tex ? Pk.tex(x, y) : Pk.c;
      }
      rows.push(r);
    }
    return rows;
  };
  var finish = function (rows, W) {
    // a texture that gives no colour would put 'undefined' in a row: say so
    if (rows.some(function (r) { return r.length !== W; }) && window.console) console.error('creatures6c: ragged sprite', W, rows.length);
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  };
  var build = function (W, H, parts, stamps) {
    var rows = scene(W, H, parts);
    (stamps || []).forEach(function (s) { K.stamp(rows, Math.round(s[0]), Math.round(s[1]), s[2]); });
    return finish(rows, W);
  };
  // the same, with a last pass over every pixel (to thin a shape to a dotted outline)
  var buildWith = function (W, H, parts, stamps, post) {
    var rows = scene(W, H, parts);
    (stamps || []).forEach(function (s) { K.stamp(rows, Math.round(s[0]), Math.round(s[1]), s[2]); });
    rows = rows.map(function (r, y) { return r.split('').map(function (c, x) { return post(c, x, y, rows); }).join(''); });
    return finish(rows, W);
  };
  // a picture painted pixel by pixel (fn gives a character, or '.' for nothing)
  var paint = function (W, H, fn) {
    var rows = [];
    for (var y = 0; y < H; y++) { var r = ''; for (var x = 0; x < W; x++) r += fn(x, y) || '.'; rows.push(r); }
    return finish(rows, W);
  };
  var look = function (sp, top) { sp.top = top || 0; return sp; };
  /* An animated look: an array of frames, each with its top. The array
     also carries its first frame's picture, so anything that draws a look
     without animating it (the sprite sheet, say) still shows something. */
  var looks = function (list, top) {
    list.forEach(function (sp) { look(sp, top); });
    ['rows', 'cols', 'w', 'h', 'pal', 'hi', 'mode', 'noLight', 'top'].forEach(function (k) { list[k] = list[0][k]; });
    list.c = {};
    return list;
  };
  var deco = function (name, v) { D[name] = v; };
  // eyes, looking left: big, small, closed, happy (a smile of an eye)
  var EYE = ['.##.', '#ww#', '#Ew#', '#EE#', '.##.'];
  var EYE_S = ['.#.', '#Ew', '#EE', '.#.'];
  var SHUT = ['....', '#..#', '.##.'];
  var HAPPY = ['.##.', '#..#'];
  // a candle flame, its foot at (cx, by), h tall, leaning; glowing, no outline
  var flame = function (cx, by, h, lean) {
    var f = or(ell(cx, by - 1.3, 1.5, 1.5), tri(cx - 1.45, by - 1.5, cx + 1.45, by - 1.5, cx + lean, by - h));
    return P('6', f, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > by - 1.2 && Math.abs(X - cx) < 0.8) return '8';
      return Y > by - h * 0.62 && Math.abs(X - cx - lean * (by - Y) / h) < 1 ? '7' : '6';
    }, null, '5');
  };
  // a wax candle, its top at y0 and its foot at y1, with a drip down its front
  var candle = function (cx, y0, y1, drip) {
    return P('w', or(rrect(cx - 1.9, y0, cx + 1.9, y1, 0.6), rrect(cx + drip - 0.7, y0, cx + drip + 0.7, y0 + 3, 0.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < y0 + 1.1) return 'R';
      if (Math.abs(X - cx - drip) < 0.7 && Y < y0 + 3.4) return 'R';
      return X < cx - 0.6 ? 'R' : X < cx + 1 ? 'W' : '1';
    }, '2');
  };

  /* ==========================================================================
     PLATFORM LOOKS — what this land's moving platforms look like. Each is
     the platform's width; its `top` is how many game pixels down from the
     sprite's top edge Bonnie stands. An array is an animation.
     ========================================================================== */

  /* The pumpkin patch's hay cart: a red farm cart piled with golden hay
     bales tied with orange twine, a hay ladder at the front, a pitchfork
     stuck in at the back, two big spoked wheels. Bonnie stands on the hay. */
  var wheel = function (cx, cy, R, n, rot, t) {
    return P(t.charAt(2), ell(cx, cy, R, R), function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) + rot;
      if (r > R - 1.1) return dx + dy < -2 ? 'P' : 'O';
      if (r > R - 2.2) return orb(cx - 2, cy - 2, R, R, t)(x, y);
      if (r < 1.7) return orb(cx - 0.5, cy - 0.5, 2, 2, GOLD)(x, y);
      var u = a * n / (2 * Math.PI), fr = u - Math.floor(u), arc = Math.min(fr, 1 - fr) * 2 * Math.PI / n * r;
      return arc < 0.85 ? (dx + dy < 0 ? t.charAt(3) : t.charAt(2)) : t.charAt(0);
    }, t.charAt(0));
  };
  var straw = function (x, y, t, base) {
    // short strokes of straw, a tone up or down from the light
    var h = hash(Math.floor((x + y * 0.5) / 2), y), c = base;
    return h < 0.18 ? step(t, c, -1) : h > 0.86 ? step(t, c, 1) : c;
  };
  LK.haycart = look(build(64, 28, (function () {
    var parts = [];
    // the shafts, out in front to hitch a pony to
    parts.push(P('U', cap(0.6, 22, 8, 22, 1.4), orb(3, 20, 8, 4, WOOD), 'S'));
    // the hay ladder at the front: two posts, three rungs
    parts.push(P('T', or(cap(4.4, 20, 3.4, 1.6, 1.3), cap(10, 14, 9.2, 2.6, 1.3), cap(3.6, 3.2, 9.4, 3.8, 1), cap(3.8, 7.4, 9.5, 7.8, 1), cap(3.9, 11.2, 9.6, 11.4, 1)), orb(3, 1, 10, 14, WOOD), 'S', 'S'));
    // the pitchfork, stuck in the hay at the back
    parts.push(P('U', cap(53, 14, 59.4, 0.8, 1.3), orb(54, 2, 8, 14, WOOD), 'S', 'S'));
    parts.push(P('O', or(cap(50.6, 14, 51.6, 11, 0.8), cap(53.6, 13, 54.8, 10.6, 0.8), cap(51, 11, 55, 10.2, 0.8)), null, 'N', 'N'));
    // three bales, tied with orange twine
    [[10.6, 29.4], [28.6, 46.6], [45.6, 62.8]].forEach(function (b) {
      var x0 = b[0], x1 = b[1];
      parts.push(P(HAY[2], rrect(x0, 12, x1, 21.4, 2), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, w = x1 - x0;
        if (Math.abs(X - (x0 + w * 0.27)) < 0.65 || Math.abs(X - (x0 + w * 0.73)) < 0.65) return Y < 13.6 ? 'm' : 'l';
        // the cut ends of the straw, a tone darker along the bale's foot
        if (Y > 19.6) return straw(x, y, HAY, HAY[1]);
        return straw(x, y, HAY, orb(x0 + 4, 10, w * 1.1, 16, HAY)(x, y));
      }, HAY[0]));
    });
    // the cart's bed: a wooden top rail, a red side board with iron straps
    parts.push(P('v', rrect(3.6, 19.6, 63.4, 25.4, 1.2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 21) return orb(20, 17, 60, 6, WOOD)(x, y);
      if (Y > 24.2) return 'T';
      if ((X > 5.4 && X < 7) || (X > 59.8 && X < 61.4) || (X > 32.2 && X < 33.8)) return Y < 22.4 ? 'P' : 'O';
      return orb(18, 19, 60, 10, RED)(x, y);
    }, 'u'));
    // the wheels
    parts.push(wheel(17, 20.8, 7.1, 6, 0.3, WOOD), wheel(50, 20.8, 7.1, 6, 0.8, WOOD));
    // wisps of loose hay on top of the bales
    [[14, 12.4, 1], [21, 12.6, -1], [26.4, 12.2, 1], [35.4, 12.2, -1], [41.6, 12.4, 1], [57.6, 12.6, -1]].forEach(function (s) {
      parts.push(P(HAY[3], tri(s[0] - 1.6, s[1] + 0.6, s[0] + 1.6, s[1] + 0.6, s[0] + s[2] * 1.4, s[1] - 2.6), null, null, HAY[1]));
    });
    return parts;
  })(), [[54, 3, ['V']], [15, 16, ['ww']], [48, 16, ['ww']]]), 6);

  /* A big sleepy tawny owl, gliding with its wings spread flat; Bonnie
     stands on the top of its head, between the wings. [0] dozing, eyes
     half shut, wings level; [1] mid-flap, wings up, eyes wide — it's
     carrying him up. */
  var owlWing = function (side, lift) {
    var sx = 24 + side * 6.4, sy = 17, len = 23.4;
    // the leading edge gently arched; deepest by the body, rounding off to the tip
    var top = function (u) { return 13.2 - Math.sin(u * Math.PI) * 1.4 + u * u * 2.6; };
    var depth = function (u) { return 11.6 * Math.pow(Math.max(0, 1 - Math.pow(Math.max(0, u), 1.7)), 0.62); };
    var f = function (x, y) {
      var u = (x - sx) * side / len;
      if (u < -0.08 || u > 1) return false;
      // the trailing edge in rounded feather tips
      var feather = u > 0.08 ? Math.abs(Math.sin(u * len / 3.3 * Math.PI)) * 1.6 * Math.min(1, depth(u) / 6) : 0;
      return y > top(u) && y < top(u) + depth(u) + feather;
    };
    // its texture, at a pixel's centre (X, Y)
    var tex = function (X, Y) {
      var u = (X - sx) * side / len, d = Y - top(u), D = depth(u) || 1;
      var t = orb(sx - side * 2, sy - 9, len * 0.8, 14, OWL)(X - 0.5, Y - 0.5);
      // a row of pale spots along the coverts, then the long flight feathers, barred
      if (d > 1.2 && d < 3.2 && u > 0.08 && u < 0.72 && Math.abs(((u * len) % 3.6) - 1.8) < 0.7) return BUFF[3];
      if (d > D * 0.5) {
        if (Math.abs(((u * len) % 3.3) - 1.65) < 0.35) return OWL[0];
        return Math.abs(((d * 1.1) % 2.6) - 1.3) < 0.5 ? OWL[1] : (u > 0.6 ? OWL[2] : OWL[3]);
      }
      return t;
    };
    return lift ? { f: turned(f, sx, sy, -side * lift), tex: turned(tex, sx, sy, -side * lift) } : { f: f, tex: tex };
  };
  var owl = function (fr) {
    var parts = [], lift = fr ? 0.5 : 0;
    [-1, 1].forEach(function (s) {
      var w = owlWing(s, lift);
      parts.push(P(OWL[2], w.f, function (x, y) { return w.tex(x + 0.5, y + 0.5); }, OWL[0]));
    });
    parts.push(P('B', or(ell(20.8, 28.6, 2.2, 1.4), ell(27.2, 28.6, 2.2, 1.4)), orb(19, 27.6, 6, 3, GOLD), 'A'));
    // a round, streaky front
    parts.push(P(BUFF[2], ell(24, 22.8, 8.8, 5.4), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(21, 20, 12, 10, BUFF)(x, y);
      return Y > 24 && Math.abs(((X + 0.8) % 3.2) - 1.6) < 0.45 && hash(Math.floor(X / 3.2), Math.floor(Y / 2.4)) > 0.35 ? OWL[2] : t;
    }, OWL[1]));
    // the head, its two pale face-discs rimmed in brown
    parts.push(P(OWL[2], function (x, y) { return ell(24, 18.8, 11, 7)(x, y) && y < 23.8; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(21, 13, 14, 10, OWL)(x, y);
      return Y < 14.6 && Math.abs(((X + Y * 0.3) % 3.4) - 1.7) < 0.4 ? step(OWL, t, -1) : t;
    }, OWL[0]));
    parts.push(P(BUFF[3], or(ell(19.8, 19.4, 4.6, 4.2), ell(28.2, 19.4, 4.6, 4.2)), orb(18, 16, 10, 8, BUFF), OWL[1]));
    // the eyes: big and dark; dozing, their lids drooped half over them
    [20, 28].forEach(function (ex) {
      parts.push(P('E', ell(ex, 19.6, 2.5, 2.7), function (x, y) { return 'E'; }, 'f'));
      if (!fr) parts.push(P(BUFF[2], both(ell(ex, 19.6, 2.7, 2.9), function (x, y) { return y < 19.8; }), orb(ex - 1, 17, 4, 4, BUFF), 'G'));
    });
    // the beak
    parts.push(P('B', tri(22.7, 20.6, 25.3, 20.6, 24, 23.6), orb(23, 20, 3, 3, GOLD), 'A'));
    var st = fr ? [[18, 18, ['w']], [26, 18, ['w']], [19, 19, ['w']], [27, 19, ['w']]] : [[18, 20, ['w']], [26, 20, ['w']]];
    // pale brows meeting over the beak, and a blush under each eye
    st.push([20, 15, [BUFF[4] + BUFF[4] + BUFF[4]]], [25, 15, [BUFF[4] + BUFF[4] + BUFF[4]]], [23, 16, [BUFF[4] + BUFF[4]]], [16, 22, ['33']], [30, 22, ['33']]);
    return look(build(48, 30, parts, st), 6);
  };
  LK.owl = looks([owl(0), owl(1)], 6);

  /* The Haunted Mansion's buggy: a glossy black ride car, its hood curved
     over a tufted purple seat like a clamshell, high at the back, lined
     with a gold pinstripe; a little lamp on a curly iron stalk at the
     front, an iron shoe below that rides the rail. Bonnie stands on the
     hood's top edge. */
  LK.buggy = look(build(48, 40, (function () {
    // the shell's outline: a clamshell, its hood flat on top and curling
    // down at the front, rising at the back into a high rounded back
    var shellF = function (x, y) {
      if (x < 6.2 || x > 46.8 || y > 35.8) return false;
      var top = x < 13 ? 16 + Math.pow((13 - x) / 6.8, 2) * 4.6 : x < 33 ? 16 : 16 - Math.pow((x - 33) / 13.8, 1.7) * 6.2;
      if (y < top) return false;
      if (x > 40.6 && y < 16 && !ell(40.6, 16, 6.2, 6.2)(x, y)) return false;
      if (y > 27) return ell(25.6, 26.4, 21.2, 9.4)(x, y) || rrect(30, 20, 46.8, 34.6, 5)(x, y);
      return x < 30 ? y < 27 : true;
    };
    var slot = function (X, Y) { return X > 8.6 && X < 34 && Y > 20.6 + Math.max(0, 11.6 - X) * 0.4 && Y < 26.6; };
    var parts = [];
    // the rail shoe: an iron bogie, two little wheels on the rail
    parts.push(P('O', rrect(14.6, 33.6, 37.4, 37.6, 1.4), orb(20, 32, 20, 6, IRON), 'N'));
    parts.push(O(19.4, 37.6, 2.3, 2.3, IRON, 'N'), O(32.6, 37.6, 2.3, 2.3, IRON, 'N'));
    // the shell
    parts.push(P('h', shellF, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (slot(X, Y)) {
        // under the hood: the seat's tufted back and its cushion, purple velvet
        if (X > 24 || Y > 24.4) return (Math.abs(((X + (Y > 24.4 ? 0 : 1.6)) % 3.4) - 1.7) < 0.45 && Math.abs(((Y + 0.4) % 3) - 1.5) < 0.5) ? 'a' : orb(26, 19, 12, 10, PURP)(x, y);
        return Y < 22.4 ? 'f' : 'g';
      }
      // a gold pinstripe under the hood's lip and along the tub
      if (Y > 26.6 && Y < 27.8 && X < 40) return 'C';
      if (X < 34.4 && X > 7 && Y > 19.4 + Math.max(0, 11.6 - X) * 0.4 && Y < 20.6 + Math.max(0, 11.6 - X) * 0.4) return 'B';
      if (Math.abs(X - 35) < 0.6 && Y > 20 && Y < 27) return 'B';
      // glossy black: a long sheen along the hood, a softer one on the tub
      if (Math.abs(Y - 17.6) < 0.6 && X > 14 && X < 38) return 'j';
      if (Math.abs(Y - 29.6) < 0.5 && X > 10 && X < 26) return 'i';
      return orb(20, 14, 30, 22, INK)(x, y);
    }, 'f', function (x, y) { return y < 24 || x > 40 ? 'i' : 'g'; }));
    // the high back, its top curled over, and a purple tassel
    parts.push(P('c', or(ell(45, 9.8, 1.6, 1.6), rrect(43.8, 10.4, 46.2, 15, 0.8)), orb(44, 9, 3, 6, PURP), 'a'));
    // the lamp's curly iron stalk, up from the front of the tub
    parts.push(P('i', limb([[8, 28], [4.6, 24], [3.4, 18], [4.4, 11.4], [7.6, 8.4], [10.4, 9.4], [10.4, 11.6]], 0.85), null, null, 'i'));
    // the lamp: a little brass lantern hung from the curl, glowing amber
    parts.push(P('C', or(rrect(8.2, 11.8, 12.6, 13.2, 0.5), rrect(8.6, 18.2, 12.2, 19.4, 0.5), ell(10.4, 19.8, 1, 0.8)), orb(9, 11, 4, 6, GOLD), 'A'));
    parts.push(P('7', rrect(8.8, 13, 12, 18.4, 0.6), function (x, y) { var X = x + 0.5; return Math.abs(X - 10.4) < 0.6 ? '8' : X < 10.4 ? '7' : '6'; }, 'B'));
    return parts;
  })(), [[16, 16, ['www']], [15, 17, ['w']]]), 8);

  /* A floating golden candelabra: Bonnie stands on its long curly arm,
     a candle burning at each end (the flames flicker), its stem hanging
     below in curls and knops down to a teardrop finial. */
  var candelabra = function (fr) {
    var parts = [], lean = fr ? 0.9 : -0.7, hgt = fr ? 4.6 : 5.4;
    // filigree under the arm: S-curls from the stem out to each end
    parts.push(P('B', or(
      limb([[24, 21], [19, 21.4], [14.6, 19.6], [12, 16.6]], 0.75), limb([[24, 21], [29, 21.4], [33.4, 19.6], [36, 16.6]], 0.75),
      limb([[24, 26], [17.6, 25.6], [13, 23], [11.4, 21]], 0.7), limb([[24, 26], [30.4, 25.6], [35, 23], [36.6, 21]], 0.7)
    ), null, null, 'A'));
    parts.push(P('C', or(ell(11.6, 21, 1.4, 1.4), ell(36.4, 21, 1.4, 1.4), ell(12, 16.4, 1.3, 1.3), ell(36, 16.4, 1.3, 1.3)), orb(11, 15, 26, 8, GOLD), 'A', 'A'));
    // the curls at each end of the arm
    [[6.4, 1], [41.6, -1]].forEach(function (c) {
      parts.push(P('C', but(ell(c[0], 17.4, 3.6, 3.4), or(ell(c[0] + c[1] * 0.6, 16.8, 1.6, 1.4), both(ell(c[0], 17.4, 4, 4), function (x, y) { return (x - c[0]) * c[1] > 0.6 && y < 17; }))), orb(c[0] - 2, 15, 6, 6, GOLD), 'A'));
    });
    // the stem: knops and a drip-cup, a teardrop finial
    parts.push(P('C', or(rrect(22.8, 14, 25.2, 31, 0.8), ell(24, 18.4, 2.6, 1.6), ell(24, 24, 3, 1.8), ell(24, 30.4, 2.8, 1.3), ell(24, 33, 2.1, 2.6), ell(24, 35.4, 0.9, 0.8)), function (x, y) {
      return orb(23, 16, 4, 30, GOLD)(x, y);
    }, 'A'));
    // the arm itself, with a cup at each end for the candles
    parts.push(P('C', or(rrect(2, 12, 46, 15.2, 1.6), ell(4.6, 12.4, 3.4, 1.2), ell(43.4, 12.4, 3.4, 1.2)), function (x, y) {
      var Y = y + 0.5;
      return Y < 13 ? 'D' : Y > 14.4 ? 'B' : orb(14, 10, 40, 8, GOLD)(x, y);
    }, 'A'));
    // the candles and their flames
    parts.push(candle(4.6, 4.4, 12, 1.2), candle(43.4, 4.4, 12, -1.2));
    parts.push(flame(4.6, 4.6, hgt, lean), flame(43.4, 4.6, fr ? 5.4 : 4.6, -lean));
    return build(48, 36, parts, [[23, 14, ['F']], [5, 12, ['F', '']]]);
  };
  LK.candelabra = looks([candelabra(0), candelabra(1)], 6);

  /* A crystal chandelier: Bonnie stands on its brass ring. A candle at
     each end, the stub of its chain at the top (the game draws the rest
     up to the ceiling), brass arms curling down to a boss, swags of
     crystal beads looping under the ring and cut-glass drops hanging all
     round, their glints moving between the frames. */
  var prism = function (cx, y0, h, w, fr, k) {
    // a cut-glass drop: a bead, then a long diamond, lit on its left facet
    var f = or(ell(cx, y0 + 0.9, 0.9, 0.9), function (x, y) { var my = y0 + 1.6 + h * 0.4; return Math.abs(x - cx) / w + Math.abs(y - my) / (y < my ? h * 0.4 : h * 0.6) <= 1; });
    return P(ICE[2], f, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if ((k + fr) % 3 === 0 && X < cx && Y > y0 + 2 && Y < y0 + 2 + h * 0.5) return 'w';
      return X < cx - 0.3 ? ICE[3] : X > cx + 0.6 ? ICE[1] : ICE[2];
    }, null, ICE[0]);
  };
  var chandelier = function (fr) {
    var parts = [];
    // the chain: a stub of links, one face-on, one edge-on
    parts.push(P('C', or(but(ell(32, 1.8, 1.8, 1.7), ell(32, 1.8, 0.5, 0.6)), but(ell(32, 6.6, 1.8, 1.7), ell(32, 6.6, 0.5, 0.6))), null, 'A', 'A'));
    parts.push(P('B', rrect(31.3, 2.8, 32.7, 5.6, 0.6), null, 'A', 'A'));
    // swags of beads looping under the ring, between the arms
    var beads = [];
    [[2.5, 14], [14, 26], [26, 38], [38, 50], [50, 61.5]].forEach(function (sw, k) {
      var sag = k === 2 ? 10.6 : k === 1 || k === 3 ? 8.4 : 6;
      for (var i = 0; i <= 6; i++) { var u = i / 6; beads.push([sw[0] + (sw[1] - sw[0]) * u, 12.8 + Math.sin(u * Math.PI) * sag]); }
    });
    parts.push(P(ICE[3], or.apply(null, beads.map(function (b) { return ell(b[0], b[1], 1.25, 1.25); })), function (x, y) {
      return hash(x, y, fr) > 0.6 ? 'w' : ICE[3];
    }, null, function (x, y) { return hash(x, y, fr + 3) > 0.85 ? 'w' : ICE[0]; }));
    // brass arms curving down and in to the boss
    parts.push(P('C', or(limb([[7, 12], [10, 19], [18, 24.4], [27, 25.6]], 1.25), limb([[57, 12], [54, 19], [46, 24.4], [37, 25.6]], 1.25), limb([[21, 12], [23, 18.4], [28, 22.6]], 1.1), limb([[43, 12], [41, 18.4], [36, 22.6]], 1.1)), orb(20, 10, 40, 20, GOLD), 'A', 'A'));
    // the drops hanging from the ring, the arms and the boss
    [[2.6, 12.2, 5], [14, 12.2, 5], [26, 12.2, 4], [38, 12.2, 4], [50, 12.2, 5], [61.4, 12.2, 5], [11, 19.6, 4.4], [53, 19.6, 4.4], [21.4, 24.6, 4.4], [42.6, 24.6, 4.4], [27.2, 29.6, 5], [36.8, 29.6, 5]].forEach(function (d, k) {
      parts.push(prism(d[0], d[1], d[2], 1.4, fr, k));
    });
    // the boss and its finial, a big drop at the very bottom
    parts.push(P('C', or(ell(32, 25.4, 6.6, 3.4), ell(32, 29.4, 3.4, 2.2), rrect(31, 28, 33, 32, 0.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Math.abs(Y - 25.6) < 0.5 && Math.abs(X - 32) < 6) return 'B';
      return orb(29, 22, 10, 8, GOLD)(x, y);
    }, 'A'));
    parts.push(prism(32, 31, 7.4, 1.9, fr, 1));
    // the ring: a deep brass band, a bright rim on top, a row of studs
    parts.push(P('C', rrect(1.2, 8, 62.8, 12.8, 2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 9.2) return 'D';
      if (Math.abs(Y - 10.8) < 0.8 && Math.abs(((X + 2) % 6) - 3) < 0.8) return Math.abs(Y - 10.4) < 0.4 && ((X + 2) % 6) < 3 ? 'F' : 'x';
      return Y > 11.8 ? 'B' : orb(20, 6, 60, 10, GOLD)(x, y);
    }, 'A'));
    // a candle at each end
    parts.push(P('C', or(ell(4.6, 8.2, 3, 1.1), ell(59.4, 8.2, 3, 1.1)), null, 'A'));
    parts.push(candle(4.6, 3.2, 8.2, fr ? 1.2 : -1.2), candle(59.4, 3.2, 8.2, fr ? -1.2 : 1.2));
    parts.push(flame(4.6, 3.4, fr ? 3.2 : 3.6, fr ? 0.8 : -0.6), flame(59.4, 3.4, fr ? 3.6 : 3.2, fr ? -0.6 : 0.8));
    return build(64, 40, parts);
  };
  LK.chandelier = looks([chandelier(0), chandelier(1)], 4);

  /* A ghostly cloud-platform with a sleepy face, fading in and out to the
     music: [0] solid, soft white-blue; [1] faint — just a dotted ghostly
     outline, when he can't stand on it. */
  var ghostCloud = function (x, y) {
    if (or(ell(8, 6.6, 6.6, 4.6), ell(17.4, 4.8, 7.6, 4.6), ell(28.6, 5, 8, 4.6), ell(39.6, 6.4, 7, 4.6))(x, y)) return true;
    if (rrect(1, 5.6, 47, 12, 4)(x, y)) return true;
    // a ghost's hem underneath: three wisps, each curling up at its tip
    var w = [[6, 15, 16.6], [19, 28, 17.6], [33, 42, 16.6]];
    for (var i = 0; i < w.length; i++) {
      var a = w[i][0], b = w[i][1], u = (x - a) / (b - a);
      if (u > 0 && u < 1 && y >= 11 && y < 11 + (w[i][2] - 11) * Math.sin(u * Math.PI * 0.86) * (1 - u * 0.3)) return true;
    }
    return false;
  };
  var ghostParts = [P(GHOST[2], ghostCloud, function (x, y) {
    var Y = y + 0.5, t = orb(18, 1, 44, 24, GHOST)(x, y);
    return Y > 13.6 && t === GHOST[3] ? GHOST[2] : t;
  }, null, GHOST[0])];
  var ghostFace = [[16, 7, ['....', '#..#', '.##.']], [27, 7, ['....', '#..#', '.##.']], [21, 10, ['#...#', '.###.']], [13, 10, ['33']], [32, 10, ['33']], [9, 3, ['ww', 'w.']], [20, 1, ['ww']]];
  LK.ghostplat = looks([
    build(48, 18, ghostParts, ghostFace),
    buildWith(48, 18, ghostParts, [], function (c, x, y, rows) {
      // only the outline survives, every other pixel of it
      var edge = c !== '.' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var r = rows[y + d[1]]; return !r || r.charAt(x + d[0]) === '.' || r.charAt(x + d[0]) === ''; });
      if (c === '#' && !edge) return GHOST[3];
      if (!edge) return '.';
      return (x + y) % 2 ? '.' : GHOST[3];
    })
  ], 3);

  /* ==========================================================================
     SPRINGS — four more things to bounce on, each 32 x 20 and the same two
     frames as A.bouncy, [ready, squashed]: the top row is where Bonnie
     lands; squashed they sit lower on the same feet.
     ========================================================================== */
  var SPRINGS = [];
  // a set of pixels, from points sampled along threads (for things one pixel thin)
  var pixset = function (pts) {
    var set = {};
    pts.forEach(function (p) { set[Math.floor(p[0]) + ',' + Math.floor(p[1])] = 1; });
    return function (x, y) { return !!set[Math.floor(x) + ',' + Math.floor(y)]; };
  };
  var coil = function (cx, y0, y1, rx, n) {
    // a coiled spring seen side on: a zigzag of brass wire, its back strokes in shadow
    var front = [], back = [];
    for (var k = 0; k < n; k++) {
      var ya = y0 + (y1 - y0) * k / n, yb = y0 + (y1 - y0) * (k + 0.5) / n, yc = y0 + (y1 - y0) * (k + 1) / n;
      front.push(cap(cx - rx, ya + 0.6, cx + rx, yb + 0.2, 0.7)); back.push(cap(cx + rx, yb + 0.2, cx - rx, yc - 0.2, 0.5));
    }
    return [P('A', or.apply(null, back), function () { return 'B'; }, 'A', 'A'),
      P('C', or.apply(null, front), function (x, y) { var X = x + 0.5; return X < cx - rx * 0.3 ? 'F' : X < cx + rx * 0.4 ? 'D' : 'C'; }, 'B', function (x) { return x + 0.5 < cx ? 'D' : 'C'; })];
  };

  /* A tombstone on a springy coil, a tuft of moss on its shoulder and a
     crescent moon and a star carved in it. Squashed, a little ghost pops
     its head out from behind it, giggling. */
  var graveSpring = function (sq) {
    var top = sq ? 5.2 : 0.4, foot = sq ? 15.6 : 11.4, parts = [];
    parts.push(P('<', function (x, y) { return y > 17.4 && ell(16, 20, 12, 2.6)(x, y); }, function (x, y) {
      return hash(x, y) > 0.7 ? '>' : y < 18.6 ? '<' : ')';
    }, '('));
    if (sq) {
      // the giggling ghost, peeping round the stone, one hand up
      parts.push(P(GHOST[3], or(ell(24.6, 8.6, 5.6, 5.2), rrect(19.6, 8.6, 30, 14, 2)), orb(23, 6, 9, 9, GHOST), GHOST[1]));
      parts.push(P(GHOST[3], ell(30.2, 6, 1.6, 1.5), orb(29, 5, 3, 3, GHOST), GHOST[1]));
    }
    parts = parts.concat(coil(16, foot, 18.6, 4.6, 2));
    // the stone: an arched tablet on a little plinth
    parts.push(P('Q', or(ell(16, top + 5.4, 6.2, 5.4), rrect(9.8, top + 5, 22.2, foot, 0.8), rrect(8.4, foot - 1.4, 23.6, foot + 0.8, 0.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > foot - 1.4) return Y < foot - 0.6 ? 'P' : 'O';
      // the carving: a crescent moon and a little star
      if (ell(15, top + 6.6, 2.9, 2.9)(X, Y) && !ell(16.6, top + 5.8, 2.5, 2.5)(X, Y)) return 'N';
      if (Math.abs(X - 19.5) < 0.6 && Math.abs(Y - top - 9.5) < 1.6 || Math.abs(Y - top - 9.5) < 0.6 && Math.abs(X - 19.5) < 1.6) return 'N';
      var t = orb(12, top + 1, 14, 18, IRON)(x, y);
      return t === 'N' ? 'O' : t;
    }, 'N'));
    // a tuft of moss on its shoulder
    parts.push(P('<', or(ell(12, top + 1.6, 2.6, 1.4), ell(10.4, top + 3.2, 1.5, 1.4)), function (x, y) { return hash(x, y, 2) > 0.5 ? '>' : '<'; }, '('));
    var st = sq ? [[22, 8, ['#.#']], [26, 8, ['#.#']], [22, 9, ['.#.']], [26, 9, ['.#.']], [23, 11, ['###', '#s#', '.#.']], [21, 11, ['3']], [27, 11, ['3']]] : [[12, Math.round(top + 2), ['ww']]];
    return build(32, 20, parts, st);
  };
  A.gravespring = [graveSpring(false), graveSpring(true)];
  SPRINGS.push(['gravespring', A.gravespring]);

  /* A short, fat golden organ pipe with a cheeky face: its flue mouth is
     its grin. Squashed, it puffs out its cheeks. */
  var organPipe = function (sq) {
    var top = sq ? 6.6 : 1.6, x0 = sq ? 8.4 : 8.6, x1 = sq ? 23.6 : 23.4, body = sq ? 16.4 : 15, cx = 16, parts = [];
    // the conical foot and its little toe
    parts.push(P('B', function (x, y) { var u = (y - body) / (19.8 - body); return y > body - 0.5 && y < 19.8 && Math.abs(x - cx) < (x1 - x0) / 2 * (1 - u * 0.6); }, orb(13, body, 8, 8, GOLD), 'A'));
    // the pipe, its cheeks puffed out when squashed
    var pipe = sq ? or(rrect(x0, top, x1, body + 0.4, 2.2), ell(x0 + 0.6, top + 6, 3, 3.6), ell(x1 - 0.6, top + 6, 3, 3.6)) : rrect(x0, top, x1, body + 0.4, 1.6);
    parts.push(P('C', pipe, function (x, y) {
      var X = x + 0.5, u = (X - x0) / (x1 - x0);
      // a cylinder: bright down its left, deep at its right edge
      return u < 0.12 ? 'D' : u < 0.26 ? 'F' : u < 0.6 ? 'C' : u < 0.86 ? 'B' : 'A';
    }, 'A'));
    // the open top: a dark mouth inside a bright rim
    parts.push(P('D', ell(cx, top + 0.6, (x1 - x0) / 2 + 0.4, 1.8), function (x, y) {
      return ell(cx, top + 0.9, (x1 - x0) / 2 - 1.4, 0.9)(x + 0.5, y + 0.5) ? 'S' : 'D';
    }, 'B'));
    // the flue's pointed lip above the mouth
    parts.push(P('B', tri(cx - 3.2, top + 10.2, cx + 3.2, top + 10.2, cx, top + 7.4), null, 'A'));
    // the mouth: a wide grin with a tongue, or a little O when it's puffing
    var my = sq ? top + 7.6 : top + 10;
    parts.push(P('S', sq ? ell(cx, my, 2, 2) : function (x, y) { return y > my - 0.4 && ell(cx, my - 0.4, 4.8, 3.6)(x, y); }, function (x, y) {
      return !sq && y + 0.5 > my + 1.4 ? (x + 0.5 < cx ? 'y' : 'x') : 'S';
    }, 'S'));
    var st = sq
      ? [[10, top + 3, ['##..', '..#.', '##..']], [19, top + 3, ['..##', '.#..', '..##']], [8, top + 7, ['33']], [22, top + 7, ['33']], [15, top + 7, ['w']]]
      : [[10, top + 3, EYE], [17, top + 5, ['#..#', '.##.']], [9, top + 9, ['33']], [21, top + 9, ['33']], [10, top + 2, ['.##']], [17, top + 3, ['.##.']]];
    st.push([sq ? 10 : 9, sq ? top + 1 : top + 2, ['w', 'w']]);
    return build(32, 20, parts, st);
  };
  A.organpipe = [organPipe(false), organPipe(true)];
  SPRINGS.push(['organpipe', A.organpipe]);

  /* A spider's web strung as a trampoline between two crooked sticks, a
     little round spider minding it. Squashed, the web stretches down. */
  var webSpring = function (sq) {
    var cx = 16, cy = sq ? 7.4 : 7, rx = 11.8, ry = sq ? 4.2 : 6, sag = sq ? 7 : 0, pts = [], parts = [];
    var at = function (u, v) { var r2 = Math.min(1, u * u + v * v); return [cx + u * rx, cy + v * ry + sag * (1 - r2)]; };
    // threads: spokes out from the middle, and rings round it
    for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2 + 0.39; for (var t = 0; t <= 1; t += 0.015) pts.push(at(Math.cos(a) * t, Math.sin(a) * t)); }
    [0.38, 0.7, 1].forEach(function (r) { for (var a2 = 0; a2 < Math.PI * 2; a2 += 0.015) { var w = r < 1 ? r * (1 + 0.08 * Math.cos(a2 * 8)) : r; pts.push(at(Math.cos(a2) * w, Math.sin(a2) * w)); } });
    // the sticks, bent in a little when it's stretched
    var lean = sq ? 1.2 : 0;
    parts.push(P('T', or(limb([[3.4, 19.8], [4.4, 14], [3.2, 9], [3.6 + lean, 4], [2.4, 1.4]], 1.3), limb([[28.6, 19.8], [27.4, 13], [29, 8], [28.2 - lean, 3.6], [29.6, 0.8]], 1.3)), orb(2, 2, 8, 20, WOOD), 'S', 'S'));
    parts.push(P('W', pixset(pts), function (x, y) { return y < cy ? 'R' : 'W'; }, null, function (x, y) { return y + 0.5 < cy + sag * 0.6 ? 'R' : 'W'; }));
    // the spider, sat on the web's rim by the right-hand stick
    var sy = sq ? 5.2 : 3.4;
    parts.push(P('b', or(ell(23.6, sy, 2.8, 2.5), cap(21.4, sy + 1.6, 20.2, sy + 3.2, 0.55), cap(25.8, sy + 1.6, 27, sy + 3.2, 0.55), cap(22.6, sy + 2, 22.2, sy + 3.6, 0.55)), orb(22.6, sy - 1, 3, 3, PURP), 'a'));
    return build(32, 20, parts, [[21, Math.round(sy - 1), ['w.w', 'E.E']], [24, Math.round(sy) + 1, ['3']]]);
  };
  A.webspring = [webSpring(false), webSpring(true)];
  SPRINGS.push(['webspring', A.webspring]);

  /* A glowing purple toadstool, spotted lime, a sleepy smile on its
     stalk. Squashed, its cap spreads flat and it screws its eyes up. */
  var glowSpring = function (sq) {
    var cy = sq ? 12.6 : 9.6, rx = sq ? 15.4 : 13.6, ry = sq ? 5.6 : 9, sy = sq ? 13 : 10, parts = [];
    // the stalk, pale lilac
    parts.push(P('e', or(rrect(11.6, sy, 20.4, 19.8, 3), ell(16, 19, 6, 1.2)), orb(13, sy + 2, 8, 12, 'jdeeR'), 'c'));
    // the cap, lit from inside; lime spots, a pale fringe of gills underneath
    parts.push(P(LILAC[2], function (x, y) { return ell(16, cy, rx, ry)(x, y) && y < cy + 1.4; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > cy + 0.2) return LILAC[3];
      var sp = [[11, cy - ry * 0.55, 2.2], [19.4, cy - ry * 0.7, 2.4], [24.6, cy - ry * 0.25, 1.8], [6.6, cy - ry * 0.12, 1.6], [16, cy - ry * 0.2, 1.4]];
      for (var i = 0; i < sp.length; i++) if (ell(sp[i][0], sp[i][1], sp[i][2], sp[i][2] * (sq ? 0.7 : 0.9))(X, Y)) return X < sp[i][0] && Y < sp[i][1] ? LIME[4] : LIME[3];
      return orb(12, cy - ry * 0.6, rx, ry * 1.3, LILAC)(x, y);
    }, LILAC[0]));
    // a few glowing motes drifting off it
    var motes = sq ? [[3, 9], [29, 8]] : [[4, 2.4], [28.4, 3.6], [25, 0.8]];
    motes.forEach(function (m) { parts.push(P(LIME[4], ell(m[0], m[1], 0.8, 0.8), null, null, LIME[3])); });
    var st = sq ? [[13, 15, ['#.', '.#']], [17, 15, ['.#', '#.']], [15, 17, ['##']], [12, 17, ['3']], [19, 17, ['3']]]
      : [[11, 12, SHUT], [17, 12, SHUT], [14, 15, ['#..#', '.##.']], [12, 15, ['3']], [19, 15, ['3']]];
    return build(32, 20, parts, st);
  };
  A.glowshroom = [glowSpring(false), glowSpring(true)];
  SPRINGS.push(['glowshroom', A.glowshroom]);

  /* ---- the bone xylophone ------------------------------------------------
     Seven keys, C D E F G A B, each [up, squashed]: a chunky bone bar on a
     little trestle, a dot in its note's colour, and under it a golden
     resonator tube, longest for C, shortest for B. Pressed, the bone sits
     a pixel or two lower on the same feet. */
  var boneKey = function (i, sq) {
    var t = NOTE[i], half = 7.6 - i * 0.34, y0 = sq ? 2.6 : 0.6, x0 = 8 - half, x1 = 8 + half, parts = [];
    // a little trestle: two splayed legs and a crossbar, dark wood
    parts.push(P(SLATE[2], or(cap(x0 + 3, y0 + 5, x0 + 1.4, 15.6, 1), cap(x1 - 3, y0 + 5, x1 - 1.4, 15.6, 1), cap(x0 + 2.4, 12.4, x1 - 2.4, 12.4, 0.8)), orb(4, 6, 10, 14, SLATE), SLATE[0], SLATE[1]));
    // the bone: a thick shaft, two round knobs at each end
    parts.push(P(BONE[2], or(rrect(x0 + 2, y0 + 1.6, x1 - 2, y0 + 6, 1.4), ell(x0 + 2.1, y0 + 1.9, 2.1, 1.9), ell(x0 + 2.1, y0 + 5.7, 2.1, 1.9), ell(x1 - 2.1, y0 + 1.9, 2.1, 1.9), ell(x1 - 2.1, y0 + 5.7, 2.1, 1.9)), function (x, y) {
      var Y = y + 0.5;
      // a groove between the knobs at each end, the shaft lit along its top
      return orb(x0 + 4, y0 - 2, half * 2.2, 10, BONE)(x, y);
    }, BONE[1]));
    // the note's coloured dot
    parts.push(P(t[2], ell(8, y0 + 3.8, 2, 1.8), orb(7.2, y0 + 3, 2.4, 2.4, t), t[0]));
    return build(16, 16, parts, [[7, Math.round(y0 + 3), ['w']], [Math.round(x0 + 1), Math.round(y0 + 1), ['w']]]);
  };
  A.bonenotes = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return [boneKey(i, false), boneKey(i, true)]; });

  /* ==========================================================================
     SET PIECES AND RIDES
     ========================================================================== */
  var SET = [];
  // a little plotter for things made of loose points of light (sparks,
  // stars, trails): plot(x, y, ch, rank) keeps the highest-ranked mark on
  // each pixel; rows() hands back the picture
  var plotter = function (W, H) {
    var px = {}, rk = {};
    return {
      plot: function (x, y, ch, rank) {
        x = Math.round(x); y = Math.round(y);
        if (x < 0 || y < 0 || x >= W || y >= H) return;
        var k = x + ',' + y;
        if (rk[k] === undefined || (rank || 0) >= rk[k]) { px[k] = ch; rk[k] = rank || 0; }
      },
      at: function (x, y) { return px[x + ',' + y] || '.'; }
    };
  };
  // a twinkle: a four-pointed star of light, size n, its middle white
  var twinkle = function (pl, x, y, n, t, rank) {
    pl.plot(x, y, 'w', rank + 2);
    for (var i = 1; i <= n; i++) { var c = i === n ? t[2] : t[3]; pl.plot(x + i, y, c, rank); pl.plot(x - i, y, c, rank); pl.plot(x, y + i, c, rank); pl.plot(x, y - i, c, rank); }
  };

  /* A big firework rocket on its stick: a pointed cap with a star on it,
     a body in candy stripes, a long stick below. `stand`: on the roof, its
     fuse fizzing; `fly`: shooting up, flames and sparks streaming from its
     tail. `.grab` is where Bonnie's hands hold the stick as it carries him up. */
  var rocket = function (mode, fr) {
    var parts = [];
    // the stick, down the middle
    parts.push(P('U', rrect(8.1, 20, 11.9, 47.9, 1), function (x, y) { return x + 0.5 < 10 ? 'V' : 'U'; }, 'S', 'S'));
    if (mode === 'fly') {
      // the flame: a long teardrop of fire pointing down past the stick, sparks around it
      var L = fr ? 15 : 12.4, w = fr ? 4.6 : 5.2;
      parts.push(P('6', function (x, y) {
        var t = (y - 25) / L; if (t < 0 || t > 1) return false;
        var wob = Math.sin(t * 9 + fr * 2.4) * 0.6;
        return Math.abs(x - 10 - wob) < w * Math.sqrt(1 - t) * (t < 0.15 ? 0.7 + t * 2 : 1);
      }, function (x, y) {
        var t = (y + 0.5 - 25) / L, d = Math.abs(x + 0.5 - 10) / (w * Math.sqrt(Math.max(0.01, 1 - t)));
        return d < 0.35 && t < 0.55 ? '8' : d < 0.62 && t < 0.8 ? '7' : '6';
      }, null, '5'));
    }
    // the body: candy stripes running round it, a dark band at its foot
    parts.push(P('x', rrect(4.6, 8, 15.4, 26.4, 1.2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, u = (X - 4.6) / 10.8;
      if (Y > 24.4) return u < 0.3 ? 'O' : 'N';
      var band = Math.floor((Y - u * 4 + 20) / 3.2) % 2;
      var t = band ? RED : 'ZYYww';
      return u < 0.18 ? t.charAt(3) : u < 0.62 ? t.charAt(2) : u < 0.86 ? t.charAt(1) : t.charAt(0);
    }, 'u'));
    // the pointed cap, purple with a gold rim and a gold star
    parts.push(P('c', tri(3.6, 9.4, 16.4, 9.4, 10, 0.2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > 8.2) return 'C';
      if (Math.abs(X - 10) + Math.abs(Y - 5.6) < 1.6) return Math.abs(X - 10) + Math.abs(Y - 5.6) < 0.8 ? 'F' : 'D';
      return X < 9 ? 'd' : X < 11.6 ? 'c' : 'b';
    }, 'a'));
    if (mode === 'stand') {
      // the fuse, twisting out of the foot, and its fizzing spark
      parts.push(P('V', limb([[13, 25.6], [15, 27.4], [16.2, 26], [17.4, 28]], 0.6), null, null, 'U'));
      var sp = [[17.6, 28.4, 1.5], [15.4, 30.4, 0.7], [19.4, 26.2, 0.7], [19, 31, 0.6]];
      if (fr) sp = [[17.6, 28.4, 1.2], [16.2, 31.4, 0.7], [19.4, 30, 0.7], [18.4, 25.4, 0.6]];
      sp.forEach(function (s, i) { parts.push(P(i ? '7' : '8', ell(s[0], s[1], s[2], s[2]), null, null, i ? '6' : '7')); });
    } else {
      // sparks streaming down from the tail
      var sparks = fr ? [[4, 30], [16.4, 33], [3, 38.6], [17, 41], [6.4, 44.6], [14, 46.6], [2, 46]] : [[15.6, 30.4], [3.6, 34], [16.6, 37.6], [4.4, 42], [13.6, 44], [1.6, 41], [18, 46]];
      sparks.forEach(function (s, i) { parts.push(P(i % 3 ? '7' : '8', ell(s[0], s[1], i % 2 ? 0.8 : 1.1, i % 2 ? 0.8 : 1.1), null, null, i % 3 ? '6' : '7')); });
    }
    var sp2 = build(20, 48, parts, [[6, 10, ['w', 'w']]]);
    sp2.grab = [10, 43];
    return sp2;
  };
  A.firework = { stand: rocket('stand', 0), fly: [rocket('fly', 0), rocket('fly', 1)] };
  SET.push(['firework', [A.firework.stand].concat(A.firework.fly)]);

  /* A firework burst, 72 x 72: a bright point, then streaks shooting out
     into a big round chrysanthemum of sparks in gold, pink, lime and blue,
     then the sparks drooping and twinkling, and fading away. Made of light,
     so no outlines. */
  var BURST_T = [GOLD, CORAL, LIME, SKY];
  var burst = function (f) {
    var W = 72, cx = 36, cy = 36, pl = plotter(W, W);
    if (f === 0) {
      // the bang: a white-hot point with short rays
      for (var a0 = 0; a0 < 8; a0++) { var aa = a0 / 8 * Math.PI * 2, L0 = a0 % 2 ? 4 : 7; for (var r0 = 2; r0 <= L0; r0 += 0.5) pl.plot(cx + Math.cos(aa) * r0, cy + Math.sin(aa) * r0, r0 > L0 - 1.5 ? 'C' : 'D', 1); }
      for (var dy = -3; dy <= 3; dy++) for (var dx = -3; dx <= 3; dx++) { var d = dx * dx + dy * dy; if (d <= 9) pl.plot(cx + dx, cy + dy, d <= 2 ? 'w' : d <= 5 ? '8' : '7', 3); }
    } else {
      var N = [0, 16, 20, 24, 24, 24][f], R = [0, 13, 23, 31, 32.5, 33.5][f], t0 = [0, 0.18, 0.34, 0.5, 0.62, 0][f], droop = [0, 0, 0.4, 1.2, 3.4, 6.6][f];
      for (var k = 0; k < N; k++) {
        var a = (k + (f > 2 ? 0.5 : 0)) / N * Math.PI * 2, T = BURST_T[k % 4];
        var at = function (t) { return [cx + Math.cos(a) * R * t, cy + Math.sin(a) * R * t + droop * t * t]; };
        if (f < 5) {
          // the trail behind each spark: solid while it flies, dotted as it fades
          for (var t = t0; t < 1; t += 0.5 / R) {
            if (f === 4 && Math.floor(t * R) % 2) continue;
            var p = at(t); pl.plot(p[0], p[1], t > 0.8 ? T.charAt(3) : t > 0.55 ? T.charAt(2) : T.charAt(1), 1);
          }
        }
        var h = at(1);
        if (f === 5) {
          // fading: only some sparks left, small and dim, a few still twinkling
          if (k % 3 === 2) continue;
          if (k % 4 === 0) twinkle(pl, h[0], h[1], 1, T, 2); else pl.plot(h[0], h[1], T.charAt(2), 2);
        } else if (f === 4 && k % 2 === 0) {
          twinkle(pl, h[0], h[1], 2, T, 2);
        } else {
          // the spark itself: a round bead of light
          var rr = f === 1 ? 1 : 1.6;
          for (var yy = -2; yy <= 2; yy++) for (var xx = -2; xx <= 2; xx++) { var dd = xx * xx + yy * yy; if (dd <= rr * rr + 0.5) pl.plot(h[0] + xx, h[1] + yy, dd === 0 ? 'w' : dd <= 1 ? T.charAt(4) : T.charAt(3), 3); }
        }
      }
      if (f === 1) for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++) { var d2 = dx2 * dx2 + dy2 * dy2; if (d2 <= 4) pl.plot(cx + dx2, cy + dy2, d2 <= 1 ? '8' : '7', 3); }
      if (f === 3) for (var j = 0; j < 12; j++) { var aj = (j + 0.25) / 12 * Math.PI * 2; twinkle(pl, cx + Math.cos(aj) * 14, cy + Math.sin(aj) * 14 + 0.5, 1, GOLD, 0); }
      if (f === 4) for (var j2 = 0; j2 < 8; j2++) { var aj2 = (j2 + 0.6) / 8 * Math.PI * 2; pl.plot(cx + Math.cos(aj2) * 18, cy + Math.sin(aj2) * 18 + 2, 'D', 0); }
    }
    return paint(W, W, pl.at);
  };
  A.burst = [0, 1, 2, 3, 4, 5].map(burst);
  SET.push(['burst', A.burst]);

  /* The witch's spare broomstick: a long wooden handle with a knot in it
     and its tip curled up, a bristly straw brush bound with a purple
     ribbon and a bow. `idle`: hovering, a sparkle or two; `ride`: with a
     glittering trail of magic out of the brush. `.seat` is the top middle
     of the handle, where the rider's feet go. */
  var broom = function (mode, fr) {
    var parts = [];
    // the brush: straw fanning out behind, ragged at its end
    parts.push(P(HAY[2], function (x, y) {
      if (x < 31 || x > 50) return false;
      var u = (x - 31) / 19, half = 2.6 + u * 5.2 - Math.max(0, u - 0.86) * 18 * Math.abs(Math.sin(y * 1.7));
      var end = 49 - Math.abs(Math.sin(y * 2.3)) * 2.4;
      return Math.abs(y - 10.6 - u * 0.8) < half && x < end;
    }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, u = (X - 31) / 19;
      // straws along its length, darker where the bunch turns away
      var s = Math.abs(((Y - u * 0.8) * 1.4 + 20) % 2.2 - 1.1);
      if (s < 0.3) return HAY[1];
      return Y < 10.6 + u * 0.8 - 2 ? HAY[3] : Y > 10.6 + u * 0.8 + 3 ? HAY[1] : HAY[2];
    }, HAY[0]));
    // the handle, its tip curled up a little
    parts.push(P('U', limb([[2, 6.6], [3.6, 9], [8, 10.4], [20, 10.8], [34, 11]], 2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // grain along it, lit along its top
      if (Math.abs(((X * 0.35 + Y * 1.1) % 3.4) - 1.7) < 0.25) return 'T';
      return Y < 10 ? 'V' : Y < 11.2 ? 'U' : 'T';
    }, 'S'));
    // a knot in the wood
    parts.push(P('T', ell(13, 10.4, 1.4, 1.1), function (x, y) { return ell(13.2, 10.6, 0.6, 0.5)(x + 0.5, y + 0.5) ? 'S' : 'T'; }, 'S'));
    // the purple ribbon binding the brush on, and its bow
    parts.push(P('c', or(rrect(31.2, 6.6, 35.2, 15, 1.2), ell(33.2, 5.2, 2.4, 1.6), ell(36.4, 5.6, 2.2, 1.5), cap(33.6, 6, 31.8, 2.6, 0.7), cap(34.4, 6, 37.8, 2.4, 0.7)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 6.6) return X < 34.6 ? 'd' : 'c';
      return Math.abs(Y - 10.8) < 0.6 ? 'b' : X < 32.6 ? 'd' : X < 34.2 ? 'c' : 'b';
    }, 'a'));
    var st = [[5, 8, ['ww']]];
    if (mode === 'ride') {
      // the magic trail: glittering stars and dots streaming out behind the brush
      var bits = fr ? [[47, 4, 1, 0], [51.4, 9, 1.6, 1], [54.6, 3.4, 0.8, 2], [53.6, 15.6, 1, 3], [49.6, 17.6, 0.7, 0], [55, 11.6, 0.7, 2], [44.6, 1.6, 0.6, 3], [52, 0.8, 0.6, 0], [47.6, 13.2, 0.6, 2]]
        : [[48.4, 16, 1, 2], [52.4, 5, 1.6, 3], [55, 10.6, 0.8, 0], [51.6, 13.4, 0.8, 1], [46.6, 2.6, 0.7, 3], [54.6, 17.6, 0.7, 2], [55.2, 1.4, 0.6, 1], [49.4, 9.6, 0.6, 0], [44.4, 18, 0.6, 1]];
      var tones = [LILAC, CORAL, GOLD, SKY];
      bits.forEach(function (b) {
        var t = tones[b[3]];
        var f = b[2] > 1.2 ? or(cap(b[0] - 2.4, b[1], b[0] + 2.4, b[1], 0.5), cap(b[0], b[1] - 2.4, b[0], b[1] + 2.4, 0.5), ell(b[0], b[1], 1, 1)) : ell(b[0], b[1], b[2], b[2]);
        parts.push(P(t[3], f, function (x, y) { return ell(b[0], b[1], 0.8, 0.8)(x + 0.5, y + 0.5) ? 'w' : t[3]; }, null, t[2]));
      });
    } else {
      [[24, 15.4], [41, 2.6]].forEach(function (b) { parts.push(P(LILAC[3], ell(b[0], b[1], 0.8, 0.8), null, null, LILAC[2])); });
    }
    var sp = build(56, 20, parts, st);
    sp.seat = [18, 9];
    return sp;
  };
  A.broom = { idle: broom('idle', 0), ride: [broom('ride', 0), broom('ride', 1)] };
  SET.push(['broom', [A.broom.idle].concat(A.broom.ride)]);

  /* A fat black cauldron on stubby legs over a little log fire, bubbling
     over with lime-green potion; its glow catches the rim. Three frames of
     bubbling. */
  var cauldron = function (f) {
    var parts = [];
    // the fire under it: two crossed logs, flames licking up
    parts.push(P('T', or(cap(10, 34.4, 29, 31.4, 1.5), cap(11, 31.4, 30, 34.4, 1.5)), function (x, y) { return y + 0.5 < 32.4 ? 'U' : 'T'; }, 'S'));
    var fl = [[15, 33, 7 + (f === 1 ? 1.6 : 0), f === 2 ? 0.8 : -0.8], [20, 33, 9 - (f === 1 ? 1.6 : 0), f ? -0.6 : 0.6], [25, 33, 7 + (f === 2 ? 1.6 : 0), f === 1 ? 0.8 : -0.4]];
    fl.forEach(function (q) { parts.push(flame(q[0], q[1], q[2], q[3])); });
    // three stubby legs
    parts.push(P('h', or(rrect(7.6, 26, 11.4, 33.2, 1.2), rrect(28.6, 26, 32.4, 33.2, 1.2), rrect(18.4, 28, 21.6, 32, 1)), orb(8, 26, 8, 8, INK), 'f'));
    // the ear-handles
    parts.push(P('i', or(but(ell(3.6, 15, 2.8, 2.8), ell(3.6, 15, 1.2, 1.2)), but(ell(36.4, 15, 2.8, 2.8), ell(36.4, 15, 1.2, 1.2))), orb(2, 13, 5, 5, INK), 'g'));
    // the pot: glossy black, green glow on its shoulders, firelight on its belly
    parts.push(P('h', function (x, y) { return ell(20, 19.6, 17, 10.4)(x, y) && y > 9.8; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > 27.6 && Math.abs(X - 20) < 9) return Y > 28.6 ? 'l' : 'k';
      if (Y < 13.6 && Math.abs(X - 20) > 6 && Math.abs(X - 20) < 15 && (X + Y) % 3 < 1) return SLIME[1];
      if (Math.abs(Y - 14.6 - Math.pow((X - 16) / 12, 2) * 2) < 0.6 && X > 7 && X < 24) return 'j';
      return orb(14, 12, 24, 16, INK)(x, y);
    }, 'f'));
    // the rim, and the potion's surface inside it
    parts.push(P('h', but(ell(20, 10.2, 15.4, 3.2), ell(20, 10, 12.6, 2)), function (x, y) { return y + 0.5 < 10 ? (x + 0.5 < 20 ? 'j' : 'i') : 'g'; }, 'f'));
    parts.push(P(SLIME[2], ell(20, 10, 12.6, 2), function (x, y) {
      var X = x + 0.5; return Math.abs(((X + f * 2.4) % 5) - 2.5) < 0.7 ? SLIME[3] : SLIME[2];
    }, SLIME[1]));
    // a drip over the rim
    parts.push(P(SLIME[2], or(rrect(30.4, 10.4, 32.4, 14.4 + f * 0.8, 1), ell(31.4, 14.6 + f * 0.8, 1.4, 1.4)), orb(30.6, 11, 3, 6, SLIME), SLIME[0]));
    // bubbles: one swelling, one rising, one popping
    var bubs = [
      [[16, 7.4, 2.6], [24.6, 5, 1.6], [12, 3, 1.2], [21, 1.4, 0.9]],
      [[16, 6.4, 3.2], [25.4, 2.6, 1.6], [10.6, 7.6, 1.6], [28, 7.6, 1.1]],
      [[15.4, 4, 2.4], [26.4, 6.6, 2.2], [11, 6.2, 1.4], [21.6, 0.8, 1.1]]
    ][f];
    bubs.forEach(function (b, i) {
      parts.push(P(SLIME[3], ell(b[0], b[1], b[2], b[2] * 0.92), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (ell(b[0] - b[2] * 0.35, b[1] - b[2] * 0.35, b[2] * 0.4, b[2] * 0.4)(X, Y)) return 'w';
        return orb(b[0], b[1], b[2], b[2], SLIME)(x, y);
      }, null, SLIME[1]));
    });
    return build(40, 36, parts);
  };
  A.cauldron = [0, 1, 2].map(cauldron);
  SET.push(['cauldron', A.cauldron]);

  /* A big floating potion bubble, purple shading to green round its skin,
     a window of light on it; Bonnie can stand on it as it rises. [0]
     floating, [1] wobbling, [2] popping. Made of light: no outline. */
  var IRID = [LILAC, CORAL, SLIME, SKY];
  var skin = function (a) {
    // its colour round the rim: purple at the top, through pink and green, to blue
    var u = ((a / (Math.PI * 2)) % 1 + 1) % 1, k = Math.floor(u * 4 + 0.5) % 4;
    return IRID[[0, 3, 2, 1][k]];
  };
  var bubble = function (f) {
    var cx = 15, cy = 15, rx = f === 1 ? 14.4 : 13.6, ry = f === 1 ? 12.6 : 13.6;
    return paint(30, 30, function (x, y) {
      var X = x + 0.5, Y = y + 0.5 + (f === 1 ? 1 : 0), dx = (X - cx) / rx, dy = (Y - cy) / ry, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
      var t = skin(a + Math.PI / 2);
      if (f === 2) {
        // popping: the skin torn into curls flying out, droplets beyond
        var rr = Math.sqrt((X - cx) * (X - cx) + (Y - cy) * (Y - cy)), seg = ((a + 7) / (Math.PI * 2) * 8) % 1;
        if (rr > 12.4 && rr < 14 && seg > 0.25 && seg < 0.7) return rr > 13.3 ? t.charAt(2) : t.charAt(3);
        var drops = [[2, 6], [27, 4], [28, 22], [4, 25], [15, 0.6], [15, 29], [0.6, 15], [29.4, 13]];
        for (var i = 0; i < drops.length; i++) if (Math.abs(X - drops[i][0]) < 1 && Math.abs(Y - drops[i][1]) < 1) return i % 2 ? t.charAt(3) : 'w';
        if (Math.abs(rr - 8) < 0.6 && seg > 0.4 && seg < 0.6) return 'w';
        return '.';
      }
      if (r > 1) return '.';
      // the skin: a deep line at its very edge, then bright, fading inward
      var e = (1 - r) * Math.min(rx, ry);
      if (e < 1) return t.charAt(1);
      if (e < 2) return t.charAt(3);
      if (e < 2.8 && (x + y) % 2 === 0) return t.charAt(2);
      // the window of light at its top left, a glint at its bottom right
      if (r > 0.58 && r < 0.8 && a > -2.7 && a < -1.75) return 'w';
      if (r > 0.6 && r < 0.75 && a > 0.5 && a < 0.9) return SLIME[3];
      if (Math.abs(X - 9) < 1 && Math.abs(Y - 11) < 1) return 'w';
      return '.';
    });
  };
  A.bubble6 = [0, 1, 2].map(bubble);
  SET.push(['bubble6', A.bubble6]);

  /* ---- the Haunted Mansion's portraits ------------------------------------
     Three in oval gilt frames whose eyes follow Bonnie: a grand gentleman
     with a curly moustache, a lady with a towering hairdo (a bluebird
     nesting on top), and a very proper cat with a ruff and a monocle. The
     eyes are left as white ovals, no pupils: the game draws pupils that
     look at him. `.eyes` holds the centres of the two whites (full px). */
  var PIC = ell(15, 19.2, 10.4, 14.4);
  var inPic = function (f) { return both(f, PIC); };
  var giltOval = function () {
    return P('C', or(ell(15, 19, 14.6, 18.6), ell(15, 1.8, 4, 1.8), ell(15, 36.4, 3, 1.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, dx = (X - 15) / 14.6, dy = (Y - 19) / 18.6, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
      // a shadowed lip next to the picture, a row of beads round the middle of the band
      if (ell(15, 19.2, 11.6, 15.4)(X, Y)) return 'A';
      if (r > 0.84 && r < 0.93) return (Math.floor((a + 7) * 7) % 2) ? orb(9, 6, 22, 28, 'BCDFF')(x, y) : 'B';
      // the little crest on top: a scallop shell
      if (Y < 3.6 && Math.abs(X - 15) < 4) return Math.abs(((X - 15) * 1.2 + 20) % 2 - 1) < 0.4 ? 'B' : 'D';
      return orb(8, 5, 24, 30, GOLD)(x, y);
    }, 'A');
  };
  // the painted ground, dark at its edges
  var ground = function (t) { return P(t[2], PIC, function (x, y) { var X = x + 0.5, Y = y + 0.5, d = Math.sqrt(Math.pow((X - 15) / 10.4, 2) + Math.pow((Y - 19.2) / 14.4, 2)); return d > 0.86 ? t[0] : d > 0.6 ? t[1] : t[2]; }); };
  /* An eye's white, 4 px across: a dark lid line along its top, no line
     elsewhere, so the 1-game-pixel pupil the game draws has room to look
     about inside it */
  var white = function (cx, cy) {
    var f = ell(cx, cy, 2, 2.3);
    return P('w', f, function (x, y) { return f(x + 0.5, y - 0.5) ? (y + 0.5 > cy + 1 ? 'W' : 'w') : 'G'; });
  };
  var portrait = function (who) {
    var parts = [giltOval()], st = [], eyes;
    if (who === 0) {
      // the gentleman: bald and beaming, grey side-whiskers, a magnificent moustache
      parts.push(ground(PLUM));
      parts.push(P('|', inPic(ell(15, 37, 10.6, 8)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Math.abs(X - 15) < 1.8 && Y < 32) return 'w';
        if (Math.abs(X - 15) < 3.6 && Y < 33 && Math.abs(X - 15) > 1.8 - (Y - 29) * 0.5) return '?';
        if (Math.abs(X - 15) < 0.5 && Y > 32) return '_';
        return orb(11, 30, 14, 10, COAT)(x, y);
      }, ';'));
      parts.push(P('x', inPic(or(tri(12.6, 28.4, 17.4, 28.4, 15, 31.4), ell(15, 28.8, 1.4, 1.1))), orb(14, 28, 3, 3, RED), 'u'));
      parts.push(P(FACE[2], or(rrect(13, 24, 17, 28.4, 1), ell(8.4, 20.4, 1.4, 1.8), ell(21.6, 20.4, 1.4, 1.8)), orb(13, 22, 6, 6, FACE), FACE[0]));
      parts.push(P(FACE[2], ell(15, 19.4, 6.4, 7.2), orb(12.4, 15, 8, 9, FACE), FACE[0]));
      parts.push(P('Q', or(ell(8.8, 21.4, 1.7, 2.8), ell(21.2, 21.4, 1.7, 2.8)), orb(8, 19, 3, 4, 'OPQRw'), 'O'));
      parts.push(P('Q', or(cap(10.8, 15.4, 13.6, 14.8, 0.8), cap(16.4, 14.8, 19.2, 15.4, 0.8)), orb(12, 14, 6, 3, 'OPQRw'), 'O'));
      parts.push(white(12, 18.5), white(18, 18.5));
      parts.push(P('y', ell(15, 21.6, 1.6, 1.3), orb(14.4, 21, 2, 2, 'vxyzw'), 'v'));
      parts.push(P('T', or(taper([[15, 23], [12.6, 23.8], [10.2, 23.2], [9.2, 21.8], [10, 21]], 1.1, 0.5), taper([[15, 23], [17.4, 23.8], [19.8, 23.2], [20.8, 21.8], [20, 21]], 1.1, 0.5)), function (x, y) { return y + 0.5 < 23.4 ? 'U' : 'T'; }, 'S'));
      st.push([10, 20, ['3']], [19, 20, ['3']], [12, 12, ['ww', 'w.']], [13, 25, ['#..#', '.##.']]);
      eyes = [[12, 18.5], [18, 18.5]];
    } else if (who === 1) {
      // the lady: a towering powdered hairdo with a pink bow and a bluebird on top
      parts.push(ground(PAPER));
      parts.push(P('r', inPic(ell(15, 37.4, 10.8, 8)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y < 31.4 && Math.abs(((X - 15) * 1.1 + 20) % 2.2 - 1.1) < 0.6) return 'w';
        return orb(11, 30, 14, 10, PINK)(x, y);
      }, 'p'));
      parts.push(P(FACE[2], rrect(13.2, 25, 16.8, 30.4, 1), orb(13, 25, 5, 6, FACE), FACE[0]));
      for (var k = 0; k < 7; k++) parts.push(P('w', ell(11.4 + k * 1.2, 29.2 + Math.sin(k / 6 * Math.PI) * 1.3, 0.75, 0.75), null, '2', '1'));
      parts.push(P(LILAC[3], inPic(or(ell(15, 11.6, 6, 8), ell(15, 18.4, 6.6, 3.6))), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // swirls piled up in it
        if (Math.abs(((Y + Math.sin(X * 0.9) * 1.4) % 3.2) - 1.6) < 0.4) return LILAC[2];
        return orb(12, 8, 10, 14, LILAC[1] + 'deeR')(x, y);
      }, LILAC[1]));
      parts.push(P(FACE[2], ell(15, 22.2, 5.8, 5.8), orb(13, 19, 7, 7, FACE), FACE[0]));
      parts.push(white(12, 21.5), white(18, 21.5));
      parts.push(P('x', or(cap(13.4, 25.2, 15, 26, 0.6), cap(15, 26, 16.6, 25.2, 0.6)), null, 'u', 'u'));
      parts.push(P('q', or(ell(18.6, 13.6, 2, 1.4), ell(22, 13.6, 2, 1.4), ell(20.3, 13.6, 0.9, 0.9)), orb(18, 13, 5, 3, PINK), 'p'));
      parts.push(P(SKY[2], inPic(or(ell(14.4, 5.6, 2.2, 1.6), tri(16, 5, 18.4, 4, 16.4, 6.4))), orb(13.4, 4.8, 3, 2, SKY), SKY[0]));
      st.push([9, 19, ['#']], [20, 19, ['#']], [10, 24, ['3']], [19, 24, ['3']], [18, 25, ['G']], [13, 5, ['G']], [12, 5, ['m']]);
      eyes = [[12, 21.5], [18, 21.5]];
    } else {
      // the cat: a ginger tabby in a lace ruff, a monocle on a chain
      parts.push(ground(MAROON));
      parts.push(P('{', inPic(ell(15, 37.4, 10.8, 8)), orb(11, 30, 14, 10, CACT), '['));
      parts.push(P('w', ell(15, 30.2, 8.8, 2.6), function (x, y) { return Math.abs(((x + 0.5 - 15) * 1.3 + 20) % 2.4 - 1.2) < 0.4 ? 'W' : 'w'; }, '2'));
      parts.push(P('m', or(tri(8.4, 18.4, 9.8, 10.6, 13.6, 15.4), tri(21.6, 18.4, 20.2, 10.6, 16.4, 15.4)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        return (Math.abs(X - 10.4) < 1 || Math.abs(X - 19.6) < 1) && Y > 13 && Y < 16.4 ? 's' : orb(10, 12, 8, 8, ORANGE)(x, y);
      }, 'k'));
      parts.push(P('m', ell(15, 21.4, 7.6, 6.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // tabby stripes on the forehead and cheeks
        if (Y < 18 && Math.abs(X - 15) < 3.4 && Math.abs(((X - 15) + 20) % 2.2 - 1.1) < 0.4) return 'l';
        if (Math.abs(X - 15) > 5.4 && Math.abs(((Y + 20) % 2.4) - 1.2) < 0.4) return 'l';
        return orb(12, 17, 10, 9, ORANGE)(x, y);
      }, 'k'));
      parts.push(P('o', ell(15, 24.6, 3.6, 2.2), orb(14, 23.6, 4, 3, 'nooww'), 'n'));
      parts.push(white(11, 20.5), white(19, 20.5));
      // the monocle: a gold ring round his right eye, its chain looping down to the ruff
      parts.push(P('C', but(ell(19, 20.5, 3.3, 3.4), ell(19, 20.5, 2.3, 2.4)), orb(17, 19, 4, 4, GOLD), 'A'));
      parts.push(P('B', pixset((function () { var q = []; for (var t = 0; t <= 1; t += 0.03) q.push([21.4 + t * 1.4, 22 + t * 7 - Math.sin(t * Math.PI) * 0.4]); return q; })()), null, null, 'B'));
      st.push([14, 23, ['sss', '.s.']], [14, 25, ['#.#']], [15, 25, ['#']], [7, 23, ['3']], [21, 23, ['3']]);
      eyes = [[11, 20.5], [19, 20.5]];
      // whiskers, out past his cheeks
      parts.push(P('R', pixset([[6, 23.6], [7, 23.8], [8, 24], [6, 25.6], [7, 25.4], [8, 25.2], [22, 24], [23, 23.8], [24, 23.6], [22, 25.2], [23, 25.4], [24, 25.6]]), null, null, 'R'));
    }
    var sp = build(30, 38, parts, st);
    sp.eyes = eyes;
    return sp;
  };
  A.portrait = [0, 1, 2].map(portrait);
  SET.push(['portrait', A.portrait]);

  /* ---- the stretching portraits -------------------------------------------
     Two tall paintings, 30 x 84, whose joke shows from the top down as the
     room stretches: a smiling gentleman in a top hat... standing on a
     wobbly stack of hat boxes... on a sleepy tortoise; and a lady with a
     parasol... on a tightrope... over a grinning, sleepy crocodile. */
  var giltTall = function () {
    return P('C', rrect(0, 0, 30, 84, 1.4), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, e = Math.min(X, Y, 30 - X, 84 - Y);
      if (e > 2.4) return 'A';
      if (e > 1 && e < 1.9) return (Math.floor((X + Y) / 1.6) % 2) ? 'D' : 'B';
      return X + Y < 30 || e === X || e === Y ? 'D' : orb(6, 6, 40, 120, GOLD)(x, y);
    }, 'A');
  };
  var INNER = rrect(3, 3, 27, 81, 0);
  var inTall = function (f) { return both(f, INNER); };
  var hatbox = function (y0, y1, w, dx, t, pat) {
    var x0 = 15 - w / 2 + dx, x1 = 15 + w / 2 + dx;
    return P(t[2], or(rrect(x0, y0 + 0.8, x1, y1, 1), rrect(x0 - 0.6, y0, x1 + 0.6, y0 + 1.6, 0.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, b = orb(x0 + 2, y0, w * 1.2, 10, t)(x, y);
      if (Y < y0 + 1.6) return step(t, b, 1);
      if (pat === 'dots' && Math.abs(((X - x0) % 3) - 1.5) < 0.7 && Math.abs(((Y - y0) % 2.6) - 1.6) < 0.6) return 'w';
      if (pat === 'stripes' && Math.abs(((X - x0) % 3) - 1.5) < 0.6) return 'w';
      if (pat === 'ribbon' && Math.abs(X - (x0 + x1) / 2) < 0.9) return 'x';
      if (pat === 'stars' && Math.abs(((X - x0 + 1.4) % 4) - 2) + Math.abs(Y - (y0 + y1) / 2 - 0.3) < 1) return 'D';
      return b;
    }, t[0]);
  };
  var stretchy = function (who) {
    var parts = [giltTall()], st = [];
    if (who === 0) {
      // the wallpaper: teal damask
      parts.push(P(PAPER[2], INNER, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, u = ((X + 2) % 8) - 4, v = ((Y + 1) % 10) - 5;
        return Math.abs(u) / 2.4 + Math.abs(v) / 3.6 < 1 && Math.abs(u) / 2.4 + Math.abs(v) / 3.6 > 0.62 ? PAPER[3] : PAPER[2];
      }));
      // the floor, and the tortoise asleep on it
      parts.push(P('T', inTall(rrect(3, 78.4, 27, 81, 0)), function (x, y) { return (x + 0.5) % 6 < 0.7 ? 'S' : y < 79 ? 'U' : 'T'; }, 'S'));
      parts.push(P(SHELL[2], or(rrect(8, 74, 11, 79.6, 1), rrect(19.4, 74, 22.4, 79.6, 1), ell(4.8, 73.6, 3, 2.4), cap(6.6, 74.4, 8.6, 75, 1.2), tri(25.2, 75.4, 25.2, 77, 27.4, 76.6)), orb(5, 71, 8, 8, LEAF), '('));
      parts.push(P(SHELL[2], function (x, y) { return ell(15.6, 75.4, 10, 8.4)(x, y) && y < 76.4; }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // the scutes: a pattern of plates across the dome
        var u = (X - 15.6) / 3.4, v = (Y - 70) / 2.8, cu = Math.round(u + (Math.round(v) % 2 ? 0.5 : 0)) - (Math.round(v) % 2 ? 0.5 : 0);
        if (Math.abs(u - cu) > 0.42 || Math.abs(v - Math.round(v)) > 0.4) return SHELL[1];
        if (Y > 75.2) return 'U';
        return orb(12, 68, 14, 10, SHELL)(x, y);
      }, SHELL[0]));
      // the hat boxes, piled up and wobbling
      [[61.6, 67.6, 16, 0, ORANGE, 'dots'], [56.8, 61.6, 12.6, 1.2, RED, 'stripes'], [51.8, 56.8, 15, -0.8, LILAC, 'stars'], [47, 51.8, 11, 1.6, GOLD, 'ribbon'], [42.4, 47, 14, -1, TEAL, 'stripes'], [37.8, 42.4, 12, 0.6, PINK, 'dots']].forEach(function (b) {
        parts.push(hatbox(b[0], b[1], b[2], b[3], b[4], b[5]));
      });
      // the gentleman: striped trousers, a green tailcoat, arms out to keep his balance
      parts.push(P('O', or(rrect(12.6, 30, 14.8, 37.4, 0.6), rrect(15.6, 30, 17.8, 37.4, 0.6)), function (x) { return (x + 0.5) % 2 < 0.8 ? 'Q' : 'O'; }, 'N'));
      parts.push(P('g', or(ell(13, 37.6, 2.2, 0.9), ell(17.4, 37.6, 2.2, 0.9)), null, 'f'));
      parts.push(P('{', or(limb([[11.6, 21.6], [7.6, 19.6], [4.8, 17.6]], 1.2), limb([[18.4, 21.6], [22.4, 20.4], [25.2, 18]], 1.2)), orb(10, 18, 16, 6, CACT), '['));
      parts.push(P('w', or(ell(4.4, 17.4, 1.3, 1.3), ell(25.6, 17.6, 1.3, 1.3)), orb(4, 17, 2, 2, SNOW), '2'));
      parts.push(P('{', or(rrect(10.6, 19.6, 19.4, 30.6, 2.4), tri(11, 29, 13.4, 29, 10.4, 34), tri(19, 29, 16.6, 29, 19.6, 34)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Math.abs(X - 15) < 1.6 - (Y - 20) * 0.08 && Y < 28) return Y < 21.4 ? 'x' : 'w';
        if (Math.abs(X - 15) < 0.5 && Y >= 28) return '[';
        return orb(12, 21, 10, 12, CACT)(x, y);
      }, '['));
      parts.push(P(FACE[2], ell(15, 15.8, 3.8, 3.8), orb(13.6, 14.4, 5, 5, FACE), FACE[0]));
      parts.push(P('T', or(limb([[15, 17.6], [13.2, 17.8], [12, 16.8]], 0.6), limb([[15, 17.6], [16.8, 17.8], [18, 16.8]], 0.6)), null, 'S', 'S'));
      // the top hat
      parts.push(P('h', or(rrect(11.4, 4.4, 18.6, 12, 1), ell(15, 12, 6.2, 1.2)), function (x, y) {
        var Y = y + 0.5; return Y > 9.6 && Y < 11 ? 'c' : orb(12, 4, 10, 12, INK)(x, y);
      }, 'f'));
      st.push([13, 14, ['#.#']], [16, 14, ['#.#']], [14, 18, ['###']], [12, 16, ['3']], [17, 16, ['3']], [12, 5, ['j', 'j']], [10, 70, ['#.']], [3, 73, ['..']], [4, 72, ['#.']], [3, 74, ['#']]);
    } else {
      // the dusk: a deep plum sky, a few stars, mist low down over the water
      parts.push(P(PLUM[2], INNER, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (hash(x, y, 5) > 0.975 && Y < 56) return 'e';
        return Y > 60 ? PLUM[3] : Y > 48 ? PLUM[2] : PLUM[1];
      }));
      // the water, rippling, and the crocodile lying in it, mouth wide, half asleep
      parts.push(P(TEAL[1], inTall(rrect(3, 71, 27, 81, 0)), function (x, y) { var X = x + 0.5, Y = y + 0.5; return Math.abs(((X + Math.floor(Y) * 2.3) % 6) - 3) < 0.6 && Y > 72 ? TEAL[3] : Y < 72 ? TEAL[2] : TEAL[1]; }, TEAL[0]));
      var croc = function (x, y) { return orb(14, 62, 16, 13, CROC)(x, y) === CROC[0] ? CROC[1] : orb(14, 62, 16, 13, CROC)(x, y); };
      // its body, off to the right, a ridge of bumps along its back
      parts.push(P(CROC[2], inTall(or(rrect(17, 66.4, 27, 74.4, 3), ell(22, 66.6, 1.4, 1.2), ell(25.4, 66.8, 1.4, 1.2))), croc, CROC[0]));
      // the lower jaw, along the water, and the mouth open wide: pink inside, a tongue
      parts.push(P('q', inTall(tri(17.6, 69, 3.6, 70.4, 5, 59.6)), function (x, y) { return y + 0.5 > 68 ? (x + 0.5 < 10 ? 'x' : 'r') : 'q'; }, 'p'));
      parts.push(P(CROC[2], inTall(rrect(3, 69.6, 19, 73.4, 1.8)), croc, CROC[0]));
      // the upper jaw, lifted, and the round head behind it with two sleepy eyes on top
      parts.push(P(CROC[2], inTall(turned(rrect(3, 64.6, 19, 69.4, 2.2), 18, 67.8, 0.6)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Math.abs(((X * 0.5 + Y * 0.8) % 2.4) - 1.2) < 0.3 && X > 9 && X < 16) return CROC[3];
        return croc(x, y);
      }, CROC[0]));
      parts.push(P(CROC[2], inTall(or(ell(19.6, 67.6, 4.6, 4.4), ell(17.4, 63.6, 2.6, 2.4), ell(21.6, 63.4, 2.6, 2.4))), croc, CROC[0]));
      parts.push(P('w', or(ell(17.4, 63.6, 1.9, 1.8), ell(21.6, 63.4, 1.9, 1.8)), function (x, y) { return y + 0.5 < 63.6 ? CROC[4] : 'w'; }, CROC[0]));
      // the tightrope, and the lady on it: frilly skirt, parasol up, one toe pointed
      parts.push(P('V', inTall(function (x, y) { var sag = 1.6 * Math.max(0, 1 - Math.abs(x - 14) / 11); return Math.abs(y - 37.6 - sag) < 0.8; }), function (x) { return (x % 2) ? 'V' : 'U'; }, 'T', 'T'));
      parts.push(P('w', or(limb([[13.6, 26], [13.8, 32], [14, 38]], 0.7), limb([[16, 26], [17.6, 30.6], [20.2, 32.4]], 0.7)), function (x, y) { return 'W'; }, '1', '2'));
      parts.push(P('x', or(ell(14, 38.6, 1.2, 0.7), ell(20.6, 32.6, 1.1, 0.7)), null, 'u'));
      parts.push(P('r', or(limb([[13, 18.4], [9.4, 18.8], [6.6, 17.2]], 0.75), limb([[16.6, 18.4], [18.4, 16.6], [18.6, 14]], 0.75)), null, 'p', 'p'));
      parts.push(P('s', or(ell(14.8, 25.6, 7.4, 2.8), ell(14.8, 24, 6, 2.4)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5; return Y > 26.6 ? (Math.floor(X) % 2 ? 'w' : 't') : Y > 24.6 ? 's' : 'r';
      }, 'q'));
      parts.push(P('r', rrect(12.6, 16.8, 17, 23.4, 1.6), orb(13, 17, 6, 8, PINK), 'p'));
      parts.push(P(FACE[2], ell(14.8, 13.4, 3.2, 3.4), orb(13.6, 12, 4, 4, FACE), FACE[0]));
      parts.push(P('T', or(ell(14.6, 10.6, 3.4, 1.8), ell(12.2, 9.8, 1.8, 1.6)), orb(12, 9, 4, 3, WOOD), 'S'));
      // the parasol: a frilly pink canopy, its handle down to her hand
      parts.push(P('S', cap(18.8, 14.2, 18.4, 7, 0.5), null, null, 'S'));
      parts.push(P('r', function (x, y) {
        if (y > 8.6) return y < 9.8 && Math.abs(((x - 9) % 2.6) - 1.3) < 1 && Math.abs(x - 18.4) < 8;
        return ell(18.4, 9, 8, 5.4)(x, y);
      }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y > 8.2) return 'w';
        return Math.abs(((Math.atan2(Y - 9, X - 18.4) + 7) * 2.2) % 2 - 1) < 0.25 ? 'q' : orb(15, 4, 12, 8, PINK)(x, y);
      }, 'p'));
      parts.push(P('C', ell(18.4, 3.4, 0.9, 0.9), null, 'A'));
      st.push([13, 13, ['#.#']], [14, 15, ['##']], [12, 14, ['3']], [16, 14, ['3']], [16, 63, ['GGG']], [20, 63, ['GGG']], [17, 69, ['#']], [18, 70, ['3']]);
    }
    return build(30, 84, parts, st);
  };
  A.stretchy = [0, 1].map(stretchy);
  SET.push(['stretchy', A.stretchy]);

  /* ---- the house at the end of every level --------------------------------
     A crooked, spooky-cute cottage: a leaning slate roof with its tip
     drooping over like a witch's hat, a round attic window glowing, a
     crooked brick chimney puffing, warm-lit windows (a cat sitting in one),
     cobwebs, a lantern, a jack-o'-lantern on the step. `shut`: its round-
     topped door closed, a knocker on it; `open`: warm light inside and a
     friendly ghost waving hello. The bottom row is the ground; `.door` is
     the door's left and right edges (full px). */
  var DOOR = [41, 55];
  var pumpkin = function (cx, cy, r, glow, plain) {
    // a jack-o'-lantern: ribbed orange, a curly stem, a happy carved face lit from inside
    var parts = [];
    parts.push(P('m', or(ell(cx, cy, r, r * 0.86), ell(cx - r * 0.5, cy + 0.2, r * 0.6, r * 0.82), ell(cx + r * 0.5, cy + 0.2, r * 0.6, r * 0.82)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // the face: triangle eyes and a wide smile with one tooth, glowing
      var ex = r * 0.38, ey = cy - r * 0.18;
      if (!plain && (tri(cx - ex - 1.3, ey + 1, cx - ex + 1.3, ey + 1, cx - ex, ey - 1.2)(X, Y) || tri(cx + ex - 1.3, ey + 1, cx + ex + 1.3, ey + 1, cx + ex, ey - 1.2)(X, Y))) return glow ? '7' : 'k';
      if (!plain && Y > cy + r * 0.12 && ell(cx, cy + r * 0.12, r * 0.62, r * 0.5)(X, Y) && !(Math.abs(X - cx - 0.6) < 0.7 && Y < cy + r * 0.12 + 1.2)) return glow ? (Y > cy + r * 0.4 ? '6' : '7') : 'k';
      if (Math.abs(X - cx - r * 0.5) < 0.45 || Math.abs(X - cx + r * 0.5) < 0.45) return 'l';
      return orb(cx - r * 0.4, cy - r * 0.5, r * 1.3, r * 1.2, ORANGE)(x, y);
    }, 'k'));
    parts.push(P('<', or(rrect(cx - 0.8, cy - r - 1.4, cx + 0.8, cy - r * 0.7, 0.4), cap(cx + 0.4, cy - r - 0.6, cx + 2.4, cy - r - 1.6, 0.5)), null, '(', '('));
    return parts;
  };
  var spookyhouse = function (open) {
    var parts = [], st = [];
    // smoke curling up out of the chimney
    [[71, 4.4, 2.2], [75.4, 2.4, 1.8], [79, 1.4, 1.3]].forEach(function (b) { parts.push(P(SLATE[4], ell(b[0], b[1], b[2], b[2] * 0.9), orb(b[0] - 1, b[1] - 1, b[2] * 1.4, b[2] * 1.4, SLATE), null, SLATE[3])); });
    // the crooked chimney: brick, leaning one way and then the other, a cap on top
    var chim = or(rrect(63, 20, 71.4, 40, 0.6), turned(rrect(64.4, 7.6, 72, 22, 0.6), 68, 21, 0.14));
    parts.push(P(BRICK[2], chim, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, row = Math.floor(Y / 2.4);
      if (Y % 2.4 < 0.6) return BRICK[0];
      if (((X + (row % 2) * 2.2) % 4.4) < 0.6) return BRICK[0];
      return orb(64, 10, 12, 34, BRICK)(x, y);
    }, BRICK[0]));
    parts.push(P(IRON[2], turned(rrect(63, 5.6, 73.4, 8.6, 0.8), 68, 21, 0.14), orb(64, 4, 10, 6, IRON), IRON[0]));
    // a little bat flapping past
    parts.push(P('b', or(ell(86, 16, 1.8, 1.6), ell(82.6, 14.6, 2.6, 1.2), ell(89.4, 14.6, 2.6, 1.2), tri(85, 14.8, 85.4, 13, 86.2, 14.6), tri(86.4, 14.6, 87.2, 13, 87.4, 14.8)), orb(85, 14, 4, 3, PURP), 'a'));
    // the roof: leaning slates, its tip drooping over like a hat
    var roofL = function (y) { var t = (y - 7) / 43; return 44.6 - 39.6 * Math.pow(t, 0.92); };
    var roofR = function (y) { var t = (y - 7) / 43; return 46.4 + 44.6 * Math.pow(t, 1.08); };
    var roof = or(function (x, y) { return y >= 7 && y <= 50 && x >= roofL(y) && x <= roofR(y); }, limb([[45.4, 8.6], [48.4, 4.4], [53, 3], [55.6, 5.4]], 1.6), ell(55.8, 6, 1.6, 1.6));
    parts.push(P(SLATE[2], roof, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 9) return orb(48, 2, 10, 8, SLATE)(x, y);
      if (Y > 48.2) return SLATE[0];
      // fish-scale slates, row by row, each lit at its top left
      var row = Math.floor((Y - 7) / 3.6), u = ((X + (row % 2) * 2.6) % 5.2) / 5.2, v = ((Y - 7) % 3.6) / 3.6;
      var edge = v > 0.72 || Math.abs(u - 0.5) * 2 > 0.9 - v * 0.5 && v > 0.4;
      if (edge) return SLATE[1];
      var lit = orb(30, 8, 50, 50, SLATE)(x, y);
      return u < 0.4 && v < 0.4 ? step(SLATE, lit, 1) : lit;
    }, SLATE[0]));
    // the round attic window: a wooden ring, warm light, a cross of glazing bars
    parts.push(P('T', ell(45, 30, 6.6, 6.6), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = Math.sqrt((X - 45) * (X - 45) + (Y - 30) * (Y - 30));
      if (d > 5.2) return d > 6 ? 'S' : 'U';
      if (Math.abs(X - 45) < 0.6 || Math.abs(Y - 30) < 0.6) return 'S';
      return d < 2.6 ? '8' : X + Y < 74 ? '7' : '6';
    }, 'S'));
    // the walls: teal clapboard, the whole house leaning a little to the right
    var wallL = function (y) { return 14.4 + (92 - y) * 0.07; }, wallR = function (y) { return 81.6 + (92 - y) * 0.1; };
    parts.push(P(PAPER[2], function (x, y) { return y > 44 && y < 93 && x > wallL(y) && x < wallR(y); }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, b = ((Y - 44 + (X > 48 ? 0.6 : 0)) % 3.6) / 3.6;
      if (b > 0.78) return PAPER[0];
      if (Y < 52 && Y > 50) return PAPER[0];
      var t = orb(26, 40, 70, 70, PAPER)(x, y);
      return b < 0.22 ? step(PAPER, t, 1) : t;
    }, PAPER[0]));
    // under the eaves, a deep shadow
    parts.push(P(PAPER[0], function (x, y) { return y > 47 && y < 51.4 && x > wallL(y) && x < wallR(y); }, null, null, PAPER[0]));
    // the windows: tilted, lit warm, glazing bars, shutters; a cat sat in the left one
    var win = function (x0, y0, a, cat) {
      var cx = x0 + 6, cy = y0 + 7, frame = turned(rrect(x0, y0, x0 + 12, y0 + 14, 0.8), cx, cy, a), glass = turned(rrect(x0 + 1.4, y0 + 1.4, x0 + 10.6, y0 + 12.6, 0.4), cx, cy, a);
      var catF = turned(or(ell(x0 + 4, y0 + 10.4, 2.6, 2.4), ell(x0 + 4, y0 + 7.4, 1.8, 1.7), tri(x0 + 2.4, y0 + 7, x0 + 2.6, y0 + 5, x0 + 3.6, y0 + 6.2), tri(x0 + 4.4, y0 + 6.2, x0 + 5.4, y0 + 5, x0 + 5.6, y0 + 7), cap(x0 + 6.4, y0 + 12.4, x0 + 7.8, y0 + 9.6, 0.5)), cx, cy, a);
      return P('T', frame, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (!glass(X, Y)) return orb(x0, y0, 14, 16, WOOD)(x, y);
        if (cat && catF(X, Y)) return 'g';
        var bar = turned(function (u, v) { return Math.abs(u - cx) < 0.55 || Math.abs(v - cy) < 0.55; }, cx, cy, a);
        if (bar(X, Y)) return 'S';
        return Y < cy ? (X < cx ? '8' : '7') : X < cx ? '7' : '6';
      }, 'S');
    };
    parts.push(win(20.6, 56, -0.06, true), win(62.4, 55, 0.05, false));
    // shutters: one hanging crooked off its hinge, a pair on the right window
    parts.push(P('b', turned(rrect(15.4, 56.4, 20, 70.6, 0.6), 17.6, 57, 0.18), function (x, y) { return (x + 0.5) % 2.2 < 0.6 ? 'a' : 'b'; }, 'a'));
    parts.push(P('b', or(turned(rrect(57.6, 55.4, 62, 69.4, 0.6), 60, 62, 0.05), turned(rrect(74.8, 55, 79.2, 69, 0.6), 77, 62, 0.05)), function (x, y) { return (x + 0.5) % 2.2 < 0.6 ? 'a' : 'b'; }, 'a'));
    // window boxes under them with tiny pumpkins
    parts.push(P('T', or(rrect(19.4, 70.2, 34, 72.4, 0.6), rrect(61.6, 69.4, 76, 71.6, 0.6)), orb(20, 69, 20, 4, WOOD), 'S'));
    // cobwebs: in the left eave corner, and in the right window's top corner
    var web = function (ox, oy, R, dirx) {
      var q = [];
      for (var k = 0; k <= 4; k++) { var a = k / 4 * Math.PI / 2; for (var t = 0; t <= 1; t += 0.03) q.push([ox + dirx * Math.cos(a) * R * t, oy + Math.sin(a) * R * t]); }
      [0.45, 0.8].forEach(function (r) { for (var a2 = 0; a2 <= Math.PI / 2; a2 += 0.03) { var sag = 1 - 0.12 * Math.sin(a2 * 4); q.push([ox + dirx * Math.cos(a2) * R * r * sag, oy + Math.sin(a2) * R * r * sag]); } });
      return q;
    };
    parts.push(P('R', pixset(web(17.4, 51.6, 8, 1).concat(web(73.2, 56.6, 4.4, -1))), null, null, 'W'));
    // the door's surround: a stone arch
    parts.push(P(IRON[2], rrect(DOOR[0] - 2.4, 65.6, DOOR[1] + 2.4, 93, 9), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, a = Math.atan2(Y - 75, X - 48);
      if (Y < 75 && Math.abs(((a + 7) * 3.2) % 1 - 0.5) > 0.4) return IRON[1];
      if (Y >= 75 && Math.abs(((Y - 75) % 4.2)) < 0.6) return IRON[1];
      return orb(42, 66, 16, 30, IRON)(x, y);
    }, IRON[0]));
    if (!open) {
      // the door, shut: purple planks, iron hinges, a gold knocker and a little round window
      parts.push(P('c', rrect(DOOR[0], 68, DOOR[1], 93, 7), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (ell(48, 73.4, 2.2, 2.2)(X, Y)) return ell(48, 73.4, 1.2, 1.2)(X, Y) ? '8' : '7';
        if (Math.abs(Y - 78.6) < 0.8 || Math.abs(Y - 88.4) < 0.8) return X < 47 ? 'N' : 'O';
        if (((X - DOOR[0]) % 3.5) < 0.6) return 'a';
        return orb(43, 70, 16, 30, PURP)(x, y);
      }, 'a'));
      parts.push(P('C', but(ell(51.6, 82.6, 1.7, 1.7), ell(51.6, 82.6, 0.7, 0.7)), orb(50.6, 81.6, 2, 2, GOLD), 'A'));
    } else {
      // the door, open: warm light spilling out, and a friendly ghost waving hello
      parts.push(P('7', rrect(DOOR[0], 68, DOOR[1], 93, 7), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, d = Math.abs(X - 48) / 7 + Math.max(0, 84 - Y) / 22;
        if (Y > 89) return 'n';
        return d < 0.45 ? '8' : d < 0.8 ? '7' : '6';
      }, '6'));
      // the door itself, swung open against the wall
      parts.push(P('c', or(rrect(DOOR[1] + 0.6, 69, DOOR[1] + 3.6, 93, 1.2)), function (x, y) { return x + 0.5 < DOOR[1] + 2 ? 'd' : 'b'; }, 'a'));
      parts.push(P(GHOST[3], or(ell(48, 79.6, 4.6, 4.6), rrect(43.4, 79.6, 52.6, 88, 1), cap(51.6, 81, 54.4, 76.4, 1.3)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // a wavy hem
        if (Y > 86.8 + Math.sin(X * 1.4) * 0.8) return GHOST[2];
        return orb(46, 77, 9, 11, GHOST)(x, y);
      }, GHOST[1], GHOST[1]));
    }
    // a lantern hung by the door
    parts.push(P('h', cap(DOOR[1] + 5, 70.4, DOOR[1] + 5, 72, 0.5), null, null, 'g'));
    parts.push(P('C', or(rrect(DOOR[1] + 3.4, 71.6, DOOR[1] + 6.6, 72.8, 0.4), rrect(DOOR[1] + 3.6, 77.4, DOOR[1] + 6.4, 78.6, 0.4)), null, 'A'));
    parts.push(P('7', rrect(DOOR[1] + 3.8, 72.6, DOOR[1] + 6.2, 77.6, 0.4), function (x, y) { return x + 0.5 < DOOR[1] + 5 ? '8' : '7'; }, 'B'));
    // the ground, and the porch step
    parts.push(P('<', function (x, y) { return y > 92.4 && x > 6 && x < 90 && ell(48, 96, 44, 4)(x, y); }, function (x, y) { return hash(x, y, 4) > 0.75 ? '>' : y < 94 ? '<' : ')'; }, '('));
    parts.push(P(IRON[3], rrect(36.4, 92, 59.6, 96, 1), function (x, y) { return y + 0.5 < 93.2 ? IRON[4] : orb(40, 90, 24, 10, IRON)(x, y); }, IRON[1]));
    // the jack-o'-lantern on the step
    parts = parts.concat(pumpkin(32.6, 89.4, 4.6, true));
    // tiny pumpkins in the window boxes
    parts = parts.concat(pumpkin(23.4, 68.4, 1.9, false), pumpkin(30.4, 68.6, 1.6, false), pumpkin(67.6, 67.6, 1.8, false));
    if (open) st.push([45, 78, ['#..#']], [44, 77, ['.#..#']], [45, 81, ['#..#', '.##.']], [43, 80, ['3']], [50, 80, ['3']]);
    st.push([40, 24, ['w']], [42, 26, ['w']]);
    var sp = build(96, 96, parts, st);
    sp.door = DOOR.slice();
    return sp;
  };
  A.spookyhouse = { shut: spookyhouse(false), open: spookyhouse(true) };
  SET.push(['spookyhouse', [A.spookyhouse.shut, A.spookyhouse.open]]);

  /* ---- Pumpkin Town's curly hill --------------------------------------------
     A slate-blue hill whose end is rolled up in a spiral; step on it and it
     unrolls into a bridge. `seg` is one 16 x 16 tile of its road (a pale
     stripe along the top, the walking surface; it tiles side by side).
     `tip` is the curled end, 48 x 48, from [0] curled tight in a full
     spiral to [5] all but unrolled. The road comes in at each tip's left
     edge with its top surface at row 32 (`.join` = [0, 32]), so a tip sits
     at the end of the road, 32 px above the road's top. */
  var hillTone = function (q, s, x, y) {
    // q runs -1 at the top surface to +1 underneath; s along the road
    if (q < -0.72) return q < -0.86 ? HILL[4] : 'w';
    if (q < -0.5) return HILL[3];
    if (q > 0.7) return HILL[1];
    // a swirl now and then, and soft speckles
    var u = ((s % 16) + 16) % 16 - 8, v = q * 8 - 1;
    var r = Math.sqrt(u * u + v * v), a = Math.atan2(v, u);
    if (r < 4.4 && Math.abs(((r - a * 0.7 + 20) % 2.2) - 1.1) < 0.4 && r > 1) return HILL[1];
    return hash(Math.floor(x), Math.floor(y), 9) > 0.92 ? HILL[3] : HILL[2];
  };
  var hillSeg = paint(16, 16, function (x, y) {
    if (y === 0 || y === 15) return HILL[0];
    return hillTone((y + 0.5 - 8) / 8, x + 0.5, x, y);
  });
  var curlTip = function (k) {
    // the spiral: a straight run of road, then a curl that winds in to its tip
    var cx = 22 + 14 * k, r0 = 19 - 13 * k, TH = (3 - 1.8 * k) * Math.PI, b = (r0 - 2) / TH, cy = 40 - r0;
    var smp = [];
    for (var sx = -6; sx < cx; sx += 0.5) smp.push([sx, 40, 16, sx - cx]);
    var arc = 0, prev = [cx, 40];
    for (var th = 0; th <= TH; th += 0.02) {
      var r = r0 - b * th, px = cx + r * Math.sin(th), py = cy + r * Math.cos(th);
      arc += Math.sqrt((px - prev[0]) * (px - prev[0]) + (py - prev[1]) * (py - prev[1])); prev = [px, py];
      var w = 4.2 + 11.8 * Math.pow(1 - th / TH, 1.45);
      smp.push([px, py, w, arc, th]);
    }
    var own = function (x, y) {
      // the last (innermost) sample covering the pixel wins
      for (var i = smp.length - 1; i >= 0; i--) { var p = smp[i], dx = x - p[0], dy = y - p[1]; if (dx * dx + dy * dy <= p[2] * p[2] / 4) return i; }
      return -1;
    };
    var grid = [], X, Y;
    for (Y = 0; Y < 48; Y++) for (X = 0; X < 48; X++) grid.push(own(X + 0.5, Y + 0.5));
    var at = function (x, y) { return x < 0 ? (y >= 32 && y < 48 ? 0 : -1) : x >= 48 || y < 0 || y >= 48 ? -1 : grid[y * 48 + x]; };
    var sp = paint(48, 48, function (x, y) {
      var i = at(x, y);
      if (i < 0) return '.';
      var nb = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)];
      // its edge, and the seam where an inner turn lies over an outer one
      if (nb.some(function (j) { return j < 0 || Math.abs(j - i) > 60; })) return HILL[0];
      var p = smp[i], q;
      if (p.length < 5) q = (y + 0.5 - 40) / 8;
      else {
        // across the ribbon: from the inside of the curl (its top surface) outwards
        var dx = x + 0.5 - cx, dy = y + 0.5 - cy, rr = Math.sqrt(dx * dx + dy * dy), rc = r0 - b * p[4];
        q = (rr - rc) / (p[2] / 2);
      }
      return hillTone(Math.max(-1, Math.min(1, q)), p[3], x, y);
    });
    sp.join = [0, 32];
    return sp;
  };
  A.curlhill = { seg: hillSeg, tip: [0, 1, 2, 3, 4, 5].map(function (i) { return curlTip(i / 5); }) };
  SET.push(['curlhill', [A.curlhill.seg].concat(A.curlhill.tip)]);

  /* ==========================================================================
     SCENERY — standing on the ground along the night's levels: Pumpkin
     Town, the graveyard, the mansion, the witch's wood, firework night.
     ========================================================================== */
  var CLAY = ramp(['#4a2418', '#7a3c22', '#a85a32', '#cc7a48', '#f0b080']);     // Pumpkin Town's plaster
  var BARK = ramp(['#2e1c28', '#523844', '#7a5a5e', '#a4807a', '#d0b4a4']);     // twisty purple-brown bark
  // thin wrought iron: no dark outline, a soft purple-grey so it shows on a dark sky
  var IRONWORK = function (f) { return P('h', f, null, null, 'i'); };
  var bat = function (cx, cy, up) {
    var w = up ? -1.4 : 1;
    return P('b', or(ell(cx, cy, 1.7, 1.6), ell(cx - 3, cy + w * 0.6, 2.6, 1.1), ell(cx + 3, cy + w * 0.6, 2.6, 1.1), tri(cx - 1.4, cy - 1, cx - 1, cy - 2.8, cx - 0.2, cy - 1.2), tri(cx + 0.2, cy - 1.2, cx + 1, cy - 2.8, cx + 1.4, cy - 1)), orb(cx - 1, cy - 1, 4, 3, PURP), 'a');
  };

  /* Pumpkin Town's gate: two crooked stone pillars, a wrought-iron arch
     between them curling into scrolls, its gates hanging open, a grinning
     jack-o'-lantern on top and bats about. */
  deco('towngate', build(72, 80, (function () {
    var parts = [];
    // the gates, swung open: iron bars with curled tops, two rails
    [[11, 25, -0.05], [47, 61, 0.05]].forEach(function (g) {
      var bars = [];
      for (var x = g[0] + 1.5; x < g[1]; x += 3) { bars.push(cap(x, 48 + Math.abs(x - (g[0] + g[1]) / 2) * 0.3, x, 79, 0.55)); bars.push(but(ell(x, 47 + Math.abs(x - (g[0] + g[1]) / 2) * 0.3, 1.3, 1.3), ell(x + 0.4, 47.4 + Math.abs(x - (g[0] + g[1]) / 2) * 0.3, 0.5, 0.5))); }
      bars.push(cap(g[0], 54, g[1], 54, 0.6), cap(g[0], 74, g[1], 74, 0.6));
      parts.push(IRONWORK(turned(or.apply(null, bars), (g[0] + g[1]) / 2, 79, g[2])));
    });
    // the arch: two iron bands, scrolls between them, crooked at the top
    var arch = function (x, off) { var u = (x - 36) / 26; return 38 - (1 - u * u) * (24 - off) + Math.sin(u * 3) * 1.6; };
    var archF = function (x, y) {
      if (x < 9 || x > 63) return false;
      return Math.abs(y - arch(x, 0)) < 0.9 || Math.abs(y - arch(x, 5) - 1) < 0.7;
    };
    var scrolls = [];
    [16, 26, 46, 56].forEach(function (sx) {
      var sy = (arch(sx, 0) + arch(sx, 5) + 1) / 2;
      scrolls.push(but(ell(sx, sy, 2.2, 2), ell(sx + 0.6, sy - 0.4, 1, 0.9)));
    });
    parts.push(IRONWORK(or(archF, or.apply(null, scrolls), cap(36, arch(36, 0), 36, arch(36, 5) + 1, 0.6))));
    // the pillars: stacked stone blocks, leaning a little, mossy caps
    [[0.6, 11.4, 34, -0.03], [60.6, 71.4, 36, 0.04]].forEach(function (pl) {
      var f = turned(or(rrect(pl[0], pl[2], pl[1], 80, 0.6), rrect(pl[0] - 0.4, pl[2] - 2.4, pl[1] + 0.4, pl[2] + 0.6, 0.6), tri(pl[0], pl[2] - 2.2, pl[1], pl[2] - 2.2, (pl[0] + pl[1]) / 2, pl[2] - 7)), (pl[0] + pl[1]) / 2, 80, pl[3]);
      parts.push(P(IRON[2], f, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, row = Math.floor((Y - pl[2]) / 5.6);
        if (Y > pl[2] + 1 && ((Y - pl[2]) % 5.6) < 0.7) return IRON[0];
        if (Y > pl[2] + 1 && Math.abs(((X - pl[0] + (row % 2) * 2.8) % 5.6)) < 0.6) return IRON[0];
        if (Y < pl[2] - 2 && hash(x, y, 3) > 0.55) return MOSS[3];
        return orb(pl[0] + 2, pl[2] - 4, 14, 50, IRON)(x, y);
      }, IRON[0]));
    });
    // little pumpkins on the pillars, the big grinning one on the arch
    parts = parts.concat(pumpkin(6, 25.6, 2.8, true), pumpkin(66, 27.4, 2.8, true), pumpkin(36, 9.2, 6.6, true));
    parts.push(bat(14, 11, false), bat(58, 6, true), bat(24.4, 3.8, true));
    return parts;
  })(), [[12, 10, ['w.w']], [56, 5, ['w.w']], [23, 3, ['w.w']]]));

  /* The town fountain: a round stone basin brimming with bubbling green,
     a little stone fish standing on its tail in the middle, spouting. */
  var fountain = function (f) {
    var parts = [];
    // the spout: green arcs falling either side, drops along them
    var drops = [];
    [-1, 1].forEach(function (s) {
      for (var k = 0; k < 9; k++) {
        var u = ((k + f * 0.5) / 9), x = 26 + s * (1 + u * 15), y = 4 - Math.sin(Math.min(1, u * 1.6) * Math.PI / 2) * 3 + u * u * 26;
        if (k % 3 !== 2) drops.push(ell(x, y, 1.2, 1.2));
      }
    });
    parts.push(P(SLIME[3], or.apply(null, drops), function (x, y) { return hash(x, y, f) > 0.5 ? SLIME[4] : SLIME[3]; }, null, SLIME[2]));
    // the pedestal and its little upper bowl, green spilling over it
    parts.push(P(IRON[2], or(rrect(23, 18, 29, 32, 1), ell(26, 31, 5, 1.6)), function (x, y) { return orb(24, 18, 6, 16, IRON)(x, y); }, IRON[0]));
    parts.push(P(IRON[2], function (x, y) { return ell(26, 17.6, 9, 3.6)(x, y) && y > 16.6; }, orb(22, 15, 12, 6, IRON), IRON[0]));
    parts.push(P(SLIME[2], or(ell(26, 16.8, 8, 1.6), rrect(17.6, 16.8, 19.4, 22 + f, 0.8), rrect(32.6, 16.8, 34.4, 21 + (1 - f), 0.8)), orb(22, 15, 12, 6, SLIME), SLIME[1]));
    // the fish, on its tail, mouth up to the sky
    parts.push(P(IRON[3], or(ell(26, 10.4, 3.8, 4.8), tri(22.4, 17, 29.6, 17, 26, 13.4), ell(26, 5.4, 1.8, 1.4)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > 13.6) return IRON[2];
      if (Math.abs(((Y + Math.abs(X - 26) * 0.6) % 2.4) - 1.2) < 0.4 && Y > 8) return IRON[2];
      return orb(24.4, 8, 6, 8, IRON)(x, y);
    }, IRON[1]));
    parts.push(P(IRON[3], or(tri(22.4, 9, 20, 7, 22.6, 12), tri(29.6, 9, 32, 7, 29.4, 12)), orb(22, 8, 10, 4, IRON), IRON[1]));
    // the basin: a stone bowl, green brimming in it, bubbles popping
    parts.push(P(IRON[2], or(function (x, y) { return y > 29 && y < 41 && Math.abs(x - 26) < 24 - Math.pow((y - 29) / 12, 2) * 6; }, rrect(14, 40, 38, 44, 1)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 32) return IRON[4];
      if (Math.abs(Y - 36) < 0.5) return IRON[1];
      return orb(14, 26, 40, 22, IRON)(x, y);
    }, IRON[0]));
    parts.push(P(SLIME[2], ell(26, 30, 22, 2.4), function (x, y) { var X = x + 0.5; return Math.abs(((X + f * 3) % 6) - 3) < 0.8 ? SLIME[4] : SLIME[3]; }, SLIME[1]));
    var bub = f ? [[10, 27.4, 1.8], [36, 26.8, 1.4], [42, 28, 1], [16, 24, 1]] : [[14, 27.6, 1.4], [38, 27.4, 1.8], [31, 28, 1], [8, 25.6, 0.9]];
    bub.forEach(function (b) { parts.push(P(SLIME[3], ell(b[0], b[1], b[2], b[2]), function (x, y) { return x + 0.5 < b[0] && y + 0.5 < b[1] ? 'w' : SLIME[3]; }, null, SLIME[1])); });
    return build(52, 44, parts, [[25, 9, ['E']], [25, 4, ['G']], [23, 11, ['3']]]);
  };
  deco('fountain6', [fountain(0), fountain(1)]);

  /* A tall crooked town house: three storeys stacked a little askew, a
     tall pointy roof like a witch's hat with its tip flopped over, lit
     windows of every shape, a narrow door up two steps. */
  deco('crookedhouse', build(56, 88, (function () {
    var parts = [];
    var storeys = [[8, 48, 62, 88, 0], [10, 47, 41, 62.6, 0.04], [13, 44, 24, 41.6, -0.05]];
    storeys.forEach(function (s, i) {
      var f = turned(rrect(s[0], s[2], s[1], s[3], 1), (s[0] + s[1]) / 2, s[3], s[4]);
      parts.push(P(CLAY[2], f, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // timber beams along each floor, plaster between
        if (Y > s[3] - 2) return WOOD[1];
        if (hash(Math.floor(X / 3), Math.floor(Y / 3), i) > 0.93) return CLAY[1];
        return orb(s[0] + 4, s[2], (s[1] - s[0]) * 1.4, 40, CLAY)(x, y);
      }, CLAY[0]));
    });
    // the windows: arched, round, square and crooked, all lit
    var wins = [[14, 68, 8, 10, 'arch', -0.06], [36, 67, 8, 9, 'sq', 0.05], [15, 45, 7, 9, 'sq', 0.08], [33, 46, 9, 9, 'round', 0], [24, 28, 8, 8, 'round', 0], [19, 29, 3, 6, 'sq', -0.1], [34, 29, 4, 7, 'arch', 0.06]];
    wins.forEach(function (w) {
      var cx = w[0] + w[2] / 2, cy = w[1] + w[3] / 2;
      var shape = w[4] === 'round' ? ell(cx, cy, w[2] / 2, w[3] / 2) : w[4] === 'arch' ? or(rrect(w[0], cy, w[0] + w[2], w[1] + w[3], 0.6), ell(cx, cy, w[2] / 2, w[3] / 2)) : rrect(w[0], w[1], w[0] + w[2], w[1] + w[3], 0.6);
      parts.push(P('7', turned(shape, cx, cy, w[5]), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (w[2] > 5 && (Math.abs(X - cx) < 0.5 || Math.abs(Y - cy) < 0.5)) return 'S';
        return Y < cy ? '8' : X < cx ? '7' : '6';
      }, 'S'));
    });
    // the door, up two steps
    parts.push(P('c', or(rrect(25, 74, 32, 86, 3.4)), function (x, y) { var X = x + 0.5; return Math.abs(X - 28.5) < 0.5 ? 'a' : orb(26, 76, 7, 12, PURP)(x, y); }, 'a'));
    parts.push(P('C', ell(30.6, 80.6, 0.8, 0.8), null, 'A'));
    parts.push(P(IRON[2], or(rrect(22.6, 85.6, 34.4, 88, 0.6), rrect(24, 84, 33, 86, 0.6)), orb(24, 84, 10, 4, IRON), IRON[0]));
    // the roof: a tall hat of purple slates, its tip flopped over to one side
    var roofF = function (x, y) {
      if (y < 7 || y > 26) return false;
      var t = (y - 7) / 19, half = 2.6 + Math.pow(t, 1.3) * 17.4 + (y > 23.6 ? 2.4 : 0);
      return Math.abs(x - 28.4 + t * 1.6) < half;
    };
    parts.push(P(SLATE[2], or(roofF, limb([[27.4, 8.6], [25.6, 4.4], [28, 1.4], [33, 1.4], [35.6, 4.6]], 1.7), ell(36, 5.6, 1.7, 1.7)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > 24.6) return SLATE[1];
      var row = Math.floor(Y / 2.8);
      if (Y % 2.8 < 0.6 && Y > 9) return SLATE[1];
      if (Y > 9 && Math.abs(((X + (row % 2) * 1.8) % 3.6)) < 0.5) return SLATE[1];
      return orb(22, 6, 30, 28, SLATE)(x, y);
    }, SLATE[0]));
    // a little chimney poking out of the roof, and a tiny round window in it
    parts.push(P(BRICK[2], rrect(38, 12, 42, 20, 0.6), orb(38, 12, 5, 8, BRICK), BRICK[0]));
    parts.push(P('7', ell(28, 18.6, 1.8, 1.8), function (x, y) { return x + 0.5 < 28 ? '8' : '7'; }, 'S'));
    // a pumpkin on the step
    parts = parts.concat(pumpkin(19, 84.4, 3.4, true));
    return parts;
  })()));

  /* The Mayor: round and little in a very tall top hat (a tiny spider
     dangling from its brim), a red sash and a gold rosette. His head turns
     right round, between [0] all smiles and [1] terribly worried. */
  var mayor = function (sad) {
    var parts = [];
    // little legs in striped trousers, polished shoes
    parts.push(P('O', or(rrect(8.4, 38, 11, 44, 0.6), rrect(13, 38, 15.6, 44, 0.6)), function (x) { return (x + 0.5) % 2 < 0.8 ? 'Q' : 'O'; }, 'N'));
    parts.push(P('g', or(ell(9, 44.6, 2.6, 1.3), ell(15.4, 44.6, 2.6, 1.3)), orb(8, 44, 4, 2, INK), 'f'));
    // his round tummy in a black tailcoat, a white shirt front, the sash and the rosette
    parts.push(P('h', or(ell(12, 32, 8.6, 8), tri(5.4, 34, 3.2, 41.6, 9, 38)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Math.abs(X - 12.6) < 2.4 - (Y - 25) * 0.08 && Y < 37) return Y < 27.4 ? 'x' : 'w';
      if (Math.abs((Y - 26) - (X - 5) * 0.86) < 1.3) return 'x';
      return orb(9, 27, 12, 12, INK)(x, y);
    }, 'f'));
    parts.push(P('C', ell(16.4, 30.4, 1.8, 1.8), orb(15.6, 29.6, 2, 2, GOLD), 'A'));
    parts.push(P('x', or(tri(15.4, 31.6, 16.4, 31.6, 15, 34.4), tri(16.6, 31.6, 17.6, 31.6, 18, 34.4)), null, 'u'));
    // stubby arms
    parts.push(P('h', or(cap(5, 29, 2.6, 34.6, 1.4), cap(19, 29, 21.4, 34.6, 1.4)), orb(3, 29, 6, 6, INK), 'f'));
    parts.push(P('w', or(ell(2.4, 35.4, 1.3, 1.3), ell(21.6, 35.4, 1.3, 1.3)), orb(2, 35, 2, 2, SNOW), '2'));
    // the head: round; happy and rosy, or pale and fretting
    var skin = sad ? GHOST : FACE;
    parts.push(P(skin[2], ell(12, 20, 6.4, 5.6), orb(10, 17, 8, 8, skin), skin[0]));
    // the very tall hat, its purple band, and the spider on its thread
    parts.push(P('h', or(rrect(6.6, 0.6, 17.4, 15.4, 1), ell(12, 15.4, 8.2, 1.5)), function (x, y) {
      var Y = y + 0.5; return Y > 11.4 && Y < 13.6 ? 'c' : orb(8, 2, 10, 20, INK)(x, y);
    }, 'f'));
    parts.push(P('j', pixset([[19.4, 15.6], [19.4, 16.6], [19.4, 17.6], [19.4, 18.6]]), null, null, 'j'));
    parts.push(P('b', ell(19.6, 20, 1.4, 1.3), null, 'a'));
    var st = sad
      ? [[8, 18, ['#...']], [8, 19, ['.#..']], [14, 18, ['...#']], [14, 19, ['..#.']], [8, 20, ['.#.']], [14, 20, ['.#.']], [10, 23, ['.#.#.', '#.#.#']], [17, 17, ['M', 'M']]]
      : [[8, 18, HAPPY], [13, 18, HAPPY], [9, 22, ['#....#', '.####.', '..ss..']], [6, 21, ['33']], [16, 21, ['33']]];
    st.push([8, 3, ['j', 'j']]);
    return build(24, 46, parts, st);
  };
  deco('mayor', [mayor(false), mayor(true)]);

  /* The pumpkin band: three jack-o'-lanterns on the ground, eyes shut,
     lost in the music: one squeezing an accordion, one on a gold
     saxophone, one banging a drum. */
  var pumpkinBand = function (f) {
    var parts = [];
    var vine = function (pts) { return P('<', limb(pts, 0.75), null, '(', '('); };
    // the accordion player
    parts = parts.concat(pumpkin(10.6, 26.8, 8.6, false, true));
    var aw = f ? 7 : 4.4;
    parts.push(vine([[5, 30], [2.6, 31.6]]), vine([[16.4, 30], [18.6, 31.6]]));
    parts.push(P('x', rrect(10.6 - aw, 28, 10.6 + aw, 34.6, 0.8), function (x, y) {
      var X = x + 0.5;
      if (Math.abs(X - 10.6) > aw - 1.8) return Math.floor(y) % 2 ? 'w' : 'W';
      return Math.abs(((X - 10.6 + 20) % 1.6) - 0.8) < 0.35 ? 'u' : 'x';
    }, 'u'));
    // the saxophone player
    parts = parts.concat(pumpkin(32, 25.6, 9.4, false, true));
    var sx = f ? 0.8 : 0;
    parts.push(P('C', or(cap(32.4, 29.6, 36, 27.4 - sx, 0.8), taper([[36, 27.4 - sx], [38.6, 29.4], [39.6, 32.6], [41.6, 35], [44.4, 34], [45, 29.6 - sx]], 1.2, 1.9), ell(45.2, 28.6 - sx, 2.6, 1.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (ell(45.2, 28.4 - sx, 1.6, 0.8)(X, Y)) return 'A';
      if (Math.abs(X - 38.6 - (Y - 29.4) * 0.3) < 0.6 && Math.abs(((Y - 29) % 2) - 1) < 0.5 && Y < 33) return 'F';
      return orb(38, 27, 8, 10, GOLD)(x, y);
    }, 'A'));
    parts.push(vine([[38, 28], [39.6, 27.6]]), vine([[27, 30.6], [24.6, 31.6], [23.4, 29.6]]));
    // the drummer, behind a big red drum
    parts = parts.concat(pumpkin(54, 22.4, 8, false, true));
    parts.push(P('x', ell(54, 30.6, 7.6, 5.2), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (ell(54, 30.6, 5.6, 3.6)(X, Y)) return orb(52, 28, 8, 6, SNOW)(x, y);
      return Math.abs(((X - 54 + Y * 0.6 + 20) % 3) - 1.5) < 0.4 ? 'C' : 'x';
    }, 'u'));
    var sl = f ? [[48, 22], [44.4, 17.6]] : [[48, 22], [45.6, 26.4]], sr = f ? [[60, 22], [62.6, 26.6]] : [[60, 22], [63, 17.4]];
    parts.push(vine(sl), vine(sr));
    parts.push(P('V', or(cap(sl[1][0], sl[1][1], sl[1][0] + (f ? 3 : 5), sl[1][1] + (f ? 4 : 1.6), 0.6), cap(sr[1][0], sr[1][1], sr[1][0] - (f ? 5 : 3), sr[1][1] + (f ? 1.6 : 4), 0.6)), null, 'T', 'T'));
    // music notes, floating up
    var note = function (x, y) { return [P('e', or(ell(x, y, 1.7, 1.4), cap(x + 1.2, y, x + 1.2, y - 5, 0.5), cap(x + 1.2, y - 5, x + 3.2, y - 3.6, 0.5)), null, null, 'd')]; };
    parts = parts.concat(f ? note(22, 9).concat(note(43, 5.6)) : note(19, 12.6).concat(note(45, 8)));
    // faces: eyes shut in bliss, smiling (the sax player's cheeks puffed)
    var st = [[5, 23, HAPPY], [12, 23, HAPPY], [8, 26, ['#..#', '.##.']], [4, 26, ['3']], [16, 26, ['3']],
      [26, 21, HAPPY], [33, 21, HAPPY], [25, 25, ['33']], [37, 25, ['33']],
      [49, 18, HAPPY], [55, 18, HAPPY], [51, 21, ['#...#', '.###.']], [48, 21, ['3']], [58, 21, ['3']]];
    return build(64, 36, parts, st);
  };
  deco('pumpkinband', [pumpkinBand(0), pumpkinBand(1)]);

  /* The graveyard's ghost band, on a little wooden stage hung with
     bunting: a ghost on the trumpet, a grinning skeleton on the drums, a
     ghost plucking a double bass taller than he is. Two frames of swing. */
  var ghostBand = function (f) {
    var parts = [], bob = f ? -1 : 0, bob2 = f ? 0 : -1;
    var ghost = function (cx, cy, arm) {
      return P(GHOST[3], or(ell(cx, cy, 6, 6), function (x, y) { return y > cy && y < cy + 10 + Math.sin(x * 1.3 + f * 2) * 1.2 && Math.abs(x - cx) < 6 - (y - cy) * 0.12; }, arm || function () { return false; }), function (x, y) {
        var Y = y + 0.5; return Y > cy + 8 ? GHOST[2] : orb(cx - 2, cy - 3, 9, 12, GHOST)(x, y);
      }, GHOST[1], GHOST[1]);
    };
    // the double bass: a tall brown body, a long neck, a scroll; the right-hand ghost behind it
    parts.push(ghost(54, 16 + bob2, cap(50, 20 + bob2, 47.6, 27, 1.3)));
    parts.push(P('l', or(ell(52, 30.6, 6, 5.4), ell(52, 23.4, 4.6, 4.2), rrect(51, 4, 53, 20, 0.8), ell(52.4, 3.4, 1.6, 1.8)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 20 && Math.abs(X - 52) < 1.2) return 'g';
      if (Math.abs(X - 52) < 0.4 && Y > 20) return 'n';
      if ((Math.abs(X - 49.6) < 0.5 || Math.abs(X - 54.4) < 0.5) && Math.abs(Y - 27.6) < 1.4) return 'g';
      return orb(49, 22, 8, 12, ORANGE)(x, y);
    }, 'k'));
    parts.push(P('g', rrect(51.4, 36, 52.6, 38.6, 0.4), null, 'f'));
    // the skeleton drummer behind his kit: a round skull with a big grin, ribs, bony arms
    var sk = 15 + bob;
    parts.push(P(BONE[3], or(rrect(30.4, sk + 6, 33.6, sk + 16, 1.2), cap(29, sk + 8, 26, sk + 12.6 + (f ? -3 : 0), 0.8), cap(35, sk + 8, 38, sk + 12.6 + (f ? 0 : -3), 0.8)), function (x, y) {
      var Y = y + 0.5; return Math.abs(((Y - sk) % 2) - 1) < 0.45 && Y > sk + 7 ? BONE[1] : BONE[3];
    }, BONE[1], BONE[1]));
    parts.push(P(BONE[3], or(ell(32, sk + 1.6, 4.6, 4.2), rrect(29.4, sk + 3, 34.6, sk + 6.4, 1.4)), orb(30, sk - 1, 7, 7, BONE), BONE[1]));
    parts.push(P('V', or(cap(26, sk + 12.6 + (f ? -3 : 0), 30, sk + 9.6 + (f ? -5 : 0), 0.5), cap(38, sk + 12.6 + (f ? 0 : -3), 35, sk + 9 + (f ? 0 : -5), 0.5)), null, 'T', 'T'));
    // the drums: a bass drum in front, a snare, a cymbal on its stand
    parts.push(P('O', or(cap(41, 24, 41, 37, 0.5), cap(37.6, 23 + (f ? 0.6 : 0), 44.4, 23 - (f ? 0.6 : 0), 0.9)), function (x, y) { return y < 24 ? 'D' : 'P'; }, 'N', 'O'));
    parts.push(P('x', ell(24.6, 28, 3.6, 2), function (x, y) { return y + 0.5 < 28 ? 'W' : 'x'; }, 'u'));
    parts.push(P('x', ell(32, 31.6, 6, 6), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (ell(32, 31.6, 4.6, 4.6)(X, Y)) return ell(32, 31.6, 1.8, 1.8)(X, Y) ? 'm' : orb(30, 29, 6, 6, SNOW)(x, y);
      return 'x';
    }, 'u'));
    // the trumpet ghost on the left, cheeks puffed, his trumpet out in front
    parts.push(ghost(13, 16 + bob, cap(9, 21 + bob, 6, 21 + bob, 1.3)));
    parts.push(P('C', or(cap(9.6, 19 + bob, 3.6, 19 + bob, 0.8), tri(4.4, 19 + bob, 0.6, 15.6 + bob, 0.6, 22.4 + bob), rrect(5.6, 17 + bob, 8.6, 18.6 + bob, 0.4)), orb(4, 17, 8, 4, GOLD), 'A'));
    // the stage: planks, a scalloped bunting along its front
    parts.push(P('U', rrect(0.4, 37.4, 63.6, 44, 1), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 39) return X % 8 < 0.7 ? 'T' : 'V';
      var c = Math.floor(X / 8) * 8 + 4;
      if (Y < 41.6 + Math.sqrt(Math.max(0, 16 - (X - c) * (X - c))) * 0.6) return Math.floor(X / 8) % 2 ? 'c' : 'm';
      return Y > 43 ? 'S' : 'T';
    }, 'S'));
    var st = [[10, 13 + bob, ['#.#']], [14, 13 + bob, ['#.#']], [10, 17 + bob, ['3..3']], [12, 18 + bob, ['#']],
      [29, sk, ['##.##', '##.##']], [30, sk + 3, ['#####', '.#.#.']], [30, sk + 1, ['w...w']],
      [52, 13 + bob2, ['#.#']], [56, 13 + bob2, ['#.#']], [53, 16 + bob2, ['.##.']], [51, 16 + bob2, ['3']], [58, 16 + bob2, ['3']]];
    return build(64, 44, parts, st);
  };
  deco('ghostband', [ghostBand(0), ghostBand(1)]);

  /* A little stone crypt: a pointed roof furred with moss, a round wooden
     door with an iron ring, ivy climbing over it, a carved moon above. */
  deco('cryptdoor', build(44, 44, (function () {
    var parts = [];
    parts.push(P(IRON[2], or(rrect(4, 14, 40, 44, 0.8), tri(1.6, 15.6, 42.4, 15.6, 22, 3), rrect(1.6, 13.4, 42.4, 16.4, 0.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, row = Math.floor((Y - 16) / 4.4);
      if (Y < 16.4) {
        if (ell(22, 11, 2.8, 2.8)(X, Y) && !ell(23.4, 10.2, 2.4, 2.4)(X, Y)) return IRON[0];
        if (Y < 13.4 && hash(x, y, 7) > 0.6 && Math.abs(X - 22) > (Y - 3) * 1.4) return MOSS[3];
        return Y > 13.4 ? IRON[3] : orb(16, 4, 30, 16, IRON)(x, y);
      }
      if (((Y - 16) % 4.4) < 0.6 || ((X + (row % 2) * 3.4) % 6.8) < 0.6) return IRON[1];
      return orb(10, 14, 40, 40, IRON)(x, y);
    }, IRON[0]));
    // the round door: dark planks, iron studs, a ring to knock with, a step below
    parts.push(P('T', ell(22, 33, 9.4, 9.4), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = Math.sqrt((X - 22) * (X - 22) + (Y - 33) * (Y - 33));
      if (d > 8.2) return IRON[3];
      if (((X - 14) % 3.2) < 0.6) return 'S';
      if (Math.abs(Y - 28) < 0.6 && Math.abs(((X + 0.4) % 3.2) - 1.6) < 0.5) return 'P';
      return orb(17, 27, 14, 14, WOOD)(x, y);
    }, IRON[0]));
    parts.push(P('O', but(ell(26.6, 34, 1.8, 1.8), ell(26.6, 34, 0.8, 0.8)), orb(25.6, 33, 2, 2, IRON), 'N'));
    parts.push(P(IRON[3], rrect(10, 41.4, 34, 44, 0.6), orb(12, 40, 20, 4, IRON), IRON[1]));
    // ivy climbing up its left side and over the roof
    var ivy = [[3, 42, 2.2], [2.4, 37, 2], [4, 32, 2.2], [3, 27.4, 1.8], [5, 22.4, 2], [4, 17.4, 2], [7, 13.6, 2], [11, 11.4, 1.8], [15, 8.6, 1.7], [36, 14.2, 1.6], [39.4, 16.2, 1.6], [40, 21, 1.4]];
    ivy.forEach(function (l, i) { parts.push(P('<', ell(l[0], l[1], l[2], l[2] * 0.8), function (x, y) { return x + 0.5 < l[0] && y + 0.5 < l[1] ? '>' : i % 2 ? ')' : '<'; }, '(')); });
    return parts;
  })(), [[22, 30, ['.']]]));

  /* The mansion's grand pipe organ: a carved dark-wood case in three
     towers, golden pipes in a fan (tallest in the middle), two keyboards,
     round stop-knobs either side, a music stand, a velvet bench. */
  deco('organ', build(80, 80, (function () {
    var parts = [];
    // the case: three towers with pointed carved tops
    var towers = [[4, 24, 16], [27, 53, 2], [56, 76, 16]];
    parts.push(P('T', or(rrect(2, 40, 78, 72, 1), or.apply(null, towers.map(function (t) { return or(rrect(t[0], t[2] + 6, t[1], 44, 1), tri(t[0] - 1, t[2] + 7, t[1] + 1, t[2] + 7, (t[0] + t[1]) / 2, t[2])); }))), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (towers.some(function (t) { return Y > t[2] + 5 && Y < t[2] + 7.4 && X > t[0] - 1 && X < t[1] + 1; })) return 'C';
      return orb(20, 10, 60, 70, 'STTUV')(x, y);
    }, 'S'));
    parts.push(P('C', or(ell(14, 15, 1.4, 1.4), ell(40, 1.4, 1.4, 1.4), ell(66, 15, 1.4, 1.4)), null, 'A'));
    // the pipes: in each tower, gold, each with its dark mouth
    towers.forEach(function (t, ti) {
      var n = ti === 1 ? 7 : 5, w = (t[1] - t[0] - 2) / n;
      for (var k = 0; k < n; k++) {
        var px = t[0] + 1 + k * w, mid = (n - 1) / 2, top = t[2] + 9 + Math.abs(k - mid) * (ti === 1 ? 2.6 : 2.2);
        (function (px, top) {
          parts.push(P('C', rrect(px + 0.3, top, px + w - 0.3, 43, Math.min(1.2, w / 2)), function (x, y) {
            var X = x + 0.5, Y = y + 0.5, u = (X - px) / w;
            if (Y > 36 && Y < 38.4 && Math.abs(u - 0.5) < 0.3) return 'S';
            if (Y > 34.4 && Y <= 36 && Math.abs(u - 0.5) < 0.34 - (36 - Y) * 0.18) return 'A';
            return u < 0.3 ? 'F' : u < 0.5 ? 'D' : u < 0.78 ? 'C' : 'B';
          }, 'A'));
        })(px, top);
      }
    });
    // the console: two keyboards, stops, a music stand with music on it
    parts.push(P('S', rrect(10, 46, 70, 60, 1), function (x, y) { return orb(30, 40, 60, 30, 'STTUV')(x, y); }, 'S'));
    [[13, 49.4, 67, 53.4], [14.4, 54.6, 65.6, 58.6]].forEach(function (kb) {
      parts.push(P('w', rrect(kb[0], kb[1], kb[2], kb[3], 0.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, k = (X - kb[0]) % 2.4;
        if (k < 0.5) return '2';
        var o = Math.floor((X - kb[0]) / 2.4) % 7;
        if (Y < kb[1] + 2.2 && k > 1.6 && o !== 2 && o !== 6) return 'g';
        return Y > kb[3] - 0.8 ? 'W' : 'w';
      }, 'N'));
    });
    [[6, 50], [6, 55], [74, 50], [74, 55], [8.4, 46.6], [71.6, 46.6]].forEach(function (s2, i) { parts.push(P(i % 2 ? 'x' : 'w', ell(s2[0], s2[1], 1.5, 1.5), orb(s2[0] - 0.6, s2[1] - 0.6, 2, 2, i % 2 ? RED : SNOW), i % 2 ? 'u' : '2')); });
    parts.push(P('Y', rrect(30, 40.6, 50, 47.4, 0.6), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Math.abs(((Y - 41.6) % 1.8)) < 0.4 && X > 31 && X < 49) return 'P';
      if (Math.abs(((Y - 41.6) % 1.8) - 0.9) < 0.5 && Math.abs(((X * 1.7) % 5) - 2.5) < 0.5) return 'G';
      return X < 40 ? 'Y' : 'Z';
    }, 'V'));
    // the base, and a velvet bench in front
    parts.push(P('T', rrect(4, 60, 76, 80, 1), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (rrect(8, 63, 38, 77, 1)(X, Y) || rrect(42, 63, 72, 77, 1)(X, Y)) return ((X + Y) % 6 < 0.6) ? 'S' : 'T';
      return orb(20, 56, 60, 30, 'STTUV')(x, y);
    }, 'S'));
    parts.push(P('c', rrect(22, 68, 58, 72.6, 1.4), orb(26, 66, 34, 8, PURP), 'a'));
    parts.push(P('S', or(rrect(24, 72, 26.6, 80, 0.6), rrect(53.4, 72, 56, 80, 0.6)), null, 'S'));
    return parts;
  })()));

  /* A witch's potion shelf: two shelves crowded with jars and bottles,
     some glowing, a candle, a spider's jar, a little cactus, and books. */
  deco('potionshelf', build(40, 40, (function () {
    var parts = [];
    parts.push(P('T', or(rrect(1, 3, 4.4, 40, 0.6), rrect(35.6, 3, 39, 40, 0.6), rrect(0, 17.6, 40, 20.4, 0.6), rrect(0, 36.6, 40, 39.6, 0.6), rrect(0, 1.4, 40, 4, 0.8)), orb(8, 0, 40, 40, WOOD), 'S'));
    var flask = function (cx, by, r, t, neck) {
      return P(t[2], or(ell(cx, by - r, r, r), rrect(cx - 1, by - r * 2 - neck, cx + 1, by - r, 0.4)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y < by - r * 2 - neck + 1.2) return 'U';
        if (Y < by - r - r * 0.2) return X < cx ? 'R' : 'Q';
        if (ell(cx - r * 0.4, by - r * 1.2, r * 0.25, r * 0.25)(X, Y)) return 'w';
        return orb(cx - 1, by - r * 1.4, r * 1.2, r * 1.2, t)(x, y);
      }, t[0]);
    };
    var bottle = function (x0, x1, by, h, t) {
      var cx = (x0 + x1) / 2;
      return P(t[2], or(rrect(x0, by - h, x1, by, 1), rrect(cx - 0.9, by - h - 3, cx + 0.9, by - h + 0.4, 0.4)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y < by - h - 1.6) return 'U';
        if (Y < by - h + 0.6) return 'Q';
        if (Y > by - h * 0.62 && Y < by - h * 0.3) return 'Y';
        return X < x0 + 1.4 ? t[3] : orb(x0, by - h, (x1 - x0) * 1.4, h * 1.6, t)(x, y);
      }, t[0]);
    };
    // the top shelf
    parts.push(bottle(6, 11, 17.6, 9, LILAC), flask(15.6, 17.6, 3.4, SLIME, 2), bottle(20.4, 24.4, 17.6, 6, CORAL));
    parts.push(P('w', rrect(26, 9, 33.6, 17.6, 1), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 10.4) return 'U';
      return X < 27.2 ? 'R' : Y > 15.6 ? 'Q' : 'W';
    }, 'P'));
    parts.push(P('b', or(ell(29.8, 13.4, 1.4, 1.2), cap(28, 12.4, 31.6, 14.6, 0.35), cap(28, 14.6, 31.6, 12.4, 0.35)), null, 'a', 'a'));
    // the bottom shelf: books, a candle, a fat jar of sweets, a little cactus in a pot
    [[5.4, 8, 'x'], [8, 10.4, '|'], [10.4, 12.6, '{']].forEach(function (b) { parts.push(P(b[2], rrect(b[0], 27.4, b[1], 36.6, 0.4), function (x, y) { return y + 0.5 < 29 || y + 0.5 > 34.6 ? 'C' : b[2]; }, 'g')); });
    parts.push(candle(16, 29.6, 36.6, 1), flame(16, 29.8, 4, 0.4));
    parts.push(P('w', or(rrect(20, 28.4, 29.6, 36.6, 1.4), rrect(21, 26.6, 28.6, 28.6, 0.6)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 28.6) return 'x';
      var sw = [[22.4, 31, 'x'], [25, 33.4, 'C'], [27.6, 30.6, '{'], [23.4, 34.6, '|'], [26.6, 35.4, 'r']];
      for (var i = 0; i < sw.length; i++) if (ell(sw[i][0], sw[i][1], 1.3, 1.1)(X, Y)) return sw[i][2];
      return X < 21.4 ? 'R' : 'W';
    }, 'P'));
    parts.push(P('l', tri(30.6, 32.6, 34.6, 32.6, 33.6, 36.6), function (x, y) { return y + 0.5 < 33.6 ? 'm' : 'l'; }, 'k'));
    parts.push(P('{', or(ell(32.6, 30.2, 1.4, 2.6), ell(31, 29.6, 0.8, 1.4)), orb(32, 29, 2, 3, CACT), '['));
    return parts;
  })(), [[29, 12, ['w.w']]]));

  /* A twisty old tree with a friendly sleepy face in its bark, its
     branches curling at their ends, glowing toadstools at its roots. */
  var shroomCluster = function (list) {
    var out = [];
    list.forEach(function (m) {
      var cx = m[0], by = m[1], r = m[2], t = m[3];
      out.push(P('e', rrect(cx - r * 0.36, by - r * 1.2, cx + r * 0.36, by, r * 0.24), orb(cx - 1, by - r, r, r * 2, 'jdeeR'), 'c'));
      out.push(P(t[2], function (x, y) { return ell(cx, by - r * 1.1, r * 1.1, r * 0.95)(x, y) && y < by - r * 0.95; }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (ell(cx - r * 0.35, by - r * 1.6, r * 0.22, r * 0.18)(X, Y) || ell(cx + r * 0.45, by - r * 1.45, r * 0.18, r * 0.15)(X, Y)) return LIME[4];
        return orb(cx - r * 0.4, by - r * 1.9, r * 1.2, r, t)(x, y);
      }, t[0]));
    });
    return out;
  };
  deco('twistytree', build(56, 88, (function () {
    var parts = [];
    var mid = function (y) { var t = (y - 30) / 58; return 28 + Math.sin(t * 5.2 + 0.4) * 3.6; };
    var trunk = function (x, y) {
      if (y < 30 || y > 88) return false;
      var t = (y - 30) / 58, half = 6 + t * 2 + Math.pow(Math.max(0, t - 0.8) / 0.2, 2) * 10;
      return Math.abs(x - mid(y)) < half;
    };
    var branches = or(
      taper([[27, 36], [21, 27], [12, 22], [6, 14], [8.6, 9.6], [11.6, 11]], 3.4, 0.8),
      taper([[30, 35], [36, 25], [46, 20], [50, 12], [47, 8.4], [44.6, 10.6]], 3.4, 0.8),
      taper([[28, 32], [27, 20], [30, 11], [27, 4.6], [24, 5.6]], 3.2, 0.8),
      taper([[18, 25], [16, 30], [11, 33], [8.6, 30.6]], 1.6, 0.6),
      taper([[40, 22], [44, 28], [49.4, 28.6], [50, 25.4]], 1.6, 0.6));
    parts.push(P(BARK[2], or(trunk, branches), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // grooves twisting up round the trunk, lit down its left side
      if (Y > 30 && Y < 82 && Math.abs(((X - mid(Y)) * 0.9 + Y * 0.6 + 60) % 7 - 3.5) < 0.55) return BARK[1];
      if (Y > 30) { var d = (X - mid(Y)) / 8; return d < -0.45 ? BARK[3] : d < 0.25 ? BARK[2] : BARK[1]; }
      return orb(22, 16, 30, 30, BARK)(x, y);
    }, BARK[0]));
    // the face: a smooth patch of bark, sleepy eyes, a knotty nose, a gentle smile
    parts.push(P(BARK[3], ell(28.4, 55, 8.6, 8.4), function (x, y) { return orb(26, 51, 11, 11, BARK)(x, y) === BARK[4] ? BARK[4] : BARK[3]; }, BARK[2]));
    parts.push(P(BARK[0], or(function (x, y) { return ell(24.4, 52.4, 2.6, 1.8)(x, y) && y > 52.6; }, function (x, y) { return ell(32.4, 52.4, 2.6, 1.8)(x, y) && y > 52.6; }), null, BARK[0]));
    parts.push(P(BARK[2], ell(28.4, 56, 1.8, 2), orb(27.6, 55, 2, 2, BARK), BARK[1]));
    parts.push(P(BARK[0], function (x, y) { return ell(28.4, 58.4, 4.2, 2.8)(x, y) && y > 59.4; }, function (x, y) { return y + 0.5 > 60.6 ? 'q' : BARK[0]; }, BARK[0]));
    // a few last leaves hanging on
    [[9, 10.4, 'l'], [46, 9.6, 'm'], [26, 4.2, 'x'], [12, 30, 'm'], [50.4, 26.4, 'l']].forEach(function (l) { parts.push(P(l[2], ell(l[0], l[1], 1.7, 1.3), function (x, y) { return x + 0.5 < l[0] ? 'n' : l[2]; }, 'k')); });
    parts = parts.concat(shroomCluster([[11, 88, 5, LILAC], [17.6, 88, 3.2, LILAC], [42.4, 88, 4.4, LILAC], [48.6, 88, 2.8, LIME]]));
    // glowing motes over the mushrooms
    [[8, 76.4], [20, 79], [45, 77], [38, 80.4], [52, 81.6]].forEach(function (m) { parts.push(P(LIME[4], ell(m[0], m[1], 0.8, 0.8), null, null, LIME[3])); });
    return parts;
  })(), [[21, 52, ['#']], [35, 52, ['#']], [21, 56, ['33']], [34, 56, ['33']], [24, 49, ['ww']]]));

  // a little cluster of glowing toadstools
  deco('glowshroom6', build(20, 18, shroomCluster([[6.4, 18, 5.4, LILAC], [15, 18, 4, LILAC], [11, 18, 2.6, LIME]]).concat([
    P(LIME[4], ell(3, 4, 0.8, 0.8), null, null, LIME[3]), P(LIME[4], ell(17.4, 6, 0.8, 0.8), null, null, LIME[3])
  ])));

  /* Firework night's bonfire: logs stacked in a wigwam inside a ring of
     stones, big flames leaping out of it, sparks flying up. */
  var bonfire = function (f) {
    var parts = [];
    // the flames: three big tongues and a few small ones, licking up
    var tongues = f ? [[22, 36, 26, 1.6, 6.6], [15, 36, 17, 2.6, 4.6], [29, 36, 20, -2.4, 4.8], [10, 36, 9, 1.4, 2.6], [34.6, 36, 11, -1.6, 2.6]]
      : [[22, 36, 23, -1.4, 6.6], [15, 36, 19, 1.6, 4.6], [29.4, 36, 17, -1.2, 4.8], [9.4, 36, 11, -1, 2.6], [35, 36, 9, 1.6, 2.6]];
    tongues.forEach(function (t) {
      parts.push(P('6', function (x, y) {
        var u = (t[1] - y) / t[2]; if (u < 0 || u > 1) return false;
        var cx = t[0] + Math.sin(u * 3.2 + f * 1.4) * t[3] * u;
        return Math.abs(x - cx) < t[4] * Math.pow(1 - u, 0.7) * (u < 0.2 ? 0.7 + u * 1.5 : 1);
      }, function (x, y) {
        var u = (t[1] - y - 0.5) / t[2], d = Math.abs(x + 0.5 - t[0] - Math.sin(u * 3.2 + f * 1.4) * t[3] * u) / (t[4] * Math.pow(Math.max(0.01, 1 - u), 0.7));
        return d < 0.35 && u < 0.55 ? '8' : d < 0.65 && u < 0.8 ? '7' : '6';
      }, null, '5'));
    });
    // two logs leaning together in front of the fire, crossing at the top
    [[7, 39.4, 25, 15.6], [37, 39.4, 19, 15.6]].forEach(function (l) {
      parts.push(P('T', cap(l[0], l[1], l[2], l[3], 1.6), function (x, y) {
        var X = x + 0.5, Y = y + 0.5; return Math.abs(((X - l[0]) * 0.5 + (Y - l[1]) * 0.8 + 20) % 2.6 - 1.3) < 0.3 ? 'S' : orb(l[2] - 2, l[3], 10, 26, WOOD)(x, y);
      }, 'S'));
    });
    // embers glowing between the logs, stones in a ring
    parts.push(P('5', ell(22, 37.4, 9, 2), function (x, y) { return hash(x, y, f) > 0.6 ? '7' : '5'; }, '4'));
    parts.push(P('T', cap(5, 37.6, 39, 37.6, 1.7), function (x, y) { return y + 0.5 < 37 ? 'U' : 'T'; }, 'S'));
    parts.push(P('X', or(ell(5, 37.6, 1.6, 1.6), ell(39, 37.6, 1.6, 1.6)), function (x, y) { return ell(5, 37.6, 0.6, 0.6)(x + 0.5, y + 0.5) || ell(39, 37.6, 0.6, 0.6)(x + 0.5, y + 0.5) ? 'U' : 'X'; }, 'T'));
    [[3, 38.6, 3, 2], [9.6, 39, 3, 1.8], [34.4, 39, 3, 1.8], [41, 38.6, 3, 2]].forEach(function (s2) { parts.push(P(IRON[2], ell(s2[0], s2[1], s2[2], s2[3]), orb(s2[0] - 1, s2[1] - 1, s2[2] * 1.4, s2[3] * 1.6, IRON), IRON[0])); });
    // sparks flying up
    var sp = f ? [[14, 6], [30, 3.4], [20, 1.6], [36, 9], [8, 12]] : [[17, 3], [27, 6.4], [33, 2], [11, 8.6], [24, 0.8]];
    sp.forEach(function (s2, i) { parts.push(P(i % 2 ? '7' : '8', ell(s2[0], s2[1], 0.8, 0.8), null, null, i % 2 ? '6' : '7')); });
    return build(44, 40, parts);
  };
  deco('bonfire', [bonfire(0), bonfire(1)]);

  // a TV aerial for the rooftops: a mast, a boom of crossbars, a bracket
  // (and a little bat asleep upside down on the end of it)
  deco('aerial', build(20, 30, (function () {
    var parts = [];
    var metal = function (f) { return P('P', f, null, null, 'O'); };
    var bars = [cap(2, 7.6, 18.4, 7.6, 0.6)];
    [3.4, 6.4, 9.4, 12.4, 15.4].forEach(function (x, i) { var h = 4.6 - i * 0.5; bars.push(cap(x, 7.6 - h, x, 7.6 + h, 0.45)); });
    parts.push(metal(or.apply(null, bars)));
    parts.push(metal(or(cap(10.4, 7.6, 10.4, 30, 0.7), cap(10.4, 13, 6, 18.6, 0.45), cap(10.4, 13, 14.8, 18.6, 0.45))));
    parts.push(P('O', or(rrect(8.4, 24, 12.4, 26, 0.4), rrect(8.4, 27.4, 12.4, 29.4, 0.4)), null, 'N'));
    parts.push(P('b', or(ell(18.4, 11, 1.6, 2.2), tri(17, 9.2, 17.4, 7.8, 18.4, 8.8), tri(18.6, 8.8, 19.4, 7.8, 19.8, 9.2)), orb(17.6, 10, 3, 4, PURP), 'a'));
    return parts;
  })(), [[17, 11, ['#.#']]]));

  /* ---- on the sprite sheet (tools/sheet.html?only=land6) ---- */
  var RIDES = [];
  var show = function (list, name, arr) { (Array.isArray(arr) ? arr : [arr]).forEach(function (s, i) { list.push([i ? '' : name, s]); }); };
  ['haycart', 'owl', 'buggy', 'candelabra', 'chandelier', 'ghostplat'].forEach(function (k) { show(RIDES, k, LK[k]); });

  var SPR = [].concat.apply([], SPRINGS.map(function (sp) { return [[sp[0], sp[1][0]], ['', sp[1][1]]]; }));
  A.bonenotes.forEach(function (k, i) { SPR.push([i ? '' : 'bonenotes', k[0]], ['', k[1]]); });
  var SETS = [];
  SET.forEach(function (it) { show(SETS, it[0], it[1]); });
  // and this file's scenery, so ?only=land6 shows all of it together
  ['towngate', 'fountain6', 'crookedhouse', 'mayor', 'pumpkinband', 'ghostband', 'cryptdoor', 'organ', 'potionshelf', 'twistytree', 'glowshroom6', 'bonfire', 'aerial'].forEach(function (k) { show(SETS, k, D[k]); });
  (A.sheet = A.sheet || []).push(['land6 rides', RIDES], ['land6 springs', SPR], ['land6 set', SETS]);
})();
