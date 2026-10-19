import React, { useState } from 'react';
import {
  UserProfile,
  Dispute,
  FPOReview,
  BlockchainBlock,
  SellRequest,
} from '../types';
import {
  ShieldCheck,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  Lock,
  Database,
  CheckCircle,
  XCircle,
  FileCheck2,
  Scale,
  DollarSign,
  Gavel,
  Search,
  Wheat,
} from 'lucide-react';
import { SellRequestsSection } from './SellRequestsSection';

interface AdminDashboardProps {
  users: UserProfile[];
  disputes: Dispute[];
  fpoReviews: FPOReview[];
  blockchainBlocks: BlockchainBlock[];
  sellRequests?: SellRequest[];
  onVerifyBuyer?: (userId: string) => void;
  onVerifyMarketAdmin?: (userId: string) => void;
  onResolveDispute: (disputeId: string, resolutionNotes: string, penaltyAmount?: number) => void;
  onLevyPenalty: (reviewId: string, penaltyAmount: number) => void;
  onViewSellRequest?: (req: SellRequest) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  disputes,
  fpoReviews,
  blockchainBlocks,
  sellRequests = [],
  onVerifyBuyer,
  onVerifyMarketAdmin,
  onResolveDispute,
  onLevyPenalty,
  onViewSellRequest,
}) => {
  const verifyHandler = onVerifyMarketAdmin || onVerifyBuyer || (() => {});
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'sell_requests' | 'market_admins' | 'disputes' | 'reviews' | 'blockchain'>('sell_requests');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [penaltyInput, setPenaltyInput] = useState('0');

  const pendingMarketAdmins = users.filter((u) => (u.role === 'market_admin' || (u.role as string) === 'market') && !u.isVerified);
  const verifiedMarketAdminsCount = users.filter((u) => (u.role === 'market_admin' || (u.role as string) === 'market') && u.isVerified).length;
  const openDisputes = disputes.filter((d) => d.status === 'Open');

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    onResolveDispute(selectedDispute.id, resolutionNotes, Number(penaltyInput));
    setSelectedDispute(null);
    setResolutionNotes('');
    setPenaltyInput('0');
  };

  return (
    <div className="space-y-6 py-4 text-left">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-lg text-slate-100 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-heading">
                Agricultural Marketing Directorate
              </h2>
              <span className="bg-slate-800 text-slate-300 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700">
                Root Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Agricultural Marketing Regulatory Oversight & Tribunal • Government of Telangana APMC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-md font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Consensus Node Active
          </span>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveAdminTab('sell_requests')}
          className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'sell_requests'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wheat className="w-3.5 h-3.5" />
          <span>Sell Requests & Commission Ledger</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'analytics'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('market_admins')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 relative ${
            activeAdminTab === 'market_admins'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Market Admin Verification</span>
          {pendingMarketAdmins.length > 0 && (
            <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-mono rounded-full flex items-center justify-center">
              {pendingMarketAdmins.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('disputes')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 relative ${
            activeAdminTab === 'disputes'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Trade Disputes</span>
          {openDisputes.length > 0 && (
            <span className="w-4 h-4 bg-rose-500 text-white text-[9px] font-mono rounded-full flex items-center justify-center">
              {openDisputes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('reviews')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'reviews'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Confidential FPO Vault</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('blockchain')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'blockchain'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Ledger Blocks ({blockchainBlocks.length})</span>
        </button>
      </div>

      {/* TAB 0: SELL REQUESTS & COMMISSION AUDIT LEDGER */}
      {activeAdminTab === 'sell_requests' && (
        <SellRequestsSection
          role="admin"
          sellRequests={sellRequests}
          onViewRequestDetails={(req) => {
            if (onViewSellRequest) onViewSellRequest(req);
          }}
        />
      )}

      {/* TAB 1: PLATFORM OVERVIEW */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs stat-card-hover cursor-default">
              <span className="text-xs text-slate-500">Gross Traded GMV</span>
              <p className="text-xl font-mono font-bold text-slate-900 mt-1">₹4.28 Cr</p>
              <span className="text-[10px] font-mono text-emerald-700">+22% month-on-month</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs stat-card-hover cursor-default">
              <span className="text-xs text-slate-500">Traded Volume</span>
              <p className="text-xl font-mono font-bold text-slate-900 mt-1">6,420 Q</p>
              <span className="text-[10px] text-slate-500">Cotton, Paddy, Chilli</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs stat-card-hover cursor-default">
              <span className="text-xs text-slate-500">Registered Farmers</span>
              <p className="text-xl font-mono font-bold text-slate-900 mt-1">1,248</p>
              <span className="text-[10px] text-slate-500">Across 8 Districts</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs stat-card-hover cursor-default">
              <span className="text-xs text-slate-500">Verified Market Admins</span>
              <p className="text-xl font-mono font-bold text-slate-900 mt-1">
                {verifiedMarketAdminsCount}
              </p>
              <span className="text-[10px] font-mono text-emerald-700">100% KYC Approved</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Market Linkage Impact Assessment Summary</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              KisanSetu has eliminated traditional informal commission charges (up to 4-8%) by enabling direct APMC market admin price governance. The Net Value price calculation ensures farmers avoid misleading gross prices with high transit leakage, boosting take-home income by an average of <strong className="font-mono text-slate-900">₹320 per quintal</strong>.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MARKET ADMIN KYC VERIFICATION WORKBENCH */}
      {activeAdminTab === 'market_admins' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Market Admin KYC & Verification Approval Workbench
            </h3>
            <p className="text-xs text-slate-500">
              Strictly verify APMC Mandi credentials, license, and market committee details before market admins manage vegetable prices.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {users
              .filter((u) => u.role === 'market_admin' || (u.role as string) === 'market')
              .map((admin) => (
                <div key={admin.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{admin.businessName || admin.name}</span>
                      {admin.isVerified ? (
                        <span className="bg-slate-100 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-amber-700 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200">
                          PENDING APPROVAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Contact: {admin.name} ({admin.phone}) • GST: {admin.gstNumber || '36AAACT8492K1ZF'} • PAN: {admin.panCard || 'AAACT8492K'}
                    </p>
                  </div>

                  {!admin.isVerified ? (
                    <button
                      onClick={() => verifyHandler(admin.id)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer"
                    >
                      Approve & Grant Badge
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-slate-500">
                      Approved by Directorate
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTE MANAGEMENT */}
      {activeAdminTab === 'disputes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Trade Dispute Resolution Tribunal
            </h3>
            <p className="text-xs text-slate-500">
              Mediate pricing, weighment, and quality classification issues between farmers, FPOs, and market committees.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {disputes.map((disp) => (
              <div key={disp.id} className="py-3.5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {disp.id}
                    </span>
                    <strong className="text-slate-900 text-sm">Order {disp.orderId}</strong>
                    <span className="text-xs text-slate-500">Category: {disp.type}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                      disp.status === 'Open'
                        ? 'bg-slate-50 border-slate-200 text-rose-700'
                        : 'bg-slate-50 border-slate-200 text-emerald-700'
                    }`}
                  >
                    {disp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  “{disp.description}” — <span className="font-semibold text-slate-900">Raised by {disp.raisedByName} ({disp.raisedByRole})</span>
                </p>

                {disp.adminResolutionNotes && (
                  <p className="text-xs text-slate-700 bg-slate-100/60 p-2.5 rounded-lg border border-slate-200 font-mono">
                    <strong className="text-slate-900">Ruling:</strong> {disp.adminResolutionNotes}
                  </p>
                )}

                {disp.status === 'Open' && (
                  <button
                    onClick={() => setSelectedDispute(disp)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Adjudicate Dispute</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONFIDENTIAL MUTUAL REVIEW VAULT & ₹1,00,000 FRAUD PENALTY (Section 26) */}
      {activeAdminTab === 'reviews' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Confidential Mutual Review Vault
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Encrypted evaluations submitted between farmers and FPOs. Visible ONLY to Government Directorate.
              </p>
            </div>
            <span className="bg-slate-100 text-slate-800 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200">
              Statutory ₹1L Fine Clause
            </span>
          </div>

          <div className="space-y-3">
            {fpoReviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                  rev.isScamReport
                    ? 'bg-slate-50 border-rose-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">FPO: {rev.fpoName}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span>Farmer: <strong className="text-slate-900">{rev.farmerName}</strong></span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-amber-600 font-mono font-bold">★ {rev.rating} / 5</span>
                  </div>

                  {rev.isScamReport && (
                    <span className="bg-rose-600 text-white font-mono font-semibold px-2 py-0.5 rounded text-[10px]">
                      FRAUD REPORTED
                    </span>
                  )}
                </div>

                <p className="text-xs italic bg-white p-2 rounded border border-slate-200 text-slate-600">
                  “{rev.reviewText}”
                </p>

                {rev.penaltyAmount ? (
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded font-mono text-slate-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fine Levied: ₹{rev.penaltyAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : rev.isScamReport ? (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onLevyPenalty(rev.id, 100000)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Levy ₹1,00,000 Fine & Suspend License</span>
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: IMMUTABLE BLOCKCHAIN LEDGER EXPLORER (Section 27) */}
      {activeAdminTab === 'blockchain' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-700" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Decentralized Settlement Ledger
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Trades and bank payouts hashed into cryptographic blocks with tamper-evident proof.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Proof-of-Trade Protocol v1.4
            </span>
          </div>

          <div className="space-y-3">
            {blockchainBlocks.map((block) => (
              <div
                key={block.index}
                className="p-3.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs space-y-2 border border-slate-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold">
                    Block #{block.index}
                  </span>
                  <span className="text-[11px]">Timestamp: {block.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">TX ID:</span>{' '}
                    <span className="text-white">{block.txId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Order Ref:</span>{' '}
                    <span className="text-amber-400">{block.orderId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Buyer:</span>{' '}
                    <span className="text-white">{block.sender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Farmer:</span>{' '}
                    <span className="text-emerald-300 font-semibold">{block.receiver}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Crop:</span>{' '}
                    <span className="text-white">{block.cropDetails}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Amount:</span>{' '}
                    <span className="text-emerald-400 font-bold">
                      ₹{block.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] space-y-0.5 text-slate-400">
                  <div className="truncate">
                    <span className="text-slate-500">Prev Hash:</span> {block.previousHash}
                  </div>
                  <div className="truncate text-emerald-400">
                    <span className="text-slate-500">Hash:</span> {block.hash}
                  </div>
                  <div className="text-slate-500">
                    Verified By: {block.verifiedBy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISPUTE RESOLUTION MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Resolve Dispute {selectedDispute.id}
              </h3>
              <button
                onClick={() => setSelectedDispute(null)}
                className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3 text-xs">
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Issue: “{selectedDispute.description}”
              </p>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tribunal Resolution Order
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Weighbridge calibration checked. Buyer ordered to disburse balance ₹12,000 without penalty."
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Statutory Penalty Amount (if any, ₹)
                </label>
                <input
                  type="number"
                  value={penaltyInput}
                  onChange={(e) => setPenaltyInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer"
                >
                  Issue Final Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
