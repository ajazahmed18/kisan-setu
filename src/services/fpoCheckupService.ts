// FPO Physical Checkup & Quality Certification Service

export interface PhysicalCheckupRequest {
  id: string; // e.g. "CHK-WAR-8401"
  lotId?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: {
    village: string;
    mandal: string;
    district: string;
    landmark?: string;
    address?: string;
  };
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  declaredGrade: 'A' | 'B' | 'C';
  declaredMoisture: number;
  status: 'awaiting_assignment' | 'assigned' | 'inspected_certified' | 'rejected';
  assignedToOfficerName?: string;
  assignedOfficerPhone?: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  inspectionNotes?: string;
  actualGrade?: 'Grade A' | 'Grade B' | 'Grade C';
  actualMoisture?: number;
  impurityPercentage?: number;
  pestFree?: boolean;
  certificateNumber?: string;
  certifiedAt?: string;
  createdAt: string;
}

const STORAGE_KEY = 'kisansetu_fpo_checkup_requests_v2';

export const INITIAL_GENUINE_CHECKUPS: PhysicalCheckupRequest[] = [
  {
    id: 'CHK-WAR-8401',
    lotId: 'LOT-COT-201',
    farmerId: 'usr-farmer-ramesh',
    farmerName: 'Ramesh Kumar (Farmer)',
    farmerPhone: '+91 98480 23456',
    farmerLocation: {
      village: 'Rayaparthi Village',
      mandal: 'Wardhanapet',
      district: 'Warangal',
      landmark: 'Near Gram Panchayat Water Tank',
      address: 'Survey No 42/A, Rayaparthi Farm',
    },
    crop: 'Cotton',
    variety: 'BT-II Long Staple',
    quantity: 45,
    unit: 'Quintals',
    declaredGrade: 'A',
    declaredMoisture: 8.5,
    status: 'awaiting_assignment',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'CHK-WGL-8402',
    lotId: 'LOT-TOM-101',
    farmerId: 'usr-farmer-lakshmi',
    farmerName: 'Lakshmi Narayana (Farmer)',
    farmerPhone: '+91 98480 88771',
    farmerLocation: {
      village: 'Geesugonda Village',
      mandal: 'Geesugonda',
      district: 'Warangal',
      landmark: 'Near APMC Sub-Yard',
      address: 'Field Plot #18, Geesugonda',
    },
    crop: 'Tomato',
    variety: 'Sivam Hybrid Fresh Crates',
    quantity: 40,
    unit: 'Quintals',
    declaredGrade: 'A',
    declaredMoisture: 12.0,
    status: 'awaiting_assignment',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export function getLocalCheckups(): PhysicalCheckupRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }
  return [...INITIAL_GENUINE_CHECKUPS];
}

export function saveLocalCheckups(list: PhysicalCheckupRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('kisansetu_fpo_checkups_updated', { detail: list }));
  } catch (e) {
    console.warn('localStorage write error:', e);
  }
}

// Fetch all checkups with server sync
export async function fetchPhysicalCheckups(): Promise<PhysicalCheckupRequest[]> {
  try {
    const res = await fetch('/api/fpo/physical-checkups');
    if (res.ok) {
      const serverList = await res.json();
      if (Array.isArray(serverList) && serverList.length > 0) {
        const local = getLocalCheckups();
        const mergedMap = new Map<string, PhysicalCheckupRequest>();
        serverList.forEach((c: PhysicalCheckupRequest) => mergedMap.set(c.id, c));
        local.forEach((c: PhysicalCheckupRequest) => mergedMap.set(c.id, c));
        const merged = Array.from(mergedMap.values());
        saveLocalCheckups(merged);
        return merged;
      }
    }
  } catch (e) {
    console.warn('Server fetch checkups fallback:', e);
  }
  return getLocalCheckups();
}

