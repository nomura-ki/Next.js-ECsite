// TODO: 商品編集画面の作成
import BackButton from "@/components/ui/BackButton";

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl m-2">商品編集画面</h1>
      <BackButton href="/products" label="商品一覧に戻る" />
    </div>
  );
}
