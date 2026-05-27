import React, { useState, useMemo } from "react";
import * as d3 from "d3";
import { 
  TrendingUp, 
  LineChart, 
  Cpu, 
  Sparkles, 
  Coins, 
  Layers, 
  ArrowUpRight, 
  Award, 
  HelpCircle, 
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Article } from "../data/mockArticles";

interface InteractiveAnalysisProps {
  onArticleClick: (article: Article) => void;
  allArticles: Article[];
}

interface DataPoint {
  year: string;
  value: number;
}

interface RegionData {
  region: string;
  color: string;
  points: DataPoint[];
  details: string;
}

const INDICATORS = [
  {
    id: "gdp",
    label: "معدل نمو الناتج المحلي الإجمالي",
    unit: "٪",
    icon: TrendingUp,
    description: "توقعات نمو الناتج المحلي غير النفطي والأنشطة اللوجستية والمالية حتى نهاية ٢٠٢٦.",
    data: [
      {
        region: "المملكة العربية السعودية",
        color: "#b91c1c", // Brand crimson
        points: [
          { year: "٢٠٢٤", value: 4.1 },
          { year: "٢٠٢٥", value: 5.2 },
          { year: "٢٠٢٦", value: 6.4 }
        ],
        details: "طفرة قوية يقودها الاستثمار الكثيف في المشاريع والسياحة المدمجة والخدمات الرقمية السيادية."
      },
      {
        region: "دولة الإمارات",
        color: "#d97706", // Amber
        points: [
          { year: "٢٠٢٤", value: 3.9 },
          { year: "٢٠٢٥", value: 4.8 },
          { year: "٢٠٢٦", value: 5.8 }
        ],
        details: "توسع متسارع للصادرات الخدمية والتحول الكامل للموانئ الذكية المعززة بقدرات الشحن الفوري."
      },
      {
        region: "جمهورية مصر العربية",
        color: "#059669", // Emerald
        points: [
          { year: "٢٠٢٤", value: 3.2 },
          { year: "٢٠٢٥", value: 4.0 },
          { year: "٢٠٢٦", value: 4.8 }
        ],
        details: "نمو مدفوع بمشاريع الربط اللوجستي والمجمعات الذكية في البحر الأحمر وقناة السويس."
      },
      {
        region: "دولة قطر",
        color: "#7c3aed", // Violet
        points: [
          { year: "٢٠٢٤", value: 2.9 },
          { year: "٢٠٢٥", value: 3.8 },
          { year: "٢٠٢٦", value: 4.9 }
        ],
        details: "نمو ائتماني متين يغذيه الاكتتاب في صكوك حقل الشمال ونقل الطاقة النظيفة عابرة القارات."
      },
      {
        region: "متوسط مجلس التعاون",
        color: "#475569", // Slate
        points: [
          { year: "٢٠٢٤", value: 3.5 },
          { year: "٢٠٢٥", value: 4.5 },
          { year: "٢٠٢٦", value: 5.5 }
        ],
        details: "اندماج مالي وإعفاءات جمركية وتجارة سلسة تعزز مستويات الإنتاج الإقليمي المشترك."
      }
    ]
  },
  {
    id: "clean_energy",
    label: "استثمارات الطاقة النظيفة والهيدروجين",
    unit: "مليار $",
    icon: Sparkles,
    description: "حجم التدفقات الاستثمارية الموجهة لمشروعات الهيدروجين الأخضر والأمونيا والطاقة المتجددة.",
    data: [
      {
        region: "المملكة العربية السعودية",
        color: "#b91c1c",
        points: [
          { year: "٢٠٢٤", value: 12.0 },
          { year: "٢٠٢٥", value: 24.5 },
          { year: "٢٠٢٦", value: 40.0 }
        ],
        details: "ريادة عالمية بمشروع الهيدروجين كهرومغناطيسية وبنية طاقة نظيفة عابرة للقارات والحدود."
      },
      {
        region: "دولة الإمارات",
        color: "#d97706",
        points: [
          { year: "٢٠٢٤", value: 10.2 },
          { year: "٢٠٢٥", value: 18.0 },
          { year: "٢٠٢٦", value: 30.5 }
        ],
        details: "مجمعات شمسية مستديمة وصكوك عقارية خضراء لتمويل الموانئ الذكية والمجمعات الصناعية."
      },
      {
        region: "جمهورية مصر العربية",
        color: "#059669",
        points: [
          { year: "٢٠٢٤", value: 5.5 },
          { year: "٢٠٢٥", value: 11.2 },
          { year: "٢٠٢٦", value: 20.0 }
        ],
        details: "تحالفات دولية لتشييد مجمعات الهيدر�      {
        region: "دولة الإمارات",
        color: "#d97706",
        points: [
          { year: "٢٠٢٤", value: 55.0 },
          { year: "٢٠٢٥", value: 88.0 },
          { year: "٢٠٢٦", value: 132.0 }
        ],
        details: "ممرات التجارة السلسة ومنصات الفرز والمسح الجمركي الفوري بدبي بمشاركة خوارزميات مدمجة."
      },
      {
        region: "متوسط مجلس التعاون",
        color: "#475569",
        points: [
          { year: "٢٠٢٤", value: 120.0 },
          { year: "٢٠٢٥", value: 210.0 },
          { year: "٢٠٢٦", value: 340.0 }
        ],
        details: "تأثير تكتل دمج المعاملات الجمركية الرقمية لتقليص كلف الترانزيت بنسبة ٦٠٪ بحلول نهاية العام."
      }
    ]
  }
];

