"use client";

import * as React from "react";
import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DueDate({
  value: externalValue,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    externalValue || "In 2 days"
  );
  const [date, setDate] = React.useState<Date | undefined>(
    parseDate(inputValue) || undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);

  // Update internal state when prop value changes
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInputValue(externalValue);
      const parsedDate = parseDate(externalValue);
      if (parsedDate) {
        setDate(parsedDate);
        setMonth(parsedDate);
      }
    }
  }, [externalValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date" className="">
        Due Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder="Select date"
          className="bg-background pr-10"
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            const date = parseDate(newValue);
            if (date) {
              setDate(date);
              setMonth(date);
            }
            onChange?.(newValue);
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
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                const formattedDate = formatDate(date);
                setInputValue(formattedDate);
                setOpen(false);
                onChange?.(formattedDate);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* <div className="text-muted-foreground px-1 text-sm">
        This will be expired on{" "}
        <span className="font-medium">{formatDate(date)}</span>.
      </div> */}
    </div>
  );
}
