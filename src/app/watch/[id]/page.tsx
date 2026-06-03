'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

type Variant = {
  id: string
  color: string
  stock: number
  image_url: string
  images: { image_url: string; position: number }[]
}

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  variants: Variant[]
}

export default function WatchPage() {
  const params = useParams()
  const id = params.id as string
  const [watch, setWatch] = useState<Watch | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    if (!id) return
    const fetchWatch = async () => {
      setLoading(true)

      const { data: watchData } = await supabase
        .from('watches')
        .select('*')
        .eq('id', id)
        .single()

      if (!watchData) { setLoading(false); return }

      const { data: variantsData } = await supabase
        .from('variants')
        .select('*')
        .eq('watch_id', id)

      const variantsWithImages = await Promise.all(
        (variantsData || []).map(async (v) => {
          const { data: images } = await supabase
            .from('watch_images')
            .select('*')
            .eq('variant_id', v.id)
            .order('position')
          return { ...v, images: images || [] }
        })
      )

      const fullWatch = { ...watchData, variants: variantsWithImages }
      setWatch(fullWatch)

      if (variantsWithImages.length > 0) {
        setSelectedVariant(variantsWithImages[0])
        const firstImage = variantsWithImages[0].images[0]?.image_url || variantsWithImages[0].image_url
        setSelectedImage(firstImage || null)
      }
      setLoading(false)
    }
    fetchWatch()
  }, [id])

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant)
    const firstImage = variant.images[0]?.image_url || variant.image_url
    setSelectedImage(firstImage || null)
  }

  const handleAdd = () => {
    if (!watch || !selectedVariant) return
    addItem({
      id: `${watch.id}-${selectedVariant.color}`,
      name: `${watch.name} — ${selectedVariant.color}`,
      brand: watch.brand,
      price: watch.price,
      image_url: selectedImage || ''
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <Navbar />
      <p className="text-white/20 text-xs tracking-widest uppercase">Loading...</p>
    </main>
  )

  if (!watch) return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <Navbar />
      <p className="text-white/20 text-xs tracking-widest uppercase">Watch not found</p>
    </main>
  )

  const allImages = selectedVariant?.images.length
    ? selectedVariant.images.map(i => i.image_url)
    : selectedVariant?.image_url ? [selectedVariant.image_url] : []

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-10 py-16">
        <a href={`/${watch.category}`} className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors mb-12 block">
          ← Back
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white/3 border border-white/5 mb-4 overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt={watch.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-white/20" />
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(img)}
                    className={`aspect-square overflow-hidden border transition-colors ${
                      selectedImage === img ? 'border-white' : 'border-white/10 hover:border-white/30'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-3">{watch.brand}</p>
            <h1 className="text-4xl font-thin mb-2">{watch.name}</h1>
            <p className="text-2xl font-thin text-white/70 mb-8">€{watch.price.toLocaleString()}</p>
            <p className="text-sm text-white/50 leading-relaxed mb-10">{watch.description}</p>

            {watch.variants.length > 0 && (
              <div className="mb-10">
                <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block">
                  Color — <span className="text-white">{selectedVariant?.color}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {watch.variants.map(variant => (
                    <button key={variant.id} onClick={() => handleVariantSelect(variant)}
                      className={`px-6 py-2 text-xs tracking-[0.2em] uppercase border transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-white text-white'
                          : 'border-white/20 text-white/40 hover:border-white/40'
                      } ${variant.stock === 0 ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                      disabled={variant.stock === 0}>
                      {variant.color}{variant.stock === 0 ? ' — Out of stock' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedVariant && (
              <p className="text-xs tracking-widest uppercase mb-8 text-white/40">
                {selectedVariant.stock > 0
                  ? `In stock — ${selectedVariant.stock} available`
                  : 'Out of stock'}
              </p>
            )}

            <button onClick={handleAdd}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full py-4 text-xs tracking-[0.3em] uppercase border transition-all duration-300 ${
                added ? 'border-green-400 text-green-400' : 'border-white/20 hover:bg-white hover:text-black'
              } disabled:opacity-30 disabled:cursor-not-allowed`}>
              {added ? 'Added to cart ✓' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}