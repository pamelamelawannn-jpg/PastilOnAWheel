import {
  PastilCard,
  PastilCardBody,
  PastilCardHeader,
  PastilCardTitle,
} from '../../components/ui/pastil-card';

export function PastilCardDemo() {
  return (
    <PastilCard>
      <PastilCardHeader>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
          Live ledger
        </p>
        <PastilCardTitle>Recent activity</PastilCardTitle>
      </PastilCardHeader>
      <PastilCardBody>
        {['Pastil rice · Quick sale', 'Cooking oil · Expense', 'Pastil jar · Manual entry'].map(
          (item, index) => (
            <div key={item} className="flex items-center gap-3 border-b border-border/70 py-3 last:border-0">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/50 text-primary">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">{item}</span>
              <span className="font-data text-sm font-bold text-accent">
                {index === 1 ? '-₱240' : '+₱50'}
              </span>
            </div>
          ),
        )}
      </PastilCardBody>
    </PastilCard>
  );
}