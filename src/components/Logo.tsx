import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const XoSoDayLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Fidelity Vector SVG Badge Replicating "Xổ số đây" */}
      <svg
        viewBox="0 0 500 500"
        className={`${sizeMap[size]} shrink-0 drop-shadow-md`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Golden Orbit Gradient */}
          <linearGradient id="goldOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Red Ball 8 Gradient */}
          <radialGradient id="redBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FF7B7B" />
            <stop offset="30%" stopColor="#EF4444" />
            <stop offset="75%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>

          {/* Blue Ball 36 Gradient */}
          <radialGradient id="blueBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="40%" stopColor="#2563EB" />
            <stop offset="85%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#172554" />
          </radialGradient>

          {/* Green Ball 16 Gradient */}
          <radialGradient id="greenBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="40%" stopColor="#16A34A" />
            <stop offset="85%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>

          {/* Orange Ball 27 Gradient */}
          <radialGradient id="orangeBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="40%" stopColor="#F97316" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </radialGradient>

          {/* Purple Ball 5 Gradient */}
          <radialGradient id="purpleBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E879F9" />
            <stop offset="40%" stopColor="#A855F7" />
            <stop offset="85%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#581C87" />
          </radialGradient>

          {/* Center Text Gold 3D Gradient */}
          <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Navy Banner Gradient */}
          <linearGradient id="navyBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#991B1B" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Golden Orbital Ring (Behind and looping around) */}
        <path
          d="M 460 210 C 490 280 430 410 270 445 C 130 475 40 400 80 320 C 100 280 150 250 200 240"
          stroke="url(#goldOrbit)"
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* 2. Background Lottery Balls */}
        {/* Ball 16 (Green - Top Left) */}
        <g transform="translate(115, 145)">
          <circle cx="0" cy="0" r="44" fill="url(#greenBallGrad)" />
          <circle cx="-12" cy="-14" r="30" fill="white" opacity="0.25" />
          <circle cx="-2" cy="-2" r="22" fill="white" />
          <text
            x="-2"
            y="6"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="22"
            fontWeight="900"
            fill="#14532D"
            textAnchor="middle"
          >
            16
          </text>
        </g>

        {/* Ball 36 with Crown (Blue - Top Right) */}
        <g transform="translate(370, 110)">
          {/* Crown */}
          <path
            d="M -30 -35 L -38 -65 L -15 -48 L 0 -72 L 15 -48 L 38 -65 L 30 -35 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="3"
          />
          <circle cx="-38" cy="-66" r="4" fill="#FEF08A" />
          <circle cx="0" cy="-73" r="5" fill="#FEF08A" />
          <circle cx="38" cy="-66" r="4" fill="#FEF08A" />

          {/* Ball */}
          <circle cx="0" cy="0" r="52" fill="url(#blueBallGrad)" />
          <circle cx="-14" cy="-16" r="36" fill="white" opacity="0.25" />
          <circle cx="-2" cy="-2" r="26" fill="white" />
          <text
            x="-2"
            y="7"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="24"
            fontWeight="900"
            fill="#1E3A8A"
            textAnchor="middle"
          >
            36
          </text>
        </g>

        {/* Ball 8 (Large Red - Top Center) */}
        <g transform="translate(200, 105)">
          <circle cx="0" cy="0" r="68" fill="url(#redBallGrad)" />
          <ellipse cx="-20" cy="-24" rx="42" ry="26" fill="white" opacity="0.3" transform="rotate(-20, -20, -24)" />
          <circle cx="-2" cy="-2" r="34" fill="white" />
          <text
            x="-2"
            y="12"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="38"
            fontWeight="900"
            fill="#7F1D1D"
            textAnchor="middle"
          >
            8
          </text>
        </g>

        {/* Ball 27 (Orange - Far Left) */}
        <g transform="translate(70, 270)">
          <circle cx="0" cy="0" r="40" fill="url(#orangeBallGrad)" />
          <circle cx="-10" cy="-12" r="26" fill="white" opacity="0.25" />
          <circle cx="-2" cy="-2" r="20" fill="white" />
          <text
            x="-2"
            y="6"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="20"
            fontWeight="900"
            fill="#9A3412"
            textAnchor="middle"
          >
            27
          </text>
        </g>

        {/* Ball 5 (Purple - Bottom Right) */}
        <g transform="translate(440, 268)">
          <circle cx="0" cy="0" r="38" fill="url(#purpleBallGrad)" />
          <circle cx="-10" cy="-12" r="24" fill="white" opacity="0.25" />
          <circle cx="-2" cy="-2" r="18" fill="white" />
          <text
            x="-2"
            y="5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="20"
            fontWeight="900"
            fill="#581C87"
            textAnchor="middle"
          >
            5
          </text>
        </g>

        {/* 3. Deep Navy Ribbon Badge for "đây" */}
        <g transform="translate(255, 330)">
          <ellipse cx="0" cy="0" rx="160" ry="76" fill="url(#navyBanner)" stroke="#F59E0B" strokeWidth="8" />
          {/* Subtle Inner Glow */}
          <ellipse cx="0" cy="0" rx="148" ry="66" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.6" />
        </g>

        {/* 4. Golden Extruded 3D "XỔ SỐ" Text Layer */}
        {/* Drop shadow / Extrusion layers */}
        <g filter="url(#shadowGlow)">
          <text
            x="245"
            y="256"
            fontFamily="'Plus Jakarta Sans', Impact, sans-serif"
            fontSize="106"
            fontWeight="900"
            fontStyle="italic"
            fill="#7F1D1D"
            stroke="#991B1B"
            strokeWidth="16"
            strokeLinejoin="round"
            textAnchor="middle"
            letterSpacing="-2"
          >
            XỔ SỐ
          </text>
          <text
            x="245"
            y="250"
            fontFamily="'Plus Jakarta Sans', Impact, sans-serif"
            fontSize="106"
            fontWeight="900"
            fontStyle="italic"
            fill="#B91C1C"
            stroke="#DC2626"
            strokeWidth="8"
            strokeLinejoin="round"
            textAnchor="middle"
            letterSpacing="-2"
          >
            XỔ SỐ
          </text>
          {/* Main Gold Face */}
          <text
            x="245"
            y="245"
            fontFamily="'Plus Jakarta Sans', Impact, sans-serif"
            fontSize="106"
            fontWeight="900"
            fontStyle="italic"
            fill="url(#goldText)"
            stroke="#FFFBEB"
            strokeWidth="2"
            textAnchor="middle"
            letterSpacing="-2"
          >
            XỔ SỐ
          </text>
        </g>

        {/* Inner Ball 8 (Nestled between X and S) */}
        <g transform="translate(242, 222)">
          <circle cx="0" cy="0" r="34" fill="url(#orangeBallGrad)" stroke="#B91C1C" strokeWidth="3" />
          <circle cx="-1" cy="-1" r="17" fill="white" />
          <text
            x="-1"
            y="6"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="20"
            fontWeight="900"
            fill="#9A3412"
            textAnchor="middle"
          >
            8
          </text>
        </g>

        {/* 5. Dynamic White Script Text "đây" */}
        <g transform="translate(250, 362)">
          {/* Deep Navy/Black Drop Shadow */}
          <text
            x="0"
            y="4"
            fontFamily="'Plus Jakarta Sans', cursive, sans-serif"
            fontSize="92"
            fontWeight="900"
            fontStyle="italic"
            fill="#091E42"
            stroke="#091E42"
            strokeWidth="10"
            strokeLinejoin="round"
            textAnchor="middle"
          >
            đây
          </text>
          {/* Main Pure White Calligraphy */}
          <text
            x="0"
            y="0"
            fontFamily="'Plus Jakarta Sans', cursive, sans-serif"
            fontSize="92"
            fontWeight="900"
            fontStyle="italic"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            đây
          </text>

          {/* Golden dynamic swoosh under "đây" */}
          <path
            d="M -60 22 Q 10 32 90 2"
            stroke="#FBBF24"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 6. Golden Sparkling Star on the bottom right of banner */}
        <g transform="translate(415, 305)">
          <path
            d="M 0 -22 L 6 -6 L 22 -6 L 9 5 L 14 20 L 0 10 L -14 20 L -9 5 L -22 -6 L -6 -6 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2.5"
          />
          <circle cx="-2" cy="-4" r="3" fill="#FFFBEB" />
        </g>
      </svg>

      {/* Typography Brand Lockup */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
              XỔ SỐ <span className="text-red-600">ĐÂY</span>
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 tracking-wider uppercase mt-0.5">
            Trực tiếp 3 Miền & Vietlott
          </span>
        </div>
      )}
    </div>
  );
};
