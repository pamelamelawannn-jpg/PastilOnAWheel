import { Guidelines } from './parts';

export function BrandLogoPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full border-2 border-primary bg-card p-2 shadow-[6px_6px_0_hsl(var(--secondary))]">
            <img
              src={`${import.meta.env.BASE_URL}pastil-logo-512.png`}
              alt="Pastil on a Wheel logo"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">Primary mark</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Circular, warm, recognizable</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Use the supplied Pastil logo as the brand anchor. The tracker frames it in a
              circular berry outline with a saffron offset, keeping the mark legible at small sizes.
            </p>
          </div>
        </div>
      </section>
      <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
        <h2 className="font-display text-xl font-bold">Logo guidance</h2>
        <div className="mt-4">
          <Guidelines
            items={[
              { kind: 'do', text: 'Keep the mark inside a circular frame when it acts as the app or counter identity.' },
              { kind: 'do', text: 'Pair the logo with the business name and the small “Daily counter” descriptor in the tracker header.' },
              { kind: 'dont', text: 'Do not redraw, crop, or replace the supplied logo with a generic food or finance icon.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

export function ContentVoicePage() {
  return (
    <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">Content</p>
      <h2 className="mt-2 font-display text-3xl font-bold">Warm, direct, operational</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The tracker speaks like a trusted counter partner: short labels, friendly encouragement,
        and clear action language that keeps the next tap obvious.
      </p>
      <div className="mt-6">
        <Guidelines
          items={[
            { kind: 'do', text: 'Use concise, human labels such as “Record a sale”, “Keep it honest”, and “One tap, done”.' },
            { kind: 'do', text: 'Pair a clear operational instruction with a short explanation when the action saves immediately.' },
            { kind: 'dont', text: 'Avoid corporate dashboard language, long helper paragraphs, or unexplained accounting terms.' },
          ]}
        />
      </div>
    </section>
  );
}

export function MotionPage() {
  return (
    <section className="rounded-[26px] border border-border bg-card p-6 text-card-foreground">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">Motion</p>
      <h2 className="mt-2 font-display text-3xl font-bold">Small, useful feedback</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Motion confirms an action without competing with the counter workflow: cards rise in,
        buttons give a short press response, and saved messages appear briefly near the thumb zone.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Rise in', 'Page content enters with a short 10px lift.'],
          ['Pulse warm', 'Product buttons compress briefly on tap.'],
          ['Toast in', 'Confirmation rises into view, then clears.'],
        ].map(([name, text]) => (
          <div key={name} className="rounded-2xl bg-muted/60 p-4">
            <p className="font-display text-lg font-bold">{name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}