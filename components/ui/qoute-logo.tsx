export function QouteLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      role="img"
      aria-label="Qoute icon"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <mask id="notchMask">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>

      <g fill="none" stroke="url(#logoGradient)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        {/* Tail (the Q) */}
        <path d="M165 165 L198 198"/>
      </g>

      {/* Ring with notch */}
      <g fill="none" stroke="url(#logoGradient)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notchMask)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}
