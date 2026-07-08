function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 600 340"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="fieldClip">
          <rect x="30" y="20" width="540" height="280" rx="16" />
        </clipPath>
      </defs>

      <g clipPath="url(#fieldClip)">
        <rect x="30" y="20" width="540" height="280" fill="#2F6B4F" />
        <rect x="30" y="20" width="60" height="280" fill="#356F53" />
        <rect x="150" y="20" width="60" height="280" fill="#356F53" />
        <rect x="270" y="20" width="60" height="280" fill="#356F53" />
        <rect x="390" y="20" width="60" height="280" fill="#356F53" />
        <rect x="510" y="20" width="60" height="280" fill="#356F53" />

        <g fill="none" stroke="#F7F5EF" strokeWidth="2" opacity="0.85">
          <rect x="45" y="35" width="510" height="250" />
          <line x1="300" y1="35" x2="300" y2="285" />
          <circle cx="300" cy="160" r="42" />
          <circle cx="300" cy="160" r="2.5" fill="#F7F5EF" stroke="none" />

          <rect x="45" y="95" width="55" height="130" />
          <rect x="45" y="130" width="22" height="60" />
          <path d="M100 130 A28 28 0 0 1 100 190" />

          <rect x="500" y="95" width="55" height="130" />
          <rect x="533" y="130" width="22" height="60" />
          <path d="M500 130 A28 28 0 0 0 500 190" />
        </g>
      </g>

      <g transform="translate(230 170)">
        <ellipse cx="0" cy="22" rx="20" ry="6" fill="#16241C" opacity="0.15" />
        <circle r="18" fill="#F7F5EF" stroke="#16241C" strokeWidth="1.5" />
        <path d="M0 -9 L8.5 -2.7 L5.5 7.7 L-5.5 7.7 L-8.5 -2.7 Z" fill="#16241C" />
        <path d="M0 -9 L0 -18 M8.5 -2.7 L16 -7 M5.5 7.7 L11 15 M-5.5 7.7 L-11 15 M-8.5 -2.7 L-16 -7"
          stroke="#16241C" strokeWidth="1.2" />
      </g>

      <g opacity="0.9">
        <circle cx="150" cy="110" r="6" fill="#E8541F" />
        <ellipse cx="150" cy="118" rx="7" ry="2.5" fill="#16241C" opacity="0.15" />
        <circle cx="195" cy="80" r="6" fill="#E8541F" />
        <ellipse cx="195" cy="88" rx="7" ry="2.5" fill="#16241C" opacity="0.15" />
        <path d="M150 110 Q172 85 195 80" fill="none" stroke="#E8541F" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
      </g>

      <g opacity="0.9">
        <circle cx="430" cy="220" r="6" fill="#F7F5EF" />
        <ellipse cx="430" cy="228" rx="7" ry="2.5" fill="#16241C" opacity="0.15" />
        <circle cx="470" cy="190" r="6" fill="#F7F5EF" />
        <ellipse cx="470" cy="198" rx="7" ry="2.5" fill="#16241C" opacity="0.15" />
        <path d="M430 220 Q450 195 470 190" fill="none" stroke="#F7F5EF" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default HeroIllustration;