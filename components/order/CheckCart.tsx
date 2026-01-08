"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import Image from "next/image";

type CartItem = {
  quantity: number;
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
  updated_at: Date;
};

interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
  subtotal: number;
}

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
      <div className="flex">
        <table>
          {products.map((p, index) => (
            <div key={p.id} className="flex">
              <div className="m-5">
                <Image
                  src={p.product.imageUrl}
                  alt={`商品画像${index}`}
                  width={100}
                  height={100}
                />
              </div>
              <div className="m-5">
                <tr>
                  <th>商品名：</th>
                  <td className="text-center align-middle">{p.product.name}</td>
                </tr>
                <tr>
                  <th>価格：</th>
                  <td className="text-center align-middle">
                    ￥{p.product.price}
                  </td>
                </tr>
                <tr>
                  <th>個数：</th>
                  <td className="text-center align-middle">
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
                </tr>
                <tr>
                  <th>小計：</th>
                  <td className="text-center align-middle">￥{p.subtotal}</td>
                </tr>
                <tr>
                  <th></th>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(p.product.id)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              </div>
            </div>
          ))}
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

        <div className="m-5">
          {products.length > 0 && isStock === true && (
            <div>
              <div>合計個数：{ProTotal}</div>
              <div>合計金額：￥{total}</div>
              <button
                type="button"
                onClick={() => router.push("/orders/comfirm")}
                className="m-3 mb-4 px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
              >
                {" "}
                購入手続きへ
              </button>
            </div>
          )}
          <BackButton href="/products" label="買い物を続ける" />
        </div>
      </div>
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
    </div>
  );
}
