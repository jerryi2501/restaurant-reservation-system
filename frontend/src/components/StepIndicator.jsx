import { memo, Fragment } from "react";

const STEPS = ["予約開始", "席選択", "情報入力", "確認", "完了"];

// current: 0始まりのインデックス（C01=0, C02=1, C03=2, C04=3, C05/C06=4）
const StepIndicator = memo(function StepIndicator({ current }) {
  return (
    <div style={s.wrap}>
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <Fragment key={label}>
            <div style={s.item}>
              <div style={{
                ...s.dot,
                background: done || active ? "var(--color-primary)" : "var(--color-border)",
                color:      done || active ? "#fff" : "var(--color-text-secondary)",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                ...s.label,
                color:      active ? "var(--color-primary)" : done ? "var(--color-text)" : "var(--color-text-secondary)",
                fontWeight: active ? 600 : 400,
              }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                ...s.line,
                background: done ? "var(--color-primary)" : "var(--color-border)",
              }} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
});

export default StepIndicator;

const s = {
  wrap:  { display: "flex", alignItems: "flex-start", marginBottom: 24 },
  item:  { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 },
  dot: {
    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700,
  },
  label: { fontSize: 11, marginTop: 4, textAlign: "center", lineHeight: 1.3 },
  line:  { flex: 1, height: 2, marginTop: 13, flexShrink: 0 },
};
