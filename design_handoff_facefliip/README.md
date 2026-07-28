# Handoff: FaceFliip — Stranger Video Calling Platform

## Overview
FaceFliip is a peer-to-peer video calling web app that randomly connects users with strangers. It supports both signed-in (Google) and guest flows, gender-based match preferences, a Friends system with video/voice/chat, and a full settings panel. The design follows an **Industrial / Blueprint** aesthetic using the Industry design system.

## About the Design Files
The files in this bundle are **HTML design prototypes** — high-fidelity interactive references showing intended look, layout, and behavior. They are **not** production code to copy directly. Your task is to **recreate these designs in your target codebase** (React, Next.js, Vue, etc.) using its established patterns, component libraries, and routing conventions. Use the HTML files as a visual and behavioral reference only.

The prototype is a single-file Design Component (`Stranger Video Call.dc.html`) that uses a custom DC runtime. All screens are managed via a state machine — in production you'd replace this with your router (e.g. Next.js pages, React Router routes).

## Fidelity
**High-fidelity.** Colors, typography, spacing, icons, interactions, and copy are all final. Recreate pixel-closely using your codebase's component library — or the values documented below if building from scratch.

---

## Design System
Built on the **Industry design system** (steel-blue wireframe aesthetic):
- Fonts: **Barlow Condensed** (headings, weight 600) + **Barlow** (body, weight 400/500) — load from Google Fonts
- Accent: `#5980a6` (steel blue)
- Background: `#f2f2f3` (light) / `#17191b` (dark)
- Surface: `#e9e9ea` (light) / `#232527` (dark)
- Text: `#1d1f20` (light) / `#f1f0ee` (dark)
- Divider: `rgba(29,31,32,0.16)` (light) / `rgba(241,240,238,0.18)` (dark)
- Radius: `0px` everywhere (square corners, intentional)
- Cards: transparent background + `1px solid divider` border + `+` corner registration marks (4 `<i>` elements at corners)
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg` — see `ds-styles.css`

### Dark Mode
Toggle via `data-theme="dark"` on root element. All color tokens flip — see `ds-styles.css` for the full token set and the DC file's `[data-theme="dark"]` override block.

---

## Screens / Views

### 1. Landing Page (`screen = 'landing'`)
**Purpose:** Hero introduction + CTA to start chatting.

**Layout:** Full-width centered column, `max-width: 960px`, `padding: 64px 24px 96px`. Text-align center.

**Elements:**
- H1: `"Every flip, a new face."` — Barlow Condensed 700, `clamp(36px, 6vw, 60px)`, `line-height: 1.06`
- Tagline p: `"Spontaneous video calls with real people…"` — 17px, muted color
- CTA button: `"Start Chatting"` — Primary blueprint button (accent fill, square corners, corner marks), `padding: 14px 40px`, `font-size: 16px` → navigates to Auth screen
- Feature cards row: 3 blueprint cards (`width: 220px`) with kicker + title + body:
  - Safe / Moderated / "Report tools keep every session respectful."
  - Fast / Instant match / "Skip the queue and connect right away."
  - Open / No signup / "Jump in as a guest, no account needed."

---

### 2. Sign-In / Auth Screen (`screen = 'auth'`)
**Purpose:** User chooses Google sign-in or guest mode.

**Layout:** Centered card, `max-width: 440px`.

**Card sections (separated by hairline dividers):**
1. Header area: H2 `"Join the conversation"`, tagline about benefits (14px muted)
2. Buttons area:
   - **Primary** (blueprint + accent fill): `"Continue with Google"` — Google G icon + text, left-aligned, `height: 52px`
   - `"or"` divider (hairline lines + uppercase label)
   - **Secondary**: `"Continue as Guest"` — user icon + text, `height: 52px`
3. Footer row: `"← Back"` ghost button + `"No credit card required"` muted note

**Behavior:**
- Google → sets `loggedIn = true` → navigates to Gender Preference screen
- Guest → sets `loggedIn = false`, `genderPref = 'random'` → navigates directly to Matching screen

---

### 3. Gender Preference Screen (`screen = 'gender'`, logged-in only)
**Purpose:** User picks who they want to meet.

**Layout:** Centered card, `max-width: 420px`.

**Elements:**
- H2: `"Who do you want to meet?"`, muted subtext
- 3 radio rows (full-width, `border: 1px solid divider`, `padding: 12px 16px`):
  - Male / Female / Random — each with a `.radio` + `.dot` component
- Continue button (primary blueprint) → starts matching flow
- State persists to Settings screen

---

### 4. Matching Screen (`screen = 'matching'`)
**Purpose:** Animated search state while finding a stranger.

**Layout:** Full-height centered column, grid-dot background overlay.

**Elements:**
- `"SCANNING GLOBAL NETWORK"` tag (outline variant, uppercase, letter-spacing)
- Radar animation: 3 concentric circles (`border-radius: 50%`) pulsing outward via `radarPulse` keyframe (`0%: scale(0.55) opacity(0.8)` → `100%: scale(2.3) opacity(0)`), staggered by 0.75s each
- Center target: `72×72px` square with blueprint corner marks + search icon in accent color
- 4 crosshair tick marks (top/bottom/left/right of the 200px circle)
- Timer: `"00:00"` in Barlow Condensed 26px accent color, `"Elapsed"` label 10px uppercase muted
- Stats bar (blueprint bordered): Online `12,847` · Preference `{{genderPrefLabel}}` · Region `Global` — each column with value + uppercase label
- `"Cancel search"` ghost button

**Animation:**
```css
@keyframes radarPulse {
  0%   { transform: scale(0.55); opacity: 0.8; }
  100% { transform: scale(2.3);  opacity: 0; }
}
```
- Duration: `2.2s ease-out infinite`; delays: `0s`, `0.75s`, `1.5s`

**Auto-advance:** After `matchingDurationSec` (default 3s), transitions to Video Call screen.

---

### 5. Video Call Screen (`screen = 'call'`, `callType = 'video'`)
**Purpose:** Active video call interface.

**Layout:** Full-height, `display: flex`, side-by-side 50/50 split:
- **Left panel** (remote): `flex: 1`, animated gradient background (`linear-gradient(135deg, accent-900, accent-700, accent-800)`, `background-size: 220% 220%`, `animation: gradientShift 9s ease-in-out infinite`)
  - Top-left: `"{{stranger name}}"` tag + `"Connected"` / `"Connecting…"` status tag
  - Top-right: call timer tag
- **Divider**: `width: 2px`, `background: rgba(255,255,255,0.12)`
- **Right panel** (local): `flex: 1`, different gradient angle/timing (11s), with `"You"` tag top-left; camera-off overlay when cam disabled

```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

