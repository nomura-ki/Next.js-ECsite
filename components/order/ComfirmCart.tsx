"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

export default function ComfirmCart() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, postCode, address, phone, payment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "情報の登録に失敗しました");
        return;
      }

      router.push("/orders/complete");
    } catch (err) {
      console.error(err);
      setError("情報の登録に失敗しました");
      return;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            氏名
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
            郵便番号
            <input
              type="text"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            住所
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            電話番号
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
        </div>
        <fieldset>
          <legend>支払方法</legend>
          <div>
            <label>
              <input
                type="radio"
                name="payment"
                value="credit_card"
                onChange={(e) => setPayment(e.target.value)}
                required
              />
              クレジットカード
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="payment"
                value="bank_transfer"
                onChange={(e) => setPayment(e.target.value)}
              />
              銀行振込
            </label>
          </div>
        </fieldset>
        <div>
          <button
            type="submit"
            className="m-3 mb-4 px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
          >
            購入完了する
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
      <BackButton href="/cart" label="カートへ戻る" />
    </div>
  );
}
