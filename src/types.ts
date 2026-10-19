export type UserRole = 'farmer' | 'fpo' | 'market_admin' | 'market' | 'transporter' | 'admin';

export type Language = 'en' | 'te' | 'hi';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId: string;
  paytmNumber?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  phone: string;
  location: string;
  avatar?: string;
  bio?: string;
  cropsGrown?: string[];
  followersCount?: number;
  followingCount?: number;
  isVerified?: boolean;
  panCard?: string;
  aadharNumber?: string;
  gstNumber?: string;
  businessName?: string;
  bankDetails?: BankDetails;
  rating?: number;
}

export interface CropInfo {
  id: string;
  name: string;
  nameHi: string;
  nameTe: string;
  category: 'Cash Crop' | 'Cereal' | 'Vegetable' | 'Pulse' | 'Spices';
  unit: string;
  icon: string;
  basePrice: number;
}

export interface MandiPrice {
  id: string;
  mandiName: string;
  district: string;
  state: string;
  cropName: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  currentPrice: number;
  prevDayPrice: number;
  weeklyAvg: number;
  monthlyAvg: number;
  distanceKm: number;
  arrivalVolumeQuintals: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  transportCostPerQuintal: number;
  netValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: string;
  variety?: string;
  grade?: string;
  arrivalDate?: string;
  unit?: string;
  dailyArrivalTons?: number;
  priceTrend?: string;
  historicalPrices?: Array<{ date: string; price: number }>;
}

export interface Vegetable {
  _id?: string;
  id: string;
  name: string;
  nameHi?: string;
  nameTe?: string;
  category: string;
  unit: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  market: string;
  location: string;
  image?: string;
  description?: string;
  priceDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceHistory {
  _id?: string;
  id: string;
  vegetableId: string;
  vegetableName?: string;
  previousPrice: number;
  newPrice: number;
  minPrice?: number;
  maxPrice?: number;
  changedBy: string;
  market: string;
  createdAt: string;
  notes?: string;
}

export interface CropLot {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  grade: 'A' | 'B' | 'C';
  moisture: number;
  harvestDate: string;
  expectedPrice: number;
  location: string;
  imageUrl: string;
  availabilityDate: string;
  status: 'available' | 'reserved' | 'sold';
  isBulkLot?: boolean;
  aggregatedFrom?: ({ farmerName: string; quantity: number } | string)[];
  fpoOfficerAssigned?: string;
  physicalQualityCheckedByFPO?: boolean;
  bankDetails?: BankDetails;
  farmerRating?: number;
  verifiedHarvest?: boolean;
  aiGradeScore?: number;
}

export type SellRequestStatus =
  | 'pending_fpo'
  | 'fpo_accepted'
  | 'fpo_traveling'
  | 'inspecting'
  | 'price_agreed'
  | 'transport_selected'
  | 'in_transit'
  | 'delivered'
  | 'completed';

export interface FPOOfficer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  fpoOrganization: string;
  district: string;
  state: string;
  rating: number;
  currentLocation?: string;
  assignedPinCode?: string;
  avatar?: string;
  totalCommissionsEarned?: number;
  completedInspectionsCount?: number;
}

export interface CommissionBreakdown {
  finalProduceValue: number;       // e.g. ₹50,000
  sellerPayout: number;            // ₹48,750 (97.5%)
  fpoCommission: number;           // ₹750 (1.5%)
  platformCommission: number;      // ₹500 (1%)
  sellerPayoutPercentage: number;  // 97.5
  fpoCommissionPercentage: number; // 1.5
  platformCommissionPercentage: number; // 1
}

export interface SellRequestInspection {
  inspectedAt: string;
  officerId: string;
  officerName: string;
  grade: 'A+' | 'A' | 'B' | 'C';
  moisturePercentage: number;
  foreignMatterPercentage: number;
  qualityNotes: string;
  inspectionPhotoUrl?: string;
  verifiedPass: boolean;
}

export interface SellRequestTransport {
  type: 'app_logistics' | 'own_transport';
  transporterName?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleType?: string;
  estimatedFreight?: number;
  pickupTime?: string;
  trackingStatus?: string;
}

export interface SellRequestStatusLog {
  status: SellRequestStatus;
  timestamp: string;
  note: string;
  actorRole: string;
  actorName: string;
}

