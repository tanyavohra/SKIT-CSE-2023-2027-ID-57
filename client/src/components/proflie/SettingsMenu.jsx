import { useEffect, useRef, useState } from "react";
import { Ban, ShieldCheck, Settings, Trash2 } from "lucide-react";

export default function SettingsMenu({ isOwn, isBlocked, onDeleteAccount, onBlock, onUnblock }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const choose = (fn) => () => {
    setOpen(false);
    fn?.();
  };

  const itemClass =
    "w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-left transition-colors";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Profile settings"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Settings"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-full items-center justify-center rounded-xl border border-[#c6c6cd] bg-[#eff4ff] px-2.5 py-2 text-[#0b1c30] transition-colors hover:bg-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
      >
        <Settings size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-[#c6c6cd]/40 bg-white shadow-lg"
        >
          {isOwn ? (
            <button
              type="button"
              role="menuitem"
              onClick={choose(onDeleteAccount)}
              className={`${itemClass} text-[#ba1a1a] hover:bg-[#ffdad6]/50`}
            >
              <Trash2 size={16} />
              Delete account
            </button>
          ) : isBlocked ? (
            <button
              type="button"
              role="menuitem"
              onClick={choose(onUnblock)}
              className={`${itemClass} text-[#0b1c30] hover:bg-[#eff4ff]`}
            >
              <ShieldCheck size={16} />
              Unblock user
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={choose(onBlock)}
              className={`${itemClass} text-[#ba1a1a] hover:bg-[#ffdad6]/50`}
            >
              <Ban size={16} />
              Block user
            </button>
          )}
        </div>
      )}
    </div>
  );
}
