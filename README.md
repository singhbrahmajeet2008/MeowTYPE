# ⚡ meow-typing • Cyber Gaming Typing Speed Arena 🐾

A sleek dark gaming touch-typing platform featuring a **1/3 Judge Terminal** and **2/3 Simple Typing Arena** split-screen workspace, cumulative practice time tracking, live telemetry, and a dedicated meme chamber ready for your custom memes!

---

## 🎮 Design & Layout Overview

### 1. Split-Screen Layout (1/3 Left & 2/3 Right)
- **Left 1/3 // Judge Terminal**:
  - `Judge Terminal`: Clean dark card with window chrome dots and a live evaluation verdict.
  - **Meme Chamber**: A clean, dedicated display chamber specially reserved for you to display your memes! Paste any image/GIF URL into the input dock to load it instantly.
  - Telemetry log stream tracking speed bursts and cadence in real time.
- **Right 2/3 // Simple Typing Arena**:
  - **Simple & Distraction-Free During Typing**: Clean, high-legibility text display with glowing cyan caret cursor.
  - Standardized practice modes: **Quotes**, **Words**, **Code**, **Numbers**, and **Custom**.
  - Standardized durations: **15s**, **30s**, **60s**, and **120s**.
  - Standardized difficulty: **Easy**, **Normal**, and **Expert**.
  - Clean HUD: Time Left, WPM, Accuracy, and Streak.

### 2. Player Stats (Top Header Bar)
Replaces previous bulky dropdown options with clean, persistent player telemetry saved in `localStorage`:
- **TESTS**: Total completed test sessions.
- **RECORD**: Your all-time peak WPM score.
- **PRACTICE TIME**: Cumulative time actively spent typing (tracked second-by-second).
- **ACCURACY**: Overall all-time touch-typing precision rating.
- **📊 Analytics Button**: Opens a detailed history log modal of all your past test sessions.

---

## ☁️ Supabase Backend & Google OAuth Integration

`meow-typing` includes full cloud synchronization powered by **Supabase** and **Google OAuth**:

- **Google Sign-In / Sign-Up**: One-click Google login to sync your typing profile, avatar, and personal best across all devices.
- **Persistent Cloud Telemetry**: Every completed typing test automatically saves to your Supabase `typing_records` table (WPM, Raw WPM, Accuracy, Duration, Mode, Difficulty, Errors, Keystrokes, and Timestamp).
- **Profile Aggregates**: Automatically maintains user statistics (`highest_wpm`, `total_tests`, `total_practice_seconds`, `avg_accuracy`) in the `profiles` table.
- **Records History Modal**: Click "All Saved Records" or open your profile dropdown to view all past runs with date, telemetry breakdown, and deletion controls.
- **Offline & Guest Resilient**: Fully functional in guest/offline mode using `localStorage`, with instant cloud sync upon Google Sign-In.

### Quick 3-Step Setup:
1. **Apply Database Schema**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**.
   - Copy & paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) and click **Run** (▶).
2. **Enable Google Provider in Supabase**:
   - In Supabase, go to **Authentication** → **Providers** → **Google**.
   - Toggle **Enable Google provider**, paste your Google Client ID & Client Secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - In **Authentication** → **URL Configuration**, add `http://localhost:3000` to **Redirect URLs**.
3. **Connect Your App**:
   - Click the **Google Login** or **Supabase Settings** button in the top right header.
   - Enter your `Supabase Project URL` and `Public Anon Key` (from Project Settings → API) and click **Save & Connect**. (Or paste them directly into [`supabase-config.js`](./supabase-config.js)).

---

## 🚀 How to Run

Open **http://localhost:3000** in your browser, or:
```bash
npm start
# or
node server.js
```
*(Or simply double click [`index.html`](./index.html) to run standalone!)*

### ⌨️ Hotkeys & Shortcuts
- <kbd>Tab</kbd>: Instantly restart the current test session.
- <kbd>Enter</kbd>: Play again from the session results screen.
