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
        { duty: 0.5, vol: 0.03, notes: 'C5 - G4 - E4 - . . A4 - B4 - A4 - G#4 - Bb4 - G#4 - G4 - - - - - . .' },
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
    }
  };
})();
