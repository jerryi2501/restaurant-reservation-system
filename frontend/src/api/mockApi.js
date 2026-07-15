// ============================================================
//  モックAPI（フロントエンド単独で動かすための仮実装）
// ------------------------------------------------------------
//  ★ バックエンド担当者へ ★
//  各関数は「API設計書」のエンドポイントに1対1で対応しています。
//  実装時は、各関数の中身を src/api/client.js（api.get / api.post ...）
//  を使った本物のAPI呼び出しに置き換えてください。
//  画面側（pages/*）はこのファイルの関数を呼ぶだけなので、
//  ここを差し替えれば全画面が本番APIに繋がります。
//  目印: このファイル内の「TODO [BACKEND]」を検索してください。
// ============================================================

// 通信っぽい遅延（本番では不要・削除可）
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------
// 時間帯一覧
// TODO [BACKEND] GET /api/time-slots
//   res.data: [ { id: number, slotLabel: string, startTime, endTime } ]
//   （※ 画面では label として slotLabel を使う想定）
// 置き換え例:
//   export async function fetchTimeSlots() {
//     const data = await api.get("/api/time-slots");
//     return data.map(s => ({ id: s.id, label: s.slotLabel }));
//   }
// ------------------------------------------------------------
export async function fetchTimeSlots() {
  await delay();
  return [
    { id: 1, label: "第1部　11:00〜13:00" },
    { id: 2, label: "第2部　13:30〜15:30" },
    { id: 3, label: "第3部　18:00〜20:00" },
    { id: 4, label: "第4部　20:30〜22:30" },
  ];
}

// ------------------------------------------------------------
// テーブル組み合わせプレビュー（DBへは書き込まない）
// TODO [BACKEND] POST /api/reservations/preview
//   req:  { reservationDate, timeSlotId, partySize }
//   res.data: {
//     partySize,
//     combinations: [ { label, totalSeats, waste, tableCount,
//                       tables:[{tableId,tableNumber,capacity}] } ],
//     requiresApproval: boolean   // partySize 9〜16 で true
//   }
//   ※ combinations が空 = 満席（画面で「お電話ください」を表示）
// 画面では tableIds（数値配列）を使うので、必要なら tables から id を取り出す。
// ------------------------------------------------------------
export async function previewReservation({ reservationDate, timeSlotId, partySize }) {
  await delay();
  const requiresApproval = partySize >= 9; // 9〜16名はスタッフ承認待ち

  // 仮の組み合わせ（本番はバックエンドの「コイン両替アルゴリズム」が算出）
  const combinations = [
    { tableIds: [2, 5],    label: "4人用 + 2人用",        tableCount: 2, waste: 0, requiresApproval },
    { tableIds: [3, 7, 8], label: "4人用 + カウンター×2", tableCount: 3, waste: 0, requiresApproval },
  ];

  return { partySize, combinations, requiresApproval };
}

// ------------------------------------------------------------
// 予約確定
// TODO [BACKEND] POST /api/reservations
//   req: { reservationDate, timeSlotId, partySize,
//          customerName, customerPhone, tableIds, notes }
//   res(1〜8名)  : { reservationId, status:"CONFIRMED", ... }
//   res(9〜16名) : { reservationId, status:"PENDING", expiresAt }
//   409: テーブル二重予約 → 画面で再プレビューへ誘導
// ------------------------------------------------------------
export async function createReservation(payload) {
  await delay();
  const status = payload.partySize >= 9 ? "PENDING" : "CONFIRMED";
  const result = { reservationId: 1000 + Math.floor(Math.random() * 900), status };
  if (status === "PENDING") {
    // 10分後に自動キャンセル（API設計書）
    result.expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  }
  return result;
}

// ------------------------------------------------------------
// 顧客ログイン
// TODO [BACKEND] POST /api/customer/auth/login
//   req: { email, password }
//   res: { token, customerId, name, rankPoints, currentPoints }
//   401: メール/パスワード違い → 画面でエラー表示
// ------------------------------------------------------------
export async function loginCustomer({ email, password}) {
  await delay();
  // 仮：入力があれば成功とみなす（本番はサーバーが判定）
  if (!email || !password) throw new Error("メールとパスワードを入力してください");
  return { token: "mock-jwt-token", customerId: 1, name: "山田 太郎", rankPoints: 1500, currentPoints: 800};
}

