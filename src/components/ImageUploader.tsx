'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { T } from '@/lib/design-tokens'

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export default function ImageUploader({
  onImagesChange,
  maxImages = 5,
  maxSizeMB = 6,
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  // Convertir File en base64
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Valider les fichiers
  function validateFiles(files: File[]): boolean {
    setError(null)

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images autorisées`)
      return false
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} n'est pas une image valide`)
        return false
      }
      if (file.size > maxSizeBytes) {
        setError(`${file.name} dépasse ${maxSizeMB} Mo`)
        return false
      }
    }

    return true
  }

  // Traiter les fichiers
  async function processFiles(files: FileList | File[]) {
    const fileArray = Array.from(files)
    if (!validateFiles(fileArray)) return

    try {
      const base64Array = await Promise.all(fileArray.map(fileToBase64))
      const newImages = [...images, ...base64Array]
      setImages(newImages)
      onImagesChange(newImages)
    } catch (err) {
      setError('Erreur lors du traitement des images')
    }
  }

  // Gérer la sélection de fichiers
  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  // Supprimer une image
  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
    setError(null)
  }

  // Drag & Drop
  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Label */}
      <div style={{
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#C9A96E',
        marginBottom: '4px',
      }}>
        Photos du bien (optionnel)
        <span style={{ color: '#6B6B65', marginLeft: '8px', textTransform: 'none' }}>
          jusqu'à {maxImages} images · max {maxSizeMB} Mo
        </span>
      </div>

      {/* Zone d'upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? T.gold : T.border}`,
          borderRadius: '4px',
          padding: '32px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: isDragging ? 'rgba(201,169,110,0.05)' : 'transparent',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '28px', marginBottom: '12px', opacity: 0.6 }}>📸</div>
        <div style={{ fontSize: '13px', color: T.mid, marginBottom: '4px' }}>
          Glissez vos photos ici ou <span style={{ color: T.gold }}>parcourez</span>
        </div>
        <div style={{ fontSize: '11px', color: '#555' }}>
          JPEG, PNG, WebP, HEIC
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          padding: '8px 12px',
          background: T.errBg,
          borderLeft: `3px solid ${T.err}`,
          color: T.err,
          fontSize: '12px',
        }}>
          {error}
        </div>
      )}

      {/* Prévisualisation */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '8px',
          marginTop: '8px',
        }}>
          {images.map((img, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '4px',
                overflow: 'hidden',
                border: `1px solid ${T.border}`,
              }}
            >
              <img
                src={img}
                alt={`Preview ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(24,24,26,0.8)',
                  border: 'none',
                  color: '#FAFAF7',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}