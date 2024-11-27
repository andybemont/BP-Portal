"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Client, ScheduledEvent } from "./definitions";
import { insertScheduledEvent, updateScheduledEvent } from "./data";

type IdResult = {
  id: string;
};

const ClientFormSchema = z.object({
  id: z.string(),
  userId: z.string({
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

const EventFormSchema = z.object({
  id: z.string(),
  type: z.string(),
  client_id: z.string(),
  user_id: z.string().nullish(),
  seconduser_id: z.string().nullish(),
  thirduser_id: z.string().nullish(),
  date: z.coerce.date().nullish(),
  title: z.string().nullish(),
  notes: z.string().nullish(),
  cost: z.coerce.number().nullish(),
  duration: z.coerce.number().nullish(),
  engagementsession: z.coerce.boolean().nullish(),
  priorityediting: z.coerce.boolean().nullish(),
  numphotographers: z.coerce.number().nullish(),
  location: z.string().nullish(),
  location2: z.string().nullish(),
  location3: z.string().nullish(),
  location4: z.string().nullish(),
  pixieseturl: z.string().nullish(),
});

const ClientForm = ClientFormSchema.omit({ date: true, id: true });
const EventForm = EventFormSchema.omit({ id: true });

export type ClientFormState = {
  errors?: {
    userId?: string[];
    primarypersonname?: string[];
    primarypersonemail?: string[];
    primarypersonphone?: string[];
    notes?: string[];
  };
  message?: string | null;
};

export type EventFormState = {
  errors?: {
    type?: string[];
    client_id?: string[];
    user_id?: string[];
    seconduser_id?: string[];
    thirduser_id?: string[];
    date?: string[];
    title?: string[];
    notes?: string[];
    cost?: string[];
    duration?: string[];
    engagementsession?: string[];
    priorityediting?: string[];
    numphotographers?: string[];
    location?: string[];
    location2?: string[];
    location3?: string[];
    location4?: string[];
    pixieseturl?: string[];
  };
  message?: string | null;
};

const nullIfEmpty = (value: string | FormDataEntryValue | null) => {
  if (!value || value.toString().length === 0) {
    return null;
  }
  return value;
};

const extractEventFormData = (formData: FormData) => {
  return EventForm.safeParse({
    type: formData.get("type"),
    client_id: nullIfEmpty(formData.get("client_id")),
    user_id: nullIfEmpty(formData.get("user_id")),
    seconduser_id: nullIfEmpty(formData.get("seconduser_id")),
    thirduser_id: nullIfEmpty(formData.get("thirduser_id")),
    date: nullIfEmpty(formData.get("date")),
    title: nullIfEmpty(formData.get("title")),
    notes: nullIfEmpty(formData.get("notes")),
    cost: nullIfEmpty(formData.get("cost")),
    duration: nullIfEmpty(formData.get("duration")),
    engagementsession: nullIfEmpty(formData.get("engagementsession")),
    priorityediting: nullIfEmpty(formData.get("priorityediting")),
    numphotographers: nullIfEmpty(formData.get("numphotographers")),
    location: nullIfEmpty(formData.get("location")),
    location2: nullIfEmpty(formData.get("location2")),
    location3: nullIfEmpty(formData.get("location3")),
    location4: nullIfEmpty(formData.get("location4")),
    pixieseturl: nullIfEmpty(formData.get("pixieseturl")),
  });
};

const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

const validateEvent = (id: string | null | undefined, formData: FormData) => {
  const validatedFields = extractEventFormData(formData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "See field errors.",
      event: null as ScheduledEvent | null,
    };
  }

  return {
    errors: undefined,
    message: undefined,
    event: {
      id: id,
      type: validatedFields.data.type as "Wedding" | "Shoot" | "Meeting",
      client_id: validatedFields.data.client_id,
      user_id: validatedFields.data.user_id || undefined,
      seconduser_id: validatedFields.data.seconduser_id || undefined,
      thirduser_id: validatedFields.data.thirduser_id || undefined,
      date: validatedFields.data.date || undefined,
      title: validatedFields.data.title || undefined,
      notes: validatedFields.data.notes || undefined,
      cost: validatedFields.data.cost || undefined,
      duration: validatedFields.data.duration || undefined,
      engagementsession: validatedFields.data.engagementsession || undefined,
      priorityediting: validatedFields.data.priorityediting || undefined,
      numphotographers: validatedFields.data.numphotographers || undefined,
      location: validatedFields.data.location || undefined,
      location2: validatedFields.data.location2 || undefined,
      location3: validatedFields.data.location3 || undefined,
      location4: validatedFields.data.location4 || undefined,
      pixieseturl: validatedFields.data.pixieseturl || undefined,
    } as ScheduledEvent,
  };
};

export async function createEvent(
  prevState: EventFormState,
  formData: FormData
) {
  console.error("test");
  const validationResult = validateEvent(uuidv4(), formData);

  console.error("test2");
  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as EventFormState;
  }
  console.error("test3");

  try {
    console.error(JSON.stringify(validationResult));
    if (validationResult.event) {
      insertScheduledEvent(validationResult.event);
    }
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to create event." };
  }
  redirect(`/home/clients/${validationResult.event?.client_id}/view`);
}

export async function updateEvent(
  id: string,
  prevState: EventFormState,
  formData: FormData
) {
  const validationResult = validateEvent(id, formData);

  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as EventFormState;
  }

  try {
    if (validationResult.event) {
      updateScheduledEvent(validationResult.event);
    }
  } catch (error) {
    return { message: "Database Error: Failed to update event." };
  }
  redirect(`/home/clients/${validationResult.event?.client_id}/view`);
}

export async function createClient(
  prevState: ClientFormState,
  formData: FormData
) {
  const validatedFields = ClientForm.safeParse({
    userId: formData.get("userId"),
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
    userId,
    primarypersonname,
    primarypersonemail,
    primarypersonphone,
    notes,
  } = validatedFields.data;

  var id = "";
  try {
    const idResult = await sql<IdResult>`
      INSERT INTO clients(user_id, primarypersonname, primarypersonemail, primarypersonphone, notes)
      VALUES (${userId}, ${primarypersonname}, ${primarypersonemail}, ${primarypersonphone}, ${notes})
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
    userId: formData.get("userId"),
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
    userId,
    primarypersonname,
    primarypersonemail,
    primarypersonphone,
    notes,
  } = validatedFields.data;

  try {
    await sql`
      UPDATE clients
      SET user_id = ${userId},
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

export async function deleteEvent(event: ScheduledEvent) {
  try {
    await sql`
      DELETE FROM scheduledevents WHERE id = ${event.id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to delete event." };
  }
  redirect(`/home/clients/${event.client_id}/view`);
}

export async function deleteClient(client: Client) {
  console.error("whaT??");
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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
