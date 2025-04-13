"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface FormInputProps {
  label: string
  placeholder?: string
  required?: boolean
}

export function FormInput({ label, placeholder, required }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`input-${label}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input id={`input-${label}`} placeholder={placeholder} required={required} />
    </div>
  )
}

interface FormSelectProps {
  label: string
  options: string[]
  required?: boolean
}

export function FormSelect({ label, options, required }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`select-${label}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select>
        <SelectTrigger id={`select-${label}`}>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface FormCheckboxProps {
  label: string
  required?: boolean
}

export function FormCheckbox({ label, required }: FormCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={`checkbox-${label}`} required={required} />
      <Label htmlFor={`checkbox-${label}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
    </div>
  )
}
