
import { useEffect, useState } from "react";
import { X, FileQuestion } from "lucide-react";
import "./FilePreview.css";

type FilePreviewProps = {
  file: File | null;
  onClose: () => void;
};

export default function FilePreview({
  file,
  onClose,
}: FilePreviewProps) {
  const [url, setUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return;

    let cancelled = false;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    setTextContent("");
    setError("");

    if (
      file.type.startsWith("text/") ||
      /\.(txt|md|csv|json)$/i.test(file.name)
    ) {
      file.text()
        .then((text) => {
          if (!cancelled) setTextContent(text);
        })
        .catch(() => {
          if (!cancelled) setError("Unable to read this file.");
        });
    }

    return () => {
      cancelled = true;
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    if (!file) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [file, onClose]);

  if (!file) return null;

  const isImage = file.type.startsWith("image/");
  const isPdf =
    file.type === "application/pdf" ||
    /\.pdf$/i.test(file.name);
  const isText =
    file.type.startsWith("text/") ||
    /\.(txt|md|csv|json)$/i.test(file.name);

  return (
    <div className="fp-overlay" onClick={onClose}>
      <section
        className="fp-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Preview ${file.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="fp-header">
          <div>
            <p>FILE PREVIEW</p>
            <h2>{file.name}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
        </header>

        <div className="fp-content">
          {error ? (
            <p>{error}</p>
          ) : isImage ? (
            <img src={url} alt={file.name} />
          ) : isPdf ? (
            <iframe
              src={url}
              title={`Preview of ${file.name}`}
            />
          ) : isText ? (
            <pre>{textContent}</pre>
          ) : (
            <div className="fp-unsupported">
              <FileQuestion size={44} />
              <h3>Preview unavailable</h3>
              <p>
                This file type cannot be previewed here.
                You can download it instead.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
