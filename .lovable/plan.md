

## Tighten Auth Page Spacing

### Problem
The `flex-1` on the speech bubble + animal container is stretching it to fill all remaining space, pushing the speech bubble too high and the toggle link too low. The animal's large size (`w-96 h-96`) adds extra whitespace.

### Changes to `src/pages/Auth.tsx`

1. **Remove `flex-1` from the animal container** (line 100): Change from `flex flex-col items-center justify-center flex-1` to just `flex flex-col items-center mt-4` -- this stops it from stretching to fill all available space and instead sits naturally below the form.

2. **Reduce speech bubble bottom margin** (line 104): Change `mb-2` to `mb-0` so the bubble sits closer to the animal.

3. **Remove bottom padding from toggle** (line 124): Change `pb-4` to `py-2` so the toggle sits closer to the animal rather than being pushed to the very bottom.

4. **Reduce animal image size slightly**: Change `w-96 h-96` to `w-80 h-80` -- still ~2.5x the original but takes up less vertical space.

These changes will bring the speech bubble, animal, and toggle link closer together vertically while keeping the form near the top.

### Files changed
- `src/pages/Auth.tsx`

