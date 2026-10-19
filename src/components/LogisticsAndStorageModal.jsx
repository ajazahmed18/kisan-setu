import { useState } from "react";
import {
  Truck,
  Building2
} from "lucide-react";
export const LogisticsAndStorageModal = ({
  isOpen,
  onClose,
  transporters,
  warehouses,
  defaultTab = "transport"
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-xl border border-slate-200 space-y-4 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <button
    onClick={() => setActiveTab("transport")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "transport" ? "bg-slate-900 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"}`}
  >
              <Truck className="w-3.5 h-3.5" />
              <span>Lorries & Freight ({transporters.length})</span>
            </button>

            <button
    onClick={() => setActiveTab("storage")}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "storage" ? "bg-slate-900 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"}`}
  >
              <Building2 className="w-3.5 h-3.5" />
              <span>Warehouses & Godowns ({warehouses.length})</span>
            </button>
          </div>

          <button
    onClick={onClose}
    className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer"
  >
            ✕
          </button>
        </div>

        {bookingSuccess && <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium text-center">
            ✓ {bookingSuccess}
          </div>}

        {
    /* TAB 1: TRANSPORT */
  }
        {activeTab === "transport" && <div className="space-y-3.5">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-0.5">
              <strong className="text-slate-900 font-medium">Logistics Allocation: </strong>
              <span>
                For crop lots exceeding 1 Tonne (10 Quintals), Heavy Lorry (10T) or Multi-Axle vehicles reduce transport leakage down to ₹250-₹300/Q.
              </span>
            </div>

            <div className="space-y-2.5">
              {transporters.map((t) => <div
    key={t.id}
    className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
  >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{t.vehicleType}</span>
                      <span className="font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                        {t.vehicleNumber}
                      </span>
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {t.capacityTonnes}T Capacity
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Operator: <span className="font-medium text-slate-800">{t.transporterName}</span> • Driver: {t.driverName} ({t.driverPhone})
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Location: {t.baseLocation} • Tariff: <span className="text-slate-900 font-semibold">₹{t.pricePerKm}/km</span>
                    </p>
                  </div>

                  <button
    onClick={() => {
      setBookingSuccess(`Booking request dispatched to driver ${t.driverName}. Driver will contact within 15 minutes.`);
      setTimeout(() => setBookingSuccess(null), 3e3);
    }}
    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md shadow-2xs transition-colors cursor-pointer shrink-0"
  >
                    Request Vehicle
                  </button>
                </div>)}
            </div>
          </div>}

        {
    /* TAB 2: STORAGE */
  }
        {activeTab === "storage" && <div className="space-y-3.5">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-0.5">
              <strong className="text-slate-900 font-medium">Distress Sale Prevention: </strong>
              <span>
                Farmers can deposit produce in accredited CWC / TSWC godowns with e-NWR warehouse receipts and access pledge finance up to 70%.
              </span>
            </div>

            <div className="space-y-2.5">
              {warehouses.map((w) => <div
    key={w.id}
    className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
  >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{w.name}</span>
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {w.type}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Location: {w.location} • Total Capacity: <span className="font-mono font-medium">{w.capacityMetricTonnes.toLocaleString()} MT</span>
                    </p>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Available: <span className="font-mono">{w.availableCapacityMT.toLocaleString()} MT</span> • Charge: <span className="font-mono font-semibold">₹{w.dailyRatePerQuintal}/Q/mo</span>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Features: {w.features.join(" \u2022 ")}
                    </p>
                  </div>

                  <button
    onClick={() => {
      setBookingSuccess(`Storage slot reserved at ${w.name}. e-NWR receipt slip initiated.`);
      setTimeout(() => setBookingSuccess(null), 3e3);
    }}
    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md shadow-2xs transition-colors cursor-pointer shrink-0"
  >
                    Reserve Storage
                  </button>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
};
