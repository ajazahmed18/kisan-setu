import { CityMarket, CityMarketCropPrice } from '../types';

export const CROP_PHOTOS: Record<string, string> = {
  // Vegetables
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
  'green chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
  brinjal: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop&q=80',
  eggplant: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop&q=80',
  okra: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&auto=format&fit=crop&q=80',
  'ladies finger': 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&auto=format&fit=crop&q=80',
  cauliflower: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80',
  cucumber: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&auto=format&fit=crop&q=80',
  capsicum: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80',
  'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80',
  'bitter gourd': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format&fit=crop&q=80',
  'bottle gourd': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format&fit=crop&q=80',
  'ridge gourd': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format&fit=crop&q=80',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',
  palak: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',
  coriander: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
  ginger: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&auto=format&fit=crop&q=80',
  'green peas': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&auto=format&fit=crop&q=80',
  peas: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&auto=format&fit=crop&q=80',
  radish: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80',
  beetroot: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&auto=format&fit=crop&q=80',
  'cluster beans': 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&auto=format&fit=crop&q=80',
  beans: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&auto=format&fit=crop&q=80',
  drumstick: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format&fit=crop&q=80',
  pumpkin: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=400&auto=format&fit=crop&q=80',
  lemon: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&auto=format&fit=crop&q=80',
  mint: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&auto=format&fit=crop&q=80',
  fenugreek: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',
  methi: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',

  // Non-vegetable crops
  cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80',
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
  rice: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=80',
  paddy: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=80',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
  'red chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
  turmeric: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  soybean: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&auto=format&fit=crop&q=80',
  groundnut: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400&auto=format&fit=crop&q=80',
  peanut: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?w=400&auto=format&fit=crop&q=80',
};

export function getCropPhoto(cropName: string): string {
  const name = cropName.toLowerCase();
  for (const [key, url] of Object.entries(CROP_PHOTOS)) {
    if (name.includes(key)) {
      return url;
    }
  }
  // Generic high-quality produce fallback
  return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80';
}

export interface MasterVegetableTemplate {
  cropName: string;
  teluguName?: string;
  hindiName?: string;
  baseMinPrice: number;
  baseMaxPrice: number;
  baseModalPrice: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeAmount: number;
  baseArrivalQuintals: number;
}

