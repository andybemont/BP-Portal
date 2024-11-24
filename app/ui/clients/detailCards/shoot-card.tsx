"use client";

import { ScheduledEvent } from "@/app/lib/definitions";

export default function ShootCard({
  scheduledEvent,
}: {
  scheduledEvent: ScheduledEvent;
}) {
  const time = scheduledEvent.time
    ? " " + new Date("1/1/2000 " + scheduledEvent.time)?.toLocaleTimeString()
    : "";

  return (
    <div
      className={`rounded-md bg-emerald-600/30 p-1 my-1 placeholder:text-gray-500 text-black`}
    >
      <div className="block text-md font-medium">
        <p>
          {`${
            scheduledEvent.date?.toLocaleDateString() || "Unscheduled"
          }${time} - ${scheduledEvent.title || scheduledEvent.type} (${
            scheduledEvent.user_name || "Unassigned"
          })`}
        </p>
        {scheduledEvent.pixiesetUrl && (
          <p>
            Gallery:{" "}
            <a href={scheduledEvent.pixiesetUrl}>
              {scheduledEvent.pixiesetUrl}
            </a>
          </p>
        )}
        <p className="whitespace-pre overflow-wrap max-h-[300px] overflow-y-auto">
          {scheduledEvent.notes}
        </p>
      </div>
    </div>
  );
}
