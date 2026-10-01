'use client';

import React from 'react';
import { Truck, Clock, ShieldCheck, Leaf } from 'lucide-react';

export default function DeliverySection() {
  return (
    <section className="py-14 bg-[#07111F] border-b border-[#1C2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-10 rounded-3xl bg-[#0A1628] border border-[#1C2D4A] shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#101F35] border border-[#C9A24A]/40 text-[#C9A24A] flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">Natural Banana Leaf Packaging</h3>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">
                Packed in fresh natural banana leaf (Kele ka Patta) for traditional earthy flavor and eco-friendly freshness.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#101F35] border border-[#C9A24A]/40 text-[#C9A24A] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">Traditional Dum Cooking</h3>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">
                Prepared using traditional dum cooking techniques to preserve the aroma, texture, and rich flavour of every grain.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#101F35] border border-[#C9A24A]/40 text-[#C9A24A] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">100% Plastic-Free & Sealed</h3>
              <p className="text-xs text-[#AAB4C2] leading-relaxed">
                100% plastic-free food containers with tamper-evident royal security seals for pure dining peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
