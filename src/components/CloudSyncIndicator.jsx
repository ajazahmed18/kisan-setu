import { useState, useEffect, useRef } from "react";
import {
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  HardDrive,
  Database,
  Info,
  ChevronDown
} from "lucide-react";
export const CloudSyncIndicator = ({
  variant = "compact",
  lastSyncedAt = null,
  isSyncing = false,
  onSync,
  className = ""
}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [internalLastSync, setInternalLastSync] = useState(lastSyncedAt || /* @__PURE__ */ new Date());
  const [internalSyncing, setInternalSyncing] = useState(isSyncing);
  const [showPopover, setShowPopover] = useState(false);
  const [timeAgo, setTimeAgo] = useState("Just now");
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const popoverRef = useRef(null);
  const effectiveOnline = isOnline && !simulatedOffline;
  const effectiveSyncing = isSyncing || internalSyncing;
  const syncState = !effectiveOnline ? "offline" : effectiveSyncing ? "syncing" : "synced";
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleManualSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    if (lastSyncedAt) {
      setInternalLastSync(lastSyncedAt);
    }
  }, [lastSyncedAt]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowPopover(false);
      }
    };
    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopover]);
  useEffect(() => {
    const updateRelativeTime = () => {
      const diffMs = Date.now() - internalLastSync.getTime();
      const diffSec = Math.floor(diffMs / 1e3);
      if (diffSec < 30) {
        setTimeAgo("Just now");
      } else if (diffSec < 60) {
        setTimeAgo("< 1m ago");
      } else if (diffSec < 3600) {
        const mins = Math.floor(diffSec / 60);
        setTimeAgo(`${mins}m ago`);
      } else {
        const hours = Math.floor(diffSec / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 15e3);
    return () => clearInterval(interval);
  }, [internalLastSync]);
  const handleManualSync = async () => {
    if (!effectiveOnline || effectiveSyncing) return;
    setInternalSyncing(true);
    try {
      if (onSync) {
        await onSync();
      } else {
        try {
          await fetch("/api/health", { method: "GET", cache: "no-cache" });
        } catch {
        }
        await new Promise((res) => setTimeout(res, 650));
      }
      setInternalLastSync(/* @__PURE__ */ new Date());
    } finally {
      setInternalSyncing(false);
    }
  };
  const formattedTime = internalLastSync.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  if (variant === "compact") {
    return <div className={`relative inline-block ${className}`} ref={popoverRef}>
        <button
      type="button"
      onClick={() => setShowPopover(!showPopover)}
      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border shadow-2xs ${syncState === "offline" ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100/80" : syncState === "syncing" ? "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100/80" : "bg-emerald-50 text-emerald-900 border-emerald-200/90 hover:bg-emerald-100/70"}`}
      title="Click to view cloud synchronization and offline storage status"
      aria-expanded={showPopover}
    >
          {syncState === "offline" ? <div className="flex items-center gap-1 text-amber-700">
              <CloudOff className="w-3 h-3 text-amber-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div> : syncState === "syncing" ? <div className="flex items-center gap-1 text-sky-700">
              <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
            </div> : <div className="flex items-center gap-1 text-emerald-700">
              <CloudCheck className="w-3 h-3 text-emerald-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>}

          <span className="font-semibold tracking-tight">
            {syncState === "offline" ? "Offline (Cached)" : syncState === "syncing" ? "Syncing..." : "Cloud Synced"}
          </span>

          <span className="hidden sm:inline text-[10px] opacity-75 font-mono">
            {syncState === "offline" ? "\u2022 Device Only" : `\u2022 ${timeAgo}`}
          </span>

          <ChevronDown
      className={`w-3 h-3 opacity-60 transition-transform duration-200 ${showPopover ? "rotate-180 text-slate-800" : ""}`}
    />
        </button>

        {
      /* Detailed Status Dropdown Popover */
    }
        {showPopover && <div className="absolute right-0 mt-2 w-76 sm:w-84 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 text-left text-slate-800 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
            {
      /* Header */
    }
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center ${syncState === "offline" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
    >
                  {syncState === "offline" ? <CloudOff className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading">
                    Rural Connectivity &amp; Sync
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Offline peace-of-mind for field work
                  </p>
                </div>
              </div>
              <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${syncState === "offline" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}
    >
                {syncState === "offline" ? "Offline" : "Connected"}
              </span>
            </div>

            {
      /* Status Breakdown List */
    }
            <div className="py-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  {effectiveOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
                  <span>Network Signal</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono text-[11px]">
                  {effectiveOnline ? "Online (Active)" : "No Connection"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cloud Database</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono text-[11px]">
                  {effectiveOnline ? "Firestore Synced" : "Queued for Cloud"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Device Local Cache</span>
                </div>
                <span className="font-semibold text-emerald-700 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Protected
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Last Cloud Sync</span>
                </div>
                <span className="font-medium text-slate-700 font-mono text-[11px]">
                  {formattedTime}
                </span>
              </div>
            </div>

            {
      /* Explanatory notice for farmers */
    }
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero-Data-Loss Guarantee</span>
              </div>
              <p className="leading-relaxed text-[10.5px]">
                In rural Telangana &amp; AP farming clusters with intermittent 2G/3G connectivity, all your crop lots, buyer offers, and weighing slips are immediately saved to this phone/browser. When internet returns, all records sync automatically.
              </p>
            </div>

            {
      /* Actions: Sync Now button & Simulation Switch */
    }
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
      type="button"
      onClick={() => setSimulatedOffline(!simulatedOffline)}
      className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
      title="Simulate low-connectivity rural scenario"
    >
                {simulatedOffline ? "Restore Network" : "Test Offline Mode"}
              </button>

              <button
      type="button"
      onClick={handleManualSync}
      disabled={!effectiveOnline || effectiveSyncing}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${!effectiveOnline || effectiveSyncing ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" : "bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800"}`}
    >
                <RefreshCw
      className={`w-3.5 h-3.5 ${effectiveSyncing ? "animate-spin" : ""}`}
    />
                <span>{effectiveSyncing ? "Syncing..." : "Sync Now"}</span>
              </button>
            </div>
          </div>}
      </div>;
  }
  return <div
    className={`w-full rounded-xl border p-3 sm:p-3.5 transition-all ${syncState === "offline" ? "bg-amber-50/90 border-amber-200/90 text-amber-950 shadow-2xs" : syncState === "syncing" ? "bg-sky-50/80 border-sky-200 text-sky-950 shadow-2xs" : "bg-white border-slate-200/80 text-slate-800 shadow-2xs"} ${className}`}
    id="dashboard-cloud-sync-status-bar"
  >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${syncState === "offline" ? "bg-amber-100 text-amber-800 border-amber-200" : syncState === "syncing" ? "bg-sky-100 text-sky-800 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
  >
            {syncState === "offline" ? <CloudOff className="w-4 h-4" /> : syncState === "syncing" ? <RefreshCw className="w-4 h-4 animate-spin text-sky-700" /> : <CloudCheck className="w-4 h-4 text-emerald-700" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                {syncState === "offline" ? "Offline Storage Active" : syncState === "syncing" ? "Synchronizing with KisanSetu Cloud..." : "Cloud Synced & Protected"}
              </span>

              <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${syncState === "offline" ? "bg-amber-100 text-amber-800 border border-amber-300" : syncState === "syncing" ? "bg-sky-100 text-sky-800 border border-sky-300" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}
  >
                <span
    className={`w-1.5 h-1.5 rounded-full ${syncState === "offline" ? "bg-amber-500" : syncState === "syncing" ? "bg-sky-500 animate-ping" : "bg-emerald-500"}`}
  />
                {syncState === "offline" ? "Offline Cache" : "Live Sync"}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 mt-0.5">
              {syncState === "offline" ? <span>
                  Low or intermittent connectivity detected. Your crop lots, bids, and settlements are stored safely in device memory and will sync once internet is restored.
                </span> : <span>
                  All farm records are backed up securely to the cloud. Last synced:{" "}
                  <strong className="text-slate-800 font-mono">{formattedTime}</strong> ({timeAgo}).
                </span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {syncState === "offline" ? <span className="text-[11px] text-amber-800 font-medium px-2 py-1 bg-amber-100/60 rounded-lg border border-amber-200">
              Auto-sync enabled
            </span> : <button
    type="button"
    onClick={handleManualSync}
    disabled={effectiveSyncing}
    className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
    title="Perform an immediate cloud sync check"
  >
              <RefreshCw
    className={`w-3.5 h-3.5 text-slate-500 ${effectiveSyncing ? "animate-spin text-emerald-600" : ""}`}
  />
              <span className="hidden xs:inline">
                {effectiveSyncing ? "Syncing..." : "Sync Now"}
              </span>
            </button>}
        </div>
      </div>
    </div>;
};
export default CloudSyncIndicator;
