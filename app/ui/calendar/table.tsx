"use client";

import { CalendarEntry } from "@/app/lib/definitions";
import TaskEntry from "./task-entry";
import EventEntry from "./event-entry";

export default function EventTable({
  calendarEntries,
}: {
  calendarEntries: CalendarEntry[];
}) {
  var count = 0;
  return (
    <div className="w-full flow-root overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-green/20 m-1 p-2 pb-0">
          <h1 className={`mb-2 text-xl md:text-2xl`}>Calendar</h1>
          <div className="">
            {calendarEntries?.map((e) => (
              <div key={++count}>
                {e.task_id && <TaskEntry e={e} />}
                {!e.task_id && <EventEntry e={e} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
