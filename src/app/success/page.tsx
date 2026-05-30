export default function Success() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-6">Order Confirmed</p>
        <h1 className="text-5xl font-thin mb-6">Thank You</h1>
        <p className="text-sm text-white/40 mb-16 tracking-wide">Your order has been successfully placed.</p>
        <a href="/" className="border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
          Back to Home
        </a>
      </div>
    </main>
  )
}