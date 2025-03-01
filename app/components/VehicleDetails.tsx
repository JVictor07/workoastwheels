import type { Vehicle } from "@/trpc.ts";

export interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <div 
      className="flex flex-col md:flex-row items-center gap-8"
      aria-labelledby="vehicle-title"
    >
      <div className="flex flex-col items-center">
        <img
          src={vehicle.thumbnail_url}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.classification} class vehicle with ${vehicle.max_passengers} passenger capacity`}
          className="w-full max-w-[140px] rounded-full bg-blue-50 p-4 mb-4"
        />
      </div>
      <div className="flex flex-col ml-4 items-center md:items-start">
        <h2 
          id="vehicle-title"
          className="text-3xl font-bold text-center md:text-left leading-tight"
        >
          {vehicle.make} {vehicle.model}
        </h2>
        <dl 
          className="max-w-lg md:max-w-unset grid grid-cols-3 gap-12 mt-4"
          aria-label="Vehicle specifications"
        >
          <div>
            <dt className="text-sm text-gray-600" id="year-label">Year</dt>
            <dd aria-labelledby="year-label">{vehicle.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600" id="passengers-label">Passengers</dt>
            <dd aria-labelledby="passengers-label">{vehicle.max_passengers}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600" id="class-label">Class</dt>
            <dd aria-labelledby="class-label">{vehicle.classification}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
