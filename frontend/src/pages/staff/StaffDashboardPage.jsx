// SC-S02 スタッフダッシュボード（リアルタイム）+ SC-S03 承認/拒否モーダル
// 権限: STAFF / ADMIN
import { useEffect, useState } from "react";
import {
  Bell, Armchair, CalendarCheck, Users, TrendingUp,
  Plus, Printer, LayoutGrid, Settings,
} from "lucide-react";
import StaffLayout from "../../components/StaffLayout";
import StatusBadge from "../../components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  getPendingReservations, getDashboardStats,
  approveReservation, rejectReservation, getTodayReservations,
} from "../../api/mockApi";

export default function StaffDashboardPage() {
  const [pending, setPending]   = useState([]);
  const [stats, setStats]       = useState(null);
  const [todayRes, setTodayRes] = useState([]);
  const [modal, setModal]       = useState({ open: false, target: null });

  function load() {
    getPendingReservations().then(setPending);
    getDashboardStats().then(setStats);
    getTodayReservations().then(setTodayRes);
  }
  useEffect(load, []);

  // TODO [WS] /topic/staff/pending → setPending(prev => [新規, ...prev])
  // TODO [WS] /topic/tables       → stats 再計算

  function openModal(target) { setModal({ open: true, target }); }
  function closeModal()       { setModal({ open: false, target: null }); }

  async function handleApprove() {
    await approveReservation(modal.target.reservationId);
    setPending((prev) => prev.filter((r) => r.reservationId !== modal.target.reservationId));
    closeModal();
  }
  async function handleReject() {
    await rejectReservation(modal.target.reservationId);
    setPending((prev) => prev.filter((r) => r.reservationId !== modal.target.reservationId));
    closeModal();
  }

  return (
    <StaffLayout>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
            リアルタイム更新中
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell className="size-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--status-pending)" }}
          >
            承認待ち {pending.length}件
          </button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="空席"       value={stats?.available}                         icon={Armchair} />
        <StatCard label="予約"       value={stats?.reserved}  color="var(--status-reserved)"  icon={CalendarCheck} />
        <StatCard label="利用中"     value={stats?.occupied}  color="var(--status-occupied)"  icon={Users} />
        <StatCard label="本日満席率" value={stats ? `${stats.occupancyRate}%` : undefined}   icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 承認待ちリクエスト（リアルタイム） */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">承認待ちリクエスト（リアルタイム）</h2>
            <a href="/staff/reservations" className="text-sm text-primary hover:underline">すべて見る</a>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map((r) => (
              <Card key={r.reservationId} className="border-l-4 shadow-none"
                style={{ borderLeftColor: "var(--status-pending)" }}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-semibold">
                      #{r.reservationId} {r.customerName} 様
                      <span className="font-normal text-muted-foreground"> ／ {r.partySize}名</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      🕐 {r.timeSlotLabel}
                      <Countdown expiresAt={r.expiresAt} />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="h-8 px-4 rounded-md text-sm font-medium text-white"
                      style={{ background: "var(--status-occupied)" }}
                      onClick={() => openModal(r)}
                    >
                      承認
                    </button>
                    <button
                      className="h-8 px-4 rounded-md text-sm font-medium border"
                      style={{ borderColor: "var(--status-cancelled)", color: "var(--status-cancelled)" }}
                      onClick={() => openModal(r)}
                    >
                      拒否
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pending.length === 0 && (
              <p className="text-muted-foreground text-sm py-4">承認待ちのリクエストはありません。</p>
            )}
          </div>
        </div>

        {/* クイックアクション + 集客予測 */}
        <div>
          <h2 className="text-base font-semibold mb-3">クイックアクション</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "新規予約",     icon: Plus },
              { label: "リスト印刷",   icon: Printer },
              { label: "配席管理",     icon: LayoutGrid },
              { label: "システム設定", icon: Settings },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-xs font-medium hover:bg-muted transition"
              >
                <Icon className="size-5 text-primary" />
                {label}
              </button>
            ))}
          </div>

          {/* 今週の集客予測 */}
          <div className="rounded-xl p-4 text-white" style={{ background: "var(--color-primary)" }}>
            <p className="text-xs opacity-70 mb-1">今週の集客予測</p>
            <p className="text-2xl font-bold">
              前週比 <span style={{ color: "#86efac" }}>+12%</span>
            </p>
            <div className="mt-3 flex gap-1 items-end h-8">
              {[4, 6, 5, 7, 8, 9, 7].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{ height: `${h * 4}px`, background: "rgba(255,255,255,0.3)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 本日の予約状況 */}
      <div>
        <h2 className="text-base font-semibold mb-3">本日の予約状況</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>予約時間</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead>人数</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayRes.map((r) => (
                <TableRow key={r.reservationId}>
                  <TableCell className="font-medium">{r.time}</TableCell>
                  <TableCell>{r.customerName} 様</TableCell>
                  <TableCell>{r.partySize}名</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* SC-S03 予約リクエスト確認モーダル */}
      {modal.open && modal.target && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">予約リクエストの確認</h3>
              <button
                onClick={closeModal}
                className="text-2xl leading-none text-muted-foreground hover:text-foreground w-7 h-7 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5"
              style={{ background: "rgba(245,158,11,0.15)", color: "var(--status-pending)" }}
            >
              ⏰ 承認待ち
            </span>

            <div className="space-y-4 mb-6 text-sm">
              <ModalRow label="お客様">
                <p className="text-xl font-bold mt-0.5">{modal.target.customerName} 様</p>
              </ModalRow>
              <ModalRow label="電話番号">
                <p>{modal.target.customerPhone}</p>
              </ModalRow>
              <ModalRow label="日時">
                <p>2026/07/01 {modal.target.timeSlotLabel}</p>
              </ModalRow>
              <div className="flex gap-8">
                <ModalRow label="人数">
                  <p className="text-lg font-bold mt-0.5">{modal.target.partySize}名</p>
                </ModalRow>
                <ModalRow label="割り当て席">
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {modal.target.tables.map((t) => (
                      <span key={t}
                        className="px-2.5 py-0.5 rounded-md bg-muted text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </ModalRow>
              </div>
              <ModalRow label="承認期限">
                <Countdown expiresAt={modal.target.expiresAt} large />
              </ModalRow>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 h-11 rounded-xl text-sm font-semibold border-2 transition hover:opacity-80"
                style={{ borderColor: "var(--status-cancelled)", color: "var(--status-cancelled)" }}
              >
                拒否する
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "var(--color-primary)" }}
              >
                承認する
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              承認すると顧客に確定通知が送信されます。
            </p>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="rounded-xl bg-background border border-border p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1" style={color ? { color } : undefined}>
          {value ?? "—"}
        </p>
      </div>
      {Icon && <Icon className="size-9 opacity-15" />}
    </div>
  );
}

function ModalRow({ label, children }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Countdown({ expiresAt, large }) {
  const calc = () => Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  const [sec, setSec] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setSec(calc()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-semibold ${large ? "text-base mt-1" : "text-xs ml-1"}`}
      style={{ background: "rgba(245,158,11,0.15)", color: "var(--status-pending)" }}
    >
      残り {mm}:{ss}
    </span>
  );
}
