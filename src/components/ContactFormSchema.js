import * as z from "zod";

export const contactFormBaseSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().email("Adresse e-mail invalide."),
    phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères.").optional().or(z.literal('')),
    birthdate: z.string().min(1, "La date de naissance est requise."),
});