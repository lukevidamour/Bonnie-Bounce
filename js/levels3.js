/* ==========================================================================

   ========================================================================== */
(function () {
  'use strict';
  var K = BB.levelKit, add = K.add, TL = K.TL, R1 = K.R1, R2 = K.R2;

  /* ==========================================================================
     THE THIRD LAND — THE BIG TRIP (levels 21–30)
     The family's off to Disneyland Paris in the Yeti, and Rascal the Fox
     has snatched Brocco. Each level ends at the car, with Luke and Lucy
     waiting; one of them cheers at every checkpoint. The tricks: steam
     that lifts you, a windmill to ride, market awnings to bounce on,
     conveyor belts and croissants, rolling cheeses, chimneys over the
     roofs, trains to ride, the Eiffel Tower to climb, the park's carousel,
     teacups and parade — and Rascal at the castle, under the fireworks.
     (A little harder than the first two lands: Bonnie asked for it.)

     Made half as long again (owner, 17 Oct: "he's plowing through"): each
     level keeps all of its first half and gains a new stretch before the
     car, in its own world's style, with something to find in it — a pool
     to dive in, a haystack you can walk into, a busker's tune to hop
     along, balloons to float off on — and three golden medals: one in the
     old part, two in the new, never all three the same kind of find. Each
     level keeps its old flag and gains a second one in the new stretch,
     placed so the longer level is in rough thirds (a restart goes to the
     furthest flag he touched; Mum and Dad take turns at them).
     ========================================================================== */

  /* 21 — The Ferry. Across the deck, past the funnels: their steam lifts
     Bonnie up to the high decks; lifeboats bob over the gaps. */
  add({
    name: 'THE FERRY', theme: 'ferry', w: 336, seed: 211,
    build: function (L) {
      L.ground(0, 38);
      /* the bridge's white wall behind the start: walk back into it, not
         forwards, and it's a cabin with a medal at the back. (The start is
         4 tiles further in than it was, so the cabin is deep enough for
         "SECRET!" to come a step before "MEDAL!", both on screen.) */
      L.start = { x: 7, row: 16 };
      L.box(0, 9, 6, 16, TL.HARD); L.secret(1, 12, 6, 16, 'hard'); L.medal(1, 14);
      L.row(9, R1, '?P?');
      L.e('crab', 18);
      // the first vent, on safe ground: up to a ledge of stars
      L.steam(24, 7); L.semi(20, 30, 9); L.coins(21, 8, 3); L.coins(27, 8, 3);
      L.e('gull', 33, 9);
      L.plat(39, 14, 3, { bob: true, look: 'lifeboat' });
      L.ground(43, 77);
      L.row(48, 15, 'cc'); L.row(48, 14, 'cc');
      L.e('crab', 55);
      L.pipe(59, 3);
      L.e('gull', 64, 9);
      L.row(66, R1, 'B?B');
      L.steam(71, 9); L.semi(68, 76, 7); L.coins(69, 6, 6);
      L.plat(78, 14, 3, { bob: true, look: 'lifeboat', dx: 2, speed: 0.4 });
      L.ground(83, 121);
      L.e('crab', 89);
      L.check(95);
      L.e('gull', 100, 9);
      L.row(103, R1, '?L?');
      L.e('crab', 108);
      // Bear: up on the high deck by the funnel — the steam takes you there
      L.pipe(116, 4); L.steam(112, 9); L.semi(109, 116, 7); L.bear(110, 7);
      L.plat(122, 14, 3, { bob: true, look: 'lifeboat', dx: 2, speed: 0.4 });
      L.ground(127, 220);
      L.e('gull', 133, 9); L.e('crab', 138);
      L.row(142, R1, 'BMB');
      L.steam(150, 8); L.semi(147, 155, 8); L.coins(148, 7, 6);
      L.e('crab', 158); L.e('crab', 166);
      L.pipe(162, 3);
      L.e('gull', 170, 9);
      L.row(172, R1, 'B?B');
      /* ---- the new half: the sun deck, the crow's nest, the stern ---- */
      // the sun deck's pool: hop the rim, splash in, and dive for the medal
      // glinting at the bottom (a stroke at the surface lifts him out)
      L.box(188, 12, 190, 16); L.water(190, 12, 202, 16); L.box(202, 12, 204, 16);
      L.medal(196, 15);
      L.check(206);
      L.row(212, R1, 'B?B?B');
      L.e('gull', 218, 9);
      L.plat(221, 14, 3, { bob: true, look: 'lifeboat', dx: 2, speed: 0.4 });
      L.ground(226, 276);
      /* the big funnel: its steam lifts him to a girder, and a second puff
         on the girder takes him on up to the crow's nest — a medal in plain
         sight, high over the deck, for the one who works out the way up */
      L.steam(232, 7); L.semi(229, 242, 9); L.coins(230, 8, 2); L.coins(239, 8, 2);
      L.steam(236, 5, 9); L.semi(234, 246, 4); L.coins(238, 3, 5); L.medal(244, 3);
      L.pipe(254, 4);
      L.e('gull', 262, 9); L.e('crab', 264);
      L.row(267, R1, '?L?');
      L.plat(277, 14, 3, { bob: true, look: 'lifeboat', dx: 2, speed: 0.45 });
      L.ground(282, 336);
      L.row(288, R1, 'B?B'); L.e('gull', 293, 9);
      L.stairs(296, 5);
      L.goal(310);
    }
  });

  /* 22 — Sunflower Fields. Hay bales, bees and hedgehogs — and a windmill
     whose sails you ride round and up onto the high meadow. */
  add({
    name: 'SUNFLOWER FIELDS', theme: 'fields', w: 354, seed: 222,
    build: function (L) {
      L.ground(0, 70);
      L.row(8, R1, '?P?');
      L.e('snail', 18); L.e('bee', 26, 9);
      L.row(30, R1, 'B?B');
      L.e('hog', 36);
      L.row(42, 15, 'cc'); L.row(42, 14, 'cc'); L.row(42, 13, 'c');
      L.e('grumbug', 50);
      // the windmill: four sails turning round the hub, up to the meadow
      [0, 1.5708, 3.1416, 4.7124].forEach(function (ph) { L.plat(63, 9, 3, { circle: 4, phase: ph, speed: 0.011, spokes: true, look: 'sail' }); });
      // over the windmill's cap: stay on a sail as it goes over the top, and hop
      L.medal(63, 2);
      L.ground(70, 108, 8);
      L.coins(73, 7, 5);
      L.e('hog', 84, 8);
      L.row(88, 4, 'B?B');
      L.e('bee', 95, 5);
      L.check(98, 8);
      // Bear: on the roof of the hay barn, a hop up from the meadow
      L.semi(101, 107, 4); L.bear(103, 4);
      L.ground(108, 140);
      L.e('snail', 116);
      L.row(120, R1, 'BMB');
      L.e('bee', 126, 9);
      L.e('hog', 134);
      L.ground(144, 175);
      L.e('grumbug', 150); L.e('snail', 160);
      L.row(164, R1, '?L?');
      // a second windmill, over a stream
      [0, 2.0944, 4.1888].forEach(function (ph) { L.plat(180, 10, 3, { circle: 4, phase: ph, speed: 0.012, spokes: true, look: 'sail' }); });
      L.ground(186, 236);
      L.e('hog', 190);
      /* ---- the new half: the haystack, the third windmill, the fête ---- */
      /* A haystack across the path, low enough to climb (its top tier is
         5 rows up): the stars lead into its front, which is loose hay —
         walk on in, rather than jump, and there's a medal at the back */
      L.coins(204, 15, 3);
      L.box(208, 11, 218, 16, TL.HARD); L.box(210, 8, 216, 11, TL.HARD);
      L.secret(208, 12, 212, 16, 'hard'); L.medal(211, 14);
      L.coins(211, 7, 4);
      L.check(220);
      L.row(224, R1, 'B?B');
      L.e('bee', 230, 9);
      // the third windmill, four sails over the river
      [0, 1.5708, 3.1416, 4.7124].forEach(function (ph) { L.plat(241, 10, 3, { circle: 4, phase: ph, speed: 0.011, spokes: true, look: 'sail' }); });
      L.ground(247, 256);
      L.ground(261, 354);
      /* The village fête: a bunch of balloons tied to the fence. Hold on and
         steer right: a trail of stars up into the sky, a line of them along
         the top, and a medal at the end — then a slow drift down past the
         hedgehogs (only baddies you can stomp below the ride) */
      L.balloons(266, 14);
      L.coins(270, 13, 1); L.coins(273, 10, 1); L.coins(276, 7, 1); L.coins(280, 4, 1);
      L.coins(283, 2, 10); L.medal(294, 2);
      L.e('bee', 286, 10); L.e('grumbug', 292); L.e('snail', 298);
      L.row(306, R1, '?L?');
      L.stairs(318, 4);
      L.goal(328);
    }
  });

  /* 23 — Market Village. Cobbles, cafés and snails; the market's stripy
     awnings bounce you up to the balconies; pigeons everywhere. */
  add({
    name: 'MARKET VILLAGE', theme: 'village', w: 342, seed: 233,
    build: function (L) {
      L.ground(0, 40);
      L.row(9, R1, '?P?');
      L.e('snail', 18);
      L.spring(24); L.semi(21, 30, 8); L.coins(22, 7, 6);
      L.e('pigeon', 33, 9);
      L.ground(44, 80);
      L.e('snail', 50);
      L.row(54, R1, 'B?B');
      L.spring(61); L.row(59, 4, 'BMB');
      L.e('pigeon', 66, 8);
      L.pipe(70, 3);
      L.e('grumbug', 76);
      L.ground(85, 125);
      L.check(90);
      L.e('snail', 96);
      // Bear: on a flower balcony — the awning below bounces you up
      L.spring(102); L.semi(99, 107, 6); L.bear(101, 6);
      L.e('pigeon', 109, 9);
      L.row(112, R1, '?L?');
      L.e('snail', 118);
      L.ground(129, 232);
      L.e('grumbug', 136);
      L.spring(142); L.semi(146, 153, 9); L.spring(149, 9); L.coins(152, 3, 4);
      // off the second awning, drift right past the stars: a medal over the café roofs
      L.medal(157, 2);
      L.e('pigeon', 156, 9);
      L.e('snail', 164);
      L.row(168, R1, 'B?B');
      L.e('grumbug', 176);
      /* ---- the new half: the fountain, the busker, the balloon seller ---- */
      /* The fountain in the square: hop the rim and splash in. A medal at
         the bottom by the near wall; the jet in the middle (a steam plume,
         which reads as spray) whooshes him out, up to a balcony of stars */
      L.box(190, 12, 191, 16); L.water(191, 12, 200, 16); L.box(200, 12, 201, 16);
      L.medal(193, 15);
      L.steam(196, 9); L.semi(195, 205, 7); L.coins(200, 6, 4);
      L.check(205);
      /* The street musician's corner: hop up onto his blocks and run along
         them, and they play Frère Jacques (the gap is the rest). Nothing
         to dodge here: it's for the music */
      L.notes(209, 13, 'CDECCDECEFG EFG');
      L.coins(214, 11, 5);
      L.ground(236, 342);
      /* The balloon seller: a bunch to float up over the rooftops to the
         church roof, a ledge too high for any awning — no pigeons on the
         way up, so the ride is all joy */
      L.balloons(242, 14);
      L.coins(246, 12, 1); L.coins(250, 9, 1); L.coins(254, 6, 1);
      L.semi(253, 268, 3); L.coins(254, 2, 3); L.medal(258, 2); L.coins(261, 2, 6);
      L.e('snail', 266);
      // a café awning, up to a balcony of stars
      L.spring(276); L.semi(273, 281, 8); L.coins(274, 7, 6);
      L.e('pigeon', 286, 9);
      L.e('grumbug', 290);
      L.row(294, R1, '?L?');
      L.e('snail', 300);
      L.stairs(304, 4);
      L.goal(316);
    }
  });

  /* 24 — The Bakery. Conveyor belts of bread, dough that bounces, shelves
     to hop between — and croissants on the run. */
  add({
    name: 'THE BAKERY', theme: 'bakery', w: 322, seed: 244,
    build: function (L) {
      L.ground(0, 34);
      L.row(8, R1, '?P?');
      L.e('croissant', 18);
      L.conveyor(22, 32, 1);
      L.e('croissant', 28);
      L.ground(38, 70);
      L.conveyor(42, 52, -1);
      L.spring(56); L.semi(53, 62, 9); L.coins(54, 8, 7);
      L.e('croissant', 62);
      L.row(64, R1, 'B?B');
      L.plat(71, 14, 3, { fall: true });
      // over the gap, above the falling plate: jump from it, quick, before it goes
      L.medal(72, 8);
      L.ground(75, 116);
      L.check(79);
      L.e('croissant', 85); L.e('croissant', 92);
      L.conveyor(96, 108, 1);
      L.row(100, R1, 'BMB');
      // Bear: on the top shelf, up from the dough
      L.spring(111); L.semi(108, 115, 7); L.bear(110, 7);
      L.ground(120, 226);
      L.e('croissant', 126);
      L.row(132, R1, '?L?');
      L.e('croissant', 140);
      L.conveyor(146, 160, -1);
      L.e('croissant', 152);
      L.spring(164); L.semi(161, 170, 9); L.coins(162, 8, 7);
      L.e('croissant', 172);
      /* ---- the new half: the giant cake, the cooling racks, the cupboard ---- */
      L.check(177);
      /* The giant cake, right across the path: two tiers, each a jump high
         (4 rows, then 5), or a bounce off the dough on the bottom tier —
         and the cherry on top is a medal, a hop above the icing */
      L.box(188, 12, 200, 16, TL.HARD); L.box(191, 7, 197, 12, TL.HARD);
      L.spring(188, 12);
      L.coins(191, 6, 6); L.medal(194, 1);
      // a long belt the wrong way, with croissants riding it
      L.conveyor(210, 224, -1); L.e('croissant', 218);
      L.row(214, R1, 'B?B');
      // two plates over the cooling racks: each drops a moment after he lands
      L.plat(227, 14, 3, { fall: true }); L.plat(231, 13, 3, { fall: true });
      L.ground(235, 322);
      /* A shelf up the wall, reached off the dough: stars along it lead to
         a cupboard at its end, whose door is only painted on — walk in, and
         there's a medal on the shelf inside. (It's up out of the way: the
         floor below carries straight on.) */
      L.spring(241); L.semi(238, 252, 8); L.coins(240, 7, 6);
      L.box(248, 3, 254, 8, TL.HARD); L.secret(248, 4, 252, 8, 'hard'); L.medal(251, 6);
      L.row(262, R1, '?L?');
      L.e('croissant', 266);
      L.conveyor(272, 282, 1);
      L.e('croissant', 278);
      L.stairs(284, 4);
      L.goal(296);
    }
  });

  /* 25 — Cheese Caves. Down in the cellars: wheels of cheese come rolling,
     bats flit, and grumpy rocks wait under the roof. */
  add({
    name: 'CHEESE CAVES', theme: 'cheese', w: 332, seed: 255,
    build: function (L) {
      L.ceiling(0, 332, 2);
      L.ground(0, 36);
      L.row(8, R1, '?P?');
      L.e('cheese', 20); L.e('bat', 28, 7);
      L.ground(40, 74);
      L.e('cheese', 48);
      L.row(52, R1, 'B?B');
      L.e('rock', 58, 2);
      L.e('cheese', 62);
      L.pipe(68, 2);
      L.plat(75, 14, 3, { dx: 3, speed: 0.4 });
      // high over the gap: ride the platform and jump for it
      L.medal(78, 6);
      L.ground(82, 118);
      L.check(86);
      L.e('cheese', 94); L.e('bat', 100, 6);
      L.row(104, R1, 'BMB');
      // Bear: on a rack of cheeses — up the blocks, then a hop
      L.row(108, R1, 'BB'); L.semi(110, 116, 7); L.bear(112, 7);
      L.ground(122, 196);
      L.e('cheese', 130);
      L.row(136, R1, '?L?');
      L.e('rock', 140, 2);
      L.e('cheese', 144);
      L.e('bat', 150, 7);
      L.e('cheese', 158);
      L.e('cheese', 172);
      /* ---- the new half: the underground lake, the hollow roof ---- */
      L.e('bat', 188, 5);
      /* Up the steps to an underground lake: still and cold, with a medal
         glinting on the bottom. Dive in, or jump it */
      L.stairs(192, 4); L.ground(196, 230, 11);
      L.check(197, 11);
      L.water(201, 11, 213, 16); L.medal(207, 15);
      L.coins(197, 10, 3); L.coins(214, 10, 3);
      L.stairs(230, 4, -1);
      L.ground(230, 284);
      L.e('cheese', 242);
      /* A rack beside the path, under a dark patch of roof: a column of
         stars leads up from the rack into the rock — and the rock there is
         hollow. Jump on up into it for a medal (the roof's thicker there,
         so the medal is out of sight until he's inside) */
      L.row(246, R1, 'XX'); L.semi(248, 255, 8);
      L.box(248, 0, 255, 4); L.secret(249, 0, 254, 4); L.medal(251, 2);
      L.coins(251, 6, 1); L.coins(251, 5, 1); L.coins(251, 4, 1);
      L.e('rock', 264, 2);
      L.e('cheese', 270);
      L.row(272, R1, 'B?B');
      L.e('bat', 278, 6);
      L.ground(288, 332);
      L.stairs(292, 4);
      L.e('cheese', 300);
      L.goal(306);
    }
  });

  /* 26 — Paris Rooftops. From roof to roof over the streets below, with
     pigeons; a chimney's steam lifts you to the tallest roof. */
  add({
    name: 'PARIS ROOFTOPS', theme: 'roofs', w: 340, seed: 266,
    build: function (L) {
      L.ground(0, 30, 14);
      L.row(8, 9, '?P?');
      // up on the blocks and a jump: a medal over the very first roof
      L.medal(9, 4);
      L.e('pigeon', 22, 8);
      L.ground(34, 56, 12);
      L.pipe(40, 2, false, 12);
      L.e('grumbug', 46, 12);
      L.e('pigeon', 50, 6);
      L.ground(60, 74, 15);
      // the chimney's steam, right beside the tall house: up, and step across onto its roof
      L.steam(72, 9, 15);
      L.ground(74, 96, 7);
      L.coins(76, 6, 5);
      L.e('pigeon', 86, 3);
      L.e('grumbug', 90, 7);
      L.ground(100, 130, 12);
      L.check(103, 12);
      L.e('pigeon', 110, 6);
      L.row(112, 7, 'BMB');
      // Bear: on top of a chimney stack, a hop from its pots
      L.pipe(120, 3, false, 12); L.semi(122, 128, 6); L.bear(124, 6);
      L.ground(134, 160, 14);
      L.e('grumbug', 140, 14);
      L.steam(146, 7, 14); L.semi(143, 151, 7); L.coins(144, 6, 6);
      L.e('pigeon', 154, 8);
      L.ground(164, 184, 13);
      L.row(170, 8, '?L?');
      L.e('grumbug', 178, 13);
      /* ---- the new half: the attic, the balloons, the last roofs ---- */
      L.ground(188, 206, 12);
      L.check(190, 12);
      /* A taller house (5 rows: a jump) whose side wall faces this roof:
         part of the wall is an attic window with no glass — walk into it
         instead of jumping, and there's a medal in the attic */
      L.ground(206, 226, 7);
      L.secret(206, 8, 210, 12); L.medal(209, 10);
      L.coins(211, 6, 6);
      L.e('pigeon', 216, 3); L.e('grumbug', 221, 7);
      L.ground(230, 244, 11);
      /* Balloons caught on a TV aerial: float off over the rooftops — a
         trail of stars up, a line of them along the top, a medal at the end
         of it — and drift down three roofs on. No pigeons under the ride */
      L.balloons(235, 9);
      L.coins(238, 8, 1); L.coins(241, 5, 1);
      L.coins(244, 2, 16); L.medal(262, 2);
      L.ground(248, 262, 13);
      L.e('grumbug', 256, 13);
      L.ground(266, 282, 12);
      L.row(272, 8, '?L?');
      L.ground(286, 300, 14);
      L.pipe(291, 2, false, 14);
      L.e('grumbug', 296, 14);
      // down from the roofs to the street, where the Yeti's waiting
      L.ground(300, 340);
      L.goal(314);
    }
  });

  /* 27 — The Metro. Under the city: platforms, and trains to ride across
     the tracks between them; suitcases hop about, looking for their owners. */
  add({
    name: 'THE METRO', theme: 'metro', w: 342, seed: 277,
    build: function (L) {
      L.ceiling(0, 306, 3);
      L.ground(0, 40);
      L.row(9, R1, '?P?');
      L.e('suitcase', 20); L.e('suitcase', 32);
      L.plat(40, 14, 6, { dx: 6, speed: 0.55, look: 'train' });
      // over the tracks: jump from the train's roof for it
      L.medal(46, 9);
      L.ground(52, 86);
      L.e('suitcase', 60);
      L.row(64, R1, 'B?B');
      L.e('grumbug', 72);
      L.pipe(78, 2);
      L.plat(86, 14, 6, { dx: 4, speed: 0.6, look: 'train' });
      L.ground(96, 132);
      L.check(100);
      L.e('suitcase', 108);
      L.row(112, R1, 'BMB');
      // Bear: on top of the ticket machines
      L.row(116, R1, 'BB'); L.semi(118, 124, 7); L.bear(120, 7);
      L.plat(132, 14, 6, { dx: 6, speed: 0.55, look: 'train' });
      L.ground(144, 224);
      L.e('suitcase', 152); L.e('grumbug', 160);
      L.row(166, R1, '?L?');
      L.e('suitcase', 174); L.e('suitcase', 184);
      /* ---- the new half: the busker, another train, the closed station ---- */
      L.check(200);
      /* A busker in the corridor: hop up onto his notes and walk along
         them, and they play Au clair de la lune (the gaps are its rests).
         A medal hangs over the last note, too high to reach from the floor */
      L.notes(206, 13, 'CCCDE D CEDDC');
      L.coins(207, 11, 3);
      L.medal(219, 5);
      L.plat(224, 14, 6, { dx: 6, speed: 0.6, look: 'train' });
      L.ground(236, 272);
      /* An old closed station, bricked up behind the tiles: a raised
         platform across the path (5 rows: a jump), whose front isn't
         really there — walk into it for a medal */
      L.coins(246, 15, 3);
      L.box(252, 11, 262, 16); L.secret(252, 12, 256, 16); L.medal(255, 14);
      L.coins(256, 10, 5);
      L.e('suitcase', 267);
      L.plat(272, 14, 6, { dx: 5, speed: 0.6, look: 'train' });
      L.ground(283, 342);
      L.row(292, R1, 'B?B');
      L.e('suitcase', 300);
      // up the steps and out into the street
      L.stairs(306, 4);
      L.goal(316);
    }
  });

  /* 28 — The Eiffel Tower. All the way up: girders to climb, a lift to
     ride, pigeons at every level — and the Yeti somehow at the top.
     Made longer by making it taller: the first climb is as it was, 24 rows
     further down (o), and the old top is now the third deck, with a second
     lift, a fourth deck and a last climb above it to the summit — and
     room in the sky over the summit for a balloon ride. */
  add({
    name: 'EIFFEL TOWER', theme: 'tower', w: 246, h: 68, gr: 66, seed: 288,
    build: function (L) {
      var o = 24, g = 42 + o;
      L.start = { x: 3, row: g };
      // the ground only at the foot: beyond it, nothing but the city far below
      L.ground(0, 34, g);
      L.row(8, g - 5, '?P?');
      L.e('grumbug', 26, g);
      // the first climb: girders three rows apart, each overlapping the next
      L.semi(14, 23, 39 + o); L.semi(21, 30, 36 + o); L.semi(14, 23, 33 + o); L.semi(21, 30, 30 + o);
      L.coins(16, 38 + o, 4); L.coins(23, 35 + o, 4); L.coins(16, 32 + o, 4);
      // out past the end of a girder, hanging in the air: a leap left for it (the ground's below)
      L.medal(10, 31 + o);
      // the first deck
      L.box(30, 27 + o, 60, 29 + o);
      L.e('pigeon', 40, 22 + o);
      L.e('grumbug', 48, 27 + o);
      L.row(44, 22 + o, 'B?B');
      // Bear: on a girder out over the deck's edge
      L.semi(52, 58, 23 + o); L.bear(54, 23 + o);
      // the lift, up to the second deck
      L.plat(61, 26 + o, 3, { dy: -8, speed: 0.4 });
      L.box(65, 18 + o, 96, 20 + o);
      L.check(68, 18 + o);
      L.e('pigeon', 76, 13 + o);
      L.e('grumbug', 82, 18 + o);
      L.row(78, 13 + o, '?L?');
      // the climb to the third deck (the old top)
      L.semi(88, 97, 15 + o); L.semi(95, 104, 12 + o); L.semi(88, 97, 9 + o);
      L.coins(90, 14 + o, 4); L.coins(97, 11 + o, 4);
      // the old top, now the third deck, carries on out to a second lift
      L.box(97, 9 + o, 141, 11 + o);
      L.e('pigeon', 104, 4 + o);
      /* ---- the new half: the third deck, a second lift, the summit ----
         (written in plain rows: the third deck's top is row 33) */
      L.check(108, 33);
      L.row(114, 28, 'B?B');
      L.e('grumbug', 118, 33, { wait: 60 });
      /* A souvenir kiosk on the deck, 5 rows tall (a jump): its front is
         only painted on — walk in for a medal, out again, and over */
      L.box(124, 28, 130, 33, TL.HARD); L.secret(124, 29, 128, 33, 'hard'); L.medal(127, 31);
      L.coins(126, 27, 3);
      // a second lift, up to the fourth deck (row 23)
      L.plat(142, 32, 3, { dy: -9, speed: 0.4 });
      L.box(146, 23, 178, 25);
      L.e('pigeon', 154, 18);
      L.row(156, 18, 'B?B');
      L.e('grumbug', 162, 23);
      // the last climb, girder by girder, to the summit (row 14)
      L.semi(166, 174, 20); L.semi(172, 180, 17);
      L.coins(167, 19, 3); L.coins(175, 16, 3);
      L.box(182, 14, 246, 16);
      /* Balloons at the summit: float up into the sky over Paris for a
         medal no jump could reach (the summit sits far enough down to leave
         a sky above it), then drift down: held right, the ride ends floating
         down through the arch, for the most points there are */
      L.balloons(185, 12);
      L.coins(190, 9, 1); L.coins(193, 6, 1); L.coins(196, 2, 4); L.medal(201, 2);
      L.goal(220, 14);
    }
  });

  /* 29 — Disneyland Paris. The park! Bouncy castles, carousel horses
     riding up and down, spinning teacups, a parade float to ride, toy
     soldiers marching — and Bear up on the carousel's roof. */
  add({
    name: 'DISNEYLAND PARIS', theme: 'magic', w: 352, seed: 299,
    build: function (L) {
      L.ground(0, 64);
      L.row(9, R1, '?P?');
      L.e('soldier', 20);
      L.spring(26); L.semi(23, 32, 8); L.coins(24, 7, 7);
      L.e('soldier', 34);
      // the carousel: horses going up and down, and its roof to climb to
      [44, 48, 52, 56].forEach(function (x) { L.plat(x, 12, 2, { wave: 1.5, look: 'horse' }); });
      L.semi(42, 60, 6); L.coins(44, 5, 4); L.bear(52, 6);
      // the teacups, spinning over the pond
      [0, 2.0944, 4.1888].forEach(function (ph) { L.plat(70, 12, 3, { circle: 3, phase: ph, speed: 0.014, look: 'teacup' }); });
      L.ground(77, 110);
      L.check(81);
      L.e('soldier', 88); L.e('pigeon', 94, 9);
      L.row(96, R1, 'BMB');
      L.e('soldier', 104);
      // the parade float, back and forth along the parade route
      L.plat(110, 13, 5, { dx: 11, speed: 0.5, look: 'float' });
      // high over the parade route: jump from the float as it carries you under
      L.medal(118, 7);
      L.ground(126, 240);
      L.e('soldier', 134);
      L.spring(140); L.semi(137, 146, 8); L.coins(138, 7, 7);
      L.row(150, R1, '?L?');
      L.e('pigeon', 156, 9);
      L.e('soldier', 162); L.e('soldier', 172);
      L.row(176, R1, 'B?B');
      /* ---- the new half: the carousel organ, the balloons, the castle ---- */
      /* The carousel's organ: two rows of singing blocks, the second a hop
         higher — run along both and they play Ah ! vous dirai-je, maman
         (a French tune: the one the world knows as Twinkle Twinkle) */
      L.notes(192, 13, 'CCGGAAG');
      L.notes(199, 10, 'FFEEDDC'); L.coins(199, 9, 7);
      L.check(210);
      /* A balloon seller on Main Street: a bunch to float up over the
         parade, along a line of stars to a medal — and down again past it */
      L.balloons(222, 14);
      L.coins(225, 13, 1); L.coins(228, 11, 1); L.coins(231, 8, 1); L.coins(234, 5, 1); L.coins(237, 3, 1);
      L.coins(239, 2, 9); L.medal(249, 2);
      // the parade goes by below: another float, over the gap
      L.plat(241, 13, 5, { dx: 8, speed: 0.5, look: 'float' });
      L.ground(254, 352);
      /* The castle wall, 5 rows high, across the path, with a turret on
         top: a door in it is only painted on — walk in for a medal */
      L.box(272, 11, 282, 16, TL.HARD); L.secret(272, 12, 276, 16, 'hard'); L.medal(275, 14);
      L.pipe(278, 2, false, 11);
      L.coins(273, 10, 4);
      L.e('soldier', 290);
      // a bouncy castle, up to a ledge of stars
      L.spring(296); L.semi(293, 302, 8); L.coins(294, 7, 7);
      L.e('pigeon', 305, 9);
      L.row(306, R1, '?L?');
      L.stairs(312, 5);
      L.goal(326);
    }
  });

  /* 30 — Fireworks Night. The castle at night, fireworks overhead, toy
     soldiers on guard — and in the courtyard, Rascal the Fox with Brocco.
     He scampers and throws baguettes; when he leaps and lands in a dizzy
     heap, stomp him. Three stomps and Brocco is free.
     Longer only on the way in: the new stretch (the moat and the castle
     wall) goes after Bear's balcony, and everything from the presents to
     the courtyard moved along 100 tiles, unchanged. Its second flag is at
     the end of the new stretch, so after a fall in the fight the run back
     to the gate is as short as it was. */
  add({
    name: 'FIREWORKS NIGHT', theme: 'night', w: 312, seed: 3030, boss: true,
    build: function (L) {
      L.ground(0, 36);
      L.row(8, R1, '?P?');
      L.e('soldier', 20);
      L.spring(28); L.semi(25, 33, 8); L.coins(26, 7, 6);
      L.plat(37, 14, 3, { wave: 1 });
      L.ground(42, 80);
      L.e('soldier', 48); L.e('pigeon', 56, 9);
      L.row(60, R1, 'BB?BB');
      // up on the blocks and a jump: a medal among the fireworks
      L.medal(62, 5);
      L.e('soldier', 68);
      L.plat(81, 13, 3, { dx: 4, speed: 0.45 });
      L.ground(90, 120);
      L.check(94);
      L.e('soldier', 100); L.e('soldier', 110);
      L.row(104, R1, 'BSB');
      // Bear: on the castle's balcony, a hop from the blocks
      L.row(114, R1, 'BB'); L.semi(116, 120, 7); L.bear(117, 7);
      L.plat(121, 14, 3, { wave: 1 });
      /* ---- the new stretch: the moat and the castle wall ---- */
      L.ground(126, 150);
      // (he waits till Bonnie's off the waving platform: he'd be marching right where it lands)
      L.e('soldier', 144, undefined, { wait: 64 });
      L.row(138, R1, 'B?B');
      /* Up onto the bank, and the castle moat: a pontoon to hop across by,
         or splash in and dive for the medal on the bottom under it */
      L.ground(150, 196, 12);
      L.water(156, 12, 166, 16); L.semi(159, 163, 12); L.medal(161, 15);
      /* The castle wall (5 rows: a jump, or up the fanfare): blocks that
         play C E G C as he runs along them, and a door in the wall that's
         only painted on — walk in for a medal */
      L.notes(176, 9, 'CEGc');
      L.box(182, 7, 192, 12, TL.HARD); L.secret(182, 8, 186, 12, 'hard'); L.medal(185, 10);
      L.coins(186, 6, 5);
      L.ground(196, 312);
      L.check(202);
      L.e('soldier', 214);
      L.spring(218); L.semi(215, 223, 8); L.coins(216, 7, 6);
      L.e('pigeon', 228, 9);
      // the presents before the courtyard, as they always were
      L.row(232, R1, 'P'); L.row(236, R1, 'L');
      L.e('soldier', 246); L.e('pigeon', 252, 9);
      // the courtyard: the gate shuts behind you, and there's Rascal
      L.e('gate', 266, 15);
      L.e('fox', 296, 16, { ax0: 268, ax1: 306 });
      L.box(306, 2, 312, 16, TL.HARD);
    }
  });
})();
