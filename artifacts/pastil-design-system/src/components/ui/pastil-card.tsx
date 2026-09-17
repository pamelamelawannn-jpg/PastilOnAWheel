import type { HTMLAttributes } from 'react';

export function PastilCard({
  className = '',
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`rounded-[26px] border border-border bg-card p-5 text-card-foreground shadow-[var(--shadow-soft)] md:p-6 ${className}`}
      {...props}
    />
  );
}

export function PastilCardHeader({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-5 ${className}`} {...props} />;
}

export function PastilCardTitle({
  className = '',
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`font-display text-2xl font-bold tracking-tight ${className}`}
      {...props}
    />
  );
}

export function PastilCardBody({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-3 ${className}`} {...props} />;
}