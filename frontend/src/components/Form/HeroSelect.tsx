import React from "react";
import { Select as RACSelect, SelectTrigger, SelectValue, SelectIndicator, SelectPopover, ListBox, ListBoxItem, Spinner } from "@heroui/react";

export interface SelectProps {
  label?: React.ReactNode;
  placeholder?: string;
  selectedKeys?: any;
  onSelectionChange?: (keys: any) => void;
  className?: string;
  variant?: any;
  size?: any;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: any;
  isMultiline?: boolean;
  selectionMode?: any;
  renderValue?: any;
  isLoading?: boolean;
  name?: string;
  isRequired?: boolean;
  onChange?: (e: any) => void;
}

const getSelectTriggerClasses = (variant: string, classNames: any, isDisabled?: boolean, isInvalid?: boolean) => {
  const customTrigger = classNames?.trigger || "";
  
  const hasBg = /\bbg-/.test(customTrigger);
  const hasBorder = /\bborder-|\bborder\b/.test(customTrigger);
  const hasPadding = /\bp[xy]?-\d+/.test(customTrigger);
  const hasRounded = /\brounded-/.test(customTrigger);

  // Default values based on variant
  let bgClass = hasBg ? "" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600";
  let borderClass = hasBorder ? "" : "border border-gray-300 dark:border-gray-600 focus:border-green-500";
  let paddingClass = hasPadding ? "" : "px-3.5 py-3";
  let roundedClass = hasRounded ? "" : "rounded-xl";

  if (isInvalid) {
    borderClass = "border-red-500 focus:border-red-500";
  } else if (variant === "bordered") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-2 border-gray-200 dark:border-gray-700 focus:border-green-500";
  } else if (variant === "flat") {
    bgClass = hasBg ? "" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700";
    borderClass = hasBorder ? "" : "border-none focus:border-green-500";
  } else if (variant === "underlined") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-b border-gray-200 dark:border-gray-700 focus:border-green-500";
    roundedClass = "";
    paddingClass = "";
  }

  return `w-full flex justify-between items-center text-gray-700 dark:text-gray-200 text-sm min-h-[40px] transition-colors outline-none focus:outline-none ${bgClass} ${borderClass} ${paddingClass} ${roundedClass} ${customTrigger} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`;
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const {
    label,
    placeholder,
    selectedKeys,
    onSelectionChange,
    className,
    variant,
    size,
    isDisabled,
    isInvalid,
    errorMessage,
    children,
    classNames,
    isMultiline,
    selectionMode,
    renderValue,
    isLoading,
    name,
    isRequired,
    onChange,
    ...rest
  } = props;

  const items: any[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      items.push(child);
    }
  });

  // Extract selected key
  let selectedKey: any = undefined;
  if (selectedKeys) {
    if (selectedKeys instanceof Set || typeof selectedKeys.has === "function") {
      selectedKey = Array.from(selectedKeys)[0];
    } else if (Array.isArray(selectedKeys)) {
      selectedKey = selectedKeys[0];
    } else {
      selectedKey = selectedKeys;
    }
  }

  // Handle single select key string/number conversion
  if (selectedKey !== undefined) {
    selectedKey = String(selectedKey);
  }

  const triggerClasses = getSelectTriggerClasses(variant, classNames, isDisabled, isInvalid);

  return (
    <div className={`flex flex-col gap-1 w-full ${className || ""}`} ref={ref}>
      {label && <span className="text-xs font-semibold text-gray-600 pl-1">{label}</span>}
      <RACSelect
        selectedKey={selectedKey}
        placeholder={placeholder}
        onSelectionChange={(key) => {
          if (onSelectionChange) {
            onSelectionChange(new Set([key]));
          }
          if (onChange) {
            onChange({
              target: {
                value: key,
                name: name
              }
            } as any);
          }
        }}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        name={name}
        isRequired={isRequired}
        {...rest}
      >
        <SelectTrigger className={triggerClasses}>
          <SelectValue />
          {isLoading ? <Spinner size="sm" /> : <SelectIndicator className="text-gray-400">▼</SelectIndicator>}
        </SelectTrigger>
        {isInvalid && errorMessage && (
          <span className="text-xs text-red-500 pl-1">{errorMessage}</span>
        )}
        <SelectPopover className="p-1 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-lg min-w-[200px]">
          <ListBox className="outline-none max-h-60 overflow-y-auto">
            {items.map((item, idx) => {
              const itemKey = String(item.key !== null && item.key !== undefined ? item.key : (item.props.value || item.props.id || idx));
              return (
                <ListBoxItem
                  id={itemKey}
                  key={itemKey}
                  textValue={typeof item.props.children === "string" ? item.props.children : itemKey}
                  className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 outline-none text-gray-700 dark:text-gray-200 block w-full"
                >
                  {item.props.children}
                </ListBoxItem>
              );
            })}
          </ListBox>
        </SelectPopover>
      </RACSelect>
    </div>
  );
});

Select.displayName = "Select";

export const SelectItem = ({ children }: any) => {
  return <>{children}</>;
};
