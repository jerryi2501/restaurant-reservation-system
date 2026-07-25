// ============================================================
//  API 呼び出し層（Spring Boot バックエンドへ接続）
// ------------------------------------------------------------
//  以前はモック実装だったが、API設計書 v1.0 に沿って本物の
//  エンドポイント呼び出しへ差し替え済み。
//  ・通信は src/api/client.js（axios）経由。
//  ・client.js のインターセプタが { success, data, message } を
//    解釈し、成功時は data だけを返す（失敗時は message を throw）。
//  ・画面側（pages/*）が期待する形に合わせるため、必要な箇所だけ
//    レスポンスを整形している（例: slotLabel → label）。
//  ※ ファイル名は互換のため mockApi.js のまま（全画面が import 済み）。
// ============================================================
import { api } from "./client";

// ------------------------------------------------------------
// 時間帯一覧  GET /api/time-slots
//   res.data: [ { id, slotLabel, startTime, endTime } ]
//   画面は label を使うので slotLabel → label に整形。
// ------------------------------------------------------------
export async function fetchTimeSlots() {
  const data = await api.get("/api/time-slots");
  return data.map((s) => ({ id: s.id, label: s.slotLabel }));
}

// ------------------------------------------------------------
// テーブル組み合わせプレビュー  POST /api/reservations/preview
//   req:  { reservationDate, timeSlotId, partySize }
//   res.data: { partySize, combinations:[{ label, totalSeats, waste,
//               tableCount, tables:[{tableId,tableNumber,capacity}] }],
//               requiresApproval }
//   画面は各組み合わせの tableIds（数値配列）を使うので tables から取り出す。
//   満席時はサーバーが success:false を返す → client.js が throw する。
//   画面側は「combinations が空」で満席判定するため、満席だけ握りつぶして
//   空配列を返す（それ以外のエラーは再スロー）。
// ------------------------------------------------------------
export async function previewReservation({ reservationDate, timeSlotId, partySize }) {
  try {
    const data = await api.post("/api/reservations/preview", { reservationDate, timeSlotId, partySize });
    const combinations = (data.combinations ?? []).map((c) => {
      const tables = c.tables ?? [];
      return {
        // tableIds はサーバーが直接返す。無ければ tables から取り出す。
        tableIds: c.tableIds ?? tables.map((t) => t.tableId),
        // 各テーブルの詳細（番号・定員）。C02のチップ表示に使う。
        tables,
        // サーバーが label / tableCount を返さないため、無い場合はこちらで生成する。
        label: c.label ?? tables.map((t) => `${t.capacity}人用`).join(" + "),
        tableCount: c.tableCount ?? tables.length,
        waste: c.waste,
        requiresApproval: data.requiresApproval,
      };
    });
    return { partySize: data.partySize, combinations, requiresApproval: data.requiresApproval };
  } catch (err) {
    // 満席（success:false）は空の組み合わせとして扱う
    if (err.message && err.message.includes("満席")) {
      return { partySize, combinations: [], requiresApproval: false };
    }
    throw err;
  }
}

// ------------------------------------------------------------
// 予約確定  POST /api/reservations
//   req: { reservationDate, timeSlotId, partySize, customerName,
//          customerPhone, tableIds, notes }（customerEmail も送る）
//   res(1〜8名) : { reservationId, status:"CONFIRMED", ... }
//   res(9〜16名): { reservationId, status:"PENDING", expiresAt }
//   409: テーブル二重予約 → client.js が message を throw
// ------------------------------------------------------------
export async function createReservation(payload) {
  // 画面からは reservationDate で来るが、サーバーは date + acceptSplit を要求する。
  // acceptSplit: 複数テーブルの組み合わせ（分割席）を承諾したか＝テーブルが2つ以上なら true。
  const body = {
    date: payload.reservationDate,
    timeSlotId: payload.timeSlotId,
    partySize: payload.partySize,
    tableIds: payload.tableIds,
    acceptSplit: (payload.tableIds?.length ?? 0) > 1,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    notes: payload.notes,
  };
  return api.post("/api/reservations", body);
}

