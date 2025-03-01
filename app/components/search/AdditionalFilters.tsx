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

export function AdditionalFilters() {
  const form = useFormContext<FormValues>();
  const [optionsResponse] = trpc.vehicles.options.useSuspenseQuery();
  const [localPriceRange, setLocalPriceRange] = useState(form.getValues("price"));

  const debouncedFormPriceChange = useDebouncedCallback(
    (value: [number, number]) => {
      form.setValue("price", value);
    },
    500
  );

  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    debouncedFormPriceChange(value);
  };

  return (
    <div className="space-y-6">
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
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${localPriceRange[0]}</span>
                <span>${localPriceRange[1]}</span>
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Select minimum passengers" />
              </SelectTrigger>
              <SelectContent>
                {optionsResponse.passengerCounts.map((count) => (
                  <SelectItem key={count} value={count.toString()}>
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
                  className="w-full justify-between"
                >
                  {field.value.length > 0
                    ? `${field.value.length} selected`
                    : "Select vehicle classes"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search vehicle class..." />
                  <CommandEmpty>No vehicle class found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-64">
                      {optionsResponse.classifications.map((classification) => (
                        <CommandItem
                          key={classification}
                          onSelect={() => {
                            const newValue = field.value.includes(classification)
                              ? field.value.filter((x) => x !== classification)
                              : [...field.value, classification];
                            field.onChange(newValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(classification)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
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
              <div className="flex gap-2 flex-wrap mt-2">
                {field.value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(field.value.filter((x) => x !== item))
                    }
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
                  className="w-full justify-between"
                >
                  {field.value.length > 0
                    ? `${field.value.length} selected`
                    : "Select vehicle makes"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search vehicle make..." />
                  <CommandEmpty>No vehicle make found.</CommandEmpty>
                  <CommandGroup>
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
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(make)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
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
              <div className="flex gap-2 flex-wrap mt-2">
                {field.value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(field.value.filter((x) => x !== item))
                    }
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
