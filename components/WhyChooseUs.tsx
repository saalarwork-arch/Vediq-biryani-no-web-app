'use client';

import React from 'react';
import { Leaf, ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Leaf,
      title: 'Packed in Natural Banana Leaf',
      desc: 'Wrapped in fresh natural banana leaf (Kele ka Patta) to infuse authentic earthy aroma and enhance flavor.',
    },
    {
      icon: ShieldCheck,
      title: '100% Plastic-Free Packaging',
      desc: 'Eco-conscious, hygienic, non-toxic packaging crafted with zero single-use plastics.',
    },
    {
      icon: Sparkles,
      title: '2-Year Aged Basmati & Kesar',
      desc: 'Extra-long grains that absorb the aromatic saffron milk without turning sticky, slow-steamed on dum.',
    },
    {
      icon: Clock,
      title: 'From Our Kitchen to Your Door',
      desc: 'Carefully packed and delivered to your doorstep so your biryani arrives warm, aromatic, and ready to enjoy.',
    },
  ];

  return (
    <section id="craft" className="py-16 md:py-24 bg-[#07111F] border-b border-[#1C2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101F35] border border-[#C9A24A]/40 text-xs font-bold text-[#E2C56B]">
            <Award className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>The Vediq Standards</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F5F1E8]">
            Why Royal Connoisseurs Choose Us
          </h2>
          <p className="text-[#AAB4C2] text-sm leading-relaxed">
            We preserve age-old Awadhi and Nizami culinary traditions with uncompromising quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0A1628] border border-[#1C2D4A] hover:border-[#C9A24A]/50 hover:shadow-[0_10px_25px_-5px_rgba(201,162,74,0.15)] hover:-translate-y-0.5 transition-all duration-300 space-y-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#101F35] border border-[#C9A24A]/40 flex items-center justify-center text-[#C9A24A]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">{p.title}</h3>
                <p className="text-xs text-[#AAB4C2] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
