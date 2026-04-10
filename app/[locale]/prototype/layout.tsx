import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로토타입",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocalePrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
