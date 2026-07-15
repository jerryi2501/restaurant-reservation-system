export default function LoadingSpinner({ size = 32, label = "読み込み中…" }) {
  return (
    <div style={s.wrap}>
      <div style={{ ...s.ring, width: size, height: size, borderWidth: Math.max(2, size / 8) }} />
      {label && <p style={s.label}>{label}</p>}
    </div>
  );
}

const s = {
  wrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: 48,
  },
  ring: {
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "var(--color-border)",
    borderTopColor: "var(--color-primary)",
    animation: "spin 0.8s linear infinite",
  },
  label: { marginTop: 12, fontSize: 13, color: "var(--color-text-secondary)" },
};
