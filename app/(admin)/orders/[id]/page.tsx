import BackButton from "@/components/ui/BackButton";
import DeleteOrder from "@/components/order/DeleteOrder";

interface Params {
  id: string;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  total: number;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  update_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: { name: string; price: number };
  quantity: number;
  price: number;
  created_at: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  let order: Order, orderItem: OrderItem[];

  try {
    const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error("エラーが発生しました");
    }

    const body = await res.json();

    order = body.data.order;
    orderItem = body.data.orderItem;
  } catch (err) {
    console.error(err);
    return <div>エラーが発生しました</div>;
  }

  return (
    <div>
      <h1 className="text-3xl m-2">注文詳細画面</h1>
      <div>
        <h1>注文基本情報</h1>
        <table className="border-collapse border border-grya-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray">注文ID</th>
              <th className="border border-gray">注文番号</th>
              <th className="border border-gray">ステータス</th>
              <th className="border border-gray">合計金額</th>
              <th className="border border-gray">注文日時</th>
            </tr>
          </thead>

          <tbody>
            <tr key={order.id}>
              <td className="border border-gray text-center align-middle">
                {order.id}
              </td>
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
            </tr>
          </tbody>
        </table>

        <h1>注文者情報</h1>
        <table className="border-collapse border border-grya-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray">ユーザーID</th>
              <th className="border border-gray">住所</th>
              <th className="border border-gray">支払方法</th>
            </tr>
          </thead>

          <tbody>
            <tr key={order.user_id}>
              <td className="border border-gray text-center align-middle">
                {order.user_id}
              </td>
              <td className="border border-gray text-center align-middle">
                {order.shipping_address}
              </td>
              <td className="border border-gray text-center align-middle">
                {order.payment_method}
              </td>
            </tr>
          </tbody>
        </table>

        <h1>注文商品</h1>
        <table className="border-collapse border border-grya-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray">商品ID</th>
              <th className="border border-gray">商品名</th>
              <th className="border border-gray">単価</th>
              <th className="border border-gray">注文個数</th>
              <th className="border border-gray">商品別合計</th>
            </tr>
          </thead>

          <tbody>
            {orderItem.map((orderItem) => (
              <tr key={orderItem.id}>
                <td className="border border-gray text-center align-middle">
                  {orderItem.id}
                </td>
                <td className="border border-gray text-center align-middle">
                  {orderItem.product.name}
                </td>
                <td className="border border-gray text-center align-middle">
                  ￥{orderItem.price}
                </td>
                <td className="border border-gray text-center align-middle">
                  {orderItem.quantity}
                </td>
                <td className="border border-gray text-center align-middle">
                  ￥{orderItem.price * orderItem.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteOrder id={id} />
      <BackButton href="/orders" label="戻る" />
    </div>
  );
}
