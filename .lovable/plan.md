

# Supabase Backend Integration

## Overview

Replace all localStorage-based state with persistent Supabase tables and add authentication. The existing `buildathon26` table will be dropped and replaced with purpose-built tables.

## 1. Authentication

Add email/password signup and login using Supabase Auth. Create an `/auth` page with login/signup tabs. Protect all routes behind auth. On signup, a database trigger auto-creates a profile row.

## 2. Database Schema

### Tables to Create

**profiles**
- `id` (uuid, PK, references auth.users)
- `username` (text, default 'StudyBuddy')
- `animal` (text, nullable - bear/cat/dog/chicken)
- `status` (text, default 'offline')
- `paws` (integer, default 300)
- `hours_studied` (numeric, default 0)
- `streak` (integer, default 0)
- `equipped_hat` (text, nullable)
- `equipped_border` (text, nullable)
- `equipped_background` (text, nullable)
- `created_at` (timestamptz)

**user_cosmetics** (owned items)
- `id` (uuid, PK)
- `user_id` (uuid, references profiles.id)
- `cosmetic_id` (text, not null) -- e.g. "hat-crown"
- `purchased_at` (timestamptz)
- unique(user_id, cosmetic_id)

**study_groups**
- `id` (uuid, PK)
- `name` (text)
- `icon` (text, default book emoji)
- `invite_code` (text, unique, 6 chars)
- `created_by` (uuid, references profiles.id)
- `created_at` (timestamptz)

**group_members**
- `id` (uuid, PK)
- `group_id` (uuid, references study_groups.id on delete cascade)
- `user_id` (uuid, references profiles.id on delete cascade)
- `joined_at` (timestamptz)
- unique(group_id, user_id)

**study_sessions** (completed timer sessions)
- `id` (uuid, PK)
- `user_id` (uuid, references profiles.id)
- `duration_seconds` (integer)
- `paws_earned` (integer)
- `started_at` (timestamptz)
- `ended_at` (timestamptz, default now())

### Table to Drop
- `buildathon26` (unused placeholder)

### RLS Policies

All tables have RLS enabled:
- **profiles**: Users can read all profiles (for group leaderboards), update only their own
- **user_cosmetics**: Users can read/insert/delete only their own
- **study_groups**: Authenticated users can read groups they belong to, insert new groups
- **group_members**: Members can read members of their groups, insert (join), delete own membership
- **study_sessions**: Users can read/insert only their own

### Database Functions and Triggers
- `handle_new_user()` trigger: auto-create profile row on auth.users insert
- `generate_invite_code()`: generate random 6-char alphanumeric code for new groups
- `join_group_by_code(code text)`: look up group by invite code, insert membership

## 3. Frontend Changes

### New Files
- `src/pages/Auth.tsx` - Login/signup page with tabs
- `src/context/AuthContext.tsx` - Auth state provider (session, user, loading)
- `src/hooks/useProfile.ts` - Fetch and update profile from Supabase
- `src/hooks/useCosmetics.ts` - Fetch owned cosmetics, buy, equip/unequip
- `src/hooks/useGroups.ts` - Fetch groups, create, join by code
- `src/hooks/useStudySessions.ts` - Log completed sessions

### Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Add AuthProvider, redirect unauthenticated users to `/auth` |
| `src/context/AppContext.tsx` | Replace localStorage with Supabase hooks; keep timer logic local (it only persists on stop) |
| `src/pages/Onboarding.tsx` | On animal pick, update profile in Supabase |
| `src/pages/Home.tsx` | Timer stop saves a study_session and updates profile hours/paws in Supabase |
| `src/pages/Profile.tsx` | Animal change and status change update profile in Supabase |
| `src/pages/Store.tsx` | Buy inserts into user_cosmetics, equip updates profile equipped columns |
| `src/pages/Groups.tsx` | Create/join groups via Supabase; leaderboard reads real member profiles |
| `src/components/BottomNav.tsx` | Add logout option or move to profile |

### Auth Flow
```text
App loads
  -> AuthContext checks session via onAuthStateChange
  -> If no session -> redirect to /auth
  -> If session but no animal -> redirect to / (onboarding)
  -> If session and animal -> redirect to /home
```

### Timer Persistence Logic
```text
Timer runs client-side (useState + setInterval, same as now)
On stopTimer():
  1. Calculate duration and paws earned
  2. Insert into study_sessions table
  3. Update profile: increment hours_studied, add paws
  4. Refetch profile data
```

## 4. Migration SQL Summary

The migration will:
1. Drop `buildathon26` table
2. Create `profiles`, `user_cosmetics`, `study_groups`, `group_members`, `study_sessions`
3. Enable RLS on all tables with appropriate policies
4. Create `handle_new_user` trigger function + trigger
5. Create `generate_invite_code` and `join_group_by_code` functions

