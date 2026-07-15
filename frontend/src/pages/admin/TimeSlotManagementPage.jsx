// SC-A03 時間帯管理 / 権限: ADMIN
import { useEffect, useState } from "react";
import { Plus, Clock, CheckCircle, Info, GripVertical } from "lucide-react";
import StaffLayout from "../../components/StaffLayout";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getAdminTimeSlots, createTimeSlot, updateTimeSlot } from "../../api/mockApi";

const EMPTY = { slotLabel: "", description: "", startTime: "", endTime: "", displayOrder: 0 };

export default function TimeSlotManagementPage() {
  const [list, setList]   = useState([]);
  const [open, setOpen]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]   = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => { getAdminTimeSlots().then(setList); }, []);

  function openCreate() { setEditingId(null); setForm(EMPTY); setError(""); setOpen(true); }
  function openEdit(s)  {
    setEditingId(s.id);
    setForm({ slotLabel: s.slotLabel, description: s.description ?? "", startTime: s.startTime, endTime: s.endTime, displayOrder: s.displayOrder });
    setError("");
    setOpen(true);
  }
  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "displayOrder" ? Number(value) : value }));
  }

  async function handleConfirm() {
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      setError("終了時刻は開始時刻より後である必要があります");
      return;
    }
    if (editingId) {
      await updateTimeSlot(editingId, form);
      setList((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
    } else {
      const created = await createTimeSlot(form);
      setList((prev) => [...prev, created]);
    }
    setOpen(false);
  }

  async function toggleActive(s) {
    await updateTimeSlot(s.id, { isActive: !s.isActive });
    setList((prev) => prev.map((x) => (x.id === s.id ? { ...x, isActive: !x.isActive } : x)));
  }

  const sorted       = [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  const totalCount   = list.length;
  const activeCount  = list.filter((s) => s.isActive).length;

  return (
    <StaffLayout>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">時間帯管理</h1>
        <Button onClick={openCreate}><Plus className="size-4" />新規追加</Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={Clock}       iconColor="text-primary"   label="登録済み時間帯"   value={`${totalCount}件`} />
        <StatCard icon={CheckCircle} iconColor="text-green-500" label="稼働中のセッション" value={`${activeCount}件`} />
        <StatCard icon={Info}        iconColor="text-amber-500" label="予約受付状況"       value="通常通り" />
      </div>

      {/* テーブル */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-14">番号</TableHead>
              <TableHead>表示名</TableHead>
              <TableHead>開始時刻</TableHead>
              <TableHead>終了時刻</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground/40 cursor-grab">
                  <GripVertical className="size-4" />
                </TableCell>
                <TableCell className="text-muted-foreground">{s.displayOrder}</TableCell>
                <TableCell>
                  <p className="font-semibold text-sm">{s.slotLabel}</p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  )}
                </TableCell>
                <TableCell>{s.startTime}</TableCell>
                <TableCell>{s.endTime}</TableCell>
                <TableCell><ActivePill active={s.isActive} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(s)}>編集</Button>
                    <Button size="sm" variant="ghost"
                      className={s.isActive ? "text-muted-foreground hover:text-destructive" : "text-primary"}
                      onClick={() => toggleActive(s)}>
                      {s.isActive ? "停止" : "再開"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        ✓ 終了時刻は開始時刻より後である必要があります。並び替えはドラッグ＆ドロップで行えます。
      </p>

      <Modal
        open={open}
        title={editingId ? "時間帯編集" : "時間帯新規追加"}
        confirmLabel={editingId ? "更新" : "追加"}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="grid gap-1.5">
            <Label htmlFor="slotLabel">表示名</Label>
            <Input id="slotLabel" name="slotLabel" value={form.slotLabel} onChange={change}
              placeholder="第5部 23:00〜24:00" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">説明</Label>
            <Input id="description" name="description" value={form.description} onChange={change}
              placeholder="ディナー後半セッション" />
          </div>
          <div className="flex gap-3">
            <div className="grid gap-1.5 flex-1">
              <Label htmlFor="startTime">開始時刻</Label>
              <Input id="startTime" name="startTime" type="time" value={form.startTime} onChange={change} />
            </div>
            <div className="grid gap-1.5 flex-1">
              <Label htmlFor="endTime">終了時刻</Label>
              <Input id="endTime" name="endTime" type="time" value={form.endTime} onChange={change} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="displayOrder">表示順</Label>
            <Input id="displayOrder" name="displayOrder" type="number" value={form.displayOrder} onChange={change} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
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

function ActivePill({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={
        active
          ? { background: "rgba(16,185,129,0.12)", color: "var(--status-occupied)" }
          : { background: "rgba(107,114,128,0.12)", color: "var(--color-text-secondary)" }
      }
    >
      <span className="size-1.5 rounded-full"
        style={{ background: active ? "var(--status-occupied)" : "#9CA3AF" }} />
      {active ? "有効" : "停止"}
    </span>
  );
}
