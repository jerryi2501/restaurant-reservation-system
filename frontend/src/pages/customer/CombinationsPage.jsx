// SC-C02 テーブル組み合わせ選択画面 ／ 権限: GUEST / CUSTOMER
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Armchair, Check } from "lucide-react";
import Layout from "../../components/Layout";
import { Button } from "@/components/ui/button";

// 直接URLアクセス時のフォールバック（本番では "/" へリダイレクト推奨）
const MOCK_STATE = {
  query: { reservationDate: "2026-07-01", timeSlotId: 2, timeSlotLabel: "第2部 13:30〜15:30", partySize: 6 },
  combinations: [
    {
      tableIds: [8, 12], label: "4人用 + 2人用", tableCount: 2, waste: 0, requiresApproval: false,
      tables: [
        { tableId: 8, tableNumber: "B4-1", capacity: 4 },
        { tableId: 12, tableNumber: "A2-1", capacity: 2 },
      ],
    },
    {
      tableIds: [5, 6, 7], label: "2人用×3", tableCount: 3, waste: 0, requiresApproval: false,
      tables: [
        { tableId: 5, tableNumber: "B2-1", capacity: 2 },
        { tableId: 6, tableNumber: "B2-2", capacity: 2 },
        { tableId: 7, tableNumber: "B2-3", capacity: 2 },
      ],
    },
  ],
};

export default function CombinationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query, combinations } = location.state ?? MOCK_STATE;

  // waste 昇順にソート（画面設計書の仕様：無駄席が少ない順）
  const sorted = [...combinations].sort((a, b) => a.waste - b.waste);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const hasMultiTable = sorted.some((c) => c.tableCount >= 2);

  function handleNext() {
    navigate("/reserve/info", { state: { query, selected: sorted[selectedIdx] } });
  }

  return (
    <Layout active="reserve">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground mb-1">
          {query.reservationDate} ／ {query.timeSlotLabel} ／ {query.partySize}名
        </p>
        <h1 className="text-2xl font-semibold mb-5">ご利用いただける席の組み合わせ</h1>

        <div className="flex flex-col gap-3">
          {sorted.map((c, i) => {
            const on = i === selectedIdx;
            const tables = c.tables ?? [];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`text-left rounded-xl border p-4 transition ${
                  on
                    ? "border-primary ring-1 ring-primary bg-primary/5"
                    : "border-border hover:border-primary/40 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 選択マーク */}
                  <span
                    className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${
                      on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                    }`}
                  >
                    {on && <Check className="size-3.5" />}
                  </span>

                  {/* テーブルチップ：実際のテーブル番号 + 定員 */}
                  <div className="flex flex-wrap gap-2">
                    {tables.map((t) => (
                      <span
                        key={t.tableId}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm"
                      >
                        <Armchair className="size-4 text-primary" />
                        <span className="font-medium">{t.tableNumber}</span>
                        <span className="text-muted-foreground text-xs">{t.capacity}名</span>
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {hasMultiTable && (
          <p className="text-sm mt-4 rounded-lg px-3 py-2" style={{ color: "#854F0B", background: "#FAEEDA" }}>
            ⚠ 複数テーブルの場合、席が離れることがあります
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>戻る</Button>
          <Button type="button" className="flex-1" onClick={handleNext}>この席で予約へ進む</Button>
        </div>
      </div>
    </Layout>
  );
}
