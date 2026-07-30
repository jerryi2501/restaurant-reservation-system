// SC-C07 顧客ログイン画面 / 権限: GUEST
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button} from "@/components/ui/button";
import { loginCustomer } from "../../api/mockApi";
import { useAuthStore } from "../../store";

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const setAuth   = useAuthStore((s) => s.setAuth);

  // ログイン後の遷移先（"マイ予約を見る" などから来た場合は元の画面へ）
  const from = location.state?.from ?? "/mypage";
  // 新規登録直後なら成功バナーを表示
  const registered = location.state?.registered;

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginCustomer({ email, password });
      // 認証トークンは Cookie で管理されるため、ここでは表示用の情報だけ保存する
      setAuth({ name: data.displayName, role: data.role });
      navigate(from, { replace: true }); // 元の画面 or /mypage へ
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-[420px] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">会員ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {registered && (
                <p className="text-sm text-emerald-700 bg-emerald-50 rounded-md px-3 py-2 text-center">
                  登録が完了しました。ログインしてください。
                </p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" placeholder="yamada@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">パスワード</Label>
                <Input id="password" type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "ログイン中..." : "ログイン"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                アカウントをお持ちでない方は{" "}
                <Link to="/register" className="text-primary underline">新規登録</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
