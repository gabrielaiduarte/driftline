import SignInForm from "../components/auth/SignInForm";
import "./SignInPage.css";

export default function SignInPage() {
  return (
    <main className="signin-page">
      <section className="signin-visual">
        <div className="signin-brand">
          <div className="signin-brand-mark">D</div>
          <span className="signin-brand-name">Driftline</span>
        </div>

        <div className="signin-message">
          <h1 className="signin-heading">
            Turn incidents
            <br />
            into knowledge.
          </h1>

          <p className="signin-tagline">
            Detect. Investigate. Solve.
            <br />
            Faster, together.
          </p>
        </div>
      </section>

      <section className="signin-panel">
        <div className="signin-card">
          <div className="signin-card-header">
            <h2 className="signin-card-title">Welcome back</h2>
            <p className="signin-card-description">
              Sign in to your Driftline workspace.
            </p>
          </div>

          <SignInForm />
        </div>
      </section>
    </main>
  )
}