"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Home, Plus, Settings, Trash2, FolderOpen, Star, Clock, Share2, User, LogOut } from "lucide-react"
import { usePdfContext } from "@/context/pdf-context"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"

export function PdfSidebar() {
  const { pages, currentPage, setCurrentPage, addBlankPage, deletePage } = usePdfContext()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<string>("pages")
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    recent: true,
    favorites: false,
    shared: false,
  })

  const handleDeleteClick = (pageNumber: number) => {
    setPageToDelete(pageNumber)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (pageToDelete !== null) {
      deletePage(pageToDelete)
      toast.success("Page deleted", {
        description: `Page ${pageToDelete} has been removed from the document.`,
      })
    }
    setIsDeleteDialogOpen(false)
    setPageToDelete(null)
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex w-[240px] flex-col border-r bg-muted/10 dark:border-gray-800">
      <div className="flex flex-col items-center gap-2 p-2">
        <TooltipProvider>
          <div className="flex w-full justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 transition-all ${activeSection === "home" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" : "hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"}`}
                  onClick={() => setActiveSection("home")}
                >
                  <Home className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 transition-all ${activeSection === "documents" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" : "hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"}`}
                  onClick={() => setActiveSection("documents")}
                >
                  <FileText className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Documents</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 transition-all ${activeSection === "settings" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" : "hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"}`}
                  onClick={() => setActiveSection("settings")}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <Separator className="my-2" />

      {activeSection === "pages" && (
        <>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-medium text-muted-foreground">Pages</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                    onClick={() => {
                      addBlankPage()
                      toast.success("Page added", {
                        description: "A new blank page has been added to your document.",
                      })
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Add Page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`group relative cursor-pointer rounded-md border transition-all ${
                    currentPage === page.pageNumber
                      ? "border-purple-600 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="aspect-[1/1.4] bg-white p-1 transition-all hover:shadow-sm"
                    onClick={() => setCurrentPage(page.pageNumber)}
                  >
                    {page.thumbnail ? (
                      <img
                        src={page.thumbnail || "/placeholder.svg"}
                        alt={`Page ${page.pageNumber}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No preview</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between px-1">
                    <div className="text-center text-xs text-gray-500">{page.pageNumber}</div>

                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(page.pageNumber)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete page {pageToDelete}? This action cannot be undone.
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
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {activeSection === "documents" && (
        <div className="flex-1 overflow-hidden">
          <div className="p-3">
            <Button variant="outline" className="w-full justify-start mb-3">
              <FolderOpen className="mr-2 h-4 w-4" />
              Open Document
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="px-3">
              <Collapsible open={openSections.recent} onOpenChange={() => toggleSection("recent")}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Recent Documents
                  </div>
                  <div className="text-xs text-muted-foreground">{openSections.recent ? "−" : "+"}</div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pb-2">
                  {["Annual Report.pdf", "Contract Draft.pdf", "Meeting Notes.pdf"].map((doc, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8 px-2"
                      onClick={() => toast.info("Document selected", { description: `${doc} would be opened here.` })}
                    >
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      {doc}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={openSections.favorites} onOpenChange={() => toggleSection("favorites")}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                    Favorites
                  </div>
                  <div className="text-xs text-muted-foreground">{openSections.favorites ? "−" : "+"}</div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pb-2">
                  {["Important Contract.pdf", "Tax Documents.pdf"].map((doc, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8 px-2"
                      onClick={() => toast.info("Document selected", { description: `${doc} would be opened here.` })}
                    >
                      <FileText className="mr-2 h-4 w-4 text-yellow-500" />
                      {doc}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={openSections.shared} onOpenChange={() => toggleSection("shared")}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                  <div className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    Shared with Me
                  </div>
                  <div className="text-xs text-muted-foreground">{openSections.shared ? "−" : "+"}</div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pb-2">
                  {["Team Project.pdf", "Collaboration Doc.pdf"].map((doc, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8 px-2"
                      onClick={() => toast.info("Document selected", { description: `${doc} would be opened here.` })}
                    >
                      <FileText className="mr-2 h-4 w-4 text-green-500" />
                      {doc}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </div>
      )}

      {activeSection === "settings" && (
        <div className="p-3 flex-1">
          <h3 className="font-medium mb-3">Settings</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm">
              <User className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <FileText className="mr-2 h-4 w-4" />
              Document Defaults
            </Button>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
