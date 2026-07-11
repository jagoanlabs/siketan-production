# Design System - RangeCalendar

The `RangeCalendar` component from HeroUI v3 is a highly composable calendar interface designed to select range values (start and end dates). It features a native, accessible year picker grid.

---

## Anatomy and Subcomponents

To prevent layout breaks, the calendar must be constructed using its compound parts:

- **`RangeCalendar.Header`**: The container for navigation and year trigger.
- **`RangeCalendar.YearPickerTrigger`**: Button to switch the grid to year selection.
- **`RangeCalendar.YearPickerTriggerHeading`**: Heading text display within trigger.
- **`RangeCalendar.YearPickerTriggerIndicator`**: Indicator icon for year picker toggle.
- **`RangeCalendar.Grid`**: The day-selection grid of the calendar.
- **`RangeCalendar.GridHeader` & `GridBody`**: Header and body elements of the day grid.
- **`RangeCalendar.Cell`**: Interactive date options cell.
- **`RangeCalendar.YearPickerGrid`**: Selection grid overlay for navigating years.
- **`RangeCalendar.YearPickerGridBody` & `YearPickerCell`**: Grid cells rendering individual year buttons.

---

## Styling Design

- **Outer Button (Trigger)**:
  - Background: `bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600`
  - Spacing: `py-6`
  - Border: `border border-gray-300 dark:border-gray-600`
  - Border Radius: `rounded-xl`
- **Calendar Overlay Popover**:
  - Container padding: `p-4`
  - Background: `bg-white dark:bg-gray-800`
  - Border: `border border-gray-150 dark:border-gray-700`
  - Shadow & Rounded: `rounded-xl shadow-lg`

---

## Usage Example

### RangeCalendar Popover with YearPicker

```tsx
import { Popover, PopoverTrigger, PopoverContent, RangeCalendar, Button } from "@heroui/react";

<div className="w-full md:w-72 flex flex-col gap-1.5">
  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 pl-1">
    Prakiraan Panen
  </span>
  <Popover>
    <PopoverTrigger>
      <Button
        className="w-full justify-between bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-6 border border-gray-300 dark:border-gray-600 rounded-xl"
        variant="flat"
        endContent={<span className="text-gray-400">📅</span>}
      >
        {calendarRange.start && calendarRange.end
          ? `${calendarRange.start.toString()} - ${calendarRange.end.toString()}`
          : "Pilih Rentang Waktu"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-lg">
      <RangeCalendar
        aria-label="Rentang Prakiraan Panen"
        value={calendarRange.start && calendarRange.end ? calendarRange : null}
        focusedValue={calendarFocusedValue}
        onFocusChange={setCalendarFocusedValue}
        onChange={handleCalendarRangeChange}
      >
        <RangeCalendar.Header>
          <RangeCalendar.YearPickerTrigger>
            <RangeCalendar.YearPickerTriggerHeading />
            <RangeCalendar.YearPickerTriggerIndicator />
          </RangeCalendar.YearPickerTrigger>
          <RangeCalendar.NavButton slot="previous" />
          <RangeCalendar.NavButton slot="next" />
        </RangeCalendar.Header>
        <RangeCalendar.Grid>
          <RangeCalendar.GridHeader>
            {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
          </RangeCalendar.GridHeader>
          <RangeCalendar.GridBody>
            {(date) => <RangeCalendar.Cell date={date} />}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
        <RangeCalendar.YearPickerGrid>
          <RangeCalendar.YearPickerGridBody>
            {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
          </RangeCalendar.YearPickerGridBody>
        </RangeCalendar.YearPickerGrid>
      </RangeCalendar>
    </PopoverContent>
  </Popover>
</div>
```
