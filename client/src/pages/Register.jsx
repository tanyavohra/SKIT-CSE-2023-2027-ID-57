 // src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); // expects register(fullName, email, password) -> Promise

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#c6c6cd]/40 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo — top left */}
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size={32} />
            <span className="font-bold tracking-tight text-[#0b1c30] text-base">
              Alumni Connect
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#45464d] hidden sm:inline">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-[#0051d5] bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors rounded-xl border border-[#c6c6cd]/30 active:scale-[0.99]"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(#d3e4fe 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative w-full max-w-[460px] bg-white rounded-2xl border border-[#c6c6cd]/50 shadow-sm p-6 sm:p-10">
          {/* Card header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#eff4ff] border border-[#c6c6cd]/30 mb-3 text-[#0051d5]">
              <UserPlus size={20} />
            </div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[#45464d] mt-1">
              Join the alumni network in just a minute.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6]/40 px-3.5 py-2.5 text-sm text-[#93000a]">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-[#0b1c30] mb-1.5" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76777d]">
                  <User size={18} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-[#c6c6cd] rounded-xl text-[#0b1c30] text-sm placeholder:text-[#76777d]/70 outline-none focus:border-[#0051d5] focus:ring-4 focus:ring-[#0051d5]/15 transition-shadow"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#0b1c30] mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76777d]">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-[#c6c6cd] rounded-xl text-[#0b1c30] text-sm placeholder:text-[#76777d]/70 outline-none focus:border-[#0051d5] focus:ring-4 focus:ring-[#0051d5]/15 transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#0b1c30] mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76777d]">
                  <KeyRound size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-10 bg-white border border-[#c6c6cd] rounded-xl text-[#0b1c30] text-sm placeholder:text-[#76777d]/70 outline-none focus:border-[#0051d5] focus:ring-4 focus:ring-[#0051d5]/15 transition-shadow"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#76777d] hover:text-[#0b1c30] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-[#76777d] mt-1.5">Must be at least 8 characters.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 inline-flex items-center justify-center text-sm font-semibold text-white bg-black hover:bg-[#131b2e] transition-all rounded-xl shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c6c6cd]/50" />
            </div>
            <div className="relative flex justify-center text-xs font-semibold">
              <span className="px-3 bg-white text-[#45464d]">Or continue with</span>
            </div>
          </div>

          {/* Google */}
          <GoogleButton
            label="Sign up with Google"
            onClick={handleGoogleSignup}
            loading={googleLoading}
          />
        </div>
      </main>
    </div>
  );
}