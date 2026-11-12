
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const passwordValid = password.length >= 12;
  const passwordsMatch = password === confirmPassword;

  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!passwordValid) {
      setMessage("Password must contain at least 12 characters.");
      return;
    }

    if (!passwordsMatch) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Registration form ready. Account creation will be connected later.");
  }

  return (
    <div className="register-page">
      <header className="register-header">
        <a href="/login" className="register-logo">
          <LockKeyhole size={25} />
          <span>kavach<span className="register-gold">.</span></span>
        </a>
        <a href="/login" className="register-back">
          Back to login <ArrowUpRight size={17} />
        </a>
      </header>

      <main className="register-main">
        <section className="register-left">
          <p className="register-label">02 / A NEW BEGINNING</p>
          <h1>
            Your world.<br />
            Your rules.<br />
            <em>Your Kavach.</em>
          </h1>
          <p>A private place for everything that matters.</p>
        </section>

        <section className="register-center">
          <div className="register-panel">
            <div className="register-lock">
              <span />
              <LockKeyhole size={23} />
              <span />
            </div>

            <p className="register-label">YOUR SPACE. YOUR RULES.</p>
            <h2>Create your account.</h2>
            <p className="register-subtitle">
              Start protecting what matters to you.
            </p>

            <form onSubmit={handleRegister}>
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="reg-password"> password</label>
              <div className="register-password">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 12 characters"
                  autoComplete="new-password"
                  minLength={12}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="register-hint">
                {password.length === 0
                  ? "Use at least 12 characters."
                  : passwordValid
                    ? "Minimum password length met."
                    : `${12 - password.length} more characters required.`}
              </p>

              <label htmlFor="reg-confirm">Confirm  password</label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />

              <button className="register-submit" type="submit">
                Create Account <ArrowUpRight size={19} />
              </button>

              {message && <p className="register-message" role="status">{message}</p>}
            </form>

            <div className="register-divider">or continue with</div>

            <button
              type="button"
              className="register-google"
              onClick={() => setMessage("Google sign-up is not connected yet.")}
            >
              Continue with Google
            </button>

            <p className="register-signin">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </section>

        <aside className="register-right">
          <div className="register-orbit">✦</div>
          <p className="register-label">PRIVATE BY DESIGN</p>
          <p>Your secrets deserve a place of their own.</p>
        </aside>
      </main>

      <footer className="register-footer">
        <span>KAVACH / KEEP WHAT MATTERS</span>
        <span>ONLY YOU HOLD THE KEY ↗</span>
      </footer>
    </div>
  );
}
