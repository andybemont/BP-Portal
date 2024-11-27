import { ScheduledEvent } from "@/app/lib/definitions";
import Link from "next/link";

export default function ScheduledEventTable({
  scheduledEvents,
}: {
  scheduledEvents: ScheduledEvent[];
}) {
  var count = 0;
  return (
    <div className="w-full flow-root overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-amber-100 p-2 pb-0">
          <h1 className={`mb-8 text-xl md:text-2xl`}>Calendar</h1>
          <div className="">
            {scheduledEvents?.map((scheduledEvent) => (
              <Link
                key={++count}
                href={`./home/clients/${scheduledEvent.client_id}/view`}
              >
                <div className="w-full rounded-md mb-2 p-1 bg-white/50 font-medium border-red-950/50 border hover:bg-transparent">
                  <p>
                    {`${scheduledEvent.date?.toLocaleDateString()}  - ${
                      scheduledEvent.client_name
                    }`}
                  </p>
                  <p className="w-full items-center">
                    <span>{`${scheduledEvent.type}`}</span>
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
