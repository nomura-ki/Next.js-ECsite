"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
  stock: number;
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

export default function AddToCartButton({ productId, stock }: Props) {
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isOk, setIsOk] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        data.data.cartItems.map((cartItem: cartItem) => {
          if (cartItem.product.id === productId) {
            setQuantity(cartItem.quantity);
          }
        });
      });
  }, [productId]);

  // setIsOk(quantity > 0 && quantity <= stock);

  const errorMessage =
    quantity > stock
      ? "エラー：在庫が足りません"
      : quantity === 0
      ? "未選択：選択している個数が0個です"
      : "";

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
    setIsOk(true);
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
        {isOk && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            カートに追加
          </button>
        )}
      </div>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

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
