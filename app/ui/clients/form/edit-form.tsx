"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import { updateClient, ClientFormState } from "@/app/lib/actions";
import { useActionState, useEffect, useState } from "react";
import SharedForm from "./shared-form";

export default function ClientEditForm({
  client,
  users,
}: {
  client: ClientDetails;
  users: User[];
}) {
  const initialState: ClientFormState = { message: null, errors: {} };
  const updateClientWithId = updateClient.bind(null, client.id);
  const [state, formAction] = useActionState(updateClientWithId, initialState);

  return (
    <SharedForm
      formAction={formAction}
      state={state}
      users={users}
      client={client}
    />
  );
}
