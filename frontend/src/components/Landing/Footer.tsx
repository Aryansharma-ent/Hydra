import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Documentation', href: '/docs' },
      { label: 'CLI', href: 'https://www.npmjs.com/package/@itzaks/hydra-visual-cli' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Docker Hub', href: 'https://hub.docker.com/u/yesitzaks' },
      { label: 'npm', href: 'https://www.npmjs.com/package/@itzaks/hydra-visual-cli' },
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
    <footer className="bg-[#050505] border-t border-white/[0.03]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 select-none">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                <span className="text-[8px] font-black text-white leading-none">H</span>
              </div>
              <span className="text-sm font-semibold text-white/80 tracking-wide">Hydra</span>
            </Link>
            <p className="text-[12px] text-white/15 leading-relaxed font-light">
              Open-source visual regression testing.<br />
              Compare. Detect. Auto-fix.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] mb-4">
                {col.title}
              </p>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[13px] text-white/20 hover:text-white/50 transition-colors duration-200 font-light"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/10 font-light">
            © {new Date().getFullYear()} Hydra. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['GitHub', 'Twitter', 'Discord'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[11px] text-white/10 hover:text-white/30 transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
