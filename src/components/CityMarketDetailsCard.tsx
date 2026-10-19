import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Clock,
  Scale,
  ShieldCheck,
  Phone,
  Truck,
  CloudSun,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  DollarSign,
  BarChart3,
  BadgePercent,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  Search,
  Check,
  Wheat,
} from 'lucide-react';
import { CityMarketMandi, CityMarketCropPrice } from '../types';
import apmcMarketYardImage from '../assets/images/apmc_market_yard_1788784979925.jpg';
import { getCompleteCommodityPricesForCity, getCropPhoto } from '../data/vegetablesData';

export const CITY_MARKET_PHOTOS: Record<
  string,
  {
    imageUrl: string;
    hubTitle: string;
    hubSubtitle: string;
    badge: string;
    verifiedBadge: string;
  }
> = {
  hyd: {
    imageUrl: apmcMarketYardImage,
    hubTitle: 'Bowenpally Wholesale Agricultural Market Yard',
    hubSubtitle: 'Secunderabad / Hyderabad • Asia’s Pioneer Solar-Biogas APMC Yard',
    badge: 'Bowenpally APMC Mandi Yard',
    verifiedBadge: 'e-NAM Electronic Auction Hub #1',
  },
  warangal: {
    imageUrl:
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80',
    hubTitle: 'Laxmipuram & Enamamula Agricultural Market Yard',
    hubSubtitle: 'Warangal • Telangana Premier Produce Hub',
    badge: 'Warangal Vegetable & Mirchi Yard',
    verifiedBadge: 'Direct Rythu Bazar & Wholesale Desks',
  },
  pune: {
    imageUrl:
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80',
    hubTitle: 'Shree Chhatrapati Shivaji Market Yard (Gultekdi)',
    hubSubtitle: 'Gultekdi, Pune • Maharashtra Major Terminal APMC',
    badge: 'Gultekdi APMC Market Yard',
    verifiedBadge: 'Digital Auction & Weighment Center',
  },
  mumbai: {
    imageUrl:
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    hubTitle: 'Vashi APMC Terminal Wholesale Market',
    hubSubtitle: 'Navi Mumbai • Central Commodity & Produce Hub',
    badge: 'Vashi APMC Yard',
    verifiedBadge: 'Metro Terminal Exchange',
  },
  guntur: {
    imageUrl:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80',
    hubTitle: 'Guntur Asia Mirchi & Commercial Market Yard',
    hubSubtitle: 'Guntur • National Chilli & Agriculture Exchange',
    badge: 'Guntur APMC Yard',
    verifiedBadge: 'AP State Regulated Yard',
  },
  nashik: {
    imageUrl:
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80',
    hubTitle: 'Lasalgaon / Dindori APMC Market Yard',
    hubSubtitle: 'Nashik • National Onion & Vegetable Center',
    badge: 'Nashik APMC Yard',
    verifiedBadge: 'Direct Farm Auction Hub',
  },
};

interface CityMarketDetailsCardProps {
  onSelectCropForMarket?: (cropName: string) => void;
  onOpenTransportModal?: () => void;
}

