interface PyporeLogoProps {
  size?: number;
  className?: string;
}

export function PyporeLogo({ size = 36, className = '' }: PyporeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="64" height="64" rx="16" fill="#022c22" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="14.5"
        stroke="#10b981"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <path
        d="M15 17C11 19.5 9 25.5 11.5 31C14 36.5 19.5 38.5 23.5 36.5"
        stroke="#fbbf24"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M49 17C53 19.5 55 25.5 52.5 31C50 36.5 44.5 38.5 40.5 36.5"
        stroke="#fbbf24"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M23 24C23 20.5 27 18.5 32 18.5C37 18.5 41 20.5 41 24L39.5 39.5C39.1 44 36 47.5 32 47.5C28 47.5 24.9 44 24.5 39.5L23 24Z"
        fill="#064e3b"
        stroke="#34d399"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 27.5C28.8 25.2 35.2 25.2 36.5 27.5"
        stroke="#6ee7b7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M26.5 32.5C28.8 29.8 35.2 29.8 37.5 32.5"
        stroke="#34d399"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M28 37.5C29.8 35.5 34.2 35.5 36 37.5"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="28.5" cy="42.2" r="1.5" fill="#fbbf24" />
      <circle cx="35.5" cy="42.2" r="1.5" fill="#fbbf24" />
      <circle cx="32" cy="22.5" r="1.6" fill="#34d399" />
      <path
        d="M27.5 14L32 11.5L36.5 14"
        stroke="#34d399"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
