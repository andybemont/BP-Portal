import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

async function ExternalLink(props: { href: string; caption: string }) {
  return (
    <li className="bg-pop2 transition-all my-2 p-2 rounded-lg hover:bg-pop1 hover:text-darkblue">
      <a href={props.href} target="_blank">
        <div className="flex flex-row">
          <span>{props.caption}</span>
          <ArrowTopRightOnSquareIcon className="ml-2 h-6" />
        </div>
      </a>
    </li>
  );
}

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  return (
    <main>
      <ul className="m-1 py-1 px-2 rounded-lg border border-black">
        <ExternalLink
          href="https://accounts.pixieset.com/login/?spId=gallery-dashboard"
          caption="Pixieset"
        />
        <ExternalLink
          href="https://gallery.bemontphoto.com"
          caption="Client Galleries"
        />
        <ExternalLink
          href="https://app.signnow.com/rctapp/login"
          caption="SignNow"
        />
        <ExternalLink href="https://www.bemontphoto.com/" caption="Website" />
        <ExternalLink
          href="https://www.bemontphoto.com/pricing"
          caption="Pricing"
        />
        <ExternalLink
          href="https://mail.google.com/mail/u/1/#inbox"
          caption="Gmail"
        />
        <ExternalLink
          href="https://docs.google.com/spreadsheets/d/1B94KwPJROMg8xGIiP5b7KSbo1ujOmJ1hSIipKzI3muo/edit?gid=0#gid=0"
          caption="Spreadsheet"
        />
        <ExternalLink
          href="https://www.instagram.com/thebemontphoto/"
          caption="Instagram"
        />
        <ExternalLink
          href="https://www.weddingpro.com/dashboard"
          caption="WeddingPro"
        />
      </ul>
    </main>
  );
}
