'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Compass, Menu, X, History } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';
import VediqLogo from './VediqLogo';

export default function Navbar() {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { setTrackOrderModalOpen } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A1628]/95 backdrop-blur-md border-b border-[#1C2D4A] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] py-2'
          : 'bg-[#07111F]/90 backdrop-blur-sm border-b border-[#1C2D4A] py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Layout Container */}
        <div className="flex items-center justify-between min-h-[56px] sm:min-h-[64px] md:min-h-[72px]">
          {/* Left: Desktop Nav Links (Menu, Jain Satvik, Dum Craft) */}
          <div className="flex items-center gap-5 lg:gap-7 flex-1 justify-start">
            <nav className="hidden md:flex items-center gap-5 lg:gap-7">
              <a
                href="#menu"
                className="text-xs lg:text-sm font-semibold text-[#F5F1E8] hover:text-[#E2C56B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C9A24A] hover:after:w-full after:transition-all whitespace-nowrap"
              >
                Our Menu
              </a>
              <a
                href="#jain-specials"
                className="text-xs lg:text-sm font-semibold text-[#E2C56B] hover:text-[#F5F1E8] transition-colors flex items-center gap-1.5 py-1 px-2.5 lg:px-3 rounded-full bg-[#101F35] border border-[#C9A24A]/40 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
                <span>100% Jain Satvik</span>
              </a>
              <a
                href="#craft"
                className="text-xs lg:text-sm font-semibold text-[#F5F1E8] hover:text-[#E2C56B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C9A24A] hover:after:w-full after:transition-all whitespace-nowrap"
              >
                Heritage Dum Craft
              </a>
            </nav>
          </div>

          {/* Center: Perfectly Centered Brand Logo (Both Mobile & Desktop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
            <Link href="/" className="flex items-center justify-center group py-1" aria-label="Vediq Biryani Homepage">
              <VediqLogo variant="dark" size="header" showTagline={true} />
            </Link>
          </div>

          {/* Right: Desktop Nav Links (Reviews, Track Order, My Orders) & Cart / Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 mr-1">
              <a
                href="#reviews"
                className="text-xs font-semibold text-[#F5F1E8] hover:text-[#E2C56B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C9A24A] hover:after:w-full after:transition-all whitespace-nowrap"
              >
                Guest Reviews
              </a>
              <button
                onClick={() => setTrackOrderModalOpen(true)}
                className="text-xs font-semibold text-[#F5F1E8] hover:text-[#E2C56B] transition-colors flex items-center gap-1.5 cursor-pointer py-1 whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
                <span>Track Order</span>
              </button>
              <Link
                href="/orders"
                className="text-xs font-semibold text-[#F5F1E8] hover:text-[#E2C56B] transition-colors flex items-center gap-1.5 py-1 whitespace-nowrap"
              >
                <History className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
                <span>My Orders</span>
              </Link>
            </nav>

            {/* Tablet-only quick track order icon */}
            <button
              onClick={() => setTrackOrderModalOpen(true)}
              className="hidden md:flex lg:hidden p-2 rounded-xl bg-[#101F35] border border-[#1C2D4A] text-[#E2C56B] hover:text-[#F5F1E8] transition cursor-pointer"
              title="Track Order"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Cart Trigger Button */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A24A] to-[#B89033] hover:from-[#D4AF37] hover:to-[#C9A24A] text-[#07111F] font-bold text-xs sm:text-sm transition-all shadow-[0_4px_12px_rgba(201,162,74,0.3)] active:scale-95 cursor-pointer shrink-0"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black bg-[#07111F] text-[#E2C56B] rounded-full shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#101F35] border border-[#1C2D4A] text-[#F5F1E8] hover:text-[#E2C56B] transition cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1628] border-b border-[#1C2D4A] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 pt-1">
            <a
              href="#menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F1E8] hover:bg-[#101F35] hover:text-[#E2C56B] transition"
            >
              Our Menu
            </a>
            <a
              href="#jain-specials"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#E2C56B] bg-[#101F35] border border-[#C9A24A]/40 flex items-center justify-between"
            >
              <span>100% Jain Satvik Menu</span>
              <Sparkles className="w-4 h-4 text-[#C9A24A]" />
            </a>
            <a
              href="#craft"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F1E8] hover:bg-[#101F35] hover:text-[#E2C56B] transition"
            >
              Heritage Dum Craft
            </a>
            <a
              href="#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F1E8] hover:bg-[#101F35] hover:text-[#E2C56B] transition"
            >
              Guest Reviews
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setTrackOrderModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F1E8] hover:bg-[#101F35] hover:text-[#E2C56B] flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C9A24A]" />
              <span>Track Live Order</span>
            </button>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F1E8] hover:bg-[#101F35] hover:text-[#E2C56B] flex items-center gap-2 transition"
            >
              <History className="w-4 h-4 text-[#C9A24A]" />
              <span>My Orders & History</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
