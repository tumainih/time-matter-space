# Time · Matter · Space

A single offline web app for planning, recording and evaluating life across
nested cycles of **time**, categorised **matter** (what you did), and
**space** (where you were). No backend, no build step, no account —
everything is stored on the device with `localStorage`, and the app is
installable as a PWA so it keeps working with no connection.

## Deploy to Netlify

**Fastest — drag and drop:**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. Done — you get a live URL immediately, and it works offline once loaded
   once (the service worker caches everything).

**Via Git:**
1. Push this folder to a GitHub/GitLab repo.
2. In Netlify: *Add new site → Import an existing project*.
3. Build command: leave blank. Publish directory: `.`
4. Deploy.

**Via Netlify CLI:**
```
npm i -g netlify-cli
cd tms-app
netlify deploy --prod
```

Open the deployed URL once on your phone, then "Add to Home Screen" — from
then on it launches like a native app, offline.

## Structure

```
index.html          shell: top bar, breadcrumb, tab bar, settings drawer
css/style.css        the whole design system (instrument-panel dark theme)
js/time-engine.js    pure date math for every cycle (ms → century)
js/storage.js        localStorage wrapper: notes, matter, vocab, places
js/verses.js         156 KJV verses (Love/Hope/Faith) + the Spirit verse banner
js/matter.js         the Matter tab (text/photo/video, Spirit/Soul/Body)
js/space.js          the Space tab (geolocation + named places)
js/views.js          one render function per cycle, shared note widget
js/app.js            tab router, shared "focus date", settings, export/import
manifest.json, sw.js PWA install + offline cache
netlify.toml         static-site + SPA-fallback config for Netlify
```

## Design

A light, paper-and-ink professional theme — soft off-white workspace,
charcoal text, warm amber/indigo/clay accents for the Spirit/Soul/Body
strip, and teal for the week/quarter "peak" markers. Nothing is dark
or high-contrast-inverted; every screen is designed to be read the way
a printed daily planner is read.

## The Spirit verse banner

An ornate, gold-leafed scripture plate sits fixed at the very top of the
app — above the tab bar, visible on Time, Matter, Space and Log alike,
since Spirit comes first. It rotates **Love → Hope → Faith**, one verse
every 10 seconds, drawing from 156 unique KJV verses (deduplicated from
your list — the "expanded pool" sections were exact repeats of the
"extended" sections, so each verse appears once). Each theme has its own
shuffled queue that loops back to the top once exhausted, so you'll see
every verse in a theme before any repeats. Tap the plate to jump to the
next verse immediately (and restart the 10-second timer); tap the ⌃ in
the corner to collapse it to a slim strip. The whole card — background
tint, border and text accent — recolours with the verse's theme: **Love
is violet/purple, Hope is gold/yellow, Faith is green**, each a soft
pastel tint rather than a solid block, plus a small dot tracker showing
where you are in the rotation.

## How the four tabs work together

- **Time** — a stack of cards, one per cycle, from the live millisecond
  clock down to Century. Every card shows where "now" (or your chosen
  focus date) sits inside that cycle, and every sibling in the cycle is
  tappable — tap a different week, month, quarter, year… and the whole
  stack re-focuses on it. Each card carries its own **Plan / Record /
  Evaluate** notebook, saved the moment you type. A "＋ Log matter for
  this unit" button jumps straight to the Matter tab pre-tagged for that
  exact unit.
- **Matter** — the collection tab. Pick Spirit / Soul / Body, pick Text /
  Photo / Video. Text uses a selection list: as you type, anything you've
  written before shows as a tap-to-reuse suggestion; if nothing matches,
  the app offers to add it as new. Photos and videos are captured (or
  picked) and stored inline as data URLs, with an optional description.
- **Space** — tap "Capture location now" and the device's GPS coordinates
  are read automatically. If they fall inside a place you've already
  named and saved, that name is applied automatically, the same way a
  map recognises a location you've visited before. If not, you're asked
  to name it once — after that it's recognised automatically.
- **Log** — a searchable, reverse-chronological feed of everything you've
  collected, for the moment you sit down to evaluate a larger unit (a
  week's Sunday, a day's last quaday, a year's December).

## Decisions made where the brief was open-ended

A few of the cycles you described don't nest neatly inside one another
(a year belongs to a 4-year cycle, a 7-year cycle, a decade *and* a
century all at once, independently). Rather than forcing a single drill
path, the Time tab shows every cycle as its own lens on the same focus
date — tapping inside any lens moves the shared focus, and every other
lens updates to match. Specific choices:

- **Quaday** = the eight 3-hour blocks (0–3 … 21–24). **Spirit / Soul /
  Body** are the three hours inside each block, in that order — Spirit
  at the top of the hour (3, 6, 9, 12, 15, 18, 21h), Soul the middle
  hour, Body the last hour before the next mark.
- **Week** — Sunday→Saturday, laid out as the mountain you described:
  Sun/Mon/Tue rising, Wednesday at the summit, Thu/Fri/Sat descending
  back down, Saturday landing under Sunday.
- **Quarter** — the two non-fasting months are walked as eight
  sequential weeks (1,2,3,(4,5),6,7,8, weeks 4–5 marked as the peak,
  mirroring the week's shape); the fasting month (March/June/September/
  December) is shown separately as the quarter's summit.
- **4-year cycle** — calendar-aligned by default so it always ends on a
  year divisible by 4 (2021–2024, 2025–2028…), matching your example.
  Switch to a custom anchor year in Settings if you'd rather it be tied
  to something personal.
- **7-year cycle** — anchored at 2004 by default (matching your example);
  change the anchor in Settings. Year 4 of each cycle is marked as its
  peak.
- **49-year cycle** ("the 7-year arrangement, week-shaped") — seven
  consecutive 7-year cycles, laid out with the same mountain shape,
  4th cycle as the peak.
- **Decade** is a plain calendar decade (2020–2029) since no alignment
  rule was given for it.
- **Century** uses the everyday convention (the 21st century is
  2001–2100, not 2000–2099), so today shows as **2001–2100**; the
  century card's ten sub-blocks follow the same 2001/2011/2021…
  alignment.

All of the above only affect *labels and grouping* — the underlying date
math is exact, so nothing here needs to be "right" on the first try:
adjust the two anchors in Settings any time and every card recomputes.

## Data & privacy

Everything — notes, matter entries (including photos/video as embedded
data), named places, settings — stays in this browser's `localStorage`
on this device. Nothing is sent anywhere. Use **Settings → Export
backup** regularly, especially before clearing browser data or moving
devices; **Import backup** restores it, and **Erase all data** wipes it.

Because photos/video are stored as base64 in `localStorage`, keep an eye
on volume — browsers typically cap localStorage around 5–10MB. For heavy
photo/video use over time, export a backup and start a fresh period, or
keep media descriptions text-only and store the actual files elsewhere.
