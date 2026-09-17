import { PastilHeader } from '../../components/ui/pastil-header';

export function PastilHeaderDemo() {
  return (
    <div className="rounded-[26px] border border-border bg-background p-5 md:p-7">
      <PastilHeader logoSrc={`${import.meta.env.BASE_URL}pastil-logo-512.png`} />
    </div>
  );
}