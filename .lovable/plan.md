

## Reduce Distance Between Group and Profile Icons

### Change

In `src/pages/Home.tsx`, the Groups icon is positioned with `className="absolute -left-2 top-4 z-20"` and the Profile icon with `className="absolute -right-2 top-4 z-20"`. These `-left-2` and `-right-2` values control how far apart the icons are from the animal character in the center.

To bring them closer together, change both values inward:
- Groups icon (line 86): `-left-2` to `left-4`
- Profile icon (line 103): `-right-2` to `right-4`

This shifts each icon roughly 24px inward toward the animal, reducing the total gap between them.

