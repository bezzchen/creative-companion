

## Fix Navigation Animations, Enlarge Buttons, and Animate Timer

### 1. Fix the "slow replay" animation when clicking Home in BottomNav

**Root cause**: The `layoutId` props ("group-icon", "profile-icon") are shared between BottomNav and Home. When navigating to /home, BottomNav unmounts (returns null on /home) while Home mounts with the same layoutIds. Framer Motion tries to animate elements between these two positions across the route change, causing slow, glitchy transitions that replay every time.

**Fix**: Remove `layoutId` from both components entirely. The shared layout animation between nav bar and floating icons is unreliable across route changes with conditional rendering. Instead:

- **Home.tsx (lines 82-104)**: Remove `layoutId` from both icon buttons. Keep the bobbing animation as-is.
- **BottomNav.tsx (lines 5-9, 30-32)**: Remove `layoutId` from tabs config and the button. This stops the cross-route layout animation conflict.

### 2. Enlarge buttons and increase spacing

Currently both buttons are `w-16 h-16` with `x` offset of 44px. With the 2x animal size increase, buttons should scale up too.

**Home.tsx changes**:
- Play/Pause button (line 119): Change from `w-16 h-16` to `w-20 h-20`
- Stop button (line 143): Change from `w-16 h-16` to `w-20 h-20`
- Icon sizes inside buttons: Change from `w-7 h-7` to `w-9 h-9` (Play/Pause) and `w-6 h-6` to `w-7 h-7` (Stop square)
- Increase x offset from 44 to 60 for both buttons

### 3. Timer animation: rise from behind the animal

The timer should start behind the animal (lower z-index), then float upward and above it when studying starts. When studying stops, it should sink back down and disappear behind the animal.

**Home.tsx changes**:
- Import `AnimatePresence` from framer-motion
- Wrap the timer in `AnimatePresence` for exit animations
- Give the timer a lower z-index than the animal (e.g., `z-0`) and position it so it starts overlapping behind the animal
- Animate with:
  - `initial`: `{ opacity: 0, y: 40 }` (starts below/behind animal)
  - `animate`: `{ opacity: 1, y: 0 }` (floats up above)
  - `exit`: `{ opacity: 0, y: 40 }` (sinks back down)
  - `transition`: `{ duration: 0.5, ease: "easeOut" }`
- Set the timer's container to `z-0` (behind the animal at `z-10`) and use `relative` positioning so the upward animation visually emerges from behind the character

### Files to edit

**`src/pages/Home.tsx`**:
- Line 2: Add `AnimatePresence` to framer-motion import
- Lines 68-76: Rework timer with AnimatePresence, exit animation, and z-index behind animal
- Lines 82-90: Remove `layoutId="group-icon"` from Group button
- Lines 94-104: Remove `layoutId="profile-icon"` from Profile button
- Lines 113-130: Enlarge Play/Pause button to `w-20 h-20`, icons to `w-9 h-9`, x offset to -60
- Lines 133-147: Enlarge Stop button to `w-20 h-20`, icon to `w-7 h-7`, x offset to 60

**`src/components/BottomNav.tsx`**:
- Lines 5-9: Remove `layoutId` property from tabs array entries
- Line 32: Remove `layoutId={tab.layoutId}` from the motion.button

