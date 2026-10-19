import User from './models/User.js';
import CropLot from './models/CropLot.js';
import Vegetable from './models/Vegetable.js';
import PriceHistory from './models/PriceHistory.js';
import CommunityPost from './models/CommunityPost.js';
import Transporter from './models/Transporter.js';
import Warehouse from './models/Warehouse.js';
import AdminQuery from './models/AdminQuery.js';

export async function seedInitialData() {
  try {
    // Ensure designated administrator account exists with correct email
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      // Check if old admin record exists by id — update it rather than insert duplicate
      const oldAdmin = await User.findOne({ id: 'usr-admin-primary' });
      if (oldAdmin) {
        await User.updateOne(
          { id: 'usr-admin-primary' },
          { $set: { email: adminEmail, role: 'admin', password: hashedPassword, isVerified: true } }
        );
        console.log('Migrated admin email to:', adminEmail);
      } else {
        const adminUser = new User({
          id: 'usr-admin-primary',
          uid: 'usr-admin-primary',
          name: 'Platform Administrator',
          displayName: 'Platform Administrator',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          isVerified: true,
          adminDepartment: 'Platform Security & Operations',
          clearanceLevel: 'Tier 1 Admin Access',
          location: 'Warangal, Telangana',
        });
        await adminUser.save();
        console.log('Seeded designated admin user:', adminEmail);
      }
    } else if (adminExists.role !== 'admin') {
      await User.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
      console.log('Upgraded admin role for:', adminEmail);
    }

    // Seed initial queries if empty
    try {
      const queryCount = await AdminQuery.countDocuments();
      if (queryCount === 0) {
        await AdminQuery.insertMany([
          {
            id: 'QRY-884210-101',
            name: 'Ramesh Patel',
            email: 'ramesh.farmer@kisansetu.com',
            phone: '+91 98480 23456',
            role: 'farmer',
            category: 'Price & Mandi Dispute',
            subject: 'Cotton MSP price realization issue at Warangal APMC',
            message: 'We delivered 45 quintals of long staple cotton on Friday. The weighbridge net deduction was recorded higher than standard moisture limits (8.5%). Requesting administrative verification of the mandi calibration log.',
            status: 'Pending',
            adminNotes: 'Assigned to APMC market committee inspector for weighbridge log verification.',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: 'QRY-773190-102',
            name: 'Suresh Reddy',
            email: 'suresh.reddy@fpo-telangana.org',
            phone: '+91 94401 55667',
            role: 'fpo',
            category: 'Account & Verification',
            subject: 'FPO Co-Op verification approval for new cold storage facility',
            message: 'Our FPO has registered a 500 MT capacity cold storage unit in Jangaon. We have submitted the WDRA accreditation papers. Please review and grant the verified partner badge on our portal profile.',
            status: 'In Progress',
            adminNotes: 'WDRA documentation received. Under review by Agricultural Marketing Directorate.',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
        ]);
        console.log('Seeded initial sample admin queries in MongoDB.');
      }
    } catch (qErr) {
      console.warn('Initial queries seed note:', qErr.message);
    }

    // 2. Seed Vegetables if empty
    const vegCount = await Vegetable.countDocuments();
    if (vegCount === 0) {
      const initialVegetables = [
        {
          id: 'veg-tomato-hybrid',
          name: 'Tomato (Hybrid Desi)',
          nameHi: 'टमाटर (देसी संकर)',
          nameTe: 'టమోటా (హైబ్రిడ్)',
          category: 'Fruit Vegetable',
          unit: 'kg',
          currentPrice: 24,
          previousPrice: 22,
          minPrice: 20,
          maxPrice: 28,
          market: 'Warangal APMC Enamamula Market',
          location: 'Warangal, Telangana',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
          description: 'Grade A fresh harvest arrivals, firm skin, standard 25kg crates',
          priceDate: new Date().toISOString().split('T')[0],
          arrivalVolume: 420,
          grade: 'Grade A',
          status: 'Active',
        },
        {
          id: 'veg-onion-nashik',
          name: 'Onion (Red Nashik)',
          nameHi: 'प्याज (नासिक लाल)',
          nameTe: 'ఉల్లిపాయ (ఎరుపు)',
          category: 'Allium & Bulb',
          unit: 'kg',
          currentPrice: 26,
          previousPrice: 28,
          minPrice: 22,
          maxPrice: 30,
          market: 'Warangal APMC Enamamula Market',
          location: 'Warangal, Telangana',
          image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80',
          description: 'Medium dry bulb, high shelf life, 50kg ventilated mesh bags',
          priceDate: new Date().toISOString().split('T')[0],
          arrivalVolume: 850,
          grade: 'Grade A',
          status: 'Active',
        },
        {
          id: 'veg-green-chilli-teja',
          name: 'Green Chilli (Guntur Teja)',
          nameHi: 'हरी मिर्च (गुंटूर तेजा)',
          nameTe: 'పచ్చిమిర్చి (తేజ)',
          category: 'Spices & Condiments',
          unit: 'kg',
          currentPrice: 65,
          previousPrice: 58,
          minPrice: 55,
          maxPrice: 75,
          market: 'Warangal APMC Enamamula Market',
          location: 'Warangal, Telangana',
          image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
          description: 'Deep green, high pungency, fresh stems intact',
          priceDate: new Date().toISOString().split('T')[0],
          arrivalVolume: 180,
          grade: 'Grade A',
          status: 'High Demand',
        },
        {
          id: 'veg-potato-jyoti',
          name: 'Potato (Jyoti / Kufri)',
          nameHi: 'आलू (कुफरी ज्योति)',
          nameTe: 'బంగాళాదుంప (జ్యోతి)',
          category: 'Root & Tuber',
          unit: 'kg',
          currentPrice: 22,
          previousPrice: 22,
          minPrice: 18,
          maxPrice: 25,
          market: 'Warangal APMC Enamamula Market',
          location: 'Warangal, Telangana',
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
          description: 'Clean uniform tubers, zero greening, ideal for storage',
          priceDate: new Date().toISOString().split('T')[0],
          arrivalVolume: 960,
          grade: 'Grade A',
          status: 'Active',
        },
        {
          id: 'veg-brinjal-round',
          name: 'Brinjal (Round Purple)',
          nameHi: 'बैंगन (गोल बैंगनी)',
          nameTe: 'వంకాయ (గుండ్రటి)',
          category: 'Fruit Vegetable',
          unit: 'kg',
          currentPrice: 28,
          previousPrice: 28,
          minPrice: 22,
          maxPrice: 34,
          market: 'Warangal APMC Enamamula Market',
          location: 'Warangal, Telangana',
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
          description: 'Glossy purple skin, seedless pulp, fresh calyx attached',
          priceDate: new Date().toISOString().split('T')[0],
          arrivalVolume: 310,
          grade: 'Grade A',
          status: 'Active',
        },
      ];

      await Vegetable.insertMany(initialVegetables);
      console.log('Seeded initial APMC vegetables catalog');

      // Seed initial price history
      await PriceHistory.create({
        id: 'vph-seed-01',
        vegetableId: 'veg-tomato-hybrid',
        vegetableName: 'Tomato (Hybrid Desi)',
        oldPrice: 22,
        newPrice: 24,
        arrivalVolume: 420,
        market: 'Warangal APMC Enamamula Market',
        changedBy: 'Suresh Babu (APMC Secretary)',
        role: 'market_admin',
        notes: 'Wholesale auction rate updated reflecting fresh harvest arrivals.',
        timestamp: new Date().toISOString(),
      });
    }

    // Clean up any legacy demo lots or demo posts if present
    await CropLot.deleteMany({ farmerId: { $in: ['usr-farmer-ramesh', 'usr-farmer-lakshmi', 'usr-farmer-venkata'] } });
    await CommunityPost.deleteMany({ authorId: { $in: ['usr-farmer-ramesh', 'usr-farmer-lakshmi'] } });
  } catch (error) {
    console.warn('Seed initial data notice:', error.message);
  }
}
