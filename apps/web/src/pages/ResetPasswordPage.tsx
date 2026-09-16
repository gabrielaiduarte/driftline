import { useState, useEffect, type SubmitEvent } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Check } from "lucide-react"
import "./ResetPasswordPage.css"

type RecoveryStatus =
    | "checking"
    | "valid"
    | "invalid"
    | "updated"

export default function ResetPasswordPage() {

    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>("checking")

    useEffect(() => {
        let recoveryDetected = false

        /**
         * Supabase emits PASSWORD_RECOVERY alongside the reset link
         * Normal visit (from search) shouldn't trigger it
         */

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY" && session) {
                recoveryDetected = true
                setRecoveryStatus("valid")
            }
        })

        async function checkRecoverySession() {
            // Supabase may need time to process auth info 
            await new Promise((resolve) => setTimeout(resolve, 500))

            if (!recoveryDetected) {
                setRecoveryStatus("invalid")
            }
        }

        checkRecoverySession()

        // Prevent auth listener from remaining active after page unmounts
        return () => {
            subscription.unsubscribe()
        }
    }, [])

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

        /**
         * End recovery session after pw is changed 
         * User should sign in normally with new pw
         */
        await supabase.auth.signOut()

        setIsLoading(false)
        setRecoveryStatus("updated")
    }

    if (recoveryStatus === "checking") {
        return (
            <main className="reset-password-page">
                <section className="reset-password-card">

                    <div className="reset-password-brand">
                        <div className="reset-password-brand-mark">D</div>
                        <span className="reset-password-brand-name">Driftline</span>
                    </div>

                    <h1 className="reset-password-title">
                        Verifying reset link...
                    </h1>

                    <p className="reset-password-description">
                        Please wait while we verify your password reset request
                    </p>

                </section>
            </main>
        )
    }

    if (recoveryStatus === "invalid") {
        return (
            <main className="reset-password-page">
                <section className="reset-password-card">

                    <div className="reset-password-brand">
                        <div className="reset-password-brand-mark">D</div>
                        <span className="reset-password-brand-name">Driftline</span>
                    </div>

                    <h1 className="reset-password-title">
                        Reset link invalid or expired
                    </h1>

                    <p className="reset-password-description">
                        Request a new password reset link from the sign-in page
                    </p>

                    <button
                        className="reset-password-button"
                        type="button"
                        onClick={() => navigate("/signin", { replace: true})}
                    >
                        Back to sign in
                    </button>

                </section>
            </main>
        )
    }

    if (recoveryStatus === "updated") {
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
                        onClick={() => navigate("/signin", { replace: true})}
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