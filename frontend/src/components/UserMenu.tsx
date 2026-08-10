import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigate } from "react-router-dom"
import { 
  User as UserIcon, 
  Settings, 
  Palette, 
  Keyboard, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  LogOut,
  X,
  Command
} from "lucide-react"

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("hydra_user") || "{}")
  const userName = user.name || "Aryan"
  const userEmail = user.email || "aryan@example.com"
  const userInitial = userName.charAt(0).toUpperCase()
  const isProUser = user.tier === "PRO"

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle ESC key to close dropdown & modal
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
        setIsConfirmOpen(false)
        setIsShortcutsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("hydra_token")
    localStorage.removeItem("token")
    localStorage.removeItem("hydra_user")
    navigate("/login", { replace: true })
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-[11px] font-bold text-white tracking-wide shrink-0 ring-1 ring-white/10 hover:ring-violet-400/40 transition-all cursor-pointer shadow-sm active:scale-95"
        title={userName}
      >
        {userInitial}
      </button>

      {/* ─── Dropdown Menu ────────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[260px] bg-[#09090b] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl shadow-black/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Header User Info */}
          <div className="px-3 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner">
              {userInitial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-white truncate">{userName}</span>
              <span className="text-[11px] text-[#71717a] truncate">{userEmail}</span>
            </div>
          </div>

          <div className="h-px bg-[#1f1f23] my-1" />

          {/* Account Navigation Group */}
          <div className="flex flex-col gap-0.5">
            <div className="px-2.5 py-1.5 text-[12px] text-[#a1a1aa] rounded-lg flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2.5">
                <Palette className="size-3.5 text-[#71717a]" />
                <span>Appearance</span>
              </div>
              <span className="text-[10px] text-[#71717a] font-mono bg-[#121215] border border-[#27272a] px-1.5 py-0.2 rounded">Dark</span>
            </div>

            <button
              onClick={() => {
                setIsOpen(false)
                setIsShortcutsOpen(true)
              }}
              className="w-full px-2.5 py-1.5 text-[12px] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-lg flex items-center justify-between transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Keyboard className="size-3.5 text-[#71717a]" />
                <span>Keyboard Shortcuts</span>
              </div>
              <span className="text-[10px] text-[#71717a] font-mono">⌘K</span>
            </button>
          </div>

          <div className="h-px bg-[#1f1f23] my-1" />

          {/* Subscription Section */}
          <div className="p-2 bg-[#121215] border border-[#27272a] rounded-xl my-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white px-1">{isProUser ? "Hydra Pro" : "Free Plan"}</span>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Manage Plan →
            </Link>
          </div>

          <div className="h-px bg-[#1f1f23] my-1" />

          {/* Help & Documentation Group */}
          <div className="flex flex-col gap-0.5">
            <Link
              to="/docs"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1.5 text-[12px] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <BookOpen className="size-3.5 text-[#71717a]" />
              <span>Documentation</span>
            </Link>

            <a
              href="mailto:support@hydra-ai.com"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1.5 text-[12px] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <MessageSquare className="size-3.5 text-[#71717a]" />
              <span>Support</span>
            </a>
          </div>

          <div className="h-px bg-[#1f1f23] my-1" />

          {/* Log Out */}
          <button
            onClick={() => {
              setIsOpen(false)
              setIsConfirmOpen(true)
            }}
            className="w-full px-2.5 py-1.5 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2.5 transition-colors text-left cursor-pointer"
          >
            <LogOut className="size-3.5 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* ─── Sign Out Confirmation Modal ─────────────────────────────── */}
      {isConfirmOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-white">Sign out?</h3>
              <p className="text-xs text-[#71717a]">
                You'll be signed out of Hydra on this device.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── Keyboard Shortcuts Modal ──────────────────────────────────── */}
      {isShortcutsOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setIsShortcutsOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#71717a] hover:text-white rounded-md transition-colors"
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <Command className="size-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Keyboard Shortcuts</h3>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#1f1f23]">
                <span className="text-[#a1a1aa]">Toggle View Split</span>
                <kbd className="font-mono bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-[#e4e4e7]">1</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#1f1f23]">
                <span className="text-[#a1a1aa]">Toggle Overlay View</span>
                <kbd className="font-mono bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-[#e4e4e7]">2</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#1f1f23]">
                <span className="text-[#a1a1aa]">Toggle Diff View</span>
                <kbd className="font-mono bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-[#e4e4e7]">3</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#a1a1aa]">Zoom Canvas</span>
                <kbd className="font-mono bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-[#e4e4e7]">Ctrl + Scroll</kbd>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

