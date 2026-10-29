---
name: SkillBridge
description: Bilingual career bridge from university to a first job, in navy and teal.
colors:
  bridge-teal: "#0a8079"
  bridge-teal-deep: "#0d6662"
  bridge-teal-bright: "#0fa094"
  bridge-teal-mist: "#effcfa"
  midnight-navy: "#0d1733"
  harbor-navy: "#15234a"
  steel-navy: "#273f78"
  slate-ink: "#536faf"
  fog-line: "#d5def0"
  frost-wash: "#eef2f9"
  paper-slate: "#f8fafc"
  white: "#ffffff"
  alert-red: "#dc2626"
  star-amber: "#fbbf24"
typography:
  display:
    fontFamily: "Inter, Cairo, system-ui, sans-serif"
    fontSize: "3.4rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, Cairo, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, Cairo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.375
  body:
    fontFamily: "Inter, Cairo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, Cairo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
  body-arabic:
    fontFamily: "Cairo, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  card-padding: "20px"
  section-gap: "40px"
components:
  button-primary:
    backgroundColor: "{colors.bridge-teal}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.bridge-teal-deep}"
  button-navy:
    backgroundColor: "{colors.harbor-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.harbor-navy}"
    rounded: "{rounded.xl}"
    height: "44px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight-navy}"
    rounded: "{rounded.xl}"
    padding: "10px 14px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card-padding}"
  chip-on:
    backgroundColor: "{colors.harbor-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    height: "40px"
  chip-off:
    backgroundColor: "{colors.white}"
    textColor: "{colors.steel-navy}"
    rounded: "{rounded.full}"
    height: "40px"
  nav-link-active:
    backgroundColor: "{colors.bridge-teal-mist}"
    textColor: "{colors.bridge-teal-deep}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  page-header:
    backgroundColor: "{colors.midnight-navy}"
    textColor: "{colors.white}"
---

# Design System: SkillBridge

## Overview

**Creative North Star: "The Bridge"**

SkillBridge carries a student from the university side to the job side, and every screen should feel like part of that crossing. Navy is the solid ground: the night sky of the inner page headers, the weight of headings, the steady text. Teal is the way forward: the action buttons, the active nav link, the progress bars and match rings that show how far across the student has come. The two colours meet in the hero, where the highlighted words fade from teal into navy.

The feel is young and lively without being loud. Cards lift a little when you point at them, sections fade up as they arrive, soft teal and navy glows sit blurred behind headers, and rounded corners keep everything friendly. The energy comes from motion and from teal moments, never from new colours. Density stays comfortable: one clear action per card, generous padding, short labels.

Arabic is a first-class citizen. Arabic pages switch to Cairo, the whole layout mirrors right-to-left through logical properties (`start`/`end`), and letter-spacing is switched off for Arabic text because Arabic letters join.

**Key Characteristics:**
- Navy and teal only for brand colour; red and amber appear only for meaning (errors, ratings).
- Soft, lifted white cards on a pale slate page.
- Rounded, friendly geometry: 12px buttons and inputs, 16px cards, full pills for chips and badges.
- Motion that rewards: hover lifts, fade-up entrances, progress that fills smoothly, all switched off under reduced motion.
- Bilingual by construction: Inter for English, Cairo for Arabic, mirrored layout.

## Colors

A two-colour brand, deep navy for ground and teal for movement, on a cool near-white page.

### Primary
- **Bridge Teal** (`bridge-teal`): The colour of action and progress. Primary buttons, apply buttons, focus rings, saved/applied states, the eyebrow above section headings.
- **Bridge Teal Deep** (`bridge-teal-deep`): Hover state of teal buttons and the text colour of teal badges and the active nav link.
- **Bridge Teal Bright** (`bridge-teal-bright`): Progress fills and the match ring stroke, where teal is a graphic, not text.
- **Teal Mist** (`bridge-teal-mist`): Background of the active nav link, job-type badges, saved and applied pills.

### Secondary
- **Midnight Navy** (`midnight-navy`): Body text, headings, the inner page header band, the skip link.
- **Harbor Navy** (`harbor-navy`): The "navy" button, selected chips, the avatar circle, a high job match (60% and above).
- **Steel Navy** (`steel-navy`): Secondary text on chips and filters; the end of the hero gradient.

### Neutral
- **Slate Ink** (`slate-ink`): Placeholder and muted text tier.
- **Fog Line** (`fog-line`): Borders on inputs-in-waiting, dividers, progress track.
- **Frost Wash** (`frost-wash`): Card borders, hover backgrounds for ghost and outline buttons, low-match badges.
- **Paper Slate** (`paper-slate`): The page background behind every card.
- **White** (`white`): Cards, inputs, the sticky header (at 90% with blur).

### Status (functional only)
- **Alert Red** (`alert-red`): Errors, invalid fields, log out, danger buttons. Its pale tint marks error banners.
- **Star Amber** (`star-amber`): Course rating stars and the "demo data" label only.

### Named Rules
**The Two-Colour Rule.** Brand colour is navy or teal, nothing else. No purple, orange, pink or new accents for decoration. Red and amber are allowed only when they carry meaning (an error, a rating, a demo warning).

**The Teal Means Forward Rule.** Teal marks the next step: the button to press, the progress made, the link you are on. If something teal is not an action or a sign of progress, it should be navy.

## Typography

**Display Font:** Inter (with Cairo, system-ui)
**Body Font:** Inter for English, Cairo for Arabic (`html[lang='ar']` switches the whole body)

**Character:** One confident geometric sans in heavy weights for headlines, the same family light and easy for reading. Cairo matches Inter's openness so the two languages feel like one site.

