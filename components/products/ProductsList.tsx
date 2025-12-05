"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function ProductsList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const { role } = useAuth();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.success) setProducts(data.data.products);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <ul className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <li key={p.id} className="border p-2 rounded flex flex-col">
            {p.imageUrls.length > 0 && (
              <img
                src={p.imageUrls[0]}
                alt={p.name}
                className="w-full h-48 object-cover mb-2"
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
