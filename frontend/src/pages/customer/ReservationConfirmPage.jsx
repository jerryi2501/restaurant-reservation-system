// SC-C04 予約内容確認画面 ／ 権限: GUEST / CUSTOMER
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { ui } from "../../styles/ui";
import { createReservation } from "../../api/mockApi";

// 直接URLアクセス用フォールバック（本番では "/" へリダイレクト推奨）
const MOCK_STATE = {
  query: { reservationDate: "2026-07-01", timeSlotId: 2, timeSlotLabel: "第2部　13:30〜15:30", partySize: 6 },
  selected: { tableIds: [2, 5], label: "4人用 + 2人用", tableCount: 2, waste: 0, requiresApproval: false },
  customer: { customerName: "山田 太郎", customerPhone: "090-1234-5678", customerEmail: "yamada@example.com", notes: "アレルギー：なし" },
};

export default function ReservationConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query, selected, customer } = location.state ?? MOCK_STATE;
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      // 予約確定（TODO [BACKEND] は mockApi.createReservation 内）
      const result = await createReservation({
        reservationDate: query.reservationDate,
        timeSlotId: query.timeSlotId,
        partySize: query.partySize,
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        customerEmail: customer.customerEmail,
        tableIds: selected.tableIds,
        notes: customer.notes,
      });

      // 1〜8名=即確定 → 完了画面 ／ 9〜16名=承認待ち → 受付中画面
      if (result.status === "PENDING") {
        navigate("/reserve/pending", { state: { result, query } });
      } else {
        navigate("/reserve/complete", { state: { result, query, selected, customer } });
      }
    } finally {
      setLoading(false);
    }
  }

  const rows = [
    ["日付", query.reservationDate],
    ["時間帯", query.timeSlotLabel],
    ["ご来店人数", `${query.partySize}名`],
    ["席", selected.label],
    ["お名前", customer.customerName],
    ["電話番号", customer.customerPhone],
    ["メールアドレス", customer.customerEmail],
    ["ご要望", customer.notes || "—"],
  ];

  return (
    <Layout active="reserve">
      <div style={ui.narrow}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>ご予約内容の確認</h2>

          <div>
            {rows.map(([label, value]) => (
              <div key={label} style={ui.summaryRow}>
                <span style={ui.summaryLabel}>{label}</span>
                <span style={{ textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>

          <p style={ui.note}>内容をご確認のうえ、予約を確定してください。</p>

          <div style={ui.rowBtns}>
            <button type="button" style={ui.ghostBtn} onClick={() => navigate(-1)} disabled={loading}>戻る</button>
            <button type="button" onClick={handleConfirm} disabled={loading}
              style={{ ...ui.primaryBtn, flex: 1, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "送信中…" : "予約を確定する"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
