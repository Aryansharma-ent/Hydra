import { useState } from "react"
import { Play, ArrowLeft, FolderPlus, Copy, Check } from "lucide-react"
import type { Project } from "@/types"

interface SubBarProps {
  selectedProject : Project | null,
  onBackToProjects : () => void
  onNewProjectClick: () => void; 
  onNewRunClick: () => void;   
}

export default function SubBar({selectedProject,onBackToProjects,onNewProjectClick,onNewRunClick}: SubBarProps) {
  const [copiedId, setCopiedId] = useState(false)

  const copyProjectId = () => {
    if (!selectedProject?._id) return
    navigator.clipboard.writeText(selectedProject._id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  return (
    <section className="h-12 border-b border-[#1f1f23]/60 bg-[#0c0c0e]/30 flex items-center justify-between px-6 shrink-0 select-none">
      <div className="flex items-center gap-2 text-xs font-medium">
        {selectedProject && (
          <button onClick={onBackToProjects} className="cursor-pointer mr-1 text-[#71717a] hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
          </button>
        )}
        <span className="text-[#a1a1aa]">Workspace</span>
        <span className="text-[#3f3f46]">/</span>
        <span className="text-white font-semibold">Project Registry</span>
        {selectedProject && (
          <>
            <span className="text-[#3f3f46]">/</span>
            <span className="text-violet-400 font-semibold">{selectedProject.name}</span>
            <button
              onClick={copyProjectId}
              className="ml-1.5 flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-sans font-medium text-[#a1a1aa] hover:text-white bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] rounded-none transition-all cursor-pointer shadow-sm active:scale-95"
              title={`Click to copy Project ID: ${selectedProject._id}`}
            >
              {copiedId ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">ID Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3 text-[#71717a]" />
                  <span>Copy Project ID</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {selectedProject ? ( 
             <button onClick={onNewRunClick} className="flex items-center gap-1.5 px-3 py-1  hover:bg-indigo-700 border  text-white text-xs font-semibold transition-colors rounded shadow-sm">
          <Play className="size-3.5" />
          New run
        </button>
        ) : (
          <button onClick={onNewProjectClick} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-650 hover:bg-indigo-700 border text-white text-xs font-semibold transition-colors rounded shadow-sm">
          <FolderPlus className = "size-3.5" />
          New Project
        </button>
        )}
        
      </div>
    </section>
  )
}
