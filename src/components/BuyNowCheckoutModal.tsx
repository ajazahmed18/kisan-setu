import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Scale,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Building2,
  Cpu,
  Truck,
  Copy,
  Check,
  Navigation,
  Sparkles,
  QrCode,
  CreditCard,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { CropLot, UserProfile, Order, DeliveryAddressDetails } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BuyNowCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyingLot: CropLot | null;
  currentUser: UserProfile;
  onOrderPlaced: (order: Order) => void;
}

export const BuyNowCheckoutModal: React.FC<BuyNowCheckoutModalProps> = ({
  isOpen,
  onClose,
  buyingLot,
  currentUser,
  onOrderPlaced,
}) => {
  const { language } = useLanguage();

  // Quantity State
  const [orderQuantity, setOrderQuantity] = useState<number>(buyingLot?.quantity || 1);

  // Synchronize quantity whenever buyingLot changes or modal opens
  useEffect(() => {
    if (buyingLot) {
      setOrderQuantity(buyingLot.quantity);
    }
  }, [buyingLot]);

  // Delivery Address State
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddressDetails>({
    fullName: currentUser.name || 'Anand Mahindra',
    phone: currentUser.phone || '+91 98220 99887',
    pincode: '500011',
    addressLine: 'Wholesale Depot Shed No. 4, Bowenpally APMC Market Yard',
    city: 'Hyderabad',
    state: 'Telangana',
    addressType: 'Commercial Warehouse',
    deliverySlot: 'Express Delivery - Today before 5:00 PM',
    specialInstructions: 'Direct driver to Platform B unloading bay. Check crate seal security.',
  });

  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);

  // Payment Options State: 'upi' | 'escrow_bank' | 'blockchain' | 'cod'
  const [paymentType, setPaymentType] = useState<'upi' | 'escrow_bank' | 'blockchain' | 'cod'>('upi');

  // UPI Sub-options
  const [upiApp, setUpiApp] = useState<'phonepe' | 'gpay' | 'paytm' | 'bhim'>('phonepe');
  const [phonePeId, setPhonePeId] = useState<string>(
    currentUser.phone ? `${currentUser.phone.replace(/[^0-9]/g, '').slice(-10)}@ybl` : '9822099887@ybl'
  );
  const [gpayId, setGpayId] = useState<string>('buyer.agri@okhdfcbank');
  const [customUpiId, setCustomUpiId] = useState<string>('kisan.trade@upi');
  const [upiVerifiedUtr, setUpiVerifiedUtr] = useState<string>('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState<boolean>(false);

  // Bank Transfer Sub-options
  const [bankName, setBankName] = useState<string>('State Bank of India');
  const [bankUtr, setBankUtr] = useState<string>('SBIN-RTGS-928174092');
  const [copiedEscrowAccount, setCopiedEscrowAccount] = useState<boolean>(false);

  // Blockchain Sub-options
  const [blockchainNetwork, setBlockchainNetwork] = useState<string>('Polygon AgriChain (PoS - Instant Finality)');
  const [blockchainCrypto, setBlockchainCrypto] = useState<'USDT' | 'MATIC' | 'USDC'>('USDT');
  const [isExecutingBlockchain, setIsExecutingBlockchain] = useState<boolean>(false);
  const [blockchainStep, setBlockchainStep] = useState<number>(0); // 0: idle, 1: sign, 2: node consensus, 3: mined
  const [blockchainTxHash, setBlockchainTxHash] = useState<string>('');
  const [blockchainBlockNumber, setBlockchainBlockNumber] = useState<number>(1842915);

  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  const totalAmount = (buyingLot?.expectedPrice || 0) * orderQuantity;

  // Live conversion rates
  const usdtAmount = (totalAmount / 86.8).toFixed(2);
  const maticAmount = (totalAmount / 58.4).toFixed(2);

  // GPS Auto-detect
  const handleAutoDetectGps = () => {
    if ('geolocation' in navigator) {
      setIsLocatingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingGps(false);
          setDeliveryAddress((prev) => ({
            ...prev,
            addressLine: `GPS Depot: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`,
            city: 'Hyderabad / Warangal Corridor',
            state: 'Telangana',
            pincode: '500001',
          }));
        },
        () => {
          setIsLocatingGps(false);
          setDeliveryAddress((prev) => ({
            ...prev,
            addressLine: 'Wholesale Depot Shed No. 4, Bowenpally APMC Market Yard',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500011',
          }));
        },
        { timeout: 5000 }
      );
    }
  };

  // UPI verification simulation
  const handleVerifyUpi = () => {
    setIsVerifyingUpi(true);
    setTimeout(() => {
      const generatedUtr =
        upiApp === 'phonepe'
          ? `YBL-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
          : upiApp === 'gpay'
          ? `OKHDFC-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
          : `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setUpiVerifiedUtr(generatedUtr);
      setIsVerifyingUpi(false);
    }, 800);
  };

  // Blockchain smart contract execution simulation
  const handleExecuteBlockchainEscrow = () => {
    setIsExecutingBlockchain(true);
    setBlockchainStep(1);

    setTimeout(() => {
      setBlockchainStep(2);
      setTimeout(() => {
        setBlockchainStep(3);
        const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
        setBlockchainTxHash(txHash);
        setBlockchainBlockNumber((prev) => prev + Math.floor(1 + Math.random() * 5));
        setIsExecutingBlockchain(false);
      }, 1000);
    }, 900);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('39482019482910');
    setCopiedEscrowAccount(true);
    setTimeout(() => setCopiedEscrowAccount(false), 2000);
  };

  const handleFinalCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);

    const orderId = `OD-${Math.floor(100000000 + Math.random() * 900000000)}`;

    let finalPaymentMethodStr = 'UPI (PhonePe/GPay)';
    if (paymentType === 'upi') {
      finalPaymentMethodStr = `UPI (${upiApp === 'phonepe' ? 'PhonePe' : upiApp === 'gpay' ? 'Google Pay' : 'BHIM'})`;
    } else if (paymentType === 'escrow_bank') {
      finalPaymentMethodStr = 'Direct Bank Transfer (NEFT/RTGS Escrow)';
    } else if (paymentType === 'blockchain') {
      finalPaymentMethodStr = `Blockchain Smart Contract (${blockchainCrypto} on ${blockchainNetwork.split(' ')[0]})`;
    } else {
      finalPaymentMethodStr = 'Cash on Delivery (COD)';
    }

    const assignedDriver = {
      name: 'Ramu Yadav',
      phone: '+91 97001 88990',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      vehicleNumber: 'TS 03 UA 5678',
      vehicleType: 'Eicher Pro 14ft (Insulated Crate Carrier)',
      currentLocationName: 'Highway Bypass Toll Gate (12.4 km away)',
      etaMinutes: 24,
      distanceRemainingKm: 12.4,
    };

    const newOrder: Order = {
      id: orderId,
      lotId: buyingLot.id,
      crop: buyingLot.crop,
      quantity: orderQuantity,
      unit: buyingLot.unit,
      farmerId: buyingLot.farmerId,
      farmerName: buyingLot.farmerName,
      farmerPhone: buyingLot.farmerPhone || '+91 98480 23456',
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerCompany: currentUser.businessName || 'Verified Agro Procurement Ltd',
      agreedPrice: buyingLot.expectedPrice,
      totalAmount: totalAmount,
      currentStep: 6, // In Transit with live GPS tracking
      status: 'In Transit',
      transportId: 'TRP-101',
      transporterName: 'Express Logistics Fleet',
      vehicleNumber: 'TS 03 UA 5678',
      vehicleType: 'Eicher Pro 14ft (Insulated Crate Carrier)',
      pickupLocation: buyingLot.location,
      deliveryLocation: `${deliveryAddress.addressLine}, ${deliveryAddress.city}`,
      createdAt: 'Just now',
      paymentStatus: paymentType === 'cod' ? 'pending' : 'completed',
      paymentMethod: finalPaymentMethodStr,
      paymentType: paymentType,
      codStatus: paymentType === 'cod' ? 'pending_collection' : undefined,
      itemImageUrl: buyingLot.imageUrl,
      deliveryAddress: { ...deliveryAddress },
      driverDetails: assignedDriver,
      upiApp: paymentType === 'upi' ? upiApp : undefined,
      upiUtrNumber: paymentType === 'upi' ? upiVerifiedUtr || `UPI-${Date.now().toString().slice(-8)}` : undefined,
      bankUtrNumber: paymentType === 'escrow_bank' ? bankUtr : undefined,
      blockchainTxHash:
        paymentType === 'blockchain'
          ? blockchainTxHash || `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
          : undefined,
      blockNumber: paymentType === 'blockchain' ? blockchainBlockNumber : undefined,
      blockchainNetwork: paymentType === 'blockchain' ? blockchainNetwork : undefined,
    };

    setTimeout(() => {
      onOrderPlaced(newOrder);
      setIsSubmittingOrder(false);
      onClose();
    }, 500);
  };

  if (!isOpen || !buyingLot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-900 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-slate-900 text-slate-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center text-xl backdrop-blur-xs border border-white/40 shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-slate-950">
                  Instant Farm Purchase &amp; Escrow Checkout
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black text-amber-300">
                  {buyingLot.id}
                </span>
              </div>
              <p className="text-xs text-slate-900/80 font-medium">
                Direct procurement from <strong>{buyingLot.farmerName}</strong> • Zero APMC Cess
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-950 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFinalCheckout} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Produce Item Card */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={buyingLot.imageUrl}
                alt={buyingLot.crop}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">
                    {buyingLot.crop}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Grade {buyingLot.grade}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] truncate">
                  Variety: <strong className="text-slate-700">{buyingLot.variety}</strong> • Moisture: {buyingLot.moisture}%
                </p>
                <p className="text-slate-500 text-[10.5px] truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Farm Yard: {buyingLot.location}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Agreed Rate
              </span>
              <span className="font-mono font-black text-slate-950 text-base">
                ₹{buyingLot.expectedPrice.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">/{buyingLot.unit === 'Quintals' ? 'Q' : buyingLot.unit}</span>
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                Select Procurement Quantity ({buyingLot.unit}):
              </label>
              <span className="font-mono font-black text-slate-900 text-sm">
                {orderQuantity} {buyingLot.unit}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderQuantity((q) => Math.max(1, q - 5))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                -5
              </button>
              <input
                type="range"
                min="1"
                max={buyingLot.quantity}
                step="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setOrderQuantity((q) => Math.min(buyingLot.quantity, q + 5))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => setOrderQuantity(buyingLot.quantity)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold cursor-pointer whitespace-nowrap"
              >
                All ({buyingLot.quantity} {buyingLot.unit})
              </button>
            </div>
          </div>

          {/* STEP 1: DELIVERY LOCATION */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-heading font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                1. Delivery Location &amp; Recipient Details
              </span>
              <button
                type="button"
                onClick={handleAutoDetectGps}
                className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>{isLocatingGps ? 'Locating...' : '📍 Use Current GPS'}</span>
              </button>
            </div>

            {/* Consignee & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Receiver Name / Consignee
                </label>
                <input
                  type="text"
                  value={deliveryAddress.fullName}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Contact Mobile (For Transporter Driver)
                </label>
                <input
                  type="tel"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Address Line */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Delivery Address (Warehouse / Mandi Stall / Depot)
              </label>
              <input
                type="text"
                value={deliveryAddress.addressLine}
                onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, addressLine: e.target.value }))}
                placeholder="e.g. Wholesale Depot Shed 4, Bowenpally APMC Market Yard"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            {/* City, State, PIN */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  City / Mandi Hub
                </label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, state: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={deliveryAddress.pincode}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Quick Hub Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-400">Quick Hubs:</span>
              <button
                type="button"
                onClick={() =>
                  setDeliveryAddress((prev) => ({
                    ...prev,
                    addressLine: 'Wholesale Depot Shed No. 4, Bowenpally APMC Market Yard',
                    city: 'Hyderabad',
                    state: 'Telangana',
                    pincode: '500011',
                  }))
                }
                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-[10px] font-semibold transition-all cursor-pointer"
              >
                Bowenpally APMC Shed 4
              </button>
              <button
                type="button"
                onClick={() =>
                  setDeliveryAddress((prev) => ({
                    ...prev,
                    addressLine: 'Enamamula Grain Terminal Gate 2, Commercial Yard',
                    city: 'Warangal',
                    state: 'Telangana',
                    pincode: '506002',
                  }))
                }
                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-[10px] font-semibold transition-all cursor-pointer"
              >
                Warangal APMC Yard
              </button>
            </div>
          </div>

          {/* STEP 2: PAYMENT METHOD (UPI PhonePe/GPay, Bank Transfer, Blockchain, COD) */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-heading font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                2. Select Payment Method
              </span>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <Lock className="w-3 h-3" /> 100% Escrow Protection
              </span>
            </div>

            {/* 4 Main Payment Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentType('upi')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentType === 'upi'
                    ? 'bg-purple-50/80 border-purple-600 shadow-sm ring-2 ring-purple-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">📱</span>
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === 'upi'}
                    onChange={() => setPaymentType('upi')}
                    className="accent-purple-600"
                  />
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-slate-900">UPI Payments</div>
                  <div className="text-[10px] text-purple-700 font-semibold">PhonePe &amp; GPay</div>
                </div>
              </button>

              {/* Bank Transfer Option */}
              <button
                type="button"
                onClick={() => setPaymentType('escrow_bank')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentType === 'escrow_bank'
                    ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">🏦</span>
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === 'escrow_bank'}
                    onChange={() => setPaymentType('escrow_bank')}
                    className="accent-blue-600"
                  />
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-slate-900">Direct Bank Transfer</div>
                  <div className="text-[10px] text-blue-700 font-semibold">NEFT / RTGS Escrow</div>
                </div>
              </button>

              {/* Blockchain Option */}
              <button
                type="button"
                onClick={() => setPaymentType('blockchain')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentType === 'blockchain'
                    ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">⛓️</span>
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === 'blockchain'}
                    onChange={() => setPaymentType('blockchain')}
                    className="accent-emerald-600"
                  />
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-slate-900">Blockchain Smart Contract</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Polygon Web3 Escrow</div>
                </div>
              </button>

              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentType('cod')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentType === 'cod'
                    ? 'bg-amber-50/80 border-amber-600 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">💵</span>
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === 'cod'}
                    onChange={() => setPaymentType('cod')}
                    className="accent-amber-600"
                  />
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-slate-900">Cash on Delivery</div>
                  <div className="text-[10px] text-amber-700 font-semibold">Pay upon weighment</div>
                </div>
              </button>
            </div>

            {/* DETAIL PANEL: UPI (PhonePe / GPay / BHIM) */}
            {paymentType === 'upi' && (
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-950 text-xs">Choose UPI App:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setUpiApp('phonepe')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          upiApp === 'phonepe'
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        <span>🟣 PhonePe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiApp('gpay')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          upiApp === 'gpay'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🔵 Google Pay (GPay)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiApp('bhim')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          upiApp === 'bhim'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        QR Code
                      </button>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-purple-800">Instant Settlement</span>
                </div>

                {/* Sub-view for PhonePe */}
                {upiApp === 'phonepe' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-purple-900">
                        Enter PhonePe VPA / Mobile:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={phonePeId}
                          onChange={(e) => setPhonePeId(e.target.value)}
                          placeholder="e.g. 9822099887@ybl"
                          className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <p className="text-[10.5px] text-purple-800">
                        PhonePe Escrow handle: <code>kisan.escrow@ybl</code>
                      </p>
                      <button
                        type="button"
                        onClick={handleVerifyUpi}
                        disabled={isVerifyingUpi}
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isVerifyingUpi ? 'Verifying with PhonePe...' : 'Verify & Authorize PhonePe'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-200 text-center space-y-1">
                      <div className="w-24 h-24 bg-slate-900 mx-auto rounded-xl p-1.5 shadow-xs flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 block">
                        Scan with PhonePe Scanner
                      </span>
                      <span className="text-[10.5px] font-mono font-bold text-purple-900">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sub-view for Google Pay */}
                {upiApp === 'gpay' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-blue-950">
                        Enter Google Pay (GPay) UPI ID:
                      </label>
                      <input
                        type="text"
                        value={gpayId}
                        onChange={(e) => setGpayId(e.target.value)}
                        placeholder="e.g. buyer@okhdfcbank"
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-[10.5px] text-blue-800">
                        Google Pay Escrow handle: <code>kisan.escrow@okhdfcbank</code>
                      </p>
                      <button
                        type="button"
                        onClick={handleVerifyUpi}
                        disabled={isVerifyingUpi}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isVerifyingUpi ? 'Connecting to GPay...' : 'Verify & Authorize Google Pay'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-200 text-center space-y-1">
                      <div className="w-24 h-24 bg-slate-900 mx-auto rounded-xl p-1.5 shadow-xs flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 block">
                        Scan with Google Pay App
                      </span>
                      <span className="text-[10.5px] font-mono font-bold text-blue-900">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sub-view for BHIM / Any UPI */}
                {upiApp === 'bhim' && (
                  <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-900 rounded-xl p-1 text-white flex items-center justify-center">
                        <QrCode className="w-14 h-14" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Dynamic Multi-UPI QR Code</div>
                        <p className="text-[10.5px] text-slate-500">
                          Compatible with Paytm, BHIM, Cred, and all bank UPI apps.
                        </p>
                        <span className="font-mono text-xs font-bold text-purple-900">
                          ₹{totalAmount.toLocaleString('en-IN')} (Zero surcharge)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyUpi}
                      className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                    >
                      Simulate Scan
                    </button>
                  </div>
                )}

                {/* Verified UTR Banner */}
                {upiVerifiedUtr && (
                  <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Verified UPI Transaction UTR: <code className="font-mono font-bold">{upiVerifiedUtr}</code>
                    </span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded font-bold">Authorized</span>
                  </div>
                )}
              </div>
            )}

            {/* DETAIL PANEL: DIRECT BANK TRANSFER (NEFT / RTGS) */}
            {paymentType === 'escrow_bank' && (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    KisanSetu Virtual Escrow Bank Details (State Bank of India)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    Zero RTGS Fee
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-500 block">Beneficiary Name</span>
                    <span className="font-bold text-slate-900 text-[11px] block truncate">
                      KisanSetu Clearing Escrow
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-500 block">Account Number</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-900 text-xs">39482019482910</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold ml-1"
                      >
                        {copiedEscrowAccount ? '✓' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-500 block">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">SBIN0020145</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-500 block">Bank Branch</span>
                    <span className="font-medium text-slate-800 text-[10.5px]">Warangal APMC Hub</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      Remitting Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India, HDFC, ICICI"
                      className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10.5px] font-bold text-slate-700">
                        NEFT / RTGS / IMPS UTR Reference Number
                      </label>
                      <button
                        type="button"
                        onClick={() => setBankUtr(`SBIN-RTGS-${Math.floor(10000000 + Math.random() * 90000000)}`)}
                        className="text-[10px] text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Autofill Demo UTR
                      </button>
                    </div>
                    <input
                      type="text"
                      value={bankUtr}
                      onChange={(e) => setBankUtr(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs font-mono font-bold text-blue-900 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL PANEL: BLOCKCHAIN SMART CONTRACT (Web3 Escrow) */}
            {paymentType === 'blockchain' && (
              <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800 space-y-3.5 shadow-md animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⛓️</span>
                    <div>
                      <div className="font-extrabold text-emerald-300 text-xs">
                        Decentralized Web3 Smart Contract Escrow
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Network: {blockchainNetwork}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Smart Contract: 0x71C9...B42a
                  </span>
                </div>

                {/* Token and Conversion Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-emerald-300 block">Selected Asset</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {(['USDT', 'MATIC', 'USDC'] as const).map((token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => setBlockchainCrypto(token)}
                          className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            blockchainCrypto === token
                              ? 'bg-emerald-500 text-slate-950 shadow-xs'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-emerald-300 block">Escrow Lock Amount</span>
                    <span className="font-mono font-black text-emerald-400 text-base block mt-0.5">
                      {blockchainCrypto === 'USDT'
                        ? `${usdtAmount} USDT`
                        : blockchainCrypto === 'MATIC'
                        ? `${maticAmount} MATIC`
                        : `${usdtAmount} USDC`}
                    </span>
                    <span className="text-[9.5px] text-slate-300">≈ ₹{totalAmount.toLocaleString('en-IN')} INR</span>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-emerald-300 block">Network Gas Fee</span>
                    <span className="font-mono font-bold text-white text-xs block mt-0.5">
                      0.0012 MATIC (~₹0.07)
                    </span>
                    <span className="text-[9.5px] text-emerald-400 font-semibold">Instant Polygon PoS</span>
                  </div>
                </div>

                {/* Interactive Blockchain Execution */}
                <div className="p-3 bg-black/40 rounded-xl border border-emerald-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-emerald-200">
                      Smart Contract Verification Sequence:
                    </span>
                    <button
                      type="button"
                      onClick={handleExecuteBlockchainEscrow}
                      disabled={isExecutingBlockchain}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-black rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isExecutingBlockchain ? '⚡ Mining Block...' : '⚡ Execute Smart Contract Proof'}
                    </button>
                  </div>

                  {/* Visual Steps */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div
                      className={`p-2 rounded-lg border ${
                        blockchainStep >= 1
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      1. Sign Web3 Payload {blockchainStep >= 1 && '✓'}
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        blockchainStep >= 2
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      2. Validator Consensus {blockchainStep >= 2 && '✓'}
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        blockchainStep >= 3
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      3. Block Confirmed {blockchainStep >= 3 && '✓'}
                    </div>
                  </div>

                  {/* Blockchain Block Result */}
                  {blockchainTxHash && (
                    <div className="p-2 bg-emerald-900/40 rounded-lg border border-emerald-600/60 text-[10.5px] space-y-1">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span>⛓️ On-Chain Escrow Confirmed</span>
                        <span>Block #{blockchainBlockNumber}</span>
                      </div>
                      <div className="font-mono text-white text-[10px] break-all">
                        Tx Hash: {blockchainTxHash}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-emerald-200/80 leading-relaxed">
                  <strong>Trustless Guarantee:</strong> Funds remain securely locked in the smart contract escrow and automatically execute release to the farmer upon GPS transit completion and weighment validation.
                </p>
              </div>
            )}

            {/* DETAIL PANEL: CASH ON DELIVERY */}
            {paymentType === 'cod' && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in duration-150">
                <div className="font-bold flex items-center gap-1.5">
                  <span>💵 Cash on Delivery (COD)</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Pay the verified transporter driver <strong>Ramu Yadav ({deliveryAddress.phone})</strong> directly upon unloading at your facility post weighment slip verification.
                </p>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>
                Produce Value ({orderQuantity} {buyingLot.unit} × ₹{buyingLot.expectedPrice}):
              </span>
              <span className="font-mono font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>APMC e-Nam Assaying &amp; Direct Gate Cess:</span>
              <span className="text-emerald-400 font-semibold">FREE (KisanSetu Direct)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Logistics Transit &amp; Tarpaulin Crate Carrier:</span>
              <span className="text-emerald-400 font-semibold">Included</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between font-mono">
              <span className="font-bold text-sm text-slate-200">Total Payable Amount:</span>
              <span className="text-xl font-black text-amber-400">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {paymentType === 'cod'
                ? '💵 Cash on Delivery selected. Hand over exact cash upon produce arrival & weighment.'
                : paymentType === 'blockchain'
                ? `⛓️ Smart contract escrow locks ${blockchainCrypto === 'USDT' ? usdtAmount + ' USDT' : maticAmount + ' MATIC'}. Released upon delivery confirmation.`
                : '🔒 Secured with KisanSetu Digital Escrow. Released to farmer post APMC weighment certificate.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmittingOrder}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="confirm-pay-and-order-btn"
            >
              <span>
                {isSubmittingOrder
                  ? 'Initiating Consignment & Order Progress...'
                  : `⚡ CONFIRM & PLACE ORDER (₹${totalAmount.toLocaleString('en-IN')})`}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
