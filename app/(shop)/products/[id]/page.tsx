// TODO: 商品詳細画面の作成
import ProductImages from "@/components/products/ProductImages";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BackButton from "@/components/ui/BackButton";

interface Params {
  id: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  let productInfo;
  const images: string[] = [];

  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "GET",
      cache: "no-cache",
    });

    const body = await res.json();

    productInfo = body.data.products[0];

    for (let i = 0; body.data.products.length > i; i++) {
      images.push(body.data.products[i].image_url);
    }

    if (!res.ok) {
      console.log("error");
      return;
    }
  } catch (err) {
    console.error(err);
    return <div>エラーが発生しました</div>;
  }

  return (
    <div>
      <ProductImages imageUrls={images} />
      <div>{productInfo.product.name}</div>
      <div>￥{productInfo.product.price}</div>
      <div>商品説明：{productInfo.product.description}</div>
      <AddToCartButton
        productId={productInfo.product_id}
        stock={productInfo.product.stock}
      />
      <BackButton href="/products" label="戻る" />
    </div>
  );
}
