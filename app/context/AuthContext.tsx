"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "buyer" | "seller" | null;

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

// const AuthContext = createContext<AuthContextType>({
//   role: null,
//   setRole: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [role, setRole] = useState<Role>(null);

//   useEffect(() => {
//     const getRoleFromCookie = () => {
//       const cookie = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("token="));

//       if (!cookie) return console.log("no cookie");

//       const token = cookie.split("=")[1];

//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         setRole(payload.role);
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     getRoleFromCookie();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ role, setRole }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   return context;
// }


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
