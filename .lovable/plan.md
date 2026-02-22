
## Fix Floating Icons, Enlarge Animal, and Adjust Buttons

### 1. Fix Group and Profile icon animations (Home.tsx, lines 84-110)

**Problem**: The icons use conditional rendering (`{!isStudying && ...}`) with `initial` entrance animations (opacity 0, scale 0.5, x offset). Every mount triggers a fly-in animation. They also lack `layoutId` props, so there's no shared layout transition to the BottomNav.

**Fix**:
- Add `layoutId="group-icon"` to the Group button and `layoutId="profile-icon"` to the Profile button (matching BottomNav's layoutIds)
- Remove `initial` and the entrance-related props (`opacity`, `x`, `scale`) from `animate`
- Keep only the sine-wave bobbing in `animate`: `{ y: [0, -8, 0] }` with `transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }`
- The Profile icon's delay (0.5s) stays for a staggered bob effect

This means:
- When idle, icons just bob gently (no fly-in on mount)
- When `isStudying` becomes true, icons unmount from Home and the BottomNav icons (with matching `layoutId`) will receive the shared layout animation, making them appear to fly down to the footer

### 2. Enlarge animal character (AnimalCharacter.tsx, line 47)

**Change**: Update the `xl` size from `"w-72 h-72"` to `"w-[36rem] h-[36rem]"` (doubles from 18rem to 36rem). Alternatively, add a new `"2xl"` size to avoid breaking other usages of `xl`.

Better approach: Add a `"2xl"` entry to `sizeMap`:
```
2xl: "w-[36rem] h-[36rem]"
```
Update the `Props` type to include `"2xl"`, and change Home.tsx to use `size="2xl"`.

### 3. Equalize button sizes and increase spacing (Home.tsx, lines 119-153)

- **Stop button**: Change from `w-14 h-14` to `w-16 h-16` (match the play/pause button)
- **Spacing**: Increase the x-offset from `28` to `44` for both buttons:
  - Play/Pause: `animate={{ x: isStudying ? -44 : 0 }}`
  - Stop: `animate={{ x: isStudying ? 44 : 0 }}`

### Files to edit

1. **`src/components/AnimalCharacter.tsx`**
   - Add `"2xl": "w-[36rem] h-[36rem]"` to sizeMap
   - Update Props type to include `"2xl"`

2. **`src/pages/Home.tsx`**
   - Group icon (line 86-93): Add `layoutId="group-icon"`, remove `initial`, simplify `animate` to just the bobbing
   - Profile icon (line 98-109): Add `layoutId="profile-icon"`, remove `initial`, simplify `animate` to just the bobbing with delay
   - Animal (line 114): Change `size="xl"` to `size="2xl"`
   - Play/Pause button (line 120): Change x offset from -28 to -44
   - Stop button (lines 141, 149): Change `w-14 h-14` to `w-16 h-16`, change x offset from 28 to 44
