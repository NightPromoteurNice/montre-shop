'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Filters from '@/components/Filters'

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  image_url: string
}

type FiltersType = {
  brands: string[]
  colors: string[]
  minPrice: number
  maxPrice: number
}

export default function Hyperclone() {
  const [watches, setWatches] = useState<Watch[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FiltersType>({
    brands: [], colors: [], minPrice: 0, maxPrice: 999999
  })

  useEffect(() => {
    const fetchWatches = async () => {
      const { data } = await supabase.from('watches').select('*').eq('category', 'hyperclone')
      if (data) setWatches(data)
    }
    fetchWatches()
  }, [])

  const filtered = watches.filter(w => {
    if (filters.brands.length > 0 && !filters.brands.includes(w.brand)) return false
    if (w.price < filters.minPrice || w.price > filters.maxPrice) return false
    return true
  })

  const activeCount = filters.brands.length + filters.colors.length +
    (filters.minPrice > 0 || filters.maxPrice < 999999 ? 1 : 0)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-14 md:pt-16">
      <Navbar />

      <div className="px-4 md:px-10 py-10 md:py-16 border-b border-white/5 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-3">Collection</p>
          <h1 className="text-3xl md:text-5xl font-thin tracking-wide">Hyperclone</h1>
        </div>
        <button onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 border border-white/20 px-4 py-2 text-xs tracking-widest uppercase text-white/50 hover:text-white hover:border-white/40 transition-colors mb-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filters {activeCount > 0 && <span className="bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
        </button>
      </div>

      <div className="flex">
        {/* Filters panel */}
        <div className="hidden md:block w-64 flex-shrink-0 px-10 py-8 border-r border-white/5 sticky top-16 h-screen overflow-y-auto">
          <Filters filters={filters} onChange={setFilters} isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile filters */}
        <Filters filters={filters} onChange={setFilters} isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

        {/* Watches grid */}
        <div className="flex-1 px-4 md:px-10 py-8 md:py-16">
          <p className="text-xs tracking-widest uppercase text-white/20 mb-6">
            {filtered.length} {filtered.length === 1 ? 'watch' : 'watches'}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-32 text-white/20 text-sm tracking-widest uppercase">
              No watches found
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {filtered.map(watch => (
                <a href={`/watch/${watch.id}`} key={watch.id} className="bg-[#0a0a0a] p-4 md:p-6 hover:bg-[#111] transition-colors group cursor-pointer block">
                  <div className="aspect-square bg-white/3 mb-4 overflow-hidden border border-white/5">
                    {watch.image_url ? (
                      <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-white/20" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs tracking-[0.2em] text-white/30 mb-1 uppercase">{watch.brand}</p>
                  <h3 className="text-sm md:text-base font-light mb-2">{watch.name}</h3>
                  <p className="text-xs text-white/40 mb-3 line-clamp-2">{watch.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-light">€{watch.price.toLocaleString()}</span>
                    <span className="text-xs tracking-[0.2em] uppercase border border-white/20 px-3 py-1 group-hover:bg-white group-hover:text-black transition-all duration-300">
                      View
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}