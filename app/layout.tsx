import "@/app/ui/global.css";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "Bemont Photo Portal",
    default: "Bemont Photo Portal",
  },
  description:
    "Helping Exceptional Photographers Do Exception Wedding Photography.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>{children}</body>
    </html>
  );
}
