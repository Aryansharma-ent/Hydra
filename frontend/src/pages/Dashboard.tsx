import axios from 'axios'
import { Play, Loader2, ArrowRight, MoreVertical, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from "react"
import { type TestRun, type Project } from "../types"
import { useSearchParams } from 'react-router-dom'
import Sidebar from "@/components/Dashboard/SideBar"
import TopBar from "@/components/Dashboard/TopBar"
import SubBar from "@/components/Dashboard/SubBar"
import StatsRow from "@/components/Dashboard/StatsRow"
import RecentRuns from "@/components/Dashboard/RecentRuns"
import ConfirmDeleteModal from "@/components/Dashboard/ConfirmDeleteModal"


export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateProject, setShowCreateProject] = useState<boolean>(false)
  const [showRunTest, setShowRunTest] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [name,setName] = useState<string>("")
  const [stagingUrl,setStagingUrl] = useState<string>("")
  const [productionUrl,setProductionUrl] = useState<string>("")
  const [isTesting, setIsTesting] = useState<boolean>(false)
  const [searchParams,setSearchParams] = useSearchParams()
  const [run,setRun] = useState<TestRun[]>([])
  const [saveAsDefault,setSaveAsDefault] = useState<boolean>(false);

  const [activeProjectMenuId, setActiveProjectMenuId] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const projectMenuRef = useRef<HTMLDivElement>(null)





const fetchProjects = async () => {
  try {
       const token = localStorage.getItem("hydra_token");
    
    const res = await axios.get("http://localhost:8000/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.success) {
      const projectList = res.data.data;
      setProjects(projectList);

      const urlProjectId = searchParams.get('projectId')
      if(urlProjectId){
        const matchedProject = projectList.find((p : Project) => p._id === urlProjectId)
        if(matchedProject){
          setSelectedProject(matchedProject)
        }
      }
    }
  } catch (error) {
    console.error("Failed to load projects:", error);
  } finally {
    setLoading(false);
  }
};


