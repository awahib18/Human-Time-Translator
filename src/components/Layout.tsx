import { Outlet, Link, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Time Translator', path: '/' },
    { name: 'Dates Between', path: '/days-between-dates' },
    { name: 'Age Calculator', path: '/age-calculator' },
    { name: 'Days Since', path: '/days-since' },
    { name: 'Countdown', path: '/countdown' },
    { name: 'Directory', path: '/directory' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col overflow-x-hidden relative selection:bg-indigo-500/30">
      
      {/* Structural Detail: Corner Accents */}
      <div className="fixed top-0 left-0 w-2 h-2 border-t border-l border-indigo-500 z-50 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-2 h-2 border-t border-r border-indigo-500 z-50 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-2 h-2 border-b border-l border-indigo-500 z-50 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-2 h-2 border-b border-r border-indigo-500 z-50 pointer-events-none"></div>

      {/* Header: Geometric & Structured */}
      <header className="border-b border-slate-800 p-6 flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 z-10 relative bg-slate-900/80 backdrop-blur-md sticky top-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-indigo-500 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-indigo-400 transition-colors">
            <div className="w-4 h-4 border-2 border-white"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Human Time Translator</h1>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors border ${
                location.pathname === link.path || location.pathname.startsWith(link.path) && link.path !== '/'
                  ? 'border-indigo-500/50 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col z-10 relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer: System Metadata */}
      <footer className="border-t border-slate-800 p-6 flex flex-col lg:flex-row lg:justify-between items-start lg:items-end text-[11px] font-mono gap-6 z-10 relative bg-slate-900">
        <div className="flex flex-col gap-1">
          <div className="text-slate-500">COMPUTATION_ENGINE: STATELESS_JS</div>
          <div className="text-slate-500">LATENCY: &lt;0.01ms</div>
        </div>
        
        <div className="lg:w-64 lg:text-right">
          <p className="text-slate-400 leading-relaxed">
            Human Time processes deterministic temporal algorithms instantaneously. Data remains strictly localized within standard browser memory.
          </p>
        </div>
      </footer>

    </div>
  );
}
