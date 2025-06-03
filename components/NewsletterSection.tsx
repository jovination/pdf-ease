'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function NewsletterSection() {
  const circles = [
    { size: "w-[380px] h-[392px]", position: "top-[441px] left-[71px]" },
    { size: "w-[523px] h-[538px]", position: "top-[368px] left-0" },
    { size: "w-[453px] h-[466px]", position: "top-[404px] left-9" },
    { size: "w-[380px] h-[392px]", position: "top-[73px] left-[750px]" },
    { size: "w-[523px] h-[538px]", position: "top-0 left-[680px]" },
    { size: "w-[453px] h-[466px]", position: "top-[36px] left-[717px]" },
  ];

  return (
    <section className="w-full py-12 md:py-20 mt-16">
      <div className="container max-w-7xl mx-auto px-6">
        <Card className="bg-[#712fff] rounded-[20px] overflow-hidden border-none relative">
          <CardContent className="p-6 md:p-10 relative z-10">
            <div className="max-w-[560px] mx-auto text-center relative z-10">
              {circles.map((circle, index) => (
                <div
                  key={index}
                  className={`absolute ${circle.size} ${circle.position} rounded-[1000px] border border-solid border-[#625df1] z-0`}
                />
              ))}
              <h2 className="font-extrabold text-white text-2xl md:text-3xl lg:text-4xl mb-3">
                Get early access benefit test our product.
              </h2>

              <p className="font-normal text-white text-sm md:text-base mb-6">
                We&apos;re excited to offer MetaMask users instant ACH funding Superweb.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-[320px] mx-auto">
                <Input
                  className="h-[42px] bg-white rounded-xl text-[#0000004c] text-sm py-3 px-3 flex-grow"
                  placeholder="Enter your email"
                  defaultValue=""
                />
                <Button className="h-[42px] bg-black rounded-xl font-normal text-white text-sm px-5">
                  Subscribe
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 text-white opacity-60 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default NewsletterSection;
