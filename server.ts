import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initialArticles, Article } from "./src/data/mockArticles.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for live sessions (falls back to mockArticles)
let articles: Article[] = [...initialArticles];
let isFetchedLive = false;
let isFetchingInProgress = false;

// Initialize Google Gen AI client lazily
let aiInstance: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment secrets. Real news web queries will fall back to local curated reports.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Fetch real Arabic news using Gemini with Google Search Grounding to completely replace mock articles
async function fetchRealArabicNews(): Promise<Article[] | null> {
  const ai = getAiClient();
  if (!ai) {
    console.warn("⚠️ Cannot fetch real Arabic news because GEMINI_API_KEY is not configured.");
    return null;
  }

  console.log("🌐 Calling Gemini API with Search Grounding to fetch 100% REAL Arabic news...");
  try {
    const prompt = `ابحث وتأكد من الأحداث الأخبارية الحقيقية الجارية حالياً اليوم في الشرق الأوسط، العالم العربي، والمحيط الدولي لشهر مايو ٢٠٢٦ م (أو الأيام القليلة الماضية).
قم بصياغة وتوفير مصفوفة جيسون (JSON array) تشتمل على ١٠ إلى ١٢ مقالاً إخبارياً حقيقياً وموثقاً مئة بالمئة (100% real Arabic journalism) من مصادر موثوقة وعالية الهيبة مثل "إندبندنت عربية"، "العربية"، "سكاي نيوز عربية"، أو "الجزيرة"، مع تجنب أي بروباغندا أو انحياز.

أقسام الموقع وطريقة تصفيتها تتطلب مطابقة الفئات تماماً للقيم الحرفية التالية باللغة العربية:
- "الشرق الأوسط"
- "العالم"
- "الاقتصاد"
- "ثقافة وفنون"
- "تكنولوجيا"
- "صحة وعلوم"
- "الرياضة"
- "مختارات التحرير"
- "الحصريات" (للأخبار الحصرية والعاجلة والهامة)
- "في العمق"

يرجى الالتزام التام ببيانات JSON لكل مقال بالهيكل التالي:
- id: معرف مميز يبدأ بجزء من اسم القسم ثم رقم (مثلاً: "pol_1", "eco_2", "ex_3").
- title: عنوان صحفي حقيقي واحترافي ودقيق للحدث الحاصل اليوم باللغة العربية الفصحى الراقية.
- subtitle: عنوان فرعي شارح بفقرة قصيرة وجذابة تلخص هذا الحدث الحقيقي ونقاطه الأساسية.
- content: محتوى المقال الإخباري بالتفصيل (لا يقل عن ٣ فقرات مفصلة تحتوي على شروحات غنية بالحقائق والتواريخ والأسماء والأرقام الدقيقة التي عثرت عليها في محرك البحث).
- category: يجب أن يكون أحد الأقسام المذكورة أعلاه تماماً.
- author: اسم الصحفي أو المراسل الحقيقي أو المعتاد لتغطية هذه الأحداث (مثلاً: "إبراهيم ريحان"، "مكتب الرياض"، "خليل مراد").
- image: رابط صورة ذو جودة عالية يلائم تماماً الحدث الإخباري ويكون من Unsplash حصرياً. اختر صوراً ملائمة للموضوع:
  * للسياسة: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800" أو صور مؤتمرات حقيقية.
  * للاقتصاد: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800"
  * للتكنولوجيا: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
  * للثقافة والفنون: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800"
  * للرياضة: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
  * للعلوم: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800"
- timestamp: الطابع الزمني باللغة العربية، مثل "منذ ساعة"، "منذ ساعتين"، "منذ ٤ ساعات"، إلخ.
- isFeatured: حدد مقالاً رئيسياً واحداً هاماً جداً ليكون true والآخرين false.
- isBreaking: حدد مقالاً واحداً عاجلاً ليكون true والباقي false.
- views: عدد مشاهدات حقيقي مقدر عشوائياً (بين ١٥٠ و٨٠٠٠).
- readTime: وقت القراءة المقدر، مثل "قراءة ٣ دقائق" أو "قراءة ٥ دقائق".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["id", "title", "subtitle", "content", "category", "author", "image", "timestamp", "isFeatured", "isBreaking", "views", "readTime"],
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING },
              author: { type: Type.STRING },
              image: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              isFeatured: { type: Type.BOOLEAN },
              isBreaking: { type: Type.BOOLEAN },
              views: { type: Type.INTEGER },
              readTime: { type: Type.STRING }
            }
          }
        }
      }
    });

    const articlesText = response.text!.trim();
    const fetchedArticles = JSON.parse(articlesText) as Article[];
    if (Array.isArray(fetchedArticles) && fetchedArticles.length > 0) {
      console.log(`✅ Fully harvested ${fetchedArticles.length} active Arabic news articles via Search Grounding.`);
      return fetchedArticles;
    }
    return null;
  } catch (error) {
    console.error("❌ Failed to harvest Arabic news from web search grounding:", error);
    return null;
  }
}

// Background startup loader for live real-time news
async function backgroundSyncRealNews() {
  if (isFetchedLive || isFetchingInProgress) return;
  isFetchingInProgress = true;
  try {
    const live = await fetchRealArabicNews();
    if (live && live.length > 0) {
      articles = live;
      isFetchedLive = true;
      console.log("🌟 Startup background sync complete! Live genuine articles loaded.");
    }
  } catch (e) {
    console.error("Failed executing startup news background sync:", e);
  } finally {
    isFetchingInProgress = false;
  }
}

// Try running background sync immediately upon module load
setTimeout(backgroundSyncRealNews, 100);

// ==========================================
// API Endpoints
// ==========================================

// Get all articles
app.get("/api/articles", (req, res) => {
  res.json(articles);
});

// Create new article
app.post("/api/articles", (req, res) => {
  const { title, subtitle, content, category, author, image, timestamp, isFeatured, isBreaking, readTime } = req.body;

  if (!title || !content || !category) {
    res.status(400).json({ error: "العنوان والقسم والمحتوى حقول مطلوبة" });
    return;
  }

  // If set to featured, disable older feature status
  if (isFeatured) {
    articles = articles.map(art => ({ ...art, isFeatured: false }));
  }

  const newArticle: Article = {
    id: Date.now().toString(),
    title,
    subtitle: subtitle || "",
    content,
    category,
    author: author || "محرر إندبندنت",
    image: image || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    timestamp: timestamp || "الآن",
    isFeatured: !!isFeatured,
    isBreaking: !!isBreaking,
    views: 0,
    readTime: readTime || "قراءة ٣ دقائق"
  };

  articles.unshift(newArticle);
  res.status(201).json(newArticle);
});

// Update an article
app.put("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  const index = articles.findIndex(art => art.id === id);

  if (index === -1) {
    res.status(404).json({ error: "المقال غير موجود" });
    return;
  }

  const { title, subtitle, content, category, author, image, timestamp, isFeatured, isBreaking, readTime, views } = req.body;

  if (isFeatured) {
    articles = articles.map(art => art.id === id ? art : { ...art, isFeatured: false });
  }

  articles[index] = {
    ...articles[index],
    title: title !== undefined ? title : articles[index].title,
    subtitle: subtitle !== undefined ? subtitle : articles[index].subtitle,
    content: content !== undefined ? content : articles[index].content,
    category: category !== undefined ? category : articles[index].category,
    author: author !== undefined ? author : articles[index].author,
    image: image !== undefined ? image : articles[index].image,
    timestamp: timestamp !== undefined ? timestamp : articles[index].timestamp,
    isFeatured: isFeatured !== undefined ? !!isFeatured : articles[index].isFeatured,
    isBreaking: isBreaking !== undefined ? !!isBreaking : articles[index].isBreaking,
    views: views !== undefined ? views : articles[index].views,
    readTime: readTime !== undefined ? readTime : articles[index].readTime
  };

  res.json(articles[index]);
});

// Delete an article
app.delete("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = articles.length;
  articles = articles.filter(art => art.id !== id);

  if (articles.length === initialLength) {
    res.status(404).json({ error: "المقال غير موجود" });
    return;
  }

  res.json({ success: true, message: "تم حذف المقال بنجاح" });
});

// Reset articles to default or pull fresh live news
app.post("/api/articles/reset", async (req, res) => {
  console.log("🔄 Reset request received: attempting to fetch fresh live news via Google Search Grounding first...");
  const live = await fetchRealArabicNews();
  if (live && live.length > 0) {
    articles = live;
    isFetchedLive = true;
    res.json(articles);
  } else {
    console.log("⚠️ Fallback to curated template articles due to missing key or query error.");
    articles = [...initialArticles];
    res.json(articles);
  }
});

// Explicit Sync Live News from Google Search on-demand
app.post("/api/articles/sync-live", async (req, res) => {
  console.log("🌐 Explicit live news sync requested...");
  const live = await fetchRealArabicNews();
  if (live && live.length > 0) {
    articles = live;
    isFetchedLive = true;
    res.json({ success: true, count: live.length, articles });
  } else {
    // If it fails, we keep the current cache intact but report the message
    res.status(500).json({ 
      success: false, 
      error: "فشل جلب الأخبار الحية عبر البحث المباشر. يرجى التأكد من تفعيل مفتاح البيئة GEMINI_API_KEY في صفحة الإعدادات.",
      articles 
    });
  }
});

// Generate Article using Gemini API
app.post("/api/gemini/generate", async (req, res) => {
  const { prompt, category, style } = req.body;

  if (!prompt) {
     res.status(400).json({ error: "الرجاء إدخال فكرة أو موضوع للمقال" });
     return;
  }

  const ai = getAiClient();
  const selectedCategory = category || "سياسة";
  const selectedStyle = style || "تحليلي";

  // Prompt styling instructions for professional journalism
  const systemInstruction = 
    `أنت كاتب وصحفي محترف ومخضرم في صحيفة "إندبندنت عربية" (Independent Arabia). 
    تكتب بلغة عربية فصحى راقية، بأسلوب رصين، محايد وعميق جداً، تماماً بنفس طابع مقالات وتحليلات صحيفة الإندبندنت البريطانية الصادرة بالعربية. 
    تجنب التهويل والشعبوية، وركّز على العمق والتحليل المنطقي والمفردات اللغوية الغنية والمترابطة. 

    يجب أن يتطابق مخرجك تماماً مع الهيكل التالي بنوع بيانات JSON مع الحقول:
    - title: عنوان صحفي جذاب ومميز ومختصر (العربية الفصحى).
    - subtitle: عنوان فرعي شارح ومفصل وجذاب يلخص الفكرة والتحليل.
    - content: المقال المتكامل والعميق (لا يقل عن 3 فقرات مفصلة تحتوي على شروحات غنية)، مع تجنب تكرار العبارات والبدء بمفتاح التموضع الزمني أو المكاني.
    - readTime: تقدير لزمن القراءة باللغة العربية (مثلاً: "قراءة ٤ دقائق").
    - author: اسم كاتب صحفي عربي مرموق ومستعار (مثلاً: "عبدالله باقر" أو "د. سمير الخطيب" أو "دينا الراوي").

    اكتب المقال في سياق القسم المختار: "${selectedCategory}" وطابع الكتابة المطلوب: "${selectedStyle}".`;

  if (!ai) {
    // Graceful fallback for demo when API key is missing
    console.log("No Gemini API key. Providing a high-quality pre-written translation/mock news article to ensure working app...");
    
    // Dynamically create some realistic, creative responses matching the prompt using static heuristics to feel alive
    const fallbackAuthors = ["د. سمير الخطيب", "عبدالله باقر", "دينا الراوي", "ياسر الكعبي"];
    const author = fallbackAuthors[Math.floor(Math.random() * fallbackAuthors.length)];
    
    setTimeout(() => {
      res.json({
        title: `تحليل خاص: مستقبل العلاقات السياسية والاقتصادية في ضوء التطورات الأخيرة لـ "${prompt}"`,
        subtitle: `قراءة معمقة في الأبعاد الاستراتيجية وانعكاسات التحولات الإقليمية على التموضع الجديد للأنشطة والتحالفات المستجدة`,
        content: `تتسارع وتيرة التطورات الاستراتيجية حول مسألة "${prompt}"، فارضةً أسئلة حيوية تتعلق بالجهوزية الإقليمية لمواجهة التداعيات المباشرة والبعيدة المدى على حد سواء. ويرى مراقبون أن التحولات الراهنة لا تقتصر على مستواها الإجرائي، بل تذهب عميقاً في إعادة هيكلة الأبعاد الأمنية والاقتصادية للمنطقة ككل.

وتشير التقديرات الأولية إلى أن الأطراف الفاعلة تسعى لبلورة استراتيجيات مرنة تستوعب التقلبات الحاصلة، وهو ما يعكس رغبة واضحة في تحييد الأنشطة الحيوية عن التجاذبات المباشرة وضمان استدامة مصالحها المشتركة في فترات التحول المعقدة.

وفي نهاية المطاف، يبقى الترقب سيد الموقف، إذ يؤكد خبراء العلاقات الدولية أن الشهور المقبلة ستكون حاسمة في بلورة ملامح العهد الجديد، مما يفرض على صانعي القرار اعتماد مقاربات شمولية تتجاوز الحلول المؤقتة لتلامس جوهر التحديات الهيكلية القائمة. (تنبيه: تم تقديم هذا المقال التجريبي نظراً لعدم توثيق مفتاح GEMINI_API_KEY في إعدادات التطبيق الرائجة).`,
        readTime: "قراءة ٣ دقائق",
        author: `${author} - كاتب ومحلل`
      });
    }, 1500);
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `اكتب مقالاً حول الفكرة التالية: "${prompt}" في سياق قسم: "${selectedCategory}" وبأسلوب: "${selectedStyle}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "subtitle", "content", "readTime", "author"],
          properties: {
            title: { type: Type.STRING, description: "Professional short catchy journalism headline" },
            subtitle: { type: Type.STRING, description: "Detailed summary tagline fully explaining the article core" },
            content: { type: Type.STRING, description: "Complete article text in classical Arabic. At least 3 full robust paragraphs split by double newlines." },
            readTime: { type: Type.STRING, description: "Estimated read time in Arabic, e.g. 'قراءة ٥ دقائق'" },
            author: { type: Type.STRING, description: "Prestigious writer name with brief title, e.g. 'د. إبراهيم يونس - كاتب سياسي'" }
          }
        }
      }
    });

    const textOutput = response.text!.trim();
    const articleData = JSON.parse(textOutput);
    res.json(articleData);

  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي لتوليد المقال",
      details: error.message 
    });
  }
});

