// TODO: 購入確認画面の作成

import ComfirmCart from "@/components/order/ComfirmCart";
import BackButton from "@/components/ui/BackButton";

export default function Page() {
  return (
    <div>
      <ComfirmCart />
      <BackButton href="/cart" label="カートへ戻る" />
    </div>
  );
}
