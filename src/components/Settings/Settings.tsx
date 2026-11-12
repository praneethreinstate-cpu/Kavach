
import { useState, type FormEvent } from "react";
import {
  UserRound,
  ShieldCheck,
  Palette,
  LockKeyhole,
  Save,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import "./Settings.css";

export default function Settings() {
  const [name, setName] = useState("Kavach User");
  const [email, setEmail] = useState("demo@example.com");
  const [theme, setTheme] = useState("light");
  const [autoLock, setAutoLock] = useState("5");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Profile changes saved for this demo session.");
  }

  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setMessage(
      "Password change is not connected yet. No password was changed."
    );
  }

  return (
    <section className="ks-container">
      <div className="ks-heading">
        <p className="ks-eyebrow">YOUR PERSONAL SPACE</p>
        <h1>Settings</h1>
        <p>Manage your Kavach preferences and account details.</p>
      </div>

      <div className="ks-demo-note">
        <Info size={18} />
        Settings are for UI demonstration. Authentication,
        password changes and persistent preferences are not
        connected yet.
      </div>

      {message && (
        <p className="ks-message" role="status">{message}</p>
      )}

      {/* PROFILE */}
      <section className="ks-card">
        <div className="ks-card-heading">
          <UserRound size={21} />
          <div>
            <h2>My Profile</h2>
            <p>Manage your basic account information.</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="ks-form">
          <label htmlFor="ks-name">Display name</label>
          <input
            id="ks-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="ks-email">Email address</label>
          <input
            id="ks-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="ks-primary">
            <Save size={17} />
            Save Profile
          </button>
        </form>
      </section>

      {/* SECURITY */}
      <section className="ks-card">
        <div className="ks-card-heading">
          <ShieldCheck size={21} />
          <div>
            <h2>Security</h2>
            <p>Configure your future vault protection options.</p>
          </div>
        </div>

        <div className="ks-form">
          <label htmlFor="ks-autolock">Auto-lock vault</label>
          <select
            id="ks-autolock"
            value={autoLock}
            onChange={(e) => setAutoLock(e.target.value)}
          >
            <option value="1">After 1 minute</option>
            <option value="5">After 5 minutes</option>
            <option value="10">After 10 minutes</option>
            <option value="15">After 15 minutes</option>
          </select>

          <p className="ks-helper">
            Selected: {autoLock} minutes. Auto-lock is not active yet.
          </p>
        </div>
      </section>

      {/* CHANGE PASSWORD */}
      <section className="ks-card">
        <div className="ks-card-heading">
          <LockKeyhole size={21} />
          <div>
            <h2>Change Master Password</h2>
            <p>Password management will be enabled with authentication.</p>
          </div>
        </div>

        <form onSubmit={changePassword} className="ks-form">
          <label htmlFor="ks-current-password">
            Current master password
          </label>
          <input
            id="ks-current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Demo only — do not enter a real password"
            autoComplete="off"
            required
          />

          <label htmlFor="ks-new-password">
            New master password
          </label>

          <div className="ks-password-field">
            <input
              id="ks-new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Fictional test password only"
              autoComplete="off"
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

          <button type="submit" className="ks-primary">
            Change Password (Demo)
          </button>
        </form>
      </section>

      {/* APPEARANCE */}
      <section className="ks-card">
        <div className="ks-card-heading">
          <Palette size={21} />
          <div>
            <h2>Appearance</h2>
            <p>Choose your preferred interface style.</p>
          </div>
        </div>

        <div className="ks-theme-options">
          <button
            type="button"
            className={theme === "light" ? "ks-theme-selected" : ""}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            type="button"
            className={theme === "dark" ? "ks-theme-selected" : ""}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>

        <p className="ks-helper">
          Theme selection is a preview preference; the full
          dashboard theme does not change yet.
        </p>
      </section>
    </section>
  );
}
