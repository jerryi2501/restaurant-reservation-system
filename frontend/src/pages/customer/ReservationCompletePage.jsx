// SC-C05 予約完了画面（CONFIRMED）／ 権限: GUEST / CUSTOMER
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { ui } from "../../styles/ui";
import { useAuthStore } from "../../store";
// 直接URLアクセス用フォールバック
const MOCK_STATE = {
  result: { reservationId: 42, status: "CONFIRMED" },
  query: { reservationDate: "2026-07-01", timeSlotLabel: "第2部 13:30〜15:30", partySize: 6 },
  selected: { label: "4人用 + 2人用", tableIds: [2, 5] },
  customer: { customerName: "山田 太郎", customerEmail: "yamada@example.com" },
};

export default function ReservationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user     = useAuthStore((s) => s.user);
  const { result, query, selected , customer} = location.state ?? MOCK_STATE;

  function goToMyReservations() {
    if (user) {
      navigate("/mypage/reservations");
    } else {
      // 未ログインの場合はログイン画面へ。ログイン後にマイ予約へ戻る。
      navigate("/login", { state: { from: "/mypage/reservations" } });
    }
  }

  return (
    <Layout active="reserve">
      <div style={ui.narrow}>
        <div style={{ ...ui.card, textAlign: "center" }}>
          <div style={s.icon}>✓</div>
          <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>ご予約が確定しました</h2>

          <div style={{ textAlign: "left" }}>
            <div style={ui.summaryRow}><span style={ui.summaryLabel}>予約番号</span><span>#{result.reservationId}</span></div>
            <div style={ui.summaryRow}><span style={ui.summaryLabel}>日時</span><span>{query.reservationDate}　{query.timeSlotLabel}</span></div>
            <div style={ui.summaryRow}><span style={ui.summaryLabel}>席</span><span>{selected.label}（{query.partySize}名）</span></div>
          </div>

          {!user && customer?.customerEmail && (
            <p style={{ fontSize: 13, color: "#555", margin: "12px 0 0"}}>
              確認メールを <strong>{customer.customerEmail}</strong> に送信しました
            </p>
          )}

          {/* ポイント付与はログイン会員のみ（ゲスト予約では表示しない） */}
          {user && (
            <p style={s.point}>100ポイントを付与しました</p>
          )}

          <div style={ui.rowBtns}>
            <button type="button" style={ui.ghostBtn} onClick={goToMyReservations}>マイ予約を見る</button>
            <button type="button" style={{ ...ui.primaryBtn, flex: 1 }} onClick={() => navigate("/")}>トップへ戻る</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  icon: {
    width: 56, height: 56, borderRadius: "50%", background: "#EAF3DE", color: "#3B6D11",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, margin: "4px 0 12px",
  },
  point: { fontSize: 12, color: "#3B6D11", margin: "16px 0" },
};
