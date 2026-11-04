import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  requireText,
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const canConfirm = !loading && (!requireText || typed.trim() === requireText);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl border border-[#c6c6cd]/50 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              danger ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-[#eff4ff] text-[#0051d5]"
            }`}
          >
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 id="confirm-title" className="text-lg font-bold tracking-tight text-[#0b1c30]">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#45464d]">{message}</p>
          </div>
        </div>

        {requireText && (
          <div className="mt-4">
            <label htmlFor="confirm-text" className="mb-1.5 block text-xs font-semibold text-[#45464d]">
              Type <span className="font-bold text-[#0b1c30]">{requireText}</span> to continue
            </label>
            <input
              id="confirm-text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-[#c6c6cd] bg-white px-3.5 text-sm text-[#0b1c30] outline-none focus:border-[#0051d5] focus:ring-4 focus:ring-[#0051d5]/15"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#c6c6cd] bg-white px-4 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#eff4ff] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              danger ? "bg-[#ba1a1a] hover:bg-[#93000a]" : "bg-black hover:bg-[#131b2e]"
            }`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
