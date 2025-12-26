import CreateProducts from "@/components/products/CreateProducts";

export default async function Page() {
  try {
  } catch (err) {
    console.error(err);
    <h1>エラーが発生しました</h1>;
  }

  return (
    <div>
      <h1 className="text-3xl m-2">商品登録画面</h1>
      <CreateProducts />
    </div>
  );
}
