

## Add paw.png as Home Button with Layout Animation

### Overview
Replace the Lucide `Home` icon with `paw.png` in both the Home page (as a floating button, top-left) and the BottomNav footer. The paw icon will use `layoutId` to animate between the two positions (same as Groups and Profile icons), but without the bobbing/sine-wave animation on the Home page.

### Changes

#### 1. `src/pages/Home.tsx`
- Import `paw.png` from assets
- Add a new floating button in the top-left area (when `!isStudying`), using `layoutId="home-icon"` for the shared layout transition
- Render `paw.png` as an `<img>` inside the button (no bobbing `y` animation -- just static positioning so it only animates when transitioning to/from the footer)

#### 2. `src/components/BottomNav.tsx`
- Import `paw.png` from assets
- Give the Home tab a `layoutId` of `"home-icon"` (currently `undefined`)
- Replace the Lucide `Home` icon with the `paw.png` image for the Home tab

### Technical Details

**Home.tsx** -- new floating paw button (top-left, no bobbing):
```text
import pawIcon from "@/assets/paw.png";

// Rendered when !isStudying, positioned top-left of the animal area
<motion.button
  layoutId="home-icon"
  onClick={() => navigate("/home")}
  className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50"
>
  <img src={pawIcon} alt="Home" className="w-6 h-6 object-contain" />
</motion.button>
```

**BottomNav.tsx** -- replace Home icon with paw.png:
```text
import pawIcon from "@/assets/paw.png";

// Home tab gets layoutId: "home-icon"
// Instead of <Icon /> for the Home tab, render <img src={pawIcon} />
```

### Files changed
- `src/pages/Home.tsx`
- `src/components/BottomNav.tsx`

