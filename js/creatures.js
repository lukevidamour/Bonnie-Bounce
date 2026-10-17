/* ==========================================================================
   creatures.js — everyone Bonnie meets, drawn at full density.

   One style for the whole cast: round, soft shapes lit from the top left
   (each shape shades itself like a little sphere — deep, shade, base,
   light, a pin-point of shine), a coloured outline, and big friendly eyes
   with a sparkle. Cross enough to be baddies, never scary: brows for the
   grumpy ones, blush for the shy ones.

   Every creature faces left (the way they first walk) and replaces the
   game-pixel version of itself in BB.ART.en, keeping the same names and
   frame counts, so game.js needs no changes.
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, K = A.kit, E = A.en, ell = K.ell, cap = K.cap, limb = K.limb, rrect = K.rrect;

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
    // Bear's soft grey fur, deep to shine
    '!': '#56546c', '$': '#7a7892', '%': '#a3a1b8', '&': '#c9c7da', '*': '#eeedf7'
  };
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
  var build = function (W, H, parts, stamps) {
    var rows = K.scene(W, H, parts);
    (stamps || []).forEach(function (s) { K.stamp(rows, s[0], s[1], s[2]); });
    var sp = BB.sprHi(rows, PAL, 'shade');
    sp.noLight = 'all';
    return sp;
  };
  // eyes, looking left: big, small, closed, cross (knocked out)
  var EYE = ['.##.', '#ww#', '#Ew#', '#EE#', '.##.'];
  var EYE_S = ['.#.', '#Ew', '#EE', '.#.'];
  var SHUT = ['....', '#..#', '.##.'];
  var tri = function (ax, ay, bx, by, cx, cy) {
    return function (x, y) {
      var s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by), s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy), s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
      return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
    };
  };

  // Grumbug: a cross little beetle with a glossy purple shell
  E.grumbug = [0, 1].map(function (f) {
    var legs = [8, 13, 18].map(function (x, i) { var k = (i + f) % 2 ? 1.6 : -1.6; return P('g', cap(x, 17, x + k, 21.2, 0.9)); });
    return build(26, 22, legs.concat([
      P('c', ell(15, 10, 10, 8.4), function (x, y) {
        if (Math.abs(x + 0.5 - 15.5) < 0.6 && y < 16) return 'a';
        if (ell(19, 6, 1.7, 1.5)(x + 0.5, y + 0.5) || ell(12, 12.5, 1.5, 1.3)(x + 0.5, y + 0.5) || ell(20.5, 13, 1.3, 1.2)(x + 0.5, y + 0.5)) return 'd';
        return orb(15, 10, 10, 8.4, 'abcde')(x, y);
      }),
      O(6.5, 13.2, 5.8, 5.2, 'fghij', 'f'),
      P('h', or(cap(5, 8.5, 2.6, 3.2, 0.6), cap(8.4, 8.5, 9, 3, 0.6))), P('i', or(ell(2.5, 3, 1.2, 1.2), ell(9, 2.7, 1.2, 1.2)))
    ]), [[1, 9, EYE], [5.5 | 0, 9, EYE], [1, 8, ['##.']], [6, 8, ['.##']], [4, 15, ['.#.', '#.#']]]);
  });
  E.grumbugFlat = build(26, 9, [O(14, 5.5, 11, 3.6, 'abcde'), O(5, 5.5, 4.2, 3, 'fghij', 'f')], [[2, 4, ['#.#', '.#.']], [6, 4, ['#.#', '.#.']]]);

  // Snail: a pink snail with eyes on stalks and a spiralled shell
  var spiral = function (cx, cy, rot) {
    return function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.sqrt(dx * dx + dy * dy), a = (Math.atan2(dy, dx) + rot + Math.PI * 4) % (Math.PI * 2);
      for (var k = 0; k < 3; k++) if (Math.abs(r - (1.2 + 2.6 * (a / (Math.PI * 2) + k))) < 0.55) return true;
      return false;
    };
  };
  var shellTex = function (cx, cy, rx, ry, rot) { var base = orb(cx, cy, rx, ry, 'klmno'), sp = spiral(cx, cy, rot); return function (x, y) { return sp(x, y) ? 'k' : base(x, y); }; };
  E.snail = [0, 1].map(function (f) {
    return build(32, 24, [
      P('r', rrect(2 + f, 16, 30, 22, 3), orb(16, 18, 15, 5, 'pqrst')),
      P('r', cap(6, 19, 5, 10, 3.2), orb(5, 13, 3.6, 8, 'pqrst')),
      P('q', or(cap(4, 9, 2, 3.6, 0.7), cap(6.5, 9, 8, 4, 0.7))),
      P('w', or(ell(2, 3.2, 1.9, 1.9), ell(8.2, 3.6, 1.9, 1.9))),
      P('m', ell(19, 10.5, 9, 9), shellTex(19, 10.5, 9, 9, 0), 'k')
    ], [[1, 3, ['E']], [7, 3, ['E']], [3, 14, ['#..#', '.##.']]]);
  });
  E.shell = [0, 1].map(function (f) {
    return build(22, 20, [P('m', ell(11, 10, 10, 9.4), shellTex(11, 10, 10, 9.4, f * Math.PI))]);
  });

  // Crab: round and red, claws up, eyes on stalks
  E.crab = [0, 1].map(function (f) {
    var legs = [];
    [[6, 1], [9, 1], [12, 1], [18, -1], [21, -1], [24, -1]].forEach(function (L, i) {
      var k = (i + f) % 2 ? 1.2 : -0.6;
      legs.push(P('v', cap(L[0], 16, L[0] - L[1] * 2.5, 20.5 + k * 0.3, 0.8)));
    });
    return build(30, 22, legs.concat([
      O(15, 13, 10.5, 6.2, 'uvxyz'),
      P('x', or(ell(3.8, 7.2, 3.5, 2.2), ell(4.2, 10.6, 3, 1.7)), orb(4, 9, 4, 4, 'uvxyz')),
      P('x', or(ell(26.2, 7.2, 3.5, 2.2), ell(25.8, 10.6, 3, 1.7)), orb(26, 9, 4, 4, 'uvxyz')),
      P('v', or(cap(12, 8, 11, 3.5, 0.7), cap(18, 8, 19, 3.5, 0.7))),
      P('w', or(ell(11, 2.6, 2.1, 2.1), ell(19, 2.6, 2.1, 2.1)))
    ]), [[10, 2, ['E.']], [18, 2, ['E.']], [12, 13, ['#....#', '.####.']]]);
  });

  // Bee: fuzzy, striped, wings a blur
  E.bee = [0, 1].map(function (f) {
    var wy = f ? 6.5 : 4.5;
    return build(28, 22, [
      P('L', or(ell(16, wy, 5.5, 3.6), ell(11, wy + 1, 4.2, 3)), function (x, y) { return y > wy + 1.5 ? 'M' : 'L'; }, 'M'),
      P('C', ell(14, 13.5, 9.5, 7), function (x, y) {
        var st = Math.floor((x - 9) / 3.4);
        if (x > 10 && x < 22 && st % 2 === 0) return orb(14, 13.5, 9.5, 7, 'GGGhh')(x, y);
        return orb(14, 13.5, 9.5, 7, 'ABCDF')(x, y);
      }),
      P('G', tri(23, 12, 23, 15.5, 27, 13.8)),
      P('G', cap(8, 8, 5, 3.5, 0.55)), P('G', ell(4.8, 3.3, 1, 1))
    ], [[5, 10, EYE], [3, 17, ['#.#', '.#.']], [9, 15, ['3']]]);
  });

  // Seagull: white and round, a little cross
  E.gull = [0, 1].map(function (f) {
    var wing = f ? ell(17, 15.5, 7.5, 2.8) : ell(17, 4.5, 7.5, 2.8);
    return build(30, 20, [
      P('2', ell(25.5, 11, 4.2, 2), orb(25.5, 11, 4.2, 2, '2211W')),
      O(15, 11, 9, 5.2, '21WwR'),
      O(7, 8.5, 4.6, 4.2, '21WwR'),
      P('m', tri(0.5, 9, 3.4, 7.8, 3.4, 10.4)),
      P('P', wing, orb(17, f ? 15.5 : 4.5, 7.5, 2.8, 'OPQQR'))
    ], [[5, 6, EYE_S], [4, 5, ['##']]]);
  });

  // Fish: a stripy clownfish with a waggly tail
  E.fish = [0, 1].map(function (f) {
    var tail = f ? tri(23, 10, 30, 3.5, 29, 16.5) : tri(23, 10, 30, 5, 30, 15);
    return build(30, 20, [
      P('l', tail, null, 'k'),
      P('m', ell(13, 10, 11, 7.5), function (x, y) { if (Math.abs(x + 0.5 - 14) < 1.6) return 'w'; if (Math.abs(x + 0.5 - 14) < 2.2) return 'G'; return orb(13, 10, 11, 7.5, 'klmno')(x, y); }),
      P('l', tri(10, 3.5, 17, 3, 13, 0.5), null, 'k')
    ], [[4, 6, EYE], [1, 11, ['#.']]]);
  });

  // Jellyfish: a soft pink dome, all smiles
  E.jelly = [0, 1].map(function (f) {
    var tents = [5, 9.5, 14, 18.5].map(function (x, i) {
      var pts = [];
      for (var k = 0; k <= 6; k++) pts.push([x + Math.sin(k * 0.9 + i + f * 1.6) * 1.4, 13 + k * 2.2]);
      return P('r', limb(pts, 0.8), function (xx, yy) { return yy > 22 ? 's' : 'r'; });
    });
    return build(24, 28, tents.concat([
      P('r', function (x, y) { return ell(12, 9.5, 11.5, 9)(x, y) && y < 14; }, orb(12, 9, 11.5, 9, 'pqrst'))
    ]), [[6, 6, EYE_S], [14, 6, EYE_S], [10, 10, ['#..#', '.##.']], [4, 10, ['3']], [19, 10, ['3']]]);
  });

  // Ghost: shy — covers its eyes while you look at it
  var ghostBody = function (x, y) { return ell(14, 12, 12, 11)(x, y) || (y > 12 && y < 25 + Math.sin(x * 0.8) * 1.6 && x > 2.2 && x < 25.8); };
  E.ghost = [false, true].map(function (shy) {
    return build(28, 28, [
      P('w', ghostBody, orb(14, 13, 13, 14, '21WwR'))
    ].concat(shy ? [P('W', or(ell(8, 12.5, 3.2, 2.4), ell(18, 12.5, 3.2, 2.4)), orb(13, 12, 9, 4, '21WwR'))] : []),
      shy ? [[6, 16, ['33', '..']], [19, 16, ['33']], [11, 18, ['.##.']]] : [[6, 9, EYE], [15, 9, EYE], [10, 16, ['.##.', '#ss#', '.##.']], [4, 15, ['33']], [21, 15, ['33']]]);
  });

  // Bat: a round purple bat; hangs asleep until you pass
  var batBody = [O(16, 10, 5.6, 6, 'abcde'), P('b', or(tri(12, 6, 13, 0.5, 15, 5), tri(17, 5, 19, 0.5, 20, 6)))];
  var batWings = function (up) {
    var y = up ? -1 : 1;
    return P('b', or(ell(6.5, 9 + y * 3, 6, 3.6), ell(25.5, 9 + y * 3, 6, 3.6), ell(9, 10 + y, 4, 3), ell(23, 10 + y, 4, 3)), function (x, yy) { return (Math.round(x) % 4 === 0 && yy > 9 + y * 3) ? 'a' : 'b'; }, 'a');
  };
  E.bat = [
    build(32, 20, [batWings(true)].concat(batBody), [[12, 8, EYE_S], [17, 8, EYE_S], [14, 13, ['w.w']]]),
    build(32, 20, [batWings(false)].concat(batBody), [[12, 8, EYE_S], [17, 8, EYE_S], [14, 13, ['w.w']]]),
    build(20, 24, [P('b', ell(10, 12, 7, 10.5), orb(10, 12, 7, 10.5, 'abcde'), 'a'), P('b', or(tri(6, 21, 7, 24, 9, 21.5), tri(11, 21.5, 13, 24, 14, 21)))], [[5, 12, SHUT], [11, 12, SHUT]])
  ];

  // Hedgehog: soft face, prickly back — no stomping!
  E.hog = [0, 1].map(function (f) {
    var spikes = function (x, y) {
      var dx = x - 16, dy = y - 15, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
      var tooth = Math.abs(((a * 3.2 / Math.PI) % 1 + 1) % 1 - 0.5) * 2;
      return dy < 3 && r < 9.5 + tooth * 3.2;
    };
    return build(30, 24, [
      P('T', spikes, function (x, y) { var a = Math.atan2(y - 15, x - 16); return ((a * 3.2 / Math.PI) % 1 + 1) % 1 < 0.35 ? 'S' : orb(16, 13, 12, 10, 'STUVX')(x, y); }, 'S'),
      O(16, 15.5, 9, 6.5, 'TUVXX'),
      O(6, 15.5, 5.2, 4.6, 'ZZYYw', 'Z'),
      P('G', ell(1.6, 15, 1.4, 1.2)),
      P('T', or(ell(10 + (f ? 1 : -1), 21.6, 2.2, 1.4), ell(20 + (f ? -1 : 1), 21.6, 2.2, 1.4)))
    ], [[4, 12, EYE_S], [6, 18, ['3']]]);
  });

  // Grumpy rock: a stone block that wakes up cross
  E.rock = [false, true].map(function (awake) {
    return build(36, 36, [
      P('P', rrect(0.5, 0.5, 35.5, 35.5, 7), function (x, y) {
        if (Math.abs(x - 26 - (y - 6) * 0.35) < 0.5 && y > 4 && y < 12) return 'N';
        return orb(14, 12, 30, 30, 'NOPQR')(x, y);
      })
    ], awake
      ? [[7, 10, ['#....', '.##..']], [22, 10, ['....#', '..##.']], [7, 12, EYE], [24, 12, EYE], [11, 23, ['##########', '#wwwwwwww#', '##########']]]
      : [[7, 14, ['#....#', '.####.']], [22, 14, ['#....#', '.####.']], [14, 24, ['######']]]);
  });

  // Penguin: waddles, then belly-slides
  E.penguin = [0, 1].map(function (f) {
    return build(24, 30, [
      P('m', or(ell(9 + (f ? -1 : 0), 28.4, 3, 1.5), ell(16 + (f ? 1 : 0), 28.4, 3, 1.5))),
      O(12, 16, 9.5, 12.6, 'fghij'),
      O(13.5, 18.5, 6.4, 9.6, '21WwR'),
      P('g', ell(19.5, 18, 2.6, 6.5), orb(19.5, 18, 2.6, 6.5, 'fghij')),
      P('m', ell(3.8, 12.8, 3, 1.6), orb(3.8, 12.8, 3, 1.6, 'lmnno'))
    ], [[5, 7, EYE], [6, 15, ['3']]]);
  });
  E.penguin.push(build(32, 18, [
    O(16, 9.5, 14, 7, 'fghij'), O(17, 11.5, 11, 4.5, '21WwR'), P('m', ell(1.8, 8.5, 2.6, 1.4)), P('m', or(ell(29.5, 12, 2.4, 1.4), ell(28, 15, 2.4, 1.4)))
  ], [[4, 5, EYE_S]]));

  // Snowman: throws snowballs, wears a scarf
  E.snowman = [false, true].map(function (thr) {
    return build(30, 44, [
      P('U', cap(5, 22, 0.5, thr ? 12 : 26, 0.8)), P('U', cap(25, 22, 29.5, 18, 0.8)),
      O(15, 32, 10.6, 10, '21WwR'),
      O(15, 15.5, 8, 7.6, '21WwR'),
      P('x', or(rrect(7.5, 21, 22.5, 24, 1.2), rrect(16, 22, 19.5, 30, 1)), function (x, y) { return y > 25 && x > 16 ? 'v' : 'x'; }, 'v'),
      P('G', or(rrect(9, 1, 21, 7.5, 1), rrect(5.5, 7, 24.5, 9, 1)), function (x, y) { return y > 5 && y < 7 ? 'v' : 'G'; }),
      P('m', tri(1.5, 16, 10, 14.4, 10, 17))
    ], [[9, 12, ['GG', 'GG']], [15, 12, ['GG', 'GG']], [9, 19, ['G...G', '.GGG.']], [14, 30, ['G']], [14, 35, ['G']]]);
  });
  E.snowball = build(12, 12, [O(6, 6, 5.6, 5.6, '21WwR')]);

  // Clockwork robot: a single big friendly-cross eye
  E.robot = [0, 1].map(function (f) {
    return build(30, 32, [
      P('O', or(rrect(7 + (f ? -1 : 1), 26, 13 + (f ? -1 : 1), 31.5, 1.5), rrect(17 + (f ? 1 : -1), 26, 23 + (f ? 1 : -1), 31.5, 1.5)), orb(15, 28, 10, 4, 'NOPQR')),
      P('P', rrect(4, 7, 26, 27, 5), orb(12, 13, 22, 20, 'NOPQR')),
      P('G', rrect(8, 11, 22, 19, 3), function (x, y) { return ell(12, 15, 3.2, 3)(x + 0.5, y + 0.5) ? (ell(11.2, 14.2, 1.1, 1.1)(x + 0.5, y + 0.5) ? 'L' : 'M') : 'G'; }),
      P('P', cap(15, 7, 15, 2.5, 0.7)), P('x', ell(15, 1.8, 1.6, 1.6), orb(15, 1.8, 1.6, 1.6, 'uvxyz'))
    ], [[8, 21, ['C.C.C.C.C.C.C']], [9, 9, ['##....']]]);
  });

  /* A grumpy sunflower: rises out of its column, puffs up its petals and
     shouts — prickly, so don't touch. (Our own idea; no snapping plant.)
     Two frames: petals out and mouth open, then petals in and a pout. */
  var petal = function (cx, cy, a, d, rx, ry) {
    var ca = Math.cos(a), sa = Math.sin(a), px = cx + ca * d, py = cy + sa * d;
    return function (x, y) { var dx = x - px, dy = y - py, u = dx * ca + dy * sa, v = -dx * sa + dy * ca; return (u * u) / (rx * rx) + (v * v) / (ry * ry) <= 1; };
  };
  E.plant = [true, false].map(function (open) {
    var cx = 14, cy = 11, d = open ? 8.2 : 7.2, ps = [];
    for (var i = 0; i < 11; i++) ps.push(petal(cx, cy, i / 11 * Math.PI * 2 + (open ? 0 : 0.15), d, open ? 3.8 : 3.2, 2.2));
    return build(28, 36, [
      P('I', cap(14, 20, 14, 36, 2), orb(13, 28, 3, 10, 'HHIJJ'), 'H'),
      P('I', or(ell(8, 29, 5.5, 2.2), ell(20.5, 26, 5.5, 2.2)), orb(14, 27, 10, 4, 'HHIJJ'), 'H'),
      P('C', or.apply(null, ps), orb(cx, cy, 11, 11, 'ABCDF'), 'A'),
      O(cx, cy, 6, 6, 'STUVX', 'S')
    ], open
      ? [[10, 8, ['##.']], [15, 8, ['.##']], [10, 9, EYE_S], [15, 9, EYE_S], [12, 13, ['.##.', '#xx#', '.##.']]]
      : [[10, 9, ['##.']], [15, 9, ['.##']], [10, 10, EYE_S], [15, 10, EYE_S], [12, 14, ['####']]]);
  });

  /* Bear: the family's grey cat, with yellow eyes. He hides somewhere in
     every level; find him and he follows Bonnie home. Sitting (two tail
     swishes), blinking, happy (eyes shut in a smile) and two walking
     frames. Soft blue-grey fur, a paler chest and paws, pink nose and
     ears, and the yellow eyes are the brightest thing about him. */
  // yellow almond eyes with a slit pupil; no dark rim, so they glow out of the grey
  var CAT_EYE = ['.D.', 'DEC', 'CEC', '.C.'];
  var CAT_SHUT = ['...', '!.!', '.!.'];
  var CAT_HAPPY = ['.!.', '!.!'];
  var FUR = '!$%&*', PAW = '$%&**';
  var catEars = function (hx, hy) {
    return [P('$', or(tri(hx - 5.5, hy - 1, hx - 4.5, hy - 7.5, hx - 1, hy - 3.5), tri(hx + 1, hy - 3.5, hx + 4.5, hy - 7.5, hx + 5.5, hy - 1)), orb(hx, hy - 4, 6, 4, FUR), '!'),
      P('3', or(tri(hx - 4.5, hy - 2, hx - 4, hy - 5.8, hx - 2, hy - 3.5), tri(hx + 2, hy - 3.5, hx + 4, hy - 5.8, hx + 4.5, hy - 2)))];
  };
  var catHead = function (hx, hy) {
    return catEars(hx, hy).concat([
      O(hx, hy, 6.2, 5.4, FUR, '!'),
      P('&', ell(hx - 0.5, hy + 2.8, 3.4, 2))
    ]);
  };
  var catFace = function (hx, hy, eyes) {
    var e = eyes === 'shut' ? CAT_SHUT : eyes === 'happy' ? CAT_HAPPY : CAT_EYE;
    var ey = Math.round(hy - 2.5) + (eyes === 'shut' || eyes === 'happy' ? 1 : 0);
    return [[Math.round(hx - 4.5), ey, e], [Math.round(hx + 1), ey, e], [Math.round(hx - 1), Math.round(hy + 1.5), ['33']], [Math.round(hx - 2), Math.round(hy + 2.5), ['!..!', '.!!.']]];
  };
  var catSit = function (tail, eyes) {
    var tp = tail ? [[18, 20], [21.5, 17], [23, 11], [21, 6.5]] : [[18, 20], [22, 18], [23.5, 13], [23.5, 8]];
    var parts = [
      P('$', limb(tp, 1.4), orb(21, 13, 4, 8, FUR), '!'),
      O(14, 15.5, 7.4, 6.6, FUR, '!'),
      P('&', ell(10.5, 16, 3.2, 4.4)),
      P('%', or(rrect(7.6, 15, 10.4, 22, 1.2), rrect(11, 15.5, 13.8, 22, 1.2)), orb(10, 16, 4, 6, PAW), '!'),
      P('*', or(ell(9, 21, 1.6, 1), ell(12.4, 21, 1.6, 1)))
    ].concat(catHead(8.5, 8.5));
    return build(25, 23, parts, catFace(8.5, 8.5, eyes));
  };
  var catWalk = function (f) {
    var k = f ? 1.3 : -1.3;
    var legs = [[6, -k], [9.5, k], [16, k], [19.5, -k]].map(function (l, i) { return P(i % 2 ? '$' : '%', cap(l[0], 15, l[0] + l[1], 21.4, 1.2), null, '!'); });
    var parts = [P('$', limb([[20, 13], [23, 10], [23.5, 5], [22, 2.5]], 1.4), orb(22, 8, 3, 7, FUR), '!')]
      .concat(legs)
      .concat([O(13, 13.5, 9, 5.2, FUR, '!'), P('&', ell(9, 15.5, 4, 2))])
      .concat(catHead(6.5, 8.5));
    return build(25, 23, parts, catFace(6.5, 8.5, 'open'));
  };
  E.bear = {
    sit: [catSit(0, 'open'), catSit(1, 'open')],
    blink: catSit(0, 'shut'),
    happy: catSit(1, 'happy'),
    walk: [catWalk(0), catWalk(1)]
  };

  // Bear's face, small: for the HUD, the map and the clear screen; and his
  // shadow, for a level where he's still hiding
  A.bearHead = BB.spr([
    '.#.....#.',
    '#%#...#%#',
    '#%%###%%#',
    '#%%%%%%%#',
    '#%C%%%C%#',
    '#%%%3%%%#',
    '.#######.'
  ], { '%': '#a9a7be', C: '#ffd23c', 3: '#ff9aa8' });
  A.bearDim = BB.variant('beardim', { '%': '#6a6884', C: '#6a6884', 3: '#6a6884' });

  // Fire: a lava bubble with a face, fire bar balls, the dragon's breath
  E.bubble = [0, 1].map(function (f) {
    return build(20, 22, [P('5', ell(10, 11, 9, 10 + f * 0.6), orb(10, 10, 9, 10, '45678'))], [[5, 9, EYE_S], [11, 9, EYE_S], [8, 15, ['.##.']]]);
  });
  E.fireball = [0, 1].map(function (f) { return build(16, 16, [P('5', ell(8, 8, 7.5, 7.5), orb(8 + f, 8 - f, 7.5, 7.5, '45678'))]); });

  // Grumble the dragon: round, green, a crown he hasn't earned
  var dragon = function (mode, step) {
    var parts = [
      P('{', or(cap(46, 46, 58, 52, 4), tri(56, 47, 63, 50, 57, 55)), orb(52, 48, 10, 6, '[]{}~')),
      P(']', or(ell(36 + (step ? 3 : 0), 54, 6, 4), ell(22 - (step ? 3 : 0), 54, 6, 4)), orb(28, 52, 18, 6, '[]{}~')),
      O(32, 36, 19, 17, '[]{}~'),
      P('C', ell(29, 40, 10.5, 12), function (x, y) { return Math.floor(y) % 5 === 0 ? 'B' : orb(29, 40, 10.5, 12, 'ABCDF')(x, y); }),
      P('{', or(ell(46, 22, 7, 9), ell(51, 16, 5, 6)), function (x, y) { return Math.floor(x + y) % 6 === 0 ? ']' : orb(46, 20, 8, 10, '[]{}~')(x, y); }, '['),
      O(15, 18, 13, 11.5, '[]{}~'),
      P('{', mode === 'open' ? function (x, y) { return rrect(0.5, 18, 16, 28, 4)(x, y) && !(y > 21.5 && y < 26 && x < 12); } : rrect(0.5, 18, 16, 28, 4), orb(8, 22, 12, 8, '[]{}~')),
      P('C', or(tri(9, 7.5, 10.5, 1, 13, 7.5), tri(13, 7.5, 15.5, 0.5, 18, 7.5), tri(17, 7.5, 20.5, 1, 22, 7.5), rrect(9, 6, 22, 9, 0.5)), orb(15, 4, 8, 6, 'ABCDF'))
    ];
    var st = mode === 'hurt' ? [[9, 13, ['#.#', '.#.', '#.#']], [17, 13, ['#.#', '.#.', '#.#']]] : [[8, 12, EYE], [16, 12, EYE], [7, 10, ['###.']], [16, 10, ['.###']]];
    st.push([3, 21, ['#.#']]);
    if (mode === 'open') st.push([1, 22, ['5555555555.', '67777776.', '5555555555.']]);
    else st.push([4, 26, ['#w#w#w#w#']]);
    return build(64, 58, parts, st);
  };
  E.dragon = { walk: [dragon('walk', 0), dragon('walk', 1)], open: dragon('open'), hurt: dragon('hurt') };

  /* ==========================================================================
     SCENERY — the props that stand along each level, redrawn in the same
     hand: foliage as clusters of lit leaf-balls, wood with grain, glowing
     things that glow.
     ========================================================================== */
  var D = A.deco;
  PAL['('] = '#1e6a34'; PAL[')'] = '#2f8f3e'; PAL['<'] = '#4cb24a'; PAL['>'] = '#86dc62'; PAL['^'] = '#d2f8a8';
  var LEAF = '()<>^';
  // a clump of leaves: overlapping balls, each lit from the top left
  var clump = function (balls, tones) {
    return balls.map(function (b) { return O(b[0], b[1], b[2], b[2] * 0.92, tones || LEAF, '('); });
  };
  var flowers = function (n, w, h, seed) {
    var out = [], r = BB.rng(seed);
    for (var i = 0; i < n; i++) out.push([Math.floor(2 + r() * (w - 4)), Math.floor(2 + r() * (h * 0.6)), [['3'], ['F'], ['w']][i % 3]]);
    return out;
  };
  D.bush = build(48, 20, clump([[9, 13, 7], [18, 9, 9], [29, 9, 9.5], [39, 13, 7.5], [24, 14, 8]]), flowers(6, 48, 18, 4));
  D.bushS = build(28, 16, clump([[8, 10, 6], [16, 7, 7.5], [22, 11, 5.5]]), flowers(3, 28, 14, 5));
  D.tree = build(44, 62, [
    P('U', or(rrect(18, 30, 26, 62, 2), tri(14, 62, 22, 52, 22, 62), tri(30, 62, 22, 52, 22, 62)), function (x, y) { return Math.floor(x) % 3 === 0 && y > 34 ? 'T' : orb(20, 46, 8, 20, 'STUVX')(x, y); }, 'S')
  ].concat(clump([[12, 30, 10], [32, 30, 10], [22, 20, 13], [10, 18, 8], [34, 18, 8], [22, 34, 9]])), [[14, 22, ['x']], [28, 14, ['x']], [33, 26, ['x']], [18, 30, ['x']]]);
  D.palm = build(54, 70, (function () {
    var pts = [];
    for (var k = 0; k <= 12; k++) { var t = k / 12; pts.push([27 + Math.sin(t * 2.4) * 6 - t * 2, 70 - t * 52]); }
    var parts = [P('V', limb(pts, 2.8), function (x, y) { return Math.floor(y) % 4 === 0 ? 'U' : orb(28, 44, 6, 30, 'TUVXY')(x, y); }, 'T')];
    [[-1, -0.2], [-0.8, 0.5], [1, -0.3], [0.85, 0.45], [0.1, -1], [-0.45, -0.8], [0.5, -0.85]].forEach(function (d) {
      var tip = [27 + d[0] * 26, 18 + d[1] * 14 + Math.abs(d[0]) * 8], mid = [27 + d[0] * 14, 14 + d[1] * 10];
      var fr = [[27, 18], mid, tip], segs = [];
      for (var i = 0; i < fr.length - 1; i++) segs.push(cap(fr[i][0], fr[i][1], fr[i + 1][0], fr[i + 1][1], i ? 1.6 : 2.6));
      parts.push(P('<', function (x, y) { return segs.some(function (f) { return f(x, y); }); }, function (x, y) { return y < mid[1] ? '>' : '<'; }, '('));
    });
    parts.push(O(25, 20, 2.6, 2.6, 'STUVX'), O(30, 21, 2.6, 2.6, 'STUVX'));
    return parts;
  })());
  D.pine = build(38, 62, (function () {
    var parts = [P('U', rrect(16, 50, 22, 62, 1), orb(19, 56, 3, 6, 'STUVX'), 'S')];
    [[0, 22, 16], [16, 30, 13], [30, 38, 10]].forEach(function (t, i) {
      var top = t[0] + 2, base = t[0] + 26 - i * 4, half = t[2] + 4;
      parts.push(P('<', tri(19, top, 19 - half, base, 19 + half, base), function (x, y) {
        if (y < top + 4 || (y < base - 1 && Math.abs(y - (base - 2) - Math.sin(x * 1.1) * 1.2) < 1.3)) return 'w';
        return x < 19 ? (y < base - 5 ? '>' : '<') : ')';
      }, '('));
    });
    return parts;
  })(), [[17, 1, ['.F.', 'FFF', '.F.']]]);
  D.mushroom = build(20, 20, [
    P('Y', rrect(7, 9, 13, 20, 2), orb(10, 13, 4, 8, 'ZZYYw'), 'Z'),
    P('x', function (x, y) { return ell(10, 10, 9.5, 8)(x, y) && y < 11; }, function (x, y) {
      if (ell(6, 5, 1.8, 1.6)(x + 0.5, y + 0.5) || ell(12.5, 4, 1.6, 1.4)(x + 0.5, y + 0.5) || ell(15.5, 8, 1.3, 1.2)(x + 0.5, y + 0.5)) return 'w';
      return orb(10, 8, 9.5, 8, 'uvxyz')(x, y);
    }, 'u')
  ], [[7, 14, ['E.E']], [8, 16, ['3']]]);
  D.pumpkin = build(26, 22, [
    P('H', cap(13, 6, 15, 1, 1.2)),
    P('m', ell(13, 13, 12, 8.5), function (x, y) { var k = Math.abs(((x + 0.5 - 13) / 12 * 2.5) % 1); return k < 0.12 ? 'l' : orb(13, 12, 12, 8.5, 'klmno')(x, y); }, 'k')
  ], [[7, 10, ['7.', '77']], [16, 10, ['.7', '77']], [8, 15, ['7.7.7.7.7.7', '.7777777777']]]);
  D.crystal = [0, 1].map(function (f) {
    var c1 = f ? 'pqrst' : 'MLLLw', parts = [];
    [[10, 3, 4.2, 28], [4.5, 12, 3.2, 28], [16, 10, 3.4, 28]].forEach(function (q) {
      parts.push(P(c1[2], or(tri(q[0], q[1], q[0] - q[2], q[1] + 5, q[0] + q[2], q[1] + 5), rrect(q[0] - q[2], q[1] + 5, q[0] + q[2], q[3], 0.5)),
        function (x, y) { return x < q[0] - 0.5 ? c1[3] : x < q[0] + 1 ? c1[4] : c1[1]; }, f ? 'p' : 'M'));
    });
    return build(21, 28, parts);
  });
  D.lamp = build(16, 32, [
    P('G', or(rrect(6.5, 12, 9.5, 31, 1), rrect(3, 29, 13, 32, 1))),
    P('G', rrect(2.5, 1, 13.5, 4, 1.5)),
    P('7', rrect(3.5, 3.5, 12.5, 12, 2), orb(7, 6, 6, 7, '67788'), 'G')
  ], [[7, 4, ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G']]]);
  D.torch = [0, 1].map(function (f) {
    return build(12, 24, [
      P('U', or(rrect(4.5, 10, 7.5, 24, 1), rrect(2, 9, 10, 11.5, 1)), orb(6, 14, 4, 10, 'STUVX'), 'S'),
      P('5', function (x, y) { return ell(6, 6.5, 3.6, 3.8)(x, y) || tri(6 + (f ? 1.5 : -1.5), 0, 3, 6, 9, 6)(x, y); }, orb(6 + (f ? 0.5 : -0.5), 6, 4, 5, '45678'))
    ]);
  });
  D.fence = build(16, 22, [
    P('V', or(rrect(1, 2, 5, 22, 1), rrect(11, 2, 15, 22, 1)), orb(4, 8, 6, 14, 'TUVXY'), 'S'),
    P('V', or(rrect(0, 6, 16, 9, 0.5), rrect(0, 14, 16, 17, 0.5)), function (x, y) { return y < 7.2 || (y > 14 && y < 15.2) ? 'X' : 'V'; }, 'T')
  ]);
  D.deadtree = build(36, 66, (function () {
    var trunk = [[18, 66], [17, 50], [20, 38], [18, 26]];
    var parts = [P('c', limb(trunk, 3.4), function (x, y) { return Math.floor(y * 0.5 + x * 0.3) % 4 === 0 ? 'b' : orb(16, 40, 6, 26, 'abcde')(x, y); }, 'a')];
    [[[18, 30], [9, 22], [5, 26]], [[19, 36], [29, 30], [32, 34]], [[18, 26], [22, 14], [27, 12]], [[18, 27], [13, 15], [9, 13]]].forEach(function (br) { parts.push(P('c', limb(br, 1.5), null, 'a')); });
    parts.push(O(18, 12, 9, 8, 'abcde'), O(8, 18, 6, 5, 'abcde'), O(29, 22, 6, 5, 'abcde'));
    return parts;
  })(), [[5, 26, ['7', '7']], [31, 34, ['7', '7']]]);
  D.castle = build(32, 24, [
    P('V', or(rrect(4, 9, 28, 24, 1), rrect(2, 4, 9, 24, 1), rrect(23, 4, 30, 24, 1), rrect(12, 1, 20, 12, 1)), function (x, y) { return (y < 5 && Math.floor(x) % 3 === 0) ? 'U' : orb(14, 10, 20, 18, 'TUVXY')(x, y); }, 'U'),
    P('S', ell(16, 19, 3, 5)), P('x', tri(16, 0, 16, -0.1, 16, 0))
  ], [[16, 0, ['xx', 'x.']]]);
  D.umbrella = build(40, 46, [
    P('W', rrect(19, 12, 21, 46, 0.5)),
    P('x', function (x, y) { return ell(20, 15, 19, 13)(x, y) && y < 15; }, function (x, y) { var band = Math.floor((x + 0.5) / 6) % 2; return band ? orb(20, 8, 19, 13, 'WW1ww')(x, y) : orb(20, 8, 19, 13, 'uvxyz')(x, y); }, 'u')
  ]);
  D.snowman = E.snowman[0];
  D.balloon = build(14, 24, [P('G', cap(7, 14, 7, 24, 0.4)), O(7, 7, 6.2, 7, 'uvxyz', 'u')], [[3, 3, ['z']]]);
  D.seaweed = [0, 1].map(function (f) {
    return build(14, 26, [0, 1].map(function (j) {
      var pts = [];
      for (var k = 0; k <= 8; k++) pts.push([4 + j * 6 + Math.sin(k * 0.9 + f * 1.5 + j) * 1.6, 26 - k * 3]);
      return P('<', limb(pts, 1.2), function (x, y) { return y < 10 ? '>' : '<'; }, '(');
    }));
  });
  D.coral = build(30, 26, (function () {
    var parts = [];
    [[[15, 26], [15, 14], [12, 6]], [[15, 18], [8, 12], [5, 4]], [[15, 16], [22, 9], [25, 3]], [[15, 20], [24, 17], [27, 12]]].forEach(function (b) {
      parts.push(P('r', limb(b, 1.9), orb(15, 14, 14, 13, 'pqrst'), 'p'));
      parts.push(O(b[2][0], b[2][1], 2.4, 2.4, 'pqrst', 'p'));
    });
    return parts;
  })());

  /* ==========================================================================
     MAGPIE ISLES — the second land, levels 11–20. Captain Magpie has
     pinched Monsty's birthday presents and flown off with them; his crew,
     the islands' locals and their scenery, in the same hand as the rest.
     ========================================================================== */
  // four more ramps, deep to shine: a magpie's blue-green gloss (the glowing
  // mushrooms share it), the Captain's coat, a raspberry jelly (its deep
  // borrowed from the reds, its shine kept back for stamped glints) and a
  // moon-rock lilac
  PAL['@'] = '#0c3c58'; PAL['+'] = '#14708c'; PAL['='] = '#20a8c0'; PAL['-'] = '#5ce0e0'; PAL[':'] = '#d4fff8';
  PAL[';'] = '#1a2262'; PAL['_'] = '#2a3c9a'; PAL['|'] = '#3c5cd4'; PAL['?'] = '#6e8ef2'; PAL['/'] = '#bccfff';
  PAL['0'] = '#c0204c'; PAL['9'] = '#ee4068'; PAL['K'] = '#ff88a4';
  PAL['`'] = '#b4a6e6';
  var TEAL = '@+=-:', COAT = ';_|?/', RASP = 'u099K', MOON = 'ij`ew';
  var INK = 'fghij', SNOW = '21WwR', RED = 'uvxyz', GOLD = 'ABCDF', WOOD = 'STUVX', IRON = 'NOPQR', CACT = '[]{}~', PINK = 'pqrst';
  var both = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var but = function (a, b) { return function (x, y) { return a(x, y) && !b(x, y); }; };
  // a tone k steps lighter (or darker, k < 0) along its ramp
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
  // a shape (or a texture) turned by a about a pivot
  var turned = function (f, px, py, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return function (x, y) { var dx = x - px, dy = y - py; return f(px + dx * c + dy * s, py - dx * s + dy * c); };
  };
  var bloom = function (cx, cy, n, d, rx, ry, a0) {
    var ps = [];
    for (var i = 0; i < n; i++) ps.push(petal(cx, cy, a0 + i / n * Math.PI * 2, d, rx, ry));
    return or.apply(null, ps);
  };
  var EYE_L = ['.###.', '#www#', '#Eww#', '#EEw#', '#EEE#', '.###.'];

  /* A magpie's wing, from the shoulder (sx, sy) out along angle a, `len`
     long and `wid` wide: a smooth leading edge and a trailing edge scalloped
     into feather tips. Glossy blue-black along the front and by the
     shoulder, the white flash in the middle, black at the tips and along
     the scallops. `back` (+1 or -1) says which side the trailing edge is
     on; `far` dims it, for the wing on the far side. */
  var magWing = function (sx, sy, a, len, wid, back, far) {
    var ca = Math.cos(a), sa = Math.sin(a);
    var uv = function (x, y) { var dx = x - sx, dy = y - sy; return [(dx * ca + dy * sa) / len, (-dx * sa + dy * ca) * back / wid]; };
    var half = function (u) { return Math.sqrt(Math.max(0, 1 - (2 * u - 1) * (2 * u - 1))); };
    var R = { flash: far ? '1122W' : SNOW, tip: far ? 'ffggh' : INK, sheen: far ? 'ff@@+' : 'fg@+=' };
    var cx = sx + ca * len * 0.45 - len * 0.15, cy = sy + sa * len * 0.45 - len * 0.15;
    var lit = function (t) { return orb(cx, cy, len * 0.75, len * 0.75, t); };
    var tone = { flash: lit(R.flash), tip: lit(R.tip), sheen: lit(R.sheen) };
    return [P('W', function (x, y) {
      var q = uv(x, y), u = q[0], v = q[1];
      if (u < 0 || u > 1) return false;
      return v > -half(u) * 0.8 && v < half(u) + 0.4 * u * Math.abs(Math.sin(u * Math.PI * 3.5));
    }, function (x, y) {
      var q = uv(x + 0.5, y + 0.5), u = q[0], v = q[1], h = half(u);
      var band = v < -h * 0.4 || u < 0.36 ? 'sheen' : u > 0.84 || v > h * 0.8 ? 'tip' : 'flash', t = tone[band](x, y);
      // the long feathers' edges, a tone down
      return band === 'flash' && v > -h * 0.2 && Math.abs(((u * 3.5 + 0.25) % 1) - 0.5) < 0.09 ? step(R.flash, t, -1) : t;
    }, 'f')];
  };

  // Magpie: one of the Captain's crew, a cheeky black-and-white flier in a
  // spotty red bandana; the long tail and the wings have that blue-green gloss
  var BANDANA_DOTS = [[5, 4], [9, 4], [7, 6], [11, 6]];
  E.magpie = [0, 1].map(function (f) {
    var b = f ? 0 : 1;
    var wing = f ? magWing(15.5, 12, 1.15, 10.5, 3.6, -1) : magWing(16, 11 + b, -1.05, 11.5, 3.8, 1);
    return build(28, 22, [
      P('+', or(cap(18.5, 12.5 + b, 25.2, 9.4 + b, 1.8), ell(25.2, 9.4 + b, 2.6, 2.1)), orb(22, 10 + b, 6.5, 3, '@@+=-'), '@'),
      O(14.4, 12.4 + b, 6.8, 5.6, INK),
      P('W', both(ell(14.4, 12.4 + b, 6.8, 5.6), ell(12.8, 16 + b, 6, 3.8)), orb(12.5, 12 + b, 7.2, 5.4, SNOW))
    ].concat(wing).concat([
      O(7.5, 9 + b, 5.8, 5.5, INK, 'f'),
      P('O', tri(0.3, 10.6 + b, 3.8, 8.8 + b, 3.8, 12.2 + b), orb(2, 10 + b, 3.2, 2.4, IRON), 'N'),
      P('x', or(petal(12.4, 6 + b, 0.05, 2, 2.4, 1.5), petal(12.4, 6.8 + b, 0.85, 1.8, 2.2, 1.4)), orb(13.4, 5.6 + b, 3.4, 2.6, RED), 'u'),
      P('x', both(ell(7.5, 9 + b, 6.2, 5.9), function (x, y) { return y < 7 + b + (x - 7.5) * 0.25; }),
        function (x, y) { return BANDANA_DOTS.some(function (d) { return d[0] === x && d[1] + b === y; }) ? 'z' : orb(8, 4 + b, 7, 4, RED)(x, y); }, 'u')
    ]), [[3, 7 + b, EYE]]);
  });

  // Scorpion: a sandy little desert scorpion, pincers up, tail curled over
  // and ending in a soft round bobble (no sting)
  E.scorpion = [0, 1].map(function (f) {
    var k = f ? 1.3 : -1.3, sw = f ? 0.6 : 0, op = f ? 0.6 : 0;
    var legs = [10, 13.5, 17, 20.5].map(function (x, i) { return P('l', cap(x, 15, x + (i % 2 ? k : -k), 19.3, 0.9)); });
    var tail = [[20, 11.2, 2.9], [22.8 + sw * 0.5, 8.2, 2.6], [23.8 + sw, 5.2, 2.35], [22.8 + sw, 2.7, 2.1]].map(function (s) { return O(s[0], s[1], s[2], s[2], 'klmno', 'k'); });
    // a pincer: a round mitten with a nick cut in its front
    var claw = function (x, y) { return but(ell(x, y, 2.9, 2.4), tri(x - 3.6, y - 1 - op, x - 0.2, y + 0.2, x - 3.6, y + 1.2 + op)); };
    return build(26, 20, legs.concat(tail).concat([
      O(19.8 + sw, 2.7, 2.5, 2.4, 'lmnoo', 'k'),
      P('m', cap(6.5, 10.5, 4, 7.6, 1.2), null, 'k'), P('m', claw(3.2, 6.6), orb(3, 6, 3.4, 3, 'klmno'), 'k'),
      P('m', ell(15, 12.6, 7.6, 4.6), function (x, y) { return (x === 13 || x === 16 || x === 19) && y > 8 ? 'l' : orb(14, 11, 8, 5, 'klmno')(x, y); }, 'k'),
      O(7.5, 12, 5.4, 5, 'klmno', 'k'),
      P('m', cap(7, 15.4, 4, 15.4, 1.2), null, 'k'), P('m', claw(3, 15), orb(3, 14, 3.4, 3, 'klmno'), 'k')
    ]), [[2, 9, EYE], [6, 9, EYE], [5, 14, ['.#.', '#.#']]]);
  });

  // Tumbleweed: a ball of twigs bowling along (the twigs turn, the face
  // doesn't), two eyes peeking out of the dark inside it
  var PEEK = ['.ww.', 'wEww', 'wEEw', '.ww.'];
  E.tumble = [0, 1].map(function (f) {
    var th = f * Math.PI / 5, cx = 10, cy = 10.8, lit = orb(cx, cy, 9, 9, 'TUVXY'), arcs = [], holes = [];
    var hollow = ell(10.2, 10.6, 5.4, 3.2);
    for (var k = 0; k < 5; k++) { var a = k * Math.PI * 2 / 5 - th; arcs.push([cx + Math.cos(a) * 4.4, cy + Math.sin(a) * 4.4, 5.2 + (k % 2)]); }
    // gaps between the twigs, round the top and bottom (never over the eyes)
    [-2, -1, 1, 2].forEach(function (b) { var a = b - th; holes.push(ell(cx + Math.cos(a) * 6.6, cy + Math.sin(a) * 6.6, 1.1, 1.1)); });
    return build(20, 20, [
      P('V', function (x, y) {
        var dx = x - cx, dy = y - cy, a = Math.atan2(dy, dx) + th, r = Math.sqrt(dx * dx + dy * dy);
        if (r > 8.1 + Math.sin(a * 5) * 0.5 + Math.pow(Math.max(0, Math.sin(a * 9)), 10) * 1.2) return false;
        return !holes.some(function (h) { return h(x, y); });
      }, function (x, y) {
        if (hollow(x + 0.5, y + 0.5)) return y < 10 ? 'T' : 'S';
        var t = lit(x, y), hit = 0;
        arcs.forEach(function (c) {
          var ex = x + 0.5 - c[0], ey = y + 0.5 - c[1], d = Math.sqrt(ex * ex + ey * ey) - c[2];
          if (Math.abs(d) < 0.5) hit = 2; else if (!hit && d > 0.5 && d < 1.3) hit = 1;
        });
        // each twig is a dark stroke with a lit edge beside it
        return hit === 2 ? (t === 'T' || t === 'U' ? 'S' : 'T') : hit === 1 ? step('TUVXY', t, 1) : t;
      }, 'T')
    ], [[5, 9, PEEK], [11, 9, PEEK]]);
  });

  // Gummy bear: a raspberry jelly sweet, see-through and wobbly, waddling
  var gummyLit = function (cx, cy, rx, ry) {
    var o = orb(cx, cy, rx, ry, RASP);
    return function (x, y) {
      var dx = (x + 0.5 - cx) / rx - 0.28, dy = (y + 0.5 - cy) / ry - 0.34, d = dx * dx + dy * dy, t = o(x, y);
      // light shining through gathers low on the far side, as it does in jelly
      if (d < 0.12) return t === 'u' || t === '0' ? '9' : 'K';
      if (d < 0.3 && t === 'u') return '0';
      return t;
    };
  };
  E.gummy = [0, 1].map(function (f) {
    var s = f, l = f ? 0 : 1, r = f ? 1 : 0;
    return build(22, 22, [
      P('9', or(ell(5.4 + s, 3.4, 2.5, 2.4), ell(15.6 + s, 3.4, 2.5, 2.4)), gummyLit(10.5 + s, 3.4, 7, 2.6), '0'),
      P('9', ell(11, 15.8, 6.2, 5.4), gummyLit(11, 15.8, 6.2, 5.4), '0'),
      P('9', ell(10.5 + s, 8, 6.8, 5.6), gummyLit(10.5 + s, 8, 6.8, 5.6), '0'),
      P('9', ell(4.8, 14.4 - l * 0.8, 2.2, 3), gummyLit(4.8, 14.4 - l, 2.2, 3), '0'),
      P('9', ell(17.2, 14.4 - r * 0.8, 2.2, 3), gummyLit(17.2, 14.4 - r, 2.2, 3), '0'),
      P('9', ell(7.4, 20.2 - l, 3, 1.8), gummyLit(7.4, 20 - l, 3, 2), '0'),
      P('9', ell(14.6, 20.2 - r, 3, 1.8), gummyLit(14.6, 20 - r, 3, 2), '0'),
      P('9', ell(9.4 + s, 10.9, 3, 2.1), gummyLit(9.4 + s, 10.6, 3, 2.1), '0')
    ], [[4 + s, 5, EYE], [10 + s, 5, EYE], [8 + s, 9, ['uu']], [8 + s, 11, ['u..u', '.uu.']], [6 + s, 3, ['zz', 'z.']], [7, 13, ['z', 'z']]]);
  });

  // Monkey: a cheeky little monkey who sits up in the trees and lobs
  // coconuts; [0] sitting ready, [1] his arm up to throw
  var MFUR = 'SSTUV', MFACE = 'ZZYYw';
  E.monkey = [0, 1].map(function (f) {
    var parts = [P('T', limb([[18.5, 22], [23, 21.6], [24.6, 18], [23.4, 14.8], [21.2, 15.4]], 1.2), orb(22, 18, 4, 5, MFUR), 'S')];
    if (f) parts.push(P('T', limb([[17, 15.5], [20.6, 11], [19.8, 5.4]], 1.6), orb(19, 10, 3, 6, MFUR), 'S'), O(19.6, 4, 2.2, 2.1, MFACE, 'Z'));
    parts = parts.concat([
      O(14.5, 18.5, 7, 6.6, MFUR, 'S'),
      P('Y', both(ell(14.5, 18.5, 7, 6.6), ell(12.5, 19.6, 4.2, 4.6)), orb(12, 18, 5, 6, MFACE)),
      O(10, 21.8, 3, 2.6, MFUR, 'S'), O(17, 22, 3, 2.6, MFUR, 'S'),
      O(8.6, 24.2, 3, 1.7, MFACE, 'Z'), O(16, 24.4, 3, 1.7, MFACE, 'Z'),
      P('T', limb([[10.5, 15.5], [7.6, 18], [7.4, 21]], 1.5), orb(8, 17, 3, 5, MFUR), 'S'), O(7.4, 21.4, 1.9, 1.7, MFACE, 'Z'),
      O(3.6, 10.2, 2.3, 2.6, MFUR, 'S'), O(16.8, 9.6, 2.4, 2.7, MFUR, 'S'), P('Z', or(ell(3.6, 10.4, 1.2, 1.5), ell(17, 9.8, 1.3, 1.6))),
      P('T', or(tri(8.6, 5.5, 10.4, 1.6, 12, 5.5), tri(11, 5.5, 13.8, 2.6, 13.6, 6)), orb(11, 4, 3, 3, MFUR), 'S'),
      O(10.5, 10.5, 6.8, 6.3, MFUR, 'S'),
      P('Y', or(ell(8, 9.6, 3.2, 3.2), ell(12.2, 9.6, 2.9, 3.1), ell(9.8, 13, 4.6, 3)), orb(9.6, 10.5, 6, 6, MFACE), 'Z')
    ]);
    // a cheeky grin while he waits; a hoot and a cocked brow as he throws
    return build(26, 26, parts, [[6, 7, EYE], [11, 7, EYE], [9, 12, ['S.S']]].concat(f ? [[7, 14, ['.###.', '#xxx#', '.###.']], [5, 6, ['.##.']]] : [[7, 14, ['#...#', '.###.']]]));
  });
  E.coconut = build(10, 10, [P('U', ell(5, 5, 4.9, 4.7), function (x, y) {
    var t = orb(5, 5, 4.9, 4.7, WOOD)(x, y);
    return (x * 2 + y * 3) % 5 === 0 ? step(WOOD, t, -1) : t;
  })], [[3, 2, ['G.G', '.G.']]]);

  /* Captain Magpie, the sky-pirate who pinched Monsty's presents: a big
     round magpie in a red captain's hat with a gold plume and a gold star,
     a blue coat with gold buttons over his white front, and bushy white
     brows set in a scowl. Flying (wings up, wings down), landed with his
     wings folded (the moment to bounce on him), and bumped: eyes squeezed
     shut, feathers ruffled, hat knocked askew. */
  var captain = function (mode) {
    var hurt = mode === 'hurt', landed = mode === 'land' || hurt;
    var hx = 19, hy = 12, tilt = hurt ? 0.26 : 0, lift = hurt ? -1 : 0;
    // the hat is drawn in its own frame, so a bump can knock it askew. A
    // bicorne side on: a dome with both brims turned up into points, gold
    // piping along the top edge
    var hat = function (f) { return turned(function (x, y) { return f(x, y - lift); }, hx, hy + lift, tilt); };
    var hatBot = function (x) { return 13 - 0.032 * (x - 19) * (x - 19); };
    var hatTop = function (x) { var u = (x - 19) / 15; return hatBot(x) - 10 * Math.pow(Math.max(0, 1 - u * u), 0.8) - 0.8; };
    var hatF = function (x, y) { return Math.abs(x - 19) < 15 && y < hatBot(x) && y > hatTop(x); };
    var plume = or(cap(23, 4.6, 28.5, 2, 2.5), cap(28.5, 2, 34, 2.6, 2.2), cap(34, 2.6, 38.4, 6, 1.8), ell(39, 7, 1.5, 1.8));
    var body = ell(31, 34, 16, 14.5), belly = ell(23, 36, 7.6, 10.5);
    var wings = {
      up: [magWing(38, 25, -0.7, 21, 6.4, 1, true), magWing(32, 27, -0.95, 26, 7.6, 1)],
      down: [magWing(38, 29, 0.85, 18, 6, -1, true), magWing(32, 30, 1.1, 22, 7.2, -1)],
      land: [[], magWing(27, 27, 0.66, 22, 6, -1)],
      hurt: [magWing(38, 25, -1, 20, 6.2, 1, true), magWing(31, 27, -1.3, 24, 7.4, 1)]
    }[mode];
    var parts = [
      P('+', cap(42, 38, 55, 31, 2.6), orb(48, 32, 9, 6, '@@+=-'), '@'),
      P('+', cap(42, 35, 54.5, 25.5, 2.4), orb(48, 28, 9, 6, '@@+=-'), '@')
    ].concat(wings[0]);
    if (hurt) parts.push(P('g', or(tri(44, 26, 51, 21, 47, 31), tri(17, 45, 12, 50, 21, 47.6), tri(46, 40, 52, 44, 45, 45)), orb(40, 30, 14, 14, INK), 'f'));
    parts.push(
      landed ? P('O', or(cap(26, 45, 25, 50.4, 1.2), cap(35, 45, 36, 50.4, 1.2), cap(25, 50.6, 20.6, 51, 1.1), cap(25.4, 50.6, 28.4, 51.2, 0.9), cap(36, 50.6, 31.6, 51, 1.1), cap(36.4, 50.6, 39.4, 51.2, 0.9)), orb(30, 48, 8, 4, IRON), 'N')
        : P('O', or(ell(25, 48.2, 2.6, 1.6), ell(33, 48.6, 2.6, 1.6)), orb(29, 47, 6, 3, IRON), 'N'),
      P('|', body, function (x, y) { return ell(23, 36, 8.8, 11.7)(x + 0.5, y + 0.5) ? orb(21, 30, 10, 12, GOLD)(x, y) : orb(26, 27, 18, 16, COAT)(x, y); }, ';'),
      P('W', both(body, belly), orb(21, 31, 9, 12, SNOW), '2'),
      P('g', both(body, function (x, y) { return y > 40.5 && y < 44.5; }), orb(30, 41, 16, 4, 'fgghi'), 'f'),
      P('C', rrect(19.5, 39.5, 25.5, 45.5, 1.2), function (x, y) { return rrect(21.4, 41.4, 23.6, 43.6, 0.4)(x + 0.5, y + 0.5) ? 'g' : orb(21, 41, 4, 4, GOLD)(x, y); }, 'A')
    );
    parts = parts.concat(wings[1]);
    if (hurt) parts.push(P('g', or(tri(9, 15, 3.5, 12, 8, 19), tri(10, 25, 4.5, 30, 12, 28.5)), orb(14, 20, 10, 10, INK), 'f'));
    parts.push(
      O(19, 21, 11.5, 10.8, INK, 'f'),
      P('O', or(tri(0.8, 26, 10, 21.4, 10.5, 29.6), ell(8.4, 25.4, 3.2, 3.8)), function (x, y) {
        return Math.abs(y + 0.5 - (26.2 + (x - 1) * 0.04)) < 0.5 && x < 9 ? 'N' : orb(5, 24, 7, 4.5, IRON)(x, y);
      }, 'N'),
      P('C', hat(plume), hat(function (x, y) { return Math.floor(x * 0.9 - y + 40) % 3 === 0 ? 'B' : orb(30, 1, 10, 6, GOLD)(x, y); }), 'A'),
      P('x', hat(hatF), hat(function (x, y) {
        var t = hatTop(x + 0.5);
        if (y + 0.5 < t + 1.6) return orb(17, 4, 16, 8, GOLD)(x, y);
        return y + 0.5 > hatBot(x + 0.5) - 1.6 ? 'v' : orb(15, 4, 14, 10, RED)(x, y);
      }), 'u')
    );
    // the star on his hat goes wherever the hat goes
    var c = Math.cos(tilt), s = Math.sin(tilt), sx = 12, sy = 4;
    var st = [[Math.round(hx + (sx - hx) * c - (sy - hy) * s), Math.round(hy + lift + (sx - hx) * s + (sy - hy) * c), ['...D...', '..DDC..', 'DDDDCCB', '.DDCCB.', '.DC.CB.', '.D...B.']]];
    st = st.concat(hurt
      ? [[10, 17, ['w....', '.ww..', '...ww', '.ww..', 'w....']], [17, 17, ['....w', '..ww.', 'ww...', '..ww.', '....w']], [9, 14, ['...WW', 'WWW..']], [17, 14, ['WW...', '..WWW']]]
      : [[10, 16, EYE_L], [17, 16, EYE_L], [9, 14, ['WWW..', '...WW']], [17, 14, ['..WWW', 'WW...']]]);
    st.push([31, 27, ['DC', 'CB']], [33, 32, ['DC', 'CB']], [33, 37, ['DC', 'CB']]);
    return build(56, 52, parts, st);
  };
  E.captain = { fly: [captain('up'), captain('down')], land: captain('land'), hurt: captain('hurt') };

  /* ---- the islands' scenery ---- */
  // Desert: a tall cactus with a pink flower on its head and a little round
  // one; ribbed, with pale prickles kept politely short
  var ribbed = function (cx, cy, rx, ry, every) {
    var o = orb(cx, cy, rx, ry, CACT);
    return function (x, y) {
      var c = o(x, y);
      if ((Math.floor(x + 0.5 - cx + 100) % every) === 0) return step(CACT, c, -1);
      return (x * 7 + y * 11) % 19 === 0 ? 'o' : c;
    };
  };
  D.cactus = build(22, 34, [
    P('{', limb([[7.5, 22], [3.3, 21.6], [3.3, 14]], 2.6), ribbed(3, 16, 4, 9, 3), '['),
    P('{', limb([[14.5, 18.5], [18.7, 18], [18.7, 11]], 2.6), ribbed(18, 13, 4, 9, 3), '['),
    P('{', or(cap(11, 9, 11, 30, 5.4), rrect(5.6, 24, 16.4, 34, 2)), ribbed(10, 16, 7, 18, 3), '['),
    P('r', bloom(11, 3.4, 5, 1.9, 2, 1.5, -Math.PI / 2), orb(10, 2.6, 3.4, 3.2, PINK), 'p')
  ], [[10, 3, ['DC', 'CB']]]);
  var barrelRibs = function (cx, cy, rx, ry) {
    var o = orb(cx, cy, rx, ry, CACT);
    return function (x, y) {
      var c = o(x, y), dy = (y + 0.5 - cy) / ry, w = Math.sqrt(Math.max(0.04, 1 - dy * dy)), u = (x + 0.5 - cx) / (rx * w);
      if (Math.abs(((u * 2.2 + 10.5) % 1) - 0.5) < 0.16) return step(CACT, c, -1);
      return (x * 5 + y * 7) % 17 === 0 ? 'o' : c;
    };
  };
  D.cactusS = build(16, 20, [
    P('{', or(ell(8, 12.2, 7.4, 7.6), rrect(1.4, 14, 14.6, 20, 2.5)), barrelRibs(8, 12.2, 7.4, 7.6), '['),
    P('r', bloom(8, 4.4, 5, 1.7, 1.8, 1.4, -Math.PI / 2), orb(7, 3.6, 3, 3, PINK), 'p')
  ], [[7, 4, ['DC', 'CB']]]);

  // Candy: a swirly lollipop on a paper stick with a bow, and a stripy cane
  D.lollipop = build(18, 40, [
    P('W', rrect(7.2, 15, 10.8, 40, 1.2), orb(8.4, 27, 2.4, 14, SNOW), '2'),
    P('r', ell(9, 8.6, 8.4, 8.2), function (x, y) {
      var dx = x + 0.5 - 9, dy = y + 0.5 - 8.6, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) / (Math.PI * 2);
      return orb(9, 8.6, 8.4, 8.2, ((2 * a + r / 4.4) % 1 + 1) % 1 < 0.5 ? 'ppqrs' : SNOW)(x, y);
    }, 'p'),
    P('x', or(tri(9, 18.4, 3.6, 15.2, 4.2, 21.6), tri(9, 18.4, 14.4, 15.2, 13.8, 21.6)), orb(7, 16, 6, 4, RED), 'u'),
    O(9, 18.4, 1.9, 1.8, RED, 'u')
  ]);
  D.candycane = build(14, 36, (function () {
    var pts = [[9.5, 35.6], [9.5, 8]];
    for (var k = 1; k <= 8; k++) { var a = -k / 8 * (Math.PI + 0.55); pts.push([6 + Math.cos(a) * 3.5, 8 + Math.sin(a) * 3.5]); }
    return [P('w', limb(pts, 2.3), function (x, y) {
      var hook = y < 8.5, band = hook ? Math.floor((Math.atan2(y + 0.5 - 8, x + 0.5 - 6) + 4) / 0.62) % 2 : Math.floor((y - x * 0.8 + 40) / 2.8) % 2;
      return (hook ? orb(6, 7, 6, 6, band ? RED : SNOW) : orb(9.5, 20, 2.6, 30, band ? RED : SNOW))(x, y);
    })];
  })());

  // Pirate bits: an anchor, a barrel, a life ring
  D.anchor = build(20, 22, [
    P('P', or(
      but(ell(10, 4.4, 3.4, 3.4), ell(10, 4.4, 1.3, 1.3)),
      rrect(8.4, 7, 11.6, 21.6, 1.2),
      rrect(3.6, 8.8, 16.4, 11.8, 1.4),
      function (x, y) { var dx = x - 10, dy = y - 13.6, d = Math.sqrt(dx * dx + dy * dy); return y > 13.6 && Math.abs(d - 7.2) < 1.7; },
      tri(0.2, 11, 5.8, 15.4, 0.6, 17.6), tri(19.8, 11, 14.2, 15.4, 19.4, 17.6)
    ), orb(7, 8, 13, 15, IRON), 'N')
  ]);
  D.barrel = build(18, 20, [
    P('U', function (x, y) { var dy = (y - 10.5) / 9.5; return y > 0.6 && y < 20 && Math.abs(x - 9) < 8.4 - dy * dy * 2; }, function (x, y) {
      var dy = (y + 0.5 - 10.5) / 9.5, hw = 8.4 - dy * dy * 2, u = (x + 0.5 - 9) / hw * 8.4;
      if ((y >= 4 && y <= 5) || (y >= 15 && y <= 16)) return orb(7, 6, 11, 14, IRON)(x, y);
      if (y < 2) return 'X';
      return Math.floor(u + 100) % 4 === 1 ? 'T' : orb(7, 7, 11, 13, WOOD)(x, y);
    }, 'S')
  ]);
  D.buoy = build(16, 16, (function () {
    var c = Math.cos(-0.3), s = Math.sin(-0.3);
    var loc = function (x, y) { var dx = x - 8, dy = y - 8.1; return [dx * c + dy * s, -dx * s + dy * c]; };
    var ring = function (x, y) { var p = loc(x, y), ox = p[0] / 6.6, oy = p[1] / 7.8, ix = p[0] / 2.4, iy = p[1] / 3.1; return ox * ox + oy * oy <= 1 && ix * ix + iy * iy > 1; };
    return [P('x', ring, function (x, y) {
      var p = loc(x + 0.5, y + 0.5), q = (Math.atan2(p[1], p[0]) + Math.PI / 4) / (Math.PI / 2) + 8, fr = q % 1;
      // rope bound round it where the colours meet
      if (fr < 0.1 || fr > 0.9) return Math.floor(x + y) % 2 ? 'V' : 'U';
      return orb(6.5, 6.5, 8, 8.6, Math.floor(q) % 2 ? SNOW : RED)(x, y);
    }, 'u')];
  })());

  // Jungle: a friendly old stone head, mossy on top, smiling in its sleep,
  // and a big fern
  var SAND = 'TUVXY';
  D.totem = build(22, 30, [
    P('V', or(rrect(0.4, 13, 4.2, 22, 1.6), rrect(17.8, 13, 21.6, 22, 1.6)), function (x, y) { return y === 17 ? 'T' : orb(6, 14, 16, 9, SAND)(x, y); }, 'T'),
    P('V', or(ell(11, 13, 9, 8), rrect(2.4, 12, 19.6, 30, 4), rrect(1.6, 24, 20.4, 30, 1.6)), function (x, y) {
      // carved bands: a ridge for the brow, a zigzag along the chin
      if (y === 10) return 'X';
      if (y === 11) return 'T';
      if (y >= 26 && y <= 28) { var z = (x + (y - 26) * 2) % 6; return z < 2 ? 'T' : z === 2 ? 'X' : orb(8, 12, 15, 18, SAND)(x, y); }
      return orb(8, 11, 15, 18, SAND)(x, y);
    }, 'T'),
    P('X', rrect(8.4, 13, 13.6, 21.4, 2.2), orb(9.6, 14, 4, 6, SAND), 'T')
  ].concat(clump([[5.4, 6.4, 3.8], [11, 4.6, 4.6], [16.6, 6.4, 3.6], [2.8, 10, 2.2], [19.4, 9.6, 1.8]])), [
    [3, 14, ['.TTT.', 'T...T']], [14, 14, ['.TTT.', 'T...T']], [4, 15, ['XXX']], [15, 15, ['XXX']],
    [5, 22, ['T..........T', '.TTTTTTTTTT.', '..XXXXXXXX..']], [2, 19, ['3']], [18, 19, ['3']], [10, 2, ['r']], [16, 4, ['F']], [4, 6, ['s']]
  ]);
  D.fern = build(26, 20, (function () {
    var parts = [];
    // each frond a curve from the root, scalloped into leaflets, tapering
    [[13.6, 2.4, 12.6, 9], [3.6, 4.6, 8.6, 3.6], [22.4, 4.6, 17.4, 3.6], [0.6, 14.2, 3, 6.4], [25.4, 14.2, 23, 6.4]].forEach(function (fr) {
      var pts = [];
      for (var k = 0; k <= 16; k++) { var t = k / 16, u = 1 - t; pts.push([u * u * 13 + 2 * u * t * fr[2] + t * t * fr[0], u * u * 20 + 2 * u * t * fr[3] + t * t * fr[1]]); }
      parts.push(P('<', function (x, y) {
        for (var i = 1; i < pts.length; i++) { var t = i / 16, r = (2.6 - 1.4 * t) * (0.56 + 0.56 * Math.abs(Math.sin(t * Math.PI * 5))), dx = x - pts[i][0], dy = y - pts[i][1]; if (dx * dx + dy * dy <= r * r) return true; }
        return false;
      }, function (x, y) {
        for (var i = 0; i < pts.length; i++) { var dx = x + 0.5 - pts[i][0], dy = y + 0.5 - pts[i][1]; if (dx * dx + dy * dy < 0.45) return ')'; }
        return orb(11, 6, 15, 13, LEAF)(x, y);
      }, '('));
    });
    return parts;
  })());

  // Moon: a giant mushroom that breathes light, a cratered moon rock and a
  // glassy star-flower
  D.glowshroom = [0, 1].map(function (f) {
    var tone = f ? '+=-::' : TEAL, spot = f ? 'w' : ':';
    var spots = or(ell(7, 6.5, 2.2, 1.8), ell(14.5, 3.8, 2, 1.6), ell(19.6, 9, 1.8, 1.5), ell(4.4, 11.4, 1.4, 1.1), ell(12, 9.6, 1.4, 1.2));
    return build(26, 34, [
      P('W', or(rrect(9.6, 13, 16.4, 34, 3), ell(13, 31.6, 5.2, 2.6)), orb(11.5, 22, 5, 13, f ? '1WLww' : '21WLw'), '2'),
      P('+', both(ell(13, 14, 11.4, 3.2), function (x, y) { return y > 13; }), function (x) { return x % 2 ? '@' : '+'; }, '@'),
      P('=', both(ell(13, 14.5, 12.6, 12.8), function (x, y) { return y < 14.5; }), function (x, y) {
        return spots(x + 0.5, y + 0.5) ? spot : orb(11, 9, 13, 12, tone)(x, y);
      }, '@')
    ]);
  });
  // a crater: shadowed on its upper left inside, lit on its lower right,
  // with a bright lip below
  var crater = function (cx, cy, rx, ry) {
    var inside = ell(cx, cy, rx, ry), lip = ell(cx + 0.6, cy + 0.7, rx + 0.6, ry + 0.6);
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (inside(X, Y)) return (X - cx) / rx + (Y - cy) / ry < 0.2 ? 'i' : 'j';
      return lip(X, Y) && Y > cy ? 'e' : null;
    };
  };
  D.moonrock = build(24, 16, (function () {
    var cs = [crater(7, 7.6, 2.6, 1.8), crater(15.4, 6.6, 1.8, 1.3), crater(17.4, 11.4, 2.2, 1.5), crater(9.6, 12, 1.4, 1)];
    return [P('j', or(ell(12, 11, 11.5, 5.6), ell(8, 7.6, 6.6, 5.6), ell(16, 8, 5.8, 5.2), rrect(0.8, 11, 23.2, 16, 2.4)), function (x, y) {
      for (var i = 0; i < cs.length; i++) { var t = cs[i](x, y); if (t) return t; }
      return orb(9, 6, 13, 9, MOON)(x, y);
    }, 'i')];
  })());
  // a kite-faceted star: one side of each point catches the light
  var starShape = function (cx, cy, R, r0, a0) {
    return function (x, y) {
      var dx = x - cx, dy = y - cy, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) - a0, seg = Math.PI * 2 / 5;
      var d = ((a % seg) + seg * 1.5) % seg - seg / 2;
      return rr <= r0 + (R - r0) * (1 - Math.abs(d) / (seg / 2));
    };
  };
  var starTex = function (cx, cy, a0, t) {
    return function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) - a0, seg = Math.PI * 2 / 5;
      var d = ((a % seg) + seg * 1.5) % seg - seg / 2;
      if (rr < 1.3) return t[4];
      if (Math.abs(d) * rr < 0.45) return t[3];
      return d < 0 ? (dy < 0 ? t[3] : t[2]) : (dy < 0 ? t[2] : t[1]);
    };
  };
  D.crystalflower = build(14, 22, [
    P('-', rrect(5.3, 9, 8.7, 22, 1.4), orb(6, 15, 2.6, 8, '+=-::'), '+'),
    P('-', petal(7, 19.6, -2.6, 3, 3.4, 1.8), orb(4, 17, 4, 3, '+=-::'), '+'),
    P('-', petal(7, 17.2, -0.5, 3, 3.4, 1.8), orb(9, 15, 4, 3, '+=-::'), '+'),
    P('r', starShape(7, 6.6, 6.6, 2.8, -Math.PI / 2), starTex(7, 6.6, -Math.PI / 2, PINK), 'p')
  ], [[6, 6, ['w']]]);

  // Clock tower: a brass lantern hung from a post, a big brass cog
  D.lantern = build(12, 26, [
    P('U', or(rrect(0.8, 2, 4, 26, 1), rrect(0, 23.4, 4.8, 26, 1.2), rrect(0.8, 1.6, 9.8, 4.4, 1)), orb(2.4, 10, 3, 14, WOOD), 'S'),
    P('G', cap(8.2, 4, 8.2, 7.2, 0.8)),
    P('7', rrect(4.6, 9, 11.6, 17.4, 1.4), orb(7, 11, 5, 6, '67788'), 'G'),
    P('G', or(tri(8.1, 5.6, 4.2, 9.4, 12, 9.4), rrect(4.2, 8.4, 12, 10, 0.8)), orb(7, 7, 4, 3, INK), 'f'),
    P('G', rrect(4.4, 16.6, 11.8, 18.8, 0.9), orb(7, 16, 4, 2, INK), 'f')
  ], [[8, 10, ['G', 'G', 'G', 'G', 'G', 'G', 'G']], [6, 12, ['8.', '7.', '6.']]]);
  D.gearBig = build(32, 32, (function () {
    var N = 10, holes = [0, 1, 2, 3, 4].map(function (k) { var a = k * Math.PI * 2 / 5 - Math.PI / 2; return ell(16 + Math.cos(a) * 7.4, 16 + Math.sin(a) * 7.4, 2.1, 2.1); });
    var shape = function (x, y) {
      var dx = x - 16, dy = y - 16, r = Math.sqrt(dx * dx + dy * dy), u = Math.abs(((Math.atan2(dy, dx) * N / (Math.PI * 2) + 0.25) % 1 + 1) % 1 - 0.5) * 2;
      if (r > 12.6 + Math.max(0, Math.min(1, (0.62 - u) * 6)) * 3 || r < 1.6) return false;
      return !holes.some(function (h) { return h(x, y); });
    };
    return [P('C', shape, function (x, y) {
      var dx = x + 0.5 - 16, dy = y + 0.5 - 16, r = Math.sqrt(dx * dx + dy * dy), t = orb(13, 13, 17, 17, GOLD)(x, y);
      // a groove inside the rim and a raised hub
      if (r > 10.6 && r < 11.6) return step(GOLD, t, -1);
      if (r > 3.4 && r < 4.4) return step(GOLD, t, -1);
      if (r <= 3.4) return step(GOLD, t, 1);
      return t;
    }, 'A')];
  })());

  // Sky ship: the Captain's pennant on a little post, a gold star on red
  D.flagpost = build(16, 36, [
    P('U', or(rrect(1.2, 4, 4.6, 36, 1), rrect(0.2, 32.4, 5.6, 36, 1.2)), orb(2.4, 20, 2.6, 18, WOOD), 'S'),
    O(2.9, 2.9, 2.7, 2.7, GOLD, 'A'),
    P('x', function (x, y) {
      if (x < 4.2 || x > 15.8) return false;
      var t = (x - 4.2) / 11.6;
      return Math.abs(y - (10.6 + Math.sin(x * 0.6) * 1.1 * t)) < 5.6 * (1 - t) + 0.5;
    }, function (x, y) { var w = Math.cos(x * 0.6), t = orb(6, 7, 10, 7, RED)(x, y); return t === 'z' || t === 'y' ? t : w > 0.5 ? 'y' : w < -0.5 ? 'v' : 'x'; }, 'u')
  ], [[6, 8, ['..D..', 'DDDCB', '.DCB.', '.D.B.']]]);

  /* ==========================================================================
     THE BIG TRIP — the third land, levels 21–30. Rascal the Fox has run
     off with Brocco, and the family chase him all the way to Paris: the
     ferry, the fields, a market village, a bakery, the cheese caves, the
     rooftops, the Metro, the tower, and the park at the end of it all.
     Its locals, its springs, the things Bonnie rides, and its scenery.
     ========================================================================== */
  /* Five more ramps, deep to shine. Every printable ASCII character is a
     colour by now, so these are accented letters (fitting, for France).
     They're real UTF-8 characters in string literals, so every page that
     loads this file must keep its <meta charset="utf-8">. Textures mostly
     use the ramps' names rather than the letters. */
  var ramp = function (chars, cols) { for (var i = 0; i < cols.length; i++) PAL[chars.charAt(i)] = cols[i]; return chars; };
  var CRUST = ramp('àáâão', ['#7a3a10', '#b8661e', '#e09a3c', '#f8c870']);           // baked bread (shine is 'o')
  var METRO = ramp('èéêëì', ['#0e3222', '#1a5236', '#2a744a', '#50a06c', '#b0e2c0']); // Metro green paint and ironwork
  var TERRA = ramp('òóôõö', ['#6a2414', '#a4432a', '#d06a40', '#ee9a6c', '#ffd8bc']); // terracotta
  var STRAW = ramp('ùúûüF', ['#7a5a18', '#b48c30', '#dcb850', '#f2da84']);           // hay and wicker (shine is 'F')
  var MINT = ramp('ÀÁÂÃÄ', ['#2a7a6a', '#52b29c', '#88d6c2', '#c2f0e2', '#f0fffa']); // a fairground pastel
  var DOUGH = 'VZXYw', CREAM = 'ZZYYw', FOX = 'klmno', NAVY = ';;_|?', SOCK = 'SSTTU';
  // a dimple: shadowed inside on its upper left, lit on its lower right,
  // with a bright lip below (t: inside dark, inside light, lip)
  var dent = function (cx, cy, rx, ry, t) {
    var inside = ell(cx, cy, rx, ry), lip = ell(cx + 0.5, cy + 0.6, rx + 0.5, ry + 0.5);
    return function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (inside(X, Y)) return (X - cx) / rx + (Y - cy) / ry < 0.25 ? t.charAt(0) : t.charAt(1);
      return lip(X, Y) && Y > cy ? t.charAt(2) : null;
    };
  };
  var firstOf = function (fs, x, y) { for (var i = 0; i < fs.length; i++) { var t = fs[i](x, y); if (t) return t; } return null; };
  // a stamp that follows a part turned by a about (px, py)
  var turnedAt = function (x, y, px, py, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [Math.round(px + (x - px) * c - (y - py) * s), Math.round(py + (x - px) * s + (y - py) * c)];
  };

  /* Pigeon: a plump Paris pigeon flapping along, soft dove-grey, a green
     and purple sheen round his neck, a round orange eye and pink toes.
     Wings up, wings down. */
  var PIG_EYE = ['.##.', '#nw#', '#En#', '#Em#', '.##.'];
  /* A pigeon's wing: a fan of long flight feathers from the shoulder
     (sx, sy) out to their tips, each its own feather with a dark end, and
     over their roots the pale coverts crossed by the pigeon's two dark
     bars. `far` is the wing on the other side, in shadow. */
  var pigWing = function (sx, sy, tips, far) {
    var mid = tips[tips.length >> 1], ax = mid[0] - sx, ay = mid[1] - sy, L = Math.sqrt(ax * ax + ay * ay), ux = ax / L, uy = ay / L;
    var lit = orb(sx + ux * 3 - 2, sy + uy * 3 - 2, L, L, far ? 'NNOOP' : 'PQQRR'), dk = orb(sx + ux * 3 - 2, sy + uy * 3 - 2, L, L, far ? 'NNNNO' : 'NNOOP');
    var parts = tips.map(function (tp) {
      var bx = sx + (tp[0] - sx) * 0.25, by = sy + (tp[1] - sy) * 0.25, fx = tp[0] - bx, fy = tp[1] - by, fl = fx * fx + fy * fy;
      return P('Q', cap(bx, by, tp[0], tp[1], 1.3), function (x, y) {
        return ((x + 0.5 - bx) * fx + (y + 0.5 - by) * fy) / fl > 0.68 ? dk(x, y) : lit(x, y);
      }, 'O');
    });
    var cx = sx + ux * 3.2, cy = sy + uy * 3.2;
    parts.push(P('Q', turned(ell(cx, cy, 4.8, 3.3), cx, cy, Math.atan2(uy, ux)), function (x, y) {
      var al = (x + 0.5 - sx) * ux + (y + 0.5 - sy) * uy;
      return !far && (Math.abs(al - 3.6) < 0.6 || Math.abs(al - 5.8) < 0.6) ? dk(x, y) : lit(x, y);
    }, 'O'));
    return parts;
  };
  // the neck's sheen: green over the nape, a lilac-purple at the throat
  var sheen = function (cx, cy, rx, ry) {
    var gr = orb(cx, cy, rx, ry, 'èéêëì'), pu = orb(cx, cy, rx, ry, 'hij`e');
    return function (x, y) { return (x + 0.5 - cx) * 0.8 - (y + 0.5 - cy) > 0.8 ? gr(x, y) : pu(x, y); };
  };
  E.pigeon = [0, 1].map(function (f) {
    return build(26, 22, (f ? [] : pigWing(17.6, 10, [[22.2, 2.6], [24.4, 4.6], [25.4, 7.4]], true)).concat([
      P('O', or(tri(18.5, 12.8, 25.8, 9.6, 25.8, 16.2), ell(25, 12.9, 1, 3.3)), function (x, y) { var t = orb(20, 11, 7, 5, IRON)(x, y); return x > 22.5 ? step(IRON, t, -2) : t; }, 'N'),
      O(14.4, 13, 8.6, 6.4, 'NNOPQ'),
      P('r', or(ell(12.4, 19.8, 1.7, 1.2), ell(15.8, 20.2, 1.7, 1.2)), orb(13, 19, 4, 2, PINK), 'p'),
      P('j', ell(9.4, 10.6, 4, 4.6), sheen(9.4, 10.6, 4, 4.6)),
      O(6.6, 7.4, 4.3, 4.1, 'NNOPQ'),
      P('O', tri(0.3, 9, 3.4, 7.1, 3.4, 9.9), orb(2, 8.6, 3, 2, IRON), 'N'),
      P('W', ell(3.4, 7.4, 1.1, 0.9))
    ]).concat(f ? pigWing(14.6, 11.4, [[13.4, 20.6], [16.4, 21], [19.3, 20.4], [21.8, 18.6]]) : pigWing(14.4, 10.8, [[14.8, 1.4], [17.8, 0.8], [20.8, 1.6], [23.4, 3.8]])), [[4, 5, PIG_EYE]]);
  });

  /* Croissant: a little walking croissant, all crisp curled layers, big
     eyes on its middle, toddling on two stubby legs */
  E.croissant = [0, 1].map(function (f) {
    var k = f ? 1.2 : -1.2;
    // the layers, the tips first, so each one curls over the one outside it
    var layers = [[3.4, 12.2, 3, 3.3, -0.8], [22.6, 12.2, 3, 3.3, 0.8], [7.2, 9.2, 4.4, 4.9, -0.45], [18.8, 9.2, 4.4, 4.9, 0.45], [13, 7.4, 6.2, 6.6, 0]];
    var parts = [
      P('á', or(cap(10.4, 12.6, 9.6 + k, 16.2, 1.6), cap(15.6, 12.6, 16.4 - k, 16.2, 1.6)), orb(13, 13, 6, 4, 'ààááâ'), 'à'),
      P('á', or(ell(8.8 + k, 16.8, 2.5, 1.2), ell(15.4 - k, 16.8, 2.5, 1.2)), orb(12, 16, 7, 2, 'ààááâ'), 'à')
    ];
    layers.forEach(function (s) {
      parts.push(P('â', turned(ell(s[0], s[1], s[2], s[3]), s[0], s[1], s[4]), orb(s[0] - 0.4, s[1] - 0.8, s[2] + 0.8, s[3] + 0.6, CRUST), 'à'));
    });
    return build(26, 18, parts, [[8, 4, EYE], [13, 4, EYE], [10, 10, ['#..#', '.##.']], [7, 9, ['3']], [17, 9, ['3']]]);
  });

  /* Cheese: a whole round cheese bowling along and grumpy about it. The
     holes and the rind turn as it rolls; the face stays the right way up */
  E.cheese = [0, 1].map(function (f) {
    var th = f * Math.PI / 5, cx = 12, cy = 12, CHZ = 'BCDDF', RIND = 'ABBCD', lit = orb(cx, cy, 11.6, 11.6, CHZ), rl = orb(cx, cy, 11.6, 11.6, RIND);
    var holes = [[0.4, 7.4, 1.9, 1.7], [1.6, 7.8, 1.4, 1.2], [2.6, 7, 2.1, 1.9], [3.8, 7.8, 1.3, 1.2], [4.6, 7.2, 1.9, 1.7], [5.6, 8, 1.2, 1.1]].map(function (h) {
      var a = h[0] + th; return dent(cx + Math.cos(a) * h[1], cy + Math.sin(a) * h[1], h[2], h[3], 'BCF');
    });
    return build(24, 24, [
      P('D', ell(cx, cy, 11.6, 11.6), function (x, y) {
        var dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.sqrt(dx * dx + dy * dy);
        // the rind: a band round the edge, in eight panels that turn with it
        if (r > 9.6) { var t = rl(x, y); return Math.floor((Math.atan2(dy, dx) - th) / (Math.PI / 4) + 16) % 2 ? t : step(RIND, t, -1); }
        return firstOf(holes, x, y) || lit(x, y);
      }, 'A')
    ], [[5, 7, ['##..']], [15, 7, ['..##']], [7, 8, ['#']], [16, 8, ['#']], [5, 9, EYE], [15, 9, EYE], [10, 15, ['.##.', '#..#']], [4, 14, ['3']], [19, 14, ['3']]]);
  });

  /* Toy soldier: a painted wooden parade soldier, marching stiff-legged:
     a tall black hat with a red pompom, red coat, white cross-belts, gold
     buttons and epaulettes, painted rosy cheeks and a smile. Friendly. */
  var SKIN = 'VZXXY';
  E.soldier = [0, 1].map(function (f) {
    // stiff wooden legs: a long stride, then the near leg kicked up high
    var s = f ? 1 : -1, nf = f ? [5.4, 28.4] : [6, 30], ff = f ? [10.6, 30] : [13.6, 30];
    var leg = function (hx, ft) { return P('_', cap(hx, 25, ft[0], ft[1], 1.9), orb(hx - 1, 26, 3, 6, NAVY), ';'); };
    var boot = function (ft) { return P('g', ell(ft[0] - 0.6, ft[1] + 0.9, 2.5, 1.2), orb(ft[0] - 1, ft[1], 3, 2, INK), 'f'); };
    var coat = rrect(5.2, 17.4, 14.8, 25.6, 2.4);
    return build(20, 32, [
      // the far arm swings behind him, against the near one
      P('v', cap(12.6, 19, 12.6 + s * 2.2, 23.8, 1.7), orb(12, 19, 3, 5, RED), 'u'), O(12.6 + s * 2.4, 24.2, 1.6, 1.5, SNOW, '2'),
      leg(11.4, ff), boot(ff),
      leg(8.4, nf), boot(nf),
      P('x', coat, function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // cross-belts, a gold buckle where they meet, a dark belt round his middle
        if (Y > 23.6) return orb(9, 23, 6, 3, INK)(x, y);
        if (Math.abs((X - 10) - (Y - 20.8) * 0.95) < 0.95 || Math.abs((X - 10) + (Y - 20.8) * 0.95) < 0.95) return Math.abs(X - 10) < 1.3 && Math.abs(Y - 20.8) < 1.3 ? 'C' : orb(8, 18, 8, 7, SNOW)(x, y);
        return orb(8.5, 19, 8, 8, RED)(x, y);
      }, 'u'),
      P('C', ell(7.6, 18, 2.6, 1.3), orb(7, 17.6, 3, 2, GOLD), 'A'),
      P('x', cap(7.6, 19, 7.6 - s * 2.2, 23.8, 1.7), orb(7, 19, 3, 5, RED), 'u'), O(7.6 - s * 2.4, 24.2, 1.6, 1.5, SNOW, '2'),
      O(10, 14, 5.4, 4.6, SKIN, 'V'),
      P('g', rrect(5.4, 1.6, 14.6, 10.4, 2.6), function (x, y) { return y > 8.2 ? orb(8, 9, 6, 2, GOLD)(x, y) : orb(8, 4, 8, 8, INK)(x, y); }, 'f'),
      O(7, 2.2, 1.9, 1.8, RED, 'u')
    ], [[8, 4, ['DC', 'CB']], [7, 12, ['Ew', 'EE']], [11, 12, ['Ew', 'EE']], [6, 14, ['3']], [13, 14, ['3']], [8, 15, ['#..#', '.##.']]]);
  });

  /* Suitcase: a hopping caramel suitcase covered in travel stickers, with
     a handle, brass corners and two straps. Shut, then mid-hop with its
     lid flung open like a mouth (red lining, a stray sock for a tongue). */
  var CASE = 'TUVVX';
  E.suitcase = [0, 1].map(function (f) {
    var a = f ? 0.3 : 0, hx = 24.4, hy = 12.2;
    var lid = function (g) { return a ? turned(g, hx, hy, a) : g; };
    var leather = orb(8, 9, 17, 13, CASE);
    var straps = function (x) { return (x >= 14 && x < 15.6) || (x >= 20 && x < 21.6); };
    var corner = function (x, y, c) { return c.some(function (p) { return Math.abs(x + 0.5 - p[0]) + Math.abs(y + 0.5 - p[1]) < 2.6; }); };
    var parts = [];
    if (a) {
      // inside: the lining, darker towards the back
      var lip = turnedAt(1.4, hy, hx, hy, a);
      parts.push(P('v', tri(hx, hy + 0.4, 1.4, hy + 0.4, lip[0], lip[1]), orb(4, hy - 2, 16, 6, RED), 'u'));
    }
    parts.push(
      P('U', rrect(1.4, hy - 0.4, 24.6, 21.6, 2.4), function (x, y) {
        if (corner(x, y, [[1.4, 21.6], [24.6, 21.6]])) return orb(4, 18, 6, 6, GOLD)(x, y);
        if (straps(x)) return y === 13 ? orb(15, 13, 2, 2, GOLD)(x, y) : step(CASE, leather(x, y), -2);
        return leather(x, y);
      }, 'S'),
      // stickers: a round one with a heart, a blue label, a yellow star
      P('w', ell(6.2, 16.8, 2.8, 2.8), function (x, y) { return ell(6.2, 16.8, 1.7, 1.7)(x + 0.5, y + 0.5) ? orb(6, 16.6, 2, 2, PINK)(x, y) : orb(5, 15.6, 4, 4, SNOW)(x, y); }, 'P'),
      P('|', rrect(9.2, 14, 12.8, 19.8, 0.6), function (x, y) { return y === 16 || y === 18 ? 'W' : orb(10, 15, 5, 6, COAT)(x, y); }, '_'),
      P('C', starShape(18, 17.4, 2.7, 1.2, -Math.PI / 2), starTex(18, 17.4, -Math.PI / 2, GOLD), 'A')
    );
    // a sock hanging out over the front, for a tongue
    if (a) parts.push(P('r', limb([[4.6, 12.4], [3, 14.2], [3.4, 16.4]], 1.3), function (x, y) { return y === 14 ? 'w' : orb(3, 13, 3, 3, PINK)(x, y); }, 'p'));
    parts.push(
      P('U', lid(rrect(1.4, 6, 24.6, hy, 2.4)), lid(function (x, y) {
        if (corner(x, y, [[1.4, 6], [24.6, 6]])) return orb(4, 6, 6, 6, GOLD)(x, y);
        if (straps(x)) return Math.abs(y - 10.5) < 1 ? orb(15, 10, 2, 2, GOLD)(x, y) : step(CASE, leather(x, y), -2);
        return y > hy - 1 ? 'T' : leather(x, y);
      }), 'S'),
      P('g', lid(but(rrect(9.4, 2.2, 16.6, 6.6, 2.2), rrect(11.2, 4, 14.8, 7, 0.8))), lid(orb(12, 2, 6, 4, INK)), 'f')
    );
    var e1 = a ? turnedAt(3, 7, hx, hy, a) : [3, 7], e2 = a ? turnedAt(8, 7, hx, hy, a) : [8, 7];
    return build(26, 22, parts, [[e1[0], e1[1], EYE], [e2[0], e2[1], EYE]].concat(a ? [] : [[4, 13, ['.#....#', '..####.']]]));
  });

  // Baguette: a whole one, thrown end over end; long pale slashes where
  // the baker scored it
  E.baguette = build(28, 8, [
    P('â', or(ell(14, 4, 13.6, 3.3), rrect(4, 0.8, 24, 7.2, 3.2)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(11, 2, 16, 5, CRUST)(x, y);
      for (var k = 0; k < 4; k++) {
        var xc = 6.4 + k * 5, d = (Y - 3.6) + (X - xc) * 0.36;
        if (Math.abs(X - xc) > 2.8) continue;
        if (Math.abs(d) < 0.7) return X < xc ? 'o' : 'ã';
        if (d >= 0.7 && d < 1.5) return 'á';
      }
      return t;
    }, 'à')
  ], [[2, 5, ['o']], [25, 3, ['o']]]);

  /* Rascal the Fox, who ran off with Brocco: a cheeky, friendly orange
     fox in a navy-and-white striped top and a red beret, with a great
     bushy tail tipped white. A mischief-maker, never scary: a grin and a
     cocked brow. He's built as a puppet (a head, a body, striped sleeves
     and legs on joints) and each frame is a pose: standing with a paw on
     his hip, two running strides, a jump, a throw (a baguette cocked
     behind his ear, the other paw pointing), and dizzy (bumped: eyes
     spinning, wobbly, his beret knocked sideways). */
  // dizzy eyes: a spiral of a turn and a half, drawn straight on the fur
  var SWIRL = ['..###.', '.#...#', '#..#.#', '#.#..#', '#..##.', '.#....'];
  // a limb along pts, in stripes round it (`every` long) — the top's sleeves
  var stripedLimb = function (pts, r, every, a, b) {
    var segs = [], acc = [0];
    for (var i = 0; i < pts.length - 1; i++) {
      var dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1];
      segs.push([pts[i][0], pts[i][1], dx, dy, dx * dx + dy * dy]); acc.push(acc[i] + Math.sqrt(dx * dx + dy * dy));
    }
    var along = function (x, y) {
      var best = 1e9, at = 0;
      segs.forEach(function (s, i) {
        var t = s[4] ? Math.max(0, Math.min(1, ((x - s[0]) * s[2] + (y - s[1]) * s[3]) / s[4])) : 0;
        var px = s[0] + s[2] * t - x, py = s[1] + s[3] * t - y, d = px * px + py * py;
        if (d < best) { best = d; at = acc[i] + t * Math.sqrt(s[4]); }
      });
      return at;
    };
    var la = orb(pts[0][0] - 2, pts[0][1] - 2, 8, 8, a), lb = orb(pts[0][0] - 2, pts[0][1] - 2, 8, 8, b);
    return { f: limb(pts, r), tex: function (x, y) { return Math.floor(along(x + 0.5, y + 0.5) / every) % 2 ? la(x, y) : lb(x, y); } };
  };
  var FOX_POSE = {
    idle: { H: [18, 15.5], B: [24, 33],
      legs: [[[27.5, 39.6], [28, 45], [28.8, 49.6]], [[21, 39.6], [20, 45], [18.6, 49.6]]],
      arms: [[[28.4, 27.6], [33.4, 32], [29.8, 36.6]], [[20.6, 27.6], [12.6, 32.4], [17.6, 37.4]]],
      tail: [[30.6, 39.6], [44, 42], [49.6, 30], [42.6, 17.6]], eyes: 'open', mouth: 'grin', beret: [0, 0, 0.22] },
    run0: { H: [16.4, 16.4], B: [23.4, 33.2],
      legs: [[[27, 39.6], [31.6, 44.4], [36, 46.6]], [[21, 39.6], [16, 43.6], [12.8, 49.6]]],
      arms: [[[28, 27.8], [24, 32.4], [21, 35]], [[20.6, 28], [24.6, 33.2], [29, 34.6]]],
      tail: [[30, 39], [39.4, 41.6], [46.6, 37], [47, 26.4]], eyes: 'open', mouth: 'grin', beret: [0, 0, 0.34] },
    run1: { H: [16.4, 15.6], B: [23.4, 32.6],
      legs: [[[27, 39.2], [22.4, 42.6], [24.6, 47.2]], [[21, 39.2], [21.4, 44.6], [20.4, 49.6]]],
      arms: [[[28, 27.4], [31.6, 31.6], [34.6, 33.4]], [[20.6, 27.6], [15, 30.6], [11.4, 28]]],
      tail: [[30, 38.6], [39.4, 40], [46.6, 34], [46, 24]], eyes: 'open', mouth: 'grin', beret: [0, 0, 0.3] },
    jump: { H: [18, 14.4], B: [24, 31.6],
      legs: [[[27, 38.6], [31.4, 41.6], [28.4, 46.4]], [[21, 38.6], [16, 41], [17.6, 46.2]]],
      arms: [[[28.4, 26.4], [33.6, 21.6], [35.4, 15.6]], [[20.6, 26.8], [14.4, 27.6], [8.6, 25.2]]],
      tail: [[30.6, 38], [42, 39.6], [47.4, 28], [42, 16.6]], eyes: 'open', mouth: 'open', beret: [0, -0.6, 0.12] },
    throw: { H: [17.4, 15.6], B: [24, 33],
      legs: [[[27.5, 39.6], [29.6, 45], [31.6, 49.6]], [[21, 39.6], [18, 45], [15.6, 49.6]]],
      arms: [[[28.4, 27.4], [34, 24.4], [32.4, 18]], [[20.6, 27.8], [14.6, 29.6], [8.8, 28.4]]],
      tail: [[30.6, 39.6], [43.4, 42.6], [49.4, 32], [44.6, 19]], eyes: 'open', mouth: 'grin', beret: [0, 0, 0.22], bread: true },
    dizzy: { H: [20, 16.8], B: [24.6, 33.4], tilt: -0.16,
      legs: [[[27.4, 39.6], [25.2, 45], [30.4, 49.6]], [[21.4, 39.6], [23.6, 45], [18.6, 49.6]]],
      arms: [[[28.6, 28], [32.4, 33], [34, 38.2]], [[20.6, 28.2], [16.6, 33], [14.6, 38.2]]],
      tail: [[31, 40], [42.6, 44], [48.6, 38.4], [47, 29.6]], eyes: 'swirl', mouth: 'tongue', beret: [4.4, 2.2, 0.95] }
  };
  var foxPose = function (o) {
    var hx = o.H[0], hy = o.H[1], bx = o.B[0], by = o.B[1], tilt = o.tilt || 0;
    var tl = function (f) { return tilt ? turned(f, hx, hy + 6, tilt) : f; };
    var HP = function (c, f, tex, line) { return P(c, tl(f), tex && tl(tex), line); };
    var at = function (x, y) { return tilt ? turnedAt(x, y, hx, hy + 6, tilt) : [Math.round(x), Math.round(y)]; };
    var parts = [];
    // the tail: a fat brush along a curve, white at the tip
    var tp = o.tail, smp = [];
    for (var i = 0; i <= 24; i++) {
      var t = i / 24, u = 1 - t, X = u * u * u * tp[0][0] + 3 * u * u * t * tp[1][0] + 3 * u * t * t * tp[2][0] + t * t * t * tp[3][0];
      var Y = u * u * u * tp[0][1] + 3 * u * u * t * tp[1][1] + 3 * u * t * t * tp[2][1] + t * t * t * tp[3][1];
      smp.push([X, Y, 2.4 + 4.4 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.8) + 1.6 * t, t]);
    }
    var near = function (x, y) {
      var best = 1e9, k = null;
      smp.forEach(function (s) { var dx = x - s[0], dy = y - s[1], d = Math.sqrt(dx * dx + dy * dy) - s[2]; if (d < best) { best = d; k = s; } });
      return k;
    };
    var tlit = orb(tp[2][0] - 4, tp[2][1] - 4, 13, 13, FOX), tw = orb(tp[3][0] - 2, tp[3][1] - 2, 7, 7, CREAM);
    parts.push(P('m', function (x, y) { return smp.some(function (s) { var dx = x - s[0], dy = y - s[1]; return dx * dx + dy * dy <= s[2] * s[2]; }); }, function (x, y) {
      var k = near(x + 0.5, y + 0.5), a = Math.atan2(y + 0.5 - k[1], x + 0.5 - k[0]);
      if (k[3] > 0.87 + Math.sin(a * 3) * 0.04) return tw(x, y);
      // a few darker strands combed along it
      return Math.abs(Math.sin(k[3] * 26 + a * 2)) > 0.94 ? step(FOX, tlit(x, y), -1) : tlit(x, y);
    }, 'k'));
    // legs: orange above, dark stockings from the knee, a dark paw of a foot
    var leg = function (L, far) {
      var dk = far ? 'SSSTT' : SOCK, fur = far ? 'kklmn' : FOX;
      return [
        P('T', or(cap(L[1][0], L[1][1], L[2][0], L[2][1], 2), ell(L[2][0] - 1.6, L[2][1] + 0.7, 3.2, 1.6)), orb(L[1][0] - 2, L[1][1], 5, 7, dk), 'S'),
        P('m', cap(L[0][0], L[0][1], L[1][0], L[1][1], 2.5), orb(L[0][0] - 2, L[0][1], 5, 7, fur), 'k')
      ];
    };
    var arm = function (A, far) {
      var sl = stripedLimb([A[0], A[1], [A[1][0] + (A[2][0] - A[1][0]) * 0.72, A[1][1] + (A[2][1] - A[1][1]) * 0.72]], 1.9, 2.2, far ? ';;;__' : NAVY, far ? '1122W' : SNOW);
      return [P('_', sl.f, sl.tex, ';'), P('T', ell(A[2][0], A[2][1], 2.1, 2), orb(A[2][0] - 1, A[2][1] - 1, 3, 3, far ? 'SSSTT' : SOCK), 'S')];
    };
    if (o.bread) {
      var pw = o.arms[0][2];
      parts.push(P('â', cap(pw[0] - 3, pw[1] - 10, pw[0] + 3.4, pw[1] + 7.4, 2.5), function (x, y) {
        var d = (y + 0.5 - pw[1]) - (x + 0.5 - pw[0]) * 2.7, t = orb(pw[0] - 5, pw[1] - 9, 12, 12, CRUST)(x, y);
        return (Math.abs(Math.abs(d + 1) - 6) < 0.9 || Math.abs(d + 1) < 0.8) && x + 0.5 < pw[0] - (y + 0.5 - pw[1]) * 0.37 + 0.4 ? 'o' : t;
      }, 'à'));
    }
    parts = parts.concat(leg(o.legs[0], true), arm(o.arms[0], true), leg(o.legs[1]));
    // the striped top, a plain navy hem, the white of his chest at the neck
    parts.push(P('W', both(ell(bx, by, 8.4, 8.8), function (x, y) { return y < by + 8.4; }), function (x, y) {
      var band = Math.floor((y + 0.5 - (by - 8.8)) / 2.4) % 2;
      return y + 0.5 > by + 6.6 || band ? orb(bx - 3, by - 4, 11, 11, NAVY)(x, y) : orb(bx - 3, by - 4, 11, 11, SNOW)(x, y);
    }, '2'));
    parts.push(P('Y', ell(bx - 5.4, by - 7.6, 4.4, 3), orb(bx - 6, by - 9, 5, 4, CREAM), 'Z'));
    // the head: ears, a round face, white cheeks and jaw, a long snout
    var earT = function (pts, inner) {
      return [HP('m', tri.apply(null, pts), function (x, y) { return y + 0.5 < pts[3] + 3.4 ? orb(pts[2], pts[3], 4, 4, SOCK)(x, y) : orb(hx, hy - 8, 9, 8, FOX)(x, y); }, 'k'),
        HP('Y', tri.apply(null, inner), orb(inner[2], inner[3] + 4, 4, 6, CREAM))];
    };
    parts = parts.concat(earT([hx + 1.6, hy - 6.6, hx + 8.8, hy - 15.6, hx + 9.8, hy - 3.6], [hx + 3.6, hy - 6.4, hx + 8.2, hy - 12.2, hx + 8.4, hy - 5.2]));
    parts.push(
      HP('m', ell(hx, hy, 9.6, 8.6), function (x, y) {
        return y + 0.5 > hy + 2.4 - (x + 0.5 - hx) * 0.18 ? orb(hx - 2, hy, 9.6, 8.6, CREAM)(x, y) : orb(hx - 1, hy, 9.6, 8.6, FOX)(x, y);
      }, 'k'),
      HP('Y', tri(hx + 4, hy + 2.6, hx + 11.6, hy + 6.6, hx + 4.6, hy + 8.4), orb(hx + 6, hy + 4, 6, 5, CREAM), 'Z'),
      HP('m', ell(hx - 9.4, hy + 3.4, 6.6, 3.6), function (x, y) { return y + 0.5 > hy + 3.8 ? orb(hx - 11, hy + 3, 7, 4, CREAM)(x, y) : orb(hx - 11, hy + 1, 7, 4, FOX)(x, y); }, 'k'),
      HP('g', ell(hx - 15.2, hy + 2.6, 1.9, 1.6), orb(hx - 16, hy + 2, 2, 2, INK), 'f')
    );
    // the beret, at an angle of its own; a little stalk on top
    var bc = [hx + 3.2 + o.beret[0], hy - 8.6 + o.beret[1]], ba = o.beret[2];
    var bt = function (f) { return tl(turned(f, bc[0], bc[1], ba)); };
    parts.push(P('x', bt(or(ell(bc[0], bc[1], 8.6, 3.4), cap(bc[0] - 0.4, bc[1] - 3, bc[0] + 0.4, bc[1] - 4.8, 0.9))), bt(function (x, y) {
      return y + 0.5 > bc[1] + 2.2 ? 'v' : orb(bc[0] - 4, bc[1] - 3, 10, 5, RED)(x, y);
    }), 'u'));
    parts = parts.concat(earT([hx - 8.4, hy - 3.6, hx - 6.6, hy - 15, hx + 0.4, hy - 7.4], [hx - 6.8, hy - 5, hx - 5.8, hy - 12.4, hx - 1.8, hy - 7.6]));
    parts = parts.concat(arm(o.arms[1]));
    // the face
    var st = [];
    var e1 = at(hx - 9.6, hy - 4.2), e2 = at(hx - 3.2, hy - 4.2);
    if (o.eyes === 'swirl') st.push([e1[0], e1[1], SWIRL], [e2[0], e2[1], SWIRL]);
    else {
      var b1 = at(hx - 10, hy - 6.4), b2 = at(hx - 3.4, hy - 8);
      st.push([e1[0], e1[1], EYE_L], [e2[0], e2[1], EYE_L], [b1[0], b1[1], ['.###.']], [b2[0], b2[1], ['..##.', '##..#']]);
    }
    var m = at(hx - 14.2, hy + 4.4);
    st.push([m[0], m[1], {
      grin: ['#........#', '.#......#.', '..######..'],
      open: ['#.........#', '.#wwwwwww#.', '..#rrrrr#..', '...#####...'],
      tongue: ['.##...##..', '#..###..#.', '....#rr#..', '.....##...']
    }[o.mouth]]);
    var ch = at(hx - 4.4, hy + 3.4);
    st.push([ch[0], ch[1], ['33']]);
    return build(52, 52, parts, st);
  };
  E.fox = {
    idle: foxPose(FOX_POSE.idle),
    run: [foxPose(FOX_POSE.run0), foxPose(FOX_POSE.run1)],
    jump: foxPose(FOX_POSE.jump),
    throw: foxPose(FOX_POSE.throw),
    dizzy: foxPose(FOX_POSE.dizzy)
  };

  /* ---- springs ----------------------------------------------------------
     Three more things to bounce on, each the spring's own size (16 x 10)
     and its two frames, [ready, squashed], so any of them drops in where
     a spring goes: the top row is where Bonnie lands, and squashed they
     sit lower, on the same feet. */
  // a market stall's stripy awning: a domed canopy, a scalloped valance
  // hanging off its front edge, two wooden poles
  var awning = function (sq) {
    var k = sq ? 0.5 : 1, Y = function (y) { return 20 - (20 - y) * k; }, sw = 32 / 6, hem = Y(7.6);
    var top = function (x) { var u = (x - 16) / 16; return Y(0) + (sq ? 1.4 : 3.2) * u * u; };
    var band = function (x) { return Math.floor(Math.max(0, x) / sw) % 2; };
    return build(32, 20, [
      P('U', or(rrect(2.6, hem, 5.4, 19.4, 0.8), rrect(26.6, hem, 29.4, 19.4, 0.8), ell(4, 19.4, 2.8, 0.9), ell(28, 19.4, 2.8, 0.9)), orb(3, hem, 4, 14, 'TUVXY'), 'S'),
      P('x', function (x, y) {
        if (x < 0.3 || x > 31.7) return false;
        if (y < hem) return y > top(x);
        var c = (Math.floor(x / sw) + 0.5) * sw;
        return ell(c, hem, sw / 2 + 0.1, sq ? 2.2 : 3.4)(x, y);
      }, function (x, y) {
        var X = x + 0.5, Y2 = y + 0.5, t = orb(10, -3, 24, 16, band(X) ? SNOW : RED)(x, y);
        // the hem, where the valance hangs from the canopy, a tone down
        return Math.abs(Y2 - hem) < 0.6 || Y2 > hem + 1.6 ? step(band(X) ? SNOW : RED, t, -1) : t;
      }, 'u')
    ]);
  };
  A.awning = [awning(false), awning(true)];

  // a soft round bread roll, golden on top, scored, dusted with flour
  var roll = function (sq) {
    var cy = sq ? 14.2 : 10.1, ry = sq ? 5.9 : 10, rx = sq ? 15.8 : 15;
    return build(32, 20, [P('â', both(ell(16, cy, rx, ry), function (x, y) { return y < 19.8; }), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = (Y - (cy - ry * 0.5)) - Math.pow((X - 16) / rx, 2) * ry * 0.6;
      // the score across its top, opened out pale
      if (Math.abs(X - 16) < rx * 0.6 && Math.abs(d) < (sq ? 0.8 : 0.7)) return 'Y';
      if (Math.abs(X - 16) < rx * 0.6 && d >= 0.7 && d < 1.6) return 'á';
      if (Y > cy + ry * 0.55) return orb(12, cy - ry * 0.4, rx * 1.1, ry * 1.1, DOUGH)(x, y);
      return orb(11, cy - ry * 0.6, rx * 1.1, ry * 1.2, CRUST)(x, y);
    }, 'à')], sq ? [[7, 10, ['w']], [22, 11, ['w']], [12, 11, ['w']]] : [[8, 4, ['w']], [21, 3, ['w']], [12, 7, ['w']], [25, 8, ['w']]]);
  };
  A.dough = [roll(false), roll(true)];

  // a little bouncy castle: puffy walls, a turret at each end, a doorway
  var puffy = function (x0, x1, y0, y1, n, ramps) {
    var w = (x1 - x0) / n;
    return function (x, y) {
      var k = Math.max(0, Math.min(n - 1, Math.floor((x + 0.5 - x0) / w))), cx = x0 + w * (k + 0.5);
      return orb(cx - w * 0.15, (y0 + y1) / 2 - 1, w * 0.62, (y1 - y0) * 0.62, ramps[k % ramps.length])(x, y);
    };
  };
  var bouncy = function (sq) {
    var k = sq ? 0.55 : 1, Y = function (y) { return 20 - (20 - y) * k; };
    var dome = function (cx) { return ell(cx, Y(4), 3.6, 3.4 * k + 0.4); };
    return build(32, 20, [
      P('|', or(rrect(0.6, Y(15.4), 31.4, 19.6, 2), ell(16, 19, 16, 1.2)), puffy(0.6, 31.4, Y(15.4), 19.6, 4, [COAT, '_|??/']), ';'),
      P('C', rrect(4.6, Y(5.6), 27.4, Y(16), 1.6), function (x, y) {
        // the doorway, an arch of shadow in the middle
        if (rrect(12.6, Y(9.2), 19.4, Y(16) + 1, 3.2)(x + 0.5, y + 0.5)) return y + 0.5 < Y(10.4) ? 'h' : 'g';
        return puffy(4.6, 27.4, Y(5.6), Y(16), 4, [RED, GOLD])(x, y);
      }, 'A'),
      P('C', or(ell(10, Y(6), 2.8, 2.4 * k + 0.3), ell(16, Y(6), 2.8, 2.4 * k + 0.3), ell(22, Y(6), 2.8, 2.4 * k + 0.3)), puffy(7.2, 24.8, Y(3.4), Y(8.4), 3, [GOLD, RED, GOLD]), 'A'),
      P('x', or(rrect(0.6, Y(3.4), 6.8, Y(16), 2.4), rrect(25.2, Y(3.4), 31.4, Y(16), 2.4)), puffy(0.6, 31.4, Y(3.4), Y(16), 2, [RED]), 'u'),
      P('|', or(dome(3.7), dome(28.3)), puffy(0.1, 31.9, Y(0.6), Y(7.4), 2, [COAT]), ';')
    ], sq ? [] : [[3, 1, ['w']], [27, 1, ['w']]]);
  };
  A.bouncy = [bouncy(false), bouncy(true)];

  /* ---- moving platforms --------------------------------------------------
     What a moving platform can look like, in place of its plain tiles. The
     sprite is the platform's width; its `top` is how many game pixels down
     from the sprite's top edge Bonnie stands (0 for most: the top row is
     the surface; the carousel horse's pole and head, and the float's
     crown, rise above it). Anything else hangs below. Draw at (x, y - top). */
  var LK = A.looks = A.looks || {};
  var look = function (sp, top) { sp.top = top || 0; return sp; };
  // a Metro carriage, side on: Bonnie rides on its flat roof. Cream above
  // with a row of windows, green below, two pairs of sliding doors
  LK.train = look(build(96, 36, (function () {
    var doors = [[22, 33], [63, 74]], wins = [6.4, 39.4, 48.2, 57, 82];
    var parts = [];
    [9.6, 19.6, 76.4, 86.4].forEach(function (wx) { parts.push(O(wx, 31.6, 3.6, 3.6, INK, 'f')); });
    parts.push(P('g', or(rrect(6, 28.4, 23.4, 31.6, 1), rrect(72.6, 28.4, 90, 31.6, 1)), orb(10, 28, 20, 6, INK), 'f'));
    parts.push(P('ê', rrect(0.6, 0, 95.4, 29.6, 3.4), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      var win = wins.some(function (w) { return rrect(w, 7.4, w + 7.4, 15.4, 1.4)(X, Y); });
      var door = doors.filter(function (d) { return X > d[0] && X < d[1] && Y > 5.4; })[0];
      if (door) {
        var m = (door[0] + door[1]) / 2;
        // a door: two green leaves, each with a tall window
        if (Math.abs(X - m) < 0.6 || X < door[0] + 0.8 || X > door[1] - 0.8) return 'è';
        if (rrect(door[0] + 1.8, 7.4, m - 1, 18, 1)(X, Y) || rrect(m + 1, 7.4, door[1] - 1.8, 18, 1)(X, Y)) win = true;
        else return orb(door[0], 6, 14, 30, METRO)(x, y);
      }
      if (win) return (X + Y * 0.8) % 9 < 2.2 ? 'L' : Y < 10 ? 'i' : 'h';
      if (Y < 4.4) return orb(30, -2, 60, 10, IRON)(x, y);
      if (Y < 19) return orb(30, 4, 70, 24, CREAM)(x, y);
      if (Y < 20.4) return 'C';
      return orb(30, 14, 70, 22, METRO)(x, y);
    }, 'è'));
    parts.push(P('D', or(ell(2.4, 23.6, 1.2, 1.4), ell(93.6, 23.6, 1.2, 1.4)), function (x) { return x < 48 ? 'D' : 'x'; }));
    return parts;
  })()));
  // an orange lifeboat: a white gunwale to stand on, a long curved bow, a
  // rope looped along her side, round windows, a red bottom
  LK.lifeboat = look(build(48, 20, [
    P('m', function (x, y) {
      if (x < 0.2 || x > 47.8) return false;
      var d = Math.min(1, x / 17, (48 - x) / 8), bot = 2.6 + 16.4 * Math.sqrt(Math.max(0, 1 - (1 - d) * (1 - d)));
      return y > 2 && y < bot;
    }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(20, -6, 44, 30, FOX)(x, y);
      // the rope hangs in loops between brass eyes
      var u = (((X - 4) % 8) + 8) % 8 / 8;
      if (X > 4 && X < 44 && Math.abs(Y - (4.8 + 2.6 * Math.sin(Math.PI * u))) < 0.7) return 'Y';
      if (Y > 3.6 && Y < 4.6) return 'w';
      if (Y > 15.4) return orb(18, 10, 40, 12, RED)(x, y);
      if (Y > 14.2) return 'w';
      return t;
    }, 'k'),
    P('W', rrect(0.4, 0, 47.6, 3.4, 1.4), orb(14, -1, 30, 6, SNOW), '2'),
    P('C', or(ell(4, 4.6, 0.9, 0.9), ell(12, 4.6, 0.9, 0.9), ell(20, 4.6, 0.9, 0.9), ell(28, 4.6, 0.9, 0.9), ell(36, 4.6, 0.9, 0.9), ell(44, 4.6, 0.9, 0.9))),
    P('C', or(ell(16, 10.4, 2.4, 2.4), ell(24, 10.4, 2.4, 2.4), ell(32, 10.4, 2.4, 2.4)), function (x, y) {
      // brass-rimmed round windows
      var dx = (x + 0.5 - 16) % 8, dy = y + 0.5 - 10.4;
      return dx * dx + dy * dy < 2.2 ? (dx + dy < 0 ? 'L' : 'M') : 'C';
    }, 'A')
  ]));
  // one sail of a windmill: the long whip on top, a ladder of bars and
  // rails, canvas spread in the cells over most of it, the rest open
  LK.sail = look(build(48, 12, [
    P('Y', rrect(2, 2, 34, 9.8, 0.4), function (x, y) { return orb(6, 1, 34, 9, CREAM)(x, y); }),
    P('U', function (x, y) {
      if (rrect(0.4, 0, 47.6, 3, 1.2)(x, y) || rrect(1.4, 9.2, 46.6, 11.6, 1)(x, y)) return true;
      if (y < 2 || y > 10) return false;
      return ((x - 1.6) % 4.8 + 4.8) % 4.8 < 1.2 || x > 45.6;
    }, function (x, y) {
      return y + 0.5 < 3 ? orb(10, -1, 40, 6, WOOD)(x, y) : orb(10, 4, 40, 10, 'STTUV')(x, y);
    })
  ]));
  // a teacup from the spinning-teacup ride: a wide rim to stand on, a
  // round bowl on a gold foot, a saucer, a curly handle; dots in a second pastel
  var teacup = function (W, tone, dots, wheel) {
    var cx = W / 2, rx = W / 2 - 3, top = wheel ? 8 : 0, H = top + 24;
    var parts = [
      P(tone.charAt(2), ell(cx, H - 2.6, W / 2 - 3, 2.6), orb(cx - 6, H - 4, W / 2, 4, tone), tone.charAt(0)),
      P('C', rrect(cx - 7, H - 7, cx + 7, H - 3.6, 1.2), orb(cx - 4, H - 7, 8, 4, GOLD), 'A'),
      P(tone.charAt(2), function (x, y) { return x > W - 7.4 && but(ell(W - 4.6, top + 7.8, 3.6, 4.4), ell(W - 4.6, top + 7.8, 1.6, 2.4))(x, y); }, orb(W - 6, top + 5, 5, 6, tone), tone.charAt(0)),
      P(tone.charAt(2), both(ell(cx, top + 1.6, rx, 17.4), function (x, y) { return y > top + 1; }), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(cx - rx * 0.4, top - 2, rx * 1.2, 18, tone)(x, y);
        // polka dots in rows
        var row = Math.round((Y - top - 6) / 5), dx = ((X - cx + (row % 2) * 3.5 + 70) % 7) - 3.5, dy = Y - (top + 6 + row * 5);
        return row >= 0 && row < 3 && dx * dx + dy * dy < 3.3 ? dots : t;
      }, tone.charAt(0)),
      P('C', rrect(0.6, top, W - 0.6, top + 3, 1.4), function (x, y) { return y + 0.5 > top + 2.2 ? 'B' : orb(cx - 8, top - 1, W / 2, 4, GOLD)(x, y); }, 'A')
    ];
    // the ride's wheel in the middle of the cup, for spinning it
    if (wheel) parts.unshift(P('O', rrect(cx - 0.8, 3, cx + 0.8, top + 1, 0.4), null, 'N'), P('C', but(ell(cx, 3.6, 4.6, 2.2), ell(cx, 3.6, 2.6, 1)), orb(cx - 2, 2, 5, 3, GOLD), 'A'));
    return build(W, Math.ceil(H), parts);
  };
  LK.teacup = look(teacup(48, PINK, 'w'));

  /* A carousel horse on its twisted brass pole: white, prancing, a gold
     mane and tail, a red saddle and blanket, a breast-collar of roses.
     S is the saddle's top (where Bonnie stands); the pole runs from the
     top of the sprite to H, finished with a brass knob at each end, or
     planted in a round base when it's scenery. */
  var carousel = function (S, H, base) {
    var POLE = function (x, y) { return Math.floor(x * 0.7 + y * 0.5) % 3 === 0 ? 'B' : orb(15, 0, 4, 60, GOLD)(x, y); };
    var parts = [P('C', or(rrect(14.6, 1.6, 17.8, H - 2.4, 0.8), ell(16.2, 2.2, 2.4, 2.1), base ? ell(16.2, H - 2.4, 9.4, 2.4) : ell(16.2, H - 2.2, 2.4, 2.1)), function (x, y) {
      if (base && y + 0.5 > H - 4.8) return orb(10, H - 6, 14, 5, GOLD)(x, y);
      return y + 0.5 < 4.4 || (!base && y + 0.5 > H - 4.2) ? orb(15, 0.6, 3, 3, GOLD)(x, y) : POLE(x, y);
    }, 'A')];
    var hoof = function (pts, far) {
      var last = pts[pts.length - 1], prev = pts[pts.length - 2];
      return [P('W', limb(pts, 1.5), orb(pts[0][0] - 2, pts[0][1], 5, 8, far ? '2211W' : SNOW), '2'),
        P('C', cap(prev[0] + (last[0] - prev[0]) * 0.7, prev[1] + (last[1] - prev[1]) * 0.7, last[0], last[1], 1.5), null, 'A')];
    };
    parts = parts.concat(hoof([[24, S + 10.6], [27.4, S + 15], [30.2, S + 18.4]], true), hoof([[9, S + 10], [5.6, S + 13.6], [7.6, S + 17.2]], true));
    parts.push(P('C', limb([[27, S + 3], [30.4, S + 7], [30, S + 12], [28, S + 16]], 1.7), function (x, y) { return Math.floor(y * 0.6 + x * 0.3) % 2 ? orb(27, S + 4, 5, 10, GOLD)(x, y) : 'B'; }, 'A'));
    parts = parts.concat(hoof([[21.6, S + 11], [24.4, S + 16.4], [27.2, S + 20.6]]), hoof([[11.6, S + 11], [10, S + 16], [8.6, S + 20.6]]));
    parts.push(
      P('W', or(rrect(6, S + 1.2, 28, S + 12.4, 5.4), cap(9.6, S + 5, 6.6, S - 5.6, 3.4)), orb(12, S - 2, 18, 14, SNOW), '2'),
      P('W', cap(7.2, S - 8.2, 2.4, S - 4.4, 2.5), orb(4, S - 9, 6, 5, SNOW), '2'),
      P('W', tri(6.6, S - 9.4, 8.4, S - 13.6, 9.6, S - 8.6), orb(7, S - 12, 3, 3, SNOW), '2'),
      P('C', limb([[8.6, S - 10.4], [11.2, S - 6.6], [10.8, S - 3.4], [12.8, S - 0.4]], 1.6), function (x, y) { return Math.floor(y * 0.6 - x * 0.3) % 2 ? orb(8, S - 10, 6, 10, GOLD)(x, y) : 'B'; }, 'A'),
      // the saddle and its blanket, gold-edged with a heart
      P('x', rrect(10.4, S + 1, 21.8, S + 7.8, 1.4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        if (X < 11.6 || X > 20.6 || Y > S + 6.8) return 'C';
        return orb(13, S, 10, 8, RED)(x, y);
      }, 'u'),
      P('x', rrect(11.4, S, 20.8, S + 2.6, 1.2), orb(13, S - 1, 8, 4, RED), 'u'),
      P('x', cap(2.8, S - 7, 7.8, S - 9.6, 0.6), null, 'u')
    );
    var st = [[3, S - 9, EYE_S], [1, S - 5, ['G']], [14, S + 3, ['D.D', 'DDC', '.C.']]];
    // roses on the breast-collar
    [[7.6, S + 2.6, 'x'], [8.6, S + 5, 'r'], [10, S + 7.2, 'x']].forEach(function (r) { st.push([Math.round(r[0]), Math.round(r[1]), ['.' + r[2] + '.', r[2] + 'w' + r[2], '.' + r[2] + '.']]); });
    return build(32, H, parts, st);
  };
  LK.horse = look(carousel(14, 44), 7);

  // a parade float: a deck with a gold rail, a pleated skirt hung with
  // flowers and ribbons, wheels peeping out below, and a crown on top
  LK.float = look(build(80, 44, (function () {
    var deck = 12, parts = [];
    [12, 30, 50, 68].forEach(function (wx) { parts.push(O(wx, 40.6, 3.2, 3.2, INK, 'f')); });
    parts.push(P('r', function (x, y) {
      if (y < deck + 2 || x < 1.2 || x > 78.8) return false;
      if (y < 37) return rrect(1.2, deck + 2, 78.8, 37, 2.4)(x, y);
      // a scalloped hem
      var c = Math.floor(x / 4) * 4 + 2; return ell(c, 37, 2.2, 2.4)(x, y);
    }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(24, deck, 60, 30, PINK)(x, y);
      if (Y > 36.4) return orb(24, 36, 60, 6, GOLD)(x, y);
      // ribbon swags between gold rosettes
      for (var k = 0; k < 5; k++) {
        var x0 = 4 + k * 18, u = (X - x0) / 18;
        if (u >= 0 && u <= 1 && Math.abs(Y - (21.6 + 5.4 * Math.sin(Math.PI * u))) < 1.1) return orb(30, 18, 60, 14, '_|??/')(x, y);
      }
      return Math.floor(X / 4) % 2 ? step(PINK, t, -1) : t;
    }, 'p'));
    // gold rosettes where the ribbons meet
    [4, 22, 40, 58, 76].forEach(function (rx) { parts.push(P('C', but(ell(rx, 21.4, 2.4, 2.4), ell(rx, 21.4, 0.9, 0.9)), orb(rx - 1, 20, 3, 3, GOLD), 'A')); });
    // the crown, sitting on the deck
    parts.push(P('C', or(rrect(28.4, 6.6, 51.6, deck + 0.6, 1.2), tri(28.4, 8, 30.6, 3, 36.4, 8), tri(34.6, 8, 40, 2, 45.4, 8), tri(43.6, 8, 49.4, 3, 51.6, 8),
      ell(30.4, 2.8, 1.6, 1.6), ell(40, 1.8, 1.7, 1.7), ell(49.6, 2.8, 1.6, 1.6)), function (x, y) {
      return y + 0.5 > 6.6 && y + 0.5 < 7.8 ? 'D' : orb(34, 2, 16, 10, GOLD)(x, y);
    }, 'A'));
    parts.push(P('C', rrect(0.6, deck, 79.4, deck + 3, 1.4), function (x, y) { return y + 0.5 > deck + 2.2 ? 'B' : orb(20, deck - 2, 60, 5, GOLD)(x, y); }, 'A'));
    // a garland of flowers along the top of the skirt
    var garland = [];
    for (var gk = 0; gk < 13; gk++) garland.push([4 + gk * 6, 17 + (gk % 2 ? 0.6 : -0.4), ['x', 'w', 'D'][gk % 3]]);
    garland.forEach(function (g) { parts.push(P(g[2], bloom(g[0], g[1], 5, 1.2, 1.3, 1, -Math.PI / 2), g[2] === 'w' ? orb(g[0] - 1, g[1] - 1, 3, 3, SNOW) : g[2] === 'x' ? orb(g[0] - 1, g[1] - 1, 3, 3, RED) : orb(g[0] - 1, g[1] - 1, 3, 3, GOLD), g[2] === 'w' ? '2' : g[2] === 'x' ? 'u' : 'A')); });
    return parts;
  })(), [[31, 9, ['x']], [35, 9, ['|']], [39, 9, ['xx']], [44, 9, ['|']], [48, 9, ['x']], [29, 2, ['w']], [39, 1, ['w']], [49, 2, ['w']]]), 6);

  /* ---- the Big Trip's scenery ------------------------------------------- */
  var GREEN = 'HHIJJ', MARBLE = 'PQRRw', STONE = 'OPQRR';
  // weave: alternate tones in a basket-weave of little blocks
  var weave = function (t, cx, cy, rx, ry) {
    var lit = orb(cx, cy, rx, ry, t);
    return function (x, y) { var c = lit(x, y); return (Math.floor(x / 2) + Math.floor(y / 2)) % 2 ? step(t, c, -1) : c; };
  };

  // Ferry: a ship's mooring bollard, two stout iron posts on a plate with
  // a rope wound round them in a figure of eight
  var ROPE = function (x, y) { return (x + y) % 3 ? 'V' : 'U'; };
  D.bollard = build(20, 18, [
    P('g', rrect(0.6, 14.4, 19.4, 17.6, 1.2), orb(6, 13, 12, 6, INK), 'f'),
    P('g', or(rrect(2.4, 5, 7.6, 15, 1.4), rrect(12.4, 5, 17.6, 15, 1.4)), function (x, y) { return orb(x < 10 ? 4 : 14, 6, 4, 10, INK)(x, y); }, 'f'),
    P('g', or(ell(5, 5, 4, 2), ell(15, 5, 4, 2)), function (x, y) { return orb(x < 10 ? 3.6 : 13.6, 3.6, 4, 2.6, INK)(x, y); }, 'f'),
    P('V', or(cap(3.6, 9, 16.4, 11.6, 1.1), cap(3.6, 11.6, 16.4, 9, 1.1), ell(3.6, 10.3, 1.6, 2.1), ell(16.4, 10.3, 1.6, 2.1)), ROPE, 'T'),
    P('V', limb([[16.6, 11], [18.6, 13], [18.8, 17.4]], 1.1), ROPE, 'T')
  ]);

  // Ferry: a lifebuoy ring hung on a white post
  D.lifering = build(20, 32, [
    P('W', or(rrect(8.4, 2.4, 11.6, 31.6, 0.8), rrect(6, 30, 14, 31.8, 0.8)), orb(9, 8, 3, 24, SNOW), '2'),
    P('x', rrect(7.2, 0.6, 12.8, 3.4, 1), orb(8, 0, 5, 3, RED), 'u'),
    P('x', but(ell(10, 15, 8.8, 8.8), ell(10, 15, 4, 4)), function (x, y) {
      var dx = x + 0.5 - 10, dy = y + 0.5 - 15, q = (Math.atan2(dy, dx) + Math.PI / 4) / (Math.PI / 2) + 8, fr = q % 1;
      // rope bound round it where the colours meet
      if (fr < 0.08 || fr > 0.92) return (x + y) % 2 ? 'V' : 'U';
      return orb(7, 10, 10, 10, Math.floor(q) % 2 ? SNOW : RED)(x, y);
    }, 'u')
  ]);

  // Fields: a tall sunflower, its face to the sun, two big leaves
  D.sunflower = build(20, 60, [
    P('I', limb([[10.6, 60], [11, 44], [10.2, 28], [10, 16]], 1.8), orb(9, 36, 3, 24, GREEN), 'H'),
    P('I', or(petal(10.8, 44, -2.75, 5.4, 5.8, 2.8), petal(10.4, 32, -0.4, 5.2, 5.6, 2.7)), function (x, y) {
      // each leaf with a paler vein down its middle
      var t = orb(8, 34, 10, 14, GREEN)(x, y);
      return Math.abs((y + 0.5) - (44 - (10.8 - x - 0.5) * 0.4)) < 0.5 && x < 10 || Math.abs((y + 0.5) - (32 + (x + 0.5 - 10.4) * 0.42)) < 0.5 && x > 11 ? 'J' : t;
    }, 'H'),
    P('C', bloom(10, 10.4, 13, 6.2, 3.4, 1.7, 0.1), orb(8, 7, 11, 11, GOLD), 'A'),
    P('T', ell(10, 10.4, 4.6, 4.6), function (x, y) {
      var t = orb(9, 9, 5, 5, 'STTUV')(x, y);
      return (x * 3 + y * 5) % 4 === 0 ? step('STTUV', t, -1) : t;
    }, 'S')
  ], [[8, 8, ['V']]]);

  // Fields: a round hay bale on its side, rolled up in a spiral
  D.haybale = build(32, 24, [
    P('û', rrect(9, 1, 31, 23.6, 6), function (x, y) {
      var t = orb(16, 4, 22, 22, STRAW)(x, y);
      // straw strands round its curve, and a band of twine
      if (x === 22 || x === 23) return 'v';
      return (x * 7 + y * 3) % 11 === 0 || (x + Math.floor(y / 3)) % 5 === 0 ? step(STRAW, t, -1) : t;
    }, 'ù'),
    P('û', ell(10.4, 12.2, 9.6, 11.4), function (x, y) {
      var t = orb(7, 8, 11, 13, STRAW)(x, y);
      return spiral(10.4, 12.2, 0.6)(x, y) ? step(STRAW, t, -2) : t;
    }, 'ù')
  ], [[14, 0, ['F.F', '.F.']], [26, 0, ['.F', 'F.']]]);

  // Village: an old Paris street lamp, a glass lantern on a fluted post
  D.lamppost = build(18, 64, [
    P('é', or(rrect(7.4, 18, 10.6, 56, 1), rrect(5.4, 52, 12.6, 60, 1.6), rrect(3.6, 59, 14.4, 63.6, 1.4), rrect(2.4, 17.6, 15.6, 19.6, 0.8), ell(2.6, 18.6, 1.4, 1.4), ell(15.4, 18.6, 1.4, 1.4),
      rrect(6.6, 30, 11.4, 32, 0.8), rrect(6.6, 44, 11.4, 46, 0.8), rrect(7.4, 14.4, 10.6, 18, 0.6)), function (x, y) {
      var t = orb(7, 30, 6, 40, 'èèéêë')(x, y);
      // the post is fluted: a lit groove down it
      return y > 19 && y < 52 && x === 8 ? 'ê' : t;
    }, 'è'),
    P('7', function (x, y) { var u = (y - 4.6) / 10; return y > 4.6 && y < 14.8 && Math.abs(x - 9) < 5.4 - u * 2; }, function (x, y) {
      // four panes in a dark frame
      return x === 8 || x === 9 || y === 9 ? 'é' : orb(7, 6, 6, 10, '67788')(x, y);
    }, 'è'),
    P('é', or(ell(9, 4.6, 6.6, 2.4), tri(4, 4.6, 9, 0.8, 14, 4.6), ell(9, 1.6, 1.3, 1.3), rrect(5, 14.2, 13, 15.8, 0.6)), orb(7, 2, 7, 5, 'èèéêë'), 'è')
  ]);

  // Village: a round bistro table and two chairs; a coffee and a croissant
  var chair = function (s) {
    var X = function (x) { return s > 0 ? x : 44 - x; };
    return [
      P('U', or(cap(X(2.4), 6, X(2.4), 25.4, 0.8), cap(X(9.6), 17, X(10.6), 25.4, 0.8), cap(X(4.4), 17, X(3.6), 25.4, 0.8)), orb(X(3), 8, 4, 18, WOOD), 'S'),
      P('û', rrect(Math.min(X(1.6), X(11.4)), 15.6, Math.max(X(1.6), X(11.4)), 17.8, 1), weave(STRAW, X(5), 14, 8, 4), 'ù'),
      P('û', rrect(Math.min(X(1.4), X(3.8)), 4.6, Math.max(X(1.4), X(3.8)), 15.6, 1.2), weave(STRAW, X(2), 6, 4, 10), 'ù')
    ];
  };
  D.cafetable = build(44, 26, chair(1).concat(chair(-1)).concat([
    P('g', or(rrect(21, 10, 23, 23.6, 0.6), ell(22, 24.6, 6.4, 1.4)), orb(20, 14, 4, 12, INK), 'f'),
    P('R', rrect(11, 8.2, 33, 11, 1.4), orb(16, 6, 20, 5, MARBLE), 'P'),
    P('w', or(rrect(15.4, 4.6, 19.4, 8.6, 1), ell(17.4, 8.2, 3.4, 0.9)), orb(16, 4, 4, 5, SNOW), '2'),
    P('â', or(ell(26.4, 7.2, 3.6, 1.6), ell(24, 7.8, 1.4, 1), ell(28.8, 7.8, 1.4, 1)), orb(25, 6, 4, 3, CRUST), 'à')
  ]), [[16, 5, ['TT']], [20, 5, ['w']]]);

  // Village: a window box of red geraniums
  D.flowerbox = build(32, 20, [
    P('<', or(ell(6, 9.6, 5, 3.4), ell(13, 8.6, 5, 3.4), ell(20, 9, 5, 3.4), ell(26.4, 9.6, 5, 3.4)), orb(12, 6, 18, 6, LEAF), '('),
    P('ô', or(rrect(1.6, 11.4, 30.4, 19.6, 1.4), rrect(0.6, 10.2, 31.4, 13, 1)), function (x, y) {
      var t = orb(10, 9, 24, 12, TERRA)(x, y);
      return y > 12 && (x === 8 || x === 16 || x === 24) ? step(TERRA, t, -1) : t;
    }, 'ó')
  ].concat([[6.6, 5.4], [13, 3.6], [19.6, 4.6], [26, 5.6]].map(function (c) {
    return P('x', ell(c[0], c[1], 3.4, 3), function (x, y) { var t = orb(c[0] - 1, c[1] - 1, 3.4, 3, RED)(x, y); return (x + y) % 3 === 0 ? step(RED, t, 1) : t; }, 'u');
  })));

  // Village: a little stone fountain, its water splashing two ways
  D.fountain = [0, 1].map(function (f) {
    var j = f ? 1.4 : 0, water = '1MLww';
    return build(48, 40, [
      // a jet from the top, and water spilling over the bowl's rim into the basin
      P('M', or(cap(24, 2.4 + j, 24, 7, 1.7), ell(24, 2 + j, 3, 1.6), limb([[16, 12], [13.4 - j * 0.4, 14.6], [12.2 - j * 0.4, 20], [11.8, 29]], 1.8), limb([[32, 12], [34.6 + j * 0.4, 14.6], [35.8 + j * 0.4, 20], [36.2, 29]], 1.8)),
        function (x, y) { return (y + j * 2) % 4 === 0 ? 'w' : x % 3 === 0 ? 'L' : 'M'; }, '2'),
      P('Q', or(rrect(21.6, 14, 26.4, 31, 1), ell(24, 6.4, 1.6, 2)), orb(22, 10, 5, 22, STONE), 'O'),
      P('Q', both(ell(24, 12.4, 9.4, 4.4), function (x, y) { return y > 11.6; }), orb(20, 10, 10, 6, STONE), 'O'),
      P('M', ell(24, 12.2, 8.8, 1.2), orb(20, 11, 9, 2, water), '1'),
      P('Q', or(rrect(1, 29.6, 47, 39.6, 3), ell(24, 30.6, 23, 2.8)), function (x, y) {
        var t = orb(14, 26, 34, 16, STONE)(x, y);
        // stone blocks round the basin
        return y > 32 && ((x + (y > 35 ? 4 : 0)) % 8 === 0 || y === 35) ? step(STONE, t, -1) : t;
      }, 'O'),
      P('M', ell(24, 30.4, 20.6, 1.8), orb(18, 29, 22, 3, water), '1')
    ], f ? [[21, 2, ['w']], [26, 0, ['w']], [9, 26, ['w']], [38, 27, ['w']]] : [[20, 0, ['w']], [27, 2, ['w']], [14, 27, ['w']], [34, 26, ['w']]]);
  });

  // Bakery: a wicker basket of round loaves under a gingham cloth
  D.breadbasket = build(28, 18, [
    O(7.4, 8.6, 5, 4.6, CRUST, 'à'), O(20.6, 8.6, 5, 4.6, CRUST, 'à'), O(14, 6.6, 5.8, 5.2, CRUST, 'à'),
    P('û', or(rrect(1.4, 9.6, 26.6, 17.6, 3), rrect(0.6, 9, 27.4, 11.4, 1.2)), weave(STRAW, 9, 7, 20, 12), 'ù'),
    P('x', tri(1, 9.4, 9, 9.4, 3, 16.6), function (x, y) { return (Math.floor(x / 2) + Math.floor(y / 2)) % 2 ? 'w' : 'x'; }, 'u')
  ], [[12, 4, ['ãã..', '..ãã']], [5, 7, ['ã.', '.ã']], [19, 7, ['ã.', '.ã']]]);

  // Bakery: baguettes standing up in a tall basket
  D.baguettes = build(20, 36, [
    P('â', cap(5.4, 24, 3.6, 3.6, 2.2), orb(3, 5, 5, 20, CRUST), 'à'),
    P('â', cap(13.6, 24, 16.2, 6.4, 2.2), orb(14, 8, 5, 20, CRUST), 'à'),
    P('â', cap(9.4, 24, 9.6, 1.4, 2.3), orb(8, 3, 5, 20, CRUST), 'à'),
    P('û', or(rrect(3.4, 18.6, 16.6, 35.6, 2.4), rrect(2.6, 18, 17.4, 20.6, 1.2)), weave(STRAW, 7, 18, 12, 18), 'ù')
  ], [[3, 6, ['o', '.o']], [3, 11, ['o', '.o']], [8, 4, ['o', 'o']], [8, 9, ['o', 'o']], [8, 14, ['o', 'o']], [15, 9, ['o.', '.o']], [14, 14, ['o.', '.o']]]);

  // Bakery: a fancy layered cake on a stand, cherries on top
  D.cake = build(28, 40, [
    P('R', or(ell(14, 33.4, 13.2, 1.8), rrect(12.4, 33, 15.6, 38, 0.6), ell(14, 38.6, 6, 1.4)), orb(10, 32, 14, 6, MARBLE), 'P'),
    P('r', rrect(2.6, 22.4, 25.4, 33, 2), orb(9, 22, 20, 12, PINK), 'p'),
    P('Y', rrect(5.4, 13.4, 22.6, 22.8, 2), orb(10, 13, 16, 10, CREAM), 'Z'),
    P('r', rrect(8.4, 6, 19.6, 13.8, 2), orb(11, 5, 10, 8, PINK), 'p'),
    // icing dripping over each tier's edge
    P('w', or(
      function (x, y) { return x > 2.6 && x < 25.4 && y > 22.4 && y < 24.4 + Math.max(0, Math.sin(x * 1.3)) * 1.6; },
      function (x, y) { return x > 8.4 && x < 19.6 && y > 6 && y < 7.8 + Math.max(0, Math.sin(x * 1.5)) * 1.4; }), orb(10, 20, 20, 20, SNOW), '2'),
    O(11.4, 4, 2.2, 2.1, RED, 'u'), O(16.4, 4.2, 2.2, 2.1, RED, 'u'),
    P('I', or(cap(11.6, 2, 13, 0.6, 0.5), cap(16.2, 2.2, 15, 0.6, 0.5)), null, 'H')
  ], [[7, 15, ['r.r.r.r.r.r']], [5, 27, ['C...C...C...C...C']], [6, 30, ['..x...x...x...x']]]);

  // Cheese caves: a wedge of cheese, holes and a rind
  D.cheesewedge = build(28, 18, [
    P('D', or(tri(0.6, 17.6, 27.4, 6.4, 27.4, 17.6), tri(0.6, 17.6, 27.4, 6.4, 22.4, 2.4)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // the rind down the back, the top face catching the light, the cut face in shade
      if (X > 25.8) return orb(26, 6, 3, 12, 'ABBCC')(x, y);
      var onTop = (Y - 17.6) * (27.4 - 0.6) - (X - 0.6) * (6.4 - 17.6) < 0;
      if (onTop) return firstOf([dent(16, 7.6, 1.6, 0.8, 'BCF')], x, y) || orb(12, 4, 16, 8, 'CDDFF')(x, y);
      return firstOf([dent(12.6, 15, 1.6, 1.4, 'BCD'), dent(19.6, 12.2, 2, 1.7, 'BCD'), dent(23.4, 15.6, 1.3, 1.1, 'BCD')], x, y) || orb(14, 10, 18, 10, 'BCCDD')(x, y);
    }, 'A')
  ]);

  // Rooftops: a chimney stack crowned with terracotta pots
  D.chimneypot = build(30, 36, [
    P('ô', or(rrect(4, 3.6, 8.8, 13, 0.6), rrect(10.4, 1.4, 15.2, 13, 0.6), rrect(16.8, 4.6, 21.6, 13, 0.6), rrect(22.6, 6.6, 26.6, 13, 0.6),
      rrect(3.4, 3, 9.4, 4.8, 0.6), rrect(9.8, 0.6, 15.8, 2.6, 0.6), rrect(16.2, 4, 22.2, 5.8, 0.6), rrect(22, 6, 27.2, 7.6, 0.6)), function (x, y) {
      var k = x < 9.6 ? 6 : x < 16 ? 12.6 : x < 22 ? 19 : 24.6;
      return orb(k - 1.6, 4, 3.4, 14, TERRA)(x, y);
    }, 'ó'),
    P('Q', rrect(1.4, 12.2, 28.6, 15.6, 1), orb(10, 11, 20, 5, STONE), 'O'),
    P('Y', rrect(3, 15, 27, 35.6, 1), function (x, y) {
      var t = orb(10, 14, 22, 24, 'VZZYY')(x, y);
      // courses of dressed stone, staggered
      if ((y - 15) % 5 === 4) return step('VZZYY', t, -1);
      return (x + (Math.floor((y - 15) / 5) % 2) * 4) % 8 === 0 ? step('VZZYY', t, -1) : t;
    }, 'V')
  ]);

  // Metro: an Art Nouveau lamp on a stem that curls like a plant, an amber
  // bud of a light, and a round sign with an M on it (our own, no logo)
  D.metrosign = build(24, 64, [
    P('é', or(limb([[13, 63], [13.2, 44], [12.6, 26], [10.6, 14], [7.6, 8.4], [4.6, 7.6], [3.2, 9.4]], 1.4), petal(13, 50, -2.5, 3, 3.6, 1.4), petal(13, 46, -0.6, 3, 3.6, 1.4),
      rrect(9.4, 57, 16.6, 63.6, 1.6), ell(13, 63, 6.4, 1.2)), orb(10, 30, 8, 40, 'èèéêë'), 'è'),
    P('6', ell(3.6, 13, 2.8, 3.4), orb(2.6, 11.6, 3, 4, '45678'), '4'),
    P('é', rrect(12.6, 29.4, 16, 31, 0.6), null, 'è'),
    P('Y', ell(17, 30.2, 6.2, 6.2), function (x, y) {
      var dx = x + 0.5 - 17, dy = y + 0.5 - 30.2;
      return dx * dx + dy * dy > 4.6 * 4.6 ? orb(15, 28, 7, 7, 'èéêëì')(x, y) : orb(15, 28, 6, 6, CREAM)(x, y);
    }, 'è')
  ], [[14, 28, ['è...è', 'èè.èè', 'è.è.è', 'è...è', 'è...è']]]);

  // the Park: a teacup ride car standing about, its little wheel in the
  // middle; and a carousel horse planted on its pole
  D.teacup = teacup(40, MINT, 's', true);
  D.carouselhorse = carousel(24, 60, true);

  /* ==========================================================================
     HOLIDAY! — the fourth land, levels 31–35: the waterpark, surfing and a
     bike ride at Hossegor, a day at the historical park (knights, falcons,
     a Viking longship, chariots), and Saint-Malo, the walled corsair city
     by the sea. Its locals, the medals hidden in every level, the things
     Bonnie bounces on and rides, and its scenery.
     ========================================================================== */
  /* Four more ramps, deep to shine, in accented letters like the Big
     Trip's (so the same UTF-8 rule holds): a summer-sky blue for pools,
     boards and huts; an indigo and a violet, to finish the rainbow of
     musical blocks; and the deep blue-green of the Landes pines. */
  var SKY = ramp('ÈÉÊËÌ', ['#0e4a8a', '#1c74c8', '#3aa0f0', '#86cdfc', '#e0f4ff']);
  var INDIGO = ramp('ÒÓÔÕÖ', ['#221a64', '#3a2c9c', '#5646d0', '#8a7cf2', '#d4ceff']);
  var VIOLET = ramp('ÙÚÛÜÝ', ['#561a74', '#8a2cb0', '#b450dc', '#d894f2', '#f6e0ff']);
  var PINE = ramp('íîïðñ', ['#103a2a', '#1a5a3a', '#2c7a48', '#58a058', '#b4dc94']);
  // a whole part turned by a about (px, py): its shape and its texture
  var turnPart = function (part, px, py, a) { return a ? P(part.c, turned(part.f, px, py, a), part.tex && turned(part.tex, px, py, a), part.line) : part; };
  var turnStamps = function (st, px, py, a) { return a ? st.map(function (s) { var q = turnedAt(s[0], s[1], px, py, a); return [q[0], q[1], s[2]]; }) : st; };
  // squeezed across about cx, as a coin is when it turns edge-on
  var squeeze = function (f, cx, sx) { return function (x, y) { return f(cx + (x - cx) / sx, y); }; };
  // a tapering stroke along pts, r0 thick at its root and r1 at its tip
  var taper = function (pts, r0, r1) {
    var n = pts.length - 1, segs = [];
    for (var i = 0; i < n; i++) segs.push(cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r0 + (r1 - r0) * (i + 0.5) / n));
    return function (x, y) { return segs.some(function (f) { return f(x, y); }); };
  };
  // a wheel side on: a tyre, a rim, n spokes and a hub; the gaps are open
  var wheel = function (cx, cy, R, n, rimT, hubT, spokeT, far) {
    var shape = function (x, y) {
      var dx = x - cx, dy = y - cy, r = Math.sqrt(dx * dx + dy * dy);
      if (r > R) return false;
      if (r > R - 2.6 || r < 2.6) return true;
      var a = Math.atan2(dy, dx) * n / (Math.PI * 2);
      return Math.abs(a - Math.round(a)) * Math.PI * 2 / n * r < 1.5;
    };
    return P(rimT.charAt(2), shape, function (x, y) {
      var dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.sqrt(dx * dx + dy * dy);
      if (r > R - 1.2) return far ? rimT.charAt(0) : orb(cx - 2, cy - 2, R, R, IRON)(x, y);
      if (r > R - 2.6) return orb(cx - R * 0.4, cy - R * 0.4, R, R, rimT)(x, y);
      if (r < 2.6) return orb(cx - 1, cy - 1, 2.6, 2.6, hubT)(x, y);
      return orb(cx - 2, cy - 2, R, R, spokeT)(x, y);
    }, rimT.charAt(0));
  };

  /* Knight: a little tin knight from the historical park, all round
     armour, a red plume, his visor up so his face shows, a red tunic and
     a blue shield with a gold star. Two walking frames, and stunned:
     sat down with a bump, legs out, shield dropped, helmet knocked
     crooked, eyes in dizzy swirls and stars going round (he takes two
     stomps). Comic, never scary. */
  // his shield: blue, a gold rim, a gold star; its top-left corner at
  // (x0, y0), turned by a about its middle
  var knightShield = function (x0, y0, a) {
    var c = x0 + 4.2, hw = 4.2, px = c, py = y0 + 6;
    var shape = function (x, y) {
      var yy = y - y0;
      if (yy < 0 || Math.abs(x - c) > hw) return false;
      return yy < 5 || Math.abs(x - c) < hw * Math.max(0, 1 - Math.pow((yy - 5) / 6.8, 1.6));
    };
    return [turnPart(P('|', shape, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (!shape(X - 1.1, Y) || !shape(X + 1.1, Y) || !shape(X, Y - 1.1) || !shape(X, Y + 1.1)) return orb(x0 + 2, y0, 6, 8, GOLD)(x, y);
      return orb(x0 + 2.4, y0 + 2, 7, 10, COAT)(x, y);
    }, ';'), px, py, a),
    turnPart(P('C', starShape(c, y0 + 5.4, 3.3, 1.45, -Math.PI / 2), starTex(c, y0 + 5.4, -Math.PI / 2, GOLD), 'A'), px, py, a)];
  };
  // his helmet, centred on (hx, hy), with the face showing through its
  // open front and the visor lifted; its plume curls back over the top
  var knightHelm = function (hx, hy) {
    return [
      P('x', or(ell(hx + 1.6, hy - 6.8, 2.4, 2.2), ell(hx + 4.6, hy - 7.8, 2.6, 2.2), ell(hx + 7.8, hy - 7.2, 2.4, 2.2), ell(hx + 10, hy - 5, 1.9, 2.1), ell(hx + 10.8, hy - 2.4, 1.4, 1.8)),
        function (x, y) { var t = orb(hx + 2, hy - 9, 9, 5, RED)(x, y); return (x + y) % 3 === 0 ? step(RED, t, -1) : t; }, 'u'),
      P('Q', rrect(hx - 7.4, hy - 6.4, hx + 7.4, hy + 6.6, 5.6), function (x, y) {
        // a ridge over the crown, catching the light
        var t = orb(hx - 3, hy - 4, 11, 11, IRON)(x, y);
        return x === Math.round(hx + 1) && y < hy - 1 ? step(IRON, t, 1) : t;
      }, 'N'),
      P('Y', rrect(hx - 8.2, hy - 2.4, hx + 2.4, hy + 5.4, 2.4), orb(hx - 5, hy - 2, 8, 7, SKIN), 'V'),
      P('P', rrect(hx - 8.6, hy - 5.6, hx + 3, hy - 2.2, 1.4), function (x, y) { return y === Math.round(hy - 4) && x % 2 ? 'N' : orb(hx - 5, hy - 6, 8, 3, IRON)(x, y); }, 'N')
    ];
  };
  var knight = function (mode) {
    var parts = [], st;
    if (mode === 'stun') {
      // the helmet knocked back and crooked; the shield fallen against his back
      var hx = 11.2, hy = 14.2, ha = 0.36, H = function (p) { return turnPart(p, hx, hy + 5, ha); };
      parts = knightShield(14.8, 18.6, -0.36);
      parts.push(
        // the far leg, then the near one, out in front, toes up
        P('O', or(cap(12.6, 28.2, 6.6, 27.6, 1.9), rrect(4.6, 23.6, 7.8, 29.4, 1.6)), orb(7, 25, 6, 5, 'NNOOP'), 'N'),
        O(13.6, 23.4, 6, 5.4, IRON, 'N'),
        P('x', rrect(7.4, 25.6, 19.6, 30.6, 2), orb(10, 26, 9, 5, RED), 'u'),
        P('U', rrect(7.2, 25, 19.8, 26.8, 0.8), function (x) { return x === 10 ? 'C' : 'T'; }, 'S'),
        P('P', or(cap(11.4, 29.6, 4.6, 29.8, 2), rrect(1.4, 25.2, 4.8, 31.6, 1.6)), orb(6, 27, 7, 5, IRON), 'N'),
        P('P', cap(10.2, 21.6, 7.4, 26.2, 1.7), orb(8, 21, 3, 5, IRON), 'N'), O(7.2, 26.6, 1.8, 1.6, IRON, 'N')
      );
      parts = parts.concat(knightHelm(hx, hy).map(H));
      // stars going round his head
      parts.push(P('C', starShape(3.8, 4.6, 3.7, 1.6, -Math.PI / 2), starTex(3.8, 4.6, -Math.PI / 2, 'ABCCD'), 'A'),
        P('C', starShape(19.8, 3.8, 3.5, 1.5, -Math.PI / 2.4), starTex(19.8, 3.8, -Math.PI / 2.4, 'ABCCD'), 'A'));
      var DIZZY = ['.###.', '#...#', '#.#.#', '#.##.', '.#...'];
      st = turnStamps([[Math.round(hx - 7.6), Math.round(hy - 2), DIZZY], [Math.round(hx - 2.6), Math.round(hy - 2), DIZZY], [Math.round(hx - 5), Math.round(hy + 3), ['.#.', '#.#', '.#.']], [Math.round(hx - 0.4), Math.round(hy + 2), ['3']]], hx, hy + 5, ha);
      return build(24, 32, parts, st);
    }
    // walking: one leg forward, one back, his feet in pointed sabatons
    var f = mode, b = f * 0.5, hx2 = 11.4, hy2 = 9.6 - b;
    var leg = function (hipx, fx, far) {
      var t = far ? 'NNOOP' : IRON;
      return [P('O', cap(hipx, 24.6 - b, fx + 0.6, 29.6, 1.9), orb(hipx - 1, 25, 3, 6, t), 'N'), P('O', or(ell(fx, 30.4, 2.6, 1.2), tri(fx - 3.6, 31.6, fx - 1, 29.4, fx + 1.4, 31.6)), orb(fx - 1, 29.6, 3.6, 2, t), 'N')];
    };
    var nf = f ? 15 : 8.4, ff = f ? 9.6 : 15.6, sw = f ? -1.4 : 1.4;
    parts = parts.concat(leg(13.8, ff, true));
    // the far arm swinging behind him
    parts.push(P('O', cap(15.8, 18.6 - b, 18.4 + sw, 22.6 - b, 1.7), orb(16, 18, 3, 5, 'NNOOP'), 'N'), O(18.6 + sw, 23 - b, 1.7, 1.6, 'NNOOP', 'N'));
    parts = parts.concat(leg(10.6, nf));
    parts.push(
      O(12.6, 20.2 - b, 6.2, 5.4, IRON, 'N'),
      P('x', rrect(6.8, 21.6 - b, 18.4, 26.4 - b, 1.6), orb(10, 21, 9, 5, RED), 'u'),
      P('U', rrect(6.6, 21.2 - b, 18.6, 23 - b, 0.8), function (x) { return x === 9 ? 'C' : 'T'; }, 'S')
    );
    parts = parts.concat(knightHelm(hx2, hy2), knightShield(0.6, 15.6 - b, 0));
    st = [[Math.round(hx2 - 7.4), Math.round(hy2 - 2), EYE], [Math.round(hx2 - 2.8), Math.round(hy2 - 2), EYE], [Math.round(hx2 - 5.6), Math.round(hy2 + 3.4), ['#..#', '.##.']], [Math.round(hx2 + 0.6), Math.round(hy2 + 2.4), ['3']]];
    return build(24, 32, parts, st);
  };
  E.knight = { walk: [knight(0), knight(1)], stun: knight('stun') };

  /* Falcon: one of the park's falcons, out on a flight round the crowd:
     warm brown with darker bars, a pale barred chest, the dark
     'moustache' under his eye, a hooked grey beak with a yellow base and
     yellow feet tucked up. Wings up, wings down: long and pointed, dark
     at the tips. */
  /* A falcon's wing, from the shoulder (sx, sy) out along angle a, `len`
     long and `wid` wide: the magpie's wing, but swept to a point, barred
     across and dark at the tip. `back` says which side the trailing edge
     (nicked into feathers) is on; `far` is the wing on the other side. */
  var falconWing = function (sx, sy, a, len, wid, back, far) {
    var ca = Math.cos(a), sa = Math.sin(a), t = far ? 'SSSTT' : WOOD;
    var uv = function (x, y) { var dx = x - sx, dy = y - sy; return [(dx * ca + dy * sa) / len, (-dx * sa + dy * ca) * back / wid]; };
    var half = function (u) { return Math.sin(Math.PI * Math.pow(u, 0.62)); };
    var lit = orb(sx + ca * len * 0.45 - len * 0.15, sy + sa * len * 0.45 - len * 0.15, len * 0.75, len * 0.75, t);
    return P('U', function (x, y) {
      var q = uv(x, y), u = q[0], v = q[1];
      if (u < 0 || u > 1) return false;
      return v > -half(u) * 0.7 && v < half(u) + 0.36 * u * Math.abs(Math.sin(u * Math.PI * 3.5));
    }, function (x, y) {
      var q = uv(x + 0.5, y + 0.5), u = q[0], c = lit(x, y);
      if (u > 0.68) return step(t, c, -2);
      return Math.floor(u * 7) % 2 && u > 0.2 ? step(t, c, -1) : c;
    }, 'S');
  };
  E.falcon = [0, 1].map(function (f) {
    var parts = [];
    if (!f) parts.push(falconWing(17.4, 9.8, -0.86, 10.2, 3.2, 1, true));
    parts.push(
      P('U', or(ell(23.2, 11.4, 4.4, 1.9), tri(18.6, 9.6, 18.6, 13.2, 26, 11.4)), function (x, y) {
        var t = orb(21, 10, 6, 3, WOOD)(x, y);
        // barred, with a pale band at its end
        return x > 26 ? 'Y' : x > 24 ? 'S' : x % 2 ? step(WOOD, t, -1) : t;
      }, 'S'),
      P('C', or(ell(12.4, 14.8, 1.8, 1), ell(15.2, 15, 1.8, 1)), orb(13, 14.4, 4, 2, GOLD), 'A'),
      P('U', ell(14.2, 11.2, 7.2, 3.8), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // the pale chest underneath, barred across
        if (Y > 11.2 + (X - 14) * 0.2) { var c = orb(10, 10, 9, 6, CREAM)(x, y); return y % 2 === 0 && X > 9 && X < 18 ? 'V' : c; }
        return orb(12, 7, 9, 6, WOOD)(x, y);
      }, 'S'),
      P('Y', ell(6.4, 9.2, 4.3, 4), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // a dark cap, a pale cheek, the moustache down from his eye
        if (Y < 7.6 + (X - 6.4) * 0.45) return orb(5, 6, 5, 4, 'SSTTU')(x, y);
        if (Math.abs(X - 5.8 - (Y - 9.8) * 0.3) < 0.9 && Y > 9.2) return 'S';
        return orb(5, 8, 5, 5, CREAM)(x, y);
      }, 'S'),
      P('O', or(tri(0.4, 11.4, 2.8, 8.4, 3.6, 11), ell(2.4, 9.6, 1.5, 1.4)), orb(1.6, 8.8, 2.4, 2.4, IRON), 'N'),
      P('C', ell(3.4, 9.2, 1, 1.1), null, 'A')
    );
    parts.push(f ? falconWing(14, 11.4, 1.02, 9.8, 3.8, -1) : falconWing(14.4, 10.6, -1.2, 11, 3.8, 1));
    return build(28, 20, parts, [[4, 7, EYE_S]]);
  });

  /* Corsair: a little Saint-Malo corsair, a friendly one: a navy-and-white
     striped top, a red spotted bandana knotted at the back, a gold
     earring, brown breeches and boots, and a wooden toy sword held up
     ready. Walking. */
  E.corsair = [0, 1].map(function (f) {
    var b = f * 0.5, nf = f ? 13.4 : 7, ff = f ? 7.6 : 13.6;
    var leg = function (hx, fx, far) {
      var tr = far ? 'SSTTU' : 'STTUV', bt = far ? 'ffggh' : INK;
      return [P('T', cap(hx, 24.6 - b, fx + 0.8, 27.6, 2), orb(hx - 1, 25, 3, 4, tr), 'S'),
        P('g', or(cap(fx + 0.8, 27.2, fx + 0.8, 29.8, 1.7), ell(fx - 0.4, 30.6, 2.6, 1.2)), orb(fx - 1, 28, 3, 3, bt), 'f')];
    };
    var sl = stripedLimb([[14.4, 17.6 - b], [16.6, 21 - b], [16.4 + (f ? -1 : 1), 23 - b]], 1.6, 2, ';;;__', '1122W');
    var parts = [
      // the bandana's knot tails, fluttering out behind
      P('x', or(cap(15.6, 6.2 - b, 20.8, 4.6 - b + f, 1.3), cap(15.6, 7 - b, 20.4, 8.8 - b + f, 1.2)), orb(17, 4, 5, 4, RED), 'u'),
      P('_', sl.f, sl.tex, ';'), O(16.4 + (f ? -1 : 1), 23.4 - b, 1.5, 1.4, SKIN, 'V')
    ].concat(leg(12.4, ff, true), leg(9.4, nf));
    parts.push(
      P('W', rrect(5.4, 15.4 - b, 15.8, 24.8 - b, 3), function (x, y) {
        return Math.floor((y + 0.5 - 15.4 + b) / 2) % 2 ? orb(8, 15, 10, 10, NAVY)(x, y) : orb(8, 15, 10, 10, SNOW)(x, y);
      }, '2'),
      P('g', rrect(5.4, 22.8 - b, 15.8, 24.6 - b, 0.6), function (x) { return x === 8 || x === 9 ? 'C' : 'g'; }, 'f'),
      // his hair, dark curls peeping out at the back
      P('S', or(ell(15.6, 11, 2.4, 2.6), ell(14.6, 13.4, 1.8, 1.8)), orb(14, 10, 3, 3, 'SSTTU'), 'S'),
      O(10.4, 9.8, 6.4, 6, SKIN, 'V'),
      P('x', both(ell(10.4, 9.8, 6.8, 6.4), function (x, y) { return y < 7.2 + (x - 10) * 0.16; }), function (x, y) {
        return (x * 3 + y * 5) % 7 === 0 && y > 3 ? 'z' : orb(8, 3, 9, 5, RED)(x, y);
      }, 'u'),
      O(16, 6.6 - b * 0.5, 1.7, 1.6, RED, 'u'),
      O(14.4, 14.4, 1.3, 1.3, GOLD, 'A')
    );
    // the near arm up, the sword held ready
    var arm = stripedLimb([[7.6, 17.6 - b], [5.4, 20.4 - b], [3.8, 17.6]], 1.6, 2, NAVY, SNOW);
    parts.push(
      P('U', or(rrect(1.6, 1.4, 4.6, 14.2, 1.4), tri(1.6, 2, 3.1, -0.2, 4.6, 2)), function (x, y) { return x === 3 ? 'X' : orb(2, 4, 3, 12, WOOD)(x, y); }, 'S'),
      P('T', rrect(0.4, 13.4, 6, 15.2, 0.8), orb(2, 13, 5, 2, WOOD), 'S'),
      P('T', rrect(2.2, 15, 3.8, 17.6, 0.6), null, 'S'),
      P('W', arm.f, arm.tex, '2'),
      O(3.4, 16.8, 1.7, 1.6, SKIN, 'V')
    );
    return build(22, 32, parts, [[4, 7, EYE], [9, 7, EYE], [5, 12, ['#...#', '.###.']], [11, 11, ['3']]]);
  });

  /* Rubber duck: a big yellow bath duck loose in the waterpark,
     waddling along on little orange feet and rocking side to side as it
     goes; a curl on its head, a round orange bill. */
  var DUCK = 'BCCDF';
  E.duck = [0, 1].map(function (f) {
    var a = f ? 0.09 : -0.09, px = 13.6, py = 23.4;
    var parts = [
      P('m', or(ell(f ? 9.4 : 11, 22.6, 2.8, 1.2), ell(f ? 18.4 : 16.6, 22.8, 2.8, 1.2)), orb(12, 21, 8, 3, FOX), 'k'),
      P('C', or(ell(14.8, 16, 10.4, 6.6), tri(19, 12, 25.6, 6.4, 25.2, 15.4)), orb(10, 10, 14, 10, DUCK), 'A'),
      P('C', petal(17, 15.4, 0.35, 0.6, 5, 2.8), orb(15, 13, 7, 5, 'BBCCD'), 'A'),
      O(8.8, 7.6, 5.8, 5.6, DUCK, 'A'),
      P('C', limb([[8.8, 2.8], [9.4, 0.9], [11.4, 1], [11.6, 2.8]], 1.1), orb(9, 0, 3, 3, DUCK), 'A'),
      P('m', or(ell(2.6, 10, 3.2, 1.5), ell(3.4, 11.2, 2.4, 1.1)), function (x, y) { return y > 10 ? 'l' : orb(2, 9, 4, 2, FOX)(x, y); }, 'k')
    ].map(function (p) { return turnPart(p, px, py, a); });
    return build(26, 24, parts, turnStamps([[4, 5, EYE], [8, 10, ['3']]], px, py, a));
  });

  /* ---- things to find and grab ------------------------------------------ */
  /* The medal: the hidden treasure, three in every level. A big gold
     medal on a red ribbon with a white stripe, a raised star on its face,
     turning: face on, three-quarter, edge on, three-quarter the other
     way (its rim showing on the side that's turning away). */
  var MEDAL = { cx: 12, cy: 15.5, R: 8.2 };
  // the ribbon: two straight tails in a V, running up off the top
  var quad = function (a, b, c, d) { return or(tri(a[0], a[1], b[0], b[1], c[0], c[1]), tri(a[0], a[1], c[0], c[1], d[0], d[1])); };
  var medalRibbon = or(quad([3.6, -0.6], [9.6, -0.6], [13.6, 9], [8, 9]), quad([20.4, -0.6], [14.4, -0.6], [10.4, 9], [16, 9]));
  var medalStar = starShape(MEDAL.cx, MEDAL.cy + 0.4, 6, 2.6, -Math.PI / 2);
  var medal = function (sx, side) {
    var cx = MEDAL.cx, cy = MEDAL.cy, R = MEDAL.R, sq = function (f) { return squeeze(f, cx, sx); };
    var face = ell(cx, cy, R * sx, R), rims = [];
    for (var k = 1; k <= 4; k++) rims.push(ell(cx + side * k * 0.42, cy, R * sx, R));
    // edge on, the rim is all there is
    if (sx < 0.3) rims = [rrect(cx - 1.7, cy - R + 0.2, cx + 1.7, cy + R, 0.9)];
    var parts = [
      P('x', sq(medalRibbon), sq(function (x, y) {
        // the white stripe down the middle of each tail
        var X = x + 0.5, mid = X < cx ? 6.8 + (y + 1.1) * 0.43 : 17.2 - (y + 1.1) * 0.43;
        return Math.abs(X - mid) < 0.5 ? 'w' : orb(cx - 4, 0, 8, 6, RED)(x, y);
      }), 'u'),
      // the rim, seen past the face as it turns
      P('B', or.apply(null, rims), function (x, y) { return (x + y) % 2 ? 'B' : 'A'; }, 'A')
    ];
    if (sx > 0.3) parts.push(P('C', face, function (x, y) {
      var X = cx + (x + 0.5 - cx) / sx, Y = y + 0.5, dx = X - cx, dy = Y - cy, r = Math.sqrt(dx * dx + dy * dy);
      // a raised rim, a groove inside it, the field a tone down
      if (r > R - 1.7) return orb(cx - 3, cy - 4, R + 2, R + 2, GOLD)(x, y);
      if (r > R - 2.5) return 'B';
      return orb(cx - 3, cy - 3, R, R, 'AAABB')(x, y);
    }, 'A'), P('D', both(face, sq(medalStar)), function (x, y) { return starTex(cx, cy + 0.4, -Math.PI / 2, 'CCDFF')(cx + (x + 0.5 - cx) / sx - 0.5, y); }, 'A'));
    var st = sx > 0.3 ? [[Math.round(cx - R * sx * 0.55), Math.round(cy - R * 0.6), ['F.', 'FF']]] : [];
    return build(24, 24, parts, st);
  };
  A.medal = [medal(1, 0), medal(0.62, 1), medal(0.1, 0), medal(0.62, -1)];
  /* Where a medal was found on an earlier visit, only its ghost: a pale
     ring where its rim was, its ribbon and its star faint, the rest
     clear */
  A.medalGhost = (function () {
    var cx = MEDAL.cx, cy = MEDAL.cy, R = MEDAL.R, rows = [];
    var disc = ell(cx, cy, R, R);
    // on the line: inside a shape, but within a step of its edge
    var rim = function (f, k, X, Y) { return f(X, Y) && (!f(X - k, Y) || !f(X + k, Y) || !f(X, Y - k) || !f(X, Y + k) || !f(X - k * 0.7, Y - k * 0.7) || !f(X + k * 0.7, Y + k * 0.7)); };
    for (var y = 0; y < 24; y++) {
      var r = '';
      for (var x = 0; x < 24; x++) {
        var X = x + 0.5, Y = y + 0.5;
        // the rim a line, the ribbon and the star filled in faintly
        r += rim(disc, 1.6, X, Y) ? (X + Y < 27 ? 'R' : '1') : medalStar(X, Y) || (medalRibbon(X, Y) && !disc(X, Y)) ? (X + Y < 24 ? '1' : '2') : '.';
      }
      rows.push(r);
    }
    var sp = BB.sprHi(rows, PAL);
    sp.noLight = 'all';
    return sp;
  })();

  /* A bunch of three party balloons, red, yellow and blue, their strings
     gathered into a bow at the bottom, where Bonnie holds on */
  A.balloons = build(28, 48, (function () {
    var parts = [], tie = [14, 39.4];
    var string = function (x0, y0, k) {
      var pts = [];
      for (var i = 0; i <= 8; i++) { var t = i / 8; pts.push([x0 + (tie[0] - x0) * t + Math.sin(t * Math.PI * 2) * k, y0 + (tie[1] - y0) * t]); }
      return P('G', limb(pts, 0.5));
    };
    parts.push(string(7.2, 23, 0.8), string(14, 17, -0.7), string(20.8, 23.8, 0.6));
    parts.push(P('G', limb([[14, 40], [14.8, 42.6], [13.4, 45], [14.2, 47.6]], 0.5)));
    var balloon = function (cx, cy, t) {
      return [P(t.charAt(2), tri(cx - 1.4, cy + 8.8, cx + 1.4, cy + 8.8, cx, cy + 6.6), null, t.charAt(0)), O(cx, cy, 6.4, 7.6, t, t.charAt(0))];
    };
    parts = parts.concat(balloon(14, 8.4, SKY), balloon(7.2, 14.6, RED), balloon(20.8, 15.4, GOLD));
    // a bow where the strings meet
    parts.push(P('r', or(ell(11.6, 38.6, 2.4, 1.7), ell(16.4, 38.6, 2.4, 1.7), tri(13.6, 39.6, 11.6, 43, 13.2, 43.4), tri(14.4, 39.6, 16.4, 43, 14.8, 43.4)), orb(12, 37, 5, 4, PINK), 'p'), O(14, 39.4, 1.3, 1.3, PINK, 'p'));
    return parts;
  })(), [[10, 2, ['ww', 'w.']], [3, 8, ['ww', 'w.']], [17, 9, ['ww', 'w.']]]);

  /* Musical blocks: one for each colour of the rainbow, A.notes[0] red
     to A.notes[6] violet, soft and round with a pair of notes on the
     front; [0] as it stands, [1] squashed when Bonnie lands on it (it
     sits lower, on the same base). */
  var NOTE_GLYPH = ['..wwwwwww', '..wwwwwww', '..w.....w', '..w.....w', '..w.....w', '.ww....ww', 'www...www', 'www...www', '.w.....w.'];
  var NOTE_GLYPH_SQ = ['..wwwwwww', '..wwwwwww', '..w.....w', '.ww....ww', 'www...www', 'www...www', '.w.....w.'];
  var noteBlock = function (t, sq) {
    var y0 = sq ? 5.2 : 0.5, g = sq ? NOTE_GLYPH_SQ : NOTE_GLYPH, gy = sq ? 7 : 3;
    var shadow = g.map(function (r) { return r.replace(/w/g, t.charAt(0)); });
    return build(16, 16, [P(t.charAt(2), rrect(sq ? 0.2 : 0.5, y0, sq ? 15.8 : 15.5, 15.6, 4), orb(6, y0 + 4, 12, sq ? 9 : 12, t), t.charAt(0))],
      [[4, gy + 1, shadow], [3, gy, g], [2, Math.round(y0 + 1.4), ['ww', 'w.']]]);
  };
  A.notes = [RED, FOX, GOLD, CACT, SKY, INDIGO, VIOLET].map(function (t) { return [noteBlock(t, false), noteBlock(t, true)]; });

  /* ---- springs ----------------------------------------------------------
     Two more for the Holiday, the spring's own size and frames. */
  // an inflatable swim ring, lying flat: pink and white panels, a valve,
  // and the far inside wall showing through its middle
  var swimRing = function (sq) {
    var cx = 16, cy = sq ? 13.4 : 10.1, rx = sq ? 15.8 : 15.4, ry = sq ? 6.4 : 9.8;
    var hy = cy - ry * 0.16, hrx = rx * 0.42, hry = ry * 0.36;
    var hole = ell(cx, hy, hrx, hry), see = ell(cx, hy + ry * 0.22, hrx * 0.96, hry);
    return build(32, 20, [
      P('r', but(ell(cx, cy, rx, ry), both(hole, see)), function (x, y) {
        var X = x + 0.5, Y = y + 0.5;
        // the inside of the far side of the ring, in shadow
        if (hole(X, Y)) return Y < hy - hry * 0.3 ? 'p' : 'q';
        var a = Math.atan2((Y - cy) / ry, (X - cx) / rx), k = Math.floor((a + Math.PI * 4) / (Math.PI / 4)) % 2;
        var t = orb(cx - rx * 0.4, cy - ry * 0.7, rx * 1.1, ry * 1.2, k ? SNOW : PINK)(x, y);
        // the tube rounds away at its inner and outer edges
        var d = Math.sqrt(Math.pow((X - cx) / rx, 2) + Math.pow((Y - cy) / ry, 2));
        return d > 0.88 || d < 0.52 ? step(k ? SNOW : PINK, t, -1) : t;
      }, 'p'),
      O(6.6, cy + ry * 0.5, 1.4, 1, SNOW, '2')
    ]);
  };
  A.ring = [swimRing(false), swimRing(true)];

  // a wooden toy catapult on red wheels: Bonnie lands in its spoon, the
  // arm dips, and away he goes
  var catapult = function (sq) {
    var a = sq ? -0.2 : 0, px = 28.2, py = 3.2;
    var arm = function (p) { return turnPart(p, px, py, a); };
    return build(32, 20, [
      P('U', or(cap(23.4, 14, 28.2, 3.4, 1.4), cap(31, 14, 28.2, 3.4, 1.3)), orb(26, 6, 4, 10, WOOD), 'S'),
      P('U', rrect(1.4, 12.2, 30.6, 15.4, 1.2), function (x, y) { return y === 13 && x % 5 === 2 ? 'T' : orb(10, 11, 20, 6, WOOD)(x, y); }, 'S'),
      O(6.6, 16.6, 3.2, 3.2, RED, 'u'), O(25.4, 16.6, 3.2, 3.2, RED, 'u'),
      arm(P('V', rrect(4, 1.2, 30.8, 5, 1.4), function (x, y) { return y === 2 ? 'X' : orb(12, -1, 26, 8, 'TUVXY')(x, y); }, 'T')),
      arm(P('|', both(ell(6.2, 0.4, 5.8, 5.4), function (x, y) { return y > 0.4; }), function (x, y) {
        // the bowl of the spoon, its hollow in shade
        return ell(6.2, 0.4, 4, 3.2)(x + 0.5, y + 0.5) ? (y < 2 ? ';' : '_') : orb(4, 1, 7, 6, COAT)(x, y);
      }, ';')),
      // the twisted cord that springs it, wound round the pivot
      P('V', ell(px, py + 0.4, 2.4, 2.4), ROPE, 'T')
    ], [[6, 16, ['C']], [25, 16, ['C']]]);
  };
  A.catapult = [catapult(false), catapult(true)];

  /* ---- moving platforms: the Holiday's rides --------------------------- */
  /* A surfboard, seen a little from above so its shape shows: a pointed
     nose, a rounded tail, a fin below it; sky blue with a white
     stringer down the middle and red and yellow stripes across. Bonnie
     stands on the middle of the deck, so its far half rises 2 game
     pixels above his feet. */
  LK.surfboard = look(build(48, 12, (function () {
    var cy = 4.2, half = function (x) {
      var u = x / 48;
      return u > 0.86 ? 3.7 * Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.86) / 0.14, 2))) : 3.7 * Math.pow(Math.min(1, u / 0.5), 0.55);
    };
    var deck = function (x, y) { return x > 0.4 && Math.abs(y - cy) < half(x); };
    return [
      P('È', or(tri(38.4, 7, 44.2, 7, 44.6, 11.6), ell(44, 11, 1.2, 0.9)), orb(40, 7, 6, 5, SKY), 'È'),
      // the rail: the board's near edge, in shade
      P('É', function (x, y) { return deck(x, y - 1.8); }, orb(20, 2, 40, 10, 'ÈÈÉÉÊ'), 'È'),
      P('Ê', deck, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, t = orb(16, 0, 40, 8, SKY)(x, y);
        if (Math.abs(Y - cy) < 0.5 && X > 3) return 'w';
        if ((X > 8.6 && X < 10.2) || (X > 37 && X < 38.6)) return orb(16, 0, 40, 8, RED)(x, y);
        if ((X > 10.2 && X < 11.6) || (X > 38.6 && X < 40)) return orb(16, 0, 40, 8, GOLD)(x, y);
        return t;
      }, 'É')
    ];
  })()), 2);

  // a lilo: a stripy inflatable airbed, blue and white tubes, its pillow
  // puffed up a little higher at the head end
  LK.lilo = look(build(48, 10, (function () {
    var parts = [P('Ê', rrect(0.4, 0.2, 9.8, 9.6, 3.4), orb(4, 1, 8, 8, SKY), 'É')], n = 8, x0 = 9.2, w = (47.6 - x0) / n;
    for (var k = 0; k < n; k++) {
      var a = x0 + k * w, t = k % 2 ? SKY : SNOW;
      parts.push(P(t.charAt(2), rrect(a - 0.6, 1.6, a + w + (k === n - 1 ? 0 : 0.6), 9.6, 2.4), orb(a + w * 0.3, 2, w * 1.2, 9, t), t.charAt(0)));
    }
    return parts;
  })(), [[2, 1, ['ww']]]), 1);

  /* A chariot from the arena show: a red car trimmed in gold, its side
     sweeping up from the back to a tall rounded front with a gold
     medallion; the pole out in front; two big spoked wheels, the far one
     in shadow. Bonnie stands on its floor (the gold band along its side),
     6 game pixels below the top of the front. */
  LK.chariot = look(build(64, 44, (function () {
    var fl = 12, parts = [];
    var topEdge = function (x) { var u = Math.max(0, Math.min(1, (x - 5) / 38)); return fl - (fl - 1.2) * (0.5 + 0.5 * Math.cos(Math.PI * u)); };
    var botEdge = function (x) { return x < 48 ? fl + 8.4 : fl + 8.4 - Math.pow((x - 48) / 15.4, 2) * 4.4; };
    var side = function (x, y) { return x > 0.6 && x < 63.4 && y > topEdge(x) && y < botEdge(x) && rrect(0.6, 0.6, 63.4, 30, 3.4)(x, y); };
    // the pole the horses would pull it by, curling up at its end
    parts.push(P('U', limb([[16, fl + 7], [6, fl + 9.2], [2, fl + 9], [1.2, fl + 6.8]], 1.2), orb(8, fl + 6, 10, 4, WOOD), 'S'));
    parts.push(wheel(31, 30.6, 12.8, 8, 'SSSTT', 'ABBCC', 'SSTTU', true));
    parts.push(P('x', side, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // gold along the top edge, at the floor, and round the hem
      if (Y < topEdge(X) + 1.5 || X < 2.2 || (Y > fl && Y < fl + 1.6) || Y > botEdge(X) - 1.5) return orb(6, 0, 40, 16, GOLD)(x, y);
      return orb(6, 1, 36, 16, RED)(x, y);
    }, 'u'));
    parts.push(O(9.4, 6.6, 2.8, 2.8, GOLD, 'A'));
    parts.push(wheel(38.4, 30.8, 13, 8, 'STTUV', GOLD, WOOD));
    return parts;
  })(), [[9, 5, ['D.', 'DC']], [3, 2, ['F']], [6, 16, ['C.....C.....C.....C.....C.....C.....C.....C.....C.....C']]]), 6);

  /* A Viking longship, as in the park's show: a long curved hull of
     overlapping planks, round painted shields hung along her side, oars
     out, a friendly dragon's head on the prow and a curl at the stern.
     Bonnie stands on her deck, 11 game pixels below the dragon's head. */
  LK.longship = look(build(96, 44, (function () {
    var dk = 22, parts = [], hcx = 48, hcy = 6, hrx = 44.6, hry = 31.4;
    var hullF = function (x, y) { return y >= dk - 0.4 && ell(hcx, hcy, hrx, hry)(x, y); };
    var bow = taper([[12.6, 27], [8.4, 22.6], [5.6, 16.6], [5, 11.4], [6.2, 8]], 3.6, 2.4);
    var stern = taper([[83.4, 27], [87.8, 22.4], [90.8, 16.6], [91.6, 11.6], [90.6, 8], [88, 7], [86.4, 8.6], [87.4, 10.6]], 3.6, 1.3);
    var planks = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, r = Math.sqrt(Math.pow((X - hcx) / hrx, 2) + Math.pow((Y - hcy) / hry, 2));
      var t = orb(30, 10, 60, 30, WOOD)(x, y), k = (r - 0.5) / 0.1;
      // clinker planks: each overlapping the one below, its lower edge in shadow
      return k % 1 > 0.78 ? step(WOOD, t, -1) : k % 1 < 0.22 ? step(WOOD, t, 1) : t;
    };
    parts.push(P('U', or(hullF, bow, stern), function (x, y) {
      if (bow(x + 0.5, y + 0.5) || stern(x + 0.5, y + 0.5)) return orb(40, 0, 60, 30, WOOD)(x, y);
      return planks(x, y);
    }, 'S'));
    // the gunwale along the deck edge
    parts.push(P('V', function (x, y) { return y >= dk && y < dk + 1.8 && hullF(x, y); }, orb(30, dk - 4, 60, 8, 'TUVXY'), 'T'));
    // oars out through the side, blades down in the water
    for (var i = 0; i < 6; i++) {
      var ox = 22 + i * 10.4;
      parts.push(P('V', or(cap(ox, dk + 7, ox - 6.6, dk + 18.4, 0.9), turned(ell(ox - 7.4, dk + 19.6, 1.4, 2.6), ox - 7.4, dk + 19.6, 0.5)), orb(ox - 4, dk + 10, 6, 10, 'TUVXY'), 'T'));
    }
    // shields along her side, each with an iron boss
    [RED, GOLD, SKY, SNOW, RED, GOLD, SKY, SNOW].forEach(function (t, j) {
      var sx = 15.6 + j * 9.4, boss = ell(sx, dk + 3.6, 1.3, 1.3);
      parts.push(P(t.charAt(2), ell(sx, dk + 3.6, 3.6, 3.6), function (x, y) {
        return boss(x + 0.5, y + 0.5) ? orb(sx - 0.6, dk + 3, 1.6, 1.6, IRON)(x, y) : orb(sx - 1.4, dk + 2.2, 4, 4, t)(x, y);
      }, t.charAt(0)));
    });
    // the dragon: a gold crest down the back of its head and neck, a long
    // friendly snout, a red tongue
    parts.push(P('C', or(tri(9.6, 2.4, 15, 0.4, 12, 6.4), tri(9.8, 6, 15, 5.6, 9.4, 10.4), tri(7.8, 9.8, 12.4, 10.6, 7.6, 14.6), tri(6.6, 13.6, 10.6, 15.2, 6.4, 18.4)), orb(10, 3, 6, 10, GOLD), 'A'));
    parts.push(P('V', or(ell(7.4, 5.4, 4.6, 4), cap(1.4, 6.8, 6, 6.4, 2.4), tri(5.6, 2.4, 6.8, -0.4, 9, 2)), orb(4, 3, 7, 5, 'TUVXY'), 'T'));
    parts.push(P('x', or(tri(0.4, 8.6, 4.8, 8.6, 2.2, 11.4)), orb(2, 9, 3, 2, RED), 'u'));
    return parts;
  })(), [[5, 3, EYE], [1, 6, ['#']], [3, 8, ['#...#']]]), 11);

  /* ---- the Holiday's scenery -------------------------------------------- */
  // a shape rasterised as a stamp of one colour: for symbols too fine to
  // survive being outlined (a bike on a sign)
  var glyph = function (w, h, f, c) {
    var rows = [];
    for (var y = 0; y < h; y++) { var r = ''; for (var x = 0; x < w; x++) r += f(x + 0.5, y + 0.5) ? c : '.'; rows.push(r); }
    return rows;
  };
  var circleLine = function (cx, cy, r, t) { return function (x, y) { var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)); return Math.abs(d - r) < t; }; };
  var SANDY = 'VVXYY';

  // Waterpark: a sun lounger, its back propped up, a striped cushion
  D.sunlounger = build(48, 24, [
    P('W', or(cap(14.6, 15.6, 13.2, 23.4, 0.9), cap(44.6, 15.6, 46, 23.4, 0.9), cap(11.4, 12.6, 15.4, 23.4, 0.9), rrect(11.6, 14.4, 47.4, 16.4, 0.8)), orb(20, 12, 30, 12, SNOW), '2'),
    P('W', or(rrect(13, 10.4, 47, 15, 2.2), cap(4.6, 3.6, 14.6, 12.6, 2.6)), function (x, y) {
      // stripes across the cushion, along the slope on its back
      var X = x + 0.5, Y = y + 0.5, k = X > 14 && Y > 10 ? Math.floor((X - 13) / 3.4) : Math.floor((X - 4 + (Y - 3.6) * 1.1) / 3.4);
      return orb(10, 4, 34, 12, k % 2 ? SNOW : SKY)(x, y);
    }, 'É'),
    P('C', cap(39.6, 8.4, 45.4, 8.4, 1.9), orb(41, 7, 6, 3, GOLD), 'A')
  ], [[40, 8, ['B.B.B']]]);

  // Waterpark: a tall white lifeguard's chair with a ladder up to the seat,
  // a striped sunshade over it, a life ring hung ready
  D.lifeguard = build(36, 72, [
    P('W', or(cap(11, 34, 4.4, 71.4, 1.4), cap(25, 34, 31.6, 71.4, 1.4), cap(18, 4, 18, 32, 0.8),
      rrect(8.8, 43.6, 27.2, 45.2, 0.6), rrect(7.2, 53.6, 28.8, 55.2, 0.6), rrect(5.6, 63.6, 30.4, 65.2, 0.6)), orb(12, 30, 20, 40, SNOW), '2'),
    P('x', or(rrect(6.4, 31.4, 29.6, 34.6, 1), rrect(24.6, 20.6, 28, 34, 1.2), rrect(6.4, 27.6, 9, 34, 1)), orb(10, 26, 20, 10, RED), 'u'),
    P('x', both(ell(18, 11.6, 17.4, 10.6), function (x, y) { return y < 11.6; }), function (x, y) {
      var band = Math.floor((x + 0.5 + 0.6) / 5) % 2;
      return orb(14, 4, 18, 10, band ? SNOW : RED)(x, y);
    }, 'u'),
    P('x', but(ell(9.4, 47, 4.6, 4.6), ell(9.4, 47, 2, 2)), function (x, y) {
      var a = Math.atan2(y + 0.5 - 47, x + 0.5 - 9.4), k = Math.floor((a + Math.PI * 4 + Math.PI / 4) / (Math.PI / 2)) % 2;
      return orb(8, 45, 5, 5, k ? SNOW : RED)(x, y);
    }, 'u')
  ]);

  // Hossegor: a Landes maritime pine, a tall bare trunk leaning a little,
  // its crown spread out flat like an umbrella
  D.seapine = build(44, 80, (function () {
    var parts = [], BARK = 'SSTUV';
    var bark = function (cx, cy) {
      var o = orb(cx, cy, 6, 40, BARK);
      // the bark in plates, with deep cracks between them
      return function (x, y) { return (Math.floor(y / 3) * 2 + x) % 5 === 0 || y % 3 === 0 && x % 2 ? 'S' : o(x, y); };
    };
    parts.push(P('U', taper([[23, 80], [21.6, 66], [23, 52], [21, 38], [21.4, 26]], 2.8, 1.8), bark(20, 50), 'S'));
    [[[21.4, 30], [15, 22], [11, 18]], [[21.6, 28], [28, 21], [32, 17]], [[21.2, 27], [21, 19]]].forEach(function (b) { parts.push(P('U', taper(b, 1.5, 1), bark(20, 22), 'S')); });
    [[8, 17.6, 6.4], [36, 17, 6], [15, 12.4, 7], [29, 11.6, 7.4], [21.6, 8.4, 7.6], [3.8, 21, 3.6], [40.4, 20.6, 3.4], [22, 16, 7], [11, 20.4, 4.4], [32.4, 20.2, 4.4]].forEach(function (c) {
      parts.push(P('ï', ell(c[0], c[1], c[2], c[2] * 0.66), function (x, y) {
        var t = orb(c[0] - 1, c[1] - 1.4, c[2], c[2] * 0.66, PINE)(x, y);
        // tufts of needles, a tone darker
        return (x * 3 + y * 5) % 7 === 0 ? step(PINE, t, -1) : t;
      }, 'í'));
    });
    return parts;
  })());

  // Hossegor: a striped beach hut on stilts, a yellow door, a red roof
  D.beachhut = build(36, 52, [
    P('V', or(rrect(3, 47, 6, 52, 0.6), rrect(30, 47, 33, 52, 0.6), rrect(13.4, 48.4, 22.6, 52, 0.6)), orb(10, 46, 20, 8, WOOD), 'T'),
    P('V', rrect(0.8, 45, 35.2, 48.6, 0.8), orb(10, 44, 30, 6, 'TUVXY'), 'T'),
    P('w', rrect(3.4, 13, 32.6, 45.6, 0.6), function (x, y) { return orb(8, 12, 30, 34, Math.floor((x - 3) / 4) % 2 ? SKY : SNOW)(x, y); }, '2'),
    P('C', rrect(12.6, 23, 23.4, 45.4, 1.4), function (x, y) {
      // a diamond window in the door, and its knob
      var X = x + 0.5, Y = y + 0.5;
      if (Math.abs(X - 18) + Math.abs(Y - 28.6) < 2.6) return Y < 28.6 ? 'Ë' : 'Ê';
      return orb(14, 23, 10, 22, GOLD)(x, y);
    }, 'A'),
    P('x', function (x, y) { return y > 0.4 && y < 15.6 && Math.abs(x - 18) < (y - 0.4) * 1.24 && x > 0.2 && x < 35.8; }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // the gable, white, with a round window
      if (Y > 5 && Y < 13.6 && Math.abs(X - 18) < (Y - 5) * 1.05) return ell(18, 10.4, 1.8, 1.8)(X, Y) ? (Y < 10.4 ? 'Ë' : 'Ê') : orb(16, 6, 10, 8, SNOW)(x, y);
      return orb(12, 0, 22, 14, RED)(x, y);
    }, 'u')
  ], [[21, 34, ['C']]]);

  // Hossegor: three surfboards stood up in the sand
  D.surfboards = build(40, 52, (function () {
    var board = function (cx, top, bot, w, a, t, stripe) {
      var len = bot - top, shape = function (x, y) {
        var u = (y - top) / len;
        if (u < 0 || u > 1) return false;
        var h = u < 0.45 ? w * Math.pow(u / 0.45, 0.6) : u > 0.88 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.88) / 0.12, 2))) : w;
        return Math.abs(x - cx) < h;
      };
      var px = cx, py = bot;
      return turnPart(P(t.charAt(2), shape, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, u = (Y - top) / len;
        if (Math.abs(X - cx) < 0.6 && u > 0.08) return 'w';
        if (u > 0.2 && u < 0.27) return orb(cx - w, top, w * 2, len, stripe)(x, y);
        return orb(cx - w * 0.6, top + len * 0.2, w * 2, len, t)(x, y);
      }, t.charAt(0)), px, py, a);
    };
    return [
      board(10.6, 7, 48, 4.4, -0.16, FOX, SKY),
      board(29.4, 10, 48, 4.2, 0.15, GOLD, RED),
      board(20, 0.6, 48, 4.8, 0, SKY, GOLD),
      P('Y', both(ell(20, 50.6, 19.6, 4.6), function (x, y) { return y > 46; }), function (x, y) { return (x * 5 + y * 3) % 9 === 0 ? 'V' : orb(14, 46, 20, 6, SANDY)(x, y); }, 'V')
    ];
  })());

  // the bike ride: a cycle-route signpost, an arrow-shaped green sign
  // with a white bike on it (no words)
  D.signpost = build(24, 52, [
    P('Q', or(rrect(10.6, 12, 13.4, 51, 0.8), rrect(8.6, 49, 15.4, 52, 0.8)), orb(11, 20, 3, 30, IRON), 'O'),
    P('{', or(rrect(5, 1.6, 23.4, 16.4, 1.4), tri(0.4, 9, 6, 1.6, 6, 16.4)), function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      // a white edge just inside the sign
      var inner = or(rrect(6.4, 3, 22, 15, 0.8), tri(2.6, 9, 7.2, 3, 7.2, 15));
      return inner(X, Y) ? orb(8, 2, 16, 14, CACT)(x, y) : 'w';
    }, '[')
  ], [[7, 5, glyph(14, 8, or(circleLine(3, 5.2, 2.3, 0.55), circleLine(11, 5.2, 2.3, 0.55), cap(3, 5.2, 6.6, 5.4, 0.5), cap(6.6, 5.4, 5.2, 2.2, 0.5), cap(5.2, 2.2, 9.6, 2.2, 0.5), cap(9.6, 2.2, 6.6, 5.4, 0.5), cap(9.6, 2.2, 11, 5.2, 0.5), cap(4.2, 1.4, 6, 1.4, 0.5), cap(9, 0.6, 10.6, 0.8, 0.5)), 'w')]]);

  // the bike ride: a bike rack, three steel hoops, one bike leant in it
  // (a red bike with a wicker basket and a baguette in it)
  D.bikerack = build(48, 28, (function () {
    var parts = [], hoop = function (x0, x1) { return limb([[x0, 27.6], [x0, 14.6], [x0 + 1.4, 12.2], [(x0 + x1) / 2, 11.4], [x1 - 1.4, 12.2], [x1, 14.6], [x1, 27.6]], 1); };
    parts.push(P('Q', or(hoop(2.4, 12.4), hoop(19, 29), hoop(35.6, 45.6)), orb(20, 10, 40, 20, IRON), 'O'));
    var bwheel = function (cx, cy) {
      return P('g', or(circleLine(cx, cy, 5.4, 1), ell(cx, cy, 1.2, 1.2), cap(cx - 4.6, cy, cx + 4.6, cy, 0.45), cap(cx, cy - 4.6, cx, cy + 4.6, 0.45), cap(cx - 3.3, cy - 3.3, cx + 3.3, cy + 3.3, 0.45), cap(cx - 3.3, cy + 3.3, cx + 3.3, cy - 3.3, 0.45)), function (x, y) {
        var d = Math.sqrt(Math.pow(x + 0.5 - cx, 2) + Math.pow(y + 0.5 - cy, 2));
        return d > 4.6 ? orb(cx - 2, cy - 2, 6, 6, INK)(x, y) : 'P';
      }, 'f');
    };
    var bb = [23, 21.4], seat = [27, 11.6], head = [14.6, 12], fw = [11, 21.6], rw = [35.6, 21.6];
    parts.push(bwheel(rw[0], rw[1]), bwheel(fw[0], fw[1]));
    parts.push(P('x', or(cap(rw[0], rw[1], bb[0], bb[1], 1), cap(bb[0], bb[1], seat[0], seat[1], 1.1), cap(seat[0], seat[1], rw[0], rw[1], 0.9), cap(seat[0] - 0.6, seat[1] + 1.6, head[0], head[1] + 1.2, 1), cap(head[0], head[1], bb[0], bb[1], 1.1), cap(head[0], head[1], fw[0], fw[1], 0.9)), orb(20, 10, 20, 14, RED), 'u'));
    parts.push(P('g', or(ell(27.4, 10.2, 2.6, 1.1), cap(14.6, 12, 15.8, 8.6, 0.8), cap(15.8, 8.6, 18.6, 8.2, 0.8)), orb(20, 8, 8, 3, INK), 'f'));
    parts.push(P('Q', or(cap(bb[0], bb[1], bb[0] + 2.4, bb[1] + 2.2, 0.6), rrect(bb[0] + 1.4, bb[1] + 2, bb[0] + 4, bb[1] + 3, 0.4)), null, 'O'));
    // the basket on the front, and the bread poking out of it
    parts.push(P('â', cap(9.2, 10.6, 5.6, 2.6, 1.4), orb(6, 3, 4, 8, CRUST), 'à'));
    parts.push(P('û', rrect(5.6, 9.4, 13.8, 15, 1), weave(STRAW, 8, 9, 8, 6), 'ù'));
    return parts;
  })(), [[6, 4, ['o', '.o']]]);

  // the historical park: a tall banner on a pole, red with a gold border
  // and a gold sun, cut into two points at the bottom
  D.banner = build(24, 64, [
    P('Q', rrect(0.4, 58, 7.6, 64, 1), orb(2, 58, 6, 6, STONE), 'O'),
    P('U', or(rrect(2.4, 4, 5.4, 59, 1), rrect(2.4, 6.6, 22.6, 8.8, 0.8)), orb(3, 20, 4, 40, WOOD), 'S'),
    O(3.9, 2.8, 2.4, 2.4, GOLD, 'A'),
    P('x', function (x, y) {
      if (x < 5.6 || x > 21.4 || y < 8.4) return false;
      // two swallowtail points, with a notch between them
      return y < 44 || (y < 52 && Math.abs(x - 13.5) > (y - 44) * 0.98);
    }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5, edge = X < 7.2 || X > 19.8 || Y < 10;
      return edge ? orb(8, 8, 14, 30, GOLD)(x, y) : orb(9, 12, 14, 30, RED)(x, y);
    }, 'u'),
    P('C', or(bloom(13.5, 24, 10, 4.4, 1.6, 0.9, 0), ell(13.5, 24, 3.2, 3.2)), orb(12, 22, 6, 6, GOLD), 'A')
  ], [[12, 22, ['F.']]]);

  // the historical park: a striped medieval tent, a pennant on top, the
  // door flaps tied back
  D.tent = build(56, 52, [
    P('g', or(cap(28, 0.6, 28, 8.6, 0.7)), null, 'f'),
    P('|', tri(28.6, 0.6, 36.6, 2.8, 28.6, 5.2), orb(30, 2, 6, 3, COAT), ';'),
    P('w', rrect(5.4, 19, 50.6, 51.6, 0.8), function (x, y) { return orb(14, 18, 40, 36, Math.floor((x + 0.5 - 5.4) / 5.06) % 2 ? RED : SNOW)(x, y); }, '2'),
    P('g', tri(28, 25, 20.4, 51.8, 35.6, 51.8), function (x, y) { return y < 33 ? 'h' : 'g'; }, 'f'),
    P('x', or(tri(28, 25.4, 20.6, 51.6, 18.4, 51.6), tri(28, 25.4, 35.4, 51.6, 37.6, 51.6)), orb(22, 30, 10, 20, RED), 'u'),
    P('C', function (x, y) {
      if (y < 7 || y > 24.6 || x < 1.4 || x > 54.6) return false;
      if (y < 20) return Math.abs(x - 28) < (y - 7) * 2;
      // a scalloped valance round the bottom of the roof
      var c = Math.floor((x - 1.4) / 4.8) * 4.8 + 1.4 + 2.4;
      return ell(c, 20, 2.5, 4.4)(x, y);
    }, function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (Y > 20.4) return orb(10, 18, 40, 6, GOLD)(x, y);
      // the roof in stripes from the peak down
      var k = Math.floor((Math.atan2(X - 28, Y - 7) + 2) / 0.3) % 2;
      return orb(16, 6, 30, 16, k ? GOLD : RED)(x, y);
    }, 'A'),
    O(28, 7.4, 1.6, 1.6, GOLD, 'A')
  ], [[20, 34, ['C']], [35, 34, ['C']]]);

  // the historical park: a shield propped on a wooden stand: red with a
  // gold chevron, rimmed in steel
  var heater = function (cx, y0, hw, len) {
    return function (x, y) {
      var yy = y - y0;
      if (yy < 0 || Math.abs(x - cx) > hw) return false;
      return yy < len * 0.38 || Math.abs(x - cx) < hw * Math.max(0, 1 - Math.pow((yy - len * 0.38) / (len * 0.62), 1.5));
    };
  };
  D.shield = build(28, 32, [
    P('U', or(cap(14, 6, 4.4, 31.4, 1.2), cap(14, 6, 23.6, 31.4, 1.2), rrect(6.4, 25, 21.6, 26.8, 0.6)), orb(10, 10, 10, 20, WOOD), 'S'),
    P('Q', heater(14, 2.4, 9.2, 23.6), orb(10, 4, 16, 18, IRON), 'N'),
    P('x', heater(14, 3.8, 7.8, 20.8), function (x, y) {
      var X = x + 0.5, Y = y + 0.5, ch = Math.abs(Y - (8 + Math.abs(X - 14) * 0.9) - 5) < 2;
      return ch ? orb(10, 6, 14, 16, GOLD)(x, y) : orb(10, 5, 16, 18, RED)(x, y);
    }, 'O')
  ]);

  // Saint-Malo: an old ship's cannon on its wooden carriage, a pile of
  // cannonballs beside it
  var GUN = 'fNNOP';
  var truck = function (cx, cy, R) {
    return P('U', ell(cx, cy, R, R), function (x, y) {
      var d = Math.sqrt(Math.pow(x + 0.5 - cx, 2) + Math.pow(y + 0.5 - cy, 2));
      // an iron tyre round a solid wooden wheel, an iron pin at its hub
      if (d > R - 1.1) return orb(cx - 2, cy - 2, R, R, GUN)(x, y);
      if (d < 1.1) return 'N';
      return Math.abs(d - R * 0.55) < 0.5 ? 'T' : orb(cx - 1.6, cy - 1.6, R, R, WOOD)(x, y);
    }, 'S');
  };
  D.cannon = build(44, 26, [
    P('U', or(rrect(9.6, 12, 31.6, 18.6, 1.4), rrect(21.6, 8.6, 31.6, 18.6, 1.2)), function (x, y) { return y === 15 ? 'T' : orb(14, 10, 20, 10, WOOD)(x, y); }, 'S'),
    truck(14.6, 20.8, 4.6), truck(27.6, 20.8, 4.6),
    P('O', function (x, y) {
      if (x < 0.6) return false;
      var c = 9.6 + (x - 18) * 0.05, r = x < 3.8 ? 3.2 : 2.3 + Math.max(0, x - 3.8) / 28 * 2;
      if (Math.abs(x - 12) < 1 || Math.abs(x - 24) < 1) r += 0.7;
      return (x < 32 && Math.abs(y - c) < r) || ell(31.4, 10.4, 4.6, 4.6)(x, y) || ell(37, 10.6, 1.7, 1.7)(x, y) || cap(34, 10.6, 37, 10.6, 0.9)(x, y);
    }, function (x, y) {
      var c = 9.6 + (x - 18) * 0.05;
      return orb(10, c - 3.6, 26, 7, GUN)(x, y);
    }, 'f'),
    O(37.6, 23.4, 2.3, 2.3, GUN, 'f'), O(42, 23.4, 2.3, 2.3, GUN, 'f'), O(39.8, 19.6, 2.3, 2.3, GUN, 'f')
  ], [[0, 8, ['f', 'f', 'f', 'f']], [23, 6, ['N.N', '.N.']]]);

  // Saint-Malo: a little crêpe cart with a blue-and-white striped awning,
  // a hot griddle with a crêpe cooking, a folded one on a plate, a jar
  D.crepestand = build(48, 56, [
    P('Q', or(rrect(4, 9, 6, 30, 0.6), rrect(42, 9, 44, 30, 0.6)), orb(4, 10, 4, 20, IRON), 'O'),
    P('w', function (x, y) {
      if (x < 0.4 || x > 47.6 || y < 0.6) return false;
      if (y < 8) return y > 0.6 + Math.pow((x - 24) / 24, 2) * 2.4;
      var c = Math.floor(x / 6) * 6 + 3;
      return ell(c, 8, 3.1, 3.4)(x, y);
    }, function (x, y) { var t = orb(14, -2, 30, 12, Math.floor(x / 6) % 2 ? SNOW : SKY)(x, y); return y > 8 ? step(Math.floor(x / 6) % 2 ? SNOW : SKY, t, -1) : t; }, 'É'),
    P('Y', rrect(2, 30.6, 46, 45, 1.6), function (x, y) { var Y = y + 0.5; return Y > 34 && Y < 35.6 || Y > 41 && Y < 42.6 ? orb(10, 30, 40, 16, SKY)(x, y) : orb(10, 30, 40, 16, CREAM)(x, y); }, 'V'),
    P('U', or(rrect(5, 44, 8, 55.8, 0.6), rrect(3.6, 54.4, 9.4, 56, 0.6)), orb(5, 46, 3, 10, WOOD), 'S'),
    wheel(35, 47.6, 7.8, 6, 'STTUV', GOLD, WOOD),
    P('V', rrect(0.6, 28.4, 47.4, 31.4, 1), orb(10, 27, 40, 5, 'TUVXY'), 'T'),
    P('g', rrect(8, 25.6, 23, 28.8, 1.2), orb(12, 25, 10, 4, INK), 'f'),
    P('â', ell(15.4, 25.6, 6.6, 1.2), orb(12, 24, 8, 2, CRUST), 'à'),
    P('W', rrect(27, 27.4, 37, 28.8, 0.6), orb(30, 27, 6, 2, SNOW), '2'),
    P('â', tri(28, 27.6, 36, 27.6, 32.6, 22.4), orb(30, 23, 6, 6, CRUST), 'à'),
    P('L', rrect(39.6, 21.6, 45, 28.6, 1.4), function (x, y) { return y < 24 ? orb(40, 21, 5, 3, RED)(x, y) : orb(40, 24, 5, 5, 'STUVX')(x, y); }, 'M')
  ], [[31, 25, ['x']], [12, 25, ['o...o']]]);
})();
