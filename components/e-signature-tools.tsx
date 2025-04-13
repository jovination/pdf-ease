"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { Download, Eraser, Pencil, Upload } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ESignatureTools() {
  const { currentPage, addSignature, signatures } = usePdfContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("draw")
  const [signatureColor, setSignatureColor] = useState("#000000")
  const [signatureWidth, setSignatureWidth] = useState(2)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentPageSignatures = signatures.filter((sig) => sig.pageNumber === currentPage)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing style
    ctx.strokeStyle = signatureColor
    ctx.lineWidth = signatureWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [signatureColor, signatureWidth])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)

    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    // Save the signature as an image
    setSignatureImage(canvas.toDataURL("image/png"))
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setSignatureImage(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedSignature(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddSignature = () => {
    const signatureToAdd = activeTab === "draw" ? signatureImage : uploadedSignature

    if (!signatureToAdd) {
      toast({
        title: "No Signature",
        description: activeTab === "draw" ? "Please draw a signature first" : "Please upload a signature image first",
        variant: "destructive",
      })
      return
    }

    addSignature({
      pageNumber: currentPage,
      x: 100,
      y: 300,
      width: 200,
      height: 100,
      dataUrl: signatureToAdd,
      author: "Current User",
      date: new Date(),
    })

    toast({
      title: "Signature Added",
      description: "Your signature has been added to the document",
    })
  }

  const downloadSignature = () => {
    const signatureToDownload = activeTab === "draw" ? signatureImage : uploadedSignature

    if (!signatureToDownload) {
      toast({
        title: "No Signature",
        description: "Please create or upload a signature first",
        variant: "destructive",
      })
      return
    }

    const a = document.createElement("a")
    a.href = signatureToDownload
    a.download = "signature.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "Signature Downloaded",
      description: "Your signature has been downloaded as PNG",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">E-Signature Tools</CardTitle>
        <CardDescription>Create and apply electronic signatures using signature_pad</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw Signature</TabsTrigger>
            <TabsTrigger value="upload">Upload Signature</TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Pen Width</Label>
                <span className="text-sm">{signatureWidth}px</span>
              </div>
              <Slider
                value={[signatureWidth]}
                min={1}
                max={5}
                step={0.5}
                onValueChange={(value) => setSignatureWidth(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Pen Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {["#000000", "#0000FF", "#FF0000", "#008000", "#800080"].map((color) => (
                  <div
                    key={color}
                    className={`h-8 cursor-pointer rounded-md border ${signatureColor === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSignatureColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-md border bg-white p-2">
              <canvas
                ref={canvasRef}
                width={450}
                height={150}
                className="w-full cursor-crosshair border border-dashed border-gray-300"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={clearCanvas}>
                <Eraser className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button variant="outline" onClick={downloadSignature} disabled={!signatureImage}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="signature-file">Upload Signature Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="signature-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PNG, JPEG, GIF (transparent background recommended)
              </p>
            </div>

            {uploadedSignature && (
              <div className="rounded-md border bg-white p-4">
                <div className="flex items-center justify-center">
                  <img
                    src={uploadedSignature || "/placeholder.svg"}
                    alt="Uploaded Signature"
                    className="max-h-[150px] max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {uploadedSignature && (
              <Button variant="outline" onClick={downloadSignature}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleAddSignature}
          disabled={activeTab === "draw" ? !signatureImage : !uploadedSignature}
          className="mt-4 w-full"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Add Signature to Document
        </Button>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Signatures on Page {currentPage}</h3>
            <span className="text-xs text-muted-foreground">
              {currentPageSignatures.length} signature{currentPageSignatures.length !== 1 ? "s" : ""}
            </span>
          </div>

          <ScrollArea className="h-[150px] mt-2 rounded-md border">
            {currentPageSignatures.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-sm text-muted-foreground">
                  No signatures on this page. Create and add a signature above.
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {currentPageSignatures.map((sig) => (
                  <div key={sig.id} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      {sig.dataUrl && (
                        <img
                          src={sig.dataUrl || "/placeholder.svg"}
                          alt="Signature"
                          className="h-10 w-20 object-contain"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium">{sig.author || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {sig.date ? new Date(sig.date).toLocaleDateString() : "Unknown date"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by signature_pad - Free JavaScript library
      </CardFooter>
    </Card>
  )
}
