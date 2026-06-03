'use client'
export const dynamic = 'force-dynamic'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart()
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
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-14 md:pt-16">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 md:px-10 py-10 md:py-16">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-3">Your Selection</p>
        <h1 className="text-3xl md:text-4xl font-thin mb-10 md:mb-16">Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-32 text-white/20 text-sm tracking-widest uppercase">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-px bg-white/5 mb-8 md:mb-12">
              {items.map(item => (
                <div key={item.id} className="bg-[#0a0a0a] p-4 md:p-6 flex items-center gap-3 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border border-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs tracking-widest uppercase text-white/30 mb-1">{item.brand}</p>
                    <p className="font-light text-sm md:text-base truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2 border border-white/10">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors text-lg">
                      −
                    </button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors text-lg">
                      +
                    </button>
                  </div>
                  <p className="font-light text-sm md:text-base w-20 text-right">€{(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeItem(item.id)}
                    className="text-white/20 hover:text-red-400 transition-colors ml-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-8 md:mb-12 border-t border-white/10 pt-6">
              <span className="text-xs tracking-widest uppercase text-white/40">Total</span>
              <span className="text-xl md:text-2xl font-thin">€{total.toLocaleString()}</span>
            </div>

            <button onClick={handleCheckout} disabled={loading}
              className="w-full border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40">
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}