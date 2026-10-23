/* ==========================================================================
   levels6.js — the sixth land, HALF TERM! (levels 46–55): autumn half term
   and a fun Halloween. Luke asked for it on 23 Oct — "for anything
   halloween dont make it too scary… he loves the Disney Haunted Mansion /
   Nightmare Before Christmas vibe, so keep it fun and lighthearted" — and
   for levels "a little trickier and longer… more to do, so he doesn't
   rush through them… lots of fun, wonder and discovery".

   So these are longer than the last land's (about 450 tiles, two flags
   each), with more to find: three golden medals and Bear in every level,
   a secret way in or through in most, and a set piece of their own —
   a kite over a valley, the curly hill unrolling, the stretching room,
   a broomstick flight, a firework ride into the sky.

   The story: Bonnie found the biggest pumpkin ever at the pumpkin patch;
   that night the Witch magicked it away for her soup. He follows her
   trail through half term, knocking at a spooky-cute house at the end of
   each level for a sweet — TRICK OR TREAT! — up to her crooked tower.
   The ghost dog he finds in Pumpkin Town (50) floats along behind him for
   the rest of the land. Built with the kit from levels.js (the commands
   are explained at the top of that file); the new set pieces are
   explained in game.js, under HALF TERM!.
   ========================================================================== */
