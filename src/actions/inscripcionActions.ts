// src/actions/inscripcionActions.ts
"use server";

import { z } from "zod";

const InscriptionSchema = z.object({
  nombreCompleto: z.string().min(3, "Nombre completo es requerido"),
  edad: z.coerce.number().min(18, "Debe ser mayor de edad").max(99),
  numeroCedula: z.string().min(5, "Número de cédula es requerido"),
  esBachiller: z.enum(["Sí", "No"], { message: "Seleccione una opción" }),
});

export interface InscriptionFormState {
  message: string | null;
  fields?: Record<string, string>;
  success: boolean;
  whatsappLink?: string;
}

export async function submitInscription(
  prevState: InscriptionFormState,
  formData: FormData
): Promise<InscriptionFormState> {
  const validatedFields = InscriptionSchema.safeParse({
    nombreCompleto: formData.get("nombreCompleto"),
    edad: formData.get("edad"),
    numeroCedula: formData.get("numeroCedula"),
    esBachiller: formData.get("esBachiller"),
  });

  if (!validatedFields.success) {
    return {
      message: "Por favor corrija los errores en el formulario.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  const { nombreCompleto, edad, numeroCedula, esBachiller } = validatedFields.data;

  // Here you would typically save the data to a database.
  // For this example, we'll just simulate success.
  console.log("Inscription Data:", validatedFields.data);

  const whatsappMessage = encodeURIComponent(
    `¡Hola WASP! Quiero inscribirme al curso de operador de montacargas.\n\nMis datos son:\nNombre: ${nombreCompleto}\nEdad: ${edad}\nCédula: ${numeroCedula}\n¿Es bachiller?: ${esBachiller}`
  );
  const whatsappLink = `https://wa.me/573008336000?text=${whatsappMessage}`;

  return {
    message: "¡Genial! Hemos recibido tus datos. Te redirigiremos a WhatsApp para finalizar tu inscripción y resolver cualquier duda. ¡Tu futuro te espera!",
    success: true,
    whatsappLink: whatsappLink,
  };
}
