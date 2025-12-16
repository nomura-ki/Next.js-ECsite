// TODO: カート画面の作成
import BackButton from "@/components/ui/BackButton";
import { cookies } from "next/headers";
import CheckCart from "@/components/order/CheckCart";
import { CartItemWithProduct } from "@/lib/utils";

export default async function Page() {
  let data;
  try {
    const cookieStore = await cookies();
    const res = await fetch("http://localhost:3000/api/cart", {
      method: "GET",
      headers: { cookie: cookieStore.toString() },
      cache: "no-cache",
    });

    if (!res.ok) {
      console.log("cart res error");
      return;
    }

    data = await res.json();
  } catch (err) {
    console.log("cart catch error");
    return <div>エラーが発生しました</div>;
  }

  const pro: CartItemWithProduct[] = data.data.cartItems;
  // console.log(pro);

  return (
    <div>
      <CheckCart initialCartProducts={pro} />
      <BackButton href="/products" label="戻る" />
    </div>
  );
}
