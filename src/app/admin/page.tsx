'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'Mistigri64+'

type Watch = {
  id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  image_url: string
  stock: number
}

type Variant = {
  color: string
  stock: string
  image: File | null
  preview: string | null
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [tab, setTab] = useState<'add' | 'manage'>('add')
  const [watches, setWatches] = useState<Watch[]>([])
  const [form, setForm] = useState({
    name: '', brand: '', price: '', description: '', category: 'hyperclone', stock: '1'
  })
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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

  const addVariant = () => {
    setVariants([...variants, { color: '', stock: '1', image: null, preview: null }])
  }

  const updateVariant = (index: number, field: keyof Variant, value: string | File | null) => {
    const updated = [...variants]
    if (field === 'image' && value instanceof File) {
      updated[index].image = value
      updated[index].preview = URL.createObjectURL(value)
    } else if (field !== 'image' && field !== 'preview') {
      (updated[index] as Record<string, string>)[field] = value as string
    }
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random()}.${ext}`
    const { data, error } = await supabase.storage.from('watches').upload(filename, file, { contentType: file.type })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('watches').getPublicUrl(filename)
      return urlData.publicUrl
    }
    return ''
  }

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.price) return
    setLoading(true)

    const { data: watchData, error } = await supabase.from('watches').insert([{
      name: form.name, brand: form.brand, price: parseFloat(form.price),
      description: form.description, category: form.category,
      image_url: variants[0]?.preview ? '' : '',
      stock: parseInt(form.stock)
    }]).select().single()

    if (!error && watchData) {
      for (const variant of variants) {
        let image_url = ''
        if (variant.image) image_url = await uploadImage(variant.image)
        await supabase.from('variants').insert([{
          watch_id: watchData.id,
          color: variant.color,
          stock: parseInt(variant.stock),
          image_url
        }])
      }

      if (variants.length > 0 && variants[0].image) {
        const firstImageUrl = await uploadImage(variants[0].image)
        await supabase.from('watches').update({ image_url: firstImageUrl }).eq('id', watchData.id)
      }
    }

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setForm({ name: '', brand: '', price: '', description: '', category: 'hyperclone', stock: '1' })
      setVariants([])
      setTimeout(() => setSuccess(false), 3000)
      fetchWatches()
    }
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
            <button key={t} onClick={() => setTab(t)}
              className={`px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-colors ${
                tab === t ? 'border-white text-white' : 'border-white/20 text-white/40 hover:border-white/40'
              }`}>
              {t === 'add' ? 'Add Watch' : 'Manage Watches'}
            </button>
          ))}
        </div>

        {tab === 'add' ? (
          <div className="flex flex-col gap-6">
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

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Brand</label>
              <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                placeholder="Rolex, Patek Philippe..." className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
            </div>

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Model Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Submariner Date..." className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
            </div>

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Price (€)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                placeholder="2500" className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
            </div>

            <div>
              <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Watch details..." rows={4} className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20 resize-none" />
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs tracking-[0.3em] uppercase text-white/40">Color Variants</label>
                <button onClick={addVariant} className="text-xs tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300">
                  + Add Color
                </button>
              </div>

              {variants.length === 0 && (
                <p className="text-xs text-white/20 tracking-widest">No variants — click "Add Color" to add one</p>
              )}

              {variants.map((variant, i) => (
                <div key={i} className="border border-white/10 p-6 mb-4">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2 block">Color name</label>
                      <input type="text" value={variant.color}
                        onChange={e => updateVariant(i, 'color', e.target.value)}
                        placeholder="Black, Blue, Green..."
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20" />
                    </div>
                    <div className="w-32">
                      <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2 block">Stock</label>
                      <input type="number" value={variant.stock}
                        onChange={e => updateVariant(i, 'stock', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40" />
                    </div>
                  </div>

                  <label className="w-full border border-dashed border-white/20 px-6 py-6 flex flex-col items-center gap-3 cursor-pointer hover:border-white/40 transition-colors mb-4">
                    {variant.preview ? (
                      <img src={variant.preview} className="w-32 h-32 object-cover" />
                    ) : (
                      <>
                        <span className="text-white/20 text-2xl">+</span>
                        <span className="text-xs tracking-widest uppercase text-white/30">Upload photo</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) updateVariant(i, 'image', file)
                    }} className="hidden" />
                  </label>

                  <button onClick={() => removeVariant(i)} className="text-xs tracking-widest uppercase text-red-400/60 hover:text-red-400 transition-colors">
                    Remove variant
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="mt-4 border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40">
              {loading ? 'Adding...' : 'Add Watch'}
            </button>

            {success && <p className="text-xs tracking-widest uppercase text-green-400">Watch added successfully ✓</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-white/5">
            {watches.length === 0 ? (
              <div className="text-center py-16 text-white/20 text-sm tracking-widest uppercase">No watches yet</div>
            ) : watches.map(watch => (
              <div key={watch.id} className="bg-[#0a0a0a] p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  {watch.image_url ? (
                    <img src={watch.image_url} alt={watch.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border border-white/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs tracking-widest uppercase text-white/30 mb-1">{watch.brand} — {watch.category}</p>
                  <p className="font-light">{watch.name}</p>
                </div>
                <p className="font-light text-sm">€{watch.price.toLocaleString()}</p>
                <button onClick={() => handleDelete(watch.id)}
                  className="text-xs tracking-widest uppercase border border-red-400/30 text-red-400/60 hover:border-red-400 hover:text-red-400 px-4 py-2 transition-colors ml-4">
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