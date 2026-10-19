import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import {
  TransportBooking,
  fetchTransportBookings,
  createFarmerTransportBooking,
  updateBookingStatus,
  getDriverDutyStatus,
  setDriverDutyStatus,
  playRapidoTripAlertSound,
} from '../services/transportRapidoService';
import {
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Navigation,
  KeyRound,
  DollarSign,
  AlertCircle,
  Check,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  RotateCw,
  Award,
  Wallet,
  Gauge,
  X,
  Radio,
  Sliders,
} from 'lucide-react';

interface TransporterPortalProps {
  currentUser: UserProfile;
  orders?: any[];
  transporters?: any[];
  onAssignTransportToOrder?: (orderId: string, vehicleId: string) => void;
  onAdvanceOrderStatus?: (orderId: string) => void;
}

export const TransporterPortal: React.FC<TransporterPortalProps> = ({
  currentUser,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(getDriverDutyStatus());
  const [bookings, setBookings] = useState<TransportBooking[]>([]);
  const [activeTrip, setActiveTrip] = useState<TransportBooking | null>(null);
  const [incomingTrip, setIncomingTrip] = useState<TransportBooking | null>(null);
  const [countdown, setCountdown] = useState<number>(45);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'console' | 'history' | 'wallet'>('console');

  // Active Trip State
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [transitProgress, setTransitProgress] = useState<number>(0);
  const [isSimulatingTransit, setIsSimulatingTransit] = useState<boolean>(false);
  const [loadedWeightConfirmed, setLoadedWeightConfirmed] = useState<boolean>(false);
  const [tripCompletedSuccess, setTripCompletedSuccess] = useState<TransportBooking | null>(null);

  // Driver metrics
  const [todayEarnings, setTodayEarnings] = useState<number>(5900);
  const [completedTripsCount, setCompletedTripsCount] = useState<number>(2);

  // Load bookings
  const loadBookings = async () => {
    const list = await fetchTransportBookings();
    setBookings(list);

    // Look for any active trip in progress
    const active = list.find(
      (b) =>
        b.status === 'accepted' ||
        b.status === 'en_route_pickup' ||
        b.status === 'arrived_pickup' ||
        b.status === 'crop_loaded' ||
        b.status === 'in_transit'
    );
    if (active) {
      setActiveTrip(active);
      setIncomingTrip(null);
    } else {
      // Look for an incoming pending booking if driver is online
      const pending = list.find((b) => b.status === 'incoming');
      if (pending && isOnline) {
        setIncomingTrip(pending);
      } else {
        setIncomingTrip(null);
      }
    }
  };

  useEffect(() => {
    loadBookings();

    const handleTransportUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setBookings(e.detail);
        const pending = e.detail.find((b: TransportBooking) => b.status === 'incoming');
        if (pending && isOnline && !activeTrip) {
          setIncomingTrip(pending);
          if (soundEnabled) playRapidoTripAlertSound();
        }
      }
    };

    window.addEventListener('kisansetu_transport_updated', handleTransportUpdate);
    return () => {
      window.removeEventListener('kisansetu_transport_updated', handleTransportUpdate);
    };
  }, [isOnline, activeTrip, soundEnabled]);

  // Countdown timer for incoming trip alert
  useEffect(() => {
    if (!incomingTrip) {
      setCountdown(45);
      return;
    }

    if (soundEnabled) {
      playRapidoTripAlertSound();
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRejectTrip(incomingTrip.id);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingTrip?.id, soundEnabled]);

  // Duty status toggle
  const handleToggleDuty = (online: boolean) => {
    setIsOnline(online);
    setDriverDutyStatus(online);
    if (!online) {
      setIncomingTrip(null);
    } else {
      // Check if there is an incoming booking to notify
      const pending = bookings.find((b) => b.status === 'incoming');
      if (pending && !activeTrip) {
        setIncomingTrip(pending);
        if (soundEnabled) playRapidoTripAlertSound();
      }
    }
  };

  // Accept Trip (Rapido Style)
  const handleAcceptTrip = async (bookingId: string) => {
    const updated = await updateBookingStatus(bookingId, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });
    setIncomingTrip(null);
    setActiveTrip(updated);
    setLoadedWeightConfirmed(false);
    setEnteredOtp('');
    setOtpError(null);
    setTransitProgress(0);
    loadBookings();
  };

  // Reject Trip
  const handleRejectTrip = async (bookingId: string) => {
    await updateBookingStatus(bookingId, {
      status: 'rejected',
    });
    setIncomingTrip(null);
    loadBookings();
  };

  // Arrive at Farm Gate
  const handleArriveAtFarm = async () => {
    if (!activeTrip) return;
    const updated = await updateBookingStatus(activeTrip.id, {
      status: 'arrived_pickup',
    });
    setActiveTrip(updated);
  };

  // Verify Farmer OTP
  const handleVerifyOtp = async () => {
    if (!activeTrip) return;
    if (enteredOtp.trim() !== activeTrip.pickupOtp) {
      setOtpError(`Incorrect OTP. Please ask farmer ${activeTrip.farmerName} for their 4-digit code (Hint: ${activeTrip.pickupOtp})`);
      return;
    }
    setOtpError(null);
    const updated = await updateBookingStatus(activeTrip.id, {
      status: 'crop_loaded',
    });
    setActiveTrip(updated);
    setLoadedWeightConfirmed(true);
  };

  // Start Transit to Mandi / Yard
  const handleStartTransit = async () => {
    if (!activeTrip) return;
    const updated = await updateBookingStatus(activeTrip.id, {
      status: 'in_transit',
    });
    setActiveTrip(updated);
    setIsSimulatingTransit(true);

    // Simulate GPS transit progress over 6 seconds
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setTransitProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsSimulatingTransit(false);
      }
    }, 1200);
  };

  // Complete Trip & Collect Payout
  const handleCompleteTrip = async () => {
    if (!activeTrip) return;
    const fare = activeTrip.estimatedFare;
    const updated = await updateBookingStatus(activeTrip.id, {
      status: 'delivered',
      paymentCollected: true,
      deliveredAt: new Date().toISOString(),
    });

    setTodayEarnings((prev) => prev + fare);
    setCompletedTripsCount((prev) => prev + 1);
    setTripCompletedSuccess(updated);
    setActiveTrip(null);
    loadBookings();
  };

  // Quick test: simulate an incoming farmer booking
  const handleSimulateFarmerBooking = async () => {
    const crops = ['Cotton (BT-II)', 'Tomato (Hybrid)', 'Red Chilli (Teja)', 'Rice (Paddy)'];
    const randomCrop = crops[Math.floor(Math.random() * crops.length)];
    const randomQty = Math.floor(Math.random() * 30 + 15);
    const villages = [
      { name: 'Rampur Village', mandal: 'Geesugonda', dist: 'Warangal' },
      { name: 'Rayaparthi Village', mandal: 'Wardhanapet', dist: 'Warangal' },
      { name: 'Dharmasagar Village', mandal: 'Dharmasagar', dist: 'Hanamkonda' },
    ];
    const pick = villages[Math.floor(Math.random() * villages.length)];

    await createFarmerTransportBooking({
      farmerId: `usr-farmer-${Date.now().toString().slice(-4)}`,
      farmerName: 'Ramesh Reddy (Verified Farmer)',
      farmerPhone: '+91 98480 23456',
      crop: randomCrop,
      variety: 'Grade-A Fresh Harvest',
      quantity: randomQty,
      unit: 'Quintals',
      pickupLocation: {
        address: `Farm Gate Plot #7, ${pick.name}`,
        village: pick.name,
        mandal: pick.mandal,
        district: pick.dist,
        landmark: 'Near Water Tank & Panchayat Hall',
      },
      dropLocation: {
        name: 'Warangal APMC Enamamula Market Yard',
        address: 'Wholesale Lorry Platform #4',
        city: 'Warangal',
      },
      estimatedDistanceKm: Math.floor(Math.random() * 20 + 18),
      vehicleTypeRequired: randomQty > 20 ? 'Heavy Lorry (10 Ton)' : 'Tata 407 (2.5 Ton)',
      paymentType: 'cod',
    });

    loadBookings();
  };

  const completedTripsList = bookings.filter((b) => b.status === 'delivered');

  return (
    <div className="space-y-6 py-2 text-left" id="transporter-rapido-portal">
      {/* DRIVER PARTNER HEADER & DUTY STATUS TOGGLE (RAPIDO CAPTAIN STYLE) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Driver & Vehicle Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-mono font-bold text-xl shrink-0 shadow-sm ring-4 ring-amber-100">
                <Truck className="w-8 h-8 text-slate-950" />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                  {currentUser.businessName || currentUser.name || 'Shankar Agri Transport Fleet'}
                </h2>
                <span className="bg-amber-100 text-amber-950 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Rapido Freight Partner
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-mono font-semibold px-2 py-0.5 rounded-md border border-slate-200">
                  TS 03 UA 5678 • Heavy Lorry (10 Ton)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium mt-1">
                <span>Driver: <strong>Shankar Rao</strong></span>
                <span className="text-slate-300">•</span>
                <span>DL: <strong>TS-03-2019-0048192</strong></span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-emerald-800">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Rating: <strong>4.9 ★ (184 Farmer Trips)</strong>
                </span>
              </div>
            </div>
          </div>

          {/* ONLINE / OFFLINE DUTY CONTROLLER & TEST TRIGGER */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title={soundEnabled ? 'Alert Chime: ON' : 'Alert Chime: MUTED'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Test Farmer Booking Simulator */}
            <button
              type="button"
              onClick={handleSimulateFarmerBooking}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Test a simulated farmer crop transport booking request"
            >
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Simulate Farmer Booking</span>
            </button>

            {/* Large Online/Offline Duty Switch */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleToggleDuty(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isOnline
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                <span>ONLINE (DUTY ON)</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleDuty(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isOnline
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>OFFLINE</span>
              </button>
            </div>
          </div>
        </div>

        {/* METRICS ROW (EARNINGS & TRIPS TODAY) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Today's Earnings</span>
            <span className="text-xl font-mono font-black text-slate-900">₹{todayEarnings.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Completed Trips</span>
            <span className="text-xl font-mono font-black text-slate-900">{completedTripsCount} Trips</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Acceptance Rate</span>
            <span className="text-xl font-mono font-black text-emerald-700">98.5%</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Duty Radar</span>
            <span className={`text-xs font-bold flex items-center gap-1.5 mt-1 ${isOnline ? 'text-emerald-700' : 'text-slate-500'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isOnline ? 'Searching Pickups...' : 'Stationary / Rest'}
            </span>
          </div>
        </div>
      </div>

      {/* TRIP COMPLETED CELEBRATION MODAL / BANNER */}
      {tripCompletedSuccess && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl shadow-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
              ✓
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-900 font-heading">
                Trip Completed! Fare of ₹{tripCompletedSuccess.estimatedFare.toLocaleString()} Collected
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Successfully unloaded {tripCompletedSuccess.quantity} {tripCompletedSuccess.unit} {tripCompletedSuccess.crop} at {tripCompletedSuccess.dropLocation.name}. Farmer {tripCompletedSuccess.farmerName} has confirmed delivery.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTripCompletedSuccess(null)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
          >
            Done & Ready Next Trip
          </button>
        </div>
      )}

      {/* 1. INCOMING TRIP POPUP NOTIFICATION (RAPIDO STYLE PULSE & CHIME) */}
      {incomingTrip && isOnline && (
        <div className="p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 rounded-3xl text-white shadow-xl border-4 border-amber-300 ring-4 ring-amber-500/30 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-400/40">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-white animate-ping" />
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-black uppercase tracking-wider border border-white/30">
                🔔 INCOMING CROP PICKUP REQUEST
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-amber-100">Auto-pass in:</span>
              <span className="w-9 h-9 rounded-full bg-white text-slate-950 font-mono font-black text-sm flex items-center justify-center shadow-md">
                {countdown}s
              </span>
            </div>
          </div>

          {/* Main Pickup & Drop Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-5 items-center">
            {/* Farmer & Crop details */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                  {incomingTrip.id}
                </span>
                <span className="text-xs font-bold bg-amber-900/40 px-2.5 py-0.5 rounded-full">
                  Farmer Booked Transport
                </span>
              </div>
              <h3 className="text-2xl font-black text-white font-heading tracking-tight">
                {incomingTrip.crop} ({incomingTrip.quantity} {incomingTrip.unit})
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Farmer: <strong className="text-white text-sm">{incomingTrip.farmerName}</strong> • {incomingTrip.farmerPhone}
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-black/20 text-xs font-mono text-amber-200">
                Vehicle: {incomingTrip.vehicleTypeRequired}
              </div>
            </div>

            {/* Locations Route */}
            <div className="md:col-span-4 space-y-3 bg-black/15 p-4 rounded-2xl border border-white/10">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  A
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">
                    Pick Up from Farm ({incomingTrip.pickupDistanceKm} km away)
                  </span>
                  <p className="text-xs font-bold text-white leading-snug">
                    {incomingTrip.pickupLocation.address || incomingTrip.pickupLocation.village}
                  </p>
                  <p className="text-[11px] text-amber-100">
                    {incomingTrip.pickupLocation.mandal}, {incomingTrip.pickupLocation.district}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-white/10">
                <div className="w-5 h-5 rounded-full bg-rose-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  B
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">
                    Deliver To Destination ({incomingTrip.tripDistanceKm} km trip)
                  </span>
                  <p className="text-xs font-bold text-white leading-snug">
                    {incomingTrip.dropLocation.name}
                  </p>
                  <p className="text-[11px] text-amber-100">
                    {incomingTrip.dropLocation.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Fare & Big Accept Button */}
            <div className="md:col-span-3 flex flex-col justify-between items-end gap-4">
              <div className="text-right">
                <span className="text-xs text-amber-100 uppercase tracking-wider font-bold block">
                  Guaranteed Driver Payout
                </span>
                <span className="text-3xl font-black text-white font-mono">
                  ₹{incomingTrip.estimatedFare.toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-200 block font-mono">
                  Cash on Delivery / Direct Bank
                </span>
              </div>

              <div className="w-full flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRejectTrip(incomingTrip.id)}
                  className="px-4 py-3 bg-black/30 hover:bg-black/50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/20"
                >
                  Pass
                </button>
                <button
                  type="button"
                  onClick={() => handleAcceptTrip(incomingTrip.id)}
                  className="flex-1 py-3 px-5 bg-white hover:bg-amber-50 active:scale-95 text-slate-950 rounded-xl text-sm font-black transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />
                  <span>ACCEPT TRIP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE TRIP NAVIGATION & WORKFLOW (WHEN TRIP IS ACCEPTED) */}
      {activeTrip && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-6 space-y-6">
          {/* Active Trip Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-black text-slate-900 font-heading">
                ACTIVE TRIP IN PROGRESS • {activeTrip.id}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold">
                ₹{activeTrip.estimatedFare.toLocaleString()} Fare
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeTrip.farmerPhone}`}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Farmer ({activeTrip.farmerName})</span>
              </a>
            </div>
          </div>

          {/* Stepper Progression: (En Route -> Arrived -> OTP Verified & Loaded -> In Transit -> Completed) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className={`p-3 rounded-xl border text-xs ${
              activeTrip.status === 'accepted' || activeTrip.status === 'en_route_pickup'
                ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center justify-between">
                <span>1. En Route to Farm</span>
                {activeTrip.status !== 'accepted' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs ${
              activeTrip.status === 'arrived_pickup'
                ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                : activeTrip.status === 'crop_loaded' || activeTrip.status === 'in_transit' || activeTrip.status === 'delivered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span>2. Farm Gate & OTP</span>
                {(activeTrip.status === 'crop_loaded' || activeTrip.status === 'in_transit' || activeTrip.status === 'delivered') && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs ${
              activeTrip.status === 'crop_loaded'
                ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                : activeTrip.status === 'in_transit' || activeTrip.status === 'delivered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span>3. Loading & Weighment</span>
                {(activeTrip.status === 'in_transit' || activeTrip.status === 'delivered') && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs ${
              activeTrip.status === 'in_transit'
                ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-2xs'
                : activeTrip.status === 'delivered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span>4. Transit & Unload</span>
                {activeTrip.status === 'delivered' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>
          </div>

          {/* Action Step Panel according to current stage */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            {/* STAGE 1: EN ROUTE TO FARM */}
            {activeTrip.status === 'accepted' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-6 h-6 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Driving to Farm Gate Pickup ({activeTrip.pickupDistanceKm} km away)
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Destination: <strong>{activeTrip.pickupLocation.address}</strong> ({activeTrip.pickupLocation.village}, {activeTrip.pickupLocation.mandal})
                      </p>
                      {activeTrip.pickupLocation.landmark && (
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          Landmark: {activeTrip.pickupLocation.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleArriveAtFarm}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 shrink-0"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>I HAVE ARRIVED AT FARM GATE</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: ARRIVED & OTP VERIFICATION */}
            {activeTrip.status === 'arrived_pickup' && (
              <div className="space-y-4 max-w-lg">
                <div className="flex items-start gap-3">
                  <KeyRound className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Arrived at Farm Gate • Verify 4-Digit Pickup OTP
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Ask farmer <strong>{activeTrip.farmerName}</strong> for the 4-digit secret OTP displayed on their screen to ensure genuine produce release.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4-Digit OTP (e.g. 4819)"
                    className="w-48 px-4 py-2.5 text-center font-mono text-lg font-bold tracking-widest border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    VERIFY OTP & START LOADING
                  </button>
                </div>

                {otpError && (
                  <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    {otpError}
                  </p>
                )}

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span>Farmer OTP Hint (For Demonstration): </span>
                  <strong className="font-mono text-sm underline">{activeTrip.pickupOtp}</strong>
                </div>
              </div>
            )}

            {/* STAGE 3: CROP LOADING & WEIGHMENT */}
            {activeTrip.status === 'crop_loaded' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Truck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Crops Loaded: {activeTrip.quantity} {activeTrip.unit} {activeTrip.crop}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tarp secured • Tare & Gross weight slip checked • Delivery bay: {activeTrip.dropLocation.name}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartTransit}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>START JOURNEY TO MANDI / YARD</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: IN TRANSIT SIMULATION */}
            {activeTrip.status === 'in_transit' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Gauge className="w-6 h-6 text-blue-600 shrink-0 mt-0.5 animate-spin" />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Vehicle in Transit to {activeTrip.dropLocation.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Speed: <strong>48 km/h</strong> • Remaining: <strong>{Math.max(0, Math.round(activeTrip.tripDistanceKm * (1 - transitProgress / 100)))} km</strong> • GPS Tracking Active
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteTrip}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 shrink-0"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>ARRIVED & COLLECT ₹{activeTrip.estimatedFare.toLocaleString()}</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-700"
                    style={{ width: `${Math.max(15, transitProgress)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RADAR WHEN ONLINE & WAITING FOR FARMER BOOKINGS */}
      {isOnline && !activeTrip && !incomingTrip && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-2xs">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
            <span className="absolute inset-2 rounded-full bg-emerald-400/20 animate-pulse" />
            <div className="relative w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 font-heading">
              Looking for Nearby Farm Crop Pickups...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              You are Online in the Warangal Mandi Cluster. When a verified farmer books a transport lorry, your screen will chime and show the trip request here instantly.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSimulateFarmerBooking}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Click to Test Incoming Farmer Booking Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. OFFLINE NOTICE WHEN DRIVER IS OFF DUTY */}
      {!isOnline && (
        <div className="p-8 bg-slate-100 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-300 text-slate-700 mx-auto flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">You are currently OFFLINE</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Switch your duty status to ONLINE to receive incoming crop transport bookings from farmers.
          </p>
          <button
            type="button"
            onClick={() => handleToggleDuty(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Go Online Now
          </button>
        </div>
      )}

      {/* 5. RECENT REAL COMPLETED TRIPS (NO FAKE USERS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Recent Completed Trips History
            </h3>
            <p className="text-xs text-slate-500">
              Only genuine farmer bookings completed by your vehicle
            </p>
          </div>
          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {completedTripsList.length} Trips
          </span>
        </div>

        {completedTripsList.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No completed trips yet today. Accept a farmer booking above to start your first trip.
          </div>
        ) : (
          <div className="space-y-3">
            {completedTripsList.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {t.id}
                    </span>
                    <span className="font-bold text-slate-900">
                      {t.crop} - {t.quantity} {t.unit}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Delivered
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Farmer: <strong className="text-slate-800">{t.farmerName}</strong> ({t.farmerPhone})
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    From: {t.pickupLocation.village || t.pickupLocation.address} → To: {t.dropLocation.name}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payout Collected</span>
                  <span className="font-mono text-base font-black text-emerald-700">
                    ₹{t.estimatedFare.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
