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
  Award,
  TrendingDown
} from "lucide-react";
import PinterestNewsCard from "./PinterestNewsCard";

interface ArabMarketsSectionProps {
  onArticleClick: (article: Article) => void;
}

export default function ArabMarketsSection({ onArticleClick }: ArabMarketsSectionProps) {
  // Custom interactive state for infographic market index selection
  const [selectedMarket, setSelectedMarket] = useState<"TASI" | "ADX" | "DFM" | "KWSE">("TASI");
  
  // Custom state to expand individually selected newswire item in Arab Markets
  const [expandedNewswire, setExpandedNewswire] = useState<number | null>(null);

  // Row 1: Premier Full Width Feature Article data (Arab Markets)
  const row1Article: Article = {
    id: "arab_mkt_full",
    title: "اندماج تاريخي مرتقب للصناديق الاستثمارية المشتركة: تأسيس أكبر تكتل مالي عربي برأسمال ٤٥ مليار دولار",
    subtitle: "اتفاقات ثنائية بين البورصات الخليجية والمصرية لفتح الحسابات الموحدة وتسوية الأسهم الفورية عبر تقنية القطع الرقمي السريع والآمن.",
    content: "يتوقع الخبراء الماليون أن يؤدي هذا الاندماج الضخم إلى تحرير السيولة الراكدة وزيادة تدفقات المحافظ الاستثمارية الأجنبية بنسبة تتجاوز ٦٠٪ بحلول الربع الثالث من عام ٢٠٢٦. وتوفر المنظومة المشتركة بيئة تداول متكاملة تتيح للمستثمرين الأفراد والشركات شراء وتملك الأوراق المالية والصكوك في أي سوق عربية بشكل فوري وبأقل عمولة تحصيل ممكنة إقليمياً ودولياً.",
    category: "الأسواق العربية",
    author: "أ.د. عادل القحطاني - الخبير الاستراتيجي لأسواق المال",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200",
    timestamp: "قبل ٤٥ دقيقة",
    views: 3820,
    readTime: "قراءة ٥ دقائق"
  };

  // Row 2 Column A: Feature Article accompanying the Infographic
  const row2FeatureArticle: Article = {
    id: "arab_mkt_r2_feat",
    title: "الطروحات الأولية العملاقة في أسواق المال العربية تعيد رسم خرائط التدفق الفضائي للسيولة",
    subtitle: "موجة متواصلة من الاكتتابات لشركات التقنية والطاقة النظيفة والخدمات اللوجستية تسجل نسب تغطية قياسية تجاوزت ٨٠ ضعفاً.",
    content: "تعكس نسب الإقبال الفائقة على الاكتتابات العامة ثقة هائلة من فئات المستثمرين والشركات العائلية الكبرى في حيوية الإدارات ورشاقة القواعد التداولية التي سنتها الهيئات الرقابية لأسواق المال المتكاملة بالمنطقة.",
    category: "الأسواق العربية",
    author: "مي يوسف - مراسلة الشؤون المالية",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    timestamp: "قبل ٣ ساعات",
    views: 2950,
    readTime: "قراءة ٤ دقائق"
  };

  // Row 2 Column B: Market News Feed data (Newswires)
  const newswireItems = [
    {
      id: 1,
      time: "11:50 GMT",
      badge: "تداول",
      title: "صعود تاريخي لسهم سلوف المالي بأكثر من ٧.٥٪ بدعم من نتائج الربع الثاني الاستثنائية",
      details: "سجل البنك الموحد أرباحاً تشغيلية صافية بلغت ٢.٣ مليار دولار، مدفوعاً بنمو هائل في إدارة الثروات وإصدار التمويلات والودائع السيادية الذكية."
    },
    {
      id: 2,
      time: "10:30 GMT",
      badge: "إدراج",
      title: "بورصة دبي تستوفي طلبات ثلاثة صناديق استثمار عقاري متداولة للبدء بالإدراج الفوري",
      details: "تستهدف الصناديق الجديدة أصولاً فندقية ومستودعات تخزين مبردة ذات عوائد تأجيرية مضمونة تتراوح عوائدها السنوية بين ٧.٢٪ و ٨.٤٪ للمكتتبين."
    },
    {
      id: 3,
      time: "09:45 GMT",
      badge: "سندات",
      title: "الحكومة الأردنية تصدر سندات تنموية بقيمة ٧٥٠ مليون دينار بفائدة ثابتة وتغطية متوقعة",
      details: "يهدف الطرح العام إلى استكمال مشاريع شبكات المياه وصيانة الطاقة التدويرية وبناء المجمعات الأكاديمية والمنافذ التجارية الحرة المفتوحة."
    },
    {
      id: 4,
      time: "08:15 GMT",
      badge: "الذهب والشركات",
      title: "تأسيس شركة قابضة للتعدين والصناعات البلاستيكية باستثمار مصري إماراتي مشترك",
      details: "تعتمد المبادرة خطوط إنتاج وتعبئة حديثة وتكامل كامل للمشتقات وتوفير ممرات تصدير سريعة لدول البحر الأبيض المتوسط والاتحاد الأوروبي."
    }
  ];

  // Row 3: 4 Columns of news cards data for Arab Markets
  const row3Articles: Article[] = [
    {
      id: "arab_mkt_r3_1",
      title: "بورصات شمال أفريقيا تسجل قفزة وتكثف التنسيق المشترك مع أسواق الخليج لجذب رؤوس الأموال الذكية",
      subtitle: "حزمة تسهيلات إجرائية تتضمن تبسيط لوائح المقاصة والضرائب وتسجيل المستثمرين غير المقيمين لتشجيع الاستثمار المباشر.",
      content: "أظهرت تقارير الرصد المالي لأسواق القاهرة والدار البيضاء وتونس تحسناً ملحوظاً في أحجام التداول اليومية بعد إدخال تطبيقات الشراء بالهامش وتقليص العملات الإشرافية بالتوازي مع التحديثات التقنية الواسعة للبنى التنظيمية.",
      category: "الأسواق العربية",
      author: "أحمد كمال - الإسكندرية",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800",
      timestamp: "قبل ٥ ساعات",
      views: 1980,
      readTime: "قراءة ٣ دقائق"
    },
    {
      id: "arab_mkt_r3_2",
      title: "مؤشر البناء والتشييد العقاري بالخليج يرتفع للقمة ويسجل عقوداً تاريخية تفوق ١٥ مليار دولار في ربع واحد",
      subtitle: "مشاريع المدن المستدامة وتراخيص البنى التحتية الكهرومائية والمجمعات السكنية تقود طفرة الإنشاء الضخمة.",
      content: "تترافق هذه الأرقام الاستثنائية مع صدور قوانين شراكة مبتكرة بين القطاعين العام والخاص توفر للمطورين فرصة الاستفادة من التسهيلات الائتمانية والصكوك المتوسطة الأجل لتمويل حواضر المستقبل الاقتصادية.",
      category: "الأسواق العربية",
      author: "فهد العتيبي - دبي",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
      timestamp: "قبل ٧ ساعات",
      views: 2210,
      readTime: "قراءة ٤ دقائق"
    },
    {
      id: "arab_mkt_r3_3",
      title: "عوائد قياسية لأسهم الاتصالات والخدمات الرقمية بالشرق الأوسط بفعل نمو مبيعات الحوسبة وأمن الخلايا",
      subtitle: "تسارع تحول الشركات والقطاعات والوزارات الحكومية نحو الهياكل الهجينة والسحابية يرفد عوائد المشغلين الإقليميين بفوائض ممتازة.",
      content: "ساهمت زيادة مبيعات تكنولوجيا الجيل الخامس وتكامل شبكات الفايبر للألياف البصرية في نمو الإيرادات قبل احتساب الفوائد والضرائب لقطاع الاتصالات بنسبة متوسطة بلغت ١٤.٢٪ مما يؤهلها لتوزيعات أرباح نقدية سنوية فائقة السخاء.",
      category: "الأسواق العربية",
      author: "خالد منصور - الكويت",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      timestamp: "قبل ١١ ساعة",
      views: 1670,
      readTime: "قراءة ٣ دقائق"
    },
    {
      id: "arab_mkt_r3_4",
      title: "صناع السوق في البورصات العربية: كيف تعزز شركات صانع السوق من حيوية وتوازن أحجام السيولة اليومية؟",
      subtitle: "تحليل استقصائي لواجبات الكيانات الاستثمارية المعتمدة لتدوير عروض البيع والطلب والتقاط الصدمات الفجائية والمؤشرات السعرية.",
      content: "يؤكد المحللون أن توافر صانعي سوق فاعلين يقلص المخاطر أمام الصناديق الدولية ويضمن عدم تعرض قيم الشركات لانخفاضات غير مسوغة في مواسم تذبذب شهية المخاطرة العالمية، فضلاً عن رفع كفاءة التسعير العادل للأسهم الكبرى.",
      category: "الأسواق العربية",
      author: "جمال الدين - المنامة",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
      timestamp: "بقلم هيئة التحرير",
      views: 2590,
      readTime: "قراءة ٥ دقائق"
    }
  ];

  // Specific data dictionary for interactive infographic market indices
  const marketMetrics = {
    TASI: {
      name: "مؤشر تداول الأسهم السعودية (تاسي)",
      metric: "المؤشر: ١٢,٤٥٠ نقطة (+١.٢٪)",
      desc: "طفرة مستمرة لأسهم البتروكيماويات والشركات المالية والتصدير بالترافق مع إعلانات تنويع الاستثمارات وضخ السيولة السيادية بالمحفظات الكبرى.",
      details: [
        { label: "حجم التداول اليومي", val: "٨.٦ مليار ريال" },
        { label: "الأكثر صعوداً", val: "أرامكو، الراجحي" },
        { label: "القيمة الإجمالية", val: "٢.٨ تريليون $" }
      ]
    },
    ADX: {
      name: "سوق أبوظبي للأوراق المالية (ADX)",
      metric: "المؤشر: ٩,٣٤٠ نقطة (+٠.٩٪)",
      desc: "أداء متميز لأسهم العالمية القابضة والبنوك ومجموعات التطوير العقاري مدعوماً برفع المستويات الانتاجية والصادرات والطلب الأجنبي القوي المتكامل.",
      details: [
        { label: "حجم التداول اليومي", val: "١.٤ مليار درهم" },
        { label: "الأكثر صعوداً", val: "ملتيبلاي، ألفا ظبي" },
        { label: "مستثمرون أجانب", val: "+٣٢٪ نمو سنوي" }
      ]
    },
    DFM: {
      name: "سوق دبي المالي (DFM)",
      metric: "المؤشر: ٤,٢١٠ نقطة (+١.٥٪)",
      desc: "قيادة قوية لقطاعات النقل الجوي واللوجستي والضيافة، وعمليات إعادة الهيكلة والإدراجات المبتكرة للشركات البلدية والخاصة بالتداولات الإقليمية الكبرى.",
      details: [
        { label: "حجم التداول اليومي", val: "٦٨٠ مليون درهم" },
        { label: "الأكثر صعوداً", val: "إعمار، ديوا" },
        { label: "مكرر الأرباح الكلي", val: "١١.٤ ضعف" }
      ]
    },
    KWSE: {
      name: "بورصة الكويت (الشرق الأول)",
      metric: "المؤشر: ٧,٩٩٠ نقطة (-٠.٢٪)",
      desc: "حالة ترقب مائل للاستقرار لقطاعات الاستهلاك والتموين والمصارف الكبرى لترتيب أوراق الربع الثاني وتحوطات الفائدة الدولية.",
      details: [
        { label: "حجم التداول اليومي", val: "٤٥ مليون دينار" },
        { label: "الأكثر صعوداً", val: "بيتك، زين" },
        { label: "القيمة السوقية للبورصة", val: "٤٢ مليار دينار" }
      ]
    }
  };

  return (
    <div className="space-y-12 animate-fade-in border-b border-rose-50/50 pb-16">
      
      {/* SECTION MAIN BRAND TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-r-4 border-amber-600 pr-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
            </span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">شاشات المال والأعمال العربية</span>
          </div>
          <h3 className="serif-text text-xl md:text-2.5xl font-black text-neutral-900 leading-none">
            الأسواق العربية (Arab Markets)
          </h3>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed font-[320]">
            تحديثات فورية من صالات التداول وإدارات الإفصاح، رصد الاكتتابات وتصعيد الصكوك والصناديق وعمليات صيد الفرص الائتمانية الواعدة.
          </p>
        </div>
      </div>

      {/* ROW 1: FULL WIDTH FEATURE ARTICLE */}
      <div 
        onClick={() => onArticleClick(row1Article)}
        className="bg-stone-50 border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md cursor-pointer group transition-all duration-300 relative"
      >
        <div className="flex flex-col lg:flex-row min-h-[380px]">
          {/* Cover Image column */}
          <div className="lg:w-[50%] relative h-64 lg:h-auto overflow-hidden bg-neutral-100">
            <img 
              src={row1Article.image} 
              alt={row1Article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/40 to-transparent h-1/3"></div>
            <span className="absolute bottom-4 right-4 bg-amber-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-sm select-none shadow-sm font-sans tracking-wide">
              اتفاقية تكتل مالي فوري
            </span>
          </div>

          {/* Jumbotron description column */}
          <div className="p-6 md:p-10 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wide inline-block">
                {row1Article.category}
              </span>
              
              <h3 className="serif-text text-xl md:text-3xl font-black text-neutral-900 group-hover:text-amber-600 transition-colors leading-snug">
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
                <span>تحليل: {row1Article.author}</span>
              </span>
              <span className="font-mono">{row1Article.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: TWO COLUMNS (Feature with Infographic & News as Newswires) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Column 1 (Feature with Infographic - occupies 3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600 animate-pulse" />
              <h4 className="serif-text text-lg font-bold text-neutral-900 leading-none">شاشات قياس عوائد البورصات وخلاصة السيولة</h4>
            </div>

            {/* Infographic block - Customized for Arab Stock Exchanges */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/75 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200/60 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 block mb-0.5">انتقاء السوق للمؤشرات:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(["TASI", "ADX", "DFM", "KWSE"] as const).map((code) => (
                      <button 
                        key={code}
                        onClick={() => setSelectedMarket(code)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer border ${
                          selectedMarket === code
                            ? "bg-amber-600 border-amber-600 text-white shadow-3xs"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-stone-100"
                        }`}
                      >
                        {code === "TASI" ? "تاسي السعودي" : code === "ADX" ? "أبوظبي" : code === "DFM" ? "دبي" : "الكويت"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-emerald-600 block">
                    {marketMetrics[selectedMarket].metric}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-sans">تحديث بث حي: مايو ٢٠٢٦</span>
                </div>
              </div>

              {/* Grid with state content and interactive horizontal or vertical bar graph */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                
                {/* Visual Chart Graphic (takes up 5 columns) */}
                <div className="sm:col-span-5 bg-white border border-stone-100 p-4 rounded-lg flex flex-col justify-between aspect-square sm:aspect-auto sm:h-44 text-center">
                  <span className="text-[9px] text-neutral-400 font-bold block mb-1">نسبة التغير السنوي بالسيولة</span>
                  
                  {/* Vertical bars */}
                  <div className="flex items-end justify-center gap-5 h-24 pt-2 border-b border-stone-100 pb-1">
                    {[
                      { l: "تاسي", val: 84, c: "bg-amber-600", code: "TASI" },
                      { l: "أبوظبي", val: 72, c: "bg-emerald-600", code: "ADX" },
                      { l: "دبي", val: 78, c: "bg-blue-600", code: "DFM" },
                      { l: "الكويت", val: 40, c: "bg-slate-500", code: "KWSE" }
                    ].map((bar) => (
                      <div 
                        key={bar.l} 
                        className="flex flex-col items-center flex-1 cursor-pointer group" 
                        onClick={() => setSelectedMarket(bar.code as any)}
                        title={`${bar.l}: ${bar.val}%`}
                      >
                        <div className="w-full relative bg-neutral-100 rounded-t-xs h-20 flex items-end">
                          <div 
                            style={{ height: `${bar.val}%` }}
                            className={`w-full ${bar.c} rounded-t-xs transition-all duration-500 group-hover:opacity-90 ${selectedMarket === bar.code ? "ring-2 ring-offset-1 ring-amber-400" : ""}`}
                          ></div>
                        </div>
                        <span className="text-[8px] mt-1 font-bold truncate w-full text-neutral-500 block">{bar.l}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[8px] text-neutral-400 mt-1 block">رسم بياني تناسبي لحزم المداولات اليومية</span>
                </div>

                {/* Market details & description */}
                <div className="sm:col-span-7 space-y-3">
                  <h5 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-amber-600 rounded-2xs inline-block"></span>
                    <span>{marketMetrics[selectedMarket].name}</span>
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-[320] h-auto min-h-[36px]">
                    {marketMetrics[selectedMarket].desc}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/50">
                    {marketMetrics[selectedMarket].details.map((det, i) => (
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
                <h4 className="serif-text text-sm font-black text-neutral-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
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

        {/* Column 2 (Market Newswires Feed) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900 text-stone-100 rounded-2xl p-5 shadow-sm space-y-4 min-h-[460px] flex flex-col">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div>
                <h4 className="serif-text text-sm font-black tracking-wider text-amber-500">نشرة صالات التداولات العربية</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-neutral-500">مباشر • TAPE VIEW</span>
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
                          <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs select-none bg-neutral-800 text-amber-500">
                            {item.badge}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-500">{item.time}</span>
                        </div>
                        <h5 className="font-bold text-[11px] text-stone-200 hover:text-amber-500 transition-colors leading-relaxed line-clamp-2">
                          {item.title}
                        </h5>
                      </div>
                      
                      <button className="text-neutral-500 hover:text-amber-500 shrink-0 mt-0.5 font-bold">
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
                آخر تحديث للشبكة: {new Date().toLocaleTimeString()} • ALWARRAQ BOURSA REPORT
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: FOUR COLUMNS OF ECONOMIC NEWS CARDS */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
          أهم تقارير وحركات الاستثمار العربي المباشر:
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
