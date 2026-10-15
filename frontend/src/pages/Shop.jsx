import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(6000);

  const categories = [
    { id: 'all', label: 'All Fragrances' },
    { id: 'unisex-extrait', label: 'Unisex Extrait' },
    { id: 'men-haute-parfumerie', label: 'Men Smoky Woods' },
    { id: 'women-royal-florals', label: 'Women Royal Florals' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const res = await api.getProducts(params);
      if (res?.data) setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const effectivePrice = Number(p.discount_price || p.price);
    const matchesPrice = effectivePrice <= maxPrice;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.short_description && p.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.top_notes && p.top_notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPrice && matchesSearch;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-cinzel text-gold-400 uppercase tracking-[0.25em] font-bold block mb-2">
          THE COMPLETE HAUTE CATALOGUE
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 uppercase tracking-wider">
          The Originals Collection
        </h1>
        <p className="text-xs text-cream-300 mt-2 font-light">
          Handcrafted Extrait de Parfum formulated at 40% oil concentration. Each order is prepared in our signature luxury velvet box with complimentary express shipping.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="luxury-glass rounded-2xl p-4 sm:p-6 mb-10 border border-gold-500/25 space-y-4">
        
        {/* Category Buttons + Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === c.id
                    ? 'bg-gold-gradient text-dark-950 shadow-gold-glow'
                    : 'bg-dark-950 text-cream-200 border border-dark-700 hover:border-gold-500/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-cream-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by notes, name..."
              className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2 text-xs text-cream-50 focus:outline-none"
            />
          </div>

        </div>

        {/* Price Range Slider */}
        <div className="pt-3 border-t border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cream-300">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gold-400" />
            <span>Max Price Filter:</span>
            <span className="font-cinzel font-bold text-gold-300 text-sm">₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>

          <input
            type="range"
            min="2500"
            max="6000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full sm:w-60 accent-gold-400 cursor-pointer"
          />
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="luxury-glass rounded-2xl p-5 h-96 animate-pulse bg-dark-900 border border-dark-800" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 luxury-glass rounded-2xl p-8 border border-dark-800">
          <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-cinzel text-lg font-bold text-cream-50">No Fragrances Found</h3>
          <p className="text-xs text-cream-300 mt-1">Try resetting your search query or price slider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
