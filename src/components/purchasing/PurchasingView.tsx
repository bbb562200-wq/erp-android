import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Building, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Star,
  FileCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../common/Modal';

export const PurchasingView: React.FC = () => {
  const { 
    purchaseOrders, 
    addPurchaseOrder, 
    updatePOStatus, 
    vendors, 
    formatCurrency, 
    language,
    searchQuery
  } = useERP();

  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [vendorName, setVendorName] = useState(vendors[0]?.name || '');
  const [vendorEmail, setVendorEmail] = useState(vendors[0]?.email || '');
  const [expectedDelivery, setExpectedDelivery] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [totalAmount, setTotalAmount] = useState(25000);
  const [itemsCount, setItemsCount] = useState(5);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    const poNumber = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

    addPurchaseOrder({
      poNumber,
      vendorName,
      vendorEmail,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery,
      totalAmount: Number(totalAmount),
      status: 'ordered',
      itemsCount: Number(itemsCount)
    });

    setIsAddPOOpen(false);
  };

  const filteredPOs = purchaseOrders.filter(po => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return po.poNumber.toLowerCase().includes(q) || po.vendorName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-400" />
            <span>{language === 'ar' ? 'إدارة المشتريات والتوريد' : 'Procurement & Purchase Orders'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'إصدار أوامر الشراء للموردين المعتمدين، متابعة الشحنات القادمة واستلام المخزون.' 
              : 'Issue Purchase Orders, evaluate vendors & receive incoming stock deliveries.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddPOOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-950/40 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إنشاء أمر شراء جديد (PO)' : 'New Purchase Order'}</span>
        </button>
      </div>

      {/* Vendors List Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vendors.map(ven => (
          <div key={ven.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{ven.name}</h3>
                <p className="text-xs text-slate-400">{ven.category} • مسؤول التواصل: {ven.contactPerson}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ven.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'سجل أوامر الشراء' : 'Purchase Orders Ledger'}</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">رقم PO</th>
                <th className="p-4">{language === 'ar' ? 'المورد' : 'Vendor'}</th>
                <th className="p-4">{language === 'ar' ? 'تاريخ الطلب' : 'Order Date'}</th>
                <th className="p-4">{language === 'ar' ? 'التسليم المتوقع' : 'Expected Delivery'}</th>
                <th className="p-4">{language === 'ar' ? 'قيمة الطلب' : 'Total Cost'}</th>
                <th className="p-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPOs.map(po => (
                <tr key={po.id} className="hover:bg-slate-800/60 transition">
                  <td className="p-4 font-mono font-bold text-slate-200">{po.poNumber}</td>
                  <td className="p-4 font-bold text-white">{po.vendorName}</td>
                  <td className="p-4 text-slate-400">{po.orderDate}</td>
                  <td className="p-4 text-slate-400">{po.expectedDelivery}</td>
                  <td className="p-4 font-bold text-amber-400">{formatCurrency(po.totalAmount)}</td>
                  <td className="p-4">
                    <select
                      value={po.status}
                      onChange={(e) => updatePOStatus(po.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none bg-slate-900 cursor-pointer ${
                        po.status === 'received' 
                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' 
                          : po.status === 'ordered'
                            ? 'text-amber-400 border-amber-500/30 bg-amber-950/30'
                            : 'text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="ordered">{language === 'ar' ? 'تم التوريد جاري الشحن' : 'Ordered'}</option>
                      <option value="received">{language === 'ar' ? 'تم الاستلام والفحص' : 'Received'}</option>
                      <option value="cancelled">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Purchase Order */}
      <Modal
        isOpen={isAddPOOpen}
        onClose={() => setIsAddPOOpen(false)}
        title={language === 'ar' ? 'إصدار أمر شراء جديد (Purchase Order)' : 'Create Purchase Order'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'اختر المورد' : 'Select Vendor'}</label>
            <select
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name} ({v.category})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'تاريخ الاستلام المتوقع' : 'Expected Delivery'}</label>
              <input
                type="date"
                required
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'إجمالي قيمة الطلب' : 'Total PO Amount'}</label>
              <input
                type="number"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddPOOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition"
            >
              {language === 'ar' ? 'إصدار أمر الشراء' : 'Issue Purchase Order'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
