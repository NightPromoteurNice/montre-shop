'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'Mistigri64+'

const BRANDS = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Omega',
  'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Panerai', 'Breitling',
  'TAG Heuer', 'Hublot', 'Vacheron Constantin', 'A. Lange & Söhne',
  'Blancpain', 'Breguet', 'Chopard', 'Franck Muller', 'Bell & Ross',
  'Tudor', 'Longines', 'Zenith', 'Girard-Perregaux', 'MB&F'
]

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  image_url: string
}

type Variant = {
  color: string
  stock: string
  images: File[]
  previews: string[]
}

type FormType = {
  name: string
  brand: string
  price: string
  description: string
  category: string
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [tab, setTab] = useState<'add' | 'manage'>('add')
  const [watches, setWatches] = useState<Watch[]>([])
  const [form, setForm] = useState<FormType>({
    name: '', brand: '', price: '', description: '', category: 'hyperclone'
  })
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchWatches = async () => {
    const { data } = await supabase.from('watches').select('*').order('created_at', { ascending: false })
    if (data) setWatches(data)
  }

  useEffect(() => {
    if (authenticated) fetchWatches()
  }, [authenticated])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) setAuthenticated(true)
    else {
      setWrongPassword(true)
      setTimeout(() => setWrongPassword(false), 2000)
    }
  }

  const handleBrandInput = (value: string) => {
    setForm({ ...form, brand: value })
    if (value.length > 0) {
      const suggestions = BRANDS.filter(b => b.toLowerCase().startsWith(value.toLowerCase()))
      setBrandSuggestions(suggestions.slice(0, 5))
    } else {
      setBrandSuggestions([])
    }
  }

  const selectBrand = (brand: string) => {
    setForm({ ...form, brand })
    setBrandSuggestions([])
  }

  const addVariant = () => {
    setVariants([...variants, { color: '', stock: '1', images: [], previews: [] }])
  }

  const updateVariantColor = (index: number, value: string) => {
    const updated = [...variants]
    updated[index].color = value
    setVariants(updated)
  }

  const updateVariantStock = (index: number, value: string) => {
    const updated = [...variants]
    updated[index].stock = value
    setVariants(updated)
  }

  const addVariantImages = (index: number, files: FileList) => {
    const updated = [...variants]
    const newFiles = Array.from(files)
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    updated[index].images = [...updated[index].images, ...newFiles].slice(0, 10)
    updated[index].previews = [...updated[index].previews, ...newPreviews].slice(0, 10)
    setVariants(updated)
  }

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].images = updated[variantIndex].images.filter((_, i) => i !== imageIndex)
    updated[variantIndex].previews = updated[variantIndex].previews.filter((_, i) => i !== imageIndex)
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random()}.${ext}`
    const { data, error } = await supabase.storage.from('Watches').upload(filename, file, { contentType: file.type })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('Watches').getPublicUrl(filename)
      return urlData.publicUrl
    }
    return ''
  }

  const handleEdit = (watch: Watch) => {
    setEditingId(watch.id)
    setForm({
      name: watch.name,
      brand: watch.brand,
      price: watch.price.toString(),
      description: watch.description,
      category: watch.category
    })
    setVariants([])
    setTab('add')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', brand: '', price: '', description: '', category: 'hyperclone' })
    setVariants([])
  }

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.price) return
    setLoading(true)

    if (editingId) {
      await supabase.from('watches').update({
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        description: form.description,
        category: form.category,
      }).eq('id', editingId)

      if (variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i]
          const { data: variantData } = await supabase.from('variants').insert([{
            watch_id: editingId,
            color: variant.color,
            stock: parseInt(variant.stock),
            image_url: ''
          }]).select().single()

          if (variantData) {
            let firstUrl = ''
            for (let j = 0; j < variant.images.length; j++) {
              const imageUrl = await uploadImage(variant.images[j])
              await supabase.from('watch_images').insert([{
                variant_id: variantData.id,
                image_url: imageUrl,
                position: j
              }])
              if (j === 0) firstUrl = imageUrl
            }
            if (firstUrl) {
              await supabase.from('variants').update({ image_url: firstUrl }).eq('id', variantData.id)
              await supabase.from('watches').update({ image_url: firstUrl }).eq('id', editingId)
            }
          }
        }
      }
      setEditingId(null)
    } else {
      const { data: watchData, error } = await supabase.from('watches').insert([{
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        description: form.description,
        category: form.category,
        image_url: '',
        stock: variants.length
      }]).select().single()

      if (!error && watchData) {
        let firstImageUrl = ''
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i]
          const { data: variantData } = await supabase.from('variants').insert([{
            watch_id: watchData.id,
            color: variant.color,
            stock: parseInt(variant.stock),
            image_url: ''
          }]).select().single()

          if (variantData) {
            for (let j = 0; j < variant.images.length; j++) {
              const imageUrl = await uploadImage(variant.images[j])
              await supabase.from('watch_images').insert([{
                variant_id: variantData.id,
                image_url: imageUrl,
                position: j
              }])
              if (i === 0 && j === 0) firstImageUrl = imageUrl
            }
            if (variant.images.length > 0) {
              const firstVariantImage = await uploadImage(variant.images[0])
              await supabase.from('variants').update({ image_url: firstVariantImage }).eq('id', variantData.id)
            }
          }
        }
        if (firstImageUrl) {
          await supabase.from('watches').update({ image_url: firstImageUrl }).eq('id', watchData.id)
        }
      }
    }

    setLoading(false)
    setSuccess(true)
    setForm({ name: '', brand: '', price: '', description: '', category: 'hyperclone' })
    setVariants([])
    setTimeout(() => setSuccess(false), 3000)
    fetchWatches()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('watches').delete().eq('id', id)
    fetchWatches()
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-full max-w-sm px-10">
          <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4 text-center">Back Office</p>
          <h1 className="text-3xl font-thin mb-12 text-center">Admin Access</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Password"
            className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20 mb-4" />
          {wrongPassword && <p className="text-xs tracking-widest uppercase text-red-400 mb-4">Wrong password</p>}
          <button onClick={handleLogin} className="w-full border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Enter
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      <div className="max-w-3xl mx-auto px-10 py-16">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4">Back Office</p>
        <h1 className="text-4xl font-thin mb-10">Admin</h1>

        <div className="flex gap-4 mb-12">
          {(['add', 'manage'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); handleCancelEdit() }}
              className={`px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-colors ${
                tab === t ? 'border-white text-white' : 'border-white/20 text-white/40 hover:border-white/40'
              }`}>
              {t === 'add' ? (editingId ? 'Edit Watch' : 'Add Watch') : 'Manage Watches'}
            </button>
          ))}
        </div>

        {tab === 'add' ? (
          <div className="flex flex-col gap-6">
            {editingId && (
              <div className="border border-yellow-400/30 bg-yellow-400/5 px-6 py-4 flex items-center justify-between">
                <p className="text-xs tracking-widest uppercase text-yellow-400">Editing existing watch</p>
                <button onClick={handleCancelEdit} className="text-xs text-white/40 hover:text-white transition-colors">Cancel</button>
              </div>
            )}

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Category</label>
              <div className="flex gap-4">
                {['hyperclone', '1:1'].map(cat => (
                  <button key={cat} onClick={() => setForm({...form, category: cat})}
                    className={`px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-colors ${
                      form.category === cat ? 'border-white text-white' : 'border-white/20 text-white/40 hover:border-white/40'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Brand</label>
              <input type="text" value={form.brand} onChange={e => handleBrandInput(e.target.value)}
                placeholder="Type a brand..."
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
              {brandSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#111] border border-white/10 z-10">
                  {brandSuggestions.map(brand => (
                    <button key={brand} onClick={() => selectBrand(brand)}
                      className="w-full text-left px-6 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      {brand}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Rolex', 'Patek Philippe', 'Omega', 'Cartier', 'AP', 'Hublot', 'Richard Mille'].map(b => (
                  <button key={b} onClick={() => selectBrand(b === 'AP' ? 'Audemars Piguet' : b)}
                    className="text-xs px-3 py-1 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors">
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Model Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Day-Date 40, Submariner..."
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
            </div>

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Price (€)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                placeholder="2500"
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
            </div>

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Watch details..." rows={4}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20 resize-none" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs tracking-[0.3em] uppercase text-white/40">
                  {editingId ? 'Add New Color Variants' : 'Color Variants'}
                </label>
                <button onClick={addVariant} className="text-xs tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300">
                  + Add Color
                </button>
              </div>

              {variants.length === 0 && (
                <p className="text-xs text-white/20 tracking-widest">
                  {editingId ? 'Add new color variants — existing ones are kept' : 'No variants — click "Add Color" to add one'}
                </p>
              )}

              {variants.map((variant, i) => (
                <div key={i} className="border border-white/10 p-6 mb-4">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2 block">Color name</label>
                      <input type="text" value={variant.color}
                        onChange={e => updateVariantColor(i, e.target.value)}
                        placeholder="Black, Blue, Green..."
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Black', 'White', 'Blue', 'Green', 'Grey', 'Gold', 'Silver', 'Champagne'].map(c => (
                          <button key={c} onClick={() => updateVariantColor(i, c)}
                            className="text-xs px-2 py-1 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors">
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-32">
                      <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2 block">Stock</label>
                      <input type="number" value={variant.stock}
                        onChange={e => updateVariantStock(i, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40" />
                    </div>
                  </div>

                  <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">
                    Photos ({variant.images.length}/10)
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {variant.previews.map((preview, j) => (
                      <div key={j} className="relative aspect-square">
                        <img src={preview} className="w-full h-full object-cover border border-white/10" />
                        <button onClick={() => removeVariantImage(i, j)}
                          className="absolute top-1 right-1 bg-black/80 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-500 transition-colors">
                          ×
                        </button>
                      </div>
                    ))}
                    {variant.images.length < 10 && (
                      <label className="aspect-square border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                        <span className="text-white/20 text-xl">+</span>
                        <input type="file" accept="image/*" multiple onChange={e => {
                          if (e.target.files) addVariantImages(i, e.target.files)
                        }} className="hidden" />
                      </label>
                    )}
                  </div>

                  <button onClick={() => removeVariant(i)} className="text-xs tracking-widest uppercase text-red-400/60 hover:text-red-400 transition-colors">
                    Remove variant
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="mt-4 border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40">
              {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Add Watch'}
            </button>

            {success && (
              <p className="text-xs tracking-widest uppercase text-green-400">
                {editingId ? 'Watch updated ✓' : 'Watch added successfully ✓'}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-white/5">
            {watches.length === 0 ? (
              <div className="text-center py-16 text-white/20 text-sm tracking-widest uppercase">No watches yet</div>
            ) : watches.map(watch => (
              <div key={watch.id} className="bg-[#0a0a0a] p-6 flex items-center gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  {watch.image_url ? (
                    <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border border-white/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs tracking-widest uppercase text-white/30 mb-1 truncate">{watch.brand} — {watch.category}</p>
                  <p className="font-light truncate">{watch.name}</p>
                </div>
                <p className="font-light text-sm hidden md:block">€{watch.price.toLocaleString()}</p>
                <button onClick={() => handleEdit(watch)}
                  className="text-xs tracking-widest uppercase border border-white/20 text-white/50 hover:border-white hover:text-white px-3 md:px-4 py-2 transition-colors flex-shrink-0">
                  Edit
                </button>
                <button onClick={() => handleDelete(watch.id)}
                  className="text-xs tracking-widests uppercase border border-red-400/30 text-red-400/60 hover:border-red-400 hover:text-red-400 px-3 md:px-4 py-2 transition-colors flex-shrink-0">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}