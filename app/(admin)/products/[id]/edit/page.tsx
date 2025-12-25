import BackButton from "@/components/ui/BackButton";
import ProductDeleteButton from "@/components/products/ProductDeleteButton";
import EditProducts from "@/components/products/EditProducts";

interface Params {
  id: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-3xl m-2">商品編集画面</h1>
      <EditProducts id={id} />
      <ProductDeleteButton id={id} />
      <BackButton href="/products" label="商品一覧に戻る" />
    </div>
  );
}
