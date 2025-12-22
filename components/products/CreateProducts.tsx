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
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventFiles = event.target.files;
    if (!eventFiles) {
      setError("画像ファイルが空です");
      return;
    }

    console.log("eventFiles", eventFiles);

    const selectedFiles: File[] = Array.from(eventFiles);

    console.log("selectedFiles:", selectedFiles);

    setFiles(selectedFiles);

    console.log("files:", files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`file[]`, file);
      console.log(`file[]`, file);
    });

    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("category_id", category_id);
    formData.append("stock", String(stock));

    console.log(formData);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
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

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setDispCategory(data.data);
      });
  }, []);

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

            {/* <label>
            カテゴリー
            <input
              type=""
              value={category_id}
              onChange={(e) => setcategory_id(e.target.value)}
            />
          </label> */}
          </fieldset>
        </div>
        <div>
          <label>
            在庫数
            {/* <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            /> */}
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>画像を選択してください</label>
          <br />
          {/* <input
            type="file"
            onChange={(e) => {
              const files = e.currentTarget.files;
              if (!files) return setError("ファイルが空です");
              setFiles((prev) => [...prev, ...Array.from(files)]);
            }}
            accept="image/*"
            multiple
            required
          /> */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            required
            accept="image/*"
          />
        </div>
        {/* <div>
          <ul>
            {files.map((file, index) => {
              <li key={index}>{file.name}</li>
})}
          </ul>
        </div> */}
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
