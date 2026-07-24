import React from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Users, 
  Package, 
  Receipt, 
  UserCheck, 
  Briefcase, 
  Database,
  Check
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from './Modal';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ isOpen, onClose }) => {
  const { 
    exportDataCSV, 
    invoices, 
    products, 
    customers, 
    employees, 
    transactions,
    language 
  } = useERP();

  const handleExportJSONBackup = () => {
    const fullBackup = {
      app: 'Orbiton ERP Algeria',
      exportDate: new Date().toISOString(),
      invoices,
      products,
      customers,
      employees,
      transactions
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `orbiton_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportModules = [
    {
      id: 'invoices',
      title: language === 'ar' ? 'الفواتير والمبيعات (DGI Invoices)' : 'Invoices & Sales',
      desc: language === 'ar' ? 'سجل الفواتير، العُملاء، مبالغ TVA والإجمالي TTC.' : 'Invoice register with VAT and TTC totals.',
      count: invoices.length,
      icon: Receipt,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'products',
      title: language === 'ar' ? 'المخزون والمنتجات (SKUs Catalog)' : 'Inventory & SKUs',
      desc: language === 'ar' ? 'أسعار التكلفة، البيع، الكميات بالمستودعات والباركود.' : 'SKUs, stock quantities, cost & selling prices.',
      count: products.length,
      icon: Package,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'customers',
      title: language === 'ar' ? 'دليل العملاء والأرقام الجبائية (NIF)' : 'Customers & NIF',
      desc: language === 'ar' ? 'أسماء الشركات، الهواتف، العناوين والأرقام الجبائية.' : 'Customer directory, contact numbers & NIF IDs.',
      count: customers.length,
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'employees',
      title: language === 'ar' ? 'سجل الموظفين والرواتب (HR Payroll)' : 'Employees & HR',
      desc: language === 'ar' ? 'كشوفات الموظفين، الأقسام، المسميات والرواتب الأساسية.' : 'Employees directory, job titles & base salaries.',
      count: employees.length,
      icon: UserCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'transactions',
      title: language === 'ar' ? 'السجل المالي والمعاملات (Transactions)' : 'Financial Transactions',
      desc: language === 'ar' ? 'حركة المقبوضات والمصروفات والتدفقات النقدية.' : 'Income & expense ledgers and cashflow records.',
      count: transactions.length,
      icon: Briefcase,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'ar' ? 'مركز تصدير البيانات والنسخ الاحتياطي' : 'Data Export & Backup Center'}
    >
      <div className="space-y-5">
        <p className="text-xs text-slate-300">
          {language === 'ar' 
            ? 'قم بتصدير بيانات النظام بصيغة CSV المتوافقة مع جداول Excel أو قم بتنزيل نسخة احتياطية كاملة بصيغة JSON.' 
            : 'Export system data to Excel CSV tables or download a full JSON database snapshot.'}
        </p>

        {/* Export Options Grid */}
        <div className="space-y-3">
          {exportModules.map(mod => {
            const IconComp = mod.icon;
            return (
              <div 
                key={mod.id}
                className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${mod.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{mod.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                        {mod.count} {language === 'ar' ? 'سجل' : 'records'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => exportDataCSV(mod.id as any)}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'تصدير CSV' : 'CSV'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Full JSON Backup Button */}
        <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'تصدير نسخة احتياطية شاملة (Full JSON Backup)' : 'Full JSON Backup'}</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {language === 'ar' ? 'تنزيل جميع البيانات الحالية في ملف احتياطي موحد.' : 'Download full database snapshot.'}
            </p>
          </div>

          <button
            onClick={handleExportJSONBackup}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'ar' ? 'تنزيل النسخة' : 'Download JSON'}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
