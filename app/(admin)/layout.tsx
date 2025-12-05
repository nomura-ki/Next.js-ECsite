"use client";

import Header from "@/components/layouts/Header";
import { AuthProvider } from "@/app/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <div className="p-4">{children}</div>
    </AuthProvider>
  );
}
