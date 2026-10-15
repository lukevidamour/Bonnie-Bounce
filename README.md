# Bonnie Bounce

A ten-level platform adventure starring Bonnie, in the style of a 1999
handheld colour game. Grown out of TEKEX Jump (the Easter egg on the Tekex
site), it's now full screen, in colour, and a whole game: a world map,
power-ups, checkpoints, a boss and an ending.

> Grumble the Dragon has taken Monsty! Bounce through ten lands to bring him home —
> and find Bear, the family's grey cat, who's hiding somewhere in every one.

## Playing it

Double-click `index.html` and it opens in a browser. There's nothing to
install and it doesn't need the internet — it works straight from the folder.

On an iPad or phone, put the folder somewhere the device can reach (or
host it anywhere static) and open `index.html`. **Add to Home Screen**
gives it the whole screen, with Bonnie as the app's icon.

Play it **sideways**. Three big see-through buttons sit over the game,
drawn in its own style: ◀ ▶ under your left thumb and the big bouncy
mushroom (jump) under your right (the whole right half of the screen jumps, and holding
jumps higher). There's no run button — hold a direction and Bonnie
speeds up. With the Super Ball a throw button appears beside JUMP. The
paper button top right pauses; sound is in the pause menu. Menus, the
map and the sticker book are tapped. The buttons fade whenever Bonnie
walks behind them. If nobody touches the screen for a few seconds in a
level, the buttons glow and a see-through finger shows what to press. Held upright it still plays (handy with rotation
lock on), with a small note under the picture suggesting turning
sideways for the best view.

