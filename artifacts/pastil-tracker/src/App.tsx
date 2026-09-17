import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Download,
  FileText,
  Home,
  Package,
  Plus,
  Receipt,
  RotateCcw,
  Save,
  Settings2,
  ShoppingBag,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import jarImage from '@assets/JAR_1789649331292.jpg';
import riceImage from '@assets/RICE_1789649331293.jpg';
import NotFound from '@/pages/not-found';
import { ErrorBoundary } from '@/components/error-boundary';

type Product = { id: string; name: string; shortLabel: string; price: number; image: string; accent: string };
type Sale = { id: string; productId: string; productName: string; unitPrice: number; timestamp: string; source: 'clicker' | 'manual' };
type Expense = { id: string; category: string; amount: number; note: string; timestamp: string };
type AppSettings = { businessName: string; syncUrl: string; lastSyncedAt: string | null };

const defaultProducts: Product[] = [
  { id: 'rice', name: 'Pastil rice', shortLabel: 'Rice', price: 50, image: riceImage, accent: 'saffron' },
  { id: 'jar', name: 'Pastil jar', shortLabel: 'Jar', price: 200, image: jarImage, accent: 'chili' },
  { id: 'retail', name: 'Pastil jar retail', shortLabel: 'Retail', price: 170, image: jarImage, accent: 'teal' },
];
const expenseCategories = ['chicken', 'cooking oil', 'soy sauce', 'vinegar', 'vegetables', 'sporks', 'cups and lids', 'paperbag', 'tissue', 'rent', 'apartment rent', 'remittance', 'utilities'];
const money = (amount: number) => `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().slice(0, 10);
const timeLabel = (stamp: string) => new Date(stamp).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
const dateLabel = (stamp: string) => new Date(stamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function readStore<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch { return fallback; }
}

function useLocalStore() {
  const [products, setProducts] = useState<Product[]>(() => readStore('pastil-products', defaultProducts));
  const [sales, setSales] = useState<Sale[]>(() => readStore('pastil-sales', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => readStore('pastil-expenses', []));
  const [settings, setSettings] = useState<AppSettings>(() => readStore('pastil-settings', { businessName: 'Pastil on a Wheel', syncUrl: '', lastSyncedAt: null }));
  const save = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));
  const addSale = (product: Product, source: Sale['source'] = 'clicker') => {
    const sale: Sale = { id: id('sale'), productId: product.id, productName: product.name, unitPrice: product.price, timestamp: new Date().toISOString(), source };
    setSales((current) => { const next = [sale, ...current]; save('pastil-sales', next); return next; });
    return sale;
  };
  const addExpense = (category: string, amount: number, note: string, timestamp: string) => {
    const expense: Expense = { id: id('expense'), category, amount, note, timestamp: new Date(`${timestamp}T${new Date().toTimeString().slice(0, 8)}`).toISOString() };
    setExpenses((current) => { const next = [expense, ...current]; save('pastil-expenses', next); return next; });
  };
  const deleteSale = (saleId: string) => setSales((current) => { const next = current.filter((sale) => sale.id !== saleId); save('pastil-sales', next); return next; });
  const deleteExpense = (expenseId: string) => setExpenses((current) => { const next = current.filter((expense) => expense.id !== expenseId); save('pastil-expenses', next); return next; });
  const updateProduct = (productId: string, price: number) => setProducts((current) => { const next = current.map((product) => product.id === productId ? { ...product, price } : product); save('pastil-products', next); return next; });
  const updateSettings = (nextSettings: AppSettings) => { setSettings(nextSettings); save('pastil-settings', nextSettings); };
  const reset = () => {
    [ 'pastil-products', 'pastil-sales', 'pastil-expenses', 'pastil-settings' ].forEach((key) => localStorage.removeItem(key));
    setProducts(defaultProducts); setSales([]); setExpenses([]); setSettings({ businessName: 'Pastil on a Wheel', syncUrl: '', lastSyncedAt: null });
  };
  return { products, sales, expenses, settings, addSale, addExpense, deleteSale, deleteExpense, updateProduct, updateSettings, reset };
}

function AppShell({ children, settings }: { children: ReactNode; settings: AppSettings }) {
  const [location] = useLocation();
  const navItems = [
    { href: '/', label: 'Today', icon: Home, test: 'link-nav-today' },
    { href: '/clicker', label: 'Clicker', icon: CircleDollarSign, test: 'link-nav-clicker' },
    { href: '/sales', label: 'Sales', icon: BarChart3, test: 'link-nav-sales' },
    { href: '/expenses', label: 'Expenses', icon: Receipt, test: 'link-nav-expenses' },
    { href: '/settings', label: 'Settings', icon: Settings2, test: 'link-nav-settings' },
  ];
  return (
    <div className="grain min-h-[100dvh] bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pb-3 pt-6 md:px-8 md:pt-8">
        <Link href="/" data-testid="link-brand" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--secondary))]"><Utensils size={19} strokeWidth={2.5} /></span>
          <span><span className="block font-display text-[1.2rem] font-bold leading-none">{settings.businessName}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Daily counter</span></span>
        </Link>
        <div data-testid="status-local-state" className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-bold text-muted-foreground shadow-sm">
          <span className={`h-2 w-2 rounded-full ${settings.lastSyncedAt ? 'bg-accent' : 'bg-secondary'}`} />
          {settings.lastSyncedAt ? 'Synced' : 'Local only'}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-6 md:px-8">{children}</main>
      <nav data-testid="nav-bottom" className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {navItems.map(({ href, label, icon: Icon, test }) => {
            const active = location === href;
            return <Link key={href} href={href} data-testid={test} className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition-all ${active ? 'bg-primary text-primary-foreground shadow-[0_5px_16px_rgba(126,37,47,.22)]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon size={20} strokeWidth={active ? 2.6 : 2} /><span>{label}</span></Link>;
          })}
        </div>
      </nav>
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p>}<h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1></div>{action}</div>;
}

function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return <button data-testid="toast-message" onClick={onClose} className="toast-in fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-4 py-3 text-xs font-bold text-background shadow-xl"><Check size={15} className="text-secondary" />{message}<X size={14} className="ml-1 opacity-60" /></button>;
}

function StatCard({ label, value, detail, tone = 'cream', icon: Icon }: { label: string; value: string; detail: string; tone?: string; icon: typeof CircleDollarSign }) {
  const toneClass = tone === 'red' ? 'bg-primary text-primary-foreground' : tone === 'green' ? 'bg-accent text-accent-foreground' : tone === 'yellow' ? 'bg-secondary text-secondary-foreground' : 'bg-card';
  return <div data-testid={`stat-${label.toLowerCase()}`} className={`rounded-[22px] border border-border p-5 shadow-[var(--shadow-soft)] ${toneClass}`}><div className="mb-8 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.14em] opacity-75">{label}</span><Icon size={19} strokeWidth={2.2} /></div><p className="font-data text-[1.65rem] font-bold tracking-tight">{value}</p><p className="mt-1 text-xs opacity-70">{detail}</p></div>;
}

function Overview({ sales, expenses, products }: { sales: Sale[]; expenses: Expense[]; products: Product[] }) {
  const [, setLocation] = useLocation();
  const todaySales = useMemo(() => sales.filter((sale) => sale.timestamp.slice(0, 10) === today()), [sales]);
  const todayExpenses = useMemo(() => expenses.filter((expense) => expense.timestamp.slice(0, 10) === today()), [expenses]);
  const revenue = todaySales.reduce((sum, sale) => sum + sale.unitPrice, 0);
  const spend = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recent = [...todaySales.map((sale) => ({ type: 'sale' as const, time: sale.timestamp, title: sale.productName, amount: sale.unitPrice, source: sale.source })), ...todayExpenses.map((expense) => ({ type: 'expense' as const, time: expense.timestamp, title: expense.category, amount: expense.amount, source: 'expense' }))].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
  const counts = products.map((product) => ({ ...product, count: todaySales.filter((sale) => sale.productId === product.id).length }));
  return <div className="safe-bottom animate-rise">
    <div className="mb-7 mt-5 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-primary">{new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}</p><h1 className="max-w-xl font-display text-[2.5rem] font-bold leading-[.98] tracking-tight md:text-6xl">Keep the wheel<br /><span className="text-primary">turning.</span></h1></div><Link href="/clicker" data-testid="link-start-selling" className="group flex w-fit items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[5px_5px_0_hsl(var(--secondary))] transition-transform hover:-translate-y-0.5">Record a sale <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"><StatCard label="Sales" value={money(revenue)} detail={`${todaySales.length} item${todaySales.length === 1 ? '' : 's'} today`} tone="red" icon={ShoppingBag} /><StatCard label="Expenses" value={money(spend)} detail={`${todayExpenses.length} logged today`} tone="yellow" icon={Receipt} /><StatCard label="Profit" value={money(revenue - spend)} detail="Sales minus expenses" tone="green" icon={ArrowUpRight} /><StatCard label="Items" value={String(todaySales.length)} detail="Across 3 products" tone="cream" icon={Package} /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Product pulse</p><h2 className="mt-1 font-display text-2xl font-bold">What moved today</h2></div><Link href="/clicker" data-testid="link-product-pulse" className="text-xs font-bold text-primary">Open clicker <ChevronRight size={14} className="inline" /></Link></div><div className="space-y-3">{counts.map((product) => <div key={product.id} data-testid={`row-product-pulse-${product.id}`} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3"><img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover" style={{ objectPosition: product.id === 'rice' ? 'center 68%' : 'center 72%' }} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="text-xs text-muted-foreground">{money(product.price)} each</p></div><span className="font-data text-lg font-bold text-primary">{product.count}<small className="ml-1 font-sans text-[10px] font-bold text-muted-foreground">sold</small></span></div>)}</div></section>
      <section className="rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Live ledger</p><h2 className="mt-1 font-display text-2xl font-bold">Recent activity</h2></div><button data-testid="button-refresh-overview" onClick={() => setLocation('/sales')} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><RotateCcw size={16} /></button></div>{recent.length === 0 ? <EmptyState icon={FileText} title="Nothing logged yet" body="Your first click will show up here." action="Start recording" onAction={() => setLocation('/clicker')} /> : <div className="space-y-1">{recent.map((item, index) => <div key={`${item.time}-${index}`} data-testid={`row-recent-${index}`} className="flex items-center gap-3 border-b border-border/70 py-3 last:border-0"><span className={`grid h-9 w-9 place-items-center rounded-xl ${item.type === 'sale' ? 'bg-secondary/50 text-primary' : 'bg-muted text-muted-foreground'}`}>{item.type === 'sale' ? <ShoppingBag size={16} /> : <Receipt size={16} />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold capitalize">{item.title}</p><p className="text-[11px] text-muted-foreground">{timeLabel(item.time)} · {item.source === 'clicker' ? 'Quick sale' : item.source === 'manual' ? 'Manual entry' : 'Expense'}</p></div><span className={`font-data text-sm font-bold ${item.type === 'sale' ? 'text-accent' : 'text-muted-foreground'}`}>{item.type === 'sale' ? '+' : '-'}{money(item.amount)}</span></div>)}</div>}</section>
    </div>
  </div>;
}

function Clicker({ products, onSale, onToast }: { products: Product[]; onSale: (product: Product) => void; onToast: (message: string) => void }) {
  const [lastSale, setLastSale] = useState<string | null>(null);
  const click = (product: Product) => { onSale(product); setLastSale(product.id); onToast(`${product.name} saved`); window.setTimeout(() => setLastSale(null), 420); };
  return <div className="safe-bottom animate-rise"><div className="mb-7 mt-5 flex items-end justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-primary">One tap, done</p><h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Sales clicker</h1><p className="mt-2 max-w-sm text-sm text-muted-foreground">Tap what left the counter. Every tap saves to your sales log instantly.</p></div><div className="hidden rounded-2xl border border-border bg-card p-3 text-right shadow-sm sm:block"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today</p><p className="font-data text-xl font-bold text-primary">LIVE</p></div></div>
    <div className="grid gap-4 md:grid-cols-3">{products.map((product) => <button key={product.id} data-testid={`button-product-${product.id}`} onClick={() => click(product)} className={`click-feedback group relative min-h-[270px] overflow-hidden rounded-[26px] border border-border text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${lastSale === product.id ? 'ring-4 ring-secondary' : ''}`}><img src={product.image} alt={`${product.name} product`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: product.id === 'rice' ? 'center 66%' : 'center 70%' }} /><span className="absolute inset-0 bg-gradient-to-t from-[rgba(35,19,22,.88)] via-[rgba(35,19,22,.12)] to-transparent" /><span className="relative flex h-full flex-col justify-end p-5 text-primary-foreground"><span className="mb-auto flex items-center justify-between"><span className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-sm">{product.shortLabel}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">{lastSale === product.id ? <Check size={18} /> : <CircleDollarSign size={18} />}</span></span><span className="font-display text-2xl font-bold">{product.name}</span><span className="mt-1 font-data text-lg font-bold text-secondary">{money(product.price)}</span></span></button>)}</div>
    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/45 text-primary"><Check size={17} /></span><p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Instant save.</strong> No separate submit step. Review or correct entries anytime in <Link href="/sales" data-testid="link-clicker-sales" className="font-bold text-primary underline underline-offset-2">Sales</Link>.</p></div>
  </div>;
}

function EmptyState({ icon: Icon, title, body, action, onAction }: { icon: typeof FileText; title: string; body: string; action?: string; onAction?: () => void }) {
  return <div data-testid="empty-state" className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/35 px-5 py-10 text-center"><span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-secondary/55 text-primary"><Icon size={19} /></span><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">{body}</p>{action && onAction && <button data-testid="button-empty-action" onClick={onAction} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">{action}</button>}</div>;
}

function SalesPage({ sales, products, onSale, onDelete, onToast }: { sales: Sale[]; products: Product[]; onSale: (product: Product, source?: Sale['source']) => void; onDelete: (sale: Sale) => void; onToast: (message: string) => void }) {
  const [showManual, setShowManual] = useState(false);
  const [filter, setFilter] = useState<'all' | 'clicker' | 'manual'>('all');
  const visible = sales.filter((sale) => filter === 'all' || sale.source === filter);
  const manualSale = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = products.find((item) => item.id === form.get('product'));
    if (!product) return;
    onSale(product, 'manual'); onToast('Manual sale saved'); setShowManual(false);
  };
  return <div className="safe-bottom animate-rise"><SectionHeading eyebrow="The ledger" title="Sales log" action={<button data-testid="button-open-manual-sale" onClick={() => setShowManual(true)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm"><Plus size={15} /> Manual sale</button>} /><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{(['all', 'clicker', 'manual'] as const).map((value) => <button key={value} data-testid={`button-filter-${value}`} onClick={() => setFilter(value)} className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition-colors ${filter === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}>{value === 'all' ? 'All entries' : value}</button>)}</div>{visible.length === 0 ? <EmptyState icon={ShoppingBag} title="Your log is clear" body="Sales recorded with the clicker will appear here." action="Open clicker" onAction={() => { window.location.href = '/clicker'; }} /> : <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-[var(--shadow-soft)]"><div className="hidden grid-cols-[1fr_110px_100px_40px] border-b border-border bg-muted/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:grid"><span>Product</span><span>When</span><span>Source</span><span /></div>{visible.map((sale) => <div key={sale.id} data-testid={`row-sale-${sale.id}`} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/70 px-4 py-4 last:border-0 sm:grid-cols-[1fr_110px_100px_40px] sm:px-5"><div className="flex min-w-0 items-center gap-3"><img src={products.find((product) => product.id === sale.productId)?.image} alt="" className="h-10 w-10 rounded-xl object-cover" style={{ objectPosition: sale.productId === 'rice' ? 'center 66%' : 'center 70%' }} /><div className="min-w-0"><p className="truncate text-sm font-bold">{sale.productName}</p><p className="text-[11px] text-muted-foreground">{dateLabel(sale.timestamp)} · {timeLabel(sale.timestamp)}</p></div></div><p className="font-data text-sm font-bold text-accent">{money(sale.unitPrice)}</p><span className="hidden w-fit rounded-full bg-secondary/40 px-2 py-1 text-[10px] font-bold capitalize text-primary sm:inline-block">{sale.source}</span><button data-testid={`button-delete-sale-${sale.id}`} onClick={() => onDelete(sale)} className="justify-self-end rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={15} /></button></div>)}</div>}{showManual && <Modal title="Add a manual sale" onClose={() => setShowManual(false)}><form onSubmit={manualSale} className="space-y-4"><FieldLabel label="Product"><select data-testid="select-manual-product" name="product" required className="field"><option value="">Choose a product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {money(product.price)}</option>)}</select></FieldLabel><button data-testid="button-save-manual-sale" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Save sale</button></form></Modal>}</div>;
}

function ExpensesPage({ expenses, onAdd, onDelete, onToast }: { expenses: Expense[]; onAdd: (category: string, amount: number, note: string, date: string) => void; onDelete: (expense: Expense) => void; onToast: (message: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(expenseCategories[0]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const amount = Number(form.get('amount')); const note = String(form.get('note') || ''); const date = String(form.get('date')); if (!amount || amount <= 0 || !date) return; onAdd(category, amount, note, date); onToast('Expense saved'); setShowForm(false); };
  return <div className="safe-bottom animate-rise"><SectionHeading eyebrow="Keep it honest" title="Expenses" action={<button data-testid="button-open-expense-form" onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm"><Plus size={15} /> Add expense</button>} /><div className="mb-5 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-border bg-secondary/50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">All time spend</p><p className="mt-2 font-data text-2xl font-bold text-primary">{money(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</p></div><div className="rounded-2xl border border-border bg-card p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Entries</p><p className="mt-2 font-data text-2xl font-bold">{expenses.length}</p></div></div>{expenses.length === 0 ? <EmptyState icon={Receipt} title="No expenses yet" body="Log ingredients, rent, and the small things that keep the wheel moving." action="Log an expense" onAction={() => setShowForm(true)} /> : <div className="space-y-2">{expenses.map((expense) => <div key={expense.id} data-testid={`row-expense-${expense.id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-primary"><Receipt size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold capitalize">{expense.category}</p><p className="truncate text-[11px] text-muted-foreground">{expense.note || 'No note'} · {dateLabel(expense.timestamp)}</p></div><span className="font-data text-sm font-bold text-primary">-{money(expense.amount)}</span><button data-testid={`button-delete-expense-${expense.id}`} onClick={() => onDelete(expense)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={15} /></button></div>)}</div>}{showForm && <Modal title="Log an expense" onClose={() => setShowForm(false)}><form onSubmit={submit} className="space-y-4"><FieldLabel label="Category"><select data-testid="select-expense-category" value={category} onChange={(event) => setCategory(event.target.value)} className="field">{expenseCategories.map((item) => <option value={item} key={item}>{item}</option>)}</select></FieldLabel><FieldLabel label="Amount"><input data-testid="input-expense-amount" name="amount" type="number" min="1" step="0.01" placeholder="0.00" required className="field" /></FieldLabel><FieldLabel label="Date"><input data-testid="input-expense-date" name="date" type="date" defaultValue={today()} required className="field" /></FieldLabel><FieldLabel label="Note (optional)"><input data-testid="input-expense-note" name="note" placeholder="e.g. market run" className="field" /></FieldLabel><button data-testid="button-save-expense" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Save expense</button></form></Modal>}</div>;
}

