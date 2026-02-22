

## Move Paw Icon to Top-Left of Home Page

### Problem
The paw icon is currently placed inside the animal character container with `right-[150px]`, which puts it on the right side and tied to the animal's position. It should be at the very top-left corner of the page.

### Solution
Move the paw icon out of the animal container and place it as a fixed/absolute element at the top-left of the main content area, using `left-6 top-6` positioning (similar to a page-level floating button).

### Changes

**`src/pages/Home.tsx`**
- Remove the paw icon block from inside the `<div className="relative flex items-center justify-center">` container (lines 145-158)
- Add it instead right after the main content div opens (after line 96), as an absolutely positioned element with `left-6 top-6 z-20` so it sits at the top-left of the page

### Files changed
- `src/pages/Home.tsx`

