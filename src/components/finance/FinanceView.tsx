import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Printer, 
  Trash2, 
  Eye, 
  DollarSign, 
  Calendar,
  Building2,
  FileText,
  QrCode
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../common/Modal';
import { Invoice, InvoiceItem } from '../../types';

export const FinanceView: React.FC = () => {
  const { 
    invoices, 
    addInvoice, 
    updateInvoiceStatus, 
    deleteInvoice, 
    customers, 
    products,
    formatCurrency, 
    language,
    searchQuery
  } = useERP();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'تراخيص ومعالجة برمجية حاسوبية', quantity: 1, unitPrice: 150000, total: 150000 }
  ]);
  const [notes, setNotes] = useState('يرجى سداد المبلغ لحساب البنك الوطني الجزائري BNA - حساب رقم: DZ16 0010 0023 4000 0123 4567');

  // Calculation helpers
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const numVal = Math.max(0, Number(value));
      (item as any)[field] = numVal;
      item.total = item.quantity * item.unitPrice;
    } else {
      (item as any)[field] = value;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = subtotal * 0.19; // 19% TVA in Algeria
  const totalAmount = subtotal + vatAmount;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const invoiceNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    addInvoice({
      invoiceNumber,
      customerId,
      customerName,
      date: invoiceDate,
      dueDate,
      items,
      subtotal,
      vatAmount,
      totalAmount,
      status: 'pending',
      notes
    });

    setIsCreateModalOpen(false);
    // Reset form
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Filtered list
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = searchQuery
      ? inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesFilter = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>{language === 'ar' ? 'إدارة المالية والفواتير الضريبية' : 'Financials & Tax Invoices'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'إصدار الفواتير المتوافقة مع ضريبة القيمة المضافة (15%)، تحصيل المستحقات وإدارة السجل المالي.' 
              : 'Issue VAT compliant 15% tax invoices, receive payments & audit general ledger.'}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إصدار فاتورة جديدة' : 'Create Tax Invoice'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        {[
          { id: 'all', labelAr: 'جميع الفواتير', labelEn: 'All Invoices' },
          { id: 'paid', labelAr: 'مسددة (Paid)', labelEn: 'Paid' },
          { id: 'pending', labelAr: 'قيد الانتظار', labelEn: 'Pending' },
          { id: 'overdue', labelAr: 'متأخرة السداد', labelEn: 'Overdue' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === tab.id 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">{language === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
                <th className="p-4">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                <th className="p-4">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="p-4">{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                <th className="p-4">{language === 'ar' ? 'المبلغ الإجمالي (شامل الضريبة)' : 'Total (Inc. VAT)'}</th>
                <th className="p-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {language === 'ar' ? 'لا توجد فواتير مطابقة للبحث' : 'No invoices found'}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/60 transition">
                    <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-4 font-semibold text-slate-200">{inv.customerName}</td>
                    <td className="p-4 text-slate-400">{inv.date}</td>
                    <td className="p-4 text-slate-400">{inv.dueDate}</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(inv.totalAmount)}</td>
                    <td className="p-4">
                      <select
                        value={inv.status}
                        onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none bg-slate-900 cursor-pointer ${
                          inv.status === 'paid' 
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' 
                            : inv.status === 'overdue'
                              ? 'text-rose-400 border-rose-500/30 bg-rose-950/30'
                              : 'text-amber-400 border-amber-500/30 bg-amber-950/30'
                        }`}
                      >
                        <option value="paid">{language === 'ar' ? 'مدفوعة (Paid)' : 'Paid'}</option>
                        <option value="pending">{language === 'ar' ? 'قيد الانتظار (Pending)' : 'Pending'}</option>
                        <option value="overdue">{language === 'ar' ? 'متأخرة (Overdue)' : 'Overdue'}</option>
                      </select>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedInvoiceForView(inv)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title={language === 'ar' ? 'معاينة الفاتورة وطباعتها' : 'View & Print'}
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(language === 'ar' ? 'هل تريد حذف هذه الفاتورة؟' : 'Delete invoice?')) {
                            deleteInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Tax Invoice */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={language === 'ar' ? 'إصدار فاتورة ضريبية جديدة (VAT Tax Invoice)' : 'Create New Tax Invoice'}
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ar' ? 'اختر العميل' : 'Select Customer'}
              </label>
              <select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  const cust = customers.find(c => c.id === e.target.value);
                  if (cust) setCustomerName(cust.name);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ar' ? 'اسم العميل المطبوع' : 'Customer Display Name'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date'}
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                {language === 'ar' ? 'بنود الفاتورة والخدمات' : 'Line Items'}
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة بند' : 'Add Item'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'وصف الصنف أو الخدمة' : 'Item Description'}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    required
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder={language === 'ar' ? 'الكمية' : 'Qty'}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 text-center focus:outline-none focus:border-emerald-500"
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder={language === 'ar' ? 'السعر' : 'Price'}
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 text-center focus:outline-none focus:border-emerald-500"
                  />

                  <span className="w-24 text-xs font-bold text-emerald-400 text-center">
                    {formatCurrency(item.total)}
                  </span>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>{language === 'ar' ? 'المجموع الفرعي (قبل الضريبة):' : 'Subtotal:'}</span>
              <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>{language === 'ar' ? 'ضريبة القيمة المضافة (15% VAT):' : 'VAT (15%):'}</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-700">
              <span>{language === 'ar' ? 'الإجمالي النهائي:' : 'Grand Total:'}</span>
              <span className="text-emerald-400">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ar' ? 'ملاحظات وتتعليمات الدفع' : 'Payment Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition"
            >
              {language === 'ar' ? 'حفظ وإصدار الفاتورة' : 'Issue Tax Invoice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View & Print Tax Invoice */}
      {selectedInvoiceForView && (
        <Modal
          isOpen={!!selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
          title={language === 'ar' ? 'معاينة الفاتورة الضريبية الرسمية' : 'Official Tax Invoice View'}
          maxWidth="2xl"
        >
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-inner space-y-6 font-sans border border-slate-300" id="printable-invoice">
            
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between border-b-2 border-slate-800 pb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xl">
                  <Building2 className="w-6 h-6" />
                  <span>شركة أوربيتون الجزائر للحلول التقنية (ش.ذ.م.م)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">شارع ديدوش مراد، الجزائر العاصمة، الجمهورية الجزائرية</p>
                <p className="text-xs text-slate-600 font-mono">الرقم الجبائي NIF: 001916012345678 • RC: 16/00-0123456B19</p>
              </div>

              <div className="text-right rtl:text-right ltr:text-left">
                <span className="px-3 py-1 rounded bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider">
                  فاتورة رسمية - DGI ALGERIA
                </span>
                <p className="font-mono font-bold text-lg text-slate-900 mt-2">{selectedInvoiceForView.invoiceNumber}</p>
                <p className="text-xs text-slate-600">التاريخ: {selectedInvoiceForView.date}</p>
                <p className="text-xs text-slate-600">تاريخ الاستحقاق: {selectedInvoiceForView.dueDate}</p>
              </div>
            </div>

            {/* Customer Information Box */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">مفوتر إلى / Billed To:</span>
              <p className="font-bold text-sm text-slate-900">{selectedInvoiceForView.customerName}</p>
              <p className="text-slate-600">العميل المسجل بالنظام • رقم العميل: {selectedInvoiceForView.customerId}</p>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-bold text-right rtl:text-right ltr:text-left">
                  <th className="p-2.5">الوصف (Item Description)</th>
                  <th className="p-2.5 text-center">الكمية</th>
                  <th className="p-2.5 text-center">سعر الوحدة</th>
                  <th className="p-2.5 text-left rtl:text-left ltr:text-right">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                {selectedInvoiceForView.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium">{item.description}</td>
                    <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="p-2.5 text-center font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2.5 text-left rtl:text-left ltr:text-right font-bold">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Invoice Totals & DGI QR Code Placeholder */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-800" />
                <div className="text-[11px] text-slate-600">
                  <p className="font-bold text-slate-900">مطابق لمعايير المديرية العامة للضرائب (DGI ALGERIA)</p>
                  <p>الرمز الرقمي المعتمد للفواتير التجارية بالجزائر</p>
                </div>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>المجموع الصافي الخاضع للرسم:</span>
                  <span className="font-bold">{formatCurrency(selectedInvoiceForView.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الرسم على القيمة المضافة TVA (19%):</span>
                  <span>{formatCurrency(selectedInvoiceForView.vatAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-400">
                  <span>الإجمالي الشامل للرسوم (TTC):</span>
                  <span className="text-emerald-700">{formatCurrency(selectedInvoiceForView.totalAmount)}</span>
                </div>
              </div>
            </div>

            {selectedInvoiceForView.notes && (
              <div className="text-[11px] text-slate-600 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold block mb-0.5">ملاحظات وشروط الدفع:</span>
                <p>{selectedInvoiceForView.notes}</p>
              </div>
            )}

            {/* Print Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow transition"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الفاتورة (Print / PDF)</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
