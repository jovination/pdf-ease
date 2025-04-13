"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Image from "next/image";
import Link from "next/link";

export function SignUp() {
  return (
    <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-[500px] bg-white rounded-2xl">
      <CardContent className="p-8 ">
      <div className="mb-8 text-center">
            <Link href="/" >
            <Image
                         src="/logo.svg"
                         alt="PdfEase Logo"
                         width={180}
                         height={180}
                         className="h-12 mx-auto mb-6"
                       />
              </Link>         
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-600">Get started with PdfEase</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="firstName"
                >
                  First name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="lastName"
                >
                  Last name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full"
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="mt-1 mr-2" />
              <span className="text-sm">
                I agree to the{" "}
                <button type="button" className="text-[#712fff] hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-[#712fff] hover:underline">
                  Privacy Policy
                </button>
              </span>
            </div>

            <Button className="w-full bg-[#712fff] hover:bg-[#712fff]/90">
              Create account
            </Button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.href = "/signin"}
                className="text-[#712fff] hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;