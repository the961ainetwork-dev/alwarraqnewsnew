import React, { useState, useEffect } from "react";
import { Article } from "../data/mockArticles.js";
import { X, Clock, User, Sparkles, AlertCircle, Quote, Eye, BookOpen, Share2, Copy, Download, Check, Palette, Image as ImageIcon, Volume2, Square, Pause, Play } from "lucide-react";

interface ArticleReaderProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleReader({ article, onClose }: ArticleReaderProps) {
  const [summary, setSummary] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom states for the interactive Open Graph social share creator
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareTheme, setShareTheme] = useState<"cream" | "dark" | "photo">("cream");
  const [generatedCardUrl, setGeneratedCardUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reading progress scroll state
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio Speech Synthesis (TTS) state for custom Arabic voice output
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);

  const startAudioReader = () => {
    if ("speechSynthesis" in window) {
      // Clear any prior active speech queues first
      window.speechSynthesis.cancel();

      // Concatenate fields for consistent read feedback
      const cleanBodyText = article.content.replace(/\r?\n|\r/g, " ");
      const fullTextToRead = `المقال بعنوان: ${article.title}. ${article.subtitle ? `العنوان الفرعي: ${article.subtitle}.` : ""}. ${cleanBodyText}`;
      const utterance = new SpeechSynthesisUtterance(fullTextToRead);
      utterance.lang = "ar-SA"; // Standard Arabic narration

      // Fallback matching logic for premium voices
      try {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith("ar-") || v.lang === "ar") || voices.find(v => v.lang.includes("ar"));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      } catch (voiceErr) {
        console.warn("Failed choosing premium voice:", voiceErr);
      }

      utterance.rate = 1.0; // Perfect standard cadence

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesisUtterance Error:", e);
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
    } else {
      alert("عذراً، متصفحك الحالي لا يدعم ميزة قراءة المقالات صوتياً.");
    }
  };

  const stopAudioReader = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }
  };

  const togglePauseAudioReader = () => {
    if ("speechSynthesis" in window && isPlayingAudio) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
      }
    }
  };

  // Helper handling active scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const progress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  };

  // Synchronize path location changes and clear audio queue
  useEffect(() => {
    setSummary(null);
    setError(null);
    setIsShareOpen(false);
    setScrollProgress(0);

    // Cancel text speech when loaded article is switched
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  }, [article]);

  // Clean speech synthesis output upon unmounting the reader component
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, content: article.content })
      });
      if (!response.ok) {
        throw new Error("تعذر الاتصال بخادم التلخيص");
      }
      const data = await response.json();
      if (data.bullets) {
        setSummary(data.bullets);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setError("نعتذر عن عدم إمكانية صياغة التلخيص في الوقت الحالي. الرجاء المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  // Canvas Open Graph style rendering engine
  const handleGenerateShareCard = () => {
    setIsGenerating(true);
    
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    const drawContent = (imageLoaded: boolean, loadedImageObj?: HTMLImageElement) => {
      // Direct RTL configuration for Arabic ligation support in HTML5 canvas
      ctx.direction = "rtl";
      
      if (shareTheme === "cream") {
        // Theme A: Editorial Classic Cream
        ctx.fillStyle = "#fdfbf7"; 
        ctx.fillRect(0, 0, 1200, 630);

        // Elegant thick brand crimson outer frame
        ctx.strokeStyle = "#a12c2e";
        ctx.lineWidth = 14;
        ctx.strokeRect(7, 7, 1200 - 14, 630 - 14);

        // Thin warm gold accent inner frame
        ctx.strokeStyle = "#d9a752";
        ctx.lineWidth = 2;
        ctx.strokeRect(22, 22, 1200 - 44, 630 - 44);

        // Large beautiful transparent Arabic background watermark
        ctx.fillStyle = "rgba(161, 44, 46, 0.03)";
        ctx.font = "900 240px 'Noto Naskh Arabic', 'Cairo', serif";
        ctx.textAlign = "center";
        ctx.fillText("الوراق", 600, 420);

        // Newspaper top brand header
        ctx.fillStyle = "#a12c2e";
        ctx.font = "bold 32px 'Noto Naskh Arabic', 'Cairo', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("الـورّاق نـيـوِز • alwarraq.news", 600, 95);

        // Thin division line
        ctx.strokeStyle = "rgba(161, 44, 46, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(350, 125);
        ctx.lineTo(850, 125);
        ctx.stroke();

        // High-contrast crimson category box
        ctx.fillStyle = "#a12c2e";
        ctx.fillRect(500, 145, 200, 36);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px 'Cairo', 'Noto Naskh Arabic', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(article.category, 600, 169);

        // Wrapped dynamic Title Text placement
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "bold 44px 'Noto Naskh Arabic', 'Cairo', serif";
        ctx.textAlign = "right";
        const textRightAnchor = 1120;
        let runningY = 245;
        const totalLines = wrapText(ctx, article.title, textRightAnchor, runningY, 1040, 68);

        // Wrapped subtitle excerpt
        if (article.subtitle) {
          ctx.fillStyle = "#555555";
          ctx.font = "300 24px 'Cairo', 'Noto Naskh Arabic', sans-serif";
          ctx.textAlign = "right";
          const subtitleY = runningY + (totalLines * 68) + 15;
          wrapText(ctx, article.subtitle, textRightAnchor, subtitleY, 1040, 38);
        }

        // Horizontal footer line
        ctx.strokeStyle = "rgba(161, 44, 46, 0.1)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(100, 520);
        ctx.lineTo(1100, 520);
        ctx.stroke();

        // Footer signatures
        ctx.fillStyle = "#a12c2e";
        ctx.font = "bold 20px 'Cairo', 'Noto Naskh Arabic', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`بقلم الكاتب الصحفي: ${article.author}`, 1100, 565);

        ctx.fillStyle = "#777777";
        ctx.font = "italic 16px 'Cairo', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`منصة التحليلات السيادية • ${article.timestamp}`, 100, 565);

      } else if (shareTheme === "dark") {
        // Theme B: Elite Premium Charcoal Gold
        ctx.fillStyle = "#161513"; 
        ctx.fillRect(0, 0, 1200, 630);

        // Thicker imperial golden border frame
        ctx.strokeStyle = "#c59f5b";
        ctx.lineWidth = 12;
        ctx.strokeRect(6, 6, 1200 - 12, 630 - 12);

        // Inner golden line highlighter
        ctx.strokeStyle = "rgba(197, 159, 91, 0.45)";
        ctx.lineWidth = 1;
        ctx.strokeRect(22, 22, 1200 - 44, 630 - 44);

        // Dark background watermark text
        ctx.fillStyle = "rgba(197, 159, 91, 0.02)";
        ctx.font = "900 260px 'Noto Naskh Arabic', serif";
        ctx.textAlign = "center";
        ctx.fillText("الوراق", 600, 420);

        // Gold brand logo
        ctx.fillStyle = "#c59f5b";
        ctx.font = "bold 32px 'Cairo', 'Noto Naskh Arabic', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("الـورّاق نـيـوِز • ALWARRAQ NEWS", 600, 95);

        // Golden dividing accent
        ctx.strokeStyle = "rgba(197, 159, 91, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(400, 125);
        ctx.lineTo(800, 125);
        ctx.stroke();

        // Golden bordered category badge
        ctx.fillStyle = "rgba(197, 159, 91, 0.15)";
        ctx.strokeStyle = "#c59f5b";
        ctx.lineWidth = 1.5;
        ctx.fillRect(500, 145, 200, 36);
        ctx.strokeRect(500, 145, 200, 36);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 17px 'Cairo', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(article.category, 600, 169);

        // Light elegant gold wrapped Title typography
        ctx.fillStyle = "#faf6ee";
        ctx.font = "bold 44px 'Noto Naskh Arabic', 'Cairo', serif";
        ctx.textAlign = "right";
        const textRightAnchor = 1120;
        let runningY = 245;
        const totalLines = wrapText(ctx, article.title, textRightAnchor, runningY, 1040, 68);

        // Warm subtitle excerpt description
        if (article.subtitle) {
          ctx.fillStyle = "#bfae93";
          ctx.font = "300 24px 'Cairo', 'Noto Naskh Arabic', sans-serif";
          ctx.textAlign = "right";
          const subtitleY = runningY + (totalLines * 68) + 15;
          wrapText(ctx, article.subtitle, textRightAnchor, subtitleY, 1040, 38);
        }

        // Gold footer separator line
        ctx.strokeStyle = "rgba(197, 159, 91, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 520);
        ctx.lineTo(1100, 520);
        ctx.stroke();

        // Footer metadata signatures
        ctx.fillStyle = "#c59f5b";
        ctx.font = "bold 20px 'Cairo', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`بإمضاء وقلم المحلل: ${article.author}`, 1100, 565);

        ctx.fillStyle = "#8a8170";
        ctx.font = "italic 16px 'Cairo', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`التقرير التحليلي الصادر يوم: ${article.timestamp}`, 100, 565);

      } else if (shareTheme === "photo") {
        // Theme C: Half-Picture Modern Layout
        ctx.fillStyle = "#fdfbf7"; 
        ctx.fillRect(0, 0, 1200, 630);

        // Outer brand crimson line margins
        ctx.strokeStyle = "#a12c2e";
        ctx.lineWidth = 12;
        ctx.strokeRect(6, 6, 1200 - 12, 630 - 12);

        if (imageLoaded && loadedImageObj) {
          // Render photo clipping box inside left column frame
          try {
            ctx.drawImage(loadedImageObj, 18, 18, 510, 594);
          } catch (e) {
            console.error("Internal canvas drawing cross-origin blocker triggered:", e);
          }
          
          // Outer separator strip on photos edge
          ctx.fillStyle = "#a12c2e";
          ctx.fillRect(521, 18, 12, 594);
        } else {
          // Warm red artistic background gradient acting as CORS fallback banner
          const gradient = ctx.createLinearGradient(18, 18, 520, 594);
          gradient.addColorStop(0, "#a12c2e");
          gradient.addColorStop(1, "#3c0b0c");
          ctx.fillStyle = gradient;
          ctx.fillRect(18, 18, 502, 594);

          // Graphic Arabic logo watermark
          ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
          ctx.font = "bold 130px 'Noto Naskh Arabic', serif";
          ctx.textAlign = "center";
          ctx.fillText("الوراق", 269, 320);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 24px 'Cairo', sans-serif";
          ctx.fillText("الـورّاق نـيـوز", 269, 380);
        }

        // RIGHT SIDE EXQUISITE EDITORIAL CARD details
        // Pill-text division category header
        ctx.fillStyle = "#a12c2e";
        ctx.font = "bold 17px 'Cairo', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`| ملف: ${article.category}`, 1140, 65);

        // Header Title in narrower margins fit
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "bold 38px 'Noto Naskh Arabic', 'Cairo', serif";
        ctx.textAlign = "right";
        const textRightAnchor = 1140;
        let runningY = 130;
        const totalLines = wrapText(ctx, article.title, textRightAnchor, runningY, 560, 60);

        // Subtitle Wrapped
        if (article.subtitle) {
          ctx.fillStyle = "#55524e";
          ctx.font = "300 22px 'Cairo', sans-serif";
          ctx.textAlign = "right";
          const subtitleY = runningY + (totalLines * 60) + 15;
          wrapText(ctx, article.subtitle, textRightAnchor, subtitleY, 560, 34);
        }

        // Separate footer content right split
        ctx.strokeStyle = "rgba(161, 44, 46, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(560, 510);
        ctx.lineTo(1140, 510);
        ctx.stroke();

        ctx.fillStyle = "#a12c2e";
        ctx.font = "bold 19px 'Cairo', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`مقال مُميز بقلم: ${article.author}`, 1140, 550);

        ctx.fillStyle = "#777777";
        ctx.font = "14px 'Cairo', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`العمق الاستراتيجي • ${article.timestamp}`, 1140, 582);

        // Web URL Domain tag inside Left edge content area
        ctx.fillStyle = "#888888";
        ctx.font = "bold 15px 'Cairo', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("alwarraq.news", 560, 582);
      }

      // Convert drawing frame to a downloadable high-density URL png data stream
      const finalDataUrl = canvas.toDataURL("image/png");
      setGeneratedCardUrl(finalDataUrl);
      setIsGenerating(false);
    };

    // Safe Canvas wrapping word tool for clean Cairo/Noto Arabic margins text drawing
    function wrapText(
      context: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ) {
      const words = text.split(" ");
      let line = "";
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      for (let k = 0; k < lines.length; k++) {
        context.fillText(lines[k].trim(), x, y + (k * lineHeight));
      }
      return lines.length;
    }

    // Modern dynamic loading utilizing image CORS compatibility check
    if (shareTheme === "photo" && article.image) {
      const imgObj = new Image();
      imgObj.crossOrigin = "anonymous";
      imgObj.onload = () => {
        drawContent(true, imgObj);
      };
      imgObj.onerror = () => {
        console.warn("Unable to obtain cross-origin article background poster safely for share layout.");
        drawContent(false);
      };
      imgObj.src = article.image;
    } else {
      // Small delayed trigger to guarantee Google Font Noto Naskh rendering is fully initialized
      setTimeout(() => {
        drawContent(false);
      }, 100);
    }
  };

  // Re-generate social card preview when either theme or share popup opens
  useEffect(() => {
    if (isShareOpen) {
      handleGenerateShareCard();
    }
  }, [isShareOpen, shareTheme, article]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-fade-in">
      {/* Container card */}
      <div 
        className="bg-white w-full max-w-4xl rounded-xs shadow-2xl relative flex flex-col max-h-[92vh] border-t-8 border-brand-primary overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reader Top Action Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-brand-primary bg-rose-50 px-2.5 py-1 rounded-sm uppercase">
              {article.category}
            </span>
            <span className="text-xs text-neutral-400 font-mono">• {article.readTime}</span>

            {/* Audio Reader Control Buttons */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-sm border border-neutral-200 shadow-3xs mr-2">
              {isPlayingAudio ? (
                <>
                  <button
                    onClick={togglePauseAudioReader}
                    className="p-1 text-neutral-600 hover:text-brand-primary transition-colors cursor-pointer"
                    title={isPausedAudio ? "استئناف القراءة الصوتية" : "إيقاف مؤقت للقراءة الصوتية"}
                  >
                    {isPausedAudio ? <Play className="w-3.5 h-3.5 fill-neutral-650 text-neutral-650" /> : <Pause className="w-3.5 h-3.5 fill-neutral-650 text-neutral-650" />}
                  </button>
                  <button
                    onClick={stopAudioReader}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer animate-pulse"
                    title="إنهاء القراءة والاستماع"
                  >
                    <Square className="w-3 h-3 fill-red-600 text-red-600" />
                  </button>
                  <span className="text-[10px] font-bold text-brand-primary px-1 animate-pulse">جاري القراءة... 🎙️</span>
                </>
              ) : (
                <button
                  onClick={startAudioReader}
                  className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold text-neutral-700 hover:text-brand-primary hover:bg-rose-50/50 rounded-xs transition-all active:scale-95 cursor-pointer"
                  title="استمع إلى هذا المقال بصوت قارئ الوراق"
                >
                  <Volume2 className="w-3.5 h-3.5 text-brand-primary animate-bounce" />
                  <span>استمع للمقال 🎧</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className={`p-1.5 rounded-sm transition-colors ${
                isShareOpen 
                  ? "bg-brand-primary text-white" 
                  : "text-neutral-500 hover:text-brand-primary hover:bg-neutral-100"
              }`}
              title="مشاركة الخبر وتصميم الصورة المصغرة"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <button
              id="close-reader-btn"
              onClick={onClose}
              className="p-1.5 text-neutral-600 hover:text-brand-primary hover:bg-neutral-100 rounded-sm transition-colors cursor-pointer"
              title="إغلاق القارئ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slim, fixed reading progress bar directly below the top Action Bar */}
        <div className="w-full bg-stone-100/70 h-1 relative z-30 overflow-hidden">
          <div 
            className="bg-brand-primary h-full transition-all duration-100 ease-out" 
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Dynamic Social Sharing Creator Section Box (Open Graph Generator) */}
        {isShareOpen && (
          <div className="bg-stone-50 border-b border-rose-50 p-5 md:p-6 animate-slide-down space-y-4 text-right dir-rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-200">
              <div>
                <h3 className="serif-text text-lg font-black text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
                  <span>مولد مظهر الصور المصغرة لمواقع التواصل</span>
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium">قُم بتصميم بطاقة مشاركة احترافية مميزة تحتوي على اسم الكاتب وعنوان المقال وعلامتنا التجارية.</p>
              </div>
              <button 
                onClick={() => setIsShareOpen(false)}
                className="text-xs font-bold text-neutral-400 hover:text-brand-primary cursor-pointer"
              >
                إغلاق اللوحة &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Options Sidebar (Left/Right depending on direction - Column occupies 2 cols in grid) */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">اختيار مظهر ونمط البطاقة:</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setShareTheme("cream")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      shareTheme === "cream" 
                        ? "bg-amber-50 border-brand-primary text-brand-primary font-bold shadow-3xs" 
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-stone-50"
                    }`}
                  >
                    <Palette className="w-4.5 h-4.5 mx-auto mb-1 text-rose-800" />
                    <span className="text-xs block">البيج الملكي</span>
                  </button>

                  <button 
                    onClick={() => setShareTheme("dark")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      shareTheme === "dark" 
                        ? "bg-neutral-900 border-yellow-600 text-yellow-500 font-bold shadow-3xs" 
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-stone-50"
                    }`}
                  >
                    <Palette className="w-4.5 h-4.5 mx-auto mb-1 text-yellow-500" />
                    <span className="text-xs block">النخبة الداكن</span>
                  </button>

                  <button 
                    onClick={() => setShareTheme("photo")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      shareTheme === "photo" 
                        ? "bg-rose-50 border-rose-800 text-rose-800 font-bold shadow-3xs" 
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-stone-50"
                    }`}
                  >
                    <ImageIcon className="w-4.5 h-4.5 mx-auto mb-1 text-slate-700" />
                    <span className="text-xs block">البانورامي بالصورة</span>
                  </button>
                </div>

                <div className="bg-stone-100 p-3.5 rounded-lg space-y-3">
                  <span className="text-[10px] font-bold text-neutral-500 block">نسخ الرابط لمشاركته مع الصورة:</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}/article/${article.id}`}
                      className="flex-1 text-[11px] bg-white border border-neutral-200 px-2.5 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                    <button 
                      onClick={() => {
                        const shareText = `القرّاء الأعزاء، يسرني مشاركة هذا التحليل الشيق من منصّة الوراق: \n"${article.title}"\nبإمضاء: ${article.author}\nتصفح التحليل والمقال كاملاً: ${window.location.origin}/article/${article.id}`;
                        navigator.clipboard.writeText(shareText);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="bg-neutral-800 hover:bg-brand-primary active:bg-brand-primary text-white p-2 rounded-md transition-all cursor-pointer text-xs"
                      title="نسخ الرابط والتقرير معاً"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {isCopied && <span className="text-[10px] text-emerald-600 block font-medium animate-pulse">تم نسخ المنشور المصحوب برابط الإحالة وصيغة الكاتب بنجاح!</span>}
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1.5">مشاركة عبر قنوات التواصل:</span>
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`طالع هذا المنشور التحليلي الفكري المميز عبر موقع الوراق نيوز:\n"${article.title}"\n${window.location.origin}/article/${article.id}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-neutral-900 text-white text-[10px] font-bold px-3 py-2 rounded-md transition-transform hover:-translate-y-0.5"
                    >
                      منصة X (تويتر)
                    </a>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*الوراق نيوز:*\n"${article.title}"\nبإمضاء: ${article.author}\n${window.location.origin}/article/${article.id}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-2 rounded-md transition-transform hover:-translate-y-0.5"
                    >
                      واتساب
                    </a>
                    <a 
                      href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/article/${article.id}`)}&text=${encodeURIComponent(`الوراق نيوز - ${article.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-sky-500 text-white text-[10px] font-bold px-3 py-2 rounded-md transition-transform hover:-translate-y-0.5"
                    >
                      تليجرام
                    </a>
                  </div>
                </div>
              </div>

              {/* Generated Picture Dynamic Preview (Column occupies 3 cols in layout) */}
              <div className="md:col-span-3 space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">لوحة العرض الافتراضية والجاهزة للتحميل (Open Graph Social Card):</span>
                
                <div className="relative border border-stone-200 rounded-lg overflow-hidden bg-white shadow-3xs max-w-full aspect-[1.91/1] flex items-center justify-center">
                  {isGenerating ? (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 boundary-pulse border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold text-neutral-600">جاري غزل وتهيئة خطوط الفن العربي...</span>
                    </div>
                  ) : null}

                  {generatedCardUrl ? (
                    <img 
                      src={generatedCardUrl} 
                      alt="Open Graph preview Card"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="py-20 text-center text-neutral-400 text-xs">جاري تهيئة الصورة المصغرة...</div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <a 
                    href={generatedCardUrl} 
                    download={`alwarraq-news-card-${article.id}.png`}
                    className="bg-brand-primary hover:bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <Download className="w-4 h-4 text-rose-300" />
                    <span>تحميل صورة المشاركة (PNG)</span>
                  </a>
                  <button 
                    onClick={handleGenerateShareCard}
                    className="bg-stone-100 hover:bg-stone-200 text-neutral-700 text-xs font-bold px-3 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-300"
                  >
                    تحديث المعاينة
                  </button>
                </div>
                <p className="text-[9px] text-neutral-600 leading-relaxed max-w-lg">
                  * نصيحة: الصورة أعلاه هي بدقة فائقة الجودة <strong className="font-mono">1200x630 (aspect ratio 1.91:1)</strong> معتمدة تماماً من خوارزميات ومحركات وسائل التواصل الاجتماعي كفيسبوك، ولينكد إن، وتويتر لعرض غلاف الأخبار بشكل مذهل وبلا قص خارجي.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Body Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6" onScroll={handleScroll}>
          {/* Article Editorial Hierarchy */}
          <div className="space-y-4">
            <h2 className="serif-text text-2xl md:text-4xl font-bold text-neutral-900 leading-tight">
              {article.title}
            </h2>
            
            {article.subtitle && (
              <p className="text-lg text-neutral-600 font-medium border-r-4 border-brand-primary pr-3 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Metas Column */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs text-neutral-500 pt-3 border-y border-stone-100 py-3.5">
              <span className="flex items-center gap-1.5 text-neutral-800 font-semibold">
                <User className="w-4 h-4 text-brand-primary" />
                <span>الكاتب: {article.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>تاريخ النشر: {article.timestamp}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                <span>المشاهدات: {article.views || 450}</span>
              </span>
            </div>
          </div>

          {/* Article Image Container */}
          <div className="relative group">
            <img 
              src={article.image} 
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-80 md:h-100 object-cover rounded-xs border border-stone-200/60 shadow-xs"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-stone-200 text-[11px] font-medium leading-relaxed rounded-b-xs">
              اللقطة الافتراضية تعكس رمزية التموقع الهيكلي واللوجستي لمسائل التغطية قيد التحليل. (تصوير إندبندنت أرشيف)
            </div>
          </div>

          {/* Core Content and AI Summary Side by Side or Vertical Column grid split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            {/* The Text Column (Main) */}
            <div className="lg:col-span-2 space-y-5">
              {article.content.split("\n\n").map((para, i) => (
                <p 
                  key={i} 
                  className="serif-text text-base md:text-[17px] text-neutral-850 leading-[1.8] text-justify font-[350]"
                >
                  {para}
                </p>
              ))}

              {/* Decorative Newspaper Quote Pullout */}
              <div className="border-y-2 border-brand-primary py-4 px-6 my-6 bg-stone-50/70 select-none">
                <Quote className="w-8 h-8 text-brand-primary/20 float-right ml-2 mb-2" />
                <p className="serif-text text-lg italic text-neutral-700 leading-relaxed font-semibold">
                  "التغيرات البنيوية في الأسواق والسياسة تستوجب التقييم العقلاني الهادئ بعيداً عن صخب المواقف اللحظية المتشنجة."
                </p>
              </div>
            </div>

            {/* AI Assistant Summary Side column widget */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-stone-50 border border-brand-primary/15 rounded-xs p-5 space-y-4 shadow-3xs">
                <div className="flex items-center gap-2 border-b border-brand-primary/10 pb-2.5">
                  <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
                  <h4 className="serif-text text-base font-bold text-neutral-900">
                    ملخص الذكاء الاصطناعي ⚡
                  </h4>
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  احصل على كبسولة معرفية مقتضبة تتضمن ٣ ركائز أساسية مستوحاة من مضمون هذا المقال التحليلي الطويل.
                </p>

                {summary ? (
                  <div className="space-y-3 animate-fade-in text-sm text-neutral-800 leading-relaxed">
                    {summary.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="serif-text font-bold text-brand-primary inline-block min-w-[14px]">
                          {idx + 1}.
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}

                    <button
                      onClick={handleFetchSummary}
                      disabled={isLoading}
                      className="text-[11px] text-brand-primary font-semibold hover:underline block pt-2 mt-2"
                    >
                      تحديث التحليل الحالي
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleFetchSummary}
                    disabled={isLoading}
                    className="w-full bg-neutral-900 hover:bg-brand-primary active:bg-red-950 text-stone-100 text-[11px] md:text-xs font-semibold py-2 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-all duration-150 shadow-xs cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isLoading ? "جاري صياغة الركائز..." : "لخص التحليل في ٣ نقاط"}</span>
                  </button>
                )}

                {isLoading && (
                  <div className="space-y-2 pt-1 animate-pulse">
                    <div className="h-3.5 bg-neutral-200 rounded-sm w-full"></div>
                    <div className="h-3.5 bg-neutral-200 rounded-sm w-11/12"></div>
                    <div className="h-3.5 bg-neutral-200 rounded-sm w-10/12"></div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reader Footer Panel */}
        <div className="bg-stone-50 border-t border-stone-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 gap-2 select-none">
          <span>جهة الترخيص للأقسام والمحتوى المقارن: إندبندنت عربية للصحافة والنشر</span>
          <span className="font-mono">ID: {article.id} • INDEPENDENT REPLICA PROCESSOR</span>
        </div>
      </div>
    </div>
  );
}
