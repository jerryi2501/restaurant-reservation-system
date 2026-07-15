// SC-C09 マイページ（会員プロフィール）/ 権限: CUSTOMER
import { useEffect, useState } from "react";
import AccountLayout from "../../components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getMyProfile, updateMyProfile } from "../../api/mockApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // マウント時にプロフィールを取得（TODO [BACKEND] は mockApi.getMyProfile 内）
  useEffect(() => {
    getMyProfile().then((p) => {
      setProfile(p);
      setName(p.name);
      setPhone(p.phone);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({ name, phone });
      alert("プロフィールを更新しました");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <AccountLayout>
        <p className="text-muted-foreground">読み込み中…</p>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <h1 className="text-2xl font-semibold mb-6">マイページ</h1>

      {/* 会員サマリー */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium flex items-center gap-2">
              {profile.name} 様
              <Badge variant="secondary">{profile.rank}会員</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              保有 {profile.currentPoints}pt ／ 累計 {profile.rankPoints}pt
            </p>
          </div>
        </CardContent>
      </Card>

      {/* プロフィール編集 */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-sm">
            <div className="grid gap-2">
              <Label htmlFor="name">お名前</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              {/* メールは変更不可（disabled） */}
              <Input id="email" value={profile.email} disabled />
            </div>
            <Button type="submit" disabled={saving} className="w-fit">
              {saving ? "更新中…" : "更新する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AccountLayout>
  );
}
