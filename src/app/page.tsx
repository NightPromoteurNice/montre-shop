'use client'
import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  image_url: string
}

const WatchIcon = ({ style }: { style: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.8" className="absolute">
    <circle cx="12" cy="12" r="7"/>
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 8 12 12 14 14"/>
    <rect x="9" y="2" width="6" height="3" rx="1"/>
    <rect x="9" y="19" width="6" height="3" rx="1"/>
  </svg>
)

export default function Home() {
  const { count } = useCart()
  const [watches, setWatches] = useState<Watch[]>([])
  const [icons, setIcons] = useState<{ id: number; x: number; delay: number; duration: number; size: number }[]>([])

  useEffect(() => {
    const fetchWatches = async () => {
      const { data } = await supabase.from('watches').select('*').not('image_url', 'is', null).limit(6)
      if (data && data.length > 0) setWatches(data as Watch[])
    }
    fetchWatches()

    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 30 + Math.random() * 40
    }))
    setIcons(generated)
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* Mascotte bonhomme Rolex - coin haut droit */}
      <div className="fixed top-3 right-3 z-50 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <svg width="52" height="60" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="24" cy="10" rx="8" ry="9" fill="#c8a96e" stroke="#a07840" strokeWidth="1"/>
          <circle cx="20" cy="9" r="3" fill="white"/>
          <circle cx="21" cy="9" r="1.5" fill="#1a1a1a"/>
          <circle cx="21.5" cy="8.5" r="0.4" fill="white"/>
          <circle cx="28" cy="9" r="3" fill="white"/>
          <circle cx="29" cy="9" r="1.5" fill="#1a1a1a"/>
          <circle cx="29.5" cy="8.5" r="0.4" fill="white"/>
          <path d="M20 14 Q24 17 28 14" stroke="#7a4a1a" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <line x1="24" y1="19" x2="24" y2="38" stroke="#c8a96e" strokeWidth="3" strokeLinecap="round"/>
          <line x1="24" y1="24" x2="14" y2="30" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="24" y1="24" x2="36" y2="18" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="34" y="14" width="7" height="5" rx="1.5" fill="#d4af37" stroke="#a07820" strokeWidth="0.8"/>
          <circle cx="37.5" cy="16.5" r="1.5" fill="#1a1a1a"/>
          <line x1="37.5" y1="15.5" x2="37.5" y2="16.5" stroke="white" strokeWidth="0.5"/>
          <line x1="37.5" y1="16.5" x2="38.5" y2="16.5" stroke="white" strokeWidth="0.5"/>
          <line x1="24" y1="38" x2="16" y2="50" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="24" y1="38" x2="32" y2="50" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx="15" cy="51" rx="4" ry="2" fill="#a07840"/>
          <ellipse cx="33" cy="51" rx="4" ry="2" fill="#a07840"/>
        </svg>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 flex items-center bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
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

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-10 overflow-hidden">

        {/* Montres qui tombent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {icons.map(icon => (
            <WatchIcon key={icon.id} style={{
              left: `${icon.x}%`,
              top: '-60px',
              width: icon.size,
              height: icon.size,
              opacity: 0.06,
              animation: `fall ${icon.duration}s ${icon.delay}s linear infinite`
            }} />
          ))}
        </div>

        <style>{`
          @keyframes fall {
            0% { transform: translateY(-60px) rotate(0deg); opacity: 0; }
            10% { opacity: 0.08; }
            90% { opacity: 0.03; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        {/* Contenu hero */}
        <div className="text-center z-10 relative">
          <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-8">Collection 2025</p>
          <h1 className="text-[8vw] font-thin tracking-[-0.02em] leading-none mb-6">
            The Art of<br />
            <em className="font-light not-italic text-white/60">Time</em>
          </h1>
          <p className="text-sm tracking-[0.2em] text-white/40 max-w-xs mx-auto mb-16">
            Exceptional watches, timeless craftsmanship
          </p>
          <a href="/hyperclone" className="inline-block border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Explore
          </a>
        </div>
      </section>

      {/* Featured */}
      <section className="px-10 pb-32">
        <div className="flex items-center gap-6 mb-16">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs tracking-[0.4em] uppercase text-white/30">Featured</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        {watches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {watches.slice(0, 3).map(watch => (
              <a key={watch.id} href={`/watch/${watch.id}`} className="bg-[#0a0a0a] p-10 group cursor-pointer hover:bg-[#111] transition-colors block">
                <div className="aspect-square bg-white/3 mb-8 flex items-center justify-center border border-white/5 overflow-hidden">
                  <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-xs tracking-[0.3em] text-white/30 mb-2 uppercase">{watch.brand}</p>
                <h3 className="text-lg font-light tracking-wide mb-4">{watch.name}</h3>
                <p className="text-sm text-white/50">€{watch.price.toLocaleString()}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { name: "Chronograph I", ref: "REF. 001", price: "€4,200" },
              { name: "Automatic II", ref: "REF. 002", price: "€2,800" },
              { name: "Sport III", ref: "REF. 003", price: "€6,500" },
            ].map((watch) => (
              <div key={watch.ref} className="bg-[#0a0a0a] p-10 group cursor-pointer hover:bg-[#111] transition-colors">
                <div className="aspect-square bg-white/3 mb-8 flex items-center justify-center border border-white/5">
                  <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-white/10" />
                  </div>
                </div>
                <p className="text-xs tracking-[0.3em] text-white/30 mb-2">{watch.ref}</p>
                <h3 className="text-lg font-light tracking-wide mb-4">{watch.name}</h3>
                <p className="text-sm text-white/50">{watch.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}