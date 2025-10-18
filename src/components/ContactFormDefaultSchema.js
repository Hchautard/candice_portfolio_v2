import * as z from "zod";
import { contactFormBaseSchema } from "./ContactFormSchema";

export const contactFormDefaultSchema = contactFormBaseSchema.extend({
    subject: z.string().min(5, "L'objet doit contenir au moins 5 caractères."),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères."),
});