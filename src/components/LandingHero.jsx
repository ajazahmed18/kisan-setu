import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowUpRight,
  Activity,
  Calendar,
  Building2,
  Wheat,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
export const PRODUCTS_DATA = [
  {
    id: "cotton",
    name: "Cotton",
    regionalName: "\u0C2A\u0C24\u0C4D\u0C24\u0C3F / \u0915\u092A\u093E\u0938",
    category: "Commercial",
    cityName: "Warangal",
    state: "Telangana",
    mandiName: "Warangal APMC Market Yard",
    todayRatePerQuintal: 7400,
    yesterdayRatePerQuintal: 7150,
    rateUnit: "Quintal",
    minRate: 7100,
    maxRate: 7650,
    arrivalsToday: "14,200 Q",
    grade: "Grade A (BT-II Long Staple)",
    imageUrl: "https://images.unsplash.com/photo-1594488518004-9a84d4128532?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "turmeric",
    name: "Turmeric",
    regionalName: "\u0C2A\u0C38\u0C41\u0C2A\u0C41 / \u0939\u0932\u094D\u0926\u0940",
    category: "Spices",
    cityName: "Nizamabad",
    state: "Telangana",
    mandiName: "Nizamabad APMC Mandi",
    todayRatePerQuintal: 14800,
    yesterdayRatePerQuintal: 14380,
    rateUnit: "Quintal",
    minRate: 13900,
    maxRate: 15200,
    arrivalsToday: "6,800 Q",
    grade: "Finger Double Polished",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "chilli",
    name: "Red Chilli",
    regionalName: "\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F / \u0932\u093E\u0932 \u092E\u093F\u0930\u094D\u091A",
    category: "Spices",
    cityName: "Guntur",
    state: "Andhra Pradesh",
    mandiName: "Guntur Mirchi Yard",
    todayRatePerQuintal: 18500,
    yesterdayRatePerQuintal: 19150,
    rateUnit: "Quintal",
    minRate: 17200,
    maxRate: 19100,
    arrivalsToday: "22,500 Q",
    grade: "Teja Superior Stemless",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "paddy",
    name: "Paddy Rice",
    regionalName: "\u0C35\u0C30\u0C3F / \u0927\u093E\u0928",
    category: "Food Grains",
    cityName: "Suryapet",
    state: "Telangana",
    mandiName: "Suryapet Market Yard",
    todayRatePerQuintal: 2350,
    yesterdayRatePerQuintal: 2260,
    rateUnit: "Quintal",
    minRate: 2200,
    maxRate: 2420,
    arrivalsToday: "31,000 Q",
    grade: "Sona Masoori Raw",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "maize",
    name: "Yellow Maize",
    regionalName: "\u0C2E\u0C4A\u0C15\u0C4D\u0C15\u0C1C\u0C4A\u0C28\u0C4D\u0C28 / \u092E\u0915\u094D\u0915\u093E",
    category: "Food Grains",
    cityName: "Davanagere",
    state: "Karnataka",
    mandiName: "Davanagere Regulated Market",
    todayRatePerQuintal: 2280,
    yesterdayRatePerQuintal: 2360,
    rateUnit: "Quintal",
    minRate: 2150,
    maxRate: 2340,
    arrivalsToday: "18,400 Q",
    grade: "Hybrid Starch Grade",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "wheat",
    name: "Sharbati Wheat",
    regionalName: "\u0C17\u0C4B\u0C27\u0C41\u0C2E / \u0917\u0947\u0939\u0942\u0902",
    category: "Food Grains",
    cityName: "Khanna",
    state: "Punjab",
    mandiName: "Khanna Grain Market",
    todayRatePerQuintal: 2480,
    yesterdayRatePerQuintal: 2405,
    rateUnit: "Quintal",
    minRate: 2380,
    maxRate: 2540,
    arrivalsToday: "45,000 Q",
    grade: "Premium High Protein",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "soybean",
    name: "Yellow Soybean",
    regionalName: "\u0C38\u0C4B\u0C2F\u0C3E\u0C2C\u0C40\u0C28\u0C4D / \u0938\u094B\u092F\u093E\u092C\u0940\u0928",
    category: "Oilseeds",
    cityName: "Indore",
    state: "Madhya Pradesh",
    mandiName: "Indore Mandi Prangan",
    todayRatePerQuintal: 4850,
    yesterdayRatePerQuintal: 4960,
    rateUnit: "Quintal",
    minRate: 4600,
    maxRate: 5050,
    arrivalsToday: "28,000 Q",
    grade: "Bold Clean (Oil 19%)",
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "onion",
    name: "Red Onion",
    regionalName: "\u0C09\u0C32\u0C4D\u0C32\u0C3F\u0C2A\u0C3E\u0C2F / \u092A\u094D\u092F\u093E\u091C",
    category: "Vegetables",
    cityName: "Nashik",
    state: "Maharashtra",
    mandiName: "Lasalgaon APMC Market",
    todayRatePerQuintal: 2650,
    yesterdayRatePerQuintal: 2510,
    rateUnit: "Quintal",
    minRate: 2300,
    maxRate: 2850,
    arrivalsToday: "54,000 Q",
    grade: "Garva Double Skin 55mm+",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "tomato",
    name: "Fresh Tomato",
    regionalName: "\u0C1F\u0C2E\u0C4B\u0C1F\u0C3E / \u091F\u092E\u093E\u091F\u0930",
    category: "Vegetables",
    cityName: "Kolar",
    state: "Karnataka",
    mandiName: "Kolar APMC Yard",
    todayRatePerQuintal: 1950,
    yesterdayRatePerQuintal: 2100,
    rateUnit: "Quintal",
    minRate: 1650,
    maxRate: 2150,
    arrivalsToday: "38,000 Q",
    grade: "Firm Hybrid Table Grade",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "mustard",
    name: "Mustard Seed",
    regionalName: "\u0C06\u0C35\u0C3E\u0C32\u0C41 / \u0938\u0930\u0938\u094B\u0902",
    category: "Oilseeds",
    cityName: "Bharatpur",
    state: "Rajasthan",
    mandiName: "Bharatpur Krishi Upaj Mandi",
    todayRatePerQuintal: 5450,
    yesterdayRatePerQuintal: 5270,
    rateUnit: "Quintal",
    minRate: 5200,
    maxRate: 5600,
    arrivalsToday: "16,500 Q",
    grade: "Black Bold 42% Oil",
    imageUrl: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "groundnut",
    name: "Groundnut Pods",
    regionalName: "\u0C35\u0C47\u0C30\u0C41\u0C36\u0C28\u0C17 / \u092E\u0942\u0902\u0917\u092B\u0932\u0940",
    category: "Oilseeds",
    cityName: "Rajkot",
    state: "Gujarat",
    mandiName: "Rajkot APMC Market",
    todayRatePerQuintal: 6800,
    yesterdayRatePerQuintal: 6580,
    rateUnit: "Quintal",
    minRate: 6450,
    maxRate: 7050,
    arrivalsToday: "21,000 Q",
    grade: "Bold G-20 Pods",
    imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  },
  {
    id: "chana",
    name: "Bengal Gram (Chana)",
    regionalName: "\u0C36\u0C28\u0C17\u0C32\u0C41 / \u091A\u0928\u093E",
    category: "Food Grains",
    cityName: "Bikaner",
    state: "Rajasthan",
    mandiName: "Bikaner Grain Mandi",
    todayRatePerQuintal: 6100,
    yesterdayRatePerQuintal: 6240,
    rateUnit: "Quintal",
    minRate: 5850,
    maxRate: 6250,
    arrivalsToday: "19,000 Q",
    grade: "Desi Polished Grade-1",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    updatedTime: "Live Today"
  }
];
export const CROP_METADATA = {
  Onion: {
    regionalName: "\u0915\u093E\u0902\u0926\u093E / \u0C09\u0C32\u0C4D\u0C32\u0C3F\u0C2A\u0C3E\u0C2F / \u092A\u094D\u092F\u093E\u091C",
    grade: "Garva Double Skin 55mm+",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80"
  },
  Tomato: {
    regionalName: "\u091F\u094B\u092E\u0945\u091F\u094B / \u0C1F\u0C2E\u0C3E\u0C1F\u0C3E / \u091F\u092E\u093E\u091F\u0930",
    grade: "Firm Hybrid Table Grade",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
  },
  Potato: {
    regionalName: "\u092C\u091F\u093E\u091F\u093E / \u0C2C\u0C02\u0C17\u0C3E\u0C33\u0C3E\u0C26\u0C41\u0C02\u0C2A / \u0906\u0932\u0942",
    grade: "Jyoti / Pukhraj Fresh 45mm+",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
  },
  "Green Chilli": {
    regionalName: "\u0939\u093F\u0930\u0935\u0940 \u092E\u093F\u0930\u091A\u0940 / \u0C2A\u0C1A\u0C4D\u0C1A\u0C3F\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F / \u0939\u0930\u0940 \u092E\u093F\u0930\u094D\u091A",
    grade: "Lavangi / Jwala Hot Grade-A",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80"
  },
  "Chilli (Green)": {
    regionalName: "\u0C2A\u0C1A\u0C4D\u0C1A\u0C3F\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F / \u0939\u0930\u0940 \u092E\u093F\u0930\u094D\u091A",
    grade: "Teja Green Spicy Grade-A",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80"
  },
  "Red Chilli": {
    regionalName: "\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F / \u0932\u093E\u0932 \u092E\u093F\u0930\u094D\u091A",
    grade: "Teja Superior Stemless",
    category: "Spices",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80"
  },
  Ginger: {
    regionalName: "\u0906\u0932\u0947 / \u0C05\u0C32\u0C4D\u0C32\u0C02 / \u0905\u0926\u0930\u0915",
    grade: "Fresh Washed Bold Root",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
  },
  Garlic: {
    regionalName: "\u0932\u0938\u0942\u0923 / \u0C35\u0C46\u0C32\u0C4D\u0C32\u0C41\u0C32\u0C4D\u0C32\u0C3F / \u0932\u0939\u0938\u0941\u0928",
    grade: "Desi White Medium-Large",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80"
  },
  Cauliflower: {
    regionalName: "\u092B\u094D\u0932\u0949\u0935\u0930 / \u0C15\u0C3E\u0C32\u0C40\u0C2B\u0C4D\u0C32\u0C35\u0C30\u0C4D / \u092B\u0942\u0932\u0917\u094B\u092D\u0940",
    grade: "Snowball White Compact Heads",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80"
  },
  Cabbage: {
    regionalName: "\u0915\u094B\u092C\u0940 / \u0C15\u0C4D\u0C2F\u0C3E\u0C2C\u0C47\u0C1C\u0C40 / \u092A\u0924\u094D\u0924\u093E\u0917\u094B\u092D\u0940",
    grade: "Golden Acre Tight Head",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80"
  },
  Capsicum: {
    regionalName: "\u0922\u094B\u092C\u0933\u0940 \u092E\u093F\u0930\u091A\u0940 / \u0C15\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C38\u0C3F\u0C15\u0C02 / \u0936\u093F\u092E\u0932\u093E \u092E\u093F\u0930\u094D\u091A",
    grade: "Green Giant 4-Lobed Blocky",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80"
  },
  Brinjal: {
    regionalName: "\u0935\u093E\u0902\u0917\u0940 / \u0C35\u0C02\u0C15\u0C3E\u0C2F / \u092C\u0948\u0902\u0917\u0928",
    grade: "Pune Round Glossy Purple",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1659261200845-779d72a4478f?auto=format&fit=crop&w=800&q=80"
  },
  Okra: {
    regionalName: "\u092D\u0947\u0902\u0921\u0940 / \u0C2C\u0C46\u0C02\u0C21\u0C15\u0C3E\u0C2F / \u092D\u093F\u0902\u0921\u0940",
    grade: "Green Velvet Tender (7-10cm)",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80"
  },
  "Spinach (Palak)": {
    regionalName: "\u092A\u093E\u0932\u0915 / \u0C2A\u0C3E\u0C32\u0C15\u0C42\u0C30 / \u092A\u093E\u0932\u0915",
    grade: "Fresh Crisp Leafy Bunches",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80"
  },
  Coriander: {
    regionalName: "\u0915\u094B\u0925\u093F\u0902\u092C\u0940\u0930 / \u0C15\u0C4A\u0C24\u0C4D\u0C24\u0C3F\u0C2E\u0C40\u0C30 / \u0927\u0928\u093F\u092F\u093E \u092A\u0924\u094D\u0924\u093E",
    grade: "Fragrant Fresh Root Bunches",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1588879462716-17b539c87893?auto=format&fit=crop&w=800&q=80"
  },
  "Fenugreek (Methi)": {
    regionalName: "\u092E\u0947\u0925\u0940 / \u0C2E\u0C46\u0C02\u0C24\u0C41\u0C32\u0C41 / \u092E\u0947\u0925\u0940 \u0938\u093E\u0917",
    grade: "Kasuri Broad Leaf Bunches",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  "Green Peas": {
    regionalName: "\u092E\u091F\u093E\u0930 / \u0C2C\u0C20\u0C3E\u0C28\u0C40 / \u0939\u0930\u0940 \u092E\u091F\u0930",
    grade: "Sweet Fresh Green Pods",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80"
  },
  "Ridge Gourd": {
    regionalName: "\u0926\u094B\u0921\u0915\u093E / \u0C2C\u0C40\u0C30\u0C15\u0C3E\u0C2F / \u0924\u094B\u0930\u0940",
    grade: "Dark Green Straight Tender",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80"
  },
  "Bitter Gourd": {
    regionalName: "\u0915\u093E\u0930\u0932\u0947 / \u0C15\u0C3E\u0C15\u0C30\u0C15\u0C3E\u0C2F / \u0915\u0930\u0947\u0932\u093E",
    grade: "Spiny Crisp Green",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80"
  },
  "Bottle Gourd": {
    regionalName: "\u0926\u0941\u0927\u0940 \u092D\u094B\u092A\u0933\u093E / \u0C38\u0C4A\u0C30\u0C15\u0C3E\u0C2F / \u0932\u094C\u0915\u0940",
    grade: "Light Green Cylindrical Tender",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80"
  },
  Carrot: {
    regionalName: "\u0917\u093E\u091C\u0930 / \u0C15\u0C4D\u0C2F\u0C3E\u0C30\u0C46\u0C1F\u0C4D / \u0917\u093E\u091C\u0930",
    grade: "Sweet Red / Orange Farm Fresh",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80"
  },
  Cucumber: {
    regionalName: "\u0915\u093E\u0915\u0921\u0940 / \u0C26\u0C4B\u0C38\u0C15\u0C3E\u0C2F / \u0916\u0940\u0930\u093E",
    grade: "Crisp Green Table Salad",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80"
  },
  Cotton: {
    regionalName: "\u0C15\u0C3E\u0C2A\u0942\u0938 / \u0C2A\u0C24\u0C4D\u0C24\u0C3F / \u0915\u092A\u093E\u0938",
    grade: "Grade A (BT-II Long Staple)",
    category: "Commercial",
    imageUrl: "https://images.unsplash.com/photo-1594488518004-9a84d4128532?auto=format&fit=crop&w=800&q=80"
  },
  "Paddy Rice": {
    regionalName: "\u0924\u093E\u0902\u0926\u0942\u0933 / \u0C35\u0C30\u0C3F / \u0927\u093E\u0928",
    grade: "Sona Masoori Raw / BPT-5204",
    category: "Food Grains",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
  },
  "Rice (Paddy)": {
    regionalName: "\u0924\u093E\u0902\u0926\u0942\u0933 / \u0C35\u0C30\u0C3F / \u0927\u093E\u0928",
    grade: "Sona Masoori Raw / BPT-5204",
    category: "Food Grains",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
  },
  Maize: {
    regionalName: "\u092E\u0915\u093E / \u0C2E\u0C4A\u0C15\u0C4D\u0C15\u0C1C\u0C4A\u0C28\u0C4D\u0C28 / \u092E\u0915\u094D\u0915\u093E",
    grade: "Yellow Hybrid Starch Grade",
    category: "Food Grains",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80"
  },
  Wheat: {
    regionalName: "\u0917\u0939\u0942 / \u0C17\u0C4B\u0C27\u0C41\u0C2E / \u0917\u0947\u0939\u0942\u0902",
    grade: "Sharbati High Protein",
    category: "Food Grains",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
  },
  Soybean: {
    regionalName: "\u0938\u094B\u092F\u093E\u092C\u0940\u0928 / \u0C38\u0C4B\u0C2F\u0C3E\u0C2C\u0C40\u0C28\u0C4D / \u0938\u094B\u092F\u093E\u092C\u0940\u0928",
    grade: "Bold Clean Yellow (Oil 19%)",
    category: "Oilseeds",
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80"
  },
  Turmeric: {
    regionalName: "\u0939\u0933\u0926 / \u0C2A\u0C38\u0C41\u0C2A\u0C41 / \u0939\u0932\u094D\u0926\u0940",
    grade: "Finger Double Polished",
    category: "Spices",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
  },
  Mustard: {
    regionalName: "\u092E\u094B\u0939\u0930\u0940 / \u0C06\u0C35\u0C3E\u0C32\u0C41 / \u0938\u0930\u0938\u094B\u0902",
    grade: "Black Bold 42% Oil",
    category: "Oilseeds",
    imageUrl: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80"
  },
  Groundnut: {
    regionalName: "\u092D\u0941\u0908\u092E\u0942\u0917 / \u0C35\u0C47\u0C30\u0C41\u0C36\u0C28\u0C17 / \u092E\u0942\u0902\u0917\u092B\u0932\u0940",
    grade: "Bold Pods Grade-1",
    category: "Oilseeds",
    imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80"
  },
  "Bengal Gram (Chana)": {
    regionalName: "\u0939\u0930\u092D\u0930\u093E / \u0C36\u0C28\u0C17\u0C32\u0C41 / \u091A\u0928\u093E",
    grade: "Desi Polished Grade-1",
    category: "Food Grains",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80"
  }
};
export const LandingHero = ({
  onExplorePrices,
  onOpenCropScanner,
  onOpenFarmerDesk,
  onOpenMarketAdminDesk,
  onOpenSellProduce
}) => {
  const { language, t } = useLanguage();
  const { selectedCity, selectCity, allCities, isGpsActive } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewScope, setViewScope] = useState("city");
  useEffect(() => {
    if (selectedCity?.id === "pune" || selectedCity?.id === "warangal") {
      setSelectedCategory("Vegetables");
    }
  }, [selectedCity?.id]);
  const cityProducts = useMemo(() => {
    if (!selectedCity || !selectedCity.cropPrices || selectedCity.cropPrices.length === 0) {
      return PRODUCTS_DATA;
    }
    return selectedCity.cropPrices.map((cp, idx) => {
      const meta = CROP_METADATA[cp.cropName] || {
        regionalName: cp.cropName,
        grade: "APMC Grade A Produce",
        category: cp.category === "Vegetable" ? "Vegetables" : cp.category === "Cereal" ? "Food Grains" : "Commercial",
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
      };
      const categoryName = cp.category === "Vegetable" ? "Vegetables" : cp.category === "Cereal" ? "Food Grains" : cp.category === "Spice" ? "Spices" : meta.category || "Vegetables";
      const yesterday = cp.modalPrice - (cp.changeAmount || 0);
      return {
        id: `${selectedCity.id}-${cp.cropName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}`,
        name: cp.cropName,
        regionalName: meta.regionalName,
        category: categoryName,
        cityName: selectedCity.name,
        state: selectedCity.state,
        mandiName: cp.primaryMandi || `${selectedCity.name} APMC Yard`,
        todayRatePerQuintal: cp.modalPrice,
        yesterdayRatePerQuintal: yesterday > 0 ? yesterday : Math.round(cp.modalPrice * 0.95),
        rateUnit: "Quintal",
        minRate: cp.minPrice,
        maxRate: cp.maxPrice,
        arrivalsToday: `${(cp.arrivalVolumeQuintals || 14500).toLocaleString("en-IN")} Q`,
        grade: meta.grade,
        imageUrl: meta.imageUrl,
        updatedTime: "Live Today"
      };
    });
  }, [selectedCity]);
  const activeDataset = viewScope === "city" ? cityProducts : PRODUCTS_DATA;
  const categories = ["All", "Vegetables", "Commercial", "Spices", "Food Grains", "Oilseeds"];
  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "All":
        return t("allCrops");
      case "Commercial":
        return language === "te" ? "\u0C35\u0C3E\u0C23\u0C3F\u0C1C\u0C4D\u0C2F \u0C2A\u0C02\u0C1F\u0C32\u0C41" : language === "hi" ? "\u0935\u094D\u092F\u093E\u0935\u0938\u093E\u092F\u093F\u0915" : "Commercial";
      case "Spices":
        return language === "te" ? "\u0C2E\u0C38\u0C3E\u0C32\u0C3E \u0C26\u0C3F\u0C28\u0C41\u0C38\u0C41\u0C32\u0C41" : language === "hi" ? "\u092E\u0938\u093E\u0932\u0947" : "Spices";
      case "Food Grains":
        return language === "te" ? "\u0C06\u0C39\u0C3E\u0C30 \u0C27\u0C3E\u0C28\u0C4D\u0C2F\u0C3E\u0C32\u0C41" : language === "hi" ? "\u0916\u093E\u0926\u094D\u092F\u093E\u0928\u094D\u0928" : "Food Grains";
      case "Oilseeds":
        return language === "te" ? "\u0C28\u0C42\u0C28\u0C46 \u0C17\u0C3F\u0C02\u0C1C\u0C32\u0C41" : language === "hi" ? "\u0924\u093F\u0932\u0939\u0928" : "Oilseeds";
      case "Vegetables":
        return language === "te" ? "\u0C15\u0C42\u0C30\u0C17\u0C3E\u0C2F\u0C32\u0C41" : language === "hi" ? "\u0938\u092C\u094D\u091C\u093F\u092F\u093E\u0902" : "Vegetables";
      default:
        return cat;
    }
  };
  const filteredProducts = selectedCategory === "All" ? activeDataset : activeDataset.filter((p) => p.category === selectedCategory);
  return <div className="w-full space-y-6" id="commodity-slideshow-section">
      {
    /* Top Banner & Control Bar: Classy, Natural & High-Contrast Design */
  }
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {
    /* Header Info */
  }
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {language === "te" ? "\u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C15\u0C4D\u0C37 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C27\u0C30\u0C32\u0C41 & \u0C30\u0C4B\u0C1C\u0C41\u0C35\u0C3E\u0C30\u0C40 \u0C2E\u0C3E\u0C30\u0C4D\u0C2A\u0C41\u0C32\u0C41" : language === "hi" ? "\u0932\u093E\u0907\u0935 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0914\u0930 \u0926\u0948\u0928\u093F\u0915 \u092E\u0942\u0932\u094D\u092F \u092C\u0926\u0932\u093E\u0935" : "Live Mandi Rates & Daily Price Movement"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
              {t("marketTitle")}
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {t("marketSubtitle")}
            </p>
          </div>

          {
    /* Right Actions: Farmer Desk & Market Admin */
  }
          <div className="shrink-0 self-start md:self-center flex flex-wrap items-center gap-2">
            {onOpenFarmerDesk && <button
    type="button"
    onClick={onOpenFarmerDesk}
    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
    title="Open Farmer Dashboard & view farm operations"
    id="hero-farmer-desk-btn"
  >
                <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === "te" ? "\u0C30\u0C48\u0C24\u0C41 \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928 \u0921\u0947\u0938\u094D\u0915" : "Farmer Desk"}</span>
              </button>}

            {onOpenMarketAdminDesk && <button
    type="button"
    onClick={onOpenMarketAdminDesk}
    className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
    title="Open Market Admin Dashboard to View & Update Vegetable Prices"
    id="hero-market-admin-desk-btn"
  >
                <Building2 className="w-3.5 h-3.5 text-slate-950" />
                <span>{language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928" : "Market Admin"}</span>
              </button>}
          </div>
        </div>

        {
    /* Market City Bar & Quick Switcher */
  }
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {selectedCity.name} ({selectedCity.state})
              </span>
              <span className="text-emerald-700 font-normal">
                • {selectedCity.apmcOverview.primaryHubName}
              </span>
            </div>

            {
    /* Scope Toggle: City vs National */
  }
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
              <button
    type="button"
    onClick={() => setViewScope("city")}
    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewScope === "city" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                📍 {selectedCity.name} Live ({cityProducts.length})
              </button>
              <button
    type="button"
    onClick={() => setViewScope("national")}
    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewScope === "national" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                🌐 All Mandis ({PRODUCTS_DATA.length})
              </button>
            </div>
          </div>

          {
    /* Quick City Switcher Pills */
  }
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] text-slate-500 font-semibold shrink-0">
              {language === "te" ? "\u0C28\u0C17\u0C30\u0C02 \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F:" : language === "hi" ? "\u092E\u0902\u0921\u0940 \u0936\u0939\u0930:" : "Switch City:"}
            </span>
            {[
    { id: "pune", name: "Pune", badge: "\u{1F96C} 20 Veg" },
    { id: "warangal", name: "Warangal", badge: "\u{1F96C} Veg" },
    { id: "hyd", name: "Hyderabad", badge: "Hub" },
    { id: "mumbai", name: "Mumbai", badge: "Vashi" },
    { id: "guntur", name: "Guntur", badge: "Mirchi" },
    { id: "nashik", name: "Nashik", badge: "Onion" }
  ].map((c) => <button
    key={c.id}
    type="button"
    onClick={() => {
      selectCity(c.id);
      setViewScope("city");
    }}
    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${selectedCity.id === c.id ? "bg-emerald-700 text-white font-bold shadow-2xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
  >
                <span>{c.name}</span>
                <span className="text-[9px] opacity-80">{c.badge}</span>
              </button>)}
          </div>
        </div>

        {
    /* Category Filter Chips */
  }
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            {t("filterCrop")}
          </span>
          {categories.map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/70"}`}
  >
              {getCategoryLabel(cat)}
            </button>)}

          {
    /* Active Vegetable Note when Pune or Warangal is selected */
  }
          {(selectedCity.id === "pune" || selectedCity.id === "warangal") && selectedCategory === "Vegetables" && <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold shrink-0 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>
                {selectedCity.name} Vegetable Wholesale Rates Active ({filteredProducts.length} varieties)
              </span>
            </span>}
        </div>
      </div>

      {
    /* Commodity Market Cards Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((item, idx) => {
    const difference = item.todayRatePerQuintal - item.yesterdayRatePerQuintal;
    const isIncreased = difference > 0;
    const isDecreased = difference < 0;
    const absDiff = Math.abs(difference);
    const percentChange = (absDiff / item.yesterdayRatePerQuintal * 100).toFixed(1);
    return <div
      key={`${item.id}-${idx}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden"
    >
              {
      /* Product Photo with City & Category Overlay */
    }
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
      src={item.imageUrl}
      alt={item.name}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
    />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/30" />

                {
      /* City Badge (Top Left) */
    }
                <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">{item.cityName}</span>
                  <span className="text-[11px] text-slate-500 font-medium">({item.state})</span>
                </div>

                {
      /* Category Pill (Top Right) */
    }
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {getCategoryLabel(item.category)}
                  </span>
                </div>

                {
      /* Mandi Name (Bottom of Image) */
    }
                <div className="absolute bottom-3 left-3.5 right-3.5 z-10 text-white">
                  <p className="text-xs text-slate-200 font-medium truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span className="truncate">{item.mandiName}</span>
                  </p>
                </div>
              </div>

              {
      /* Card Body */
    }
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {
      /* Crop Name & Grade */
    }
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                      {item.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-600">
                      {item.regionalName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === "te" ? "\u0C28\u0C3E\u0C23\u0C4D\u0C2F\u0C24" : language === "hi" ? "\u0917\u094D\u0930\u0947\u0921" : "Grade"}: <span className="text-slate-800 font-medium">{item.grade}</span>
                  </p>
                </div>

                {
      /* Today vs Yesterday Rates Container */
    }
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  {
      /* Today's Rate and Yesterday's Rate Side-by-Side */
    }
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200/80">
                    {
      /* Today's Rate */
    }
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                        {t("todaysRate")}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black font-mono text-slate-950 tracking-tight">
                          ₹{item.todayRatePerQuintal.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {t("perQuintal")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-[10px] font-bold font-mono">
                          ≈ ₹{(item.todayRatePerQuintal / 100).toFixed(1)}/kg
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.updatedTime}
                        </span>
                      </div>
                    </div>

                    {
      /* Yesterday's Rate */
    }
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {t("yesterdaysRate")}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-mono text-slate-700 tracking-tight">
                          ₹{item.yesterdayRatePerQuintal.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {t("perQuintal")}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                        {language === "te" ? "\u0C28\u0C3F\u0C28\u0C4D\u0C28\u0C1F\u0C3F \u0C2E\u0C41\u0C17\u0C3F\u0C02\u0C2A\u0C41 \u0C30\u0C47\u0C1F\u0C41" : language === "hi" ? "\u0905\u0902\u0924\u093F\u092E \u092E\u0902\u0921\u0940 \u092D\u093E\u0935" : "Closing Mandi Rate"}
                      </span>
                    </div>
                  </div>

                  {
      /* Explicit Increased vs Decreased Comparison Banner */
    }
                  {isIncreased && <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-semibold">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <span className="font-extrabold text-emerald-800">
                          {t("increasedBy")} ₹{absDiff.toLocaleString("en-IN")} {t("perQuintal")}
                        </span>{" "}
                        <span className="text-emerald-700 font-normal">
                          (+{percentChange}% {language === "te" ? "\u0C28\u0C3F\u0C28\u0C4D\u0C28\u0C1F\u0C3F \u0C15\u0C02\u0C1F\u0C47 \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35" : language === "hi" ? "\u0915\u0932 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u092E\u0947\u0902" : "compared to yesterday"})
                        </span>
                      </div>
                    </div>}

                  {isDecreased && <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200/90 text-rose-900 text-xs font-semibold">
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <TrendingDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <span className="font-extrabold text-rose-800">
                          {t("decreasedBy")} ₹{absDiff.toLocaleString("en-IN")} {t("perQuintal")}
                        </span>{" "}
                        <span className="text-rose-700 font-normal">
                          (-{percentChange}% {language === "te" ? "\u0C28\u0C3F\u0C28\u0C4D\u0C28\u0C1F\u0C3F \u0C15\u0C02\u0C1F\u0C47 \u0C24\u0C15\u0C4D\u0C15\u0C41\u0C35" : language === "hi" ? "\u0915\u0932 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u092E\u0947\u0902" : "compared to yesterday"})
                        </span>
                      </div>
                    </div>}

                  {!isIncreased && !isDecreased && <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                      <Activity className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>{t("stableRate")}</span>
                    </div>}
                </div>

                {
      /* Arrivals & Today's Range */
    }
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {t("todaysRange")}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      ₹{item.minRate.toLocaleString("en-IN")} – ₹{item.maxRate.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {t("arrivalVolume")}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {item.arrivalsToday}
                    </span>
                  </div>
                </div>

                {
      /* Compare Action Button */
    }
                <div className="pt-1">
                  {onExplorePrices ? <button
      onClick={onExplorePrices}
      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group-hover:bg-slate-800"
    >
                      <span>{t("compareMandis")}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button> : <div className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs text-center border border-slate-200">
                      {language === "te" ? "\u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 APMC \u0C35\u0C47\u0C32\u0C02" : language === "hi" ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 APMC \u0928\u0940\u0932\u093E\u092E\u0940" : "Verified APMC Live Auction"}
                    </div>}
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
