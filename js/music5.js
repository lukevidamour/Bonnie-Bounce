/* ==========================================================================
   music5.js — the soundtrack of the fifth land, "One Day…" (levels 36–45):
   the map, ten worlds and Queen Bee. Every tune is an original, written
   for this game, in the same format as music.js (read that header first):
   tracks of note tokens, '-' holds, '.' rests, 'x'/'X' on noise tracks.

   One thing these tunes use that the older ones don't: `sustain` on a
   track (the share of each note held at full volume before it fades, 0.7
   if unset). A low sustain makes every note ring and die away like a
   struck bell — the music box, the steel drum and the icy bells.
   ========================================================================== */
(function () {
  'use strict';
  var r = function (s, n) { var o = []; for (var i = 0; i < n; i++) o.push(s); return o.join(' '); };
  var j = function () { return Array.prototype.join.call(arguments, ' '); };
  // a four-note arpeggio in sixteenths, a bar long
  var ar = function (a, b, c, d) { return r([a, b, c, d || b].join(' '), 4); };
  // semitones, for the bees: a note's number and back again
  var NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  var NUM = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var midi = function (n) { var m = /^([A-G])([#b]?)(\d)$/.exec(n); return NUM[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] + 1) * 12; };
  var name = function (k) { return NAMES[k % 12] + (Math.floor(k / 12) - 1); };
  // a bee's buzz: the note, a semitone up, the note, a semitone down
  var bz = function (n) { var k = midi(n); return [n, name(k + 1), n, name(k - 1)].join(' '); };
  // the same note an octave or two up
  var up = function (n, o) { return name(midi(n) + 12 * o); };
  // a rainbow's arc: a chord swept up two octaves in sixteenths, and a breath
  var rise = function (a, b, c) { return [a, b, c, up(a, 1), up(b, 1), up(c, 1), up(a, 2), '.'].join(' '); };

  Object.assign(BB.SONGS, {

    /* ---- One Day…: the fifth land, levels 36 to 45 --------------------- */

    // the One Day map: a music box on Bonnie's bedside table, in E flat.
    // Every note is plucked and rings away (a low sustain), the tune climbs
    // the chord like a wish being made, and the thin voice turns the little
    // cylinder underneath. Halfway the wish reaches up a semitone into G
    // major (wonder), then A flat turns to A flat minor for a moment, the
    // wistful bit of 'one day', before the bass steps home
    map5: {
      step: 0.135,
      tracks: [
        { duty: 0.25, vol: 0.024, sustain: 0.3, notes: j('G5 - Bb5 - Eb6 - - - D6 - Eb6 - G6 - - -', 'F6 - Eb6 - C6 - - - G5 - C6 - Eb6 - - -', 'Eb6 - C6 - Ab5 - - - C6 - Eb6 - Ab6 - - -', 'G6 - F6 - D6 - - - Bb5 - - - . . . .',
          'G5 - Bb5 - Eb6 - - - F6 - G6 - Bb6 - - -', 'B6 - - - G6 - D6 - - - F6 - D6 - B5 -', 'Ab6 - - - Eb6 - C6 - B5 - - - Eb6 - - -', 'Eb6 - - - Bb5 - G5 - F5 - - - . . . .') },
        { duty: 0.125, vol: 0.009, notes: j(r('Eb4 . Bb4 . G4 . Bb4 .', 2), r('C4 . G4 . Eb4 . G4 .', 2), r('Ab3 . Eb4 . C4 . Eb4 .', 2), r('Bb3 . F4 . D4 . F4 .', 2),
          r('Eb4 . Bb4 . G4 . Bb4 .', 2), r('G3 . D4 . B3 . F4 .', 2), 'Ab3 . Eb4 . C4 . Eb4 . Ab3 . Eb4 . B3 . Eb4 .', 'Eb4 . Bb4 . G4 . Bb4 . Bb3 . F4 . D4 . F4 .') },
        { wave: 'tri', vol: 0.08, notes: j('Eb2 - - - - - - - Bb2 - - - - - - -', 'C3 - - - - - - - G2 - - - - - - -', 'Ab2 - - - - - - - Eb3 - - - - - - -', 'Bb2 - - - - - - - F2 - - - - - - -',
          'Eb2 - - - - - - - Bb2 - - - - - - -', 'G2 - - - - - - - D3 - - - - - - -', 'Ab2 - - - - - - - B2 - - - - - - -', 'Bb2 - - - - - - - Bb1 - - - - - - -') },
        { noise: 1, vol: 0.006, notes: r('. . . . x . . . . . . . x . . .', 8) }
      ]
    },
    // Pokémon Meadow: setting off down the route, in G. The tune bounces
    // on a dotted step (a skip and a hop) and keeps leaning up the chord,
    // the bass skips with it, and the thin voice walks in boots for the
    // first half and runs for the second. An F major chord (a step below
    // G) near the end is the open road; D seven turns for home
    pokemon: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('G5 - - D5 G5 - B5 - D6 - - - B5 - G5 -', 'E6 - - - D6 - C6 - G5 - - - E5 - G5 -', 'A5 - - E5 A5 - C6 - E6 - - - D6 - C6 -', 'B5 - - - A5 - - - F#5 - G5 - A5 - - -',
          'B5 - - G5 B5 - E6 - G6 - - - F#6 - E6 -', 'E6 - - C6 E6 - G6 - E6 - - - D6 - C6 -', 'F6 - - - C6 - A5 - G5 - - - C6 - E6 -', 'D6 - - - C6 - A5 - F#5 - - - A5 - - -') },
        { duty: 0.125, vol: 0.01, notes: j(r('D4 . G4 . B4 . G4 .', 2), r('E4 . G4 . C5 . G4 .', 2), r('E4 . A4 . C5 . A4 .', 2), r('D4 . F#4 . A4 . F#4 .', 2),
          ar('E4', 'G4', 'B4'), ar('E4', 'G4', 'C5'), 'F4 A4 C5 A4 F4 A4 C5 A4 E4 G4 C5 G4 E4 G4 C5 G4', ar('D4', 'F#4', 'A4', 'C5')) },
        { wave: 'tri', vol: 0.09, notes: j(r('G2 . . G2 D3 . G2 .', 2), r('C3 . . C3 G2 . C3 .', 2), r('A2 . . A2 E3 . A2 .', 2), 'D3 . . D3 A2 . D3 . D3 . . D3 A2 . F#2 .',
          r('E2 . . E2 B2 . E2 .', 2), r('C3 . . C3 G2 . C3 .', 2), 'F2 . . F2 C3 . F2 . C3 . . C3 G2 . C3 .', 'D3 . . D3 A2 . D3 . D2 . . D2 A2 . F#2 .') },
        { noise: 1, vol: 0.015, notes: j(r('x . x . X . x x x . x . X . x .', 7), 'x . x . X . x x X . X . X X X X') }
      ]
    },
    // Universal Studios: B flat, showbiz. Four bars of fanfare (ta, ta-ta
    // TAAA) with a second trumpet a third underneath, then the rollercoaster:
    // the chain lift clacks up a semitone at a time over a held F, with
    // the thin voice climbing a third below, a breath at the top, a plunge
    // two octaves down the scale, a loop-the-loop back up, and into the
    // station for the fanfare again
    universal: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('F5 . F5 F5 Bb5 - - - D6 - - - F6 - - -', 'G6 - - - Eb6 - - - Bb5 - Eb6 - G6 - F6 -', 'F5 . F5 F5 Bb5 - - - D6 . D6 D6 G6 - - -', 'G6 - E6 - C6 - - - F6 - - - - - . .',
          'F5 - - - F#5 - - - G5 - - - G#5 - - -', 'A5 - - - Bb5 - - - B5 - - - C6 . . .', 'F6 Eb6 D6 C6 Bb5 A5 G5 F5 Eb5 D5 C5 Bb4 A4 G4 F4 .', 'Bb4 D5 F5 Bb5 D6 F6 Bb6 - - - - - . . . .') },
        { duty: 0.125, vol: 0.01, notes: j('D5 . D5 D5 F5 - - - Bb5 - - - D6 - - -', 'Eb6 - - - Bb5 - - - G5 - Bb5 - Eb6 - D6 -', 'D5 . D5 D5 F5 - - - Bb5 . Bb5 Bb5 D6 - - -', 'E6 - C6 - G5 - - - C6 - - - - - . .',
          'D5 - - - D#5 - - - E5 - - - F5 - - -', 'F#5 - - - G5 - - - G#5 - - - A5 . . .', 'D6 C6 Bb5 A5 G5 F5 Eb5 D5 C5 Bb4 A4 G4 F4 Eb4 D4 .', 'D4 F4 Bb4 D5 F5 Bb5 D6 - - - - - . . . .') },
        { wave: 'tri', vol: 0.09, notes: j('Bb2 - . . F2 - . . Bb2 - . . F2 - . .', 'Eb3 - . . Bb2 - . . Eb3 - . . Bb2 - . .', 'Bb2 - . . F2 - . . G2 - . . D3 - . .', 'C3 - . . G2 - . . F2 - . . C3 - . .',
          r('F2 . F2 .', 4), 'F2 . F2 . F2 . F2 . F2 F2 F2 F2 F2 . . .', 'Bb2 - - - - - - - Bb1 - - - - - - -', 'Bb1 . Bb2 . D3 . F3 . Bb2 - - - . . . .') },
        { noise: 1, vol: 0.014, notes: j(r('X . x x x . x . X . x x x . x .', 4), r('x . x . ', 4), 'x . x . x . x . x x x x X . . .', r('x x x x', 4), 'X . . . X . . . X . X . X X . .') }
      ]
    },
    // New York at Christmas: a swing tune in G, so three steps to a beat
    // and the 'and' comes late (long, short). The bass walks a note a beat
    // with a semitone step into every chord, sleigh bells shake on the
    // swung eighths, brushes tap two and four, little bells ring high in
    // the gaps, and C to C minor is the snow starting to fall
    newyork: {
      step: 0.12,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('B5 - - D6 - B5 A5 - G5 F#5 - -', 'E5 - - G5 - B5 D6 - - B5 - -', 'C6 - - E6 - C6 B5 - A5 G5 - -', 'A5 - - F#5 - - D5 - - . . .',
          'B5 - - D6 - G6 F6 - - D6 - -', 'E6 - - G6 - E6 Eb6 - - C6 - -', 'D6 - - B5 - A5 G#5 - - B5 - -', 'C6 - - A5 - E5 F#5 - - A5 - -') },
        { duty: 0.125, vol: 0.008, sustain: 0.3, notes: j('. . . . . D6 . . . F#6 . .', '. . . . . D6 . . . E6 . .', '. . . . . E6 . . . G6 . .', '. . . . . C6 . . . F#6 A6 C7',
          '. . . . . D6 . . . F6 . .', '. . . . . G6 . . . A6 . .', '. . . . . F#6 . . . D6 . .', '. . . . . G6 . . . C6 . .') },
        { wave: 'tri', vol: 0.085, notes: j('G2 - - B2 - - D3 - - D#3 - -', 'E3 - - D3 - - B2 - - G#2 - -', 'A2 - - C3 - - E3 - - Eb3 - -', 'D3 - - C3 - - A2 - - F#2 - -',
          'G2 - - B2 - - D3 - - F3 - -', 'C3 - - E3 - - Eb3 - - C3 - -', 'B2 - - F#2 - - E2 - - G#2 - -', 'A2 - - E2 - - D2 - - F#2 - -') },
        { noise: 1, vol: 0.009, notes: r('x . x x . x x . x x . x', 8) },
        { noise: 0, vol: 0.009, notes: r('. . . X . . . . . X . .', 8) }
      ]
    },
    // Jamaica: sunny reggae in C. The lead is a steel drum (struck, ringing
    // away, and rolling on a long note), skipping in threes against the
    // beat; the thin voice strums the off-beats (chk-a, chk-a), the bass
    // lazes about with room to breathe, and the drum drops on beat three
    jamaica: {
      step: 0.115,
      tracks: [
        { duty: 0.5, vol: 0.026, sustain: 0.3, notes: j('E6 . . E6 . . D6 . C6 . . A5 . . G5 .', 'A5 . . C6 . . F6 . E6 . . C6 . . A5 .', 'G5 . . C6 . . E6 . G6 G6 G6 G6 G6 . E6 .', 'D6 - - - B5 . . G5 . . A5 . B5 - . .',
          'A6 - - - G6 . . F6 . . C6 . . . F6 .', 'G6 - - - F6 . . D6 . . B5 . . . D6 .', 'E6 . . G6 . . B6 . A6 . . E6 . . C6 .', 'F6 . . C6 . . A5 . B5 - - - D6 - . .') },
        { duty: 0.25, vol: 0.009, notes: j(r('. . E4 G4', 4), r('. . F4 A4', 4), r('. . E4 G4', 4), r('. . D4 G4', 4),
          r('. . F4 A4', 4), r('. . D4 G4', 4), j(r('. . E4 G4', 2), r('. . E4 A4', 2)), j(r('. . F4 A4', 2), r('. . D4 G4', 2))) },
        { wave: 'tri', vol: 0.09, notes: j('C3 - - - . . C3 . E3 - . . G3 - . .', 'F2 - - - . . F2 . A2 - . . C3 - . .', 'C3 - - - . . C3 . E3 - . . G3 - E3 .', 'G2 - - - . . G2 . B2 - . . D3 - B2 .',
          'F2 - - - . . F2 . A2 - . . C3 - A2 .', 'G2 - - - . . G2 . B2 - . . D3 - . .', 'E2 - - - . . B2 . A2 - - - . . E3 .', 'F2 - - - . . C3 . G2 - - - . . B2 .') },
        { noise: 1, vol: 0.012, notes: r('. . x . . . x . X . x . . . x .', 8) }
      ]
    },
    // Antarctica: crisp and wide, in F with a bright B natural (the sparkle
    // of ice). First the penguins waddle, rocking between two notes in
    // little steps, then slide on their tummies down the bass; then the
    // tune opens out into long notes across the ice with bare, open chords
    // underneath. High bells ping and fade on the off-beats all the way
    antarctica: {
      step: 0.11,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('A5 . C6 . A5 . C6 . F6 - - - E6 . C6 .', 'B5 . D6 . B5 . D6 . G6 - - - F6 . D6 .', 'A5 . C6 . F6 . A6 . G6 - - - F6 . E6 .', 'E6 . D6 . C6 . . . G5 - - - . . . .',
          'F5 - - - A5 - - - E6 - - - - - - -', 'F6 - - - - - E6 - D6 - - - A5 - - -', 'C6 - - - - - - - Bb5 - - - D6 - - -', 'F6 - - - E6 - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.009, sustain: 0.25, notes: j('. . C6 . . . G6 . . . F6 . . . C7 .', '. . D6 . . . A6 . . . G6 . . . B6 .', '. . C6 . . . G6 . . . F6 . . . A6 .', '. . G5 . . . D6 . . . C6 . . . G6 .',
          '. . D6 . . . A6 . . . E6 . . . A6 .', '. . F6 . . . C7 . . . E6 . . . A6 .', '. . C6 . . . A6 . . . D6 . . . F6 .', '. . G5 . . . C6 . . . E6 . . . G6 .') },
        { wave: 'tri', vol: 0.085, notes: j(r('F2 . C3 .', 4), r('F2 . D3 .', 4), r('F2 . C3 .', 4), 'C3 . G2 . C3 . G2 . C3 B2 A2 G2 F2 E2 . .',
          'D2 - - - - - - - A2 - - - - - - -', 'Bb1 - - - - - - - F2 - - - - - - -', 'A2 - - - - - - - G2 - - - - - - -', 'C3 - - - - - - - G2 - - - C2 - - -') },
        { noise: 1, vol: 0.011, notes: j(r('x . x . X . . . x . x . X . . .', 3), 'x . x . X . . . x x x x x x . .', r('x . . . . . . . X . . . . . x .', 4)) }
      ]
    },
    // Australia: the outback in D with a flattened seventh (C), which
    // makes it sound far away and dusty. The bass is a didgeridoo, a
    // droning low note pulsing in hops (three, three, two) with a toot
    // up high, and a reedy buzz an octave above it; the tune hops like a
    // kangaroo, then climbs long notes into the sky, step by step, and a
    // kookaburra laughs at the end of each half
    australia: {
      step: 0.095,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('D5 . . D6 . . A5 . F#5 . . A5 . . D6 .', 'E6 . . C6 . . G5 . E5 . . G5 . . C6 .', 'B5 . . D6 . . G6 . D6 . . B5 . . G5 .', 'A5 . . D6 . . F#6 - - - - - . . . .',
          'D6 - - - - - B5 . G5 . . B5 . . D6 .', 'F#6 - - - - - D6 . A5 . . D6 . . F#6 .', 'G6 - - - - - E6 . C6 . . E6 . . G6 .', 'A6 - - - G6 - E6 - C#6 - A5 - - - . .') },
        { duty: 0.5, vol: 0.009, notes: j('F#4 - - - - - - - A4 - - - - - - -', 'G4 - - - - - - - E4 - - - - - - -', 'G4 - - - - - - - B4 - - - - - - -', 'A4 - - - - - - - . . F#5 A5 B5 A5 F#5 .',
          'B4 - - - - - - - D5 - - - - - - -', 'A4 - - - - - - - F#4 - - - - - - -', 'G4 - - - - - - - E4 - - - - - - -', 'E4 - - - - - - - . . C#5 E5 G5 E5 C#5 .') },
        { wave: 'tri', vol: 0.09, notes: j(r('D2 - - D2 - - D2 - D2 - - D2 - - D2 -', 3), 'D2 - - D2 - - D2 - F#3 - - - - - D2 -',
          'G2 - - G2 - - G2 - G2 - - G2 - - G2 -', 'D2 - - D2 - - D2 - D2 - - D2 - - D2 -', 'C2 - - C2 - - C2 - C2 - - C2 - - C2 -', 'A2 - - A2 - - A2 - A2 - - G2 - - E2 -') },
        { duty: 0.125, vol: 0.007, notes: j(r('D3 - - - - - - - - - - - D3 - - -', 3), 'D3 - - - - - - - A3 - - - D3 - - -',
          'G3 - - - - - - - - - - - G3 - - -', 'D3 - - - - - - - - - - - D3 - - -', 'C3 - - - - - - - - - - - C3 - - -', 'A3 - - - - - - - - - - - E3 - - -') },
        { noise: 1, vol: 0.013, notes: r('X . . x . . x . X . . x . . x .', 8) }
      ]
    },
    // On a Rainbow: pure joy in E. The bass climbs a step every bar,
    // E to B, like walking up the arc; the thin voice sweeps up two octaves
    // of every chord and takes a breath, again and again, light as air;
    // and the tune soars on long notes, each bar a little higher, until it
    // tumbles happily down the other side and starts a new rainbow
    rainbow: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, vib: true, notes: j('E5 - - - G#5 - - - B5 - - - - - E6 -', 'C#6 - - - - - - - A5 - - - F#5 - A5 -', 'B5 - - - - - - - D#6 - - - B5 - D#6 -', 'E6 - - - - - - - C#6 - - - A5 - C#6 -',
          'F#6 - - - - - - - D#6 - - - B5 - D#6 -', 'G#6 - - - - - - - E6 - - - C#6 - E6 -', 'A6 - - - - - G#6 - F#6 - - - E6 - C#6 -', 'D#6 - - - - - - - B5 - - - . . . .') },
        { duty: 0.125, vol: 0.01, notes: j(r(rise('E4', 'G#4', 'B4'), 2), r(rise('F#4', 'A4', 'C#5'), 2), r(rise('D#4', 'G#4', 'B4'), 2), r(rise('E4', 'A4', 'C#5'), 2),
          r(rise('D#4', 'F#4', 'B4'), 2), j(rise('D#4', 'G#4', 'B4'), rise('E4', 'G#4', 'C#5')), r(rise('E4', 'A4', 'C#5'), 2), j(rise('D#4', 'F#4', 'B4'), rise('F#4', 'A4', 'B4'))) },
        { wave: 'tri', vol: 0.08, notes: j('E2 - - - - - . . B2 - - - - - . .', 'F#2 - - - - - . . C#3 - - - - - . .', 'G#2 - - - - - . . D#3 - - - - - . .', 'A2 - - - - - . . E3 - - - - - . .',
          'B2 - - - - - . . F#3 - - - - - . .', 'G#2 - - - - - . . C#3 - - - - - . .', 'A2 - - - - - . . E2 - - - - - . .', 'B2 - - - - - . . B1 - - - - - . .') },
        { noise: 1, vol: 0.009, notes: r('. . x . . . x . . . x . . . x .', 8) }
      ]
    },
    // Chocolate Land: a gooey little waltz in A flat (twelve steps, three
    // beats). The tune slides up into its long notes from a semitone below,
    // like a spoon through melted chocolate, then bounces about on short
    // ones like sprinkles; the bass goes oom and the thin voice pah-pah.
    // Near the end D flat melts into D flat minor, the best bit
    chocolate: {
      step: 0.09,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('B5 C6 - - - - Ab5 - Eb5 - - -', 'E5 F5 - - - - Ab5 - C6 - - -', 'C6 Db6 - - - - Bb5 - F5 - - -', 'G5 . Ab5 . Bb5 . Db6 . C6 . Bb5 .',
          'B5 C6 - - - - Eb6 - Gb6 - - -', 'E6 F6 - - - - Db6 - Ab5 - - -', 'F6 - - - E6 - - - Db6 - Ab5 -', 'G5 . Bb5 . Db6 . Eb6 . Db6 . Bb5 .') },
        { duty: 0.125, vol: 0.009, notes: j('. . . . C5 - . . Eb5 - . .', '. . . . Ab4 - . . C5 - . .', '. . . . Db5 - . . F5 - . .', '. . . . Db5 - . . G4 - . .',
          '. . . . C5 - . . Gb4 - . .', '. . . . Db5 - . . F5 - . .', '. . . . E5 - . . Ab4 - . .', '. . . . Db5 - . . Bb4 - . .') },
        { wave: 'tri', vol: 0.09, notes: j('Ab2 - - . . . . . Eb2 - . .', 'F2 - - . . . . . C3 - . .', 'Bb2 - - . . . . . F2 - . .', 'Eb2 - - . . . . . Bb2 - . .',
          'Ab2 - - . . . . . C3 - . .', 'Db3 - - . . . . . Ab2 - . .', 'Db3 - - . . . . . E2 - . .', 'Eb2 - - . . . . . G2 - . .') },
        { noise: 1, vol: 0.011, notes: r('x . . . X . . . X . . x', 8) }
      ]
    },
    // Dinosaur Land: a big friendly stomp in C. Each bar of the first half
    // is a dinosaur's walk (stomp, stomp, ba-BOOM) a step lower than the
    // last, C, B flat, A flat, down to G, with the bass and the tom-toms
    // stomping in the same rhythm and a baby dino squeaking after each
    // one; then a big, happy tune with a drum roll, and A flat to B flat
    // to C, the cartoon-hero ending
    dinosaurs: {
      step: 0.105,
      tracks: [
        { duty: 0.5, vol: 0.026, notes: j('C5 - . C5 - . G4 - C5 - - - E5 - . .', 'D5 - . D5 - . Bb4 - D5 - - - F5 - . .', 'Eb5 - . Eb5 - . C5 - Eb5 - - - Ab5 - . .', 'G5 - - - - - - - F5 - D5 - B4 - . .',
          'E5 - - - G5 - - - C6 - - - - - - -', 'A5 - - - - - G5 - F5 - - - C5 - - -', 'Eb5 - - - Ab5 - C6 - D6 - - - F5 - Bb5 -', 'C6 - - - - - - - G5 - - - E5 - . .') },
        { duty: 0.125, vol: 0.01, notes: j('. . . . . . . . . . G5 . . . E6 G6', '. . . . . . . . . . F5 . . . D6 F6', '. . . . . . . . . . Ab5 . . . C6 Eb6', '. . . . . . . . . . . . . . B5 D6',
          ar('C5', 'E5', 'G5'), ar('C5', 'F5', 'A5'), 'C5 Eb5 Ab5 Eb5 C5 Eb5 Ab5 Eb5 D5 F5 Bb5 F5 D5 F5 Bb5 F5', ar('C5', 'E5', 'G5')) },
        { wave: 'tri', vol: 0.09, notes: j('C2 - . C2 - . C3 - C2 - - - G2 - . .', 'Bb1 - . Bb1 - . Bb2 - Bb1 - - - F2 - . .', 'Ab2 - . Ab2 - . Eb3 - Ab2 - - - Eb2 - . .', 'G2 - . G2 - . D3 - G2 - - - B1 - . .',
          r('C2 . C3 .', 4), r('F2 . F3 .', 4), 'Ab2 . Ab3 . Ab2 . Ab3 . Bb2 . Bb3 . Bb2 . Bb3 .', 'C3 . G2 . C3 . G2 . C3 . . . G2 . . .') },
        { noise: 0, vol: 0.012, notes: j(r('X . . X . . X . X . . . X . x x', 4), r('X . x . X . x x X . x . X . x x', 3), 'X . X . X . X . X X X X X X X X') }
      ]
    },
    // Bee Land: a sunny meadow tune in F, swaying on long notes, while the
    // bees never stop: the thin voice buzzes round each chord a semitone
    // either side, and once zooms straight up the scale. The bass hops
    // from flower to flower and the hi-hat is busy too
    beeland: {
      step: 0.09,
      tracks: [
        { duty: 0.5, vol: 0.024, notes: j('A5 - - C6 - - F6 - - - - - E6 - D6 -', 'C6 - - A5 - - F5 - - - - - D5 - F5 -', 'D6 - - F6 - - D6 - - - C6 - Bb5 - A5 -', 'G5 - - - - - - - C6 - - - E6 - - -',
          'F6 - - E6 - - F6 - - - - - C6 - - -', 'D6 - - C6 - - D6 - - - - - Bb5 - - -', 'Bb5 - - A5 - - G5 - E5 - - - G5 - Bb5 -', 'A5 - - - - - - - F5 - - - . . . .') },
        { duty: 0.125, vol: 0.008, notes: j(r(bz('A4'), 2), r(bz('C5'), 2), r(bz('A4'), 2), r(bz('F4'), 2), r(bz('D5'), 2), r(bz('Bb4'), 2), r(bz('G4'), 2), 'E4 F4 F#4 G4 G#4 A4 Bb4 B4',
          r(bz('C5'), 2), r(bz('A4'), 2), r(bz('D5'), 2), r(bz('F4'), 2), r(bz('D5'), 2), r(bz('E4'), 2), r(bz('A4'), 2), r(bz('C5'), 2)) },
        { wave: 'tri', vol: 0.09, notes: j(r('F2 . C3 . A2 . C3 .', 2), r('D3 . A2 . F2 . A2 .', 2), r('Bb2 . F2 . D3 . F2 .', 2), 'C3 . G2 . E3 . G2 . C3 . . . G2 . Bb2 .',
          'A2 . C3 . A2 . C3 . A2 . C3 . F3 . C3 .', r('Bb2 . D3 . F3 . D3 .', 2), 'G2 . D3 . G2 . D3 . C3 . G2 . E2 . G2 .', 'F2 . C3 . A2 . C3 . F2 . . . C2 . E2 .') },
        { noise: 1, vol: 0.012, notes: r('x . x x X . x . x . x x X . x x', 8) }
      ]
    },
    // Queen Bee: the fourth boss, in D minor. It starts as a royal fanfare
    // (ta, ta-ta, TAAA) over a swarm buzzing in the thin voice, with the
    // snare marching in the fanfare's rhythm; then the Queen loses her
    // temper: the tune breaks into frantic buzzing sixteenths, the fanfare
    // carries on underneath in the thin voice, the drums go double time,
    // and a royal run down the scale throws you back into the fight
    boss4: {
      step: 0.08,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('D5 . . D5 D5 . A5 - - - . F5 A5 . D6 .', 'F6 - - - E6 . D6 . C#6 - - - A5 . . .', 'D5 . . D5 D5 . A5 - - - . F5 A5 . F6 .', 'G6 - - - F6 . D6 . E6 - - - C#6 . A5 .',
          'D6 Eb6 D6 C#6 D6 Eb6 D6 C#6 D6 F6 D6 Bb5 F5 Bb5 D6 F6', 'E6 F6 E6 D#6 E6 F6 E6 D#6 F6 G6 F6 E6 F6 A6 F6 C6', 'Bb5 C6 Bb5 A5 Bb5 C6 Bb5 A5 C#6 D6 C#6 B5 C#6 E6 A6 E6', 'A6 - - - G6 - F6 - E6 - - - C#6 - - -') },
        { duty: 0.125, vol: 0.01, notes: j(r(bz('A4'), 4), j(r(bz('F4'), 2), r(bz('E4'), 2)), r(bz('A4'), 4), j(r(bz('D4'), 2), r(bz('E4'), 2)),
          'F4 . . F4 F4 . Bb4 - - - . D5 F5 . Bb5 .', 'G4 . . G4 G4 . C5 - - - . A4 C5 . F5 .', 'G4 . . G4 G4 . D5 - - - . C#5 E5 . A5 .', 'D5 . . D5 D5 . A4 - - - . C#5 E5 . A5 .') },
        { wave: 'tri', vol: 0.09, notes: j(r('D2 . . D2 . . D2 D3', 2), 'Bb1 . . Bb1 . . Bb1 Bb2 A1 . . A1 . . A1 A2', r('D2 . . D2 . . D2 D3', 2), 'G2 . . G2 . . G2 G3 A1 . . A1 . . A1 A2',
          r('Bb1 . . Bb1 . . Bb1 Bb2', 2), 'C2 . . C2 . . C2 C3 F2 . . F2 . . F2 F3', 'G2 . . G2 . . G2 G3 A1 . . A1 . . A1 A2', 'D2 . . D2 . . D2 D3 A1 . A2 . C#3 . E3 .') },
        { noise: 1, vol: 0.011, notes: j(r('X . . X X . X . x . . X X . X .', 4), r('X x x X x x X x X x x X x x X x', 3), 'X x X x X x X x X X X X X X X X') }
      ]
    }
  });
})();
