import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LatestNews from "./components/LatestNews";
import ArticleReader from "./components/ArticleReader";
import AdminPanel from "./components/AdminPanel";
import PinterestNewsCard from "./components/PinterestNewsCard";
import MiddleEastEconomiesSection from "./components/MiddleEastEconomiesSection";
import WarRoomSection from "./components/WarRoomSection";
import ArabMarketsSection from "./components/ArabMarketsSection";
import InteractiveAnalysis from "./components/InteractiveAnalysis";
import { Article } from "./data/mockArticles";
import { AlertTriangle, Clock, Terminal, ChevronLeft, Calendar, FileText, Sparkles, Settings, RefreshCw, Eye, ArrowLeft, RefreshCcw, TrendingUp } from "lucide-react";

export default function App() {
  // Routing-like states
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminMode, setIsAdminMode] = useState(window.location.pathname === "/admin");

  // Core articles state populated from express
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // App UI state
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Saved Bookmarks local storage-backed state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("bookmarked_articles");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep bookmarks state globally synchronized across all card instances
  useEffect(() => {
    const syncBookmarks = () => {
      try {
        const saved = localStorage.getItem("bookmarked_articles");
        setBookmarkedIds(saved ? JSON.parse(saved) : []);
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("bookmarks_changed", syncBookmarks);
    return () => window.removeEventListener("bookmarks_changed", syncBookmarks);
  }, []);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setBookmarkedIds(prev => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
      } else {
        next = [...prev, id];
      }
      localStorage.setItem("bookmarked_articles", JSON.stringify(next));
      return next;
    });
  };

  // Synchronize path location changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setIsAdminMode(path === "/admin");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch all articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/articles");
      if (!resp.ok) {
        throw new Error("فشل في تحميل أرشيف مقالات إندبندنت من الخادم.");
      }
      const data = await resp.json();
      setArticles(data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر المزامنة مع خادم الأخبار حالياً. يرجى التحقق من تشغيل الخادم والاتصال بالشبكة.");
    } finally {
      setIsLoading(false);
    }
  };

  // Callback: toggle Admin view
  const toggleAdminMode = () => {
    const newIsAdmin = !isAdminMode;
    setIsAdminMode(newIsAdmin);
    const newPath = newIsAdmin ? "/admin" : "/";
    window.history.pushState({}, "", newPath);
    setCurrentPath(newPath);
    // clean filters upon changing tabs
    setSearchQuery("");
  };

  // Reset to default curated articles
  const handleResetArticles = async () => {
    setIsResetting(true);
    try {
      const resp = await fetch("/api/articles/reset", { method: "POST" });
      if (resp.ok) {
        const data = await resp.json();
        setArticles(data);
        alert("تم تحديث وتعبئة المعروض وتغذية أحدث الأنباء من غرف الأخبار!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  // Explicit dynamic sync of real news via Gemini with Search Grounding
  const handleSyncLiveNews = async () => {
    setIsSyncingLive(true);
    try {
      const resp = await fetch("/api/articles/sync-live", { method: "POST" });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setArticles(data.articles);
        alert(`تم بنجاح جلب ${data.count} مقالاً إخبارياً حقيقياً وموثقاً بالكامل بشكل مباشر من الويب عبر محرك البحث الذكي!`);
      } else {
        alert(data.error || "فشل مزامنة الأخبار الحية حالياً. يرجى التأكد من مفتاح جيميناي.");
      }
    } catch (err: any) {
      console.error(err);
      alert("تعذر الاتصال بالخادم لمزامنة الأنباء الحية. يرجى التحقق من مفتاح GEMINI_API_KEY لديك.");
    } finally {
      setIsSyncingLive(false);
    }
  };

  // CMS API CALL: Create Article
  const handleCreateArticle = async (payload: Partial<Article>) => {
    const resp = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      throw new Error("فشلت عملية حفظ المقال الجديد");
    }
    const newArt = await resp.json();
    setArticles(prev => [newArt, ...prev]);
  };

  // CMS API CALL: Update Article
  const handleUpdateArticle = async (id: string, payload: Partial<Article>) => {
    const resp = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      throw new Error("فشلت عملية تحديث المقال");
    }
    const updatedArt = await resp.json();
    setArticles(prev => prev.map(art => art.id === id ? updatedArt : art));
  };

  // CMS API CALL: Delete Article
  const handleDeleteArticle = async (id: string) => {
    const resp = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (!resp.ok) {
      throw new Error("فشل في حذف المقال من الخادم");
    }
    setArticles(prev => prev.filter(art => art.id !== id));
  };

  // Open article Reader and increment its view count nicely
  const handleArticleClick = async (article: Article) => {
    setSelectedArticle(article);
    // Non-blocking increment views locally and on server
    try {
      const nextViews = (article.views || 0) + 1;
      setArticles(prev => prev.map(art => art.id === article.id ? { ...art, views: nextViews } : art));
      
      // Update server state softly
      fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ views: nextViews })
      });
    } catch (err) {
      console.error("Soft views increment error:", err);
    }
  };

  // Dynamic filter lists
  const filteredArticles = articles.filter(art => {
    // 1. Category check
    let matchesCategory = false;
    if (selectedCategory === "الكل") {
      matchesCategory = true;
    } else if (selectedCategory === "المحفوظات") {
      matchesCategory = bookmarkedIds.includes(art.id);
    } else {
      matchesCategory = art.category === selectedCategory;
    }
    // 2. Search query check
    const matchesSearch = searchQuery.trim() === "" || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.subtitle && art.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Extract featured layout article
  const featuredArticle = filteredArticles.find(art => art.isFeatured) || filteredArticles[0];
  const gridArticles = filteredArticles.filter(art => art.id !== (featuredArticle?.id));

  // Extract list of breaking articles
  const breakingArticles = articles.filter(art => art.isBreaking);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-primary/10">
      
      {/* Top Header Component */}
      <Header
        currentCategory={selectedCategory}
        setCategory={(cat) => { setSelectedCategory(cat); setSelectedArticle(null); }}
        onAdminClick={toggleAdminMode}
        isAdminMode={isAdminMode}
        onResetArticles={handleResetArticles}
        isResetting={isResetting}
        onSyncLiveNews={handleSyncLiveNews}
        isSyncingLive={isSyncingLive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Breaking Ticker Ribbon (Only if any are active) */}
      {breakingArticles.length > 0 && !isAdminMode && (
        <div className="bg-brand-primary text-white border-y border-red-800 text-xs py-2.5 px-4 shadow-sm select-none">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="bg-white text-brand-primary font-bold px-2 py-0.5 rounded-sm animate-pulse flex items-center gap-1 shrink-0 text-[10px] tracking-wider uppercase border border-red-200">
              🚨 عاجل
            </span>
            <div className="overflow-hidden relative w-full h-4">
              <div className="absolute flex gap-16 animate-marquee whitespace-nowrap font-bold text-stone-100">
                {breakingArticles.map((art, idx) => (
                  <span 
                    key={art.id} 
                    onClick={() => handleArticleClick(art)}
                    className="hover:underline cursor-pointer hover:text-stone-300"
                  >
                    • {art.title} ({art.timestamp})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Body Content Arena */}
      <main className="flex-1 bg-paper">
        {isLoading ? (
          <div className="max-w-7xl mx-auto py-24 flex flex-col items-center justify-center gap-4 text-neutral-500">
            <RefreshCw className="w-12 h-12 text-brand-primary animate-spin" />
            <p className="serif-text font-semibold text-lg animate-pulse text-neutral-700">جاري تحميل أعداد صحيفة الإندبندنت المكررة وتحضير شاشات القراءة...</p>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto my-12 p-6 bg-red-50 border border-red-200 text-red-800 rounded-sm flex items-start gap-3.5 shadow-sm">
            <AlertTriangle className="w-8 h-8 shrink-0 text-red-600 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-base">خطأ طارئ بالشبكة</h3>
              <p className="text-xs leading-relaxed">{error}</p>
              <button 
                onClick={fetchArticles}
                className="bg-brand-primary hover:bg-neutral-800 text-white font-bold px-4 py-1.5 rounded-sm text-xs transition-colors cursor-pointer mt-1"
              >
                المحاولة مجدداً
              </button>
            </div>
          </div>
        ) : isAdminMode ? (
          /* ADMIN CMS MODE RENDER */
          <AdminPanel
            articles={articles}
            onCreateArticle={handleCreateArticle}
            onUpdateArticle={handleUpdateArticle}
            onDeleteArticle={handleDeleteArticle}
            onClose={toggleAdminMode}
          />
        ) : (
          /* READERS PUBLIC EDITION GRID (ALWARRAQ NEWS SECTIONS) */
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-16">
            
            {/* 1. SEARCH SESSION VIEW */}
            {searchQuery.trim() !== "" ? (
              <div className="space-y-8">
                <div className="border-r-4 border-brand-primary pr-4">
                  <h2 className="serif-text text-2xl font-black text-neutral-900">نتائج البحث عن: "{searchQuery}"</h2>
                  <p className="text-xs text-neutral-500 mt-1">تم العثور على {filteredArticles.length} مادة صحفية مجهزة ومصنفة</p>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="py-20 text-center text-neutral-500 border border-neutral-200/60 rounded-xl bg-white shadow-3xs space-y-3">
                    <FileText className="w-16 h-16 text-neutral-300 mx-auto" />
                    <h3 className="serif-text text-lg font-bold text-neutral-700">لا توجد نتائج مطابقة لبحثك</h3>
                    <p className="text-xs max-w-sm mx-auto leading-relaxed text-neutral-400">يرجى تعديل مصطلحات البحث أو انقر "الرئيسية" في القائمة لاستعادة تصفحك الطبيعي.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredArticles.map((art) => (
                      <PinterestNewsCard 
                        key={art.id} 
                        article={art} 
                        onClick={handleArticleClick} 
                        isBookmarked={bookmarkedIds.includes(art.id)}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : selectedCategory !== "الكل" ? (
              /* 2. SPECIFIC CATEGORY EXPLORER PAGE */
              <div className="space-y-10 animate-fade-in">
                {/* Category Jumbotron Header */}
                <div className="bg-gradient-to-l from-stone-50 to-white border border-neutral-200/60 p-6 md:p-8 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-3xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-bold">
                      <span className="hover:text-brand-primary cursor-pointer transition-colors" onClick={() => setSelectedCategory("الكل")}>الرئيسية</span>
                      <span>&larr;</span>
                      <span className="text-brand-primary">{selectedCategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-brand-primary rounded-xs"></span>
                      <h2 className="serif-text text-2.5xl md:text-3.5xl font-black text-neutral-900">{selectedCategory}</h2>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-500 max-w-2xl leading-relaxed font-[320]">
                      {(() => {
                        const sec = [
                          { id: "المحفوظات", desc: "أرشيفك الخاص بالمقالات والتقارير التي قمت بحفظها للرجوع إليها وقراءتها في أي وقت لاحقاً." },
                          { id: "الحصريات", desc: "انفرادات صحفية وتغطية حصرية بـ 'الوراق نيوز' تشمل ملفات خاصة وحوارات غير مسبوقة." },
                          { id: "مختارات التحرير", desc: "نخبة المقالات والتقارير الأسبوعية والموضوعات الفكرية التي يوصي بها طاقم تحرير 'الوراق'." },
                          { id: "الشرق الأوسط", desc: "متابعة دقيقة لشؤون السياسة والأمن وبناء التنمية والاقتصاد والاستقرار في دول الجوار والخليج العربي." },
                          { id: "العالم", desc: "تغطية دولية من كافة العواصم الكبرى، تحليلات جيوسياسية معمقة وأحداث تصنع حاضرنا." },
                          { id: "الرأي", desc: "أعمدة فكرية ومنصات آراء لألمع المحللين والأكاديميين والمهتمين بالاستراتيجيات الإقليمية." },
                          { id: "الاقتصاد", desc: "مواكبة الأسواق عابرة القارات، رصد العملات، النفط والغاز، والاستثمارات وسياسات المصارف." },
                          { id: "ثقافة وفنون", desc: "فلسفة وفكر وأدب، مراجعات للروايات والكتب ومتابعة للحركات الفنية والجمالية الراقية." },
                          { id: "صحة وعلوم", desc: "بوابة المعرفة وصحة الإنسان، الاكتشافات الطبية، الفلك، والمناخ والرخاء المعيشي." },
                          { id: "تكنولوجيا", desc: "طفرة الحوسبة والماشين ليرنينج، آفاق الذكاء الاصطناعي السيادي والابتكارات وثورة الرقائق." },
                          { id: "يوميات الشرق", desc: "رصد من الواقع وسير الحياة، حكايا ملهمة وصدى المجتمعات بقلم مراسلينا." },
                          { id: "الرياضة", desc: "تحليلات المباريات والمنافسات، قراءة الاستراتيجيات التقنية للأندية والبطولات الكبرى." },
                          { id: "في العمق", desc: "تحقيقات استقصائية عميقة تستند إلى تقارير موثقة وأدلة لكشف تفاصيل القضايا المثارة." },
                          { id: "فيديو", desc: "منتجات مرئية غنية بالمعلومة، تصاميم موشن وتحليلات معززة بالمشاهد والوسائط." }
                        ].find(s => s.id === selectedCategory);
                        return sec ? sec.desc : "أحدث الأخبار والتحليلات الحصرية والدراسات الاستقصائية الشاملة المقدمة من أسرة الوراق نيوز.";
                      })()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedCategory("الكل")}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-brand-primary border border-neutral-200 hover:border-brand-primary/25 bg-white px-3.5 py-2.5 rounded-lg shadow-3xs cursor-pointer transition-all shrink-0"
                  >
                    <span>العودة لصفحة الرئيسية</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-brand-primary" />
                  </button>
                </div>

                {/* Pinterest 4-card row layout for current single category */}
                {filteredArticles.length === 0 ? (
                  <div className="py-20 text-center text-neutral-500 bg-white border border-neutral-100 rounded-xl max-w-md mx-auto shadow-3xs">
                    <Sparkles className="w-10 h-10 text-neutral-300 mx-auto animate-pulse mb-3" />
                    <p className="text-xs font-medium">القسم فارغ حالياً تماماً. يرجى تزويد المقالات عبر الإدارة.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[11px] font-mono tracking-widest text-neutral-400 text-left">
                      GRID COUNT: {filteredArticles.length} ARTICLES • ALWARRAQ SYSTEM
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredArticles.map((art) => (
                        <PinterestNewsCard 
                          key={art.id} 
                          article={art} 
                          onClick={handleArticleClick} 
                          showCategoryBadge={false} 
                          isBookmarked={bookmarkedIds.includes(art.id)}
                          onToggleBookmark={handleToggleBookmark}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggest other sections below */}
                <div className="pt-10 border-t border-stone-100">
                  <h4 className="serif-text text-sm font-bold text-neutral-400 mb-4">تصفح أقسام أخرى في "الوراق":</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "الحصريات", label: "الحصريات" },
                      { id: "مختارات التحرير", label: "مختارات التحرير" },
                      { id: "الشرق الأوسط", label: "الشرق الأوسط" },
                      { id: "العالم", label: "العالم" },
                      { id: "الرأي", label: "الرأي" },
                      { id: "الاقتصاد", label: "الاقتصاد" },
                      { id: "ثقافة وفنون", label: "ثقافة وفنون" },
                      { id: "علوم وتكنولوجيا", label: "صحة وعلوم" },
                      { id: "تكنولوجيا", label: "تكنولوجيا" }
                    ].filter(x => x.id !== selectedCategory).slice(0, 5).map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)}
                        className="bg-stone-50 hover:bg-rose-50 border border-neutral-200 text-neutral-700 hover:text-brand-primary px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* 3. HOME ENTRANCE VIEW WITH FEATURED SPLIT + MULTIPLE DYNAMIC ROWS */
              <div className="space-y-16">
                
                {/* A. NEW HERO SECTION: War Room */}
                <WarRoomSection onArticleClick={handleArticleClick} />

                {/* B. SECTION 2: Spotlight Top Hero Area (Now 3 Columns with Featured, Most Read, and Last News) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-rose-50/50 pb-12">
                  
                  {/* Column 1: Featured Big News Spotlight Card (occupies 5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="border-r-4 border-brand-primary pr-3 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
                      <h3 className="serif-text text-xl font-black text-neutral-900 leading-none">لوحة العدد الرئيسية</h3>
                    </div>

                    {featuredArticle && (
                      <div 
                        onClick={() => handleArticleClick(featuredArticle)}
                        className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md cursor-pointer group transition-all duration-300 flex flex-col justify-between h-full min-h-[460px]"
                      >
                        {/* Featured Image */}
                        <div className="relative h-56 overflow-hidden bg-neutral-100 shrink-0">
                          <img 
                            src={featuredArticle.image} 
                            alt={featuredArticle.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/20 to-transparent h-1/3"></div>
                          <span className="absolute bottom-3 right-3 bg-brand-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded-sm select-none shadow-sm font-sans tracking-wide">
                            انفراد رئيسي
                          </span>
                        </div>

                        {/* Article titles and details container */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <span className="bg-rose-50 border border-rose-100 text-brand-primary text-[10px] font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wide inline-block">
                              {featuredArticle.category}
                            </span>
                            
                            <h3 className="serif-text text-lg md:text-xl font-black text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug line-clamp-3">
                              {featuredArticle.title}
                            </h3>

                            <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed font-[320]">
                              {featuredArticle.subtitle}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-[10px] text-neutral-400 font-medium mt-auto">
                            <span className="text-neutral-700 font-bold">بإمضاء: {featuredArticle.author.split("-")[0].trim()}</span>
                            <span className="font-mono">{featuredArticle.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Most Read Column (occupies 3 cols) */}
                  <div className="lg:col-span-3 space-y-4 bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-2xs min-h-[515px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 border-b-2 border-brand-primary pb-3 mb-4 select-none">
                        <TrendingUp className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
                        <h3 className="serif-text text-lg font-bold text-neutral-900">الأكثر قراءة</h3>
                      </div>

                      <div className="flex flex-col gap-3.5">
                        {[...articles]
                          .sort((a, b) => (b.views || 0) - (a.views || 0))
                          .slice(0, 5)
                          .map((article, index) => (
                            <div
                              key={article.id}
                              onClick={() => handleArticleClick(article)}
                              className="flex items-start gap-3 cursor-pointer group pb-3.5 border-b border-stone-100 last:border-none last:pb-0"
                            >
                              <span className="serif-text text-2xl md:text-3xl font-extrabold text-neutral-300 group-hover:text-brand-primary transition-colors duration-150 min-w-[28px]">
                                {index + 1}
                              </span>

                              <div className="flex-1 space-y-1">
                                <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wide block">
                                  {article.category}
                                </span>
                                <h4 className="serif-text text-xs font-bold text-neutral-800 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                                  {article.title}
                                </h4>
                                <span className="text-[9px] text-neutral-400 font-mono block">
                                  {article.views || 120} مشاهدة
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Last / Latest News (occupies 4 cols) */}
                  <div className="lg:col-span-4 space-y-4 bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-2xs min-h-[515px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 border-b-2 border-brand-primary pb-3 mb-4 select-none">
                        <Clock className="w-4.5 h-4.5 text-brand-primary" />
                        <h4 className="serif-text text-lg font-bold text-neutral-900">آخر الأخبار</h4>
                        <span className="bg-red-100 text-brand-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs animate-pulse">مباشر</span>
                      </div>

                      {/* Continuous Chrono Timeline Feed */}
                      <div className="relative border-r border-stone-100 pr-4 mr-1 flex flex-col gap-4">
                        {[...articles].slice(0, 5).map((article) => (
                          <div
                            key={article.id}
                            onClick={() => handleArticleClick(article)}
                            className="group cursor-pointer relative"
                          >
                            {/* Timeline Node Bullet */}
                            <div className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-neutral-300 border-2 border-white group-hover:bg-brand-primary transition-all duration-150"></div>

                            <span className="text-[9px] font-medium text-brand-primary bg-rose-50 px-1.5 py-0.5 rounded-xs inline-block mb-1">
                              {article.timestamp}
                            </span>
                            <h4 className="serif-text text-xs md:text-sm font-bold text-neutral-800 group-hover:text-brand-primary transition-colors duration-150 line-clamp-2 leading-tight">
                              {article.title}
                            </h4>
                            <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5 font-medium">
                              <span>{article.category}</span>
                              <span>•</span>
                              <span>{article.readTime}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* B. CATEGORY ROWS SESSIONS - "one row four interest style news card" */}
                {(() => {
                  const homeSections = [
                    { id: "الحصريات", label: "الحصريات", desc: "انفرادات صحفية وتغطية حصرية بـ 'الوراق نيوز'" },
                    { id: "مختارات التحرير", label: "مختارات التحرير", desc: "أبرز الملفات والتحليلات التي يوصي بها فريق تحرير 'الوراق'" },
                    { id: "الشرق الأوسط", label: "الشرق الأوسط", desc: "متابعة دقيقة لشؤون السياسة والأمن وبناء المستقبل بالمنطقة" },
                    { id: "العالم", label: "العالم", desc: "تغطية موضوعية مستقلة للأحداث الجيوسياسية والتغيرات الدولية الكبرى" },
                    { id: "الرأي", label: "الرأي", desc: "أقلام الفكر والأعمدة التحليلية المشرقة الرصينة" },
                    { id: "الاقتصاد", label: "الاقتصاد", desc: "تحليل الأسواق والعملات وحراك الاستثمار عابر القارات والفرص الواعدة" },
                    { id: "ثقافة وفنون", label: "ثقافة وفنون", desc: "روافد الأدب، الفلسفة، ومعارض التشكيل والجمال الإنساني الراقي" },
                    { id: "صحة وعلوم", label: "صحة وعلوم", desc: "مواكبة للاكتشافات الطبية، الفلك، وأبحاث التكنولوجيا والسر البشري" },
                    { id: "تكنولوجيا", label: "تكنولوجيا", desc: "ثورة الذكاء الاصطناعي، الأمن السيبراني وعوالم الحوسبة الفائقة" },
                    { id: "يوميات الشرق", label: "يوميات الشرق", desc: "سرديات وقصص إنسانية شائقة من نبض المجتمعات في مشوارها اليومي" },
                    { id: "الرياضة", label: "الرياضة", desc: "رصد المنافسات الحية والبطولات الكبرى بحس نقدي رياضي فذ" },
                    { id: "في العمق", label: "في العمق", desc: "تحقيقات استقصائية عميقة تستند إلى تقارير موثقة وأدلة لكشف تفاصيل القضايا المثارة" },
                    { id: "فيديو", label: "فيديو", desc: "تقارير مصورة وتغطيات وثائقية تفاعلية جذابة بالصوت والصورة" }
                  ];

                  return (
                    <div className="space-y-16">
                      {/* Middle East Economies Section before exclusives (اقتصاديات الشرق الأوسط) */}
                      <MiddleEastEconomiesSection onArticleClick={handleArticleClick} />

                      {/* Interactive Analysis (D3.js Charts) Section */}
                      <InteractiveAnalysis onArticleClick={handleArticleClick} allArticles={articles} />

                      {homeSections.map((sec) => {
                        // Filter articles for this section
                        const secArticles = articles.filter(art => art.category === sec.id).slice(0, 4);
                        if (secArticles.length === 0) return null; // Skip empty sections

                        return (
                          <React.Fragment key={sec.id}>
                            {/* Arab Markets section exactly before World (العالم) section */}
                            {sec.id === "العالم" && (
                              <ArabMarketsSection onArticleClick={handleArticleClick} />
                            )}

                            <section id={`sec-${sec.id}`} className="space-y-5 border-b border-stone-100 last:border-none pb-12 last:pb-0 animate-fade-in">
                              {/* Section Header */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-r-4 border-brand-primary pr-4">
                                <div className="space-y-1">
                                  <h3 className="serif-text text-xl md:text-2xl font-black text-neutral-900 cursor-pointer hover:text-brand-primary transition-colors" onClick={() => setSelectedCategory(sec.id)}>
                                    {sec.label}
                                  </h3>
                                  <p className="text-xs text-neutral-400 font-medium leading-relaxed font-[320]">
                                    {sec.desc}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setSelectedCategory(sec.id)}
                                  className="text-xs font-bold text-brand-primary hover:text-red-800 transition-colors flex items-center gap-1 shrink-0 pb-1 cursor-pointer focus:outline-hidden"
                                >
                                  <span>تصفح كافة مقالات {sec.label}</span>
                                  <ChevronLeft className="w-3.5 h-3.5 mt-0.5" />
                                </button>
                              </div>

                              {/* Section Content: "one row four Pinterest-style news cards" */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {secArticles.map((article) => (
                                  <PinterestNewsCard 
                                    key={article.id} 
                                    article={article} 
                                    onClick={handleArticleClick}
                                    showCategoryBadge={false}
                                    isBookmarked={bookmarkedIds.includes(article.id)}
                                    onToggleBookmark={handleToggleBookmark}
                                  />
                                ))}
                              </div>
                            </section>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>
            )}

          </div>
        )}
      </main>

      {/* Floating Widget footer / Admin info */}
      <footer className="bg-neutral-900 text-stone-300 border-t border-neutral-850 py-10 px-4 mt-auto select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right dir-rtl">
          
          <div className="space-y-3">
            <h4 className="serif-text text-base font-bold text-brand-primary text-stone-100">الوراق نيوز</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              منصة صحفية وتحليلية مستقلة رائدة تقدم التغطيات والتحليلات السياسية والاقتصادية والاجتماعية في المنطقة عابرة للملابسات برؤية عقلانية متزنة.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="serif-text text-xs uppercase text-stone-100 font-bold tracking-wider">روابط سريعة</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
              <span className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory("الشرق الأوسط"); setIsAdminMode(false); }}>الشرق الأوسط</span>
              <span className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory("العالم"); setIsAdminMode(false); }}>العالم</span>
              <span className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory("الرأي"); setIsAdminMode(false); }}>الرأي</span>
              <span className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory("الاقتصاد"); setIsAdminMode(false); }}>الاقتصاد</span>
              <span className="hover:text-white cursor-pointer font-bold text-red-400" onClick={toggleAdminMode}>🛠️ بوابة الإشراف</span>
              <span className="hover:text-white cursor-pointer" onClick={handleResetArticles}>إعادة الفرز</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="serif-text text-xs uppercase text-stone-100 font-bold tracking-wider">ساعات العمل ومزامنة الخادم</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              تطبيق "الوراق" متزامن بالكامل مع خادم Express والذكاء الاصطناعي التوليدي من جيميناي.
            </p>
            <div className="text-[10px] font-mono text-neutral-500">
              UTC: {new Date().toISOString()}
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-850 text-center text-[10px] text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>حقوق الطبع والنشر © ٢٠٢٦ الوراق نيوز. كل التحليلات المعززة بجيميناي مكفولة بالذكاء التوليدي الاستقصائي.</span>
          <span>منصّة صحافية تحليلية مستقلة تلتزم أرفع معايير التحليل والدقة الصحفية • ALWARRAQ NEWS PROCESS</span>
        </div>
      </footer>

      {/* Slide overlay full article reader modal component */}
      {selectedArticle && (
        <ArticleReader
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

    </div>
  );
}
