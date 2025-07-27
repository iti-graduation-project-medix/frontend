import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatDate(date) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

// Custom Dropdown for react-day-picker using shadcn Select
function CustomDropdown({ options, value, onChange }) {
  const handleValueChange = (newValue) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue,
        },
      };
      onChange(syntheticEvent);
    }
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Select value={value?.toString()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full h-full min-w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value.toString()}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function Calendar28({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(value || new Date());

  React.useEffect(() => {
    if (value) setMonth(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value ? formatDate(value) : ""}
          placeholder="June 01, 2025"
          className="bg-background pr-10 py-4 "
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            if (isValidDate(newDate)) {
              onChange(newDate);
              setMonth(newDate);
            } else {
              onChange(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={month}
              fromYear={1950}
              toYear={2030}
              onMonthChange={setMonth}
              components={{ Dropdown: CustomDropdown }}
              onSelect={(selectedDate) => {
                onChange(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
