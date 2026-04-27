"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { useForm } from "react-hook-form";
import { clientFetchWithAuth } from "@/lib/auth/clientFetchWithAuth";
import { NextResponse } from "next/server";

type Category = {
  id: string;
  name: string;
  description: string;
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

export default function CreateProducts() {
  const [error, setError] = useState<string>("");
  const [dispCategory, setDispCategory] = useState<Category[]>([]);
  const [folderArr, setFolderArr] = useState<string[]>([]);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      folder: "",
      checkedValues: []
    },
    shouldUnregister: false,
  });

  const folder = watch("folder");
  const checkedValues = watch("checkedValues");

  const onSubmit = async (formData: FormValue) => {
    setError("");

    try {
      if (checkedValues.length === 0) {
        setError("商品画像を選択してください。")
        return;
      }

      await clientFetchWithAuth("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      router.push("/products");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "商品情報の登録に失敗しました");
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await clientFetchWithAuth("/api/categories")
        const folderRes = await clientFetchWithAuth("/api/products/folders")

        const categoryData = await categoryRes.json();
        const folderData = await folderRes.json();

        console.log("cate", categoryData, "folder", folderData);

        setDispCategory(categoryData.data);
        setFolderArr(folderData.data);

      } catch (e: any) {
        console.error(e);
        setError(e.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!folder) return;

    const fetchData = async () => {
      setError("");

      try {
        const res = await clientFetchWithAuth("/api/products/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder })
        });

        if (!res.ok) {
          return NextResponse.json({message: "img err"})
        }

        const data = await res.json();

        setImageArr(data.data ?? []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchData();
    
  }, [folder]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-[100px_270px_1fr] gap-y-2 gap-x-2 items-center"
      >
        <label>
          商品名
        </label>
        <input
          {...register("name", {
            required: "商品名を入力してください。",
            maxLength: {
              value: 255,
              message: "商品数は255文字以内で入力してください。"
            },
            validate: (value) => 
              value.trim().length > 0 || "スペースのみは入力できません"
          })}
          type="text"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.name?.message}</label>
        <label>
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
                v >= 0 || "価格は0以上で入力してください。"
            }
          })}
          type="number"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.price?.message}</label>
        <label>
          商品説明
        </label>
        <input
          {...register("description", {
            maxLength: {
              value: 2000,
              message: "商品説明は2000文字以内で入力してください。"
            },
            validate: (value) =>
              value === "" || value.trim().length > 0 || "スペースのみは入力できません。"
          })}
          type="text"
          className="border-1 rounded pl-2 w-[250px]"
        />
        <label className="text-red-500">{errors.description?.message}</label>
        <label htmlFor="category">
          カテゴリー
        </label>
        <select
          {...register("category_id", {
            required: "カテゴリーを選択してください。",
            validate: (value) => 
              dispCategory.some(c => c.id === value) || "存在しないカテゴリーが選択されています。"
          })}
          id="category"
          className="border-1 rounded pl-2 w-[250px]"
        >
          <option value="">選択してください</option>
          {dispCategory.map((category) => {
            return (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            );
          })}
        </select>
        <label className="text-red-500">{errors.category_id?.message}</label>
        <label>
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
                        required: "フォルダを選択してください",
                        validate: (value) => 
                          (folderArr.some(f => f === value)) || "指定された画像フォルダが存在しません。"
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
                const uniqueValue = `${folder}/${image}`;

                return (
                  <label
                    key={uniqueValue}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={image}
                      {...register("checkedValues", {
                        required: "商品画像を選択してください。",
                        validate: (values) => {
                          if (!values || values.length === 0) return "指定されたフォルダに画像が存在しません。";

                          if (!values.every(v => imageArr.includes(v))) {
                            return "指定された画像ファイルが存在しません。";
                          }

                          if (!values.every(v => /\.(jpg|jpeg|png|webp)$/i.test(v))) {
                            return "画像ファイル形式が不正です。"
                          }

                          return true;
                        }
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
          <p className="w-[180px]">選択中画像</p>
          <div className="flex flex-col">
            {checkedValues.map((v, i) => (
              <p key={i}>・{v}</p>
            ))}
          </div>
        </div>
        <div className="col-span-3 flex gap-3 pt-5">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
          >
            商品登録する
          </button>
          <BackButton href="/products" label="商品一覧へ戻る" />
        </div>
        {error && <p className="col-span-3 text-red-500">{error}</p>}
      </form>
    </div>
  );
}