// ------------------------------------------------------------
// 顧客新規登録
// TODO [BACKEND] POST /api/customer/auth/register
//   req: { name, phone, email, password }
//   res: { customerId, name, email }
//   409: メール重複 → throw して画面でエラー表示
// ------------------------------------------------------------
export async function registerCustomer({ name, phone, email, password }) {
  await delay();
  if (!name || !phone || !email || !password) throw new Error("すべての項目を入力してください");
  return { customerId: 1, name, email };
}

// ------------------------------------------------------------
// 自分のプロフィール取得
// TODO [BACKEND] GET /api/customers/me（要JWT）
//   res: { customerId, name, phone, email, rankPoints, currentPoints, rank }
// ------------------------------------------------------------
export async function getMyProfile() {
  await delay();
  return {
    customerId: 1, name: "山田 太郎", phone: "090-1234-5678", email: "yamada@example.com",
    rankPoints: 1500, currentPoints: 800, rank: "シルバー",
  };
}

// ------------------------------------------------------------
// プロフィール更新
// TODO [BACKEND] PUT /api/customers/me（要JWT）  req: { name, phone }
// ------------------------------------------------------------
export async function updateMyProfile({ name, phone }) {
  await delay();
  return { name, phone };
}

// ------------------------------------------------------------
// 自分の予約一覧
// TODO [BACKEND] GET /api/reservations/my（要JWT）
//   res: [ { reservationId, status, reservationDate, timeSlotLabel, partySize, tables:[番号...] } ]
// ------------------------------------------------------------
export async function getMyReservations() {
  await delay();
  return [
    { reservationId: 42, status: "CONFIRMED", reservationDate: "2026-07-01", timeSlotLabel: "第2部 13:30〜15:30", partySize: 6,  tables: ["B02", "A07"] },
    { reservationId: 43, status: "PENDING",   reservationDate: "2026-07-01", timeSlotLabel: "第3部 18:00〜20:00", partySize: 12, tables: ["D01", "B05", "A08"] },
    { reservationId: 38, status: "COMPLETED", reservationDate: "2026-06-20", timeSlotLabel: "第1部 11:00〜13:00", partySize: 4,  tables: ["B05"] },
    { reservationId: 30, status: "CANCELLED", reservationDate: "2026-06-01", timeSlotLabel: "第3部 18:00〜20:00", partySize: 2,  tables: ["A03"] },
  ];
}

// ------------------------------------------------------------
// 予約キャンセル
// TODO [BACKEND] DELETE /api/reservations/{id}（要JWT・自分の予約のみ）
// ------------------------------------------------------------
export async function cancelReservation(reservationId) {
  await delay();
  return { reservationId };
}

// ------------------------------------------------------------
// ポイント履歴
// TODO [BACKEND] GET /api/customers/me/point-history（要JWT）
//   res: [ { type:"EARNED"|"SPENT", pointsAmount, reason, createdAt } ]
// ------------------------------------------------------------
export async function getPointHistory() {
  await delay();
  return [
    { type: "EARNED", pointsAmount: 100,  reason: "予約完了（予約ID: 42）", createdAt: "2026-07-01" },
    { type: "SPENT",  pointsAmount: 500,  reason: "クーポン使用",          createdAt: "2026-06-20" },
    { type: "EARNED", pointsAmount: 200,  reason: "予約完了（予約ID: 38）", createdAt: "2026-06-10" },
    { type: "EARNED", pointsAmount: 1000, reason: "新規登録ボーナス",      createdAt: "2026-05-15" },
  ];
}

// ============================================================
//  スタッフ向け（STAFF / ADMIN）
// ============================================================

// ------------------------------------------------------------
// スタッフ・管理者ログイン
// TODO [BACKEND] POST /api/staff/auth/login
//   req: { username, password } ; res: { token, userId, displayName, role }
// ------------------------------------------------------------
export async function loginStaff({ username, password }) {
  await delay();
  if (!username || !password) throw new Error("ユーザー名とパスワードを入力してください");
  return { token: "mock-staff-token", userId: 10, displayName: "田中 スタッフ", role: "STAFF" };
}

