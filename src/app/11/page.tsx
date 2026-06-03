'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  image_url: string
}

export default function OneToOne() {
  const [watches, setWatches] = useState<Watch[]>([])
  const [selectedBrand, setSelectedBrand] = useState('All')

  useEffect(() => {
    const fetchWatches = async () => {
      const { data } = await supabase
        .from('watches')
        .select('*')
        .eq('category', '1:1')
      if (data) setWatches(data)
    }
    fetchWatches()
  }, [])

  const brands = ['All', ...Array.from(new Set(watches.map(w => w.brand)))]
  const filtered = selectedBrand === 'All' ? watches : watches.filter(w => w.brand === selectedBrand)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-14 md:pt-16">
      <Navbar />
      <div className="px-4 md:px-10 py-10 md:py-16 border-b border-white/5">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-3">Collection</p>
        <h1 className="text-3xl md:text-5xl font-thin tracking-wide">1:1</h1>
      </div>

      <div className="px-4 md:px-10 py-4 flex gap-3 overflow-x-auto border-b border-white/5">
        {brands.map(brand => (
          <button key={brand} onClick={() => setSelectedBrand(brand)}
            className={`text-xs tracking-[0.2em] uppercase px-4 md:px-6 py-2 border transition-colors whitespace-nowrap ${
              selectedBrand === brand
                ? 'border-white text-white'
                : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'
            }`}>
            {brand}
          </button>
        ))}
      </div>

      <div className="px-4 md:px-10 py-8 md:py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-32 text-white/20 text-sm tracking-widest uppercase">
            No watches available yet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {filtered.map(watch => (
              <a href={`/watch/${watch.id}`} key={watch.id} className="bg-[#0a0a0a] p-4 md:p-8 hover:bg-[#111] transition-colors group cursor-pointer block">
                <div className="aspect-square bg-white/3 mb-4 md:mb-6 overflow-hidden border border-white/5">
                  {watch.image_url ? (
                    <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/20" />
                    </div>
                  )}
                </div>
                <p className="text-xs tracking-[0.2em] text-white/30 mb-1 uppercase">{watch.brand}</p>
                <h3 className="text-sm md:text-lg font-light mb-2">{watch.name}</h3>
                <p className="text-xs md:text-sm text-white/40 mb-3 md:mb-6 line-clamp-2">{watch.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-lg font-light">€{watch.price.toLocaleString()}</span>
                  <span className="text-xs tracking-[0.2em] uppercase border border-white/20 px-3 md:px-6 py-1 md:py-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    View
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}