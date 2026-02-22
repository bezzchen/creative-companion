

## Make Profile Name Editable

### Overview
Replace the static username text with an inline-editable field. Tapping the name enters edit mode with an input; pressing Enter or blurring saves it.

### Changes (only `src/pages/Profile.tsx`)

**1. Add local state for editing**
- Import `useState` from React
- Import `Pencil` icon from lucide-react
- Add `isEditing` and `editValue` state variables

**2. Replace the static username `<h1>` (lines 50-57)**
- When not editing: show the username with a small pencil icon button next to it. Clicking either the name or icon enters edit mode.
- When editing: show an `<input>` pre-filled with the current username, auto-focused, styled to match (centered, bold, same size). On Enter or blur, call `setUsername(editValue)` and exit edit mode. Max length 50 characters.

### Technical Details

Profile.tsx changes:
```text
import { useState } from "react";
import { Pencil } from "lucide-react";

// Inside component:
const [isEditing, setIsEditing] = useState(false);
const [editValue, setEditValue] = useState(username);

// Replace the <motion.h1> block:
- Not editing: <h1 onClick={startEditing}>{username} <Pencil size /></h1>
- Editing: <input value={editValue} onChange={...} onBlur={save} onKeyDown={Enter -> save} autoFocus maxLength={50} />

// save function:
const save = () => {
  const trimmed = editValue.trim();
  if (trimmed && trimmed.length <= 50) setUsername(trimmed);
  else setEditValue(username); // revert
  setIsEditing(false);
};
```

No other files need changes -- `setUsername` already exists in AppContext and validates/persists to the database.
