// TODO: 商品登録画面の作成

import BackButton from "@/components/ui/BackButton";
import CreateProducts from "@/components/products/CreateProducts";

export default async function Page() {
  try {
  } catch (err) {
    console.log(err);
    <h1>エラーが発生しました</h1>;
  }

  return (
    <div>
      <h1 className="text-3xl m-2">商品登録画面</h1>
      <CreateProducts />
      <BackButton href="/products" label="商品一覧へ戻る" />
    </div>
  );
}
