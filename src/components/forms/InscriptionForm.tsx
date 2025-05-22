// src/components/forms/InscriptionForm.tsx
"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { submitInscription, type InscriptionFormState } from "@/actions/inscripcionActions";

const InscriptionSchema = z.object({
  nombreCompleto: z.string().min(3, { message: "Nombre completo es requerido y debe tener al menos 3 caracteres." }),
  edad: z.coerce.number({ invalid_type_error: "Edad debe ser un número."}).min(18, { message: "Debe ser mayor de 18 años." }).max(99, { message: "Edad no válida."}),
  numeroCedula: z.string().min(5, { message: "Número de cédula es requerido y debe tener al menos 5 caracteres." }),
  esBachiller: z.enum(["Sí", "No"], { required_error: "Por favor, seleccione si es bachiller." }),
});

type InscriptionFormData = z.infer<typeof InscriptionSchema>;

const initialState: InscriptionFormState = {
  message: null,
  success: false,
};

export function InscriptionForm() {
  const [state, formAction] = useFormState(submitInscription, initialState);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<InscriptionFormData>({
    resolver: zodResolver(InscriptionSchema),
    defaultValues: {
      nombreCompleto: "",
      edad: undefined,
      numeroCedula: "",
      esBachiller: undefined,
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success && state.whatsappLink) {
        // Wait for toast to show, then redirect
        setTimeout(() => {
           window.location.href = state.whatsappLink!;
        }, 2000);
      }
    }
    if (!state.success && state.fields) {
        Object.entries(state.fields).forEach(([fieldName, error]) => {
            form.setError(fieldName as keyof InscriptionFormData, { type: "server", message: Array.isArray(error) ? error.join(", ") : error });
        });
    }
  }, [state, toast, router, form]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="nombreCompleto" className="text-foreground">Nombre Completo</Label>
        <Input id="nombreCompleto" name="nombreCompleto" {...form.register("nombreCompleto")} className="mt-1 bg-white text-foreground border-gray-300 focus:border-primary focus:ring-primary" />
        {form.formState.errors.nombreCompleto && <p className="text-sm text-destructive mt-1">{form.formState.errors.nombreCompleto.message}</p>}
      </div>

      <div>
        <Label htmlFor="edad" className="text-foreground">Edad</Label>
        <Input id="edad" name="edad" type="number" {...form.register("edad")} className="mt-1 bg-white text-foreground border-gray-300 focus:border-primary focus:ring-primary" />
        {form.formState.errors.edad && <p className="text-sm text-destructive mt-1">{form.formState.errors.edad.message}</p>}
      </div>

      <div>
        <Label htmlFor="numeroCedula" className="text-foreground">Número de Cédula</Label>
        <Input id="numeroCedula" name="numeroCedula" {...form.register("numeroCedula")} className="mt-1 bg-white text-foreground border-gray-300 focus:border-primary focus:ring-primary" />
        {form.formState.errors.numeroCedula && <p className="text-sm text-destructive mt-1">{form.formState.errors.numeroCedula.message}</p>}
      </div>

      <div>
        <Label className="text-foreground">¿Eres bachiller?</Label>
        <RadioGroup name="esBachiller" onValueChange={(value) => form.setValue("esBachiller", value as "Sí" | "No")} className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Sí" id="bachillerSi" className="border-primary text-primary focus:ring-primary" />
            <Label htmlFor="bachillerSi" className="text-foreground">Sí</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="bachillerNo" className="border-primary text-primary focus:ring-primary" />
            <Label htmlFor="bachillerNo" className="text-foreground">No</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.esBachiller && <p className="text-sm text-destructive mt-1">{form.formState.errors.esBachiller.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg rounded-md shadow-md" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Enviando..." : "Enviar y Continuar"}
      </Button>
    </form>
  );
}
