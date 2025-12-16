"use client";

import { useState } from "react";

interface Props {
  productId: string;
  stock: number;
}

export default function AddToCartButton({ productId, stock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    setMessage("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();

      setMessage(
        data.success
          ? "カートに追加しました！"
          : data.message || "カート追加に失敗しました"
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage("カート追加中にエラーが発生しました");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <div className="flex items-center gap-2">
        <label>数量:</label>
        <input
          type="number"
          min={1}
          max={stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border px-2 py-1 w-20 rounded"
        />
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        カートに追加
      </button>

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
