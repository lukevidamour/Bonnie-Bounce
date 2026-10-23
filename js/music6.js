/* ==========================================================================
   music6.js — the soundtrack of the sixth land, "HALF TERM!" (levels
   46–55): the map, ten worlds and the Witch. Every tune is an original,
   written for this game, in the same format as music.js (read that header
   first): tracks of note tokens, '-' holds, '.' rests, 'x'/'X' on noise
   tracks, and `sustain` (from music5.js) for notes that are plucked and
   ring away.

   Halloween here is spooky-FUN, never scary: minor keys with a wink,
   swing, plucky basses, music-box and celesta sparkle, a tuba, a kazoo.
   Some tunes are waltzes or swing, so twelve steps to a bar (three beats
   of four, or four swung beats of three) instead of sixteen; every track
   in a tune is the same length, so they all loop together.
   ========================================================================== */
(function () {
  'use strict';
  var r = function (s, n) { var o = []; for (var i = 0; i < n; i++) o.push(s); return o.join(' '); };
  var j = function () { return Array.prototype.join.call(arguments, ' '); };
  // a four-note arpeggio in sixteenths, a bar long
  var ar = function (a, b, c, d) { return r([a, b, c, d || b].join(' '), 4); };
  // a banjo's forward roll: three strings picked round and round, a bar long
  var roll = function (a, b, c) { return r([a, b, c, a, b, c, a, c].join(' '), 2); };
  // fireflies: four notes of a chord blinking at odd moments, a bar long
  var spark = function (a, b, c, d) { return [a, '.', c, '.', '.', b, '.', '.', d, '.', '.', c, '.', a, '.', '.'].join(' '); };
  // a whole line moved by octaves (the organ's second rank of pipes)
  var NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  var NUM = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var midi = function (n) { var m = /^([A-G])([#b]?)(\d)$/.exec(n); return NUM[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] + 1) * 12; };
  var name = function (k) { return NAMES[k % 12] + (Math.floor(k / 12) - 1); };
  var oct = function (s, o) { return s.split(' ').map(function (t) { return /^[A-G]/.test(t) ? name(midi(t) + 12 * o) : t; }).join(' '); };

  Object.assign(BB.SONGS, {

    /* ---- HALF TERM!: the sixth land, levels 46 to 55 ------------------- */

    // the half-term map: a music-box waltz in F, cosy as a jumper. Each bar
    // is a leaf falling (a long note, two steps down) and the breeze
    // lifting it again; the comb plucks pah-pah underneath. Then the box
    // turns mischievous: the same leaf comes back with its A slyly bent to
    // A flat (F minor), slips sideways onto D flat, and tiptoes down a
    // semitone at a time to C, before the wink back home to F major
    map6: {
      step: 0.125,
      tracks: [
        { duty: 0.25, vol: 0.024, sustain: 0.3, notes: j('A5 - - - - - G5 - F5 - C6 -', 'D6 - - - - - C6 - A5 - F5 -', 'G5 - - - - - A5 - Bb5 - D6 -', 'C6 - - - - - E5 - G5 - Bb5 -',
          'A5 - - - - - G5 - F5 - C6 -', 'Ab5 - - - - - G5 - F5 - C6 -', 'Db6 - - - - - C6 - Ab5 - F5 -', 'Bb5 - - - A5 . Ab5 . G5 - - -') },
        { duty: 0.125, vol: 0.009, sustain: 0.3, notes: j('. . . . A4 . . . C5 . . .', '. . . . F4 . . . A4 . . .', '. . . . Bb4 . . . D5 . . .', '. . . . E4 . . . Bb4 . . .',
          '. . . . A4 . . . C5 . . .', '. . . . Ab4 . . . C5 . . .', '. . . . F4 . . . Ab4 . . .', '. . . . E4 . . . Bb4 . . .') },
        { wave: 'tri', vol: 0.08, notes: j('F2 - - . . . . . . . . .', 'D3 - - . . . . . . . . .', 'G2 - - . . . . . . . . .', 'C3 - - . . . . . E2 - - .',
          'F2 - - . . . . . . . . .', 'Ab2 - - . . . . . . . . .', 'Db3 - - . . . . . . . . .', 'C3 - - . . . . . G2 - E2 -') },
        { noise: 1, vol: 0.006, notes: r('. . . . . . . . x . . .', 8) }
      ]
    },
    // Pumpkin Patch: a sunny hoe-down in G at a farmyard gallop. The fiddle
    // goes diddle-dum, diddle-dum and runs down the chord, the banjo rolls
    // three strings round and round, and the bass goes boom-chick with a
    // stroll up a semitone into E minor. The second half holds its notes
    // like a big stretch in the sun, climbs a D seven to a yee-haw on top
    // and trots home
    pumpkinpatch: {
      step: 0.085,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('G5 G5 B5 . G5 G5 D6 . E6 . D6 . B5 . G5 .', 'E6 . C6 . A5 . G5 . E5 . G5 . A5 . C6 .', 'G5 G5 B5 . G5 G5 D6 . G6 . F#6 . E6 . D6 .', 'C6 . A5 . F#5 . A5 . D6 - - - . . . .',
          'B5 - - - G5 . B5 . E6 - - - D6 . B5 .', 'C6 - - - G5 . C6 . E6 - - - D6 . C6 .', 'A5 - - - F#5 . A5 . D6 . E6 . F#6 . A6 .', 'G6 - - - D6 . B5 . G5 . A5 . B5 . D5 .') },
        { duty: 0.125, vol: 0.009, sustain: 0.3, notes: j(roll('G4', 'B4', 'D5'), roll('G4', 'C5', 'E5'), roll('G4', 'B4', 'D5'), roll('F#4', 'A4', 'D5'),
          roll('G4', 'B4', 'E5'), roll('G4', 'C5', 'E5'), roll('F#4', 'A4', 'D5'), roll('G4', 'B4', 'D5')) },
        { wave: 'tri', vol: 0.09, notes: j('G2 - . . D3 - . . G2 - . . D3 - . .', 'C3 - . . G2 - . . C3 - . . G2 - . .', 'G2 - . . D3 - . . G2 - . . D3 - . .', 'D3 - . . A2 - . . D2 - . . D#2 - . .',
          'E2 - . . B2 - . . E2 - . . B2 - . .', 'C3 - . . G2 - . . C3 - . . G2 - . .', 'D3 - . . A2 - . . D3 - . . A2 - . .', 'G2 - . . D3 - . . G2 - . . D2 - F#2 -') },
        { noise: 1, vol: 0.014, notes: j(r('x . x x X . x . x . x x X . x .', 7), 'x . x x X . x . X . X . X X X X') }
      ]
    },
    // Conker Woods: a slow stroll in D, golden and a little misty. The bass
    // walks a step a beat, the tune keeps looking up (a rising chord, then
    // a sigh down), and the thin voice is sunlight through the leaves,
    // plucked and fading. Twice the woods do something wondrous: an E major
    // chord over the D (a sharpened fourth, G sharp, the sound of 'ooh')
    // and a long E that melts down into D
    conkerwood: {
      step: 0.13,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('F#5 - - - A5 - - - D6 - - - C#6 - A5 -', 'B5 - - - - - G#5 - E5 - - - - - . .', 'D5 - - - F#5 - - - B5 - - - A5 - F#5 -', 'G5 - - - - - B5 - A5 - - - E5 - - -',
          'B5 - - - D6 - - - G6 - - - F#6 - D6 -', 'E6 - - - - - D6 - A5 - - - - - . .', 'G5 - - - B5 - - - E6 - - - D6 - B5 -', 'C#6 - - - - - - - A5 - - - G5 - E5 -') },
        { duty: 0.125, vol: 0.009, sustain: 0.3, notes: j('F#4 . A4 . D5 . A4 . F#4 . A4 . C#5 . A4 .', r('G#4 . B4 . E5 . B4 .', 2), r('F#4 . B4 . D5 . B4 .', 2), 'G4 . B4 . D5 . B4 . A4 . C#5 . E5 . C#5 .',
          r('G4 . B4 . D5 . B4 .', 2), r('F#4 . A4 . D5 . A4 .', 2), r('G4 . B4 . E5 . D5 .', 2), r('E4 . G4 . C#5 . A4 .', 2)) },
        { wave: 'tri', vol: 0.085, notes: j('D3 - . . A2 - . . B2 - . . C#3 - . .', 'D3 - . . A2 - . . D3 - . . E3 - . .', 'B2 - . . F#2 - . . B2 - . . A2 - . .', 'G2 - . . B2 - . . A2 - . . C#3 - . .',
          'G2 - . . A2 - . . B2 - . . D3 - . .', 'F#2 - . . A2 - . . D3 - . . F#2 - . .', 'E2 - . . G2 - . . B2 - . . G2 - . .', 'A2 - . . E2 - . . A2 - . . C#3 - . .') },
        { noise: 1, vol: 0.007, notes: r('. . . . x . . . . . . . x . . x', 8) }
      ]
    },
    // Windy Hill: B flat, breezy and soaring. The tune climbs up to a long
    // note, hangs there like a kite, then loops the loop (a quick turn round
    // it); each phrase goes up a little higher. The thin voice is the wind:
    // gusts that rush up the chord in the second half of the bar, and two
    // big ones that swirl up and back down. The bass sways long-long-short,
    // and A flat (a step below B flat) is the kite at the very top
    windyhill: {
      step: 0.095,
      tracks: [
        { duty: 0.25, vol: 0.025, vib: true, notes: j('D5 - F5 - Bb5 - - - - - - - C6 Bb5 A5 Bb5', 'G5 - Bb5 - Eb6 - - - - - - - F6 Eb6 D6 Eb6', 'D6 - - - Bb5 - G5 - D6 - - - G6 - - -', 'F6 - - - - - - - C6 - - - A5 - C6 -',
          'G5 - - - Bb5 - - - Eb6 - - - G6 - - -', 'A5 - - - C6 - - - F6 - - - A6 - - -', 'Bb6 - - - - - - - Ab6 G6 F6 G6 Eb6 - C6 -', 'C6 - - - - - A5 - F5 - - - Eb5 - - -') },
        { duty: 0.125, vol: 0.01, notes: j('. . . . . . . . F4 Bb4 D5 F5 Bb5 - - -', '. . . . . . . . G4 Bb4 Eb5 G5 Bb5 - - -', '. . . . . . . . G4 Bb4 D5 G5 Bb5 - - -', 'F4 A4 C5 F5 A5 C6 - - A5 F5 C5 A4 F4 - . .',
          '. . . . . . . . G4 Bb4 Eb5 G5 Bb5 - - -', '. . . . . . . . A4 C5 F5 A5 C6 - - -', '. . . . . . . . Ab4 C5 Eb5 Ab5 C6 - - -', 'F4 A4 C5 Eb5 F5 A5 C6 - Eb6 C6 A5 F5 Eb5 C5 A4 F4') },
        { wave: 'tri', vol: 0.085, notes: j('Bb2 - - - - - F2 - - - - - D3 - - -', 'Eb3 - - - - - Bb2 - - - - - G2 - - -', 'G2 - - - - - D3 - - - - - Bb2 - - -', 'F2 - - - - - C3 - - - - - A2 - - -',
          'Eb2 - - - - - Bb2 - - - - - G2 - - -', 'A2 - - - - - F2 - - - - - C3 - - -', 'Ab2 - - - - - Eb3 - - - - - C3 - - -', 'F2 - - - - - C3 - - - - - A2 - - -') },
        { noise: 1, vol: 0.01, notes: r('x . . . . . x . . . . . x . . .', 8) }
      ]
    },
    // Trick or Treat Street: G minor on tiptoe at dusk, a swing (three steps
    // to a beat, long-short). The tune creeps up in little swung steps
    // (sneak-y STEP, sneak-y STEP), tiptoes back down, peeks... and BOO on
    // the last beat, while the drums hold their breath. Then a fit of the
    // giggles (hee-hee hee-hee HA) in E flat and C minor. The bass is
    // plucked like a double bass, and the thin voice taps two and four
    trickortreat: {
      step: 0.14,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('Bb4 . C5 D5 . . Bb4 . C5 D5 . .', 'Eb5 . F5 G5 . . Eb5 . F5 G5 . .', 'Bb5 . . A5 . . G5 . . D5 . .', 'F#5 . A5 C6 . . . . . D6 . .',
          'Bb5 . Bb5 Bb5 . Bb5 G5 . . Eb5 . .', 'C6 . C6 C6 . C6 G5 . . Eb5 . .', 'A5 . . C6 . . Eb6 . . D6 . C6', 'Bb5 . . A5 . . F#5 . . D5 . .') },
        { duty: 0.125, vol: 0.008, sustain: 0.3, notes: j('. . . D5 . . . . . Bb4 . .', '. . . Eb5 . . . . . G4 . .', '. . . D5 . . . . . C5 . .', '. . . C5 . . . . . F#4 . .',
          '. . . G4 . . . . . Bb4 . .', '. . . G4 . . . . . Eb5 . .', '. . . Eb5 . . . . . C5 . .', '. . . F#4 . . . . . A4 . C5') },
        { wave: 'tri', vol: 0.09, sustain: 0.25, notes: j('G2 . . Bb2 . . D3 . . Bb2 . .', 'C3 . . Eb3 . . G3 . . Eb3 . .', 'D3 . . C3 . . Bb2 . . A2 . .', 'D3 . . C3 . . A2 . . F#2 . .',
          'Eb3 . . Bb2 . . G2 . . Bb2 . .', 'C3 . . G2 . . Eb2 . . G2 . .', 'A2 . . C3 . . Eb3 . . F#2 . .', 'D3 . . A2 . . F#2 . . D2 . .') },
        { noise: 1, vol: 0.009, notes: j(r('x . . X . x x . . X . x', 3), '. . . . . . . . . X . .', r('x . . X . x x . . X . x', 3), 'x . . X . x X . X X . X') }
      ]
    },
    // Pumpkin Town: a crooked waltz-march in C minor, three beats to the bar
    // with a march's snare. The pumpkin band's tune struts (a long note, a
    // quick one, a leap) and the second bar is the crooked one, B up to F,
    // a lopsided tritone; then it stops dead on G for a drum roll, like a
    // showman waiting for applause. The second half struts in E flat major,
    // and an F major chord turns minor in the middle of a bar, the wink.
    // The tuba goes OOM on one and puffs a fifth on three
    pumpkintown: {
      step: 0.1,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('C5 - - C5 G5 - - - Eb5 - C5 -', 'B4 - - B4 F5 - - - D5 - B4 -', 'Eb5 - - Eb5 C6 - - - G5 - Eb5 -', 'Ab5 - - - G5 - - - . . . .',
          'G5 - - G5 Bb5 - - - Eb6 - D6 -', 'C6 - - Bb5 Ab5 - - - Eb5 - F5 -', 'A5 - - A5 C6 - - - Ab5 - F5 -', 'G5 - - F5 D5 - - - B4 - - -') },
        { duty: 0.125, vol: 0.01, notes: j('. . . . Eb4 . . . G4 . . .', '. . . . D4 . . . F4 . . .', '. . . . Eb4 . . . G4 . . .', '. . . . Eb4 . . . . . . .',
          '. . . . G4 . . . Bb4 . . .', '. . . . Ab4 . . . C5 . . .', '. . . . A4 . . . Ab4 . . .', '. . . . F4 . . . B4 . . .') },
        { wave: 'tri', vol: 0.09, notes: j('C3 - - . . . . . G2 - . .', 'G2 - - . . . . . D3 - . .', 'C3 - - . . . . . Eb3 - . .', 'Ab2 - - . . . . . G2 - - -',
          'Eb3 - - . . . . . Bb2 - . .', 'Ab2 - - . . . . . Eb3 - . .', 'F2 - - . . . . . Ab2 - . .', 'G2 - - . . . . . D3 - B2 -') },
        { noise: 0, vol: 0.011, notes: j(r('X . . . x . . . x . . .', 3), 'X . . . x . . . X X X X', r('X . . . x . . . x . . .', 3), 'X . . . x . x x X . X .') }
      ]
    },
    // Graveyard Jamboree: the ghost band swings, in C minor (three steps to
    // a beat). The bass walks a note a beat, the drummer rides with snare on
    // two and four, and the bone xylophone plinks the Charleston (on one,
    // and on the 'and' of two). The kazoo plays a cheeky riff and its answer,
    // then the ghosts croon two long wobbly 'ooo's, slide down the blues
    // scale (with its flattened fifth, G flat) and skip up a G seven
    graveyard: {
      step: 0.11,
      tracks: [
        { duty: 0.125, vol: 0.026, vib: true, notes: j('C5 . Eb5 G5 . . Bb5 - - G5 . .', 'A5 . . G5 . F5 Eb5 . . C5 . .', 'C5 . Eb5 G5 . . Bb5 - - C6 . Bb5', 'Ab5 - - G5 . . F5 . D5 B4 . .',
          'C6 - - - - - - - - Ab5 . F5', 'D6 - - - - - - - - Bb5 . F5', 'Eb6 . D6 C6 . Bb5 Ab5 . G5 Gb5 . F5', 'B4 . D5 F5 . Ab5 G5 . . . . .') },
        { duty: 0.125, vol: 0.009, sustain: 0.25, notes: j('G4 . . . . Bb4 . . . . . .', 'A4 . . . . Eb5 . . . . . .', 'G4 . . . . Bb4 . . . . . .', 'F4 . . . . B4 . . . . . .',
          'Ab4 . . . . Eb5 . . . . . .', 'Ab4 . . . . D5 . . . . . .', 'G4 . . . . Bb4 . . . Gb4 . .', 'F4 . . . . B4 . . . . Ab4 .') },
        { wave: 'tri', vol: 0.09, notes: j('C3 - . Eb3 - . G3 - . Bb2 - .', 'F2 - . A2 - . C3 - . D3 - .', 'C3 - . G2 - . Eb2 - . F#2 - .', 'G2 - . D3 - . B2 - . G2 - .',
          'F2 - . C3 - . Ab2 - . F2 - .', 'Bb2 - . F2 - . Bb2 - . D3 - .', 'Eb3 - . Bb2 - . Ab2 - . C3 - .', 'G2 - . B2 - . D3 - . Db3 - .') },
        { noise: 1, vol: 0.012, notes: r('x . . X . x x . . X . x', 8) }
      ]
    },
    // The Haunted Mansion's ballroom: a grand waltz in A minor on a creaky
    // organ, two ranks of pipes an octave apart, wobbling. It sweeps up
    // the chord and sighs (C falling to B over E), sweeps higher... and in
    // the fourth bar one pipe sags a semitone flat and pulls itself back
    // up, which is the joke. The second half waltzes in C major, cascades
    // down a D minor seven, and climbs an E seven so the dancers can
    // spin back to the start. Oom on one from the bass, pah-pah from the
    // thin voice
    mansion: (function () {
      var tune = j('A4 - - - C5 - E5 - A5 - - -', 'C6 - - - - - - - B5 - - -', 'F5 - - - A5 - D6 - F6 - - -', 'E6 - - - Eb6 - - - E6 - . .',
        'G5 - - - C6 - E6 - G6 - - -', 'F6 - - - - - - - E6 - D6 -', 'D6 - - - C6 - A5 - F5 - D5 -', 'B4 - - - D5 - G#5 - B5 - - -');
      return {
        step: 0.105,
        tracks: [
          { duty: 0.5, vol: 0.022, vib: true, notes: tune },
          { duty: 0.25, vol: 0.01, notes: oct(tune, -1) },
          { duty: 0.125, vol: 0.008, notes: j('. . . . C4 - . . E4 - . .', '. . . . D4 - . . G#4 - . .', '. . . . F4 - . . A4 - . .', '. . . . D4 - . . G#4 - . .',
            '. . . . E4 - . . G4 - . .', '. . . . F4 - . . B4 - . .', '. . . . F4 - . . A4 - . .', '. . . . D4 - . . G#4 - . .') },
          { wave: 'tri', vol: 0.085, notes: j('A2 - - . . . . . . . . .', 'E2 - - . . . . . . . . .', 'D3 - - . . . . . . . . .', 'E2 - - . . . . . G#2 - - .',
            'C3 - - . . . . . . . . .', 'G2 - - . . . . . . . . .', 'F2 - - . . . . . D2 - - .', 'E2 - - . . . . . B2 - G#2 -') }
        ]
      };
    })(),
    // The Witch's Wood: E flat with a bright A natural (a sharpened fourth),
    // the sound of magic, slow and twinkly. Fireflies blink round each chord
    // at odd moments (plucked high, ringing away) while the tune floats up
    // and drifts down. Halfway, A flat major turns to A flat minor, the
    // mysterious bit, but it's a friendly forest: the tune does a little
    // twirl at the end and the bass rocks home
    witchwood: {
      step: 0.13,
      tracks: [
        { duty: 0.5, vol: 0.022, vib: true, notes: j('G5 - - - Bb5 - - - Eb6 - - - - - - -', 'F6 - - - - - Eb6 - C6 - - - A5 - - -', 'G5 - - - C6 - - - Eb6 - - - D6 - C6 -', 'Ab5 - - - - - Bb5 - C6 - - - D6 - - -',
          'Eb6 - - - - - C6 - Ab5 - - - - - Bb5 -', 'B5 - - - - - Bb5 - Ab5 - - - Eb5 - - -', 'Ab5 - - - C6 - Eb6 - D6 - - - Bb5 - - -', 'D6 Eb6 D6 C6 Bb5 - - - - - - - . . . .') },
        { duty: 0.125, vol: 0.008, sustain: 0.25, notes: j(spark('G5', 'Bb5', 'Eb6', 'G6'), spark('A5', 'C6', 'F6', 'A6'), spark('G5', 'C6', 'Eb6', 'G6'), 'Ab5 . Eb6 . . C6 . . F6 . . D6 . Bb5 . .',
          spark('Ab5', 'C6', 'Eb6', 'Ab6'), spark('Ab5', 'B5', 'Eb6', 'Ab6'), 'F5 . C6 . . Ab5 . . D6 . . Bb5 . F5 . .', spark('F5', 'Bb5', 'D6', 'Ab6')) },
        { wave: 'tri', vol: 0.08, notes: j('Eb2 - - - - - - - Bb2 - - - - - - -', 'Eb2 - - - - - - - C3 - - - - - - -', 'C2 - - - - - - - G2 - - - - - - -', 'Ab2 - - - - - - - Bb2 - - - - - - -',
          'Ab2 - - - - - - - Eb3 - - - - - - -', 'Ab2 - - - - - - - Eb2 - - - - - - -', 'F2 - - - - - - - Bb2 - - - - - - -', 'Bb1 - - - - - - - F2 - - - Bb2 - - -') },
        { noise: 1, vol: 0.006, notes: r('. . . . x . . . . . . . . . x .', 8) }
      ]
    },
    // Firework Night: D major, bright and bursting. The tune goes pop, pop,
    // pop, BOOM up the chord and sparkles back down; the thin voice is the
    // rockets, whooshing up two octaves with a bang (a snare) at the top,
    // and the sparks falling after. In the second half each phrase goes off
    // a step higher (G, A, B) like a finale, and the last rocket of the
    // loop bursts right on the first beat of the next
    fireworks: {
      step: 0.09,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('F#5 . A5 . D6 . . . F#6 - - - E6 - D6 -', 'G5 . B5 . D6 . . . G6 - - - F#6 - E6 -', 'F#5 . A5 . D6 . . . A6 - - - G6 - F#6 -', 'E6 - - - - - C#6 - A5 . B5 . C#6 . E6 .',
          'D6 - - - B5 . G5 . D6 - - - G6 - - -', 'E6 - - - C#6 . A5 . E6 - - - A6 - - -', 'F#6 - - - D6 . B5 . F#6 - - - B6 - - -', 'A6 - - - G6 . E6 . C#6 . A5 . G5 . E5 .') },
        { duty: 0.125, vol: 0.01, notes: j('. . . . . . . . A3 D4 F#4 A4 D5 F#5 A5 .', 'D6 . . B5 . . G5 . . D5 . . B4 . . .', '. . . . . . . . A3 D4 F#4 A4 D5 F#5 A5 .', 'E6 . . C#6 . . A5 . . E5 . . C#5 . . .',
          '. . . . . . . . G3 B3 D4 G4 B4 D5 G5 .', '. . . . . . . . A3 C#4 E4 A4 C#5 E5 A5 .', '. . . . . . . . B3 D4 F#4 B4 D5 F#5 B5 .', 'A3 C#4 E4 G4 A4 C#5 E5 G5 A5 C#6 E6 G6 A6 - - .') },
        { wave: 'tri', vol: 0.09, notes: j(r('D2 . D3 . A2 . D3 .', 2), r('G2 . G3 . D3 . G3 .', 2), r('D2 . D3 . A2 . D3 .', 2), r('A2 . A3 . E3 . A3 .', 2),
          r('G2 . G3 . D3 . G3 .', 2), r('A2 . A3 . E3 . A3 .', 2), r('B2 . B3 . F#3 . B3 .', 2), 'A2 . A3 . G2 . G3 . E2 . E3 . C#3 . A2 .') },
        { noise: 1, vol: 0.014, notes: j('X . x x X . x . x . x x X . . X', 'X . x . X . x . x . x . X . x .', 'x . x x X . x . x . x x X . . X', 'X . x . X . x . x . x . X . x .',
          'x . x x X . x . x . x x X . . X', 'X . x x X . x . x . x x X . . X', 'X . x x X . x . x . x x X . . X', 'x . x . x . x . x x x x x x x x') }
      ]
    },
    // The Witch's Tower: E minor, climbing. The bass is the staircase,
    // bouncing up four stairs every bar; the tune is determined (step, step,
    // UP, and back) and starts each phrase higher. Halfway an F major chord
    // (a semitone above E) leans the tower sideways, the climb speeds up to
    // two steps a bar, the drums get busier and roll, and at the top
    // Bonnie tumbles happily back down the B seven to the bottom of the
    // stairs, ready to go round again
    witchtower: {
      step: 0.085,
      tracks: [
        { duty: 0.25, vol: 0.026, notes: j('E5 . E5 . G5 - - - F#5 . E5 . B4 - - -', 'E5 . E5 . A5 - - - G5 . E5 . C5 - - -', 'F#5 . F#5 . B5 - - - A5 . F#5 . D5 - - -', 'D#5 . F#5 . A5 . B5 . C6 - - - B5 - A5 -',
          'B5 . B5 . E6 - - - D6 . B5 . G5 - - -', 'C6 . C6 . F6 - - - E6 . C6 . A5 - - -', 'D6 . D6 . G6 - - - E6 . E6 . A6 - - -', 'F#6 . D#6 . B5 . A5 . F#5 . D#5 . B4 . A4 .') },
        { duty: 0.125, vol: 0.01, notes: j(ar('G4', 'B4', 'E5'), ar('G4', 'C5', 'E5'), ar('F#4', 'A4', 'D5'), ar('F#4', 'A4', 'D#5'),
          ar('G4', 'B4', 'E5'), 'F4 A4 C5 A4 F4 A4 C5 A4 E4 A4 C5 A4 E4 A4 C5 A4', 'G4 B4 D5 B4 G4 B4 D5 B4 A4 C#5 E5 C#5 A4 C#5 E5 C#5', ar('F#4', 'B4', 'D#5')) },
        { wave: 'tri', vol: 0.09, notes: j('E2 . E3 . G2 . G3 . A2 . A3 . B2 . B3 .', 'C2 . C3 . D2 . D3 . E2 . E3 . G2 . G3 .', 'D2 . D3 . E2 . E3 . F#2 . F#3 . A2 . A3 .', 'B1 . B2 . C#2 . C#3 . D#2 . D#3 . F#2 . F#3 .',
          'E2 . E3 . F#2 . F#3 . G2 . G3 . B2 . B3 .', 'F2 . F3 . G2 . G3 . A2 . A3 . C3 . C4 .', 'G2 . G3 . B2 . B3 . A2 . A3 . C#3 . C#4 .', 'B1 . B2 . B1 . B2 . B1 B2 B1 B2 B1 B2 B1 B2') },
        { noise: 1, vol: 0.014, notes: j(r('x . x . X . x . x . x . X . x x', 4), r('x x x x X . x x x x x x X . x x', 3), 'X . X . X . X . X X X X X X X X') }
      ]
    },
    // The Witch: the fifth boss, A minor and frantic. Her broomstick tune
    // loops the loop (up the chord, round and down the scale, up again),
    // then cackles: a quick trill of thirds tumbling down, ah-ha-ha-ha.
    // Then she swoops low with stabs in threes (three, three, two) that
    // start a step higher every bar while the chords fall (A minor, G, F,
    // E), the thin voice loops the loop round each chord, the cackle drops
    // underneath, and she dives down the scale back into the fight
    boss5: {
      step: 0.075,
      tracks: [
        { duty: 0.25, vol: 0.024, notes: j('E5 A5 C6 E6 D6 C6 B5 A5 G#5 A5 B5 C6 E6 - - -', 'F5 A5 C6 F6 E6 D6 C6 A5 F5 G5 A5 C6 F6 - - -', 'D6 . F6 . A6 . F6 . D6 . A5 . F5 . D5 .', 'E6 C6 E6 C6 D6 B5 D6 B5 C6 A5 C6 A5 B5 G#5 B5 G#5',
          'A4 . . A4 . . C5 . E5 . . E5 . . A5 .', 'B4 . . B4 . . D5 . G5 . . G5 . . B5 .', 'C5 . . C5 . . F5 . A5 . . A5 . . C6 .', 'E6 - - - - - - - E6 D6 C6 B5 A5 G#5 F5 D5') },
        { duty: 0.125, vol: 0.01, notes: j(ar('A4', 'C5', 'E5'), ar('A4', 'C5', 'F5'), ar('A4', 'D5', 'F5'), r('E4 . G#4 .', 4),
          r('A4 C5 E5 A5 C6 A5 E5 C5', 2), r('G4 B4 D5 G5 B5 G5 D5 B4', 2), r('F4 A4 C5 F5 A5 F5 C5 A4', 2), 'E5 C5 E5 C5 D5 B4 D5 B4 C5 A4 C5 A4 B4 G#4 B4 G#4') },
        { wave: 'tri', vol: 0.09, notes: j(r('A2 . A3 A2 . A2 A3 .', 2), r('F2 . F3 F2 . F2 F3 .', 2), r('D2 . D3 D2 . D2 D3 .', 2), r('E2 . E3 E2 . E2 E3 .', 2),
          'A2 . . A2 . . A3 . A2 . . A2 . . A3 .', 'G2 . . G2 . . G3 . G2 . . G2 . . G3 .', 'F2 . . F2 . . F3 . F2 . . F2 . . F3 .', 'E2 . E3 . E2 . E3 . E2 E3 E2 E3 D3 C3 B2 G#2') },
        { noise: 1, vol: 0.012, notes: j(r('X . x x X . x x X . x x X x x x', 4), r('X . . X . . X . X . . X . . X .', 3), 'X x X x X x X x X X X X X X X X') }
      ]
    }
  });
})();
