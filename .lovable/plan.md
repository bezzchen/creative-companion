

## Adjust Auth Page Layout

### Overview
Move the form card higher up on the page and make the animal character 3x larger (from `w-32 h-32` to `w-96 h-96`). Adjust spacing so everything fits well together.

### Changes to `src/pages/Auth.tsx`

1. **Change the main container layout**: Switch from `justify-between` to `justify-start` with a small top gap, so the logo and form sit near the top rather than being evenly spaced across the full height.

2. **Reduce logo top margin**: Change `mt-4` to `mt-2` and add a small bottom margin.

3. **Add margin below the form**: Add `mt-4` to the form so it sits right after the logo, pushed toward the top of the page.

4. **Make the animal 3x larger**: Change `w-32 h-32` to `w-96 h-96` on the animal image.

5. **Let the animal + speech bubble fill remaining space**: Use `flex-1` on the speech bubble + animal container so it occupies the remaining vertical space and centers the animal naturally below the form.

6. **Move toggle link**: Add `pb-4` to keep the toggle at the bottom with minimal padding.

### Files changed
- `src/pages/Auth.tsx`

