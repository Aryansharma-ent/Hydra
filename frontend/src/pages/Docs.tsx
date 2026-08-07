import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldCheck,
  Search,
  Terminal,
  Copy,
  Check,
  GitBranch,
  ExternalLink,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  Code2,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CornerDownLeft,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Stand-in for react-router-dom's <Link> so this preview has no router
// dependency. The real Docs.tsx file uses the actual Link/useSearchParams.
function Link({ to, className, children }) {
  return (
    <a href={to} className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}

const NAV = [
  {
    category: "Getting Started",
    items: [
      { id: "getting-started", label: "Introduction", icon: BookOpen, keywords: "install quick start overview" },
      { id: "core-concepts", label: "Core Concepts", icon: Layers, keywords: "capture diff heatmap dom selector" },
      { id: "architecture", label: "System Architecture", icon: Cpu, keywords: "pipeline pixelmatch stages" },
    ],
  },
  {
    category: "CLI & Installation",
    items: [
      { id: "cli-usage", label: "CLI Specification", icon: Terminal, keywords: "npx command terminal run" },
      { id: "flag-reference", label: "Flag Reference", icon: Code2, keywords: "flags project key stagingurl productionurl" },
    ],
  },
  {
    category: "CI/CD & Automation",
    items: [
      { id: "github-actions", label: "GitHub Actions", icon: GitBranch, keywords: "ci workflow yaml pull request secrets" },
    ],
  },
  {
    category: "Hydra Pro",
    items: [
      { id: "auto-healing", label: "AI Auto-Healing Agent", icon: Sparkles, keywords: "pro agent fix branch commit" },
    ],
  },
];

const FLAT_NAV = NAV.flatMap((group) => group.items.map((item) => ({ ...item, category: group.category })));

const NPX_COMMAND = `npx --package=@itzaks/hydra-visual-cli hydra-visual-cli --project <YOUR_PROJECT_ID> --key <YOUR_API_KEY> --stagingUrl http://localhost:5173 --productionUrl https://your-app.com`;

const NPM_COMMAND = `npm install --save-dev @itzaks/hydra-visual-cli

# Add to package.json scripts:
"scripts": {
  "test:visual": "hydra-visual-cli --project <YOUR_PROJECT_ID> --key <YOUR_API_KEY>"
}`;

const GITHUB_YAML = `name: Hydra Visual Regression Scan & Auto-Healer

on:
  pull_request:
    branches: [ main, dev ]

permissions:
  contents: write # Required for Auto-Healing candidate branch commits

jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Hydra Visual Inspection
        run: npx --package=@itzaks/hydra-visual-cli hydra-visual-cli --project \${{ secrets.HYDRA_PROJECT_ID }} --key \${{ secrets.HYDRA_API_KEY }} --stagingUrl \${{ steps.preview.outputs.url }} --productionUrl https://your-app.com
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}`;

const EXAMPLE_OUTPUT = `✓ Captured staging   (http://localhost:5173)
✓ Captured production (https://your-app.com)
✓ Compared 18 viewports

⚠ 2 regions changed
  › button.submit-btn      3.2% pixel drift
  › div.hero-card          0.4% pixel drift

Report: https://app.hydra.dev/runs/8f2a1c`;

function CodeBlock({ id, code, copiedId, onCopy }) {
  return (
    <div className="relative rounded-xl border border-[#1f1f23] bg-[#09090b]">
      <button
        onClick={() => onCopy(code, id)}
        aria-label="Copy code"
        className="absolute top-3 right-3 p-2 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-[#a1a1aa] hover:text-white transition-all cursor-pointer"
      >
        {copiedId === id ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      </button>
      <pre className="p-4 pr-12 font-mono text-[12px] text-[#e4e4e7] overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function CommandPalette({ open, query, onQueryChange, results, activeIndex, setActiveIndex, onSelect, onClose, inputRef }) {
  if (!open) return null;

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) onSelect(item.id);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="Search documentation"
        className="w-full max-w-lg rounded-2xl border border-[#27272a] bg-[#0d0d0f] shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f23]">
          <span className="font-mono text-[13px] text-violet-400 select-none">hydra&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search docs..."
            className="flex-1 bg-transparent font-mono text-[13px] text-white placeholder-[#52525b] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-[#71717a] hover:text-white transition-colors" aria-label="Close search">
            <X className="size-3.5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-6 text-center text-[12px] text-[#71717a]">No matches for "{query}".</p>
          )}
          {results.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                  isActive ? "bg-violet-600/15 text-white" : "text-[#a1a1aa]"
                }`}
              >
                <Icon className={`size-4 shrink-0 ${isActive ? "text-violet-400" : "text-[#71717a]"}`} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] text-[#52525b] uppercase tracking-wide">{item.category}</span>
                {isActive && <CornerDownLeft className="size-3.5 text-violet-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeTab, setActiveTab] = useState("npx");
  const [copiedCode, setCopiedCode] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [feedback, setFeedback] = useState({});

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const paletteInputRef = useRef(null);
  const mainRef = useRef(null);

  const currentIndex = FLAT_NAV.findIndex((item) => item.id === activeSection);
  const current = FLAT_NAV[currentIndex];
  const prevItem = currentIndex > 0 ? FLAT_NAV[currentIndex - 1] : null;
  const nextItem = currentIndex < FLAT_NAV.length - 1 ? FLAT_NAV[currentIndex + 1] : null;

  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return FLAT_NAV;
    return FLAT_NAV.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [paletteQuery]);

  useEffect(() => setPaletteIndex(0), [paletteQuery, paletteOpen]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeSection]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setMobileNavOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (paletteOpen) paletteInputRef.current?.focus();
  }, [paletteOpen]);

  function copyToClipboard(text, id) {
    navigator.clipboard?.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function selectSection(id) {
    setActiveSection(id);
    setPaletteOpen(false);
    setPaletteQuery("");
    setMobileNavOpen(false);
  }

  function giveFeedback(id, value) {
    setFeedback((f) => ({ ...f, [id]: value }));
  }

  function renderNav(closeOnSelect) {
    return (
      <div className="flex flex-col gap-6">
        {NAV.map((group) => (
          <div key={group.category} className="flex flex-col gap-2">
            <h4 className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider px-2">{group.category}</h4>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      selectSection(item.id);
                      if (closeOnSelect) setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
                        : "text-[#a1a1aa] hover:bg-[#121215] hover:text-white"
                    }`}
                  >
                    <Icon className={`size-4 shrink-0 ${isActive ? "text-violet-400" : "text-[#71717a]"}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#e4e4e7] flex flex-col font-sans antialiased relative">
      <style>{`
        @keyframes hydra-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .hydra-cursor { animation: hydra-blink 1s step-end infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hydra-cursor { animation: none; }
        }
      `}</style>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <CommandPalette
        open={paletteOpen}
        query={paletteQuery}
        onQueryChange={setPaletteQuery}
        results={paletteResults}
        activeIndex={paletteIndex}
        setActiveIndex={setPaletteIndex}
        onSelect={selectSection}
        onClose={() => setPaletteOpen(false)}
        inputRef={paletteInputRef}
      />

      <header className="sticky top-0 z-30 w-full h-14 border-b border-[#1f1f23] bg-[#09090b]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-1.5 -ml-1.5 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="size-5 text-violet-400" />
            <span className="text-[14px] font-bold tracking-widest text-white uppercase">
              Hydra<span className="text-violet-400 hydra-cursor">_</span>
            </span>
          </Link>
          <span className="h-4 w-[1px] bg-[#27272a] hidden sm:block" />
          <span className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            v1.0.5 Docs
          </span>
        </div>

        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 w-full max-w-xs md:w-80 h-8 px-3 bg-[#121215] border border-[#27272a] rounded-lg text-[12px] text-[#71717a] hover:border-violet-500/40 hover:text-[#a1a1aa] transition-all cursor-pointer"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Search documentation...</span>
          <span className="px-1.5 py-0.5 rounded border border-[#27272a] text-[10px] font-mono">⌘K</span>
        </button>

        <div className="flex items-center gap-3 md:gap-4 text-[12px] font-medium shrink-0">
          <button
            onClick={() => setPaletteOpen(true)}
            className="sm:hidden p-1.5 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            aria-label="Search documentation"
          >
            <Search className="size-4" />
          </button>
          <Link to="/dashboard" className="hidden sm:inline text-[#a1a1aa] hover:text-white transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com/itzaks/hydra-visual-cli"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">GitHub</span> <ExternalLink className="size-3" />
          </a>
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto flex z-10 relative">
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 bg-[#09090b] border-r border-[#1f1f23] p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">Navigate</span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 text-[#71717a] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X className="size-4" />
                </button>
              </div>
              {renderNav(true)}
            </aside>
          </div>
        )}

        <aside className="w-64 border-r border-[#1f1f23] p-6 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hidden md:block">
          {renderNav(false)}
        </aside>

        <main ref={mainRef} className="flex-1 p-6 md:p-12 overflow-y-auto max-w-4xl scroll-smooth">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#71717a] mb-6">
            <span>Docs</span>
            <ChevronRight className="size-3" />
            <span>{current?.category}</span>
            <ChevronRight className="size-3" />
            <span className="text-[#e4e4e7]">{current?.label}</span>
          </nav>

          {activeSection === "getting-started" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Documentation</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">Introduction to Hydra</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  Hydra is an open-source visual regression testing platform. It compares your Staging and
                  Production environments pixel by pixel, tells you exactly which elements drifted, and — on the
                  Pro tier — proposes a fix.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { step: "1. Capture", detail: "Headless browsers screenshot both environments under identical viewports." },
                  { step: "2. Compare", detail: "Pixelmatch highlights every pixel that moved between the two." },
                  { step: "3. Report", detail: "Diffs map back to real DOM selectors you can act on immediately." },
                ].map((s) => (
                  <div key={s.step} className="p-4 border border-[#1f1f23] rounded-xl bg-[#0d0d0f]">
                    <p className="text-[13px] font-semibold text-white">{s.step}</p>
                    <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">{s.detail}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 border border-violet-500/20 rounded-xl bg-violet-950/10 flex flex-col sm:flex-row gap-2 sm:gap-4">
                <span className="text-[12px] font-semibold text-violet-300 shrink-0">Prerequisites</span>
                <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                  Node.js 18 or later, a project created in the Hydra dashboard, and a Staging URL you can reach
                  from wherever the scan runs.
                </p>
              </div>

              <div className="flex flex-col border border-[#1f1f23] rounded-xl bg-[#0d0d0f] overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-b border-[#1f1f23] bg-[#121215]">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-violet-400" />
                    <span className="text-[12px] font-medium text-white">Quick Integration Guide</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-lg border border-[#27272a] w-fit">
                    {["npx", "npm", "github"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                          activeTab === tab ? "bg-violet-600 text-white" : "text-[#71717a] hover:text-white"
                        }`}
                      >
                        {tab === "npx" ? "npx" : tab === "npm" ? "npm package" : "GitHub Actions"}
                      </button>
                    ))}
                  </div>
                </div>

                <CodeBlock
                  id={activeTab}
                  code={activeTab === "npx" ? NPX_COMMAND : activeTab === "npm" ? NPM_COMMAND : GITHUB_YAML}
                  copiedId={copiedCode}
                  onCopy={copyToClipboard}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      Free Tier
                    </span>
                    <h3 className="text-[14px] font-semibold text-white">Open Source Core</h3>
                  </div>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    Unlimited visual regression scans, sub-pixel difference heatmaps, an interactive web debugger,
                    and standard CLI integrations.
                  </p>
                </div>

                <div className="p-5 border border-violet-500/30 rounded-xl bg-violet-950/10 flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded-full flex items-center gap-1">
                      <Sparkles className="size-3 text-violet-400" /> Pro Tier
                    </span>
                    <h3 className="text-[14px] font-semibold text-white">AI Auto-Healing Agent</h3>
                  </div>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    Autonomous subagent scans component source files, applies Tailwind/CSS class repairs, and
                    commits candidate fix branches automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "core-concepts" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Concepts</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">Core Concepts</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  Three ideas explain almost everything Hydra does: how it captures both environments fairly, how
                  it decides what actually changed, and how it turns a diff into something you can click on.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-white">1. Dual Viewport Capture</h4>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    Puppeteer headless browsers launch in parallel to render Staging and Production under identical
                    viewport dimensions, freezing CSS animations and waiting for font stabilization.
                  </p>
                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    Why it matters: without this, a flickering animation or a late-loading font would look like a
                    false regression.
                  </p>
                </div>

                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span className="size-1.5 rounded-full bg-red-400" />
                    <span className="text-[10px] text-[#71717a] uppercase tracking-wide">Diff heatmap</span>
                  </div>
                  <h4 className="text-[14px] font-semibold text-white">2. Sub-Pixel Variance Analysis</h4>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    The Pixelmatch engine performs raw pixel comparisons, outputting a high-contrast diff heatmap
                    that highlights every offset pixel.
                  </p>
                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    Why it matters: a heatmap shows you the shape of the change at a glance, before you read a
                    single selector.
                  </p>
                </div>

                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-white">3. DOM Bounding Inspector</h4>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    Bounding-rect coordinates of each diff region are traced back to exact HTML DOM selectors, like{" "}
                    <code className="text-violet-300 bg-violet-950/40 px-1 py-0.5 rounded">button.submit-btn</code>{" "}
                    or <code className="text-violet-300 bg-violet-950/40 px-1 py-0.5 rounded">div.hero-card</code>.
                  </p>
                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    Why it matters: you jump straight to the element that changed instead of hunting through a
                    screenshot.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "architecture" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Infrastructure</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Architecture</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  Every run moves through the same four stages. The first three run on every plan; the last is
                  exclusive to Hydra Pro.
                </p>
              </div>

              <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f]">
                <pre className="font-mono text-[11px] text-violet-300 overflow-x-auto leading-relaxed">
{`                        HYDRA PIPELINE ARCHITECTURE
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          ▼                                                     ▼
 Staging Screenshot                                   Production Screenshot
(Puppeteer Headless)                                  (Puppeteer Headless)
          │                                                     │
          └──────────────────────────┬──────────────────────────┘
                                     ▼
                         Pixelmatch Analysis Engine
                        (Sub-Pixel Variance & Heatmap)
                                     │
                                     ▼
                        DOM Boundary Mapping Engine
                       (Element Bounding Coordinates)
                                     │
                                     ▼ (Pro Tier)
                      Automated Remediation Agent
                  (Class Swapper & Git Branch Commit)`}
                </pre>
              </div>

              <p className="text-[12px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                The two capture stages run side by side so both screenshots reflect the same moment in time. Their
                output feeds the Pixelmatch engine, which produces the heatmap described in Core Concepts. The DOM
                Boundary Mapping stage then converts that heatmap into selectors your team can search for. On Pro
                plans, the Remediation Agent takes those selectors and attempts a fix — see AI Auto-Healing Agent
                for how that stays safe to run unattended.
              </p>
            </div>
          )}

          {activeSection === "cli-usage" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">CLI Reference</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">CLI Specification</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  Run Hydra directly from your terminal or from a CI runner via{" "}
                  <code className="text-violet-400 bg-violet-950/40 px-1.5 py-0.5 rounded">npx</code>. No global
                  install is required.
                </p>
              </div>

              <CodeBlock id="cli-run" code={NPX_COMMAND} copiedId={copiedCode} onCopy={copyToClipboard} />

              <div className="flex flex-col gap-2">
                <p className="text-[12px] font-semibold text-white">Example output</p>
                <CodeBlock id="cli-output" code={EXAMPLE_OUTPUT} copiedId={copiedCode} onCopy={copyToClipboard} />
                <p className="text-[11px] text-[#71717a] leading-relaxed">
                  Every flagged region links to the full report, including the heatmap and the matching DOM
                  selector. See Flag Reference for the options used above.
                </p>
              </div>
            </div>
          )}

          {activeSection === "flag-reference" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Reference</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">CLI Flag Reference</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  Two flags are required on every run; the URL overrides are optional and mainly useful for
                  per-PR preview deployments.
                </p>
              </div>

              <div className="border border-[#1f1f23] rounded-xl overflow-hidden bg-[#0d0d0f]">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-[#1f1f23] bg-[#121215] text-[#a1a1aa]">
                      <th className="p-3 font-semibold">Flag</th>
                      <th className="p-3 font-semibold">Required</th>
                      <th className="p-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f23] text-[#e4e4e7]">
                    <tr>
                      <td className="p-3 font-mono text-violet-400 whitespace-nowrap">--project, --projectId</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-semibold">Yes</span>
                      </td>
                      <td className="p-3 text-[#a1a1aa]">Target project identifier generated in Developer Settings.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-violet-400 whitespace-nowrap">--key, --apiKey</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-semibold">Yes</span>
                      </td>
                      <td className="p-3 text-[#a1a1aa]">Secure API key associated with the target project.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-violet-400 whitespace-nowrap">--stagingUrl</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#18181b] text-[#71717a] rounded text-[10px]">Optional</span>
                      </td>
                      <td className="p-3 text-[#a1a1aa]">Override staging URL for dynamic PR preview deployments.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-violet-400 whitespace-nowrap">--productionUrl</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#18181b] text-[#71717a] rounded text-[10px]">Optional</span>
                      </td>
                      <td className="p-3 text-[#a1a1aa]">Override production baseline URL for benchmark comparison.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "github-actions" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">CI/CD</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">GitHub Actions Integration</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  Add Hydra to your workflow to run a visual check on every pull request, using the same flags
                  covered in the CLI Specification.
                </p>
              </div>

              <CodeBlock id="gh-actions" code={GITHUB_YAML} copiedId={copiedCode} onCopy={copyToClipboard} />

              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-semibold text-white">Repository secrets used above</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "HYDRA_PROJECT_ID", detail: "Same value as --project on the CLI." },
                    { name: "HYDRA_API_KEY", detail: "Same value as --key on the CLI." },
                    { name: "GEMINI_API_KEY", detail: "Powers the Pro Auto-Healing agent, if enabled." },
                  ].map((s) => (
                    <div key={s.name} className="p-3 border border-[#1f1f23] rounded-lg bg-[#0d0d0f]">
                      <p className="font-mono text-[11px] text-violet-300">{s.name}</p>
                      <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">{s.detail}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#71717a] leading-relaxed">
                  The workflow requests <code className="text-violet-300 bg-violet-950/40 px-1 py-0.5 rounded">contents: write</code>{" "}
                  permission specifically so the Auto-Healing agent can push its candidate branch — see AI
                  Auto-Healing Agent for what that branch contains.
                </p>
              </div>
            </div>
          )}

          {activeSection === "auto-healing" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Hydra Pro</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">AI Auto-Healing Agent</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed max-w-2xl">
                  The Auto-Healing subagent detects a visual bug, locates the component file responsible, applies
                  a Tailwind class swap, and commits a candidate fix branch for review.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { step: "1. Detect", detail: "Flagged regions from the current scan are queued for remediation." },
                  { step: "2. Locate", detail: "The agent traces each DOM selector back to its source component." },
                  { step: "3. Repair", detail: "A minimal class-level patch is generated for the affected element." },
                  { step: "4. Commit", detail: "The patch is committed to a candidate branch, never to main." },
                ].map((s) => (
                  <div key={s.step} className="p-4 border border-[#1f1f23] rounded-xl bg-[#0d0d0f]">
                    <p className="text-[13px] font-semibold text-white">{s.step}</p>
                    <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">{s.detail}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 border border-violet-500/30 rounded-xl bg-violet-950/15 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-violet-400" />
                  <h4 className="text-[14px] font-semibold text-white">Candidate Branch Protection</h4>
                </div>
                <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                  Auto-Healing never pushes directly to <code className="text-violet-300">main</code> or{" "}
                  <code className="text-violet-300">master</code>. It switches to candidate branch{" "}
                  <code className="text-violet-300">hydra-fix/layout-regressions</code> and commits a clean patch
                  for your team to review before merging.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-[#1f1f23] flex items-center justify-between flex-wrap gap-3">
            <p className="text-[12px] text-[#71717a]">Was this page helpful?</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => giveFeedback(activeSection, "up")}
                aria-label="This page was helpful"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  feedback[activeSection] === "up"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "border-[#27272a] text-[#71717a] hover:text-white"
                }`}
              >
                <ThumbsUp className="size-3.5" />
              </button>
              <button
                onClick={() => giveFeedback(activeSection, "down")}
                aria-label="This page needs work"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  feedback[activeSection] === "down"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "border-[#27272a] text-[#71717a] hover:text-white"
                }`}
              >
                <ThumbsDown className="size-3.5" />
              </button>
            </div>
          </div>
          {feedback[activeSection] && (
            <p className="mt-2 text-[11px] text-[#71717a]">Thanks — that helps us improve these docs.</p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            {prevItem ? (
              <button
                onClick={() => selectSection(prevItem.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1f1f23] text-[12px] text-[#a1a1aa] hover:text-white hover:border-[#27272a] transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> {prevItem.label}
              </button>
            ) : (
              <span />
            )}
            {nextItem && (
              <button
                onClick={() => selectSection(nextItem.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1f1f23] text-[12px] text-[#a1a1aa] hover:text-white hover:border-[#27272a] transition-colors cursor-pointer ml-auto"
              >
                {nextItem.label} <ArrowRight className="size-3.5" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}