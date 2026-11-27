interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subheading?: string;
  align?: "left" | "center";
  light?: boolean;
  showKnot?: boolean;
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
  const textColor = light ? "text-white" : "text-[#251C17]";
  const accentColor = light ? "text-[#F0C87D]" : "text-[#8D0D00]";
  const eyebrowBg = light
    ? "bg-white/10 text-[#F0C87D] border-white/20"
    : "bg-[#F3E4DE] text-[#8D0D00] border-[#E3C1BA]";
  const mutedColor = light ? "text-[#D8D0C7]" : "text-[#6E6259]";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${eyebrowBg}`}
        >
          {eyebrow}
        </span>
      )}

      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.035em] leading-[1.15] ${textColor}`}>
        {heading}
        {headingAccent && (
          <>
            {" "}
            <span className={accentColor}>{headingAccent}</span>
          </>
        )}
      </h2>

      {subheading && (
        <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${mutedColor}`}>
          {subheading}
        </p>
      )}
    </div>
  );
}
