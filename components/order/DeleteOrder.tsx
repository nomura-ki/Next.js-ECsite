"use client";

import { useRouter } from "next/navigation";

export default function DeleteOrder({ id }: { id: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        cache: "no-cache",
      });

      if (!res.ok) {
        console.error("エラーが発生しました");
        return;
      }

      router.push("/orders");
    } catch (err) {
      console.error(err);
      return <div>エラーが発生しました</div>;
    }
  };
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      注文を削除する
    </button>
  );
}
