import { CalendarEntry, Event } from "@/app/lib/definitions";
import Link from "next/link";

export default function EventTable({
  calendarEntries,
}: {
  calendarEntries: CalendarEntry[];
}) {
  var count = 0;
  return (
    <div className="w-full flow-root overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-accent2/30 m-1 p-2 pb-0">
          <h1 className={`mb-2 text-xl md:text-2xl`}>Calendar</h1>
          <div className="">
            {calendarEntries?.map((e) => (
              <Link key={++count} href={`./home/clients/${e.client_id}/view`}>
                <div className="w-full text-sm rounded-md mb-2 p-1 hover:bg-white/50 font-medium border-black/50 border bg-transparent">
                  {e.task_id && (
                    <p className="bg-warning/30">
                      {`${e.user_name}: ${e.text} (${e.client_name})`}
                    </p>
                  )}
                  {!e.task_id && (
                    <p>
                      {`${e.date?.toLocaleDateString()}  - ${e.client_name}`}
                      <span>{` ${e.text}`}</span>
                      <span>{` (${
                        e.user_name
                          ? [e.user_name, e.seconduser_name, e.thirduser_name]
                              .filter((p) => p)
                              .join(", ")
                          : "Unassigned"
                      })`}</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
