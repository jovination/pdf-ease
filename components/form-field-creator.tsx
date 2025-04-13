"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, Info, Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type FieldType = "text" | "checkbox" | "radio" | "dropdown"

interface FormFieldPreview {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  options?: string[]
  required?: boolean
  x: number
  y: number
  width: number
  height: number
}

export function FormFieldCreator() {
  const { currentPage, addFormField, formFields } = usePdfContext()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("create")
  const [fields, setFields] = useState<FormFieldPreview[]>([])
  const [newField, setNewField] = useState<Partial<FormFieldPreview>>({
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    x: 100,
    y: 100,
    width: 200,
    height: 40,
  })
  const [options, setOptions] = useState<string>("")

  const handleAddField = () => {
    if (!newField.label) {
      toast({
        title: "Missing Information",
        description: "Please provide a label for the form field",
        variant: "destructive",
      })
      return
    }

    const fieldOptions = options
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option.length > 0)

    const field: FormFieldPreview = {
      id: `field-${Date.now()}`,
      type: newField.type as FieldType,
      label: newField.label || "",
      placeholder: newField.placeholder,
      required: newField.required,
      x: newField.x || 100,
      y: newField.y || 100,
      width: newField.width || 200,
      height: newField.height || 40,
    }

    if (field.type === "dropdown" || field.type === "radio") {
      if (fieldOptions.length === 0) {
        toast({
          title: "Missing Options",
          description: `Please provide options for the ${field.type} field`,
          variant: "destructive",
        })
        return
      }
      field.options = fieldOptions
    }

    setFields([...fields, field])

    // Add to PDF context
    addFormField({
      type: field.type,
      label: field.label,
      pageNumber: currentPage,
      x: field.x,
      y: field.y,
      width: field.width,
      height: field.height,
      required: field.required,
      options: field.options,
    })

    toast({
      title: "Field Added",
      description: `${field.label} field has been added to the document`,
    })

    setOpen(false)

    // Reset form
    setNewField({
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      x: 100,
      y: 100,
      width: 200,
      height: 40,
    })
    setOptions("")
  }

  const handleApplyToDocument = () => {
    toast({
      title: "Fields Applied",
      description: `${fields.length} fields have been applied to the document`,
    })
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Form Field Creator</CardTitle>
        <CardDescription>Create interactive form fields using pdf-lib.js</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Fields</TabsTrigger>
            <TabsTrigger value="preview">Preview ({fields.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Form Fields</h3>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Form Field</DialogTitle>
                    <DialogDescription>Create a new form field to add to your PDF document.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="field-type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={newField.type}
                        onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Input</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="radio">Radio Buttons</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="field-label" className="text-right">
                        Label
                      </Label>
                      <Input
                        id="field-label"
                        value={newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    {newField.type === "text" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="field-placeholder" className="text-right">
                          Placeholder
                        </Label>
                        <Input
                          id="field-placeholder"
                          value={newField.placeholder}
                          onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                    )}
                    {(newField.type === "dropdown" || newField.type === "radio") && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="field-options" className="text-right">
                          Options
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="field-options"
                            value={options}
                            onChange={(e) => setOptions(e.target.value)}
                            placeholder="Option 1, Option 2, Option 3"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">Separate options with commas</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Required</Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Checkbox
                          id="field-required"
                          checked={newField.required}
                          onCheckedChange={(checked) =>
                            setNewField({
                              ...newField,
                              required: checked === true,
                            })
                          }
                        />
                        <label
                          htmlFor="field-required"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          This field is required
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Position</Label>
                      <div className="col-span-3 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">X:</span>
                          <Input
                            type="number"
                            value={newField.x}
                            onChange={(e) =>
                              setNewField({
                                ...newField,
                                x: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Y:</span>
                          <Input
                            type="number"
                            value={newField.y}
                            onChange={(e) =>
                              setNewField({
                                ...newField,
                                y: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Size</Label>
                      <div className="col-span-3 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Width:</span>
                          <Input
                            type="number"
                            value={newField.width}
                            onChange={(e) =>
                              setNewField({
                                ...newField,
                                width: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Height:</span>
                          <Input
                            type="number"
                            value={newField.height}
                            onChange={(e) =>
                              setNewField({
                                ...newField,
                                height: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddField}>Add Field</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border border-dashed p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">How to Create Form Fields</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Form fields allow users to fill out information in your PDF. Click "Add Field" to create text inputs,
                  checkboxes, radio buttons, or dropdowns.
                </p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Field
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="pt-4">
            {fields.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No form fields added yet. Switch to the "Create Fields" tab to add your first form field.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field) => (
                  <Collapsible key={field.id} className="rounded-md border">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {field.type}
                        </div>
                        <span className="font-medium">{field.label}</span>
                        {field.required && <span className="text-xs text-red-500">*required</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeField(field.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t bg-muted/20 p-3">
                      <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Position:</span> X: {field.x}, Y: {field.y}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {field.width} x {field.height}
                          </div>
                        </div>
                        {field.placeholder && (
                          <div>
                            <span className="font-medium">Placeholder:</span> {field.placeholder}
                          </div>
                        )}
                        {field.options && (
                          <div>
                            <span className="font-medium">Options:</span> {field.options.join(", ")}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="outline" size="sm" disabled>
                  Import Fields
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import form field definitions from JSON (Coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={handleApplyToDocument} disabled={fields.length === 0}>
          Apply to Document
        </Button>
      </CardFooter>
    </Card>
  )
}
