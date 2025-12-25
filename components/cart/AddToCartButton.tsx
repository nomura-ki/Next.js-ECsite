"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
  stock: number;
  cartQuantity: number;
};

type cartItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
  quantity: number;
  subtotal: number;
};

export default function AddToCartButton({
  productId,
  stock,
  cartQuantity,
}: Props) {
  const [quantity, setQuantity] = useState<number>(cartQuantity);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleAddToCart = async () => {
    setMessage("");

    try {
      if (quantity <= 0) {
        setMessage("未選択：個数は１つ以上選んでください");
        return;
      } else if (stock < quantity) {
        setMessage("エラー：在庫が足りません");
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();

      setMessage(
        data.success
          ? "カートに追加しました！"
          : data.message || "エラー：カート追加に失敗しました"
      );

      router.push("/products");
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage("エラー：カート追加中にエラーが発生しました");
    }
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setQuantity(value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <div className="flex items-center gap-2">
        <label>数量:</label>
        <input
          type="number"
          min={0}
          max={stock}
          value={quantity}
          onChange={handleChangeQuantity}
          className="border px-2 py-1 w-20 rounded"
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          カートに追加
        </button>
      </div>

      {message && (
        <p
          className={`${
            message.includes("未選択") || message.includes("エラー")
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
