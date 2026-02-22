

## Add Cat Animation Frames + Fix Aspect Ratio

### Two changes:

**1. Copy cat animation frames** into `src/assets/`:
- `catsquish1.png`, `catsquish2.png`, `catlong1.png`, `catlong2.png`

**2. Update `AnimalCharacter.tsx`:**
- Import the 4 new cat frame images
- Update `animalIdleFrames.cat` to use the real frame sequence instead of repeating the original
- Fix the aspect ratio issue: change the `img` tag's class from `object-contain` within a square container (`w-X h-X`) to instead **not force a fixed height**. The container should use a fixed width but `h-auto` (or similar) so each frame's natural aspect ratio is preserved. Alternatively, keep the square container but ensure the image uses `object-contain` properly -- the issue is likely that the container itself has equal width and height, which works for square images but stretches or letterboxes non-square ones.

**Specific fix for aspect ratio:** Change the container from `w-64 h-64` (square) to `w-64` only, and remove the fixed height. The `img` element already has `object-contain`, but within a forced-square container, images with different aspect ratios will appear to shift or resize. By letting the height be determined by the image content, each frame will display at its natural aspect ratio.

The `sizeMap` will change from:
```
sm: "w-16 h-16"
md: "w-40 h-40"
lg: "w-64 h-64"
...
```
To:
```
sm: "w-16"
md: "w-40"
lg: "w-64"
...
```

And the `img` tag will use `w-full h-auto` instead of `w-full h-full object-contain`, so the image height naturally follows the width based on each frame's aspect ratio.

### Files changed
- `src/components/AnimalCharacter.tsx` -- imports, idle frames for cat, and aspect ratio fix

