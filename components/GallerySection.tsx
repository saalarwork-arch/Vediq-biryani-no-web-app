'use client';

import React from 'react';
import { Camera } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '@/lib/storageUpload';

export default function GallerySection() {
  const { galleryItems } = useData();
  const visibleGallery = galleryItems.filter((item) => item.is_active !== false);

  return (
    <section className="py-16 md:py-24 bg-[#07111F] border-b border-[#1C2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101F35] border border-[#C9A24A]/40 text-xs font-bold text-[#E2C56B]">
            <Camera className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Visual Glimpses</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F5F1E8]">
            Crafted for the Royal Palate
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {visibleGallery.map((img) => (
            <div
              key={img.id}
              className="aspect-square rounded-2xl overflow-hidden relative group border border-[#1C2D4A] shadow-xs hover:shadow-md bg-[#0A1628]"
            >
              <img
                src={resolveImageUrl(img.image_url)}
                alt={img.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-[#F5F1E8]">{img.title}</span>
                {img.caption && <span className="text-[11px] text-[#AAB4C2] line-clamp-1">{img.caption}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

