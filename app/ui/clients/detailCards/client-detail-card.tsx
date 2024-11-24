"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function ClientDetailCard({
  client,
  user,
  onEditClick,
}: {
  client: ClientDetails;
  user?: User;
  onEditClick: () => void;
}) {
  return (
    <div
      className={`rounded-md bg-slate-200 md:p-2 mb-1 placeholder:text-gray-500 text-black`}
    >
      <div className="mb-2 block text-md font-medium flex flex-row">
        <p>
          <span className="font-bold">{`${client?.primarypersonname}`}</span>
          {` (${user?.name}'s client)`}
        </p>
        <PencilIcon
          className="text-blue-600 h-5 px-2 cursor-pointer"
          onClick={onEditClick}
        />
      </div>
      {client?.primarypersonemail && (
        <p>
          <span className="font-bold">Email:</span> {client?.primarypersonemail}
        </p>
      )}
      {client?.primarypersonphone && (
        <p>
          <span className="font-bold">Phone:</span> {client?.primarypersonphone}
        </p>
      )}
      {client?.notes && (
        <p className="whitespace-pre overflow-wrap max-h-[300px] overflow-y-auto">
          <span className="font-bold">Notes:</span> {client?.notes}
        </p>
      )}
    </div>
  );
}
