import HeroSection from "@/components/home/HeroSection";
import CoreSection from "@/components/home/CoreSection";
import WhyGoyangSection from "@/components/home/WhyGoyangSection";
import ProductPreviewSection from "@/components/home/ProductPreviewSection";
import SocialSection from "@/components/home/SocialSection";
import ContactCtaSection from "@/components/home/ContactCtaSection";
import MobileQuickActions from "@/components/home/MobileQuickActions";

export default function HomePageContent({ locale }: { locale: string }) {
  return (
    <>
      <HeroSection locale={locale} />
      <CoreSection locale={locale} />
      <WhyGoyangSection locale={locale} />
      <ProductPreviewSection locale={locale} />
      <SocialSection locale={locale} />
      <ContactCtaSection locale={locale} />
      <MobileQuickActions locale={locale} />
    </>
  );
}
