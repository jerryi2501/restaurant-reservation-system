// 準備中ページ — 未実装コンテンツ（店舗案内・アクセス・よくある質問）の共通プレースホルダ
// props: title — 見出しに表示するページ名 ／ active — ヘッダーで強調するメニューキー
import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import Layout from "../components/Layout";
import { buttonVariants } from "@/components/ui/button";

export default function ComingSoonPage({ title, active }) {
  return (
    <Layout active={active}>
      <div className="max-w-md mx-auto py-16 text-center">
        <Construction className="size-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-8">
          このページは現在準備中です。公開までしばらくお待ちください。
        </p>
        <Link to="/" className={buttonVariants({ variant: "outline" })}>トップへ戻る</Link>
      </div>
    </Layout>
  );
}
