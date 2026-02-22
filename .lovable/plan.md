

## Pause State, New Cosmetics with Real Images

### Overview
Three changes: (1) show `activetable.png` when the timer is paused, (2) replace the old emoji-based cosmetic store with the actual uploaded images, and (3) make the animal on the home screen reflect the equipped cosmetic.

---

### 1. Paused State: Show activetable.png

**`src/components/AnimalCharacter.tsx`**
- Add a `paused` prop (boolean, default false)
- Import `activetable.png`
- When `paused` is true, render `activetable.png` instead of the normal animal image

**`src/pages/Home.tsx`**
- Pass `paused={isStudying && !timerRunning}` to `AnimalCharacter`

---

### 2. Replace COSMETIC_STORE with Real Image Items

**`src/context/AppContext.tsx`**
- Replace the old 13-item `COSMETIC_STORE` with 9 items across 3 categories:
  - **hat** (animal cosmetics): Hat, Bow, Glasses -- preview images from `hat.png`, `bow.png`, `glasses.png`
  - **background**: Iceberg, Field, House -- preview images from `Iceberg.png`, `Field.png`, `House.png`
  - **border** (renamed to "Icons" in UI only): Butterfly, Music, Fire -- preview images from `butterfly.png`, `music.png`, `fire.png`
- The `preview` field changes from emoji string to imported image path
- Update `CosmeticItem` interface: `preview` becomes `string` (still works, just holds an image URL now)

New store items:
| ID | Name | Category | Price |
|----|------|----------|-------|
| hat-hat | Hat | hat | 30 |
| hat-bow | Bow | hat | 25 |
| hat-glasses | Glasses | hat | 20 |
| bg-iceberg | Iceberg | background | 80 |
| bg-field | Field | background | 70 |
| bg-house | House | background | 75 |
| border-butterfly | Butterfly | border | 50 |
| border-music | Music | border | 45 |
| border-fire | Fire | border | 55 |

---

### 3. Animal Reflects Equipped Hat Cosmetic on Home Screen

**`src/components/AnimalCharacter.tsx`**
- Import all animal+cosmetic composite images: `bearhat.png`, `bearbow.png`, `bearglasses.png`, `cathat.png`, `catbow.png`, `catglasses.png`, `doghat.png`, `dogbow.png`, `dogglasses.png`, `duckhat.png`, `duckbow.png`, `duckglasses.png`
- Create a lookup map: `{ "hat-hat": { bear: bearhat, cat: cathat, ... }, "hat-bow": { ... }, "hat-glasses": { ... } }`
- When `equippedHat` is set and the animal is in idle state (not active, not paused), use the composite image instead of the base animal image
- Remove the old emoji hat overlay (`hatItem` / emoji `<div>`)
- Read `equippedHat` from context (already done)

---

### 4. Store UI Update

**`src/pages/Store.tsx`**
- Update the item preview from emoji `<span>` to `<img>` tag showing the `item.preview` image
- Update category label for "border" to display as "Icons" with a suitable emoji

---

### 5. Clean Up Old Code

- Remove old cosmetic-specific animal imports that are no longer needed (e.g., `bearbow.png` for old overlays -- actually these are still used for composites)
- Remove the emoji-based hat overlay logic in `AnimalCharacter.tsx` (lines 86-91)
- Remove old `COSMETIC_STORE` items that no longer exist

---

### Technical Details

**AnimalCharacter.tsx image selection logic:**
```text
if paused -> activetable.png
else if active -> animalActiveImages[animal]
else if equippedHat and cosmeticAnimalMap[equippedHat][animal] exists -> composite image
else -> idle animation frames (existing behavior)
```

**Store.tsx preview rendering:**
```text
Before: <span className="text-4xl">{item.preview}</span>
After:  <img src={item.preview} className="w-16 h-16 object-contain" />
```

**Files changed:**
- `src/context/AppContext.tsx` -- new COSMETIC_STORE items with image imports
- `src/components/AnimalCharacter.tsx` -- paused prop, composite images, remove emoji overlay
- `src/pages/Home.tsx` -- pass paused prop
- `src/pages/Store.tsx` -- render image previews, update category label

