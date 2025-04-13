"use client"

import type { ReactNode } from "react"
import { PdfProvider } from "@/context/pdf-context"
import { CollaborationProvider } from "@/context/collaboration-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <PdfProvider>
        <CollaborationProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </CollaborationProvider>
      </PdfProvider>
    </ThemeProvider>
  )
}
