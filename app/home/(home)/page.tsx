import { fetchCalendar } from "@/app/lib/data";
import EventTable from "@/app/ui/calendar/table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const calendarEntries = await fetchCalendar();
  return (
    <main>
      <EventTable calendarEntries={calendarEntries} />
    </main>
  );
}