// ------------------------------------------------------------
// 承認待ち（PENDING）予約一覧
// TODO [BACKEND] GET /api/staff/reservations/pending（要STAFF/ADMIN JWT）
//   res: [ { reservationId, customerName, customerPhone, partySize, timeSlotLabel, tables, expiresAt } ]
// TODO [WS] /topic/staff/pending — 新規PENDINGをリアルタイム受信して先頭に追加
// ------------------------------------------------------------
export async function getPendingReservations() {
  await delay();
  return [
    { reservationId: 43, customerName: "鈴木 一郎", customerPhone: "080-0000-1111", partySize: 12, timeSlotLabel: "第3部 18:00〜20:00", tables: ["D01", "B05", "A08"], expiresAt: new Date(Date.now() + 8 * 60 * 1000).toISOString() },
    { reservationId: 45, customerName: "佐藤 花子", customerPhone: "080-2222-3333", partySize: 10, timeSlotLabel: "第3部 18:00〜20:00", tables: ["D02", "B07"],        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() },
  ];
}

// ------------------------------------------------------------
// PENDING予約の承認 / 拒否
// TODO [BACKEND] PUT /api/staff/reservations/{id}/approve
// TODO [BACKEND] PUT /api/staff/reservations/{id}/reject
//   どちらも顧客へ WS /user/queue/updates で結果通知（バックエンド側）
// ------------------------------------------------------------
export async function approveReservation(reservationId) {
  await delay();
  return { reservationId, status: "CONFIRMED" };
}
export async function rejectReservation(reservationId) {
  await delay();
  return { reservationId, status: "CANCELLED" };
}

// ------------------------------------------------------------
// ダッシュボード統計
// ※ 専用エンドポイントは無く、本番では /api/staff/tables の集計で算出する想定。
// TODO [BACKEND] GET /api/staff/tables を集計 → { available, reserved, occupied, occupancyRate }
// ------------------------------------------------------------
export async function getDashboardStats() {
  await delay();
  return { available: 124, reserved: 48, occupied: 14, occupancyRate: 62 };
}

// ------------------------------------------------------------
// 予約管理：全予約一覧（絞り込みはフロント側で実施）
// TODO [BACKEND] GET /api/staff/reservations?date=&slotId=&status=&page=
//   res: [ { reservationId, customerName, partySize, tables, status } ]
// ------------------------------------------------------------
export async function getStaffReservations() {
  await delay();
  return [
    { reservationId: 42, customerName: "山田 太郎", partySize: 6,  tables: ["B02", "A07"],        status: "CONFIRMED" },
    { reservationId: 50, customerName: "田中 健",   partySize: 2,  tables: ["A03"],               status: "OCCUPIED" },
    { reservationId: 51, customerName: "高橋 実",   partySize: 4,  tables: ["B07"],               status: "NO_SHOW" },
    { reservationId: 43, customerName: "鈴木 一郎", partySize: 12, tables: ["D01", "B05", "A08"], status: "PENDING" },
    { reservationId: 38, customerName: "佐藤 花子", partySize: 4,  tables: ["B05"],               status: "COMPLETED" },
  ];
}

// ------------------------------------------------------------
// 予約ステータス更新（来店=OCCUPIED / 会計=COMPLETED / 無断=NO_SHOW）
// TODO [BACKEND] PUT /api/staff/reservations/{id}/status  req: { status }
// ------------------------------------------------------------
export async function updateReservationStatus(reservationId, status) {
  await delay();
  return { reservationId, status };
}

// ------------------------------------------------------------
// テーブル状態ボード
// TODO [BACKEND] GET /api/staff/tables?date=&slotId=
//   res: [ { tableId, tableNumber, capacity, zone, status } ]
// TODO [WS] /topic/tables — テーブル状態変化をリアルタイム反映（再読込なし）
// ------------------------------------------------------------
export async function getTables() {
  await delay();
  const mk = (prefix, capacity, zone, count, statuses) =>
    Array.from({ length: count }, (_, i) => {
      const num = `${prefix}${String(i + 1).padStart(2, "0")}`;
      return { tableId: num, tableNumber: num, capacity, zone, status: statuses[i % statuses.length] };
    });
  return [
    ...mk("C", 1, "COUNTER", 6, ["AVAILABLE", "AVAILABLE", "RESERVED", "OCCUPIED", "AVAILABLE", "AVAILABLE"]),
    ...mk("A", 2, "TABLE_2", 6, ["RESERVED", "AVAILABLE", "OCCUPIED", "PENDING", "AVAILABLE", "RESERVED"]),
    ...mk("B", 4, "TABLE_4", 6, ["AVAILABLE", "RESERVED", "OCCUPIED", "AVAILABLE", "RESERVED", "AVAILABLE"]),
    ...mk("D", 8, "TABLE_8", 6, ["PENDING", "AVAILABLE", "RESERVED", "OCCUPIED", "AVAILABLE", "AVAILABLE"]),
  ];
}

