import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const industries = [
  "Agriculture",
  "Automotive",
  "Banking & Finance",
  "Construction",
  "Education",
  "Entertainment",
  "Food & Beverage",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Manufacturing",
  "Professional Services",
  "Real Estate",
  "Retail",
  "Technology",
  "Transportation",
  "Wholesale",
  "Other",
];

interface IndustryInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function IndustryInput({ value, onValueChange, placeholder, disabled, icon }: IndustryInputProps) {
  const [open, setOpen] = useState(false);
  const filteredOptions = industries.filter((option) => option.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              placeholder={placeholder}
              type="text"
              className="ps-9"
              value={value}
              onChange={(e) => {
                const newValue = e.target.value;
                onValueChange(newValue);
                setOpen(true);
              }}
              onBlur={(e) => {
                if (!e.relatedTarget?.closest("[cmdk-item]")) {
                  setOpen(false);
                }
              }}
              disabled={disabled}
            />
            {icon && (
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3">
                {icon}
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          side="bottom"
          sideOffset={2}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              {filteredOptions.length === 0 && value ? (
                <></>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        onValueChange(option);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === option ? "opacity-100" : "opacity-0")} />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
