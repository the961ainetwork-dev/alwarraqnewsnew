import React, { useState } from "react";
import { Article } from "../data/mockArticles.js";
import { 
  Plus, Trash2, Edit2, Sparkles, RefreshCw, ArrowRight, Save, FileText, Check, AlertCircle, Eye, Newspaper, CheckCircle
} from "lucide-react";

interface AdminPanelProps {
  articles: Article[];
  onCreateArticle: (data: Partial<Article>) => Promise<void>;
  onUpdateArticle: (id: string, data: Partial<Article>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onClose: () => void;
}

export default function AdminPanel({
  articles,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
  onClose
}: AdminPanelProps) {
  // Tab State
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  
  // Edit State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form inputs State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("سياسة");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState("قراءة ٣ دقائق");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Image Selection presets
  const imagePresets = [
    { name: "سياسة / مؤتمرات", url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800" },
    { name: "اقتصاد / أسواق مالية", url: "https://images.unsplash.com/photo-1610374792793-f016b77ca51a?auto=format&fit=crop&q=80&w=800" },
    { name: "مبانٍ / معالم تجارية", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
    { name: "ثقافة / مراجع مكتبة", url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800" },
    { name: "فضاء / تكنولوجيا فلك", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" }
  ];

  // AI Assistant generating states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCategory, setAiCategory] = useState("سياسة");
  const [aiStyle, setAiStyle] = useState("تحليلي");
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [aiResult, setAiResult] = useState<{
    title: string;
    subtitle: string;
    content: string;
    readTime: string;
    author: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Form messaging
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Action: Open Draft in Form
  const resetFormFields = () => {
    setTitle("");
    setSubtitle("");
    setContent("");
    setCategory("سياسة");
    setAuthor("");
    setImage("");
    setReadTime("قراءة ٣ دقائق");
    setIsFeatured(false);
    setIsBreaking(false);
    setEditingArticleId(null);
    setFormSuccess(null);
    setFormError(null);
  };

  const handleEditClick = (article: Article) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setSubtitle(article.subtitle || "");
    setContent(article.content);
    setCategory(article.category);
    setAuthor(article.author);
    setImage(article.image);
    setReadTime(article.readTime || "قراءة ٣ دقائق");
    setIsFeatured(!!article.isFeatured);
    setIsBreaking(!!article.isBreaking);
    
    setFormSuccess(null);
    setFormError(null);
    setActiveTab("form");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim() || !content.trim()) {
      setFormError("الرجاء إدخال العنوان والمحتوى بالكامل لتجنب أخطاء التحرير");
      return;
    }

    const payload: Partial<Article> = {
      title,
      subtitle,
      content,
      category,
      author: author || "محرر إندبندنت",
      image: image || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800",
      readTime,
      isFeatured,
      isBreaking
    };

    try {
      if (editingArticleId) {
        await onUpdateArticle(editingArticleId, payload);
        setFormSuccess("تم تحديث مقال العدد بنجاح!");
      } else {
        await onCreateArticle(payload);
        setFormSuccess("تم نشر مقال التحليل الجديد وإضافته إلى الصفحة الرئيسية بنجاح!");
      }
      setTimeout(() => {
        resetFormFields();
        setActiveTab("list");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setFormError("حدث خطأ أثناء الاتصال بالخادم لحفظ المقال.");
    }
  };

  // Action: Generate with Gemini
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError("الرجاء صياغة موضوع أو فكرة موجزة للمساعد الذكي.");
      return;
    }

    setAiIsGenerating(true);
    setAiError(null);
    setAiResult(null);

    const stages = [
      "جاري استدعاء خوارزميات جيميناي...",
      "جاري دراسة الأبعاد الاستراتيجية وحيازة الكلمات الرئيسية...",
      "يكتب المساعد مسودة المقال الآن بأسلوب الإندبندنت الفخم والرصين..."
    ];

    let currentStage = 0;
    setAiStatusMessage(stages[0]);
    const timer = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setAiStatusMessage(stages[currentStage]);
      }
    }, 1500);

    try {
      const resp = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          category: aiCategory,
          style: aiStyle
        })
      });

      if (!resp.ok) {
        throw new Error("تعذر إنتاج المخرج الذكي من الخادم");
      }

      const data = await resp.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiResult({
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        readTime: data.readTime,
        author: data.author
      });
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "فشلت عملية إنشاء المقال. الرجاء التأكد من بروتوكول الشبكة.");
    } finally {
      clearInterval(timer);
      setAiIsGenerating(false);
    }
  };

  // Action: Apply Gemini draft to the editor
  const handleApplyAiDraft = () => {
    if (!aiResult) return;
    setTitle(aiResult.title);
    setSubtitle(aiResult.subtitle);
    setContent(aiResult.content);
    setCategory(aiCategory);
    setAuthor(aiResult.author);
    setReadTime(aiResult.readTime);
    
    // Choose sensible preset image according to generated style category
    const foundPresetIdx = ["سياسة", "اقتصاد", "عمارة", "ثقافة", "علوم"].findIndex(cat => cat === aiCategory);
    if (foundPresetIdx !== -1) {
      setImage(imagePresets[foundPresetIdx].url);
    } else {
      setImage(imagePresets[0].url);
    }

    setFormSuccess("تم سكب مسودة جيميناي بنجاح في حقول الاستمارة! يمديك مراجعتها ونشرها فوراً.");
    setAiResult(null);
    setAiPrompt("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 min-h-[70vh] dir-rtl">
      {/* Admin Title Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-brand-primary pb-5 mb-8">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">بوابة هيئة التحرير والإشراف</span>
          <h2 className="serif-text text-xl md:text-3xl font-bold text-neutral-900 mt-1">
            غرفة التحكم وإدارة الأعداد والمقالات
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="text-xs bg-neutral-100 font-semibold px-4 py-2 border border-stone-200 rounded-sm hover:bg-neutral-200 text-neutral-700 flex items-center gap-1 cursor-pointer transition-all duration-150"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لشاشة القراءة</span>
          </button>
        </div>
      </div>

      {/* Grid Layout - Sidebar Co-Writer AI vs Form/Table List Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* RIGHT AREA / SIDEBAR: AI CO-WRITER */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900 text-stone-100 rounded-xs border border-neutral-800 p-5 space-y-5 shadow-lg select-none">
            <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
              <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="serif-text text-base font-bold text-neutral-50">المحرر الذكي جيميناي ⚡</h3>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              ضع عنواناً أولياً أو فكرة مقتضبة، وسيقوم نموذج <span className="text-red-400 font-semibold">Gemini 3.5 Flash</span> بصياغة عنوان صحفي، وعنوان فرعي ومضمون متكامل بأسلوب كتابة صحيفة الإندبندنت الشهير فورياً.
            </p>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-300">موضوع ومحور المقال:</label>
                <textarea
                  id="ai-prompt-input"
                  rows={3}
                  placeholder="مثال: تأثير انخفاض أسعار النفط، تدشين مترو الرياض، قراءة في رواية عربية شهيرة..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-neutral-850 text-stone-200 p-2 border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm placeholder-neutral-500 resize-none text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">القسم المستهدف:</label>
                  <select 
                    id="ai-category-select"
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    className="w-full bg-neutral-850 text-stone-200 p-1.5 border border-neutral-850 rounded-xs focus:ring-1 focus:ring-brand-primary text-[10px]"
                  >
                    <option value="سياسة">سياسة</option>
                    <option value="اقتصاد">اقتصاد</option>
                    <option value="ثقافة">ثقافة</option>
                    <option value="آراء">كتاب وآراء</option>
                    <option value="علوم وتكنولوجيا">علوم وتكنولوجيا</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">طابع الصياغة:</label>
                  <select 
                    id="ai-style-select"
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value)}
                    className="w-full bg-neutral-850 text-stone-200 p-1.5 border border-neutral-850 rounded-xs focus:ring-1 focus:ring-brand-primary text-[10px]"
                  >
                    <option value="تحليلي">تحليلي عميق</option>
                    <option value="تقرير">تقرير مقتضب</option>
                    <option value="رأي">مقال رأي هادئ</option>
                  </select>
                </div>
              </div>

              <button
                id="ai-generate-submit"
                onClick={handleAiGenerate}
                disabled={aiIsGenerating}
                className="w-full bg-brand-primary hover:bg-neutral-800 text-stone-100 font-bold py-2 rounded-xs flex items-center justify-center gap-1 transition-colors duration-150 py-2.5 text-[11px] border border-brand-primary hover:border-neutral-700 cursor-pointer"
              >
                {aiIsGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{aiIsGenerating ? "جاري الإنتاج ببهجة..." : "صغ مسودتي بالذكاء الاصطناعي"}</span>
              </button>
            </div>

            {/* AI result output display box */}
            {aiIsGenerating && (
              <div className="space-y-2 pt-2 animate-pulse text-xs text-neutral-400">
                <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{aiStatusMessage}</span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-xs w-full"></div>
                <div className="h-3 bg-neutral-800 rounded-xs w-5/6"></div>
              </div>
            )}

            {aiResult && (
              <div className="bg-neutral-850 p-4 border border-red-950/40 rounded-sm space-y-3.5 mt-2 text-xs text-neutral-300 animate-slide-down">
                <div className="border-b border-neutral-800 pb-2">
                  <span className="text-[9px] uppercase font-bold text-red-400 block mb-1">المسودة المستوحاة</span>
                  <h4 className="serif-text font-bold text-stone-100 text-sm leading-tight">{aiResult.title}</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">{aiResult.subtitle}</p>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono flex justify-between">
                  <span>الكاتب: {aiResult.author}</span>
                  <span>{aiResult.readTime}</span>
                </p>
                <button
                  id="apply-ai-draft-btn"
                  onClick={handleApplyAiDraft}
                  className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-bold py-1.5 px-3 rounded-xs flex items-center justify-center gap-1 text-[10px] transition-colors"
                >
                  <Check className="w-3 h-3" />
                  <span>نسخ المسودة في استمارة التحرير</span>
                </button>
              </div>
            )}

            {aiError && (
              <div className="bg-red-950/40 border border-red-900 text-red-300 text-[10px] p-2.5 rounded-xs flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}
          </div>
        </div>

        {/* LEFT / MAIN AREA: TABS (LIST OR ADD/EDIT FORM) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50 p-1 rounded-sm gap-2">
            <button
              id="admin-tab-list"
              onClick={() => { setActiveTab("list"); resetFormFields(); }}
              className={`flex-1 md:flex-initial py-2 px-6 font-semibold text-xs rounded-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "list"
                  ? "bg-white text-neutral-900 shadow-3xs border border-stone-200 font-bold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <FileText className="w-4.5 h-4.5" />
              <span>أرشيف المقالات المنشورة ({articles.length})</span>
            </button>

            <button
              id="admin-tab-form"
              onClick={() => { setActiveTab("form"); }}
              className={`flex-1 md:flex-initial py-2 px-6 font-semibold text-xs rounded-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "form"
                  ? "bg-white text-neutral-900 shadow-3xs border border-stone-200 font-bold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Plus className="w-4.5 h-4.5" />
              <span>{editingArticleId ? "تعديل مقال العدد الحالي ✏️" : "تحرير مقال جديد ➕"}</span>
            </button>
          </div>

          {/* TAB 1: ARTICLES ARCHIVE LIST */}
          {activeTab === "list" && (
            <div className="bg-white border border-stone-200 rounded-xs overflow-hidden shadow-2xs">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 select-none">
                <span className="serif-text block text-sm font-bold text-neutral-800">جرد ومتابعة القراءات اليومية للعدد</span>
                <span className="text-[11px] text-neutral-500">يمديك استخدام المحرر الافتراضي جيميناي لإضافة أخبار جديدة فورياً</span>
              </div>

              {articles.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
                  <Newspaper className="w-12 h-12 text-neutral-300" />
                  <p className="font-semibold text-sm">أرشيف المقالات فارغ حالياً</p>
                  <p className="text-xs">الرجاء الضغط على إعادة ضبط المحتوى أو صياغة مقال جديد.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-stone-100 text-neutral-600 font-bold select-none border-b border-stone-200">
                      <tr>
                        <th className="p-3">المقال الأساسي / الكاتب</th>
                        <th className="p-3">القسم</th>
                        <th className="p-3 text-center">علامات العرض</th>
                        <th className="p-3 text-center">المقروئية</th>
                        <th className="p-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {articles.map((art) => (
                        <tr key={art.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="p-3 max-w-[280px] md:max-w-md">
                            <span className="serif-text block text-sm font-bold text-neutral-900 truncate leading-tight mb-1" title={art.title}>
                              {art.title}
                            </span>
                            <span className="text-[10px] text-neutral-500 block">بإمضاء: {art.author} • {art.timestamp}</span>
                          </td>
                          <td className="p-3 font-semibold">
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-xs inline-block">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-3 text-center space-y-1">
                            {art.isFeatured && (
                              <span className="bg-emerald-50 text-emerald-850 border border-emerald-200 px-1.5 py-0.5 rounded-2xs text-[9px] font-bold block mx-auto w-max select-none">رئيسية العدد</span>
                            )}
                            {art.isBreaking && (
                              <span className="bg-red-100 text-brand-primary border border-red-200 px-1.5 py-0.5 rounded-2xs text-[9px] font-bold block mx-auto w-max animate-pulse select-none">خبر عاجل</span>
                            )}
                            {!art.isFeatured && !art.isBreaking && (
                              <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-2xs text-[9px] block mx-auto w-max select-none">خبر عادي</span>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono opacity-80">
                            <div className="flex items-center justify-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{art.views || 0}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(art)}
                                className="p-1 px-2 rounded-xs bg-stone-100 hover:bg-neutral-800 hover:text-white transition-colors text-neutral-700 font-semibold"
                                title="تحرير المقال"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("هل أنت متأكد من رغبتك في حذف هذا المقال من الأعداد المنشورة؟ لا يمكن التراجع عن هذا الإجراء.")) {
                                    onDeleteArticle(art.id);
                                  }
                                }}
                                className="p-1 px-2 rounded-xs bg-red-50 hover:bg-brand-primary text-brand-primary hover:text-white transition-colors"
                                title="حذف المقال"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARTICLE FORM (ADD/EDIT) */}
          {activeTab === "form" && (
            <div className="bg-white border border-stone-200 rounded-xs p-6 space-y-5 shadow-2xs">
              
              {formSuccess && (
                <div id="form-success-alert" className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-sm flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div id="form-error-alert" className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Field */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-neutral-700 block">العنوان الرئيسي للخبر / المقال:</label>
                    <input
                      id="form-title"
                      type="text"
                      placeholder="اكتب العنوان الرئيسي الرصين..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm bg-stone-50/50"
                      required
                    />
                  </div>

                  {/* Subtitle Field */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-neutral-700 block">العنوان الفرعي (تغطية شارحة للمقال):</label>
                    <input
                      id="form-subtitle"
                      type="text"
                      placeholder="العنوان الفرعي الشارح..."
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm bg-stone-50/50"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 block">القسم المستهدف:</label>
                    <select
                      id="form-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs p-2 py-2.5 border border-stone-200 rounded-sm bg-stone-50/50 focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="سياسة">سياسة</option>
                      <option value="اقتصاد">اقتصاد</option>
                      <option value="ثقافة">ثقافة</option>
                      <option value="آراء">كتاب وآراء</option>
                      <option value="علوم وتكنولوجيا">علوم وتكنولوجيا</option>
                    </select>
                  </div>

                  {/* Author Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 block">الكاتب المعتمد:</label>
                    <input
                      id="form-author"
                      type="text"
                      placeholder="اسم الكاتب أو وكالة التغطية..."
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm bg-stone-50/50"
                    />
                  </div>

                  {/* Image URL Input */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-neutral-700 block">عنوان صورة التغطية (رابط URL):</label>
                    <input
                      id="form-image"
                      type="url"
                      placeholder="أدخل رابط المورد الإلكتروني أو حدد من النماذج السريعة أدناه..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm bg-stone-50/50"
                    />
                    
                    {/* Visual presets display */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-neutral-400 self-center ml-2">انتقاء صورة ملائمة:</span>
                      {imagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { setImage(preset.url); }}
                          className={`text-[9px] px-2 py-1 rounded-sm border transition-colors ${
                            image === preset.url 
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-stone-50 text-neutral-600 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated readTime */}
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 block">تقدير زمن القراءة:</label>
                    <input
                      id="form-readtime"
                      type="text"
                      placeholder="مثال: قراءة ٤ دقائق..."
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm bg-stone-50/50"
                    />
                  </div>

                  {/* Grid toggle values */}
                  <div className="flex items-center gap-6 pt-5 bg-stone-50 p-3 rounded-sm border border-stone-200/55">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-neutral-750 select-none">
                      <input
                        id="form-isfeatured"
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-brand-primary border-stone-350 focus:ring-1 rounded-xs"
                      />
                      <span>لوحة رئيسية العدد (مقال غلاف)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-neutral-750 select-none">
                      <input
                        id="form-isbreaking"
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="w-4 h-4 text-brand-primary border-stone-350 focus:ring-1 rounded-xs"
                      />
                      <span>تحديد كشريط أخبار عاجل 🚨</span>
                    </label>
                  </div>

                  {/* Article content input (Main body text) */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-neutral-700 block">مضمون ومحتوى الخبر الإنشائي (فقرات مقسمة بسطور مزدوجة):</label>
                    <textarea
                      id="form-content"
                      rows={10}
                      placeholder="ابدأ بكتابة تقريرك أو مقالك الصحفي هنا..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="serif-text w-full text-sm p-3 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm bg-stone-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    id="form-submit-btn"
                    type="submit"
                    className="bg-neutral-900 hover:bg-brand-primary text-white font-bold py-2.5 px-6 rounded-xs flex items-center gap-1.5 text-xs transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingArticleId ? "نشر التحديثات الحالية" : "نشر المقال للجمهور"}</span>
                  </button>

                  <button
                    id="form-cancel-btn"
                    type="button"
                    onClick={() => { resetFormFields(); setActiveTab("list"); }}
                    className="bg-stone-100 hover:bg-stone-200 text-neutral-700 font-semibold py-2.5 px-6 border border-stone-200 rounded-xs text-xs transition-colors"
                  >
                    إلغاء الأمر
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
