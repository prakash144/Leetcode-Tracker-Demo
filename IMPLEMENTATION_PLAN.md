# Implementation Plan — Improvement Pass (v2)

> **How to read status markers:** ⬜ Not started · 🔶 In progress · ✅ Done.
> Replace these as work actually lands — don't mark a phase ✅ until its own validation checklist passes for real. (The previous draft marked everything complete by default, which made it impossible to tell what was actually outstanding.)

## Phase Dependency Order

Work in this order — later phases assume earlier ones exist:

```
1. Heatmap Redesign
        │
        ▼
2. Progress Page  ──────┐
        │                │
        ▼                ▼
3. Dashboard  (reuses Heatmap + links into Progress)
        │
        ▼
4. Global Optimization & Polish  (touches everything above)
        │
        ▼
5. Navigation Update  (route rename only — can land any time after Progress exists)
        │
        ▼
6. Final Visual Consistency Pass  (last — needs all pages stable)
```

---

## 1. Heatmap Redesign — ✅

Match LeetCode's contribution heatmap while preserving the existing Firestore activity model.

**Layout**
- GitHub/LeetCode-style grid: 7 rows (Mon–Sun), week-based columns
- Desktop: full layout. Mobile: horizontally scrollable container, no overlap
- Month labels above week columns, aligned to each month's first cell; abbreviate ("Jan" → "J") or hide before allowing overlap

**Header summary** (above the grid)
```
163 submissions in the past one year
Total active days: 45    Max streak: 14    [Current ▼]
```

**Cells** — five intensity levels, single-hue green scale:

| Level | Condition |
|---|---|
| None | 0 submissions |
| Low | 1 |
| Medium | 2–3 |
| High | 4–6 |
| Very High | 7+ |

**Tooltip**: `5 submissions on Jun 24, 2026` / `No submissions on Jun 24, 2026`

**Legend**: `Less  █ █ █ █ █  More`

**Time-range filter**: Current (past 1 yr, default), 2025, 2024, 2023, Last 180 Days, Last 90 Days, Last 30 Days. Changing it must update: cells, total submissions, active days, current streak, max streak — together, not independently (avoid a filter that updates the grid but leaves stale stats).

**States**: Loading (skeleton grid, 7×~53), Empty ("No activity data yet" + CTA), Signed out (sign-in prompt), Error (message + retry).

**Responsiveness**: ≥1024px full labels · 768–1023px abbreviated/reduced spacing · <768px horizontal scroll, no overlap. Test at 1440 / 1024 / 768 / 375.

**Performance**: `useMemo` for activity aggregation, streak derivation, color mapping. Memoize cell colors. Virtualize off-screen weeks only if the dataset size actually requires it — don't add virtualization speculatively if 53 weeks renders fine.

**Validation**: build / lint / typecheck pass · labels never overlap at any breakpoint · filter updates all four stats atomically · legend matches cell colors · all four states render correctly.

---

## 2. Progress Page (replaces Analytics) — ✅

Two-column workspace: Practice History (primary) + Summary (sidebar).

```
┌─────────────────────────────────┬──────────────────┐
│  Practice History (Primary)     │ Summary (Sidebar)│
│  Filters / Search / Sort        │ Overall Stats     │
│  Paginated Table                │ Charts            │
│                                  │ Recent Stats      │
│                                  │ Insights          │
└─────────────────────────────────┴──────────────────┘
```
Desktop: side-by-side. Tablet/mobile: stacked, sidebar below.

**Practice History table**

| Column | Content |
|---|---|
| Last Submitted | Relative time ("2 hours ago", "Yesterday", "Jun 21") |
| Problem | Title, clickable |
| Difficulty | Badge (Easy/Medium/Hard) |
| Company | Tag(s) |
| Last Result | Accepted / Attempted, status color |
| Total Submissions | Count |

Sortable: Last Submitted, Title, Difficulty, Total Submissions.

