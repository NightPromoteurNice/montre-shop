'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Admin() {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: 'hyperclone',
    image_url: '',
    stock: '1'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase.from('watches').insert([{
      name: form.name,
      brand: form.brand,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category,
      image_url: form.image_url,
      stock: parseInt(form.stock)
    }])
    setLoading(false)
    if (!error) {
      setSuccess(true)
      setForm({ name: '', brand: '', price: '', description: '', category: 'hyperclone', image_url: '', stock: '1' })
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      <div className="max-w-2xl mx-auto px-10 py-16">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4">Back Office</p>
        <h1 className="text-4xl font-thin mb-16">Add a Watch</h1>

        <div className="flex flex-col gap-6">
          {/* Category */}
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

          {/* Brand */}
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

          {/* Name */}
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

          {/* Price */}
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

          {/* Description */}
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

          {/* Image URL */}
          <div>
            <label className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">Image URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={e => setForm({...form, image_url: e.target.value})}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/40 placeholder:text-white/20"
            />
          </div>

          {/* Submit */}
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