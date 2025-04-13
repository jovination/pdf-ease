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
import { ImageIcon, Loader2, RotateCw, Upload } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ImageManipulation() {
  const { currentPage } = usePdfContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("add")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageWidth, setImageWidth] = useState(300)
  const [imageHeight, setImageHeight] = useState(200)
  const [imageRotation, setImageRotation] = useState(0)
  const [imageFilter, setImageFilter] = useState("none")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string)

        // Reset transformations
        setImageWidth(300)
        setImageHeight(200)
        setImageRotation(0)
        setImageFilter("none")

        // Apply image to canvas
        setTimeout(() => {
          applyImageToCanvas(event.target?.result as string)
        }, 100)
      }
    }
    reader.readAsDataURL(file)
  }

  const applyImageToCanvas = (src: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas dimensions
      canvas.width = imageWidth
      canvas.height = imageHeight

      // Apply rotation
      if (imageRotation !== 0) {
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((imageRotation * Math.PI) / 180)
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
        ctx.restore()
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }

      // Apply filters
      if (imageFilter !== "none") {
        if (imageFilter === "grayscale") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            data[i] = avg
            data[i + 1] = avg
            data[i + 2] = avg
          }
          ctx.putImageData(imageData, 0, 0)
        } else if (imageFilter === "sepia") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
            data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
            data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
          }
          ctx.putImageData(imageData, 0, 0)
        } else if (imageFilter === "invert") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]
            data[i + 1] = 255 - data[i + 1]
            data[i + 2] = 255 - data[i + 2]
          }
          ctx.putImageData(imageData, 0, 0)
        }
      }
    }
    img.src = src
  }

  const handleAddImage = () => {
    if (!selectedImage) {
      toast({
        title: "No Image",
        description: "Please select an image first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // In a real implementation, we would add the image to the PDF
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Image Added",
        description: "The image has been added to the document",
      })
    }, 1000)
  }

  const handleResetTransformations = () => {
    setImageWidth(300)
    setImageHeight(200)
    setImageRotation(0)
    setImageFilter("none")

    if (selectedImage) {
      applyImageToCanvas(selectedImage)
    }
  }

  // Apply transformations when they change
  const applyTransformations = () => {
    if (selectedImage) {
      applyImageToCanvas(selectedImage)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Image Manipulation</CardTitle>
        <CardDescription>Add and edit images using the browser's Canvas API</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Image</TabsTrigger>
            <TabsTrigger value="edit">Edit Image</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="image-file">Select Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Images
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Supported formats: PNG, JPEG, GIF, WebP</p>
            </div>

            {selectedImage ? (
              <div className="rounded-md border bg-white p-4">
                <div className="flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={imageWidth}
                    height={imageHeight}
                    className="max-h-[300px] max-w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4">
                <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  No image selected. Click "Browse Images" to select an image.
                </p>
              </div>
            )}

            <Button onClick={handleAddImage} disabled={!selectedImage || isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Image to Document"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 pt-4">
            {!selectedImage ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4">
                <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  No image selected. Go to the "Add Image" tab to select an image first.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width (px)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={imageWidth}
                        onChange={(e) => {
                          setImageWidth(Number.parseInt(e.target.value) || 100)
                          setTimeout(applyTransformations, 100)
                        }}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={imageHeight}
                        onChange={(e) => {
                          setImageHeight(Number.parseInt(e.target.value) || 100)
                          setTimeout(applyTransformations, 100)
                        }}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Rotation</Label>
                    <span className="text-sm">{imageRotation}°</span>
                  </div>
                  <Slider
                    value={[imageRotation]}
                    min={0}
                    max={360}
                    step={5}
                    onValueChange={(value) => {
                      setImageRotation(value[0])
                      setTimeout(applyTransformations, 100)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Filter</Label>
                  <Select
                    value={imageFilter}
                    onValueChange={(value) => {
                      setImageFilter(value)
                      setTimeout(applyTransformations, 100)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="grayscale">Grayscale</SelectItem>
                      <SelectItem value="sepia">Sepia</SelectItem>
                      <SelectItem value="invert">Invert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={handleResetTransformations}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Reset Transformations
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Powered by browser-native Canvas API</CardFooter>
    </Card>
  )
}
