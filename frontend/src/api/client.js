// ===== API クライアント（axios 版） =====
// Spring Boot バックエンド（API設計書に対応）への共通通信処理。
// 共通レスポンス形式 { success, data, message } をここで処理し、
// 画面側には data だけを返す（失敗時は message を throw）。
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // 開発用。本番は環境変数 import.meta.env.VITE_API_BASE に。
  headers: { "Content-Type": "application/json" },
});

// リクエスト前：localStorage の JWT を Authorization ヘッダーに自動付与
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// レスポンス後：{ success, data, message } を判定し、data だけ返す
instance.interceptors.response.use(
  (res) => {
    const body = res.data;
    if (body && body.success === false) {
      return Promise.reject(new Error(body.message || "エラーが発生しました"));
    }
    return body?.data ?? body;
  },
  (err) => {
    // HTTPエラー（401/409/500 など）。サーバーが message を返していれば使う。
    const msg = err.response?.data?.message || err.message || "通信エラーが発生しました";
    return Promise.reject(new Error(msg));
  }
);

// 各メソッドのショートカット（既存の使い方 api.get/post/put/del を維持）
export const api = {
  get:  (path, config)       => instance.get(path, config),
  post: (path, body, config) => instance.post(path, body, config),
  put:  (path, body, config) => instance.put(path, body, config),
  del:  (path, config)       => instance.delete(path, config),
};
