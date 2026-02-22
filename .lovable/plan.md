

## Fix: Make entire icon circles bob together

### Problem
The bobbing animation is on the inner `motion.div` wrapping only the icon (`Users`/`User`), so only the icon image moves while the circular container stays still.

### Solution
Add a **wrapper `motion.div`** around each `motion.button` that handles the bobbing animation. This way the entire circle (button + icon) bobs together, while the `layoutId` remains on the `motion.button` for arc-path transitions.

### File: `src/pages/Home.tsx`

**Groups icon** -- change from:
```jsx
<motion.button layoutId="groups-icon" onClick={...} className="...">
  <motion.div animate={{ y: [0, -8, 0] }} transition={...}>
    <Users ... />
  </motion.div>
</motion.button>
```
To:
```jsx
<motion.div
  animate={{ y: [0, -8, 0] }}
  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  className="absolute -left-14 top-4 z-20"
>
  <motion.button
    layoutId="groups-icon"
    onClick={() => navigate("/groups")}
    className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50"
  >
    <Users className="w-5 h-5 text-primary" />
  </motion.button>
</motion.div>
```

**Profile icon** -- same pattern with the bobbing wrapper outside, `layoutId` on the button, and `delay: 0.5` on the bobbing transition.

This keeps `layoutId` isolated on the button (for clean arc-path transitions) while the outer wrapper bobs the entire circle and icon together.
