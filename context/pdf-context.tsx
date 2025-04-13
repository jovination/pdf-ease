"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"

// Define PDFDocumentProxy type
type PDFDocumentProxy = any

// Initialize PDF.js dynamically
let pdfjsLib: any = null
const pdfWorkerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs"

// Function to initialize PDF.js
async function initPdfJs() {
  if (pdfjsLib) return pdfjsLib

  try {
    // Import PDF.js dynamically
    const pdfjs = await import("pdfjs-dist")

    // Set the worker source
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

    pdfjsLib = pdfjs
    return pdfjsLib
  } catch (error) {
    console.error("Error initializing PDF.js:", error)
    throw error
  }
}

interface Page {
  id: string
  pageNumber: number
  thumbnail?: string
  textContent?: string
}

interface Annotation {
  id: string
  pageNumber: number
  x: number
  y: number
  width: number
  height: number
  color?: string
  text?: string
  type: "highlight" | "note" | "drawing"
}

interface FormField {
  id: string
  pageNumber: number
  type: "text" | "checkbox" | "radio" | "dropdown"
  label: string
  x: number
  y: number
  width: number
  height: number
  required?: boolean
  options?: string[]
}

interface Signature {
  id: string
  pageNumber: number
  x: number
  y: number
  width: number
  height: number
  dataUrl?: string
  author?: string
  date?: Date
}

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

interface Action {
  type: "add" | "update" | "delete"
  target: "annotation" | "formField" | "signature" | "element" | "page"
  data: any
  id?: string
}

interface PdfContextType {
  currentDocument: File | null
  pdfDocument: PDFDocumentProxy | null
  currentPage: number
  totalPages: number
  pages: Page[]
  zoom: number
  isLoading: boolean
  annotations: Annotation[]
  formFields: FormField[]
  signatures: Signature[]
  elements: PdfElement[]
  canUndo: boolean
  canRedo: boolean
  documentId: string | null
  renderQuality: number
  setRenderQuality: (quality: number) => void
  setCurrentPage: (page: number) => void
  setZoom: (zoom: number) => void
  loadPdf: (file: File) => Promise<void>
  addAnnotation: (annotation: Omit<Annotation, "id">) => void
  removeAnnotation: (id: string) => void
  addFormField: (field: Omit<FormField, "id">) => void
  removeFormField: (id: string) => void
  addSignature: (signature: Omit<Signature, "id">) => void
  removeSignature: (id: string) => void
  addElement: (element: Omit<PdfElement, "id">) => void
  updateElement: (id: string, element: PdfElement) => void
  removeElement: (id: string) => void
  addBlankPage: () => void
  deletePage: (pageNumber: number) => void
  protectPdf: (password: string) => Promise<void>
  downloadPdf: () => Promise<void>
  mergePdfs: (files: File[]) => Promise<void>
  splitPdf: (pageRanges: { start: number; end: number }[]) => Promise<void[]>
  undoAction: () => void
  redoAction: () => void
  saveToLocalStorage: () => void
  loadFromLocalStorage: (id: string) => Promise<boolean>
  getAvailableDocuments: () => { id: string; name: string; lastModified: number }[]
}

const PdfContext = createContext<PdfContextType | undefined>(undefined)

