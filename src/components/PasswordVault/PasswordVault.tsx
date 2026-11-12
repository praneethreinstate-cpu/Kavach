
import { useState, type FormEvent } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import "./PasswordVault.css";

type Credential = {
  id: string;
  website: string;
  username: string;
  password: string;
};

const demoCredentials: Credential[] = [
  {
    id: "demo-1",
    website: "GitHub (Demo)",
    username: "demo@example.com",
    password: "example-only-not-real",
  },
];

const emptyForm = {
  website: "",
  username: "",
  password: "",
};

export default function PasswordVault() {
  const [credentials, setCredentials] =
    useState<Credential[]>(demoCredentials);

  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] =
    useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const filteredCredentials = credentials.filter((item) =>
    `${item.website} ${item.username}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.website.trim() ||
      !form.username.trim() ||
      !form.password
    ) {
      setNotice("Please fill in all fields.");
      return;
    }

    if (editingId) {
      setCredentials((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...form }
            : item
        )
      );
      setNotice("Demo credential updated.");
    } else {
      setCredentials((previous) => [
        {
          id: crypto.randomUUID(),
          ...form,
        },
        ...previous,
      ]);
      setNotice("Demo credential added for this session.");
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(item: Credential) {
    setForm({
      website: item.website,
      username: item.username,
      password: item.password,
    });
    setEditingId(item.id);
    setShowForm(true);
    setNotice("");
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this demo credential?")) return;

    setCredentials((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setVisiblePasswords((previous) =>
      previous.filter((visibleId) => visibleId !== id)
    );

    setNotice("Demo credential deleted.");
  }

  function togglePassword(id: string) {
    setVisiblePasswords((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("Copied to clipboard.");
    } catch {
      setNotice("Clipboard access failed.");
    }
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <section className="pv-container">
      <div className="pv-heading">
        <div>
          <p className="pv-eyebrow">YOUR PRIVATE CREDENTIALS</p>
          <h1>Password Vault</h1>
          <p className="pv-subtitle">
            Organize account details in one place.
          </p>
        </div>

        <button
          className="pv-primary-button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Create Credential
        </button>
      </div>

      <div className="pv-demo-warning">
        <KeyRound size={19} />
        <span>
          Demo mode: credentials are not encrypted or
          permanently saved. Use fictional information only.
        </span>
      </div>

      {notice && (
        <p className="pv-notice" role="status">
          {notice}
        </p>
      )}

      {showForm && (
        <div className="pv-form-panel">
          <div className="pv-form-heading">
            <h2>
              {editingId
                ? "Edit credential"
                : "Create new credential"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close form"
            >
              <X size={19} />
            </button>
          </div>

          <form onSubmit={handleSave} className="pv-form">
            <label htmlFor="pv-website">
              Website / Application
            </label>
            <input
              id="pv-website"
              placeholder="e.g. GitHub"
              value={form.website}
              onChange={(e) =>
                setForm({ ...form, website: e.target.value })
              }
              required
            />

            <label htmlFor="pv-username">
              Username / Email
            </label>
            <input
              id="pv-username"
              placeholder="username@example.com"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />

            <label htmlFor="pv-password">
              Password
            </label>
            <input
              id="pv-password"
              type="password"
              placeholder="Enter a fictional demo password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              autoComplete="off"
              required
            />

            <div className="pv-form-actions">
              <button
                type="button"
                className="pv-cancel-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button type="submit" className="pv-primary-button">
                {editingId ? "Update Demo" : "Save Demo"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pv-list-heading">
        <h2>Saved Credentials</h2>

        <div className="pv-search">
          <Search size={17} />
          <input
            placeholder="Search credentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="pv-credentials">
        {filteredCredentials.map((item) => {
          const isVisible = visiblePasswords.includes(item.id);

          return (
            <article className="pv-card" key={item.id}>
              <div className="pv-card-icon">
                <KeyRound size={23} />
              </div>

              <div className="pv-card-content">
                <h3>{item.website}</h3>
                <p>{item.username}</p>

                <div className="pv-password-row">
                  <span>
                    {isVisible ? item.password : "••••••••••••"}
                  </span>

                  <button
                    title={isVisible ? "Hide password" : "Show password"}
                    aria-label={
                      isVisible ? "Hide password" : "Show password"
                    }
                    onClick={() => togglePassword(item.id)}
                  >
                    {isVisible ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pv-card-actions">
                <button
                  title="Copy username"
                  aria-label="Copy username"
                  onClick={() => handleCopy(item.username)}
                >
                  <Copy size={17} />
                </button>

                <button
                  title="Copy password"
                  aria-label="Copy password"
                  onClick={() => handleCopy(item.password)}
                >
                  <KeyRound size={17} />
                </button>

                <button
                  title="Edit credential"
                  aria-label="Edit credential"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil size={17} />
                </button>

                <button
                  title="Delete credential"
                  aria-label="Delete credential"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          );
        })}

        {filteredCredentials.length === 0 && (
          <div className="pv-empty">
            <KeyRound size={30} />
            <h3>No credentials found</h3>
            <p>Create a demo credential or change your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
