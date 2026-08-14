import Sidebar from "@/components/Dashboard/SideBar"
import TopBar from "@/components/Dashboard/TopBar"
import { Copy, Key, Terminal, AlertTriangle, Check, Loader2, Eye, EyeOff, ShieldCheck, GitBranch, ChevronDown, Cpu, LockKeyhole, GitPullRequest } from "lucide-react"
import axios from 'axios'
import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { type Project } from "../types"
import { API_BASE_URL } from "@/config/api"

export default function Settings() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const targetProjectId = params.projectId || searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copiedKey, selectCopiedKey] = useState<boolean>(false)
  const [copiedYaml, selectCopiedYaml] = useState<boolean>(false)
  const [generating, setGenerating] = useState<boolean>(false)
  const [keyVisible, setKeyVisible] = useState<boolean>(false)

  const [geminiKeyInput, setGeminiKeyInput] = useState<string>("");
  const [geminiKeyVisible, setGeminiKeyVisible] = useState<boolean>(false);
  const [savingGeminiKey, setSavingGeminiKey] = useState<boolean>(false);
  const [savedGeminiKey, setSavedGeminiKey] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProject) {
      setGeminiKeyInput(selectedProject.geminiApiKey || "");
    }
  }, [selectedProject]);

  const handleSaveGeminiKey = async () => {
    if (!selectedProject) return;
    setSavingGeminiKey(true);
    try {
      const token = localStorage.getItem("hydra_token");
      const res = await axios.post(
        `${API_BASE_URL}/api/projects/${selectedProject._id}/gemini-key`,
        { geminiApiKey: geminiKeyInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProjects(prev =>
          prev.map(p => (p._id === selectedProject._id ? { ...p, geminiApiKey: geminiKeyInput } : p))
        );
        setSelectedProject(prev => (prev ? { ...prev, geminiApiKey: geminiKeyInput } : null));
        setSavedGeminiKey(true);
        setTimeout(() => setSavedGeminiKey(false), 2000);
      }
    } catch (err) {
      console.error("Error saving Gemini API Key", err);
    } finally {
      setSavingGeminiKey(false);
    }
  };

  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem("hydra_token");
        const res = await axios.get(`${API_BASE_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.data.success && res.data.data.length > 0) {
          setProjects(res.data.data);
          const matched = targetProjectId
            ? res.data.data.find((p: Project) => p._id === targetProjectId)
            : null;
          setSelectedProject(matched || res.data.data[0]);
        }
      } catch (error) {
        console.log("Error fetching the projects", error)
      }
    }
    getProjects()
  }, [targetProjectId])

  let newKey = selectedProject?.apikey
  const handleGenerateKey = async () => {
    if (!selectedProject) return;
    setGenerating(true)
    try {
      const token = localStorage.getItem("hydra_token");
      const res = await axios.post(
        `${API_BASE_URL}/api/projects/${selectedProject._id}/generate-key`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (res.data.success) {
        newKey = res.data.data
      }
      setProjects(prevProjects =>
        prevProjects.map(proj =>
          proj._id === selectedProject?._id
            ? { ...proj, apikey: newKey }
            : proj
        )
      );
      setSelectedProject(prev => prev ? { ...prev, apikey: newKey } : null);
    } catch (error) {
      console.log("error fetching the api key generated", error)
    } finally {
      setGenerating(false)
    }
  }

  const copyKey = () => {
    if (!selectedProject?.apikey) return;
    navigator.clipboard.writeText(selectedProject.apikey);
    selectCopiedKey(true);
    setTimeout(() => selectCopiedKey(false), 2000);
  };

  const copyYaml = () => {
    navigator.clipboard.writeText(githubActionsYaml);
    selectCopiedYaml(true);
    setTimeout(() => selectCopiedYaml(false), 2000);
  };

  // Mask the key — show first 8 + dots + last 4
  const maskedKey = (key: string) => {
    if (key.length <= 12) return '•'.repeat(key.length)
    return key.substring(0, 8) + '••••••••••••••••••••' + key.slice(-4)
  }

  const currentUser = JSON.parse(localStorage.getItem("hydra_user") || "{}");
  const isPro = currentUser?.tier === 'PRO' || selectedProject?.tier === 'PRO';
  const hasCustomGemini = Boolean(selectedProject?.geminiApiKey);
  const showGeminiEnv = isPro || hasCustomGemini;

  const githubActionsYaml = `name: Hydra Visual Regression Checks

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]
${isPro ? `
# Grant write permissions so the Auto-Healing Subagent can push candidate fix branches
permissions:
  contents: write
` : ""}
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
${isPro ? `        with:
          fetch-depth: 0
` : ""}
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: ${isPro ? "Run Hydra AI Visual Scan & Auto-Healer" : "Run Hydra AI Visual Scan"}
        run: node spectre-cli.js --project ${selectedProject?._id || "<PROJECT_ID>"} --key \${{ secrets.HYDRA_API_KEY }}${hasCustomGemini ? ` --geminiKey \${{ secrets.GEMINI_API_KEY }}` : ""}${showGeminiEnv ? `
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}` : ""}
`;

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#c9d1d9] overflow-hidden font-sans select-none antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-8">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-[#71717a]" />
                <h1 className="text-sm font-semibold text-[#e4e4e7] tracking-tight">Developer Settings</h1>
              </div>
              <p className="text-[11px] text-[#52525b] ml-6.5">
                Manage API credentials and CI/CD pipeline configuration for this workspace.
              </p>
            </div>

            {/* ── Project selector ────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">
                Project
              </label>
              <div className="relative w-full max-w-sm">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#52525b] pointer-events-none" />
                <select
                  className="w-full bg-[#0d0d0f] border border-[#1f1f23] text-[12px] text-[#d4d4d8] rounded-md pl-8 pr-8 py-2 outline-none focus:border-[#3f3f46] transition-colors font-mono appearance-none cursor-pointer"
                  value={selectedProject?._id || ""}
                  onChange={(e) => {
                    const matched = projects.find(p => p._id === e.target.value);
                    if (matched) {
                      setSelectedProject(matched);
                      navigate(`/projects/${matched._id}/settings`);
                    }
                  }}
                >
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#52525b] pointer-events-none" />
              </div>
            </div>

            {/* ── Divider ─────────────────────────────────────────────── */}
            <div className="border-t border-[#1a1a1d]" />

            {/* ── API Credentials Section ──────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-widest font-mono-code">Credentials & AI Key</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* ─── API Key Card ──────────────────────────────────────── */}
                <div className="rounded-xl border border-[#1a1a1d] bg-[#0d0d0f] flex flex-col overflow-hidden shadow-lg">

                  {/* Card header */}
                  <div className="px-5 py-4 border-b border-[#1a1a1d] flex items-center gap-3 bg-[#0a0a0b]">
                    <div className="relative w-7 h-7 rounded-lg flex items-center justify-center">
                      <div className="absolute inset-0 rounded-lg bg-yellow-400/20 blur-sm" />
                      <div className="relative w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                        <Key className="size-3.5 text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#e4e4e7]">Secret API Key</p>
                      <p className="text-[10px] text-[#52525b]">Used to authenticate CLI & CI/CD scan triggers</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col gap-4 flex-1 justify-between">

                    {/* Key display */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono-code text-[#71717a] uppercase tracking-widest">
                          {selectedProject?.apikey ? "Secret Key" : "No Key Generated"}
                        </span>
                        {selectedProject?.apikey && (
                          <button
                            onClick={() => setKeyVisible(v => !v)}
                            className="flex items-center gap-1 text-[10px] font-medium text-[#71717a] hover:text-white transition-colors cursor-pointer"
                          >
                            {keyVisible
                              ? <><EyeOff className="size-3" /> Hide</>
                              : <><Eye className="size-3" /> Reveal</>
                            }
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#080809] border border-[#1f1f23] rounded-lg px-3 py-2.5 font-mono-code text-[11px] overflow-hidden">
                          {selectedProject?.apikey ? (
                            <span className={keyVisible ? "text-[#d4d4d8]" : "text-[#52525b] tracking-[0.2em]"}>
                              {keyVisible
                                ? selectedProject.apikey
                                : maskedKey(selectedProject.apikey)
                              }
                            </span>
                          ) : (
                            <span className="text-[#3f3f46] italic">Generate a key below to get started</span>
                          )}
                        </div>
                        {selectedProject?.apikey && (
                          <button
                            onClick={copyKey}
                            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[#1f1f23] bg-[#080809] text-[#71717a] hover:text-white hover:border-[#2e2e32] transition-all cursor-pointer"
                            title="Copy Secret Key"
                          >
                            {copiedKey ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Warning */}
                    {selectedProject?.apikey && (
                      <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2.5">
                        <AlertTriangle className="size-3.5 text-amber-500/70 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-500/70 leading-relaxed">
                          Never commit this key to Git. Store it as a <span className="font-mono-code text-amber-400">HYDRA_API_KEY</span> repository secret.
                        </p>
                      </div>
                    )}

                    {/* Generate button */}
                    <div className="pt-1">
                      <button
                        onClick={handleGenerateKey}
                        disabled={generating}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-medium rounded-lg border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                          border-[#2e2e32] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white hover:bg-[#141416]"
                      >
                        {generating ? (
                          <><Loader2 className="size-3.5 animate-spin" /> Generating…</>
                        ) : selectedProject?.apikey ? (
                          "Rotate Secret Key"
                        ) : (
                          "Generate API Key"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ─── Gemini API Key Card (BYOK) ───────────────────────── */}
                <div className="rounded-xl border border-[#1a1a1d] bg-[#0d0d0f] flex flex-col overflow-hidden shadow-lg">

                  {/* Card header */}
                  <div className="px-5 py-4 border-b border-[#1a1a1d] flex items-center gap-3 bg-[#0a0a0b]">
                    <div className="relative w-7 h-7 rounded-lg flex items-center justify-center">
                      <div className="absolute inset-0 rounded-lg bg-yellow-400/20 blur-sm" />
                      <div className="relative w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                        <Cpu className="size-3.5 text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#e4e4e7]">Custom Gemini API Key</p>
                      <p className="text-[10px] text-[#52525b]">Bring Your Own Key (BYOK) for AI recommendations & chat</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col gap-4 flex-1 justify-between">

                    {/* Input field */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono-code text-[#71717a] uppercase tracking-widest">
                          {selectedProject?.geminiApiKey ? "Gemini Key Saved" : "No Custom Key Set"}
                        </span>
                        <button
                          onClick={() => setGeminiKeyVisible(v => !v)}
                          className="flex items-center gap-1 text-[10px] font-medium text-[#71717a] hover:text-white transition-colors cursor-pointer"
                        >
                          {geminiKeyVisible
                            ? <><EyeOff className="size-3" /> Hide</>
                            : <><Eye className="size-3" /> Reveal</>
                          }
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type={geminiKeyVisible ? "text" : "password"}
                          value={geminiKeyInput}
                          onChange={(e) => setGeminiKeyInput(e.target.value)}
                          placeholder="AIzaSy..."
                          className="flex-1 bg-[#080809] border border-[#1f1f23] rounded-lg px-3 py-2.5 text-[11px] font-mono-code text-[#d4d4d8] outline-none focus:border-[#3f3f46] transition-colors placeholder:text-[#3f3f46]"
                        />
                      </div>
                    </div>

                    {/* Help note */}
                    <div className="flex items-start gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2.5">
                      <Sparkles className="size-3.5 text-cyan-400/70 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-cyan-400/70 leading-relaxed">
                        Optional. If empty, Hydra uses default server key. Get a free key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300 font-medium">aistudio.google.com</a>.
                      </p>
                    </div>

                    {/* Save button */}
                    <div className="pt-1">
                      <button
                        onClick={handleSaveGeminiKey}
                        disabled={savingGeminiKey}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-medium rounded-lg border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                          border-[#2e2e32] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white hover:bg-[#141416]"
                      >
                        {savingGeminiKey ? (
                          <><Loader2 className="size-3.5 animate-spin" /> Saving…</>
                        ) : savedGeminiKey ? (
                          <><Check className="size-3.5 text-emerald-400" /> Saved Successfully</>
                        ) : (
                          "Save Gemini Key"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── CI/CD Integration Section ───────────────────────────── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-widest font-mono-code">Automated CI/CD Workflow</span>
              </div>

              {/* Full Width CI/CD Card */}
              <div className="rounded-xl border border-[#1a1a1d] bg-[#0d0d0f] flex flex-col overflow-hidden shadow-lg">

                {/* Card header */}
                <div className="px-5 py-4 border-b border-[#1a1a1d] flex items-center justify-between bg-[#0a0a0b]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-7 h-7 rounded-lg flex items-center justify-center">
                      <div className="absolute inset-0 rounded-lg bg-yellow-400/20 blur-sm" />
                      <div className="relative w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                        <GitBranch className="size-3.5 text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#e4e4e7]">GitHub Actions Workflow</p>
                      <p className="text-[10px] font-mono-code text-[#52525b]">.github/workflows/visual-tests.yml</p>
                    </div>
                  </div>
                  <button
                    onClick={copyYaml}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded-lg border border-[#1f1f23] text-[#71717a] hover:text-white hover:border-[#2e2e32] transition-all cursor-pointer bg-[#080809]"
                  >
                    {copiedYaml ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    {copiedYaml ? "Copied YAML" : "Copy Workflow YAML"}
                  </button>
                </div>

                {/* Code block */}
                <div className="overflow-x-auto bg-[#080809] p-5 font-mono-code leading-[1.75] text-[11px] border-b border-[#1a1a1d]">
                  <pre className="whitespace-pre">
                    <span className="text-[#71717a]">name: </span><span className="text-[#86efac]">Hydra AI Visual Regression Checks{"\n"}</span>
                    {"\n"}
                    <span className="text-[#71717a]">on:{"\n"}</span>
                    <span className="text-[#71717a]">  push:{"\n"}</span>
                    <span className="text-[#71717a]">    branches: </span><span className="text-[#fbbf24]">[ main, dev ]{"\n"}</span>
                    <span className="text-[#71717a]">  pull_request:{"\n"}</span>
                    <span className="text-[#71717a]">    branches: </span><span className="text-[#fbbf24]">[ main ]{"\n"}</span>
                    {"\n"}
                    {isPro && (
                      <>
                        <span className="text-[#71717a]">permissions:{"\n"}</span>
                        <span className="text-[#71717a]">  contents: </span><span className="text-[#86efac]">write{"\n"}</span>
                        {"\n"}
                      </>
                    )}
                    <span className="text-[#71717a]">jobs:{"\n"}</span>
                    <span className="text-[#71717a]">  visual-tests:{"\n"}</span>
                    <span className="text-[#71717a]">    runs-on: </span><span className="text-[#86efac]">ubuntu-latest{"\n"}</span>
                    <span className="text-[#71717a]">    steps:{"\n"}</span>
                    <span className="text-[#71717a]">      - name: </span><span className="text-[#c4b5fd]">Checkout Code{"\n"}</span>
                    <span className="text-[#71717a]">        uses: </span><span className="text-[#67e8f9]">actions/checkout@v4{"\n"}</span>
                    {isPro && (
                      <>
                        <span className="text-[#71717a]">        with:{"\n"}</span>
                        <span className="text-[#71717a]">          fetch-depth: </span><span className="text-[#fbbf24]">0{"\n"}</span>
                      </>
                    )}
                    {"\n"}
                    <span className="text-[#71717a]">      - name: </span><span className="text-[#c4b5fd]">Set up Node.js{"\n"}</span>
                    <span className="text-[#71717a]">        uses: </span><span className="text-[#67e8f9]">actions/setup-node@v4{"\n"}</span>
                    <span className="text-[#71717a]">        with:{"\n"}</span>
                    <span className="text-[#71717a]">          node-version: </span><span className="text-[#fbbf24]">20{"\n"}</span>
                    {"\n"}
                    <span className="text-[#71717a]">      - name: </span><span className="text-[#c4b5fd]">{isPro ? "Run Hydra AI Visual Scan & Auto-Healer" : "Run Hydra AI Visual Scan"}{"\n"}</span>
                    <span className="text-[#71717a]">        run: </span>
                    <span className="text-[#d4d4d8]">node spectre-cli.js </span>
                    <span className="text-[#71717a]">--project </span>
                    <span className="text-[#fbbf24]">{selectedProject?._id || "<PROJECT_ID>"} </span>
                    <span className="text-[#71717a]">--key </span>
                    <span className="text-[#86efac]">{"${{ secrets.HYDRA_API_KEY }}"}</span>
                    {hasCustomGemini && (
                      <>
                        <span className="text-[#71717a]"> --geminiKey </span>
                        <span className="text-[#86efac]">{"${{ secrets.GEMINI_API_KEY }}"}</span>
                      </>
                    )}
                    {"\n"}
                    {showGeminiEnv && (
                      <>
                        <span className="text-[#71717a]">        env:{"\n"}</span>
                        <span className="text-[#71717a]">          GEMINI_API_KEY: </span>
                        <span className="text-[#86efac]">{"${{ secrets.GEMINI_API_KEY }}"}</span>
                      </>
                    )}
                  </pre>
                </div>
              </div>
            </div>

            {/* ── Bottom info bar ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0d0d0f] border border-[#1a1a1d] rounded-lg">
              <ShieldCheck className="size-3.5 text-emerald-400/60 shrink-0" />
              <p className="text-[10px] text-[#52525b] leading-relaxed">
                Keys are hashed and stored securely. Rotating a key will immediately invalidate the previous one — update your CI environment secrets after rotating.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}