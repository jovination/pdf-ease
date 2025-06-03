"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Image from "next/image";
import Link from "next/link";

export function SignIn() {
  return (
    <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-[500px] bg-white rounded-[24px]">
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
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#712fff] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button className="w-full bg-[#712fff] hover:bg-[#712fff]/90">
              Sign in
            </Button>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.href = "/signup"}
                className="text-[#712fff] .;/   hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;