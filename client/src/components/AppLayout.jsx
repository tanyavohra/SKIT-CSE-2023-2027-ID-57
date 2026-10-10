// src/components/AppLayout.jsx
//
// Shared shell for every page shown after login: sticky header (logo, working
// nav, notifications, profile menu) + footer. Pages render inside <Outlet />.

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Home, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/alumni-connect-logo.png";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Community", icon: Home },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/events", label: "Events & Chapters" },
  { to: "/directory", label: "Directory" },
];

const FOOTER_LINKS = ["Features", "Documentation", "Pricing", "Privacy Policy", "Terms of Service"];

function getInitials(fullName) {
  if (!fullName) return "";
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function navClass({ isActive }) {
  return [
    "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors",
    isActive
      ? "text-[#0051d5] bg-white shadow-sm"
      : "text-[#45464d] hover:text-[#0b1c30] hover:bg-[#e5eeff]",
  ].join(" ");
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
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

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  const initials = getInitials(user?.fullName);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 rounded-lg border border-[#c6c6cd]/40 hover:border-[#c6c6cd] hover:bg-[#eff4ff] transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
      >
        <span className="w-8 h-8 rounded-md bg-[#131b2e] text-white flex items-center justify-center text-xs font-semibold">
          {initials || <User size={16} />}
        </span>
        <ChevronDown
          size={18}
          className={`text-[#45464d] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 bg-white border border-[#c6c6cd]/40 rounded-xl shadow-lg overflow-hidden z-50"
        >
          {(user?.fullName || user?.email) && (
            <div className="px-4 py-3 border-b border-[#c6c6cd]/30">
              {user?.fullName && (
                <p className="text-sm font-semibold text-[#0b1c30] truncate">{user.fullName}</p>
              )}
              {user?.email && <p className="text-xs text-[#45464d] truncate">{user.email}</p>}
            </div>
          )}

          <Link
            to="/profile"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
          >
            <User size={16} />
            My Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors border-t border-[#c6c6cd]/30"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#c6c6cd]/40 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <img src={logo} alt="Alumni Connect" className="h-14 w-14 object-contain" />
            <span className="hidden sm:flex flex-col">
              <span className="font-bold tracking-tight text-[#0b1c30] text-base leading-none">
                Alumni Connect
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#45464d] mt-1">
                Global Network
              </span>
            </span>
          </Link>

          {/* Center navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#c6c6cd]/30">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end className={navClass}>
                {Icon && <Icon size={16} />}
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
            >
              <Bell size={20} />
            </Link>
            <ProfileMenu />
          </div>
        </div>

        {/* Navigation (mobile) */}
        <nav className="md:hidden border-t border-[#c6c6cd]/30 px-4 py-2 flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={navClass}>
              {Icon && <Icon size={16} />}
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#c6c6cd]/40">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2">
            <img src={logo} alt="Alumni Connect" className="h-12 w-12 object-contain" />
            <span className="font-bold tracking-tight text-[#0b1c30] text-base">Alumni Connect</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[13px] text-[#45464d] hover:text-[#0b1c30] transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}