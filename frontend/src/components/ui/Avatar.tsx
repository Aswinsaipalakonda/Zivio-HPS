import React, { useState } from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({ name = "User", imageUrl, size = "md", className = "", ...props }) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  let sizeClass = "";
  let textClass = "";
  switch (size) {
    case "sm":
      sizeClass = "w-8 h-8";
      textClass = "text-xs";
      break;
    case "lg":
      sizeClass = "w-16 h-16";
      textClass = "text-lg";
      break;
    case "md":
    default:
      sizeClass = "w-10 h-10";
      textClass = "text-sm";
      break;
  }

  const showImage = imageUrl && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 overflow-hidden select-none shrink-0 ${sizeClass} ${className}`}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`font-semibold text-slate-600 tracking-wide ${textClass}`}>
          {initials || "?"}
        </span>
      )}
    </div>
  );
};
