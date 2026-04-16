"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import BackButton from "@/components/ui/BackButton";
import ProductDeleteButton from "./ProductDeleteButton";

type Category = {
  id: string;
  name: string;
  description: string;
};

type image = {
  image_url: string;
};

type FormValue = {
  name: string;
  price: number;
  description: string;
  category_id: string;
  stock: number;
  folder: string;
  checkedValues: string[];
}

export default function EditProducts({ id }: { id: string }) {
  const [error, setError] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
  const [folderArr, setFolderArr] = useState<string[]>([]);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValue>();

  const folder = watch("folder");

  const dir = "/productImages/";
  const checkedValues = watch("checkedValues");

  useEffect(() => {
    const fetchData = async () =>{
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      const product = data.data.products[0].product;

      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category_id: product.category_id,
        stock: product.stock,
        checkedValues: data.data.products.map((image: image) => {
          return image.image_url.replace(dir, "");
        }),
      })
      console.log("product", product, "data", data, "image", product.image_url);
    };

    fetchData();
  }, [id, reset]);

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
    if (!folder) return;

    fetch("/api/products/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    })
      .then((res) => res.json())
      .then((data) => {
        setImageArr(data.data ?? []);
      });

  }, [folder]);
  
  const onSubmit = async (formData: FormValue) => {
    setError("");

    try {
      if (checkedValues.length === 0) {
        setError("画像は1枚以上選んでください");
        return;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-[100px_270px_1fr] gap-y-2 gap-x-2 items-center"
      >
        <label htmlFor="productName">
          商品名
        </label>
        <input
          {...register("name", {
            required: "商品名を入力してください。",
            maxLength: {
              value: 255,
              message: "商品名は255文字以内で入力してください。"
            }
          })}
          id="productName"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.name?.message}</label>
        <label htmlFor="price">
          価格
        </label>
        <input
          {...register("price", {
            valueAsNumber: true,
            required: "価格を入力してください。",
            validate: {
              isNumber: (v) => 
                !isNaN(v) || "価格は数値で入力してください。",
              isInteger: (v) =>
                Number.isInteger(v) || "価格は整数で入力してください。",
              isPositive: (v) =>
                v >= 0 ||"価格は0以上で入力してください。"
            }
          })}
          type="number"
          id="pricee"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.price?.message}</label>
        <label htmlFor="introduction">
          商品説明
        </label>
        <input
          {...register("description", {
            maxLength: {
              value: 2000,
              message: "商品説明は2000文字以内で入力してください。"
            }
          })}
          type="text"
          id="introduction"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.description?.message}</label>
        <label htmlFor="category">カテゴリー</label>
        <select
          {...register("category_id", {
            required: "カテゴリーを選択してください。",
            validate: (value) =>
              category.some(e => e.id === value) || "存在しないカテゴリーが選択されています。"
          })}
          id="category"
          className="border-1 rounded pl-2 w-[250px]"
        >
          <option value="">選択してください</option>
          {category.map((category) => {
            return (
              <option
                key={category.id}
                value={category.id}
                className="text-black"
              >
                {category.name}
              </option>
            );
          })}
        </select>
        <label className="text-red-500">{errors.category_id?.message}</label>
        <label htmlFor="stock">
          在庫数
        </label>
        <input
          {...register("stock", {
            valueAsNumber: true,
            required: "在庫数を入力してください。",
            validate: {
              isNumber: (v) => 
                !isNaN(v) || "在庫数は数値で入力してください。",
              isInteger: (v) =>
                Number.isInteger(v) || "在庫数は整数で入力してください。",
              isPositive: (v) =>
                v >= 0 || "在庫数は0以上で入力してください。"
            }
          })}
          type="number"
          id="stock"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.stock?.message}</label>
        <fieldset className="col-span-2 flex">
          <label className="w-[180px]">画像フォルダーを選択</label>
          <div className="flex flex-col">
            {folderArr.map((folder) => {
              return (
                <div key={folder}>
                  <label>
                    <input
                      type="radio"
                      value={folder}
                      {...register("folder", {
                        required: "フォルダーを選択して商品画像を選択してください。"
                      })}
                    />
                    {folder}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
        <label className="text-red-500">{errors.folder?.message}</label>

        {imageArr.length > 0 && (
          <>
          <fieldset className="col-span-2 flex">
            <label className="w-[180px]">画像を選択</label>
            <div className="flex flex-col flex-1 min-w-0">
              {imageArr.map((image) => {
                return (
                  <label
                    key={image}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={image}
                      {...register("checkedValues", {
                        validate: (value) =>
                          value && value.length > 0 || "商品画像を選択してください。"
                      })}
                      className="shrink-0"
                    />
                    <span className="break-all min-w-0">{image}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <label className="text-red-500">{errors.checkedValues?.message}</label>
          </>
        )}
        <div className="col-span-3 flex">
          <label className="w-[180px]">選択中画像</label>
            <div className="flex flex-col">
            {checkedValues?.map((value, index) => (
              <p key={index}>{value}</p>
            ))}
          </div>
        </div>
        <div className="col-span-3 flex gap-3 pt-5">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
          >
            商品更新する
          </button>
          <ProductDeleteButton id={id} />
          <BackButton
            href="/products" 
            label="商品一覧に戻る"
          />
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
