

## Show Equipped Background and Border Icon on Home Screen and Profile

### Overview
Two cosmetic categories are not visually reflected anywhere:
1. **Background** -- equipping a background (Iceberg, Field, House) does nothing on the home screen
2. **Border/Icon** -- equipping an icon (Butterfly, Music, Fire) does nothing on the profile page or in group member lists

### Changes

#### 1. `src/pages/Home.tsx` -- Full-screen background image when background is equipped

- Read `equippedBackground` from `useApp()`
- Import the 3 background images (`Iceberg.png`, `Field.png`, `House.png`)
- When a background is equipped, render it as a full-screen absolutely positioned image (covering the entire home screen behind all content), replacing the default `theme-gradient` background
- Use a fade-in animation via framer-motion for a smooth transition when equipped

#### 2. `src/pages/Profile.tsx` -- Show equipped border icon on avatar

- Read the equipped border icon image and render it visually on the avatar
- Currently `borderItem` is read but only used for a generic `ring-4 ring-primary` style -- instead, render the actual icon image (butterfly, music, fire) as small decorative elements around the avatar circle
- Show 3-4 small copies of the icon image positioned around the avatar corners with subtle floating animation

#### 3. `src/pages/Groups.tsx` -- Show equipped border icon on group member avatars

- The group detail view already reads `p.equipped_border` and applies a generic ring style
- Update it to also render the actual icon image as a small badge/overlay on the member's avatar circle (e.g., bottom-right corner), so other group members can see each other's equipped icons

### Technical Details

**Home.tsx background:**
```text
// Import background images
import icebergBg from "@/assets/Iceberg.png";
import fieldBg from "@/assets/Field.png";
import houseBg from "@/assets/House.png";

const backgroundMap: Record<string, string> = {
  "bg-iceberg": icebergBg,
  "bg-field": fieldBg,
  "bg-house": houseBg,
};

// Read from context
const { equippedBackground, ... } = useApp();
const bgImage = equippedBackground ? backgroundMap[equippedBackground] : null;

// Render: absolutely positioned img covering full screen, behind all content (z-0)
// When no background equipped, the existing theme-gradient shows through
```

**Profile.tsx icon display:**
```text
// Import icon images
import butterflyIcon from "@/assets/butterfly.png";
import musicIcon from "@/assets/music.png";
import fireIcon from "@/assets/fire.png";

const borderIconMap: Record<string, string> = {
  "border-butterfly": butterflyIcon,
  "border-music": musicIcon,
  "border-fire": fireIcon,
};

// Render the icon image as a small badge at the bottom-right of the avatar
// w-8 h-8 absolutely positioned
```

**Groups.tsx icon display:**
```text
// Same icon map, render a small w-6 h-6 icon badge at bottom-right of each member avatar
// Only when p.equipped_border is set
```

### Files changed
- `src/pages/Home.tsx` -- add full-screen background image overlay
- `src/pages/Profile.tsx` -- show border icon on avatar
- `src/pages/Groups.tsx` -- show border icon on member avatars

