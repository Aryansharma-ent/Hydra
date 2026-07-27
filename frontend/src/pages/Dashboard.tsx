import axios from 'axios'
// Change line 2 to:
import { Play, Loader2, ArrowRight } from 'lucide-react'
import { useState, useEffect } from "react"
import { type TestRun, type Project } from "../types"
import { useSearchParams } from 'react-router-dom'
import Sidebar from "@/components/Dashboard/SideBar"
import TopBar from "@/components/Dashboard/TopBar"
import SubBar from "@/components/Dashboard/SubBar"
import StatsRow from "@/components/Dashboard/StatsRow"
import RecentRuns from "@/components/Dashboard/RecentRuns"


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
            />
            </>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-medium text-[#52525b] uppercase tracking-widest">Project Registry</h2>
                  <span className="text-[10px] text-[#3f3f46] font-mono">{projects.length} projects</span>
                </div>

              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-[#1f1f23] rounded-lg">
                  <p className="text-[12px] text-[#52525b]">No projects yet. Create one to get started.</p>
                </div>
              ) : (
                <div className="flex flex-col border border-[#1a1a1d] rounded-lg overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-4 py-2.5 border-b border-[#1a1a1d] bg-[#0a0a0b]">
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest">Name</span>
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest">Staging</span>
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest">Production</span>
                    <span className="text-[10px] font-medium text-[#3f3f46] uppercase tracking-widest">Status</span>
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
                          <span className="text-[12px] font-medium text-[#d4d4d8] group-hover:text-white transition-colors truncate">
                            {project.name}
                          </span>
                        </div>

                        {/* Staging */}
                        <span className="text-[11px] font-mono text-[#71717a] truncate pr-4" title={project.stagingUrl}>
                          {stagingDomain}
                        </span>

                        {/* Production */}
                        <span className="text-[11px] font-mono text-[#71717a] truncate pr-4" title={project.productionUrl}>
                          {prodDomain}
                        </span>

                        {/* Status + arrow */}
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-medium text-emerald-500 bg-emerald-500/8 border border-emerald-500/15 px-2 py-0.5 rounded-full tracking-wide">
                            Active
                          </span>
                          <ArrowRight className="size-3 text-[#3f3f46] group-hover:text-[#71717a] group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
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
