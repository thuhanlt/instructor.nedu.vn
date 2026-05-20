import { useRef, useState, type DragEvent } from 'react'
import { Icon } from './Icon'
import { cn } from '@shared/utils/cn'

interface Props {
  accept?: string
  multiple?: boolean
  onFilesAdded: (files: File[]) => void
  maxSizeMb?: number
  hint?: string
}

export function UploadZone({
  accept,
  multiple = true,
  onFilesAdded,
  maxSizeMb = 25,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  function pick(files: FileList | null) {
    if (!files || files.length === 0) return
    const arr: File[] = []
    for (const f of Array.from(files)) {
      if (maxSizeMb && f.size > maxSizeMb * 1024 * 1024) continue
      arr.push(f)
    }
    if (arr.length > 0) onFilesAdded(arr)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDrag(false)
    pick(e.dataTransfer.files)
  }

  return (
    <div
      className={cn('upload-zone', drag && 'dragging')}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
    >
      <Icon name="download" size={24} style={{ transform: 'rotate(180deg)', marginBottom: 6 }} />
      <div style={{ fontWeight: 600, fontSize: 13 }}>
        Kéo thả file vào đây hoặc <span style={{ color: 'var(--blue)' }}>chọn từ máy</span>
      </div>
      <div style={{ fontSize: 11, marginTop: 4, color: 'var(--faint)' }}>
        {hint ?? `Tối đa ${maxSizeMb}MB / file. PDF, DOCX, PPTX, Ảnh.`}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => {
          pick(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
