import { useState, useEffect, type ReactNode } from 'react';
import { 
  Search, Menu, X, ChevronRight,
  Sparkles, AlertCircle, Info, Zap,
  Cpu, Layers, CheckCircle2,
  XCircle, ArrowRight,
  ShieldAlert, Crown, Bot,
  Terminal, Check, Copy, LayoutTemplate
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import architectureImg from '../assets/architecture.png';
import hydraLogo from '../assets/hydralogo.png';

// Stand-in Link component as requested
const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

// --- TYPES ---
interface NavItem {
  id: string;
  label: string;
  isNew?: boolean;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

// --- CONSTANTS ---
const NAVIGATION: NavCategory[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'core-concepts', label: 'Core Concepts' },
      { id: 'architecture', label: 'Architecture' }
    ]
  },
  {
    title: 'CLI Reference',
    items: [
      { id: 'installation', label: 'Installation & Usage' },
      { id: 'flag-reference', label: 'Flag Reference' }
    ]
  },
  {
    title: 'Authentication',
    items: [
      { id: 'byok', label: 'BYOK (Bring Your Own Key)' }
    ]
  },
  {
    title: 'CI/CD Integration',
    items: [
      { id: 'github-actions', label: 'GitHub Actions' }
    ]
  },
  {
    title: 'Visual Debugger',
    items: [
      { id: 'interactive-debugger', label: 'Interactive Debugger' }
    ]
  },
  {
    title: 'Hydra Pro',
    items: [
      { id: 'auto-healing', label: 'Auto-Healing Agent', isNew: true },
      { id: 'tier-comparison', label: 'Tier Comparison' }
    ]
  }
];

const GITHUB_YAML = `name: Hydra Visual Regression Tests

on:
  pull_request:
    branches: [ "main" ]

permissions:
  contents: write
  pull-requests: write

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build Application
        run: npm run build
        
      - name: Start Staging Server
        run: npm run preview &
        env:
          PORT: 5173
          
      - name: Wait for server
        run: npx wait-on http://localhost:5173
        
      - name: Run Hydra Visual Tests
        run: npx --package=@itzaks/hydra-visual-cli hydra-visual-cli
        env:
          HYDRA_PROJECT_ID: \${{ secrets.HYDRA_PROJECT_ID }}
          HYDRA_API_KEY: \${{ secrets.HYDRA_API_KEY }}
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}`;

// --- UI COMPONENTS ---

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex items-center justify-center rounded border border-[#1e1e22] bg-[#111113] px-1.5 py-0.5 text-xs font-medium text-[#a0a0ab] shadow-sm">
    {children}
  </kbd>
);

