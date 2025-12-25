"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  description: string;
};

type image = {
  image_url: string;
};

export default function EditProducts({ id }: { id: string }) {
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [category_id, setCategory_id] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
  const [stock, setStock] = useState<number>(0);
  const [folder, setFolder] = useState<string>("");
  const [folderArr, setFolderArr] = useState<string[]>([]);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [currentImages, setCurrentImage] = useState<string[]>([]);
  const router = useRouter();

  const dir = "/productImages/";

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const product = data.data.products[0].product;
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCategory_id(product.category_id);
        setStock(product.stock);
        const imageurl: string[] = data.data.products.map((image: image) => {
          return image.image_url.replace(dir, "");
        });
        setCurrentImage(imageurl);
      });
  }, [id]);

  useEffect(() => {
    fetch(`/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data.data);
      });

    fetch(`/api/products/folders`)
      .then((res) => res.json())
      .then((data) => {
        setFolderArr(data.data);
      });
  }, []);

  useEffect(() => {
    if (folder) {
      fetch("/api/products/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      })
        .then((res) => res.json())
        .then((data) => {
          setImageArr(data.data);
        });
    }
  }, [folder]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (checkedValues.length === 0) {
        setError("画像は1枚以上選んでください");
        return;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          description,
          stock,
          category_id,
          checkedValues,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "エラーが発生しました");
        return;
      }

      router.push("/products");
    } catch (err) {
      console.error(err);
      setError("商品の更新に失敗しました");
      return;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            商品名
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            価格
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            商品説明
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <fieldset>
            <legend>カテゴリー</legend>
            {category.map((category) => {
              return (
                <div key={category.id}>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      onChange={(e) => setCategory_id(e.target.value)}
                      checked={category_id === category.id}
                      required
                    />
                    {category.name}
                  </label>
                </div>
              );
            })}
          </fieldset>
        </div>
        <div>
          <label>
            在庫数
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <fieldset>
            <legend>画像フォルダーを選択</legend>
            {folderArr.map((folder) => {
              return (
                <div key={folder}>
                  <label>
                    <input
                      type="radio"
                      name="folder"
                      value={folder}
                      onChange={(e) => setFolder(e.target.value)}
                      required
                    />
                    {folder}
                  </label>
                </div>
              );
            })}
          </fieldset>
        </div>

        {imageArr.length > 0 && (
          <div>
            <fieldset>
              <legend>画像を選択</legend>
              {imageArr.map((image) => {
                return (
                  <div key={image}>
                    <label>
                      <input
                        type="checkbox"
                        name="image"
                        value={image}
                        checked={checkedValues.includes(image)}
                        onChange={handleCheckboxChange}
                      />
                      {image}
                    </label>
                  </div>
                );
              })}
              <div>
                <p>選択中変更後画像：</p>
                {checkedValues.map((value, index) => (
                  <p key={index}>{value}</p>
                ))}
              </div>
            </fieldset>
          </div>
        )}
        <div>
          <p>現在使用中画像：</p>
          {currentImages.map((value, index) => (
            <p key={index}>{value}</p>
          ))}
        </div>
        <div>
          <button
            type="submit"
            className="m-3 mb-4 px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
          >
            商品更新する
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
