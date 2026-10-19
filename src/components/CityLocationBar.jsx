import { useState } from "react";
import { useLocation } from "../context/LocationContext";
import { useLanguage } from "../context/LanguageContext";
import {
  MapPin,
  Compass,
  Navigation,
  CheckCircle2,
  ChevronDown,
  Building2,
  CloudSun,
  Sparkles,
  Info,
  Layers,
  Globe2
} from "lucide-react";
export const CityLocationBar = ({
  onToggleDetails,
  showDetails = true
}) => {
  const {
    selectedCity,
    selectedCityId,
    selectCity,
    geolocationStatus,
    requestLocationAccess,
    detectedCoords,
    detectedDistanceKm,
    isGpsActive,
    statusMessage,
    allCities
  } = useLocation();
  const { language } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const telanganaCities = allCities.filter((c) => c.region === "Telangana");
  const apCities = allCities.filter((c) => c.region === "Andhra Pradesh");
  const southCities = allCities.filter((c) => c.region === "South India");
  const westCities = allCities.filter((c) => c.region === "Western India");
  const northEastCities = allCities.filter(
    (c) => c.region === "North India" || c.region === "East India"
  );
  const quickCities = ["hyd", "warangal", "nizamabad", "guntur", "bengaluru", "mumbai", "delhi"];
  const getCityLocalizedName = (city) => {
    if (language === "te") return city.nameTe;
    if (language === "hi") return city.nameHi;
    return city.name;
  };
  return <div
    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 mb-6 relative overflow-hidden transition-all"
    id="city-location-bar"
  >
      {
    /* Subtle top indicator bar */
  }
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {
    /* Left: Location indicator & status */
  }
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shadow-2xs">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            {isGpsActive && <span
    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"
    title="GPS Active"
  />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                {isGpsActive ? <>
                    <Navigation className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: "4s" }} />
                    <span>
                      {language === "te" ? "\u0C1C\u0C40\u0C2A\u0C40\u0C0E\u0C38\u0C4D \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D" : language === "hi" ? "\u091C\u0940\u092A\u0940\u090F\u0938 \u0926\u094D\u0935\u093E\u0930\u093E \u092A\u0939\u091A\u093E\u0928\u0940 \u0917\u0908 \u092E\u0902\u0921\u0940" : "GPS Detected Location"}
                    </span>
                  </> : selectedCityId === "hyd" ? <>
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>
                      {language === "te" ? "\u0C21\u0C3F\u0C2B\u0C3E\u0C32\u0C4D\u0C1F\u0C4D \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D: \u0C39\u0C48\u0C26\u0C30\u0C3E\u0C2C\u0C3E\u0C26\u0C4D" : language === "hi" ? "\u0921\u093F\u092B\u093C\u0949\u0932\u094D\u091F \u092E\u0902\u0921\u0940: \u0939\u0948\u0926\u0930\u093E\u092C\u093E\u0926" : "Default Market: Hyderabad"}
                    </span>
                  </> : selectedCityId === "warangal" ? <>
                    <span>🥬</span>
                    <span>
                      {language === "te" ? "\u0C35\u0C30\u0C02\u0C17\u0C32\u0C4D \u0C15\u0C42\u0C30\u0C17\u0C3E\u0C2F\u0C32 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D" : language === "hi" ? "\u0935\u093E\u0930\u0902\u0917\u0932 \u0938\u092C\u094D\u091C\u0940 \u092E\u0902\u0921\u0940" : "Warangal Vegetables"}
                    </span>
                  </> : <>
                    <Building2 className="w-3 h-3 text-emerald-600" />
                    <span>
                      {language === "te" ? "\u0C0E\u0C02\u0C2A\u0C3F\u0C15 \u0C1A\u0C47\u0C38\u0C3F\u0C28 \u0C28\u0C17\u0C30 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D" : language === "hi" ? "\u091A\u092F\u0928\u093F\u0924 \u0936\u0939\u0930 \u092E\u0902\u0921\u0940" : "Selected Market"}
                    </span>
                  </>}
              </span>

              {selectedCityId === "warangal" && <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span>🥬 Vegetables Only</span>
                </span>}

              {selectedCity.isDefault && <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold px-1.5 py-0.5 rounded">
                  {language === "te" ? "\u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02" : language === "hi" ? "\u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0915\u0947\u0902\u0926\u094D\u0930" : "Primary Hub"}
                </span>}

              <span className="text-xs text-slate-500 font-medium">
                {selectedCity.apmcOverview.totalActiveMandis}{" "}
                {language === "te" ? "\u0C2F\u0C3E\u0C15\u0C4D\u0C1F\u0C3F\u0C35\u0C4D \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D\u0C32\u0C41" : language === "hi" ? "\u0938\u0915\u094D\u0930\u093F\u092F \u092E\u0902\u0921\u093F\u092F\u093E\u0902" : "Active Mandis"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{getCityLocalizedName(selectedCity)}</span>
                <span className="text-sm font-semibold text-slate-400 font-mono">
                  ({selectedCity.shortCode})
                </span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {selectedCity.state}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-slate-700">
                {selectedCity.apmcOverview.primaryHubName}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">
                ~{selectedCity.apmcOverview.dailyArrivalsTotalQuintals.toLocaleString("en-IN")}{" "}
                {language === "te" ? "\u0C15\u0C4D\u0C35\u0C3F\u0C02\u0C1F\u0C3E\u0C33\u0C4D\u0C32 \u0C30\u0C3E\u0C2C\u0C21\u0C3F" : language === "hi" ? "\u0915\u094D\u0935\u093F\u0902\u091F\u0932 \u0906\u0935\u0915" : "Q Arrivals Today"}
              </span>
              {selectedCity.distanceFromHydKm > 0 && <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">
                    {selectedCity.distanceFromHydKm} km from Hyderabad
                  </span>
                </>}
            </p>
          </div>
        </div>

        {
    /* Right: GPS Access Button + City Selection Dropdown */
  }
        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          {
    /* 1. GPS Location Access Button */
  }
          <button
    type="button"
    onClick={requestLocationAccess}
    disabled={geolocationStatus === "detecting"}
    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs border active:scale-95 ${isGpsActive ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700" : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80"}`}
    id="btn-detect-gps-location"
    title="Access current device location to show nearest agricultural mandi"
  >
            {geolocationStatus === "detecting" ? <>
                <Navigation className="w-4 h-4 animate-spin text-emerald-700" />
                <span>{language === "te" ? "\u0C1C\u0C40\u0C2A\u0C40\u0C0E\u0C38\u0C4D \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C38\u0C4D\u0C24\u0C4B\u0C02\u0C26\u0C3F..." : language === "hi" ? "\u091C\u0940\u092A\u0940\u090F\u0938 \u0938\u0947 \u0916\u094B\u091C \u0930\u0939\u0947 \u0939\u0948\u0902..." : "Detecting GPS..."}</span>
              </> : isGpsActive ? <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{language === "te" ? "\u0C1C\u0C40\u0C2A\u0C40\u0C0E\u0C38\u0C4D \u0C2F\u0C3E\u0C15\u0C4D\u0C38\u0C46\u0C38\u0C4D \u0C05\u0C2F\u0C3F\u0C02\u0C26\u0C3F" : language === "hi" ? "\u091C\u0940\u092A\u0940\u090F\u0938 \u0938\u0915\u094D\u0930\u093F\u092F \u0939\u0948" : "GPS Location Active"}</span>
              </> : <>
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>{language === "te" ? "\u0C28\u0C3E \u0C38\u0C4D\u0C25\u0C3E\u0C28\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C41 (GPS)" : language === "hi" ? "\u092E\u0947\u0930\u093E \u0938\u094D\u0925\u093E\u0928 \u0916\u094B\u091C\u0947\u0902 (GPS)" : "Use My Location"}</span>
              </>}
          </button>

          {
    /* 2. City Dropdown Selector ("select option of all cities") */
  }
          <div className="relative">
            <div className="relative">
              <select
    value={selectedCityId}
    onChange={(e) => selectCity(e.target.value)}
    className="appearance-none pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-100/90 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-2xs"
    id="select-market-city"
    aria-label="Select City / Market Yard"
  >
                <optgroup label="🌟 Telangana Markets">
                  {telanganaCities.map((city) => <option key={city.id} value={city.id}>
                      {city.name} {city.id === "hyd" ? "(Default - Central Hub)" : ""} ({city.state})
                    </option>)}
                </optgroup>

                <optgroup label="🌾 Andhra Pradesh Markets">
                  {apCities.map((city) => <option key={city.id} value={city.id}>
                      {city.name} ({city.state})
                    </option>)}
                </optgroup>

                <optgroup label="🚛 South India Hubs">
                  {southCities.map((city) => <option key={city.id} value={city.id}>
                      {city.name} ({city.state})
                    </option>)}
                </optgroup>

                <optgroup label="🏢 Western India Markets">
                  {westCities.map((city) => <option key={city.id} value={city.id}>
                      {city.name} ({city.state})
                    </option>)}
                </optgroup>

                <optgroup label="🏛️ North & East Hubs">
                  {northEastCities.map((city) => <option key={city.id} value={city.id}>
                      {city.name} ({city.state})
                    </option>)}
                </optgroup>
              </select>

              <Globe2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {
    /* 3. Details Toggle Button */
  }
          {onToggleDetails && <button
    type="button"
    onClick={onToggleDetails}
    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${showDetails ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
    id="btn-toggle-city-market-details"
  >
              <Layers className="w-3.5 h-3.5" />
              <span>{showDetails ? "Hide City Mandis" : "View City Mandis"}</span>
            </button>}
        </div>
      </div>

      {
    /* Quick City Pills for 1-Click Access */
  }
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <span>{language === "te" ? "\u0C24\u0C4D\u0C35\u0C30\u0C3F\u0C24 \u0C28\u0C17\u0C30\u0C3E\u0C32\u0C41:" : language === "hi" ? "\u0924\u094D\u0935\u0930\u093F\u0924 \u0936\u0939\u0930:" : "Quick Hubs:"}</span>
        </span>

        {quickCities.map((cId) => {
    const c = allCities.find((item) => item.id === cId);
    if (!c) return null;
    const isCurrent = c.id === selectedCityId;
    return <button
      key={c.id}
      type="button"
      onClick={() => selectCity(c.id)}
      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${isCurrent ? "bg-emerald-700 text-white shadow-2xs ring-1 ring-emerald-700" : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900"}`}
      id={`quick-city-${c.id}`}
    >
              {c.id === "hyd" && <span className="text-[10px]">⭐</span>}
              {c.id === "warangal" && <span className="text-[10px]">🥬</span>}
              <span>{c.name}</span>
              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />}
            </button>;
  })}

        {
    /* View weather and transit conditions */
  }
        <div className="ml-auto hidden md:flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
          <CloudSun className="w-3.5 h-3.5 text-amber-500" />
          <span>{selectedCity.weather.temp}°C {selectedCity.weather.condition}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 truncate max-w-[200px]" title={selectedCity.weather.roadCondition}>
            {selectedCity.weather.roadCondition}
          </span>
        </div>
      </div>

      {
    /* Optional feedback banner when statusMessage exists */
  }
      {statusMessage && <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          {isGpsActive && detectedDistanceKm !== null && <span className="font-mono text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
              ±{detectedDistanceKm} km
            </span>}
        </div>}
    </div>;
};
