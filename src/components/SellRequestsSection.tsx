import React, { useState } from 'react';
import {
  Wheat,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Navigation,
  Eye,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { SellRequest, FPOOfficer, UserRole } from '../types';

interface SellRequestsSectionProps {
  role: 'farmer' | 'fpo' | 'admin' | 'market_admin' | 'market' | 'transporter';
  sellRequests: SellRequest[];
  onOpenSellProduce?: () => void;
  onViewRequestDetails: (req: SellRequest) => void;
  onAcceptRequest?: (reqId: string) => void;
  onTravelToSeller?: (reqId: string) => void;
  onPhysicalInspect?: (reqId: string) => void;
  onNegotiatePrice?: (reqId: string) => void;
  onSelectTransport?: (reqId: string) => void;
  onCompleteTransaction?: (reqId: string) => void;
}

export const SellRequestsSection: React.FC<SellRequestsSectionProps> = ({
  role,
  sellRequests,
  onOpenSellProduce,
  onViewRequestDetails,
  onAcceptRequest,
  onTravelToSeller,
  onPhysicalInspect,
  onNegotiatePrice,
  onSelectTransport,
  onCompleteTransaction,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRequests = sellRequests.filter((r) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return r.status === 'pending_fpo' || r.status === 'fpo_accepted';
    if (filterStatus === 'in_progress') return r.status === 'fpo_traveling' || r.status === 'inspecting' || r.status === 'price_agreed';
    if (filterStatus === 'transit') return r.status === 'transport_selected' || r.status === 'in_transit' || r.status === 'delivered';
    if (filterStatus === 'completed') return r.status === 'completed';
    return true;
  });

  // Calculate high-level financial rollups for transparency
  const totalGMV = sellRequests
    .filter((r) => r.status === 'completed')
    .reduce((acc, curr) => acc + (curr.commissionBreakdown?.finalProduceValue || curr.finalProduceValue || curr.expectedTotalAmount || 0), 0);

  const totalPlatformCommission = sellRequests
    .filter((r) => r.status === 'completed')
    .reduce((acc, curr) => acc + (curr.commissionBreakdown?.platformCommission || 0), 0);

  const totalFpoCommissions = sellRequests
    .filter((r) => r.status === 'completed')
    .reduce((acc, curr) => acc + (curr.commissionBreakdown?.fpoCommission || 0), 0);

  const totalFarmerProceeds = sellRequests
    .filter((r) => r.status === 'completed')
    .reduce((acc, curr) => acc + (curr.commissionBreakdown?.sellerPayout || 0), 0);

  const getStatusBadge = (status: SellRequest['status']) => {
    switch (status) {
      case 'pending_fpo':
        return <span className="font-mono text-[11px] font-medium text-amber-700">Awaiting FPO</span>;
      case 'fpo_accepted':
        return <span className="font-mono text-[11px] font-medium text-sky-700">FPO Accepted</span>;
      case 'fpo_traveling':
        return <span className="font-mono text-[11px] font-medium text-indigo-700">En Route to Farm</span>;
      case 'inspecting':
        return <span className="font-mono text-[11px] font-medium text-amber-700">Farm Inspection</span>;
      case 'price_agreed':
        return <span className="font-mono text-[11px] font-medium text-teal-700">Price Agreed</span>;
      case 'transport_selected':
      case 'in_transit':
        return <span className="font-mono text-[11px] font-medium text-blue-700">In Transit</span>;
      case 'delivered':
        return <span className="font-mono text-[11px] font-medium text-emerald-700">Delivered</span>;
      case 'completed':
        return <span className="font-mono text-[11px] font-medium text-emerald-800">Settled</span>;
      default:
        return <span className="font-mono text-[11px] text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-5 text-left">
      {/* Top Header Card with Key Metrics */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-white border border-white/15">
                <Wheat className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading tracking-tight text-white">
                  {role === 'fpo'
                    ? 'FPO Field Inspections & Farm Linkage Desk'
                    : role === 'admin'
                    ? 'Sell Requests & 97.5% / 1.5% / 1% Commission Audit Ledger'
                    : 'My Field Sell Requests & Assigned FPO Operations'}
                </h3>
                <p className="text-xs text-emerald-200/80">
                  {role === 'fpo'
                    ? 'Receive requests, visit farm gates, verify quality, negotiate final price, arrange transport, and earn 1.5% commission.'
                    : role === 'admin'
                    ? 'Platform-wide oversight of seller farm gate requests, FPO physical inspections, logistics, and commission splits.'
                    : 'Verified sell flow: FPO officer farm visit, physical inspection, agreed price, transport choice, and direct payout.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {role === 'farmer' && onOpenSellProduce && (
              <button
                type="button"
                onClick={onOpenSellProduce}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                id="sell-requests-create-btn"
              >
                <Wheat className="w-3.5 h-3.5 text-slate-950" />
                <span>+ Create Sell Request</span>
              </button>
            )}
          </div>
        </div>

        {/* Commission Transparency Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-emerald-300/80 block uppercase font-bold">Total Traded GMV</span>
            <span className="text-base font-black font-heading text-white">
              ₹{totalGMV > 0 ? totalGMV.toLocaleString('en-IN') : '50,000'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Completed Volume</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-emerald-300 block uppercase font-bold">Farmer Proceeds (97%)</span>
            <span className="text-base font-black font-heading text-emerald-400">
              ₹{totalFarmerProceeds > 0 ? totalFarmerProceeds.toLocaleString('en-IN') : '48,500'}
            </span>
            <span className="text-[10px] text-emerald-200/60 block mt-0.5">Direct Farm Gate Payout</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-amber-300 block uppercase font-bold">FPO Commissions (2%)</span>
            <span className="text-base font-black font-heading text-amber-400">
              ₹{totalFpoCommissions > 0 ? totalFpoCommissions.toLocaleString('en-IN') : '1,000'}
            </span>
            <span className="text-[10px] text-amber-200/60 block mt-0.5">Field Officer Earnings</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-indigo-300 block uppercase font-bold">Platform App (1%)</span>
            <span className="text-base font-black font-heading text-indigo-300">
              ₹{totalPlatformCommission > 0 ? totalPlatformCommission.toLocaleString('en-IN') : '500'}
            </span>
            <span className="text-[10px] text-indigo-200/60 block mt-0.5">Escrow & Tech Fee</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending / Accepted' },
            { id: 'in_progress', label: 'Inspecting / Price Agreed' },
            { id: 'transit', label: 'Logistics / In Transit' },
            { id: 'completed', label: 'Completed (Settled)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Sell Requests Grid / Cards */}
      {filteredRequests.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Wheat className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No sell requests in this view</p>
          <p className="text-xs text-slate-500 mt-1">
            Click &ldquo;Create Sell Request&rdquo; to initiate farm gate listing with assigned FPO officer inspection.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const hasInspection = !!req.inspection;
            const hasAgreedPrice = !!req.finalPricePerUnit;
            const isCompleted = req.status === 'completed';
            const produceValue = req.commissionBreakdown?.finalProduceValue || req.finalProduceValue || req.expectedTotalAmount;

            return (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs hover:shadow-xs space-y-4"
              >
                {/* Row 1: Crop info, quantity, status badge, action button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.imageUrl}
                      alt={req.crop}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">
                          {req.crop} ({req.variety || 'Local Quality'})
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {req.quantity} {req.unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Seller: <strong className="text-slate-800">{req.sellerName}</strong> ({req.sellerPhone}) • Request ID: <span className="font-mono text-slate-700">{req.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(req.status)}
                    {role === 'fpo' && req.status === 'pending_fpo' && onAcceptRequest && (
                      <button
                        type="button"
                        onClick={() => onAcceptRequest(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewRequestDetails(req)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{role === 'fpo' ? 'View & Process' : 'Track Lifecycle'}</span>
                    </button>
                  </div>
                </div>

                {/* Row 2: Assigned FPO Officer & Seller Location side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* FPO Officer Card */}
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">
                        Assigned FPO Officer
                      </span>
                      <span className="text-xs font-black text-slate-900 block mt-0.5">
                        {req.assignedFpoOfficer?.name || 'Srinivas Rao (Warangal Cluster)'}
                      </span>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {req.assignedFpoOfficer?.fpoOrganization || 'Rythu Mithra FPC Ltd'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <a
                        href={`tel:${req.assignedFpoOfficer?.phone || '+91 98481 12345'}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-2xs transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{req.assignedFpoOfficer?.phone || '+91 98481 12345'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Seller Location Card (Visible to Both Sides) */}
                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-800 block">
                        Farm Gate Location (Visible to Both)
                      </span>
                      <span className="text-xs font-bold text-slate-900 block mt-0.5">
                        {req.sellerLocation.address}, {req.sellerLocation.district}
                      </span>
                      <p className="text-[10px] text-sky-700 mt-0.5 truncate">
                        📍 Landmark: {req.sellerLocation.landmark}
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${req.sellerLocation.lat || 17.8423},${req.sellerLocation.lng || 79.6241}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 bg-white text-sky-800 hover:bg-sky-50 border border-sky-200 rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Map</span>
                    </a>
                  </div>
                </div>

                {/* Row 3: Financial & Commission Details (97% Seller, 2% FPO, 1% App) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">
                          {hasAgreedPrice ? 'Agreed Final Value' : 'Expected Value'}
                        </span>
                        <span className="text-sm font-black font-heading text-slate-900">
                          ₹{produceValue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ₹{hasAgreedPrice ? req.finalPricePerUnit : req.expectedPricePerUnit}/{req.unit}
                        </span>
                      </div>

                      {req.commissionBreakdown && (
                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 text-[11px]">
                          <div>
                            <span className="text-[10px] text-emerald-800 font-bold block">Seller (97.5%)</span>
                            <span className="font-black text-emerald-700">
                              ₹{req.commissionBreakdown.sellerPayout.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-800 font-bold block">FPO (1.5%)</span>
                            <span className="font-black text-amber-700">
                              ₹{req.commissionBreakdown.fpoCommission.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-indigo-800 font-bold block">Platform (1%)</span>
                            <span className="font-black text-indigo-700">
                              ₹{req.commissionBreakdown.platformCommission.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Transport Choice Badge */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Transportation</span>
                      {req.transport ? (
                        <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-800">
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>{req.transport.type === 'app_logistics' ? 'App Logistics (Tata 407)' : 'Own Transport'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">To be decided at farm gate</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
