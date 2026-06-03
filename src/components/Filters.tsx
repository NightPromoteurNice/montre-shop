'use client'
import { useState } from 'react'

const BRANDS = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Omega',
  'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Panerai', 'Breitling',
  'TAG Heuer', 'Hublot', 'Vacheron Constantin', 'A. Lange & Söhne',
  'Blancpain', 'Breguet', 'Chopard', 'Franck Muller', 'Bell & Ross',
  'Tudor', 'Longines', 'Zenith', 'Girard-Perregaux', 'MB&F'
]

const COLORS = [
  'Black', 'White', 'Blue', 'Green', 'Grey', 'Silver',
  'Gold', 'Champagne', 'Brown', 'Red', 'Orange', 'Purple'
]

type FiltersType = {
  brands: string[]
  colors: string[]
  minPrice: number
  maxPrice: number
}

type Props = {
  filters: FiltersType
  onChange: (filters: FiltersType) => void
  isOpen: boolean
  onClose: () => void
}

export default function Filters({ filters, onChange, isOpen, onClose }: Props) {
  const [localMin, setLocalMin] = useState(filters.minPrice.toString())
  const [localMax, setLocalMax] = useState(filters.maxPrice.toString())

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    onChange({ ...filters, brands: updated })
  }

  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color]
    onChange({ ...filters, colors: updated })
  }

  const applyPrice = () => {
    onChange({
      ...filters,
      minPrice: parseInt(localMin) || 0,
      maxPrice: parseInt(localMax) || 999999
    })
  }

  const resetAll = () => {
    onChange({ brands: [], colors: [], minPrice: 0, maxPrice: 999999 })
    setLocalMin('0')
    setLocalMax('999999')
  }

  const activeCount = filters.brands.length + filters.colors.length +
    (filters.minPrice > 0 || filters.maxPrice < 999999 ? 1 : 0)

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} />
      )}

      {/* Panel filtres */}
      <div className={`fixed md:sticky top-0 md:top-20 left-0 h-full md:h-auto w-72 bg-[#0a0a0a] md:bg-transparent border-r md:border-r-0 border-white/10 z-40 overflow-y-auto transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 md:p-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-white/40">Filters</p>
              {activeCount > 0 && (
                <button onClick={resetAll} className="text-xs text-white/30 hover:text-white transition-colors mt-1">
                  Clear all ({activeCount})
                </button>
              )}
            </div>
            <button onClick={onClose} className="md:hidden text-white/40 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Prix */}
          <div className="mb-8 border-b border-white/5 pb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Price (€)</p>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={localMin}
                onChange={e => setLocalMin(e.target.value)}
                onBlur={applyPrice}
                placeholder="Min"
                className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-white/30 text-white placeholder:text-white/20"
              />
              <span className="text-white/20 text-xs">—</span>
              <input
                type="number"
                value={localMax === '999999' ? '' : localMax}
                onChange={e => setLocalMax(e.target.value || '999999')}
                onBlur={applyPrice}
                placeholder="Max"
                className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-white/30 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Marques */}
          <div className="mb-8 border-b border-white/5 pb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Brand</p>
            <div className="flex flex-col gap-2">
              {BRANDS.map(brand => (
                <button key={brand} onClick={() => toggleBrand(brand)}
                  className={`text-left text-sm py-1 transition-colors flex items-center gap-2 ${
                    filters.brands.includes(brand) ? 'text-white' : 'text-white/30 hover:text-white/60'
                  }`}>
                  <span className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center transition-colors ${
                    filters.brands.includes(brand) ? 'border-white bg-white' : 'border-white/20'
                  }`}>
                    {filters.brands.includes(brand) && (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <polyline points="1,5 4,8 9,2" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Couleurs */}
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button key={color} onClick={() => toggleColor(color)}
                  className={`px-3 py-1 text-xs tracking-widest uppercase border transition-colors ${
                    filters.colors.includes(color)
                      ? 'border-white text-white'
                      : 'border-white/20 text-white/30 hover:border-white/40'
                  }`}>
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}