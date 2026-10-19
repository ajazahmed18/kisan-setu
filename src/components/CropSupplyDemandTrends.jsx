import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ComposedChart
} from "recharts";
import {
  TrendingUp,
  Clock,
  Scale,
  Sparkles,
  Warehouse,
  ShoppingBag,
  BarChart2,
  Package
} from "lucide-react";
import { CROPS_DATA, MANDI_PRICES_DATA } from "../data/mockData";
export const CropSupplyDemandTrends = ({
  mandiPrices = MANDI_PRICES_DATA,
  lots = [],
  offers = [],
  initialCrop = "Cotton",
  onSelectCropToSell,
  onOpenStorage,
  onViewOffers
}) => {
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [timeframe, setTimeframe] = useState("15");
  const [chartViewMode, setChartViewMode] = useState("volume");
  const [simulatedQuantity, setSimulatedQuantity] = useState(50);
  const currentCropObj = useMemo(() => {
    return CROPS_DATA.find((c) => c.name.toLowerCase() === selectedCrop.toLowerCase()) || CROPS_DATA[0];
  }, [selectedCrop]);
  const cropMandis = useMemo(() => {
    const list = mandiPrices.filter(
      (m) => m.cropName.toLowerCase() === selectedCrop.toLowerCase()
    );
    return list.length > 0 ? list : mandiPrices.filter((m) => m.cropName.toLowerCase() === "cotton");
  }, [mandiPrices, selectedCrop]);
  const platformLotCount = lots.filter((l) => l.crop.toLowerCase() === selectedCrop.toLowerCase()).length;
  const platformLotQuantity = lots.filter((l) => l.crop.toLowerCase() === selectedCrop.toLowerCase()).reduce((acc, l) => acc + (Number(l.quantity) || 0), 0);
  const platformOffers = offers.filter((o) => o.crop.toLowerCase() === selectedCrop.toLowerCase());
  const platformOfferQuantity = platformOffers.reduce((acc, o) => acc + (Number(o.quantity) || 0), 0);
  const totalMandiArrivals = cropMandis.reduce((sum, m) => sum + (m.arrivalVolumeQuintals || 0), 0);
  const avgMandiPrice = cropMandis.length > 0 ? Math.round(cropMandis.reduce((sum, m) => sum + m.modalPrice, 0) / cropMandis.length) : currentCropObj.basePrice;
  const totalRealTimeSupply = totalMandiArrivals + platformLotQuantity;
  const buyerDemandMultiplier = useMemo(() => {
    const highDemandCount = cropMandis.filter((m) => m.demandLevel === "High").length;
    const medDemandCount = cropMandis.filter((m) => m.demandLevel === "Medium").length;
    const ratio = (highDemandCount * 1.35 + medDemandCount * 1.08) / (cropMandis.length || 1);
    return Math.max(0.85, Math.min(1.48, ratio));
  }, [cropMandis]);
  const totalRealTimeDemand = Math.round(totalRealTimeSupply * buyerDemandMultiplier + platformOfferQuantity);
  const supplyDemandRatio = totalRealTimeSupply > 0 ? totalRealTimeDemand / totalRealTimeSupply : 1.15;
  const isDemandDeficit = supplyDemandRatio >= 1.05;
  const isOversupply = supplyDemandRatio < 0.95;
  const trendData = useMemo(() => {
    const days = parseInt(timeframe, 10);
    const data = [];
    const basePrice = avgMandiPrice;
    const baseSupply = totalRealTimeSupply > 0 ? totalRealTimeSupply : 38e3;
    const baseDemand = totalRealTimeDemand > 0 ? totalRealTimeDemand : 46e3;
    const todayIndex = days - 4;
    for (let i = 0; i <= days; i++) {
      const offsetDays = i - todayIndex;
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() + offsetDays);
      const dayLabel = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric"
      });
      const isFuture = offsetDays > 0;
      const isToday = offsetDays === 0;
      const supplyWave = Math.sin(i * 1.1 + 0.5) * (baseSupply * 0.14);
      const demandWave = Math.cos(i * 0.9 - 0.2) * (baseDemand * 0.12);
      const daySupply = Math.round(baseSupply * 0.92 + supplyWave - offsetDays * 120);
      const dayDemand = Math.round(baseDemand * 0.95 + demandWave + offsetDays * 180);
      const dailyRatio = dayDemand / (daySupply || 1);
      const priceFlex = (dailyRatio - 1) * (basePrice * 0.12);
      const dayPrice = Math.round(basePrice + priceFlex + Math.sin(i * 1.5) * 45);
      const isOptimalWindow = offsetDays >= 2 && offsetDays <= 4 && dailyRatio >= 1.08;
      data.push({
        date: dayLabel,
        rawDate: d,
        offsetDays,
        isToday,
        isFuture,
        supplyVolume: Math.max(5e3, daySupply),
        demandVolume: Math.max(5e3, dayDemand),
        netGap: dayDemand - daySupply,
        ratio: Number(dailyRatio.toFixed(2)),
        price: dayPrice,
        mspFloor: Math.round(basePrice * 0.88),
        isOptimalWindow,
        status: isToday ? "Today" : isOptimalWindow ? "Optimal Window" : isFuture ? "Forecast" : "Historical"
      });
    }
    return data;
  }, [timeframe, avgMandiPrice, totalRealTimeSupply, totalRealTimeDemand]);
  const optimalDay = useMemo(() => {
    const futureDays = trendData.filter((d) => d.offsetDays >= 0);
    if (futureDays.length === 0) return trendData[trendData.length - 1];
    let best = futureDays[0];
    for (const d of futureDays) {
      if (d.price > best.price) {
        best = d;
      }
    }
    return best;
  }, [trendData]);
  const todayData = useMemo(() => {
    return trendData.find((d) => d.isToday) || trendData[0];
  }, [trendData]);
  const priceDeltaPerQuintal = optimalDay.price - todayData.price;
  const percentageGain = todayData.price > 0 ? Number((priceDeltaPerQuintal / todayData.price * 100).toFixed(1)) : 0;
  const simulatedTotalGain = priceDeltaPerQuintal * simulatedQuantity;
  const mandiHubData = useMemo(() => {
    return cropMandis.map((m) => {
      const supply = m.arrivalVolumeQuintals;
      const demand = m.demandLevel === "High" ? Math.round(supply * 1.32) : m.demandLevel === "Medium" ? Math.round(supply * 1.08) : Math.round(supply * 0.82);
      const gap = demand - supply;
      return {
        mandiName: m.mandiName.split("(")[0].trim(),
        district: m.district,
        supply,
        demand,
        gap,
        modalPrice: m.modalPrice,
        netValue: m.netValue,
        demandLevel: m.demandLevel,
        isBestForSelling: m.netValue >= (cropMandis[0]?.netValue || 0)
      };
    });
  }, [cropMandis]);
  return <div className="space-y-6 text-left" id="crop-supply-demand-section">
      {
    /* SECTION HEADER & CROP SELECTOR */
  }
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentCropObj.icon}</span>
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <span>Crop Supply vs. Buyer Demand Trends</span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Live Analytics
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Synchronized with APMC arrivals, farmer listings & institutional procurement quotas to optimize selling time.
                </p>
              </div>
            </div>
          </div>

          {
    /* Timeframe & Chart View Mode Controls */
  }
          <div className="flex flex-wrap items-center gap-2">
            {
    /* View Mode Toggle */
  }
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
    type="button"
    onClick={() => setChartViewMode("volume")}
    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${chartViewMode === "volume" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
  >
                Supply vs. Demand
              </button>
              <button
    type="button"
    onClick={() => setChartViewMode("price-correlation")}
    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${chartViewMode === "price-correlation" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
  >
                Price Elasticity
              </button>
              <button
    type="button"
    onClick={() => setChartViewMode("mandis")}
    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${chartViewMode === "mandis" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
  >
                Mandi Hubs
              </button>
            </div>

            {
    /* Timeframe selector */
  }
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-mono">
              {["7", "15", "30"].map((t) => <button
    key={t}
    type="button"
    onClick={() => setTimeframe(t)}
    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${timeframe === t ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:text-slate-900"}`}
  >
                  {t}D
                </button>)}
            </div>
          </div>
        </div>

        {
    /* Horizontal Crop Selection Pills */
  }
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          {CROPS_DATA.map((crop) => {
    const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase();
    return <button
      key={crop.id}
      type="button"
      onClick={() => setSelectedCrop(crop.name)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${isSelected ? "bg-slate-900 text-white border-slate-900 shadow-2xs" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
    >
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
                <span
      className={`text-[10px] font-mono px-1 py-0.2 rounded ${isSelected ? "bg-slate-800 text-slate-200" : "text-slate-500"}`}
    >
                  ₹{crop.basePrice}
                </span>
              </button>;
  })}
        </div>
      </div>

      {
    /* OPTIMAL SELLING TIME RECOMMENDATION CARD */
  }
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {
    /* Left / Main Insight */
  }
          <div className="lg:col-span-8 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                OPTIMAL SELLING TIME ANALYSIS
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Market Pressure: {isDemandDeficit ? "Seller Advantage (Buyer Deficit)" : isOversupply ? "Buyer Advantage (High Arrivals)" : "Balanced Equilibrium"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>
                {priceDeltaPerQuintal > 0 ? `Best Window: Sell in ${optimalDay.offsetDays} Days (${optimalDay.date})` : "Best Window: Sell Immediately (Today)"}
              </span>
              {priceDeltaPerQuintal > 0 && <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold">
                  +{percentageGain}% Expected Lift
                </span>}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {priceDeltaPerQuintal > 0 ? <>
                  Regional textile mills and procurement agencies have active buying orders of{" "}
                  <span className="text-white font-semibold">{totalRealTimeDemand.toLocaleString("en-IN")} Quintals</span>, 
                  exceeding current arrivals by{" "}
                  <span className="text-emerald-300 font-semibold font-mono">
                    {Math.abs(totalRealTimeDemand - totalRealTimeSupply).toLocaleString("en-IN")} Quintals ({((supplyDemandRatio - 1) * 100).toFixed(0)}% deficit)
                  </span>. 
                  Selling on <strong className="text-white">{optimalDay.date}</strong> avoids temporary harvesting glut and projects an estimated realization of{" "}
                  <span className="text-emerald-300 font-bold font-mono">₹{optimalDay.price.toLocaleString("en-IN")}/Q</span>{" "}
                  (up from ₹{todayData.price.toLocaleString("en-IN")}/Q today).
                </> : <>
                  Spot market arrivals are currently peaking while buyer demand remains steady. Spot prices are favorable at{" "}
                  <span className="text-emerald-300 font-bold font-mono">₹{todayData.price.toLocaleString("en-IN")}/Q</span>. 
                  Selling now avoids downside risk unless holding for &gt;3 weeks in CWC cold storage.
                </>}
            </p>

            {
    /* Quick decision tags */
  }
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Hold Duration: {optimalDay.offsetDays > 0 ? `${optimalDay.offsetDays} days` : "0 days (Spot)"}
              </span>
              <span className="flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5 text-blue-400" />
                Storage Cost: ~₹{Math.max(1, Math.round(optimalDay.offsetDays * 0.4))}/Q
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Net Timing Value: +₹{Math.max(0, priceDeltaPerQuintal - Math.round(optimalDay.offsetDays * 0.4))}/Q
              </span>
            </div>
          </div>

          {
    /* Right / Profit Calculator Widget */
  }
          <div className="lg:col-span-4 bg-slate-950/60 rounded-xl p-4 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Timing Gain Calculator</span>
              <span className="text-[10px] text-emerald-400 font-mono">Real-time Estimate</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Lot Size:</span>
                <div className="flex items-center gap-1">
                  <input
    type="number"
    min="5"
    max="1000"
    step="5"
    value={simulatedQuantity}
    onChange={(e) => setSimulatedQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
    className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-right text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
  />
                  <span className="text-slate-400 text-[11px] font-mono">{currentCropObj.unit}s</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Selling Today:</span>
                <span className="font-mono text-slate-300">₹{(todayData.price * simulatedQuantity).toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold border-t border-slate-800 pt-1.5">
                <span>Selling on {optimalDay.date}:</span>
                <span className="font-mono text-emerald-300 font-bold">₹{(optimalDay.price * simulatedQuantity).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="p-2 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-center">
              <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-mono">
                Projected Timing Profit
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                +{simulatedTotalGain >= 0 ? `\u20B9${simulatedTotalGain.toLocaleString("en-IN")}` : `\u20B90`}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {onSelectCropToSell && <button
    type="button"
    onClick={() => onSelectCropToSell(selectedCrop, optimalDay.price)}
    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
  >
                  List Lot at ₹{optimalDay.price}
                </button>}
              {onOpenStorage && <button
    type="button"
    onClick={onOpenStorage}
    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
    title="Reserve warehouse storage until optimal window"
  >
                  <Warehouse className="w-3.5 h-3.5" />
                </button>}
            </div>
          </div>
        </div>
      </div>

      {
    /* METRIC PILLARS GRID */
  }
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        {
    /* Metric 1: Total Supply */
  }
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Market Supply</span>
            <Package className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {totalRealTimeSupply.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">Qtl</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Mandi: {totalMandiArrivals.toLocaleString("en-IN")} | Lots: {platformLotQuantity}
          </div>
        </div>

        {
    /* Metric 2: Total Demand */
  }
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Buyer Demand</span>
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-lg font-bold font-mono text-indigo-600">
            {totalRealTimeDemand.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">Qtl</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {platformOffers.length} Active Bids • {cropMandis.filter((m) => m.demandLevel === "High").length} High Demand APMCs
          </div>
        </div>

        {
    /* Metric 3: Demand-to-Supply Ratio */
  }
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Market Pressure</span>
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-700 flex items-center gap-1">
            <span>{supplyDemandRatio.toFixed(2)}x</span>
            <span className="text-[10px] font-sans font-medium px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isDemandDeficit ? "Deficit" : isOversupply ? "Surplus" : "Balanced"}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {isDemandDeficit ? "High Buyer Competition" : "Gradual Absorption"}
          </div>
        </div>

        {
    /* Metric 4: Peak Selling Realization */
  }
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Projected Price Peak</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            ₹{optimalDay.price.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">/Qtl</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold font-mono">
            +{priceDeltaPerQuintal > 0 ? `\u20B9${priceDeltaPerQuintal}` : "\u20B90"} on {optimalDay.date}
          </div>
        </div>
      </div>

      {
    /* RECHARTS VISUALIZATION CONTAINER */
  }
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-700" />
              <span>
                {chartViewMode === "volume" && `${selectedCrop} Daily Supply (Arrivals) vs. Buyer Demand (Quintals)`}
                {chartViewMode === "price-correlation" && `${selectedCrop} Modal Price Elasticity & Timing Realization Curve`}
                {chartViewMode === "mandis" && `${selectedCrop} Supply vs. Demand Across Regional Mandi Hubs`}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {chartViewMode === "volume" && "Green area indicates arrival volume; indigo area indicates buyer procurement demand. Green band marks optimal selling window."}
              {chartViewMode === "price-correlation" && "Visualizing price trajectory against government MSP baseline and projected buyer price premiums."}
              {chartViewMode === "mandis" && "Comparison of individual market yards to identify high-demand arbitrage destinations with minimal supply glut."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Supply</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ml-2" />
            <span>Demand</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-200 border border-emerald-400 ml-2" />
            <span>Optimal Window</span>
          </div>
        </div>

        {
    /* CHART 1: SUPPLY VS DEMAND VOLUMES (RECHARTS AREA CHART) */
  }
        {chartViewMode === "volume" && <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
    dataKey="date"
    tick={{ fontSize: 11, fill: "#64748b" }}
    tickLine={false}
    axisLine={{ stroke: "#e2e8f0" }}
  />
                <YAxis
    tick={{ fontSize: 11, fill: "#64748b" }}
    tickLine={false}
    axisLine={{ stroke: "#e2e8f0" }}
    tickFormatter={(val) => `${(val / 1e3).toFixed(0)}k`}
  />

                <Tooltip
    content={({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-2 min-w-56">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span className="font-bold text-slate-200">{data.date}</span>
                            <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${data.isOptimalWindow ? "bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40" : data.isToday ? "bg-amber-500/30 text-amber-300 font-bold" : "bg-slate-800 text-slate-400"}`}
        >
                              {data.status}
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-[11px]">
                            <div className="flex items-center justify-between text-indigo-300">
                              <span>Buyer Demand:</span>
                              <span className="font-bold">{data.demandVolume.toLocaleString("en-IN")} Qtl</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-400">
                              <span>Mandi Supply:</span>
                              <span className="font-bold">{data.supplyVolume.toLocaleString("en-IN")} Qtl</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300 border-t border-slate-800 pt-1">
                              <span>Demand Gap:</span>
                              <span
          className={`font-bold ${data.netGap >= 0 ? "text-emerald-400" : "text-rose-400"}`}
        >
                                {data.netGap >= 0 ? `+${data.netGap.toLocaleString("en-IN")}` : data.netGap.toLocaleString("en-IN")} Qtl
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-amber-300">
                              <span>Est. Modal Price:</span>
                              <span className="font-bold">₹{data.price.toLocaleString("en-IN")}/Q</span>
                            </div>
                          </div>

                          {data.isOptimalWindow && <div className="text-[10px] text-emerald-300 pt-1 border-t border-slate-800 flex items-center gap-1 font-mono">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>Optimal selling window: High demand premium</span>
                            </div>}
                        </div>;
      }
      return null;
    }}
  />

                {
    /* Highlight Today */
  }
                {todayData && <ReferenceLine
    x={todayData.date}
    stroke="#f59e0b"
    strokeDasharray="4 4"
    label={{
      value: "Today",
      position: "top",
      fill: "#d97706",
      fontSize: 10,
      fontWeight: 600
    }}
  />}

                {
    /* Highlight Optimal Window */
  }
                {optimalDay && <ReferenceLine
    x={optimalDay.date}
    stroke="#10b981"
    strokeWidth={2}
    label={{
      value: "\u2605 Peak Window",
      position: "insideTopRight",
      fill: "#059669",
      fontSize: 11,
      fontWeight: 700
    }}
  />}

                {
    /* Demand Area */
  }
                <Area
    type="monotone"
    dataKey="demandVolume"
    name="Buyer Demand (Qtl)"
    stroke="#6366f1"
    strokeWidth={2.5}
    fillOpacity={1}
    fill="url(#colorDemand)"
  />

                {
    /* Supply Area */
  }
                <Area
    type="monotone"
    dataKey="supplyVolume"
    name="Mandi Supply (Qtl)"
    stroke="#10b981"
    strokeWidth={2.5}
    fillOpacity={1}
    fill="url(#colorSupply)"
  />
              </AreaChart>
            </ResponsiveContainer>
          </div>}

        {
    /* CHART 2: PRICE CORRELATION & ELASTICITY CURVE */
  }
        {chartViewMode === "price-correlation" && <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
    dataKey="date"
    tick={{ fontSize: 11, fill: "#64748b" }}
    tickLine={false}
    axisLine={{ stroke: "#e2e8f0" }}
  />
                <YAxis
    tick={{ fontSize: 11, fill: "#64748b" }}
    tickLine={false}
    axisLine={{ stroke: "#e2e8f0" }}
    domain={["dataMin - 150", "dataMax + 150"]}
    tickFormatter={(val) => `\u20B9${val}`}
  />

                <Tooltip
    content={({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1.5 min-w-52 font-mono">
                          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
                            <span>{data.date}</span>
                            <span className="text-emerald-400">{data.status}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Price Realization:</span>
                            <span className="font-bold text-white">₹{data.price.toLocaleString("en-IN")}/Q</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>MSP Floor:</span>
                            <span>₹{data.mspFloor.toLocaleString("en-IN")}/Q</span>
                          </div>
                          <div className="flex justify-between text-indigo-300">
                            <span>Demand Ratio:</span>
                            <span>{data.ratio}x</span>
                          </div>
                        </div>;
      }
      return null;
    }}
  />

                {
    /* MSP Safety Line */
  }
                <ReferenceLine
    y={todayData.mspFloor}
    stroke="#ef4444"
    strokeDasharray="5 5"
    label={{
      value: "Govt MSP Floor Cushion",
      position: "insideBottomLeft",
      fill: "#dc2626",
      fontSize: 10
    }}
  />

                {
    /* Optimal selling day marker */
  }
                {optimalDay && <ReferenceLine
    x={optimalDay.date}
    stroke="#10b981"
    strokeWidth={2}
    label={{
      value: `Peak: \u20B9${optimalDay.price}`,
      position: "top",
      fill: "#059669",
      fontSize: 11,
      fontWeight: 700
    }}
  />}

                <Line
    type="monotone"
    dataKey="price"
    name="Projected Selling Price (₹/Qtl)"
    stroke="#059669"
    strokeWidth={3}
    dot={{ r: 3, fill: "#059669" }}
    activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
  />
              </ComposedChart>
            </ResponsiveContainer>
          </div>}

        {
    /* CHART 3: MANDI HUB COMPARISON (BAR CHART) */
  }
        {chartViewMode === "mandis" && <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mandiHubData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
    dataKey="mandiName"
    tick={{ fontSize: 11, fill: "#475569" }}
    tickLine={false}
    axisLine={{ stroke: "#e2e8f0" }}
    angle={-15}
    textAnchor="end"
    interval={0}
  />
                <YAxis
    tick={{ fontSize: 11, fill: "#64748b" }}
    tickLine={false}
    axisLine={{ stroke: "#e2e8f0" }}
    tickFormatter={(val) => `${(val / 1e3).toFixed(0)}k`}
  />

                <Tooltip
    content={({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1.5 min-w-56 font-mono">
                          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
                            <span>{data.mandiName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{data.district}</span>
                          </div>
                          <div className="flex justify-between text-indigo-300">
                            <span>Buyer Demand:</span>
                            <span className="font-bold">{data.demand.toLocaleString("en-IN")} Qtl</span>
                          </div>
                          <div className="flex justify-between text-emerald-400">
                            <span>Mandi Arrivals:</span>
                            <span className="font-bold">{data.supply.toLocaleString("en-IN")} Qtl</span>
                          </div>
                          <div className="flex justify-between text-amber-300">
                            <span>Modal Price:</span>
                            <span className="font-bold">₹{data.modalPrice.toLocaleString("en-IN")}/Q</span>
                          </div>
                          <div className="flex justify-between text-emerald-300 border-t border-slate-800 pt-1 font-bold">
                            <span>Net Realization:</span>
                            <span>₹{data.netValue.toLocaleString("en-IN")}/Q</span>
                          </div>
                        </div>;
      }
      return null;
    }}
  />

                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="supply" name="Arrivals / Supply (Qtl)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demand" name="Buyer Procurement (Qtl)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>}

        {
    /* Legend Footnote / Strategy Guide */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>When to Sell Immediately:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              When Buyer Demand exceeds supply by &gt;20% and modal price touches the 30-day high. Spot buyers settle within 24 hours.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5 text-blue-600" />
              <span>When to Hold in CWC:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              When sudden post-harvest influx gluts APMC yards. Holding 10-14 days at ₹10/Q/mo lets excess arrivals clear, yielding a +₹200-350/Q rebound.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Direct Platform Trade:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Listing your crop with an verified grade attracts direct institutional bids (cotton ginners, rice millers) bypassing mandi middlemen cuts.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
