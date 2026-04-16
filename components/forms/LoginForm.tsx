"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async ( loginData: FormValues ) => {
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "メールアドレスまたはパスワードが正しくありません。");
        return;
      }

      router.push("/products");
    } catch (err) {
      console.error(err);
      setError("ログインに失敗しました!");
      return;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[120px_250px_1fr] gap-y-2 gap-x-2 items-center"
    >
      <label htmlFor="mail">メールアドレス</label>
      <input
        {...register("email", {
          required: "メールアドレスを入力してください。",
          pattern: {
            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: "メールアドレスの形式が正しくありません。"
          },
          maxLength: {
            value: 254,
            message: "メールアドレスは254文字以内で入力してください。"
          }
        })}
        placeholder="xxx@yyy.com"
        className="border-1 rounded pl-1"
        id="mail"
      />
      <label className="text-red-500">{errors.email?.message}</label>
      <label htmlFor="password">
        パスワード
      </label>
      <input
        {...register("password", {
          required: "パスワードを入力してください。",
          minLength: {
            value: 8,
            message: "パスワードは8文字以上で入力してください。"
          },
          maxLength: {
            value: 64,
            message: "パスワードは64文字以内で入力してください。"
          }
        })}
        type="password"
        placeholder="password123"
        className="border-1 rounded pl-1"
        id="password"
      />
      <label className="text-red-500">{errors.password?.message}</label>
      <div className="col-span-2 col-start-2 flex gap-5 items-center">
        <button
          type="submit"
          className="w-max px-3 my-3 border-1 rounded"
        >
          ログイン
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </form>
  );
}
