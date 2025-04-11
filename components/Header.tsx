import Image from "next/image";
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
          <Image src="./logo.svg" alt="Logo" width={120} height={120} />
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex items-center h-10 py-2 cursor-pointer">
                <span className="font-medium text-xs text-[#192833] tracking-tight">{item.label}</span>
                {item.hasDropdown && <ChevronDownIcon className="w-3.5 h-3.5 ml-1" />}
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center">
            <button className="font-medium text-xs text-[#192833] hover:text-[#712fff]">
              Request a demo
            </button>
            <Separator orientation="vertical" className="h-5 mx-3" />
            <button className="font-medium text-xs text-[#192833] mr-3 hover:text-[#712fff]">
              Sign in
            </button>
            <Button className="bg-[#712fff] text-white rounded-md h-8 px-3 font-medium text-xs hover:bg-[#712fff]/90">
              Try for free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
