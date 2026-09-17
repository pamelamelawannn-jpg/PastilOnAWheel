import { lazy, type ComponentType } from 'react';
import {
  BrandLogoPage,
  ContentVoicePage,
  MotionPage,
} from './pastil-pages';
import {
  ColorsPage,
  FontsPage,
  LayoutPage,
  OverviewPage,
} from './foundations';

function lazyPage(load: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await load() }));
}

const PastilHeaderDemo = lazyPage(() =>
  import('./demos/pastil-header').then(({ PastilHeaderDemo }) => PastilHeaderDemo),
);
const PastilButtonDemo = lazyPage(() =>
  import('./demos/pastil-button').then(({ PastilButtonDemo }) => PastilButtonDemo),
);
const PastilCardDemo = lazyPage(() =>
  import('./demos/pastil-card').then(({ PastilCardDemo }) => PastilCardDemo),
);
const PastilStatCardDemo = lazyPage(() =>
  import('./demos/pastil-stat-card').then(({ PastilStatCardDemo }) => PastilStatCardDemo),
);
const PastilFieldDemo = lazyPage(() =>
  import('./demos/pastil-field').then(({ PastilFieldDemo }) => PastilFieldDemo),
);

export type PreviewEntry = {
  id: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export type NavGroup = {
  name: string;
  entries: PreviewEntry[];
};

export const DESIGN_SYSTEM = {
  title: 'Pastil Tracker Design System',
  description:
    'A warm, practical visual language for Pastil on a Wheel: quick counter actions, clear ledger patterns, and a recognizable food-business mark.',
} as const;

export const OVERVIEW_ENTRY: PreviewEntry = {
  id: 'overview',
  name: 'Overview',
  description: 'The visual foundations and source-backed pilot components.',
  Page: OverviewPage,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Brand',
    entries: [
      {
        id: 'brand-logo',
        name: 'Logo',
        description: 'The supplied Pastil mark and its circular tracker frame.',
        Page: BrandLogoPage,
      },
    ],
  },
  {
    name: 'Colors',
    entries: [
      {
        id: 'color-roles',
        name: 'Color roles',
        description: 'Berry, saffron, leaf, surface, text, and semantic colors.',
        Page: ColorsPage,
      },
    ],
  },
  {
    name: 'Fonts',
    entries: [
      {
        id: 'type-scale',
        name: 'Type scale',
        description: 'DM Sans, Fraunces, Space Mono, and operational hierarchy.',
        Page: FontsPage,
      },
    ],
  },
  {
    name: 'Layout',
    entries: [
      {
        id: 'spacing-radius',
        name: 'Spacing and radius',
        description: 'The four-pixel rhythm and soft surface treatments.',
        Page: LayoutPage,
      },
    ],
  },
  {
    name: 'Components',
    entries: [
      {
        id: 'component-header',
        name: 'Header',
        description: 'Brand mark, business name, and local/synced status.',
        Page: PastilHeaderDemo,
      },
      {
        id: 'component-button',
        name: 'Button',
        description: 'Primary, secondary, outline, and quiet actions.',
        Page: PastilButtonDemo,
      },
      {
        id: 'component-card',
        name: 'Card',
        description: 'Warm surfaces for ledgers, settings, and summaries.',
        Page: PastilCardDemo,
      },
      {
        id: 'component-stat-card',
        name: 'Stat card',
        description: 'Tonal summary cards with mono numeric emphasis.',
        Page: PastilStatCardDemo,
      },
      {
        id: 'component-field',
        name: 'Field',
        description: 'Compact labeled inputs for counter details and sync.',
        Page: PastilFieldDemo,
      },
    ],
  },
  {
    name: 'Content',
    entries: [
      {
        id: 'content-voice',
        name: 'Voice and tone',
        description: 'Warm, direct, operational copy guidance.',
        Page: ContentVoicePage,
      },
    ],
  },
  {
    name: 'Motion',
    entries: [
      {
        id: 'motion-patterns',
        name: 'Motion patterns',
        description: 'Small, useful feedback for page entry, press, and saves.',
        Page: MotionPage,
      },
    ],
  },
];

export const ALL_ENTRIES: PreviewEntry[] = [
  OVERVIEW_ENTRY,
  ...NAV_GROUPS.flatMap((group) => group.entries),
];

const duplicateIds = ALL_ENTRIES.map((entry) => entry.id).filter(
  (id, index, ids) => ids.indexOf(id) !== index,
);
if (duplicateIds.length > 0) {
  throw new Error(
    `Duplicate preview page id(s): ${[...new Set(duplicateIds)].join(', ')}`,
  );
}