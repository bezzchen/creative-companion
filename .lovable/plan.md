

# Play Button, Profile, Grainy Effect, and Starting Currency Fixes

## 1. Play Button Centered on Animal with Gooey Mitosis Fix

**Problem**: The play button is below the animal instead of overlapping it, and during the mitosis animation the play button disappears before pause/stop appear (due to `AnimatePresence mode="wait"`).

**Fix in `Home.tsx`**:
- Move the play/pause/stop button container inside the animal's relative wrapper, absolutely positioned and centered both vertically and horizontally on top of the animal
- Remove `AnimatePresence mode="wait"` so both the play button and the splitting buttons can be visible simultaneously during the transition
- The play button should scale down and fade while the pause/stop buttons scale up from center, creating a continuous visible gooey blob effect
- Apply the SVG goo filter to the wrapper so the overlapping circular shapes merge visually during transition
- Increase animal size from `w-64 h-64` to `w-72 h-72` (new "xl" size)

## 2. Profile Page - Animal Selector and Icon Usage

**Changes to `Profile.tsx`**:
- Use the animal **icon** image (`animalIconImages`) instead of the full animal PNG for the profile avatar
- Add an "Edit Animal" section below the avatar: show all 4 animal options as small circular buttons. Tapping one calls `setAnimal()` which updates the global theme instantly
- Import `animalIconImages` from `AnimalCharacter.tsx` for the avatar display

## 3. AnimalCharacter - Add "xl" Size

**Changes to `AnimalCharacter.tsx`**:
- Add `"xl"` to the size options: `w-72 h-72`
- Update the Props type and sizeMap accordingly

## 4. Stronger Grainy Background

**Changes to `index.css`**:
- Increase the grain overlay opacity from `0.12` to `0.3`
- Increase the `baseFrequency` from `0.75` to `0.85` for a tighter, more visible grain pattern

## 5. Starting Currency: 300 Paws

**Changes to `AppContext.tsx`**:
- Change the default paws from `0` to `300` in the `load("paws", 300)` call so new users start with 300 Paws to experiment with cosmetics

---

## Technical Details

### Files Modified

| File | Changes |
|------|---------|
| `src/pages/Home.tsx` | Reposition buttons inside animal wrapper, centered via absolute positioning. Remove `mode="wait"` from AnimatePresence. Use "xl" size for animal. |
| `src/pages/Profile.tsx` | Use icon images for avatar. Add animal selection grid to change animal/theme. |
| `src/components/AnimalCharacter.tsx` | Add "xl" size (`w-72 h-72`) to sizeMap and Props type. |
| `src/index.css` | Increase grainy opacity to `0.3` and baseFrequency to `0.85`. |
| `src/context/AppContext.tsx` | Change default paws fallback from `0` to `300`. |

### Mitosis Animation Flow (Fixed)
```text
IDLE STATE:
  - Single Play button centered on animal (z-index above animal)
  - SVG goo filter applied to button container

TRANSITION (click Play):
  - Play button begins scaling down (scale: 1 -> 0)
  - Simultaneously, Pause + Stop buttons appear at center (scale: 0 -> 1)
  - Both sets of buttons are visible during crossover
  - Goo filter merges overlapping shapes into liquid blob
  - Pause slides left, Stop slides right

RESULT:
  - Two separated buttons flanking the animal
  - Continuous visual presence throughout animation
```

