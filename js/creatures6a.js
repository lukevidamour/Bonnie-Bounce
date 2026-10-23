/* ==========================================================================
   creatures6a.js — the sixth land, "HALF TERM!" (levels 46–55), part one:
   autumn by day (the pumpkin patch, the conker woods, the windy hill) and
   trick-or-treat at dusk (46–49).

   Spooky-cute, never scary: a scarecrow who hops about on his pole with a
   stitched grin, a cross little pumpkin rolling downhill, a snuffly
   hedgehog, a black cat who goes all fluffed-up and silly, a fuzzy spider
   with a tiny smile, children in home-made costumes, and friendly monsters
   who answer the door with a bowl of sweets.

   The same kit and the same rules as creatures.js: shapes lit from the
   top left, a coloured outline, big friendly eyes with a sparkle, every
   creature facing left and standing on its bottom row. This file carries
   a copy of that palette and adds its own ramps (deep, shade, base, light,
   shine) on characters of its own. No words or letters anywhere.

   Two names asked for here already belonged to older scenery — the round
   hay bale (fields) and the park bench (park, metro) — so this land's
   versions are D.haybale6 and D.bench6, and the old levels keep theirs.
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
    '(': '#1e6a34', ')': '#2f8f3e', '<': '#4cb24a', '>': '#86dc62', '^': '#d2f8a8'
  };
  // this file's own ramps take characters from U+0100 on, five at a time
  var next = 0x100;
  var ramp = function (cols) {
    var s = '';
    for (var i = 0; i < cols.length; i++) { var ch = String.fromCharCode(next++); PAL[ch] = cols[i]; s += ch; }
    return s;
  };
  var INK = 'fghij', SNOW = '21WwR', RED = 'uvxyz', GOLD = 'ABCDF', WOOD = 'STUVX', IRON = 'NOPQR', PINK = 'pqrst',
    FOX = 'klmno', PURP = 'abcde', LEAF = '()<>^', GREEN = '[]{}~';
  var PUMP = ramp(['#6e2404', '#b2440a', '#ea7016', '#ffa03c', '#ffd89c']);   // pumpkin orange
  var STEM = ramp(['#2a3410', '#46581a', '#687e26', '#94ac3e', '#d0e486']);   // a pumpkin's mossy stalk
  var STRAW = ramp(['#6a4a12', '#a07828', '#cca444', '#ecd27c', '#fff2c0']);
  var SACK = ramp(['#6a4c2a', '#98764a', '#c4a272', '#e4c898', '#fbecc8']);   // hessian
  var DENIM = ramp(['#16264e', '#263f80', '#3a5eae', '#6488d2', '#b4cef4']);
  var CROW = ramp(['#0a0a18', '#141832', '#222c56', '#38507e', '#7e9cd0']);   // glossy blue-black
  var SPINE = ramp(['#2a160a', '#4a2a14', '#704424', '#9c6c3c', '#d0a06a']);  // hedgehog spines
  var FAWN = ramp(['#9a7050', '#c89e76', '#ecd0a8', '#fbe8cc', '#fffaf0']);   // a soft cream face
  var CASE = ramp(['#24440e', '#3e7018', '#62a028', '#94cc48', '#d6f294']);   // a conker's spiky case
  var MAHOG = ramp(['#2a0804', '#4c1406', '#7a260c', '#ae4a1e', '#f0a06a']);  // a conker, polished
  var RUSS = ramp(['#4a1a0c', '#7c3216', '#b45626', '#de8648', '#fcc494']);   // russet
  var BROWN = ramp(['#3a220e', '#5e3a1a', '#86582c', '#b08048', '#dcb07a']);  // a dry brown leaf
  var MUD = ramp(['#2e1c10', '#4a3020', '#6a4a32', '#8a6a4c', '#b89a7a']);
  var SKY = ramp(['#0e4a8a', '#1c74c8', '#3aa0f0', '#86cdfc', '#e0f4ff']);
  var CAT = ramp(['#0c0814', '#181226', '#262040', '#3c3462', '#7a6eac']);    // black fur, a purple sheen
  var SPID = ramp(['#14081e', '#261238', '#3e2058', '#62397e', '#9e78c4']);   // fuzzy purple-black
  var SKIN = ramp(['#9a5a3c', '#cc8a64', '#f0b48c', '#ffd2b0', '#fff0e2']);
  var SKIN2 = ramp(['#4a2414', '#6e3a20', '#955432', '#bc7a50', '#e2aa82']);  // a darker skin
  var SKIN3 = ramp(['#7a4626', '#a8683c', '#cf9262', '#ecb888', '#fde0c4']);  // a mid skin
  var VIOL = ramp(['#3e1258', '#64208a', '#8c3cb8', '#b874dc', '#ead0ff']);   // witchy purple
  var BERRY = ramp(['#4a0e2e', '#7a1a4c', '#ae2e6e', '#dc5c96', '#ffb4d4']);  // a sweet's wrapper
  var LINEN = ramp(['#8a7c64', '#b8a888', '#ddd0b2', '#f2ead4', '#fffaf0']);  // bandages
  var BONE = ramp(['#76748a', '#a8a6bc', '#d6d4e4', '#f2f0fa', '#ffffff']);
  var KNIT = ramp(['#6a3a06', '#a0640e', '#d09a22', '#ecc458', '#fff0b0']);   // a mustard cardigan
  var HAIR = ramp(['#1a1020', '#2c1e34', '#443050', '#62487a', '#a08cc0']);   // black hair
  var GINGER = ramp(['#6a1e06', '#a03a0c', '#d4621a', '#f0904a', '#ffc896']);
  var GREY = ramp(['#6a6a7c', '#9a9aae', '#c8c8d8', '#e6e6f0', '#ffffff']);   // granny's hair
  var BOTTLE = ramp(['#06281e', '#0e4434', '#18664e', '#2c8a6c', '#7cc8a8']); // a front door, bottle green
  var BRASS = ramp(['#5a3a08', '#946a14', '#c89a28', '#ecca5c', '#fff4b4']);
  var GLOW = ramp(['#c86a10', '#f0a028', '#ffcc48', '#ffe88a', '#fffbe0']);   // warm light
  var STONE = ramp(['#6e6470', '#9a909a', '#c2b8be', '#e0d8da', '#f8f2f2']);
  var PAINT = ramp(['#8a8278', '#b8b0a2', '#ded6c6', '#f2ecde', '#ffffff']);  // painted wood, cream
  var COIR = ramp(['#4a2e10', '#74481a', '#9e6a2a', '#c4924a', '#e8c088']);   // a doormat
  var APPLE = ramp(['#5a0c10', '#94161c', '#cc2a2a', '#f05a4a', '#ffb0a0']);
  var OAKL = ramp(['#7a2a08', '#b84a10', '#e07a1c', '#f8aa38', '#ffd884']);   // oak leaves, orange-gold
  var OAKG = ramp(['#8a5208', '#c08410', '#eab42a', '#ffd85c', '#fff2b0']);   // oak leaves, gold
  var BARK = ramp(['#2e1c12', '#4a3020', '#6a4a32', '#8e6a4a', '#b8946c']);
  var CORN = ramp(['#5a5410', '#8a8020', '#b8ac3a', '#dcd068', '#f8f0b0']);   // dry cornstalk
  var SOCK = ramp(['#8a1e06', '#cc3a0c', '#ff6a1c', '#ff9a50', '#ffd0a8']);   // windsock orange
  var GHOSTG = ramp(['#8a8cb4', '#b4b8dc', '#dcdef6', '#f2f4ff', '#ffffff']); // a ghost's soft white
  var LIME = ramp(['#2e5a08', '#4e8a10', '#78bc1c', '#a8e04a', '#e0ff9a']);

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
  var and = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var not = function (a) { return function (x, y) { return !a(x, y); }; };
  // paint rows anywhere, even where the scene left nothing ('.' keeps what's there):
  // for sparkles, glows and flying bits that shouldn't get an outline
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
  var EYE = ['.##.', '#ww#', '#Ew#', '#EE#', '.##.'];
  var EYE_S = ['.#.', '#Ew', '#EE', '.#.'];
  var tri = function (ax, ay, bx, by, cx, cy) {
    return function (x, y) {
      var s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by), s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy), s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
      return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
    };
  };
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
  // a shape (or a texture) turned by a about (px, py)
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
  // a fluffy edge: an ellipse whose rim puffs out n times round
  var fluff = function (cx, cy, rx, ry, n, amp, rot) {
    return function (x, y) {
      var dx = (x - cx) / rx, dy = (y - cy) / ry, a = Math.atan2(dy, dx) + (rot || 0);
      return dx * dx + dy * dy <= Math.pow(1 + amp * Math.abs(Math.sin(a * n / 2)), 2);
    };
  };
  // a ring of spikes round (cx, cy): r to the valleys, r + len to the tips
  var spiky = function (cx, cy, r, len, n, rot) {
    return function (x, y) {
      var dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
      var t = ((((Math.atan2(dy, dx) - (rot || 0)) / (Math.PI * 2)) * n) % 1 + 1) % 1, k = 1 - Math.abs(t - 0.5) * 2;
      return d <= r + len * Math.pow(k, 2.2);
    };
  };
  // stamp rows turned by q quarter turns, clockwise
  var rotRows = function (rows, q) {
    q = ((q % 4) + 4) % 4;
    for (var n = 0; n < q; n++) {
      var h = rows.length, w = rows[0].length, out = [];
      for (var x = 0; x < w; x++) { var s = ''; for (var y = h - 1; y >= 0; y--) s += rows[y][x]; out.push(s); }
      rows = out;
    }
    return rows;
  };
  // little lights: a four-point twinkle
  var TWINKLE = ['.F.', 'FwF', '.F.'];
  var SPARK = ['..F..', '..w..', 'FwwwF', '..w..', '..F..'];
  var DIZZY = ['.##.', '#..#', '#.##', '.#..'];

  /* ==========================================================================
     THE PUMPKIN PATCH
     ========================================================================== */

  /* The scarecrow: a sack-cloth face with odd button eyes (one blue, one
     red — he made do) and a stitched grin, a floppy straw hat with an
     autumn leaf in the band, a check shirt stretched out along his
     crossbar, patched dungarees, and straw sticking out of every cuff.
     His one leg is his pole, and he hops along on it. */
  // a big button eye in ramp t, a sparkle on its top left and a hole in the middle
  var BTN = function (t) { return ['.###.', '#w' + t[3] + t[2] + '#', '#' + t[3] + 'E' + t[2] + '#', '#' + t[2] + t[2] + t[1] + '#', '.###.']; };
  var hay = function (cx, cy, n, spread, len, dir, seed) {
    // a tuft of straw: n strands fanning out from (cx, cy) about angle dir
    var fs = [];
    for (var i = 0; i < n; i++) {
      var a = dir + (i / Math.max(1, n - 1) - 0.5) * spread + Math.sin(i * 7.3 + seed) * 0.12, L = len * (0.7 + 0.3 * Math.abs(Math.sin(i * 3.1 + seed)));
      fs.push(cap(cx, cy, cx + Math.cos(a) * L, cy + Math.sin(a) * L, 0.6));
    }
    return fs;
  };
  var strawTex = function (x, y) { return (x * 3 + y) % 4 === 0 ? STRAW[2] : (x + y * 2) % 5 === 0 ? STRAW[4] : STRAW[3]; };
  var tuft = function (cx, cy, n, spread, len, dir, seed) {
    return P(STRAW[3], or.apply(null, hay(cx, cy, n, spread, len, dir, seed)), strawTex, STRAW[1]);
  };
  // a check shirt: red with darker bands each way
  var check = function (light) {
    return function (x, y) {
      var a = (x + 40) % 4 < 1.2, b = (y + 40) % 4 < 1.2;
      if (a && b) return RED[0];
      if (a || b) return step(RED, light(x, y), -1);
      return light(x, y);
    };
  };
  // hessian: a fine weave over the light
  var sackTex = function (cx, cy, rx, ry) {
    var o = orb(cx - 1.4, cy - 2, rx * 1.2, ry * 1.25, SACK);
    return function (x, y) { var t = o(x, y); return x % 2 === 0 && y % 2 === 0 && t !== SACK[1] && t !== SACK[0] ? step(SACK, t, -1) : t; };
  };
  // the floppy straw hat, scaled by s: a brim drooping at the front, a red band, an autumn leaf
  var hatParts = function (cx, cy, tilt, s) {
    s = s || 1;
    var brim = turned(function (x, y) {
      var dx = x - cx, d = Math.abs(dx) / (11 * s);
      if (d > 1) return false;
      var mid = cy + 0.4 * s + d * d * (dx < 0 ? 2.6 : 1.4) * s;
      return Math.abs(y - mid) <= (1.5 - d * 0.5) * s;
    }, cx, cy, tilt);
    var crown = turned(function (x, y) { return ell(cx + 0.8 * s, cy - 0.2 * s, 5.4 * s, 4.4 * s)(x, y) && y < cy + 0.6 * s; }, cx, cy, tilt);
    var band = turned(function (x, y) { return y > cy - 1.7 * s && y < cy - 0.1 * s; }, cx, cy, tilt);
    var weave = function (x, y) { var t = orb(cx - 2 * s, cy - 4 * s, 12 * s, 7 * s, STRAW)(x, y); return (x + y * 2) % 4 === 0 ? step(STRAW, t, -1) : t; };
    var lb = turned(function (x, y) { return x; }, cx, cy, tilt);
    var L0 = [cx + 4.4 * s, cy - 1 * s], L1 = [cx + 7.6 * s, cy - 5.4 * s], c = Math.cos(tilt), sn = Math.sin(tilt);
    var rot = function (p) { var dx = p[0] - cx, dy = p[1] - cy; return [cx + dx * c + dy * sn, cy - dx * sn + dy * c]; };
    L0 = rot(L0); L1 = rot(L1);
    return [
      P(STRAW[2], brim, weave, STRAW[0]),
      P(STRAW[2], crown, function (x, y) { return band(x + 0.5, y + 0.5) ? (x % 3 ? RED[2] : RED[1]) : weave(x, y); }, STRAW[0]),
      P(OAKL[2], leaf(L0[0], L0[1], L1[0], L1[1], 1.8 * s), function (x, y) { return (x + y) % 3 === 0 ? OAKL[3] : OAKL[2]; }, OAKL[0])
    ];
  };
  var scarecrow = function (pose) {
    var up = pose === 'hop1', by = up ? -1.5 : 0, oy = by + 1;
    var hx = 13.8, hy = 12.8 + by;
    var parts = [];
    // the pole (his leg): long and planted, or tucked up mid-hop
    parts.push(P(WOOD[2], rrect(13.4, 28 + oy, 16.6, up ? 39.4 + by : 44, 0.8), function (x, y) { return x === 14 ? WOOD[3] : x === 16 ? WOOD[1] : (y % 5 === 0 ? WOOD[1] : WOOD[2]); }, WOOD[0]));
    // straw out of his trouser bottom, round the pole
    parts.push(tuft(15, 30.4 + oy, 8, up ? 2.2 : 1.7, up ? 5.6 : 4.6, Math.PI / 2, 1));
    // the arms: the shirt along the crossbar, or flung up for the hop
    var armL = up ? [[10.6, 20 + oy], [6, 14 + oy], [3.6, 8 + oy]] : [[10, 20 + oy], [5, 20.2 + oy], [2.8, 21 + oy]];
    var armR = up ? [[19, 20 + oy], [23.6, 14 + oy], [26.4, 8 + oy]] : [[19, 20 + oy], [24.6, 20.2 + oy], [27.2, 21 + oy]];
    var cuffL = armL[2], cuffR = armR[2];
    parts.push(
      tuft(cuffR[0] + (up ? 0.6 : 0.8), cuffR[1] - (up ? 0.8 : 0), 6, 1.6, 3.4, up ? -1.0 : 0.15, 2),
      tuft(cuffL[0] - (up ? 0.6 : 0.8), cuffL[1] - (up ? 0.8 : 0), 6, 1.6, 3.4, up ? -2.1 : Math.PI - 0.15, 3)
    );
    if (!up) parts.push(P(WOOD[2], rrect(1.6, 19 + oy, 28.4, 20.8 + oy, 0.6), null, WOOD[0]));
    var shirtLight = orb(10, 15 + oy, 16, 12, RED);
    parts.push(
      P(RED[2], limb(armL, 2.4), check(shirtLight), RED[0]),
      P(RED[2], limb(armR, 2.4), check(shirtLight), RED[0]),
      // a patch on his far elbow
      P(GOLD[2], rrect(armR[1][0] - 1.4, armR[1][1] - 1.6, armR[1][0] + 1.4, armR[1][1] + 1.2, 0.4), function (x, y) { return (x + y) % 2 ? GOLD[3] : GOLD[2]; }, GOLD[0])
    );
    // the body: shirt, then dungarees with a bib and straps, gathered at the bottom
    parts.push(
      P(RED[2], rrect(8.8, 18 + oy, 19.8, 24 + oy, 2), check(shirtLight), RED[0]),
      P(DENIM[2], function (x, y) {
        var top = 22.4 + oy, bot = 31.4 + oy;
        if (y < top || y > bot) return false;
        var t = (y - top) / (bot - top), hw = 5.6 + Math.sin(t * Math.PI) * 0.8 - Math.pow(t, 3) * 2.6;
        return Math.abs(x - 14.4) <= hw;
      }, function (x, y) {
        // a square patch on one knee, stitched on
        var py = Math.round(26 + oy);
        if (x >= 15 && x <= 18 && y >= py && y <= py + 3) return (x === 15 || x === 18 || y === py || y === py + 3) ? GOLD[1] : ((x + y) % 2 ? FOX[2] : FOX[3]);
        if (Math.abs(x + 0.5 - 14.4) < 0.5 && y > 24 + oy) return DENIM[1];
        return orb(11, 22 + oy, 9, 10, DENIM)(x, y);
      }, DENIM[0]),
      P(DENIM[2], or(rrect(10.6, 20 + oy, 18.2, 24 + oy, 1), cap(11.2, 18.4 + oy, 11.2, 22 + oy, 0.8), cap(17.6, 18.4 + oy, 17.6, 22 + oy, 0.8)), function (x, y) {
        if (y === Math.round(22 + oy) && x > 12 && x < 17) return DENIM[1];
        return orb(12, 20 + oy, 8, 6, DENIM)(x, y);
      }, DENIM[0]),
      // straw at his collar
      tuft(hx + 0.4, 18.4 + by, 7, 2.6, 3.2, Math.PI / 2, 4)
    );
    // the head: hessian, gathered at the neck with twine
    parts.push(
      P(SACK[2], or(ell(hx, hy, 7, 6.2), rrect(hx - 2.4, hy + 4.4, hx + 2.6, hy + 6.8, 0.8)), function (x, y) {
        if (y === Math.round(hy + 5.4) && Math.abs(x - hx) < 3) return x % 2 ? WOOD[1] : WOOD[3];
        return sackTex(hx, hy, 7, 6.2)(x, y);
      }, SACK[0])
    );
    parts = parts.concat(hatParts(hx + 0.6, hy - 5.4, up ? -0.14 : -0.05));
    var ey = Math.round(hy - 2.8);
    var st = [
      [Math.round(hx - 6.6), ey, BTN(DENIM)],
      [Math.round(hx + 0.2), ey, BTN(RED)],
      [Math.round(hx - 6.4), ey + 5, ['3']], [Math.round(hx + 5), ey + 5, ['3']],
      // a little stitched-on nose
      [Math.round(hx - 1.6), ey + 4, ['mm']]
    ];
    // the grin, stitched on; open and shouting "wheee" mid-hop
    if (up) st.push([Math.round(hx - 3), ey + 5, ['.##.', '#xx#', '#vv#', '.##.']]);
    else st.push([Math.round(hx - 4.6), ey + 5, ['#.....#', '.#####.']]);
    return build(30, 44, parts, st, [], STRAW[1]);
  };
  // knocked flat on his back, straw everywhere, his eyes stitched shut, his
  // pole kicked up in the air — and his hat, knocked off, landed on the end of it
  var scarecrowDown = (function () {
    var hx = 9, hy = 37.6;
    var parts = [
      // straw strewn about underneath him
      tuft(19, 42.8, 9, 2.4, 7, Math.PI - 0.2, 5),
      tuft(21, 42.8, 6, 1.6, 6, -0.1, 6),
      // the pole, kicked up in the air, straw at its root
      P(WOOD[2], cap(23.6, 38, 25.2, 23, 1.5), function (x, y) { return x === 24 ? WOOD[3] : y % 5 === 0 ? WOOD[1] : WOOD[2]; }, WOOD[0]),
      tuft(24, 37.4, 8, 2.6, 4.6, -Math.PI / 2 + 0.2, 7),
      // his arm on the crossbar, sticking up, a tuft of straw for a hand
      tuft(15.4, 27.6, 6, 1.8, 3.4, -Math.PI / 2 - 0.2, 8),
      P(RED[2], limb([[16, 36], [15.6, 31.6], [15.6, 29]], 2.2), check(orb(14, 30, 8, 10, RED)), RED[0]),
      // dungarees, lying along the grass
      P(DENIM[2], rrect(17.4, 34.6, 25.4, 43, 2.6), function (x, y) {
        if (x >= 19 && x <= 22 && y >= 37 && y <= 40) return (x === 19 || x === 22 || y === 37 || y === 40) ? GOLD[1] : ((x + y) % 2 ? FOX[2] : FOX[3]);
        return orb(18, 36, 9, 9, DENIM)(x, y);
      }, DENIM[0]),
      P(RED[2], rrect(14, 34.8, 18.4, 43, 1.4), check(orb(14, 36, 6, 8, RED)), RED[0]),
      tuft(14.6, 36.6, 7, 2.4, 3, -0.2, 9),
      P(SACK[2], ell(hx, hy, 6.4, 5.8), sackTex(hx, hy, 6.4, 5.8), SACK[0])
    ].concat(hatParts(24.8, 23.4, 0.12, 0.68));
    var X = ['#.#', '.#.', '#.#'];
    return build(30, 44, parts, [[4, 34, X], [9, 34, X], [3, 38, ['3']], [13, 38, ['3']], [6, 39, ['.#.#.', '#.#.#']]], [
      // loose straws in the air
      [10, 27, [STRAW[3] + '.', '.' + STRAW[3]]], [3, 29, [STRAW[4]]], [20, 31, ['.' + STRAW[3], STRAW[3] + '.']], [28, 33, [STRAW[4]]]
    ], STRAW[1]);
  })();
  E.scarecrow = [scarecrow('hop0'), scarecrow('hop1'), scarecrowDown];

  /* The crow: round and glossy blue-black, a big sparkly eye, a sunny
     yellow beak and one feather on top he can't flatten. Flap, flap. */
  E.crow = [0, 1].map(function (f) {
    var up = !f, sx = 14.4, sy = 8.4;
    // the wing: a round shoulder and three long feathers fanned out like fingers
    var tips = up ? [[16.6, 0.6], [19.8, 0.6], [22.8, 2.4]] : [[15.4, 17.4], [18.6, 17.6], [21.8, 16]];
    var wing = or(ell(16.6, up ? 6 : 11.4, 4.6, 3.2), cap(sx, sy, tips[0][0], tips[0][1], 1.5), cap(sx + 0.8, sy, tips[1][0], tips[1][1], 1.6), cap(sx + 1.6, sy + 0.4, tips[2][0], tips[2][1], 1.6));
    var feathers = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = Math.sqrt((X - sx) * (X - sx) + (Y - sy) * (Y - sy));
      var a = Math.atan2(Y - sy, X - sx), k = ((a * (up ? 6.2 : -6.2) + 0.5) % 1 + 1) % 1;
      if (d > 4.6 && k > 0.8) return CROW[1];
      // the leading edge catches the light
      if (up ? X < 17.4 + (Y - 1) * 0.1 && d > 3 : X < 16.6 && d > 3) return CROW[3];
      return CROW[2];
    };
    return build(26, 18, [
      // tail feathers, fanned
      P(CROW[2], or(tri(19, 9.4, 25.6, 6.8, 25.6, 10.4), tri(19, 11, 25.8, 10, 24.6, 14)), function (x, y) { return (y + Math.floor(x / 2)) % 3 === 0 ? CROW[1] : y < 9 ? CROW[3] : CROW[2]; }, CROW[0]),
      // little tucked feet
      P(GOLD[1], or(cap(13.4, 14.4, 12.8, 16.6, 0.6), cap(16, 14.4, 15.6, 16.6, 0.6), cap(11.4, 17, 13.4, 17, 0.55), cap(14.4, 17, 16.4, 17, 0.55))),
      P(CROW[2], ell(15, 10.8, 7.2, 5.2), orb(12.6, 8, 10, 8, CROW), CROW[0]),
      P(CROW[3], wing, feathers, CROW[0]),
      // the feather that won't lie flat
      P(CROW[3], cap(10.2, 3.4, 11.2, 1.4, 0.6), null, CROW[0]),
      O(9.4, 7.8, 5.2, 4.9, CROW, CROW[0]),
      // the beak, open on the down-flap: caw!
      P(GOLD[2], or(tri(6.4, 4.6, 6.4, 9, -0.8, 7.2), ell(5.6, 6.8, 1.6, 2.2)), function (x, y) { return y < 6 ? GOLD[3] : GOLD[2]; }, GOLD[0]),
      P(GOLD[1], tri(6.4, 8.4, 6.4, 10.8, 0.6, f ? 11.6 : 9.4), null, GOLD[0])
    ], [[6, 4, ['.###.', '#www#', '#Eww#', '#EEw#', '.###.']], [5, 3, ['.##']], [11, 10, ['3']]], [], CROW[0]);
  });

  /* The rolling pumpkin: a big round one, cross about it, bumping down
     the hill. Four quarter turns: its ribs, stalk and grumpy face all go
     round with it (the light stays put, up and left). Stomped: squashed
     flat and wide, seeing stars. */
  var pumpkinShape = function (cx, cy, s, sy) {
    // five lobes side by side, the middle one tallest
    sy = sy || 1;
    return or(ell(cx, cy, 5.6 * s, 11 * sy), ell(cx - 5 * s, cy + 0.3 * sy, 5.6 * s, 10.4 * sy), ell(cx + 5 * s, cy + 0.3 * sy, 5.6 * s, 10.4 * sy), ell(cx - 8.6 * s, cy + 0.9 * sy, 4.2 * s, 8.6 * sy), ell(cx + 8.6 * s, cy + 0.9 * sy, 4.2 * s, 8.6 * sy));
  };
  var ribs = function (cx, s) {
    // the grooves between the lobes, in the pumpkin's own (unturned) frame
    return function (x, y) { var u = Math.abs(x - cx) / s; return Math.abs(u - 2.6) < 0.5 || Math.abs(u - 7) < 0.5; };
  };
  // a squat pumpkin as parts, sitting on by: five lobes (the outer ones
  // lower, so it's round, not boxy), grooves between them, a stalk; s its size
  var pumpkin = function (cx, by, s, t, lean) {
    var W = 12.4 * s, H = 8.4 * s, cy = by - H, tt = t || PUMP;
    var body = or(ell(cx, cy, 0.42 * W, H), ell(cx - 0.36 * W, cy + 0.03 * H, 0.42 * W, 0.95 * H), ell(cx + 0.36 * W, cy + 0.03 * H, 0.42 * W, 0.95 * H),
      ell(cx - 0.64 * W, cy + 0.12 * H, 0.36 * W, 0.8 * H), ell(cx + 0.64 * W, cy + 0.12 * H, 0.36 * W, 0.8 * H));
    var light = orb(cx - 0.3 * W, cy - 0.5 * H, 1.2 * W, 1.2 * H, tt);
    return [
      P(tt[2], body, function (x, y) {
        var u = Math.abs(x + 0.5 - cx) / W, v = light(x, y);
        return Math.abs(u - 0.18) < 0.045 || Math.abs(u - 0.5) < 0.045 ? step(tt, v, -1) : v;
      }, tt[0]),
      P(STEM[2], cap(cx, cy - 0.8 * H, cx + (lean || 0.8) * s * 2, cy - H - 3.2 * s, 1.3 * Math.max(0.8, s)), orb(cx - 1, cy - H - 1, 2.4, 2.4, STEM), STEM[0])
    ];
  };
  var rollpump = function (q) {
    var a = -q * Math.PI / 2, cx = 15, cy = q % 2 ? 15.6 : 16.8;
    var body = turned(pumpkinShape(cx, cy, 1), cx, cy, a), groove = turned(ribs(cx, 1), cx, cy, a);
    var light = orb(cx - 1, cy - 1, 13.4, 12.4, PUMP);
    // where a point of the pumpkin's own face lands once it's turned
    var at = function (u, v) { var c = Math.cos(-a), s = Math.sin(-a); return [cx + u * c + v * s, cy - u * s + v * c]; };
    var stalkA = at(0, -9.6), stalkB = at(1.2, -13.4), stalkC = at(2.8, -14.4);
    var parts = [
      P(PUMP[2], body, function (x, y) {
        var t = light(x, y);
        if (groove(x + 0.5, y + 0.5)) return step(PUMP, t, -1);
        return t;
      }, PUMP[0]),
      P(STEM[2], or(cap(stalkA[0], stalkA[1], stalkB[0], stalkB[1], 1.5), cap(stalkB[0], stalkB[1], stalkC[0], stalkC[1], 1.1)), orb(stalkA[0] - 1, stalkA[1] - 1, 3, 3, STEM), STEM[0])
    ];
    // the face, stamped on in quarter turns to match
    var face = [
      [-6.4, -2.6, ['##..', '.##.', '..##']], [0.4, -2.6, ['..##', '.##.', '##..']],
      [-6, -0.6, ['.##.', '#ww#', '#EE#', '.##.']], [0.6, -0.6, ['.##.', '#ww#', '#EE#', '.##.']],
      [-3.6, 4.4, ['.###.', '#...#']],
      [-7.6, 3.4, ['3']], [3.4, 3.4, ['3']]
    ];
    var st = face.map(function (fc) {
      var rows = rotRows(fc[2], -q), h = fc[2].length, w = fc[2][0].length;
      // the stamp's centre, turned, then its new corner
      var c = at(fc[0] + w / 2, fc[1] + h / 2);
      return [Math.round(c[0] - rows[0].length / 2), Math.round(c[1] - rows.length / 2), rows];
    });
    return build(30, 28, parts, st);
  };
  var pumpSquash = build(30, 28, [
    P(PUMP[2], function (x, y) { return pumpkinShape(15, 21.6, 1.18, 0.58)(x, y) && y < 28; }, function (x, y) {
      var t = orb(13, 18, 16, 8, PUMP)(x, y);
      return ribs(15, 1.18)(x + 0.5, y + 0.5) ? step(PUMP, t, -1) : t;
    }, PUMP[0]),
    P(STEM[2], or(cap(15, 16.4, 17.6, 14.6, 1.4), cap(17.6, 14.6, 20.6, 15.6, 1)), orb(15, 14, 4, 3, STEM), STEM[0])
  ], [[7, 19, DIZZY], [17, 19, DIZZY], [12, 24, ['.##..', '#..##']], [5, 24, ['3']], [23, 24, ['3']]], [
    [3, 10, SPARK], [22, 9, SPARK], [13, 9, TWINKLE]
  ]);
  E.rollpump = [rollpump(0), rollpump(1), rollpump(2), rollpump(3), pumpSquash];

  /* ==========================================================================
     THE CONKER WOODS
     ========================================================================== */

  /* The hedgehog: sweet and snuffly, a long pointy nose with a shiny
     black tip, brown spines lying back with pale tips (an autumn leaf
     stuck in them) and little pink feet. Bothered, he curls up into a
     spiky ball. */
  // spines that lean back: each rises gently and drops steeply (a sawtooth round the rim)
  var spines = function (cx, cy, r, len, n, rot) {
    return function (x, y) {
      var dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
      var t = ((((Math.atan2(dy, dx) - (rot || 0)) / (Math.PI * 2)) * n) % 1 + 1) % 1;
      return d <= r + len * (t < 0.72 ? t / 0.72 : (1 - t) / 0.28);
    };
  };
  // inside, rings of overlapping spines: each one a dark line along its back
  // edge, pale tips at the rim, lit up and to the left
  var spineTex = function (cx, cy, r, n, rot) {
    return function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.sqrt(dx * dx + dy * dy);
      var ring = Math.floor((r - d) / 2.4), a = ((((Math.atan2(dy, dx) - (rot || 0)) / (Math.PI * 2)) * n + ring * 0.5) % 1 + 1) % 1;
      var lit = (-0.55 * dx - 0.8 * dy) / (d + 0.01);
      var tone = lit > 0.5 ? 3 : lit > -0.25 ? 2 : 1;
      if (d > r - 0.4) tone += 1;
      if (a > 0.7 && a < 0.92) tone -= d > r - 0.4 ? 2 : 1;
      return SPINE[Math.max(0, Math.min(4, tone))];
    };
  };
  var hogLeaf = function (lx, ly, a) {
    return P(OAKL[2], leaf(lx, ly, lx + Math.cos(a) * 5.4, ly + Math.sin(a) * 5.4, 2), function (x, y) {
      var s = Math.cos(a) * (y + 0.5 - ly) - Math.sin(a) * (x + 0.5 - lx);
      return Math.abs(s) < 0.45 ? OAKL[1] : s < 0 ? OAKL[3] : OAKL[2];
    }, OAKL[0]);
  };
  var hedgehog = function (f) {
    var k = f ? 1.1 : -1.1, sniff = f ? -0.7 : 0, cx = 15.2, cy = 15.4;
    var parts = [
      // feet: the far pair behind, the near pair in front
      P(PINK[1], or(ell(11 - k, 18.8, 1.8, 1.2), ell(20 + k, 18.8, 1.8, 1.2)), null, PINK[0]),
      P(FAWN[2], ell(14.6, 16.2, 8.2, 2.6), orb(12, 14, 10, 4, FAWN), FAWN[0]),
      // the spines: a dome of them over his back
      P(SPINE[2], function (x, y) { return y < 16.8 && spines(cx, cy, 7.8, 3, 15, 0.2)(x, y); }, spineTex(cx, cy, 7.8, 15, 0.2), SPINE[0]),
      P(PINK[2], or(ell(9 + k, 18.8, 1.9, 1.2), ell(18 - k, 18.8, 1.9, 1.2)), orb(12, 18, 8, 2, PINK), PINK[0]),
      hogLeaf(18.4, 6.4, -0.8),
      // the face and the long snuffly snout
      P(FAWN[2], or(ell(7.8, 13.2, 4.4, 4), tube([[7.2, 13, 3.2], [3, 14 + sniff, 1.5], [1.6, 14.2 + sniff, 1.1]])), orb(6.4, 11.4, 6, 5, FAWN), FAWN[0]),
      P(FAWN[1], ell(9.6, 9.6, 1.6, 1.5), orb(9.2, 9.2, 2, 2, FAWN), FAWN[0]),
      P('g', ell(1.5, 13.8 + sniff, 1.5, 1.4), orb(1.1, 13.4, 1.8, 1.8, INK), 'f')
    ];
    return build(26, 20, parts, [[4, 10, ['.EE.', 'EwEE', 'EEEE', '.EE.']], [8, 14, ['3']], [3, Math.round(15.6 + sniff), ['#.']]], [[1, Math.round(12.8 + sniff), ['w']]].concat(f ? [[0, 10, [FAWN[3] + '.', '.' + FAWN[3]]]] : []), SPINE[1]);
  };
  var hedgeBall = function (f) {
    var rot = f ? Math.PI / 13 : 0, cx = 13, cy = 11.4;
    var at = function (r, a) { return [cx + Math.cos(a - rot) * r, cy + Math.sin(a - rot) * r]; };
    var lf = at(5.4, -2.3), ns = at(5, 2.3);
    return build(26, 20, [
      P(SPINE[2], spines(cx, cy, 6, 2.8, 13, -rot), spineTex(cx, cy, 6, 13, -rot), SPINE[0]),
      // a peep of his nose tucked in, and the leaf going round with him
      P(FAWN[2], ell(ns[0], ns[1], 2.4, 2.1), orb(ns[0] - 1, ns[1] - 1, 2.8, 2.8, FAWN), FAWN[0]),
      P('g', ell(ns[0] - 0.6, ns[1] + 0.3, 1.1, 1), null, 'f'),
      hogLeaf(lf[0], lf[1], -0.8 - rot)
    ], [], [], SPINE[1]);
  };
  E.hedgehog = { walk: [hedgehog(0), hedgehog(1)], ball: [hedgeBall(0), hedgeBall(1)] };

  /* Conkers: a horse-chestnut's spiky green case, hanging on its stalk
     (then wobbling), falling, split open in two on the ground with its
     creamy lining showing — and the conker itself, polished mahogany
     with its pale patch and a shine you can see your face in. */
  var prickles = function (cx, cy, r, n, rot) {
    // a round case with short, sparse prickles
    return function (x, y) {
      var dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
      var t = ((((Math.atan2(dy, dx) - (rot || 0)) / (Math.PI * 2)) * n) % 1 + 1) % 1, k = 1 - Math.abs(t - 0.5) * 2;
      return d <= r + 2.6 * Math.pow(k, 6);
    };
  };
  var caseTex = function (cx, cy, r) {
    var o = orb(cx, cy, r + 1, r + 1, CASE);
    return function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.sqrt(dx * dx + dy * dy);
      if (d > r + 0.4) return d > r + 1.2 ? CASE[4] : CASE[3];
      // little bumps where the prickles grow
      return (x * 3 + y * 5) % 7 === 0 ? CASE[1] : o(x, y);
    };
  };
  var conkerCase = function (W, H, cx, cy, rot, stalk) {
    var parts = [];
    if (stalk) parts.push(P(WOOD[2], limb(stalk, 1.4), function (x, y) { return x + 0.5 < stalk[0][0] ? WOOD[3] : WOOD[2]; }, WOOD[0]));
    parts.push(P(CASE[2], prickles(cx, cy, 6, 17, rot), caseTex(cx, cy, 6), CASE[0]));
    return build(W, H, parts, [], [], CASE[1]);
  };
  A.conker = {
    hang: [
      conkerCase(18, 20, 9, 11.4, 0, [[9, 0], [9, 4.6]]),
      conkerCase(18, 20, 10.2, 11.2, 0.15, [[9, 0], [9.6, 4.4]])
    ],
    fall: conkerCase(18, 18, 9, 9, 0.12),
    split: (function () {
      // two halves, rocked open like bowls, spiky outsides and soft cream insides
      var half = function (cx, cy, a) {
        var bowl = turned(function (x, y) { return ell(cx, cy, 6, 5.6)(x, y) && y > cy - 0.4; }, cx, cy, a);
        var rim = turned(function (x, y) { return y < cy + 1.6; }, cx, cy, a);
        var out = turned(prickles(cx, cy, 6, 17, 0), cx, cy, a);
        return [
          P(CASE[2], function (x, y) { return out(x, y) && turned(function (u, v) { return v > cy - 0.4; }, cx, cy, a)(x, y); }, function (x, y) {
            if (rim(x + 0.5, y + 0.5) && turned(ell(cx, cy, 4.8, 4.6), cx, cy, a)(x + 0.5, y + 0.5)) return (x + y) % 3 ? 'Y' : 'F';
            return caseTex(cx, cy, 6)(x, y);
          }, CASE[0]),
          P('Y', turned(function (x, y) { return ell(cx, cy, 4.8, 1.6)(x, y); }, cx, cy, a), function (x, y) { return (x + y) % 2 ? 'Z' : 'Y'; }, 'Z')
        ];
      };
      return build(26, 12, half(7, 4.6, 0.42).concat(half(19, 4.6, -0.42)), [], [], CASE[1]);
    })(),
    nut: build(12, 12, [
      P(MAHOG[2], ell(6, 6.4, 5.5, 5.2), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // the pale patch where it sat in its case
        if (ell(6.6, 10.4, 3.6, 1.9)(X, Y)) return Y > 10.6 ? 'Z' : 'Y';
        // a polished shine curving round its shoulder
        var d = Math.sqrt((X - 6.4) * (X - 6.4) + (Y - 6.8) * (Y - 6.8)), ang = Math.atan2(Y - 6.8, X - 6.4);
        if (Math.abs(d - 3.6) < 0.7 && ang > -2.6 && ang < -1.4) return MAHOG[4];
        // fine grain swirling round it
        if (Math.abs(d - 2) < 0.5 && ang > 0 && ang < 2) return MAHOG[1];
        return orb(4.6, 4.6, 7, 7, MAHOG)(x, y);
      }, MAHOG[0])
    ], [[3, 3, ['w']]], [[10, 0, ['.F.', 'FwF', '.F.']]])
  };

  /* ==========================================================================
     THE WINDY HILL
     ========================================================================== */

  /* The runaway umbrella: a stripy canopy, cross as anything about being
     blown away, its crooked handle trailing behind like a tail. Flap, flap. */
  E.brolly = [0, 1].map(function (f) {
    var cx = 14, cy = 15.4, a = f ? -0.24 : -0.12, rx = 13.4, ry = f ? 10.2 : 11.6;
    // the canopy in its own frame: a dome whose rim sags between the ribs
    var domeL = function (u, v) {
      if (Math.abs(u) > rx) return false;
      var top = -ry * Math.sqrt(1 - (u / rx) * (u / rx)), sag = Math.abs(Math.sin((u / rx + 1) * Math.PI * 3)) * (f ? 2.6 : 1.8);
      return v >= top && v <= 0.6 - sag;
    };
    // stripes that meet at the top like the segments of an orange
    var panelL = function (u, v) { var w = Math.sqrt(Math.max(0.04, 1 - (v / ry) * (v / ry))); return Math.floor((u / (rx * w) + 1) * 3) % 2; };
    var local = function (g) { return turned(function (x, y) { return g(x - cx, y - cy); }, cx, cy, a); };
    var at = function (u, v) { var c = Math.cos(-a), s = Math.sin(-a); return [cx + u * c + v * s, cy - u * s + v * c]; };
    var pink = orb(cx - 4, cy - 9, rx * 1.1, ry * 1.3, PINK), cream = orb(cx - 4, cy - 9, rx * 1.1, ry * 1.3, 'ZZYXw');
    var tip = at(0, -ry - 0.6), e1 = at(-5.6, -6.4), e2 = at(0.8, -6.4), m = at(-2.4, -2.2);
    var sw = f ? 1 : 0;
    var handle = [at(0.4, -1), [18.4 + sw, 23.4], [20.8 + sw, 26.8], [23.4 + sw, 28.6], [26.2 + sw, 27.6], [26.8 + sw, 25]];
    return build(30, 30, [
      P(IRON[2], limb(handle.slice(0, 3), 0.8), null, IRON[0]),
      P(WOOD[2], limb(handle.slice(2), 1.3), function (x, y) { return y < 27 ? WOOD[3] : WOOD[2]; }, WOOD[0]),
      P(PINK[2], local(domeL), function (x, y) {
        var p = local(panelL)(x + 0.5, y + 0.5);
        return p ? cream(x, y) : pink(x, y);
      }, PINK[0]),
      P(IRON[3], ell(tip[0], tip[1], 1.3, 1.3), null, IRON[0])
    ], [
      [Math.round(e1[0]), Math.round(e1[1]) - 2, ['##..', '.##.']], [Math.round(e2[0]), Math.round(e2[1]) - 2, ['.##.', '##..']],
      [Math.round(e1[0]), Math.round(e1[1]), EYE], [Math.round(e2[0]), Math.round(e2[1]), EYE],
      [Math.round(m[0]), Math.round(m[1]) + 1, ['.##.', '#..#']], [Math.round(e1[0]) - 1, Math.round(e1[1]) + 5, ['3']], [Math.round(e2[0]) + 4, Math.round(e2[1]) + 5, ['3']]
    ], [
      // the wind, whisking past
      [[25, 2, ['WWW.', '...w']], [26, 12, ['1WW']]], [[24, 4, ['.WWW', 'w...']], [25, 14, ['WW1']]]
    ][f]);
  });

  /* The kite: a diamond in red and yellow quarters with a big happy face,
     its tail of little bows trailing all the way down, swaying. Hands
     hold the wooden toggle at the end of the tail (.grab). */
  A.kite = [0, 1].map(function (f) {
    var ph = f ? Math.PI : 0, kx = 13, ky = 11.6, a = f ? 0.07 : -0.07;
    var diamond = function (x, y) { return Math.abs(x - kx) / 11.8 + (y < ky - 2 ? (ky - 2 - y) / 11 : (y - ky + 2) / 15) <= 1; };
    var tailX = function (y) { var t = (y - 25) / 32; return kx + Math.sin(t * Math.PI * 1.6 + ph) * 4.4 * Math.sin(t * Math.PI); };
    // bows along the tail
    var bowC = [RED, GOLD, SKY, LIME], parts = [];
    [32, 39, 46, 52.6].forEach(function (by, i) {
      var bx = tailX(by), t = bowC[i % 4];
      parts.push(P(t[2], or(ell(bx - 2.6, by, 2.8, 2.1), ell(bx + 2.6, by, 2.8, 2.1)), function (x, y) { return y + 0.5 < by - 0.4 ? t[4] : y + 0.5 < by + 0.8 ? t[3] : t[2]; }, t[0]));
      parts.push(P(t[2], ell(bx, by, 1.2, 1.4), null, t[0]));
    });
    // the end of the tail: a wooden toggle to hold
    parts.push(P(WOOD[3], rrect(kx - 3.4, 56.4, kx + 3.4, 59.6, 1.4), function (x, y) { return y < 58 ? WOOD[4] : WOOD[3]; }, WOOD[0]));
    parts.push(
      P(RED[2], turned(diamond, kx, ky, a), turned(function (x, y) {
        var X = x + 0.5, Y = y + 0.5, q = (X < kx) === (Y < ky);
        if (Math.abs(X - kx) < 0.6 || Math.abs(Y - ky) < 0.6) return WOOD[2];
        var t = q ? RED : GOLD;
        return orb(kx - 5, ky - 7, 18, 20, t)(x, y);
      }, kx, ky, a), RED[0])
    );
    // the string: a fine line, no outline, under everything
    var str = [];
    for (var y = 25; y < 57; y++) str.push([Math.round(tailX(y + 0.5) - 0.5), y, ['T']]);
    var sp = build(26, 60, parts, [[7, 8, EYE], [15, 8, EYE], [10, 14, ['#....#', '.#ww#.', '..##..']], [6, 14, ['3']], [19, 14, ['3']]], []);
    str.forEach(function (s) { var r = sp.rows[s[1]]; if (r[s[0]] === '.') sp.rows[s[1]] = r.slice(0, s[0]) + 'T' + r.slice(s[0] + 1); });
    sp.grab = [13, 58];
    return sp;
  });

  /* A sycamore "helicopter": the seed's knob with its twin wings, spinning
     round as it floats down. Four frames of the wings going round; hands
     hold underneath the knob (.grab). */
  A.seed = [0, 1, 2, 3].map(function (f) {
    var th = f * Math.PI / 4 + Math.PI / 8, kx = 12, ky = 15.6;
    var wing = function (t, near) {
      // a long flat blade from the knob, rising: farther things sit higher
      var tx = kx + Math.cos(t) * 10.6, ty = ky - 7.4 - Math.sin(t) * 5, wd = 2.6 + 0.8 * Math.abs(Math.sin(t));
      var vein = function (x, y) { var dx = tx - kx, dy = ty - ky, L = Math.sqrt(dx * dx + dy * dy); return Math.abs(((x + 0.5 - kx) * dy - (y + 0.5 - ky) * dx) / L); };
      return P(GOLD[2], leaf(kx, ky - 1, tx, ty, wd, 0), function (x, y) {
        if (vein(x, y) < 0.5) return BROWN[1];
        var d = Math.sqrt(Math.pow(x + 0.5 - tx, 2) + Math.pow(y + 0.5 - ty, 2));
        return near ? (d < 4 ? GOLD[3] : GOLD[2]) : (d < 4 ? GOLD[2] : GOLD[1]);
      }, BROWN[0]);
    };
    var A1 = th, A2 = th + Math.PI, far = Math.sin(A1) > 0 ? A1 : A2, near = far === A1 ? A2 : A1;
    var sp = build(24, 20, [
      wing(far, false),
      O(kx, ky + 0.4, 3, 2.8, BROWN, BROWN[0]),
      wing(near, true)
    ], [], [
      // a whirl of air round the wings
      [[1, 3, ['.WWW']], [17, 1, ['WW1.', '..1W']], [19, 5, ['..1', 'W1.']], [2, 9, ['1W.', '.W1']]][f]
    ], BROWN[1]);
    sp.grab = [12, 19];
    return sp;
  });

  /* ==========================================================================
     LEAVES, AND THINGS TO JUMP IN
     ========================================================================== */
  var LEAFC = [RED, OAKL, OAKG, BROWN];
  // one leaf as a part: from (x, y) at angle a, l long; a soft vein down the middle
  var leafPart = function (x, y, a, l, t) {
    var ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l;
    return P(t[2], leaf(x, y, ex, ey, l * 0.44), function (xx, yy) {
      var s = Math.cos(a) * (yy + 0.5 - y) - Math.sin(a) * (xx + 0.5 - x);
      return Math.abs(s) < 0.4 ? t[2] : s < 0 ? t[4] : t[3];
    }, t[1]);
  };
  // a heap of leaves: a soft mound, back leaves first, front ones over them
  var heap = function (W, H, top, jig, flung, seed) {
    var r = BB.rng(seed), cx = W / 2, rx = W / 2 - 0.6, n = 46, list = [];
    var mound = function (x, y) { return ell(cx, H + 1, rx, H + 1 - top)(x, y); };
    var parts = [P(RUSS[2], mound, function (x, y) { return (x * 3 + y * 5) % 4 === 0 ? RUSS[1] : RUSS[2]; }, RUSS[0])];
    for (var i = 0; i < n; i++) {
      var u = r() * 2 - 1, v = r();
      var x = cx + u * rx * 0.92, yTop = H + 1 - (H + 1 - top) * Math.sqrt(Math.max(0, 1 - u * u));
      var y = yTop + 1.4 + v * (H - yTop);
      list.push([x + (r() - 0.5) * jig, y - r() * jig * 0.5, r() * Math.PI * 2, 4.6 + r() * 2.2, LEAFC[Math.floor(r() * 4)]]);
    }
    list.sort(function (a, b) { return a[1] - b[1]; });
    list.forEach(function (L) { parts.push(leafPart(L[0] - Math.cos(L[2]) * L[3] / 2, L[1] - Math.sin(L[2]) * L[3] / 2, L[2], L[3], L[4])); });
    (flung || []).forEach(function (L) { parts.push(leafPart(L[0], L[1], L[2], 5, LEAFC[L[3]])); });
    return parts;
  };
  A.leafpile = [
    build(40, 16, heap(40, 16, 4.4, 0, null, 61)),
    build(40, 16, heap(40, 16, 3.6, 1.6, [[5, 3, -0.6, 0], [31, 2.6, -2.4, 2]], 62)),
    build(40, 16, heap(40, 16, 9.4, 0.8, [[2, 4.4, -0.9, 0], [9, 1, 0.4, 1], [16, 4, -2.2, 2], [22, 0.6, 2.6, 3], [27, 4.4, -0.2, 1], [33, 1.4, 1.8, 0], [12, 7, 2.4, 2], [30, 8, -1.2, 3]], 63))
  ];
  // single falling leaves, for the wind and for the heaps to throw up
  A.leaves = LEAFC.map(function (t) {
    var o = t[0], a = t[1], b = t[2], c = t[3], d = t[4];
    var sp = BB.sprHi([
      '....' + o + '.',
      '..' + o + o + d + o,
      '.' + o + d + c + c + o,
      o + c + c + b + o + '.',
      o + b + b + o + '..',
      a + o + o + '...'
    ], PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  });

  /* A muddy puddle with the sky in it — and the SPLOSH when you land in it. */
  A.puddle = [0, 1].map(function (f) {
    var wob = function (x) { return Math.sin(x * 0.7) * 0.4 + Math.sin(x * 0.29 + 1) * 0.5; };
    var rim = function (x, y) { return ell(18, 6.4, 17.6, 3.6)(x, y + wob(x)) || ell(9, 6.8, 8, 3)(x, y) || ell(27, 6.6, 8.6, 3.2)(x, y); };
    var water = f ? function (x, y) { return ell(18, 7.2, 14.6, 1.8)(x, y + wob(x) * 0.5); } : function (x, y) { return ell(18, 6.6, 15.4, 2.4)(x, y + wob(x) * 0.6) || ell(10, 6.9, 6.4, 1.8)(x, y); };
    return build(36, 10, [
      P(MUD[2], rim, function (x, y) { return y < 5 ? MUD[3] : (x + y) % 5 === 0 ? MUD[1] : MUD[2]; }, MUD[0]),
      P(SKY[2], water, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y < (f ? 6.4 : 5.4)) return SKY[1];
        // a cloud drifting across the reflection, and a glint
        if (ell(f ? 12 : 11, f ? 7.6 : 7, 3.4, 0.9)(X, Y) || ell(f ? 15 : 14.4, f ? 7.2 : 6.4, 2, 0.9)(X, Y)) return 'w';
        if (Math.abs(X - 26) < 2.6 && Math.abs(Y - 7) < 0.6) return SKY[4];
        return Y > 7.6 ? SKY[3] : SKY[2];
      }, MUD[1])
    ], [], f ? [
      // drops of water and blobs of mud flung up
      [4, 2, ['.' + SKY[3], SKY[3] + SKY[4]]], [9, 0, [SKY[4], SKY[3]]], [14, 3, ['w' + SKY[3]]], [20, 0, [SKY[3] + '.', SKY[4] + SKY[3]]], [26, 2, [SKY[3], SKY[2]]], [31, 1, ['.' + SKY[4], SKY[3] + '.']],
      [6, 4, [MUD[2] + MUD[3]]], [12, 1, [MUD[3], MUD[2]]], [24, 4, [MUD[3] + MUD[2]]], [29, 4, [MUD[2]]], [17, 2, [MUD[2]]]
    ] : []);
  });
  /* ==========================================================================
     TRICK OR TREAT STREET (dusk)
     ========================================================================== */

  /* The black cat: sleek, with lamp-yellow eyes, a curly tail and a red
     collar with a bell. Startled, he arches his back, his tail goes up
     like a bottle brush and his fur stands on end — more "eek!" than fierce. */
  var CAT_EYE = ['.DD.', 'DFEC', 'DCEC', '.CC.'];
  var blackcat = function (f) {
    var k = f ? 1.3 : -1.3;
    var legs = [[8, -k, 1], [11, k, 0], [18, k, 1], [21.4, -k, 0]].map(function (l) {
      return P(l[2] ? CAT[1] : CAT[2], cap(l[0], 14, l[0] + l[1], 18.8, 1.25), l[2] ? null : orb(l[0] - 1, 15, 3, 5, CAT), CAT[0]);
    });
    var tail = tube([[22.4, 11.6, 1.3], [25.4, 8.6, 1.3], [26.2, 4.8, 1.2], [24.8, 2.2, 1.1], [22.8, 2.4, 1], [22.4, 4.4, 0.9], [23.6, 5.4, 0.7]]);
    var parts = [P(CAT[2], tail, orb(24, 4, 5, 6, CAT), CAT[0])].concat(legs.slice(0, 1), legs.slice(2, 3), [
      P(CAT[2], ell(15, 11.6, 8.6, 4.4), orb(12, 8.6, 11, 6, CAT), CAT[0])
    ], legs.slice(1, 2), legs.slice(3, 4), [
      P(CAT[2], or(tri(1.8, 7.4, 2.4, 0.6, 6.4, 4.6), tri(7.6, 4, 10.8, 0.4, 11.6, 6.4)), function (x, y) {
        return (tri(2.8, 6, 3, 2.4, 5.4, 4.6)(x + 0.5, y + 0.5) || tri(8.4, 4.4, 10.4, 2, 10.8, 5.4)(x + 0.5, y + 0.5)) ? 'q' : orb(6, 3, 6, 4, CAT)(x, y);
      }, CAT[0]),
      O(6.6, 8.2, 5.4, 4.6, CAT, CAT[0]),
      // the collar and its bell
      P(RED[2], function (x, y) { return Math.abs(y - (12.2 + (x - 8) * 0.12)) < 0.9 && x > 6.4 && x < 11.4; }, null, RED[0]),
      O(8.4, 14, 1.4, 1.4, GOLD, GOLD[0])
    ]);
    return build(28, 20, parts, [[2, 6, CAT_EYE], [7, 6, CAT_EYE], [5, 10, ['3']], [4, 11, ['j.j']]], [[0, 9, ['j.', '.j']]], CAT[1]);
  };
  var catHiss = (function () {
    var parts = [
      // tail straight up and fluffed out like a bottle brush
      P(CAT[2], fluff(23, 6, 2.6, 6.4, 12, 0.3), orb(22, 3, 4, 8, CAT), CAT[0]),
      // stiff legs, up on tiptoe
      P(CAT[1], or(cap(9.4, 12, 8.6, 19, 1.2), cap(18.4, 12, 19.6, 19, 1.2)), null, CAT[0]),
      // the arched back, every hair on end
      P(CAT[2], function (x, y) { return fluff(14, 10.6, 8.4, 5.4, 18, 0.12)(x, y) && y < 13.6; }, orb(11, 5, 10, 8, CAT), CAT[0]),
      P(CAT[2], or(cap(7.4, 12, 6.2, 19, 1.25), cap(16.6, 12, 17, 19, 1.25)), orb(10, 14, 6, 6, CAT), CAT[0]),
      // ears flattened back, head low
      P(CAT[2], or(tri(2, 9, 3.6, 4.4, 6.4, 7.6), tri(7, 6.6, 11.4, 5.4, 9.8, 9)), function (x, y) { return tri(3.2, 8, 4, 5.6, 5.6, 7.6)(x + 0.5, y + 0.5) ? 'q' : orb(6, 5, 6, 4, CAT)(x, y); }, CAT[0]),
      P(CAT[2], fluff(6.4, 10.6, 5.2, 4.4, 10, 0.08), orb(5, 8.6, 6, 6, CAT), CAT[0]),
      P(RED[2], function (x, y) { return Math.abs(y - 14.6) < 0.9 && x > 5.4 && x < 10.2; }, null, RED[0]),
      O(7.4, 16.2, 1.4, 1.4, GOLD, GOLD[0])
    ];
    // eyes wide and round, a tiny pink "o" of a mouth: eek!
    return build(28, 20, parts, [[1, 8, ['.DD.', 'DFwD', 'DwED', '.DD.']], [6, 8, ['.DD.', 'DFwD', 'DwED', '.DD.']], [4, 12, ['.3.', '3q3', '.3.']]], [[0, 3, ['j..', '.j.', '..j']], [11, 0, ['.j', 'j.']], [26, 13, ['j.', '.j']]], CAT[1]);
  })();
  E.blackcat = { walk: [blackcat(0), blackcat(1)], hiss: catHiss };

  /* The spider: a round fuzzy purple-black ball with big eyes, two little
     extra ones, a tiny smile and eight waggly legs. The game hangs him on
     a thread from above, so his top is left clear. */
  E.spider = [0, 1].map(function (f) {
    var parts = [];
    [[4, 1], [16, -1]].forEach(function (side) {
      [7.6, 9.4, 11.2, 13].forEach(function (y, i) {
        var up = (i + f) % 2 ? 1.6 : -0.4, sx = side[0], d = side[1];
        var knee = [sx - d * 3.2, y - 2.6 - up], foot = [sx - d * 4.4, y + 2.2 + (i - 1.5) * 0.9 - up * 0.5];
        parts.push(P(SPID[2], limb([[sx + d * 1.6, y], knee, foot], 0.9), null, SPID[0]));
      });
    });
    parts.push(P(SPID[2], fluff(10, 10.2, 6, 5.6, 16, 0.07), function (x, y) { return (x * 3 + y * 5) % 7 === 0 ? SPID[3] : orb(8.4, 7.8, 7, 7, SPID)(x, y); }, SPID[0]));
    return build(20, 18, parts, [[5, 7, EYE], [10, 7, EYE], [8, 12, ['#..#', '.##.']], [5, 12, ['3']], [13, 12, ['3']]], [], SPID[0]);
  });

  /* Trick-or-treaters: children in home-made costumes, each with a pumpkin
     bucket — a sheet ghost (trainers peeping out), a little witch, a kid
     dressed as a pumpkin and a vampire in a collared cape. Two walking
     frames and a wave hello. Friendly; they don't hurt anyone. */
  var KID_EYE = ['.E.', 'EwE', 'EEE', '.E.'];
  var pail = function (bx, by) {
    // a little jack-o'-lantern bucket swinging from his hand
    return [
      P(INK[1], function (x, y) { return Math.abs(Math.sqrt((x - bx) * (x - bx) / 1.4 + (y - by + 1) * (y - by + 1)) - 3.4) < 0.5 && y < by - 0.6; }, null, INK[0]),
      P(PUMP[2], function (x, y) { return ell(bx, by + 1.6, 3.6, 3)(x, y) && y > by - 0.4; }, function (x, y) { return orb(bx - 1, by, 4.4, 4, PUMP)(x, y); }, PUMP[0])
    ];
  };
  var pailFace = function (bx, by) { return [Math.round(bx - 2), Math.round(by + 1), ['#.#', '...', '###']]; };
  var shoes = function (k, t, xa, xb) {
    return P(t[2], or(ell(xa - k - 0.6, 30.6, 2.4, 1.3), ell(xb + k - 0.6, 30.6, 2.4, 1.3)), function (x, y) { return y < 30 ? t[3] : t[2]; }, t[0]);
  };
  var legPair = function (k, t, tex, xa, xb) {
    return P(t[2], or(cap(xa, 24, xa - k, 29.6, 1.3), cap(xb, 24, xb + k, 29.6, 1.3)), tex || orb(9, 24, 6, 8, t), t[0]);
  };
  var kidFace = function (hx, hy, skin, mouth) {
    return [[Math.round(hx - 4.2), Math.round(hy - 1), KID_EYE], [Math.round(hx + 0.6), Math.round(hy - 1), KID_EYE],
      [Math.round(hx - 4.4), Math.round(hy + 2.4), ['3']], [Math.round(hx + 3), Math.round(hy + 2.4), ['3']],
      [Math.round(hx - 2.4), Math.round(hy + 2.4), mouth || ['#..#', '.##.']]];
  };
  // an arm from the shoulder to the hand, in a sleeve, with a hand
  var arm = function (pts, sleeve, skin, line) {
    var h = pts[pts.length - 1];
    return [P(sleeve[2], limb(pts, 1.4), orb(pts[0][0] - 1, pts[0][1] - 1, 4, 6, sleeve), line || sleeve[0]), P(skin[3], ell(h[0], h[1], 1.4, 1.4), null, skin[1])];
  };
  var kid = function (costume, pose) {
    var wave = pose === 'wave', f = pose === 'w1' ? 1 : 0, k = wave ? 0 : f ? 1.2 : -1.2;
    var hx = 10.4, hy = 9.6, bx = 4.4 + (wave ? 0 : f ? 0.6 : -0.4), by = 22.6;
    var front = [[8.6, 16.4], [6, 18.6], [bx + 0.2, by - 3.2]];
    var back = wave ? [[12.6, 16], [16, 11.6], [17, 7.8]] : [[12.6, 16.4], [14 - k, 19.6], [14.8 - k * 1.4, 21.6]];
    var parts = [], st = [], free = [];
    if (costume === 'ghost') {
      var sheetT = orb(8, 8, 12, 16, GHOSTG);
      var hem = function (x) { return 27.6 + Math.sin(x * 1.3 + f * 2) * 0.9; };
      var sheet = or(ell(hx, 10, 6.2, 6), function (x, y) { if (y < 10 || y > hem(x)) return false; var t = (y - 10) / 18; return Math.abs(x - hx - 0.4) <= 6.2 + t * 2.6; });
      parts.push(
        shoes(k, RED, 8, 13.4),
        P(INK[2], or(cap(8, 26, 8 - k, 29.4, 1.2), cap(13.4, 26, 13.4 + k, 29.4, 1.2)), null, INK[0]),
        P(GHOSTG[2], sheet, function (x, y) { return (x === 7 || x === 13) && y > 16 ? GHOSTG[1] : sheetT(x, y); }, GHOSTG[0])
      );
      // the wave lifts the sheet up with his arm under it
      if (wave) parts.push(P(GHOSTG[2], or(cap(13.4, 15, 17.6, 8.6, 2.6), ell(18, 7.6, 2.4, 2.2)), orb(14, 8, 8, 8, GHOSTG), GHOSTG[1]));
      parts = parts.concat(pail(bx, by), [P(SKIN[3], ell(bx + 0.2, by - 3.2, 1.5, 1.4), null, SKIN[1])]);
      st.push([Math.round(hx - 4.6), 8, ['.EE.', 'EwEE', 'EEEE', '.EE.']], [Math.round(hx + 0.6), 8, ['.EE.', 'EwEE', 'EEEE', '.EE.']], [Math.round(hx - 1.4), 13, ['EE', 'EE']]);
      // trainers: white toes and a stripe
      st.push([Math.round(8 - k - 2.6), 30, ['w']], [Math.round(13.4 + k - 2.6), 30, ['w']]);
    } else if (costume === 'witch') {
      var tights = function (x, y) { return Math.floor(y) % 2 ? LIME[3] : VIOL[2]; };
      parts.push(
        shoes(k, INK, 8, 12.6),
        legPair(k, VIOL, tights, 8, 12.6),
        P(GINGER[2], or(tube([[6.2, 10, 1.6], [5.4, 15, 1.3], [5.6, 17.4, 1.1]]), tube([[14.4, 10, 1.6], [15.4, 15, 1.3], [15.4, 17.4, 1.1]])), function (x, y) { return y % 2 ? GINGER[3] : GINGER[2]; }, GINGER[0])
      );
      parts = parts.concat(arm(back, VIOL, SKIN));
      parts.push(
        // the dress, a zigzag hem, a gold star on the front
        P(VIOL[2], function (x, y) { if (y < 14.6) return false; var t = (y - 14.6) / 11, hemY = 25.4 + (Math.abs(((x * 0.5) % 2) - 1)) * 1.4; return y <= hemY && Math.abs(x - hx) <= 3.6 + t * 3.4; }, function (x, y) {
          return star(hx - 0.4, 20, 2.6, 1.1, -Math.PI / 2)(x + 0.5, y + 0.5) ? GOLD[3] : orb(8, 15, 9, 12, VIOL)(x, y);
        }, VIOL[0]),
        O(hx, hy, 5.2, 4.9, SKIN, SKIN[0]),
        P(GINGER[2], function (x, y) { return ell(hx, hy - 1, 5.6, 4.4)(x, y) && y < hy - 2.2 + Math.abs(Math.sin(x * 1.1)) * 0.9; }, orb(hx - 2, hy - 4, 6, 4, GINGER), GINGER[0]),
        // the hat: a wide brim and a tall cone with a bend at the tip
        P(VIOL[2], ell(hx + 0.4, 5, 8.6, 1.7), orb(hx - 2, 4, 9, 3, VIOL), VIOL[0]),
        P(VIOL[2], or(tri(hx - 4.4, 4.8, hx + 4.4, 4.8, hx + 2.6, -0.4), cap(hx + 2.6, 0.2, hx + 6.6, 1.4, 1.2)), function (x, y) { return y > 2.6 && y < 4 ? FOX[2] : orb(hx - 2, 0, 7, 6, VIOL)(x, y); }, VIOL[0])
      );
      parts = parts.concat(pail(bx, by), arm(front, VIOL, SKIN));
      st = st.concat(kidFace(hx, hy + 0.6, SKIN));
    } else if (costume === 'pumpkin') {
      parts.push(shoes(k, WOOD, 8, 12.6), legPair(k, LIME, null, 8, 12.6));
      parts = parts.concat(arm(back, LIME, SKIN2), arm([[7, 18], [5.4, 18.8], [bx + 0.2, by - 3.2]], LIME, SKIN2));
      parts.push(
        P(PUMP[2], pumpkinShape(hx + 0.4, 20, 0.68, 0.6), function (x, y) { var t = orb(hx - 3, 15, 13, 11, PUMP)(x, y); return ribs(hx + 0.4, 0.68)(x + 0.5, y + 0.5) ? step(PUMP, t, -1) : t; }, PUMP[0]),
        O(hx, hy, 5.2, 4.9, SKIN2, SKIN2[0]),
        P(HAIR[2], function (x, y) { return ell(hx, hy - 1.6, 5.4, 4)(x, y) && y < hy - 2 + Math.abs(Math.sin(x * 1.6)) * 1.2; }, orb(hx - 2, hy - 4, 6, 4, HAIR), HAIR[0]),
        // a leafy green hat with a stalk on top
        P(LIME[2], function (x, y) { return ell(hx, 6, 5.6, 3.2)(x, y) && y < 6.6; }, orb(hx - 2, 3, 7, 4, LIME), LIME[0]),
        P(STEM[2], cap(hx + 0.4, 3.4, hx + 1.6, 0.6, 1.1), null, STEM[0]),
        P(LIME[3], leaf(hx + 1.4, 2.2, hx + 6, 0.6, 1.6), null, LIME[0])
      );
      parts = parts.concat(pail(bx, by));
      st = st.concat(kidFace(hx, hy + 0.6, SKIN2, ['#..#', '#33#', '.##.']));
      // the jack-o'-lantern face on his costume
      st.push([Math.round(hx - 3), 17, ['.#...#.', '###.###']], [Math.round(hx - 3), 21, ['#.#.#.#', '.#####.']]);
    } else {
      // the vampire: a cape with a tall red-lined collar, slick hair with a point
      var CAPE = INK;
      parts.push(
        shoes(k, INK, 8, 12.6),
        legPair(k, HAIR, null, 8, 12.6),
        P(CAPE[2], function (x, y) { if (y < 14 || y > 28.6) return false; var t = (y - 14) / 14.6; return x > hx - 3.4 - t * 2 && x < hx + 4 + t * 6.4 + Math.sin(y * 0.9 + f * 2) * 0.6; }, function (x, y) {
          var t = (y - 14) / 14.6; return x > hx + 3 + t * 6.4 ? RED[2] : orb(10, 14, 10, 14, CAPE)(x, y);
        }, CAPE[0]),
        // the collar standing up behind his head
        P(RED[2], or(tri(hx - 5.2, 15, hx - 6.6, 7, hx - 1.6, 13.4), tri(hx + 5.2, 15, hx + 6.8, 7, hx + 1.6, 13.4)), function (x, y) { return Math.abs(x - hx) > 5 ? CAPE[2] : RED[2]; }, CAPE[0])
      );
      parts = parts.concat(arm(back, HAIR, SKIN3));
      parts.push(
        P(SNOW[3], rrect(hx - 3.4, 14.4, hx + 3.4, 25, 1.4), function (x, y) { return Math.abs(x + 0.5 - hx) > 1.6 ? RED[1] : orb(hx - 1, 15, 4, 8, SNOW)(x, y); }, INK[1]),
        P(RED[2], or(tri(hx, 15.8, hx - 2.4, 14.4, hx - 2.4, 17.2), tri(hx, 15.8, hx + 2.4, 14.4, hx + 2.4, 17.2)), null, RED[0]),
        O(hx, hy, 5.2, 4.9, SKIN3, SKIN3[0]),
        P(HAIR[2], function (x, y) { return ell(hx, hy - 1.4, 5.6, 4.6)(x, y) && y < hy - 2.2 + Math.max(0, 1.6 - Math.abs(x - hx + 0.4) * 0.8) && !(x < hx - 4.6 && y > hy - 3); }, function (x, y) { return (x + y) % 4 === 0 ? HAIR[3] : orb(hx - 2, hy - 5, 6, 4, HAIR)(x, y); }, HAIR[0])
      );
      parts = parts.concat(pail(bx, by), arm(front, HAIR, SKIN3));
      st = st.concat(kidFace(hx, hy + 0.8, SKIN3, ['#..#', '.##.']));
    }
    if (costume !== 'ghost') st.push(pailFace(bx, by));
    else st.push(pailFace(bx, by));
    if (wave && costume !== 'ghost') free.push([18, 3, ['.' + 'F', 'F.']]);
    if (wave && costume === 'ghost') free.push([20, 2, ['F.', '.F']]);
    return build(22, 32, parts, st, free);
  };
  E.tot = {};
  ['ghost', 'witch', 'pumpkin', 'vampire'].forEach(function (c) {
    E.tot[c] = { walk: [kid(c, 'w0'), kid(c, 'w1')], wave: kid(c, 'wave') };
  });

  /* The front door: a porch door in bottle green with a brass knocker and
     letterbox, a little glowing window, a fanlight over it and a carved
     pumpkin on the step. Opened, warm yellow light spills out. */

  var doorway = function (open) {
    var parts = [
      // the step
      P(STONE[2], rrect(0.4, 38.6, 27.6, 43.8, 1), function (x, y) { return y < 40 ? (open ? GLOW[3] : STONE[3]) : (x % 7 === 0 ? STONE[1] : STONE[2]); }, STONE[0]),
      // the frame and lintel, painted cream, with a fanlight
      P(PAINT[2], or(rrect(0.6, 0.6, 27.4, 6.6, 1), rrect(0.6, 0.6, 4.6, 38.8, 0.6), rrect(23.4, 0.6, 27.4, 38.8, 0.6)), function (x, y) {
        if (ell(14, 6.6, 6.2, 4.6)(x + 0.5, y + 0.5) && y < 6.6) {
          if (Math.abs(x + 0.5 - 14) < 0.5 || Math.abs((x + 0.5 - 14) + (6.6 - y - 0.5) * 0.9) < 0.6 || Math.abs((x + 0.5 - 14) - (6.6 - y - 0.5) * 0.9) < 0.6) return PAINT[1];
          return y < 4 ? GLOW[3] : GLOW[2];
        }
        return x < 2 || y < 1.6 ? PAINT[4] : x > 26 ? PAINT[1] : orb(4, 2, 30, 40, PAINT)(x, y);
      }, PAINT[0])
    ];
    if (!open) {
      parts.push(P(BOTTLE[2], rrect(4.6, 6.6, 23.4, 38.6, 0.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // four sunk panels, lit on the top-left bevel
        var pan = [[7, 17.6, 20.8, 22], [24, 36.6]];
        var inX = (X > 6.6 && X < 12.6) || (X > 15.4 && X < 21.4), inY = (Y > 18 && Y < 30) || (Y > 31 && Y < 36.6);
        if (inX && inY) return (X < 7.6 || (X > 15.4 && X < 16.4) || Y < 19 || (Y > 31 && Y < 32)) ? BOTTLE[1] : BOTTLE[2];
        if (X < 5.6 || Y < 7.6) return BOTTLE[3];
        return X > 22.4 ? BOTTLE[1] : BOTTLE[2];
      }, BOTTLE[0]));
      // the little window, glowing, with a cross of glazing bars
      parts.push(P(GLOW[2], rrect(9.6, 9, 18.4, 15.6, 1.6), function (x, y) { return x === 13 || x === 14 || y === 12 ? BOTTLE[1] : (y < 11 ? GLOW[3] : GLOW[2]); }, BOTTLE[0]));
      parts.push(
        // brass knocker, knob and letterbox
        P(BRASS[2], function (x, y) { return Math.abs(Math.sqrt((x - 14) * (x - 14) + (y - 20.6) * (y - 20.6)) - 1.7) < 0.75; }, orb(13, 19.6, 3, 3, BRASS), BRASS[0]),
        P(BRASS[3], ell(14, 18.4, 1, 0.9), null, BRASS[0]),
        P(BRASS[2], rrect(10.4, 26.2, 17.6, 28, 0.6), function (x, y) { return y < 27 ? BRASS[3] : BRASS[1]; }, BRASS[0]),
        O(6.8, 25, 1.3, 1.3, BRASS, BRASS[0])
      );
    } else {
      // the hall beyond: warm light, the door swung back against the wall
      parts.push(P(GLOW[3], rrect(4.6, 6.6, 23.4, 38.6, 0.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, d = Math.abs(X - 13) / 9 + Math.abs(Y - 24) / 26;
        if (Y > 33) return Y > 36 ? GLOW[1] : GLOW[2];
        return d < 0.45 ? GLOW[4] : d < 0.8 ? GLOW[3] : GLOW[2];
      }, GLOW[0]));
      parts.push(P(BOTTLE[2], function (x, y) { return x > 19.4 && x < 23.4 && y > 6.6 + (x - 19.4) * 0.4 && y < 38.6 - (x - 19.4) * 0.3; }, function (x, y) { return x < 21 ? BOTTLE[1] : BOTTLE[2]; }, BOTTLE[0]));
    }
    parts = parts.concat(pumpkin(23.4, 38.8, 0.42));
    var st = [[21, 34, ['7.7', '...', '777']]];
    var free = open ? [[5, 39, [GLOW[4] + GLOW[4] + GLOW[3] + GLOW[3] + GLOW[4] + GLOW[4] + GLOW[3] + GLOW[4] + GLOW[4] + GLOW[3] + GLOW[4] + GLOW[4] + GLOW[3] + GLOW[4] + GLOW[4]]]] : [];
    return build(28, 44, parts, st, free);
  };
  A.door = { shut: doorway(false), open: doorway(true) };

  /* Who answers the door: friendly monsters, each holding out a bowl of
     sweets — a grinning sheet ghost, a mummy with one eye peeping out, a
     skeleton in a cosy cardigan and a smiley granny in a witch's hat.
     Waist up; they stand in the doorway. */
  var bowl = function (cx, cy) {
    // a wide orange bowl heaped with wrapped sweets
    var sw = [[cx - 3.6, cy - 1.6, BERRY], [cx - 0.6, cy - 2.6, GOLD], [cx + 2.6, cy - 1.8, SKY], [cx + 0.8, cy - 0.6, LIME], [cx - 2.2, cy - 0.4, RED]];
    var parts = sw.map(function (s) { return P(s[2][2], ell(s[0], s[1], 1.7, 1.4), orb(s[0] - 0.6, s[1] - 0.6, 2, 2, s[2]), s[2][0]); });
    parts.push(P(VIOL[2], function (x, y) { return ell(cx, cy - 0.6, 5.8, 3.6)(x, y) && y > cy - 0.6; }, function (x, y) { return y < cy + 0.6 ? VIOL[3] : orb(cx - 2, cy, 6, 4, VIOL)(x, y); }, VIOL[0]));
    return parts;
  };
  var bowlTwists = function (cx, cy) { return [[Math.round(cx - 6), Math.round(cy - 2), [GOLD[3]]], [Math.round(cx + 4), Math.round(cy - 3), [BERRY[3]]]]; };
  A.giver = {};
  // the ghost: big and round and beaming
  A.giver.ghost = (function () {
    var body = function (x, y) { return ell(13.4, 13, 9.4, 10)(x, y) || (y > 13 && x > 4 && x < 22.8 + Math.sin(y * 0.7) * 0.6); };
    return build(24, 32, [
      P(GHOSTG[2], body, orb(11, 8, 14, 18, GHOSTG), GHOSTG[0]),
      P(GHOSTG[2], cap(7, 20.6, 4.4, 22.4, 2), orb(6, 20, 4, 4, GHOSTG), GHOSTG[1])
    ].concat(bowl(6.4, 23.6)), [[7, 8, EYE], [13, 8, EYE], [8, 14, ['#......#', '.#xxxx#.', '..#yy#..', '...##...']], [5, 14, ['33']], [17, 14, ['33']]], bowlTwists(6.4, 23.6));
  })();
  // the mummy: bandages round and round, one eye peeping out, a loose end trailing
  A.giver.mummy = (function () {
    var wraps = function (x, y) {
      var v = (y + x * 0.32) % 3.2;
      return v < 0.7 ? LINEN[1] : orb(10, 6, 14, 18, LINEN)(x, y);
    };
    return build(24, 32, [
      P(LINEN[2], rrect(5, 15, 21.4, 32.4, 4), wraps, LINEN[0]),
      P(LINEN[2], or(cap(8.6, 18, 4.6, 21.4, 2.2), cap(15, 18, 7.6, 21.8, 2.2)), function (x, y) { return (x + y) % 3 === 0 ? LINEN[1] : orb(6, 18, 8, 6, LINEN)(x, y); }, LINEN[0]),
      O(12.6, 9.4, 6.8, 6.6, LINEN, LINEN[0]),
      P(LINEN[2], cap(18.4, 10, 21.6, 16.6, 1), function (x, y) { return y % 2 ? LINEN[3] : LINEN[2]; }, LINEN[0])
    ].concat(bowl(6.4, 23.6)), [
      // stripes of bandage across the head, the eye peeping out of a gap
      [6, 5, ['..' + LINEN[1] + LINEN[1] + LINEN[1] + '.......', '.........' + LINEN[1] + LINEN[1]]],
      [7, 8, [LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1]]],
      [7, 9, ['....', '....']], [8, 9, EYE], [13, 10, [LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1], '.' + LINEN[1] + LINEN[1] + '.']],
      [7, 13, [LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1] + LINEN[1]]], [9, 14, ['#..#', '.##.']], [6, 12, ['3']]
    ], bowlTwists(6.4, 23.6));
  })();
  // the skeleton: a grin full of square teeth, round sockets with a twinkle, a cosy mustard cardigan
  A.giver.skeleton = (function () {
    return build(24, 32, [
      P(KNIT[2], rrect(5, 16, 21.6, 32.4, 4.4), function (x, y) {
        var X = x + 0.5;
        if (Math.abs(X - 13.2) < 2.6 && y < 30) return Math.abs(X - 13.2) < 1.4 ? (y % 3 ? BONE[2] : BONE[1]) : SNOW[3];
        if (Math.abs(X - 15.4) < 0.6 && y % 4 === 2) return BRASS[3];
        return x % 2 ? orb(9, 16, 14, 16, KNIT)(x, y) : step(KNIT, orb(9, 16, 14, 16, KNIT)(x, y), -1);
      }, KNIT[0]),
      P(KNIT[2], or(cap(9.6, 18, 5, 21.4, 2.1), cap(15.6, 18.6, 8, 22, 2.1)), function (x, y) { return y % 2 ? KNIT[3] : KNIT[2]; }, KNIT[0]),
      P(BONE[3], or(ell(3.6, 21.8, 1.6, 1.4), ell(7.6, 22.4, 1.6, 1.4)), null, BONE[1]),
      O(12.4, 8.6, 7.2, 6.8, BONE, BONE[0]),
      P(BONE[2], rrect(7.6, 12, 16.4, 16.4, 1.6), orb(10, 12, 8, 6, BONE), BONE[0])
    ].concat(bowl(6.4, 23.6)), [
      [7, 6, ['.###.', '#hhh#', '#hwh#', '#hhh#', '.###.']], [13, 6, ['.###.', '#hhh#', '#hwh#', '#hhh#', '.###.']], [8, 7, ['w']], [14, 7, ['w']],
      [11, 11, ['h.h', '.h.']], [8, 13, ['#########', '#w#w#w#w#', '#########']], [5, 11, ['3']], [17, 11, ['3']]
    ], bowlTwists(6.4, 23.6));
  })();
  // granny: round specs, rosy cheeks, silver curls under a pointy hat, a purple shawl
  A.giver.granny = (function () {
    return build(24, 32, [
      P(VIOL[2], rrect(4.6, 17, 21.8, 32.4, 5), function (x, y) { return (x * 2 + y) % 5 === 0 ? VIOL[1] : orb(9, 17, 14, 14, VIOL)(x, y); }, VIOL[0]),
      P(GREY[2], fluff(13, 10.4, 7.6, 5.6, 10, 0.12), orb(10, 7, 10, 7, GREY), GREY[0]),
      P(SKIN[2], or(cap(9.6, 19.4, 5, 21.4, 1.9), cap(15.4, 19.6, 8, 22, 1.9)), orb(8, 19, 8, 4, SKIN), SKIN[0]),
      O(12.2, 11.4, 5.4, 5.2, SKIN, SKIN[0]),
      P(BRASS[2], O(15.6, 21, 1.4, 1.4, BRASS).f, orb(15, 20.4, 1.6, 1.6, BRASS), BRASS[0]),
      // the hat: a brim, a crooked cone, a gold buckle on its band
      P(VIOL[2], ell(13, 6.6, 9.4, 1.8), orb(10, 6, 10, 3, VIOL), VIOL[0]),
      P(VIOL[2], or(tri(8.4, 6.4, 17.4, 6.4, 15, -0.6), cap(15, -0.2, 19.4, 1.8, 1)), function (x, y) { return y > 3.6 && y < 5.4 ? (Math.abs(x + 0.5 - 13) < 1.2 ? BRASS[3] : 'g') : orb(10, 1, 8, 6, VIOL)(x, y); }, VIOL[0])
    ].concat(bowl(6.4, 23.6)), [
      // round specs over twinkly eyes
      [7, 9, ['.ii...ii.', 'i.wi.i.wi', 'i.Eiii.Ei', '.ii...ii.']],
      [7, 13, ['3']], [15, 13, ['3']], [9, 14, ['#...#', '.###.']]
    ], bowlTwists(6.4, 23.6));
  })();

  /* The treat: a sweet in a shiny twisted wrapper — berry pink with a
     cream swirl, gold foil ends — twinkling. It's each level's prize. */
  A.treat = [0, 1, 2, 3].map(function (f) {
    var cx = 8, cy = 6.2;
    var end = function (s) {
      // a twisted end: a fan of foil, pleated
      return P(GOLD[2], or(tri(cx + s * 3.6, cy, cx + s * 7.6, cy - 4, cx + s * 7.6, cy + 4), ell(cx + s * 7.2, cy, 0.9, 4)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Math.abs(Y - cy) < 0.6 && Math.abs(X - cx) < 5) return GOLD[1];
        return (Math.floor(Y - cy + 8) % 2) ? GOLD[3] : GOLD[2];
      }, GOLD[0]);
    };
    var tw = [[[0, 0, TWINKLE], [13, 8, ['F']]], [[13, 0, TWINKLE], [1, 9, ['F']]], [[12, 9, TWINKLE], [2, 1, ['F']]], [[1, 8, TWINKLE], [12, 1, ['F']]]][f];
    return build(16, 12, [
      end(-1), end(1),
      P(BERRY[2], ell(cx, cy, 4.4, 3.8), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, s = (X - cx) + (Y - cy) * 0.9 + f * 0.6;
        if (ell(cx - 1.8, cy - 1.6, 1.4, 0.8)(X, Y)) return 'w';
        if (((s % 3.4) + 3.4) % 3.4 < 1.1) return BERRY[4];
        return orb(cx - 1, cy - 1, 5, 4.4, BERRY)(x, y);
      }, BERRY[0])
    ], [], tw, GOLD[1]);
  });

  /* The trick-or-treat bucket: a grinning plastic jack-o'-lantern with a
     black handle, sweets and a lolly poking out of the top. */
  A.bucket = (function () {
    var body = pumpkin(10, 19.8, 0.8)[0];
    return build(20, 20, [
      P(INK[1], function (x, y) { return Math.abs(Math.sqrt((x - 10) * (x - 10) / 1.3 + (y - 8.6) * (y - 8.6)) - 7) < 0.7 && y < 8.4; }, null, INK[0]),
      // sweets poking out of the top, and a lolly on a stick
      P(SNOW[3], cap(13.4, 7, 15, 2, 0.5), null, SNOW[1]),
      O(15.4, 2, 2, 2, BERRY, BERRY[0]),
      P(SKY[2], ell(6.4, 6.6, 2.2, 1.6), orb(6, 6, 2.4, 2, SKY), SKY[0]),
      P(GOLD[2], ell(10.4, 5.8, 2, 1.7), orb(10, 5, 2.4, 2, GOLD), GOLD[0]),
      P(LIME[2], ell(12.8, 7, 1.8, 1.4), orb(12.4, 6.4, 2, 2, LIME), LIME[0]),
      P(PUMP[2], function (x, y) { return body.f(x, y) && y > 7; }, function (x, y) {
        if (ell(10, 7.8, 6.4, 1.2)(x + 0.5, y + 0.5)) return PUMP[0];
        return body.tex(x, y);
      }, PUMP[0])
    ], [[5, 11, ['.#...#.', '###.###']], [5, 15, ['#.#.#.#', '.#####.']]], [[15, 0, ['..w', '...']], [17, 4, ['F']]]);
  })();

  /* The doormat: bristly coir with a darker border. */
  A.doormat = build(28, 6, [
    P(COIR[2], rrect(0.4, 0.6, 27.6, 5.8, 1.2), function (x, y) {
      if (x < 2 || x > 25 || y < 1.6 || y > 4.4) return y < 1.6 ? COIR[3] : COIR[1];
      // a plain diamond pattern woven in, and the bristles' grain
      if ((Math.abs(((x - 2) % 6) - 3) + Math.abs(y - 3)) === 2) return COIR[1];
      return (x * 7 + y * 3) % 5 === 0 ? COIR[3] : (x + y) % 3 === 0 ? COIR[1] : COIR[2];
    }, COIR[0])
  ]);

  /* ==========================================================================
     SCENERY — the pumpkin patch, the conker woods, the windy hill and the
     street at dusk. Everything stands on its bottom row.
     ========================================================================== */
  var GOURDW = ramp(['#8a8670', '#bcb8a0', '#e4e0c8', '#f6f4e4', '#ffffff']); // a white pumpkin
  var GOURDG = ramp(['#1c3a14', '#2e5a1e', '#4a8030', '#7cb050', '#c4e494']); // a stripy green gourd
  var IRONG = ramp(['#0e2418', '#1a3a28', '#2a5a40', '#4a7e60', '#8ab89c']);  // painted cast iron, park green
  D.pumpkins = build(34, 18, [].concat(
    pumpkin(17.4, 15.6, 0.78),
    pumpkin(8.2, 17.8, 0.56, GOURDW, -0.6),
    pumpkin(27.2, 17.8, 0.5, PUMP, 0.6),
    [
      // a stripy green gourd and a little yellow crookneck in front
      P(GOURDG[2], ell(17.4, 15.2, 3.8, 2.8), function (x, y) { return x % 2 ? GOURDG[3] : orb(16, 13.6, 4, 3, GOURDG)(x, y); }, GOURDG[0]),
      P(GOLD[2], or(ell(22.4, 15.6, 2.4, 2.2), cap(22, 13.6, 23.8, 11.2, 1.1)), orb(22, 13, 3, 4, GOLD), GOLD[0])
    ]
  ));

  // a square hay bale, its top lit, two bands of twine round it, wisps sticking out
  D.haybale6 = build(26, 20, [
    P(STRAW[2], or(rrect(0.6, 5.4, 25.4, 19.6, 1.6), function (x, y) { return y > 1 && y < 6 && x > 1.6 + (6 - y) * 0.2 && x < 25 - (6 - y) * 0.6; }), function (x, y) {
      var top = y < 6;
      if (x === 7 || x === 18) return y < 6 ? RED[3] : RED[2];
      if (top) return (x + y * 3) % 5 === 0 ? STRAW[3] : STRAW[4];
      return (y * 3 + Math.floor(x / 4)) % 5 === 0 ? STRAW[1] : (x * 7 + y) % 9 === 0 ? STRAW[3] : y > 16 ? STRAW[1] : STRAW[2];
    }, STRAW[0]),
    tuft(1, 10, 3, 0.8, 2.6, Math.PI, 11), tuft(25, 14, 3, 0.8, 2.4, 0, 12), tuft(12, 1.4, 3, 1, 2.2, -Math.PI / 2, 13)
  ], [], [], STRAW[1]);

  // a red wheelbarrow, wheel at the front, piled with pumpkins
  D.wheelbarrow = build(36, 22, [].concat(
    [
      P(IRON[1], or(cap(20, 15, 22.6, 21.4, 0.8), cap(28, 14.4, 30.4, 21.4, 0.8)), null, IRON[0]),
      P(WOOD[2], or(cap(24, 12.6, 35.4, 9.6, 0.9), cap(8, 15.6, 24, 12.6, 0.9)), null, WOOD[0])
    ],
    pumpkin(15, 10.8, 0.5), pumpkin(22.6, 10.4, 0.46, GOURDW, -0.5), pumpkin(18.6, 8.6, 0.42, PUMP, 0.6),
    [
      P(RED[2], function (x, y) { var t = (y - 9.6) / 6.6; return y > 9.6 && y < 16.2 && x > 4.4 + t * 5.2 && x < 30.4 - t * 3.6; }, function (x, y) { return y < 11 ? RED[3] : orb(10, 8, 22, 12, RED)(x, y); }, RED[0]),
      // the wheel: a black tyre, a grey hub and spokes
      P(INK[1], ell(8, 17.6, 4.2, 4.2), function (x, y) {
        var X = x + 0.5 - 8, Y = y + 0.5 - 17.6, d = Math.sqrt(X * X + Y * Y);
        if (d < 1.4) return IRON[3];
        if (d < 2.8) return Math.abs(X) < 0.5 || Math.abs(Y) < 0.5 ? IRON[2] : INK[2];
        return d < 3.2 ? IRON[1] : INK[1];
      }, INK[0])
    ]
  ));

  // a dry cornstalk: long drooping leaves, a cob in its husk, a tassel at the top
  D.cornstalk = build(14, 48, (function () {
    var parts = [P(CORN[2], function (x, y) { return y > 3 && Math.abs(x - (7 + Math.sin(y * 0.08) * 0.6)) < 1.4; }, function (x, y) { return y % 7 === 0 ? CORN[1] : x < 7 ? CORN[3] : CORN[2]; }, CORN[0])];
    // long blades arching out and drooping at the tips, a pale midrib
    [[42, -1], [35, 1], [27, -1], [19, 1], [12, -1]].forEach(function (l) {
      var y0 = l[0], d = l[1], pts = [];
      var at = function (t) { return [7 + d * 6 * Math.sin(t * Math.PI / 2), y0 - 10 * t + 5.4 * t * t * t * t]; };
      for (var t = 0; t <= 1.001; t += 0.1) { var q = at(t); pts.push([q[0], q[1], 1.9 * (1 - t) + 0.45]); }
      parts.push(P(CORN[2], tube(pts), function (x, y) { return (x + y) % 5 === 0 ? CORN[4] : y + 0.5 < y0 - 2 ? CORN[3] : CORN[2]; }, CORN[0]));
    });
    // the cob, kernels peeping out of its husk
    parts.push(
      P(GOLD[2], ell(9.6, 27, 1.9, 3.8), function (x, y) { return (x + y) % 2 ? GOLD[3] : GOLD[2]; }, GOLD[0]),
      P(CORN[3], or(leaf(8.4, 32.4, 10.4, 24.4, 1.4), leaf(8.4, 32.4, 12, 26.6, 1.1)), function (x, y) { return x > 10 ? CORN[2] : CORN[3]; }, CORN[1]),
      // the tassel
      P(CORN[3], or(cap(7, 5, 4.4, 0.6, 0.55), cap(7, 5, 7.2, 0.4, 0.55), cap(7, 5, 9.8, 1, 0.55), cap(7, 6, 3.4, 3.4, 0.5)), null, CORN[1])
    );
    return parts;
  })(), [], [], CORN[1]);

  // a crate of apples, red and green, heaped up over the top
  D.applecrate = build(24, 18, (function () {
    var parts = [];
    [[4.4, 6.6, APPLE], [9, 5.6, LIME], [13.6, 5.8, APPLE], [18.4, 6.4, APPLE], [6.8, 3.6, APPLE], [11.4, 3, APPLE], [16, 3.4, LIME]].forEach(function (a) {
      parts.push(O(a[0], a[1], 2.6, 2.5, a[2], a[2][0]));
      parts.push(P(WOOD[1], cap(a[0] + 0.2, a[1] - 2.2, a[0] + 0.8, a[1] - 3.4, 0.4)));
    });
    parts.push(P(WOOD[2], rrect(0.6, 7, 23.4, 17.6, 0.8), function (x, y) {
      var Y = y + 0.5;
      if (Math.abs(Y - 10.6) < 0.6 || Math.abs(Y - 14.2) < 0.6) return WOOD[1];
      if (x < 2 || x > 21) return WOOD[1];
      return Y < 8.2 ? WOOD[4] : (x * 5 + y) % 11 === 0 ? WOOD[1] : WOOD[3];
    }, WOOD[0]));
    return parts;
  })());

  // a five-bar farm gate between two posts, with a diagonal brace and a latch
  D.farmgate = build(40, 22, (function () {
    var GW = 'NOPQR', parts = [];
    var wood = function (x, y) { return (x * 3 + y) % 7 === 0 ? WOOD[1] : WOOD[2]; };
    parts.push(P(WOOD[2], cap(6, 19.4, 33, 5, 1), wood, WOOD[0]));
    [4.6, 8.4, 12.2, 16, 19.4].forEach(function (y) { parts.push(P(WOOD[2], rrect(4, y - 1, 36, y + 0.8, 0.4), function (x, yy) { return yy < y - 0.2 ? WOOD[3] : wood(x, yy); }, WOOD[0])); });
    parts.push(
      P(WOOD[2], or(rrect(0.6, 1.6, 4.6, 21.8, 0.8), rrect(35.4, 1.6, 39.4, 21.8, 0.8)), function (x, y) { return y < 3 ? WOOD[4] : x === 1 || x === 36 ? WOOD[3] : (y % 4 === 0 ? WOOD[1] : WOOD[2]); }, WOOD[0]),
      P(GW[2], rrect(32.4, 7, 36.6, 9.4, 0.6), orb(33, 7, 4, 3, GW), GW[0])
    );
    return parts;
  })());

  /* ---- the conker woods ---- */
  // a big old oak in its autumn colours: a broad trunk with roots and a
  // knothole, clouds of orange and gold, leaves coming down
  D.oak = build(72, 96, (function () {
    var parts = [];
    var trunk = function (x, y) {
      if (y < 40 || y > 96) return false;
      var t = (y - 40) / 56, hw = 6 + Math.pow(t, 3) * 8 + (t > 0.86 ? (t - 0.86) * 34 : 0);
      return Math.abs(x - 36 - Math.sin(t * 2.4) * 1.4) < hw;
    };
    // the trunk and its big boughs (they show between the clouds of leaves)
    parts.push(
      P(BARK[2], or(trunk, limb([[34, 58], [26, 46], [14, 36]], 2.6), limb([[38, 56], [48, 44], [60, 36]], 2.6), limb([[36, 50], [37, 34], [34, 20]], 3), limb([[28, 48], [22, 50]], 1.6)), function (x, y) {
        var X = x + 0.5;
        if (ell(39.6, 72, 2.6, 3.6)(X, y + 0.5)) return ell(40, 72.6, 1.8, 2.8)(X, y + 0.5) ? 'g' : BARK[1];
        var g = (X * 0.9 + Math.sin(y * 0.3) * 2) % 4;
        if (g < 0.9) return BARK[1];
        return orb(30, 62, 14, 40, BARK)(x, y);
      }, BARK[0])
    );
    // clouds of leaves: darker underneath, gold and orange catching the light on top
    var balls = [
      [12, 40, 8, RUSS], [60, 40, 8, RUSS], [24, 46, 7, OAKL], [48, 46, 7, RUSS], [36, 44, 9, OAKL],
      [8, 28, 8, OAKL], [64, 28, 8, OAKG], [20, 34, 10, OAKG], [52, 34, 10, OAKL], [36, 32, 11, RUSS],
      [16, 20, 10, OAKL], [56, 20, 10, OAKG], [36, 18, 12, OAKG], [26, 10, 9, OAKL], [46, 9, 9, OAKG], [36, 6, 7, OAKG]
    ];
    balls.forEach(function (b, i) {
      var t = b[3], low = b[1] > 36;
      parts.push(P(t[2], fluff(b[0], b[1], b[2], b[2] * 0.9, 9, 0.09, i), function (x, y) {
        var v = orb(b[0] - b[2] * 0.3, b[1] - b[2] * 0.45, b[2] * 1.15, b[2] * 1.05, t)(x, y);
        if (low) v = step(t, v, -1);
        // little leaves: a fleck of light, a fleck of shade
        var h = (x * 7 + y * 13 + i * 5) % 17;
        return h === 0 ? step(t, v, 1) : h === 5 ? step(t, v, -1) : v;
      }, t[0]));
    });
    return parts;
  })(), [], [
    // leaves coming down
    [3, 54, [RED[3] + RED[2], '.' + RED[1]]], [65, 52, ['.' + OAKG[3], OAKG[2] + OAKG[1]]], [11, 68, [OAKL[3] + OAKL[2], OAKL[1] + '.']], [59, 66, [RUSS[3] + '.', RUSS[2] + RUSS[1]]],
    [5, 84, ['.' + OAKG[3], OAKG[2] + OAKG[1]]], [64, 80, [RED[3] + RED[2], '.' + RED[1]]], [20, 60, [OAKG[3], OAKG[1]]], [54, 58, [OAKL[3] + OAKL[1]]]
  ]);

  // a bush gone russet and orange
  D.leafbush = build(30, 20, [[7, 13, 6.4, RUSS], [15, 9, 8, OAKL], [23, 12, 6.8, RED], [15, 15, 6, OAKG]].map(function (b, i) {
    var t = b[3];
    return P(t[2], fluff(b[0], b[1], b[2], b[2] * 0.9, 8, 0.1, i), function (x, y) {
      var v = orb(b[0] - 2, b[1] - 3, b[2] * 1.2, b[2], t)(x, y);
      return (x * 5 + y * 3 + i) % 7 === 0 ? step(t, v, 1) : v;
    }, t[0]);
  }), [], [[3, 4, [OAKG[3]]], [26, 3, [RED[3]]]]);

  // a log pile: three logs and two on top, rings on their cut ends
  D.logpile = build(34, 16, (function () {
    var parts = [];
    [[7, 12.2], [17, 12.2], [27, 12.2], [12, 5.2], [22, 5.2]].forEach(function (c) {
      parts.push(P(BARK[2], rrect(c[0] - 4, c[1] - 3.8, c[0] + 7, c[1] + 3.8, 3.6), function (x, y) { return y % 2 ? BARK[3] : BARK[2]; }, BARK[0]));
      parts.push(P(WOOD[3], ell(c[0], c[1], 4, 3.8), function (x, y) {
        var d = Math.sqrt(Math.pow(x + 0.5 - c[0], 2) + Math.pow(y + 0.5 - c[1], 2));
        if (d > 3.2) return BARK[1];
        return Math.floor(d * 1.1) % 2 ? WOOD[2] : WOOD[4];
      }, BARK[0]));
    });
    return parts;
  })());

  // a mossy stump with bracket fungi up its side and two red toadstools
  D.fungi = build(18, 12, [
    P(BARK[2], rrect(5.4, 1.4, 12.6, 12, 1.4), function (x, y) { return y < 2.8 ? (x % 2 ? WOOD[3] : WOOD[4]) : x % 3 === 0 ? BARK[1] : BARK[3]; }, BARK[0]),
    P(LEAF[3], function (x, y) { return ell(8, 2, 3.6, 1.4)(x, y) && x < 9.4; }, null, LEAF[1]),
    // bracket fungi stepping up the side of the stump
    P(GOLD[2], or(function (x, y) { return ell(12.6, 5.4, 3.2, 1.6)(x, y) && y < 5.8; }, function (x, y) { return ell(12.6, 8.8, 4, 1.8)(x, y) && y < 9.2; }), function (x, y) { return y === 4 || y === 7 ? GOLD[4] : GOLD[2]; }, GOLD[0]),
    // two toadstools, red with white spots
    P(SNOW[3], or(rrect(1.8, 7.4, 4, 12, 0.8), rrect(14.6, 9.6, 16, 12, 0.6)), null, SNOW[1]),
    P(RED[2], function (x, y) { return ell(3, 7.6, 3, 3.4)(x, y) && y < 8; }, orb(2, 5, 4, 4, RED), RED[0]),
    P(RED[2], function (x, y) { return ell(15.4, 10, 2.4, 2.4)(x, y) && y < 10.2; }, orb(15, 8.6, 3, 3, RED), RED[0])
  ], [[1, 5, ['w.w']], [3, 6, ['w']], [14, 8, ['w']]]);

  /* ---- the windy hill ---- */
  // a park bench: slatted seat and back on green cast-iron ends
  D.bench6 = build(30, 16, [
    P(IRONG[2], or(cap(4, 1.4, 4, 15.4, 1.1), cap(26, 1.4, 26, 15.4, 1.1), cap(3.4, 10.4, 1.6, 15.4, 1), cap(26.6, 10.4, 28.4, 15.4, 1)), orb(4, 4, 6, 12, IRONG), IRONG[0]),
    P(WOOD[2], or(rrect(1.6, 0.6, 28.4, 3.6, 1), rrect(1.6, 4.6, 28.4, 7.6, 1), rrect(1, 9, 29, 12, 1)), function (x, y) {
      if (y === 1 || y === 5 || y === 9) return WOOD[4];
      return (x * 5 + y) % 9 === 0 ? WOOD[2] : WOOD[3];
    }, WOOD[0]),
    // the arms
    P(IRONG[2], or(cap(4, 7.6, 1.6, 7.6, 0.9), cap(26, 7.6, 28.4, 7.6, 0.9)), null, IRONG[0])
  ]);

  // a weathervane: a gold cockerel over the four arms (balls at the ends, no letters)
  D.weathervane = build(18, 46, [
    P(IRON[1], rrect(8, 15, 10, 46, 0.6), function (x) { return x === 8 ? IRON[2] : IRON[1]; }, IRON[0]),
    P(IRON[1], or(cap(1.6, 21, 16.4, 21, 0.6), cap(5, 23.8, 13, 18.2, 0.5)), null, IRON[0]),
    O(1.6, 21, 1.4, 1.4, BRASS, BRASS[0]), O(16.4, 21, 1.4, 1.4, BRASS, BRASS[0]), O(4.8, 24, 1.2, 1.2, BRASS, BRASS[0]), O(13.2, 18, 1.2, 1.2, BRASS, BRASS[0]),
    P(BRASS[2], rrect(7.4, 13.4, 10.6, 15.6, 0.8), orb(8, 13, 3, 3, BRASS), BRASS[0]),
    // the cockerel: a red comb, a beak, a puffed chest, a big curly tail, on one leg
    P(BRASS[2], or(
      ell(8.6, 8.6, 4.4, 3.4),
      ell(4.6, 4.6, 2.4, 2.4),
      cap(5.4, 6.4, 6.6, 8, 1.6),
      tri(10.6, 7, 17.4, 0.6, 16.4, 8.6),
      tri(10.6, 9, 17.6, 5, 15, 12),
      cap(9, 11.4, 9, 13.6, 0.7)
    ), function (x, y) {
      if (x > 11 && (x + y) % 3 === 0) return BRASS[1];
      return orb(6, 4, 10, 9, BRASS)(x, y);
    }, BRASS[0]),
    P(GOLD[3], tri(2.6, 4, 0.2, 5, 2.6, 5.8), null, BRASS[0]),
    P(RED[2], or(ell(4, 1.8, 1, 1.1), ell(5.4, 1.6, 1, 1.1), ell(4.2, 7.2, 0.8, 1.2)), null, RED[0])
  ], [[3, 3, ['E']]], [], BRASS[1]);

  // a striped windsock on a pole, filling out and flapping
  D.windsock = [0, 1].map(function (f) {
    var sock = function (x, y) {
      var t = (x - 4.4) / 21;
      if (t < 0 || t > 1) return false;
      var droop = f ? t * t * 3.6 + Math.sin(t * 9) * 0.8 * t : t * t * 1.2;
      var mid = 6 + droop, hw = 3.4 - t * 1.6 + (f ? Math.sin(t * 7) * 0.4 : 0);
      return Math.abs(y - mid) <= hw;
    };
    return build(26, 36, [
      P(IRON[2], rrect(2.4, 2, 4.6, 36, 0.6), function (x) { return x === 3 ? IRON[3] : IRON[2]; }, IRON[0]),
      O(3.5, 1.6, 1.4, 1.4, BRASS, BRASS[0]),
      P(SOCK[2], sock, function (x, y) { return Math.floor((x - 4.4) / 4.2) % 2 ? 'R' : orb(8, 3, 16, 8, SOCK)(x, y); }, SOCK[0])
    ]);
  });

  /* ---- trick or treat ---- */
  // a carved jack-o'-lantern with a candle in it, the glow flickering
  D.jackolantern = [0, 1].map(function (f) {
    var g = f ? GLOW[2] : GLOW[3], h = f ? GLOW[3] : GLOW[4];
    return build(16, 16, pumpkin(8, 15.8, 0.62), [
      [3, 8, ['.' + g + '...' + g + '.', g + h + g + '.' + g + h + g]],
      [4, 11, [g + '.' + g + '.' + g + '.' + g, '.' + g + h + h + h + g + '.']]
    ], f ? [[1, 4, ['7']]] : [[13, 5, ['7']]]);
  });

  // a cobweb: spokes and sagging rings of fine silk (no outline)
  D.cobweb = (function () {
    var rows = [], cx = 12, cy = 11.6;
    for (var y = 0; y < 24; y++) rows.push(new Array(25).join('.'));
    var set = function (x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x > 23 || y > 23) return; rows[y] = rows[y].slice(0, x) + c + rows[y].slice(x + 1); };
    var spokes = [];
    for (var i = 0; i < 8; i++) spokes.push(i * Math.PI / 4 + 0.2);
    spokes.forEach(function (a) {
      for (var r = 0; r < 16; r += 0.4) { var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (x < 0 || x > 23.4 || y < 0 || y > 23.4) break; set(x, y, r > 9 ? '1' : 'R'); }
    });
    [3, 6, 9.4].forEach(function (R) {
      for (var k = 0; k < 8; k++) {
        var a0 = spokes[k], a1 = spokes[(k + 1) % 8] + (k === 7 ? Math.PI * 2 : 0);
        for (var s = 0; s <= 1; s += 0.04) {
          var a = a0 + (a1 - a0) * s, rr = R - Math.sin(s * Math.PI) * R * 0.14;
          set(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, R > 8 ? '1' : 'R');
        }
      }
    });
    // a dewdrop catching the light
    set(cx + 6, cy - 0.6, 'w'); set(cx - 3, cy + 5.4, 'w');
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  })();

  // a crooked white picket fence
  D.picketfence = build(32, 18, (function () {
    var parts = [P(PAINT[2], or(rrect(0.4, 6, 31.6, 7.8, 0.6), rrect(0.4, 12.4, 31.6, 14.2, 0.6)), function (x, y) { return y === 6 || y === 12 ? PAINT[4] : PAINT[2]; }, PAINT[0])];
    [[3.4, 0.06, 0], [9.6, -0.08, 1.4], [16, 0.1, 0.4], [22.4, -0.05, 1], [28.6, 0.09, 0.2]].forEach(function (p) {
      var shape = turned(or(rrect(p[0] - 2, 3 + p[2], p[0] + 2, 18, 0.4), tri(p[0] - 2, 3.4 + p[2], p[0] + 2, 3.4 + p[2], p[0], 0.4 + p[2])), p[0], 17, p[1]);
      parts.push(P(PAINT[3], shape, function (x, y) { return x + 0.5 < p[0] - 0.6 ? PAINT[4] : x + 0.5 > p[0] + 1 ? PAINT[1] : PAINT[3]; }, PAINT[0]));
    });
    return parts;
  })());

  // three carved pumpkins stacked up, each pulling a different face, glowing
  D.pumpkinstack = (function () {
    var G = function (rows) { return rows.map(function (r) { return r.replace(/g/g, GLOW[2]).replace(/h/g, GLOW[4]); }); };
    return build(22, 30, [].concat(pumpkin(11, 29.8, 0.82), pumpkin(10.6, 17.4, 0.6, PUMP, 1), pumpkin(11.6, 8.4, 0.42, PUMP, -0.6)), [
      // the bottom one beams, the middle one's surprised, the top one winks
      [6, 19, G(['.g...g.', 'ghg.ghg'])], [5, 23, G(['g.g.g.g.g', '.ghhhhhg.', '..ggggg..'])],
      [7, 10, G(['hg..hg', 'gg..gg'])], [9, 13, G(['.g.', 'ghg', '.g.'])],
      [8, 3, G(['ggg.hg'])], [9, 5, G(['g..g', '.gg.'])]
    ]);
  })();

  var EYE_BIG = ['.###.', '#www#', '#wEE#', '#wEE#', '.###.'];
  // a big wobbly inflatable ghost on the lawn, waving, on its little fan
  D.inflatable = [0, 1].map(function (f) {
    var a = f ? 0.06 : -0.04;
    var body = turned(function (x, y) {
      return ell(15, 11.6, 9.6, 9.6)(x, y) || (y > 11 && y < 34.6 + Math.sin(x * 0.9) * 0.8 && Math.abs(x - 15) < 9.6 + (y - 11) * 0.12);
    }, 15, 36, a);
    var arms = turned(or(cap(6, 18, 1.6, 12.4, 2.4), cap(24, 18, 28.4, 13 + (f ? -2 : 0), 2.4)), 15, 36, a);
    var seam = turned(function (x, y) { return Math.abs(y - 21) < 0.5 || Math.abs(y - 29) < 0.5; }, 15, 36, a);
    var light = orb(11, 6, 18, 26, GHOSTG);
    return build(30, 40, [
      P(IRON[1], or(cap(4, 38, 8, 33, 0.4), cap(26, 38, 22, 33, 0.4)), null, IRON[0]),
      P(GHOSTG[2], arms, light, GHOSTG[0]),
      P(GHOSTG[2], body, function (x, y) { return seam(x + 0.5, y + 0.5) ? GHOSTG[1] : light(x, y); }, GHOSTG[0]),
      P(INK[2], rrect(10, 35.4, 20, 40, 1), function (x, y) { return y < 37 ? INK[3] : (x % 2 ? INK[1] : INK[2]); }, INK[0])
    ], [[8, 7, EYE_BIG], [16, 7, EYE_BIG], [10, 15, ['#........#', '.#xxxxxx#.', '..#yyyy#..', '...####...']], [6, 14, ['33']], [21, 14, ['33']]]);
  });

  /* ---- on the sprite sheet (tools/sheet.html?only=land6) ---- */
  var group = function (names) {
    var out = [];
    names.forEach(function (n) {
      var v = n[1];
      if (!v) return;
      if (v.rows) out.push([n[0], v]);
      else if (Array.isArray(v)) v.forEach(function (s, i) { out.push([i ? '' : n[0], s]); });
      else Object.keys(v).forEach(function (j) {
        var s = v[j];
        if (s.rows) out.push([n[0] + j, s]);
        else if (Array.isArray(s)) s.forEach(function (t, i) { out.push([i ? '' : n[0] + j, t]); });
        else Object.keys(s).forEach(function (m) { var u = s[m]; (Array.isArray(u) ? u : [u]).forEach(function (t, i) { out.push([i ? '' : j + m, t]); }); });
      });
    });
    return out;
  };
  (A.sheet = A.sheet || []).push(
    ['land6 autumn', group([['scarecrow', E.scarecrow], ['crow', E.crow], ['rollpump', E.rollpump], ['hedgehog', E.hedgehog], ['brolly', E.brolly]])],
    ['land6 items', group([['conker', A.conker], ['kite', A.kite], ['seed', A.seed], ['leafpile', A.leafpile], ['leaves', A.leaves], ['puddle', A.puddle], ['treat', A.treat], ['bucket', A.bucket], ['doormat', A.doormat]])],
    ['land6 street', group([['blackcat', E.blackcat], ['spider', E.spider], ['tot', E.tot], ['door', A.door], ['giver', A.giver]])],
    ['land6 deco', group([['pumpkins', D.pumpkins], ['haybale6', D.haybale6], ['wheelbarrow', D.wheelbarrow], ['cornstalk', D.cornstalk], ['applecrate', D.applecrate], ['farmgate', D.farmgate],
      ['oak', D.oak], ['leafbush', D.leafbush], ['logpile', D.logpile], ['fungi', D.fungi], ['bench6', D.bench6], ['weathervane', D.weathervane], ['windsock', D.windsock],
      ['jackolantern', D.jackolantern], ['cobweb', D.cobweb], ['picketfence', D.picketfence], ['pumpkinstack', D.pumpkinstack], ['inflatable', D.inflatable]])]
  );
})();