export interface SellRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  crop: string;
  variety?: string;
  quantity: number;
  unit: string;
  expectedPricePerUnit: number;
  expectedTotalAmount: number;
  imageUrl?: string;
  photos?: string[];
  qualityDetails?: {
    grade?: 'A' | 'B' | 'C';
    moisture?: number;
    harvestDate?: string;
    notes?: string;
  };
  sellerLocation: {
    address: string;
    village?: string;
    mandal?: string;
    district: string;
    state: string;
    pincode?: string;
    lat?: number;
    lng?: number;
    landmark?: string;
  };
  status: SellRequestStatus;
  statusLogs: SellRequestStatusLog[];
  assignedFpoOfficer?: FPOOfficer;
  inspection?: SellRequestInspection;
  finalPricePerUnit?: number;
  finalProduceValue?: number;
  commissionBreakdown?: CommissionBreakdown;
  paymentSettled?: boolean;
  paymentSettledAt?: string;
  transport?: SellRequestTransport;
  destinationMarket?: string;
  buyerName?: string;
  buyerCompany?: string;
  createdAt: string;
  updatedAt: string;
}

export function calculateCommissions(finalProduceValue: number): CommissionBreakdown {
  const fpoCommission = Math.round(finalProduceValue * 0.015 * 100) / 100;
  const platformCommission = Math.round(finalProduceValue * 0.01 * 100) / 100;
  const sellerPayout = Math.round((finalProduceValue - fpoCommission - platformCommission) * 100) / 100;

  return {
    finalProduceValue,
    sellerPayout,
    fpoCommission,
    platformCommission,
    sellerPayoutPercentage: 97.5,
    fpoCommissionPercentage: 1.5,
    platformCommissionPercentage: 1,
  };
}

export interface BuyerOffer {
  id: string;
  lotId: string;
  crop: string;
  quantity: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerVerified: boolean;
  offerPricePerQuintal: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
  createdAt: string;
  note?: string;
}

export type OrderStatusStep =
  | 'Offer Accepted'
  | 'Order Confirmed'
  | 'Transport Assigned'
  | 'Pickup Scheduled'
  | 'Crop Picked Up'
  | 'In Transit'
  | 'Delivered'
  | 'Quality Verified'
  | 'Payment Processing'
  | 'Payment Completed';

export interface DriverDetails {
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  vehicleNumber: string;
  vehicleType: string;
  currentLocationName: string;
  etaMinutes: number;
  distanceRemainingKm: number;
  chatMessages?: { sender: 'buyer' | 'driver'; text: string; time: string }[];
}

export interface DeliveryAddressDetails {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
  addressType: 'Mandi Stall / Shop' | 'Commercial Warehouse' | 'Food Processing Unit' | 'Home / Office';
  deliverySlot?: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  lotId: string;
  crop: string;
  quantity: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  agreedPrice: number;
  totalAmount: number;
  currentStep: number; // 1 to 10
  status: OrderStatusStep;
  transportId?: string;
  transporterName?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  pickupLocation: string;
  deliveryLocation: string;
  createdAt: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod?: 'Direct Bank Transfer (NEFT/RTGS)' | 'UPI / QR' | 'Paytm' | 'Cash on Delivery (COD)' | string;
  paymentType?: 'cod' | 'upi' | 'escrow_bank' | 'blockchain' | 'wallet';
  codStatus?: 'pending_collection' | 'collected_by_driver' | 'verified';
  itemImageUrl?: string;
  deliveryAddress?: DeliveryAddressDetails;
  driverDetails?: DriverDetails;
  blockchainTxHash?: string;
  blockNumber?: number;
  blockchainNetwork?: string;
  upiUtrNumber?: string;
  upiApp?: 'phonepe' | 'gpay' | 'paytm' | 'bhim';
  bankUtrNumber?: string;
}

export interface TransporterVehicle {
  id: string;
  transporterId: string;
  transporterName: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  vehicleNumber: string;
  vehicleType: 'Mini Pickup (1 Ton)' | 'Tata 407 (2.5 Ton)' | 'Heavy Lorry (10 Ton)' | 'Multi-Axle Truck (20 Ton)';
  capacityTonnes: number;
  ratePerKm: number;
  currentLocation: string;
  isAvailable: boolean;
  rating: number;
  totalTrips: number;
}

