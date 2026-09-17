import { PastilButton } from '../../components/ui/pastil-button';
import { PastilField } from '../../components/ui/pastil-field';

export function PastilFieldDemo() {
  return (
    <div className="max-w-md rounded-[26px] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">Make it yours</p>
        <h2 className="mt-1 font-display text-2xl font-bold">Counter details</h2>
      </div>
      <div className="space-y-4">
        <PastilField label="Business name" defaultValue="Pastil on a Wheel" />
        <PastilField
          label="Apps Script URL"
          placeholder="https://script.google.com/macros/s/..."
          hint="Saved locally on this device."
        />
        <PastilButton className="w-full">Save details</PastilButton>
      </div>
    </div>
  );
}