import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Send,
  X,
  PhoneCall,
  PhoneOff,
  ArrowRight,
  Search,
  FileText,
  RefreshCw,
  User,
  ExternalLink,
  Receipt,
  Sparkles,
  Check,
} from 'lucide-react';
import { Order, UserProfile, TransporterVehicle } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TrackShipmentProps {
  orders: Order[];
  currentUser: UserProfile;
  selectedOrderId?: string;
  onAdvanceOrderStatus?: (orderId: string) => void;
  onConfirmCODPayment?: (orderId: string) => void;
  onBack?: () => void;
  onOpenOrderInDashboard?: (orderId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'driver';
  text: string;
  time: string;
}

interface StatusCheckpoint {
  title: string;
  subtitle: string;
  location: string;
  time: string;
  completed: boolean;
  active: boolean;
  driverNote?: string;
}

export const TrackShipment: React.FC<TrackShipmentProps> = ({
  orders,
  currentUser,
  selectedOrderId,
  onAdvanceOrderStatus,
  onConfirmCODPayment,
  onBack,
}) => {
  const { language } = useLanguage();

  // Pick default order (either selected or first order or fallback)
  const [activeOrderId, setActiveOrderId] = useState<string>(
    selectedOrderId || (orders.length > 0 ? orders[0].id : 'OD-782910482')
  );

  useEffect(() => {
    if (selectedOrderId) {
      setActiveOrderId(selectedOrderId);
    } else if (orders.length > 0 && !orders.some((o) => o.id === activeOrderId)) {
      setActiveOrderId(orders[0].id);
    }
  }, [selectedOrderId, orders]);

  const activeOrder: Order = orders.find((o) => o.id === activeOrderId) || orders[0] || {
    id: 'OD-782910482',
    lotId: 'LOT-TOM-101',
    crop: 'Tomato',
    quantity: 35,
    unit: 'Quintals',
    farmerId: 'usr-farmer-ramesh',
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+91 98480 23456',
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    buyerCompany: currentUser.businessName || 'Agro Mandi Procurement Ltd',
    agreedPrice: 2350,
    totalAmount: 82250,
    currentStep: 6,
    status: 'In Transit',
    transportId: 'TRP-101',
    transporterName: 'Express Logistics Fleet',
    vehicleNumber: 'TS 03 UA 5678',
    vehicleType: 'Eicher Pro 14ft (Insulated Crate Carrier)',
    pickupLocation: 'Ramesh Farm Yard, Warangal Rural',
    deliveryLocation: 'Wholesale Shed 4, Bowenpally APMC Market, Hyderabad',
    createdAt: 'Today, 08:30 AM',
    paymentStatus: 'pending',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentType: 'cod',
    codStatus: 'pending_collection',
    itemImageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    deliveryAddress: {
      fullName: currentUser.name || 'Anand Mahindra',
      phone: currentUser.phone || '+91 98220 99887',
      pincode: '500011',
      addressLine: 'Wholesale Depot Shed No. 4, Bowenpally APMC Market Yard',
      city: 'Secunderabad / Hyderabad',
      state: 'Telangana',
      addressType: 'Commercial Warehouse',
      deliverySlot: 'Express Delivery - Today before 4:00 PM',
      specialInstructions: 'Direct driver to Platform B unloading bay. Check crate seal security.',
    },
    driverDetails: {
      name: 'Ramu Yadav',
      phone: '+91 97001 88990',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      vehicleNumber: 'TS 03 UA 5678',
      vehicleType: 'Eicher Pro 14ft (Insulated Crate Carrier)',
      currentLocationName: 'Outer Ring Road Ghatkesar Toll (14.5 km away)',
      etaMinutes: 28,
      distanceRemainingKm: 14.5,
    },
  };

  // Driver chat state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: `Namaste sir! 70 crates of fresh ${activeOrder.crop} loaded securely from ${activeOrder.farmerName}'s farm yard.`,
      time: '09:15 AM',
    },
    {
      id: 'm2',
      sender: 'buyer',
      text: 'Good morning Ramu. Please ensure the crates are shaded from afternoon heat and covered with tarpaulin sheet.',
      time: '09:18 AM',
    },
    {
      id: 'm3',
      sender: 'driver',
      text: 'Yes sir, fully covered with ventilated canvas. Just cleared the highway toll gate, ETA is ~28 minutes to your depot.',
      time: '10:05 AM',
    },
  ]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Phone Call Modal state
  const [showCallModal, setShowCallModal] = useState(false);
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [callSeconds, setCallSeconds] = useState(0);

  // COD Payment confirmation state
  const [showCodModal, setShowCodModal] = useState(false);
  const [codConfirmed, setCodConfirmed] = useState(activeOrder.codStatus === 'collected_by_driver' || activeOrder.paymentStatus === 'completed');
  const [searchFilter, setSearchFilter] = useState('');

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (showCallModal && callStatus === 'dialing') {
      const connectTimer = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);
      return () => clearTimeout(connectTimer);
    }
    if (showCallModal && callStatus === 'connected') {
      timer = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showCallModal, callStatus]);

  useEffect(() => {
    if (showChatModal) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showChatModal, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setChatInput('');

    // Simulated quick driver response
    setTimeout(() => {
      let driverReply = 'Noted sir. Following your delivery instructions.';
      const low = text.toLowerCase();
      if (low.includes('where') || low.includes('location') || low.includes('eta') || low.includes('time')) {
        driverReply = 'Sir, I am on the highway bypass road, about 12 km from the delivery depot. Reaching very soon!';
      } else if (low.includes('tarpaulin') || low.includes('cover') || low.includes('sun') || low.includes('heat')) {
        driverReply = 'Crates are fully secured under breathable waterproof cover. Temperature is cool inside.';
      } else if (low.includes('gate') || low.includes('call') || low.includes('platform')) {
        driverReply = 'Understood sir. I will call you 10 minutes before reaching Mandi Gate 2.';
      } else if (low.includes('cash') || low.includes('cod') || low.includes('pay')) {
        driverReply = 'Yes sir, COD amount can be handed over after weighment verification at the unloading platform.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `driver-msg-${Date.now()}`,
          sender: 'driver',
          text: driverReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const handleStartCall = () => {
    setShowCallModal(true);
    setCallStatus('dialing');
    setCallSeconds(0);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setShowCallModal(false);
      setCallStatus('dialing');
      setCallSeconds(0);
    }, 800);
  };

  const handleConfirmCod = () => {
    setCodConfirmed(true);
    setShowCodModal(false);
    if (onConfirmCODPayment) {
      onConfirmCODPayment(activeOrder.id);
    }
    if (onAdvanceOrderStatus && activeOrder.currentStep < 10) {
      onAdvanceOrderStatus(activeOrder.id);
    }
  };

  // Determine stage details
  const currentStep = activeOrder.currentStep || 6;
  const isDelivered = currentStep >= 7 || activeOrder.status === 'Delivered' || activeOrder.status === 'Payment Completed';

  // Major Logistics Milestones
  const milestones = [
    {
      id: 1,
      title: 'Order Confirmed',
      desc: 'Buyer placed order',
      time: activeOrder.createdAt || '08:30 AM',
      isCompleted: currentStep >= 2,
      isActive: currentStep === 1 || currentStep === 2,
    },
    {
      id: 2,
      title: 'Weighed & Packed',
      desc: 'Grade-A farm certified',
      time: '08:50 AM',
      isCompleted: currentStep >= 4,
      isActive: currentStep === 3 || currentStep === 4,
    },
    {
      id: 3,
      title: 'Transporter Picked Up',
      desc: 'Driver loaded 70 crates',
      time: '09:15 AM',
      isCompleted: currentStep >= 5,
      isActive: currentStep === 5,
    },
    {
      id: 4,
      title: 'In Transit',
      desc: 'Highway GPS Active',
      time: '10:05 AM',
      isCompleted: currentStep >= 7,
      isActive: currentStep === 6,
    },
    {
      id: 5,
      title: 'Out for Delivery',
      desc: 'At Mandi Gate Platform',
      time: 'ETA 28 mins',
      isCompleted: currentStep >= 7,
      isActive: currentStep === 7,
    },
    {
      id: 6,
      title: 'Delivered & Settled',
      desc: activeOrder.paymentType === 'cod' ? 'Cash Received' : 'Escrow Released',
      time: isDelivered ? 'Completed' : 'Pending Gate Sign-off',
      isCompleted: isDelivered,
      isActive: isDelivered,
    },
  ];

  // Logistics Checkpoint History
  const checkpointHistory: StatusCheckpoint[] = [
    {
      title: 'Highway Bypass Toll Checkpoint Cleared',
      subtitle: 'Vehicle moving smoothly at 58 km/h on NH-163. Fresh produce crates ventilated.',
      location: 'Outer Ring Road Ghatkesar Toll (14.5 km away)',
      time: 'Today, 10:05 AM',
      completed: true,
      active: currentStep === 6,
      driverNote: 'Tarpaulin sheet inspected. Temperature optimal.',
    },
    {
      title: 'Loaded & Dispatched from Farm Yard',
      subtitle: `${activeOrder.quantity} ${activeOrder.unit} loaded into ${activeOrder.vehicleType || 'Insulated Lorry'}`,
      location: activeOrder.pickupLocation,
      time: 'Today, 09:15 AM',
      completed: currentStep >= 5,
      active: currentStep === 5,
      driverNote: 'Farmer Ramesh Kumar handed over crates and weighment slip.',
    },
    {
      title: 'Quality & Moisture Seal Verified',
      subtitle: 'APMC Authorized Assayer approved Grade-A certification.',
      location: 'Enamamula Mandi Cluster Assaying Lab',
      time: 'Today, 08:50 AM',
      completed: currentStep >= 4,
      active: currentStep === 4,
    },
    {
      title: 'Transporter Assigned & Route Planned',
      subtitle: `${activeOrder.driverDetails?.name || 'Ramu Yadav'} (${activeOrder.vehicleNumber || 'TS 03 UA 5678'}) assigned by ${activeOrder.transporterName || 'Express Fleet'}.`,
      location: 'KisanSetu Regional Dispatch Control',
      time: 'Today, 08:35 AM',
      completed: currentStep >= 3,
      active: currentStep === 3,
    },
    {
      title: 'Order Placed & Contract Created',
      subtitle: `Procurement order initialized. Mode: ${activeOrder.paymentMethod || 'Cash on Delivery (COD)'}`,
      location: 'KisanSetu Buyer Portal',
      time: activeOrder.createdAt || 'Today, 08:30 AM',
      completed: true,
      active: false,
    },
  ];

  // Filtered orders list for the dropdown
  const filteredOrders = orders.filter((o) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.crop.toLowerCase().includes(q) ||
      o.farmerName.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6" id="track-shipment-container">
      {/* Top Banner with Navigation & Order Switcher */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
                title="Back to Portal"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-900 text-white">
                  LOGISTICS TRACKER
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeOrder.status}
                </span>
                {activeOrder.paymentType === 'cod' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    💵 Cash on Delivery
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight mt-1">
                Live Shipment & Driver Tracker
              </h2>
              <p className="text-xs text-slate-500">
                Real-time transit telemetry, Flipkart-style logistics milestones & direct driver communications.
              </p>
            </div>
          </div>

          {/* Quick Actions & Order Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {orders.length > 1 && (
              <div className="relative">
                <select
                  value={activeOrderId}
                  onChange={(e) => setActiveOrderId(e.target.value)}
                  className="px-3 py-2 text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.crop} ({o.quantity} {o.unit})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {onAdvanceOrderStatus && (
              <button
                type="button"
                onClick={() => onAdvanceOrderStatus(activeOrder.id)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Advance to next step in logistics simulation"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Simulate Next Checkpoint</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Order Overview Card (Flipkart Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/70 border border-slate-200/90 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <Wheat className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Consignment
              </span>
              <h4 className="font-extrabold text-slate-900 truncate text-sm">
                {activeOrder.crop}
              </h4>
              <p className="text-slate-600 font-mono text-[11px]">
                {activeOrder.quantity} {activeOrder.unit} • ₹{activeOrder.agreedPrice}/Q
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Tracking Order ID
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm block">
              {activeOrder.id}
            </span>
            <span className="text-slate-500 text-[11px] block truncate">
              Booked: {activeOrder.createdAt || 'Today'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Payable Amount
            </span>
            <span className="font-mono font-extrabold text-slate-950 text-base block">
              ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
            </span>
            <span className={`text-[10.5px] font-bold inline-block ${codConfirmed ? 'text-emerald-700' : 'text-amber-800'}`}>
              {codConfirmed
                ? '✓ Paid & Settled'
                : activeOrder.paymentType === 'cod'
                ? 'Pay ₹' + activeOrder.totalAmount.toLocaleString('en-IN') + ' on Delivery'
                : 'Escrow Secured'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Estimated Delivery
            </span>
            <span className="font-bold text-emerald-800 text-sm block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Today before 4:00 PM
            </span>
            <span className="text-slate-600 text-[11px] block">
              ETA: ~28 minutes remaining
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side (Interactive Driver & Telemetry) vs Right side (Progress Bar & Checkpoints) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: DRIVER INTERACTION & LIVE RADAR (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* DRIVER INTERACTION CARD (Key User Requirement: "interact with driver") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-900" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Assigned Transporter &amp; Driver
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10.5px] font-bold">
                Active On Route
              </span>
            </div>

            {/* Driver Profile Highlight */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={
                    activeOrder.driverDetails?.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                  }
                  alt="Driver"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white">
                  ✓
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-bold text-base text-slate-900 truncate">
                    {activeOrder.driverDetails?.name || 'Ramu Yadav'}
                  </h4>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ★ {activeOrder.driverDetails?.rating || 4.9} (184 trips)
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-600 font-semibold mt-0.5">
                  Vehicle: {activeOrder.vehicleNumber || 'TS 03 UA 5678'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {activeOrder.vehicleType || 'Eicher Pro 14ft (Insulated Crate Carrier)'}
                </p>
              </div>
            </div>

            {/* Live Location Pulse & Distance */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                  Current Highway Location:
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  {activeOrder.driverDetails?.distanceRemainingKm || 14.5} km away
                </span>
              </div>
              <p className="font-bold text-slate-900 pl-5">
                {activeOrder.driverDetails?.currentLocationName || 'Outer Ring Road Ghatkesar Toll Plaza'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 pl-5">
                <span>Current Speed: <strong>58 km/h</strong></span>
                <span>Transit Safety: <strong>100% Crate Insulated</strong></span>
              </div>
            </div>

            {/* TWO PRIMARY INTERACTIVE BUTTONS: CALL DRIVER & CHAT DRIVER */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartCall}
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="call-driver-btn"
              >
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>Call Driver</span>
              </button>

              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer relative"
                id="chat-driver-btn"
              >
                <MessageSquare className="w-4 h-4 text-sky-300" />
                <span>Message Driver</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2 animate-ping" />
              </button>
            </div>

            {/* Quick Delivery Instructions for Driver */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700">
                  Instructions for Driver:
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Delivered to Platform B
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11.5px] text-amber-900">
                "{activeOrder.deliveryAddress?.specialInstructions || 'Direct driver to Platform B unloading bay. Handle tomato crates gently.'}"
              </div>
            </div>
          </div>

          {/* CASH ON DELIVERY (COD) ACTION CARD */}
          {activeOrder.paymentType === 'cod' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    💵
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900">
                      Cash on Delivery (COD) Settle
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Weighment inspection & cash settlement upon unloading
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                  codConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {codConfirmed ? 'Payment Complete' : 'Pending Gate Cash'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10.5px] text-amber-800 font-medium block">
                    Cash Amount to Pay Driver:
                  </span>
                  <span className="text-xl font-black font-mono text-slate-950">
                    ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {!codConfirmed ? (
                  <button
                    type="button"
                    onClick={() => setShowCodModal(true)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Confirm Cash Handed
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cash Handed &amp; Receipted
                  </span>
                )}
              </div>
            </div>
          )}

          {/* FLIPKART-STYLE DELIVERY ADDRESS CARD */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-heading font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Delivery Address (Flipkart Details)
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                {activeOrder.deliveryAddress?.addressType || 'Commercial Warehouse'}
              </span>
            </div>

            <div className="space-y-1 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">
                {activeOrder.deliveryAddress?.fullName || currentUser.name}
                <span className="font-mono text-xs text-slate-500 font-normal ml-2">
                  {activeOrder.deliveryAddress?.phone || currentUser.phone}
                </span>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeOrder.deliveryAddress?.addressLine || 'Wholesale Depot Shed No. 4, Bowenpally APMC Market Yard'}
              </p>
              <p className="text-xs font-semibold text-slate-800">
                {activeOrder.deliveryAddress?.city || 'Hyderabad'}, {activeOrder.deliveryAddress?.state || 'Telangana'} -{' '}
                <span className="font-mono font-bold text-slate-900">
                  {activeOrder.deliveryAddress?.pincode || '500011'}
                </span>
              </p>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Slot: <strong>{activeOrder.deliveryAddress?.deliverySlot || 'Today before 4:00 PM'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROGRESS BAR & STATUS HISTORY (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* FLIPKART-STYLE PROGRESS BAR / LOGISTICS MILESTONES */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  Live Logistics Progress
                </h3>
                <p className="text-xs text-slate-500">
                  From farm crate harvest weighment to delivery unloading dock.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                Step {Math.min(currentStep, 6)} of 6 Completed
              </span>
            </div>

            {/* Visual Step Progress Stepper (Horizontal on desktop, stacked on mobile) */}
            <div className="relative">
              {/* Connecting background bar */}
              <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0" />
              <div
                className="hidden sm:block absolute top-5 left-6 h-1 bg-emerald-600 transition-all duration-700 -z-0"
                style={{
                  width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 5) * 100))}%`,
                }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                {milestones.map((m) => (
                  <div key={m.id} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-xs shrink-0 ${
                        m.isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : m.isActive
                          ? 'bg-slate-900 text-white ring-4 ring-slate-200 animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {m.isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : m.id}
                    </div>
                    <div className="min-w-0 text-left sm:text-center">
                      <p className="text-xs font-extrabold text-slate-900 leading-tight">
                        {m.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                        {m.desc}
                      </p>
                      <p className="text-[9.5px] font-mono font-semibold text-slate-400">
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STATUS HISTORY TIMELINE (Audit Trail & Checkpoints) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Detailed Logistics Status History
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Live Telemetry Log
              </span>
            </div>

            {/* Timeline Tree */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {checkpointHistory.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.active
                        ? 'bg-emerald-600 border-white ring-4 ring-emerald-200'
                        : item.completed
                        ? 'bg-emerald-500 border-white'
                        : 'bg-slate-200 border-white'
                    }`}
                  >
                    {item.completed && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>

                  <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/80 transition-all space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-extrabold text-slate-900">
                        {item.title}
                      </h4>
                      <span className="font-mono text-[10.5px] font-semibold text-slate-500">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.subtitle}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {item.driverNote && (
                      <div className="mt-2 p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
                        <span className="font-bold text-slate-900 shrink-0">Driver Update:</span>
                        <span>{item.driverNote}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: INTERACTIVE DRIVER PHONE CALL SIMULATOR */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-3xl w-full max-w-sm p-6 space-y-6 shadow-2xl border border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden ring-4 ring-emerald-500/40 shadow-lg">
              <img
                src={
                  activeOrder.driverDetails?.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                }
                alt="Driver"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {callStatus === 'connected' && (
                <span className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading">
                {activeOrder.driverDetails?.name || 'Ramu Yadav'}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {activeOrder.driverDetails?.phone || '+91 97001 88990'}
              </p>
              <p className="text-xs font-semibold text-emerald-400 mt-2">
                {callStatus === 'dialing' && 'Ringing Driver Phone...'}
                {callStatus === 'connected' &&
                  `Connected • ${Math.floor(callSeconds / 60)
                    .toString()
                    .padStart(2, '0')}:${(callSeconds % 60).toString().padStart(2, '0')}`}
                {callStatus === 'ended' && 'Call Ended'}
              </p>
            </div>

            {callStatus === 'connected' && (
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">"Namaste sir! Ramu here speaking."</p>
                <p className="text-[11px] text-slate-400">
                  "I am driving past the outer ring road toll plaza. Crate covers are secure. Will reach your platform in ~28 mins."
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleEndCall}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center mx-auto shadow-lg cursor-pointer transition-transform active:scale-90"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE DRIVER CHAT MESSAGING DRAWER */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 flex flex-col h-[560px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Chat Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      activeOrder.driverDetails?.avatar ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                    }
                    alt="Driver"
                    className="w-10 h-10 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {activeOrder.driverDetails?.name || 'Ramu Yadav'}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-mono">
                    {activeOrder.vehicleNumber || 'TS 03 UA 5678'} • Online En Route
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-bold shrink-0">Quick:</span>
              <button
                type="button"
                onClick={() => handleSendMessage('Where are you currently on the highway?')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
              >
                Where are you?
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Please ensure tomato crates stay covered from the heat')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
              >
                Keep crates covered
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Call me 10 mins before reaching Gate 2')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
              >
                Call before Gate 2
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('COD cash amount is ready at platform office')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
              >
                COD Cash Ready
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'buyer' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs ${
                      m.sender === 'buyer'
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-400 mt-1 px-1">
                    {m.time}
                  </span>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type delivery note or ask driver for updates..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM CASH ON DELIVERY (COD) PAYMENT */}
      {showCodModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                  💵
                </div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Confirm Cash on Delivery (COD)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCodModal(false)}
                className="p-1 hover:bg-slate-100 rounded-xl text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-semibold">
                Please verify physical produce before handing over cash:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11.5px]">
                <li>Weighment slips match: <strong>{activeOrder.quantity} {activeOrder.unit}</strong></li>
                <li>Produce crates ({activeOrder.crop}) quality &amp; moisture inspected</li>
                <li>Cash recipient: <strong>{activeOrder.driverDetails?.name || 'Ramu Yadav'}</strong></li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-600">Total COD Amount:</span>
              <span className="text-lg font-black text-slate-900">
                ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCodModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCod}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Cash Handed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
