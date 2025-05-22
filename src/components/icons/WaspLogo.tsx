import Image from 'next/image';

interface WaspLogoProps {
  className?: string;
  width: number;
  height: number;
  alt?: string;
  priority?: boolean;
}

export function WaspLogo({
  className = "",
  width,
  height,
  alt = "WASP Solutions Group Logo",
  priority = false,
}: WaspLogoProps) {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/loretta3.firebasestorage.app/o/wasp%2Fwasp-logo-positivo.webp?alt=media&token=5da73de2-869e-4898-9344-9c6f5c1fa330";
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoUrl}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
      />
    </div>
  );
}
