import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Featured from "@/components/Featured";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection"
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
<div className="bg-[#FBF9F4] min-h-screen font-[family-name:var(--font-inter)] ">
<Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <Featured />
        <TestimonialsSection />
        <PricingSection />
        <NewsletterSection />
        <Footer />

      </main>
    </div>
  );
}