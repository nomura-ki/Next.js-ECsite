"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("本当にこの商品を削除しますか？")) return;

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        alert("商品を削除しました");
        router.push("/products");
      } else {
        alert(data.message || "商品削除に失敗しました");
      }
    } catch (err) {
      console.error(err);
      alert("削除中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      {loading ? "削除中..." : "削除する"}
    </button>
  );
}
