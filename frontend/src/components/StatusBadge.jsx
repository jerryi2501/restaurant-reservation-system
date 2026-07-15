import { memo } from "react";
import { STATUS_STYLE } from "../styles/ui";

// 予約ステータスの色付きpill。status は STATUS_STYLE のキーと一致する文字列。
const StatusBadge = memo(function StatusBadge({ status }) {
  const cfg = STATUS_STYLE[status] ?? { background: "#E5E7EB", color: "#6B7280", label: status };
  return (
    <span style={{ ...s.base, background: cfg.background, color: cfg.color }}>
      {cfg.label}
    </span>
  );
});

export default StatusBadge;

const s = {
  base: {
    display: "inline-block", padding: "2px 10px",
    borderRadius: 999, fontSize: 12, fontWeight: 600,
    whiteSpace: "nowrap",
  },
};
