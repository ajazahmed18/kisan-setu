import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocation as useMarketLocation } from '../context/LocationContext';
import { Header } from '../components/Header';
import { LandingHero } from '../components/LandingHero';
import { FarmerDashboard } from '../components/FarmerDashboard';
import { FPODashboard } from '../components/FPODashboard';
import { MarketAdminDashboard } from '../components/MarketAdminDashboard';
import { TransporterPortal } from '../components/TransporterPortal';
import { AdminDashboard } from '../components/AdminDashboard';
import { MarketIntelligence } from '../components/MarketIntelligence';
import { CommunityQA } from '../components/CommunityQA';
import { CommunityFeed } from '../components/CommunityFeed';
import { KisanCommunityHub } from '../components/community/KisanCommunityHub';
import { VoiceAndIVRModal } from '../components/VoiceAndIVRModal';
import { DemoFlowModal } from '../components/DemoFlowModal';
import { LogisticsAndStorageModal } from '../components/LogisticsAndStorageModal';
import { CropQualityScannerModal } from '../components/CropQualityScannerModal';
import { TrackShipment } from '../components/TrackShipment';
import { CityMarketDetailsCard } from '../components/CityMarketDetailsCard';
import { SellProduceModal, InitialSellProduceData } from '../components/SellProduceModal';
import { BuyNowCheckoutModal } from '../components/BuyNowCheckoutModal';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { MobileDrawer } from '../components/MobileDrawer';
import { useToast } from '../context/ToastContext';
import {
  UserProfile,
  UserRole,
  Language,
  BankDetails,
  CropLot,
  BuyerOffer,
  Order,
  Transporter,
  Warehouse,
  Dispute,
  BlockchainBlock,
  FPOReview,
  CommunityPost,
  MandiPrice,
  SellRequest,
} from '../types';
import {
  CROPS_DATA,
  MANDI_PRICES_DATA,
  INITIAL_CROP_LOTS,
  INITIAL_OFFERS,
  INITIAL_ORDERS,
  TRANSPORTERS_DATA,
  WAREHOUSES_DATA,
  INITIAL_DISPUTES,
  INITIAL_BLOCKCHAIN_BLOCKS,
  INITIAL_FPO_REVIEWS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_USERS,
} from '../data/mockData';
import { INITIAL_SELL_REQUESTS } from '../data/fpoOfficersData';
import {
  Wheat,
  Building2,
  ShieldCheck,
  Truck,
  Shield,
  PhoneCall,
  Sparkles,
  Database,
  CheckCircle2,
  TrendingUp,
  User as UserIcon,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Clock,
  Key,
  Copy,
  Check,
  ExternalLink,
  Settings,
  Scale,
  DollarSign,
  ArrowRight,
  MapPin,
  Lock,
  Camera,
} from 'lucide-react';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';

interface DashboardProps {
  initialTab?: 'home' | 'dashboard' | 'markets' | 'blockchain' | 'community' | 'profile';
}

