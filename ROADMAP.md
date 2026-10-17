# Bonnie Bounce — product review & roadmap

*From fun prototype to a world-class kids' game. Review date: 14 October 2026.*

## The verdict

Bonnie loved it, and that is the hardest thing to get right: the core is
already fun. Ten distinct worlds, a recognisable hero, good game feel
(variable jump, coyote time, a real camera), checkpoints, a boss, a story,
and unlimited lives mean a six-year-old can play it start to finish.

What separates it from the games it will sit next to (Kirby, Yoshi,
Mario Wonder, Celeste's polish, Alto's charm) is **everything between the
jumping**: how you move between levels, how the game teaches you, how it
rewards you, how it sounds, how it feels to hold on an iPad, and the
hundred small moments of delight that make a child say "again!". The other
gap is **commercial readiness**: some borrowed ideas have to be replaced
before this could ever be sold.

Severity below: **P0** blocks a launch · **P1** expected of a premium game ·
**P2** delight and depth.

## Scorecard

Scored against the best kids' platformers on the market (Kirby, Yoshi,
Mario Wonder, Alto, Dadish), where 90+ is best in class.

| | Category | 14 Oct (first) | 14 Oct (after phases 2–3) | What still holds it back |
|---|---|---|---|---|
| 1 | **Art & visual craft** | 72 | **82** | Presents, toy blocks, world columns, the sunflower, the balloon arch and real mountains replaced the borrowed pieces. Still to do: a few props in the first style (bench, swings, igloo, gears), plain stair blocks, the checkpoint flag. |
| 2 | **Gameplay & game feel** | 74 | **80** | Hit-stop, baddies that pop into flowers, a camera kick, a checkpoint wave, breath in the cold. Still to do: anticipation frames, a difficulty pass on gaps with enemies beside them. |
| 3 | **Controls on every device** | 70 | **72** | Touch plays on the world itself. Still untested on a real iPhone or iPad; no assist mode or remapping. |
| 4 | **Delight, character & heart** | 62 | **82** | Bear hiding in every land and following Bonnie home, a picture-book story, a real reunion, the sticker book, outfits, grown-ups' voices. Still to do: music second sections, more of Bonnie reacting to the world. |
| 5 | **Polish & launch readiness** | 55 | **66** | The borrowed visuals are gone. Still to do: settings and save slots, a privacy note, device QA, store packaging. |
|   | **Overall** | 67 | **76** | |

### What moves each score most

1. **Make it ours** (art +10, heart +6, launch +15). Replace the borrowed
   pieces with originals from Bonnie's world. Gift boxes tied with ribbon
   instead of `?` blocks, and biscuit or toy-brick blocks instead of red
   bricks. Hollow tree stumps, chimneys and drainpipes instead of green
   pipes. A sleepy sunflower that pops up instead of the plant. A rolling
   acorn instead of the kicked shell. A balloon arch and Monsty's flag at
   the finish. Repaint the backdrop mountains with real shape and light.
2. **Juice** (feel +8, heart +4). A two-frame hit-stop on every stomp.
   Enemies squash and pop into flowers. Bonnie gets anticipation, landing
   squash, a look-around idle, a wave at checkpoints, shivering in the
   snow. Add a little camera kick on big landings.
3. **Tell it in pictures** (heart +10). A three-panel storybook opening
   (Grumble swoops, Monsty is carried off, Bonnie sets out) and a real
   reunion at the end, with no reading needed. Let a parent record
   "Yay!" and "Wheee!" for jumps and stomps.
4. **Things to find** (feel +6, heart +8). Three hidden Monsty badges per
   level, shown on the map's medallions. A sticker book of every creature
   met. Outfits to win (the football kit, a superhero cape).
5. **Sound** (heart +4). A second section for each tune, a soft map tune,
   richer effects, separate music and effects volumes.
6. **For every child** (controls +12, launch +10). Assist mode
   (invincible, slower, skip a level after a few tries), remapping, save
   slots for siblings, real-device QA, a privacy note.

## What's working — protect these

- The hero. Bonnie is recognisable and flattering; keep the art pass
  consistent with him.
- Ten worlds that each play differently (trampolines, swimming, ice,
  conveyors, the vertical climb, the boss).
- The light: sunbeams, glows, rim light on Bonnie, dusk in the dark worlds.
- Forgiving design: unlimited lives, checkpoints, no game over.
- Original soundtrack and sounds, no files, works offline.
- Runs from a folder or any static host; no build step.

## Findings

### 1. The first five minutes (onboarding)
- **P0** Controls are only ever explained in text, once, on a loading
  card. A six-year-old can't read "HOLD JUMP TO JUMP HIGHER" fast enough.
  *Teach by doing*: signposts in Level 1 with pictures of the real button
  (the Space bar on a keyboard, the A button on an iPad), at the moment
  each one is needed.
