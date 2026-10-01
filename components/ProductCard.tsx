'use client';

import React, { useState } from 'react';
import { Clock, Plus, Check, Sparkles, MessageCircle, UtensilsCrossed } from 'lucide-react';
import { MenuItem } from '@/types/supabase';
import { formatINR } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/storageUpload';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';

interface ProductCardProps {
  item: MenuItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const { addToCart } = useCart();
  const { siteSettings } = useData();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState<number>(0);
  const [isAddedAnimation, setIsAddedAnimation] = useState<boolean>(false);

  const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0;
  const currentSize = hasSizes ? (item.sizes[selectedSizeIdx] || item.sizes[0]) : null;
  const hasValidPrice = currentSize && typeof currentSize.price === 'number';
  const hasImage = Boolean(item.image_url && item.image_url.trim() !== '');

  const handleAddToCart = () => {
    if (!currentSize) return;

    addToCart({
      productId: item.id,
      name: item.name,
      size: currentSize.name,
      price: currentSize.price,
      imageUrl: resolveImageUrl(item.image_url, item.images),
    });

    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 900);
  };

  const handleInquireWhatsApp = () => {
    const rawPhone = (siteSettings.whatsapp || siteSettings.phone || '+918744044994').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Vediq Biryani! I would like to inquire about "${item.name}" (100% Jain Satvik Biryani). Please share details.`
    );
    window.open(`https://wa.me/${rawPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="rounded-2xl bg-[#0A1628] border border-[#1C2D4A] hover:border-[#C9A24A]/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-xs hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] hover:-translate-y-0.5">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#101F35] flex items-center justify-center">
        {hasImage ? (
          <img
            src={resolveImageUrl(item.image_url, item.images)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#101F35] to-[#07111F] p-6 text-center space-y-2 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#07111F] border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] shadow-inner group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-[#E2C56B] uppercase tracking-wider">
              {item.is_jain ? '100% Jain Satvik' : 'Royal Dum Craft'}
            </span>
            <p className="text-[10px] text-[#7E8B9B]">Traditional slow-cooked recipe</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {item.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#07111F]/90 text-[#E2C56B] shadow-xs backdrop-blur-xs border border-[#C9A24A]/40">
              {item.badge}
            </span>
          )}
          {item.is_jain && !item.badge?.includes('Jain') && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-[#101F35]/90 text-[#E2C56B] border border-[#C9A24A]/40 shadow-xs">
              Jain Satvik
            </span>
          )}
        </div>

        {/* Prep time */}
        {item.preparation_time_minutes > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-[#07111F]/90 backdrop-blur-xs text-[10px] font-bold text-[#F5F1E8] flex items-center gap-1 border border-[#1C2D4A]">
            <Clock className="w-3 h-3 text-[#C9A24A]" />
            <span>{item.preparation_time_minutes}m</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1">
          <h3 className="font-serif text-base font-bold text-[#F5F1E8] group-hover:text-[#E2C56B] transition-colors leading-snug">
            {item.name}
          </h3>
          <p className="text-xs text-[#AAB4C2] line-clamp-2 leading-relaxed">
            {item.tagline || item.description}
          </p>
        </div>

        {/* Portion/Size Selector if multiple sizes */}
        {hasSizes && item.sizes.length > 1 ? (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E8B9B]">
              Portion Size
            </span>
            <div className={`grid ${item.sizes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5`}>
              {item.sizes.map((s, idx) => {
                const isSelected = selectedSizeIdx === idx;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSizeIdx(idx)}
                    className={`p-1.5 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#101F35] border-[#C9A24A] text-[#F5F1E8] shadow-xs'
                        : 'bg-[#07111F] border-[#1C2D4A] text-[#AAB4C2] hover:bg-[#101F35] hover:text-[#F5F1E8]'
                    }`}
                  >
                    <div className="text-[11px] font-bold leading-tight truncate">{s.portion || s.name}</div>
                    <div className={`text-[10px] font-extrabold ${isSelected ? 'text-[#E2C56B]' : 'text-[#7E8B9B]'}`}>
                      {s.price === 0 ? 'FREE' : `₹${s.price}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : hasSizes && currentSize ? (
          <div className="text-[11px] text-[#7E8B9B] pt-1 font-medium">
            {currentSize.serves || currentSize.portion || 'Standard Portion'}
          </div>
        ) : (
          <div className="text-[11px] text-[#AAB4C2] pt-1 font-medium italic">
            Prepared fresh on traditional dum upon order
          </div>
        )}

        {/* Complimentary items badge for Biryani category */}
        {item.category === 'biryani' && (
          <div className="p-2 rounded-xl bg-[#07111F] border border-[#1C2D4A] text-[10px] text-[#E2C56B] flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-[#C9A24A] shrink-0" />
            <span>Packed in Banana Leaf • Complimentary Raita & Dessert</span>
          </div>
        )}

        {/* Bottom Action: Price & Add to Cart / Inquire */}
        <div className="pt-3 border-t border-[#1C2D4A] flex items-center justify-between gap-2">
          {hasValidPrice ? (
            <>
              <div>
                <div className="text-[10px] text-[#7E8B9B]">
                  {currentSize?.serves || 'Single portion'}
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#F5F1E8]">
                  {currentSize?.price === 0 ? (
                    <span className="text-[#E2C56B]">FREE</span>
                  ) : (
                    formatINR(currentSize!.price)
                  )}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                  isAddedAnimation
                    ? 'bg-[#10B981] text-white scale-95'
                    : 'bg-gradient-to-r from-[#C9A24A] to-[#B89033] hover:from-[#D4AF37] hover:to-[#C9A24A] text-[#07111F] active:scale-95 shadow-[0_2px_8px_rgba(201,162,74,0.3)]'
                }`}
                aria-label={`Add ${item.name} to cart`}
              >
                {isAddedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div>
                <div className="text-[10px] text-[#7E8B9B]">Special Order</div>
                <div className="text-xs sm:text-sm font-bold text-[#E2C56B]">
                  Available on Order
                </div>
              </div>

              <button
                onClick={handleInquireWhatsApp}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101F35] border border-[#C9A24A]/40 text-[#E2C56B] hover:bg-[#C9A24A] hover:text-[#07111F] font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                title="Inquire on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Inquire</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
