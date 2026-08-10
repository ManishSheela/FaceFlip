# FaceFliip — Frontend

The UI for the FaceFliip stranger video-calling platform, built to the
**Industrial / Blueprint** design handoff (`../design_handoff_facefliip`).

This is a **UI-only** implementation: all 10 screens, theming, dialogs, and
component interactions (dropdowns, toggles, segmented controls, radios, tabs of
state) are wired up. There is **no backend / WebRTC integration** — video panels
are animated gradient placeholders and data is mock/in-memory, exactly as the
handoff prototype intends.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** — layout utilities; design tokens live as CSS variables
- **shadcn/ui** primitives (Radix-based): Button, Input, Dialog, Select,
  RadioGroup, Switch, Label — restyled to the square, hairline blueprint look
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5174
```

> The dev server is pinned to port 5174. If it is already in use, Next exits
> with an error — free the port or pass `-p` to override.

## Design system

The Industry tokens (from `ds-styles.css`) are ported into
[`src/app/globals.css`](src/app/globals.css) as CSS custom properties. They flip
for dark mode via `[data-theme="dark"]` on `<html>`; Tailwind colours
(`bg`, `surface`, `accent`, …) reference those variables so both systems stay in
sync. The signature blueprint frame (square corners + `+` registration marks) is
the `.blueprint` / `.corner` classes, wrapped by `<BlueprintFrame>`.

## Folder structure

```
src/
├── app/                      # Routes (one folder per screen) — thin pages
│   ├── layout.tsx            # Root layout: fonts, theme script, providers, shell
│   ├── globals.css           # Design tokens (light/dark) + blueprint styles
│   ├── page.tsx              # Landing
│   ├── auth/ gender/ matching/ call/ postcall/ friends/ chat/ settings/
│
├── components/
│   ├── ui/                   # shadcn/ui primitives (blueprint-restyled)
│   ├── blueprint/            # Design-system building blocks
│   │                         #   frame, tag, avatar, section-card, radar-rings,
│   │                         #   segmented-control, toggle-row, stat-item, feature-card
│   ├── layout/               # navbar, app-shell, centered-screen
│   ├── screens/              # One component (+ sub-components) per screen
│   │   ├── call/  friends/  chat/  settings/
│   │   └── landing-screen.tsx, auth-screen.tsx, …
│   ├── dialogs/              # end-call-dialog, report-dialog
│   └── icons/                # google-icon
│
├── context/                  # app-provider (global UI state)
├── hooks/                    # use-app-state, use-elapsed-timer, use-timeout, use-chat-thread
├── constants/                # routes, mock data, labels
├── types/                    # shared TypeScript types
└── lib/                      # utils (cn, formatDuration, getInitials)
```

### Conventions

- **Pages are thin.** Each `app/*/page.tsx` just renders a screen component from
  `components/screens/`, keeping routing separate from UI.
- **Global UI state** (theme, auth flag, match preference, friends, the active
  call/chat target) lives in [`AppProvider`](src/context/app-provider.tsx) and is
  read via the [`useAppState`](src/hooks/use-app-state.ts) hook. Navigation is
  handled by components via `next/navigation` — the provider stays router-agnostic.
- **Screen-local state** (mic/cam toggles, dialog visibility, chat draft) stays
  inside the relevant screen component.

## Screen flow

```
Landing → Auth ─┬─ Google → Gender → Matching → Call ─┬─ End → Post-call → Matching / Home
                └─ Guest ───────────→ Matching → Call  ├─ Report (dialog)
                                                       └─ Settings (?from=call → back to call)
Navbar → Friends → Video / Voice (→ Call)  •  Chat (→ Chat)
```

Matching auto-advances to the call after ~3s (`MATCHING_DURATION_SEC`); the call
flips from "Connecting…" to "Connected" after ~1s. Both are cosmetic timers.
