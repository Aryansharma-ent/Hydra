import { type TestRun } from "@/types"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomIn, ZoomOut, RotateCcw, CheckCircle2 } from "lucide-react"

interface VisualComparerProps {
  runData: TestRun
  selectedBugIndex?: number | null
  onSelectBug?: (index: number | null) => void
}

/* ─── Zoom Presets ─── */
const ZOOM_PRESETS = [
  { label: "Fit", value: 1 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 },
  { label: "300%", value: 3 },
]
const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const ZOOM_STEP = 0.15

export default function VisualComparer({ runData, selectedBugIndex = null, onSelectBug }: VisualComparerProps) {

  /* ═══ EXISTING STATE — PRESERVED ═══ */
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider' | 'diff'>('side-by-side')
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [imgSize, setImgSize] = useState({ width: 0, height: 0, naturalWidth: 1440 })
  const imgRef = useRef<HTMLImageElement>(null)

  /* ═══ NEW: Local zoom/pan UI state ═══ */
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  /* ═══ EXISTING FUNCTIONS — PRESERVED ═══ */
  const getFullUrl = (imagePath: string) => {
    if (!imagePath) return ""
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `http://localhost:8000/${cleanPath}`
  }

  const handleLoad = () => {
    if (imgRef.current) {
      setImgSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
        naturalWidth: imgRef.current.naturalWidth,
      })
    }
  }

  // Scale ratio to convert raw Puppeteer coordinate system to responsive CSS DOM pixel coordinates
  const scale = imgSize.width / (imgSize.naturalWidth || 1440)

  /* ═══ NEW: Zoom handlers ═══ */
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(MAX_ZOOM, +(prev + ZOOM_STEP).toFixed(2)))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(MIN_ZOOM, +(prev - ZOOM_STEP).toFixed(2)))
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }, [])

  const handleZoomPreset = useCallback((value: number) => {
    setZoomLevel(value)
    if (value === 1) setPanOffset({ x: 0, y: 0 })
  }, [])

  /* ═══ NEW: Mouse wheel zoom ═══ */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setZoomLevel(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(prev + delta).toFixed(2))))
      }
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [])

  /* ═══ NEW: Pan handlers ═══ */
  const handlePanStart = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && e.button === 0) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
    }
  }

  const handlePanEnd = () => {
    setIsPanning(false)
  }

  /* ═══ NEW: Keyboard navigation ═══ */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      const bugCount = runData.visualBugs?.length ?? 0

      switch (e.key) {
        case '1':
          setViewMode('side-by-side')
          break
        case '2':
          setViewMode('slider')
          break
        case '3':
          setViewMode('diff')
          break
        case 'j':
        case 'ArrowDown':
          if (bugCount > 0) {
            const next = selectedBugIndex === null ? 0 : Math.min(selectedBugIndex + 1, bugCount - 1)
            onSelectBug?.(next)
          }
          break
        case 'k':
        case 'ArrowUp':
          if (bugCount > 0) {
            const prev = selectedBugIndex === null ? 0 : Math.max(selectedBugIndex - 1, 0)
            onSelectBug?.(prev)
          }
          break
        case '=':
        case '+':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case '0':
          handleZoomReset()
          break
        case 'Escape':
          onSelectBug?.(null)
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedBugIndex, runData.visualBugs?.length, handleZoomIn, handleZoomOut, handleZoomReset, onSelectBug])

  /* ═══ VIEW MODE TABS CONFIG ═══ */
  const viewModes = [
    { key: 'side-by-side' as const, label: 'Split' },
    { key: 'slider' as const, label: 'Overlay' },
    { key: 'diff' as const, label: 'Diff' },
  ]

  const bugCount = runData.visualBugs?.length ?? 0

  /* ═══ Bug Overlay Renderer ═══ */
  const renderBugOverlays = () => {
    if (!runData.visualBugs || runData.visualBugs.length === 0) return null
    return runData.visualBugs.map((bug, index) => {
      const isSelected = selectedBugIndex === index
      return (
        <div
          key={index}
          onClick={(e) => { e.stopPropagation(); onSelectBug?.(index) }}
          className={`absolute cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'border-2 border-red-400 bg-red-500/15 bug-glow-selected z-20'
              : 'border border-dashed border-red-400/50 bg-red-500/5 hover:bg-red-500/15 hover:border-red-400/80 z-10'
          }`}
          style={{
            left: `${bug.location.x * scale}px`,
            top: `${bug.location.y * scale}px`,
            width: `${bug.location.width * scale}px`,
            height: `${bug.location.height * scale}px`,
          }}
        >
          {/* Numbered badge */}
          <div className={`absolute -top-3 -left-1 flex items-center justify-center rounded-full text-[8px] font-bold font-mono transition-all duration-200 ${
            isSelected
              ? 'w-5 h-5 bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'w-4 h-4 bg-red-500/80 text-white/90'
          }`}>
            {index + 1}
          </div>

          {/* Tooltip on hover */}
          <div className={`absolute -top-8 left-5 bg-[#18181b] text-[#e4e4e7] font-mono text-[9px] font-medium px-2 py-1 rounded-md border border-[#2e2e32] pointer-events-none whitespace-nowrap shadow-xl z-30 transition-opacity duration-150 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {bug.element}
          </div>
        </div>
      )
    })
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#08080a] overflow-hidden">

      {/* ═══ TOOLBAR ═══ */}
      <div className="h-10 border-b border-[#1f1f23]/60 bg-[#0a0a0b]/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        {/* Left: Metadata */}
        <div className="flex items-center gap-2.5 text-[11px]">
          <span className="font-mono bg-[#111113] border border-[#1f1f23] px-2 py-0.5 rounded text-[10px] text-[#71717a]">
            1440 × 900
          </span>
          {bugCount > 0 && (
            <span className="font-mono bg-red-500/8 border border-red-500/15 text-red-400 px-2 py-0.5 rounded text-[10px] shadow-sm shadow-red-500/5">
              {bugCount} {bugCount === 1 ? 'regression' : 'regressions'}
            </span>
          )}
          {bugCount === 0 && runData.status === 'PASSED' && (
            <span className="font-mono bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded text-[10px]">
              Clean
            </span>
          )}
        </div>

        {/* Center: View Mode Tabs */}
        <div className="flex items-center bg-[#0d0d0f] border border-[#1f1f23] rounded-lg p-0.5">
          {viewModes.map(({ key, label }, i) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`relative px-3.5 py-1 text-[10px] font-medium rounded-md transition-colors duration-150 cursor-pointer ${
                viewMode === key
                  ? 'text-[#e4e4e7]'
                  : 'text-[#52525b] hover:text-[#a1a1aa]'
              }`}
            >
              {viewMode === key && (
                <motion.div
                  layoutId="viewModeIndicator"
                  className="absolute inset-0 bg-[#1a1a1d] border border-[#2e2e32] rounded-md shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
              {/* Keyboard hint */}
              <span className="relative z-10 ml-1 text-[8px] text-[#3f3f46] font-mono">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Right: Zoom Info */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#52525b]">
            {Math.round(zoomLevel * 100)}%
          </span>
          <span className="text-[9px] text-[#2e2e32] font-mono ml-1 hidden lg:inline">
            Ctrl+Scroll to zoom
          </span>
        </div>
      </div>

      {/* ═══ CANVAS AREA ═══ */}
      <div
        ref={canvasRef}
        className={`flex-1 overflow-hidden relative ${
          zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
      >
        {/* Zoomable/Pannable container */}
        <div
          className={`w-full h-full p-4 ${!isPanning ? 'canvas-zoom' : ''}`}
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center top',
          }}
        >
          <AnimatePresence mode="wait">

            {/* ═══ VIEW 1: Side by Side / Split ═══ */}
            {viewMode === 'side-by-side' && (
              <motion.div
                key="split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3"
              >
                {/* Staging Pane */}
                <div className="flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden min-h-0">
                  <div className="h-8 bg-[#0a0a0b] border-b border-[#1f1f23]/60 px-3 flex items-center gap-2 shrink-0">
                    <span className="size-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/30" />
                    <span className="text-[10px] font-semibold text-[#a1a1aa] tracking-wide">Staging</span>
                    <span className="ml-auto font-mono text-[9px] text-[#3f3f46] truncate max-w-[200px]">{runData.stagingUrl}</span>
                  </div>
                  <div className="flex-1 p-2 bg-[#08080a] overflow-auto flex justify-center items-start relative">
                    <div className="relative inline-block w-full">
                      <img
                        ref={imgRef}
                        src={getFullUrl(runData.stagingScreenshotUrl)}
                        alt="Staging"
                        onLoad={handleLoad}
                        className="w-full h-auto block rounded-sm"
                        draggable={false}
                      />
                      {renderBugOverlays()}
                    </div>
                  </div>
                </div>

                {/* Production Pane */}
                <div className="flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden min-h-0">
                  <div className="h-8 bg-[#0a0a0b] border-b border-[#1f1f23]/60 px-3 flex items-center gap-2 shrink-0">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30" />
                    <span className="text-[10px] font-semibold text-[#a1a1aa] tracking-wide">Production</span>
                    <span className="ml-auto font-mono text-[9px] text-[#3f3f46] truncate max-w-[200px]">{runData.productionUrl}</span>
                  </div>
                  <div className="flex-1 p-2 bg-[#08080a] overflow-auto flex justify-center items-start">
                    <div className="relative inline-block w-full">
                      <img
                        src={getFullUrl(runData.productionScreenshotUrl)}
                        alt="Production"
                        className="w-full h-auto block rounded-sm"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ VIEW 2: Slider Overlay ═══ */}
            {viewMode === 'slider' && (
              <motion.div
                key="slider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full flex justify-center items-start"
              >
                <div className="w-full max-w-[960px] flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
                  <div className="h-8 bg-[#0a0a0b] border-b border-[#1f1f23]/60 px-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-medium text-[#71717a]">Staging</span>
                      </div>
                      <span className="text-[9px] text-[#2e2e32]">←  drag  →</span>
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-medium text-[#71717a]">Production</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] text-[#3f3f46]">{sliderPos}%</span>
                  </div>
                  <div className="p-3 bg-[#08080a] flex justify-center items-center">
                    <div className="relative w-full aspect-[1440/900] select-none overflow-hidden rounded border border-[#1a1a1d]">
                      <img
                        ref={imgRef}
                        onLoad={handleLoad}
                        src={getFullUrl(runData.productionScreenshotUrl)}
                        alt="Production master"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        draggable={false}
                      />

                      <img
                        src={getFullUrl(runData.stagingScreenshotUrl)}
                        alt="Staging source"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        draggable={false}
                        style={{
                          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                        }}
                      />

                      {/* Slider line */}
                      <div
                        className="absolute inset-y-0 w-px bg-white/80 pointer-events-none z-20"
                        style={{ left: `${sliderPos}%` }}
                      >
                        {/* Slider handle */}
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-8 bg-[#18181b] border border-[#3f3f46] rounded-md flex items-center justify-center shadow-xl cursor-ew-resize z-30">
                          <div className="flex flex-col gap-0.5">
                            <div className="w-2 h-px bg-[#71717a]" />
                            <div className="w-2 h-px bg-[#71717a]" />
                            <div className="w-2 h-px bg-[#71717a]" />
                          </div>
                        </div>
                      </div>

                      {/* Bug overlays */}
                      {runData.visualBugs && runData.visualBugs.map((bug, index) => (
                        <div
                          key={index}
                          onClick={(e) => { e.stopPropagation(); onSelectBug?.(index) }}
                          className={`absolute cursor-pointer transition-all duration-200 z-10 ${
                            selectedBugIndex === index
                              ? 'border-2 border-red-400 bg-red-500/15 bug-glow-selected'
                              : 'border border-dashed border-red-500/50 bg-red-500/5 hover:bg-red-500/15'
                          }`}
                          style={{
                            left: `${bug.location.x * scale}px`,
                            top: `${bug.location.y * scale}px`,
                            width: `${bug.location.width * scale}px`,
                            height: `${bug.location.height * scale}px`,
                          }}
                        >
                          <div className={`absolute -top-3 -left-1 flex items-center justify-center rounded-full text-[8px] font-bold font-mono ${
                            selectedBugIndex === index
                              ? 'w-5 h-5 bg-red-500 text-white shadow-lg shadow-red-500/30'
                              : 'w-4 h-4 bg-red-500/80 text-white/90'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      ))}

                      {/* Range input (kept for accessibility) */}
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
              </motion.div>
            )}

            {/* ═══ VIEW 3: Diff Map ═══ */}
            {viewMode === 'diff' && (
              <motion.div
                key="diff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full flex justify-center items-start"
              >
                <div className="w-full max-w-[960px] flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
                  <div className="h-8 bg-[#0a0a0b] border-b border-[#1f1f23]/60 px-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400/30" />
                      <span className="text-[10px] font-semibold text-[#a1a1aa] tracking-wide">Pixel Difference Map</span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-[#3f3f46]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-[#ff006e]" />
                        <span>Changed pixels</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-[#1a1a1d]" />
                        <span>Unchanged</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-[#08080a] flex justify-center items-center">
                    <div className="relative w-full">
                      <img
                        src={getFullUrl(runData.diffScreenshotUrl)}
                        alt="Diff Map"
                        className="w-full h-auto block rounded border border-[#1a1a1d]"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ═══ SUCCESS STATE OVERLAY (0 bugs) ═══ */}
        {bugCount === 0 && runData.status === 'PASSED' && viewMode === 'side-by-side' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 backdrop-blur-sm"
            >
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-300">
                All Clear — Zero regressions detected
              </span>
            </motion.div>
          </div>
        )}

        {/* ═══ ZOOM CONTROLS (floating bottom-right) ═══ */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 bg-[#111113]/90 backdrop-blur-sm border border-[#1f1f23] rounded-lg p-1 shadow-xl">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#1a1a1d] rounded transition-all cursor-pointer"
            title="Zoom out (-)"
          >
            <ZoomOut className="size-3.5" />
          </button>

          {/* Zoom presets */}
          {ZOOM_PRESETS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => handleZoomPreset(value)}
              className={`px-2 py-1 text-[9px] font-mono rounded transition-all cursor-pointer ${
                Math.abs(zoomLevel - value) < 0.05
                  ? 'bg-[#1a1a1d] text-[#e4e4e7] border border-[#2e2e32]'
                  : 'text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#141416] border border-transparent'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleZoomIn}
            className="p-1.5 text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#1a1a1d] rounded transition-all cursor-pointer"
            title="Zoom in (+)"
          >
            <ZoomIn className="size-3.5" />
          </button>

          <div className="w-px h-4 bg-[#1f1f23] mx-0.5" />

          <button
            onClick={handleZoomReset}
            className="p-1.5 text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#1a1a1d] rounded transition-all cursor-pointer"
            title="Reset zoom (0)"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        {/* ═══ KEYBOARD HINTS (floating bottom-left) ═══ */}
        {bugCount > 0 && (
          <div className="absolute bottom-3 left-3 z-30 hidden lg:flex items-center gap-2 text-[9px] text-[#3f3f46] font-mono">
            <span className="bg-[#111113]/90 backdrop-blur-sm border border-[#1f1f23] rounded px-1.5 py-0.5">J</span>
            <span className="bg-[#111113]/90 backdrop-blur-sm border border-[#1f1f23] rounded px-1.5 py-0.5">K</span>
            <span className="text-[#2e2e32]">navigate bugs</span>
          </div>
        )}
      </div>
    </main>
  )
}
