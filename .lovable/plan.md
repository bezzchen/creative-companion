## Home Page: Larger Button, Longer Timer Animation, and Arc-Path Icon Transitions

### 1. Enlarge start button

In `src/pages/Home.tsx`:

- Play/Pause button: `w-20 h-20` to `w-24 h-24`
- Play/Pause icons: `w-9 h-9` to `w-11 h-11`
- Stop button: `w-20 h-20` to `w-24 h-24`
- Stop icon increase
- Increase x-offset from 60 to 72 to account for larger button

### 2. Timer travels from screen center

In `src/pages/Home.tsx`:

- Change timer animation `y` from `40` to `200` in both `initial` and `exit` states
- This makes the timer emerge from behind the animal (center of screen) and travel much further upward

### 3. Arc-path layoutId transitions for Group and Profile icons

This is the core change. When the user taps the Groups or Profile floating icon on the Home screen, the icon should physically travel in a smooth arc down to the Bottom Navigation bar, rather than teleporting.

**How it works:**

- Add Framer Motion `layoutId` props to the floating icons in Home and the matching icons in BottomNav
- The key issue from before was that BottomNav returned `null` on `/home`, so there was no target element for the layoutId animation. The fix: **always render BottomNav** but translate it off-screen on `/home` so the DOM elements with matching `layoutId`s exist
- When the user taps an icon and navigates, Framer Motion detects the same `layoutId` in both the departing (Home floating icon) and arriving (BottomNav icon) components, and animates between them
- Wrap the route area in a Framer Motion `LayoutGroup` so layoutId transitions work across sibling components (Home and BottomNav)

**Files to edit:**

`**src/pages/Home.tsx**`:

- Line 65: Change `y: 40` to `y: 200` in timer initial
- Line 67: Change `y: 40` to `y: 200` in timer exit
- Line 83-90: Add `layoutId="groups-icon"` to the Groups floating button, keep bobbing animation
- Line 94-103: Add `layoutId="profile-icon"` to the Profile floating button, keep bobbing animation
- Line 118: Change `w-20 h-20` to `w-24 h-24`
- Lines 123, 125, 127: Change `w-9 h-9` to `w-11 h-11`
- Line 113: Change x offset from -60 to -72

`**src/components/BottomNav.tsx**`:

- Always render the nav (remove the early `return null` for `/home`), but apply a transform to slide it below the viewport on `/home` so it's invisible but its layoutId elements exist in the DOM
- Add `layoutId="groups-icon"` to the Groups tab icon
- Add `layoutId="profile-icon"` to the Profile tab icon
- Add a `layoutId` mapping to the tabs config so each icon gets the correct ID
- Use `AnimatePresence` and animate the nav bar sliding up when transitioning away from `/home`

`**src/App.tsx**`:

- Import `LayoutGroup` from `framer-motion`
- Wrap the `ProtectedRoutes` content (Routes + BottomNav) in a `LayoutGroup` so layoutId animations work across Home and BottomNav

### Technical details

```text
Home Screen (/home)                    Groups Screen (/groups)
+---------------------------+         +---------------------------+
|                           |         |                           |
|   [Groups]  Animal [Profile]   -->  |      Groups Content       |
|         [Play Button]     |         |                           |
|                           |         |                           |
|                           |         |  [Home] [Groups] [Profile]|
|   (BottomNav hidden       |         |  (BottomNav visible,      |
|    below viewport but     |         |   icons have matching     |
|    DOM exists with        |         |   layoutIds)              |
|    layoutIds)             |         |                           |
+---------------------------+         +---------------------------+

layoutId="groups-icon"  animates from floating left -> nav bar center
layoutId="profile-icon" animates from floating right -> nav bar right
```

The `LayoutGroup` wrapper ensures Framer Motion can track layoutId elements across the Home component and BottomNav component, creating the smooth arc-path transition automatically.