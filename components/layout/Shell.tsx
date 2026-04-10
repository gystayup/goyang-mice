import { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
