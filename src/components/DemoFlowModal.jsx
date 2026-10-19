import { useState } from "react";
import {
  PlayCircle,
  ArrowRight
} from "lucide-react";
export const DemoFlowModal = ({
  isOpen,
  onClose,
  onJumpToSection,
  onOpenIVR
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const demoSteps = [
    {
      title: "Step 1: Farmer Logs In",
      desc: "The authenticated farmer signs in to KisanSetu with Google Authentication. He holds 50 Quintals of harvested BT Cotton ready for sale.",
      actionLabel: "Go to Farmer Portal",
      tab: "dashboard",
      role: "farmer",
      highlight: "Farmer Profile: 50 Quintals Cotton ready for price discovery."
    },
    {
      title: "Step 2: Transparent Mandi Comparison",
      desc: "The farmer inspects live APMC mandi prices: Warangal is \u20B97,400, Nizamabad is \u20B97,300, and Hyderabad is \u20B97,100.",
      actionLabel: "View Mandi Price Matrix",
      tab: "markets",
      highlight: "Multi-mandi benchmark prevents local middlemen price suppression."
    },
    {
      title: "Step 3: Net-Profit Price Discovery Engine",
      desc: "Algorithm calculates: NET PROFIT = PRICE - TRANSPORT. Warangal (\u20B97,400 - \u20B9300 = \u20B97,100) recommended over Hyderabad (\u20B97,100 - \u20B9500 = \u20B96,600).",
      actionLabel: "Check Net Profit Analysis",
      tab: "markets",
      highlight: "Recommends highest take-home net profit, not just highest gross headline rate."
    },
    {
      title: "Step 4: Create Crop Lot with Quality Inspection",
      desc: "The farmer creates a listing: 50 Quintals Cotton, Grade A, 8.5% Moisture. The optical scanner inspects the photo and verifies authentic agricultural produce.",
      actionLabel: "Inspect Active Crop Lots",
      tab: "dashboard",
      role: "farmer",
      highlight: "Produce verification prevents non-crop uploads."
    },
    {
      title: "Step 5: Market Admin Regulates APMC Rates",
      desc: "The certified Market Admin updates commodity & vegetable modal rates: Modal APMC Rate (\u20B97,400), MSP Benchmark (\u20B97,120), and Arrival Volumes.",
      actionLabel: "View Market Admin Portal",
      tab: "dashboard",
      role: "market_admin",
      highlight: "Transparent APMC price bulletin ensures farmers get authentic benchmark rates."
    },
    {
      title: "Step 6: Farmer Locks In Direct Contract",
      desc: "Farmer confirms procurement trade at the official APMC benchmark of \u20B97,400/quintal. Total contract value generated: \u20B93,70,000.",
      actionLabel: "Inspect Accepted Contract",
      tab: "dashboard",
      role: "farmer",
      highlight: "Zero middlemen cuts or unauthorized deductions."
    },
    {
      title: "Step 7: Heavy Lorry Transport Auto-Assigned",
      desc: "Since load is 50 Quintals (5 Tonnes, which exceeds 1 Tonne), the system automatically selects a Heavy Lorry (10T) for optimal freight cost.",
      actionLabel: "View Logistics Assignment",
      tab: "dashboard",
      role: "transporter",
      highlight: "Heavy lorry allocated with driver Shankar Rao (TS 03 UA 5678)."
    },
    {
      title: "Step 8: 10-Stage Order Tracking & Delivery",
      desc: "Order advances through live visual timeline: Scheduled -> Picked Up -> In Transit -> Delivered -> Quality Verified at destination mill.",
      actionLabel: "Track 10-Stage Timeline",
      tab: "dashboard",
      role: "farmer",
      highlight: "Complete end-to-end milestone transparency."
    },
    {
      title: "Step 9: Direct Bank Settlement & Immutable Blockchain Hash",
      desc: "Full \u20B93,70,000 is directly credited to the farmer\u2019s Bank Account via RTGS. A tamper-evident cryptographic block is mined into the Blockchain Ledger.",
      actionLabel: "Inspect Blockchain Ledger",
      tab: "blockchain",
      highlight: "Permanent cryptographic proof of trade & settlement."
    },
    {
      title: "Step 10: Non-Smartphone Access via Toll-Free IVR",
      desc: "For smallholder farmers without smartphones, dialing 1800-425-166 provides instant price quotes, best mandi advice, and FPO field officer hotlines.",
      actionLabel: "Open 1800 IVR Simulator",
      tab: "ivr",
      highlight: "Inclusive rural access in Telugu, Hindi, and English."
    }
  ];
  const current = demoSteps[currentStep];
  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleExecuteAction = () => {
    if (current.tab === "ivr") {
      onOpenIVR();
    } else {
      onJumpToSection(current.tab, current.role);
    }
    onClose();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full p-5 shadow-xl border border-slate-200 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
              <PlayCircle className="w-4 h-4 text-slate-700" />
            </span>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                KisanSetu End-to-End Walkthrough
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Step {currentStep + 1} of {demoSteps.length}
              </p>
            </div>
          </div>
          <button
    onClick={onClose}
    className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer"
  >
            ✕
          </button>
        </div>

        {
    /* Step Progress indicators */
  }
        <div className="flex items-center gap-1">
          {demoSteps.map((s, idx) => <button
    key={idx}
    onClick={() => setCurrentStep(idx)}
    className={`h-1 flex-1 rounded-full transition-all cursor-pointer ${idx === currentStep ? "bg-slate-900" : idx < currentStep ? "bg-slate-400" : "bg-slate-200"}`}
    title={s.title}
  />)}
        </div>

        {
    /* Step Detail Card */
  }
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
            {current.title}
          </span>
          <h4 className="text-xs sm:text-sm font-medium text-slate-900 leading-normal">
            {current.desc}
          </h4>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-medium text-slate-900">Key Impact: </span>
            <span>{current.highlight}</span>
          </div>
        </div>

        {
    /* Modal Controls */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-1.5">
            <button
    onClick={handlePrev}
    disabled={currentStep === 0}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-md disabled:opacity-40 cursor-pointer"
  >
              Previous
            </button>
            <button
    onClick={handleNext}
    disabled={currentStep === demoSteps.length - 1}
    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-md disabled:opacity-40 cursor-pointer"
  >
              Next Step
            </button>
          </div>

          <button
    onClick={handleExecuteAction}
    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
  >
            <span>{current.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>;
};
