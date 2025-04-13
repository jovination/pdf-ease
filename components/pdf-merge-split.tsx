"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Loader2, Trash2, Upload } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function PdfMergeSplit() {
  const { mergePdfs, splitPdf, totalPages } = usePdfContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("merge")
  const [mergeFiles, setMergeFiles] = useState<File[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [isSplitting, setIsSplitting] = useState(false)
  const [splitRanges, setSplitRanges] = useState<{ start: number; end: number }[]>([{ start: 1, end: totalPages }])
  const mergeFileInputRef = useRef<HTMLInputElement>(null)

  const handleMergeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setMergeFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (mergeFiles.length < 2) {
      toast({
        title: "Not Enough Files",
        description: "You need at least 2 PDF files to merge",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMerging(true)
      await mergePdfs(mergeFiles)
      toast({
        title: "PDFs Merged",
        description: `Successfully merged ${mergeFiles.length} PDF files`,
      })
      setMergeFiles([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDF files",
        variant: "destructive",
      })
    } finally {
      setIsMerging(false)
    }
  }

  const addSplitRange = () => {
    setSplitRanges((prev) => [...prev, { start: 1, end: totalPages }])
  }

  const removeSplitRange = (index: number) => {
    setSplitRanges((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSplitRange = (index: number, field: "start" | "end", value: number) => {
    setSplitRanges((prev) =>
      prev.map((range, i) => (i === index ? { ...range, [field]: Math.min(Math.max(1, value), totalPages) } : range)),
    )
  }

  const handleSplit = async () => {
    if (splitRanges.length === 0) {
      toast({
        title: "No Ranges Specified",
        description: "Please specify at least one page range to split",
        variant: "destructive",
      })
      return
    }

    // Validate ranges
    const invalidRanges = splitRanges.filter(
      (range) => range.start > range.end || range.start < 1 || range.end > totalPages,
    )
    if (invalidRanges.length > 0) {
      toast({
        title: "Invalid Ranges",
        description: "Please ensure all page ranges are valid",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSplitting(true)
      await splitPdf(splitRanges)
      toast({
        title: "PDF Split",
        description: `Successfully split PDF into ${splitRanges.length} parts`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to split PDF",
        variant: "destructive",
      })
    } finally {
      setIsSplitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Merge & Split PDFs</CardTitle>
        <CardDescription>Combine multiple PDFs or split a single PDF using Mozilla's PDF.js</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Split PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="merge" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="merge-files">Select PDF Files to Merge</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={mergeFileInputRef}
                  id="merge-files"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleMergeFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="w-full" onClick={() => mergeFileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Select PDF Files
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <ScrollArea className="h-[200px] w-full">
                {mergeFiles.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <p className="text-center text-sm text-muted-foreground">
                      No files selected. Click "Select PDF Files" to add PDFs for merging.
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {mergeFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-md border p-2 mb-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {mergeFiles.length} file{mergeFiles.length !== 1 ? "s" : ""} selected
              </div>
              <Button onClick={handleMerge} disabled={mergeFiles.length < 2 || isMerging}>
                {isMerging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Merging...
                  </>
                ) : (
                  "Merge PDFs"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="split" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Page Ranges to Extract</Label>
                <Button variant="outline" size="sm" onClick={addSplitRange}>
                  Add Range
                </Button>
              </div>

              <div className="space-y-2">
                {splitRanges.map((range, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                    <Badge variant="outline" className="h-6 w-6 rounded-full p-0 text-center">
                      {index + 1}
                    </Badge>
                    <div className="flex flex-1 items-center gap-2">
                      <Label className="text-xs">From</Label>
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={range.start}
                        onChange={(e) => updateSplitRange(index, "start", Number.parseInt(e.target.value) || 1)}
                        className="h-8"
                      />
                      <Label className="text-xs">To</Label>
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={range.end}
                        onChange={(e) => updateSplitRange(index, "end", Number.parseInt(e.target.value) || 1)}
                        className="h-8"
                      />
                    </div>
                    {splitRanges.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeSplitRange(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Current Document</p>
                  <p className="text-xs text-muted-foreground">
                    {totalPages} page{totalPages !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleSplit} disabled={splitRanges.length === 0 || isSplitting} className="w-full">
              {isSplitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Splitting...
                </>
              ) : (
                "Split PDF"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by Mozilla's PDF.js - Free and open-source
      </CardFooter>
    </Card>
  )
}
