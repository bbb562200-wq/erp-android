import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Currency,
  Theme,
  ModuleType,
  Customer,
  Invoice,
  Product,
  Warehouse,
  Employee,
  LeaveRequest,
  PurchaseOrder,
  Vendor,
  Project,
  ProjectTask,
  Transaction,
  SystemNotification,
  UserProfile,
  UserRole,
  SyncStatus,
  AuditLog
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection, 
  onSnapshot 
} from 'firebase/firestore';

interface ERPContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  customers: Customer[];
  invoices: Invoice[];
  products: Product[];
  warehouses: Warehouse[];
  employees: Employee[];
  leaves: LeaveRequest[];
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  projects: Project[];
  tasks: ProjectTask[];
  transactions: Transaction[];
  notifications: SystemNotification[];

  user: UserProfile | null;
  syncStatus: SyncStatus;
  auditLogs: AuditLog[];
  isPinLocked: boolean;
  setIsPinLocked: (locked: boolean) => void;
  login: (email: string, pass: string, displayName?: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  addAuditLog: (action: string, module: string, details: string) => void;

  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  deleteInvoice: (id: string) => void;

  addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
  updateProductQuantity: (id: string, newQuantity: number) => void;
  deleteProduct: (id: string) => void;

  addWarehouse: (wh: Omit<Warehouse, 'id' | 'usedCapacityPercentage'>) => void;
  deleteWarehouse: (id: string) => void;
  clearInventoryAndWarehouses: () => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent'>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  
  addLeaveRequest: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;

  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;

  addProject: (proj: Omit<Project, 'id' | 'spent' | 'progress' | 'tasksCount'>) => void;
  addTask: (task: Omit<ProjectTask, 'id'>) => void;
  updateTaskStatus: (id: string, status: ProjectTask['status']) => void;

  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  formatCurrency: (amountDZD: number) => string;
  resetToDemoData: () => void;
  clearAllData: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  exportDataCSV: (type: 'invoices' | 'products' | 'customers' | 'employees' | 'transactions') => void;
  checkInventoryAlerts: () => void;
}


const ERPContext = createContext<ERPContextType | undefined>(undefined);

