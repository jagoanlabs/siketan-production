import { Chip as RACChip } from "@heroui/react";

export const Chip = ({ variant, className, children, ...props }: any) => {
  let mappedVariant = variant;
  let borderClass = "";
  if (variant === "bordered") {
    mappedVariant = "secondary";
    borderClass = "border border-gray-300 dark:border-gray-600";
  } else if (variant === "flat" || variant === "faded") {
    mappedVariant = "soft";
  }
  return (
    <RACChip className={`${borderClass} ${className || ""}`} variant={mappedVariant} {...props}>
      {children}
    </RACChip>
  );
};
