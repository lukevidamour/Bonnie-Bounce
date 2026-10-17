/* ==========================================================================
   levels4.js — the fourth land, Holiday! (levels 31–35): the rest of the
   family's trip round France — the waterpark, surfing at Hossegor, the
   bike ride Bonnie learnt on, Puy du Fou and Saint-Malo, then the ferry
   home. Built with the kit from levels.js; see the top of that file for
   the commands. Each level ends at the family car, Mum and Dad beside it.
   ========================================================================== */
(function () {
  'use strict';
  var K = BB.levelKit, add = K.add, TL = K.TL, R1 = K.R1, R2 = K.R2;

  // a pool sunk into a deck: its floor at the bottom, water up to the deck's top
  var pool = function (L, x0, x1, top) { L.ground(x0, x1, 17); L.water(x0, top, x1, 17); };
  // a water slide: belts stepping down a row every three tiles, carrying Bonnie down at a lick
  var slide = function (L, x, row, steps) { for (var i = 0; i < steps; i++) L.conveyor(x + i * 3, x + i * 3 + 3, 1, row + i); };

  /* 31 — O'Gliss Park. A waterpark in the pines: poolside decks with pools
     sunk in them to swim across, swim rings to bounce up the slide towers,
     slides that whoosh you down, lilos bobbing on the long pool, water
     jets, rubber ducks. The decks are three rows up, so the pools are deep. */
  add({
    name: "O'GLISS PARK", theme: 'ogliss', w: 300, seed: 311,
    build: function (L) {
      var d = 13;
      L.start = { x: 3, row: d };
      L.ground(0, 26, d);
      L.row(9, d - 5, '?P?');
      L.e('duck', 18, d);
      // the first pool: in for a swim, and a hop out the other side
      pool(L, 26, 36, d);
      L.coins(28, d + 2, 6);
      L.ground(36, 80, d);
      L.e('duck', 41, d);
      // a swim ring bounces you up the first slide tower; the slide whooshes you down
      L.spring(47, d);
      L.box(49, 5, 54, d, TL.HARD);
      L.coins(49, 4, 5);
      L.medal(51, 2);
      slide(L, 54, 6, 7);
      L.e('gull', 66, 3);
      // the long pool: lilos to hop across (or a swim)
      pool(L, 80, 104, d);
      [82, 89, 96].forEach(function (x, i) { L.plat(x, d - 1, 3, { bob: true, look: 'lilo', dx: i === 1 ? 2 : 0, speed: 0.3 }); });
      L.arc(84, d - 4, 14);
      L.ground(104, 152, d);
      L.check(107, d);
      L.e('duck', 116, d);
      // a water jet up to a high deck of stars
      L.steam(122, 8, d); L.semi(119, 128, 5); L.coins(120, 4, 7);
      L.row(132, d - 5, '?L?');
      // the changing hut (hop over its roof — or find its secret door, and a medal inside)
      L.box(138, 8, 147, d, TL.HARD);
      L.clear(140, 9, 146, d);
      L.secret(138, 9, 140, d, 'hard');
      L.medal(143, 11);
      L.coins(141, 10, 2); L.coins(144, 10, 2);
      // the deep pool: something gold glints on the bottom
      pool(L, 152, 166, d);
      L.medal(158, 16);
      L.ground(166, 230, d);
      L.e('duck', 172, d);
      // the big slide tower; Bear's sunbathing on the very top
      L.spring(179, d);
      L.box(181, 5, 186, d, TL.HARD);
      L.bear(183, 5);
      slide(L, 186, 6, 7);
      L.e('gull', 200, 3);
      L.e('duck', 214, d);
      // balloons, for a float over the lazy river
      L.balloons(224, d - 2);
      L.ground(230, 236, 17); L.water(230, d, 250, 17); L.ground(236, 250, 17);
      L.coins(232, 3, 4); L.arc(238, 4, 10);
      L.ground(250, 300, d);
      L.e('duck', 256, d);
      L.stairs(262, 4, 1, d);
      L.goal(274, d);
    }
  });

  /* 32 — Surfing at Hossegor. A beach, and then the sea: step onto a
     surfboard at the water's edge and it carries you out over the big
     waves to the next stretch of beach — jump for the stars on the way,
     over the gulls. Fall in, and the board's waiting back at the shore. */
  add({
    name: 'HOSSEGOR SURF', theme: 'surf', w: 300, seed: 322,
    build: function (L) {
      L.ground(0, 34);
      L.row(9, R1, '?P?');
      L.e('crab', 18); L.e('gull', 26, 9);
      L.plat(32, 15, 3, { surf: 43, speed: 1.15, look: 'surfboard' });
      L.arc(44, 11, 6); L.arc(58, 10, 7); L.e('gull', 66, 11);
      L.ground(78, 114);
      L.check(82);
      L.e('crab', 90);
      L.row(94, R1, 'BMB');
      L.e('crab', 102);
      // Bear: up on the lifeguard's lookout, a hop from the steps
      L.stairs(106, 3); L.semi(108, 114, 9); L.bear(110, 9);
      // a dune with a secret nook in its side
      L.ground(114, 124, 11);
      L.clear(117, 12, 122, 16);
      L.secret(114, 12, 117, 16);
      L.medal(119, 14);
      L.plat(124, 15, 3, { surf: 47, speed: 1.2, look: 'surfboard' });
      L.arc(132, 10, 8); L.e('gull', 140, 10); L.arc(150, 9, 8); L.e('gull', 160, 11);
      L.ground(174, 232);
      L.e('crab', 180);
      // balloons: up over the beach, to a medal high in the sky
      L.balloons(186, 14);
      L.coins(190, 3, 6); L.medal(199, 2); L.coins(203, 3, 4);
      L.row(206, R1, '?L?');
      L.e('crab', 212); L.e('snail', 222);
      L.plat(231, 15, 3, { surf: 21, speed: 1.2, look: 'surfboard' });
      L.arc(238, 10, 8);
      L.ground(255, 300);
      L.check(258);
      L.e('crab', 262);
      // the last medal: on the beach-hut roofs
      L.semi(266, 272, 11); L.medal(268, 10);
      L.stairs(264, 2);
      L.goal(276);
    }
  });

  /* 33 — The Bike Ride. Bonnie on his bike! Dad runs alongside holding the
     seat — and then lets go, and off he goes on his own. Cycle paths
     through the pines, a musical bridge over the lake (ride across and it
     plays), the boardwalk over the dunes. The road's three rows up, so the
     lake underneath is deep enough to swim if he tumbles in. */
  add({
    name: 'THE BIKE RIDE', theme: 'bike', w: 330, seed: 333, bike: true,
    build: function (L) {
      var d = 13;
      L.start = { x: 3, row: d };
      L.ground(0, 110, d);
      L.e('dadrun', 1, d, { letgo: 30 });
      L.row(36, d - 5, '?P?');
      // a little bump in the road, then a gap to hop
      L.stairs(44, 2, 1, d); L.stairs(46, 2, -1, d);
      L.e('snail', 54, d);
      L.clear(62, d, 66, 18);
      L.arc(61, d - 3, 6); L.medal(63, d - 7);
      L.e('hog', 74, d); L.e('hog', 90, d);
      L.row(82, d - 5, 'B?B');
      // a hedge with a secret way in, and a medal inside
      L.box(96, 8, 104, d, TL.GROUND);
      L.clear(98, 9, 103, d);
      L.secret(96, 9, 98, d);
      L.medal(100, 11);
      // the lake, and the musical bridge across it: ride over and it plays
      L.ground(110, 140, 17); L.water(110, d, 140, 17);
      L.notes(110, d, 'CDEFGAGFEDCDEFGABcBAGFEDCCDEFG');
      L.e('gull', 124, 6);
      L.ground(140, 330, d);
      L.check(146, d);
      L.e('crab', 156, d);
      // the boardwalk over the dunes
      L.ground(160, 176, 10); L.semi(176, 186, 10); L.ground(186, 196, 10);
      L.e('crab', 168, 10); L.coins(177, 8, 8);
      // a balloon seller by the beach: up, and a medal in the sky
      L.balloons(204, d - 2);
      L.coins(208, 2, 5); L.medal(216, 2); L.coins(220, 2, 5);
      L.e('hog', 214, d);
      // Bear, at the picnic spot up on the bank
      L.stairs(226, 3, 1, d); L.semi(229, 235, 6); L.bear(231, 6);
      L.clear(240, d, 245, 18);
      L.arc(239, d - 4, 7);
      L.e('snail', 252, d); L.e('hog', 266, d);
      L.row(258, d - 5, '?L?');
      L.stairs(280, 2, 1, d); L.stairs(282, 2, -1, d);
      L.e('crab', 292, d);
      L.goal(304, d);
    }
  });

  /* 34 — Puy du Fou. The castle grounds: knights who take two stomps,
     falcons swooping from the falconry show, catapults that fling you over
     the castle walls, a chariot race across the arena, the Viking longship
     to sail across the lake. */
  add({
    name: 'PUY DU FOU', theme: 'puydufou', w: 320, seed: 344,
    build: function (L) {
      L.ground(0, 90);
      L.row(9, R1, '?P?');
      L.e('knight', 20);
      L.e('falcon', 30, 8);
      // the castle wall: too tall to jump — the catapult flings you over
      L.e('spring', 38, 16, { fling: 1 });
      L.box(44, 7, 48, 16, TL.HARD);
      L.coins(44, 6, 4);
      L.e('knight', 58);
      L.row(62, R1, 'B?B');
      L.e('falcon', 70, 8);
      L.check(80);
      // the arena: two chariots racing to and fro across it
      L.plat(90, 14, 4, { dx: 22, speed: 1.0, look: 'chariot' });
      L.plat(116, 12, 4, { dx: -22, speed: 0.8, look: 'chariot' });
      L.arc(96, 10, 8); L.arc(108, 9, 8); L.medal(104, 6);
      L.ground(120, 172);
      L.e('knight', 128);
      // the castle keep: a secret door in its wall, a medal inside
      L.box(136, 7, 148, 16, TL.HARD);
      L.clear(138, 9, 146, 16);
      L.secret(136, 9, 138, 16, 'hard');
      L.medal(142, 13); L.coins(139, 12, 2); L.coins(144, 12, 2);
      // up onto its battlements by catapult: Bear's keeping watch
      L.e('spring', 127, 16, { fling: 1 });
      // (or the long way up: onto these blocks, and a jump to the battlements)
      L.row(132, R1, 'BB');
      L.bear(140, 7);
      L.e('falcon', 156, 7);
      L.e('knight', 162);
      // the lake: sail across on the Viking longship
      L.plat(172, 14, 6, { dx: 16, speed: 0.5, look: 'longship' });
      L.e('falcon', 184, 8);
      L.ground(194, 320);
      L.e('knight', 202); L.e('knight', 216);
      L.row(208, R1, '?L?');
      // the tournament tower: a catapult, and a medal at the top
      L.e('spring', 222, 16, { fling: 1 });
      L.box(230, 8, 234, 16, TL.HARD);
      L.row(226, R1, 'B');
      // the catapult throws you right through this one
      L.medal(231, 3);
      L.e('falcon', 246, 8); L.e('knight', 254);
      L.check(258);
      L.e('knight', 270); L.e('falcon', 280, 9);
      L.stairs(284, 4);
      L.goal(296);
    }
  });

  /* 35 — Saint-Malo. Along the granite ramparts with the corsairs, down
     to the beach at low tide, across the stepping stones to the fort,
     a swim in the sea pool, through the old town — and to the ferry home. */
  add({
    name: 'SAINT-MALO', theme: 'stmalo', w: 330, seed: 355,
    build: function (L) {
      var top = 10;
      // the ramparts: a high walk along the city wall
      L.start = { x: 3, row: top };
      L.ground(0, 60, top);
      L.row(10, top - 5, '?P?');
      L.e('corsair', 22, top); L.e('gull', 32, 5); L.e('corsair', 40, top);
      // Bear: on the lookout above the wall walk
      L.semi(48, 54, 6); L.bear(50, 6);
      // down the steps to the beach
      L.stairs(60, 6, -1);
      L.ground(66, 100);
      L.e('crab', 74);
      L.check(80);
      L.row(86, R1, 'B?B');
      L.e('crab', 92);
      // the stepping stones across to the fort, at low tide
      [102, 107, 112, 117].forEach(function (x) { L.plat(x, 15, 2, { bob: true }); });
      // the fort's rock, and its little tower to hop over, a medal on top
      L.box(122, 12, 134, 16, TL.HARD);
      L.box(127, 8, 130, 12, TL.HARD);
      L.medal(128, 6); L.coins(123, 11, 3); L.coins(131, 11, 3);
      [137, 142, 147].forEach(function (x) { L.plat(x, 15, 2, { bob: true }); });
      L.ground(152, 330);
      L.e('crab', 156);
      // the sea pool: jump in off its wall, swim, climb out the other side; a medal on the bottom
      L.box(160, 13, 162, 17, TL.HARD); L.box(180, 13, 182, 17, TL.HARD);
      L.ground(162, 180, 17); L.water(162, 13, 180, 17);
      L.medal(171, 16); L.coins(165, 14, 4); L.coins(174, 14, 4);
      L.e('gull', 186, 8);
      // the old town: corsairs, and balloons over the rooftops
      L.e('corsair', 196); L.row(200, R1, '?L?');
      L.balloons(212, 14);
      L.coins(216, 2, 6); L.arc(224, 4, 10);
      // a town house: hop its roof, or find its secret door — a medal inside
      L.box(226, 11, 236, 16, TL.HARD);
      L.clear(228, 12, 234, 16);
      L.secret(226, 12, 228, 16, 'hard');
      L.medal(231, 14);
      L.e('corsair', 240); L.e('crab', 246);
      L.check(250);
      L.row(256, R1, 'BMB');
      L.e('corsair', 266); L.e('gull', 274, 8);
      // the ferry quay: the Yeti's in the queue for the boat home
      L.stairs(280, 3);
      L.goal(298);
    }
  });
})();
