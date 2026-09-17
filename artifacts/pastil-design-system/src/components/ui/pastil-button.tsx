import type { ButtonHTMLAttributes } from 'react';

export type PastilButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type PastilButtonSize = 'sm' | 'md';

export type PastilButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PastilButtonVariant;
  size?: PastilButtonSize;
};

const variants: Record<PastilButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--secondary))] hover:-translate-y-0.5',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5',
  outline: 'border border-border bg-card text-foreground hover:bg-muted',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
};

const sizes: Record<PastilButtonSize, string> = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-11 px-5 text-sm',
};

export function PastilButton({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: PastilButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}