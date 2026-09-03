import React from "react";

export interface ChipProps {
  children?: React.ReactNode;
  className?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "accent";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "dot";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  avatar?: React.ReactNode;
  onClose?: (e: any) => void;
  onClick?: (e: any) => void;
  onPress?: (e: any) => void;
  isDisabled?: boolean;
  [key: string]: any;
}

const getDotColorClass = (color: string = "default") => {
  switch (color) {
    case "primary":
    case "accent":
      return "bg-blue-500";
    case "secondary":
      return "bg-purple-500";
    case "success":
      return "bg-green-500";
    case "warning":
      return "bg-amber-500";
    case "danger":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const getChipClasses = (
  color: string = "default",
  variant: string = "solid",
  size: string = "md",
  radius: string = "full",
  className: string = ""
) => {
  const isPrimary = color === "primary" || color === "accent";
  const isSecondary = color === "secondary";
  const isSuccess = color === "success";
  const isWarning = color === "warning";
  const isDanger = color === "danger";

  // Base
  let baseClass = "inline-flex items-center justify-center font-medium box-border whitespace-nowrap select-none transition-colors";

  // Radius
  let radiusClass = "rounded-full";
  if (radius === "none") radiusClass = "rounded-none";
  else if (radius === "sm") radiusClass = "rounded-sm";
  else if (radius === "md") radiusClass = "rounded-md";
  else if (radius === "lg") radiusClass = "rounded-lg";

  // Sizes
  let sizeClass = "px-2.5 py-0.5 text-xs h-6 gap-1";
  if (size === "sm") {
    sizeClass = "px-2 py-0.5 text-[11px] h-5 gap-1";
  } else if (size === "lg") {
    sizeClass = "px-3.5 py-1 text-sm h-8 gap-1.5";
  }

  // Variant & Color
  let variantClass = "";
  if (isPrimary) {
    if (variant === "flat" || variant === "faded") {
      variantClass = "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
    } else if (variant === "bordered") {
      variantClass = "border border-blue-600 text-blue-600 dark:text-blue-400 bg-transparent";
    } else if (variant === "light") {
      variantClass = "text-blue-600 dark:text-blue-400 bg-transparent";
    } else if (variant === "dot") {
      variantClass = "border border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300";
    } else if (variant === "shadow") {
      variantClass = "bg-blue-600 text-white shadow-md shadow-blue-500/30";
    } else { // solid
      variantClass = "bg-blue-600 text-white";
    }
  } else if (isSecondary) {
    if (variant === "flat" || variant === "faded") {
      variantClass = "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";
    } else if (variant === "bordered") {
      variantClass = "border border-purple-600 text-purple-600 dark:text-purple-400 bg-transparent";
    } else if (variant === "light") {
      variantClass = "text-purple-600 dark:text-purple-400 bg-transparent";
    } else if (variant === "dot") {
      variantClass = "border border-purple-200 bg-purple-50/50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300";
    } else if (variant === "shadow") {
      variantClass = "bg-purple-600 text-white shadow-md shadow-purple-500/30";
    } else { // solid
      variantClass = "bg-purple-600 text-white";
    }
  } else if (isSuccess) {
    if (variant === "flat" || variant === "faded") {
      variantClass = "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300";
    } else if (variant === "bordered") {
      variantClass = "border border-green-600 text-green-600 dark:text-green-400 bg-transparent";
    } else if (variant === "light") {
      variantClass = "text-green-600 dark:text-green-400 bg-transparent";
    } else if (variant === "dot") {
      variantClass = "border border-green-200 bg-green-50/50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300";
    } else if (variant === "shadow") {
      variantClass = "bg-green-600 text-white shadow-md shadow-green-500/30";
    } else { // solid
      variantClass = "bg-green-600 text-white";
    }
  } else if (isWarning) {
    if (variant === "flat" || variant === "faded") {
      variantClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
    } else if (variant === "bordered") {
      variantClass = "border border-amber-500 text-amber-600 dark:text-amber-400 bg-transparent";
    } else if (variant === "light") {
      variantClass = "text-amber-600 dark:text-amber-400 bg-transparent";
    } else if (variant === "dot") {
      variantClass = "border border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";
    } else if (variant === "shadow") {
      variantClass = "bg-amber-500 text-white shadow-md shadow-amber-500/30";
    } else { // solid
      variantClass = "bg-amber-500 text-white";
    }
  } else if (isDanger) {
    if (variant === "flat" || variant === "faded") {
      variantClass = "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300";
    } else if (variant === "bordered") {
      variantClass = "border border-red-600 text-red-600 dark:text-red-400 bg-transparent";
    } else if (variant === "light") {
      variantClass = "text-red-600 dark:text-red-400 bg-transparent";
    } else if (variant === "dot") {
      variantClass = "border border-red-200 bg-red-50/50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300";
    } else if (variant === "shadow") {
      variantClass = "bg-red-600 text-white shadow-md shadow-red-500/30";
    } else { // solid
      variantClass = "bg-red-600 text-white";
    }
  } else { // default (gray)
    if (variant === "flat" || variant === "faded") {
      variantClass = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    } else if (variant === "bordered") {
      variantClass = "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent";
    } else if (variant === "light") {
      variantClass = "text-gray-700 dark:text-gray-300 bg-transparent";
    } else if (variant === "dot") {
      variantClass = "border border-gray-200 bg-gray-50/50 text-gray-700 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    } else if (variant === "shadow") {
      variantClass = "bg-gray-700 text-white shadow-md shadow-gray-500/30 dark:bg-gray-600";
    } else { // solid
      variantClass = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  }

  return `${baseClass} ${radiusClass} ${sizeClass} ${variantClass} ${className}`.trim();
};

export const Chip: React.FC<ChipProps> = ({
  children,
  className = "",
  color = "default",
  variant = "solid",
  size = "md",
  radius = "full",
  startContent,
  endContent,
  avatar,
  onClose,
  onClick,
  onPress,
  isDisabled = false,
  ...props
}) => {
  const chipClasses = getChipClasses(color, variant, size, radius, className);
  const handleClick = onClick || onPress;

  const interactiveProps = handleClick && !isDisabled
    ? {
        role: "button",
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e);
          }
        },
      }
    : {};

  return (
    <span
      className={`${chipClasses} ${isDisabled ? "opacity-50 cursor-not-allowed" : handleClick ? "cursor-pointer active:scale-95" : ""}`}
      {...interactiveProps}
      {...props}
    >
      {avatar && <span className="inline-flex shrink-0 items-center justify-center -ml-1 mr-1">{avatar}</span>}
      {variant === "dot" && !avatar && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mr-1 ${getDotColorClass(color)}`} />
      )}
      {startContent && <span className="inline-flex shrink-0 items-center justify-center">{startContent}</span>}
      <span className="truncate">{children}</span>
      {endContent && <span className="inline-flex shrink-0 items-center justify-center">{endContent}</span>}
      {onClose && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close"
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors inline-flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClose(e);
          }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

