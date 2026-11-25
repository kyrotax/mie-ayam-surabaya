// IconLine: wrapper untuk icon line-art 1 warna (merah bata / putih / inherit)
// Brief poin 3: bukan filled, bukan 3D, bukan emoji
import { type ReactNode } from "react";

interface IconLineProps {
  children?: ReactNode;
  icon?: "bowl" | "flame" | "shield" | "heart" | "clock" | "pin";
  size?: number;
  className?: string;
  color?: string;
}

export default function IconLine({
  children,
  icon,
  size = 28,
  className = "",
  color = "currentColor",
}: IconLineProps) {
  if (children) {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ color }}
        aria-hidden="true"
      >
        {children}
      </div>
    );
  }

  // Preset custom line-art oriental SVGs
  const renderIcon = () => {
    switch (icon) {
      case "bowl":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21a8 8 0 0 0 8-8H4a8 8 0 0 0 8 8Z" />
            <path d="M4 13h16" />
            <path d="M9 3v4" />
            <path d="M12 2v5" />
            <path d="M15 3v4" />
          </svg>
        );
      case "flame":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );
      case "shield":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        );
      case "heart":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        );
      case "clock":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case "pin":
      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {renderIcon()}
    </div>
  );
}

