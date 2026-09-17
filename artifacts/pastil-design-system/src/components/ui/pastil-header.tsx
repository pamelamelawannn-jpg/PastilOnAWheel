import type { HTMLAttributes } from 'react';

type PastilHeaderProps = HTMLAttributes<HTMLElement> & {
  logoSrc: string;
  businessName?: string;
  status?: string;
};

export function PastilHeader({
  logoSrc,
  businessName = 'Pastil on a Wheel',
  status = 'Local only',
  className = '',
  ...props
}: PastilHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between gap-4 border-b border-border pb-4 ${className}`}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-primary bg-card p-0.5 shadow-[4px_4px_0_hsl(var(--secondary))]">
          <img
            src={logoSrc}
            alt="Pastil on a Wheel logo"
            className="h-full w-full rounded-full object-cover"
          />
        </span>
        <span className="min-w-0">
          <strong className="block truncate font-display text-[1.2rem] font-bold leading-none">
            {businessName}
          </strong>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
            Daily counter
          </span>
        </span>
      </div>
      <span className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-bold text-muted-foreground shadow-sm">
        <span className="h-2 w-2 rounded-full bg-secondary" />
        {status}
      </span>
    </header>
  );
}