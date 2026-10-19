export const FarmerHeroBackdrop = ({ selectedRole = "farmer" }) => {
  return <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#07130a] pointer-events-none select-none">
      {
    /* ========================================================= */
  }
      {
    /* 1. FARMER BACKDROP LAYER (Original Reference Image)       */
  }
      {
    /* ========================================================= */
  }
      <div
    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${selectedRole === "farmer" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
  >
        {
    /* Native HTML Image: 100% guaranteed mobile rendering and razor-sharp portrait focal positioning */
  }
        <img
    src="/farmer_hero.jpg"
    alt="Indian Farmer in Mustard Field"
    className="absolute inset-0 w-full h-full object-cover object-[55%_12%] sm:object-center select-none pointer-events-none"
    loading="eager"
  />

        {
    /* SVG Atmospheric Layer with Isolated Backside Animations */
  }
        <svg
    viewBox="0 0 1200 896"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full absolute inset-0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
          <defs>
            {
    /* 1. Fine Wind Turbulence for Left & Right Crop Fields */
  }
            <filter id="farmerPlantsWindFilter" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
              <feTurbulence
    type="fractalNoise"
    baseFrequency="0.014 0.028"
    numOctaves="2"
    seed="7"
    result="plantNoise"
  >
                <animate
    attributeName="baseFrequency"
    values="0.014 0.028; 0.02 0.04; 0.016 0.032; 0.014 0.028"
    dur="6.5s"
    repeatCount="indefinite"
  />
              </feTurbulence>
              <feDisplacementMap
    in="SourceGraphic"
    in2="plantNoise"
    scale="10"
    xChannelSelector="R"
    yChannelSelector="G"
  />
            </filter>

            {
    /* 2. Micro-Fabric Turbulence for Towel Cloth (Gentle, isolated, no shearing) */
  }
            <filter id="farmerTowelBreezeFilter" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
              <feTurbulence
    type="fractalNoise"
    baseFrequency="0.028 0.055"
    numOctaves="2"
    seed="12"
    result="clothNoise"
  >
                <animate
    attributeName="baseFrequency"
    values="0.028 0.055; 0.038 0.075; 0.032 0.062; 0.028 0.055"
    dur="4s"
    repeatCount="indefinite"
  />
              </feTurbulence>
              <feDisplacementMap
    in="SourceGraphic"
    in2="clothNoise"
    scale="4"
    xChannelSelector="R"
    yChannelSelector="B"
  />
            </filter>

            {
    /* 3. Soft Gaussian Blur for Feathered Towel Edges */
  }
            <filter id="featherTowelEdge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>

            {
    /* 4. Smooth Fade Gradients for Left and Right Crops */
  }
            <linearGradient id="fadeLeftCrops" x1="0" y1="460" x2="0" y2="580" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="fadeRightCrops" x1="0" y1="460" x2="0" y2="580" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>

            {
    /* 
      5. CRITICAL MASK: Strictly isolates ONLY side crops.
      Farmer's body, arms, wrists, and hand are within x: 385..770.
      By keeping x: 385..770 completely black, the farmer's hand and body NEVER move!
    */
  }
            <mask id="farmerPlantsStrictMask">
              {
    /* Pitch black base */
  }
              <rect x="0" y="0" width="1200" height="896" fill="black" />
              {
    /* Left crops area only: x: 0 to 385 */
  }
              <rect x="0" y="460" width="385" height="120" fill="url(#fadeLeftCrops)" />
              <rect x="0" y="580" width="385" height="316" fill="white" />
              {
    /* Right crops area only: x: 770 to 1200 */
  }
              <rect x="770" y="460" width="430" height="120" fill="url(#fadeRightCrops)" />
              <rect x="770" y="580" width="430" height="316" fill="white" />
            </mask>

            {
    /* 
      6. TOWEL MASK: Strictly targets only the draped gamcha cloth on the left shoulder.
      Bounded strictly to x: 628..696, y: 260..510.
      Hand is at y: 700..890, well below! Sleeve is to the right (x > 700).
    */
  }
            <mask id="farmerTowelStrictMask">
              <rect x="0" y="0" width="1200" height="896" fill="black" />
              <g filter="url(#featherTowelEdge)">
                {
    /* Draped cloth contour polygon */
  }
                <path
    d="M 635 265 C 648 256, 664 260, 672 274 C 682 300, 693 360, 690 425 C 688 465, 684 502, 670 508 C 655 508, 646 460, 640 400 C 634 340, 627 285, 635 265 Z"
    fill="white"
  />
              </g>
            </mask>

            {
    /* 7. Backside Sunlight Breeze Wave Gradient */
  }
            <linearGradient id="windBreezeGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
              <stop offset="35%" stopColor="#86efac" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="65%" stopColor="#86efac" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>

          {
    /* Effect Layer 1: Plants Wind Breeze (Strictly Side Crops Only, Hand Untouched) */
  }
          <g mask="url(#farmerPlantsStrictMask)">
            <image
    href="/farmer_hero.jpg"
    xlinkHref="/farmer_hero.jpg"
    x="0"
    y="0"
    width="1200"
    height="896"
    preserveAspectRatio="xMidYMid slice"
    filter="url(#farmerPlantsWindFilter)"
  />

            {
    /* Backside Wind Breeze Wave sweeping across side crops */
  }
            <rect
    x="-450"
    y="480"
    width="450"
    height="416"
    fill="url(#windBreezeGleam)"
    transform="skewX(-14)"
  >
              <animate
    attributeName="x"
    values="-500; 1350"
    dur="8s"
    repeatCount="indefinite"
  />
            </rect>
          </g>

          {
    /* Effect Layer 2: Towel Fabric Flutter (Strictly towel cloth only, hand untouched) */
  }
          <g mask="url(#farmerTowelStrictMask)">
            <image
    href="/farmer_hero.jpg"
    xlinkHref="/farmer_hero.jpg"
    x="0"
    y="0"
    width="1200"
    height="896"
    preserveAspectRatio="xMidYMid slice"
    filter="url(#farmerTowelBreezeFilter)"
  />
          </g>
        </svg>
      </div>

      {
    /* ========================================================= */
  }
      {
    /* 2. MARKET ADMIN BACKDROP LAYER (Wholesale APMC Mandi & Pricing) */
  }
      {
    /* ========================================================= */
  }
      <div
    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${selectedRole === "market_admin" || selectedRole === "market" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
  >
        {
    /* Native HTML Image for 100% Mobile Reliability */
  }
        <img
    src="/buyer_hero.jpg"
    alt="APMC Market Administrator"
    className="absolute inset-0 w-full h-full object-cover object-[50%_15%] sm:object-center select-none pointer-events-none"
    loading="eager"
  />

        <svg
    viewBox="0 0 1376 768"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full absolute inset-0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
          <defs>
            {
    /* Background Market Ambient Golden Glow */
  }
            <linearGradient id="marketAdminBacklightGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
              <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.10" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>

            <mask id="marketAdminBackgroundOnlyMask">
              <rect x="0" y="0" width="1376" height="768" fill="black" />
              {
    /* Background ambient area only (behind market admin) */
  }
              <rect x="0" y="0" width="550" height="768" fill="white" />
            </mask>
          </defs>

          {
    /* Subtle Backside Golden Market Ambiance Sweeping Across Background */
  }
          <g mask="url(#marketAdminBackgroundOnlyMask)">
            <rect
    x="-400"
    y="0"
    width="450"
    height="768"
    fill="url(#marketAdminBacklightGleam)"
    transform="skewX(-16)"
  >
              <animate
    attributeName="x"
    values="-450; 1400"
    dur="9s"
    repeatCount="indefinite"
  />
            </rect>
          </g>
        </svg>
      </div>

      {
    /* ========================================================= */
  }
      {
    /* 3. FPO BACKDROP LAYER (Farmer Producer Organization)      */
  }
      {
    /* ========================================================= */
  }
      <div
    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${selectedRole === "fpo" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
  >
        {
    /* Native HTML Image for 100% Mobile Reliability */
  }
        <img
    src="/fpo_hero.jpg"
    alt="Farmer Producer Organization"
    className="absolute inset-0 w-full h-full object-cover object-[50%_18%] sm:object-center select-none pointer-events-none"
    loading="eager"
  />

        <svg
    viewBox="0 0 1376 768"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full absolute inset-0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
          <defs>
            {
    /* Background Sky & Trees Ambient Daylight Shimmer */
  }
            <linearGradient id="fpoDaylightGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="40%" stopColor="#34d399" stopOpacity="0.10" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#34d399" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            <mask id="fpoBackgroundOnlyMask">
              <rect x="0" y="0" width="1376" height="768" fill="black" />
              {
    /* Background greenery & facility behind FPO leaders */
  }
              <rect x="0" y="0" width="600" height="420" fill="white" />
            </mask>
          </defs>

          {
    /* Subtle Backside Daylight Breeze Sweeping Behind Warehouse & Trees */
  }
          <g mask="url(#fpoBackgroundOnlyMask)">
            <rect
    x="-400"
    y="0"
    width="450"
    height="500"
    fill="url(#fpoDaylightGleam)"
    transform="skewX(-12)"
  >
              <animate
    attributeName="x"
    values="-450; 1400"
    dur="10s"
    repeatCount="indefinite"
  />
            </rect>
          </g>
        </svg>
      </div>

      {
    /* ========================================================= */
  }
      {
    /* 4. TRANSPORTER BACKDROP LAYER (Logistics & Farm Freight)  */
  }
      {
    /* ========================================================= */
  }
      <div
    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${selectedRole === "transporter" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
  >
        {
    /* Native HTML Image for 100% Mobile Reliability */
  }
        <img
    src="/transporter_hero.jpg"
    alt="Agri Transport and Logistics"
    className="absolute inset-0 w-full h-full object-cover object-[50%_18%] sm:object-center select-none pointer-events-none"
    loading="eager"
  />

        <svg
    viewBox="0 0 1376 768"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full absolute inset-0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
          <defs>
            {
    /* Background Highway Horizon Morning Breeze */
  }
            <linearGradient id="transporterHighwayGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.10" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>

            <mask id="transporterBackgroundOnlyMask">
              <rect x="0" y="0" width="1376" height="768" fill="black" />
              {
    /* Background open highway and distant fields */
  }
              <rect x="0" y="0" width="620" height="480" fill="white" />
            </mask>
          </defs>

          {
    /* Subtle Backside Morning Horizon Breeze */
  }
          <g mask="url(#transporterBackgroundOnlyMask)">
            <rect
    x="-400"
    y="0"
    width="450"
    height="550"
    fill="url(#transporterHighwayGleam)"
    transform="skewX(-15)"
  >
              <animate
    attributeName="x"
    values="-450; 1400"
    dur="9.5s"
    repeatCount="indefinite"
  />
            </rect>
          </g>
        </svg>
      </div>

      {
    /* ========================================================= */
  }
      {
    /* 5. ADMIN BACKDROP LAYER (Operations, Governance & Mandi)  */
  }
      {
    /* ========================================================= */
  }
      <div
    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${selectedRole === "admin" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
  >
        {
    /* Native HTML Image for 100% Mobile Reliability */
  }
        <img
    src="/admin_hero.jpg"
    alt="Agricultural Operations Administrator"
    className="absolute inset-0 w-full h-full object-cover object-[50%_20%] sm:object-center select-none pointer-events-none"
    loading="eager"
  />

        <svg
    viewBox="0 0 1376 768"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full absolute inset-0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
          <defs>
            {
    /* Background Control Center Ambient Data Gleam */
  }
            <linearGradient id="adminControlGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            <mask id="adminBackgroundOnlyMask">
              <rect x="0" y="0" width="1376" height="768" fill="black" />
              {
    /* Background screens and ambient control room only */
  }
              <rect x="0" y="0" width="1376" height="420" fill="white" />
            </mask>
          </defs>

          {
    /* Subtle Backside Operations Pulse */
  }
          <g mask="url(#adminBackgroundOnlyMask)">
            <rect
    x="-400"
    y="0"
    width="450"
    height="550"
    fill="url(#adminControlGleam)"
    transform="skewX(-15)"
  >
              <animate
    attributeName="x"
    values="-450; 1400"
    dur="9s"
    repeatCount="indefinite"
  />
            </rect>
          </g>
        </svg>
      </div>

      {
    /* Clean, subtle depth overlay: Ultra-light on mobile so the vehicle, crops, people and scenery are brightly visible */
  }
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30 lg:bg-gradient-to-r lg:from-black/20 lg:via-transparent lg:to-black/25 pointer-events-none" />
    </div>;
};