export default function InteractiveAnalysis({ onArticleClick, allArticles }: InteractiveAnalysisProps) {
  const [activeIndicatorId, setActiveIndicatorId] = useState("gdp");
  const [hoveredPoint, setHoveredPoint] = useState<{
    region: string;
    year: string;
    value: number;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const activeIndicator = useMemo(() => {
    return INDICATORS.find(ind => ind.id === activeIndicatorId) || INDICATORS[0];
  }, [activeIndicatorId]);

  // Set default selected region when indicator switches
  React.useEffect(() => {
    if (activeIndicator.data.length > 0) {
      setSelectedRegion(activeIndicator.data[0].region);
    }
  }, [activeIndicator]);

  // Dimensions of SVG
  const width = 600;
  const height = 300;
  const padding = { top: 30, right: 120, bottom: 40, left: 50 };

  // D3 Scales Calculations
  const { paths, gridLines, axisX, axisY, points } = useMemo(() => {
    // Collect all unique years in order
    const years = ["٢٠٢٤", "٢٠٢٥", "٢٠٢٦"];

    // Find min and max values to dynamically scale Y Axis (using headroom for confidence limits)
    const allValues = activeIndicator.data.flatMap(d => d.points.map(p => p.value));
    const maxValue = Math.max(...allValues, 10);
    const yMax = Math.ceil(maxValue * 1.28); // Add ample headroom to prevent confidence overflow

    // X Scale: Point scale mapping years to locations on width
    const xScale = d3.scalePoint()
      .domain(years)
      .range([width - padding.right, padding.left]); // RTL reading orientation: 2024 is right, 2026 is left

    // Y Scale: Linear scale mapping values to height
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([height - padding.bottom, padding.top]);

    // D3 Line Generator with smooth curves
    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.year) || 0)
      .y(d => yScale(d.value) || 0)
      .curve(d3.curveMonotoneX);

    // D3 Area Generator for filled gradients
    const areaGenerator = d3.area<DataPoint>()
      .x(d => xScale(d.year) || 0)
      .y0(height - padding.bottom)
      .y1(d => yScale(d.value) || 0)
      .curve(d3.curveMonotoneX);

    // D3 Area Generator for Confidence Interval Range (+/- 12% margin of error)
    const confidenceAreaGenerator = d3.area<DataPoint>()
      .x(d => xScale(d.year) || 0)
      .y0(d => yScale(d.value * 0.88) || 0) // Lower bound
      .y1(d => yScale(d.value * 1.12) || 0) // Upper bound
      .curve(d3.curveMonotoneX);

    // D3 Line Generator for individual error margins boundaries
    const boundUpperLine = d3.line<DataPoint>()
      .x(d => xScale(d.year) || 0)
      .y(d => yScale(d.value * 1.12) || 0)
      .curve(d3.curveMonotoneX);

    const boundLowerLine = d3.line<DataPoint>()
      .x(d => xScale(d.year) || 0)
      .y(d => yScale(d.value * 0.88) || 0)
      .curve(d3.curveMonotoneX);

    // Plot components
    const pathsList = activeIndicator.data.map(region => {
      return {
        regionName: region.region,
        color: region.color,
        linePath: lineGenerator(region.points) || "",
        areaPath: areaGenerator(region.points) || "",
        confidenceAreaPath: confidenceAreaGenerator(region.points) || "",
        confidenceUpperPath: boundUpperLine(region.points) || "",
        confidenceLowerPath: boundLowerLine(region.points) || "",
        isHighlighted: selectedRegion === null || selectedRegion === region.region
      };
    });

    // Gridlines positions (Y values spaced)
    const yTicks = yScale.ticks(5);
    const gridLinesList = yTicks.map(val => ({
      y: yScale(val),
      value: val
    }));

    // Point Coordinates for hover markers
    const allPointsList = activeIndicator.data.flatMap(region => 
      region.points.map(pt => ({
        region: region.region,
        year: pt.year,
        value: pt.value,
        color: region.color,
        cx: xScale(pt.year) || 0,
        cy: yScale(pt.value) || 0
      }))
    );

    return {
      paths: pathsList,
      gridLines: gridLinesList,
      axisX: years.map(yr => ({ year: yr, x: xScale(yr) || 0 })),
      axisY: yTicks.map(tick => ({ value: tick, y: yScale(tick) })),
      points: allPointsList
    };
  }, [activeIndicator, selectedRegion]);

  // Calculate percentage growth for regional comparative bar chart
  const regionalGrowthData = useMemo(() => {
    return activeIndicator.data.map(region => {
      const p2024Point = region.points.find(p => p.year === "٢٠٢٤") || region.points[0];
      const p2026Point = region.points.find(p => p.year === "٢٠٢٦") || region.points[region.points.length - 1];
      const p2024 = p2024Point.value;
      const p2026 = p2026Point.value;
      const percentGrowth = p2024 > 0 ? ((p2026 - p2024) / p2024) * 100 : 0;
      return {
        region: region.region,
        color: region.color,
        p2024,
        p2026,
        percentGrowth: Number(percentGrowth.toFixed(1))
      };
    }).sort((a, b) => b.percentGrowth - a.percentGrowth); // Sort in descending order
  }, [activeIndicator]);

  // Filter articles associated with dynamic economy topics
  const contextArticles = useMemo(() => {
    // Get general economy keywords
    const keywords = ["نمو", "بلدان الخليج", "الاقتصاد", "استثمار", "المصارف", "اللوجستية", "سلاسل", "الهيدروجين", "جمركية", "السيادية", "صكوك"];
    return allArticles.filter(art => {
      const isInEcon = art.category === "اقتصاديات الشرق الأوسط" || art.category === "الاقتصاد" || art.category === "الحصريات";
      const matchesKeyword = keywords.some(k => art.title.includes(k) || art.subtitle.includes(k) || art.content.includes(k));
      return isInEcon && matchesKeyword;
    }).slice(0, 3);
  }, [allArticles]);

  const activeRegionDetails = useMemo(() => {
    return activeIndicator.data.find(r => r.region === selectedRegion) || activeIndicator.data[0];
  }, [activeIndicator, selectedRegion]);data.flatMap(region => 
      region.points.map(pt => ({
        region: region.region,
        year: pt.year,
        value: pt.value,
        color: region.color,
        cx: xScale(pt.year) || 0,
        cy: yScale(pt.value) || 0
      }))
    );

    return {
      paths: pathsList,
      gridLines: gridLinesList,
      axisX: years.map(yr => ({ year: yr, x: xScale(yr) || 0 })),
      axisY: yTicks.map(tick => ({ value: tick, y: yScale(tick) })),
      points: allPointsList
    };
  }, [activeIndicator, selectedRegion]);

  // Filter articles associated with dynamic economy topics
  const contextArticles = useMemo(() => {
    // Get general economy keywords
    const keywords = ["نمو", "بلدان الخليج", "الاقتصاد", "استثمار", "المصارف", "اللوجستية", "سلاسل", "الهيدروجين", "جمركية", "السيادية", "صكوك"];
    return allArticles.filter(art => {
      const isInEcon = art.category === "اقتصاديات الشرق الأوسط" || art.category === "الاقتصاد" || art.category === "الحصريات";
      const matchesKeyword = keywords.some(k => art.title.includes(k) || art.subtitle.includes(k) || art.content.includes(k));
      return isInEcon && matchesKeyword;
    }).slice(0, 3);
  }, [allArticles]);

  const activeRegionDetails = useMemo(() => {
    return activeIndicator.data.find(r => r.region === selectedRegion) || activeIndicator.data[0];
  }, [activeIndicator, selectedRegion]);

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-2xs overflow-hidden text-right dir-rtl animate-fade-in" id="interactive-analysis-section">
      
      {/* HEADER BAR */}
      <div className="bg-neutral-900 text-stone-100 p-5 md:p-6 border-b border-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="bg-amber-800/80 border border-amber-800 text-amber-200 text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm uppercase font-black">
                D3.JS GRAPH ENGINE
              </span>
            </div>
            <h3 className="serif-text text-xl md:text-2xl font-black text-amber-500">
              المرصد التفاعلي للنمو الاقتصادي الإقليمي
            </h3>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed font-[320]">
              رسوم بيانية تفاعلية دقيقة ترسم مسار البنيات والصناعات الواعدة بالشرق الأوسط، مستخلصة من عمق تقاريرنا.
            </p>
          </div>

          {/* Indicator selector buttons */}
          <div className="flex flex-wrap gap-1.5 self-stretch md:self-auto bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            {INDICATORS.map(ind => {
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndicatorId(ind.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    activeIndicatorId === ind.id
                      ? "bg-brand-primary text-white shadow-2xs"
                      : "text-neutral-400 hover:text-stone-200 hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{ind.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* INDICATOR DECOUPLING OVERVIEW */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold block">المؤشر النشط حالياً:</span>
            <span className="serif-text font-extrabold text-sm text-neutral-800 block">
              {activeIndicator.label}
            </span>
            <p className="text-xs text-neutral-500 font-[320]">
              {activeIndicator.description}
            </p>
          </div>
          <div className="bg-white border border-stone-200/80 p-3 rounded-lg text-center min-w-[120px] self-end md:self-auto">
            <span className="text-[9px] text-neutral-400 font-bold block">وحدة القياس</span>
            <span className="serif-text text-base font-black text-brand-primary block mt-0.5">{activeIndicator.unit}</span>
          </div>
        </div>

        {/* MAIN ANALYSIS BLOCK: GRAPH + INFO PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* THE SVG / D3 GRAPH PANEL (occupies 7 cols on desktop) */}
          <div className="lg:col-span-7 bg-stone-50 border border-stone-200/70 p-4 md:p-6 rounded-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-stone-200/60 pb-3">
              <span className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-brand-primary" />
                <span>منحنى الأداء الزمني (٢٠٢٤ - ٢٠٢٦)</span>
              </span>
              
              {/* Highlight selector / legend */}
              <div className="flex flex-wrap gap-1.5 justify-end max-w-xs md:max-w-md">
                {activeIndicator.data.map(r => (
                  <button
                    key={r.region}
                    onClick={() => setSelectedRegion(selectedRegion === r.region ? null : r.region)}
                    className={`text-[9px] font-bold px-2 py-1 rounded-sm border transition-all truncate max-w-[110px] cursor-pointer ${
                      selectedRegion === r.region
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-white border-stone-200 text-neutral-600 hover:bg-stone-100"
                    }`}
                  >
                    <span 
                      className="inline-block w-1.5 h-1.5 rounded-full ml-1" 
                      style={{ backgroundColor: r.color }}
                    ></span>
                    {r.region.replace("جمهورية ", "").replace("المنطقة الاقتصادية لـ ", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive SVG container using responsive viewBox */}
            <div className="relative w-full overflow-x-auto scrollbar-none">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto select-none overflow-visible min-w-[500px]"
                id="d3-gdp-trends-svg"
              >
                {/* Horizontal Gridlines & Y-Axis labels */}
                {gridLines.map((line, idx) => (
                  <g key={idx}>
                    <line 
                      x1={padding.left} 
                      y1={line.y} 
                      x2={width - padding.right} 
                      y2={line.y} 
                      stroke="#e5e7eb" 
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <text 
                      x={padding.left - 10} 
                      y={line.y + 4} 
                      textAnchor="end" 
                      className="text-[10px] font-mono font-medium fill-neutral-400"
                    >
                      {line.value}{activeIndicator.unit}
                    </text>
                  </g>
                ))}

                {/* X-Axis Horizontal Base Line */}
                <line 
                  x1={padding.left} 
                  y1={height - padding.bottom} 
                  x2={width - padding.right} 
                  y2={height - padding.bottom} 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5"
                />

                {/* X-Axis labels (Years) */}
                {axisX.map((axis, idx) => (
                  <g key={idx}>
                    <text 
                      x={axis.x} 
                      y={height - padding.bottom + 20} 
                      textAnchor="middle" 
                      className="text-xs font-bold fill-neutral-600 font-sans"
                    >
                      {axis.year}
                    </text>
                    <line 
                      x1={axis.x} 
                      y1={height - padding.bottom} 
                      x2={axis.x} 
                      y2={height - padding.bottom + 5} 
                      stroke="#cbd5e1" 
                      strokeWidth="1.5"
                    />
                  </g>
                ))}

                {/* Draw Filled Gradients for Lines below paths */}
                {paths.map(path => {
                  if (!path.linePath) return null;
                  return (
                    <path 
                      key={`area-${path.regionName}`}
                      d={path.areaPath}
                      fill={`url(#grad-${path.regionName.replace(/\s+/g, '-')})`}
                      opacity={path.isHighlighted ? 0.08 : 0.01}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* SVG Definitions for Gradients */}
                <defs>
                  {activeIndicator.data.map(region => (
                    <linearGradient 
                      key={`grad-def-${region.region}`}
                      id={`grad-${region.region.replace(/\s+/g, '-')}`} 
                      x1="0" y1="0" x2="0" y2="1"
                    >
                      <stop offset="0%" stopColor={region.color} />
                      <stop offset="100%" stopColor={region.color} stopOpacity="0" />
                    </linearGradient>
                  ))}
                </defs>

                {/* Draw the D3 Line Paths */}
                {paths.map(path => {
                  if (!path.linePath) return null;
                  return (
                    <path 
                      key={`line-${path.regionName}`}
                      d={path.linePath}
                      fill="none"
                      stroke={path.color}
                      strokeWidth={path.isHighlighted ? 3.5 : 1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={path.isHighlighted ? 1 : 0.2}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Interactive circles indicating points */}
                {points.map((pt, idx) => {
                  const isRegionSelected = selectedRegion === null || selectedRegion === pt.region;
                  const isHovered = hoveredPoint && hoveredPoint.region === pt.region && hoveredPoint.year === pt.year;
                  
                  return (
                    <g key={idx}>
                      {/* Outer pulse for hovered element */}
                      {isHovered && (
                        <circle 
                          cx={pt.cx} 
                          cy={pt.cy} 
                          r={10} 
                          fill={pt.color} 
                          opacity={0.3} 
                          className="animate-ping"
                        />
                      )}
                      
                      <circle 
                        cx={pt.cx} 
                        cy={pt.cy} 
                        r={isHovered ? 6 : 4} 
                        fill={isHovered ? "#fff" : pt.color} 
                        stroke={pt.color}
                        strokeWidth={isHovered ? 3.5 : 1.5}
                        opacity={isRegionSelected ? 1 : 0.15}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={(e) => {
                          setHoveredPoint({
                            region: pt.region,
                            year: pt.year,
                            value: pt.value,
                            color: pt.color,
                            x: pt.cx,
                            y: pt.cy
                          });
                          setSelectedRegion(pt.region);
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onClick={() => setSelectedRegion(pt.region)}
                      />
                    </g>
                  );
                })}

                {/* SVG Legends in empty right section */}
                {activeIndicator.data.map((region, idx) => {
                  const xCoord = width - padding.right + 20;
                  const yCoord = padding.top + idx * 22;
                  const isHighlighted = selectedRegion === null || selectedRegion === region.region;

                  return (
                    <g 
                      key={`legend-${region.region}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
                      opacity={isHighlighted ? 1 : 0.35}
                    >
                      <circle 
                        cx={xCoord} 
                        cy={yCoord} 
                        r={5} 
                        fill={region.color} 
                      />
                      <text 
                        x={xCoord + 10} 
                        y={yCoord + 3} 
                        className="text-[9.5px] font-bold fill-neutral-700 font-sans"
                        textAnchor="start"
                      >
                        {region.region.replace("جمهورية ", "").replace("المنطقة الاقتصادية لـ ", "").split(" (")[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* FLOATING HOVER TOOLTIP */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-neutral-900 border border-neutral-700/80 text-white p-3 rounded-lg shadow-md pointer-events-none text-right z-30 animate-fade-in text-xs max-w-[180px] font-sans"
                  style={{
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: `${(hoveredPoint.y / height) * 100 - 15}%`,
                    transform: "translate(-50%, -100%)"
                  }}
                >
                  <p className="font-bold text-amber-400 mb-0.5" style={{ color: hoveredPoint.color }}>
                    {hoveredPoint.region}
                  </p>
                  <p className="font-medium text-[10px] text-neutral-300">
                    السنة: <span className="text-white font-mono font-bold">{hoveredPoint.year}</span>
                  </p>
                  <p className="font-bold border-t border-neutral-800 pt-1 mt-1 text-[13px]">
                    القيمة: <span className="font-mono font-black" style={{ color: hoveredPoint.color }}>{hoveredPoint.value} {activeIndicator.unit}</span>
                  </p>
                </div>
              )}
            </div>

            <span className="text-[9.5px] text-neutral-400 font-medium block text-center mt-3 leading-relaxed">
              * مرر الفأرة (أو المس النقاط) فوق منحنيات الدول لقراءة تفاصيل التقارير والاتجاهات الدقيقة.
            </span>
          </div>

          {/* SIDE INFORMATION DETAIL PANEL (occupies 5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Country Card */}
            {activeRegionDetails && (
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl md:p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                  <h4 className="serif-text font-black text-base text-neutral-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-6 bg-brand-primary rounded-xs"></span>
                    <span>الرصد الإحصائي لـ {activeRegionDetails.region}</span>
                  </h4>
                  <span 
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-offset-2 ring-stone-100 shrink-0" 
                    style={{ backgroundColor: activeRegionDetails.color }}
                  ></span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block">القيمة في ٢٠٢٦ م:</span>
                    <span className="serif-text font-black text-2.5xl md:text-3.5xl text-brand-primary block tracking-tight font-mono">
                      {activeRegionDetails.points.find(p => p.year === "٢٠٢٦")?.value || 0}
                      <span className="text-sm font-bold text-neutral-500 mr-1.5">{activeIndicator.unit}</span>
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-[320] text-justify bg-white border border-stone-200/50 p-3.5 rounded-xl">
                    {activeRegionDetails.details}
                  </p>

                  <div className="space-y-2.5">
                    <span className="text-[9.5px] font-bold text-neutral-400 block tracking-wider">سجل التطور السنوي المقدر:</span>
                    <div className="grid grid-cols-3 gap-3">
                      {activeRegionDetails.points.map((pt, i) => (
                        <div key={i} className="bg-white border border-stone-200/80 p-2.5 rounded-lg text-center flex flex-col justify-center">
                          <span className="text-[9px] text-neutral-400 block font-bold">{pt.year}</span>
                          <span className="text-xs font-black text-neutral-800 font-mono mt-1">{pt.value}{activeIndicator.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Context Articles Feed Box */}
            <div className="bg-neutral-900 text-stone-100 p-5 rounded-2xl border border-neutral-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                <BookOpen className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                <h4 className="serif-text text-sm font-black text-stone-200">التحليلات والمقالات المتصلة بالمسار</h4>
              </div>

              <div className="space-y-3.5">
                {contextArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => onArticleClick(art)}
                    className="group cursor-pointer border-b border-neutral-800/80 last:border-none pb-3 last:pb-0 hover:bg-neutral-850/25 p-1 rounded-sm transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap text-[9px] text-neutral-400 font-mono">
                      <span className="text-amber-500 font-bold">{art.category}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h5 className="font-bold text-neutral-200 hover:text-amber-400 text-xs transition-colors duration-150 leading-snug line-clamp-2">
                      {art.title}
                    </h5>
                    <div className="text-[9.5px] text-neutral-400 line-clamp-1 mt-0.5 leading-none flex items-center gap-1">
                      <span>الكاتب: {art.author.split("-")[0].trim()}</span>
                      <ArrowUpRight className="w-3 h-3 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
