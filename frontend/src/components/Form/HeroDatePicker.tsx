import { I18nProvider } from "@react-aria/i18n";
import {
  DatePicker as HeroDatePicker,
  DateField,
  Calendar,
} from "@heroui/react";

export const DatePicker = ({
  label,
  name,
  value,
  onChange,
  className,
  classNames,
  isRequired,
  required,
  variant = "bordered",
  isInvalid,
  errorMessage,
  ariaLabel,
  locale = "en-GB",
  ...props
}: any) => {
  const mustRequired = isRequired || required;

  const customTrigger = classNames?.trigger || classNames?.inputWrapper || "";
  const hasBg = /\bbg-/.test(customTrigger);
  const hasBorder = /\bborder-|\bborder\b/.test(customTrigger);
  const hasPadding = /\bp[xy]?-\d+/.test(customTrigger);
  const hasRounded = /\brounded-/.test(customTrigger);
  const hasMinHeight = /\bmin-h-/.test(customTrigger);

  let bgClass = hasBg ? "" : "bg-gray-100 hover:bg-gray-200";
  let borderClass = hasBorder ? "" : "border border-gray-300 focus-within:border-green-500";
  let paddingClass = hasPadding ? "" : "px-3.5 py-2.5";
  let roundedClass = hasRounded ? "" : "rounded-xl";
  let minHeightClass = hasMinHeight ? "" : "min-h-[40px]";

  if (isInvalid) {
    borderClass = "border-2 border-red-500 focus-within:border-red-500";
    bgClass = hasBg ? "" : "bg-red-50/50";
  } else if (variant === "bordered") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-2 border-gray-200 hover:border-gray-300 focus-within:border-green-500";
  } else if (variant === "flat") {
    bgClass = hasBg ? "" : "bg-gray-100 hover:bg-gray-200";
    borderClass = hasBorder ? "" : "border-none focus-within:border-green-500";
  } else if (variant === "underlined") {
    bgClass = hasBg ? "" : "bg-transparent";
    borderClass = hasBorder ? "" : "border-b border-gray-200 focus-within:border-green-500";
    roundedClass = "";
    paddingClass = "px-0 py-2.5";
  }

  const triggerClasses = `w-full flex h-12 px-0 justify-between items-center text-gray-700 dark:text-gray-200 text-sm ${minHeightClass} transition-colors outline-none focus:outline-none ${bgClass} ${borderClass} ${paddingClass} ${roundedClass} ${customTrigger}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className || ""}`}>
      {label && (
        <label className={`text-xs font-medium text-gray-700 dark:text-gray-300 pl-1 ${classNames?.label || ""}`}>
          {label}
          {mustRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <I18nProvider locale={locale}>
        <HeroDatePicker
          className="w-full "
          value={value as any}
          onChange={onChange as any}
          aria-label={ariaLabel || label || "Pilih Tanggal"}
          {...props}
        >
          <DateField.Group className={`${triggerClasses} px-0!`}>
            <DateField.Input className="flex items-center gap-0.5 w-full text-sm text-gray-700 dark:text-gray-200">
              {(segment: any) => (
                <DateField.Segment
                  segment={segment}
                  className="px-0.5 outline-none focus:bg-green-100 dark:focus:bg-green-900/50 rounded text-sm text-gray-700 dark:text-gray-200 font-normal"
                />
              )}
            </DateField.Input>
            <DateField.Suffix>
              <HeroDatePicker.Trigger className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer p-0.5 ml-2 transition-colors flex items-center justify-center">
                <HeroDatePicker.TriggerIndicator />
              </HeroDatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>

          <HeroDatePicker.Popover className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl bg-white dark:bg-gray-850 p-3 z-50 flex flex-col gap-2">
            <Calendar aria-label="Kalender" className="rounded-xl bg-transparent">
              <Calendar.Header className="flex items-center justify-between pb-2 mb-1 border-b border-gray-150 dark:border-gray-750">
                <Calendar.YearPickerTrigger className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 cursor-pointer font-semibold text-xs text-gray-800 dark:text-gray-100">
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <div className="flex items-center gap-0.5">
                  <Calendar.NavButton
                    slot="previous"
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 cursor-pointer text-xs"
                  />
                  <Calendar.NavButton
                    slot="next"
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 cursor-pointer text-xs"
                  />
                </div>
              </Calendar.Header>

              <Calendar.Grid className="w-full">
                <Calendar.GridHeader>
                  {(day: any) => (
                    <Calendar.HeaderCell className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 pb-1 text-center w-7">
                      {day}
                    </Calendar.HeaderCell>
                  )}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date: any) => (
                    <Calendar.Cell
                      date={date}
                      className="text-xs w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 selected:!bg-green-600 selected:!text-white font-medium"
                    />
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>

              <Calendar.YearPickerGrid className="w-full">
                <Calendar.YearPickerGridBody>
                  {({ year }: any) => (
                    <Calendar.YearPickerCell
                      year={year}
                      className="text-xs px-2 py-1 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 selected:!bg-green-600 selected:!text-white font-medium"
                    />
                  )}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </HeroDatePicker.Popover>
        </HeroDatePicker>
      </I18nProvider>
      {isInvalid && errorMessage && (
        <span className="text-xs text-red-500 pl-1">{errorMessage}</span>
      )}
    </div>
  );
};
