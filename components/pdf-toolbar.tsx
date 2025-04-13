"use client"

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronRight,
  Download,
  Italic,
  Lock,
  MoveHorizontal,
  MoveVertical,
  Pen,
  Shapes,
  Strikethrough,
  Sun,
  Text,
  Type,
  Underline,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PdfToolbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function PdfToolbar({ activeTab, setActiveTab }: PdfToolbarProps) {
  const { protectPdf, downloadPdf } = usePdfContext()
  const { toast } = useToast()
  const [textColor, setTextColor] = useState("#712FFF")
  const [fontSize, setFontSize] = useState(14)
  const [fontWeight, setFontWeight] = useState("semi-bold")
  const [fontFamily, setFontFamily] = useState("poppins")
  const [textWidth, setTextWidth] = useState(180)
  const [textHeight, setTextHeight] = useState(20)
  const [elementWidth, setElementWidth] = useState(100)
  const [elementHeight, setElementHeight] = useState(80)

  const handleProtectPdf = async () => {
    try {
      await protectPdf()
      toast({
        title: "PDF Protected",
        description: "Your PDF has been protected with a password",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to protect PDF",
        variant: "destructive",
      })
    }
  }

  const handleDownloadPdf = async () => {
    try {
      await downloadPdf()
      toast({
        title: "PDF Downloaded",
        description: "Your PDF has been downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-[300px] border-l bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-4 p-0 h-12">
          <TabsTrigger
            value="text"
            className="rounded-none data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Type className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="draw"
            className="rounded-none data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Pen className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="shapes"
            className="rounded-none data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Shapes className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="format"
            className="rounded-none data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Text className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <TabsContent value="text" className="m-0 p-4">
            <div className="space-y-4">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-2 text-sm font-medium hover:bg-muted/50">
                  Font Settings
                  <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">Font Family</div>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue placeholder="Font Family" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poppins">Poppins</SelectItem>
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="times">Times New Roman</SelectItem>
                          <SelectItem value="georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="mb-2 text-sm font-medium">Weight</div>
                        <Select value={fontWeight} onValueChange={setFontWeight}>
                          <SelectTrigger>
                            <SelectValue placeholder="Weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="semi-bold">Semi-bold</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-medium">Size</div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number.parseInt(e.target.value) || 14)}
                            className="h-10"
                          />
                          <span className="text-sm">px</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">Color</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2">
                            <div className="h-5 w-5 rounded" style={{ backgroundColor: textColor }}></div>
                            <span className="text-sm">{textColor}</span>
                            <Sun className="ml-auto h-4 w-4 text-gray-400" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <HexColorPicker color={textColor} onChange={setTextColor} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-2 text-sm font-medium hover:bg-muted/50">
                  Text Dimensions
                  <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">Width</span>
                        <span className="text-xs text-muted-foreground">{textWidth}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={[textWidth]}
                          min={50}
                          max={200}
                          step={1}
                          onValueChange={(value) => setTextWidth(value[0])}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">Height</span>
                        <span className="text-xs text-muted-foreground">{textHeight}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveVertical className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={[textHeight]}
                          min={10}
                          max={100}
                          step={1}
                          onValueChange={(value) => setTextHeight(value[0])}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-2 text-sm font-medium hover:bg-muted/50">
                  Text Formatting
                  <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">Alignment</div>
                      <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <AlignRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <AlignJustify className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">Style</div>
                      <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full">
                          <Strikethrough className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-2 text-sm font-medium hover:bg-muted/50">
                  Element Size
                  <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="mb-2 text-sm font-medium">Width</div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={elementWidth}
                            onChange={(e) => setElementWidth(Number.parseInt(e.target.value) || 100)}
                            className="h-9"
                          />
                          <span className="text-sm">px</span>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-medium">Height</div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={elementHeight}
                            onChange={(e) => setElementHeight(Number.parseInt(e.target.value) || 80)}
                            className="h-9"
                          />
                          <span className="text-sm">px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleProtectPdf}>
                <Lock className="mr-2 h-4 w-4" />
                Protect PDF
              </Button>

              <Button className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="draw" className="m-0 p-4">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Drawing Tools</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <Pen className="h-5 w-5" />
                    <span className="text-xs">Pen</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 21L12 12M21 3L12 12M12 12L7 7M12 12L17 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs">Marker</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs">Eraser</span>
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Brush Size</div>
                <Slider defaultValue={[5]} max={20} min={1} step={1} className="py-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Thin</span>
                  <span>Thick</span>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Color</div>
                <div className="grid grid-cols-6 gap-2">
                  {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"].map((color) => (
                    <div
                      key={color}
                      className="h-8 w-full cursor-pointer rounded-md border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shapes" className="m-0 p-4">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Basic Shapes</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <div className="h-5 w-5 rounded-sm border-2 border-current"></div>
                    <span className="text-xs">Rectangle</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <div className="h-5 w-5 rounded-full border-2 border-current"></div>
                    <span className="text-xs">Circle</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 3L22 18H2L12 3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs">Triangle</span>
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Line Styles</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-10">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 12H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                  <Button variant="outline" className="h-10">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 12H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  </Button>
                  <Button variant="outline" className="h-10">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 12H21"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Fill Color</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2">
                      <div className="h-5 w-5 rounded bg-purple-600"></div>
                      <span className="text-sm">#7C3AED</span>
                      <Sun className="ml-auto h-4 w-4 text-gray-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <HexColorPicker color="#7C3AED" onChange={() => {}} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="format" className="m-0 p-4">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Page Format</div>
                <Select defaultValue="letter">
                  <SelectTrigger>
                    <SelectValue placeholder="Page Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="letter">Letter (8.5" x 11")</SelectItem>
                    <SelectItem value="legal">Legal (8.5" x 14")</SelectItem>
                    <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                    <SelectItem value="a3">A3 (297 x 420 mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Orientation</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs">Portrait</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 p-2">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs">Landscape</span>
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Margins</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Top & Bottom</div>
                    <Input type="number" defaultValue="1" className="h-9" />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Left & Right</div>
                    <Input type="number" defaultValue="1" className="h-9" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
