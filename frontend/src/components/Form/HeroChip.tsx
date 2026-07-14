import { Chip as RACChip } from "@heroui/react";

export const Chip = ({ variant, className, children, onClick, ...props }: any) => {
  let mappedVariant = variant;
  let borderClass = "";
  if (variant === "bordered") {
    mappedVariant = "secondary";
    const hasCustomBorder = className?.includes("border-") && !className?.includes("border-1");
    const hasCustomBg = className?.includes("bg-");
    borderClass = `border ${hasCustomBorder ? "" : "border-gray-300"} ${hasCustomBg ? "" : "bg-transparent"}`;
  } else if (variant === "flat" || variant === "faded") {
    mappedVariant = "soft";
  }

  const interactiveProps = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: (e: any) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
          }
        },
      }
    : {};

  return (
    <RACChip 
      className={`${borderClass} ${className || ""}`} 
      variant={mappedVariant} 
      {...interactiveProps}
      {...props}
    >
      {children}
    </RACChip>
  );
};
