import { create } from "zustand";

// 認証状態（JWT + ログインユーザー情報）
// role: "GUEST" | "CUSTOMER" | "STAFF" | "ADMIN"
export const useAuthStore = create((set) => ({
  user:      null,
  token:     null,
  setAuth:   (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));

// 予約フロー中の一時データ（C01→C04を跨ぐ state の代替）
// navigate state との併用も可。store にも持たせておくと直URLアクセス時に復元しやすい。
export const useReservationStore = create((set) => ({
  draft:      null,  // { query, selected, customer }
  setDraft:   (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
