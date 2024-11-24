"use client";

import { ScheduledEvent } from "@/app/lib/definitions";

export default function MeetingCard({
  scheduledEvent,
}: {
  scheduledEvent: ScheduledEvent;
}) {
  const time = scheduledEvent.time
    ? " " + new Date("1/1/2000 " + scheduledEvent.time)?.toLocaleTimeString()
    : "";

  return (
    <div
      className={`rounded-md bg-amber-600/40 p-1 my-1 placeholder:text-gray-500 text-black`}
    >
      <div className="block text-md font-medium">
        <p>
          {`${
            scheduledEvent.date?.toLocaleDateString() || "Unscheduled"
          }${time}- ${scheduledEvent.title || scheduledEvent.type} (${
            scheduledEvent.user_name || "Unassigned"
          })`}
        </p>
        <p className="whitespace-pre overflow-wrap max-h-[300px] overflow-y-auto">
          {scheduledEvent.notes}
        </p>
      </div>
    </div>
  );
}
