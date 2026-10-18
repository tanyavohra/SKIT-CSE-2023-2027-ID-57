import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Everything below needs a logged-in user and shares the header/footer */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentorship" element={<ComingSoon title="Mentorship" />} />
            <Route path="/events" element={<ComingSoon title="Events & Chapters" />} />
            <Route path="/directory" element={<ComingSoon title="Directory" />} />
            <Route path="/alma-mater" element={<ComingSoon title="Alma Mater" />} />
            <Route path="/profile" element={<ComingSoon title="My Profile" />} />
            <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}