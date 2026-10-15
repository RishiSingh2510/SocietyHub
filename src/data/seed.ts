import { Db, Category, Status } from '../types';

const m = (id: string, name: string, flat: string, type: 'Owner' | 'Tenant', status: 'Active' | 'Pending') => ({ id, name, flat, type, phone: '', status });
const c = (id: string, flat: string, category: Category, amount: number, status: Status, date: string) => ({ id, flat, category, amount, status, date });
const e = (id: string, description: string, fund: 'Maintenance Fund' | 'Other Collection', amount: number, date: string) => ({ id, description, fund, amount, date });

export const SEED: Db = {
  society: 'Mahabali Apartment',
  members: [
    m('1', 'Rahul Sharma', 'A-101', 'Owner', 'Active'),
    m('2', 'Priya Verma', 'A-102', 'Tenant', 'Active'),
    m('3', 'Amit Gupta', 'B-201', 'Owner', 'Active'),
    m('4', 'Neha Singh', 'B-202', 'Tenant', 'Pending'),
    m('5', 'Saurabh Jain', 'C-203', 'Owner', 'Active'),
    m('6', 'Ritu Mehta', 'C-204', 'Tenant', 'Active'),
  ],
  collections: [
    c('c1', 'A-101', 'Maintenance', 3000, 'Paid', '2025-04-12'),
    c('c2', 'A-102', 'Maintenance', 3000, 'Pending', '2025-04-05'),
    c('c3', 'B-201', 'Maintenance', 3000, 'Paid', '2025-04-10'),
    c('c4', 'B-202', 'Maintenance', 3000, 'Overdue', '2025-04-05'),
    c('c5', 'C-203', 'Maintenance', 3000, 'Paid', '2025-04-09'),
    c('c6', 'C-204', 'Maintenance', 3000, 'Paid', '2025-04-08'),
    c('c7', 'B-201', 'Parking', 500, 'Paid', '2025-04-10'),
    c('c8', 'C-203', 'Event', 2000, 'Pending', '2025-04-08'),
  ],
  expenses: [
    e('e1', 'Lift AMC', 'Maintenance Fund', 12000, '2025-04-12'),
    e('e2', 'Electricity Bill', 'Maintenance Fund', 8500, '2025-04-05'),
    e('e3', 'Festival Celebration', 'Other Collection', 6000, '2025-03-28'),
    e('e4', 'Security Services', 'Maintenance Fund', 5500, '2025-03-20'),
  ],
};
