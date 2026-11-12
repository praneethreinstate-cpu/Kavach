
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  ArrowDownToLine,
  Bell,
  Check,
  ChevronDown,
  Eye,
  File,
  FileImage,
  FileText,
  Folder,
  FolderPlus,
  HardDrive,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import PasswordVault from "../PasswordVault/PasswordVault";
import Settings from "../Settings/Settings";
import FilePreview from "../FilePreview/FilePreview";
import "./Dashboard.css";

type VaultFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  folder: string;
  date: string;
  file?: File;
};

const sampleFiles: VaultFile[] = [
  {
    id: "sample-1",
    name: "Personal Notes.pdf",
    size: 245760,
    type: "application/pdf",
    folder: "Documents",
    date: "Demo file",
  },
  {
    id: "sample-2",
    name: "Travel Memories.jpg",
    size: 1572864,
    type: "image/jpeg",
    folder: "Photos",
    date: "Demo file",
  },
  {
    id: "sample-3",
    name: "Important Records.pdf",
    size: 524288,
    type: "application/pdf",
    folder: "Documents",
    date: "Demo file",
  },
];

const initialFolders = ["Documents", "Photos", "Personal"];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return <FileImage size={20} />;
  }

  if (type.includes("pdf") || type.startsWith("text/")) {
    return <FileText size={20} />;
  }

  return <File size={20} />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<VaultFile[]>(sampleFiles);
  const [folders, setFolders] = useState<string[]>(initialFolders);
  const [activeView, setActiveView] = useState("Overview");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("Documents");
  const [notice, setNotice] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const totalSize = files.reduce(
    (sum, item) => sum + item.size,
    0
  );

  const filteredFiles = useMemo(() => {
    return files.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFolder =
        activeView !== "Folders" ||
        item.folder === selectedFolder;

      return matchesSearch && matchesFolder;
    });
  }, [files, search, activeView, selectedFolder]);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);

    if (selected.length === 0) return;

    const uploaded: VaultFile[] = selected.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      folder: selectedFolder,
      date: new Date().toLocaleDateString(),
      file,
    }));

    setFiles((previous) => [...uploaded, ...previous]);

    setNotice(
      `${selected.length} file(s) added to this demo session. Files are not encrypted or permanently saved.`
    );

    event.target.value = "";
  }

  function handleDelete(id: string) {
    setFiles((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setNotice("File removed from this demo session.");
  }

  function handleDownload(item: VaultFile) {
    if (!item.file) {
      setNotice("Sample files cannot be downloaded.");
      return;
    }

    const url = URL.createObjectURL(item.file);
    const link = document.createElement("a");

    link.href = url;
    link.download = item.name;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handlePreview(item: VaultFile) {
    if (!item.file) {
      setNotice(
        "Demo sample files have no preview content. Upload a real file to preview it."
      );
      return;
    }

    setPreviewFile(item.file);
  }

  function handleCreateFolder() {
    const name = window.prompt("Enter a folder name:");

    if (!name?.trim()) return;

    const cleanName = name.trim();

    const alreadyExists = folders.some(
      (folder) =>
        folder.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
      setNotice("A folder with that name already exists.");
      return;
    }

    setFolders((previous) => [...previous, cleanName]);
    setSelectedFolder(cleanName);
    setActiveView("Folders");

    setNotice(
      `Folder "${cleanName}" created for this demo session.`
    );
  }

  function openFolder(name: string) {
    setSelectedFolder(name);
    setActiveView("Folders");
    setMenuOpen(false);
  }

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "My Files", icon: File },
    { label: "Folders", icon: Folder },
    { label: "Password Vault", icon: KeyRound },
    { label: "Recent", icon: HardDrive },
  ];

  return (
    <div className="dash-layout">
      {/* SIDEBAR */}
      <aside
        className={`dash-sidebar ${
          menuOpen ? "dash-sidebar-open" : ""
        }`}
      >
        <div className="dash-brand">
          <LockKeyhole size={25} strokeWidth={1.5} />

          <span>
            kavach<span className="dash-brand-dot">.</span>
          </span>

          <button
            type="button"
            className="dash-mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="dash-workspace-label">
          YOUR WORKSPACE
        </div>

        <nav className="dash-nav" aria-label="Vault navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`dash-nav-item ${
                activeView === label ? "dash-nav-active" : ""
              }`}
              onClick={() => {
                setActiveView(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-divider" />

        {/* FOLDERS */}
        <div className="dash-sidebar-heading">
          <span>MY FOLDERS</span>

          <button
            type="button"
            onClick={handleCreateFolder}
            aria-label="Create folder"
          >
            <Plus size={17} />
          </button>
        </div>

        <div className="dash-folder-nav">
          {folders.map((folder) => (
            <button
              type="button"
              key={folder}
              onClick={() => openFolder(folder)}
              className={
                activeView === "Folders" &&
                selectedFolder === folder
                  ? "dash-folder-selected"
                  : ""
              }
            >
              <Folder size={16} />
              <span>{folder}</span>
            </button>
          ))}
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="dash-sidebar-bottom">
          <div className="dash-security-card">
            <ShieldCheck size={23} />
            <strong>Security first.</strong>

            <p>
              Encryption and secure vault access will be
              connected in a later stage.
            </p>
          </div>

          <button
            type="button"
            className="dash-bottom-link"
            onClick={() => {
              setActiveView("Settings");
              setMenuOpen(false);
            }}
          >
            <SettingsIcon size={18} />
            Settings
          </button>

          <button
            type="button"
            className="dash-bottom-link"
            onClick={() => navigate("/login")}
          >
            <LogOut size={18} />
            Back to login
          </button>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {menuOpen && (
        <button
          type="button"
          className="dash-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="dash-content">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              type="button"
              className="dash-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <span className="dash-breadcrumb">
              YOUR VAULT
            </span>

            <span className="dash-breadcrumb-slash">/</span>

            <span className="dash-breadcrumb-current">
              {activeView}
            </span>
          </div>

          <div className="dash-topbar-right">
            <button
              type="button"
              className="dash-icon-button"
              aria-label="Notifications"
              onClick={() =>
                setNotice("No notifications in this demo.")
              }
            >
              <Bell size={19} />
            </button>

            <div className="dash-avatar">K</div>

            <span className="dash-profile-name">
              My Account
            </span>

            <ChevronDown size={15} />
          </div>
        </header>

        <main className="dash-main">
          {activeView === "Password Vault" ? (
            <PasswordVault />
          ) : activeView === "Settings" ? (
            <Settings />
          ) : (
            <>
              {/* PAGE HEADING */}
              <div className="dash-page-heading">
                <div>
                  <p className="dash-eyebrow">
                    YOUR PRIVATE CORNER
                  </p>

                  <h1>
                    {activeView === "Overview"
                      ? "Welcome to your vault."
                      : activeView === "Folders"
                      ? selectedFolder
                      : activeView}
                  </h1>

                  <p className="dash-page-subtitle">
                    A little space for everything that matters.
                  </p>
                </div>

                <button
                  type="button"
                  className="dash-upload-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <UploadCloud size={19} />
                  Upload Files
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={handleUpload}
                />
              </div>

              {/* NOTIFICATION */}
              {notice && (
                <div className="dash-notice" role="status">
                  <Check size={17} />
                  <span>{notice}</span>

                  <button
                    type="button"
                    onClick={() => setNotice("")}
                    aria-label="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* WELCOME BANNER */}
              {activeView === "Overview" && (
                <section className="dash-hero">
                  <div className="dash-hero-content">
                    <div className="dash-hero-overline">
                      <LockKeyhole size={15} />
                      YOUR SPACE, YOUR RULES
                    </div>

                    <h2>
                      Keep what matters.
                      <br />
                      <em>Leave the noise behind.</em>
                    </h2>

                    <p>
                      Organize your important files in one
                      beautiful, private workspace.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      Add your first file
                      <Plus size={18} />
                    </button>
                  </div>

                  <div
                    className="dash-hero-art"
                    aria-hidden="true"
                  >
                    <div className="dash-hero-ring ring-one" />
                    <div className="dash-hero-ring ring-two" />
                    <div className="dash-hero-ring ring-three" />
                    <LockKeyhole
                      size={50}
                      strokeWidth={1}
                    />
                  </div>
                </section>
              )}

              {/* STATISTICS */}
              {activeView === "Overview" && (
                <div className="dash-stats">
                  <div className="dash-stat-card">
                    <div className="dash-stat-top">
                      <span>Total Files</span>
                      <File size={19} />
                    </div>

                    <strong>{files.length}</strong>

                    <p>
                      Including{" "}
                      {
                        sampleFiles.filter((sample) =>
                          files.some(
                            (item) => item.id === sample.id
                          )
                        ).length
                      }{" "}
                      demo files
                    </p>
                  </div>

                  <div className="dash-stat-card">
                    <div className="dash-stat-top">
                      <span>Folders</span>
                      <Folder size={19} />
                    </div>

                    <strong>{folders.length}</strong>

                    <p>Organize your digital world</p>
                  </div>

                  <div className="dash-stat-card">
                    <div className="dash-stat-top">
                      <span>Files in this session</span>
                      <HardDrive size={19} />
                    </div>

                    <strong>{formatSize(totalSize)}</strong>

                    <p>Not persisted or encrypted</p>
                  </div>
                </div>
              )}

              {/* FOLDER CARDS */}
              {activeView !== "Folders" &&
                activeView !== "Recent" && (
                  <section className="dash-section">
                    <div className="dash-section-heading">
                      <div>
                        <p className="dash-eyebrow">
                          STAY ORGANIZED
                        </p>

                        <h2>Your folders</h2>
                      </div>

                      <button
                        type="button"
                        className="dash-text-action"
                        onClick={handleCreateFolder}
                      >
                        <FolderPlus size={17} />
                        New folder
                      </button>
                    </div>

                    <div className="dash-folder-grid">
                      {folders.map((folder, index) => (
                        <button
                          type="button"
                          className="dash-folder-card"
                          key={folder}
                          onClick={() => openFolder(folder)}
                        >
                          <div
                            className={`dash-folder-icon folder-tone-${
                              index % 3
                            }`}
                          >
                            <Folder
                              size={25}
                              strokeWidth={1.6}
                            />
                          </div>

                          <strong>{folder}</strong>

                          <span>
                            {
                              files.filter(
                                (file) =>
                                  file.folder === folder
                              ).length
                            }{" "}
                            files
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

              {/* FILES SECTION */}
              <section className="dash-section dash-files-section">
                <div className="dash-section-heading">
                  <div>
                    <p className="dash-eyebrow">
                      YOUR COLLECTION
                    </p>

                    <h2>
                      {activeView === "Folders"
                        ? `Files in ${selectedFolder}`
                        : activeView === "My Files"
                        ? "All files"
                        : "Recent files"}
                    </h2>
                  </div>

                  <div className="dash-search">
                    <Search size={17} />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search files..."
                      aria-label="Search files"
                    />
                  </div>
                </div>

                <div className="dash-file-table-wrap">
                  <table className="dash-file-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>FOLDER</th>
                        <th>SIZE</th>
                        <th>ADDED</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredFiles.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="dash-file-name">
                              <span className="dash-file-icon">
                                {getFileIcon(item.type)}
                              </span>

                              <span>{item.name}</span>
                            </div>
                          </td>

                          <td>{item.folder}</td>

                          <td>{formatSize(item.size)}</td>

                          <td>{item.date}</td>

                          <td>
                            <div className="dash-file-actions">
                              {/* PREVIEW */}
                              <button
                                type="button"
                                title="Preview"
                                aria-label={`Preview ${item.name}`}
                                onClick={() =>
                                  handlePreview(item)
                                }
                              >
                                <Eye size={17} />
                              </button>

                              {/* DOWNLOAD */}
                              <button
                                type="button"
                                title="Download"
                                aria-label={`Download ${item.name}`}
                                onClick={() =>
                                  handleDownload(item)
                                }
                              >
                                <ArrowDownToLine size={17} />
                              </button>

                              {/* DELETE */}
                              <button
                                type="button"
                                title="Remove"
                                aria-label={`Remove ${item.name}`}
                                onClick={() =>
                                  handleDelete(item.id)
                                }
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredFiles.length === 0 && (
                    <div className="dash-empty">
                      <Folder size={32} />
                      <h3>No files found</h3>

                      <p>
                        Upload a file or try a different
                        search.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* FOOTER */}
              <div className="dash-footer-note">
                <ShieldCheck size={15} />
                Frontend demo — your files are not
                encrypted or permanently stored.
              </div>
            </>
          )}
        </main>
      </div>

      {/* FILE PREVIEW MODAL */}
      <FilePreview
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