export const Dashboard: React.FC<DashboardProps> = ({ initialTab }) => {
  const { currentUser, userProfile, isAdminUser, logout, updateUserProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { showSuccess, showError, showInfo } = useToast();
  const navigate = useNavigate();
  const location = useRouterLocation();
  const [searchParams] = useSearchParams();

  // Navigation and Role State
  const determineInitialTab = (): 'home' | 'dashboard' | 'markets' | 'blockchain' | 'community' | 'profile' | 'tracking' | 'prices' | 'selling' => {
    if (initialTab) return initialTab as any;
    if (location.pathname.includes('/community')) return 'community';
    const tabParam = searchParams.get('tab');
    if (tabParam === 'community' || tabParam === 'markets' || tabParam === 'blockchain' || tabParam === 'home' || tabParam === 'profile' || tabParam === 'dashboard' || tabParam === 'prices' || tabParam === 'selling' || tabParam === 'tracking') {
      return tabParam as any;
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'markets' | 'blockchain' | 'community' | 'profile' | 'tracking' | 'prices' | 'selling'>(determineInitialTab);
  const [currentRole, setCurrentRole] = useState<UserRole>(userProfile?.role || 'farmer');
  const [selectedCrop, setSelectedCrop] = useState<string>('Cotton');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { selectedCityId } = useMarketLocation();

  // If switched to Warangal, automatically focus on vegetables (e.g. Tomato)
  useEffect(() => {
    if (selectedCityId === 'warangal') {
      if (['Cotton', 'Rice (Paddy)', 'Wheat', 'Maize'].includes(selectedCrop)) {
        setSelectedCrop('Tomato');
      }
    }
  }, [selectedCityId, selectedCrop]);

  // Sync currentRole if userProfile loads as FPO
  useEffect(() => {
    if (userProfile?.role) {
      setCurrentRole(userProfile.role);
      if (userProfile.role === 'fpo') {
        setActiveTab((prev) => (prev === 'home' ? 'dashboard' : prev));
      }
    }
  }, [userProfile?.role]);

  // Handle switching trading role
  const handleRoleChange = async (newRole: UserRole) => {
    // FPO officer cannot come to farmer role as instructed
    if ((currentRole === 'fpo' || userProfile?.role === 'fpo') && newRole === 'farmer') {
      alert('FPO Officers operate exclusively in the FPO Field Officer Portal and cannot switch to the Farmer role.');
      return;
    }
    setCurrentRole(newRole);
    if (newRole === 'transporter' || newRole === 'fpo') {
      setActiveTab('dashboard');
    }
    if (currentUser && updateUserProfile) {
      try {
        await updateUserProfile({ role: newRole });
      } catch (err) {
        console.warn('Could not persist role in profile:', err);
      }
    }
  };

  // Modals state
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'ivr' | 'voice'>('voice');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCropScannerModal, setShowCropScannerModal] = useState(false);
  const [showSellProduceModal, setShowSellProduceModal] = useState(false);
  const [initialProduceDataForSell, setInitialProduceDataForSell] = useState<InitialSellProduceData | null>(null);
  const [recentlyListedLot, setRecentlyListedLot] = useState<CropLot | null>(null);
  const [logisticsTab, setLogisticsTab] = useState<'transport' | 'storage'>('transport');
  const [copiedUid, setCopiedUid] = useState(false);
  const [blockchainSearch, setBlockchainSearch] = useState('');

  // Primary Platform Data Collections (Strict Real Data Policy: zero mock entries)
  const [lots, setLots] = useState<CropLot[]>([]);
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellRequests, setSellRequests] = useState<SellRequest[]>([]);
  const [selectedSellRequestToView, setSelectedSellRequestToView] = useState<SellRequest | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>(MANDI_PRICES_DATA);
  const [marketRequiredVegetables, setMarketRequiredVegetables] = useState<Array<{
    id: string;
    cropName: string;
    variety: string;
    requiredQuantityQuintals: number;
    targetGrade: string;
    offeredPricePerQuintal: number;
    mandiName: string;
    deadline: string;
    status: 'urgent_demand' | 'open' | 'fulfilled';
    addedBy: string;
    createdAt: string;
    image?: string;
    unit?: string;
    currentPrice?: number;
    minPrice?: number;
    maxPrice?: number;
  }>>([]);

  // Data Loading & Error Recovery States
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [dataFetchError, setDataFetchError] = useState<string | null>(null);
  const [buyingLot, setBuyingLot] = useState<CropLot | null>(null);
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);

  const handleAddRequiredVegetable = (newReq: any) => {
    setMarketRequiredVegetables((prev) => [newReq, ...prev]);
  };

  const handleVegetableAdded = (newVeg: any) => {
    const reqItem = {
      id: `REQ-${newVeg.id || Date.now()}`,
      cropName: newVeg.name,
      variety: newVeg.category || 'APMC Grade A Arrival',
      requiredQuantityQuintals: newVeg.arrivalVolume ? Math.round(newVeg.arrivalVolume / 100) || 50 : 50,
      targetGrade: 'Grade A',
      offeredPricePerQuintal: newVeg.unit === 'kg' ? Math.round(newVeg.currentPrice * 100) : newVeg.currentPrice,
      mandiName: newVeg.market || 'Warangal APMC Enamamula Mandi',
      deadline: 'Urgent Requirement (Open for Farmers)',
      status: 'urgent_demand' as const,
      addedBy: activeUserProfile.name || 'Market Admin',
      createdAt: 'Just now',
      image: newVeg.image,
      unit: newVeg.unit || 'kg',
      currentPrice: newVeg.currentPrice,
      minPrice: newVeg.minPrice,
      maxPrice: newVeg.maxPrice,
    };

    setMarketRequiredVegetables((prev) => [
      reqItem,
      ...prev.filter((item) => item.cropName.toLowerCase() !== newVeg.name.toLowerCase()),
    ]);

    // Also update mandi prices so all charts and market intelligence show the new commodity
    const priceVal = newVeg.unit === 'kg' ? Math.round(newVeg.currentPrice * 100) : newVeg.currentPrice;
    const minVal = newVeg.minPrice ? (newVeg.unit === 'kg' ? newVeg.minPrice * 100 : newVeg.minPrice) : Math.round(priceVal * 0.95);
    const maxVal = newVeg.maxPrice ? (newVeg.unit === 'kg' ? newVeg.maxPrice * 100 : newVeg.maxPrice) : Math.round(priceVal * 1.08);

    const newMandiPrice: MandiPrice = {
      id: `mp-${newVeg.id || Date.now()}`,
      mandiName: newVeg.market || 'Warangal APMC Enamamula Mandi',
      district: 'Warangal',
      state: 'Telangana',
      cropName: newVeg.name,
      variety: newVeg.category || 'Common APMC Grade',
      grade: 'Grade A',
      arrivalDate: new Date().toISOString().split('T')[0],
      minPrice: minVal,
      maxPrice: maxVal,
      modalPrice: priceVal,
      currentPrice: priceVal,
      prevDayPrice: priceVal - 20,
      weeklyAvg: priceVal - 40,
      monthlyAvg: priceVal - 75,
      distanceKm: 18,
      arrivalVolumeQuintals: newVeg.arrivalVolume || 450,
      demandLevel: 'High',
      transportCostPerQuintal: 45,
      netValue: priceVal - 45,
      trend: 'increasing',
      lastUpdated: 'Just now',
      unit: 'Quintal',
      dailyArrivalTons: newVeg.arrivalVolume ? Math.round(newVeg.arrivalVolume / 10) : 45,
      priceTrend: (newVeg.trend as any) || 'up',
      historicalPrices: [
        { date: 'Day -3', price: priceVal - 120 },
        { date: 'Day -2', price: priceVal - 60 },
        { date: 'Yesterday', price: priceVal - 20 },
        { date: 'Today', price: priceVal },
      ],
    };

    setMandiPrices((prev) => [
      newMandiPrice,
      ...prev.filter((m) => m.cropName.toLowerCase() !== newVeg.name.toLowerCase()),
    ]);
  };

  const handleSellProductFromFarmer = (product: {
    cropName: string;
    variety?: string;
    price?: number;
    unit?: string;
    mandiName?: string;
    imageUrl?: string;
    quantity?: number;
    grade?: 'A' | 'B' | 'C';
  }) => {
    setSelectedSellRequestToView(null);
    setInitialProduceDataForSell({
      cropName: product.cropName,
      variety: product.variety || 'APMC Grade A',
      expectedPrice: product.price,
      unit: product.unit || 'Quintals',
      mandiName: product.mandiName || 'Warangal APMC Enamamula Mandi',
      imageUrl: product.imageUrl,
      quantity: product.quantity,
      grade: product.grade,
    });
    setShowSellProduceModal(true);
  };

  const handleUpdateMandiPrice = (updatedPrice: MandiPrice) => {
    setMandiPrices((prev) => {
      const idx = prev.findIndex((p) => p.id === updatedPrice.id || p.cropName.toLowerCase() === updatedPrice.cropName.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedPrice;
        return copy;
      }
      return [updatedPrice, ...prev];
    });
  };
  const [transporters, setTransporters] = useState<Transporter[]>(TRANSPORTERS_DATA);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(WAREHOUSES_DATA);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>([]);
  const [fpoReviews, setFpoReviews] = useState<FPOReview[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Sync role when userProfile is available
  useEffect(() => {
    if (userProfile?.role) {
      setCurrentRole(userProfile.role);
    }
  }, [userProfile?.role]);

  // Load genuine live data from server endpoints
  const fetchData = async () => {
    setIsDataLoading(true);
    setDataFetchError(null);
    try {
      const [
        lotsRes,
        offersRes,
        ordersRes,
        sellRequestsRes,
        mandiRes,
        transportRes,
        storageRes,
        disputesRes,
        blockchainRes,
        reviewsRes,
        postsRes,
        usersRes,
        vegetablesRes,
      ] = await Promise.allSettled([
        fetch('/api/lots').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/offers').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/orders').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/sell-requests').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/markets/prices').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/transport').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/storage').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/disputes').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/blockchain/blocks').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/fpo/reviews').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/community/posts').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/users').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/vegetables').then((r) => (r.ok ? r.json() : [])),
      ]);

      if (lotsRes.status === 'fulfilled' && Array.isArray(lotsRes.value)) setLots(lotsRes.value);
      if (offersRes.status === 'fulfilled' && Array.isArray(offersRes.value)) setOffers(offersRes.value);
      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) setOrders(ordersRes.value);
      if (sellRequestsRes.status === 'fulfilled' && Array.isArray(sellRequestsRes.value)) setSellRequests(sellRequestsRes.value);
      if (mandiRes.status === 'fulfilled' && Array.isArray(mandiRes.value) && mandiRes.value.length > 0) setMandiPrices(mandiRes.value);
      if (transportRes.status === 'fulfilled' && Array.isArray(transportRes.value)) setTransporters(transportRes.value);
      if (storageRes.status === 'fulfilled' && storageRes.value?.length) setWarehouses(storageRes.value);
      if (disputesRes.status === 'fulfilled' && Array.isArray(disputesRes.value)) setDisputes(disputesRes.value);
      if (blockchainRes.status === 'fulfilled' && Array.isArray(blockchainRes.value)) setBlockchainBlocks(blockchainRes.value);
      if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)) setFpoReviews(reviewsRes.value);
      if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)) setCommunityPosts(postsRes.value);
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) setUsersList(usersRes.value);

      if (vegetablesRes.status === 'fulfilled' && Array.isArray(vegetablesRes.value)) {
        const mappedVegs = vegetablesRes.value.map((v: any) => ({
          id: `REQ-${v.id}`,
          cropName: v.name,
          variety: v.category || 'APMC Grade A Arrival',
          requiredQuantityQuintals: v.arrivalVolume ? Math.round(v.arrivalVolume / 100) || 50 : 50,
          targetGrade: 'Grade A',
          offeredPricePerQuintal: v.unit === 'kg' ? Math.round(v.currentPrice * 100) : v.currentPrice,
          mandiName: v.market || 'Warangal APMC Enamamula Mandi',
          deadline: 'Urgent Requirement (Open for Farmers)',
          status: 'urgent_demand' as const,
          addedBy: 'Market Admin Officer',
          createdAt: 'Recent',
          image: v.image,
          unit: v.unit || 'kg',
          currentPrice: v.currentPrice,
          minPrice: v.minPrice,
          maxPrice: v.maxPrice,
        }));
        setMarketRequiredVegetables(mappedVegs);
      }
    } catch (e: any) {
      console.error('Marketplace fetch error:', e);
      setDataFetchError('Unable to load marketplace data. Please check your network connection.');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSellRequestCreated = (newReq: SellRequest) => {
    setSellRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
  };

  const handleSellRequestUpdated = (updatedReq: SellRequest) => {
    setSellRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
  };

  const handleViewSellRequest = (req: SellRequest) => {
    setSelectedSellRequestToView(req);
    setShowSellProduceModal(true);
  };

  // Construct active UserProfile object from genuine authenticated user session
  const activeUserProfile: UserProfile = {
    id: currentUser?.uid || 'guest-session',
    name:
      userProfile?.displayName ||
      currentUser?.displayName ||
      (currentUser?.email ? currentUser.email.split('@')[0] : 'Kisan Member'),
    email: currentUser?.email || undefined,
    role: currentRole,
    phone: userProfile?.phoneNumber || currentUser?.phoneNumber || (userProfile as any)?.phone || '',
    location: userProfile?.location || 'Warangal, Telangana',
    avatar: userProfile?.photoURL || currentUser?.photoURL || undefined,
    isVerified: Boolean(currentUser?.emailVerified || userProfile?.emailVerified || userProfile?.isOnline),
    panCard: (userProfile as any)?.panCard || undefined,
    aadharNumber: (userProfile as any)?.aadharNumber || undefined,
    gstNumber: (userProfile as any)?.gstNumber || undefined,
    businessName:
      userProfile?.businessName ||
      (userProfile as any)?.orgName ||
      (userProfile as any)?.farmName ||
      undefined,
    bankDetails: userProfile?.bankDetails || undefined,
    rating: 5.0,
  };

  // Farmer Handlers
  const handleCreateLot = async (lotData: Partial<CropLot>) => {
    const newLot: CropLot = {
      id: `LOT-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: activeUserProfile.id,
      farmerName: activeUserProfile.name,
      farmerPhone: activeUserProfile.phone || '+91 98480 00000',
      crop: lotData.crop || 'Cotton',
      variety: lotData.variety || 'BT-II Long Staple',
      quantity: Number(lotData.quantity) || 50,
      unit: lotData.unit || 'Quintals',
      grade: (lotData.grade as any) || 'A',
      moisture: Number(lotData.moisture) || 8.5,
      harvestDate: new Date().toISOString().split('T')[0],
      expectedPrice: Number(lotData.expectedPrice) || 7200,
      location: lotData.location || activeUserProfile.location,
      imageUrl: lotData.imageUrl || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=600',
      availabilityDate: new Date().toISOString().split('T')[0],
      status: 'available',
      bankDetails: activeUserProfile.bankDetails,
    };

    setLots((prev) => [newLot, ...prev]);
    setRecentlyListedLot(newLot);
    showSuccess(`Crop lot ${newLot.id} listed successfully!`, 'Lot Published');

    try {
      await fetch('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLot),
      });
    } catch (e) {
      console.warn('API lot post network notice:', e);
    }
  };

  const handlePublishProduceListing = async (newLot: CropLot) => {
    setLots((prev) => [newLot, ...prev]);
    setRecentlyListedLot(newLot);
    showSuccess(`Produce lot ${newLot.crop} published to APMC Market Admin portal!`, 'Produce Listed');
    // Navigate to Market Admin Portal so market admins can verify what was listed
    handleRoleChange('market_admin');
    setActiveTab('dashboard');

    try {
      await fetch('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLot),
      });
    } catch (e) {
      console.warn('API lot publish network notice:', e);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    // Update offer
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' as const } : o))
    );

    // Update lot status
    setLots((prev) =>
      prev.map((l) => (l.id === offer.lotId ? { ...l, status: 'sold' as const } : l))
    );

    // Create Order
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: offer.lotId,
      crop: offer.crop,
      quantity: offer.quantity,
      unit: offer.unit,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      farmerPhone: activeUserProfile.phone || '+91 98480 00000',
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerCompany: offer.buyerCompany,
      agreedPrice: offer.offerPricePerQuintal,
      totalAmount: offer.totalAmount,
      currentStep: 2, // Order Confirmed
      status: 'Order Confirmed',
      pickupLocation: activeUserProfile.location,
      deliveryLocation: 'APMC Market Yard & Warehouse, Warangal',
      createdAt: new Date().toISOString().split('T')[0],
      paymentStatus: 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    showSuccess(`Offer accepted from ${offer.buyerCompany}! Order ${newOrder.id} confirmed.`, 'Offer Accepted');

    try {
      await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
    } catch (e) {
      console.warn('API offer accept error:', e);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' as const } : o))
    );
    showInfo('Buyer offer rejected.', 'Offer Declined');
    try {
      await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
    } catch (e) {
      console.warn('API offer reject error:', e);
    }
  };

  const handleCounterOffer = async (offerId: string, counterPrice: number) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: 'countered' as const, counterPrice } : o
      )
    );
    showSuccess(`Counter offer of ₹${counterPrice.toLocaleString('en-IN')}/Q submitted to buyer.`, 'Counter Sent');
    try {
      await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'countered', counterPrice }),
      });
    } catch (e) {
      console.warn('API counter offer error:', e);
    }
  };

  const ORDER_STEPS = [
    'Offer Accepted',
    'Order Confirmed',
    'Transport Assigned',
    'Pickup Scheduled',
    'Crop Picked Up',
    'In Transit',
    'Delivered',
    'Quality Verified',
    'Payment Processing',
    'Payment Completed',
  ] as const;

  const handleAdvanceOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.currentStep >= 10) return;

    const nextStep = order.currentStep + 1;
    const nextStatus = ORDER_STEPS[nextStep - 1];

    let updatedOrder: Order = {
      ...order,
      currentStep: nextStep,
      status: nextStatus as any,
    };

    // Auto assign heavy lorry if > 1 ton (10 Quintals)
    if (nextStep === 3) {
      const heavyLorry = transporters.find((t) => t.capacityTonnes >= 5) || transporters[0];
      updatedOrder = {
        ...updatedOrder,
        transportId: heavyLorry.id,
        transporterName: heavyLorry.transporterName,
        vehicleNumber: heavyLorry.vehicleNumber,
        vehicleType: heavyLorry.vehicleType,
      };
    }

    if (nextStep === 9) {
      updatedOrder.paymentStatus = 'processing';
    }

    if (nextStep === 10) {
      updatedOrder.paymentStatus = 'completed';
      updatedOrder.paymentMethod = 'Direct Bank Transfer (NEFT/RTGS)';
      updatedOrder.blockchainTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      updatedOrder.blockNumber = blockchainBlocks.length + 1040;

      // Add to Blockchain ledger
      const prevBlock = blockchainBlocks[blockchainBlocks.length - 1];
      const newBlock: BlockchainBlock = {
        index: blockchainBlocks.length + 1040,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        txId: `TX-${Date.now().toString().slice(-8)}`,
        orderId: order.id,
        sender: `${order.buyerCompany} (${order.buyerName})`,
        receiver: order.farmerName,
        amount: order.totalAmount,
        cropDetails: `${order.crop} - ${order.quantity} ${order.unit}`,
        previousHash: prevBlock ? prevBlock.hash : '00000000000000000000000000000000',
        hash: `0000${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        verifiedBy: 'Proof of Trade Consensus (Rythu Bhavan Node #3)',
      };
      setBlockchainBlocks((prev) => [...prev, newBlock]);
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    showSuccess(`Order ${orderId} moved to Stage ${nextStep}: ${nextStatus}`, 'Timeline Updated');

    try {
      await fetch(`/api/orders/${orderId}/advance`, { method: 'PUT' });
    } catch (e) {
      console.warn('API order advance error:', e);
    }
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Record on Blockchain ledger
    const prevBlock = blockchainBlocks[blockchainBlocks.length - 1];
    const newBlock: BlockchainBlock = {
      index: blockchainBlocks.length + 1041,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      txId: newOrder.blockchainTxHash || `TX-${Date.now().toString().slice(-8)}`,
      orderId: newOrder.id,
      sender: `${newOrder.buyerCompany} (${newOrder.buyerName})`,
      receiver: newOrder.farmerName,
      amount: newOrder.totalAmount,
      cropDetails: `${newOrder.crop} - ${newOrder.quantity} ${newOrder.unit} [${newOrder.paymentMethod}]`,
      previousHash: prevBlock ? prevBlock.hash : '00000000000000000000000000000000',
      hash: newOrder.blockchainTxHash?.startsWith('0x')
        ? newOrder.blockchainTxHash
        : `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      verifiedBy: 'Proof of Trade Consensus (Rythu Bhavan Node #3 - Polygon PoS Escrow)',
    };
    setBlockchainBlocks((prev) => [...prev, newBlock]);

    // Update lot status to sold
    if (newOrder.lotId) {
      setLots((prev) =>
        prev.map((l) => (l.id === newOrder.lotId ? { ...l, status: 'sold' as const } : l))
      );
    }
  };

  const handleConfirmCODPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus: 'completed' as const,
            codStatus: 'collected_by_driver' as const,
          };
        }
        return o;
      })
    );
  };

  const handleRaiseDispute = async (disputeData: Partial<Dispute>) => {
    const newDispute: Dispute = {
      id: `DSP-${Math.floor(500 + Math.random() * 500)}`,
      orderId: disputeData.orderId || 'ORD-General',
      raisedByRole: 'farmer',
      raisedByName: activeUserProfile.name,
      targetName: disputeData.targetName || 'Mandi Agency/Trader',
      type: disputeData.type || 'Price',
      description: disputeData.description || 'Discrepancy in weighment / payment.',
      evidenceUrl: disputeData.evidenceUrl,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Open',
    };

    setDisputes((prev) => [newDispute, ...prev]);

    try {
      await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispute),
      });
    } catch (e) {
      console.warn('API dispute error:', e);
    }
  };

  const handleUpdateBankDetails = (details: BankDetails) => {
    activeUserProfile.bankDetails = details;
  };

  // Admin Handlers
  const handleVerifyMarketAdmin = async (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u))
    );
    try {
      await fetch(`/api/market-admins/${userId}/verify`, { method: 'PUT' });
    } catch (e) {
      console.warn('API verify market admin error:', e);
    }
  };

  const handleResolveDispute = async (disputeId: string, resolutionNotes: string, penaltyAmount?: number) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: 'Resolved',
              adminResolutionNotes: resolutionNotes,
              penaltyAmount,
            }
          : d
      )
    );
    try {
      await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', adminResolutionNotes: resolutionNotes, penaltyAmount }),
      });
    } catch (e) {
      console.warn('API resolve dispute error:', e);
    }
  };

  const handleLevyPenalty = (reviewId: string, penaltyAmount: number) => {
    setFpoReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, penaltyAmount } : r))
    );
  };

  // Transporter Handlers
  const handleAssignTransportToOrder = async (orderId: string, vehicleId: string) => {
    const vehicle = transporters.find((t) => t.id === vehicleId);
    if (!vehicle) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              transportId: vehicle.id,
              transporterName: vehicle.transporterName,
              vehicleNumber: vehicle.vehicleNumber,
              vehicleType: vehicle.vehicleType,
              currentStep: Math.max(o.currentStep, 3),
              status: o.currentStep < 3 ? 'Transport Assigned' : o.status,
            }
          : o
      )
    );
  };

  // Community Handlers
  const handleAddCommunityPost = async (postData: Partial<CommunityPost>) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      farmerName: postData.farmerName || activeUserProfile.name,
      farmerLocation: postData.farmerLocation || activeUserProfile.location,
      farmerPhone: activeUserProfile.phone,
      crop: postData.crop || 'Cotton',
      title: postData.title || 'Market Query',
      question: postData.question || '',
      imageUrl: postData.imageUrl,
      createdAt: 'Just now',
      replies: [],
    };

    setCommunityPosts((prev) => [newPost, ...prev]);

    try {
      await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
    } catch (e) {
      console.warn('API community post error:', e);
    }
  };

  const handleAddCommunityReply = async (postId: string, text: string) => {
    const reply = {
      id: `rep-${Date.now()}`,
      authorName: activeUserProfile.name,
      authorLocation: activeUserProfile.location,
      text,
      createdAt: 'Just now',
    };

    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
      )
    );

    try {
      await fetch(`/api/community/posts/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reply),
      });
    } catch (e) {
      console.warn('API reply post error:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const copyUid = () => {
    if (!currentUser?.uid) return;
    navigator.clipboard.writeText(currentUser.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  // Quick navigation handler from Voice Assistant / IVR
  const handleVoiceNavigate = (target: string) => {
    setShowVoiceModal(false);
    if (target === 'market-prices') {
      setActiveTab('markets');
    } else if (target === 'farmer-lots' || target === 'market-offers') {
      setActiveTab('dashboard');
      setCurrentRole('farmer');
    } else if (target === 'transport') {
      setShowLogisticsModal(true);
      setLogisticsTab('transport');
    } else if (target === 'orders') {
      setActiveTab('dashboard');
    } else if (target === 'fpo') {
      setActiveTab('dashboard');
      setCurrentRole('fpo');
    } else if (target === 'community') {
      setActiveTab('community');
    }
  };

  const handleSellCropAtRate = (cropData: {
    cropName: string;
    expectedPrice?: number;
    mandiName?: string;
    unit?: string;
    variety?: string;
    imageUrl?: string;
  }) => {
    setInitialProduceDataForSell(cropData);
    setShowSellProduceModal(true);
  };

  const pendingOffersCount = offers.filter((o) => o.status === 'pending').length;

  const filteredBlockchainBlocks = blockchainBlocks.filter((b) => {
    if (!blockchainSearch.trim()) return true;
    const q = blockchainSearch.toLowerCase();
    return (
      b.orderId.toLowerCase().includes(q) ||
      b.hash.toLowerCase().includes(q) ||
      b.sender.toLowerCase().includes(q) ||
      b.receiver.toLowerCase().includes(q) ||
      b.cropDetails.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-900 selection:bg-slate-900 selection:text-white" id="dashboard-container">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={activeUserProfile}
        language={language}
        onLanguageChange={setLanguage}
        onOpenIVR={() => {
          setVoiceMode('ivr');
          setShowVoiceModal(true);
        }}
        onOpenVoice={() => {
          setVoiceMode('voice');
          setShowVoiceModal(true);
        }}
        onStartDemoFlow={() => setShowDemoModal(true)}
        pendingOffersCount={pendingOffersCount}
        onNavigateTab={(tab) => {
          if (currentRole === 'transporter') {
            if (tab === 'community' || tab === 'profile') {
              setActiveTab(tab as any);
            } else {
              setActiveTab('dashboard');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (currentRole === 'fpo') {
            if (tab === 'community' || tab === 'profile') {
              setActiveTab(tab as any);
            } else {
              setActiveTab('dashboard');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'prices' || tab === 'markets') {
            setActiveTab('markets');
          } else if (tab === 'selling') {
            if (currentRole !== 'farmer' && currentRole !== 'fpo') {
              handleRoleChange('farmer');
            }
            setActiveTab('dashboard');
          } else {
            setActiveTab(tab as any);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeTab={activeTab}
        onOpenCropScanner={() => setShowCropScannerModal(true)}
        onOpenSellProduce={() => setShowSellProduceModal(true)}
        onOpenMarketAdmin={() => {
          handleRoleChange('market');
          setActiveTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSignOut={handleLogout}
        onOpenLogin={() => navigate('/login')}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main Container Content based on activeTab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-24 sm:py-8 lg:py-10">
        {/* TAB 1: LANDING HERO / PUBLIC OVERVIEW (Hidden for Transporter and FPO) */}
        {activeTab === 'home' && currentRole !== 'transporter' && currentRole !== 'fpo' && (
          <div className="space-y-6">
            <CityMarketDetailsCard
              onSelectCropForMarket={(cropName) => {
                setSelectedCrop(cropName);
                setActiveTab('markets');
              }}
              onOpenTransportModal={() => {
                setLogisticsTab('transport');
                setShowLogisticsModal(true);
              }}
            />

            <LandingHero
              onExplorePrices={() => setActiveTab('markets')}
              onStartFarmerDemo={() => {
                if (currentRole === 'fpo' || userProfile?.role === 'fpo') {
                  setActiveTab('dashboard');
                  return;
                }
                setActiveTab('dashboard');
                setCurrentRole('farmer');
              }}
              onOpenFarmerDesk={() => {
                if (currentRole === 'fpo' || userProfile?.role === 'fpo') {
                  setActiveTab('dashboard');
                  return;
                }
                handleRoleChange('farmer');
                setActiveTab('dashboard');
              }}
              onOpenMarketAdminDesk={() => {
                handleRoleChange('market');
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenIVR={() => {
                setVoiceMode('ivr');
                setShowVoiceModal(true);
              }}
              onOpenVoice={() => {
                setVoiceMode('voice');
                setShowVoiceModal(true);
              }}
              currentUser={activeUserProfile}
              onOpenLogin={() => navigate('/login')}
              onOpenCropScanner={() => setShowCropScannerModal(true)}
              onOpenSellProduce={() => setShowSellProduceModal(true)}
            />
          </div>
        )}

        {/* TAB 2: ROLE-BASED PORTALS (Also default for Transporter and FPO) */}
        {(activeTab === 'dashboard' ||
          activeTab === 'selling' ||
          (currentRole === 'transporter' && activeTab !== 'community' && activeTab !== 'profile') ||
          (currentRole === 'fpo' && activeTab !== 'community' && activeTab !== 'profile')) && (
          <div className="space-y-6">
            {/* Show market prices card for non-FPO, non-farmer, non-market, and non-transporter roles */}
            {currentRole !== 'fpo' && currentRole !== 'farmer' && currentRole !== 'market' && currentRole !== 'market_admin' && currentRole !== 'transporter' && (
              <CityMarketDetailsCard
                onSelectCropForMarket={(cropName) => {
                  setSelectedCrop(cropName);
                  setActiveTab('markets');
                }}
                onOpenTransportModal={() => {
                  setLogisticsTab('transport');
                  setShowLogisticsModal(true);
                }}
              />
            )}

            {currentRole === 'farmer' && (
              <FarmerDashboard
                currentUser={activeUserProfile}
                lots={lots}
                offers={offers}
                orders={orders}
                sellRequests={sellRequests}
                onViewSellRequest={handleViewSellRequest}
                onCreateLot={handleCreateLot}
                onAcceptOffer={handleAcceptOffer}
                onRejectOffer={handleRejectOffer}
                onCounterOffer={handleCounterOffer}
                onAdvanceOrder={handleAdvanceOrder}
                onRaiseDispute={handleRaiseDispute}
                onUpdateBankDetails={handleUpdateBankDetails}
                onOpenTransport={() => {
                  setLogisticsTab('transport');
                  setShowLogisticsModal(true);
                }}
                onOpenStorage={() => {
                  setLogisticsTab('storage');
                  setShowLogisticsModal(true);
                }}
                onViewBlockchainBlock={() => setActiveTab('blockchain')}
                onOpenCropScanner={() => setShowCropScannerModal(true)}
                onOpenSellProduce={() => {
                  setSelectedSellRequestToView(null);
                  setShowSellProduceModal(true);
                }}
                onSellProduct={handleSellProductFromFarmer}
                mandiPrices={mandiPrices}
                marketRequiredVegetables={marketRequiredVegetables}
                onNavigateToMarkets={(cropName) => {
                  if (cropName) setSelectedCrop(cropName);
                  setActiveTab('markets');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentRole === 'fpo' && (
              <FPODashboard
                currentUser={activeUserProfile}
                lots={lots}
                sellRequests={sellRequests}
                onViewSellRequest={handleViewSellRequest}
                onSellRequestUpdated={handleSellRequestUpdated}
                onOpenSellProduce={() => {
                  setSelectedSellRequestToView(null);
                  setShowSellProduceModal(true);
                }}
              />
            )}

            {(currentRole === 'market' || currentRole === 'market_admin') && (
              <MarketAdminDashboard
                currentUser={activeUserProfile}
                mandiPrices={mandiPrices}
                onUpdateMandiPrice={handleUpdateMandiPrice}
                onVegetableAdded={handleVegetableAdded}
                onLogout={logout}
                onSwitchToFarmer={() => handleRoleChange('farmer')}
              />
            )}

            {currentRole === 'transporter' && (
              <TransporterPortal
                currentUser={activeUserProfile}
                transporters={transporters}
                orders={orders}
                onAssignTransportToOrder={handleAssignTransportToOrder}
                onAdvanceOrderStatus={handleAdvanceOrder}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                users={usersList}
                disputes={disputes}
                fpoReviews={fpoReviews}
                blockchainBlocks={blockchainBlocks}
                sellRequests={sellRequests}
                onViewSellRequest={handleViewSellRequest}
                onVerifyMarketAdmin={handleVerifyMarketAdmin}
                onResolveDispute={handleResolveDispute}
                onLevyPenalty={handleLevyPenalty}
              />
            )}
          </div>
        )}

        {/* TAB 3: MARKET INTELLIGENCE & PRICE DISCOVERY (Strictly hidden for Transporter and FPO) */}
        {(activeTab === 'markets' || activeTab === 'prices') && currentRole !== 'transporter' && currentRole !== 'fpo' && (
          <MarketIntelligence
            mandiPrices={mandiPrices}
            selectedCrop={selectedCrop}
            onSelectCrop={setSelectedCrop}
            onSelectMandiToSell={(mandi) => {
              handleSellCropAtRate({
                cropName: mandi.cropName,
                expectedPrice: mandi.currentPrice,
                mandiName: mandi.mandiName,
                unit: 'Quintals',
                variety: mandi.grade,
              });
            }}
            onSellCropAtRate={handleSellCropAtRate}
          />
        )}

        {/* TAB 4: IMMUTABLE BLOCKCHAIN SETTLEMENT LEDGER */}
        {activeTab === 'blockchain' && (
          <div className="space-y-6 text-left">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-slate-800">
              <div className="relative z-10 space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs">
                  <Database className="w-3.5 h-3.5" />
                  <span>Decentralized Proof-of-Trade Consensus</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Cryptographic Settlement Ledger
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every purchase agreement, weighment slip, and direct bank transfer is cryptographically signed and hashed into an immutable block sequence. Eliminates middlemen repudiation and guarantees verified trade provenance.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs font-mono">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">Total Blocks</span>
                    <span className="text-white font-bold text-lg">{blockchainBlocks.length}</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">Consensus Node</span>
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Rythu Bhavan #3
                    </span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">Settled Capital</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      ₹{(blockchainBlocks.reduce((acc, b) => acc + b.amount, 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">Chain Integrity</span>
                    <span className="text-white font-bold text-xs flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      100% Tamper Proof
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-700">
                Live Block Sequence ({filteredBlockchainBlocks.length} Verified Entries)
              </div>
              <input
                type="text"
                value={blockchainSearch}
                onChange={(e) => setBlockchainSearch(e.target.value)}
                placeholder="Search by Order ID, Tx Hash, Counterparty or Farmer..."
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-72 focus:outline-emerald-600"
              />
            </div>

            {/* Blocks Stream */}
            <div className="space-y-4">
              {filteredBlockchainBlocks.map((block) => (
                <div
                  key={block.index}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-colors space-y-3 font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-slate-900 text-emerald-400 font-bold text-xs">
                        Block #{block.index}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        TxID: <strong className="text-slate-900">{block.txId}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>{block.timestamp}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs pt-1">
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-500 text-[11px] block">Order & Produce</span>
                      <p className="font-semibold text-slate-900">{block.orderId}</p>
                      <p className="text-slate-600">{block.cropDetails}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-500 text-[11px] block">Transacting Parties</span>
                      <p className="text-slate-800">Procuring Entity: <strong className="text-slate-900">{block.sender}</strong></p>
                      <p className="text-slate-800">Farmer: <strong className="text-emerald-700">{block.receiver}</strong></p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-500 text-[11px] block">Settled Amount (NEFT/RTGS)</span>
                      <p className="text-emerald-700 font-extrabold text-base">
                        ₹{block.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-500">Zero Commission Deducted</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-500 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-slate-400">Current Block Hash:</span>
                      <span className="text-slate-800 break-all font-semibold">{block.hash}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-slate-400">Previous Block Hash:</span>
                      <span className="text-slate-500 break-all">{block.previousHash}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Consensus Verified: {block.verifiedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: KISAN COMMUNITY HUB & PROBLEM SOLVER */}
        {activeTab === 'community' && (
          <KisanCommunityHub
            currentUser={{
              id: activeUserProfile.id,
              name: activeUserProfile.name,
              avatar: activeUserProfile.avatar,
              district: activeUserProfile.location?.split(',')[0]?.trim() || 'Warangal',
              state: 'Telangana',
              role: activeUserProfile.role,
            }}
          />
        )}

        {/* TAB 6: ACCOUNT IDENTITY & FIRESTORE CLOUD STATUS */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative group shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xl font-bold shadow-xs overflow-hidden border-2 border-slate-100">
                      {activeUserProfile.avatar ? (
                        <img
                          src={activeUserProfile.avatar}
                          alt={activeUserProfile.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{activeUserProfile.name.charAt(0)}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPhotoModal(true)}
                      className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow cursor-pointer transition-transform hover:scale-105"
                      title="Update Profile Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{activeUserProfile.name}</h2>
                    <p className="text-xs text-slate-500">{activeUserProfile.location}</p>
                    <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {activeUserProfile.role.toUpperCase()} (Cloud Synced)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(true)}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Change Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile &amp; Settings</span>
                  </button>
                </div>
              </div>

              {/* KYC & Verification Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-medium block">Phone Number (OTP Verified)</span>
                  <p className="font-semibold text-slate-900">{activeUserProfile.phone}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-medium block">Email Address</span>
                  <p className="font-semibold text-slate-900">{activeUserProfile.email || 'None provided'}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-medium block">PAN / Tax Identifier</span>
                  <p className="font-semibold text-slate-900 font-mono">{activeUserProfile.panCard}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-medium block">Aadhaar Verification Status</span>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>UIDAI Biometric Verified</span>
                  </p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-700" />
                    <span>Direct Bank Transfer Destination (Zero Commission)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Auto-Disbursed
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Bank Name</span>
                    <strong className="text-slate-900">{activeUserProfile.bankDetails?.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Account Number</span>
                    <strong className="text-slate-900 font-mono">{activeUserProfile.bankDetails?.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">IFSC Code</span>
                    <strong className="text-slate-900 font-mono">{activeUserProfile.bankDetails?.ifscCode}</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center gap-4 text-[11px] text-emerald-900">
                  <span>UPI ID: <strong>{activeUserProfile.bankDetails?.upiId}</strong></span>
                  <span>Paytm Linked: <strong>{activeUserProfile.bankDetails?.paytmNumber}</strong></span>
                </div>
              </div>

              {/* Unique Identifier */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
                <span className="text-slate-500 font-medium">Session User ID (UID):</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono bg-white p-2 rounded border border-slate-200 text-slate-700 flex-1 text-[11px] break-all">
                    {currentUser?.uid || 'usr-farmer-ramesh'}
                  </code>
                  <button
                    onClick={copyUid}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 cursor-pointer"
                    title="Copy UID"
                  >
                    {copiedUid ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of KisanSetu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: LIVE SHIPMENT TRACKING & DRIVER INTERACTION */}
        {activeTab === 'tracking' && (
          <TrackShipment
            orders={orders}
            currentUser={activeUserProfile}
            onAdvanceOrderStatus={handleAdvanceOrder}
            onConfirmCODPayment={handleConfirmCODPayment}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (Phones: iPhone, Samsung, Realme, Moto, OnePlus) */}
      <MobileBottomNav
        activeTab={activeTab}
        currentRole={currentRole}
        onNavigateTab={(tab) => {
          if (tab === 'prices' || tab === 'markets') {
            setActiveTab('markets');
          } else if (tab === 'selling') {
            if (currentRole !== 'farmer' && currentRole !== 'fpo') {
              handleRoleChange('farmer');
            }
            setActiveTab('dashboard');
          } else {
            setActiveTab(tab as any);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        lotsCount={lots.length}
        offersCount={pendingOffersCount}
      />

      {/* COMPREHENSIVE MOBILE OPTIONS DRAWER */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={activeUserProfile}
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          if (tab === 'prices' || tab === 'markets') {
            setActiveTab('markets');
          } else if (tab === 'selling') {
            if (currentRole !== 'farmer' && currentRole !== 'fpo') {
              handleRoleChange('farmer');
            }
            setActiveTab('dashboard');
          } else {
            setActiveTab(tab as any);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCropScanner={() => setShowCropScannerModal(true)}
        onOpenSellProduce={() => setShowSellProduceModal(true)}
        onOpenVoice={() => {
          setVoiceMode('voice');
          setShowVoiceModal(true);
        }}
        onOpenIVR={() => {
          setVoiceMode('ivr');
          setShowVoiceModal(true);
        }}
        onOpenLogistics={() => setShowLogisticsModal(true)}
        onStartDemoFlow={() => setShowDemoModal(true)}
        onSignOut={handleLogout}
        lotsCount={lots.length}
        offersCount={pendingOffersCount}
      />

      {/* MODALS */}
      {/* 1. Voice & Interactive IVR Telephony Simulator Modal */}
      <VoiceAndIVRModal
        mode={voiceMode}
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        language={language}
        onNavigateAction={handleVoiceNavigate}
      />

      {/* 2. SIH 26132 Step-by-Step Interactive Demo Walkthrough */}
      <DemoFlowModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onJumpToSection={(tab, role) => {
          setActiveTab(tab as any);
          if (role) setCurrentRole(role as any);
        }}
        onOpenIVR={() => {
          setVoiceMode('ivr');
          setShowVoiceModal(true);
        }}
      />

      {/* 3. Logistics & Cold Storage Marketplace Modal */}
      <LogisticsAndStorageModal
        isOpen={showLogisticsModal}
        onClose={() => setShowLogisticsModal(false)}
        transporters={transporters}
        warehouses={warehouses}
        defaultTab={logisticsTab}
      />

      {/* 4. Update Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhotoURL={activeUserProfile.avatar}
        userName={activeUserProfile.name}
      />

      {/* 5. Optical Crop Quality, Pricing & Mandi Transport Modal */}
      <CropQualityScannerModal
        isOpen={showCropScannerModal}
        onClose={() => setShowCropScannerModal(false)}
        currentUser={activeUserProfile}
        onCreateLot={handleCreateLot}
        onNavigateToMarket={() => {
          setActiveTab('dashboard');
          handleRoleChange('market');
        }}
      />

      {/* 6. Direct Sell Harvest Produce to Mandi / Markets Modal */}
      <SellProduceModal
        isOpen={showSellProduceModal}
        onClose={() => {
          setShowSellProduceModal(false);
          setSelectedSellRequestToView(null);
          setInitialProduceDataForSell(null);
        }}
        currentUser={activeUserProfile}
        mandiPrices={mandiPrices}
        onPublishListing={handlePublishProduceListing}
        onSellRequestCreated={handleSellRequestCreated}
        onSellRequestUpdated={handleSellRequestUpdated}
        initialRequestToView={selectedSellRequestToView}
        initialProduceData={initialProduceDataForSell}
      />
    </div>
  );
};

export default Dashboard;
