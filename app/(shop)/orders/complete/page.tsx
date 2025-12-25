import BackButton from "@/components/ui/BackButton";

export default function Page() {
  return (
    <div className="grid place-content-center ">
      <h1 className="text-3xl m-4">ご注文ありがとうございました</h1>
      <BackButton href="/products" label="買い物を続ける" />
    </div>
  );
}