**Control bar** (absolute bottom, `z-index: 10`, gradient overlay `rgba(0,0,0,0.65) → transparent`):
| Button | Style | Action |
|--------|-------|--------|
| Mic toggle | Icon btn, glass when on / accent fill when muted | Toggle mic |
| Camera toggle | Icon btn, glass when on / accent fill when off | Toggle cam (video only) |
| Add Friend | Icon btn, glass, person+ icon | Add stranger as friend |
| Next | Primary blueprint btn + skip icon | Go back to matching |
| End Call | `background: #c0392b` (red) | Opens end-call dialog |
| Report | Icon btn, glass, flag icon | Opens report dialog |
| Settings | Icon btn, glass, gear icon | Goes to Settings screen |

> Camera toggle and Next button hidden during voice calls. Add Friend and Next hidden during friend-initiated calls.

---

### 6. Voice Call Screen (`screen = 'call'`, `callType = 'voice'`)
**Purpose:** Audio-only friend call.

**Layout:** Same section as video call, but an `position: absolute; inset: 0; z-index: 5` overlay renders instead of the split panels.

**Overlay content:**
- Background: `linear-gradient(160deg, accent-900, accent-700)`
- Pulsing radar rings (same keyframe as matching screen) around friend's avatar
- Avatar: `100×100px` square, `background: accent-100`, `color: accent-800`, friend's initials in 30px Barlow Condensed
- Friend's name (22px heading, accent-900 color) + elapsed time (14px, accent-700)
- Control bar: same as video but without cam buttons

---

### 7. Post-Call Screen (`screen = 'postcall'`)
**Purpose:** Summary after a call ends.

**Layout:** Centered card, `max-width: 420px`, text-align center.

**Elements:**
- Green check circle icon (stroke: `var(--color-accent)`)
- H2: `"Call ended"`, muted p: `"Lasted {{duration}}"`
- `"Next stranger"` — primary blueprint button (full-width)
- `"Add as Friend"` — secondary button with person+ icon (full-width), adds stranger to friends list
- `"Back to home"` — ghost button

---

### 8. Friends Screen (`screen = 'friends'`)
**Purpose:** View friends list and manage incoming requests.

**Layout:** `max-width: 680px`, two blueprint cards.

**Requests card** (shown only when `pendingRequests.length > 0`):
- Kicker: `"REQUESTS"`
- Per request row: `40×40px` accent-tinted avatar + name + `"Wants to connect"` muted + Accept (primary) + Decline (secondary) buttons

**Friends card:**
- Kicker: `"YOUR FRIENDS"`
- Per friend row: `42×42px` avatar with green online dot (`#22c55e`) + name + `Online/Offline` label + 3 icon buttons:
  - Video camera → starts video call with friend
  - Phone → starts voice call with friend
  - Chat bubble → opens chat screen with friend

