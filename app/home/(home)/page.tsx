import { fetchAllUsers, fetchCalendar } from "@/app/lib/data";
import EventTable from "@/app/ui/calendar/table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const users = await fetchAllUsers();
  const calendarEntries = await fetchCalendar();
  return (
    <main>
      <EventTable allUsers={users} calendarEntries={calendarEntries} />
    </main>
  );
}
