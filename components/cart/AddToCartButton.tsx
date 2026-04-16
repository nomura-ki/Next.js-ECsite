"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";
import BackButton from "../ui/BackButton";

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
  const initMessage = {
    message: "",
    danger: false
  }

  const [quantity, setQuantity] = useState<number>(cartQuantity);
  const [message, setMessage] = useState<{message: string, danger: boolean}>(initMessage);
  const { role } = useAuth();

  const validate = (value: number) => {
    if (value <= 0) {
      return "数量は1以上で入力してください。"
    } else if (!Number.isInteger(value)) {
      return "数量は整数で入力してください。"
    } else if (stock < value) {
      return "在庫数を超えています。"
    }
  }

  const handleAddToCart = async () => {
    setMessage(initMessage);

    try {
      if (stock < quantity) {
        setMessage({message: "在庫が不足しています。", danger: true});
        return;
      }
       
      const err = validate(quantity);

      if (err) {
        setMessage({message: err, danger: true});
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();

      setMessage({
        message: data.success
          ? "カートに追加しました"
          : data.message,
        danger: !data.success,
      });

    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage({message: "システムエラーが発生しました。しばらくしてから再度お試しください。", danger: true});
    }
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    setMessage(initMessage);
    setQuantity(value);

    const err = validate(value);

    if (err) {
      setMessage({message: err, danger: true})
      return;
    }
  };

  const disabled: boolean = ( role === "seller") 

  return (
    <div>
      <div className="grid grid-cols-[100px_1fr] gap-y-5 gap-x-2 items-center">
        <label>数量</label>
        <div className="flex gap-3 items-center">
          <input
            disabled={disabled}
            type="number"
            min={0}
            max={stock}
            value={quantity}
            onChange={handleChangeQuantity}
            className="border px-2 py-1 w-20 rounded"
          />
          {message && (
            <p
              className={`${message.danger ? "text-red-500" : "text-green-500"} col-span-2`}
            >
              {message.message}
            </p>
          )}
        </div>
        <div className="col-start-2 flex items-center gap-5">
          <button
            disabled={disabled}
            type="button"
            onClick={handleAddToCart}
            className="h-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            カートに追加
          </button>
          <BackButton href="/products" label="商品一覧へ戻る" />
        </div>
      </div>
    </div>
  );
}