export function PdfProvider({ children }: { children: ReactNode }) {
  const [currentDocument, setCurrentDocument] = useState<File | null>(null)
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const [pages, setPages] = useState<Page[]>([])
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [elements, setElements] = useState<PdfElement[]>([])
  const [actionHistory, setActionHistory] = useState<Action[]>([])
  const [currentActionIndex, setCurrentActionIndex] = useState(-1)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [renderQuality, setRenderQuality] = useState(2) // 1 = low, 2 = medium, 3 = high

  const canUndo = currentActionIndex >= 0
  const canRedo = actionHistory.length > 0 && currentActionIndex < actionHistory.length - 1

  // Auto-save to localStorage when document changes
  useEffect(() => {
    const autoSaveEnabled = JSON.parse(localStorage.getItem("pdfease-settings") || "{}")?.autoSave ?? true

    if (documentId && autoSaveEnabled && currentDocument && actionHistory.length > 0) {
      const debounceTimer = setTimeout(() => {
        saveToLocalStorage()
      }, 2000) // Debounce auto-save to avoid too frequent writes

      return () => clearTimeout(debounceTimer)
    }
  }, [actionHistory, documentId, currentDocument])

  const addToHistory = useCallback(
    (action: Action) => {
      setActionHistory((prev) => {
        // Remove any future actions if we're in the middle of the history
        const newHistory = prev.slice(0, currentActionIndex + 1)
        return [...newHistory, action]
      })
      setCurrentActionIndex((prev) => prev + 1)
    },
    [currentActionIndex],
  )

  const undoAction = useCallback(() => {
    if (!canUndo) return

    const action = actionHistory[currentActionIndex]

    switch (action.type) {
      case "add":
        if (action.target === "annotation") {
          setAnnotations((prev) => prev.filter((a) => a.id !== action.data.id))
        } else if (action.target === "formField") {
          setFormFields((prev) => prev.filter((f) => f.id !== action.data.id))
        } else if (action.target === "signature") {
          setSignatures((prev) => prev.filter((s) => s.id !== action.data.id))
        } else if (action.target === "element") {
          setElements((prev) => prev.filter((e) => e.id !== action.data.id))
        } else if (action.target === "page") {
          setPages((prev) => prev.filter((p) => p.id !== action.data.id))
          setTotalPages((prev) => prev - 1)
        }
        break
      case "update":
        if (action.target === "element") {
          setElements((prev) => prev.map((e) => (e.id === action.id ? action.data.previousState : e)))
        }
        break
      case "delete":
        if (action.target === "annotation") {
          setAnnotations((prev) => [...prev, action.data])
        } else if (action.target === "formField") {
          setFormFields((prev) => [...prev, action.data])
        } else if (action.target === "signature") {
          setSignatures((prev) => [...prev, action.data])
        } else if (action.target === "element") {
          setElements((prev) => [...prev, action.data])
        } else if (action.target === "page") {
          setPages((prev) => {
            const newPages = [...prev]
            newPages.splice(action.data.pageNumber - 1, 0, action.data)
            return newPages.map((page, index) => ({
              ...page,
              pageNumber: index + 1,
            }))
          })
          setTotalPages((prev) => prev + 1)
        }
        break
    }

    setCurrentActionIndex((prev) => prev - 1)
  }, [canUndo, actionHistory, currentActionIndex])

  const redoAction = useCallback(() => {
    if (!canRedo) return

    const action = actionHistory[currentActionIndex + 1]

    switch (action.type) {
      case "add":
        if (action.target === "annotation") {
          setAnnotations((prev) => [...prev, action.data])
        } else if (action.target === "formField") {
          setFormFields((prev) => [...prev, action.data])
        } else if (action.target === "signature") {
          setSignatures((prev) => [...prev, action.data])
        } else if (action.target === "element") {
          setElements((prev) => [...prev, action.data])
        } else if (action.target === "page") {
          setPages((prev) => [...prev, action.data])
          setTotalPages((prev) => prev + 1)
        }
        break
      case "update":
        if (action.target === "element") {
          setElements((prev) => prev.map((e) => (e.id === action.id ? action.data.newState : e)))
        }
        break
      case "delete":
        if (action.target === "annotation") {
          setAnnotations((prev) => prev.filter((a) => a.id !== action.data.id))
        } else if (action.target === "formField") {
          setFormFields((prev) => prev.filter((f) => f.id !== action.data.id))
        } else if (action.target === "signature") {
          setSignatures((prev) => prev.filter((s) => s.id !== action.data.id))
        } else if (action.target === "element") {
          setElements((prev) => prev.filter((e) => e.id !== action.data.id))
        } else if (action.target === "page") {
          setPages((prev) => prev.filter((p) => p.id !== action.data.id))
          setTotalPages((prev) => prev - 1)
        }
        break
    }

    setCurrentActionIndex((prev) => prev + 1)
  }, [canRedo, actionHistory, currentActionIndex])

  // Clean up PDF document when component unmounts
  useEffect(() => {
    return () => {
      if (pdfDocument) {
        pdfDocument.destroy().catch(console.error)
      }
    }
  }, [pdfDocument])

  // Save current document state to localStorage
  const saveToLocalStorage = useCallback(() => {
    if (!documentId || !currentDocument) return

    try {
      const documentState = {
        id: documentId,
        name: currentDocument.name,
        lastModified: Date.now(),
        pages,
        annotations,
        formFields,
        signatures,
        elements,
        totalPages,
      }

      localStorage.setItem(`pdfease-doc-${documentId}`, JSON.stringify(documentState))
      return true
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      return false
    }
  }, [documentId, currentDocument, pages, annotations, formFields, signatures, elements, totalPages])

  // Load document from localStorage
  const loadFromLocalStorage = async (id: string): Promise<boolean> => {
    try {
      const savedState = localStorage.getItem(`pdfease-doc-${id}`)
      if (!savedState) return false

      const parsedState = JSON.parse(savedState)

      setPages(parsedState.pages || [])
      setAnnotations(parsedState.annotations || [])
      setFormFields(parsedState.formFields || [])
      setSignatures(parsedState.signatures || [])
      setElements(parsedState.elements || [])
      setTotalPages(parsedState.totalPages || 0)
      setDocumentId(id)

      // Reset history when loading a document
      setActionHistory([])
      setCurrentActionIndex(-1)

      return true
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return false
    }
  }

  // Get list of available documents from localStorage
  const getAvailableDocuments = useCallback(() => {
    const documents: { id: string; name: string; lastModified: number }[] = []

    try {
      const keys = Object.keys(localStorage)
      for (const key of keys) {
        if (key.startsWith("pdfease-doc-")) {
          const id = key.replace("pdfease-doc-", "")
          const docData = JSON.parse(localStorage.getItem(key) || "{}")

          documents.push({
            id,
            name: docData.name || "Untitled Document",
            lastModified: docData.lastModified || 0,
          })
        }
      }
    } catch (error) {
      console.error("Error getting available documents:", error)
    }

    // Sort by last modified (newest first)
    return documents.sort((a, b) => b.lastModified - a.lastModified)
  }, [])

  // Improved loadPdf function with better error handling and high quality rendering
  const loadPdf = async (file: File) => {
    try {
      setIsLoading(true)
      setCurrentDocument(file)

      // Generate a unique ID for this document
      const newDocId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      setDocumentId(newDocId)

      // Initialize PDF.js if not already initialized
      const pdfjs = await initPdfJs()

      // Create a URL for the PDF file
      const fileURL = URL.createObjectURL(file)

      // Load the PDF document using PDF.js
      const loadingTask = pdfjs.getDocument(fileURL)
      const pdf = await loadingTask.promise

      setPdfDocument(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)

      // Process each page to extract content and create thumbnails
      const pagesData: Page[] = []
      const elementsData: PdfElement[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.0 }) // Use scale 1.0 for accurate positions

        // Extract text content
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")

        // Create a thumbnail by rendering the page to a small canvas
        // Use higher scale for better quality thumbnails based on renderQuality setting
        const thumbScale = 0.2 * renderQuality
        const thumbViewport = page.getViewport({ scale: thumbScale })
        const canvas = document.createElement("canvas")
        canvas.width = thumbViewport.width
        canvas.height = thumbViewport.height
        const ctx = canvas.getContext("2d")

        if (ctx) {
          await page.render({
            canvasContext: ctx,
            viewport: thumbViewport,
          }).promise

          const thumbnail = canvas.toDataURL()

          pagesData.push({
            id: `page-${i}`,
            pageNumber: i,
            thumbnail,
            textContent: pageText,
          })
        } else {
          // Fallback if canvas context fails
          pagesData.push({
            id: `page-${i}`,
            pageNumber: i,
            thumbnail: `/placeholder.svg?height=150&width=100&text=Page ${i}`,
            textContent: pageText,
          })
        }

        // Don't create editable elements for every text item to avoid cluttering
        // Instead, only create elements for significant text blocks
        const textItems = textContent.items as any[]

        // Group text items into paragraphs with more accurate positioning
        const paragraphs: { text: string; x: number; y: number; width: number; height: number }[] = []

        // Process text items to create meaningful paragraphs
        let currentParagraph: any[] = []
        let lastY = -1

        for (let j = 0; j < textItems.length; j++) {
          const item = textItems[j]
          const { str, transform, height = 12, width = str.length * 5 } = item
          const x = transform[4]
          const y = transform[5]

          // Skip empty strings
          if (!str.trim()) continue

          // If this is a new line or first item
          if (lastY === -1 || Math.abs(y - lastY) > height / 2) {
            // Save previous paragraph if it exists
            if (currentParagraph.length > 0) {
              const firstItem = currentParagraph[0]
              const combinedText = currentParagraph.map((item) => item.str).join(" ")

              // Only add paragraphs with meaningful content
              if (combinedText.trim().length > 3) {
                paragraphs.push({
                  text: combinedText,
                  x: firstItem.transform[4],
                  y: firstItem.transform[5],
                  width:
                    Math.max(
                      ...currentParagraph.map((item) => item.transform[4] + (item.width || item.str.length * 5)),
                    ) - firstItem.transform[4],
                  height: height || 12,
                })
              }
            }

            // Start new paragraph
            currentParagraph = [item]
            lastY = y
          } else {
            // Continue current paragraph
            currentParagraph.push(item)
          }

          // Handle the last item
          if (j === textItems.length - 1 && currentParagraph.length > 0) {
            const firstItem = currentParagraph[0]
            const combinedText = currentParagraph.map((item) => item.str).join(" ")

            // Only add paragraphs with meaningful content
            if (combinedText.trim().length > 3) {
              paragraphs.push({
                text: combinedText,
                x: firstItem.transform[4],
                y: firstItem.transform[5],
                width:
                  Math.max(...currentParagraph.map((item) => item.transform[4] + (item.width || item.str.length * 5))) -
                  firstItem.transform[4],
                height: height || 12,
              })
            }
          }
        }

        // Create elements from paragraphs with better styling
        // Only create elements for paragraphs with substantial content
        paragraphs.forEach((para, index) => {
          if (para.text.trim().length > 3) {
            elementsData.push({
              id: `element-text-${i}-${index}`,
              type: "text",
              content: para.text,
              x: para.x,
              y: para.y,
              width: Math.max(para.width, 50), // Ensure minimum width
              height: Math.max(para.height, 12), // Ensure minimum height
              fontSize: 12,
              fontFamily: "Arial",
              color: "#000000",
              pageNumber: i,
            })
          }
        })
      }

      setPages(pagesData)
      setElements(elementsData)

      // Reset history when loading a new document
      setActionHistory([])
      setCurrentActionIndex(-1)

      // Clean up the URL object
      URL.revokeObjectURL(fileURL)
    } catch (error) {
      console.error("Error loading PDF:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const addAnnotation = (annotation: Omit<Annotation, "id">) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `annotation-${Date.now()}`,
    }
    setAnnotations((prev) => [...prev, newAnnotation])

    addToHistory({
      type: "add",
      target: "annotation",
      data: newAnnotation,
    })
  }

  const removeAnnotation = (id: string) => {
    const annotationToRemove = annotations.find((a) => a.id === id)
    if (!annotationToRemove) return

    setAnnotations((prev) => prev.filter((anno) => anno.id !== id))

    addToHistory({
      type: "delete",
      target: "annotation",
      data: annotationToRemove,
    })
  }

  const addFormField = (field: Omit<FormField, "id">) => {
    const newField: FormField = {
      ...field,
      id: `field-${Date.now()}`,
    }
    setFormFields((prev) => [...prev, newField])

    addToHistory({
      type: "add",
      target: "formField",
      data: newField,
    })
  }

  const removeFormField = (id: string) => {
    const fieldToRemove = formFields.find((f) => f.id === id)
    if (!fieldToRemove) return

    setFormFields((prev) => prev.filter((field) => field.id !== id))

    addToHistory({
      type: "delete",
      target: "formField",
      data: fieldToRemove,
    })
  }

  const addSignature = (signature: Omit<Signature, "id">) => {
    const newSignature: Signature = {
      ...signature,
      id: `signature-${Date.now()}`,
    }
    setSignatures((prev) => [...prev, newSignature])

    addToHistory({
      type: "add",
      target: "signature",
      data: newSignature,
    })
  }

  const removeSignature = (id: string) => {
    const signatureToRemove = signatures.find((s) => s.id === id)
    if (!signatureToRemove) return

    setSignatures((prev) => prev.filter((sig) => sig.id !== id))

    addToHistory({
      type: "delete",
      target: "signature",
      data: signatureToRemove,
    })
  }

  const addElement = (element: Omit<PdfElement, "id">) => {
    const newElement: PdfElement = {
      ...element,
      id: `element-${Date.now()}`,
    }
    setElements((prev) => [...prev, newElement])

    addToHistory({
      type: "add",
      target: "element",
      data: newElement,
    })
  }

  const updateElement = (id: string, element: PdfElement) => {
    const previousState = elements.find((e) => e.id === id)
    if (!previousState) return

    setElements((prev) => prev.map((el) => (el.id === id ? element : el)))

    addToHistory({
      type: "update",
      target: "element",
      id,
      data: {
        previousState,
        newState: element,
      },
    })
  }

  const removeElement = (id: string) => {
    const elementToRemove = elements.find((e) => e.id === id)
    if (!elementToRemove) return

    setElements((prev) => prev.filter((el) => el.id !== id))

    addToHistory({
      type: "delete",
      target: "element",
      data: elementToRemove,
    })
  }

  const addBlankPage = () => {
    const newPageNumber = pages.length + 1
    const newPage: Page = {
      id: `page-${newPageNumber}`,
      pageNumber: newPageNumber,
      thumbnail: `/placeholder.svg?height=150&width=100&text=Page ${newPageNumber}`,
    }
    setPages((prev) => [...prev, newPage])
    setTotalPages((prev) => prev + 1)

    addToHistory({
      type: "add",
      target: "page",
      data: newPage,
    })
  }

  const deletePage = (pageNumber: number) => {
    if (pages.length <= 1) {
      return // Don't delete the last page
    }

    const pageToDelete = pages.find((p) => p.pageNumber === pageNumber)
    if (!pageToDelete) return

    setPages((prev) => {
      const newPages = prev.filter((page) => page.pageNumber !== pageNumber)
      // Renumber remaining pages
      return newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))
    })

    setTotalPages((prev) => prev - 1)

    // Adjust current page if needed
    if (currentPage > pageNumber || currentPage > totalPages - 1) {
      setCurrentPage(Math.max(1, currentPage - 1))
    }

    addToHistory({
      type: "delete",
      target: "page",
      data: pageToDelete,
    })
  }

  const protectPdf = async (password: string) => {
    if (!pdfDocument || !currentDocument) {
      throw new Error("No PDF document loaded")
    }

    // In a real implementation, we would use pdf-lib.js to protect the PDF
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Promise.resolve()
  }

  const downloadPdf = async () => {
    if (!pdfDocument || !currentDocument) {
      throw new Error("No PDF document loaded")
    }

    // In a real implementation, we would use pdf-lib.js to generate the PDF with modifications
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (currentDocument) {
      const url = URL.createObjectURL(currentDocument)
      const a = document.createElement("a")
      a.href = url
      a.download = currentDocument.name || "document.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return Promise.resolve()
  }

  const mergePdfs = async (files: File[]) => {
    // In a real implementation, we would use pdf-lib.js to merge PDFs
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Promise.resolve()
  }

  const splitPdf = async (pageRanges: { start: number; end: number }[]) => {
    // In a real implementation, we would use pdf-lib.js to split the PDF
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Promise.resolve([])
  }

  return (
    <PdfContext.Provider
      value={{
        currentDocument,
        pdfDocument,
        currentPage,
        totalPages,
        pages,
        zoom,
        isLoading,
        annotations,
        formFields,
        signatures,
        elements,
        canUndo,
        canRedo,
        documentId,
        renderQuality,
        setRenderQuality,
        setCurrentPage,
        setZoom,
        loadPdf,
        addAnnotation,
        removeAnnotation,
        addFormField,
        removeFormField,
        addSignature,
        removeSignature,
        addElement,
        updateElement,
        removeElement,
        addBlankPage,
        deletePage,
        protectPdf,
        downloadPdf,
        mergePdfs,
        splitPdf,
        undoAction,
        redoAction,
        saveToLocalStorage,
        loadFromLocalStorage,
        getAvailableDocuments,
      }}
    >
      {children}
    </PdfContext.Provider>
  )
}

export function usePdfContext() {
  const context = useContext(PdfContext)
  if (context === undefined) {
    throw new Error("usePdfContext must be used within a PdfProvider")
  }
  return context
}
