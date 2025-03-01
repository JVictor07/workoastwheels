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
    <Card key={vehicle.id} className="w-full" role="article" aria-labelledby={`vehicle-title-${vehicle.id}`}>
      <CardHeader>
        <CardTitle className="text-xl" id={`vehicle-title-${vehicle.id}`}>
          {vehicle.make} {vehicle.model}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={vehicle.thumbnail_url}
            className="h-full w-full object-cover"
            alt={`image of ${vehicle.make} ${vehicle.model}`}
          />
        </div>
        <div className="grid gap-3" role="list" aria-label="Vehicle specifications">
          <div className="space-y-2" role="listitem">
            <dl>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Class:</dt>
                <dd className="font-medium">{vehicle.classification}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Passengers:</dt>
                <dd className="font-medium">{vehicle.max_passengers}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Doors:</dt>
                <dd className="font-medium">{vehicle.doors}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-2" role="listitem">
            <dl>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Year:</dt>
                <dd className="font-medium">{vehicle.year}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Hourly Rate:</dt>
                <dd className="font-medium">
                  ${(vehicle.hourly_rate_cents / 100).toFixed(2)}
                </dd>
              </div>
            </dl>
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
            aria-label={`Reserve ${vehicle.year} ${vehicle.make} ${vehicle.model} at $${(vehicle.hourly_rate_cents / 100).toFixed(2)} per hour`}
          >
            Reserve now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
