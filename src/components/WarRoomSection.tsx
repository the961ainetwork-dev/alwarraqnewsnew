import React, { useState } from "react";
import { Article } from "../data/mockArticles";
import { 
  AlertOctagon, 
  ShieldAlert, 
  MapPin, 
  Radio, 
  Eye, 
  Server, 
  TrendingUp, 
  Zap, 
  Clock, 
  ChevronRight, 
  Flame, 
  Compass, 
  Crosshair, 
  Globe, 
  Bookmark, 
  Share2,
  Lock,
  MessageSquare
} from "lucide-react";

interface WarRoomSectionProps {
  onArticleClick: (article: Article) => void;
}

export default function WarRoomSection({ onArticleClick }: WarRoomSectionProps) {
  // Current active geopolitical focus actor (US, Iran, Israel, Lebanon)
  const [activeActor, setActiveActor] = useState<"US" | "IRAN" | "ISRAEL" | "LEBANON">("US");
  
  // Custom interactive level indicator state
  const [escalationVisible, setEscalationVisible] = useState(true);

  // High Stakes geopolitics cover article
  const mainWarRoomArticle: Article = {
    id: "war_room_main",
    title: "مستقبل التوازن البحري والجوي في حوض المتوسط: سيناريوهات المواجهة ورسائل الردع المتبادلة بين الأطراف الأربعة",
    subtitle: "تقرير استخباراتي دقيق يكشف كواليس إعادة موازنة القوات وإحداثيات نقاط المسيرات العائمة وشبكات الرصد المبكر على طول خطوط التماس الساخنة.",
    content: "دخلت منطقة شرق المتوسط والخليج مرحلة بالغة الحساسية مع إعادة توزيع القاذفات والقطع البحرية الاستراتيجية وتوسيع شبكات الإنذار المبكر. وتكثف القوات الدفاعية المشتركة من عمليات المحاكاة الفورية لمواجهة السيناريوهات الطارئة بما يضمن تحييد مخاطر انقطاع الملاحة البحرية الدولية أو إمدادات الطاقة عابرة الحدود الشبه منعدمة بالمسارات الضيقة.",
    category: "غرفة العمليات",
    author: "اللواء الركن م. سمير خلف - المحلل الاستيراتيجي والمستشار الدبلوماسي",
    image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200",
    timestamp: "مباشر • قبل ١٥ دقيقة",
    views: 8960,
    readTime: "قراءة ٧ دقائق"
  };

  const actorsData = {
    US: {
      name: "الولايات المتحدة الأمريكية (Pentagon Posture)",
      status: "شديد الاستنفار • الاستعداد الدفاعي DEFCON-3",
      deployment: "حاملات طائرات فئة فورد، مدمرات هجومية موجهة، غواصات هجوم نووي بالمتوسط والخليج العربي.",
      strategy: "تأمين حماية حرية الملاحة البحرية الدولية، دعم منظومة الرادارات المتكاملة، ومقاصة الضربات الانتقامية السريعة لردع خروقات القواعد العابرة.",
      metrics: {
        readiness: "٩٨٪",
        forces: "٤٥,٠٠٠ جندي إقليمي",
        intelLevel: "متقدم جداً"
      }
    },
    IRAN: {
      name: "إيران (Strategic Defense & Proxy Ring)",
      status: "استنفار صاروخي بالكامل • الدفاع السلبي والمضادات",
      deployment: "كتائب صواريخ كهرومغناطيسية عابرة للمسافات، زوارق مسيرة انتحارية، مراكز تحكم فضائية سيادية.",
      strategy: "تأمين العمق الداخلي، توسيع جدار الاستطلاع البحري، إرسال تحذيرات مستمرة بشأن أي استهداف مباشر لحقول النفط أو الموانئ السيادية.",
      metrics: {
        readiness: "٩٢٪",
        forces: "٣٥٠,٠٠٠ جندي وضابط",
        intelLevel: "رصد مكثف"
      }
    },
    ISRAEL: {
      name: "إسرائيل (IDF Joint Operations Desk)",
      status: "حالة الطوارئ الكبرى • التغطية الهجومية والدفاعية القصوى",
      deployment: "أسراب إف-٣٥ معبأة إلكترونياً، بطاريات القبة الحديدية ومقلاع داود ونظام آرو-٣ السهم التفاعلي بالخدمة الدائمة.",
      strategy: "تفكيك التحصينات اللوجستية الحدودية، شل شبكة الاتصالات اللاسلكية والسيبرانية المعادية، ومنع أي تمركز لصواريخ دقيقة قريباً من التماس.",
      metrics: {
        readiness: "٩٩٪",
        forces: "تعبئة الاحتياط الشاملة",
        intelLevel: "تنسيق متكامل"
      }
    },
    LEBANON: {
      name: "لبنان (Interception Front & Crisis Unit)",
      status: "استنفار الملاجئ المدنية والتحصينات • ترقب دائم",
      deployment: "منصات صواريخ كهرومغناطيسية قصيرة المدى، وحدات دفاع ساحلي مضادة للبوارج الحربية والمسيرات الهجومية لسلامة السيادة.",
      strategy: "تثبيت قواعد الاشتباك التفاوضية، توجيه الرشقات الصاروخية لتعطيل الطيران المتوغل، والتحرك ضمن غطاء الطوارئ الطارئ والمساندة الإنسانية.",
      metrics: {
        readiness: "٨٥٪",
        forces: "جبهة تماس متقدمة",
        intelLevel: "محلي ميداني"
      }
    }
  };

  const hotIntelligenceFeed = [
    {
      time: "12:12 GMT",
      badge: "تحرك عسكري",
      text: "البنتاغون يوجه بتحريك مدمرتين هجوميتين برفقة كاسحة ألغام نووية نحو الشواطئ الشرقية للبحر المتوسط لدعم الدفاعات."
    },
    {
      time: "11:58 GMT",
      badge: "استذكار استخباري",
      text: "رصد من الفضاء يشير إلى إعادة تموضع منصات الصواريخ الثابتة والمتحركة بغرب إيران واستنفار غرف تحكم المسيرات العائمة."
    },
    {
      time: "11:30 GMT",
      badge: "طلعات جوية",
      text: "سلاح الجو الإسرائيلي يكثف غاراته الاستباقية على مستودعات تخزين تكتيكية في تلال البقاع وخطوط الإمداد العابرة عبر سورية."
    },
    {
      time: "11:05 GMT",
      badge: "رصد حدودي",
      text: "فرق الرادار اللبنانية تؤكد التشويش الفوري الكهرومغناطيسي على أحزمة الاتصال المدني واللاسلكي في العاصمة بيروت والجنوب."
    }
  ];

  return (
    <div className="bg-red-50/40 border-2 border-red-100/85 rounded-3xl p-6 md:p-8 space-y-8 shadow-xs animate-fade-in">
      
      {/* HEADER WITH RED PULSING WAR ROOM BRAND */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-red-200/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="bg-red-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-mono shadow-3xs">
              Intelligence Briefing • وثيقة رصد خاصة لغرفة العمليات
            </span>
          </div>
          <h2 className="serif-text text-2xl md:text-3.5xl font-black text-neutral-900 leading-tight">
            غرفة العمليات: أمريكا، إيران، إسرائيل، لبنان (War Room Dashboard)
          </h2>
          <p className="text-xs text-neutral-500 max-w-4xl font-medium leading-relaxed font-[320]">
            رصد حي وخرائط متناسبة لأبعاد الصدام الإقليمي والخطوط الملاحية الساخنة. تغطية موضوعية عقلانية مستقلة بعيدة عن الدعايات الحربية وصيد التهويل.
          </p>
        </div>

        {/* Dynamic Threat Level Indicator Dial */}
        <div className="flex items-center gap-3 bg-red-100/80 border border-red-200/90 rounded-xl px-4 py-2.5 shrink-0 shadow-3xs">
          <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
          <div className="text-right">
            <span className="text-[9px] text-red-800/85 block uppercase font-bold">مؤشر خطر التصعيد المباشر</span>
            <span className="text-xs font-black text-red-700 font-sans tracking-wide">الدرجة الحمراء القصوى (CRITICAL • 9.8/10)</span>
          </div>
        </div>
      </div>

      {/* CORE HERO SECTION LAYOUT (TWO MAIN COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1: INTERACTIVE DESK DISPLAY & COVER NEWS (Occupies 8 columns in grid) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Cover Highlight card inside target */}
          <div 
            onClick={() => onArticleClick(mainWarRoomArticle)}
            className="bg-white border-2 border-red-100/50 rounded-2xl overflow-hidden hover:border-red-500/30 cursor-pointer group transition-all duration-300 shadow-3xs hover:shadow-sm"
          >
            <div className="flex flex-col md:flex-row min-h-[300px]">
              
              {/* Photo portion representing war-like scenery / intelligence equipment */}
              <div className="md:w-1/2 relative h-48 md:h-auto overflow-hidden bg-neutral-100 shrink-0">
                <img 
                  src={mainWarRoomArticle.image} 
                  alt={mainWarRoomArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-transparent opacity-85"></div>
                
                {/* Visual Radar Overlays for Tech Aesthetic */}
                <div className="absolute inset-4 rounded-lg border border-red-500/20 pointer-events-none flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-red-500/20 animate-ping absolute"></div>
                  <div className="w-24 h-24 rounded-full border border-red-500/10 animate-pulse absolute"></div>
                  <span className="absolute bottom-2 left-2 text-[8px] font-mono text-white bg-black/40 px-1 rounded-xs">RADAR MONITOR // SECURE</span>
                </div>
              </div>

              {/* Text brief portion */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-neutral-800 bg-white">
                <div className="space-y-2">
                  <span className="bg-red-50 border border-red-200 text-red-700 text-[9px] font-black px-2 py-0.5 rounded-xs tracking-wider uppercase inline-block font-mono">
                    {mainWarRoomArticle.category}
                  </span>
                  <h3 className="serif-text text-xl md:text-2xl font-black text-neutral-900 group-hover:text-red-600 transition-colors leading-snug">
                    {mainWarRoomArticle.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-[320] text-justify">
                    {mainWarRoomArticle.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-[10px] text-neutral-400">
                  <span className="font-bold text-red-700">بتحليل: {mainWarRoomArticle.author.split("-")[0]}</span>
                  <span className="font-mono">{mainWarRoomArticle.timestamp}</span>
                </div>
              </div>

            </div>
          </div>

          {/* INTERACTIVE ACTOR SHEETS BOARD */}
          <div className="bg-white border border-red-100/65 rounded-2.5xl p-5 md:p-6 space-y-5 shadow-3xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-red-600 animate-spin" />
                <span className="text-xs font-bold text-neutral-800">التموضع العسكري والتقديرات الجيواستراتيجية للحلفاء والأخصام:</span>
              </div>
              <span className="text-[9px] font-mono text-red-600 font-extrabold bg-red-50 px-2 py-0.5 rounded-sm">محدث قبل دقيقة • LIVE REPORT</span>
            </div>

            {/* Navigational Tabs (US, IRAN, ISRAEL, LEBANON) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(actorsData) as Array<keyof typeof actorsData>).map((code) => (
                <button
                  key={code}
                  onClick={() => setActiveActor(code)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black text-center transition-all cursor-pointer border ${
                    activeActor === code
                      ? "bg-red-600 border-red-700 text-white shadow-xs"
                      : "bg-stone-50 border-stone-200 text-neutral-700 hover:bg-red-50/50 hover:text-red-700 hover:border-red-200"
                  }`}
                >
                  {code === "US" ? "🇺🇸 واشنطن" : code === "IRAN" ? "🇮🇷 طهران" : code === "ISRAEL" ? "🇮🇱 ميز العمليات" : "🇱🇧 الحدود اللبنانية"}
                </button>
              ))}
            </div>

            {/* Selected Actor Card Information Details */}
            <div className="bg-stone-50/60 border border-stone-100 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start gap-2 flex-wrap border-b border-stone-200/50 pb-2">
                <h5 className="font-black text-neutral-900 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-red-600 rounded-sm inline-block animate-pulse"></span>
                  <span>{actorsData[activeActor].name}</span>
                </h5>
                <span className="text-[9px] font-bold bg-red-100 border border-red-200 text-red-700 px-2 py-0.5 rounded-sm">
                  {actorsData[activeActor].status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Details text col 1 */}
                <div className="sm:col-span-2 space-y-3 text-right">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-red-700 block">• حجم التواجد والانتشار الميداني:</span>
                    <p className="text-[11px] text-neutral-600 leading-relaxed font-[320] text-justify">{actorsData[activeActor].deployment}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-red-700 block">• العقيدة التكتيكية النشطة:</span>
                    <p className="text-[11px] text-neutral-600 leading-relaxed font-[320] text-justify">{actorsData[activeActor].strategy}</p>
                  </div>
                </div>

                {/* Metric side tabs */}
                <div className="bg-white border border-stone-200/60 p-4 rounded-xl flex flex-col justify-between gap-2 shadow-3xs">
                  <span className="text-[8px] text-neutral-400 font-extrabold block text-center uppercase tracking-wider">جاهزية الترسانة والردود</span>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                      <span>إمكانية الاستفادة:</span>
                      <span className="font-bold text-neutral-800 font-mono">{actorsData[activeActor].metrics.readiness}</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: actorsData[activeActor].metrics.readiness.includes("٪") ? actorsData[activeActor].metrics.readiness.replace("٪","%") : "100%" }} 
                        className="bg-red-600 h-full rounded-full"
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                      <span>التقدير الاستخباري:</span>
                      <span className="font-mono font-black text-amber-600">{actorsData[activeActor].metrics.intelLevel}</span>
                    </div>
                  </div>

                  <span className="text-[8.5px] font-mono text-neutral-400 font-semibold block text-center bg-stone-50 py-0.5 rounded-xs border border-stone-100">{actorsData[activeActor].metrics.forces}</span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* COLUMN 2: HIGH SECURITY WIRE FEED (Occupies 4 columns in grid) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-3xs flex flex-col justify-between min-h-[500px]">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-stone-150 pb-3">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                  <h4 className="serif-text text-sm font-black text-neutral-800">الشبكة اللاسلكية العسكرية الساخنة</h4>
                </div>
                <span className="text-[9px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">SECURE TAP</span>
              </div>

              {/* Secure Military Tapes/Wires List */}
              <div className="space-y-3.5 overflow-y-auto max-h-[440px] pr-1.5 custom-scrollbar">
                {hotIntelligenceFeed.map((wire, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2 hover:border-red-200 hover:bg-red-50/10 cursor-help transition-all shadow-3xs"
                  >
                    <div className="flex justify-between items-center gap-1">
                      <span className="bg-red-50 border border-red-200 text-red-700 text-[8px] font-extrabold px-2 py-0.5 rounded-xs select-none font-mono">
                        {wire.badge}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 font-semibold">{wire.time}</span>
                    </div>
                    <p className="text-[10px] text-neutral-600 leading-relaxed font-[310] text-justify">
                      {wire.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-center">
              <div className="flex justify-center items-center gap-1 text-[8px] text-neutral-400 font-mono">
                <Server className="w-2.5 h-2.5 text-neutral-300" />
                <span>ACTIVE STREAM node: SECURE-ROOM-NODE-ZULU</span>
              </div>
              <p className="text-[8px] text-neutral-400 leading-relaxed">
                ملاحظة: هذا المحتوى يُستمد لأغراض التوثيق الأكاديمي والتحليل الجيوسياسي لربط خطوط الشحن بالمنطقة بعيداً عن البروباغندا الإعلامية.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
