"use client";

import { ScheduledEvent } from "@/app/lib/definitions";

export default function WeddingCard({
  scheduledEvent,
}: {
  scheduledEvent: ScheduledEvent;
}) {
  return (
    <div
      className={`rounded-md bg-pink-600/40 p-1 my-1 placeholder:text-gray-500 text-black`}
    >
      <div className="block text-md font-medium flex flex-row">
        <p>{scheduledEvent.type}</p>
      </div>
    </div>
  );
}
