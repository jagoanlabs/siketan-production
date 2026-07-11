import { DatePicker as RACDatePicker, DateField, Button, Calendar, CalendarCell, CalendarGrid, Popover } from "@heroui/react";

export const DatePicker = ({ label, name, value, onChange, className, ...props }: any) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className || ""}`}>
      {label && <span className="text-xs font-semibold text-gray-600 pl-1">{label}</span>}
      <RACDatePicker value={value} onChange={onChange} {...props}>
        <div className="relative flex items-center justify-between bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm min-h-[40px] px-3 focus-within:border-green-500 transition-colors">
          <DateField className="flex gap-0.5 w-full">
            {(segment: any) => <DateField.Segment segment={segment} className="px-0.5 outline-none focus:bg-green-100 rounded text-gray-700" />}
          </DateField>
          <span className="text-gray-400">📅</span>
        </div>
        <Popover>
          <Popover.Dialog className="p-4 bg-white border border-gray-150 rounded-xl shadow-lg">
            <Calendar>
              <header className="flex justify-between items-center mb-2">
                <Button slot="previous" className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">◀</Button>
                <span className="text-sm font-semibold text-gray-700"></span>
                <Button slot="next" className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">▶</Button>
              </header>
              <CalendarGrid>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className="w-8 h-8 flex items-center justify-center text-sm rounded-lg hover:bg-gray-100 cursor-pointer selected:bg-green-500 selected:text-white"
                  />
                )}
              </CalendarGrid>
            </Calendar>
          </Popover.Dialog>
        </Popover>
      </RACDatePicker>
    </div>
  );
};
