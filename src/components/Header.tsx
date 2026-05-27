import React, { useState, useEffect } from "react";
import { Settings, Search, Menu, X, Clock, RefreshCw } from "lucide-react";

interface HeaderProps {
  currentCategory: string;
  setCategory: (category: string) => void;
  onAdminClick: () => void;
  isAdminMode: boolean;
  onResetArticles: () => void;
  isResetting: boolean;
  onSyncLiveNews: () => void;
  isSyncingLive: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function AlwarraqLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer double circle */}
      <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="4" />
      <circle cx="150" cy="150" r="132" stroke="currentColor" strokeWidth="1" strokeDasharray="5 3" />
      
      {/* Globe Grid line at top right */}
      <path d="M190 60 C230 65, 255 90, 255 120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M170 80 C210 85, 235 110, 240 130" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M200 45 C235 55, 250 75, 250 100" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3" />
      
      {/* Candlesticks & Charts at top */}
      {/* Bar charts */}
      <rect x="75" y="60" width="8" height="25" fill="currentColor" />
      <rect x="91" y="50" width="8" height="35" fill="currentColor" />
      <rect x="107" y="35" width="8" height="50" fill="currentColor" />
      <rect x="123" y="45" width="8" height="40" fill="currentColor" />
      <rect x="139" y="55" width="8" height="30" fill="currentColor" />
      <rect x="155" y="40" width="8" height="45" fill="currentColor" />
      <rect x="171" y="30" width="8" height="55" fill="currentColor" />
      
      {/* Candlestick lines */}
      <line x1="79" y1="50" x2="79" y2="90" stroke="currentColor" strokeWidth="2" />
      <line x1="95" y1="40" x2="95" y2="90" stroke="currentColor" strokeWidth="2" />
      <line x1="111" y1="25" x2="111" y2="90" stroke="currentColor" strokeWidth="2" />
      <line x1="127" y1="35" x2="127" y2="90" stroke="currentColor" strokeWidth="2" />
      <line x1="143" y1="45" x2="143" y2="90" stroke="currentColor" strokeWidth="2" />
      <line x1="159" y1="30" x2="159" y2="90" stroke="currentColor" strokeWidth="2" />
      <line x1="175" y1="20" x2="175" y2="90" stroke="currentColor" strokeWidth="2" />
      
      {/* Upward trend curves/lines */}
      <path d="M50 140 C 120 140, 200 125, 260 55" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Arrow head */}
      <path d="M260 55 L242 58 M260 55 L252 73" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Main Arabic Calligraphy Text: "الوراق" */}
      <text x="155" y="190" fontFamily="system-ui, 'Cairo', sans-serif" fontWeight="950" fontSize="84" fill="currentColor" textAnchor="middle">الوراق</text>
      
      {/* Website label text */}
      <text x="150" y="215" fontFamily="'Cairo', system-ui, sans-serif" fontWeight="800" fontSize="18" letterSpacing="1.5" fill="currentColor" textAnchor="middle">alwarraq.news</text>
      
      {/* Bottom Laurel leaves Wreath */}
      <g transform="translate(150, 260)">
        {/* Left branch */}
        <path d="M-10,-5 C-45,-10 -90,-35 -105,-75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Leaf pairs Left */}
        <path d="M-20,-11 C-25,-25 -20,-30 -15,-25 C-12,-20 -15,-13 -20,-11" fill="currentColor" />
        <path d="M-40,-16 C-50,-30 -45,-35 -38,-30 C-32,-25 -35,-18 -40,-16" fill="currentColor" />
        <path d="M-60,-25 C-75,-40 -68,-45 -60,-40 C-54,-35 -55,-28 -60,-25" fill="currentColor" />
        <path d="M-80,-40 C-95,-55 -85,-62 -80,-55 C-75,-50 -75,-43 -80,-40" fill="currentColor" />
        <path d="M-92,-58 C-105,-72 -98,-78 -92,-71 C-88,-67 -88,-61 -92,-58" fill="currentColor" />
        
        {/* Right branch */}
        <path d="M10,-5 C45,-10 90,-35 105,-75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Leaf pairs Right */}
        <path d="M20,-11 C25,-25 20,-30 15,-25 C12,-20 15,-13 20,-11" fill="currentColor" />
        <path d="M40,-16 C50,-30 45,-35 38,-30 C32,-25 35,-18 40,-16" fill="currentColor" />
        <path d="M60,-25 C75,-40 68,-45 60,-40 C54,-35 55,-28 60,-25" fill="currentColor" />
        <path d="M80,-40 C95,-55 85,-62 80,-55 C75,-50 75,-43 80,-40" fill="currentColor" />
        <path d="M92,-58 C105,-72 98,-78 92,-71 C88,-67 88,-61 92,-58" fill="currentColor" />
        
        {/* Central tie */}
        <circle cx="0" cy="-5" r="6" fill="currentColor" />
      </g>
    </svg>
  );
}

