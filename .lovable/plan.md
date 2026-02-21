

# 🐾 Study Buddy — Character-Driven Study App

## Phase 1: Foundation & Onboarding
- **Animal Selection Screen**: Full-screen onboarding where users pick their study buddy (Dog, Cat, Bear, Chicken). Each selection applies a global color theme across the entire app.
  - Dog → Red, Yellow, White
  - Cat → Black, Light Gray, Purple
  - Bear → White, Light Blue (Iceberg)
  - Chicken → Light Yellow, Light Green, Light Pink
- Theme is persisted and applied app-wide via CSS variables
- All four animal PNGs (dog.png, cat.png, bear.png, duck.png) embedded as assets, plus the "active" bear and icon variants

## Phase 2: Home Screen & Timer Core
- **Home Screen Layout** (mobile-first, matching the Dashboard mockup):
  - Paws currency display (top-right with + button)
  - Digital timer (00:00) in a rounded card above the animal
  - Group icon (top-left of animal) and Profile icon (top-right of animal) with **floating idle animation** (looping sine-wave on y-axis)
  - Animal character centered, holding a circular **Play button**
- **Mitosis Timer Animation** (Framer Motion):
  - Clicking Play triggers a "cell division" split — the Play button smoothly divides into **Pause** and **Stop** buttons that slide to the animal's left and right paws
  - Group and Profile icons float inward and slide behind the animal sprite (z-index layering)
  - Digital timer "flies out" from behind the animal's head and settles above
  - Timer counts up, earning 10 Paws per minute of study
- **Stop/Pause behavior**: Pause freezes timer; Stop resets and reverses the mitosis animation back to the single Play button

## Phase 3: Arc-Path Navigation & Page Routing
- **Arc-Path Transitions**: Clicking Group or Profile icons triggers a smooth arc-path animation (Framer Motion `layoutId`) where the icon visually travels in a curve to the bottom of the screen
- Icons settle into a **Bottom Navigation Bar** (Home | Groups | Profile) that appears on Group and Profile pages
- Navigating back to Home reverses the animation — icons travel back up to their floating positions

## Phase 4: Groups Page
- **Groups List** (matching Group.png mockup):
  - List of joined study groups with group icon and name
  - "Create/Join group" button
- **Group Detail / Leaderboard** (matching GroupStatus.png):
  - Group name with invite button
  - Ranked leaderboard: Rank | Animal PFP (with purchasable border) | Name | Total hours | Status indicator
  - Active members show their "studying" animal variant (e.g., bear at desk)
  - **Manual status toggle**: Users can set status to Studying, In Event, Away, etc.

## Phase 5: Profile Page
- **Profile Screen** (matching Profile.png):
  - Large circular avatar with animal icon and purchasable border frame
  - Username display
  - Stats card: Hours Studied, Current Streak
  - Paws balance with + button to buy more

## Phase 6: Cosmetic Store
- **Shop accessible from the + button** next to Paws balance
- **Categories**:
  - 🎩 Hats — absolute-positioned on the animal's head in all views
  - 🖼️ Borders — decorative frames around profile pictures in leaderboard
  - 🌄 Backgrounds — changes the Home screen environment/color
- Items purchased with Paws currency
- Equipped cosmetics persist and display across all screens

## Phase 7: Stripe Integration for Paws Packs
- Stripe checkout for purchasing Paws currency packs (e.g., 100 Paws, 500 Paws, 1000 Paws)
- Accessible via the "+" button next to the Paws display

## Phase 8: Break Reminder with ElevenLabs
- After 45 minutes of continuous study, trigger a "Take a Break!" popup overlay
- ElevenLabs TTS voice notification plays a friendly reminder message
- User can dismiss or snooze the reminder

## Phase 9: Backend Wiring (Supabase — future step)
- User authentication (sign up, log in)
- Database tables: users, groups, group_members, study_sessions, paws_transactions, cosmetic_items, user_cosmetics
- Real-time subscriptions for group leaderboard updates and status changes
- Edge functions for Stripe webhooks and ElevenLabs TTS

---

**Tech Stack**: React + Vite, Tailwind CSS, Framer Motion (animations), Supabase (backend), Stripe (payments), ElevenLabs (voice), TypeScript

**Design**: Mobile-first (390px), character-centered UI matching provided Figma mockups exactly

