import { memo } from "react";
import { ui } from "../styles/ui";

// 確認画面などの「ラベル : 値」行。ui.summaryRow スタイルを共有。
const SummaryRow = memo(function SummaryRow({ label, value }) {
  return (
    <div style={ui.summaryRow}>
      <span style={ui.summaryLabel}>{label}</span>
      <span style={{ textAlign: "right" }}>{value}</span>
    </div>
  );
});

export default SummaryRow;
