import { 
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
  SystemNotification
} from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'شركة الجزائر للحلول التقنية والبرمجة',
    company: 'الجزائر للتقنية SARL',
    email: 'contact@dz-techsolutions.dz',
    phone: '+213 21 65 43 21',
    taxNumber: '001916012345678',
    address: 'شارع ديدوش مراد، الجزائر العاصمة، الجمهورية الجزائرية',
    totalOrders: 18,
    totalSpent: 4500000,
    status: 'active'
  },
  {
    id: 'cust-2',
    name: 'مؤسسة السافانا للتجارة والتوزيع',
    company: 'مؤسسة السافانا EURL',
    email: 'commercial@savana-trade.dz',
    phone: '+213 41 23 90 80',
    taxNumber: '002031098765432',
    address: 'حي وهران الجديدة، وهران، الجزائر',
    totalOrders: 12,
    totalSpent: 2850000,
    status: 'active'
  },
  {
    id: 'cust-3',
    name: 'مجمع الأوراس للتجهيزات الصناعية',
    company: 'الأوراس هولدينغ SPA',
    email: 'contact@auras-group.dz',
    phone: '+213 31 88 77 66',
    taxNumber: '001825055544433',
    address: 'المنطقة الصناعية عين سمارة، قسنطينة، الجزائر',
    totalOrders: 8,
    totalSpent: 1920000,
    status: 'active'
  },
  {
    id: 'cust-4',
    name: 'شركة الهضاب للتوزيع والخدمات',
    company: 'الهضاب ش.ذ.م.م',
    email: 'sales@hidhab-dz.com',
    phone: '+213 36 92 11 00',
    taxNumber: '002119077788899',
    address: 'شارع 8 ماي 1945، سطيف، الجزائر',
    totalOrders: 4,
    totalSpent: 840000,
    status: 'active'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cust-1',
    customerName: 'شركة الجزائر للحلول التقنية والبرمجة',
    date: '2026-07-20',
    dueDate: '2026-08-20',
    items: [
      { id: 'item-1', description: 'تراخيص برمجيات المؤسسة السنوية (ERP Enterprise Licenses)', quantity: 10, unitPrice: 120000, total: 1200000 },
      { id: 'item-2', description: 'خدمات الإعداد والتهيئة السحابية بالجزائر العاصمة', quantity: 1, unitPrice: 300000, total: 300000 }
    ],
    subtotal: 1500000,
    vatAmount: 285000, // 19% TVA in Algeria
    totalAmount: 1785000,
    status: 'paid',
    paymentMethod: 'تحويل بنكي - البنك الوطني الجزائري BNA',
    notes: 'تم استلام الدفعة بالكامل بحساب BNA مع الشكر.'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2026-002',
    customerId: 'cust-2',
    customerName: 'مؤسسة السافانا للتجارة والتوزيع',
    date: '2026-07-22',
    dueDate: '2026-08-22',
    items: [
      { id: 'item-3', description: 'خوادم تخزين ومعالجة SAN Storage Servers', quantity: 2, unitPrice: 420000, total: 840000 },
      { id: 'item-4', description: 'دعم فني وضمان لمدة سنة كاملة', quantity: 1, unitPrice: 110000, total: 110000 }
    ],
    subtotal: 950000,
    vatAmount: 180500, // 19% TVA
    totalAmount: 1130500,
    status: 'pending',
    notes: 'تاريخ الاستحقاق خلال 30 يوماً من تاريخ الفاتورة.'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-2026-003',
    customerId: 'cust-3',
    customerName: 'مجمع الأوراس للتجهيزات الصناعية',
    date: '2026-06-15',
    dueDate: '2026-07-15',
    items: [
      { id: 'item-5', description: 'استشارات أمن المعلومات والشبكات بالمركز الرئيسي', quantity: 40, unitPrice: 15500, total: 620000 }
    ],
    subtotal: 620000,
    vatAmount: 117800, // 19% TVA
    totalAmount: 737800,
    status: 'overdue',
    notes: 'فاتورة متأخرة - تم إرسال تذكير بالسداد للمدير المالي.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'HW-SRV-01',
    name: 'خادم معالجة بيانات Enterprise Server R750',
    nameEn: 'Enterprise Server R750 Processor',
    category: 'الأجهزة والحواسيب Hardware',
    costPrice: 350000,
    sellingPrice: 520000,
    quantity: 14,
    minQuantity: 5,
    warehouseId: 'wh-1',
    warehouseName: 'المستودع المركزي - الجزائر العاصمة',
    unit: 'قطعة',
    status: 'in_stock',
    expiryDate: '2028-12-31'
  },
  {
    id: 'prod-2',
    sku: 'SW-ERP-PRO',
    name: 'ترخيص نظام ERP للشركات والمؤسسات',
    nameEn: 'ERP Pro Suite License',
    category: 'البرمجيات Software',
    costPrice: 60000,
    sellingPrice: 120000,
    quantity: 150,
    minQuantity: 20,
    warehouseId: 'wh-1',
    warehouseName: 'المستودع المركزي - الجزائر العاصمة',
    unit: 'ترخيص',
    status: 'in_stock',
    expiryDate: '2027-06-30'
  },
  {
    id: 'prod-3',
    sku: 'NET-SW-48P',
    name: 'موزع شبكة 48 منفذ PoE Switch Managed',
    nameEn: '48 Port PoE Managed Switch',
    category: 'الشبكات Networking',
    costPrice: 85000,
    sellingPrice: 135000,
    quantity: 3,
    minQuantity: 10,
    warehouseId: 'wh-2',
    warehouseName: 'مستودع الغرب - وهران',
    unit: 'جهاز',
    status: 'low_stock',
    expiryDate: '2026-08-15'
  },
  {
    id: 'prod-4',
    sku: 'SEC-FW-100',
    name: 'جدار حماية أمني Next-Gen Firewall',
    nameEn: 'Next-Gen Security Firewall',
    category: 'الأمان والتشفير Security',
    costPrice: 210000,
    sellingPrice: 320000,
    quantity: 8,
    minQuantity: 4,
    warehouseId: 'wh-1',
    warehouseName: 'المستودع المركزي - الجزائر العاصمة',
    unit: 'جهاز',
    status: 'in_stock',
    expiryDate: '2028-01-01'
  },
  {
    id: 'prod-5',
    sku: 'ACC-UPS-3K',
    name: 'مزود طاقة لا ينقطع 3000VA UPS',
    nameEn: 'Uninterruptible Power Supply 3000VA',
    category: 'الملحقات Power Accessories',
    costPrice: 45000,
    sellingPrice: 72000,
    quantity: 0,
    minQuantity: 5,
    warehouseId: 'wh-2',
    warehouseName: 'مستودع الغرب - وهران',
    unit: 'وحدة',
    status: 'out_of_stock'
  },
  {
    id: 'prod-6',
    sku: 'CHM-CLN-500',
    name: 'محلول تنظيف وإزالة أتربة الأجهزة الإلكترونية',
    nameEn: 'Electronic Cleaner Solution 500ml',
    category: 'المواد والكيماويات Materials',
    costPrice: 1200,
    sellingPrice: 2400,
    quantity: 25,
    minQuantity: 10,
    warehouseId: 'wh-1',
    warehouseName: 'المستودع المركزي - الجزائر العاصمة',
    unit: 'عبوة',
    status: 'expiring_soon',
    expiryDate: '2026-08-05'
  },
  {
    id: 'prod-7',
    sku: 'MED-KIT-EXP',
    name: 'حقيبة إسعافات أولية وضمادات طبية للمستودع',
    nameEn: 'First Aid Emergency Kit',
    category: 'مستلزمات السلامة Safety',
    costPrice: 4500,
    sellingPrice: 7500,
    quantity: 6,
    minQuantity: 3,
    warehouseId: 'wh-1',
    warehouseName: 'المستودع المركزي - الجزائر العاصمة',
    unit: 'حقيبة',
    status: 'expired',
    expiryDate: '2026-05-10'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'المستودع المركزي - الجزائر العاصمة',
    location: 'المنطقة الصناعية وادي السمار، الجزائر العاصمة',
    manager: 'مهندس / أمين بلقاسم',
    totalCapacity: 5000,
    usedCapacityPercentage: 68
  },
  {
    id: 'wh-2',
    name: 'مستودع الإقليم الغربي - وهران',
    location: 'المنطقة الصناعية السانية، وهران',
    manager: 'عبدالقادر زروال',
    totalCapacity: 3000,
    usedCapacityPercentage: 42
  },
  {
    id: 'wh-3',
    name: 'مستودع الشرق - قسنطينة',
    location: 'عين سمارة، قسنطينة',
    manager: 'كريم بن علي',
    totalCapacity: 2500,
    usedCapacityPercentage: 35
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    employeeCode: 'EMP-001',
    fullName: 'م. أمين بلقاسم',
    department: 'تكنولوجيا المعلومات (IT)',
    jobTitle: 'كبير مهندسي البرمجيات',
    email: 'a.belkacem@orbiton.dz',
    phone: '+213 550 11 22 33',
    joiningDate: '2023-01-15',
    baseSalary: 180000,
    status: 'active'
  },
  {
    id: 'emp-102',
    employeeCode: 'EMP-002',
    fullName: 'ياسمين زروال',
    department: 'المالية والمحاسبة',
    jobTitle: 'مدير المالية والضرائب',
    email: 'y.zeroual@orbiton.dz',
    phone: '+213 661 44 55 66',
    joiningDate: '2022-05-01',
    baseSalary: 210000,
    status: 'active'
  },
  {
    id: 'emp-103',
    employeeCode: 'EMP-003',
    fullName: 'رياض سليماني',
    department: 'المبيعات والتسويق',
    jobTitle: 'مدير حسابات كبار العملاء',
    email: 'r.slimani@orbiton.dz',
    phone: '+213 770 77 88 99',
    joiningDate: '2024-02-10',
    baseSalary: 140000,
    status: 'active'
  },
  {
    id: 'emp-104',
    employeeCode: 'EMP-004',
    fullName: 'مريم بوقرة',
    department: 'الموارد البشرية',
    jobTitle: 'أخصائي تطوير الموارد البشرية',
    email: 'm.bouguerra@orbiton.dz',
    phone: '+213 555 33 22 11',
    joiningDate: '2023-09-01',
    baseSalary: 125000,
    status: 'on_leave'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-104',
    employeeName: 'مريم بوقرة',
    type: 'annual',
    startDate: '2026-07-20',
    endDate: '2026-07-30',
    days: 10,
    status: 'approved',
    reason: 'إجازة سنوية اعتيادية'
  },
  {
    id: 'leave-2',
    employeeId: 'emp-101',
    employeeName: 'م. أمين بلقاسم',
    type: 'emergency',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    days: 3,
    status: 'pending',
    reason: 'ظروف عائلية طارئة'
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'مجمع الجزائر للتجهيزات الرقمية (Dell Authorized DZ)',
    contactPerson: 'فريد بن يحيى',
    email: 'orders@dz-digital.dz',
    phone: '+213 21 70 80 90',
    category: 'أجهزة ومعدات خوادم',
    rating: 4.9
  },
  {
    id: 'ven-2',
    name: 'شركة الأوراس للشبكات والألياف البصرية',
    contactPerson: 'عمر بوداود',
    email: 'info@auras-networks.dz',
    phone: '+213 31 66 55 44',
    category: 'شبكات وكوابل ألياف',
    rating: 4.6
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-501',
    poNumber: 'PO-2026-101',
    vendorName: 'مجمع الجزائر للتجهيزات الرقمية',
    vendorEmail: 'orders@dz-digital.dz',
    orderDate: '2026-07-10',
    expectedDelivery: '2026-07-28',
    totalAmount: 3450000,
    status: 'ordered',
    itemsCount: 8
  },
  {
    id: 'po-502',
    poNumber: 'PO-2026-102',
    vendorName: 'شركة الأوراس للشبكات والألياف البصرية',
    vendorEmail: 'info@auras-networks.dz',
    orderDate: '2026-07-18',
    expectedDelivery: '2026-08-05',
    totalAmount: 820000,
    status: 'received',
    itemsCount: 15
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'مشروع التحول الرقمي وتحديث المركز المعلوماتي',
    clientName: 'شركة الجزائر للحلول التقنية والبرمجة',
    budget: 8500000,
    spent: 4800000,
    startDate: '2026-05-01',
    endDate: '2026-11-30',
    status: 'in_progress',
    progress: 62,
    tasksCount: 18
  },
  {
    id: 'proj-2',
    name: 'ربط الشبكات والألياف البصرية بفرع وهران',
    clientName: 'مؤسسة السافانا للتجارة والتوزيع',
    budget: 4200000,
    spent: 3900000,
    startDate: '2026-03-15',
    endDate: '2026-08-15',
    status: 'in_progress',
    progress: 90,
    tasksCount: 12
  },
  {
    id: 'proj-3',
    name: 'تجهيز بنية مركز البيانات الجديد بقسنطينة',
    clientName: 'مجمع الأوراس للتجهيزات الصناعية',
    budget: 12000000,
    spent: 1500000,
    startDate: '2026-07-01',
    endDate: '2027-01-31',
    status: 'planning',
    progress: 15,
    tasksCount: 25
  }
];

