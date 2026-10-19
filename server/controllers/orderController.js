import Order from '../models/Order.js';
import Offer from '../models/Offer.js';
import CropLot from '../models/CropLot.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

export async function getAllOrders(req, res) {
  try {
    const { farmerId, buyerId, status } = req.query;

    if (isDbConnected()) {
      try {
        const filter = {};
        if (farmerId) filter.farmerId = farmerId;
        if (buyerId) filter.buyerId = buyerId;
        if (status && status !== 'All') filter.status = status;

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        return res.json(orders);
      } catch (e) {
        // Fallback
      }
    }

    let list = [...store.orders];
    if (farmerId) list = list.filter((o) => o.farmerId === farmerId);
    if (buyerId) list = list.filter((o) => o.buyerId === buyerId);
    if (status && status !== 'All') list = list.filter((o) => o.status === status);

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    if (isDbConnected()) {
      try {
        const order = await Order.findOne({ id: req.params.id });
        if (order) return res.json(order);
      } catch (e) {
        // Fallback
      }
    }

    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function createOrder(req, res) {
  try {
    const data = req.body;
    const orderId = data.id || `OD-${Date.now().toString().slice(-8)}`;

    const newOrder = {
      id: orderId,
      lotId: data.lotId || 'LOT-CUSTOM',
      crop: data.crop || 'Agricultural Produce',
      quantity: Number(data.quantity) || 10,
      unit: data.unit || 'Quintals',
      farmerId: data.farmerId || req.user?.id || 'usr-farmer-1',
      farmerName: data.farmerName || req.user?.name || 'Farmer',
      farmerPhone: data.farmerPhone || req.user?.phone || '+91 98480 23456',
      buyerId: data.buyerId || req.user?.id || 'usr-buyer-1',
      buyerName: data.buyerName || req.user?.name || 'Institutional Buyer',
      buyerCompany: data.buyerCompany || 'Commercial Procurement Desk',
      agreedPrice: Number(data.agreedPrice) || 2500,
      totalAmount: Number(data.totalAmount) || (Number(data.agreedPrice) || 2500) * (Number(data.quantity) || 10),
      currentStep: data.currentStep || 2,
      status: data.status || 'Order Confirmed',
      transportId: data.transportId || 'TRP-101',
      transporterName: data.transporterName || 'Express Agro Logistics Fleet',
      vehicleNumber: data.vehicleNumber || 'TS 03 UA 5678',
      vehicleType: data.vehicleType || 'Eicher Pro 14ft',
      pickupLocation: data.pickupLocation || 'Farmer Farm Yard',
      deliveryLocation: data.deliveryLocation || 'APMC Mandi Wholesale Yard',
      paymentStatus: data.paymentStatus || 'completed',
      paymentMethod: data.paymentMethod || 'UPI (PhonePe/GPay)',
      paymentType: data.paymentType || 'upi',
      itemImageUrl: data.itemImageUrl || '',
      deliveryAddress: data.deliveryAddress || null,
      driverDetails: data.driverDetails || {
        name: 'Ramu Yadav',
        phone: '+91 97001 88990',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 4.9,
        vehicleNumber: 'TS 03 UA 5678',
        vehicleType: 'Eicher Pro 14ft',
        currentLocationName: 'APMC Transit Highway (12.4 km away)',
        etaMinutes: 25,
        distanceRemainingKm: 12.4,
      },
      createdAt: new Date().toISOString(),
      blockchainTxHash: data.blockchainTxHash || (data.paymentType === 'blockchain' ? `0x${Math.random().toString(16).substring(2)}` : null),
      blockNumber: data.blockNumber || null,
      blockchainNetwork: data.blockchainNetwork || null,
      upiUtrNumber: data.upiUtrNumber,
      upiApp: data.upiApp,
      bankUtrNumber: data.bankUtrNumber,
    };

    store.orders.unshift(newOrder);

    if (data.lotId) {
      const targetLot = store.cropLots.find((l) => l.id === data.lotId);
      if (targetLot) targetLot.status = 'sold';
    }

    if (isDbConnected()) {
      try {
        await new Order(newOrder).save();
        if (data.lotId) {
          await CropLot.updateOne({ id: data.lotId }, { $set: { status: 'sold' } });
        }
      } catch (err) {
        console.warn('MongoDB save order notice:', err.message);
      }
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
}

export async function updateOrder(req, res) {
  try {
    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    Object.assign(order, req.body);

    if (isDbConnected()) {
      try {
        await Order.updateOne({ id: req.params.id }, { $set: req.body });
      } catch (e) {
        // non-blocking
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
}

// Offers
export async function getOffers(req, res) {
  try {
    const { lotId, farmerId, buyerId } = req.query;

    if (isDbConnected()) {
      try {
        const filter = {};
        if (lotId) filter.lotId = lotId;
        if (farmerId) filter.farmerId = farmerId;
        if (buyerId) filter.buyerId = buyerId;

        const offers = await Offer.find(filter).sort({ createdAt: -1 });
        return res.json(offers);
      } catch (e) {
        // Fallback
      }
    }

    let list = [...store.offers];
    if (lotId) list = list.filter((o) => o.lotId === lotId);
    if (farmerId) list = list.filter((o) => o.farmerId === farmerId);
    if (buyerId) list = list.filter((o) => o.buyerId === buyerId);

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
}

export async function createOffer(req, res) {
  try {
    const data = req.body;
    const offerId = `OFF-${Math.floor(100 + Math.random() * 900)}`;

    const newOffer = {
      id: offerId,
      lotId: data.lotId,
      crop: data.crop || 'Produce',
      quantity: Number(data.quantity) || 50,
      unit: data.unit || 'Quintals',
      farmerId: data.farmerId || 'farmer-user',
      farmerName: data.farmerName || 'Seller',
      buyerId: data.buyerId || req.user?.id || 'buyer-user',
      buyerName: data.buyerName || req.user?.name || 'Verified Buyer',
      buyerCompany: data.buyerCompany || req.user?.businessName || 'Verified Agro Traders',
      buyerVerified: true,
      offerPricePerQuintal: Number(data.offerPricePerQuintal) || 7300,
      totalAmount: Number(data.totalAmount) || (Number(data.offerPricePerQuintal) * Number(data.quantity)),
      status: 'pending',
      note: data.note || 'Standard purchase offer via KisanSetu direct payment.',
      createdAt: 'Just now',
    };

    store.offers.unshift(newOffer);

    if (isDbConnected()) {
      try {
        await new Offer(newOffer).save();
      } catch (e) {
        console.warn('MongoDB save offer notice:', e.message);
      }
    }

    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: error.message || 'Failed to submit offer' });
  }
}

export async function updateOffer(req, res) {
  try {
    const { status, counterPrice } = req.body;
    const offer = store.offers.find((o) => o.id === req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    offer.status = status;
    if (counterPrice) offer.counterPrice = counterPrice;

    if (status === 'accepted') {
      const lot = store.cropLots.find((l) => l.id === offer.lotId);
      if (lot) lot.status = 'sold';

      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        lotId: offer.lotId,
        crop: offer.crop,
        quantity: offer.quantity,
        unit: offer.unit,
        farmerId: offer.farmerId,
        farmerName: offer.farmerName,
        farmerPhone: lot?.farmerPhone || '+91 90000 00000',
        buyerId: offer.buyerId,
        buyerName: offer.buyerName,
        buyerCompany: offer.buyerCompany,
        agreedPrice: offer.offerPricePerQuintal,
        totalAmount: offer.totalAmount,
        currentStep: 1,
        status: 'Offer Accepted',
        pickupLocation: lot?.location || 'Telangana',
        deliveryLocation: 'Buyer Processing Facility',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      store.orders.unshift(newOrder);

      if (isDbConnected()) {
        try {
          await Offer.updateOne({ id: req.params.id }, { $set: { status, counterPrice } });
          await CropLot.updateOne({ id: offer.lotId }, { $set: { status: 'sold' } });
          await new Order(newOrder).save();
        } catch (e) {
          // non-blocking
        }
      }

      return res.json({ offer, order: newOrder });
    }

    if (isDbConnected()) {
      try {
        await Offer.updateOne({ id: req.params.id }, { $set: { status, counterPrice } });
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ offer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
}
