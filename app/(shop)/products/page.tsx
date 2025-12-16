// TODO: 商品一覧画面の作成

import { Product } from "@/types/product";
import ProductsList from "@/components/products/ProductsList";

export default async function Products() {
  let data;

  try {
    const res = await fetch("http://localhost:3000/api/products", {
      method: "GET",
      cache: "no-cache",
    });
    data = await res.json();

    if (!res.ok) {
      console.log("error");
      return;
    }
  } catch (err) {
    console.log("error");
    return <div>エラーが発生しました</div>;
  }

  const pro: Product[] = data.data.products;

  console.log(pro);

  return (
    <div>
      <ProductsList initialProducts={pro} />
    </div>
  );
}
