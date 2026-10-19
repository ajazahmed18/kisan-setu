import { calculateCommissions } from '../types.js';
import { INITIAL_SELL_REQUESTS, SEED_FPO_OFFICERS } from '../data/fpoOfficersData.js';

const BASE_URL = '/api';

export async function fetchSellRequests(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params?.sellerId) query.set('sellerId', params.sellerId);
    if (params?.status) query.set('status', params.status);
    if (params?.fpoOfficerId) query.set('fpoOfficerId', params.fpoOfficerId);

    const res = await fetch(`${BASE_URL}/sell-requests?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Network error fetching sell requests, falling back to local seed:', err);
  }
  return [...INITIAL_SELL_REQUESTS];
}

export async function fetchFpoOfficers() {
  try {
    const res = await fetch(`${BASE_URL}/fpo/officers`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Network error fetching FPO officers, falling back to local seed:', err);
  }
  return [...SEED_FPO_OFFICERS];
}

export async function createSellRequest(payload) {
  try {
    const res = await fetch(`${BASE_URL}/sell-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({ error: 'Submission failed' }));
    throw new Error(errData.error || 'Failed to create sell request');
  } catch (err) {
    console.warn('API error creating sell request, executing local client fallback:', err);
    const qty = Number(payload.quantity);
    const expectedPrice = Number(payload.expectedPricePerUnit);
    const expectedTotalAmount = Math.round(qty * expectedPrice * 100) / 100;
    const now = new Date().toISOString();
    const assignedOfficer =
      SEED_FPO_OFFICERS.find(
        (o) => o.district.toLowerCase() === (payload.sellerLocation?.district || '').toLowerCase()
      ) || SEED_FPO_OFFICERS[0];

    const fallbackRequest = {
      id: `REQ-${payload.crop.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`,
      sellerId: payload.sellerId,
      sellerName: payload.sellerName,
      sellerPhone: payload.sellerPhone,
      crop: payload.crop,
      variety: payload.variety || `${payload.crop} Premium Standard`,
      quantity: qty,
      unit: payload.unit || 'Quintals',
      expectedPricePerUnit: expectedPrice,
      expectedTotalAmount,
      imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      photos: payload.photos || [payload.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      qualityDetails: {
        grade: payload.qualityDetails?.grade || 'A',
        moisture: payload.qualityDetails?.moisture ? Number(payload.qualityDetails.moisture) : 8.5,
        harvestDate: payload.qualityDetails?.harvestDate || now.split('T')[0],
        notes: payload.qualityDetails?.notes || 'Clean picked produce ready for FPO physical inspection.',
      },
      sellerLocation: payload.sellerLocation,
      status: 'pending_fpo',
      statusLogs: [
        {
          status: 'pending_fpo',
          timestamp: now,
          note: `Sell request created by ${payload.sellerName} for ${qty} ${payload.unit || 'Quintals'} of ${payload.crop}.`,
          actorRole: 'seller',
          actorName: payload.sellerName,
        },
        {
          status: 'pending_fpo',
          timestamp: now,
          note: `Nearby FPO Officer ${assignedOfficer.name} assigned. Contact: ${assignedOfficer.phone}.`,
          actorRole: 'system',
          actorName: 'KisanSetu Dispatch Engine',
        },
      ],
      assignedFpoOfficer: assignedOfficer,
      createdAt: now,
      updatedAt: now,
    };
    return { success: true, sellRequest: fallbackRequest };
  }
}

export async function acceptSellRequest(id, officerName) {
  try {
    const res = await fetch(`${BASE_URL}/sell-requests/${id}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerName }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.sellRequest;
    }
  } catch (err) {
    console.warn('API error accepting sell request:', err);
  }

  const now = new Date().toISOString();
  const existing = INITIAL_SELL_REQUESTS.find((r) => r.id === id);
  return {
    ...(existing || INITIAL_SELL_REQUESTS[0]),
    id,
    status: 'fpo_accepted',
    updatedAt: now,
    statusLogs: [
      ...(existing?.statusLogs || []),
      {
        status: 'fpo_accepted',
        timestamp: now,
        note: `FPO Officer ${officerName || 'Srinivas Rao'} accepted the sell request. You can now visit the farm gate to inspect quality.`,
        actorRole: 'fpo',
        actorName: officerName || 'FPO Officer',
      },
    ],
  };
}

export async function travelToSeller(id, officerName, etaMinutes = 25) {
  try {
    const res = await fetch(`${BASE_URL}/sell-requests/${id}/travel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerName, etaMinutes }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.sellRequest;
    }
  } catch (err) {
    console.warn('API error updating travel status:', err);
  }
  throw new Error('Failed to update travel status');
}

export async function submitPhysicalInspection(id, inspectionData) {
  try {
    const res = await fetch(`${BASE_URL}/sell-requests/${id}/inspect`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionData),
    });
    if (res.ok) {
      const data = await res.json();
      return data.sellRequest;
    }
  } catch (err) {
    console.warn('API error submitting inspection:', err);
  }
  throw new Error('Failed to submit inspection');
}

export async function negotiateAgreedPrice(id, finalPricePerUnit) {
  const res = await fetch(`${BASE_URL}/sell-requests/${id}/negotiate-price`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ finalPricePerUnit }),
  });
  if (res.ok) {
    return await res.json();
  }
  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.error || 'Failed to record agreed price');
}

export async function selectTransportation(id, transportData) {
  const res = await fetch(`${BASE_URL}/sell-requests/${id}/transport`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transportData),
  });
  if (res.ok) {
    const data = await res.json();
    return data.sellRequest;
  }
  throw new Error('Failed to select transportation');
}

export async function dispatchProduce(id) {
  const res = await fetch(`${BASE_URL}/sell-requests/${id}/dispatch`, {
    method: 'PUT',
  });
  if (res.ok) {
    const data = await res.json();
    return data.sellRequest;
  }
  throw new Error('Failed to dispatch produce');
}

export async function deliverProduce(id, destinationMarket, buyerName) {
  const res = await fetch(`${BASE_URL}/sell-requests/${id}/deliver`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destinationMarket, buyerName }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.sellRequest;
  }
  throw new Error('Failed to deliver produce');
}

export async function completeSellTransaction(id) {
  const res = await fetch(`${BASE_URL}/sell-requests/${id}/complete`, {
    method: 'PUT',
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to complete sell transaction');
}