// Generate Article summary
app.post("/api/gemini/summarize", async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    res.status(400).json({ error: "المحتوى مطلوب لغايات التلخيص" });
    return;
  }

  const ai = getAiClient();

  const systemInstruction = 
    `أنت خبير تلخيص صحفي ومساعد ذكي لقراء صحيفة "إندبندنت عربية". 
    عملك هو تلخيص المقال الصحفي الطويل المعروض أمامك في ثلاث نقاط (3 ركائز أساسية) موجزة وغنية ومكتوبة بأسلوب تحليلي رصين ومختصر باللغة العربية الفصحى. 
    يجب أن يتطابق المخرج تماماً مع بنية JSON التالية كحقل أساسي:
    - bullets: مصفوفة من ثلاث سلاسل نصية قصيرة وواضحة جداً (array of 3 strings).`;

  if (!ai) {
    console.log("No Gemini API key for summary. Returning smart static bullets...");
    setTimeout(() => {
      res.json({
        bullets: [
          `يستكشف هذا التحليل الأبعاد الجيوسياسية المباشرة للأزمة الراهنة وانعكاساتها الفورية على استدامة قطاعات الأعمال والإنتاج المشتركة.`,
          `يؤكد الباحثون على ضرورة تبني نموذج تخطيط مرن واحتواء مسبق للتقلبات الاقتصادية بدلاً من الاكتفاء بالتدابير الإسعافية المؤقتة.`,
          `تظل التفاهمات الإقليمية المشتركة الضمانة الأساسية لتحييد الممرات والموارد الحيوية عن تداعيات التنافس التجاري والتقني المحتدم.`
        ]
      });
    }, 1200);
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `لخص المقال التالي المعنون بـ "${title || 'مقال صحفي'}" وصغ ركائزه الثلاث الأساسية:\n\n${content}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["bullets"],
          properties: {
            bullets: {
              type: Type.ARRAY,
              description: "Three high-quality strategic takeaways in Arabic",
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const textOutput = response.text!.trim();
    const result = JSON.parse(textOutput);
    res.json(result);

  } catch (error: any) {
    console.error("Gemini Summarize Error:", error);
    res.status(500).json({
      error: "تعذر صياغة ملخص الذكاء الاصطناعي حالياً",
      details: error.message
    });
  }
});

// ==========================================
// Vite Dev Server / Static In Production
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Independent Arabia Clone Server started on: http://localhost:${PORT}`);
  });
}

start();
