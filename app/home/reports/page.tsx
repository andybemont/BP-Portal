import ReportsView from "@/app/ui/reports/main-view";
export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <ReportsView />
    </main>
  );
}
