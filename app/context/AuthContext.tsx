"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "buyer" | "seller" | null;

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

export type User = {
  userId: string | null
  role: "buyer" | "seller" | null;
}

const AuthContext = createContext<User>({
  userId: null,
  role: null
});

export const AuthProvider = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
