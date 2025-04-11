import Image from "next/image";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Header() {
  const navigationItems = [
    { label: "Products", hasDropdown: true },
    { label: "Solutions", hasDropdown: true },
    { label: "Learn & Discover", hasDropdown: true },
    { label: "Pricing", hasDropdown: false },
  ]

  return (
    <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-white/70 supports-[backdrop-filter]:bg-white/60">
      <div className="w-full max-w-7xl mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          <Image
            src="./logo.svg"
            alt="Logo"
            width={150}
            height={150}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex items-center h-12 py-2.5 cursor-pointer">
                <span className="font-medium text-sm text-[#192833] tracking-[0.01px]">{item.label}</span>
                {item.hasDropdown && <ChevronDownIcon className="w-4 h-4 ml-1" />}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button
              className="font-medium text-sm text-[#192833] hover:text-[#712fff]"
            >
              Request a demo
            </button>

            <Separator orientation="vertical" className="h-6 mx-4" />
            <button
              className="font-medium text-sm text-[#192833] mr-4 hover:text-[#712fff]"
            >
              Sign in
            </button>
            <Button className="bg-[#712fff] text-white rounded-lg h-10 px-4 font-medium text-sm hover:bg-[#712fff]/90">
              Try for free
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;