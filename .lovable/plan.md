

## Fix Store Purchases and Make All Cosmetics Work

### Problem
The store is broken because the **database `cosmetics` table** contains the old item IDs (e.g., `hat-crown`, `hat-tophat`, `bg-sunset`) but the frontend `COSMETIC_STORE` now uses new IDs (e.g., `hat-hat`, `hat-bow`, `bg-iceberg`). The `purchase_cosmetic` RPC validates against the database, so every purchase fails with "Invalid cosmetic item".

### Solution

#### 1. Database Migration -- Replace cosmetics catalog

Create a new migration that:
- Deletes all rows from `cosmetics` table
- Inserts the 9 new items matching the frontend IDs and prices
- Clears any `user_cosmetics` referencing old IDs that no longer exist
- Resets any equipped cosmetics on profiles that reference old IDs

New items to insert:

| ID | Name | Category | Price | Preview |
|----|------|----------|-------|---------|
| hat-hat | Hat | hat | 30 | hat |
| hat-bow | Bow | hat | 25 | bow |
| hat-glasses | Glasses | hat | 20 | glasses |
| bg-iceberg | Iceberg | background | 80 | iceberg |
| bg-field | Field | background | 70 | field |
| bg-house | House | background | 75 | house |
| border-butterfly | Butterfly | border | 50 | butterfly |
| border-music | Music | border | 45 | music |
| border-fire | Fire | border | 55 | fire |

#### 2. No frontend changes needed

The frontend code (Store.tsx, AppContext.tsx, AnimalCharacter.tsx) already correctly handles:
- Buying via `purchase_cosmetic` RPC
- Equipping/unequipping all 3 categories (hat, border, background) via `equipCosmetic`/`unequipCosmetic` in AppContext
- Displaying the equipped hat on the home screen via `cosmeticAnimalMap` in AnimalCharacter

Once the database items match the frontend IDs, everything will work.

### Technical Details

**Migration SQL:**
```text
-- Clean up old cosmetics references
DELETE FROM user_cosmetics WHERE cosmetic_id NOT IN (
  'hat-hat','hat-bow','hat-glasses',
  'bg-iceberg','bg-field','bg-house',
  'border-butterfly','border-music','border-fire'
);

-- Reset equipped cosmetics referencing old items
UPDATE profiles SET equipped_hat = NULL
  WHERE equipped_hat IS NOT NULL
  AND equipped_hat NOT IN ('hat-hat','hat-bow','hat-glasses');
UPDATE profiles SET equipped_border = NULL
  WHERE equipped_border IS NOT NULL
  AND equipped_border NOT IN ('border-butterfly','border-music','border-fire');
UPDATE profiles SET equipped_background = NULL
  WHERE equipped_background IS NOT NULL
  AND equipped_background NOT IN ('bg-iceberg','bg-field','bg-house');

-- Replace cosmetics catalog
DELETE FROM cosmetics;
INSERT INTO cosmetics (id, name, category, price, preview) VALUES
  ('hat-hat', 'Hat', 'hat', 30, 'hat'),
  ('hat-bow', 'Bow', 'hat', 25, 'bow'),
  ('hat-glasses', 'Glasses', 'hat', 20, 'glasses'),
  ('bg-iceberg', 'Iceberg', 'background', 80, 'iceberg'),
  ('bg-field', 'Field', 'background', 70, 'field'),
  ('bg-house', 'House', 'background', 75, 'house'),
  ('border-butterfly', 'Butterfly', 'border', 50, 'butterfly'),
  ('border-music', 'Music', 'border', 45, 'music'),
  ('border-fire', 'Fire', 'border', 55, 'fire');
```

**Files changed:**
- New migration file in `supabase/migrations/` (database only fix)

