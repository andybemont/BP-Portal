import { ScheduledEvent } from "@/app/lib/definitions";
import Link from "next/link";

export default async function ScheduledEventTable({
  scheduledEvents,
}: {
  scheduledEvents: ScheduledEvent[];
}) {
  var count = 0;
  console.warn(JSON.stringify(scheduledEvents));
  return (
    <div className="w-full mt-1 flow-root overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-gray-200 p-1 pb-0">
          <div className="">
            {scheduledEvents?.map((scheduledEvent) => (
              <Link
                key={++count}
                href={`./home/clients/${scheduledEvent.client_id}/edit`}
              >
                <div className="w-full rounded-md mb-1 bg-white font-medium">
                  <p>
                    {`${scheduledEvent.date?.toLocaleDateString()}  - ${
                      scheduledEvent.client_name
                    }`}
                  </p>
                  <p className="w-full items-center">
                    <span>{`${
                      scheduledEvent.type !== "Wedding" && scheduledEvent.time
                        ? new Date(
                            "1/1/2000 " + scheduledEvent.time
                          )?.toLocaleTimeString()
                        : ""
                    } ${scheduledEvent.type}`}</span>
                    <span className="text-xs">{` (${scheduledEvent.user_name})`}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
