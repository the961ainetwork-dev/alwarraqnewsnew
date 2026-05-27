import React, { useState } from "react";
import { Article } from "../data/mockArticles";
import { 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  Globe, 
  Percent, 
  Briefcase, 
  Coins, 
  ChevronLeft, 
  Clock, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Sparkles,
  Award
} from "lucide-react";
import PinterestNewsCard from "./PinterestNewsCard";

interface MiddleEastEconomiesSectionProps {
  onArticleClick: (article: Article) => void;
}

export default function MiddleEastEconomiesSection({ onArticleClick }: MiddleEastEconomiesSectionProps) {
  // Custom interactive state for infographic country stats selection
  const [selectedCountry, setSelectedCountry] = useState<"KSA" | "UAE" | "QAT" | "OMN">("KSA");
  
  // Custom state to expand individually selected newswire item
  const [expandedNewswire, setExpandedNewswire] = useState<number | null>(null);

  // Row 1: Premier Full Width Feature Article data
  const row1Article: Article = {
    id: "me_econ_full",
    title: "ممرات التجارة العابرة بالقارات ورؤية ٢٠٣٠: تدفق استثمار نوعي بـ ٢٨٠ مليون دولار لربط شبكة الموانئ بالمنطقة",
    subtitle: "صناديق سيادية إقليمية تبحث تمويل مسارات ربط بحرية وخطوط مائية فائقة السرعة مع الموانئ العالمية لدعم استدامة سلاسل الإمداد اللوجستي والتنقل السلس.",
    content: `تشهد بلدان الخليج العربي والشرق الأوسط حراكاً جيو-اقتصادياً استثنائياً يتمثل في تدشين تكتلات وممرات لوجستية مشتركة لنقل الطاقة البديلة والسلع المصنعة عبر موانئ متطورة وبطرق ملاحية ورقمية مدمجة بالذكاء الاصطناعي. تهدف هذه الخطوة لزيادة المرونة الحدودية وتقليص زمن نقل وترانزيت الحاويات بنسبة تتعدى ٤٥٪، مدعومة بصناديق استثمارية عملاقة تشمل دمج المعاملات المصرفية والجمركية الذكية لإنشاء أول تكتل تبادل حر مرن بالكامل بحلول نهاية عام ٢٠٢٦. يرى خبراء الاقتصاد الدولي أن تحييد البيروقراطية واستدامة سلاسل النقل يدفع مستويات النمو نحو آفاق تاريخية غير مسبوقة.`,
    category: "اقتصاديات الشرق الأوسط",
    author: "د. مصطفى الشمري - كبير الخبراء الماليين في الشرق الأوسط",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    timestamp: "قبل ٣٠ دقيقة",
    views: 4520,
    readTime: "قراءة ٦ دقائق"
  };

  // Row 2 Column A: Feature Article accompanying the Infographic
  const row2FeatureArticle: Article = {
    id: "me_econ_r2_feat",
    title: "مؤشرات نمو الناتج المحلي غير النفطي بالمنطقة: القطاع المالي واللوجستي والابتكار الرقمي يقودان قاطرة الاستدامة",
    subtitle: "تبيان تفصيلي بالأرقام لركائز تنوع مداخيل الخزينة العامة والابتعاد التدريجي عن الاعتماد على عائدات النفط والغاز.",
    content: `تسجل عواصم المنطقة تحولات هيكلية مذهلة في موازينها السنوية نتيجة الإصلاحات المصرفية والاستثمار الكثيف في المشاريع السياحية والصناعات التحويلية المتقدمة وتقنيات الحوسبة السحابية السيادية. هذا التنوع الائتماني المتين يحمي الخزانات العامة من تقلبات أسواق السلع الأساسية ويمنح البلدان السيادية فرصة التمويل الذاتي لخططها التنموية بعيدة المدى.`,
    category: "اقتصاديات الشرق الأوسط",
    author: "رنا سليم - محررة الشؤون الاستثمارية",
    image: "https://images.unsplash.com/photo-1542744173-8e18308e5cb6?auto=format&fit=crop&q=80&w=800",
    timestamp: "قبل ساعتين",
    views: 3180,
    readTime: "قراءة ٤ دقائق"
  };

  // Row 2 Column B: Newswire Feed data
  const newswireItems = [
    {
      id: 1,
      time: "12:05 GMT",
      badge: "البنوك",
      title: "صعود تدفقات رؤوس الأموال الأجنبية في قطاع المصارف بنسبة ٤.٨٪ في الربع الأخير",
      details: "كشفت بيانات البنك المركزي عن إيداعات جديدة لشركات استثمار دولية تجاوزت ٧.٢ مليار دولار للاكتتاب في السندات الحكومية طويلة المدى والاستثمارات المغلقة."
    },
    {
      id: 2,
      time: "11:42 GMT",
      badge: "عاجل",
      title: "توقيع اتفاق شراكة تجارية حرة لتسهيل مرور الشحنات والصكوك بين ٣ دول",
      details: "تشمل الاتفاقية إعفاء البضائع ذات المنشأ الوطني بالكامل من الرسوم الاستثنائية وتوفير تراخيص موحدة للمستثمرين لتنشيط بيئات الأعمال المشتركة."
    },
    {
      id: 3,
      time: "10:15 GMT",
      badge: "النفط والغاز",
      title: "خام برنت يستقر عند ٨٤.٥ دولاراً مدفوعاً بزيادة أنشطة التصنيع الآسيوي",
      details: "تعززت الأسعار بعد صدور بيانات إيجابية لنمو قطاع المعامل الطاقية واللوجستية في جنوب شرق آسيا بالترافق مع الحفاظ على مستويات الإنتاج المتزنة."
    },
    {
      id: 4,
      time: "09:30 GMT",
      badge: "البورصة",
      title: "تأسيس تحالف لتنشيط أسواق الصكوك والصناديق العقارية المتكاملة بالخليج",
      details: "يستهدف الكيان المالي الموحد إدراج صكوك إسلامية خضراء بتمويل يزيد على ١٠ مليارات دولار لتعزيز كفاءة الإسكان الفاخر واللوجستي."
    },
    {
      id: 5,
      time: "08:10 GMT",
      badge: "التصنيع",
      title: "بدء الإنتاج التجاري لأضخم مصنع رقائق وألواح طاقة شمسية كهرومغناطيسية",
      details: "يمتلك المصنع خطوط إنتاج مؤتمتة بالكامل بالاعتماد على طاقة الرياح والبطاريات الاندماجية لتزويد المجمعات الصناعية بالكهرباء النظيفة المستدامة."
    }
  ];

  // Row 3: 4 Columns of news cards data
  const row3Articles: Article[] = [
    {
      id: "me_econ_r3_1",
      title: "الرقمنة المصرفية المتسارعة بالخليج وبلوغ المدفوعات غير النقدية نسبة ٨٨٪ لسلامة الاستهلاك",
      subtitle: "تحديثات تقنية للبنى المصرفية المركزية تدير سرعة تسوية البنود وتحمي حسابات المودعين ضد خروقات القرصنة عابرة الحدود.",
      content: "سجلت العمليات المصرفية والدفع الرقمي عبر الهاتف والمحافظ الإلكترونية بالخليج زيادة قياسية بلغت ٨٨٪ من إجمالي تعاملات الأفراد، مدعومة بمبادرات البنوك المركزية لتطوير البنى التحتية للمدفوعات وضمان موثوقية عالية للتحويلات الفورية.",
      category: "اقتصاديات الشرق الأوسط",
      author: "سعد الراجحي - الرياض",
      image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=800",
      timestamp: "قبل ٤ ساعات",
      views: 1840,
      readTime: "قراءة ٣ دقائق"
    },
    {
      id: "me_econ_r3_2",
      title: "تخفيضات جمركية موحدة بنسبة ٣٠٪ لرسوم الترانزيت على كافة ممرات الملاحة البرية والبحرية العربية",
      subtitle: "استجابة هائلة من هيئات الموانئ البرية لتوجيه التبادل التجاري وتسهيل انسياب الشحن الثقيل وحفظ استدامة المخزونات.",
      content: "اتفقت سلطات الجمارك والجهات اللوجستية الإقليمية على خفض موحد لرسوم الترانزيت بنسبة ٣٠٪ وتوحيد شهادات الفحص البضاعي بالمنافذ والممرات البرية والبحرية، في سعي لتشجيع التبادل البيني ودفع النشاط المصنعي الكلي بالمنطقة.",
      category: "اقتصاديات الشرق الأوسط",
      author: "طارق مسعود - السويس",
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=800",
      timestamp: "قبل ٦ ساعات",
      views: 1950,
      readTime: "قراءة ٤ دقائق"
    },
    {
      id: "me_econ_r3_3",
      title: "مستقبل السندات والصكوك الخضراء بالمنطقة في استقطاب رؤوس وموازنت المالية المستدامة",
      subtitle: "تحول قياسي للصناديق الائتمانية الغربية نحو تمويل مشاريع تحلية المياه والاستدامة المناخية بالشرق الأوسط بفائدة تفضيلية.",
      content: "كشفت تقارير ائتمانية دولية عن حركة استثمار هائلة تتجاوز ١٨ مليار دولار مخصصة لشراء صكوك وسندات خضراء إسلامية لدعم حقول تنقية المياه والزراعة العضوية النظيفة وصناعة مكونات طاقة الرياح لتخفيف الانبعاثات الكربونية الكلية.",
      category: "اقتصاديات الشرق الأوسط",
      author: "رنا سليم - بيروت",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      timestamp: "قبل ٩ ساعات",
      views: 2010,
      readTime: "قراءة ٣ دقائق"
    },
    {
      id: "me_econ_r3_4",
      title: "توسع أعمال التعدين الكبرى للذهب والسلع الأرضية النادرة بالصحاري الشرقية لتغطية صناعات المستقبل",
      subtitle: "أعمال مسح وحفر فضائي رادارية تكشف تفاصيل ثروات كهرومغناطيسية ضخمة تضمن الريادة التحويلية للتوريد الصناعي الإقليمي.",
      content: "انطلقت مرحلة تنقيب جديدة بالمسح الكوني ثلاثي الأبعاد والتحليل الجيولوجي المتقدم، والتي كشفت النقاب عن خزانات غنية للغاية بعناصر الليثيوم والتيتانيوم والذهب الحراري على امتداد دروع الصحراء الشرقية، كبنية أساسية لصناعات الغد التقاعلية.",
      category: "اقتصاديات الشرق الأوسط",
      author: "فارس الغامدي - جدة",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
      timestamp: "بقلم هيئة التحرير",
      views: 2470,
      readTime: "قراءة ٥ دقائق"
    }
  ];

  // Specific data dictionary for interactive infographic country metrics
  const countryMetrics = {
    KSA: {
      name: "المملكة العربية السعودية",
      metric: "النمو المستهدف الربع الأول: ٦.٤٪",
      desc: "طفرة هائلة في القطاعات السياحية والمجمعات الترفيهية الفخمة وصندوق الاستثمارات يدخل تكتلات حوسبية فائقة الدقة والرقمنة وعقود الموانئ.",
      details: [
        { label: "الأصول غير النفطية", val: "٨٣٪" },
        { label: "كثافة تدفق الاستثمارات الخارجية", val: "١٤.٢ مليار $" },
        { label: "معدل البطالة العام", val: "٥.٩٪" }
      ]
    },
    UAE: {
      name: "الإمارات العربية المتحدة",
      metric: "النمو غير النفطي المسجل: ٥.٨٪",
      desc: "توسع مطرد لخدمات الطيران والتحول الرقمي الكامل للموانئ والخدمات اللوجستية وتزايد نشاط التجارة السلسة متعددة القنوات في دبي وأبوظبي.",
      details: [
        { label: "نسبة الصادرات الخدمية", val: "٧٦٪" },
        { label: "استقطاب الصناديق الغربية", val: "١١.٥ مليار $" },
        { label: "مؤشر الشفافية المالية", val: "٩.٢ / ١٠" }
      ]
    },
    QAT: {
      name: "دولة قطر",
      metric: "التوسع المالي والغاز المكتنز: ٤.٩٪",
      desc: "الاستفادة الكاملة من صكوك توسعة حقل الشمال للغاز وإدراج تداولات جديدة للخدمات وتوسيع الاستثمارات الإستراتيجية بوسط آسيا وأوروبا.",
      details: [
        { label: "تغطية الصكوك السيادية", val: "١٤٠٪" },
        { label: "صادرات الغاز المسال", val: "٨٢ مليون طن" },
        { label: "الناتج الفردي التقديري", val: "الأعلى إقليمياً" }
      ]
    },
    OMN: {
      name: "سلطنة عمان",
      metric: "المشروعات النظيفة والموانئ: ٤.٢٪",
      desc: "بناء أضخم مجمعات إنتاج الهيدروجين الأخضر والأمونيا النظيفة بساحل الدقم اللوجستي وفتح آفاق الاستثمار والاستيراد والتصدير مع دول الجوار والشرق الأوسط.",
      details: [
        { label: "استثمارات الهيدروجين الأخضر", val: "٦.٨ مليار $" },
        { label: "نمو التبادل التجاري عبر الدقم", val: "٢٢٪" },
        { label: "تراجع المديونية العامة", val: "٣٥٪" }
      ]
    }
  };

  return (
    <div className="space-y-12 animate-fade-in border-b border-rose-50/50 pb-16">
      
      {/* SECTION MAIN BRAND TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-r-4 border-brand-primary pr-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
            </span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">لوحة العدد التحليلية</span>
          </div>
          <h3 className="serif-text text-xl md:text-2.5xl font-black text-neutral-900 leading-none">
            اقتصاديات الشرق الأوسط (Middle East Economies)
          </h3>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed font-[320]">
            أكبر رصد متكامل للأسواق والعملات، سلاسل الإمداد اللوحستي، وحراك الاستثمار عابر القارات والفرص الواعدة بالمنطقة عابرة للملابسات برؤية عقلانية متزنة.
          </p>
        </div>
      </div>

      {/* ROW 1: FULL WIDTH FEATURE ARTICLE */}
      <div 
        onClick={() => onArticleClick(row1Article)}
        className="bg-stone-50 border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md cursor-pointer group transition-all duration-300 relative"
      >
        <div className="flex flex-col lg:flex-row min-h-[380px]">
          {/* Cover Image column - takes up larger width in row 1 full feature */}
          <div className="lg:w-[50%] relative h-64 lg:h-auto overflow-hidden bg-neutral-100">
            <img 
              src={row1Article.image} 
              alt={row1Article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-65"></div>
            <span className="absolute bottom-4 right-4 bg-amber-900 border border-amber-700 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-sm select-none shadow-sm font-sans tracking-wide">
              تغطية سيادية هامة
            </span>
          </div>

          {/* Jumbotron description column */}
          <div className="p-6 md:p-10 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <span className="bg-rose-100 text-brand-primary text-[10px] font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wide inline-block">
                {row1Article.category}
              </span>
              
              <h3 className="serif-text text-xl md:text-3xl font-black text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug">
                {row1Article.title}
              </h3>

              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-[320] text-justify">
                {row1Article.subtitle}
              </p>
              
              <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed font-[310] hidden md:block">
                {row1Article.content}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200/60 flex justify-between items-center text-[11px] text-neutral-400 font-medium">
              <span className="text-neutral-700 font-bold flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>بإمضاء: {row1Article.author}</span>
              </span>
              <span className="font-mono">{row1Article.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: TWO COLUMNS (Feature with Infographic & News as Newswires) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Column 1 (Feature with Infographic - occupies 3 columns in desktop grid) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary animate-pulse" />
              <h4 className="serif-text text-lg font-bold text-neutral-900 leading-none">مؤشر رصد النمو غير النفطي وتكامل الصناديق السيادية</h4>
            </div>

            {/* Infographic block - Completely customized, gorgeous in Noto Arabic */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/75 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200/60 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 block mb-0.5">انتقاء الدولة لعرض المؤشرات التفاعلية:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(["KSA", "UAE", "QAT", "OMN"] as const).map((code) => (
                      <button 
                        key={code}
                        onClick={() => setSelectedCountry(code)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer border ${
                          selectedCountry === code
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-3xs"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-stone-100"
                        }`}
                      >
                        {code === "KSA" ? "السعودية" : code === "UAE" ? "الإمارات" : code === "QAT" ? "قطر" : "عُمان"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-brand-primary uppercase block">
                    {countryMetrics[selectedCountry].metric}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-sans">تحديث دوري: مايو ٢٠٢٦</span>
                </div>
              </div>

              {/* Grid with state content and a beautiful interactive vertical bar graph */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                
                {/* Visual Chart Graphic (takes up 5 columns) */}
                <div className="sm:col-span-5 bg-white border border-stone-100 p-4 rounded-lg flex flex-col justify-between aspect-square sm:aspect-auto sm:h-44 text-center">
                  <span className="text-[9px] text-neutral-400 font-bold block mb-1">المكاسب والمستهدف القطاعي</span>
                  
                  {/* Vertical bars */}
                  <div className="flex items-end justify-center gap-5 h-24 pt-2 border-b border-stone-100 pb-1">
                    {[
                      { l: "السعودية", val: 88, c: "bg-brand-primary", code: "KSA" },
                      { l: "الإمارات", val: 80, c: "bg-amber-600", code: "UAE" },
                      { l: "قطر", val: 68, c: "bg-emerald-600", code: "QAT" },
                      { l: "عُمان", val: 56, c: "bg-slate-600", code: "OMN" }
                    ].map((bar) => (
                      <div 
                        key={bar.l} 
                        className="flex flex-col items-center flex-1 cursor-pointer group" 
                        onClick={() => setSelectedCountry(bar.code as any)}
                        title={`${bar.l}: ${bar.val}%`}
                      >
                        <div className="w-full relative bg-neutral-100 rounded-t-xs h-20 flex items-end">
                          <div 
                            style={{ height: `${bar.val}%` }}
                            className={`w-full ${bar.c} rounded-t-xs transition-all duration-500 group-hover:opacity-90 ${selectedCountry === bar.code ? "ring-2 ring-offset-1 ring-neutral-400" : ""}`}
                          ></div>
                        </div>
                        <span className="text-[8px] mt-1 font-bold truncate w-full text-neutral-500 block">{bar.l}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[8px] text-neutral-400 mt-1 block">مؤشر ريع الاستثمار السيادي المستديم لعام ٢٠٢٦</span>
                </div>

                {/* Country details & Text summary description (takes up 7 columns) */}
                <div className="sm:col-span-7 space-y-3">
                  <h5 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-brand-primary rounded-2xs inline-block"></span>
                    <span>{countryMetrics[selectedCountry].name}</span>
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-[320] h-auto min-h-[36px]">
                    {countryMetrics[selectedCountry].desc}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/50">
                    {countryMetrics[selectedCountry].details.map((det, i) => (
                      <div key={i} className="bg-stone-100/60 p-1.5 rounded-md text-center">
                        <span className="text-[8px] text-neutral-400 block truncate font-bold">{det.label}</span>
                        <span className="text-[10px] font-black text-neutral-900 block font-mono mt-0.5">{det.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Context Article accompanying */}
            <div 
              onClick={() => onArticleClick(row2FeatureArticle)}
              className="cursor-pointer group flex flex-col md:flex-row gap-4 pt-4 border-t border-stone-100 items-start md:items-center"
            >
              <div className="w-full md:w-1/3 shrink-0 h-32 md:h-24 rounded-lg overflow-hidden relative">
                <img 
                  src={row2FeatureArticle.image} 
                  alt={row2FeatureArticle.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="serif-text text-sm font-black text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                  {row2FeatureArticle.title}
                </h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed font-[310]">
                  {row2FeatureArticle.subtitle}
                </p>
                <div className="pt-1 flex justify-between items-center text-[9px] text-neutral-400 font-medium">
                  <span>بإمضاء: {row2FeatureArticle.author}</span>
                  <span>{row2FeatureArticle.timestamp}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2 (News as Newswires - occupies 2 columns in desktop grid) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900 text-stone-100 rounded-2xl p-5 shadow-sm space-y-4 min-h-[460px] flex flex-col">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                <h4 className="serif-text text-sm font-black tracking-wider text-amber-500">البرقيات البورصوية الفورية (Newswires)</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-neutral-500">مباشر • LIVE FEED</span>
            </div>

            {/* Interactive Newswire Alert List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] custom-scrollbar">
              {newswireItems.map((item, idx) => {
                const isExpanded = expandedNewswire === idx;
                
                return (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border text-right transition-all cursor-pointer ${
                      isExpanded 
                        ? "bg-neutral-850 border-amber-500/50 shadow-xs" 
                        : "bg-neutral-950 border-neutral-850 hover:bg-neutral-850/40"
                    }`}
                    onClick={() => setExpandedNewswire(isExpanded ? null : idx)}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs select-none ${
                            item.badge === "عاجل" 
                              ? "bg-red-900 border border-red-700 text-white animate-pulse" 
                              : "bg-neutral-800 text-neutral-300"
                          }`}>
                            {item.badge}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-500">{item.time}</span>
                        </div>
                        <h5 className="font-bold text-[11px] text-stone-200 hover:text-amber-500 transition-colors leading-relaxed line-clamp-2">
                          {item.title}
                        </h5>
                      </div>
                      
                      <button className="text-neutral-500 hover:text-amber-500 shrink-0 mt-0.5">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-[320] mt-2 pt-2 border-t border-neutral-800 animate-fade-in text-justify">
                        {item.details}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-850 text-center">
              <p className="text-[9px] text-neutral-500 font-mono tracking-wider">
                آخر تحديث للخادم: {new Date().toLocaleTimeString()} • ALWARRAQ ECONOMY INDEX
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: FOUR COLUMNS OF ECONOMIC NEWS CARDS */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
          دراسات وتقارير تحليلية شاملة:
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {row3Articles.map((article) => (
            <PinterestNewsCard 
              key={article.id} 
              article={article} 
              onClick={onArticleClick}
              showCategoryBadge={false}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
