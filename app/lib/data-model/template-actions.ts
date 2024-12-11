"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { EmailTemplate } from "./definitions";
import { uuidv4 } from "../helpers/server-side-helpers";

const TemplateFormSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  notes: z.string(),
});

const TemplateForm = TemplateFormSchema.omit({ id: true });

export type TemplateFormState = {
  errors?: {
    user_id?: string[];
    title?: string[];
    notes?: string[];
  };
  message?: string | null;
};

const extractTemplateFormData = (formData: FormData) => {
  return TemplateForm.safeParse({
    user_id: formData.get("user_id"),
    title: formData.get("title"),
    notes: formData.get("notes"),
  });
};

const validateTemplate = (
  id: string | null | undefined,
  formData: FormData
) => {
  const validatedFields = extractTemplateFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "See field errors.",
      template: null as EmailTemplate | null,
    };
  }

  return {
    errors: undefined,
    message: undefined,
    template: {
      id: id,
      user_id: validatedFields.data.user_id || undefined,
      title: validatedFields.data.title || undefined,
      text: validatedFields.data.notes || undefined,
    } as EmailTemplate,
  };
};

export async function deleteTemplate(template: EmailTemplate) {
  try {
    await sql`
      DELETE FROM emailtemplates WHERE id = ${template.id}
    `;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to delete template." };
  }
  redirect(`/home/email-templates`);
}

export async function updateTemplate(
  id: string,
  prevState: TemplateFormState,
  formData: FormData
) {
  const validationResult = validateTemplate(id, formData);

  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as TemplateFormState;
  }

  try {
    await sql`
      UPDATE emailtemplates 
         SET user_id = ${validationResult.template.user_id},
             title = ${validationResult.template.title},
             text = ${validationResult.template.text}
       WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to delete template." };
  }
  redirect(`/home/email-templates`);
}

export async function createTemplate(
  prevState: TemplateFormState,
  formData: FormData
) {
  const validationResult = validateTemplate(await uuidv4(), formData);

  if (validationResult.errors) {
    return {
      errors: validationResult.errors,
      message: validationResult.message,
    } as TemplateFormState;
  }
  try {
    await sql`
            INSERT INTO emailtemplates (user_id, title, text)
            VALUES (${validationResult.template.user_id}, ${validationResult.template.title}, ${validationResult.template.text})
    `;
  } catch (error) {
    return { message: "Database Error: Failed to delete template." };
  }
  redirect(`/home/email-templates`);
}
