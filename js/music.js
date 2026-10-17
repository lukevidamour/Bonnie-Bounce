/* ==========================================================================
   music.js — the soundtrack. Every tune is an original, written for this
   game: a 4- or 8-bar loop per world, a few jingles. Read by BB.music() in
   core.js.

   A tune is { step: seconds per sixteenth, tracks: [...] }. A track is a
   string of tokens — a note ('C5', 'F#4', 'Bb3'), '-' to hold it, '.' to
   rest; on a noise track 'x' is a hi-hat and 'X' a snare. Pulse tracks set
   a duty (0.125 thin and bright, 0.5 round); `wave:'tri'` is the soft bass.
   `once` plays it through a single time; `ms` is how long a jingle waits
   when the sound is off.
   ========================================================================== */
(function () {
  'use strict';
  var r = function (s, n) { var o = []; for (var i = 0; i < n; i++) o.push(s); return o.join(' '); };
  var j = function () { return Array.prototype.join.call(arguments, ' '); };
  // a bouncing bass: root and fifth in eighths, a bar long
  var b8 = function (a, b) { return r(a + ' . ' + b + ' .', 4); };
  // a four-note arpeggio in sixteenths, a bar long
  var ar = function (a, b, c, d) { return r([a, b, c, d || b].join(' '), 4); };
  // the same line a few steps later: the caves' echo
  var later = function (s, n) { var t = s.split(' '); return t.slice(-n).concat(t.slice(0, -n)).join(' '); };
  var DR = 'x . x . X . x . x . x . X . x x';

  BB.SONGS = {
    map: {
      step: 0.13,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('A5 - - - C6 - A5 - F5 - - - G5 - A5 -', 'D5 - - - F5 - A5 - D6 - - - C6 - A5 -', 'Bb5 - - - A5 - G5 - F5 - - - D5 - F5 -', 'E5 - - - G5 - C6 - - - - - . . . .') },
        { wave: 'tri', vol: 0.09, notes: j('F2 . . . C3 . . . F2 . . . C3 . . .', 'D3 . . . A2 . . . D3 . . . A2 . . .', 'Bb2 . . . F3 . . . Bb2 . . . F3 . . .', 'C3 . . . G2 . . . C3 . E3 . G3 . . .') },
        { noise: 1, vol: 0.012, notes: r('x . . . X . . . x . . . X . . .', 4) }
      ]
    },
    hills: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.028, notes: j('E5 - G5 - C6 - - - B5 - G5 - E5 - - -', 'A5 - - - G5 - E5 - C5 - D5 - E5 - - -', 'F5 - A5 - C6 - A5 - G5 - F5 - E5 - D5 -', 'D5 - E5 - F5 - G5 - - - . . G4 - . .',
          'E5 - G5 - C6 - - - D6 - C6 - B5 - G5 -', 'A5 - - - C6 - B5 - A5 - G5 - E5 - - -', 'F5 - A5 - C6 - A5 - B5 - D6 - B5 - G5 -', 'C6 - - - G5 - E5 - C5 - - - . . . .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('C5', 'E5', 'G5'), ar('A4', 'C5', 'E5'), ar('A4', 'C5', 'F5'), ar('B4', 'D5', 'G5'), ar('C5', 'E5', 'G5'), ar('A4', 'C5', 'E5'), ar('A4', 'C5', 'F5'), ar('C5', 'E5', 'G5')) },
        { wave: 'tri', vol: 0.09, notes: j(b8('C3', 'G3'), b8('A2', 'E3'), b8('F2', 'C3'), 'G2 . D3 . G2 . D3 . G2 . D3 . B2 . D3 .', b8('C3', 'G3'), b8('A2', 'E3'), 'F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 .', 'C3 . G3 . C3 . G3 . C3 . . . G2 . B2 .') },
        { noise: 1, vol: 0.016, notes: r(DR, 8) }
      ]
    },
    park: {
      step: 0.095,
      tracks: [
        { duty: 0.5, vol: 0.026, notes: j('F#5 . A5 . D6 . A5 . F#5 . A5 . B5 - A5 -', 'G5 . B5 . D6 . B5 . G5 . B5 . C#6 - B5 -', 'A5 . C#6 . E6 . C#6 . A5 . E5 . F#5 - G5 -', 'F#5 - - - D5 - - - D6 - - - . . . .',
          'B5 . D6 . F#6 . D6 . B5 . F#5 . G5 - A5 -', 'G5 . B5 . D6 . G6 . F#6 . E6 . D6 - B5 -', 'A5 . C#6 . E6 . A6 . G6 . E6 . C#6 - A5 -', 'D6 - - - A5 - - - D5 - - - . . . .') },
        { wave: 'tri', vol: 0.09, notes: j(r('D3 . F#3 . A3 . F#3 .', 2), r('G2 . B2 . D3 . B2 .', 2), r('A2 . C#3 . E3 . C#3 .', 2), r('D3 . F#3 . A3 . F#3 .', 2),
          r('B2 . D3 . F#3 . D3 .', 2), r('G2 . B2 . D3 . B2 .', 2), r('A2 . C#3 . E3 . C#3 .', 2), 'D3 . A2 . D3 . A2 . D3 . . . A2 . C#3 .') },
        { noise: 1, vol: 0.016, notes: r('x . X x x . X . x . X x x . X .', 8) }
      ]
    },
    beach: {
      step: 0.105,
      tracks: [
        { duty: 0.5, vol: 0.026, notes: j('B5 . D6 . . B5 . G5 . A5 B5 . A5 . G5 .', 'E5 . G5 . . C6 . E6 . D6 C6 . B5 . A5 .', 'F#5 . A5 . . D6 . F#6 . E6 D6 . C6 . A5 .', 'G5 . B5 . D6 . . B5 . G5 . . . . . .') },
        { duty: 0.125, vol: 0.011, notes: j('. . G4 . . . G4 . . . G4 . . . G4 .', '. . E4 . . . E4 . . . E4 . . . E4 .', '. . F#4 . . . F#4 . . . F#4 . . . F#4 .', '. . G4 . . . G4 . . . G4 . . . G4 .') },
        { wave: 'tri', vol: 0.09, notes: j('G2 . . G2 D3 . . G2 . . G2 . D3 . B2 .', 'C3 . . C3 G3 . . C3 . . C3 . G3 . E3 .', 'D3 . . D3 A3 . . D3 . . D3 . A3 . F#3 .', 'G2 . . G2 D3 . . G2 . . G2 . D3 . G2 .') },
        { noise: 1, vol: 0.015, notes: r('x . x X . x x . x . x X . x x .', 4) }
      ]
    },
    reef: {
      step: 0.13,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('E5 - - - - - G5 - - - C6 -', 'B5 - - - - - A5 - - - E5 -', 'F5 - - - - - A5 - - - C6 -', 'B5 - - - D6 - - - - - . .',
          'C6 - - - - - B5 - - - G5 -', 'A5 - - - - - C6 - - - E6 -', 'D6 - - - C6 - - - A5 - F5 -', 'G5 - - - - - - - - - . .') },
        { duty: 0.125, vol: 0.011, notes: j('C4 . E4 . G4 . C5 . G4 . E4 .', 'A3 . C4 . E4 . A4 . E4 . C4 .', 'F3 . A3 . C4 . F4 . C4 . A3 .', 'G3 . B3 . D4 . G4 . D4 . B3 .',
          'C4 . E4 . G4 . C5 . G4 . E4 .', 'A3 . C4 . E4 . A4 . E4 . C4 .', 'D4 . F4 . A4 . D5 . A4 . F4 .', 'G3 . B3 . D4 . G4 . D4 . B3 .') },
        { wave: 'tri', vol: 0.08, notes: j('C3 - - - . . G2 - - - . .', 'A2 - - - . . E2 - - - . .', 'F2 - - - . . C3 - - - . .', 'G2 - - - . . D3 - - - . .', 'C3 - - - . . G2 - - - . .', 'A2 - - - . . E3 - - - . .', 'D3 - - - . . A2 - - - . .', 'G2 - - - . . G2 - - - . .') },
        { noise: 0, vol: 0.006, notes: r('. . . . x . . . x . . .', 8) }
      ]
    },
    woods: {
      step: 0.15,
      tracks: [
        { duty: 0.125, vol: 0.026, notes: j('A4 - - - C5 - - - E5 - D5 - C5 - - -', 'F5 - - - E5 - - - C5 - - - A4 - - -', 'D5 - - - F5 - - - A5 - G#5 - A5 - - -', 'G#5 - - - E5 - - - B4 - - - . . . .') },
        { duty: 0.5, vol: 0.008, notes: j(ar('A3', 'C4', 'E4'), ar('F3', 'A3', 'C4'), ar('D3', 'F3', 'A3'), ar('E3', 'G#3', 'B3')) },
        { wave: 'tri', vol: 0.09, notes: j('A2 . . . A2 . . . A2 . . . A2 . E2 .', 'F2 . . . F2 . . . F2 . . . F2 . C3 .', 'D2 . . . D2 . . . D2 . . . D2 . A2 .', 'E2 . . . E2 . . . G#2 . . . B2 . . .') },
        { noise: 1, vol: 0.014, notes: r('x . . . . . x . x . . . . . x .', 4) }
      ]
    },
    cave: (function () {
      var lead = j('D5 - . . F5 - . . A5 - - - G5 - F5 -', 'F5 - . . D5 - . . Bb4 - - - . . . .', 'C5 - . . E5 - . . G5 - - - F5 - E5 -', 'D5 - - - - - - - . . . . A4 - . .');
      return {
        step: 0.14,
        tracks: [
          { duty: 0.25, vol: 0.026, notes: lead },
          { duty: 0.125, vol: 0.009, notes: later(lead, 3) },
          { wave: 'tri', vol: 0.09, notes: j('D2 - - - . . . . D2 - - - . . A2 .', 'Bb2 - - - . . . . Bb2 - - - . . F2 .', 'C3 - - - . . . . C3 - - - . . G2 .', 'D2 - - - . . . . D2 - - - A2 - - -') },
          { noise: 0, vol: 0.007, notes: r('x . . . . . . . X . . . . . . .', 4) }
        ]
      };
    })(),
    snow: {
      step: 0.11,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('B5 - G5 - E5 - G5 - B5 - - - A5 - G5 -', 'E6 - - - D6 - C6 - G5 - - - E5 - - -', 'D6 - B5 - G5 - B5 - D6 - - - C6 - B5 -', 'A5 - - - F#5 - D5 - F#5 - A5 - - - . .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('E5', 'G5', 'B5'), ar('E5', 'G5', 'C6'), ar('D5', 'G5', 'B5'), ar('D5', 'F#5', 'A5')) },
        { wave: 'tri', vol: 0.09, notes: j(b8('E3', 'B2'), b8('C3', 'G3'), b8('G2', 'D3'), b8('D3', 'A2')) },
        { noise: 1, vol: 0.01, notes: r('x x x x x x x x x x x x x x x x', 4) }
      ]
    },
    sky: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('C6 - - - A5 - - - F5 - A5 - C6 - F6 -', 'E6 - - - C6 - A5 - E5 - - - A5 - C6 -', 'D6 - - - Bb5 - F5 - D5 - F5 - Bb5 - D6 -', 'C6 - - - - - - - E6 - - - G6 - - -') },
        { duty: 0.125, vol: 0.011, notes: j(ar('F4', 'A4', 'C5'), ar('E4', 'A4', 'C5'), ar('F4', 'Bb4', 'D5'), ar('E4', 'G4', 'C5')) },
        { wave: 'tri', vol: 0.09, notes: j('F2 - - - C3 - - - F2 - - - C3 - - -', 'A2 - - - E3 - - - A2 - - - E3 - - -', 'Bb2 - - - F3 - - - Bb2 - - - F3 - - -', 'C3 - - - G2 - - - C3 - - - E3 - - -') },
        { noise: 1, vol: 0.014, notes: r('x . . . X . . x x . . . X . . .', 4) }
      ]
    },
    factory: {
      step: 0.09,
      tracks: [
        { duty: 0.125, vol: 0.026, notes: j('C5 . C5 . Eb5 . C5 . G5 . . . F5 . Eb5 .', 'C5 . C5 . Eb5 . F5 . G5 . Bb5 . G5 . . .', 'Ab5 . . . G5 . F5 . Eb5 . . . C5 . . .', 'B4 . D5 . F5 . G5 . B5 . . . G5 . . .') },
        { wave: 'tri', vol: 0.085, notes: j(r('C2 C3', 8), r('C2 C3', 8), r('Ab2 Ab3', 8), r('G2 G3', 8)) },
        { noise: 1, vol: 0.016, notes: r('X . x . X x x . X . x . X x x x', 4) }
      ]
    },
    castle: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('D5 - - - D5 - E5 - F5 - - - E5 - D5 -', 'A5 - - - G5 - F5 - E5 - - - D5 - C#5 -', 'Bb4 - - - D5 - F5 - Bb5 - - - A5 - G5 -', 'A5 - - - E5 - C#5 - A4 - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(ar('D4', 'F4', 'A4'), ar('D4', 'F4', 'A4'), ar('D4', 'F4', 'Bb4'), ar('C#4', 'E4', 'A4')) },
        { wave: 'tri', vol: 0.09, notes: j('D2 . D2 . D3 . D2 . D2 . D2 . D3 . A2 .', 'D2 . D2 . D3 . D2 . D2 . D2 . D3 . A2 .', 'Bb2 . Bb2 . Bb3 . Bb2 . Bb2 . Bb2 . Bb3 . F2 .', 'A2 . A2 . A3 . A2 . E2 . E3 . C#3 . A2 .') },
        { noise: 0, vol: 0.012, notes: r('X . . x X . . . X . . x X . x x', 4) }
      ]
    },
    boss: {
      step: 0.08,
      tracks: [
        { duty: 0.5, vol: 0.022, notes: j('E5 G5 B5 E6 B5 G5 E5 G5 B5 E6 B5 G5 E5 G5 B5 G5', 'C5 E5 G5 C6 G5 E5 C5 E5 G5 C6 G5 E5 C5 E5 G5 E5', 'E5 G5 B5 E6 B5 G5 E5 G5 B5 E6 B5 G5 E5 G5 B5 G5', 'B4 D#5 F#5 B5 F#5 D#5 B4 D#5 F#5 B5 A5 G5 F#5 D#5 B4 .') },
        { wave: 'tri', vol: 0.09, notes: j('E2 . E2 E3 . E2 E2 . E2 . E2 E3 . E2 D3 .', 'C2 . C2 C3 . C2 C2 . C2 . C2 C3 . C2 B2 .', 'E2 . E2 E3 . E2 E2 . E2 . E2 E3 . E2 D3 .', 'B1 . B1 B2 . B1 B1 . B1 . B1 B2 . B1 D#2 .') },
        { noise: 0, vol: 0.012, notes: r('X x x x X x x x X x x x X x X x', 4) }
      ]
    },
    star: {
      step: 0.07,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('C6 . C6 . C6 . . C6 . C6 . C6 . D6 E6 .', 'D6 . D6 . D6 . . D6 . D6 . D6 . C6 B5 .') },
        { wave: 'tri', vol: 0.09, notes: j('C3 . C3 . G2 . C3 . C3 . C3 . G2 . C3 .', 'D3 . D3 . A2 . D3 . G2 . G2 . D3 . G2 .') },
        { noise: 1, vol: 0.016, notes: r('X x X x X x X x X x X x X x X x', 2) }
      ]
    },
    clear: {
      step: 0.09, once: true, ms: 2600,
      tracks: [
        { duty: 0.25, vol: 0.032, notes: 'G5 . B5 . D6 . G6 - - - E6 - - - F#6 - - - G6 - - - - - - - . . . .' },
        { duty: 0.125, vol: 0.016, notes: 'B4 . D5 . G5 . B5 - - - G5 - - - A5 - - - B5 - - - - - - - . . . .' },
        { wave: 'tri', vol: 0.1, notes: 'G2 . D3 . G2 . G3 - - - C3 - - - D3 - - - G2 - - - - - - - . . . .' }
      ]
    },
    over: {
      step: 0.14, once: true, ms: 2600,
      tracks: [
        // (the lead padded to the bass's 30 steps, so it doesn't start again at the end)
        { duty: 0.5, vol: 0.03, notes: 'C5 - G4 - E4 - . . A4 - B4 - A4 - G#4 - Bb4 - G#4 - G4 - - - - - . . . .' },
        { wave: 'tri', vol: 0.1, notes: 'C3 - - - - - . . F2 - - - - - . . E2 - - - - - C2 - - - - - . .' }
      ]
    },
    ending: {
      step: 0.12,
      tracks: [
        { duty: 0.25, vol: 0.028, notes: j('C6 - - - G5 - - - E5 - G5 - C6 - E6 -', 'F6 - - - E6 - D6 - C6 - - - A5 - - -', 'B5 - - - D6 - - - G6 - F6 - E6 - D6 -', 'C6 - - - - - - - G5 - - - C6 - - -',
          'A5 - - - C6 - - - E6 - D6 - C6 - A5 -', 'F5 - - - A5 - - - C6 - - - F6 - - -', 'G5 - - - B5 - - - D6 - - - F6 - D6 -', 'E6 - - - - - - - C6 - - - - - - -') },
        { duty: 0.125, vol: 0.011, notes: j(ar('C5', 'E5', 'G5'), ar('C5', 'F5', 'A5'), ar('B4', 'D5', 'G5'), ar('C5', 'E5', 'G5'), ar('A4', 'C5', 'E5'), ar('A4', 'C5', 'F5'), ar('B4', 'D5', 'G5'), ar('C5', 'E5', 'G5')) },
        { wave: 'tri', vol: 0.09, notes: j(b8('C3', 'G3'), b8('F2', 'C3'), b8('G2', 'D3'), b8('C3', 'G3'), b8('A2', 'E3'), b8('F2', 'C3'), b8('G2', 'D3'), b8('C3', 'G3')) },
        { noise: 1, vol: 0.015, notes: r(DR, 8) }
      ]
    },

    /* ---- Magpie Isles: the second land, levels 11 to 20 ---------------- */

    // the second island's map: a gentle stroll by the sea in D, as calm as
    // the first map; the thin middle voice rocks to and fro like water
    // lapping at the shore, and the noise is a soft wave on two and four
    map2: {
      step: 0.13,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('A5 - - - F#5 - D5 - E5 - F#5 - A5 - - -', 'B5 - - - A5 - F#5 - D5 - - - . . . .', 'G5 - - - B5 - D6 - - - B5 - A5 - G5 -', 'E5 - - - - - F#5 - G5 - - - A5 - - -',
          'A5 - - - F#5 - D5 - E5 - F#5 - A5 - D6 -', 'B5 - - - A5 - F#5 - D6 - - - B5 - - -', 'G5 - - - B5 - E6 - C#6 - - - A5 - - -', 'D6 - - - - - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(r('D4 . A4 . F#4 . A4 .', 2), r('B3 . F#4 . D4 . F#4 .', 2), r('G3 . D4 . B3 . D4 .', 2), r('A3 . E4 . C#4 . E4 .', 2),
          r('D4 . A4 . F#4 . A4 .', 2), r('B3 . F#4 . D4 . F#4 .', 2), 'G3 . E4 . B3 . E4 . A3 . E4 . C#4 . E4 .', r('D4 . A4 . F#4 . A4 .', 2)) },
        { wave: 'tri', vol: 0.09, notes: j('D3 - . . A2 - . . D3 - . . A2 - . .', 'B2 - . . F#2 - . . B2 - . . F#2 - . .', 'G2 - . . D3 - . . G2 - . . D3 - . .', 'A2 - . . E2 - . . A2 - . . C#3 - . .',
          'D3 - . . A2 - . . D3 - . . A2 - . .', 'B2 - . . F#2 - . . B2 - . . F#2 - . .', 'E2 - . . B2 - . . A2 - . . C#3 - . .', 'D3 - . . A2 - . . D3 - - - . . . .') },
        { noise: 0, vol: 0.008, notes: r('. . . . X . . . . . . . X . . .', 8) }
      ]
    },
    // Sunset Harbour: a swaying shanty in 6/8, so twelve steps to a bar
    // (as on the reef). Each beat is a long note and a short one, a boat
    // rocking at its mooring; the bass leans root, fifth, and the thin
    // voice answers 'pah-pah'. Bb major, for the warm golden light
    harbour: {
      step: 0.11,
      tracks: [
        { duty: 0.5, vol: 0.026, notes: j('D5 - - - F5 - Bb5 - - - A5 -', 'G5 - - - Eb5 - Bb4 - - - Eb5 -', 'C5 - - - A4 - C5 - F5 - A5 -', 'Bb5 - - - - - F5 - - - . .',
          'Bb5 - - - G5 - D5 - - - G5 -', 'Eb5 - - - G5 - Bb5 - C6 - Bb5 -', 'A5 - - - F5 - C6 - - - A5 -', 'Bb5 - - - - - D5 - - - C5 -') },
        { duty: 0.125, vol: 0.011, notes: j(r('. . D4 . F4 .', 2), r('. . Eb4 . G4 .', 2), r('. . F4 . A4 .', 2), r('. . D4 . F4 .', 2),
          r('. . G4 . Bb4 .', 2), r('. . Eb4 . G4 .', 2), r('. . F4 . A4 .', 2), r('. . D4 . F4 .', 2)) },
        { wave: 'tri', vol: 0.09, notes: j('Bb2 - - - . . F2 - - - . .', 'Eb3 - - - . . Bb2 - - - . .', 'F2 - - - . . C3 - - - . .', 'Bb2 - - - . . F2 - - - . .',
          'G2 - - - . . D3 - - - . .', 'Eb3 - - - . . Bb2 - - - . .', 'F2 - - - . . C3 - - - . .', 'Bb2 - - - . . F2 - - - . .') },
        { noise: 1, vol: 0.012, notes: r('x . . . x . X . . . x .', 8) }
      ]
    },
    // Candy Meadow: sugar-quick and skippy in A. Short bright notes with
    // gaps to bounce in, and a bass that boings up and down the octave
    candy: {
      step: 0.088,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('E5 . A5 . C#6 - B5 . A5 . E5 . F#5 - E5 -', 'F#5 . A5 . C#6 - E6 . C#6 . A5 . B5 - - -', 'D6 . C#6 . B5 . A5 . F#5 . A5 . D6 - - -', 'C#6 - B5 . G#5 . E5 . F#5 . G#5 . B5 . . .',
          'E5 . A5 . C#6 - B5 . A5 . E6 . C#6 - A5 -', 'F#5 . A5 . C#6 - E6 . F#6 - E6 . C#6 - - -', 'D6 . C#6 . B5 . A5 . B5 . C#6 . B5 - G#5 -', 'A5 - - - E5 . C#5 . A4 . . . C#5 . D5 .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('A4', 'C#5', 'E5'), ar('F#4', 'A4', 'C#5'), ar('F#4', 'A4', 'D5'), ar('G#4', 'B4', 'E5'),
          ar('A4', 'C#5', 'E5'), ar('F#4', 'A4', 'C#5'), 'F#4 A4 D5 A4 F#4 A4 D5 A4 G#4 B4 E5 B4 G#4 B4 E5 B4', ar('A4', 'C#5', 'E5')) },
        { wave: 'tri', vol: 0.09, notes: j(r('A2 . A3 .', 4), r('F#2 . F#3 .', 4), r('D2 . D3 .', 4), r('E2 . E3 .', 4),
          r('A2 . A3 .', 4), r('F#2 . F#3 .', 4), j(r('D2 . D3 .', 2), r('E2 . E3 .', 2)), 'A2 . A3 . A2 . A3 . A2 . A3 . E2 . E3 .') },
        { noise: 1, vol: 0.014, notes: r('x . x . X . x x x . x . X . x .', 8) }
      ]
    },
    // Windy Cliffs: long notes that climb and hang like a gull on the
    // wind. The bass and the flutter are bare fifths, no thirds, so it
    // sounds wide open, and the flattened seventh (C in D) sounds brave
    cliffs: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('A4 - D5 - A5 - - - - - G5 - F#5 - E5 -', 'G5 - - - - - E5 - C5 - - - D5 - E5 -', 'D5 - - - G5 - - - B5 - - - A5 - G5 -', 'A5 - - - - - - - - - - - . . A4 -',
          'D5 - A5 - D6 - - - - - C6 - A5 - F#5 -', 'E5 - - - G5 - C6 - - - E6 - D6 - C6 -', 'D6 - - - B5 - - - C#6 - - - E6 - - -', 'D6 - - - - - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(ar('D4', 'A4', 'D5'), ar('C4', 'G4', 'C5'), ar('G3', 'D4', 'G4'), ar('D4', 'A4', 'D5'),
          ar('D4', 'A4', 'D5'), ar('C4', 'G4', 'C5'), j(r('G3 D4 G4 D4', 2), r('A3 E4 A4 E4', 2)), ar('D4', 'A4', 'D5')) },
        { wave: 'tri', vol: 0.09, notes: j(r('D2 . A2 . D3 . A2 .', 2), r('C2 . G2 . C3 . G2 .', 2), r('G2 . D3 . G3 . D3 .', 2), r('D2 . A2 . D3 . A2 .', 2),
          r('D2 . A2 . D3 . A2 .', 2), r('C2 . G2 . C3 . G2 .', 2), 'G2 . D3 . G3 . D3 . A2 . E3 . A3 . E3 .', 'D2 . A2 . D3 . A2 . D2 . . . A2 . . .') },
        { noise: 1, vol: 0.013, notes: r('x . . x . . x . X . . x . . x .', 8) }
      ]
    },
    // Jungle Ruins: everything plucked and short, a marimba in the trees.
    // G minor with a bright E (Dorian) keeps the mystery playful, and the
    // three-three-two rhythm hops from stone to stone
    jungle: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('G5 . . Bb5 . . C6 . D6 . C6 . Bb5 . . .', 'C6 . . E6 . . D6 . C6 . A5 . G5 . . .', 'G5 . . Bb5 . . C6 . D6 . F6 . D6 . . .', 'C6 . A5 . F5 . A5 . C6 . . . . . . .',
          'D6 . . D6 . . C6 . Bb5 . C6 . D6 . . .', 'E6 . . E6 . . D6 . C6 . D6 . E6 . . .', 'Eb6 . . D6 . . Bb5 . C6 . . . A5 . . .', 'G5 . . D5 . . F5 . G5 . . . . . . .') },
        { duty: 0.5, vol: 0.011, notes: j('G3 . D4 G4 . D4 G3 . D4 . G4 . D4 . Bb3 .', 'C4 . G4 C5 . G4 C4 . G4 . C5 . G4 . E4 .', 'G3 . D4 G4 . D4 G3 . D4 . G4 . D4 . Bb3 .', 'F3 . C4 F4 . C4 F3 . C4 . F4 . C4 . A3 .',
          'G3 . D4 G4 . D4 G3 . D4 . G4 . D4 . Bb3 .', 'C4 . G4 C5 . G4 C4 . G4 . C5 . G4 . E4 .', 'Eb3 . Bb3 Eb4 . Bb3 Eb3 . F3 . C4 F4 . C4 A3 .', 'G3 . D4 G4 . D4 G3 . D4 . G4 . D4 . F#3 .') },
        { wave: 'tri', vol: 0.09, notes: j('G2 . . G2 . . G2 . D3 . . D3 . . G2 .', 'C3 . . C3 . . C3 . G2 . . G2 . . C3 .', 'G2 . . G2 . . G2 . D3 . . D3 . . G2 .', 'F2 . . F2 . . F2 . C3 . . C3 . . F2 .',
          'G2 . . G2 . . G2 . D3 . . D3 . . G2 .', 'C3 . . C3 . . C3 . G2 . . G2 . . C3 .', 'Eb2 . . Eb2 . . Eb2 . F2 . . F2 . . F2 .', 'G2 . . G2 . . G2 . D3 . . D3 . . D2 .') },
        { noise: 1, vol: 0.012, notes: r('X . x x . x X . x . X x . x x .', 8) }
      ]
    },
    // Glowshroom Grove: a lullaby for the mushrooms. Slow, a bass that
    // rocks like a cradle, tiny bells up high and the softest beat, so
    // the night stays sleepy and safe
    glow: {
      step: 0.14,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('Bb5 - - - - - G5 - Eb6 - - - D6 - - -', 'C6 - - - - - Bb5 - G5 - - - - - - -', 'Ab5 - - - - - C6 - Eb6 - - - F6 - - -', 'D6 - - - - - C6 - Bb5 - - - - - - -',
          'Bb5 - - - - - G5 - Eb6 - - - G6 - - -', 'Eb6 - - - - - D6 - C6 - - - G5 - - -', 'Ab5 - - - C6 - Eb6 - D6 - - - C6 - Bb5 -', 'Eb6 - - - - - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.008, notes: j(r('. . G6 . . . Bb6 .', 2), r('. . Eb6 . . . G6 .', 2), r('. . Eb6 . . . Ab6 .', 2), r('. . D6 . . . F6 .', 2),
          r('. . G6 . . . Bb6 .', 2), r('. . Eb6 . . . G6 .', 2), '. . Eb6 . . . Ab6 . . . D6 . . . F6 .', r('. . G6 . . . Bb6 .', 2)) },
        { wave: 'tri', vol: 0.08, notes: j('Eb2 - - - Bb2 - - - Eb3 - - - Bb2 - - -', 'C2 - - - G2 - - - C3 - - - G2 - - -', 'Ab2 - - - Eb3 - - - Ab2 - - - Eb3 - - -', 'Bb1 - - - F2 - - - Bb2 - - - F2 - - -',
          'Eb2 - - - Bb2 - - - Eb3 - - - Bb2 - - -', 'C2 - - - G2 - - - C3 - - - G2 - - -', 'Ab2 - - - Eb3 - - - Bb2 - - - F2 - - -', 'Eb2 - - - Bb2 - - - Eb2 - - - . . . .') },
        { noise: 1, vol: 0.008, notes: r('. . . . x . . . . . . . x . . .', 8) }
      ]
    },
    // Crystal Lagoon: a slow tune dropping like water in a hidden cave,
    // every phrase answered by its own echo off the walls. The cave's
    // trick, but six steps behind, for a bigger cave; the bass rolls in
    // slow waves underneath
    lagoon: (function () {
      var lead = j('C#6 - - - - - B5 - A5 - . . F#5 - . .', 'A5 - - - - - B5 - D6 - . . C#6 - . .', 'E6 - - - - - C#6 - A5 - . . E5 - . .', 'B5 - - - - - G#5 - E5 - - - . . . .',
        'C#6 - - - - - B5 - A5 - . . F#5 - . .', 'F#6 - - - - - E6 - D6 - . . A5 - . .', 'B5 - - - D6 - . . F#6 - - - E6 - D6 -', 'E6 - - - - - - - G#5 - - - . . . .');
      return {
        step: 0.145,
        tracks: [
          { duty: 0.5, vol: 0.024, vib: true, notes: lead },
          { duty: 0.125, vol: 0.009, notes: later(lead, 6) },
          { wave: 'tri', vol: 0.08, notes: j('F#2 - C#3 - F#3 - A3 - C#4 - A3 - F#3 - C#3 -', 'D2 - A2 - D3 - F#3 - A3 - F#3 - D3 - A2 -', 'A2 - E3 - A3 - C#4 - E4 - C#4 - A3 - E3 -', 'E2 - B2 - E3 - G#3 - B3 - G#3 - E3 - B2 -',
            'F#2 - C#3 - F#3 - A3 - C#4 - A3 - F#3 - C#3 -', 'D2 - A2 - D3 - F#3 - A3 - F#3 - D3 - A2 -', 'B1 - F#2 - B2 - D3 - F#3 - D3 - B2 - F#2 -', 'E2 - B2 - E3 - G#3 - B3 - G#3 - E3 - B2 -') },
          { noise: 0, vol: 0.006, notes: r('x . . . . . . . . . x . . . . .', 8) }
        ]
      };
    })(),
    // Dusty Dunes: D minor with its sharpened seventh (C#) for a sandy,
    // far-away colour, kept sunny by a bass that trots like a camel and
    // a lift into F major halfway through
    desert: {
      step: 0.095,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('D5 . . D5 F5 . A5 . . . G5 . F5 . E5 .', 'C#5 . . C#5 E5 . A5 . . . Bb5 . A5 . . .', 'D5 . . D5 F5 . A5 . . . D6 . C#6 . Bb5 .', 'A5 - - - G5 . F5 . E5 - - - . . . .',
          'F5 . . F5 A5 . C6 . . . D6 . C6 . A5 .', 'G5 . . G5 Bb5 . D6 . . . E6 . D6 . Bb5 .', 'C#6 . . C#6 E6 . C#6 . Bb5 . A5 . G5 . F5 .', 'E5 - - - D5 - - - . . . . A4 . C#5 .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('D4', 'F4', 'A4'), ar('C#4', 'E4', 'A4'), ar('D4', 'F4', 'A4'), ar('C#4', 'E4', 'A4'),
          ar('C4', 'F4', 'A4'), ar('D4', 'G4', 'Bb4'), ar('C#4', 'E4', 'A4'), ar('D4', 'F4', 'A4')) },
        { wave: 'tri', vol: 0.09, notes: j(r('D3 . . D3 A2 . D3 .', 2), r('A2 . . A2 E2 . A2 .', 2), r('D3 . . D3 A2 . D3 .', 2), r('A2 . . A2 E2 . A2 .', 2),
          r('F2 . . F2 C3 . F2 .', 2), r('G2 . . G2 D3 . G2 .', 2), r('A2 . . A2 E2 . A2 .', 2), 'D3 . . D3 A2 . D3 . D3 . . . A2 . C#3 .') },
        { noise: 1, vol: 0.014, notes: r('x . . x X . x . x . . x X . x x', 8) }
      ]
    },
    // Moon Garden: low gravity. Long notes float up and drift slowly
    // down, over C with a sharpened fourth (F#), the sound of wonder;
    // the slowest step of any tune, so even the music feels weightless
    moon: {
      step: 0.17,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('E6 - - - - - - - D6 - - - B5 - - -', 'F#5 - - - A5 - - - D6 - - - - - - -', 'B5 - - - - - - - G5 - - - E5 - - -', 'F#5 - - - A5 - - - E6 - - - D6 - - -',
          'E6 - - - - - - - D6 - - - B5 - - -', 'A5 - - - D6 - - - F#6 - - - - - - -', 'E6 - - - - - - - D6 - - - B5 - - -', 'A5 - - - - - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(ar('C5', 'G5', 'B5', 'E5'), ar('D5', 'A5', 'C6', 'F#5'), ar('E5', 'B5', 'D6', 'G5'), ar('D5', 'A5', 'C6', 'F#5'),
          ar('C5', 'G5', 'B5', 'E5'), ar('D5', 'A5', 'C6', 'F#5'), ar('E5', 'B5', 'D6', 'G5'), ar('D5', 'A5', 'C6', 'F#5')) },
        { wave: 'tri', vol: 0.08, notes: j('C2 - - - - - - - G2 - - - C3 - - -', 'D2 - - - - - - - A2 - - - D3 - - -', 'E2 - - - - - - - B2 - - - E3 - - -', 'D2 - - - - - - - A2 - - - D3 - - -',
          'C2 - - - - - - - G2 - - - C3 - - -', 'D2 - - - - - - - A2 - - - D3 - - -', 'E2 - - - - - - - B2 - - - E3 - - -', 'D2 - - - - - - - A2 - - - - - - -') },
        { noise: 1, vol: 0.008, notes: r('x . . . . . . . X . . . . . x .', 8) }
      ]
    },
    // Clockwork Tower: B minor, wound up and busy. The noise track is the
    // clock itself (tick, tock), the arpeggio is the gears turning and
    // the bass swings back and forth like a pendulum
    clock: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('B5 . B5 . D6 . B5 . C#6 . C#6 . A#5 . F#5 .', 'G5 . G5 . B5 . G5 . A5 . A5 . F#5 . D5 .', 'E5 . G5 . B5 . E6 . D6 . C#6 . B5 . G5 .', 'A#5 - - - C#6 - - - F#6 - - - . . . .',
          'B5 . B5 . D6 . B5 . C#6 . C#6 . A#5 . F#5 .', 'G5 . G5 . B5 . G5 . D6 . E6 . F#6 . G6 .', 'E6 . D6 . C#6 . B5 . A#5 . B5 . C#6 . A#5 .', 'B5 - - - F#5 - - - B4 - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(r('B3 D4 F#4 D4', 2), r('A#3 C#4 F#4 C#4', 2), r('B3 D4 G4 D4', 2), r('A3 D4 F#4 D4', 2), ar('B3', 'E4', 'G4'), ar('A#3', 'C#4', 'F#4'),
          r('B3 D4 F#4 D4', 2), r('A#3 C#4 F#4 C#4', 2), ar('B3', 'D4', 'G4'), r('B3 E4 G4 E4', 2), r('A#3 C#4 F#4 C#4', 2), ar('B3', 'D4', 'F#4')) },
        { wave: 'tri', vol: 0.085, notes: j('B2 . F#2 . B2 . F#2 . F#2 . C#3 . F#2 . C#3 .', 'G2 . D3 . G2 . D3 . D3 . A2 . D3 . A2 .', b8('E2', 'B2'), b8('F#2', 'C#3'),
          'B2 . F#2 . B2 . F#2 . F#2 . C#3 . F#2 . C#3 .', b8('G2', 'D3'), 'E2 . B2 . E2 . B2 . F#2 . C#3 . F#2 . C#3 .', b8('B2', 'F#2')) },
        { noise: 1, vol: 0.012, notes: r('x . . . X . . .', 16) }
      ]
    },
    // Magpie's Sky Ship: brave and quick. Dotted notes that swing like a
    // cutlass, a bass at full gallop, and A minor that bursts out into
    // C major, because the best pirates are the cheerful ones
    ship: {
      step: 0.085,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('A5 - - E5 A5 . C6 . E6 - - - D6 . C6 .', 'C6 - - A5 F5 . A5 . C6 - - - D6 . C6 .', 'B5 - - G5 D5 . G5 . B5 - - - C6 . D6 .', 'E6 - - - C6 . . . B5 - - - G#5 . . .',
          'A5 - - F5 A5 . C6 . F6 - - - E6 . D6 .', 'E6 - - C6 G5 . C6 . E6 - - - D6 . C6 .', 'D6 - - A5 F5 . A5 . B5 - - - G#5 . B5 .', 'A5 - - - - - . . A4 . . . E5 . G#5 .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('A4', 'C5', 'E5'), ar('A4', 'C5', 'F5'), ar('G4', 'B4', 'D5'), 'G4 C5 E5 C5 G4 C5 E5 C5 G#4 B4 E5 B4 G#4 B4 E5 B4',
          ar('A4', 'C5', 'F5'), ar('G4', 'C5', 'E5'), 'A4 D5 F5 D5 A4 D5 F5 D5 G#4 B4 E5 B4 G#4 B4 E5 B4', ar('A4', 'C5', 'E5')) },
        { wave: 'tri', vol: 0.085, notes: j(r('A2 . A2 A2 E3 . E3 E3', 2), r('F2 . F2 F2 C3 . C3 C3', 2), r('G2 . G2 G2 D3 . D3 D3', 2), 'C3 . C3 C3 G2 . G2 G2 E2 . E2 E2 B2 . B2 B2',
          r('F2 . F2 F2 C3 . C3 C3', 2), r('C3 . C3 C3 G2 . G2 G2', 2), 'D3 . D3 D3 A2 . A2 A2 E2 . E2 E2 B2 . B2 B2', 'A2 . A2 A2 E3 . E3 E3 A2 . . . E2 . G#2 .') },
        { noise: 1, vol: 0.015, notes: r('x . x x X . x x x . x x X . x x', 8) }
      ]
    },
    // Captain Magpie: the second boss, as urgent as the first but its own
    // tune. G minor stabbed out in threes (three, three, two) with the
    // bass hammering the same rhythm, and a run down the scale at the
    // end that throws you straight back into the fight
    boss2: {
      step: 0.08,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('Bb5 . . A5 . . G5 . D6 . . C6 . . Bb5 .', 'A5 . . G5 . . F#5 . D5 . . E5 . . F#5 .', 'Bb5 . . A5 . . G5 . D6 . . C6 . . Bb5 .', 'Eb6 . . D6 . . C6 . Bb5 . . A5 . . F#5 .',
          'C6 . . Bb5 . . G5 . Eb6 . . D6 . . C6 .', 'D6 . . C6 . . Bb5 . G6 . . F6 . . D6 .', 'Eb6 . . D6 . . C6 . A5 . . Bb5 . . C6 .', 'D6 . D6 . D6 . C6 . Bb5 . A5 . G5 . A5 .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('G4', 'Bb4', 'D5'), ar('F#4', 'A4', 'D5'), ar('G4', 'Bb4', 'D5'), 'G4 Bb4 Eb5 Bb4 G4 Bb4 Eb5 Bb4 F#4 A4 D5 A4 F#4 A4 D5 A4',
          ar('G4', 'C5', 'Eb5'), ar('G4', 'Bb4', 'D5'), 'G4 Bb4 Eb5 Bb4 G4 Bb4 Eb5 Bb4 F#4 A4 D5 A4 F#4 A4 D5 A4', ar('F#4', 'A4', 'D5')) },
        { wave: 'tri', vol: 0.09, notes: j(r('G2 . . G2 . . G2 G3', 2), r('D2 . . D2 . . D2 D3', 2), r('G2 . . G2 . . G2 G3', 2), 'Eb2 . . Eb2 . . Eb2 Eb3 D2 . . D2 . . D2 D3',
          r('C2 . . C2 . . C2 C3', 2), r('G2 . . G2 . . G2 G3', 2), 'Eb2 . . Eb2 . . Eb2 Eb3 D2 . . D2 . . D2 D3', r('D2 . . D2 . . D2 D3', 2)) },
        { noise: 0, vol: 0.011, notes: r('X . x X . x X x', 16) }
      ]
    },

    /* ---- The Big Trip: the third land, levels 21 to 30 ----------------- */

    // the Big Trip's map: a slow café waltz in G, three beats to the bar
    // (twelve steps, as on the reef), the calmest tune in the land. The
    // tune wavers like an accordion, a reedier voice follows just under
    // it, and the left hand goes oom-pah-pah. C to C minor is the Paris in it
    map3: {
      step: 0.13,
      tracks: [
        { duty: 0.5, vol: 0.024, vib: true, notes: j('B5 - - - - - D6 - - - B5 -', 'G5 - - - - - - - E5 - G5 -', 'A5 - - - - - C6 - - - E6 -', 'Eb6 - - - - - - - C6 - G5 -',
          'D6 - - - - - B5 - - - G5 -', 'G#5 - - - - - B5 - - - D6 -', 'C6 - - - - - A5 - - - F#5 -', 'G5 - - - - - - - . . . .') },
        { duty: 0.25, vol: 0.009, notes: j('G5 - - - - - B5 - - - G5 -', 'E5 - - - - - - - B4 - E5 -', 'E5 - - - - - G5 - - - C6 -', 'C6 - - - - - - - G5 - Eb5 -',
          'B5 - - - - - G5 - - - D5 -', 'E5 - - - - - G#5 - - - B5 -', 'A5 - - - - - F#5 - - - D5 -', 'B4 - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j('. . . . G4 . . . B4 . . .', '. . . . G4 . . . B4 . . .', '. . . . E4 . . . G4 . . .', '. . . . Eb4 . . . G4 . . .',
          '. . . . D4 . . . G4 . . .', '. . . . D4 . . . G#4 . . .', '. . . . E4 . . . F#4 . . .', '. . . . G4 . . . B4 . . .') },
        { wave: 'tri', vol: 0.085, notes: j('G2 - - . . . . . . . . .', 'E2 - - . . . . . . . . .', 'C3 - - . . . . . . . . .', 'C3 - - . . . . . . . . .',
          'B2 - - . . . . . . . . .', 'E2 - - . . . . . . . . .', 'A2 - - . . . . . D3 - - .', 'G2 - - . . . . . D3 - - .') }
      ]
    },
    // The Ferry: a bright, breezy 6/8 in E, quicker than the harbour's
    // shanty. The tune climbs like a gust and coasts down again, and the
    // thin voice rolls up and down the chord all the way, the swell
    // under the deck
    ferry: {
      step: 0.095,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('E5 - G#5 - B5 - - - A5 - G#5 -', 'C#6 - - - B5 - A5 - - - E5 -', 'G#5 - - - - - F#5 - G#5 - B5 -', 'F#5 - - - - - - - - - . .',
          'E5 - G#5 - B5 - C#6 - - - B5 -', 'E6 - - - C#6 - A5 - - - C#6 -', 'D#6 - - - F#6 - B5 - - - A5 -', 'G#5 - - - - - E5 - - - . .') },
        { duty: 0.125, vol: 0.01, notes: j('E4 - G#4 - B4 - E5 - B4 - G#4 -', 'E4 - A4 - C#5 - E5 - C#5 - A4 -', 'E4 - G#4 - B4 - E5 - B4 - G#4 -', 'D#4 - F#4 - B4 - D#5 - B4 - F#4 -',
          'E4 - G#4 - B4 - E5 - B4 - G#4 -', 'E4 - A4 - C#5 - E5 - C#5 - A4 -', 'D#4 - F#4 - A4 - B4 - A4 - F#4 -', 'E4 - G#4 - B4 - E5 - B4 - G#4 -') },
        { wave: 'tri', vol: 0.09, notes: j('E2 - - - - . B2 - - - - .', 'A2 - - - - . E2 - - - - .', 'G#2 - - - - . B2 - - - - .', 'B2 - - - - . F#2 - - - - .',
          'E2 - - - - . B2 - - - - .', 'A2 - - - - . C#3 - - - - .', 'B2 - - - - . A2 - - - - .', 'G#2 - - - - . E2 - - - - .') },
        { noise: 1, vol: 0.011, notes: r('x . x . x . X . . . x .', 8) }
      ]
    },
    // Sunflower Fields: a skipping tune in F, every beat a long note and
    // a short one, over a bass as steady as a farm track. The thin voice
    // turns three notes against four, the windmill's sails
    fields: {
      step: 0.1,
      tracks: [
        { duty: 0.5, vol: 0.026, notes: j('A5 - - G5 A5 - - C6 F6 - - - - - C6 -', 'Bb5 - - D6 F6 - - Eb6 D6 - - Bb5 G5 - - -', 'C6 - - A5 F6 - - E6 C6 - - Bb5 A5 - - -', 'G5 - - - - - . . E5 - - G5 Bb5 - C6 -',
          'A5 - - G5 A5 - - C6 F6 - - - - - C6 -', 'D6 - - A5 F6 - - E6 D6 - - - A5 - - -', 'Bb5 - - A5 G5 - - Bb5 C6 - - Bb5 G5 - E5 -', 'F5 - - - - - - - . . . . . . . .') },
        { duty: 0.125, vol: 0.01, notes: j('F4 . A4 . C5 . F4 . A4 . C5 . F4 . A4 .', 'F4 . Bb4 . D5 . F4 . Bb4 . D5 . F4 . Bb4 .', 'F4 . A4 . C5 . F4 . A4 . C5 . F4 . A4 .', 'E4 . G4 . Bb4 . E4 . G4 . Bb4 . E4 . G4 .',
          'F4 . A4 . C5 . F4 . A4 . C5 . F4 . A4 .', 'F4 . A4 . D5 . F4 . A4 . D5 . F4 . A4 .', 'G4 . Bb4 . D5 . G4 . E4 . G4 . Bb4 . E4 .', 'F4 . A4 . C5 . F4 . A4 . C5 . F4 . A4 .') },
        { wave: 'tri', vol: 0.09, notes: j('F2 - - . C3 - - . F2 - - . C3 - - .', 'Bb2 - - . F2 - - . Bb2 - - . F2 - - .', 'F2 - - . C3 - - . F2 - - . C3 - - .', 'C3 - - . G2 - - . C3 - - . Bb2 - - .',
          'F2 - - . C3 - - . F2 - - . C3 - - .', 'D3 - - . A2 - - . D3 - - . A2 - - .', 'G2 - - . D3 - - . C3 - - . G2 - - .', 'F2 - - . C3 - - . F2 - - . . . . .') },
        { noise: 1, vol: 0.012, notes: r('x . . x X . . . x . . x X . . .', 8) }
      ]
    },
    // Market Village: a bouncy musette in C. The bass walks every beat
    // and the thin voice answers on every 'and', like an accordion's left
    // hand; the tune keeps hopping up to its notes from a step below, and
    // F to F minor gives it a wink near the end
    village: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('E5 - - G5 C6 . . B5 C6 . G6 . E6 . C6 .', 'G5 - - B5 D6 . . C#6 D6 . F6 . D6 . B5 .', 'A5 - - C6 E6 . . D#6 E6 . C6 . A5 . . .', 'F#5 - - A5 C6 . . A5 B5 . D6 . F6 . D6 .',
          'E5 - - G5 C6 . . B5 C6 . G6 . E6 . C6 .', 'F5 - - A5 C6 . . B5 C6 . F6 . Ab5 . . .', 'G5 - - C6 E6 . . G6 F6 . . . D6 . B5 .', 'C6 - . . G5 . C6 . E6 . . . . . . .') },
        { duty: 0.125, vol: 0.01, notes: j('. . E4 . . . G4 . . . E4 . . . G4 .', '. . D4 . . . F4 . . . D4 . . . F4 .', '. . E4 . . . A4 . . . E4 . . . A4 .', '. . F#4 . . . C5 . . . F4 . . . B4 .',
          '. . E4 . . . G4 . . . E4 . . . G4 .', '. . F4 . . . A4 . . . F4 . . . Ab4 .', '. . E4 . . . G4 . . . F4 . . . B4 .', '. . E4 . . . G4 . . . E4 . . . . .') },
        { wave: 'tri', vol: 0.09, notes: j('C3 - . . G2 - . . C3 - . . G2 - . .', 'G2 - . . D3 - . . G2 - . . B2 - . .', 'A2 - . . E3 - . . A2 - . . E3 - . .', 'D3 - . . A2 - . . G2 - . . B2 - . .',
          'C3 - . . G2 - . . C3 - . . G2 - . .', 'F2 - . . C3 - . . F2 - . . Ab2 - . .', 'G2 - . . C3 - . . G2 - . . B2 - . .', 'C3 - . . G2 - . . C2 - . . . . . .') },
        { noise: 1, vol: 0.013, notes: r('x . . x X . x . x . . x X . x .', 8) }
      ]
    },
    // The Bakery: warm and a bit silly, in Bb. The tune kneads the same
    // note three times and then pops up like dough, the bass plops down
    // and bounces up the octave, and the thin voice never stops working
    // the dough: push, fold, push
    bakery: {
      step: 0.095,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('D5 . D5 . D5 - . F5 - . Bb5 - - - . .', 'C5 . C5 . C5 - . Eb5 - . A5 - - - . .', 'D5 . D5 . D5 - . F5 - . Bb5 - D6 - F6 -', 'Eb6 - . . Bb5 - . G5 A5 - . . C6 - . .',
          'D5 . D5 . D5 - . G5 - . Bb5 - - - . .', 'Eb5 . Eb5 . Eb5 - . G5 - . C6 - - - . .', 'F5 . A5 . C6 - . Eb6 - . D6 - C6 - A5 -', 'Bb5 - . . F5 - . . Bb4 - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(r('D4 F4 D4 .', 4), r('C4 Eb4 C4 .', 4), r('D4 F4 D4 .', 4), 'Eb4 G4 Eb4 . Eb4 G4 Eb4 . C4 Eb4 C4 . C4 Eb4 C4 .',
          r('D4 G4 D4 .', 4), r('Eb4 G4 Eb4 .', 4), r('C4 Eb4 C4 .', 4), r('D4 F4 D4 .', 4)) },
        { wave: 'tri', vol: 0.09, notes: j('Bb2 - . . Bb3 - . . F2 - . . F3 - . .', 'F2 - . . F3 - . . C2 - . . C3 - . .', 'Bb2 - . . Bb3 - . . F2 - . . F3 - . .', 'Eb2 - . . Eb3 - . . F2 - . . F3 - . .',
          'G2 - . . G3 - . . D2 - . . D3 - . .', 'C2 - . . C3 - . . G2 - . . G3 - . .', 'F2 - . . F3 - . . C2 - . . C3 - . .', 'Bb2 - . . F2 - . . Bb1 - - - . . . .') },
        { noise: 1, vol: 0.012, notes: r('x . x . X . . . x . x . X . . .', 8) }
      ]
    },
    // Cheese Caves: E minor, but with a bright C# (Dorian) so the dark is
    // a cosy one. Every note is plucked short, the tune keeps rolling round
    // a little turn like a wheel of cheese, the bass bowls along in threes,
    // and the soft long notes are the lantern light
    cheese: {
      step: 0.12,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('E5 . . . G5 A5 G5 F#5 G5 . . . B5 . . .', 'A5 . . . C#6 D6 C#6 B5 C#6 . . . E6 . . .', 'B5 . . . D6 E6 D6 C#6 D6 . . . G5 . . .', 'A5 . . . F#5 G5 A5 G5 F#5 . . . D5 . . .',
          'E6 . . . C6 . . . G5 . B5 . A5 . . .', 'C#6 . . . E6 F#6 E6 D6 E6 . . . A5 . . .', 'D#6 . . . F#6 G6 F#6 E6 F#6 . . . B5 . . .', 'E6 . . . B5 . . . G5 . . . B4 . . .') },
        { duty: 0.5, vol: 0.008, notes: j('B4 - - - - - - - G4 - - - - - - -', 'A4 - - - - - - - C#5 - - - - - - -', 'B4 - - - - - - - G4 - - - - - - -', 'A4 - - - - - - - F#4 - - - - - - -',
          'G4 - - - - - - - E4 - - - - - - -', 'A4 - - - - - - - C#5 - - - - - - -', 'A4 - - - - - - - D#5 - - - - - - -', 'G4 - - - - - - - B4 - - - - - - -') },
        { wave: 'tri', vol: 0.09, notes: j('E2 . . B2 . . E3 . E2 . . B2 . . G2 .', 'A2 . . E3 . . A3 . A2 . . E3 . . C#3 .', 'E2 . . B2 . . E3 . E2 . . B2 . . G2 .', 'D2 . . A2 . . D3 . D2 . . A2 . . F#2 .',
          'C2 . . G2 . . C3 . C2 . . G2 . . E2 .', 'A2 . . E3 . . A3 . A2 . . E3 . . C#3 .', 'B1 . . F#2 . . B2 . B1 . . F#2 . . D#2 .', 'E2 . . B2 . . E3 . E2 . . B2 . . B1 .') },
        { noise: 0, vol: 0.006, notes: r('. . x . . . . . . . . . . . x .', 8) }
      ]
    },
    // Paris Rooftops: D minor on tiptoe. The tune creeps on short notes,
    // freezes, then hops a chimney (the leap at the end of the bar, with a
    // snare on the jump); halfway it stops on long notes to watch the
    // sunset. The thin voice tiptoes in pairs and the bass creeps along
    roofs: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('D5 . A4 . F5 . A4 . . . . . A5 D6 - -', 'C6 . . . G5 . A5 . F5 . D5 . . . . .', 'G5 . D5 . Bb5 . D5 . . . . . D6 G6 - -', 'G6 . . . E6 . C#6 . A5 . . . E5 . . .',
          'D5 . A4 . F5 . A4 . . . . . A5 D6 - -', 'D6 - - - F6 - - - D6 - Bb5 - F5 - - -', 'E5 - G5 - Bb5 - - - A5 - C#6 - E6 - - -', 'F6 . . . E6 . . . D6 . . . . . . .') },
        { duty: 0.125, vol: 0.009, notes: j('. . A4 F4 . . . . . . A4 F4 . . . .', '. . A4 F4 . . . . . . A4 F4 . . . .', '. . Bb4 G4 . . . . . . Bb4 G4 . . . .', '. . C#5 A4 . . . . . . G4 E4 . . . .',
          '. . A4 F4 . . . . . . A4 F4 . . . .', '. . D5 Bb4 . . . . . . F4 D4 . . . .', '. . E4 G4 . . . . . . C#5 G4 . . . .', '. . A4 F4 . . . . . . . . . . . .') },
        { wave: 'tri', vol: 0.085, notes: j('D3 - . . A2 - . . D3 - . . A2 - . .', 'D3 - . . A2 - . . D3 - . . A2 - . .', 'G2 - . . D3 - . . G2 - . . D3 - . .', 'A2 - . . E3 - . . A2 - . . C#3 - . .',
          'D3 - . . A2 - . . D3 - . . A2 - . .', 'Bb2 - . . F2 - . . Bb2 - . . D3 - . .', 'G2 - . . D3 - . . A2 - . . E3 - . .', 'D3 - . . A2 - . . D2 - . . . . . .') },
        { noise: 1, vol: 0.01, notes: r('x . . . . . x . x . . . X . . .', 8) }
      ]
    },
    // The Metro: E minor at full steam. The bass and the snare chug
    // together (CHUG, a-chugga), the tune drives on with two repeated notes
    // and a leap, then sings long notes over the rattle, and the thin voice
    // clatters along like wheels on the rails
    metro: {
      step: 0.085,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('B5 - . B5 - . E6 - D6 - B5 - - - G5 -', 'C6 - . C6 - . E6 - D6 - C6 - - - G5 -', 'D6 - . D6 - . F#6 - E6 - D6 - - - A5 -', 'D#6 - . D#6 - . F#6 - A6 - F#6 - D#6 - B5 -',
          'G6 - - - - - - - E6 - - - B5 - G5 -', 'C6 - - - - - - - G6 - - - E6 - C6 -', 'F#6 - - - - - - - E6 - - - D6 - A5 -', 'D#6 - - - - - - - F#6 - - - B5 - - -') },
        { duty: 0.125, vol: 0.01, notes: j(ar('E4', 'G4', 'B4'), ar('E4', 'G4', 'C5'), ar('D4', 'F#4', 'A4'), ar('D#4', 'F#4', 'B4'),
          ar('E4', 'G4', 'B4'), ar('E4', 'G4', 'C5'), ar('D4', 'F#4', 'A4'), ar('D#4', 'F#4', 'A4')) },
        { wave: 'tri', vol: 0.085, notes: j(r('E2 . E2 E3', 4), r('C2 . C2 C3', 4), r('D2 . D2 D3', 4), r('B1 . B1 B2', 4),
          r('E2 . E2 E3', 4), r('C2 . C2 C3', 4), r('D2 . D2 D3', 4), r('B1 . B1 B2', 4)) },
        { noise: 1, vol: 0.012, notes: r('X . x x x . x x X . x x x . x x', 8) }
      ]
    },
    // Eiffel Tower: C major, climbing. The bass climbs a step every bar, a
    // whole octave by the top, the thin voice runs up the chord like
    // stairs, and the tune holds each brave long note a step higher than
    // the last, with a snare roll at the summit
    tower: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('G5 - - - - - - - - - - . E5 - - G5', 'A5 - - - - - - - - - - . F5 - - A5', 'B5 - - - - - - - - - - . G5 - - B5', 'C6 - - - - - - - A5 - C6 - F6 - - -',
          'D6 - - - - - - - B5 - D6 - G6 - - -', 'E6 - - - - - - - C6 - E6 - A6 - - -', 'G6 - - - - - F6 - D6 - - - B5 - D6 -', 'C6 - - - - - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.01, notes: j(r('C4 . E4 . G4 . C5 .', 2), r('D4 . F4 . A4 . D5 .', 2), r('E4 . G4 . B4 . E5 .', 2), r('F4 . A4 . C5 . F5 .', 2),
          r('G4 . B4 . D5 . G5 .', 2), r('A4 . C5 . E5 . A5 .', 2), r('B4 . D5 . G5 . B5 .', 2), r('C5 . E5 . G5 . C6 .', 2)) },
        { wave: 'tri', vol: 0.09, notes: j(r('C2 .', 8), r('D2 .', 8), r('E2 .', 8), r('F2 .', 8), r('G2 .', 8), r('A2 .', 8), r('B2 .', 8), r('C3 .', 8)) },
        { noise: 1, vol: 0.013, notes: j(r('x . x . X . x . x . x . X . x .', 6), 'x . x . X . x . x . x . X . X X', 'X . . . X . . . X . X . X X X X') }
      ]
    },
    // Disneyland Paris: the happiest tune in the game, a parade in D. The
    // tune drops down the chord and races back up, then calls out like a
    // fanfare; the bass marches, the drum rattles, and the thin voice
    // sparkles all the way
    magic: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.028, notes: j('F#6 - - D6 A5 - - - - - C#6 D6 E6 - F#6 -', 'G6 - - - - - D6 - E6 - - - D6 - B5 -', 'E6 - - B5 G#5 - - - - - B5 C#6 D6 - E6 -', 'A6 - - - - - E6 - C#6 - - - A5 - C#6 -',
          'F#6 - - - A6 - - - F#6 - D6 - A5 - D6 -', 'D#6 - - - F#6 - - - A6 - - - F#6 - D#6 -', 'E6 - - - G6 - - - C#6 - - - E6 - G6 -', 'F#6 - - - - - - - D6 - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(ar('D5', 'F#5', 'A5'), ar('D5', 'G5', 'B5'), ar('D5', 'G#5', 'B5'), ar('C#5', 'E5', 'A5'),
          ar('D5', 'F#5', 'A5'), ar('D#5', 'F#5', 'A5'), 'E5 G5 B5 G5 E5 G5 B5 G5 C#5 E5 G5 E5 C#5 E5 G5 E5', ar('D5', 'F#5', 'A5')) },
        { wave: 'tri', vol: 0.09, notes: j('D3 - . . A2 - . . D3 - . . A2 - . .', 'G2 - . . D3 - . . G2 - . . D3 - . .', 'E2 - . . B2 - . . E2 - . . G#2 - . .', 'A2 - . . E2 - . . A2 - . . C#3 - . .',
          'D3 - . . A2 - . . D3 - . . A2 - . .', 'B2 - . . F#2 - . . B2 - . . D#3 - . .', 'E2 - . . B2 - . . A2 - . . C#3 - . .', 'D3 - . . A2 - . . D2 - . . . . . .') },
        { noise: 1, vol: 0.015, notes: r('X . x x x . x . X . x x x . x .', 8) }
      ]
    },
    // Fireworks Night: C# minor, hushed and a little jumpy. Long notes
    // reach up in pairs like eyes to the sky, the bass beats like a heart,
    // high glints of light flicker, and twice a firework goes off: a run
    // whooshing up and a pop as it bursts. The D major (a step above C#)
    // is the fairy-tale shiver
    night: {
      step: 0.12,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('G#5 - - - - - - - E6 - - - . . . .', 'C#6 - - - - - - - E6 - - - . . . .', 'A5 - - - - - - - F#6 - - - . . . .', 'C6 - - - - - - - D#6 - - - . . . .',
          'G#5 - - - - - - - E6 - - - . . . .', 'C#6 - - - - - - - A6 - - - . . . .', 'F#6 - - - - - - - D6 - - - A5 - - -', 'C6 - - - - - - - D#6 - - - . . . .') },
        { duty: 0.125, vol: 0.008, notes: j('. . G#6 . . . C#6 . . . G#6 . . . . E6', '. . A6 . . . E6 . . . C#6 . . . . A5', '. . F#6 . . . A6 . . . C#6 . . . A6 .', '. . . . . . . . G#4 C5 D#5 F#5 G#5 C6 D#6 G#6',
          '. . G#6 . . . C#6 . . . G#6 . . . . E6', '. . E6 . . . A6 . . . C#6 . . . E6 .', '. . A6 . . . D6 . . . F#6 . . . D6 .', '. . . . . . . . G#4 C5 D#5 F#5 G#5 C6 D#6 G#6') },
        { wave: 'tri', vol: 0.08, notes: j('C#3 - C#3 - . . . . G#2 - G#2 - . . . .', 'A2 - A2 - . . . . E2 - E2 - . . . .', 'F#2 - F#2 - . . . . C#3 - C#3 - . . . .', 'G#2 - G#2 - . . . . D#2 - D#2 - . . . .',
          'C#3 - C#3 - . . . . G#2 - G#2 - . . . .', 'A2 - A2 - . . . . E2 - E2 - . . . .', 'D3 - D3 - . . . . A2 - A2 - . . . .', 'G#2 - G#2 - . . . . G#2 - G#2 - . . . .') },
        { noise: 1, vol: 0.008, notes: j('X . x . . . x . . . x . . . x .', r('. . x . . . x . . . x . . . x .', 3), 'X . x . . . x . . . x . . . x .', r('. . x . . . x . . . x . . . x .', 3)) }
      ]
    },
    // Rascal the Fox: the third boss, a cheeky chase in F minor. The tune
    // darts to and fro round a high note like a fox dodging, sticks its
    // tongue out (a quick note a step up and straight back), then bursts
    // into A flat major, because he's having far too much fun
    boss3: {
      step: 0.08,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('C6 . F5 . C6 . Ab5 . C6 . G5 . C6 . F5 .', 'E5 . G5 . Bb5 . . . C6 . . Db6 C6 . . .', 'C6 . F5 . C6 . Ab5 . C6 . G5 . C6 . F6 .', 'F6 . Db6 . Ab5 . . . G5 . E5 . C5 . . .',
          'Eb6 . Ab5 . Eb6 . C6 . Eb6 . Bb5 . Eb6 . Ab5 .', 'Eb6 . Bb5 . G5 . . . G6 . . Ab6 G6 . . .', 'F6 . Db6 . Ab5 . Db6 . F6 . Db6 . Ab5 . F5 .', 'E6 . C6 . G5 . Bb5 . C6 . Db6 . C6 . . .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('F4', 'Ab4', 'C5'), ar('E4', 'G4', 'Bb4'), ar('F4', 'Ab4', 'C5'), 'F4 Ab4 Db5 Ab4 F4 Ab4 Db5 Ab4 E4 G4 C5 G4 E4 G4 Bb4 G4',
          ar('Eb4', 'Ab4', 'C5'), ar('Eb4', 'G4', 'Bb4'), ar('F4', 'Ab4', 'Db5'), ar('E4', 'G4', 'Bb4')) },
        { wave: 'tri', vol: 0.09, notes: j(r('F2 . . F2 F3 . F2 .', 2), r('C2 . . C2 C3 . C2 .', 2), r('F2 . . F2 F3 . F2 .', 2), 'Db2 . . Db2 Db3 . Db2 . C2 . . C2 C3 . C2 .',
          r('Ab2 . . Ab2 Ab3 . Ab2 .', 2), r('Eb2 . . Eb2 Eb3 . Eb2 .', 2), r('Db2 . . Db2 Db3 . Db2 .', 2), r('C2 . . C2 C3 . C2 .', 2)) },
        { noise: 1, vol: 0.012, notes: r('x . x x X . x . x x . x X . x x', 8) }
      ]
    },

    /* ---- Holiday!: the fourth land, levels 31 to 35 -------------------- */

    // the Holiday's map: a lazy afternoon in A, the calmest tune in the
    // land. Every bar but one leans up a step onto its note, like a
    // stretch in the sun, then drifts off; the soft major sevenths are the
    // warm haze, the thin voice plucks a ukulele twice a bar and the long
    // notes waver like a steel guitar
    map4: {
      step: 0.135,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('G#5 - - - A5 - - - - - E5 - C#5 - - -', 'E5 - - - F#5 - - - - - C#6 - A5 - - -', 'C#6 - - - D6 - - - - - F#5 - A5 - - -', 'B5 - - - - - A5 - G#5 - - - - - . .',
          'G#5 - - - A5 - - - - - C#6 - E6 - - -', 'B5 - - - C#6 - - - - - G#5 - E5 - - -', 'A5 - - - B5 - - - - - D6 - B5 - G#5 -', 'A5 - - - - - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j('. . . . . . C#5 E5 . . . . . . G#4 C#5', '. . . . . . C#5 E5 . . . . . . A4 C#5', '. . . . . . F#4 A4 . . . . . . A4 D5', '. . . . . . B4 E5 . . . . . . G#4 B4',
          '. . . . . . C#5 E5 . . . . . . G#4 C#5', '. . . . . . G#4 B4 . . . . . . E4 G#4', '. . . . . . D5 F#5 . . . . . . G#4 D5', '. . . . . . C#5 E5 . . . . . . . .') },
        { wave: 'tri', vol: 0.08, notes: j('A2 - - - - - . . E3 - - - - - . .', 'F#2 - - - - - . . C#3 - - - - - . .', 'D3 - - - - - . . A2 - - - - - . .', 'E2 - - - - - . . B2 - - - - - . .',
          'A2 - - - - - . . E3 - - - - - . .', 'C#3 - - - - - . . G#2 - - - - - . .', 'B2 - - - - - . . E2 - - - - - . .', 'A2 - - - - - . . E2 - - - - - . .') },
        { noise: 0, vol: 0.007, notes: r('. . . . . . x . . . . . x . . .', 8) }
      ]
    },
    // O'Gliss Park: a waterpark in F, all splash and giggle. The tune
    // blows bubbles (three quick notes and a pop), giggles (tee-hee-hee),
    // then whizzes down the big slide, two octaves in one go, lands with
    // a splash, bobs back up and floats in the wave pool. The thin voice
    // blows more bubbles in between and the bass boings along in threes
    ogliss: {
      step: 0.09,
      tracks: [
        { duty: 0.5, vol: 0.026, notes: j('F5 G5 A5 . C6 . . . Bb5 C6 D6 . F6 . . .', 'E6 F6 E6 . C6 . . . E6 F6 E6 . G6 . . .', 'D5 E5 F5 . A5 . . . G5 A5 Bb5 . F6 . . .', 'G6 - - F6 E6 D6 C6 Bb5 A5 G5 F5 E5 D5 C5 Bb4 G4',
          'F4 - . . . . . . C5 . F5 . G5 . A5 .', 'D6 - - - C6 - Bb5 - F5 - - - Bb5 - C6 -', 'G5 - - - Bb5 - D6 - E6 F6 E6 . G6 . . .', 'F6 . . . C6 . A5 . F5 - - - . . . .') },
        { duty: 0.125, vol: 0.01, notes: j('. . . . C5 F5 A5 . . . . . A4 C5 F5 .', '. . . . C5 E5 G5 . . . . . E5 G5 C6 .', '. . . . D5 F5 A5 . . . . . A4 D5 F5 .', '. . . . . . . . . . . . . . . .',
          '. . C6 . . A5 . . F6 . . . . C6 . .', '. . . . D5 F5 Bb5 . . . . . Bb4 D5 F5 .', '. . . . D5 G5 Bb5 . . . . . G4 C5 E5 .', '. . . . C5 F5 A5 . . . . . A4 C5 F5 .') },
        { wave: 'tri', vol: 0.09, notes: j('F2 . . F3 . . C3 . F2 . . F3 . . C3 .', 'C2 . . C3 . . G2 . C2 . . C3 . . G2 .', 'D2 . . D3 . . A2 . D2 . . D3 . . A2 .', 'C3 . . Bb2 . . A2 . G2 . . F2 . . E2 .',
          'F2 - - - - - . . F2 . . F3 . . C3 .', 'Bb1 . . Bb2 . . F2 . Bb1 . . Bb2 . . F2 .', 'G2 . . G3 . . D3 . C2 . . C3 . . E2 .', 'F2 . . F3 . . C3 . F2 . . F3 . . C3 .') },
        { noise: 1, vol: 0.014, notes: j(r('x . x x X . x . x . x x X . x .', 3), 'x . . . x . . . x . x . x x x x', 'X . . . X . . . x . x x X . x .', r('x . x x X . x . x . x x X . x .', 3)) }
      ]
    },
    // Hossegor: surfing the big Atlantic waves, E Dorian with a twang.
    // The thin, low lead is the surf guitar: it twangs and gallops up the
    // face of a wave, then rides long notes with a wobble of the whammy
    // bar, and the second half breaks out into sunny G. The bass rolls up
    // and down like the swell, and every other bar a snare roll is the
    // wave breaking
    surf: {
      step: 0.085,
      tracks: [
        { duty: 0.125, vol: 0.026, vib: true, notes: j('E4 . E5 B4 D5 . B4 G4 A4 . E5 C#5 D5 . B4 .', 'C#5 - - - - - E5 - - - - - A5 - F#5 -', 'G4 . D5 G5 F#5 . D5 B4 C#5 . E5 D5 G5 - - -', 'A5 - - - - - B5 - A5 - E5 - F#5 - C#5 -',
          'E5 - - - - - G5 - - - - - C6 - - -', 'B5 - - - - - D6 - - - - - G5 - - -', 'F#5 - - - - - A5 - - - - - D6 - - -', 'C6 - - - - - B5 - - - G5 - A5 - D5 -') },
        { duty: 0.5, vol: 0.009, notes: j('. . B4 . . . E4 . . . E5 . . . G4 .', '. . C#5 . . . A4 . . . C#5 . . . E4 .', '. . B4 . . . E4 . . . E5 . . . G4 .', '. . C#5 . . . A4 . . . C#5 . . . E4 .',
          '. . E5 . . . C5 . . . E5 . . . G4 .', '. . D5 . . . B4 . . . D5 . . . G4 .', '. . F#5 . . . D5 . . . F#5 . . . A4 .', '. . F#5 . . . D5 . . . A4 . . . F#4 .') },
        { wave: 'tri', vol: 0.09, notes: j('E2 . G2 . B2 . D3 . E3 . B2 . G2 . B2 .', 'A2 . C#3 . E3 . F#3 . A3 . F#3 . E3 . B2 .', 'E2 . G2 . B2 . D3 . E3 . B2 . G2 . B2 .', 'A2 . C#3 . E3 . F#3 . A3 . F#3 . E3 . B2 .',
          'C2 . E2 . G2 . A2 . C3 . A2 . G2 . E2 .', 'G2 . B2 . D3 . E3 . G3 . E3 . D3 . B2 .', 'D2 . F#2 . A2 . B2 . D3 . B2 . A2 . F#2 .', 'D2 . F#2 . A2 . B2 . D3 . C3 . A2 . F#2 .') },
        { noise: 1, vol: 0.014, notes: r('x . x . X . x x x . x . X . x x x . x . X . x x x . x . X X X X', 4) }
      ]
    },
    // The bike ride: Bonnie has just learnt to ride, so this is the
    // proudest tune in the game, in B flat. Three tries, each climbing
    // higher (I can do it!), then a big open tune for the beach road.
    // The bass pushes on every beat like a foot on a pedal, the thin
    // voice goes round like the crank, and the bell rings: ding ding!
    bike: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('F5 . G5 . A5 Bb5 - - - - - . D5 . F5 .', 'G5 . A5 . Bb5 C6 - - - - - . Eb5 . G5 .', 'A5 . Bb5 . C6 D6 - - - - - . Eb6 . D6 .', 'F6 - - - C6 - A5 - - - . . . . . .',
          'D6 - - - - - F6 - - - - - D6 - Bb5 -', 'Eb6 - - - - - G5 - - - - - C6 - Bb5 -', 'Eb6 - - - - - C6 - D6 - - - - - A5 -', 'Bb5 - - - F6 - D6 - - - - - . . . .') },
        { duty: 0.125, vol: 0.01, notes: j(r('Bb3 . D4 . F4 . D4 .', 2), r('Eb4 . G4 . Bb4 . G4 .', 2), 'G3 . Bb3 . D4 . Bb3 . A3 . C4 . F4 . C4 .', 'C4 . F4 . A4 . F4 . . . . . F6 . F6 .',
          r('Bb3 . D4 . F4 . D4 .', 2), r('Eb4 . G4 . C5 . G4 .', 2), 'Eb4 . G4 . C5 . G4 . F4 . A4 . C5 . A4 .', 'Bb3 . D4 . F4 . D4 . . . . . F6 . F6 .') },
        { wave: 'tri', vol: 0.09, notes: j(r('Bb2 - . F2', 4), r('Eb3 - . Bb2', 4), j(r('G2 - . D2', 2), r('F2 - . C2', 2)), r('F2 - . C2', 4),
          r('Bb2 - . F2', 4), r('Eb3 - . Bb2', 4), j(r('C3 - . G2', 2), r('F2 - . C2', 2)), 'Bb2 - . F2 Bb2 - . F2 Bb2 - - - F2 - - -') },
        { noise: 1, vol: 0.013, notes: r('x . . x X . . x x . . x X . x x', 8) }
      ]
    },
    // Puy du Fou: knights, castles, falcons and a Viking longship, as a
    // march in D with the old flattened seventh (C), which is what makes
    // it sound like long ago. The fanfare is answered a tone lower, like a
    // second herald; then a falcon soars, cries and dives, the longship
    // rows (long, short: heave, ho) and C to D brings the knights home.
    // The thin voice drones like a hurdy-gurdy, and the drum gallops,
    // then beats time for the oars
    puydufou: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('D5 - - A4 D5 - - F#5 A5 - - - G5 - F#5 -', 'C5 - - G4 C5 - - E5 G5 - - - F5 - E5 -', 'D6 - - G6 - - - - A6 G6 D6 B5 G5 . . D6', 'C6 - - - G5 - E5 - D5 - - - - - . .',
          'G5 - - - - - E5 - B5 - - - - - A5 -', 'C6 - - - - - B5 - A5 - - - - - E5 -', 'E6 - - - - - D6 - C6 - - - - - G5 -', 'D6 - - A5 D6 - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.008, notes: j(r('A4 - - -', 4), r('G4 - - -', 4), r('G4 - - -', 4), 'G4 - - - G4 - - - A4 - - - A4 - - -',
          r('G4 - - -', 4), r('A4 - - -', 4), r('G4 - - -', 4), r('A4 - - -', 4)) },
        { wave: 'tri', vol: 0.09, notes: j('D2 - - - A2 - - - D2 - - - A2 - - -', 'C2 - - - G2 - - - C2 - - - G2 - - -', 'G2 - - - D2 - - - G2 - - - D2 - - -', 'C2 - - - G2 - - - D2 - - - A2 - - -',
          'E2 - - - - - B1 - E2 - - - - - B1 -', 'A2 - - - - - E2 - A2 - - - - - E2 -', 'C3 - - - - - G2 - C3 - - - - - G2 -', 'D2 - - - A2 - - - D2 - - - A2 - - -') },
        { noise: 0, vol: 0.012, notes: j(r('X . x x x . x x', 8), r('X . . . . . x . X . . . . . x .', 3), 'X . x x X . x x X X X X X . . .') }
      ]
    },
    // Saint-Malo: the corsairs' walled city, and the last stop before the
    // ferry home. A jolly 6/8 in G: three big calls, each a long 'Ho!'
    // and three quick steps, a swagger through E minor in threes against
    // twos, a scramble up the rigging, and home to G with the ship's bell
    // ringing twice. The thin voice is the squeezebox on the quay
    stmalo: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('D6 - - - - - B5 - C6 - A5 -', 'E6 - - - - - G6 - E6 - C6 -', 'D6 - - - - - G5 - B5 - A5 -', 'C6 - - - A5 - F#5 - - - D5 -',
          'E5 - - - B5 - - - A5 - G5 -', 'E5 - - - C6 - - - G5 - A5 -', 'F#5 - A5 - C6 - B5 - D6 - F#6 -', 'G6 - - - D6 - B5 - - - G5 -') },
        { duty: 0.125, vol: 0.01, notes: j('. . B4 . D5 . . . G4 . B4 .', '. . C5 . E5 . . . C5 . E5 .', '. . B4 . D5 . . . G4 . B4 .', '. . A4 . D5 . . . F#4 . A4 .',
          '. . G4 . B4 . . . G4 . B4 .', '. . G4 . C5 . . . G4 . C5 .', '. . A4 . C5 . . . F#4 . C5 .', '. . B4 . D5 . G6 . . . G6 .') },
        { wave: 'tri', vol: 0.09, notes: j('G2 - - - D3 - G2 - - - D3 -', 'C3 - - - G2 - C3 - - - G2 -', 'G2 - - - D3 - G2 - - - B2 -', 'D3 - - - A2 - D3 - - - F#2 -',
          'E2 - - - B2 - E2 - - - B2 -', 'C3 - - - G2 - C3 - - - G2 -', 'D3 - - - A2 - D2 - - - F#2 -', 'G2 - - - D3 - G2 - - - D2 -') },
        { noise: 1, vol: 0.013, notes: r('x . . x x . X . . x x .', 8) }
      ]
    }
  };
})();
