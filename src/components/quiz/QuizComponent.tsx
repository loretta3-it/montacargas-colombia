// src/components/quiz/QuizComponent.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { submitQuizContact, type QuizContactFormState } from "@/actions/quizActions";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const quizQuestions: Question[] = [
  { id: 1, text: "¿Cuál es un componente clave para la estabilidad de un montacargas?", options: ["El color de la pintura", "El triángulo de estabilidad", "La marca de las llantas", "La velocidad máxima"], correctAnswer: "El triángulo de estabilidad" },
  { id: 2, text: "La inspección pre-operacional de un montacargas se realiza:", options: ["Semanalmente", "Mensualmente", "Antes de cada turno", "Anualmente"], correctAnswer: "Antes de cada turno" },
  { id: 3, text: "¿Qué significa NTC en el contexto de normativas colombianas?", options: ["Norma Técnica Colombiana", "Nuevo Tratado Comercial", "Nivel Tecnológico Certificado", "Ninguna de las anteriores"], correctAnswer: "Norma Técnica Colombiana" },
  { id: 4, text: "Un montacargas clase I es generalmente propulsado por:", options: ["Gasolina", "Diesel", "Eléctricidad (Batería)", "Gas LP"], correctAnswer: "Eléctricidad (Batería)" },
  { id: 5, text: "Levantar una carga excediendo la capacidad nominal del montacargas puede causar:", options: ["Mayor eficiencia", "Volcamiento", "Ahorro de combustible", "Desgaste uniforme de llantas"], correctAnswer: "Volcamiento" },
];

const QuizContactSchema = z.object({
  nombreCompleto: z.string().min(3, { message: "Nombre completo es requerido." }),
  correoElectronico: z.string().email({ message: "Correo electrónico no válido." }),
  numeroTelefono: z.string().min(7, { message: "Número de teléfono no válido." }),
});
type QuizContactFormData = z.infer<typeof QuizContactSchema>;

const initialContactFormState: QuizContactFormState = { message: null, success: false };

