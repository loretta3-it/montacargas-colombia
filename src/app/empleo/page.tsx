import SharedLayout from '@/components/layout/SharedLayout';
import { JobApplicationForm } from '@/components/forms/JobApplicationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EmpleoPage() {
  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-lg bg-card shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Oportunidades de Empleo</CardTitle>
            <CardDescription className="text-muted-foreground text-lg mt-2">
              Completa el siguiente formulario si estás interesado en oportunidades laborales como operador de montacargas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobApplicationForm />
          </CardContent>
        </Card>
      </div>
    </SharedLayout>
  );
}