export const MASTER_VEGETABLES: MasterVegetableTemplate[] = [
  {
    cropName: 'Tomato',
    teluguName: 'టమాటా',
    hindiName: 'टमाटर',
    baseMinPrice: 2050,
    baseMaxPrice: 2700,
    baseModalPrice: 2420,
    trend: 'increasing',
    changeAmount: 110,
    baseArrivalQuintals: 14000,
  },
  {
    cropName: 'Onion',
    teluguName: 'ఉల్లిపాయ',
    hindiName: 'प्याज',
    baseMinPrice: 1850,
    baseMaxPrice: 2450,
    baseModalPrice: 2150,
    trend: 'increasing',
    changeAmount: 80,
    baseArrivalQuintals: 16500,
  },
  {
    cropName: 'Potato',
    teluguName: 'బంగాళాదుంప',
    hindiName: 'आलू',
    baseMinPrice: 1600,
    baseMaxPrice: 2000,
    baseModalPrice: 1800,
    trend: 'stable',
    changeAmount: 20,
    baseArrivalQuintals: 18200,
  },
  {
    cropName: 'Green Chilli',
    teluguName: 'పచ్చిమిర్చి',
    hindiName: 'हरी मिर्च',
    baseMinPrice: 4200,
    baseMaxPrice: 5400,
    baseModalPrice: 4800,
    trend: 'increasing',
    changeAmount: 200,
    baseArrivalQuintals: 8400,
  },
  {
    cropName: 'Brinjal / Eggplant',
    teluguName: 'వంకాయ',
    hindiName: 'बैंगन',
    baseMinPrice: 1450,
    baseMaxPrice: 2050,
    baseModalPrice: 1750,
    trend: 'increasing',
    changeAmount: 60,
    baseArrivalQuintals: 5200,
  },
  {
    cropName: 'Okra / Ladies Finger',
    teluguName: 'బెండకాయ',
    hindiName: 'भिंडी',
    baseMinPrice: 2500,
    baseMaxPrice: 3300,
    baseModalPrice: 2900,
    trend: 'increasing',
    changeAmount: 120,
    baseArrivalQuintals: 4600,
  },
  {
    cropName: 'Cauliflower',
    teluguName: 'కాలీఫ్లవర్',
    hindiName: 'फूलगोभी',
    baseMinPrice: 1750,
    baseMaxPrice: 2450,
    baseModalPrice: 2100,
    trend: 'increasing',
    changeAmount: 90,
    baseArrivalQuintals: 6200,
  },
  {
    cropName: 'Cabbage',
    teluguName: 'క్యాబేజీ',
    hindiName: 'पत्तागोभी',
    baseMinPrice: 1150,
    baseMaxPrice: 1550,
    baseModalPrice: 1350,
    trend: 'decreasing',
    changeAmount: -40,
    baseArrivalQuintals: 7100,
  },
  {
    cropName: 'Carrot',
    teluguName: 'క్యారెట్',
    hindiName: 'गाजर',
    baseMinPrice: 2200,
    baseMaxPrice: 3000,
    baseModalPrice: 2600,
    trend: 'increasing',
    changeAmount: 70,
    baseArrivalQuintals: 5800,
  },
  {
    cropName: 'Cucumber',
    teluguName: 'దోసకాయ',
    hindiName: 'खीरा',
    baseMinPrice: 1350,
    baseMaxPrice: 1950,
    baseModalPrice: 1650,
    trend: 'stable',
    changeAmount: 10,
    baseArrivalQuintals: 6800,
  },
  {
    cropName: 'Capsicum / Bell Pepper',
    teluguName: 'క్యాప్సికం',
    hindiName: 'शिमला मिर्च',
    baseMinPrice: 3400,
    baseMaxPrice: 4400,
    baseModalPrice: 3900,
    trend: 'increasing',
    changeAmount: 150,
    baseArrivalQuintals: 3400,
  },
  {
    cropName: 'Bitter Gourd',
    teluguName: 'కాకరకాయ',
    hindiName: 'करेला',
    baseMinPrice: 2700,
    baseMaxPrice: 3500,
    baseModalPrice: 3100,
    trend: 'decreasing',
    changeAmount: -80,
    baseArrivalQuintals: 2800,
  },
  {
    cropName: 'Bottle Gourd',
    teluguName: 'సొరకాయ',
    hindiName: 'लौकी',
    baseMinPrice: 1000,
    baseMaxPrice: 1500,
    baseModalPrice: 1250,
    trend: 'stable',
    changeAmount: 10,
    baseArrivalQuintals: 4200,
  },
  {
    cropName: 'Ridge Gourd',
    teluguName: 'బీరకాయ',
    hindiName: 'तोरई',
    baseMinPrice: 2450,
    baseMaxPrice: 3150,
    baseModalPrice: 2800,
    trend: 'increasing',
    changeAmount: 90,
    baseArrivalQuintals: 3100,
  },
  {
    cropName: 'Palak / Spinach',
    teluguName: 'పాలకూర',
    hindiName: 'पालक',
    baseMinPrice: 1100,
    baseMaxPrice: 1700,
    baseModalPrice: 1400,
    trend: 'stable',
    changeAmount: 0,
    baseArrivalQuintals: 2600,
  },
  {
    cropName: 'Coriander',
    teluguName: 'కొత్తిమీర',
    hindiName: 'धनिया',
    baseMinPrice: 1900,
    baseMaxPrice: 2700,
    baseModalPrice: 2300,
    trend: 'stable',
    changeAmount: 0,
    baseArrivalQuintals: 2100,
  },
  {
    cropName: 'Ginger',
    teluguName: 'అల్లం',
    hindiName: 'अदरक',
    baseMinPrice: 7600,
    baseMaxPrice: 9200,
    baseModalPrice: 8400,
    trend: 'increasing',
    changeAmount: 280,
    baseArrivalQuintals: 3600,
  },
  {
    cropName: 'Garlic',
    teluguName: 'వెల్లుల్లి',
    hindiName: 'लहसुन',
    baseMinPrice: 12000,
    baseMaxPrice: 15500,
    baseModalPrice: 13800,
    trend: 'increasing',
    changeAmount: 420,
    baseArrivalQuintals: 4100,
  },
  {
    cropName: 'Green Peas',
    teluguName: 'పచ్చి బఠానీ',
    hindiName: 'हरी मटर',
    baseMinPrice: 3800,
    baseMaxPrice: 4600,
    baseModalPrice: 4200,
    trend: 'increasing',
    changeAmount: 160,
    baseArrivalQuintals: 3900,
  },
  {
    cropName: 'Radish',
    teluguName: 'ముల్లంగి',
    hindiName: 'मूली',
    baseMinPrice: 1200,
    baseMaxPrice: 1700,
    baseModalPrice: 1450,
    trend: 'stable',
    changeAmount: 0,
    baseArrivalQuintals: 3300,
  },
  {
    cropName: 'Beetroot',
    teluguName: 'బీట్‌రూట్',
    hindiName: 'चुकंदर',
    baseMinPrice: 1650,
    baseMaxPrice: 2250,
    baseModalPrice: 1950,
    trend: 'increasing',
    changeAmount: 40,
    baseArrivalQuintals: 2700,
  },
  {
    cropName: 'Cluster Beans',
    teluguName: 'గోరుచిక్కుడు',
    hindiName: 'गवार फली',
    baseMinPrice: 2650,
    baseMaxPrice: 3450,
    baseModalPrice: 3050,
    trend: 'increasing',
    changeAmount: 80,
    baseArrivalQuintals: 2400,
  },
  {
    cropName: 'Drumstick / Moringa',
    teluguName: 'మునగకాయ',
    hindiName: 'सहजन',
    baseMinPrice: 4000,
    baseMaxPrice: 5200,
    baseModalPrice: 4600,
    trend: 'increasing',
    changeAmount: 180,
    baseArrivalQuintals: 1900,
  },
  {
    cropName: 'Pumpkin',
    teluguName: 'గుమ్మడికాయ',
    hindiName: 'कद्दू',
    baseMinPrice: 950,
    baseMaxPrice: 1350,
    baseModalPrice: 1150,
    trend: 'stable',
    changeAmount: 10,
    baseArrivalQuintals: 3800,
  },
  {
    cropName: 'Lemon',
    teluguName: 'నిమ్మకాయ',
    hindiName: 'नींबू',
    baseMinPrice: 4800,
    baseMaxPrice: 6000,
    baseModalPrice: 5400,
    trend: 'increasing',
    changeAmount: 220,
    baseArrivalQuintals: 2900,
  },
  {
    cropName: 'Mint Leaves',
    teluguName: 'పుదీనా',
    hindiName: 'पुदीना',
    baseMinPrice: 1500,
    baseMaxPrice: 2100,
    baseModalPrice: 1800,
    trend: 'stable',
    changeAmount: 0,
    baseArrivalQuintals: 1600,
  },
  {
    cropName: 'Fenugreek Leaves / Methi',
    teluguName: 'మెంతి కూర',
    hindiName: 'मेथी',
    baseMinPrice: 1300,
    baseMaxPrice: 1900,
    baseModalPrice: 1600,
    trend: 'stable',
    changeAmount: 0,
    baseArrivalQuintals: 1800,
  },
];

