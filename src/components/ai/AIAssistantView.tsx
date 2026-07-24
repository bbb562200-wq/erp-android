import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  FileSearch, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  Loader2,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AIAssistantView: React.FC = () => {
  const { 
    language, 
    invoices, 
    products, 
    employees, 
    transactions,
    addInvoice,
    formatCurrency
  } = useERP();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Document parser state
  const [docText, setDocText] = useState('');
  const [parsingLoading, setParsingLoading] = useState(false);
  const [parsedInvoice, setParsedInvoice] = useState<any | null>(null);

  // Quick preset triggers
  const handleRunAnalysis = async (customPrompt?: string) => {
    setLoading(true);
    setAiReport(null);

    const queryPrompt = customPrompt || prompt || 'قدم لي تقريراً تنفذياً شاملاً عن الوضع المالي والمخزون مع التوصيات.';

    const metricsSummary = {
      totalInvoicesCount: invoices.length,
      paidRevenue: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0),
      pendingRevenue: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0),
      overdueRevenue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0),
      totalProductsSKUs: products.length,
      lowStockItemsCount: products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      monthlyPayroll: employees.reduce((s, e) => s + e.baseSalary, 0)
    };

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: metricsSummary,
          prompt: queryPrompt,
          language
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAiReport(data.analysis);
      } else {
        setAiReport('تعذر استلام التقرير، يرجى المحاولة لاحقاً.');
      }
    } catch (err) {
      console.error(err);
      setAiReport('حدث خطأ في الاتصال بسيرفر الذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  const handleParseDocument = async () => {
    if (!docText.trim()) return;
    setParsingLoading(true);
    setParsedInvoice(null);

    try {
      const res = await fetch('/api/ai/parse-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent: docText, language })
      });

      const data = await res.json();
      if (data.extracted) {
        setParsedInvoice(data.extracted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setParsingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>مساعد القرارات التنفيذية الذكي Gemini AI</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'ar' ? 'التحليلات والاستشارات الاستراتيجية للمؤسسة' : 'Enterprise AI Strategy Advisor'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {language === 'ar'
                ? 'استخدام نموذج Gemini لتوليد تقارير مالية، توقع المبيعات القادمة، وتحليل العقود والمستندات بذكاء.'
                : 'Powered by Gemini for financial intelligence, demand forecasting & document parsing.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Interactive AI Advisor Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span>{language === 'ar' ? 'طلب استشارة تنفذية مباشرة' : 'Ask Executive Advisor'}</span>
            </h3>

            {/* Quick Prompt Presets */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'حلل الوضع المالي ونسب التحصيل المتأخر',
                'توقع مبيعات المخزون للربع القادم',
                'خطه خفض المصروفات والتحسين التشغيلي',
                'تقرير أداء الموارد البشرية والكتلة الأجرية'
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset);
                    handleRunAnalysis(preset);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 hover:text-emerald-300 transition flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{preset}</span>
                </button>
              ))}
            </div>

            {/* Prompt Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب استفسارك أو طلب التقرير المالي هنا...' : 'Type your ERP prompt or request analysis...'}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleRunAnalysis()}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{language === 'ar' ? 'تحليل' : 'Analyze'}</span>
              </button>
            </div>
          </div>

          {/* AI Response Report Container */}
          {aiReport && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'التقرير الاستراتيجي المولد بذكاء Gemini' : 'Generated Strategic AI Report'}</span>
                </div>
                <span className="text-[11px] text-slate-500">تم التوليد فوراً • سيرفر سحابي</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {aiReport}
              </div>
            </div>
          )}

        </div>

        {/* Right Smart Document Parser Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-teal-400" />
              <span>{language === 'ar' ? 'محلل العقود والفواتير الذكي' : 'Smart Document Parser'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ar' 
                ? 'الصق نص عقد أو عرض سعر وسيقوم الذكاء الاصطناعي باستخراج البنود والأسعار وتجهيز الفاتورة تلقائياً.' 
                : 'Paste text or contract details to auto-parse invoice line items.'}
            </p>
          </div>

          <textarea
            rows={5}
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            placeholder={language === 'ar' ? 'مثال: اتفقنا مع شركة الجزائر للحلول التقنية على توريد 10 أجهزة خادم بسعر 350,000 د.ج لكل جهاز مع ضمان سنة بقيمة 150,000 د.ج...' : 'Paste text snippet...'}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />

          <button
            onClick={handleParseDocument}
            disabled={parsingLoading || !docText.trim()}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {parsingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span>{language === 'ar' ? 'استخراج البيانات الذكي' : 'Extract Data'}</span>
          </button>

          {parsedInvoice && (
            <div className="p-4 rounded-xl bg-slate-800/90 border border-teal-500/30 text-xs space-y-2">
              <p className="font-bold text-emerald-400 text-sm">{language === 'ar' ? 'تمت معالجة المستند بنجاح:' : 'Extracted Invoice:'}</p>
              <p className="text-slate-200">العميل: <strong>{parsedInvoice.customerName}</strong></p>
              <p className="text-slate-200">المبلغ الإجمالي المستخرج: <strong className="text-emerald-400">{formatCurrency(parsedInvoice.totalAmount || 0)}</strong></p>
              
              <button
                onClick={() => {
                  addInvoice({
                    invoiceNumber: `INV-2026-AI${Math.floor(100 + Math.random() * 900)}`,
                    customerId: 'cust-1',
                    customerName: parsedInvoice.customerName || 'عميل مستخرج ذكياً',
                    date: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                    items: parsedInvoice.items || [],
                    subtotal: parsedInvoice.subtotal || 10000,
                    vatAmount: parsedInvoice.vatAmount || 1500,
                    totalAmount: parsedInvoice.totalAmount || 11500,
                    status: 'pending',
                    notes: 'تمت معالجة هذه الفاتورة تلقائياً بواسطة مساعد Gemini AI.'
                  });
                  alert('تم إنشاء الفاتورة وحفظها بالنظام بنجاح!');
                  setParsedInvoice(null);
                  setDocText('');
                }}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition mt-2"
              >
                {language === 'ar' ? 'تحويل لموديل الفواتير المعتمدة' : 'Save as Real Invoice'}
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
