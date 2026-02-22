

## Update Animal Images + Cat Animation + Aspect Ratio Fix

### 1. Replace original animal images

Copy the uploaded images over the existing ones in `src/assets/`:
- `user-uploads://dog-2.png` -> `src/assets/dog.png`
- `user-uploads://cat-2.png` -> `src/assets/cat.png`
- `user-uploads://bear-2.png` -> `src/assets/bear.png`
- `user-uploads://duck-2.png` -> `src/assets/duck.png`

### 2. Add cat animation frames

Copy uploaded cat frames into `src/assets/`:
- `user-uploads://catsquish1-2.png` -> `src/assets/catsquish1.png`
- `user-uploads://catsquish2-2.png` -> `src/assets/catsquish2.png`
- `user-uploads://catlong1-2.png` -> `src/assets/catlong1.png`
- `user-uploads://catlong2-2.png` -> `src/assets/catlong2.png`

### 3. Update `AnimalCharacter.tsx`

- Import the 4 new cat frame images
- Update `animalIdleFrames.cat` to use the real frame sequence instead of repeating the original
- **Fix aspect ratio**: Change `sizeMap` to use width-only classes (no fixed height), and change the `img` element from `w-full h-full object-contain` to `w-full h-auto` so each frame displays at its natural aspect ratio without distortion or shifting

### Technical Details

**sizeMap change:**
```
sm: "w-16 h-16"  ->  "w-16"
md: "w-40 h-40"  ->  "w-40"
lg: "w-64 h-64"  ->  "w-64"
xl: "w-72 h-72"  ->  "w-72"
2xl: "w-[36rem] h-[36rem]"  ->  "w-[36rem]"
```

**img tag change:**
```
className="w-full h-full object-contain ..."
->
className="w-full h-auto ..."
```

This ensures each frame renders at its natural aspect ratio. The width stays fixed while the height adjusts per frame, preventing squishing or stretching during the animation cycle.

### Files changed
- `src/assets/dog.png`, `cat.png`, `bear.png`, `duck.png` (overwritten)
- `src/assets/catsquish1.png`, `catsquish2.png`, `catlong1.png`, `catlong2.png` (new)
- `src/components/AnimalCharacter.tsx` (imports, idle frames, aspect ratio fix)

