import React, { useState } from 'react';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Calendar, 
  DollarSign, 
  Check, 
  X, 
  Building, 
  Briefcase, 
  BadgeCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../common/Modal';

export const HRView: React.FC = () => {
  const { 
    employees, 
    addEmployee, 
    leaves, 
    updateLeaveStatus, 
    formatCurrency, 
    language,
    searchQuery
  } = useERP();

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('تكنولوجيا المعلومات (IT)');
  const [jobTitle, setJobTitle] = useState('مهندس نظم برمجية');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [baseSalary, setBaseSalary] = useState(15000);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const employeeCode = `EMP-00${employees.length + 1}`;

    addEmployee({
      employeeCode,
      fullName,
      department,
      jobTitle,
      email,
      phone,
      joiningDate: new Date().toISOString().split('T')[0],
      baseSalary: Number(baseSalary),
      status: 'active'
    });

    setIsAddEmployeeOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
  };

  const filteredEmployees = employees.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return e.fullName.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.jobTitle.toLowerCase().includes(q);
  });

  const totalMonthlySalaries = employees.reduce((sum, e) => sum + e.baseSalary, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-teal-400" />
            <span>{language === 'ar' ? 'الموارد البشرية ومسير المرتبات' : 'Human Resources & Payroll'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'دليل الموظفين، مسير الرواتب الشهرية، اعتماد الإجازات والغياب.' 
              : 'Workforce records, monthly payroll processing, attendance & leave approvals.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddEmployeeOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-950/40 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة موظف جديد' : 'Register Employee'}</span>
        </button>
      </div>

      {/* HR Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}</p>
          <p className="text-2xl font-bold text-white mt-1">{employees.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'إجمالي كتلة الرواتب الأساسية' : 'Total Monthly Payroll'}</p>
          <p className="text-2xl font-bold text-teal-400 mt-1">{formatCurrency(totalMonthlySalaries)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'طلبات الإجازة المعلقة' : 'Pending Leave Requests'}</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{leaves.filter(l => l.status === 'pending').length}</p>
        </div>
      </div>

      {/* Leave Requests Approvals Panel */}
      {leaves.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'طلبات الإجازات المقدمة' : 'Leave Requests Approvals'}</span>
          </h3>

          <div className="divide-y divide-slate-800">
            {leaves.map(req => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-white">{req.employeeName}</p>
                  <p className="text-xs text-slate-400">
                    {req.reason} • {req.days} {language === 'ar' ? 'أيام' : 'days'} ({req.startDate} → {req.endDate})
                  </p>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateLeaveStatus(req.id, 'approved')}
                      className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'موافقة' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(req.id, 'rejected')}
                      className="px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'رفض' : 'Reject'}</span>
                    </button>
                  </div>
                ) : (
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {req.status === 'approved' ? (language === 'ar' ? 'معتمد' : 'Approved') : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employees Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'الكادر الوظيفي المعتمد' : 'Employee Master Roster'}</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">{language === 'ar' ? 'كود الموظف' : 'Emp ID'}</th>
                <th className="p-4">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</th>
                <th className="p-4">{language === 'ar' ? 'القسم' : 'Department'}</th>
                <th className="p-4">{language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</th>
                <th className="p-4">{language === 'ar' ? 'الراتب الأساسي' : 'Base Salary'}</th>
                <th className="p-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-800/60 transition">
                  <td className="p-4 font-mono font-bold text-slate-300">{emp.employeeCode}</td>
                  <td className="p-4 font-bold text-white">{emp.fullName}</td>
                  <td className="p-4 text-slate-300">{emp.department}</td>
                  <td className="p-4 text-slate-400">{emp.jobTitle}</td>
                  <td className="p-4 font-bold text-emerald-400">{formatCurrency(emp.baseSalary)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      emp.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {emp.status === 'active' ? (language === 'ar' ? 'نشط على رأس العمل' : 'Active') : (language === 'ar' ? 'في إجازة' : 'On Leave')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Employee */}
      <Modal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        title={language === 'ar' ? 'تسجيل موظف جديد بالمؤسسة' : 'Register New Employee'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'القسم' : 'Department'}</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="تكنولوجيا المعلومات (IT)">تكنولوجيا المعلومات (IT)</option>
                <option value="المالية والمحاسبة">المالية والمحاسبة</option>
                <option value="المبيعات والتسويق">المبيعات والتسويق</option>
                <option value="الموارد البشرية">الموارد البشرية</option>
                <option value="إدارة المشاريع">إدارة المشاريع</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Work Email'}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'الراتب الأساسي' : 'Base Monthly Salary'}</label>
              <input
                type="number"
                required
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddEmployeeOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition"
            >
              {language === 'ar' ? 'حفظ الموظف' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
