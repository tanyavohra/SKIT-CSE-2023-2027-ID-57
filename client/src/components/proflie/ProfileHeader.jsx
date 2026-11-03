import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Camera,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquare,
  Pencil,
  Share2,
  Users,
} from "lucide-react";
import ConnectionButton from "./ConnectionButton";
import SettingsMenu from "./SettingsMenu";
import { CONNECTION_STATUS } from "../../api/connectionApi";
import { getHeadline, getInitials, resolveImageUrl } from "../../utils/profileFields";

export default function ProfileHeader({
  user,
  profile,
  isOwn,
  connectionStatus,
  connectionsCount,
  actionBusy,
  uploading,
  onEdit,
  onShare,
  onPictureSelected,
  onConnect,
  onCancelRequest,
  onAccept,
  onDecline,
  onDisconnect,
  onMessage,
  onDeleteAccount,
  onBlock,
  onUnblock,
}) {
  const fileInputRef = useRef(null);
  const [imgFailed, setImgFailed] = useState(false);

  const role = user?.role || "student";
  const isAlumni = role === "alumni";
  const isBlocked = connectionStatus === CONNECTION_STATUS.BLOCKED;
  const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;

  const pictureSrc = resolveImageUrl(profile?.profilePicture);
  const showImage = pictureSrc && !imgFailed;
  const headline = getHeadline(role, profile);

  useEffect(() => {
    setImgFailed(false);
  }, [pictureSrc]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (file) onPictureSelected?.(file);
  };

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#c6c6cd]/50 bg-white p-6 shadow-sm sm:p-8">
      {/* Top accent bar */}
      <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-[#0051d5] via-[#316bf3] to-[#dbe1ff]" />

      <div className="mt-2 flex flex-col-reverse items-start justify-between gap-8 lg:flex-row">
        {/* ---------------- Left: identity ---------------- */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b4c5ff] bg-[#dbe1ff] px-3 py-1 text-xs font-semibold text-[#00174b]">
              <GraduationCap size={14} />
              {isAlumni ? "Alumni" : "Student"}
              {profile?.graduationYear ? ` · Class of ${profile.graduationYear}` : ""}
            </span>
            {isAlumni && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#c6c6cd] bg-[#dce9ff] px-2.5 py-0.5 text-[11px] font-medium text-[#0b1c30]">
                <BadgeCheck size={13} className="text-[#0051d5]" />
                Verified Alumni Degree
              </span>
            )}
          </div>

          {/* Name + headline */}
          <div>
            <h1 className="break-words text-3xl font-bold tracking-tight text-[#0b1c30] md:text-[40px] md:leading-[48px]">
              {user?.fullName || "Unnamed user"}
            </h1>
            {headline && <p className="mt-1 text-lg font-medium text-[#0051d5]">{headline}</p>}
          </div>

          {/* Location + college */}
          {(profile?.location || profile?.college) && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#45464d]">
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={16} className="text-[#0051d5]" />
                  {profile.location}
                </span>
              )}
              {profile?.college && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={16} className="text-[#0051d5]" />
                  {profile.college}
                </span>
              )}
            </div>
          )}

          {/* Connections */}
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#c6c6cd] bg-[#eff4ff] px-3.5 py-2 text-sm">
            <Users size={16} className="text-[#0051d5]" />
            <span className="font-bold text-[#0051d5]">
              {connectionsCount ?? 0} {connectionsCount === 1 ? "Connection" : "Connections"}
            </span>
          </div>
        </div>

        {/* ---------------- Right: picture + actions ---------------- */}
        <div className="flex w-full shrink-0 flex-col items-center space-y-4 lg:w-auto lg:items-end">
          {/* Avatar */}
          <div className="relative">
            <div className="rounded-full bg-gradient-to-tr from-[#0051d5] via-[#316bf3] to-[#dbe1ff] p-1 shadow-md">
              {showImage ? (
                <img
                  src={pictureSrc}
                  alt={`${user?.fullName || "User"} profile`}
                  onError={() => setImgFailed(true)}
                  className="h-36 w-36 rounded-full object-cover ring-4 ring-white md:h-44 md:w-44"
                />
              ) : (
                <div
                  aria-label={`${user?.fullName || "User"} profile`}
                  className="flex h-36 w-36 items-center justify-center rounded-full bg-[#131b2e] text-4xl font-bold text-white ring-4 ring-white md:h-44 md:w-44 md:text-5xl"
                >
                  {getInitials(user?.fullName) || "?"}
                </div>
              )}
            </div>

            {isOwn && (
              <>
                <button
                  type="button"
                  aria-label="Change profile picture"
                  title="Change profile picture"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#0051d5] text-white shadow-md transition-colors hover:bg-[#316bf3] disabled:opacity-70"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex w-full max-w-xs flex-col gap-2.5 lg:w-48">
            {isOwn ? (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#131b2e] active:scale-[0.99]"
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            ) : (
              <ConnectionButton
                status={connectionStatus}
                busy={actionBusy}
                onConnect={onConnect}
                onCancel={onCancelRequest}
                onAccept={onAccept}
                onDecline={onDecline}
                onDisconnect={onDisconnect}
              />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onShare}
                title="Copy profile link"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#c6c6cd] bg-[#eff4ff] px-3 py-2 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#e5eeff]"
              >
                <Share2 size={18} />
                Share
              </button>
              <SettingsMenu
                isOwn={isOwn}
                isBlocked={isBlocked}
                onDeleteAccount={onDeleteAccount}
                onBlock={onBlock}
                onUnblock={onUnblock}
              />
            </div>

            {!isOwn && isConnected && (
              <button
                type="button"
                onClick={onMessage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0051d5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#316bf3] active:scale-[0.99]"
              >
                <MessageSquare size={18} />
                Message
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
