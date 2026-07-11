import React, { useState } from "react";
import { Input as RACInput, TextArea as RACTextArea } from "react-aria-components";

const getInputWrapperClasses = (variant: string, classNames: any, isDisabled: boolean, isInvalid: boolean) => {
  const customWrapper = classNames?.inputWrapper || "";

  const hasBg = /\bbg-/.test(customWrapper);
  const hasBorder = /\bborder-|\bborder\b/.test(customWrapper);
  const hasPadding = /\bp[xy]?-\d+/.test(customWrapper);
  const hasRounded = /\brounded-/.test(customWrapper);

  // Default values
  let bgClass = hasBg ? "" : "bg-gray-100 hover:bg-gray-200";
  let borderClass = hasBorder ? "" : "border border-gray-300 focus-within:border-green-500";
  let paddingClass = hasPadding ? "" : "px-3.5";
  let roundedClass = hasRounded ? "" : "rounded-xl";

  // Apply variant-specific styles
  if (variant === "bordered") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-2 border-gray-200 focus-within:border-green-500";
  } else if (variant === "flat") {
    bgClass = hasBg ? "" : "bg-gray-100 hover:bg-gray-200";
    borderClass = hasBorder ? "" : "border-none focus-within:border-green-500";
  } else if (variant === "underlined") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-b border-gray-200 focus-within:border-green-500";
    roundedClass = "";
    paddingClass = "";
  }

  // Override border color when invalid (keep bg & border width sesuai variant)
  if (isInvalid) {
    let borderWidth = "border";
    if (variant === "bordered" || variant === "flat") borderWidth = "border-2";
    else if (variant === "underlined") borderWidth = "border-b-2";
    borderClass = hasBorder ? customWrapper : `${borderWidth} border-red-500 focus-within:border-red-500`;
  }

  return `relative flex items-center w-full transition-colors ${bgClass} ${borderClass} ${paddingClass} ${roundedClass} ${customWrapper} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`;
};

export const Input = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const {
    label,
    placeholder,
    variant,
    classNames,
    startContent,
    endContent,
    isInvalid,
    errorMessage,
    value,
    onChange,
    className,
    type,
    isDisabled,
    isRequired,
    required,
  } = props;

  const mustRequired = isRequired || required;

  const [isFocused, setIsFocused] = useState(false);

  // Bridge standard onChange event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({
        target: {
          value: e.target.value,
        }
      } as any);
    }
  };

  const wrapperClasses = getInputWrapperClasses(variant, classNames, isDisabled, isInvalid);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className || ""}`}>
      {label && (
        <label className={`text-xs font-semibold text-gray-600 pl-1 ${classNames?.label || ""}`}>
          {label}
          {mustRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div
        className={wrapperClasses}
        data-focus={isFocused ? "true" : undefined}
      >
        {startContent && <span className="mr-2 text-gray-400 flex items-center">{startContent}</span>}
        <RACInput
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value !== undefined ? String(value) : undefined}
          onChange={handleInputChange}
          disabled={isDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none w-full h-full py-3 text-gray-700 ${classNames?.input || ""}`}
        />
        {endContent && <span className="ml-1 text-gray-400 flex items-center">{endContent}</span>}
      </div>
      {isInvalid && errorMessage && (
        <span className="text-xs text-red-500 pl-1">{errorMessage}</span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => {
  const {
    label,
    placeholder,
    variant,
    classNames,
    isInvalid,
    errorMessage,
    value,
    onChange,
    className,
    isDisabled,
    isRequired,
    required,
  } = props;

  const mustRequired = isRequired || required;

  const [isFocused, setIsFocused] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({
        target: {
          value: e.target.value,
        }
      } as any);
    }
  };

  const wrapperClasses = getInputWrapperClasses(variant, classNames, isDisabled, isInvalid);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className || ""}`}>
      {label && (
        <label className={`text-xs font-semibold text-gray-600 pl-1 ${classNames?.label || ""}`}>
          {label}
          {mustRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div
        className={wrapperClasses}
        data-focus={isFocused ? "true" : undefined}
      >
        <RACTextArea
          ref={ref}
          placeholder={placeholder}
          value={value !== undefined ? String(value) : undefined}
          onChange={handleTextareaChange}
          disabled={isDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none w-full h-full py-3 text-gray-700 resize-y min-h-[80px] ${classNames?.input || ""}`}
        />
      </div>
      {isInvalid && errorMessage && (
        <span className="text-xs text-red-500 pl-1">{errorMessage}</span>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";
