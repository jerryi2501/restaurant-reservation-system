// SC-A02 テーブル管理 / 権限: ADMIN
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StaffLayout from "../../components/StaffLayout";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getAdminTables, createTable, updateTable } from "../../api/mockApi";

const ZONES = ["COUNTER", "TABLE_2", "TABLE_4", "TABLE_8"];
const CAPACITIES = [1, 2, 4, 8];
const EMPTY = { tableNumber: "", capacity: 4, zone: "TABLE_4" };

export default function TableManagementPage() {
  const [list, setList]   = useState([]);
  const [open, setOpen]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]   = useState(EMPTY);

  useEffect(() => { getAdminTables().then(setList); }, []);

  function openCreate() { setEditingId(null); setForm(EMPTY); setOpen(true); }
  function openEdit(t)  { setEditingId(t.id); setForm({ tableNumber: t.tableNumber, capacity: t.capacity, zone: t.zone }); setOpen(true); }
  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "capacity" ? Number(value) : value }));
  }

  async function handleConfirm() {
    if (editingId) {
      await updateTable(editingId, form);
      setList((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
    } else {
      const created = await createTable(form);
      setList((prev) => [...prev, created]);
    }
    setOpen(false);
  }

  async function toggleActive(t) {
    await updateTable(t.id, { isActive: !t.isActive });
    setList((prev) => prev.map((x) => (x.id === t.id ? { ...x, isActive: !x.isActive } : x)));
  }

  return (
    <StaffLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">テーブル管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">店舗の座席レイアウトとテーブルを管理します。</p>
        </div>
        <Button onClick={openCreate}><Plus className="size-4" />新規追加</Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden mb-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>テーブル番号</TableHead>
            <TableHead>収容人数</TableHead>
            <TableHead>ゾーン</TableHead>
            <TableHead>状態</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.tableNumber}</TableCell>
              <TableCell>{t.capacity}名</TableCell>
              <TableCell>{t.zone}</TableCell>
              <TableCell><ActivePill active={t.isActive} /></TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => openEdit(t)}>編集</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toggleActive(t)}>
                    {t.isActive ? "無効化" : "有効化"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        ℹ️ 収容人数は 1 / 2 / 4 / 8 名、ゾーンは COUNTER / TABLE_2 / TABLE_4 / TABLE_8 から設定可能です。
        無効に設定されたテーブルは予約・配席システムの選択肢から除外されます。
      </p>

      <Modal
        open={open}
        title={editingId ? "テーブル編集" : "テーブル新規追加"}
        confirmLabel={editingId ? "更新" : "追加"}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="grid gap-1.5">
            <Label htmlFor="tableNumber">テーブル番号</Label>
            <Input id="tableNumber" name="tableNumber" value={form.tableNumber} onChange={change} placeholder="B13" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="capacity">収容人数</Label>
            <select id="capacity" name="capacity" value={form.capacity} onChange={change}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              {CAPACITIES.map((c) => <option key={c} value={c}>{c}名</option>)}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="zone">ゾーン</Label>
            <select id="zone" name="zone" value={form.zone} onChange={change}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </StaffLayout>
  );
}

function ActivePill({ active }) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={
        active
          ? { background: "rgba(16,185,129,0.15)", color: "var(--status-occupied)" }
          : { background: "rgba(239,68,68,0.15)", color: "var(--status-cancelled)" }
      }
    >
      {active ? "有効" : "無効"}
    </span>
  );
}
