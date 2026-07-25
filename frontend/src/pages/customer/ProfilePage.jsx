// SC-C09 マイページ（ダッシュボード）/ 権限: CUSTOMER
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Coins, Award, Clock, CalendarPlus, Sparkles, ArrowRight } from "lucide-react";
import AccountLayout from "../../components/AccountLayout";
import { Medal, tierByPoints } from "../../components/RankMedals";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getMyProfile, fetchTimeSlots } from "../../api/mockApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [slots, setSlots]     = useState([]);

  useEffect(() => {
    getMyProfile().then(setProfile);
    fetchTimeSlots().then((s) => setSlots(s.slice(0, 3)));
  }, []);

  if (!profile) {
    return (
      <AccountLayout>
        <p className="text-muted-foreground">読み込み中…</p>
      </AccountLayout>
    );
  }

  const tier = tierByPoints(profile.rankPoints); // 累計ptから現在ランクを算出

  return (
    <AccountLayout>
      <h1 className="text-2xl font-semibold mb-6">マイページ</h1>

      {/* ヒーロー：会員サマリー */}
      <div className="rounded-xl bg-primary text-primary-foreground p-6 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-white/15 flex items-center justify-center text-lg font-bold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold flex items-center gap-2 flex-wrap">
              {profile.name} 様
              {/* ランクは累計ptから算出＝ptが増えると自動で昇格。ホバーで次ランクまでのpt */}
              <span
                className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 rounded-full pl-1 pr-2 py-0.5"
                title={tier.next ? `あと${tier.remain.toLocaleString()}ptで${tier.next.label}会員` : "最高ランクです"}
              >
                <Medal c={tier.c} size={18} />
                {tier.label}会員
              </span>
            </p>
            <p className="text-sm text-white/80 mt-0.5">いつもご利用ありがとうございます</p>
          </div>
        </div>
        <Link to="/" className={buttonVariants({ variant: "secondary" })}>
          <CalendarPlus className="size-4" />予約する
        </Link>
      </div>

      {/* 次回予約への誘導 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold">次回のご予約はいかがですか？</p>
              <p className="text-sm text-muted-foreground mt-0.5 mb-2">
                お好きな日時の空席をリアルタイムでご確認いただけます。
              </p>
              <div className="flex flex-col gap-1">
                {slots.map((s) => (
                  <span key={s.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />{s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* ボタンは独立した行に置き、テキストと重ならないようにする。
              文字色は inline 指定（index.css の a{color} が layer より優先されるため） */}
          <div className="mt-4 flex justify-end">
            <Link to="/" className={buttonVariants()} style={{ color: "#fff" }}>
              空席を確認する<ArrowRight className="size-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 統計タイル */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatTile icon={Coins} label="保有ポイント" value={`${profile.currentPoints} pt`} />
        <StatTile icon={Award} label="累計獲得"     value={`${profile.rankPoints} pt`} />
      </div>
    </AccountLayout>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center gap-1 py-6">
        <Icon className="size-5 text-primary mb-1" />
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg font-bold">{value}</span>
      </CardContent>
    </Card>
  );
}
