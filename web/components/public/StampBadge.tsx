// StampBadge: SVG bundar dengan teks melingkar — aksen Chinese seal
// Props: text (teks melingkar), size, className
interface StampBadgeProps {
  text: string;
  size?: number;
  className?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
}

export default function StampBadge({
  text,
  size = 96,
  className = "",
  textColor = "#FFFFFF",
  bgColor = "#D10B0C",
  borderColor = "#FFF0F0",
}: StampBadgeProps) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const pathId = `stamp-circle-${text.replace(/\s/g, "-")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={text}
      role="img"
    >
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={size * 0.47} fill={bgColor} />
      {/* Decorative border ring */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.42}
        stroke={borderColor}
        strokeWidth={size * 0.025}
        fill="none"
        strokeDasharray={`${size * 0.04} ${size * 0.04}`}
      />
      {/* Hidden text path circle */}
      <defs>
        <path
          id={pathId}
          d={`M ${cx}, ${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
        />
      </defs>
      {/* Circular text */}
      <text
        fontSize={size * 0.115}
        fontFamily="var(--font-sans), 'DM Sans', sans-serif"
        fontWeight="600"
        fill={textColor}
        letterSpacing={size * 0.018}
      >
        <textPath href={`#${pathId}`} startOffset="0%">
          {text}
        </textPath>
      </text>
      {/* Center decorative dot */}
      <circle cx={cx} cy={cy} r={size * 0.05} fill={borderColor} />
    </svg>
  );
}

