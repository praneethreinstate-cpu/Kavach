
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./RecoveryKey.css";

function generateRecoveryCode(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("").toUpperCase();

  return hex.match(/.{1,8}/g)!.join("-");
}

export default function RecoveryKey() {
  const navigate = useNavigate();

  const [recoveryCode] = useState(generateRecoveryCode);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
    } catch {
      alert("Copy failed. Please copy the code manually.");
    }
  }

  function downloadCode() {
    const content =
      "KAVACH - RECOVERY CODE\n\n" +
      recoveryCode +
      "\n\nKeep this code private and store it safely.\n" +
      "Demo only: this code is not yet connected to vault recovery.\n";

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "kavach-recovery-code.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="recovery-page">
      <header className="recovery-header">
        <a href="/login" className="recovery-logo">
          <LockKeyhole size={25} />
          <span>
            kavach<span className="recovery-gold">.</span>
          </span>
        </a>

        <span className="recovery-header-label">
          03 / SECURE YOUR ACCESS
        </span>
      </header>

      <main className="recovery-main">
        <section className="recovery-panel">
          <div className="recovery-icon">
            <KeyRound size={30} strokeWidth={1.5} />
          </div>

          <p className="recovery-overline">
            ONE MORE STEP
          </p>

          <h1>
            Your safety net.
            <br />
            <em>Only yours.</em>
          </h1>

          <p className="recovery-description">
            Save this recovery code somewhere private.
            When vault recovery is enabled, your recovery
            credentials will help you regain access if you
            forget your master password.
          </p>

          <div className="recovery-code-box">
            <span className="recovery-code-label">
              YOUR RECOVERY CODE
            </span>

            <p className="recovery-code">
              {recoveryCode}
            </p>

            <div className="recovery-actions">
              <button type="button" onClick={copyCode}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Copied" : "Copy code"}
              </button>

              <button type="button" onClick={downloadCode}>
                <Download size={17} />
                Download
              </button>
            </div>
          </div>

          <div className="recovery-warning">
            <ShieldCheck size={22} />
            <p>
              <strong>Keep this code safe.</strong>
              <br />
              Don't share it, email it to yourself, or store
              it in an unprotected location.
            </p>
          </div>

          <label className="recovery-confirm">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
            />
            <span>
              I have saved my recovery code somewhere safe.
            </span>
          </label>

          <button
            type="button"
            className="recovery-continue"
            disabled={!saved}
            onClick={() => navigate("/dashboard")}
          >
            Continue to my vault
            <ArrowUpRight size={19} />
          </button>

          <p className="recovery-footnote">
            This is a setup demonstration. Real recovery
            protection will be enabled with vault encryption.
          </p>
        </section>
      </main>

      <footer className="recovery-footer">
        <span>KAVACH / KEEP WHAT MATTERS</span>
        <span>ONLY YOU HOLD THE KEY ↗</span>
      </footer>
    </div>
  );
}
