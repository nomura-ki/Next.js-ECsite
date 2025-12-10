import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>next.jsによるECサイト</p>
      <div>
        <Link href="/login">ログイン</Link>
      </div>
    </div>
  );
}
