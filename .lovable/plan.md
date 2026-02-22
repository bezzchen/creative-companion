

## Bigger Group Cards and Status-Accurate Images

### Changes (all in `src/pages/Groups.tsx`)

**1. Group list cards (lines 91-103) -- increase height, font, and icon size**

- Change card padding from `p-4` to `p-5`
- Increase emoji from `text-3xl` to `text-4xl`
- Increase group name font from default to `text-lg`
- Increase member count text from `text-sm` to `text-base`

**2. Group detail member cards (lines 154-186) -- increase height, font, and images**

- Change card padding from `p-3` to `p-4`
- Increase rank label from `text-sm` to `text-base`
- Increase avatar circle from `w-10 h-10` to `w-14 h-14`, inner icon from `w-7 h-7` to `w-10 h-10`
- Increase username font from `text-sm` to `text-base`
- Increase hours text from `text-xs` to `text-sm`
- Increase status image from `w-16 h-12` to `w-20 h-16`

**3. Fix status image logic (line 148-150)**

Currently the image only checks for `"studying"` and falls back to idle table for everything else. This already matches the requirement (idle and offline both show the table image, studying shows the active image), so no logic change is needed -- just updating the alt text to also mention "Offline".

### Technical Details

Group list card change:
```text
Before: className="... gap-4 p-4 ..."   emoji: text-3xl   name: font-bold   members: text-sm
After:  className="... gap-4 p-5 ..."   emoji: text-4xl   name: font-bold text-lg   members: text-base
```

Member detail card change:
```text
Before: p-3, rank text-sm, avatar w-10 h-10 / icon w-7 h-7, name text-sm, hrs text-xs, status img w-16 h-12
After:  p-4, rank text-base, avatar w-14 h-14 / icon w-10 h-10, name text-base, hrs text-sm, status img w-20 h-16
```

No other files need changes.
