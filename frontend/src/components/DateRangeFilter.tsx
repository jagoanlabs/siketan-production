import React, { useMemo } from "react";
import type { DateValue } from "@internationalized/date";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  DateField,
  DateRangePicker,
  RangeCalendar,
} from "@heroui/react";
import { FiX } from "react-icons/fi";

export interface DateRangeFilterProps {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  onChange: (startDate: string, endDate: string) => void;
  onClear: () => void;
  className?: string;
  placeholder?: string;
}

type DateRange = {
  start: DateValue;
  end: DateValue;
};

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onChange,
  onClear,
  className = "",
}) => {
  // Convert startDate and endDate (strings) to HeroUI DateRange
  const value = useMemo<DateRange | null>(() => {
    if (!startDate || !endDate) return null;
    try {
      return {
        start: parseDate(startDate),
        end: parseDate(endDate),
      };
    } catch {
      return null;
    }
  }, [startDate, endDate]);

  const handleRangeChange = (newVal: DateRange | null) => {
    if (!newVal || !newVal.start || !newVal.end) {
      onClear();
      return;
    }
    const startStr = newVal.start.toString();
    const endStr = newVal.end.toString();
    onChange(startStr, endStr);
  };

  const applyPreset = (days: number) => {
    const tz = getLocalTimeZone();
    const now = today(tz);

    let start = now;
    if (days === 0) {
      // Hari Ini
      start = now;
    } else if (days === -1) {
      // Bulan Ini
      start = parseDate(`${now.year}-${String(now.month).padStart(2, "0")}-01`);
    } else {
      start = now.subtract({ days: days - 1 });
    }

    onChange(start.toString(), now.toString());
  };

  const hasFilter = Boolean(startDate && endDate);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <DateRangePicker
        className="w-auto"
        value={value}
        onChange={handleRangeChange}
        aria-label="Filter Tanggal Daftar"
      >
        <DateField.Group
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all duration-200 ${
            hasFilter
              ? "bg-blue-50/90 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700/60 shadow-2xs"
              : "bg-gray-100 hover:bg-gray-200/80 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-750 dark:border-gray-700 shadow-2xs"
          }`}
          variant="secondary"
        >
          <DateField.Input slot="start">
            {(segment) => (
              <DateField.Segment
                segment={segment}
                className="outline-none focus:bg-blue-100 dark:focus:bg-blue-900/50 rounded px-0.5 text-xs font-medium text-gray-800 dark:text-gray-200"
              />
            )}
          </DateField.Input>

          <DateRangePicker.RangeSeparator className="text-gray-400 dark:text-gray-500 text-xs px-0.5" />

          <DateField.Input slot="end">
            {(segment) => (
              <DateField.Segment
                segment={segment}
                className="outline-none focus:bg-blue-100 dark:focus:bg-blue-900/50 rounded px-0.5 text-xs font-medium text-gray-800 dark:text-gray-200"
              />
            )}
          </DateField.Input>

          <DateField.Suffix>
            <DateRangePicker.Trigger className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer p-0.5 ml-1">
              <DateRangePicker.TriggerIndicator />
            </DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>

        <DateRangePicker.Popover className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl bg-white dark:bg-gray-850 p-3 z-50 flex flex-col gap-2.5">
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1 border-b border-gray-150 dark:border-gray-750 pb-2">
            <button
              type="button"
              onClick={() => applyPreset(0)}
              className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-gray-100 dark:bg-gray-750 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => applyPreset(7)}
              className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-gray-100 dark:bg-gray-750 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => applyPreset(30)}
              className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-gray-100 dark:bg-gray-750 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              30 Hari
            </button>
            <button
              type="button"
              onClick={() => applyPreset(-1)}
              className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-gray-100 dark:bg-gray-750 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              Bulan Ini
            </button>
          </div>

          <RangeCalendar aria-label="Pilih Rentang Tanggal" className="rounded-xl bg-transparent">
            <RangeCalendar.Header className="flex items-center justify-between pb-2 mb-1 border-b border-gray-150 dark:border-gray-750">
              <RangeCalendar.YearPickerTrigger>
                <RangeCalendar.YearPickerTriggerHeading className="text-xs font-semibold text-gray-900 dark:text-gray-100" />
                <RangeCalendar.YearPickerTriggerIndicator />
              </RangeCalendar.YearPickerTrigger>
              <div className="flex items-center gap-1">
                <RangeCalendar.NavButton
                  slot="previous"
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 cursor-pointer"
                />
                <RangeCalendar.NavButton
                  slot="next"
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 cursor-pointer"
                />
              </div>
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => (
                  <RangeCalendar.HeaderCell className="text-[11px] font-medium text-gray-500 dark:text-gray-400 pb-1 text-center">
                    {day}
                  </RangeCalendar.HeaderCell>
                )}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => (
                  <RangeCalendar.Cell
                    date={date}
                    className="text-xs w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
                )}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
            <RangeCalendar.YearPickerGrid>
              <RangeCalendar.YearPickerGridBody>
                {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
              </RangeCalendar.YearPickerGridBody>
            </RangeCalendar.YearPickerGrid>
          </RangeCalendar>
        </DateRangePicker.Popover>
      </DateRangePicker>

      {hasFilter && (
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
          title="Hapus Filter Tanggal"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
