import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  DollarSign,
  Phone,
  Navigation,
  Wheat,
  Truck,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Eye,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ChevronRight,
  RotateCw,
} from 'lucide-react';
import { SellRequest, UserProfile, MandiPrice, FPOOfficer, CropLot } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  createSellRequest,
  acceptSellRequest,
  travelToSeller,
  submitPhysicalInspection,
  negotiateAgreedPrice,
  selectTransportation,
  completeSellTransaction,
  fetchFpoOfficers,
} from '../services/sellRequestApi';
import { SEED_FPO_OFFICERS } from '../data/fpoOfficersData';

export interface InitialSellProduceData {
  cropName: string;
  expectedPrice?: number;
  mandiName?: string;
  unit?: string;
  variety?: string;
  imageUrl?: string;
  quantity?: number;
  grade?: 'A' | 'B' | 'C';
}

interface SellProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  mandiPrices?: MandiPrice[];
  onPublishListing?: (lot: CropLot) => void;
  onSellRequestCreated?: (sellReq: SellRequest) => void;
  onSellRequestUpdated?: (sellReq: SellRequest) => void;
  initialRequestToView?: SellRequest | null;
  initialProduceData?: InitialSellProduceData | null;
}

const COMMON_CROPS = [
  { name: 'Cotton', nameTe: 'పత్తి', nameHi: 'कपास', defaultVariety: 'BT-II Long Staple', unit: 'Quintals', benchmarkPrice: 5000, icon: '🌾', img: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80' },
  { name: 'Red Chilli', nameTe: 'ఎండు మిర్చి', nameHi: 'लाल मिर्च', defaultVariety: 'Teja S17 Stemless', unit: 'Quintals', benchmarkPrice: 18500, icon: '🌶️', img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80' },
  { name: 'Turmeric', nameTe: 'పసుపు', nameHi: 'हल्दी', defaultVariety: 'Armoor High Curcumin (5.2%)', unit: 'Quintals', benchmarkPrice: 13500, icon: '🌱', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Rice (Paddy)', nameTe: 'వరి (ధాన్యం)', nameHi: 'धान (चावल)', defaultVariety: 'Sona Masoori (BPT 5204)', unit: 'Quintals', benchmarkPrice: 2650, icon: '🌾', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80' },
  { name: 'Wheat', nameTe: 'గోధుమ', nameHi: 'गेहूँ', defaultVariety: 'Sharbati 306 Lokwan', unit: 'Quintals', benchmarkPrice: 2480, icon: '🌾', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80' },
  { name: 'Tomato', nameTe: 'టొమాటో', nameHi: 'टमाटर', defaultVariety: 'Hybrid Red (Shivaji)', unit: 'Quintals', benchmarkPrice: 2200, icon: '🍅', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80' },
  { name: 'Onion', nameTe: 'ఉల్లిపాయ', nameHi: 'प्याज', defaultVariety: 'Nashik Red Globe', unit: 'Quintals', benchmarkPrice: 1950, icon: '🧅', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80' },
  { name: 'Maize', nameTe: 'మొక్కజొన్న', nameHi: 'मक्का', defaultVariety: 'Kaveri 50 Super Gold', unit: 'Quintals', benchmarkPrice: 2180, icon: '🌽', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80' },
  { name: 'Soybean', nameTe: 'సోయాబీన్', nameHi: 'सोयाबीन', defaultVariety: 'JS-335 Yellow', unit: 'Quintals', benchmarkPrice: 4600, icon: '🌱', img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80' },
];

export const SellProduceModal: React.FC<SellProduceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  mandiPrices = [],
  onPublishListing,
  onSellRequestCreated,
  onSellRequestUpdated,
  initialRequestToView = null,
  initialProduceData = null,
}) => {
  const { language } = useLanguage();

  // Active view: 'form' for creating new sell request, 'tracker' for watching/testing the 13-step lifecycle
  const [activeView, setActiveView] = useState<'form' | 'tracker'>('form');
  const [activeRequest, setActiveRequest] = useState<SellRequest | null>(null);

  // Form State
  const [selectedCrop, setSelectedCrop] = useState<string>('Cotton');
  const [variety, setVariety] = useState<string>('BT-II Long Staple');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<string>('Quintals');
  const [expectedPrice, setExpectedPrice] = useState<number>(5200);
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [moisture, setMoisture] = useState<number>(8.5);
  const [notes, setNotes] = useState<string>('Clean picked harvest, zero rain moisture damage, ready for FPO physical check.');
  const [sellerName, setSellerName] = useState<string>(currentUser.name || 'Ramesh Kumar');
  const [sellerPhone, setSellerPhone] = useState<string>(currentUser.phone || '+91 98480 23456');
  const [address, setAddress] = useState<string>('Survey No. 42/A, Rayaparthi Village');
  const [village, setVillage] = useState<string>('Rayaparthi');
  const [mandal, setMandal] = useState<string>('Wardhanapet');
  const [district, setDistrict] = useState<string>('Warangal');
  const [stateName, setStateName] = useState<string>('Telangana');
  const [pincode, setPincode] = useState<string>('506314');
  const [landmark, setLandmark] = useState<string>('Near Gram Panchayat Water Tank & Hanuman Temple');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80');

  // UI state for whether farmer wants to expand crop selection to change already chosen crop
  const [isChangingCrop, setIsChangingCrop] = useState<boolean>(false);

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Interactive negotiation & transport controls inside tracker
  const [negotiatePriceInput, setNegotiatePriceInput] = useState<number>(5000);
  const [transportChoice, setTransportChoice] = useState<'app_logistics' | 'own_transport'>('app_logistics');

  // Sync initial request or initialProduceData if passed in props
  useEffect(() => {
    if (initialRequestToView) {
      setActiveRequest(initialRequestToView);
      setActiveView('tracker');
      if (initialRequestToView.finalPricePerUnit) {
        setNegotiatePriceInput(initialRequestToView.finalPricePerUnit);
      } else if (initialRequestToView.expectedPricePerUnit) {
        setNegotiatePriceInput(initialRequestToView.expectedPricePerUnit);
      }
    } else if (initialProduceData && isOpen) {
      setActiveView('form');
      setIsChangingCrop(false); // Lock in pre-selected produce without asking for crop selection again
      if (initialProduceData.cropName) {
        setSelectedCrop(initialProduceData.cropName);
        const matched = COMMON_CROPS.find(
          (c) =>
            c.name.toLowerCase() === initialProduceData.cropName.toLowerCase() ||
            initialProduceData.cropName.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(initialProduceData.cropName.toLowerCase())
        );
        if (initialProduceData.imageUrl) {
          setImageUrl(initialProduceData.imageUrl);
        } else if (matched?.img) {
          setImageUrl(matched.img);
        }
      }
      if (initialProduceData.expectedPrice) {
        setExpectedPrice(initialProduceData.expectedPrice);
        setNegotiatePriceInput(initialProduceData.expectedPrice);
      }
      if (initialProduceData.unit) {
        setUnit(initialProduceData.unit);
      }
      if (initialProduceData.variety) {
        setVariety(initialProduceData.variety);
      }
      if (initialProduceData.quantity) {
        setQuantity(initialProduceData.quantity);
      }
      if (initialProduceData.grade) {
        setGrade(initialProduceData.grade);
      }
      if (initialProduceData.imageUrl) {
        setImageUrl(initialProduceData.imageUrl);
      }
      if (initialProduceData.mandiName) {
        setNotes(
          `Direct harvest sell order matching official market rate uploaded by ${initialProduceData.mandiName} at ₹${initialProduceData.expectedPrice?.toLocaleString('en-IN') || ''}/${initialProduceData.unit || 'Quintals'}. Ready for FPO pickup.`
        );
      }
    } else {
      setActiveView('form');
      setIsChangingCrop(true);
    }
  }, [initialRequestToView, initialProduceData, isOpen]);

  if (!isOpen) return null;

  const handleSelectCropPreset = (crop: (typeof COMMON_CROPS)[0]) => {
    setSelectedCrop(crop.name);
    setVariety(crop.defaultVariety);
    setUnit(crop.unit);
    setImageUrl(crop.img);

    const mandiMatch = mandiPrices.find(
      (m) => m.cropName.toLowerCase() === crop.name.toLowerCase()
    );
    const benchmark = mandiMatch ? mandiMatch.modalPrice : crop.benchmarkPrice;
    setExpectedPrice(benchmark);
    setNegotiatePriceInput(benchmark);
  };

  const handleUseGPSLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setAddress(`Farm Gate (GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E)`);
          setLandmark('Accurate GPS Coordinates Pinpoint');
        },
        () => {
          setIsLocating(false);
          setAddress('Survey No. 42/A, Rayaparthi Village');
        },
        { timeout: 5000 }
      );
    } else {
      setAddress('Survey No. 42/A, Rayaparthi Village');
    }
  };

  // Step 2 & 3: Submit Sell Request
  const handleSubmitSellRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const payload = {
        sellerId: currentUser.id || 'usr-farmer-self',
        sellerName,
        sellerPhone,
        crop: selectedCrop,
        variety,
        quantity: Number(quantity) || 10,
        unit,
        expectedPricePerUnit: Number(expectedPrice) || 5000,
        sellerLocation: {
          address,
          village,
          mandal,
          district,
          state: stateName,
          pincode,
          lat: 17.8423,
          lng: 79.6241,
          landmark,
        },
        photos: [imageUrl],
        imageUrl,
        qualityDetails: {
          grade,
          moisture: Number(moisture) || 8.5,
          harvestDate: new Date().toISOString().split('T')[0],
          notes,
        },
      };

      const result = await createSellRequest(payload);
      if (result.success && result.sellRequest) {
        setActiveRequest(result.sellRequest);
        setActiveView('tracker');
        if (onSellRequestCreated) {
          onSellRequestCreated(result.sellRequest);
        }
        // Also add to marketplace lots if callback provided
        if (onPublishListing) {
          const newLot: CropLot = {
            id: `LOT-${result.sellRequest.id}`,
            farmerId: result.sellRequest.sellerId,
            farmerName: result.sellRequest.sellerName,
            farmerPhone: result.sellRequest.sellerPhone,
            crop: result.sellRequest.crop,
            variety: result.sellRequest.variety || `${result.sellRequest.crop} Standard`,
            quantity: result.sellRequest.quantity,
            unit: result.sellRequest.unit,
            grade: grade,
            moisture: Number(moisture),
            harvestDate: new Date().toISOString().split('T')[0],
            expectedPrice: result.sellRequest.expectedPricePerUnit,
            location: `${address}, ${district}`,
            imageUrl: result.sellRequest.imageUrl || imageUrl,
            availabilityDate: new Date().toISOString().split('T')[0],
            status: 'available',
            farmerRating: 4.9,
            verifiedHarvest: true,
            physicalQualityCheckedByFPO: false,
            fpoOfficerAssigned: result.sellRequest.assignedFpoOfficer?.name,
          };
          onPublishListing(newLot);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit sell request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 6: FPO Officer Accepts Request
  const handleAcceptRequest = async () => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      const updated = await acceptSellRequest(activeRequest.id, activeRequest.assignedFpoOfficer?.name);
      setActiveRequest(updated);
      if (onSellRequestUpdated) onSellRequestUpdated(updated);
      setStatusMessage('FPO Officer accepted the request! Both sides can now verify location.');
    } catch (err: any) {
      alert(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 8: FPO Officer Travels to Seller's Location
  const handleTravelToSeller = async () => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      const updated = await travelToSeller(activeRequest.id, activeRequest.assignedFpoOfficer?.name, 25);
      setActiveRequest(updated);
      if (onSellRequestUpdated) onSellRequestUpdated(updated);
      setStatusMessage('FPO Officer is en route to farm gate! ETA: ~25 mins.');
    } catch (err: any) {
      alert(err.message || 'Failed to update travel status');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 9: FPO Officer Physically Inspects Produce
  const handlePhysicalInspection = async () => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      const updated = await submitPhysicalInspection(activeRequest.id, {
        grade: 'A',
        moisturePercentage: 8.5,
        foreignMatterPercentage: 1.0,
        qualityNotes: `Farm gate physical check verified: Pure ${activeRequest.crop} (${activeRequest.variety}). Grade A standard certified.`,
        officerName: activeRequest.assignedFpoOfficer?.name,
        officerId: activeRequest.assignedFpoOfficer?.id,
      });
      setActiveRequest(updated);
      if (onSellRequestUpdated) onSellRequestUpdated(updated);
      setStatusMessage('Physical produce inspection completed and verified with Grade A quality!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit inspection');
    } finally {
      setActionLoading(false);
    }
  };

  // FPO Officer Verifies Product (Completes Grade A verification and triggers transport selection)
  const handleVerifyProductQuick = async () => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      // 1. Submit physical inspection as Grade A verified
      await submitPhysicalInspection(activeRequest.id, {
        grade: 'A',
        moisturePercentage: 8.5,
        foreignMatterPercentage: 1.0,
        qualityNotes: `Verified Product: FPO Officer physical check passed Grade A standard.`,
        officerName: activeRequest.assignedFpoOfficer?.name || currentUser.name,
        officerId: activeRequest.assignedFpoOfficer?.id,
      });

      // 2. Agree on final price
      const agreedPrice = activeRequest.finalPricePerUnit || Number(negotiatePriceInput) || activeRequest.expectedPricePerUnit || 5000;
      const result = await negotiateAgreedPrice(activeRequest.id, agreedPrice);
      if (result.success && result.sellRequest) {
        setActiveRequest(result.sellRequest);
        if (onSellRequestUpdated) onSellRequestUpdated(result.sellRequest);
        setStatusMessage('✓ Product Verified by FPO Officer! Please select shipment: App Shipment or Own Transport.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to verify product');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 10 & 11: Confirm / Negotiate Actual Final Price & Calculate Commissions
  const handleNegotiatePrice = async () => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      const result = await negotiateAgreedPrice(activeRequest.id, Number(negotiatePriceInput) || 5000);
      if (result.success && result.sellRequest) {
        setActiveRequest(result.sellRequest);
        if (onSellRequestUpdated) onSellRequestUpdated(result.sellRequest);
        setStatusMessage(`Final price agreed: ₹${negotiatePriceInput}/${activeRequest.unit}! 97.5% Farmer / 1.5% FPO / 1% App Commission split verified.`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to record agreed price');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 12: Choose Transportation (App Logistics vs Own Transport)
  const handleSelectTransport = async (type: 'app_logistics' | 'own_transport') => {
    if (!activeRequest) return;
    setActionLoading(true);
    setTransportChoice(type);
    try {
      const transportPayload =
        type === 'app_logistics'
          ? {
              type: 'app_logistics' as const,
              transporterName: 'KisanSetu Express Rural Logistics',
              vehicleNumber: 'TS 03 UB 4419',
              driverName: 'Raju Goud',
              driverPhone: '+91 97001 88990',
              vehicleType: 'Tata 407 (2.5 MT Heavy Duty)',
              estimatedFreight: 1400,
              destinationMarket: 'Enamamula APMC Market Yard, Warangal',
              buyerName: 'Telangana Cotton Ginners & Exports',
              buyerCompany: 'Telangana Agri Ginners Consortium',
            }
          : {
              type: 'own_transport' as const,
              transporterName: 'Farmer Self-Arranged Transport',
              vehicleNumber: 'TS 03 TRACTOR 104',
              driverName: 'Self (Farmer Ramesh)',
              driverPhone: activeRequest.sellerPhone,
              vehicleType: 'Tractor Trolley (Self Freight)',
              estimatedFreight: 0,
              destinationMarket: 'Enamamula APMC Market Yard, Warangal',
              buyerName: 'Direct APMC Commission Agent',
              buyerCompany: 'Local Market Traders Asscn',
            };

      const updated = await selectTransportation(activeRequest.id, transportPayload);
      setActiveRequest(updated);
      if (onSellRequestUpdated) onSellRequestUpdated(updated);
      setStatusMessage(`Transportation confirmed via ${type === 'app_logistics' ? 'KisanSetu App Logistics' : 'Own Transport'}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to select transport');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 13: Produce Reaches Market & Transaction Marked Completed
  const handleCompleteTransaction = async () => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      const result = await completeSellTransaction(activeRequest.id);
      if (result.success && result.sellRequest) {
        setActiveRequest(result.sellRequest);
        if (onSellRequestUpdated) onSellRequestUpdated(result.sellRequest);
        setStatusMessage('Transaction completed! Seller received full money (97.5%), FPO Officer 1.5%, App Platform 1%.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const assignedOfficer =
    activeRequest?.assignedFpoOfficer ||
    SEED_FPO_OFFICERS.find((o) => o.district.toLowerCase() === district.toLowerCase()) ||
    SEED_FPO_OFFICERS[0];

  const totalExpectedValue = (Number(expectedPrice) || 0) * (Number(quantity) || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-900 flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0">
              <Wheat className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-heading tracking-tight text-white">
                  {activeView === 'form'
                    ? (initialProduceData?.cropName
                        ? `Sell ${initialProduceData.cropName} to FPO`
                        : 'Sell Produce • FPO Direct Field Linkage')
                    : `Sell Request #${activeRequest?.id || ''}`}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  {activeView === 'form' ? '13-Step Workflow' : activeRequest?.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {activeView === 'form'
                  ? 'FPO officer visits your farm, verifies grade, agrees price, and organizes transport.'
                  : `Assigned Officer: ${assignedOfficer.name} • Contact: ${assignedOfficer.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeRequest && activeView === 'form' && (
              <button
                type="button"
                onClick={() => setActiveView('tracker')}
                className="px-2.5 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-white"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Active Request</span>
              </button>
            )}
            {activeView === 'tracker' && (
              <button
                type="button"
                onClick={() => setActiveView('form')}
                className="px-2.5 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-white"
              >
                <span>+ New Sell Request</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Close"
              id="sell-modal-close-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage('')}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: SELL PRODUCE FORM */}
        {activeView === 'form' && (
          <form onSubmit={handleSubmitSellRequest} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Step 1: Pre-Selected Produce Card (Locked In - No repeated product questions) */}
            {initialProduceData?.cropName && !isChangingCrop ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Product for FPO Sale: <strong className="text-emerald-900">{selectedCrop}</strong></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsChangingCrop(true)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                    id="change-product-btn"
                  >
                    Change Product
                  </button>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border-2 border-emerald-500/60 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border-2 border-emerald-300 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                      {imageUrl ? (
                        <img src={imageUrl} alt={selectedCrop} className="w-full h-full object-cover" />
                      ) : (
                        <Wheat className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Product Locked for FPO</span>
                        </span>
                        {variety && (
                          <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                            {variety}
                          </span>
                        )}
                        {initialProduceData.mandiName && (
                          <span className="text-[10px] text-slate-600 font-mono">
                            • {initialProduceData.mandiName}
                          </span>
                        )}
                      </div>
                      <div className="text-base font-black font-heading text-slate-900 mt-1 truncate">
                        {selectedCrop}
                      </div>
                      <p className="text-[11px] text-emerald-800 font-mono font-semibold">
                        Offered Mandi Rate: ₹{expectedPrice?.toLocaleString('en-IN')}/{unit} • No re-selection required
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-black text-emerald-900 bg-white/95 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready for FPO Pickup</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    {initialProduceData?.cropName ? 'Select Different Produce' : '1. Select Produce / Product'}
                  </label>
                  {initialProduceData?.cropName ? (
                    <button
                      type="button"
                      onClick={() => setIsChangingCrop(false)}
                      className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Keep {selectedCrop}
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-bold">
                      Choose crop for farm-gate FPO pickup
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_CROPS.map((crop) => {
                    const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase();
                    return (
                      <button
                        key={crop.name}
                        type="button"
                        onClick={() => {
                          handleSelectCropPreset(crop);
                          if (initialProduceData?.cropName) {
                            setIsChangingCrop(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{crop.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs truncate">{crop.name}</div>
                          <div className="text-[10px] text-slate-500">₹{crop.benchmarkPrice}/{crop.unit}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Variety, Quantity, Expected Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Variety / Hybrid
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. BT-II Long Staple"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Quantity & Unit
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-emerald-600 focus:bg-white"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-1/3 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-[11px] focus:outline-emerald-600"
                  >
                    <option value="Quintals">Quintals</option>
                    <option value="Tonnes">Tonnes</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Crates">Crates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Expected Price (₹ / {unit})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    value={expectedPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setExpectedPrice(val);
                      setNegotiatePriceInput(val);
                    }}
                    required
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800 focus:outline-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Expected Total Produce Value Box */}
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
                  Total Expected Produce Value
                </span>
                <p className="text-[11px] text-emerald-700">
                  {quantity} {unit} × ₹{expectedPrice.toLocaleString('en-IN')}/{unit}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-heading text-emerald-900">
                  ₹{totalExpectedValue.toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">
                  (Final price negotiated at farm gate)
                </span>
              </div>
            </div>

            {/* Step 3: Produce Photos & Quality Details */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                2. Photos & Harvest Quality Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Expected Quality Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-emerald-600"
                  >
                    <option value="A">Grade A (Premium / Export / Mandi Super)</option>
                    <option value="B">Grade B (Standard APMC Commercial)</option>
                    <option value="C">Grade C (FAQ - Fair Average Quality)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Moisture Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Produce Photo Preview
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      src={imageUrl}
                      alt={selectedCrop}
                      className="w-12 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs"
                    />
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Photo Image URL"
                      className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] truncate focus:outline-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Quality & Harvest Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Clean picked harvest, zero rain moisture damage"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* Step 4: Seller Farm Gate Location (Visible to both sides) */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  3. Seller Location & Contact (Visible to FPO Officer)
                </label>
                <button
                  type="button"
                  onClick={handleUseGPSLocation}
                  disabled={isLocating}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Locating...' : 'Use GPS Location'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Seller Full Name
                  </label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Seller Phone Number (For FPO Officer to Call)
                  </label>
                  <input
                    type="tel"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Farm Gate Address / Survey No.
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Prominent Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Mandal</label>
                  <input
                    type="text"
                    value={mandal}
                    onChange={(e) => setMandal(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Warangal">Warangal</option>
                    <option value="Nizamabad">Nizamabad</option>
                    <option value="Karimnagar">Karimnagar</option>
                    <option value="Khammam">Khammam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Nearby Assigned FPO Officer Card Preview */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shrink-0">
                    FPO
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                      Nearby Assigned FPO Officer (Cluster Field Desk)
                    </span>
                    <h4 className="text-xs font-black text-slate-900">{assignedOfficer.name}</h4>
                    <p className="text-[11px] text-slate-600">{assignedOfficer.fpoOrganization}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/60 text-amber-900 font-bold text-xs">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{assignedOfficer.phone}</span>
                  </div>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Rating: {assignedOfficer.rating} ★ ({assignedOfficer.completedInspectionsCount} completed)</span>
                </div>
              </div>

              {/* Commission Transparency Explanation */}
              <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                  <span className="text-slate-500 block">Seller Payout</span>
                  <span className="text-xs font-black text-emerald-800">97%</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                  <span className="text-slate-500 block">FPO Officer</span>
                  <span className="text-xs font-black text-amber-800">2%</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                  <span className="text-slate-500 block">Platform App</span>
                  <span className="text-xs font-black text-indigo-800">1%</span>
                </div>
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                id="submit-sell-request-btn"
              >
                <Wheat className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Creating Sell Request...' : 'Create Sell Request (Assign FPO Officer)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: ACTIVE SELL REQUEST TIMELINE & INTERACTIVE 13-STEP ACTIONS */}
        {activeView === 'tracker' && activeRequest && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Request Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeRequest.imageUrl}
                  alt={activeRequest.crop}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      {activeRequest.crop} ({activeRequest.variety || 'Standard'})
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {activeRequest.quantity} {activeRequest.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Expected: ₹{activeRequest.expectedPricePerUnit}/{activeRequest.unit} (₹{activeRequest.expectedTotalAmount.toLocaleString('en-IN')})
                  </p>
                  <p className="text-[10px] text-slate-400">Created: {new Date(activeRequest.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                  <span>Status: {activeRequest.status.replace('_', ' ').toUpperCase()}</span>
                </span>
                <div className="text-[10px] text-slate-500 mt-1">
                  ID: <span className="font-mono font-bold text-slate-800">{activeRequest.id}</span>
                </div>
              </div>
            </div>

            {/* Step 4 & 5: FPO Officer Contact Card (Visible to Seller) */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 border border-amber-300">
                    <User className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block">
                      Assigned FPO Field Officer
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      {activeRequest.assignedFpoOfficer?.name || assignedOfficer.name}
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      {activeRequest.assignedFpoOfficer?.fpoOrganization || assignedOfficer.fpoOrganization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeRequest.assignedFpoOfficer?.phone || assignedOfficer.phone}`}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    id="call-fpo-officer-btn"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call ({activeRequest.assignedFpoOfficer?.phone || assignedOfficer.phone})</span>
                  </a>
                  <a
                    href={`https://wa.me/${(activeRequest.assignedFpoOfficer?.phone || assignedOfficer.phone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-all border border-emerald-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Step 7: Seller Farm Gate Location (Both Sides Can See) */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800 block">
                      Farm Gate Location (Visible to Seller & FPO Officer)
                    </span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      {activeRequest.sellerLocation.address}, {activeRequest.sellerLocation.village && `${activeRequest.sellerLocation.village}, `}
                      {activeRequest.sellerLocation.district}, {activeRequest.sellerLocation.state} - {activeRequest.sellerLocation.pincode}
                    </div>
                    <p className="text-[11px] text-sky-700 font-medium mt-0.5">
                      📍 Landmark: {activeRequest.sellerLocation.landmark}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      GPS Coordinates: Lat {activeRequest.sellerLocation.lat || 17.8423}, Lng {activeRequest.sellerLocation.lng || 79.6241}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeRequest.sellerLocation.lat || 17.8423},${activeRequest.sellerLocation.lng || 79.6241}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 bg-white text-sky-800 hover:bg-sky-50 border border-sky-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate Route</span>
                </a>
              </div>
            </div>

            {/* Step 9 & 10: Inspection Card & Price Negotiation with 97%/2%/1% Commission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inspection Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Physical Inspection</span>
                  </span>
                  {activeRequest.inspection ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Verified Grade {activeRequest.inspection.grade}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-semibold">Pending Inspection</span>
                  )}
                </div>

                {activeRequest.inspection ? (
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-500 font-medium">Inspected By: </span>
                      <span className="font-bold text-slate-900">{activeRequest.inspection.officerName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Moisture:</span>
                        <span className="font-bold text-slate-900">{activeRequest.inspection.moisturePercentage}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Foreign Matter:</span>
                        <span className="font-bold text-slate-900">{activeRequest.inspection.foreignMatterPercentage}%</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200">
                      "{activeRequest.inspection.qualityNotes}"
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-3">
                    FPO officer will physically inspect the produce at the farm gate to verify moisture, staple length, and grain quality.
                  </p>
                )}
              </div>

              {/* Commission Breakdown Card (Matching exact user requirement) */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span>Settlement & Commission (97.5% / 1.5% / 1%)</span>
                  </span>
                  {activeRequest.commissionBreakdown && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                      Verified
                    </span>
                  )}
                </div>

                {activeRequest.commissionBreakdown ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-emerald-200">
                      <span className="text-emerald-900 font-bold">Total Produce Value:</span>
                      <span className="text-sm font-black text-emerald-950">
                        ₹{activeRequest.commissionBreakdown.finalProduceValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-white p-2 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block">Seller Payout (97.5%)</span>
                        <span className="text-xs font-black text-emerald-700 block mt-0.5">
                          ₹{activeRequest.commissionBreakdown.sellerPayout.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block">FPO Officer (1.5%)</span>
                        <span className="text-xs font-black text-amber-700 block mt-0.5">
                          ₹{activeRequest.commissionBreakdown.fpoCommission.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-slate-500 block">App Platform (1%)</span>
                        <span className="text-xs font-black text-indigo-700 block mt-0.5">
                          ₹{activeRequest.commissionBreakdown.platformCommission.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-emerald-800 text-center font-semibold pt-1">
                      Exact Check: ₹{activeRequest.commissionBreakdown.sellerPayout.toLocaleString('en-IN')} + ₹{activeRequest.commissionBreakdown.fpoCommission.toLocaleString('en-IN')} + ₹{activeRequest.commissionBreakdown.platformCommission.toLocaleString('en-IN')} = ₹{activeRequest.commissionBreakdown.finalProduceValue.toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-emerald-900 font-medium">
                      Agreed final price will be recorded upon physical inspection.
                    </p>
                    <div className="text-[11px] text-emerald-800 bg-white/70 p-2.5 rounded-xl border border-emerald-200">
                      <strong>Example (₹50,000 Total Produce Value):</strong>
                      <div className="flex justify-between mt-1 text-[10px]">
                        <span>• Seller Receives (97.5%):</span>
                        <span className="font-bold">₹48,750</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>• FPO Officer (1.5%):</span>
                        <span className="font-bold">₹750</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>• App Platform (1%):</span>
                        <span className="font-bold">₹500</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 12: Transportation Details */}
            {activeRequest.transport && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>
                      {activeRequest.transport.type === 'app_logistics' ? '🚚 Booked through KisanSetu App' : '🚚 Own Transport (Self)'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    {activeRequest.transport.trackingStatus || 'Vehicle Assigned'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Vehicle:</span>
                    <span className="font-bold text-slate-900">{activeRequest.transport.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Reg Number:</span>
                    <span className="font-bold font-mono text-slate-900">{activeRequest.transport.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Driver:</span>
                    <span className="font-bold text-slate-900">{activeRequest.transport.driverName} ({activeRequest.transport.driverPhone})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Freight:</span>
                    <span className="font-bold text-slate-900">
                      {activeRequest.transport.estimatedFreight ? `₹${activeRequest.transport.estimatedFreight}` : 'Self-Arranged'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Step-by-Step Multi-Role Console */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Interactive Field Operation Simulator
                  </span>
                  <h4 className="text-xs font-bold text-white">
                    Advance Request Lifecycle Across Roles (FPO / Farmer / Buyer)
                  </h4>
                </div>
                {actionLoading && (
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                  </span>
                )}
              </div>

              {/* Step Action Buttons corresponding to prompt's 13 steps */}
              <div className="flex flex-wrap gap-2 pt-1">
                {/* Step 6: FPO accepts */}
                {activeRequest.status === 'pending_fpo' && (
                  <button
                    type="button"
                    onClick={handleAcceptRequest}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>FPO Officer Accepts Request</span>
                  </button>
                )}

                {/* Step 8 & 9: FPO travels & inspects OR direct Verified Product action */}
                {(activeRequest.status === 'fpo_accepted' || activeRequest.status === 'fpo_traveling' || activeRequest.status === 'inspecting') && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleVerifyProductQuick}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>✓ FPO Officer: Verified Product (Grade A Passed)</span>
                    </button>

                    {activeRequest.status === 'fpo_accepted' && (
                      <button
                        type="button"
                        onClick={handleTravelToSeller}
                        disabled={actionLoading}
                        className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5 text-white" />
                        <span>Travel to Farm Gate</span>
                      </button>
                    )}

                    {activeRequest.status === 'fpo_traveling' && (
                      <button
                        type="button"
                        onClick={handlePhysicalInspection}
                        disabled={actionLoading}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        <span>Field Inspection Notes</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Step 10 & 11: FPO confirms / negotiates actual final price */}
                {(activeRequest.status === 'inspecting' || (!activeRequest.finalPricePerUnit && activeRequest.status !== 'completed' && activeRequest.status !== 'price_agreed' && activeRequest.status !== 'transport_selected' && activeRequest.status !== 'in_transit' && activeRequest.status !== 'delivered')) && (
                  <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-300 font-bold">Negotiate Final Price: ₹</span>
                    <input
                      type="number"
                      value={negotiatePriceInput}
                      onChange={(e) => setNegotiatePriceInput(Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg text-xs font-bold text-amber-300"
                    />
                    <button
                      type="button"
                      onClick={handleNegotiatePrice}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Agree Price
                    </button>
                  </div>
                )}

                {/* Step 12: Product Verified -> Choose Transportation (App Shipment vs Own Transport) */}
                {activeRequest.status === 'price_agreed' && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl space-y-2 w-full">
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Product Verified by FPO Officer! Please Select Shipment Method:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleSelectTransport('app_logistics')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Truck className="w-4 h-4 text-amber-300" />
                        <span>🚚 App Shipment (KisanSetu Rural Logistics Tata 407)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTransport('own_transport')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Truck className="w-4 h-4 text-slate-300" />
                        <span>🚜 Own Transport (Farmer / Self-Arranged Tractor)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 13: Produce reaches market / buyer -> Transaction Completed */}
                {(activeRequest.status === 'transport_selected' || activeRequest.status === 'in_transit' || activeRequest.status === 'delivered') && (
                  <button
                    type="button"
                    onClick={handleCompleteTransaction}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Produce Reaches Market • Give Money (Full 97.5% Farmer / 1.5% FPO / 1% App)</span>
                  </button>
                )}

                {activeRequest.status === 'completed' && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Transaction Completed! Seller credited full ₹{activeRequest.commissionBreakdown?.sellerPayout.toLocaleString('en-IN')} (97.5%), FPO credited ₹{activeRequest.commissionBreakdown?.fpoCommission.toLocaleString('en-IN')} (1.5%), App credited ₹{activeRequest.commissionBreakdown?.platformCommission.toLocaleString('en-IN')} (1%).
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Official Status Audit Trail
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeRequest.statusLogs.map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-800 uppercase">{log.status.replace('_', ' ')}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700 mt-0.5">{log.note}</p>
                      <span className="text-[10px] text-slate-400">By: {log.actorName} ({log.actorRole})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveView('form')}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                ← Back to Create Form
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
