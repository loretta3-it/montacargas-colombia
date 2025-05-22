'use client';
import Link from 'next/link';
import { WaspLogo } from '@/components/icons/WaspLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MapPin, MessageSquare } from 'lucide-react'; // Removed unused social icons

export default function Navbar() {
  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/curso", label: "Ver Curso" },
    { href: "/quiz", label: "Quiz 15% Desc." },
    { href: "/empleo", label: "Empleo" },
  ];

  const contactIcons = (
    <>
      <Link href="https://maps.app.goo.gl/4qBsPKEcEuAiEhrk9" target="_blank" rel="noopener noreferrer" aria-label="Ubicación">
        <MapPin className="h-5 w-5 hover:opacity-80 transition-opacity" />
      </Link>
      <Link href="https://wa.me/573008336000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <MessageSquare className="h-5 w-5 hover:opacity-80 transition-opacity" />
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-md h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <WaspLogo width={120} height={35} priority />
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {contactIcons}
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-primary-foreground w-[250px] p-6">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="mb-4">
                  <WaspLogo width={120} height={35} priority />
                </Link>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} passHref>
                     <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80">{link.label}</Button>
                  </Link>
                ))}
                <div className="border-t border-primary-foreground/50 pt-4 mt-4">
                  <div className="flex items-center space-x-4 justify-center text-primary-foreground">
                    {contactIcons}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