export function QuizComponent() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const [contactFormServerState, contactFormAction] = useFormState(submitQuizContact, initialContactFormState);

  const contactForm = useForm<QuizContactFormData>({
    resolver: zodResolver(QuizContactSchema),
    defaultValues: { nombreCompleto: "", correoElectronico: "", numeroTelefono: "" },
  });

  useEffect(() => {
    if (contactFormServerState.message) {
      toast({
        title: contactFormServerState.success ? "Éxito" : "Error",
        description: contactFormServerState.message,
        variant: contactFormServerState.success ? "default" : "destructive",
      });
      if (contactFormServerState.success && contactFormServerState.whatsappLink) {
        setTimeout(() => { window.location.href = contactFormServerState.whatsappLink!; }, 2000);
      }
    }
     if (!contactFormServerState.success && contactFormServerState.fields) {
        Object.entries(contactFormServerState.fields).forEach(([fieldName, error]) => {
            contactForm.setError(fieldName as keyof QuizContactFormData, { type: "server", message: Array.isArray(error) ? error.join(", ") : error });
        });
    }
  }, [contactFormServerState, toast, router, contactForm]);


  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScore();
      setQuizFinished(true);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
    setScore(finalScore);

    if (finalScore >= 85) setDiscountPercentage(15);
    else if (finalScore >= 70) setDiscountPercentage(10);
    else setDiscountPercentage(0);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setQuizFinished(false);
    setDiscountPercentage(0);
    contactForm.reset();
  };

  if (quizFinished) {
    return (
      <Card className="w-full max-w-lg text-center shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Resultados del Quiz</CardTitle>
          <CardDescription className="text-muted-foreground text-lg mt-2">Tu puntaje: {score}%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {score < 70 && (
            <>
              <p className="text-lg">¡No te desanimes! El mundo de la logística es fascinante y lleno de oportunidades. Vuelve a intentarlo y descubre tu potencial. ¡Estamos aquí para apoyarte en tu camino!</p>
              <Button onClick={restartQuiz} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg">Volver a Intentar Quiz</Button>
            </>
          )}
          {score >= 70 && score < 85 && (
            <>
              <p className="text-lg text-green-600 font-semibold">¡Felicidades! Has demostrado un gran interés. Has ganado un 10% de descuento en tu curso de montacargas WASP. ¡Aprovecha esta oportunidad para impulsar tu carrera!</p>
              <QuizContactForm score={score} discountPercentage={discountPercentage} formAction={contactFormAction} rhfForm={contactForm} />
            </>
          )}
          {score >= 85 && (
            <>
              <p className="text-lg text-green-700 font-bold">¡Increíble! ¡Eres un/a verdadero/a talento! Has ganado un 15% de descuento en tu curso de montacargas WASP. ¡Estás listo/a para el éxito!</p>
              <QuizContactForm score={score} discountPercentage={discountPercentage} formAction={contactFormAction} rhfForm={contactForm} />
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <Card className="w-full max-w-xl shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-2">Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}</CardTitle>
        <Progress value={progressValue} className="w-full h-2 [&>div]:bg-accent" />
        <p className="text-lg md:text-xl mt-4 pt-2 text-foreground">{currentQuestion.text}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
          value={answers[currentQuestion.id] || ""}
          className="space-y-3"
        >
          {currentQuestion.options.map(option => (
            <div key={option} className="flex items-center space-x-3 p-3 border border-border rounded-md hover:bg-muted transition-colors">
              <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} className="border-primary text-primary focus:ring-primary" />
              <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-md text-foreground cursor-pointer flex-grow">{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleNextQuestion} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg mt-6" disabled={!answers[currentQuestion.id]}>
          {currentQuestionIndex < quizQuestions.length - 1 ? "Siguiente Pregunta" : "Finalizar Quiz"}
        </Button>
      </CardContent>
    </Card>
  );
}


interface QuizContactFormProps {
  score: number;
  discountPercentage: number;
  formAction: (payload: FormData) => void;
  rhfForm: ReturnType<typeof useForm<QuizContactFormData>>;
}

function QuizContactForm({ score, discountPercentage, formAction, rhfForm }: QuizContactFormProps) {
  const { register, formState: { errors, isSubmitting } } = rhfForm;
  
  return (
    <form action={formAction} className="space-y-4 mt-6 text-left">
      <h3 className="text-xl font-semibold text-center text-accent-foreground mb-4">¡Reclama tu Descuento Exclusivo!</h3>
      <input type="hidden" name="score" value={score} />
      <input type="hidden" name="discountPercentage" value={discountPercentage} />
      <div>
        <Label htmlFor="quizNombreCompleto" className="text-foreground">Nombre Completo</Label>
        <Input id="quizNombreCompleto" name="nombreCompleto" {...register("nombreCompleto")} className="mt-1 bg-white text-foreground border-gray-300 focus:border-primary focus:ring-primary" />
        {errors.nombreCompleto && <p className="text-sm text-destructive mt-1">{errors.nombreCompleto.message}</p>}
      </div>
      <div>
        <Label htmlFor="quizCorreoElectronico" className="text-foreground">Correo Electrónico</Label>
        <Input id="quizCorreoElectronico" name="correoElectronico" type="email" {...register("correoElectronico")} className="mt-1 bg-white text-foreground border-gray-300 focus:border-primary focus:ring-primary" />
        {errors.correoElectronico && <p className="text-sm text-destructive mt-1">{errors.correoElectronico.message}</p>}
      </div>
      <div>
        <Label htmlFor="quizNumeroTelefono" className="text-foreground">Número de Teléfono</Label>
        <Input id="quizNumeroTelefono" name="numeroTelefono" type="tel" {...register("numeroTelefono")} className="mt-1 bg-white text-foreground border-gray-300 focus:border-primary focus:ring-primary" />
        {errors.numeroTelefono && <p className="text-sm text-destructive mt-1">{errors.numeroTelefono.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Obtener mi Descuento"}
      </Button>
    </form>
  );
}

