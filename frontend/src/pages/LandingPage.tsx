import { ChevronDown } from 'lucide-react'
import { FaGithub } from "react-icons/fa";
import Terminal from '@/components/Landing/Terminal'
import bgImage from '../assets/background.png'
import hydraLogo from '../assets/hydralogo.png'
import { motion } from "framer-motion";

const LandingPage = () => {

       const words = ["Catch", "Every", "Visual", "Regression."];
  return (
    <>
    <div 
         style={{ backgroundImage: `url(${bgImage})` }}
      className="bg-cover bg-center min-h-screen antialiased select-none bg-[#050507] text-white"
    >
      <nav className="fixed top-5 left-1/2 z-50 w-[92%] max-w-7xl -translate-x-1/2">
        <div className="flex h-16 items-center justify-between rounded-[22px] border border-white/5 bg-transparent px-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        
          <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <img src={hydraLogo} alt="Hydra" className="h-10 w-10 border rounded-3xl object-contain" />  
            Hydra
          </h1>

          {/* Nav Links */}
          <div className="flex items-center gap-10 text-sm text-white/80">
            <a href="#" className="transition hover:text-white">
              About
            </a>


            <a href="#" className="transition hover:text-white">
              Contact
            </a>


            <a href="#" className="transition hover:text-white">
              Features
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

      <div className="flex flex-col justify-center text-center gap-7 pt-36 pb-16 max-w-5xl mx-auto items-center">
<motion.h1
  className="
    text-4xl
    sm:text-7xl
    lg:text-8xl
    fira-sans-regular
    tracking-[-0.06em]
    leading-[0.95]
    text-white
    max-w-3xl
    mx-auto
    text-center
    flex
    flex-wrap
    justify-center
    gap-x-4
    gap-y-2
  "
>
  {words.map((word, i) => (
    <motion.span
      key={word}
      className={
        word === "Regression."
          ? "drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]"
          : ""
      }
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: i * 0.12,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {word}
    </motion.span>
  ))}
</motion.h1>


       <motion.h2
  initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{
    delay: 0.35,
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="text-3xl text-white/90 fira-sans-regular"
>
  Before Your Users Do.
</motion.h2>


      <motion.h3
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    delay: 0.55,
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="
    max-w-xl
    mx-auto
    text-xl
    lg:text-xm
    leading-8
    text-zinc-400
    font-normal
    tracking-wide
    
  "
>
  Captures. Diff heatmaps. Code fixes.
  <br />
  The ultimate visual regression testing toolkit.
  </motion.h3>
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    delay: 0.8,
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="mt-2 flex items-center justify-center gap-5"
>
  {/* Primary */}
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="
      rounded-full
      bg-white
      px-8
      py-3.5
      font-medium
      text-black
      transition-all
      duration-300
      hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]
    "
  >
    Start Free →
  </motion.button>

  {/* Secondary */}
  <motion.a
    href="https://github.com/Aryansharma-ent/Hydra"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="
      group
      flex
      items-center
      gap-2
      rounded-full
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      px-8
      py-3.5
      font-medium
      text-white/90
      transition-all
      duration-300
      hover:border-blue-500/30
      hover:bg-white/10
      hover:text-white
    "
  >
    <FaGithub className="h-5 w-5" />
    View on GitHub
  </motion.a>
</motion.div>



       {/* <motion.div
  initial={{ opacity: 0, y: 35, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    delay: 0.8,
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  <Terminal />
</motion.div> */}
      </div>


    </div>

      <div className='bg-black h-50 ' >
        hi
      </div>

      <footer className="py-12 text-center text-xs text-white/30 font-mono">
        © {new Date().getFullYear()} Hydra. All rights reserved.
      </footer>
      </>
  )
}

export default LandingPage
