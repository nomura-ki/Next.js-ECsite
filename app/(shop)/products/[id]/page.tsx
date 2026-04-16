import ProductImages from "@/components/products/ProductImages";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BackButton from "@/components/ui/BackButton";
import { cookies } from "next/headers";

interface Params {
  id: string;
}

type CartItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
  quantity: number;
  subtotal: number;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  let productInfo;
  let cartInfo;
  let cartQuantity;
  const images: string[] = [];

  try {
    const productsRes = await fetch(
      `http://localhost:3000/api/products/${id}`,
      {
        method: "GET",

        cache: "no-cache",
      }
    );

    if (!productsRes.ok) {
      console.error("internal error");
      return;
    }

    const productsBody = await productsRes.json();

    productInfo = productsBody.data.products[0];

    for (let i = 0; productsBody.data.products.length > i; i++) {
      images.push(productsBody.data.products[i].image_url);
    }

    const cookieStore = await cookies();

    const cartRes = await fetch("http://localhost:3000/api/cart", {
      method: "GET",
      headers: { cookie: cookieStore.toString() },
      cache: "no-cache",
    });

    if (!cartRes.ok) {
      console.error("internal error (cartRes)");
      return;
    }

    const cartBody = await cartRes.json();

    cartInfo = cartBody.data.cartItems.find(
      (cartItem: CartItem) => cartItem.product.id === id
    );

    if (cartInfo) {
      cartQuantity = cartInfo.quantity;
    } else {
      cartQuantity = 0;
    }
  } catch (err) {
    console.error(err);
    return <div>エラーが発生しました</div>;
  }

  return (
    <>
      <ProductImages imageUrls={images} />
      <div className="pt-3 grid grid-cols-[100px_1fr] gap-y-2 gap-x-2 items-center">
        <div>商品名</div>
        <div>{productInfo.product.name}</div>
        <div>価格</div>
        <div>￥{productInfo.product.price}</div>
        <div>商品説明</div>
        <div>{productInfo.product.description}</div>
        <div className="col-span-2 justify-self-start">
          <AddToCartButton
            productId={productInfo.product_id}
            stock={productInfo.product.stock}
            cartQuantity={cartQuantity}
          />
        </div>
      </div>
    </>
  );
}
