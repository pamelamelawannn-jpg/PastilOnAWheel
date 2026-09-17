import type { InputHTMLAttributes, ReactNode } from 'react';

type PastilFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
};

export function PastilField({
  label,
  hint,
  className = '',
  ...props
}: PastilFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted-foreground">
        {label}
      </span>
      <input
        className={`field ${className}`}
        {...props}
      />
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}