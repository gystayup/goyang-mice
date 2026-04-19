import Shell from "@/components/layout/Shell";
import NewsPage, { metadata } from "../../news/_page";

export { metadata };

export const dynamic = "force-dynamic";

export default async function LocaleNewsPage() {
  return (
    <Shell>
      {await NewsPage()}
    </Shell>
  );
}
