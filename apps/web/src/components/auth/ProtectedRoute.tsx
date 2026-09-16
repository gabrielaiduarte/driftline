import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type ProtectedRouteProps = {
    children: ReactNode;
}

export default function ProtectedRoute({ children } : ProtectedRouteProps) {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        async function checkSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            setIsAuthenticated(Boolean(session))
        }

        checkSession();

        // Keep route synced when Supabase signs in, out, refreshes token, or restores session
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(Boolean(session))
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    if (isAuthenticated === null) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />
    }

    return children
}