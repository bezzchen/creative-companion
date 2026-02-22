

## Clean Up Old Animation Code

### Overview
The previous simplification deleted the squish/long2 image files but didn't fully update `AnimalCharacter.tsx`. The file still imports deleted images and uses the old 8-frame cycle. This fix removes all references to deleted files and updates the animation to the approved 2-frame cycle.

### Changes to `AnimalCharacter.tsx`

**Remove these imports (lines 17-28):**
- `bearsquish1.png`, `bearsquish2.png`, `bearlong2.png`
- `catsquish1.png`, `catsquish2.png`, `catlong2.png`
- `dogsquish1.png`, `dogsquish2.png`, `doglong2.png`

**Add missing import:**
- `ducklong1.png` (for chicken/duck idle animation)

**Update `animalIdleFrames` (lines 51-56):**
- Change from 8-frame arrays to 2-frame arrays: `[original, long1]`
- Include all four animals (add chicken/duck)
- Change type from `Partial<Record<...>>` to `Record<...>`

**Update interval (line 86):**
- Change `% 8` to `% 2`

### No other files need changes
All unused image files were already deleted in the previous step.

