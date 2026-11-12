
import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Demo credentials - for local testing only
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "Kavach@123";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (
      email.trim() === DEMO_USERNAME &&
      password === DEMO_PASSWORD
    ) {
      navigate("/dashboard");
    } else {
      setMessage("Invalid username or password.");
    }
  }

  function handleGoogleLogin() {
    setMessage("Google sign-in is not connected yet.");
  }

  return (
    <div className="kavach-login">
      {/* HEADER */}
      <header className="kv-header">
        <a href="/login" className="kv-logo">
          <LockKeyhole size={25} strokeWidth={1.5} />
          <span>
            kavach<span className="kv-gold">.</span>
          </span>
        </a>

        <a href="#vault" className="kv-explore">
          Explore the vault
          <ArrowUpRight size={19} />
        </a>
      </header>

      {/* MAIN CONTENT */}
      <main className="kv-main">
        {/* LEFT SECTION */}
        <section className="kv-left">
          <span className="kv-small-label">
            01 / THE ENTRANCE
          </span>

          <h1>
            Some things
            <br />
            are only
            <br />
            <em>yours.</em>
          </h1>

          <div className="kv-short-line" />

          <p>Keep them that way.</p>
        </section>

        {/* CENTER SECTION */}
        <section className="kv-center">
          {/* KEYHOLE DESIGN */}
          <svg
            className="kv-keyhole"
            viewBox="0 0 650 850"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[0, 12, 24, 36].map((offset, index) => {
              const left = 45 + offset;
              const right = 605 - offset;
              const top = 25 + offset;
              const neckLeft = 125 + offset;
              const neckRight = 525 - offset;
              const bottom = 830 - offset;

              return (
                <path
                  key={index}
                  d={`
                    M ${neckLeft} 430
                    C ${left - 30} 330,
                      ${left - 20} ${top},
                      325 ${top}
                    C ${right + 20} ${top},
                      ${right + 30} 330,
                      ${neckRight} 430
                    L ${right} ${bottom}
                    Q 325 ${bottom + 12},
                      ${left} ${bottom}
                    Z
                  `}
                  fill="none"
                  stroke={
                    index === 1 ? "#B59A60" : "#DDD5C3"
                  }
                  strokeWidth={index === 1 ? 1.4 : 0.8}
                  opacity={index === 1 ? 0.9 : 0.65}
                />
              );
            })}
          </svg>

          {/* LOGIN FORM */}
          <div className="kv-form-area">
            <div className="kv-star" aria-hidden="true">
              ✦
            </div>

            <div className="kv-lock-heading">
              <span />
              <LockKeyhole size={22} strokeWidth={1.5} />
              <span />
            </div>

            <p className="kv-overline">
              YOUR KEY. YOUR WORLD.
            </p>

            <h2>Step into your own.</h2>

            <p className="kv-subtitle">
              Everything that matters, on the other side.
            </p>

            <form
              onSubmit={handleLogin}
              className="kv-form"
            >
              {/* USERNAME */}
              <label htmlFor="kv-username">
                Username
              </label>

              <input
                id="kv-username"
                type="text"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
                autoComplete="username"
                required
              />

              {/* PASSWORD */}
              <label htmlFor="kv-password">
                Master password
              </label>

              <div className="kv-password-wrap">
                <input
                  id="kv-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("");
                  }}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="kv-eye"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="kv-submit"
              >
                <span>Login</span>
                <ArrowUpRight size={20} />
              </button>

              {/* ERROR MESSAGE */}
              {message && (
                <p
                  className="kv-message"
                  role="status"
                >
                  {message}
                </p>
              )}
            </form>

            {/* GOOGLE SSO */}
            <div className="kv-sso">
              <div className="kv-sso-divider">
                <span>or continue with</span>
              </div>

              <button
                type="button"
                className="kv-google-btn"
                onClick={handleGoogleLogin}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 6.51 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.76 7.18l7.73 6C44.42 38.03 46.98 31.88 46.98 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>

                <span>Continue with Google</span>
              </button>
            </div>

            {/* REGISTER LINK */}
            <p className="kv-register">
              Don't have an account?{" "}
              <a href="/register">
                Create account
              </a>
            </p>
          </div>

          <p className="kv-bottom-quote">
            ✦ THE BEST OF THE WORLD CAN WAIT.
          </p>
        </section>

        {/* RIGHT SECTION */}
        <aside className="kv-right">
          <div className="kv-orbit">
            <span />
          </div>

          <p className="kv-right-heading">
            LESS NOISE.
            <br />
            MORE PEACE OF MIND.
          </p>

          <p className="kv-right-description">
            A little space
            <br />
            between your world
            <br />
            and everyone else's.
          </p>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="kv-footer">
        <span>KAVACH / KEEP WHAT MATTERS</span>
        <span>UI CONCEPT · SAMPLE DETAILS ONLY</span>
        <span>ONLY YOU HOLD THE KEY ↗</span>
      </footer>
    </div>
  );
}
