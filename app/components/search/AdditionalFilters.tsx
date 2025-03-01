import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { RangeSlider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "./form";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/classnames";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/trpc";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

interface VehicleOptions {
  makes: string[];
  classifications: string[];
  passengerCounts: number[];
}

export function AdditionalFilters() {
  const form = useFormContext<FormValues>();
  const [localPriceRange, setLocalPriceRange] = useState(
    form.getValues("price"),
  );
  const [optionsResponse] =
    trpc.vehicles.options.useSuspenseQuery<VehicleOptions>();

  const debouncedFormPriceChange = useDebouncedCallback(
    (value: [number, number]) => {
      form.setValue("price", value);
    },
    500,
  );

  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    debouncedFormPriceChange(value);
  };

  return (
    <div
      className="space-y-6"
      role="group"
      aria-label="Additional search filters"
    >
      <FormField
        control={form.control}
        name="price"
        render={() => (
          <FormItem>
            <FormLabel>Hourly Price Range ($)</FormLabel>
            <div className="pt-2">
              <RangeSlider
                min={10}
                max={100}
                step={5}
                value={localPriceRange}
                onValueChange={handlePriceChange}
                className="w-full"
                aria-label="Price range selector"
                aria-valuetext={`Price range from $${localPriceRange[0]} to $${localPriceRange[1]}`}
              />
              <div
                className="flex justify-between mt-2 text-sm text-muted-foreground"
                aria-live="polite"
              >
                <span aria-label="Minimum price">${localPriceRange[0]}</span>
                <span aria-label="Maximum price">${localPriceRange[1]}</span>
              </div>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="minPassengers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Passengers</FormLabel>
            <Select
              value={field.value.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
              aria-label="Select minimum number of passengers"
            >
              <SelectTrigger
                aria-label={`Currently selected: ${field.value} passengers`}
              >
                <SelectValue placeholder="Select minimum passengers" />
              </SelectTrigger>
              <SelectContent>
                {optionsResponse.passengerCounts.map((count: number) => (
                  <SelectItem
                    key={count}
                    value={count.toString()}
                    aria-label={`${count} passengers`}
                  >
                    {count} passengers
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="classification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Class</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-label="Select vehicle classes"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-controls="vehicle-class-listbox"
                  className="w-full justify-between"
                >
                  {field.value.length > 0
                    ? `${field.value.length} vehicle classes selected`
                    : "Select vehicle classes"}
                  <ChevronsUpDown
                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search vehicle class..."
                    aria-label="Search vehicle classes"
                  />
                  <CommandEmpty>No vehicle class found.</CommandEmpty>
                  <CommandGroup id="vehicle-class-listbox">
                    <ScrollArea className="h-64">
                      {optionsResponse.classifications.map((classification) => (
                        <CommandItem
                          key={classification}
                          onSelect={() => {
                            const newValue = field.value.includes(
                              classification,
                            )
                              ? field.value.filter((x) => x !== classification)
                              : [...field.value, classification];
                            field.onChange(newValue);
                          }}
                          aria-selected={field.value.includes(classification)}
                          role="option"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(classification)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                            aria-hidden="true"
                          />
                          {classification}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value.length > 0 && (
              <div
                className="flex gap-2 flex-wrap mt-2"
                role="list"
                aria-label="Selected vehicle classes"
              >
                {field.value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(field.value.filter((x) => x !== item))
                    }
                    role="listitem"
                    aria-label={`Remove ${item}`}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Make</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-label="Select vehicle makes"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-controls="vehicle-make-listbox"
                  className="w-full justify-between"
                >
                  {field.value.length > 0
                    ? `${field.value.length} vehicle makes selected`
                    : "Select vehicle makes"}
                  <ChevronsUpDown
                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search vehicle make..."
                    aria-label="Search vehicle makes"
                  />
                  <CommandEmpty>No vehicle make found.</CommandEmpty>
                  <CommandGroup id="vehicle-make-listbox">
                    <ScrollArea className="h-64">
                      {optionsResponse.makes.map((make) => (
                        <CommandItem
                          key={make}
                          onSelect={() => {
                            const newValue = field.value.includes(make)
                              ? field.value.filter((x) => x !== make)
                              : [...field.value, make];
                            field.onChange(newValue);
                          }}
                          aria-selected={field.value.includes(make)}
                          role="option"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(make)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                            aria-hidden="true"
                          />
                          {make}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value.length > 0 && (
              <div
                className="flex gap-2 flex-wrap mt-2"
                role="list"
                aria-label="Selected vehicle makes"
              >
                {field.value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(field.value.filter((x) => x !== item))
                    }
                    role="listitem"
                    aria-label={`Remove ${item}`}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
