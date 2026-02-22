

## Rework Home Page Button Animation

### Problem
The current button animation has multiple issues causing visual glitches:
- Two separate `AnimatePresence` blocks (one for Play, one for Pause+Stop) fight each other during transitions
- The SVG goo filter adds rendering overhead and interferes with positioning
- The Play button fades out while the controls container fades in simultaneously, causing layout jumps
- Redundant timer display code (shown twice -- once inside AnimatePresence, once outside)

### New Animation Concept
Single button that transforms in place:
1. **Idle**: Play button centered on the animal
2. **Press Play**: Play icon swaps to Pause icon (same button, no unmount/remount). Stop button slides up from behind the Pause button, then both split apart horizontally.
3. **Press Stop**: Buttons slide back together, Stop slides back underneath, icon swaps back to Play.

### Technical Changes

**File: `src/pages/Home.tsx`**

1. **Remove the SVG goo filter** -- delete the entire `<svg>` block (lines 50-63). It's not needed for the new animation.

2. **Remove duplicate timer display** -- consolidate the two timer blocks (lines 82-108) into one that's always rendered (no AnimatePresence needed since the timer is always visible).

3. **Replace the button zone** (lines 153-218) with a single simplified approach:
   - Use `isStudying` to control layout, not mount/unmount
   - One container `div` with `position: relative`
   - **Pause/Play button**: Always rendered in the center. Uses `motion.button` with `animate` to shift left (`x: -28`) when studying, stay centered (`x: 0`) when idle. Icon swaps between Play/Pause based on state.
   - **Stop button**: Always rendered but starts hidden behind the pause button. Uses `motion.button` with `animate` to control: `opacity` (0 to 1), `scale` (0.5 to 1), and `x` (0 to 28) to slide out to the right. Initial position is stacked behind the main button.
   - No `AnimatePresence` needed for the buttons -- just animate properties based on `isStudying` boolean.

4. **Simplify state**: The `isStudying` state and callbacks remain the same, but the rendering logic becomes much simpler with no conditional mounting.

### Result
- No layout jumps because buttons never unmount/remount
- Smooth "split apart" effect using simple x-position animations
- Stop button slides out from behind the pause button naturally
- No SVG filter overhead
- Cleaner, less code overall
