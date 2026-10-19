import { Sprout, Building2, Truck, Shield } from "lucide-react";
export const FarmOperationsSection = ({
  role,
  data,
  onChange,
  disabled = false
}) => {
  return <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs border ${role === "farmer" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : role === "fpo" ? "bg-blue-50 text-blue-700 border-blue-200" : role === "market_admin" || role === "market" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : role === "transporter" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-800 border-slate-300"}`}
  >
            {role === "farmer" ? <Sprout className="w-5 h-5" /> : role === "fpo" ? <Building2 className="w-5 h-5" /> : role === "market_admin" || role === "market" ? <Building2 className="w-5 h-5" /> : role === "transporter" ? <Truck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>
                {role === "farmer" ? "Farm & Agronomic Details" : role === "fpo" ? "FPO & Organization Details" : role === "market_admin" || role === "market" ? "Market Administration & APMC Yard Details" : role === "transporter" ? "Fleet & Logistics Operations" : "Platform Administrative Privileges"}
              </span>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 capitalize">
                {role}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {role === "farmer" ? "Update your cultivated land area, soil profile, irrigation, and crop rotation specs." : "Role-specific operational details used for digital contracts and ecosystem discovery."}
            </p>
          </div>
        </div>
      </div>

      {
    /* Role === 'farmer' */
  }
      {role === "farmer" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm / Estate Name *
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.farmName || ""}
    onChange={(e) => onChange({ farmName: e.target.value })}
    placeholder="e.g. Ramesh Reddy Agro Farm"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm Location / Survey No.
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.farmLocation || ""}
    onChange={(e) => onChange({ farmLocation: e.target.value })}
    placeholder="e.g. Survey #142/A, Hasanparthy"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Cultivated Area (Acres) *
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.farmSize || ""}
    onChange={(e) => onChange({ farmSize: e.target.value })}
    placeholder="e.g. 5.5 Acres"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Land Ownership Status
            </label>
            <select
    disabled={disabled}
    value={data.landOwnership || "Self-Owned Land"}
    onChange={(e) => onChange({ landOwnership: e.target.value })}
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  >
              <option value="Self-Owned Land">Self-Owned Land (Pattadar)</option>
              <option value="Tenant Cultivator">Tenant Cultivator (Kauldar)</option>
              <option value="Joint Family Land">Joint Family Ancestral Land</option>
              <option value="Leasehold">Long-term Leasehold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Cash Crops *
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.primaryCrops || ""}
    onChange={(e) => onChange({ primaryCrops: e.target.value })}
    placeholder="e.g. Cotton, Paddy, Turmeric"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Secondary / Intercrops
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.secondaryCrops || ""}
    onChange={(e) => onChange({ secondaryCrops: e.target.value })}
    placeholder="e.g. Red Chilli, Marigold, Green Gram"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farming Method
            </label>
            <select
    disabled={disabled}
    value={data.farmingType || "Natural Farming (ZBNF)"}
    onChange={(e) => onChange({ farmingType: e.target.value })}
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  >
              <option value="Natural Farming (ZBNF)">Natural Farming / ZBNF</option>
              <option value="Certified Organic">Certified Organic (NPOP/PGS)</option>
              <option value="Integrated / Conventional">Integrated / Modern Conventional</option>
              <option value="Hydroponic / Polyhouse">Polyhouse / Protected Cultivation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Irrigation Infrastructure
            </label>
            <select
    disabled={disabled}
    value={data.irrigationType || "Drip Irrigation"}
    onChange={(e) => onChange({ irrigationType: e.target.value })}
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  >
              <option value="Drip Irrigation">Micro Drip Irrigation</option>
              <option value="Canal / Lift">Canal / Government Lift Irrigation</option>
              <option value="Borewell / Tubewell">Borewell / Open Well</option>
              <option value="Rainfed">Rainfed / Dryland</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soil Type
            </label>
            <select
    disabled={disabled}
    value={data.soilType || "Black Cotton Soil"}
    onChange={(e) => onChange({ soilType: e.target.value })}
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  >
              <option value="Black Cotton Soil">Black Cotton Soil (Regur)</option>
              <option value="Red Sandy Loam">Red Sandy Loam</option>
              <option value="Clayey Loam">Clayey Loam</option>
              <option value="Alluvial Soil">Alluvial / Riverbed Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farming Experience (Years)
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.experienceYears || ""}
    onChange={(e) => onChange({ experienceYears: e.target.value })}
    placeholder="e.g. 15 Years"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>
        </div>}

      {
    /* Role === 'fpo' */
  }
      {role === "fpo" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization / Producer Co. Name *
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.orgName || ""}
    onChange={(e) => onChange({ orgName: e.target.value })}
    placeholder="e.g. Kakatiya Farmers Producer Co."
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registration Number (CIN / ROC)
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.regNumber || ""}
    onChange={(e) => onChange({ regNumber: e.target.value })}
    placeholder="e.g. U01111TS2020PTC123456"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farmer Shareholder Count
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.memberCount || ""}
    onChange={(e) => onChange({ memberCount: e.target.value })}
    placeholder="e.g. 450 Farmers"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Aggregated Key Commodities
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.keyCommodities || ""}
    onChange={(e) => onChange({ keyCommodities: e.target.value })}
    placeholder="e.g. Cotton, Soybean, Maize, Turmeric"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Storage / Warehouse Capacity
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.storageCapacity || ""}
    onChange={(e) => onChange({ storageCapacity: e.target.value })}
    placeholder="e.g. 1000 Metric Tons"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headquarters / Operating District
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.orgLocation || ""}
    onChange={(e) => onChange({ orgLocation: e.target.value })}
    placeholder="e.g. Warangal Rural, Telangana"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />
          </div>
        </div>}

      {
    /* Role === 'market_admin' */
  }
      {(role === "market_admin" || role === "market") && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              APMC Mandi / Market Yard Name *
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.businessName || ""}
    onChange={(e) => onChange({ businessName: e.target.value })}
    placeholder="e.g. Warangal Vegetable Mandi Yard"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin License / Official Code
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.gstNumber || ""}
    onChange={(e) => onChange({ gstNumber: e.target.value.toUpperCase() })}
    placeholder="e.g. APMC-ADM-2024-WGL"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jurisdiction / Region
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.businessType || ""}
    onChange={(e) => onChange({ businessType: e.target.value })}
    placeholder="e.g. Warangal Urban & Rural Vegetable Clusters"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Regulated Vegetable Scope
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.cropPurchase || ""}
    onChange={(e) => onChange({ cropPurchase: e.target.value })}
    placeholder="e.g. Tomato, Onion, Potato, Brinjal, Chilli"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rate Update Cycle
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.paymentTerms || ""}
    onChange={(e) => onChange({ paymentTerms: e.target.value })}
    placeholder="e.g. Daily 06:00 AM & Real-time"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              APMC Mandi Yard Location
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.businessLocation || ""}
    onChange={(e) => onChange({ businessLocation: e.target.value })}
    placeholder="e.g. Enumamula Market Yard, Warangal"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
  />
          </div>
        </div>}

      {
    /* Role === 'transporter' */
  }
      {role === "transporter" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Vehicle Type *
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.vehicleType || ""}
    onChange={(e) => onChange({ vehicleType: e.target.value })}
    placeholder="e.g. 10-Ton Multi-Axle Lorry"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Registration Number / Fleet ID
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.vehicleNumber || ""}
    onChange={(e) => onChange({ vehicleNumber: e.target.value.toUpperCase() })}
    placeholder="e.g. TS 03 AB 4590"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operating Service Route / State
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.serviceArea || ""}
    onChange={(e) => onChange({ serviceArea: e.target.value })}
    placeholder="e.g. Telangana, Andhra Pradesh, Maharashtra"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payload Carrying Capacity
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.capacityTons || ""}
    onChange={(e) => onChange({ capacityTons: e.target.value })}
    placeholder="e.g. 12 Metric Tons"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GPS Real-time Tracking Enabled
            </label>
            <select
    disabled={disabled}
    value={data.gpsEnabled ? "true" : "false"}
    onChange={(e) => onChange({ gpsEnabled: e.target.value === "true" })}
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
  >
              <option value="true">Yes - GPS Tracking Active</option>
              <option value="false">No - Standard Fleet</option>
            </select>
          </div>
        </div>}

      {
    /* Role === 'admin' */
  }
      {role === "admin" && <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Administrator ID
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.adminId || ""}
    onChange={(e) => onChange({ adminId: e.target.value })}
    placeholder="ADM-001"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-700 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department / Office
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.adminDepartment || ""}
    onChange={(e) => onChange({ adminDepartment: e.target.value })}
    placeholder="Agriculture Operations & Grievances"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700 bg-white"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clearance Level
            </label>
            <input
    type="text"
    disabled={disabled}
    value={data.clearanceLevel || ""}
    onChange={(e) => onChange({ clearanceLevel: e.target.value })}
    placeholder="Tier 1 Root Custodian"
    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700 bg-white"
  />
          </div>
        </div>}
    </div>;
};
