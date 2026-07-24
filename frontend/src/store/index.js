import { create } from "zustand";

// 認証状態（ログインユーザー情報）
// ※ 認証トークンはバックエンドが HttpOnly Cookie（access_token）で管理するため、
//   フロントからは読めない／保持しない。ここでは表示用の user 情報だけ持つ。
//   リロード後も UI を保つため user は localStorage に退避する（認証自体は Cookie 側）。
// role: "GUEST" | "CUSTOMER" | "STAFF" | "ADMIN"
const savedUser = (() => {
  try { return JSON.parse(localStorage.getItem("authUser")); } catch { return null; }
})();

export const useAuthStore = create((set) => ({
  user: savedUser,
  setAuth: (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    set({ user });
  },
  clearAuth: () => {
    localStorage.removeItem("authUser");
    set({ user: null });
  },
}));

// 予約フロー中の一時データ（C01→C04を跨ぐ state の代替）
// navigate state との併用も可。store にも持たせておくと直URLアクセス時に復元しやすい。
export const useReservationStore = create((set) => ({
  draft:      null,  // { query, selected, customer }
  setDraft:   (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
