// SC-S01 スタッフログイン画面 / 権限: GUEST（店舗スタッフ・管理者用）
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginStaff } from "../../api/mockApi";
import { useAuthStore } from "../../store";

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginStaff({ username, password });
      localStorage.setItem("token", data.token);
      // role 付きでログイン状態を保存（STAFF / ADMIN）
      setAuth({ name: data.displayName, role: data.role }, data.token);
      navigate("/staff");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>スタッフ ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input id="username" value={username} placeholder="staff01"
                onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "ログイン中…" : "ログイン"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              ※ このページは店舗スタッフ専用です
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
