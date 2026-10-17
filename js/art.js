/* ==========================================================================
   art.js — every picture in Bonnie Bounce, as pixels.

   Characters are typed out as rows (see BB.spr in core.js) or built from
   shapes: make() fills a grid from layered ellipses and boxes, then turns
   each shape's edge into the outline — the thick dark line round every
   figure that is most of what makes a handheld sprite read at 1x. Detail
   (eyes, mouths, spots) is then stamped on top as rows.

   Tiles use '1'–'4' (light to dark) and get their colours from the level's
   theme, so one brick or one ground tile serves ten worlds.
   ========================================================================== */
(function () {
  'use strict';
  var spr = BB.spr, A = BB.ART = {};

  /* ---- shape helpers ------------------------------------------------------- */
  var ell = function (cx, cy, rx, ry) { return function (x, y) { var dx = (x - cx) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy <= 1; }; };
  var circ = function (cx, cy, r) { return ell(cx, cy, r, r); };
  var box = function (x0, y0, x1, y1) { return function (x, y) { return x >= x0 && x < x1 && y >= y0 && y < y1; }; };
  var and = function (a, b) { return function (x, y) { return a(x, y) && b(x, y); }; };
  var not = function (a) { return function (x, y) { return !a(x, y); }; };
  A.ell = ell; A.circ = circ; A.box = box;
  /* layers: [[char, fn], ...], later layers over earlier. A pixel is part
     of the figure if any layer claims it; the figure's edge becomes '#'.
     A layer whose char is '' carves a hole. */
  var make = function (w, h, layers, o) {
    o = o || {};
    var g = [], x, y;
    for (y = 0; y < h; y++) {
      var r = [];
      for (x = 0; x < w; x++) {
        var c = null;
        for (var i = 0; i < layers.length; i++) if (layers[i][1](x + 0.5, y + 0.5)) c = layers[i][0] || null;
        r.push(c);
      }
      g.push(r);
    }
    var at = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && g[y][x]; };
    var rows = [];
    for (y = 0; y < h; y++) {
      var s = '';
      for (x = 0; x < w; x++) {
        if (!g[y][x]) s += '.';
        else if (o.outline !== false && (!at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1))) s += o.outline || '#';
        else s += g[y][x];
      }
      rows.push(s);
    }
    return rows;
  };
  // stamp rows over rows: '.' keeps what is under, ',' clears it
  var over = function (base, top, ox, oy) {
    var out = base.slice();
    top.forEach(function (row, y) {
      var by = y + (oy || 0);
      if (by < 0 || by >= out.length) return;
      var b = out[by].split('');
      for (var x = 0; x < row.length; x++) {
        var bx = x + (ox || 0);
        if (bx < 0 || bx >= b.length || row[x] === '.') continue;
        b[bx] = row[x] === ',' ? '.' : row[x];
      }
      out[by] = b.join('');
    });
    return out;
  };
  var flipRows = function (rows) { return rows.map(function (r) { return r.split('').reverse().join(''); }); };
  var swap = function (rows, from, to) { return rows.map(function (r) { return r.split(from).join(to); }); };
  A.make = make; A.over = over;

  /* ==========================================================================
     BONNIE — aged six, from the photo on the football pitch: wavy golden
     hair, shorter now, swept across his forehead with tufts sticking up and
     his ear showing; a longer face than a toddler's, a big cheeky grin with
     his top teeth showing, happy squinting blue eyes, rosy cheeks and a few
     freckles across his nose. Dressed, as he asked, in his school uniform:
     the royal-blue V-neck with the white shirt collar and the gold crest,
     grey shorts, white socks, dark school shoes.

     He is drawn at full density as a puppet: a head, then a body built
     from parts (a torso, sleeves and hands on a shoulder–elbow–hand line,
     shorts and legs on a hip–knee–foot line), posed for each frame. Every
     part gets a dark edge where it meets the sky and a finer line where
     it crosses another part — a sleeve over the jumper, the fringe over
     his face — and the painter lights it all from the top left.

     The frames are 44 wide (22 game pixels) so a raised hand has room
     beside his head; small Bonnie is 40 tall (20), big Bonnie 56 (28).
     Both stand on the hitbox's feet, so the hair overhangs it.
     ========================================================================== */
  var cap = function (ax, ay, bx, by, r) {
    return function (x, y) {
      var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      var t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0;
      var px = ax + t * dx - x, py = ay + t * dy - y;
      return px * px + py * py <= r * r;
    };
  };
  var limb = function (pts, r) {
    var segs = [];
    for (var i = 0; i < pts.length - 1; i++) segs.push(cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r));
    return function (x, y) { return segs.some(function (f) { return f(x, y); }); };
  };
  var rrect = function (x0, y0, x1, y1, r) {
    return function (x, y) {
      if (x < x0 || x > x1 || y < y0 || y > y1) return false;
      var cx = Math.max(x0 + r, Math.min(x1 - r, x)), cy = Math.max(y0 + r, Math.min(y1 - r, y));
      return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r;
    };
  };
  /* A scene of parts, later ones in front. Each part: c (its colour
     char), f (inside test), line (the char for its edge where it crosses
     a part behind it; '#' where it meets nothing), tex (x, y) → a char
     for detail. Returns the rows. */
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
        var P = parts[k], n = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)];
        if (n.indexOf(-1) > -1) r += '#';
        else if (P.line && n.some(function (j) { return j < k; })) r += P.line;
        else r += P.tex ? P.tex(x, y) : P.c;
      }
      rows.push(r);
    }
    return rows;
  };
  var paint = function (rows, x, y, list) {
    list.forEach(function (str, i) {
      if (!rows[y + i]) return;
      var r = rows[y + i].split('');
      for (var k = 0; k < str.length; k++) if (str[k] !== '.' && r[x + k] !== undefined && r[x + k] !== '.') r[x + k] = str[k];
      rows[y + i] = r.join('');
    });
  };

  // the drawing kit, shared with creatures.js
  A.kit = { cap: cap, limb: limb, rrect: rrect, scene: scene, stamp: paint, ell: ell, circ: circ, box: box };

  /* His colours. The hair runs 1 (deepest) to 5 (shine); the face has a
     base, a shade, a deeper shade and a warm line; his eyes are dark with a
     white sparkle and a blue glint. */
  var BPAL = {
    1: '#a8692a', 2: '#d99a40', 3: '#f4c862', 4: '#ffe292', 5: '#fff7da',
    s: '#ffdcc4', t: '#f5bb9a', u: '#e0947a', q: '#b4614f', S: '#e9a888',
    E: '#22224e', w: '#ffffff', I: '#4f86ea', m: '#b9404f', n: '#ff8c98', p: '#ffb2a8', f: '#e9a684',
    W: '#d6daea', b: '#3a6cf4', B: '#1f40a8', y: '#ffe048', Y: '#c98a12', k: '#55526a', K: '#33304a', z: '#2a2238'
  };
  var NOLIGHT = ['1', '2', '3', '4', '5', 's', 't', 'u', 'q', 'E', 'w', 'I', 'm', 'n', 'p', 'f'];
  var HX = 6, HY = 1, FW = 44, HEAD_H = 24;
  /* A lock of hair: a tapering stroke along a curve (p0 → p2, bent by p1).
     Lit from above — a shine along its upper edge, shade along its lower
     one, darker towards its tip — and edged in the deepest tone where it
     lies over something else. Locks drawn this way, a few of them, sweep
     the way his fringe does. */
  var lock = function (p0, p1, p2, r0, r1) {
    var pts = [];
    for (var i = 0; i <= 16; i++) {
      var t = i / 16, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      pts.push([a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1], t]);
    }
    var near = function (x, y) {
      var best = null, bd = 1e9;
      for (var i = 0; i < pts.length - 1; i++) {
        var ax = pts[i][0], ay = pts[i][1], bx = pts[i + 1][0], by = pts[i + 1][1], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
        var u = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0;
        var px = ax + u * dx, py = ay + u * dy, d = (x - px) * (x - px) + (y - py) * (y - py);
        if (d < bd) { bd = d; best = { d: Math.sqrt(d), t: pts[i][2] + u / 16, cy: py }; }
      }
      best.r = r0 + (r1 - r0) * best.t;
      return best;
    };
    return {
      c: '3', line: '1',
      f: function (x, y) { var n = near(x, y); return n.d <= n.r; },
      tex: function (x, y) {
        var n = near(x + 0.5, y + 0.5), side = (y + 0.5 - n.cy) / Math.max(0.8, n.r);
        if (n.t > 0.8) return side < 0 ? '3' : '2';
        if (side < -0.42 && n.t > 0.12 && n.t < 0.62) return '5';
        if (side < -0.05) return '4';
        if (side > 0.5) return '2';
        return '3';
      }
    };
  };
  var LOCKS = function (o) {
    var L = function (a, b, c, r0, r1) { return lock([o + a[0], a[1] + HY], [o + b[0], b[1] + HY], [o + c[0], c[1] + HY], r0, r1); };
    return {
      back: [L([9, 4], [3, 9], [4.5, 16.5], 3.6, 1.2), L([11, 6], [5.5, 12], [7.5, 19], 3, 1), L([7, 13.5], [3.2, 17.5], [6.2, 20.6], 2.4, 0.8)],
      top: [L([8, 4.5], [14, 0.4], [21, 2.6], 3.6, 2), L([17, 2], [25, 1.2], [28, 7.5], 3.4, 1), L([13, 3], [12.6, 1], [10.2, 0.8], 1.6, 0.6)],
      fringe: [L([12, 4.5], [16.5, 5.5], [16.2, 11.2], 3.2, 0.7), L([16, 3.5], [21.5, 5], [21, 10.6], 3.2, 0.7), L([21, 3.5], [26.5, 4.5], [25.8, 9.8], 2.8, 0.7)]
    };
  };
  var headParts = function () {
    var o = HX, lk = LOCKS(o), allHair = lk.back.concat(lk.top, lk.fringe);
    var hairAt = function (x, y) { return allHair.some(function (p) { return p.f(x, y); }); };
    var faceFn = function (x, y) {
      var cx = o + 17.5, cy = 14.2 + HY, ry = 8.4, rx = 8.4 * (y > cy + 1 ? 1 - 0.28 * Math.min(1, (y - cy - 1) / (ry - 1)) : 1);
      var dx = (x - cx) / rx, dy = (y - cy) / ry;
      return dx * dx + dy * dy <= 1;
    };
    return [
      { c: '2', f: ell(o + 15.5, 11 + HY, 11.5, 10.2), tex: function (x, y) { return y > 15 + HY ? '1' : '2'; } },
      { c: 's', f: ell(o + 8.9, 15.2 + HY, 2.1, 2.8), line: 'q', tex: function (x, y) { return x < o + 9 && y > 14 + HY && y < 17 + HY ? 'u' : 's'; } },
      { c: 's', f: faceFn, line: 'q', tex: function (x, y) {
        // the fringe casts a shadow on his forehead; the far side and the chin are in shade
        if (hairAt(x + 0.5, y - 0.5) || hairAt(x + 0.5, y - 1.5)) return 't';
        if (x < o + 11.5 || y > 21.5 + HY) return 't';
        return 's';
      } }
    ].concat(lk.back, lk.top, lk.fringe);
  };
  var face = function (rows, kind) {
    var o = HX, Y = HY;
    // a soft blush and a few freckles, light enough to be charming
    paint(rows, o + 23, 17 + Y, ['pp']); paint(rows, o + 13, 17 + Y, ['pp']);
    paint(rows, o + 18, 16 + Y, ['f']); paint(rows, o + 20, 17 + Y, ['f']); paint(rows, o + 16, 17 + Y, ['f']);
    var eye = kind === 'blink' ? ['..', '..', 'EE', '..'] : kind === 'hurt' ? ['E.E', '.E.', 'E.E'] : ['EE', 'Ew', 'EE', 'IE'];
    paint(rows, o + 15, 12 + Y, eye); paint(rows, o + 21, 12 + Y, eye);
    var mouth = {
      wheee: [o + 18, 18 + Y, ['qqqq', 'qmmq', '.qq.']],
      hurt: [o + 18, 19 + Y, ['.q.', 'qmq', '.q.']],
      gasp: [o + 18, 19 + Y, ['.q.', 'qmq', '.q.']]
    }[kind] || [o + 17, 18 + Y, ['q...q', '.qqq.']];
    paint(rows, mouth[0], mouth[1], mouth[2]);
  };

  /* Poses: arms as [shoulder, elbow, hand], legs as [hip, knee, foot], in
     body coordinates (0,0 at the top left of the body, under the head).
     A hand with `up` spreads its fingers — the photo's jazz hands. */
  var BIG = { torso: [9.6, 0, 22.4, 15.5], hem: 12.5, hips: [[13.2, 17], [18.8, 17]], sh: [[11, 2.4], [21, 2.4]], arm: 2.3, leg: 1.9, hand: 2.1, shoe: 2.9, sock: 2.6, short: [10.2, 14.5, 21.8, 20.5], v: 6, crest: 5.5, h: 32 };
  var SMALL = { torso: [10, 0, 22, 8.5], hem: 6.5, hips: [[13.4, 9.5], [18.6, 9.5]], sh: [[11.2, 1.6], [20.8, 1.6]], arm: 1.9, leg: 1.6, hand: 1.8, shoe: 2.5, sock: 0, short: [10.6, 8, 21.4, 11], v: 4, crest: 3, h: 16 };
  var UP_ARMS = function (y) { return [[[1.5, y - 1.5], [0, y - 8], 1], [[30.5, y - 1.5], [32, y - 8], 1]]; };
  var POSES = {
    b: {
      idle: { arms: [[[9.6, 8.5], [9.2, 14]], [[22.4, 8.5], [22.8, 14]]], legs: [[[13.2, 25.5], [13, 30]], [[18.8, 25.5], [19, 30]]] },
      run1: { arms: [[[9, 7], [11.5, 10.5]], [[23.5, 8], [25, 13]]], legs: [[[11.5, 25], [8.5, 28.5]], [[21, 24.5], [23.5, 30]]] },
      run2: { arms: [[[9.6, 8], [10, 13]], [[22.4, 8], [22, 13]]], legs: [[[13.5, 25.5], [13.2, 30]], [[18.5, 24], [19.5, 28]]] },
      run3: { arms: [[[9, 8], [7, 12.5]], [[23, 7], [20.5, 10.5]]], legs: [[[11.2, 24.5], [9, 30]], [[20.5, 25], [23.5, 28.5]]] },
      jump: { arms: UP_ARMS(0), legs: [[[12, 24.5], [11, 28.5]], [[20.5, 24], [22, 29.5]]] },
      cheer: { arms: UP_ARMS(0), legs: [[[13.2, 25.5], [13, 30]], [[21.5, 22.5], [18.5, 26.5]]] },
      dead: { arms: UP_ARMS(1), legs: [[[11.5, 25.5], [10.5, 30]], [[20.5, 25.5], [21.5, 30]]] },
      swim: { arms: [[[5.5, 4.5], [1.5, 6.5]], [[26.5, 4.5], [30.5, 6.5]]], legs: [[[12, 25], [10, 29]], [[20, 25.5], [22, 30]]] },
      throw: { arms: [[[9.6, 8.5], [9.2, 14]], [[26, 4.5], [30, 6]]], legs: [[[13.2, 25.5], [13, 30]], [[20, 25], [21.5, 30]]] }
    },
    s: {
      idle: { arms: [[[9.8, 4.5], [9.6, 7.8]], [[22.2, 4.5], [22.4, 7.8]]], legs: [[[13.4, 12.6], [13.2, 14]], [[18.6, 12.6], [18.8, 14]]] },
      run1: { arms: [[[9, 4], [11, 6.6]], [[23, 4.4], [24.6, 7.6]]], legs: [[[11.8, 12.4], [9.8, 13.4]], [[20.4, 12.2], [22.2, 14]]] },
      run2: { arms: [[[9.8, 4.5], [10, 7.8]], [[22.2, 4.5], [22, 7.8]]], legs: [[[13.6, 12.6], [13.4, 14]], [[18.4, 12.2], [19.2, 13]]] },
      run3: { arms: [[[9, 4.4], [7.8, 7.6]], [[23, 4], [21, 6.6]]], legs: [[[11.8, 12.2], [10.4, 14]], [[20.2, 12.4], [22.4, 13.2]]] },
      jump: { arms: [[[-0.5, -2], [-2, -7.5], 1], [[32.5, -2], [34, -7.5], 1]], legs: [[[12.2, 12.4], [11.6, 13.4]], [[20.2, 12], [21.2, 14]]] },
      cheer: { arms: [[[-0.5, -2], [-2, -7.5], 1], [[32.5, -2], [34, -7.5], 1]], legs: [[[13.4, 12.6], [13.2, 14]], [[20.8, 11.6], [18.8, 13]]] },
      dead: { arms: [[[-0.5, -1], [-2, -6.5], 1], [[32.5, -1], [34, -6.5], 1]], legs: [[[11.8, 12.6], [10.8, 14]], [[20.2, 12.6], [21.2, 14]]] },
      swim: { arms: [[[5.8, 2.6], [2, 4]], [[26.2, 2.6], [30, 4]]], legs: [[[12.2, 12.4], [10.6, 13.6]], [[19.8, 12.6], [21.4, 14]]] }
    }
  };
  var bodyParts = function (B, pose, top) {
    var o = HX, T = function (p) { return [o + p[0], top + p[1]]; };
    var t = B.torso, parts = [];
    // legs and shoes first (behind the shorts), then the shorts
    pose.legs.forEach(function (L, i) {
      var hip = T(B.hips[i]), knee = T(L[0]), foot = T(L[1]);
      var mid = [hip[0] + (knee[0] - hip[0]) * 0.5, hip[1] + (knee[1] - hip[1]) * 0.5];
      parts.push({ c: 's', f: limb([mid, knee, foot], B.leg), line: 'S' });
      if (B.sock) parts.push({ c: 'w', f: cap(foot[0], foot[1] - B.sock - 0.4, foot[0], foot[1] - 0.3, B.leg + 0.3), line: 'W' });
      parts.push({ c: 'z', f: ell(foot[0] + 0.8, foot[1] + 0.4, B.shoe, 1.55), line: 'z' });
      parts.push({ c: 'k', f: cap(hip[0], hip[1], mid[0], mid[1], B.leg + 1.4), line: 'K' });
    });
    parts.push({ c: 'k', f: rrect(o + B.short[0], top + B.short[1], o + B.short[2], top + B.short[3], 1.2), line: 'K',
      tex: function (x, y) { return x === o + 16 && y > top + B.short[1] + 2 ? 'K' : 'k'; } });
    // the jumper, its ribbed hem, the shirt's V and collar, the crest
    parts.push({ c: 'b', f: rrect(o + t[0], top + t[1], o + t[2], top + t[3], 3), line: 'B',
      tex: function (x, y) {
        // a football kit's stripe down the middle: red ('y' in the kit's colours) edged in white
        if (KIT === 'stripe') { var dx = Math.abs(x + 0.5 - (o + 16)); if (dx < 2) return 'y'; if (dx < 3) return 'w'; }
        return y >= top + B.hem ? ((x & 1) ? 'b' : 'B') : 'b';
      } });
    parts.push({ c: 'w', f: function (x, y) { return y >= top && y < top + B.v && Math.abs(x - o - 16) < (top + B.v - y) * 0.8; }, line: 'B',
      tex: function (x, y) { return y < top + 2 ? 'W' : 'w'; } });
    var cy = top + B.crest, csz = B === BIG ? 1.7 : 1.1;
    parts.push({ c: 'y', f: function (x, y) { return y > cy && y < cy + csz * 2.2 - Math.abs(x - o - 20.5) * 0.7 && Math.abs(x - o - 20.5) < csz; }, line: 'Y' });
    return parts;
  };
  var armParts = function (B, pose, top) {
    var o = HX, T = function (p) { return [o + p[0], top + p[1]]; }, parts = [];
    pose.arms.forEach(function (A2, i) {
      var sh = T(B.sh[i]), el = T(A2[0]), hd = T(A2[1]), up = A2[2];
      parts.push({ c: 'b', f: limb([sh, el, hd], B.arm), line: 'B',
        tex: function (x, y) { var dx = x + 0.5 - hd[0], dy = y + 0.5 - hd[1]; return dx * dx + dy * dy < (B.arm + 1.2) * (B.arm + 1.2) ? 'B' : 'b'; } });
      var hand = ell(hd[0], hd[1] + (up ? -0.6 : 0.8), B.hand + (up ? 0.3 : 0), B.hand);
      if (up) {
        // fingers spread wide
        var fingers = [-2.2, -0.75, 0.75, 2.2].map(function (dx) { return cap(hd[0] + dx * 0.6, hd[1] - 1.5, hd[0] + dx * 1.05, hd[1] - 3.8 + Math.abs(dx) * 0.35, 0.95); });
        var h0 = hand;
        hand = function (x, y) { return h0(x, y) || fingers.some(function (f) { return f(x, y); }); };
      }
      parts.push({ c: 's', f: hand, line: 'S' });
    });
    return parts;
  };
  var CROUCH = function (top) {
    var o = HX, parts = [];
    [[13, 7, 9, 9, 11.6, 10.4], [19, 7, 23, 9, 20.4, 10.4]].forEach(function (L) {
      parts.push({ c: 's', f: limb([[o + L[0], top + L[1]], [o + L[2], top + L[3]], [o + L[4], top + L[5]]], 1.9), line: 'S' });
      parts.push({ c: 'z', f: ell(o + L[4] + 0.8, top + L[5] + 0.4, 3, 1.5), line: 'z' });
    });
    parts.push({ c: 'k', f: rrect(o + 9, top + 5.5, o + 23, top + 8.6, 1.4), line: 'K' });
    parts.push({ c: 'b', f: rrect(o + 8.5, top, o + 23.5, top + 6.5, 3), line: 'B', tex: function (x, y) { return y >= top + 4.5 ? ((x & 1) ? 'b' : 'B') : 'b'; } });
    parts.push({ c: 'w', f: function (x, y) { return y >= top && y < top + 3.6 && Math.abs(x - o - 16) < (top + 3.6 - y) * 0.8; }, line: 'B' });
    [[10.5, 2], [21.5, 2]].forEach(function (sh, i) {
      var hd = [o + (i ? 24.5 : 7.5), top + 6];
      parts.push({ c: 'b', f: limb([[o + sh[0], top + sh[1]], hd], 2.4), line: 'B' });
      parts.push({ c: 's', f: ell(hd[0], hd[1] + 1, 2, 2), line: 'S' });
    });
    return parts;
  };
  var KIT = null;
  // poseName: one of POSES, or a pose of your own ({ arms, legs } in body coordinates) — see A.bonnie.pose
  var frame = function (size, poseName, kind) {
    var B = size === 'b' ? BIG : SMALL, top = HEAD_H, H2 = top + B.h, pose = typeof poseName === 'string' ? POSES[size][poseName] : poseName;
    var parts, neck = { c: 's', f: cap(HX + 17, 21, HX + 16.5, top + 1.5, size === 'b' ? 2.5 : 2.1), line: 'q' };
    if (poseName === 'crouch') { H2 = top + 13; parts = CROUCH(top).concat([neck], headParts()); }
    else parts = bodyParts(B, pose, top).concat([neck], headParts(), armParts(B, pose, top));
    var rows = scene(FW, H2, parts);
    face(rows, kind);
    var sp = BB.sprHi(rows, BPAL, 'shade');
    sp.noLight = NOLIGHT;
    return sp;
  };
  var P = A.bonnie = { s: {}, b: {} };
  ['idle', 'run1', 'run2', 'run3', 'cheer'].forEach(function (k) { P.s[k] = frame('s', k); P.b[k] = frame('b', k); });
  P.s.blink = frame('s', 'idle', 'blink'); P.b.blink = frame('b', 'idle', 'blink');
  P.s.jump = frame('s', 'jump', 'wheee'); P.b.jump = frame('b', 'jump', 'wheee');
  P.s.dead = frame('s', 'dead', 'hurt'); P.b.dead = frame('b', 'dead', 'hurt');
  P.s.swim = frame('s', 'swim', 'gasp'); P.b.swim = frame('b', 'swim', 'gasp');
  P.b.throw = frame('b', 'throw');
  P.b.crouch = frame('b', 'crouch');
  P.s.up = P.s.jump; P.b.up = P.b.jump;
  /* A set of every frame, built again with a pattern on the jumper: the
     PSG kit's stripe. (Liverpool's all-red kit is colours alone.) */
  var kitSet = function (kit) {
    KIT = kit;
    var K2 = { s: {}, b: {} };
    ['idle', 'run1', 'run2', 'run3', 'cheer'].forEach(function (k) { K2.s[k] = frame('s', k); K2.b[k] = frame('b', k); });
    K2.s.blink = frame('s', 'idle', 'blink'); K2.b.blink = frame('b', 'idle', 'blink');
    K2.s.jump = frame('s', 'jump', 'wheee'); K2.b.jump = frame('b', 'jump', 'wheee');
    K2.s.dead = frame('s', 'dead', 'hurt'); K2.b.dead = frame('b', 'dead', 'hurt');
    K2.s.swim = frame('s', 'swim', 'gasp'); K2.b.swim = frame('b', 'swim', 'gasp');
    K2.b.throw = frame('b', 'throw'); K2.b.crouch = frame('b', 'crouch');
    K2.s.up = K2.s.jump; K2.b.up = K2.b.jump;
    KIT = null;
    return K2;
  };
  P.kits = { stripe: kitSet('stripe') };
  /* Bonnie in a pose of your own, for things he does now and then (riding
     his bike, surfing): size 's' or 'b'; pose { arms: [[elbow, hand(, up)], ×2],
     legs: [[knee, foot], ×2] } in body coordinates (see POSES); kind is the
     face ('blink', 'wheee', 'hurt', 'gasp' or none). */
  P.pose = function (size, pose, kind) { return frame(size, pose, kind); };
  var V = BB.variant;
  P.red = V('red', { b: '#f24848', B: '#a42032' });
  P.rainbow = [
    V('rb0', { b: '#ff5a8c', B: '#b8205a', k: '#ffe048', 3: '#ffffff', 4: '#fff6a0' }),
    V('rb1', { b: '#7ee058', B: '#2e9a34', k: '#3a6cf4', 3: '#ffd0ec', 4: '#ffe8f6' }),
    V('rb2', { b: '#ffe048', B: '#d89a18', k: '#f24848', 3: '#a8e8ff', 4: '#e0f8ff' }),
    V('rb3', { b: '#a878f0', B: '#5c3ca8', k: '#7ee058', 3: '#c8f8a0', 4: '#ecffd8' })
  ];
  P.ghost = V('ghost', { b: '#9098b0', B: '#585a70', h: '#d0d4e8', H: '#9098b0', n: '#585a70', k: '#585a70', s: '#d0d4e8', S: '#9098b0', c: '#d0d4e8', w: '#ffffff', z: '#585a70' });
  // the HUD's face: just the head

  /* ==========================================================================
     ITEMS
     ========================================================================== */
  // the gold star — the collectible. Spins: full, three-quarter, edge-on.
  var starFn = function (cx, cy, R, r, sx) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R;
      pts.push([cx + Math.cos(a) * rr * sx, cy + Math.sin(a) * rr]);
    }
    return function (x, y) {
      var c = false;
      for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
  };
  A.starShape = starFn;
  var starFrame = function (sx) {
    var f = starFn(4.5, 5, 5.2, 2.3, sx);
    var rows = make(9, 9, [['y', f], ['Y', and(f, function (x, y) { return x - 4.5 * (1 - sx) > 5 * sx && y > 4; })]]);
    if (sx > 0.6) rows = over(rows, ['', '', '', '...x', '..x'], 0, 0);
    return spr(rows);
  };
  A.star = [starFrame(1), starFrame(0.7), starFrame(0.3), starFrame(0.7)];
  A.starSmall = spr(make(7, 7, [['y', starFn(3.5, 3.9, 4, 1.8, 1)]]));
  A.cupcake = spr([
    '....##....',
    '...#rr#...',
    '..#pxrp#..',
    '.#puppyp#.',
    '#pxpppppy#',
    '#ppypupppp#'.slice(0, 10),
    '#tTtTtTtT#',
    '.#tTtTtT#.',
    '.#tTtTtT#.',
    '..######..'
  ]);
  A.cupcake.rows[5] = '#pypppupp#';
  // the Super Ball: a beach ball, its four panels turning
  var ballFrame = function (w, rot) {
    var r = w / 2, cols = ['r', 'w', 'b', 'y'];
    var rows = make(w, w, [[' ', circ(r, r, r)]]);
    return spr(rows.map(function (row, y) {
      return row.split('').map(function (ch, x) {
        if (ch !== ' ') return ch;
        var a = Math.atan2(y + 0.5 - r, x + 0.5 - r) + rot;
        var k = ((Math.floor((a + Math.PI * 4) / (Math.PI / 2))) % 4 + 4) % 4;
        if ((x - r + 1.2) * (x - r + 1.2) + (y - r + 1.4) * (y - r + 1.4) < 1.1) return 'x';
        return cols[k];
      }).join('');
    }));
  };
  A.superball = [ballFrame(10, 0), ballFrame(10, Math.PI / 4)];
  A.thrown = [ballFrame(6, 0), ballFrame(6, Math.PI / 4), ballFrame(6, Math.PI / 2), ballFrame(6, Math.PI * 3 / 4)];
  // the rainbow lolly: the star power. A swirl on a stick
  (function () {
    var cols = ['r', 'o', 'y', 'l', 'u', 'v'];
    var rows = make(11, 11, [[' ', circ(5.5, 5.5, 5.5)]]);
    rows = rows.map(function (row, y) {
      return row.split('').map(function (ch, x) {
        if (ch !== ' ') return ch;
        var dx = x + 0.5 - 5.5, dy = y + 0.5 - 5.5;
        var a = Math.atan2(dy, dx), d = Math.sqrt(dx * dx + dy * dy);
        var k = Math.floor((a / (Math.PI * 2) * 6 + d * 1.1) + 60) % 6;
        if (d < 1) return 'w';
        return cols[k];
      }).join('');
    });
    rows = rows.concat(['....#w#....', '....#w#....', '....#w#....', '....###....']);
    A.lolly = spr(rows);
  })();
  A.heart = spr([
    '.###.###.',
    '#rxr#rrr#',
    '#xrrrrrr#',
    '#rrrrrrR#',
    '.#rrrrR#.',
    '..#rrR#..',
    '...#R#...',
    '....#....'
  ]);
  A.heartSmall = spr(['.#.#.', '#r#r#', '#rrr#', '.#r#.', '..#..']);
  A.debris = [spr(['.##.', '#11#', '#12#', '.##.']), spr(['##..', '#12#', '.#2#', '..##'])];
  A.puff = [spr(make(6, 6, [['w', circ(3, 3, 3)]], { outline: 'W' })), spr(make(4, 4, [['w', circ(2, 2, 2)]], { outline: 'W' }))];
  A.sparkle = [spr(['..w..', '..w..', 'ww.ww', '..w..', '..w..']), spr(['.....', '..x..', '.x.x.', '..x..', '.....']), spr(['w...w', '.....', '..x..', '.....', 'w...w'])];
  A.bubble = [spr(['.uu.', 'u..u', 'u.xu', '.uu.']), spr(['.u.', 'u.u', '.u.'])];

  /* ==========================================================================
     BLOCKS AND SET PIECES
     ========================================================================== */
  A.qblock = [
    spr(['.######.', '#xyyyyy#', '#yyOOyY#', '#yyyyOY#', '#yyyOyY#', '#yyyyyY#', '#YyyOyY#', '.######.']),
    spr(['.######.', '#xxyyyy#', '#xyOOyY#', '#yyyyOY#', '#yyyOyY#', '#yyyyyY#', '#YyyOyY#', '.######.']),
    spr(['.######.', '#yyyyyx#', '#yyOOyx#', '#yyyyOY#', '#yyyOyY#', '#yyyyyY#', '#YyyOyY#', '.######.'])
  ];
  A.used = spr(['.######.', '#tttttT#', '#t#tt#T#', '#ttttTT#', '#ttttTT#', '#t#tt#T#', '#TTTTTT#', '.######.']);
  A.brick = ['11141114', '22242224', '22242224', '44444444', '14111411', '24222422', '24222422', '44444444'];
  A.hard = ['11111114', '12222234', '12222234', '12223234', '12232234', '12222234', '13333334', '44444444'];
  A.pipeTop = spr([
    '################',
    '#xllLllllllllLd#',
    '#xllLllllllllLd#',
    '#xllLllllllllLd#',
    '#xllLllllllllLd#',
    '################',
    '.#xlLlllllllLd#.',
    '.#xlLlllllllLd#.'
  ]);
  A.pipeBody = spr(['.#xlLlllllllLd#.', '.#xlLlllllllLd#.', '.#xlLlllllllLd#.', '.#xlLlllllllLd#.', '.#xlLlllllllLd#.', '.#xlLlllllllLd#.', '.#xlLlllllllLd#.', '.#xlLlllllllLd#.']);
  A.pipeGrey = V('pgrey', { x: '#fffbe8', l: '#9098b0', L: '#585a70', d: '#2c2a3c' });
  A.pipeBlue = V('pblue', { x: '#e8f8ff', l: '#78d8ff', L: '#2c88d0', d: '#1e3ea8' });
  A.pipePink = V('ppink', { x: '#fff0f8', l: '#ff94cc', L: '#c04898', d: '#7c1848' });
  A.pipeRed = V('pred', { x: '#ffd0c0', l: '#f24848', L: '#a42032', d: '#5c1020' });
  A.spikes = spr([
    '.#...#..',
    '.#W..#W.',
    '#WW#.#WW',
    '#Wg##Wg#',
    'WWggWWgg',
    'gggGgggG',
    'GGGGGGGG',
    '########'
  ]);
  A.spikes.rows[0] = '..#...#.';
  A.spikes.rows[1] = '.#W#.#W#';
  A.spikes.rows[2] = '.#Wg#.#W';
  A.spikes.rows[3] = '#WWg##Wg';
  A.spring = [
    spr(['################', '#rrrrrrrrrrrrrr#', '#RRRRRRRRRRRRRR#', '################', '..#g#......#g#..', '..#W#.#..#.#W#..', '..#g#.#..#.#g#..', '..#W##.##.##W#..', '..#g#......#g#..', '.#GGG#....#GGG#.']),
    spr(['................', '................', '................', '................', '################', '#rrrrrrrrrrrrrr#', '#RRRRRRRRRRRRRR#', '################', '..#g##.##.##g#..', '.#GGG#....#GGG#.'])
  ];
  // a big bouncy mushroom, the woods' spring
  (function () {
    var cap = make(18, 9, [['p', ell(9, 9, 9, 8.5)], ['P', and(ell(9, 9, 9, 8.5), function (x, y) { return y > 6.5; })]]);
    cap = over(cap, ['', '...ww....ww......', '..wwww..wwww.ww..', '...ww....ww..ww..']);
    var stem = ['......#ww#........', '......#wW#........', '.....#wwwW#.......'];
    var a = cap.concat(stem);
    var squash = make(18, 9, [['p', ell(9, 9, 9.5, 6)], ['P', and(ell(9, 9, 9.5, 6), function (x, y) { return y > 6.5; })]]);
    squash = over(squash, ['', '', '', '...ww....ww......', '..wwww..wwww.ww..']);
    A.shroom = [spr(a.map(function (r) { return r.slice(0, 18); })), spr(squash.concat(['.....#wwwW#.......']).map(function (r) { return r.slice(0, 18); }))];
  })();
  // the checkpoint: a little flag that runs up its pole
  A.checkFlag = [spr(['#######', '#gggg#.', '#ggg#..', '#gg#...', '##.....']), spr(['########', '#bbybbb#', '#byyybb#', '#bbybbb#', '########'])];
  A.goalFlag = spr([
    '##########',
    '#rrrrrrr#.',
    '#rrryrrr#.',
    '#rryyyrr#.',
    '#rrryrrr#.',
    '#rryryrr#.',
    '#rrrrrrr#.',
    '##########'
  ]);
  A.goalFlag.rows = ['###########', '#rrrrrrrr#.', '#rrrryrrr#.', '#ryyyyyyr#.', '#rryyyyrr#.', '#rryrryrr#.', '#rrrrrrrr#.', '##########.'];
  A.goalFlag.w = 11; A.goalFlag.h = 8;
  A.ball = spr(['.##.', '#yx#', '#yY#', '.##.']);
  /* Monsty: Bonnie's purple monster, the one Grumble takes. From the toy
     itself: a ball of deep purple fuzz, a crest of sparkly orange spikes
     (the right-hand one the tallest), two big pale oval eyes with small
     pupils, a wide grin with a fang at each end, and lilac pads on his
     feet. The fur is flecked lighter and darker so it reads as fuzz. */
  (function () {
    var rows = make(15, 19, [
      ['q', function (x, y) { return ell(1.9, 13, 1.7, 3.1)(x, y) || ell(13.1, 13, 1.7, 3.1)(x, y); }],
      ['q', ell(7.5, 14.2, 5.9, 4.6)],
      ['q', ell(7.5, 8.6, 6.3, 5.4)],
      ['j', function (x, y) { return ell(4.4, 17.2, 2.3, 1.8)(x, y) || ell(10.6, 17.2, 2.3, 1.8)(x, y); }]
    ]);
    // fuzz: flecks of lighter and darker purple through the fur
    rows = rows.map(function (r, y) {
      return r.split('').map(function (c, x) {
        if (c !== 'q') return c;
        if ((x * 7 + y * 3) % 11 === 0) return 'Q';
        if ((x * 5 + y * 7) % 13 === 0) return 'm';
        return c;
      }).join('');
    });
    // the face, then the spikes — placed by hand, as they are too fine to
    // survive being outlined
    rows = over(rows, [
      '', '', '', '', '',
      '....WW...WW....',
      '...WWWW.WWWW...',
      '...WW#W.W#WW...',
      '....WW...WW....',
      '',
      '..#.........#..',
      '...#########...',
      '....w.....w....'
    ]);
    // the spikes sparkle, so each tip catches the light
    rows = over(rows, [
      '...........Y...',
      '.....Y..Y..oO..',
      '..Y..oO.oO.oO..',
      '..oO.oO.oO.oOO.'
    ]);
    // orange claws on his toes and fingers
    rows = over(rows, ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'o.............o', '..o.o....o.o...']);
    A.monsty = spr(rows, { q: '#7b2fc9', Q: '#4c1888', m: '#9d58ec', j: '#ab86f3', W: '#e8e6fb', o: '#f6a13a', O: '#c9701a', Y: '#ffe2a0' });
  })();
  // the cage Grumble keeps him in: Monsty is drawn first, the bars over him
  A.cage = spr((function () {
    var r = ['........###........', '.......#...#.......', '..###############..', '.#GGGGGGGGGGGGGGG#.'];
    for (var i = 0; i < 18; i++) r.push('.#g.g.g.g.g.g.g.g#.');
    r.push('.#GGGGGGGGGGGGGGG#.', '..###############..');
    return r;
  })());

  /* ==========================================================================
     ENEMIES — all face left (the way they first walk); flipped when they
     turn. Two frames of walk each, plus whatever their trick needs.
     ========================================================================== */
  var E = A.en = {};

  // Grumbug: a cross purple beetle. The everyday walker — stomp it flat.
  (function () {
    var body = [['v', ell(7.5, 5.5, 5.5, 4.8)], ['V', and(ell(7.5, 5.5, 5.5, 4.8), function (x, y) { return y > 6.6 || x > 11; })], ['K', circ(3.4, 6.6, 3.2)]];
    var base = make(13, 10, body);
    var face = ['', '', '', '', '...', '.w#', 'ww#', 'ww', '.#'];
    face = ['', '', '', '......x', '.##..xx', '.w#', '#w#.', '.......', ''];
    base = over(base, ['', '', '', '.......x', '......xx', '.##', '#ww#', '#w#', '']);
    base = over(base, ['', '', '', '', '.#', '..', '.#', '', '']);
    var legsA = ['..#..#..#....', '.#..#..#.....'], legsB = ['...#..#..#...', '...#..#..#...'];
    E.grumbug = [spr(base.concat(legsA)), spr(base.concat(legsB))];
    E.grumbugFlat = spr(make(13, 5, [['v', ell(7, 5, 6.5, 4)], ['K', circ(2.6, 4, 2.4)]]));
  })();

  // Snail: stomp it into its shell, then kick the shell (it skids into
  // everything in its way). Comes back out if you leave it.
  (function () {
    var shell = [['o', circ(9, 6.5, 6)], ['O', and(circ(9, 6.5, 6), not(circ(8.4, 6, 4.4)))], ['y', circ(8.6, 6.3, 2.2)]];
    var foot = ['p', function (x, y) { return y > 9.5 && y < 13 && x > 0.5 && x < 15.5; }];
    var head = ['p', ell(3.2, 7, 2.6, 4)];
    var rows = make(16, 13, [foot, head].concat(shell));
    rows = over(rows, ['.#....', '.#....', '#w#...', '#w#...', '', '', '.##', '', '', '', '', '', ''], 0, 0);
    var a = rows, b = over(rows, ['', '', '', '', '', '', '', '', '', '', '', '', '#.#.#.#.#.#.#.#.']);
    E.snail = [spr(a), spr(b)];
    E.shell = [spr(make(12, 11, [['o', circ(6, 5.5, 5.6)], ['O', and(circ(6, 5.5, 5.6), not(circ(5.5, 5, 3.8)))], ['y', circ(5.6, 5.2, 1.6)]])),
      spr(make(12, 11, [['o', circ(6, 5.5, 5.6)], ['O', and(circ(6, 5.5, 5.6), not(circ(6.6, 5, 3.8)))], ['y', circ(6.4, 5.2, 1.6)]]))];
  })();

  // Crab: scuttles sideways in quick bursts, claws up
  (function () {
    var b = [['r', ell(8, 7, 6, 3.6)], ['R', and(ell(8, 7, 6, 3.6), function (x, y) { return y > 8.5; })],
      ['r', circ(2, 3.5, 2)], ['r', circ(14, 3.5, 2)]];
    var rows = make(16, 11, b);
    rows = over(rows, ['', '', '..,.........,..', '', '.....#....#....', '....#w#..#w#...', '....#w#..#w#...']);
    var legsA = ['.#.#.#....#.#.#.', '#.#.#......#.#.#'], legsB = ['..#.#.#..#.#.#..', '..#.#.#..#.#.#..'];
    E.crab = [spr(rows.concat(legsA.slice(0, 1))), spr(rows.concat(legsB.slice(0, 1)))];
  })();

  // Seagull: glides in a lazy wave, wings up then down
  (function () {
    var body = [['w', ell(8, 6, 5, 2.6)], ['W', and(ell(8, 6, 5, 2.6), function (x, y) { return y > 7; })], ['w', circ(3.5, 5, 2.2)]];
    var up = make(16, 10, body.concat([['g', function (x, y) { return y < 6 && y > 0.5 && x > 6 && x < 12 - y * 0.4 && x > 6 + (5 - y) * 0.2; }]]));
    up = over(up, ['', '', '', '', '...#', '', '', '', '', ''], 0, 0);
    up = over(up, ['', '', '', '', '', 'oo', '#o', ''], 0, 0);
    var down = make(16, 12, body.concat([['g', function (x, y) { return y > 6.5 && y < 11.5 && x > 6 && x < 11 - (y - 7) * 0.4; }]]));
    down = over(down, ['', '', '', '', '...#', 'oo', '#o', ''], 0, 0);
    E.gull = [spr(up.concat(['', ''])), spr(down)];
  })();

  // Bee: bobs up and down on a beat
  (function () {
    var body = [['y', ell(8, 7, 5, 3.6)], ['K', function (x, y) { return ell(8, 7, 5, 3.6)(x, y) && (Math.floor(x) === 8 || Math.floor(x) === 10); }], ['y', circ(3.4, 6.5, 2.6)]];
    var a = make(14, 11, body.concat([['u', ell(9, 2.5, 3, 2.4)]]));
    a = over(a, ['', '', '', '', '', '..#', '.#w', '', '...........#.'], 0, 0);
    var b = make(14, 11, body.concat([['u', ell(10.5, 3, 3, 1.8)]]));
    b = over(b, ['', '', '', '', '', '..#', '.#w', '', '...........#.'], 0, 0);
    E.bee = [spr(a), spr(b)];
  })();

  // Fish: swims in waves under the sea
  (function () {
    var f = [['o', ell(8, 5, 6, 4)], ['O', and(ell(8, 5, 6, 4), function (x, y) { return y > 6.5; })], ['o', function (x, y) { return x > 12.5 && x < 16 && Math.abs(y - 5) < (x - 12) * 1.2; }]];
    var a = make(16, 10, f);
    a = over(a, ['', '', '...#', '..#w', '..##', '', '..#', '', '', ''], 0, 0);
    a = over(a, ['', '', '', '', '', '', '', '......y.y', '', ''], 0, 0);
    var b = make(16, 10, [f[0], f[1], ['o', function (x, y) { return x > 12.5 && x < 15.5 && Math.abs(y - 5) < (x - 12) * 0.8 + 0.6; }]]);
    b = over(b, ['', '', '...#', '..#w', '..##', '', '..#', '', '', ''], 0, 0);
    E.fish = [spr(a), spr(b)];
  })();

  // Jellyfish: drifts up in pulses, sinks slowly
  (function () {
    var bell = [['p', ell(7, 6, 6.5, 5.5)], ['P', and(ell(7, 6, 6.5, 5.5), function (x, y) { return y > 8; })], ['', box(0, 9, 14, 20)]];
    var top = make(14, 9, bell);
    top = over(top, ['', '...x', '..xx', '', '....#...#', '....#...#', '', '.....###', '']);
    var tentA = ['..p..p..p..p..', '.p..p..p..p...', '..p..p..p..p..', '.p..p..p..p...'], tentB = ['..p..p..p..p..', '...p..p..p..p.', '..p..p..p..p..', '...p..p..p..p.'];
    E.jelly = [spr(top.concat(tentA)), spr(top.concat(tentB))];
  })();

  // Ghost: shy — it hides its face while you look at it, and drifts after
  // you when you turn your back
  (function () {
    var g = [['w', function (x, y) { return ell(8, 7, 7, 7)(x, y) || (y > 7 && y < 14 + Math.sin(x * 1.6) * 1.3 && x > 1 && x < 15); }], ['W', function (x, y) { return y > 10.5 && y < 14 + Math.sin(x * 1.6) * 1.3 && x > 1 && x < 15; }]];
    var base = make(16, 16, g);
    var chase = over(base, ['', '', '', '', '...##...##', '..#ww#.#ww#', '..##w#.##w#', '..####.####', '', '....#mmmm#', '....#mwwm#', '.....####']);
    chase = over(chase, ['', '', '', '', '', '', '', '', '', '', '', '']);
    var shy = over(base, ['', '', '', '', '', '', '...cc.....cc', '', '..#ww#..#ww#', '.#www#..#www#', '.#ww#....#ww#', '']);
    E.ghost = [spr(chase), spr(shy)];
  })();

  // Bat: hangs upside down until you pass under, then swoops
  (function () {
    var body = [['V', ell(8, 6, 3.2, 3.6)], ['v', circ(8, 5, 1.6)]];
    var wingsUp = make(16, 10, body.concat([['V', function (x, y) { return y < 6 && y > 0.5 && (x < 6 || x > 10) && y > Math.abs(x - 8) * 0.9 - 3.5; }]]));
    wingsUp = over(wingsUp, ['', '', '', '', '......r.r', '', '.......ww', '']);
    var wingsDown = make(16, 10, body.concat([['V', function (x, y) { return y > 4 && y < 9.5 && (x < 6 || x > 10) && y < 10 - Math.abs(x - 8) * 0.6; }]]));
    wingsDown = over(wingsDown, ['', '', '', '', '......r.r', '', '.......ww', '']);
    var hang = make(10, 12, [['V', ell(5, 6, 4, 5.6)], ['v', ell(5, 7, 2, 2.6)]]);
    hang = over(hang, ['....#.#', '', '', '', '', '', '', '', '...r.r', '', '', '']);
    E.bat = [spr(wingsUp), spr(wingsDown), spr(hang)];
  })();

  // Hedgehog: spiky all over — never stomp one. Throw a ball, or kick a shell.
  (function () {
    var spikes = function (x, y) { var a = Math.atan2(y - 9, x - 8); var r = 6 + (Math.floor((a + 4) * 2.6) % 2 ? 2 : 0); return Math.sqrt((x - 8) * (x - 8) + (y - 9) * (y - 9)) < r && y < 11; };
    var b = [['T', spikes], ['t', ell(8, 9, 5.5, 4.5)], ['s', ell(3, 9.5, 3, 2.4)]];
    var a = make(16, 13, b);
    a = over(a, ['', '', '', '', '', '', '', '', '..#', '#', '', '', '']);
    var legsA = ['...#....#.....', '..#....#......'], legsB = ['....#....#....', '....#....#....'];
    E.hog = [spr(a.slice(0, 12).concat(legsA.slice(0, 1))), spr(a.slice(0, 12).concat(legsB.slice(0, 1)))];
  })();

  // Grumpy Rock: wakes when you pass underneath and drops like a stone,
  // then grinds slowly back up
  (function () {
    var r = [['g', box(0, 0, 18, 18)], ['G', function (x, y) { return x > 14 || y > 14; }], ['W', function (x, y) { return x < 3 || y < 3; }]];
    var rows = make(18, 18, r);
    var sleep = over(rows, ['', '', '', '', '', '', '...##....##...', '', '', '', '', '....#######...', '', '', '', '', '', '']);
    var awake = over(rows, ['', '', '', '', '..#.......#', '...##...##', '..#ww#.#ww#', '..#w##.#w##', '...##...##', '', '...#######', '..#rrrrrrr#', '..#w#w#w#w#', '...#######', '', '', '', '']);
    sleep = over(sleep, ['', '', '.....W....W', '', '', '', '', '', '', '', '', '', '', '', '...W.......W', '', '', '']);
    E.rock = [spr(sleep), spr(awake)];
  })();

  // Penguin: waddles, then belly-slides at you on the ice
  (function () {
    var p = [['K', ell(6, 8, 5, 6.5)], ['w', ell(7.2, 9, 3.4, 5)], ['o', box(0, 6, 2.5, 8)]];
    var a = make(12, 15, p);
    a = over(a, ['', '', '', '...#', '..#w', '', 'oo', '', '', '', '', '', '', '', ''], 0, 0);
    a[14] = '...oo..oo...';
    var b = a.slice(); b[14] = '..oo....oo..';
    var slide = make(16, 9, [['K', ell(8, 5, 7.5, 4)], ['w', ell(8, 6.6, 6, 2.2)]]);
    slide = over(slide, ['', '', '.#', '#w', 'oo', '', '', '', '']);
    E.penguin = [spr(a), spr(b), spr(slide)];
  })();

  // Snowman: stands its ground and lobs snowballs
  (function () {
    var s = [['w', circ(7, 15.5, 5.5)], ['w', circ(7, 6.5, 4.3)], ['W', and(circ(7, 15.5, 5.5), function (x, y) { return x > 9.5 || y > 18.5; })],
      ['r', box(2.5, 9.6, 11.5, 11.2)], ['K', box(3, 0, 11, 2.6)], ['K', box(1.5, 2, 12.5, 3)]];
    var a = make(14, 21, s);
    a = over(a, ['', '', '', '', '', '....#..#', '', '...o', '..oo..', '', '', '', '', '......#', '', '......#', '', '', '', '', '']);
    var b = a.slice();
    b = over(b, ['', '', '', '', '', '....#..#', '', '..oo', '', '', '', '', '', '', '', '', '', '', '', '', ''], 0, 0);
    E.snowman = [spr(a), spr(b)];
    E.snowball = spr(make(6, 6, [['w', circ(3, 3, 3)], ['W', and(circ(3, 3, 3), function (x, y) { return x + y > 6.5; })]]));
  })();

  // Robot: a clockwork toy, marching; its key turns as it goes
  (function () {
    var r = [['g', box(2, 3, 13, 12)], ['W', box(3, 4, 12, 5)], ['G', box(2, 10, 13, 12)], ['g', box(4, 12, 11, 15)]];
    var a = make(15, 16, r);
    a = over(a, ['.......#', '......#r#', '', '', '', '...#ww#', '...#w##', '', '...#####', '...#y#y#', '', '', '', '', '', '']);
    a = over(a, ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '....#...#', '...##..##']);
    var b = over(a.slice(), ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '...#....#', '..##....##']);
    a = over(a, ['', '', '', '', '', '', '', '', '', '', '', '............', '', '', '', ''], 0, 0);
    E.robot = [spr(a), spr(b)];
    E.key = [spr(['.##.', '#yy#', '.##.', '..#.', '..#.']), spr(['....', '####', '#yy#', '..#.', '..#.'])];
  })();

  // Snappy plant: rises out of a pipe and chomps — unless you stand right by it
  (function () {
    var head = [['r', ell(7, 6, 6, 5.6)], ['', function (x, y) { return y > 4.5 && y < 7.5 && x > 7; }]];
    var a = make(14, 12, head);
    a = over(a, ['', '..w..w', '', '.w....w', '', '', '', '...w..w', '', '', '', '']);
    var b = make(14, 12, [['r', ell(7, 6, 6, 5.6)], ['', function (x, y) { return y > 5.3 && y < 6.7 && x > 9; }]]);
    b = over(b, ['', '..w..w', '', '.w....w', '', '', '', '...w..w', '', '', '', '']);
    var stem = ['......#L#.....', '...##.#L#.##..', '..#lL##L##Ll#.', '...##.#L#.##..', '......#L#.....', '......#L#.....'];
    E.plant = [spr(a.concat(stem)), spr(b.concat(stem))];
  })();

  // Lava bubble: leaps out of the lava and falls back in
  E.bubble = [spr(make(10, 11, [['f', ell(5, 5.5, 4.6, 5.2)], ['F', ell(4.4, 4.4, 2.4, 2.6)], ['x', circ(3.6, 3.4, 0.9)]]).map(function (r, y) { return y === 5 ? r.slice(0, 2) + '#' + r.slice(3, 6) + '#' + r.slice(7) : r; })),
    spr(make(10, 11, [['f', ell(5, 5.5, 4.4, 5.4)], ['F', ell(5.4, 4.4, 2.4, 2.6)], ['x', circ(5.4, 3.4, 0.9)]]).map(function (r, y) { return y === 5 ? r.slice(0, 2) + '#' + r.slice(3, 6) + '#' + r.slice(7) : r; }))];
  E.fireball = [spr(make(8, 8, [['f', circ(4, 4, 4)], ['F', circ(3.6, 3.6, 2.2)], ['x', circ(3.2, 3.2, 0.8)]])), spr(make(8, 8, [['f', circ(4, 4, 4)], ['F', circ(4.4, 4.4, 2.2)], ['x', circ(4.8, 4.8, 0.8)]]))];
  E.ember = spr(make(4, 4, [['F', circ(2, 2, 2)]], { outline: 'f' }));

  // Grumble the dragon: the last level's boss. 32x30, green, round and
  // cross, with a crown he hasn't earned.
  (function () {
    var d = [
      ['l', ell(18, 19, 11, 10)],                        // body
      ['y', ell(15, 21, 6, 6.5)],                         // belly
      ['l', ell(9, 9, 7.5, 6.5)],                         // head
      ['l', box(1, 9, 8, 14)],                            // snout
      ['l', function (x, y) { return ell(28, 24, 4.5, 2.6)(x, y) || (x > 29 && x < 32 && y > 19 && y < 25 && y > 19 + (32 - x) * 1.4); }],
      ['L', function (x, y) { return ell(18, 19, 11, 10)(x, y) && x > 25; }],
      ['o', function (x, y) { return [[19, 9], [23, 10], [26.5, 12.5]].some(function (c) { return y > c[1] - 3 && y < c[1] + 1.5 && Math.abs(x - c[0]) < (c[1] + 1.5 - y) * 0.55; }); }],
      ['l', box(11, 27, 16, 30)], ['l', box(21, 27, 26, 30)]   // feet
    ];
    var base = make(32, 30, d);
    var face = [
      '.......y.y.y',
      '......#y#y#y#',
      '......#yyyyy#',
      '',
      '',
      '',
      '......##',
      '.....#ww#',
      '.....#w##',
      '..........',
      '..#...',
      '',
      '.#ww#w#w#w#',
      '..'
    ];
    base = over(base, face, 0, 0);
    var closed = base.slice();
    var open = over(base, ['', '', '', '', '', '', '', '', '', '', '', '', '', '#rrrr', '#rrr', '###'], 0, 0);
    var hurt = over(base, ['', '', '', '', '', '', '....#.#', '.....#', '....#.#'], 0, 0);
    var stepB = over(base.slice(), ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '..........######....######', '..........######....######', '..........######....######'], 0, 0);
    E.dragon = { walk: [spr(closed), spr(stepB)], open: spr(open), hurt: spr(hurt) };
  })();

  /* ==========================================================================
     DECORATION — scenery that stands in front of the background but behind
     everything you touch. Each level's theme lists which it uses.
     ========================================================================== */
  var D = A.deco = {};
  D.bush = spr(make(24, 9, [['l', function (x, y) { return circ(5, 7, 4.5)(x, y) || circ(12, 5.5, 5.8)(x, y) || circ(19, 7, 4.6)(x, y); }], ['L', function (x, y) { return y > 7.5; }], ['', box(0, 9, 24, 12)]]).map(function (r, y) { return y === 3 ? r.replace(/l(?=l{3})/, 'x') : r; }));
  D.bushS = spr(make(14, 7, [['l', function (x, y) { return circ(4, 5.5, 3.6)(x, y) || circ(9.5, 4, 4.4)(x, y); }], ['L', function (x, y) { return y > 5.5; }]]));
  D.flowerR = spr(['.#r#.', '#ryr#', '.#r#.', '..L..', '.lL..', '..L..']);
  D.flowerY = spr(['.#y#.', '#yoy#', '.#y#.', '..L..', '..Ll.', '..L..']);
  D.flowerP = spr(['.#p#.', '#pwp#', '.#p#.', '..L..', '.lL..', '..L..']);
  D.fence = spr(['.#.....#', '#t#...#t', '#tT###tT', '#ttttttt', '#tT###tT', '#t#...#t', '#t#...#t', '#t#...#t']);
  D.fence.rows = ['.##....', '#tt#...', '#tT####', '#tTtttt', '#tT####', '#tT#...', '#tT####', '#tTtttt', '#tT####', '#tT#...'];
  D.fence.w = 7; D.fence.h = 10;
  D.sign = spr(['.##########.', '#tttttttttt#', '#tTTTTTTTTt#', '#tttttttttt#', '#tTTTTTTt.t#', '#tttttttttt#', '.##########.', '.....#T#....', '.....#T#....', '.....#T#....']);
  D.sign.rows[2] = '#t#t#tt#t#t#';
  D.tree = spr(make(22, 30, [
    ['l', function (x, y) { return circ(11, 9, 8.6)(x, y) || circ(5, 13, 5)(x, y) || circ(17, 13, 5)(x, y); }],
    ['L', function (x, y) { return (circ(11, 9, 8.6)(x, y) || circ(5, 13, 5)(x, y) || circ(17, 13, 5)(x, y)) && y > 13; }],
    ['t', box(9, 17, 13, 30)], ['T', box(12, 18, 13, 30)]
  ]).map(function (r, y) { return y === 5 ? r.replace(/l{3}/, 'lxl') : r; }));
  D.palm = spr((function () {
    var rows = make(26, 34, [
      ['t', function (x, y) { return y > 8 && y < 34 && Math.abs(x - (13 + Math.sin(y / 9) * 2.5)) < 1.8; }],
      ['L', function (x, y) { return (ell(7, 6, 7, 2.8)(x, y) && y > 3) || (ell(19, 6, 7, 2.8)(x, y) && y > 3) || ell(13, 4, 3, 3.5)(x, y) || (ell(5, 10, 4.5, 2)(x, y)) || ell(21, 10, 4.5, 2)(x, y); }],
      ['l', function (x, y) { return (ell(7, 5, 6, 1.6)(x, y)) || ell(19, 5, 6, 1.6)(x, y); }],
      ['O', function (x, y) { return circ(11.5, 8.5, 1.5)(x, y) || circ(14.5, 8.5, 1.5)(x, y); }]
    ]);
    return rows.map(function (r, y) { return y > 10 && y % 3 === 0 ? r.replace(/t(?=t)/, 'T') : r; });
  })());
  D.castle = spr([
    '..#.#....#.#..',
    '..#y#....#y#..',
    '.#oyo#..#oyo#.',
    '.#ooo####ooo#.',
    '.#oOoooooooO#.',
    '#oooOooooooooo#'.slice(0, 14),
    '#oooo#ww#oooo#',
    '#Oooo#ww#ooOo#',
    '##############'
  ]);
  D.castle.rows[5] = '#oooOooooooOo#'.slice(0, 13) + '#';
  D.umbrella = spr(make(20, 22, [
    ['r', and(ell(10, 8, 10, 7), function (x, y) { return y < 8; })],
    ['w', function (x, y) { return ell(10, 8, 10, 7)(x, y) && y < 8 && Math.floor((x + 1) / 4) % 2 === 0; }],
    ['W', box(9.5, 7, 10.5, 22)]
  ]));
  D.shell = spr(['..###..', '.#pwp#.', '#pwpwp#', '#wpwpw#', '.#####.']);
  D.starfish = spr(['...#...', '..#o#..', '##ooo##', '#ooyoo#', '.#ooo#.', '#o#.#o#', '##...##']);
  D.seaweed = [spr(['.#.', '#l#', '#l#.', '.#l#', '.#l#', '#l#', '#l#', '.#l#', '.#l#', '#l#', '#l#', '#L#']), spr(['..#', '.#l#', '.#l#', '#l#', '#l#', '.#l#', '.#l#', '#l#', '#l#', '.#l#', '.#l#', '.#L#'])];
  D.coral = spr(make(16, 14, [
    ['p', function (x, y) { return (Math.abs(x - 8) < 1.6 && y > 4) || (Math.abs(x - 4 + (y - 10) * 0.3) < 1.4 && y > 3 && y < 11) || (Math.abs(x - 12 - (y - 10) * 0.3) < 1.4 && y > 2 && y < 11) || box(3, 9, 13, 11)(x, y) || circ(8, 3.5, 2)(x, y) || circ(3, 3, 1.6)(x, y) || circ(13, 2.2, 1.6)(x, y); }],
    ['P', function (x, y) { return y > 10; }]
  ]));
  D.mushroom = spr(make(10, 10, [['r', and(ell(5, 5, 5, 4.4), function (x, y) { return y < 5.5; })], ['w', box(3, 5, 7, 10)]]).map(function (r, y) { return y === 2 ? r.replace(/r{2}/, 'ww') : r; }));
  D.pumpkin = spr(make(12, 10, [['o', ell(6, 6, 5.8, 4)], ['O', function (x, y) { return ell(6, 6, 5.8, 4)(x, y) && (Math.floor(x) === 3 || Math.floor(x) === 8); }], ['L', box(5, 0, 7, 2.5)]]).map(function (r, y) { return y === 5 ? r.replace(/o{2}O/, 'y.O') : r; }));
  D.deadtree = spr(make(20, 34, [
    ['V', function (x, y) { return (Math.abs(x - 10) < 2.4 && y > 8) || (Math.abs(x - 10 + (14 - y) * 0.7) < 1.2 && y > 5 && y < 14) || (Math.abs(x - 10 - (16 - y) * 0.8) < 1.2 && y > 6 && y < 17) || (Math.abs(x - 10 - (24 - y) * 0.6) < 1 && y > 18 && y < 24); }]
  ]));
  D.crystal = [spr(make(10, 14, [['u', function (x, y) { return (Math.abs(x - 5) < (y - 1) * 0.6 && y < 14) && (Math.abs(x - 5) < 3.2); }], ['x', function (x, y) { return x < 4.5 && x > 3 && y > 4 && y < 10; }], ['U', function (x, y) { return x > 6 && y > 6; }]])),
    spr(make(10, 14, [['p', function (x, y) { return (Math.abs(x - 5) < (y - 1) * 0.6 && y < 14) && (Math.abs(x - 5) < 3.2); }], ['w', function (x, y) { return x < 4.5 && x > 3 && y > 4 && y < 10; }], ['P', function (x, y) { return x > 6 && y > 6; }]]))];
  D.lamp = spr(['..###..', '.#yyy#.', '#yxyyy#', '#yyyyy#', '.#yyy#.', '..###..', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...', '..###..', '.#####.']);
  D.pine = spr(make(18, 30, [
    ['L', function (x, y) { return (y < 26) && Math.abs(x - 9) < ((y % 9) + 2) * 0.75 + Math.floor(y / 9) * 1.2; }],
    ['w', function (x, y) { return (y < 26) && Math.abs(x - 9) < ((y % 9) + 2) * 0.75 + Math.floor(y / 9) * 1.2 && (y % 9) < 2.5; }],
    ['t', box(7.5, 25, 10.5, 30)]
  ]));
  D.snowman = E.snowman[0];
  D.igloo = spr(make(24, 12, [['w', and(ell(12, 12, 12, 11), function (x, y) { return y < 12; })], ['W', function (x, y) { return Math.floor(y) % 4 === 3 || (Math.floor(y / 4) % 2 ? Math.floor(x) % 6 === 0 : Math.floor(x) % 6 === 3); }], ['K', and(ell(12, 12, 3.6, 5.4), function (x, y) { return y < 12; })]]));
  D.gear = [spr(make(16, 16, [['g', function (x, y) { var a = Math.atan2(y - 8, x - 8), r = Math.sqrt((x - 8) * (x - 8) + (y - 8) * (y - 8)); return r < (Math.floor((a + 4) * 8 / Math.PI) % 2 ? 8 : 6.4) && r > 2.2; }], ['G', function (x, y) { var r = Math.sqrt((x - 8) * (x - 8) + (y - 8) * (y - 8)); return r < 4 && r > 2.2; }]]))];
  D.blocks = spr(['########.', '#rrrrrr#.', '#rwrrwr#.', '#rrrrrr#.', '########.', '#bbb#yyy#', '#bwb#ywy#', '#bbb#yyy#', '#########']);
  D.blocks.rows = ['.######...', '.#rrrr#...', '.#rwwr#...', '.#rrrr#...', '########..', '#bbbb#yyy#', '#bwwb#ywy#', '#bbbb#yyy#', '##########'];
  D.blocks.w = 10;
  D.torch = [spr(['..#..', '.#F#.', '#fFf#', '#fff#', '.#f#.', '#####', '.#t#.', '.#t#.', '.#T#.']), spr(['.#...', '#F#..', '#Ff#.', '#fff#', '.#f#.', '#####', '.#t#.', '.#t#.', '.#T#.'])];
  D.banner = spr(['#########', '#rrrrrrr#', '#rryyyrr#', '#ryrrryr#', '#rryyyrr#', '#rrrrrrr#', '#rrrrrrr#', '.#rrrrr#.', '..#rrr#..', '...#r#...', '....#....']);
  D.chain = spr(['.#.', '#g#', '.#.', '#g#']);
  D.bench = spr(['##############', '#tttttttttttt#', '##############', '#tttttttttttt#', '##############', '.#T#......#T#.', '.#T#......#T#.']);
  D.swing = spr((function () {
    var r = [];
    r.push('##########################');
    r.push('#rrrrrrrrrrrrrrrrrrrrrrrr#');
    r.push('##########################');
    for (var i = 0; i < 20; i++) {
      var s = '.' + (i < 20 ? '#' : '.') + '...g.........g....' + '...#' + '.';
      r.push(('.' + 'r' + '....g.......g.........r' + '.').slice(0, 26));
    }
    r.push('.r...######.######.....r.'.slice(0, 26));
    r.push('.r...#yyyy#.#yyyy#.....r.'.slice(0, 26));
    r.push('.r...######.######.....r.'.slice(0, 26));
    for (i = 0; i < 6; i++) r.push('.r.....................r..'.slice(0, 26));
    return r.map(function (row) { return row.replace(/r/g, '#'); });
  })(), null, 'free');
  D.slide = spr(make(30, 30, [
    ['b', function (x, y) { return y > 1 && y < 30 && x > 1 && x < 4.5; }],
    ['b', function (x, y) { return y > 1 && y < 30 && x > 9 && x < 11.5; }],
    ['W', function (x, y) { return y > 1 && y < 30 && x > 4 && x < 9 && Math.floor(y) % 4 === 1; }],
    ['y', function (x, y) { return x > 10 && x < 30 && Math.abs(y - (3 + (x - 10) * 1.3)) < 2.2; }],
    ['r', box(0, 0, 13, 3.5)]
  ]));
  D.cloudBank = spr(make(40, 14, [['w', function (x, y) { return circ(7, 9, 6)(x, y) || circ(16, 6, 7)(x, y) || circ(26, 7, 7)(x, y) || circ(34, 9, 5.6)(x, y) || box(4, 9, 37, 14)(x, y); }], ['u', function (x, y) { return y > 10.5; }]], { outline: 'U' }));
  D.balloon = spr(['.####.', '#rxrr#', '#rrrr#', '#rrrR#', '.#RR#.', '..##..', '...#..', '..#...', '...#..', '..#...']);
  D.rainbow = spr(make(48, 20, [['r', and(ell(24, 20, 24, 20), not(ell(24, 20, 21, 17)))], ['o', and(ell(24, 20, 21, 17), not(ell(24, 20, 18, 14)))], ['y', and(ell(24, 20, 18, 14), not(ell(24, 20, 15, 11)))], ['l', and(ell(24, 20, 15, 11), not(ell(24, 20, 12, 8)))], ['u', and(ell(24, 20, 12, 8), not(ell(24, 20, 9.5, 5.5)))]], { outline: false }));

  /* ==========================================================================
     GROUND TILES — one pair of tiles (top, fill) per style. The edges and
     the corners are added as the level is drawn, from the neighbours.
     ========================================================================== */
  A.ground = {
    grass: {
      top: ['12111211', '11211121', '22122212', '32232223', '33333333', '34333433', '33334333', '43333334'],
      fill: ['33343333', '33333343', '43333333', '33334333', '33333333', '34333334', '33343333', '33333333']
    },
    sand: {
      top: ['11111111', '12111211', '22222222', '22322222', '22222232', '23222222', '22223222', '22222222'],
      fill: ['22222222', '22232222', '22222223', '32222222', '22222322', '22322222', '22222242', '22222222']
    },
    rock: {
      top: ['11211121', '22222222', '22232222', '32224223', '22242222', '42222242', '22322422', '22422222'],
      fill: ['22242222', '32222232', '22242222', '24422242', '22222422', '23222222', '42222422', '22442222']
    },
    stone: {
      top: ['11111111', '12222212', '22222232', '33333333', '44444444', '22322222', '22322223', '33433333'],
      fill: ['22232222', '22232222', '33343333', '44444444', '22222232', '22222232', '33333343', '44444444']
    },
    snow: {
      top: ['11111111', '11111111', '11211112', '22122221', '32323232', '34333433', '33333333', '33433333'],
      fill: ['33333333', '33433333', '33333343', '43333333', '33333433', '33333333', '34333333', '33333343']
    },
    cloud: {
      top: ['21111112', '11111111', '11111111', '11112111', '11111111', '11211111', '11111111', '22211222'],
      fill: ['11121111', '11111111', '12111111', '11111211', '11111111', '11111111', '21111121', '11111111']
    },
    metal: {
      top: ['11111111', '12222221', '23222232', '22222222', '22222222', '23222232', '22222222', '44444444'],
      fill: ['12222221', '23222232', '22222222', '22222222', '22222222', '22222222', '23222232', '44444444']
    },
    reef: {
      top: ['11211121', '21122112', '22222222', '22232222', '32222232', '22222222', '22322223', '22222222'],
      fill: ['22222322', '23222222', '22222232', '32222222', '22232222', '22222222', '22222322', '32222222']
    }
  };
  /* One-way platforms: stand on them, jump up through them. */
  A.semi = {
    bridge: ['44444444', '11121112', '22232223', '44444444', '.4....4.', '.4....4.', '........', '........'],
    cloud: ['.111111.', '11111111', '11121111', '22222222', '.2.22.2.', '........', '........', '........'],
    branch: ['44444444', '12211221', '33333333', '44444444', '........', '........', '........', '........'],
    girder: ['44444444', '11111111', '24222422', '22424224', '44444444', '........', '........', '........'],
    coral: ['.444444.', '41211214', '42222224', '.443344.', '...44...', '........', '........', '........'],
    ice: ['44444444', '11111111', '12111121', '33333333', '44444444', '........', '........', '........'],
    mushroom: ['.444444.', '41121114', '41111211', '42222224', '.444444.', '........', '........', '........']
  };
  // a crate, a toy block, an ice block: the solid blocks of each world
  A.crate = ['44444444', '41111214', '42411424', '42141424', '42414124', '42411424', '41222224', '44444444'];

  /* ==========================================================================
     FINE TILES — the worlds' ground, bricks and platforms drawn at the
     screen's full density (16x16 for an 8x8 tile), generated from each
     theme's four colours plus the tones between them, so ten worlds share
     one set of drawings. Two of each ground tile, alternated across the
     level, so the repeat isn't obvious.
     ========================================================================== */
  var N = 16;
  var tones = function (P) {
    var mix = BB.mix;
    return { 1: P[0], 2: P[1], 3: P[2], 4: P[3], 5: mix(P[0], '#ffffff', 0.45), 6: mix(P[1], P[2], 0.5), 7: mix(P[2], P[3], 0.45),
      8: mix(P[2], '#ffffff', 0.2), 9: mix(P[3], '#1c1428', 0.35), 0: mix(P[1], P[3], 0.45) };
  };
  var grid = function (ch, h) { var g = []; for (var y = 0; y < (h || N); y++) { g.push([]); for (var x = 0; x < N; x++) g[y].push(ch); } return g; };
  var hi = function (g, pal) { return BB.sprHi(g.map(function (r) { return r.join(''); }), pal); };
  var put = function (g, x, y, c) { if (y >= 0 && y < g.length) g[y][((x % N) + N) % N] = c; };
  var GROUND = {
    grass: function (rnd) {
      /* A thick turf: blade tips against the sky, two greens lit from
         above, then a lip that hangs over the soil in rounded tongues
         with a shadow tucked underneath it. */
      var mk = function (top) {
        var g = grid('3'), i, x, y;
        dirt(g, rnd, top ? 10 : 0);
        if (!top) return g;
        var ph = rnd() * 6;
        for (x = 0; x < N; x++) {
          var lip = 6 + Math.round(2.4 * Math.abs(Math.sin((x + ph) * Math.PI / 5.3)));
          var tip = rnd() < 0.45 ? 0 : rnd() < 0.6 ? 1 : 2;
          for (y = 0; y <= lip && y < N; y++) g[y][x] = y < tip ? '.' : y === tip ? '5' : y < tip + 2 ? '1' : y < lip - 1 ? '2' : '0';
          if (lip + 1 < N) g[lip + 1][x] = '7';
        }
        for (i = 0; i < 9; i++) { var sx = Math.floor(rnd() * N), sy = 2 + Math.floor(rnd() * 3); if (g[sy][sx] !== '.') { g[sy][sx] = '1'; g[sy + 1][sx] = '1'; } }
        for (i = 0; i < 7; i++) { var dx = Math.floor(rnd() * N), dy = 4 + Math.floor(rnd() * 2); if (g[dy][dx] === '2') g[dy][dx] = '0'; }
        return g;
      };
      return [mk(true), mk(true), mk(false), mk(false)];
    },
    sand: function (rnd, pebble) {
      var mk = function (top) {
        var g = grid('2'), x, y;
        for (var i = 0; i < 22; i++) put(g, Math.floor(rnd() * N), Math.floor(rnd() * N), rnd() < 0.6 ? '6' : '8');
        if (top) {
          for (x = 0; x < N; x++) { g[0][x] = '5'; g[1][x] = '1'; g[2][x] = '1'; g[3][x] = rnd() < 0.5 ? '1' : '2'; }
          for (x = 0; x < N; x++) { y = 6 + Math.round(Math.sin(x * 0.7) * 1.2); g[y][x] = '6'; }
        }
        for (x = 0; x < N; x++) { y = 11 + Math.round(Math.sin(x * 0.55 + 2) * 1.2); g[y][x] = '6'; }
        if (pebble) for (i = 0; i < 3; i++) { x = Math.floor(rnd() * N); y = 8 + Math.floor(rnd() * 6); put(g, x, y, 'p'); put(g, x + 1, y, 'p'); put(g, x, y + 1, 'P'); put(g, x + 1, y + 1, 'P'); }
        return g;
      };
      return [mk(true), mk(true), mk(false), mk(false)];
    },
    reef: function (rnd) { return GROUND.sand(rnd, true); },
    // cave rock: cobbles, found by distance to scattered seeds (wrapping
    // round, so the tile repeats seamlessly)
    rock: function (rnd) {
      var mk = function (top) {
        var seeds = [], i, x, y, g = grid('2');
        for (i = 0; i < 5; i++) seeds.push([rnd() * N, rnd() * N]);
        var near = function (x, y) {
          var d1 = 99, d2 = 99;
          seeds.forEach(function (s) {
            var dx = Math.abs(x + 0.5 - s[0]), dy = Math.abs(y + 0.5 - s[1]);
            dx = Math.min(dx, N - dx); dy = Math.min(dy, N - dy);
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
          });
          return d2 - d1;
        };
        var m = [];
        for (y = 0; y < N; y++) { m.push([]); for (x = 0; x < N; x++) m[y].push(near(x, y) < 1.3); }
        var mm = function (x, y) { return m[((y % N) + N) % N][((x % N) + N) % N]; };
        for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
          if (mm(x, y)) g[y][x] = '4';
          else if (mm(x - 1, y) || mm(x, y - 1)) g[y][x] = '1';
          else if (mm(x + 1, y) || mm(x, y + 1)) g[y][x] = '3';
          else g[y][x] = rnd() < 0.08 ? '6' : '2';
        }
        if (top) for (x = 0; x < N; x++) { g[0][x] = '5'; if (g[1][x] !== '4') g[1][x] = '1'; }
        return g;
      };
      return [mk(true), mk(true), mk(false), mk(false)];
    },
    // the castle's dressed stone: two courses of blocks, bevelled
    stone: function (rnd) {
      var mk = function (top, shift) {
        var g = grid('2');
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
          var off = (y < 8 ? 0 : 8) + shift, by = y % 8, bx = (x + off) % 16;
          var c = by === 7 || bx === 15 ? '4' : by === 0 || bx === 0 ? '1' : by === 6 || bx === 14 ? '3' : rnd() < 0.07 ? '6' : '2';
          g[y][x] = c;
        }
        if (top) for (var k = 0; k < N; k++) { g[0][k] = '5'; g[1][k] = g[1][k] === '4' ? '4' : '1'; }
        return g;
      };
      return [mk(true, 0), mk(true, 4), mk(false, 0), mk(false, 4)];
    },
    snow: function (rnd) {
      var ice = function (g, y0) {
        for (var y = y0; y < N; y++) for (var x = 0; x < N; x++) g[y][x] = (x + y * 2) % 11 === 0 || (x + y * 2) % 11 === 1 ? '8' : rnd() < 0.05 ? '7' : '3';
      };
      // a soft drift of snow on top, hanging over the ice in rounded tongues
      var mk = function (top) {
        var g = grid('3'), x, y;
        ice(g, 0);
        if (!top) return g;
        var ph = rnd() * 6;
        for (x = 0; x < N; x++) {
          var y0 = Math.round(1 + Math.sin(x * 0.75 + ph));
          var lip = 6 + Math.round(2.2 * Math.abs(Math.sin((x + ph) * Math.PI / 6)));
          for (y = 0; y <= lip && y < N; y++) g[y][x] = y < y0 ? '.' : y === y0 ? '5' : y < 4 ? '1' : y < lip - 1 ? '1' : '2';
          if (lip + 1 < N) g[lip + 1][x] = '7';
          if (rnd() < 0.25) for (y = lip + 2; y < lip + 4 + Math.floor(rnd() * 3) && y < N; y++) g[y][x] = '2';
        }
        for (var i = 0; i < 5; i++) put(g, Math.floor(rnd() * N), 2 + Math.floor(rnd() * 3), '5');
        return g;
      };
      return [mk(true), mk(true), mk(false), mk(false)];
    },
    cloud: function (rnd) {
      var mk = function (top) {
        var g = grid('1'), x, y;
        for (var i = 0; i < 3; i++) {
          var cx = rnd() * N, cy = rnd() * N;
          for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
            var dx = Math.min(Math.abs(x - cx), N - Math.abs(x - cx)), dy = Math.min(Math.abs(y - cy), N - Math.abs(y - cy));
            var d = dx * dx + dy * dy;
            if (d < 10 && d > 6 && y > cy) g[y][x] = '2';
          }
        }
        if (top) for (x = 0; x < N; x++) {
          var y0 = Math.round(3 - 3 * Math.abs(Math.sin((x + 4) * Math.PI / 8)));
          for (y = 0; y < y0; y++) g[y][x] = '.';
          g[y0][x] = '3';
          if (y0 + 1 < N) g[y0 + 1][x] = '1';
        }
        return g;
      };
      return [mk(true), mk(true), mk(false), mk(false)];
    },
    metal: function () {
      var mk = function (top) {
        var g = grid('2');
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
          g[y][x] = x === 15 || y === 15 ? '4' : x === 14 || y === 14 ? '3' : x === 0 || y === 0 ? '1' : (x + y) % 13 === 0 ? '6' : '2';
        }
        [[3, 3], [12, 3], [3, 12], [12, 12]].forEach(function (r) { g[r[1]][r[0]] = '5'; g[r[1] + 1][r[0] + 1] = '4'; g[r[1]][r[0] + 1] = '1'; });
        if (top) for (var k = 0; k < N; k++) {
          g[0][k] = '5'; g[1][k] = '1';
          for (var yy = 2; yy < 5; yy++) g[yy][k] = (k + yy) % 8 < 4 ? 'y' : 'K';
          g[5][k] = '4';
        }
        return g;
      };
      return [mk(true), mk(true), mk(false), mk(false)];
    }
  };
  // dirt: the soil under grass, with pebbles that catch the light
  var dirt = function (g, rnd, y0) {
    for (var i = 0; i < 14; i++) { var x = Math.floor(rnd() * N), y = y0 + Math.floor(rnd() * (N - y0)); if (y < N && g[y][x] === '3') g[y][x] = '7'; }
    for (i = 0; i < 4; i++) {
      var px = Math.floor(rnd() * N), py = y0 + Math.floor(rnd() * Math.max(1, N - y0 - 2));
      if (py + 1 >= N) continue;
      put(g, px, py, '8'); put(g, px + 1, py, '8'); put(g, px, py + 1, '6'); put(g, px + 1, py + 1, '7');
    }
  };
  var BRICK = function (rnd) {
    var g = grid('2');
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var off = y < 8 ? 0 : 4, by = y % 8, bx = (x + off) % 8;
      g[y][x] = by === 7 || bx === 7 ? '4' : by === 0 ? '1' : bx === 0 ? '1' : by === 6 || bx === 6 ? '3' : rnd() < 0.08 ? '6' : '2';
    }
    return g;
  };
  var HARD = function () {
    var g = grid('2');
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var c = '2';
      if (x === 0 || y === 0 || x === 15 || y === 15) c = '4';
      else if (x === 1 || y === 1) c = '5';
      else if (x === 2 || y === 2) c = '1';
      else if (x === 14 || y === 14) c = '9';
      else if (x === 13 || y === 13) c = '3';
      else if ((x - y === 0 || x - y === 1) && x > 3 && x < 12) c = '1';
      g[y][x] = c;
    }
    return g;
  };
  var CRATE = function () {
    var g = grid('2');
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var c = y % 5 === 4 ? '3' : '2';
      if (Math.abs(x - (15 - y)) < 1.5) c = '1';
      if (Math.abs(x - (15 - y)) >= 1.5 && Math.abs(x - (15 - y)) < 2.5) c = '3';
      if (x < 2 || y < 2) c = '1';
      if (x > 13 || y > 13) c = '3';
      if (x === 0 || y === 0 || x === 15 || y === 15) c = '4';
      g[y][x] = c;
    }
    return g;
  };
  var SEMI = {
    bridge: function () {
      var g = grid('.');
      for (var x = 0; x < N; x++) {
        var seam = x === 7 || x === 15;
        g[0][x] = '4'; g[1][x] = seam ? '4' : '5'; g[2][x] = seam ? '4' : '1'; g[3][x] = seam ? '4' : '2'; g[4][x] = seam ? '4' : '2'; g[5][x] = '3'; g[6][x] = '4';
      }
      put(g, 2, 2, '9'); put(g, 11, 2, '9');
      for (var y = 7; y < 12; y++) { put(g, 2, y, '4'); put(g, 3, y, '3'); put(g, 4, y, '4'); put(g, 11, y, '4'); put(g, 12, y, '3'); put(g, 13, y, '4'); }
      return g;
    },
    cloud: function () {
      var g = grid('.');
      for (var x = 0; x < N; x++) {
        var y0 = Math.round(3 - 3 * Math.abs(Math.sin((x + 4) * Math.PI / 8)));
        for (var y = y0; y < 10; y++) g[y][x] = y === y0 ? '3' : y < 7 ? '1' : y < 9 ? '2' : '3';
      }
      return g;
    },
    branch: function () {
      var g = grid('.');
      for (var x = 0; x < N; x++) {
        g[1][x] = '4'; g[2][x] = '1';
        for (var y = 3; y < 7; y++) g[y][x] = (x + y * 3) % 7 === 0 ? '3' : '2';
        g[7][x] = '3'; g[8][x] = '4';
      }
      put(g, 9, 4, '4'); put(g, 10, 4, '3'); put(g, 9, 5, '3');
      return g;
    },
    girder: function () {
      var g = grid('.');
      for (var x = 0; x < N; x++) {
        g[0][x] = '4'; g[1][x] = '5'; g[2][x] = '1';
        for (var y = 3; y < 7; y++) g[y][x] = '2';
        g[7][x] = '3'; g[8][x] = '3'; g[9][x] = '4';
      }
      [4, 12].forEach(function (cx) { for (var y = 3; y < 7; y++) for (var x = cx - 2; x <= cx + 1; x++) if ((x - cx + 0.5) * (x - cx + 0.5) + (y - 4.5) * (y - 4.5) < 3.2) g[y][x] = y < 5 ? '9' : '4'; });
      [1, 7, 9, 15].forEach(function (x) { put(g, x, 1, '9'); });
      return g;
    },
    coral: function () {
      var g = grid('.');
      for (var x = 0; x < N; x++) {
        var y0 = Math.round(1.5 + Math.sin(x * 1.1) * 1.4);
        for (var y = y0; y < 9; y++) g[y][x] = y === y0 ? '4' : y === y0 + 1 ? '1' : y < 7 ? '2' : y < 8 ? '3' : '4';
      }
      return g;
    },
    ice: function () {
      var g = grid('.');
      for (var x = 0; x < N; x++) {
        g[0][x] = '4'; g[1][x] = '5'; g[2][x] = '1';
        for (var y = 3; y < 7; y++) g[y][x] = ((x - y * 2) % 10 + 10) % 10 < 2 ? '5' : '2';
        g[7][x] = '3'; g[8][x] = '4';
      }
      return g;
    }
  };
  /* ---- the world's own blocks -------------------------------------------------------
     Nothing borrowed: where the classic has "?" blocks, bricks and green
     pipes, Bonnie's world has presents, wooden toy blocks and columns of
     each world's own stuff. All painted on a grid of characters, then
     outlined automatically, so the shapes stay easy to change. */
  var canvas = function (w, h) { var g = []; for (var y = 0; y < h; y++) { g.push([]); for (var x = 0; x < w; x++) g[y].push('.'); } return g; };
  var fill = function (g, test, c) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) if (test(x + 0.5, y + 0.5)) g[y][x] = typeof c === 'function' ? c(x, y) : c; };
  var rectT = function (x0, y0, x1, y1) { return function (x, y) { return x >= x0 && x < x1 && y >= y0 && y < y1; }; };
  var ellT = function (cx, cy, rx, ry) { return function (x, y) { var dx = (x - cx) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy <= 1; }; };
  // an outline round every shape: any empty cell touching a painted one
  var outline = function (g, c) {
    var h = g.length, w = g[0].length, out = g.map(function (r) { return r.slice(); });
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      if (g[y][x] !== '.') continue;
      if ((x > 0 && g[y][x - 1] !== '.') || (x < w - 1 && g[y][x + 1] !== '.') || (y > 0 && g[y - 1][x] !== '.') || (y < h - 1 && g[y + 1][x] !== '.')) out[y][x] = c || '#';
    }
    return out;
  };
  var rows = function (g) { return g.map(function (r) { return r.join(''); }); };

  // a present, wrapped in Monsty's purple with an orange ribbon and bow;
  // three frames of a glint running over the paper
  var GIFT_PAL = { h: '#c49af8', p: '#9a5ae8', q: '#7038c4', Q: '#4c2290', o: '#ffb444', O: '#e0821c', y: '#ffe2a0', w: '#ffffff' };
  var gift = function (f) {
    var g = canvas(16, 16);
    fill(g, rectT(2, 7, 14, 15), function (x, y) { return x < 4 ? 'h' : x > 11 || y > 13 ? 'q' : 'p'; });
    fill(g, rectT(1, 4, 15, 7), function (x, y) { return y === 4 ? 'h' : y === 6 ? 'Q' : 'p'; });
    fill(g, rectT(7, 4, 9, 15), function (x) { return x === 7 ? 'o' : 'O'; });
    fill(g, rectT(2, 10, 14, 12), function (x, y) { return x === 7 || x === 8 ? 'y' : y === 10 ? 'o' : 'O'; });
    fill(g, ellT(5, 2.2, 2.6, 1.7), 'o'); fill(g, ellT(11, 2.2, 2.6, 1.7), 'o');
    fill(g, ellT(5.2, 2.4, 1, 0.6), 'O'); fill(g, ellT(10.8, 2.4, 1, 0.6), 'O');
    fill(g, rectT(7, 2, 9, 4), 'y');
    if (f === 1) { g[8][4] = 'w'; g[9][5] = 'h'; g[5][3] = 'w'; }
    if (f === 2) { g[12][10] = 'w'; g[8][11] = 'h'; g[5][12] = 'w'; }
    return BB.sprHi(rows(outline(g)), GIFT_PAL);
  };
  A.qblock = [gift(0), gift(1), gift(2)];
  // opened: the paper gone, an empty cardboard box with its flaps open
  A.used = (function () {
    var g = canvas(16, 16);
    fill(g, rectT(2, 7, 14, 15), function (x, y) { return y === 7 ? '4' : x < 4 ? '1' : x > 11 || y > 13 ? '3' : '2'; });
    fill(g, function (x, y) { return y >= 4 && y < 7 && x > 1 && x < 7 - (y - 4) * 0.6 + 1 && x > 1 + (7 - y) * 0.3; }, '1');
    fill(g, function (x, y) { return y >= 4 && y < 7 && x < 14 && x > 9 + (y - 4) * 0.6 - 1 && x < 14 - (7 - y) * 0.3; }, '3');
    fill(g, rectT(5, 10, 11, 11), '3');
    return BB.sprHi(rows(outline(g)), { 1: '#e8c088', 2: '#c89458', 3: '#9c6a38', 4: '#5c3a1c' });
  })();

  /* Wooden toy blocks, in each world's colours, with a shape carved into
     the face — a star, a heart or a moon — so a row of them reads as a
     shelf of toys. Three of them, mixed along a row. */
  var SHAPES = [
    function (x, y) { var a = Math.atan2(y - 8, x - 8), r = Math.hypot(x - 8, y - 8.3); return r < 2.1 + 1.5 * Math.pow(Math.abs(Math.cos(a * 2.5 + 1.57)), 2); },
    function (x, y) { var dx = x - 8, dy = y - 7.4; return Math.pow(dx * dx + dy * dy - 7, 3) - dx * dx * dy * dy * dy * 1.6 < 0 || (Math.abs(dx) < 3.6 - (dy + 1) * 1.1 && dy > -1 && dy < 3.3); },
    function (x, y) { return ellT(8, 8, 3.6, 3.6)(x, y) && !ellT(9.6, 6.9, 3, 3)(x, y); }
  ];
  var TOY = function (k) {
    var g = canvas(16, 16), carve = SHAPES[k];
    fill(g, rectT(0, 0, 16, 16), function (x, y) {
      var edge = Math.min(x, y, 15 - x, 15 - y);
      if (edge === 0) return (x === 0 || y === 0) && x + y < 3 || (x === 15 || y === 15) && x + y > 27 ? '.' : '4';
      if (x === 1 || y === 1) return '5';
      if (x === 2 || y === 2) return '1';
      if (x === 14 || y === 14) return '9';
      if (x === 13 || y === 13) return '3';
      if (carve(x + 0.5, y + 0.5)) return carve(x - 0.5, y - 0.5) ? '3' : '7';
      if (carve(x - 0.5, y - 0.5)) return '1';
      return '2';
    });
    return g;
  };

  /* Columns: where the classic has green pipes, each world has one of its
     own — a tree stump, a sandcastle tower, a coral tube, a crystal rock,
     a snowy stump, a cloud pillar, a factory funnel, a castle chimney.
     A top (16x8 game pixels) over a body that repeats down. */
  var COLS = {
    stump: { pal: { a: '#fff0c8', b: '#e8c890', c: '#c89a5c', d: '#a06a38', e: '#7a4a28', f: '#5a3418', g: '#3c2210', m: '#7ed858', M: '#3e9a40' } },
    snowstump: { pal: { a: '#fff0c8', b: '#e8c890', c: '#c89a5c', d: '#a06a38', e: '#7a4a28', f: '#5a3418', g: '#3c2210', s: '#ffffff', S: '#d6ecff', T: '#a8c8f0' } },
    sandcastle: { pal: { a: '#fff6d0', b: '#f8e0a0', c: '#e8c070', d: '#c8984c', e: '#9c6c34', f: '#ff7a5a', w: '#ffffff' } },
    coral: { pal: { a: '#ffe0f0', b: '#ffa8cc', c: '#ff78aa', d: '#d04888', e: '#8a2058', f: '#4c1030' } },
    crystal: { pal: { a: '#d8d0ec', b: '#a898c8', c: '#7c6ca0', d: '#584878', e: '#382c54', k: '#e0fbff', K: '#7ae8ff', L: '#3ab0d8', n: '#ffd0f4', N: '#ff8ae0' } },
    cloud: { pal: { a: '#ffffff', b: '#eef4ff', c: '#d0e0ff', d: '#a8c0f0', e: '#7c90d0' } },
    funnel: { pal: { a: '#f0f4ff', b: '#c8d0e4', c: '#98a4c0', d: '#6a7694', e: '#3c4660', y: '#ffd23c', Y: '#c89a10', k: '#2a2a38' } },
    chimney: { pal: { a: '#e8d8e0', b: '#c0a8b8', c: '#906c80', d: '#644858', e: '#3c2834', k: '#1c1018', o: '#ff9a3a' } }
  };
  var column = function (style) {
    var top = canvas(32, 16), body = canvas(32, 16), x, y;
    var shade = function (x, w) { var k = x / w; return k < 0.12 ? 'b' : k < 0.3 ? 'c' : k < 0.72 ? 'c' : k < 0.88 ? 'd' : 'e'; };
    if (style === 'stump' || style === 'snowstump') {
      // bark: vertical grooves, lit from the left
      var bark = function (g, y0, y1) { fill(g, rectT(2, y0, 30, y1), function (x, y) { var k = (x - 2) / 28, groove = (x * 7 + Math.floor(y / 5) * 3) % 6 === 0; return groove ? 'f' : k < 0.15 ? 'c' : k < 0.75 ? 'd' : 'e'; }); };
      bark(body, 0, 16); bark(top, 5, 16);
      // the cut face, with its rings
      fill(top, ellT(16, 4.5, 15, 4.2), function (x, y) { var r = Math.hypot((x - 16.5) / 15, (y - 4.5) / 4.2); return r > 0.86 ? 'd' : r > 0.7 ? 'b' : Math.floor(r * 6) % 2 ? 'b' : 'a'; });
      if (style === 'stump') { fill(top, rectT(3, 6, 8, 8), function (x, y) { return y === 6 ? 'm' : 'M'; }); }
      else { fill(top, function (x, y) { return y < 4.5 + Math.sin(x * 0.7) * 1.2 && ellT(16, 4, 15.5, 4.8)(x, y); }, function (x, y) { return y < 2.5 ? 's' : x > 24 ? 'T' : 'S'; }); fill(top, function (x, y) { return y >= 5 && y < 6.5 + Math.sin(x * 1.3) * 0.8 && x > 2 && x < 30; }, 'S'); }
    } else if (style === 'sandcastle') {
      var sand = function (g, y0, y1) { fill(g, rectT(2, y0, 30, y1), function (x, y) { var k = (x - 2) / 28; return (y % 8 === 7) ? 'd' : (x + (y >> 3) * 6) % 12 === 0 ? 'd' : k < 0.2 ? 'b' : k < 0.75 ? 'c' : 'd'; }); };
      sand(body, 0, 16); sand(top, 6, 16);
      for (x = 0; x < 4; x++) fill(top, rectT(1 + x * 8, 1, 7 + x * 8, 6), function (xx) { return xx % 8 < 3 ? 'a' : 'b'; });
      fill(top, rectT(0, 5, 32, 7), function (xx, yy) { return yy === 5 ? 'a' : 'c'; });
      fill(top, ellT(16, 11, 2, 2), 'e'); top[9][15] = 'w';
      fill(body, ellT(9, 9, 1.4, 1.1), 'f'); fill(body, ellT(23, 4, 1.2, 1), 'w');
    } else if (style === 'coral') {
      var cor = function (g, y0, y1) { fill(g, function (x, y) { return y >= y0 && y < y1 && x >= 3 + Math.sin(y * 0.6) * 0.8 && x < 29 + Math.sin(y * 0.6 + 2) * 0.8; }, function (x, y) { var k = (x - 3) / 26, bump = ((x * 3 + y * 5) % 9 === 0); return bump ? 'a' : k < 0.2 ? 'b' : k < 0.7 ? 'c' : 'd'; }); };
      cor(body, 0, 16); cor(top, 6, 16);
      fill(top, ellT(16, 5, 15, 4.5), function (x, y) { var r = Math.hypot((x - 16.5) / 15, (y - 5) / 4.5); return r > 0.78 ? (y < 5 ? 'b' : 'd') : r > 0.55 ? 'e' : 'f'; });
    } else if (style === 'crystal') {
      var rock = function (g, y0, y1) { fill(g, rectT(2, y0, 30, y1), function (x, y) { var k = (x - 2) / 28, strata = (y + Math.floor(x / 9)) % 6 === 0; return strata ? 'd' : k < 0.15 ? 'b' : k < 0.7 ? 'c' : 'd'; }); };
      rock(body, 0, 16); rock(top, 7, 16);
      fill(top, ellT(16, 8, 15, 3), function (x) { return x < 10 ? 'a' : 'b'; });
      [[8, 7, 2, 'K', 'k', 'L'], [15, 7, 3, 'N', 'n', 'N'], [23, 7, 2, 'K', 'k', 'L']].forEach(function (c) {
        fill(top, function (x, y) { return y < c[1] && y > c[1] - c[2] * 3 && Math.abs(x - c[0]) < (c[1] - y) * 0.36 + 0.6; }, function (x) { return x < c[0] ? c[4] : c[3]; });
      });
    } else if (style === 'cloud') {
      var puffs = function (g, y0, y1, off) { fill(g, function (x, y) { return y >= y0 && y < y1 && x >= 2.5 + Math.abs(Math.sin((y + off) * 0.4)) * 2 && x < 29.5 - Math.abs(Math.sin((y + off) * 0.4 + 1)) * 2; }, function (x, y) { var k = x / 32; return k < 0.25 ? 'a' : k < 0.65 ? 'b' : k < 0.85 ? 'c' : 'd'; }); };
      puffs(body, 0, 16, 0); puffs(top, 6, 16, 6);
      [[7, 6, 6], [16, 4.5, 7.5], [25, 6, 6]].forEach(function (c) { fill(top, ellT(c[0], c[1], c[2], 4.3), function (x, y) { return y < c[1] - 1.5 ? 'a' : x > c[0] + 2 ? 'c' : 'b'; }); });
    } else if (style === 'funnel') {
      var pipe = function (g, y0, y1) { fill(g, rectT(4, y0, 28, y1), function (x, y) { if ((y === 4 || y === 12) && (x === 6 || x === 25)) return 'a'; return shade(x - 4, 24); }); };
      pipe(body, 0, 16); pipe(top, 8, 16);
      fill(top, rectT(1, 1, 31, 8), function (x, y) { if (y === 1) return 'a'; if (y >= 3 && y <= 5) return ((x + y) >> 1) % 3 === 0 ? 'k' : 'y'; return shade(x - 1, 30); });
    } else if (style === 'chimney') {
      var brick = function (g, y0, y1) { fill(g, rectT(3, y0, 29, y1), function (x, y) { var row = y >> 2, off = row % 2 ? 4 : 0; if (y % 4 === 3 || (x + off) % 8 === 0) return 'd'; var k = (x - 3) / 26; return k < 0.15 ? 'a' : k < 0.7 ? 'b' : 'c'; }); };
      brick(body, 0, 16); brick(top, 6, 16);
      fill(top, rectT(1, 2, 31, 7), function (x, y) { return y === 2 ? 'a' : y === 6 ? 'd' : 'b'; });
      fill(top, rectT(6, 0, 26, 3), function (x, y) { return y < 2 ? 'k' : 'e'; });
      top[1][12] = 'o'; top[1][19] = 'o';
    }
    var pal = COLS[style].pal;
    return { top: BB.sprHi(rows(outline(top)), pal), body: BB.sprHi(rows(outline(body)), pal) };
  };
  A.column = column;
  A.hiTheme = function (name, th) {
    var rnd = BB.rng(name.length * 131 + name.charCodeAt(0) * 7);
    var gp = tones(th.gpal), gen = GROUND[th.ground] || GROUND.grass, gs = gen(rnd);
    var sp = tones(th.spal), semi = SEMI[th.semi];
    return {
      top: [hi(gs[0], gp), hi(gs[1], gp)],
      fill: [hi(gs[2], gp), hi(gs[3], gp)],
      brick: hi(TOY(0), tones(th.brick)),
      bricks: [hi(TOY(0), tones(th.brick)), hi(TOY(1), tones(th.brick)), hi(TOY(2), tones(th.brick))],
      col: column(th.column || 'stump'),
      hard: hi(HARD(), tones(th.hard)),
      crate: hi(CRATE(), tones(th.hard)),
      semi: semi ? hi(semi(), sp) : null
    };
  };

  /* ==========================================================================
     THEMES — each world's colours, ground, scenery and background. Tile
     palettes are [1, 2, 3, 4], light to dark.
     ========================================================================== */
  A.themes = {
    hills: {
      sky: ['#8ccfff', '#a8dcff', '#c4e8ff'], ground: 'grass', gpal: ['#9cf060', '#4cbc3c', '#c8803c', '#7a4424'],
      brick: ['#ffb070', '#d86830', '#a84418', '#3c1c18'], hard: ['#f4c890', '#d89858', '#a86830', '#4c2818'],
      semi: 'bridge', spal: ['#f8d090', '#c88840', '#8a5424', '#3c2414'], column: 'stump',
      deco: ['bush', 'bushS', 'flowerR', 'flowerY', 'fence', 'tree'], bg: 'hills', music: 'hills'
    },
    park: {
      sky: ['#78c0ff', '#98d4ff', '#bce4ff'], ground: 'grass', gpal: ['#b8f070', '#68c848', '#e09858', '#904c2c'],
      brick: ['#ffc8a0', '#f07858', '#b84838', '#401c1c'], hard: ['#fff0a0', '#f8c838', '#d08818', '#5c3410'],
      semi: 'bridge', spal: ['#ffe0a0', '#f8a040', '#b86020', '#4c2410'], column: 'stump',
      deco: ['bush', 'flowerP', 'flowerY', 'bench', 'tree', 'bushS', 'blocks'], bg: 'park', music: 'park'
    },
    beach: {
      sky: ['#5cc8ff', '#80d8ff', '#b0ecff'], ground: 'sand', gpal: ['#fff4c0', '#f8dc88', '#e0b860', '#a07838'],
      brick: ['#ffd8a8', '#e8a060', '#b86c38', '#4c2c18'], hard: ['#fff0d0', '#e8c890', '#c09858', '#5c4024'],
      semi: 'bridge', spal: ['#f0c890', '#c08850', '#80542c', '#3c2414'], column: 'sandcastle',
      deco: ['palm', 'umbrella', 'shell', 'starfish', 'castle', 'shell'], bg: 'beach', music: 'beach', sea: true
    },
    reef: {
      sky: ['#1c58b8', '#2468c8', '#2c78d8'], ground: 'reef', gpal: ['#f8e0a0', '#d8b070', '#a88048', '#584020'],
      brick: ['#ffb0c8', '#f07098', '#b03868', '#401830'], hard: ['#c0f0e0', '#70c8b0', '#389080', '#184038'],
      semi: 'coral', spal: ['#ffc8e0', '#ff88b8', '#c04888', '#601838'], column: 'coral',
      deco: ['seaweed', 'coral', 'starfish', 'shell', 'seaweed'], bg: 'reef', music: 'reef', water: true
    },
    woods: {
      sky: ['#24184a', '#2e2058', '#3a2a68'], ground: 'grass', gpal: ['#58b878', '#2c7850', '#4c3458', '#281830'],
      brick: ['#a890d0', '#7058a8', '#483878', '#1c1430'], hard: ['#9880b8', '#685090', '#403060', '#1c1028'],
      semi: 'branch', spal: ['#b08868', '#7c5838', '#4c3020', '#20140c'], column: 'stump',
      deco: ['mushroom', 'pumpkin', 'deadtree', 'mushroom', 'bushS'], bg: 'woods', music: 'woods', dark: true
    },
    cave: {
      sky: ['#140f24', '#1a1430', '#20183a'], ground: 'rock', gpal: ['#a898c8', '#6c5c90', '#483c68', '#221a38'],
      brick: ['#88a8d8', '#5874b0', '#384c80', '#18203c'], hard: ['#b0a0d0', '#7868a0', '#504070', '#201838'],
      semi: 'girder', spal: ['#d0a070', '#a07040', '#684420', '#2c1c0c'], column: 'crystal',
      deco: ['crystal', 'crystal', 'lamp'], bg: 'cave', music: 'cave', dark: true, ceiling: true
    },
    snow: {
      sky: ['#a8d8ff', '#c0e4ff', '#dcf0ff'], ground: 'snow', gpal: ['#ffffff', '#e0f0ff', '#90b8e0', '#5078a8'],
      brick: ['#e8f8ff', '#a8d8f8', '#68a8d8', '#28507c'], hard: ['#f0f8ff', '#c8e4f8', '#88b8e0', '#38608c'],
      semi: 'ice', spal: ['#ffffff', '#c8ecff', '#80c0e8', '#3870a0'], column: 'snowstump',
      deco: ['pine', 'snowman', 'igloo', 'pine'], bg: 'snow', music: 'snow', ice: true, snowing: true
    },
    sky: {
      sky: ['#68a8ff', '#90c4ff', '#ffd0ec'], ground: 'cloud', gpal: ['#ffffff', '#d8e8ff', '#a8c0f0', '#6c80c8'],
      brick: ['#ffe8a0', '#f8c048', '#c88c20', '#5c3c10'], hard: ['#fff4c8', '#f8d880', '#d0a040', '#6c4c18'],
      semi: 'cloud', spal: ['#ffffff', '#e0ecff', '#b0c8f0', '#7088c8'], column: 'cloud',
      deco: ['balloon', 'rainbow'], bg: 'sky', music: 'sky'
    },
    factory: {
      sky: ['#283850', '#30425c', '#384c68'], ground: 'metal', gpal: ['#c8d4e8', '#8898b8', '#586888', '#202838'],
      brick: ['#f8b8a0', '#d87050', '#a04830', '#401c14'], hard: ['#ffe080', '#f0b030', '#b07818', '#4c3008'],
      semi: 'girder', spal: ['#ffe070', '#e0a020', '#9c6810', '#3c2408'], column: 'funnel',
      deco: ['gear', 'blocks', 'lamp'], bg: 'factory', music: 'factory'
    },
    castle: {
      sky: ['#2a1420', '#341828', '#401c30'], ground: 'stone', gpal: ['#b8a8b8', '#7c6c80', '#544458', '#24182c'],
      brick: ['#c8a8b8', '#906878', '#604050', '#281820'], hard: ['#c0b0c0', '#8c7890', '#605068', '#281c30'],
      semi: 'bridge', spal: ['#d0a070', '#a07040', '#684420', '#2c1c0c'], column: 'chimney',
      deco: ['torch'], bg: 'castle', music: 'castle', dark: true, lava: true
    },

    /* ---- the second land: Magpie Isles (levels 11–20) ---- */
    // 11 · a sandy harbour at sunset: warm sand, piers, the sea in the gaps
    harbour: {
      sky: ['#ff8a7a', '#ffb08a', '#ffe0a8'], ground: 'sand', gpal: ['#ffe8b8', '#f0c888', '#c8905c', '#8a5a34'],
      brick: ['#ffc8a0', '#e88a5a', '#b05a34', '#4c2418'], hard: ['#e8c8a0', '#c8986a', '#94683c', '#4c3018'],
      semi: 'bridge', spal: ['#e8b880', '#b8804c', '#7a4c28', '#3c2010'], column: 'stump',
      deco: ['anchor', 'barrel', 'buoy', 'umbrella', 'shell', 'palm'], bg: 'harbour', music: 'harbour', sea: true
    },
    // 12 · cake with pink frosting on top; cookie blocks; cotton-candy clouds
    candy: {
      sky: ['#ffb8e0', '#ffd0ec', '#fff0f8'], ground: 'snow', gpal: ['#fff4fa', '#ffd0e8', '#d888b0', '#8a4a78'],
      brick: ['#fff0b0', '#ffc860', '#d88a30', '#6a3a10'], hard: ['#c8f0ff', '#88c8f0', '#4a88c0', '#1c3a6a'],
      semi: 'cloud', spal: ['#ffffff', '#ffd8f0', '#f0a8d8', '#b868a8'], column: 'cloud',
      deco: ['lollipop', 'candycane', 'lollipop', 'bushS', 'flowerP'], bg: 'candy', music: 'candy'
    },
    // 13 · green turf over white chalk, out on the breezy clifftops
    cliffs: {
      sky: ['#5cb8ff', '#8fd0ff', '#d4f0ff'], ground: 'grass', gpal: ['#a8f070', '#58c048', '#ece4cc', '#a89878'],
      brick: ['#f4f0e0', '#d8d0b8', '#a89c80', '#4c4434'], hard: ['#e8e4d4', '#c8c0a8', '#8c8470', '#3c382c'],
      semi: 'bridge', spal: ['#e8c890', '#b88850', '#7a5428', '#3c2410'], column: 'stump',
      deco: ['fence', 'flowerY', 'bushS', 'sign', 'flowerR'], bg: 'cliffs', music: 'cliffs'
    },
    // 14 · lush turf and the old stones of a friendly ruined temple
    jungle: {
      sky: ['#7fd0a8', '#a8e0b8', '#e0f4d0'], ground: 'grass', gpal: ['#7ed858', '#2e9a48', '#8a6a48', '#4a3420'],
      brick: ['#c8c0a0', '#9a9278', '#6a6450', '#2c2a20'], hard: ['#b8b098', '#8a8470', '#5c5848', '#2a2820'],
      semi: 'branch', spal: ['#a88a5c', '#7a5c34', '#4c3a20', '#20160c'], column: 'stump',
      deco: ['fern', 'totem', 'fern', 'palm', 'bush'], bg: 'jungle', music: 'jungle'
    },
    // 15 · night in a grove of giant glowing mushrooms
    glow: {
      sky: ['#101838', '#1c2a58', '#2c4a78'], ground: 'grass', gpal: ['#4ac8b0', '#2a7a88', '#3a3060', '#1c1638'],
      brick: ['#88a8e8', '#5874c0', '#384c88', '#18203c'], hard: ['#9080c8', '#6858a0', '#403070', '#1c1438'],
      semi: 'branch', spal: ['#9a88c8', '#6a5a98', '#40366a', '#1c1838'], column: 'crystal',
      deco: ['glowshroom', 'glowshroom', 'fern', 'mushroom'], bg: 'glow', music: 'glow', dark: true
    },
    // 16 · a cave under the sea: swimming, crystals, coral
    lagoon: {
      sky: ['#0c3a5a', '#145a78', '#1e7a94'], ground: 'reef', gpal: ['#a8e0d8', '#5ab0b0', '#2a7880', '#14404a'],
      brick: ['#ffb0c8', '#f07098', '#b03868', '#401830'], hard: ['#9ad8e8', '#5aa8c0', '#2a7088', '#123848'],
      semi: 'coral', spal: ['#c8f0ff', '#88d0f0', '#4890c0', '#1c4868'], column: 'coral',
      deco: ['seaweed', 'coral', 'crystalflower', 'seaweed'], bg: 'lagoon', music: 'lagoon', water: true
    },
    // 17 · golden dunes, sandstone and cacti
    desert: {
      sky: ['#8fd4ff', '#bfe6ff', '#fff2d0'], ground: 'sand', gpal: ['#fff0c8', '#f8d898', '#e0b070', '#a87840'],
      brick: ['#f8d8a0', '#e0b070', '#b88040', '#5c3c18'], hard: ['#f0d0a0', '#d0a870', '#a07840', '#4c3418'],
      semi: 'bridge', spal: ['#e0b880', '#b08850', '#7a5428', '#3c2410'], column: 'sandcastle',
      deco: ['cactus', 'cactusS', 'cactus', 'shell'], bg: 'desert', music: 'desert'
    },
    // 18 · the moon: lilac rock, craters, crystal flowers — and floaty jumps
    moon: {
      sky: ['#140c34', '#241a58', '#3a2c78'], ground: 'rock', gpal: ['#d8d0f0', '#a89cd0', '#6c5c98', '#3a2c5c'],
      brick: ['#c8c0e8', '#9890c8', '#605898', '#2c2450'], hard: ['#d0c8f0', '#a098d0', '#685c98', '#30284c'],
      semi: 'cloud', spal: ['#e8e4ff', '#c8c0f0', '#9890c8', '#585090'], column: 'crystal',
      deco: ['moonrock', 'crystalflower', 'moonrock', 'crystal'], bg: 'moon', music: 'moon', dark: true
    },
    // 19 · inside a clock tower: brass floors, wooden blocks, ticking gears
    clock: {
      sky: ['#3a2418', '#4c3020', '#6a4428'], ground: 'metal', gpal: ['#ffe0a0', '#d8a858', '#9a6a30', '#4c3014'],
      brick: ['#d8a878', '#a87848', '#784c28', '#3a2010'], hard: ['#ffd890', '#d8a850', '#9a6c28', '#4c3010'],
      semi: 'girder', spal: ['#ffe070', '#e0a020', '#9c6810', '#3c2408'], column: 'funnel',
      deco: ['gearBig', 'lantern', 'gear', 'blocks'], bg: 'clock', music: 'clock', dark: true
    },
    // 20 · the deck of Captain Magpie's sky ship, high in the clouds
    ship: {
      sky: ['#ffb070', '#ffd090', '#fff0c8'], ground: 'stone', gpal: ['#e8b880', '#c08850', '#8a5a30', '#4c3018'],
      brick: ['#c89060', '#a06838', '#704420', '#341c0c'], hard: ['#d8a070', '#b07848', '#7a4c28', '#3a2010'],
      semi: 'bridge', spal: ['#e8b880', '#b8804c', '#7a4c28', '#3c2010'], column: 'stump',
      deco: ['barrel', 'flagpost', 'anchor', 'barrel'], bg: 'ship', music: 'ship'
    },

    /* ---- the third land: the Big Trip (levels 21–30) — off to Paris in the Yeti ---- */
    // 21 · the deck of the ferry: painted steel, lifeboats, funnels letting off steam
    ferry: {
      sky: ['#7cc8ff', '#a8dcff', '#e0f4ff'], ground: 'metal', gpal: ['#eef2f4', '#c0ccd6', '#7c8ca0', '#38445a'],
      brick: ['#ffb070', '#f07838', '#b04c1c', '#4a1c0c'], hard: ['#f4f4f0', '#d0d4d8', '#9aa0aa', '#454a58'],
      semi: 'girder', spal: ['#ffffff', '#d8e0e8', '#98a8b8', '#485468'], column: 'funnel',
      deco: ['buoy', 'barrel', 'bollard', 'lifering', 'buoy'], bg: 'ferry', music: 'ferry', sea: true
    },
    // 22 · French countryside: sunflowers, hay bales, a windmill
    fields: {
      sky: ['#6cc0ff', '#9ad4ff', '#e4f6ff'], ground: 'grass', gpal: ['#c8ec70', '#80b840', '#c8904c', '#7a5028'],
      brick: ['#ffe8a0', '#f0c860', '#c09030', '#5c4010'], hard: ['#f4d8a0', '#d0a868', '#9a7438', '#4c3418'],
      semi: 'bridge', spal: ['#f8d890', '#c89848', '#8a5c24', '#3c2410'], column: 'stump',
      deco: ['sunflower', 'haybale', 'sunflower', 'fence', 'flowerY'], bg: 'fields', music: 'fields'
    },
    // 23 · a village square on market day: cobbles, terracotta, stripy awnings
    village: {
      sky: ['#8cd0ff', '#b0e0ff', '#eaf6ff'], ground: 'stone', gpal: ['#ece2ce', '#c4b094', '#8a745a', '#4a3a2a'],
      brick: ['#ffd0b0', '#e8906a', '#b05c3c', '#4c2418'], hard: ['#f6ecd6', '#dccaa8', '#a8946c', '#4c4030'],
      semi: 'bridge', spal: ['#e8c090', '#b88850', '#7a5428', '#3c2410'], column: 'chimney',
      deco: ['lamppost', 'cafetable', 'flowerbox', 'fountain', 'lamppost'], bg: 'village', music: 'village'
    },
    // 24 · inside the bakery: warm tiles, crusty-loaf blocks, shelves of bread
    bakery: {
      sky: ['#f8d0a0', '#ffe4bc', '#fff4e0'], ground: 'stone', gpal: ['#fff2dc', '#ecca9c', '#b88a58', '#5c3c20'],
      brick: ['#f8c888', '#e09048', '#a85c24', '#4a2810'], hard: ['#fae2bc', '#dab282', '#a07840', '#4c3418'],
      semi: 'bridge', spal: ['#f0d0a0', '#c89860', '#8a6030', '#3c2410'], column: 'chimney',
      deco: ['breadbasket', 'baguettes', 'cake', 'breadbasket'], bg: 'bakery', music: 'bakery'
    },
    // 25 · the cheese caves: cheese-gold rock, wheels on racks, lantern light
    cheese: {
      sky: ['#2c1c0c', '#3c2a14', '#50381c'], ground: 'rock', gpal: ['#ffe890', '#f0c840', '#b88a20', '#5c4010'],
      brick: ['#fff0a0', '#f8d050', '#c89820', '#5c4008'], hard: ['#dccca4', '#ac9c74', '#7a6a4a', '#3a3020'],
      semi: 'bridge', spal: ['#d8b070', '#a87c40', '#6c4c20', '#2c1c0c'], column: 'stump',
      deco: ['cheesewedge', 'barrel', 'lantern', 'cheesewedge'], bg: 'cheese', music: 'cheese', dark: true, ceiling: true
    },
    // 26 · the rooftops of Paris: blue-grey zinc, cream stone, chimney pots
    roofs: {
      sky: ['#7ab8f0', '#a8d0f8', '#ffe2cc'], ground: 'metal', gpal: ['#cad6e2', '#98a8bc', '#68788c', '#343c4c'],
      brick: ['#ffb898', '#e07858', '#a84c34', '#401c14'], hard: ['#ece4d4', '#ccc0aa', '#988c78', '#48402c'],
      semi: 'girder', spal: ['#5a6478', '#3c4458', '#282e3e', '#14181e'], column: 'chimney',
      deco: ['chimneypot', 'flowerbox', 'lamppost', 'chimneypot'], bg: 'roofs', music: 'roofs'
    },
    // 27 · the Metro: white tiles, green ironwork, trains in the tunnels
    metro: {
      sky: ['#1e2636', '#283246', '#323e56'], ground: 'stone', gpal: ['#f4f4f0', '#d0d4d8', '#9098a8', '#3c4250'],
      brick: ['#8ad0ac', '#4c9a78', '#2c6a50', '#10301c'], hard: ['#ecc678', '#c09040', '#8a6020', '#3c280c'],
      semi: 'girder', spal: ['#6aa888', '#3c7a5c', '#22503a', '#0c2418'], column: 'funnel',
      deco: ['metrosign', 'bench', 'lamp', 'metrosign'], bg: 'metro', music: 'metro', dark: true, ceiling: true
    },
    // 28 · up the Eiffel Tower: bronze-brown ironwork, all the way to the top
    tower: {
      sky: ['#70b4f8', '#a4d2ff', '#e8f4ff'], ground: 'metal', gpal: ['#cca484', '#9e785c', '#6c4e3a', '#30201a'],
      brick: ['#dab494', '#aa7e5e', '#7a5038', '#341c10'], hard: ['#d4b494', '#a88468', '#765640', '#34241a'],
      semi: 'girder', spal: ['#c49a78', '#94704e', '#644630', '#2a1c12'], column: 'funnel',
      deco: ['lantern', 'flagpost', 'lantern'], bg: 'tower', music: 'tower'
    },
    // 29 · Disneyland Paris: pink paths, a fairytale castle, carousel and teacups
    magic: {
      sky: ['#86ccff', '#bce4ff', '#ffe8f4'], ground: 'stone', gpal: ['#ffeef4', '#f8c4d4', '#c88ca2', '#6a4054'],
      brick: ['#ffdcea', '#f8a4c8', '#c86c98', '#5a2448'], hard: ['#e4f2ff', '#acd2f2', '#6a9aca', '#2c4a78'],
      semi: 'bridge', spal: ['#fff0b0', '#f8c850', '#c08a20', '#5a3c10'], column: 'sandcastle',
      deco: ['balloon', 'teacup', 'lamppost', 'flowerbox', 'carouselhorse'], bg: 'magic', music: 'magic'
    },
    // 30 · the castle at night, fireworks overhead, and Rascal the Fox
    night: {
      sky: ['#141038', '#2a1c5c', '#5a3a88'], ground: 'stone', gpal: ['#cabce2', '#9282ba', '#5c4c88', '#2a2048'],
      brick: ['#dcaad2', '#aa7aaa', '#704870', '#2c1830'], hard: ['#acbae8', '#7a8ac2', '#4a5a92', '#1c2448'],
      semi: 'bridge', spal: ['#e8d090', '#b89850', '#7a6028', '#3a2c10'], column: 'sandcastle',
      deco: ['lamppost', 'balloon', 'flowerbox', 'lamppost'], bg: 'night', music: 'night', dark: true
    },

    /* ---- the fourth land: Holiday! (levels 31–35) — the rest of the trip round France ---- */
    // 31 · O'Gliss Park, the waterpark: poolside tiles, bright slides, pools to swim in
    ogliss: {
      sky: ['#5cc4ff', '#8ad8ff', '#d8f4ff'], ground: 'stone', gpal: ['#effaff', '#bce4f2', '#7cb2c8', '#38607a'],
      brick: ['#ffe070', '#ffb030', '#d07818', '#5a3008'], hard: ['#ffa8d8', '#f064aa', '#b83078', '#501838'],
      semi: 'bridge', spal: ['#f0d4a0', '#c8a068', '#8a6838', '#3c2c14'], column: 'funnel',
      deco: ['palm', 'sunlounger', 'umbrella', 'lifeguard', 'palm'], bg: 'ogliss', music: 'ogliss'
    },
    // 32 · surfing at Hossegor: golden sand, big Atlantic waves, beach huts and pines
    surf: {
      sky: ['#4cb4ff', '#86d0ff', '#e4f6ff'], ground: 'sand', gpal: ['#fff2cc', '#f6d896', '#d8b068', '#9a7440'],
      brick: ['#f4d8a8', '#d8a868', '#a07038', '#4c3418'], hard: ['#c8c0b0', '#9a9284', '#6a6458', '#34302a'],
      semi: 'bridge', spal: ['#e8c890', '#b8904c', '#7a5828', '#3c2a10'], column: 'stump',
      deco: ['beachhut', 'surfboards', 'umbrella', 'seapine', 'lifeguard'], bg: 'surf', music: 'surf', sea: true
    },
    // 33 · the bike ride: cycle paths through the pines, down to the beach
    bike: {
      sky: ['#6cc4ff', '#9ad8ff', '#e6f6ff'], ground: 'grass', gpal: ['#b6e66a', '#70b046', '#d8b47c', '#8a6440'],
      brick: ['#ffd0a0', '#e8905a', '#b05c34', '#4c2414'], hard: ['#e8e0cc', '#c8bca0', '#948a70', '#46402c'],
      semi: 'bridge', spal: ['#e8c890', '#b8904c', '#7a5828', '#3c2a10'], column: 'stump',
      deco: ['seapine', 'signpost', 'bikerack', 'fence', 'flowerY', 'seapine'], bg: 'bike', music: 'bike'
    },
    // 34 · Puy du Fou: castles and knights, banners and tents, a Viking longship
    puydufou: {
      sky: ['#78c0f8', '#a8d8ff', '#f0f6ff'], ground: 'grass', gpal: ['#9ad464', '#58a03e', '#a8865c', '#5a4028'],
      brick: ['#d8ccb4', '#b0a284', '#7c705a', '#36302a'], hard: ['#ccc4b4', '#a09884', '#6e685a', '#302c26'],
      semi: 'bridge', spal: ['#d0a070', '#a07040', '#684420', '#2c1c0c'], column: 'sandcastle',
      deco: ['banner', 'tent', 'shield', 'torch', 'banner'], bg: 'puydufou', music: 'puydufou'
    },
    // 35 · Saint-Malo: granite ramparts, the beach and the fort, the ferry home
    stmalo: {
      sky: ['#7ab6e6', '#b4cdea', '#f8dcc0'], ground: 'stone', gpal: ['#dcd8d0', '#aca8a0', '#7a766e', '#3c3a36'],
      brick: ['#d8d4cc', '#aca69a', '#7a746a', '#36332e'], hard: ['#c8c4bc', '#9c988e', '#6c685f', '#302e2a'],
      semi: 'bridge', spal: ['#d8b07c', '#a8804c', '#6c4c24', '#2c1c0c'], column: 'sandcastle',
      deco: ['cannon', 'anchor', 'crepestand', 'lamppost', 'flagpost'], bg: 'stmalo', music: 'stmalo', sea: true
    }
  };

  /* ==========================================================================
     THE LITTLE THINGS — what grows on the ground and hangs beneath it, and
     each world's light. Drawn at full density; scattered by the level.
     ========================================================================== */
  var TP = {
    l: '#7ed858', L: '#3e9a40', d: '#2a6a34', y: '#ffe048', o: '#ff9a3a', r: '#f0485a', R: '#a8203a', x: '#fffbe6',
    w: '#ffffff', W: '#d6daea', g: '#a8a4b8', G: '#6c6880', p: '#ff8ac8', P: '#d0509a', b: '#7aa8ff', B: '#4a6ad8',
    c: '#7ae8ff', C: '#2c98c8', k: '#ff9ae6', K: '#c850b0', s: '#f4dca8', S: '#c8a070', t: '#a8744c', T: '#6c4428'
  };
  var tiny = function (rows) { return BB.sprHi(rows, TP); };
  A.tiny = {
    flowerP: tiny(['.p.p.', 'ppypp', '.pPp.', '..L..', '.lL..', '..L.l', '..LL.']),
    flowerY: tiny(['.y.y.', 'yyoyy', '.yoy.', '..L..', 'l.L..', '.lL..', '..L..']),
    flowerW: tiny(['.w.w.', 'wwyww', '.wWw.', '..L..', '..Ll.', '.lL..', '..L..']),
    flowerB: tiny(['.b.b.', 'bbybb', '.bBb.', '..L..', '.lL..', '..L.l', '..L..']),
    tuft: tiny(['.l...l.', '.l..lL.', 'lL.lL.l', 'LLlLLlL', 'dLLdLLd']),
    clover: tiny(['.ll.ll.', 'lLllLll', '.lLlLl.', '...L...', '...L...']),
    berries: tiny(['..l.l..', '.lLlLl.', '.rx.rx.', 'rrRrrRr', '.RR.RR.']),
    shroom: tiny(['.rrrr.', 'rwrrwr', 'RrrrrR', '..ww..', '..wW..', '.wwww.']),
    pebble: tiny(['..gg..', '.gxgg.', 'gggggG', '.GGGG.']),
    shell: tiny(['..p..', '.pxp.', 'pwpwp', 'PpPpP']),
    seagrass: tiny(['.l...', '.l.l.', 'l..l.', 'l.l..', '.Ll.l', '.L.l.', 'LL.L.']),
    coral: tiny(['k..k.k', 'k.k.k.', '.kkk.k', '..kKk.', '..KK..']),
    crystal: tiny(['..c.', '.cxC', '.ccC', 'cxcC', 'cccC', 'CCCC']),
    glowP: tiny(['.kkkk.', 'kxkkkk', 'KkkkkK', '..ww..', '..wW..']),
    glowC: tiny(['.cccc.', 'cxcccc', 'CccccC', '..ww..', '..wW..']),
    snowTuft: tiny(['..w..w', '.wxw.w', 'wwwwwW', 'WWWWWW']),
    bolt: tiny(['.gg.', 'gxGg', 'gGGg', '.gg.']),
    moss: tiny(['l.l.l.', 'lLlLlL']),
    sprout: tiny(['l...l', '.lLl.', '..L..'])
  };
  var TINY = {
    hills: ['flowerP', 'flowerY', 'flowerW', 'tuft', 'tuft', 'berries', 'clover', 'tuft'],
    park: ['flowerP', 'flowerY', 'flowerB', 'tuft', 'tuft', 'clover', 'flowerW'],
    beach: ['shell', 'pebble', 'seagrass', 'pebble'],
    reef: ['coral', 'seagrass', 'shell', 'seagrass'],
    woods: ['glowP', 'glowC', 'tuft', 'berries', 'tuft', 'shroom'],
    cave: ['crystal', 'pebble', 'glowC', 'crystal'],
    snow: ['snowTuft', 'pebble', 'snowTuft'],
    sky: ['flowerW', 'flowerP', 'sprout', 'flowerY'],
    factory: ['bolt', 'pebble'],
    castle: ['pebble', 'moss', 'pebble'],
    harbour: ['shell', 'pebble', 'seagrass'], candy: ['flowerP', 'flowerW', 'sprout'], cliffs: ['flowerY', 'tuft', 'clover', 'flowerW'],
    jungle: ['tuft', 'berries', 'tuft', 'clover', 'shroom'], glow: ['glowP', 'glowC', 'tuft', 'glowC'], lagoon: ['coral', 'seagrass', 'crystal'],
    desert: ['pebble', 'shell'], moon: ['crystal', 'pebble', 'glowP'], clock: ['bolt', 'pebble'], ship: ['pebble'],
    ferry: ['bolt'], fields: ['flowerY', 'tuft', 'flowerW', 'clover', 'tuft'], village: ['pebble', 'flowerP', 'moss'],
    bakery: [], cheese: ['pebble', 'crystal'], roofs: ['moss', 'pebble'], metro: ['bolt', 'pebble'], tower: ['bolt'],
    magic: ['flowerP', 'flowerB', 'flowerW', 'flowerY'], night: ['glowP', 'flowerW', 'glowC'],
    ogliss: ['pebble'], surf: ['shell', 'pebble', 'seagrass'], bike: ['flowerY', 'tuft', 'clover', 'flowerW', 'tuft'],
    puydufou: ['tuft', 'flowerP', 'clover', 'tuft'], stmalo: ['shell', 'pebble', 'moss']
  };
  // what hangs from the underside of ground: [style, colours]
  var HANG = {
    hills: ['vines', ['#4fae4a', '#7ed858', '#8a5a36']], park: ['vines', ['#4fae4a', '#8ee06a', '#8a5a36']],
    beach: ['roots', ['#c89a5a', '#e8c080', '#a07040']], reef: ['kelp', ['#3aa878', '#6ad8a0', '#2a7858']],
    woods: ['vines', ['#5a4aa8', '#9a88e8', '#3c2a6a']], cave: ['drips', ['#8ad8ff', '#d0f4ff', '#5a4a8a']],
    snow: ['icicles', ['#c8ecff', '#ffffff', '#88b8e0']], sky: ['vines', ['#ffb0d8', '#ffe0f0', '#d880b8']],
    factory: ['chains', ['#8898b8', '#c8d4e8', '#586888']], castle: ['chains', ['#9a8aa0', '#c8b8c8', '#5c4c60']],
    harbour: ['roots', ['#c89a5a', '#e8c080', '#a07040']], candy: ['drips', ['#ffd0e8', '#ffffff', '#d888b0']],
    cliffs: ['vines', ['#58c048', '#a8f070', '#8a7a5a']], jungle: ['vines', ['#2e9a48', '#7ed858', '#5a4028']],
    glow: ['vines', ['#2a8a98', '#7ae8e0', '#2a2050']], lagoon: ['kelp', ['#3aa878', '#6ad8a0', '#2a7858']],
    desert: ['roots', ['#c8a060', '#e8c890', '#a07840']], moon: ['drips', ['#c8c0f0', '#ffffff', '#8878c0']],
    clock: ['chains', ['#c8a050', '#ffe0a0', '#7a5428']], ship: ['chains', ['#a07848', '#d8b080', '#5a3c20']],
    ferry: ['chains', ['#98a8b8', '#d8e0e8', '#586878']], fields: ['roots', ['#a87848', '#d8a870', '#7a5030']],
    village: ['vines', ['#58b848', '#9ae070', '#7a5a36']], bakery: ['drips', ['#fff4e0', '#ffffff', '#e8c898']],
    cheese: ['drips', ['#ffe890', '#fff6c8', '#c89a30']], roofs: ['drips', ['#a8b8cc', '#e0e8f0', '#68788c']],
    metro: ['chains', ['#6aa888', '#b8e8d0', '#2c6a50']], tower: ['chains', ['#9e785c', '#cca484', '#5a3c28']],
    magic: ['vines', ['#58c048', '#ffb0d8', '#7a5a36']], night: ['vines', ['#5a4aa8', '#ffd0f0', '#3c2a6a']],
    ogliss: ['drips', ['#8ad8ff', '#e0f8ff', '#4aa0c8']], surf: ['roots', ['#c89a5a', '#e8c080', '#a07040']],
    bike: ['vines', ['#5aa840', '#9ad870', '#7a5a36']], puydufou: ['vines', ['#4a9a3a', '#8ad060', '#5a4028']],
    stmalo: ['kelp', ['#3a8a5a', '#6ac088', '#2a6a48']]
  };
  // each world's light (see light.js)
  var LIGHT = {
    hills: { rays: { col: '#fff0b8', a: 0.36 }, motes: '#fffbe0' },
    park: { rays: { col: '#ffe8a8', a: 0.34 }, motes: '#ffffff' },
    beach: { rays: { col: '#fff4c8', a: 0.3 }, motes: '#ffffff' },
    reef: { rays: { col: '#c8fbff', a: 0.55 }, motes: '#e0ffff' },
    woods: { dark: { col: '#140838', a: 0.4 }, rays: { col: '#c8b8ff', a: 0.32 }, motes: '#e8ff90' },
    cave: { dark: { col: '#0a0620', a: 0.5 }, motes: '#a8ecff' },
    snow: { rays: { col: '#ffffff', a: 0.36 } },
    sky: { rays: { col: '#ffe2c4', a: 0.36 }, motes: '#ffffff' },
    factory: { dark: { col: '#0e1228', a: 0.2 }, rays: { col: '#ffe2a0', a: 0.42 }, motes: '#ffe8b0' },
    castle: { dark: { col: '#1c0614', a: 0.36 }, motes: '#ffb868' },
    harbour: { rays: { col: '#ffd0a0', a: 0.34 }, motes: '#fff0d8' },
    candy: { rays: { col: '#fff0f8', a: 0.3 }, motes: '#ffffff' },
    cliffs: { rays: { col: '#ffffff', a: 0.28 }, motes: '#ffffff' },
    jungle: { rays: { col: '#f0ffc8', a: 0.4 }, motes: '#f8ffb0' },
    glow: { dark: { col: '#081030', a: 0.34 }, motes: '#a8ffe8' },
    lagoon: { dark: { col: '#04182a', a: 0.22 }, rays: { col: '#a8f0ff', a: 0.45 }, motes: '#d0fbff' },
    desert: { rays: { col: '#fff8d0', a: 0.28 }, motes: '#fff4d8' },
    moon: { dark: { col: '#0a0628', a: 0.22 }, motes: '#e8e0ff' },
    clock: { dark: { col: '#140a04', a: 0.3 }, rays: { col: '#ffd890', a: 0.36 }, motes: '#ffe0a0' },
    ship: { rays: { col: '#ffe0b0', a: 0.36 }, motes: '#ffffff' },
    ferry: { rays: { col: '#ffffff', a: 0.3 }, motes: '#ffffff' },
    fields: { rays: { col: '#fff4c0', a: 0.38 }, motes: '#fffbe0' },
    village: { rays: { col: '#fff0c8', a: 0.34 }, motes: '#ffffff' },
    bakery: { rays: { col: '#ffe0a8', a: 0.4 }, motes: '#fff4e0' },
    cheese: { dark: { col: '#1c1004', a: 0.4 }, motes: '#ffe8a0' },
    roofs: { rays: { col: '#ffe0c0', a: 0.36 }, motes: '#ffffff' },
    metro: { dark: { col: '#0c1018', a: 0.34 }, rays: { col: '#e0f0ff', a: 0.3 }, motes: '#d8e8ff' },
    tower: { rays: { col: '#ffffff', a: 0.3 }, motes: '#ffffff' },
    magic: { rays: { col: '#fff0f8', a: 0.36 }, motes: '#ffffff' },
    night: { dark: { col: '#0c0828', a: 0.3 }, motes: '#ffe0ff' },
    ogliss: { rays: { col: '#ffffff', a: 0.34 }, motes: '#e8fbff' },
    surf: { rays: { col: '#fff4d0', a: 0.32 }, motes: '#ffffff' },
    bike: { rays: { col: '#fff8c8', a: 0.36 }, motes: '#fffbe0' },
    puydufou: { rays: { col: '#fff0c0', a: 0.36 }, motes: '#fff8d8' },
    stmalo: { rays: { col: '#fff0d8', a: 0.32 }, motes: '#ffffff' }
  };
  Object.keys(A.themes).forEach(function (k) {
    var th = A.themes[k];
    th.tiny = TINY[k] || []; th.hang = HANG[k] || null; th.light = LIGHT[k] || {};
  });
  // softer, more storybook skies for the night-time worlds
  A.themes.woods.sky = ['#2c1e6c', '#5c3c9e', '#d68ac2'];
  A.themes.cave.sky = ['#1a1640', '#2a2058', '#3c2c70'];
  A.themes.castle.sky = ['#3a1a34', '#4a2040', '#5a2848'];
  A.themes.factory.sky = ['#34466a', '#3e5278', '#4a6088'];
})();
