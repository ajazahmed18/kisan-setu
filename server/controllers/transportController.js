import Transporter from '../models/Transporter.js';
import Warehouse from '../models/Warehouse.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

export async function getTransporters(req, res) {
  try {
    if (isDbConnected()) {
      try {
        const list = await Transporter.find();
        if (list && list.length > 0) return res.json(list);
      } catch (e) {
        // Fallback
      }
    }
    res.json(store.transporters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transporters' });
  }
}

export async function getWarehouses(req, res) {
  try {
    if (isDbConnected()) {
      try {
        const list = await Warehouse.find();
        if (list && list.length > 0) return res.json(list);
      } catch (e) {
        // Fallback
      }
    }
    res.json(store.warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
}

export async function bookTransport(req, res) {
  try {
    const { transporterId, pickup, destination } = req.body;
    const transporter = store.transporters.find((t) => t.id === transporterId);
    if (!transporter) return res.status(404).json({ error: 'Transporter not found' });

    const bookingId = `TRP-BK-${Date.now().toString().slice(-6)}`;
    const newBooking = {
      id: bookingId,
      bookingId,
      farmerId: req.body.farmerId || 'usr-farmer',
      farmerName: req.body.farmerName || 'Farmer',
      farmerPhone: req.body.farmerPhone || '+91 98480 23456',
      crop: req.body.crop || 'Cotton',
      variety: req.body.variety || 'APMC Grade A',
      quantity: req.body.quantity || 30,
      unit: req.body.unit || 'Quintals',
      pickupLocation: typeof pickup === 'object' ? pickup : { address: pickup || 'Farm Gate, Warangal', district: 'Warangal' },
      dropLocation: typeof destination === 'object' ? destination : { name: destination || 'Warangal APMC Market Yard', address: destination || 'Warangal APMC', city: 'Warangal' },
      pickupDistanceKm: 4.2,
      tripDistanceKm: 28,
      estimatedFare: Math.max(1800, (req.body.quantity || 30) * 85),
      vehicleTypeRequired: req.body.vehicleType || transporter.vehicleType || 'Heavy Lorry (10 Ton)',
      pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'incoming',
      paymentType: 'cod',
      createdAt: new Date().toISOString(),
    };

    store.transportBookings.unshift(newBooking);

    res.json({
      success: true,
      booking: newBooking,
      transporterName: transporter.name,
      vehicleType: transporter.vehicleType,
      estimatedDistanceKm: 28,
      estimatedCost: newBooking.estimatedFare,
      pickup,
      destination,
      status: 'Dispatched to Transporter',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book transport' });
  }
}

export async function getTransportBookings(req, res) {
  try {
    res.json(store.transportBookings || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transport bookings' });
  }
}

export async function createTransportBooking(req, res) {
  try {
    const data = req.body;
    const bookingId = `TRP-BK-${Date.now().toString().slice(-6)}`;
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const qty = Number(data.quantity) || 20;
    const fare = Number(data.estimatedFare) || Math.max(1500, Math.round(qty * 90 + 500));

    const newBooking = {
      id: bookingId,
      bookingId,
      farmerId: data.farmerId || 'usr-farmer',
      farmerName: data.farmerName || 'Farmer',
      farmerPhone: data.farmerPhone || '+91 98480 23456',
      crop: data.crop || 'Produce',
      variety: data.variety || 'Standard Grade',
      quantity: qty,
      unit: data.unit || 'Quintals',
      pickupLocation: data.pickupLocation || { address: 'Farm Gate, Warangal', district: 'Warangal' },
      dropLocation: data.dropLocation || { name: 'Warangal APMC Yard', address: 'APMC Market Road', city: 'Warangal' },
      pickupDistanceKm: Number(data.pickupDistanceKm) || 3.5,
      tripDistanceKm: Number(data.tripDistanceKm) || 25,
      estimatedFare: fare,
      vehicleTypeRequired: data.vehicleTypeRequired || (qty > 10 ? 'Heavy Lorry (10 Ton)' : 'Tata 407 (2.5 Ton)'),
      pickupOtp: otp,
      status: 'incoming',
      paymentType: data.paymentType || 'cod',
      createdAt: new Date().toISOString(),
    };

    store.transportBookings.unshift(newBooking);
    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transport booking' });
  }
}

export async function updateTransportBooking(req, res) {
  try {
    const { id } = req.params;
    const booking = store.transportBookings.find((b) => b.id === id || b.bookingId === id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    Object.assign(booking, req.body);
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transport booking' });
  }
}

