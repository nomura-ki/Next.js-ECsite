"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  imageUrls?: string[];
}

export default function ProductImages({ imageUrls }: Props) {
  const [mainImage, setMainImage] = useState(imageUrls?.[0] || "/no-image.png");

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Image
        src="/no-image.png"
        alt="商品画像なし"
        width={50}
        height={50}
        className="object-cover rounded shadow"
      />
    );
  }

  return (
    <div>
      <Image
        src={mainImage}
        alt="商品メイン画像"
        width={300}
        height={300}
        className="object-cover rounded shadow"
      />
      {imageUrls.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {imageUrls.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`サムネイル${idx + 1}`}
              onClick={() => setMainImage(url)}
              width={50}
              height={50}
              className={`object-cover rounded cursor-pointer border ${
                mainImage === url ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
