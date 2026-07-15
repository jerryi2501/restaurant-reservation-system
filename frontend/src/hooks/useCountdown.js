import { useEffect, useState } from "react";

const TOTAL_SEC = 10 * 60; // 受付期限10分（API設計書）

// expiresAt: ISO文字列。残り秒数・表示文字列・進捗率を返す。
export function useCountdown(expiresAt) {
  const calc = () => Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  const [remaining, setRemaining] = useState(calc);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(calc()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  return {
    remaining,
    mm:       String(Math.floor(remaining / 60)).padStart(2, "0"),
    ss:       String(remaining % 60).padStart(2, "0"),
    progress: Math.round((remaining / TOTAL_SEC) * 100),
    expired:  remaining === 0,
  };
}
