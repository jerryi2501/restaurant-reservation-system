import { memo } from "react";

// CSS変数から色を引く（index.css の --status-* と対応）
const STATUS = {
  AVAILABLE: { bg: "var(--status-available)", color: "#333",  label: "空席" },
  RESERVED:  { bg: "var(--status-reserved)",  color: "#fff",  label: "予約済み" },
  PENDING:   { bg: "var(--status-pending)",   color: "#fff",  label: "承認待ち" },
  OCCUPIED:  { bg: "var(--status-occupied)",  color: "#fff",  label: "利用中" },
  CANCELLED: { bg: "var(--status-cancelled)", color: "#fff",  label: "取消" },
};

// props: id, status("AVAILABLE"|…), capacity(席数), label(表示名), onClick
const TableCard = memo(function TableCard({ id, status = "AVAILABLE", capacity, label, onClick }) {
  const cs = STATUS[status] ?? STATUS.AVAILABLE;
  return (
    <button type="button" onClick={onClick}
      style={{ ...s.card, background: cs.bg, color: cs.color }}>
      <span style={s.name}>{label ?? `T${id}`}</span>
      <span style={s.cap}>{capacity}席</span>
      <span style={s.status}>{cs.label}</span>
    </button>
  );
});

export default TableCard;

const s = {
  card: {
    width: 100, height: 100, borderRadius: "var(--radius)",
    border: "none", cursor: "pointer", padding: 8,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 4,
    fontFamily: "inherit", transition: "opacity 0.15s",
  },
  name:   { fontSize: 16, fontWeight: 700 },
  cap:    { fontSize: 12 },
  status: { fontSize: 11, fontWeight: 500 },
};
