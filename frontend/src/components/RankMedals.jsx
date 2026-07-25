// 会員ランクを 銅/銀/金 メダルで表示するコンポーネント。
// ・現在ランクを強調（ネイビー枠 + 「現在」バッジ）
// ・現在ランクにマウスを乗せると「あと◯ptで次ランク」をツールチップ表示
// props: rank（現在ランク "BRONZE"|"SILVER"|"GOLD" または 日本語ラベル）, points（累計獲得pt）
import { Award } from "lucide-react";

const TIERS = [
  { key: "BRONZE", label: "ブロンズ", min: 0,    c: { main: "#E0A46A", dark: "#9C5A20", disc: "#EBBE90", rib: "#C77E3E", ribD: "#A9601F" } },
  { key: "SILVER", label: "シルバー", min: 1000, c: { main: "#CDD4DB", dark: "#8A939C", disc: "#E4E9ED", rib: "#B4BCC5", ribD: "#98A2AB" } },
  { key: "GOLD",   label: "ゴールド", min: 3000, c: { main: "#F4C951", dark: "#C79318", disc: "#FBE08C", rib: "#E6A817", ribD: "#C79318" } },
];

// 12角のロゼット（星形）パスを一度だけ生成
function buildStar() {
  const cx = 50, cy = 44, spikes = 12, outer = 32, inner = 25;
  let p = "", step = Math.PI / spikes, rot = -Math.PI / 2;
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outer, y = cy + Math.sin(rot) * outer;
    p += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1); rot += step;
    x = cx + Math.cos(rot) * inner; y = cy + Math.sin(rot) * inner;
    p += "L" + x.toFixed(1) + " " + y.toFixed(1); rot += step;
  }
  return p + "Z";
}
const STAR = buildStar();

function Medal({ c }) {
  return (
    <svg viewBox="0 0 100 138" width="46" height="63" aria-hidden="true">
      <path d="M40,52 L60,52 L60,112 L50,101 L40,112 Z" fill={c.rib} />
      <path d="M40,52 L50,52 L50,101 L40,112 Z" fill={c.ribD} />
      <path d={STAR} fill={c.main} />
      <path d={STAR} fill="none" stroke={c.dark} strokeWidth="1.5" />
      <circle cx="50" cy="44" r="20" fill={c.disc} stroke={c.dark} strokeWidth="2" />
      <circle cx="50" cy="44" r="14" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" />
      <ellipse cx="43" cy="36" rx="8" ry="5" fill="rgba(255,255,255,.35)" />
    </svg>
  );
}

export default function RankMedals({ rank, points = 0 }) {
  // 現在ランクの位置（英語キー / 日本語ラベルの両対応。見つからなければ最下位）
  let curIdx = TIERS.findIndex((t) => t.key === rank || t.label === rank);
  if (curIdx < 0) curIdx = 0;
  const next = TIERS[curIdx + 1];
  const remain = next ? Math.max(0, next.min - points) : 0;

  return (
    <div className="rounded-xl border border-border bg-background p-4 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <Award className="size-4 text-primary" />
        <span className="font-semibold text-sm">会員ランク</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TIERS.map((t, i) => {
          const cur = i === curIdx;
          return (
            <div
              key={t.key}
              className={`group relative rounded-lg text-center p-3 bg-muted/40 border ${cur ? "border-2 border-primary" : "border-border"}`}
            >
              {cur && (
                <span className="absolute top-1.5 right-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5">
                  現在
                </span>
              )}
              {/* ホバー時のツールチップ（現在ランク かつ 次がある場合のみ） */}
              {cur && next && (
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap rounded-md bg-slate-800 text-white text-xs px-2.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                  あと{remain.toLocaleString()}ptで{next.label}会員
                </span>
              )}
              <div className={`flex justify-center ${cur ? "" : "opacity-60"}`}>
                <Medal c={t.c} />
              </div>
              <div className="text-xs font-semibold mt-1">{t.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
