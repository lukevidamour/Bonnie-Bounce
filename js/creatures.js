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
})();
