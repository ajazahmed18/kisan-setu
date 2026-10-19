export const DEFAULT_CITY_ID = "hyd";
export const CITIES_MARKET_DATA = [
  // 1. HYDERABAD (DEFAULT)
  {
    id: "hyd",
    name: "Hyderabad",
    shortCode: "HYD",
    nameHi: "\u0939\u0948\u0926\u0930\u093E\u092C\u093E\u0926",
    nameTe: "\u0C39\u0C48\u0C26\u0C30\u0C3E\u0C2C\u0C3E\u0C26\u0C4D",
    state: "Telangana",
    region: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    isDefault: true,
    distanceFromHydKm: 0,
    weather: {
      temp: 29,
      condition: "Partly Sunny",
      humidity: 58,
      roadCondition: "Clear & High-Speed Transit via ORR & NH-44",
      transitAlert: "Bowenpally & Malakpet gates operating normal with 24/7 weighbridge support."
    },
    apmcOverview: {
      totalActiveMandis: 5,
      dailyArrivalsTotalQuintals: 38400,
      primaryHubName: "Bowenpally Wholesale Agricultural Market Yard",
      marketFeePercentage: 1,
      weighmentType: "Certified Digital Weighbridges (e-NAM Integrated)"
    },
    mandis: [
      {
        id: "mandi-hyd-bowenpally",
        name: "Bowenpally Wholesale Agricultural Market",
        type: "Wholesale",
        locationArea: "Bowenpally, Secunderabad / Hyderabad",
        timings: "04:00 AM \u2013 02:00 PM (Daily)",
        dailyArrivalTonnes: 1450,
        enamConnected: true,
        activeTradersCount: 420,
        contactNumber: "+91 40 2775 4321"
      },
      {
        id: "mandi-hyd-malakpet",
        name: "Malakpet Gunj Grain & Onion Market",
        type: "APMC Yard",
        locationArea: "Old City / Malakpet, Hyderabad",
        timings: "05:00 AM \u2013 04:00 PM",
        dailyArrivalTonnes: 1200,
        enamConnected: true,
        activeTradersCount: 380,
        contactNumber: "+91 40 2456 8901"
      },
      {
        id: "mandi-hyd-gaddiannaram",
        name: "Gaddiannaram Fruit & Commercial Market Yard",
        type: "Terminal Market",
        locationArea: "Kothapet / LB Nagar, Hyderabad",
        timings: "03:30 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 980,
        enamConnected: true,
        activeTradersCount: 260,
        contactNumber: "+91 40 2404 1122"
      },
      {
        id: "mandi-hyd-shamshabad",
        name: "Shamshabad Agro & Rythu Bazar Terminal",
        type: "Rythu Bazar",
        locationArea: "Airport Bypass Road, Shamshabad",
        timings: "06:00 AM \u2013 08:00 PM",
        dailyArrivalTonnes: 540,
        enamConnected: true,
        activeTradersCount: 140,
        contactNumber: "+91 40 2400 3344"
      },
      {
        id: "mandi-hyd-gudimalkapur",
        name: "Gudimalkapur Vegetable & Flower Wholesale Market",
        type: "Wholesale",
        locationArea: "Mehdipatnam, Hyderabad",
        timings: "04:00 AM \u2013 12:00 PM",
        dailyArrivalTonnes: 720,
        enamConnected: false,
        activeTradersCount: 195,
        contactNumber: "+91 40 2351 7766"
      }
    ],
    cropPrices: [
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 1950,
        maxPrice: 2600,
        modalPrice: 2350,
        trend: "increasing",
        changeAmount: 150,
        arrivalVolumeQuintals: 7400,
        primaryMandi: "Bowenpally Wholesale Market"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2480,
        maxPrice: 2780,
        modalPrice: 2620,
        trend: "increasing",
        changeAmount: 60,
        arrivalVolumeQuintals: 18500,
        primaryMandi: "Malakpet Gunj Market"
      },
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1800,
        maxPrice: 2400,
        modalPrice: 2100,
        trend: "increasing",
        changeAmount: 120,
        arrivalVolumeQuintals: 12400,
        primaryMandi: "Malakpet Onion Yard"
      },
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 6900,
        maxPrice: 7300,
        modalPrice: 7100,
        trend: "stable",
        changeAmount: 0,
        arrivalVolumeQuintals: 6200,
        primaryMandi: "Hyderabad Regional Depot (Shadnagar)"
      },
      {
        cropName: "Red Chilli",
        category: "Spices",
        minPrice: 17500,
        maxPrice: 20400,
        modalPrice: 19100,
        trend: "increasing",
        changeAmount: 400,
        arrivalVolumeQuintals: 8900,
        primaryMandi: "Gaddiannaram Spice Terminal"
      },
      {
        cropName: "Maize",
        category: "Cereal",
        minPrice: 2050,
        maxPrice: 2300,
        modalPrice: 2190,
        trend: "increasing",
        changeAmount: 40,
        arrivalVolumeQuintals: 5600,
        primaryMandi: "Bowenpally Grain Section"
      },
      {
        cropName: "Wheat",
        category: "Cereal",
        minPrice: 2350,
        maxPrice: 2620,
        modalPrice: 2500,
        trend: "stable",
        changeAmount: 10,
        arrivalVolumeQuintals: 4200,
        primaryMandi: "Malakpet Wholesale Hub"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 0.5,
      freightPerQuintalFromHyd: 40,
      availableTrucksCount: 148,
      routeHighway: "Outer Ring Road (ORR) Expressway & NH-44 Hub"
    }
  },
  // 2. WARANGAL
  {
    id: "warangal",
    name: "Warangal",
    shortCode: "WGL",
    nameHi: "\u0935\u093E\u0930\u0902\u0917\u0932",
    nameTe: "\u0C35\u0C30\u0C02\u0C17\u0C32\u0C4D",
    state: "Telangana",
    region: "Telangana",
    lat: 17.9689,
    lng: 79.5941,
    distanceFromHydKm: 145,
    weather: {
      temp: 31,
      condition: "Sunny",
      humidity: 52,
      roadCondition: "Excellent 4-Lane Hyderabad-Warangal Highway (NH-163)",
      transitAlert: "Laxmipuram & Enamamula vegetable gates open early at 04:00 AM."
    },
    apmcOverview: {
      totalActiveMandis: 5,
      dailyArrivalsTotalQuintals: 32500,
      primaryHubName: "Laxmipuram Vegetable Wholesale Market & Enamamula Sabzi Yard",
      marketFeePercentage: 1,
      weighmentType: "Certified Electronic Weighbridges (e-NAM Vegetable Yard)"
    },
    mandis: [
      {
        id: "mandi-wgl-laxmipuram",
        name: "Laxmipuram Vegetable Wholesale Market",
        type: "Wholesale",
        locationArea: "Laxmipuram / Kashibugga, Warangal",
        timings: "04:00 AM \u2013 12:30 PM",
        dailyArrivalTonnes: 1450,
        enamConnected: true,
        activeTradersCount: 380,
        contactNumber: "+91 870 242 5522"
      },
      {
        id: "mandi-wgl-hanamkonda",
        name: "Hanamkonda Subji Mandi & Rythu Bazar",
        type: "Rythu Bazar",
        locationArea: "Nakkalagutta, Hanamkonda",
        timings: "05:30 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 620,
        enamConnected: false,
        activeTradersCount: 210,
        contactNumber: "+91 870 257 9100"
      },
      {
        id: "mandi-wgl-enamamula",
        name: "Enamamula Agricultural Market Yard (Sabzi & Mirchi Section)",
        type: "Terminal Market",
        locationArea: "Enamamula, Warangal",
        timings: "05:00 AM \u2013 03:00 PM",
        dailyArrivalTonnes: 3200,
        enamConnected: true,
        activeTradersCount: 650,
        contactNumber: "+91 870 245 1100"
      },
      {
        id: "mandi-wgl-kazipet",
        name: "Kazipet Rythu Bazar & Vegetable Depot",
        type: "Rythu Bazar",
        locationArea: "Railway Station Road, Kazipet",
        timings: "06:00 AM \u2013 12:00 PM",
        dailyArrivalTonnes: 380,
        enamConnected: false,
        activeTradersCount: 145,
        contactNumber: "+91 870 243 4488"
      },
      {
        id: "mandi-wgl-grain",
        name: "Warangal Kashibugga Grain Mandi",
        type: "APMC Yard",
        locationArea: "Kashibugga, Warangal",
        timings: "06:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 900,
        enamConnected: true,
        activeTradersCount: 220,
        contactNumber: "+91 870 242 8899"
      }
    ],
    cropPrices: [
      {
        cropName: "Tomato (\u0C1F\u0C2E\u0C3E\u0C1F\u0C3E)",
        category: "Vegetable",
        minPrice: 1700,
        maxPrice: 2300,
        modalPrice: 2050,
        trend: "stable",
        changeAmount: 20,
        arrivalVolumeQuintals: 4200,
        primaryMandi: "Laxmipuram Vegetable Market"
      },
      {
        cropName: "Green Chilli (\u0C35\u0C30\u0C02\u0C17\u0C32\u0C4D \u0C2A\u0C1A\u0C4D\u0C1A\u0C3F\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F - \u0C24\u0C47\u0C1C\u0C3E)",
        category: "Vegetable",
        minPrice: 4400,
        maxPrice: 5600,
        modalPrice: 4950,
        trend: "increasing",
        changeAmount: 220,
        arrivalVolumeQuintals: 7800,
        primaryMandi: "Enamamula Mirchi Yard"
      },
      {
        cropName: "Brinjal / Eggplant (\u0C28\u0C3E\u0C1F\u0C41 \u0C35\u0C02\u0C15\u0C3E\u0C2F)",
        category: "Vegetable",
        minPrice: 1400,
        maxPrice: 1900,
        modalPrice: 1650,
        trend: "increasing",
        changeAmount: 50,
        arrivalVolumeQuintals: 2600,
        primaryMandi: "Hanamkonda Rythu Bazar"
      },
      {
        cropName: "Okra / Ladies Finger (\u0C2C\u0C46\u0C02\u0C21\u0C15\u0C3E\u0C2F)",
        category: "Vegetable",
        minPrice: 2400,
        maxPrice: 3200,
        modalPrice: 2800,
        trend: "increasing",
        changeAmount: 140,
        arrivalVolumeQuintals: 1900,
        primaryMandi: "Laxmipuram Vegetable Market"
      },
      {
        cropName: "Onion (\u0C09\u0C32\u0C4D\u0C32\u0C3F\u0C2A\u0C3E\u0C2F)",
        category: "Vegetable",
        minPrice: 1850,
        maxPrice: 2450,
        modalPrice: 2100,
        trend: "increasing",
        changeAmount: 80,
        arrivalVolumeQuintals: 5800,
        primaryMandi: "Enamamula Onion Shed"
      },
      {
        cropName: "Potato (\u0C2C\u0C02\u0C17\u0C3E\u0C33\u0C3E\u0C26\u0C41\u0C02\u0C2A)",
        category: "Vegetable",
        minPrice: 1550,
        maxPrice: 1950,
        modalPrice: 1750,
        trend: "stable",
        changeAmount: 10,
        arrivalVolumeQuintals: 4900,
        primaryMandi: "Laxmipuram Cold Storage Yard"
      },
      {
        cropName: "Bitter Gourd (\u0C15\u0C3E\u0C15\u0C30\u0C15\u0C3E\u0C2F)",
        category: "Vegetable",
        minPrice: 2800,
        maxPrice: 3600,
        modalPrice: 3200,
        trend: "decreasing",
        changeAmount: -80,
        arrivalVolumeQuintals: 950,
        primaryMandi: "Hanamkonda Subji Mandi"
      },
      {
        cropName: "Bottle Gourd (\u0C38\u0C4A\u0C30\u0C15\u0C3E\u0C2F)",
        category: "Vegetable",
        minPrice: 950,
        maxPrice: 1400,
        modalPrice: 1180,
        trend: "stable",
        changeAmount: 10,
        arrivalVolumeQuintals: 1400,
        primaryMandi: "Kazipet Rythu Bazar"
      },
      {
        cropName: "Ridge Gourd (\u0C2C\u0C40\u0C30\u0C15\u0C3E\u0C2F)",
        category: "Vegetable",
        minPrice: 2600,
        maxPrice: 3300,
        modalPrice: 2950,
        trend: "increasing",
        changeAmount: 110,
        arrivalVolumeQuintals: 1200,
        primaryMandi: "Laxmipuram Vegetable Market"
      },
      {
        cropName: "Cabbage (\u0C15\u0C4D\u0C2F\u0C3E\u0C2C\u0C47\u0C1C\u0C40)",
        category: "Vegetable",
        minPrice: 1200,
        maxPrice: 1650,
        modalPrice: 1420,
        trend: "decreasing",
        changeAmount: -40,
        arrivalVolumeQuintals: 2100,
        primaryMandi: "Hanamkonda Subji Mandi"
      },
      {
        cropName: "Cauliflower (\u0C15\u0C3E\u0C32\u0C40\u0C2B\u0C4D\u0C32\u0C35\u0C30\u0C4D)",
        category: "Vegetable",
        minPrice: 1800,
        maxPrice: 2550,
        modalPrice: 2200,
        trend: "increasing",
        changeAmount: 90,
        arrivalVolumeQuintals: 1750,
        primaryMandi: "Laxmipuram Vegetable Market"
      },
      {
        cropName: "Palak / Spinach (\u0C2A\u0C3E\u0C32\u0C15\u0C42\u0C30)",
        category: "Vegetable",
        minPrice: 1200,
        maxPrice: 1800,
        modalPrice: 1500,
        trend: "stable",
        changeAmount: 0,
        arrivalVolumeQuintals: 850,
        primaryMandi: "Warangal Rythu Bazar"
      },
      {
        cropName: "Ginger (\u0C05\u0C32\u0C4D\u0C32\u0C02)",
        category: "Vegetable",
        minPrice: 7800,
        maxPrice: 9200,
        modalPrice: 8500,
        trend: "increasing",
        changeAmount: 300,
        arrivalVolumeQuintals: 1200,
        primaryMandi: "Enamamula Yard"
      },
      {
        cropName: "Garlic (\u0C35\u0C46\u0C32\u0C4D\u0C32\u0C41\u0C32\u0C4D\u0C32\u0C3F)",
        category: "Vegetable",
        minPrice: 12500,
        maxPrice: 15800,
        modalPrice: 14200,
        trend: "increasing",
        changeAmount: 450,
        arrivalVolumeQuintals: 1450,
        primaryMandi: "Enamamula Spice & Tuber Yard"
      },
      {
        cropName: "Coriander (\u0C15\u0C4A\u0C24\u0C4D\u0C24\u0C3F\u0C2E\u0C40\u0C30)",
        category: "Vegetable",
        minPrice: 2e3,
        maxPrice: 2800,
        modalPrice: 2400,
        trend: "stable",
        changeAmount: 0,
        arrivalVolumeQuintals: 700,
        primaryMandi: "Hanamkonda Subji Mandi"
      },
      {
        cropName: "Capsicum (\u0C15\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u0C38\u0C3F\u0C15\u0C02)",
        category: "Vegetable",
        minPrice: 3400,
        maxPrice: 4200,
        modalPrice: 3850,
        trend: "increasing",
        changeAmount: 150,
        arrivalVolumeQuintals: 650,
        primaryMandi: "Laxmipuram Vegetable Market"
      },
      {
        cropName: "Cluster Beans (\u0C17\u0C4B\u0C30\u0C41\u0C1A\u0C3F\u0C15\u0C4D\u0C15\u0C41\u0C21\u0C41)",
        category: "Vegetable",
        minPrice: 2700,
        maxPrice: 3500,
        modalPrice: 3100,
        trend: "increasing",
        changeAmount: 80,
        arrivalVolumeQuintals: 820,
        primaryMandi: "Kazipet Rythu Bazar"
      },
      {
        cropName: "Carrot (\u0C15\u0C4D\u0C2F\u0C3E\u0C30\u0C46\u0C1F\u0C4D)",
        category: "Vegetable",
        minPrice: 2200,
        maxPrice: 2900,
        modalPrice: 2550,
        trend: "stable",
        changeAmount: 20,
        arrivalVolumeQuintals: 1300,
        primaryMandi: "Laxmipuram Vegetable Market"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 2.8,
      freightPerQuintalFromHyd: 180,
      availableTrucksCount: 94,
      routeHighway: "NH-163 (Hyderabad \u2013 Warangal 4-Lane Expressway)"
    }
  },
  // 3. NIZAMABAD
  {
    id: "nizamabad",
    name: "Nizamabad",
    shortCode: "NZB",
    nameHi: "\u0928\u093F\u091C\u093C\u093E\u092E\u093E\u092C\u093E\u0926",
    nameTe: "\u0C28\u0C3F\u0C1C\u0C3E\u0C2E\u0C3E\u0C2C\u0C3E\u0C26\u0C4D",
    state: "Telangana",
    region: "Telangana",
    lat: 18.6725,
    lng: 78.0941,
    distanceFromHydKm: 172,
    weather: {
      temp: 30,
      condition: "Clear Sky",
      humidity: 50,
      roadCondition: "Smooth NH-44 Corridor",
      transitAlert: "Paddy arrival peak: expect 30-min gate queue at APMC yard."
    },
    apmcOverview: {
      totalActiveMandis: 2,
      dailyArrivalsTotalQuintals: 36500,
      primaryHubName: "Nizamabad APMC Turmeric & Paddy Market",
      marketFeePercentage: 1,
      weighmentType: "Integrated e-NAM Electronic Scales"
    },
    mandis: [
      {
        id: "mandi-nzb-main",
        name: "Nizamabad Agricultural Market Yard",
        type: "APMC Yard",
        locationArea: "Railway Feeder Road, Nizamabad",
        timings: "05:30 AM \u2013 02:30 PM",
        dailyArrivalTonnes: 2600,
        enamConnected: true,
        activeTradersCount: 390,
        contactNumber: "+91 8462 221 445"
      },
      {
        id: "mandi-nzb-bodhan",
        name: "Bodhan Sugar & Paddy APMC Sub-Yard",
        type: "Wholesale",
        locationArea: "Bodhan Road, Nizamabad District",
        timings: "06:00 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 850,
        enamConnected: true,
        activeTradersCount: 160,
        contactNumber: "+91 8467 222 100"
      }
    ],
    cropPrices: [
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2450,
        maxPrice: 2750,
        modalPrice: 2600,
        trend: "increasing",
        changeAmount: 40,
        arrivalVolumeQuintals: 22e3,
        primaryMandi: "Nizamabad Agricultural Market"
      },
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7e3,
        maxPrice: 7450,
        modalPrice: 7300,
        trend: "increasing",
        changeAmount: 90,
        arrivalVolumeQuintals: 8500,
        primaryMandi: "Nizamabad APMC Yard"
      },
      {
        cropName: "Maize",
        category: "Cereal",
        minPrice: 2e3,
        maxPrice: 2280,
        modalPrice: 2180,
        trend: "increasing",
        changeAmount: 30,
        arrivalVolumeQuintals: 9200,
        primaryMandi: "Nizamabad Agricultural Market"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 3.2,
      freightPerQuintalFromHyd: 210,
      availableTrucksCount: 68,
      routeHighway: "NH-44 (Hyderabad \u2013 Nagpur North-South Corridor)"
    }
  },
  // 4. KARIMNAGAR
  {
    id: "karimnagar",
    name: "Karimnagar",
    shortCode: "KRM",
    nameHi: "\u0915\u0930\u0940\u092E\u0928\u0917\u0930",
    nameTe: "\u0C15\u0C30\u0C40\u0C02\u0C28\u0C17\u0C30\u0C4D",
    state: "Telangana",
    region: "Telangana",
    lat: 18.4386,
    lng: 79.1288,
    distanceFromHydKm: 164,
    weather: {
      temp: 30,
      condition: "Partly Sunny",
      humidity: 54,
      roadCondition: "Rajiv Rahadari State Highway 1 - Fast & Good Condition"
    },
    apmcOverview: {
      totalActiveMandis: 2,
      dailyArrivalsTotalQuintals: 28e3,
      primaryHubName: "Karimnagar Rythu Mandi & Jammikunta Cotton Yard",
      marketFeePercentage: 1,
      weighmentType: "Direct e-NAM Weighment"
    },
    mandis: [
      {
        id: "mandi-krm-main",
        name: "Karimnagar Rythu Mandi",
        type: "APMC Yard",
        locationArea: "Kisan Nagar, Karimnagar",
        timings: "05:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 1800,
        enamConnected: true,
        activeTradersCount: 310,
        contactNumber: "+91 878 224 5500"
      },
      {
        id: "mandi-krm-jammikunta",
        name: "Jammikunta Cotton & Grain Yard",
        type: "Wholesale",
        locationArea: "Jammikunta, Karimnagar District",
        timings: "06:00 AM \u2013 03:00 PM",
        dailyArrivalTonnes: 1200,
        enamConnected: true,
        activeTradersCount: 210,
        contactNumber: "+91 878 255 1234"
      }
    ],
    cropPrices: [
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7050,
        maxPrice: 7380,
        modalPrice: 7250,
        trend: "increasing",
        changeAmount: 50,
        arrivalVolumeQuintals: 9100,
        primaryMandi: "Jammikunta Cotton Yard"
      },
      {
        cropName: "Maize",
        category: "Cereal",
        minPrice: 2050,
        maxPrice: 2320,
        modalPrice: 2200,
        trend: "stable",
        changeAmount: 10,
        arrivalVolumeQuintals: 11e3,
        primaryMandi: "Karimnagar Rythu Mandi"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2420,
        maxPrice: 2700,
        modalPrice: 2580,
        trend: "increasing",
        changeAmount: 35,
        arrivalVolumeQuintals: 14e3,
        primaryMandi: "Karimnagar Rythu Mandi"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 3,
      freightPerQuintalFromHyd: 200,
      availableTrucksCount: 55,
      routeHighway: "SH-1 Rajiv Rahadari Expressway"
    }
  },
  // 5. KHAMMAM
  {
    id: "khammam",
    name: "Khammam",
    shortCode: "KHM",
    nameHi: "\u0916\u092E\u094D\u092E\u092E",
    nameTe: "\u0C16\u0C2E\u0C4D\u0C2E\u0C02",
    state: "Telangana",
    region: "Telangana",
    lat: 17.2473,
    lng: 80.1514,
    distanceFromHydKm: 195,
    weather: {
      temp: 32,
      condition: "Warm & Humid",
      humidity: 65,
      roadCondition: "NH-365A Hyderabad - Suryapet - Khammam Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 2,
      dailyArrivalsTotalQuintals: 31e3,
      primaryHubName: "Khammam Agricultural Market Yard",
      marketFeePercentage: 1,
      weighmentType: "Govt Certified Weighbridges"
    },
    mandis: [
      {
        id: "mandi-khm-main",
        name: "Khammam Agricultural Market Yard",
        type: "Terminal Market",
        locationArea: "Wyra Road, Khammam",
        timings: "05:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 2100,
        enamConnected: true,
        activeTradersCount: 340,
        contactNumber: "+91 8742 233 440"
      }
    ],
    cropPrices: [
      {
        cropName: "Red Chilli",
        category: "Spices",
        minPrice: 16800,
        maxPrice: 19800,
        modalPrice: 18600,
        trend: "stable",
        changeAmount: 80,
        arrivalVolumeQuintals: 15400,
        primaryMandi: "Khammam Agricultural Market"
      },
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 6950,
        maxPrice: 7350,
        modalPrice: 7180,
        trend: "increasing",
        changeAmount: 70,
        arrivalVolumeQuintals: 11200,
        primaryMandi: "Khammam Agricultural Market"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2400,
        maxPrice: 2690,
        modalPrice: 2560,
        trend: "stable",
        changeAmount: 15,
        arrivalVolumeQuintals: 13500,
        primaryMandi: "Khammam Agricultural Market"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 3.5,
      freightPerQuintalFromHyd: 230,
      availableTrucksCount: 62,
      routeHighway: "NH-65 & NH-365A"
    }
  },
  // 6. GUNTUR
  {
    id: "guntur",
    name: "Guntur",
    shortCode: "GNT",
    nameHi: "\u0917\u0941\u0902\u091F\u0942\u0930",
    nameTe: "\u0C17\u0C41\u0C02\u0C1F\u0C42\u0C30\u0C41",
    state: "Andhra Pradesh",
    region: "Andhra Pradesh",
    lat: 16.3067,
    lng: 80.4365,
    distanceFromHydKm: 270,
    weather: {
      temp: 33,
      condition: "Sunny & Hot",
      humidity: 62,
      roadCondition: "NH-65 6-Lane Vijayawada Highway Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 52e3,
      primaryHubName: "Guntur Mirchi Yard (Asia Largest Red Chilli Hub)",
      marketFeePercentage: 1,
      weighmentType: "High-Tech Digital Weighbridges"
    },
    mandis: [
      {
        id: "mandi-gnt-mirchi",
        name: "Guntur Mirchi Yard",
        type: "Terminal Market",
        locationArea: "Mirchi Yard Road, Guntur",
        timings: "04:30 AM \u2013 03:00 PM",
        dailyArrivalTonnes: 4200,
        enamConnected: true,
        activeTradersCount: 850,
        contactNumber: "+91 863 223 9988"
      },
      {
        id: "mandi-gnt-cotton",
        name: "Guntur Cotton & Tobacco Yard",
        type: "Wholesale",
        locationArea: "Brodipet, Guntur",
        timings: "06:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 1100,
        enamConnected: true,
        activeTradersCount: 280,
        contactNumber: "+91 863 225 1122"
      }
    ],
    cropPrices: [
      {
        cropName: "Red Chilli",
        category: "Spices",
        minPrice: 17200,
        maxPrice: 20500,
        modalPrice: 19200,
        trend: "increasing",
        changeAmount: 300,
        arrivalVolumeQuintals: 28e3,
        primaryMandi: "Guntur Mirchi Yard"
      },
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7100,
        maxPrice: 7500,
        modalPrice: 7350,
        trend: "increasing",
        changeAmount: 80,
        arrivalVolumeQuintals: 16e3,
        primaryMandi: "Guntur Cotton Yard"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2420,
        maxPrice: 2720,
        modalPrice: 2590,
        trend: "stable",
        changeAmount: 20,
        arrivalVolumeQuintals: 14500,
        primaryMandi: "Tenali Sub-Yard Guntur"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 4.8,
      freightPerQuintalFromHyd: 290,
      availableTrucksCount: 110,
      routeHighway: "NH-65 (Hyderabad \u2013 Suryapet \u2013 Vijayawada \u2013 Guntur)"
    }
  },
  // 7. VIJAYAWADA
  {
    id: "vijayawada",
    name: "Vijayawada",
    shortCode: "BZA",
    nameHi: "\u0935\u093F\u091C\u092F\u0935\u093E\u0921\u093C\u093E",
    nameTe: "\u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C3E\u0C21",
    state: "Andhra Pradesh",
    region: "Andhra Pradesh",
    lat: 16.5062,
    lng: 80.648,
    distanceFromHydKm: 275,
    weather: {
      temp: 32,
      condition: "Humid & Sunny",
      humidity: 70,
      roadCondition: "NH-65 6-Lane Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 41e3,
      primaryHubName: "Gollapudi Wholesale Market Yard",
      marketFeePercentage: 1,
      weighmentType: "e-NAM Integrated Electronic Scales"
    },
    mandis: [
      {
        id: "mandi-bza-gollapudi",
        name: "Gollapudi Wholesale Market Yard",
        type: "Wholesale",
        locationArea: "Gollapudi, Vijayawada",
        timings: "04:00 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 2400,
        enamConnected: true,
        activeTradersCount: 450,
        contactNumber: "+91 866 241 2299"
      }
    ],
    cropPrices: [
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2460,
        maxPrice: 2760,
        modalPrice: 2630,
        trend: "increasing",
        changeAmount: 50,
        arrivalVolumeQuintals: 26e3,
        primaryMandi: "Gollapudi Wholesale Market"
      },
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 1900,
        maxPrice: 2500,
        modalPrice: 2280,
        trend: "increasing",
        changeAmount: 90,
        arrivalVolumeQuintals: 6200,
        primaryMandi: "Kedarishwarapet Market"
      },
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1850,
        maxPrice: 2350,
        modalPrice: 2120,
        trend: "increasing",
        changeAmount: 80,
        arrivalVolumeQuintals: 9500,
        primaryMandi: "Gollapudi Yard"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 4.5,
      freightPerQuintalFromHyd: 280,
      availableTrucksCount: 96,
      routeHighway: "NH-65 Express Highway"
    }
  },
  // 8. KURNOOL
  {
    id: "kurnool",
    name: "Kurnool",
    shortCode: "KNL",
    nameHi: "\u0915\u0941\u0930\u0928\u0942\u0932",
    nameTe: "\u0C15\u0C30\u0C4D\u0C28\u0C42\u0C32\u0C41",
    state: "Andhra Pradesh",
    region: "Andhra Pradesh",
    lat: 15.8281,
    lng: 78.0373,
    distanceFromHydKm: 215,
    weather: {
      temp: 34,
      condition: "Hot & Dry",
      humidity: 45,
      roadCondition: "NH-44 Bengaluru Highway (Direct & Smooth)"
    },
    apmcOverview: {
      totalActiveMandis: 2,
      dailyArrivalsTotalQuintals: 34e3,
      primaryHubName: "Kurnool APMC Onion & Groundnut Yard",
      marketFeePercentage: 1,
      weighmentType: "Certified Digital Scales"
    },
    mandis: [
      {
        id: "mandi-knl-main",
        name: "Kurnool APMC Market Yard",
        type: "APMC Yard",
        locationArea: "Bellary Road, Kurnool",
        timings: "05:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 2100,
        enamConnected: true,
        activeTradersCount: 380,
        contactNumber: "+91 8518 220 890"
      },
      {
        id: "mandi-knl-adoni",
        name: "Adoni Cotton & Oilseed Market",
        type: "Wholesale",
        locationArea: "Adoni, Kurnool District",
        timings: "06:00 AM \u2013 03:00 PM",
        dailyArrivalTonnes: 1500,
        enamConnected: true,
        activeTradersCount: 290,
        contactNumber: "+91 8512 251 345"
      }
    ],
    cropPrices: [
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1750,
        maxPrice: 2280,
        modalPrice: 2020,
        trend: "increasing",
        changeAmount: 110,
        arrivalVolumeQuintals: 19e3,
        primaryMandi: "Kurnool APMC Yard"
      },
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7e3,
        maxPrice: 7420,
        modalPrice: 7280,
        trend: "increasing",
        changeAmount: 60,
        arrivalVolumeQuintals: 12e3,
        primaryMandi: "Adoni Cotton Market"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2380,
        maxPrice: 2650,
        modalPrice: 2520,
        trend: "stable",
        changeAmount: 10,
        arrivalVolumeQuintals: 11500,
        primaryMandi: "Kurnool APMC Yard"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 3.8,
      freightPerQuintalFromHyd: 240,
      availableTrucksCount: 75,
      routeHighway: "NH-44 (Hyderabad \u2013 Bangalore Highway)"
    }
  },
  // 9. BENGALURU
  {
    id: "bengaluru",
    name: "Bengaluru",
    shortCode: "BLR",
    nameHi: "\u092C\u0947\u0902\u0917\u0932\u0941\u0930\u0941",
    nameTe: "\u0C2C\u0C46\u0C02\u0C17\u0C33\u0C42\u0C30\u0C41",
    state: "Karnataka",
    region: "South India",
    lat: 12.9716,
    lng: 77.5946,
    distanceFromHydKm: 565,
    weather: {
      temp: 24,
      condition: "Pleasant & Breezy",
      humidity: 60,
      roadCondition: "NH-44 6-Lane Golden Quadrilateral / North-South Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 4,
      dailyArrivalsTotalQuintals: 58e3,
      primaryHubName: "Yeshwanthpur APMC Wholesale Market",
      marketFeePercentage: 1.5,
      weighmentType: "Automated Electronic Ingress Scales"
    },
    mandis: [
      {
        id: "mandi-blr-yeshwanthpur",
        name: "Yeshwanthpur APMC Market Yard",
        type: "Terminal Market",
        locationArea: "Tumkur Road, Yeshwanthpur, Bengaluru",
        timings: "03:30 AM \u2013 01:30 PM",
        dailyArrivalTonnes: 3800,
        enamConnected: true,
        activeTradersCount: 920,
        contactNumber: "+91 80 2337 4411"
      },
      {
        id: "mandi-blr-kr-market",
        name: "K.R. Market Wholesale Complex",
        type: "Wholesale",
        locationArea: "City Market, Bengaluru",
        timings: "03:00 AM \u2013 11:30 AM",
        dailyArrivalTonnes: 1900,
        enamConnected: false,
        activeTradersCount: 540,
        contactNumber: "+91 80 2670 1289"
      }
    ],
    cropPrices: [
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2100,
        maxPrice: 2800,
        modalPrice: 2500,
        trend: "increasing",
        changeAmount: 180,
        arrivalVolumeQuintals: 16800,
        primaryMandi: "Yeshwanthpur APMC Yard"
      },
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1900,
        maxPrice: 2550,
        modalPrice: 2260,
        trend: "increasing",
        changeAmount: 140,
        arrivalVolumeQuintals: 18200,
        primaryMandi: "Yeshwanthpur APMC Yard"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2550,
        maxPrice: 2900,
        modalPrice: 2740,
        trend: "increasing",
        changeAmount: 80,
        arrivalVolumeQuintals: 21e3,
        primaryMandi: "Yeshwanthpur Grain Wing"
      },
      {
        cropName: "Maize",
        category: "Cereal",
        minPrice: 2180,
        maxPrice: 2450,
        modalPrice: 2320,
        trend: "increasing",
        changeAmount: 50,
        arrivalVolumeQuintals: 8700,
        primaryMandi: "Yeshwanthpur APMC Yard"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 8.5,
      freightPerQuintalFromHyd: 480,
      availableTrucksCount: 165,
      routeHighway: "NH-44 Direct Expressway Corridor"
    }
  },
  // 10. CHENNAI
  {
    id: "chennai",
    name: "Chennai",
    shortCode: "MAA",
    nameHi: "\u091A\u0947\u0928\u094D\u0928\u0908",
    nameTe: "\u0C1A\u0C46\u0C28\u0C4D\u0C28\u0C48",
    state: "Tamil Nadu",
    region: "South India",
    lat: 13.0827,
    lng: 80.2707,
    distanceFromHydKm: 625,
    weather: {
      temp: 31,
      condition: "Warm Coastal Breeze",
      humidity: 78,
      roadCondition: "NH-16 Coastal Corridor (Hyderabad \u2013 Ongole \u2013 Nellore \u2013 Chennai)"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 62e3,
      primaryHubName: "Koyambedu Wholesale Market Complex (KWMC)",
      marketFeePercentage: 1,
      weighmentType: "KWMC Automated Weighment"
    },
    mandis: [
      {
        id: "mandi-maa-koyambedu",
        name: "Koyambedu Wholesale Market Complex (KWMC)",
        type: "Terminal Market",
        locationArea: "Koyambedu, Chennai",
        timings: "02:00 AM \u2013 12:00 PM",
        dailyArrivalTonnes: 4900,
        enamConnected: true,
        activeTradersCount: 1150,
        contactNumber: "+91 44 2479 2311"
      }
    ],
    cropPrices: [
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2150,
        maxPrice: 2850,
        modalPrice: 2550,
        trend: "increasing",
        changeAmount: 200,
        arrivalVolumeQuintals: 19500,
        primaryMandi: "Koyambedu Market Complex"
      },
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1950,
        maxPrice: 2600,
        modalPrice: 2300,
        trend: "increasing",
        changeAmount: 130,
        arrivalVolumeQuintals: 21e3,
        primaryMandi: "Koyambedu Market Complex"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2500,
        maxPrice: 2880,
        modalPrice: 2710,
        trend: "increasing",
        changeAmount: 70,
        arrivalVolumeQuintals: 24e3,
        primaryMandi: "Koyambedu Grain Annex"
      },
      {
        cropName: "Red Chilli",
        category: "Spices",
        minPrice: 17800,
        maxPrice: 21200,
        modalPrice: 19800,
        trend: "increasing",
        changeAmount: 380,
        arrivalVolumeQuintals: 11e3,
        primaryMandi: "Koyambedu Spices Division"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 9.5,
      freightPerQuintalFromHyd: 520,
      availableTrucksCount: 130,
      routeHighway: "NH-16 & NH-65"
    }
  },
  // 11. MUMBAI / NAVI MUMBAI
  {
    id: "mumbai",
    name: "Mumbai / Navi Mumbai",
    shortCode: "BOM",
    nameHi: "\u092E\u0941\u0902\u092C\u0908",
    nameTe: "\u0C2E\u0C41\u0C02\u0C2C\u0C48",
    state: "Maharashtra",
    region: "Western India",
    lat: 19.076,
    lng: 72.8777,
    distanceFromHydKm: 710,
    weather: {
      temp: 29,
      condition: "Humid & Overcast",
      humidity: 80,
      roadCondition: "NH-65 & Mumbai-Pune Expressway Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 4,
      dailyArrivalsTotalQuintals: 74e3,
      primaryHubName: "Vashi APMC Terminal Market Complex",
      marketFeePercentage: 1.05,
      weighmentType: "High-Speed Automated Weighbridges"
    },
    mandis: [
      {
        id: "mandi-bom-vashi",
        name: "Vashi APMC Market Complex",
        type: "Terminal Market",
        locationArea: "Sector 19, Vashi, Navi Mumbai",
        timings: "03:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 6500,
        enamConnected: true,
        activeTradersCount: 1600,
        contactNumber: "+91 22 2788 1234"
      }
    ],
    cropPrices: [
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2250,
        maxPrice: 2980,
        modalPrice: 2680,
        trend: "increasing",
        changeAmount: 220,
        arrivalVolumeQuintals: 24e3,
        primaryMandi: "Vashi APMC Vegetable Section"
      },
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1980,
        maxPrice: 2680,
        modalPrice: 2380,
        trend: "increasing",
        changeAmount: 150,
        arrivalVolumeQuintals: 28e3,
        primaryMandi: "Vashi APMC Onion & Potato Market"
      },
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7200,
        maxPrice: 7700,
        modalPrice: 7520,
        trend: "increasing",
        changeAmount: 110,
        arrivalVolumeQuintals: 16500,
        primaryMandi: "Vashi Commodity Exchange Wing"
      },
      {
        cropName: "Wheat",
        category: "Cereal",
        minPrice: 2450,
        maxPrice: 2750,
        modalPrice: 2620,
        trend: "stable",
        changeAmount: 20,
        arrivalVolumeQuintals: 18e3,
        primaryMandi: "Vashi Grain Market"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 12,
      freightPerQuintalFromHyd: 610,
      availableTrucksCount: 180,
      routeHighway: "NH-65 via Solapur \u2013 Pune \u2013 Mumbai Expressway"
    }
  },
  // 12. PUNE
  {
    id: "pune",
    name: "Pune",
    shortCode: "PNQ",
    nameHi: "\u092A\u0941\u0923\u0947",
    nameTe: "\u0C2A\u0C41\u0C23\u0C46",
    state: "Maharashtra",
    region: "Western India",
    lat: 18.5204,
    lng: 73.8567,
    distanceFromHydKm: 560,
    weather: {
      temp: 27,
      condition: "Breezy & Mild",
      humidity: 62,
      roadCondition: "NH-65 Hyderabad-Solapur-Pune Corridor (Fast 4-Lane)"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 48e3,
      primaryHubName: "Shree Chhatrapati Shivaji Market Yard (Gultekdi)",
      marketFeePercentage: 1,
      weighmentType: "e-NAM Integrated Electronic Scales"
    },
    mandis: [
      {
        id: "mandi-pnq-gultekdi",
        name: "Gultekdi APMC Market Yard",
        type: "Terminal Market",
        locationArea: "Gultekdi, Pune",
        timings: "04:00 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 3900,
        enamConnected: true,
        activeTradersCount: 880,
        contactNumber: "+91 20 2426 1234"
      },
      {
        id: "mandi-pnq-pimpri",
        name: "Pimpri Wholesale Vegetable Mandi",
        type: "Wholesale",
        locationArea: "Pimpri-Chinchwad, Pune",
        timings: "05:00 AM \u2013 12:00 PM",
        dailyArrivalTonnes: 1450,
        enamConnected: true,
        activeTradersCount: 420,
        contactNumber: "+91 20 2742 5566"
      },
      {
        id: "mandi-pnq-hadapsar",
        name: "Hadapsar Vegetable Sub-Yard",
        type: "Wholesale",
        locationArea: "Hadapsar, Pune",
        timings: "04:30 AM \u2013 11:30 AM",
        dailyArrivalTonnes: 1100,
        enamConnected: true,
        activeTradersCount: 310,
        contactNumber: "+91 20 2687 3412"
      },
      {
        id: "mandi-pnq-manchar",
        name: "Manchar Potato & Veg Yard",
        type: "APMC Yard",
        locationArea: "Manchar, Pune Rural",
        timings: "06:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 2200,
        enamConnected: true,
        activeTradersCount: 260,
        contactNumber: "+91 2135 222144"
      }
    ],
    cropPrices: [
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 1900,
        maxPrice: 2500,
        modalPrice: 2240,
        trend: "increasing",
        changeAmount: 130,
        arrivalVolumeQuintals: 26e3,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2100,
        maxPrice: 2750,
        modalPrice: 2480,
        trend: "increasing",
        changeAmount: 160,
        arrivalVolumeQuintals: 19500,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Potato",
        category: "Vegetable",
        minPrice: 1600,
        maxPrice: 2100,
        modalPrice: 1850,
        trend: "stable",
        changeAmount: 40,
        arrivalVolumeQuintals: 18200,
        primaryMandi: "Manchar Potato & Veg Yard"
      },
      {
        cropName: "Green Chilli",
        category: "Vegetable",
        minPrice: 3600,
        maxPrice: 4800,
        modalPrice: 4200,
        trend: "increasing",
        changeAmount: 220,
        arrivalVolumeQuintals: 6400,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Ginger",
        category: "Vegetable",
        minPrice: 7400,
        maxPrice: 9100,
        modalPrice: 8200,
        trend: "increasing",
        changeAmount: 350,
        arrivalVolumeQuintals: 3200,
        primaryMandi: "Gultekdi Spice & Veg Section"
      },
      {
        cropName: "Garlic",
        category: "Vegetable",
        minPrice: 12e3,
        maxPrice: 15200,
        modalPrice: 13500,
        trend: "stable",
        changeAmount: 100,
        arrivalVolumeQuintals: 2800,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Cauliflower",
        category: "Vegetable",
        minPrice: 1750,
        maxPrice: 2400,
        modalPrice: 2100,
        trend: "decreasing",
        changeAmount: -90,
        arrivalVolumeQuintals: 7800,
        primaryMandi: "Pimpri Wholesale Vegetable Mandi"
      },
      {
        cropName: "Cabbage",
        category: "Vegetable",
        minPrice: 1200,
        maxPrice: 1700,
        modalPrice: 1450,
        trend: "stable",
        changeAmount: 20,
        arrivalVolumeQuintals: 8600,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Capsicum",
        category: "Vegetable",
        minPrice: 3100,
        maxPrice: 4200,
        modalPrice: 3600,
        trend: "increasing",
        changeAmount: 180,
        arrivalVolumeQuintals: 5200,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Brinjal",
        category: "Vegetable",
        minPrice: 1400,
        maxPrice: 2100,
        modalPrice: 1750,
        trend: "increasing",
        changeAmount: 110,
        arrivalVolumeQuintals: 6100,
        primaryMandi: "Hadapsar Vegetable Sub-Yard"
      },
      {
        cropName: "Okra",
        category: "Vegetable",
        minPrice: 2400,
        maxPrice: 3400,
        modalPrice: 2900,
        trend: "increasing",
        changeAmount: 150,
        arrivalVolumeQuintals: 4900,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Spinach (Palak)",
        category: "Vegetable",
        minPrice: 1300,
        maxPrice: 1950,
        modalPrice: 1600,
        trend: "decreasing",
        changeAmount: -60,
        arrivalVolumeQuintals: 3800,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Coriander",
        category: "Vegetable",
        minPrice: 1800,
        maxPrice: 2800,
        modalPrice: 2300,
        trend: "increasing",
        changeAmount: 210,
        arrivalVolumeQuintals: 4100,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Fenugreek (Methi)",
        category: "Vegetable",
        minPrice: 1700,
        maxPrice: 2600,
        modalPrice: 2150,
        trend: "increasing",
        changeAmount: 120,
        arrivalVolumeQuintals: 3400,
        primaryMandi: "Hadapsar Vegetable Sub-Yard"
      },
      {
        cropName: "Green Peas",
        category: "Vegetable",
        minPrice: 4200,
        maxPrice: 5600,
        modalPrice: 4800,
        trend: "decreasing",
        changeAmount: -150,
        arrivalVolumeQuintals: 6700,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Ridge Gourd",
        category: "Vegetable",
        minPrice: 2600,
        maxPrice: 3600,
        modalPrice: 3100,
        trend: "stable",
        changeAmount: 30,
        arrivalVolumeQuintals: 3100,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Bitter Gourd",
        category: "Vegetable",
        minPrice: 2900,
        maxPrice: 3900,
        modalPrice: 3400,
        trend: "increasing",
        changeAmount: 140,
        arrivalVolumeQuintals: 2800,
        primaryMandi: "Pimpri Wholesale Vegetable Mandi"
      },
      {
        cropName: "Carrot",
        category: "Vegetable",
        minPrice: 2200,
        maxPrice: 3100,
        modalPrice: 2650,
        trend: "stable",
        changeAmount: 20,
        arrivalVolumeQuintals: 5300,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Cucumber",
        category: "Vegetable",
        minPrice: 1500,
        maxPrice: 2200,
        modalPrice: 1850,
        trend: "decreasing",
        changeAmount: -70,
        arrivalVolumeQuintals: 4600,
        primaryMandi: "Hadapsar Vegetable Sub-Yard"
      },
      {
        cropName: "Bottle Gourd",
        category: "Vegetable",
        minPrice: 1400,
        maxPrice: 2e3,
        modalPrice: 1700,
        trend: "stable",
        changeAmount: 10,
        arrivalVolumeQuintals: 3900,
        primaryMandi: "Gultekdi APMC Yard"
      },
      {
        cropName: "Maize",
        category: "Cereal",
        minPrice: 2150,
        maxPrice: 2420,
        modalPrice: 2310,
        trend: "stable",
        changeAmount: 30,
        arrivalVolumeQuintals: 9500,
        primaryMandi: "Gultekdi Grain Section"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 9,
      freightPerQuintalFromHyd: 490,
      availableTrucksCount: 115,
      routeHighway: "NH-65 Direct Corridor"
    }
  },
  // 13. DELHI / NCR
  {
    id: "delhi",
    name: "Delhi / NCR",
    shortCode: "DEL",
    nameHi: "\u0926\u093F\u0932\u094D\u0932\u0940",
    nameTe: "\u0C22\u0C3F\u0C32\u0C4D\u0C32\u0C40",
    state: "Delhi NCR",
    region: "North India",
    lat: 28.7041,
    lng: 77.1025,
    distanceFromHydKm: 1570,
    weather: {
      temp: 28,
      condition: "Hazy Sun",
      humidity: 55,
      roadCondition: "NH-44 North-South National Highway Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 4,
      dailyArrivalsTotalQuintals: 92e3,
      primaryHubName: "Azadpur Mandi (Asia Largest Fruit & Vegetable Hub)",
      marketFeePercentage: 1,
      weighmentType: "High-Capacity Automated Sensor Weighbridges"
    },
    mandis: [
      {
        id: "mandi-del-azadpur",
        name: "Azadpur Wholesale Mandi",
        type: "Terminal Market",
        locationArea: "GT Karnal Road, Azadpur, Delhi",
        timings: "02:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 8500,
        enamConnected: true,
        activeTradersCount: 2400,
        contactNumber: "+91 11 2767 1122"
      },
      {
        id: "mandi-del-ghazipur",
        name: "Ghazipur APMC Market Yard",
        type: "Wholesale",
        locationArea: "Ghazipur, East Delhi",
        timings: "03:30 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 2800,
        enamConnected: true,
        activeTradersCount: 650,
        contactNumber: "+91 11 2277 8899"
      }
    ],
    cropPrices: [
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2400,
        maxPrice: 3200,
        modalPrice: 2850,
        trend: "increasing",
        changeAmount: 260,
        arrivalVolumeQuintals: 32e3,
        primaryMandi: "Azadpur Mandi"
      },
      {
        cropName: "Onion",
        category: "Vegetable",
        minPrice: 2100,
        maxPrice: 2850,
        modalPrice: 2520,
        trend: "increasing",
        changeAmount: 180,
        arrivalVolumeQuintals: 36e3,
        primaryMandi: "Azadpur Mandi"
      },
      {
        cropName: "Wheat",
        category: "Cereal",
        minPrice: 2420,
        maxPrice: 2780,
        modalPrice: 2640,
        trend: "stable",
        changeAmount: 15,
        arrivalVolumeQuintals: 28e3,
        primaryMandi: "Ghazipur Grain Market"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2600,
        maxPrice: 3100,
        modalPrice: 2880,
        trend: "increasing",
        changeAmount: 90,
        arrivalVolumeQuintals: 25e3,
        primaryMandi: "Narela & Azadpur Grain Hub"
      },
      {
        cropName: "Red Chilli",
        category: "Spices",
        minPrice: 18500,
        maxPrice: 22e3,
        modalPrice: 20600,
        trend: "increasing",
        changeAmount: 450,
        arrivalVolumeQuintals: 14e3,
        primaryMandi: "Khari Baoli Spice Hub"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 26,
      freightPerQuintalFromHyd: 950,
      availableTrucksCount: 220,
      routeHighway: "NH-44 North-South Grand Trunk Corridor"
    }
  },
  // 14. NAGPUR
  {
    id: "nagpur",
    name: "Nagpur",
    shortCode: "NGP",
    nameHi: "\u0928\u093E\u0917\u092A\u0941\u0930",
    nameTe: "\u0C28\u0C3E\u0C17\u0C4D\u200C\u0C2A\u0C42\u0C30\u0C4D",
    state: "Maharashtra",
    region: "Western India",
    lat: 21.1458,
    lng: 79.0882,
    distanceFromHydKm: 500,
    weather: {
      temp: 32,
      condition: "Sunny",
      humidity: 48,
      roadCondition: "NH-44 Direct Corridor (4-Lane Expressway)"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 44e3,
      primaryHubName: "Kalamna Wholesale Agricultural Market Yard",
      marketFeePercentage: 1.05,
      weighmentType: "Certified Electronic Scales"
    },
    mandis: [
      {
        id: "mandi-ngp-kalamna",
        name: "Kalamna Wholesale Market Yard",
        type: "Terminal Market",
        locationArea: "Kalamna, Nagpur",
        timings: "04:00 AM \u2013 02:00 PM",
        dailyArrivalTonnes: 3400,
        enamConnected: true,
        activeTradersCount: 780,
        contactNumber: "+91 712 268 1122"
      }
    ],
    cropPrices: [
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7150,
        maxPrice: 7650,
        modalPrice: 7460,
        trend: "increasing",
        changeAmount: 100,
        arrivalVolumeQuintals: 18500,
        primaryMandi: "Kalamna Cotton Yard"
      },
      {
        cropName: "Wheat",
        category: "Cereal",
        minPrice: 2380,
        maxPrice: 2680,
        modalPrice: 2540,
        trend: "stable",
        changeAmount: 15,
        arrivalVolumeQuintals: 16e3,
        primaryMandi: "Kalamna Grain Section"
      },
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2450,
        maxPrice: 2780,
        modalPrice: 2620,
        trend: "increasing",
        changeAmount: 40,
        arrivalVolumeQuintals: 14e3,
        primaryMandi: "Kalamna APMC Yard"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 7.8,
      freightPerQuintalFromHyd: 430,
      availableTrucksCount: 95,
      routeHighway: "NH-44 Corridor"
    }
  },
  // 15. AHMEDABAD
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    shortCode: "AMD",
    nameHi: "\u0905\u0939\u092E\u0926\u093E\u092C\u093E\u0926",
    nameTe: "\u0C05\u0C39\u0C4D\u0C2E\u0C26\u0C3E\u0C2C\u0C3E\u0C26\u0C4D",
    state: "Gujarat",
    region: "Western India",
    lat: 23.0225,
    lng: 72.5714,
    distanceFromHydKm: 1050,
    weather: {
      temp: 33,
      condition: "Dry & Clear",
      humidity: 42,
      roadCondition: "NH-48 & Western Express Highway"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 52e3,
      primaryHubName: "Jamalpur Wholesale APMC Yard",
      marketFeePercentage: 1,
      weighmentType: "Integrated e-NAM Electronic Weighbridges"
    },
    mandis: [
      {
        id: "mandi-amd-jamalpur",
        name: "Jamalpur Wholesale Market",
        type: "Wholesale",
        locationArea: "Jamalpur, Ahmedabad",
        timings: "04:00 AM \u2013 01:00 PM",
        dailyArrivalTonnes: 3900,
        enamConnected: true,
        activeTradersCount: 890,
        contactNumber: "+91 79 2535 6789"
      }
    ],
    cropPrices: [
      {
        cropName: "Cotton",
        category: "Cash Crop",
        minPrice: 7250,
        maxPrice: 7800,
        modalPrice: 7600,
        trend: "increasing",
        changeAmount: 140,
        arrivalVolumeQuintals: 22e3,
        primaryMandi: "APMC Vasna & Jamalpur"
      },
      {
        cropName: "Wheat",
        category: "Cereal",
        minPrice: 2480,
        maxPrice: 2820,
        modalPrice: 2680,
        trend: "increasing",
        changeAmount: 50,
        arrivalVolumeQuintals: 19500,
        primaryMandi: "Jamalpur Grain Market"
      },
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2050,
        maxPrice: 2700,
        modalPrice: 2420,
        trend: "increasing",
        changeAmount: 110,
        arrivalVolumeQuintals: 14e3,
        primaryMandi: "Jamalpur Vegetable Market"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 18,
      freightPerQuintalFromHyd: 740,
      availableTrucksCount: 105,
      routeHighway: "NH-65 to Pune then NH-48 to Gujarat"
    }
  },
  // 16. KOLKATA
  {
    id: "kolkata",
    name: "Kolkata",
    shortCode: "CCU",
    nameHi: "\u0915\u094B\u0932\u0915\u093E\u0924\u093E",
    nameTe: "\u0C15\u0C4B\u0C32\u0C4D\u200C\u0C15\u0C24\u0C3E",
    state: "West Bengal",
    region: "East India",
    lat: 22.5726,
    lng: 88.3639,
    distanceFromHydKm: 1480,
    weather: {
      temp: 30,
      condition: "Humid & Overcast",
      humidity: 82,
      roadCondition: "NH-16 Coastal Eastern Corridor"
    },
    apmcOverview: {
      totalActiveMandis: 3,
      dailyArrivalsTotalQuintals: 65e3,
      primaryHubName: "Posta Wholesale Bazaar & Mechua Market",
      marketFeePercentage: 1,
      weighmentType: "Direct Electronic Weighment"
    },
    mandis: [
      {
        id: "mandi-ccu-posta",
        name: "Posta Wholesale Bazaar",
        type: "Terminal Market",
        locationArea: "Posta, Burrabazar, Kolkata",
        timings: "03:30 AM \u2013 03:00 PM",
        dailyArrivalTonnes: 4500,
        enamConnected: true,
        activeTradersCount: 1350,
        contactNumber: "+91 33 2270 4455"
      }
    ],
    cropPrices: [
      {
        cropName: "Rice (Paddy)",
        category: "Cereal",
        minPrice: 2520,
        maxPrice: 2950,
        modalPrice: 2780,
        trend: "increasing",
        changeAmount: 80,
        arrivalVolumeQuintals: 29e3,
        primaryMandi: "Posta Wholesale Grain Yard"
      },
      {
        cropName: "Tomato",
        category: "Vegetable",
        minPrice: 2200,
        maxPrice: 2900,
        modalPrice: 2600,
        trend: "increasing",
        changeAmount: 150,
        arrivalVolumeQuintals: 18e3,
        primaryMandi: "Koley Market Sealdah"
      },
      {
        cropName: "Red Chilli",
        category: "Spices",
        minPrice: 18200,
        maxPrice: 21800,
        modalPrice: 20200,
        trend: "increasing",
        changeAmount: 410,
        arrivalVolumeQuintals: 12500,
        primaryMandi: "Posta Spices Yard"
      }
    ],
    logisticsHub: {
      averageTransitHoursFromHyd: 24.5,
      freightPerQuintalFromHyd: 890,
      availableTrucksCount: 110,
      routeHighway: "NH-16 (Vijayawada \u2013 Visakhapatnam \u2013 Bhubaneswar \u2013 Kolkata)"
    }
  }
];
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
export function findNearestCity(lat, lng) {
  let nearestCity = CITIES_MARKET_DATA[0];
  let minDistance = calculateDistanceKm(lat, lng, nearestCity.lat, nearestCity.lng);
  for (const city of CITIES_MARKET_DATA) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }
  return { city: nearestCity, distanceKm: minDistance };
}
export function getCityById(cityId) {
  const found = CITIES_MARKET_DATA.find((c) => c.id.toLowerCase() === cityId.toLowerCase());
  return found || CITIES_MARKET_DATA[0];
}
