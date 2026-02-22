
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
