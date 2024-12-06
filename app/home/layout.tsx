import Nav from "@/app/ui/nav/nav";
export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden bg-white p-1">
      <div className="w-full flex-none md:w-64">
        <Nav />
      </div>
      <div className="grow md:overflow-y-auto ">{children}</div>
    </div>
  );
}
