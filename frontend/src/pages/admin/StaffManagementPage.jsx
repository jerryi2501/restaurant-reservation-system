// SC-A01 スタッフ管理 / 権限: ADMIN
import { useEffect, useState } from "react";
import { Plus, Search, Bell, Settings, Users, CheckCircle, Clock } from "lucide-react";
import StaffLayout from "../../components/StaffLayout";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getStaffUsers, createStaffUser, updateStaffUser } from "../../api/mockApi";

const EMPTY = { username: "", displayName: "", role: "STAFF" };

export default function StaffManagementPage() {
  const [list, setList]           = useState([]);
  const [search, setSearch]       = useState("");
  const [open, setOpen]           = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);

  useEffect(() => { getStaffUsers().then(setList); }, []);

  function openCreate() { setEditingId(null); setForm(EMPTY); setOpen(true); }
  function openEdit(u)  { setEditingId(u.id); setForm({ username: u.username, displayName: u.displayName, role: u.role }); setOpen(true); }
  function change(e)    { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }

  async function handleConfirm() {
    if (editingId) {
      await updateStaffUser(editingId, form);
      setList((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
    } else {
      const created = await createStaffUser(form);
      setList((prev) => [...prev, created]);
    }
    setOpen(false);
  }

  async function toggleActive(u) {
    await updateStaffUser(u.id, { isActive: !u.isActive });
    setList((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !x.isActive } : x)));
  }

  const filtered = search
    ? list.filter((u) => u.username.includes(search) || u.displayName.includes(search))
    : list;

  const totalCount   = list.length;
  const activeCount  = list.filter((u) => u.isActive).length;
  const inactiveCount = list.filter((u) => !u.isActive).length;

  return (
    <StaffLayout>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">スタッフ管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">システムを利用するスタッフのアカウント情報を管理します。</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text" placeholder="スタッフを検索..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm w-48"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-muted"><Bell className="size-5 text-muted-foreground" /></button>
          <button className="p-2 rounded-lg hover:bg-muted"><Settings className="size-5 text-muted-foreground" /></button>
          <Button onClick={openCreate}><Plus className="size-4" />新規作成</Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={Users}       iconColor="text-primary"      label="全スタッフ"     value={`${totalCount}名`} />
        <StatCard icon={CheckCircle} iconColor="text-green-500"    label="有効アカウント" value={`${activeCount}名`} />
        <StatCard icon={Clock}       iconColor="text-amber-500"    label="保留中"         value={`${inactiveCount}名`} />
      </div>

      {/* テーブル */}
      <div className="rounded-xl border border-border overflow-hidden mb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>ユーザー名</TableHead>
              <TableHead>表示名</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="text-muted-foreground">{u.id}</TableCell>
                <TableCell className="font-medium">{u.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <InitialAvatar name={u.displayName} />
                    {u.displayName}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                </TableCell>
                <TableCell><ActivePill active={u.isActive} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(u)}>編集</Button>
                    <Button size="sm" variant="ghost"
                      className={u.isActive ? "text-muted-foreground hover:text-destructive" : "text-primary"}
                      onClick={() => toggleActive(u)}>
                      {u.isActive ? "無効化" : "有効化"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length}件中 1-{filtered.length}件を表示
      </p>

      {/* 情報ボックス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-semibold text-blue-800 mb-2">ℹ️ アカウント権限について</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>ADMIN</strong>: 全機能へのアクセスが可能です。スタッフの追加・削除、システム設定、売上データの閲覧などが行えます。<br />
            <strong>STAFF</strong>: 予約の受付、座席状況の変更など、日々の運営に必要な基本機能が使えます。
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-800 mb-2">🔒 セキュリティ推奨事項</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            退職したスタッフのアカウントは速やかに「無効」に設定してください。定期的なパスワードの変更を推奨します。
          </p>
          <button className="mt-2 text-xs text-amber-700 underline">セキュリティ設定を確認する →</button>
        </div>
      </div>

      <Modal
        open={open}
        title={editingId ? "スタッフ編集" : "スタッフ新規作成"}
        confirmLabel={editingId ? "更新" : "作成"}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="grid gap-1.5">
            <Label htmlFor="username">ユーザー名</Label>
            <Input id="username" name="username" value={form.username} onChange={change} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="displayName">表示名</Label>
            <Input id="displayName" name="displayName" value={form.displayName} onChange={change} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="role">権限</Label>
            <select id="role" name="role" value={form.role} onChange={change}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      </Modal>
    </StaffLayout>
  );
}

function StatCard({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
      <div className={`p-2.5 rounded-lg bg-muted/60 ${iconColor}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function InitialAvatar({ name }) {
  const initial = name ? name.charAt(0) : "?";
  return (
    <span className="size-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 text-white"
      style={{ background: "var(--color-primary)" }}>
      {initial}
    </span>
  );
}

function ActivePill({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={
        active
          ? { background: "rgba(16,185,129,0.12)", color: "var(--status-occupied)" }
          : { background: "rgba(239,68,68,0.12)",  color: "var(--status-cancelled)" }
      }
    >
      <span className="size-1.5 rounded-full"
        style={{ background: active ? "var(--status-occupied)" : "var(--status-cancelled)" }} />
      {active ? "有効" : "無効"}
    </span>
  );
}