- **P0** Prompts say "A" on a keyboard, where there is no A button. Every
  prompt must show the input the player is actually using — keyboard,
  touch or gamepad — and switch the moment they change.
- **P1** The story is told in text a pre-reader can't read. Tell it in
  pictures: Grumble swooping in, Monsty carried off, Bonnie setting out.
- **P2** A parent-read option (or narration) for the story and the ending.

### 2. Moving between levels (the map)
- **P0** The map is a row of dots on coloured blobs. It should be the
  most delightful screen in the game: an illustrated island with each
  world's landmark, animated (turning windmill, chimney smoke, waves,
  boats, birds, glowing woods), a path that draws itself as levels open,
  level medallions that show what you've won, and Bonnie walking it.
- **P1** Show progress per level: stars found out of stars there are,
  and whether the level's secret has been found.
- **P1** Transitions. Every screen currently cuts. A circle wipe into the
  level from its medallion, and back out to the map on a clear.

### 3. Touch devices (iPad and iPhone)
- **Done** Touch controls, third version (14 Oct, after playing it on a
  phone). A Game Boy shell, then "play on the world" (a floating dial and
  a ground strip under the screen) were both tried and dropped: upright,
  half the phone was controls; sideways, nothing showed where to press.
  Now it's what the best mobile platformers do and the research on
  children and touchscreens supports: three big see-through buttons over
  the game (◀ ▶ lower left, JUMP lower right), always visible, generous
  hit areas, lifted off the bottom edge, taps and holds only, running by
  holding a direction. Held upright it still plays (rotation lock is
  common), with a small "turn sideways for the best view" note below.
- **P0** Real-device playtest of the new touch play with Bonnie: is the
  run threshold right for small thumbs, and does he find the throw
  bubble?
- **P0** Installable: "Add to Home Screen" should give a full-screen app
  with Bonnie's face as the icon (a web app manifest and icons).
- **P1** Haptics where the platform allows; a rotate hint on phones held
  upright if the game plays better sideways.
- **P1** Test matrix: iPhone SE → Pro Max, iPad mini → Pro, Safari and
  home-screen mode, low-power mode, an old iPad.

### 4. Game feel and juice
- **P1** Hit-stop (a two-frame freeze) on every stomp; a little screen
  bounce on big landings; enemies squash with a bounce, not a blink.
- **P1** More animation frames for Bonnie (anticipation before a jump, a
  turn, a look-around idle, a happy wave at checkpoints).
- **P1** A "near miss" assist: a soft bounce off the lip of a gap instead
  of falling in, the first few times, in early levels.
- **P2** Bonnie reacts to the world: shades his eyes in sunbeams, shivers
  in snow, holds his nose underwater.

### 5. Difficulty and assistance (age 4–8)
- **P0** An Assist option for grown-ups: invincibility, slower game speed,
  a "skip this level" after a few tries. No child should be stuck.
- **P1** Difficulty review per level with playtests (see below): the
  first gap in each world should be a gentle one; enemies near gaps are
  the main cause of frustration.
- **P1** Two-player helper mode (a parent as a floating helper who can
  carry Bonnie over a gap) — the single best feature for this age.
- *Done 16 Oct:* three hearts, so one bump never undoes a good run, and a
  fall into a pit costs a heart rather than the level.

### 6. Rewards and replay
- **P1** Three big hidden **Monsty badges** per level (like star coins),
  shown on the map medallion.
- **P1** A sticker book that fills as you play: every enemy you meet,
  every world's landmark, every badge.
- **P2** Unlockable outfits — his football kit from the trophy photo, the
  school uniform, a superhero cape — and a celebration screen for each.
- **P2** A secret exit or bonus room in each world.

### 7. Sound
- **P1** Music: each world's tune is a single short loop. Give each a
  second section and a softer variation for the map; mix the levels so
  the melody sits above the effects.
- **P1** Sound settings: music and effects volume separately.
- **P2** A short voice "Yay!", "Wheee!" (a parent recording?) for jumps,
  stomps and checkpoints — enormous charm for a personal game.

### 8. Menus, settings, saving
- **P1** A designed pause menu: resume, restart level, back to map,
  sound, assist; with the controls shown as pictures.
- **P1** Settings screen; three save slots (siblings share iPads).
- **P2** Credits that celebrate Bonnie, with the photos it began from.

### 9. Accessibility
- **P1** Reduced motion is honoured in effects; extend it to screen
  shake, flashes and the rainbow power.
- **P1** Remappable keys; one-handed play option (auto-run).
- **P2** Colour-blind-safe check of hazards (lava vs. ground, spikes).

