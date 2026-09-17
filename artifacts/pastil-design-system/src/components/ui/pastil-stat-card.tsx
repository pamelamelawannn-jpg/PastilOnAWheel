import type { ComponentType } from 'react';

export type PastilStatTone = 'red' | 'yellow' | 'green' | 'cream';

type PastilStatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: PastilStatTone;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const tones: Record<PastilStatTone, string> = {
  red: 'bg-primary text-primary-foreground',
  yellow: 'bg-secondary text-secondary-foreground',
  green: 'bg-accent text-accent-foreground',
  cream: 'bg-card text-card-foreground',
};

export function PastilStatCard({
  label,
  value,
  detail,
  tone = 'cream',
  icon: Icon,
}: PastilStatCardProps) {
  return (
    <article
      className={`rounded-[22px] border border-border p-5 shadow-[var(--shadow-soft)] ${tones[tone]}`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[.14em] opacity-75">
          {label}
        </span>
        {Icon ? <Icon size={19} strokeWidth={2.2} /> : null}
      </div>
      <p className="font-data text-[1.65rem] font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs opacity-70">{detail}</p>
    </article>
  );
}