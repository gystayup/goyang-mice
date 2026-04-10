import HeroSection from "@/components/home/HeroSection";
import CoreSection from "@/components/home/CoreSection";
import WhyGoyangSection from "@/components/home/WhyGoyangSection";
import ProductPreviewSection from "@/components/home/ProductPreviewSection";
import ContactCtaSection from "@/components/home/ContactCtaSection";
import MobileQuickActions from "@/components/home/MobileQuickActions";

export default function HomePageContent() {
  return (
    <>
      <HeroSection />
      <CoreSection />
      <WhyGoyangSection />
      <ProductPreviewSection />
      <ContactCtaSection />
      <MobileQuickActions />
    </>
  );
}
