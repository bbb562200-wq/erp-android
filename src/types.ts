export type Language = 'ar' | 'en';
export type Currency = 'DZD' | 'USD' | 'EUR';
export type Theme = 'dark' | 'light';

export type ModuleType = 
  | 'dashboard'
  | 'finance'
  | 'sales'
  | 'inventory'
  | 'purchasing'
  | 'hr'
  | 'projects'
  | 'ai-advisor';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  taxNumber?: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number; // 15%
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  paymentMethod?: string;
  notes?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameEn: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minQuantity: number;
  warehouseId: string;
  warehouseName: string;
  unit: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'expiring_soon';
  expiryDate?: string; // YYYY-MM-DD
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  totalCapacity: number;
  usedCapacityPercentage: number;
}

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  joiningDate: string;
  baseSalary: number;
  status: 'active' | 'on_leave' | 'terminated';
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'unpaid' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  vendorEmail: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  itemsCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  progress: number; // 0 to 100
  tasksCount: number;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  referenceId?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  time: string;
  read: boolean;
}

export type UserRole = 'admin' | 'manager' | 'staff';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  lastLogin?: string;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
}

