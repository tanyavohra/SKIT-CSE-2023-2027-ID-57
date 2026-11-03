import { Check, Clock, Loader2, UserMinus, UserPlus, X } from "lucide-react";
import { CONNECTION_STATUS } from "../../api/connectionApi";

const primary =
  "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-[#131b2e] transition-colors shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";
const outline =
  "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#c6c6cd] bg-[#eff4ff] text-[#0b1c30] text-sm font-semibold hover:bg-[#e5eeff] transition-colors active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";

function Spinner() {
  return <Loader2 size={18} className="animate-spin" />;
}

export default function ConnectionButton({
  status,
  busy = false,
  onConnect,
  onCancel,
  onAccept,
  onDecline,
  onDisconnect,
}) {
  switch (status) {
    case CONNECTION_STATUS.PENDING_SENT:
      return (
        <div className="w-full space-y-2">
          <button type="button" disabled className={outline}>
            <Clock size={18} />
            Request pending
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="w-full text-center text-xs font-semibold text-[#45464d] hover:text-[#ba1a1a] hover:underline disabled:opacity-60"
          >
            {busy ? "Cancelling…" : "Cancel request"}
          </button>
        </div>
      );

    case CONNECTION_STATUS.PENDING_RECEIVED:
      return (
        <div className="w-full space-y-2">
          <button type="button" onClick={onAccept} disabled={busy} className={primary}>
            {busy ? <Spinner /> : <Check size={18} />}
            Accept request
          </button>
          <button type="button" onClick={onDecline} disabled={busy} className={outline}>
            <X size={18} />
            Decline
          </button>
        </div>
      );

    case CONNECTION_STATUS.CONNECTED:
      return (
        <button type="button" onClick={onDisconnect} disabled={busy} className={outline}>
          {busy ? <Spinner /> : <UserMinus size={18} />}
          Disconnect
        </button>
      );

    case CONNECTION_STATUS.BLOCKED:
      return null;

    default:
      return (
        <button type="button" onClick={onConnect} disabled={busy} className={primary}>
          {busy ? <Spinner /> : <UserPlus size={18} />}
          Connect
        </button>
      );
  }
}