**Filters** (independently toggleable, composable, backed by one shared query-state object so new filters don't require redesign): Search (debounced), Difficulty, Company (multi-select), Topic (multi-select), Status, Frequency, Custom List, Date range (preset or picker). Every filter combination needs to be resettable to a known empty state — add a single "Clear all filters" action rather than requiring per-filter clearing.

**Pagination**: page size 10/25/50, "Page X of Y," "Showing 1–25 of 142 problems," sticky header.

**Sidebar**
- Overall Progress: Total Solved / Attempted / Submissions, Acceptance Rate, per-difficulty breakdown (count + %)
- Charts: Difficulty Breakdown (donut), Monthly Submission Trend, Company-wise Progress, Topic-wise Progress, Pattern Distribution, Most Practiced Topics — lazy-loaded (dynamic import), lightweight library (recharts or custom SVG)
- Recent Stats: solved this week/month, current streak, max streak, avg daily submissions, avg problems/week
- Insights: strongest/weakest topics by acceptance rate, most-practiced company/pattern, avg attempts per problem, acceptance trend (increasing/decreasing/stable) — state the minimum sample size before showing a trend (e.g., don't claim "increasing" off 2 data points)

**UX**: compact table typography, sticky header, horizontal scroll on mobile / stacked on small screens, skeleton loading, empty state ("Start solving problems to see your progress"), error + retry, row hover, full keyboard access through filters → table → pagination.

**Performance**: memoize derived stats and filtered/sorted list; debounce search; stable row keys instead of re-rendering the whole table on filter change; dynamic-import charts.

**Validation**: build/lint/typecheck pass · filters narrow correctly and compose · sorting works · pagination respects active filters · sidebar stats match table data for the same filter state · charts render correctly · all states correct · responsive at 1440/1024/768/375.

---

## 3. Dashboard — ✅

Answers "how am I progressing today?" — a snapshot, not a duplicate of Progress.

```
┌────────────────────────────────────────────────────────┐
│  Profile Summary            Overall Progress / Stats   │
├────────────────────────────────────────────────────────┤
│  Activity Heatmap (reused from Phase 1, unmodified)     │
├────────────────────────────────────────────────────────┤
│  Continue Solving  │  Recent Activity  │  Weekly Goal   │
├────────────────────────────────────────────────────────┤
│  Difficulty Breakdown         Company Progress          │
└────────────────────────────────────────────────────────┘
```

- **Profile Summary**: avatar (Google auth), name, current streak (flame icon), total solved, weekly goal with completion %
- **Overall Progress**: same four headline stats as Progress sidebar, plus an animated donut/radial chart (Easy green / Medium yellow / Hard red), count+% centered, each segment clickable → `/progress?difficulty=easy`
- **Difficulty Breakdown cards**: solved/total, %, progress bar per difficulty; clicking a card → `/progress?difficulty=...`
- **Activity Heatmap**: the Phase 1 component, unmodified, with its own time-range filter; clicking it → `/progress`
- **Continue Solving**: last solved + last attempted problem, "Resume" button; empty state if no history
- **Recent Activity**: latest 3–5 solved problems, "View Full History" → `/progress`
- **Quick Actions**: Continue Solving, Random Problem, Favorites, My Lists, Progress
- **Company Progress**: top 5 companies practiced, solved count + completion % bar each, click → `/problems?company=...`

**Explicit non-goal**: no table, no filters, no pagination on this page — that's what Progress is for. If a future request asks to "just add a quick filter to the dashboard," that's scope creep back into Progress's job and should be pushed back on.

**Performance**: each section independently memoized and independently skeleton-loaded (one section's error shouldn't block the rest); donut chart dynamic-imported; flat component hierarchy.

**Validation**: build/lint/typecheck pass · donut chart animates and segments are clickable and route correctly · difficulty cards route correctly · heatmap is the exact Phase 1 component (no forked copy) · profile data matches auth session · recent activity matches latest submissions · all states correct.

---

## 4. Global Optimization & Polish — ✅

Applies across all pages above. Do this *after* 1–3 exist, since it's a cross-cutting pass, not new feature work.

**Load performance**: dynamic imports for charts/heatmap/dialogs · route-based code splitting (App Router) · bundle audit via `next build --analyze` · minimize client component boundaries · fixed-aspect-ratio skeletons to avoid CLS · preload critical CSS.

**Runtime performance**: memoize parsed CSV (parse once) · `onSnapshot` vs `getDocs` chosen deliberately per read pattern, not by default · single-pass memoized filter pipeline · 300ms debounce on search · memoized sort · pagination computed from memoized filtered list · `React.memo` on table rows, stat cards, chart components, heatmap cells · `useCallback` on handlers passed as props.

**UI consistency**: one font scale, one spacing scale, consistent line-height. Every data-driven component handles all four states (loading/empty/error/signed-out) using a **shared** set of state components rather than each page reinventing its own skeleton/empty/error markup — this is the actual mechanism for "consistency," not just a style guideline.

**Empty states**: icon (SVG, not emoji) + title + one-line explanation + action button, every time.

**Per-page focus**:

| Page      | Focus                                                    |
|-----------|----------------------------------------------------------|
| Dashboard | High-level overview only — no table/filters              |
| Problems  | Full workspace: table, filters, search, sort, pagination |
| Progress  | History + stats sidebar (replaces old Analytics route)   |
| Favorites | Bookmarked list + empty state                            |
| My Lists  | Create/rename/delete/view custom lists                   |
| Settings  | Theme, preferences, account, about                       |

**Responsiveness targets**: ≥1440px (max-width container) · 1024px · 768px (stacked) · 375px (single column) · 320px minimum supported. No unintentional horizontal scroll (heatmap and wide tables are the only allowed exceptions).

**Accessibility**: full keyboard reachability · visible focus rings · `aria-label` on icon-only buttons · WCAG AA contrast (4.5:1 normal text, 3:1 large text/UI components — state the actual numbers, don't just say "meets AA") · semantic HTML and correct heading hierarchy · `prefers-reduced-motion` respected.

**Code quality**: remove dead code/unused imports · de-duplicate filter/sort logic into shared hooks · no `any` in core data models.

**Validation** (this phase's checklist *is* the master checklist — see §7, don't re-derive it per page): build/lint/typecheck pass · no console errors dev or prod · no layout shift on load · all interactive elements have focus states · responsive at all targets · Lighthouse Performance ≥ 90, Accessibility ≥ 90.

---

## 5. Navigation Update — ✅

| Before | After |
|---|---|
| Analytics | **Progress** (renamed) |
| everything else | unchanged |

### Route Map

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/problems` | Problems |
| `/progress` | Progress (was Analytics) |
| `/favorites` | Favorites |
| `/my-lists` | My Lists |
| `/settings` | Settings |

Profile dropdown: My Profile · My Lists · Settings · Theme · Sign Out.

**Note**: add a redirect from the old `/analytics` route to `/progress` so existing bookmarks/links don't 404.

---

## 6. Final Visual Consistency Pass — ⬜

Last phase. No new features — only consistency of what 1–5 already built. Target feel: LeetCode / GitHub / Linear / Vercel / Raycast — polished, not flashy.

### 6.1 Difficulty Color System (single decision, applied everywhere)

- Easy → green · Medium → yellow/amber · Hard → red

Apply identically across: difficulty badges, progress bars, donut/pie charts, stat cards, table rows, legends, filters, tooltips — anywhere difficulty appears. Define these three colors **once** as design tokens (e.g., Tailwind theme values or CSS variables) and reference the tokens everywhere, rather than re-specifying hex values per component — that's what actually prevents drift.

### 6.2 Company Logos — Decision

Resolve this before building rather than leaving it open at ship time:

- **Recommended default: don't use real company logos.** Logos are trademarked assets; bundling or hotlinking them creates licensing exposure and a maintenance burden (logos change, need fallbacks, vary in aspect ratio/background requirements).
- **Use instead**: a small colored initials badge (e.g., first 1–2 letters, deterministic color per company name) at 16–20px, consistent across Problems/Progress/Dashboard/filters. This needs zero new dependencies and no licensing risk.
- If the team decides real logos are worth the risk later, scope it as its own follow-up phase with an explicit license review — don't fold it into a "polish pass."

### 6.3 Chart Review

For every chart (donut, pie, progress rings, difficulty charts, heatmap, progress bars): difficulty colors per §6.1, consistent legend placement/style, consistent label typography, consistent hover interaction pattern, fast/subtle animation (respecting reduced-motion).

### 6.4 Component Review

Navbar, sidebar, cards, tables, buttons, inputs, dropdowns, dialogs, tooltips, heatmap, filters, search, pagination, skeletons, empty states — pass over each for shared spacing/radius/shadow tokens. No functional changes in this phase.

### 6.5 Page-by-Page Check

Dashboard, Progress, Problems, Favorites, My Lists, Settings, Navigation (incl. mobile) — each reviewed for spacing, alignment, and whether it visually feels like the same product as the others.

### 6.6 Final Questions

- Does every page feel like the same product?
- Are colors consistent (especially difficulty colors)?
- Is spacing consistent?
- Does anything feel visually out of place?

Fix what you find; this phase doesn't close until the answer to all four is yes.

---

## 7. Master Validation Checklist

One checklist, referenced by every phase above — don't re-run a separate copy per page.

**Build & Export**
- [ ] `npm run build` succeeds
- [ ] Static export output generated (if configured)
- [ ] All routes work with configured `basePath`
- [ ] `/analytics` redirects to `/progress`

**Lint & Types**
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] No `any` in core data models
- [ ] No dead imports/unused components

**Responsiveness** — 1440 / 1024 / 768 / 375 / 320px, no unintended horizontal overflow, dialogs fit mobile viewport

**Accessibility** — full keyboard reachability, visible focus states, `aria-label` on icon-only controls, WCAG AA contrast (4.5:1 / 3:1), states announced to screen readers

**Performance** — large dataset stays responsive, filter/sort/pagination use memoized data, no unnecessary re-renders (verify in React DevTools), charts lazy-loaded, no layout shift on load, Lighthouse Performance ≥ 90 / Accessibility ≥ 90

**Data Integrity** — CSV fetch behavior unchanged, Firebase auth flow unchanged, existing progress fields preserved (solved, attempted, bookmarked, notes, timestamps), heatmap uses existing activity docs, signed-out flow works, clear error when Firebase isn't configured

**UX Quality** — nav labels clear, Dashboard useful at a glance, Progress has meaningful stats + history, filters understandable and resettable in one action, skeletons match final layout shape, empty states have CTAs, errors are recoverable, animations are subtle

**Visual Consistency** (Phase 6 specific) — one difficulty color system applied everywhere, company identifier (badge or logo) consistent, charts share a visual language, components share spacing/radius/shadow tokens

---

## 8. Open Decisions / Risks (carried forward, not buried in status markers)

- **Company logos**: resolved in §6.2 — initials badges, not real logos, unless a follow-up phase does a license review.
- **Virtualization on the heatmap**: don't build it speculatively (§1) — only if real data shows it's needed.
- **Trend claims in Insights** (§2): need a minimum-sample-size rule before showing "increasing/decreasing," to avoid misleading users with noisy small-sample data.
- **`onSnapshot` vs `getDocs`**: needs a per-feature decision (read frequency, staleness tolerance), not a blanket default — flagged in §4 so it doesn't get applied inconsistently.