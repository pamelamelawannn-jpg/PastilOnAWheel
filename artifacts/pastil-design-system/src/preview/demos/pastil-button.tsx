import { PastilButton } from '../../components/ui/pastil-button';

export function PastilButtonDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-[26px] border border-border bg-card p-6">
        <div>
          <h2 className="font-display text-xl font-bold">Button treatments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Primary actions carry the berry brand color and a small saffron offset.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PastilButton>Record a sale</PastilButton>
          <PastilButton variant="secondary">Secondary</PastilButton>
          <PastilButton variant="outline">Save URL</PastilButton>
          <PastilButton variant="ghost" size="sm">Cancel</PastilButton>
        </div>
      </div>
    </div>
  );
}