// ============================================================
//  管理者（ADMIN）— マスタ管理
// ============================================================
const newId = () => Math.floor(Math.random() * 1000) + 100;

// ----- スタッフ管理 -----
// TODO [BACKEND] GET /api/admin/users
export async function getStaffUsers() {
  await delay();
  return [
    { id: 10, username: "staff01", displayName: "田中 スタッフ", role: "STAFF", isActive: true },
    { id: 11, username: "admin01", displayName: "佐々木 管理者", role: "ADMIN", isActive: true },
    { id: 12, username: "staff02", displayName: "渡辺 スタッフ", role: "STAFF", isActive: false },
  ];
}
// TODO [BACKEND] POST /api/admin/users
export async function createStaffUser(data) { await delay(); return { id: newId(), isActive: true, ...data }; }
// TODO [BACKEND] PUT /api/admin/users/{id}（無効化は DELETE /api/admin/users/{id} で is_active=false）
export async function updateStaffUser(id, data) { await delay(); return { id, ...data }; }

// ----- テーブル管理 -----
// TODO [BACKEND] GET /api/admin/tables
export async function getAdminTables() {
  await delay();
  return [
    { id: 1, tableNumber: "B02", capacity: 4, zone: "TABLE_4", isActive: true },
    { id: 2, tableNumber: "C01", capacity: 1, zone: "COUNTER", isActive: true },
    { id: 3, tableNumber: "A07", capacity: 2, zone: "TABLE_2", isActive: true },
    { id: 4, tableNumber: "D12", capacity: 8, zone: "TABLE_8", isActive: false },
  ];
}
// TODO [BACKEND] POST /api/admin/tables
export async function createTable(data) { await delay(); return { id: newId(), isActive: true, ...data }; }
// TODO [BACKEND] PUT /api/admin/tables/{id}
export async function updateTable(id, data) { await delay(); return { id, ...data }; }

// ----- 時間帯管理 -----
// TODO [BACKEND] GET /api/admin/time-slots
export async function getAdminTimeSlots() {
  await delay();
  return [
    { id: 1, slotLabel: "第1部 11:00〜13:00", description: "ランチ営業セッション",     startTime: "11:00", endTime: "13:00", displayOrder: 1, isActive: true },
    { id: 2, slotLabel: "第2部 13:30〜15:30", description: "続きのランチ営業セッション", startTime: "13:30", endTime: "15:30", displayOrder: 2, isActive: true },
    { id: 3, slotLabel: "第3部 18:00〜20:00", description: "ディナー前半セッション",    startTime: "18:00", endTime: "20:00", displayOrder: 3, isActive: true },
    { id: 4, slotLabel: "第4部 20:30〜22:30", description: "ディナー後半セッション",    startTime: "20:30", endTime: "22:30", displayOrder: 4, isActive: false },
  ];
}
// TODO [BACKEND] POST /api/admin/time-slots
export async function createTimeSlot(data) { await delay(); return { id: newId(), isActive: true, ...data }; }
// TODO [BACKEND] PUT /api/admin/time-slots/{id}
export async function updateTimeSlot(id, data) { await delay(); return { id, ...data }; }

// ------------------------------------------------------------
// 本日の予約状況（ダッシュボード用サマリ）
// TODO [BACKEND] GET /api/staff/reservations?date=today&limit=10
// ------------------------------------------------------------
export async function getTodayReservations() {
  await delay();
  return [
    { reservationId: 60, time: "18:00", customerName: "高橋 健二", partySize: 4, status: "CONFIRMED" },
    { reservationId: 61, time: "18:30", customerName: "渡辺 まり", partySize: 2, status: "OCCUPIED"  },
    { reservationId: 62, time: "19:00", customerName: "伊藤 博",   partySize: 6, status: "CONFIRMED" },
  ];
}
