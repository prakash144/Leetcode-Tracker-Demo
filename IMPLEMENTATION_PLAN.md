1. Gap Analysis

Current State

- Single-route Next.js static app at src/app/page.tsx.
- Public problem metadata comes from GitHub CSV.
- User progress is stored in Firebase Firestore.
- Auth uses Firebase Google popup.
- Main route owns most app state: company, list, difficulty, topics, search, debounced search, last updated, auth, progress.
- UI includes filter bar, dashboard summary, heatmap, question table, notes dialog, and footer.
- Existing reusable primitives are shadcn/Radix-style: Button, Input, DropdownMenu, Dialog, Avatar, Checkbox, ScrollArea.

Missing Functionality

- No dedicated Analytics/Statistics route.
- No real app navigation/sidebar/top nav.
- No pagination.
- No explicit Favorites view/filter, despite bookmark data existing.
- Bookmarks are only a star toggle, with no management surface.
- No saved filter state, URL query state, or sharable views.
- No table density controls, column controls, or robust sort model.
- No structured loading/empty/error components.
- No reusable dashboard cards or page shell.
- No test coverage.
- No responsive table strategy.
- No centralized design tokens beyond mostly default shadcn variables.
- No realtime Firestore sync.
- No explicit accessibility audit or keyboard-first workflows.

UX Issues

- Primary controls can disappear until lastUpdated resolves.
- Login is hidden inside avatar menu.
- Logged-out dashboard and heatmap show empty progress without enough context.
- Table likely overflows on mobile.
- Topic selector trigger can become too wide with many selected topics.
- Company selector can offer static companies that may not map to available CSV data.
- Company selector does not close after selection.
- “Dashboard” menu item is inert.
- Error messages are generic.
- Loading states are plain text and inconsistent.
- Heatmap has no legend or clear signed-out state.
- Footer feels more personal-site oriented than app oriented.

Technical Limitations

- page.tsx is overloaded.
- Filtering occurs in both page.tsx and QuestionTable.
- lastUpdated is hardcoded to Google / 5. All.csv.
- next.config.ts base path appears inconsistent with README deployment URL.
- Firestore progress is loaded once with getDocs, not subscribed.
- Optimistic updates may race because updates close over progressMap.
- Activity aggregation only increments and does not decrement on undo.
- fetchCompanyList lacks response.ok handling.
- Some local UI primitives are unused while raw Radix/native inputs are used.
- Analytics are derived only from currently loaded/filtered company/list data, not necessarily the user’s complete progress history.

———

2. Architecture

Components To Add

- AppShell: shared layout for authenticated-style app chrome.
- TopNav or SidebarNav: navigation between Dashboard, Problems, Analytics, Favorites.
- PageHeader: title, subtitle, actions, metadata.
- MetricCard: reusable stat card.
- ProgressRing or ProgressBarCard: reusable progress visualization.
- ProblemFilters: extracted filter controls from FilterBar.
- ProblemToolbar: search, sort, filter summary, reset filters, pagination size.
- ProblemTablePagination: pagination controls.
- ProblemCardList: mobile-friendly problem list alternative.
- EmptyState: reusable empty/signed-out/no-results states.
- ErrorState: reusable recoverable error UI.
- LoadingSkeleton: dashboard/table/card skeletons.
- FavoriteProblemsView: favorites/bookmarks-focused view.
- AnalyticsOverview: high-level analytics layout.
- DifficultyBreakdown, TopicBreakdown, ActivityPanel, ProgressTrendPanel.
- StatusBadge, DifficultyBadge, TopicBadge.
- AuthButton / UserMenu: clearer auth entry and account menu.
- FilterChips: active filter summary with remove actions.

Components To Refactor

- src/app/page.tsx
    - Reduce to route composition.
    - Move problem state/data orchestration into hooks or feature components.

- FilterBar
    - Split into navigation/auth/header responsibilities and problem filters.

- QuestionTable
    - Split filtering/sorting/pagination from rendering.
    - Reuse Checkbox, Button, badges, empty/loading states.

