## Idle Animation for All Animals

### Overview

Add a frame-cycling idle animation to the animal character on the Home screen. The animation sequence is: **original, squish1, squish2, squish1, original, long1, long2, long1** -- repeating every ~2 seconds (250ms per frame, 8 frames).

Frames are provided for the **bear** and the **cat**. Ask about the dog and the duck

### Steps

**1. Copy uploaded images into `src/assets/**`

Overwrite existing originals and add new animation frames:


| Animal | Files to copy                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------- |
| &nbsp; | &nbsp;                                                                                         |
| Bear   | `bear.png` (overwrite), `bearsquish1.png`, `bearsquish2.png`, `bearlong1.png`, `bearlong2.png` |
| Cat    | `cat.png` (overwrite), `catsquish1.png`, `catsquish2.png`, `catlong1.png`, `catlong2.png`      |


Sources: the previously uploaded bear and cat frames from this message, and ask for new images for the dog and duck.

**2. Update `AnimalCharacter.tsx**`

- Import all new frame images (squish1, squish2, long1, long2 for bear/cat)
- Create an `animalIdleFrames` map: for each animal, an array of 8 image references following the cycle sequence
- Add a `useState` + `useEffect` with a 250ms `setInterval` that cycles through the frame index (0-7)
- When `active` is false, render the current idle frame; when `active` is true, render the active image (no cycling)

### Technical Details

```text
AnimalCharacter component logic:

if (active) -> show animalActiveImages[animal]
else if (animalIdleFrames[animal]) -> cycle through 8 frames at 250ms
else -> show static animalImages[animal] (chicken fallback)
```

No changes needed to `Home.tsx` or any other file -- the animation is self-contained in `AnimalCharacter`.