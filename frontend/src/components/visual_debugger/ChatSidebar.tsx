import { Send, Loader2, ChevronRight, ChevronDown, Copy, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  selectedBugIndex?: number | null
  onSelectBug?: (index: number | null) => void
}

/* ═══ Code Block (VS Code-inspired) ═══ */
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2 rounded-lg border border-[#1f1f23] bg-[#0c0c0e] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#1f1f23]/60 bg-[#111113]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-[#3f3f46]" />
            <span className="size-1.5 rounded-full bg-[#3f3f46]" />
            <span className="size-1.5 rounded-full bg-[#3f3f46]" />
          </div>
          <span className="text-[9px] font-mono text-[#52525b] uppercase tracking-wider">css</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[9px] text-[#52525b] hover:text-[#a1a1aa] transition-colors cursor-pointer rounded px-1.5 py-0.5 hover:bg-[#1a1a1d]"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 text-[10px] font-mono text-emerald-300/90 whitespace-pre-wrap overflow-x-auto leading-relaxed">
        {code.trim()}
      </pre>
    </div>
  )
}

 // format message function
function FormattedMessage({ text }: { text: string }) {
  const parts = text.split(/(```(?:css|html|javascript|json|ts|tsx)?\n?[\s\S]*?```)/g)

  return (
    <>
      {parts.map((part, idx) => {
        const codeMatch = part.match(/```(?:css|html|javascript|json|ts|tsx)?\n?([\s\S]*?)```/)
        if (codeMatch) {
          return <CodeBlock key={idx} code={codeMatch[1]} />
        }

        const inlineParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
        return (
          <span key={idx}>
            {inlineParts.map((sub, subIdx) => {
              if (sub.startsWith("`") && sub.endsWith("`")) {
                return (
                  <code key={subIdx} className="bg-[#1a1a2e] text-[#a78bfa] px-1 py-0.5 rounded text-[10px] font-mono border border-violet-500/10">
                    {sub.slice(1, -1)}
                  </code>
                )
              }
              if (sub.startsWith("**") && sub.endsWith("**")) {
                return <strong key={subIdx} className="text-[#e4e4e7] font-semibold">{sub.slice(2, -2)}</strong>
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

 // main inspector panel
export default function ChatSidebar({ runData, chatMessages, setChatMessages, selectedBugIndex = null, onSelectBug }: ChatSidebarProps) {


  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)



  const [regressionsOpen, setRegressionsOpen] = useState(true)

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
    <aside className="w-[380px] border-l border-[#1f1f23]/60 bg-[#0a0a0b] flex flex-col shrink-0 min-h-0">

    {/* Inspector Header */}
      <div className="h-10 px-4  flex items-center justify-between shrink-0 bg-[#09090b]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-5.5 h-5.5 rounded-md bg-[#121215]  border-[#27272a] flex items-center justify-center p-0.5">
            <img src="/src/assets/hydralogo.png" className="w-full h-full object-contain" alt="Hydra Logo" />
          </div>
          <span className="text-[12px] font-semibold text-white tracking-wide">Hydra</span>
        </div>
      </div>

      {/* // Regression section */}
      <div className="border-b border-[#1f1f23]/60 shrink-0">
      
        <button
          onClick={() => setRegressionsOpen(!regressionsOpen)}
          className="w-full px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-[#111113]/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: regressionsOpen ? 0 : -90 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown className="size-3 text-[#52525b]" />
            </motion.div>
            <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-widest">
              Regressions
            </span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
            bugCount === 0
              ? "text-emerald-400 bg-emerald-500/8 border border-emerald-500/15"
              : "text-red-400 bg-red-500/8 border border-red-500/15"
          }`}>
            {bugCount}
          </span>
        </button>

        {/* // Bug List */}
        <AnimatePresence>
          {regressionsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="max-h-[220px] overflow-y-auto px-3 pb-3 flex flex-col gap-1.5">
                {bugCount === 0 ? (
                  <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/10 text-[11px] text-[#52525b]">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30 shrink-0" />
                    <span>No visual regressions detected</span>
                  </div>
                ) : (
                  runData.visualBugs.map((bug, index) => {
                    const isSelected = selectedBugIndex === index
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          onSelectBug?.(isSelected ? null : index)
                          setInput(`Explain Bug #${index + 1} ("${bug.element}") and give me the CSS fix.`)
                          inputRef.current?.focus()
                        }}
                        className={`w-full text-left group flex items-start gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/[0.06] border-indigo-500/20 shadow-sm shadow-indigo-500/5'
                            : 'bg-[#0d0d0f] border-[#1a1a1d] hover:border-[#2e2e32] hover:bg-[#111113]'
                        }`}
                      >
                        {/* Bug number */}
                        <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition-colors ${
                          isSelected
                            ? 'bg-red-500 text-white shadow-sm shadow-red-500/30'
                            : 'bg-red-500/15 text-red-400'
                        }`}>
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <code className="text-[10px] font-mono text-[#a1a1aa] truncate block">
                              {bug.element}
                            </code>
                            <span className={`shrink-0 text-[9px] flex items-center gap-0.5 transition-colors ${
                              isSelected ? 'text-indigo-400' : 'text-[#3f3f46] group-hover:text-[#71717a]'
                            }`}>
                              Ask <ChevronRight className="size-2.5" />
                            </span>
                          </div>
                          {bug.description && (
                            <p className="text-[10px] text-[#52525b] leading-snug line-clamp-2">{bug.description}</p>
                          )}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* // AI chat */}
      <div className="px-4 py-2 border-b border-[#1f1f23]/60 shrink-0">
        <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-widest">
           Analysis
        </span>
      </div>

{/* // chat messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 min-h-0">
        {chatMessages.map((msg, index) =>
          msg.sender === "user" ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-end"
            >
              <div className="max-w-[88%] bg-[#18181b] border border-[#2e2e32] rounded-xl rounded-tr-sm px-3.5 py-2.5 text-[11px] text-[#d4d4d8] leading-relaxed">
                {msg.text}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2.5 items-start"
            >
              <div className="size-5 rounded-md bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
               <img src="/src/assets/hydralogo.png" alt="" />
              </div>
              <div className="flex-1 min-w-0 text-[11px] text-[#a1a1aa] leading-relaxed">
                <FormattedMessage text={msg.text} />
              </div>
            </motion.div>
          )
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5 items-start">
            <div className="size-5 rounded-md bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <Loader2 className="size-2.5 text-violet-400 animate-spin" />
            </div>
            <div className="flex items-center gap-1 pt-1.5">
              <div className="w-32 h-3 rounded bg-[#1a1a1d] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2e2e32] to-transparent" style={{ animation: 'shimmer 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* ═══ INPUT ═══ */}
      <div className="px-3 py-3 border-t border-[#1f1f23]/60 shrink-0 bg-[#0a0a0b]">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#111113] border border-[#1f1f23] rounded-lg px-3 py-2 focus-within:border-[#2e2e32] focus-within:shadow-sm focus-within:shadow-violet-500/5 transition-all duration-200">
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={loading}
            onChange={e => setInput(e.target.value)}
            placeholder={loading ? "Analyzing…" : "Ask about this run…"}
            className="flex-1 bg-transparent text-[11px] text-[#d4d4d8] placeholder-[#3f3f46] outline-none min-w-0"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[8px] font-mono text-[#2e2e32] hidden sm:inline">⏎</span>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-1.5 text-[#525252] hover:text-violet-400 disabled:opacity-30 disabled:hover:text-[#525252] transition-colors cursor-pointer rounded hover:bg-violet-500/10"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        </form>
        <p className="text-[9px] text-[#2e2e32] mt-1.5 text-center font-mono">Hydra AI · Visual regression context</p>
      </div>

    </aside>
  )
}