export const INITIAL_TASKS: ProjectTask[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'تثبيت وضبط بيئة الخوادم الرئيسية VMWare بالجزائر',
    assignedTo: 'م. أمين بلقاسم',
    dueDate: '2026-07-31',
    priority: 'high',
    status: 'in_progress'
  },
  {
    id: 'task-2',
    projectId: 'proj-2',
    title: 'اختبار شهادات التشفير ومطابقة معايير المديرية العامة للضرائب DGI',
    assignedTo: 'ياسمين زروال',
    dueDate: '2026-07-28',
    priority: 'high',
    status: 'completed'
  },
  {
    id: 'task-3',
    projectId: 'proj-3',
    title: 'مراجعة المخططات الهندسية ونظام التبريد المزدوج بقسنطينة',
    assignedTo: 'رياض سليماني',
    dueDate: '2026-08-10',
    priority: 'medium',
    status: 'todo'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: '2026-07-20',
    type: 'income',
    category: 'مبيعات خدمات وبرمجيات',
    description: 'تحصيل فاتورة INV-2026-001 (شركة الجزائر للحلول التقنية)',
    amount: 1785000,
    referenceId: 'INV-2026-001'
  },
  {
    id: 'tx-2',
    date: '2026-07-18',
    type: 'expense',
    category: 'مرتبات وأجور الموظفين',
    description: 'تحويل مسير رواتب شهر يوليو 2026 عبر البنك',
    amount: 655000
  },
  {
    id: 'tx-3',
    date: '2026-07-15',
    type: 'expense',
    category: 'مشتريات خوادم ومعدات',
    description: 'دفعة توريد PO-2026-102 (شبكات الأوراس)',
    amount: 820000,
    referenceId: 'PO-2026-102'
  },
  {
    id: 'tx-4',
    date: '2026-07-05',
    type: 'income',
    category: 'عقود صيانة واستشارات',
    description: 'تحصيل دفعة عقد صيانة ربع سنوي - وهران',
    amount: 950000
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'تنبيه نقص المخزون (Low Stock)',
    message: 'منتج "موزع شبكة 48 منفذ PoE Switch" بمستودع وهران وصل للحد الأدنى (3 قطع متبقية)',
    type: 'warning',
    time: 'قبل 10 دقائق',
    read: false
  },
  {
    id: 'notif-2',
    title: 'تنبيه نفاذ المخزون (Out of Stock)',
    message: 'المنتج "مزود طاقة لا ينقطع 3000VA UPS" نفد بالكامل (0 وحدة) بمستودع وهران',
    type: 'alert',
    time: 'قبل 25 دقيقة',
    read: false
  },
  {
    id: 'notif-3',
    title: 'تنبيه انتهاء الصلاحية (Expired Product)',
    message: 'المنتج "حقيبة إسعافات أولية وضمادات طبية" انتهت صلاحيته بتاريخ 2026-05-10',
    type: 'alert',
    time: 'قبل ساعة',
    read: false
  },
  {
    id: 'notif-4',
    title: 'اقتراب انتهاء الصلاحية (Expiring Soon)',
    message: 'المنتج "محلول تنظيف وإزالة أتربة الأجهزة" تنتهي صلاحيته قريباً بتاريخ 2026-08-05',
    type: 'warning',
    time: 'قبل ساعتين',
    read: false
  },
  {
    id: 'notif-5',
    title: 'طلب إجازة جديد',
    message: 'الموظف م. أمين بلقاسم تقدم بطلب إجازة طارئة لمدة 3 أيام',
    type: 'info',
    time: 'قبل 3 ساعات',
    read: false
  }
];
