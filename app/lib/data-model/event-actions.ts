"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { Event } from "./definitions";
import { nullIfEmpty, uuidv4 } from "../helpers/server-side-helpers";
import { ensureTasksForEvent } from "./workflow-actions";
import { db } from "@vercel/postgres";
const client = await db.connect();

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

const EventForm = EventFormSchema.omit({ id: true });

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

const extractEventFormData = async (formData: FormData) => {
  return EventForm.safeParse({
    type: formData.get("type"),
    client_id: await nullIfEmpty(formData.get("client_id")),
    user_id: await nullIfEmpty(formData.get("user_id")),
    seconduser_id: await nullIfEmpty(formData.get("seconduser_id")),
    thirduser_id: await nullIfEmpty(formData.get("thirduser_id")),
    date: await nullIfEmpty(formData.get("date")),
    title: await nullIfEmpty(formData.get("title")),
    notes: await nullIfEmpty(formData.get("notes")),
    cost: await nullIfEmpty(formData.get("cost")),
    duration: await nullIfEmpty(formData.get("duration")),
    engagementsession: await nullIfEmpty(formData.get("engagementsession")),
    priorityediting: await nullIfEmpty(formData.get("priorityediting")),
    numphotographers: await nullIfEmpty(formData.get("numphotographers")),
    location: await nullIfEmpty(formData.get("location")),
    location2: await nullIfEmpty(formData.get("location2")),
    location3: await nullIfEmpty(formData.get("location3")),
    location4: await nullIfEmpty(formData.get("location4")),
    pixieseturl: await nullIfEmpty(formData.get("pixieseturl")),
  });
};

const validateEvent = async (
  id: string | null | undefined,
  formData: FormData
) => {
  const validatedFields = await extractEventFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "See field errors.",
      event: null as Event | null,
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
    } as Event,
  };
};

export async function createEvent(
  prevState: EventFormState,
  formData: FormData
) {
  const validationResult = await validateEvent(await uuidv4(), formData);

  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as EventFormState;
  }

  try {
    if (validationResult.event) {
      await insertEventRecord(validationResult.event);
      await ensureTasksForEvent(validationResult.event.id);
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
  const validationResult = await validateEvent(id, formData);

  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as EventFormState;
  }

  try {
    if (validationResult.event) {
      await updateEventRecord(validationResult.event);
      await ensureTasksForEvent(id);
    }
  } catch (error) {
    return { message: "Database Error: Failed to update event." };
  }
  redirect(`/home/clients/${validationResult.event?.client_id}/view`);
}

export async function deleteEvent(event: Event) {
  try {
    await sql`
      DELETE FROM tasks WHERE event_id = ${event.id}
    `;
    await sql`
      DELETE FROM events WHERE id = ${event.id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to delete event." };
  }
  redirect(`/home/clients/${event.client_id}/view`);
}

export async function updateEventRecord(event: any) {
  try {
    const sql = `
    UPDATE events SET
      client_id = ${event.client_id ? `'${event.client_id}'` : "null"},
      user_id = ${event.user_id ? `'${event.user_id}'` : "null"},
      seconduser_id = ${
        event.seconduser_id ? `'${event.seconduser_id}'` : "null"
      },
      thirduser_id = ${event.thirduser_id ? `'${event.thirduser_id}'` : "null"},
      date = ${event.date ? `'${event.date.toISOString()}'` : "null"},
      title = ${event.title ? `'${event.title}'` : "null"},
      notes = ${event.notes ? `'${event.notes}'` : "null"},
      cost = ${event.cost ? `'${event.cost}'` : "null"},
      duration = ${event.duration ? `'${event.duration}'` : "null"},
      engagementsession = ${
        event.engagementsession ? `'${event.engagementsession}'` : "null"
      },
      priorityediting = ${
        event.priorityediting ? `'${event.priorityediting}'` : "null"
      },
      numphotographers = ${
        event.numphotographers ? `'${event.numphotographers}'` : "null"
      },
      location = ${event.location ? `'${event.location}'` : "null"},
      location2 = ${event.location2 ? `'${event.location2}'` : "null"},
      location3 = ${event.location3 ? `'${event.location3}'` : "null"},
      location4 = ${event.location4 ? `'${event.location4}'` : "null"},
      pixieseturl = ${event.pixieseturl ? `'${event.pixieseturl}'` : "null"}
    WHERE id = '${event.id}'
  `;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update event.");
  }
}

export async function insertEventRecord(event: any) {
  try {
    const sql = `
     INSERT INTO events (
      id,
    ${event.client_id ? `client_id,` : ""}
    ${event.user_id ? `user_id,` : ""}
    ${event.seconduser_id ? `seconduser_id,` : ""}
    ${event.thirduser_id ? `thirduser_id,` : ""}
    ${event.date ? `date,` : ""}
    ${event.title ? `title,` : ""}
    ${event.notes ? `notes,` : ""}
    ${event.cost ? `cost,` : ""}
    ${event.duration ? `duration,` : ""}
    ${event.engagementsession ? `engagementsession,` : ""}
    ${event.priorityediting ? `priorityediting,` : ""}
    ${event.numphotographers ? `numphotographers,` : ""}
    ${event.location ? `location,` : ""}
    ${event.location2 ? `location2,` : ""}
    ${event.location3 ? `location3,` : ""}
    ${event.location4 ? `location4,` : ""}
    ${event.pixieseturl ? `pixieseturl,` : ""}
      type
     ) VALUES (
      '${event.id}',
      ${event.client_id ? `'${event.client_id}',` : ""}
      ${event.user_id ? `'${event.user_id}',` : ""}
      ${event.seconduser_id ? `'${event.seconduser_id}',` : ""}
      ${event.thirduser_id ? `'${event.thirduser_id}',` : ""}
      ${event.date ? `'${new Date(event.date).toISOString()}',` : ""}
      ${event.title ? `'${event.title}',` : ""}
      ${event.notes ? `'${event.notes}',` : ""}
      ${event.cost ? `'${event.cost}',` : ""}
      ${event.duration ? `'${event.duration}',` : ""}
      ${event.engagementsession ? `'${event.engagementsession}',` : ""}
      ${event.priorityediting ? `'${event.priorityediting}',` : ""}
      ${event.numphotographers ? `'${event.numphotographers}',` : ""}
      ${event.location ? `'${event.location}',` : ""}
      ${event.location2 ? `'${event.location2}',` : ""}
      ${event.location3 ? `'${event.location3}',` : ""}
      ${event.location4 ? `'${event.location4}',` : ""}
      ${event.pixieseturl ? `'${event.pixieseturl}',` : ""}
      '${event.type}'
     )
      RETURNING ID
   `;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update event.");
  }
}
