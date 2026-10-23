/* ==========================================================================
   creatures6b.js — the sixth land, "HALF TERM!" (levels 46–55), part two:
   Halloween night's friendly-spooky cast (Pumpkin Town, the graveyard
   jamboree, the Haunted Mansion, the witch's wood, firework night and the
   witch's tower), the Witch herself, her potions and the frog they turn
   you into, and THE BIGGEST PUMPKIN EVER.

   Spooky-cute, never scary (Luke, 23 Oct: "fun halloween … the Disney
   Haunted Mansion / Nightmare Before Christmas vibe"): every skull grins
   with a sparkle in its eye holes, every ghost has rosy cheeks, the
   pumpkins are mischievous rather than menacing, the Witch is cross and
   silly. Those films are vibes to evoke, drawn in this game's own hand —
   nothing is traced.

   The same kit and the same rules as creatures.js: round soft shapes lit
   from the top left (each shade from a five-tone ramp, deep to shine), a
   coloured outline, big friendly eyes with a sparkle; creatures face left
   and stand on their bottom row. Like the other land files this one keeps
   its own copy of the palette, adds its own ramps, and depends only on
   BB.ART.kit. No words or letters anywhere.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, K = A.kit, E = A.en, D = A.deco, ell = K.ell, cap = K.cap, limb = K.limb, rrect = K.rrect;

  // creatures.js's palette, copied, so the shared tones (eyes, blush, outline) match exactly
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
    '!': '#56546c', '$': '#7a7892', '%': '#a3a1b8', '&': '#c9c7da', '*': '#eeedf7'
  };
  // this file's own ramps (deep, shade, base, light, shine) take characters from U+0100 on
  var next = 0x100;
  var ramp = function (cols) {
    var s = '';
    for (var i = 0; i < cols.length; i++) { var ch = String.fromCharCode(next++); PAL[ch] = cols[i]; s += ch; }
    return s;
  };
  // one extra colour, named by a character of its own
  var tone = function (col) { var ch = String.fromCharCode(next++); PAL[ch] = col; return ch; };

  var INK = 'fghij', SNOW = '21WwR', GOLD = 'ABCDF', WOOD = 'STUVX', PURP = 'abcde';
  var BONE = ramp(['#5e5274', '#9c92ae', '#dcd6da', '#f6f2ec', '#ffffff']);    // a skeleton's ivory, moon-shaded
  var GHO = ramp(['#3a8a8a', '#86cec4', '#bff2e6', '#e4fff8', '#ffffff']);     // the hitchhikers' pale sea-glass
  var GHP = ramp(['#4a4c8e', '#7c80c2', '#aeb2e8', '#d8dcff', '#ffffff']);     // the things they carry, ghost-lilac
  var PUMP = ramp(['#6a2206', '#ae420c', '#e87214', '#ffa43a', '#ffdc98']);    // pumpkin
  var STEM = ramp(['#1e3812', '#365e1c', '#56882a', '#88b84a', '#cce890']);    // stalk and vine
  var LIME = ramp(['#1a5212', '#36981e', '#74d82e', '#bcff66', '#f2ffd2']);    // magic, potions
  var WISP = ramp(['#1c2c8c', '#2e5ae2', '#64a2ff', '#b6dcff', '#ffffff']);    // will-o'-the-wisp
  var TOAD = ramp(['#22401e', '#3a6a2c', '#5a9a3e', '#8cc85e', '#d0f0a2']);    // a toad's mossy back
  var WART = ramp(['#3a1a52', '#5e2e80', '#8650ae', '#b086d8', '#e2ccff']);    // his purple warts
  var FROG = ramp(['#185a1c', '#2c8c2a', '#4cbc3a', '#8ce466', '#d8ffb8']);    // the frog (that's Bonnie!)
  var HAT = ramp(['#24093e', '#421670', '#62289e', '#8c50cc', '#c8a2f2']);     // the Witch's hat and dress
  var HAIR = ramp(['#701c04', '#bc420c', '#ec6e1c', '#ffa046', '#ffd690']);    // her wild orange curls
  var SKIN = ramp(['#9e5e48', '#dc9278', '#f4bc9c', '#ffdac4', '#fff2e6']);
  var STRAW = ramp(['#644410', '#9a7224', '#c89e40', '#e8cc78', '#fff0bc']);   // broom bristles
  var BOOK = ramp(['#4a0e1a', '#86182c', '#c22e3c', '#ec6458', '#ffb4a0']);    // a spellbook's red leather
  var PAPER = ramp(['#9c907c', '#cec4ae', '#eee8d8', '#faf6ec', '#ffffff']);
  var CAPE = ramp(['#0c3c34', '#12645a', '#1c9282', '#46c2a8', '#b4f2e0']);    // an apprentice's teal
  var MARB = ramp(['#6e6c8c', '#a6a4c4', '#d6d6ea', '#f0f0fa', '#ffffff']);    // marble
  var STONE = ramp(['#363a58', '#585e82', '#848cae', '#b0b8d4', '#e0e6f6']);   // moonlit headstones
  var MOSS = ramp(['#1c4422', '#2c6a2e', '#48963a', '#7ac254', '#c2ea96']);
  var MAHOG = ramp(['#2a1206', '#4a220e', '#70401c', '#9a6434', '#cf9a64']);   // the grandfather clock
  var STEEL = ramp(['#3c4256', '#646c84', '#98a0b6', '#c6cede', '#f4f8ff']);
  var GLASS = ramp(['#2e2470', '#4c4cbc', '#8496ec', '#c4dcff', '#ffffff']);   // a crystal ball
  var CLOTH = ramp(['#2e0c3e', '#521a68', '#7a2c94', '#a656c0', '#dca8ec']);   // its draped table
  var WAX = ramp(['#b0a088', '#dcd0b8', '#f4eedc', '#fffaf0', '#ffffff']);
  var BARK = ramp(['#2a1c38', '#46345a', '#64507c', '#8a76a4', '#c0b0d8']);    // a twisty tree, moonlit
  var BLUSH = '3';

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
  var minus = function (a, b) { return function (x, y) { return a(x, y) && !b(x, y); }; };
  var and = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var shift = function (f, dx, dy) { return function (x, y) { return f(x - dx, y - dy); }; };
  var tri = function (ax, ay, bx, by, cx, cy) {
    return function (x, y) {
      var s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by), s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy), s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
      return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
    };
  };
  // a shape (or a texture) turned by a about (px, py)
  var turned = function (f, px, py, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return function (x, y) { var dx = x - px, dy = y - py; return f(px + dx * c + dy * s, py - dx * s + dy * c); };
  };
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
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
  var leaf = function (ax, ay, bx, by, w) {
    var dx = bx - ax, dy = by - ay, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    return function (x, y) {
      var px = x - ax, py = y - ay, t = (px * ux + py * uy) / L, d = Math.abs(-px * uy + py * ux);
      return t >= 0 && t <= 1 && d <= w * Math.sin(Math.PI * Math.pow(t, 0.7));
    };
  };
  // a tube through points [x, y, r], its radius easing from one to the next
  var tube = function (pts) {
    return function (x, y) {
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
        var t = L ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)) : 0;
        var px = a[0] + t * dx - x, py = a[1] + t * dy - y, r = a[2] + (b[2] - a[2]) * t;
        if (r > 0 && px * px + py * py <= r * r) return true;
      }
      return false;
    };
  };
  // a curl: a spiral line from radius r0 out to r1 over `turns`, as a thin tube
  var curl = function (cx, cy, r0, r1, a0, turns, w, dir) {
    var pts = [], N = Math.max(8, Math.round(turns * 18));
    for (var k = 0; k <= N; k++) {
      var t = k / N, a = a0 + (dir || 1) * t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, w * (0.55 + 0.45 * t)]);
    }
    return tube(pts);
  };
  // a fluffy edge: an ellipse with n soft bumps round it
  var fluff = function (cx, cy, rx, ry, n, amp, ph) {
    return function (x, y) {
      var dx = (x - cx) / rx, dy = (y - cy) / ry, a = Math.atan2(dy, dx);
      return dx * dx + dy * dy <= Math.pow(1 + amp * Math.max(0, Math.sin(a * n + (ph || 0))), 2);
    };
  };
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
  /* build(W, H, parts, stamps, free, opt): the scene, then the stamps
     (detail on the figure), then the free paint (sparkles, glows, off the
     figure). opt.rim: a colour for the outer outline instead of the deep
     shade (ghosts glow at their edges); opt.halo: a ring of light round
     the whole figure, [inner, outer, sparse] characters; opt.ground: settle
     it onto the bottom row. */
  var build = function (W, H, parts, stamps, free, opt) {
    opt = opt || {};
    var rows = K.scene(W, H, parts);
    (stamps || []).forEach(function (s) { K.stamp(rows, s[0], s[1], s[2]); });
    var at = function (x, y) { return x < 0 || y < 0 || x >= W || y >= H ? '.' : rows[y][x]; };
    if (opt.rim) rows = rows.map(function (r, y) {
      return r.replace(/#/g, function (m, x) { return (at(x - 1, y) === '.' || at(x + 1, y) === '.' || at(x, y - 1) === '.' || at(x, y + 1) === '.') ? opt.rim : '#'; });
    });
    if (opt.halo) {
      // distance (in rings) from the figure, out to three: the rings grow by
      // side neighbours, then corners too, then sides, so they come out round
      var dist = [], x, y, k;
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) dist.push(at(x, y) === '.' ? 9 : 0);
      for (k = 1; k <= 3; k++) {
        var grow = [];
        for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
          if (dist[y * W + x] !== 9) continue;
          for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
            var X = x + dx, Y = y + dy;
            if ((dx || dy) && (k === 2 || !(dx && dy)) && X >= 0 && Y >= 0 && X < W && Y < H && dist[Y * W + X] === k - 1) grow.push(y * W + x);
          }
        }
        grow.forEach(function (i) { dist[i] = k; });
      }
      rows = rows.map(function (r, y) {
        return r.replace(/./g, function (m, x) {
          var d = dist[y * W + x];
          if (m !== '.' || d < 1 || d > 3) return m;
          if (d === 1) return opt.halo[0];
          if (d === 2) return opt.halo[1];
          return (x + y) % 2 ? opt.halo[2] : '.';
        });
      });
    }
    (free || []).forEach(function (s) { put(rows, s[0], s[1], s[2]); });
    // opt.ground: settle the drawing onto the bottom row (things that stand on the floor)
    if (opt.ground) {
      var n = 0;
      while (n < H - 1 && !/[^.]/.test(rows[H - 1 - n])) n++;
      if (n) rows = new Array(n + 1).join('.').split('').map(function () { return new Array(W + 1).join('.'); }).concat(rows.slice(0, H - n));
    }
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  };
  var EYE = ['.##.', '#ww#', '#Ew#', '#EE#', '.##.'];
  var EYE_S = ['.#.', '#Ew', '#EE', '.#.'];
  var TWINKLE = ['.F.', 'FwF', '.F.'];
  var DIZZY = ['.###.', '#...#', '#.#.#', '#..#.', '.##..'];

  /* ==========================================================================
     PUMPKIN TOWN AND THE GRAVEYARD
     ========================================================================== */

  /* SKELLY: a jaunty, friendly skeleton — a big round skull with a grin,
     dark eye holes each with a glint so he looks pleased, rosy cheekbones
     and a bat-wing bow tie; he walks with a jolly swing of his arms. Stomp
     him and he falls into a little heap of bones, the skull sat on top,
     dizzy (pile); then he pulls himself back together, wobbling (rise). */
  // a bone: a rod with a knuckle at each end
  var bone = function (ax, ay, bx, by, r) {
    var dx = bx - ax, dy = by - ay, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L * r * 0.8, ny = dx / L * r * 0.8, k = r * 1.05;
    return or(cap(ax, ay, bx, by, r), ell(ax + nx, ay + ny, k, k), ell(ax - nx, ay - ny, k, k), ell(bx + nx, by + ny, k, k), ell(bx - nx, by - ny, k, k));
  };
  var BONEF = tone('#bab2c6');   // bones on the far side, a shade back
  var limbP = function (pts, r, far) { return P(far ? BONEF : BONE[2], limb(pts, r), function (x, y) { return far ? BONEF : BONE[2]; }, BONE[0]); };
  var knob = function (x, y, r, far) { return P(far ? BONEF : BONE[2], ell(x, y, r, r), far ? null : orb(x - 0.4, y - 0.4, r + 0.4, r + 0.4, BONE[1] + BONE.slice(1, 4) + BONE[3]), BONE[0]); };
  // a bat-wing bow tie centred at (cx, cy): two scalloped wings and an orange knot
  var batTie = function (cx, cy, w, h, a) {
    var T = function (f) { return a ? turned(f, cx, cy, a) : f; };
    var wing = function (s) {
      var body = tri(cx, cy - 0.6, cx + s * w, cy - h, cx + s * w, cy + h * 0.9);
      return minus(body, or(ell(cx + s * w * 0.42, cy + h * 1.05, w * 0.22, h * 0.55), ell(cx + s * w * 0.86, cy + h * 1.1, w * 0.2, h * 0.5)));
    };
    return [P(PURP[1], T(or(wing(-1), wing(1))), function (x, y) { return y + 0.5 < cy - h * 0.25 ? PURP[2] : PURP[1]; }, PURP[0]),
      P(PUMP[2], T(ell(cx, cy, 1.7, 1.5)), function (x, y) { return y + 0.5 < cy ? PUMP[3] : PUMP[2]; }, PUMP[0])];
  };
  var skull = function (cx, cy, a) {
    var T = function (f) { return a ? turned(f, cx, cy + 4, a) : f; };
    return [P(BONE[2], T(or(ell(cx, cy, 7.6, 7), rrect(cx - 6.2, cy + 1, cx + 4.4, cy + 6.4, 3.2))), T(orb(cx - 1.4, cy - 0.6, 8.4, 8, BONE)), BONE[0])];
  };
  // the face on the skull at (cx, cy): eye holes (with a glint, or dizzy), nose, grin
  var SOCKET = ['.EEE.', 'EwwEE', 'EwEEE', 'EEEEE', '.EEE.'];
  var skullFace = function (cx, cy, mode) {
    var X = Math.round(cx), Y = Math.round(cy), st = [];
    if (mode === 'dizzy') st.push([X - 7, Y - 3, DIZZY], [X - 1, Y - 3, DIZZY]);
    else st.push([X - 7, Y - 3, SOCKET], [X - 1, Y - 3, SOCKET]);
    st.push([X - 3, Y + 2, ['E.E', '.E.']]);
    if (mode === 'oh') st.push([X - 3, Y + 4, ['.EE.', 'EEEE', '.EE.']]);
    else st.push([X - 7, Y + 3, ['E.........E', '.EwEwEwEwE.', '..EEEEEEE..']]);
    st.push([X - 8, Y + 2, [BLUSH + BLUSH]], [X + 3, Y + 2, [BLUSH + BLUSH]]);
    return st;
  };
  var ribcage = function (cx, cy, a) {
    var T = function (f) { return a ? turned(f, cx, cy + 5, a) : f; };
    return [
      P(BONE[2], T(cap(cx, cy - 4, cx, cy + 5.6, 1)), null, BONE[0]),
      P(BONE[2], T(or(ell(cx, cy + 0.6, 4.4, 3.2), rrect(cx - 3.8, cy - 2.6, cx + 3.8, cy + 0.6, 2))), T(function (x, y) {
        var Y = y + 0.5 - (cy - 2.6), X = x + 0.5 - cx;
        if (Math.abs(X) < 0.9) return Y < 1 ? BONE[3] : BONE[2];
        return Math.floor(Y) % 3 === 2 ? BONE[0] : Math.floor(Y) % 3 === 0 && X < 0 ? BONE[3] : BONE[2];
      }), BONE[0]),
      P(BONE[2], T(ell(cx, cy + 5.8, 3.8, 1.9)), T(orb(cx - 1, cy + 5, 4, 2.4, BONE)), BONE[0])
    ];
  };
  var skelly = function (mode, f) {
    var parts = [], st = [], free = [];
    if (mode === 'walk') {
      var s = f ? -1 : 1, hx = 11.5, hy = 7.6 + (f ? 0.5 : 0), by = f ? 0.5 : 0;
      // one leg striding forward with a little kick, one pushing off behind;
      // the arms swing the other way, the forward one flung up, jolly
      var fwdLeg = [[11, 27.4 + by], [8, 30.4], [6.4, 34]], backLeg = [[13.2, 27.4 + by], [14.6, 31], [16.6, 34]];
      var fwdArm = [[9.4, 19.4 + by], [6.2, 21.6], [3.6, 19]], backArm = [[14.8, 19.4 + by], [17.4, 22.4], [20.2, 23.2]];
      var foot = function (lg, far) { var e = lg[2]; return P(far ? BONEF : BONE[2], ell(e[0] - 1.3, 34.6, 2.6, 1.3), null, BONE[0]); };
      // f0: the near leg forward and the near arm back; f1: the other way round
      var nearLeg = s > 0 ? fwdLeg : backLeg, farLeg = s > 0 ? backLeg : fwdLeg;
      var nearArm = s > 0 ? backArm : fwdArm, farArm = s > 0 ? fwdArm : backArm;
      parts.push(limbP(farArm, 0.9, true), knob(farArm[2][0], farArm[2][1], 1.7, true), limbP(farLeg, 1, true), foot(farLeg, true));
      parts = parts.concat(ribcage(12.2, 21.4 + by));
      parts.push(limbP(nearLeg, 1), foot(nearLeg), limbP(nearArm, 0.9), knob(nearArm[2][0], nearArm[2][1], 1.7));
      parts = parts.concat(skull(hx, hy, f ? 0.08 : -0.06), batTie(12, 17.2 + by, 4.6, 2.4));
      st = skullFace(hx, hy, 'grin');
    } else if (mode === 'pile') {
      // a heap of bones on the floor, his ribs on their side, the skull sat on top
      parts.push(
        P(BONEF, or(bone(3, 33.4, 12.6, 31.2, 0.9), bone(12, 34.2, 21.4, 32, 0.9)), null, BONE[0]),
        P(BONE[2], ell(16.4, 31.6, 4.4, 3.2), function (x, y) { var X = x + 0.5 - 12.2; return Math.floor(X) % 3 === 2 ? BONE[0] : y + 0.5 < 30 ? BONE[3] : BONE[2]; }, BONE[0]),
        P(BONE[2], or(bone(1.6, 35, 9.4, 33.2, 0.9), bone(7, 31.4, 15.6, 35, 0.9), bone(15.6, 34.8, 22.4, 30.6, 0.9)), null, BONE[0]),
        P(BONE[2], ell(6, 31.6, 3.4, 1.7), orb(5, 31, 3.6, 2.2, BONE), BONE[0])
      );
      parts = parts.concat(batTie(19.6, 33.6, 3.4, 1.9, 0.3), skull(10.6, 21.8, -0.22));
      st = skullFace(10.6, 21.8, 'dizzy');
      free.push([2, 10, TWINKLE], [16, 11, ['.D.', 'DFD', '.D.']], [9, 8, ['F']]);
    } else {
      // rise: legs back under him, the rest stacked on a little crooked, his
      // skull not quite on straight, arms out wobbling for balance
      parts.push(
        limbP([[11, 27.4], [9.6, 31], [9.2, 34]], 1), limbP([[13.4, 27.4], [15, 31], [15.6, 34]], 1),
        P(BONE[2], or(ell(7.8, 34.6, 2.6, 1.3), ell(14.4, 34.6, 2.6, 1.3)), null, BONE[0])
      );
      parts = parts.concat(ribcage(12.6, 21.4, 0.18));
      parts.push(
        limbP([[10, 19.8], [6.4, 18], [3, 19.6]], 0.9), knob(2.6, 19.8, 1.7),
        limbP([[15.6, 18.8], [19.2, 17.6], [21.6, 14.4]], 0.9), knob(21.6, 13.8, 1.7)
      );
      parts = parts.concat(skull(14.2, 7.6, 0.32), batTie(13.8, 17, 4.2, 2.3, -0.25));
      st = skullFace(14.2, 7.6, 'oh');
      // wobble marks either side
      free.push([0, 13, ['F.', '.F', 'F.']], [22, 22, ['.F', 'F.', '.F']]);
    }
    return build(24, 36, parts, st, free);
  };
  E.skelly = { walk: [skelly('walk', 0), skelly('walk', 1)], pile: skelly('pile'), rise: skelly('rise') };

  /* THE GHOST DOG: a little white ghost dog who joins Bonnie in Pumpkin
     Town and floats along behind him, lighting the dark with his glowing
     jack-o'-lantern nose. Long floppy ears, a wispy curl of a tail where
     his back legs would be, a purple collar with a gold tag. float: a
     gentle bob, ears swaying · sleep: curled up, eyes shut · happy: ears
     up, tongue out. Each frame's .nose is where the glow's centre is
     (full-density px), for the game to light. */
  var NOSE = PUMP[1] + PUMP[2] + '6' + '7' + '8', EAR = '!$%&*';
  var ghostdog = function (mode, f) {
    var dy = mode === 'float' && f ? 1 : 0, sw = mode === 'float' ? (f ? 1 : -1) : 0, S = function (g) { return shift(g, 0, dy); };
    var parts = [], st = [], free = [], nose;
    if (mode === 'sleep') {
      nose = [2.4, 18.4];
      parts.push(
        // curled up nose to tail, the wispy curl of it wrapped round his front
        P('W', ell(16, 17.6, 9, 5.8), orb(13, 15, 11, 8, SNOW), '2'),
        P('W', tube([[23.4, 18.4, 2.6], [22, 21.8, 2], [16, 23, 1.5], [11, 22.8, 1.1], [7.6, 22, 0.7]]), orb(14, 20, 12, 5, SNOW), '2'),
        P(PURP[2], cap(13.2, 13.4, 12.6, 19.8, 1.1), function (x, y) { return x + 0.5 < 12.8 ? PURP[3] : PURP[2]; }, PURP[0]),
        O(8.8, 16.8, 6, 5, SNOW, '2'),
        P('w', ell(4.4, 19.2, 3.4, 2.3), orb(4, 18.4, 3.6, 2.6, SNOW), '2'),
        // his ear draped over his head, its tip on the floor
        P(EAR[2], leaf(10.4, 12.4, 16.6, 21.4, 2.5), orb(12, 14, 6, 8, EAR), '$'),
        P(STEM[3], cap(2.6, 16.6, 3.4, 15.6, 0.5), null, STEM[0]),
        P(NOSE[2], ell(2.4, 18.4, 2.2, 2), function (x, y) { return Math.abs(x + 0.5 - 2.6) < 0.5 && y + 0.5 > 17.2 ? NOSE[1] : orb(1.8, 17.8, 2.8, 2.6, NOSE)(x, y); }, PUMP[0])
      );
      st.push([4, 15, ['#..#', '.##.']], [9, 15, ['#..#', '.##.']], [3, 20, ['#..', '.##']], [9, 18, [BLUSH + BLUSH]]);
      // a little sleep bubble from his nose
      free.push([0, 12, ['.LL.', 'L..L', 'L..L', '.LL.']], [3, 10, ['L']]);
    } else {
      var happy = mode === 'happy';
      nose = [2.4, 11.2 + dy];
      // ears: long and floppy and swaying, or pricked up when he's happy
      var farEar = happy ? leaf(12, 6.4, 18, 3.4, 2) : leaf(12, 5.6, 17 + sw * 0.6, 13.6, 2);
      var nearEar = happy ? leaf(10.6, 6, 15.6, 0.8, 2.6) : leaf(10.6, 5, 15.4 + sw, 16.4, 2.8);
      parts.push(
        P(EAR[1], S(farEar), null, '$'),
        // a ghost's body: plump at his chest, tapering to a wispy curl of a tail
        P('W', S(tube([[14, 14, 4.8], [18.6, 14.6, 3.8], [22.4, 14, 2.6], [25.2, 11.8, 1.6], [25.8 + sw * 0.4, 9, 1.1], [24.4 + sw * 0.6, 7.2, 0.8]])), S(orb(15, 11, 12, 8, SNOW)), '2'),
        // front paws, two little stubs
        P('2', S(cap(13, 15.6, 13.2, 19, 1.4)), null, '1'),
        P('W', S(or(cap(9.6, 15.4, 9, 19.2, 1.5), ell(8.6, 19.4, 1.9, 1.2))), S(orb(8, 16, 3, 4, SNOW)), '2'),
        P(PURP[2], S(cap(12.8, 10.6, 12.2, 16.6, 1.2)), S(function (x, y) { return x + 0.5 < 12.4 ? PURP[3] : PURP[2]; }), PURP[0]),
        P('C', S(ell(11.8, 17.6, 1.3, 1.3)), S(orb(11.4, 17.2, 1.6, 1.6, GOLD)), 'A'),
        O(8.8, 10.4 + dy, 6.2, 5.8, SNOW, '2'),
        P('w', S(ell(4.4, 12.6, 3.8, 2.8)), S(orb(4, 12, 4, 3, SNOW)), '2'),
        P(EAR[2], S(nearEar), S(orb(11, 7, 5, 8, EAR)), '$'),
        // the nose: a little jack-o'-lantern, lit
        P(STEM[3], S(cap(2.6, 9.4, 3.4, 8.4, 0.5)), null, STEM[0]),
        P(NOSE[2], S(ell(2.4, 11.2, 2.2, 2)), S(function (x, y) { return Math.abs(x + 0.5 - 2.6) < 0.5 && y + 0.5 > 10 ? NOSE[1] : orb(1.8, 10.6, 2.8, 2.6, NOSE)(x, y); }), PUMP[0])
      );
      if (happy) st.push([3, 8 + dy, ['.##.', '#..#']], [8, 8 + dy, ['.##.', '#..#']], [2, 14 + dy, ['#...', '.###']], [4, 15 + dy, ['rr', 'rq', '.r']]);
      else st.push([3, 6 + dy, EYE], [8, 6 + dy, EYE], [2, 14 + dy, ['#...', '.###']]);
      st.push([9, 12 + dy, [BLUSH + BLUSH]]);
    }
    var sp = build(28, 24, parts, st, free);
    sp.nose = nose;
    return sp;
  };
  E.ghostdog = { float: [ghostdog('float', 0), ghostdog('float', 1)], sleep: ghostdog('sleep'), happy: ghostdog('happy') };

  /* THE HITCHHIKING GHOSTS: three friendly ghosts in the graveyard who tag
     along behind Bonnie. Pale sea-glass ghosts, glowing at their edges,
     their hats and things a ghostly lilac. 0: thumb out, hitching a ride ·
     1: floating along, waving. They float on wispy tails, no feet.
     (1) tall and skinny, a battered top hat, a carpet bag;
     (2) short and round, a bowler hat and a long wispy beard;
     (3) little and lanky, a striped stocking cap and a scarf. */
  var GHK = ramp(['#7c3c70', '#b872a8', '#e6aad8', '#fcdcf2', '#ffffff']);   // their stripes, ghost-pink
  var GLOW = tone('#7fdccb');
  var gbody = function (f, tex) { return P(GHO[2], f, tex || orb(9, 12, 10, 14, GHO), GHO[0]); };
  var gthing = function (f, tex, t) { t = t || GHP; return P(t[2], f, tex, t[0]); };
  // an arm: thumb out (a fist, its thumb up), or waving (an open hand, raised)
  var garm = function (sh, pose, k) {
    k = k || 1;
    if (pose === 'thumb') return [
      gbody(limb([sh, [sh[0] - 3.2 * k, sh[1] + 1.8], [sh[0] - 5.6 * k, sh[1] + 0.4]], 1.05)),
      gbody(or(ell(sh[0] - 5.8 * k, sh[1] + 0.2, 1.7, 1.5), cap(sh[0] - 6 * k, sh[1] - 0.8, sh[0] - 6 * k, sh[1] - 2.8, 0.65)), orb(sh[0] - 6.4, sh[1] - 1, 2.6, 3, GHO))
    ];
    return [
      gbody(limb([sh, [sh[0] - 3.4 * k, sh[1] - 2], [sh[0] - 4.4 * k, sh[1] - 5.8]], 1.05)),
      gbody(or(ell(sh[0] - 4.6 * k, sh[1] - 6.8, 1.7, 1.9), cap(sh[0] - 6.2 * k, sh[1] - 6.6, sh[0] - 6.4 * k, sh[1] - 8.2, 0.55)), orb(sh[0] - 5, sh[1] - 8, 2.6, 3, GHO))
    ];
  };
  var WAVE = [['F.', '.F'], ['.F', 'F.']];
  var hitch = function (who, f) {
    var parts = [], st = [], free = [], b = f ? -1 : 0, S = function (g) { return shift(g, 0, b); };
    var arm = f ? 'wave' : 'thumb';
    if (who === 1) {
      // tall and skinny: a long face, a battered top hat, a carpet bag
      parts.push(
        gbody(S(or(ell(10.6, 17.4, 4.4, 3.4), tube([[10.6, 17, 3.8], [11, 21, 3.6], [12, 24.6, 2.6], [14.4, 27.6, 1.5], [17.4, 27.6 - b, 1], [19, 25.4 - b * 2, 0.7]]))))
      );
      // the carpet bag, carried at his side: a handle, a clasp, a pattern of diamonds
      parts.push(
        gthing(S(cap(14.6, 19.6, 16.8, 19.6, 1.4)), null),
        gthing(S(rrect(12.6, 20.4, 19.4, 25.6, 1.8)), S(function (x, y) {
          var X = x + 0.5, Y = y + 0.5;
          if (Y < 21.6) return GHP[1];
          return (Math.abs((X - 16) % 3) + Math.abs((Y - 23) % 3)) < 1.6 ? GHK[2] : orb(14, 21, 8, 6, GHP)(x, y);
        })),
        gbody(S(limb([[13.2, 15.6], [14.8, 18.2], [15.6, 19.6]], 1)))
      );
      parts = parts.concat(garm([8.4, 15.6 + b], arm));
      parts.push(
        gbody(S(ell(10.2, 10.4, 4.2, 4.6)), S(orb(9, 9, 5.6, 6, GHO))),
        // the top hat, battered: a dented crown leaning back, a frayed brim, a band
        gthing(S(turned(minus(rrect(6.8, 0.4, 13.4, 6.4, 0.8), or(tri(9, 0, 11.4, 0, 10.4, 1.6), tri(13.6, 3, 13.6, 4.4, 12.6, 3.6))), 10, 6, -0.14)), S(turned(function (x, y) {
          var Y = y + 0.5;
          if (Y > 4.4 && Y < 5.8) return GHP[1];
          return x + 0.5 < 9 ? GHP[3] : GHP[2];
        }, 10, 6, -0.14))),
        gthing(S(or(ell(10, 6.6, 6, 1.1), ell(4.6, 6.2, 1.4, 0.9))), S(function (x, y) { return y + 0.5 < 6.4 ? GHP[3] : GHP[1]; }))
      );
      st.push([6, 9 + b, EYE_S], [10, 9 + b, EYE_S], [6, 13 + b, ['#...#', '.###.']], [5, 12 + b, [BLUSH]], [11, 12 + b, [BLUSH]]);
    } else if (who === 2) {
      // short and round: a bowler, a bulb of a nose, a long wispy beard
      parts.push(gbody(S(or(ell(11.4, 18.6, 7.4, 6.2), tube([[11.6, 22, 4.6], [13.6, 25.6, 3], [16.4, 27.8, 1.6], [19, 26.6 - b, 0.9], [19.8, 24.6 - b * 2, 0.6]])))));
      parts = parts.concat(garm([6, 19.6 + b], arm, 0.85));
      parts.push(
        // the beard: from his cheeks down past his middle, its tip curling
        P(GHO[3], S(or(ell(9.6, 21.4, 5, 3.4), tube([[9.6, 21.6, 3.6], [8.4, 25, 2.4], [8, 27.6, 1.3], [9.6, 29, 0.6]]))), S(function (x, y) {
          var X = x + 0.5, Y = y + 0.5;
          if (Math.abs((X - 9.6) * 1.2 - (Y - 20) * 0.3) % 2.4 < 0.5 && Y > 22) return GHO[3];
          return 'w';
        }), GHO[1]),
        P(GHO[3], S(or(ell(7.6, 19.6, 2.4, 1.3), ell(11.6, 19.6, 2.4, 1.3))), S(orb(8, 19, 5, 2, GHO.slice(1) + 'w')), GHO[1]),
        P(GHK[2], S(ell(9.6, 18.4, 1.5, 1.3)), S(orb(9, 17.8, 1.8, 1.8, GHK)), GHK[0]),
        // the bowler: a round crown, a curled brim, a band
        gthing(S(and(ell(11.2, 12.4, 5, 4.4), function (x, y) { return y < 12.8; })), S(function (x, y) { var Y = y + 0.5; return Y > 11.2 ? GHP[1] : orb(10, 9, 6, 5, GHP)(x, y); })),
        gthing(S(ell(11.2, 12.8, 7, 1.2)), S(function (x, y) { return y + 0.5 < 12.6 ? GHP[3] : GHP[1]; }))
      );
      st.push([5, 14 + b, EYE], [10, 14 + b, EYE], [8, 21 + b, ['#...#', '.###.']], [4, 18 + b, [BLUSH]], [15, 18 + b, [BLUSH]]);
    } else {
      // little and lanky: a striped stocking cap with a bobble, a striped scarf
      var stripe = function (x, y) { return Math.floor((x + 0.5 - (y + 0.5) * 0.7) / 1.6) % 2 ? GHK[2] : GHP[3]; };
      parts.push(gbody(S(or(ell(10.8, 20.4, 3.4, 3.4), tube([[10.8, 18.6, 3], [11.2, 22.4, 2.7], [12.2, 25.6, 1.9], [14.6, 28, 1.1], [17, 27.6 - b, 0.7], [18.2, 25.8 - b * 2, 0.5]])))));
      parts = parts.concat(garm([8.8, 19.4 + b], arm, 1.1));
      parts.push(
        gbody(S(ell(10, 14.4, 4.4, 4)), S(orb(9, 13, 5.8, 5.6, GHO))),
        // the scarf, its ends streaming out behind
        gthing(S(or(ell(10.6, 18.8, 4.2, 1.5), tube([[13, 19, 1.3], [16.4, 20.4, 1.2], [19.6, 19.4 + b, 1], [21, 20.6 + b, 0.8]]))), S(stripe), GHK),
        // the stocking cap, flopping back, a bobble on its end
        gthing(S(or(and(ell(10.2, 12.6, 4.8, 3.6), function (x, y) { return y < 12.6; }), tube([[11.6, 10, 2.6], [14.6, 8.4, 1.9], [17, 9.4 - b, 1.2]]))), S(stripe), GHK),
        gthing(S(ell(18.2, 10.4 - b, 1.7, 1.6)), S(orb(17.6, 9.8 - b, 2, 2, GHP)))
      );
      st.push([6, 12 + b, EYE_S], [10, 12 + b, EYE_S], [7, 16 + b, ['#..#', '.##.']], [5, 15 + b, [BLUSH]], [11, 15 + b, [BLUSH]]);
    }
    if (f) free.push([0, 6 + b, WAVE[0]], [0, 10 + b, WAVE[1]]);
    return build(22, 30, parts, st, free, { rim: GHO[0], halo: [GLOW, '.', '.'] });
  };
  E.hitch1 = [hitch(1, 0), hitch(1, 1)];
  E.hitch2 = [hitch(2, 0), hitch(2, 1)];
  E.hitch3 = [hitch(3, 0), hitch(3, 1)];

  /* JACK-HOP: a carved jack-o'-lantern on stubby little legs, hopping
     along, lit from inside; mischievous, not scary — arched eyes, one
     brow cocked, a lopsided grin with a single tooth. sit, hop. */
  // ribs on a pumpkin: grooves curving round it, lit from the top left
  var ribbed = function (cx, cy, rx, ry, t, n) {
    var lit = orb(cx, cy, rx, ry, t);
    return function (x, y) {
      var u = (x + 0.5 - cx) / rx, v = (y + 0.5 - cy) / ry, w = u / Math.sqrt(Math.max(0.05, 1 - v * v));
      var k = (w + 1) * n / 2, d = Math.abs(k - Math.round(k));
      if (d < 0.09 && Math.abs(w) < 0.9) return step(t, lit(x, y), -2);
      if (d < 0.17 && Math.abs(w) < 0.9) return step(t, lit(x, y), -1);
      return lit(x, y);
    };
  };
  // a carving: 'o' is the cut edge, the rest is the glow inside
  var carve = function (rows) { return rows.map(function (r) { return r.replace(/o/g, PUMP[0]); }); };
  var jackhop = function (hop) {
    var cy = hop ? 9 : 11.8, parts = [];
    if (hop) parts.push(P(STEM[2], or(cap(8, 14, 6.8, 19.4, 1.3), cap(14, 14, 15.6, 18.8, 1.3)), null, STEM[0]), P(STEM[2], or(ell(6, 20.4, 2.4, 1.3), ell(15.6, 19.8, 2.4, 1.3)), orb(10, 19, 8, 3, STEM), STEM[0]));
    else parts.push(P(STEM[2], or(ell(6.4, 20.6, 2.6, 1.3), ell(15, 20.6, 2.6, 1.3)), orb(10, 20, 8, 3, STEM), STEM[0]));
    parts.push(
      P(PUMP[2], ell(11, cy, 9.6, 7.4), ribbed(11, cy, 9.6, 7.4, PUMP, 4), PUMP[0]),
      P(STEM[2], or(cap(11.6, cy - 6.2, 12.4, cy - 9.2, 1.2), limb([[12.4, cy - 8.6], [14.6, cy - 9.6], [15.6, cy - 8.4]], 0.45)), null, STEM[0])
    );
    var Y = Math.round(cy);
    var st = [
      [3, Y - 3, carve(['oo....', '..o...'])],
      [4, Y - 2, carve(['.oo.', 'o77o', '7887', '6..6'])],
      [12, Y - 2, carve(['.oo.', 'o77o', '7887', '6..6'])],
      [3, Y + 2, carve(['o.........o', 'o778887776o', '.o78o.o76o.', '..oo...oo..'])]
    ];
    return build(22, 22, parts, st);
  };
  E.jackhop = [jackhop(false), jackhop(true)];

  /* ==========================================================================
     THE HAUNTED MANSION AND THE WITCH'S WOOD
     ========================================================================== */
  // a four-cornered shape: two triangles
  var quad = function (a, b, c, d) { return or(tri(a[0], a[1], b[0], b[1], c[0], c[1]), tri(a[0], a[1], c[0], c[1], d[0], d[1])); };

  /* THE SPELLBOOK: flies by flapping its covers like wings, its pages
     fluttering between them; two eyes on its rounded spine and a red
     ribbon bookmark trailing behind like a tail. 0: covers up · 1: down. */
  E.book = [0, 1].map(function (f) {
    // seen from outside, open in a V: two plum covers with gold corners, the
    // cream page edges showing at their outer edges, a gold-banded spine down
    // the middle and a face across the front; the covers flap like wings
    var up = !f, sy = up ? 8 : 6;
    var L = up ? [[11, sy], [1.4, sy - 5], [1.8, sy + 3.4], [11, sy + 8]] : [[11, sy], [1.6, sy + 3.2], [2.4, sy + 10.4], [11, sy + 7.4]];
    var R = L.map(function (p) { return [24 - p[0], p[1]]; });
    var coverTex = function (q, s) {
      return function (x, y) {
        var X = x + 0.5, Y = y + 0.5, ox = q[1][0], t = (X - 12) / (ox - 12);
        if (t > 0.8) return Math.floor(Y + (up ? t * 4 : -t * 2)) % 2 ? PAPER[1] : PAPER[3];
        // gold corner caps at the outer corners
        var top = q[0][1] + (q[1][1] - q[0][1]) * t, bot = q[3][1] + (q[2][1] - q[3][1]) * t;
        if (t > 0.6 && (Y - top < 1.8 || bot - Y < 1.8)) return t > 0.7 && Y - top < 1.2 ? GOLD[3] : GOLD[2];
        if (Y - top < 1.1) return BOOK[3];
        return s > 0 ? BOOK[1] : BOOK[2];
      };
    };
    var parts = [
      P(PURP[2], limb([[12, sy + 7.6], [12.8, sy + 9.6], [14.6, sy + 10.4 + (f ? 0.6 : -0.4)], [16.6, sy + 9.8 + (f ? 1.2 : -0.6)]], 0.75), function (x, y) { return y + 0.5 < sy + 9.4 ? PURP[3] : PURP[2]; }, PURP[0]),
      P(BOOK[2], quad(L[0], L[1], L[2], L[3]), coverTex(L, -1), BOOK[0]),
      P(BOOK[2], quad(R[0], R[1], R[2], R[3]), coverTex(R, 1), BOOK[0]),
      P(BOOK[1], rrect(10.4, sy - 0.6, 13.6, sy + 8.4, 1.4), function (x, y) {
        var Y = y + 0.5;
        if (Math.abs(Y - sy - 0.8) < 0.6 || Math.abs(Y - sy - 6.8) < 0.6) return GOLD[2];
        return x + 0.5 < 11.8 ? BOOK[2] : BOOK[1];
      }, BOOK[0])
    ];
    var ey = Math.round(sy + (up ? 0.6 : 1.2));
    var GOOG = ['.###.', '#www#', '#EEw#', '#EEw#', '.###.'];
    return build(24, 18, parts, [[5, ey, GOOG], [14, ey, GOOG], [10, ey + 5, ['#..#', '.##.']]]);
  });

  /* THE WITCH'S APPRENTICE: a cheeky kid witch on a mini broomstick — a
     pointy hat with its tip flopping back, a teal cape flapping, ginger
     bunches, a grin. Firework night is full of them. 0, 1: the cape and
     hat flap. */
  E.minwitch = [0, 1].map(function (f) {
    var u = f ? 1 : -1;
    var parts = [
      // the broom: a handle, and a bundle of bristles tied with a band
      P(STRAW[2], quad([21.4, 14], [31.4, 11 + u], [31.6, 21.6 - u * 0.4], [21.4, 18.6]), function (x, y) { return Math.floor((y + 0.5) * 1.2 - (x + 0.5) * 0.25) % 2 ? STRAW[1] : (y < 15 ? STRAW[3] : STRAW[2]); }, STRAW[0]),
      P(LIME[2], rrect(20.6, 13.6, 23, 19, 0.8), function (x, y) { return y + 0.5 < 15 ? LIME[3] : LIME[2]; }, LIME[0]),
      P(WOOD[2], cap(1.6, 15.2, 21.4, 16.4, 0.95), function (x, y) { return y + 0.5 < 15.6 ? WOOD[3] : WOOD[2]; }, WOOD[0]),
      // her cape, streaming back
      P(CAPE[2], minus(or(tri(13.6, 8.6, 26.6, 5.2 + u * 1.6, 25.4 + u * 0.6, 12.8), tri(13.6, 8.6, 25.4 + u * 0.6, 12.8, 15, 14)), or(ell(26.8 + u * 0.3, 8.6 + u * 0.8, 1.3, 1.3), ell(25.8 + u * 0.5, 11.6 + u * 0.3, 1.2, 1.1))), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        return Math.abs((Y - 8.6) - (X - 13.6) * 0.15 - 2.4) < 0.5 ? CAPE[1] : Y < 9.6 ? CAPE[3] : CAPE[2];
      }, CAPE[0]),
      // a leg dangling, stripy tights and a little boot
      P(LIME[2], cap(14.6, 15, 13.6, 20, 1.15), function (x, y) { return Math.floor(y + 0.5) % 2 ? 'g' : LIME[2]; }, LIME[0]),
      P(INK[2], or(ell(12.4, 20.8, 2.4, 1.3), cap(10.6, 20.4, 9.8, 19.4, 0.6)), orb(11, 20, 3, 2, INK), INK[0]),
      // dress
      P(PURP[2], or(ell(15, 12.8, 3.4, 2.8), tri(12, 15, 18.4, 15, 15.2, 10.4)), orb(14, 11, 5, 5, PURP), PURP[0]),
      // arm and hand on the broom
      P(PURP[2], cap(13.4, 11.6, 9.4, 14.6, 1), null, PURP[0]),
      P(SKIN[2], ell(8.6, 15, 1.4, 1.3), orb(8, 14.4, 2, 2, SKIN), SKIN[0]),
      // ginger bunches, flying
      P(HAIR[2], or(ell(16.2, 9, 2.1, 1.7), ell(18.2 + u * 0.3, 10 + u * 0.6, 1.7, 1.4)), orb(15.6, 8.2, 3, 3, HAIR), HAIR[0]),
      O(11.4, 8.4, 4.6, 4.2, SKIN, SKIN[0]),
      P(HAIR[2], and(ell(11.8, 7, 5, 3.6), function (x, y) { return y < 6.2 || x > 14.2; }), orb(11, 5.4, 5, 4, HAIR), HAIR[0]),
      // her hat: a wide brim, a cone tipped back, its tip flopping; a lime band
      P(CAPE[2], or(ell(12, 5, 6.6, 1.3), quad([8.4, 5], [15, 5], [17.6, 1.6], [12.8, 0.6]), tri(16.8, 0.7, 18.2, 2.4, 21.4 + u * 0.4, 1.6 + u * 0.9)), function (x, y) {
        var Y = y + 0.5;
        if (Y > 3.1 && Y < 4.5 && x < 16) return PUMP[3];
        return Y > 4.6 ? CAPE[1] : x + 0.5 < 12 ? CAPE[3] : CAPE[2];
      }, CAPE[0])
    ];
    return build(32, 24, parts, [[7, 8, ['.##.', '#ww#', '#Ew#', '.##.']], [11, 8, ['.##.', '#ww#', '#Ew#', '.##.']], [8, 12, ['#...', '.###']], [6, 11, [BLUSH]], [15, 11, [BLUSH]]]);
  });

  /* THE TOAD (the witch's wood): round and warty, mossy green with purple
     warts, big golden eyes. sit, hop. */
  var TEYE = ['.###.', '#DwD#', '#CEC#', '#BCB#', '.###.'];
  E.toad = [0, 1].map(function (hop) {
    var a = hop ? -0.28 : 0, dy = hop ? -2.4 : 0;
    var T = function (g) { return turned(shift(g, 0, dy), 11, 14 + dy, a); };
    var warts = function (x, y) {
      var X = x + 0.5, Y = y + 0.5 - dy;
      return [[14, 8.6], [17.6, 10.4], [11, 9.6], [19.4, 13], [15.4, 12.4]].some(function (w) { return (X - w[0]) * (X - w[0]) + (Y - w[1]) * (Y - w[1]) < 1.1; });
    };
    var parts = [];
    if (hop) parts.push(P(TOAD[2], or(limb([[17, 14], [20.6, 15.6], [21.2, 17.4]], 1.3), ell(20, 17.2, 2, 0.9)), null, TOAD[0]));
    parts.push(
      P(TOAD[2], T(ell(11.6, 12.4, 9, 5.6)), function (x, y) {
        if (warts(x, y)) return (x + y) % 3 ? WART[2] : WART[3];
        return y + 0.5 > 14.6 - dy ? TOAD[4] : orb(10, 10 + dy, 10, 7, TOAD)(x, y);
      }, TOAD[0]),
      O(5.4 + (hop ? 0.4 : 0), 7.4 + dy - (hop ? 1.4 : 0), 3, 2.8, TOAD, TOAD[0]), O(10.4, 6.6 + dy - (hop ? 0.4 : 0), 3, 2.8, TOAD, TOAD[0])
    );
    if (!hop) parts.push(P(TOAD[2], or(ell(17.4, 14.4, 4, 3), ell(18.6, 17, 3, 1)), orb(16, 13, 5, 4, TOAD), TOAD[0]), P(TOAD[3], or(ell(4.6, 16.8, 2, 1), ell(8.6, 17, 1.8, 0.9)), null, TOAD[0]));
    else parts.push(P(TOAD[3], or(cap(5.4, 13, 2.4, 15.6, 0.9), ell(2, 15.8, 1.6, 0.9)), null, TOAD[0]));
    var ey = Math.round(5 + dy - (hop ? 1 : 0));
    return build(22, 18, parts, [[3, ey, TEYE], [8, ey + (hop ? 1 : 0) - (hop ? 1 : 0), TEYE], [1, Math.round(11 + dy - (hop ? 1 : 0)), ['#.........', '.########.']], [3, Math.round(10 + dy - (hop ? 1 : 0)), [BLUSH]]]);
  });

  /* THE WILL-O'-THE-WISP: a little floating flame, blue at its edge and
     white at its heart, with two tiny eyes; it flickers (three frames) and
     leads the way to secrets. */
  E.wisp = [0, 1, 2].map(function (f) {
    var sw = [-1.2, 0, 1.2][f], h = [0.6, 1.2, 0.2][f];
    var shape = or(ell(7, 11, 5, 4.4), leaf(7, 15.4, 7 + sw, h, 5.2), cap(7 + sw, h + 1.2, 7 + sw * 1.6, h, 0.6));
    return build(14, 16, [P(WISP[2], shape, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = Math.sqrt((X - 7 - sw * 0.2) * (X - 7 - sw * 0.2) / 9 + (Y - 11) * (Y - 11) / 16);
      if (d < 0.75) return 'w';
      if (d < 1.15) return WISP[3];
      return Y < 7 && X < 7 + sw * 0.3 ? WISP[3] : WISP[2];
    }, WISP[1])], [[5, 10, ['E']], [8, 10, ['E']], [6, 12, ['.E.']]], [], { rim: WISP[1], halo: [tone('#3c6ae0'), '.', '.'] });
  });

  /* ==========================================================================
     THE WITCH'S TOWER — the Witch, her potions, the frog they turn you
     into, and the biggest pumpkin ever.
     ========================================================================== */

  /* THE WITCH — the boss. Comical, cross and silly, never scary: a tall
     purple hat with a patch on it and a crooked tip, wild curly orange
     hair, round spectacles, rosy cheeks, a long friendly nose and a huge
     grin of round teeth; a purple dress with orange stars, a green cloak,
     stripy orange-and-black tights and pointy boots. She only took the
     pumpkin for the biggest pumpkin soup ever, for her Halloween party,
     because nobody ever comes.
     fly: riding her broom, cloak and hair streaming (two frames) ·
     swoop: diving, leaning forward · dizzy: sat on the floor, broom
     crooked beside her (out of magic, a puff of smoke), hat squashed,
     eyes spirals · hurt: eyes squeezed, hat flattened · sorry: standing,
     kind sad eyes, her hat in her hands · stir: standing, stirring her
     soup with a big wooden spoon (two frames). */
  var CLOAK = ramp(['#0c2a22', '#154634', '#20644a', '#368a62', '#86c89c']);
  var DRESS = ramp(['#30166a', '#5430a8', '#7c50d8', '#a884f2', '#e2d2ff']);
  // little curls all over her hair: rings, lit on their top left
  var curly = function (base, t) {
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5, row = Math.floor(Y / 3.2), ox = (row % 2) * 1.6;
      var lx = ((X + ox) % 3.2 + 3.2) % 3.2 - 1.6, ly = (Y % 3.2 + 3.2) % 3.2 - 1.6, r = Math.sqrt(lx * lx + ly * ly), b = base(x, y);
      if (Math.abs(r - 1.15) < 0.42) return step(t, b, lx + ly < 0 ? 1 : -1);
      return b;
    };
  };
  var hairBall = function (cx, cy, rx, ry, n, amp) { return P(HAIR[2], fluff(cx, cy, rx, ry, n || 7, amp || 0.14), curly(orb(cx - 1, cy - 1, rx + 1, ry + 1, HAIR), HAIR), HAIR[0]); };
  var ring = function (cx, cy, r, w) { return minus(ell(cx, cy, r, r), ell(cx, cy, r - w, r - w)); };
  // her hat: a wide brim and a soft cone that bends over at the top; shapes:
  // 'up' (tall, its tip crooked back), 'stream' (tip blown flat behind her),
  // 'squash' (dizzy: short and crumpled), 'flat' (hurt: pressed down)
  var hat = function (bx, by, shape, tilt, sc) {
    sc = sc || 1;
    var cone = {
      up: [[bx, by - 1, 7], [bx + 1.6, by - 7, 5.2], [bx + 3.4, by - 12, 3.4], [bx + 5.4, by - 16, 2.2], [bx + 9, by - 18, 1.5], [bx + 12.6, by - 16.6, 1.1], [bx + 14.4, by - 13.6, 0.8]],
      up2: [[bx, by - 1, 7], [bx + 1.8, by - 7, 5.2], [bx + 4, by - 11.6, 3.4], [bx + 6.4, by - 15, 2.2], [bx + 10.4, by - 16.2, 1.5], [bx + 14, by - 14.4, 1.1], [bx + 15, by - 11.4, 0.8]],
      stream: [[bx, by - 1, 7], [bx + 2.4, by - 6.4, 5.2], [bx + 5.4, by - 10.6, 3.4], [bx + 9, by - 13, 2], [bx + 13, by - 13.6, 1.3], [bx + 16.4, by - 12.6, 0.8]],
      squash: [[bx, by - 1, 7.4], [bx + 1.4, by - 4.6, 5.6], [bx + 4, by - 7.4, 3.6], [bx + 7.6, by - 7.6, 2.2], [bx + 10.6, by - 5.8, 1.4], [bx + 11.4, by - 3.6, 1]],
      flat: [[bx, by - 0.6, 8], [bx + 1, by - 3.2, 6.4], [bx + 3.6, by - 5.2, 4], [bx + 7.6, by - 5.4, 2.2], [bx + 10.6, by - 4.2, 1.3]]
    }[shape].map(function (p) { return [bx + (p[0] - bx) * sc, by + (p[1] - by) * sc, p[2] * sc]; });
    // (held in her hands it's drawn a little smaller: sc)
    var S = function (f) { return sc === 1 ? f : function (x, y) { return f(bx + (x - bx) / sc, by + (y - by) / sc); }; };
    var T = function (f) { return tilt ? turned(S(f), bx, by, tilt) : S(f); };
    var bw = shape === 'flat' ? 16 : 14.4;
    var patch = rrect(bx - 2.6, by - 9.6, bx + 1.4, by - 5.8, 0.6);
    return [
      P(HAT[2], T(ell(bx, by, bw, 3)), T(function (x, y) { return y + 0.5 < by - 0.4 ? HAT[3] : HAT[1]; }), HAT[0]),
      P(HAT[2], (tilt ? function (f) { return turned(f, bx, by, tilt); } : function (f) { return f; })(and(tube(cone), function (x, y) { return y < by - 0.2 * sc; })), T(function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y > by - 3.8 && Y < by - 1.4) return Math.abs(X - bx + 3.2) < 1.2 && shape !== 'flat' ? GOLD[3] : PUMP[2];
        if (shape !== 'flat' && shape !== 'squash' && patch(X, Y)) {
          // a patch sewn on, with stitches round it
          if (Math.abs(X - bx + 2.6) < 0.5 || Math.abs(X - bx - 1.4) < 0.5 || Math.abs(Y - by + 9.6) < 0.5 || Math.abs(Y - by + 5.8) < 0.5) return (Math.floor(X + Y) % 2) ? LIME[4] : LIME[1];
          return LIME[2];
        }
        return orb(bx - 2, by - 9, 9, 12, HAT)(x, y);
      }), HAT[0])
    ];
  };
  // her head: hair behind, face, bangs, spectacles, a long friendly nose
  var head = function (hx, hy, opt) {
    opt = opt || {};
    var parts = [], s = opt.stream || 0;
    // the hair behind her face: a big curly mop, and curls streaming behind when she flies
    parts.push(hairBall(hx + 4, hy - 1, 12.6, 10.6, 9, 0.12));
    if (s) parts.push(hairBall(hx + 16 + s, hy - 4, 4, 3.4), hairBall(hx + 19 + s * 1.4, hy + 1 + s * 0.4, 3.6, 3.2), hairBall(hx + 16 + s, hy + 6, 3.4, 3));
    else parts.push(hairBall(hx + 13, hy + 6, 4, 4), hairBall(hx - 6, hy + 7, 3.4, 3.2));
    if (opt.bare) parts.push(hairBall(hx + 2, hy - 10, 11, 6.4, 8, 0.16));
    parts.push(O(hx, hy, 9.6, 9, SKIN, SKIN[0]));
    // a fringe of curls under the brim
    parts.push(hairBall(hx + 1.6, hy - 7.6, 10, 3.2, 10, 0.2));
    // spectacles: gold rims, a bridge, an arm back to her ear
    var L = [hx - 5.4, hy - 0.4], R = [hx + 2, hy - 0.4];
    if (opt.askew) { L = [hx - 5.4, hy + 0.6]; R = [hx + 2, hy - 1]; }
    parts.push(P(GOLD[2], or(ring(L[0], L[1], 3.5, 1.1), ring(R[0], R[1], 3.5, 1.1), cap(L[0] + 3.1, L[1], R[0] - 3.1, R[1], 0.55), cap(R[0] + 3.3, R[1] - 0.6, hx + 8.6, hy - 2.4, 0.55)), function (x, y) { return y + 0.5 < (L[1] + R[1]) / 2 - 1.4 ? GOLD[3] : GOLD[1]; }));
    // the nose: long, round-tipped, friendly
    parts.push(P(SKIN[2], or(cap(hx - 6.4, hy + 1.4, hx - 9.8, hy + 3.4, 1.9), ell(hx - 10.2, hy + 3.8, 2.5, 2.3)), orb(hx - 10, hy + 2.8, 4, 3.4, SKIN), SKIN[1]));
    return { parts: parts, L: L, R: R };
  };
  // the grin: huge, round teeth along the top, her tongue at the bottom
  var grin = function (hx, hy, w) {
    w = w || 7.4;
    var cx = hx - 2.4, top = hy + 4.6;
    return P('E', and(ell(cx, top, w, 4.4), function (x, y) { return y + 0.5 > top; }), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < top + 1.6) return Math.abs(((X - cx + 0.6) % 2.2 + 2.2) % 2.2 - 1.1) < 0.35 ? 'W' : 'w';
      if (Y > top + 2.5 && Math.abs(X - cx - 1) < 2.6) return 'r';
      return 'u';
    }, '#');
  };
  var stars = function (base, pts) {
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      for (var i = 0; i < pts.length; i++) if (star(pts[i][0], pts[i][1], 1.9, 0.8, -Math.PI / 2)(X, Y)) return Y < pts[i][1] ? PUMP[4] : PUMP[3];
      return base(x, y);
    };
  };
  var tights = function (horiz) { return function (x, y) { return Math.floor((horiz ? x : y) / 1.6) % 2 ? 'g' : HAIR[3]; }; };
  // a pointy boot at (bx, by), toe out to the left (dir -1) or right (1), curling up
  var boot = function (bx, by, dir, a) {
    var d = dir || -1, f = or(ell(bx, by, 3.2, 2.1), tri(bx, by - 1.8, bx, by + 2, bx + d * 6, by - 1.2), ell(bx + d * 6, by - 2, 0.9, 0.9));
    return P(INK[3], a ? turned(f, bx, by, a) : f, function (x, y) { return y + 0.5 < by - 0.4 ? INK[4] : INK[3]; }, INK[0]);
  };
  // her broom: a handle and a bundle of straw tied with a band (bristles from x0 to x1)
  var broom = function (a0, a1, x0, y0, spread, len, u, smoke) {
    var dx = a1[0] - a0[0], dy = a1[1] - a0[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var b0 = [x0, y0], tip = [x0 + ux * len, y0 + uy * len];
    var bristle = quad([b0[0] - nx * 2.4, b0[1] - ny * 2.4], [tip[0] - nx * spread + (u || 0), tip[1] - ny * spread], [tip[0] + nx * spread - (u || 0), tip[1] + ny * spread], [b0[0] + nx * 2.4, b0[1] + ny * 2.4]);
    return [
      P(STRAW[2], bristle, function (x, y) {
        var px = x + 0.5 - b0[0], py = y + 0.5 - b0[1], v = px * nx + py * ny, t = (px * ux + py * uy) / len;
        return Math.floor(v * 1.1 / Math.max(0.4, 0.35 + t)) % 2 ? STRAW[1] : (v < 0 ? STRAW[3] : STRAW[2]);
      }, STRAW[0]),
      P(PUMP[2], cap(b0[0] - ux * 0.4, b0[1] - uy * 0.4, b0[0] + ux * 2.2, b0[1] + uy * 2.2, 2.9), function (x, y) { return (x + 0.5 - b0[0]) * nx + (y + 0.5 - b0[1]) * ny < -0.6 ? PUMP[3] : PUMP[2]; }, PUMP[0]),
      P(WOOD[2], cap(a0[0], a0[1], b0[0], b0[1], 1.35), function (x, y) { return (x + 0.5 - a0[0]) * nx + (y + 0.5 - a0[1]) * ny < 0 ? WOOD[3] : WOOD[2]; }, WOOD[0])
    ];
  };
  var witch = function (mode, f) {
    var parts = [], st = [], free = [];
    var flying = mode === 'fly' || mode === 'swoop' || mode === 'hurt';
    if (flying) {
      var a = mode === 'swoop' ? -0.36 : mode === 'hurt' ? 0.12 : 0, pv = [34, 42];
      var T = function (g) { return a ? turned(g, pv[0], pv[1], a) : g; };
      var Pt = function (c, g, tex, line) { return P(c, T(g), tex ? T(tex) : null, line); };
      var rot = function (x, y) { var c = Math.cos(a), s = Math.sin(a), X = x - pv[0], Y = y - pv[1]; return [pv[0] + c * X - s * Y, pv[1] + s * X + c * Y]; };
      var u = mode === 'fly' && f ? 1 : 0, w = u ? 1 : -1;
      var hc = rot(20, 27), hx = hc[0], hy = hc[1] + (u ? 0.6 : 0);
      // the cloak, streaming out behind
      parts.push(Pt(CLOAK[2], minus(or(tri(24, 32, 53, 21 + w * 2.4, 51, 34 + w), tri(24, 32, 51, 34 + w, 33, 41)), or(ell(52.8, 26 + w * 1.4, 1.9, 1.9), ell(51.6, 31.4 + w * 0.6, 1.7, 1.7))), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        return Math.abs((Y - 33) - (X - 26) * -0.18 + 2.6) < 0.6 ? CLOAK[1] : Y < 29 - (X - 26) * 0.3 ? CLOAK[3] : CLOAK[2];
      }, CLOAK[0]));
      // the far leg, tucked back
      parts.push(Pt(HAIR[3], limb([[33, 46], [36, 51], [40, 53]], 1.8), tights(true), 'g'), Pt(INK[3], or(ell(42, 53.4, 3, 2), tri(42, 51.6, 42, 55.4, 48, 52.6), ell(48, 51.8, 0.9, 0.9)), null, INK[0]));
      parts = parts.concat(broom(rot(2.4, 44.4), rot(46, 46.6), rot(46, 46.6)[0], rot(46, 46.6)[1], 7.4 + w * 0.8, 16.4, w * 0.8));
      // the near leg dangling, stripy, a pointy boot
      parts.push(Pt(HAIR[3], limb([[27.4, 45.6], [24.4 + u * 1.4, 51.4], [22.6 + u * 2.2, 55 - u * 0.4]], 1.9), tights(false), 'g'));
      var bt = rot(21.4 + u * 2.2, 56.4 - u * 0.4);
      parts.push(boot(bt[0], bt[1], -1, a));
      // her dress: a puff of a skirt over the broom and a bodice, orange stars
      var dressStars = [[30.6, 41], [36.6, 44.4], [27, 47.4], [34, 36]];
      parts.push(
        Pt(DRESS[2], or(ell(30, 44, 9.6, 5.2), tri(21, 44, 39.6, 44, 30, 51)), stars(orb(26, 40, 14, 10, DRESS), dressStars), DRESS[0]),
        Pt(DRESS[2], ell(29, 36.6, 6.6, 6), stars(orb(26, 33, 8, 8, DRESS), dressStars), DRESS[0]),
        // her arm out to the handle, her hand on it
        Pt(DRESS[2], limb([[25.4, 35.6], [19, 40], [13.4, 43]], 2.1), orb(18, 37, 8, 6, DRESS), DRESS[0]),
        Pt(SKIN[2], ell(12.4, 43.4, 2.3, 2), orb(11.6, 42.6, 2.8, 2.6, SKIN), SKIN[0])
      );
      var H = head(hx, hy, { stream: mode === 'swoop' ? 3 : 1 + u });
      parts = parts.concat(H.parts);
      parts.push(grin(hx, hy, mode === 'swoop' ? 6.6 : 7.6));
      if (mode === 'hurt') parts.pop();
      parts = parts.concat(hat(hx + 1, hy - 8.6, mode === 'hurt' ? 'flat' : mode === 'swoop' ? 'stream' : u ? 'up2' : 'up', mode === 'hurt' ? -0.1 : -0.06));
      var Lx = Math.round(H.L[0]), Ly = Math.round(H.L[1]), Rx = Math.round(H.R[0]), Ry = Math.round(H.R[1]);
      if (mode === 'hurt') {
        st.push([Lx - 2, Ly - 2, ['#...', '.##.', '...#', '.##.', '#...']], [Rx - 2, Ry - 2, ['...#', '.##.', '#...', '.##.', '...#']]);
        st.push([Math.round(hx - 6), Math.round(hy + 5), ['.###.', '#uuu#', '#uru#', '.###.']]);
        free.push([3, 6, TWINKLE], [30, 2, ['.D.', 'DFD', '.D.']], [8, 14, ['F']]);
      } else {
        st.push([Lx - 2, Ly - 2, EYE], [Rx - 1, Ry - 2, EYE]);
        if (mode === 'swoop') st.push([Lx - 3, Ly - 4, ['##...', '..###']], [Rx - 1, Ry - 4, ['###..', '...##']]);
        else st.push([Lx - 2, Ly - 4, ['.###']], [Rx - 1, Ry - 4, ['###.']]);
      }
      st.push([Math.round(hx - 10), Math.round(hy + 3), [BLUSH + BLUSH, BLUSH + BLUSH]], [Math.round(hx + 4), Math.round(hy + 3), [BLUSH + BLUSH, BLUSH + BLUSH]]);
      if (mode === 'swoop') free.push([56, 30, ['F...', '.FF.']], [54, 38, ['FFF']], [57, 46, ['.FF.', 'F...']]);
    } else if (mode === 'dizzy') {
      // sat on the floor, legs out, broom crooked beside her and puffing smoke
      parts = parts.concat(broom([40, 22], [52, 46], 52, 46, 6.4, 13.4, 0));
      free.push([55, 40, ['..RR.', '.RQQR', 'RQQQR', '.RRR.']], [59, 35, ['.RR', 'RQR', '.R.']], [57, 31, ['R']]);
      parts.push(
        P(HAIR[3], limb([[24, 53.6], [16, 55], [11, 54.6]], 1.9), tights(true), 'g'),
        boot(9.6, 53.4, -1, 0.9),
        P(HAIR[3], limb([[30, 55.6], [22, 57.4], [16.4, 57.4]], 1.9), tights(true), 'g'),
        boot(15, 56.6, -1, 0.5),
        P(DRESS[2], or(ell(32, 55, 13, 4.6), ell(30, 46, 7.4, 6.4)), stars(orb(27, 46, 14, 12, DRESS), [[24, 54], [34, 52], [40, 56], [30, 44]]), DRESS[0]),
        P(DRESS[2], limb([[25, 44], [20, 50], [19.4, 54]], 2.1), orb(20, 46, 6, 6, DRESS), DRESS[0]), P(SKIN[2], ell(19.2, 54.6, 2.2, 1.8), orb(18.6, 54, 2.6, 2.4, SKIN), SKIN[0]),
        P(DRESS[2], limb([[35, 44], [39.4, 50], [40.6, 54]], 2.1), orb(36, 46, 6, 6, DRESS), DRESS[0]), P(SKIN[2], ell(41, 54.6, 2.2, 1.8), orb(40.4, 54, 2.6, 2.4, SKIN), SKIN[0])
      );
      var hx2 = 23, hy2 = 31;
      var H2 = head(hx2, hy2, { askew: true });
      parts = parts.concat(H2.parts);
      parts = parts.concat(hat(hx2 + 2, hy2 - 8.4, 'squash', 0.34));
      st.push([Math.round(H2.L[0]) - 2, Math.round(H2.L[1]) - 2, DIZZY], [Math.round(H2.R[0]) - 2, Math.round(H2.R[1]) - 2, DIZZY]);
      st.push([hx2 - 6, hy2 + 5, ['.###.', '#uuu#', '.###.']], [hx2 - 10, hy2 + 3, [BLUSH + BLUSH]], [hx2 + 4, hy2 + 3, [BLUSH + BLUSH]]);
      free.push([4, 12, TWINKLE], [12, 6, ['.D.', 'DFD', '.D.']], [36, 8, TWINKLE], [30, 2, ['F']]);
    } else {
      // standing: sorry (hat in her hands), or stirring the soup (hat on, a big spoon)
      var stir = mode === 'stir', k = stir && f ? 1 : 0;
      var hx3 = stir ? 22 : 24, hy3 = stir ? 24 : 21;
      parts.push(
        P(HAIR[3], or(limb([[28, 50], [27, 56]], 1.9), limb([[34, 50], [35, 56]], 1.9)), tights(false), 'g'),
        boot(26.4, 57.4, -1), boot(36.4, 57.4, 1),
        P(CLOAK[2], or(tri(26, 31, 18, 54, 44, 54), ell(31, 52, 13, 3)), function (x, y) { return x + 0.5 < 27 ? CLOAK[3] : CLOAK[2]; }, CLOAK[0]),
        P(DRESS[2], or(tri(30.6, 30, 20, 53, 41, 53), ell(30.6, 51.6, 10.6, 2.6), ell(30.6, 37, 6.6, 6.4)), stars(orb(26, 34, 14, 18, DRESS), [[27, 37], [33.6, 42], [25.6, 47], [35, 50], [29.4, 30.6]]), DRESS[0])
      );
      var H3 = head(hx3, hy3, { bare: !stir });
      if (stir) {
        // the spoon: a long wooden handle down into the pot, both hands on it
        var top = k ? [27, 30] : [31, 31], bowl = k ? [11, 53] : [7, 51];
        parts.push(
          P(DRESS[2], or(limb([[26, 34], [22.6, 40], [20.6, 40.6]], 2.1), limb([[35, 34], [30, 40], [25.4, 43]], 2.1)), orb(28, 36, 8, 6, DRESS), DRESS[0]),
          P(WOOD[2], or(cap(top[0], top[1], bowl[0], bowl[1], 1.2), ell(bowl[0], bowl[1] + 1, 3.2, 2)), function (x, y) { return x + 0.5 < bowl[0] - 0.5 || y + 0.5 < top[1] + 2 ? WOOD[3] : WOOD[2]; }, WOOD[0]),
          P(LIME[3], ell(bowl[0] - 0.6, bowl[1] + 2.2, 2.6, 1), null, LIME[1]),
          P(SKIN[2], or(ell(20.6 - (k ? 0 : 1.4) + k * 1.2, 40.6 + k * 0, 2.2, 2), ell(24.8 - k * 1.2, 43.6, 2.2, 2)), orb(21, 40, 6, 5, SKIN), SKIN[0])
        );
        parts = parts.concat(H3.parts, [grin(hx3, hy3, 7.4)], hat(hx3 + 1, hy3 - 8.6, k ? 'up2' : 'up', 0.04));
        var Lx3 = Math.round(H3.L[0]), Ly3 = Math.round(H3.L[1]), Rx3 = Math.round(H3.R[0]), Ry3 = Math.round(H3.R[1]);
        // looking down into the pot
        st.push([Lx3 - 2, Ly3 - 1, ['.##.', '#ww#', '#Ew#', '.EE.']], [Rx3 - 1, Ry3 - 1, ['.##.', '#ww#', '#Ew#', '.EE.']], [Lx3 - 2, Ly3 - 3, ['.###']], [Rx3 - 1, Ry3 - 3, ['###.']]);
        free.push([4 + k * 3, 44, ['.' + LIME[3], LIME[4] + '.']], [12 - k * 4, 42, [LIME[4]]]);
      } else {
        // sorry: her hat held in front of her, upside down; her hair all wild without it
        parts = parts.concat(H3.parts);
        // her hat, crumpled, hugged to her front by its brim
        parts = parts.concat(hat(26.4, 45.4, 'up', 0.08, 0.64));
        parts.push(
          P(DRESS[2], or(limb([[25, 33], [19, 38.6], [17.6, 44.4]], 2.1), limb([[36, 33], [38.6, 39], [36, 45]], 2.1)), orb(28, 35, 10, 6, DRESS), DRESS[0]),
          P(SKIN[2], or(ell(17.4, 45.2, 2.3, 2.1), ell(35.6, 45.8, 2.3, 2.1)), orb(26, 44, 14, 4, SKIN), SKIN[0])
        );
        var Lx4 = Math.round(H3.L[0]), Ly4 = Math.round(H3.L[1]), Rx4 = Math.round(H3.R[0]), Ry4 = Math.round(H3.R[1]);
        st.push(
          [Lx4 - 2, Ly4 - 4, ['...##', '.##..']], [Rx4 - 1, Ry4 - 4, ['##...', '..##.']],
          [Lx4 - 2, Ly4 - 2, ['.##.', '#ww#', '#ww#', '#Ew#', '.##.']], [Rx4 - 1, Ry4 - 2, ['.##.', '#ww#', '#ww#', '#Ew#', '.##.']],
          [hx3 - 6, hy3 + 6, ['.##.', '#..#']], [Lx4 - 3, Ly4 + 3, ['M', 'L']]
        );
      }
      st.push([hx3 - 10, hy3 + 3, [BLUSH + BLUSH, BLUSH + BLUSH]], [hx3 + 4, hy3 + 3, [BLUSH + BLUSH, BLUSH + BLUSH]]);
    }
    return build(64, 60, parts, st, free, { ground: mode === 'sorry' || mode === 'stir' || mode === 'dizzy' });
  };
  E.witch = {
    fly: [witch('fly', 0), witch('fly', 1)], swoop: witch('swoop'), dizzy: witch('dizzy'), hurt: witch('hurt'), sorry: witch('sorry'),
    stir: [witch('stir', 0), witch('stir', 1)]
  };

  /* HER POTION: a round bottle glowing green, a cork and a purple ribbon;
     frame 1 is tipped over, tumbling through the air. */
  A.potion = [0, 1].map(function (f) {
    var T = function (g) { return f ? turned(g, 6, 8.4, 0.62) : g; };
    var liquid = 7.8;
    return build(12, 14, [
      P(WOOD[2], T(rrect(4.1, 0.4, 7.9, 3.4, 1)), T(function (x, y) { return x + 0.5 < 5.6 ? WOOD[3] : WOOD[2]; }), WOOD[0]),
      P(LIME[3], T(rrect(4.4, 2.8, 7.6, 6, 0.8)), T(function (x, y) { return x + 0.5 < 5.4 ? LIME[4] : LIME[3]; }), LIME[1]),
      P(LIME[2], T(ell(6, 9.6, 5, 4.2)), T(function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (ell(3.8, 8, 1, 1.4)(X, Y)) return 'w';
        if ((X === 7.5 && Y === 10.5) || (X === 5.5 && Y === 12.5)) return LIME[4];
        if (Y < liquid) return LIME[4];
        return orb(5, 9, 6, 5, LIME)(x, y);
      }), LIME[0]),
      P(PURP[2], T(rrect(4, 4.4, 8, 5.6, 0.4)), null, PURP[0])
    ], [], f ? [[0, 1, ['.' + LIME[4]]], [1, 0, [LIME[3]]]] : []);
  });

  /* THE SPLASH where a potion bursts: green and sparkly, growing (0, 1),
     then fading to sparkles (2). */
  var SPARK = ['.' + LIME[4] + '.', LIME[4] + 'w' + LIME[4], '.' + LIME[4] + '.'];
  A.splash = [0, 1, 2].map(function (f) {
    var parts = [], free = [];
    var drop = function (ax, ay, bx, by, w) { return leaf(ax, ay, bx, by, w); };
    if (f === 0) {
      parts.push(P(LIME[2], or(ell(12, 15.6, 5.8, 2.2), drop(12, 16, 6.6, 8.6, 1.9), drop(12, 16, 10.2, 6, 1.8), drop(12, 16, 14.2, 6.2, 1.8), drop(12, 16, 17.6, 9, 1.9)), orb(10, 11, 8, 7, LIME), LIME[0]));
      free.push([5, 6, SPARK], [17, 5, SPARK], [11, 3, [LIME[4]]]);
    } else if (f === 1) {
      parts.push(
        P(LIME[2], or(ell(12, 16.4, 10.4, 1.6), drop(12, 16.6, 4.6, 9.6, 1.6), drop(12, 16.6, 8.4, 6.4, 1.6), drop(12, 16.6, 15.6, 6.4, 1.6), drop(12, 16.6, 19.6, 9.6, 1.6)), orb(10, 11, 12, 8, LIME), LIME[0]),
        P(LIME[3], or(ell(3, 5.4, 1.4, 1.4), ell(7.6, 2.4, 1.3, 1.3), ell(12, 1.8, 1.4, 1.4), ell(16.6, 2.6, 1.2, 1.2), ell(21, 5.6, 1.4, 1.4)), orb(11, 2, 12, 4, LIME), LIME[0])
      );
      free.push([0, 9, SPARK], [21, 10, SPARK], [10, 6, TWINKLE], [4, 0, [LIME[4]]], [19, 0, ['w']]);
    } else {
      parts.push(
        P(LIME[2], or(ell(7.4, 16.4, 3.6, 1.6), ell(16.4, 16.4, 4.2, 1.6)), function (x, y) { return y + 0.5 < 16 ? LIME[3] : LIME[2]; }, LIME[0]),
        P(LIME[3], or(ell(3.4, 11, 1.4, 1.6), ell(20.4, 10, 1.4, 1.6)), null, LIME[1])
      );
      free.push([2, 3, SPARK], [18, 2, ['.w.', 'w' + LIME[4] + 'w', '.w.']], [10, 6, [LIME[4]]], [13, 1, ['w']], [6, 8, [LIME[3]]], [16, 7, [LIME[4]]], [11, 11, SPARK]);
    }
    return build(24, 18, parts, [], free);
  });

  /* THE FROG: what a splash of potion turns Bonnie into for a few seconds
     (RIBBIT!). Round and green with big eyes and a wide smile — and his
     golden quiff on top, so it's still him. Unlike the creatures it faces
     RIGHT, as Bonnie's own frames do. idle, hop. */
  var BHAIR = ramp(['#a8692a', '#d99a40', '#f4c862', '#ffe292', '#fff7da']);
  var FEYE = ['.###.', '#www#', '#wwE#', '#wEE#', '.###.'];
  A.frog = (function () {
    var frog = function (hop) {
      var a = hop ? -0.32 : 0, dy = hop ? -3 : 0;
      var T = function (g) { return turned(shift(g, 0, dy), 12, 15 + dy, a); };
      var at = function (x, y) { var c = Math.cos(a), s = Math.sin(a), X = x - 12, Y = y - 15; return [12 + c * X - s * Y, 15 + dy + s * X + c * Y]; };
      var parts = [];
      if (hop) parts.push(
        P(FROG[2], or(limb([[7, 17 + dy], [3.6, 19.6], [1.6, 21]], 1.6), ell(1.8, 21, 2, 0.9)), null, FROG[0]),
        P(FROG[3], or(limb([[17.6, 16.6 + dy], [20.4, 18.6], [21.6, 20.6]], 1.2), ell(22, 20.8, 1.8, 0.8)), null, FROG[0])
      );
      else parts.push(
        P(FROG[2], or(ell(4.4, 18.6, 3.6, 3), ell(19.6, 18.6, 3.6, 3)), orb(12, 16, 12, 6, FROG), FROG[0]),
        P(FROG[2], or(ell(3, 21, 2.8, 0.9), ell(21, 21, 2.8, 0.9)), null, FROG[0])
      );
      parts.push(
        // his golden quiff, just poking up behind his eyes
        P(BHAIR[2], T(tube([[12, 10, 1.6], [12.4, 5, 1.4], [13.6, 3, 1.1], [15.4, 2.6, 0.8], [16.4, 3.6, 0.6]])), T(function (x, y) { return x + 0.5 < 12.4 ? BHAIR[3] : BHAIR[2]; }), BHAIR[0]),
        P(FROG[2], T(ell(12, 15.4, 9.6, 6.4)), T(function (x, y) { return ell(12.6, 18, 6, 3.2)(x + 0.5, y + 0.5) ? (y + 0.5 > 19.6 ? 'Z' : 'Y') : orb(10, 12, 11, 8, FROG)(x, y); }), FROG[0]),
        O(at(8, 8.4)[0], at(8, 8.4)[1], 3.8, 3.6, FROG, FROG[0]), O(at(16.2, 8.4)[0], at(16.2, 8.4)[1], 3.8, 3.6, FROG, FROG[0])
      );
      if (!hop) parts.push(P(FROG[3], or(ell(8.4, 21, 1.8, 0.9), ell(15.6, 21, 1.8, 0.9)), null, FROG[0]));
      var e1 = at(8, 8.4), e2 = at(16.2, 8.4), m = at(12, 14);
      var st = [[Math.round(e1[0]) - 2, Math.round(e1[1]) - 2, FEYE], [Math.round(e2[0]) - 2, Math.round(e2[1]) - 2, FEYE],
        [Math.round(m[0]) - 6, Math.round(m[1]) - 1, hop ? ['#..........#', '.#rrrrrrrr#.', '..########..'] : ['#..........#', '.##########.']],
        [Math.round(m[0]) - 8, Math.round(m[1]) - 2, [BLUSH + BLUSH]], [Math.round(m[0]) + 6, Math.round(m[1]) - 2, [BLUSH + BLUSH]]];
      return build(24, 22, parts, st);
    };
    return { idle: frog(false), hop: frog(true) };
  })();

  /* THE BIGGEST PUMPKIN EVER: huge and perfect, five deep lobes each
     lit like its own round, a thick curly stalk with a leaf and a curling
     tendril. sit · glow: under the Witch's spell, floating, a soft green
     glow round it · carved: the ending's giant happy jack-o'-lantern, lit
     warm from inside (two flickers). */
  var bigPumpkin = function (mode, f) {
    var cy = 31.4, parts = [];
    var lobe = function (cx, rx, ry, k) {
      var own = orb(cx - rx * 0.35, cy - ry * 0.45, rx * 1.25, ry * 1.12, PUMP);
      var lit = function (x, y) { var t = own(x, y); return k < -3 ? step(PUMP, t, -1) : k > 3 && t === PUMP[1] ? PUMP[2] : t; };
      return P(PUMP[2], ell(cx, cy + (17 - ry) * 0.4, rx, ry), function (x, y) {
        // a faint seam down the middle of each lobe, and the whole lit from the top left
        var X = x + 0.5;
        if (Math.abs(X - cx - (y - cy) * 0.04 * (cx - 32) / 10) < 0.5 && Math.abs(y - cy) < ry * 0.7) return step(PUMP, lit(x, y), -1);
        return lit(x, y);
      }, PUMP[0]);
    };
    parts.push(
      // the tendril and the leaf, behind
      P(MOSS[2], leaf(29.4, 14.6, 16.4, 8.4, 4.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = (X - 29.4) / (16.4 - 29.4), mid = 14.6 + (8.4 - 14.6) * t;
        if (Math.abs(Y - mid) < 0.55 && t > 0.05 && t < 0.9) return MOSS[1];
        return Y < mid ? MOSS[3] : MOSS[2];
      }, MOSS[0]),
      lobe(11.6, 8.6, 14.6, 4), lobe(52.4, 8.6, 14.6, -4),
      lobe(21.4, 10.6, 16.2, 2), lobe(42.6, 10.6, 16.2, -2),
      lobe(32, 11.4, 17, 0),
      // the stalk: thick, ridged, bending over, its cut end showing
      P(STEM[2], tube([[31.6, 16.4, 2.8], [32, 12, 2.4], [33.2, 8.4, 2], [35.6, 6.4, 1.7]]), function (x, y) {
        var X = x + 0.5;
        return Math.floor(X - y * 0.25) % 2 ? STEM[1] : X < 32.4 ? STEM[3] : STEM[2];
      }, STEM[0]),
      P(STEM[3], ell(36.4, 6, 1.6, 1.5), function (x, y) { return y + 0.5 < 6 ? STEM[4] : STEM[3]; }, STEM[0])
    );
    var st = [], free = [], opt = null, tendril = curl(43, 11, 0.6, 4.4, Math.PI * 0.9, 1.6, 0.6, 1);
    for (var ty = 4; ty < 18; ty++) for (var tx = 36; tx < 50; tx++) if (tendril(tx + 0.5, ty + 0.5)) free.push([tx, ty, [ty < 11 ? STEM[4] : STEM[3]]]);
    if (mode === 'carved') {
      // a happy face carved in, the candle's light inside: glowing hot at the
      // middle, the lit flesh of the cut along the top of each hole
      var holes = or(
        or(tri(10.6, 31.6, 27.4, 31.6, 19.4, 19.4), tri(36.6, 31.6, 53.4, 31.6, 44.6, 19.4)),
        tri(28.8, 37.6, 35.2, 37.6, 32, 33.2),
        minus(minus(ell(32, 38.4, 20.6, 10.8), ell(32, 32.4, 21.6, 10.4)), or(rrect(23.4, 40.6, 27.6, 45, 0.6), rrect(36.4, 40.6, 40.6, 45, 0.6)))
      );
      var inside = function (X, Y, r) { return holes(X - r, Y) && holes(X + r, Y) && holes(X, Y - r) && holes(X, Y + r); };
      parts.push(P('7', holes, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // the lit flesh of the cut along the top of each hole
        if (!holes(X, Y - 1.2)) return 'n';
        if (inside(X, Y, f ? 1.6 : 2.4)) return '8';
        if (inside(X, Y, 1)) return '7';
        return f ? '7' : '6';
      }, PUMP[0]));
    } else if (mode === 'glow') {
      opt = { halo: [LIME[3], LIME[2], LIME[1]] };
      free.push([3, 6, SPARK], [56, 10, SPARK], [60, 30, [LIME[4]]], [1, 34, ['w']], [50, 3, [LIME[4]]]);
    }
    return build(64, 52, parts, st, free, opt || { ground: true });
  };
  A.bigpumpkin = { sit: bigPumpkin('sit'), glow: bigPumpkin('glow'), carved: [bigPumpkin('carved', 0), bigPumpkin('carved', 1)] };

  /* ==========================================================================
     SCENERY — the graveyard and the Haunted Mansion. Friendly stones (no
     crosses, no words: a carved moon, a star, a heart), a twisty tree with
     a lantern, and the mansion's singing bust, crystal ball, grandfather
     clock, suit of armour and candlestick.
     ========================================================================== */
  // paint a shape as free pixels (no outline): for fine lines and flames
  var fine = function (shape, tex, x0, y0, x1, y1) {
    var out = [];
    for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) if (shape(x + 0.5, y + 0.5)) out.push([x, y, [tex(x, y)]]);
    return out;
  };
  // an engraving: a shape cut into stone, dark in the cut, lit on its lower right lip
  var engrave = function (shape, base, t) {
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (shape(X, Y)) return shape(X + 1, Y + 1) ? t[0] : t[1];
      if (shape(X - 1, Y - 1)) return t[4];
      return base(x, y);
    };
  };
  var mossy = function (balls) { return P(MOSS[2], or.apply(null, balls.map(function (b) { return ell(b[0], b[1], b[2], b[3]); })), function (x, y) { return (x * 7 + y * 3) % 5 === 0 ? MOSS[3] : orb(9, 0, 12, 10, MOSS)(x, y); }, MOSS[0]); };
  var FLOWER = function (c) { return ['.' + c + '.', c + 'D' + c, '.' + MOSS[3] + '.']; };

  // round-topped and mossy, a crescent moon carved on it, a flower at its foot
  D.grave1 = build(18, 22, [
    P(STONE[2], or(rrect(2.4, 8, 15.6, 21, 0.8), ell(9, 8.6, 6.6, 7)), engrave(minus(ell(9, 11.6, 3.4, 3.4), ell(10.8, 10.4, 2.8, 2.8)), orb(7, 7, 10, 12, STONE), STONE), STONE[0]),
    P(STONE[1], rrect(0.6, 19.4, 17.4, 22, 0.8), function (x, y) { return y + 0.5 < 20.4 ? STONE[2] : STONE[1]; }, STONE[0]),
    mossy([[5.4, 3.8, 3.2, 1.8], [9.6, 2.2, 3.4, 1.5], [3.2, 7.6, 1.3, 2.4], [14.4, 19.6, 3, 1.4], [2.6, 19.6, 2.2, 1.2]])
  ], [[12, 15, ['.' + STONE[1] + '.', STONE[1] + '..']]], [[1, 16, FLOWER('r')], [14, 16, FLOWER('d')]]);

  // tall and pointed, a star carved on it, a little jack-o'-lantern at its foot
  D.grave2 = build(16, 26, [
    P(STONE[2], or(rrect(2, 9, 14, 23.6, 0.6), and(and(ell(14, 10, 12, 12), ell(2, 10, 12, 12)), function (x, y) { return y < 10.5; })), engrave(star(8, 10.6, 3.6, 1.6, -Math.PI / 2), orb(6, 8, 10, 16, STONE), STONE), STONE[0]),
    P(STONE[1], rrect(0.6, 22.4, 15.4, 26, 0.8), function (x, y) { return y + 0.5 < 23.4 ? STONE[2] : STONE[1]; }, STONE[0]),
    mossy([[12.4, 14, 1.4, 3], [12.6, 18.6, 1.8, 2.4], [4, 22.6, 3, 1.2]]),
    P(PUMP[2], ell(11.4, 23.4, 3.6, 2.6), ribbed(11.4, 23.4, 3.6, 2.6, PUMP, 3), PUMP[0]),
    P(STEM[2], cap(11.6, 21, 12.4, 19.8, 0.6), null, STEM[0])
  ], [[9, 22, carve(['o.o', '7.7'])], [10, 24, carve(['777'])]]);

  // wide and leaning, a heart carved on it, flowers in front
  var heart = function (cx, cy, r) { return or(ell(cx - r * 0.5, cy, r * 0.62, r * 0.6), ell(cx + r * 0.5, cy, r * 0.62, r * 0.6), tri(cx - r * 1.08, cy + 0.2, cx + r * 1.08, cy + 0.2, cx, cy + r * 1.3)); };
  D.grave3 = build(24, 18, [
    P(STONE[2], turned(or(rrect(3, 4, 21, 17, 1), rrect(3, 1.6, 21, 10, 4.4)), 12, 17, 0.12), engrave(turned(heart(12, 8, 3), 12, 17, 0.12), orb(8, 4, 16, 14, STONE), STONE), STONE[0]),
    P(MOSS[1], ell(12, 17.6, 11.6, 1.8), function (x, y) { return (x + y) % 3 ? MOSS[2] : MOSS[3]; }, MOSS[0]),
    mossy([[19, 2.4, 2.6, 1.4], [20.6, 6, 1.2, 2.4]]),
    P(STEM[2], or(cap(4, 17, 3.6, 12.4, 0.45), cap(7, 17, 7.6, 13.4, 0.45), cap(17.6, 17, 18, 13.6, 0.45)), null, STEM[0]),
    P(PUMP[3], or(ell(3.6, 12, 1.5, 1.4), ell(17.8, 13, 1.5, 1.4)), function (x, y) { return y + 0.5 < 12.6 ? PUMP[4] : PUMP[3]; }, PUMP[1]),
    P(PURP[3], ell(7.6, 12.8, 1.5, 1.4), function (x, y) { return y + 0.5 < 13 ? PURP[4] : PURP[3]; }, PURP[1])
  ], [[3, 11, ['D']], [7, 12, ['D']], [17, 12, ['D']]]);

  /* The graveyard's twisty tree: bare, its branches curling at their ends,
     a few orange leaves hanging on, and a lantern hung from a branch.
     (Named D.lanterntree because D.deadtree is creatures.js's tree for the
     spooky woods in the earlier lands.) */
  D.lanterntree = build(42, 64, (function () {
    var bark = function (x, y) { var X = x + 0.5; return Math.floor(X * 0.9 + y * 0.35) % 4 === 0 ? BARK[1] : orb(18, 30, 14, 34, BARK)(x, y); };
    var br = function (pts, end) { return P(BARK[2], or(tube(pts), end), bark, BARK[0]); };
    var parts = [
      // roots and trunk, twisting up
      P(BARK[2], or(tube([[21, 64, 5.4], [20.4, 57, 4], [22.6, 49, 3.4], [20, 41, 3], [21.6, 33, 2.6], [21, 28, 2.2]]), tri(12, 64, 21, 56, 21, 64), tri(31, 64, 21, 56, 21, 64)), bark, BARK[0]),
      br([[21, 36, 2.2], [14, 31, 1.6], [8.6, 27, 1.2], [5.6, 22.6, 0.9]], curl(7.6, 20.6, 0.3, 2.4, Math.PI, 1.1, 0.8, 1)),
      br([[21.4, 31, 2], [27, 25.4, 1.6], [33, 22, 1.2], [37, 17.4, 0.9]], curl(35, 15.4, 0.3, 2.4, 0, 1.1, 0.8, -1)),
      br([[21.6, 30, 2], [19.6, 21, 1.6], [21.6, 13.6, 1.2], [18.6, 7, 0.9]], curl(20.6, 5.2, 0.3, 2.4, Math.PI, 1.1, 0.8, 1)),
      br([[21, 45, 1.8], [28, 42.6, 1.3], [33, 43.6, 0.9]], curl(34, 41.4, 0.3, 2, Math.PI / 2, 1, 0.7, -1)),
      br([[20.4, 50, 1.6], [14, 47.4, 1.1], [10.6, 48.4, 0.8]], curl(10, 46.2, 0.3, 1.8, Math.PI / 2, 1, 0.7, 1)),
      // a knot hole
      P(BARK[0], ell(21.4, 52, 1.4, 1.9), null, BARK[0])
    ];
    // the lantern, hung from a hook on the right branch
    parts.push(
      P(INK[2], or(rrect(28.6, 30.6, 33.4, 32.2, 0.6), tri(28.6, 31, 33.4, 31, 31, 28.4)), function (x, y) { return y + 0.5 < 31 ? INK[4] : INK[3]; }, INK[0]),
      P('7', rrect(28.8, 32, 33.2, 38.4, 1), function (x, y) { var X = x + 0.5, Y = y + 0.5; if (Math.abs(X - 31) < 0.5) return INK[2]; return ell(31, 35, 1.6, 2)(X, Y) ? '8' : X < 30 ? '7' : '6'; }, INK[0]),
      P(INK[2], rrect(28.4, 38, 33.6, 39.6, 0.6), null, INK[0])
    );
    // a few orange leaves still hanging on
    [[8.6, 28.6, 0.5], [14.4, 32.4, -0.4], [32.4, 21.6, 0.7], [24.6, 26.4, -0.6], [18.4, 11.6, 0.3], [28.4, 42.2, 0.6], [13, 48.6, -0.5]].forEach(function (l, i) {
      var a = l[2];
      parts.push(P(i % 2 ? PUMP[2] : PUMP[3], leaf(l[0], l[1], l[0] + Math.cos(a + 1.2) * 3.4, l[1] + Math.sin(a + 1.2) * 3.4, 1.3), function (x, y) { return y + 0.5 < l[1] + 1 ? PUMP[4] : PUMP[3]; }, PUMP[0]));
    });
    return parts;
  })(), [], fine(cap(31, 26.4, 31, 28.6, 0.5), function () { return INK[3]; }, 29, 25, 33, 30).concat([[2, 40, [PUMP[3], PUMP[2]]], [36, 52, ['.' + PUMP[3], PUMP[2]]]]));

  /* THE SINGING BUST: a jolly marble gentleman with sculpted curls and a
     grand curly moustache, on a plinth. quiet, then sing: his mouth open,
     brows up, his eyes shut in the joy of it, a note floating up. */
  D.bust = [false, true].map(function (sing) {
    var hy = sing ? 6.8 : 7.2, m = 'i', k = MARB[0];
    var parts = [
      P(STONE[2], rrect(5, 15.4, 15, 24, 0.6), function (x, y) { var X = x + 0.5; return Math.abs(X - 7.4) < 0.5 || Math.abs(X - 12.6) < 0.5 ? STONE[1] : X < 8 ? STONE[3] : STONE[2]; }, STONE[0]),
      P(STONE[2], or(rrect(3, 14, 17, 16.4, 0.8), rrect(3.4, 23.4, 16.6, 26, 0.6)), function (x, y) { return y + 0.5 < 15 || (y + 0.5 > 23.4 && y + 0.5 < 24.4) ? STONE[3] : STONE[1]; }, STONE[0]),
      P(MARB[2], and(ell(10, 15, 8, 4.6), function (x, y) { return y < 14.4; }), orb(8, 11, 10, 6, MARB), MARB[0]),
      P(MARB[2], rrect(8, 10, 12, 13, 1), function (x, y) { return MARB[1]; }, MARB[0]),
      P(MARB[2], ell(10, hy, 5, 5.6), orb(8.6, hy - 1.8, 6.4, 6.6, MARB), MARB[0]),
      // sculpted curls on top and over his ears
      P(MARB[3], or(and(fluff(10, hy - 4, 5.6, 2.8, 6, 0.24), function (x, y) { return y < hy - 2.6; }), ell(5, hy - 2, 1.4, 1.7), ell(15, hy - 2, 1.4, 1.7)), function (x, y) {
        var X = x + 0.5;
        return Math.abs(((X - 10) % 2.8 + 2.8) % 2.8 - 1.4) < 0.4 && y + 0.5 > hy - 5 ? MARB[1] : orb(8, hy - 6, 7, 4, MARB)(x, y);
      }, MARB[1]),
      // the grand moustache, curling up at its ends
      P(MARB[4], or(ell(8.2, hy + 2.2 - (sing ? 0.6 : 0), 2.3, 1.1), ell(11.8, hy + 2.2 - (sing ? 0.6 : 0), 2.3, 1.1), curl(5.8, hy + 1 - (sing ? 0.6 : 0), 0.2, 1.3, 0, 0.75, 0.6, -1), curl(14.2, hy + 1 - (sing ? 0.6 : 0), 0.2, 1.3, Math.PI, 0.75, 0.6, 1)), function (x, y) { return y + 0.5 > hy + 2.4 ? MARB[3] : MARB[4]; }, MARB[1])
    ];
    var Y = Math.round(hy);
    var st = sing
      ? [[6, Y - 3, [m + m + '....' + m + m]], [6, Y - 1, ['.' + m + m + '..' + m + m + '.']], [9, Y + 2, ['.E.', 'EuE', '.E.']]]
      : [[6, Y - 2, [k + k + '....' + k + k]], [7, Y - 1, [m + '....' + m]], [9, Y + 3, [m + m]]];
    st.push([10, Y - 1, [MARB[4]]], [10, Y, [MARB[1]]]);
    var free = sing ? [[16, 0, ['.CC', '.C.', 'CC.']], [1, 4, ['.C', 'CC']]] : [];
    return build(20, 26, parts, st, free);
  });

  /* THE CRYSTAL BALL: on a little round table under a draped purple
     cloth with a gold fringe; inside, in the mist, a friendly face. Two
     frames: the mist swirls and the face winks out and back. */
  D.crystalball = [0, 1].map(function (f) {
    var parts = [
      P(CLOTH[2], or(ell(11, 16.6, 9.6, 2.6), rrect(1.6, 16.6, 20.4, 26.4, 1)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (Y > 25.2) return Math.floor(X) % 2 ? GOLD[2] : GOLD[3];
        if (Y > 17.6 && Math.abs(((X - 1.6) % 4.6) - 2.3) < 0.5) return CLOTH[1];
        return Y < 17.4 ? CLOTH[3] : X < 6 ? CLOTH[3] : CLOTH[2];
      }, CLOTH[0]),
      P(GOLD[2], or(rrect(7, 13.4, 15, 16.8, 1.4), ell(11, 16.6, 5, 1)), function (x, y) { return y + 0.5 < 14.8 ? GOLD[3] : GOLD[2]; }, GOLD[0]),
      P(GLASS[2], ell(11, 7.6, 6.8, 6.8), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, dx = X - 11, dy = Y - 7.6, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
        if (ell(8, 4.6, 1.4, 1)(X, Y)) return 'w';
        // the mist: soft bands swirling round, and the pale oval of a face in it
        if (Math.abs(Math.sin(a * 2 + r * 0.9 + f * 1.6)) < 0.3 && r > 4.2) return GLASS[3];
        if (ell(11, 8.4, 3.6, 3.8)(X, Y)) return f ? GLASS[3] : 'e';
        return r < 3 ? GLASS[3] : orb(9, 5.4, 8, 8, GLASS)(x, y);
      }, GLASS[0])
    ];
    var st = f ? [[9, 7, [GLASS[1] + '.' + '.' + GLASS[1]]], [10, 10, [GLASS[1] + GLASS[1]]]] : [[9, 7, ['E..E']], [9, 9, ['3..3']], [10, 10, ['EE']]];
    return build(22, 28, parts, st, f ? [[2, 2, [GLASS[3]]], [18, 4, [GLASS[4]]]] : [[19, 1, [GLASS[4]]], [3, 6, [GLASS[3]]]], { ground: true });
  });

  /* THE GRANDFATHER CLOCK: mahogany, an arched hood with brass finials,
     a cream dial (its hands at ten past ten, like a smile), a brass
     pendulum behind a glass window, bun feet. */
  D.grandclock = build(18, 50, [
    P(MAHOG[2], or(rrect(1, 7, 17, 20.6, 1), ell(9, 7.4, 8, 5.6)), function (x, y) { return x + 0.5 < 3 || y + 0.5 < 4.6 ? MAHOG[3] : orb(6, 8, 12, 14, MAHOG)(x, y); }, MAHOG[0]),
    P(GOLD[2], or(ell(9, 1.4, 1.4, 1.4), ell(2, 5.4, 1.2, 1.2), ell(16, 5.4, 1.2, 1.2)), orb(8, 0, 10, 6, GOLD), GOLD[0]),
    P(GOLD[2], ell(9, 12.4, 5.8, 5.8), orb(7, 10, 7, 7, GOLD), GOLD[0]),
    P(PAPER[2], ell(9, 12.4, 4.7, 4.7), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, dx = X - 9, dy = Y - 12.4, r = Math.sqrt(dx * dx + dy * dy);
      if (r > 3.3 && r < 4.2 && Math.abs(((Math.atan2(dy, dx) / (Math.PI / 6)) % 1 + 1) % 1 - 0.5) > 0.36) return MAHOG[1];
      return orb(8, 11, 6, 6, PAPER)(x, y);
    }, GOLD[0]),
    P(MAHOG[2], rrect(3, 20, 15, 41, 0.6), function (x, y) { var X = x + 0.5; return X < 4.4 ? MAHOG[3] : X > 13.6 ? MAHOG[1] : MAHOG[2]; }, MAHOG[0]),
    P(INK[1], rrect(5.6, 23, 12.4, 37.4, 2), function (x, y) { return x + 0.5 < 7 ? INK[2] : INK[1]; }, MAHOG[0]),
    P(GOLD[2], or(cap(9, 23.6, 9, 32, 0.45), ell(9, 33.2, 2, 2)), orb(8.4, 32.4, 2.6, 2.6, GOLD), GOLD[0]),
    P(MAHOG[2], rrect(1, 40.4, 17, 48.4, 1), function (x, y) { var X = x + 0.5, Y = y + 0.5; if (rrect(4, 42.4, 14, 46.4, 1)(X, Y) && !rrect(5, 43.4, 13, 45.4, 0.6)(X, Y)) return MAHOG[1]; return X < 3 ? MAHOG[3] : MAHOG[2]; }, MAHOG[0]),
    P(MAHOG[1], or(ell(3.6, 49, 2, 1.2), ell(14.4, 49, 2, 1.2)), null, MAHOG[0])
  ], [[6, 10, ['G.....', '.G...G', '..G.G.', '...G..']], [9, 12, ['G']]]);

  /* A SUIT OF ARMOUR: polished steel, a purple plume, a little shield with
     a pumpkin on it — and, if you look closely, two friendly eyes peeping
     out of the visor. */
  D.armour = build(20, 44, [
    // the plume, curling back off the helmet
    P(PURP[2], tube([[10, 3.6, 1.4], [12.6, 1.6, 1.8], [16, 1.6, 1.6], [18.4, 3.6, 1.2], [18.6, 6.4, 0.8]]), function (x, y) { return y + 0.5 < 2.6 ? PURP[4] : y + 0.5 < 4 ? PURP[3] : PURP[2]; }, PURP[0]),
    // legs and feet
    P(STEEL[2], or(rrect(5.4, 30, 9, 41, 1.4), rrect(11, 30, 14.6, 41, 1.4)), function (x, y) { var X = x + 0.5; return (X > 5.6 && X < 6.8) || (X > 11.2 && X < 12.4) ? STEEL[3] : STEEL[2]; }, STEEL[0]),
    P(STEEL[2], or(ell(7.2, 34.4, 2.4, 1.8), ell(12.8, 34.4, 2.4, 1.8)), orb(6.6, 33.6, 3, 2.4, STEEL), STEEL[0]),
    P(STEEL[2], or(ell(6, 42.4, 3.6, 1.6), ell(14, 42.4, 3.6, 1.6)), function (x, y) { return y + 0.5 < 42 ? STEEL[3] : STEEL[1]; }, STEEL[0]),
    // the skirt of plates
    P(STEEL[2], quad([4.6, 25.6], [15.4, 25.6], [16.2, 31.6], [3.8, 31.6]), function (x, y) { var Y = y + 0.5; return Math.abs((Y - 25.6) % 2 - 1.6) < 0.4 ? STEEL[1] : x + 0.5 < 7 ? STEEL[3] : STEEL[2]; }, STEEL[0]),
    // breastplate with a ridge down the middle
    P(STEEL[2], or(ell(10, 20.6, 6.4, 6.4), rrect(4.6, 14, 15.4, 22, 2)), function (x, y) { var X = x + 0.5; if (Math.abs(X - 10) < 0.5) return STEEL[4]; return orb(8, 17, 8, 9, STEEL)(x, y); }, STEEL[0]),
    // arms, the near one bent to hold the shield
    P(STEEL[2], limb([[3.6, 16.6], [2.8, 22.4], [3.2, 26.6]], 1.6), orb(3, 20, 3, 6, STEEL), STEEL[0]),
    P(STEEL[2], ell(3.2, 27.6, 1.9, 1.8), orb(2.6, 27, 2.4, 2.4, STEEL), STEEL[0]),
    P(STEEL[2], or(ell(3.6, 15.8, 3, 2.6), ell(16.4, 15.8, 3, 2.6)), function (x, y) { var Y = y + 0.5; return Math.abs(Y - 16.4) < 0.4 ? STEEL[1] : orb(3, 14, 6, 4, STEEL)(x, y); }, STEEL[0]),
    // the shield: a heater shape with a pumpkin on it
    P(CLOTH[2], or(rrect(12.6, 20.6, 19.4, 25.6, 0.8), tri(12.6, 25, 19.4, 25, 16, 31)), function (x, y) { return x + 0.5 < 14.2 ? CLOTH[3] : CLOTH[2]; }, GOLD[1]),
    P(PUMP[2], ell(16, 25, 2.2, 1.8), orb(15.4, 24.4, 2.6, 2.2, PUMP), PUMP[0]),
    // the helmet, visor down
    P(STEEL[2], or(ell(10, 8.4, 5.2, 5.6), rrect(5, 8, 15, 13.6, 2)), function (x, y) { var X = x + 0.5, Y = y + 0.5; if (Math.abs(X - 10) < 0.5 && Y < 7) return STEEL[4]; return orb(8, 6, 7, 7, STEEL)(x, y); }, STEEL[0]),
    P(STEEL[1], rrect(6, 12.6, 14, 14.6, 0.8), null, STEEL[0])
  ], [[6, 9, ['EEEEEEEE']], [6, 10, ['EDEEEEDE']], [7, 11, ['.E.E.E']], [15, 22, ['F']], [16, 23, ['.']]]);

  /* A CANDLESTICK: brass, a tall candle with wax dripping down it and over
     the tray, and its flame. */
  D.candle3 = build(16, 24, [
    P(GOLD[2], or(ell(8, 22.4, 6.4, 1.6), rrect(3, 21, 13, 23.6, 1)), function (x, y) { return y + 0.5 < 22 ? GOLD[3] : GOLD[2]; }, GOLD[0]),
    P(GOLD[2], or(rrect(6.6, 15, 9.4, 21.6, 0.8), ell(8, 18.4, 2.4, 1.2), ring(12.6, 18.4, 1.9, 0.9)), function (x, y) { return x + 0.5 < 7.6 ? GOLD[3] : GOLD[2]; }, GOLD[0]),
    P(GOLD[2], ell(8, 14.8, 5, 1.4), function (x, y) { return y + 0.5 < 14.6 ? GOLD[3] : GOLD[1]; }, GOLD[0]),
    P(WAX[2], or(rrect(5.6, 6, 10.4, 14.6, 0.8), cap(5.4, 8, 5.4, 11.6, 0.7), cap(10.6, 7.4, 10.6, 9.6, 0.6), cap(4.2, 14.4, 4.2, 17, 0.6), ell(9.6, 14.4, 2.4, 0.9)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y < 7.2) return WAX[4];
      return X < 7.2 ? WAX[3] : X > 9.4 ? WAX[1] : WAX[2];
    }, WAX[0])
  ], [[8, 5, ['G']]], fine(leaf(8, 5.4, 8.2, 0.2, 1.9), function (x, y) { var X = x + 0.5, Y = y + 0.5; return ell(8, 3.8, 0.8, 1.4)(X, Y) ? '8' : ell(8, 3.6, 1.4, 2)(X, Y) ? '7' : '6'; }, 4, 0, 12, 6));

  /* ---- on the sprite sheet (tools/sheet.html?only=land6) ---- */
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
    ['land6 night', group([['skelly', E.skelly], ['ghostdog', E.ghostdog], ['hitch1', E.hitch1], ['hitch2', E.hitch2], ['hitch3', E.hitch3], ['jackhop', E.jackhop], ['book', E.book], ['minwitch', E.minwitch], ['toad', E.toad], ['wisp', E.wisp]])],
    ['land6 witch', group([['witch', E.witch], ['potion', A.potion], ['splash', A.splash], ['frog', A.frog], ['bigpumpkin', A.bigpumpkin]])],
    ['land6 haunt', group([['grave1', D.grave1], ['grave2', D.grave2], ['grave3', D.grave3], ['lanterntree', D.lanterntree], ['bust', D.bust], ['crystalball', D.crystalball], ['grandclock', D.grandclock], ['armour', D.armour], ['candle3', D.candle3]])]
  );
})();
