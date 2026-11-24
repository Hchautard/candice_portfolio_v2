import * as z from "zod";
import { contactFormBaseSchema } from "./ContactFormSchema";

export const contactFormTattooSchema = contactFormBaseSchema.extend({
    oneOrManyTattoos: z.boolean(),
    isForACoverage: z.boolean(),
    size: z.string().min(1, "La taille doit être précisée."),
    placement: z.string().min(1, "L'emplacement doit être précisé."),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
    files: z.array(z.instanceof(File)).max(5, "5 images maximum."),
    appointmentPreferredDate: z.string().optional().or(z.literal('')),
});