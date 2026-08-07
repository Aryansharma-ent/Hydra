import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Documentation', href: '/docs' },
      {
        label: 'CLI',
        href: 'https://www.npmjs.com/package/@itzaks/hydra-visual-cli',
      },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com',
      },
      {
        label: 'npm Package',
        href: 'https://www.npmjs.com/package/@itzaks/hydra-visual-cli',
      },
      {
        label: 'Docker Hub',
        href: 'https://hub.docker.com/u/yesitzaks',
      },
      {
        label: 'Changelog',
        href: '#',
      },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Contribute', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'MIT License', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-[140px]" />

      {/* Top border */}
      <div className="h-px w-full bg-white/[0.08]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-24">

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.5fr_2.5fr]">

          {/* Brand */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              {/* Logo */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl  border-white/10 bg-white/[0.04] shadow-[0_0_30px_rgba(59,130,246,0.08)]">
                <span className="text-lg font-bold text-blue-400">
                  <img src="/src/assets/hydralogo.png" alt="" />
                </span>
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Hydra
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-6 text-white/40">
              Open-source visual regression testing for modern web
              applications.
            </p>

            <p className="mt-4 text-sm text-white/25">
              Compare. Detect. Auto-fix.
            </p>

            {/* GitHub CTA */}
         
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[11px] text-left font-bold uppercase tracking-[0.18em] text-white">
                  {column.title}
                </h3>

                <div className="mt-5 flex flex-col gap-3.5">
                  {column.links.map((link) => {
                    const external = link.href.startsWith('http')

                    return external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-1 text-sm text-white/45 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                        <span className="translate-y-[-1px] text-[10px] text-white/20 opacity-0 transition-opacity group-hover:opacity-100">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="group flex items-center gap-1 text-sm text-white/45 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                        {link.href.startsWith('#') && (
                          <span className="translate-y-[-1px] text-[10px] text-white/20 opacity-0 transition-opacity group-hover:opacity-100">
                            ↗
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-20 border-t border-white/[0.07] pt-7">
          <div className="flex flex-col gap-5 text-xs text-white/25 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">
              <span>
                © {new Date().getFullYear()} Hydra
              </span>

              <span className="h-1 w-1 rounded-full bg-white/20" />

              <span>
                Open source under MIT
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="transition-colors hover:text-white/60"
              >
                Privacy
              </a>

              <a
                href="#"
                className="transition-colors hover:text-white/60"
              >
                Terms
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white/60"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Giant subtle Hydra wordmark */}
      <div className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[18vw] font-black leading-none tracking-[-0.08em] text-white/[0.018]">
        HYDRA
      </div>
    </footer>
  )
}