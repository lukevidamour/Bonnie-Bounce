/* ==========================================================================

   ========================================================================== */
(function () {
  'use strict';
  var K = BB.levelKit, add = K.add, TL = K.TL, R1 = K.R1, R2 = K.R2;

  /* A line of stars from one tile to another, one in each column: the way
     a balloon ride drifts up and across, drawn so the eye follows it. */
  var trail = function (L, x0, r0, x1, r1) {
    for (var x = x0; x <= x1; x++) L.coins(x, Math.round(r0 + (r1 - r0) * (x - x0) / (x1 - x0)), 1);
  };

  /* ==========================================================================
     THE SECOND LAND — MAGPIE ISLES (levels 11–20)
     Captain Magpie has pinched Monsty's birthday presents and flown off
     across the sea. Each world has its own trick: boats that bob, jelly
     to bounce on, wind that pushes, crumbling stones, glowing mushrooms,
     swimming in a cave, sinking sand, the Moon's floaty jumps, a clock
     tower to climb, and the Captain himself on his sky ship.

     Every level runs about half as long again as it first did (17 Oct:
     Bonnie, with three hearts, was plowing straight through): the first
     part is as it was, then a new stretch in the same world's style before
     the finish, with something in it to find — a pool to swim, a balloon
     ride, musical blocks, a secret room. The checkpoint moved to the
     middle of the whole level, and the longest (11, 13, 18, the tower and
     the sky ship) have a second flag about three-quarters of the way
     along (the game restarts at the furthest flag he touched). Three
     golden medals hide in each: one in the first part, two in the new.

     A balloon ride carries Bonnie a long way: about 40 tiles if he walks
     into the bunch and steers on, 70 if he runs into it (more on the
     Moon, where the drift down is slower; up to 80 with a gust behind
     him on the cliffs). So wherever there's a bunch, the ground runs on
     unbroken past where the ride comes down — checked by riding it every
     way, 17 Oct. The stars
     and medal a ride is for sit along the line it rises on, no higher
     than row 3: rows 0–2 are under the hearts and the score.
     ========================================================================== */

  /* 11 — Sunset Harbour. Piers over the sea, and little boats bobbing on
     the waves to hop across. */
  add({
    name: 'SUNSET HARBOUR', theme: 'harbour', w: 346, seed: 111,
    build: function (L) {
      L.ground(0, 34);
      L.row(9, R1, '?P?');
      L.e('crab', 18); L.e('magpie', 26, 9);
      L.semi(34, 42, 16); L.coins(35, 13, 6);
      L.ground(42, 64);
      L.e('crab', 48); L.e('snail', 56);
      L.pipe(60, 3);
      L.plat(65, 15, 3, { bob: true });
      L.plat(70, 15, 3, { bob: true, dx: 4, speed: 0.4 });
      L.arc(66, 12, 9);
      // a medal just over the top of the arc: the boat-to-boat jump, held all the way up
      L.medal(70, 8);
      L.ground(78, 104);
      L.row(82, R1, 'BB?BB'); L.row(84, R2, 'M');
      L.e('magpie', 90, 9); L.e('crab', 96);
      L.semi(104, 112, 16); L.e('magpie', 108, 10); L.coins(105, 13, 6);
      L.ground(112, 141);
      L.e('snail', 118); L.e('crab', 124);
      L.row(127, R1, '?L?');
      // Bear: up the tall mooring post, then onto the lookout ledge
      L.pipe(134, 4); L.semi(136, 141, 8); L.bear(138, 8);
      L.plat(142, 15, 3, { bob: true }); L.plat(146, 14, 3, { bob: true });
      L.ground(151, 186);
      L.e('crab', 158); L.check(162); L.e('magpie', 165, 9);
      L.row(170, R1, 'B?B'); L.e('crab', 176);
      /* ---- new: the quay ----
         A rock pool on a sandbank, with a medal glinting at the bottom:
         hop over it, or jump in and swim down for it (a stroke at the top
         lifts him out onto the side). No stars in the water: a star is a
         tile of its own, and would leave a pocket of air behind. */
      L.box(186, 13, 200, 18);
      L.water(190, 13, 197, 17);
      L.medal(193, 15);
      /* The balloon seller's bunch on the quay: grab it and float up and
         away over the boats, along a trail of stars to a medal in the sky,
         then drift down onto the long pier. */
      L.ground(200, 214);
      L.balloons(206, 14);
      trail(L, 209, 12, 219, 4); L.medal(220, 3); trail(L, 237, 3, 246, 12);
      L.plat(217, 15, 3, { bob: true }); L.plat(222, 14, 3, { bob: true }); L.plat(227, 15, 3, { bob: true, dx: 3, speed: 0.4 });
      L.semi(235, 248, 16);
      /* Solid quay from here on, out past where even a running balloon
         ride comes down: no sea gap again until the jetty. */
      L.ground(248, 290);
      L.check(254);
      L.pipe(262, 3); L.e('crab', 268); L.row(266, R1, 'BMB');
      // the harbour wall, a jump high, with a magpie over it
      L.box(276, 12, 282, 16); L.coins(277, 11, 4); L.e('magpie', 284, 8);
      // a jetty over the water
      L.semi(291, 298, 13); L.coins(292, 11, 6);
      L.ground(300, 346);
      L.row(304, R1, '?B?'); L.e('crab', 308);
      L.stairs(312, 6);
      L.goal(326);
    }
  });

  /* 12 — Candy Meadow. Cake with pink frosting, cookie blocks, cotton-candy
     clouds, gummy bears — and jelly trampolines everywhere. */
  add({
    name: 'CANDY MEADOW', theme: 'candy', w: 330, seed: 122,
    build: function (L) {
      L.ground(0, 36);
      L.row(8, R1, '?P?');
      L.e('gummy', 18);
      L.spring(24); L.coins(23, 4, 4);
      L.semi(28, 34, 10); L.e('bee', 31, 6);
      L.semi(36, 40, 13);
      L.ground(40, 76);
      L.e('gummy', 46); L.e('gummy', 50);
      L.row(54, R1, 'BB?BB');
      L.spring(60); L.semi(58, 66, 5); L.coins(59, 4, 6);
      // a medal out past the end of the jelly's high cloud: a leap off its end
      L.medal(68, 3);
      L.e('bee', 68, 10);
      L.pipe(72, 3);
      L.semi(77, 81, 13);
      L.ground(82, 118);
      L.e('gummy', 92);
      // Bear: on the high cloud, from the jelly's big bounce
      L.spring(98); L.semi(96, 104, 7); L.coins(97, 6, 6); L.bear(102, 7);
      L.e('snail', 110); L.e('bee', 114, 11);
      L.semi(118, 122, 13);
      L.ground(122, 160);
      L.spring(126); L.row(130, R2, '?S?');
      L.e('gummy', 136); L.e('gummy', 140);
      L.row(146, R1, 'BMB');
      L.pipe(152, 3);
      L.check(157);
      L.semi(161, 165, 12);
      L.ground(166, 205);
      L.e('gummy', 172); L.e('bee', 178, 10);
      L.row(176, R1, 'L');
      /* ---- new: the birthday cake ----
         Stars run along the ground into the side of a big cake — and so
         can Bonnie: the frosting there is a secret wall, with a medal in
         the little room behind it. (Four rows tall, so big Bonnie fits;
         the cake's top is a jump high, so he can always go over.) */
      L.coins(183, 15, 3);
      L.box(187, 11, 199, 16);
      L.secret(187, 12, 191, 16);
      L.medal(189, 14);
      L.coins(191, 10, 6);
      /* Monsty's birthday tune, as a bridge of musical blocks over a gap:
         run across and it plays "Happy Birthday". The gaps are a single
         block wide, too narrow to fall through; both ends are over ground.
         A cloud leads onto it from the cake, so he steps on at the first note. */
      L.semi(199, 204, 13);
      L.notes(204, 13, 'CC D C F E CC D C G F');
      L.ground(224, 282);
      L.e('gummy', 246);
      // a scale up into the sky, one note higher each hop, to a cloud with a medal on it
      L.notes(236, 14, 'C'); L.notes(239, 13, 'D'); L.notes(242, 12, 'E'); L.notes(245, 11, 'F');
      L.notes(248, 10, 'G'); L.notes(251, 9, 'A'); L.notes(254, 8, 'B'); L.notes(257, 7, 'c');
      L.semi(259, 266, 6); L.coins(260, 5, 4); L.medal(265, 4);
      L.e('bee', 272, 10);
      L.row(276, R1, 'B?B');
      L.semi(283, 286, 13);
      L.ground(287, 330);
      L.e('gummy', 292);
      L.stairs(298, 6);
      L.goal(310);
    }
  });

  /* 13 — Windy Cliffs. Out on the white clifftops the wind gusts — first
     one way, then the other — and pushes Bonnie along (or back). */
  add({
    name: 'WINDY CLIFFS', theme: 'cliffs', w: 352, seed: 133, wind: true,
    build: function (L) {
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('snail', 18); L.e('magpie', 24, 9);
      L.ground(34, 62, 14);
      L.e('snail', 42, 14);
      L.row(46, 9, 'B?B');
      L.e('magpie', 52, 8);
      L.ground(62, 70, 12);
      L.coins(63, 10, 6);
      // a medal high over the gap after the ledge: a big jump off its end
      L.medal(72, 6);
      L.ground(75, 100);
      L.e('snail', 86);
      L.row(92, R1, '???');
      L.plat(101, 13, 3, { dx: 2, speed: 0.4 });
      L.ground(106, 140, 13);
      L.e('magpie', 112, 7); L.e('snail', 118, 13);
      L.row(122, 8, 'BSB');
      // Bear: on the ledge over the clifftop, out in the wind
      L.semi(126, 131, 9); L.bear(128, 9);
      L.ground(144, 200);
      L.e('snail', 150); L.check(155); L.e('magpie', 158, 9);
      L.row(162, R1, 'B?B?B');
      L.e('snail', 170);
      L.row(174, R1, 'L');
      /* ---- new: the high meadow ----
         Balloons on a windy clifftop: up he goes, and the wind takes him —
         one way or the other, depending on the gust — along the stars to a
         medal in the sky. A gust can carry a balloon ride a long way, so
         there's no gap for a long way either side: wherever he drifts down,
         he lands on grass (the last gap, the moving beam, is well past
         where any gust has carried him). */
      L.ground(200, 252, 14);
      L.balloons(208, 12);
      trail(L, 211, 10, 217, 4); L.medal(219, 3); L.coins(222, 4, 3); L.coins(227, 5, 3); L.coins(232, 6, 3);
      L.row(230, 9, 'B?B');
      /* A chalk outcrop with a cave in its foot: the stars on the grass run
         straight into it, and so can he. */
      L.coins(234, 13, 3);
      L.box(238, 9, 248, 14);
      L.secret(238, 10, 242, 14);
      L.medal(240, 13);
      L.ground(252, 296);
      L.check(255);
      L.e('magpie', 262, 9);
      L.e('snail', 270);
      // a drystone wall across the clifftop, a jump high
      L.box(278, 12, 281, 16); L.coins(278, 11, 3);
      L.e('magpie', 288, 9);
      L.plat(298, 14, 3, { dx: 3, speed: 0.4 });
      L.ground(305, 352);
      L.e('snail', 312);
      L.stairs(318, 6);
      L.goal(332);
    }
  });

  /* 14 — Jungle Ruins. The old stones of a friendly temple — some crumble
     away underfoot — boars, bats, and monkeys lobbing coconuts. */
  add({
    name: 'JUNGLE RUINS', theme: 'jungle', w: 336, seed: 144,
    build: function (L) {
      L.ground(0, 32);
      L.row(8, R1, '?P?');
      L.e('hog', 18);
      L.box(25, 13, 30, 16); L.e('monkey', 27, 13);
      L.plat(33, 14, 2, { fall: true }); L.plat(37, 13, 2, { fall: true });
      L.ground(41, 70);
      L.stairs(44, 3); L.ground(47, 56, 13);
      L.e('bat', 50, 3); L.e('hog', 60);
      L.row(62, R1, 'BB?BB'); L.row(64, R2, 'M');
      L.semi(70, 78, 10); L.coins(71, 9, 7);
      L.ground(78, 112);
      L.e('monkey', 90); L.e('bat', 96, 3); L.e('hog', 102);
      L.pipe(106, 3);
      L.plat(112, 14, 2, { fall: true }); L.plat(116, 13, 2, { fall: true }); L.plat(120, 12, 2, { fall: true });
      // a medal high over the last crumbling stone: leap up from it to the far side
      L.medal(123, 5);
      L.ground(124, 160);
      L.e('hog', 130);
      L.row(134, R1, '?S?');
      L.box(140, 13, 145, 16); L.e('monkey', 142, 13);
      // Bear: up from the monkey's block to the ledge above the ruins
      L.semi(146, 151, 9); L.bear(148, 9);
      L.e('bat', 152, 3);
      L.check(157);
      L.ground(164, 196);
      L.e('hog', 170); L.e('monkey', 178);
      L.row(176, R1, 'L');
      /* ---- new: the temple ---- */
      L.plat(198, 14, 2, { fall: true }); L.plat(202, 13, 2, { fall: true });
      L.ground(206, 262);
      /* The old temple: a jump high, with a monkey on its roof. Stars run
         along the ground into its wall — and through it, into a hidden
         room with a medal. */
      L.coins(208, 15, 4);
      L.box(212, 11, 232, 16, TL.HARD);
      L.secret(212, 12, 218, 16, 'hard');
      L.medal(216, 14);
      L.coins(220, 10, 3);
      L.e('monkey', 225, 11);
      L.e('bat', 230, 3);
      /* Crumbling stones climbing up to a high branch, with a medal at its
         end: keep hopping, they won't wait. Ground underneath all the way,
         so a stone that drops only means another go. */
      L.plat(240, 13, 2, { fall: true }); L.plat(244, 10, 2, { fall: true }); L.plat(248, 7, 2, { fall: true });
      L.semi(251, 257, 4); L.coins(252, 3, 3); L.medal(256, 3);
      L.plat(264, 14, 2, { fall: true }); L.plat(268, 13, 2, { fall: true });
      L.ground(272, 336);
      L.box(280, 13, 285, 16); L.e('monkey', 282, 13);
      L.row(288, R1, 'B?B');
      L.e('hog', 294);
      L.e('bat', 298, 3);
      L.stairs(302, 6);
      L.goal(316);
    }
  });

  /* 15 — Glowshroom Grove. Night in a wood of giant glowing mushrooms:
     bounce high on them, and mind the shy ghosts and bats. */
  add({
    name: 'GLOWSHROOM GROVE', theme: 'glow', w: 330, seed: 155,
    build: function (L) {
      L.ground(0, 34);
      L.row(8, R1, '?P?');
      L.e('ghost', 20, 10);
      L.spring(26); L.semi(24, 32, 7); L.coins(25, 6, 6);
      L.semi(34, 38, 13);
      L.ground(38, 74);
      L.e('bat', 44, 3); L.e('grumbug', 50);
      // Bear: on the high branch the big mushroom bounces you up to
      L.spring(56); L.semi(54, 62, 6); L.coins(55, 5, 5); L.bear(61, 6);
      L.e('ghost', 66, 9);
      L.row(68, R1, 'BMB');
      L.semi(74, 80, 12);
      L.ground(80, 112);
      L.e('grumbug', 90); L.e('grumbug', 93);
      L.spring(98); L.row(96, R2, '?S?');
      L.e('bat', 104, 3);
      L.pipe(108, 3);
      L.plat(113, 14, 3, { dx: 4, speed: 0.4 });
      // a medal over the gap: a high jump off the moving branch
      L.medal(118, 7);
      L.ground(121, 160);
      L.e('ghost', 128, 9);
      L.spring(134); L.semi(132, 140, 6); L.coins(133, 5, 6);
      L.e('bat', 144, 3); L.e('grumbug', 150);
      L.check(157);
      L.semi(160, 164, 12);
      L.ground(164, 232);
      L.row(168, R1, 'L');
      L.e('ghost', 174, 9); L.e('grumbug', 180);
      /* ---- new: up in the treetops ----
         A big mushroom bounces him up to a row of glowing musical blocks:
         walk along them and they play "Twinkle, Twinkle, Little Star" — with
         a medal waiting at the end of the tune. The big mushroom stands a
         little short of them: a bounce taken running right lands on the
         first note. A second one under the far end is for anyone who
         walked past the first. */
      L.spring(178);
      L.notes(185, 6, 'CCGGAAG FFEEDDC');
      L.spring(195);
      L.medal(199, 5);
      /* A mossy hill with a tunnel right through its foot, hidden: the stars
         lead in, and there's a medal halfway. The hill's top is a jump
         high, for anyone going over. */
      L.coins(206, 15, 3);
      L.box(210, 11, 224, 16);
      L.secret(210, 12, 224, 16);
      L.medal(217, 14);
      L.coins(212, 10, 10);
      L.e('bat', 228, 3);
      L.plat(234, 14, 3, { dx: 3, speed: 0.4 });
      L.ground(242, 280);
      L.e('ghost', 250, 9);
      L.spring(256); L.semi(254, 262, 6); L.coins(255, 5, 6);
      L.e('grumbug', 268);
      L.row(272, R1, 'B?B');
      L.semi(281, 285, 12);
      L.ground(286, 330);
      L.e('grumbug', 292);
      L.stairs(296, 6);
      L.goal(310);
    }
  });

  /* 16 — Crystal Lagoon. A cave under the sea: swim (tap to swim up),
     past glowing crystals, fish and drifting jellies. */
  add({
    name: 'CRYSTAL LAGOON', theme: 'lagoon', w: 316, seed: 166, water: true,
    build: function (L) {
      L.ceiling(0, 316, 2);
      L.ground(0, 60);
      L.row(10, R1, '?P?');
      L.box(18, 10, 22, 16); L.coins(18, 8, 4);
      L.e('fish', 28, 9);
      L.ceiling(30, 44, 6); L.coins(31, 8, 12);
      // a grotto up in the low rock: two stars point the way, swim up into it
      L.coins(37, 7, 1); L.coins(37, 6, 1);
      L.secret(36, 3, 39, 6); L.medal(37, 4);
      L.e('jelly', 40, 11);
      // Bear: on top of the tall crystal rock, in his bubble
      L.box(48, 8, 50, 16); L.bear(48, 8);
      L.e('fish', 54, 6);
      L.ground(64, 120);
      L.e('jelly', 70, 8);
      L.box(76, 12, 86, 16); L.ceiling(78, 88, 7); L.coins(79, 10, 7);
      L.e('fish', 92, 10);
      L.row(102, R1, 'BSB');
      L.e('jelly', 108, 6); L.e('fish', 114, 12);
      L.ground(124, 197);
      L.box(128, 3, 131, 10); L.box(136, 11, 139, 16); L.coins(132, 10, 4);
      L.e('fish', 142, 7); L.e('jelly', 150, 9);
      L.row(156, R1, 'L');
      L.check(158);
      L.e('fish', 164, 11); L.e('jelly', 172, 7);
      /* ---- new: the crystal caves ----
         A big crystal rock with a narrow crack down into it, a medal at the
         bottom — and a jelly drifting over the top. */
      L.box(180, 8, 192, 16);
      L.clear(185, 8, 187, 14);
      L.medal(185, 13);
      L.e('jelly', 186, 3);
      /* A low passage along the seabed whose floor, over a deep crevice, is
         a crystal xylophone: walk along it and it plays "Row, Row, Row Your
         Boat". The gap in it is one block wide, too narrow to sink through. */
      L.box(195, 2, 211, 12);
      L.notes(197, 16, 'CCCDE EDEFG');
      L.ground(208, 272);
      L.e('fish', 216, 8);
      /* A grotto in the foot of a great crystal rock: the stars on the
         seabed run into it. Swim in for the medal; out the way you came,
         and over the top. */
      L.coins(218, 14, 3);
      L.box(222, 6, 234, 16);
      L.secret(222, 11, 227, 16);
      L.medal(225, 14);
      L.e('jelly', 240, 9);
      L.e('fish', 250, 11);
      L.row(256, R1, 'B?B');
      L.box(262, 10, 265, 16); L.coins(262, 8, 3);
      L.e('jelly', 268, 6);
      L.ground(276, 316);
      L.e('fish', 280, 10);
      L.stairs(286, 5);
      L.goal(296);
    }
  });

  /* 17 — Dusty Dunes. Sand that sinks when you stand on it, a pyramid to
     climb, scorpions, and tumbleweeds bowling along. */
  add({
    name: 'DUSTY DUNES', theme: 'desert', w: 336, seed: 177,
    build: function (L) {
      L.ground(0, 36);
      L.row(8, R1, '?P?');
      L.e('scorpion', 18); L.e('tumble', 30);
      L.plat(37, 14, 3, { fall: true }); L.plat(42, 13, 3, { fall: true });
      L.ground(47, 80);
      L.stairs(50, 4); L.ground(54, 62, 12); L.stairs(62, 4, -1);
      L.e('scorpion', 66); L.e('tumble', 74);
      L.row(70, R1, 'BB?BB');
      L.plat(81, 14, 3, { fall: true });
      L.ground(85, 124);
      L.e('scorpion', 96);
      L.pipe(100, 3);
      L.e('tumble', 108);
      // Bear: on the ledge over the pyramid's top
      L.stairs(112, 5); L.stairs(117, 5, -1); L.semi(115, 120, 7); L.bear(116, 7);
      L.row(106, R2, '?S?');
      // a medal over the high blocks: from Bear's ledge, leap back onto them, then hop
      L.medal(107, 3);
      L.plat(125, 14, 3, { fall: true }); L.plat(129, 13, 3, { fall: true });
      L.ground(133, 200);
      L.e('scorpion', 138); L.e('tumble', 150);
      L.row(146, R1, 'BMB');
      L.e('scorpion', 160); L.e('tumble', 172);
      L.row(168, R1, 'L');
      L.check(180);
      /* ---- new: the oasis ----
         Sinking-sand rafts over an oasis: if one sinks under him, it's a
         splash rather than a fall, and he swims for the far side (a stroke
         at the top lifts him out). A medal lies on the bottom. */
      L.box(200, 13, 230, 18);
      L.water(203, 13, 227, 17);
      L.plat(205, 12, 3, { fall: true }); L.plat(210, 12, 3, { fall: true }); L.plat(215, 12, 3, { fall: true }); L.plat(220, 12, 3, { fall: true });
      L.medal(214, 15);
      L.ground(230, 268);
      // a scorpion between the oasis and a sandcastle tower, kept away from the pyramid's door
      L.e('scorpion', 234); L.pipe(240, 3);
      /* A pyramid on a plinth one jump high. Stars run along the sand into
         the plinth's side, and through it: a hidden chamber with a medal. */
      L.coins(246, 15, 3);
      L.box(250, 11, 268, 16, TL.HARD);
      L.secret(250, 12, 255, 16, 'hard');
      L.medal(253, 14);
      L.stairs(254, 5, 1, 11); L.stairs(259, 5, -1, 11);
      L.coins(257, 4, 4);
      L.plat(270, 14, 3, { fall: true }); L.plat(275, 13, 3, { fall: true });
      L.ground(280, 336);
      L.e('scorpion', 286);
      L.row(290, R1, 'B?B');
      L.e('tumble', 296);
      L.stairs(300, 7);
      L.goal(316);
    }
  });

  /* 18 — Moon Garden. On the Moon, jumps are long and floaty — so the gaps
     are wider and the ledges higher. */
  add({
    name: 'MOON GARDEN', theme: 'moon', w: 354, seed: 188, lowgrav: true,
    build: function (L) {
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('grumbug', 18);
      L.semi(24, 28, 9); L.coins(24, 8, 4);
      L.arc(31, 11, 7);
      L.ground(38, 64);
      L.e('ghost', 46, 9);
      // Bear: right up on the highest crater ledge
      L.semi(50, 54, 7); L.semi(56, 61, 3); L.coins(56, 2, 4); L.bear(59, 3);
      L.e('bat', 60, 6);
      L.arc(65, 11, 7);
      L.ground(72, 104);
      L.e('grumbug', 84); L.e('grumbug', 87);
      L.row(90, R2, 'B?B');
      L.e('ghost', 96, 8);
      L.plat(105, 12, 3, { dy: 4, speed: 0.4 });
      L.ground(114, 150);
      L.e('bat', 120, 4);
      L.row(124, R1, '?S?');
      L.e('grumbug', 132);
      L.semi(138, 142, 9); L.semi(144, 148, 5); L.coins(144, 4, 4);
      L.arc(151, 10, 7);
      // a medal high over the crater: a big moon leap from the top ledge
      L.medal(154, 3);
      L.ground(158, 200);
      L.check(160);
      L.e('ghost', 166, 9); L.e('grumbug', 172);
      L.row(176, R1, 'L');
      /* ---- new: the far side ---- */
      L.arc(201, 10, 9);
      /* Moon balloons: up into the dark, through a heart of stars with a
         medal in it, then the floatiest drift down of all. A moon ride
         carries a long way (about 45 tiles at a walk, 70 at a run), so the
         ground runs on unbroken well past it. */
      L.ground(210, 296);
      L.balloons(220, 14);
      // (the heart sits where a ride steered right reaches the top)
      L.row(231, 3, 'CC CC'); L.row(230, 4, 'CCC CCC'); L.row(230, 5, 'CCCCCCC');
      L.row(231, 6, 'CCCCC'); L.row(232, 7, 'CCC'); L.row(233, 8, 'C');
      L.medal(233, 4);
      L.e('ghost', 244, 9); L.e('bat', 254, 4);
      L.check(266);
      /* A moon rock that sings: chime blocks set in its top play as he
         walks across. And the stars on the dust run into its foot — a
         hidden room with a medal. */
      L.coins(272, 15, 3);
      L.box(276, 11, 286, 16);
      L.secret(276, 12, 280, 16);
      L.medal(278, 14);
      L.notes(276, 11, 'CEGcGECEGc');
      L.e('grumbug', 290);
      L.plat(298, 13, 3, { dx: 4, speed: 0.4 });
      L.ground(308, 354);
      L.e('ghost', 314, 9); L.e('grumbug', 318);
      L.stairs(320, 6);
      L.goal(334);
    }
  });

  /* 19 — Clockwork Tower. Up through the inside of a great clock: climb
     the beams, ride the belts, mind the crushers and the turning gear arm.
     Now taller: the first climb and the run across the beams are as they
     were, set o rows lower; from their end a second climb goes up the gear
     shaft to the belfry at the very top, where the chimes are. */
  add({
    name: 'CLOCKWORK TOWER', theme: 'clock', w: 318, h: 50, gr: 48, seed: 199,
    build: function (L) {
      var o = 14, g = 34 + o;
      L.start = { x: 3, row: g };
      L.ground(0, 30, g);
      L.row(8, g - 5, '?P?');
      /* the climb: girders three rows apart, each overlapping the one
         above, so a jump straight up always finds the next — no
         pixel-perfect leaps for small hands */
      L.semi(14, 23, 31 + o); L.semi(21, 30, 28 + o); L.semi(14, 23, 25 + o); L.semi(21, 30, 22 + o); L.semi(14, 23, 19 + o); L.semi(21, 30, 16 + o);
      L.coins(16, 30 + o, 4); L.coins(23, 27 + o, 4); L.coins(16, 24 + o, 4); L.coins(23, 21 + o, 4); L.coins(16, 18 + o, 4);
      L.box(30, 14 + o, 52, 16 + o);
      L.e('robot', 40, 14 + o);
      L.e('crusher', 46, 3 + o);
      L.row(50, 10 + o, 'X'); L.e('firebar', 50, 10 + o, { len: 3, speed: 0.02 });
      L.plat(53, 13 + o, 3, { dx: 3, speed: 0.45 });
      L.box(60, 14 + o, 80, 16 + o);
      L.conveyor(66, 76, -1, 14 + o);
      L.e('robot', 70, 14 + o);
      // Bear: on the beam above the belt
      L.semi(75, 80, 10 + o); L.bear(77, 10 + o);
      L.plat(81, 13 + o, 2, { dy: -4, speed: 0.4 });
      L.box(86, 10 + o, 104, 12 + o);
      L.e('robot', 94, 10 + o);
      L.row(98, 6 + o, 'BSB');
      // a medal over the high blocks: up onto them, then a hop
      L.medal(99, 3 + o);
      L.box(108, 14 + o, 140, 16 + o);
      L.e('robot', 116, 14 + o);
      L.conveyor(120, 132, 1, 14 + o);
      L.e('crusher', 126, 3 + o);
      L.row(134, 10 + o, 'L');
      /* ---- new: the gear shaft ----
         The floor at the foot of the second climb (the checkpoint's here),
         and girders up the shaft past a turning fire bar — keep to their
         left ends and it can't reach. */
      L.box(144, 14 + o, 168, 18 + o);
      L.check(150, 14 + o);
      L.semi(148, 157, 25); L.semi(154, 163, 22); L.semi(148, 157, 19); L.semi(154, 163, 16); L.semi(156, 166, 13);
      L.coins(150, 24, 4); L.coins(158, 21, 4); L.coins(150, 18, 4); L.coins(158, 15, 4);
      L.row(161, 19, 'X'); L.e('firebar', 161, 19, { len: 3, speed: 0.02 });
      /* Or a bunch of balloons bobbing over the floor, a jump up: catch it
         and float straight up the shaft, past a medal up in the rafters, and
         drift down onto the belfry. */
      L.balloons(144, 23);
      trail(L, 146, 19, 161, 6); L.medal(163, 3);
      /* The belfry, at the very top. A gearbox stands on the floor; the stars
         lead into its side, and there's a room in it with a medal. */
      L.box(168, 10, 200, 12);
      L.check(171, 10);
      L.e('crusher', 176, 1);
      L.coins(182, 9, 3);
      L.box(186, 5, 196, 10, TL.HARD);
      L.secret(186, 6, 190, 10, 'hard');
      L.medal(188, 8);
      /* The clock's chimes, as a bridge of musical blocks over the drop: walk
         across and they ring the Westminster quarters. Single gaps only,
         too narrow to fall through; both ends meet the floor. */
      L.notes(200, 10, 'AGFC FAGC AFGC CGAF');
      L.box(219, 10, 250, 12);
      L.e('robot', 232, 10);
      L.e('crusher', 238, 1);
      L.conveyor(240, 248, 1, 10);
      // a moving beam across the last drop
      L.plat(252, 10, 3, { dx: 3, speed: 0.45 });
      L.box(260, 10, 318, 12);
      L.row(266, 5, 'B?B');
      L.e('robot', 272, 10);
      L.e('crusher', 278, 1);
      L.stairs(286, 6, 1, 10);
      L.goal(298, 10);
    }
  });

  /* 20 — Magpie's Sky Ship. Across the deck of Captain Magpie's ship,
     high in the clouds — and at the stern, the Captain himself, with the
     sack of presents. He swoops and drops eggs; when he lands to rest,
     stomp him. Three stomps, and the presents are Monsty's again. */
  add({
    name: 'MAGPIE SKY SHIP', theme: 'ship', w: 336, seed: 2020, boss: true,
    build: function (L) {
      /* The run-up to the stern is D tiles longer: a new stretch of deck
         goes in after Bear's mast, and everything from there on — the
         power-ups before the gate, the gate, the Captain's crates, his
         flight path, the sack and the stern wall — is exactly as it was,
         D tiles further aft. */
      var D = 124;
      L.ground(0, 30);
      L.row(8, R1, '?P?');
      L.e('magpie', 18, 9);
      L.plat(31, 14, 3, { bob: true });
      L.ground(36, 70);
      L.e('magpie', 44, 8);
      L.pipe(48, 3);
      // a medal over the top of the mast: up onto it, then a jump straight up
      L.medal(49, 6);
      L.e('monkey', 56);
      L.row(60, R1, 'BB?BB');
      L.plat(71, 13, 3, { dx: 4, speed: 0.45 });
      L.ground(80, 113);
      L.e('magpie', 90, 9); L.e('magpie', 98, 7);
      L.row(94, R1, 'BSB');
      L.e('monkey', 104);
      // Bear: up the mast and onto the yard
      L.pipe(108, 3); L.semi(110, 113, 9); L.bear(111, 9);
      L.plat(114, 14, 3, { bob: true });
      /* ---- new: amidships ----
         The quarterdeck, a jump high, with the captain's cabin in its
         side: the stars on the deck run in through the wall, to a medal. */
      L.ground(118, 226);
      L.coins(127, 15, 3);
      L.box(131, 11, 143, 16);
      L.secret(131, 12, 135, 16);
      L.medal(133, 14);
      L.e('magpie', 140, 6);
      L.check(148);
      /* The ship's balloons: catch a bunch and float up to the crow's
         nest, high in the rigging, with a medal on it — then drift back
         down to the deck. */
      L.balloons(152, 14);
      trail(L, 154, 12, 157, 6); L.semi(157, 166, 5); L.coins(158, 4, 5); L.medal(164, 4);
      /* (The deck runs on unbroken well past where a balloon ride comes
         down, even a running one: the gap with the moving beam is after.) */
      L.e('monkey', 180);
      L.pipe(190, 4);
      L.row(198, R1, 'B?B'); L.e('magpie', 204, 9);
      L.check(207);
      L.e('monkey', 220);
      L.plat(228, 13, 3, { dx: 3, speed: 0.45 });
      L.ground(234, 212 + D);
      // the approach and the stern, as they were
      L.row(124 + D, R1, 'P'); L.row(128 + D, R1, 'L');
      // the stern: the gate closes behind you, the Captain wakes from his
      // nap on the crates and flies to and fro between ax0 and ax1
      L.e('gate', 168 + D, 15);
      L.box(183 + D, 12, 187 + D, 16, TL.CRATE);
      L.e('captain', 184 + D, 12, { ax0: 172 + D, ax1: 200 + D });
      L.e('sack', 200 + D);
      L.box(206 + D, 2, 212 + D, 16, TL.HARD);
    }
  });
})();
