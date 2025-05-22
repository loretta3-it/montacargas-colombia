// src/components/forms/JobApplicationForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitJobApplication, type JobApplicationFormState } from "@/actions/empleoActions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const JobApplicationSchema = z.object({
  interesTrabajar: z.enum(["Sí", "No"], { required_error: "Seleccione una opción." }),
  tieneCertificado: z.enum(["Sí", "No"]).optional(),
  nombreCompleto: z.string().optional(),
  edad: z.coerce.number().optional(),
  numeroCedula: z.string().optional(),
  numeroTelefono: z.string().optional(),
  correoElectronico: z.string().email({ message: "Correo no válido."}).optional(),
  ciudadResidencia: z.string().optional(),
  hojaDeVida: z.custom<FileList>()
    .refine(files => files && files.length > 0, "Hoja de vida es requerida.")
    .refine(files => files && files[0]?.size <= MAX_FILE_SIZE, `El archivo no debe exceder 5MB.`)
    .refine(files => files && ACCEPTED_FILE_TYPES.includes(files[0]?.type), "Solo se aceptan archivos PDF, DOC, DOCX.")
    .optional(),
}).superRefine((data, ctx) => {
  if (data.interesTrabajar === "Sí") {
    if (!data.tieneCertificado) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Seleccione si tiene certificado.", path: ["tieneCertificado"] });
    if (!data.nombreCompleto || data.nombreCompleto.length < 3) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nombre completo es requerido (mín. 3 caracteres).", path: ["nombreCompleto"] });
    if (!data.edad || data.edad < 18 || data.edad > 99) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Edad no válida (18-99).", path: ["edad"] });
    if (!data.numeroCedula || data.numeroCedula.length < 5) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cédula es requerida (mín. 5 caracteres).", path: ["numeroCedula"] });
    if (!data.numeroTelefono || data.numeroTelefono.length < 7) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Teléfono es requerido (mín. 7 caracteres).", path: ["numeroTelefono"] });
    if (!data.correoElectronico) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Correo electrónico es requerido.", path: ["correoElectronico"] });
    if (!data.ciudadResidencia) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ciudad de residencia es requerida.", path: ["ciudadResidencia"] });
    if (!data.hojaDeVida || data.hojaDeVida.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Hoja de vida es requerida.", path: ["hojaDeVida"] });
  }
});

type JobApplicationFormData = z.infer<typeof JobApplicationSchema>;

const initialState: JobApplicationFormState = { message: null, success: false };

export function JobApplicationForm() {
  const [state, formAction] = useFormState(submitJobApplication, initialState);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      interesTrabajar: undefined,
    },
  });
  const { register, control, watch, formState: { errors, isSubmitting } } = form;
  const interesTrabajar = watch("interesTrabajar");

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Información" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success && state.redirectToCourse) {
        setTimeout(() => router.push("/curso"), 2000);
      } else if (state.success && !state.redirectToCourse) {
        form.reset(); // Reset form on successful job application
      }
    }
    if (!state.success && state.fields) {
      Object.entries(state.fields).forEach(([fieldName, error]) => {
        form.setError(fieldName as keyof JobApplicationFormData, { type: "server", message: Array.isArray(error) ? error.join(", ") : error });
      });
    }
  }, [state, toast, router, form]);

  const handleFormSubmit = (data: JobApplicationFormData) => {
    const formData = new FormData();
    (Object.keys(data) as Array<keyof JobApplicationFormData>).forEach((key) => {
        if (key === 'hojaDeVida' && data[key]) {
            formData.append(key, (data[key] as FileList)[0]);
        } else if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, String(data[key]));
        }
    });
    formAction(formData);
  };


  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label className="text-foreground font-semibold">¿Estás interesado/a en trabajar como operador/a de montacargas?</Label>
        <Controller
          name="interesTrabajar"
          control={control}
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} value={field.value} className="mt-2 space-y-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="Sí" id="interesSi" className="border-primary text-primary focus:ring-primary" /><Label htmlFor="interesSi" className="text-foreground">Sí</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="interesNo" className="border-primary text-primary focus:ring-primary" /><Label htmlFor="interesNo" className="text-foreground">No</Label></div>
            </RadioGroup>
          )}
        />
        {errors.interesTrabajar && <p className="text-sm text-destructive mt-1">{errors.interesTrabajar.message}</p>}
      </div>

      {interesTrabajar === "Sí" && (
        <>
          <div>
            <Label className="text-foreground font-semibold">¿Tienes certificado como montacarguista?</Label>
            <Controller
              name="tieneCertificado"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Sí" id="certSi" className="border-primary text-primary focus:ring-primary" /><Label htmlFor="certSi" className="text-foreground">Sí</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="certNo" className="border-primary text-primary focus:ring-primary" /><Label htmlFor="certNo" className="text-foreground">No</Label></div>
                </RadioGroup>
              )}
            />
            {errors.tieneCertificado && <p className="text-sm text-destructive mt-1">{errors.tieneCertificado.message}</p>}
          </div>
          <div><Label htmlFor="nombreCompletoEmp" className="text-foreground">Nombre Completo</Label><Input id="nombreCompletoEmp" {...register("nombreCompleto")} className="mt-1 bg-white text-foreground" />{errors.nombreCompleto && <p className="text-sm text-destructive mt-1">{errors.nombreCompleto.message}</p>}</div>
          <div><Label htmlFor="edadEmp" className="text-foreground">Edad</Label><Input id="edadEmp" type="number" {...register("edad")} className="mt-1 bg-white text-foreground" />{errors.edad && <p className="text-sm text-destructive mt-1">{errors.edad.message}</p>}</div>
          <div><Label htmlFor="numeroCedulaEmp" className="text-foreground">Número de Cédula</Label><Input id="numeroCedulaEmp" {...register("numeroCedula")} className="mt-1 bg-white text-foreground" />{errors.numeroCedula && <p className="text-sm text-destructive mt-1">{errors.numeroCedula.message}</p>}</div>
          <div><Label htmlFor="numeroTelefonoEmp" className="text-foreground">Número de Teléfono</Label><Input id="numeroTelefonoEmp" type="tel" {...register("numeroTelefono")} className="mt-1 bg-white text-foreground" />{errors.numeroTelefono && <p className="text-sm text-destructive mt-1">{errors.numeroTelefono.message}</p>}</div>
          <div><Label htmlFor="correoElectronicoEmp" className="text-foreground">Correo Electrónico</Label><Input id="correoElectronicoEmp" type="email" {...register("correoElectronico")} className="mt-1 bg-white text-foreground" />{errors.correoElectronico && <p className="text-sm text-destructive mt-1">{errors.correoElectronico.message}</p>}</div>
          <div>
            <Label htmlFor="ciudadResidencia" className="text-foreground">Ciudad de Residencia</Label>
            <Controller
                name="ciudadResidencia"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full mt-1 bg-white text-foreground"><SelectValue placeholder="Selecciona tu ciudad" /></SelectTrigger>
                        <SelectContent>
                            {["Zipaquirá", "Tocancipá", "La Calera", "Bogotá", "Otra"].map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.ciudadResidencia && <p className="text-sm text-destructive mt-1">{errors.ciudadResidencia.message}</p>}
          </div>
          <div>
            <Label htmlFor="hojaDeVida" className="text-foreground">Cargar Hoja de Vida (PDF, DOCX, max 5MB)</Label>
            <Input id="hojaDeVida" type="file" {...register("hojaDeVida")} accept=".pdf,.doc,.docx" className="mt-1 bg-white text-foreground file:text-sm file:font-medium file:text-primary file:bg-primary-foreground hover:file:bg-primary/10" />
            {errors.hojaDeVida && <p className="text-sm text-destructive mt-1">{errors.hojaDeVida.message}</p>}
          </div>
        </>
      )}

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : (interesTrabajar === "No" ? "Confirmar" : "Enviar mi Postulación")}
      </Button>
    </form>
  );
}
