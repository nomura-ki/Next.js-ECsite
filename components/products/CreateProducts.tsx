"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateProducts() {
  type Category = {
    id: string;
    name: string;
    description: string;
  };

  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [category_id, setcategory_id] = useState<string>("");
  const [dispCategory, setDispCategory] = useState<Category[]>([]);
  const [stock, setStock] = useState<number>(0);
  const [folderArr, setFolderArr] = useState<string[]>([]);
  const [folder, setFolder] = useState<string>("");
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (checkedValues.length === 0) {
        setError("画像は1枚以上選んでください");
        return;
      }

      const res = await fetch("/api/products", {
        method: "POST",
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
        setError(data.message || "情報の登録に失敗しました");
        return;
      }

      router.push("/products");
    } catch (err) {
      console.error(err);
      setError("商品情報の登録に失敗しました");
      return;
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setDispCategory(data.data);
      });

    fetch("/api/products/folders")
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
            {dispCategory.map((category) => {
              return (
                <div key={category.id}>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      onChange={(e) => setcategory_id(e.target.value)}
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
              <p>選択中画像：{checkedValues.join(",")}</p>
            </fieldset>
          </div>
        )}
        <div>
          <button
            type="submit"
            className="m-3 mb-4 px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
          >
            商品登録する
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
