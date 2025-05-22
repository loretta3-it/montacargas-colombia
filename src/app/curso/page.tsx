import SharedLayout from '@/components/layout/SharedLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function CursoPage() {
  const whyWaspPoints = [
    "Respaldo Laboral Único: Conexión Directa con Oportunidades en nuestra Bolsa de Empleo WASP.",
    "Formación de Alto Nivel: Instructores expertos, metodología teórico-práctica intensiva con equipos reales.",
    "Certificación Válida y Reconocida: Cumple con el Decreto 1072 de 2015, válida anualmente.",
    "Enfoque Social: Descuentos del 15% para desempleados, Sisbén, o padres/madres cabeza de hogar.",
    "Ubicación Estratégica: Curso presencial en Zipaquirá, fácil acceso desde Tocancipá, La Calera y Bogotá."
  ];

  const courseContent = {
    teorico: [
      "Introducción al Montacargas (qué es, tipos y clases, partes y funcionamiento)",
      "Principios Físicos (triángulo de estabilidad, centro de gravedad, placa de capacidades)",
      "Seguridad y Salud en el Trabajo (normativa colombiana: Decreto 1072 de 2015, Resolución 4272 de 2021, NTC 4503, riesgos, EPP, inspección pre-operacional)"
    ],
    practico: [
      "Maniobras (carga/descarga, apilamiento, giros)",
      "Operación en diferentes condiciones",
      "Uso de controles",
      "Estacionamiento"
    ]
  };

  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 text-foreground">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Curso Certificado de Operador de Montacargas WASP</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            ¡Tu Pasaporte al Éxito! Conviértete en un Operador Certificado en solo 2 días.
          </p>
        </header>

        <Card className="mb-10 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Descripción General</CardTitle>
          </CardHeader>
          <CardContent className="text-lg space-y-4">
            <p>Impulsa tu empleabilidad, aumenta tus ingresos y asegura tu futuro en el dinámico sector logístico e industrial de Cundinamarca y Bogotá. Nuestro curso intensivo te prepara para operar montacargas de manera segura y eficiente.</p>
          </CardContent>
        </Card>

        <Card className="mb-10 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">¿Por Qué Elegir WASP?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {whyWaspPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-10 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Contenido del Curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-accent-foreground">Módulo Teórico</h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                {courseContent.teorico.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-accent-foreground">Módulo Práctico</h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                {courseContent.practico.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-lg rounded-lg">
            <CardHeader><CardTitle className="text-xl text-primary">Modalidad y Duración</CardTitle></CardHeader>
            <CardContent><p>Presencial en Zipaquirá, 2 días (intensivo).</p></CardContent>
          </Card>
          <Card className="shadow-lg rounded-lg">
            <CardHeader><CardTitle className="text-xl text-primary">Requisitos</CardTitle></CardHeader>
            <CardContent><p>Mayor de 18 años, documento de identidad válido, saber conducir vehículo o tener experiencia operando maquinaria (preferible), buena condición física.</p></CardContent>
          </Card>
          <Card className="shadow-lg rounded-lg">
            <CardHeader><CardTitle className="text-xl text-primary">Precio</CardTitle></CardHeader>
            <CardContent><p className="font-bold text-2xl">$500.000 COP</p></CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Link href="/inscripcion" passHref legacyBehavior>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-xl rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-150 ease-in-out">
              ¡Inscríbete Ahora y Asegura tu Cupo!
            </Button>
          </Link>
        </div>
      </div>
    </SharedLayout>
  );
}
