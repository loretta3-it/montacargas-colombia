import SharedLayout from '@/components/layout/SharedLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
  return (
    <SharedLayout>
      <div className="relative flex-grow flex flex-col text-white">
        {/* Background Image */}
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Operario y supervisora en montacargas"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority // Load image eagerly for LCP
          className="z-0"
          data-ai-hint="forklift operator industrial"
        />
        {/* Overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Increased opacity for better contrast */}

        {/* Content container */}
        <div className="relative z-20 flex flex-col items-center justify-between flex-grow p-4 sm:p-6 md:p-12 text-center">
          {/* Top section for text */}
          <div className="mt-8 md:mt-12 lg:mt-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              ¡Tu Futuro Laboral en 2 Días!
            </h1>
            <p className="text-md sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-md">
              Certifícate como Operador de Montacargas con WASP y accede a oportunidades de empleo reales.
            </p>
          </div>

          {/* Bottom section for buttons */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-auto mb-4 md:mb-8">
            <Link href="/inscripcion" passHref legacyBehavior>
              <Button size="lg" className="w-full py-4 sm:py-6 text-base sm:text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-150 ease-in-out">
                Inscribirse
              </Button>
            </Link>
            <Link href="/curso" passHref legacyBehavior>
              <Button variant="default" size="lg" className="w-full py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-150 ease-in-out">
                Ver Curso
              </Button>
            </Link>
            <Link href="/quiz" passHref legacyBehavior>
              <Button variant="default" size="lg" className="w-full py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-150 ease-in-out">
                Quiz 15% desc
              </Button>
            </Link>
            <Link href="/empleo" passHref legacyBehavior>
              <Button variant="default" size="lg" className="w-full py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-150 ease-in-out">
                Empleo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
}
