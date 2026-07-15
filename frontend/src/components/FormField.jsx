// ラベル + 入力スロットのラッパー。input / textarea / select を children に渡す。
// props: label(文字列), htmlFor(input の id と一致), error(エラーメッセージ文字列)
export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div style={s.wrap}>
      {label && <label htmlFor={htmlFor} style={s.label}>{label}</label>}
      {children}
      {error && <span style={s.error}>{error}</span>}
    </div>
  );
}

const s = {
  wrap:  { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" },
  error: { fontSize: 12, color: "var(--status-cancelled)" },
};