### Hierarchy
- **Display** (800, 2.25rem on phones up to 3.4rem on desktop, tight leading): The home hero headline only, with the highlighted phrase in the teal-to-navy gradient.
- **Headline** (800, 1.5rem rising to 1.875rem): Section headings and page header titles.
- **Title** (700, 1rem, snug): Card titles (course names, job titles).
- **Body** (400, 0.875rem; 1.125rem for hero and header subtitles): Descriptions and form text, kept to about 42rem wide in headers.
- **Label** (600, 0.75rem): Badges, meta rows, hints, validation messages. Section eyebrows are 0.875rem, uppercase, wide tracking, in teal.

### Named Rules
**The No Tracking in Arabic Rule.** Any letter-spacing is removed under `dir="rtl"`. Arabic letters connect; spacing them breaks the words.

## Layout

Content lives in a centred page container capped at 80rem (1280px) with side gutters of 16px on phones, 24px from 640px and 32px from 1024px. Grids collapse to a single column on phones; the hero becomes two columns from 1024px. Inner pages open with a navy header band (48–64px vertical padding) before content. The sticky header is 64px tall, and anchored content scrolls with a 5rem offset so it never hides under it. The main navigation shows inline from 1024px and folds into a menu button below that. Section headings are centred with 40px below them.

Layout is mirrored for Arabic by using logical properties (`start`, `end`, `ps`, `pe`) everywhere, and directional icons such as arrows flip with `rtl:rotate-180`.

## Elevation & Depth

Lifted and soft. White cards float on the pale slate page with a faint navy-tinted shadow, and on hover they rise 2–4px and take a deeper shadow. Depth also comes from blurred teal and navy glows behind the hero and page headers. Shadows are always tinted navy, never pure black.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgba(13,23,51,0.06), 0 8px 24px -12px rgba(13,23,51,0.15)`): Every card at rest.
- **Soft** (`box-shadow: 0 10px 30px -12px rgba(13,23,51,0.18)`): Hovered cards, menus, dropdowns, the skip link.
- **Teal glow** (`box-shadow: 0 1px 2px rgba(10,128,121,0.2)`): Under primary buttons only.

### Named Rules
**The Lift on Intent Rule.** Things a student can open lift on hover (cards rise, course images zoom 5%); static containers stay still.

## Shapes

Friendly and rounded throughout, with corner size growing with the object: 6px for small inline tags, 8px for nav links and icon buttons, 12px for buttons, inputs, menus and company logos, 16px for cards, 24px for large feature panels, and full pills for chips, badges, avatars and progress bars. Borders are thin (1px) and very light navy; a heavier navy border appears only to mark a selected chip.

## Components

### Buttons
Rounded, solid and sure of themselves, with a small press-in on click.
- **Shape:** Gently rounded (12px). Heights 40, 44 and 48px for small, medium and large.
- **Primary:** Bridge Teal with white semibold text and a faint teal shadow; the default for the main action on a screen.
- **Hover / Focus:** Hover deepens to Teal Deep; focus shows a 2px teal ring with a 2px offset; active scales to 98%. Disabled drops to 60% opacity.
- **Navy:** Harbor Navy for strong secondary actions.
- **Outline:** White with a light navy border, for the second choice beside a primary (e.g. "Explore courses").
- **Ghost / White / Danger:** Ghost for quiet nav actions, White on dark bands, red Danger for destructive admin actions.

### Chips
- **Style:** Full pills, 40px tall, 14px medium text, used as filters.
- **State:** Selected is filled Harbor Navy with white text; unselected is white with a light navy border that darkens on hover.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** White on Paper Slate.
- **Shadow Strategy:** Card shadow at rest, Soft shadow plus a small lift on hover (see Elevation).
- **Border:** 1px Frost Wash.
- **Internal Padding:** 20px; card actions sit in a footer divided by a thin border.

### Inputs / Fields
- **Style:** White, 1px light navy border, 12px corners, 10×14px padding, label above in medium navy.
- **Focus:** Border turns teal with a soft teal ring.
- **Error:** Red border and ring, with a red message below announced to screen readers.

### Navigation
- **Style:** Sticky white bar at 90% opacity with blur; it gains a thin border and small shadow once the page scrolls. Links are 14px medium navy in 8px-rounded pills.
- **Active:** Teal Mist background with Teal Deep text. Hover is Frost Wash.
- **Language switch:** Outlined button with a languages icon, always visible.
- **Mobile:** Below 1024px a 44px menu button opens a full-width panel that slides in.

### Page Header (signature)
The inner-page band in Midnight Navy with two blurred glows (teal top-end, navy bottom-start), a white extra-bold title and a pale navy subtitle, fading up on arrival.

### Match and Progress (signature)
The visible proof of the bridge. Progress bars are 8px teal pills on a pale navy track that fill smoothly; the match ring is a round teal stroke. Job match badges switch from pale navy to solid Harbor Navy once the match reaches 60%.

## Do's and Don'ts

### Do:
- **Do** use Bridge Teal for the one main action on each card or screen, and navy or outline for the rest.
- **Do** give every interactive element the 2px teal focus ring with a 2px offset.
- **Do** use logical properties (`start`/`end`) and flip directional icons so Arabic mirrors correctly.
- **Do** let cards lift on hover and sections fade up; keep it lively but quick (0.2–0.6s).
- **Do** keep touch targets at least 40px tall.

### Don't:
- **Don't** introduce any brand colour outside navy and teal (the owner's explicit rule).
- **Don't** use red or amber for decoration; they mean error and rating only.
- **Don't** add letter-spacing to Arabic text.
- **Don't** use pure black text or black shadows; text is Midnight Navy and shadows are navy-tinted.
- **Don't** add motion that ignores `prefers-reduced-motion`; the global rule turns animation off and must stay.
