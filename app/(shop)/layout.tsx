import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/app/context/AuthContext";
import Header from "@/components/layouts/Header";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AuthProvider user={user}>
      <Header />
      <main className="p-4">{children}</main>
    </AuthProvider>
  );
}
