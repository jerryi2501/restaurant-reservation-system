// SC-C03 予約者情報入力画面 ／ 権限: GUEST / CUSTOMER
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 直接URLアクセス用フォールバック（本番では "/" へリダイレクト推奨）
const MOCK_STATE = {
  query: { reservationDate: "2026-07-01", timeSlotId: 2, timeSlotLabel: "第2部　13:30〜15:30", partySize: 6 },
  selected: { tableIds: [2, 5], label: "4人用 + 2人用", tableCount: 2, waste: 0, requiresApproval: false },
};

export default function ReservationInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query, selected } = location.state ?? MOCK_STATE;

  // TODO [AUTH]: ログイン済みなら GET /api/customers/me で氏名・電話を初期値に補完
  const [customerName, setCustomerName]   = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes]                 = useState("");

  const canNext = customerName.trim() && customerPhone.trim() && customerEmail.trim();

  function handleNext(e) {
    e.preventDefault();
    if (!canNext) return;
    navigate("/reserve/confirm", {
      state: { query, selected, customer: { customerName, customerPhone, customerEmail, notes } },
    });
  }

  return (
    <Layout active="reserve">
      <div className="max-w-[460px] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>予約者情報の入力</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNext} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">お名前</Label>
                <Input id="name" placeholder="山田 太郎"
                  value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input id="phone" type="tel" placeholder="090-1234-5678"
                  value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" placeholder="yamada@example.com"
                  value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">ご要望（任意）</Label>
                <Textarea id="notes" placeholder="アレルギー等あればご記入ください"
                  value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>戻る</Button>
                <Button type="submit" disabled={!canNext} className="flex-1">確認画面へ</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
