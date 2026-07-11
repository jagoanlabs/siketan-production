import React, { useState } from "react";
import { TextField, Label } from "@heroui/react";
import { Input as RACInput, TextArea as RACTextArea } from "react-aria-components";

const getInputWrapperClasses = (variant: string, classNames: any, isDisabled: boolean, isInvalid: boolean) => {
  const customWrapper = classNames?.inputWrapper || "";

  const hasBg = /\bbg-/.test(customWrapper);
  const hasBorder = /\bborder-|\bborder\b/.test(customWrapper);
  const hasPadding = /\bp[xy]?-\d+/.test(customWrapper);
  const hasRounded = /\brounded-/.test(customWrapper);

  // Default values based on variant
  let bgClass = hasBg ? "" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600";
  let borderClass = hasBorder ? "" : "border border-gray-300 dark:border-gray-600 focus-within:border-green-500";
  let paddingClass = hasPadding ? "" : "px-3.5";
  let roundedClass = hasRounded ? "" : "rounded-xl";

  if (isInvalid) {
    borderClass = "border-red-500 focus-within:border-red-500";
  } else if (variant === "bordered") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-2 border-gray-200 dark:border-gray-700 focus-within:border-green-500";
  } else if (variant === "flat") {
    bgClass = hasBg ? "" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700";
    borderClass = hasBorder ? "" : "border-none focus-within:border-green-500";
  } else if (variant === "underlined") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-b border-gray-200 dark:border-gray-700 focus-within:border-green-500";
    roundedClass = "";
    paddingClass = "";
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
    labelPlacement,
    type,
    isDisabled,
    isRequired,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  // Bridge standard onChange event
  const handleValueChange = (val: string) => {
    if (onChange) {
      onChange({
        target: {
          value: val,
          name: rest.name
        }
      } as any);
    }
  };

  const wrapperClasses = getInputWrapperClasses(variant, classNames, isDisabled, isInvalid);

  return (
    <TextField
      isInvalid={isInvalid}
      value={value !== undefined ? String(value) : undefined}
      onChange={handleValueChange}
      isDisabled={isDisabled}
      isRequired={isRequired}
      className={`w-full flex flex-col gap-1.5 ${className || ""}`}
      {...rest}
    >
      {label && (
        <Label className={`text-xs font-semibold text-gray-600 pl-1 ${classNames?.label || ""}`}>
          {label}
        </Label>
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none w-full h-full py-3 text-gray-700 dark:text-gray-200 ${classNames?.input || ""}`}
        />
        {endContent && <span className="ml-1 text-gray-400 flex items-center">{endContent}</span>}
      </div>
      {isInvalid && errorMessage && (
        <span className="text-xs text-red-500 pl-1">{errorMessage}</span>
      )}
    </TextField>
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
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleValueChange = (val: string) => {
    if (onChange) {
      onChange({
        target: {
          value: val,
          name: rest.name
        }
      } as any);
    }
  };

  const wrapperClasses = getInputWrapperClasses(variant, classNames, isDisabled, isInvalid);

  return (
    <TextField
      isInvalid={isInvalid}
      value={value !== undefined ? String(value) : undefined}
      onChange={handleValueChange}
      isDisabled={isDisabled}
      isRequired={isRequired}
      className={`w-full flex flex-col gap-1.5 ${className || ""}`}
      {...rest}
    >
      {label && (
        <Label className={`text-xs font-semibold text-gray-600 pl-1 ${classNames?.label || ""}`}>
          {label}
        </Label>
      )}
      <div
        className={wrapperClasses}
        data-focus={isFocused ? "true" : undefined}
      >
        <RACTextArea
          ref={ref}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none w-full h-full py-3 text-gray-700 dark:text-gray-200 resize-y min-h-[80px] ${classNames?.input || ""}`}
        />
      </div>
      {isInvalid && errorMessage && (
        <span className="text-xs text-red-500 pl-1">{errorMessage}</span>
      )}
    </TextField>
  );
});

Textarea.displayName = "Textarea";
