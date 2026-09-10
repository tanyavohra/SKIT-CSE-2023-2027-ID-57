 // src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <header className="w-full bg-white border-b border-[#c6c6cd]/40">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <Logo size={32} />
            <span className="font-bold tracking-tight text-[#0b1c30] text-base">
              Alumni Connect
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-[#0b1c30] bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors rounded-xl border border-[#c6c6cd]/30"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0b1c30]">
          Welcome{user?.fullName ? `, ${user.fullName}` : ""} 👋
        </h1>
        <p className="text-sm text-[#45464d] mt-2">
          This is a placeholder dashboard — build out the real content here.
        </p>
      </main>
    </div>
  );
}