"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { role } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        alert("ログアウトに失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーエラー");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/products")}
      >
        ECサイト
      </h1>

      <div className="flex items-center gap-3">
        {role === "seller" && (
          <>
            <button
              onClick={() => router.push("/products/new")}
              className="px-3 py-1 bg-green-500 rounded"
            >
              商品登録
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="px-3 py-1 bg-blue-500 rounded"
            >
              注文管理
            </button>
          </>
        )}

        {role === "buyer" && (
          <button
            onClick={() => router.push("/cart")}
            className="px-3 py-1 bg-yellow-500 rounded"
          >
            カートへ
          </button>
        )}

        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 rounded">
          ログアウト
        </button>
      </div>
    </header>
  );
}
