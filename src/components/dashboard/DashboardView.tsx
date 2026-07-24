import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  Package, 
  Users, 
  AlertTriangle, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../common/StatCard';

export const DashboardView: React.FC = () => {
  const { 
    language, 
    formatCurrency, 
    invoices, 
    products, 
    employees, 
    transactions,
    setActiveModule
  } = useERP();

  // Calculations
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const overdueRevenue = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
  const lowStockProducts = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock');
  const activeEmployeeCount = employees.filter(e => e.status === 'active').length;

  // Chart Data: Monthly Revenue & Expenses
  const monthlyData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', revenue: 45000, expense: 28000 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', revenue: 52000, expense: 31000 },
    { month: language === 'ar' ? 'مارس' : 'Mar', revenue: 68000, expense: 35000 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', revenue: 61000, expense: 32000 },
    { month: language === 'ar' ? 'مايو' : 'May', revenue: 79000, expense: 39000 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', revenue: 84000, expense: 41000 },
    { month: language === 'ar' ? 'يوليو' : 'Jul', revenue: 98000, expense: 46000 },
  ];

  // Category sales breakdown
  const categoryData = [
    { name: language === 'ar' ? 'الأجهزة والحواسيب' : 'Hardware', value: 45 },
    { name: language === 'ar' ? 'البرمجيات والتراخيص' : 'Software', value: 30 },
    { name: language === 'ar' ? 'الشبكات والأمان' : 'Networking', value: 15 },
    { name: language === 'ar' ? 'استشارات ودعم' : 'Services', value: 10 },
  ];

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-[#10b981] space-y-6">
      
      {/* Top Welcome & Quick AI Action Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            {language === 'ar' ? 'نظام إدارة الموارد الشامل ERP' : 'Executive ERP Suite'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {language === 'ar' ? 'مرحباً بك، التقرير التنفيذي اليومي' : 'Welcome, Executive Overview'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'متابعة مؤشرات الأداء المالي، المبيعات، حركة المخزون والمرتبات في مكان واحد.' 
              : 'Real-time financial metrics, sales, inventory flow & payroll summary.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setActiveModule('ai-advisor')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition border border-emerald-400/30"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{language === 'ar' ? 'تقرير الذكاء الاصطناعي' : 'Generate AI Report'}</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert Notification Bar if exists */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-bold">
                {language === 'ar' ? 'تنبيه إعادات الطلب للمخزون:' : 'Low Inventory Reorder Notice:'}
              </span>{' '}
              {language === 'ar'
                ? `يوجد ${lowStockProducts.length} أصناف وصلت إلى حد الأمان أو نفذت من المستودعات.`
                : `${lowStockProducts.length} items reached minimum safety threshold or out of stock.`}
            </div>
          </div>
          <button 
            onClick={() => setActiveModule('inventory')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shrink-0 transition"
          >
            {language === 'ar' ? 'معاينة المخزون' : 'View Stock'}
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title={language === 'ar' ? 'إجمالي المحصّلات (المقبوضة)' : 'Total Received Revenue'}
          value={formatCurrency(totalRevenue)}
          subtitle={language === 'ar' ? 'فواتير مدفوعة بالكامل' : 'Paid Invoices'}
          trend="+18.5%"
          trendType="up"
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title={language === 'ar' ? 'فواتير قيد الانتظار' : 'Pending Invoices'}
          value={formatCurrency(pendingRevenue)}
          subtitle={language === 'ar' ? 'تستحق خلال 30 يوماً' : 'Due in 30 Days'}
          trend={language === 'ar' ? 'قيد المتابعة' : 'Pending'}
          trendType="neutral"
          icon={Receipt}
          color="blue"
        />

        <StatCard
          title={language === 'ar' ? 'إجمالي قيمة المخزون' : 'Total Inventory Value'}
          value={formatCurrency(totalInventoryValue)}
          subtitle={language === 'ar' ? `${products.length} منتجات بالكتالوج` : `${products.length} SKUs in Catalog`}
          trend={lowStockProducts.length > 0 ? `${lowStockProducts.length} ${language === 'ar' ? 'منخفض' : 'Low'}` : 'Optimal'}
          trendType={lowStockProducts.length > 0 ? 'down' : 'up'}
          icon={Package}
          color="purple"
        />

        <StatCard
          title={language === 'ar' ? 'الموظفون النشطون' : 'Active Workforce'}
          value={activeEmployeeCount}
          subtitle={language === 'ar' ? 'مسير الرواتب منتظم' : 'Payroll Active'}
          trend="100%"
          trendType="up"
          icon={Users}
          color="teal"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Monthly Revenue/Expense Bar Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                {language === 'ar' ? 'حركة الإيرادات والمصروفات الشهري' : 'Monthly Revenue & Expenses'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar' ? 'مقارنة الإيرادات بالمصروفات التشغيلية لعام 2026' : 'Revenue vs Operating Expenses 2026'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                {language === 'ar' ? 'الإيرادات' : 'Revenue'}
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                {language === 'ar' ? 'المصروفات' : 'Expenses'}
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: any) => [formatCurrency(Number(val)), '']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Breakdown Pie Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {language === 'ar' ? 'توزيع المبيعات حسب الفئة' : 'Sales by Category'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ar' ? 'حصة كل قطاع من المبيعات' : 'Share of sales per business unit'}
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800 text-xs">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                <span className="text-slate-300 truncate">{cat.name}:</span>
                <span className="font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transactions Feed */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {language === 'ar' ? 'آخر المعاملات والعمليات المالية' : 'Recent Financial Transactions'}
            </h3>
            <button 
              onClick={() => setActiveModule('finance')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              {language === 'ar' ? 'عرض السجل الكامل ←' : 'View All →'}
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {transactions.slice(0, 4).map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {tx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">{tx.description}</p>
                    <span className="text-slate-400 text-[11px]">{tx.category} • {tx.date}</span>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ar' ? 'وصول سريع لإصدار الفواتير أو إضافة الموظفين والمنتجات' : 'Direct shortcuts for operational tasks'}
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveModule('finance')}
              className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>{language === 'ar' ? 'إصدار فاتورة جديدة (VAT Invoice)' : 'Create New Tax Invoice'}</span>
              </div>
              <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveModule('inventory')}
              className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>{language === 'ar' ? 'إضافة صنف جديد للمخزون' : 'Add Inventory SKU'}</span>
              </div>
              <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveModule('hr')}
              className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>{language === 'ar' ? 'إضافة موظف جديد' : 'Register New Employee'}</span>
              </div>
              <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveModule('purchasing')}
              className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{language === 'ar' ? 'إنشاء أمر شراء (Purchase Order)' : 'Create Purchase Order'}</span>
              </div>
              <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
