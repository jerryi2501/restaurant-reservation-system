// SC-C09 マイページ（ダッシュボード）/ 権限: CUSTOMER
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Coins, Award, Clock, CalendarPlus, Sparkles, ArrowRight } from "lucide-react";
import AccountLayout from "../../components/AccountLayout";
import RankMedals from "../../components/RankMedals";
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
              <span className="text-xs font-medium bg-white/20 rounded-full px-2 py-0.5">{profile.rank}会員</span>
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
        <CardContent className="flex items-center justify-between gap-4 pt-6 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
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
          <Link to="/" className={buttonVariants()}>
            空席を確認する<ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>

      {/* 統計タイル */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatTile icon={Coins} label="保有ポイント" value={`${profile.currentPoints} pt`} />
        <StatTile icon={Award} label="累計獲得"     value={`${profile.rankPoints} pt`} />
      </div>

      {/* 会員ランク（銅/銀/金メダル・ホバーで次ランクまでのpt） */}
      <RankMedals rank={profile.rank} points={profile.rankPoints} />
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