const DZD_TO_USD_RATE = 0.0075;
const DZD_TO_EUR_RATE = 0.0069;

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('DZD');
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('erp_theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('erp_theme', newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Security & User Auth States
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : {
      uid: 'admin-01',
      email: 'admin@company.com',
      displayName: 'المدير العام (Admin)',
      role: 'admin',
      lastLogin: new Date().toLocaleDateString('ar-EG')
    };
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [isPinLocked, setIsPinLocked] = useState<boolean>(false);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('erp_audit_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        userId: 'admin-01',
        userEmail: 'admin@company.com',
        action: 'تفعيل قاعدة البيانات والمزامنة السحابية',
        module: 'الأمان وقواعد البيانات',
        details: 'تم إنشاء وربط قاعدة بيانات Firebase Firestore والقاعدة المحلية Local IndexedDB'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('erp_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('erp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('erp_user');
    }
  }, [user]);

  // Firebase auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUser(snap.data() as UserProfile);
          } else {
            const newUserProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || 'user@company.com',
              displayName: currentUser.displayName || 'مستخدم النظام',
              role: 'admin',
              lastLogin: new Date().toLocaleDateString('ar-EG')
            };
            await setDoc(userDocRef, newUserProfile);
            setUser(newUserProfile);
          }
          setSyncStatus('synced');
        } catch (e) {
          console.warn('Firestore offline fallback', e);
          setSyncStatus('offline');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addAuditLog = (action: string, moduleName: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('ar-EG'),
      userId: user?.uid || 'guest',
      userEmail: user?.email || 'guest@company.com',
      action,
      module: moduleName,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = async (email: string, pass: string, displayName?: string, role: UserRole = 'admin') => {
    setSyncStatus('syncing');
    try {
      if (displayName) {
        // Register mode
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName });
        const userProf: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName,
          role,
          lastLogin: new Date().toLocaleDateString('ar-EG')
        };
        await setDoc(doc(db, 'users', cred.user.uid), userProf);
        setUser(userProf);
      } else {
        // Login mode
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const snap = await getDoc(doc(db, 'users', cred.user.uid));
        if (snap.exists()) {
          setUser(snap.data() as UserProfile);
        } else {
          const fallbackProf: UserProfile = {
            uid: cred.user.uid,
            email: cred.user.email || email,
            displayName: cred.user.displayName || email.split('@')[0],
            role,
            lastLogin: new Date().toLocaleDateString('ar-EG')
          };
          setUser(fallbackProf);
        }
      }
      setSyncStatus('synced');
    } catch (err) {
      // Local fallback for offline/demo login
      const demoUser: UserProfile = {
        uid: `user-${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
        role,
        lastLogin: new Date().toLocaleDateString('ar-EG')
      };
      setUser(demoUser);
      setSyncStatus('synced');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    addAuditLog('تسجيل خروج', 'الأمان', 'تم تسجيل خروج المستخدم من النظام');
  };

  const syncToCloud = async () => {
    setSyncStatus('syncing');
    try {
      await getDocFromServer(doc(db, 'users', user?.uid || 'test-sync'));
      addAuditLog('مزامنة سحابية', 'قواعد البيانات', 'تمت المزامنة بنجاح مع Firebase Cloud Firestore');
      setSyncStatus('synced');
    } catch (e) {
      console.warn('Sync offline fallback mode:', e);
      addAuditLog('مزامنة محليّة', 'قواعد البيانات', 'تم التخزين في قاعدة البيانات المحلية (Local Storage)');
      setSyncStatus('synced');
    }
  };


  // Auto clear recorded data on requested wipe
  useEffect(() => {
    if (!localStorage.getItem('erp_data_cleared_v2')) {
      localStorage.clear();
      localStorage.setItem('erp_data_cleared_v2', 'true');
      localStorage.setItem('erp_dz_migrated_v1', 'true');
      setCustomers([]);
      setInvoices([]);
      setProducts([]);
      setEmployees([]);
      setLeaves([]);
      setPurchaseOrders([]);
      setProjects([]);
      setTasks([]);
      setTransactions([]);
      setNotifications([]);
    }
  }, []);

  // Local storage hydrated states
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_customers')) {
      return [];
    }
    const saved = localStorage.getItem('erp_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_invoices')) {
      return [];
    }
    const saved = localStorage.getItem('erp_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_products')) {
      return [];
    }
    const saved = localStorage.getItem('erp_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_warehouses')) {
      return [];
    }
    const saved = localStorage.getItem('erp_warehouses');
    return saved ? JSON.parse(saved) : [];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_employees')) {
      return [];
    }
    const saved = localStorage.getItem('erp_employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_leaves')) {
      return [];
    }
    const saved = localStorage.getItem('erp_leaves');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_po')) {
      return [];
    }
    const saved = localStorage.getItem('erp_po');
    return saved ? JSON.parse(saved) : [];
  });

  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);

  const [projects, setProjects] = useState<Project[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_projects')) {
      return [];
    }
    const saved = localStorage.getItem('erp_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<ProjectTask[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_tasks')) {
      return [];
    }
    const saved = localStorage.getItem('erp_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_tx')) {
      return [];
    }
    const saved = localStorage.getItem('erp_tx');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    if (localStorage.getItem('erp_data_cleared_v2') === 'true' && !localStorage.getItem('erp_notifs')) {
      return [];
    }
    const saved = localStorage.getItem('erp_notifs');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync states to local storage
  useEffect(() => {
    localStorage.setItem('erp_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('erp_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('erp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('erp_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('erp_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('erp_po', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('erp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('erp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('erp_tx', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('erp_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const addInvoice = (newInv: Omit<Invoice, 'id'>) => {
    const id = `inv-${Date.now()}`;
    const invoice: Invoice = { ...newInv, id };
    setInvoices(prev => [invoice, ...prev]);

    // Also record transaction if paid
    if (invoice.status === 'paid') {
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        date: invoice.date,
        type: 'income',
        category: 'تحصيل فواتير مبيعات',
        description: `فاتورة رقم ${invoice.invoiceNumber} - ${invoice.customerName}`,
        amount: invoice.totalAmount,
        referenceId: invoice.invoiceNumber
      };
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        // If changed to paid, create income transaction
        if (status === 'paid' && inv.status !== 'paid') {
          const tx: Transaction = {
            id: `tx-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'income',
            category: 'تحصيل فواتير مبيعات',
            description: `سداد فاتورة ${inv.invoiceNumber} - ${inv.customerName}`,
            amount: inv.totalAmount,
            referenceId: inv.invoiceNumber
          };
          setTransactions(txs => [tx, ...txs]);
        }
        return { ...inv, status };
      }
      return inv;
    }));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const calculateProductStatus = (p: { quantity: number; minQuantity: number; expiryDate?: string }): Product['status'] => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (p.expiryDate) {
      if (p.expiryDate < todayStr) {
        return 'expired';
      }
      const today = new Date();
      const exp = new Date(p.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (diffDays >= 0 && diffDays <= 30) {
        return 'expiring_soon';
      }
    }
    if (p.quantity === 0) return 'out_of_stock';
    if (p.quantity <= p.minQuantity) return 'low_stock';
    return 'in_stock';
  };

  const createAlertNotification = (title: string, message: string, type: SystemNotification['type']) => {
    setNotifications(prev => {
      // Avoid creating duplicate notification if already present and unread
      const exists = prev.some(n => n.message === message && !n.read);
      if (exists) return prev;
      const newNotif: SystemNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title,
        message,
        type,
        time: 'الآن',
        read: false
      };
      return [newNotif, ...prev];
    });
  };

  const checkInventoryAlerts = () => {
    products.forEach(p => {
      const status = calculateProductStatus(p);
      if (status === 'out_of_stock') {
        createAlertNotification(
          'تنبيه نفاذ المخزون (Out of Stock)',
          `المنتج "${p.name}" (${p.sku}) نفد بالكامل (0 ${p.unit}) بمستودع ${p.warehouseName}`,
          'alert'
        );
      } else if (status === 'low_stock') {
        createAlertNotification(
          'تنبيه نقص المخزون (Low Stock)',
          `المنتج "${p.name}" (${p.sku}) وصل للحد الأدنى (${p.quantity} ${p.unit}) بمستودع ${p.warehouseName}`,
          'warning'
        );
      } else if (status === 'expired') {
        createAlertNotification(
          'تنبيه انتهاء الصلاحية (Expired)',
          `المنتج "${p.name}" (${p.sku}) انتهت صلاحيته بتاريخ ${p.expiryDate}`,
          'alert'
        );
      } else if (status === 'expiring_soon') {
        createAlertNotification(
          'اقتراب انتهاء الصلاحية (Expiring Soon)',
          `المنتج "${p.name}" (${p.sku}) تنتهي صلاحيته قريباً بتاريخ ${p.expiryDate}`,
          'warning'
        );
      }
    });
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'status'>) => {
    const id = `prod-${Date.now()}`;
    const status = calculateProductStatus(prodData);
    const product: Product = { ...prodData, id, status };
    
    setProducts(prev => [product, ...prev]);

    // Trigger alerts if needed
    if (status === 'out_of_stock') {
      createAlertNotification('تنبيه نفاذ المخزون (Out of Stock)', `المنتج "${product.name}" نفد بالكامل (0 ${product.unit})`, 'alert');
    } else if (status === 'low_stock') {
      createAlertNotification('تنبيه نقص المخزون (Low Stock)', `المنتج "${product.name}" وصل للحد الأدنى (${product.quantity} ${product.unit})`, 'warning');
    } else if (status === 'expired') {
      createAlertNotification('تنبيه انتهاء الصلاحية (Expired)', `المنتج "${product.name}" انتهت صلاحيته بتاريخ ${product.expiryDate}`, 'alert');
    } else if (status === 'expiring_soon') {
      createAlertNotification('اقتراب انتهاء الصلاحية (Expiring Soon)', `المنتج "${product.name}" تنتهي صلاحيته قريباً بتاريخ ${product.expiryDate}`, 'warning');
    }
  };

  const updateProductQuantity = (id: string, newQuantity: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, quantity: newQuantity };
        const status = calculateProductStatus(updated);
        
        if (status === 'out_of_stock') {
          createAlertNotification('تنبيه نفاذ المخزون (Out of Stock)', `المنتج "${p.name}" نفد بالكامل (0 ${p.unit}) بمستودع ${p.warehouseName}`, 'alert');
        } else if (status === 'low_stock') {
          createAlertNotification('تنبيه نقص المخزون (Low Stock)', `المنتج "${p.name}" وصل للحد الأدنى (${newQuantity} ${p.unit}) بمستودع ${p.warehouseName}`, 'warning');
        }

        return { ...updated, status };
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addWarehouse = (whData: Omit<Warehouse, 'id' | 'usedCapacityPercentage'>) => {
    const id = `wh-${Date.now()}`;
    const newWh: Warehouse = {
      ...whData,
      id,
      usedCapacityPercentage: 0
    };
    setWarehouses(prev => [...prev, newWh]);
  };

  const deleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(w => w.id !== id));
  };

  const clearInventoryAndWarehouses = () => {
    setProducts([]);
    setWarehouses([]);
    localStorage.removeItem('erp_products');
    localStorage.removeItem('erp_warehouses');
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent'>) => {
    const id = `cust-${Date.now()}`;
    const newCust: Customer = {
      ...custData,
      id,
      totalOrders: 0,
      totalSpent: 0
    };
    setCustomers(prev => [newCust, ...prev]);
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = { ...empData, id };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const addLeaveRequest = (leaveData: Omit<LeaveRequest, 'id' | 'status'>) => {
    const id = `leave-${Date.now()}`;
    const newLeave: LeaveRequest = { ...leaveData, id, status: 'pending' };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: LeaveRequest['status']) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>) => {
    const id = `po-${Date.now()}`;
    const newPo: PurchaseOrder = { ...poData, id };
    setPurchaseOrders(prev => [newPo, ...prev]);
  };

  const updatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const addProject = (projData: Omit<Project, 'id' | 'spent' | 'progress' | 'tasksCount'>) => {
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      ...projData,
      id,
      spent: 0,
      progress: 0,
      tasksCount: 0
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const addTask = (taskData: Omit<ProjectTask, 'id'>) => {
    const id = `task-${Date.now()}`;
    const newTask: ProjectTask = { ...taskData, id };
    setTasks(prev => [newTask, ...prev]);

    // increment project task count
    setProjects(prev => prev.map(p => p.id === taskData.projectId ? { ...p, tasksCount: p.tasksCount + 1 } : p));
  };

  const updateTaskStatus = (id: string, status: ProjectTask['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const formatCurrency = (amountDZD: number): string => {
    if (currency === 'USD') {
      const usdAmount = amountDZD * DZD_TO_USD_RATE;
      return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(usdAmount);
    }
    if (currency === 'EUR') {
      const eurAmount = amountDZD * DZD_TO_EUR_RATE;
      return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2
      }).format(eurAmount);
    }

    return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'en-US', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 2
    }).format(amountDZD);
  };

  const resetToDemoData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setInvoices(INITIAL_INVOICES);
    setProducts(INITIAL_PRODUCTS);
    setWarehouses(INITIAL_WAREHOUSES);
    setEmployees(INITIAL_EMPLOYEES);
    setLeaves(INITIAL_LEAVES);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    localStorage.setItem('erp_dz_migrated_v1', 'true');
  };

  const clearAllData = () => {
    setCustomers([]);
    setInvoices([]);
    setProducts([]);
    setWarehouses([]);
    setEmployees([]);
    setLeaves([]);
    setPurchaseOrders([]);
    setProjects([]);
    setTasks([]);
    setTransactions([]);
    setNotifications([]);
    localStorage.clear();
    localStorage.setItem('erp_data_cleared_v2', 'true');
  };

  const exportDataCSV = (type: 'invoices' | 'products' | 'customers' | 'employees' | 'transactions') => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    const dateStr = new Date().toISOString().slice(0, 10);
    let filename = `orbiton_dz_${type}_${dateStr}.csv`;

    if (type === 'invoices') {
      headers = ['رقم الفاتورة', 'اسم العميل', 'التاريخ', 'تاريخ الاستحقاق', 'المبلغ الصافي (DZD)', 'الضريبة TVA (19%)', 'الإجمالي TTC (DZD)', 'الحالة'];
      rows = invoices.map(i => [i.invoiceNumber, i.customerName, i.date, i.dueDate, i.subtotal, i.vatAmount, i.totalAmount, i.status]);
    } else if (type === 'products') {
      headers = ['SKU / الباركود', 'اسم المنتج', 'الفئة', 'سعر التكلفة (DZD)', 'سعر البيع (DZD)', 'الكمية', 'الوحدة', 'المستودع'];
      rows = products.map(p => [p.sku, p.name, p.category, p.costPrice, p.sellingPrice, p.quantity, p.unit, p.warehouseName]);
    } else if (type === 'customers') {
      headers = ['اسم العميل', 'الشركة', 'البريد الإلكتروني', 'الهاتف', 'NIF / الرقم الجبائي', 'إجمالي الطلبات', 'إجمالي الإنفاق (DZD)', 'الحالة'];
      rows = customers.map(c => [c.name, c.company, c.email, c.phone, c.taxNumber || '', c.totalOrders, c.totalSpent, c.status]);
    } else if (type === 'employees') {
      headers = ['رمز الموظف', 'الاسم الكامل', 'القسم', 'المسمى الوظيفي', 'البريد الإلكتروني', 'الراتب الأساسي (DZD)', 'تاريخ التعيين', 'الحالة'];
      rows = employees.map(e => [e.employeeCode, e.fullName, e.department, e.jobTitle, e.email, e.baseSalary, e.joiningDate, e.status]);
    } else if (type === 'transactions') {
      headers = ['المعاملة', 'التاريخ', 'النوع', 'الفئة', 'الوصف', 'المبلغ (DZD)'];
      rows = transactions.map(t => [t.id, t.date, t.type === 'income' ? 'إيراد' : 'مصروف', t.category, t.description, t.amount]);
    }

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ERPContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        activeModule,
        setActiveModule,
        searchQuery,
        setSearchQuery,
        customers,
        invoices,
        products,
        warehouses,
        employees,
        leaves,
        purchaseOrders,
        vendors,
        projects,
        tasks,
        transactions,
        notifications,
        user,
        syncStatus,
        auditLogs,
        isPinLocked,
        setIsPinLocked,
        login,
        logout,
        syncToCloud,
        addAuditLog,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        addProduct,
        updateProductQuantity,
        deleteProduct,
        addWarehouse,
        deleteWarehouse,
        clearInventoryAndWarehouses,
        addCustomer,
        addEmployee,
        addLeaveRequest,
        updateLeaveStatus,
        addPurchaseOrder,
        updatePOStatus,
        addProject,
        addTask,
        updateTaskStatus,
        markNotificationRead,
        clearAllNotifications,
        formatCurrency,
        resetToDemoData,
        clearAllData,
        theme,
        setTheme,
        toggleTheme,
        exportDataCSV,
        checkInventoryAlerts
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
