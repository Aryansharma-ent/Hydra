import { Send, Loader2, AlertTriangle, ChevronRight, Copy, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import type { TestRun } from "@/types"

interface Message {
  sender: "user" | "ai"
  text: string
}

interface ChatSidebarProps {
  runData: TestRun
  chatMessages: Message[]
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

// ─── Code block with copy button ─────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2 rounded-md border border-[#1f1f23] bg-[#0d0d0f] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#1f1f23] bg-[#111113]">
        <span className="text-[9px] font-mono text-[#3f3f46] uppercase tracking-wider">css</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[9px] text-[#525252] hover:text-[#a1a1aa] transition-colors cursor-pointer"
        >
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 text-[10px] font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
        {code.trim()}
      </pre>
    </div>
  )
}

// ─── Message formatter ────────────────────────────────────────────────────────
function FormattedMessage({ text }: { text: string }) {
  const parts = text.split(/(```(?:css|html|javascript|json|ts|tsx)?\n?[\s\S]*?```)/g)

  return (
    <>
      {parts.map((part, idx) => {
        const codeMatch = part.match(/```(?:css|html|javascript|json|ts|tsx)?\n?([\s\S]*?)```/)
        if (codeMatch) {
          return <CodeBlock key={idx} code={codeMatch[1]} />
        }

        // Inline formatting
        const inlineParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
        return (
          <span key={idx}>
            {inlineParts.map((sub, subIdx) => {
              if (sub.startsWith("`") && sub.endsWith("`")) {
                return (
                  <code key={subIdx} className="bg-[#1a1a1d] text-[#a78bfa] px-1 py-0.5 rounded text-[10px] font-mono border border-[#2e2e32]">
                    {sub.slice(1, -1)}
                  </code>
                )
              }
              if (sub.startsWith("**") && sub.endsWith("**")) {
                return <strong key={subIdx} className="text-white font-semibold">{sub.slice(2, -2)}</strong>
              }
              return sub.split("\n").map((line, lineIdx, arr) => (
                <span key={lineIdx}>
                  {line}
                  {lineIdx < arr.length - 1 && <br />}
                </span>
              ))
            })}
          </span>
        )
      })}
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatSidebar({ runData, chatMessages, setChatMessages }: ChatSidebarProps) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setChatMessages(prev => [...prev, { sender: "user", text: userMessage }])
    setLoading(true)

    try {
      const history = chatMessages.slice(1).map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))

      const token = localStorage.getItem("hydra_token");
      const res = await axios.post(
        `http://localhost:8000/api/tests/run/${runData._id}/chat`,
        {
          message: userMessage,
          history,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setChatMessages(prev => [...prev, { sender: "ai", text: res.data.message }])
      }
    } catch {
      setChatMessages(prev => [
        ...prev,
        { sender: "ai", text: "Connection error. Verify the backend is running and the Gemini API key is configured." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const bugCount = runData.visualBugs?.length ?? 0

  return (
    <aside className="w-[340px] border-l border-[#1f1f23] bg-[#0a0a0b] flex flex-col shrink-0 min-h-0">

      {/* ── Panel Header ─────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-[#1f1f23] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
            <img src="/src/assets/hydralogo.png" alt="" />
          </div>
          <span className="text-[11px] font-semibold text-[#e4e4e7] tracking-wider ">Hydra</span>
        </div>
        <span className="text-[9px] font-mono text-[#3f3f46] bg-[#141416] border border-[#1f1f23] px-1.5 py-0.5 rounded">
          gemini-2.5
        </span>
      </div>

      {/* ── Detected Issues ──────────────────────────────────────────── */}
      <div className="border-b  border-[#1f1f23] shrink-0">
        <div className="px-4 py-2  flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#52525b] uppercase tracking-widest">
            Regressions
          </span>
          <span className={`text-[10px] font-mono font-semibold  px-1.5 py-0.5 rounded ${
            bugCount === 0
              ? "text-emerald-400 bg-emerald-500/8 border border-emerald-500/15"
              : "text-red-400 bg-red-500/8 border border-red-500/15"
          }`}>
            {bugCount}
          </span>
        </div>

        <div className="max-h-[200px] h-20 overflow-y-auto px-3 pb-3 flex flex-col gap-1.5">
          {bugCount === 0 ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#0d0d0f] border border-[#1a1a1d] text-[11px] text-[#3f3f46]">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              No visual regressions detected
            </div>
          ) : (
            runData.visualBugs.map((bug, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(`Explain Bug #${index + 1} ("${bug.element}") and give me the CSS fix.`)
                  inputRef.current?.focus()
                }}
                className="w-full text-left group flex items-start gap-2.5 px-3 py-2.5 rounded-md bg-[#0d0d0f] border border-[#1a1a1d] hover:border-[#2e2e32] hover:bg-[#111113] transition-all duration-150 cursor-pointer"
              >
                <AlertTriangle className="size-3 text-red-400/70 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[9px] font-mono text-red-400/70">BUG·{index + 1}</span>
                    <span className="text-[9px] text-[#3f3f46] group-hover:text-[#71717a] flex items-center gap-0.5 transition-colors">
                      Ask <ChevronRight className="size-2.5" />
                    </span>
                  </div>
                  <code className="text-[10px] font-mono text-[#71717a] break-all leading-tight block">
                    {bug.element}
                  </code>
                  {bug.description && (
                    <p className="text-[10px] text-[#3f3f46] mt-1 leading-snug">{bug.description}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Messages ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 min-h-0">
        {chatMessages.map((msg, index) =>
          msg.sender === "user" ? (
            <div key={index} className="flex justify-end">
              <div className="max-w-[88%] bg-[#18181b] border border-[#2e2e32] rounded-xl rounded-tr-sm px-3 py-2 text-[11px] text-[#d4d4d8] leading-relaxed">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={index} className="flex gap-2 items-start">
              {/* AI avatar dot */}
              <div className="size-4 rounded bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <img src="/src/assets/hydralogo.png" alt="" />
              </div>
              <div className="flex-1 min-w-0 text-[11px] text-[#a1a1aa] leading-relaxed">
                <FormattedMessage text={msg.text} />
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex gap-2 items-start">
            <div className="size-4 rounded bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Loader2 className="size-2.5 text-violet-400 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="size-1 rounded-full bg-[#3f3f46] animate-[pulse_1.2s_ease-in-out_infinite]" />
              <span className="size-1 rounded-full bg-[#3f3f46] animate-[pulse_1.2s_ease-in-out_0.2s_infinite]" />
              <span className="size-1 rounded-full bg-[#3f3f46] animate-[pulse_1.2s_ease-in-out_0.4s_infinite]" />
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* ── Input ─────────────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-[#1f1f23] shrink-0 bg-[#0a0a0b]">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#111113] border border-[#1f1f23] rounded-lg px-3 py-2 focus-within:border-[#3f3f46] transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={loading}
            onChange={e => setInput(e.target.value)}
            placeholder={loading ? "Analyzing…" : "Ask about this run…"}
            className="flex-1 bg-transparent text-[11px] text-[#d4d4d8] placeholder-[#3f3f46] outline-none min-w-0"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 p-1 text-[#525252] hover:text-[#a1a1aa] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <Send className="size-3.5" />
          </button>
        </form>
        <p className="text-[9px] text-[#2e2e32] mt-1.5 text-center">Gemini 2.5 · Visual regression context</p>
      </div>

    </aside>
  )
}
