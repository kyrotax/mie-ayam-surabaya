import { ChineseKnotDivider } from "./ChineseOrnaments";

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
  showKnot = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const textColor = light ? "text-white" : "text-[#2C1810]";
  const accentColor = light ? "text-[#FFD700]" : "text-[#8B0000]";
  const eyebrowColor = light ? "text-[#FFD700]" : "text-[#9A6B00]";
  const mutedColor = light ? "text-[#FFF8E7]/85" : "text-[#6B4423]";

  return (
    <div className={`flex flex-col gap-2.5 ${alignClass}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span className={`w-6 h-px ${light ? "bg-[#D4AF37]" : "bg-[#9A6B00]/60"}`} aria-hidden="true" />
          <span className={`section-eyebrow-unified ${eyebrowColor}`}>
            {eyebrow}
          </span>
          {align === "center" && (
            <span className={`w-6 h-px ${light ? "bg-[#D4AF37]" : "bg-[#9A6B00]/60"}`} aria-hidden="true" />
          )}
        </div>
      )}

      <h2 className={`section-heading-unified ${textColor}`}>
        {heading}
        {headingAccent && (
          <>
            {" "}
            <span className={accentColor}>{headingAccent}</span>
          </>
        )}
      </h2>

      {showKnot && (
        <div className={align === "center" ? "w-full flex justify-center" : "w-52"}>
          <ChineseKnotDivider variant={light ? "light" : "dark"} className="my-1" />
        </div>
      )}

      {subheading && (
        <p className={`section-subheading-unified max-w-xl ${mutedColor}`}>
          {subheading}
        </p>
      )}
    </div>
  );
}
