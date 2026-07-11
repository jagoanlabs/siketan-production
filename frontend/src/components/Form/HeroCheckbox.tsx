import React from "react";
import { Checkbox as RACCheckbox } from "@heroui/react";

export const Checkbox = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const { color, isSelected, onValueChange, children, className, ...rest } = props;
  
  const handleChange = (e: any) => {
    if (onValueChange) {
      onValueChange(e.target.checked);
    }
  };

  let colorClass = "accent-green-600";
  if (color === "primary") colorClass = "accent-blue-600";
  if (color === "danger") colorClass = "accent-red-600";

  return (
    <RACCheckbox
      ref={ref}
      isSelected={isSelected}
      onChange={handleChange}
      className={`${colorClass} ${className || ""}`}
      {...rest}
    >
      {children}
    </RACCheckbox>
  );
});

Checkbox.displayName = "Checkbox";
