# Groups Page Overhaul, Gooey Play Button, and Visual Polish

## 1. New Asset Files

Copy uploaded images into `src/assets/`:

- `catactive.png`, `caticon.png`
- `chickenactive.png`, `chickenicon.png`
- `dogactive.png`, `dogicon.png`
- `idletable.png`

Update `AnimalCharacter.tsx` to use the new "active" variants for all animals (not just bear). Add icon variants map for use in groups and profile picture.

## 2. Groups Page Redesign (matching GroupStatus.png)

**Layout changes to `Groups.tsx`:**

- Header: "My Study Group" on left, rounded "+ Invite" button on right
- Each leaderboard row shows: rank text (1st, 2nd...), circular animal icon PFP, name + hours, and the status illustration on the right side
- Status illustrations: if member status is "studying", show their `{animal}active.png` (animal at table). If idle/away/offline, show `idletable.png` (empty table)

**Invite Code Popup:**

- When "+ Invite" button is pressed, open a Dialog showing the group's invite code (mock: random 6-char code)
- Copy-to-clipboard button

**Create / Join Group Popup:**

- When "Create / Join group" is pressed, open a Dialog with two tabs:
  - "Join" tab: text input for invite code + Join button
  - "Create" tab: text input for group name, optional emoji picker for icon, Create button

## 3. Gooey SVG Filter for Play Button Mitosis

Add an inline SVG `<filter>` element with a Gaussian blur + color matrix ("goo" effect) to `Home.tsx`. Wrap the play/pause/stop button area in a container that applies this filter. During the split animation, the buttons will appear to stretch and divide like a liquid droplet.

The play button will be repositioned to overlap the animal character (moved up, higher z-index). Make the animal slightly larger (from `w-56 h-56` to `w-64 h-64` for "lg" size).

## 4. Circular Group and Profile Icons

Change the Home screen's Group and Profile floating buttons from `rounded-2xl` to `rounded-full` to make them circular.

Change BottomNav tab buttons to also use circular styling.

## 5. Grainy Background Effect

Add a CSS pseudo-element or overlay with a noise/grain texture using an SVG `feTurbulence` filter applied as a background. Add this as a utility class `.grainy` in `index.css` and apply it to the Home screen's main container.

---

## Technical Details

### Files Modified


| File                                 | Changes                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `src/assets/`                        | 7 new image files copied                                                                           |
| `src/components/AnimalCharacter.tsx` | Add active images for cat/dog/chicken, add icon images map, increase "lg" size                     |
| `src/pages/Groups.tsx`               | Full redesign: status illustrations (active table vs idle table), invite popup, create/join popup  |
| `src/pages/Home.tsx`                 | SVG goo filter on play button area, reposition buttons to overlap animal, circular icon buttons    |
| `src/components/BottomNav.tsx`       | Circular icon styling                                                                              |
| `src/index.css`                      | Add `.grainy` utility class with SVG noise overlay                                                 |
| `src/context/AppContext.tsx`         | Add `inviteCode` field to `StudyGroup` interface, update mock data with animal-appropriate members |


### Gooey Filter Implementation

```text
SVG Filter Chain:
  feGaussianBlur (stdDeviation=10)
    -> feColorMatrix (boost alpha channel to create hard edges)
    -> feBlend

Applied to a wrapper <div> around the play/pause/stop buttons.
The blur merges overlapping shapes, and the color matrix
snaps the alpha back to create the "liquid blob" look.
```

### Group Status Illustration Logic

```text
For each member in the leaderboard:
  if status === "studying" -> show {animal}active.png (e.g. dogactive.png)
  else (away/offline/in-event) -> show idletable.png (empty table)
```