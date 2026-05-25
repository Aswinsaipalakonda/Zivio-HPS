---
name: Modern Flat Card Design
colors:
  primary: "#3A9DE9"
  secondary: "#F8FAFC"
  success: "#10B981"
  warning: "#F59E0B"
  danger: "#EF4444"
  surface: "#FFFFFF"
  text: "#0F172A"
  neutral: "#64748B"
  border: "#F1F5F9"
typography:
  h1:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 3rem
  body-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 1rem
  label-caps:
    fontFamily: "JetBrains Mono"
    fontSize: 0.75rem
  sourceScale: "desktop-first clean scale"
  weights: "200, 300, 400, 500, 600, 700, 800"
rounded:
  sm: 6px
  md: 12px
  lg: 16px
spacing:
  sm: 6px
  md: 12px
  lg: 24px
  sourceScale: "modern balanced layout"
layout:
  sidebarWidth: 260px
  headerHeight: 64px
  mobileBottomNavHeight: 56px
---

## Overview

High-fidelity, clean flat-card interfaces utilizing pure white surfaces over soft Slate-50 backdrops, highlighted by HPS Brand Blue (#3A9DE9), geometric sans-serif typography (Plus Jakarta Sans), and thin clean borders. The design follows a ProDeel-style admin dashboard pattern with a full-height sidebar, offset header, and clean table-based data views.

## Style Foundations

- **Visual style:** minimal, clean, high-contrast, professional, premium flat design
- **Typography scale:** desktop-first expressive scale
- **Typography fonts:** primary=Plus Jakarta Sans, display=Plus Jakarta Sans, mono=JetBrains Mono
- **Typography weights:** 200, 300, 400, 500, 600, 700, 800
- **Color palette:** primary, secondary, success, warning, danger, neutral
- **Spacing scale:** modern balanced layout
- **NO neumorphism:** All components use flat surfaces with subtle borders and minimal shadow-sm elevation

## Colors

- **Primary (#3A9DE9):** Core HPS logo blue color, used for primary actions, branding, highlights, and active sidebar item frames.
- **Secondary (#F8FAFC):** Main background color (Slate-50) for a soft, low-fatigue dashboard workspace.
- **Success (#10B981):** Emerald green, representing completed tasks and check-in statuses.
- **Warning (#F59E0B):** Amber yellow, representing pending and ongoing task items.
- **Danger (#EF4444):** Red, representing late/absent statuses and actions.
- **Surface (#FFFFFF):** Pure white container cards, sidebars, and dialogue components.
- **Text (#0F172A):** Slate-900 typography color for high contrast and beautiful reading.
- **Border (#F1F5F9):** Slate-100 borders that act as clean separators instead of shadows.

## Layout Architecture

### Desktop (lg: breakpoint)
- **Sidebar:** Fixed full-height (top-0 to bottom), 260px wide, white background, right border
  - Logo + brand name at top
  - User profile card below logo
  - Navigation items with "MENU" and "ORGANISATION" section labels
  - Active item: bg-blue-50/70, text-primary, 3px left border indicator
  - Role switcher pills at bottom for development preview
  - CTA action button and sign-out at bottom
- **Header:** Sticky top-0, 64px height, offset by sidebar width (lg:pl-[260px])
  - Search bar centered, notification bell, theme toggle, user profile on right
- **Main Content:** Offset by sidebar (lg:pl-[260px]), clean padding, max-width containers

### Mobile (< lg: breakpoint)
- **Sidebar:** Hidden
- **Header:** Full width with hamburger menu and logo
- **Bottom Navigation:** Fixed bottom, 56px height, icon-based tabs
- **Content:** Full width with responsive card layouts

## Component Patterns

### Cards
- `bg-white border border-slate-100 shadow-sm rounded-2xl`
- Hover: `hover:shadow-md transition-shadow`
- No neumorphic shadows

### Buttons
- Primary: `bg-primary text-white rounded-xl hover:bg-[#2480CC]`
- Outline: `bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50`
- Pill filters: `rounded-full border border-slate-200`

### Tables (ProDeel style)
- Contained in white card with rounded-2xl overflow-hidden
- Header row: bg-slate-50/50, text-xs font-bold text-slate-400 uppercase
- Body rows: hover:bg-slate-50/30, divide-y divide-slate-50
- Clean data presentation with avatars and status badges

### Status Badges
- Soft colored pills: light background + dark text
- Present: bg-emerald-50 text-emerald-700
- Pending: bg-amber-50 text-amber-700
- Absent: bg-red-50 text-red-700