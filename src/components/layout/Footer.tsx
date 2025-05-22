import Link from 'next/link';
import { WaspLogo } from '@/components/icons/WaspLogo';
import { Globe, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';

const socialLinks = [
  { href: "https://waspsolgroup.com/", icon: Globe, label: "WASP Oficial" },
  { href: "https://www.facebook.com/WASPCOLOMBIA", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/waspcolombia", icon: Instagram, label: "Instagram" },
  { href: "https://www.tiktok.com/@waspcol01?lang=es%20", icon: TikTokIcon, label: "TikTok" },
  { href: "#", icon: Twitter, label: "X (Twitter)" }, // Placeholder link
  { href: "#", icon: Youtube, label: "YouTube" }, // Placeholder link
  { href: "#", icon: Linkedin, label: "LinkedIn" }, // Placeholder link
];

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-md h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <WaspLogo textColor="text-primary-foreground" iconSize="h-6 w-6" textSize="text-lg" showSubtext={false} />
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          {socialLinks.map((social) => (
            <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
              <social.icon className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
