import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  Building2, 
  Warehouse as WarehouseIcon, 
  TrendingDown, 
  ArrowUpDown, 
  Trash2, 
  CheckCircle2, 
  Layers,
  Scan,
  Bell,
  Calendar,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../common/Modal';
import { BarcodeScannerModal } from '../common/BarcodeScannerModal';

export const InventoryView: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProductQuantity, 
    deleteProduct, 
    warehouses,
    addWarehouse,
    deleteWarehouse,
    clearInventoryAndWarehouses,
    checkInventoryAlerts,
    formatCurrency, 
    language,
    searchQuery
  } = useERP();

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'expired' | 'expiring_soon'>('all');

  // Warehouse Form State
  const [whName, setWhName] = useState('');
  const [whLocation, setWhLocation] = useState('');
  const [whManager, setWhManager] = useState('');
  const [whCapacity, setWhCapacity] = useState(1000);

  // Product Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('الأجهزة والحواسيب Hardware');
  const [costPrice, setCostPrice] = useState(1000);
  const [sellingPrice, setSellingPrice] = useState(1500);
  const [quantity, setQuantity] = useState(10);
  const [minQuantity, setMinQuantity] = useState(5);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '');
  const [unit, setUnit] = useState('قطعة');
  const [expiryDate, setExpiryDate] = useState('');

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName.trim()) return;

    addWarehouse({
      name: whName,
      location: whLocation || (language === 'ar' ? 'الجزائر' : 'Algiers'),
      manager: whManager || (language === 'ar' ? 'مدير المستودع' : 'Warehouse Manager'),
      totalCapacity: Number(whCapacity) || 1000
    });

    setIsAddWarehouseOpen(false);
    setWhName('');
    setWhLocation('');
    setWhManager('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const wh = warehouses.find(w => w.id === warehouseId);

    addProduct({
      sku,
      name,
      nameEn: nameEn || name,
      category,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
      minQuantity: Number(minQuantity),
      warehouseId,
      warehouseName: wh ? wh.name : 'المستودع الرئيسي',
      unit,
      expiryDate: expiryDate || undefined
    });

    setIsAddProductOpen(false);
    setSku('');
    setName('');
    setNameEn('');
    setCostPrice(1000);
    setSellingPrice(1500);
    setQuantity(10);
    setExpiryDate('');
  };

  const filteredProducts = products.filter(p => {
    let matchesSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matchesSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const lowStockCount = products.filter(p => p.status === 'low_stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out_of_stock').length;
  const expiredCount = products.filter(p => p.status === 'expired').length;
  const expiringSoonCount = products.filter(p => p.status === 'expiring_soon').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-400" />
            <span>{language === 'ar' ? 'إدارة المخزون وتنبيهات الصلاحية' : 'Inventory & Expiration Alerts'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'مراقبة كميات الأصناف، إشعارات نفاذ ونقص المخزون، وتتبع تواريخ صلاحية المنتجات.' 
              : 'Monitor stock levels, low/out-of-stock alerts, and product expiration dates.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => checkInventoryAlerts()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs sm:text-sm transition shrink-0 shadow-md"
            title={language === 'ar' ? 'فحص المخزون وإطلاق التنبيهات في النظام' : 'Check Inventory & Fire Notifications'}
          >
            <Bell className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>{language === 'ar' ? 'فحص وتحديث التنبيهات' : 'Check Inventory Alerts'}</span>
          </button>

          <button
            onClick={() => setIsScanOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>{language === 'ar' ? 'مسح باركود' : 'Scan Barcode'}</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-950/40 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة صنف جديد (SKU)' : 'Add Inventory Item'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف جميع بيانات المخزون والمستودعات المسجلة؟' : 'Are you sure you want to delete all inventory and warehouse records?')) {
                clearInventoryAndWarehouses();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-bold text-xs transition shrink-0"
            title={language === 'ar' ? 'حذف كافة بيانات المخزون والمستودعات' : 'Clear All Inventory & Warehouse Data'}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">{language === 'ar' ? 'مسح الكل' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Inventory Alert Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter(statusFilter === 'low_stock' ? 'all' : 'low_stock')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'low_stock' 
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/30' 
              : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{language === 'ar' ? 'نقص المخزون' : 'Low Stock'}</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">{lowStockCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'أصناف بلغت حد الأمان' : 'Items at safety point'}</p>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'out_of_stock' ? 'all' : 'out_of_stock')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'out_of_stock' 
              ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/30' 
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{language === 'ar' ? 'نفاذ المخزون' : 'Out of Stock'}</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400">{outOfStockCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'أصناف كميتها صفر' : 'Items with 0 qty'}</p>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'expiring_soon' ? 'all' : 'expiring_soon')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'expiring_soon' 
              ? 'bg-orange-950/40 border-orange-500 shadow-lg shadow-orange-950/30' 
              : 'bg-slate-900 border-slate-800 hover:border-orange-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{language === 'ar' ? 'اقتراب الانتهاء' : 'Expiring Soon'}</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-orange-400">{expiringSoonCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'خلال 30 يوماً القادمة' : 'Expiring in 30 days'}</p>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'expired' ? 'all' : 'expired')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'expired' 
              ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/30' 
              : 'bg-slate-900 border-slate-800 hover:border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{language === 'ar' ? 'منتهي الصلاحية' : 'Expired Stock'}</span>
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-red-400">{expiredCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'تجاوزت تاريخ الصلاحية' : 'Past expiration date'}</p>
        </div>
      </div>

      {/* Warehouse Status Overview Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <WarehouseIcon className="w-4 h-4 text-purple-400" />
          <span>{language === 'ar' ? 'المستودعات والمخازن' : 'Warehouses'} ({warehouses.length})</span>
        </h3>
        <button
          onClick={() => setIsAddWarehouseOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5 text-purple-400" />
          <span>{language === 'ar' ? 'إضافة مستودع جديد' : 'Add Warehouse'}</span>
        </button>
      </div>

      {/* Warehouse Status Overview Cards */}
      {warehouses.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs sm:text-sm">
          {language === 'ar' ? 'لا توجد مستودعات مسجلة حالياً.' : 'No warehouses registered.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map(wh => (
            <div key={wh.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <WarehouseIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{wh.name}</h3>
                    <p className="text-xs text-slate-400">{wh.location} • المسؤول: {wh.manager}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">
                    {wh.usedCapacityPercentage}% {language === 'ar' ? 'ممتلئ' : 'Full'}
                  </span>
                  <button
                    onClick={() => deleteWarehouse(wh.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                    title={language === 'ar' ? 'حذف المستودع' : 'Delete Warehouse'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${wh.usedCapacityPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inventory Table & Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-850">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white">{language === 'ar' ? 'دليل الأصناف والمنتجات' : 'Products & SKU Master Catalog'}</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${statusFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              {language === 'ar' ? 'الكل' : 'All'} ({products.length})
            </button>
            <button
              onClick={() => setStatusFilter('low_stock')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${statusFilter === 'low_stock' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-amber-400'}`}
            >
              {language === 'ar' ? 'منخفض' : 'Low Stock'} ({lowStockCount})
            </button>
            <button
              onClick={() => setStatusFilter('out_of_stock')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${statusFilter === 'out_of_stock' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-rose-400'}`}
            >
              {language === 'ar' ? 'نفد' : 'Out of Stock'} ({outOfStockCount})
            </button>
            <button
              onClick={() => setStatusFilter('expiring_soon')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${statusFilter === 'expiring_soon' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-orange-400'}`}
            >
              {language === 'ar' ? 'قريب الانتهاء' : 'Expiring Soon'} ({expiringSoonCount})
            </button>
            <button
              onClick={() => setStatusFilter('expired')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${statusFilter === 'expired' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-red-400'}`}
            >
              {language === 'ar' ? 'منتهي الصلاحية' : 'Expired'} ({expiredCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">{language === 'ar' ? 'اسم المنتج / الصنف' : 'Item Name'}</th>
                <th className="p-4">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                <th className="p-4">{language === 'ar' ? 'سعر البيع' : 'Selling Price'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'الكمية الحالية' : 'Stock Qty'}</th>
                <th className="p-4">{language === 'ar' ? 'تاريخ الصلاحية' : 'Expiry Date'}</th>
                <th className="p-4">{language === 'ar' ? 'الحالة والتنبيه' : 'Status & Alerts'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    {language === 'ar' ? 'لا توجد أصناف تطابق التصفية الحالية' : 'No items match current filter.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-800/60 transition">
                    <td className="p-4 font-mono font-bold text-slate-300">{prod.sku}</td>
                    <td className="p-4 font-bold text-white">
                      <div>{prod.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{prod.warehouseName}</div>
                    </td>
                    <td className="p-4 text-slate-400">{prod.category}</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(prod.sellingPrice)}</td>
                    
                    {/* Quantity Adjustment Buttons */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateProductQuantity(prod.id, Math.max(0, prod.quantity - 1))}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white w-8 text-center">{prod.quantity}</span>
                        <button
                          onClick={() => updateProductQuantity(prod.id, prod.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="p-4 font-mono text-xs">
                      {prod.expiryDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={prod.status === 'expired' ? 'text-red-400 font-bold underline' : prod.status === 'expiring_soon' ? 'text-orange-400 font-bold' : 'text-slate-300'}>
                            {prod.expiryDate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                        prod.status === 'in_stock' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : prod.status === 'low_stock'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : prod.status === 'out_of_stock'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : prod.status === 'expired'
                                ? 'bg-red-600/20 text-red-400 border-red-500/40 animate-pulse'
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      }`}>
                        {prod.status === 'in_stock' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {prod.status === 'low_stock' && <TrendingDown className="w-3 h-3 text-amber-400" />}
                        {prod.status === 'out_of_stock' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                        {prod.status === 'expired' && <AlertOctagon className="w-3 h-3 text-red-400" />}
                        {prod.status === 'expiring_soon' && <Clock className="w-3 h-3 text-orange-400" />}

                        {prod.status === 'in_stock' ? (language === 'ar' ? 'متوفر' : 'In Stock') :
                         prod.status === 'low_stock' ? (language === 'ar' ? 'نقص بالمخزون' : 'Low Stock') :
                         prod.status === 'out_of_stock' ? (language === 'ar' ? 'نفد بالمخزون' : 'Out of Stock') :
                         prod.status === 'expired' ? (language === 'ar' ? 'منتهي الصلاحية!' : 'Expired!') :
                         (language === 'ar' ? 'قريب الانتهاء' : 'Expiring Soon')}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(language === 'ar' ? 'هل تريد حذف هذا المنتج؟' : 'Delete item?')) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
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

      {/* Modal: Add Product */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title={language === 'ar' ? 'إضافة منتج جديد لكتالوج المخزون' : 'Add Inventory SKU'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU كود المنتج</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. HW-SRV-99"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'الفئة' : 'Category'}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="الأجهزة والحواسيب Hardware">الأجهزة والحواسيب Hardware</option>
                <option value="البرمجيات Software">البرمجيات Software</option>
                <option value="الشبكات Networking">الشبكات Networking</option>
                <option value="الأمان والتشفير Security">الأمان والتشفير Security</option>
                <option value="الملحقات Power Accessories">الملحقات Power Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'اسم المنتج بالعربية' : 'Item Name (Arabic)'}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'سعر التكلفة' : 'Cost Price'}</label>
              <input
                type="number"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'سعر البيع' : 'Selling Price'}</label>
              <input
                type="number"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'الكمية المتوفرة' : 'Stock Quantity'}</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'حد الأمان لإعادة الطلب' : 'Min Safety Point'}</label>
              <input
                type="number"
                required
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'المستودع' : 'Warehouse'}</label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'تاريخ انتهاء الصلاحية (اختياري)' : 'Expiry Date (Optional)'}</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
            >
              {language === 'ar' ? 'حفظ المنتج' : 'Save SKU'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
      />

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isAddWarehouseOpen}
        onClose={() => setIsAddWarehouseOpen(false)}
        title={language === 'ar' ? 'إضافة مستودع / مخزن جديد' : 'Add New Warehouse'}
      >
        <form onSubmit={handleCreateWarehouse} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'اسم المستودع' : 'Warehouse Name'}</label>
            <input
              type="text"
              required
              value={whName}
              onChange={(e) => setWhName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: المستودع المركزي - وهران' : 'e.g. Central Warehouse'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'الموقع / الولاية' : 'Location'}</label>
              <input
                type="text"
                value={whLocation}
                onChange={(e) => setWhLocation(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: المنطقة الصناعية - البليدة' : 'Location'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'المسؤول عن المستودع' : 'Manager'}</label>
              <input
                type="text"
                value={whManager}
                onChange={(e) => setWhManager(e.target.value)}
                placeholder={language === 'ar' ? 'اسم أمين المخزن' : 'Manager Name'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'السعة الكلية التقديرية (وحدة)' : 'Total Capacity'}</label>
            <input
              type="number"
              value={whCapacity}
              onChange={(e) => setWhCapacity(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddWarehouseOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
            >
              {language === 'ar' ? 'إضافة المستودع' : 'Add Warehouse'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
