"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { Cloud, Download, FileText, Loader2, Save, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

interface CloudFile {
  id: string
  name: string
  size: number
  lastModified: Date
  url: string
}

export function CloudStorage() {
  const { currentDocument, downloadPdf } = usePdfContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("save")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([
    {
      id: "file-1",
      name: "Contract_Draft.pdf",
      size: 2.4 * 1024 * 1024,
      lastModified: new Date(2023, 5, 15),
      url: "#",
    },
    {
      id: "file-2",
      name: "Invoice_2023.pdf",
      size: 1.2 * 1024 * 1024,
      lastModified: new Date(2023, 6, 22),
      url: "#",
    },
    {
      id: "file-3",
      name: "Report_Q2.pdf",
      size: 3.7 * 1024 * 1024,
      lastModified: new Date(2023, 7, 10),
      url: "#",
    },
  ])

  const handleSaveToCloud = async () => {
    if (!currentDocument) {
      toast({
        title: "No Document",
        description: "Please load a PDF document first",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload to Firebase with progress updates
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 5
        })
      }, 100)

      // Simulate upload time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add to mock cloud files
      const newFile: CloudFile = {
        id: `file-${Date.now()}`,
        name: currentDocument.name,
        size: currentDocument.size,
        lastModified: new Date(),
        url: "#",
      }

      setCloudFiles([newFile, ...cloudFiles])

      toast({
        title: "Saved to Cloud",
        description: "Your document has been saved to Firebase storage",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to save document to cloud storage",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleLoadFromCloud = (file: CloudFile) => {
    setIsLoading(true)

    // Simulate loading from Firebase
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Document Loaded",
        description: `${file.name} has been loaded from cloud storage`,
      })
    }, 1000)
  }

  const filteredFiles = cloudFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Cloud Storage</CardTitle>
        <CardDescription>Save and load documents using Firebase's free tier</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="save">Save to Cloud</TabsTrigger>
            <TabsTrigger value="load">Load from Cloud</TabsTrigger>
          </TabsList>

          <TabsContent value="save" className="space-y-4 pt-4">
            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Current Document</p>
                  <p className="text-xs text-muted-foreground">
                    {currentDocument ? (
                      <>
                        {currentDocument.name} ({(currentDocument.size / 1024 / 1024).toFixed(2)} MB)
                      </>
                    ) : (
                      "No document loaded"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Firebase Storage</p>
                  <p className="text-xs text-muted-foreground">Documents are stored securely in the cloud</p>
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Uploading</span>
                  <span>{uploadProgress.toFixed(0)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button onClick={handleSaveToCloud} disabled={!currentDocument || isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Cloud
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">Using Firebase's free tier (5GB storage)</div>
          </TabsContent>

          <TabsContent value="load" className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <ScrollArea className="h-[250px] w-full">
                {filteredFiles.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <p className="text-center text-sm text-muted-foreground">
                      {searchQuery ? "No matching documents found" : "No documents in cloud storage"}
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-md border p-2 mb-2 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleLoadFromCloud(file)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span>{file.lastModified.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadPdf()
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm">Loading document...</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by Firebase Storage - Free tier (5GB storage)
      </CardFooter>
    </Card>
  )
}
