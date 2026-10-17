/* ==========================================================================
   family.js — Bonnie's family: Luke and Lucy, Brocco (his broccoli soft
   toy, Monsty's best friend), and the family car, a dark grey Skoda Yeti.

   Drawn the way Bonnie is (art.js): at full density, as scenes of parts
   (each part a shape, a colour, a line where it crosses a part behind it
   and a texture), outlined in a deep shade of whatever they border and
   lit from the top left by the painter. Everything faces RIGHT, as Bonnie
   does; the game flips them to face left.

   A.family = {
     lucy:  { idle, blink, wave: [2], cheer }     24 x 38
     luke:  { idle, blink, wave: [2], cheer,      24 x 40
              run: [2], puff }                    (level 33: holding the
                                                   bike seat, then puffed)
     brocco: { idle, happy, worried }             15 x 19 (Monsty's size)
     yeti:  { side: [2], full: [2] }              64 x 30 (wheels turning;
                                                   full = the family inside)
     yetiSmall: [2]                               18 x 10 (for the map)
     bike:  { s, b: { ride: [4], air, cheer } }   Bonnie on his bike: s 23 x 23
                                                   (air 23 x 24), b 27 x 31
                                                   (air 27 x 32)
     surf:  { s, b: { ride, wobble } }            Bonnie surfing: s 22 x 19,
                                                   b 22 x 27
   }
   ========================================================================== */
