"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "buyer" | "seller" | null;

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const getRoleFromCookie = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (!cookie) return;

      const token = cookie.split("=")[1];

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (e) {
        console.error(e);
      }
    };

    getRoleFromCookie();
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
