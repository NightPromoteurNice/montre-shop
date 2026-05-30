'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'Mistigri64+'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: 'hyperclone',
    stock: '1'
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      setWrongPassword(true)
      setTimeout(() => setWrongPassword(false), 2000)
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.price) return
    setLoading(true)

    let image_url = ''

    if (image) {
      const ext = image.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('watches')
        .upload(filename, image, { contentType: image.type })
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('watches').getPublicUrl(filename)
        image_url = urlData.publicUrl
      }
    }

    const { error } = await supabase.from('watches').insert([{
      name: form.name,
      brand: form.brand,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category,
      image_url,
      stock: parseInt(form.stock)
    }])

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setForm({ name: '', brand: '', price: '', description: '', category: 'hyperclone', stock: '1' })
      setImage(null)
      setPreview(null)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-full max-w-sm px-10">
          <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4 text-center">Back Office</p>
          <h1 className="text-3xl font-thin mb-12 text-center">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20 mb-4"
          />
          {wrongPassword && (
            <p className="text-xs tracking-widest uppercase text-red-400 mb-4">Wrong password</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Enter
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      <div className="max-w-2xl mx-auto px-10 py-16">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4">Back Office</p>
        <h1 className="text-4xl font-thin mb-16">Add a Watch</h1>

        <div className="flex flex-col gap-6">
          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Category</label>
            <div className="flex gap-4">
              {['hyperclone', '1:1'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm({...form, category: cat})}
                  className={`px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-colors ${
                    form.category === cat ? 'border-white text-white' : 'border-white/20 text-white/40 hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={e => setForm({...form, brand: e.target.value})}
              placeholder="Rolex, Patek Philippe..."
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Model Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Submariner Date..."
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Price (€)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({...form, price: e.target.value})}
              placeholder="2500"
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Watch details..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20 resize-none"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Photo</label>
            <label className="w-full border border-dashed border-white/20 px-6 py-8 flex flex-col items-center gap-3 cursor-pointer hover:border-white/40 transition-colors">
              {preview ? (
                <img src={preview} className="w-40 h-40 object-cover" />
              ) : (
                <>
                  <span className="text-white/20 text-3xl">+</span>
                  <span className="text-xs tracking-widest uppercase text-white/30">Upload photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
          >
            {loading ? 'Adding...' : 'Add Watch'}
          </button>

          {success && (
            <p className="text-xs tracking-widest uppercase text-green-400">Watch added successfully ✓</p>
          )}
        </div>
      </div>
    </main>
  )
}