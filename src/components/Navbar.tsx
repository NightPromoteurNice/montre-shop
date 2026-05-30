'use client'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { count } = useCart()

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
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
    </nav>
  )
}