// ------------------------------------------------------------
// 顧客ログイン  POST /api/auth/customer/login
//   req:  { username(=email), password }
//   res.data: { type, role, displayName }（トークンは Cookie で返る）
// ------------------------------------------------------------
export async function loginCustomer({ email, password }) {
  return api.post("/api/auth/customer/login", { username: email, password });
}

// ------------------------------------------------------------
// 顧客新規登録  POST /api/auth/customer/register
//   res.data: { type, role, displayName }
// ------------------------------------------------------------
export async function registerCustomer({ name, phone, email, password }) {
  return api.post("/api/auth/customer/register", { name, phone, email, password });
}

// ------------------------------------------------------------
// ログアウト  POST /api/auth/logout（Cookie を無効化）
// ------------------------------------------------------------
export async function logout() {
  return api.post("/api/auth/logout");
}

// ------------------------------------------------------------
// 自分のプロフィール取得  GET /api/customers/me（要JWT）
//   res.data: { customerId, name, phone, email, rankPoints, currentPoints, rank }
// ------------------------------------------------------------
export async function getMyProfile() {
  return api.get("/api/customers/me");
}

// ------------------------------------------------------------
// プロフィール更新  PUT /api/customers/me（要JWT）  req: { name, phone }
// ------------------------------------------------------------
export async function updateMyProfile({ name, phone }) {
  return api.put("/api/customers/me", { name, phone });
}

// ------------------------------------------------------------
// 自分の予約一覧  GET /api/reservations/my（要JWT）
//   res.data: { content:[...], totalElements, totalPages }
//   画面は配列を期待するので content を返す。
// ------------------------------------------------------------
export async function getMyReservations() {
  const data = await api.get("/api/reservations/my");
  return data.content ?? data;
}

// ------------------------------------------------------------
// 予約キャンセル  DELETE /api/reservations/{id}（要JWT・自分の予約のみ）
// ------------------------------------------------------------
export async function cancelReservation(reservationId) {
  await api.del(`/api/reservations/${reservationId}`);
  return { reservationId };
}

// ------------------------------------------------------------
// ポイント履歴  GET /api/customers/me/point-history（要JWT）
//   res.data: { content:[{type,pointsAmount,reason,createdAt}], ... }
// ------------------------------------------------------------
export async function getPointHistory() {
  const data = await api.get("/api/customers/me/point-history");
  return data.content ?? data;
}

// ============================================================
//  スタッフ向け（STAFF / ADMIN）
// ============================================================

// ------------------------------------------------------------
// スタッフ・管理者ログイン  POST /api/auth/staff/login
//   req:  { username, password }
//   res.data: { type, role, displayName }（トークンは Cookie で返る）
// ------------------------------------------------------------
export async function loginStaff({ username, password }) {
  return api.post("/api/auth/staff/login", { username, password });
}

// ------------------------------------------------------------
// 承認待ち（PENDING）予約一覧  GET /api/staff/reservations/pending（要STAFF/ADMIN）
//   res.data: [ { reservationId, customerName, customerPhone, partySize,
//                 timeSlotLabel, tables, expiresAt } ]
//   TODO [WS] /topic/staff/pending — 新規PENDINGをリアルタイム受信
// ------------------------------------------------------------
export async function getPendingReservations() {
  return api.get("/api/staff/reservations/pending");
}

// ------------------------------------------------------------
// PENDING予約の承認 / 拒否
//   PUT /api/staff/reservations/{id}/approve → { reservationId, status:"CONFIRMED" }
//   PUT /api/staff/reservations/{id}/reject  → data:null（CANCELLED扱い）
// ------------------------------------------------------------
export async function approveReservation(reservationId) {
  return api.put(`/api/staff/reservations/${reservationId}/approve`);
}
export async function rejectReservation(reservationId) {
  await api.put(`/api/staff/reservations/${reservationId}/reject`);
  return { reservationId, status: "CANCELLED" };
}

