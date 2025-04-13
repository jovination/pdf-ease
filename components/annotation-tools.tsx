"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Pencil, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AnnotationTools() {
  const { currentPage, annotations, addAnnotation, removeAnnotation } = usePdfContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("highlight")
  const [highlightColor, setHighlightColor] = useState("#FFEB3B")
  const [noteText, setNoteText] = useState("")
  const [noteColor, setNoteColor] = useState("#4CAF50")
  const [drawingColor, setDrawingColor] = useState("#2196F3")
  const [drawingWidth, setDrawingWidth] = useState(3)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [annotationToDelete, setAnnotationToDelete] = useState<string | null>(null)

  const currentPageAnnotations = annotations.filter((anno) => anno.pageNumber === currentPage)

  const handleAddHighlight = () => {
    addAnnotation({
      pageNumber: currentPage,
      type: "highlight",
      x: 100,
      y: 100,
      width: 300,
      height: 30,
      color: highlightColor,
    })

    toast({
      title: "Highlight Added",
      description: "Highlight annotation has been added to the document",
    })
  }

  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter some text for your note",
        variant: "destructive",
      })
      return
    }

    addAnnotation({
      pageNumber: currentPage,
      type: "note",
      x: 150,
      y: 150,
      width: 200,
      height: 100,
      color: noteColor,
      text: noteText,
    })

    toast({
      title: "Note Added",
      description: "Note annotation has been added to the document",
    })
    setNoteText("")
  }

  const handleAddDrawing = () => {
    addAnnotation({
      pageNumber: currentPage,
      type: "drawing",
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      color: drawingColor,
    })

    toast({
      title: "Drawing Added",
      description: "Drawing annotation has been added to the document",
    })
  }

  const handleDeleteClick = (id: string) => {
    setAnnotationToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (annotationToDelete) {
      removeAnnotation(annotationToDelete)
      toast({
        title: "Annotation Deleted",
        description: "The annotation has been removed from the document",
      })
    }
    setIsDeleteDialogOpen(false)
    setAnnotationToDelete(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Annotation Tools</CardTitle>
        <CardDescription>Add highlights, notes, and drawings using pdf-annotate.js</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="highlight">Highlight</TabsTrigger>
            <TabsTrigger value="note">Note</TabsTrigger>
            <TabsTrigger value="drawing">Drawing</TabsTrigger>
          </TabsList>

          <TabsContent value="highlight" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Highlight Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2">
                    <div className="h-5 w-5 rounded" style={{ backgroundColor: highlightColor }}></div>
                    <span className="text-sm">{highlightColor}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <HexColorPicker color={highlightColor} onChange={setHighlightColor} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <p className="text-sm">
                Click the button below to add a highlight to the current page. In a real implementation, you would click
                and drag on the document to create a highlight.
              </p>
            </div>

            <Button onClick={handleAddHighlight} className="w-full">
              Add Highlight
            </Button>
          </TabsContent>

          <TabsContent value="note" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="note-text">Note Text</Label>
              <Textarea
                id="note-text"
                placeholder="Enter your note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Note Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2">
                    <div className="h-5 w-5 rounded" style={{ backgroundColor: noteColor }}></div>
                    <span className="text-sm">{noteColor}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <HexColorPicker color={noteColor} onChange={setNoteColor} />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleAddNote} className="w-full">
              Add Note
            </Button>
          </TabsContent>

          <TabsContent value="drawing" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Drawing Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2">
                    <div className="h-5 w-5 rounded" style={{ backgroundColor: drawingColor }}></div>
                    <span className="text-sm">{drawingColor}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <HexColorPicker color={drawingColor} onChange={setDrawingColor} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Line Width</Label>
                <span className="text-sm">{drawingWidth}px</span>
              </div>
              <Slider
                value={[drawingWidth]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setDrawingWidth(value[0])}
              />
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <p className="text-sm">
                Click the button below to add a drawing to the current page. In a real implementation, you would draw
                directly on the document.
              </p>
            </div>

            <Button onClick={handleAddDrawing} className="w-full">
              Add Drawing
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Annotations on Page {currentPage}</h3>
            <span className="text-xs text-muted-foreground">
              {currentPageAnnotations.length} annotation{currentPageAnnotations.length !== 1 ? "s" : ""}
            </span>
          </div>

          <ScrollArea className="h-[200px] mt-2 rounded-md border">
            {currentPageAnnotations.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-sm text-muted-foreground">
                  No annotations on this page. Use the tools above to add annotations.
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {currentPageAnnotations.map((anno) => (
                  <div key={anno.id} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      {anno.type === "highlight" && (
                        <div className="h-5 w-5 rounded" style={{ backgroundColor: anno.color }} />
                      )}
                      {anno.type === "note" && <MessageSquare className="h-5 w-5" style={{ color: anno.color }} />}
                      {anno.type === "drawing" && <Pencil className="h-5 w-5" style={{ color: anno.color }} />}
                      <div>
                        <p className="text-sm font-medium capitalize">{anno.type}</p>
                        {anno.text && <p className="text-xs text-muted-foreground line-clamp-1">{anno.text}</p>}
                      </div>
                    </div>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteClick(anno.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Annotation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this annotation? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by pdf-annotate.js - Free annotation library
      </CardFooter>
    </Card>
  )
}
