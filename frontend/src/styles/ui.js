// 各画面で使い回す共通スタイル（インラインstyle用オブジェクト）
// 色は index.css の CSS変数（var(--color-*) / var(--status-*)）を参照。

export const ui = {
  // 中央寄せの単一カラム用コンテナ（C02〜C06で使用）
  narrow: { maxWidth: 520, margin: "0 auto" },

  card: {
    background: "var(--color-bg)", border: "1px solid var(--color-border)",
    borderRadius: "var(--radius)", padding: "28px 32px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },
  h1: { fontSize: 28, fontWeight: 700, margin: "0 0 8px", color: "var(--color-text)" },
  cardTitle: { margin: "0 0 24px", fontSize: 17, fontWeight: 600 },

  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" },
  input: {
    height: 44, padding: "0 12px", border: "1px solid var(--color-border)",
    borderRadius: "var(--radius)", fontSize: 15, color: "var(--color-text)",
    background: "#fff", width: "100%", boxSizing: "border-box", outline: "none",
  },
  textarea: {
    minHeight: 88, padding: "10px 12px", border: "1px solid var(--color-border)",
    borderRadius: "var(--radius)", fontSize: 15, color: "var(--color-text)",
    background: "#fff", width: "100%", boxSizing: "border-box", outline: "none",
    resize: "vertical", fontFamily: "inherit",
  },

  primaryBtn: {
    height: 48, background: "var(--color-primary)", color: "#fff", border: "none",
    borderRadius: "var(--radius)", fontSize: 16, fontWeight: 600, cursor: "pointer", width: "100%",
  },
  ghostBtn: {
    height: 48, background: "transparent", color: "var(--color-primary)",
    border: "1px solid var(--color-primary)", borderRadius: "var(--radius)",
    fontSize: 15, cursor: "pointer", padding: "0 20px",
  },
  rowBtns: { display: "flex", gap: 12, marginTop: 8 },
  note: { margin: "12px 0 0", fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" },

  // 確認画面などのラベル＝値の行
  summaryRow: {
    display: "flex", justifyContent: "space-between", gap: 16,
    padding: "10px 0", borderBottom: "1px solid var(--color-border)", fontSize: 14,
  },
  summaryLabel: { color: "var(--color-text-secondary)" },
};

// 予約ステータスのピル色（一覧・確認で使用）
export const STATUS_STYLE = {
  CONFIRMED: { background: "#E6F1FB", color: "#0C447C", label: "確定" },
  PENDING:   { background: "#FAEEDA", color: "#854F0B", label: "承認待ち" },
  COMPLETED: { background: "#F1EFE8", color: "#444441", label: "完了" },
  CANCELLED: { background: "#FCEBEB", color: "#A32D2D", label: "取消" },
  NO_SHOW:   { background: "#FCEBEB", color: "#A32D2D", label: "無断" },
};
