/* ==========================================================================
   ui.js — the game's own stationery.

   Every box, banner and pointer on every screen comes from here, so the
   whole game speaks with one hand. It's storybook paper and felt, not
   app chrome: cream paper with a plum ink edge and a running stitch,
   like a patch sewn on a school bag (or on Monsty); ribbon banners with
   folded tails for names; Monsty's own head as the pointer in menus.

     BB.ui.paper(ctx, x, y, w, h)          a card of paper
     BB.ui.ribbon(ctx, cx, y, text, col)   a banner; returns its width
     BB.ui.cursor(ctx, x, y, t)            Monsty, bobbing, pointing right
     BB.ui.dim(ctx)                        the world dimmed behind a menu
     BB.ui.INK / SOFT / PICK               the inks for writing on paper
   ========================================================================== */
(function () {
  'use strict';
  var snap = BB.snap, mix = BB.mix, H = BB.H;
  var INK = '#3a2450', SOFT = '#8a6a78', PICK = '#c8306a';
  var PAPER = '#fff4dc', PAPER_HI = '#fffbf0', EDGE = '#ecd6ae', EDGE_LO = '#d8b98a', STITCH = '#e2c18e';

  // a rectangle with its corners nipped, the way pixel artists round them
  var round = function (g, x, y, w, h, col, nip) {
    nip = nip === undefined ? 1 : nip;
    g.fillStyle = col;
    g.fillRect(x + nip, y, w - nip * 2, h);
    g.fillRect(x, y + nip, w, h - nip * 2);
    if (nip >= 1) { g.fillRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  };
  // a running stitch, inset from the edge: dashes of 2, gaps of 1.5
  var stitch = function (g, x, y, w, h, col) {
    g.fillStyle = col;
    for (var i = 1; i < w - 2; i += 3.5) { g.fillRect(snap(x + i), y, Math.min(2, w - 1 - i), 0.5); g.fillRect(snap(x + i), y + h - 0.5, Math.min(2, w - 1 - i), 0.5); }
    for (var j = 1.5; j < h - 2; j += 3.5) { g.fillRect(x, snap(y + j), 0.5, Math.min(2, h - 1 - j)); g.fillRect(x + w - 0.5, snap(y + j), 0.5, Math.min(2, h - 1 - j)); }
  };
  // the same few flecks in the same paper, every time
  var hash = function (a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

  var paper = function (g, x, y, w, h, o) {
    o = o || {};
    x = snap(x); y = snap(y); w = snap(w); h = snap(h);
    round(g, x + 1.5, y + 2, w, h, 'rgba(28,14,48,0.32)', 2);
    round(g, x, y, w, h, INK, 2);
    round(g, x + 0.5, y + 0.5, w - 1, h - 1, EDGE_LO, 1.5);
    round(g, x + 0.5, y + 0.5, w - 1, h - 2, EDGE, 1.5);
    round(g, x + 0.5, y + 0.5, w - 1, h - 3, o.fill || PAPER, 1.5);
    g.fillStyle = PAPER_HI; g.fillRect(x + 2, y + 1, w - 4, 0.5);
    for (var i = 0; i < Math.floor(w * h / 90); i++) {
      g.fillStyle = 'rgba(214,180,130,0.35)';
      g.fillRect(snap(x + 3 + hash(i, w) * (w - 6)), snap(y + 3 + hash(h, i) * (h - 7)), 0.5, 0.5);
    }
    if (o.stitch !== false && w > 12 && h > 10) stitch(g, x + 2.5, y + 2.5, w - 5, h - 6, STITCH);
  };

  // a ribbon: the band, its two tails folded behind it, a stitch along it
  var ribbon = function (g, cx, y, text, col, o) {
    o = o || {};
    var sc = o.scale || 1, tw = BB.textW(text, sc), bh = 8 * sc + 5, bw = tw + 14 + sc * 2;
    var x = snap(cx - bw / 2), dark = mix(col, '#2a1040', 0.45), deep = mix(col, '#1a0830', 0.65), lite = mix(col, '#ffffff', 0.35);
    y = snap(y);
    // the tails, lower and darker, a swallowtail notch cut in each end
    var tail = function (tx, dir) {
      var ty = y + 3, tl = 9, notch = 3;
      for (var k = 0; k < bh; k += 0.5) {
        var cut = notch * (1 - Math.abs(k + 0.25 - bh / 2) / (bh / 2)), len = tl - cut;
        var x0 = dir < 0 ? tx - tl + cut : tx;
        g.fillStyle = INK; g.fillRect(snap(x0), ty + k, snap(len), 0.5);
        if (k > 0 && k < bh - 0.5) { g.fillStyle = dark; g.fillRect(snap(x0 + (dir < 0 ? 0.5 : 0)), ty + k, snap(len - 0.5), 0.5); }
      }
      // the fold, where the tail tucks under the band
      g.fillStyle = deep; g.fillRect(dir < 0 ? tx - 2.5 : tx, ty + bh - 3.5, 2.5, 3);
    };
    tail(x + 3, -1); tail(x + bw - 3, 1);
    // the band
    g.fillStyle = 'rgba(28,14,48,0.3)'; g.fillRect(x + 1, y + 2, bw, bh);
    g.fillStyle = INK; g.fillRect(x, y, bw, bh);
    g.fillStyle = col; g.fillRect(x + 0.5, y + 0.5, bw - 1, bh - 1);
    g.fillStyle = lite; g.fillRect(x + 0.5, y + 0.5, bw - 1, 1);
    g.fillStyle = dark; g.fillRect(x + 0.5, y + bh - 1.5, bw - 1, 1);
    // stitches along both edges
    g.fillStyle = lite;
    for (var i = 2; i < bw - 3; i += 3.5) { g.fillRect(snap(x + i), y + 2, 2, 0.5); g.fillRect(snap(x + i), y + bh - 2.5, 2, 0.5); }
    BB.text(g, text, cx, y + 2.5 + (sc > 1 ? 0.5 : 0), { color: '#ffffff', align: 'center', scale: sc, shadow: dark });
    return bw;
  };

  // Monsty's head: purple, two big eyes, orange spikes on top
  var head = BB.spr([
    '..o.o.o..',
    '.#O#O#O#.',
    '#qqqqqqq#',
    '#qWWqWWq#',
    '#qW#qW#q#',
    '#qqqqqqq#',
    '#qq###qq#',
    '.#qqqqq#.',
    '..#####..'
  ], { q: '#8a44dc', W: '#ffffff', o: '#ffc060', O: '#f6a13a' });
  var cursor = function (g, x, y, t) {
    var bob = BB.reduce ? 0 : Math.round(Math.sin((t || 0) * 0.2) * 1.5 * 2) / 2;
    BB.draw(g, head, x + bob, y);
    return head.w;
  };

  var dim = function (g) {
    g.fillStyle = 'rgba(40,20,60,0.42)'; g.fillRect(0, 0, BB.W, H);
  };

  BB.ui = { paper: paper, ribbon: ribbon, cursor: cursor, dim: dim, round: round, INK: INK, SOFT: SOFT, PICK: PICK, PAPER: PAPER, head: head };
})();
