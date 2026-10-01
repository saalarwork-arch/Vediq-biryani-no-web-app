'use client';

import React from 'react';
import { Sparkles, Search, Info, ShieldCheck } from 'lucide-react';
import { useData } from '@/context/DataContext';
import ProductCard from './ProductCard';

export default function BiryaniCatalog() {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    isVegOnly,
    setIsVegOnly,
    isJainOnly,
    setIsJainOnly,
    filteredMenuItems,
  } = useData();

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#07111F] border-b border-[#1C2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101F35] border border-[#C9A24A]/40 text-xs font-bold text-[#E2C56B]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Royal Dining at Home</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F1E8] tracking-tight">
            Our Authentic Royal Menu
          </h2>
          <p className="text-[#AAB4C2] text-sm sm:text-base leading-relaxed">
            Every order is individually cooked and slow-steamed to seal the natural moisture, spices, and royal saffron.
          </p>
        </div>

        {/* Filter bar & Search */}
        <div className="mb-10 space-y-4">
          {/* Search and category filters */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8B9B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search biryani, add-ons, royal dishes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1628] border border-[#1C2D4A] text-sm text-[#F5F1E8] placeholder-[#7E8B9B] focus:outline-none focus:border-[#C9A24A] focus:bg-[#101F35] transition shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7E8B9B] hover:text-[#F5F1E8] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C9A24A] text-[#07111F] shadow-sm font-bold'
                        : 'bg-[#0A1628] text-[#AAB4C2] hover:text-[#F5F1E8] hover:bg-[#101F35] border border-[#1C2D4A]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu Items Grid: 4 COLUMNS ON DESKTOP */}
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-16 bg-[#0A1628] rounded-3xl border border-[#1C2D4A] p-8 max-w-md mx-auto">
            <Info className="w-10 h-10 text-[#C9A24A] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#F5F1E8]">No dishes found</h3>
            <p className="text-xs text-[#AAB4C2] mt-1 leading-relaxed">
              Try adjusting your search query or switching the category tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredMenuItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
