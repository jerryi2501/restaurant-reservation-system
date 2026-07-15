// マイページ共通レイアウト：ヘッダー + サイドナビ + 内容 + フッター
// 使い方: <AccountLayout> ...ページ内容... </AccountLayout>
import { NavLink, useNavigate } from "react-router-dom";
import { User, CalendarCheck, Coins, LogOut } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "../store";

const NAV = [
  { to: "/mypage",              label: "プロフィール",   icon: User,          end: true },
  { to: "/mypage/reservations", label: "予約一覧",       icon: CalendarCheck },
  { to: "/mypage/points",       label: "ポイント履歴",   icon: Coins },
];

export default function AccountLayout({ children }) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();                       // Zustand のログイン状態をクリア
    localStorage.removeItem("token");  // JWT も削除
    navigate("/");
    // TODO [BACKEND] POST /api/customer/auth/logout（サーバー側の無効化が必要なら）
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8 md:flex-row md:gap-10">
        {/* サイドナビ */}
        <aside className="md:w-56 shrink-0">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                // 文字色は inline で指定（index.css の `a{color}` に勝たせるため）
                style={({ isActive }) => ({
                  color: isActive ? "#fff" : "var(--color-text-secondary)",
                })}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? "bg-primary" : "hover:bg-muted"
                  }`
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left text-muted-foreground hover:bg-muted"
            >
              <LogOut className="size-4" />
              ログアウト
            </button>
          </nav>
        </aside>

        {/* ページ本体 */}
        <section className="flex-1 min-w-0">{children}</section>
      </main>

      <Footer />
    </div>
  );
}
