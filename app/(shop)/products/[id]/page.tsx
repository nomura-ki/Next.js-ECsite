// TODO: 商品詳細画面の作成
import ProductImages from "@/components/products/ProductImages";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BackButton from "@/components/ui/BackButton";

interface Params {
  id: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  let arr;
  let image: string[];

  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "GET",
      cache: "no-cache",
    });

    const body = await res.json();

    arr = body.data.products[0];

    image = [arr.image_url];

    console.log(arr);
    if (!res.ok) {
      console.log("error");
      return;
    }
  } catch (err) {
    console.log("error");
    return <div>エラーが発生しました</div>;
  }
  console.log(image);

  return (
    <div>
      <ProductImages imageUrls={image} />
      <div>{arr.name}</div>
      <div>￥{arr.price}</div>
      <div>商品説明：{arr.description}</div>
      <AddToCartButton productId={arr.product_id} stock={arr.stock} />
      <BackButton href="/products" label="戻る" />
    </div>
  );
}
