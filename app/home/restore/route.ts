import { restoreBackup } from "@/app/lib/backup-restore/restore";

export async function GET() {
  await restoreBackup();
}
