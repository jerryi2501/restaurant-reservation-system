// SC-C02 テーブル組み合わせ選択画面 ／ 権限: GUEST / CUSTOMER
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { ui } from "../../styles/ui";

// TODO [BACKEND]: 通常は SC-C01 の preview 結果が location.state で渡る。
//   直接URLアクセス時のフォールバック用モック（本番では "/" へリダイレクト推奨）。
const MOCK_STATE = {
  query: { reservationDate: "2026-07-01", timeSlotId: 2, timeSlotLabel: "第2部　13:30〜15:30", partySize: 6 },
  combinations: [
    { tableIds: [2, 5],    label: "4人用 + 2人用",        tableCount: 2, waste: 0, requiresApproval: false },
    { tableIds: [3, 7, 8], label: "4人用 + カウンター×2", tableCount: 3, waste: 0, requiresApproval: false },
  ],
};

export default function CombinationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query, combinations } = location.state ?? MOCK_STATE;

  // waste 昇順にソート（画面設計書の仕様）
  const sorted = [...combinations].sort((a, b) => a.waste - b.waste);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const hasMultiTable = sorted.some((c) => c.tableCount >= 2);

  function handleNext() {
    const selected = sorted[selectedIdx];
    navigate("/reserve/info", { state: { query, selected } });
  }

  return (
    <Layout active="reserve">
      <div style={ui.narrow}>
        <p style={s.crumb}>{query.reservationDate}　{query.timeSlotLabel}　{query.partySize}名</p>
        <h1 style={ui.h1}>ご利用いただける席の組み合わせ</h1>

        <div style={s.list}>
          {sorted.map((c, i) => {
            const on = i === selectedIdx;
            return (
              <button key={i} type="button" onClick={() => setSelectedIdx(i)}
                style={{ ...s.option, borderColor: on ? "var(--color-primary)" : "var(--color-border)",
                         boxShadow: on ? "0 0 0 1px var(--color-primary)" : "none" }}>
                <span style={s.radio}>{on ? "●" : "○"}</span>
                <span style={s.optBody}>
                  <span style={s.optTitle}>{c.label}</span>
                  <span style={s.optSub}>　{c.tableCount}卓・無駄{c.waste}席</span>
                  <span style={s.optTables}>テーブル: {c.tableIds.join(", ")}</span>
                </span>
              </button>
            );
          })}
        </div>

        {hasMultiTable && (
          <p style={s.warn}>⚠ 複数テーブルの場合、席が離れることがあります</p>
        )}

        <div style={ui.rowBtns}>
          <button type="button" style={ui.ghostBtn} onClick={() => navigate(-1)}>戻る</button>
          <button type="button" style={{ ...ui.primaryBtn, flex: 1 }} onClick={handleNext}>
            この席で予約へ進む
          </button>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  crumb: { fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 8px" },
  list: { display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" },
  option: {
    display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
    border: "1px solid var(--color-border)", borderRadius: "var(--radius)",
    background: "var(--color-bg)", cursor: "pointer",
  },
  radio: { color: "var(--color-primary)", fontSize: 14, lineHeight: 1.7 },
  optBody: { flex: 1, textAlign: "left" },
  optTitle: { fontWeight: 600, fontSize: 15 },
  optSub: { color: "var(--color-text-secondary)", fontSize: 13 },
  optTables: { display: "block", color: "var(--color-text-secondary)", fontSize: 12, marginTop: 4 },
  warn: { fontSize: 13, color: "#854F0B", background: "#FAEEDA", borderRadius: "var(--radius)", padding: "8px 12px", margin: "0 0 16px" },
};
