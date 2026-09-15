import { Router } from "express";
import { createSupabaseClient } from "../lib/supabase.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { createIncidentSchema } from "../schemas/incident.js";

const router = Router()

// require a valid authenticated user from this point on
router.use(requireAuth)

// creates a new incident from validated user input
router.post("/", async (req, res) => {
    const authenticatedReq = req as AuthenticatedRequest;

    // Validate incoming req body before use
    // safeParse allows to handle invalid input w/o throwing exception
    const result = createIncidentSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({
            error: "Invalid incident data",
            details: result.error.flatten,
        })
        return
    }

    const { title, description, severity, affectedSystem } = result.data

    /* Create supabase client using authenticated user's token
     * Allows PostegreSQL row level security to evaluate the request
     * using the identity of the person who is creating the incident
    */
   const supabase = createSupabaseClient(authenticatedReq.accessToken)

   // Convert our APIs camelCase naming to snake_case used by Postgre
   const { data: incident, error } = await supabase 
        .from("incidents")
        .insert({
            title,
            description,
            severity,
            affectedSystem: affectedSystem ?? null,
            created_by: authenticatedReq.user.id,
        })
        .select()
        .single()

   if (error) {
        console.error("Failed to create incident:", error.message)

        res.status(500).json({
            error: "Failed to create incident"
        })
        return
   }

   // 201 for success
   res.status(201).json({
    incident,
   })
})

export default router;