/**
 * Returns complete commodity prices for any city, ensuring that all 25+ fresh vegetables
 * are available alongside any existing non-vegetable crops (Cotton, Wheat, Rice, Spices, etc.).
 */
export function getCompleteCommodityPricesForCity(city: CityMarket): CityMarketCropPrice[] {
  // Identify primary wholesale vegetable market for this city
  const vegMandi =
    city.mandis.find((m) => m.type === 'Wholesale' || m.name.toLowerCase().includes('vegetable'))?.name ||
    city.mandis[0]?.name ||
    `${city.name} Wholesale Sabzi Mandi`;

  const existingPrices = city.cropPrices || [];

  // Map of existing crops by standardized key
  const existingMap = new Map<string, CityMarketCropPrice>();
  existingPrices.forEach((p) => {
    const key = p.cropName.toLowerCase().split('(')[0].trim();
    existingMap.set(key, p);
  });

  const finalPrices: CityMarketCropPrice[] = [];

  // 1. First add any existing non-vegetable crops (Cotton, Wheat, Rice, etc.)
  existingPrices.forEach((p) => {
    if (p.category !== 'Vegetable') {
      finalPrices.push(p);
    }
  });

  // 2. Add ALL vegetables
  MASTER_VEGETABLES.forEach((veg) => {
    const key = veg.cropName.toLowerCase();
    const existing =
      existingMap.get(key) ||
      Array.from(existingMap.entries()).find(([k]) => key.includes(k) || k.includes(key))?.[1];

    if (existing) {
      // Use existing city price
      finalPrices.push(existing);
    } else {
      // Create city-tailored vegetable entry
      // Warangal / Telangana language tailoring if applicable
      const isTelangana = city.state === 'Telangana' || city.state === 'Andhra Pradesh';
      const displayName = isTelangana && veg.teluguName
        ? `${veg.cropName} (${veg.teluguName})`
        : veg.cropName;

      finalPrices.push({
        cropName: displayName,
        category: 'Vegetable',
        minPrice: veg.baseMinPrice,
        maxPrice: veg.baseMaxPrice,
        modalPrice: veg.baseModalPrice,
        trend: veg.trend,
        changeAmount: veg.changeAmount,
        arrivalVolumeQuintals: veg.baseArrivalQuintals,
        primaryMandi: vegMandi,
      });
    }
  });

  return finalPrices;
}
