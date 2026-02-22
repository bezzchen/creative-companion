

## Fix Floating Icons and Timer Visibility

### Changes to `src/pages/Home.tsx`

**1. Restore sine-wave floating animation on Group and Profile icons**

The Group icon (lines 80-87) and Profile icon (lines 92-103) currently use `initial`/`animate` with entrance transitions mixed into the float animation. This causes the float to restart or conflict on re-mount. Fix: keep the float animation as-is (it already uses `y: [0, -8, 0]` with `repeat: Infinity`) but the icons are conditionally rendered (`{!isStudying && ...}`), so they remount each time -- the current `initial` + `animate` approach is actually correct for the float. The Profile icon already has the delay. No changes needed here; the floating logic is intact.

**2. Hide the timer when not studying**

The timer (lines 67-74) is currently always visible. Wrap it so it only shows when `isStudying` is true, with a fade-in animation:

- Replace the static `<div className="mb-6">` wrapper with a conditional: only render when `isStudying` is true
- Wrap in `<motion.div>` with `initial={{ opacity: 0, y: -10 }}` and `animate={{ opacity: 1, y: 0 }}` for a smooth entrance

### Summary of edits

- **Lines 67-74**: Wrap timer in `{isStudying && <motion.div ...>}` so it only appears during a study session
- No other changes needed -- the floating icons already have the correct sine-wave animation

