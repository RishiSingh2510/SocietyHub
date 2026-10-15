import { Db, FundName, Status } from './types';

export const rs = (n: number): string => '₹' + Math.round(n).toString().replace(/\B(?=(\d{2})*\d{3}(?!\d))/g, ',');
export const uid = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const today = (): string => new Date().toISOString().slice(0, 10);
const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (d: string): string => { const [y, m, dd] = d.split('-'); return `${+dd} ${M[+m - 1]} ${y}`; };
export const validDate = (d: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
const sum = (a: { amount: number }[]) => a.reduce((x, y) => x + y.amount, 0);

export const stats = (db: Db) => {
  const paid = db.collections.filter((c) => c.status === 'Paid');
  const maintIn = sum(paid.filter((c) => c.category === 'Maintenance'));
  const otherIn = sum(paid.filter((c) => c.category !== 'Maintenance'));
  const maintExp = sum(db.expenses.filter((e) => e.fund === 'Maintenance Fund'));
  const otherExp = sum(db.expenses.filter((e) => e.fund === 'Other Collection'));
  return {
    maintIn, otherIn, maintExp, otherExp, exp: maintExp + otherExp, collected: maintIn + otherIn,
    net: maintIn + otherIn - maintExp - otherExp, maintBal: maintIn - maintExp, otherBal: otherIn - otherExp,
    pending: sum(db.collections.filter((c) => c.status !== 'Paid')),
    maintPending: sum(db.collections.filter((c) => c.category === 'Maintenance' && c.status !== 'Paid')),
  };
};

// ---------- month-wise helpers ----------
export const EXPENSE_CATEGORIES = ['Security', 'Electricity', 'Lift & AMC', 'Cleaning', 'Repairs', 'Salaries', 'Events', 'Other'];
export const DUE_DAY = 10; // maintenance is overdue after the 10th of its month
export const monthKey = (d: Date = new Date()): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
export const shiftMonth = (k: string, n: number): string => { const [y, m] = k.split('-').map(Number); return monthKey(new Date(y, m - 1 + n, 1)); };
export const monthLabel = (k: string): string => { const [y, m] = k.split('-'); return `${M[+m - 1]} ${y}`; };
export const monthShort = (k: string): string => M[+k.split('-')[1] - 1];
export const validMonth = (m: string): boolean => /^\d{4}-(0[1-9]|1[0-2])$/.test(m);
// A Pending bill past its due date shows as Overdue.
export const effStatus = (c: { status: Status; month: string }): Status =>
  c.status === 'Pending' && today() > `${c.month}-${String(DUE_DAY).padStart(2, '0')}` ? 'Overdue' : c.status;

export const monthStats = (db: Db, m: string) => {
  const inM = db.collections.filter((c) => c.month === m);
  const maint = inM.filter((c) => c.category === 'Maintenance');
  const exp = db.expenses.filter((e) => e.date.slice(0, 7) === m);
  const billed = sum(maint), maintIn = sum(maint.filter((c) => c.status === 'Paid'));
  const otherIn = sum(inM.filter((c) => c.category !== 'Maintenance' && c.status === 'Paid'));
  const maintExp = sum(exp.filter((e) => e.fund === 'Maintenance Fund')), otherExp = sum(exp.filter((e) => e.fund === 'Other Collection'));
  const opening = sum(db.collections.filter((c) => c.month < m && c.status === 'Paid')) - sum(db.expenses.filter((e) => e.date.slice(0, 7) < m));
  return {
    billed, maintIn, maintDue: billed - maintIn, otherIn, maintExp, otherExp, exp: maintExp + otherExp, income: maintIn + otherIn,
    opening, closing: opening + maintIn + otherIn - maintExp - otherExp,
    arrears: sum(db.collections.filter((c) => c.category === 'Maintenance' && c.month < m && c.status !== 'Paid')),
    pct: billed ? Math.round((maintIn / billed) * 100) : 0,
  };
};
export const fundBalance = (db: Db, fund: FundName, upto: string): number =>
  sum(db.collections.filter((c) => c.status === 'Paid' && c.month <= upto && (c.category === 'Maintenance') === (fund === 'Maintenance Fund')))
  - sum(db.expenses.filter((e) => e.fund === fund && e.date.slice(0, 7) <= upto));