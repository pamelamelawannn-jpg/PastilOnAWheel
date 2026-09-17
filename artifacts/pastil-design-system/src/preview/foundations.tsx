import { ArrowUpRight, Package, Receipt, ShoppingBag } from 'lucide-react';
import { PastilButton } from '../components/ui/pastil-button';
import { PastilCard, PastilCardBody, PastilCardHeader, PastilCardTitle } from '../components/ui/pastil-card';
import { PastilField } from '../components/ui/pastil-field';
import { PastilStatCard } from '../components/ui/pastil-stat-card';
import { PastilHeader } from '../components/ui/pastil-header';
import { Guidelines } from './parts';

const CORE_SWATCHES = [
  { name: 'Berry / primary', className: 'bg-primary' },
  { name: 'Saffron / secondary', className: 'bg-secondary' },
  { name: 'Leaf / accent', className: 'bg-accent' },
] as const;

const SUPPORTING_SWATCHES = [
  { name: 'Warm paper', className: 'border bg-background' },
  { name: 'Card cream', className: 'border bg-card' },
  { name: 'Muted sand', className: 'bg-muted' },
  { name: 'Deep berry text', className: 'bg-foreground' },
  { name: 'Destructive', className: 'bg-destructive' },
] as const;

const TYPE_SCALE = [
  { label: 'Display', className: 'font-display text-5xl font-bold leading-none', text: 'Keep the wheel turning.' },
  { label: 'Heading', className: 'font-display text-2xl font-bold', text: 'What moved today' },
  { label: 'Body', className: 'text-base leading-relaxed', text: 'Tap what left the counter.' },
  { label: 'Label', className: 'text-xs font-bold uppercase tracking-[.16em]', text: 'Product pulse' },
  { label: 'Data', className: 'font-data text-2xl font-bold', text: '₱2,450' },
] as const;

const SPACING_SCALE = [
  { label: '4', className: 'w-4' },
  { label: '8', className: 'w-8' },
  { label: '12', className: 'w-12' },
  { label: '16', className: 'w-16' },
  { label: '24', className: 'w-24' },
] as const;

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-16 rounded-2xl ${className}`} />
      <p className="text-xs font-bold">{name}</p>
    </div>
  );
}

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-border bg-card p-5 text-card-foreground shadow-[var(--shadow-soft)] md:p-7">
        <PastilHeader logoSrc={`${import.meta.env.BASE_URL}pastil-logo-512.png`} />
        <div className="mt-7 grid gap-7 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-primary">Source-backed system</p>
            <h2 className="max-w-xl font-display text-[2.6rem] font-bold leading-[.98] tracking-tight md:text-6xl">
              Keep the wheel<br /><span className="text-primary">turning.</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              This system extracts the current Pastil Tracker look before any screen migration:
              warm paper surfaces, berry actions, practical typography, and fast counter feedback.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PastilButton>Record a sale <ArrowUpRight size={16} /></PastilButton>
              <PastilButton variant="outline">Review the ledger</PastilButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PastilStatCard label="Sales" value="₱2,450" detail="18 items today" tone="red" icon={ShoppingBag} />
            <PastilStatCard label="Expenses" value="₱540" detail="4 logged today" tone="yellow" icon={Receipt} />
            <PastilStatCard label="Profit" value="₱1,910" detail="Sales minus expenses" tone="green" icon={ArrowUpRight} />
            <PastilStatCard label="Items" value="18" detail="Across 3 products" tone="cream" icon={Package} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <PastilCard>
          <PastilCardHeader>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Foundations</p>
            <PastilCardTitle>Warm, clear, compact</PastilCardTitle>
          </PastilCardHeader>
          <PastilCardBody>
            <div className="grid grid-cols-3 gap-3">
              {CORE_SWATCHES.map((swatch) => <Swatch key={swatch.name} {...swatch} />)}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use color to separate quick actions, secondary context, and positive business states,
              not to decorate every surface.
            </p>
          </PastilCardBody>
        </PastilCard>
        <PastilCard>
          <PastilCardHeader>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Pilot field</p>
            <PastilCardTitle>Make it yours</PastilCardTitle>
          </PastilCardHeader>
          <PastilCardBody>
            <PastilField label="Business name" defaultValue="Pastil on a Wheel" />
            <p className="text-xs text-muted-foreground">The extracted field treatment stays concise and local-first.</p>
          </PastilCardBody>
        </PastilCard>
      </div>

      <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
        <h2 className="font-display text-xl font-bold">Composition guidance</h2>
        <div className="mt-4">
          <Guidelines
            items={[
              { kind: 'do', text: 'Make the next counter action obvious with a berry primary button and short copy.' },
              { kind: 'do', text: 'Let warm card surfaces, display headlines, and mono values establish hierarchy.' },
              { kind: 'dont', text: 'Do not change the existing tracker screens yet; this package is the extracted source of truth for a later decision.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div className="space-y-8 rounded-[26px] border border-border bg-card p-6 text-card-foreground">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Brand colors</h2>
          <p className="mt-1 text-sm text-muted-foreground">Berry, saffron, and leaf map directly to the tracker’s action language.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">{CORE_SWATCHES.map((swatch) => <Swatch key={swatch.name} {...swatch} />)}</div>
      </section>
      <section className="space-y-4 border-t border-border/70 pt-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Surfaces and semantics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Warm paper, card cream, muted sand, deep berry text, and clear danger.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">{SUPPORTING_SWATCHES.map((swatch) => <Swatch key={swatch.name} {...swatch} />)}</div>
      </section>
    </div>
  );
}

export function FontsPage() {
  return (
    <div className="space-y-8 rounded-[26px] border border-border bg-card p-6 text-card-foreground">
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">Type family</p>
        <h2 className="mt-2 font-display text-4xl font-bold">Fraunces meets DM Sans</h2>
        <p className="mt-2 text-sm text-muted-foreground">Fraunces carries warmth in headlines; DM Sans keeps tasks readable; Space Mono makes money and counts scan quickly.</p>
      </section>
      <section className="space-y-4 border-t border-border/70 pt-6">
        {TYPE_SCALE.map((entry) => (
          <div key={entry.label} className="grid gap-2 sm:grid-cols-[90px_1fr]">
            <span className="pt-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{entry.label}</span>
            <p className={entry.className}>{entry.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export function LayoutPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
        <h2 className="font-display text-2xl font-bold">Spacing rhythm</h2>
        <p className="mt-1 text-sm text-muted-foreground">A four-pixel base step expands into compact controls and generous section gaps.</p>
        <div className="mt-6 space-y-4">
          {SPACING_SCALE.map((space) => (
            <div key={space.label} className="flex items-center gap-4">
              <span className="w-8 font-data text-xs text-muted-foreground">{space.label}</span>
              <div className={`h-3 rounded-full bg-primary ${space.className}`} />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
        <h2 className="font-display text-2xl font-bold">Surface language</h2>
        <p className="mt-1 text-sm text-muted-foreground">Cards are soft and friendly; controls are compact and thumb-ready.</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Control', className: 'rounded-xl' },
            { label: 'Card', className: 'rounded-[22px]' },
            { label: 'Panel', className: 'rounded-[26px]' },
            { label: 'Brand mark', className: 'rounded-full' },
          ].map((radius) => (
            <div key={radius.label} className={`flex h-24 items-end border bg-muted p-3 ${radius.className}`}>
              <span className="text-xs font-bold">{radius.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}