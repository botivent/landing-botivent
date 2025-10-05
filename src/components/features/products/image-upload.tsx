"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onSuccess?: (files: File[]) => void
  onError?: (error: string) => void
  maxFiles?: number
  maxSize?: number // en MB
  accept?: string
  className?: string
}

export function ImageUpload({
  files,
  onFilesChange,
  onSuccess,
  onError,
  maxFiles = 10,
  maxSize = 5,
  accept = "image/*",
  className
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Solo se permiten archivos de imagen'
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo es demasiado grande. Máximo ${maxSize}MB`
    }
    
    return null
  }

  const handleFiles = useCallback(async (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      const error = `Máximo ${maxFiles} archivos permitidos`
      onError?.(error)
      toast.error(error)
      return
    }

    // Validar archivos
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of newFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      onError?.(errors.join(', '))
      toast.error(errors.join(', '))
      return
    }

    if (validFiles.length === 0) return

    setIsUploading(true)
    
    try {
      const updatedFiles = [...files, ...validFiles]
      onFilesChange(updatedFiles)
      onSuccess?.(validFiles)
      toast.success(`${validFiles.length} imagen(es) añadida(s)`)
    } catch (error) {
      const errorMsg = 'Error al procesar las imágenes'
      onError?.(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }, [files, maxFiles, maxSize, onFilesChange, onSuccess, onError])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }, [handleFiles])

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    onFilesChange(updatedFiles)
  }, [files, onFilesChange])

  const clearAll = useCallback(() => {
    onFilesChange([])
  }, [onFilesChange])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card 
          className={cn(
              "relative border-dashed p-8 text-center transition-colors cursor-pointer",
              isDragOver 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && document.getElementById('file-input')?.click()}
            >
        <CardContent className="p-6">
            <input
              id="file-input"
              type="file"
              multiple
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center space-y-2">
              {isUploading ? (
                <>
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Procesando...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Máximo {maxFiles} archivos, {maxSize}MB cada uno
                    </p>
                  </div>
                </>
              )}
            </div>
        </CardContent>
      </Card>

      {/* Files Preview */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">
                Imágenes seleccionadas ({files.length}/{maxFiles})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={isUploading}
              >
                Limpiar todo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  <div className="mt-1 text-xs text-muted-foreground truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