export interface WarehouseStorage {
  id: string;
  name: string;
  agency: string;
  location: string;
  distanceKm: number;
  totalCapacityTonnes: number;
  availableCapacityTonnes: number;
  coldStorageAvailable: boolean;
  ratePerQuintalPerMonth: number;
  contactNumber: string;
  securityRating: number;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedByRole: 'farmer' | 'market_admin' | 'market' | 'fpo' | 'transporter';
  raisedByName: string;
  targetName: string;
  type: 'Payment' | 'Quality' | 'Quantity' | 'Delivery' | 'Price';
  description: string;
  evidenceUrl?: string;
  createdAt: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected' | 'Closed';
  adminResolutionNotes?: string;
  penaltyAmount?: number;
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  txId: string;
  orderId: string;
  sender: string;
  receiver: string;
  amount: number;
  cropDetails: string;
  previousHash: string;
  hash: string;
  verifiedBy: string;
}

export interface FPOFarmerReview {
  id: string;
  fpoId: string;
  fpoName: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  reviewText: string;
  isScamReport: boolean;
  submittedAt: string;
}

export type ProblemCategory =
  | 'pest_disease'
  | 'market_mandi'
  | 'crop_health'
  | 'weather_damage'
  | 'seeds_fertilizer'
  | 'machinery'
  | 'government_scheme'
  | 'general';

export type ProblemUrgency = 'urgent' | 'moderate' | 'inquiry';

export interface CommunityReply {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole?: UserRole;
  authorLocation: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
  isHelpful?: boolean;
  upvotes?: string[];
}

export interface CommunityPost {
  id: string;
  farmerId?: string;
  farmerName: string;
  farmerRole?: UserRole;
  farmerAvatar?: string;
  farmerLocation: string;
  farmerPhone?: string;
  crop: string;
  problemCategory?: ProblemCategory;
  urgency?: ProblemUrgency;
  title: string;
  question: string;
  imageUrl?: string;
  status?: 'open' | 'resolved';
  resolvedReplyId?: string;
  likes?: string[];
  createdAt: string;
  replies: CommunityReply[];
}

export interface FollowRelation {
  id: string;
  followerId: string;
  followerName: string;
  followingId: string;
  followingName: string;
  createdAt: string;
}

export interface AIRecommendation {
  crop: string;
  recommendedMarket: string;
  expectedNetValue: number;
  marketPrice: number;
  transportCost: number;
  confidenceScore: number;
  reason: string;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
  actionAdvice: string;
}

export interface AIPriceForecast {
  crop: string;
  market: string;
  currentPrice: number;
  predictedPrice7Days: number;
  predictedPrice15Days: number;
  predictedPrice30Days: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  factors: string[];
}

export type Transporter = any;
export type Warehouse = any;
export type FPOReview = FPOFarmerReview & { penaltyAmount?: number };

export interface CityMarketMandi {
  id: string;
  name: string;
  type: 'Wholesale' | 'APMC Yard' | 'Rythu Bazar' | 'Terminal Market';
  locationArea: string;
  timings: string;
  dailyArrivalTonnes: number;
  enamConnected: boolean;
  activeTradersCount: number;
  contactNumber: string;
}

export interface CityMarketCropPrice {
  cropName: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeAmount: number;
  arrivalVolumeQuintals: number;
  primaryMandi: string;
}

export interface CityMarket {
  id: string;
  name: string;
  shortCode: string;
  nameHi: string;
  nameTe: string;
  state: string;
  region: 'Telangana' | 'Andhra Pradesh' | 'South India' | 'Western India' | 'North India' | 'East India';
  lat: number;
  lng: number;
  isDefault?: boolean;
  distanceFromHydKm: number;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    roadCondition: string;
    transitAlert?: string;
  };
  apmcOverview: {
    totalActiveMandis: number;
    dailyArrivalsTotalQuintals: number;
    primaryHubName: string;
    marketFeePercentage: number;
    weighmentType: string;
  };
  mandis: CityMarketMandi[];
  cropPrices: CityMarketCropPrice[];
  logisticsHub: {
    averageTransitHoursFromHyd: number;
    freightPerQuintalFromHyd: number;
    availableTrucksCount: number;
    routeHighway: string;
  };
}

