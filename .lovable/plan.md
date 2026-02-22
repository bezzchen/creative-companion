

## Simplify Idle Animation to 2-Frame Cycle

### Overview
Simplify the idle animation from an 8-frame cycle to a simple 2-frame toggle between the original image and long1, for all four animals (bear, cat, dog, and chicken/duck).

### Steps

**1. Copy uploaded images into `src/assets/`**

| File | Target |
|------|--------|
| bear-5.png | `src/assets/bear.png` (overwrite) |
| bearlong1-3.png | `src/assets/bearlong1.png` (overwrite) |
| cat-4.png | `src/assets/cat.png` (overwrite) |
| catlong1-5.png | `src/assets/catlong1.png` (overwrite) |
| dog-4.png | `src/assets/dog.png` (overwrite) |
| doglong1-3.png | `src/assets/doglong1.png` (overwrite) |
| duck-3.png | `src/assets/duck.png` (overwrite) |
| ducklong1.png | `src/assets/ducklong1.png` (new) |

**2. Delete unused frame images**

Remove these files that are no longer needed:
- `src/assets/bearsquish1.png`, `bearsquish2.png`, `bearlong2.png`
- `src/assets/catsquish1.png`, `catsquish2.png`, `catlong2.png`
- `src/assets/dogsquish1.png`, `dogsquish2.png`, `doglong2.png`

**3. Update `AnimalCharacter.tsx`**

- Remove all squish/long2 imports
- Add import for `ducklong1.png`
- Simplify `animalIdleFrames` to 2-frame arrays: `[original, long1]` for all four animals (including chicken/duck)
- Change the interval cycle from `% 8` to `% 2`
- Keep the same 250ms timing

### Technical Details

```text
// Simplified idle frames
const animalIdleFrames: Record<AnimalType, string[]> = {
  bear: [bearImg, bearLong1],
  cat: [catImg, catLong1],
  dog: [dogImg, dogLong1],
  chicken: [duckImg, duckLong1],
};

// Interval cycles % 2 instead of % 8
setFrameIndex((prev) => (prev + 1) % 2);
```

No changes needed outside `AnimalCharacter.tsx`.
