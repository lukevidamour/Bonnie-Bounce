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
    title: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.03, notes: j('G5 - B5 - D6 - - - B5 - D6 - G6 - - -', 'E6 - - - D6 - C6 - B5 - C6 - E6 - - -', 'D6 - C6 - B5 - A5 - F#5 - A5 - D6 - C6 -', 'B5 - G5 - D5 - G5 - B5 - - - . . . .',
          'G5 - B5 - D6 - - - E6 - D6 - B5 - G5 -', 'A5 - - - C6 - B5 - A5 - G5 - E5 - G5 -', 'F#5 - A5 - D6 - F#6 - E6 - D6 - C6 - A5 -', 'G5 - - - - - - - G6 - - - . . . .') },
        { duty: 0.125, vol: 0.012, notes: j(ar('B4', 'D5', 'G5'), ar('C5', 'E5', 'G5'), ar('A4', 'D5', 'F#5'), ar('B4', 'D5', 'G5'), ar('B4', 'D5', 'G5'), ar('C5', 'E5', 'A5'), ar('A4', 'D5', 'F#5'), ar('B4', 'D5', 'G5')) },
        { wave: 'tri', vol: 0.09, notes: j(b8('G2', 'D3'), b8('C3', 'G3'), b8('D3', 'A3'), b8('G2', 'D3'), b8('G2', 'D3'), b8('A2', 'E3'), b8('D3', 'A3'), 'G2 . D3 . G2 . D3 . G2 . A2 . B2 . D3 .') },
        { noise: 1, vol: 0.016, notes: r(DR, 8) }
      ]
    },
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
    }
  };
})();