### 10. Commercial readiness
- **P0 — intellectual property.** The "?" block, green pipes, the plant
  that rises from a pipe, the kicked shell, the flagpole and the walk into
  a castle are recognisably Nintendo's. Fine for a family gift; they must
  be redesigned before anything is sold or published widely. Original
  replacements that fit the world: gift boxes or "Monsty boxes", tree
  stumps and chimneys, a rising flower, a rolling acorn, a finishing
  balloon arch and Monsty's flag.
- **P0** Privacy and safety: no ads, no links out, no data collection,
  no accounts. Say so plainly in a privacy note (also needed for app
  stores).
- **P1** Store packaging if wanted: the web build wraps for the App Store
  / Play Store (Capacitor); age rating 4+.
- **P1** Launch assets: icon, screenshots per device, a 30-second trailer
  cut from gameplay.
- **P2** Analytics only if privacy-safe and opt-in by a parent — or none.

### 11. Quality
- **P1** Known rough edges: the "CMD" label reads as "CMO" in the pixel
  font; some old props (bench, swings, slide, blocks, igloo, gears) are
  still in the first art style.
- *Done 16 Oct:* the robot playtest (`tools/playtest.html?level=all`)
  finishes all twenty levels, bosses included — run it after any level
  change. It proves a level *can* be finished, not that it's fun or fair
  for a six-year-old: that still needs Bonnie.
- **P1** Device QA pass and a performance budget (stay at 60fps on a
  five-year-old iPad).

## Roadmap

| Phase | Goal | Contents |
|---|---|---|
| **1 · Feels like a real game** *(done, 14 Oct)* | The moments between levels feel crafted, and every device feels native | Illustrated, animated, textured island map with tap-to-walk · circle transitions · input-aware prompts · teach-by-doing signposts · touch buttons over the game (◀ ▶ and JUMP), a "turn sideways" note upright · the stitched-paper and ribbon UI on every screen · pause with sound · "start over?" safety · home-screen install with Bonnie's icon |
| **2 · Make it ours** *(done, 14 Oct)* | Nothing on screen is borrowed | Gift boxes, toy bricks, stumps and chimneys, the sunflower, the acorn, the balloon arch · repainted mountains · old props redrawn · the map's landmarks given the same care as the levels |
| **3 · Juice & heart** *(done, 14 Oct)* | Every action has weight, and the story needs no reading | Hit-stop, baddies that pop into flowers, Bonnie's checkpoint wave · picture-book opening and reunion ending · grown-ups' recorded voices · (still to come: settings with volumes) |
| **4 · Reasons to replay** *(mostly done, 14 Oct)* | A child wants to go back | Bear hidden in every land and following Bonnie home · sticker book (Bear, creatures, outfits) · outfits won with Bear · (still to come: the football kit, once we have its colours; bonus rooms; music second sections) |
| **4½ · A second land** *(done, 16 Oct)* | Bonnie asked for more | The Magpie Isles: ten new worlds (11–20) with their own backdrops, music, creatures and tricks — wind, low gravity, bobbing boats, jelly bounces — a boat route across the map, a party story, Captain Magpie as the boss, a party ending · three hearts (a bump or a fall costs one; stars and presents give them back) · Bear in every new land, two more outfits · `tools/playtest.html`, a robot that checks each level can be finished |
| **4¾ · The Big Trip** *(done, 17 Oct)* | More, and his own world in it | Ten more levels (21–30) across France to Disneyland Paris · Luke and Lucy in the game (by the car at every level's end, at every checkpoint, in the story and the finale's family photo) · Brocco, his broccoli · the family's Skoda Yeti driving him round the map · Rascal the Fox · football, golf and mouse-ear outfits, hats for the pirate and golden suits · about 10% harder overall |
| **4⅞ · Longer, and Holiday!** *(done, 18 Oct)* | He was plowing through: more to find, and the rest of the summer | Every level about half as long again, each with new discoveries: three golden medals per level, secret walls, balloon rides, musical blocks · Holiday!: five more levels from the family's trip (O'Gliss Park, surfing at Hossegor, the bike ride, Puy du Fou, Saint-Malo) with swimming pools, surfboards, his bike and Dad letting go of the seat, catapults, chariots · PSG and Liverpool kits for medals |
| **5 · For every child, ready to ship** | Nobody gets stuck; could be sold | Assist mode, two-player helper, remapping, save slots · privacy note · device QA matrix · store wrap · launch assets |

## How we'll know it's working

No tracking — this is a children's game. Instead, **playtests**: Bonnie
and two or three friends aged 4–8, each phase, watched not helped. Note
where they get stuck, what they laugh at, and whether they ask to play
again. A phase is done when a child can play its new parts without a
grown-up explaining anything.
