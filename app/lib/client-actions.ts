"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { Client } from "./definitions";
import { IdResult } from "./helpers";

const ClientFormSchema = z.object({
  id: z.string(),
  user_id: z.string({
    invalid_type_error: "Please select a user.",
  }),
  primarypersonname: z
    .string()
    .min(1, "Name is required")
    .max(50, "Max length of name is 50"),
  primarypersonemail: z.string().max(50, "Max length of email address is 50"),
  primarypersonphone: z.string().max(50, "Max length of phone number is 50"),
  notes: z.string(),
  date: z.string(),
});

const ClientForm = ClientFormSchema.omit({ date: true, id: true });

export type ClientFormState = {
  errors?: {
    user_id?: string[];
    primarypersonname?: string[];
    primarypersonemail?: string[];
    primarypersonphone?: string[];
    notes?: string[];
  };
  message?: string | null;
};

export async function createClient(
  prevState: ClientFormState,
  formData: FormData
) {
  const validatedFields = ClientForm.safeParse({
    user_id: formData.get("user_id"),
    primarypersonname: formData.get("primarypersonname"),
    primarypersonemail: formData.get("primarypersonemail"),
    primarypersonphone: formData.get("primarypersonphone"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create client.",
    };
  }

  const {
    user_id,
    primarypersonname,
    primarypersonemail,
    primarypersonphone,
    notes,
  } = validatedFields.data;

  var id = "";
  try {
    const idResult = await sql<IdResult>`
      INSERT INTO clients(user_id, primarypersonname, primarypersonemail, primarypersonphone, notes)
      VALUES (${user_id}, ${primarypersonname}, ${primarypersonemail}, ${primarypersonphone}, ${notes})
      RETURNING ID
    `;
    id = idResult.rows[0].id;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to create client." };
  }
  redirect(`/home/clients/${id}/view`);
}

export async function updateClient(
  id: string,
  prevState: ClientFormState,
  formData: FormData
) {
  const validatedFields = ClientForm.safeParse({
    user_id: formData.get("user_id"),
    primarypersonname: formData.get("primarypersonname"),
    primarypersonemail: formData.get("primarypersonemail"),
    primarypersonphone: formData.get("primarypersonphone"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Client.",
    };
  }

  const {
    user_id,
    primarypersonname,
    primarypersonemail,
    primarypersonphone,
    notes,
  } = validatedFields.data;

  try {
    await sql`
      UPDATE clients
      SET user_id = ${user_id},
          primarypersonname = ${primarypersonname},
          primarypersonemail = ${primarypersonemail},
          primarypersonphone = ${primarypersonphone},
          notes = ${notes}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Client." };
  }
  redirect(`/home/clients/${id}/view`);
}

export async function deleteClient(client: Client) {
  try {
    await sql`
      DELETE FROM scheduledevents WHERE client_id = ${client.id}
    `;
    await sql`
      DELETE FROM clients WHERE id = ${client.id}
    `;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to delete client." };
  }
  redirect(`/home/clients/`);
}
