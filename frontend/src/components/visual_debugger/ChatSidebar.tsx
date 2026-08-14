import { Send, Loader2, ChevronRight, ChevronDown, Copy, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { API_BASE_URL } from "@/config/api"
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

/* ═══ Tokenizer & Syntax Highlighter ═══ */
function highlightCode(code: string, lang: string) {
  const lines = code.split("\n")

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim()

    // 1. Full-line comments
    if (trimmed.startsWith("/*") || trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("#")) {
      return (
        <div key={lineIdx} className="text-[#52525b] italic">
          {line}
        </div>
      )
    }

    // 2. Separate code from inline/trailing comments
    let codePart = line
    let commentPart = ""

    if (line.includes("/*")) {
      const idx = line.indexOf("/*")
      codePart = line.substring(0, idx)
      commentPart = line.substring(idx)
    } else if (line.includes("//")) {
      const idx = line.indexOf("//")
      codePart = line.substring(0, idx)
      commentPart = line.substring(idx)
    }

    // 3. CSS property: value syntax
    if (codePart.includes(":") && !codePart.includes("http") && !codePart.includes("?")) {
      const colonIdx = codePart.indexOf(":")
      const prop = codePart.substring(0, colonIdx)
      const rest = codePart.substring(colonIdx) // : value;

      let valText = rest
      let importantText = ""

      if (rest.includes("!important")) {
        const impIdx = rest.indexOf("!important")
        valText = rest.substring(0, impIdx)
        importantText = "!important" + rest.substring(impIdx + 10)
      }

      return (
        <div key={lineIdx}>
          <span className="text-[#9cdcfe] font-medium">{prop}</span>
          <span className="text-[#d4d4d8]">:</span>
          <span className="text-[#ce9178]">{valText.slice(1)}</span>
          {importantText && <span className="text-rose-400 font-semibold">{importantText}</span>}
          {commentPart && <span className="text-[#52525b] italic">{commentPart}</span>}
        </div>
      )
    }

    // 4. CSS selector rule start (e.g. div.hero-card {)
    if (codePart.includes("{")) {
      const braceIdx = codePart.indexOf("{")
      const selector = codePart.substring(0, braceIdx)
      return (
        <div key={lineIdx}>
          <span className="text-[#d7ba7d] font-semibold">{selector}</span>
          <span className="text-[#d4d4d8]">{codePart.substring(braceIdx)}</span>
          {commentPart && <span className="text-[#52525b] italic">{commentPart}</span>}
        </div>
      )
    }

    // 5. Closing brace / structure
    if (trimmed === "}" || trimmed === "};" || trimmed === "],") {
      return (
        <div key={lineIdx}>
          <span className="text-[#d4d4d8]">{codePart}</span>
          {commentPart && <span className="text-[#52525b] italic">{commentPart}</span>}
        </div>
      )
    }

    // 6. Default fallback line
    return (
      <div key={lineIdx}>
        <span className="text-[#e4e4e7]">{codePart}</span>
        {commentPart && <span className="text-[#52525b] italic">{commentPart}</span>}
      </div>
    )
  })
}

/* ═══ Code Block Component ═══ */
function CodeBlock({ code, language = "css" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const langMap: Record<string, string> = {
    css: "CSS",
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    html: "HTML",
    json: "JSON",
    cpp: "C++",
    c: "C",
    py: "Python",
    python: "Python",
    sh: "Bash",
    bash: "Bash",
  }

  const displayLang = langMap[language.toLowerCase()] || (language ? language.toUpperCase() : "Code")

  return (
    <div className="my-3 rounded-xl border border-[#1f1f23] bg-[#08080a] shadow-xl overflow-hidden text-[11px] group select-text">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-[#1f1f23] bg-[#111114] select-none">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet-500/80" />
          <span className="text-[10px] font-semibold text-[#a1a1aa] tracking-wider uppercase font-mono-code">
            {displayLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-medium text-[#a1a1aa] hover:text-white transition-all cursor-pointer rounded-md px-2 py-0.5 hover:bg-[#1f1f23] active:scale-95"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3 text-[#71717a]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with horizontal scroll & syntax highlighting */}
      <div className="p-4 overflow-x-auto font-mono-code leading-[1.7] text-[#e4e4e7] bg-[#08080a] scrollbar-thin">
        <pre className="font-mono-code text-[11px] whitespace-pre">
          {highlightCode(code.trim(), language)}
        </pre>
      </div>
    </div>
  )
}

/* ═══ Markdown Message Formatter ═══ */
function FormattedMessage({ text }: { text: string }) {
  // Regex to split code blocks (fenced with ```) from plain text
  const parts = text.split(/(```[\s\S]*?```)/g)

  return (
    <div className="flex flex-col gap-2 text-[12px] leading-relaxed text-[#d4d4d8]">
      {parts.map((part, idx) => {
        // Extract language and code body from markdown code block
        const codeMatch = part.match(/^```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```$/)
        if (codeMatch) {
          const lang = codeMatch[1].trim() || "css"
          const codeContent = codeMatch[2]
          return <CodeBlock key={idx} code={codeContent} language={lang} />
        }

        if (!part.trim()) return null

        // Parse inline formatting: `code`, **bold**, lists, and line breaks
        const lines = part.split("\n")

        return (
          <div key={idx} className="flex flex-col gap-1">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1.5" />

              const isListItem = line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\.\s/.test(line.trim())
              
              const inlineParts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)

              return (
                <div key={lIdx} className={`${isListItem ? "pl-2 flex items-start gap-1.5" : ""}`}>
                  {isListItem && <span className="text-violet-400 font-bold text-[10px] select-none mt-0.5">•</span>}
                  <span className="flex-1">
                    {inlineParts.map((sub, subIdx) => {
                      if (sub.startsWith("`") && sub.endsWith("`")) {
                        return (
                          <code key={subIdx} className="bg-[#18181b] text-violet-300 px-1.5 py-0.5 rounded text-[11px] font-mono-code border border-[#27272a] mx-0.5 shadow-sm">
                            {sub.slice(1, -1)}
                          </code>
                        )
                      }
                      if (sub.startsWith("**") && sub.endsWith("**")) {
                        return <strong key={subIdx} className="text-white font-semibold">{sub.slice(2, -2)}</strong>
                      }
                      return sub
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
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
        `${API_BASE_URL}/api/tests/run/${runData._id}/chat`,
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
            <img src="/hydralogo.png" className="w-full h-full object-contain" alt="Hydra Logo" />
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
               <img src="/hydralogo.png" alt="" />
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
