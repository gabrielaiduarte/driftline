import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./IncidentsPage.css"

export default function IncidentsPage() {

    const navigate = useNavigate()

    const [isSigninOut, setIsSigninOut] = useState(false)

    async function handleSignOut() {
        setIsSigninOut(true)

        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error("Failed to sign out:", error.message)
            setIsSigninOut(false)
            return
        }

        navigate("/signin", { replace: true})
    }

    return (
        <main>
            <h1> Incidents</h1>

            <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigninOut}
            >
                {isSigninOut ? "Signing out..." : "Sign out"}
            </button>
        </main>
    )
}