import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-xl text-black md:text-3xl md:leading-normal`}
          >
            <strong>
              Welcome to the{" "}
              <a
                href="https://www.bemontphoto.com/"
                className="text-pop1 underline bg-"
              >
                Bemont Photo
              </a>{" "}
              employee portal
            </strong>
            , helping{" "}
            <a
              href="https://www.bemontphoto.com/team"
              className="text-darkblue underline"
            >
              exceptional photographers
            </a>{" "}
            do{" "}
            <a
              href="https://www.bemontphoto.com/gallery"
              className="text-green underline"
            >
              exceptional wedding photography
            </a>
            .
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-pop2 px-6 py-3 text-sm font-medium text-blue transition-colors hover:bg-pop1 hover:text-darkblue md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
    </main>
  );
}
