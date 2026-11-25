// SectionHeading: heading + subheading + optional underline wave
interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subheading?: string;
  align?: "left" | "center";
  light?: boolean; // white text untuk background merah
}

export default function SectionHeading({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const textColor = light ? "text-white" : "text-stone-900";
  const mutedColor = light ? "text-red-200" : "text-stone-500";
  const accentColor = light ? "text-red-200" : "text-[#8B1E1E]";

  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      {eyebrow && (
        <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
          <span className={`text-[11px] uppercase tracking-[0.25em] font-bold ${accentColor}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className={`font-display text-4xl sm:text-5xl font-bold tracking-tight uppercase leading-[0.95] ${textColor}`}>
        {heading}
        {headingAccent && (
          <>
            <br />
            <span className={accentColor}>{headingAccent}</span>
          </>
        )}
      </h2>
      {/* Underline wave accent */}
      <svg
        viewBox="0 0 120 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-2.5 mt-1"
        aria-hidden="true"
      >
        <path
          d="M2 7 C20 2 40 9 60 4 C80 -1 100 8 118 3"
          stroke={light ? "#FAF0E6" : "#8B1E1E"}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {subheading && (
        <p className={`text-sm sm:text-base leading-relaxed max-w-xl font-sans ${mutedColor}`}>
          {subheading}
        </p>
      )}
    </div>
  );
}
