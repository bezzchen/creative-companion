

## Redesign Login Page to Match Screenshot

### Overview
Redesign the Auth page to match the uploaded screenshot layout: logo at top, form fields in a card, a speech bubble with a random message, and a random idle-animated animal character at the bottom.

### Layout (top to bottom)
1. **Logo**: `longlogo.png` image centered at top
2. **Form card**: White rounded card with Email and Password fields, plus Sign In/Sign Up button
3. **Speech bubble**: Displays contextual message ("Welcome back!" or "Create your account") with bobbing animation and a downward-pointing tail -- same style as Home page
4. **Animal character**: Random animal (bear/cat/dog/chicken) with the 2-frame idle animation, displayed at the bottom of the screen
5. **Toggle link**: "Don't have an account? Sign up" at the very bottom

### Technical Details

**`src/pages/Auth.tsx`** -- Full rewrite of the component:
- Import `longlogo.png`, `framer-motion` (`motion`, `AnimatePresence`), and animal images (all 4 animals + their long1 variants)
- Use `useMemo` to pick a random animal on mount
- Use `useState` + `useEffect` for 2-frame idle animation (750ms interval, same as `AnimalCharacter.tsx`)
- Replace the header text with `<img src={longLogo} />` 
- Keep the form with same functionality (email, password, submit, error handling)
- Add speech bubble (bobbing `y: [0, -8, 0]` animation) displaying the login/signup message
- Render the random animal at the bottom with idle animation
- Style the background to match the screenshot (light blue gradient)

**Animal idle animation** (same logic as AnimalCharacter.tsx):
```text
const animals = [
  { idle: bearImg, long: bearLong1 },
  { idle: catImg, long: catLong1 },
  { idle: dogImg, long: dogLong1 },
  { idle: duckImg, long: duckLong1 },
];
// Pick random on mount, cycle frames every 750ms
```

**Speech bubble** (same pattern as Home.tsx):
```text
<motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
  <div className="bg-card/90 rounded-2xl px-10 py-6 shadow-lg border ...">
    <p>{isLogin ? "Welcome back!" : "Create your account"}</p>
    <div className="absolute -bottom-2 ... rotate-45" /> <!-- tail -->
  </div>
</motion.div>
```

**Asset**: `longlogo.png` is already at `src/assets/longlogo.png` -- just needs to be imported.

### Files changed
- `src/pages/Auth.tsx`

