"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { useForm } from "react-hook-form";
import { clientFetchWithAuth } from "@/lib/auth/clientFetchWithAuth";

type FormValue = {
  name: string,
  postCode: string,
  address: string,
  phone: string,
  payment: "credit_card" | "bank_transfer",
}

export default function ComfirmCart() {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>();

  const onSubmit = async ( orderData: FormValue) => {
    setError("");

    console.log(1)

    try {
      const res = await clientFetchWithAuth("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      console.log(2)

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "情報の登録に失敗しました");
        return;
      }
      console.log(13)

      router.push("/orders/complete");
    } catch (err) {
      console.error(err);
      setError("システムエラーが発生しました。しばらくしてから再度お試しください。");
      return;
    }
  };
  
  return (
    <>
    <h1 className="text-2xl">注文情報入力</h1>
    <div className="flex flex-col h-screen gap-7 p-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-[70px_250px_1fr] gap-y-3 gap-x-2 items-center" 
      >
        <label htmlFor="name">
          氏名
        </label>
        <input
          {...register("name", {
            required: "氏名を入力してください。",
            maxLength: {
              value: 100,
              message: "氏名は100文字以内で入力してください。"
            }
          })}
          id="name"
          className="border-1 rounded pl-2"
          placeholder="山田 太郎"
        />
        <label className="text-red-500">{errors.name?.message}</label>
        <label htmlFor="mailNumber">
          郵便番号
        </label>
        <input
          {...register("postCode", {
            required: "郵便番号を入力してください。",
            minLength: {
              value: 7,
              message: "郵便番号は7桁で入力してください。"
            },
            maxLength: {
              value: 7,
              message: "郵便番号は7桁で入力してください。"
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "郵便番号は数字のみで入力してください。"
            }
          })}
          id="mailNumber"
          className="border-1 rounded pl-2"
          placeholder="1234567"
        />
        <label className="text-red-500">{errors.postCode?.message}</label>
        <label htmlFor="adress">
          住所
        </label>
        <input
          {...register("address", {
            required: "住所を入力してください。",
            maxLength: {
              value: 255,
              message: "住所は255文字以内で入力してください。"
            }
          })}
          id="adress"
          className="border-1 rounded pl-2"
          placeholder="横浜市西区みなとみらい1-2-3"
        />
        <label className="text-red-500">{errors.address?.message}</label>
        <label htmlFor="number">
          電話番号
        </label>
        <input
          {...register("phone", {
            required: "電話番号を入力してください。",
            pattern: {
              value: /^[0-9]+$/,
              message: "電話番号は数字のみで入力してください。"
            },
            maxLength: {
              value: 13,
              message: "電話番号が長すぎます。"
            }
          })}
          id="number"
          className="border-1 rounded pl-2"
          placeholder="01234567890"
        />
        <label className="text-red-500">{errors.phone?.message}</label>
        <legend>支払方法</legend>
        <div className="flex flex-col">
          <label>
            <input
              type="radio"
              value="credit_card"
              {...register("payment", {
                required: "志賀頼方法を選択してください。"
              })}
            />
            クレジットカード
          </label>
          <label>
            <input
              type="radio"
              value="bank_transfer"
              {...register("payment", {
                required: "支払方法を選択してください。"
              })}
            />
            銀行振込
          </label>
        </div>
        <label className="text-red-500">{errors.payment?.message}</label>
        {error && <p className="col-span-3 text-red-500">{error}</p>}

        <div className="col-span-3 flex gap-5">
          <button
            type="submit"
            className="w-max px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
         >
            購入完了する
          </button>
          <BackButton href="/cart" label="カートへ戻る" />
        </div>
      </form>
    </div>
    </>
  );
}
