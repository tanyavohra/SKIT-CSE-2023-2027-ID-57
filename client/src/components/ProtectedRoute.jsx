// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Still checking localStorage/token validity — avoid flashing a redirect.
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <span className="text-sm text-[#45464d]">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}