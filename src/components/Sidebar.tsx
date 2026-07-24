import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Package, 
  ShoppingCart, 
  UserCheck, 
  FolderKanban, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { ModuleType } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    activeModule, 
    setActiveModule, 
    language,
    products,
    invoices,
    leaves
  } = useERP();

  const lowStockCount = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
  const overdueInvoicesCount = invoices.filter(i => i.status === 'overdue').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;

  const navItems: { id: ModuleType; labelAr: string; labelEn: string; icon: any; badge?: number }[] = [
    { 
      id: 'dashboard', 
      labelAr: 'اللوحة الرئيسية', 
      labelEn: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      id: 'finance', 
      labelAr: 'المالية والمحاسبة', 
      labelEn: 'Finance & Invoices', 
      icon: Receipt,
      badge: overdueInvoicesCount > 0 ? overdueInvoicesCount : undefined
    },
    { 
      id: 'sales', 
      labelAr: 'المبيعات وإدارة العملاء', 
      labelEn: 'Sales & CRM', 
      icon: Users 
    },
    { 
      id: 'inventory', 
      labelAr: 'المخزون والمستودعات', 
      labelEn: 'Inventory & Warehouses', 
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined
    },
    { 
      id: 'purchasing', 
      labelAr: 'المشتريات والتوريد', 
      labelEn: 'Purchasing & POs', 
      icon: ShoppingCart 
    },
    { 
      id: 'hr', 
      labelAr: 'الموارد البشرية والمرتبات', 
      labelEn: 'HR & Payroll', 
      icon: UserCheck,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined
    },
    { 
      id: 'projects', 
      labelAr: 'المشاريع والمهام', 
      labelEn: 'Projects & Tasks', 
      icon: FolderKanban 
    },
    { 
      id: 'ai-advisor', 
      labelAr: 'المساعد الذكي (Gemini)', 
      labelEn: 'AI Strategy Advisor', 
      icon: Sparkles 
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-l border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-64px)] rtl:border-l rtl:border-r-0 ltr:border-r ltr:border-l-0 p-4">
      <div className="space-y-1 flex-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {language === 'ar' ? 'وحدات النظام Enterprise' : 'SYSTEM MODULES'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm transition-colors ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
              </div>

              {item.badge && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloud Storage / System Status Widget */}
      <div className="mt-auto p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400 font-medium">
            {language === 'ar' ? 'سعة التخزين السحابي' : 'Cloud Storage'}
          </p>
          <span className="text-[10px] text-emerald-400 font-bold">75%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full mb-2 overflow-hidden">
          <div className="h-full bg-emerald-500 w-3/4 rounded-full"></div>
        </div>
        <p className="text-[10px] text-slate-500">750 GB / 1 TB • Cloud Run</p>
      </div>
    </aside>
  );
};
