/* ==========================================================================
   levels5.js — the fifth land, One Day… (levels 36–45): the levels Bonnie
   designed himself, aged six (20 Oct) — the things he'd like to do one
   day. His list: a Pokémon level, Universal Studios Florida (the family's
   going next year), New York, Jamaica, Antarctica, Australia, "on a
   rainbow", a land of chocolate, a land of dinosaurs, and a land of bees
   with Queen Bee as the boss. He drew some of the cast too: the squirrel
   that throws nuts, the walking chocolate bar, the cross palm tree, the
   butterfly, the Christmas tree, the building with eyes and the polar
   bear (creatures5a.js), and two things to find in the blocks: his
   bullet ('R' in L.row — it zooms you along) and the heart that gives you
   a second one ('L').

   The story: Queen Bee's bees carried off Bonnie's One Day list, and his
   wishes fluttered out over the world. Each level ends with a wish caught
   on the finishing arch, and the paper aeroplane he folded waiting to fly
   him on. Built with the kit from levels.js (the commands are explained
   at the top of that file).
   ========================================================================== */
(function () {
  'use strict';
  var K = BB.levelKit, add = K.add, TL = K.TL, R1 = K.R1, R2 = K.R2;

  // a pool sunk into the ground: its floor at the bottom, water up to the ground's top
  var pool = function (L, x0, x1, top) { L.ground(x0, x1, 17); L.water(x0, top === undefined ? 16 : top, x1, 17); };
  /* a river (or pool, or billabong) between two banks: the land rises up
     to the banks (row `top`, the water's surface) on steps, the water fills
     x0..x1-1 down to a floor at the bottom, and steps lead down again */
  var river = function (L, x0, x1, top) {
    var up = 16 - top;
    L.stairs(x0 - up - 2, up); L.ground(x0 - 2, x0, top);
    L.ground(x0, x1, 17); L.water(x0, top, x1, 17);
    L.ground(x1, x1 + 2, top); L.stairs(x1 + 2, up, -1);
  };
  // a patch of long grass, n clumps wide, the Pokémon (if any) in its middle clump
  var meadow = function (L, x, n, mon, row) { for (var i = 0; i < n; i++) L.e('grass', x + i * 2, row, i === (n >> 1) && mon ? { mon: mon } : {}); };

  /* 36 — Pokémon Meadow. Bonnie's first wish: to be a Pokémon trainer.
     Pikachu runs along behind him the whole way. Long grass rustles as he
     goes through it, and out pop wild Pokémon — Bulbasaur, Charmander,
     Squirtle, Jigglypuff, Eevee, Psyduck — that run off: catch up and
     touch one to catch it (they go in the Pokédex, in the sticker book).
     Zubat swoop, Ekans slither, and Bonnie's butterflies flutter by. */
  add({
    name: 'POKEMON MEADOW', theme: 'pokemon', w: 312, seed: 361,
    build: function (L) {
      L.e('buddy', 1, 16, { mon: 'pikachu' });
      L.ground(0, 62);
      L.row(10, R1, '?P?');
      meadow(L, 16, 5, 'bulbasaur');
      L.e('ekans', 32);
      L.e('butterfly', 38, 9);
      L.row(42, R1, 'B?B');
      // a ledge to jump down, the way routes have them
      L.ground(48, 62, 13); L.stairs(45, 3);
      L.e('ekans', 54, 13);
      meadow(L, 50, 4, null, 13);
      L.arc(62, 11, 5);
      L.ground(66, 126);
      meadow(L, 70, 5, 'charmander');
      L.e('zubat', 82, 10);
      // the first medal: up on the high blocks, over the long grass
      L.row(86, R1, 'BB'); L.row(90, R2, 'BBBB'); L.coins(90, 5, 4); L.medal(93, 4);
      L.e('ekans', 96);
      L.deco1('pokecentre', 100);
      // Bear: sunning himself on the Pokémon Centre's roof (a hop from the blocks)
      L.row(98, R1, 'B'); L.semi(101, 108, 9); L.bear(104, 9);
      L.e('butterfly', 112, 9);
      L.check(116);
      L.row(122, R1, '?L?');
      /* Jigglypuff's hill: a row of musical blocks up to her patch of
         grass — she does love to sing */
      L.notes(126, 13, 'CEGECEGc');
      L.ground(134, 160, 13);
      meadow(L, 136, 5, 'jigglypuff', 13);
      L.e('zubat', 148, 8);
      L.ground(160, 220);
      L.e('ekans', 166);
      /* A rocky hillside with a cave mouth that's only rock to look at:
         walk in, and there's a medal inside (Zubat's roost) */
      L.box(176, 11, 188, 16);
      L.clear(179, 12, 187, 16);
      L.secret(176, 12, 179, 16);
      L.medal(184, 14); L.coins(180, 13, 3);
      L.e('butterfly', 194, 8);
      meadow(L, 196, 5, 'squirtle');
      L.pipe(208, 3);
      L.e('ekans', 214);
      L.check(218);
      // balloons over the meadow, to a medal in the clouds
      L.balloons(224, 14);
      L.ground(220, 312);
      L.coins(228, 3, 5); L.medal(236, 2); L.coins(240, 3, 4);
      meadow(L, 232, 5, 'eevee');
      L.e('zubat', 248, 10);
      L.row(252, R1, 'B?B');
      L.e('ekans', 258);
      meadow(L, 262, 5, 'psyduck');
      L.e('butterfly', 274, 9);
      L.stairs(280, 3);
      L.goal(290);
    }
  });

  /* 37 — Universal Studios. Where the family's going next year: past the
     spinning globe, Minions up to mischief everywhere, a ride on the
     Hogwarts Express over the lake, a roller-coaster car dipping over the
     gap, film sets, popcorn, and Bonnie's palm trees on the march. And the
     first of Bonnie's bullets: grab it and zoom. */
  add({
    name: 'UNIVERSAL STUDIOS', theme: 'universal', w: 320, seed: 372,
    build: function (L) {
      L.ground(0, 64);
      L.deco1('globe', 6);
      L.row(16, R1, '?P?');
      L.e('minion', 26); L.e('minion', 32);
      L.e('palmtree', 44);
      L.row(48, R1, 'B?B');
      L.e('minion', 54);
      // the roller coaster: a car that dips and rises over the gap
      L.plat(65, 14, 4, { dx: 18, wave: 2, speed: 0.75, look: 'coaster' });
      L.arc(70, 9, 10);
      // a medal at the top of the coaster's climb: jump for it from the car
      L.medal(80, 7);
      L.ground(88, 150);
      L.check(92);
      // Bonnie's bullet, and a long run of Minions to zoom through
      L.row(98, R1, 'R');
      L.e('minion', 108); L.e('minion', 114); L.e('minion', 120); L.e('palmtree', 128);
      L.coins(104, 13, 24);
      /* A sound stage: a big studio building — over its roof (a medal on
         top), or in through the painted-on door to the film set inside */
      L.box(136, 10, 148, 16, TL.HARD);
      // (steps up to the roof, leaving the way to the door clear)
      L.stairs(128, 4);
      L.medal(142, 8);
      L.clear(138, 11, 147, 16);
      L.secret(136, 11, 138, 16, 'hard');
      L.coins(139, 13, 3);
      // Bear, inside on the set
      L.bear(144, 16);
      L.ground(150, 160, 12); L.stairs(148, 2, 1, 16);
      // the lake: the Hogwarts Express steams across the bridge
      L.ground(160, 200, 17); L.water(160, 14, 200, 17);
      L.plat(160, 12, 6, { dx: 30, speed: 0.6, look: 'express' });
      L.arc(170, 8, 12);
      L.ground(200, 320); L.ground(200, 206, 12); L.stairs(206, 3, -1);
      L.check(204);
      L.e('palmtree', 214);
      L.spring(222); L.semi(219, 227, 8); L.coins(220, 7, 6);
      L.e('minion', 232); L.e('minion', 236);
      // balloons from the popcorn stand, up over the park to a medal
      L.balloons(244, 14);
      L.coins(248, 3, 4); L.medal(256, 2); L.coins(260, 3, 4);
      L.row(264, R1, '?L?');
      L.e('palmtree', 272); L.e('minion', 280);
      L.stairs(286, 3);
      L.goal(298);
    }
  });

  /* 38 — New York. Christmas in the city, snow on everything: taxis to
     ride over the gaps in the bridge, steam from the manholes, a
     window-cleaner's cradle up a skyscraper to the rooftops, Central Park
     — and Bonnie's squirrel throwing nuts, his walking Christmas trees,
     and the block of flats with eyes. */
  add({
    name: 'NEW YORK', theme: 'newyork', w: 320, seed: 383,
    build: function (L) {
      L.ground(0, 60);
      L.row(10, R1, '?P?');
      L.e('pigeon', 22, 9);
      L.e('building', 30);
      L.steam(38, 7); L.semi(35, 42, 8); L.coins(36, 7, 5);
      L.e('xmastree', 48);
      // the bridge over the river, half built: taxis carry you over the gaps
      L.ground(60, 64, 12); L.stairs(57, 3);
      pool(L, 64, 120, 15);
      L.semi(76, 84, 12); L.semi(96, 104, 12);
      L.plat(64, 10, 4, { dx: 8, speed: 0.55, look: 'taxi' });
      L.plat(84, 10, 4, { dx: 8, speed: 0.6, look: 'taxi' });
      L.plat(104, 10, 4, { dx: 9, speed: 0.55, look: 'taxi' });
      L.arc(88, 6, 8);
      // a medal: under the bridge, on the riverbed
      L.medal(92, 16);
      L.ground(120, 176);
      L.stairs(120, 3, -1, 16);
      L.check(126);
      L.e('building', 134);
      L.row(138, R1, 'B?B');
      /* A skyscraper: ride the window-cleaner's cradle up its side to the
         roof, where the stars (and Bear) are */
      L.box(150, 4, 160, 16, TL.HARD);
      L.plat(146, 14, 3, { dy: -10, speed: 0.4, look: 'cradle' });
      L.coins(151, 3, 8);
      L.bear(156, 4);
      L.e('xmastree', 166);
      L.steam(170, 6);
      // Central Park: the squirrels, and a secret in the rocks
      L.ground(176, 320);
      L.e('squirrel', 184); L.e('squirrel', 196);
      L.box(202, 11, 212, 16);
      L.clear(204, 12, 211, 16);
      L.secret(202, 12, 204, 16);
      L.medal(208, 14); L.coins(205, 13, 2);
      L.row(216, R1, 'R');
      L.check(222);
      L.e('squirrel', 232); L.e('building', 244); L.e('xmastree', 254);
      L.coins(226, 13, 30);
      // the big Christmas tree, and a medal at the top of its star (from the steam)
      L.deco1('bigxmastree', 262);
      L.steam(268, 9); L.medal(269, 6);
      L.row(272, R1, '?L?');
      L.e('pigeon', 280, 9);
      L.stairs(286, 3);
      L.goal(298);
    }
  });

  /* 39 — Jamaica. A white beach and a turquoise sea; Bonnie's cross palm
     trees stomping about; a bamboo raft down the jungle river; and the
     big one, climbing up the waterfall, step by step through its pools.
     Steel drums to bounce on, hummingbirds darting. */
  add({
    name: 'JAMAICA', theme: 'jamaica', w: 310, seed: 394,
    build: function (L) {
      L.ground(0, 52);
      L.row(10, R1, '?P?');
      L.e('crab', 20); L.e('palmtree', 30);
      L.e('hummingbird', 38, 9);
      L.spring(42); L.semi(39, 47, 8); L.coins(40, 7, 6);
      // the river: bamboo rafts to ride (or a swim), and a medal on the bottom
      L.ground(52, 116);
      river(L, 54, 90, 14);
      L.plat(55, 14, 3, { dx: 12, speed: 0.45, look: 'raft' });
      L.plat(73, 14, 3, { dx: 13, speed: 0.5, look: 'raft' });
      L.arc(60, 10, 8); L.medal(75, 16);
      L.check(100);
      L.e('palmtree', 106);
      L.row(108, R1, 'B?B');
      /* Dunn's River Falls: rock terraces stepping up, each with a pool on
         it held in by a lip of rock, the water tumbling down behind — climb
         it, pool by pool */
      // the water tumbling over each terrace's edge, down to the one below
      [[114, 16], [122, 14], [130, 12], [138, 10]].forEach(function (c) { L.e('cascade', c[0], c[1], { w: 3, h: 4 }); });
      [[116, 14], [124, 12], [132, 10], [140, 8]].forEach(function (st) {
        L.ground(st[0], st[0] + 8, st[1]);
        L.box(st[0], st[1] - 1, st[0] + 1, st[1], TL.HARD);
        L.water(st[0] + 1, st[1] - 1, st[0] + 8, st[1]);
        L.coins(st[0] + 3, st[1] - 3, 3);
      });
      // (the top pool's far side: a lip of rock)
      L.box(147, 7, 148, 8, TL.HARD); L.water(141, 7, 147, 8);
      // Bear, on the top of the falls
      L.ground(148, 158, 8);
      L.bear(152, 8);
      L.e('hummingbird', 150, 4);
      L.stairs(158, 8, -1); L.ground(158, 310);
      L.check(170);
      L.e('crab', 178); L.e('palmtree', 186);
      // a beach shack with a secret back room
      L.box(194, 11, 204, 16, TL.HARD);
      L.clear(196, 12, 203, 16);
      L.secret(194, 12, 196, 16, 'hard');
      L.medal(200, 14); L.coins(197, 13, 2);
      L.e('hummingbird', 212, 9);
      L.spring(218); L.coins(219, 4, 3);
      L.balloons(226, 14);
      L.coins(230, 3, 5); L.medal(238, 2); L.coins(242, 3, 4);
      L.row(246, R1, '?L?');
      L.e('palmtree', 254); L.e('crab', 262);
      L.e('palmtree', 272);
      L.stairs(280, 3);
      L.goal(290);
    }
  });

  /* 40 — Antarctica. Ice everywhere (slippy!), penguins sliding, Bonnie's
     polar bear (two stomps), icy slides that whoosh you down, ice floes
     to hop across the freezing sea — mind the orcas leaping — and the
     southern lights overhead. */
  add({
    name: 'ANTARCTICA', theme: 'antarctica', w: 310, seed: 405, ice: true,
    build: function (L) {
      L.ground(0, 56);
      L.row(10, R1, '?P?');
      L.e('penguin', 24);
      L.e('polarbear', 36);
      L.row(44, R1, 'B?B');
      L.e('xmastree', 50);
      // the sea: ice floes to hop across, and an orca leaping over the gap
      [58, 66, 74, 82, 90].forEach(function (x) { L.plat(x, 14, 3, { bob: true, look: 'floe' }); });
      L.e('orca', 62, 15, { span: 9, phase: 0 });
      L.e('orca', 78, 15, { span: 8, phase: 130 });
      L.arc(66, 9, 6); L.medal(86, 10);
      L.ground(96, 146);
      L.check(100);
      L.e('penguin', 110); L.e('polarbear', 122);
      // up the ice cliff, and the slide back down: whee!
      L.stairs(128, 5);
      L.ground(133, 146, 11);
      L.bear(140, 11);
      L.conveyor(146, 158, 1, 11);
      L.ground(158, 310);
      L.stairs(158, 5, -1, 16);
      L.e('penguin', 170);
      // an igloo with a secret way in
      L.box(178, 11, 188, 16, TL.HARD);
      L.clear(180, 12, 187, 16);
      L.secret(178, 12, 180, 16, 'hard');
      L.medal(184, 14); L.coins(181, 13, 2);
      L.check(194);
      L.e('polarbear', 204); L.e('xmastree', 214);
      L.balloons(222, 14);
      L.coins(226, 3, 5); L.medal(234, 2); L.coins(238, 3, 4);
      L.row(242, R1, '?L?');
      L.e('penguin', 252); L.e('polarbear', 264);
      L.stairs(280, 3);
      L.goal(290);
    }
  });

  /* 41 — Australia. The outback, red earth and gum trees: sit in a
     kangaroo's pouch and bound along (huge jumps — and if anything bumps
     you, the kangaroo takes it); emus racing, kookaburras laughing, crocs
     in the billabong; and at the end, Sydney Harbour and the Opera House. */
  add({
    name: 'AUSTRALIA', theme: 'australia', w: 320, seed: 416,
    build: function (L) {
      L.ground(0, 66);
      L.e('roo', 12);
      L.row(18, R1, '?P?');
      L.e('emu', 30);
      L.e('kookaburra', 40, 8);
      // a high mesa: easy in a pouch (or up the blocks)
      L.box(46, 8, 58, 16);
      L.row(42, R1, 'BB');
      L.coins(48, 7, 8); L.medal(56, 6);
      L.e('emu', 64);
      // the billabong: crocs at the surface — hop the logs over them
      river(L, 70, 100, 14);
      L.e('croc', 78, 14); L.e('croc', 88, 14);
      L.semi(74, 77, 12); L.semi(82, 86, 11); L.semi(91, 95, 12);
      L.arc(72, 9, 6); L.arc(90, 9, 6);
      // something gold on the bottom of the billabong, between the crocs
      L.medal(84, 16);
      L.ground(104, 160);
      L.check(104);
      L.e('roo', 110);
      L.e('emu', 122);
      // up a gum tree's branches to Bear (a kangaroo's jump, or three hops)
      L.semi(128, 133, 12); L.semi(131, 136, 8); L.semi(134, 139, 4);
      L.bear(136, 4);
      L.e('kookaburra', 144, 7);
      L.row(150, R1, 'R');
      L.ground(160, 320);
      L.e('emu', 168); L.e('emu', 180);
      L.coins(156, 13, 26);
      // a termite mound with a secret door
      L.box(190, 11, 200, 16);
      L.clear(192, 12, 199, 16);
      L.secret(190, 12, 192, 16);
      L.medal(196, 14); L.coins(193, 13, 2);
      L.check(206);
      L.e('roo', 212);
      L.e('kookaburra', 222, 8);
      L.row(228, R1, '?L?');
      L.e('emu', 240);
      // Sydney Harbour: the Opera House across the water
      river(L, 252, 266, 14);
      L.plat(252, 13, 3, { dx: 10, speed: 0.5 });
      L.arc(255, 9, 8);
      L.e('kookaburra', 274, 8);
      L.deco1('operahouse', 276);
      L.goal(296);
    }
  });

  /* 42 — On a Rainbow. High in the sky: clouds to stand on, cloud
     springs, Bonnie's butterflies, and the paint pots — touch red and the
     red blocks are solid (the others just dotted lines); yellow, and the
     yellow ones; blue, the blue. A pot of gold at the end. */
  add({
    name: 'ON A RAINBOW', theme: 'rainbow', w: 310, seed: 427,
    build: function (L) {
      L.ground(0, 40);
      L.row(10, R1, '?P?');
      L.e('butterfly', 22, 9);
      // the first paint pot: red, and a red bridge over the gap
      L.e('paintpot', 30);
      L.row(40, 16, 'rrrrrrrr'); L.ground(48, 80);
      L.coins(41, 14, 6);
      L.e('butterfly', 56, 8);
      L.spring(62); L.semi(59, 67, 8); L.coins(60, 7, 6);
      L.medal(63, 4);
      // yellow: a yellow staircase up to the next cloud
      L.e('paintpot', 72, 16, { c: 'y' });
      L.row(80, 16, 'yyyy'); L.row(84, 14, 'yyyy'); L.row(88, 12, 'yyyy');
      L.ground(92, 130, 12);
      L.check(96, 12);
      L.e('butterfly', 104, 7);
      L.row(108, 7, 'B?B');
      /* a yellow wall: solid while he's yellow — the blue pot's up on the
         cloud, and blue makes the wall go, and the blue steps come */
      for (var wy = 4; wy < 12; wy++) L.row(124, wy, 'y');
      L.semi(114, 120, 9); L.e('paintpot', 117, 9, { c: 'b' });
      L.row(130, 14, 'bbbb'); L.row(134, 16, 'bbbb');
      L.ground(138, 200);
      L.e('butterfly', 146, 9);
      L.row(150, R1, '?L?');
      // Bear on a cloud above the rainbow, from the cloud spring
      L.spring(160); L.semi(158, 166, 8); L.semi(162, 168, 4); L.bear(165, 4);
      L.e('butterfly', 172, 9);
      // a cloud bank with a secret way in
      L.box(178, 11, 188, 16);
      L.clear(180, 12, 187, 16);
      L.secret(178, 12, 180, 16);
      L.medal(184, 14); L.coins(181, 13, 2);
      L.check(194);
      // red to the island, then yellow over the rest
      L.e('paintpot', 196, 16, { c: 'r' });
      L.row(200, 16, 'rrrrrr');
      L.ground(206, 210, 14);
      L.e('paintpot', 208, 14, { c: 'y' });
      L.row(210, 14, 'yyyyyy');
      L.ground(216, 310);
      L.e('butterfly', 222, 9);
      L.balloons(230, 14);
      L.coins(234, 3, 5); L.medal(242, 2); L.coins(246, 3, 4);
      L.e('butterfly', 256, 8);
      L.row(262, R1, 'B?B');
      L.deco1('potofgold', 272);
      L.stairs(278, 3);
      L.goal(290);
    }
  });

  /* 43 — Chocolate Land. Everything's chocolate: Bonnie's chocolate bars
     on the march, marshmallow springs, hot-chocolate geysers that blow you
     up high, biscuit platforms that drop when you stand on them, and a
     river of chocolate to wade (or swim). */
  add({
    name: 'CHOCOLATE LAND', theme: 'chocolate', w: 312, seed: 438,
    build: function (L) {
      L.ground(0, 52);
      L.row(10, R1, '?P?');
      L.e('choc', 22); L.e('choc', 30);
      L.spring(38); L.semi(35, 43, 8); L.coins(36, 7, 6);
      L.e('choc', 46);
      // biscuits over the gap: they drop a moment after you land
      [54, 60, 66].forEach(function (x) { L.plat(x, 13, 2, { fall: true, look: 'biscuit' }); });
      L.arc(55, 10, 12);
      L.ground(72, 114);
      L.check(76);
      L.e('choc', 84); L.e('gummy', 92);
      // a hot-chocolate geyser up to a medal
      L.steam(98, 9); L.semi(95, 102, 6); L.medal(98, 4); L.coins(96, 5, 6);
      L.row(106, R1, 'R');
      L.e('choc', 114);
      // the chocolate river
      river(L, 120, 150, 13);
      L.plat(124, 12, 3, { dx: 8, speed: 0.45 }); L.plat(138, 12, 3, { dx: -6, speed: 0.4 });
      L.medal(135, 16);
      L.ground(152, 312);
      L.e('choc', 156);
      // a cake with a secret door, Bear inside having a nibble
      L.box(164, 11, 176, 16, TL.HARD);
      L.clear(166, 12, 175, 16);
      L.secret(164, 12, 166, 16, 'hard');
      L.bear(172, 16); L.coins(167, 13, 3);
      L.check(182);
      L.e('choc', 190); L.e('gummy', 198);
      L.spring(206); L.semi(203, 211, 8); L.coins(204, 7, 6);
      L.steam(216, 8);
      L.balloons(224, 14);
      L.coins(228, 3, 5); L.medal(236, 2); L.coins(240, 3, 4);
      L.row(246, R1, '?L?');
      L.e('choc', 254); L.e('choc', 262); L.e('gummy', 270);
      L.stairs(280, 3);
      L.goal(292);
    }
  });

  /* 44 — Dinosaur Land. Eggs that hatch as you pass — the babies follow
     you all the way; triceratops charging; a pterodactyl to grab and fly
     over the jungle; and at the very end, the T. rex chase. (There's a flag
     just before it. Run!) */
  add({
    name: 'DINOSAUR LAND', theme: 'dinosaurs', w: 330, seed: 449,
    build: function (L) {
      L.ground(0, 64);
      L.row(10, R1, '?P?');
      L.e('egg5', 18);
      L.e('trike', 30);
      L.e('egg5', 40);
      L.row(46, R1, 'B?B');
      L.e('trike', 56);
      // the tar pit: a pterodactyl to grab, and it flies you over
      L.ground(64, 70);
      L.e('ptero', 66, 11, { dist: 22 });
      L.ground(96, 160);
      // stars along the flight, and a medal on the way (he hangs at about row 11)
      L.coins(72, 11, 10); L.medal(84, 11); L.coins(86, 11, 6);
      L.check(100);
      L.e('egg5', 108);
      L.e('trike', 118);
      // a fossil cliff with a secret cave
      L.box(126, 10, 138, 16);
      L.clear(128, 11, 137, 16);
      L.secret(126, 11, 128, 16);
      L.medal(134, 13); L.coins(129, 12, 3);
      // Bear: on top of the cliff
      L.row(122, R1, 'BB'); L.bear(132, 10);
      L.e('trike', 146);
      L.row(150, R1, 'R');
      L.ground(160, 166);
      L.e('ptero', 162, 11, { dist: 18 });
      L.coins(168, 11, 14);
      L.ground(186, 330);
      L.e('trike', 196);
      L.balloons(204, 14);
      L.coins(208, 3, 5); L.medal(216, 2); L.coins(220, 3, 4);
      L.row(224, R1, '?L?');
      L.e('egg5', 232);
      // the flag before the chase
      L.check(240);
      /* THE T. REX: he wakes as Bonnie passes 248 and gives chase; past
         310 the way's too narrow for him, and he gives up */
      L.e('trex', 236, 16, { wake: 248, stop: 304 });
      L.coins(252, 13, 40);
      L.row(262, R1, 'B'); L.row(276, R1, 'B');
      L.stairs(300, 2); L.ground(302, 330, 14);
      L.goal(316, 14);
    }
  });

  /* 45 — Bee Land. Bonnie, as small as a bee, among giant flowers: honey
     that sticks to your feet, worker bees buzzing, flower springs, honeycomb
     — and in the hive's throne room, Queen Bee, with Bonnie's list. */
  add({
    name: 'BEE LAND', theme: 'beeland', w: 312, seed: 4545, boss: true,
    build: function (L) {
      L.ground(0, 60);
      L.row(10, R1, '?P?');
      L.e('honeybee', 24, 10);
      L.e('honey', 30, 16, { w: 3 });
      L.spring(40); L.semi(37, 45, 8); L.coins(38, 7, 6);
      L.e('honeybee', 50, 9);
      // giant flower heads to hop across
      L.semi(60, 64, 13); L.semi(67, 71, 11); L.semi(74, 78, 13);
      L.ground(60, 82, 17);
      L.medal(69, 7);
      L.ground(82, 130);
      L.check(86);
      L.e('honeybee', 96, 10);
      L.e('honey', 100, 16, { w: 4 });
      L.row(106, R1, 'B?B');
      // Bear, on a daisy's head
      L.semi(112, 117, 9); L.stairs(109, 3); L.bear(114, 9);
      L.e('honeybee', 120, 8);
      // a honeycomb wall with a secret cell
      L.box(130, 11, 142, 16, TL.HARD);
      L.clear(132, 12, 141, 16);
      L.secret(130, 12, 132, 16, 'hard');
      L.medal(137, 14); L.coins(133, 13, 3);
      L.ground(130, 312);
      L.e('honeybee', 150, 10);
      L.spring(158); L.semi(155, 163, 8);
      L.e('honey', 168, 16, { w: 3 });
      L.balloons(176, 14);
      L.coins(180, 3, 5); L.medal(188, 2); L.coins(192, 3, 4);
      L.e('honeybee', 200, 9);
      L.check(206);
      L.e('honeybee', 216, 10); L.e('honeybee', 228, 9);
      L.row(232, R1, 'P'); L.row(238, R1, 'L');
      L.e('honeybee', 248, 10);
      // the throne room, inside the hive: a honeycomb roof over it, the gate shuts behind you, and there's Queen Bee
      L.box(258, 0, 306, 3, TL.HARD);
      for (var hx = 260; hx < 306; hx += 6) L.box(hx, 3, hx + 2, 4, TL.HARD);
      L.e('gate', 266, 15);
      L.deco1('throne', 294);
      L.e('queenbee', 296, 16, { ax0: 268, ax1: 306 });
      L.box(306, 2, 312, 16, TL.HARD);
    }
  });
})();
