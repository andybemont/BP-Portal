"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import { useState } from "react";
import ClientDetailCard from "./detailCards/client-detail-card";
import EventCard from "./detailCards/event-card";

export default function ClientDetailForm({
  client,
  users,
}: {
  client: ClientDetails;
  users: User[];
}) {
  const user = users.find((u) => u.id === client.user_id);

  var count = 0;
  return (
    <div key={++count}>
      <ClientDetailCard
        key={++count}
        client={client}
        user={user}
        allUsers={users}
      />
      {client.scheduledEvents.map((scheduledEvent) => {
        var usersForThisEvent = users.filter(
          (u) =>
            u.id === scheduledEvent.user_id ||
            u.id === scheduledEvent.seconduser_id ||
            u.id === scheduledEvent.thirduser_id
        );

        return (
          <EventCard
            key={++count}
            scheduledEvent={scheduledEvent}
            users={usersForThisEvent}
          />
        );
      })}
    </div>
  );
}
