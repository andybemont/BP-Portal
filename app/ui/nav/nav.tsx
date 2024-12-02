import NavLinks from "@/app/ui/nav/nav-links";

export default function Nav() {
  return (
    <div className="flex h-full flex-col text-black m-1">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
      </div>
    </div>
  );
}