export default function Header({
  currentCategory,
  setCategory,
  onAdminClick,
  isAdminMode,
  onResetArticles,
  isResetting,
  onSyncLiveNews,
  isSyncingLive,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = [
    { id: "الكل", label: "الرئيسية" },
    { id: "المحفوظات", label: "المقالات المحفوظة 📌" },
    { id: "الحصريات", label: "الحصريات" },
    { id: "مختارات التحرير", label: "مختارات التحرير" },
    { id: "الشرق الأوسط", label: "الشرق الأوسط" },
    { id: "العالم", label: "العالم" },
    { id: "الرأي", label: "الرأي" },
    { id: "الاقتصاد", label: "الاقتصاد" },
    { id: "ثقافة وفنون", label: "ثقافة وفنون" },
    { id: "صحة وعلوم", label: "صحة وعلوم" },
    { id: "تكنولوجيا", label: "تكنولوجيا" },
    { id: "يوميات الشرق", label: "يوميات الشرق" },
    { id: "الرياضة", label: "الرياضة" },
    { id: "في العمق", label: "في العمق" },
    { id: "فيديو", label: "فيديو" }
  ];

  // Arabic date formatting for Wednesday, 27 May 2026
  const getArabicDate = () => {
    return "الأربعاء، ٢٧ مايو ٢٠٢٦ م";
  };

  // Close drawer when location or category changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentCategory]);

  return (
    <>
      {/* STICKY HEADER CONTAINER (Height represents header when sticky) */}
      <header className="border-b-4 border-brand-primary bg-white shadow-xs sticky top-0 z-40 transition-all duration-300">
        
        {/* =======================================================
            DESKTOP EDITION LOGO & HEADER LAYOUT (XL ONLY)
            ======================================================= */}
        <div className="hidden xl:block">
          {/* Top Utility Bar */}
          <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center dir-rtl">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 opacity-90">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  <span>الرياض {new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
                <span className="hidden sm:inline border-r border-neutral-700 h-3 pr-4"></span>
                <span className="hidden sm:inline font-medium opacity-80">{getArabicDate()}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Live indicator badge */}
                <div className="hidden md:flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-xs border border-neutral-700/60 font-mono text-[9px] text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>LIVE WIRE SEARCH</span>
                </div>

                {/* AI Real News Live Sync Button */}
                <button
                  id="sync-live-news-btn"
                  onClick={onSyncLiveNews}
                  disabled={isSyncingLive || isResetting}
                  className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-sm border transition-all duration-150 text-[11px] ${
                    isSyncingLive
                      ? "bg-red-950 text-red-300 border-red-900 cursor-wait animate-pulse"
                      : "bg-red-700 hover:bg-red-650 text-white border-red-800 active:bg-red-850 cursor-pointer shadow-3xs"
                  }`}
                  title="جلب وتغذية الأخبار الحية الحقيقية من الويب عبر الذكاء الفائق لجيميناي"
                >
                  <RefreshCw className={`w-3 h-3 text-red-100 ${isSyncingLive ? 'animate-spin' : ''}`} />
                  <span>{isSyncingLive ? "جاري جلب الأنباء..." : "مزامنة الأخبار المباشرة 🌐"}</span>
                </button>

                <button
                  id="reset-articles-btn"
                  onClick={onResetArticles}
                  disabled={isResetting || isSyncingLive}
                  className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-950 text-neutral-300 px-2.5 py-1 rounded-sm border border-neutral-700 transition-all duration-150 text-[11px] font-medium"
                  title="تحديث وإعادة تغذية الأخبار والمقالات"
                >
                  <RefreshCw className={`w-3 h-3 text-red-300 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? "جاري التحديث..." : "تحديث المعروض"}</span>
                </button>

                <button
                  id="admin-dashboard-toggle"
                  onClick={onAdminClick}
                  className={`flex items-center gap-1.5 font-semibold px-3 py-1 rounded-sm border transition-all duration-150 text-[11px] ${
                    isAdminMode 
                      ? "bg-brand-primary text-white border-brand-primary shadow-sm hover:bg-red-800"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
                  }`}
                >
                  <Settings className="w-3 h-3 text-red-200 animate-pulse" />
                  <span>{isAdminMode ? "رؤية موقع القارئ" : "بوابة الإشراف 🛠️ /admin"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Branding Logo Area */}
          <div className="py-4 px-4 max-w-7xl mx-auto text-center border-b border-rose-50/70">
            <div className="flex justify-between items-center">
              {/* Spacer or search bar toggled */}
              <div className="flex items-center gap-2 w-1/4">
                <button
                  id="desktop-search-trigger"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 text-neutral-500 hover:text-brand-primary transition-colors duration-150"
                >
                  <Search className="w-5 h-5" />
                </button>
                {isSearchOpen && (
                  <input
                    id="search-input-field"
                    type="text"
                    placeholder="ابحث في أرشيف الأخبار..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-sm px-3 py-1 border border-neutral-200 rounded-xs focus:outline-none focus:ring-1 focus:ring-brand-primary bg-stone-50 w-full transition-all duration-200 animate-fade-in"
                  />
                )}
              </div>

              {/* Logo Brand */}
              <div 
                className="flex flex-col md:flex-row items-center justify-center gap-4 select-none cursor-pointer text-stone-900 hover:text-brand-primary transition-colors" 
                onClick={() => { setCategory("الكل"); if (isAdminMode) onAdminClick(); }}
              >
                <AlwarraqLogo className="w-20 h-20 md:w-24 md:h-24 shrink-0 transition-transform duration-300 hover:rotate-3" />
                <div className="text-right">
                  <h1 className="serif-text text-4xl md:text-5xl font-extrabold tracking-tight mt-1">
                    الوراق <span className="text-brand-primary">نيوز</span>
                  </h1>
                  <p className="text-[10px] md:text-xs font-mono tracking-widest text-neutral-400 mt-1 uppercase">
                    ALWARRAQ NEWS • الخيار الصحفي العقلاني المستقل
                  </p>
                </div>
              </div>

              {/* Small placeholder for desktop symmetry */}
              <div className="w-1/4 flex justify-end">
                <div className="border-l-2 border-brand-primary pr-3 text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">منصة الوراق المستقلة</span>
                  <span className="serif-text font-bold text-xs text-brand-primary">الخبر الصادق برؤية تحليلية</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Main Navigation Tabs */}
          <nav className="bg-stone-50 border-b border-neutral-200 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center items-center gap-1.5 whitespace-nowrap py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`cat-nav-${cat.id}`}
                    onClick={() => {
                      setCategory(cat.id);
                      if (isAdminMode) onAdminClick();
                    }}
                    className={`py-3 px-4 font-bold text-xs transition-all duration-200 border-b-2 relative ${
                      currentCategory === cat.id && !isAdminMode
                        ? "text-brand-primary border-brand-primary bg-white shadow-3xs font-extrabold"
                        : "text-neutral-700 border-transparent hover:text-brand-primary hover:bg-neutral-100/50"
                    }`}
                  >
                    {cat.label}
                    {currentCategory === cat.id && !isAdminMode && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary animate-width-fill"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>


        {/* =======================================================
            MOBILE & TABLET EDITION SLIM STICKY HEADER (XL:HIDDEN)
            ======================================================= */}
        <div className="xl:hidden h-14 px-4 flex items-center justify-between dir-rtl bg-white/95 backdrop-blur-md">
          {/* Right Side: Burger Toggle + Small Compact Logo */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <button 
              id="mobile-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-neutral-800 hover:bg-stone-100 rounded-full transition-colors active:scale-90 cursor-pointer"
              aria-label="القائمة ورأس الصحيفة"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div 
              className="flex items-center gap-2 cursor-pointer select-none" 
              onClick={() => { setCategory("الكل"); if (isAdminMode) onAdminClick(); }}
            >
              <AlwarraqLogo className="w-8 h-8 md:w-9 md:h-9 shrink-0" />
              <div className="text-right">
                <h1 className="serif-text text-lg md:text-xl font-black text-stone-900 tracking-tight leading-none">
                  الوراق <span className="text-brand-primary">نيوز</span>
                </h1>
                <span className="text-[7.5px] font-mono font-bold text-neutral-400 block tracking-widest mt-0.5 uppercase">
                  ALWARRAQ NEWS
                </span>
              </div>
            </div>
          </div>

          {/* Left Side: Neat Minimal Tools Set */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Quick Live indicator */}
            <span className="relative flex h-2 w-2 mr-0.5 md:mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>

            {/* Live Search icon button inline toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 md:p-2 rounded-full transition-all active:scale-95 border cursor-pointer ${
                isSearchOpen || searchQuery 
                  ? "bg-rose-50 border-rose-200 text-brand-primary" 
                  : "bg-stone-50 border-stone-200 text-neutral-600 hover:text-brand-primary hover:bg-white"
              }`}
              title="بحث ذكي"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Quick Bookmarks Toggle Button */}
            <button
              onClick={() => {
                if (currentCategory === "المحفوظات") {
                  setCategory("الكل");
                } else {
                  setCategory("المحفوظات");
                }
                if (isAdminMode) onAdminClick();
              }}
              className={`p-1.5 md:p-2 rounded-full transition-all active:scale-95 border text-[11px] font-bold cursor-pointer ${
                currentCategory === "المحفوظات"
                  ? "bg-rose-50 border-rose-200 text-brand-primary scale-105"
                  : "bg-stone-50 border-stone-200 text-neutral-600 hover:text-brand-primary"
              }`}
              title="المحفوظات 📌"
            >
              📌
            </button>

            {/* Micro Live Sync and Badge */}
            <button
              onClick={onSyncLiveNews}
              disabled={isSyncingLive || isResetting}
              className={`p-1.5 md:p-2 rounded-full transition-all active:scale-95 border cursor-pointer ${
                isSyncingLive
                  ? "bg-red-950 border-red-900 text-red-300 animate-pulse cursor-wait"
                  : "bg-red-700 border-red-800 text-white hover:bg-red-650"
              }`}
              title="مزامنة الأخبار المباشرة من الويب"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* =======================================================
            MOBILE COLLAPSIBLE INLINE SEARCH DRAWER (XL:HIDDEN)
            ======================================================= */}
        {isSearchOpen && (
          <div className="xl:hidden bg-stone-50 border-t border-neutral-250/20 py-2.5 px-4 animate-slide-down">
            <div className="relative w-full">
              <input
                id="search-input-mobile"
                type="text"
                placeholder="ابحث في الأخبار والتحليلات والتقارير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pr-8 pl-8 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white text-neutral-800 font-medium font-sans border-stone-200/80"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute left-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 bg-stone-100 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =======================================================
          NON-STICKY PORTION (SCROLLS AWAY SO MOBILES DON'T WASTE VIEWPORT)
          ======================================================= */}
      
      {/* Scrollable Categories Track Header (xl:hidden) */}
      <div className="xl:hidden bg-stone-50 border-b border-neutral-150 overflow-x-auto scrollbar-none py-2 px-4 shadow-3xs">
        <div className="flex items-center gap-2 whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                if (isAdminMode) onAdminClick();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentCategory === cat.id && !isAdminMode
                  ? "bg-brand-primary text-white shadow-2xs scale-[1.01]"
                  : "bg-white text-neutral-700 hover:bg-stone-200 border border-neutral-200/80 shadow-3xs"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>


      {/* =======================================================
          RESPONSIVE SIDE DRAWER MODAL OVERLAY (XL:HIDDEN)
          ======================================================= */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex justify-start dir-rtl">
          {/* Menu Panel Card Body */}
          <div className="bg-white w-[82%] max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-right border-l border-neutral-200">
            <div className="p-5 space-y-6">
              {/* Drawer Header Brand Brand */}
              <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <AlwarraqLogo className="w-9 h-9" />
                  <div className="text-right">
                    <h2 className="serif-text text-xl font-extrabold text-stone-900 leading-tight">الوراق <span className="text-brand-primary">نيوز</span></h2>
                    <p className="text-[8px] font-mono text-neutral-400 tracking-wider">ALWARRAQ NEWS</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Time tracker and date indicator in Drawer */}
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/50 space-y-1 text-center select-none">
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-600 font-bold">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  <span>توقيت الرياض: {new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-[9.5px] text-neutral-400 font-mono font-semibold">{getArabicDate()}</div>
              </div>

              {/* Scrollable list of categories */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-2 block">تصنيفات وإصدارات الصحيفة</h3>
                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setIsMenuOpen(false);
                        if (isAdminMode) onAdminClick();
                      }}
                      className={`text-right py-2 px-3 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                        currentCategory === cat.id && !isAdminMode
                          ? "bg-rose-50 text-brand-primary border-r-4 border-brand-primary"
                          : "text-neutral-700 hover:bg-stone-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toolbox & Controls (Sleek Drawer Footer Area) */}
            <div className="p-5 bg-stone-50 border-t border-neutral-200/80 space-y-3">
              <h3 className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">لوحة القيادة ومركز التحكم</h3>
              
              {/* Feed quality live stream details */}
              <div className="flex items-center justify-between bg-white border border-neutral-200/60 p-2.5 rounded-lg text-xs">
                <span className="text-neutral-500 font-bold">التغذية الإخبارية:</span>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  <span>LIVE ACTIVE WIRE</span>
                </div>
              </div>

              {/* Live Web sync trigger */}
              <button
                onClick={() => { onSyncLiveNews(); setIsMenuOpen(false); }}
                disabled={isSyncingLive || isResetting}
                className={`w-full flex items-center justify-center gap-2 font-black py-2.5 px-3 rounded-md border transition-all text-xs cursor-pointer ${
                  isSyncingLive
                    ? "bg-red-950 text-red-300 border-red-900 cursor-wait animate-pulse"
                    : "bg-red-700 hover:bg-red-650 text-white border-red-800 shadow-3xs"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
                <span>{isSyncingLive ? "جاري جلب المقالات..." : "مزامنة الأخبار المباشرة 🌐"}</span>
              </button>

              {/* Reset to fresh news trigger */}
              <button
                onClick={() => { onResetArticles(); setIsMenuOpen(false); }}
                disabled={isResetting || isSyncingLive}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-100 active:bg-stone-200 text-neutral-700 py-2.5 px-3 rounded-md border border-stone-200/85 transition-colors text-xs font-bold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? "جاري التحديث..." : "تحديث المعروض والشبكة"}</span>
              </button>

              {/* Admin Panel Gateway Entry */}
              <button
                onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-3 rounded-md border transition-all text-xs cursor-pointer ${
                  isAdminMode 
                    ? "bg-brand-primary text-white border-brand-primary hover:bg-red-800"
                    : "bg-stone-900 text-stone-200 border-stone-950 hover:bg-stone-850"
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-red-300" />
                <span>{isAdminMode ? "مغادرة الإشراف" : "بوابة الإشراف 🛠️ /admin"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
