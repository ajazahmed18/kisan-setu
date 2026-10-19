import { useState, useMemo, useEffect } from "react";
import { CROPS_DATA } from "../data/mockData";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  TrendingUp,
  Sparkles,
  Scale,
  ShieldAlert,
  ArrowUpRight,
  Building2,
  ShieldCheck,
  MapPin,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Calculator,
  ArrowRight,
  Activity,
  Zap
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { CityMarketDetailsCard } from "./CityMarketDetailsCard";
import { INITIAL_SEED_VEGETABLES } from "./MarketAdminDashboard";
export const MarketIntelligence = ({
  mandiPrices,
  selectedCrop,
  onSelectCrop,
  onSelectMandiToSell,
  onSellCropAtRate,
  onOpenMarketAdmin
}) => {
  const { language } = useLanguage();
  const { selectedCity, selectedCityId, selectCity } = useLocation();
  const [activeMarketSection, setActiveMarketSection] = useState("adminRates");
  const [adminVegetables, setAdminVegetables] = useState(INITIAL_SEED_VEGETABLES);
  const [loadingVegetables, setLoadingVegetables] = useState(false);
  const [vegCategoryFilter, setVegCategoryFilter] = useState("All");
  const [vegSearchTerm, setVegSearchTerm] = useState("");
  useEffect(() => {
    let isMounted = true;
    const fetchAdminVegetables = async () => {
      try {
        setLoadingVegetables(true);
        const res = await fetch("/api/vegetables");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setAdminVegetables(data);
          }
        }
      } catch (err) {
        console.warn("Using seed market vegetables:", err);
      } finally {
        if (isMounted) setLoadingVegetables(false);
      }
    };
    fetchAdminVegetables();
    return () => {
      isMounted = false;
    };
  }, []);
  const [trendRange, setTrendRange] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("netValue");
  const [viewMode, setViewMode] = useState("cards");
  const [simulatedQuantity, setSimulatedQuantity] = useState(50);
  const filteredAdminVegetables = useMemo(() => {
    return adminVegetables.filter((veg) => {
      const matchesCategory = vegCategoryFilter === "All" || veg.category === vegCategoryFilter;
      const q = vegSearchTerm.toLowerCase();
      const matchesSearch = !q || veg.name.toLowerCase().includes(q) || veg.nameTe && veg.nameTe.toLowerCase().includes(q) || veg.nameHi && veg.nameHi.toLowerCase().includes(q) || veg.market.toLowerCase().includes(q) || veg.location.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [adminVegetables, vegCategoryFilter, vegSearchTerm]);
  const currentCropObj = CROPS_DATA.find((c) => c.name.toLowerCase() === selectedCrop.toLowerCase()) || CROPS_DATA[0];
  const cropMandis = useMemo(() => {
    return mandiPrices.filter(
      (m) => m.cropName.toLowerCase() === selectedCrop.toLowerCase()
    );
  }, [mandiPrices, selectedCrop]);
  const filteredMandis = useMemo(() => {
    let list = [...cropMandis];
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (m) => m.mandiName.toLowerCase().includes(q) || m.district.toLowerCase().includes(q) || m.state.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "netValue":
          return b.netValue - a.netValue;
        case "freight":
          return a.transportCostPerQuintal - b.transportCostPerQuintal;
        case "distance":
          return a.distanceKm - b.distanceKm;
        case "price":
          return b.currentPrice - a.currentPrice;
        case "volume":
          return b.arrivalVolumeQuintals - a.arrivalVolumeQuintals;
        default:
          return b.netValue - a.netValue;
      }
    });
    return list;
  }, [cropMandis, searchTerm, sortBy]);
  const bestMandi = useMemo(() => {
    const sorted = [...cropMandis].sort((a, b) => b.netValue - a.netValue);
    return sorted[0];
  }, [cropMandis]);
  const chartData = useMemo(() => {
    const days = parseInt(trendRange, 10);
    const base = currentCropObj.basePrice;
    const data = [];
    for (let i = days; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric"
      });
      const wave = Math.sin((days - i) / 4) * (base * 0.05);
      const price = Math.round(base - days * 2 + (days - i) * 5 + wave);
      const arrival = Math.round(7500 + Math.cos(i / 2) * 2200 + (days - i) * 60);
      data.push({
        date: dayLabel,
        price,
        minPrice: Math.round(price * 0.94),
        maxPrice: Math.round(price * 1.06),
        arrivalVolume: arrival
      });
    }
    return data;
  }, [trendRange, currentCropObj]);
  const pricePrediction = useMemo(() => {
    const cur = bestMandi?.currentPrice || currentCropObj.basePrice;
    return {
      crop: selectedCrop,
      market: bestMandi?.mandiName || "Warangal Central Mandi",
      currentPrice: cur,
      predictedPrice7Days: Math.round(cur * 1.03),
      predictedPrice15Days: Math.round(cur * 1.06),
      predictedPrice30Days: Math.round(cur * 1.08),
      trend: "increasing",
      confidence: 88,
      factors: [
        "Export parity demand from regional spinning mills (+3.2%)",
        "Lower arrival inflows expected due to rainfall pattern in Nizamabad/Adilabad (+2.1%)",
        "Government Minimum Support Price (MSP) floor safety cushion"
      ]
    };
  }, [bestMandi, currentCropObj, selectedCrop]);
  const simPrice = bestMandi ? bestMandi.currentPrice : currentCropObj.basePrice;
  const simFreight = bestMandi ? bestMandi.transportCostPerQuintal : 300;
  const simGrossTotal = simPrice * simulatedQuantity;
  const simFreightTotal = simFreight * simulatedQuantity;
  const simNetTotal = simGrossTotal - simFreightTotal;
  return <div className="space-y-6 py-2 text-left" id="market-intelligence-container">
      {
    /* Official APMC Rates Uploaded Banner (Read-Only for Farmers) */
  }
      <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Official APMC Mandi Uploads:</strong> Showing live commodity rates uploaded by verified APMC Market Authorities &amp; Market Admins. Farmer access is read-only for transparent price discovery.
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold shrink-0 self-start sm:self-auto flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Live Market Feed</span>
        </span>
      </div>

      {
    /* SECTION TABS: LIVE VEGETABLE RATES vs MULTI-MANDI NET VALUE */
  }
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <button
    type="button"
    onClick={() => setActiveMarketSection("adminRates")}
    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeMarketSection === "adminRates" ? "bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-500/50 font-black" : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"}`}
    id="market-tab-admin-rates"
  >
          <Building2 className="w-4 h-4 text-amber-900" />
          <span>{language === "te" ? "\u0C15\u0C42\u0C30\u0C17\u0C3E\u0C2F\u0C32\u0C41 & \u0C32\u0C48\u0C35\u0C4D \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C30\u0C47\u0C1F\u0C4D\u0C32\u0C41" : language === "hi" ? "\u0938\u092C\u094D\u091C\u0940 \u0935 \u0932\u093E\u0907\u0935 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935" : "Live Vegetable & Mandi Rates"}</span>
        </button>

        <button
    type="button"
    onClick={() => setActiveMarketSection("mandiComparison")}
    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeMarketSection === "mandiComparison" ? "bg-slate-950 text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"}`}
    id="market-tab-comparison"
  >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>{language === "te" ? "\u0C2E\u0C02\u0C21\u0C40\u0C32 \u0C27\u0C30\u0C32 \u0C2A\u0C4B\u0C32\u0C3F\u0C15 (Net Value)" : language === "hi" ? "\u092E\u0902\u0921\u0940 \u0924\u0941\u0932\u0928\u093E \u0914\u0930 \u092D\u093E\u0921\u093C\u093E \u0936\u0941\u0926\u094D\u0927 \u092E\u0942\u0932\u094D\u092F" : "Multi-Mandi Net Value Optimizer"}</span>
        </button>
      </div>

      {activeMarketSection === "adminRates" && <div className="space-y-4">
          {onOpenMarketAdmin && <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Building2 className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    Official APMC Mandi Rates Management
                  </strong>
                  <span className="text-slate-600">
                    Are you an APMC Market Administrator? Switch to the Market Admin Desk to upload today's arrivals, update rates, or add vegetables.
                  </span>
                </div>
              </div>
              <button
    type="button"
    onClick={onOpenMarketAdmin}
    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto active:scale-95"
    id="market-intel-switch-to-admin-btn"
  >
                <Building2 className="w-3.5 h-3.5" />
                <span>Switch to Market Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>}

          <CityMarketDetailsCard
    onSelectCropForMarket={(crop) => {
      onSelectCrop(crop);
      setActiveMarketSection("mandiComparison");
      window.scrollTo({ top: 350, behavior: "smooth" });
    }}
  />
        </div>}

      {activeMarketSection === "mandiComparison" && <div className="space-y-6">

      {
    /* SECTION 1: HEADER & COMMODITY SELECTOR */
  }
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>APMC Live Benchmark Feed</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Synced with Telangana &amp; AP e-NAM Mandis
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-950">
              {language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C27\u0C30\u0C32 \u0C35\u0C3F\u0C36\u0C4D\u0C32\u0C47\u0C37\u0C23 & \u0C28\u0C3F\u0C15\u0C30 \u0C35\u0C3F\u0C32\u0C41\u0C35 \u0C07\u0C02\u0C1F\u0C46\u0C32\u0C3F\u0C1C\u0C46\u0C28\u0C4D\u0C38\u0C4D" : language === "hi" ? "\u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0914\u0930 \u0936\u0941\u0926\u094D\u0927 \u092E\u0942\u0932\u094D\u092F \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923" : "Market Price Discovery & Net Value Intelligence"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {language === "te" ? "\u0C30\u0C48\u0C24\u0C41 \u0C28\u0C3F\u0C15\u0C30 \u0C35\u0C3F\u0C32\u0C41\u0C35 = \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C27\u0C30 - \u0C30\u0C35\u0C3E\u0C23\u0C3E \u0C1B\u0C3E\u0C30\u0C4D\u0C1C\u0C40\u0C32\u0C41. \u0C2E\u0C40 \u0C2A\u0C02\u0C1F\u0C15\u0C41 \u0C05\u0C24\u0C4D\u0C2F\u0C27\u0C3F\u0C15 \u0C32\u0C3E\u0C2D\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C07\u0C1A\u0C4D\u0C1A\u0C47 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D\u200C\u0C28\u0C41 \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F." : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928 \u0915\u093E \u0936\u0941\u0926\u094D\u0927 \u092E\u0942\u0932\u094D\u092F = \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 - \u092A\u0930\u093F\u0935\u0939\u0928 \u092D\u093E\u0921\u093C\u093E\u0964 \u0938\u092C\u0938\u0947 \u0905\u0927\u093F\u0915 \u092C\u091A\u0924 \u0914\u0930 \u092E\u0941\u0928\u093E\u092B\u093E \u0926\u0947\u0928\u0947 \u0935\u093E\u0932\u0940 \u092E\u0902\u0921\u0940 \u091A\u0941\u0928\u0947\u0902\u0964" : "Real-time multi-mandi benchmarking across Telangana & Andhra Pradesh. Net Value = Mandi Benchmark Price \u2212 Transportation Freight."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-slate-50 text-slate-700 text-xs px-3.5 py-2 rounded-2xl border border-slate-200 font-mono shadow-2xs">
            <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block text-xs">24 Mandis Active</span>
              <span className="text-[10px] text-slate-500">Auto-refreshed 2m ago</span>
            </div>
          </div>
        </div>

        {
    /* Commodity Carousel Pills */
  }
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Commodity to Compare Mandis:
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {CROPS_DATA.map((crop) => {
    const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase();
    return <button
      key={crop.id}
      type="button"
      onClick={() => onSelectCrop(crop.name)}
      className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${isSelected ? "bg-slate-950 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"}`}
    >
                  <span className="text-base">{crop.icon}</span>
                  <div className="text-left leading-tight">
                    <span className="block font-bold">{crop.name}</span>
                    <span className={`text-[10.5px] block ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {crop.nameTe}
                    </span>
                  </div>
                  <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded-full font-bold ml-1 ${isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-slate-100 text-slate-700"}`}>
                    ₹{crop.basePrice.toLocaleString("en-IN")}
                  </span>
                </button>;
  })}
          </div>
        </div>
      </div>

      {
    /* SECTION 2: HERO BEST PROFIT ADVISORY BANNER */
  }
      {bestMandi && <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
          {
    /* Ambient Glow Lights */
  }
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {
    /* Left Content Area */
  }
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold px-3 py-1 rounded-full border border-emerald-400/30 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BEST NET PROFIT ADVISORY</span>
                </span>
                <span className="text-xs text-slate-300 font-mono bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  Reliability: <strong className="text-emerald-400">88% Confidence</strong>
                </span>
                <span className="text-xs text-sky-300 font-mono bg-sky-500/20 px-2.5 py-1 rounded-full border border-sky-400/30">
                  High Buyer Liquidity
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                  Optimal Mandi Recommendation for {selectedCrop}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white mt-1 flex items-center gap-2">
                  <span>{bestMandi.mandiName}</span>
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{bestMandi.district}, {bestMandi.state}</span>
                  <span>•</span>
                  <span>{bestMandi.distanceKm} km from farm location</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{bestMandi.arrivalVolumeQuintals.toLocaleString()} Q Active Daily Trades</span>
                </p>
              </div>

              {
    /* Mathematical Deduction Formula Card */
  }
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Net Realization Formula Breakdown</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Per Quintal</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-black/30 rounded-xl border border-white/5">
                  <div className="p-1.5">
                    <span className="text-[10px] text-slate-400 block font-sans">1. Mandi Price</span>
                    <span className="text-sm sm:text-base font-black font-mono text-white">
                      ₹{bestMandi.currentPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="p-1.5 border-x border-white/10">
                    <span className="text-[10px] text-rose-300 block font-sans">2. Freight Cost</span>
                    <span className="text-sm sm:text-base font-black font-mono text-rose-400">
                      -₹{bestMandi.transportCostPerQuintal}
                    </span>
                  </div>
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                    <span className="text-[10px] text-emerald-300 block font-sans font-bold">3. Net Realized</span>
                    <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                      = ₹{bestMandi.netValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1">
                  Higher buyer competition ({bestMandi.arrivalVolumeQuintals.toLocaleString()} Q daily intake) and low transit freight of ₹{bestMandi.transportCostPerQuintal}/Q makes this market yield the highest in-hand farmer realization.
                </p>
              </div>
            </div>

            {
    /* Right Profit Simulator Panel */
  }
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 text-center space-y-4 shadow-lg">
              <div>
                <span className="text-[11px] text-slate-300 font-mono uppercase tracking-wider font-semibold block">
                  Net Realized Value (In-Hand)
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white mt-1">
                  ₹{bestMandi.netValue.toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-slate-400 font-sans"> /Q</span>
                </div>
                <div className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-400/30">
                  <TrendingUp className="w-3 h-3" />
                  <span>Highest Net Margin in Region</span>
                </div>
              </div>

              {
    /* Interactive Quantity Simulator */
  }
              <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-sky-400" />
                    <span>Estimate Your Total Return:</span>
                  </span>
                  <div className="flex items-center gap-1 font-mono font-bold text-white">
                    <span>{simulatedQuantity}</span>
                    <span className="text-slate-400 text-[10px]">Quintals</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
    type="range"
    min="10"
    max="200"
    step="5"
    value={simulatedQuantity}
    onChange={(e) => setSimulatedQuantity(Number(e.target.value))}
    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Gross Crop Value:</span>
                    <span className="text-xs font-bold text-white">₹{simGrossTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-300 block font-sans">Net In-Hand Bank Transfer:</span>
                    <span className="text-sm font-black text-emerald-400">₹{simNetTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {onSelectMandiToSell && <button
    type="button"
    onClick={() => onSelectMandiToSell(bestMandi)}
    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
  >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Select {bestMandi.mandiName} to Sell</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>}
            </div>
          </div>
        </div>}

      {
    /* SECTION 3: MULTI-MANDI PRICE & NET VALUE COMPARISON */
  }
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {
    /* Toolbar Header */
  }
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-950">
                Multi-Mandi Price &amp; Net Value Comparison
              </h3>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                {filteredMandis.length} Mandis
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by highest net farmer realization (Market price minus estimated transit freight).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {
    /* Search Input */
  }
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
    type="text"
    placeholder="Filter mandis, district..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden text-slate-800 placeholder:text-slate-400"
  />
              {searchTerm && <button
    onClick={() => setSearchTerm("")}
    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
  >
                  ✕
                </button>}
            </div>

            {
    /* View Mode Switcher */
  }
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
    type="button"
    onClick={() => setViewMode("cards")}
    className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${viewMode === "cards" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
    title="Grid Cards View"
  >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
    type="button"
    onClick={() => setViewMode("table")}
    className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${viewMode === "table" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
    title="Table Spreadsheet View"
  >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {
    /* Quick Sorting Chips Bar */
  }
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Sort By:
          </span>

          <button
    type="button"
    onClick={() => setSortBy("netValue")}
    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${sortBy === "netValue" ? "bg-slate-900 text-white shadow-2xs" : "bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200"}`}
  >
            🏆 Highest Net Realization
          </button>

          <button
    type="button"
    onClick={() => setSortBy("freight")}
    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${sortBy === "freight" ? "bg-slate-900 text-white shadow-2xs" : "bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200"}`}
  >
            🚚 Lowest Freight Cost
          </button>

          <button
    type="button"
    onClick={() => setSortBy("distance")}
    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${sortBy === "distance" ? "bg-slate-900 text-white shadow-2xs" : "bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200"}`}
  >
            📍 Nearest Distance
          </button>

          <button
    type="button"
    onClick={() => setSortBy("price")}
    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${sortBy === "price" ? "bg-slate-900 text-white shadow-2xs" : "bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200"}`}
  >
            💰 Highest Market Price
          </button>

          <button
    type="button"
    onClick={() => setSortBy("volume")}
    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${sortBy === "volume" ? "bg-slate-900 text-white shadow-2xs" : "bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200"}`}
  >
            🔥 Highest Trading Volume
          </button>
        </div>

        {
    /* View Mode 1: Attractive Card Grid */
  }
        {viewMode === "cards" ? <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMandis.map((mandi, idx) => {
    const isBest = idx === 0 && sortBy === "netValue";
    return <div
      key={mandi.id}
      className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between group ${isBest ? "bg-gradient-to-b from-emerald-50/50 via-white to-white border-emerald-300 shadow-md ring-2 ring-emerald-400/20" : "bg-white hover:bg-slate-50/50 border-slate-200 shadow-2xs hover:shadow-md"}`}
    >
                  <div className="space-y-3.5">
                    {
      /* Top Row: Rank & Demand */
    }
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isBest ? "bg-emerald-600 text-white shadow-2xs" : "bg-slate-100 text-slate-700 font-mono"}`}
    >
                          {idx + 1}
                        </span>
                        {isBest && <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Top Net Return
                          </span>}
                      </div>

                      <span
      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${mandi.demandLevel === "High" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : mandi.demandLevel === "Medium" ? "bg-sky-50 text-sky-800 border-sky-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
                        {mandi.demandLevel} Demand
                      </span>
                    </div>

                    {
      /* Mandi Name & Location */
    }
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-900 text-base group-hover:text-slate-950">
                        {mandi.mandiName}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{mandi.district}, {mandi.state}</span>
                        <span>•</span>
                        <span>{mandi.distanceKm} km away</span>
                      </p>
                    </div>

                    {
      /* Pricing Matrix Breakdown */
    }
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-sans">Market Price:</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{mandi.currentPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
                          Modal: ₹{mandi.modalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                        <span className="text-[10px] text-rose-500 block font-sans">Freight Deduct:</span>
                        <span className="font-extrabold text-rose-700 text-sm">
                          -₹{mandi.transportCostPerQuintal}
                        </span>
                        <span className="text-[10px] text-rose-400 block font-sans mt-0.5">
                          {mandi.distanceKm} km route
                        </span>
                      </div>
                    </div>

                    {
      /* Prominent Net Value Box */
    }
                    <div className="p-3 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-teal-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Net Farmer Value:
                        </span>
                        <span className="text-lg font-black font-mono text-emerald-950">
                          ₹{mandi.netValue.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-normal text-emerald-700">/Q</span>
                        </span>
                      </div>
                      <div className="text-right text-[11px] font-mono text-emerald-800">
                        <span className="block font-bold">Arrival Volume</span>
                        <span>{mandi.arrivalVolumeQuintals.toLocaleString()} Q</span>
                      </div>
                    </div>
                  </div>

                  {
      /* Action Button */
    }
                  <div className="pt-4 mt-2">
                    {onSelectMandiToSell && <button
      type="button"
      onClick={() => onSelectMandiToSell(mandi)}
      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isBest ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
    >
                        <span>View Mandi Inflow &amp; Trends</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>}
                  </div>
                </div>;
  })}
          </div> : (
    /* View Mode 2: Clean High-Density Table */
    <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Market / Mandi</th>
                  <th className="py-3.5 px-3">Current Price</th>
                  <th className="py-3.5 px-3">Price Range</th>
                  <th className="py-3.5 px-3">Modal Price</th>
                  <th className="py-3.5 px-3">Distance</th>
                  <th className="py-3.5 px-3 text-rose-700">Freight</th>
                  <th className="py-3.5 px-4 bg-emerald-50/80 text-emerald-950 font-black">
                    NET VALUE
                  </th>
                  <th className="py-3.5 px-3">Demand</th>
                  <th className="py-3.5 px-3">Arrivals</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {filteredMandis.map((mandi, idx) => {
      const isBest = idx === 0 && sortBy === "netValue";
      return <tr
        key={mandi.id}
        className={`hover:bg-slate-50/80 transition-colors ${isBest ? "bg-emerald-50/30" : ""}`}
      >
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{mandi.mandiName}</span>
                              {isBest && <span className="text-[9px] font-mono bg-emerald-700 text-white font-bold px-1.5 py-0.2 rounded-full">
                                  TOP
                                </span>}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {mandi.district}, {mandi.state}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-950">
                        ₹{mandi.currentPrice.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        ₹{mandi.minPrice} – ₹{mandi.maxPrice}
                      </td>
                      <td className="py-3 px-3 text-slate-800">
                        ₹{mandi.modalPrice.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {mandi.distanceKm} km
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-700">
                        -₹{mandi.transportCostPerQuintal}
                      </td>
                      <td className="py-3 px-4 bg-emerald-50/40">
                        <span className="font-black text-emerald-800 text-sm">
                          ₹{mandi.netValue.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-emerald-600 ml-1 font-sans">/Q</span>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mandi.demandLevel === "High" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : mandi.demandLevel === "Medium" ? "bg-sky-50 text-sky-800 border-sky-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}
      >
                          {mandi.demandLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        {mandi.arrivalVolumeQuintals.toLocaleString()} Q
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onSelectMandiToSell && <button
        type="button"
        onClick={() => onSelectMandiToSell(mandi)}
        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
      >
                            Select
                          </button>}
                      </td>
                    </tr>;
    })}
              </tbody>
            </table>
          </div>
  )}
      </div>

      {
    /* SECTION 4: INTERACTIVE PRICE CHARTS & PREDICTIVE FORECAST */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Historical Price Trend with Recharts */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-950">
                Price Trend Visualization: {selectedCrop}
              </h3>
              <p className="text-xs text-slate-500">
                APMC modal price curves and volume fluctuations over time
              </p>
            </div>

            {
    /* Time range toggle: 7, 30, 90 days */
  }
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono self-start">
              {["7", "30", "90"].map((r) => <button
    key={r}
    type="button"
    onClick={() => setTrendRange(r)}
    className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${trendRange === r ? "bg-white text-slate-950 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                  {r} Days
                </button>)}
            </div>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
    domain={["dataMin - 100", "dataMax + 100"]}
    tick={{ fontSize: 10, fill: "#64748b" }}
    axisLine={false}
    tickLine={false}
    tickFormatter={(v) => `\u20B9${v}`}
  />
                <Tooltip
    content={({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return <div className="bg-slate-950 text-white p-3 rounded-2xl border border-slate-800 text-xs shadow-xl font-mono space-y-1">
                          <p className="text-slate-400 font-sans text-[11px] font-bold">{label}</p>
                          <p className="text-emerald-400 font-extrabold text-sm">
                            Price: ₹{payload[0].value?.toLocaleString("en-IN")}/Q
                          </p>
                          <p className="text-slate-400 text-[10.5px]">
                            Arrival Volume: {payload[0].payload?.arrivalVolume?.toLocaleString()} Q
                          </p>
                        </div>;
      }
      return null;
    }}
  />
                <Area
    type="monotone"
    dataKey="price"
    stroke="#10b981"
    strokeWidth={2.5}
    fillOpacity={1}
    fill="url(#colorPrice)"
  />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Trend: +5.4% seasonal strength over {trendRange} days</span>
            </span>
            <span className="text-slate-500">Peak Harvest Inflows</span>
          </div>
        </div>

        {
    /* 30-Day Predictive Price Forecast */
  }
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold px-2.5 py-0.5 rounded-full text-[10.5px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>30-DAY PRICE FORECAST</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">e-NAM AI Engine</span>
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-950">
                Projected Value Curve: {selectedCrop}
              </h3>
              <p className="text-xs text-slate-500">
                Projected against seasonal arrivals, mills demand, and weather patterns.
              </p>
            </div>

            {
    /* Forecast Horizons */
  }
            <div className="space-y-2.5 pt-1 font-mono">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 font-sans block">In 7 Days</span>
                  <p className="text-base font-black text-slate-950">
                    ₹{pricePrediction.predictedPrice7Days.toLocaleString("en-IN")}/Q
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  +3.0%
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 font-sans block">In 15 Days</span>
                  <p className="text-base font-black text-slate-950">
                    ₹{pricePrediction.predictedPrice15Days.toLocaleString("en-IN")}/Q
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  +6.0%
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl flex items-center justify-between border border-emerald-200">
                <div>
                  <span className="text-[11px] text-emerald-800 font-sans block font-semibold">In 30 Days (Peak)</span>
                  <p className="text-base font-black text-emerald-950">
                    ₹{pricePrediction.predictedPrice30Days.toLocaleString("en-IN")}/Q
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                  +8.0%
                </span>
              </div>
            </div>

            {
    /* Key Market Drivers */
  }
            <div className="space-y-1.5 pt-1 text-xs">
              <span className="font-bold text-slate-900 text-xs block">Key Market Drivers:</span>
              {pricePrediction.factors.map((f, i) => <div key={i} className="text-slate-600 flex items-start gap-1.5 text-[11px] leading-tight">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{f}</span>
                </div>)}
            </div>
          </div>

          {
    /* AI Disclaimer */
  }
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1 mt-2">
            <div className="flex items-center gap-1 font-bold text-slate-700 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>APMC Advisory Note</span>
            </div>
            <p className="leading-tight text-[10px] text-slate-500">
              Predictions are algorithmic approximations based on APMC historical data and seasonal arrivals. Prices may fluctuate based on daily quality test grades.
            </p>
          </div>
        </div>
      </div>
        </div>}
    </div>;
};