---

### 9. Chat Screen (`screen = 'chat'`)
**Purpose:** Private text chat with a friend.

**Layout:** Full-height flex column.

**Header bar** (`border-bottom: 1px solid divider`):
- `"← Friends"` ghost button → back to Friends screen
- Hairline divider
- Friend avatar + name + `"Online"` status
- Video call + voice call icon buttons (top-right)

**Messages area** (flex: 1, overflow-y: auto):
- **Sent messages**: right-aligned, `background: var(--color-accent)`, `color: var(--color-bg)`, `border-radius: 18px 18px 4px 18px`
- **Received messages**: left-aligned with small avatar, `background: var(--color-surface)`, `border: 1px solid divider`, `border-radius: 18px 18px 18px 4px`
- Font-size: 14px, line-height: 1.45

**Input bar** (`border-top: 1px solid divider`):
- `.input` text field (flex: 1) — sends on Enter key
- Send button (primary, `height: 36px`, send icon)

---

### 10. Settings Screen (`screen = 'settings'`)
**Purpose:** Account, preferences, devices, notifications.

**Layout:** `max-width: 720px`, stacked blueprint cards with icon + kicker in each section header.

**Sections:**
1. **Profile** (logged-in only): `72×72px` avatar with blueprint corner marks + "Verified" accent tag; Display name (editable input) + Email (read-only)
2. **Guest banner** (guest only): Upgrade CTA with Google sign-in button
3. **Two-column grid** (auto-fit, min 280px):
   - Match Preference: segmented control Male / Female / Anyone
   - Appearance: segmented control Light / Dark
4. **Camera & Microphone**: two `<select>` dropdowns in a grid
5. **Notifications**: two toggle rows (New match found, Product updates) with description sub-labels

**Toggle switch** (custom, no library):
- Container: `40×22px`, `border: 1px solid divider`, accent fill when ON
- Thumb: `18×18px` square, `background: var(--color-bg)`, `left` transitions between `1px` (off) and `19px` (on)

---

## Dialogs

### End Call Dialog
- Backdrop: `rgba(0,0,0,0.6)`
- Dialog: `background: var(--color-bg)`, `box-shadow: --shadow-lg`, `border: 1px solid divider`
- Title: `"End the call?"`, body copy, Cancel (secondary) + End call (primary) buttons

### Report Dialog
- Reason picker: 4 `.radio` options (Spam, Inappropriate, Underage, Other)
- Submit disabled until a reason is selected
- On submit: shows `"Report sent"` confirmation, auto-closes after 1.6s

---

## State Management

| Variable | Type | Purpose |
|----------|------|---------|
| `screen` | string | Active screen/route |
| `loggedIn` | boolean | Auth state |
| `genderPref` | `'male'|'female'|'random'` | Match preference |
| `callType` | `'video'|'voice'` | Current call mode |
| `activeFriend` | object\|null | Friend being called/chatted |
| `connectionStatus` | `'connecting'|'connected'` | Simulated connection state |
| `micOn`, `camOn` | boolean | Media toggles |
| `matchElapsed`, `callElapsed` | number (seconds) | Timers |
| `friendsList` | Friend[] | All friends |
| `pendingRequests` | Request[] | Incoming friend requests |
| `chatMessages` | Message[] | Current chat thread |
| `showEndDialog`, `showReportDialog` | boolean | Dialog visibility |

---

## Navigation Flow

```
Landing → Auth → [Google] → Gender Preference → Matching → Video Call
                           ↓
                        [Guest] → Matching → Video Call
                                                  ↓
                                             End Dialog → Post-Call → Matching / Landing
                                             Report Dialog (overlay)
                                             Settings (overlay)

Nav bar → Friends → Friends List → Video/Voice/Chat per friend
```

---

## Icons
All icons are **Lucide** (`https://lucide.dev`), `stroke-width: 1.5`, inline SVG on `currentColor`. Key icons used:
- Mic / Mic-off, Video / Video-off, Phone-off (end call), SkipForward (next), Flag (report), Settings (gear), Search, Check, ChevronLeft, UserPlus, MessageSquare, Phone, Send, Bell

---

## Assets
- No external images used — all video placeholders are CSS gradient animations
- Google Fonts: `Barlow+Condensed:wght@400;600` + `Barlow:wght@400;500;700`
- Design system CSS: `ds-styles.css` (Industry DS, included in this package)

---

## Files in This Package

| File | Description |
|------|-------------|
| `Stranger Video Call.dc.html` | Full interactive prototype (all screens) |
| `ds-styles.css` | Industry design system tokens + component classes |
| `README.md` | This document |
