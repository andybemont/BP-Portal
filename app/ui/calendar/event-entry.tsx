"use client";
import { CalendarEntry } from "@/app/lib/definitions";
import Link from "next/link";

export default function EventEntry({ e }: { e: CalendarEntry }) {
  return (
    <Link href={`./home/clients/${e.client_id}/view`}>
      <div className="w-full text-sm rounded-md mb-2 p-1 hover:bg-green/50 font-medium border-black/50 border bg-green/20">
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
      </div>
    </Link>
  );
}
