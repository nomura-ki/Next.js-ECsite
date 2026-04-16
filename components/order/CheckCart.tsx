"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import Image from "next/image";

type CartItem = {
  quantity: number;
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
  updated_at: Date;
};

interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
  subtotal: number;
}

type Error = {
  [productId: string]: string | null
}

const initMessage = {
  message: "",
  danger: false
}

export default function CheckCart({
  initialCartProducts,
}: {
  initialCartProducts: CartItemWithProduct[];
}) {
  const [products, setProducts] = useState(initialCartProducts);
  const [message, setMessage] = useState<{message: string, danger: boolean}>();
  const [errors, setErrors] = useState<Error>({});

  const router = useRouter();

  let total = 0;
  let ProTotal = 0;

  for (let i = 0; products.length > i; i++) {
    total = total + products[i].subtotal;
  }

  for (let i = 0; products.length > i; i++) {
    ProTotal = ProTotal + products[i].quantity;
  }

  const validate = (quantity: number, stock: number) => {
    if (quantity < 1) {
      return "個数は１以上で入力してください。"
    } else if (stock < quantity) {
      return "在庫数を超えています。"
    } 
    return null;
  }

  useEffect(() => {
    const initError: Error = {};

    products.forEach((p) => {
      initError[p.product.id] = validate(p.quantity, p.product.stock)
    })

    setErrors(initError);
  },[])

  const handleDeleteItem = async (productId: string) => {
    setMessage(initMessage);
    try {
      const DelRes = await fetch("/api/cart", {
        method: "DELETE",
        body: JSON.stringify({ productId }),
      });

      if (!DelRes) {
        setMessage({message: "DeleteResponse error", danger: true});
        return;
      }
      const DelData = await DelRes.json();

      const GetRes = await fetch("/api/cart", {
        method: "GET",
        headers: { cookie: cookieStore.toString() },
      });

      if (!GetRes) {
        setMessage({message: "GetResponse error", danger: true});
        return;
      }
      
      const GetData = await GetRes.json();

      const NewData: CartItemWithProduct[] = GetData.data.cartItems;
      setProducts(NewData);

      if (DelData.success) {
        setMessage({message: "カートから削除しました。", danger: false})
      } else if (!DelData.success) {
        setMessage({message: DelData.message || "システムエラーが発生しました。しばらくしてから再度お試しください。", danger: true})
      }

      if (!GetData.success) {
        setMessage({message: GetData.message || "システムエラーが発生しました。しばらくしてから再度お試しください。", danger: true})
      }
    } catch (err) {
      console.error("delete error:", err);
      setMessage({message: "システムエラーが発生しました。しばらくしてから再度お試しください。", danger: true});
    }
  };
  
  const handleUpdateCart = async (productId: string, quantity: number, stock: number) => {
    setMessage(initMessage);
    try {
      const err = validate(quantity, stock)

      setErrors((prev) => ({
        ...prev,
        [productId]: err,
      }))

      const UpdateRes = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!UpdateRes) {
        setMessage({message: "UpdateRes error", danger: true});
        return;
      }
      const UpdateData = await UpdateRes.json();

      const GetRes = await fetch("/api/cart", {
        method: "GET",
        headers: { cookie: cookieStore.toString() },
      });

      if (!GetRes) {
        setMessage({message: "GetResponse error", danger: true});
        return;
      }
      const GetData = await GetRes.json();

      const NewData: CartItemWithProduct[] = GetData.data.cartItems;
      setProducts(NewData);

      UpdateData.success
      ? setMessage({message: "個数を変更しました", danger: false})
      : setMessage({message: UpdateData.message || "システムエラーが発生しました。しばらくしてから再度お試しください。", danger: true})

    } catch (err) {
      console.error("update error", err);
      setMessage({message: "システムエラーが発生しました。しばらくしてから再度お試しください。", danger: true});
    }
  };

  const handleSubmit = () => {
    const newError: Error = {};

    products.forEach((pro) => {
      newError[pro.product.id] = validate(pro.quantity, pro.product.stock)
    })

    setErrors(newError);

    const hasError = Object.values(newError).some(Boolean);

    if (hasError) return;

    router.push("/orders/comfirm");
  }

  return (
    <div className="flex gap-20">
      <div className="flex flex-col gap-10 min-w-100">
        {products.map((p, index) => (
          <div key={p.id} className="flex gap-5">
            <Image
              src={p.product.imageUrl}
              alt={`商品画像${index}`}
              width={100}
              height={100}
              className="object-contain"
            />
            <div className="flex flex-col gap-3">
              <table className="border-collapse">
                <tbody>
                  <tr>
                    <th className="text-left pr-4">商品名</th>
                    <td>{p.product.name}</td>
                  </tr>
                  <tr>
                    <th className="text-left pr-4">価格</th>
                    <td>￥{p.product.price}</td>
                  </tr>
                  <tr>
                    <th className="text-left pr-3">個数</th>
                    <td>
                      <input
                        type="number"
                        min={1}
                        max={p.product.stock}
                        value={p.quantity}
                        onChange={(e) =>
                          handleUpdateCart(p.product.id, Number(e.target.value), p.product.stock)
                        }
                        className="text-center border border-1 rounded"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left pr-4">小計</th>
                    <td>￥{p.subtotal}</td>
                  </tr>
                </tbody>
              </table>
              {errors[p.product.id] && (
                <div className="text-red-500">{errors[p.product.id]}</div>
              )}
              <button
                type="button"
                onClick={() => handleDeleteItem(p.product.id)}
                className="w-30 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 "
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      {products.length > 0 ? (      
        <div className="flex flex-col gap-5">
          <div className="flex flex-col self-start gap-1">
            <div>合計個数：{ProTotal}</div>
            <div>合計金額：￥{total}</div>
          </div>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-400 transition"
            >
              {" "}
              購入手続きへ
            </button>
            <BackButton href="/products" label="買い物を続ける" />
          </div>
          {message && (
            <p
              className={`${
                message.danger
                  ? "text-red-600"
                  : "text-green-600"
              } self-start`}
            >
              {message.message}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-7 py-10">
          <p className="text-lg">カートが空です。</p>
          <BackButton href="/products" label="買い物を続ける" />
        </div>
      )
      }


    </div>
  );
}