const Badge = ({ children, variant = 'default' }: { children: ReactNode, variant?: 'default' | 'pro' | 'success' | 'warning' }) => {
  const variants = {
    default: 'bg-[#111113] text-[#a0a0ab] border-[#1e1e22]',
    pro: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

const CodeBlock = ({ code, language = 'bash', showLineNumbers = false }: { code: string, language?: string, showLineNumbers?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-[#1e1e22] bg-[#0c0c0e]">
      <div className="flex items-center justify-between border-b border-[#1e1e22] bg-[#0a0a0c] px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#63636e]" />
          <span className="text-xs font-medium text-[#63636e] uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[#63636e] transition-colors hover:bg-[#1e1e22] hover:text-[#fafafa]"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#fafafa] font-mono">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {code.split('\n').map((line, i) => (
                <tr key={i} className="hover:bg-[#111113]/50">
                  <td className="w-8 select-none pr-4 text-right text-[#63636e]">{i + 1}</td>
                  <td className="whitespace-pre">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

const Callout = ({ title, children, variant = 'note', icon: CustomIcon }: { title?: string, children: ReactNode, variant?: 'note' | 'tip' | 'important' | 'warning', icon?: any }) => {
  const variants = {
    note: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/50',
      icon: <Info className="mt-0.5 h-5 w-5 text-blue-400 flex-shrink-0" />,
      titleColor: 'text-blue-400'
    },
    tip: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/50',
      icon: <Zap className="mt-0.5 h-5 w-5 text-emerald-400 flex-shrink-0" />,
      titleColor: 'text-emerald-400'
    },
    important: {
      bg: 'bg-violet-500/5',
      border: 'border-violet-500/50',
      icon: <AlertCircle className="mt-0.5 h-5 w-5 text-violet-400 flex-shrink-0" />,
      titleColor: 'text-violet-400'
    },
    warning: {
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/50',
      icon: <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-400 flex-shrink-0" />,
      titleColor: 'text-amber-400'
    }
  };

  const active = variants[variant];
  const renderedIcon = CustomIcon ? <CustomIcon className={`mt-0.5 h-5 w-5 ${active.titleColor} flex-shrink-0`} /> : active.icon;

  return (
    <div className={`my-6 flex gap-4 rounded-xl border-l-2 border-y border-r border-y-[#1e1e22] border-r-[#1e1e22] ${active.bg} ${active.border} p-4`}>
      {renderedIcon}
      <div className="flex flex-col gap-1">
        {title && <h5 className={`font-semibold ${active.titleColor}`}>{title}</h5>}
        <div className="text-[14px] leading-relaxed text-[#a0a0ab]">
          {children}
        </div>
      </div>
    </div>
  );
};

const StepItem = ({ number, title, children, isLast = false }: { number: number, title: string, children: ReactNode, isLast?: boolean }) => (
  <div className="relative flex gap-6 pb-8">
    {!isLast && (
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[#1e1e22]" />
    )}
    <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#1e1e22] bg-[#0a0a0c] text-sm font-semibold text-[#fafafa] shadow-sm">
      {number}
    </div>
    <div className="flex flex-col gap-2 pt-1">
      <h4 className="font-semibold text-[#fafafa]">{title}</h4>
      <div className="text-[14px] leading-relaxed text-[#a0a0ab]">
        {children}
      </div>
    </div>
  </div>
);

const Card = ({ 
  category,
  title, 
  description, 
  icon: Icon, 
  badge,
  stat,
  statSub,
  href,
  accentColor = 'amber'
}: { 
  category?: string;
  title: string; 
  description: string; 
  icon: any; 
  badge?: string;
  stat?: string;
  statSub?: string;
  href?: string;
  accentColor?: 'amber' | 'emerald' | 'violet' | 'blue';
}) => {
  const accentStyles = {
    amber: {
      box: 'bg-yellow-400/10 border-yellow-400/70 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]',
      hover: 'hover:border-yellow-500/40',
    },
    emerald: {
      box: 'bg-yellow-400/10 border-yellow-400/70 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]',
      hover: 'hover:border-yellow-500/40',
    },
    violet: {
      box: 'bg-yellow-400/10 border-yellow-400/70 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]',
      hover: 'hover:border-yellow-500/40',
    },
    blue: {
      box: 'bg-yellow-400/10 border-yellow-400/70 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]',
      hover: 'hover:border-yellow-500/40',
    }
  }[accentColor];

  const content = (
    <div className={`group relative flex h-full flex-col justify-between rounded-2xl border border-[#1e1e24] bg-[#0a0a0d] p-6 transition-all duration-200 hover:bg-[#0e0e12] ${accentStyles.hover}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-none border ${accentStyles.box}`}>
            <Icon size={18} />
          </div>
          {badge && (
            <span className="rounded-full border border-[#27272a] bg-[#121215] px-2.5 py-0.5 text-[10px] font-medium text-[#a0a0ab]">
              {badge}
            </span>
          )}
        </div>

        {category && (
          <p className="text-[10px] font-mono font-semibold tracking-[0.18em] text-[#71717a] uppercase mb-1.5">
            {category}
          </p>
        )}

        <h3 className="text-base font-bold text-white tracking-tight mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>

        <p className="text-xs text-[#a0a0ab] leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {(stat || href) && (
        <div className="mt-6 pt-4 border-t border-[#1a1a1e] flex items-center justify-between">
          {stat && (
            <div>
              <span className="text-2xl font-bold font-mono text-white tracking-tight">{stat}</span>
              {statSub && <span className="ml-2 text-xs text-[#71717a]">{statSub}</span>}
            </div>
          )}
          {href && (
            <div className="flex items-center text-xs font-semibold text-[#a0a0ab] group-hover:text-violet-400 transition-colors ml-auto">
              Learn more <ArrowRight size={13} className="ml-1.5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href} className="block h-full">{content}</Link> : content;
};

// --- MAIN PAGE COMPONENT ---

export default function Docs() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
          if (id && id !== activeSection) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Handle command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80; // Offset for header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(id);
    setIsSidebarOpen(false);
  };

  // Flatten nav items for command palette search
  const allNavItems = NAVIGATION.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.title })));
  const searchResults = allNavItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1e1e22] bg-[#09090b]/80 px-4 backdrop-blur-md md:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center justify-center rounded-md p-2 text-[#a0a0ab] hover:bg-[#111113] hover:text-[#fafafa] lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black border border-[#1e1e24] overflow-hidden p-0.5 shadow-sm">
              <img src={hydraLogo} alt="Hydra Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">Hydra</span>
            <Badge>v1.0</Badge>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden h-9 w-64 items-center justify-between rounded-lg border border-[#1e1e22] bg-[#111113] px-3 text-sm text-[#a0a0ab] transition-colors hover:border-[#63636e]/50 hover:text-[#fafafa] md:flex"
          >
            <span className="flex items-center gap-2">
              <Search size={14} />
              Search docs...
            </span>
            <div className="flex gap-1">
              <Kbd>⌘</Kbd><Kbd>K</Kbd>
            </div>
          </button>
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e1e22] bg-[#111113] text-[#a0a0ab] md:hidden"
          >
            <Search size={16} />
          </button>
          
          <Link href="https://github.com" className="text-[#a0a0ab] transition-colors hover:text-[#fafafa]">
            <FaGithub className="size-5" />
          </Link>
        </div>
      </header>

      {/* COMMAND PALETTE MODAL */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh]">
          <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm" onClick={() => setIsCommandPaletteOpen(false)} />
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[#1e1e22] bg-[#0a0a0c] shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center border-b border-[#1e1e22] px-4 py-3">
              <Search size={18} className="text-[#63636e]" />
              <input 
                type="text" 
                placeholder="Search documentation..."
                className="w-full bg-transparent px-3 py-1 text-sm text-[#fafafa] placeholder:text-[#63636e] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button onClick={() => setIsCommandPaletteOpen(false)} className="rounded p-1 text-[#63636e] hover:bg-[#111113] hover:text-[#fafafa]">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[#a0a0ab] hover:bg-[#111113] hover:text-[#fafafa]"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-[#63636e]">{item.category}</span>
                      </span>
                      <ChevronRight size={14} className="text-[#63636e]" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-12 text-center text-sm text-[#63636e]">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 border-t border-[#1e1e22] bg-[#111113] px-4 py-2.5 text-xs text-[#63636e]">
              <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> to navigate</span>
              <span className="flex items-center gap-1"><Kbd>↵</Kbd> to select</span>
              <span className="flex items-center gap-1"><Kbd>ESC</Kbd> to close</span>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-8xl items-start">
        {/* MOBILE SIDEBAR OVERLAY */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-[#09090b]/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto border-r border-[#1e1e22] bg-[#0a0a0c] pt-16 transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col gap-8 p-6">
            {NAVIGATION.map((category, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#a0a0ab]">
                  {category.title}
                </h4>
                <ul className="flex flex-col gap-1">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`group flex w-full items-center justify-between rounded-md border-l-2 px-3 py-1.5 text-sm transition-colors ${
                          activeSection === item.id 
                            ? 'border-violet-500 bg-violet-500/10 text-violet-400 font-medium' 
                            : 'border-transparent text-[#a0a0ab] hover:bg-[#111113] hover:text-[#fafafa]'
                        }`}
                      >
                        {item.label}
                        {item.isNew && (
                          <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold text-violet-400">
                            NEW
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-6 py-12 md:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-4xl">
            
            {/* 1. INTRODUCTION */}
            <section id="introduction" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">Getting Started</span>
                <h1 className="text-4xl font-extrabold tracking-tight text-[#fafafa] sm:text-5xl">Introduction</h1>
                <p className="text-lg leading-relaxed text-[#a0a0ab]">
                  Hydra is an open-source visual regression testing platform. It compares your Staging and Production environments pixel by pixel, helping you catch UI regressions before they ship.
                </p>
              </div>

              <Callout title="Prerequisites" variant="note">
                Before you begin, ensure you have <strong>Node.js 18+</strong> installed, an active Hydra project at <Link href="https://hydra.dev" className="text-blue-400 hover:underline">hydra.dev</Link>, and a reachable staging URL.
              </Callout>

              <div className="my-12">
                <h3 className="mb-8 text-2xl font-bold tracking-tight text-[#fafafa]">Quick Start</h3>
                <div className="pl-2">
                  <StepItem number={1} title="Create your project">
                    Sign up at hydra.dev and create a new project workspace.
                  </StepItem>
                  <StepItem number={2} title="Get your credentials">
                    Navigate to Developer Settings and copy your <Kbd>Project ID</Kbd> and <Kbd>API Key</Kbd>.
                  </StepItem>
                  <StepItem number={3} title="Install the Hydra CLI package">
                    Download and install our CLI package via terminal:
                    <CodeBlock 
                      code="npm i @itzaks/hydra-visual-cli"
                      language="bash"
                    />
                  </StepItem>
                  <StepItem number={4} title="Run your first scan">
                    Execute the CLI scan against your project URL:
                    <CodeBlock 
                      code="npx --package=@itzaks/hydra-visual-cli hydra-visual-cli --project <PROJECT_ID> --key <API_KEY> --geminiKey <GEMINI_KEY>"
                      language="bash"
                    />
                  </StepItem>
                  <StepItem number={5} title="Review the report" isLast>
                    Click the generated link in your terminal to view the visual diff report at <code className="rounded bg-[#111113] px-1.5 py-0.5 text-xs text-violet-400">/runs/:runId</code>.
                  </StepItem>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 mt-12">
                <div className="rounded-2xl border border-[#1e1e24] bg-[#0a0a0d] p-6 transition-all duration-200 hover:border-yellow-500/40 hover:bg-[#0e0e12]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-none border border-yellow-400/70 bg-yellow-400/10 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]">
                    <Zap size={20} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-white">Free Core</h3>
                  <p className="text-xs text-[#a0a0ab] leading-relaxed">
                    Everything you need for personal projects and small teams. Includes visual diffing and basic CI/CD.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#2d1f47] bg-[#0f0b18] p-6 transition-all duration-200 hover:border-yellow-500/40 hover:bg-[#130e22]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-none border border-yellow-400/70 bg-yellow-400/10 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]">
                    <Crown size={20} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-white">Hydra Pro</h3>
                  <p className="text-xs text-[#a0a0ab] leading-relaxed">
                    Enterprise-grade features including the Auto-Healing Agent, advanced SSO, and premium support.
                  </p>
                </div>
              </div>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 2. CORE CONCEPTS */}
            <section id="core-concepts" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">Getting Started</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Core Concepts</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Understanding how Hydra captures, analyzes, and reports on visual changes.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3 mt-8">
                <Card 
                  category="PIXEL COMPARISON"
                  title="Compare screenshots with pixel-level precision."
                  description="Puppeteer headless browsers capture staging & production under identical viewports simultaneously, freezing CSS animations for perfect consistency."
                  icon={LayoutTemplate}
                  accentColor="amber"
                />
                <Card 
                  category="HEATMAPS"
                  title="Instantly see where your UI changed."
                  description="Our customized Pixelmatch engine performs raw pixel comparison, outputting high-contrast diff heatmaps that highlight even 1px shifts."
                  icon={Cpu}
                  accentColor="amber"
                  badge="per scan"
                />
                <Card 
                  category="DOM INSPECTOR"
                  title="Trace diffs back to source code elements."
                  description="Bounding-rect coordinates of changed pixels are traced back to exact HTML DOM selectors (e.g., button.submit-btn) for rapid debugging."
                  icon={Search}
                  accentColor="amber"
                />
              </div>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 3. ARCHITECTURE */}
            <section id="architecture" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">Getting Started</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Architecture</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  The high-level data flow of a Hydra test run.
                </p>
              </div>

              <div className="my-8 overflow-hidden rounded-2xl border border-[#1e1e24] bg-[#07070a] shadow-2xl p-2 sm:p-4">
                <img 
                  src={architectureImg} 
                  alt="Hydra Pipeline Architecture Diagram" 
                  className="w-full h-auto object-contain block rounded-xl"
                />
              </div>

              <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                The process consists of 4 main stages: First, the CLI invokes a headless browser controller to snapshot both environments. Second, images are sent to the Pixelmatch engine while raw assets are stored. Third, visual differences are mapped back to DOM elements. Finally, results are published to the Hydra Cloud Dashboard where Pro users can leverage the Auto-Healing agent to generate automatic CSS fixes.
              </p>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 4. INSTALLATION & USAGE */}
            <section id="installation" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">CLI Reference</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Installation & Usage</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Run Hydra directly via npx or install it as a dev dependency in your project.
                </p>
              </div>

              <div className="mb-4 border-b border-[#1e1e22]">
                <nav className="-mb-px flex gap-6">
                  <button className="border-b-2 border-violet-500 pb-2 text-sm font-medium text-violet-400">npm</button>
                </nav>
              </div>

              <div className="my-6">
                <p className="mb-3 text-sm font-semibold text-[#fafafa]">1. Install via npm:</p>
                <CodeBlock 
                  code="npm i @itzaks/hydra-visual-cli"
                  language="bash"
                />
              </div>

              <div className="my-6">
                <p className="mb-3 text-sm font-semibold text-[#fafafa]">2. Run scan command:</p>
                <CodeBlock 
                  code="npx --package=@itzaks/hydra-visual-cli hydra-visual-cli --project <YOUR_PROJECT_ID> --key <YOUR_API_KEY> --geminiKey <YOUR_GEMINI_KEY> --stagingUrl http://localhost:5173 --productionUrl https://your-app.com"
                  language="bash"
                />
              </div>

              <p className="mt-8 mb-4 text-[15px] font-medium text-[#fafafa]">Expected Output:</p>
              <CodeBlock 
                code={`[Hydra] Starting visual regression scan...
[Hydra] Target: http://localhost:5173 vs https://your-app.com
[Hydra] Capturing viewports (1920x1080)...
[Hydra] Analyzing pixels... 142px variance detected (0.01%)
[Hydra] Uploading assets to cloud...
[Hydra] ✅ Scan complete.
[Hydra] View report: https://hydra.dev/project/p_123/runs/r_456`}
                language="log"
              />
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 5. FLAG REFERENCE */}
            <section id="flag-reference" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">CLI Reference</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Flag Reference</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Configuration options available for the CLI tool.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#1e1e22] bg-[#0a0a0c]">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1e1e22] bg-[#111113]">
                    <tr>
                      <th className="px-4 py-3 font-medium text-[#a0a0ab]">Flag</th>
                      <th className="px-4 py-3 font-medium text-[#a0a0ab]">Required</th>
                      <th className="px-4 py-3 font-medium text-[#a0a0ab]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e22]">
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400">--project</td>
                      <td className="px-4 py-3"><Badge variant="warning">Yes</Badge></td>
                      <td className="px-4 py-3 text-[#a0a0ab]">Your Hydra Project ID.</td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400">--key</td>
                      <td className="px-4 py-3"><Badge variant="warning">Yes</Badge></td>
                      <td className="px-4 py-3 text-[#a0a0ab]">Your Hydra API Key.</td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400">--stagingUrl</td>
                      <td className="px-4 py-3"><Badge>No</Badge></td>
                      <td className="px-4 py-3 text-[#a0a0ab]">Override the default staging URL.</td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400">--productionUrl</td>
                      <td className="px-4 py-3"><Badge>No</Badge></td>
                      <td className="px-4 py-3 text-[#a0a0ab]">Override the default production URL.</td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400">--geminiKey</td>
                      <td className="px-4 py-3"><Badge variant="warning">Yes (First Run)</Badge></td>
                      <td className="px-4 py-3 text-[#a0a0ab]">Required on first run if not configured in dashboard. Auto-saved to project on initial scan.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 6. BYOK */}
            <section id="byok" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">Authentication</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">BYOK (Bring Your Own Key)</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Hydra uses AI to generate CSS fixes for visual regressions. You can bring your own Gemini API key for unlimited analysis.
                </p>
              </div>

              <Callout title="Auto-Save Feature" variant="tip" icon={Bot}>
                When you pass <Kbd>--geminiKey</Kbd> via the CLI for the first time, our backend automatically securely encrypts and saves it to your MongoDB cluster for future runs.
              </Callout>

              <h3 className="mt-12 mb-8 text-xl font-bold tracking-tight text-[#fafafa]">3-Tier Cascading Resolution</h3>
              <div className="pl-2">
                <StepItem number={1} title="CLI Parameter (Highest Priority)">
                  Passed directly at runtime via <code className="text-violet-400 bg-violet-400/10 px-1 rounded">--geminiKey &lt;KEY&gt;</code>.
                </StepItem>
                <StepItem number={2} title="Project Saved Key">
                  Stored securely in your project configuration (<code className="text-violet-400 bg-violet-400/10 px-1 rounded">project.geminiApiKey</code>) from Developer Settings.
                </StepItem>
                <StepItem number={3} title="Server Fallback (Lowest Priority)" isLast>
                  Hydra's global environment fallback (<code className="text-violet-400 bg-violet-400/10 px-1 rounded">process.env.GEMINI_API_KEY</code>). Rate limited.
                </StepItem>
              </div>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 7. GITHUB ACTIONS */}
            <section id="github-actions" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">CI/CD Integration</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">GitHub Actions</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Automate visual regression testing on every pull request.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                <div className="flex flex-col gap-2 rounded-lg border border-[#1e1e22] bg-[#0a0a0c] p-4">
                  <span className="text-xs text-[#63636e] uppercase tracking-wider">Secret 1</span>
                  <code className="text-sm font-medium text-emerald-400">HYDRA_PROJECT_ID</code>
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-[#1e1e22] bg-[#0a0a0c] p-4">
                  <span className="text-xs text-[#63636e] uppercase tracking-wider">Secret 2</span>
                  <code className="text-sm font-medium text-emerald-400">HYDRA_API_KEY</code>
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-[#1e1e22] bg-[#0a0a0c] p-4">
                  <span className="text-xs text-[#63636e] uppercase tracking-wider">Secret 3</span>
                  <code className="text-sm font-medium text-emerald-400">GEMINI_API_KEY</code>
                </div>
              </div>

              <Callout title="Permissions Required" variant="important">
                Ensure your workflow includes <code className="text-violet-400 bg-violet-400/10 px-1 rounded">permissions: contents: write</code> and <code className="text-violet-400 bg-violet-400/10 px-1 rounded">pull-requests: write</code> if you intend to use the Auto-Healing feature to commit fixes directly to your repository.
              </Callout>

              <CodeBlock 
                code={GITHUB_YAML}
                language="yaml"
                showLineNumbers={true}
              />
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 8. INTERACTIVE DEBUGGER */}
            <section id="interactive-debugger" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">Visual Debugger</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Interactive Debugger</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Analyze visual changes using our specialized dashboard tools.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3 mb-12">
                <Card 
                  category="SPLIT VIEW"
                  title="Side-by-side Inspection"
                  description="Side-by-side comparison of Staging and Production with synchronized scrolling."
                  icon={Columns}
                  accentColor="blue"
                />
                <Card 
                  category="OVERLAY VIEW"
                  title="Opacity Slider Alignment"
                  description="Opacity-controlled slider to perfectly align and overlay the two screenshots."
                  icon={Layers}
                  accentColor="violet"
                />
                <Card 
                  category="DIFF HEATMAP"
                  title="Sub-Pixel Drift Highlighting"
                  description="High-contrast neon pink overlay highlighting exact pixel variations."
                  icon={Activity}
                  accentColor="amber"
                />
              </div>

              <Callout title="AI Assistant Included" variant="tip">
                The Interactive Debugger includes an AI Assistant available on all tiers (Free & Pro) that analyzes visual diffs and suggests exact CSS rules to resolve layout regressions.
              </Callout>

              <h3 className="mt-12 mb-6 text-lg font-bold text-[#fafafa]">Keyboard Shortcuts</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#0a0a0c] px-4 py-3">
                  <span className="text-sm text-[#a0a0ab]">Toggle Split View</span>
                  <div className="flex gap-1"><Kbd>S</Kbd></div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#0a0a0c] px-4 py-3">
                  <span className="text-sm text-[#a0a0ab]">Toggle Overlay View</span>
                  <div className="flex gap-1"><Kbd>O</Kbd></div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#0a0a0c] px-4 py-3">
                  <span className="text-sm text-[#a0a0ab]">Toggle Diff Heatmap</span>
                  <div className="flex gap-1"><Kbd>D</Kbd></div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#0a0a0c] px-4 py-3">
                  <span className="text-sm text-[#a0a0ab]">Open AI Chat</span>
                  <div className="flex gap-1"><Kbd>⌘</Kbd><Kbd>J</Kbd></div>
                </div>
              </div>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 9. AUTO-HEALING AGENT */}
            <section id="auto-healing" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex flex-col gap-4">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">
                    Hydra Pro <Badge variant="pro">Feature</Badge>
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Auto-Healing Agent</h2>
                  <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                    Hydra doesn't just find visual bugs—it writes the code to fix them.
                  </p>
                </div>
              </div>

              <div className="my-12">
                <div className="pl-2">
                  <StepItem number={1} title="Detect">
                    Pixelmatch engine identifies the visual regression.
                  </StepItem>
                  <StepItem number={2} title="Locate">
                    DOM Boundary Inspector maps the changed pixels to the source CSS selector.
                  </StepItem>
                  <StepItem number={3} title="Repair">
                    Gemini AI agent analyzes the staging HTML/CSS and generates a surgical patch.
                  </StepItem>
                  <StepItem number={4} title="Commit" isLast>
                    Hydra uses your GitHub App token to push a new candidate branch to your repo.
                  </StepItem>
                </div>
              </div>

              <Callout title="Candidate Branch Protection" variant="note">
                Hydra operates safely. It will <strong>never</strong> push directly to your main branch. All fixes are pushed to isolated branches prefixed with <code className="text-blue-400 bg-blue-400/10 px-1 rounded">hydra-fix/layout-regressions</code> and a pull request is automatically opened for your review.
              </Callout>
            </section>

            <hr className="my-16 border-[#1e1e22]" />

            {/* 10. TIER COMPARISON */}
            <section id="tier-comparison" className="mb-24 scroll-mt-24">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a0a0ab]">Hydra Pro</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#fafafa]">Tier Comparison</h2>
                <p className="text-[15px] leading-relaxed text-[#a0a0ab]">
                  Choose the right plan for your team's visual testing needs.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#1e1e22] bg-[#0a0a0c]">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1e1e22] bg-[#111113]">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-[#fafafa]">Feature</th>
                      <th className="px-6 py-4 font-semibold text-emerald-400 text-center">Free Core</th>
                      <th className="px-6 py-4 font-semibold text-violet-400 text-center flex items-center justify-center gap-2">
                        <Sparkles size={14} /> Pro Tier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e22]">
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#a0a0ab]">Visual Diff Heatmap</td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-500" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-500" /></td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#a0a0ab]">DOM Boundary Detection</td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-500" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-500" /></td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#a0a0ab]">CLI Scan</td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-500" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-500" /></td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#a0a0ab]">GitHub Actions CI/CD</td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-500" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-500" /></td>
                    </tr>
                    <tr className="hover:bg-[#111113]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#a0a0ab]">AI Chatbot & CSS Suggestions</td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-500" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-500" /></td>
                    </tr>
                    <tr className="bg-violet-500/5 hover:bg-violet-500/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-violet-200 flex items-center gap-2">
                        Auto-Healing Agent <Badge variant="pro">Pro</Badge>
                      </td>
                      <td className="px-6 py-4 text-center"><XCircle size={18} className="mx-auto text-[#63636e]" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-400" /></td>
                    </tr>
                    <tr className="bg-violet-500/5 hover:bg-violet-500/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-violet-200">Candidate Git Branch</td>
                      <td className="px-6 py-4 text-center"><XCircle size={18} className="mx-auto text-[#63636e]" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-400" /></td>
                    </tr>
                    <tr className="bg-violet-500/5 hover:bg-violet-500/10 transition-colors border-b border-[#1e1e22]">
                      <td className="px-6 py-4 font-medium text-violet-200">Write Permission Git Push</td>
                      <td className="px-6 py-4 text-center"><XCircle size={18} className="mx-auto text-[#63636e]" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-violet-400" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* PREV/NEXT NAVIGATION (Example static for end of page) */}
            <div className="mt-16 flex items-center justify-between border-t border-[#1e1e22] pt-8">
              <button className="group flex flex-col gap-1 text-left">
                <span className="text-xs font-medium text-[#63636e] uppercase tracking-wider">Previous</span>
                <span className="flex items-center font-medium text-[#a0a0ab] transition-colors group-hover:text-violet-400">
                  <ChevronRight size={16} className="mr-1 rotate-180" /> Getting Started
                </span>
              </button>
              <button className="group flex flex-col gap-1 text-right">
                <span className="text-xs font-medium text-[#63636e] uppercase tracking-wider">Next</span>
                <span className="flex items-center font-medium text-[#a0a0ab] transition-colors group-hover:text-violet-400">
                  API Reference <ChevronRight size={16} className="ml-1" />
                </span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Icons needed that weren't in initial import but used in code:
const Columns = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
const Activity = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;