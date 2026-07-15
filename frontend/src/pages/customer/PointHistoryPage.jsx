// SC-C11 ポイント履歴 / 権限: CUSTOMER
import { useEffect, useState } from "react";
import AccountLayout from "../../components/AccountLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getMyProfile, getPointHistory } from "../../api/mockApi";

export default function PointHistoryPage() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getMyProfile().then(setProfile);
    getPointHistory().then(setHistory);
  }, []);

  return (
    <AccountLayout>
      <h1 className="text-2xl font-semibold mb-6">ポイント履歴</h1>

      {/* サマリーカード2枚 */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">保有ポイント</p>
            <p className="text-2xl font-semibold">{profile?.currentPoints ?? "—"} pt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">累計獲得</p>
            <p className="text-2xl font-semibold">{profile?.rankPoints ?? "—"} pt</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead>内容</TableHead>
            <TableHead className="text-right">増減</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((h, i) => (
            <TableRow key={i}>
              <TableCell>{h.createdAt}</TableCell>
              <TableCell>{h.reason}</TableCell>
              <TableCell
                className={`text-right font-medium ${
                  h.type === "EARNED"
                    ? "text-[var(--status-occupied)]"   // 獲得=緑
                    : "text-[var(--status-cancelled)]"  // 使用=赤
                }`}
              >
                {h.type === "EARNED" ? "+" : "−"}{h.pointsAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AccountLayout>
  );
}
