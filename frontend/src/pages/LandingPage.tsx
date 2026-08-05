import React from 'react'
import { ChevronDown } from 'lucide-react'
import Terminal from '@/components/Landing/Terminal'

const LandingPage = () => {
  return (
      <>
      <div className='bg-[url("src/assets/background.png")] bg-cover bg-center  min-h-screen antialiased select-none'>
   <nav className="fixed top-5 left-1/2 z-50 w-[92%] max-w-7xl -translate-x-1/2">
      <div className="flex h-16 items-center justify-between rounded-[22px] border border-white/5 bg-transparent px-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      
        <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
          <img src="/src/assets/hydralogo.png" alt="" className='h-10 w-10 border rounded-3xl' />  
          Hydra
        </h1>

        {/* Nav Links */}
        <div className="flex items-center gap-10 text-sm text-white/80">
          <a href="#" className="transition hover:text-white">
            About
          </a>

          <button className="flex items-center gap-1 transition hover:text-white">
            Trading
            <ChevronDown size={14} />
          </button>

          <a href="#" className="transition hover:text-white">
            Contact
          </a>

          <a href="#" className="transition hover:text-white">
            FAQ
          </a>

          <button className="flex items-center gap-1 transition hover:text-white">
            ENG
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10">
            Login
          </button>

          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-neutral-200">
            Sign up
          </button>
        </div>
      </div>
    </nav>

    <div className='flex flex-col justify-center text-center gap-3 py-33 max-w-5xl mx-auto text-center gap-7 items-center' >
      <h1 className="font-geist text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.06em] leading-[0.92] text-white">
  Catch Every
  <br />
  Visual Regression.
  <br />
</h1>
 <h2 className='text-3xl'> Before Your Users Do. </h2>

   <Terminal/>

    </div>

    <footer>

    </footer>

    </div>
    </>
  )
}

export default LandingPage
