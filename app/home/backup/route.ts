import { fetchBackup } from "@/app/lib/data";

export async function GET() {
  try {
    return Response.json(await fetchBackup());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
