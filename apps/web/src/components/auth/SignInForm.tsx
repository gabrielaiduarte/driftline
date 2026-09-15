import { useState, type SubmitEvent } from "react";
import { supabase } from "../../lib/supabase";
import "./SignInForm.css"

export default function SignInForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit( event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMessage(null)
        setIsLoading(true)

        // Supabase takes care of credential verification and session creation
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
            return
        }

        setIsLoading(false)

        // Temp: we need authenticated routing
        console.log("Signed in successfully")
    }

    return (
        <form className="signin-form" onSubmit={handleSubmit}>
            <div className="signin-field">
                <label className="signin-label" htmlFor="email">
                    Email
                </label>

                <input
                    className="signin-input"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                /> 
            </div>

            <div className="signin-field">
                <label className="signin-label" htmlFor="password">
                    Password
                </label>

                <input
                    className="signin-input"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />
            </div>

            <label className="signin-remember">
                <input
                    className="signin-checkbox"
                    type="checkbox"
                    defaultChecked
                />
                <span>Keep me signed in</span>
            </label>

            {errorMessage && (
                <p className="signin-error" role="alert">{errorMessage}</p>
            )}

            <button
                className="signin-button"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <button 
                className="signin-forgot-password"
                type="button"
            >
                Forgot your password?
            </button>
        </form>
    )
}