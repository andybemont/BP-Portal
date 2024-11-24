import { fetchScheduledEvents } from "@/app/lib/data";
import ScheduledEventTable from "@/app/ui/upcoming/table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const scheduledEvents = await fetchScheduledEvents();
  return (
    <main>
      <ScheduledEventTable scheduledEvents={scheduledEvents} />
    </main>
  );
}
