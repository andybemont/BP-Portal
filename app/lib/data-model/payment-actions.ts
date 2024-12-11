"use server";

import { Payment } from "./definitions";
import { db } from "@vercel/postgres";
const client = await db.connect();
import { z } from "zod";
import { uuidv4 } from "../helpers/server-side-helpers";

const Schema = z.object({
  id: z.string(),
  client_id: z.string(),
  date: z.coerce.date(),
  amount: z.coerce.number().min(1),
  source: z.string().min(1),
});

const Form = Schema.omit({ id: true });

export type PaymentFormState = {
  errors?: {
    amount?: string[];
    source?: string[];
    date?: string[];
    client_id?: string[];
  };
  payment?: Payment | undefined;
  success?: boolean;
};

const extract = async (formData: FormData) => {
  return Form.safeParse({
    client_id: formData.get("client_id"),
    source: formData.get("source"),
    amount: formData.get("amount"),
    date: formData.get("date"),
  });
};

const validate = async (id: string | null | undefined, formData: FormData) => {
  const validatedFields = await extract(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "See field errors.",
      payment: null as Payment | null,
    };
  }

  return {
    errors: undefined,
    message: undefined,
    payment: {
      id: id,
      client_id: validatedFields.data.client_id,
      source: validatedFields.data.source,
      amount: validatedFields.data.amount,
      date: validatedFields.data.date,
    } as Payment,
  };
};

export async function insertPayment(
  prevState: PaymentFormState,
  formData: FormData
) {
  const validationResult = await validate(await uuidv4(), formData);

  if (validationResult.errors) {
    return {
      success: false,
      errors: validationResult.errors,
      payment: undefined,
    } as PaymentFormState;
  }

  try {
    const sql = `
      INSERT INTO payments (
        id,
        client_id,
        amount,
        date,
        source
      ) VALUES (
        '${validationResult.payment.id}',
        '${validationResult.payment.client_id}',
        ${validationResult.payment.amount},
        '${validationResult.payment.date.toISOString()}',
        '${validationResult.payment.source}'
      )`;
    await client.query(sql);

    return {
      success: true,
      errors: undefined,
      payment: validationResult.payment,
    } as PaymentFormState;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create payment.");
  }
}

export async function updatePayment(
  id: string,
  prevState: PaymentFormState,
  formData: FormData
) {
  const validationResult = await validate(id, formData);

  if (validationResult.errors) {
    return {
      success: false,
      errors: validationResult.errors,
      payment: null as Payment | null,
    } as PaymentFormState;
  }
  try {
    const sql = `
        UPDATE payments
           SET client_id = '${validationResult.payment.client_id}',
               amount = ${validationResult.payment.amount},
               date = '${validationResult.payment.date.toISOString()}',
               source = '${validationResult.payment.source}'
         WHERE id = '${id}'`;
    await client.query(sql);
    return {
      success: true,
      errors: undefined,
      payment: validationResult.payment,
    } as PaymentFormState;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update payment.");
  }
}

export async function deletePayment(payment: Payment) {
  try {
    const sql = `DELETE FROM payments WHERE id = '${payment.id}'`;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete payment.");
  }
}
