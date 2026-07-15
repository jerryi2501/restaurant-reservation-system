// SC-C10 予約一覧（マイ予約）/ 権限: CUSTOMER
import { useEffect, useState } from "react";
import AccountLayout from "../../components/AccountLayout";
import StatusBadge from "../../components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getMyReservations, cancelReservation } from "../../api/mockApi";

// キャンセル可能なステータス（API設計書: CONFIRMED / PENDING のみ）
const CANCELABLE = ["CONFIRMED", "PENDING"];

export default function MyReservationsPage() {
  const [list, setList]       = useState([]);
  const [filter, setFilter]   = useState("ALL");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getMyReservations().then((d) => {
      setList(d);
      setLoading(false);
    });
  }
  useEffect(load, []);

  async function handleCancel(id) {
    if (!window.confirm("この予約をキャンセルしますか？")) return;
    await cancelReservation(id); // TODO [BACKEND] は mockApi 内
    load();                       // 一覧を再取得
  }

  const shown = filter === "ALL" ? list : list.filter((r) => r.status === filter);

  return (
    <AccountLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">予約一覧</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="ALL">すべて</option>
          <option value="CONFIRMED">確定</option>
          <option value="PENDING">承認待ち</option>
          <option value="COMPLETED">完了</option>
          <option value="CANCELLED">取消</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">読み込み中…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>予約番号</TableHead>
              <TableHead>日付</TableHead>
              <TableHead>時間帯</TableHead>
              <TableHead>人数</TableHead>
              <TableHead>席</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r) => (
              <TableRow key={r.reservationId}>
                <TableCell className="font-medium">#{r.reservationId}</TableCell>
                <TableCell>{r.reservationDate}</TableCell>
                <TableCell>{r.timeSlotLabel}</TableCell>
                <TableCell>{r.partySize}名</TableCell>
                <TableCell>{r.tables.join(", ")}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-right">
                  {CANCELABLE.includes(r.status) ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleCancel(r.reservationId)}
                    >
                      キャンセル
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AccountLayout>
  );
}
