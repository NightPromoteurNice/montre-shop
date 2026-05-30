export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex items-center bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
        {/* Left - tabs */}
        <div className="flex h-16">
          <a href="/11" className="flex items-center px-10 h-full text-sm tracking-[0.2em] uppercase border-r border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            1:1
          </a>
          <a href="/hyperclone" className="flex items-center px-10 h-full text-sm tracking-[0.2em] uppercase border-r border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            Hyperclone
          </a>
        </div>
        {/* Center - logo */}
        <div className="flex-1 flex justify-center">
          <span className="text-base tracking-[0.4em] uppercase font-light">Watches</span>
        </div>
        {/* Right */}
        <div className="flex h-16">
          <a href="/cart" className="flex items-center px-10 h-full text-sm tracking-[0.2em] uppercase border-l border-white/5 hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            Cart
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-10">
        <div className="text-center z-10">
          <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-8">Collection 2025</p>
          <h1 className="text-[8vw] font-thin tracking-[-0.02em] leading-none mb-6">
            The Art of<br />
            <em className="font-light not-italic text-white/60">Time</em>
          </h1>
          <p className="text-sm tracking-[0.2em] text-white/40 max-w-xs mx-auto mb-16">
            Exceptional watches, timeless craftsmanship
          </p>
          <a href="/hyperclone" className="inline-block border border-white/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Explore
          </a>
        </div>
      </section>

      {/* Featured */}
      <section className="px-10 pb-32">
        <div className="flex items-center gap-6 mb-16">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs tracking-[0.4em] uppercase text-white/30">Featured</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {[
            { name: "Chronograph I", ref: "REF. 001", price: "€4,200" },
            { name: "Automatic II", ref: "REF. 002", price: "€2,800" },
            { name: "Sport III", ref: "REF. 003", price: "€6,500" },
          ].map((watch) => (
            <div key={watch.ref} className="bg-[#0a0a0a] p-10 group cursor-pointer hover:bg-[#111] transition-colors">
              <div className="aspect-square bg-white/3 mb-8 flex items-center justify-center border border-white/5">
                <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/10" />
                </div>
              </div>
              <p className="text-xs tracking-[0.3em] text-white/30 mb-2">{watch.ref}</p>
              <h3 className="text-lg font-light tracking-wide mb-4">{watch.name}</h3>
              <p className="text-sm text-white/50">{watch.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}