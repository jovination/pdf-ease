"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Redo, Undo, Upload, Loader2, Menu, Save, Download, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PdfViewer } from "@/components/pdf-viewer"
import { PdfToolbar } from "@/components/pdf-toolbar"
import { PdfSidebar } from "@/components/pdf-sidebar"
import { usePdfContext } from "@/context/pdf-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormFieldCreator } from "@/components/form-field-creator"
import { PdfMergeSplit } from "@/components/pdf-merge-split"
import { OcrProcessor } from "@/components/ocr-processor"
import { AnnotationTools } from "@/components/annotation-tools"
import { ESignatureTools } from "@/components/e-signature-tools"
import { ImageManipulation } from "@/components/image-manipulation"
import { EditPdfContent } from "@/components/edit-pdf-content"
import { toast } from "sonner"
import { useMediaQuery } from "@/hooks/use-media-query"
import { SettingsDialog } from "@/components/settings-dialog"
import { UploadProgress } from "@/components/upload-progress"

export function PdfEditor() {
  const {
    loadPdf,
    zoom,
    setZoom,
    currentDocument,
    undoAction,
    redoAction,
    canUndo,
    canRedo,
    isLoading,
    downloadPdf,
    saveToLocalStorage,
    getAvailableDocuments,
    loadFromLocalStorage,
    documentId,
  } = usePdfContext()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("edit")
  const [activeEditTab, setActiveEditTab] = useState("text")
  const [showSidebar, setShowSidebar] = useState(true)
  const [showEditableElements, setShowEditableElements] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fileName, setFileName] = useState("")
  const [documentModified, setDocumentModified] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"uploading" | "processing" | "complete" | "error" | null>(null)
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)
  const [fileSize, setFileSize] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Set filename when document is loaded
  useEffect(() => {
    if (currentDocument) {
      setFileName(currentDocument.name.replace(/\.pdf$/i, ""))
    }
  }, [currentDocument])

  // Mark document as modified when actions are performed
  useEffect(() => {
    if (canUndo) {
      setDocumentModified(true)
    }
  }, [canUndo])

  // Hide sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false)
    } else {
      setShowSidebar(true)
    }
  }, [isMobile])

  // Check for saved documents on mount
  useEffect(() => {
    const savedDocs = getAvailableDocuments()
    if (savedDocs.length > 0) {
      // Could show a notification about available documents
      console.log("Found saved documents:", savedDocs)
    }
  }, [getAvailableDocuments])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const simulateUploadProgress = (file: File) => {
    setUploadStatus("uploading")
    setFileSize(file.size)
    setUploadProgress(0)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        clearInterval(interval)
        progress = 100
        setUploadProgress(100)
        setUploadStatus("processing")

        // After "processing", mark as complete
        setTimeout(() => {
          setUploadStatus("complete")
        }, 1500)
      } else {
        setUploadProgress(Math.min(progress, 99))
      }
    }, 300)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        simulateUploadProgress(file)

        await loadPdf(file)
        setFileName(file.name.replace(/\.pdf$/i, ""))
        setDocumentModified(false)

        toast.success("PDF Loaded Successfully", {
          description: `${file.name} has been loaded. Switch to "Edit Content" tab to edit the extracted text.`,
          duration: 5000,
        })

        // Automatically switch to the edit content tab
        setActiveTab("content")
      } catch (error) {
        setUploadStatus("error")
        setUploadError("Failed to load PDF. Please try again.")

        toast.error("Error", {
          description: "Failed to load PDF. Please try again.",
        })
      }
    }
  }

  const handleSaveDocument = async () => {
    if (!currentDocument) {
      toast.error("No document to save", {
        description: "Please upload a PDF document first.",
      })
      return
    }

    setIsSaving(true)
    try {
      // Save to localStorage
      await saveToLocalStorage()
      setDocumentModified(false)
      toast.success("Document saved", {
        description: "All changes have been saved successfully.",
      })
    } catch (error) {
      toast.error("Error saving document", {
        description: "There was a problem saving your document.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadDocument = async () => {
    if (!currentDocument) {
      toast.error("No document to download", {
        description: "Please upload a PDF document first.",
      })
      return
    }

    setIsDownloading(true)
    try {
      await downloadPdf()
      toast.success("Download complete", {
        description: "Your document has been downloaded successfully.",
      })
    } catch (error) {
      toast.error("Download failed", {
        description: "There was a problem downloading your document.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGoHome = () => {
    if (documentModified) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        window.location.href = "/"
      }
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white dark:bg-gray-950">
      {/* Breadcrumb and controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 mr-1"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleGoHome}
            >
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium truncate max-w-[150px] sm:max-w-[300px]">
              {fileName || "Untitled document"}
              {documentModified && "*"}
            </span>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
              onClick={undoAction}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
              onClick={redoAction}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />
            <Button
              variant="outline"
              size="sm"
              className={`h-8 ${showEditableElements ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300" : ""}`}
              onClick={() => setShowEditableElements(!showEditableElements)}
            >
              {showEditableElements ? "Hide" : "Show"} Elements
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />
            <Select value={zoom.toString()} onValueChange={(value) => setZoom(Number.parseInt(value))}>
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue placeholder="Zoom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="125">125%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleSaveDocument}
              disabled={isSaving || !documentModified}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-3.5 w-3.5" />
                  Save
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleDownloadDocument}
              disabled={isDownloading || !currentDocument}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 transition-all shadow-sm hover:shadow"
              onClick={handleUploadClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
              <input
                type="file"
                id="file-upload"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                aria-label="Upload PDF file"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload progress indicator */}
      {uploadStatus && (
        <div className="max-w-7xl w-full mx-auto px-4 py-2">
          <UploadProgress
            fileName={currentDocument?.name || "document.pdf"}
            fileSize={fileSize}
            status={uploadStatus}
            progress={uploadProgress}
            error={uploadError}
          />
        </div>
      )}

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">
        {showSidebar && <PdfSidebar />}

        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <div className="border-b px-2 sm:px-4 bg-white dark:bg-gray-950 dark:border-gray-800 overflow-x-auto">
              <TabsList className="h-10 bg-transparent flex-nowrap">
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Edit PDF
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Edit Content
                </TabsTrigger>
                <TabsTrigger
                  value="forms"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Forms
                </TabsTrigger>
                <TabsTrigger
                  value="merge"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Merge
                </TabsTrigger>
                <TabsTrigger
                  value="ocr"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  OCR
                </TabsTrigger>
                <TabsTrigger
                  value="annotate"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Annotate
                </TabsTrigger>
                <TabsTrigger
                  value="sign"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Sign
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 whitespace-nowrap transition-all"
                >
                  Images
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="edit" className="flex flex-1 overflow-hidden data-[state=active]:flex-1">
              <PdfViewer showEditableElements={showEditableElements} />
              <PdfToolbar activeTab={activeEditTab} setActiveTab={setActiveEditTab} />
            </TabsContent>

            <TabsContent value="content" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <EditPdfContent onDocumentModified={() => setDocumentModified(true)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forms" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <FormFieldCreator />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="merge" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <PdfMergeSplit />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ocr" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <OcrProcessor />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="annotate" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <AnnotationTools />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sign" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <ESignatureTools />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="data-[state=active]:flex-1">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                <PdfViewer showEditableElements={showEditableElements} />
                <div className="border-l p-4 overflow-y-auto dark:border-gray-800">
                  <ImageManipulation />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        fileName={fileName}
        setFileName={setFileName}
      />
    </div>
  )
}
