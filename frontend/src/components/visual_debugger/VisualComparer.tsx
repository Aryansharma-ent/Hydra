import { type TestRun } from "@/types"
import { useState, useRef } from "react"

interface VisualComparerProps {
  runData: TestRun
}

export default function VisualComparer({ runData }: VisualComparerProps) {

  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider' | 'diff'>('side-by-side')
  
  // 2. Manage position of slider comparison (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState<number>(50)

  //  Track image display sizes to calculate scale factor
  const [imgSize, setImgSize] = useState({ width: 0, height: 0, naturalWidth: 1440 })
  const imgRef = useRef<HTMLImageElement>(null)

       const getFullUrl = (imagePath : string) => {
        if(!imagePath) return "" 
        if(imagePath.startsWith('http')){
          return imagePath
         }
         const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
         return `http://localhost:8000/${cleanPath}`
       }

    /* we need to get the native and displayed width of the image display 
      for Eg. puppeteer takes a screenshot of a website and its in 1440 wide display the bug is detected to be at 800 px from left suppose
        but when the image will load in frontend since the image will fit inside a css pane it might reduce in size and the bug could actually shift to like 700px
        which could lead to error thats why we will calculate both naturalWidth and clientWidth
    */ 
       const handleLoad = () =>{
        if(imgRef.current){
          setImgSize({
            width : imgRef.current.clientWidth,
            height : imgRef.current.clientHeight,
            naturalWidth : imgRef.current.naturalWidth,
          })
        }
       }
         
       // scale ratio so we could multiply this to our end width to get the correct bug position in our displayed image the frontend
         const scale = imgSize.width / (imgSize.naturalWidth || 1440)


  return (
    <main className="flex-1 px-5 py-4 overflow-y-auto flex flex-col gap-4 bg-[#080809]">

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Left: context info */}
        <div className="flex items-center gap-2.5 text-[11px] text-[#52525b]">
          <span className="font-medium text-[#71717a]">Viewport</span>
          <span className="font-mono bg-[#111113] border border-[#1f1f23] px-1.5 py-0.5 rounded text-[10px]">1440 × 900</span>
          {runData.visualBugs?.length > 0 && (
            <span className="font-mono bg-red-500/8 border border-red-500/15 text-red-400 px-1.5 py-0.5 rounded text-[10px]">
              {runData.visualBugs.length} {runData.visualBugs.length === 1 ? 'regression' : 'regressions'}
            </span>
          )}
        </div>

        {/* Right: view mode tabs */}
        <div className="flex items-center bg-[#0d0d0f] border border-[#1f1f23] rounded-md p-0.5">
          {([
            { key: 'side-by-side', label: 'Split' },
            { key: 'slider',       label: 'Overlay' },
            { key: 'diff',         label: 'Diff' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`px-3 py-1 text-[10px] font-medium rounded transition-all duration-150 cursor-pointer ${
                viewMode === key
                  ? 'bg-[#1a1a1d] text-[#e4e4e7] shadow-sm border border-[#2e2e32]'
                  : 'text-[#52525b] hover:text-[#a1a1aa] border border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Layouts Grid */}
      <div className="flex-1 flex justify-center items-start min-h-0">
        
        {viewMode === 'side-by-side' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Staging Pane */}
            <div className="flex flex-col bg-[#0d0d0f] border border-[#1f1f23] rounded-lg overflow-hidden">
              <div className="h-8 bg-[#0a0a0b] border-b border-[#1f1f23] px-3 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-medium text-[#71717a] tracking-wide">Staging</span>
                <span className="ml-auto font-mono text-[9px] text-[#3f3f46] truncate max-w-[160px]">{runData.stagingUrl}</span>
              </div>
              <div className="p-3 bg-[#080809] overflow-auto flex justify-center items-start relative min-h-[400px]">
                <div className="relative inline-block w-full">
                  <img
                    ref={imgRef}
                    src={getFullUrl(runData.stagingScreenshotUrl)}
                    alt="Staging"
                    onLoad={handleLoad}
                    className="w-full h-auto block rounded-sm"
                  />
                  {runData.visualBugs?.map((bug, index) => (
                    <div
                      key={index}
                      className="absolute border border-dashed border-red-400/70 bg-red-500/8 group cursor-pointer hover:bg-red-500/20 transition-all"
                      style={{
                        left: `${bug.location.x * scale}px`,
                        top: `${bug.location.y * scale}px`,
                        width: `${bug.location.width * scale}px`,
                        height: `${bug.location.height * scale}px`,
                      }}
                    >
                      <div className="absolute -top-5 left-0 bg-red-500 text-white font-mono text-[8px] font-semibold px-1.5 py-0.5 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        #{index + 1} {bug.element}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Production Pane */}
            <div className="flex flex-col bg-[#0d0d0f] border border-[#1f1f23] rounded-lg overflow-hidden">
              <div className="h-8 bg-[#0a0a0b] border-b border-[#1f1f23] px-3 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-medium text-[#71717a] tracking-wide">Production</span>
                <span className="ml-auto font-mono text-[9px] text-[#3f3f46] truncate max-w-[160px]">{runData.productionUrl}</span>
              </div>
              <div className="p-3 bg-[#080809] overflow-auto flex justify-center items-start min-h-[400px]">
                <div className="relative inline-block w-full">
                  <img
                    src={getFullUrl(runData.productionScreenshotUrl)}
                    alt="Production"
                    className="w-full h-auto block rounded-sm"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Slider Overlay comparison wipe */}
               {/* VIEW 2: Slider Overlay comparison wipe */}
        {viewMode === 'slider' && (
          <div className="w-full max-w-[800px] flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
            <div className="bg-[#0e0e11] border-b border-[#1f1f23] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Slider Comparison (Drag to Wipe)
              </span>
            </div>
            <div className="p-6 bg-[#09090b]/80 flex justify-center items-center">
              <div className="relative w-full aspect-[1440/900] select-none overflow-hidden border border-[#1f1f23] rounded">
                
                {/* Background master: Production (used to calculate scale ref) */}
                <img 
                  ref={imgRef}
                  onLoad={handleLoad}
                  src={getFullUrl(runData.productionScreenshotUrl)} 
                  alt="Production master"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                
                {/* Foreground layer: Staging (aligned and clipped using CSS clip-path) */}
                <img 
                  src={getFullUrl(runData.stagingScreenshotUrl)} 
                  alt="Staging source"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ 
                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                  }}
                />
                
                {/* Visual slider divider bar */}
                <div 
                  className="absolute inset-y-0 w-0.5 bg-indigo-500 pointer-events-none flex items-center justify-center z-20"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="size-6 bg-indigo-600 border border-indigo-400 rounded-full flex items-center justify-center shadow-lg -translate-x-1/2 cursor-ew-resize">
                    <span className="text-[10px] text-white select-none">↔</span>
                  </div>
                </div>

                {/* Dynamic absolute bounding boxes overlaying the slider comparison */}
                {runData.visualBugs && runData.visualBugs.map((bug, index) => (
                  <div 
                    key={index}
                    className="absolute border border-dashed border-red-500 bg-red-500/10 group cursor-pointer hover:bg-red-500/25 transition-all z-10"
                    style={{
                      left: `${bug.location.x * scale}px`,
                      top: `${bug.location.y * scale}px`,
                      width: `${bug.location.width * scale}px`,
                      height: `${bug.location.height * scale}px`,
                    }}
                  >
                    {/* Bounding box hover description bubble */}
                    <div className="absolute -top-6 left-0 bg-red-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 whitespace-nowrap">
                      {bug.element}: {bug.description}
                    </div>
                  </div>
                ))}
                
                {/* Standard HTML range input placed over the screen for dragging actions */}
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Diff Map highlighting pixel deviations */}
        {viewMode === 'diff' && (
          <div className="w-full max-w-[800px] flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
            <div className="bg-[#0e0e11] border-b border-[#1f1f23] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono">
                Visual Difference Pixel-Map
              </span>
            </div>
            <div className="p-6 bg-[#09090b]/80 flex justify-center items-center">
              <div className="relative w-full">
                <img 
                  src={getFullUrl(runData.diffScreenshotUrl)} 
                  alt="Diff Map"
                  className="w-full h-auto block border border-[#1f1f23] rounded"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
