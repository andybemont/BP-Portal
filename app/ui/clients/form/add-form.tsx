"use client";

import { User } from "@/app/lib/definitions";
import { createClient, ClientFormState } from "@/app/lib/actions";
import { useActionState } from "react";
import SharedForm from "./shared-form";

export default function ClientAddForm({ users }: { users: User[] }) {
  const initialState: ClientFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createClient, initialState);

  return <SharedForm formAction={formAction} state={state} users={users} />;
}
