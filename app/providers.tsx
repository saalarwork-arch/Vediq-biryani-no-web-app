'use client';

import React from 'react';
import { DataProvider } from '@/context/DataContext';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <CartProvider>{children}</CartProvider>
    </DataProvider>
  );
}
