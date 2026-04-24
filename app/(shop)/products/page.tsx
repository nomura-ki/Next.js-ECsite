import { Product } from "@/types/product";
import ProductsList from "@/components/products/ProductsList";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Products() {
  let data;

  try {
    const res = await fetch("http://localhost:3000/api/products", {
      method: "GET",
      cache: "no-cache",
    });
    data = await res.json();

    if (!res.ok) {
      console.error("error");
      return;
    }
  } catch (err) {
    console.error(err);
    return <div>エラーが発生しました</div>;
  }

  const pro: Product[] = data.data.products;


  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <ProductsList 
        initialProducts={pro}
        role={user?.role}
      />
    </div>
  );
}
