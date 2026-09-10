// src/components/Logo.jsx
//
// Inline SVG recreation of the Alumni Connect logo (graduation cap + "AC" monogram).
// No external image file needed — this renders entirely as code, so it scales crisply
// at any size and can be recolored via the `color` prop (defaults to your brand black).

export default function Logo({ size = 40, color = "#000000", style = {}, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      {/* Graduation cap */}
      <polygon points="100,28 172,56 100,84 28,56" fill={color} />
      <path
        d="M62 62 L62 86 C62 96, 138 96, 138 86 L138 62 L100 76 Z"
        fill={color}
      />
      {/* Tassel */}
      <line x1="150" y1="58" x2="150" y2="92" stroke={color} strokeWidth="4" />
      <circle cx="150" cy="97" r="5" fill={color} />
      <polygon points="145,102 155,102 150,116" fill={color} />

      {/* "A" */}
      <polygon points="100,80 145,178 122,178 90,102 58,178 35,178" fill={color} />

      {/* "C" */}
      <path
        d="M150 138
           A38 38 0 1 1 150 118"
        fill="none"
        stroke={color}
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  );
}