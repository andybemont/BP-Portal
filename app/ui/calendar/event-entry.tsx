"use client";
import {
  toNiceDateString,
  userNamesByIds,
} from "@/app/lib/helpers/client-side-helpers";
import { CalendarEntry } from "@/app/lib/data-model/definitions";
import Link from "next/link";

export default function EventEntry({ e }: { e: CalendarEntry }) {
  return (
    <Link href={`./home/clients/${e.client_id}/view`}>
      <div className="w-full text-sm rounded-md mb-2 p-1 hover:bg-green/50 font-medium border-black/50 border bg-green/20">
        <p>
          {`${toNiceDateString(e.date)}  - ${e.client_name}`}
          <span>{` ${e.text}`}</span>
          <span>{` (${userNamesByIds([
            e.user_id,
            e.seconduser_id,
            e.thirduser_id,
          ])})`}</span>
        </p>
      </div>
    </Link>
  );
}
