import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Header() {
  const navigationItems = [
    { label: "Products", hasDropdown: true },
    { label: "Solutions", hasDropdown: true },
    { label: "Learn & Discover", hasDropdown: true },
    { label: "Pricing", hasDropdown: false },
  ];

  return (
    <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-white/70 supports-[backdrop-filter]:bg-white/60">
      <div className="w-full max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <Link href= "/" >
          <Image src="./logo.svg" alt="Logo" width={150} height={150} />
          </ Link>
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex items-center h-10 py-2 cursor-pointer">
                <span className="font-medium text-sm text-[#192833] tracking-tight">{item.label}</span>
                {item.hasDropdown && <ChevronDownIcon className="w-3.5 h-3.5 ml-1" />}
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center">
            <Link 
                href="/demo" 
                className="font-medium text-sm text-[#192833] hover:text-[#712fff] cursor-pointer"
            >
                Request a demo
            </Link>
            <Separator orientation="vertical" className="h-5 mx-3" />
            <Link 
                href="/signin" 
                className="font-medium text-sm text-[#192833] mr-3 hover:text-[#712fff] cursor-pointer"
            >
                Sign in
            </Link>
            <Link 
                href="/signup" 
                className="bg-[#712fff] text-white rounded-md h-9 px-4 font-medium text-sm hover:bg-[#712fff]/90 cursor-pointer inline-flex items-center"
            >
                Try for free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
