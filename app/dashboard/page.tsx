import { DashboardLayout } from "@/components/dashboard-layout"
import { PdfEditor } from "@/components/pdf-editor"
import { PdfProvider } from "@/context/pdf-context"
import { CollaborationProvider } from "@/context/collaboration-context"

export default function Home() {
  return (
    <DashboardLayout>
      <CollaborationProvider>
        <PdfProvider>
          <PdfEditor />
        </PdfProvider>
      </CollaborationProvider>
    </DashboardLayout>
  )
}
