"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { Copy, FileText, Loader2, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function OcrProcessor() {
  const { currentPage, totalPages, currentDocument } = usePdfContext()
  const { toast } = useToast()
  const [pageNumber, setPageNumber] = useState<string>(currentPage.toString())
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [language, setLanguage] = useState("eng")

  const processOcr = async () => {
    if (!currentDocument) {
      toast({
        title: "No Document",
        description: "Please load a PDF document first",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      setError("")
      setProgress(0)

      // Simulate OCR processing with progress updates
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 5
        })
      }, 200)

      // In a real implementation, we would use Tesseract.js to extract text
      // const worker = createWorker({
      //   logger: m => setProgress(m.progress * 100)
      // });
      // await worker.load();
      // await worker.loadLanguage(language);
      // await worker.initialize(language);
      // const { data: { text } } = await worker.recognize(imageData);
      // await worker.terminate();

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock OCR result
      const mockText =
        "This is sample text extracted from the PDF using OCR technology.\n\n" +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.\n\n" +
        "The actual implementation would use Tesseract.js to extract real text from the document."

      setResult(mockText)
      clearInterval(timer)
      setProgress(100)

      toast({
        title: "OCR Complete",
        description: "Text extraction completed successfully",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "OCR Failed",
        description: "Failed to extract text from the document",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">OCR Text Extraction</CardTitle>
        <CardDescription>Extract editable text from scanned documents using Tesseract.js</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Current Document</p>
              <p className="text-xs text-muted-foreground">
                {currentDocument ? currentDocument.name : "No document loaded"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="page-number">Page Number</Label>
            <Select value={pageNumber} onValueChange={setPageNumber}>
              <SelectTrigger id="page-number">
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Page {i + 1}
                  </SelectItem>
                ))}
                <SelectItem value="all">All Pages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng">English</SelectItem>
                <SelectItem value="fra">French</SelectItem>
                <SelectItem value="deu">German</SelectItem>
                <SelectItem value="spa">Spanish</SelectItem>
                <SelectItem value="ita">Italian</SelectItem>
                <SelectItem value="jpn">Japanese</SelectItem>
                <SelectItem value="kor">Korean</SelectItem>
                <SelectItem value="chi_sim">Chinese (Simplified)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={processOcr} disabled={!currentDocument || isProcessing} className="w-full">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Extract Text
            </>
          )}
        </Button>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Processing</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ocr-result">Extracted Text</Label>
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={copyToClipboard}>
                <Copy className="h-3 w-3" />
                <span className="text-xs">Copy</span>
              </Button>
            </div>
            <Textarea
              id="ocr-result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by Tesseract.js - Free open-source OCR engine
      </CardFooter>
    </Card>
  )
}
