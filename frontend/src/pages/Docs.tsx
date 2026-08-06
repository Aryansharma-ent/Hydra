import { useState } from "react";
import { Link } from "react-router-dom";
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
  Code2
} from "lucide-react";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeTab, setActiveTab] = useState<"npx" | "npm" | "github">("npx");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navItems = [
    {
      category: "Getting Started",
      items: [
        { id: "getting-started", label: "Introduction", icon: BookOpen },
        { id: "core-concepts", label: "Core Concepts", icon: Layers },
        { id: "architecture", label: "System Architecture", icon: Cpu },
      ]
    },
    {
      category: "CLI & Installation",
      items: [
        { id: "cli-usage", label: "CLI Specification", icon: Terminal },
        { id: "flag-reference", label: "Flag Reference", icon: Code2 },
      ]
    },
    {
      category: "CI/CD & Automation",
      items: [
        { id: "github-actions", label: "GitHub Actions", icon: GitBranch },
      ]
    },
    {
      category: "Hydra Pro",
      items: [
        { id: "auto-healing", label: "AI Auto-Healing Agent", icon: Sparkles },
      ]
    }
  ];

  const npxCommand = `npx --package=@itzaks/hydra-visual-cli hydra-visual-cli --project <YOUR_PROJECT_ID> --key <YOUR_API_KEY> --stagingUrl http://localhost:5173 --productionUrl https://your-app.com`;

  const npmCommand = `npm install --save-dev @itzaks/hydra-visual-cli

# Add to package.json scripts:
"scripts": {
  "test:visual": "hydra-visual-cli --project <YOUR_PROJECT_ID> --key <YOUR_API_KEY>"
}`;

  const githubYaml = `name: Hydra Visual Regression Scan & Auto-Healer

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

  return (
    <div className="min-h-screen w-screen bg-[#09090b] text-[#e4e4e7] flex flex-col font-sans select-none antialiased relative">
      
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full h-14 border-b border-[#1f1f23] bg-[#09090b]/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-violet-400" />
            <span className="text-[14px] font-bold tracking-widest text-white uppercase">Hydra</span>
          </Link>
          <span className="h-4 w-[1px] bg-[#27272a]" />
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            v1.0.5 Docs
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search documentation... (Ctrl + K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-4 bg-[#121215] border border-[#27272a] rounded-lg text-[12px] text-white placeholder-[#71717a] focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-4 text-[12px] font-medium">
          <Link to="/dashboard" className="text-[#a1a1aa] hover:text-white transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com/itzaks/hydra-visual-cli"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white transition-colors"
          >
            GitHub <ExternalLink className="size-3" />
          </a>
        </div>
      </header>

      {/* Main Documentation Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex z-10">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-[#1f1f23] p-6 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hidden md:block">
          <div className="flex flex-col gap-6">
            {navItems.map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h4 className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider px-2">
                  {group.category}
                </h4>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${
                          isActive
                            ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
                            : "text-[#a1a1aa] hover:bg-[#121215] hover:text-white"
                        }`}
                      >
                        <Icon className={`size-4 ${isActive ? "text-violet-400" : "text-[#71717a]"}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content Body */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-4xl">
          
          {/* Section: Getting Started */}
          {activeSection === "getting-started" && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Documentation</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">Introduction to Hydra</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed">
                  Hydra is an open-source visual regression testing platform engineered to detect, inspect, and automatically heal UI layout drifts between Staging and Production environments.
                </p>
              </div>

              {/* Quick Tabbed Setup Box */}
              <div className="flex flex-col border border-[#1f1f23] rounded-xl bg-[#0d0d0f] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f23] bg-[#121215]">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-violet-400" />
                    <span className="text-[12px] font-medium text-white">Quick Integration Guide</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
                    <button
                      onClick={() => setActiveTab("npx")}
                      className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                        activeTab === "npx" ? "bg-violet-600 text-white" : "text-[#71717a] hover:text-white"
                      }`}
                    >
                      npx
                    </button>
                    <button
                      onClick={() => setActiveTab("npm")}
                      className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                        activeTab === "npm" ? "bg-violet-600 text-white" : "text-[#71717a] hover:text-white"
                      }`}
                    >
                      npm package
                    </button>
                    <button
                      onClick={() => setActiveTab("github")}
                      className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                        activeTab === "github" ? "bg-violet-600 text-white" : "text-[#71717a] hover:text-white"
                      }`}
                    >
                      GitHub Actions
                    </button>
                  </div>
                </div>

                <div className="p-4 relative bg-[#09090b]">
                  <button
                    onClick={() => copyToClipboard(
                      activeTab === "npx" ? npxCommand : activeTab === "npm" ? npmCommand : githubYaml,
                      activeTab
                    )}
                    className="absolute top-4 right-4 p-2 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-[#a1a1aa] hover:text-white transition-all cursor-pointer"
                  >
                    {copiedCode === activeTab ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                  </button>
                  <pre className="font-mono text-[12px] text-[#e4e4e7] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {activeTab === "npx" && npxCommand}
                    {activeTab === "npm" && npmCommand}
                    {activeTab === "github" && githubYaml}
                  </pre>
                </div>
              </div>

              {/* Open Source vs Pro Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      Free Tier
                    </span>
                    <h3 className="text-[14px] font-semibold text-white">Open Source Core</h3>
                  </div>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    Unlimited visual regression scans, sub-pixel difference heatmaps, interactive web debugger, and standard CLI integrations.
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
                    Autonomous subagent scans component source files, applies Tailwind/CSS class repairs, and commits candidate fix branches automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Core Concepts */}
          {activeSection === "core-concepts" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Concepts</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">Core Concepts</h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed">
                  Learn how Hydra analyzes layout regressions, maps coordinates, and localized DOM elements.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-white">1. Dual Viewport Capture</h4>
                  <p className="text-[12px] text-[#a1a1aa]">
                    Puppeteer headless browsers launch in parallel to render Staging and Production URLs under identical viewport dimensions, freezing CSS animations and waiting for font stabilization.
                  </p>
                </div>

                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-white">2. Sub-Pixel Variance Analysis</h4>
                  <p className="text-[12px] text-[#a1a1aa]">
                    The Pixelmatch engine performs raw pixel comparisons, outputting a high-contrast diff heatmap image highlighting every offset pixel.
                  </p>
                </div>

                <div className="p-5 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-white">3. DOM Bounding Inspector</h4>
                  <p className="text-[12px] text-[#a1a1aa]">
                    Calculates bounding rect coordinates of visual diff regions and traces them back to exact HTML DOM selectors (`button.submit-btn`, `div.hero-card`).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Architecture */}
          {activeSection === "architecture" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Infrastructure</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Architecture</h1>
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
            </div>
          )}

          {/* Section: CLI Specification */}
          {activeSection === "cli-usage" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">CLI Reference</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">CLI Specification</h1>
                <p className="text-[14px] text-[#a1a1aa]">
                  Execute Hydra directly from your terminal or CI runner via <code className="text-violet-400 bg-violet-950/40 px-1.5 py-0.5 rounded">npx</code>.
                </p>
              </div>

              <div className="p-4 border border-[#1f1f23] rounded-xl bg-[#0d0d0f]">
                <pre className="font-mono text-[12px] text-emerald-400">
                  npx --package=@itzaks/hydra-visual-cli hydra-visual-cli --project &lt;PROJECT_ID&gt; --key &lt;API_KEY&gt;
                </pre>
              </div>
            </div>
          )}

          {/* Section: Flag Reference */}
          {activeSection === "flag-reference" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Reference</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">CLI Flag Reference</h1>
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
                      <td className="p-3 font-mono text-violet-400">--project, --projectId</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-semibold">Yes</span></td>
                      <td className="p-3 text-[#a1a1aa]">Target project identifier generated in Developer Settings.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-violet-400">--key, --apiKey</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-semibold">Yes</span></td>
                      <td className="p-3 text-[#a1a1aa]">Secure API key associated with the target project.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-violet-400">--stagingUrl</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-[#18181b] text-[#71717a] rounded text-[10px]">Optional</span></td>
                      <td className="p-3 text-[#a1a1aa]">Override staging URL for dynamic PR preview deployments.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-violet-400">--productionUrl</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-[#18181b] text-[#71717a] rounded text-[10px]">Optional</span></td>
                      <td className="p-3 text-[#a1a1aa]">Override production baseline URL for benchmark comparison.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: GitHub Actions */}
          {activeSection === "github-actions" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">CI/CD</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">GitHub Actions Integration</h1>
                <p className="text-[14px] text-[#a1a1aa]">
                  Add Hydra to your GitHub Actions workflow to run automated visual checks on every Pull Request.
                </p>
              </div>

              <div className="p-4 border border-[#1f1f23] rounded-xl bg-[#0d0d0f] relative">
                <pre className="font-mono text-[11px] text-[#e4e4e7] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {githubYaml}
                </pre>
              </div>
            </div>
          )}

          {/* Section: AI Auto-Healing */}
          {activeSection === "auto-healing" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-widest">Hydra Pro</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">AI Auto-Healing Agent</h1>
                <p className="text-[14px] text-[#a1a1aa]">
                  The Auto-Healing Subagent automatically detects visual bugs, locates component files in your repo, applies Tailwind class swaps, and commits a candidate fix branch.
                </p>
              </div>

              <div className="p-5 border border-violet-500/30 rounded-xl bg-violet-950/15 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-violet-400" />
                  <h4 className="text-[14px] font-semibold text-white">Candidate Branch Protection</h4>
                </div>
                <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                  Auto-Healing never pushes directly to <code className="text-violet-300">main</code> or <code className="text-violet-300">master</code>. It switches to candidate branch <code className="text-violet-300">hydra-fix/layout-regressions</code> and commits a clean patch for team code review.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
