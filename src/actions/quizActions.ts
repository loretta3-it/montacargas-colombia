// src/actions/quizActions.ts
"use server";

import { z } from "zod";

const QuizContactSchema = z.object({
  nombreCompleto: z.string().min(3, "Nombre completo es requerido"),
  correoElectronico: z.string().email("Correo electrónico no válido"),
  numeroTelefono: z.string().min(7, "Número de teléfono no válido"),
  discountPercentage: z.coerce.number().min(0).max(100),
  score: z.coerce.number().min(0).max(100),
});

export interface QuizContactFormState {
  message: string | null;
  fields?: Record<string, string>;
  success: boolean;
  whatsappLink?: string;
}

export async function submitQuizContact(
  prevState: QuizContactFormState,
  formData: FormData
): Promise<QuizContactFormState> {
  const validatedFields = QuizContactSchema.safeParse({
    nombreCompleto: formData.get("nombreCompleto"),
    correoElectronico: formData.get("correoElectronico"),
    numeroTelefono: formData.get("numeroTelefono"),
    discountPercentage: formData.get("discountPercentage"),
    score: formData.get("score"),
  });

  if (!validatedFields.success) {
    return {
      message: "Por favor corrija los errores en el formulario.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  const { nombreCompleto, correoElectronico, numeroTelefono, discountPercentage, score } = validatedFields.data;

  // Here you would typically save the data (name, email, phone, score, discount) to a database.
  console.log("Quiz Contact Data:", validatedFields.data);

  const whatsappMessage = encodeURIComponent(
    `¡Hola WASP! Gané un descuento en el quiz y quiero reclamarlo para el curso de operador de montacargas.\n\nMis datos son:\nNombre: ${nombreCompleto}\nCorreo: ${correoElectronico}\nTeléfono: ${numeroTelefono}\nPuntaje: ${score}%\nDescuento ganado: ${discountPercentage}%`
  );
  const whatsappLink = `https://wa.me/573008336000?text=${whatsappMessage}`;

  return {
    message: "¡Listo! Tu descuento está asegurado. Te redirigiremos a WhatsApp para que puedas usarlo y finalizar tu inscripción. ¡Felicidades!",
    success: true,
    whatsappLink: whatsappLink,
  };
}
