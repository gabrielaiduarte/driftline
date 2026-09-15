import type { NextFunction, Request, Response } from "express";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "../lib/supabase.js";

// Extend the request type from express so authenticated routes access req.user
export type AuthenticatedRequest = Request & {
    user: User
    accessToken: string
} 

export async function requireAuth(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const authorization = req.headers.authorization

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Missing or invalid authorization header."
        });
        return
    }

    const accessToken = authorization.slice("Bearer ".length);

    const supabase = createSupabaseClient(accessToken)

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
        res.status(401).json({
            error: "Invalid or expired access token"
        })
        return
    }

    // Store verified identity for downstream route handlers
    (req as AuthenticatedRequest).user = user;
    (req as AuthenticatedRequest).accessToken = accessToken;

    next()
}
