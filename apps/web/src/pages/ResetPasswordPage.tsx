import { useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Check } from "lucide-react"
import "./ResetPasswordPage.css"

export default function ResetPasswordPage() {

    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        setErrorMessage(null)

        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters")
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match")
            return
        }

        setIsLoading(true)

        // Recovery link establishes auth recovery session, Supabase only allows update when session
        // is valid
        const { error } = await supabase.auth.updateUser({
            password
        })

        if (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
            return
        }

        await supabase.auth.signOut()

        setIsLoading(false)
        setIsPasswordUpdated(true)
    }

    if (isPasswordUpdated) {
        return (
            <main className="reset-password-page">
                <section className="reset-password-card reset-password-success">

                    <div className="reset-password-brand">

                        <div className="reset-password-brand-mark">D</div>

                        <span className="reset-password-brand-name">Driftline</span>

                    </div>

                    <div className="reset-password-success-icon" aria-hidden="true">
                        <Check size={30} strokeWidth={2.5} />
                    </div>

                    <h1 className="reset-password-title">
                        Your password has been updated
                    </h1>

                    <p className="reset-password-description">
                        You can now sign in to your Driftline account
                        with your new password
                    </p>

                    <button
                        className="reset-password-button"
                        type="button"
                        onClick={() => navigate("/signin", { replace: true })}
                    >
                        Back to sign in
                    </button>
                </section>
            </main>
        )
    }

    return (
        <main className="reset-password-page">
            <section className="reset-password-card">

                <div className="reset-password-header">
                    <div className="reset-password-brand">
                        <div className="reset-password-brand-mark">D</div>
                        <span className="reset-password-brand-name">Driftline</span>
                    </div>

                    <h1 className="reset-password-title">Set a new password</h1>

                    <p className="reset-password-description">
                        Choose a new password for your Driftline account
                    </p>
                </div>

                <form className="reset-password-form" onSubmit={handleSubmit}>

                    <div className="reset-password-field">

                        <label className="reset-password-label" htmlFor="new-password">
                            New Password
                        </label>

                        <input 
                            className="reset-password-input"
                            id="new-password"
                            name="new-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            required
                        />

                    </div>

                    <div className="reset-password-field">

                        <label className="reset-password-label" htmlFor="confirm-password">
                            Confirm new password
                        </label>

                        <input
                            className="reset-password-input"
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            required
                        />

                    </div>

                    {errorMessage && (
                        <p className="reset-password-error" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        className="reset-password-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating password..." : "Update password"}
                    </button>

                </form>

            </section>
        </main>
    )
}