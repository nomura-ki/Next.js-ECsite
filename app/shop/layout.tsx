"use client";

import Header from "@/components/layouts/Header";
import { AuthProvider } from "@/app/context/AuthContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <main className="p-4">{children}</main>
    </AuthProvider>
  );
}
