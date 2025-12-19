// TODO: 注文一覧画面の作成

import BackButton from "@/components/ui/BackButton";
import { Orders } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  let data;

  try {
    const res = await fetch("http://localhost:3000/api/orders", {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error("エラーが発生しました");
    }

    data = await res.json();
  } catch (err) {
    console.error(err);
    return <div>エラーが発生しました</div>;
  }

  const order: Orders[] = data.data;

  console.log(data);
  return (
    <div>
      <h1 className="text-3xl m-2">注文一覧画面</h1>
      <div>
        <table className="border-collapse border border-grya-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray">注文番号</th>
              <th className="border border-gray">ステータス</th>
              <th className="border border-gray">合計金額</th>
              <th className="border border-gray">注文日時</th>
              <th className="border border-gray">詳細</th>
            </tr>
          </thead>

          <tbody>
            {order.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray text-center align-middle">
                  {order.order_number}
                </td>
                <td className="border border-gray text-center align-middle">
                  {order.status}
                </td>
                <td className="border border-gray text-center align-middle">
                  ￥{order.total}
                </td>
                <td className="border border-gray text-center align-middle">
                  {order.created_at}
                </td>
                <td className="border border-gray text-center align-middle">
                  <Link href={`/orders/${order.id}`}>詳細</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {order.length === 0 && <h1 className="m-3">注文がありません</h1>}
      </div>
      <BackButton href="/products" label="商品一覧へ" />
    </div>
  );
}
