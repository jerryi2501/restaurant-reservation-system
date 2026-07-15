// 全画面共通のフッター
import { Link } from "react-router-dom";

const NAV_ITEMS = ["店舗案内", "アクセス", "よくある質問"];

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <span style={s.logo}>Bistro Lumière</span>
        <div style={s.links}>
          <Link to="/" style={s.link}>ご予約</Link>
          {NAV_ITEMS.map(item => <span key={item} style={s.link}>{item}</span>)}
        </div>
        <span style={s.copy}>© 2026 Bistro Lumière</span>
      </div>
    </footer>
  );
}

const s = {
  footer: { background: "var(--color-bg)", borderTop: "1px solid var(--color-border)" },
  inner: {
    maxWidth: 1080, margin: "0 auto", width: "100%", boxSizing: "border-box",
    padding: "20px 24px", display: "flex", alignItems: "center",
    justifyContent: "space-between", flexWrap: "wrap", gap: 12,
  },
  logo: { color: "var(--color-primary)", fontWeight: 600, fontSize: 15 },
  links: { display: "flex", gap: 16 },
  link: { color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 13, cursor: "pointer" },
  copy: { fontSize: 12, color: "var(--color-text-secondary)" },
};
