import CreateProducts from "@/components/products/CreateProducts";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user || user.role !== "seller") {
    redirect("/products")
  }

  return (
    <div>
      <h1 className="text-3xl m-2">商品登録画面</h1>
      <CreateProducts />
    </div>
  );
}
