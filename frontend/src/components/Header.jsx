// 全画面共通のグローバルナビ
// props: active — 現在ページに対応するメニュー（"reserve" のとき「ご予約」を強調）
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { key: "about",  label: "店舗案内",     to: "/about" },
  { key: "access", label: "アクセス",     to: "/access" },
  { key: "faq",    label: "よくある質問", to: "/faq" },
];

export default function Header({ active }) {
  return (
    <header style={s.header}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>Bistro Lumière</Link>

        <nav style={s.nav}>
          <Link to="/" style={{ ...s.link, ...(active === "reserve" ? s.active : null) }}>ご予約</Link>
          {/* 各ページは準備中（ComingSoonPage）へ遷移 */}
          {NAV_ITEMS.map(({ key, label, to }) => (
            <Link key={key} to={to} style={{ ...s.link, ...(active === key ? s.active : null) }}>{label}</Link>
          ))}
        </nav>

        {/* TODO [AUTH]: ログイン済みなら「ログイン/新規登録」→「マイページ/ログアウト」に切替 */}
        <div style={s.right}>
          <Link to="/login" style={s.loginLink}>ログイン</Link>
          <Link to="/register" style={s.registerBtn}>新規登録</Link>
        </div>
      </div>
    </header>
  );
}

const s = {
  header: { background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" },
  inner: {
    maxWidth: 1080, margin: "0 auto", width: "100%", boxSizing: "border-box",
    padding: "0 24px", height: 64, display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: 24,
  },
  logo: { color: "var(--color-primary)", fontWeight: 700, fontSize: 20, textDecoration: "none" },
  nav: { display: "flex", gap: 28, flex: 1 },
  link: { color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, cursor: "pointer" },
  active: { color: "var(--color-primary)", fontWeight: 600 },
  right: { display: "flex", alignItems: "center", gap: 16 },
  loginLink: { color: "var(--color-text)", textDecoration: "none", fontSize: 14 },
  registerBtn: {
    border: "1px solid var(--color-primary)", color: "var(--color-primary)", background: "transparent",
    borderRadius: "var(--radius)", padding: "8px 16px", fontSize: 14, textDecoration: "none",
  },
};
