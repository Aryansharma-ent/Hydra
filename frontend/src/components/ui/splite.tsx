'use client'

import { Suspense, useState, useEffect } from 'react'
import Spline from '@splinetool/react-spline'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Safety timeout: if Spline fails to load in 4 seconds, show interactive 3D fallback
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[450px] flex items-center justify-center overflow-hidden bg-zinc-950/80 rounded-2xl border border-white/10">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20 gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-cyan-300/80">Loading 3D Robot Scene...</span>
        </div>
      )}

      {/* Error / Offline Fallback Graphic */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-4 z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🤖</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-['Syne',sans-serif]">Interactive 3D Robot</h4>
            <p className="text-xs text-white/50 max-w-xs mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              3D scene preview ready
            </p>
          </div>
        </div>
      ) : (
        <Suspense 
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            </div>
          }
        >
          <Spline
            scene={scene}
            className={`${className || ''} w-full h-full min-h-[450px] block`}
            style={{ width: '100%', height: '100%', minHeight: '450px' }}
            onLoad={() => {
              setIsLoading(false)
              setHasError(false)
            }}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        </Suspense>
      )}
    </div>
  )
}
