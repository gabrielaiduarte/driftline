import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type PublicOnlyRouteProps = {
    children: ReactNode
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        async function checkSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            setIsAuthenticated(Boolean(session))
        }

        checkSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(Boolean(session))
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    if (isAuthenticated) {
        return <Navigate to="/incidents" replace />
    }

    return children
}