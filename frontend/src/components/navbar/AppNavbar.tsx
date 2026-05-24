"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Menu, X, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Kaveri', href: '/kaveri' },
  { name: 'Docs', href: '/docs' },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 6,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 3,
    });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      {/* Floating pill */}
      <motion.div
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        animate={{
          scale: scrolled ? 0.97 : 1,
          rotateX: mousePos.y,
          rotateY: mousePos.x,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
        className="w-full max-w-3xl"
      >
        <div
          className="flex items-center justify-between rounded-full border border-white/10 px-3 py-2 shadow-xl shadow-black/30"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 pl-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/25">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3.5h9M2 6.5h5.5M2 9.5h7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-montserrat text-sm font-bold text-white tracking-tight hidden sm:block">
              NLSQL
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-sm rounded-full transition-all duration-200 font-medium ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 shrink-0">
            {/* GitHub */}
            <motion.a
              href="https://github.com/mmahesh09/NLSQL"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1.5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/8 transition-colors"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/maheshbabu23/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1.5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/8 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </motion.a>

            {/* Theme toggle */}
            <div className="px-0.5">
              <ThemeToggle />
            </div>

            {/* Get Started */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/kaveri"
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-shadow"
              >
                Get Started
                <ExternalLink className="h-3 w-3" />
              </Link>
            </motion.div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="mt-2 rounded-2xl border border-white/10 p-3 shadow-xl"
              style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/8 mt-2 pt-2 flex items-center justify-between px-2">
                <div className="flex gap-3">
                  <a href="https://github.com/mmahesh09/NLSQL" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/maheshbabu23/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <Link
                  href="/kaveri"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-black"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
