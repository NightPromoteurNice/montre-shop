'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  image_url: string
}

export default function Hyperclone() {
  const [watches, setWatches] = useState<Watch[]>([])
  const [selectedBrand, setSelectedBrand] = useState('All')

  useEffect(() => {
    const fetchWatches = async () => {
      const { data } = await supabase
        .from('watches')
        .select('*')
        .eq('category', 'hyperclone')
      if (data) setWatches(data)
    }
    fetchWatches()
  }, [])

  const brands = ['All', ...Array.from(new Set(watches.map(w => w.brand)))]
  const filtered = selectedBrand === 'All' ? watches : watches.filter(w => w.brand === selectedBrand)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      {/* Header */}
      <div className="px-10 py-16 border-b border-white/5">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4">Collection</p>
        <h1 className="text-5xl font-thin tracking-wide">Hyperclone</h1>
      </div>

      {/* Brand filters */}
      <div className="px-10 py-6 flex gap-4 overflow-x-auto border-b border-white/5">
        {brands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`text-xs tracking-[0.2em] uppercase px-6 py-2 border transition-colors whitespace-nowrap ${
              selectedBrand === brand
                ? 'border-white text-white'
                : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Watches grid */}
      <div className="px-10 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-32 text-white/20 text-sm tracking-widest uppercase">
            No watches available yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {filtered.map(watch => (
              <div key={watch.id} className="bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors group cursor-pointer">
                <div className="aspect-square bg-white/3 mb-6 overflow-hidden border border-white/5">
                  {watch.image_url ? (
                    <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border border-white/20" />
                    </div>
                  )}
                </div>
                <p className="text-xs tracking-[0.3em] text-white/30 mb-2 uppercase">{watch.brand}</p>
                <h3 className="text-lg font-light mb-2">{watch.name}</h3>
                <p className="text-sm text-white/40 mb-6 line-clamp-2">{watch.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-light">€{watch.price.toLocaleString()}</span>
                  <button className="text-xs tracking-[0.2em] uppercase border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}