import React from 'react'
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

function  HeroSection(){

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
    <section className="w-full py-16 md:py-24 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="flex items-center gap-2 bg-[#f3f0ea] rounded-lg w-fit py-2 px-3">
              <StarIcon className="w-[18px] h-[18px] fill-current text-black" />
              <span className="font-normal text-black text-sm">5.0 / Overall client rating</span>
            </div>

            <h1 className="font-extrabold text-black text-4xl md:text-5xl lg:text-[65px] leading-tight tracking-tight">
              Make your PDFs easier and faster.
            </h1>

            <p className="font-normal text-[#000000de] text-base md:text-lg max-w-[510px]">
              Fill out, e-sign, and manage your PDFs with 20,000+ templates and personalized forms
            </p>

            <Button className="h-12 px-6 bg-black text-white text-base font-medium rounded-lg hover:bg-black/90">
              Get Started for free
            </Button>
          </div>

          <div className="w-full md:w-1/2  relative">
            <div className="relative w-full aspect-square max-w-[590px] mx-auto">

              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  width={500}
                  height={500}
                  className="w-full h-auto max-w-[500px]"
                  alt="PDF Ease Illustration" 
                  src="./illustration.svg"
                   />

                <div className="absolute bottom-10 left-0 bg-white rounded-[10px] py-2 px-4 shadow-lg">
                  <span className="font-medium text-black text-base">Made easier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="w-full py-12 bg-[#f3f0ea] mt-20">
          <div className="w-full max-w-7xl mx-auto px-4">
            <h3 className="font-normal text-lg text-[#233f52] text-center mb-8">You're in good company</h3>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {companyLogos.map((logo, index) => (
                <div
                  key={index}
                  className="w-[80px] md:w-[115px] h-10 md:h-14 bg-no-repeat bg-contain bg-center"
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
