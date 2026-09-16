import { useState, type SubmitEvent } from "react";
import { setRememberMe, supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./SignInForm.css"

export default function SignInForm() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMeState] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isResetLoading, setIsResetLoading] = useState(false)

    async function handleSubmit( event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMessage(null)
        setSuccessMessage(null)
        setIsLoading(true)
        setRememberMe(rememberMe)

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
        navigate("/incidents", { replace: true})
    }

    async function handleForgotPassword() {
        setErrorMessage(null)
        setSuccessMessage(null)

        if (!email.trim()) {
            setErrorMessage("Enter your email address before requesting a password reset")
            return
        }

        setIsResetLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim(),
        {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            setErrorMessage(error.message)
            setIsResetLoading(false)
            return
        }

        setSuccessMessage("Check your email for a password reset link")
        setIsResetLoading(false)
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
                    checked={rememberMe}
                    onChange={(event) => setRememberMeState(event.target.checked)}
                />
                <span>Keep me signed in</span>
            </label>

            {errorMessage && (
                <p className="signin-error" role="alert">{errorMessage}</p>
            )}

            {successMessage && (
                <p className="signin-success" role="status">{successMessage}</p>
            )}

            <button
                className="signin-button"
                type="submit"
                disabled={isLoading || isResetLoading}
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <button 
                className="signin-forgot-password"
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading || isResetLoading}
            >
                {isResetLoading ? "Sending reset link..." : "Forgot your password?"}
            </button>
        </form>
    )
}