# Pastil Tracker component inventory

This source-backed inventory is extracted from the existing Pastil Tracker app. The source uses local React functions rather than a separate component package, so the first pass promotes the most reusable visual families into the design-system package. App-specific pages, product data, and storage behavior remain in the tracker.

| Family | Reference | Dependencies / blockers | Evidence | Chunk | Status |
| --- | --- | --- | --- | --- | --- |
| Header | `components/header.md` | Logo asset; token theme | `AppShell` header, lines 79–99 | Pilot | implemented |
| Button | `components/button.md` | Token theme | Action links and buttons throughout `App.tsx` | Pilot | implemented |
| Card | `components/card.md` | Token theme | Overview, ledger, settings, and modal surfaces | Pilot | implemented |
| Stat card | `components/stat-card.md` | Card tokens; optional icon | `StatCard`, lines 122–125 | Pilot | implemented |
| Field | `components/field.md` | Input tokens | `FieldLabel` and `.field`, lines 199 and `index.css` lines 111–122 | Pilot | implemented |
| Bottom navigation | `components/bottom-navigation.md` | Link/router behavior stays app-owned | `AppShell` bottom nav, lines 101–108 | Later | pending |
| Toast | `components/toast.md` | Timer/lifecycle behavior stays app-owned | `Toast`, lines 117–120; motion classes in `index.css` | Later | pending |
| Product tile | `components/product-tile.md` | Product imagery and sale state | `Clicker`, lines 145–151 | Later | pending |
| Empty state | `components/empty-state.md` | App-specific action routing | `EmptyState`, lines 154–155 | Later | pending |

## Chunk plan

The pilot contains the five reusable families that establish the visual language: Header, Button, Card, Stat card, and Field. The later chunk keeps the remaining app patterns available for a follow-up pass without changing the tracker until the user explicitly asks to apply the system.