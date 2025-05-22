import SharedLayout from '@/components/layout/SharedLayout';
import { InscriptionForm } from '@/components/forms/InscriptionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function InscripcionPage() {
  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-lg bg-card shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">¡Inscríbete y Da el Primer Paso!</CardTitle>
            <CardDescription className="text-muted-foreground text-lg mt-2">
              Completa el formulario para iniciar tu camino hacia un futuro laboral exitoso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InscriptionForm />
          </CardContent>
        </Card>
      </div>
    </SharedLayout>
  );
}