function SettingsPage({ products, settings, onProductUpdate, onSettingsUpdate, onReset, onToast }: { products: Product[]; settings: AppSettings; onProductUpdate: (id: string, price: number) => void; onSettingsUpdate: (settings: AppSettings) => void; onReset: () => void; onToast: (message: string) => void }) {
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [syncUrl, setSyncUrl] = useState(settings.syncUrl);
  const [saved, setSaved] = useState(false);
  const saveSettings = () => { onSettingsUpdate({ ...settings, businessName: businessName.trim() || 'Pastil on a Wheel', syncUrl: syncUrl.trim() }); setSaved(true); onToast('Settings saved locally'); window.setTimeout(() => setSaved(false), 1800); };
  const exportCsv = () => {
    const sales = readStore<Sale[]>('pastil-sales', []);
    const expenses = readStore<Expense[]>('pastil-expenses', []);
    const rows = [['type', 'name/category', 'amount', 'timestamp', 'source'], ...sales.map((sale) => ['sale', sale.productName, String(sale.unitPrice), sale.timestamp, sale.source]), ...expenses.map((expense) => ['expense', expense.category, String(expense.amount), expense.timestamp, expense.note])];
    const blob = new Blob([rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `pastil-tracker-${today()}.csv`; link.click(); URL.revokeObjectURL(link.href); onToast('CSV export downloaded');
  };
  return <div className="safe-bottom animate-rise"><SectionHeading eyebrow="Make it yours" title="Settings" /><div className="space-y-5">
    <section className="rounded-[24px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6"><div className="mb-5 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/55 text-primary"><Settings2 size={18} /></span><div><h2 className="font-display text-xl font-bold">Counter details</h2><p className="text-xs text-muted-foreground">This stays on this device.</p></div></div><div className="space-y-4"><FieldLabel label="Business name"><input data-testid="input-business-name" value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="field" /></FieldLabel><button data-testid="button-save-settings" onClick={saveSettings} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">{saved ? <Check size={16} /> : <Save size={16} />}{saved ? 'Saved' : 'Save details'}</button></div></section>
    <section className="rounded-[24px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6"><div className="mb-5 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Package size={18} /></span><div><h2 className="font-display text-xl font-bold">Products & prices</h2><p className="text-xs text-muted-foreground">The clicker uses these prices.</p></div></div><div className="space-y-2">{products.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3"><img src={product.image} alt="" className="h-11 w-11 rounded-xl object-cover" style={{ objectPosition: product.id === 'rice' ? 'center 66%' : 'center 70%' }} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="text-[11px] text-muted-foreground">Product button</p></div><div className="flex items-center gap-1 rounded-xl border border-border bg-card px-2"><span className="font-data text-xs text-muted-foreground">₱</span><input data-testid={`input-price-${product.id}`} aria-label={`${product.name} price`} type="number" min="1" value={product.price} onChange={(event) => onProductUpdate(product.id, Number(event.target.value) || 0)} className="w-16 bg-transparent py-2 text-right font-data text-sm font-bold outline-none" /></div></div>)}</div></section>
    <section className="rounded-[24px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6"><div className="mb-5 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/55 text-primary"><Cloud size={18} /></span><div><h2 className="font-display text-xl font-bold">Backup & sync</h2><p className="text-xs text-muted-foreground">Bring your Google Apps Script endpoint when ready.</p></div></div><FieldLabel label="Google Apps Script web app URL"><input data-testid="input-sync-url" value={syncUrl} onChange={(event) => setSyncUrl(event.target.value)} placeholder="https://script.google.com/macros/s/..." className="field" /></FieldLabel><div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${settings.lastSyncedAt ? 'bg-accent' : 'bg-secondary'}`} /><span>{settings.lastSyncedAt ? `Last synced ${dateLabel(settings.lastSyncedAt)} at ${timeLabel(settings.lastSyncedAt)}.` : syncUrl ? 'URL saved locally. Sync connection is not active yet.' : 'Local only. Add a URL to prepare for a future sync.'}</span></div><div className="mt-4 flex gap-2"><button data-testid="button-save-sync-url" onClick={saveSettings} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-xs font-bold"><Save size={15} /> Save URL</button><button data-testid="button-export-csv" onClick={exportCsv} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-xs font-bold text-accent-foreground"><Download size={15} /> Export CSV</button></div></section>
    <section className="rounded-[24px] border border-destructive/25 bg-destructive/5 p-5 md:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive"><Trash2 size={18} /></span><div className="flex-1"><h2 className="font-display text-xl font-bold">Clear local data</h2><p className="mt-1 text-xs text-muted-foreground">Delete sales, expenses, prices, and settings from this device.</p></div><button data-testid="button-reset-data" onClick={() => { if (window.confirm('Clear all Pastil Tracker data from this device?')) { onReset(); onToast('Local data cleared'); } }} className="rounded-xl border border-destructive/30 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground">Reset</button></div></section>
  </div></div>;
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</span>{children}</label>; }
function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) { return <div data-testid="modal" className="fixed inset-0 z-50 grid place-items-end bg-foreground/35 p-3 sm:place-items-center"><div className="w-full max-w-md rounded-[26px] border border-border bg-card p-5 shadow-2xl sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-2xl font-bold">{title}</h2><button data-testid="button-close-modal" onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted"><X size={18} /></button></div>{children}</div></div>; }

function Router() {
  const store = useLocalStore();
  const [toast, setToast] = useState<string | null>(null);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2600); };
  const askDelete = (label: string, remove: () => void) => { if (window.confirm(`Delete ${label}? This cannot be undone.`)) { remove(); notify('Entry deleted'); } };
  return <AppShell settings={store.settings}><Switch><Route path="/"><Overview sales={store.sales} expenses={store.expenses} products={store.products} /></Route><Route path="/clicker"><Clicker products={store.products} onSale={(product) => store.addSale(product)} onToast={notify} /></Route><Route path="/sales"><SalesPage sales={store.sales} products={store.products} onSale={(product, source) => store.addSale(product, source)} onDelete={(sale) => askDelete(sale.productName, () => store.deleteSale(sale.id))} onToast={notify} /></Route><Route path="/expenses"><ExpensesPage expenses={store.expenses} onAdd={store.addExpense} onDelete={(expense) => askDelete(expense.category, () => store.deleteExpense(expense.id))} onToast={notify} /></Route><Route path="/settings"><SettingsPage products={store.products} settings={store.settings} onProductUpdate={store.updateProduct} onSettingsUpdate={store.updateSettings} onReset={store.reset} onToast={notify} /></Route><Route component={NotFound} /></Switch><Toast message={toast} onClose={() => setToast(null)} /></AppShell>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router /></ErrorBoundary></WouterRouter>;
}

export default App;