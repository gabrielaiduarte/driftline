import { create } from "domain";
import { z } from "zod";

/* Define and validate the required data when creting an incident
 * Protects API from malformed or unexpected request data 
*/
export const createIncidentSchema = z.object({
    // Incident title: text, no more than 200 chars
    title: z.string().trim().min(1).max(200),
    // Description provides more contect 5000 chars
    description: z.string().trim().min(1).max(5000),
    // Restricted by values used in PostgreSQL enum
    severity: z.enum(["P1", "P2", "P3", "P4"]),
    // Optional because incident can be reportes before knowing service or component responsible
    affectedSystem: z
        .string()
        .trim()
        .max(200)
        .optional()
        .nullable()
})

// Generate TS type directly from Zod schema
// Keeps compile time types synced with runtime validation
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;