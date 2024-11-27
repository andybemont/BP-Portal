"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { ScheduledEvent } from "./definitions";
import { insertScheduledEvent, updateScheduledEvent } from "./data";
import { nullIfEmpty, uuidv4 } from "./helpers";
import { revalidatePath } from "next/cache";

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
  const validationResult = await validateEvent(await uuidv4(), formData);

  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as EventFormState;
  }

  try {
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
  const validationResult = await validateEvent(id, formData);

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
