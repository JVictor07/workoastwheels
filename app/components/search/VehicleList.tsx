import { Pagination, trpc } from "@/trpc.ts";
import { useFormContext } from "react-hook-form";
import { combineDateTime, FormValues } from "@/components/search/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMemo } from "react";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/trpc.ts";
import { ErrorFallback } from "../ErrorFallback";

function PaginationButtons({ data }: { data: Pagination }) {
  const form = useFormContext<FormValues>();
  const page = form.watch("page");

  return (
    <div className="flex justify-center mt-6">
      <Button
        variant="link"
        onClick={() => form.setValue("page", page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>
      <Button
        variant="link"
        onClick={() => form.setValue("page", page + 1)}
        disabled={page === data.totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export function VehicleList() {
  const form = useFormContext<FormValues>();
  const startDate = form.watch("startDate");
  const startTime = form.watch("startTime");
  const endDate = form.watch("endDate");
  const endTime = form.watch("endTime");
  const minPassengers = form.watch("minPassengers");
  const classification = form.watch("classification");
  const make = form.watch("make");
  const price = form.watch("price");
  const page = form.watch("page");

  const startDateTime = useMemo(
    () => combineDateTime(startDate, startTime),
    [startDate, startTime],
  );
  const endDateTime = useMemo(
    () => combineDateTime(endDate, endTime),
    [endDate, endTime],
  );

  const [searchResponse] = trpc.vehicles.search.useSuspenseQuery(
    {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      page: Number(page),
      passengerCount: Number(minPassengers),
      classification: classification,
      make: make,
      priceMin: price[0],
      priceMax: price[1],
    },
    {
      keepPreviousData: true,
    },
  );

  if (startDateTime >= endDateTime) {
    return <ErrorFallback message="End date cannot be before or equal to start date" />;
  }

  if (searchResponse.vehicles.length === 0) {
    return (
      <div
        className="flex justify-center items-center h-32"
        role="status"
        aria-live="polite"
      >
        <p className="text-muted-foreground">
          No vehicles found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Vehicle search results">
      <div
        className="mb-4 text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {searchResponse.pagination.totalItems === 0
          ? "No vehicles found"
          : searchResponse.pagination.totalItems === 1
            ? "1 vehicle found"
            : `${searchResponse.pagination.totalItems} vehicles found`}
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Available vehicles"
      >
        {searchResponse.vehicles.map((vehicle: Vehicle) => {
          return (
            <div key={vehicle.id} role="listitem">
              <VehicleCard vehicle={vehicle} />
            </div>
          );
        })}
      </div>
      <nav aria-label="Search results pagination">
        <PaginationButtons data={searchResponse.pagination} />
      </nav>
    </section>
  );
}
