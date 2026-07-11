import React from "react";
import { Button as RACButton } from "react-aria-components";
import { Spinner } from "@heroui/react";

export interface ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "light" | "flat" | "ghost" | "shadow";
  size?: "sm" | "md" | "lg";
  isIconOnly?: boolean;
  onPress?: (e: any) => void;
  type?: "button" | "submit" | "reset";
  [key: string]: any;
}

const getButtonClasses = (
  color: string = "default",
  variant: string = "solid",
  size: string = "md",
  isIconOnly: boolean = false,
  className: string = ""
) => {
  const isDanger = color === "danger";
  const isPrimary = color === "primary";
  const isSecondary = color === "secondary";
  const isWarning = color === "warning";
  const isSuccess = color === "success";
  
  // Base classes
  let baseClass = "inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] duration-100 cursor-pointer";

  // Sizes & IconOnly adjustments
  let sizeClass = "px-4 py-2 text-sm rounded-xl";
  if (isIconOnly) {
    if (size === "sm") sizeClass = "p-2 rounded-lg";
    else if (size === "lg") sizeClass = "p-3.5 rounded-xl";
    else sizeClass = "p-2.5 rounded-xl";
  } else {
    if (size === "sm") {
      sizeClass = "px-3 py-1.5 text-xs rounded-lg";
    } else if (size === "lg") {
      sizeClass = "px-6 py-3 text-base rounded-xl";
    }
  }

  // Colors & Variants
  let variantClass = "";
  if (isPrimary || isSuccess) {
    if (variant === "flat") {
      variantClass = "bg-green-50 hover:bg-green-100 text-green-700";
    } else if (variant === "bordered") {
      variantClass = "border border-green-600 text-green-600 hover:bg-green-50";
    } else if (variant === "light") {
      variantClass = "text-green-600 hover:bg-green-50/50";
    } else if (variant === "ghost") {
      variantClass = "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white";
    } else { // solid
      variantClass = "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow";
    }
  } else if (isSecondary) {
    if (variant === "flat") {
      variantClass = "bg-blue-50 hover:bg-blue-100 text-blue-700";
    } else if (variant === "bordered") {
      variantClass = "border border-blue-600 text-blue-600 hover:bg-blue-50";
    } else if (variant === "light") {
      variantClass = "text-blue-600 hover:bg-blue-50/50";
    } else if (variant === "ghost") {
      variantClass = "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";
    } else { // solid
      variantClass = "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow";
    }
  } else if (isDanger) {
    if (variant === "flat") {
      variantClass = "bg-red-50 hover:bg-red-100 text-red-700";
    } else if (variant === "bordered") {
      variantClass = "border border-red-600 text-red-600 hover:bg-red-50";
    } else if (variant === "light") {
      variantClass = "text-red-600 hover:bg-red-50/50";
    } else if (variant === "ghost") {
      variantClass = "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white";
    } else { // solid
      variantClass = "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow";
    }
  } else if (isWarning) {
    if (variant === "flat") {
      variantClass = "bg-amber-50 hover:bg-amber-100 text-amber-700";
    } else if (variant === "bordered") {
      variantClass = "border border-amber-600 text-amber-600 hover:bg-amber-50";
    } else if (variant === "light") {
      variantClass = "text-amber-600 hover:bg-amber-50/50";
    } else if (variant === "ghost") {
      variantClass = "border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white";
    } else { // solid
      variantClass = "bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow";
    }
  } else { // default (gray)
    if (variant === "flat") {
      variantClass = "bg-gray-100 hover:bg-gray-200 text-gray-700";
    } else if (variant === "bordered") {
      variantClass = "border border-gray-300 hover:bg-gray-50 text-gray-700";
    } else if (variant === "light") {
      variantClass = "text-gray-700 hover:bg-gray-100";
    } else if (variant === "ghost") {
      variantClass = "border border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white";
    } else { // solid
      variantClass = "bg-gray-200 hover:bg-gray-300 text-gray-800";
    }
  }

  return `${baseClass} ${sizeClass} ${variantClass} ${className}`;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    isLoading,
    isDisabled,
    children,
    className = "",
    color = "default",
    variant = "solid",
    size = "md",
    isIconOnly = false,
    startContent,
    endContent,
    ...rest
  } = props;

  const btnClasses = getButtonClasses(color, variant, size, isIconOnly, className);

  return (
    <RACButton
      ref={ref}
      isDisabled={isDisabled || isLoading}
      className={btnClasses}
      {...rest}
    >
      {isLoading && <Spinner size="sm" color="current" />}
      {!isLoading && startContent && <span className="inline-flex items-center justify-center">{startContent}</span>}
      {children}
      {endContent && <span className="inline-flex items-center justify-center">{endContent}</span>}
    </RACButton>
  );
});

Button.displayName = "Button";
