'use client'
export const dynamic = 'force-dynamic'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function Cart() {
  const { items, removeItem, total } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      <div className="max-w-2xl mx-auto px-10 py-16">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-4">Your Selection</p>
        <h1 className="text-4xl font-thin mb-16">Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-32 text-white/20 text-sm tracking-widest uppercase">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-px bg-white/5 mb-12">
              {items.map(item => (
                <div key={item.id} className="bg-[#0a0a0a] p-6 flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border border-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs tracking-widest uppercase text-white/30 mb-1">{item.brand}</p>
                    <p className="font-light">{item.name}</p>
                  </div>
                  <p className="font-light">€{item.price.toLocaleString()}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/20 hover:text-white transition-colors text-xs tracking-widest uppercase ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-12 border-t border-white/10 pt-6">
              <span className="text-xs tracking-widest uppercase text-white/40">Total</span>
              <span className="text-2xl font-thin">€{total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}