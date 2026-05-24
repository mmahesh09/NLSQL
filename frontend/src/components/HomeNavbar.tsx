"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Products', href: '#features' },
  { name: 'Customers', href: '#stats' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Learn', href: '/docs' },
];

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        animate={{
          backgroundColor: scrolled ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 4h10M2.5 7.5h6M2.5 11h7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-montserrat text-[15px] font-bold tracking-tight text-white">
                QueryAI
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-2 text-sm text-white/55 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/kaveri"
                className="text-sm text-white/55 hover:text-white transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/kaveri"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-16 z-40 glass-nav border-b border-white/8 px-4 py-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-base text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 flex gap-3 border-t border-white/8 pt-4">
              <Link href="/kaveri" className="flex-1 text-center py-2 text-sm text-white/60 hover:text-white">
                Login
              </Link>
              <Link
                href="/kaveri"
                className="flex-1 text-center rounded-lg bg-cyan-500 py-2 text-sm font-semibold text-black"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
