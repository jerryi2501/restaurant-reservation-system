// ログイン必須ページのガード。未ログインなら login 画面へリダイレクトする。
// 使い方: <ProtectedRoute><ProfilePage /></ProtectedRoute>
//   redirectTo でスタッフ用ログインなどに切り替え可能。
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    // ログイン後に元のページへ戻れるよう from を渡す
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }
  return children;
}
