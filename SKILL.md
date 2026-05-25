---
name: modern-flat-card
description: High-fidelity, clean flat-card interfaces utilizing pure white surfaces over soft Slate-50 backdrops, highlighted by HPS Brand Blue (#3A9DE9). ProDeel-style admin dashboard pattern.
license: MIT
metadata:
  author: typeui.sh
---

<!-- TYPEUI_SH_MANAGED_START -->
# Modern Flat Card Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for high-fidelity, clean flat-card systems.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand
Build responsive, gorgeous, and premium daily task tracking interfaces for Zivio using HPS brand assets.
Logo: `/favicon.png` (HPS circle logo in blue #3A9DE9). Brand name: "Zivio".

## Style Foundations
- Visual style: minimal, clean, high-contrast, professional, premium, ProDeel-inspired flat design
- Typography scale: desktop-first clean scale | Fonts: primary=Plus Jakarta Sans, display=Plus Jakarta Sans, mono=JetBrains Mono | weights=200, 300, 400, 500, 600, 700, 800
- Color palette: primary, secondary, success, warning, danger, surface, border, text | Tokens: primary=#3A9DE9, secondary=#F8FAFC, success=#10B981, warning=#F59E0B, danger=#EF4444, surface=#FFFFFF, text=#0F172A, border=#F1F5F9
- Spacing scale: modern balanced layout

## Layout System
- Sidebar: 260px fixed full-height, white, logo at top, user profile, nav items, role switcher, CTA button
- Header: 64px sticky, offset by sidebar on desktop, search + actions + profile
- Mobile: bottom nav (56px), hamburger menu, card-based layouts
- Content: max-width containers with responsive padding

## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus states, semantic HTML before ARIA, screen-reader tested labels

## Writing Tone
concise, confident, helpful, clear, friendly

## Rules: Do
- prefer semantic tokens and variables over raw hardcoded inline colors
- preserve distinct visual hierarchy using font weights (e.g. semibold, extrabold) and sizes
- keep active navigation frames distinct using HPS blue background tints and solid left borders
- design status badges as soft-colored pills (light background + dark text) for excellent readability
- ensure responsive layouts that match clean mobile views nicely
- use ProDeel-style table layouts for data-heavy pages (search, filters, clean tables)
- use Plus Jakarta Sans with text-[13px] font-semibold for nav labels (sentence case, not uppercase)
- use rounded-2xl for cards, rounded-xl for buttons, rounded-full for pills and filters

## Rules: Don't
- avoid neumorphism entirely - no inner/outer shadow gradients, no `neu-` classes
- avoid low contrast text (avoid light gray text on white cards)
- avoid inconsistent grid layouts (ensure consistent gap spacings and paddings)
- avoid mixing design aesthetics (do not blend flat borders with neon glows)
- avoid uppercase tracking-wider on nav item labels (use sentence case instead)
- avoid animate-pulse on active nav icons

## Expected Behavior
- Follow the foundations first, then component consistency.
- When uncertain, prioritize accessibility and clarity over novelty.
- Keep guidance opinionated, concise, and implementation-focused.

<!-- TYPEUI_SH_MANAGED_END -->