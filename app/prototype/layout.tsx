import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로토타입",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
