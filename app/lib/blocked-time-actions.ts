"use server";

import { BlockedTime } from "./definitions";
import { db } from "@vercel/postgres";
const client = await db.connect();
import { z } from "zod";
import { uuidv4 } from "./helpers";
import { redirect } from "next/navigation";

const BlockedTimeFormSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  andy: z.coerce.boolean(),
  carly: z.coerce.boolean(),
  gillian: z.coerce.boolean(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

const BlockedTimeForm = BlockedTimeFormSchema.omit({ id: true });

export type BlockedTimeFormState = {
  errors?: {
    text?: string[];
    andy?: string[];
    carly?: string[];
    gillian?: string[];
    start_date?: string[];
    end_date?: string[];
  };
  message?: string | null;
  success?: boolean;
};

const extractBlockedTimeFormData = async (formData: FormData) => {
  return BlockedTimeForm.safeParse({
    text: formData.get("text"),
    andy: formData.get("andy"),
    carly: formData.get("carly"),
    gillian: formData.get("gillian"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
  });
};

const validateBlockedTime = async (
  id: string | null | undefined,
  formData: FormData
) => {
  const validatedFields = await extractBlockedTimeFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "See field errors.",
      blockedTime: null as BlockedTime | null,
    };
  }

  return {
    errors: undefined,
    message: undefined,
    blockedTime: {
      id: id,
      text: validatedFields.data.text,
      andy: validatedFields.data.andy,
      carly: validatedFields.data.carly,
      gillian: validatedFields.data.gillian,
      start_date: validatedFields.data.start_date,
      end_date: validatedFields.data.end_date,
    } as BlockedTime,
  };
};

export async function insertBlockedTime(
  prevState: BlockedTimeFormState,
  formData: FormData
) {
  const validationResult = await validateBlockedTime(await uuidv4(), formData);

  if (validationResult.errors) {
    return {
      success: false,
      errors: validationResult.errors,
      message: validationResult.message,
    } as BlockedTimeFormState;
  }

  try {
    const sql = `
      INSERT INTO blockedtimes (
        id,
        start_date,
        end_date,
        andy,
        carly,
        gillian,
        text
      ) VALUES (
        '${validationResult.blockedTime.id}',
        '${validationResult.blockedTime.start_date.toISOString()}',
        '${validationResult.blockedTime.end_date.toISOString()}',
         ${validationResult.blockedTime.andy ? "true" : "false"},
         ${validationResult.blockedTime.carly ? "true" : "false"},
         ${validationResult.blockedTime.gillian ? "true" : "false"},
        '${validationResult.blockedTime.text}'
      )`;
    await client.query(sql);

    return {
      success: true,
      errors: undefined,
      message: "Success!",
    } as BlockedTimeFormState;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create blocked time.");
  }
}

export async function updateBlockedTime(
  id: string,
  prevState: BlockedTimeFormState,
  formData: FormData
) {
  const validationResult = await validateBlockedTime(id, formData);

  if (validationResult.errors) {
    return {
      success: false,
      errors: validationResult.errors,
      message: validationResult.message,
    } as BlockedTimeFormState;
  }
  try {
    const sql = `
        UPDATE blockedtimes
           SET start_date = '${validationResult.blockedTime.start_date.toISOString()}',
               end_date = '${validationResult.blockedTime.end_date.toISOString()}',
               andy = ${validationResult.blockedTime.andy ? "true" : "false"},
               carly = ${validationResult.blockedTime.carly ? "true" : "false"},
               gillian = ${
                 validationResult.blockedTime.gillian ? "true" : "false"
               },
               text = '${validationResult.blockedTime.text}'
         WHERE id = '${validationResult.blockedTime.id}'`;
    await client.query(sql);
    return {
      success: true,
      errors: undefined,
      message: "Success!",
    } as BlockedTimeFormState;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update blocked time.");
  }
}