// ------------------------------------------------------------
// ダッシュボード統計
//   専用エンドポイントは無いため /api/staff/tables を集計して算出（API設計書 7.3）。
//   res: { available, reserved, occupied, occupancyRate }
// ------------------------------------------------------------
export async function getDashboardStats() {
  const tables = await api.get("/api/staff/tables");
  const total = tables.length || 1;
  const available = tables.filter((t) => t.status === "AVAILABLE").length;
  const reserved  = tables.filter((t) => t.status === "RESERVED" || t.status === "PENDING").length;
  const occupied  = tables.filter((t) => t.status === "OCCUPIED").length;
  const occupancyRate = Math.round(((reserved + occupied) / total) * 100);
  return { available, reserved, occupied, occupancyRate };
}

// ------------------------------------------------------------
// 予約管理：全予約一覧  GET /api/staff/reservations（要STAFF/ADMIN）
//   クエリ: ?date=&slotId=&status=&page=&size=
//   res.data: { content:[{reservationId,customerName,partySize,tables,status}], ... }
// ------------------------------------------------------------
export async function getStaffReservations() {
  const data = await api.get("/api/staff/reservations");
  return data.content ?? data;
}

// ------------------------------------------------------------
// 予約ステータス更新  PUT /api/staff/reservations/{id}/status  req: { status }
//   （来店=OCCUPIED / 会計=COMPLETED / 無断=NO_SHOW / 取消=CANCELLED）
// ------------------------------------------------------------
export async function updateReservationStatus(reservationId, status) {
  await api.put(`/api/staff/reservations/${reservationId}/status`, { status });
  return { reservationId, status };
}

// ------------------------------------------------------------
// テーブル状態ボード  GET /api/staff/tables?date=&slotId=（要STAFF/ADMIN）
//   res.data: [ { tableId, tableNumber, capacity, zone, status, reservationId } ]
//   TODO [WS] /topic/tables — テーブル状態変化をリアルタイム反映
// ------------------------------------------------------------
export async function getTables() {
  return api.get("/api/staff/tables");
}

// ============================================================
//  管理者（ADMIN）— マスタ管理
// ============================================================

// ----- スタッフ管理 -----
// ※ サーバーは userName（N大文字）、画面は username を使うため相互変換する。
export async function getStaffUsers() {
  const data = await api.get("/api/admin/users");
  return data.map((u) => ({ ...u, username: u.userName }));
}
export async function createStaffUser({ username, ...rest }) {
  const u = await api.post("/api/admin/users", { userName: username, ...rest });
  return { ...u, username: u.userName };
}
export async function updateStaffUser(id, { username, ...rest }) {
  const body = username === undefined ? rest : { userName: username, ...rest };
  const u = await api.put(`/api/admin/users/${id}`, body);
  return { ...u, username: u.userName };
}

// ----- テーブル管理 -----
export async function getAdminTables() {
  return api.get("/api/admin/tables");
}
export async function createTable(data) {
  return api.post("/api/admin/tables", data);
}
export async function updateTable(id, data) {
  return api.put(`/api/admin/tables/${id}`, data);
}

// ----- 時間帯管理 -----
// ※ サーバーは description を持たないため、送信時は除外する。
export async function getAdminTimeSlots() {
  return api.get("/api/admin/time-slots");
}
export async function createTimeSlot({ description, ...rest }) {
  return api.post("/api/admin/time-slots", rest);
}
export async function updateTimeSlot(id, { description, ...rest }) {
  return api.put(`/api/admin/time-slots/${id}`, rest);
}

// ------------------------------------------------------------
// 本日の予約状況（ダッシュボード用サマリ）
//   GET /api/staff/reservations?date=today&size=10 を利用。
//   専用の time フィールドが無い場合は timeSlotLabel で代用。
// ------------------------------------------------------------
export async function getTodayReservations() {
  const today = new Date().toLocaleDateString("sv-SE"); // "YYYY-MM-DD"
  const data = await api.get("/api/staff/reservations", { params: { date: today, size: 10 } });
  const list = data.content ?? data;
  return list.map((r) => ({
    reservationId: r.reservationId,
    time: r.time ?? r.timeSlotLabel ?? "",
    customerName: r.customerName,
    partySize: r.partySize,
    status: r.status,
  }));
}
