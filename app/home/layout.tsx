import Nav from "@/app/ui/nav/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <Nav />
      </div>
      <div className="grow p-1 md:overflow-y-auto md:p-1 ">{children}</div>
    </div>
  );
}
