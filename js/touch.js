/* ==========================================================================
   touch.js — playing on a phone or tablet.

   Held sideways, the game fills the screen and three big see-through
   buttons sit over it, drawn in the game's own style: ◀ ▶ under the left
   thumb, and for JUMP the big bouncy mushroom under the right. That's the whole scheme, the way
   the best mobile platformers (and the research on children and
   touchscreens) do it:
     · movement lower left, action lower right — where thumbs rest
     · always visible, so a child never has to guess where they are
     · big targets, generous hit areas (the whole lower-left of the screen
       is ◀ or ▶, the whole right half is JUMP) and a clear pressed state
     · lifted a little off the bottom edge, where small palms rest
     · taps and holds only — no swipes, no drags
   Running needs no button: hold a direction and Bonnie speeds up. With
   the fire power, a throw button appears beside JUMP.

   Held upright it still plays — the same buttons, a little smaller — and
   a small note under the picture (index.html) suggests turning sideways
   for the best view. It never blocks: plenty of phones have rotation
   lock on. A thumb below the picture still counts, left half or right.

   Menus, the map and the sticker book are simply tapped.
   ========================================================================== */
(function () {
  'use strict';
  if (!BB.touch) return;
  var H = BB.H, snap = BB.snap, I = BB.icons, ui = BB.ui, INK = ui.INK;
  var fingers = {}, puffs = [], t = 0, dirSince = 0, lastDir = 0, lastTouch = 0, hintT = 0;
  var press = { left: 0, right: 0, jump: 0, throw: 0 };
  var playing = function () { return BB.game && BB.game.scene() === 'play'; };
  var portrait = function () { return document.documentElement.classList.contains('portrait'); };

  /* Where the buttons are, in game pixels: sized in real (CSS) pixels so
     they're the same comfortable size on a phone and a tablet, and placed
     from the screen's corners. */
  var layout = function () {
    var s = BB.scale || 3, W = BB.W, minDim = Math.min(window.innerWidth, window.innerHeight);
    // upright the picture is small, so the buttons are a little smaller too
    var A = (portrait() ? Math.max(50, Math.min(64, minDim * 0.14)) : Math.max(62, Math.min(100, minDim * 0.17))) / s, J = A * 1.32;
    var side = 18 / s, lift = 20 / s, gap = 12 / s;
    var L = { x: side + A / 2, y: H - lift - A / 2, r: A / 2 };
    var R = { x: L.x + A + gap, y: L.y, r: A / 2 };
    var Jb = { x: W - side - J / 2, y: H - lift - J / 2, r: J / 2 };
    var T = { x: Jb.x - J * 0.95, y: Jb.y - J * 0.62, r: A * 0.4 };
    return { L: L, R: R, J: Jb, T: T };
  };

  // which control a finger is on: the whole lower left is ◀ or ▶, the
  // whole right half is JUMP (the throw button, when it's there, has its own spot)
  var roleAt = function (g) {
    var W = BB.W, b = layout();
    if (BB.touchCanThrow && Math.hypot(g.x - b.T.x, g.y - b.T.y) < b.T.r * 1.5) return 'throw';
    if (g.x >= W * 0.5) return 'jump';
    if (g.y < H * 0.22) return null;
    return g.x < (b.L.x + b.R.x) / 2 ? 'left' : 'right';
  };
  var apply = function () {
    var l = 0, r = 0, j = 0;
    for (var id in fingers) { var f = fingers[id]; if (f.role === 'left') l = 1; else if (f.role === 'right') r = 1; else if (f.role === 'jump') j = 1; }
    if (l && r) l = r = 0;
    var dir = r - l;
    if (dir !== lastDir) { lastDir = dir; dirSince = performance.now(); }
    BB.touchHold('left', l); BB.touchHold('right', r); BB.touchHold('a', j);
    press.left = l; press.right = r; press.jump = j;
  };
  var release = function () { fingers = {}; apply(); };

  var down = function (e) {
    if (e.pointerType === 'mouse') return;
    e.preventDefault();
    BB.audioKick(); BB.inputMode = 'touch';
    var g = BB.toGame(e.clientX, e.clientY);
    if (!playing()) {
      BB.touchDown = true;
      BB.touchTap({ x: g.x, y: g.y, on: g.on }); puffs.push({ x: g.x, y: g.y, t: 0 });
      return;
    }
    if (BB.hud && BB.hud.pause && g.x >= BB.hud.pause.x && g.y < BB.hud.pause.y + BB.hud.pause.h + 6 && g.x < BB.hud.pause.x + BB.hud.pause.w + 6) { BB.touchPress('start'); return; }
    lastTouch = performance.now(); hintT = 0;
    var role = roleAt(g);
    if (!role) return;
    if (role === 'throw') { BB.touchPress('b'); press.throw = 8; return; }
    fingers[e.pointerId] = { role: role };
    if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) try { navigator.vibrate(6); } catch (x) {}
    apply();
  };
  var move = function (e) {
    var f = fingers[e.pointerId];
    if (!f || f.role === 'jump') return;
    // a thumb on ◀ can roll onto ▶ and back; it never wanders into a jump
    var g = BB.toGame(e.clientX, e.clientY), b = layout();
    f.role = g.x < (b.L.x + b.R.x) / 2 ? 'left' : 'right';
    apply();
  };
  var up = function (e) { BB.touchDown = false; if (fingers[e.pointerId]) { delete fingers[e.pointerId]; apply(); } };
  window.addEventListener('pointerdown', down, { passive: false });
  window.addEventListener('pointermove', move, { passive: false });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  window.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ---- drawing them: soft paper bubbles with a chunky ink icon ---- */
  // k: how solid to draw it — less when Bonnie is behind it, so it never hides him
  var bubble = function (g, c, on, icon, k) {
    var r = c.r * (on ? 0.93 : 1);
    k = on ? 1 : (k === undefined ? 1 : k);
    g.globalAlpha = (on ? 0.3 : 0.18) * k; I.disc(g, c.x + 0.5, c.y + 1.5, r, '#1c0e30');
    g.globalAlpha = (on ? 0.95 : 0.6) * k; I.disc(g, c.x, c.y, r, INK);
    g.globalAlpha = (on ? 0.95 : 0.42) * k; I.disc(g, c.x, c.y, r - 1, on ? '#fff4dc' : '#ffffff');
    g.globalAlpha = (on ? 0.6 : 0.3) * k; I.disc(g, c.x - r * 0.25, c.y - r * 0.3, r * 0.45, '#ffffff');
    g.globalAlpha = (on ? 1 : 0.85) * k;
    icon(g, c.x, c.y, r * 0.48);
    g.globalAlpha = 1;
  };
  // is Bonnie (on screen) behind this button?
  var behind = function (c) {
    var G = BB.game.G(); if (!G || !G.p) return 1;
    var p = G.p, x = p.x - G.cam.x, y = p.y - G.cam.y;
    return x + p.w > c.x - c.r && x < c.x + c.r && y + p.h > c.y - c.r && y < c.y + c.r ? 0.35 : 1;
  };
  // a fat arrowhead, pointing left (-1) or right (1)
  var arrow = function (dir) {
    return function (g, x, y, s) {
      for (var k = -s; k <= s; k += 0.5) {
        var w = (s - Math.abs(k)) * 1.25;
        g.fillStyle = INK; g.fillRect(snap(x - dir * s * 0.55 + (dir > 0 ? 0 : -w) - 0.5), snap(y + k - 0.5), snap(w + 1), 1);
      }
      for (k = -s + 1; k <= s - 1; k += 0.5) {
        var w2 = (s - 1 - Math.abs(k)) * 1.25;
        g.fillStyle = '#ffffff'; g.fillRect(snap(x - dir * s * 0.55 + (dir > 0 ? 0.5 : -w2 - 0.5)), snap(y + k), snap(w2), 0.5);
      }
    };
  };
  /* JUMP is the bouncy mushroom (owner's favourite): a red cap with white
     spots and a little face, see-through until it's pressed, when it
     squashes down like the real thing. c is the button's circle. */
  var mushroom = function (g, c, on, k) {
    var sq = on ? 1 : 0, cw = c.r * (1.05 + sq * 0.12), ch = c.r * (0.78 - sq * 0.16), sw = c.r * 0.34, sh = c.r * (0.62 - sq * 0.12);
    var base = c.y + c.r * 0.92, top = base - sh - ch + 1, x = c.x;
    k = on ? 1 : (k === undefined ? 1 : k);
    g.globalAlpha = (on ? 0.3 : 0.18) * k; ui.round(g, x - cw + 1, base - 1, cw * 2, 3, '#1c0e30', 1.5);
    g.globalAlpha = (on ? 1 : 0.62) * k;
    // stem, and its face
    ui.round(g, x - sw, base - sh, sw * 2, sh, INK, 1.5);
    ui.round(g, x - sw + 0.5, base - sh, sw * 2 - 1, sh - 0.5, '#fff4dc', 1.5);
    var fy = base - sh + sh * 0.3;
    g.fillStyle = INK;
    if (on) { g.fillRect(snap(x - sw * 0.55), snap(fy + 0.5), 1.5, 0.5); g.fillRect(snap(x + sw * 0.55 - 1.5), snap(fy + 0.5), 1.5, 0.5); }
    else { g.fillRect(snap(x - sw * 0.5), snap(fy), 1, 1.5); g.fillRect(snap(x + sw * 0.5 - 1), snap(fy), 1, 1.5); }
    g.fillRect(snap(x - 1), snap(fy + 2.5), 2, 0.5);
    g.fillStyle = '#ffb0b8'; g.fillRect(snap(x - sw * 0.85), snap(fy + 2), 1.5, 0.5); g.fillRect(snap(x + sw * 0.85 - 1.5), snap(fy + 2), 1.5, 0.5);
    // the cap: a dome, outline first, then the red, then its spots
    var capW = function (yy) { var q = yy / ch; return cw * Math.sqrt(Math.max(0, 1 - (1 - q) * (1 - q))); };
    for (var yy = -0.5; yy <= ch + 0.5; yy += 0.5) { var ow = capW(Math.min(ch, Math.max(0, yy + 0.5))) + 0.5; g.fillStyle = INK; g.fillRect(snap(x - ow), snap(top + yy), snap(ow * 2), 0.5); }
    for (yy = 0.5; yy <= ch; yy += 0.5) { var hw = capW(yy) - 0.5; if (hw > 0.5) { g.fillStyle = yy > ch - 2 ? '#c02840' : yy < 2.5 ? '#ff6a76' : '#ef4a5a'; g.fillRect(snap(x - hw), snap(top + yy), snap(hw * 2), 0.5); } }
    [[-0.5, 0.3, 0.2], [0.08, 0.2, 0.17], [0.52, 0.48, 0.15], [-0.2, 0.62, 0.11]].forEach(function (sp) { I.disc(g, x + sp[0] * cw, top + sp[1] * ch, Math.max(1, sp[2] * cw), '#ffffff'); });
    g.globalAlpha = 1;
  };
  var throwIcon = function (g, x, y, s) { I.disc(g, x, y, s * 1.1, INK); I.disc(g, x, y, s, '#ff7a2a'); I.disc(g, x - s * 0.3, y - s * 0.3, s * 0.55, '#ffd050'); };

  /* If nobody's touched the screen for a while in a level, show how: the
     buttons glow and a see-through finger slides onto ▶ and presses it,
     then hops over and presses the mushroom — round and round until any
     touch at all. Sooner in Level 1, where it's most likely needed. */
  var IDLE_MS = function () { var G = BB.game.G(); return G && G.n === 1 ? 2500 : 5000; };
  var ghost = function (g, b) {
    var k = (hintT % 160) / 160, ease = function (q) { return q * q * (3 - 2 * q); };
    var start = { x: BB.W / 2, y: H * 0.62 }, fx, fy, pr = null;
    if (k < 0.18) { var q = ease(k / 0.18); fx = start.x + (b.R.x - start.x) * q; fy = start.y + (b.R.y - start.y) * q; }
    else if (k < 0.45) { fx = b.R.x; fy = b.R.y; pr = 'right'; }
    else if (k < 0.62) { var q2 = ease((k - 0.45) / 0.17); fx = b.R.x + (b.J.x - b.R.x) * q2; fy = b.R.y + (b.J.y - b.R.y) * q2 - Math.sin(q2 * Math.PI) * 18; }
    else if (k < 0.85) { fx = b.J.x; fy = b.J.y; pr = (k * 160 | 0) % 24 < 14 ? 'jump' : null; }
    else { fx = b.J.x; fy = b.J.y; }
    var fade = k > 0.9 ? (1 - k) / 0.1 : Math.min(1, hintT / 20);
    return { x: fx, y: fy, press: pr, a: fade };
  };
  var drawGhost = function (g, gh) {
    var sc = 2, down = gh.press ? 1.5 : 0;
    g.save(); g.globalAlpha = 0.85 * gh.a;
    g.translate(gh.x - 4.5 * sc + 2, gh.y - 1 + down); g.scale(sc, sc);
    I.finger(g, 0, 0);
    g.restore(); g.globalAlpha = 1;
    if (gh.press) { g.globalAlpha = 0.6 * gh.a; g.fillStyle = '#ffffff'; for (var a = 0; a < 6.28; a += 0.45) g.fillRect(snap(gh.x + Math.cos(a) * 9), snap(gh.y + Math.sin(a) * 9), 1, 1); g.globalAlpha = 1; }
  };

  BB.drawTouch = function (g) {
    t++;
    puffs.forEach(function (p) { p.t++; }); puffs = puffs.filter(function (p) { return p.t < 14; });
    if (press.throw) press.throw--;
    var now = performance.now();
    if (!playing()) {
      if (Object.keys(fingers).length) release();
      lastTouch = now; hintT = 0;
    } else {
      // hold a direction and he breaks into a run
      BB.touchRun = lastDir !== 0 && now - dirSince > 380;
      if (Object.keys(fingers).length) lastTouch = now;
      var b = layout(), idle = BB.inputMode === 'touch' && now - lastTouch > IDLE_MS(), gh = null;
      if (idle) { hintT++; gh = ghost(g, b); } else hintT = 0;
      var glow = idle ? 1.4 + Math.sin(t * 0.12) * 0.25 : 1;
      bubble(g, b.L, press.left, arrow(-1), behind(b.L) * glow);
      bubble(g, b.R, press.right || (gh && gh.press === 'right'), arrow(1), behind(b.R) * glow);
      mushroom(g, b.J, press.jump || (gh && gh.press === 'jump'), behind(b.J) * glow);
      if (BB.touchCanThrow) bubble(g, b.T, press.throw, throwIcon, behind(b.T));
      if (gh) drawGhost(g, gh);
    }
    puffs.forEach(function (p) {
      g.globalAlpha = Math.max(0, 1 - p.t / 14); g.fillStyle = '#ffffff';
      var r = 3 + p.t * 0.6;
      for (var a = 0; a < 6.28; a += 0.5) g.fillRect(snap(p.x + Math.cos(a) * r), snap(p.y + Math.sin(a) * r), 1, 1);
      g.globalAlpha = 1;
    });
  };

})();
