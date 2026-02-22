

## Idle Animation for Animals (Frame Cycling)

### Overview
Add a sprite-sheet-style idle animation to the animal character on the Home screen. The animation cycles through PNG frames in this sequence (repeating):

```text
original -> squish1 -> squish2 -> squish1 -> original -> long1 -> long2 -> long1
```

Only dog frames are available now; the system will be built to support all animals once their frames are uploaded.

### Steps

**1. Copy uploaded images into `src/assets/`**
- `dogsquish1.png`
- `dogsquish2.png`
- `doglong1.png`
- `doglong2.png`

**2. Update `AnimalCharacter.tsx`**
- Import the new dog frame images.
- Define an `animalIdleFrames` record mapping each `AnimalType` to an ordered array of 8 image sources following the cycle: `[original, squish1, squish2, squish1, original, long1, long2, long1]`. For animals without frames yet (bear, cat, chicken), the array will just repeat the original image 8 times (no visible animation until frames are uploaded).
- Add a `useEffect` + `useState` to cycle through the frame array on a timer (roughly 200-250ms per frame) when `active` is `false` (idle state). When `active` is `true` (studying), use the existing active image instead.
- Render the current frame as the `img` src.

### Technical Details

The component will use:
- `useState` for the current frame index (0-7)
- `useEffect` with `setInterval` to advance the frame index, wrapping around with modulo
- The interval only runs when `active === false`
- Frame duration: ~250ms per frame, giving a full cycle of ~2 seconds

```text
AnimalCharacter
  |-- idle (active=false): cycles through 8-frame array on interval
  |-- studying (active=true): shows the single active image (no cycling)
```

No changes needed to `Home.tsx` -- the animation is self-contained in `AnimalCharacter`.

