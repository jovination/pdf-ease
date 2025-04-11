"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  text: string
  name?: string
  position?: string
  avatar?: string
  rating: number
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 2,
      text: '"PdfEase makes managing documents easy. Signing and editing are a breeze!"',
      name: "Russ Herisson",
      position: "Founder of Airbnb",
      avatar: "/nt5rnwddcyco41kadusu1y8axg-png.png",
      rating: 5,
    },
    {
      id: 3,
      text: '"PdfEase helps me save time and keep things simple for my business."',
      name: "Emily Davis",
      position: "Marketing Manager",
      avatar: "/5ajonghnd6tijws2nvmelj4hnc-png.png",
      rating: 5,
    },
    {
      id: 4,
      text: '"Great interface and powerful tools. It changed how I work with PDFs."',
      name: "Michael Johnson",
      position: "Project Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
    },
    {
      id: 5,
      text: '"Tried many tools — PdfEase is by far the most intuitive and reliable."',
      name: "Sarah Williams",
      position: "Legal Assistant",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
    },
  ]

  return (
    <section className="w-full py-10 md:py-12 lg:py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center mb-10 md:mb-14">
        <h2 className="font-extrabold text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center leading-tight">
        Hear what teams around <br className="hidden md:block" />
            the world are saying.
          </h2>
        </div>

        <div className="overflow-visible w-full max-w-7xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card className="h-full rounded-2xl overflow-hidden">
                      <CardContent className="py-2 px-4 h-full flex flex-col justify-between gap-3">
                        <div className="space-y-3">
                          <div className="flex">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-purple-600 fill-purple-600" />
                            ))}
                          </div>
                          <p className="font-normal text-gray-800 text-base leading-relaxed">{testimonial.text}</p>
                        </div>

                        <div className="flex bg-gray-50 p-2 items-center rounded-xl">
                          <Avatar className="h-10 w-10 rounded-full border-2 border-white shadow-sm">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-800">
                              {testimonial.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                            <p className="font-normal text-gray-500 text-xs">{testimonial.position}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6 gap-4">
              <CarouselPrevious className="relative static translate-y-0 h-9 w-9 border-gray-200 text-gray-700 hover:bg-gray-100" />
              <CarouselNext className="relative static translate-y-0 h-9 w-9 border-gray-200 text-gray-700 hover:bg-gray-100" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
