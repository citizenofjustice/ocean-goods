"use client";

import { format, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { ru } from "date-fns/locale";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

export const DatePickerWithRange: React.FC<{
  onDateChange: (dateRange: DateRange | undefined) => void;
  className?: string;
}> = ({ className, onDateChange }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef(null);
  useOnClickOutside(popoverRef, () => setIsPopoverOpen(false));

  const handleDateRangeSelect = (dateRange: DateRange | undefined) => {
    if (dateRange && dateRange.from && !dateRange.to) {
      setDateRange(dateRange);
      return;
    }
    if (dateRange && dateRange.from && dateRange.to) {
      const range = { from: dateRange.from, to: endOfDay(dateRange.to) };
      setIsPopoverOpen(false);
      onDateChange(range);
      setDateRange(range);
      return;
    }
  };

  const handleDayBlur = () => {
    if (isPopoverOpen && dateRange && dateRange.from && dateRange.to) {
      setDateRange(undefined);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={() => setIsPopoverOpen(true)}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[245px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd LLL, y", { locale: ru })} -{" "}
                  {format(dateRange.to, "dd LLL, y", { locale: ru })}
                </>
              ) : (
                format(dateRange.from, "dd LLL, y", { locale: ru })
              )
            ) : (
              <span className="text-gray-400">укажите даты</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <div ref={popoverRef}>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(dateRange: DateRange | undefined) =>
                handleDateRangeSelect(dateRange)
              }
              onDayBlur={handleDayBlur}
              numberOfMonths={1}
              locale={ru}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
