// WaveDivider: SVG wave organik untuk transisi section merah <-> krem
// Reusable, props: direction (top/bottom), color
interface WaveDividerProps {
  direction?: "top" | "bottom";
  color?: string;
  className?: string;
}

export default function WaveDivider({
  direction = "bottom",
  color = "#F5E6D3",
  className = "",
}: WaveDividerProps) {
  const path =
    direction === "bottom"
      ? "M0,0 C240,80 480,0 720,60 C960,120 1200,20 1440,70 L1440,120 L0,120 Z"
      : "M0,120 C240,40 480,120 720,60 C960,0 1200,100 1440,50 L1440,0 L0,0 Z";

  return (
    <div
      className={`w-full overflow-hidden leading-none ${direction === "top" ? "rotate-180" : ""} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-16 sm:h-20"
        style={{ display: "block" }}
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  );
}

