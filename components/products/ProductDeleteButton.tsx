"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientFetchWithAuth } from "../../lib/auth/clientFetchWithAuth";

export default function ProductDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("本当にこの商品を削除しますか？")) return;

    setLoading(true);

    try {
      const res = await clientFetchWithAuth(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      {loading ? "削除中..." : "削除する"}
    </button>
  );
}
