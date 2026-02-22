

## Fix: Icons replaying animation on Home return

### Problem
The `layoutId` prop and the repeating `animate={{ y: [0, -8, 0] }}` bob animation are on the **same** `motion.button` element. When navigating back to Home, the layoutId transition fires and conflicts with the looping keyframe animation, causing it to replay slowly and repeatedly.

### Solution
Separate concerns across two elements:
- **Outer `motion.button`**: Handles `layoutId` only (for the arc-path transition between screens)
- **Inner `motion.div`**: Handles the looping bob animation independently

### File: `src/pages/Home.tsx`

**Groups icon (lines 83-91):** Restructure to:
```jsx
<motion.button
  layoutId="groups-icon"
  onClick={() => navigate("/groups")}
  className="absolute -left-14 top-4 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50 z-20"
>
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <Users className="w-5 h-5 text-primary" />
  </motion.div>
</motion.button>
```

**Profile icon (lines 96-104):** Same pattern -- `layoutId` on outer button, bobbing on inner div with the 0.5s delay.

This ensures the layoutId arc-path transition plays once cleanly, and the bob animation loops independently on the inner element without interference.
