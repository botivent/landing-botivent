"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputRowProps {
  label: string
  placeholder?: string
  type?: string
  name: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  props?: React.InputHTMLAttributes<HTMLInputElement>
}

export function InputRow({ label, placeholder, type = "text", value, onChange, name, props }: InputRowProps) {
  return (
    <div className="space-y-2 mb-4">
      <Label className="mb-2" htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
} 