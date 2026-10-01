import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Vediq Biryani',
  description: 'Experience the Heritage of Aromas. Authentic slow-cooked royal biryanis crafted with aromatic spices and traditional recipes, delivered fresh to your doorstep.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Vediq Biryani',
    description: 'Experience the Heritage of Aromas. Authentic slow-cooked royal biryanis crafted with aromatic spices and traditional recipes, delivered fresh to your doorstep.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#07111F] text-[#F5F1E8] antialiased min-h-screen selection:bg-[#C9A24A]/30 selection:text-[#F5F1E8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
