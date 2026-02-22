

## Updates

### 1. Update page title to "Pawsive"
Change the `<title>` and Open Graph/Twitter meta tags in `index.html` from "Lovable App" to "Pawsive".

### 2. Add group icon to Groups page
Import `mygroup.png` and render it in the top-right corner of the Groups page header area.

### Technical Details

**`index.html`** -- Update title and meta tags:
- `<title>Pawsive</title>`
- `og:title` content to "Pawsive"
- `og:description` and `meta description` to "Pawsive"

**`src/pages/Groups.tsx`** -- Add image:
- Import `mygroup.png` from `@/assets/mygroup.png`
- Render an `<img>` element in the top-right area of the page header, sized appropriately (e.g., `w-12 h-12`)

### Files changed
- `index.html`
- `src/pages/Groups.tsx`

