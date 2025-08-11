import React from 'react'
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

function HeroSection() {
  const companyLogos = [
    { src: "./image-4.svg", alt: "Company logo 1" },
    { src: "./image-3.svg", alt: "Company logo 2" },
    { src: "./image-2.svg", alt: "Company logo 3" },
    { src: "./image.svg", alt: "Company logo 4" },
    { src: "./image-1.svg", alt: "Company logo 5" },
    { src: "./image-7.svg", alt: "Company logo 6" },
    { src: "./image-8.svg", alt: "Company logo 7" },
    { src: "./image-9.svg", alt: "Company logo 8" },
  ]

  return (
    <section className="w-full py-12 md:py-20 overflow-hidden">
      <div className=" max-w-7xl mx-auto px-8 ">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-40 items-center">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex items-center gap-1.5 bg-[#f3f0ea] rounded-md w-fit py-1.5 px-2.5">
              <StarIcon className="w-[14px] h-[14px] fill-current text-[#712fff]" />
              <span className="font-normal text-black text-xs">5.0 / Overall client rating</span>
            </div>

            <h1 className="font-extrabold text-black text-3xl md:text-4xl lg:text-[52px]">
              Make your PDFs easier and faster.
            </h1>

            <p className="font-normal text-[#000000de] text-sm md:text-base max-w-[410px]">
              Fill out, e-sign, and manage your PDFs with 20,000+ templates and personalized forms
            </p>

            <Button className="h-10 px-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/90">
              Get Started for free
            </Button>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative w-full aspect-square max-w-[470px] mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  width={300}
                  height={300}
                  className="w-full h-auto max-w-[400px]"
                  alt="PDF Ease Illustration"
                  src="./illustration-0.svg"
                />

                <div className="absolute bottom-8 left-0 bg-white rounded-[8px] py-1.5 px-3 shadow-lg">
                  <span className="font-medium text-black text-sm">Made easier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full py-10 bg-[#f3f0ea] mt-16">
        <div className="w-full max-w-7xl mx-auto px-3">
          <h3 className="font-normal text-base text-[#233f52] text-center mb-6">You're in good company</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {companyLogos.map((logo, index) => (
              <div
                key={index}
                className="w-[64px] md:w-[92px] h-8 md:h-11 bg-no-repeat bg-contain bg-center"
                style={{ backgroundImage: `url(${logo.src})` }}
                aria-label={logo.alt}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

export default HeroSection
