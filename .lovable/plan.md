

## Automatic Status System

### Overview
Replace the manual 4-status toggle with an automatic 3-status system: **studying**, **idle**, and **offline**. The status will be determined entirely by app state -- no user interaction needed.

### Status Logic
- **studying** -- timer is running (`timerRunning === true`)
- **idle** -- app is open/visible but timer is not running
- **offline** -- browser tab is hidden or user navigates away

### Changes

**1. `src/context/AppContext.tsx`**
- Update `UserStatus` type from `"studying" | "in-event" | "away" | "offline"` to `"studying" | "idle" | "offline"`
- Remove `setStatus` from the context interface and provider value (no longer user-controlled)
- Add a `useEffect` that automatically syncs status to the database:
  - When `timerRunning` is true, set status to `"studying"`
  - When `timerRunning` is false and document is visible, set status to `"idle"`
- Add a `useEffect` listening to `document.visibilitychange`:
  - When the tab becomes hidden, set status to `"offline"`
  - When it becomes visible again, set status based on `timerRunning` (studying or idle)
- Remove `setStatus` from the `ALLOWED_FIELDS` in `useProfile.ts` if needed, or keep it since the context still writes status via `updateProfile`

**2. `src/pages/Profile.tsx`**
- Remove the `setStatus` destructure from `useApp()`
- Remove the `statuses` array (line 16)
- Replace the interactive status toggle buttons (lines 73-86) with a single read-only status badge showing the current status with a colored dot indicator:
  - Green dot for "idle"
  - Blue/pulsing dot for "studying"  
  - Gray dot for "offline"
- Remove the `capitalize` button styling and replace with a simple badge below the username

**3. `src/pages/Groups.tsx`**
- No logic changes needed -- it already checks `status === "studying"` to pick the active vs idle image, which will continue to work with the new status values

### Technical Details

Status sync effect in AppContext:
```text
useEffect:
  - Listen to document "visibilitychange"
  - On hidden: updateProfile({ status: "offline" })
  - On visible: updateProfile({ status: timerRunning ? "studying" : "idle" })
  - Cleanup: remove event listener

useEffect (depends on timerRunning):
  - If timerRunning: updateProfile({ status: "studying" })
  - Else if document is visible: updateProfile({ status: "idle" })
```

Profile status display (read-only badge):
```text
<div className="flex items-center gap-2 mt-2">
  <span className="w-2 h-2 rounded-full {color based on status}" />
  <span className="text-sm text-muted-foreground capitalize">{status}</span>
</div>
```