- DashboardStats
    - Convert internal StatPill and ProgressList into reusable components.

- Heatmap
    - Add signed-out, empty, loading, error, and legend states.

- CompanySelector
    - Align static/dynamic source strategy.
    - Improve close behavior and trigger text.

- TopicSelector
    - Replace clickable spans with accessible buttons or checkbox items.

- NotesDialog
    - Use shared Dialog wrapper and add save/error/loading feedback.

Routing Changes

- Keep / behavior as the current main dashboard/problems surface initially.
- Add:
    - /analytics for dedicated statistics.
    - /favorites for bookmarked/favorite problems.

- Optional later:
    - /problems if the root dashboard becomes more summary-focused.

- Use App Router pages:
    - src/app/page.tsx
    - src/app/analytics/page.tsx
    - src/app/favorites/page.tsx

State/Data Model Changes

- Keep existing Firestore progress schema initially:
    - solved
    - attempted
    - bookmarked
    - inRevisionList
    - notes
    - timestamps

- Treat “Favorites” as the current bookmarked field to preserve behavior.
- Consider UI naming:
    - “Favorites” page powered by bookmarked.
    - “Bookmarks” as row-level saved marker, unless product language is unified.

- Add client-side state abstractions:
    - useProblemFilters
    - useProblemSorting
    - usePagination
    - useFilteredProblems
    - useProblemDataset

- Optional future model additions:
    - favoriteRank
    - favoriteTags
    - lastReviewedAt
    - confidence
    - customLists

Shared Abstractions

- ProblemQueryState: search, difficulty, topics, company, list, status, favorites-only, sort, page, page size.
- ProblemStatus: solved, attempted, unsolved, bookmarked, revision.
- ProblemSort: field plus direction.
- useProblemCollection: one place for CSV fetch, formatting, filtering, sorting, pagination.
- useProgressActions: wraps progress mutations and auth guard.
- useAnalyticsStats: derived stats for analytics/dashboard.
- useUrlState later if filters should sync to query params.

Suggested Folder Structure

src/
app/
page.tsx
analytics/page.tsx
favorites/page.tsx
layout.tsx
globals.css
components/
ui/
layout/
AppShell.tsx
TopNav.tsx
PageHeader.tsx
states/
EmptyState.tsx
ErrorState.tsx
LoadingSkeleton.tsx
data-display/
MetricCard.tsx
StatusBadge.tsx
DifficultyBadge.tsx
TopicBadge.tsx
features/
problems/
components/
ProblemToolbar.tsx
ProblemFilters.tsx
ProblemTable.tsx
ProblemCardList.tsx
ProblemPagination.tsx
NotesDialog.tsx
hooks/
useProblemFilters.ts
useProblemSorting.ts
usePagination.ts
useFilteredProblems.ts
dashboard/
components/
DashboardStats.tsx
ActivityHeatmap.tsx
analytics/
components/
AnalyticsOverview.tsx
DifficultyBreakdown.tsx
TopicBreakdown.tsx
favorites/
components/
FavoriteProblemsView.tsx
hooks/
lib/
services/

This can be introduced incrementally. Existing paths do not need to be moved in phase one.

———

3. Execution Plan

Phase 1: Stabilize Foundations Without Behavior Change

Objective:
Create a clean foundation for premium UI work while preserving the current app behavior.

Scope:

- Extract reusable state helpers.
- Add shared state components.
- Keep current route and UI visually close to existing behavior.
- Fix obvious non-behavior-breaking issues.

Files/components affected:

