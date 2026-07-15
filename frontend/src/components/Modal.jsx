import { useEffect } from "react";

// 汎用確認ダイアログ。open=false の間はDOMに出ない。
// props: open, title, onConfirm, onCancel, confirmLabel, cancelLabel, children
export default function Modal({
  open,
  title,
  onConfirm,
  onCancel,
  confirmLabel = "確認",
  cancelLabel  = "キャンセル",
  children,
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.dialog} onClick={(e) => e.stopPropagation()}>
        {title && <h3 style={s.title}>{title}</h3>}
        <div style={s.body}>{children}</div>
        <div style={s.btns}>
          <button type="button" style={s.cancel}  onClick={onCancel}>{cancelLabel}</button>
          <button type="button" style={s.confirm} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  dialog: {
    background: "var(--color-bg)", borderRadius: "var(--radius)",
    padding: "28px 32px", minWidth: 320, maxWidth: 440, width: "100%",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  },
  title:   { margin: "0 0 12px", fontSize: 17, fontWeight: 700, color: "var(--color-text)" },
  body:    { fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24, lineHeight: 1.6 },
  btns:    { display: "flex", gap: 12, justifyContent: "flex-end" },
  cancel: {
    height: 40, padding: "0 20px", background: "transparent",
    border: "1px solid var(--color-border)", borderRadius: "var(--radius)",
    fontSize: 14, cursor: "pointer", color: "var(--color-text)", fontFamily: "inherit",
  },
  confirm: {
    height: 40, padding: "0 20px", background: "var(--color-primary)",
    border: "none", borderRadius: "var(--radius)",
    fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#fff", fontFamily: "inherit",
  },
};
