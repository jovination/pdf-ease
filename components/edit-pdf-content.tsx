"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePdfContext } from "@/context/pdf-context"
import { toast } from "sonner"
import { Edit, Save, Trash, Type, ImageIcon, Plus, Loader2, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PdfElement {
  id: string
  type: "text" | "image"
  content: string
  x: number
  y: number
  width: number
  height: number
  fontSize?: number
  fontFamily?: string
  color?: string
  rotation?: number
  opacity?: number
  pageNumber: number
}

interface EditPdfContentProps {
  onDocumentModified?: () => void
}

const EditPdfContent = ({ onDocumentModified }: EditPdfContentProps) => {
  const { currentPage, addElement, updateElement, removeElement, elements, currentDocument } = usePdfContext()
  const [isEditing, setIsEditing] = useState(false)
  const [editingElement, setEditingElement] = useState<PdfElement | null>(null)
  const [isAddingElement, setIsAddingElement] = useState(false)
  const [newElementType, setNewElementType] = useState<"text" | "image">("text")
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter elements by current page and search query
  const currentPageElements = elements
    .filter((el) => el.pageNumber === currentPage)
    .filter((el) => (el.type === "text" ? el.content.toLowerCase().includes(searchQuery.toLowerCase()) : true))

  // Add this at the beginning of the component, after the currentPageElements definition
  useEffect(() => {
    if (currentDocument && currentPageElements.length > 0) {
      toast.success("Content Ready to Edit", {
        description: "Text content has been extracted from your PDF. Click on any text element to edit it.",
        duration: 4000,
      })
    }
  }, [currentDocument, currentPageElements.length])

  const handleEditElement = (element: PdfElement) => {
    setEditingElement(element)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!editingElement) return

    setIsSaving(true)

    setTimeout(() => {
      updateElement(editingElement.id, editingElement)
      setIsEditing(false)
      setEditingElement(null)
      setIsSaving(false)

      if (onDocumentModified) {
        onDocumentModified()
      }

      toast.success("Element Updated", {
        description: "The element has been updated successfully",
      })
    }, 500)
  }

  const handleDeleteElement = (id: string) => {
    removeElement(id)

    if (onDocumentModified) {
      onDocumentModified()
    }

    toast.success("Element Deleted", {
      description: "The element has been removed from the document",
    })
  }

  const handleAddElement = () => {
    if (newElementType === "text") {
      const newElement: Omit<PdfElement, "id"> = {
        type: "text",
        content: "New text element",
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        fontSize: 16,
        fontFamily: "Arial",
        color: "#000000",
        rotation: 0,
        opacity: 1,
        pageNumber: currentPage,
      }

      addElement(newElement)

      if (onDocumentModified) {
        onDocumentModified()
      }

      toast.success("Text Added", {
        description: "A new text element has been added to the document",
      })
    } else if (newElementType === "image") {
      fileInputRef.current?.click()
    }

    setIsAddingElement(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const newElement: Omit<PdfElement, "id"> = {
          type: "image",
          content: event.target.result as string,
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          rotation: 0,
          opacity: 1,
          pageNumber: currentPage,
        }

        addElement(newElement)

        if (onDocumentModified) {
          onDocumentModified()
        }

        toast.success("Image Added", {
          description: "A new image has been added to the document",
        })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Edit PDF Content</CardTitle>
        <CardDescription>Add, edit, or remove text and images in your PDF document</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search text content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isAddingElement} onOpenChange={setIsAddingElement}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Element
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Element</DialogTitle>
                <DialogDescription>Choose the type of element you want to add to your PDF.</DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue="text"
                className="w-full mt-4"
                onValueChange={(value) => setNewElementType(value as "text" | "image")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Text will be added to the current page</Label>
                    <p className="text-sm text-muted-foreground">
                      You can edit the text content, style, and position after adding it.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="image" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Image will be added to the current page</Label>
                    <p className="text-sm text-muted-foreground">
                      You can adjust the image size, position, and opacity after adding it.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddingElement(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddElement}>Add Element</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            aria-label="Upload image"
          />
        </div>

        <div className="rounded-md border dark:border-gray-800">
          <ScrollArea className="h-[400px]">
            {currentPageElements.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center p-4">
                <div className="rounded-full bg-muted p-3">
                  <Edit className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No Elements</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {searchQuery
                    ? "No matching elements found. Try a different search term."
                    : "Add text or images to the current page to edit them."}
                </p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-800">
                {currentPageElements.map((element) => (
                  <div key={element.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      {element.type === "text" ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          <Type className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div className="max-w-[200px] sm:max-w-[300px]">
                        <p className="font-medium capitalize">{element.type}</p>
                        {element.type === "text" && (
                          <p className="text-sm text-muted-foreground truncate">{element.content}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isEditing && editingElement?.id === element.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setIsEditing(false)
                            setEditingElement(null)
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditElement(element)}
                            aria-label={`Edit ${element.type}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit {element.type === "text" ? "Text" : "Image"}</DialogTitle>
                            <DialogDescription>
                              Make changes to the {element.type} element on page {currentPage}.
                            </DialogDescription>
                          </DialogHeader>

                          {editingElement && (
                            <div className="grid gap-4 py-4">
                              {editingElement.type === "text" && (
                                <>
                                  <div className="grid gap-2">
                                    <Label htmlFor="content">Text Content</Label>
                                    <Textarea
                                      id="content"
                                      value={editingElement.content}
                                      onChange={(e) =>
                                        setEditingElement({ ...editingElement, content: e.target.value })
                                      }
                                      rows={4}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="font-family">Font Family</Label>
                                      <Select
                                        value={editingElement.fontFamily}
                                        onValueChange={(value) =>
                                          setEditingElement({ ...editingElement, fontFamily: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Arial">Arial</SelectItem>
                                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                          <SelectItem value="Courier New">Courier New</SelectItem>
                                          <SelectItem value="Georgia">Georgia</SelectItem>
                                          <SelectItem value="Verdana">Verdana</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="font-size">Font Size</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          id="font-size"
                                          type="number"
                                          value={editingElement.fontSize}
                                          onChange={(e) =>
                                            setEditingElement({
                                              ...editingElement,
                                              fontSize: Number(e.target.value),
                                            })
                                          }
                                        />
                                        <span className="text-sm">px</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="color">Text Color</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        id="color"
                                        type="color"
                                        value={editingElement.color}
                                        onChange={(e) =>
                                          setEditingElement({ ...editingElement, color: e.target.value })
                                        }
                                        className="h-10 w-10 p-1"
                                      />
                                      <Input
                                        value={editingElement.color}
                                        onChange={(e) =>
                                          setEditingElement({ ...editingElement, color: e.target.value })
                                        }
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Position X</Label>
                                  <Input
                                    type="number"
                                    value={editingElement.x}
                                    onChange={(e) =>
                                      setEditingElement({
                                        ...editingElement,
                                        x: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Position Y</Label>
                                  <Input
                                    type="number"
                                    value={editingElement.y}
                                    onChange={(e) =>
                                      setEditingElement({
                                        ...editingElement,
                                        y: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Width</Label>
                                  <Input
                                    type="number"
                                    value={editingElement.width}
                                    onChange={(e) =>
                                      setEditingElement({
                                        ...editingElement,
                                        width: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Height</Label>
                                  <Input
                                    type="number"
                                    value={editingElement.height}
                                    onChange={(e) =>
                                      setEditingElement({
                                        ...editingElement,
                                        height: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Rotation ({editingElement.rotation}°)</Label>
                                </div>
                                <Slider
                                  value={[editingElement.rotation || 0]}
                                  min={0}
                                  max={360}
                                  step={1}
                                  onValueChange={(value) =>
                                    setEditingElement({
                                      ...editingElement,
                                      rotation: value[0],
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Opacity ({Math.round((editingElement.opacity || 1) * 100)}%)</Label>
                                </div>
                                <Slider
                                  value={[editingElement.opacity ? editingElement.opacity * 100 : 100]}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onValueChange={(value) =>
                                    setEditingElement({
                                      ...editingElement,
                                      opacity: value[0] / 100,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false)
                                setEditingElement(null)
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} disabled={isSaving}>
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteElement(element.id)}
                        aria-label={`Delete ${element.type}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="px-0 pt-2">
        <p className="text-xs text-muted-foreground">Changes are applied directly to the PDF document</p>
      </CardFooter>
    </Card>
  )
}

export { EditPdfContent }
