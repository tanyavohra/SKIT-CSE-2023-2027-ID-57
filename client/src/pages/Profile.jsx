// src/pages/Profile.jsx
//
// Serves both routes:
//   /profile      -> your own profile (edit, change picture, delete account)
//   /profile/:id  -> someone else's profile (connect, message, block)
//
// The header/footer come from AppLayout, so this file is page content only.

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Ban, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  deleteMyAccount,
  getMyProfile,
  getProfileById,
  updateMyProfile,
  uploadProfilePicture,
} from "../api/profileApi";
import {
  CONNECTION_STATUS,
  acceptConnectionRequest,
  blockUser,
  cancelConnectionRequest,
  declineConnectionRequest,
  disconnectFrom,
  getConnectionStatus,
  getConnectionsCount,
  sendConnectionRequest,
  unblockUser,
} from "../api/connectionApi";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSections from "../components/profile/ProfileSections";
import EditProfileModal from "../components/profile/EditProfileModal";
import ConfirmDialog from "../components/profile/ConfirmDialog";

const MAX_PICTURE_BYTES = 5 * 1024 * 1024;
const META_KEYS = ["_id", "__v", "userId", "createdAt", "updatedAt"];

const errMsg = (err, fallback) => {
  const message = err?.response?.data?.message;
  return typeof message === "string" && message ? message : fallback;
};

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading profile">
      <div className="h-64 rounded-xl border border-[#c6c6cd]/40 bg-white" />
      <div className="h-32 rounded-xl border border-[#c6c6cd]/40 bg-white" />
      <div className="h-40 rounded-xl border border-[#c6c6cd]/40 bg-white" />
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, updateUser, logout } = useAuth();

  const authId = authUser?.id;
  const isOwn = !id || id === authId;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.NONE);
  const [connectionsCount, setConnectionsCount] = useState(0);

  const [actionBusy, setActionBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [confirm, setConfirm] = useState(null); // "delete" | "block" | "disconnect" | null
  const [toast, setToast] = useState(null); // { message, type }

  const toastTimer = useRef(null);
  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ------------------------------ Load data ------------------------------ */

  useEffect(() => {
    if (!authId) return undefined;
    let cancelled = false;

    setLoading(true);
    setLoadError("");
    setEditOpen(false);
    setConfirm(null);
    setConnectionStatus(CONNECTION_STATUS.NONE);

    async function load() {
      try {
        if (isOwn) {
          const [myProfile, count] = await Promise.all([
            getMyProfile(),
            getConnectionsCount(authId).catch(() => 0),
          ]);
          if (cancelled) return;
          setOtherUser(null);
          setProfile(myProfile);
          setConnectionsCount(count);
          // Keep the header avatar in sync with the saved picture.
          updateUser({ profilePicture: myProfile.profilePicture || "" });
        } else {
          const [data, status, count] = await Promise.all([
            getProfileById(id),
            getConnectionStatus(id).catch(() => CONNECTION_STATUS.NONE),
            getConnectionsCount(id).catch(() => 0),
          ]);
          if (cancelled) return;
          setOtherUser(data.user);
          setProfile(data.profile || {});
          setConnectionStatus(status);
          setConnectionsCount(count);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err?.response?.status === 404
              ? "This profile doesn't exist or is no longer available."
              : errMsg(err, "We couldn't load this profile. Please try again.")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // updateUser is intentionally left out: it changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isOwn, authId]);

  const shownUser = isOwn
    ? { id: authId, fullName: authUser?.fullName, role: authUser?.role }
    : otherUser;
  const role = shownUser?.role || "student";
  const displayName = shownUser?.fullName || "this user";

  /* ----------------------------- Own profile ----------------------------- */

  const handleSave = async (payload) => {
    setSaving(true);
    setSaveError("");
    try {
      // Re-send values this form doesn't edit so a partial backend update can't wipe them.
      const saved = await updateMyProfile({
        ...payload,
        profilePicture: profile.profilePicture || "",
        phone: profile.phone,
      });
      setProfile(saved);
      updateUser({ fullName: payload.fullName, profilePicture: saved.profilePicture || "" });
      setEditOpen(false);
      showToast("Profile updated");
    } catch (err) {
      setSaveError(errMsg(err, "Could not save your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handlePictureSelected = async (file) => {
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      showToast("Please choose a PNG, JPG or WebP image.", "error");
      return;
    }
    if (file.size > MAX_PICTURE_BYTES) {
      showToast("Image must be 5 MB or smaller.", "error");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadProfilePicture(file);
      setProfile((prev) => ({ ...prev, profilePicture: url }));
      updateUser({ profilePicture: url });
      showToast("Profile picture updated");
    } catch (err) {
      showToast(errMsg(err, "Could not upload the picture. Please try again."), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setActionBusy(true);
    try {
      await deleteMyAccount();
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setActionBusy(false);
      setConfirm(null);
      showToast(errMsg(err, "Could not delete your account. Please try again."), "error");
    }
  };

  /* --------------------------- Other people's pages --------------------------- */

  const runAction = async (fn, onSuccess, failMessage) => {
    if (!id || actionBusy) return;
    setActionBusy(true);
    try {
      await fn(id);
      onSuccess?.();
    } catch (err) {
      showToast(errMsg(err, failMessage), "error");
    } finally {
      setActionBusy(false);
    }
  };

  const handleConnect = () =>
    runAction(
      sendConnectionRequest,
      () => {
        setConnectionStatus(CONNECTION_STATUS.PENDING_SENT);
        showToast("Connection request sent");
      },
      "Could not send the request. Please try again."
    );

  const handleCancelRequest = () =>
    runAction(
      cancelConnectionRequest,
      () => {
        setConnectionStatus(CONNECTION_STATUS.NONE);
        showToast("Request cancelled");
      },
      "Could not cancel the request."
    );

  const handleAccept = () =>
    runAction(
      acceptConnectionRequest,
      () => {
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        setConnectionsCount((c) => c + 1);
        showToast(`You're now connected with ${displayName}`);
      },
      "Could not accept the request."
    );

  const handleDecline = () =>
    runAction(
      declineConnectionRequest,
      () => {
        setConnectionStatus(CONNECTION_STATUS.NONE);
        showToast("Request declined");
      },
      "Could not decline the request."
    );

  const handleUnblock = () =>
    runAction(
      unblockUser,
      () => {
        setConnectionStatus(CONNECTION_STATUS.NONE);
        showToast(`${displayName} was unblocked`);
      },
      "Could not unblock this user."
    );

  const handleConfirm = async () => {
    if (confirm === "delete") {
      await handleDeleteAccount();
      return;
    }
    if (confirm === "block") {
      await runAction(
        blockUser,
        () => {
          setConnectionStatus(CONNECTION_STATUS.BLOCKED);
          showToast(`${displayName} was blocked`);
        },
        "Could not block this user."
      );
    } else if (confirm === "disconnect") {
      await runAction(
        disconnectFrom,
        () => {
          setConnectionStatus(CONNECTION_STATUS.NONE);
          setConnectionsCount((c) => Math.max(0, c - 1));
          showToast(`Disconnected from ${displayName}`);
        },
        "Could not disconnect. Please try again."
      );
    }
    setConfirm(null);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${shownUser?.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Profile link copied");
    } catch {
      window.prompt("Copy this profile link:", url);
    }
  };

  const confirmConfig = {
    delete: {
      title: "Delete your account?",
      message:
        "This permanently deletes your account, profile and connections. This can't be undone.",
      confirmLabel: "Delete account",
      requireText: "DELETE",
    },
    block: {
      title: `Block ${displayName}?`,
      message:
        "They won't be able to connect with you or message you, and any connection between you will be removed. You can unblock them later.",
      confirmLabel: "Block user",
    },
    disconnect: {
      title: `Disconnect from ${displayName}?`,
      message: "You'll no longer be connected. You can send a new connection request later.",
      confirmLabel: "Disconnect",
    },
  }[confirm];

  /* -------------------------------- Render -------------------------------- */

  const isBlocked = connectionStatus === CONNECTION_STATUS.BLOCKED;
  const profileIsEmpty = Object.keys(profile || {}).every((k) => META_KEYS.includes(k));

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-6 px-4 py-8 md:px-6 md:py-10">
      {loading ? (
        <ProfileSkeleton />
      ) : loadError ? (
        <div className="mx-auto max-w-xl rounded-xl border border-[#c6c6cd]/40 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[#c6c6cd]/20 bg-[#ffdad6] text-[#ba1a1a]">
            <AlertCircle size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">Profile unavailable</h1>
          <p className="mt-2 text-sm text-[#45464d]">{loadError}</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#c6c6cd]/30 bg-[#eff4ff] px-4 py-2 text-sm font-semibold text-[#0051d5] transition-colors hover:bg-[#e5eeff]"
          >
            <ArrowLeft size={16} />
            Back to Community
          </Link>
        </div>
      ) : (
        <>
          <ProfileHeader
            user={shownUser}
            profile={profile}
            isOwn={isOwn}
            connectionStatus={connectionStatus}
            connectionsCount={connectionsCount}
            actionBusy={actionBusy}
            uploading={uploading}
            onEdit={() => {
              setSaveError("");
              setEditOpen(true);
            }}
            onShare={handleShare}
            onPictureSelected={handlePictureSelected}
            onConnect={handleConnect}
            onCancelRequest={handleCancelRequest}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onDisconnect={() => setConfirm("disconnect")}
            onMessage={() => navigate(`/messages/${shownUser.id}`)}
            onDeleteAccount={() => setConfirm("delete")}
            onBlock={() => setConfirm("block")}
            onUnblock={handleUnblock}
          />

          {isBlocked ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#c6c6cd]/50 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffdad6] text-[#ba1a1a]">
                  <Ban size={20} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0b1c30]">You blocked {displayName}</h2>
                  <p className="mt-0.5 text-sm text-[#45464d]">
                    They can't connect with you or message you. Unblock them to see their profile again.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUnblock}
                disabled={actionBusy}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[#c6c6cd] bg-[#eff4ff] px-4 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#e5eeff] disabled:opacity-60"
              >
                Unblock
              </button>
            </div>
          ) : (
            <>
              {isOwn && profileIsEmpty && (
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#0051d5]/20 bg-[#eff4ff] p-6 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0051d5] text-white">
                      <Sparkles size={20} />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#0b1c30]">Complete your profile</h2>
                      <p className="mt-0.5 text-sm text-[#45464d]">
                        Add your details so the right people can find and connect with you.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-[#131b2e]"
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              <ProfileSections
                role={role}
                profile={profile}
                isOwn={isOwn}
                onEdit={() => {
                  setSaveError("");
                  setEditOpen(true);
                }}
              />
            </>
          )}
        </>
      )}

      {isOwn && (
        <EditProfileModal
          open={editOpen}
          role={role}
          user={shownUser}
          profile={profile}
          saving={saving}
          error={saveError}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirmConfig?.title}
        message={confirmConfig?.message}
        confirmLabel={confirmConfig?.confirmLabel}
        requireText={confirmConfig?.requireText}
        danger
        loading={actionBusy}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-[80] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "error" ? "bg-[#ba1a1a]" : "bg-[#131b2e]"
          }`}
        >
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