- src/app/page.tsx
- src/app/components/QuestionTable.tsx
- src/app/components/FilterBar.tsx
- src/app/components/Heatmap.tsx
- src/components/ui/*
- New src/components/states/*
- New src/features/problems/hooks/*

Dependencies:

- Existing hooks and Firebase services.
- Existing shadcn/Radix primitives.

Risks:

- Refactoring filtering can accidentally change visible problem counts.
- Moving logic from table/page can alter sort/filter behavior.

Acceptance criteria:

- / renders the same core functionality.
- Search, company, list, difficulty, topic filters still work.
- Progress toggles, notes, bookmarks, revision toggle still work.
- Logged-out auth guard still triggers login.
- No schema changes.

Validation checklist:

- Run build.
- Run lint or equivalent.
- Manually verify default Google / All CSV load.
- Verify all current filters.
- Verify progress mutation when signed in.
- Verify signed-out progress action prompts login.
- Verify no console errors from refactor.

———

Phase 2: Premium App Shell And Navigation

Objective:
Introduce production-quality app navigation and layout while keeping the root dashboard usable.

Scope:

- Add AppShell.
- Add top navigation or sidebar navigation.
- Add clearer auth/user menu.
- Add page header.
- Move footer out of the primary productivity viewport or simplify it.

Files/components affected:

- src/app/layout.tsx
- src/app/page.tsx
- src/app/components/FilterBar.tsx
- New src/components/layout/AppShell.tsx
- New src/components/layout/TopNav.tsx
- New src/components/layout/PageHeader.tsx
- Optional src/components/layout/UserMenu.tsx

Dependencies:

- useAuth
- Avatar, DropdownMenu, Button

Risks:

- Static export base path issues with navigation links.
- Login visibility changes could alter expected flow.

Acceptance criteria:

- Users can navigate to Dashboard, Analytics, Favorites once routes exist.
- Auth state is visible and understandable.
- Existing filter functionality remains available on the dashboard/problems page.
- Layout is responsive at mobile/tablet/desktop widths.

Validation checklist:

- Check desktop width around 1440px.
- Check tablet width around 768px.
- Check mobile width around 375px.
- Keyboard tab through navigation and auth menu.
- Confirm no hydration warnings.

———

Phase 3: Search, Filter, Sort, And Pagination Upgrade

Objective:
Make the problem list production-grade with pagination, clearer filters, and better sorting.

Scope:

- Add pagination state and controls.
- Centralize filtering/sorting/pagination.
- Add status filters: all, solved, attempted, unsolved, favorites/bookmarked, revision.
- Add reset filters.
- Add page-size selector.
- Improve empty state for no results.

Files/components affected:

- QuestionTable
- FilterBar or new ProblemToolbar
- New ProblemPagination
- New useProblemFilters
- New useProblemSorting
- New usePagination
- New useFilteredProblems

Dependencies:

- Existing Problem type.
- Existing ProgressMap.

Risks:

- Counts may become confusing if they refer to paginated vs filtered totals.
- Existing double filtering must be removed carefully.
- Search debounce behavior should remain similar.

Acceptance criteria:

- Pagination works with configurable page size.
- Filters apply before pagination.
- Sorting applies before pagination.
- Counts distinguish total dataset, filtered result count, and page range.
- Empty state appears for no matching problems.
- Existing search/filter/sort behavior is preserved or improved intentionally.

Validation checklist:

- Search for a known title.
- Filter by difficulty.
- Filter by topic.
- Sort by acceptance and frequency.
- Move between pages.
- Change page size.
- Clear all filters.
- Verify progress toggles on paginated rows.

———

# Phase 4 – Separate Dashboard & Problems Workspace

## Objective

Improve the application structure by separating the Dashboard from the Problems experience. The Dashboard should become an analytics and overview page, while a dedicated Problems page becomes the primary workspace for browsing and solving coding problems.

---

## Goals

* Create a dedicated **Problems** page.
* Keep the **Dashboard** focused on progress and insights.
* Improve navigation and scalability.
* Prepare the application for future features like custom lists, advanced filtering, and problem collections.

---

## Features

### 1. Dedicated Problems Page

Create a new route:

```
/problems
```

Move the following from the Dashboard:

* Complete problems table/list
* Search
* Difficulty filter
* Topic filter
* Status filter
* Sorting
* Pagination
* Problem actions
* Favorite/Bookmark toggle

This page becomes the primary workspace for solving problems.

---

### 2. Dashboard Simplification

Refactor the Dashboard into a high-level overview.

Keep only:

* Progress summary
* Solved problems statistics
* Difficulty breakdown
* Topic distribution
* Recent activity
* Daily streak
* Heatmap
* Quick links
* Resume last solved problem

Remove:

* Large problems table
* Search
* Filters
* Pagination

The Dashboard should provide insights instead of content management.

---

### 3. Navigation Update

Update the primary navigation:

```
Dashboard
Problems
Analytics
Favorites
Settings
```

Users should be able to switch between overview and problem-solving workflows without excessive scrolling.

---

### 4. Shared Problem Components

Extract reusable components for the Problems workspace.

Suggested structure:

```
components/problems/
├── ProblemTable.tsx
├── ProblemCard.tsx
├── ProblemFilters.tsx
├── SearchBar.tsx
├── SortDropdown.tsx
├── StatusBadge.tsx
├── DifficultyBadge.tsx
└── Pagination.tsx
```

This avoids duplication and keeps the codebase modular.

---

### 5. Routing Changes

```
src/app/page.tsx              // Dashboard
src/app/problems/page.tsx     // Problems List
src/app/analytics/page.tsx
src/app/favorites/page.tsx
src/app/settings/page.tsx
```

---

### 6. Dashboard Quick Actions

Provide shortcuts instead of embedding the full problem list.

Examples:

* Continue Solving
* Random Problem
* View All Problems
* View Favorites
* Recently Solved

---

## Expected Outcome

After Phase 4:

* Dashboard becomes a clean analytics and progress overview.
* Problems page becomes the dedicated workspace for discovering and solving problems.
* Navigation is more intuitive.
* The architecture is easier to extend with future features such as custom collections, company-wise problem lists, playlists, and advanced filtering.


---

Phase 5: Favorites And Improved Bookmarks

Objective:
Turn the existing bookmark field into a first-class Favorites experience.

Scope:

- Add /favorites route.
- Show bookmarked problems from currently loaded dataset.
- Add favorites-only filter on main problem table.
- Improve bookmark affordance with label, tooltip, and active state.
- Add empty states for no favorites and signed-out users.

Files/components affected:

- New src/app/favorites/page.tsx
- New FavoriteProblemsView
- QuestionTable
- useFilteredProblems
- DashboardStats
- shared badges/actions

Dependencies:

- Existing bookmarked field.
- Existing Firebase progress loading.

Risks:

- Firestore stores progress by problem ID only; displaying favorite metadata requires matching current CSV dataset.
- Favorites across all companies/lists are not fully possible unless all metadata is loaded or progress docs store metadata snapshots.

Acceptance criteria:

- Bookmark toggle remains backward compatible.
- Favorites page shows bookmarked problems available in the current dataset.
- Main list can filter to favorites.
- Signed-out users see a clear sign-in prompt.
- Empty favorites state explains how to add favorites.

Validation checklist:

- Sign in, bookmark a problem, verify it appears in Favorites.
- Unbookmark, verify it disappears.
- Verify existing star state in main table.
- Verify no-favorites state.
- Verify signed-out state.

———

Phase 6: Dedicated Analytics/Statistics Page

Objective:
Add a dedicated analytics surface using existing progress and problem metadata.

Scope:

- Add /analytics.
- Show progress by difficulty, topic, company/list, status.
- Show activity heatmap with legend and better empty/loading states.
- Add summary cards and progress visuals.
- Reuse useDashboardStats initially; add useAnalyticsStats only if needed.

Files/components affected:

- New src/app/analytics/page.tsx
- New AnalyticsOverview
- New DifficultyBreakdown
- New TopicBreakdown
- Refactor/reuse DashboardStats
- Refactor/reuse Heatmap

Dependencies:

- Current loaded problem metadata.
- progressMap.
- getUserActivity.

Risks:

- Analytics may be scoped to current dataset, not global lifetime progress.
- User may expect cross-company analytics; that requires loading more metadata than currently done.

Acceptance criteria:

- Analytics page renders dedicated stats.
- Stats match dashboard totals for the same dataset.
- Heatmap has loading, empty, signed-out, and error states.
- No Firestore schema change required.

Validation checklist:

- Compare dashboard solved/attempted counts to analytics.
- Verify signed-out analytics state.
- Verify signed-in activity state.
- Verify no crash when progress is empty.
- Verify route works under static export.

———

Phase 7: Responsive Design Pass

Objective:
Make the app feel polished and usable across desktop, tablet, and mobile.

Scope:

- Add mobile problem cards or responsive table fallback.
- Make filter toolbar wrap predictably.
- Prevent topic/company trigger overflow.
- Add sticky table header only if it does not harm mobile UX.
- Improve spacing, typography, hierarchy.

Files/components affected:

- AppShell
- ProblemToolbar
- QuestionTable
- New ProblemCardList
- TopicSelector
- CompanySelector
- DashboardStats
- AnalyticsOverview

Dependencies:

- Completed component split.

Risks:

- Maintaining both table and card views can duplicate row logic.
- Mobile controls can become too hidden if over-compressed.

Acceptance criteria:

- Desktop table remains efficient.
- Mobile layout does not horizontally overflow.
- Primary actions are usable with touch.
- Text does not overlap or escape containers.
- Filter state is visible and removable on small screens.

Validation checklist:

- Check 320px, 375px, 768px, 1024px, 1440px widths.
- Verify table/card row actions.
- Verify dialogs fit mobile viewport.
- Verify nav does not overlap content.
- Verify long topic/company names.

———

Phase 8: Loading, Empty, Error, And Accessibility Hardening

Objective:
Make all interaction states explicit and accessible.

Scope:

- Add reusable state components.
- Replace raw clickable spans with buttons or proper checkbox/menu items.
- Add labels, aria attributes, and keyboard behavior where missing.
- Improve error messages for GitHub, Firebase config, auth, and Firestore.
- Add skeletons for dashboard/table.

Files/components affected:

- CompanySelector
- TopicSelector
- QuestionTable
- NotesDialog
- Heatmap
- FilterBar / ProblemToolbar
- New EmptyState, ErrorState, LoadingSkeleton

Dependencies:

- UI component foundation.

Risks:

- Changing interactive elements may subtly affect styling.
- Dialog focus behavior should remain correct.

Acceptance criteria:

- All major controls are keyboard reachable.
- Dialogs have titles and sensible focus handling.
- Empty/error/loading states exist for CSV load, auth, progress, activity, no results, no favorites.
- Disabled login state explains Firebase configuration issue.

Validation checklist:

- Keyboard-only pass.
- Screen reader label spot-check.
- Check focus rings.
- Check disabled states.
- Check no-results and network-error states.

———

Phase 9: Premium Design System And Micro-Interactions

Objective:
Upgrade visual quality while staying within Tailwind/shadcn conventions.

Scope:

- Define a restrained design language: background, surfaces, borders, typography, status colors.
- Add reusable badges, cards, toolbar styling, active states.
- Add subtle transitions for filters, row hover, stat cards, bookmark/favorite toggles.
- Keep motion minimal and respectful.

Files/components affected:

- src/app/globals.css
- shared UI components
- MetricCard
- StatusBadge
- DifficultyBadge
- TopicBadge
- AppShell
- problem/dashboard/analytics components

Dependencies:

- Stable component hierarchy.

Risks:

- Over-styling can obscure productivity workflows.
- Color contrast must remain accessible.
- Motion should not make table interactions feel sluggish.

Acceptance criteria:

- Consistent surface, border, radius, spacing, and text hierarchy.
- Clear visual states for active filters, favorites, solved, attempted, revision.
- Micro-interactions are subtle and do not alter behavior.
- Meets reasonable contrast expectations.

Validation checklist:

- Visual scan of all routes.
- Dark theme contrast check.
- Hover/focus/active state check.
- Reduced-motion consideration if animations are added.
- Mobile and desktop screenshots.

———

Phase 10: Validation, Performance, And Deployment Readiness

Objective:
Ensure the production-quality upgrade is stable and deployable.

Scope:

- Build/lint fixes.
- Add minimal tests if project test tooling is introduced.
- Performance review for large CSVs.
- Check static export compatibility.
- Resolve deployment path mismatch if approved.

Files/components affected:

- package.json
- next.config.ts
- possible test config files
- all touched components

Dependencies:

- All previous phases.

Risks:

- Adding a test framework increases setup scope.
- Changing basePath may affect current deployment.

Acceptance criteria:

- Build succeeds.
- Lint succeeds or known Next lint script issue is addressed.
- Static export works.
- Routes work with configured base path.
- No obvious regressions in existing functionality.

Validation checklist:

- npm run build
- lint command or replacement
- route smoke test: /, /analytics, /favorites
- auth smoke test
- CSV load smoke test
- Firestore progress smoke test
- responsive pass
- accessibility pass
- performance pass with large list

———

4. Refactoring Plan

Safe refactors that should not change behavior:

- Extract search debounce from page.tsx into useDebouncedValue.
- Move problem filtering/sorting into pure utility functions with typed inputs.
- Move pagination into usePagination.
- Replace duplicated search filtering with one shared pipeline.
- Extract StatPill and ProgressList from DashboardStats.
- Replace direct Radix Dialog usage with existing local Dialog wrapper.
- Replace raw checkboxes in QuestionTable with the existing Checkbox primitive.
- Extract row action buttons into ProblemRowActions.
- Extract difficulty color logic into DifficultyBadge.
- Replace hardcoded emoji/check indicators in menus with icons or accessible selected state.
- Move static topic/company option data into separate constants files.
- Remove unused Firebase service functions only after confirming they are not planned for near-term use.
- Improve service error handling without changing call sites first.
- Normalize naming: choose “Favorites” or “Bookmarks” as product language, then alias internally if needed.
- Split FilterBar into ProblemFilters, SearchInput, and UserMenu.
- Add typed result/error shapes for GitHub fetchers later, after UI state components exist.

———

5. Final Review Checklist

Build And Static Export

- npm run build succeeds.
- Static export output is generated.
- App works with configured basePath.
- README deployment URL and next.config.ts path are consistent or documented.

Lint And Type Safety

- Lint command succeeds or is updated for current Next.js version.
- TypeScript build has no errors.
- No any introduced for core data models.
- No dead imports or unused components.

Tests

- Pure filter/sort/pagination utilities covered if test tooling exists.
- Progress stat derivation covered if test tooling exists.
- Manual regression checklist completed if automated tests are not added.

Responsiveness

- Desktop, tablet, and mobile layouts checked.
- No horizontal overflow on mobile.
- Dialogs fit mobile viewport.
- Long titles/topics/company names do not break layout.
- Table/card actions remain usable on touch screens.

Accessibility

- Keyboard navigation works for nav, filters, dialogs, dropdowns, table actions.
- Focus states are visible.
- Dialogs have accessible titles.
- Icon-only buttons have labels/tooltips.
- Clickable spans are replaced or given proper semantics.
- Color contrast is acceptable.
- Loading/error/empty states are announced or readable.

Performance

- Large CSV list remains responsive.
- Filtering/sorting/pagination use memoized derived data.
- Avoid unnecessary refetches.
- Avoid excessive re-renders from unstable callback props.
- Consider virtualization only if pagination is insufficient.

Data And Regression

- Existing CSV fetch behavior preserved.
- Existing Firebase auth behavior preserved.
- Existing progress fields preserved.
- Existing solved/attempted/bookmarked/revision/notes behavior preserved.
- Firestore rules still match written data.
- Signed-out flow still works.
- Firebase-not-configured flow is clear.
- Activity heatmap still renders existing activity docs.

UX Quality

- Navigation is clear.
- Dashboard is useful immediately.
- Analytics page has meaningful stats.
- Favorites page has clear value.
- Filters are understandable and resettable.
- Loading, empty, and error states are polished.
- Micro-interactions are subtle and do not slow workflows.