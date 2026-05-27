import React from "react";
import { Article } from "../data/mockArticles.js";
import { Eye, Clock, TrendingUp } from "lucide-react";

interface LatestNewsProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export default function LatestNews({ articles, onArticleClick }: LatestNewsProps) {
  // Sort by some ID or key to get latest 5
  const latestArticles = [...articles].slice(0, 5);

  // Sort by static or simulated views to get top 5 read
  const mostReadArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Latest Updates Timeline */}
      <div className="bg-white border border-neutral-200/80 p-5 shadow-2xs rounded-xs">
        <div className="flex items-center gap-2 border-b-2 border-brand-primary pb-3 mb-4 select-none">
          <Clock className="w-4.5 h-4.5 text-brand-primary" />
          <h3 className="serif-text text-lg font-bold text-neutral-900">آخر الأخبار</h3>
          <span className="bg-red-100 text-brand-primary text-[10px] font-bold px-1.5 py-0.5 rounded-xs animate-pulse">مباشر</span>
        </div>

        <div className="relative border-r border-neutral-100 pr-4 mr-1 flex flex-col gap-5">
          {latestArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="group cursor-pointer relative"
            >
              {/* Timeline Bullet Indicator */}
              <div className="absolute -right-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-300 border-2 border-white group-hover:bg-brand-primary transition-all duration-150"></div>

              <span className="text-[10px] font-medium text-brand-primary bg-rose-50 px-1.5 py-0.5 rounded-xs inline-block mb-1.5">
                {article.timestamp}
              </span>
              <h4 className="serif-text text-sm font-bold text-neutral-800 group-hover:text-brand-primary transition-colors duration-150 line-clamp-2 leading-tight">
                {article.title}
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                <span>{article.category}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Most Read Rankings */}
      <div className="bg-white border border-neutral-200/80 p-5 shadow-2xs rounded-xs">
        <div className="flex items-center gap-2 border-b-2 border-brand-primary pb-3 mb-4 select-none">
          <TrendingUp className="w-4.5 h-4.5 text-brand-primary" />
          <h3 className="serif-text text-lg font-bold text-neutral-900">الأكثر قراءة</h3>
        </div>

        <div className="flex flex-col gap-4">
          {mostReadArticles.map((article, index) => (
            <div
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="flex items-start gap-3 cursor-pointer group pb-3.5 border-b border-neutral-100/65 last:border-none last:pb-0"
            >
              {/* Large ranking indicator */}
              <span className="serif-text text-3xl font-extrabold text-neutral-300 group-hover:text-brand-primary transition-colors duration-150 min-w-[28px]">
                {index + 1}
              </span>

              <div className="flex-1">
                <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wide block mb-0.5">
                  {article.category}
                </span>
                <h4 className="serif-text text-xs md:text-sm font-bold text-neutral-800 leading-tight group-hover:underline dec-brand-primary decoration-1 underline-offset-3">
                  {article.title}
                </h4>
                <span className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-neutral-300" />
                  <span>{article.views || 100} قراءة</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
