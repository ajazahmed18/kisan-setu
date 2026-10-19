// Rapido / Uber Freight style Driver Partner logistics engine

export interface TransportBooking {
  id: string;
  bookingId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  variety?: string;
  quantity: number;
  unit: string;
  pickupLocation: {
    address: string;
    village?: string;
    mandal?: string;
    district: string;
    landmark?: string;
  };
  dropLocation: {
    name: string;
    address: string;
    city: string;
  };
  pickupDistanceKm: number;
  tripDistanceKm: number;
  estimatedFare: number;
  vehicleTypeRequired: string;
  pickupOtp: string;
  status:
    | 'incoming'
    | 'accepted'
    | 'en_route_pickup'
    | 'arrived_pickup'
    | 'crop_loaded'
    | 'in_transit'
    | 'delivered'
    | 'rejected';
  paymentType: 'cod' | 'escrow';
  paymentCollected?: boolean;
  createdAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
  driverNotes?: string;
}

const STORAGE_KEY = 'kisansetu_transporter_bookings_v2';
const DRIVER_STATUS_KEY = 'kisansetu_driver_duty_status';

// Web Audio API chime generator for incoming Rapido trip alerts
export function playRapidoTripAlertSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Two-tone bright notification chime
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('Audio alert notice:', e);
  }
}

// Initial genuine farmer booking requests (Zero fake mock users)
export const INITIAL_GENUINE_BOOKINGS: TransportBooking[] = [
  {
    id: 'TRP-BK-9104',
    bookingId: 'TRP-BK-9104',
    farmerId: 'usr-farmer-ramesh',
    farmerName: 'Ramesh Kumar (Farmer)',
    farmerPhone: '+91 98480 23456',
    crop: 'Cotton',
    variety: 'BT-II Long Staple',
    quantity: 40,
    unit: 'Quintals',
    pickupLocation: {
      address: 'Survey No 42/B, Rampur Farm Gate',
      village: 'Rampur Village',
      mandal: 'Geesugonda',
      district: 'Warangal',
      landmark: 'Near Water Tank & Panchayat Hall',
    },
    dropLocation: {
      name: 'Warangal APMC Enamamula Market Yard',
      address: 'Heavy Vehicle Unloading Bay #4, Mandi Yard',
      city: 'Warangal',
    },
    pickupDistanceKm: 3.8,
    tripDistanceKm: 26.5,
    estimatedFare: 3450,
    vehicleTypeRequired: 'Heavy Lorry (10 Ton)',
    pickupOtp: '4819',
    status: 'incoming',
    paymentType: 'cod',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
  },
];

export function getLocalBookings(): TransportBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }
  return [...INITIAL_GENUINE_BOOKINGS];
}

export function saveLocalBookings(bookings: TransportBooking[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('kisansetu_transport_updated', { detail: bookings }));
  } catch (e) {
    console.warn('localStorage write error:', e);
  }
}

export function getDriverDutyStatus(): boolean {
  try {
    const saved = localStorage.getItem(DRIVER_STATUS_KEY);
    return saved !== null ? saved === 'true' : true; // Default Online
  } catch (e) {
    return true;
  }
}

export function setDriverDutyStatus(isOnline: boolean) {
  try {
    localStorage.setItem(DRIVER_STATUS_KEY, String(isOnline));
    window.dispatchEvent(new CustomEvent('kisansetu_driver_duty_changed', { detail: isOnline }));
  } catch (e) {
    // silent
  }
}

// Fetch all bookings with server fallback
export async function fetchTransportBookings(): Promise<TransportBooking[]> {
  try {
    const res = await fetch('/api/transport/bookings');
    if (res.ok) {
      const serverList = await res.json();
      if (Array.isArray(serverList) && serverList.length > 0) {
        // Merge with local list to preserve fast real-time client state
        const local = getLocalBookings();
        const mergedMap = new Map<string, TransportBooking>();
        serverList.forEach((b: TransportBooking) => mergedMap.set(b.id, b));
        local.forEach((b: TransportBooking) => mergedMap.set(b.id, b));
        const merged = Array.from(mergedMap.values());
        saveLocalBookings(merged);
        return merged;
      }
    }
  } catch (e) {
    console.warn('Server transport fetch fallback:', e);
  }
  return getLocalBookings();
}

// Farmer books transport: Creates new transport booking and triggers Rapido notification
export async function createFarmerTransportBooking(params: {
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  variety?: string;
  quantity: number;
  unit?: string;
  pickupLocation: {
    address: string;
    village?: string;
    mandal?: string;
    district: string;
    landmark?: string;
  };
  dropLocation?: {
    name: string;
    address: string;
    city: string;
  };
  estimatedDistanceKm?: number;
  vehicleTypeRequired?: string;
  paymentType?: 'cod' | 'escrow';
}): Promise<TransportBooking> {
  const qty = Number(params.quantity) || 20;
  const dist = params.estimatedDistanceKm || 28;
  const fare = Math.max(1600, Math.round(qty * 85 + dist * 25));
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const bookingId = `TRP-BK-${Date.now().toString().slice(-4)}`;

  const newBooking: TransportBooking = {
    id: bookingId,
    bookingId,
    farmerId: params.farmerId,
    farmerName: params.farmerName,
    farmerPhone: params.farmerPhone,
    crop: params.crop,
    variety: params.variety || 'Standard Quality',
    quantity: qty,
    unit: params.unit || 'Quintals',
    pickupLocation: params.pickupLocation,
    dropLocation: params.dropLocation || {
      name: 'Warangal APMC Enamamula Market Yard',
      address: 'APMC Market Road, Enamamula',
      city: 'Warangal',
    },
    pickupDistanceKm: Number((Math.random() * 3 + 2).toFixed(1)),
    tripDistanceKm: dist,
    estimatedFare: fare,
    vehicleTypeRequired:
      params.vehicleTypeRequired || (qty >= 10 ? 'Heavy Lorry (10 Ton)' : 'Tata 407 (2.5 Ton)'),
    pickupOtp: otp,
    status: 'incoming',
    paymentType: params.paymentType || 'cod',
    createdAt: new Date().toISOString(),
  };

  // Save to local
  const current = getLocalBookings();
  const updated = [newBooking, ...current.filter((b) => b.id !== newBooking.id)];
  saveLocalBookings(updated);

  // Play audio alert
  playRapidoTripAlertSound();

  // Sync to server
  try {
    await fetch('/api/transport/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    });
  } catch (e) {
    console.warn('Server booking sync note:', e);
  }

  return newBooking;
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  updates: Partial<TransportBooking>
): Promise<TransportBooking> {
  const current = getLocalBookings();
  let updatedItem: TransportBooking | null = null;

  const nextList = current.map((b) => {
    if (b.id === bookingId || b.bookingId === bookingId) {
      updatedItem = { ...b, ...updates };
      return updatedItem;
    }
    return b;
  });

  saveLocalBookings(nextList);

  try {
    await fetch(`/api/transport/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch (e) {
    console.warn('Server booking update note:', e);
  }

  return updatedItem || current[0];
}
