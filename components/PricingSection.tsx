"use client"

import React from "react"
import { CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

 function PricingSection() {
  // Plan data for mapping
  const plans = [
    {
      name: "Free",
      description: "For casual users trying out PDF ease",
      price: "$0",
      period: "/per month",
      highlighted: false,
      features: ["Basic editing tools", "5 credits for editing 5 docs", "Single-page docs only"],
    },
    {
      name: "Starter",
      description: "Students or individuals with moderate PDF editing needs",
      price: "$9",
      period: "p/month",
      highlighted: true,
      features: [
        "Everything on Free, plus",
        "Edit up to 45 docs/month",
        "Multi-page support (up to 10 pages per document)",
      ],
    },
    {
      name: "Pro",
      description: "Busy professionals with extensive PDF editing needs",
      price: "$19",
      period: "p/month",
      highlighted: false,
      features: ["Access to all features", "Edit unlimited docs/month", "Unlimited pages per doc"],
    },
  ]

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-8">
        <div className="text-center mb-10">
        <h2 className="font-extrabold text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-tight mb-6">
        Choose your plan</h2>
          <p className="font-normal text-[#000000de] text-base md:text-lg max-w-[700px] mx-auto">
            Pricing plans for businesses at every stage of growth.
          </p>
        </div>

        <Badge className="bg-[#f3f0ea] text-black hover:bg-[#f3f0ea] py-3 px-6 rounded-lg mx-auto mb-12 block w-fit">
          <span className="font-medium text-sm">Rated 4.97/5 from over 600 reviews.</span>
        </Badge>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`w-full h-full rounded-[20px] overflow-hidden ${
                plan.highlighted ? "bg-[#712fff]" : "bg-white"
              }`}
            >
              <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="mb-8">
                  <h3
                    className={`font-extrabold text-xl md:text-2xl mb-6 ${
                      plan.highlighted ? "text-white" : "text-black"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className={`font-normal text-base mb-6 ${plan.highlighted ? "text-white" : "text-black"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`font-extrabold text-3xl md:text-4xl lg:text-5xl ${
                        plan.highlighted ? "text-white" : "text-black"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className={`ml-2 font-medium text-sm ${plan.highlighted ? "text-white" : "text-black"}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full h-[50px] rounded-lg ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-transparent text-black border border-[#c1bfb4] hover:bg-gray-50"
                  }`}
                >
                  Get Started
                </Button>

                <div className="mt-6 bg-[#fbf9f5] rounded-lg p-5 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start mb-4 last:mb-0">
                      <CheckIcon className="w-5 h-5 text-black mr-2 mt-1 shrink-0" />
                      <span className="font-normal text-black text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
export default PricingSection