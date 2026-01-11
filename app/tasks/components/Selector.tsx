import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemProp {
  title: string;
  value: string;
}
interface SelectorProps {
  items: ItemProp[];
  selectLabel: string;
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function Selector({
  items,
  selectLabel,
  placeholder,
  value,
  onValueChange,
  disabled = false,
}: SelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full" disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {items?.map((item, idx) => (
            <SelectItem key={idx} value={item.value}>
              {item.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
