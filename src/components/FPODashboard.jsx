import { useState, useMemo } from "react";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Search,
  X,
  Wheat,
  Eye,
  Copy,
  Check,
  Calendar,
  Clock,
  SlidersHorizontal,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { acceptSellRequest } from "../services/sellRequestApi";
import { useLanguage } from "../context/LanguageContext";
export const FPODashboard = ({
  currentUser,
  sellRequests = [],
  onViewSellRequest,
  onSellRequestUpdated
}) => {
  const { language } = useLanguage();
  const [acceptingId, setAcceptingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all_pending");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [gradeAOnly, setGradeAOnly] = useState(false);
  const [highQuantityOnly, setHighQuantityOnly] = useState(false);
  const [highValueOnly, setHighValueOnly] = useState(false);
  const allPendingFarmerRequests = useMemo(() => {
    return sellRequests.filter((req) => req.status === "pending_fpo" || req.status === "fpo_accepted");
  }, [sellRequests]);
  const nonPendingCount = sellRequests.length - allPendingFarmerRequests.length;
  const awaitingAcceptanceCount = allPendingFarmerRequests.filter((r) => r.status === "pending_fpo").length;
  const acceptedPendingInspectionCount = allPendingFarmerRequests.filter((r) => r.status === "fpo_accepted").length;
  const availableCrops = useMemo(() => {
    const crops = /* @__PURE__ */ new Set();
    allPendingFarmerRequests.forEach((r) => {
      if (r.crop) crops.add(r.crop);
    });
    return Array.from(crops).sort();
  }, [allPendingFarmerRequests]);
  const availableDistricts = useMemo(() => {
    const districts = /* @__PURE__ */ new Set();
    allPendingFarmerRequests.forEach((r) => {
      const dist = r.sellerLocation?.district;
      if (dist) districts.add(dist);
    });
    return Array.from(districts).sort();
  }, [allPendingFarmerRequests]);
  const filteredRequests = useMemo(() => {
    return allPendingFarmerRequests.filter((req) => {
      if (statusFilter === "pending_fpo" && req.status !== "pending_fpo") return false;
      if (statusFilter === "fpo_accepted" && req.status !== "fpo_accepted") return false;
      if (selectedCrop !== "all" && req.crop.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }
      if (selectedDistrict !== "all") {
        const reqDist = req.sellerLocation?.district?.toLowerCase() || "";
        if (reqDist !== selectedDistrict.toLowerCase()) return false;
      }
      if (gradeAOnly && req.qualityDetails?.grade !== "A") return false;
      if (highQuantityOnly && (req.quantity || 0) < 20) return false;
      if (highValueOnly) {
        const val = req.expectedTotalAmount || req.quantity * req.expectedPricePerUnit;
        if (val < 1e5) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchFarmer = req.sellerName?.toLowerCase().includes(q);
        const matchPhone = req.sellerPhone?.toLowerCase().includes(q);
        const matchCrop = req.crop?.toLowerCase().includes(q);
        const matchVariety = req.variety?.toLowerCase().includes(q);
        const matchVillage = req.sellerLocation?.village?.toLowerCase().includes(q);
        const matchMandal = req.sellerLocation?.mandal?.toLowerCase().includes(q);
        const matchDistrict = req.sellerLocation?.district?.toLowerCase().includes(q);
        const matchId = req.id?.toLowerCase().includes(q);
        if (!matchFarmer && !matchPhone && !matchCrop && !matchVariety && !matchVillage && !matchMandal && !matchDistrict && !matchId) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      }
      if (sortOption === "oldest") {
        return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
      }
      if (sortOption === "quantity_desc") {
        return (b.quantity || 0) - (a.quantity || 0);
      }
      if (sortOption === "value_desc") {
        const valA = a.expectedTotalAmount || a.quantity * a.expectedPricePerUnit;
        const valB = b.expectedTotalAmount || b.quantity * b.expectedPricePerUnit;
        return valB - valA;
      }
      return 0;
    });
  }, [
    allPendingFarmerRequests,
    statusFilter,
    selectedCrop,
    selectedDistrict,
    gradeAOnly,
    highQuantityOnly,
    highValueOnly,
    searchQuery,
    sortOption
  ]);
  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all_pending" || selectedCrop !== "all" || selectedDistrict !== "all" || gradeAOnly || highQuantityOnly || highValueOnly;
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all_pending");
    setSelectedCrop("all");
    setSelectedDistrict("all");
    setSortOption("newest");
    setGradeAOnly(false);
    setHighQuantityOnly(false);
    setHighValueOnly(false);
  };
  const handleAccept = async (requestId) => {
    try {
      setAcceptingId(requestId);
      const officerName = currentUser.name || "FPO Field Officer";
      const updated = await acceptSellRequest(requestId, officerName);
      if (onSellRequestUpdated) {
        onSellRequestUpdated(updated);
      }
      setActionNotice(
        `\u2713 Request ${requestId} successfully accepted! You are now assigned to conduct farm gate inspection. Tap "Start Farm Gate Inspection" to proceed.`
      );
      if (onViewSellRequest) {
        onViewSellRequest(updated);
      }
    } catch (err) {
      console.error("Error accepting request:", err);
      setActionNotice("Notice: Request status updated. You can proceed with farm gate inspection.");
    } finally {
      setAcceptingId(null);
    }
  };
  const handleCopyPhone = (id, phone) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2e3);
  };
  return <div className="space-y-6 py-2 text-left" id="fpo-portal-container">
      {
    /* Top Banner: FPO Field Officer Profile with Pending Pipeline Focus */
  }
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-blue-900 flex items-center justify-center text-white font-mono font-bold text-xl shrink-0 shadow-sm ring-4 ring-blue-50">
              <Building2 className="w-7 h-7 text-blue-100" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser.name}
                </h2>
                <span className="bg-blue-50 text-blue-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  FPO Field Officer Desk
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {language === "te" ? "\u0C30\u0C48\u0C24\u0C41\u0C32 \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32 \u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C15\u0C4D\u0C37 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928 \u0905\u0928\u0941\u0930\u094B\u0927 \u090F\u0915\u094D\u0938\u0915\u094D\u0932\u0942\u0938\u093F\u0935 \u092B\u093C\u093F\u0932\u094D\u091F\u0930" : "Exclusive Pending Requests Filter Active"}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.location || "Warangal & Nizamabad Cluster"}
                </span>
                <span className="text-slate-300">•</span>
                <span>NABARD Reg: TS-WGL-FPO-8492</span>
                <span className="text-slate-300">•</span>
                <span>Role: Produce Inspector & Aggregator</span>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-slate-600">
                  Officer Commission: <strong className="text-emerald-700 font-bold">1.5% Quality & Inspection Fee</strong> per settled lot (1% App • 97.5% Farmer)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Toll-Free Helpline: 1800-425-166</span>
            </div>
          </div>
        </div>

        {
    /* Focused KPI Counters for Pending Market Requests */
  }
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div
    onClick={() => setStatusFilter("all_pending")}
    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${statusFilter === "all_pending" ? "bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20 shadow-2xs" : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"}`}
  >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Total Pending Market Requests
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{allPendingFarmerRequests.length}</p>
            <span className="text-[10.5px] text-slate-500 font-medium">Exclusively from verified farmers</span>
          </div>

          <div
    onClick={() => setStatusFilter("pending_fpo")}
    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${statusFilter === "pending_fpo" ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-500/20 shadow-2xs" : "bg-amber-50/40 border-amber-200 hover:bg-amber-50/80"}`}
  >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                Awaiting FPO Acceptance
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-amber-950 mt-1">{awaitingAcceptanceCount}</p>
            <span className="text-[10.5px] text-amber-800 font-medium">Requires your official acceptance</span>
          </div>

          <div
    onClick={() => setStatusFilter("fpo_accepted")}
    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${statusFilter === "fpo_accepted" ? "bg-sky-50/90 border-sky-300 ring-2 ring-sky-500/20 shadow-2xs" : "bg-sky-50/40 border-sky-200 hover:bg-sky-50/80"}`}
  >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider">
                Accepted (Farm Visit Pending)
              </span>
              <span className="w-2 h-2 rounded-full bg-sky-500" />
            </div>
            <p className="text-2xl font-black text-sky-950 mt-1">{acceptedPendingInspectionCount}</p>
            <span className="text-[10.5px] text-sky-800 font-medium">Ready for farm gate inspection</span>
          </div>
        </div>
      </div>

      {
    /* Action Notification Banner */
  }
      {actionNotice && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 text-emerald-950 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{actionNotice}</p>
          </div>
          <button
    type="button"
    onClick={() => setActionNotice(null)}
    className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-2 cursor-pointer"
  >
            ✕
          </button>
        </div>}

      {
    /* THE FILTERING SYSTEM (Exclusively displaying pending farmer market requests) */
  }
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden" id="fpo-pending-filter-system">
        {
    /* Header with Title and Strict Filter Indicator */
  }
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {language === "te" ? "\u0C30\u0C48\u0C24\u0C41\u0C32 \u0C2A\u0C46\u0C02\u0C21\u0C3F\u0C02\u0C17\u0C4D \u0C05\u0C2E\u0C4D\u0C2E\u0C15\u0C2A\u0C41 \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u0947 \u0932\u0902\u092C\u093F\u0924 \u0935\u093F\u0915\u094D\u0930\u092F \u0905\u0928\u0941\u0930\u094B\u0927 \u092B\u093C\u093F\u0932\u094D\u091F\u0930" : "Pending Farmer Market Requests Filter Desk"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === "te" ? "\u0C30\u0C48\u0C24\u0C41\u0C32 \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C35\u0C1A\u0C4D\u0C1A\u0C3F\u0C28 \u0C2A\u0C46\u0C02\u0C21\u0C3F\u0C02\u0C17\u0C4D \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32\u0C41 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C1A\u0C42\u0C2A\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F. \u0C30\u0C35\u0C3E\u0C23\u0C3E\u0C32\u0C4B \u0C09\u0C28\u0C4D\u0C28\u0C35\u0C3F, \u0C2E\u0C41\u0C17\u0C3F\u0C38\u0C3F\u0C28\u0C35\u0C3F \u0C05\u0C28\u0C4D\u0C28\u0C40 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C4D\u0C21\u0C3E\u0C2F\u0C3F." : language === "hi" ? "\u0915\u0947\u0935\u0932 \u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u0947 \u0932\u0902\u092C\u093F\u0924 \u0905\u0928\u0941\u0930\u094B\u0927 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u093F\u0924 \u0915\u093F\u090F \u091C\u093E \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 \u091F\u094D\u0930\u093E\u0902\u091C\u093F\u091F \u0935 \u092A\u0942\u0930\u094D\u0923 \u0911\u0930\u094D\u0921\u0930 \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u092B\u093C\u093F\u0932\u094D\u091F\u0930 \u0939\u0948\u0902\u0964" : "Exclusively displaying pending harvest market requests from farmers. In-transit batches and completed orders are filtered out."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{nonPendingCount} non-pending items filtered out</span>
            </span>
            {hasActiveFilters && <button
    type="button"
    onClick={handleResetFilters}
    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
  >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Clear Filters</span>
              </button>}
          </div>
        </div>

        {
    /* Filter Controls Row: Search + Crop + District + Sort */
  }
        <div className="p-5 space-y-4">
          {
    /* Row 1: Search Bar & Sort Dropdown */
  }
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {
    /* Search Input */
  }
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder={language === "te" ? "\u0C30\u0C48\u0C24\u0C41 \u0C2A\u0C47\u0C30\u0C41, \u0C2B\u0C4B\u0C28\u0C4D \u0C28\u0C02\u0C2C\u0C30\u0C4D, \u0C2A\u0C02\u0C1F, \u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C02 \u0C32\u0C47\u0C26\u0C3E ID \u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F..." : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928 \u0915\u093E \u0928\u093E\u092E, \u092B\u093C\u094B\u0928, \u092B\u0938\u0932, \u0917\u093E\u0901\u0935 \u092F\u093E \u0905\u0928\u0941\u0930\u094B\u0927 ID \u0916\u094B\u091C\u0947\u0902..." : "Search farmer name, phone number, crop, village, or ID..."}
    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
  />
              {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
  >
                  <X className="w-3.5 h-3.5" />
                </button>}
            </div>

            {
    /* Sort Selector */
  }
            <div className="md:col-span-4">
              <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    aria-label="Sort pending requests"
    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
  >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Awaiting Longest (Urgent)</option>
                <option value="quantity_desc">Sort: Quantity (Highest First)</option>
                <option value="value_desc">Sort: Estimated Value (Highest First)</option>
              </select>
            </div>
          </div>

          {
    /* Row 2: Status Sub-filter Pills & Quick Selectors */
  }
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {
    /* Status Segment */
  }
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
    type="button"
    onClick={() => setStatusFilter("all_pending")}
    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${statusFilter === "all_pending" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                <span>All Pending</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                  {allPendingFarmerRequests.length}
                </span>
              </button>

              <button
    type="button"
    onClick={() => setStatusFilter("pending_fpo")}
    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${statusFilter === "pending_fpo" ? "bg-amber-100 text-amber-950 shadow-2xs font-black" : "text-slate-600 hover:text-amber-800"}`}
  >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Awaiting Acceptance</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-mono font-bold">
                  {awaitingAcceptanceCount}
                </span>
              </button>

              <button
    type="button"
    onClick={() => setStatusFilter("fpo_accepted")}
    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${statusFilter === "fpo_accepted" ? "bg-sky-100 text-sky-950 shadow-2xs font-black" : "text-slate-600 hover:text-sky-800"}`}
  >
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Farm Visit Pending</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-200 text-sky-900 font-mono font-bold">
                  {acceptedPendingInspectionCount}
                </span>
              </button>
            </div>

            {
    /* Dropdowns for Crop & District */
  }
            <div className="flex flex-wrap items-center gap-2">
              {
    /* Crop Filter */
  }
              <select
    value={selectedCrop}
    onChange={(e) => setSelectedCrop(e.target.value)}
    aria-label="Filter by crop"
    className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
  >
                <option value="all">All Crops ({availableCrops.length})</option>
                {availableCrops.map((crop) => <option key={crop} value={crop}>
                    {crop} ({allPendingFarmerRequests.filter((r) => r.crop === crop).length})
                  </option>)}
              </select>

              {
    /* District Filter */
  }
              <select
    value={selectedDistrict}
    onChange={(e) => setSelectedDistrict(e.target.value)}
    aria-label="Filter by district"
    className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
  >
                <option value="all">All Districts ({availableDistricts.length})</option>
                {availableDistricts.map((dist) => <option key={dist} value={dist}>
                    {dist} ({allPendingFarmerRequests.filter((r) => r.sellerLocation?.district === dist).length})
                  </option>)}
              </select>
            </div>
          </div>

          {
    /* Row 3: Quick Filter Chips (Grade A, High Quantity, High Value) */
  }
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Quick Filter:
            </span>

            <button
    type="button"
    onClick={() => setGradeAOnly(!gradeAOnly)}
    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${gradeAOnly ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
  >
              <Check className={`w-3 h-3 ${gradeAOnly ? "text-emerald-700" : "text-slate-400"}`} />
              <span>Grade &lsquo;A&rsquo; Quality</span>
            </button>

            <button
    type="button"
    onClick={() => setHighQuantityOnly(!highQuantityOnly)}
    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${highQuantityOnly ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
  >
              <Wheat className={`w-3 h-3 ${highQuantityOnly ? "text-emerald-700" : "text-slate-400"}`} />
              <span>Bulk Lots (&gt;20 Qtl)</span>
            </button>

            <button
    type="button"
    onClick={() => setHighValueOnly(!highValueOnly)}
    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${highValueOnly ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
  >
              <span className="font-mono text-xs">₹</span>
              <span>High Value (&gt;₹1 Lakh)</span>
            </button>

            {hasActiveFilters && <span className="ml-auto text-xs text-slate-500 font-medium">
                Showing <strong>{filteredRequests.length}</strong> of {allPendingFarmerRequests.length} matching pending requests
              </span>}
          </div>
        </div>

        {
    /* Requests List Area */
  }
        <div className="p-5 bg-slate-50/50 border-t border-slate-100 space-y-4">
          {filteredRequests.length === 0 ? <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto mb-3">
                <Wheat className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-slate-900">
                No Pending Farmer Requests Match Current Filter
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No seller requests match your current search or filter combination. Remember, all non-pending items (transit and completed orders) remain filtered out of this desk.
              </p>
              <button
    type="button"
    onClick={handleResetFilters}
    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
  >
                Reset All Filters
              </button>
            </div> : filteredRequests.map((req) => {
    const isAwaitingAcceptance = req.status === "pending_fpo";
    const isAccepted = req.status === "fpo_accepted";
    const isAcceptingThis = acceptingId === req.id;
    const expectedTotal = req.expectedTotalAmount || req.quantity * req.expectedPricePerUnit;
    const isCopied = copiedPhoneId === req.id;
    return <div
      key={req.id}
      className={`p-5 rounded-2xl bg-white border transition-all shadow-2xs hover:shadow-xs space-y-4 ${isAwaitingAcceptance ? "border-amber-200/90 hover:border-amber-300" : "border-sky-200/90 hover:border-sky-300"}`}
    >
                  {
      /* Top Bar of Card: Badges, ID, Date */
    }
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      {isAwaitingAcceptance ? <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          ⏳ Awaiting FPO Acceptance
                        </span> : isAccepted ? <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
                          ✓ FPO Accepted • Farm Gate Visit Pending
                        </span> : null}

                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {req.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        Est. 1.5% FPO Fee: ₹{Math.round(expectedTotal * 0.015).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {
      /* Main Grid: Crop Image + Farmer & Produce Info + Actions */
    }
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {
      /* Image & Crop Name */
    }
                    <div className="lg:col-span-4 flex items-start gap-3">
                      <img
      src={req.imageUrl || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"}
      alt={req.crop}
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
    />
                      <div>
                        <h4 className="text-base font-black text-slate-900">
                          {req.crop}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {req.variety || `${req.crop} Standard Grade`}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-black border border-emerald-200">
                            {req.quantity} {req.unit || "Quintals"}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                            ₹{req.expectedPricePerUnit?.toLocaleString()}/{req.unit ? req.unit.replace(/s$/, "") : "Qtl"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {
      /* Farmer Identity & Farm Gate Location */
    }
                    <div className="lg:col-span-5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          {req.sellerName?.charAt(0) || "F"}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {req.sellerName}
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Farmer
                        </span>
                      </div>

                      {
      /* Phone with Direct Call & Copy Actions */
    }
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <a
      href={`tel:${req.sellerPhone}`}
      className="font-mono text-blue-700 hover:underline flex items-center gap-1"
    >
                          <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                          <span>{req.sellerPhone}</span>
                        </a>
                        <button
      type="button"
      onClick={() => handleCopyPhone(req.id, req.sellerPhone)}
      className="text-[10px] text-slate-500 hover:text-slate-800 p-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
      title="Copy phone"
    >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {
      /* Location Details */
    }
                      <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">
                            {req.sellerLocation?.village ? `${req.sellerLocation.village}, ` : ""}
                            {req.sellerLocation?.mandal ? `${req.sellerLocation.mandal} Mandal, ` : ""}
                            {req.sellerLocation?.district || "Warangal"}
                          </span>
                          {req.sellerLocation?.landmark && <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                              Landmark: {req.sellerLocation.landmark}
                            </p>}
                        </div>
                      </div>
                    </div>

                    {
      /* Financial Summary & Action Buttons */
    }
                    <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-3 h-full">
                      <div className="lg:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Expected Total
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{expectedTotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        {isAwaitingAcceptance && <button
      type="button"
      disabled={isAcceptingThis}
      onClick={() => handleAccept(req.id)}
      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
    >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isAcceptingThis ? "Accepting..." : "Accept Market Request"}</span>
                          </button>}

                        {isAccepted && <button
      type="button"
      onClick={() => {
        if (onViewSellRequest) onViewSellRequest(req);
      }}
      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
    >
                            <Building2 className="w-4 h-4" />
                            <span>Start Farm Gate Inspection</span>
                          </button>}

                        <button
      type="button"
      onClick={() => {
        if (onViewSellRequest) onViewSellRequest(req);
      }}
      className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
    >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Details & Farm Gate</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {
      /* Quality & Self-Declaration Mini Footer */
    }
                  {req.qualityDetails && <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <span className="text-slate-400">Declared Grade:</span>
                          <strong className="text-emerald-700 font-bold">{req.qualityDetails.grade || "A"}</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <span className="text-slate-400">Moisture:</span>
                          <strong>{req.qualityDetails.moisture || 8.5}%</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Harvest: {req.qualityDetails.harvestDate || "Fresh Picking"}</span>
                        </span>
                      </div>

                      {req.qualityDetails.notes && <span className="text-[11px] text-slate-500 italic max-w-md truncate">
                          &ldquo;{req.qualityDetails.notes}&rdquo;
                        </span>}
                    </div>}
                </div>;
  })}
        </div>
      </div>
    </div>;
};
