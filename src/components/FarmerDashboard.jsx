import { useState, useRef, useEffect } from "react";
import { CROPS_DATA } from "../data/mockData";
import { CropSupplyDemandTrends } from "./CropSupplyDemandTrends";
import { SellRequestsSection } from "./SellRequestsSection";
import { CityMarketDetailsCard } from "./CityMarketDetailsCard";
import {
  Plus,
  Wheat,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Truck,
  Building2,
  AlertTriangle,
  Sparkles,
  Camera,
  CheckCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  Lock,
  RefreshCw,
  RotateCcw,
  Check,
  BarChart2,
  UserX,
  Search
} from "lucide-react";
import { CloudSyncIndicator } from "./CloudSyncIndicator";
export const FarmerDashboard = ({
  currentUser,
  lots,
  offers,
  orders,
  onCreateLot,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
  onAdvanceOrder,
  onRaiseDispute,
  onUpdateBankDetails,
  onOpenTransport,
  onOpenStorage,
  onViewBlockchainBlock,
  onOpenCropScanner,
  onOpenSellProduce,
  onSellProduct,
  sellRequests = [],
  onViewSellRequest,
  mandiPrices = [],
  marketRequiredVegetables = [],
  lastSyncedAt,
  isSyncing,
  onSync,
  onNavigateToMarkets,
  onSwitchToMarket
}) => {
  const [activeTab, setActiveTab] = useState("sell_requests");
  const [showCreateLotModal, setShowCreateLotModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [counterInput, setCounterInput] = useState({});
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const handleSellMarketProduce = (req) => {
    if (onSellProduct) {
      onSellProduct({
        cropName: req.cropName,
        variety: req.variety,
        price: req.offeredPricePerQuintal,
        unit: "Quintals",
        mandiName: req.mandiName,
        imageUrl: req.image,
        quantity: req.requiredQuantityQuintals,
        grade: req.targetGrade?.includes("B") ? "B" : req.targetGrade?.includes("C") ? "C" : "A"
      });
    } else if (onOpenSellProduce) {
      onOpenSellProduce();
    }
  };
  const [crop, setCrop] = useState("Cotton");
  const [variety, setVariety] = useState("BT-II Long Staple");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("Quintals");
  const [grade, setGrade] = useState("A");
  const [moisture, setMoisture] = useState("8.5");
  const [expectedPrice, setExpectedPrice] = useState("7200");
  const [location, setLocation] = useState("Warangal District, Telangana");
  const [imagePreview, setImagePreview] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [cameraError, setCameraError] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isPredictingQuality, setIsPredictingQuality] = useState(false);
  const [predictionStep, setPredictionStep] = useState("Gemini Vision AI: Initializing optical inspection...");
  const [aiScanResult, setAiScanResult] = useState(null);
  const [lotSubmitError, setLotSubmitError] = useState(null);
  const [disputeOrderId, setDisputeOrderId] = useState(orders[0]?.id || "ORD-9841");
  const [disputeType, setDisputeType] = useState("Price");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [bankForm, setBankForm] = useState(
    currentUser.bankDetails || {
      bankName: "State Bank of India",
      accountNumber: "30492817456",
      ifscCode: "SBIN0001234",
      accountHolderName: currentUser.name || "Verified Farmer",
      upiId: `${currentUser.email?.split("@")[0] || currentUser.name.toLowerCase().replace(/\s+/g, "")}@oksbi`,
      paytmNumber: currentUser.phone?.replace(/[^0-9]/g, "") || "9848023456"
    }
  );
  useEffect(() => {
    if (!showCreateLotModal) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setCameraError(null);
    }
  }, [showCreateLotModal]);
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  const startCamera = async (facing = cameraFacingMode) => {
    setCameraError(null);
    setIsCameraLoading(true);
    setIsCameraActive(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera API error:", err);
      let msg = "Unable to access camera. You can upload a crop photo instead.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Camera permission was denied. Please allow camera permissions in browser settings or upload a photo.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No camera device detected on this system. You can upload a photo instead.";
      }
      setCameraError(msg);
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsCameraLoading(false);
    setCameraError(null);
  };
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(nextFacing);
    startCamera(nextFacing);
  };
  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    let width = video.videoWidth || 640;
    let height = video.videoHeight || 480;
    const maxDim = 800;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round(height * maxDim / width);
        width = maxDim;
      } else {
        width = Math.round(width * maxDim / height);
        height = maxDim;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    setImagePreview(dataUrl);
    stopCamera();
    setLotSubmitError(null);
    evaluateCropQuality(dataUrl, crop);
  };
  const generateSimulatedQuality = (cropName) => {
    const norm = (cropName || "Cotton").toLowerCase();
    if (norm.includes("paddy") || norm.includes("rice")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Paddy Rice (Fine Grain Sona Masoori)",
        estimatedGrade: "Grade A (Superior)",
        gradeLetter: "A",
        score: 94,
        confidence: 96,
        moisturePercent: 12.4,
        defectPercent: 0.9,
        colorScore: "Lustrous Golden Yellow / Clean Husk",
        potentialGain: "+\u20B9180/Quintal above modal benchmark",
        advice: "Kernel moisture is at 12.4%, safely below the 14% milling threshold. High head rice recovery potential with negligible foreign chaff."
      };
    }
    if (norm.includes("turmeric")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Turmeric (Finger Variety)",
        estimatedGrade: "Grade A (Export Grade)",
        gradeLetter: "A",
        score: 96,
        confidence: 97,
        moisturePercent: 9.1,
        defectPercent: 0.8,
        colorScore: "Deep Saffron Orange (Curcumin > 4.5%)",
        potentialGain: "+\u20B9420/Quintal premium",
        advice: "High curcumin concentration evident from deep saffron core. Solid finger density with low moisture makes it ideal for institutional buyers and spice exporters."
      };
    }
    if (norm.includes("chilli")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Red Chilli (Guntur Teja)",
        estimatedGrade: "Grade A (Superior)",
        gradeLetter: "A",
        score: 93,
        confidence: 95,
        moisturePercent: 10.2,
        defectPercent: 1.5,
        colorScore: "High ASTA Uniform Crimson Red",
        potentialGain: "+\u20B9350/Quintal premium",
        advice: "Consistent bright crimson pod coloration with intact stems and zero discoloration. High pungency rating indicated by thick pod walls."
      };
    }
    if (norm.includes("maize") || norm.includes("corn")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Yellow Maize (Dent Hybrid)",
        estimatedGrade: "Grade A (Commercial)",
        gradeLetter: "A",
        score: 92,
        confidence: 94,
        moisturePercent: 11.5,
        defectPercent: 1.3,
        colorScore: "Bright Yellow / Low Aflatoxin Risk",
        potentialGain: "+\u20B9120/Quintal starch premium",
        advice: "Firm kernels with low mechanical breakage. Moisture at 11.5% meets safe warehousing criteria with low foreign organic debris."
      };
    }
    if (norm.includes("wheat")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Amber Durum Wheat",
        estimatedGrade: "Grade A (Superior)",
        gradeLetter: "A",
        score: 95,
        confidence: 96,
        moisturePercent: 10.8,
        defectPercent: 1,
        colorScore: "Golden Amber / Vitreous Grain",
        potentialGain: "+\u20B9160/Quintal flour mill premium",
        advice: "High test weight with vitreous grain consistency. Excellent baking and milling quality with low shriveled grain count."
      };
    }
    if (norm.includes("tomato")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Fresh Hybrid Tomato",
        estimatedGrade: "Grade A (Fresh Produce)",
        gradeLetter: "A",
        score: 91,
        confidence: 93,
        moisturePercent: 88.5,
        defectPercent: 1.8,
        colorScore: "Firm Uniform Red / Breaker Stage",
        potentialGain: "+\u20B94/Kg over wholesale",
        advice: "Optimal skin elasticity and firm pericarp. Suitable for long-distance transport without mechanical bruising or skin rupture."
      };
    }
    if (norm.includes("onion")) {
      return {
        isAuthenticCrop: true,
        detectedSubject: "Red Nasik Onion",
        estimatedGrade: "Grade A (Superior)",
        gradeLetter: "A",
        score: 93,
        confidence: 95,
        moisturePercent: 11.2,
        defectPercent: 1.4,
        colorScore: "Deep Pink/Red / Double Membrane Skin",
        potentialGain: "+\u20B9250/Quintal export grade",
        advice: "Strong tight outer dry skin layers protecting bulbs from transit decay. Bulb diameter between 45-60mm matches top institutional specifications."
      };
    }
    return {
      isAuthenticCrop: true,
      detectedSubject: `${cropName || "Cotton"} (Long Staple Cluster)`,
      estimatedGrade: "Grade A (Superior)",
      gradeLetter: "A",
      score: 95,
      confidence: 96,
      moisturePercent: 8.2,
      defectPercent: 1.2,
      colorScore: "High Lustrous Natural White",
      potentialGain: "+\u20B9220/Quintal above MSP",
      advice: "Excellent staple uniformity with negligible leaf trash or seed coat fragments. Moisture is at 8.2%, preventing storage heating and yellowing."
    };
  };
  const evaluateCropQuality = async (base64, currentCrop) => {
    setIsPredictingQuality(true);
    setPredictionStep("Optical Scanner: Initializing produce inspection...");
    setAiScanResult(null);
    setLotSubmitError(null);
    const timer1 = setTimeout(() => {
      setPredictionStep("Verifying produce sample authenticity...");
    }, 400);
    const timer2 = setTimeout(() => {
      setPredictionStep("Analyzing grain/crop surface purity and moisture...");
    }, 900);
    const timer3 = setTimeout(() => {
      setPredictionStep("Computing AGMARK grade, moisture & market valuation...");
    }, 1400);
    try {
      const fetchPromise = fetch("/api/ai/quality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          cropType: currentCrop
        })
      }).then((r) => r.json()).catch((err) => {
        console.warn("AI quality fetch error:", err);
        return null;
      });
      const [backendData] = await Promise.all([
        fetchPromise,
        new Promise((resolve) => setTimeout(resolve, 1400))
      ]);
      if (backendData && backendData.isAuthenticCrop === false) {
        const rejectionResult = {
          isAuthenticCrop: false,
          isFaceOrPerson: backendData.isFaceOrPerson ?? true,
          detectedCategory: backendData.detectedCategory || "human_face",
          detectedSubject: backendData.detectedSubject || "Human Face / Selfie",
          rejectionReason: backendData.rejectionReason || "A human face was detected in the camera frame instead of agricultural produce. The KisanSetu quality scanner only inspects harvested crops, grains, pulses, vegetables, and fruits.",
          estimatedGrade: "REJECTED - Non-Crop",
          gradeLetter: "REJECTED",
          moisturePercent: null,
          defectPercent: null,
          colorScore: "N/A",
          score: 0,
          confidence: backendData.confidence || 99,
          potentialGain: null,
          advice: backendData.advice || "Please point your camera directly at your harvested crop lot or vegetables under good natural lighting to inspect quality, moisture, and AGMARK grade.",
          isDeclaredCropMatched: false
        };
        setAiScanResult(rejectionResult);
      } else if (backendData && backendData.isAuthenticCrop === true) {
        setAiScanResult(backendData);
        if (backendData.estimatedGrade?.includes("Grade A") || backendData.gradeLetter === "A") {
          setGrade("A");
        } else if (backendData.estimatedGrade?.includes("Grade B") || backendData.gradeLetter === "B") {
          setGrade("B");
        } else if (backendData.estimatedGrade?.includes("Grade C") || backendData.gradeLetter === "C") {
          setGrade("C");
        }
        if (backendData.moisturePercent) {
          setMoisture(backendData.moisturePercent.toString());
        }
      } else {
        setAiScanResult({
          isAuthenticCrop: false,
          isScanError: true,
          detectedSubject: "Visual Inspection Inconclusive",
          rejectionReason: "Unable to definitively verify agricultural produce. Please ensure steady lighting and point the camera directly at your crop lot.",
          advice: "Hold the camera 1-2 feet above the harvested produce in good lighting, avoiding faces, hands, or room backgrounds.",
          confidence: 0
        });
      }
    } catch (err) {
      console.warn("Quality check error:", err);
      setAiScanResult({
        isAuthenticCrop: false,
        isScanError: true,
        detectedSubject: "Visual Inspection Inconclusive",
        rejectionReason: "Could not verify agricultural produce. Please take a clear close-up of your harvested crop.",
        advice: "Place camera 1-2 feet above crop with good lighting, avoiding faces, hands, or room background.",
        confidence: 0
      });
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsPredictingQuality(false);
    }
  };
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      setImagePreview(base64);
      stopCamera();
      setLotSubmitError(null);
      evaluateCropQuality(base64, crop);
    };
    reader.readAsDataURL(file);
  };
  const handleCreateLotSubmit = (e) => {
    e.preventDefault();
    if (aiScanResult && !aiScanResult.isAuthenticCrop) {
      setLotSubmitError(
        aiScanResult.isFaceOrPerson ? "Cannot publish lot: A human face / selfie was detected instead of agricultural produce. Please retake or upload a clear photo of your harvested crop." : "Cannot publish lot: A non-crop object was detected. Please retake or upload a clear photo of your agricultural produce."
      );
      return;
    }
    const qtyVal = Number(quantity);
    const isUnder100kg = unit === "Kg" && qtyVal <= 100 || unit === "Quintals" && qtyVal <= 1;
    if (isUnder100kg) {
      setLotSubmitError(
        `Minimum Bulk Lot Requirement: Mandi bulk trading and direct buyer settlement requires more than 100 kg (> 100 kg or > 1.0 Quintal). Current quantity is ${qtyVal} ${unit}. Please increase above 100 kg to list for direct sale.`
      );
      return;
    }
    setLotSubmitError(null);
    onCreateLot({
      crop,
      variety,
      quantity: Number(quantity),
      unit,
      grade,
      moisture: Number(moisture),
      expectedPrice: Number(expectedPrice),
      location,
      imageUrl: imagePreview || "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80",
      status: "available",
      bankDetails: currentUser.bankDetails
    });
    setShowCreateLotModal(false);
    setImagePreview(null);
    setAiScanResult(null);
    setLotSubmitError(null);
  };
  const activeOffersCount = offers.filter((o) => o.status === "pending").length;
  return <div className="space-y-6 py-2 text-left">
      {
    /* Top Banner: Farmer Profile & Key Metrics */
  }
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xl shrink-0">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  {currentUser.name}
                </h2>
                <span className="bg-slate-100 text-slate-800 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Farmer (రైతు)
                </span>
                <CloudSyncIndicator
    variant="compact"
    lastSyncedAt={lastSyncedAt}
    isSyncing={isSyncing}
    onSync={onSync}
  />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentUser.location} • Phone: {currentUser.phone}
              </p>
              <div className="flex items-center gap-2.5 mt-1.5 text-xs text-slate-600 font-mono text-[11px]">
                <span>Bank: <strong className="text-slate-900 font-sans">{currentUser.bankDetails?.bankName || "SBI"}</strong></span>
                <span>•</span>
                <span>UPI: <strong className="text-slate-900">{currentUser.bankDetails?.upiId || "Linked"}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onSwitchToMarket && <button
    type="button"
    onClick={onSwitchToMarket}
    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
    title="Switch to APMC Market Admin Portal to Manage Vegetable Rates"
    id="farmer-header-switch-to-market-btn"
  >
                <Building2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Switch to Market</span>
              </button>}

            <button
    onClick={() => setShowCreateLotModal(true)}
    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Crop Lot</span>
            </button>

            <button
    onClick={() => setShowBankModal(true)}
    className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
  >
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Bank & Settlement</span>
            </button>

            <button
    onClick={() => setShowDisputeModal(true)}
    className="px-3 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
  >
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Raise Dispute</span>
            </button>
          </div>
        </div>

        {
    /* Dashboard Metric Cards */
  }
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-100 text-left">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
            <span className="text-[11px] text-slate-600 font-medium">Cotton Market Price</span>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">₹7,400</p>
            <span className="text-[10px] text-slate-500">Warangal APMC</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
            <span className="text-[11px] text-slate-600 font-medium">Est. Net Value</span>
            <p className="text-base font-bold font-mono text-emerald-700 mt-0.5">₹7,100</p>
            <span className="text-[10px] text-slate-500 font-mono">Freight: -₹300/Q</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
            <span className="text-[11px] text-slate-600 font-medium">Active Lots</span>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{lots.length}</p>
            <span className="text-[10px] text-slate-500">Listed on Marketplace</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
            <span className="text-[11px] text-slate-600 font-medium">Buyer Bids</span>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{activeOffersCount}</p>
            <span className="text-[10px] text-slate-500">Pending Review</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
            <span className="text-[11px] text-slate-600 font-medium">Active Orders</span>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{orders.length}</p>
            <span className="text-[10px] text-slate-500">In Transit</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
            <span className="text-[11px] text-slate-600 font-medium">Logistics & CWC</span>
            <p className="text-base font-semibold text-slate-900 mt-0.5">Ready</p>
            <span className="text-[10px] text-slate-500">Direct booking</span>
          </div>
        </div>
      </div>

      {
    /* AI Recommendation Banner (Section 3 & 5) */
  }
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              MARKET ADVISORY
            </span>
            <span className="text-xs text-slate-400 font-mono">Confidence: 84%</span>
          </div>
          <p className="text-sm font-semibold text-white">
            Recommended Market: Warangal Mandi • Expected Net Realization: ₹7,100/quintal
          </p>
          <p className="text-xs text-slate-300 leading-snug">
            Higher active mill demand and lower freight cost. Market arrivals suggest holding off distress sales if CWC warehousing is feasible.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
    onClick={() => setActiveTab("trends")}
    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
  >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimal Selling Time</span>
          </button>
          <button
    onClick={onOpenStorage}
    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
  >
            Check CWC Storage
          </button>
          <button
    onClick={onOpenTransport}
    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
  >
            Book Transport
          </button>
        </div>
      </div>

      {
    /* Navigation Sub-Tabs */
  }
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
    onClick={() => setActiveTab("sell_requests")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "sell_requests" ? "bg-emerald-800 text-white font-semibold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
    id="farmer-sell-requests-tab"
  >
          <Wheat className="w-3.5 h-3.5 text-amber-300" />
          <span>🌾 Sell Requests & FPO Desk ({sellRequests.length})</span>
          {sellRequests.some((r) => r.status !== "completed") && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </button>

        <button
    onClick={() => setActiveTab("admin_products")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "admin_products" ? "bg-amber-400 text-slate-950 font-extrabold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
    id="farmer-admin-products-tab"
  >
          <span className="text-sm">🛒</span>
          <span>Admin Market Products ({marketRequiredVegetables.length})</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-700 text-white animate-pulse">
            NEW
          </span>
        </button>

        <button
    onClick={() => setActiveTab("market_rates")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "market_rates" ? "bg-amber-500 text-slate-950 font-extrabold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
    id="farmer-market-rates-tab"
  >
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          <span>📊 Live Market Rates</span>
        </button>

        <button
    onClick={() => setActiveTab("lots")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "lots" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
          <Wheat className="w-3.5 h-3.5" />
          <span>Active Crop Lots ({lots.length})</span>
        </button>

        <button
    onClick={() => setActiveTab("trends")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "trends" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Supply vs Demand Trends</span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
            Recharts
          </span>
        </button>

        <button
    onClick={() => setActiveTab("offers")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "offers" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Buyer Offers</span>
          {activeOffersCount > 0 && <span className="w-4 h-4 bg-rose-600 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeOffersCount}
            </span>}
        </button>

        <button
    onClick={() => setActiveTab("orders")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "orders" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
          <Truck className="w-3.5 h-3.5" />
          <span>Order Milestones ({orders.length})</span>
        </button>

        <button
    onClick={() => setActiveTab("bank")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "bank" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bank Settlement</span>
        </button>
      </div>

      {
    /* TAB 0: FARM GATE SELL REQUESTS & ASSIGNED FPO OPERATIONS */
  }
      {activeTab === "sell_requests" && <div className="space-y-5">
          {
    /* APMC Market Admin Live Demands & Added Products Bulletin */
  }
          {marketRequiredVegetables.length > 0 && <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/40 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                    📢
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-white">
                        APMC Market Admin Added Products & Demands
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                        {marketRequiredVegetables.length} Live Items
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Added by Market Admin. Click &quot;Sell Produce to FPO&quot; to initiate verification and guaranteed payout (97.5% Farmer / 1.5% FPO / 1% App).
                    </p>
                  </div>
                </div>

                <button
    type="button"
    onClick={() => setActiveTab("admin_products")}
    className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer self-start sm:self-auto shrink-0"
  >
                  <span>View All ({marketRequiredVegetables.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {marketRequiredVegetables.slice(0, 3).map((req) => <div key={req.id} className="bg-white/10 border border-white/15 rounded-xl p-3 space-y-2 backdrop-blur-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
                          {req.status === "urgent_demand" ? "\u{1F6A8} Market Demand" : "APMC Quota"}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          ₹{req.offeredPricePerQuintal.toLocaleString("en-IN")}/Qtl
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1.5">{req.cropName}</h4>
                      <p className="text-[11px] text-slate-300 font-mono">{req.variety} • {req.targetGrade}</p>
                      <p className="text-[10px] text-slate-400 mt-1">📍 {req.mandiName}</p>
                    </div>

                    <button
    type="button"
    onClick={() => handleSellMarketProduce(req)}
    className="w-full mt-2 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
  >
                      <span>Sell Produce to FPO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>)}
              </div>
            </div>}

          <SellRequestsSection
    role="farmer"
    sellRequests={sellRequests}
    onOpenSellProduce={onOpenSellProduce}
    onViewRequestDetails={(req) => {
      if (onViewSellRequest) onViewSellRequest(req);
    }}
  />
        </div>}

      {
    /* TAB: ADMIN MARKET PRODUCTS */
  }
      {activeTab === "admin_products" && <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-lg text-slate-900">
                    APMC Market Admin Product Catalog & Requirements
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {marketRequiredVegetables.length} Products Available
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Products listed directly by the Market Admin. When you click &quot;Sell Produce to FPO&quot;, an FPO Officer is assigned for farm-gate verification, quality inspection, logistics assignment, and fast bank settlement upon reaching the APMC market.
                </p>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
    type="text"
    value={adminProductSearch}
    onChange={(e) => setAdminProductSearch(e.target.value)}
    placeholder="Search admin products..."
    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
  />
              </div>
            </div>

            {
    /* Guaranteed Split Notice */
  }
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">⚖️</span>
                <span className="text-emerald-900 font-semibold">
                  Standard Guaranteed Commission Split on Market Arrival:
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-xs">
                <span className="text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Farmer: 97.5%
                </span>
                <span className="text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-300">
                  FPO: 1.5%
                </span>
                <span className="text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                  App: 1%
                </span>
              </div>
            </div>

            {
    /* Product Cards Grid */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {marketRequiredVegetables.filter(
    (v) => v.cropName.toLowerCase().includes(adminProductSearch.toLowerCase()) || v.variety.toLowerCase().includes(adminProductSearch.toLowerCase()) || v.mandiName.toLowerCase().includes(adminProductSearch.toLowerCase())
  ).map((item) => <div
    key={item.id}
    className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500 p-4 shadow-xs transition-all flex flex-col justify-between hover:shadow-md group"
  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.status === "urgent_demand" ? "\u{1F6A8} Market Demand" : "APMC Quota"}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-mono font-black text-emerald-700">
                            ₹{item.offeredPricePerQuintal.toLocaleString("en-IN")}/Qtl
                          </span>
                          {item.currentPrice && item.unit === "kg" && <span className="block text-[10px] font-mono text-slate-500">
                              (₹{item.currentPrice}/kg)
                            </span>}
                        </div>
                      </div>

                      {item.image && <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <img
    src={item.image}
    alt={item.cropName}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
                        </div>}

                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {item.cropName}
                        </h4>
                        <p className="text-xs text-slate-600 font-mono">
                          Variety: {item.variety} • {item.targetGrade}
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-xs text-slate-600 border border-slate-100 font-mono">
                        <div className="flex justify-between">
                          <span>Market Quota:</span>
                          <strong className="text-slate-900">{item.requiredQuantityQuintals} Quintals</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Target APMC:</span>
                          <span className="text-slate-800 truncate max-w-[150px]">{item.mandiName}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Added By:</span>
                          <span>{item.addedBy}</span>
                        </div>
                      </div>
                    </div>

                    <button
    type="button"
    onClick={() => handleSellMarketProduce(item)}
    className="w-full mt-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
  >
                      <Wheat className="w-4 h-4 text-amber-300" />
                      <span>Sell Produce to FPO Officer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>)}
            </div>
          </div>
        </div>}

      {
    /* TAB 1: CROP LOTS */
  }
      {activeTab === "lots" && <div className="space-y-4">
          {
    /* Quick Real-Time Supply vs Demand Intelligence Preview */
  }
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <BarChart2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-900">
                      Real-Time Crop Supply vs. Buyer Demand Trends
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Live Pulse
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    High buyer demand deficit detected across regional APMC hubs. Realize peak market prices by timing your lot sales.
                  </p>
                </div>
              </div>

              <button
    type="button"
    onClick={() => setActiveTab("trends")}
    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
  >
                <span>Interactive Recharts Trends</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs border-t border-slate-100">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
                <span className="text-[10px] text-slate-500 font-mono">Cotton Mandi Arrivals</span>
                <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">38,000 Qtl</p>
                <span className="text-[10px] text-slate-500">Regional APMC Supply</span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
                <span className="text-[10px] text-slate-500 font-mono">Buyer Demand Quota</span>
                <p className="text-sm font-bold font-mono text-indigo-600 mt-0.5">46,200 Qtl</p>
                <span className="text-[10px] text-indigo-700 font-medium">1.22x Buyer Deficit</span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
                <span className="text-[10px] text-slate-500 font-mono">Optimal Selling Window</span>
                <p className="text-sm font-bold font-mono text-emerald-700 mt-0.5">In 2 - 4 Days</p>
                <span className="text-[10px] text-emerald-600 font-medium">+₹240/Q Projected Lift</span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 stat-card-hover cursor-default">
                <span className="text-[10px] text-slate-500 font-mono">Top Demand Destination</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">Warangal APMC</p>
                <span className="text-[10px] text-slate-500 font-mono">₹7,400 Modal Price</span>
              </div>
            </div>
          </div>

          {
    /* MARKET ADMIN REQUIRED VEGETABLES & CROP DEMANDS BULLETIN */
  }
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-emerald-500/40 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  🛒
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-sm text-white">
                      APMC Market Admin Required Vegetables & Crop Demands
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                      Live Market Bulletin
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Urgent vegetable and crop quotas posted by Market Admins. List your harvest to match these guaranteed market rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {marketRequiredVegetables.map((req) => <div key={req.id} className="bg-white/10 border border-white/15 rounded-xl p-3.5 space-y-2 backdrop-blur-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
                      {req.status === "urgent_demand" ? "\u{1F6A8} Urgent Requirement" : "Open Requirement"}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      ₹{req.offeredPricePerQuintal.toLocaleString("en-IN")}/Q
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{req.cropName}</h4>
                    <p className="text-[11px] text-slate-300 font-mono">Variety: {req.variety} • Grade: {req.targetGrade}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                    <span>Needed: <strong className="text-white">{req.requiredQuantityQuintals} Qtl</strong></span>
                    <span>Deadline: <strong className="text-amber-200">{req.deadline}</strong></span>
                  </div>
                  <button
    type="button"
    onClick={() => handleSellMarketProduce(req)}
    className="w-full mt-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
  >
                    <span>Sell Produce to FPO</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Crop Lots Listed for Sale
            </h3>
            <button
    onClick={() => setShowCreateLotModal(true)}
    className="text-xs font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-mono"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lots.map((lot) => <div
    key={lot.id}
    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between dashboard-card-hover"
  >
                <div>
                  <div className="relative h-40 w-full bg-slate-100">
                    <img
    src={lot.imageUrl}
    alt={lot.crop}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded">
                      {lot.id}
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-slate-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded font-medium">
                        Grade {lot.grade}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-slate-900 text-sm">
                          {lot.crop} - {lot.variety}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{lot.location}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {lot.quantity} {lot.unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 text-slate-600 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 font-sans text-[10px]">Moisture</span>
                        <p className="font-bold text-slate-900">{lot.moisture}%</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans text-[10px]">Harvest</span>
                        <p className="font-bold text-slate-900">{lot.harvestDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <div>
                        <span className="text-[10px] text-slate-500">Expected</span>
                        <p className="text-base font-bold font-mono text-slate-900">
                          ₹{lot.expectedPrice.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-normal text-slate-500 font-sans">/Q</span>
                        </p>
                      </div>

                      {lot.physicalQualityCheckedByFPO && <span className="text-[10px] font-mono bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          FPO Verified
                        </span>}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <span className="text-slate-600 text-[11px] font-mono">Status: <strong className="text-slate-900 uppercase">{lot.status}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
    type="button"
    onClick={() => {
      if (onSellProduct) {
        onSellProduct({
          cropName: lot.crop,
          variety: lot.variety,
          price: Number(lot.expectedPrice) || 2500,
          unit: lot.unit,
          imageUrl: lot.imageUrl,
          quantity: Number(lot.quantity) || 10,
          grade: lot.grade
        });
      }
    }}
    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
    title="Sell this lot directly to FPO"
  >
                      <Wheat className="w-3 h-3 text-amber-200" />
                      <span>Sell to FPO</span>
                    </button>
                    <button
    onClick={() => setActiveTab("offers")}
    className="font-medium text-slate-700 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer text-[11px]"
  >
                      <span>Bids</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>}

      {
    /* TAB 2: BUYER OFFERS & NEGOTIATIONS (Section 12) */
  }
      {activeTab === "offers" && <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Incoming Buyer Offers (Bids)
              </h3>
              <p className="text-xs text-slate-600">
                Verified buyers submitting direct purchase offers on your crop lots. Accept to generate instant order.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 self-start">
              {offers.length} Bids Total
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {offers.map((offer) => {
    const isPending = offer.status === "pending";
    return <div key={offer.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-all row-card-hover">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {offer.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{offer.buyerCompany}</span>
                        {offer.buyerVerified && <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            VERIFIED
                          </span>}
                        <span className="text-xs text-slate-500 font-mono text-[11px]">• {offer.createdAt}</span>
                      </div>

                      <p className="text-xs text-slate-600 font-mono text-[11px]">
                        Lot: <strong className="text-slate-900">{offer.lotId}</strong> ({offer.crop} - {offer.quantity} {offer.unit}) • Contact: {offer.buyerName}
                      </p>

                      {offer.note && <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 font-sans">
                          “{offer.note}”
                        </p>}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-slate-500">Offered Price</span>
                        <div className="text-xl font-bold font-mono text-slate-900">
                          ₹{offer.offerPricePerQuintal.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-normal text-slate-500 font-sans">/Q</span>
                        </div>
                        <p className="text-xs font-mono text-slate-600">
                          Total: ₹{offer.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {
      /* Action buttons */
    }
                      {isPending ? <div className="flex items-center gap-2">
                          <button
      onClick={() => onAcceptOffer(offer.id)}
      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
    >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>

                          <button
      onClick={() => onRejectOffer(offer.id)}
      className="px-2.5 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
    >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <input
      type="number"
      placeholder="Counter ₹"
      value={counterInput[offer.id] || ""}
      onChange={(e) => setCounterInput({ ...counterInput, [offer.id]: e.target.value })}
      className="w-20 px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-hidden"
    />
                            <button
      onClick={() => {
        const val = Number(counterInput[offer.id]);
        if (val > 0) {
          onCounterOffer(offer.id, val);
          setCounterInput({ ...counterInput, [offer.id]: "" });
        }
      }}
      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg cursor-pointer"
    >
                              Counter
                            </button>
                          </div>
                        </div> : <span
      className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded border ${offer.status === "accepted" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}
    >
                          {offer.status.toUpperCase()}
                        </span>}
                    </div>
                  </div>
                </div>;
  })}
          </div>
        </div>}

      {
    /* TAB 3: ORDER TIMELINE & 10-STAGE PROGRESS BAR (Section 13) */
  }
      {activeTab === "orders" && <div className="space-y-5">
          {orders.map((order) => {
    const steps = [
      "Offer Accepted",
      "Order Confirmed",
      "Transport Assigned",
      "Pickup Scheduled",
      "Crop Picked Up",
      "In Transit",
      "Delivered",
      "Quality Verified",
      "Payment Processing",
      "Payment Completed"
    ];
    return <div
      key={order.id}
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5 dashboard-card-hover"
    >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {order.id}
                      </span>
                      <h4 className="font-heading font-bold text-base text-slate-900">
                        {order.crop} - {order.quantity} {order.unit}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-mono text-[11px]">
                      Buyer: <strong className="text-slate-900 font-sans">{order.buyerCompany}</strong> ({order.buyerName}) • Agreed: ₹{order.agreedPrice}/Q • Total: <strong className="text-slate-900">₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono px-2.5 py-1 rounded-md">
                      Stage {order.currentStep}/10: {order.status}
                    </span>

                    {order.currentStep < 10 && <button
      onClick={() => onAdvanceOrder(order.id)}
      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
      title="Advance to next stage"
    >
                        <span>Advance</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>}
                  </div>
                </div>

                {
      /* 10-Stage Visual Timeline Progress Bar */
    }
                <div className="space-y-3">
                  <div className="relative">
                    {
      /* Background line */
    }
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
                    {
      /* Active progress line */
    }
                    <div
      className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 rounded-full transition-all duration-300"
      style={{
        width: `${(order.currentStep - 1) / (steps.length - 1) * 100}%`
      }}
    />

                    {
      /* Timeline Nodes */
    }
                    <div className="relative flex justify-between">
                      {steps.map((stepName, idx) => {
      const stepNum = idx + 1;
      const isCompleted = stepNum <= order.currentStep;
      const isCurrent = stepNum === order.currentStep;
      return <div
        key={stepName}
        className="flex flex-col items-center group relative cursor-default"
      >
                            <div
        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all z-10 ${isCurrent ? "bg-slate-900 text-white ring-2 ring-slate-400" : isCompleted ? "bg-emerald-600 text-white" : "bg-white border border-slate-300 text-slate-400"}`}
      >
                              {isCompleted ? "\u2713" : stepNum}
                            </div>
                            <span
        className={`hidden md:block text-[9px] mt-1.5 max-w-[65px] text-center leading-tight font-sans ${isCurrent ? "text-slate-900 font-bold" : isCompleted ? "text-slate-700 font-medium" : "text-slate-400"}`}
      >
                              {stepName}
                            </span>
                          </div>;
    })}
                    </div>
                  </div>
                </div>

                {
      /* Logistics & Payment Confirmation details */
    }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      Transport Assignment
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Vehicle: <strong>{order.vehicleType || "Heavy Lorry (10 Ton)"}</strong> ({order.vehicleNumber || "TS 03 UA 5678"})
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Transporter: <strong>{order.transporterName || "Shankar Logistics"}</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        Blockchain Escrow & Settlement
                      </span>
                      <span
      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${order.paymentStatus === "completed" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px]">
                      Disbursement: Direct RTGS to <strong>State Bank of India (A/c ...7456)</strong>
                    </p>

                    {order.blockchainTxHash && <div className="flex items-center justify-between pt-0.5">
                        <span className="font-mono text-[10px] text-slate-500 truncate max-w-[180px]">
                          Hash: {order.blockchainTxHash}
                        </span>
                        <button
      onClick={() => onViewBlockchainBlock(order.blockchainTxHash)}
      className="text-emerald-700 hover:text-emerald-800 font-mono text-[10px] flex items-center gap-0.5 cursor-pointer underline"
    >
                          <span>Block #{order.blockNumber}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>}
                  </div>
                </div>
              </div>;
  })}
        </div>}

      {
    /* TAB 4: DIRECT BANK SETTLEMENT */
  }
      {activeTab === "bank" && <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 max-w-2xl space-y-5">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Farmer Bank & Settlement Profile
            </h3>
            <p className="text-xs text-slate-600">
              Payments are routed directly into your bank account via RTGS/NEFT or UPI. No middlemen cuts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 stat-card-hover cursor-default">
                <span className="text-slate-500 text-[11px]">Bank Name</span>
                <p className="text-sm font-semibold text-slate-900">{currentUser.bankDetails?.bankName}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 stat-card-hover cursor-default">
                <span className="text-slate-500 text-[11px]">Account Number</span>
                <p className="text-sm font-mono font-semibold text-slate-900">
                  {currentUser.bankDetails?.accountNumber}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 stat-card-hover cursor-default">
                <span className="text-slate-500 text-[11px]">IFSC Code</span>
                <p className="text-sm font-mono font-semibold text-slate-900">{currentUser.bankDetails?.ifscCode}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 stat-card-hover cursor-default">
                <span className="text-slate-500 text-[11px]">UPI ID</span>
                <p className="text-sm font-mono font-semibold text-emerald-700">{currentUser.bankDetails?.upiId}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900">Verified Direct Beneficiary Account: </strong>
                <span>
                  Both buyer and farmer receive SMS confirmation and an immutable cryptographic block entry upon successful fund transfer.
                </span>
              </div>
            </div>

            <button
    onClick={() => setShowBankModal(true)}
    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
  >
              Edit Banking Details
            </button>
          </div>
        </div>}

      {
    /* TAB: RECHARTS REAL-TIME CROP SUPPLY VS BUYER DEMAND */
  }
      {activeTab === "trends" && <CropSupplyDemandTrends
    mandiPrices={mandiPrices}
    lots={lots}
    offers={offers}
    initialCrop="Cotton"
    onSelectCropToSell={(cropName, suggestedPrice) => {
      setCrop(cropName);
      setExpectedPrice(String(suggestedPrice));
      setShowCreateLotModal(true);
    }}
    onOpenStorage={onOpenStorage}
    onViewOffers={() => setActiveTab("offers")}
  />}

      {
    /* TAB: LIVE APMC MARKET RATES & WHOLESALE BENCHMARK BOARD */
  }
      {activeTab === "market_rates" && <div className="space-y-4" id="farmer-live-market-rates-panel">
          {
    /* Market Admin Switch Callout */
  }
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/60 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">
                <Building2 className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Looking to manage or update market prices?</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">Market Admin</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Switch to the Market Admin Desk to upload today's mandi arrivals, update prices, or add new commodities.
                </p>
              </div>
            </div>
            {onSwitchToMarket && <button
    type="button"
    onClick={onSwitchToMarket}
    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto active:scale-95"
    id="switch-to-market-admin-rates-banner"
  >
                <Building2 className="w-4 h-4 text-slate-950" />
                <span>Switch to Market Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>}
          </div>

          <CityMarketDetailsCard
    onSelectCropForMarket={(cropName) => {
      if (onNavigateToMarkets) {
        onNavigateToMarkets(cropName);
      } else {
        setActiveTab("trends");
      }
    }}
    onOpenTransportModal={onOpenTransport}
  />
        </div>}

      {
    /* MODAL 1: CREATE CROP LOT with AI Quality Inspection & Fake Image Detector */
  }
      {showCreateLotModal && <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Create New Crop Lot
                </h3>
                <p className="text-xs text-slate-500">
                  Lot registration & optical quality verification
                </p>
              </div>
              <button
    onClick={() => setShowCreateLotModal(false)}
    className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer"
  >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLotSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Crop Type</label>
                  <select
    value={crop}
    onChange={(e) => setCrop(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white"
  >
                    {CROPS_DATA.map((c) => <option key={c.id} value={c.name}>
                        {c.name} ({c.nameTe})
                      </option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Variety</label>
                  <input
    type="text"
    value={variety}
    onChange={(e) => setVariety(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
    placeholder="e.g. BT-II / Samba Masuri"
    required
  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                  <input
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:outline-hidden"
    required
  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit</label>
                  <select
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white"
  >
                    <option value="Quintals">Quintals</option>
                    <option value="Tonnes">Tonnes</option>
                    <option value="Kgs">Kgs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expected Price (₹)</label>
                  <input
    type="number"
    value={expectedPrice}
    onChange={(e) => setExpectedPrice(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden"
    required
  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quality Grade</label>
                  <select
    value={grade}
    onChange={(e) => setGrade(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white"
  >
                    <option value="A">Grade A (Superior)</option>
                    <option value="B">Grade B (Medium)</option>
                    <option value="C">Grade C (Fair)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Moisture (%)</label>
                  <input
    type="number"
    step="0.1"
    value={moisture}
    onChange={(e) => setMoisture(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:outline-hidden"
    required
  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pickup Location</label>
                <input
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
    required
  />
              </div>

              {
    /* Capture Crop Image via Camera API & Simulated AI Quality Prediction */
  }
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700">
                    Crop Produce Photo & Quality Verification
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Quality Grading Inspection
                  </span>
                </div>

                {
    /* Camera Viewfinder Mode */
  }
                {isCameraActive ? <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                    <video
    ref={videoRef}
    playsInline
    autoPlay
    muted
    className="w-full h-64 object-cover bg-black"
  />

                    {
    /* Viewfinder Overlay */
  }
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
                      {
    /* Top Bar */
  }
                      <div className="flex items-center justify-between pointer-events-auto">
                        <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-medium px-2 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          Live Camera Viewfinder
                        </span>

                        <button
    type="button"
    onClick={toggleCameraFacing}
    className="p-1.5 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-white/20 text-xs transition-colors flex items-center gap-1 px-2.5 cursor-pointer"
    title="Switch between front and back cameras"
  >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono">{cameraFacingMode === "environment" ? "Rear" : "Front"}</span>
                        </button>
                      </div>

                      {
    /* Optical Focus Framing Reticle */
  }
                      <div className="self-center w-52 h-38 border-2 border-dashed border-white/70 rounded-xl relative flex flex-col items-center justify-center p-2 bg-black/20">
                        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400" />
                        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400" />
                        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400" />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400" />
                        <span className="text-[11px] text-white font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded text-center border border-emerald-500/50">
                          Align Harvested Produce
                        </span>
                        <span className="text-[9px] text-white/80 font-mono mt-1 text-center bg-black/40 px-1.5 py-0.5 rounded">
                          Point directly at crops (avoid faces/people)
                        </span>
                      </div>

                      {
    /* Bottom Action Controls */
  }
                      <div className="flex items-center justify-center gap-3 pointer-events-auto pb-1">
                        <button
    type="button"
    onClick={stopCamera}
    className="px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-medium rounded-full border border-white/10 cursor-pointer"
  >
                          Cancel
                        </button>

                        <button
    type="button"
    onClick={capturePhotoFromCamera}
    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
  >
                          <Camera className="w-4 h-4" />
                          <span>Snap Crop Photo</span>
                        </button>
                      </div>
                    </div>
                  </div> : <>
                    {
    /* Camera Error Message */
  }
                    {cameraError && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Camera Access Notice</span>
                        </div>
                        <p className="text-[11px] text-rose-700">{cameraError}</p>
                        <div className="pt-1 flex items-center gap-2">
                          <button
    type="button"
    onClick={() => startCamera("environment")}
    className="px-2.5 py-1 bg-white border border-rose-300 text-rose-900 rounded text-[11px] font-medium hover:bg-rose-100/50 cursor-pointer flex items-center gap-1"
  >
                            <RefreshCw className="w-3 h-3" />
                            Retry Camera
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono">or upload image below</span>
                        </div>
                      </div>}

                    {
    /* Image Preview or Capture Choice Buttons */
  }
                    {imagePreview ? <div className="space-y-3">
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                          <img
    src={imagePreview}
    alt="Crop Preview"
    className="w-full h-40 object-cover rounded-lg"
  />
                          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
    type="button"
    onClick={() => startCamera("environment")}
    className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
  >
                              <Camera className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Retake with Camera</span>
                            </button>
                            <label className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer">
                              <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                              <span>Change Photo</span>
                              <input
    type="file"
    accept="image/*"
    onChange={handlePhotoUpload}
    className="hidden"
  />
                            </label>
                          </div>
                        </div>

                        {
    /* Button Row Below Preview */
  }
                        <div className="flex items-center justify-between text-xs">
                          <button
    type="button"
    onClick={() => startCamera("environment")}
    className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
  >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Retake Photo with Camera</span>
                          </button>

                          <label className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Different File</span>
                            <input
    type="file"
    accept="image/*"
    onChange={handlePhotoUpload}
    className="hidden"
  />
                          </label>
                        </div>
                      </div> : (
    /* No Image Yet: Offer Capture Crop Image & Upload */
    <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {
      /* Capture Crop Image using Browser Camera API */
    }
                          <button
      type="button"
      onClick={() => startCamera("environment")}
      className="p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg border border-emerald-800 shadow-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer group text-left"
    >
                            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Camera className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">
                                Capture Crop Image
                              </div>
                              <div className="text-[10px] text-emerald-100 font-mono">
                                Use Browser Camera API
                              </div>
                            </div>
                          </button>

                          {
      /* Upload Photo from Device */
    }
                          <label className="p-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer group text-left">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <UploadCloud className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-800">
                                Upload Photo
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                From Phone / Desktop
                              </div>
                            </div>
                            <input
      type="file"
      accept="image/*"
      onChange={handlePhotoUpload}
      className="hidden"
    />
                          </label>
                        </div>

                        <p className="text-[11px] text-slate-500 font-mono text-center pt-0.5">
                          Capturing a clear crop photo estimates quality grade, moisture & potential market premium.
                        </p>
                      </div>
  )}
                  </>}

                {
    /* State: Predicting Quality... */
  }
                {isPredictingQuality && <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span className="font-bold text-xs text-emerald-900">
                          Optical Quality Inspection in Progress...
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        Optical Quality Assessment
                      </span>
                    </div>

                    {
    /* Pulsing progress line */
  }
                    <div className="w-full bg-emerald-200/70 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full animate-pulse w-4/5 transition-all duration-300" />
                    </div>

                    <p className="text-[11px] text-emerald-800 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{predictionStep}</span>
                    </p>
                  </div>}

                {
    /* AI Visual Inspection Result: Either Strict Rejection (Face/Non-Crop) OR Authentic Crop Grading */
  }
                {aiScanResult && !isPredictingQuality && <>
                    {!aiScanResult.isAuthenticCrop ? (
    /* STRICT REJECTION CARD (Human Face / Person / Non-Crop Object) */
    <div className="p-3.5 rounded-xl border bg-rose-50/90 border-rose-200 text-rose-950 space-y-3 shadow-xs">
                        {
      /* Header */
    }
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              {aiScanResult.isFaceOrPerson ? <UserX className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-rose-950">
                                  {aiScanResult.isFaceOrPerson ? "Human Face / Selfie Detected" : "Non-Agricultural Object Detected"}
                                </span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 border border-rose-300">
                                  REJECTED • NOT A CROP
                                </span>
                              </div>
                              <div className="text-[10px] text-rose-700 font-mono mt-0.5">
                                Produce Analysis: {aiScanResult.detectedSubject} • Confidence: {aiScanResult.confidence}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {
      /* Notice: Explicitly explains that no vegetable details are assigned to a human face */
    }
                        <div className="p-2.5 bg-white/90 rounded-lg border border-rose-200 text-xs space-y-1.5">
                          <div className="font-bold text-[11px] text-rose-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>No Vegetable or Crop Details Assigned:</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-700">
                            {aiScanResult.rejectionReason}
                          </p>
                          <p className="text-[11px] leading-relaxed text-slate-600 font-mono bg-rose-50/60 p-2 rounded border border-rose-100">
                            <strong>Agronomic Guidance:</strong> {aiScanResult.advice}
                          </p>
                        </div>

                        {
      /* Retake & Camera Recovery Buttons */
    }
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <button
      type="button"
      onClick={() => startCamera("environment")}
      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
    >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Retake with Camera</span>
                          </button>

                          {cameraFacingMode === "user" && <button
      type="button"
      onClick={() => {
        setCameraFacingMode("environment");
        startCamera("environment");
      }}
      className="px-3 py-1.5 bg-white border border-rose-300 text-rose-900 hover:bg-rose-100/50 font-medium text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
    >
                              <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
                              <span>Switch to Rear Camera</span>
                            </button>}

                          <label className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                            <span>Upload Crop Photo</span>
                            <input
      type="file"
      accept="image/*"
      onChange={handlePhotoUpload}
      className="hidden"
    />
                          </label>
                        </div>
                      </div>
  ) : (
    /* AUTHENTIC AGRICULTURAL PRODUCE CARD */
    <div className="p-3.5 rounded-xl border bg-slate-50/90 border-slate-200 text-slate-900 space-y-2.5 shadow-xs">
                        {
      /* Header with Verified Grade */
    }
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">
                                  Authentic Produce Verified
                                </span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  {aiScanResult.estimatedGrade}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {aiScanResult.detectedSubject} • Score: {aiScanResult.score || 94}/100 • Confidence: {aiScanResult.confidence}%
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                            Auto-Applied to Form
                          </span>
                        </div>

                        {
      /* Mismatch Warning Note if declared crop differs from image */
    }
                        {aiScanResult.isDeclaredCropMatched === false && <div className="p-2 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-900 font-mono flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Notice: Camera detected {aiScanResult.detectedSubject}, while declared crop was "{crop}".</span>
                          </div>}

                        {
      /* Metric Badges for Authentic Crop */
    }
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                            <div className="text-[10px] text-slate-500 font-mono">Moisture</div>
                            <div className="font-bold text-slate-900 font-mono mt-0.5">
                              ~{aiScanResult.moisturePercent}%
                            </div>
                            <div className="text-[9px] text-emerald-600 font-medium">Safe Storage</div>
                          </div>

                          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                            <div className="text-[10px] text-slate-500 font-mono">Foreign Matter</div>
                            <div className="font-bold text-slate-900 font-mono mt-0.5">
                              {aiScanResult.defectPercent}%
                            </div>
                            <div className="text-[9px] text-emerald-600 font-medium">Below APMC Limit</div>
                          </div>

                          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                            <div className="text-[10px] text-slate-500 font-mono">Realization</div>
                            <div className="font-bold text-emerald-700 font-mono mt-0.5">
                              {aiScanResult.potentialGain || "+\u20B9180/Q"}
                            </div>
                            <div className="text-[9px] text-slate-500 font-medium">Above Modal Rate</div>
                          </div>
                        </div>

                        {
      /* Agronomic Feedback Box */
    }
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs">
                          <div className="font-semibold text-[11px] text-slate-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Post-Harvest Quality Guidance:</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            {aiScanResult.advice}
                          </p>
                          {aiScanResult.colorScore && <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between font-mono">
                              <span>Uniformity: {aiScanResult.colorScore}</span>
                              <span>AGMARK Standard Compliant</span>
                            </div>}
                        </div>
                      </div>
  )}
                  </>}
              </div>

              {
    /* Submission Error Banner */
  }
              {lotSubmitError && <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-900 flex items-start gap-2 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Action Required:</strong> {lotSubmitError}
                  </div>
                </div>}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
    type="button"
    onClick={() => {
      setShowCreateLotModal(false);
      setLotSubmitError(null);
    }}
    className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer"
  >
                  Publish Lot
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* MODAL 2: BANK & UPI SETTINGS */
  }
      {showBankModal && <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Bank & Settlement Settings
              </h3>
              <button
    onClick={() => setShowBankModal(false)}
    className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer"
  >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Bank Name</label>
                <input
    type="text"
    value={bankForm.bankName}
    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden"
  />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Account Number</label>
                <input
    type="text"
    value={bankForm.accountNumber}
    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-hidden"
  />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">IFSC Code</label>
                <input
    type="text"
    value={bankForm.ifscCode}
    onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono uppercase focus:outline-hidden"
  />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">UPI ID (e.g. name@oksbi)</label>
                <input
    type="text"
    value={bankForm.upiId}
    onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-hidden"
  />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Paytm Registered Number</label>
                <input
    type="text"
    value={bankForm.paytmNumber || ""}
    onChange={(e) => setBankForm({ ...bankForm, paytmNumber: e.target.value })}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden"
  />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
    onClick={() => setShowBankModal(false)}
    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
  >
                Cancel
              </button>
              <button
    onClick={() => {
      onUpdateBankDetails(bankForm);
      setShowBankModal(false);
    }}
    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer"
  >
                Save Details
              </button>
            </div>
          </div>
        </div>}

      {
    /* MODAL 3: RAISE DISPUTE */
  }
      {showDisputeModal && <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Raise Trade Dispute
              </h3>
              <button
    onClick={() => setShowDisputeModal(false)}
    className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer"
  >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Order Reference</label>
                <select
    value={disputeOrderId}
    onChange={(e) => setDisputeOrderId(e.target.value)}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
  >
                  {orders.map((o) => <option key={o.id} value={o.id}>
                      {o.id} - {o.crop} ({o.buyerCompany})
                    </option>)}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Dispute Category</label>
                <select
    value={disputeType}
    onChange={(e) => setDisputeType(e.target.value)}
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
  >
                  <option value="Price">Price Discount Disagreement</option>
                  <option value="Quality">Quality Downgrade Dispute</option>
                  <option value="Quantity">Weight / Scale Weighment Discrepancy</option>
                  <option value="Delivery">Transit Delay / Damage</option>
                  <option value="Payment">Payment Settlement Delay</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description & Evidence</label>
                <textarea
    rows={3}
    value={disputeDesc}
    onChange={(e) => setDisputeDesc(e.target.value)}
    placeholder="Explain the issue clearly. State APMC inspection officer or weighbridge slip details."
    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden"
  />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
    onClick={() => setShowDisputeModal(false)}
    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
  >
                Cancel
              </button>
              <button
    onClick={() => {
      if (disputeDesc.trim()) {
        onRaiseDispute({
          orderId: disputeOrderId,
          type: disputeType,
          description: disputeDesc,
          raisedByRole: "farmer",
          raisedByName: currentUser.name
        });
        setShowDisputeModal(false);
        setDisputeDesc("");
      }
    }}
    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer"
  >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
