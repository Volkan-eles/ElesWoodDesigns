import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategorySection from "@/components/CategorySection";
import FaqSection from "@/components/FaqSection";
import WhySection from "@/components/WhySection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <FeaturedProducts />
      <CategorySection />
      <FaqSection />
    </>
  );
}
