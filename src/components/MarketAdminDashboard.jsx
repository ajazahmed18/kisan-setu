import { useState, useEffect, useMemo } from "react";
import {
  Building2,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  History,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Scale,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  X,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  Check,
  SlidersHorizontal,
  Bell,
  LogOut,
  Wheat
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
const DEFAULT_PRESET_IMAGES = [
  { name: "Tomato", category: "Fruit Vegetable", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80" },
  { name: "Onion", category: "Allium & Bulb", url: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80" },
  { name: "Potato", category: "Root & Tuber", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80" },
  { name: "Green Chilli", category: "Spices & Condiments", url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80" },
  { name: "Brinjal (Eggplant)", category: "Fruit Vegetable", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80" },
  { name: "Cabbage", category: "Leafy Green", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80" },
  { name: "Cauliflower", category: "Brassica", url: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80" },
  { name: "Carrot", category: "Root & Tuber", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80" },
  { name: "Okra (Bhendi)", category: "Fruit Vegetable", url: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&auto=format&fit=crop&q=80" },
  { name: "Cucumber", category: "Gourd & Cucurbit", url: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&auto=format&fit=crop&q=80" },
  { name: "Bitter Gourd (Karela)", category: "Gourd & Cucurbit", url: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80" },
  { name: "Ginger", category: "Root & Tuber", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80" },
  { name: "Garlic", category: "Allium & Bulb", url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&auto=format&fit=crop&q=80" },
  { name: "Spinach (Palak)", category: "Leafy Green", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80" },
  { name: "Coriander", category: "Leafy Green", url: "https://images.unsplash.com/photo-1589135233689-d44697926bdf?w=400&auto=format&fit=crop&q=80" },
  { name: "Capsicum", category: "Fruit Vegetable", url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80" }
];
export const VEGETABLE_CATEGORIES = [
  "All",
  "Fruit Vegetable",
  "Root & Tuber",
  "Leafy Green",
  "Gourd & Cucurbit",
  "Allium & Bulb",
  "Spices & Condiments",
  "Brassica",
  "Legume & Pod",
  "Other"
];
export const INITIAL_SEED_VEGETABLES = [
  {
    id: "veg-tomato-hybrid",
    name: "Tomato (Hybrid Desi)",
    nameHi: "\u091F\u092E\u093E\u091F\u0930 (\u0926\u0947\u0938\u0940 \u0938\u0902\u0915\u0930)",
    nameTe: "\u0C1F\u0C2E\u0C4B\u0C1F\u0C3E (\u0C39\u0C48\u0C2C\u0C4D\u0C30\u0C3F\u0C21\u0C4D)",
    category: "Fruit Vegetable",
    unit: "kg",
    currentPrice: 24,
    minPrice: 20,
    maxPrice: 28,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80",
    description: "Grade A fresh harvest arrivals, firm skin, standard 25kg crates",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 18e5).toISOString()
  },
  {
    id: "veg-onion-nashik",
    name: "Onion (Red Nashik)",
    nameHi: "\u092A\u094D\u092F\u093E\u091C (\u0928\u093E\u0938\u093F\u0915 \u0932\u093E\u0932)",
    nameTe: "\u0C09\u0C32\u0C4D\u0C32\u0C3F\u0C2A\u0C3E\u0C2F (\u0C0E\u0C30\u0C41\u0C2A\u0C41)",
    category: "Allium & Bulb",
    unit: "kg",
    currentPrice: 26,
    minPrice: 22,
    maxPrice: 30,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80",
    description: "Medium dry bulb, high shelf life, 50kg ventilated mesh bags",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 36e5).toISOString()
  },
  {
    id: "veg-potato-jyoti",
    name: "Potato (Jyoti / Kufri)",
    nameHi: "\u0906\u0932\u0942 (\u0915\u0941\u092B\u0930\u0940 \u091C\u094D\u092F\u094B\u0924\u093F)",
    nameTe: "\u0C2C\u0C02\u0C17\u0C3E\u0C33\u0C3E\u0C26\u0C41\u0C02\u0C2A (\u0C1C\u0C4D\u0C2F\u0C4B\u0C24\u0C3F)",
    category: "Root & Tuber",
    unit: "kg",
    currentPrice: 22,
    minPrice: 18,
    maxPrice: 25,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
    description: "Clean uniform tubers, zero greening, ideal for storage",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 2).toISOString()
  },
  {
    id: "veg-green-chilli-teja",
    name: "Green Chilli (Guntur Teja)",
    nameHi: "\u0939\u0930\u0940 \u092E\u093F\u0930\u094D\u091A (\u0917\u0941\u0902\u091F\u0942\u0930 \u0924\u0947\u091C\u093E)",
    nameTe: "\u0C2A\u0C1A\u0C4D\u0C1A\u0C3F\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F (\u0C24\u0C47\u0C1C)",
    category: "Spices & Condiments",
    unit: "kg",
    currentPrice: 65,
    minPrice: 55,
    maxPrice: 75,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80",
    description: "Deep green, high pungency, fresh stems intact",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 3).toISOString()
  },
  {
    id: "veg-brinjal-round",
    name: "Brinjal (Round Purple)",
    nameHi: "\u092C\u0948\u0902\u0917\u0928 (\u0917\u094B\u0932 \u092C\u0948\u0902\u0917\u0928\u0940)",
    nameTe: "\u0C35\u0C02\u0C15\u0C3E\u0C2F (\u0C17\u0C41\u0C02\u0C21\u0C4D\u0C30\u0C1F\u0C3F)",
    category: "Fruit Vegetable",
    unit: "kg",
    currentPrice: 28,
    minPrice: 22,
    maxPrice: 34,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80",
    description: "Glossy fresh skin, pest free, daily direct farmer harvest",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 4).toISOString()
  },
  {
    id: "veg-cabbage-green",
    name: "Cabbage (Green Drumhead)",
    nameHi: "\u092A\u0924\u094D\u0924\u093E\u0917\u094B\u092D\u0940 (\u0939\u0930\u0940)",
    nameTe: "\u0C15\u0C4D\u0C2F\u0C3E\u0C2C\u0C47\u0C1C\u0C40 (\u0C06\u0C15\u0C41\u0C2A\u0C1A\u0C4D\u0C1A)",
    category: "Leafy Green",
    unit: "kg",
    currentPrice: 18,
    minPrice: 14,
    maxPrice: 22,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80",
    description: "Compact solid heads, clean outer wrapper leaves",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 5).toISOString()
  },
  {
    id: "veg-cauliflower-white",
    name: "Cauliflower (Snowball White)",
    nameHi: "\u092B\u0942\u0932\u0917\u094B\u092D\u0940 (\u0938\u092B\u0947\u0926 \u0938\u094D\u0928\u094B\u092C\u0949\u0932)",
    nameTe: "\u0C15\u0C4D\u0C2F\u0C3E\u0C32\u0C40\u0C2B\u0C4D\u0C32\u0C35\u0C30\u0C4D (\u0C24\u0C46\u0C32\u0C41\u0C2A\u0C41)",
    category: "Brassica",
    unit: "kg",
    currentPrice: 32,
    minPrice: 25,
    maxPrice: 38,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80",
    description: "Pure white tight curds, crisp texture, shaded transport",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 6).toISOString()
  },
  {
    id: "veg-carrot-orange",
    name: "Carrot (Desi Orange)",
    nameHi: "\u0917\u093E\u091C\u0930 (\u0926\u0947\u0938\u0940 \u0928\u093E\u0930\u0902\u0917\u0940)",
    nameTe: "\u0C15\u0C4D\u0C2F\u0C3E\u0C30\u0C46\u0C1F\u0C4D (\u0C28\u0C3E\u0C30\u0C3F\u0C02\u0C1C)",
    category: "Root & Tuber",
    unit: "kg",
    currentPrice: 35,
    minPrice: 28,
    maxPrice: 42,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80",
    description: "Washed, smooth taper, sweet crisp core",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 7).toISOString()
  },
  {
    id: "veg-okra-green",
    name: "Okra / Bhendi (Hybrid)",
    nameHi: "\u092D\u093F\u0902\u0921\u0940 (\u0938\u0902\u0915\u0930)",
    nameTe: "\u0C2C\u0C46\u0C02\u0C21\u0C15\u0C3E\u0C2F (\u0C39\u0C48\u0C2C\u0C4D\u0C30\u0C3F\u0C21\u0C4D)",
    category: "Fruit Vegetable",
    unit: "kg",
    currentPrice: 40,
    minPrice: 32,
    maxPrice: 48,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&auto=format&fit=crop&q=80",
    description: "Tender dark green pods, snapping tips, fresh early morning pick",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 8).toISOString()
  },
  {
    id: "veg-cucumber-green",
    name: "Cucumber (Desi Green)",
    nameHi: "\u0916\u0940\u0930\u093E (\u0939\u0930\u093E \u0926\u0947\u0938\u0940)",
    nameTe: "\u0C26\u0C4B\u0C38\u0C15\u0C3E\u0C2F (\u0C06\u0C15\u0C41\u0C2A\u0C1A\u0C4D\u0C1A)",
    category: "Gourd & Cucurbit",
    unit: "kg",
    currentPrice: 20,
    minPrice: 15,
    maxPrice: 25,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&auto=format&fit=crop&q=80",
    description: "Crisp slicing cucumbers, high moisture, cool morning arrival",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 9).toISOString()
  },
  {
    id: "veg-bitter-gourd",
    name: "Bitter Gourd (Karela Long)",
    nameHi: "\u0915\u0930\u0947\u0932\u093E (\u0932\u0902\u092C\u093E \u0939\u0930\u093E)",
    nameTe: "\u0C15\u0C3E\u0C15\u0C30\u0C15\u0C3E\u0C2F (\u0C2A\u0C4A\u0C21\u0C35\u0C3E\u0C1F\u0C3F)",
    category: "Gourd & Cucurbit",
    unit: "kg",
    currentPrice: 45,
    minPrice: 38,
    maxPrice: 52,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80",
    description: "Dark green sharp ridges, firm flesh, export standard",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 10).toISOString()
  },
  {
    id: "veg-ginger-fresh",
    name: "Ginger (Fresh Rhizome)",
    nameHi: "\u0905\u0926\u0930\u0915 (\u0924\u093E\u091C\u093E \u092A\u094D\u0930\u0915\u0902\u0926)",
    nameTe: "\u0C05\u0C32\u0C4D\u0C32\u0C02 (\u0C24\u0C3E\u0C1C\u0C3E)",
    category: "Root & Tuber",
    unit: "kg",
    currentPrice: 85,
    minPrice: 70,
    maxPrice: 105,
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80",
    description: "Unwashed fibrous bold rhizomes, strong aroma and warmth",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 36e5 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 11).toISOString()
  }
];
export const MarketAdminDashboard = ({
  currentUser,
  mandiPrices = [],
  onUpdateMandiPrice,
  onLogout,
  onVegetableAdded,
  onSwitchToFarmer
}) => {
  const { language } = useLanguage();
  const isMarketAdmin = currentUser?.role === "market" || currentUser?.role === "market_admin" || currentUser?.role === "admin";
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vegetables, setVegetables] = useState(INITIAL_SEED_VEGETABLES);
  const [priceHistories, setPriceHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVegetable, setEditingVegetable] = useState(null);
  const [deletingVegetable, setDeletingVegetable] = useState(null);
  const [selectedVegetableForHistory, setSelectedVegetableForHistory] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4e3);
  };
  useEffect(() => {
    fetchVegetables();
    fetchPriceHistory();
  }, []);
  const fetchVegetables = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vegetables");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVegetables(data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch vegetables from API, using initial list:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPriceHistory = async () => {
    try {
      const res = await fetch("/api/vegetables/history");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPriceHistories(data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch price history from API:", err);
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    nameHi: "",
    nameTe: "",
    category: "Fruit Vegetable",
    unit: "kg",
    currentPrice: "",
    minPrice: "",
    maxPrice: "",
    market: "Warangal APMC Enamamula Market",
    location: "Warangal, Telangana",
    priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    image: DEFAULT_PRESET_IMAGES[0].url,
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const resetForm = () => {
    setFormData({
      name: "",
      nameHi: "",
      nameTe: "",
      category: "Fruit Vegetable",
      unit: "kg",
      currentPrice: "",
      minPrice: "",
      maxPrice: "",
      market: currentUser.businessName || "Warangal APMC Enamamula Market",
      location: currentUser.location || "Warangal, Telangana",
      priceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      image: DEFAULT_PRESET_IMAGES[0].url,
      description: ""
    });
    setFormErrors({});
  };
  const handleOpenAddModal = () => {
    if (!isMarketAdmin) {
      showToast("Read-Only: Only Market Administrators can add vegetables.", "info");
      return;
    }
    resetForm();
    setShowAddModal(true);
  };
  const handleOpenEditModal = (veg) => {
    if (!isMarketAdmin) {
      showToast("Read-Only: Farmers cannot edit market rates. Only Market Admins have edit access.", "info");
      return;
    }
    setEditingVegetable(veg);
    setFormData({
      name: veg.name,
      nameHi: veg.nameHi || "",
      nameTe: veg.nameTe || "",
      category: veg.category,
      unit: veg.unit,
      currentPrice: veg.currentPrice.toString(),
      minPrice: veg.minPrice.toString(),
      maxPrice: veg.maxPrice.toString(),
      market: veg.market,
      location: veg.location,
      priceDate: veg.priceDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      image: veg.image || DEFAULT_PRESET_IMAGES[0].url,
      description: veg.description || ""
    });
    setFormErrors({});
  };
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Vegetable name is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.unit.trim()) errors.unit = "Unit is required";
    const cur = parseFloat(formData.currentPrice);
    const min = parseFloat(formData.minPrice);
    const max = parseFloat(formData.maxPrice);
    if (isNaN(cur) || cur <= 0) {
      errors.currentPrice = "Enter a valid positive price (> 0)";
    }
    if (isNaN(min) || min < 0) {
      errors.minPrice = "Minimum price must be 0 or greater";
    }
    if (isNaN(max) || max <= 0) {
      errors.maxPrice = "Maximum price must be greater than 0";
    }
    if (!isNaN(cur) && !isNaN(min) && min > cur) {
      errors.minPrice = "Min price cannot exceed current price";
    }
    if (!isNaN(cur) && !isNaN(max) && max < cur) {
      errors.maxPrice = "Max price cannot be lower than current price";
    }
    if (!isNaN(min) && !isNaN(max) && min > max) {
      errors.minPrice = "Min price cannot be greater than max price";
    }
    if (!formData.market.trim()) errors.market = "Market name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmitAddVegetable = async (e) => {
    e.preventDefault();
    if (!isMarketAdmin) {
      showToast("Permission Denied: Only Market Administrators can add vegetables.", "error");
      return;
    }
    if (!validateForm()) return;
    setIsSyncing(true);
    const cur = parseFloat(formData.currentPrice);
    const min = parseFloat(formData.minPrice);
    const max = parseFloat(formData.maxPrice);
    const newVeg = {
      name: formData.name.trim(),
      nameHi: formData.nameHi.trim() || void 0,
      nameTe: formData.nameTe.trim() || void 0,
      category: formData.category,
      unit: formData.unit,
      currentPrice: cur,
      minPrice: min,
      maxPrice: max,
      market: formData.market.trim(),
      location: formData.location.trim(),
      image: formData.image,
      description: formData.description.trim() || "Fresh market arrival recorded by Market Admin",
      priceDate: formData.priceDate
    };
    try {
      const res = await fetch("/api/vegetables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "market_admin"
        },
        body: JSON.stringify({
          ...newVeg,
          adminName: currentUser.name || "Market Admin"
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setVegetables((prev) => [saved, ...prev]);
        if (onVegetableAdded) onVegetableAdded(saved);
        fetchPriceHistory();
        setShowAddModal(false);
        resetForm();
        showToast(`Successfully added ${saved.name} to market bulletin!`);
        if (activeTab === "add") setActiveTab("vegetables");
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to add vegetable", "error");
      }
    } catch (err) {
      const localVeg = {
        id: `veg-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit,
        currentPrice: cur,
        minPrice: min,
        maxPrice: max,
        market: formData.market.trim(),
        location: formData.location.trim(),
        image: formData.image,
        description: formData.description.trim() || "Fresh market arrival",
        priceDate: formData.priceDate,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      setVegetables((prev) => [localVeg, ...prev]);
      if (onVegetableAdded) onVegetableAdded(localVeg);
      setShowAddModal(false);
      resetForm();
      showToast(`Added ${localVeg.name} (saved to local session)!`);
    } finally {
      setIsSyncing(false);
    }
  };
  const handleSubmitEditVegetable = async (e) => {
    e.preventDefault();
    if (!isMarketAdmin) {
      showToast("Permission Denied: Only Market Administrators can edit prices.", "error");
      return;
    }
    if (!editingVegetable) return;
    if (!validateForm()) return;
    setIsSyncing(true);
    const cur = parseFloat(formData.currentPrice);
    const min = parseFloat(formData.minPrice);
    const max = parseFloat(formData.maxPrice);
    const updatePayload = {
      name: formData.name.trim(),
      nameHi: formData.nameHi.trim() || void 0,
      nameTe: formData.nameTe.trim() || void 0,
      category: formData.category,
      unit: formData.unit,
      currentPrice: cur,
      minPrice: min,
      maxPrice: max,
      market: formData.market.trim(),
      location: formData.location.trim(),
      image: formData.image,
      description: formData.description.trim(),
      priceDate: formData.priceDate,
      adminName: currentUser.name || "Market Admin"
    };
    try {
      const res = await fetch(`/api/vegetables/${editingVegetable.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "market_admin"
        },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) {
        const updated = await res.json();
        setVegetables(
          (prev) => prev.map((v) => v.id === editingVegetable.id ? updated : v)
        );
        fetchPriceHistory();
        setEditingVegetable(null);
        showToast(`Updated price and specs for ${updated.name}!`);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to update vegetable", "error");
      }
    } catch (err) {
      setVegetables(
        (prev) => prev.map(
          (v) => v.id === editingVegetable.id ? {
            ...v,
            ...updatePayload,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          } : v
        )
      );
      setEditingVegetable(null);
      showToast(`Price updated for ${formData.name} (local session)!`);
    } finally {
      setIsSyncing(false);
    }
  };
  const handleConfirmDeleteVegetable = async () => {
    if (!isMarketAdmin) {
      showToast("Permission Denied: Only Market Administrators can delete vegetables.", "error");
      return;
    }
    if (!deletingVegetable) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/vegetables/${deletingVegetable.id}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "market_admin"
        }
      });
      if (res.ok) {
        setVegetables((prev) => prev.filter((v) => v.id !== deletingVegetable.id));
        showToast(`Removed ${deletingVegetable.name} from market bulletin.`);
        setDeletingVegetable(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to delete vegetable", "error");
      }
    } catch (err) {
      setVegetables((prev) => prev.filter((v) => v.id !== deletingVegetable.id));
      showToast(`Removed ${deletingVegetable.name} (local session).`);
      setDeletingVegetable(null);
    } finally {
      setIsSyncing(false);
    }
  };
  const summaryMetrics = useMemo(() => {
    const totalCount = vegetables.length;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const updatedTodayCount = vegetables.filter((v) => {
      const d = v.priceDate || v.updatedAt?.split("T")[0];
      return d === today;
    }).length;
    const now = Date.now();
    const recentlyUpdatedCount = vegetables.filter((v) => {
      if (!v.updatedAt) return false;
      const t = new Date(v.updatedAt).getTime();
      return now - t < 24 * 3600 * 1e3;
    }).length;
    const kgPrices = vegetables.filter((v) => v.unit.toLowerCase().includes("kg")).map((v) => v.currentPrice);
    const avgPrice = kgPrices.length > 0 ? Math.round(kgPrices.reduce((a, b) => a + b, 0) / kgPrices.length) : 32;
    const latestTimestamp = vegetables.reduce((latest, v) => {
      const t = new Date(v.updatedAt || v.createdAt || 0).getTime();
      return t > latest ? t : latest;
    }, 0);
    const lastUpdatedLabel = latestTimestamp > 0 ? new Date(latestTimestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    }) : "09:30 AM Today";
    return {
      totalCount,
      updatedTodayCount,
      recentlyUpdatedCount,
      avgPrice,
      lastUpdatedLabel
    };
  }, [vegetables]);
  const filteredVegetables = useMemo(() => {
    return vegetables.filter((veg) => {
      const matchesQuery = searchQuery === "" || veg.name.toLowerCase().includes(searchQuery.toLowerCase()) || veg.category.toLowerCase().includes(searchQuery.toLowerCase()) || veg.market.toLowerCase().includes(searchQuery.toLowerCase()) || veg.nameHi && veg.nameHi.includes(searchQuery) || veg.nameTe && veg.nameTe.includes(searchQuery);
      const matchesCategory = selectedCategory === "All" || veg.category === selectedCategory;
      return matchesQuery && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.currentPrice - b.currentPrice;
      if (sortBy === "price_desc") return b.currentPrice - a.currentPrice;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [vegetables, searchQuery, selectedCategory, sortBy]);
  return <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16">
      {
    /* Toast Notification */
  }
      {toastMessage && <div
    className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 ${toastMessage.type === "error" ? "bg-rose-900/90 text-white border-rose-700 shadow-rose-950/20" : toastMessage.type === "info" ? "bg-slate-900/90 text-white border-slate-700" : "bg-emerald-950/90 text-emerald-100 border-emerald-600 shadow-emerald-950/20"}`}
  >
          {toastMessage.type === "error" ? <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          <span className="text-xs sm:text-sm font-medium">{toastMessage.text}</span>
          <button
    type="button"
    onClick={() => setToastMessage(null)}
    className="text-slate-400 hover:text-white ml-2 cursor-pointer"
  >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>}

      {
    /* Top Header / Market Authority Identity */
  }
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {
    /* Left: Market Branding */
  }
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Market Admin Portal</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      APMC Authorized
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>{currentUser.businessName || "Warangal APMC Agricultural Market"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Daily Price Bulletin
                  </span>
                </p>
              </div>
            </div>

            {
    /* Right Header Actions */
  }
            <div className="flex items-center gap-2 sm:gap-3">
              {isMarketAdmin && <button
    type="button"
    onClick={handleOpenAddModal}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#1eb354] text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
    id="header-add-vegetable-btn"
  >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Add Vegetable</span>
                  <span className="sm:hidden">Add</span>
                </button>}

              <button
    type="button"
    onClick={() => {
      fetchVegetables();
      fetchPriceHistory();
      showToast("Refreshed market prices from database", "info");
    }}
    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
    title="Refresh Market Data"
  >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {
    /* Dedicated Market Admin Navigation Bar */
  }
        <div className="border-t border-slate-800 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
            <nav className="flex space-x-1 sm:space-x-2 py-2">
              {[
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "vegetables", label: "Vegetable Prices", icon: Scale },
    ...isMarketAdmin ? [{ id: "add", label: "Add Vegetable", icon: Plus }] : [],
    { id: "marketData", label: "Market Data", icon: TrendingUp },
    { id: "history", label: "Price History", icon: History },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: SlidersHorizontal }
  ].map(({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return <button
      key={id}
      type="button"
      onClick={() => {
        if (id === "add") {
          handleOpenAddModal();
        } else {
          setActiveTab(id);
        }
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white hover:bg-slate-800/80"}`}
    >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>;
  })}
            </nav>

            {onSwitchToFarmer && <button
    type="button"
    onClick={onSwitchToFarmer}
    className="text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/40 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ml-3 whitespace-nowrap cursor-pointer shadow-xs active:scale-95"
    title="Switch back to Farmer Portal"
    id="market-switch-farmer-top-btn"
  >
                <Wheat className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Farmer Portal</span>
                <span className="sm:hidden">Farmer</span>
              </button>}

            {onLogout && <button
    type="button"
    onClick={onLogout}
    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-4 whitespace-nowrap cursor-pointer"
  >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>}
          </div>
        </div>
      </header>

      {
    /* Main Content Area */
  }
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 flex-1">
        {!isMarketAdmin && <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block text-sm font-bold">Official APMC Mandi Rates Board (Read-Only)</strong>
                <span>You are viewing market rates as a Farmer. Only verified APMC Market Administrators have permission to upload, edit, or remove prices.</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] rounded-lg shrink-0 self-start sm:self-auto">
              Farmer (Read-Only)
            </span>
          </div>}

        {
    /* ========================================================================= */
  }
        {
    /* 1. SUMMARY CARDS (Required by specification)                             */
  }
        {
    /* ========================================================================= */
  }
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {
    /* 1. Total Vegetables Listed */
  }
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Vegetables</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {summaryMetrics.totalCount}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>Active catalog</span>
            </p>
          </div>

          {
    /* 2. Number of Vegetables with Today's Price */
  }
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Today's Prices</span>
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {summaryMetrics.updatedTodayCount}
            </p>
            <p className="text-[11px] text-teal-700 font-medium mt-1 flex items-center gap-1">
              <span>Updated today</span>
            </p>
          </div>

          {
    /* 3. Recently Updated Prices */
  }
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Recent (24h)</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {summaryMetrics.recentlyUpdatedCount}
            </p>
            <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
              <span>Reflects APMC bids</span>
            </p>
          </div>

          {
    /* 4. Average Market Price */
  }
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Market Rate</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              ₹{summaryMetrics.avgPrice}
              <span className="text-xs font-sans text-slate-500 font-normal"> / kg</span>
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Modal weighted index
            </p>
          </div>

          {
    /* 5. Last Price Update Time */
  }
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Last Update</span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-mono">
              {summaryMetrics.lastUpdatedLabel}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live market sync
            </p>
          </div>
        </div>

        {
    /* ========================================================================= */
  }
        {
    /* TAB 1: MAIN VEGETABLES PRICE MANAGEMENT TABLE                            */
  }
        {
    /* ========================================================================= */
  }
        {(activeTab === "dashboard" || activeTab === "vegetables") && <div className="space-y-4">
            {
    /* Search, Filter & Actions Toolbar */
  }
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              {
    /* Search Bar */
  }
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search vegetable name, category, or market..."
    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
    id="admin-vegetable-search-input"
  />
                {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
  >
                    <X className="w-3.5 h-3.5" />
                  </button>}
              </div>

              {
    /* Category Filter & Sort Controls */
  }
              <div className="flex flex-wrap items-center gap-2">
                {
    /* Category Dropdown */
  }
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
    id="admin-category-filter-select"
  >
                    {VEGETABLE_CATEGORIES.map((cat) => <option key={cat} value={cat}>
                        {cat === "All" ? "All Categories" : cat}
                      </option>)}
                  </select>
                </div>

                {
    /* Sort Dropdown */
  }
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <span className="text-[11px] text-slate-500">Sort:</span>
                  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
    id="admin-sort-select"
  >
                    <option value="updated_desc">Last Updated</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                </div>

                {
    /* Add Vegetable Quick Trigger */
  }
                {isMarketAdmin && <button
    type="button"
    onClick={handleOpenAddModal}
    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
    id="table-add-btn"
  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Vegetable</span>
                  </button>}
              </div>
            </div>

            {
    /* Quick Category Chips for Fast Filtering */
  }
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {VEGETABLE_CATEGORIES.map((cat) => <button
    key={cat}
    type="button"
    onClick={() => setSelectedCategory(cat)}
    className={`px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${selectedCategory === cat ? "bg-slate-900 text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100"}`}
  >
                  {cat}
                </button>)}
            </div>

            {
    /* VEGETABLES PRICE TABLE */
  }
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Vegetables Price Bulletin
                  </h2>
                  <span className="bg-slate-200 text-slate-700 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
                    {filteredVegetables.length}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Warangal Mandi APMC Yard
                </span>
              </div>

              {
    /* Desktop & Tablet Table */
  }
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                      <th className="py-3 px-4">Vegetable</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Current Price</th>
                      <th className="py-3 px-3 hidden md:table-cell">Min Price</th>
                      <th className="py-3 px-3 hidden md:table-cell">Max Price</th>
                      <th className="py-3 px-2">Unit</th>
                      <th className="py-3 px-3 hidden lg:table-cell">Market / Yard</th>
                      <th className="py-3 px-3 hidden sm:table-cell">Last Updated</th>
                      <th className="py-3 px-4 text-right">{isMarketAdmin ? "Actions" : "History"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVegetables.length === 0 ? <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center">
                            <Scale className="w-10 h-10 text-slate-300 mb-2" />
                            <p className="text-sm font-semibold text-slate-700">No vegetables match your filter</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {isMarketAdmin ? "Try clearing your search query or add a new vegetable." : "No commodities found for this category."}
                            </p>
                            {isMarketAdmin && <button
    type="button"
    onClick={handleOpenAddModal}
    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
  >
                                <Plus className="w-3.5 h-3.5" />
                                Add Vegetable
                              </button>}
                          </div>
                        </td>
                      </tr> : filteredVegetables.map((veg) => {
    const updatedTime = veg.updatedAt ? new Date(veg.updatedAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    }) : "Today";
    return <tr
      key={veg.id}
      className="hover:bg-slate-50/80 transition-colors group"
    >
                            {
      /* Vegetable Name & Thumbnail */
    }
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {veg.image ? <img
      src={veg.image}
      alt={veg.name}
      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
      loading="lazy"
    /> : <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                                    {veg.name.slice(0, 2).toUpperCase()}
                                  </div>}
                                <div>
                                  <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                                    {veg.name}
                                  </p>
                                  {(veg.nameHi || veg.nameTe) && <p className="text-[11px] text-slate-500">
                                      {veg.nameTe && <span>{veg.nameTe}</span>}
                                      {veg.nameTe && veg.nameHi && <span> • </span>}
                                      {veg.nameHi && <span>{veg.nameHi}</span>}
                                    </p>}
                                  {veg.description && <p className="text-[10.5px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                                      {veg.description}
                                    </p>}
                                </div>
                              </div>
                            </td>

                            {
      /* Category Badge */
    }
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                                {veg.category}
                              </span>
                            </td>

                            {
      /* Current Price */
    }
                            <td className="py-3.5 px-3 font-mono font-bold text-slate-900 text-sm sm:text-base">
                              <span className="text-emerald-700">₹{veg.currentPrice}</span>
                              <span className="text-slate-400 font-sans text-xs font-normal"> / {veg.unit}</span>
                            </td>

                            {
      /* Min Price */
    }
                            <td className="py-3.5 px-3 font-mono text-slate-600 hidden md:table-cell">
                              ₹{veg.minPrice}
                            </td>

                            {
      /* Max Price */
    }
                            <td className="py-3.5 px-3 font-mono text-slate-600 hidden md:table-cell">
                              ₹{veg.maxPrice}
                            </td>

                            {
      /* Unit */
    }
                            <td className="py-3.5 px-2 text-slate-500 font-mono text-xs">
                              {veg.unit}
                            </td>

                            {
      /* Market / Yard */
    }
                            <td className="py-3.5 px-3 text-slate-600 text-xs hidden lg:table-cell max-w-[160px] truncate">
                              <span title={veg.market} className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{veg.market}</span>
                              </span>
                            </td>

                            {
      /* Last Updated */
    }
                            <td className="py-3.5 px-3 text-slate-500 text-xs hidden sm:table-cell font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {updatedTime}
                              </span>
                            </td>

                            {
      /* Actions Column */
    }
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {
      /* Price History Button */
    }
                                <button
      type="button"
      onClick={() => setSelectedVegetableForHistory(veg)}
      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
      title="View Price History"
    >
                                  <History className="w-4 h-4" />
                                </button>

                                {isMarketAdmin && <>
                                    {
      /* Edit Button */
    }
                                    <button
      type="button"
      onClick={() => handleOpenEditModal(veg)}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-2xs"
      title="Edit Price & Specs"
    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Edit</span>
                                    </button>

                                    {
      /* Delete Button */
    }
                                    <button
      type="button"
      onClick={() => setDeletingVegetable(veg)}
      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
      title="Delete Vegetable"
    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>}
                              </div>
                            </td>
                          </tr>;
  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>}

        {
    /* ========================================================================= */
  }
        {
    /* TAB 2: MARKET DATA & ANALYTICS                                           */
  }
        {
    /* ========================================================================= */
  }
        {activeTab === "marketData" && <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    APMC Mandi Arrival Intelligence
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregated live pricing across Warangal, Bowenpally, and Nizamabad markets
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Daily APMC Feed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Daily Volume Intake</span>
                  <p className="text-2xl font-bold font-mono text-slate-900 mt-1">2,450 Quintals</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">↑ 12% vs yesterday arrivals</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Active Commission Agents</span>
                  <p className="text-2xl font-bold font-mono text-slate-900 mt-1">42 Licensed Agents</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Enamamula Yard Section 4</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Weighbridge Clearances</span>
                  <p className="text-2xl font-bold font-mono text-slate-900 mt-1">186 Lorries Cleared</p>
                  <p className="text-xs text-teal-600 font-medium mt-1">Avg clearance time: 14 mins</p>
                </div>
              </div>
            </div>

            {
    /* Price Distribution by Category */
  }
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Category Price Distribution (₹ / kg)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VEGETABLE_CATEGORIES.filter((c) => c !== "All").map((category) => {
    const items = vegetables.filter((v) => v.category === category);
    if (items.length === 0) return null;
    const avg = Math.round(
      items.reduce((s, i) => s + i.currentPrice, 0) / items.length
    );
    return <div key={category} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 block truncate">{category}</span>
                      <p className="text-lg font-bold font-mono text-slate-900 mt-0.5">₹{avg}/kg</p>
                      <span className="text-[10px] text-slate-400">{items.length} vegetables</span>
                    </div>;
  })}
              </div>
            </div>
          </div>}

        {
    /* ========================================================================= */
  }
        {
    /* TAB 3: PRICE HISTORY AUDIT TRAIL                                         */
  }
        {
    /* ========================================================================= */
  }
        {activeTab === "history" && <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Vegetable Price Change Audit Log
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable record of all price adjustments made by Market Administrators
                </p>
              </div>
              <button
    type="button"
    onClick={fetchPriceHistory}
    className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
  >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Log
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-4">Vegetable</th>
                    <th className="py-3 px-3">Previous Price</th>
                    <th className="py-3 px-3">New Price</th>
                    <th className="py-3 px-3">Change Delta</th>
                    <th className="py-3 px-3">Changed By</th>
                    <th className="py-3 px-3">Market</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceHistories.length === 0 ? <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No price change records yet</p>
                        <p className="text-xs text-slate-400 mt-1">
                          When you add or update a vegetable price, it will be audited here automatically.
                        </p>
                      </td>
                    </tr> : priceHistories.map((hist) => {
    const delta = hist.newPrice - hist.previousPrice;
    const isUp = delta > 0;
    const pct = hist.previousPrice > 0 ? Math.round(delta / hist.previousPrice * 100) : 0;
    return <tr key={hist.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {hist.vegetableName || hist.vegetableId}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500">
                            ₹{hist.previousPrice}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            ₹{hist.newPrice}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold">
                            {delta === 0 ? <span className="text-slate-400">0</span> : isUp ? <span className="text-emerald-600 flex items-center gap-0.5">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                +₹{delta} ({pct > 0 ? `+${pct}%` : ""})
                              </span> : <span className="text-rose-600 flex items-center gap-0.5">
                                <ArrowDownRight className="w-3.5 h-3.5" />
                                -₹{Math.abs(delta)} ({pct}%)
                              </span>}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-slate-700 text-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {hist.changedBy || "Market Admin"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-xs">
                            {hist.market}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-500 text-xs font-mono">
                            {new Date(hist.createdAt).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short"
    })}
                          </td>
                        </tr>;
  })}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* ========================================================================= */
  }
        {
    /* TAB 4: NOTIFICATIONS                                                     */
  }
        {
    /* ========================================================================= */
  }
        {activeTab === "notifications" && <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Market Broadcast Notifications</h3>
            <div className="space-y-3">
              {[
    {
      id: "n1",
      title: "Tomato Arrival Spike Detected",
      desc: "Arrivals at Warangal APMC crossed 4,000 crates this morning. Modal price stabilized at \u20B924/kg.",
      time: "35 minutes ago",
      type: "info"
    },
    {
      id: "n2",
      title: "Green Chilli Teja Mandi Procurement",
      desc: "Telangana Spices Board procurement counter opened in Yard Bay 7.",
      time: "2 hours ago",
      type: "success"
    },
    {
      id: "n3",
      title: "Daily Mandi Price Publication Completed",
      desc: "All 12 major vegetable price rates synchronized with state agriculture portal.",
      time: "08:00 AM Today",
      type: "success"
    }
  ].map((n) => <div key={n.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                  </div>
                </div>)}
            </div>
          </div>}

        {
    /* ========================================================================= */
  }
        {
    /* TAB 5: SETTINGS                                                          */
  }
        {
    /* ========================================================================= */
  }
        {activeTab === "settings" && <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Market Admin APMC Profile</h3>
              <p className="text-xs text-slate-500">
                Official market administration credentials and operational parameters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Market Committee Name</label>
                <input
    type="text"
    value={currentUser.businessName || "Warangal Agricultural Market Committee"}
    readOnly
    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold"
  />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">APMC License / Code</label>
                <input
    type="text"
    value={currentUser.panCard || "APMC-WAR-TG-2024-098"}
    readOnly
    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-mono"
  />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Market Yard</label>
                <input
    type="text"
    value="Enamamula Mandi Yard, Warangal Urban, Telangana"
    readOnly
    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
  />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Contact Phone</label>
                <input
    type="text"
    value={currentUser.phone || "+91 94401 23456"}
    readOnly
    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-mono"
  />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <span className="font-bold flex items-center gap-1 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Price Authority Privilege Enforced
              </span>
              As a verified Market Administrator, all vegetable price listings and updates entered through this console are officially published to the farmer marketplace and regional price display boards.
            </div>
          </div>}
      </main>

      {
    /* ========================================================================= */
  }
      {
    /* ADD VEGETABLE MODAL / DRAWER                                              */
  }
      {
    /* ========================================================================= */
  }
      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {
    /* Modal Header */
  }
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Add New Vegetable Price</h3>
                  <p className="text-[11px] text-slate-400">
                    Publish today's market price directly to APMC bulletin
                  </p>
                </div>
              </div>
              <button
    type="button"
    onClick={() => setShowAddModal(false)}
    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
  >
                <X className="w-4 h-4" />
              </button>
            </div>

            {
    /* Modal Form Body */
  }
            <form onSubmit={handleSubmitAddVegetable} className="p-6 overflow-y-auto space-y-4 flex-1">
              {
    /* Vegetable Name */
  }
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Vegetable Name <span className="text-rose-500">*</span>
                </label>
                <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="e.g. Tomato (Hybrid Desi), Cabbage, Green Chilli..."
    className={`w-full px-3.5 py-2 text-xs sm:text-sm border rounded-xl focus:outline-hidden focus:ring-2 ${formErrors.name ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20" : "border-slate-200 focus:ring-emerald-500"}`}
    id="add-veg-name-input"
  />
                {formErrors.name && <p className="text-rose-600 text-[11px] mt-1 font-medium">{formErrors.name}</p>}
              </div>

              {
    /* Multilingual Names (Optional) */
  }
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Telugu Name (తెలుగు)
                  </label>
                  <input
    type="text"
    value={formData.nameTe}
    onChange={(e) => setFormData({ ...formData, nameTe: e.target.value })}
    placeholder="e.g. టమోటా"
    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Hindi Name (हिंदी)
                  </label>
                  <input
    type="text"
    value={formData.nameHi}
    onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
    placeholder="e.g. टमाटर"
    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                </div>
              </div>

              {
    /* Category & Unit Row */
  }
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
    id="add-veg-category-select"
  >
                    {VEGETABLE_CATEGORIES.filter((c) => c !== "All").map((cat) => <option key={cat} value={cat}>
                        {cat}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Trading Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
    value={formData.unit}
    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
    id="add-veg-unit-select"
  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="Quintal">Quintal (100 kg)</option>
                    <option value="Crate (25kg)">Crate (25 kg)</option>
                    <option value="Bag (50kg)">Bag (50 kg)</option>
                  </select>
                </div>
              </div>

              {
    /* Price Fields: Current, Min, Max (Validation required) */
  }
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Market Price Parameters (₹)
                </span>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {
    /* Current Price */
  }
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                      Current Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                      <input
    type="number"
    step="any"
    min="0.1"
    value={formData.currentPrice}
    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
    placeholder="24"
    className="w-full pl-6 pr-2 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl font-mono font-bold bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
    id="add-veg-current-price"
  />
                    </div>
                  </div>

                  {
    /* Min Price */
  }
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Min Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                      <input
    type="number"
    step="any"
    min="0"
    value={formData.minPrice}
    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
    placeholder="20"
    className="w-full pl-6 pr-2 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl font-mono bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
    id="add-veg-min-price"
  />
                    </div>
                  </div>

                  {
    /* Max Price */
  }
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Max Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                      <input
    type="number"
    step="any"
    min="0.1"
    value={formData.maxPrice}
    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
    placeholder="28"
    className="w-full pl-6 pr-2 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl font-mono bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
    id="add-veg-max-price"
  />
                    </div>
                  </div>
                </div>

                {(formErrors.currentPrice || formErrors.minPrice || formErrors.maxPrice) && <div className="text-rose-600 text-[11px] font-medium space-y-0.5">
                    {formErrors.currentPrice && <p>• {formErrors.currentPrice}</p>}
                    {formErrors.minPrice && <p>• {formErrors.minPrice}</p>}
                    {formErrors.maxPrice && <p>• {formErrors.maxPrice}</p>}
                  </div>}
              </div>

              {
    /* Market Name & Location */
  }
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Market Name <span className="text-rose-500">*</span>
                  </label>
                  <input
    type="text"
    value={formData.market}
    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
    placeholder="e.g. Warangal APMC Enamamula Market"
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Location / District
                  </label>
                  <input
    type="text"
    value={formData.location}
    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
    placeholder="e.g. Warangal, Telangana"
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                </div>
              </div>

              {
    /* Price Date */
  }
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Price Date
                </label>
                <input
    type="date"
    value={formData.priceDate}
    onChange={(e) => setFormData({ ...formData, priceDate: e.target.value })}
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
              </div>

              {
    /* Image Picker / Preset Selector */
  }
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Select Vegetable Thumbnail
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                  {DEFAULT_PRESET_IMAGES.map((preset) => {
    const isSelected = formData.image === preset.url;
    return <button
      key={preset.name}
      type="button"
      onClick={() => setFormData({ ...formData, image: preset.url })}
      className={`relative rounded-lg overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${isSelected ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-transparent opacity-75 hover:opacity-100"}`}
      title={preset.name}
    >
                        <img
      src={preset.url}
      alt={preset.name}
      className="w-full h-10 object-cover rounded"
    />
                        <span className="text-[9px] truncate block text-center font-medium mt-0.5">
                          {preset.name}
                        </span>
                      </button>;
  })}
                </div>
              </div>

              {
    /* Description / Quality Notes */
  }
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Arrival Quality & Variety Notes (Optional)
                </label>
                <textarea
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    placeholder="e.g. Fresh arrivals from local mandals, Grade-A quality, standard crates."
    rows={2}
    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
  />
              </div>

              {
    /* Footer Actions */
  }
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
    type="button"
    onClick={() => setShowAddModal(false)}
    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
  >
                  Cancel
                </button>
                <button
    type="submit"
    disabled={isSyncing}
    className="px-5 py-2 text-xs sm:text-sm font-bold bg-[#22c55e] hover:bg-[#1eb354] text-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
    id="add-veg-submit-btn"
  >
                  {isSyncing ? <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Bulletin...</span>
                    </> : <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Publish Vegetable Price</span>
                    </>}
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* ========================================================================= */
  }
      {
    /* EDIT VEGETABLE MODAL                                                      */
  }
      {
    /* ========================================================================= */
  }
      {editingVegetable && <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {
    /* Modal Header */
  }
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Edit {editingVegetable.name}</h3>
                  <p className="text-[11px] text-slate-400">
                    Update current price, modal range, and market details
                  </p>
                </div>
              </div>
              <button
    type="button"
    onClick={() => setEditingVegetable(null)}
    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
  >
                <X className="w-4 h-4" />
              </button>
            </div>

            {
    /* Modal Form Body */
  }
            <form onSubmit={handleSubmitEditVegetable} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Vegetable Name <span className="text-rose-500">*</span>
                </label>
                <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
              </div>

              {
    /* Price Fields */
  }
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    Price Modification & Audit
                  </span>
                  <span className="text-[10px] text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded">
                    Old Price: ₹{editingVegetable.currentPrice}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      New Current Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
    type="number"
    step="any"
    min="0.1"
    value={formData.currentPrice}
    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-emerald-300 rounded-xl font-mono font-bold bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Min Price (₹)
                    </label>
                    <input
    type="number"
    step="any"
    min="0"
    value={formData.minPrice}
    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl font-mono bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Max Price (₹)
                    </label>
                    <input
    type="number"
    step="any"
    min="0.1"
    value={formData.maxPrice}
    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl font-mono bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                  </div>
                </div>

                {(formErrors.currentPrice || formErrors.minPrice || formErrors.maxPrice) && <p className="text-rose-600 text-[11px] font-medium">
                    {formErrors.currentPrice || formErrors.minPrice || formErrors.maxPrice}
                  </p>}
              </div>

              {
    /* Category & Unit */
  }
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
  >
                    {VEGETABLE_CATEGORIES.filter((c) => c !== "All").map((cat) => <option key={cat} value={cat}>
                        {cat}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Trading Unit</label>
                  <select
    value={formData.unit}
    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="Quintal">Quintal (100 kg)</option>
                    <option value="Crate (25kg)">Crate (25 kg)</option>
                    <option value="Bag (50kg)">Bag (50 kg)</option>
                  </select>
                </div>
              </div>

              {
    /* Market Name & Location */
  }
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Market Name</label>
                  <input
    type="text"
    value={formData.market}
    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Location</label>
                  <input
    type="text"
    value={formData.location}
    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
                </div>
              </div>

              {
    /* Description */
  }
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Variety & Quality Description
                </label>
                <textarea
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    rows={2}
    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
  />
              </div>

              {
    /* Actions */
  }
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
    type="button"
    onClick={() => setEditingVegetable(null)}
    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
  >
                  Cancel
                </button>
                <button
    type="submit"
    disabled={isSyncing}
    className="px-5 py-2 text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                  {isSyncing ? <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Database...</span>
                    </> : <>
                      <Check className="w-4 h-4" />
                      <span>Update Price & Record Audit</span>
                    </>}
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* ========================================================================= */
  }
      {
    /* DELETE CONFIRMATION DIALOG                                                */
  }
      {
    /* ========================================================================= */
  }
      {deletingVegetable && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete {deletingVegetable.name}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong className="text-slate-800">{deletingVegetable.name}</strong> from the active market price bulletin? This will delist the vegetable from APMC public boards.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
    type="button"
    onClick={() => setDeletingVegetable(null)}
    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
  >
                Cancel
              </button>
              <button
    type="button"
    disabled={isSyncing}
    onClick={handleConfirmDeleteVegetable}
    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
    id="confirm-delete-veg-btn"
  >
                {isSyncing ? <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </> : <span>Delete Vegetable</span>}
              </button>
            </div>
          </div>
        </div>}

      {
    /* ========================================================================= */
  }
      {
    /* ITEM SPECIFIC PRICE HISTORY MODAL                                         */
  }
      {
    /* ========================================================================= */
  }
      {selectedVegetableForHistory && <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Price History: {selectedVegetableForHistory.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Current Rate: ₹{selectedVegetableForHistory.currentPrice}/{selectedVegetableForHistory.unit}
                  </p>
                </div>
              </div>
              <button
    type="button"
    onClick={() => setSelectedVegetableForHistory(null)}
    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
  >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {priceHistories.filter(
    (h) => h.vegetableId === selectedVegetableForHistory.id || h.vegetableName && h.vegetableName.toLowerCase() === selectedVegetableForHistory.name.toLowerCase()
  ).length === 0 ? <div className="text-center py-8 text-slate-500">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Initial Price Level</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Listed at ₹{selectedVegetableForHistory.currentPrice}/{selectedVegetableForHistory.unit}. No adjustments have been recorded yet.
                  </p>
                </div> : priceHistories.filter(
    (h) => h.vegetableId === selectedVegetableForHistory.id || h.vegetableName && h.vegetableName.toLowerCase() === selectedVegetableForHistory.name.toLowerCase()
  ).map((entry) => {
    const delta = entry.newPrice - entry.previousPrice;
    return <div
      key={entry.id}
      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
    >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              ₹{entry.previousPrice} → ₹{entry.newPrice}
                            </span>
                            {delta > 0 ? <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-1.5 py-0.5 rounded">
                                +₹{delta}
                              </span> : delta < 0 ? <span className="text-rose-700 font-bold text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                                -₹{Math.abs(delta)}
                              </span> : null}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Changed by: <strong>{entry.changedBy}</strong> • {entry.market}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(entry.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
                        </span>
                      </div>;
  })}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
    type="button"
    onClick={() => setSelectedVegetableForHistory(null)}
    className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
  >
                Close
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
