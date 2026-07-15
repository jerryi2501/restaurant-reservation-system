// SC-S04 予約管理 / 権限: STAFF / ADMIN
import { useEffect, useState } from "react";
import { Search, Bell, HelpCircle, Plus } from "lucide-react";
import StaffLayout from "../../components/StaffLayout";
import StatusBadge from "../../components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getStaffReservations, updateReservationStatus, fetchTimeSlots } from "../../api/mockApi";

const ITEMS_PER_PAGE = 4;

function actionsFor(status) {
  if (status === "CONFIRMED") return [
    { label: "キャンセル", next: "CANCELLED", variant: "link" },
    { label: "来店",       next: "OCCUPIED",  variant: "success" },
  ];
  if (status === "OCCUPIED") return [
    { label: "会計", next: "COMPLETED", variant: "primary" },
  ];
  if (status === "PENDING") return [
    { label: "拒否", next: "CANCELLED", variant: "danger" },
    { label: "承認", next: "CONFIRMED", variant: "success" },
  ];
  return [];
}

export default function ReservationManagementPage() {
  const [list, setList]       = useState([]);
  const [slots, setSlots]     = useState([]);
  const [filter, setFilter]   = useState({ date: "2026-07-01", slotId: "", status: "ALL" });
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  function load() {
    setLoading(true);
    Promise.all([getStaffReservations(), fetchTimeSlots()]).then(([res, s]) => {
      setList(res);
      setSlots(s);
      setLoading(false);
    });
  }
  useEffect(load, []);

  async function handleAction(id, next) {
    await updateReservationStatus(id, next);
    setList((prev) => prev.map((r) => (r.reservationId === id ? { ...r, status: next } : r)));
  }

  const shown = list.filter((r) => filter.status === "ALL" || r.status === filter.status);
  const total = Math.max(1, Math.ceil(shown.length / ITEMS_PER_PAGE));
  const paged = shown.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <StaffLayout>
      {/* ページヘッダー */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">予約管理</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text" placeholder="キーワードで検索"
              className="h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm w-52"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">通知</button>
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">ヘルプ</button>
          <Button size="sm" className="gap-1">
            <Plus className="size-4" />予約作成
          </Button>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap items-end gap-3 mb-5 p-4 rounded-xl border border-border bg-muted/30">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">日付</label>
          <input type="date" value={filter.date}
            onChange={(e) => setFilter((p) => ({ ...p, date: e.target.value }))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">時間帯</label>
          <select value={filter.slotId}
            onChange={(e) => setFilter((p) => ({ ...p, slotId: e.target.value }))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">第{filter.slotId || 3}部 •</option>
            {slots.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">ステータス</label>
          <select value={filter.status}
            onChange={(e) => { setFilter((p) => ({ ...p, status: e.target.value })); setPage(1); }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="ALL">すべて •</option>
            <option value="CONFIRMED">確定</option>
            <option value="PENDING">承認待ち</option>
            <option value="OCCUPIED">利用中</option>
            <option value="COMPLETED">完了</option>
            <option value="NO_SHOW">無断</option>
            <option value="CANCELLED">取消</option>
          </select>
        </div>
        <Button size="sm" className="gap-1 self-end">
          <Search className="size-4" />検索
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">読み込み中…</p>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">NO.</TableHead>
                  <TableHead>予約者名</TableHead>
                  <TableHead>人数</TableHead>
                  <TableHead>テーブル</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((r) => {
                  const actions = actionsFor(r.status);
                  return (
                    <TableRow key={r.reservationId}>
                      <TableCell className="text-muted-foreground text-sm">#{r.reservationId}</TableCell>
                      <TableCell className="font-semibold">{r.customerName}</TableCell>
                      <TableCell>{r.partySize}名</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {r.tables.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-muted text-xs font-medium">{t}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {actions.length === 0 ? (
                            <span className="text-xs text-muted-foreground">操作不可</span>
                          ) : (
                            actions.map((a) => (
                              <ActionBtn key={a.label} {...a}
                                onClick={() => handleAction(r.reservationId, a.next)} />
                            ))
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ページネーション */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              className="px-3 py-1.5 text-sm text-muted-foreground disabled:opacity-40 hover:text-foreground"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹ 前へ
            </button>
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`size-8 rounded-md text-sm font-medium transition ${
                  n === page
                    ? "text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                style={n === page ? { background: "var(--color-primary)" } : undefined}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="px-3 py-1.5 text-sm text-muted-foreground disabled:opacity-40 hover:text-foreground"
              disabled={page === total}
              onClick={() => setPage((p) => p + 1)}
            >
              次へ ›
            </button>
          </div>
        </>
      )}
    </StaffLayout>
  );
}

function ActionBtn({ label, variant, onClick }) {
  const base = "h-7 px-3 rounded-md text-xs font-semibold transition";
  if (variant === "link") {
    return (
      <button onClick={onClick} className="text-xs text-muted-foreground hover:text-destructive">
        {label}
      </button>
    );
  }
  if (variant === "success") {
    return (
      <button onClick={onClick} className={base + " text-white"}
        style={{ background: "var(--status-occupied)" }}>
        {label}
      </button>
    );
  }
  if (variant === "danger") {
    return (
      <button onClick={onClick} className={base + " border-2"}
        style={{ borderColor: "var(--status-cancelled)", color: "var(--status-cancelled)" }}>
        {label}
      </button>
    );
  }
  // primary = navy
  return (
    <button onClick={onClick} className={base + " text-white"}
      style={{ background: "var(--color-primary)" }}>
      {label}
    </button>
  );
}
