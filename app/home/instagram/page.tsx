import InstagramView from "@/app/ui/instagram/table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  return (
    <main>
      <InstagramView />
    </main>
  );
}