(function () {
  'use strict';
  var A = BB.ART, K = A.kit, F = A.family = A.family || {};
  var ell = K.ell, cap = K.cap, limb = K.limb, rrect = K.rrect, scene = K.scene, stamp = K.stamp;

  /* ---- helpers (the same as creatures.js keeps privately) ---- */
  // a round shape lit from the top left and a little in front: t is a
  // ramp of five tones, deep to shine
  var orb = function (cx, cy, rx, ry, t) {
    return function (x, y) {
      var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, n = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy));
      var i = -0.48 * dx - 0.58 * dy + 0.66 * n;
      return i > 0.9 ? t[4] : i > 0.6 ? t[3] : i > 0.22 ? t[2] : i > -0.12 ? t[1] : t[0];
    };
  };
  var or = function () { var fs = arguments; return function (x, y) { for (var i = 0; i < fs.length; i++) if (fs[i](x, y)) return true; return false; }; };
  var both = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var but = function (a, b) { return function (x, y) { return a(x, y) && !b(x, y); }; };
  var tri = function (ax, ay, bx, by, cx, cy) {
    return function (x, y) {
      var s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by), s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy), s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
      return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
    };
  };
  // a tone k steps lighter (or darker, k < 0) along its ramp
  var step = function (t, ch, k) { var i = t.indexOf(ch); return i < 0 ? ch : t.charAt(Math.max(0, Math.min(t.length - 1, i + k))); };
  var P = function (c, f, tex, line) { return { c: c, f: f, tex: tex || null, line: line || null }; };
  // a capsule cut square at its far end: a sleeve, a trouser leg
  var sleeve = function (ax, ay, bx, by, r) {
    return function (x, y) {
      var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, t = ((x - ax) * dx + (y - ay) * dy) / L;
      if (t > 1) return false;
      t = Math.max(0, t);
      var px = ax + t * dx - x, py = ay + t * dy - y;
      return px * px + py * py <= r * r;
    };
  };
  // a point along a line, t of the way
  var along = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
  var merge = function () { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; };
  var paint = function (rows, pal, noLight) {
    var sp = BB.sprHi(rows, pal, 'shade');
    sp.noLight = noLight;
    return sp;
  };

  /* ==========================================================================
     LUKE AND LUCY — Bonnie's mum and dad, built the way Bonnie is: a head,
     then a body of parts on joints (a shoulder–elbow–hand line for each
     arm, hip–knee–foot for each leg), so a pose is a few numbers. Big
     friendly heads like his and the same eyes, but grown-up proportions:
     longer bodies and legs. 48 columns (24 game pixels) gives a raised
     hand room beside the head.
     ========================================================================== */
  var FW = 48;
  // Bonnie's own skin and eyes, so the three of them match: base, shade,
  // deeper shade, warm line; limbs' line; blush
  var SKIN = { s: '#ffdcc4', t: '#f5bb9a', u: '#e0947a', q: '#b4614f', S: '#e9a888', c: '#ffb2a8' };
  var EYES = { E: '#22224e', w: '#ffffff', I: '#4f86ea' };
  var EYE = ['EE', 'Ew', 'IE'], SHUT = ['..', 'EE'], JOY = ['.E.', 'E.E'];

  // bent: the sock follows the shin up from the foot (a straight standing
  // leg keeps the sock it has always had)
  var legParts = function (B, bent) {
    var parts = [];
    B.legs.forEach(function (L) {
      var hip = L[0], knee = L[1], foot = L[2];
      parts.push(P('s', limb([hip, knee, foot], B.leg), null, 'S'));
      var top = [foot[0], foot[1] - B.sockH];
      if (bent) { var sl = Math.hypot(knee[0] - foot[0], knee[1] - foot[1]) || 1; top = [foot[0] + (knee[0] - foot[0]) * B.sockH / sl, foot[1] + (knee[1] - foot[1]) * B.sockH / sl]; }
      parts.push(P(B.sock, cap(top[0], top[1], foot[0], foot[1] - 0.6, B.leg + 0.25), null, B.sockLine));
      // a trainer: a rounded toe, a heel, and a sole along the bottom
      var sy = foot[1] + 1.2;
      var shoe = or(ell(foot[0] + 1.1, sy, B.shoeRx, B.shoeRy), ell(foot[0] - 0.6, sy - 0.6, B.shoeRx * 0.62, B.shoeRy));
      var sole = function (x, y) { return y + 0.5 > sy + B.shoeRy - 1.6 ? B.sole : B.shoe; };
      if (bent && foot[1] < B.ground - 0.5) {
        // a foot off the ground points its toe square to the shin
        var sx0 = foot[0] - knee[0], sy0 = foot[1] - knee[1], an = Math.atan2(sx0, -sy0);
        if (Math.cos(an) < 0) an += Math.PI;
        var co = Math.cos(an), si = Math.sin(an), flat = shoe;
        var un = function (x, y) { var X = x - foot[0], Y = y - foot[1]; return [foot[0] + X * co + Y * si, foot[1] - X * si + Y * co]; };
        shoe = function (x, y) { var q = un(x, y); return flat(q[0], q[1]); };
        sole = function (x, y) { var q = un(x + 0.5, y + 0.5); return q[1] > sy + B.shoeRy - 1.6 ? B.sole : B.shoe; };
      }
      parts.push(P(B.shoe, shoe, sole, B.shoeLine));
    });
    return parts;
  };
  var armParts = function (B, arms) {
    var parts = [];
    arms.forEach(function (a, i) {
      var sh = B.sh[i], el = a[0], hd = a[1], up = a[2];
      parts.push(P('s', limb([sh, el, hd], B.arm), null, 'S'));
      var end = along(sh, el, B.sleeve);
      parts.push(P(B.top, sleeve(sh[0], sh[1], end[0], end[1], B.arm + B.sleeveW), B.topTex, B.topLine));
      var hand = ell(hd[0], hd[1] + (up ? -0.4 : 0.8), B.hand + (up ? 0.2 : 0), B.hand);
      if (up) {
        // fingers spread, palm out: a wave
        var fingers = [-2.2, -0.75, 0.75, 2.2].map(function (dx) { return cap(hd[0] + dx * 0.55, hd[1] - 1.4, hd[0] + dx * 1, hd[1] - 3.6 + Math.abs(dx) * 0.4, 0.9); });
        hand = or(hand, or.apply(null, fingers));
      }
      parts.push(P('s', hand, null, 'S'));
    });
    return parts;
  };
  var person = function (who, pose, kind) {
    var B = who.body;
    var parts = [].concat(
      who.behind ? who.behind() : [],
      legParts(B),
      who.shorts(),
      [P('s', cap(B.neck[0], B.neck[1], B.neck[2], B.neck[3], B.neckR), null, 'q')],
      who.top(),
      armParts(B, pose.arms),
      who.head()
    );
    var rows = scene(FW, who.H, parts);
    who.face(rows, kind);
    return paint(rows, who.pal, who.noLight);
  };
  // poses: [elbow, hand, open?] for the near arm (left) and the far arm (right)
  var posesFor = function (B) {
    var L = B.sh[0], R = B.sh[1], y = L[1];
    var down = [[L[0] - 1.4, y + 8.8], [L[0] - 1.1, y + 16.6]], downR = [[R[0] + 1.4, y + 8.8], [R[0] + 1.1, y + 16.6]];
    return {
      idle: { arms: [down, downR] },
      wave0: { arms: [down, [[R[0] + 7.2, y - 5], [R[0] + 10, y - 13], 1]] },
      wave1: { arms: [down, [[R[0] + 7.2, y - 5], [R[0] + 6.2, y - 14], 1]] },
      cheer: { arms: [[[L[0] - 6.8, y - 5.5], [L[0] - 8.2, y - 13.5], 1], [[R[0] + 6.8, y - 5.5], [R[0] + 8.2, y - 13.5], 1]] }
    };
  };
  var setOf = function (who) {
    var ps = posesFor(who.body);
    return {
      idle: person(who, ps.idle, 'idle'),
      blink: person(who, ps.idle, 'blink'),
      wave: [person(who, ps.wave0, 'wave'), person(who, ps.wave1, 'wave')],
      cheer: person(who, ps.cheer, 'cheer')
    };
  };

  /* A pose that bends the body, for running and stooping (person() above
     only moves the arms, so the standing frames are left exactly as they
     were). They're drawn nearly face on, so a stoop can't be a tip of the
     body sideways across the picture — that reads as falling over. It's a
     hunch: pose.hunch shortens the body (bending towards us), pose.lean
     tips it only a little, pose.drop sinks it (bent knees) and pose.shift
     carries it forward. pose.feet: where each foot goes, the knee found
     from the leg's own lengths, bending forward or (pose.knees, -1) back;
     pose.arms place the hands in the frame, after all that. The head is
     moved, never turned or squashed, so it stays exactly as drawn and
     rides on the neck. pose.shorts(legs, tilt) draws shorts round bent
     legs; pose.extra(at) adds parts in front, at = how far the head moved. */
  var kneeOf = function (hip, foot, L1, L2, dir) {
    var dx = foot[0] - hip[0], dy = foot[1] - hip[1], d = Math.max(0.01, Math.hypot(dx, dy)), dd = Math.min(d, L1 + L2 - 0.01);
    var a = (L1 * L1 - L2 * L2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), ux = dx / d, uy = dy / d;
    var k1 = [hip[0] + ux * a - uy * h, hip[1] + uy * a + ux * h], k2 = [hip[0] + ux * a + uy * h, hip[1] + uy * a - ux * h];
    // knees bend forward, whichever way the foot is (or back, dir -1)
    return (k1[0] > k2[0]) === (dir !== -1) ? k1 : k2;
  };
  var posed = function (who, pose, kind) {
    var B = who.body, piv = [(B.legs[0][0][0] + B.legs[1][0][0]) / 2, B.legs[0][0][1]], sx = pose.shift || 0, sy = pose.drop || 0;
    // shortened by sq and turned by an about the hips, then carried and
    // dropped: fwd takes a point of the standing body into the frame,
    // back the other way
    var turn = function (an, sq) {
      var co = Math.cos(an), si = Math.sin(an);
      return {
        fwd: function (p) { var x = p[0] - piv[0], y = (p[1] - piv[1]) * sq; return [piv[0] + x * co - y * si + sx, piv[1] + x * si + y * co + sy]; },
        back: function (X, Y) { var x = X - sx - piv[0], y = Y - sy - piv[1]; return [piv[0] + x * co + y * si, piv[1] + (-x * si + y * co) / sq]; }
      };
    };
    var trunk = turn(pose.lean || 0, pose.hunch || 1), hips = turn(pose.hipLean === undefined ? pose.lean || 0 : pose.hipLean, 1);
    var tiltBy = function (T) {
      return function (p) {
        return { c: p.c, line: p.line, f: function (x, y) { var q = T.back(x, y); return p.f(q[0], q[1]); },
          tex: p.tex ? function (x, y) { var q = T.back(x + 0.5, y + 0.5); return p.tex(Math.floor(q[0]), Math.floor(q[1])); } : null };
      };
    };
    // the head moves by whole pixels, so it is drawn exactly as it always is
    var nt = [B.neck[0], B.neck[1]], nm = trunk.fwd(nt), hx = Math.round(nm[0] - nt[0]), hy = Math.round(nm[1] - nt[1]);
    var move = function (p) {
      return { c: p.c, line: p.line, f: function (x, y) { return p.f(x - hx, y - hy); }, tex: p.tex ? function (x, y) { return p.tex(x - hx, y - hy); } : null };
    };
    var L0 = B.legs[0], thigh = Math.hypot(L0[1][0] - L0[0][0], L0[1][1] - L0[0][1]), shin = Math.hypot(L0[2][0] - L0[1][0], L0[2][1] - L0[1][1]);
    var legs = pose.feet.map(function (foot, i) { var hip = hips.fwd(B.legs[i][0]); return [hip, kneeOf(hip, foot, thigh, shin, (pose.knees || [])[i]), foot]; });
    var LB = merge(B, { legs: legs, ground: B.legs[0][2][1] }), nb = trunk.fwd([B.neck[2], B.neck[3]]);
    var parts = [].concat(
      who.behind ? who.behind().map(move) : [],
      legParts(LB, true),
      pose.shorts ? pose.shorts(legs, tiltBy(hips)) : who.shorts().map(tiltBy(hips)),
      [P('s', cap(B.neck[0] + hx, B.neck[1] + hy, nb[0], nb[1], B.neckR), null, 'q')],
      who.top().map(tiltBy(trunk)),
      armParts(merge(B, { sh: B.sh.map(trunk.fwd) }), pose.arms),
      who.head().map(move),
      pose.extra ? pose.extra([hx, hy]) : []
    );
    var rows = scene(FW, who.H, parts);
    // the face, stamped where the head now is
    var H = rows.length, tmp = [], x, y;
    for (y = 0; y < H; y++) {
      var r = '';
      for (x = 0; x < FW; x++) { var X = x + hx, Y = y + hy; r += X >= 0 && Y >= 0 && X < FW && Y < H ? rows[Y].charAt(X) : '.'; }
      tmp.push(r);
    }
    var was = tmp.slice();
    who.face(tmp, kind);
    for (y = 0; y < H; y++) {
      if (tmp[y] === was[y] || !rows[y + hy]) continue;
      var out = rows[y + hy].split('');
      for (x = 0; x < FW; x++) if (tmp[y].charAt(x) !== was[y].charAt(x) && x + hx >= 0 && x + hx < FW) out[x + hx] = tmp[y].charAt(x);
      rows[y + hy] = out.join('');
    }
    return paint(rows, who.pal, who.noLight);
  };

  /* ---- Lucy -----------------------------------------------------------------
     From the portrait and the Disney day: straight mid-brown hair past her
     shoulders, parted in the middle; big black rectangular glasses; small
     gold hoops; a warm smile. Her oversized pink tee, black cycling shorts,
     white socks, and her trainers — black with white soles, as in the
     Disney photo (z, Z and x below, if they should be white). */
  (function () {
    var cx = 26, cy = 16.5, HAIR = '12345';
    var pal = merge(SKIN, EYES, {
      1: '#3c2216', 2: '#5c3622', 3: '#7e5034', 4: '#a3714a', 5: '#c99a6c',
      g: '#211a26', G: '#8a8ca8', y: '#ffd23c', Y: '#c98a12', m: '#b8475e', h: '#ffffff',
      a: '#e2709f', A: '#ae4479',
      k: '#33303e', K: '#1d1a26',
      W: '#ffffff', V: '#d6daea',
      z: '#2a2633', Z: '#141119', x: '#f4f4fa'
    });
    var noLight = '12345stuqESwIcgGyYmhxz';
    var body = {
      sh: [[16.4, 31.5], [32.8, 31.5]], arm: 2.1, hand: 2.1, sleeve: 0.72, sleeveW: 1.7,
      legs: [[[21.4, 50], [21.2, 61], [21, 72.4]], [[27.6, 50], [27.8, 61], [28, 72.4]]],
      leg: 2.1, sock: 'W', sockLine: 'V', sockH: 3, shoe: 'z', sole: 'x', shoeLine: 'Z', shoeRx: 3.3, shoeRy: 2,
      neck: [26, 23, 25.8, 30], neckR: 2.3,
      top: 'a', topLine: 'A', topTex: null
    };
    // the hairline: high at the parting, falling away to each temple
    var hairline = function (x) { return 7 + 0.08 * (x - 26.5) * (x - 26.5); };
    var crownF = ell(25, 12.2, 11.2, 11);
    var faceF = function (x, y) {
      var ry = 9.2, rx = 8.3 * (y > cy + 1 ? 1 - 0.3 * Math.min(1, (y - cy - 1) / (ry - 1)) : 1);
      var dx = (x - cx) / rx, dy = (y - cy) / ry;
      return dx * dx + dy * dy <= 1;
    };
    // the crown: lit from the top left, a sheen in a band across it, and
    // strands running out from the parting
    var crownTex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = orb(23, 9, 12.5, 11, HAIR)(x, y);
      var dx = (X - 25) / 11.2, dy = (Y - 12.2) / 11, d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0.62 && d < 0.8 && X < 30 && Y < 10) t = step(HAIR, t, 1);
      if (Math.floor(Math.atan2(Y - 1, X - 26.4) * 8 + 100) % 3 === 0) t = step(HAIR, t, -1);
      return t;
    };
    // a curtain of straight hair between left(y) and right(y), down to `end`:
    // lit along its left edge, shaded along its right, a strand or two
    // between, and the ends a shade deeper
    var curtain = function (left, right, top, end, lit) {
      return {
        f: function (x, y) { return y > top && y < end(x) && x > left(y) && x < right(y); },
        tex: function (x, y) {
          var X = x + 0.5, Y = y + 0.5, l = left(Y), r = right(Y), u = (X - l) / (r - l), t = '3';
          if (u < 0.3 && lit) t = '4';
          else if (u > 0.72) t = '2';
          if (Y < 13) t = step(HAIR, t, 1);
          if (Y > end(X) - 3) t = step(HAIR, t, -1);
          if (Math.floor(X) === Math.floor(l + (r - l) * 0.55) && Y > 16) t = step(HAIR, t, -1);
          return t;
        }
      };
    };
    // each curtain's ends are cut in a soft curve, longest in the middle
    var tips = function (mid, half, len) { return function (x) { var u = (x - mid) / half; return len - u * u * 2.2; }; };
    var near = curtain(function () { return 13.6; }, function (y) { return y < 25 ? 19.4 : 19.8; }, 8, tips(16.8, 3.4, 39.5), true);
    var far = curtain(function (y) { return y < 22 ? 31 + (y - 8) * 0.12 : 32.8; }, function (y) { return 36.3 + Math.min(0.8, Math.max(0, y - 14) * 0.05); }, 7,
      tips(34.8, 2.6, 38.5), false);
    var LUCY = {
      H: 76, pal: pal, noLight: noLight, body: body,
      // the hair behind her head and shoulders, in shadow
      behind: function () {
        return [P('1', or(ell(25, 13, 11.4, 11.4), rrect(14.4, 12, 35.6, 36, 4)), null, '1')];
      },
      shorts: function () {
        // cycling shorts: snug, to mid-thigh
        return [P('k', or(rrect(17.8, 46, 31.2, 52, 2), sleeve(21.4, 48.5, 21.2, 57.5, 3.2), sleeve(27.6, 48.5, 27.8, 57.5, 3.2)),
          function (x, y) { return (x === 24 && y > 51) ? 'K' : 'k'; }, 'K')];
      },
      top: function () {
        // an oversized tee: boxy, dropped shoulders, a crew neck
        var tee = but(or(rrect(14.4, 28.5, 34.6, 50.5, 4.5), rrect(13.8, 33, 35.2, 50.5, 2.5)), ell(25.8, 28.4, 2.7, 1.9));
        return [P('a', tee, function (x, y) { return (y > 47 && (x === 18 || x === 31)) ? 'A' : 'a'; }, 'A')];
      },
      head: function () {
        return [
          P('3', near.f, near.tex, '1'),
          P('3', far.f, far.tex, '1'),
          P('s', ell(18.2, 16.4, 1.9, 2.6), function (x, y) { return x < 18 && y > 15 && y < 18 ? 'u' : 's'; }, 'q'),
          P('s', faceF, function (x, y) {
            if (y < hairline(x + 0.5) + 1.6) return 't';
            if (x < 20 || y > 24) return 't';
            return 's';
          }, 'q'),
          P('3', both(crownF, function (x, y) { return y < hairline(x); }), crownTex, '1')
        ];
      },
      face: function (rows, kind) {
        stamp(rows, 20, 18, ['cc']); stamp(rows, 30, 18, ['cc']);
        // glasses: chunky black frames, the near lens wider (she's turned a
        // little to the right), a glint in each, the arm back to her ear
        stamp(rows, 20, 11, [
          'gggggggggggg',
          'gG...gggG..g',
          'g....g.g...g',
          'g....g.g...g',
          'g....g.g...g',
          '.gggg...ggg.'
        ]);
        stamp(rows, 18, 12, ['gg']);
        var eye = kind === 'blink' ? SHUT : kind === 'cheer' ? JOY : EYE;
        stamp(rows, 22, 13, eye); stamp(rows, 29, 13, eye);
        stamp(rows, 21, 9, ['222']); stamp(rows, 28, 9, ['222']);
        var mouth = kind === 'cheer' || kind === 'wave' ? [24, 20, ['mmmmm', 'mhhhm', '.mmm.']] : [24, 20, ['m...m', '.mmm.']];
        stamp(rows, mouth[0], mouth[1], mouth[2]);
        // a small gold hoop under her ear
        stamp(rows, 16, 18, ['.y.', 'y.Y', 'y.Y', '.Y.']);
      }
    };
    F.lucy = setOf(LUCY);
  })();

  /* ---- Luke -----------------------------------------------------------------
     From the portrait: a big mop of curly ginger-brown hair, a moustache
     and a short stubbly beard, fair skin and a warm smile; the cream shirt
     with the bold black squiggles; light-blue denim shorts with a frayed
     hem; white socks and white trainers on gum soles. */
  (function () {
    var cx = 26, cy = 19.5, HAIR = '12345';
    var pal = merge(SKIN, EYES, {
      1: '#4a2412', 2: '#74391a', 3: '#9c5a2a', 4: '#c47e40', 5: '#e8b070',
      b: '#e8b08e', B: '#d29470', m: '#a8404c', h: '#ffffff',
      v: '#f5e8d0', V: '#c9b48e', Z: '#25202e',
      j: '#a3c3df', J: '#6c8db4', x: '#e8f0f8',
      W: '#ffffff', X: '#d6daea',
      z: '#f2f2f6', Y: '#c48a4c', N: '#9ca0b4'
    });
    var noLight = '12345stuqESwIcbBmhZYx';
    // the shirt's print: bold black blobs and dashes, set out on a loose grid
    var TILE = [
      '............',
      '.ZZ.........',
      '.ZZZ....ZZ..',
      '..ZZ...ZZ...',
      '.......ZZ...',
      '........ZZ..',
      '............',
      '....ZZ......',
      '...ZZ....ZZ.',
      '....ZZ...ZZ.'
    ];
    var printAt = function (x, y) {
      var row = Math.floor((y - 28) / 10), off = (row & 1) ? 6 : 0;
      var u = ((x - 13 + off) % 12 + 12) % 12, v = ((y - 28) % 10 + 10) % 10;
      return TILE[v].charAt(u) === 'Z';
    };
    var shirtTex = function (x, y) { return printAt(x, y) ? 'Z' : 'v'; };
    var body = {
      sh: [[16.4, 33], [33, 33]], arm: 2.2, hand: 2.2, sleeve: 0.6, sleeveW: 1.5,
      legs: [[[21, 53], [20.8, 64.5], [20.6, 76.4]], [[27.6, 53], [27.8, 64.5], [28, 76.4]]],
      leg: 2.2, sock: 'W', sockLine: 'X', sockH: 4.8, shoe: 'z', sole: 'Y', shoeLine: 'N', shoeRx: 3.5, shoeRy: 2,
      neck: [26, 26, 25.6, 31.5], neckR: 2.6,
      top: 'v', topLine: 'V', topTex: shirtTex
    };
    // his hair: a big mop of curls. The silhouette is a cloud of round
    // bumps; inside, each curl is a small ring, lit on its upper left and
    // shaded round its lower right, over the light falling on the whole mop
    var core = { x: 24.8, y: 9.6, rx: 11.4, ry: 6 }, CURLS = [], i;
    for (i = 0; i < 11; i++) {
      var th = (172 + i * 196 / 10) * Math.PI / 180;
      CURLS.push([core.x + core.rx * Math.cos(th) * 0.92, core.y + core.ry * Math.sin(th) * 0.9, i & 1 ? 2.8 : 3.2]);
    }
    // ringlets falling over his forehead, a little of it showing between them
    CURLS.push([19.2, 11.8, 2.1], [23.4, 12.2, 2.1], [27.6, 12, 2], [31.6, 11.6, 2]);
    var mopF = or(both(ell(core.x, core.y, core.rx, core.ry), function (x, y) { return y < 12.5; }), or.apply(null, CURLS.map(function (c) { return ell(c[0], c[1], c[2], c[2]); })));
    // the back of his head, behind his ear: shorter curls
    var backF = ell(17.4, 15.6, 4.4, 5.6);
    CURLS.push([15.6, 15.4, 2.3], [17.6, 18.6, 2]);
    // inside, more curls on a staggered grid
    for (var gy = 4.5; gy < 12; gy += 3.2) for (var gx = 15 + (Math.round(gy) % 2) * 2; gx < 35; gx += 4) {
      if (ell(core.x, core.y, core.rx - 2, core.ry - 1.2)(gx, gy)) CURLS.push([gx, gy, 2.3]);
    }
    var mopLit = orb(22.5, 7.5, 14.5, 10, HAIR);
    var mopTex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, t = mopLit(x, y), best = null, bd = 1e9;
      CURLS.forEach(function (c) { var d = ((X - c[0]) * (X - c[0]) + (Y - c[1]) * (Y - c[1])) / (c[2] * c[2]); if (d < bd) { bd = d; best = c; } });
      var dx = X - best[0], dy = Y - best[1], r = Math.sqrt(bd), a = Math.atan2(dy, dx);
      // each curl: a darker ring round its lower right, a lit top left
      if (r > 0.62 && a > -0.5 && a < 2.6) return step(HAIR, t, -1);
      if (r < 0.5 && dx < 0.3 && dy < 0.3) return step(HAIR, t, 1);
      return t;
    };
    var faceF = function (x, y) {
      var ry = 9.4, rx = 8.6 * (y > cy + 1.5 ? 1 - 0.22 * Math.min(1, (y - cy - 1.5) / (ry - 1.5)) : 1);
      var dx = (x - cx) / rx, dy = (y - cy) / ry;
      return dx * dx + dy * dy <= 1;
    };
    // the beard: short stubble along his jaw and round his chin
    var beardAt = function (x, y) { return y > cy + 3 - Math.max(0, 22 - x) * 0.4 + Math.max(0, x - 31) * 0.4 || (x < 20.6 && y > cy - 0.5); };
    var LUKE = {
      H: 80, pal: pal, noLight: noLight, body: body,
      shorts: function () {
        // denim shorts to just above the knee, the hem frayed
        var hem = 62;
        return [P('j', or(rrect(16.8, 48, 31.8, 55, 2), sleeve(21, 52, 20.8, hem, 3.6), sleeve(27.6, 52, 27.8, hem, 3.6)),
          function (x, y) {
            if (y >= hem - 1.5) return (x & 1) ? 'x' : 'j';
            return (x === 24 && y > 54) ? 'J' : 'j';
          }, 'J')];
      },
      top: function () {
        // a short-sleeved shirt, worn loose, with an open collar
        var shirt = rrect(14.8, 30, 34.4, 52.5, 3.5);
        var vneck = function (x, y) { return y >= 29 && y < 35.5 && Math.abs(x - 25.8) < (35.5 - y) * 0.5; };
        var collar = or(tri(21.4, 29.6, 25.4, 35.4, 23.2, 32.4), tri(30.2, 29.6, 26.2, 35.4, 28.4, 32.4));
        return [
          P('v', shirt, shirtTex, 'V'),
          P('s', both(shirt, vneck), null, 'q'),
          P('v', collar, null, 'V')
        ];
      },
      head: function () {
        return [
          P('2', backF, mopTex, '1'),
          P('s', ell(17.8, 20.2, 2.1, 2.8), function (x, y) { return x < 17.5 && y > 18.5 && y < 21.5 ? 'u' : 's'; }, 'q'),
          P('s', faceF, function (x, y) {
            // stubble: a fine stipple of two close tones, thicker on his chin
            if (beardAt(x + 0.5, y + 0.5)) return y > cy + 6.5 && x > 22 && x < 30 ? 'B' : (x + y) & 1 ? 'B' : 'b';
            if (y < 14.5 || x < 20) return 't';
            return 's';
          }, 'q'),
          P('3', mopF, mopTex, '1')
        ];
      },
      face: function (rows, kind) {
        stamp(rows, 20, 20, ['cc']); stamp(rows, 31, 20, ['cc']);
        var eye = kind === 'blink' ? SHUT : kind === 'cheer' ? JOY : EYE;
        stamp(rows, 22, 16, eye); stamp(rows, 28, 16, eye);
        stamp(rows, 21, 14, ['222']); stamp(rows, 28, 14, ['222']);
        stamp(rows, 27, 20, ['t']);
        // the moustache, then the smile under it
        stamp(rows, 23, 22, ['.333.', '23332']);
        var mouth = kind === 'cheer' ? [23, 24, ['mmmmm', 'mhhhm', '.mmm.']] : kind === 'wave' ? [23, 24, ['mhhhm', '.mmm.']] : [22, 24, ['m.....m', '.mmmmm.']];
        stamp(rows, mouth[0], mouth[1], mouth[2]);
      }
    };
    F.luke = setOf(LUKE);

    /* Running alongside Bonnie's bike at the start of level 33, holding
       the seat: stooped forward, his far arm reaching down and ahead, the
       near one swinging; then, when he's let go, puffed out — hands on his
       knees, a bead of sweat, grinning. His shorts bend with his legs: the
       waistband turns with his hips and each leg of them runs down its
       thigh to the frayed hem. */
    var bentShorts = function (legs, tilt) {
      var LEN = 10, legsOf = legs.map(function (L) {
        var h = L[0], k = L[1], d = Math.hypot(k[0] - h[0], k[1] - h[1]), u = [(k[0] - h[0]) / d, (k[1] - h[1]) / d], a = [h[0] - u[0], h[1] - u[1]];
        return { a: a, u: u, f: sleeve(a[0], a[1], a[0] + u[0] * LEN, a[1] + u[1] * LEN, 3.6) };
      });
      var band = tilt(P('j', rrect(16.8, 48, 31.8, 55, 2), function (x, y) { return x === 24 && y > 54 ? 'J' : 'j'; }, 'J'));
      // how far down leg i of the shorts a point is (-1 if it isn't in it)
      var down = function (i, X, Y) { var s = legsOf[i]; return s.f(X, Y) ? (X - s.a[0]) * s.u[0] + (Y - s.a[1]) * s.u[1] : -1; };
      return [P('j', or(band.f, legsOf[0].f, legsOf[1].f), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, d0 = down(0, X, Y), d1 = down(1, X, Y), hem = LEN - 1.5;
        // the frayed hem, only where it's the end of the shorts (not where
        // one leg's hem lies across the other leg or the waistband)
        var frayed = (d0 >= hem && !(d1 >= 0 && d1 < hem)) || (d1 >= hem && !(d0 >= 0 && d0 < hem));
        if (frayed && !band.f(X, Y)) return (x & 1) ? 'x' : 'j';
        return band.f(X, Y) ? band.tex(x, y) : 'j';
      }, 'J')];
    };
    pal.d = '#c8eeff'; pal.D = '#4f8fd0';
    // running: hunched a touch and leaning in, the far hand out low and
    // ahead on the seat, the near arm swinging with his stride
    var RUN = { lean: 0.2, hipLean: 0.05, hunch: 0.88, shift: -1.5, drop: 2, shorts: bentShorts };
    var SEAT = [[39.4, 46.4], [43, 53.6]];
    F.luke.run = [
      posed(LUKE, merge(RUN, { feet: [[11, 69.5], [32, 76.4]], arms: [[[21, 43], [25.6, 47]], SEAT] }), 'wave'),
      posed(LUKE, merge(RUN, { feet: [[25.5, 76.4], [16.5, 70]], arms: [[[14.6, 42.5], [11.6, 48.6]], SEAT] }), 'wave')
    ];
    // a bead of sweat flying off the back of his head
    var drop = function (at) {
      var x = 7.4 + at[0], y = 8.6 + at[1];
      return [P('d', or(ell(x, y + 1.8, 2, 2.2), tri(x - 1.8, y + 1.3, x + 1.8, y + 1.3, x + 1.2, y - 2.6)), function (xx, yy) { return xx + 0.5 < x && yy + 0.5 < y + 1.6 ? 'h' : 'd'; }, 'D')];
    };
    // puffed: bent over towards us, knees out, hands on them, grinning
    F.luke.puff = posed(LUKE, { lean: 0.1, hipLean: 0, hunch: 0.6, shift: 1, drop: 6, knees: [-1, 1], shorts: bentShorts, extra: drop,
      feet: [[17.5, 76.4], [31, 76.4]], arms: [[[15.4, 55], [13.8, 62.4]], [[36.8, 56], [36.6, 62.6]]] }, 'cheer');
  })();

  /* A scene of parts with stamps on top, painted in its own palette and
     lit entirely by its textures (like creatures.js's build). */
  var build = function (W, H, parts, stamps, pal) {
    var rows = scene(W, H, parts);
    (stamps || []).forEach(function (s) { stamp(rows, s[0], s[1], s[2]); });
    return paint(rows, pal, 'all');
  };
  // a polygon, its corners rounded by r: each corner is cut back along its
  // two edges and bridged with a curve
  var poly = function (pts, r) {
    var path = [];
    if (r) {
      pts.forEach(function (p, i) {
        var a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
        var la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
        var rr = Math.min(r, la / 2, lb / 2), p0 = along(p, a, rr / la), p2 = along(p, b, rr / lb);
        for (var k = 0; k <= 6; k++) {
          var t = k / 6, u = 1 - t;
          path.push([u * u * p0[0] + 2 * u * t * p[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p[1] + t * t * p2[1]]);
        }
      });
    } else path = pts;
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    path.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return function (x, y) {
      if (x < x0 || x > x1 || y < y0 || y > y1) return false;
      var c = false;
      for (var i = 0, j = path.length - 1; i < path.length; j = i++) {
        var xi = path[i][0], yi = path[i][1], xj = path[j][0], yj = path[j][1];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
  };

  /* ==========================================================================
     BROCCO — Bonnie's broccoli, Monsty's best friend, and the same size as
     Monsty. From the toy: three soft bumpy florets of dark green fleece on
     top (bobbly, puckered into lobes), a lighter green plush stalk for a
     body, wider at the bottom, two black dot eyes and a stitched smile.
     ========================================================================== */
  (function () {
    // Monsty's size, 15 x 19 game pixels, at full density (fixed here, as
    // the florets and face are placed by hand in this frame)
    var W = 30, H = 38;
    var FLEECE = 'abcde', BACK = 'aabcd', PLUSH = 'fghij';
    var pal = {
      '#': '#1c1428',
      a: '#0f3320', b: '#174a2c', c: '#215f37', d: '#2f7645', e: '#4c935c',
      f: '#2e7a3c', g: '#45984c', h: '#5fb35e', i: '#84cb78', j: '#b4e6a2',
      E: '#1a1420', w: '#ffffff', m: '#b83a52', n: '#ff8c9c', p: '#f7a0a0'
    };
    // a floret: a cluster of lobes in fleece, lit as one round shape, each
    // lobe a soft bump of its own, puckered seams between them, flecked
    // with bobbles
    var floret = function (lobes, tones) {
      var n = lobes.length, cx = 0, cy = 0, R = 0;
      lobes.forEach(function (c) { cx += c[0] / n; cy += c[1] / n; });
      lobes.forEach(function (c) { R = Math.max(R, Math.hypot(c[0] - cx, c[1] - cy) + c[2]); });
      var lit = orb(cx - 0.6, cy - 0.6, R, R * 0.92, tones);
      return P('c', or.apply(null, lobes.map(function (c) { return ell(c[0], c[1], c[2], c[2]); })), function (x, y) {
        var X = x + 0.5, Y = y + 0.5, d1 = 9, d2 = 9, best = null, t = lit(x, y);
        lobes.forEach(function (c) {
          var d = Math.hypot(X - c[0], Y - c[1]) / c[2];
          if (d < d1) { d2 = d1; d1 = d; best = c; } else if (d < d2) d2 = d;
        });
        var dx = X - best[0], dy = Y - best[1];
        if (d2 - d1 < 0.16) t = step(tones, t, -2);
        else if (d1 > 0.62 && dx + dy > 0.8) t = step(tones, t, -1);
        else if (d1 < 0.5 && dx + dy < -0.4) t = step(tones, t, 1);
        if ((x * 7 + y * 3) % 11 === 0) return step(tones, t, 1);
        if ((x * 5 + y * 7) % 13 === 0) return step(tones, t, -1);
        return t;
      }, 'a');
    };
    var frame = function (mood) {
      var sq = mood === 'happy' ? 1 : 0;
      // the stalk: a soft column, wider at the bottom, its corners rounded
      var top = 17 + sq * 1.5, bot = H - 0.4, cx = W / 2;
      var hw = function (y) { return 5.6 + sq * 0.7 + (y - top) * 0.055; };
      var stalk = function (x, y) {
        if (y < top || y > bot) return false;
        var w = hw(y), dx = Math.abs(x - cx);
        if (dx > w) return false;
        if (y > bot - 2.6 && dx > w - 2.6) { var ex = dx - (w - 2.6), ey = y - (bot - 2.6); return ex * ex + ey * ey <= 6.76; }
        return true;
      };
      var lit = orb(cx - 2, top + 8, 9.5, 15, PLUSH);
      var parts = [P('h', stalk, function (x, y) { return y < top + 3.5 ? step(PLUSH, lit(x, y), -1) : lit(x, y); }, 'f')];
      // little branches, peeking out between the florets
      var dy = sq * 1.5, sp = sq * 0.6;
      [[11.2, 20, 8, 15], [18.8, 20, 22, 15.5], [15, 19, 15, 12]].forEach(function (b) {
        parts.push(P('h', cap(b[0], b[1] + dy, b[2], b[3] + dy, 2.2), orb(b[2] - 1, b[3] + dy, 4, 5, PLUSH), 'f'));
      });
      // the florets, the middle one furthest back
      var mid = [[11.2, 8, 3.9], [15.4, 5.2, 4.2], [19.6, 7.8, 3.8], [15.4, 10, 3.7]];
      var left = [[4.4, 13.8, 3.5], [7.6, 10.4, 3.9], [11, 13.2, 3.7], [7.2, 16.8, 3.3]];
      var right = [[19.4, 13.8, 3.6], [22.6, 10.6, 3.9], [25.6, 14, 3.5], [22.4, 17.2, 3.2]];
      var move = function (sx) { return function (c) { return [c[0] + sx, c[1] + dy, c[2]]; }; };
      parts.push(floret(mid.map(move(0)), BACK), floret(left.map(move(-sp)), FLEECE), floret(right.map(move(sp)), FLEECE));
      var ey = 24 + Math.round(dy), st = [];
      if (mood === 'happy') {
        st.push([10, ey, ['.E.', 'E.E']], [17, ey, ['.E.', 'E.E']], [8, ey + 3, ['pp']], [20, ey + 3, ['pp']]);
        st.push([11, ey + 3, ['EEEEEEEE', '.EmmmmE.', '..EnnE..', '...EE...']]);
      } else if (mood === 'worried') {
        st.push([10, ey - 2, ['..E', 'EE.']], [17, ey - 2, ['E..', '.EE']]);
        st.push([11, ey, ['Ew', 'EE']], [17, ey, ['Ew', 'EE']]);
        st.push([13, ey + 4, ['.EE.', 'E..E']]);
      } else {
        st.push([11, ey, ['Ew', 'EE']], [17, ey, ['Ew', 'EE']]);
        st.push([10, ey + 3, ['E........E', '.E......E.', '..EEEEEE..']]);
      }
      return build(W, H, parts, st, pal);
    };
    F.brocco = { idle: frame('idle'), happy: frame('happy'), worried: frame('worried') };
  })();

  /* ==========================================================================
     THE YETI — the family car, a 2015 Skoda Yeti in metallic dark grey,
     side on and facing right (bonnet on the right): boxy and upright, a
     near-vertical tailgate, black plastic round the arches and along the
     sills, silver roof rails, dark tinted windows between chunky black
     pillars, and multi-spoke silver alloys. No badges, no number plate.
     `side` is the car alone; `full` has the family in it — Luke at the
     wheel, Lucy beside him, Bonnie's blond curls in the back. Each has two
     frames, the wheels a half-spoke round between them.
     ========================================================================== */
  (function () {
    var W = 128, H = 60;
    var pal = {
      '#': '#1c1428',
      1: '#283033', 2: '#3d4649', 3: '#566064', 4: '#76828a', 5: '#a2aeb4', 6: '#d4dee2',
      k: '#2a2c31', K: '#18191c', l: '#43464d',
      g: '#202833', G: '#141a24', o: '#36485c', O: '#5c7690',
      R: '#7c858a', r: '#b4bcc0', e: '#e2e8ea', d: '#34383f',
      t: '#1d1b22', T: '#2c2a33', U: '#403e48',
      x: '#eef6ff', X: '#a9bccf',
      y: '#d8343a', Y: '#ff8a7c', z: '#8a1c26',
      // the family, seen through the glass
      s: '#f6cfb4', S: '#d99c80', q: '#a8604c', E: '#22224e', w: '#ffffff',
      a: '#a0582c', A: '#6c3518', b: '#e0a684',
      c: '#8a5534', C: '#5a3420', n: '#211a26',
      v: '#f2e4cc', V: '#25202e', u: '#e2709f',
      h: '#f4c862', H: '#d99a40', i: '#fff2c0', j: '#3a6cf4', J: '#1f40a8', m: '#a8404c', p: '#ffb2a8'
    };
    var WY = 49, WR = 10.8, WHEELS = [26.5, 101.5];
    var bodyF = poly([[3, 50.5], [2.4, 43], [3.2, 30], [4.4, 12], [8, 6.8], [84, 6.4], [87.4, 7.8], [104.4, 27.4], [115, 28.6], [122, 30], [126.2, 34], [126.6, 42], [125.2, 50.5]], 3);
    var nearWheel = function (x, y, r) { return WHEELS.some(function (cx) { return (x - cx) * (x - cx) + (y - WY) * (y - WY) <= r * r; }); };
    // the paint: lit along the shoulder under the windows, a soft
    // reflection of the horizon across the doors, darker low down, a crease
    // with a lit lip, the bonnet catching the sky
    var paintTex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5;
      if (X > 100 && Y < 30.4 + (X - 104) * 0.12) return X > 119 ? '4' : '5';
      if (Y < 10) return '4';
      if (X < 6.5) return Y < 31 ? '3' : '2';
      if (Y < 28.8) return '3';
      if (Y < 30.4) return X > 14 && X < 97 && Math.floor(X) % 9 !== 0 ? '6' : '5';
      if (Y < 32.4) return '4';
      if (Y < 37) return '3';
      if (Y < 39) return '2';
      if (Y < 40) return '3';
      if (Y < 41) return '1';
      if (Y < 42) return '4';
      return Y < 45.5 ? '2' : '1';
    };
    var glass = function (pts) { return poly(pts, 1.4); };
    var WIN = [
      glass([[11.4, 9.6], [29.4, 9.6], [29.4, 27.8], [10.8, 27.8]]),
      glass([[33.6, 9.6], [60, 9.6], [60, 27.8], [33.6, 27.8]]),
      glass([[64.4, 9.6], [82.8, 9.6], [99, 27.6], [64.4, 27.8]])
    ];
    var inGlass = or.apply(null, WIN);
    // tinted glass: darker at the top, two streaks of reflected sky
    var glassTex = function (x, y) {
      var X = x + 0.5, Y = y + 0.5, d = ((X - Y * 0.9) % 30 + 30) % 30;
      if (Y < 11.1) return 'G';
      if (d < 2) return 'O';
      if (d < 5.5 || (d > 7 && d < 8.4)) return 'o';
      return 'g';
    };
    var wheel = function (cx, rot) {
      var RIM = WR * 0.72, lit = orb(cx, WY, RIM, RIM, 'RRrre');
      return [
        P('t', ell(cx, WY, WR, WR), function (x, y) {
          var dx = x + 0.5 - cx, dy = y + 0.5 - WY, r = Math.sqrt(dx * dx + dy * dy);
          return r > WR - 1.5 ? (dx + dy < -4 ? 'U' : 't') : 'T';
        }, 'K'),
        P('r', ell(cx, WY, RIM, RIM), function (x, y) {
          var dx = x + 0.5 - cx, dy = y + 0.5 - WY, r = Math.sqrt(dx * dx + dy * dy);
          if (r > RIM - 0.9) return lit(x, y);
          if (r < 1.1) return 'e';
          if (r < 2.2) return lit(x, y);
          // ten slim spokes, with a little twist to them, as the alloys have
          var a = Math.atan2(dy, dx) + rot + r * 0.08, k = Math.PI / 5;
          var off = Math.abs(((a % k) + k) % k - k / 2) * r;
          return off < 0.62 ? lit(x, y) : off < 0.95 ? 'R' : 'd';
        }, 'R')
      ];
    };
    // the family in the car, drawn small and clipped to the glass
    var family = function () {
      var inside = function (f) { return both(f, inGlass); };
      return [
        // Bonnie, in the back: his golden hair swept across, his blue jumper
        P('j', inside(rrect(41.6, 24.2, 54, 32, 3)), null, 'J'),
        P('s', inside(ell(48.8, 20.4, 3.7, 3.9)), function (x) { return x < 46.5 ? 'S' : 's'; }, 'q'),
        P('h', inside(or(ell(47.8, 17.2, 4.6, 2.8), ell(44.8, 19.6, 2.1, 2.9), ell(51.6, 17.6, 2.2, 1.5), cap(46.6, 15, 49.4, 13.8, 1.1))), function (x, y) {
          var X = x + 0.5, Y = y + 0.5;
          if (Y < 15.4) return 'i';
          return Math.floor(X - Y * 1.6 + 40) % 4 === 0 ? 'H' : 'h';
        }, 'H'),
        // Lucy, beside him: brown hair down past her shoulders, her glasses,
        // her pink tee
        P('u', inside(rrect(64.6, 24.4, 77, 32, 3)), null, 'q'),
        P('c', inside(or(ell(70.6, 18.2, 4.8, 4.6), rrect(65.6, 18, 75.4, 26.6, 2))), function (x) { return x + 0.5 < 67.8 ? 'C' : 'c'; }, 'C'),
        P('s', inside(ell(72, 20, 3.6, 4)), function (x) { return x < 69.6 ? 'S' : 's'; }, 'q'),
        P('c', inside(function (x, y) { return ell(70.6, 18.2, 4.8, 4.6)(x, y) && y < 17.2 + Math.max(0, 70.6 - x) * 0.5 + Math.max(0, x - 73) * 0.4; }), null, 'C'),
        // Luke, at the wheel: curly ginger-brown hair, beard, cream shirt
        P('v', inside(rrect(77.4, 24.4, 92, 32, 3)), function (x, y) { return (x * 3 + y * 5) % 7 === 0 ? 'V' : 'v'; }, 'V'),
        P('s', inside(ell(84.4, 20, 3.8, 4.3)), function (x, y) {
          if (y + 0.5 > 21.8 || (x < 81.4 && y > 19)) return 'b';
          return x < 82 ? 'S' : 's';
        }, 'q'),
        P('a', inside(or(ell(83.2, 15.8, 4.8, 2.9), ell(80, 18, 2.2, 2.6), ell(86.8, 15.4, 2.2, 1.8), ell(80, 14.6, 1.8, 1.8), ell(83, 13.2, 2.2, 1.6), ell(85.6, 13.8, 1.6, 1.4))), function (x, y) {
          return (Math.floor(x * 0.9 + y * 1.3) % 3 === 0) ? 'A' : 'a';
        }, 'A')
      ];
    };
    var FACES = [
      // Bonnie
      [47, 19, ['E', 'E']], [50, 19, ['E', 'E']], [46, 21, ['p']], [51, 21, ['p']], [48, 22, ['q..q', '.qq.']],
      // Lucy's glasses, eyes and smile
      [69, 18, ['nnnnnn', 'nwn.wn', 'nEn.En', 'nnn.nn']], [67, 18, ['nn']], [70, 22, ['q..q', '.qq.']],
      // Luke's eyes, moustache and smile
      [83, 19, ['E', 'E']], [86, 19, ['E', 'E']], [83, 22, ['AAAA']], [84, 23, ['mm']]
    ];
    var car = function (rot, full) {
      var parts = [
        // roof rails, standing on their feet just above the roof
        P('r', or(cap(13.2, 3.6, 81, 3.6, 1.2), rrect(11.6, 3, 16.4, 7.4, 1), rrect(77.8, 3, 82.6, 7.4, 1)), orb(40, 0, 50, 6, 'Rrree'), 'R'),
        P('3', bodyF, paintTex, '1'),
        // the black window surround and pillars
        P('k', poly([[10, 8.4], [84, 8.2], [102, 28.2], [10, 28.8]], 2), function (x, y) { return y < 9.6 ? 'l' : 'k'; }, 'K'),
        // the lower trim: bumpers, sills, and round the arches
        P('k', or(poly([[2.4, 43], [16, 43], [16, 51], [3, 51]], 2), rrect(14, 46.4, 114, 51.6, 1.6), poly([[111, 43.4], [126.6, 42], [125.2, 51], [111, 51]], 2),
          function (x, y) { return y < WY + 1 && nearWheel(x, y, WR + 3.8); }), function (x, y) { return y < 47.4 && !nearWheel(x, y, WR + 3) ? 'l' : 'k'; }, 'K'),
        P('K', function (x, y) { return y < WY + 1.4 && nearWheel(x, y, WR + 1.3); }, null, 'K'),
        // lights: the headlight sweeping back from the nose, a fog light,
        // the tall tail light at the back
        P('x', poly([[113.6, 29.6], [123.4, 31.2], [125.6, 34.6], [116.4, 34.2], [113.4, 31.8]], 1.2), function (x, y) { return y < 31.6 ? 'x' : x > 121 ? 'X' : (x & 1 ? 'x' : 'X'); }, 'X'),
        P('x', ell(121.6, 45.6, 1.4, 1.1), null, 'X'),
        P('y', poly([[4.8, 15.2], [8.6, 14.8], [8.8, 27.4], [4.4, 28.4]], 1.4), function (x, y) { return y < 18 ? 'Y' : y > 25 ? 'z' : 'y'; }, 'z'),
        // the wing mirror
        P('3', ell(100.2, 26, 3.2, 2.1), function (x, y) { return y < 25.6 ? '5' : '3'; }, '1'),
        // door handles
        P('r', or(rrect(46.4, 31.8, 51.6, 33.4, 0.6), rrect(77.4, 31.8, 82.6, 33.4, 0.6)), null, 'R')
      ];
      WIN.forEach(function (f) { parts.push(P('g', f, glassTex, 'K')); });
      if (full) parts = parts.concat(family());
      WHEELS.forEach(function (cx) { parts = parts.concat(wheel(cx, rot)); });
      var st = [
        // door shut lines
        [31, 29, ['1', '1', '1', '1', '1', '1']], [62, 29, ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1']], [94, 31, ['1', '1', '1', '1', '1', '1', '1']]
      ];
      if (full) st = st.concat(FACES);
      return build(W, H, parts, st, pal);
    };
    var spin = Math.PI / 10;
    F.yeti = { side: [car(0, false), car(spin, false)], full: [car(0, true), car(spin, true)] };

    // the little one, for the map: 18 x 10
    var small = function (f) {
      var parts = [
        P('3', poly([[1.4, 16.4], [1.4, 7], [3.4, 2.5], [23.4, 2.5], [28, 8.4], [33, 9.4], [34.8, 11.8], [34.8, 16.4]], 1.4), function (x, y) {
          if (y < 4 && x > 4 && x < 23) return 'e';
          if (y > 13) return 'k';
          if (y > 9 && y < 11) return '5';
          return y < 10 ? '4' : '3';
        }, '1'),
        P('g', poly([[3.8, 4.6], [22.4, 4.6], [26.8, 9.4], [3.4, 9.4]], 0.8), function (x) { return x === 11 || x === 18 ? 'K' : x === 5 ? 'o' : 'g'; }, 'K'),
        P('x', rrect(32, 10, 34.8, 11.8, 0.4), null, 'X'),
        P('y', rrect(1.4, 6.4, 3.2, 10, 0.4), null, 'z')
      ];
      [8.6, 28].forEach(function (cx) {
        parts.push(P('t', ell(cx, 16.2, 3.7, 3.7), function (x, y) {
          var dx = x + 0.5 - cx, dy = y + 0.5 - 16.2, r = Math.sqrt(dx * dx + dy * dy);
          if (r < 0.8) return 'R';
          if (r < 2.2) return (f ? Math.abs(Math.abs(dx) - Math.abs(dy)) < 0.6 : (Math.abs(dx) < 0.6 || Math.abs(dy) < 0.6)) ? 'e' : 'R';
          return 't';
        }, 'K'));
      });
      return build(36, 20, parts, [], pal);
    };
    F.yetiSmall = [small(0), small(1)];
  })();

  /* ==========================================================================
     BONNIE'S BIKE — he has just learnt to ride, and level 33 is a ride
     along the cycle paths and beaches near Hossegor. A little red bike,
     side on and facing right like him: chunky tyres on spoked wheels with
     the sky showing through, a chain, a wicker basket on the front and a
     yellow bell on the bar.

     Bonnie is A.bonnie.pose — his own head, hair, jumper, shorts and arms,
     hands on the grips — with his legs tucked away under his shorts. His
     legs are drawn here instead, from art.js's own parts in his own
     colours (skin, socks, school shoes, the legs of his shorts): sitting
     on a saddle puts his feet below the bottom of his frame, where pose()
     can't reach, and drawn here the far leg can go behind the bike's frame
     and the near one in front of it.

     His frame is at the top left of every sprite, so his head is exactly
     where it always is (10.75 game px in, his hair at the top) and the
     game's hats still fit; the bike makes the sprite wider and taller.
     The bike's colours are letters Bonnie and his outfits never use, so a
     red jumper or a rainbow doesn't recolour it.

     A.family.bike = { s, b: { ride: [4] (the pedals a quarter-turn on each
     time, the wheels turning), air (nose up, legs tucked, 'wheee'), cheer
     (stopped, an arm up) } }      small 23 x 23, big 27 x 31 (air a game
                                   pixel taller: its back wheel drops)
     ========================================================================== */
  (function () {
    var BON = A.bonnie;
    if (!BON || !BON.pose) return;
    var pal = {
      // the frame: candy red, deep to shine
      R: '#7a1830', d: '#c42a3e', r: '#ec4252', e: '#ff8478', i: '#ffd6ca',
      // tyres
      G: '#131016', T: '#2c2934', U: '#4f4b5c',
      // steel: rims, spokes, cranks, the bar
      L: '#4c5464', V: '#8c96a8', l: '#bcc4d2', v: '#e2e8f0', x: '#ffffff',
      // the saddle, grips and pedals
      A: '#17131d', a: '#302a3b', g: '#504860',
      // the wicker basket
      N: '#6a3c1a', J: '#a4682e', j: '#d69c54', M: '#f6cc88',
      // the bell
      P: '#b07c0c', O: '#ffd23a', Q: '#fff6c0'
    };
    var OWN = Object.keys(pal).join('');
    // the line each of the bike's colours draws where it lies over something
    var LINE = { R: 'R', d: 'R', r: 'R', e: 'R', i: 'R', G: 'G', T: 'G', U: 'G', L: 'L', V: 'L', l: 'L', v: 'L', x: 'L',
      A: 'A', a: 'A', g: 'A', N: 'N', J: 'N', j: 'N', M: 'N', P: 'P', O: 'P', Q: 'P' };
    // and Bonnie's, as art.js draws them
    var HIS = { b: 'B', B: 'B', k: 'K', K: 'K', s: 'S', S: 'S', t: 'S', u: 'S', w: 'W', W: 'W', z: 'z', y: 'Y', Y: 'Y', 1: '1', 2: '1', 3: '1', 4: '1', 5: '1' };

    /* The kit's scene(), but a part marked `bare` is never outlined: the
       spokes and the chain are a pixel wide, and outlined they'd be nothing
       but outline. */
    var scene2 = function (W, H, parts) {
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
          var p = parts[k], n = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)];
          if (!p.bare && n.indexOf(-1) > -1) r += '#';
          else if (p.line && n.some(function (j) { return j > -1 && j < k; })) r += p.line;
          else r += p.tex ? p.tex(x, y) : p.c;
        }
        rows.push(r);
      }
      return rows;
    };
    /* Bonnie over the bike. Where his outline now lies on the bike rather
       than the sky it becomes the line his own colour draws there, and the
       bike's outline against him the bike's line — just as a scene draws
       one part over another. */
    var compose = function (under, over) {
      var H = under.length, W = under[0].length, g = [], who = [], x, y;
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        var o = over[y] ? over[y].charAt(x) : '', u = under[y].charAt(x);
        // his shorts run on into the legs of them drawn here: no seam
        if (o === '#' && (u === 'k' || u === 'K')) o = '';
        if (o && o !== '.') { g.push(o); who.push(1); } else { g.push(u); who.push(0); }
      }
      var at = function (x, y) { return x < 0 || y < 0 || x >= W || y >= H ? '.' : g[y * W + x]; };
      var out = g.slice();
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        var i = y * W + x;
        if (g[i] !== '#') continue;
        var n = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        if (n.some(function (q) { return at(q[0], q[1]) === '.'; })) continue;
        var map = who[i] ? HIS : LINE, ln = null;
        n.forEach(function (q) { var j = q[1] * W + q[0]; if (!ln && who[j] === who[i] && map[g[j]]) ln = map[g[j]]; });
        if (ln) out[i] = ln;
      }
      var rows = [];
      for (y = 0; y < H; y++) rows.push(out.slice(y * W, y * W + W).join(''));
      return rows;
    };

    /* Where everything goes, in the sprite's own pixels (Bonnie's frame at
       0, 0). leg, sock and shoe are art.js's SMALL and BIG; hips are where
       his legs start under his shorts; his hands go on the grips. */
    var SPEC = {
      s: { W: 46, hips: [[21.6, 33.4], [23.4, 33.6]], thigh: 3.6, shin: 3.6, leg: 1.6, sock: 0, shoe: 2.5,
        sh: [[11.2, 1.6], [20.8, 1.6]], legsAt: [[13.4, 9.5], [18.6, 9.5]], cheer: [[-0.5, -2], [-2, -7.5], 1],
        R: 6.4, tyre: 1.9, rim: 1.4, hub: 1.1, spokes: 6, rear: [12, 40], front: [38, 40],
        bb: [24.6, 40.4], crank: 1.9, ring: 2.4, cog: 1.3, tube: 1.3, arm: 0.75, pedal: [1.6, 0.7],
        saddle: [19.6, 36.6, 3.6, 1.3], seat: [21, 38.2], headT: [34.1, 31.6], headB: [35.3, 35.2], stem: [33.5, 29.6], grip: [31, 29.6],
        basket: [36.2, 27.6, 44.6, 34.6], bell: [34.3, 28.6, 1.5], bend: [1.6, 0.8] },
      b: { W: 54, hips: [[21.6, 41.4], [23.6, 41.6]], thigh: 6.8, shin: 6.4, leg: 1.9, sock: 2.6, shoe: 2.9,
        sh: [[11, 2.4], [21, 2.4]], legsAt: [[13.2, 17], [18.8, 17]], cheer: [[1.5, -1.5], [0, -8], 1],
        R: 8.5, tyre: 2.3, rim: 1.6, hub: 1.5, spokes: 8, rear: [10, 54], front: [44, 54],
        bb: [26, 54.4], crank: 2.7, ring: 3.3, cog: 1.7, tube: 1.6, arm: 0.95, pedal: [2.1, 0.85],
        saddle: [20.4, 45.2, 4.6, 1.6], seat: [22, 47.8], headT: [40.4, 38.4], headB: [42, 43.8], stem: [39.6, 35.4], grip: [37, 35.6],
        basket: [42.6, 32.8, 53.2, 42], bell: [40.6, 34, 1.9], bend: [2.4, 1.2] }
    };

    // tubes as one shape, so they join without seams, each lit across its
    // round: light along the top, shade underneath, a shine on the very top
    var tubes = function (list, c, line, tones) {
      var caps = list.map(function (t) { return cap(t[0][0], t[0][1], t[1][0], t[1][1], t[2]); });
      return P(c, function (x, y) { for (var i = 0; i < caps.length; i++) if (caps[i](x, y)) return true; return false; }, function (x, y) {
        var X = x + 0.5, Y = y + 0.5, best = 1e9, s = 0;
        list.forEach(function (t) {
          var a = t[0], b = t[1], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
          var u = L ? Math.max(0, Math.min(1, ((X - a[0]) * dx + (Y - a[1]) * dy) / L)) : 0;
          var ox = X - a[0] - u * dx, oy = Y - a[1] - u * dy, dd = Math.hypot(ox, oy) / t[2];
          if (dd < best) { best = dd; s = -(0.6 * ox + 0.8 * oy) / t[2]; }
        });
        return s > 0.78 ? tones[3] : s > 0.3 ? tones[2] : s < -0.3 ? tones[0] : tones[1];
      }, line);
    };
    // a wheel, turned rot: a chunky tyre catching the light on its upper
    // left, a bright rim, thin spokes with the sky between them, the hub
    var wheel = function (c, S, rot) {
      var R0 = S.R, R1 = R0 - S.tyre, R2 = R1 - S.rim, k = 2 * Math.PI / S.spokes;
      var d = function (x, y) { return Math.hypot(x - c[0], y - c[1]); };
      var spoke = function (x, y) {
        var r = d(x, y);
        if (r > R2 + 0.4 || r < S.hub) return false;
        var a = ((Math.atan2(y - c[1], x - c[0]) - rot) % k + k) % k;
        return Math.min(a, k - a) * r < 0.5;
      };
      return [
        P('T', function (x, y) { var r = d(x, y); return r <= R0 && r >= R1 - 0.6; }, function (x, y) {
          var X = x + 0.5 - c[0], Y = y + 0.5 - c[1];
          return X * 0.6 + Y * 0.8 < -R0 * 0.62 && Math.hypot(X, Y) > R1 + 0.3 ? 'U' : 'T';
        }, 'G'),
        P('v', function (x, y) { var r = d(x, y); return r < R1 && r >= R2; }, function (x, y) { return (x + 0.5 - c[0]) * 0.6 + (y + 0.5 - c[1]) * 0.8 < 0 ? 'v' : 'l'; }),
        { c: 'V', f: spoke, bare: true },
        P('l', ell(c[0], c[1], S.hub, S.hub), function (x, y) { return x + 0.5 < c[0] && y + 0.5 < c[1] ? 'x' : 'l'; }, 'L')
      ];
    };
    // a crank and its pedal, seen edge on
    var crank = function (bb, p, S) {
      return [
        tubes([[bb, p, S.arm]], 'l', 'L', ['V', 'l', 'v', 'x']),
        P('a', rrect(p[0] - S.pedal[0], p[1] - S.pedal[1], p[0] + S.pedal[0], p[1] + S.pedal[1], S.pedal[1]), function (x, y) { return y + 0.5 < p[1] ? 'g' : 'a'; }, 'A')
      ];
    };
    /* A leg of his, as art.js builds one: skin from mid-thigh through the
       knee to the foot, a white sock up the shin (big Bonnie), his school
       shoe, and the leg of his shorts down the top of the thigh. The ball
       of his foot is on the pedal; the knee bends forward. Only the near
       leg gets its shorts: the far thigh is hidden under the near one, and
       two would draw a seam between them. */
    var legOn = function (S, hip, p, shorts) {
      var foot = [p[0] - 1, p[1] - S.pedal[1] - 1.6], knee = kneeOf(hip, foot, S.thigh, S.shin), mid = along(hip, knee, 0.5), out = [];
      out.push(P('s', limb([mid, knee, foot], S.leg), null, 'S'));
      if (S.sock) {
        var sl = Math.hypot(knee[0] - foot[0], knee[1] - foot[1]) || 1, top = along(foot, knee, Math.min(1, (S.sock + 0.4) / sl));
        out.push(P('w', cap(top[0], top[1], foot[0], foot[1] - 0.3, S.leg + 0.3), null, 'W'));
      }
      out.push(P('z', ell(foot[0] + 0.8, foot[1] + 0.4, S.shoe, 1.55), null, 'z'));
      if (shorts) out.push(P('k', cap(hip[0], hip[1], mid[0], mid[1], S.leg + 1.4), null, 'K'));
      return out;
    };
    // his arm i to a hand at h (in the sprite's pixels; pose() takes body
    // coordinates), the elbow dropped by S.bend[i] below the straight line
    var reach = function (S, i, h) {
      var hd = [h[0] - 6, h[1] - 24 - 0.8], sh = S.sh[i], m = along(sh, hd, 0.5), dx = hd[0] - sh[0], dy = hd[1] - sh[1], L = Math.hypot(dx, dy) || 1;
      return [[m[0] - dy / L * S.bend[i], m[1] + dx / L * S.bend[i]], hd];
    };
    var spin = function (p, o, a) {
      if (!a) return p;
      var x = p[0] - o[0], y = p[1] - o[1], co = Math.cos(a), si = Math.sin(a);
      return [o[0] + x * co - y * si, o[1] + x * si + y * co];
    };

    /* One frame. o.pedal: the near pedal's angle (0 forward, turning
       clockwise as the wheels do); o.rot: the wheels'; o.tilt: the bike
       pitched nose up about the saddle (in the air); o.kind: his face;
       o.wave: his left arm (as we look at him) up and waving, as in his
       own cheer. */
    var frame = function (size, o) {
      var S = SPEC[size], piv = [S.saddle[0], S.saddle[1]], tl = o.tilt || 0;
      // the sprite ends on the lowest row of the wheels, where they meet the
      // ground (tipped back in the air, the rear wheel drops and it grows),
      // made up to a whole number of game pixels by dropping the bike the
      // odd row clear of his seat
      var rows0 = function (c) {
        var f = c[0] - 0.5 - Math.floor(c[0] - 0.5), dx = Math.min(f, 1 - f);
        return Math.floor(c[1] + Math.sqrt(S.R * S.R - dx * dx) - 0.5) + 1;
      };
      var low = Math.max(rows0(spin(S.rear, piv, tl)), rows0(spin(S.front, piv, tl)));
      var H = low + (low & 1), W = S.W, dn = H - low;
      var at = function (p) { var q = spin(p, piv, tl); return [q[0], q[1] + dn]; };
      var ra = at(S.rear), fa = at(S.front), bb = at(S.bb), seat = at(S.seat), hT = at(S.headT), hB = at(S.headB), stem = at(S.stem), grip = at(S.grip);
      var sd = at(piv), bell = at([S.bell[0], S.bell[1]]);
      var pedal = function (a) { return [bb[0] + Math.cos(a) * S.crank, bb[1] + Math.sin(a) * S.crank]; };
      var near = pedal(o.pedal), far = pedal(o.pedal + Math.PI), t = S.tube, parts = [];
      // the far side: its crank and pedal, his far leg
      parts = parts.concat(crank(bb, far, S), legOn(S, S.hips[0], far));
      // the wheels, behind the frame, and the little cog on the back one
      parts = parts.concat(wheel(ra, S, o.rot), wheel(fa, S, o.rot));
      parts.push(P('l', ell(ra[0], ra[1], S.cog, S.cog), function (x, y) { return (x + y) & 1 ? 'V' : 'l'; }, 'L'));
      // the seat post, then the frame: seat tube, top tube, down tube,
      // chain and seat stays, the head tube a little stouter, the fork
      parts.push(tubes([[seat, along(seat, sd, 1.2), t * 0.62]], 'l', 'L', ['V', 'l', 'v', 'x']));
      parts.push(tubes([
        [bb, seat, t], [along(seat, bb, 0.12), along(hT, hB, 0.55), t], [bb, along(hT, hB, 0.8), t],
        [bb, ra, t * 0.8], [seat, ra, t * 0.8], [hT, hB, t * 1.2], [hB, fa, t * 0.9]
      ], 'r', 'R', ['d', 'r', 'e', 'i']));
      // the chain, on this side of the frame, from the top of the chainring
      // to the top of the cog (its lower run, under the chainstay, boxed
      // the stay in and read as clutter)
      parts.push({ c: 'L', bare: true, f: cap(bb[0], bb[1] - S.ring + 0.5, ra[0], ra[1] - S.cog + 0.3, 0.5) });
      // the chainring
      parts.push(P('l', ell(bb[0], bb[1], S.ring, S.ring), function (x, y) {
        var X = x + 0.5 - bb[0], Y = y + 0.5 - bb[1], r = Math.hypot(X, Y);
        if (r < S.ring * 0.42) return X + Y < 0 ? 'x' : 'v';
        if (r > S.ring - 0.9) return Math.floor(Math.atan2(Y, X) * 3 + 20) & 1 ? 'V' : 'l';
        return X * 0.6 + Y * 0.8 < 0 ? 'v' : 'l';
      }, 'L'));
      // the stem and the bar, swept back to the grip
      parts.push(tubes([[hT, stem, t * 0.7], [stem, grip, t * 0.62]], 'l', 'L', ['V', 'l', 'v', 'x']));
      parts.push(tubes([[along(grip, stem, 0.05), along(grip, stem, -0.32), t * 0.95]], 'a', 'A', ['a', 'a', 'g', 'g']));
      // the bell, on the bar by the stem: a little gold dome
      parts.push(P('O', or(both(ell(bell[0], bell[1], S.bell[2] * 1.15, S.bell[2]), function (x, y) { return y <= bell[1] + 0.3; }), rrect(bell[0] - 0.5, bell[1], bell[0] + 0.5, bell[1] + S.bell[2] * 0.9, 0.3)), function (x, y) {
        return x + 0.5 < bell[0] && y + 0.5 < bell[1] ? 'Q' : 'O';
      }, 'P'));
      // the saddle: a soft dark wedge, its nose forward
      var sw = S.saddle[2], sh = S.saddle[3];
      parts.push(P('a', or(ell(sd[0] - sw * 0.25, sd[1], sw * 0.75, sh), ell(sd[0] + sw * 0.45, sd[1] + sh * 0.2, sw * 0.55, sh * 0.62)), function (x, y) { return y + 0.5 < sd[1] - sh * 0.2 ? 'g' : 'a'; }, 'A'));
      // the basket: wicker, woven in a check, a light rim round the top,
      // hung off the front of the bar over the front wheel
      var bk = S.basket, bx0 = bk[0], by0 = bk[1], bx1 = bk[2], by1 = bk[3];
      var corners = [[bx0, by0], [bx1, by0], [bx1 - 1.1, by1], [bx0 + 0.9, by1]].map(at);
      parts.push(P('j', poly(corners, 1), function (x, y) {
        var q = spin([x + 0.5, y + 0.5 - dn], piv, -tl), X = q[0] - bx0, Y = q[1] - by0;
        if (Y < 1.6) return Y < 0.8 && X < (bx1 - bx0) * 0.6 ? 'M' : 'j';
        var band = Math.floor((Y - 1.6) / 1.5), stake = Math.floor((X + (band & 1) * 1.5) / 3);
        if (Y > by1 - by0 - 1.2) return 'J';
        return (band + stake) & 1 ? 'J' : X < (bx1 - bx0) * 0.5 && !(band & 1) ? 'M' : 'j';
      }, 'N'));
      // the near side: its crank and pedal, then his near leg
      parts = parts.concat(crank(bb, near, S), legOn(S, S.hips[1], near, true));
      var rows = scene2(W, H, parts);

      // Bonnie: his arms to the grip (one waving, when he cheers), his legs
      // tucked under his shorts out of the way
      var arms = [reach(S, 0, [grip[0] - 0.6, grip[1] + 0.3]), reach(S, 1, grip)];
      if (o.wave) arms[0] = S.cheer;
      var tuck = S.legsAt.map(function (h) { return [h, [h[0] - 1, h[1] - 0.3]]; });
      var him = BON.pose(size, { arms: arms, legs: tuck }, o.kind);
      var sp = BB.sprHi(compose(rows, him.rows), merge(him.pal, pal), 'shade');
      sp.noLight = [].concat(him.noLight || []).join('') + OWN;
      return sp;
    };
    var Q = Math.PI / 2, set = function (size) {
      var n = SPEC[size].spokes, step = 2 * Math.PI / n / 4;
      return {
        ride: [0, 1, 2, 3].map(function (k) { return frame(size, { pedal: Q / 2 + k * Q, rot: k * step }); }),
        air: frame(size, { pedal: -0.2, rot: step / 2, tilt: -0.12, kind: 'wheee' }),
        cheer: frame(size, { pedal: 0, rot: 0, wave: true })
      };
    };
    F.bike = { s: set('s'), b: set('b') };

    /* ==========================================================================
       SURFING at Hossegor: just Bonnie — the game draws the board under
       his feet — crouched, knees bent and feet apart, arms out for balance,
       looking ahead; and wobbling, his arms windmilling, an 'oh!' face.
       His own frame, cut off under his shoes so they stand on its bottom
       row: crouched, his head sits a game pixel lower than standing (it's
       still 10.75 in from the left).

       A.family.surf = { s, b: { ride, wobble } }      small 22 x 19, big 22 x 27
       ========================================================================== */
    var surf = function (size, arms, legs, kind) {
      var sp = BON.pose(size, { arms: arms, legs: legs }, kind), rows = sp.rows.slice();
      while (rows.length > 1 && /^\.*$/.test(rows[rows.length - 1])) rows.pop();
      var out = BB.sprHi(rows, sp.pal, 'shade');
      out.noLight = sp.noLight;
      return out;
    };
    var LEGS = {
      s: [[[10.6, 11], [9, 12]], [[21.6, 10.8], [23, 12]]],
      b: [[[8.8, 22.2], [7, 27.8]], [[23.4, 22], [25.2, 27.8]]]
    };
    F.surf = {
      s: {
        ride: surf('s', [[[5.4, 2.2], [1, 3.6]], [[26.6, 2.8], [31, 4.6]]], LEGS.s),
        wobble: surf('s', [[[4.6, -1.6], [1.6, -6], 1], [[26.4, 4.8], [28.6, 8.6]]], LEGS.s, 'gasp')
      },
      b: {
        ride: surf('b', [[[4.8, 4.6], [0.2, 7.2]], [[27.2, 5.6], [32, 8.4]]], LEGS.b),
        wobble: surf('b', [[[4.4, -1.2], [1, -7], 1], [[27, 9], [29.8, 14]]], LEGS.b, 'gasp')
      }
    };
  })();
})();
