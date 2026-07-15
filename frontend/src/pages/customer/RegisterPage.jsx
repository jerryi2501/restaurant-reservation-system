// SC-C08 顧客新規登録画面 / 権限: GUEST
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerCustomer } from "../../api/mockApi";

export default function RegisterPage() {
  const navigate = useNavigate();

  // 項目が多いので「1つのオブジェクト」でまとめて管理する
  const [form, setForm]       = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // 1つの関数で全項目を更新（input の name 属性で「どの項目か」を判別）
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); // 既存をコピーして name のキーだけ上書き
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 登録API（TODO [BACKEND] は mockApi.registerCustomer 内）
      await registerCustomer(form);
      alert("登録が完了しました。ログインしてください。");
      navigate("/login"); // 登録後はログイン画面へ
    } catch (err) {
      setError(err.message); // 409（メール重複）など
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-[460px] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">会員新規登録</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">お名前</Label>
                <Input id="name" name="name" placeholder="山田 太郎"
                  value={form.name} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input id="phone" name="phone" type="tel" placeholder="090-1234-5678"
                  value={form.phone} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" name="email" type="email" placeholder="yamada@example.com"
                  value={form.email} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">パスワード（8文字以上）</Label>
                <Input id="password" name="password" type="password" minLength={8}
                  value={form.password} onChange={handleChange} required />
              </div>

              {/* エラーは最後の項目の下にまとめて表示 */}
              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "登録中…" : "登録する"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                すでにアカウントをお持ちの方は{" "}
                <Link to="/login" className="text-primary underline">ログイン</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