export const CityMarketDetailsCard: React.FC<CityMarketDetailsCardProps> = ({
  onSelectCropForMarket,
  onOpenTransportModal,
}) => {
  const { selectedCity, selectCity, allCities, isGpsActive } = useLocation();
  const { language } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>(() => {
    return selectedCity.id === 'warangal' ? 'Vegetable' : 'all';
  });
  const [vegSearchQuery, setVegSearchQuery] = useState<string>('');

  // Automatically enforce Warangal Vegetables Only when user switches to Warangal
  useEffect(() => {
    if (selectedCity.id === 'warangal') {
      setFilterCategory('Vegetable');
    } else {
      setFilterCategory('all');
    }
    setVegSearchQuery('');
  }, [selectedCity.id]);

  const isWarangal = selectedCity.id === 'warangal';
  const categories = isWarangal
    ? ['Vegetable', 'all']
    : ['all', 'Vegetable', 'Cereal', 'Cash Crop', 'Spices'];

  const allPricesForCity = useMemo(() => {
    return getCompleteCommodityPricesForCity(selectedCity);
  }, [selectedCity]);

  const filteredPrices = useMemo(() => {
    let list =
      filterCategory === 'all'
        ? allPricesForCity
        : allPricesForCity.filter((p) => p.category === filterCategory);

    if (vegSearchQuery.trim() !== '') {
      const q = vegSearchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.cropName.toLowerCase().includes(q) ||
          p.primaryMandi.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allPricesForCity, filterCategory, vegSearchQuery]);

  const getCropIcon = (cropName: string) => {
    const name = cropName.toLowerCase();
    if (name.includes('tomato') || name.includes('టమాటా')) return '🍅';
    if (name.includes('chilli') || name.includes('మిర్చి')) return '🌶️';
    if (name.includes('brinjal') || name.includes('eggplant') || name.includes('వంకాయ')) return '🍆';
    if (name.includes('okra') || name.includes('ladies finger') || name.includes('బెండకాయ')) return '🌱';
    if (name.includes('onion') || name.includes('ఉల్లిపాయ')) return '🧅';
    if (name.includes('potato') || name.includes('బంగాళాదుంప')) return '🥔';
    if (name.includes('bitter gourd') || name.includes('కాకరకాయ')) return '🥒';
    if (name.includes('bottle gourd') || name.includes('సొరకాయ')) return '🥒';
    if (name.includes('ridge gourd') || name.includes('బీరకాయ')) return '🥒';
    if (name.includes('cabbage') || name.includes('క్యాబేజీ')) return '🥬';
    if (name.includes('cauliflower') || name.includes('కాలీఫ్లవర్')) return '🥦';
    if (name.includes('palak') || name.includes('spinach') || name.includes('పాలకూర')) return '🌿';
    if (name.includes('coriander') || name.includes('కొత్తిమీర')) return '🌿';
    if (name.includes('ginger') || name.includes('అల్లం')) return '🫚';
    if (name.includes('garlic') || name.includes('వెల్లుల్లి')) return '🧄';
    if (name.includes('capsicum') || name.includes('క్యాప్సికం')) return '🫑';
    if (name.includes('cluster beans') || name.includes('గోరుచిక్కుడు')) return '🌱';
    if (name.includes('carrot') || name.includes('క్యారెట్')) return '🥕';
    if (name.includes('cotton')) return '🌾';
    if (name.includes('rice')) return '🌾';
    if (name.includes('maize')) return '🌽';
    return '🥬';
  };

  const cleanCropName = (fullName: string) => {
    if (fullName.includes('(')) {
      return fullName.split('(')[0].trim();
    }
    return fullName;
  };

  const marketPhotoInfo = CITY_MARKET_PHOTOS[selectedCity.id] || {
    imageUrl: apmcMarketYardImage,
    hubTitle: selectedCity.apmcOverview.primaryHubName,
    hubSubtitle: `${selectedCity.name}, ${selectedCity.state} • Regulated APMC Wholesale Yard`,
    badge: `${selectedCity.name} APMC Yard`,
    verifiedBadge: 'e-NAM Electronic Auction Hub',
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs mb-8 overflow-hidden transition-all"
      id="city-market-details-card"
    >
      {/* Good-Looking Market Banner with Authentic Photo */}
      <div className="bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 p-5 sm:p-7 border-b border-slate-200/90 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Market Identity & Highlights */}
          <div className="flex-1 min-w-0">
            {/* Top Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="relative inline-flex items-center">
                <select
                  value={selectedCity.id}
                  onChange={(e) => selectCity(e.target.value)}
                  className="appearance-none pl-8 pr-7 py-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs cursor-pointer border border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition-all"
                  aria-label="Select Market City"
                  id="banner-market-city-select"
                >
                  {allCities.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white text-slate-900 font-medium">
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
                <MapPin className="w-3.5 h-3.5 text-emerald-200 absolute left-2.5 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200 absolute right-2.5 pointer-events-none" />
              </div>

              {isGpsActive && (
                <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-full font-mono font-normal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GPS Live</span>
                </span>
              )}

              {isWarangal && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold">
                  <span>🥬</span>
                  <span>
                    {language === 'te'
                      ? 'వరంగల్ కూరగాయల ధరలు'
                      : language === 'hi'
                      ? 'वारंगल सब्जी भाव'
                      : 'Warangal Vegetables'}
                  </span>
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {isWarangal
                ? language === 'te'
                  ? `${selectedCity.nameTe} తాజా కూరగాయల హోల్‌సేల్ మార్కెట్`
                  : language === 'hi'
                  ? `${selectedCity.nameHi} ताज़ा सब्ज़ी थोक मंडी भाव`
                  : `${selectedCity.name} Fresh Vegetable Wholesale Rates`
                : language === 'te'
                ? `${selectedCity.nameTe} వ్యవసాయ మార్కెట్ & లైవ్ ధరల నివేదిక`
                : language === 'hi'
                ? `${selectedCity.nameHi} कृषि मंडी एवं लाइव थोक भाव`
                : `${selectedCity.name} APMC Wholesale Market`}
            </h3>

            {/* Sub-description */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
              {isWarangal
                ? 'Laxmipuram Vegetable Market, Hanamkonda Subji Mandi & Enamamula Yard — Daily verified auction rates & Rythu Bazar arrivals.'
                : selectedCity.id === 'hyd'
                ? 'Bowenpally, Malakpet Gunj & Terminal Yards — Daily live auction rates, electronic weighbridges, and physical arrival volumes.'
                : `${marketPhotoInfo.hubTitle} — Daily verified auction rates, regulated trade desks, and arrival volumes.`}
            </p>

            {/* Clean Inline Highlights (Replaces clunky dark boxes) */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-slate-500 font-normal">
                  {isWarangal ? 'Vegetable Yards:' : 'Active Yards:'}
                </span>
                <span className="font-bold text-slate-900">{selectedCity.mandis.length} Mandis</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-slate-500 font-normal">Today's Inflow:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {selectedCity.apmcOverview.dailyArrivalsTotalQuintals.toLocaleString('en-IN')} Q
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-700">
                <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-slate-500 font-normal">Weather:</span>
                <span className="font-bold text-slate-800">
                  {selectedCity.weather.temp}°C • {selectedCity.weather.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Good-Looking Hyderabad / City Market Photo Banner */}
          <div className="shrink-0 w-full lg:w-88 xl:w-96">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md group bg-slate-900">
              <img
                src={marketPhotoInfo.imageUrl}
                alt={`${selectedCity.name} APMC Wholesale Market Yard`}
                className="w-full h-44 sm:h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{selectedCity.name} Wholesale Market</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                  e-NAM Verified
                </span>
              </div>

              {/* Bottom Photo Details */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <p className="text-xs font-bold text-white truncate drop-shadow-sm flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{marketPhotoInfo.badge}</span>
                </p>
                <p className="text-[11px] text-slate-200 truncate mt-0.5 font-normal">
                  {marketPhotoInfo.hubSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE COMMODITY RATES IN THIS CITY */}
      <div className="p-5 sm:p-6">
        {/* Dedicated Notice for Warangal Vegetables Only */}
          {isWarangal && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  🥬
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-emerald-950">
                      {language === 'te'
                        ? 'వరంగల్ కూరగాయల ప్రత్యక్ష ధరలు (Warangal Vegetables Only)'
                        : language === 'hi'
                        ? 'वारंगल हरी सब्जियों के लाइव मंडी भाव (Vegetables Only)'
                        : 'Warangal Vegetables Only (రైతు కూరగాయల మార్కెట్)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      {filteredPrices.length} Varieties
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {language === 'te'
                      ? 'లక్ష్మీపురం హోల్‌సేల్ మార్కెట్, హనుమకొండ సుబ్జీ మండి & ఏనుమాముల తాజా క్వింటాల్ మరియు కిలో ధరలు.'
                      : 'Verified benchmark rates per Quintal & per Kg from Laxmipuram Wholesale Market, Hanamkonda & Enamamula.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterCategory('Vegetable')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    filterCategory === 'Vegetable'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-100/50'
                  }`}
                >
                  🥬 Vegetables Only
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    filterCategory === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Items
                </button>
              </div>
            </div>
          )}

          {/* Category Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Filter Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {isWarangal && cat === 'Vegetable'
                    ? '🥬 Warangal Vegetables'
                    : isWarangal && cat === 'all'
                    ? 'All Warangal Items'
                    : cat}
                </button>
              ))}
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={vegSearchQuery}
                onChange={(e) => setVegSearchQuery(e.target.value)}
                placeholder={isWarangal ? 'Search Warangal vegetables...' : 'Search crop or market...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Crop Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price) => {
              const icon = getCropIcon(price.cropName);
              const perKgPrice = (price.modalPrice / 100).toFixed(1);
              const isVegetable = price.category === 'Vegetable';

              return (
                <div
                  key={price.cropName}
                  className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                    isVegetable
                      ? 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-400'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded">
                          {price.category}
                        </span>
                        {isWarangal && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Warangal
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                        <span className="text-lg">{icon}</span>
                        <span>{price.cropName}</span>
                      </h4>

                      <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5" title={price.primaryMandi}>
                        {price.primaryMandi}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-extrabold text-slate-900">
                        ₹{price.modalPrice.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500">/Q</span>
                      </div>

                      {/* Per-Kg conversion highlight for vegetables */}
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-block mt-0.5">
                        ≈ ₹{perKgPrice}/kg
                      </div>

                      <div
                        className={`text-[11px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                          price.trend === 'increasing'
                            ? 'text-emerald-700'
                            : price.trend === 'decreasing'
                            ? 'text-rose-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {price.trend === 'increasing' && <TrendingUp className="w-3 h-3" />}
                        {price.trend === 'decreasing' && <TrendingDown className="w-3 h-3" />}
                        {price.trend === 'stable' && <Minus className="w-3 h-3" />}
                        <span>
                          {price.changeAmount > 0 ? `+₹${price.changeAmount}` : price.changeAmount < 0 ? `-₹${Math.abs(price.changeAmount)}` : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Range & Volume details */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Daily Wholesale Range</span>
                      <span className="font-semibold text-slate-700">
                        ₹{price.minPrice} – ₹{price.maxPrice}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Daily Arrival</span>
                      <span className="font-semibold text-slate-700">
                        {price.arrivalVolumeQuintals.toLocaleString('en-IN')} Q
                      </span>
                    </div>
                  </div>

                  {/* Action links */}
                  <div className="mt-3">
                    {onSelectCropForMarket && (
                      <button
                        type="button"
                        onClick={() => onSelectCropForMarket(cleanCropName(price.cropName))}
                        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 hover:border-emerald-200"
                        title="Analyze Price Trends & Benchmark Data"
                      >
                        <span>Analyze Price Trend &amp; Mandi Benchmarks</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPrices.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span className="text-3xl block mb-2">🥬</span>
              <p className="text-sm font-semibold text-slate-700">No vegetables found matching "{vegSearchQuery}"</p>
              <button
                type="button"
                onClick={() => setVegSearchQuery('')}
                className="mt-2 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
