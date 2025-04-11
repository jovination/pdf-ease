import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
      <Header />
      <HeroSection />
     
    </div>
  );
}
