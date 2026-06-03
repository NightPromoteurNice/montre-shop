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

export default function Home() {
  const { count } = useCart()
  const [watches, setWatches] = useState<Watch[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchWatches = async () => {
      const { data } = await supabase.from('watches').select('*').not('image_url', 'is', null).limit(10)
      if (data && data.length > 0) setWatches(data)
    }
    fetchWatches()
  }, [])

  useEffect(() => {
    if (watches.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % watches.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [watches])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navbar */}
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
        <div className="flex h-16 items-center">
          {/* Icône montre */}
          <div className="px-6 border-l border-white/5 h-full flex items-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/50">
              <circle cx="12" cy="12" r="7"/>
              <circle cx="12" cy="12" r="9"/>
              <polyline points="12 8 12 12 14 14"/>
              <rect x="9" y="2" width="6" height="3" rx="1"/>
              <rect x="9" y="19" width="6" height="3" rx="1"/>
            </svg>
          </div>
          <a href="/cart" className="flex items-center gap-2 px-10 h-full text-sm tracking-[0.2em] uppercase border-l border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            Cart {count > 0 && <span className="bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">{count}</span>}
          </a>
        </div>
      </nav>

      {/* Hero avec carrousel */}
      <section className="relative min-h-screen flex items-center justify-center px-10 overflow-hidden">
        
        {/* Background carrousel */}
        {watches.length > 0 ? (
          <div className="absolute inset-0">
            {watches.map((watch, i) => (
              <div key={watch.id}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: i === currentIndex ? 1 : 0 }}>
                <img src={watch.image_url} alt={watch.name}
                  className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-black/70" />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
        )}

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

        {/* Indicateurs carrousel */}
        {watches.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {watches.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-white w-6' : 'bg-white/30'
                }`} />
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="px-10 pb-32">
        <div className="flex items-center gap-6 mb-16">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs tracking-[0.4em] uppercase text-white/30">Featured</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {watches.slice(0, 3).map(watch => (
            <a key={watch.id} href={`/watch/${watch.id}`} className="bg-[#0a0a0a] p-10 group cursor-pointer hover:bg-[#111] transition-colors block">
              <div className="aspect-square bg-white/3 mb-8 flex items-center justify-center border border-white/5 overflow-hidden">
                {watch.image_url ? (
                  <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-white/10" />
                  </div>
                )}
              </div>
              <p className="text-xs tracking-[0.3em] text-white/30 mb-2 uppercase">{watch.brand}</p>
              <h3 className="text-lg font-light tracking-wide mb-4">{watch.name}</h3>
              <p className="text-sm text-white/50">€{watch.price.toLocaleString()}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}