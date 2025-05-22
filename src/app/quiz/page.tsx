import SharedLayout from '@/components/layout/SharedLayout';
import { QuizComponent } from '@/components/quiz/QuizComponent';

export default function QuizPage() {
  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow flex flex-col items-center justify-center">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">¡Desafía tus Conocimientos!</h1>
          <p className="text-md sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-2">
            Pon a prueba tu pasión por la logística y los montacargas. Si superas nuestro quiz, ¡podrías ganar hasta un 15% de descuento en tu inscripción al curso WASP!
          </p>
        </header>
        <QuizComponent />
      </div>
    </SharedLayout>
  );
}
