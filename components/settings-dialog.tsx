"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { usePdfContext } from "@/context/pdf-context"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Save, Download, Lock, Upload, Monitor, Moon, Sun } from "lucide-react"

export function SettingsDialog({
  open,
  onOpenChange,
  fileName,
  setFileName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  setFileName: (name: string) => void
}) {
  const { protectPdf, downloadPdf, setRenderQuality, renderQuality } = usePdfContext()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("general")
  const [password, setPassword] = useState("")
  const [autoSave, setAutoSave] = useState(true)
  const [highQualityPreview, setHighQualityPreview] = useState(true)
  const [defaultZoom, setDefaultZoom] = useState("100")
  const [showPageNumbers, setShowPageNumbers] = useState(true)
  const [clearLocalStorage, setClearLocalStorage] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("pdfease-settings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setAutoSave(settings.autoSave ?? true)
        setHighQualityPreview(settings.highQualityPreview ?? true)
        setDefaultZoom(settings.defaultZoom ?? "100")
        setShowPageNumbers(settings.showPageNumbers ?? true)
        setRenderQuality(settings.renderQuality ?? 2)
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
  }, [setRenderQuality])

  const saveSettings = () => {
    // Save settings to localStorage
    const settings = {
      autoSave,
      highQualityPreview,
      defaultZoom,
      showPageNumbers,
      renderQuality,
    }
    localStorage.setItem("pdfease-settings", JSON.stringify(settings))

    // Apply settings
    setRenderQuality(highQualityPreview ? 2 : 1)

    if (clearLocalStorage) {
      const confirmClear = confirm("Are you sure you want to clear all saved documents? This action cannot be undone.")
      if (confirmClear) {
        // Clear only document-related localStorage items, not settings
        const keys = Object.keys(localStorage)
        keys.forEach((key) => {
          if (key.startsWith("pdfease-doc-")) {
            localStorage.removeItem(key)
          }
        })
        toast.success("Document storage cleared", {
          description: "All saved documents have been removed from local storage.",
        })
        setClearLocalStorage(false)
      }
    }

    toast.success("Settings saved", {
      description: "Your preferences have been updated.",
    })
  }

  const handleProtectPdf = async () => {
    if (!password) {
      toast.error("Password required", {
        description: "Please enter a password to protect your document.",
      })
      return
    }

    try {
      await protectPdf(password)
      toast.success("Document protected", {
        description: "Your document has been password protected.",
      })
      setPassword("")
    } catch (error) {
      toast.error("Protection failed", {
        description: "Failed to protect document.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your document settings and preferences.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="flex-1"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="flex-1"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="flex-1"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="defaultZoom">Default Zoom Level</Label>
              <Select value={defaultZoom} onValueChange={setDefaultZoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zoom level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                  <SelectItem value="125">125%</SelectItem>
                  <SelectItem value="150">150%</SelectItem>
                  <SelectItem value="200">200%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoSave" className="cursor-pointer">
                Auto-save documents
              </Label>
              <Switch id="autoSave" checked={autoSave} onCheckedChange={setAutoSave} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showPageNumbers" className="cursor-pointer">
                Show page numbers
              </Label>
              <Switch id="showPageNumbers" checked={showPageNumbers} onCheckedChange={setShowPageNumbers} />
            </div>
          </TabsContent>

          <TabsContent value="document" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="filename">Document Name</Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="protection">Document Protection</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleProtectPdf}>
                  <Lock className="h-4 w-4 mr-2" />
                  Protect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add password protection to prevent unauthorized access to your document.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Document Actions</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => downloadPdf()}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Replace
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="highQualityPreview" className="cursor-pointer">
                  High quality preview
                </Label>
                <Switch
                  id="highQualityPreview"
                  checked={highQualityPreview}
                  onCheckedChange={(checked) => {
                    setHighQualityPreview(checked)
                    setRenderQuality(checked ? 2 : 1)
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enable high quality rendering for better visual fidelity. May affect performance on large documents.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Rendering Quality</Label>
              <Slider
                defaultValue={[renderQuality]}
                max={3}
                min={1}
                step={0.5}
                onValueChange={(value) => setRenderQuality(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <div className="grid gap-2 pt-4 border-t">
              <Label className="text-red-500">Danger Zone</Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Clear local storage</p>
                  <p className="text-xs text-muted-foreground">Remove all saved documents from browser storage.</p>
                </div>
                <Switch id="clearStorage" checked={clearLocalStorage} onCheckedChange={setClearLocalStorage} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              saveSettings()
              onOpenChange(false)
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
