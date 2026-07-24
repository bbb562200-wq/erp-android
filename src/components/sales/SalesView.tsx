import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  UserPlus
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../common/Modal';

export const SalesView: React.FC = () => {
  const { customers, addCustomer, formatCurrency, language, searchQuery } = useERP();

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    addCustomer({
      name,
      company,
      email,
      phone,
      taxNumber,
      address,
      status: 'active'
    });

    setIsAddCustomerOpen(false);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setTaxNumber('');
    setAddress('');
  };

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const totalSalesSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>{language === 'ar' ? 'إدارة المبيعات وعلاقات العملاء (CRM)' : 'Sales & CRM Directory'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'متابعة بيانات العملاء، الأرقام الضريبية، حجم التعاملات المالية وعقود الصفقات.' 
              : 'Track corporate client profiles, tax numbers, deals pipeline & revenue history.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-950/40 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}</span>
        </button>
      </div>

      {/* CRM Pipeline Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'إجمالي العملاء النشطين' : 'Total Active Corporate Clients'}</p>
          <p className="text-2xl font-bold text-white mt-1">{customers.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'حجم المبيعات الإجمالي للعملاء' : 'Total Customer Lifetime Value'}</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalSalesSpent)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value'}</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totalSalesSpent / (customers.length || 1))}</p>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map(cust => (
          <div key={cust.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-lg flex items-center justify-center shrink-0">
                  {cust.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{cust.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{cust.company}</span>
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {language === 'ar' ? 'عميل نشط' : 'Active Client'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              {cust.taxNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{language === 'ar' ? 'الرقم الضريبي:' : 'VAT ID:'}</span>
                  <span className="font-mono text-slate-200">{cust.taxNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{cust.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span dir="ltr">{cust.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{cust.address}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">{language === 'ar' ? 'إجمالي المشتريات المعتمدة:' : 'Lifetime Value:'}</span>
              <span className="text-emerald-400 font-bold text-sm">{formatCurrency(cust.totalSpent)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add New Customer */}
      <Modal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        title={language === 'ar' ? 'إضافة عميل مؤسسي جديد (Corporate Client)' : 'Add Corporate Client'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ar' ? 'اسم العميل / المؤسسة' : 'Customer Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: شركة الأفق التقنية' : 'e.g. Al-Ofoq Tech Corp'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ar' ? 'الشركة / القطاع' : 'Company Name'}
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ar' ? 'رقم الهاتف / الجوال' : 'Phone Number'}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ar' ? 'الرقم الجبائي NIF (اختياري)' : 'Tax NIF Number'}
            </label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="001916xxxxxxxx"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ar' ? 'العنوان والولاية' : 'Address & Wilaya'}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: شارع ديدوش مراد، الجزائر العاصمة' : 'Algiers, Algeria'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddCustomerOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-950/40 transition"
            >
              {language === 'ar' ? 'حفظ العميل' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