(function () {
  'use strict';
  var K = BB.levelKit, add = K.add, TL = K.TL, R1 = K.R1;

  // a horse chestnut: its branch to stand on, and conker cases hanging under it to drop on your head
  var chestnut = function (L, x, n, row) {
    row = row === undefined ? 9 : row;
    L.deco1('oak', x);
    L.semi(x, x + 5, row);
    for (var i = 0; i < n; i++) L.e('conker', x + 1 + i * 2, row + 1);
  };
  // a house on Trick or Treat Street: its front door ({ give, who }), and sometimes a spider from the eaves
  var house = function (L, x, give, who, spider) {
    L.deco1('crookedhouse', x);
    L.e('door', x + 1, 16, { give: give, who: who });
    if (spider) L.e('spider', x + 3, 8, { len: 4 });
  };
  // a windmill's four sails going round its hub (tiles), r tiles out
  var windmill = function (L, x, row, r, speed) {
    for (var i = 0; i < 4; i++) L.plat(x, row, 3, { circle: r, spokes: true, phase: i * Math.PI / 2, speed: speed || 0.011 });
  };
  // a run of ghost platforms, each 3 wide, taking turns to be there ([x, row] pairs)
  var ghosts = function (L, list) { list.forEach(function (g, i) { L.e('ghostplat', g[0], g[1], { w: 3, beat: i % 2 }); }); };
  // a little room inside a block, its door a secret wall on the left
  var den = function (L, x0, y0, x1) {
    L.box(x0, y0, x1, 16);
    L.clear(x0 + 2, y0 + 1, x1 - 1, 16);
    L.secret(x0, y0 + 1, x0 + 2, 16);
  };

  /* 46 — Pumpkin Patch. Half term, a golden afternoon on the farm: leaf
     piles to jump in (one hides a medal), scarecrows hopping on their
     poles, crows, pumpkins rolling down the hill from the cart at the top
     (land on one — boing!), a corn rick with a secret way in, and the hay
     cart over the ditch. */
  add({
    name: 'PUMPKIN PATCH', theme: 'pumpkinpatch', w: 448, seed: 461,
    build: function (L) {
      L.ground(0, 52);
      L.row(10, R1, '?P?');
      // the first leaf pile has stars under it
      L.e('leafpile', 18, 16); L.coins(19, 15, 2);
      L.e('scarecrow', 28);
      L.e('puddle', 34, 16);
      L.e('crow', 40, 9);
      L.e('leafpile', 45, 16);
      // the pumpkin hill: up the terraces, with pumpkins tumbling down at you
      L.ground(52, 64, 14); L.ground(64, 76, 12); L.ground(76, 94, 10);
      L.e('scarecrow', 70, 12);
      L.coins(78, 8, 4);
      L.deco1('wheelbarrow', 89, 10);
      L.e('pumpcart', 90, 10, { every: 150 });
      L.medal(84, 4);
      L.ground(94, 104, 13); L.ground(104, 176);
      L.e('leafpile', 97, 13);
      L.e('crow', 110, 9);
      L.row(114, R1, 'B?B');
      L.e('puddle', 118, 16);
      L.e('scarecrow', 124);
      /* A corn rick: bounce up over it — or find the secret way in at its
         foot, to a medal and stars */
      L.spring(128);
      den(L, 134, 10, 148);
      L.medal(144, 14); L.coins(138, 13, 4);
      L.e('scarecrow', 141, 10);
      L.stairs(148, 3, -1);
      L.check(158);
      L.e('leafpile', 164, 16);
      L.e('scarecrow', 170);
      // the ditch: ride the hay cart over it, the crows flapping round
      L.plat(177, 14, 4, { dx: 15, speed: 0.6, look: 'haycart' });
      L.arc(182, 10, 10);
      L.e('crow', 188, 8);
      L.ground(198, 268);
      L.e('puddle', 202, 16);
      L.row(208, R1, '?L?');
      L.e('scarecrow', 216); L.e('scarecrow', 228);
      // an apple tree: Bear, up on its top branch
      L.deco1('oak', 236);
      L.semi(234, 240, 12); L.semi(238, 244, 9); L.semi(244, 249, 6);
      L.bear(246, 6);
      L.e('leafpile', 252, 16);
      L.e('crow', 258, 9);
      // the big pumpkin hill
      L.ground(268, 278, 14); L.ground(278, 288, 12); L.ground(288, 298, 10); L.ground(298, 314, 8);
      L.e('rollpump', 292, 10);
      L.deco1('wheelbarrow', 309, 8);
      L.e('pumpcart', 310, 8, { every: 130 });
      L.coins(300, 5, 6);
      L.ground(314, 326, 11); L.ground(326, 448);
      L.check(332);
      L.e('leafpile', 338, 16);
      L.e('scarecrow', 346); L.e('crow', 352, 8);
      L.row(356, R1, 'BPB');
      L.e('puddle', 362, 16); L.e('puddle', 368, 16);
      // a row of leaf piles: one of them is hiding the last medal
      L.e('leafpile', 374, 16); L.e('leafpile', 380, 16); L.e('leafpile', 386, 16);
      L.medal(387, 15);
      L.e('scarecrow', 394); L.e('scarecrow', 402);
      L.e('crow', 406, 9);
      L.coins(396, 12, 6);
      L.stairs(416, 3);
      L.goal(428);
    }
  });

  /* 47 — Conker Woods. Misty golden woods: horse chestnuts dropping their
     spiky cases (a shiny conker rolls out of each), hedgehogs to curl up
     and bowl along, squirrels throwing acorns, a brook with a medal on its
     bed, sleepy owls that flap you up into the treetops, a hollow stump,
     and a ravine of sinking logs. */
  add({
    name: 'CONKER WOODS', theme: 'conkerwood', w: 456, seed: 472,
    build: function (L) {
      L.ground(0, 60);
      L.row(10, R1, '?P?');
      L.e('hedgehog', 22);
      chestnut(L, 28, 2);
      L.e('puddle', 40, 16);
      L.e('squirrel', 46);
      L.e('leafpile', 52, 16);
      // the brook: stepping stones over it, and a medal on the bottom
      L.ground(60, 80, 17); L.water(60, 15, 80, 17);
      L.row(63, 14, 'XX'); L.row(69, 13, 'XX'); L.row(75, 14, 'XX');
      L.coins(63, 12, 2); L.coins(69, 11, 2); L.coins(75, 12, 2);
      L.medal(72, 16);
      L.ground(80, 268);
      L.e('hedgehog', 86); L.e('hedgehog', 94);
      chestnut(L, 100, 3);
      L.row(108, R1, 'B?B');
      // a sleepy owl: stand on him and he flaps you up into the treetops
      L.plat(114, 15, 3, { lift: 9, look: 'owl' });
      L.semi(118, 146, 6); L.coins(120, 4, 10);
      L.e('squirrel', 130, 6);
      L.bear(142, 6);
      // a hollow stump: over the top — or in through its side, for a medal
      L.spring(146);
      den(L, 150, 11, 160);
      L.medal(156, 14); L.coins(153, 13, 3);
      L.check(164);
      L.e('puddle', 170, 16);
      L.e('hedgehog', 178);
      chestnut(L, 184, 3);
      L.e('squirrel', 194);
      chestnut(L, 200, 2);
      L.e('leafpile', 210, 16); L.coins(211, 15, 2);
      L.row(216, R1, '?L?');
      L.e('hedgehog', 222); L.e('squirrel', 230);
      // the second owl, to a lone high branch and a medal
      L.plat(236, 15, 3, { lift: 11, look: 'owl' });
      L.semi(240, 244, 4); L.medal(242, 2);
      chestnut(L, 248, 3);
      L.e('leafpile', 258, 16);
      // the ravine: logs that sink when you land on them — keep hopping!
      L.plat(270, 13, 2, { fall: true, back: true }); L.plat(275, 12, 2, { fall: true, back: true });
      L.plat(280, 13, 2, { fall: true, back: true }); L.plat(285, 12, 2, { fall: true, back: true });
      L.coins(275, 10, 2); L.coins(285, 10, 2);
      L.ground(290, 456);
      L.check(296);
      L.e('hedgehog', 304);
      chestnut(L, 310, 3);
      L.e('squirrel', 320);
      L.e('puddle', 326, 16);
      // toadstools up to a path through the branches
      L.spring(332); L.semi(336, 352, 7); L.coins(337, 5, 8);
      L.e('hedgehog', 344);
      chestnut(L, 356, 2);
      L.e('squirrel', 366); L.e('hedgehog', 372);
      L.row(378, R1, 'BMB');
      L.e('leafpile', 386, 16); L.e('puddle', 392, 16);
      chestnut(L, 398, 3);
      L.e('squirrel', 408);
      L.stairs(420, 3);
      L.goal(434);
    }
  });

  /* 48 — Windy Hill. Blustery and bright: the wind gusts one way and the
     other (the leaves show it coming), runaway umbrellas, crows, kites to
     hang from — the only way over the two valleys — windmills to ride, a
     great sycamore spinning its seeds down like helicopters, and stepping
     stones of turf over a gap, in the gusts. */
  add({
    name: 'WINDY HILL', theme: 'windyhill', w: 448, seed: 483, wind: true,
    build: function (L) {
      L.ground(0, 56);
      L.row(10, R1, '?P?');
      L.e('brolly', 26, 9);
      L.e('crow', 40, 8);
      L.e('leafpile', 46, 16);
      // up the hill, terrace by terrace
      L.ground(56, 66, 14); L.ground(66, 76, 12); L.ground(76, 86, 10); L.ground(86, 108, 8);
      L.e('crow', 72, 6);
      L.coins(88, 6, 6);
      L.deco1('windsock', 96, 8);
      L.e('brolly', 100, 4);
      // the first valley: grab the kite's tail and the wind takes you over (a medal in the sky on the way)
      L.e('kite', 104, 8, { dist: 30 });
      L.medal(124, 4);
      L.ground(140, 236, 10);
      L.check(146);
      L.e('brolly', 156, 6);
      L.e('crow', 164, 5);
      // a windmill: ride its sails up to Bear, on a ledge by its cap
      windmill(L, 176, 5, 3);
      L.semi(182, 188, 4); L.bear(185, 4);
      L.e('leafpile', 194, 10);
      L.row(198, 6, 'B?B');
      // the great sycamore: its seeds spin down — catch one and float
      L.deco1('oak', 210, 10);
      L.e('seedtree', 214, 2, { every: 90 });
      L.e('crow', 224, 6);
      // stepping stones of turf over the gap, in the gusts (a medal above them)
      L.ground(240, 243, 12); L.ground(246, 249, 11); L.ground(252, 255, 12); L.ground(258, 261, 11);
      L.medal(250, 7);
      L.ground(264, 330, 12);
      L.check(270);
      L.e('brolly', 280, 7);
      L.e('crow', 290, 6);
      L.e('leafpile', 296, 12);
      L.row(302, 7, '?L?');
      // the second valley, wider: another kite
      L.e('kite', 318, 12, { dist: 34 });
      L.coins(330, 5, 3); L.coins(340, 4, 3);
      L.ground(360, 448, 14);
      L.e('brolly', 368, 8);
      // a hay barn on the hill, with a secret way in: the last medal
      L.box(374, 9, 388, 14); L.clear(376, 10, 387, 14); L.secret(374, 10, 376, 14);
      L.medal(384, 12); L.coins(378, 11, 3);
      L.spring(370, 14);
      L.e('crow', 394, 7);
      windmill(L, 404, 7, 3, 0.013);
      L.coins(400, 3, 8);
      L.e('leafpile', 414, 14);
      L.stairs(418, 3, 1, 14);
      L.goal(430, 14);
    }
  });

  /* 49 — Trick or Treat Street. Dusk: a street of crooked houses lit with
     pumpkins. Step onto a doormat and Bonnie knocks — the door opens and
     someone friendly hands out treats (a heart, a cupcake, a trick… and,
     behind one door, a medal). Trick-or-treaters in costume, black cats,
     spiders on their threads, cobweb trampolines up to the rooftops. */
  add({
    name: 'TRICK OR TREAT STREET', theme: 'trickortreat', w: 464, seed: 494,
    build: function (L) {
      L.ground(0, 130);
      L.row(10, R1, '?P?');
      house(L, 18, 'stars', 'ghost');
      L.e('tot', 28, 16, { kid: 'ghost' });
      L.e('blackcat', 36);
      house(L, 44, 'heart', 'granny', true);
      L.e('leafpile', 54, 16);
      L.e('tot', 60, 16, { kid: 'witch' });
      // a cobweb trampoline up to the rooftops: stars, bats, and a medal at the far end
      L.spring(68);
      L.semi(72, 124, 6); L.coins(74, 4, 14);
      L.e('bat', 90, 7); L.e('bat', 108, 7);
      L.medal(122, 4);
      house(L, 78, 'trick', 'skeleton', true);
      L.e('blackcat', 88);
      L.e('tot', 94, 16, { kid: 'pumpkin' });
      house(L, 100, 'power', 'mummy');
      L.e('blackcat', 112);
      L.e('spider', 118, 8, { len: 5 });
      // the road's dug up: planks over the hole (they sink — hop along)
      L.plat(132, 14, 2, { fall: true, back: true }); L.plat(137, 13, 2, { fall: true, back: true }); L.plat(142, 14, 2, { fall: true, back: true });
      L.ground(146, 300);
      L.check(150);
      house(L, 158, 'stars', 'ghost', true);
      L.e('tot', 168, 16, { kid: 'vampire' });
      L.e('blackcat', 174);
      // behind this door, a medal
      house(L, 182, 'medal', 'granny');
      L.medal(184, 13, { hidden: true });
      L.e('leafpile', 194, 16);
      // the garden shed: a secret way in
      den(L, 204, 11, 214);
      L.medal(210, 14); L.coins(207, 13, 3);
      L.e('tot', 220, 16, { kid: 'witch' });
      L.row(224, R1, 'B?B');
      L.e('blackcat', 232);
      L.e('spider', 238, 8, { len: 5 });
      house(L, 244, 'stars', 'skeleton');
      // a cobweb up to the porch roof: Bear
      L.spring(254); L.semi(256, 262, 6); L.bear(259, 6);
      house(L, 266, 'heart', 'mummy', true);
      L.e('tot', 276, 16, { kid: 'ghost' });
      L.e('blackcat', 282);
      L.row(288, R1, '?P?');
      // the garden walls over the stream: hop from wall to wall
      L.ground(303, 306, 13); L.ground(309, 312, 11); L.ground(315, 318, 13);
      L.ground(318, 464);
      L.check(322);
      house(L, 330, 'stars', 'granny', true);
      L.e('tot', 340, 16, { kid: 'pumpkin' });
      L.e('blackcat', 346); L.e('blackcat', 356);
      house(L, 362, 'trick', 'ghost');
      L.e('spider', 374, 8, { len: 5 }); L.e('spider', 380, 7, { len: 6 });
      L.e('leafpile', 386, 16);
      house(L, 392, 'stars', 'skeleton', true);
      L.e('tot', 402, 16, { kid: 'vampire' });
      L.e('bat', 410, 7);
      L.stairs(422, 3);
      L.goal(436);
    }
  });

  /* 50 — Pumpkin Town. A crooked Halloween town at twilight: the gate, a
     pumpkin band, the two-faced mayor, a fountain bubbling green (its
     spout lifts you), jolly skeletons who fall to bits and pull
     themselves together again, hopping jack-o'-lanterns, the town hall
     tower with a secret passage through it — and the CURLY HILL, curled
     up at the edge of each gap, unrolling into a road as you come. The
     ghost dog is asleep by his grave: wake him, and he's with you. */
  add({
    name: 'PUMPKIN TOWN', theme: 'pumpkintown', w: 456, seed: 505,
    build: function (L) {
      L.ground(0, 70);
      L.deco1('towngate', 8);
      L.row(16, R1, '?P?');
      L.e('skelly', 28);
      L.deco1('pumpkinband', 32);
      L.e('jackhop', 44);
      // the fountain's spout lifts you to the stars over it
      L.deco1('fountain6', 50);
      L.steam(58, 8); L.semi(55, 62, 7); L.coins(56, 5, 6);
      L.e('skelly', 64);
      // the first curly hill: up the steps, and it unrolls over the gap
      L.stairs(67, 3); L.ground(70, 78, 13);
      L.e('curlhill', 78, 13, { len: 12 });
      L.ground(90, 236, 13);
      L.check(96);
      L.deco1('crookedhouse', 100, 13);
      L.e('skelly', 108, 13); L.e('jackhop', 116, 13);
      L.deco1('mayor', 122, 13);
      L.row(126, 9, 'B?B');
      /* The town hall's tower: ride the fountain's steam up over it (a
         medal on the roof) — or walk straight through the secret passage
         at its foot */
      L.steam(132, 9, 13);
      L.box(136, 6, 144, 13, TL.HARD);
      L.clear(138, 9, 142, 13); L.secret(136, 9, 138, 13, 'hard'); L.secret(142, 9, 144, 13, 'hard');
      L.coins(139, 11, 3);
      L.medal(140, 4);
      L.e('skelly', 150, 13);
      // the ghost dog, asleep by his little grave
      L.deco1('grave2', 164, 13);
      L.e('ghostdog', 168, 13, { sleep: true });
      L.e('jackhop', 180, 13); L.e('skelly', 190, 13);
      L.row(196, 9, '?L?');
      L.semi(194, 200, 6); L.bear(197, 6);
      L.e('bat', 206, 5);
      L.deco1('crookedhouse', 210, 13);
      L.e('skelly', 222, 13);
      // down the steps into the square
      L.ground(236, 300);
      L.stairs(236, 3, -1);
      L.check(244);
      L.deco1('fountain6', 250);
      L.e('skelly', 258); L.e('skelly', 266);
      L.deco1('pumpkinband', 272);
      L.e('jackhop', 280); L.e('jackhop', 286);
      // the big curly hill, over the river of green goo — a medal over its middle
      L.stairs(296, 4); L.ground(300, 306, 12);
      L.e('curlhill', 306, 12, { len: 20 });
      L.medal(316, 8);
      L.ground(326, 456, 12);
      L.e('skelly', 334, 12); L.e('bat', 340, 6); L.e('jackhop', 348, 12);
      L.row(354, 7, 'B?B');
      L.deco1('crookedhouse', 362, 12);
      L.e('skelly', 372, 12);
      // behind the bandstand: a secret way in, and the last medal
      L.box(380, 7, 392, 12); L.clear(382, 8, 391, 12); L.secret(380, 8, 382, 12);
      L.medal(388, 10); L.coins(383, 9, 3);
      L.e('jackhop', 398, 12); L.e('skelly', 408, 12);
      L.stairs(418, 3, 1, 12);
      L.goal(430, 12);
    }
  });

  /* 51 — Graveyard Jamboree. A moonlit, misty, FUN graveyard: tombstones
     that bounce you up (a ghost pops out — BOO!), a bone xylophone, ghost
     platforms that come and go to the beat (jump as one flickers), three
     hitchhiking ghosts to find who tag along behind, the ghost band
     playing, skeletons and hopping lanterns. */
  add({
    name: 'GRAVEYARD JAMBOREE', theme: 'graveyard', w: 464, seed: 516,
    build: function (L) {
      L.ground(0, 64);
      L.e('ghostdog', 2, 16);
      L.row(10, R1, '?P?');
      L.e('skelly', 26); L.e('jackhop', 34);
      // the first hitchhiker, thumb out by the gate
      L.e('hitch', 42, 16, { n: 1 });
      L.spring(50); L.semi(47, 55, 8); L.coins(48, 6, 6);
      L.e('bat', 58, 7);
      // the bone xylophone, over a dip
      L.notes(64, 14, 'CDEFGABc');
      L.ground(72, 132);
      L.e('skelly', 80); L.e('jackhop', 88);
      L.row(94, R1, 'B?B');
      // a crypt: in through its secret door — the second hitchhiker, and a medal
      L.row(101, 13, 'X');
      den(L, 104, 9, 118);
      L.e('hitch', 110, 16, { n: 2 });
      L.medal(115, 14);
      L.check(124);
      // the ghost platforms over the open graves (a stone to rest on half way)
      ghosts(L, [[134, 13], [138, 12], [142, 13]]);
      L.ground(146, 148, 14);
      ghosts(L, [[150, 12], [154, 13], [158, 12]]);
      L.ground(164, 248);
      L.e('skelly', 172); L.e('skelly', 180); L.e('bat', 184, 6);
      L.deco1('lanterntree', 188);
      // a tombstone up to the hill path: the third hitchhiker waiting at the top
      L.spring(196); L.semi(198, 214, 7); L.coins(200, 5, 6);
      L.e('hitch', 211, 7, { n: 3 });
      L.medal(204, 4);
      L.e('jackhop', 204); L.e('jackhop', 216);
      L.deco1('ghostband', 222);
      L.row(232, R1, '?L?');
      L.check(242);
      // a misty dip: more ghost platforms, a medal over them
      ghosts(L, [[250, 13], [254, 12], [258, 13], [262, 12]]);
      L.medal(256, 8);
      L.ground(268, 464);
      L.e('skelly', 276); L.e('jackhop', 284); L.e('bat', 290, 6);
      // Bear, on top of the mausoleum
      L.spring(292);
      L.box(296, 8, 306, 16, TL.HARD); L.bear(301, 8);
      L.e('skelly', 314); L.e('skelly', 322);
      L.e('jackhop', 340);
      L.row(346, R1, 'B?B');
      L.e('bat', 352, 6);
      L.deco1('cryptdoor', 358);
      L.notes(368, 13, 'CEGc');
      L.e('skelly', 380); L.e('jackhop', 390); L.e('skelly', 400);
      L.stairs(420, 3);
      L.goal(434);
    }
  });

  /* 52 — The Haunted Mansion. Inside, by candlelight: the stretching room
     (stand on its floor and it sinks, and the portraits on the walls
     stretch with it…), portraits whose eyes follow you, singing busts,
     the crystal ball, floating candelabras over the cellar stairs, the
     organ's pipes bouncing you up to its balcony, the ballroom's
     chandeliers swinging over a hole in the floor, and a ride in a black
     buggy down the long dark gallery. Bear's up in the attic. */
  add({
    name: 'THE HAUNTED MANSION', theme: 'mansion', w: 472, seed: 527,
    build: function (L) {
      L.start = { x: 3, row: 8 };
      // the foyer, upstairs
      L.box(0, 8, 20, 18);
      L.ceiling(0, 472, 2);
      L.e('ghostdog', 2, 8);
      L.e('portrait', 6, 6, { n: 0 }); L.e('portrait', 13, 6, { n: 1 });
      L.row(9, 4, '?P?');
      /* The stretching room: stand on its floor and down it sinks —
         the portraits on its walls stretch as it goes */
      L.e('stretchy', 21, 9, { n: 0 }); L.e('stretchy', 24, 9, { n: 1 });
      L.plat(20, 8, 6, { lift: -8, stay: true, piston: '#2a1838', say: 'IS THIS ROOM STRETCHING?' });
      L.box(26, 2, 28, 12, TL.HARD);
      L.ground(20, 96);
      // the portrait gallery: their eyes follow you
      L.e('portrait', 32, 10, { n: 2 }); L.e('portrait', 44, 10, { n: 0 }); L.e('portrait', 56, 10, { n: 1 });
      L.deco1('bust', 38); L.deco1('bust', 50); L.deco1('armour', 62);
      L.e('ghost', 52, 9);
      L.e('book', 66, 8);
      L.row(70, R1, 'B?B');
      L.deco1('candle3', 78); L.deco1('grandclock', 86);
      // the cellar stairs: floating candelabras over the hole
      L.plat(98, 12, 3, { dx: 6, speed: 0.5, look: 'candelabra' });
      L.plat(110, 10, 3, { dy: 3, speed: 0.4, look: 'candelabra' });
      L.coins(104, 9, 3);
      L.ground(124, 210);
      L.check(128);
      L.deco1('grandclock', 134);
      L.e('ghost', 140, 8); L.e('book', 146, 7);
      // the organ: its pipes bounce you up to the balcony, and a medal
      L.deco1('organ', 150);
      L.spring(158); L.semi(160, 168, 6); L.coins(161, 4, 4);
      L.medal(166, 4);
      L.e('ghost', 172, 9);
      L.deco1('crystalball', 176);
      // behind the bookcase: a secret room
      L.row(180, 13, 'X');
      den(L, 182, 9, 196);
      L.coins(186, 13, 6); L.medal(192, 14);
      L.deco1('candle3', 200);
      L.check(204);
      // the ballroom: swing across on the chandeliers
      L.plat(218, 2, 4, { swing: 9, look: 'chandelier', speed: 0.025 });
      L.plat(230, 2, 4, { swing: 9, look: 'chandelier', speed: 0.025, phase: Math.PI });
      L.plat(242, 2, 4, { swing: 9, look: 'chandelier', speed: 0.025 });
      L.coins(224, 8, 2); L.coins(236, 8, 2);
      L.ground(252, 270);
      L.deco1('bust', 256);
      L.e('book', 262, 8);
      // the long dark gallery: ride the buggy all the way down it
      L.plat(270, 13, 3, { ride: 66, speed: 1.0, look: 'buggy', dip: 2 });
      L.coins(280, 10, 4); L.coins(296, 9, 4); L.coins(316, 10, 4);
      L.medal(304, 7);
      L.e('book', 290, 9); L.e('ghost', 310, 8); L.e('book', 324, 9);
      L.ground(338, 472);
      L.e('ghost', 346, 9);
      L.deco1('armour', 350);
      // up to the attic: Bear
      L.spring(354); L.semi(358, 366, 6); L.bear(362, 6);
      L.e('book', 372, 7);
      L.row(378, R1, '?L?');
      L.deco1('bust', 388); L.deco1('crystalball', 396);
      L.e('ghost', 404, 9);
      L.deco1('candle3', 412);
      L.stairs(420, 3);
      L.goal(434);
    }
  });

  /* 53 — The Witch's Wood. Night in a forest of glowing toadstools and
     twisty trees with sleepy faces: toads, bats, will-o'-the-wisps that
     lead you to secrets (follow them!), a cauldron whose bubbles carry
     you up the cliff — and, hovering at the edge of the bramble chasm,
     the witch's spare BROOMSTICK. Hop on and fly. */
  add({
    name: "THE WITCH'S WOOD", theme: 'witchwood', w: 464, seed: 538,
    build: function (L) {
      L.ground(0, 150);
      L.e('ghostdog', 2, 16);
      L.row(10, R1, '?P?');
      L.e('toad', 24); L.e('toad', 34);
      L.spring(42); L.semi(39, 47, 8); L.coins(40, 6, 6);
      L.e('bat', 50, 6);
      // a wisp: it leads the way to a hollow tree, a medal inside
      L.e('wisp', 56, 10, { to: [78, 14] });
      L.row(69, 13, 'X');
      den(L, 72, 10, 84);
      L.medal(80, 14); L.coins(75, 13, 3);
      L.e('toad', 92); L.e('jackhop', 100);
      // the cauldron: ride a bubble up the cliff
      L.e('cauldron', 104, 16, { every: 100, h: 11 });
      L.box(112, 5, 130, 16);
      L.coins(114, 3, 6);
      L.box(130, 9, 136, 16); L.box(136, 12, 140, 16);
      L.check(144);
      L.e('toad', 152); L.e('bat', 156, 6);
      L.e('ghost', 164, 9);
      L.row(168, R1, 'B?B');
      L.e('jackhop', 176);
      // the second wisp: Bear, hiding behind a mossy wall
      L.e('wisp', 182, 10, { to: [196, 14] });
      L.row(187, 13, 'X');
      den(L, 190, 11, 202);
      L.bear(197, 16); L.coins(193, 13, 3);
      L.e('toad', 208);
      L.ground(150, 226);
      L.check(214);
      // the witch's spare broomstick, at the edge of the chasm: fly over it
      L.e('broom', 222, 16);
      L.ground(250, 254, 13); L.ground(276, 280, 12);
      L.coins(232, 9, 6); L.arc(256, 8, 12); L.coins(284, 7, 8);
      L.medal(270, 3);
      L.e('bat', 262, 5); L.e('minwitch', 290, 8);
      L.ground(300, 464);
      L.check(306);
      L.e('toad', 314); L.e('ghost', 322, 9); L.e('jackhop', 330);
      // another cauldron: up on a bubble to a high perch
      L.e('cauldron', 338, 16, { every: 90, h: 10 });
      L.semi(344, 360, 5); L.coins(346, 3, 8); L.medal(358, 3);
      L.e('toad', 366); L.e('bat', 372, 6);
      L.row(380, R1, '?L?');
      L.e('jackhop', 390); L.e('toad', 400);
      L.stairs(420, 3);
      L.goal(434);
    }
  });

  /* 54 — Firework Night. Over the rooftops, the sky full of fireworks:
     chimneys puffing smoke that lifts you, firework rockets to hang on to
     — up, up, BOOM, and float down through the sparks onto a higher roof
     — catherine wheels spinning platforms round, a bonfire glowing, black
     cats on the tiles and the witch's little apprentices on their brooms. */
  add({
    name: 'FIREWORK NIGHT', theme: 'fireworks', w: 456, seed: 549,
    build: function (L) {
      L.start = { x: 3, row: 12 };
      L.ground(0, 42, 12);
      L.e('ghostdog', 2, 12);
      L.row(10, 7, '?P?');
      L.e('blackcat', 24, 12);
      L.deco1('aerial', 30, 12);
      // a rocket: hold on, and up and over to the tall building's roof
      L.e('firework', 38, 12, { h: 9 });
      L.ground(46, 80, 7);
      L.box(60, 4, 62, 7, TL.HARD); L.steam(60, 4, 4);
      L.coins(64, 5, 6);
      L.e('minwitch', 70, 3);
      L.ground(84, 120, 9);
      L.e('blackcat', 96, 9);
      L.row(102, 4, 'B?B');
      L.deco1('bonfire', 110, 9);
      // the catherine wheels: ride them round over the gap
      L.plat(134, 8, 3, { circle: 4, sparks: true, phase: 0, speed: 0.013 });
      L.plat(134, 8, 3, { circle: 4, phase: Math.PI * 2 / 3, speed: 0.013 });
      L.plat(134, 8, 3, { circle: 4, phase: Math.PI * 4 / 3, speed: 0.013 });
      L.medal(134, 4);
      L.ground(150, 200, 10);
      L.check(152);
      L.e('blackcat', 162, 10);
      L.e('minwitch', 172, 5);
      L.deco1('aerial', 180, 10);
      L.row(186, 6, '?L?');
      // a chimney's smoke: up to the medal over the roofs
      L.ground(204, 240, 7);
      L.box(218, 4, 220, 7, TL.HARD); L.steam(218, 7, 4);
      L.medal(226, 2); L.coins(222, 2, 3);
      L.e('blackcat', 232, 7);
      // the big gap: a rocket over it, and float down onto the low roofs beyond
      L.e('firework', 236, 7, { h: 6 });
      L.ground(250, 310, 12);
      L.check(276);
      L.e('blackcat', 286, 12); L.e('minwitch', 296, 7);
      L.deco1('bonfire', 300, 12);
      L.ground(314, 350, 9);
      L.e('blackcat', 326, 9);
      L.row(334, 5, 'BPB');
      L.e('firework', 347, 9, { h: 9 });
      // the tall roof: Bear by the TV aerial, and a secret attic with the last medal
      L.ground(354, 400, 5);
      L.semi(356, 360, 2); L.bear(358, 2);
      L.deco1('aerial', 364, 5);
      L.box(372, 2, 384, 5); L.clear(374, 3, 383, 5);
      L.ground(400, 456, 10);
      L.e('minwitch', 410, 5);
      L.e('blackcat', 418, 10);
      L.stairs(424, 2, 1, 10);
      L.goal(434, 10);
      // (the attic: in under the eaves, from the roof's far end)
      L.secret(383, 3, 384, 5);
      L.medal(378, 4); L.coins(375, 4, 2);
    }
  });

  /* 55 — The Witch's Tower. Up the crooked tower: in at the door, then
     up and up the shelves round its walls (bubbles from the cauldron at
     the bottom will carry you too), past bats and flying spellbooks, to
     her kitchen at the very top — and THE WITCH, stirring her soup. When
     she swoops low along the floor, jump her or hop up on a shelf; three
     stomps on her hat when her broom sputters out, and she's sorry. */
  add({
    name: "THE WITCH'S TOWER", theme: 'witchtower', w: 156, h: 44, gr: 42, seed: 550, boss: true,
    build: function (L) {
      var g = 42;
      L.start = { x: 3, row: g };
      L.ground(0, 60, g);
      L.e('ghostdog', 2, g);
      L.row(10, g - 5, '?P?');
      L.e('jackhop', 22, g);
      L.e('bat', 30, g - 7);
      // a ledge up by the blocks: a medal
      L.semi(16, 22, g - 9); L.medal(19, g - 11);
      L.e('minwitch', 40, g - 8);
      L.e('jackhop', 48, g);
      // the tower: its door at the foot of the wall, the shelves inside going round and up
      L.box(60, 6, 62, g - 4, TL.HARD);
      L.ground(60, 98, g);
      L.box(96, 14, 98, g, TL.HARD);
      L.check(64, g);
      L.e('cauldron', 78, g, { every: 120, h: 14 });
      // (each shelf five rows over the last, its end two tiles from the next one's: a held jump up)
      L.semi(64, 76, g - 5);
      L.semi(78, 90, g - 10); L.e('bat', 84, g - 9);
      L.semi(64, 76, g - 15); L.e('book', 82, g - 17);
      L.semi(91, 96, g - 15); L.bear(94, g - 15);
      L.semi(78, 90, g - 20);
      L.check(84, g - 20);
      L.semi(64, 76, g - 25); L.e('bat', 68, g - 24);
      L.medal(66, g - 21);
      L.semi(78, 94, g - 30); L.e('book', 72, g - 31);
      L.coins(82, g - 32, 4);
      L.medal(94, g - 34);
      // the top: out onto her kitchen floor (low enough that her loops stay clear of the hearts and score)
      L.ground(96, 156, 13);
      L.check(100, 13);
      L.e('gate', 106, 12);
      // shelves along her kitchen to hop up on while she swoops along the floor below
      L.semi(114, 119, 9); L.semi(127, 132, 9); L.semi(141, 146, 9);
      L.e('bigpot', 128, 13);
      L.e('witch', 140, 13, { ax0: 112, ax1: 148 });
      L.box(148, 2, 156, 13, TL.HARD);
    }
  });
})();
