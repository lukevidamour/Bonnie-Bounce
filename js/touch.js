/* ==========================================================================
   touch.js — playing with thumbs, on the world itself.

   No console, no grid of buttons. In a level the screen splits in two:
     · the left side is for walking — put a thumb down anywhere and a
       little stone dial appears under it; slide to walk, slide further to
       run, up to climb, down to duck. It follows the thumb, so you never
       have to find it.
     · the right side is for jumping — tap anywhere; hold to jump higher.
       Held upright, it's a bouncy mushroom that squashes as he jumps.
     · with the fire power, a throw bubble appears just above it.
   Everywhere else (title, map, menus) things are simply tapped.

   Held upright, the screen sits at the top and the level's own ground
   carries on below it (the deck): soil, roots and pebbles from the level
   you're in, scrolling with it, or the sea under the map. The dial and
   the mushroom live there. Held sideways, the game fills the screen and
   the controls only show while a thumb is on them — except the first
   time, when they glow where they are until they've been used.
   ========================================================================== */
(function () {
  'use strict';
  if (!BB.touch) return;
  var H = BB.H, snap = BB.snap, I = BB.icons, ui = BB.ui, mix = BB.mix;
  var stick = null, jumps = {}, nJump = 0, puffs = [], t = 0, squash = 0;
  var learnt = false;
  try { learnt = localStorage.getItem('bonnie-touch') === '1'; } catch (e) {}
  var used = { move: 0, jump: 0 };
  var unit = function () { return Math.min(window.innerWidth, window.innerHeight) / 10; };
  var playing = function () { return BB.game && BB.game.scene() === 'play'; };
  var inRect = function (r, g) { return r && g.on === r.on && g.x >= r.x && g.x < r.x + r.w && g.y >= r.y && g.y < r.y + r.h; };
  var hot = { throwAt: null };

  // the eight controls, from where the thumbs are
  var apply = function () {
    var l = 0, r = 0, u = 0, d = 0, run = false;
    if (stick) {
      var un = unit(), dx = stick.x - stick.ox, dy = stick.y - stick.oy, ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax > un * 0.22 && ax >= ay * 0.7) { if (dx < 0) l = 1; else r = 1; }
      if (ay > un * 0.6 && ay > ax * 0.9) { if (dy < 0) u = 1; else d = 1; }
      run = ax > un * 1.1;
    }
    BB.touchHold('left', l); BB.touchHold('right', r); BB.touchHold('up', u); BB.touchHold('down', d);
    BB.touchRun = run;
    BB.touchHold('a', nJump > 0);
  };
  var release = function () { stick = null; jumps = {}; nJump = 0; apply(); };

  var down = function (e) {
    if (e.pointerType === 'mouse') return;
    e.preventDefault();
    BB.audioKick(); BB.inputMode = 'touch';
    var g = BB.toGame(e.clientX, e.clientY);
    if (!playing()) {
      BB.touchDown = true;
      BB.touchTap({ x: g.x, y: g.y, on: g.on });
      puffs.push({ on: g.on, x: g.x, y: g.y, t: 0 });
      return;
    }
    if (BB.hud && inRect(BB.hud.pause, g)) { BB.touchPress('start'); return; }
    if (hot.throwAt && inRect(hot.throwAt, g)) { BB.touchPress('b'); puffs.push({ on: g.on, x: g.x, y: g.y, t: 0, c: '#ffb050' }); return; }
    if (e.clientX < window.innerWidth * 0.45) {
      if (!stick) { stick = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY }; used.move++; }
    } else {
      jumps[e.pointerId] = 1; nJump++; used.jump++;
      squash = 6;
      puffs.push({ on: g.on, x: g.x, y: g.y, t: 0 });
    }
    if (!learnt && used.move > 0 && used.jump > 2) { learnt = true; try { localStorage.setItem('bonnie-touch', '1'); } catch (x) {} }
    apply();
  };
  var move = function (e) {
    if (!stick || e.pointerId !== stick.id) return;
    stick.x = e.clientX; stick.y = e.clientY;
    // the dial follows a thumb that slides past its edge, so turning round is quick
    var un = unit() * 1.6, dx = stick.x - stick.ox, dy = stick.y - stick.oy, dd = Math.hypot(dx, dy);
    if (dd > un) { stick.ox = stick.x - dx / dd * un; stick.oy = stick.y - dy / dd * un; }
    apply();
  };
  var up = function (e) {
    BB.touchDown = false;
    if (stick && e.pointerId === stick.id) stick = null;
    if (jumps[e.pointerId]) { delete jumps[e.pointerId]; nJump = Math.max(0, nJump - 1); }
    apply();
  };
  window.addEventListener('pointerdown', down, { passive: false });
  window.addEventListener('pointermove', move, { passive: false });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  window.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ---- drawing the controls ---- */
  var INK = ui.INK;
  // the stone dial: a flat pebble with arrows carved in, and the knob the thumb pushes
  var drawDial = function (g, x, y, kx, ky, a, run) {
    var r = 15;
    g.globalAlpha = a * 0.35; I.disc(g, x + 1, y + 2, r, '#1c0e30'); g.globalAlpha = a;
    I.disc(g, x, y, r, INK);
    I.disc(g, x, y, r - 0.5, run ? '#f6c450' : '#b8b0c8');
    I.disc(g, x - 1, y - 1.5, r - 3, run ? '#ffe08a' : '#d4cee0');
    I.disc(g, x - 3, y - 5, 3, run ? '#fff4c0' : '#ebe7f2');
    // carved arrows
    g.fillStyle = mix(INK, '#b8b0c8', 0.35);
    for (var k = 0; k < 3; k += 0.5) { g.fillRect(snap(x - r + 3 + k), snap(y - (3 - k)), 0.5, (3 - k) * 2); g.fillRect(snap(x + r - 3.5 - k), snap(y - (3 - k)), 0.5, (3 - k) * 2); }
    // the knob
    var kr = 6.5;
    g.globalAlpha = a * 0.4; I.disc(g, kx + 1, ky + 2, kr, '#1c0e30'); g.globalAlpha = a;
    I.disc(g, kx, ky, kr, INK); I.disc(g, kx, ky, kr - 0.5, '#fff4dc'); I.disc(g, kx - 1, ky - 1.5, kr - 2.5, '#fffbf0');
    if (run) { g.fillStyle = '#ffffff'; var sd = kx > x ? -1 : 1; for (var i = 0; i < 3; i++) g.fillRect(snap(kx + sd * (kr + 2 + i * 2)), snap(ky - 3 + i * 3), sd * 3, 0.5); }
    g.globalAlpha = 1;
  };
  // the bouncy mushroom: red cap, white spots, a little face; it squashes when pressed
  var drawMushroom = function (g, x, base, a, sq) {
    var cw = 17 * (1 + sq * 0.025), ch = 11 * (1 - sq * 0.04), sw = 6.5, sh = 9 * (1 - sq * 0.05);
    g.globalAlpha = a * 0.3; ui.round(g, x - cw + 2, base - 2, cw * 2, 4, '#1c0e30', 2); g.globalAlpha = a;
    // stem
    ui.round(g, x - sw, base - sh, sw * 2, sh, INK, 1.5);
    ui.round(g, x - sw + 0.5, base - sh, sw * 2 - 1, sh - 0.5, '#fff4dc', 1.5);
    g.fillStyle = '#ecd6ae'; g.fillRect(snap(x + sw - 2.5), snap(base - sh + 1), 2, sh - 2);
    // face
    g.fillStyle = INK;
    var fy = base - sh + 3;
    if (sq > 2) { g.fillRect(snap(x - 3), snap(fy + 0.5), 2, 0.5); g.fillRect(snap(x + 1), snap(fy + 0.5), 2, 0.5); }
    else { g.fillRect(snap(x - 2.5), snap(fy), 1, 1.5); g.fillRect(snap(x + 1.5), snap(fy), 1, 1.5); }
    g.fillRect(snap(x - 1), snap(fy + 2.5), 2, 0.5);
    g.fillStyle = '#ffb0b8'; g.fillRect(snap(x - 4.5), snap(fy + 2), 1.5, 0.5); g.fillRect(snap(x + 3), snap(fy + 2), 1.5, 0.5);
    // cap: a dome drawn in rows
    var top = base - sh - ch + 2;
    var capW = function (yy) { var k = yy / ch; return cw * Math.sqrt(Math.max(0, 1 - (1 - k) * (1 - k))); };
    // the outline first, a half-pixel bigger all round, then the red over it
    for (var yy = -0.5; yy <= ch + 0.5; yy += 0.5) { var ow = capW(Math.min(ch, Math.max(0, yy + 0.5))) + 0.5; g.fillStyle = INK; g.fillRect(snap(x - ow), snap(top + yy), snap(ow * 2), 0.5); }
    for (yy = 0.5; yy <= ch; yy += 0.5) { var hw = capW(yy) - 0.5; if (hw > 0.5) { g.fillStyle = yy > ch - 2 ? '#c02840' : yy < 2.5 ? '#ff6a76' : '#ef4a5a'; g.fillRect(snap(x - hw), snap(top + yy), snap(hw * 2), 0.5); } }
    g.fillStyle = '#ff8a96'; g.fillRect(snap(x - cw * 0.45), snap(top + 2), cw * 0.5, 0.5);
    [[-9, 4, 2.6], [1, 2.5, 2.2], [8, 6, 2], [-3, 7.5, 1.4], [12, 9, 1.2]].forEach(function (s) { if (top + s[1] < top + ch - 1) I.disc(g, x + s[0] * cw / 17, top + s[1], s[2], '#ffffff'); });
    g.globalAlpha = 1;
  };
  // the throw bubble: a paper button with a fireball on it
  var drawThrow = function (g, x, y, a) {
    g.globalAlpha = a;
    I.disc(g, x, y, 8, INK); I.disc(g, x, y, 7.5, '#fff4dc');
    I.disc(g, x, y, 4, '#ff7a2a'); I.disc(g, x - 1, y - 1, 2.5, '#ffd050'); I.disc(g, x - 1.5, y - 1.5, 1, '#ffffff');
    g.globalAlpha = 1;
  };
  // a ghost thumb, showing a new player what to do
  var ghostTap = function (g, x, y, ph) {
    var press = ph % 60 < 14;
    if (press) { g.globalAlpha = 0.6; g.fillStyle = '#ffffff'; for (var a = 0; a < 6.28; a += 0.4) g.fillRect(snap(x + Math.cos(a) * (6 + (ph % 60) * 0.3)), snap(y + Math.sin(a) * (6 + (ph % 60) * 0.3) * 0.5), 1, 0.5); }
    g.globalAlpha = 0.95; I.finger(g, x - 3, y - (press ? 1 : 4)); g.globalAlpha = 1;
  };
  var drawPuffs = function (g, on) {
    puffs.forEach(function (p) {
      if (p.on !== on) return;
      var r = 3 + p.t * 0.6;
      g.globalAlpha = Math.max(0, 1 - p.t / 14);
      g.fillStyle = p.c || '#ffffff';
      for (var a = 0; a < 6.28; a += 0.5) g.fillRect(snap(p.x + Math.cos(a) * r), snap(p.y + Math.sin(a) * r), 1, 1);
      g.globalAlpha = 1;
    });
  };
  // where a thumb is, in a canvas's game pixels
  var at = function (cx, cy, on) { var g = BB.toGame(cx, cy); return g.on === on || (on === 'screen' && !BB.deck.on) ? g : null; };

  /* Over the screen: the dial under a thumb, the throw bubble, the first-
     time glow, the ripples. Called by game.js last thing in each frame. */
  BB.drawTouch = function (g) {
    t++;
    puffs.forEach(function (p) { p.t++; }); puffs = puffs.filter(function (p) { return p.t < 14; });
    if (squash) squash--;
    if (!playing()) { if (stick || nJump) release(); hot.throwAt = null; drawPuffs(g, 'screen'); return; }
    var W = BB.W, deck = BB.deck.on;
    if (!deck) {
      // sideways: the controls are drawn only where a thumb is…
      if (stick) {
        var o = at(stick.ox, stick.oy, 'screen'), k = at(stick.x, stick.y, 'screen');
        if (o && k) { var dx = k.x - o.x, dy = k.y - o.y, dd = Math.hypot(dx, dy), m = Math.min(dd, 9); drawDial(g, o.x, o.y, o.x + (dd ? dx / dd * m : 0), o.y + (dd ? dy / dd * m : 0), 0.6, BB.touchRun); }
      }
      // …and, until they've been used, glow where they'll be
      if (!learnt && BB.game.G() && BB.game.G().n === 1) {
        var pulse = 0.55 + Math.sin(t * 0.1) * 0.15;
        // at mid-height on each side, clear of Bonnie and the ground he runs on
        if (!stick) { drawDial(g, 30, 66, 30 + Math.sin(t * 0.05) * 7, 66, pulse * 0.8, false); ghostTap(g, 30 + Math.sin(t * 0.05) * 7, 70, 0); }
        if (!nJump) { drawMushroom(g, W - 32, 86, pulse * 0.8, 0); ghostTap(g, W - 30, 76, t); }
      }
      hot.throwAt = null;
      if (BB.touchCanThrow) { hot.throwAt = { on: 'screen', x: W - 44, y: H - 70, w: 24, h: 24 }; drawThrow(g, W - 32, H - 58, 0.85); }
    }
    drawPuffs(g, 'screen');
  };

  /* ---- the deck: the ground under the screen, held upright ---- */
  var hash = function (a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  var soil = function (g, W, DH, info) {
    var th = BB.game.theme(info.theme), cam = info.camX || 0, ox = snap(-(cam % 16));
    for (var y = 0; y < DH; y += 8) for (var x = ox - 16; x < W + 16; x += 8) BB.draw(g, th.fill[((x - ox + Math.floor(cam / 8) * 8) >> 3) & 1], x, y);
    // deeper is darker
    for (var yy = 0; yy < DH; yy += 2) { g.globalAlpha = Math.min(0.62, 0.08 + yy / DH * 0.7); g.fillStyle = th.deep; g.fillRect(0, yy, W, 2); }
    g.globalAlpha = 1;
    var gp = BB.ART.themes[info.theme].gpal;
    // pebbles, roots and the odd treasure, fixed to the ground, so they scroll with the level
    for (var cx = Math.floor(cam / 24) - 1; cx < Math.floor((cam + W) / 24) + 2; cx++) {
      var px = cx * 24 - cam, r1 = hash(cx, 1), r2 = hash(cx, 2), r3 = hash(cx, 3);
      var py = 10 + r1 * (DH - 20);
      if (r2 < 0.75) {
        var pr = 1.5 + r3 * 2.5, pc = mix(th.deep, '#d8ccc0', 0.55 + r2 * 0.2);
        I.disc(g, px + 1, py + 1, pr, 'rgba(20,10,30,0.35)'); I.disc(g, px, py, pr, pc); I.disc(g, px - pr * 0.3, py - pr * 0.35, pr * 0.45, mix(pc, '#ffffff', 0.35));
      }
      if (r3 > 0.62 && info.roots) {
        g.fillStyle = mix(gp[3], '#2a1810', 0.4);
        var rx = px + 12, len = 6 + r1 * 16;
        for (var k = 0; k < len; k += 0.5) g.fillRect(snap(rx + Math.sin(k * 0.5 + cx) * 1.5), snap(k), 0.5, 0.5);
      }
      if (r1 > 0.93) {
        // a buried star, glinting now and then
        var sy = DH * 0.7 + r2 * DH * 0.2;
        BB.draw(g, BB.ART.starSmall, px + 6, sy);
        if ((t + cx * 17) % 90 < 8) { g.fillStyle = '#ffffff'; g.fillRect(px + 9, sy - 2, 0.5, 2); }
      }
    }
  };
  var sea = function (g, W, DH, info) {
    for (var y = 0; y < DH; y += 2) { g.fillStyle = mix('#3a9ae8', '#123070', Math.min(1, y / DH)); g.fillRect(0, y, W, 2); }
    // light rippling down from the surface
    g.globalAlpha = 0.12; g.fillStyle = '#ffffff';
    for (var i = 0; i < 7; i++) { var bx = (i * 37 + t * 0.15) % (W + 30) - 15; for (var yy = 0; yy < DH * 0.7; yy += 1) g.fillRect(snap(bx + yy * 0.25 + Math.sin(yy * 0.08 + t * 0.03 + i) * 2), yy, 3 - yy / DH * 3, 1); }
    g.globalAlpha = 1;
    // fish drifting by
    for (var f = 0; f < 4; f++) {
      var fx = ((f * 71 + t * (0.2 + f * 0.07)) % (W + 40)) - 20, fy = DH * (0.3 + f * 0.15) + Math.sin(t * 0.03 + f) * 3;
      var c = ['#ffb050', '#ff7a9a', '#ffe060', '#7ae8c8'][f];
      I.disc(g, fx, fy, 2.2, c); g.fillStyle = c; g.fillRect(snap(fx - 4.5), snap(fy - 1.5), 2, 3); g.fillStyle = INK; g.fillRect(snap(fx + 1), snap(fy - 0.5), 0.5, 0.5);
    }
    // bubbles
    for (var b = 0; b < 6; b++) { var by = DH - ((t * 0.4 + b * 37) % DH), bx2 = (b * 53) % W + Math.sin(t * 0.05 + b) * 2; g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(snap(bx2), snap(by), 1, 1); }
  };
  BB.renderDeck = function (g) {
    var W = BB.W, DH = BB.deck.H, info = BB.game.deckInfo();
    if (info.kind === 'sea') sea(g, W, DH, info); else soil(g, W, DH, info);
    // a soft shadow under the screen's edge, so the screen sits on top
    for (var i = 0; i < 4; i++) { g.fillStyle = 'rgba(16,6,28,' + (0.35 - i * 0.08) + ')'; g.fillRect(0, i, W, 1); }
    var p = playing(), cy = Math.min(DH * 0.42, 84);
    hot.throwAt = null;
    if (p) {
      // the dial rests at home until a thumb lands, then sits under it
      var o = stick && at(stick.ox, stick.oy, 'deck'), k = stick && at(stick.x, stick.y, 'deck');
      if (o && k) { var dx = k.x - o.x, dy = k.y - o.y, dd = Math.hypot(dx, dy), m = Math.min(dd, 9); drawDial(g, o.x, o.y, o.x + (dd ? dx / dd * m : 0), o.y + (dd ? dy / dd * m : 0), 1, BB.touchRun); }
      else drawDial(g, W * 0.24, cy, W * 0.24, cy, 0.9, false);
      drawMushroom(g, W * 0.75, cy + 16, 1, nJump ? 6 : squash);
      if (!learnt && BB.game.G() && BB.game.G().n === 1) { ghostTap(g, W * 0.24 + Math.sin(t * 0.05) * 6, cy + 4, 0); ghostTap(g, W * 0.75 + 2, cy, t); }
      if (BB.touchCanThrow) { hot.throwAt = { on: 'deck', x: W * 0.75 - 40, y: cy - 30, w: 22, h: 22 }; drawThrow(g, W * 0.75 - 29, cy - 19, 1); }
    }
    drawPuffs(g, 'deck');
  };
})();
