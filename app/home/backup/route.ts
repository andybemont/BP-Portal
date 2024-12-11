import { fetchBackup } from "@/app/lib/data-model/data";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await fetchBackup());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
