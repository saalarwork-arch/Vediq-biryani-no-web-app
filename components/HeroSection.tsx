'use client';

import React from 'react';
import { Sparkles, Flame, Clock, ShieldCheck, ArrowRight, Leaf } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function HeroSection() {
  const { setActiveCategory, heroContent } = useData();

  const getTagIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-[#07111F] via-[#0A1628] to-[#07111F] border-b border-[#1C2D4A]">
      {/* Delicate background ambient warm radial accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#101F35]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101F35] border border-[#C9A24A]/40 text-xs font-bold text-[#E2C56B]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>{heroContent.badge_text || 'Authentic Lucknowi & Satvik Jain Dum Biryanis'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F1E8] leading-[1.12] tracking-tight">
            {heroContent.heading_line1 || 'Slow-Cooked on Royal Dum.'} <br />
            <span className="text-[#E2C56B] italic font-serif">
              {heroContent.heading_line2 || 'Sealed with Pure Heritage.'}
            </span>
          </h1>

          <p className="text-[#AAB4C2] text-base sm:text-lg max-w-2xl leading-relaxed">
            {heroContent.description ||
              'Experience aged long-grain Basmati rice, slow-simmered Kashmiri saffron milk, and farm-fresh ingredients packed in natural banana leaf (Kele ka Patta) for an unmistakable aroma.'}
          </p>

          {/* Quick feature tags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 max-w-2xl">
            {(heroContent.feature_tags || [
              { icon: 'Leaf', title: 'Natural Banana Leaf' },
              { icon: 'ShieldCheck', title: '100% Plastic-Free' },
              { icon: 'Clock', title: 'Hot & Fresh Delivery' },
            ]).map((tag, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 p-3 rounded-2xl bg-[#0A1628] border border-[#1C2D4A] shadow-xs ${
                  idx === 2 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#101F35] text-[#C9A24A] flex items-center justify-center shrink-0">
                  {getTagIcon(tag.icon)}
                </div>
                <span className="text-xs font-bold text-[#F5F1E8]">{tag.title}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <a
              href={heroContent.primary_btn_link || '#menu'}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24A] to-[#B89033] hover:from-[#D4AF37] hover:to-[#C9A24A] text-[#07111F] font-bold text-sm transition-all shadow-[0_6px_20px_rgba(201,162,74,0.3)] active:scale-95 cursor-pointer"
            >
              <span>{heroContent.primary_btn_text || 'Explore Full Menu'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={heroContent.secondary_btn_link || '#jain-specials'}
              onClick={() => setActiveCategory('biryani')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101F35] hover:bg-[#1C2D4A] border border-[#1C2D4A] text-[#F5F1E8] font-bold text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>{heroContent.secondary_btn_text || '100% Jain Satvik Menu'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
