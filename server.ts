import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client
  const getAI = () => {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // AI Endpoint: General Business & ERP Executive Insights
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { metrics, prompt, language = 'ar' } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        return res.json({
          analysis: language === 'ar'
            ? 'توصية الذكاء الاصطناعي النموذجية للمؤسسات الجزائرية:\n\n1. ينبغي تسريع تحصيل الفواتير المتأخرة بقيمة 737,800 د.ج لتحسين التدفق النقدي.\n2. إعادة طلب منتج "موزع شبكة 48 منفذ" نظراً لقرب نفاده من مستودع وهران الإقليمي.\n3. معدل نمو الإيرادات متزن (+18.5% مقارنة بالربع السابق) مع هامش ربحي ممتاز ومطابقة ضريبية DGI.'
            : 'Executive Summary for Algerian Operations:\n\n1. Expedite overdue receivables of 737,800 DZD to optimize cashflow.\n2. Reorder 48-Port Switches due to low inventory stock at Oran warehouse.\n3. Revenue trajectory remains strong (+18.5% QoQ) with full DGI compliance.'
        });
      }

      const systemInstruction = language === 'ar'
        ? 'أنت مستشار تنفيذي وخبير في التخطيط المالي والمخزون لإدارة الموارد المؤسسية (ERP). قدّم تحليلاً استراتيجياً وتوصيات عمل دقيقة باللغة العربية بأسلوب احترافي رفيع.'
        : 'You are an executive ERP financial and inventory strategist. Provide structured recommendations based on the provided business metrics.';

      const userPrompt = `
البيانات الحالية للمؤسسة:
${JSON.stringify(metrics, null, 2)}

الاستفسار:
${prompt || 'قدم لي تقريراً تنفذياً شاملاً عن الوضع المالي، المخزون، ونسب المخاطر مع 3 توصيات فورية.'}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: 'حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي.',
        details: error.message
      });
    }
  });

  // AI Endpoint: Sales & Demand Forecasting
  app.post('/api/ai/forecast', async (req, res) => {
    try {
      const { salesHistory, category, months = 3, language = 'ar' } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          forecast: language === 'ar'
            ? 'توقع مبيعات الربع القادم:\n- من المتوقع ارتفاع المبيعات بنسبة 14% لمنتجات الشبكات والبرمجيات السحابية.\n- يُنصح برفع المخزون الاحتياطي بنسبة 20% قبل موسم المشاريع الحكومية.'
            : 'Q3 Forecast:\n- Projected sales increase of 14% in Cloud & Networking software.\n- Increase safety stock by 20% prior to enterprise procurement season.'
        });
      }

      const prompt = `
بيانات المبيعات التاريخية للفئة (${category || 'العامة'}):
${JSON.stringify(salesHistory || [], null, 2)}

المطلوب:
توقع المبيعات للأشهر الـ ${months} القادمة، مع ذكر أهم العوامل المؤثرة ونسبة النمو المتوقعة.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'أنت خبير في علم البيانات والتنبؤ المالي والمبيعات للشركات.',
        }
      });

      res.json({ forecast: response.text });
    } catch (error: any) {
      console.error('Forecast Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Endpoint: Smart Invoice / Document Extractor
  app.post('/api/ai/parse-doc', async (req, res) => {
    try {
      const { textContent, language = 'ar' } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          extracted: {
            customerName: 'شركة الجزائر للحلول التقنية',
            items: [
              { description: 'خدمات استشارية وتهيئة خوادم', quantity: 1, unitPrice: 350000, total: 350000 }
            ],
            subtotal: 350000,
            vatAmount: 66500, // 19% TVA
            totalAmount: 416500,
            notes: 'نموذج مستخرج تجريبي - الجزائر'
          }
        });
      }

      const prompt = `
استخرج بيانات الفاتورة أو العقد التالي وحولها إلى كائن JSON ممهد:
Text input:
${textContent}

صيغة JSON المطلوبة:
{
  "customerName": "اسم العميل",
  "items": [
    { "description": "الوصف", "quantity": 1, "unitPrice": 1000, "total": 1000 }
  ],
  "subtotal": 1000,
  "vatAmount": 150,
  "totalAmount": 1150,
  "notes": "أي ملاحظات إضافية"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ extracted: parsed });
    } catch (error: any) {
      console.error('Doc Parse Error:', error);
      res.status(500).json({ error: 'تعذر تحليل النص.' });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ERP Server running on http://localhost:${PORT}`);
  });
}

startServer();
