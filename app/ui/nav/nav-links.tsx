"use client";

import {
  UserGroupIcon,
  EnvelopeIcon,
  CalendarIcon,
  CameraIcon,
  ArrowTopRightOnSquareIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Calendar", href: "/home", icon: CalendarIcon },
  { name: "Clients", href: "/home/clients", icon: UserGroupIcon },
  {
    name: "Email Templates",
    href: "/home/email-templates",
    icon: EnvelopeIcon,
  },
  {
    name: "Instagram Helper",
    href: "/home/instagram",
    icon: CameraIcon,
  },
  {
    name: "Reports",
    href: "/home/reports",
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    name: "Links",
    href: "/home/links",
    icon: ArrowTopRightOnSquareIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "transition-all flex h-[48px] grow items-center justify-center gap-2 rounded-md hover:text-darkblue/80 hover:bg-darkblue/20 p-3 text-sm font-medium bg-darkblue/80 text-white md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-accent1 text-black": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
