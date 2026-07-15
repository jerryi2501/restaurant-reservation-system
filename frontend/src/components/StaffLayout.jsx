// スタッフ/管理画面の共通レイアウト：ネイビーのサイドバー + 本体
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, Grid3x3, Users, Armchair, Clock, LogOut } from "lucide-react";
import { useAuthStore } from "../store";

const NAV = [
  { to: "/staff",              label: "ダッシュボード", icon: LayoutDashboard, end: true },
  { to: "/staff/reservations", label: "予約管理",       icon: CalendarCheck },
  { to: "/staff/tables",       label: "テーブル状態",   icon: Grid3x3 },
];

const ADMIN_NAV = [
  { to: "/admin/users",      label: "スタッフ管理", icon: Users },
  { to: "/admin/tables",     label: "テーブル管理", icon: Armchair },
  { to: "/admin/time-slots", label: "時間帯管理",   icon: Clock },
];

// サイドバーのリンク1個（色は inline で指定して index.css の a{color} に勝たせる）
function SideLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({ color: isActive ? "#fff" : "rgba(255,255,255,0.8)" })}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          isActive ? "bg-white/15 font-medium" : "hover:bg-white/10"
        }`
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  );
}

export default function StaffLayout({ children }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    localStorage.removeItem("token");
    navigate("/staff/login");
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-secondary)]">
      {/* サイドバー（ネイビー） */}
      <aside className="w-56 shrink-0 bg-primary flex flex-col">
        <div className="px-5 h-16 flex items-center font-bold text-lg border-b border-white/15" style={{ color: "#fff" }}>
          管理システム
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map((item) => <SideLink key={item.to} {...item} />)}

          {/* 管理者メニュー（TODO [AUTH]: 本番は role === "ADMIN" のときのみ表示） */}
          <p className="px-3 pt-4 pb-1 text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>
            管理者メニュー
          </p>
          {ADMIN_NAV.map((item) => <SideLink key={item.to} {...item} />)}
        </nav>

        <div className="p-3 border-t border-white/15">
          <p className="px-3 text-sm mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            {user?.name ?? "スタッフ"}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <LogOut className="size-4" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* 本体 */}
      <main className="flex-1 min-w-0 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
