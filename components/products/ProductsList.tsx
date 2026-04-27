"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { clientFetchWithAuth } from "../../lib/auth/clientFetchWithAuth";

export default function ProductsList({
  initialProducts,
  role
}: {
  initialProducts: Product[],
  role: "buyer" | "seller"
}) {
  const [error, setError] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  console.log("role", role)


  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.length > 100) {
      setError("検索キーワードは100文字以内で入力してください。")
      return;
    }
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const res = await clientFetchWithAuth(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.success) setProducts(data.data.products);
    setError("");
  };

  return (
    <div className="container flex flex-col gap-3 mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setError("")
          }}
          placeholder="商品名で検索"
          className="border px-2 py-1 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          検索
        </button>
      </form>
      { error && <a className="text-red-500">{error}</a>}
      <ul className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <li key={p.id} className="border p-2 rounded flex flex-col">
            {p.imageUrls.length > 0 && (
              <Image
                src={p.imageUrls[0]}
                alt={p.name}
                width={100}
                height={100}
                className="object-cover mb-2"
              />
            )}
            <h2 className="font-bold text-blue-600 hover:underline mb-1">
              <Link href={`/products/${p.id}`}>{p.name}</Link>
            </h2>
            <p className="mb-1">価格: ¥{p.price}</p>
            <p className="mb-2">在庫: {p.stock}</p>

            {role === "seller" && (
              <Link
                href={`/products/${p.id}/edit`}
                className="mt-auto px-3 py-1 bg-yellow-500 text-white text-center rounded"
              >
                編集
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
