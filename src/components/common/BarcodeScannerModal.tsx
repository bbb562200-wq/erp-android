import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Camera, 
  Search, 
  Package, 
  CheckCircle2, 
  X, 
  Plus, 
  Minus, 
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from './Modal';
import { Product } from '../../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { products, updateProductQuantity, formatCurrency, language } = useERP();
  const [scannedSKU, setScannedSKU] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Auto-scan simulation timer or SKU match
  useEffect(() => {
    if (scannedSKU.trim()) {
      const match = products.find(p => p.sku.toLowerCase() === scannedSKU.trim().toLowerCase());
      if (match) {
        setScannedProduct(match);
      } else {
        setScannedProduct(null);
      }
    } else {
      setScannedProduct(null);
    }
  }, [scannedSKU, products]);

  const handleSimulateScan = (product: Product) => {
    setScannedSKU(product.sku);
    setScannedProduct(product);
    setFeedbackMsg(language === 'ar' ? `تم مسح الباركود الخاص بـ ${product.name}` : `Scanned barcode for ${product.name}`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'ar' ? 'ماسح الباركود والرموز (SKU Scanner)' : 'Product Barcode & SKU Scanner'}
    >
      <div className="space-y-5">
        
        {/* Camera / Scanner Simulation Screen */}
        <div className="relative rounded-2xl bg-slate-950 border-2 border-emerald-500/40 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
          {/* Animated Scanning Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
          
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 mb-4">
            <Camera className="w-4 h-4 animate-spin" />
            <span>{language === 'ar' ? 'الكاميرا نشطة - جاهز للمسح الضوئي' : 'Scanner Active'}</span>
          </div>

          <div className="w-48 h-24 border-2 border-dashed border-emerald-500/60 rounded-xl flex items-center justify-center relative bg-emerald-950/20">
            <Scan className="w-12 h-12 text-emerald-400 opacity-80" />
            
            {/* Corner Markers */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            {language === 'ar' ? 'وجّه باركود المنتج أمام الكاميرا أو ادخل رقم الـ SKU يدوياً بالأسفل' : 'Point barcode at camera or enter SKU manually below'}
          </p>

          {feedbackMsg && (
            <div className="mt-2 text-xs font-bold text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-lg animate-bounce">
              {feedbackMsg}
            </div>
          )}
        </div>

        {/* Manual Input or Quick Simulation list */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            {language === 'ar' ? 'إدخال رقم الباركود / SKU يدوياً' : 'Manual SKU Barcode Entry'}
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3 right-3 text-slate-500 rtl:right-3 ltr:left-3" />
            <input
              type="text"
              value={scannedSKU}
              onChange={(e) => setScannedSKU(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: HW-SRV-01, NET-SW-48P' : 'e.g. HW-SRV-01'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-10 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Scanned Result Card */}
        {scannedProduct ? (
          <div className="p-4 rounded-2xl bg-slate-800 border-2 border-emerald-500/50 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                    {scannedProduct.sku}
                  </span>
                  <span className="text-xs text-slate-400">{scannedProduct.category}</span>
                </div>
                <h4 className="font-bold text-white text-base mt-1">{scannedProduct.name}</h4>
                <p className="text-xs text-slate-400">{scannedProduct.warehouseName}</p>
              </div>

              <div className="text-right rtl:text-right ltr:text-left">
                <p className="font-bold text-emerald-400 text-lg">{formatCurrency(scannedProduct.sellingPrice)}</p>
                <p className="text-xs text-slate-400">{language === 'ar' ? 'التكلفة:' : 'Cost:'} {formatCurrency(scannedProduct.costPrice)}</p>
              </div>
            </div>

            {/* Simulated Barcode Render */}
            <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
              <div className="flex items-center gap-1 h-10">
                {scannedProduct.sku.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`h-full ${
                      idx % 2 === 0 ? 'bg-black w-1' : idx % 3 === 0 ? 'bg-black w-2' : 'bg-transparent w-1'
                    }`}
                  />
                ))}
                <div className="bg-black w-2 h-full" />
                <div className="bg-transparent w-1 h-full" />
                <div className="bg-black w-1.5 h-full" />
                <div className="bg-transparent w-1 h-full" />
                <div className="bg-black w-3 h-full" />
              </div>
              <p className="text-[10px] font-mono font-bold text-black tracking-widest">{scannedProduct.sku}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">{language === 'ar' ? 'الكمية بالمخزن:' : 'Stock Qty:'}</span>
                <span className="font-mono font-bold text-white text-sm bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                  {scannedProduct.quantity} {scannedProduct.unit}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateProductQuantity(scannedProduct.id, scannedProduct.quantity + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-emerald-400 font-bold text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إضافة للمخزون' : '+ Stock'}</span>
                </button>

                {onSelectProduct && (
                  <button
                    onClick={() => {
                      onSelectProduct(scannedProduct);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'اختيار بالفاتورة' : 'Select'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : scannedSKU.trim() ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-300">
            {language === 'ar' ? 'لم يتم العثور على منتج بهذا الباركود/SKU' : 'No product found matching this SKU'}
          </div>
        ) : null}

        {/* Preset SKUs simulation list */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-semibold">
            {language === 'ar' ? 'اختر منتجاً لاختبار المسح السريع:' : 'Quick Barcode Scan Test:'}
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => handleSimulateScan(p)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-right rtl:text-right ltr:text-left border border-slate-700 transition flex items-center justify-between"
              >
                <div className="truncate">
                  <p className="font-bold text-white text-xs truncate">{p.name}</p>
                  <p className="font-mono text-[10px] text-emerald-400">{p.sku}</p>
                </div>
                <QrCode className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
};