On an iPhone the sound plays even with the ring/silent switch on — it's
a game, it should always have its music. Browsers keep a page silent
until it's tapped, so the first tap on the title screen starts the
music (Level 1's tune) and the next one plays.

**It keeps itself up to date.** Every time it opens, it asks for the
newest files first; if it's been sitting open on a home screen and a new
version has been published, it reloads itself — on the title or the map,
never in the middle of a level. It also keeps a copy, so once it's been
opened it plays with no internet connection too.

### Controls

| | Keyboard | Touch | Gamepad |
|---|---|---|---|
| Move | ← → (or A / D) | ◀ ▶ | D-pad / stick |
| Jump (hold for higher) | Space, Z or ↑ | JUMP (or anywhere on the right) | bottom / right button |
| Run | ⌘ Command, Option, Shift or X | hold ◀ or ▶ | left / top button |
| Throw a ball | the run key | the throw button | left / top button |
| Duck (when big) | ↓ | — | down |
| Pause · start | Enter or Esc | the paper pause button | Start |
| Sound on/off | M | in the pause menu | — |
| Full screen | F | — | — |

Every prompt in the game shows the controls you're actually using — the
Space bar on a keyboard, the on-screen buttons on a touch screen, the
face buttons on a gamepad — and switches the moment you do.

Under the sea, tap jump to swim.

On a Mac, ⌘ + Space opens Spotlight before the browser sees it, so a
running jump with ⌘ held brings up Spotlight. Option does the same job as ⌘
without that clash (or switch off Spotlight's shortcut in System Settings →
Keyboard → Keyboard Shortcuts).

## The game

**Ten worlds**, each with its own look, music, enemies and trick:

| | World | What's new |
|---|---|---|
| 1 | Sunny Hills | the basics, one thing at a time |
| 2 | Playground Park | trampolines, climbing frames, bees |
| 3 | Sandy Shore | the sea, piers, sinking rafts, crabs and gulls |
| 4 | Coral Reef | swimming, fish and jellyfish |
| 5 | Spooky Woods | shy ghosts, bats, hedgehogs, bouncy mushrooms |
| 6 | Crystal Caves | a roof, grumpy rocks that drop, spike pits, lifts |
| 7 | Frosty Peaks | slippery ice, sliding penguins, snowmen, icicles |
| 8 | Cloud Kingdom | a climb up into the sky, nothing below |
| 9 | Toy Factory | conveyor belts, wind-up robots, crushers |
| 10 | Dragon Castle | lava, fire bars, and Grumble himself — with Monsty in a cage |

**Lives:** unlimited. A fall or a bump just sends Bonnie back to the
start of the level, or to the checkpoint flag if he has reached it, after
a one-second card. Hearts and every 100 stars give a burst of points.

**Bear** hides in every level — up on a stump, a ledge, the top of a
climbing frame. Touch him and he meows and follows Bonnie home (he walks
the very path Bonnie takes, a moment behind, and keeps him company after
a fall). Bring him home and his face lights up on that level's map tag.

**The sticker book** (BOOK, top left of the map, or the run key) has a
sticker of Bear for every land he came home from, one for every creature
Bonnie has met, and the **outfits** — star pyjamas, a superhero suit with
a cape, a Monsty suit — won by bringing Bear home 3, 6 and 10 times.

**Grown-ups** (title menu or pause menu, hold to open) can record their
own "Yay!", "Wheee!" and "Well done!" — played at checkpoints, on
trampolines and when a level is clear. The clips stay on that device.

**Power-ups** come out of the presents:

- **Cupcake** — Bonnie grows big; he can take a hit and smash bricks.
- **Super Ball** — his jumper turns red and B throws bouncing balls.
- **Rainbow Lolly** — a few seconds of rainbow invincibility.
- **Heart** — a burst of points.

Every level has a checkpoint flag halfway, and ends at an arch of
balloons in front of Bonnie's house — the higher he runs through it, the
more points. Progress saves automatically (in the browser, on that device).

Nothing in it is borrowed: presents, wooden toy blocks and each world's
own columns (tree stumps, a sandcastle tower, coral, crystal rock, cloud
pillars, a factory funnel, a chimney) — and a grumpy sunflower.

## For grown-ups who want to tinker

Everything is plain HTML and JavaScript — no build step.

The game thinks in "game pixels" (8x8 tiles, a 144-pixel-tall view) and
draws each one as 2x2 screen pixels. Sprites are typed at game resolution
and doubled when painted — smoothed, outlined in a deep shade of their own
colour, and lit from the top left — which is what gives the Game Boy
Advance look. Bonnie, the presents and the tiles are drawn at the full
resolution to begin with — Bonnie as a posed puppet (head, then jumper,
sleeves, hands, shorts, legs and shoes on joints), so a new pose is a few
numbers in `POSES` in `js/art.js`.

| File | What's in it |
|---|---|
| `js/core.js` | screen scaling, palette, the sprite painter (doubling, outlines, lighting), pixel font, input, the sound chip |
| `js/art.js` | every sprite (Bonnie is at the top), tiles and the ten themes |
| `js/creatures.js` | every enemy, Monsty's captor Grumble, and the scenery props, in the same round, softly lit style |
| `js/backdrop.js` | the parallax backgrounds, layered into the haze |
| `js/light.js` | sunbeams, dusk and glowing lights, shadows — and how Bonnie catches the light |
| `js/music.js` | the soundtrack — all original tunes, written as note strings |
| `js/levels.js` | the level builder and the ten levels |
| `js/map.js` | the island world map: each world's landmark, all animated |
| `js/ui.js` | the game's stationery: paper cards with a running stitch, ribbon banners, Monsty's head as the menu pointer |
| `js/voice.js` | grown-ups' recorded voices: recording (MediaRecorder), keeping them on the device, playing them in the game |
| `js/game.js` | physics, Bonnie, enemies, items, the screens and the save |
| `js/touch.js` | touch play: the ◀ ▶ and JUMP buttons over the game, tapping menus (the "turn sideways" note is in index.html) |
| `sw.js`, `js/fresh.js` | always the newest version: the service worker asks the server first (and keeps a copy for offline); fresh.js reloads a home-screen app that's fallen behind, at a calm moment |
| `manifest.webmanifest`, `icons/` | home-screen install; the icon is drawn from Bonnie's own sprite by `tools/icon.html` |
| `ROADMAP.md` | the product review, scores and the plan to launch |

Handy while editing:

- `index.html?level=7` jumps straight into level 7.
- `index.html?debug` opens every level on the map.
- `tools/sheet.html` shows every sprite, magnified (`?z=8` to zoom).
- `tools/overview.html?level=all` draws every level flat, to check layouts.
- `index.html?touch` plays as a touch screen does, to check the phone and
  tablet layouts on a desktop (any window shape).
- `tools/icon.html` redraws the home-screen icons; save each into `icons/`.
- How hard it is: `SLOW` (how fast baddies and hazards move, 0.85 now)
  and `THIN` (one baddie in THIN is left out) at the top of `js/game.js`,
  next to the jump and forgiveness settings.
- Level 1's signposts are `L.tip(x, 'jump')` and so on; the words and
  pictures for each are `TIPS` in `js/game.js`.

Levels are written with short commands — `L.ground(0, 56)`, `L.row(16, 11, 'BPB?B')`,
`L.pipe(28, 2)` (a column in the world's own style — a stump, a tower, a chimney), `L.e('grumbug', 24)`,
`L.bear(48, 12)` — explained at the top of `js/levels.js`.
To reset the save, clear the site's storage in the browser, or run
`localStorage.removeItem('bonnie-bounce-save')` in its console.
