import * as z from "zod";

// Sans compilation à la volée : zod testerait sinon `new Function` à la création des schémas,
// que la CSP (render.yaml) bloque et signale à chaque visite. Avant tout schéma : les autres
// fichiers étendent celui-ci. La différence de vitesse est invisible pour un formulaire.
z.config({ jitless: true });

export const contactFormBaseSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().email("Adresse e-mail invalide."),
    phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres.").optional().or(z.literal('')),
    birthdate: z.string().min(1, "La date de naissance est requise."),
});