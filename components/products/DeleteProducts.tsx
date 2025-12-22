"use client";

import { NextResponse } from "next/server";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProducts({ id }: { id: string }) {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDeleteProduct = async () => {
    setError("");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res) {
        setError("エラーが発生しました");
        throw new Error("delete response error");
      }

      router.push("/products");

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error(err);
      setError("エラーが発生しました");
      return NextResponse.json(
        { success: false, message: "エラーが発生しました" },
        { status: 500 }
      );
    }
  };
  return (
    <div>
      <button
        type="button"
        onClick={() => handleDeleteProduct()}
        className="m-3 mb-4 px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
      >
        商品を削除する
      </button>
      {error}
    </div>
  );
}
