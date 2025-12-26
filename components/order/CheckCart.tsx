"use client";

import { useState, useEffect } from "react";
import { CartItemWithProduct } from "@/lib/utils";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

export default function CheckCart({
  initialCartProducts,
}: {
  initialCartProducts: CartItemWithProduct[];
}) {
  const [products, setProducts] = useState(initialCartProducts);
  const [message, setMessage] = useState("");
  const [isStock, setIsStock] = useState<boolean>(true);
  const router = useRouter();

  let total = 0;
  let ProTotal = 0;

  for (let i = 0; products.length > i; i++) {
    total = total + products[i].subtotal;
  }

  for (let i = 0; products.length > i; i++) {
    ProTotal = ProTotal + products[i].quantity;
  }

  const handleDeleteItem = async (productId: string) => {
    setMessage("");
    try {
      const DelRes = await fetch("/api/cart", {
        method: "DELETE",
        body: JSON.stringify({ productId }),
      });

      if (!DelRes) {
        setMessage("DeleteResponse error");
        return;
      }
      const DelData = await DelRes.json();

      const GetRes = await fetch("/api/cart", {
        method: "GET",
        headers: { cookie: cookieStore.toString() },
      });

      if (!GetRes) {
        setMessage("GetResponse error");
        return;
      }
      const GetData = await GetRes.json();

      const NewData: CartItemWithProduct[] = GetData.data.cartItems;
      setProducts(NewData);

      setMessage(
        DelData.success && GetData.success
          ? "カートから削除しました"
          : DelData.message ||
              GetData.message ||
              "カートからの削除に失敗しました"
      );
    } catch (err) {
      console.error("delete error:", err);
      setMessage("削除中にエラーが発生しました");
    }
  };

  const handleUpdateCart = async (productId: string, quantity: number) => {
    setMessage("");

    try {
      const UpdateRes = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!UpdateRes) {
        setMessage("UpdateRes error");
        return;
      }
      const UpdateData = await UpdateRes.json();

      const GetRes = await fetch("/api/cart", {
        method: "GET",
        headers: { cookie: cookieStore.toString() },
      });

      if (!GetRes) {
        setMessage("GetResponse error");
        return;
      }
      const GetData = await GetRes.json();

      const NewData: CartItemWithProduct[] = GetData.data.cartItems;
      setProducts(NewData);

      setMessage(
        UpdateData.success
          ? "個数を変更しました"
          : UpdateData.message || "個数の変更に失敗しました"
      );
    } catch (err) {
      console.error("update error", err);
      setMessage("更新中にエラーが発生しました");
    }
  };

  useEffect(() => {
    products.map((p) => {
      if (p.product.stock < p.quantity) {
        setIsStock(false);
      } else {
        setIsStock(true);
      }
    });
  }, [products]);

  return (
    <div>
      <table className="border-collapse border border-grya-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray">商品名</th>
            <th className="border border-gray">価格</th>
            <th className="border border-gray">個数</th>
            <th className="border border-gray">小計</th>
            <th className="border border-gray">削除</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border border-gray text-center align-middle">
                {p.product.name}
              </td>
              <td className="border border-gray text-center align-middle">
                ￥{p.product.price}
              </td>
              <td className="border border-gray text-center align-middle">
                <input
                  type="number"
                  min={1}
                  max={p.product.stock}
                  value={p.quantity}
                  onChange={(e) =>
                    handleUpdateCart(p.product.id, Number(e.target.value))
                  }
                />
              </td>
              <td className="border border-gray text-center align-middle">
                ￥{p.subtotal}
              </td>
              <td className="border border-gray text-center align-middle">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(p.product.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <th className="text-center align-middle">合計</th>
            <td className="border border-gray text-center align-middle">-</td>
            <td className="border border-gray text-center align-middle">
              {ProTotal}
            </td>
            <td className="border border-gray text-center align-middle">
              ￥{total}
            </td>
            <td className="border border-gray text-center align-middle">-</td>
          </tr>
        </tbody>
      </table>

      {products.length === 0 && <h1 className="m-3">カートが空です</h1>}

      {products.map(
        (p) =>
          p.product.stock < p.quantity && (
            <div key={p.id} className="text-red-600">
              {p.product.name}の在庫が足りません
              {isStock}
            </div>
          )
      )}

      {message && (
        <p
          className={`${
            message.includes("失敗") || message.includes("エラー")
              ? "text-red-600"
              : "text-green-600"
          } mt-2`}
        >
          {message}
        </p>
      )}

      {products.length > 0 && isStock === true && (
        <button
          type="button"
          onClick={() => router.push("/orders/comfirm")}
          className="m-3 mb-4 px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
        >
          {" "}
          購入手続きへ
        </button>
      )}
      <BackButton href="/products" label="買い物を続ける" />
    </div>
  );
}