const handleCreateProject = async(e : React.FormEvent) => {
    e.preventDefault() 

    try {
      const token = localStorage.getItem("hydra_token");
      const res = await axios.post("http://localhost:8000/api/projects",{
        name,
        stagingUrl,
        productionUrl
      },{
          headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if(res.data.success){
         setName("");
      setStagingUrl("");
      setProductionUrl("");
      setShowCreateProject(false);
      fetchProjects();
      }
    } catch (error) {
      console.log("error while creating new project")
    }
}


const handleOpenRunModal = () => {
  if (selectedProject) {
    setStagingUrl(selectedProject.stagingUrl)
    setProductionUrl(selectedProject.productionUrl)
  }
  setShowRunTest(true)
}


const handleRunProject = async(e : React.FormEvent) => {
    e.preventDefault()
    setIsTesting(true)
  if(saveAsDefault){
     try {
   
      const token = localStorage.getItem("hydra_token");
      const res = await axios.put(`http://localhost:8000/api/projects/${selectedProject?._id}`,{
        stagingUrl,
        productionUrl
      },{
        headers : {
           Authorization: `Bearer ${token}`
        }
      })

           if (res.data.success) {
          const updatedProject = res.data.data;
          // 1. Update the selected project cockpit display
          setSelectedProject(updatedProject);
          // 2. Update the projects registry list array
          setProjects(prev => prev.map(p => 
            p._id === selectedProject?._id ? updatedProject : p
          ));
        }
  }catch{
    console.log("error while updating the url's")
  }
}

    try {
   
      setShowRunTest(false)
      const res = await axios.post("http://localhost:8000/api/tests/test-capture",{
        projectId : selectedProject?._id,
        stagingUrl,
        productionUrl
      },{
        headers : {
           "x-api-key": selectedProject?.apikey
        }
      })

      if(res.data.success){
        const newRun = res.data.data;
        setStagingUrl("")
        setProductionUrl("")
         setSaveAsDefault(false)
        setRun(prev => [newRun, ...prev])
      }

    } catch (error) {
      console.log("error running the test case")
    }finally{
      setIsTesting(false)
      setLoading(false)
    }
}


 const fetchTestRun = async(projectId : string) => {
     try {
         const token = localStorage.getItem("hydra_token");
      const res = await axios.get(`http://localhost:8000/api/projects/${projectId}/runs` ,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      })

      if(res.data.success){
         setRun(res.data.data)
      }
     } catch (error) {
       console.log("couldn't fetch the test runs")
     }
 }



  const handleDeleteProject = async () => {
    if (!projectToDelete) return
    const token = localStorage.getItem("hydra_token")
    await axios.delete(`http://localhost:8000/api/projects/${projectToDelete._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (selectedProject?._id === projectToDelete._id) {
      setSelectedProject(null)
      setSearchParams({})
    }
    setProjectToDelete(null)
    fetchProjects()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setActiveProjectMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    fetchProjects();
  }, []);

useEffect(() => {
  if (selectedProject) {
    fetchTestRun(selectedProject._id);
  }
}, [selectedProject]);



useEffect(()=>{
   let intervalId : any = null

   const hasRunningScan = run.some(r => r.status === 'RUNNING')

   if(selectedProject && hasRunningScan){
      intervalId = setInterval(()=>{
        fetchTestRun(selectedProject._id)
      },3000)
   }


   return()=>{
    if(intervalId) clearInterval(intervalId)
   }
},[run,selectedProject])
   



  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#c9d1d9] overflow-hidden font-sans select-none antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
      />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. Top Tabs & Header Controls */}
        <TopBar />

        {/* 3. Sub-bar breadcrumbs & Actions */}
        <SubBar 
          selectedProject = {selectedProject}
          onBackToProjects={()=> {
            setSelectedProject(null)
            setSearchParams('/dashboard');
          }}
           onNewProjectClick={() => setShowCreateProject(true)}
          onNewRunClick={handleOpenRunModal}
        />  

        {/* 4. Main workspace layout */}
        <div className="flex-1 flex min-h-0">
          {/* Middle: Stats grid & runs list */}
          <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {loading ? (<p>loading.....</p>) : selectedProject ? (
              <>
            <StatsRow
             runs={run}
            />
            <RecentRuns
             RunData={run}
             stagingUrl={selectedProject?.stagingUrl}
             productionUrl = {selectedProject?.productionUrl}
             onRunDeleted={() => fetchTestRun(selectedProject._id)}
            />
            </>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-medium text-[#52525b] uppercase tracking-widest font-mono-code">Project Registry</h2>
                  <span className="text-[10px] text-[#3f3f46] font-mono-code">{projects.length} projects</span>
                </div>

              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-[#1f1f23] rounded-lg">
                  <p className="text-[12px] text-[#52525b]">No projects yet. Create one to get started.</p>
                </div>
              ) : (
                <div className="flex flex-col border border-[#1a1a1d] rounded-lg overflow-hidden font-mono-code">
                  {/* Table header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-4 py-2.5 border-b border-[#1a1a1d] bg-[#0a0a0b]">
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest font-mono-code">Name</span>
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest font-mono-code">Staging</span>
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest font-mono-code">Production</span>
                  </div>

                  {/* Rows */}
                  {projects.map((project, idx) => {
                    const stagingDomain = project.stagingUrl.replace(/^https?:\/\/(www\.)?/, '');
                    const prodDomain = project.productionUrl.replace(/^https?:\/\/(www\.)?/, '');

                    return (
                      <div
                        key={project._id}
                        onClick={() => {
                          setSelectedProject(project)
                          setSearchParams({ projectId: project._id });
                        }}
                        className={`grid grid-cols-[2fr_1fr_1fr_auto] items-center px-4 py-3.5 cursor-pointer hover:bg-[#0d0d0f] transition-colors duration-100 group ${
                          idx !== projects.length - 1 ? 'border-b border-[#1a1a1d]' : ''
                        }`}
                      >
                        {/* Name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46] group-hover:bg-emerald-500 transition-colors shrink-0" />
                          <span className="text-[12px] font-medium text-[#d4d4d8] group-hover:text-white transition-colors truncate font-mono-code">
                            {project.name}
                          </span>
                        </div>

                        {/* Staging */}
                        <span className="text-[11px] font-mono-code text-[#71717a] truncate pr-4" title={project.stagingUrl}>
                          {stagingDomain}
                        </span>

                        {/* Production */}
                        <span className="text-[11px] font-mono-code text-[#71717a] truncate pr-4" title={project.productionUrl}>
                          {prodDomain}
                        </span>

                        {/* Arrow + 3-dots Menu */}
                        <div className="flex items-center gap-3">
                          <ArrowRight className="size-3 text-[#3f3f46] group-hover:text-[#71717a] group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />

                          {/* 3-Dots Action Menu */}
                          <div className="relative" ref={activeProjectMenuId === project._id ? projectMenuRef : null}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveProjectMenuId(activeProjectMenuId === project._id ? null : project._id)
                              }}
                              className="p-1 rounded text-[#71717a] hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <MoreVertical className="size-3.5" />
                            </button>

                            {activeProjectMenuId === project._id && (
                              <div className="absolute right-0 top-6 z-30 w-40 bg-[#121215] border border-[#27272a] rounded-lg shadow-xl py-1 animate-in fade-in duration-150">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveProjectMenuId(null)
                                    setProjectToDelete(project)
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 flex items-center gap-2 transition-colors font-medium"
                                >
                                  <Trash2 className="size-3.5" />
                                  Delete Project
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            )
          }
          </main>

        </div>

        {/* Project Delete Modal */}
        {projectToDelete && (
          <ConfirmDeleteModal
            isOpen={Boolean(projectToDelete)}
            onClose={() => setProjectToDelete(null)}
            onConfirm={handleDeleteProject}
            title="Delete Project"
            itemName={projectToDelete.name}
            itemType="Project"
          />
        )}


    


{showCreateProject && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0d0d0f] border border-[#1f1f23] w-full max-w-[420px] rounded-xl flex flex-col shadow-2xl overflow-hidden">

      {/* Modal Header */}
      <div className="px-6 py-5 border-b border-[#1a1a1d]">
        <h3 className="text-[13px] font-semibold text-[#e4e4e7]">New Project</h3>
        <p className="text-[11px] text-[#52525b] mt-0.5">Register a website to start visual regression testing.</p>
      </div>

      <form onSubmit={handleCreateProject} className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Project Name</label>
          <input
            type="text"
            placeholder="e.g. Acme Web App"
            className="bg-[#080809] border border-[#1f1f23] rounded-lg px-3 py-2.5 text-[12px] text-[#e4e4e7] placeholder-[#3f3f46] focus:border-[#3f3f46] outline-none w-full font-mono transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Staging URL</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-amber-400" />
            <input
              type="url"
              placeholder="https://staging.acme.com"
              className="bg-[#080809] border border-[#1f1f23] rounded-lg pl-7 pr-3 py-2.5 text-[12px] text-[#e4e4e7] placeholder-[#3f3f46] focus:border-[#3f3f46] outline-none w-full font-mono transition-colors"
              value={stagingUrl}
              onChange={(e) => setStagingUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Production URL</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-emerald-400" />
            <input
              type="url"
              placeholder="https://acme.com"
              className="bg-[#080809] border border-[#1f1f23] rounded-lg pl-7 pr-3 py-2.5 text-[12px] text-[#e4e4e7] placeholder-[#3f3f46] focus:border-[#3f3f46] outline-none w-full font-mono transition-colors"
              value={productionUrl}
              onChange={(e) => setProductionUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#1a1a1d]">
          <button
            type="button"
            onClick={() => setShowCreateProject(false)}
            className="px-4 py-2 text-[11px] font-medium text-[#71717a] hover:text-[#a1a1aa] bg-transparent border border-[#1f1f23] hover:border-[#2e2e32] rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-[11px] font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-all cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  </div>
)}








{showRunTest && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0d0d0f] border border-[#1f1f23] w-full max-w-[420px] rounded-xl flex flex-col shadow-2xl overflow-hidden">

      {/* Modal Header */}
      <div className="px-6 py-5 border-b border-[#1a1a1d]">
        <h3 className="text-[13px] font-semibold text-[#e4e4e7]">Run Visual Scan</h3>
        <p className="text-[11px] text-[#52525b] mt-0.5">
          Capture and compare staging vs production screenshots.
        </p>
      </div>

      <form onSubmit={handleRunProject} className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Staging URL</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-amber-400" />
            <input
              type="url"
              placeholder="https://staging.acme.com"
              className="bg-[#080809] border border-[#1f1f23] rounded-lg pl-7 pr-3 py-2.5 text-[12px] text-[#e4e4e7] placeholder-[#3f3f46] focus:border-[#3f3f46] outline-none w-full font-mono transition-colors"
              value={stagingUrl}
              onChange={(e) => setStagingUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Production URL</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-emerald-400" />
            <input
              type="url"
              placeholder="https://acme.com"
              className="bg-[#080809] border border-[#1f1f23] rounded-lg pl-7 pr-3 py-2.5 text-[12px] text-[#e4e4e7] placeholder-[#3f3f46] focus:border-[#3f3f46] outline-none w-full font-mono transition-colors"
              value={productionUrl}
              onChange={(e) => setProductionUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={saveAsDefault}
            onChange={(e) => setSaveAsDefault(e.target.checked)}
            className="w-3.5 h-3.5 rounded border border-[#2e2e32] bg-[#080809] accent-violet-600 cursor-pointer"
          />
          <span className="text-[11px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors">Save as default URLs for this project</span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#1a1a1d]">
          <button
            type="button"
            disabled={isTesting}
            onClick={() => setShowRunTest(false)}
            className="px-4 py-2 text-[11px] font-medium text-[#71717a] hover:text-[#a1a1aa] bg-transparent border border-[#1f1f23] hover:border-[#2e2e32] rounded-lg transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isTesting}
            className="px-5 py-2 text-[11px] font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTesting ? (
              <><Loader2 className="size-3.5 animate-spin" /> Scanning…</>
            ) : (
              <><Play className="size-3.5" /> Run Scan</>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      </div>
    </div>
  )
}
