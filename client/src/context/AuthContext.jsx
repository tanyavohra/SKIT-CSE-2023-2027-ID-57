// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, if a token exists, try to restore the session.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((data) => {
        // /auth/me doesn't return the profile picture, so keep the cached one.
        let cachedPicture = "";
        try {
          cachedPicture = JSON.parse(localStorage.getItem("user") || "{}").profilePicture || "";
        } catch {
          // ignore a corrupted cache
        }
        setUser({ ...data.user, profilePicture: data.user.profilePicture ?? cachedPicture });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Matches the call in Login.jsx: login(email, password, remember)
  const login = async (email, password, remember = false) => {
    const { token, user: loggedInUser } = await loginUser(email, password);

    if (remember) {
      localStorage.setItem("token", token);
    } else {
      // Still store it so refreshes within the tab work, but you could swap
      // this for sessionStorage if you want it cleared when the tab closes.
      localStorage.setItem("token", token);
    }
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  // Matches the call in Register.jsx: register(fullName, email, password)


const register = async (fullName, email, password, role) => {
  const { token, user: newUser } = await registerUser(
    fullName,
    email,
    password,
    role
  );

  if (token) {
    localStorage.setItem("token", token);
  }

  localStorage.setItem("user", JSON.stringify(newUser));
  setUser(newUser);
  return newUser;
};


  // Merge changes (name, profile picture, ...) into the logged-in user and the
  // cached copy, so the header updates right after a profile edit.
  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors on logout — clear local state regardless
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}