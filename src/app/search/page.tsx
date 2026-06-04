'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [watches, setWatches] = useState<Watch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) return
    const fetchResults = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('watches')
        .select('*')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
      if (data) setWatches(data)
      setLoading(false)
    }
    fetchResults()
  }, [query])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-14 md:pt-16">
      <Navbar />
      <div className="px-4 md:px-10 py-10 md:py-16 border-b border-white/5">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-3">Results for</p>
        <h1 className="text-3xl md:text-5xl font-thin tracking-wide">"{query}"</h1>
      </div>

      <div className="px-4 md:px-10 py-8 md:py-16">
        {loading ? (
          <div className="text-center py-32 text-white/20 text-sm tracking-widest uppercase">Searching...</div>
        ) : watches.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-white/20 text-sm tracking-widest uppercase mb-4">No results found</p>
            <a href="/hyperclone" className="text-xs tracking-widest uppercase border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-all duration-300">
              Browse all watches
            </a>
          </div>
        ) : (
          <>
            <p className="text-xs tracking-widest uppercase text-white/20 mb-6">
              {watches.length} {watches.length === 1 ? 'watch' : 'watches'} found
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
              {watches.map(watch => (
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
                  <h3 className="text-sm font-light mb-2">{watch.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light">€{watch.price.toLocaleString()}</span>
                    <span className="text-xs tracking-[0.2em] uppercase border border-white/20 px-3 py-1 group-hover:bg-white group-hover:text-black transition-all duration-300">View</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}