import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

function FeaturesSection() {
  // Feature data for mapping
  const features = [
    {
      id: 1,
      title: "Share PDF",
      description:
        "With help of PDF ease you can share your pdf files by email or link as soon as you have edited, filled or signed them online",
      iconSrc: "/9035887-share-social-sharp-icon-1.svg",
      iconAlt: "Share PDF",
    },
    {
      id: 2,
      title: "Fill out PDF",
      description:
        "PDF ease provides different tools for filling in PDF forms. All you need is to register, upload necessary document and start filling it out.",
      iconSrc: "/8666681-edit-icon-1.svg",
      iconAlt: "Fill out PDF",
    },
    {
      id: 3,
      title: "Sign PDF",
      description:
        "PD ease gives the opportunity to sign documents online, save them, send at once by email or print. Register now, upload your document and e-sign it online",
      iconSrc: "/9075865-edit-pencil-write-paper-file-icon-1.svg",
      iconAlt: "Sign PDF",
    },
    {
      id: 4,
      title: "Draw on PDF",
      description:
        "Draw lines, circles, and other drawings on PDF using tools of PDF ease online. Streamline your document editing process, speeding up your productivity",
      iconSrc: "/7968880-pen-pen-tool-adobe-illustrator-tool-icon-1.svg",
      iconAlt: "Draw on PDF",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-extrabold text-black text-3xl md:text-4xl lg:text-5xl text-center leading-tight mb-2">
            Here&apos;s are the features
          </h2>
          <h2 className="font-extrabold text-black text-3xl md:text-4xl lg:text-5xl text-center leading-tight">
            PDF ease.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-[#f3f0ea] rounded-[20px] border-none h-full">
              <CardContent className="p-6 md:p-8">
                <div className="w-[60px] h-[60px] bg-[#712fff] rounded-[10px] overflow-hidden mb-6 relative">
                  <Image
                    width={30}
                    height={30}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    alt={feature.iconAlt}
                    src={feature.iconSrc || "/placeholder.svg"}
                  />
                </div>

                <div>
                  <h3 className="font-extrabold text-black text-xl md:text-2xl mb-4">{feature.title}</h3>
                  <p className="font-normal text-black text-base">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
