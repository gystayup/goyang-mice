import { notFound } from "next/navigation";
import PrototypePage from "../../prototype/_page";

export default function LocalePrototypePage() {
  // Block prototype page exposure in production environment
  if (process.env.NODE_ENV === "production") notFound();

  return <PrototypePage />;
}