// Farmer requests physical checkup: FPO receives notification
export async function requestFarmerPhysicalCheckup(params: {
  lotId?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  variety?: string;
  quantity: number;
  unit?: string;
  declaredGrade?: 'A' | 'B' | 'C';
  declaredMoisture?: number;
  farmerLocation: {
    village: string;
    mandal: string;
    district: string;
    landmark?: string;
    address?: string;
  };
}): Promise<PhysicalCheckupRequest> {
  const checkupId = `CHK-WAR-${Date.now().toString().slice(-4)}`;
  const newCheckup: PhysicalCheckupRequest = {
    id: checkupId,
    lotId: params.lotId || `LOT-${Date.now().toString().slice(-4)}`,
    farmerId: params.farmerId,
    farmerName: params.farmerName,
    farmerPhone: params.farmerPhone,
    farmerLocation: params.farmerLocation,
    crop: params.crop,
    variety: params.variety || `${params.crop} Standard Grade`,
    quantity: Number(params.quantity) || 30,
    unit: params.unit || 'Quintals',
    declaredGrade: params.declaredGrade || 'A',
    declaredMoisture: params.declaredMoisture || 8.5,
    status: 'awaiting_assignment',
    createdAt: new Date().toISOString(),
  };

  const current = getLocalCheckups();
  const updated = [newCheckup, ...current.filter((c) => c.id !== newCheckup.id)];
  saveLocalCheckups(updated);

  try {
    await fetch('/api/fpo/physical-checkups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCheckup),
    });
  } catch (e) {
    console.warn('Server checkup sync note:', e);
  }

  return newCheckup;
}

// FPO Officer assigns physical checkup
export async function assignOfficerForPhysicalCheckup(
  checkupId: string,
  assignment: {
    officerName: string;
    officerPhone?: string;
    scheduledDate: string;
    scheduledTimeSlot: string;
    inspectionNotes?: string;
  }
): Promise<PhysicalCheckupRequest> {
  const current = getLocalCheckups();
  let updatedItem: PhysicalCheckupRequest | null = null;

  const nextList = current.map((item) => {
    if (item.id === checkupId) {
      updatedItem = {
        ...item,
        status: 'assigned' as const,
        assignedToOfficerName: assignment.officerName,
        assignedOfficerPhone: assignment.officerPhone || '+91 98481 12345',
        scheduledDate: assignment.scheduledDate,
        scheduledTimeSlot: assignment.scheduledTimeSlot,
        inspectionNotes: assignment.inspectionNotes || 'Scheduled for farm gate physical checkup.',
      };
      return updatedItem;
    }
    return item;
  });

  saveLocalCheckups(nextList);

  try {
    await fetch(`/api/fpo/physical-checkups/${checkupId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment),
    });
  } catch (e) {
    console.warn('Server assign update note:', e);
  }

  return updatedItem || current[0];
}

// FPO Officer conducts physical checkup & certifies produce
export async function completePhysicalCheckupCertification(
  checkupId: string,
  findings: {
    actualGrade: 'Grade A' | 'Grade B' | 'Grade C';
    actualMoisture: number;
    impurityPercentage: number;
    pestFree: boolean;
    notes?: string;
  }
): Promise<PhysicalCheckupRequest> {
  const current = getLocalCheckups();
  let updatedItem: PhysicalCheckupRequest | null = null;
  const certNumber = `FPO-CERT-WGL-${Date.now().toString().slice(-6)}`;

  const nextList = current.map((item) => {
    if (item.id === checkupId) {
      updatedItem = {
        ...item,
        status: 'inspected_certified' as const,
        actualGrade: findings.actualGrade,
        actualMoisture: findings.actualMoisture,
        impurityPercentage: findings.impurityPercentage,
        pestFree: findings.pestFree,
        inspectionNotes: findings.notes || 'Physical inspection verified and certified.',
        certificateNumber: certNumber,
        certifiedAt: new Date().toISOString(),
      };
      return updatedItem;
    }
    return item;
  });

  saveLocalCheckups(nextList);

  try {
    await fetch(`/api/fpo/physical-checkups/${checkupId}/certify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...findings,
        certificateNumber: certNumber,
      }),
    });
  } catch (e) {
    console.warn('Server certify update note:', e);
  }

  return updatedItem || current[0];
}
