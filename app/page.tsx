import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Featured from "@/components/Featured";

export default function Home() {
  return (
    <div className="bg-[#FBF9F4] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <Featured />
      </main>
    </div>
  );
}