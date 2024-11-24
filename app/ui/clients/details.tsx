"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import { useState } from "react";
import ClientEditForm from "./form/edit-form";
import { PencilIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../button";
import LabelBox from "./form/label-box";
import ValidationErrorBox from "./form/validation-error-box";
import ClientDetailCard from "./detailCards/client-detail-card";
import { scheduledEvents } from "@/app/lib/placeholder-data";
import WeddingCard from "./detailCards/wedding-card";
import ShootCard from "./detailCards/shoot-card";
import MeetingCard from "./detailCards/meeting-card";

export default function ClientDetailForm({
  client,
  users,
}: {
  client: ClientDetails;
  users: User[];
}) {
  const [editMode, setEditMode] = useState(false);
  const user = users.find((u) => u.id === client.user_id);
  if (editMode) {
    return <ClientEditForm client={client} users={users} />;
  } else {
    return (
      <div className="">
        <ClientDetailCard
          client={client}
          user={user}
          onEditClick={() => setEditMode(true)}
        />
        {client.scheduledEvents.map((scheduledEvent) => {
          if (scheduledEvent.type === "Wedding") {
            return <WeddingCard scheduledEvent={scheduledEvent} />;
          } else if (scheduledEvent.type === "Shoot") {
            return <ShootCard scheduledEvent={scheduledEvent} />;
          } else {
            return <MeetingCard scheduledEvent={scheduledEvent} />;
          }
        })}
      </div>
    );
  }
}
