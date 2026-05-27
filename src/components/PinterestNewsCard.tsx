import React, { useState, useEffect } from "react";
import { Article } from "../data/mockArticles";
import { Eye, Clock, User, Bookmark } from "lucide-react";

interface PinterestNewsCardProps {
  key?: React.Key;
  article: Article;
  onClick: (article: Article) => void;
  showCategoryBadge?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (articleId: string, e: React.MouseEvent) => void;
}

export default function PinterestNewsCard({ 
  article, 
  onClick, 
  showCategoryBadge = true,
  isBookmarked,
  onToggleBookmark
}: PinterestNewsCardProps) {
  // Safe helper to get views
  const formatViews = (views?: number) => {
    if (!views) return "١٠٠+";
    return views >= 1000 
      ? `${(views / 1000).toFixed(1).replace(".", ",")}k` 
      : views.toString();
  };

  const [localBookmarked, setLocalBookmarked] = useState(false);

  // Synchronize with external prop if provided, or read from localStorage
  useEffect(() => {
    if (typeof isBookmarked !== "undefined") {
      setLocalBookmarked(isBookmarked);
    } else {
      const saved = localStorage.getItem("bookmarked_articles");
      const list = saved ? JSON.parse(saved) : [];
      setLocalBookmarked(list.includes(article.id));
    }
  }, [isBookmarked, article.id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onToggleBookmark) {
      onToggleBookmark(article.id, e);
    } else {
      // Direct local storage toggle fallback
      const saved = localStorage.getItem("bookmarked_articles");
      let list = saved ? JSON.parse(saved) : [];
      let nextState = false;
      if (list.includes(article.id)) {
        list = list.filter((idStr: string) => idStr !== article.id);
        nextState = false;
      } else {
        list.push(article.id);
        nextState = true;
      }
      localStorage.setItem("bookmarked_articles", JSON.stringify(list));
      setLocalBookmarked(nextState);
      
      // Dispatch custom sync event
      window.dispatchEvent(new Event("bookmarks_changed"));
    }
  };

  return (
    <div 
      onClick={() => onClick(article)}
      className="bg-white rounded-xl overflow-hidden border border-neutral-100 hover:border-brand-primary/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer relative h-full transform hover:-translate-y-1"
    >
      {/* Article Image Container */}
      <div className="relative w-full h-48 overflow-hidden shrink-0 bg-neutral-100">
        <img 
          src={article.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"} 
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60"></div>
        
        {/* Views Count tag Top-Right */}
        <span className="absolute top-3 right-3 bg-neutral-900/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs select-none">
          <Eye className="w-3 h-3 text-rose-300" />
          <span>{formatViews(article.views)}</span>
        </span>

        {/* Category Label Pin-Badge Top-Left */}
        {showCategoryBadge && (
          <span className="absolute top-3 left-3 bg-brand-primary text-white text-[9px] font-extrabold px-2.5 py-1 rounded-sm shadow-sm select-none tracking-wider font-sans">
            {article.category}
          </span>
        )}

        {/* Localized Floating Bookmark Save Button Bottom-Left */}
        <button
          onClick={handleBookmarkClick}
          className={`absolute bottom-3 left-3 z-10 p-2 rounded-full transition-all duration-200 cursor-pointer shadow-3xs border ${
            localBookmarked
              ? "bg-red-50 text-brand-primary border-red-200 scale-105"
              : "bg-white/90 hover:bg-white text-neutral-600 hover:text-brand-primary border-neutral-100 hover:scale-105"
          }`}
          title={localBookmarked ? "إلغاء حفظ المقال" : "حفظ المقال للرجوع إليه لاحقاً"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${localBookmarked ? "fill-brand-primary text-brand-primary" : "text-neutral-500 hover:text-brand-primary"}`} />
        </button>
      </div>

      {/* Card Details and Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Sibling badge / Timestamp row */}
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
            <span className="text-brand-primary font-bold">{article.readTime || "قراءة ٣ دقائق"}</span>
            <span>•</span>
            <span className="font-mono">{article.timestamp}</span>
          </div>

          {/* Cairo Bold paired Headline */}
          <h4 className="serif-text text-stone-900 text-sm font-bold leading-snug tracking-tight group-hover:text-brand-primary transition-colors duration-150 line-clamp-2">
            {article.title}
          </h4>

          {/* Clean Light-weight Egyptian Style Subtitle */}
          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 font-[320]">
            {article.subtitle}
          </p>
        </div>

        {/* Signature & Editorial Signature Row */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-medium mt-auto">
          <span className="flex items-center gap-1 text-neutral-700 font-bold max-w-[150px] truncate">
            <User className="w-3 h-3 text-brand-primary shrink-0" />
            <span className="truncate">{article.author.split("-")[0].trim()}</span>
          </span>
          <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-xs">
            الوراق
          </span>
        </div>
      </div>
    </div>
  );
}
