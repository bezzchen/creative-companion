

## Home Screen UI Tweaks + Speech Bubble

### Changes (all in `src/pages/Home.tsx`)

**1. Move icons closer together and lower**

- Change the Groups icon position from `left-20 top-4` to `left-8 top-12`
- Change the Profile icon position from `right-20 top-4` to `right-8 top-12`

This brings them closer to the animal horizontally and pushes them down vertically.

**2. Add a speech bubble above the animal**

- Create an array of encouraging quotes (e.g., "Let's study!", "You've got this!", "Time to focus!", "One step at a time!", "You're doing great!")
- Pick a random quote on mount using `useMemo`
- Render the speech bubble above the timer/animal area using `AnimatePresence`, visible only when `!isStudying` (inverse of the timer)
- The bubble uses the same animation pattern as the timer but reversed: it shows when the timer hides and hides when the timer shows
- Entry: `initial={{ opacity: 0, y: 200 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: 200 }}`
- Wrap in a bobbing container: `animate={{ y: [0, -8, 0] }}` with `duration: 2.5, repeat: Infinity` (matching the icon bob)
- Style: rounded card with a small triangle/tail pointing down, placed above the icons in z-order

### Technical Details

```text
Speech bubble structure:

<AnimatePresence>
  {!isStudying && (
    <motion.div  // bob wrapper
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div  // enter/exit animation
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 200 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="bg-card/90 ... rounded-2xl px-5 py-3 ...">
          <p>"Let's study!"</p>
          <!-- CSS triangle tail below -->
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

Positioned above the animal with mb-[-1rem] and z-0,
mirroring the timer's placement but shown in the opposite state.
```

No other files need changes.
