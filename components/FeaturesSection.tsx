import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Share PDF",
      description:
        "With help of PDF ease you can share your pdf files by  email or   link as soon as you have edited ,filled or signed them online",
      iconSrc: "/9035887-share-social-sharp-icon-1.svg",
      iconAlt: "Share PDF icon",
    },
    {
      id: 2,
      title: "Fill out PDF",
      description:
        "PDF ease provides different tools for filling in PDF forms. All you need is to register,upload necessary document and start filling it out.",
      iconSrc: "/8666681-edit-icon-1.svg",
      iconAlt: "Fill PDF icon",
    },
    {
      id: 3,
      title: "Sign PDF",
      description:
        "PDF ease gives the opportunity to sign documents online, save them, send at once by email or print. Register now, upload your document and e-sign it online",
      iconSrc: "/9075865-edit-pencil-write-paper-file-icon-1.svg",
      iconAlt: "Sign PDF icon",
    },
    {
      id: 4,
      title: "Draw on PDF",
      description:
        " Draw lines, circles, and other drawings on PDF using tools of PDF ease online. Streamline your document editing process, speeding up your productivity",
      iconSrc: "/7968880-pen-pen-tool-adobe-illustrator-tool-icon-1.svg",
      iconAlt: "Draw on PDF icon",
    },
  ]

  return (
    <section className="w-full py-12 md:py-20">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="font-extrabold text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center leading-tight">
            Here are the features of <br /> PDF ease
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-[#f3f0ea] rounded-[16px] border-none h-full">
              <CardContent className="p-5 md:p-6">
                <div className="w-[50px] h-[50px] bg-[#712fff] rounded-[10px] overflow-hidden mb-4 relative">
                  <Image
                    width={28}
                    height={28}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    alt={feature.iconAlt}
                    src={feature.iconSrc}
                  />
                </div>

                <div>
                  <h3 className="font-extrabold text-black text-lg md:text-xl mb-3">{feature.title}</h3>
                  <p className="font-normal text-black text-sm md:text-base">{feature.description}</p>
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
