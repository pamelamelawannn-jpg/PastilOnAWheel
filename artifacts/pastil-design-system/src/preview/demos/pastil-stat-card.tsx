import { ArrowUpRight, Package, Receipt, ShoppingBag } from 'lucide-react';
import { PastilStatCard } from '../../components/ui/pastil-stat-card';

export function PastilStatCardDemo() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <PastilStatCard label="Sales" value="₱2,450" detail="18 items today" tone="red" icon={ShoppingBag} />
      <PastilStatCard label="Expenses" value="₱540" detail="4 logged today" tone="yellow" icon={Receipt} />
      <PastilStatCard label="Profit" value="₱1,910" detail="Sales minus expenses" tone="green" icon={ArrowUpRight} />
      <PastilStatCard label="Items" value="18" detail="Across 3 products" tone="cream" icon={Package} />
    </div>
  );
}