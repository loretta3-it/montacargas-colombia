import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { ReactNode } from 'react';

interface SharedLayoutProps {
  children: ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col flex-grow pt-16 pb-16"> {/* pt-16 for Navbar (h-16), pb-16 for Footer (h-16) */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
