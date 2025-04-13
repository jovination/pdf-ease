"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { usePdfContext } from "@/context/pdf-context"
import { useCollaborationContext } from "@/context/collaboration-context"
import { FileText, Loader2, ZoomIn, ZoomOut, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { toast } from "sonner"

export function PdfViewer({ showEditableElements = false }: { showEditableElements?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const renderTaskRef = useRef<any>(null) // Track current render task
  
  const {
    pdfDocument,
    currentPage,
    isLoading,
    zoom,
    setZoom,
    annotations,
    formFields,
    signatures,
    elements,
    totalPages,
  } = usePdfContext()
  const { activeUsers } = useCollaborationContext()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 })
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [renderError, setRenderError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRendering, setIsRendering] = useState(false)

  const drawOverlayElements = async (
    ctx: CanvasRenderingContext2D,
    pageNumber: number,
    viewport: any
  ) => {
    // Draw annotations
    annotations
      .filter((a) => a.pageNumber === pageNumber)
      .forEach((annotation) => {
        ctx.save()
        // Transform coordinates from PDF space to canvas space
        const [x, y] = viewport.convertToViewportPoint(annotation.x, annotation.y)
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'
        ctx.fillRect(x, y, annotation.width * viewport.scale, annotation.height * viewport.scale)
        ctx.restore()
      })

    // Draw form fields and signatures similarly
    // Add more overlay drawing logic as needed
  }

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return

    let isCurrentRender = true // Track if this render is still valid
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const renderPage = async () => {
      try {
        setRenderError(null)
        setIsRendering(true)

        // Cancel any existing render task
        if (renderTaskRef.current) {
          await renderTaskRef.current.cancel()
          renderTaskRef.current = null
        }

        // Get the page
        const page = await pdfDocument.getPage(currentPage)
        const scale = zoom / 100
        const viewport = page.getViewport({ scale })

        // Update canvas size
        canvas.width = viewport.width
        canvas.height = viewport.height

        // Clear canvas
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Only proceed if this is still the current render
        if (!isCurrentRender) return

        // Create new render task
        const renderTask = page.render({
          canvasContext: ctx,
          viewport,
          renderInteractiveForms: true,
        })

        renderTaskRef.current = renderTask

        // Wait for render to complete
        await renderTask.promise

        // Only draw overlays if still current
        if (isCurrentRender && renderTaskRef.current === renderTask) {
          await drawOverlayElements(ctx, currentPage, viewport)
        }

      } catch (error: any) {
        if (error?.name !== 'RenderingCancelledException' && isCurrentRender) {
          console.error('PDF rendering error:', error)
          setRenderError('Failed to render PDF page')
        }
      } finally {
        if (isCurrentRender) {
          renderTaskRef.current = null
          setIsRendering(false)
        }
      }
    }

    renderPage()

    // Cleanup
    return () => {
      isCurrentRender = false
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }
    }
  }, [pdfDocument, currentPage, zoom, showEditableElements])

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })

      // Check if clicked on an element
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)

        // Find if we clicked on an element
        const clickedElement = elements
          .filter((el) => el.pageNumber === currentPage)
          .find((el) => {
            return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
          })

        if (clickedElement) {
          setSelectedElement(clickedElement.id)
        } else {
          setSelectedElement(null)
        }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setViewPosition({
        x: viewPosition.x + dx,
        y: viewPosition.y + dy,
      })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 300))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        toast.error("Fullscreen failed", {
          description: `Error attempting to enable fullscreen: ${err.message}`,
        })
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleShareDocument = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Shared PDF Document",
          text: "Check out this PDF document I'm working on",
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully"))
        .catch((error) => toast.error("Error sharing", { description: error.message }))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"))
    }
  }

  return (
    <div
      className="relative flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900"
      ref={containerRef}
      aria-label="PDF Viewer"
      role="region"
    >
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md bg-white p-1 shadow-md dark:bg-gray-800 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{zoom}%</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
              <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
              <path d="M3 16h3a2 2 0 0 1-2 2v3"></path>
              <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
          onClick={handleShareDocument}
          aria-label="Share document"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {activeUsers.length > 0 && (
        <div className="absolute left-4 top-4 flex -space-x-2 z-10">
          {activeUsers.map((user, index) => (
            <Tooltip key={user.id} content={user.name}>
              <Avatar className={cn("h-8 w-8 border-2 border-white shadow-sm", index === 0 && "z-10")}>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback style={{ backgroundColor: user.color }}>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}
          <Badge variant="secondary" className="ml-2 rounded-full shadow-sm">
            {activeUsers.length} active
          </Badge>
        </div>
      )}

      <div className="absolute left-4 bottom-4 z-10 text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
        Page {currentPage} of {totalPages}
      </div>

      <div
        className="flex h-full w-full items-center justify-center p-8"
        style={{
          transform: `translate(${viewPosition.x}px, ${viewPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading ? (
          <div className="flex items-center justify-center rounded-md bg-white p-8 shadow-md dark:bg-gray-800">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-purple-600" />
            <span>Loading PDF...</span>
          </div>
        ) : !pdfDocument ? (
          <div className="flex flex-col items-center justify-center rounded-md bg-white p-8 shadow-md dark:bg-gray-800">
            <FileText className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="text-lg font-medium">No PDF Loaded</h3>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Upload a PDF document to get started with editing
            </p>
          </div>
        ) : renderError ? (
          <div className="flex flex-col items-center justify-center rounded-md bg-white p-8 shadow-md dark:bg-gray-800">
            <div className="text-red-500 mb-2">Error: {renderError}</div>
            <p className="text-sm text-gray-500">Please try uploading the document again.</p>
          </div>
        ) : (
          <div
            className="relative rounded-md bg-white shadow-lg dark:bg-gray-800 transition-all hover:shadow-xl"
            aria-label={`PDF page ${currentPage} of ${totalPages}`}
          >
            {isRendering && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            )}
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}

const Separator = ({ orientation, className }: { orientation: "horizontal" | "vertical"; className?: string }) => {
  return (
    <div className={cn("bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)} />
  )
}