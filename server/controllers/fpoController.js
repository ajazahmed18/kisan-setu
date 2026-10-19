import SellRequest from '../models/SellRequest.js';
import CropLot from '../models/CropLot.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

export async function getSellRequests(req, res) {
  try {
    const { farmerId, status, crop } = req.query;

    if (isDbConnected()) {
      try {
        const filter = {};
        if (farmerId) filter.farmerId = farmerId;
        if (status && status !== 'All') filter.status = status;
        if (crop && crop !== 'All') filter.cropName = new RegExp(crop, 'i');

        const requests = await SellRequest.find(filter).sort({ createdAt: -1 });
        return res.json(requests);
      } catch (e) {
        // Fallback
      }
    }

    let list = [...store.sellRequests];
    if (farmerId) list = list.filter((r) => r.sellerId === farmerId || r.farmerId === farmerId);
    if (status && status !== 'All') list = list.filter((r) => r.status === status);
    if (crop && crop !== 'All') list = list.filter((r) => (r.cropName || r.crop)?.toLowerCase().includes(crop.toLowerCase()));

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sell requests' });
  }
}

export async function createSellRequest(req, res) {
  try {
    const data = req.body;
    const reqId = `SR-${Date.now().toString().slice(-6)}`;
    const quantity = Number(data.quantity) || 10;
    const expectedPrice = Number(data.expectedPricePerQuintal) || 2500;
    const totalAmount = quantity * expectedPrice;

    const fpoCommissionPct = 1.5;
    const fpoCommissionAmount = Math.round(totalAmount * 0.015);
    const kisanSetuFeeAmount = Math.round(totalAmount * 0.005);
    const netFarmerPayable = totalAmount - fpoCommissionAmount - kisanSetuFeeAmount;

    const newReq = {
      id: reqId,
      farmerId: data.farmerId || req.user?.id || 'usr-farmer',
      sellerId: data.farmerId || req.user?.id || 'usr-farmer',
      farmerName: data.farmerName || req.user?.name || 'Farmer',
      sellerName: data.farmerName || req.user?.name || 'Farmer',
      farmerPhone: data.farmerPhone || req.user?.phone || '+91 90000 00000',
      sellerPhone: data.farmerPhone || req.user?.phone || '+91 90000 00000',
      farmerLocation: data.farmerLocation || req.user?.location || 'Telangana',
      cropName: data.cropName || data.crop || 'Cotton',
      crop: data.cropName || data.crop || 'Cotton',
      quantity,
      unit: data.unit || 'Quintals',
      grade: data.grade || 'A',
      expectedPricePerQuintal: expectedPrice,
      totalExpectedAmount: totalAmount,
      fpoCommissionPct,
      fpoCommissionAmount,
      kisanSetuFeeAmount,
      netFarmerPayable,
      fpoOfficerId: data.fpoOfficerId || 'FPO-WAR-01',
      fpoOfficerName: data.fpoOfficerName || 'Sri Krishna Rao',
      fpoName: data.fpoName || 'Warangal Progressive Farmers Producer Co.',
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    store.sellRequests.unshift(newReq);

    if (isDbConnected()) {
      try {
        await new SellRequest(newReq).save();
      } catch (err) {
        console.warn('MongoDB save sell request notice:', err.message);
      }
    }

    res.status(201).json(newReq);
  } catch (error) {
    console.error('Error creating sell request:', error);
    res.status(500).json({ error: error.message || 'Failed to submit sell request' });
  }
}

export async function updateSellRequest(req, res) {
  try {
    const item = store.sellRequests.find((r) => r.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Sell request not found' });

    Object.assign(item, req.body);

    if (isDbConnected()) {
      try {
        await SellRequest.updateOne({ id: req.params.id }, { $set: req.body });
      } catch (e) {
        // non-blocking
      }
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sell request' });
  }
}

export async function aggregateRequests(req, res) {
  try {
    const { requestIds, bulkCropName } = req.body;
    if (!requestIds || !requestIds.length) {
      return res.status(400).json({ error: 'No sell requests selected for aggregation' });
    }

    const items = store.sellRequests.filter((r) => requestIds.includes(r.id));
    const totalQty = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const avgPrice = items.length
      ? Math.round(items.reduce((sum, item) => sum + (Number(item.expectedPricePerQuintal) || 2500), 0) / items.length)
      : 2500;

    const bulkLotId = `LOT-BULK-${Date.now().toString().slice(-5)}`;
    const bulkLot = {
      id: bulkLotId,
      farmerId: 'FPO-COOP-AGGREGATE',
      farmerName: 'Warangal Progressive Farmers Producer Co. (Aggregated Lot)',
      farmerPhone: '+91 98491 56789',
      crop: bulkCropName || items[0]?.cropName || 'Cotton',
      quantity: totalQty || 50,
      unit: 'Quintals',
      grade: 'Grade-A (FPO Certified)',
      expectedPrice: avgPrice,
      location: 'FPO Central Collection Hub, Warangal',
      status: 'available',
      isBulkLot: true,
      aggregatedFrom: requestIds,
      physicalQualityCheckedByFPO: true,
      createdAt: new Date().toISOString(),
    };

    store.cropLots.unshift(bulkLot);
    items.forEach((item) => {
      item.status = 'aggregated';
      item.assignedLotId = bulkLotId;
    });

    if (isDbConnected()) {
      try {
        await new CropLot(bulkLot).save();
        await SellRequest.updateMany({ id: { $in: requestIds } }, { $set: { status: 'aggregated', assignedLotId: bulkLotId } });
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ success: true, bulkLot, aggregatedCount: items.length });
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({ error: 'Aggregation failed' });
  }
}

export async function getPhysicalCheckups(req, res) {
  try {
    res.json(store.physicalCheckups || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch physical checkups' });
  }
}

export async function createPhysicalCheckup(req, res) {
  try {
    const data = req.body;
    const checkupId = `CHK-WAR-${Date.now().toString().slice(-4)}`;
    const newCheckup = {
      id: checkupId,
      lotId: data.lotId || `LOT-${Date.now().toString().slice(-4)}`,
      farmerId: data.farmerId || 'usr-farmer',
      farmerName: data.farmerName || 'Farmer',
      farmerPhone: data.farmerPhone || '+91 98480 23456',
      farmerLocation: data.farmerLocation || {
        village: 'Rampur Village',
        mandal: 'Geesugonda',
        district: 'Warangal',
        landmark: 'Near Gram Panchayat',
      },
      crop: data.crop || 'Cotton',
      variety: data.variety || 'BT-II Long Staple',
      quantity: Number(data.quantity) || 40,
      unit: data.unit || 'Quintals',
      declaredGrade: data.declaredGrade || 'A',
      declaredMoisture: Number(data.declaredMoisture) || 8.5,
      status: 'awaiting_assignment',
      createdAt: new Date().toISOString(),
    };

    store.physicalCheckups.unshift(newCheckup);
    res.status(201).json({ success: true, checkup: newCheckup });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create physical checkup request' });
  }
}

export async function assignPhysicalCheckup(req, res) {
  try {
    const { id } = req.params;
    const { officerName, officerPhone, scheduledDate, scheduledTimeSlot, inspectionNotes } = req.body;
    const item = store.physicalCheckups.find((c) => c.id === id);
    if (!item) return res.status(404).json({ error: 'Physical checkup request not found' });

    item.status = 'assigned';
    item.assignedToOfficerName = officerName || 'Sri Krishna Rao (FPO Senior Assayer)';
    item.assignedOfficerPhone = officerPhone || '+91 98481 12345';
    item.scheduledDate = scheduledDate || new Date().toISOString().split('T')[0];
    item.scheduledTimeSlot = scheduledTimeSlot || 'Today 03:00 PM - 05:00 PM';
    item.inspectionNotes = inspectionNotes || 'Farm gate physical moisture and purity assessment assigned.';
    item.assignedAt = new Date().toISOString();

    res.json({ success: true, checkup: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign physical checkup' });
  }
}

export async function certifyPhysicalCheckup(req, res) {
  try {
    const { id } = req.params;
    const { actualGrade, actualMoisture, impurityPercentage, notes } = req.body;
    const item = store.physicalCheckups.find((c) => c.id === id);
    if (!item) return res.status(404).json({ error: 'Physical checkup request not found' });

    item.status = 'inspected_certified';
    item.actualGrade = actualGrade || 'Grade A';
    item.actualMoisture = Number(actualMoisture) || 8.2;
    item.impurityPercentage = Number(impurityPercentage) || 0.6;
    item.pestFree = true;
    item.inspectionNotes = notes || 'Farm inspection completed. Grade verified as Grade-A.';
    item.certificateNumber = `FPO-CERT-WGL-${Date.now().toString().slice(-6)}`;
    item.certifiedAt = new Date().toISOString();

    res.json({ success: true, checkup: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to certify physical checkup' });
  }
}

export async function getFpoOfficers(req, res) {
  try {
    const officers = [
      {
        id: 'fpo-off-1',
        name: 'Srinivas Rao (Warangal Agri Cluster)',
        phone: '+91 98481 12345',
        email: 'srinivas.fpo@telanganaagri.org',
        fpoOrganization: 'Rythu Mithra Farmer Producer Company Ltd (NABARD TS-8492)',
        district: 'Warangal',
        state: 'Telangana',
        rating: 4.9,
        currentLocation: 'Enamamula APMC Field Center, Warangal',
        assignedPinCode: '506002',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        totalCommissionsEarned: 24500,
        completedInspectionsCount: 38,
      },
      {
        id: 'fpo-off-2',
        name: 'Anjaneyulu Reddy (Nizamabad Turmeric Co-Op)',
        phone: '+91 94402 33456',
        email: 'anjaneyulu.reddy@kisanfpo.in',
        fpoOrganization: 'Telangana Kisan Samakhya FPC (Armoor Division)',
        district: 'Nizamabad',
        state: 'Telangana',
        rating: 4.8,
        currentLocation: 'Armoor Market Sub-Station, Nizamabad',
        assignedPinCode: '503001',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        totalCommissionsEarned: 18200,
        completedInspectionsCount: 29,
      },
      {
        id: 'fpo-off-3',
        name: 'K. Venkatesh (Karimnagar Cotton Hub)',
        phone: '+91 91008 44567',
        email: 'venkatesh.k@deccanagro.org',
        fpoOrganization: 'Deccan Agro Producer Co. Ltd',
        district: 'Karimnagar',
        state: 'Telangana',
        rating: 4.7,
        currentLocation: 'Karimnagar APMC Mandi, Karimnagar',
        assignedPinCode: '505001',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        totalCommissionsEarned: 15400,
        completedInspectionsCount: 24,
      },
    ];
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve FPO officers' });
  }
}


