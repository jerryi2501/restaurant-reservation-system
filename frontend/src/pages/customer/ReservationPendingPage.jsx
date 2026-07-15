// SC-C06 予約受付中画面（PENDING・スタッフ承認待ち）／ 権限: GUEST / CUSTOMER
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { ui } from "../../styles/ui";

// 直接URLアクセス用フォールバック
const MOCK_STATE = {
  result: { reservationId: 43, status: "PENDING", expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() },
  query: { partySize: 12 },
};

const TOTAL_SEC = 10 * 60; // 受付期限は10分（API設計書）

export default function ReservationPendingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, query } = location.state ?? MOCK_STATE;

  const calcRemaining = () =>
    Math.max(0, Math.floor((new Date(result.expiresAt).getTime() - Date.now()) / 1000));

  const [remaining, setRemaining] = useState(calcRemaining);

  // カウントダウン（1秒ごと）
  useEffect(() => {
    const timer = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO [BACKEND / WS] WebSocket /user/queue/updates を購読する。
  //   受信内容で画面を自動で切り替える:
  //     status === "CONFIRMED" → navigate("/reserve/complete", { state: {...} })
  //     status === "CANCELLED" → 「お電話ください」案内へ
  //   また expiresAt 超過（自動キャンセル）も同トピックで通知される想定。
  //   例:
  //   useEffect(() => {
  //     const sub = subscribe("/user/queue/updates", (msg) => { ... });
  //     return () => sub.unsubscribe();
  //   }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = Math.round((remaining / TOTAL_SEC) * 100);

  return (
    <Layout active="reserve">
      <div style={ui.narrow}>
        <div style={{ ...ui.card, textAlign: "center" }}>
          <div style={s.icon}>⏳</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>スタッフが確認中です…</h2>
          <p style={s.sub}>予約番号 #{result.reservationId} ／ ご予約人数 {query.partySize}名</p>

          <div style={s.count}>{mm}:{ss}</div>
          <p style={s.note}>10分以内に結果をお知らせします</p>

          <div style={s.barTrack}>
            <div style={{ ...s.barFill, width: `${progress}%` }} />
          </div>

          <p style={s.hint}>結果が出ると、このまま自動で画面が切り替わります。</p>
          <p style={s.help}>
            承認＝ご予約確定。拒否・期限切れの場合は、お手数ですが店舗へお電話ください。
          </p>

          <button type="button" style={{ ...ui.ghostBtn, marginTop: 8 }} onClick={() => navigate("/")}>
            トップへ戻る
          </button>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  icon: {
    width: 56, height: 56, borderRadius: "50%", background: "#FAEEDA", color: "#854F0B",
    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "4px 0 12px",
  },
  sub: { fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 16px" },
  count: { fontSize: 36, fontWeight: 700, color: "#854F0B", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em" },
  note: { fontSize: 12, color: "var(--color-text-secondary)", margin: "4px 0 16px" },
  barTrack: { height: 8, borderRadius: 4, background: "var(--color-bg-secondary)", overflow: "hidden" },
  barFill: { height: "100%", background: "var(--status-pending)", transition: "width 1s linear" },
  hint: { fontSize: 13, color: "var(--color-text)", margin: "16px 0 4px" },
  help: { fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 8px" },
};
