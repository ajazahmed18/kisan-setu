import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, SellRequest } from '../types';
import {
  PhysicalCheckupRequest,
  fetchPhysicalCheckups,
  requestFarmerPhysicalCheckup,
  assignOfficerForPhysicalCheckup,
  completePhysicalCheckupCertification,
} from '../services/fpoCheckupService';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Search,
  X,
  Wheat,
  Eye,
  Copy,
  Check,
  Calendar,
  Clock,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ClipboardCheck,
  UserCheck,
  Award,
  AlertTriangle,
  QrCode,
  FileText,
  BadgeCheck,
  Send,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FPODashboardProps {
  currentUser: UserProfile;
  sellRequests?: SellRequest[];
  onViewSellRequest?: (req: SellRequest) => void;
  onSellRequestUpdated?: (req: SellRequest) => void;
  onOpenSellProduce?: () => void;
  lots?: any[];
}

export const FPODashboard: React.FC<FPODashboardProps> = ({
  currentUser,
}) => {
  const { language } = useLanguage();
  const [checkups, setCheckups] = useState<PhysicalCheckupRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'awaiting_assignment' | 'assigned' | 'inspected_certified'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Assignment Modal State
  const [assigningCheckup, setAssigningCheckup] = useState<PhysicalCheckupRequest | null>(null);
  const [assignedOfficerName, setAssignedOfficerName] = useState<string>(currentUser.name || 'Sri Krishna Rao (Senior Assayer)');
  const [assignedOfficerPhone, setAssignedOfficerPhone] = useState<string>(currentUser.phone || '+91 98481 12345');
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState<string>('02:00 PM - 04:30 PM');
  const [inspectionNotes, setInspectionNotes] = useState<string>('Bring digital moisture probe and grain sorting sieve. Verify farm gate weighment.');
  const [isSubmittingAssign, setIsSubmittingAssign] = useState<boolean>(false);

  // Inspection Conduct Modal State
  const [inspectingCheckup, setInspectingCheckup] = useState<PhysicalCheckupRequest | null>(null);
  const [actualGrade, setActualGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [actualMoisture, setActualMoisture] = useState<number>(8.2);
  const [impurityPercentage, setImpurityPercentage] = useState<number>(0.6);
  const [pestFree, setPestFree] = useState<boolean>(true);
  const [inspectionResultNotes, setInspectionResultNotes] = useState<string>('Produce sampled across 5 bags. Excellent uniform quality, moisture within APMC limits.');
  const [isSubmittingInspection, setIsSubmittingInspection] = useState<boolean>(false);

  // Certificate View Modal
  const [viewingCertificate, setViewingCertificate] = useState<PhysicalCheckupRequest | null>(null);

  const loadCheckups = async () => {
    const list = await fetchPhysicalCheckups();
    setCheckups(list);
  };

  useEffect(() => {
    loadCheckups();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCheckups(e.detail);
      }
    };

    window.addEventListener('kisansetu_fpo_checkups_updated', handleUpdate);
    return () => window.removeEventListener('kisansetu_fpo_checkups_updated', handleUpdate);
  }, []);

  // Quick test: simulate an incoming farmer checkup request
  const handleSimulateCheckupRequest = async () => {
    const crops = [
      { crop: 'Cotton', variety: 'BT-II Long Staple', qty: 45, unit: 'Quintals', moisture: 8.5 },
      { crop: 'Tomato', variety: 'Sivam Hybrid Fresh Crates', qty: 35, unit: 'Quintals', moisture: 11.5 },
      { crop: 'Red Chilli', variety: 'Teja S17 Pungent Red', qty: 20, unit: 'Quintals', moisture: 9.8 },
      { crop: 'Rice (Paddy)', variety: 'BPT 5204 Samba Masuri', qty: 60, unit: 'Quintals', moisture: 12.8 },
    ];
    const item = crops[Math.floor(Math.random() * crops.length)];
    const villages = [
      { name: 'Rayaparthi Village', mandal: 'Wardhanapet', district: 'Warangal' },
      { name: 'Rampur Village', mandal: 'Geesugonda', district: 'Warangal' },
      { name: 'Dharmasagar Village', mandal: 'Dharmasagar', district: 'Hanamkonda' },
    ];
    const pickVillage = villages[Math.floor(Math.random() * villages.length)];

    const req = await requestFarmerPhysicalCheckup({
      farmerId: `usr-farmer-${Date.now().toString().slice(-4)}`,
      farmerName: 'Ramesh Kumar (Farmer)',
      farmerPhone: '+91 98480 23456',
      crop: item.crop,
      variety: item.variety,
      quantity: item.qty,
      unit: item.unit,
      declaredGrade: 'A',
      declaredMoisture: item.moisture,
      farmerLocation: {
        village: pickVillage.name,
        mandal: pickVillage.mandal,
        district: pickVillage.district,
        landmark: 'Near Gram Panchayat Water Tank',
        address: `Farm Gate Plot #4, ${pickVillage.name}`,
      },
    });

    setActionNotice(`🔔 New Physical Checkup request from farmer ${req.farmerName} received!`);
    loadCheckups();
  };

  // Submit Assignment
  const handleConfirmAssignment = async () => {
    if (!assigningCheckup) return;
    setIsSubmittingAssign(true);
    try {
      const updated = await assignOfficerForPhysicalCheckup(assigningCheckup.id, {
        officerName: assignedOfficerName,
        officerPhone: assignedOfficerPhone,
        scheduledDate,
        scheduledTimeSlot,
        inspectionNotes,
      });

      setActionNotice(`✓ Physical checkup assigned to ${assignedOfficerName} for ${scheduledDate} (${scheduledTimeSlot}). Farmer notified.`);
      setAssigningCheckup(null);
      loadCheckups();
    } catch (e) {
      console.error('Assign error:', e);
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  // Submit Physical Certification
  const handleConfirmCertification = async () => {
    if (!inspectingCheckup) return;
    setIsSubmittingInspection(true);
    try {
      const updated = await completePhysicalCheckupCertification(inspectingCheckup.id, {
        actualGrade,
        actualMoisture,
        impurityPercentage,
        pestFree,
        notes: inspectionResultNotes,
      });

      setActionNotice(`✓ Physical checkup completed! FPO Quality Certificate ${updated.certificateNumber} issued with NABARD seal.`);
      setViewingCertificate(updated);
      setInspectingCheckup(null);
      loadCheckups();
    } catch (e) {
      console.error('Certify error:', e);
    } finally {
      setIsSubmittingInspection(false);
    }
  };

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  // Filtering
  const filteredCheckups = useMemo(() => {
    return checkups
      .filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchFarmer = c.farmerName.toLowerCase().includes(q);
          const matchPhone = c.farmerPhone.toLowerCase().includes(q);
          const matchCrop = c.crop.toLowerCase().includes(q);
          const matchVillage = c.farmerLocation.village.toLowerCase().includes(q);
          const matchId = c.id.toLowerCase().includes(q);
          if (!matchFarmer && !matchPhone && !matchCrop && !matchVillage && !matchId) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [checkups, statusFilter, searchQuery]);

  const awaitingCount = checkups.filter((c) => c.status === 'awaiting_assignment').length;
  const assignedCount = checkups.filter((c) => c.status === 'assigned').length;
  const certifiedCount = checkups.filter((c) => c.status === 'inspected_certified').length;

  return (
    <div className="space-y-6 py-2 text-left" id="fpo-physical-checkup-portal">
      {/* FPO HEADER WITH PHYSICAL CHECKUP BADGES */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-900 flex items-center justify-center text-white font-mono font-bold text-xl shrink-0 shadow-sm ring-4 ring-blue-50">
              <Building2 className="w-8 h-8 text-blue-100" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                  {currentUser.name || 'Sri Krishna Rao'}
                </h2>
                <span className="bg-blue-50 text-blue-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  FPO Physical Quality Assayer
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Physical Checkup Notifications Only
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Warangal APMC Enamamula Quality Desk
                </span>
                <span className="text-slate-300">•</span>
                <span>NABARD Reg: TS-WGL-FPO-8492</span>
                <span className="text-slate-300">•</span>
                <span>Assayer Role: <strong>Assign & Conduct Farm Physical Checkups</strong></span>
              </p>
            </div>
          </div>

          {/* SIMULATE FARMER CHECKUP TRIGGER */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSimulateCheckupRequest}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Test: Farmer triggers a physical checkup request"
            >
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Simulate Farmer Checkup Request</span>
            </button>
          </div>
        </div>

        {/* NOTIFICATION STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div
            onClick={() => setStatusFilter('awaiting_assignment')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              statusFilter === 'awaiting_assignment'
                ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-500/20 shadow-2xs'
                : 'bg-amber-50/30 border-amber-200 hover:bg-amber-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                🔔 Awaiting Officer Assignment
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-amber-950 font-mono mt-1">{awaitingCount}</p>
            <span className="text-[11px] text-amber-800 font-medium">Farmer waiting for physical checkup visit</span>
          </div>

          <div
            onClick={() => setStatusFilter('assigned')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              statusFilter === 'assigned'
                ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20 shadow-2xs'
                : 'bg-blue-50/30 border-blue-200 hover:bg-blue-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                📅 Checkup Assigned & Scheduled
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <p className="text-2xl font-black text-blue-950 font-mono mt-1">{assignedCount}</p>
            <span className="text-[11px] text-blue-800 font-medium">Ready for field inspection & grading</span>
          </div>

          <div
            onClick={() => setStatusFilter('inspected_certified')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              statusFilter === 'inspected_certified'
                ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs'
                : 'bg-emerald-50/30 border-emerald-200 hover:bg-emerald-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                ✓ Inspected & Certified Lots
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-950 font-mono mt-1">{certifiedCount}</p>
            <span className="text-[11px] text-emerald-800 font-medium">Official FPO certificate & QR seal issued</span>
          </div>
        </div>
      </div>

      {/* ACTION NOTICE BANNER */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 text-emerald-950 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{actionNotice}</p>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* FILTER & SEARCH ROW */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmer name, phone, crop, village, or ID..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All Checkups ({checkups.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('awaiting_assignment')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              statusFilter === 'awaiting_assignment' ? 'bg-amber-100 text-amber-950 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Awaiting ({awaitingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('assigned')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              statusFilter === 'assigned' ? 'bg-blue-100 text-blue-950 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Assigned ({assignedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inspected_certified')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              statusFilter === 'inspected_certified' ? 'bg-emerald-100 text-emerald-950 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Certified ({certifiedCount})
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS & CHECKUP REQUESTS LIST */}
      <div className="space-y-4">
        {filteredCheckups.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mx-auto">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Physical Checkup Requests Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No farmer requests currently match your filter. You can click &ldquo;Simulate Farmer Checkup Request&rdquo; above to test an incoming notification!
            </p>
          </div>
        ) : (
          filteredCheckups.map((item) => {
            const isAwaiting = item.status === 'awaiting_assignment';
            const isAssigned = item.status === 'assigned';
            const isCertified = item.status === 'inspected_certified';
            const isCopied = copiedPhoneId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-2xs hover:shadow-xs space-y-4 ${
                  isAwaiting
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : isAssigned
                    ? 'border-blue-300'
                    : 'border-emerald-300'
                }`}
              >
                {/* Header: Notification tag, ID, status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {isAwaiting && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1.5 font-mono">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        🔔 NEW PHYSICAL CHECKUP REQUEST
                      </span>
                    )}
                    {isAssigned && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-950 border border-blue-300 flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-blue-700" />
                        CHECKUP ASSIGNED • VISIT SCHEDULED
                      </span>
                    )}
                    {isCertified && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1.5 font-mono">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                        ✓ FPO QUALITY CERTIFIED
                      </span>
                    )}

                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Crop details */}
                  <div className="lg:col-span-4 space-y-1">
                    <h4 className="text-base font-black text-slate-900 font-heading">
                      {item.crop} ({item.quantity} {item.unit})
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Variety: {item.variety}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        Declared: {item.declaredGrade}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        Moisture: {item.declaredMoisture}%
                      </span>
                    </div>
                  </div>

                  {/* Farmer & Location info */}
                  <div className="lg:col-span-5 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.farmerName}</span>
                      <a
                        href={`tel:${item.farmerPhone}`}
                        className="font-mono text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-blue-600" />
                        <span>{item.farmerPhone}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(item.id, item.farmerPhone)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 p-0.5 rounded bg-slate-100 cursor-pointer"
                        title="Copy phone"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-start gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {item.farmerLocation.address || item.farmerLocation.village}, {item.farmerLocation.mandal}, {item.farmerLocation.district}
                      </span>
                    </div>

                    {item.farmerLocation.landmark && (
                      <p className="text-[11px] text-slate-500 italic">
                        Landmark: {item.farmerLocation.landmark}
                      </p>
                    )}

                    {/* If assigned, show scheduled slot */}
                    {isAssigned && item.assignedToOfficerName && (
                      <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-0.5">
                        <p>
                          Assigned Assayer: <strong>{item.assignedToOfficerName}</strong>
                        </p>
                        <p>
                          Visit Time: <strong>{item.scheduledDate}</strong> ({item.scheduledTimeSlot})
                        </p>
                      </div>
                    )}

                    {/* If certified, show certificate number */}
                    {isCertified && item.certificateNumber && (
                      <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 space-y-0.5">
                        <p>
                          Cert: <strong className="font-mono">{item.certificateNumber}</strong> • Grade: <strong>{item.actualGrade}</strong>
                        </p>
                        <p>
                          Measured Moisture: <strong>{item.actualMoisture}%</strong> • Impurities: <strong>{item.impurityPercentage}%</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="lg:col-span-3 flex flex-col justify-center items-stretch gap-2">
                    {/* Action 1: Assign for physical checkup */}
                    {isAwaiting && (
                      <button
                        type="button"
                        onClick={() => {
                          setAssigningCheckup(item);
                          setAssignedOfficerName(currentUser.name || 'Sri Krishna Rao (Senior Assayer)');
                        }}
                        className="py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>ASSIGN FOR PHYSICAL CHECKUP</span>
                      </button>
                    )}

                    {/* Action 2: Conduct physical checkup */}
                    {isAssigned && (
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingCheckup(item);
                          setActualGrade((item.declaredGrade === 'A' ? 'Grade A' : 'Grade B') as any);
                          setActualMoisture(item.declaredMoisture);
                        }}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>CONDUCT PHYSICAL CHECKUP</span>
                      </button>
                    )}

                    {/* Action 3: View certificate */}
                    {isCertified && (
                      <button
                        type="button"
                        onClick={() => setViewingCertificate(item)}
                        className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Official Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: ASSIGN OFFICER FOR PHYSICAL CHECKUP */}
      {assigningCheckup && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Assign Officer for Farm Physical Checkup
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssigningCheckup(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
              <p>
                Farmer: <strong>{assigningCheckup.farmerName}</strong> ({assigningCheckup.farmerPhone})
              </p>
              <p>
                Lot: <strong>{assigningCheckup.quantity} {assigningCheckup.unit} {assigningCheckup.crop}</strong> ({assigningCheckup.variety})
              </p>
              <p>
                Farm: <strong>{assigningCheckup.farmerLocation.address || assigningCheckup.farmerLocation.village}</strong>
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Officer Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Field Assayer / Inspector</label>
                <select
                  value={assignedOfficerName}
                  onChange={(e) => setAssignedOfficerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Sri Krishna Rao (Senior Assayer - Warangal Cluster)">
                    Sri Krishna Rao (Senior Assayer - Warangal Cluster)
                  </option>
                  <option value="Dr. M. Sridhar (Quality Assayer - NABARD Certified)">
                    Dr. M. Sridhar (Quality Assayer - NABARD Certified)
                  </option>
                  <option value="K. Anitha Devi (Field Agronomist & Assayer)">
                    K. Anitha Devi (Field Agronomist & Assayer)
                  </option>
                  <option value="B. Venkatesh (Cotton & Grain Specialist)">
                    B. Venkatesh (Cotton & Grain Specialist)
                  </option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={scheduledTimeSlot}
                    onChange={(e) => setScheduledTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="09:00 AM - 11:30 AM">Morning (09:00 AM - 11:30 AM)</option>
                    <option value="02:00 PM - 04:30 PM">Afternoon (02:00 PM - 04:30 PM)</option>
                    <option value="04:30 PM - 06:30 PM">Evening (04:30 PM - 06:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assayer Instructions & Tools</label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssigningCheckup(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAssign}
                onClick={handleConfirmAssignment}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmittingAssign ? 'Assigning...' : 'CONFIRM ASSIGNMENT & SCHEDULE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONDUCT PHYSICAL CHECKUP & CERTIFY */}
      {inspectingCheckup && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Conduct Farm Gate Physical Quality Inspection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingCheckup(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
              <p>
                Inspecting: <strong>{inspectingCheckup.crop} ({inspectingCheckup.quantity} {inspectingCheckup.unit})</strong>
              </p>
              <p>
                Farmer: <strong>{inspectingCheckup.farmerName}</strong> • {inspectingCheckup.farmerLocation.village}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Actual Grade */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Verified Grade</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Grade A', 'Grade B', 'Grade C'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setActualGrade(g)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        actualGrade === g
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Moisture & Impurity measurements */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Measured Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={actualMoisture}
                    onChange={(e) => setActualMoisture(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500">APMC standard: &lt; 9.0%</span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Foreign Matter / Impurity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={impurityPercentage}
                    onChange={(e) => setImpurityPercentage(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500">Target: &lt; 1.0%</span>
                </div>
              </div>

              {/* Pest Free */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="pestFreeCheckbox"
                  checked={pestFree}
                  onChange={(e) => setPestFree(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="pestFreeCheckbox" className="font-bold text-slate-800 cursor-pointer">
                  Confirmed: 100% Pest Free, Dry & Insect Free Sample
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Quality Certificate Remarks</label>
                <textarea
                  rows={2}
                  value={inspectionResultNotes}
                  onChange={(e) => setInspectionResultNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingCheckup(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingInspection}
                onClick={handleConfirmCertification}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>{isSubmittingInspection ? 'Certifying...' : 'ISSUE FPO QUALITY CERTIFICATE & SEAL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW OFFICIAL FPO CERTIFICATE */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border-4 border-emerald-500 text-center space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                NABARD TS-WGL-8492
              </span>
              <button
                type="button"
                onClick={() => setViewingCertificate(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-800 mx-auto shadow-inner">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 font-heading tracking-tight">
                FPO QUALITY VERIFICATION CERTIFICATE
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Cert No: <strong>{viewingCertificate.certificateNumber}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Farmer:</span>
                <strong className="text-slate-900">{viewingCertificate.farmerName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Crop & Variety:</span>
                <strong className="text-slate-900">{viewingCertificate.crop} ({viewingCertificate.variety})</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Lot Quantity:</span>
                <strong className="text-slate-900">{viewingCertificate.quantity} {viewingCertificate.unit}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Certified Grade:</span>
                <strong className="text-emerald-700 font-bold">{viewingCertificate.actualGrade}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Tested Moisture:</span>
                <strong className="text-slate-900">{viewingCertificate.actualMoisture}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assayed By:</span>
                <strong className="text-slate-900">{viewingCertificate.assignedToOfficerName || 'FPO Quality Officer'}</strong>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium flex items-center justify-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Certified for direct Mandi Gate Entry & Escrow Clearing</span>
            </div>

            <button
              type="button"
              onClick={() => setViewingCertificate(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
