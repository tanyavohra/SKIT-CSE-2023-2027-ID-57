import { Link } from "react-router-dom";
import logo from "../assets/alumni-connect-logo.png";

// mode: "login" | "register" - flips which CTA shows on the right.
export default function AuthHeader({ mode }) {
  const isLogin = mode === "login";

  return (
    <header className="w-full border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Alumni-Connect" className="h-10 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-neutral sm:inline">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <Link
            to={isLogin ? "/register" : "/login"}
            className="inline-flex items-center justify-center rounded-lg border border-line/60 bg-accentSoft px-4 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accentSoft/70"
          >
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </div>
      </div>
    </header>
  );
}