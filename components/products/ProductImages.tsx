"use client";

import { useState } from "react";

interface Props {
  imageUrls?: string[];
}

export default function ProductImages({ imageUrls }: Props) {
  const [mainImage, setMainImage] = useState(imageUrls?.[0] || "/no-image.png");

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <img
        src="/no-image.png"
        alt="商品画像なし"
        className="w-full h-96 object-cover rounded shadow"
      />
    );
  }

  return (
    <div>
      <img
        src={mainImage}
        alt="商品メイン画像"
        className="w-full h-96 object-cover rounded shadow"
      />
      {imageUrls.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`サムネイル${idx + 1}`}
              onClick={() => setMainImage(url)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                mainImage === url ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
