import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

function Featured() {
  // Data for the feature sections
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
    <section className="w-full py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-8">
        {/* First row with text and illustration */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          {/* Left column - Text content */}
          <div className="w-full md:w-1/2">
            <div className="h-full flex flex-col justify-center gap-4cl">
              <h2 className="font-extrabold text-black text-3xl md:text-4xl lg:text-5xl mb-6 whitespace-pre-line">
                {features[0].title}
              </h2>
              <p className="font-normal text-[#000000de] text-base md:text-lg">{features[0].description}</p>
            </div>
          </div>
          {/* Right column - Illustration */}
          <Card className="w-full md:w-1/2 rounded-[20px] overflow-hidden border shadow-none">
            <CardContent className="p-6 md:p-12">
            <div className="relative max-w-[500px] h-auto mx-auto">
            <Image
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                  alt="PDF Editing Illustration"
                  src="/illustration-1.svg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Second row with illustration and text */}
        <div className="flex flex-col md:flex-row-reverse gap-8">
          {/* Left column - Text content (on right in desktop) */}
          <div className="w-full md:w-1/2">
            <div className="h-full flex flex-col justify-center">
              <h2 className="font-extrabold text-black text-3xl md:text-4xl lg:text-5xl mb-6 whitespace-pre-line">
                {features[1].title}
              </h2>
              <p className="font-normal text-[#000000de] text-base md:text-lg">{features[1].description}</p>
            </div>
          </div>
          {/* Right column - Illustration (on left in desktop) */}
          <Card className="w-full md:w-1/2 rounded-[20px] overflow-hidden border shadow-none">
            <CardContent className="p-6 md:p-12">
              <div className="relative max-w-[500px] h-auto mx-auto">
                <Image
                  width={500}
                  height={500}
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