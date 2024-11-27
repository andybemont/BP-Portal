"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type IdResult = {
  id: string;
};

export const nullIfEmpty = async (
  value: string | FormDataEntryValue | null
) => {
  if (!value || value.toString().length === 0) {
    return null;
  }
  return value;
};

export const uuidv4 = async () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

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
