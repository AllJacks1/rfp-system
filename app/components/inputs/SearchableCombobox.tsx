import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export function SearchableCombobox({
  value,
  onSelect,
  options,
  placeholder = "Search...",
  emptyMessage = "No results found.",
  searchPlaceholder = "Search...",
  displayKey = "name",
  valueKey = "id",
  optional = false,
  optionalLabel,
  align = "start",
  disabled = false,
}: {
  value: string;
  onSelect: (value: string, item: any) => void;
  options: any[];
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  displayKey?: string;
  valueKey?: string;
  optional?: boolean;
  optionalLabel?: string;
  align?: "start" | "center" | "end";
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const selectedItem = options?.find((opt) => opt?.[valueKey] === value);
  const displayValue = selectedItem?.[displayKey] || value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-normal transition-colors",
            !value && "text-slate-500",
            value && "text-slate-900",
          )}
        >
          <span className="truncate">{displayValue || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align={align}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {optional && (
                <CommandItem
                  value=""
                  onSelect={() => {
                    onSelect("", null);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      !value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="text-slate-500 italic">
                    {optionalLabel || "None"}
                  </span>
                </CommandItem>
              )}
              {Array.isArray(options) &&
                options.map((option) => {
                  if (!option?.[valueKey]) return null;
                  const isSelected = value === option[valueKey];

                  return (
                    <CommandItem
                      key={option[valueKey]}
                      value={option[displayKey]}
                      onSelect={() => {
                        onSelect(option[valueKey], option);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{option[displayKey]}</span>
                        {option.subtitle && (
                          <span className="text-xs text-slate-400 truncate">
                            {option.subtitle}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
