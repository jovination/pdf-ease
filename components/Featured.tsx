import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

function Featured() {
  const features = [
    {
      title: "Easy & Efficient\nOnline PDF Editing",
      description:
        "With PDF ease, editing PDFs is easy. Turn your PDF into a canvas like a Word document. Add text, highlight, draw, or insert shapes and images. With PDF ease Pro, you can even edit existing text. The intuitive interface keeps things simple. Edit your PDFs effortlessly!",
    },
    {
      title: "Quick to Save, Easy\nto Share.",
      description:
        "With PDF ease, you can save your edits in seconds, share documents effortlessly, and enjoy a tool that's accessible to all. Whether you're making quick changes or deep edits, PDF ease is built for simplicity and convenience.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-20">
      <div className="container max-w-6xl mx-auto px-6">
        {/* First feature row */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Text content */}
          <div className="w-full md:w-1/2">
            <div className="h-full flex flex-col justify-center gap-6 md:gap-7">
              <h2 className="font-extrabold text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight whitespace-pre-line">
                {features[0].title}
              </h2>
              <p className="font-normal text-[#000000de] text-sm md:text-base">
                {features[0].description}
              </p>
            </div>
          </div>
          {/* Image */}
          <Card className="w-full md:w-1/2 rounded-[16px] overflow-hidden border shadow-none">
            <CardContent className="p-5 md:p-8">
              <div className="relative max-w-[450px] h-auto mx-auto">
                <Image
                  width={450}
                  height={450}
                  className="w-full h-full object-contain"
                  alt="PDF Editing Illustration"
                  src="/illustration-1.svg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second feature row */}
        <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8">
          {/* Text content */}
          <div className="w-full md:w-1/2">
            <div className="h-full flex flex-col justify-center gap-6 md:gap-7">
              <h2 className="font-extrabold text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight whitespace-pre-line">
                {features[1].title}
              </h2>
              <p className="font-normal text-[#000000de] text-sm md:text-base">
                {features[1].description}
              </p>
            </div>
          </div>
          {/* Image */}
          <Card className="w-full md:w-1/2 rounded-[16px] overflow-hidden border shadow-none">
            <CardContent className="p-5 md:p-8">
              <div className="relative max-w-[450px] h-auto mx-auto">
                <Image
                  width={450}
                  height={450}
                  className="w-full h-full object-contain"
                  alt="PDF Sharing Illustration"
                  src="/illustration-2.svg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Featured
