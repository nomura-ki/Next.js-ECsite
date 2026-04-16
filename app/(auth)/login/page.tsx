import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <label className="text-2xl">ECサイトログイン画面</label>
      <LoginForm></LoginForm>
    </div>
  );
}
