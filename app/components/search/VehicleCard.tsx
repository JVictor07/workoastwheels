import { useFormContext } from "react-hook-form";
import { combineDateTime, FormValues } from "@/components/search/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Vehicle } from "@/trpc.ts";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const form = useFormContext<FormValues>();
  const endDate = form.watch("endDate");
  const endTime = form.watch("endTime");
  const startDate = form.watch("startDate");
  const startTime = form.watch("startTime");

  const startDateTime = useMemo(
    () => combineDateTime(startDate, startTime),
    [startDate, startTime]
  );

  const endDateTime = useMemo(
    () => combineDateTime(endDate, endTime),
    [endDate, endTime]
  );

  const bookNowParams = useMemo(
    () => new URLSearchParams({
      id: vehicle.id,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
    }),
    [vehicle.id, startDateTime, endDateTime]
  );

  return (
    <Card key={vehicle.id} className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {vehicle.make} {vehicle.model}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={vehicle.thumbnail_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid  gap-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span className="font-medium">{vehicle.classification}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passengers:</span>
              <span className="font-medium">{vehicle.max_passengers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Doors:</span>
              <span className="font-medium">{vehicle.doors}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year:</span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly Rate:</span>
              <span className="font-medium">
                ${(vehicle.hourly_rate_cents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link
            to={{
              pathname: "review",
              search: bookNowParams.toString(),
            }}
          >
            Reserve now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
