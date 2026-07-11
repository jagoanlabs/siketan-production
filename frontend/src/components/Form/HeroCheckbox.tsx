import React from "react";
import { Checkbox as RACCheckbox } from "@heroui/react";

export const Checkbox = React.forwardRef<any, any>((props, ref) => {
  const { color, isSelected, onValueChange, children, className, ...rest } = props;

  const handleChange = (isChecked: boolean) => {
    if (onValueChange) {
      onValueChange(isChecked);
    }
  };

  const colorClass = color === "success" ? "accent-green-600"
    : color === "primary" ? "accent-blue-600"
    : color === "danger" ? "accent-red-600"
    : "accent-green-600";

  return (
    <RACCheckbox
      ref={ref}
      isSelected={isSelected}
      onChange={handleChange}
      className={`${colorClass} ${className || ""}`}
      {...rest}
    >
      <RACCheckbox.Content>
        <RACCheckbox.Control>
          <RACCheckbox.Indicator />
        </RACCheckbox.Control>
        {children}
      </RACCheckbox.Content>
    </RACCheckbox>
  );
});

Checkbox.displayName = "Checkbox";
