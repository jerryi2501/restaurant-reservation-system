// SC-C01 予約開始画面（トップ）／ 権限: GUEST / CUSTOMER
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { ui } from "../../styles/ui";
import { fetchTimeSlots, previewReservation } from "../../api/mockApi";

export default function ReservationStartPage() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("sv-SE"); // "YYYY-MM-DD"（ローカル時刻）

  const [timeSlots, setTimeSlots] = useState([]);
  const [date, setDate]           = useState(today);
  const [timeSlotId, setTimeSlotId] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [loading, setLoading]     = useState(false);

  // 時間帯一覧を取得（TODO [BACKEND] は mockApi.fetchTimeSlots 内）
  useEffect(() => {
    fetchTimeSlots().then(setTimeSlots);
  }, []);

  const canSubmit = date && timeSlotId && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      // プレビュー（TODO [BACKEND] は mockApi.previewReservation 内）
      const { combinations } = await previewReservation({
        reservationDate: date,
        timeSlotId: Number(timeSlotId),
        partySize,
      });

      if (!combinations.length) {
        alert("ご指定の日時は満席です。お電話にてお問い合わせください。");
        return;
      }

      const slot = timeSlots.find((s) => s.id === Number(timeSlotId));
      // 次画面(SC-C02)へ選択条件と候補を渡す
      navigate("/reserve/combinations", {
        state: {
          query: {
            reservationDate: date,
            timeSlotId: Number(timeSlotId),
            timeSlotLabel: slot?.label ?? "",
            partySize,
          },
          combinations,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout active="reserve">
      <div style={s.grid}>

        {/* 左：紹介文 */}
        <section style={s.lead}>
          <h1 style={ui.h1}>ご予約</h1>
          <p style={s.leadText}>
            ご希望の日付・時間帯・人数を選んで、空席状況をリアルタイムにご確認いただけます。
          </p>
          <p style={s.leadNote}>※ 当日のご予約はお電話でも承っております。</p>
        </section>

        {/* 右：入力カード */}
        <section style={s.cardWrap}>
          <div style={ui.card}>
            <h2 style={ui.cardTitle}>ご予約内容を入力</h2>
            <form onSubmit={handleSubmit}>

              <div style={ui.field}>
                <label htmlFor="date" style={ui.label}>予約日</label>
                <input id="date" type="date" value={date} min={today}
                  onChange={(e) => setDate(e.target.value)} style={ui.input} required />
              </div>

              <div style={ui.field}>
                <label htmlFor="slot" style={ui.label}>時間帯</label>
                <select id="slot" value={timeSlotId}
                  onChange={(e) => setTimeSlotId(e.target.value)} style={ui.input} required>
                  <option value="">選択してください</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>{slot.label}</option>
                  ))}
                </select>
              </div>

              <div style={ui.field}>
                <label style={ui.label}>ご来店人数</label>
                <div style={s.stepper}>
                  <button type="button" aria-label="人数を減らす"
                    onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                    disabled={partySize <= 1}
                    style={{ ...s.stepBtn, opacity: partySize <= 1 ? 0.35 : 1 }}>−</button>
                  <span style={s.stepValue}>{partySize}&nbsp;名</span>
                  <button type="button" aria-label="人数を増やす"
                    onClick={() => setPartySize((p) => Math.min(16, p + 1))}
                    disabled={partySize >= 16}
                    style={{ ...s.stepBtn, opacity: partySize >= 16 ? 0.35 : 1 }}>＋</button>
                </div>
              </div>

              <button type="submit" disabled={!canSubmit}
                style={{ ...ui.primaryBtn, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}>
                {loading ? "確認中…" : "空席を確認する"}
              </button>

              <p style={ui.note}>※ 17名以上のご予約はお電話にて承ります</p>
            </form>
          </div>
        </section>

      </div>
    </Layout>
  );
}

const s = {
  grid: { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 48 },
  lead: { flex: "0 1 360px", minWidth: 280 },
  leadText: { fontSize: 15, lineHeight: 1.9, color: "var(--color-text-secondary)", margin: "0 0 16px", maxWidth: 420 },
  leadNote: { fontSize: 13, color: "var(--color-text-secondary)", margin: 0 },
  cardWrap: { flex: "0 1 420px", width: "100%", maxWidth: 420 },
  stepper: { display: "flex", alignItems: "center", gap: 16 },
  stepBtn: {
    width: 40, height: 40, border: "1px solid var(--color-border)", borderRadius: "var(--radius)",
    background: "#fff", fontSize: 20, lineHeight: 1, cursor: "pointer", color: "var(--color-primary)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepValue: { fontSize: 18, fontWeight: 600, minWidth: 56, textAlign: "center" },
};
