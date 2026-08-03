import { useState } from "react"
import { AlertTriangle, Loader2, X } from "lucide-react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  itemName: string
  itemType: "Project" | "Test Run"
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType,
}: ConfirmDeleteModalProps) {
  const [confirmInput, setConfirmInput] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const isConfirmed = confirmInput.trim() === "CONFIRM"

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfirmed || isDeleting) return

    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm()
      setConfirmInput("")
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to delete ${itemType.toLowerCase()}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    setConfirmInput("")
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0d0d0f] border border-[#1f1f23] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f23]/60 bg-[#121215]">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="size-4 shrink-0" />
            <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDelete} className="p-5 flex flex-col gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This action <strong className="text-red-400">cannot be undone</strong>. This will permanently delete the{" "}
            <span className="text-white font-mono font-medium">{itemName}</span> {itemType.toLowerCase()}
            {itemType === "Project" && " and all of its associated test runs"}.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono font-medium text-muted-foreground/80">
              To confirm, type <span className="text-white font-bold tracking-wider">CONFIRM</span> below:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="CONFIRM"
              disabled={isDeleting}
              autoFocus
              className="w-full bg-[#141417] border border-[#27272a] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-muted-foreground/40"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-mono bg-red-950/30 border border-red-900/40 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-white bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-lg transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isConfirmed || isDeleting}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                isConfirmed && !isDeleting
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-900/30 cursor-pointer"
                  : "bg-red-950/40 text-red-500/40 border border-red-900/20 cursor-not-allowed"
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete {itemType}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
