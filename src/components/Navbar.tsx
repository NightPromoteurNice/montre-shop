'use client'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex items-center bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
        {/* Desktop */}
        <div className="hidden md:flex h-16 w-full items-center">
          <div className="flex h-16">
            <a href="/11" className="flex items-center px-10 h-full text-sm tracking-[0.2em] uppercase border-r border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
              1:1
            </a>
            <a href="/hyperclone" className="flex items-center px-10 h-full text-sm tracking-[0.2em] uppercase border-r border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
              Hyperclone
            </a>
          </div>
          <div className="flex-1 flex justify-center">
            <a href="/" className="text-base tracking-[0.4em] uppercase font-light hover:text-white/60 transition-colors">Watches</a>
          </div>
          <div className="flex h-16">
            <a href="/cart" className="flex items-center gap-2 px-10 h-full text-sm tracking-[0.2em] uppercase border-l border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
              Cart {count > 0 && <span className="bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">{count}</span>}
            </a>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden h-14 w-full items-center justify-between px-6">
          <a href="/" className="text-sm tracking-[0.3em] uppercase font-light">Watches</a>
          <div className="flex items-center gap-4">
            <a href="/cart" className="relative text-white/70">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/70 hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="fixed top-14 left-0 w-full bg-[#0a0a0a] border-b border-white/10 z-40 md:hidden">
          <a href="/11" onClick={() => setMenuOpen(false)}
            className="flex items-center px-6 py-4 text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white border-b border-white/5 transition-colors">
            1:1
          </a>
          <a href="/hyperclone" onClick={() => setMenuOpen(false)}
            className="flex items-center px-6 py-4 text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">
            Hyperclone
          </a>
        </div>
      )}
    </>
  )
}