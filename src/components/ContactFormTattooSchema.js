import * as z from "zod";
import { contactFormBaseSchema } from "./ContactFormSchema";

export const contactFormTattooSchema = contactFormBaseSchema.extend({
    oneOrManyTattoos: z.boolean(),
    isForACoverage: z.boolean(),
    size: z.string().min(1, "La taille doit être spécifiée."),
    placement: z.string().min(1, "Le placement doit être spécifié."),
    description: z.string().min(10, "Les détails doivent contenir au moins 10 caractères."),
    files: z.array(z.instanceof(File)).max(5, "Vous pouvez télécharger jusqu'à 5 fichiers."),
    appointmentPreferredDate: z.string().min(1, "La date préférée du rendez-vous est requise."),
});