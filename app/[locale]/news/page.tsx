import Shell from "@/components/layout/Shell";
import NewsPage, { metadata } from "../../news/_page";

export { metadata };

export default function LocaleNewsPage() {
  return (
    <Shell>
      <NewsPage />
    </Shell>
  );
}
