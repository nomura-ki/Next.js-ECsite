"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BackButton from "../ui/BackButton";

export default function DeleteOrder({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const handleDelete = async () => {
    try {

      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        cache: "no-cache",
      });

      if (!res.ok) {
        setError("システムエラーが発生しました。しばらくしてから再度お試しください。")
        return;
      }

      router.push("/orders");
    } catch (err) {
      console.error(err);
      return <div>システムエラーが発生しました。しばらくしてから再度お試しください。</div>;
    }
  };
  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex gap-5">
        <button
          type="button"
          onClick={handleDelete}
          className="w-max bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          注文を削除する
        </button>
        <BackButton href="/orders" label="戻る" />
        </div>
      <div className="text-red-500">システムエラーが発生しました。しばらくしてから再度お試しください。</div>
    </div>
  );
}
