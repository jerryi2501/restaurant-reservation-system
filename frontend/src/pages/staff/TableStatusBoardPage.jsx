// SC-S05 テーブル状態ボード（リアルタイムフロアマップ）/ 権限: STAFF / ADMIN
import { useEffect, useState } from "react";
import StaffLayout from "../../components/StaffLayout";
import TableCard from "../../components/TableCard";
import { getTables, fetchTimeSlots } from "../../api/mockApi";

const ZONES = [
  { key: "COUNTER", label: "カウンター席", range: "C01-C06", category: "Small / 1 Person" },
  { key: "TABLE_2", label: "2人用席",       range: "A01-A06", category: "Standard" },
  { key: "TABLE_4", label: "4人用席",       range: "B01-B06", category: "Family / Groups" },
  { key: "TABLE_8", label: "8人用席",       range: "D01-D06", category: "Large Party / VIP" },
];

const LEGEND = [
  { label: "空席（AVAILABLE）",    color: "var(--status-available)", border: "1px solid #bbb" },
  { label: "予約済み（RESERVED）", color: "var(--status-reserved)" },
  { label: "承認待ち（PENDING）",  color: "var(--status-pending)" },
  { label: "利用中（OCCUPIED）",   color: "var(--status-occupied)" },
];

export default function TableStatusBoardPage() {
  const [tables, setTables] = useState([]);
  const [slots, setSlots]   = useState([]);
  const [slotId, setSlotId] = useState("");

  useEffect(() => {
    getTables().then(setTables);
    fetchTimeSlots().then((s) => {
      setSlots(s);
      setSlotId(String(s[2]?.id ?? ""));
    });
  }, []);

  // TODO [WS] /topic/tables を購読 → 受信した tableId の status を更新（再読込なし）
  //   setTables(prev => prev.map(t => t.tableId === msg.tableId ? { ...t, status: msg.status } : t));

  const byZone = (key) => tables.filter((t) => t.zone === key);

  return (
    <StaffLayout>
      {/* ページヘッダー */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">テーブル状態</h1>
        <div className="flex items-center gap-2">
          <input type="date" defaultValue="2026-07-01"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <select value={slotId} onChange={(e) => setSlotId(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {slots.map((s) => <option key={s.id} value={String(s.id)}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex flex-wrap gap-5 mb-6 text-sm text-muted-foreground">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-2">
            <span className="inline-block size-3 rounded"
              style={{ background: l.color, border: l.border ?? "none" }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* カウンター席 */}
      <ZoneSection zone={ZONES[0]} tables={byZone("COUNTER")} className="mb-6" />

      {/* 2人用 + 4人用 横並び */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ZoneSection zone={ZONES[1]} tables={byZone("TABLE_2")} />
        <ZoneSection zone={ZONES[2]} tables={byZone("TABLE_4")} />
      </div>

      {/* 8人用席 */}
      <ZoneSection zone={ZONES[3]} tables={byZone("TABLE_8")} />
    </StaffLayout>
  );
}

function ZoneSection({ zone, tables, className = "" }) {
  if (tables.length === 0) return null;
  return (
    <section className={className}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-5 rounded-full shrink-0" style={{ background: "var(--color-primary)" }} />
        <h2 className="text-sm font-semibold">
          {zone.label}
          <span className="font-normal text-muted-foreground"> ({zone.range})</span>
        </h2>
        <span className="text-xs text-muted-foreground">{zone.category}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {tables.map((t) => (
          <TableCard
            key={t.tableId}
            id={t.tableId}
            status={t.status}
            capacity={t.capacity}
            label={t.tableNumber}
          />
        ))}
      </div>
    </section>
  );
}
