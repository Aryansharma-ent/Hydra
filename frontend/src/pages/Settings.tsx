import Sidebar from "@/components/Dashboard/SideBar"
import TopBar from "@/components/Dashboard/TopBar"
import { Copy, Key, Terminal, AlertTriangle, Check, Loader2 } from "lucide-react"
import axios from 'axios'
import { useEffect, useState } from "react"
import { type TestRun, type Project } from "../types"

export default function Settings() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copiedKey, selectCopiedKey] = useState<boolean>(false)
  const [copiedYaml, selectCopiedYaml] = useState<boolean>(false)
  const [generating, setGenerating] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)



  useEffect(() => {
    const getProjects = async () => {
      setLoading(true)
      try {
        const res = await axios.get("http://localhost:8000/api/projects")

        if (res.data.success) {
          setProjects(res.data.data)
          setSelectedProject(res.data.data[0])
        }
      } catch (error) {
        console.log("Error fetching the projects")
      } finally {
        setLoading(false)
      }
    }


    getProjects()
  }, [])

  let newKey = selectedProject?.apikey
  const handleGenerateKey = async () => {
    setGenerating(true)
    try {
      const res = await axios.post(`http://localhost:8000/api/projects/${selectedProject?._id}/generate-key`)

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
      console.log("error fetching the api key geenrated")
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



  // Mock states for visual preview (We will connect these to real hooks next!)


  // Mock YAML workflow config script
  const githubActionsYaml = `name: Spectre AI Visual Regression Checks

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Spectre AI Visual Scan
        run: node spectre-cli.js --project ${selectedProject?._id || "<PROJECT_ID>"} --key \${{ secrets.SPECTRE_API_KEY }}
`;

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#c9d1d9] overflow-hidden font-sans select-none antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 2. Top Header Controls */}
        <TopBar />

        {/* 3. Main Workspace Area */}
        <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-5xl mx-auto w-full">

          {/* Header Info */}
          <div>
            <h1 className="text-xl font-mono font-bold text-white uppercase tracking-wider">
              Developer Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Configure automated test triggers, manage project credentials, and integrate with CI/CD systems.
            </p>
          </div>

          <hr className="border-[#1f1f23]/60" />

          {/* Project Selection Dropdown */}
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-mono">
              Select Project Configuration
            </label>
            <select className="bg-[#121214] border border-[#1f1f23] text-xs text-white rounded px-3 py-2.5 outline-none focus:border-indigo-500/60 font-mono w-full max-w-md cursor-pointer"
               value={selectedProject?._id || ""} 
              onChange={(e) => {
                const matched = projects.find(p => p._id === e.target.value);
                if (matched) setSelectedProject(matched);
              }}>
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Settings Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Column 1: API Key Management */}
            <section className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Key className="size-4 text-indigo-400" />
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Secret API Key
                </h2>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use this unique token in your CI/CD runner environments to authenticate calls to trigger headless scans.
              </p>

              {/* API Key Box */}
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedProject?.apikey ? selectedProject.apikey : "No key generated yet."}
                    className="bg-[#121214] border border-[#1f1f23] rounded px-3 py-2 text-[11px] font-mono text-white outline-none w-full select-all"
                  />
                  <button
                    onClick={copyKey}
                    className="px-3 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-900/40 rounded transition-colors text-xs font-semibold cursor-pointer"
                  >
                    {copiedKey ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>

                {/* Warning Card */}
                <div className="bg-amber-950/10 border border-amber-500/20 rounded p-3 flex gap-2.5 items-start">
                  <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-400 leading-normal font-mono">
                    WARNING: Keep this key secret. Anyone with access to this token can trigger automated scans on your Puppeteer instance.
                  </p>
                </div>
              </div>

              {/* Key action button */}
              <div className="border-t border-[#1f1f23]/40 pt-4 mt-auto">
                <button
                  onClick={handleGenerateKey}
                  disabled={generating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-3 text-white animate-spin" />
                      Generating...
                    </span>
                  ) : selectedProject?.apikey ? (
                    "Regenerate API Key"
                  ) : (
                    "Generate API Key"
                  )}
                </button>
              </div>

            </section>

            {/* Column 2: CI/CD Integration Guide */}
            <section className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="size-4 text-emerald-400" />
                  <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    GitHub Actions CI Pipeline
                  </h2>
                </div>
                <button
                  onClick={copyYaml}
                  className="p-1 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  {copiedYaml ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Add this workflow file under <code className="text-indigo-400">.github/workflows/visual-tests.yml</code> in your repository to run visual scans on every push automatically.
              </p>

              {/* Code window */}
              <div className="bg-black p-3.5 border border-[#1f1f23] rounded-lg overflow-x-auto select-text">
                <pre className="font-mono text-[10px] text-emerald-400 leading-relaxed whitespace-pre">
                  {githubActionsYaml}
                </pre>
              </div>
            </section>

          </div>

        </main>

      </div>
    </div>
  )
}