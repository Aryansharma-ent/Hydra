import { useState } from "react";
import { Copy, Monitor, Terminal as TerminalIcon, Check } from "lucide-react";

export default function Terminal() {
  const [activeTab, setActiveTab] = useState<"win" | "mac">("win");
  const [copied, setCopied] = useState(false);

  const command = "npx @itzaks/hydra-visual-cli";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-[#232336] bg-[#0D0D17] shadow-[0_15px_45px_rgba(0,0,0,0.45)] select-none">
      {/* Header Tabs */}
      <div className="flex h-10 items-center justify-between border-b border-[#232336] bg-[#090913]">
        <div className="flex h-full text-xs">
          <button
            onClick={() => setActiveTab("win")}
            className={`relative flex items-center gap-2 px-5 font-medium transition ${
              activeTab === "win" ? "text-white" : "text-[#737383] hover:text-white"
            }`}
          >
            <Monitor size={14} className={activeTab === "win" ? "fill-white" : ""} />
            Windows
            {activeTab === "win" && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#ff6437]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("mac")}
            className={`relative flex items-center gap-2 px-5 font-medium transition ${
              activeTab === "mac" ? "text-white" : "text-[#737383] hover:text-white"
            }`}
          >
            <TerminalIcon size={14} />
            macOS / Linux
            {activeTab === "mac" && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#ff6437]" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center justify-between p-5">
        <div className="font-mono text-sm leading-6">
          <div className="flex items-center">
            <span className="mr-3 text-[#ff6437]">$</span>
            <span className="text-[#E6E6F0]">
              npx <span className="text-[#82AAFF]">@itzaks/hydra-visual-cli</span>
            </span>
            <span className="ml-1.5 inline-block h-4 w-1.5 bg-[#ff6437] animate-pulse" />
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="rounded-lg bg-[#1A1A28] p-2 text-[#9A9AAA] transition hover:bg-[#232336] hover:text-white shrink-0 ml-4 flex items-center gap-1.5"
          title="Copy command"
        >
          {copied ? (
            <>
              <Check size={15} className="text-emerald-400" />
              <span className="text-[11px] font-sans text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <Copy size={15} />
          )}
        </button>
      </div>
    </div>
  );
}