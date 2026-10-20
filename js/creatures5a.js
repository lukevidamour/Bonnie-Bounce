/* ==========================================================================
   creatures5a.js — the fifth land, "ONE DAY…" (levels 36–45), part one.

   Bonnie, aged six, drew some of this land's cast himself: a squirrel
   throwing a nut, a chocolate bar on legs, a cross palm tree, a butterfly,
   a Christmas tree with a big round nose, a little block of flats with
   eyes and a polar bear, and in his "items" box a bullet with an eye.
   They're his characters, so they keep what he drew — the squares on
   the chocolate, the palm's spiky hair and cross brows, the tree's nose,
   the building's taller left side — and are only lit and rounded into
   the game's hand.

   Also here: the Pokémon of the meadow (the game is private, family
   only, so they're drawn faithfully, just in this game's soft lit
   style), Queen Bee and her workers, the land's items (Bonnie's bullet,
   the golden wishes, the paint pots and their blocks, the tall grass,
   honey) and the scenery for the meadow, New York, Chocolate Land and
   Bee Land.

   The same kit and the same rules as creatures.js: shapes lit from the
   top left, a coloured outline, big friendly eyes with a sparkle, every
   creature facing left and standing on its bottom row. That file keeps
   its palette to itself, so this one carries a copy and adds its own
   ramps (deep, shade, base, light, shine) on characters of its own.
   No words or letters anywhere — signs and lists are scribbles.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, K = A.kit, E = A.en, D = A.deco, ell = K.ell, cap = K.cap, limb = K.limb, rrect = K.rrect;

  // creatures.js's palette, copied, so the shared tones match exactly
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
    ';': '#1a2262', '_': '#2a3c9a', '|': '#3c5cd4', '?': '#6e8ef2', '/': '#bccfff',
    0: '#c0204c', 9: '#ee4068'
  };
  // this file's own ramps take characters from U+0100 on, five at a time
  var next = 0x100;
  var ramp = function (cols) {
    var s = '';
    for (var i = 0; i < cols.length; i++) { var ch = String.fromCharCode(next++); PAL[ch] = cols[i]; s += ch; }
    return s;
  };

  var INK = 'fghij', SNOW = '21WwR', RED = 'uvxyz', GOLD = 'ABCDF', WOOD = 'STUVX', IRON = 'NOPQR', PINK = 'pqrst',
    FOX = 'klmno', PURP = 'abcde', LEAF = '()<>^', CACT = '[]{}~', CREAM = 'ZZYYw', TEAL = '@+=-:', COAT = ';_|?/';
  var RUSS = ramp(['#4a1a0c', '#7c3216', '#b45626', '#de8648', '#fcc494']);   // a red squirrel's coat
  var FAWN = ramp(['#9a7050', '#c89e76', '#ecd0a8', '#fbe8cc', '#fffaf0']);   // his cream front
  var NUT = ramp(['#4e4210', '#86741c', '#bea43a', '#e4d074', '#fff6c4']);    // an acorn, olive-gold
  var CHOC = ramp(['#2a1006', '#4a220e', '#70401e', '#966034', '#c89060']);   // milk chocolate
  var DARK = ramp(['#1a0904', '#2c1308', '#442212', '#60361e', '#8e5a3a']);   // dark chocolate
  var TRUNK = ramp(['#4e3a28', '#806246', '#ac8c68', '#d2b48c', '#f2dcbc']);  // a palm's grey-tan trunk
  var HUSK = ramp(['#3a1e0c', '#643612', '#8e5422', '#b87a3c', '#e6b070']);   // coconut husk
  var PINE = ramp(['#0c3420', '#165232', '#227444', '#3c9a58', '#8cd090']);   // fir needles
  var BRICK = ramp(['#4a1810', '#78281c', '#a6402e', '#cc6448', '#f2a080']);  // New York red brick
  var STONE = ramp(['#8a7a68', '#b8a68e', '#ddcfb6', '#f2e8d4', '#fffaf0']);  // brownstone trim
  var POLAR = ramp(['#8c8270', '#bcb299', '#e2d9c2', '#f6f1e2', '#ffffff']);  // a polar bear's cream-white
  var BULLET = ramp(['#07091c', '#111634', '#1d2656', '#34468a', '#8ea2e6']); // Bonnie's bullet, deep navy
  var HONEY = ramp(['#6a3000', '#a85c04', '#e09a14', '#ffc844', '#fff2b0']);
  var BEEB = ramp(['#1c0e06', '#36200e', '#543618', '#785230', '#ae8a62']);   // a worker's brown stripes
  var WING = ramp(['#5e58a4', '#8e88d4', '#bcb6f2', '#e2e0ff', '#ffffff']);   // wings, a lilac sheen
  var PIKA = ramp(['#8a5a00', '#c89400', '#f4c820', '#ffe45c', '#fff3a0']);
  var BULB = ramp(['#16524a', '#24806e', '#44b29a', '#82d8c0', '#d0fff0']);
  var SQRT = ramp(['#1a4e86', '#3282c4', '#62b4ec', '#a2dcff', '#e8f8ff']);
  var JIGG = ramp(['#a0446e', '#d672a2', '#ffa4c8', '#ffd0e4', '#fff4f8']);
  var EEV = ramp(['#5a2e14', '#8a4e26', '#b47a44', '#d8a26a', '#f4cc9a']);
  var PSY = ramp(['#9a5e00', '#d48e00', '#fcbc2c', '#ffda74', '#fff6d8']);
  var ZUB = ramp(['#16306e', '#2850a8', '#4a7cd4', '#86b0f0', '#d4e6ff']);
  var EKA = ramp(['#46186a', '#7432a0', '#a456cc', '#c88ae6', '#ecd0ff']);
  var GRASS = ramp(['#14501a', '#227a22', '#3ab030', '#7ae050', '#d0ffa0']);
  var PAPER = ramp(['#a69a86', '#d2c8b2', '#f0eadb', '#faf6ec', '#ffffff']);
  var YEL = ramp(['#a06400', '#d89e00', '#ffd424', '#fff078', '#fffbe0']);    // paint yellow
  var BLU = ramp(['#0c2680', '#1a44c0', '#3a70ee', '#7ca8ff', '#dceaff']);    // paint blue
  var SIGN = ramp(['#0a3a22', '#14583a', '#1f7a4e', '#3aa06a', '#a8e0c0']);   // street-sign green
  var MAIL = ramp(['#0c1e4c', '#183278', '#264ea6', '#4a76d0', '#b0c8f4']);   // mailbox blue
  var BERRY = ramp(['#3a1458', '#5c2484', '#8442b4', '#b276dc', '#ecd2ff']);
  var VIOL = ramp(['#561a74', '#8a2cb0', '#b450dc', '#d894f2', '#f6e0ff']);
  var SKY = ramp(['#0e4a8a', '#1c74c8', '#3aa0f0', '#86cdfc', '#e0f4ff']);
  var MINT = ramp(['#2a7a6a', '#52b29c', '#88d6c2', '#c2f0e2', '#f0fffa']);
  var STRAW = ramp(['#6a4a12', '#a07828', '#ccA444', '#ecd27c', '#fff2c0']);
  var STEEL = ramp(['#4a5060', '#727a8c', '#a2aabc', '#ccd2de', '#f4f8ff']);
  var TERRA = ramp(['#6a2414', '#a4432a', '#d06a40', '#ee9a6c', '#ffd8bc']); // a glazed clay pot

  /* ---- the kit, as creatures.js uses it ---- */
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
  var box = function (x0, y0, x1, y1) { return function (x, y) { return x >= x0 && x < x1 && y >= y0 && y < y1; }; };
  // paint rows anywhere, even where the scene left nothing ('.' keeps what's there):
  // for sparkles and glows that shouldn't get an outline
  var put = function (rows, x, y, list) {
    list.forEach(function (str, i) {
      var Y = y + i;
      if (Y < 0 || Y >= rows.length) return;
      var r = rows[Y].split('');
      for (var k = 0; k < str.length; k++) if (str[k] !== '.' && x + k >= 0 && x + k < r.length) r[x + k] = str[k];
      rows[Y] = r.join('');
    });
  };
  var build = function (W, H, parts, stamps, free, lone) {
    var rows = K.scene(W, H, parts);
    (stamps || []).forEach(function (s) { K.stamp(rows, s[0], s[1], s[2]); });
    (free || []).forEach(function (s) { put(rows, s[0], s[1], s[2]); });
    // an outline pixel with nothing coloured beside it (a thin tip) would paint
    // near-black; `lone` gives those a colour of their own
    if (lone) rows = rows.map(function (r, y) {
      return r.replace(/#/g, function (m, x) {
        var n = [r[x - 1], r[x + 1], (rows[y - 1] || '')[x], (rows[y + 1] || '')[x]];
        return n.some(function (q) { return q && q !== '.' && q !== '#'; }) ? '#' : lone;
      });
    });
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  };
  // stamp rows written with stand-in letters, swapped for real colours
  var sub = function (rows, map) { return rows.map(function (r) { return r.replace(/[a-zA-Z0-9]/g, function (c) { return map[c] || c; }); }); };
  var EYE = ['.##.', '#ww#', '#Ew#', '#EE#', '.##.'];
  var EYE_S = ['.#.', '#Ew', '#EE', '.#.'];
  var EYE_L = ['.###.', '#www#', '#Eww#', '#EEw#', '#EEE#', '.###.'];
  var SHUT = ['....', '#..#', '.##.'];
  var tri = function (ax, ay, bx, by, cx, cy) {
    return function (x, y) {
      var s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by), s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy), s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
      return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
    };
  };
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
  var turned = function (f, px, py, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return function (x, y) { var dx = x - px, dy = y - py; return f(px + dx * c + dy * s, py - dx * s + dy * c); };
  };
  // a star of n points, tips R out and valleys r, its first tip at angle rot
  var star = function (cx, cy, R, r, rot, n) {
    n = n || 5;
    var seg = Math.PI * 2 / n;
    return function (x, y) {
      var dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
      var t = (((Math.atan2(dy, dx) - rot) % seg) + seg) % seg / seg, k = Math.abs(t - 0.5) * 2;
      return d <= r + (R - r) * k * k;
    };
  };
  // a leaf or petal: from (ax, ay) out to (bx, by), w wide at its widest
  var leaf = function (ax, ay, bx, by, w, saw) {
    var dx = bx - ax, dy = by - ay, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    return function (x, y) {
      var px = x - ax, py = y - ay, t = (px * ux + py * uy) / L, d = Math.abs(-px * uy + py * ux);
      if (t < 0 || t > 1) return false;
      var wid = w * Math.sin(Math.PI * Math.pow(t, 0.7)) * (saw ? 0.72 + 0.28 * Math.abs(Math.sin(t * saw * Math.PI)) : 1);
      return d <= wid;
    };
  };
  /* a tube through points [x, y, r], its radius easing from one to the
     next; grow(x, y) adds to the radius (tufts), or takes from it */
  var tube = function (pts, grow) {
    return function (x, y) {
      var g = grow ? grow(x, y) : 0;
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
        var t = L ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)) : 0;
        var px = a[0] + t * dx - x, py = a[1] + t * dy - y, r = a[2] + (b[2] - a[2]) * t + g;
        if (r > 0 && px * px + py * py <= r * r) return true;
      }
      return false;
    };
  };
  // which side of a leaf's midrib a point is: >0 on its left
  var side = function (ax, ay, bx, by) { return function (x, y) { return (bx - ax) * (y + 0.5 - ay) - (by - ay) * (x + 0.5 - ax); }; };
  // little lights: a four-point twinkle
  var TWINKLE = ['.F.', 'FwF', '.F.'];

  /* ==========================================================================
     BONNIE'S OWN — drawn by Bonnie, lit by us.
     ========================================================================== */

  /* The squirrel (New York): a round head with beady eyes and two buck
     teeth, a big curly bushy tail, a cream front. He throws nuts: the
     third frame has a paw raised behind his head with an acorn in it. */
  var BEAD = ['.EE.', 'EwEE', 'EEEE', '.EE.'];
  var squirrel = function (f, thr) {
    var k = f ? 1.2 : -1.2, sw = thr ? -1.4 : f ? 0.5 : 0;
    // the tail: one big bushy plume rising behind him, its top curling forward,
    // tufty all round, with a paler fringe and the curl picked out in shadow
    var path = [[16, 23, 3], [20.4, 19.6, 4.4], [23 - sw, 14.4, 5.2], [22.8 - sw, 8.6, 5], [20 - sw, 4.6, 4.2], [16.6 - sw, 4, 3], [15.4 - sw, 6.6, 1.8]];
    var curl = [[21 - sw, 12, 0.6], [20.6 - sw, 8.4, 0.6], [18.6 - sw, 6.6, 0.55], [17.6 - sw, 7.4, 0.5]];
    var tuft = function (x, y) { return 0.7 * Math.max(0, Math.sin((x * 0.8 - y * 1.3) * 1.4)); };
    var parts = [
      P(RUSS[3], tube(path, tuft), function (x, y) { return orb(19, 9, 9, 14, RUSS.slice(1) + FAWN[3])(x, y); }, RUSS[0]),
      P(RUSS[2], tube(path, function () { return -1.2; }), function (x, y) {
        if (tube(curl)(x + 0.5, y + 0.5)) return RUSS[0];
        return orb(18.4, 8, 8, 14, RUSS)(x, y);
      })
    ];
    parts.push(
      // the far ear, behind the head
      P(RUSS[1], turned(ell(13.4, 4.4, 1.9, 3.2), 13.4, 4.4, -0.35), orb(13, 3, 3, 4, RUSS), RUSS[0]),
      // feet, then a big back haunch, then the body
      P(RUSS[1], or(ell(8.4 + k, 25, 2.8, 1.3), ell(15.4 - k, 25, 3, 1.3)), orb(12, 24, 8, 3, RUSS), RUSS[0]),
      O(12, 18.6, 5.8, 6.2, RUSS, RUSS[0]),
      O(14.6, 21.4, 4, 3.6, RUSS, RUSS[0]),
      P(FAWN[2], ell(9.8, 19.6, 3.2, 4.6), orb(9, 18, 4, 6, FAWN), FAWN[1])
    );
    if (thr) {
      // the near arm up behind his head, an acorn held high
      parts.push(
        P(RUSS[2], limb([[12, 15.6], [16, 11.4], [16.2, 6.4]], 1.4), orb(15, 10, 3, 6, RUSS), RUSS[0]),
        P(NUT[2], or(ell(16.2, 4.4, 2.6, 2.4), tri(13.8, 5, 18.6, 5, 16.2, 7.6)), orb(15.6, 3.8, 2.8, 2.8, NUT), NUT[0]),
        P(WOOD[2], function (x, y) { return ell(16.2, 3, 3, 2)(x, y) && y < 3.8; }, function (x, y) { return (x + y) % 2 ? 'T' : 'U'; }, 'S'),
        P('T', cap(16.6, 1.2, 17.6, 0.2, 0.6))
      );
    } else {
      // little paws held at the chest
      parts.push(P(RUSS[2], cap(9.6, 16.4, 6.4, 18.4, 1.25), orb(8, 16, 3, 3, RUSS), RUSS[0]));
    }
    parts.push(
      O(8.6, 10.2, 6.3, 5.8, RUSS, RUSS[0]),
      // the near ear, with a tuft
      P(RUSS[2], or(turned(ell(9.6, 4, 2.2, 3.4), 9.6, 4, -0.2), cap(9.2, 1.4, 8.6, 0, 0.7)), function (x, y) { return ell(9.8, 4.4, 1, 2)(x + 0.5, y + 0.5) ? '3' : orb(9, 3, 3, 4, RUSS)(x, y); }, RUSS[0]),
      P(FAWN[2], ell(5.2, 12.6, 3.4, 2.6), orb(4.6, 12, 3.6, 3, FAWN), FAWN[1]),
      P('3', ell(2.2, 11.2, 1.2, 1))
    );
    var st = [[5, 7, BEAD], [3, 14, ['ww', 'ww']], [1, 13, ['#.', '.#']], [10, 13, ['3']]];
    if (thr) st.push([4, 6, ['####']]);
    return build(26, 26, parts, st);
  };
  E.squirrel = [squirrel(0), squirrel(1), squirrel(0, true)];

  // the nut he throws: an acorn with a criss-cross cap and a stalk
  E.nut = build(10, 10, [
    P(NUT[2], or(ell(5, 6, 3.7, 3.4), tri(2.2, 7, 7.8, 7, 5, 9.8)), orb(4.4, 5.6, 3.8, 4, NUT), NUT[0]),
    P('U', function (x, y) { return ell(5, 4.2, 4.5, 2.8)(x, y) && y < 5.2; }, function (x, y) { return (x + y) % 3 === 0 ? 'S' : orb(4, 2.6, 4.6, 2.8, WOOD)(x, y); }, 'S'),
    P('T', cap(5.4, 2, 6.8, 0.4, 0.75))
  ], [[3, 6, ['o']]]);

  /* The chocolate bar (Chocolate Land): a bar of milk chocolate, no
     wrapper, two squares wide and four tall exactly as Bonnie drew it,
     every square a raised block lit on its top-left bevel. His eyes are
     in the top two squares. Stomped, it snaps in two and lies flat, eyes
     gone to little crosses — with its legs in the air. */
  var cells = function (x0, y0, cw, rows, t, light) {
    // a texture for a grid of raised squares: grooves dark, bevels lit top-left
    return function (x, y) {
      var X = x + 0.5 - x0, Y = y + 0.5 - y0, ci = Math.floor(X / cw), ri = 0;
      while (ri < rows.length - 2 && Y >= rows[ri + 1] - y0) ri++;
      var u = X - ci * cw, v = Y - (rows[ri] - y0), ch = rows[ri + 1] - rows[ri];
      var base = light(x, y);
      if ((u < 1 && ci > 0) || (v < 1 && ri > 0)) return t[0];
      if (u < 2.2 || v < 2.2) return step(t, base, 1);
      if (u > cw - 1.6 || v > ch - 1.6) return step(t, base, -1);
      if (u < 3.4 && v < 3.4) return step(t, base, 2);
      return base;
    };
  };
  var choc = function (f) {
    var k = f ? 1.4 : -1.4, ROWS = [1, 9, 15, 21, 27];
    return build(22, 34, [
      P(DARK[2], or(cap(7.4, 26, 7.4 + k, 31.6, 1.5), cap(14.6, 26, 14.6 - k, 31.6, 1.5)), orb(9, 28, 8, 6, DARK), DARK[0]),
      P(DARK[1], or(ell(6.4 + k, 32.6, 2.6, 1.3), ell(13.6 - k, 32.6, 2.6, 1.3)), orb(9, 31, 8, 3, DARK), DARK[0]),
      P(CHOC[2], rrect(2, 1, 20, 27, 1.6), cells(2, 1, 9, ROWS, CHOC, orb(7, 6, 20, 30, CHOC.slice(1) + CHOC[4])), CHOC[0])
    ], [[4, 3, EYE], [14, 3, EYE], [3, 2, ['##...']], [14, 2, ['...##']]]);
  };
  var chocBroken = (function () {
    // the top half (the face) tipped over on the left, the bottom half beside
    // it, crumbs between
    var w = 5.4, h = 4.8;
    var half = function (cx, cy, a) {
      var f = rrect(cx - w, cy - h, cx + w, cy + h, 1);
      var tex = cells(cx - w, cy - h, w, [cy - h, cy, cy + h], CHOC, orb(cx - 3, cy - 4, 14, 12, CHOC.slice(1) + CHOC[4]));
      return P(CHOC[2], turned(f, cx, cy, a), turned(tex, cx, cy, a), CHOC[0]);
    };
    // where a point of a half lands once it's tipped
    var at = function (cx, cy, a, sx, sy) { var c = Math.cos(a), s = Math.sin(a); return [Math.round(cx + c * sx - s * sy - 1.5), Math.round(cy + s * sx + c * sy - 1.5)]; };
    var L = [5.6, 28.6, -0.22], e1 = at(L[0], L[1], L[2], -2.7, -2.4), e2 = at(L[0], L[1], L[2], 2.7, -2.4);
    var X = ['Y.Y', '.Y.', 'Y.Y'];
    return build(22, 34, [
      half(16.4, 29, 0.16),
      half(L[0], L[1], L[2]),
      P(CHOC[1], or(ell(11.2, 33.2, 1, 0.8), ell(13.2, 33.4, 0.8, 0.6), ell(10.6, 23.6, 0.8, 0.7), ell(19.4, 22.4, 0.7, 0.7)))
    ], [[e1[0], e1[1], X], [e2[0], e2[1], X]]);
  })();
  E.choc = [choc(0), choc(1), chocBroken];

  /* The palm tree (Jamaica, Universal): cross. Spiky fronds for hair all
     round his face, angry brows, a ridged trunk and two little legs. */
  var palmtree = function (f) {
    var k = f ? 1.3 : -1.3, sway = f ? 0.05 : -0.05, cx = 17, cy = 14;
    var parts = [
      P(TRUNK[1], or(cap(13.6, 40, 13.6 + k, 44.4, 1.6), cap(20.4, 40, 20.4 - k, 44.4, 1.6)), orb(16, 41, 8, 5, TRUNK), TRUNK[0]),
      P(TRUNK[1], or(ell(12.4 + k, 45, 2.8, 1.2), ell(19.6 - k, 45, 2.8, 1.2)), orb(16, 44, 8, 3, TRUNK), TRUNK[0])
    ];
    // fronds behind his head, spiky like Bonnie's, drooping a little at the sides
    [-2.75, -2.25, -1.85, -1.5, -1.12, -0.72, -0.28, 0.22, 2.92].forEach(function (a, i) {
      a += sway * (i % 2 ? 1 : -1);
      var L = 16.5 - Math.abs(Math.sin(a)) * 1.5, tx = cx + Math.cos(a) * L, ty = cy + Math.sin(a) * L * 0.9 + Math.pow(Math.cos(a), 2) * 3.5;
      var s = side(cx, cy, tx, ty);
      parts.push(P(LEAF[2], leaf(cx, cy, tx, ty, 3.4, 5), function (x, y) {
        var sd = s(x, y);
        if (Math.abs(sd) < 4) return LEAF[0];
        return sd < 0 ? (y < cy - 4 ? LEAF[4] : LEAF[3]) : LEAF[2];
      }, LEAF[0]));
    });
    parts.push(
      P(TRUNK[2], function (x, y) { var hw = 3.2 + (y - 18) / 22 * 1.4; return y > 17 && y < 41 && Math.abs(x - 17) < hw; }, function (x, y) {
        var v = (y + 0.5 + Math.abs(x + 0.5 - 17) * 0.4) % 3.4;
        return v < 1 ? TRUNK[0] : v < 1.8 ? TRUNK[3] : orb(15.4, 28, 6, 16, TRUNK)(x, y);
      }, TRUNK[0]),
      O(cx, cy, 7.4, 6.8, HUSK, HUSK[0])
    );
    return build(34, 46, parts, [[11, 10, ['##..', '.###']], [17, 10, ['.###', '##..']], [11, 12, EYE], [17, 12, EYE], [13, 18, ['.####.', '#....#']]]);
  };
  E.palmtree = [palmtree(0), palmtree(1)];

  /* The butterfly (the meadow, the rainbow): front-on, wings up and down,
     sunset-orange upper wings with dark spotted edges and sky-blue lower
     ones, and a cheeky grin. */
  // a wing (drawn on the left, mirrored for the right): dark-rimmed along its
  // outer edge with white dots, its colour deepening towards the body
  var bfWing = function (shape, rx, ry, reach, t, mir) {
    var M = function (f) { return mir ? function (x, y) { return f(30 - x, y); } : f; };
    var inner = function (x, y) { return shape(rx + (x - rx) / 0.8, ry + (y - ry) / 0.8); };
    var tex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = Math.sqrt((X - rx) * (X - rx) + (Y - ry) * (Y - ry)) / reach;
      if (!inner(X, Y)) return (x * 7 + y * 5) % 6 === 0 ? 'w' : 'a';
      return d < 0.3 ? t[0] : d < 0.48 ? t[1] : d < 0.66 ? t[2] : d < 0.8 ? t[3] : t[4];
    };
    return P(t[2], M(shape), mir ? function (x, y) { return tex(29 - x, y); } : tex, 'a');
  };
  var butterfly = function (up) {
    var UP = 'kllmn', LO = SKY.slice(0, 4) + 'w';
    var U = up ? or(tri(14.4, 9, 5, 0.4, 0.8, 9), ell(5, 5.2, 4.2, 4.2)) : or(tri(14.4, 8.6, 0.4, 2.4, 3.4, 13.8), ell(5, 7.6, 4.8, 4.8));
    var L = up ? or(tri(14.4, 11.6, 3.2, 11, 7.4, 18.6), ell(7, 14.4, 3.8, 3.6)) : or(tri(14.4, 11.6, 4.4, 13, 9.4, 22), ell(8.4, 17, 4.2, 4.4));
    var parts = [
      bfWing(L, 14.4, 11.6, 11, LO), bfWing(L, 14.4, 11.6, 11, LO, true),
      bfWing(U, 14.4, 9, 14, UP), bfWing(U, 14.4, 9, 14, UP, true),
      P('b', cap(15, 8.4, 15, 17.4, 1.8), function (x, y) { return Math.floor(y) % 2 ? orb(14, 12, 3, 8, PURP)(x, y) : 'a'; }, 'a'),
      P('a', or(limb([[13.4, 3.2], [11.6, 0.8]], 0.5), limb([[16.6, 3.2], [18.4, 0.8]], 0.5))),
      P('d', or(ell(11.2, 0.9, 1.1, 1), ell(18.8, 0.9, 1.1, 1))),
      O(15, 6.6, 4.9, 4.3, 'bcdee', 'a')
    ];
    return build(30, 24, parts, [[10, 4, EYE], [15, 4, EYE], [13, 9, ['#..#', '.##.']], [10, 9, ['3']], [19, 9, ['3']]]);
  };
  E.butterfly = [butterfly(true), butterfly(false)];

  /* The Christmas tree (New York): three snowy tiers, a gold star, baubles,
     two eyes and — as Bonnie drew it — a big round nose. Stubby trunk legs. */
  var xmastree = function (f) {
    var k = f ? 1.2 : -1.2, cx = 15;
    // one cone stepped into three drooping tiers, like Bonnie's: [top, bottom, width at top, width at bottom]
    var T = [[3, 13.4, 0, 7.6], [10.6, 24, 4.4, 11.6], [19.6, 34.4, 7.2, 14.2]];
    var wid = function (i, y) { var t = T[i]; return y < t[0] || y > t[1] ? -1 : t[2] + (y - t[0]) / (t[1] - t[0]) * (t[3] - t[2]); };
    var droop = function (x) { return (1 - Math.abs(Math.sin((x - cx) * Math.PI / 5))) * 2; };
    var inTier = function (i, x, y) { return Math.abs(x - cx) <= wid(i, y) && y <= T[i][1] - droop(x); };
    var tree = function (x, y) { return inTier(0, x, y) || inTier(1, x, y) || inTier(2, x, y); };
    var tex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, i = inTier(0, X, Y) ? 0 : inTier(1, X, Y) ? 1 : 2, d = Math.abs(X - cx);
      var below = i < 2 ? wid(i + 1, Y) : 99, edge = T[i][1] - droop(X) - Y;
      // snow on the branch tips that hang out over the tier below, a shadow under them
      if (edge < 1.7 && d > below - 1.2) return edge < 0.9 ? 'w' : 'R';
      if (edge < 2.4 && d > below - 3.4 && i < 2) return PINE[1];
      if ((x * 3 + y * 5) % 7 === 0) return PINE[1];
      return X < cx - 2 - (Y - T[i][0]) * 0.2 ? PINE[3] : X < cx + 4 ? PINE[2] : PINE[1];
    };
    var bauble = function (bx, by, t) { return P(t[2], ell(bx, by, 1.7, 1.7), orb(bx, by, 1.7, 1.7, t.slice(0, 3) + t[4] + 'w'), t[0]); };
    return build(30, 42, [
      P('T', or(rrect(10.4 + k * 0.4, 33, 13.6 + k * 0.4, 40, 1), rrect(16.4 - k * 0.4, 33, 19.6 - k * 0.4, 40, 1)), orb(13, 35, 6, 6, WOOD), 'S'),
      P('S', or(ell(11 + k, 40.6, 2.6, 1.2), ell(18.4 - k, 40.6, 2.6, 1.2)), orb(14, 40, 8, 2, WOOD), 'S'),
      P(PINE[2], tree, tex, PINE[0]),
      bauble(5, 30, RED), bauble(14.6, 31.4, GOLD), bauble(24.4, 30, SKY), bauble(22.6, 20.4, RED), bauble(6.8, 20.6, GOLD), bauble(19.6, 27, SKY), bauble(9.4, 27.4, RED),
      // Bonnie's big round nose
      O(13.4, 19.8, 3.1, 2.8, 'fghij', 'f'),
      P('C', star(cx, 3.4, 3.8, 1.6, -Math.PI / 2), orb(14, 2.4, 4, 4, GOLD), 'A')
    ], [[9, 13, EYE], [15, 13, EYE], [8, 12, ['##.']], [17, 12, ['.##']], [10, 23, ['#.....#', '.#####.']], [12, 18, ['ww']]]);
  };
  E.xmastree = [xmastree(0), xmastree(1)];

  /* The building (New York): a little block of flats of red brick, its
     left side taller, as Bonnie drew it; lit windows, two big eyes, a
     front door with a wreath, snow on its ledges and a wooden water tower
     on the roof (they all have one in New York). Little legs. */
  var building = function (f) {
    var k = f ? 1.2 : -1.2;
    var body = or(rrect(1.6, 1.6, 13.4, 36.4, 0.6), rrect(1.6, 11, 24.4, 36.4, 0.6));
    var win = function (x0, y0) { return rrect(x0, y0, x0 + 3.6, y0 + 4, 0.4); };
    var wins = [win(3.6, 4.4), win(8.6, 4.4), win(3.6, 13.6), win(8.6, 13.6), win(15, 13.6), win(20, 13.6)];
    return build(26, 42, [
      P('g', or(cap(8.4, 36, 8.4 + k, 40, 1.5), cap(17.6, 36, 17.6 - k, 40, 1.5)), orb(12, 37, 10, 4, INK), 'f'),
      P('g', or(ell(7.6 + k, 40.8, 2.6, 1.2), ell(16.8 - k, 40.8, 2.6, 1.2)), orb(12, 40, 10, 2, INK), 'f'),
      // the water tower: a barrel on stilts with a pointed cap
      P('T', or(cap(16.6, 7, 16.6, 11, 0.5), cap(22.4, 7, 22.4, 11, 0.5))),
      P('U', rrect(15.6, 3.6, 23.4, 8.6, 1), function (x, y) { return y % 2 ? orb(17, 4, 8, 6, WOOD)(x, y) : 'T'; }, 'S'),
      P('U', tri(14.8, 4, 24.2, 4, 19.5, 0.2), orb(17, 1, 8, 5, WOOD), 'S'),
      P(BRICK[2], body, function (x, y) {
        var row = Math.floor(y / 2.5), off = row % 2 ? 2 : 0;
        if (y % 2.5 < 0.6) return BRICK[1];
        if ((x + off) % 4 === 0) return BRICK[1];
        return orb(7, 8, 24, 34, BRICK)(x, y);
      }, BRICK[0]),
      P(STONE[2], or(rrect(0.6, 1, 14.4, 3, 0.6), rrect(0.6, 10.4, 25.4, 12.4, 0.6)), function (x, y) { return y < 1.6 || (y > 10 && y < 11) ? 'w' : orb(6, 1, 20, 10, STONE)(x, y); }, STONE[0]),
      P(STONE[2], or.apply(null, wins.map(function (w, i) { return function (x, y) { return w(x, y); }; })), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, lx = (X - 3.6) % 5, ly = Y < 9 ? Y - 4.4 : Y - 13.6;
        if (lx < 0.9 || ly < 0.9 || ly > 3.2 || lx > 2.8 && lx < 3.6 || X > 14 && ((X - 15) % 5 < 0.9 || (X - 15) % 5 > 2.8)) return STONE[3];
        return ly < 1.8 ? 'D' : 'C';
      }, STONE[0]),
      // the eyes: two big round ones in the middle of the building
      P('w', or(ell(7.8, 22.2, 4, 4.3), ell(17.8, 22.2, 4, 4.3)), function (x, y) { return y > 24.6 ? 'W' : 'w'; }, 'E'),
      P('E', or(ell(6.6, 22.6, 1.5, 1.9), ell(16.6, 22.6, 1.5, 1.9))),
      // the front door, arched, with a wreath, on a stone step
      P(STONE[2], rrect(8.6, 35, 17.4, 37, 0.5), orb(10, 35, 8, 3, STONE), STONE[0]),
      P('T', function (x, y) { return rrect(10, 28, 16, 35.4, 0.4)(x, y) && (y > 30 || ell(13, 30, 3, 2.6)(x, y)); }, function (x, y) { return Math.floor(x + 0.5) === 13 ? 'S' : orb(11, 29, 6, 7, WOOD)(x, y); }, 'S'),
      P('<', ell(13, 30.6, 1.8, 1.8), function (x, y) { return ell(13, 30.6, 0.8, 0.8)(x + 0.5, y + 0.5) ? 'T' : orb(12.4, 30, 2, 2, LEAF)(x, y); }, '(')
    ], [[6, 21, ['w']], [16, 21, ['w']], [12, 31, ['x']], [14, 29, ['x']], [11, 33, ['.C..C']]], [
      // snow along the roofs and the ledge
      [0, 0, ['.RRRwwwwRRRRR.']], [14, 9, ['.RRwwwRRRRw.']], [0, 9, ['RR']]
    ]);
  };
  E.building = [building(0), building(1)];

  /* The polar bear (Antarctica): big, fluffy and cream-white, a black
     nose, walking on all fours. Two stomps: the first sits him down,
     dizzy, eyes swirling, little stars going round. */
  var fluff = function (cx, cy, rx, ry, n, amp) {
    return function (x, y) {
      var dx = (x - cx) / rx, dy = (y - cy) / ry, a = Math.atan2(dy, dx);
      return dx * dx + dy * dy <= Math.pow(1 + amp * Math.max(0, Math.sin(a * n)), 2);
    };
  };
  var bearWalk = function (f) {
    var k = f ? 1.6 : -1.6;
    var leg = function (x, dx, near) {
      var t = near ? POLAR : POLAR[0] + POLAR.slice(0, 4);
      return [P(t[2], cap(x, 18, x + dx, 26.4, 3), orb(x - 1, 20, 5, 9, t), POLAR[0]), P(t[2], ell(x + dx - 0.6, 27.6, 3.8, 2), orb(x + dx - 1, 27, 4, 2.4, t), POLAR[0])];
    };
    var parts = [].concat(leg(17, -k, false), leg(36, k, false), [
      P(POLAR[2], fluff(27, 15, 16.4, 10.2, 11, 0.04), orb(23, 11, 18, 12, POLAR), POLAR[0]),
      O(43, 12, 2, 2, POLAR, POLAR[0])
    ], leg(13, k, true), leg(32, -k, true), [
      P(POLAR[2], or(ell(9.6, 6.6, 2.4, 2.4), ell(14.6, 6.2, 2.4, 2.4)), orb(11, 5, 6, 3, POLAR), POLAR[0]),
      O(10.6, 12.6, 8.4, 7.4, POLAR, POLAR[0]),
      P(POLAR[3], ell(4.8, 15.4, 4.8, 3.6), orb(4, 14.4, 5, 4, POLAR), POLAR[0]),
      P('g', ell(1.8, 13.6, 2, 1.5), orb(1.4, 13.2, 2.2, 1.7, INK), 'f')
    ]);
    return build(46, 30, parts, [[6, 9, ['.EE.', 'EwEE', '.EE.']], [9, 5, ['3']], [14, 5, ['3']], [3, 17, ['#...', '.###']], [11, 13, ['3']]]);
  };
  var bearStun = (function () {
    var STAR = ['..C..', '.CDC.', 'CDFDC', '.CDC.', '..C..'];
    var parts = [
      // sat on his bottom: a round body, arms hanging, back feet out in front, pads up
      P(POLAR[2], fluff(23, 20.4, 10.6, 9.2, 9, 0.05), orb(20, 15, 13, 13, POLAR), POLAR[0]),
      P(POLAR[3], ell(23, 22.4, 6, 5.6), orb(21, 20, 7, 7, POLAR), POLAR[1]),
      P(POLAR[2], or(cap(15, 15, 13.4, 22.4, 2.5), cap(31, 15, 32.6, 22.4, 2.5)), orb(18, 15, 16, 9, POLAR), POLAR[0]),
      P(POLAR[2], or(ell(14.6, 26.2, 4.8, 3.2), ell(31.4, 26.2, 4.8, 3.2)), orb(20, 23, 16, 6, POLAR), POLAR[0]),
      P('h', or(ell(13.8, 26.6, 2.2, 1.9), ell(32.2, 26.6, 2.2, 1.9)), function (x, y) { return y < 25.6 ? 'i' : 'h'; }),
      P(POLAR[2], or(ell(17.6, 3.8, 2.4, 2.4), ell(28.4, 3.8, 2.4, 2.4)), orb(22, 2, 10, 3, POLAR), POLAR[0]),
      O(23, 9.8, 7.8, 6.8, POLAR, POLAR[0]),
      P(POLAR[3], ell(23, 12.8, 3.8, 2.8), orb(22, 11.4, 4.2, 3.2, POLAR), POLAR[1]),
      P('g', ell(23, 11.2, 1.6, 1.1), orb(22.6, 10.8, 1.8, 1.2, INK), 'f')
    ];
    // boggled: one pupil rolled up, the other down
    var up = ['.##.', '#wE#', '#wE#', '#ww#', '.##.'], down = ['.##.', '#ww#', '#Ew#', '#Ew#', '.##.'];
    return build(46, 30, parts, [[17, 5, up], [25, 5, down], [22, 13, ['.#.', '#3#', '.#.']], [17, 3, ['3']], [28, 3, ['3']], [12, 25, ['..j..', 'j.j.j']], [30, 25, ['j.j.j']]], [
      [7, 1, STAR], [35, 0, STAR], [39, 8, TWINKLE], [4, 10, TWINKLE]
    ]);
  })();
  E.polarbear = { walk: [bearWalk(0), bearWalk(1)], stun: bearStun };

  /* ==========================================================================
     POKÉMON MEADOW — Bonnie's buddy Pikachu, the wild ones he can catch
     (touch one and a Poké Ball wobbles, click), and two to dodge. Drawn
     faithfully, but round and lit like everyone else here.
     ========================================================================== */
  var PEYE = ['.EE.', 'EwEE', 'EEEE', '.EE.'];          // Pikachu's shiny black eyes
  var HAPPY = ['.##.', '#..#'];
  // a lightning-bolt tail from its brown root at (x, y), growing out behind
  var boltTail = function (x, y, up) {
    var pts = [[x, y, 0.9], [x + 3.6, y - 3.2 * up, 1.4], [x + 2, y - 5 * up, 1.6], [x + 6.4, y - 9.4 * up, 2.6]];
    return [
      P(PIKA[2], tube(pts), function (xx, yy) { return Math.abs(xx + 0.5 - x) + Math.abs(yy + 0.5 - y) < 3 ? 'T' : orb(x + 2, y - 7 * up, 6, 7, PIKA)(xx, yy); }, PIKA[0])
    ];
  };
  var pikachu = function (pose) {
    var run = pose === 'r0' || pose === 'r1', jump = pose === 'jump', cheer = pose === 'cheer';
    var by = jump ? -2 : pose === 'r1' ? -1 : 0, lean = run ? -0.8 : 0;
    var hx = 9.4 + lean, hy = 9.2 + by;
    var earA = run ? 0.45 : jump ? -0.1 : 0;
    var ear = function (bx, bty, tx, ty) {
      var c = Math.cos(earA), sn = Math.sin(earA), dx = tx - bx, dy = ty - bty;
      var ex = bx + dx * c - dy * sn, ey = bty + dx * sn + dy * c, f = tube([[bx, bty, 2], [ex, ey, 0.5]]);
      return P(PIKA[2], f, function (x, y) {
        var t = ((x + 0.5 - bx) * (ex - bx) + (y + 0.5 - bty) * (ey - bty)) / ((ex - bx) * (ex - bx) + (ey - bty) * (ey - bty));
        return t > 0.62 ? 'g' : orb(bx - 1, bty - 2, 4, 6, PIKA)(x, y);
      }, PIKA[0]);
    };
    var feet = jump ? [[8.4, 20.6], [13.6, 21]] : pose === 'r0' ? [[5.6, 22.6], [16.4, 21.4]] : pose === 'r1' ? [[9.6, 22.4], [12.6, 22.4]] : [[8, 22.8], [14, 22.8]];
    var arms = cheer || jump ? [[7.4, 15 + by, 4.4, 10.6 + by], [14.6, 15 + by, 17.4, 10.6 + by]] : run ? [[8, 16 + by, 4.6, 17.4 + by], [14, 15.6 + by, 16.6, 13.6 + by]] : [[8, 15.6 + by, 5.6, 17 + by], [13.6, 15.6 + by, 15.6, 17.2 + by]];
    var parts = boltTail(15.6, 19 + by, 1).concat([
      ear(12.6, 5.2 + by, 17, 0.6 + by * 0.5),
      P(PIKA[2], or(ell(feet[0][0], feet[0][1], 2.4, 1.3), ell(feet[1][0], feet[1][1], 2.4, 1.3)), orb(10, 21, 8, 3, PIKA), PIKA[0]),
      P(PIKA[2], cap(14.2, 15.6 + by, arms[1][2], arms[1][3], 1.1), orb(15, 14, 4, 4, PIKA), PIKA[0]),
      P(PIKA[2], ell(11.2 + lean * 0.5, 17.6 + by, 5.2, 5.4), function (x, y) {
        // two brown stripes across his back
        if (x > 13 + lean && (Math.abs(y - 14 - by) < 0.8 || Math.abs(y - 16.4 - by) < 0.8)) return 'T';
        return orb(9, 15 + by, 7, 7, PIKA)(x, y);
      }, PIKA[0]),
      P(PIKA[2], cap(8.4, 15.6 + by, arms[0][2], arms[0][3], 1.1), orb(7, 15, 4, 4, PIKA), PIKA[0]),
      ear(6.8, 5.6 + by, 2.4, 0.4 + by * 0.5),
      O(hx, hy, 6.4, 5.6, PIKA, PIKA[0]),
      P('x', or(ell(hx - 4.8, hy + 2.6, 1.6, 1.5), ell(hx + 4.4, hy + 2.2, 1.4, 1.5)), orb(hx, hy + 1, 7, 3, RED), 'u')
    ]);
    var ey = Math.round(hy - 2.6), ex = Math.round(hx - 5);
    var st = [];
    if (cheer) st.push([ex, ey + 1, HAPPY], [ex + 5, ey + 1, HAPPY], [ex + 2, ey + 4, ['#..#', '#33#', '.##.']]);
    else st.push([ex, ey, PEYE], [ex + 5, ey, PEYE], [ex + 3, ey + 4, ['#.#', '.#.']]);
    var sparks = cheer ? [[0, 12, ['D.', '.D', 'D.']], [21, 12, ['.D', 'D.', '.D']]] : [];
    return build(24, 24, parts, st, sparks);
  };
  E.pikachu = { idle: pikachu('idle'), run: [pikachu('r0'), pikachu('r1')], jump: pikachu('jump'), cheer: pikachu('cheer') };

  // the wild ones each hop: frame two is a little up, a little stretched
  var hop = function (draw) { return [draw(0), draw(1)]; };

  /* Bulbasaur: teal and spotty, a big wide grin, red eyes, the bulb on his back */
  var BULB_EYE = ['.##.', '#xw#', '#vx#', '.##.'];
  E.bulbasaur = hop(function (f) {
    var by = f ? -1.6 : 0, k = f ? 1 : 0;
    var spots = function (x, y) { return ell(4.6, 9.6 + by, 1.2, 1)(x + 0.5, y + 0.5) || ell(9.4, 8.8 + by, 1, 0.9)(x + 0.5, y + 0.5) || ell(14.4, 17 + by, 1.4, 1.1)(x + 0.5, y + 0.5) || ell(18.6, 15.6 + by, 1, 0.9)(x + 0.5, y + 0.5); };
    var leg = function (x, far) { return P(BULB[far ? 1 : 2], rrect(x - 1.8, 17 + by, x + 1.8, 23.4 - (far ? 0.4 : 0) + k * 0.4, 1.2), orb(x - 1, 18, 3, 5, far ? BULB[0] + BULB.slice(0, 4) : BULB), BULB[0]); };
    return build(24, 24, [
      leg(10.4, true), leg(19.6, true),
      O(15, 9.4 + by, 6.4, 5.8, '[]{}~', '['),
      P(BULB[2], ell(13.4, 16.4 + by, 8, 4.8), function (x, y) { return spots(x, y) ? BULB[1] : orb(11, 13 + by, 10, 7, BULB)(x, y); }, BULB[0]),
      P('{', or(cap(15, 3.8 + by, 13.6, 9 + by, 0.5), cap(17.6, 5 + by, 17, 11 + by, 0.5)), null, '['),
      leg(7.4), leg(16.4),
      P(BULB[2], ell(7, 12.4 + by, 6.6, 5.2), function (x, y) { return spots(x, y) ? BULB[1] : orb(5, 10 + by, 8, 7, BULB)(x, y); }, BULB[0]),
      P(BULB[2], or(tri(2.6, 8.6 + by, 3.6, 5 + by, 6.2, 7.6 + by), tri(9.6, 7.6 + by, 11.4, 4.8 + by, 12.4, 8.6 + by)), orb(6, 6 + by, 8, 4, BULB), BULB[0])
    ], [[2, Math.round(9 + by), BULB_EYE], [7, Math.round(9 + by), BULB_EYE], [2, Math.round(14 + by), ['#.....#', '.#333#.', '..###..']], [16, Math.round(5 + by), ['.}', '}.']]]);
  });

  /* Charmander: orange, a cream tummy, a happy grin and a flame on his tail */
  E.charmander = hop(function (f) {
    var by = f ? -1.6 : 0;
    var flame = function (x, y) { return f ? or(ell(x, y, 2.6, 2.6), tri(x - 2.2, y - 0.6, x + 1.6, y - 1, x + 1.4, y - 6.4)) : or(ell(x, y, 2.4, 2.6), tri(x - 2, y - 0.6, x + 2, y - 0.6, x - 0.8, y - 6.6)); };
    var fx = 20.4, fy = 8 + by;
    return build(24, 24, [
      P('l', tube([[14, 19 + by, 1.8], [18.4, 17.6 + by, 1.6], [20.4, 13.6 + by, 1.3], [fx, 10.6 + by, 1.1]]), orb(17, 15 + by, 5, 6, FOX), 'k'),
      P('6', function (x, y) { return flame(fx, fy)(x, y); }, function (x, y) { return ell(fx, fy + 0.8, 1.2, 1.4)(x + 0.5, y + 0.5) ? '8' : ell(fx, fy, 2, 2.4)(x + 0.5, y + 0.5) ? '7' : '6'; }, '5'),
      P('l', or(cap(9, 20 + by, 8.6, 22.4 + by * 0.5, 1.6), cap(13.6, 20 + by, 14, 22.4 + by * 0.5, 1.6)), orb(10, 21, 8, 3, FOX), 'k'),
      P('l', or(ell(8.4, 22.8 + by * 0.5, 2.6, 1.3), ell(14.2, 22.8 + by * 0.5, 2.6, 1.3)), orb(10, 21, 8, 3, FOX), 'k'),
      P('m', ell(11.4, 17 + by, 5, 5.4), orb(9.4, 14 + by, 7, 7, 'klmnn'), 'k'),
      P('Y', ell(10, 18 + by, 3, 3.6), orb(9, 16 + by, 4, 4, 'ZZYYw'), 'Z'),
      P('m', or(cap(8.6, 15.4 + by, 5.6, 16.6 + by, 1.1), cap(14, 15.4 + by, 16.4, 16 + by, 1.1)), orb(10, 14 + by, 8, 4, FOX), 'k'),
      O(9.2, 8.6 + by, 6.4, 5.8, 'klmnn', 'k')
    ], [[4, Math.round(5 + by), EYE], [9, Math.round(5 + by), EYE], [4, Math.round(11 + by), ['#.....#', '.#333#.', '..###..']], [3, Math.round(10 + by), ['#.']]]);
  });

  /* Squirtle: sky-blue, a brown shell with a cream rim, a cream front
     plate, a curly tail */
  E.squirtle = hop(function (f) {
    var by = f ? -1.6 : 0;
    var curl = tube([[17.6, 19.6 + by, 1.8], [21, 19 + by, 1.9], [22.2, 16.4 + by, 1.6], [20.6, 14.6 + by, 1.2], [19.2, 15.8 + by, 0.9]]);
    return build(24, 24, [
      P(SQRT[2], curl, orb(19, 16 + by, 5, 5, SQRT), SQRT[0]),
      P('U', ell(14.4, 15.4 + by, 5.6, 6.4), function (x, y) {
        if (!ell(14.4, 15.4 + by, 4.4, 5.2)(x + 0.5, y + 0.5)) return orb(13, 13 + by, 7, 8, 'ZZYYw')(x, y);
        return (Math.abs(y + 0.5 - 15 - by) < 0.5 || Math.abs(x + 0.5 - 15.6) < 0.5) ? 'T' : orb(13, 13 + by, 6, 7, WOOD)(x, y);
      }, 'S'),
      P(SQRT[2], or(cap(9, 20 + by, 8.6, 22.4 + by * 0.5, 1.6), cap(13.4, 20 + by, 13.6, 22.4 + by * 0.5, 1.6), ell(8.4, 22.8 + by * 0.5, 2.6, 1.3), ell(13.8, 22.8 + by * 0.5, 2.6, 1.3)), orb(10, 21, 8, 3, SQRT), SQRT[0]),
      P('Y', ell(9.6, 17.2 + by, 3.6, 4.6), function (x, y) { return (Math.floor(y - by) % 3 === 0) ? 'Z' : orb(8.6, 15 + by, 4, 5, 'ZZYYw')(x, y); }, 'V'),
      P(SQRT[2], or(cap(8, 14.6 + by, 5.4, 16.6 + by, 1.2), cap(13.4, 14.4 + by, 13.6, 17.4 + by, 1.2)), orb(9, 14 + by, 7, 4, SQRT), SQRT[0]),
      O(8.6, 8.4 + by, 6.2, 5.6, SQRT, SQRT[0])
    ], [[4, Math.round(5 + by), ['.##.', '#ww#', '#Tw#', '#TT#', '.##.']], [9, Math.round(5 + by), ['.##.', '#ww#', '#Tw#', '#TT#', '.##.']], [4, Math.round(11 + by), ['#....#', '.####.']]]);
  });

  /* Jigglypuff: a round pink puff, huge sea-green eyes, a curl on top */
  var JEYE = ['.###.', '#www#', '#=ww#', '#==w#', '#===#', '.###.'];
  E.jigglypuff = hop(function (f) {
    var sq = f ? 0.92 : 1, st = f ? 1.06 : 1, by = f ? -1.4 : 0, cy = 14.4 + by;
    return build(24, 24, [
      P(JIGG[2], or(ell(8.4, 22.8 + (f ? -0.8 : 0), 2.4, 1.2), ell(15.6, 22.8 + (f ? -0.8 : 0), 2.4, 1.2)), orb(11, 21, 8, 3, JIGG), JIGG[0]),
      P(JIGG[2], or(tri(3, cy - 3.6, 5.4, cy - 10 * st, 9, cy - 6.4), tri(15, cy - 6.4, 18.6, cy - 10 * st, 21, cy - 3.6)), function (x, y) {
        return (tri(5.2, cy - 5.4, 5.8, cy - 7.8 * st, 7.4, cy - 6.6)(x + 0.5, y + 0.5) || tri(16.6, cy - 6.6, 18.2, cy - 7.8 * st, 18.8, cy - 5.4)(x + 0.5, y + 0.5)) ? JIGG[0] : orb(11, cy - 8, 10, 4, JIGG)(x, y);
      }, JIGG[0]),
      P(JIGG[2], ell(12, cy, 9.4 / sq, 8.4 * st), orb(10, cy - 2.4, 9.4 / sq, 8.4 * st, JIGG), JIGG[0]),
      P(JIGG[2], or(ell(2.8, cy + 2, 1.6, 1.4), ell(21.2, cy + 2, 1.6, 1.4)), orb(11, cy, 11, 4, JIGG), JIGG[0]),
      P(JIGG[3], tube([[12.4, cy - 8.8, 1.7], [9.6, cy - 8, 1.5], [8.4, cy - 5.8, 1.2], [9.8, cy - 4.4, 0.9], [11, cy - 5.4, 0.6]]), orb(9, cy - 8, 4, 4, JIGG), JIGG[1])
    ], [[4, Math.round(cy - 3), JEYE], [12, Math.round(cy - 3), JEYE], [9, Math.round(cy + 4), ['#..#', '.##.']], [3, Math.round(cy + 3), ['3']], [19, Math.round(cy + 3), ['3']]]);
  });

  /* Eevee: brown and fox-ish, a big cream ruff, tall ears, a bushy
     cream-tipped tail up behind */
  E.eevee = hop(function (f) {
    var by = f ? -1.6 : 0, k = f ? 0.8 : 0;
    var leg = function (x, far) { return P(EEV[far ? 1 : 2], cap(x, 17 + by, x - k * (far ? -1 : 1), 22.8 + by * 0.4, 1.5), orb(x - 1, 18, 3, 5, far ? EEV[0] + EEV.slice(0, 4) : EEV), EEV[0]); };
    var tail = tube([[17.6, 17 + by, 2], [20.4, 13.4 + by, 3.4], [20.6, 8.6 + by, 3.4], [18.4, 5.4 + by, 2.2]]);
    return build(24, 24, [
      P(EEV[2], tail, function (x, y) { return y < 9.6 + by ? orb(18, 5 + by, 5, 5, 'ZZYYw')(x, y) : orb(18, 10 + by, 6, 8, EEV)(x, y); }, EEV[0]),
      leg(10.6, true), leg(17.6, true),
      P(EEV[2], ell(14, 16.4 + by, 6, 3.8), orb(12, 14 + by, 8, 5, EEV), EEV[0]),
      leg(8.4), leg(15.6),
      P('Y', fluff(10, 13.6 + by, 4.6, 3.6, 7, 0.16), orb(9, 12 + by, 5, 4, 'ZZYYw'), 'Z'),
      P(EEV[2], or(tube([[5.2, 6 + by, 2.4], [2.6, 0.4 + by, 0.6]]), tube([[10, 5.6 + by, 2.4], [13, 0.4 + by, 0.6]])), function (x, y) {
        return (ell(4.6, 4.6 + by, 0.8, 2)(x + 0.5, y + 0.5) || ell(10.6, 4 + by, 0.8, 2)(x + 0.5, y + 0.5)) ? EEV[1] : orb(6, 3 + by, 6, 5, EEV)(x, y);
      }, EEV[0]),
      O(7.6, 9.6 + by, 6, 5, EEV, EEV[0])
    ], [[3, Math.round(7 + by), ['.SS.', 'SwwS', 'SEwS', 'SEES', '.SS.']], [9, Math.round(7 + by), ['.SS.', 'SwwS', 'SEwS', 'SEES', '.SS.']], [2, Math.round(11 + by), ['#.']], [5, Math.round(12 + by), ['S..S', '.SS.']]]);
  });

  /* Psyduck: a yellow duck with a permanent headache — blank eyes, three
     hairs, a flat cream bill, hands clutching his head */
  E.psyduck = hop(function (f) {
    var by = f ? -1.6 : 0;
    return build(24, 24, [
      P('Y', or(ell(8, 22.8 + (f ? -0.6 : 0), 3, 1.3), ell(14.4, 22.8 + (f ? -0.6 : 0), 3, 1.3)), orb(10, 21, 8, 3, 'ZZYYw'), 'V'),
      P(PSY[2], cap(14.6, 15.6 + by, 16.4, 8.6 + by, 1.3), orb(15, 11 + by, 4, 6, PSY), PSY[0]),
      P(PSY[2], ell(11.8, 17 + by, 6.2, 5.8), orb(9.6, 14 + by, 8, 8, PSY), PSY[0]),
      P('g', or(cap(10, 4.4 + by, 9.4, 0.8 + by, 0.45), cap(11, 4.4 + by, 11.6, 0.6 + by, 0.45), cap(12, 4.6 + by, 13.8, 1.4 + by, 0.45))),
      O(10.6, 9 + by, 6, 5.4, PSY, PSY[0]),
      P('Y', rrect(0.6, 9.4 + by, 7.4, 14.2 + by, 2.2), function (x, y) { return y > 12.2 + by ? 'Z' : orb(2.6, 9 + by, 6, 4, 'ZZYYw')(x, y); }, 'V'),
      P(PSY[2], cap(10.4, 16 + by, 13, 10.4 + by, 1.3), orb(11, 12 + by, 4, 6, PSY), PSY[0]),
      P(PSY[3], ell(13.2, 9.6 + by, 1.9, 1.9), orb(12.6, 9 + by, 2.2, 2.2, PSY), PSY[0])
    ], [[7, Math.round(6 + by), ['.##.', '#ww#', '#wE#', '.##.']], [12, Math.round(6 + by), ['.##.', '#ww#', '#Ew#', '.##.']]]);
  });

  /* Zubat: blue, no eyes at all, ears up, a big open mouth with two
     little fangs, purple wings, long trailing feet */
  E.zubat = [0, 1].map(function (up) {
    up = !up;
    var wy = up ? -3.4 : 2.6;
    var wing = function (sx, dir) {
      var tip = [sx + dir * 13, 6 + wy], fs = [];
      var f = function (x, y) {
        var u = (x - sx) * dir, v = y - 6;
        if (u < 0 || u > 13) return false;
        var topE = wy * (u / 13) - 1.4 - Math.sin(u / 13 * Math.PI) * 2.2, bot = topE + 2 + 6.4 * Math.sin(u / 13 * Math.PI) * (1 - u / 18);
        // scalloped trailing edge
        bot -= Math.abs(Math.sin(u * 0.75)) * 1.6;
        return v > topE && v < bot;
      };
      return P(VIOL[2], f, function (x, y) { var u = (x + 0.5 - sx) * dir, v = y + 0.5 - 6, topE = wy * (u / 13) - 1.4 - Math.sin(u / 13 * Math.PI) * 2.2; return v < topE + 1.4 ? ZUB[2] : orb(sx + dir * 6, 4, 9, 6, VIOL)(x, y); }, VIOL[0]);
    };
    return build(28, 18, [
      P(ZUB[2], or(cap(12.6, 10, 11.4, 17, 0.8), cap(15.4, 10, 16.6, 17, 0.8)), orb(14, 13, 4, 4, ZUB), ZUB[0]),
      wing(11, -1), wing(17, 1),
      P(ZUB[2], or(tri(10.2, 5, 10.6, -0.6, 13.4, 3.4), tri(14.6, 3.4, 17.4, -0.6, 17.8, 5)), function (x, y) { return y > 1.6 && Math.abs(x + 0.5 - (x < 14 ? 11.6 : 16.4)) < 0.8 ? VIOL[3] : orb(14, 1, 6, 4, ZUB)(x, y); }, ZUB[0]),
      O(14, 7.4, 4.6, 4.8, ZUB, ZUB[0])
    ], [[11, 6, ['######', '#vvvv#', '#w..w#', '.#vv#.', '..##..']]]);
  });

  /* Ekans: a purple snake, yellow eyes and a yellow band at his neck and
     rattle, slithering in waves (the second frame flicks his tongue) */
  E.ekans = [0, 1].map(function (f) {
    var ph = f ? Math.PI : 0, pts = [];
    for (var k = 0; k <= 10; k++) { var t = k / 10; pts.push([10 + t * 16.4, 12.4 + Math.sin(t * Math.PI * 1.6 + ph) * 1.5 * t, 3.1 - t * 1.7]); }
    var body = tube(pts), neck = tube([[11, 12.6, 3], [8, 10.6, 2.8], [6.4, 8.2, 2.6]]);
    var tex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, i = Math.max(0, Math.min(10, Math.round((X - 10) / 1.64))), cy = pts[i][1];
      if (X > 24.4) return Math.floor(X) % 2 ? '7' : 'B';
      if (Y > cy + 1.2) return 'Y';
      return orb(14, 9, 14, 6, EKA)(x, y);
    };
    return build(28, 16, [
      P(EKA[2], body, tex, EKA[0]),
      P(EKA[2], neck, function (x, y) { var X = x + 0.5, Y = y + 0.5; if (Math.abs((X - 8.8) * 0.8 + (Y - 11) * 0.6) < 0.9) return 'D'; return X > 9 && Y > 12.4 ? 'Y' : orb(7, 8, 6, 6, EKA)(x, y); }, EKA[0]),
      P(EKA[2], ell(5.4, 6.2, 5, 3.9), orb(4, 4.6, 6, 5, EKA), EKA[0])
    ], [[2, 4, ['.##.', '#DE#', '#DE#', '.##.']], [6, 4, ['.##.', '#DE#', '#DE#', '.##.']], [1, 8, ['#####.', '.....#']]], f ? [[0, 8, ['x.', '.x', 'x.']]] : []);
  });

  /* ==========================================================================
     BEE LAND — Queen Bee's workers, and the Queen herself.
     ========================================================================== */
  // stripes for a bee's abdomen: honey and brown bands across it, curving with it
  var stripes = function (cx, cy, rx, ry, w, x0) {
    var lit = orb(cx - rx * 0.2, cy - ry * 0.3, rx, ry, HONEY), dk = orb(cx - rx * 0.2, cy - ry * 0.3, rx, ry, BEEB);
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5, u = X - x0 + Math.pow((Y - cy) / ry, 2) * rx * 0.25;
      return Math.floor(u / w) % 2 ? dk(x, y) : lit(x, y);
    };
  };
  // fuzz: a few lighter flecks over a texture
  var fuzzy = function (tex, ch) { return function (x, y) { return (x * 5 + y * 3) % 7 === 0 ? ch : tex(x, y); }; };

  /* A worker bee: slimmer than the park's round bumblebee — honey-amber
     and brown, a fuzzy gold middle, clear veined wings (a blur on the
     second frame), elbowed feelers, a determined little brow. */
  E.honeybee = [0, 1].map(function (f) {
    var wingA = function (cx, cy, rx, ry, a, far) {
      return P(WING[3], turned(ell(cx, cy, rx, ry), cx, cy, a), function (x, y) {
        var u = (x + 0.5 - cx), v = (y + 0.5 - cy);
        if (Math.abs(u * Math.sin(-a) + v * Math.cos(-a)) < 0.45 && u > -rx * 0.6) return WING[1];
        return far ? WING[2] : orb(cx - 1, cy - 1, rx, ry, WING.slice(1))(x, y);
      }, WING[1]);
    };
    var parts = [];
    if (!f) parts.push(wingA(13.4, 4.4, 4.8, 2.4, -0.55, true));
    parts.push(
      P(BEEB[2], or(cap(8, 12, 6.4, 16.6, 0.6), cap(10, 12.6, 9.6, 17, 0.6), cap(12.4, 12.6, 13.4, 16.8, 0.6))),
      P(HONEY[2], fluff(15.6, 11, 5.8, 4.4, 9, 0.06), stripes(15.6, 11, 5.8, 4.4, 2.4, 10.4), BEEB[1]),
      P(BEEB[1], tri(20.6, 10.2, 20.6, 12.4, 22, 11.6)),
      P(HONEY[3], fluff(9.6, 10.2, 3.8, 3.8, 8, 0.14), fuzzy(orb(8.8, 9, 4.4, 4.4, HONEY.slice(1) + 'w'), HONEY[2]), HONEY[1]),
      O(5, 10.6, 3.8, 3.5, BEEB.slice(1) + HONEY[3], BEEB[0]),
      P(BEEB[1], or(limb([[4, 7.6], [3.4, 4], [1.2, 3]], 0.5), limb([[6, 7.4], [6.4, 3.4], [4.6, 1.6]], 0.5))),
      P(HONEY[3], or(ell(1.2, 3, 0.9, 0.9), ell(4.4, 1.6, 0.9, 0.9)))
    );
    if (!f) parts.push(wingA(10.6, 4.2, 5, 2.6, -0.3));
    // the second frame's wings are a blur: soft pale streaks, no outline
    var blur = f ? [[6, 4, ['..1LLL1..', '.1LLLLLL1', '1LLLLLL1.', '.11LLL1..']], [12, 7, ['.1LL1', '1LLL1', '.11..']], [17, 4, ['1...', '.L1.']]] : [];
    return build(22, 18, parts, [[2, 8, ['.##.', '#ww#', '#Ew#', '#EE#', '.##.']], [1, 7, ['##..', '..##']], [2, 13, ['#.', '.#']]], blur);
  });

  /* QUEEN BEE — the boss. Regal and round and very fuzzy: a little gold
     crown with jewels, an ermine ruff, big lashy eyes, fancy lilac wings.
     She took Bonnie's list because nobody ever asked what SHE'd like to do
     one day. Cross, but never scary.
     fly: wings up, wings down · dive: swooping down, nose first ·
     stuck: sat on the floor, wings glued in her own honey ·
     hurt: eyes squeezed, crown knocked askew ·
     sorry: kind sad eyes, hands together, crown still askew. */
  var queen = function (mode) {
    var dive = mode === 'dive', stuck = mode === 'stuck', hurt = mode === 'hurt', sorry = mode === 'sorry';
    var a = dive ? -0.42 : 0, pv = [30, 30], dy = stuck ? 6 : 0;
    // everything she's made of can be tipped (dive) and lowered (stuck)
    var T = function (f) { var g = dy ? function (x, y) { return f(x, y - dy); } : f; return a ? turned(g, pv[0], pv[1] + dy, a) : g; };
    var Pt = function (c, f, tex, line) { return P(c, T(f), tex ? T(tex) : null, line); };
    // her head isn't tipped with her when she dives, only carried along: it stays
    // upright, so her face does too
    var hc = (function () { var c = Math.cos(a), sn = Math.sin(a), X = 17 - pv[0], Y = 20 - pv[1]; return [pv[0] + c * X - sn * Y - 17, pv[1] + sn * X + c * Y - 20 + dy]; })();
    var Ph = function (c, f, tex, line) { var m = function (g) { return function (x, y) { return g(x - hc[0], y - hc[1]); }; }; return P(c, m(f), tex ? m(tex) : null, line); };
    var spot = function (sx, sy, rows) { return [Math.round(sx + hc[0]), Math.round(sy + hc[1]), rows]; };
    var wingPos = stuck ? 'droop' : dive ? 'back' : mode === 'f1' || hurt || sorry ? 'down' : 'up';
    // each wing: [root x, root y, tip x, tip y, width]
    var W = {
      up: [[30, 21, 46, 1.6, 6.6], [31, 24.4, 50, 15, 4.6]],
      down: [[30, 21, 53, 12, 6.4], [31, 24.4, 50, 29, 4.4]],
      back: [[30, 21, 52, 6.4, 6], [31, 24.4, 53, 19, 4.2]],
      droop: [[30, 21, 56, 44, 5.6], [31, 24.4, 47, 46, 4]]
    }[wingPos];
    var wing = function (w, far) {
      var ax = w[0], ay = w[1], bx = w[2], by = w[3], L = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay)), ux = (bx - ax) / L, uy = (by - ay) / L;
      var shape = function (x, y) {
        var px = x - ax, py = y - ay, t = (px * ux + py * uy) / L, d = -px * uy + py * ux;
        return t > 0 && t < 1 && Math.abs(d) < w[4] * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.62)), 0.8);
      };
      return Pt(WING[2], shape, function (x, y) {
        var px = x + 0.5 - ax, py = y + 0.5 - ay, t = (px * ux + py * uy) / L, d = (-px * uy + py * ux) / w[4];
        var edge = Math.abs(d) / Math.max(0.01, Math.pow(Math.sin(Math.PI * Math.pow(t, 0.62)), 0.8));
        // a pale rim, two long veins and a cross vein, a pink blush towards the tip
        if (edge > 0.8) return far ? WING[2] : WING[4];
        if ((Math.abs(d - 0.28 * t) < 0.09 || Math.abs(d + 0.3 * t) < 0.09 || Math.abs(t - 0.56) < 0.025) && t > 0.12) return far ? WING[1] : WING[1];
        if (t > 0.72) return far ? 's' : 't';
        return far ? WING[2] : (d < 0 ? WING[3] : WING[2]);
      }, WING[0]);
    };
    var head = [17, 20], hR = [10.2, 9.2];
    var parts = [wing(W[0], true), wing(W[1], true)];
    // little legs under her
    if (!stuck) parts.push(Pt(BEEB[2], or(cap(24, 38, 22.6, 44, 0.9), cap(29, 39, 28.6, 45.4, 0.9), cap(34, 41, 35, 46.4, 0.9)), null, BEEB[0]));
    parts.push(
      // her abdomen: big, round, striped, a tiny polite stinger
      Pt(BEEB[1], tri(54.6, 36.6, 54.6, 40, 57.4, 38.8), null, BEEB[0]),
      Pt(HONEY[2], fluff(41, 34, 14.6, 12.4, 16, 0.035), stripes(41, 34, 14.6, 12.4, 4.6, 27), BEEB[0]),
      // her fuzzy golden middle
      Pt(HONEY[3], fluff(26.6, 32, 9.4, 8.8, 13, 0.07), fuzzy(orb(24, 28, 11, 11, HONEY.slice(1) + 'w'), HONEY[2]), HONEY[1])
    );
    parts.push(wing(W[0]), wing(W[1]));
    // arms (a bee's, dark and thin): only when she's sorry, her hands
    // together in front of her ruff
    var armP = function (pts, hand) {
      return [Pt(BEEB[2], limb(pts, 1.2), orb(16, 30, 8, 8, BEEB), BEEB[0]), Pt(HONEY[3], ell(hand[0], hand[1], 1.9, 1.9), orb(hand[0] - 0.6, hand[1] - 0.6, 2.4, 2.4, HONEY.slice(1) + 'w'), BEEB[1])];
    };
    parts.push(
      // the ermine ruff
      Pt('w', fluff(19.6, 28.4, 9.4, 4.4, 11, 0.12), function (x, y) { return ((x * 3 + y * 7) % 11 === 0) ? 'g' : orb(17, 26, 10, 6, 'WwwwR')(x, y); }, '2'),
      // feelers, with little round tips
      Ph(BEEB[1], or(limb([[13, 13], [9.6, 6], [6.4, 3.6]], 0.6), limb([[20, 12], [23, 4.6], [26.6, 3]], 0.6)), null, BEEB[0]),
      Ph(HONEY[3], or(ell(5.6, 3.2, 1.6, 1.6), ell(27.4, 2.6, 1.6, 1.6)), orb(5, 2, 4, 3, HONEY), HONEY[0]),
      Ph('C', ell(head[0], head[1], hR[0], hR[1]), orb(head[0] - 2, head[1] - 2, hR[0] + 1, hR[1] + 1, 'BCCDF'), 'A')
    );
    if (sorry) parts = parts.concat(armP([[25, 38], [21.4, 36], [19, 31.6]], [18.6, 31]), armP([[21, 39], [16.4, 36.4], [15.6, 31.8]], [15.4, 31.2]));
    // the crown: three points and a band with jewels; knocked askew when she's hit
    var askew = hurt || sorry || stuck;
    var cx = askew ? 21.4 : 16.6, cy = askew ? 11 : 9.8, ca = askew ? 0.5 : -0.12;
    var crown = turned(or(rrect(cx - 6.2, cy, cx + 6.2, cy + 3.8, 0.6), tri(cx - 6.2, cy + 0.6, cx - 6.6, cy - 5, cx - 2.4, cy + 0.6), tri(cx - 2.8, cy + 0.6, cx, cy - 6.6, cx + 2.8, cy + 0.6), tri(cx + 2.4, cy + 0.6, cx + 6.6, cy - 5, cx + 6.2, cy + 0.6), ell(cx - 6.6, cy - 5.2, 1.1, 1.1), ell(cx, cy - 6.8, 1.2, 1.2), ell(cx + 6.6, cy - 5.2, 1.1, 1.1)), cx, cy, ca);
    parts.push(Ph('C', crown, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, c = Math.cos(-ca), sn = Math.sin(-ca), u = (X - cx) * c - (Y - cy) * sn, v = (X - cx) * sn + (Y - cy) * c;
      if (v > 0.6 && v < 3.2 && Math.abs(u) < 1.3) return v < 1.6 ? 'y' : 'x';
      if (v > 0.9 && v < 2.9 && Math.abs(Math.abs(u) - 4.2) < 0.9) return v < 1.8 ? SKY[3] : SKY[2];
      if (v < -4.8) return 'F';
      return orb(cx - 3, cy - 4, 9, 7, GOLD)(x, y);
    }, 'A'));
    // honey: glued wings, a puddle under her, drips down her head
    if (stuck) parts.push(
      P(HONEY[2], or(ell(36, 53.8, 22, 2.4), ell(55.4, 50.4, 4.4, 3.6), ell(47, 51.6, 4, 2.8), ell(14, 53.2, 6, 2.4)), function (x, y) { return y < 51.4 ? HONEY[3] : orb(30, 50, 26, 6, HONEY)(x, y); }, HONEY[0]),
      P(HONEY[2], or(cap(24, 13.4, 24.6, 21, 1), ell(24.8, 21.6, 1.4, 1.6), cap(11, 14.6, 10.2, 18, 0.8), ell(10.2, 18.6, 1.1, 1.3), cap(45, 31, 45.4, 36, 0.9), ell(45.4, 36.6, 1.2, 1.4)), orb(20, 14, 10, 10, HONEY), HONEY[0])
    );
    // the face
    var E5 = EYE_L, ex = 8, ey = 17;
    var st = [];
    if (hurt) st.push(spot(ex, ey + 1, ['#....', '.##..', '...##', '.##..', '#....']), spot(ex + 8, ey + 1, ['....#', '..##.', '##...', '..##.', '....#']), spot(12, 25, ['.###.', '#...#', '.###.']));
    else if (sorry) st.push(spot(ex, ey - 2, ['...##', '###..']), spot(ex + 8, ey - 2, ['##...', '..###']), spot(ex, ey, ['.###.', '#www#', '#www#', '#Eww#', '#EEw#', '.###.']), spot(ex + 8, ey, ['.###.', '#www#', '#www#', '#Eww#', '#EEw#', '.###.']), spot(13, 26, ['.##.', '#..#']), spot(ex - 1, ey + 6, ['M', 'L']));
    else if (stuck) st.push(spot(ex, ey - 2, ['...##', '###..']), spot(ex + 8, ey - 2, ['##...', '..###']), spot(ex, ey, ['.###.', '#Eww#', '#EEw#', '#www#', '#www#', '.###.']), spot(ex + 8, ey, ['.###.', '#Eww#', '#EEw#', '#www#', '#www#', '.###.']), spot(12, 26, ['.#.#.', '#.#.#']));
    else st.push(spot(ex - 1, ey - 3, ['##....', '..####']), spot(ex + 8, ey - 3, ['....##', '####..']), spot(ex, ey, E5), spot(ex + 8, ey, E5), spot(12, 25, ['.##.', '#..#']));
    if (!hurt) st.push(spot(ex - 1, ey + 1, ['#']), spot(ex + 13, ey + 1, ['#']));
    st.push(spot(7, 23, ['33']), spot(23, 23, ['33']));
    var free = hurt ? [[2, 4, TWINKLE], [30, 6, ['.C.', 'CFC', '.C.']]] : [];
    return build(60, 56, parts, st, free);
  };
  E.queenbee = { fly: [queen('f0'), queen('f1')], dive: queen('dive'), stuck: queen('stuck'), hurt: queen('hurt'), sorry: queen('sorry') };

  /* ==========================================================================
     ITEMS
     ========================================================================== */

  /* Bonnie's BULLET, from his items box: a "D" with an eye — a deep-navy
     bullet, round nose forward, flat back with little fins, one big eye
     and a cheeky grin. Picked up, it zooms you along. */
  var bulletParts = function (S, ox, oy, f, ride) {
    // S scales Bonnie's small pickup (20×14) up to the one you ride (52×30)
    var X = function (v) { return ox + v * S; }, Y = function (v) { return oy + v * S; };
    var body = or(ell(X(7), Y(7), 6.4 * S, 6 * S), rrect(X(7), Y(1), X(15.2), Y(13), 0.6 * S));
    var parts = [
      // fins top and bottom at the back
      P(BULLET[2], or(tri(X(10.6), Y(1.6), X(15.4), Y(1.6), X(15.4), Y(-0.6)), tri(X(10.6), Y(12.4), X(15.4), Y(12.4), X(15.4), Y(14.6))), orb(X(13), Y(0), 4 * S, 4 * S, BULLET), BULLET[0]),
      P(BULLET[2], body, function (x, y) {
        var u = (x + 0.5 - ox) / S, v = (y + 0.5 - oy) / S;
        // a band round its back, a long shine along the top
        if (u > 12.6) return u > 14.2 ? BULLET[1] : orb(X(13), Y(3), 3 * S, 10 * S, BULLET)(x, y);
        if (v > 2.2 && v < 3.4 && u > 6.6 && u < 12) return BULLET[4];
        return orb(X(6), Y(4.4), 9 * S, 8.6 * S, BULLET)(x, y);
      }, BULLET[0]),
      // the big eye
      P('w', ell(X(6.2), Y(5.2), 3.1 * S, 3.4 * S), function (x, y) { return (y + 0.5 - oy) / S > 7.4 ? 'W' : 'w'; }, BULLET[0]),
      P('E', ell(X(5), Y(5.6), 1 * S, 1.5 * S))
    ];
    return parts;
  };
  var puff = function (balls) { return balls.map(function (b) { return P('W', ell(b[0], b[1], b[2], b[2]), orb(b[0] - 0.4, b[1] - 0.6, b[2] + 0.4, b[2] + 0.4, '21WwR'), '2'); }); };
  A.rocket = [0, 1].map(function (f) {
    // a little puff of smoke off its back on the second frame
    var smoke = f ? [[16, 5, ['.WW.', 'WwwW', 'WwW1', '.11.']], [18, 9, ['W1', '11']]] : [[16, 7, ['W.', '1W']]];
    return build(20, 14, bulletParts(1, 0, 0, f), [[4, 3, ['w']], [1, 9, ['#....#', '.#ww#.', '..##..']]], smoke);
  });
  /* The same bullet, big, for riding: Bonnie stands on its back as it
     zooms along, flames and speed-streaks out of its tail. */
  A.rocketRide = [0, 1].map(function (f) {
    var S = 2.4, oy = 1.4, flame = f ? 1 : 0;
    var parts = [
      P('5', function (x, y) {
        var L = f ? 15.6 : 13, t = (x - 37) / L, wob = Math.sin(t * 10 + flame * 2.6) * 1.1;
        return t > 0 && t < 1 && Math.abs(y - 16.4 - wob * 0.4) < 8.4 * Math.pow(1 - t, 0.8) + wob;
      }, function (x, y) {
        var t = (x + 0.5 - 37) / (f ? 15.6 : 13), d = Math.abs(y + 0.5 - 16.4) / (8.4 * Math.pow(1 - t, 0.8) + 0.01);
        return d < 0.35 && t < 0.6 ? '8' : d < 0.6 && t < 0.8 ? '7' : d < 0.85 ? '6' : '5';
      }, '4')
    ].concat(bulletParts(S, 1.2, oy, f, true));
    var st = [[11, 10, ['ww', 'w.']], [3, 20, ['##............#', '.##..........#.', '..#wwwwwwwww#..', '..##w.w.w.w##..', '...##33333##...', '.....#####.....']]];
    var fr = [];
    // speed streaks behind
    if (f) fr.push([41, 3, ['www..WWW']], [44, 29, ['WWWW']], [42, 27, ['ww.WW']]);
    else fr.push([43, 4, ['WWW..ww']], [40, 28, ['wwww..W']]);
    return build(52, 30, parts, st, fr);
  });
  A.rocketRide[0].seat = A.rocketRide[1].seat = [24, 4];

  /* Poké Ball: shut, wobbling one way and the other, and open with a
     flash of light inside. */
  var pokeball = function (a, open) {
    var cx = 6, cy = open ? 7.2 : 6.2, R = 5.6, pv = [6, 11.6];
    var rot = function (f) { return a ? turned(f, pv[0], pv[1], a) : f; };
    var top = function (x, y) { return ell(cx, cy, R, R)(x, y) && y < cy - 0.7; };
    var bot = function (x, y) { return ell(cx, cy, R, R)(x, y) && y > cy + 0.7; };
    // where the button ends up once the ball has rocked by a
    var bx = Math.round(pv[0] + (cx - pv[0]) * Math.cos(a) - (cy - pv[1]) * Math.sin(a) - 2), by = Math.round(pv[1] + (cx - pv[0]) * Math.sin(a) + (cy - pv[1]) * Math.cos(a) - 2);
    if (open) {
      // popped open: the lid lifted on its hinge, light pouring out — small
      // enough to draw by hand
      var sp = BB.sprHi([
        '.....####...',
        '...##zyxx#..',
        '..#yyxxxxv#.',
        '.#yxxxxxvvu#',
        '.#xxxxvvvuu#',
        '..#ggggggg#.',
        '.8..7.8.7...',
        '#g78888887g#',
        '#RWWWWWWW22#',
        '.#RWWWWW22#.',
        '..##WW22##..',
        '....####....'
      ], PAL, 'shade');
      sp.noLight = 'all';
      return sp;
    }
    return build(12, 12, [
      P('g', rot(ell(cx, cy, R, R)), null, 'f'),
      P('w', rot(bot), rot(orb(cx - 1, cy - 1, R + 1, R + 1, SNOW)), '2'),
      P('x', rot(top), rot(orb(cx - 1, cy - 2, R + 1, R + 1, RED)), 'u')
    ], [[bx, by, ['.gg.', 'gwwg', 'gwWg', '.gg.']], [Math.round(3 - a * 3), 2, ['z']]]);
  };
  A.pokeball = [pokeball(0), pokeball(0.35), pokeball(-0.35), pokeball(0, true)];

  /* A wish: a folded paper star glowing gold, every point creased down
     the middle (one side catching the light), twinkling. */
  A.wish = [0, 1, 2, 3].map(function (f) {
    var cx = 9, cy = 9.6, R = f === 1 ? 8.4 : f === 3 ? 7.8 : 8, rot = -Math.PI / 2 + (f === 2 ? 0.06 : f === 0 ? -0.04 : 0);
    var seg = Math.PI * 2 / 5;
    var parts = [
      P('D', star(cx, cy, R, 3.7, rot), function (x, y) {
        var dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.sqrt(dx * dx + dy * dy);
        var t = (((Math.atan2(dy, dx) - rot) % seg) + seg) % seg / seg;
        if (d < 1.2) return 'F';
        // each point creased: its left half lit, its right half in shade, valleys deepest
        var lit = t > 0.5;
        if (Math.abs(t - 0.5) > 0.42 && d > 3) return lit ? 'C' : 'B';
        return lit ? (d < 4.4 ? 'F' : 'D') : (d < 4.4 ? 'C' : 'B');
      }, 'A')
    ];
    var glow = [
      [[1, 2, TWINKLE], [14, 13, ['F']], [15, 1, ['7']]],
      [[14, 0, TWINKLE], [1, 13, ['F']], [0, 4, ['7']]],
      [[15, 12, TWINKLE], [2, 1, ['F']], [16, 4, ['7']]],
      [[0, 12, TWINKLE], [15, 2, ['F']], [2, 2, ['7']]]
    ][f];
    return build(18, 18, parts, [], glow);
  });

  /* Bonnie's "ONE DAY" list: a sheet of lined paper, a bit crumpled from
     being carried off, a red margin, crayon scribble lines (no letters —
     it's a six-year-old's list), a doodled heart and star, glowing gold
     round its edge. */
  A.wishlist = (function () {
    var wob = function (x, y) { return Math.sin(x * 1.3 + y * 0.4) * 0.5 + Math.sin(y * 0.9) * 0.4; };
    var sheet = function (x, y) { var w = wob(x, y); return x > 3.4 + w && x < 24.6 + w && y > 2.6 + w * 0.6 && y < 31.4 + w * 0.6; };
    var glow = function (x, y) { var w = wob(x, y); return x > 1.8 + w && x < 26.2 + w && y > 1 + w * 0.6 && y < 33 + w * 0.6; };
    var crayon = ['x', '|', '{', 'c', 'm'];
    var parts = [
      P('C', glow, function (x, y) { return (x + y) % 3 ? 'D' : 'C'; }, 'B'),
      P(PAPER[3], sheet, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // creases: two long folds catching the light differently
        var c1 = (X - 4) * 0.55 - (Y - 6), c2 = (X - 24) * -0.9 - (Y - 18);
        var base = c1 > 0 && c2 < 0 ? PAPER[2] : c2 > 0 ? PAPER[3] : PAPER[4];
        if (Math.abs(c1) < 0.5 || Math.abs(c2) < 0.5) return PAPER[1];
        if (X > 7.4 && X < 8.4) return '3';
        if (Y > 9 && (Math.floor(Y) - 9) % 3 === 0) return '1';
        return base;
      }, PAPER[0])
    ];
    // the title, big and red, then a scribble on each line in a different crayon
    var st = [[9, 4, ['x..xx..x.xx..xx.x', '.xx..xx.x..xx..x.']]];
    [[10, 9, 14], [13, 9, 11], [16, 9, 13], [19, 9, 9], [22, 9, 12], [25, 9, 7]].forEach(function (l, i) {
      var row1 = '', row2 = '', c = crayon[i % crayon.length];
      for (var k = 0; k < l[2]; k++) { var up = (k + i) % 3 === 0; row1 += up ? c : '.'; row2 += up ? '.' : c; }
      st.push([l[1], l[0] - 1, [row1, row2]]);
    });
    st.push([18, 25, ['.x.x.', 'xxxxx', '.xxx.', '..x..']], [11, 27, ['.c.', 'ccc', '.c.']]);
    return build(28, 34, parts, st, [[0, 6, TWINKLE], [25, 26, TWINKLE], [24, 0, ['.F', 'F.']]]);
  })();

  /* Paint pots — red, yellow and blue — tins with a wire handle, paint
     brimming over the rim and running down the side in a drip. Touch one
     and every block of its colour switches on. */
  var POT = { r: RED, y: YEL, b: BLU };
  A.paintpot = {};
  Object.keys(POT).forEach(function (k) {
    var t = POT[k];
    A.paintpot[k] = build(16, 18, [
      P('O', limb([[2.6, 7.4], [3.6, 3.4], [8, 1.2], [12.4, 3.4], [13.4, 7.4]], 0.55)),
      P(STEEL[2], rrect(2.2, 6.4, 13.8, 17.6, 1.4), function (x, y) { return x < 3.6 ? STEEL[4] : x < 6 ? STEEL[3] : x > 11 ? STEEL[1] : STEEL[2]; }, STEEL[0]),
      // the paint: brimming over the rim, running down in thick drips, one all the way
      P(t[2], or(ell(8, 6.6, 5.9, 2), rrect(2.2, 6.6, 13.8, 10.2, 0.6), cap(4.6, 9, 4.6, 12.6, 1.3), cap(8.6, 9, 8.6, 11.2, 1.2), cap(11.6, 9, 11.6, 16.4, 1.3), ell(11.6, 16.6, 1.6, 1.3)), function (x, y) {
        if (ell(8, 6.3, 4.6, 1.2)(x + 0.5, y + 0.5)) return t[3];
        return orb(5, 7, 10, 10, t)(x, y);
      }, t[0])
    ], [[4, 6, [t[4] + t[4]]], [3, 8, [t[4]]], [11, 11, [t[3]]]]);
  });
  /* The blocks the pots switch: a glossy block of colour, or — while its
     colour is off — only its ghost, a dotted outline you can walk through. */
  A.paintblock = {};
  Object.keys(POT).forEach(function (k) {
    var t = POT[k];
    var solid = build(16, 16, [
      P(t[2], rrect(0.4, 0.4, 15.6, 15.6, 2.2), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (X < 2.2 || Y < 2.2) return X + Y < 10 ? t[4] : t[3];
        if (X > 13.8 || Y > 13.8) return t[1];
        if (Math.abs(X - Y + 6) < 1.2 && X < 7 || Math.abs(X - Y + 3) < 0.6 && X < 5) return t[4];
        return orb(5, 5, 14, 14, t.slice(0, 4) + t[3])(x, y);
      }, t[0])
    ]);
    var rows = [];
    for (var y = 0; y < 16; y++) {
      var r = '';
      for (var x = 0; x < 16; x++) {
        var e = Math.min(x, y, 15 - x, 15 - y), along = (x === 0 || x === 15 || x === 1 || x === 14) ? y : x;
        r += e < 2 && (along % 4) < 2 ? (e === 0 ? t[1] : t[3]) : '.';
      }
      rows.push(r);
    }
    var ghost = BB.sprHi(rows, PAL);
    ghost.noLight = 'all';
    A.paintblock[k] = [solid, ghost];
  });

  /* Tall grass, bright and thick, drawn in front of Bonnie: still, then
     rustling one way and the other with bits flying off — something's
     in there. */
  A.tallgrass = [0, 1, 2].map(function (f) {
    var lean = f === 0 ? 0 : f === 1 ? -3.6 : 3.6;
    // [root x, height, own lean, in front?]
    var blades = [[3.4, 12, -2.4, 0], [7, 18, -1, 1], [10, 14, 0.4, 0], [13, 20.6, -0.6, 1], [16, 16, 0.8, 0], [19, 21, 0.4, 1], [22, 15, -0.6, 0], [25, 19, 1, 1], [28, 13, 2.2, 0], [9.6, 11, -1.4, 1], [21.6, 12, 1.4, 1]];
    var parts = [P(GRASS[1], ell(16, 22.4, 15, 5.4), orb(14, 18, 16, 6, GRASS), GRASS[0])];
    [0, 1].forEach(function (front) {
      blades.forEach(function (b) {
        if (b[3] !== front) return;
        var pts = [], h = b[1], L = lean * (front ? 1 : 0.75) + b[2];
        for (var k = 0; k <= 6; k++) { var t = k / 6; pts.push([b[0] + L * t * t * 1.3, 22.6 - h * t, 2.5 * (1 - t) + 0.45]); }
        parts.push(P(GRASS[2], tube(pts), function (x, y) {
          var t = Math.max(0, Math.min(1, (22.6 - y - 0.5) / h)), mid = pts[Math.round(t * 6)][0];
          if (!front) return t > 0.55 ? GRASS[3] : GRASS[2];
          return x + 0.5 < mid ? (t > 0.5 ? GRASS[4] : GRASS[3]) : t > 0.6 ? GRASS[3] : GRASS[2];
        }, GRASS[1]));
      });
    });
    var bits = f === 0 ? [] : f === 1 ? [[2, 2, ['.' + GRASS[3], GRASS[3] + '.']], [9, 0, [GRASS[3], GRASS[4]]], [23, 4, [GRASS[3] + GRASS[4]]]] : [[28, 1, [GRASS[3] + '.', '.' + GRASS[3]]], [21, 0, [GRASS[4], GRASS[3]]], [6, 4, [GRASS[4] + GRASS[3]]]];
    return build(32, 22, parts, [], bits, GRASS[1]);
  });

  /* Honey: a falling drop, and the sticky puddle it leaves on the floor. */
  A.honeyblob = build(10, 10, [
    P(HONEY[2], or(ell(5, 6.4, 3.5, 3.4), tri(5, 0.2, 1.9, 5.6, 8.1, 5.6)), orb(4, 5, 4.4, 5, HONEY), HONEY[0])
  ], [[3, 4, [HONEY[4]], [HONEY[4]]]]);
  A.honeypuddle = build(32, 8, [
    P(HONEY[2], or(ell(16, 5.4, 15.4, 2.6), ell(9, 4.4, 5, 2.4), ell(23, 4.6, 6, 2.2)), function (x, y) {
      if (y < 3.6 && x > 6 && x < 12) return HONEY[4];
      if (y < 3.8) return HONEY[3];
      return y > 6 ? HONEY[1] : HONEY[2];
    }, HONEY[0])
  ], [[20, 3, [HONEY[4] + HONEY[4] + HONEY[4]]], [26, 5, [HONEY[3]]]]);

  /* ==========================================================================
     SCENERY — the meadow, New York, Chocolate Land, Bee Land.
     ========================================================================== */
  // a honeycomb: which cell a point is in, and how near its wall (0 middle, 1 wall)
  var hexAt = function (x, y, sz) {
    var q = (Math.sqrt(3) / 3 * x - y / 3) / sz, r = (2 / 3 * y) / sz, X = q, Z = r, Y = -X - Z;
    var rx = Math.round(X), ry = Math.round(Y), rz = Math.round(Z), dx = Math.abs(rx - X), dy = Math.abs(ry - Y), dz = Math.abs(rz - Z);
    if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
    var cx = sz * Math.sqrt(3) * (rx + rz / 2), cy = sz * 1.5 * rz, px = x - cx, py = y - cy, inr = sz * Math.sqrt(3) / 2;
    return { id: rx * 7 + rz * 13, cx: cx, cy: cy, d: Math.max(Math.abs(px), Math.abs(0.5 * px + 0.866 * py), Math.abs(-0.5 * px + 0.866 * py)) / inr };
  };
  var comb = function (sz, ox, oy, t, lit) {
    return function (x, y) {
      var h = hexAt(x + 0.5 - ox, y + 0.5 - oy, sz);
      if (h.d > 0.8) return t[1];
      if (h.d > 0.62) return lit(x, y);
      return (h.cx + h.cy) - (x + 0.5 - ox) - (y + 0.5 - oy) > sz * 0.5 ? t[3] : t[2];
    };
  };

  /* ---- the meadow ---- */
  // a little Pokémon Centre: red roof, white walls, glass sliding doors and
  // a big Poké Ball over them (no lettering)
  D.pokecentre = build(64, 54, [
    P('W', rrect(4, 20, 60, 52, 1), function (x, y) {
      if (y > 47) return orb(20, 40, 50, 20, IRON)(x, y);
      return x < 10 ? 'w' : x > 54 ? '2' : orb(20, 24, 50, 40, SNOW)(x, y);
    }, '2'),
    P(SKY[3], or(rrect(8, 28, 19, 39, 0.6), rrect(45, 28, 56, 39, 0.6)), function (x, y) {
      var X = x + 0.5;
      if (Math.abs(X - 13.5) < 0.6 || Math.abs(X - 50.5) < 0.6 || Math.abs(y + 0.5 - 33.5) < 0.6) return 'O';
      return (X - y) % 9 < 2 ? SKY[4] : SKY[3];
    }, 'O'),
    P(SKY[3], rrect(23, 30, 41, 52.4, 0.6), function (x, y) {
      var X = x + 0.5;
      if (Math.abs(X - 32) < 0.7 || X < 24.2 || X > 39.8 || y < 31) return 'O';
      return (X - y) % 11 < 2.4 ? SKY[4] : SKY[3];
    }, 'N'),
    P('x', or(rrect(0.6, 13, 63.4, 22, 1.2), tri(4, 13.6, 60, 13.6, 32, 2)), function (x, y) {
      if (y > 19.4) return 'v';
      return orb(18, 4, 40, 20, RED)(x, y);
    }, 'u'),
    P('w', ell(32, 22, 7.4, 7.4), orb(30, 20, 8, 8, SNOW), '2'),
    P('x', function (x, y) { return ell(32, 22, 5.8, 5.8)(x, y) && y < 21.4; }, orb(30, 18, 6, 5, RED), 'u'),
    P('w', function (x, y) { return ell(32, 22, 5.8, 5.8)(x, y) && y > 22.6; }, orb(30, 22, 6, 6, SNOW), '2'),
    P('g', function (x, y) { return ell(32, 22, 5.8, 5.8)(x, y) && Math.abs(y - 22) <= 0.6; }),
    P('g', ell(32, 22, 2.2, 2.2)), P('w', ell(32, 22, 1.3, 1.3)),
    P('P', rrect(21, 52, 43, 54, 0.5), orb(28, 52, 20, 3, IRON), 'N')
  ], [[29, 18, ['y']], [5, 25, ['w', 'w']]]);
  // a wooden route sign: a board with a carved arrow, on a post
  D.routesign = build(18, 28, [
    P('U', rrect(7.4, 12, 10.6, 28, 0.8), function (x, y) { return x > 9 ? 'T' : 'U'; }, 'S'),
    P('V', rrect(0.6, 2, 17.4, 14, 1.4), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if ((Math.abs(Y - 8) < 1 && X > 5 && X < 14) || (Math.abs(X - 5 - Math.abs(Y - 8)) < 1.1 && Math.abs(Y - 8) < 3.6)) return Y < 8 ? 'S' : 'T';
      if (Math.floor(Y) % 4 === 0) return 'U';
      return orb(5, 4, 16, 12, WOOD)(x, y);
    }, 'S'),
    P('<', or(ell(5, 27.4, 3.4, 1.6), ell(13, 27.6, 3, 1.4)), orb(8, 26, 8, 3, LEAF), '(')
  ]);
  // a berry bush: blue Oran berries and pink Pecha ones
  D.berrybush = build(30, 22, [
    O(8, 15, 7, 6.4, LEAF, '('), O(21.6, 14.6, 7.6, 7, LEAF, '('), O(15, 9.4, 8, 7.4, LEAF, '('), O(14, 17, 7, 5, LEAF, '('),
    O(7, 12, 2, 2, SKY, SKY[0]), O(19, 7, 2, 2, SKY, SKY[0]), O(24, 16, 2, 2, SKY, SKY[0]),
    O(13, 15, 1.9, 2, PINK, 'p'), O(25, 10.6, 1.8, 1.9, PINK, 'p'), O(10, 6.6, 1.8, 1.8, PINK, 'p')
  ], [[6, 11, ['w']], [18, 6, ['w']], [23, 15, ['w']], [12, 14, ['t']]]);

  /* ---- New York, at Christmas ---- */
  // a red fire hydrant with a cap of snow
  D.hydrant = build(14, 18, [
    P('x', or(rrect(3, 5, 11, 16.6, 1), rrect(1.6, 15.4, 12.4, 18, 0.8), ell(7, 5.4, 4, 3), rrect(6, 0.6, 8, 3, 0.4), rrect(0.4, 8, 13.6, 11.4, 1)), function (x, y) {
      if (y > 15.4 || (y > 7.6 && y < 8.4)) return 'v';
      return orb(5, 5, 7, 12, RED)(x, y);
    }, 'u'),
    P('C', or(ell(0.9, 9.7, 0.8, 1.2), ell(13.1, 9.7, 0.8, 1.2), ell(7, 12.4, 1.6, 1.6)), orb(6, 10, 7, 4, GOLD), 'A'),
    P('w', function (x, y) { return ell(7, 3.4, 4.6, 2.6)(x, y) && y < 4.4; }, orb(6, 2, 5, 3, SNOW), '2')
  ]);
  // a hot-dog cart: a striped umbrella, a steel cart with a hot dog pictured on
  // its side, a steaming pot, two wheels
  D.hotdogcart = build(42, 36, [
    P('O', rrect(20, 6, 22, 20, 0.4)),
    P('x', function (x, y) { return ell(21, 11, 20, 9)(x, y) && y < 11 && y > 1; }, function (x, y) {
      var band = Math.floor(Math.atan2(y + 0.5 - 14, x + 0.5 - 21) * 5) % 2;
      var t = band ? RED : YEL;
      return y > 9.4 ? t[1] : orb(15, 2, 20, 9, t)(x, y);
    }, 'u'),
    P(STEEL[2], rrect(3, 18, 39, 31, 1.4), function (x, y) { return y < 19.6 ? STEEL[4] : y > 29 ? STEEL[1] : orb(12, 18, 30, 14, STEEL)(x, y); }, STEEL[0]),
    // the hot dog on its side: a bun and a sausage with a squiggle of mustard
    P('V', rrect(11, 22.4, 27, 27.4, 2.4), orb(15, 22, 14, 5, 'TUVXX'), 'T'),
    P('l', rrect(9.4, 23.6, 28.6, 25.6, 1), orb(14, 23, 16, 3, 'kllmn'), 'k'),
    P(STEEL[3], rrect(30, 13.6, 37, 18.4, 0.8), orb(31, 13, 7, 5, STEEL), STEEL[0]),
    O(10, 31.6, 4, 4, IRON, 'N'), O(32, 31.6, 4, 4, IRON, 'N'),
    P(STEEL[1], or(rrect(1, 19, 3.4, 21, 0.4), rrect(0.4, 19, 1.6, 33, 0.4)))
  ], [[12, 24, ['.7..7..7..7..7.', '7..7..7..7..7..']], [9, 30, ['w']], [31, 30, ['w']]], [[31, 9, ['.W.W', 'W.W.', '.W..']], [34, 7, ['W.', '.W']]]);
  // a green street sign on a pole (two blades, crossed, blank)
  D.streetsign = build(16, 44, [
    P(SIGN[1], rrect(6.6, 6, 9.4, 42, 0.6), function (x, y) { return x < 8 ? SIGN[2] : SIGN[1]; }, SIGN[0]),
    P(SIGN[1], rrect(4.6, 41, 11.4, 44, 0.8), orb(7, 41, 6, 3, SIGN), SIGN[0]),
    P(SIGN[2], rrect(6, 1.4, 10, 5, 0.6), orb(7, 2, 4, 3, SIGN), SIGN[0]),
    P(SIGN[2], rrect(0.4, 5, 15.6, 9.4, 0.8), function (x, y) { var X = x + 0.5, Y = y + 0.5; return (X < 1.6 || X > 14.4 || Y < 6 || Y > 8.4) ? 'w' : orb(4, 6, 14, 4, SIGN)(x, y); }, SIGN[0]),
    P(SIGN[2], rrect(6.4, 10.4, 9.6, 14.6, 0.6), function (x, y) { return y < 11.2 || y > 13.8 ? 'w' : SIGN[2]; }, SIGN[0]),
    P('C', ell(8, 0.8, 1, 0.8))
  ], [], [[0, 4, ['RRwwwwwwwwwwwRR.']]]);
  // a blue mailbox on four legs, its pull-down slot, snow on its round top
  D.mailbox = build(16, 24, [
    P(MAIL[1], or(rrect(2, 18, 4, 24, 0.4), rrect(12, 18, 14, 24, 0.4)), null, MAIL[0]),
    P(MAIL[2], function (x, y) { return rrect(1, 6, 15, 19.4, 1)(x, y) || (ell(8, 6.4, 7, 4.4)(x, y) && y < 7); }, function (x, y) {
      var Y = y + 0.5;
      if (Y > 9 && Y < 11.4 && x > 3 && x < 12) return Y < 10 ? MAIL[0] : MAIL[3];
      if (Math.abs(Y - 14) < 0.5) return MAIL[1];
      return orb(5, 6, 12, 14, MAIL)(x, y);
    }, MAIL[0]),
    P('w', function (x, y) { return ell(8, 4.4, 7.4, 3)(x, y) && y < 5.6; }, orb(6, 2.6, 8, 3, SNOW), '2')
  ]);
  // the big Christmas tree (Rockefeller Center): five snowy tiers strung with
  // coloured lights, a gold star, standing in a gold-wrapped tub
  D.bigxmastree = (function () {
    var cx = 20, T = [[5, 18, 0, 8], [13, 30, 5, 11], [22, 42, 7.4, 14], [31, 54, 9.6, 17], [42, 63, 12, 19.6]];
    var wid = function (i, y) { var t = T[i]; return y < t[0] || y > t[1] ? -1 : t[2] + (y - t[0]) / (t[1] - t[0]) * (t[3] - t[2]); };
    var droop = function (x) { return (1 - Math.abs(Math.sin((x - cx) * Math.PI / 5.5))) * 2.2; };
    var inT = function (i, x, y) { return Math.abs(x - cx) <= wid(i, y) && y <= T[i][1] - droop(x); };
    var tree = function (x, y) { for (var i = 0; i < T.length; i++) if (inT(i, x, y)) return true; return false; };
    var LIGHTS = ['x', 'C', SKY[3], 'r', '}', 'n'];
    var tex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, i = 0;
      while (i < T.length - 1 && !inT(i, X, Y)) i++;
      var below = i < T.length - 1 ? wid(i + 1, Y) : 99, edge = T[i][1] - droop(X) - Y, d = Math.abs(X - cx);
      if (edge < 1.7 && d > below - 1.2) return edge < 0.9 ? 'w' : 'R';
      if (edge < 2.6 && d > below - 4) return PINE[1];
      // the lights: strung in drooping loops across each tier
      var loop = T[i][0] + (T[i][1] - T[i][0]) * 0.55 + Math.pow((X - cx) / 9, 2) * 2.4;
      if (Math.abs(Y - loop) < 0.6 && (x + i) % 3 === 0) return LIGHTS[(x + y + i) % LIGHTS.length];
      if (Math.abs(Y - loop) < 0.5) return 'B';
      if ((x * 3 + y * 5) % 7 === 0) return PINE[1];
      return X < cx - 3 - (Y - T[i][0]) * 0.25 ? PINE[3] : X < cx + 5 ? PINE[2] : PINE[1];
    };
    return build(40, 70, [
      P('B', or(rrect(13, 62, 27, 70, 1), rrect(12, 61, 28, 63.6, 0.8)), function (x, y) { return Math.abs(x + 0.5 - 20) < 1 ? 'x' : orb(15, 62, 12, 8, GOLD)(x, y); }, 'A'),
      P(PINE[2], tree, tex, PINE[0]),
      P('C', star(cx, 4.6, 4.8, 2, -Math.PI / 2), orb(19, 3, 5, 5, GOLD), 'A')
    ], [], [[17, 0, ['F.....F']], [24, 3, ['.F']], [14, 4, ['F']]]);
  })();
  // a low bank of snow, scooped and glinting
  D.snowbank = build(32, 10, [
    P('W', or(ell(8, 9, 8, 5), ell(18, 8, 9, 6.6), ell(27, 9.4, 5.6, 4.4)), orb(14, 5, 20, 8, SNOW), '2')
  ], [[10, 4, ['w']], [22, 3, ['w']], [27, 6, ['R']]]);

  /* ---- Chocolate Land ---- */
  // a chocolate fountain: three silver tiers, chocolate pouring over each, two
  // frames of the pour
  D.chocfountain = [0, 1].map(function (f) {
    // the tiers: [y, half-width]; from each rim a smooth sheet of chocolate
    // pours down into the wider bowl below, rippling as it falls
    var TIERS = [[9, 5.6], [18, 9.4], [29, 13.2]];
    var flow = function (x, y) {
      for (var i = 0; i < TIERS.length; i++) {
        var t = TIERS[i], n = TIERS[i + 1] || [37.6, 14.6];
        if (y > t[0] && y < n[0] && Math.abs(x - 16) < t[1] - 0.6 + (y - t[0]) * 0.14) return true;
      }
      return y > 2 && y < 9 && Math.abs(x - 16) < 2.4;
    };
    return build(32, 42, [
      P(STEEL[2], rrect(6, 37.6, 26, 42, 1.2), orb(12, 38, 20, 6, STEEL), STEEL[0]),
      P(CHOC[2], flow, function (x, y) {
        // glossy and smooth: a shine down its left, shadow on its right, a few
        // ripples sliding down (they move between the frames)
        var X = x + 0.5, Y = y + 0.5, hw = 2.4;
        for (var i = 0; i < TIERS.length; i++) if (Y > TIERS[i][0]) hw = TIERS[i][1] - 0.6 + (Y - TIERS[i][0]) * 0.14;
        var u = (X - 16) / hw;
        if ((Y + f * 2.5 + Math.abs(u) * 2) % 4.6 < 0.7 && Y > 9) return u < 0.3 ? CHOC[3] : CHOC[2];
        return u < -0.62 ? CHOC[3] : u < -0.36 ? CHOC[4] : u < 0.36 ? CHOC[2] : CHOC[1];
      }, CHOC[0]),
      P(STEEL[3], or(ell(16, 9.6, 6.8, 1.8), ell(16, 18.6, 10.6, 2), ell(16, 29.6, 14.6, 2.2)), function (x, y) { return x < 12 ? STEEL[4] : x > 22 ? STEEL[2] : STEEL[3]; }, STEEL[0]),
      P(CHOC[2], or(ell(16, 8.6, 5.4, 0.9), ell(16, 17.6, 9, 1), ell(16, 28.6, 12.6, 1.1), ell(16, 2.4, 2.8, 1.6)), orb(12, 7, 14, 22, CHOC), CHOC[0]),
      P(CHOC[2], ell(16, 37.4, 14.6, 2.2), orb(12, 36, 16, 4, CHOC), CHOC[0])
    ], [[13, 2, [CHOC[4]]], [7, 37, [CHOC[4] + CHOC[4] + CHOC[4]]]]);
  });
  // a stack of macarons, lemon, pink, mint and lilac, a cherry on top
  D.sweetstack = build(22, 34, (function () {
    var parts = [], cols = [YEL, PINK, MINT, VIOL, PINK], y = 33.4;
    cols.forEach(function (t, i) {
      var w = 9.6 - i * 0.6, h = 5.6, cy = y - h / 2;
      parts.push(
        P(t[2], or(ell(11, cy + 1.4, w, 1.8), ell(11, cy - 1.4, w, 1.9)), function (x, yy) { return yy + 0.5 > cy + 0.4 ? orb(8, cy, w * 2, 4, t)(x, yy) : orb(8, cy - 2.6, w * 2, 4, t)(x, yy); }, t[0]),
        P('w', rrect(11 - w + 1, cy - 0.5, 11 + w - 1, cy + 0.5, 0.4), function (x) { return x < 11 ? 'w' : 'W'; }, '2')
      );
      y -= h;
    });
    parts.push(O(11, 3.6, 2.8, 2.8, RED, 'u'), P('H', cap(11.6, 1.6, 13.6, 0.2, 0.5)));
    return parts;
  })(), [[10, 2, ['z']]]);
  // a wafer stick pushed into the ground, its top dipped in chocolate
  D.wafer = build(10, 32, [
    P('C', rrect(1.6, 6, 8.4, 32, 0.8), function (x, y) { return ((x + y) % 3 === 0 || (x - y + 99) % 3 === 0) ? 'B' : orb(3, 10, 6, 26, 'ABCDF')(x, y); }, 'A'),
    P(CHOC[2], function (x, y) { return rrect(1, 0.6, 9, 12, 1.6)(x, y) && y < 9 + Math.sin(x * 1.6) * 1.6; }, orb(3, 2, 6, 8, CHOC), CHOC[0])
  ], [[2, 2, [CHOC[4]]], [6, 4, ['x']], [3, 6, ['}']], [5, 2, [SKY[3]]]]);
  // a tree made of chocolate: a fudge trunk, scoops of milk chocolate for
  // leaves, sprinkles everywhere
  D.choctree = build(30, 50, (function () {
    var SPR = ['x', 'C', SKY[3], '}', 'r', 'w'];
    var sprinkle = function (cx, cy, r) {
      var lit = orb(cx - r * 0.3, cy - r * 0.4, r, r, CHOC);
      return function (x, y) {
        if ((x * 7 + y * 11) % 13 === 0 && ell(cx, cy, r - 1, r - 1)(x + 0.5, y + 0.5)) return SPR[(x + y * 3) % SPR.length];
        return lit(x, y);
      };
    };
    var parts = [P(DARK[2], or(rrect(12, 26, 18, 50, 1.2), tri(8, 50, 15, 42, 15, 50), tri(22, 50, 15, 42, 15, 50), limb([[15, 32], [8, 25]], 1.6), limb([[16, 30], [22, 23]], 1.6)), function (x, y) { return Math.floor(x + 0.5) % 3 === 0 ? DARK[1] : orb(13, 38, 6, 14, DARK)(x, y); }, DARK[0])];
    [[8, 22, 6.4], [22, 22, 6.6], [15, 13, 9], [7, 12, 5.4], [23, 12, 5.6], [15, 24, 6]].forEach(function (b) { parts.push(P(CHOC[2], ell(b[0], b[1], b[2], b[2] * 0.94), sprinkle(b[0], b[1], b[2]), CHOC[0])); });
    return parts;
  })());

  /* ---- Bee Land ---- */
  // a straw skep: coiled rings of straw, a dark little door with honey at its lip
  D.beehive = build(34, 40, [
    P(STRAW[2], function (x, y) { var Y = y; if (Y > 36 || Y < 2) return false; var w = Y < 8 ? Math.sqrt(Math.max(0, 1 - Math.pow((8 - Y) / 6.6, 2))) * 9 : 9 + (Y - 8) * 0.25; return Math.abs(x - 17) < w + Math.abs(Math.sin(Y * 0.9)) * 0.9; }, function (x, y) {
      var ring = (y + 0.5) % 4.4;
      if (ring < 0.9) return STRAW[0];
      if ((x * 3 + y * 7) % 11 === 0) return STRAW[1];
      return ring < 2 ? orb(12, 6, 22, 34, STRAW)(x, y) : step(STRAW, orb(12, 6, 22, 34, STRAW)(x, y), -1);
    }, STRAW[0]),
    P('f', ell(17, 29.6, 3.4, 2.8), function (x, y) { return y < 28.6 ? 'g' : 'f'; }),
    P(HONEY[2], or(rrect(13, 31.6, 21, 33.2, 0.6), cap(15, 32, 15, 35, 0.9), ell(15, 35.4, 1.1, 1.2)), orb(14, 31, 6, 4, HONEY), HONEY[0]),
    P('U', rrect(2, 36, 32, 40, 1), function (x, y) { return y < 37 ? 'V' : orb(10, 36, 30, 4, WOOD)(x, y); }, 'S')
  ], [[14, 31, [HONEY[4]]]]);
  // a giant daisy on a tall stalk, a leaf either side
  D.daisy = build(30, 64, (function () {
    var parts = [
      P(GRASS[2], rrect(13.6, 20, 16.4, 64, 1), function (x, y) { return x < 15 ? GRASS[3] : GRASS[1]; }, GRASS[0]),
      P(GRASS[2], or(leaf(15, 44, 4, 36, 3.4), leaf(15, 50, 26, 42, 3.4)), function (x, y) { return y < 41 ? GRASS[3] : GRASS[2]; }, GRASS[0])
    ];
    for (var i = 0; i < 14; i++) {
      var a = i / 14 * Math.PI * 2, tx = 15 + Math.cos(a) * 14, ty = 14 + Math.sin(a) * 13;
      parts.push(P('w', leaf(15, 14, tx, ty, 2.6), function (x, y) { return y > 15 ? 'W' : 'w'; }, '2'));
    }
    parts.push(O(15, 14, 5.4, 5.2, 'BCCDF', 'A'));
    return parts;
  })(), [[13, 12, ['A.A', '...', '.A.']]]);
  // a honey pot (no label), honey brimming down its side, a wooden dipper
  D.honeypot = build(24, 24, [
    P('U', limb([[13, 9], [18, 1.4]], 0.8), orb(15, 4, 3, 6, WOOD), 'S'),
    P('U', or(ell(18.4, 1.4, 1.9, 1.3), ell(18.6, 3, 1.6, 0.6)), orb(18, 1, 2, 2, WOOD), 'S'),
    // a cream stoneware crock with a blue band, honey brimming over and running down
    P('Y', function (x, y) { var w = 8.4 + Math.sin((y - 7) / 17 * Math.PI) * 2.2; return y > 7.4 && y < 23.6 && Math.abs(x - 12) < w; }, function (x, y) {
      if (Math.abs(y + 0.5 - 16) < 1.4) return orb(8, 14, 16, 4, BLU)(x, y);
      return orb(8, 10, 16, 16, 'ZZYYw')(x, y);
    }, 'V'),
    P('Y', rrect(3.4, 5.6, 20.6, 8.8, 1.4), orb(8, 5, 14, 4, 'ZZYYw'), 'V'),
    P(HONEY[3], or(ell(12, 6.4, 7.6, 1.6), cap(6.4, 6.4, 6.4, 15.2, 1.8), ell(6.4, 16, 2, 2.1), cap(16.2, 6.4, 16.2, 10.6, 1.6), ell(16.2, 11.2, 1.8, 1.9), cap(11.4, 7, 11.4, 9.4, 1.4)), orb(7, 5, 10, 12, HONEY), HONEY[1])
  ], [[6, 8, [HONEY[4]]], [5, 13, [HONEY[4]]]]);
  // a big clover: three heart-shaped leaves, each with its pale chevron, and a
  // little white clover flower
  D.bigclover = build(24, 20, (function () {
    var heart = function (cx, cy, r, a) {
      return turned(or(ell(cx - r * 0.52, cy - r * 0.22, r * 0.64, r * 0.64), ell(cx + r * 0.52, cy - r * 0.22, r * 0.64, r * 0.64), tri(cx - r * 1.12, cy, cx + r * 1.12, cy, cx, cy + r * 1.1)), cx, cy, a);
    };
    var leafy = function (cx, cy, r, a) {
      var lit = orb(cx - 1.4, cy - 1.6, r + 1, r + 1, GRASS);
      return P(GRASS[2], heart(cx, cy, r, a), function (x, y) {
        var c = Math.cos(-a), sn = Math.sin(-a), X = x + 0.5 - cx, Y = y + 0.5 - cy, u = X * c - Y * sn, v = X * sn + Y * c;
        if (Math.abs(v - 0.2 - Math.abs(u) * 0.7) < 0.5 && Math.abs(u) < r * 0.6) return GRASS[4];
        return lit(x, y);
      }, GRASS[0]);
    };
    return [
      P(GRASS[1], or(cap(12, 20, 12, 11, 0.9), cap(12, 20, 20, 7, 0.6)), null, GRASS[0]),
      leafy(6, 9.4, 5, 0.95), leafy(18, 9.4, 5, -0.95), leafy(12, 5, 5, Math.PI),
      P('w', ell(20.6, 5.6, 2.6, 2.4), function (x, y) { return (x + y) % 2 ? 'W' : 'w'; }, '2')
    ];
  })());
  // Queen Bee's throne: carved from honeycomb, a tall comb back with a crown
  // at its top, a plum velvet cushion, honey dripping off its edges
  D.throne = build(48, 48, [
    P(HONEY[2], or(rrect(8, 6, 40, 34, 4), tri(10, 7, 14, 0.4, 18, 7), tri(20, 7, 24, -0.6, 28, 7), tri(30, 7, 34, 0.4, 38, 7)), comb(3.4, 2, 1, HONEY, orb(16, 8, 30, 30, HONEY)), HONEY[0]),
    P(HONEY[2], or(rrect(2, 22, 11, 40, 2), rrect(37, 22, 46, 40, 2)), comb(3, 0, 0, HONEY, orb(4, 22, 12, 18, HONEY)), HONEY[0]),
    P(HONEY[2], rrect(6, 32, 42, 46, 2), comb(3, 1, 2, HONEY, orb(14, 34, 30, 12, HONEY)), HONEY[0]),
    P(BERRY[2], or(rrect(9, 28, 39, 34.4, 3), ell(24, 31, 15, 3.6)), orb(16, 29, 24, 6, BERRY), BERRY[0]),
    P('C', or(ell(14, 1.2, 1.4, 1.4), ell(24, 0.6, 1.6, 1.6), ell(34, 1.2, 1.4, 1.4)), orb(23, 0, 12, 3, GOLD), 'A'),
    P(HONEY[2], or(cap(12, 46, 12, 47.6, 1.2), cap(30, 45, 30, 48, 1), cap(4, 40, 4, 42.6, 1), cap(44, 40, 44, 43.4, 1.1), ell(23, 47, 3, 1)), orb(12, 44, 30, 6, HONEY), HONEY[0])
  ], [[23, 0, ['x']], [17, 29, [BERRY[4] + BERRY[4] + BERRY[4]]]]);

  /* ---- on the sprite sheet (tools/sheet.html?only=land5) ---- */
  var group = function (names) {
    var out = [];
    names.forEach(function (n) {
      var v = n[1];
      if (!v) return;
      if (v.rows) out.push([n[0], v]);
      else if (Array.isArray(v)) v.forEach(function (s, i) { out.push([i ? '' : n[0], s]); });
      else Object.keys(v).forEach(function (j) { var s = v[j]; (Array.isArray(s) ? s : [s]).forEach(function (t, i) { out.push([i ? '' : n[0] + j, t]); }); });
    });
    return out;
  };
  (A.sheet = A.sheet || []).push(
    ['land5 bonnie', group([['squirrel', E.squirrel], ['nut', E.nut], ['choc', E.choc], ['palm', E.palmtree], ['butterfly', E.butterfly], ['xmas', E.xmastree], ['building', E.building], ['polar', E.polarbear]])],
    ['land5 pokemon', group([['pikachu', E.pikachu], ['bulba', E.bulbasaur], ['charm', E.charmander], ['squirt', E.squirtle], ['jiggly', E.jigglypuff], ['eevee', E.eevee], ['psy', E.psyduck], ['zubat', E.zubat], ['ekans', E.ekans]])],
    ['land5 bees', group([['honeybee', E.honeybee], ['queen', E.queenbee]])],
    ['land5 deco', group([['pokecentre', D.pokecentre], ['routesign', D.routesign], ['berrybush', D.berrybush], ['hydrant', D.hydrant], ['hotdogcart', D.hotdogcart], ['streetsign', D.streetsign], ['mailbox', D.mailbox], ['bigxmastree', D.bigxmastree], ['snowbank', D.snowbank], ['chocfountain', D.chocfountain], ['sweetstack', D.sweetstack], ['wafer', D.wafer], ['choctree', D.choctree], ['beehive', D.beehive], ['daisy', D.daisy], ['honeypot', D.honeypot], ['bigclover', D.bigclover], ['throne', D.throne]])],
    ['land5 items', group([['rocket', A.rocket], ['ride', A.rocketRide], ['ball', A.pokeball], ['wish', A.wish], ['list', A.wishlist], ['pot', A.paintpot], ['block', A.paintblock], ['grass', A.tallgrass], ['honey', A.honeyblob], ['puddle', A.honeypuddle]])]
  );
})();
