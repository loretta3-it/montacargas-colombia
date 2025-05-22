// src/actions/empleoActions.ts
"use server";

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const JobApplicationSchema = z.object({
  interesTrabajar: z.enum(["Sí", "No"]),
  tieneCertificado: z.enum(["Sí", "No"]).optional(), // Optional because it's conditional
  nombreCompleto: z.string().min(3, "Nombre completo es requerido").optional(),
  edad: z.coerce.number().min(18, "Debe ser mayor de edad").max(99).optional(),
  numeroCedula: z.string().min(5, "Número de cédula es requerido").optional(),
  numeroTelefono: z.string().min(7, "Número de teléfono no válido").optional(),
  correoElectronico: z.string().email("Correo electrónico no válido").optional(),
  ciudadResidencia: z.string().min(3, "Ciudad de residencia es requerida").optional(),
  hojaDeVida: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `El archivo no debe exceder 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Solo se aceptan archivos PDF, DOC, DOCX."
    ).optional(),
});

export interface JobApplicationFormState {
  message: string | null;
  fields?: Record<string, string>;
  success: boolean;
  redirectToCourse?: boolean;
}

export async function submitJobApplication(
  prevState: JobApplicationFormState,
  formData: FormData
): Promise<JobApplicationFormState> {

  const interesTrabajar = formData.get("interesTrabajar") as "Sí" | "No";

  if (interesTrabajar === "No") {
    return {
      message: "¡Entendido! Si en algún momento cambias de opinión o quieres explorar el mundo de los montacargas, ¡nuestro curso está aquí para ti! Te invitamos a conocer más.",
      success: true, 
      redirectToCourse: true, // Special flag for UI to handle redirection or show course link
    };
  }
  
  // If "Sí", then other fields are required
  const dataToValidate: any = {
    interesTrabajar: formData.get("interesTrabajar"),
    tieneCertificado: formData.get("tieneCertificado"),
    nombreCompleto: formData.get("nombreCompleto"),
    edad: formData.get("edad"),
    numeroCedula: formData.get("numeroCedula"),
    numeroTelefono: formData.get("numeroTelefono"),
    correoElectronico: formData.get("correoElectronico"),
    ciudadResidencia: formData.get("ciudadResidencia"),
  };
  const hojaDeVidaFile = formData.get("hojaDeVida");
  if (hojaDeVidaFile instanceof File && hojaDeVidaFile.size > 0) {
     dataToValidate.hojaDeVida = hojaDeVidaFile;
  } else if (!hojaDeVidaFile || (hojaDeVidaFile instanceof File && hojaDeVidaFile.size === 0)) {
    // Handle case where file is expected but not provided or empty.
    // Zod schema optionality handles this if it's truly optional. If required for "Sí" path:
     return {
      message: "Por favor, sube tu hoja de vida.",
      fields: { hojaDeVida: "Hoja de vida es requerida." } as Record<string, string>,
      success: false,
    };
  }


  const validatedFields = JobApplicationSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      message: "Por favor corrija los errores en el formulario.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  const { ...applicationData } = validatedFields.data;

  // Here you would typically save the data to a database and
  // handle the file (e.g., upload to cloud storage).
  // Then, send an email with the data and link to the file or attach it.
  console.log("Job Application Data:", applicationData);
  if (applicationData.hojaDeVida) {
    console.log("CV Filename:", applicationData.hojaDeVida.name, "CV Size:", applicationData.hojaDeVida.size);
    // Example: const fileBuffer = Buffer.from(await applicationData.hojaDeVida.arrayBuffer());
    // Then use this buffer for email attachment or storage.
  }
  
  // Simulate email sending
  console.log(`Simulating email to wasp.training.col@gmail.com with data and CV.`);


  return {
    message: "¡Gracias por tu interés! Hemos recibido tu información y hoja de vida. Nuestro equipo de WASP se pondrá en contacto contigo si tu perfil coincide con las vacantes disponibles. ¡Te deseamos mucho éxito!",
    success: true,
  };
}
