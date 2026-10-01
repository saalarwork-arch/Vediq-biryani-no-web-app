'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-[#0A1628] border-b border-[#1C2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101F35] border border-[#C9A24A]/40 text-xs font-bold text-[#E2C56B]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Our Culinary Philosophy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F5F1E8] leading-tight">
              Honoring India&apos;s Richest <br />
              <span className="text-[#E2C56B] italic">Biryani Cooking Traditions</span>
            </h2>
            <p className="text-[#AAB4C2] text-sm sm:text-base leading-relaxed">
              At Vediq Biryani, we believe that royal biryani is not just food—it is an intricate art form. The traditional Dum Pukht method originated in the royal kitchens of Awadh, where meats and vegetables were gently simmered in earthen vessels sealed with kneaded dough to trap every drop of fragrant steam.
            </p>
            <p className="text-[#7E8B9B] text-sm leading-relaxed">
              We hold our kitchens to that same timeless standard. From sourcing pure Kashmiri saffron to grinding our garam masalas in small batches daily, every step guarantees an authentic, unhurried feast.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1C2D4A] space-y-2 hover:border-[#C9A24A]/50 transition">
              <span className="font-serif text-3xl font-black text-[#E2C56B]">100%</span>
              <h4 className="text-sm font-bold text-[#F5F1E8]">Natural Banana Leaf</h4>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">Infuses natural aroma and provides eco-friendly, plastic-free packaging.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1C2D4A] space-y-2 hover:border-[#C9A24A]/50 transition">
              <span className="font-serif text-3xl font-black text-[#E2C56B]">Zero</span>
              <h4 className="text-sm font-bold text-[#F5F1E8]">Artificial Flavors</h4>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">No synthetic colors or chemical preservatives. Only pure saffron and whole spices.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1C2D4A] space-y-2 hover:border-[#C9A24A]/50 transition">
              <span className="font-serif text-3xl font-black text-[#E2C56B]">Pure</span>
              <h4 className="text-sm font-bold text-[#F5F1E8]">Desi Cow Ghee</h4>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">Fragrant clarified butter used generously to enrich every single grain.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1C2D4A] space-y-2 hover:border-[#C9A24A]/50 transition">
              <span className="font-serif text-3xl font-black text-[#E2C56B]">1k+</span>
              <h4 className="text-sm font-bold text-[#F5F1E8]">Happy Customers</h4>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">Delivered fresh and warm to biryani lovers and families across our service areas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
